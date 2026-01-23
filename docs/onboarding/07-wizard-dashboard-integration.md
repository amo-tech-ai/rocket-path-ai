# Prompt 07 — Wizard ↔ Dashboard Integration

**Purpose:** Fix wizard-dashboard integration and ensure proper data flow  
**Status:** 🔴 Backend Issues | Frontend Pending  
**Priority:** P0 — Critical Blocker  
**Depends on:** Backend fixes in Prompt 04

---

## Current Issues

| Issue | Severity | Status | Location |
|-------|----------|--------|----------|
| Task generation not implemented | 🔴 High | Open | `complete_wizard` |
| Only 4 fields saved to startups | 🔴 High | Open | `complete_wizard` |
| Dashboard no wizard check | 🟡 Medium | Open | `Dashboard.tsx` |
| useStartup not user-specific | 🟡 Medium | Open | `useDashboardData.ts` |
| No redirect if wizard complete | 🟡 Medium | Open | `OnboardingWizard.tsx` |

---

## Data Flow Analysis

### Current Flow (Broken)

```
Wizard Completion
  ↓
complete_wizard action
  ↓
Creates startup ✅ (only 4 fields)
Marks session completed ✅
Returns startup_id ✅
  ↓
Redirects to /dashboard ✅
  ↓
Dashboard loads
  ↓
useStartup() queries startups ❌ (wrong query)
useTasks() queries tasks ❌ (no tasks exist)
  ↓
Dashboard shows empty/incomplete data ❌
```

### Expected Flow (Fixed)

```
Wizard Completion
  ↓
complete_wizard action
  ↓
Creates startup ✅ (ALL fields)
Generates 5 tasks ✅
Saves tasks ✅
Marks session completed ✅
Returns { startup_id, tasks } ✅
  ↓
Redirects to /dashboard ✅
  ↓
Dashboard checks wizard completion ✅
  ↓
useStartup() queries by user_id ✅
useTasks() loads generated tasks ✅
  ↓
Dashboard shows complete data ✅
```

---

## Backend Fixes Required

### Fix 1: Save Complete Startup Data

**File:** `supabase/functions/onboarding-agent/index.ts`

Currently saves:
- ✅ `name`
- ✅ `description`
- ✅ `industry`
- ✅ `stage`

Missing fields:
- ❌ `website_url`
- ❌ `tagline`
- ❌ `business_model` (array)
- ❌ `target_customers` (array)
- ❌ `key_features` (array)
- ❌ `traction_data` (jsonb)
- ❌ `is_raising`
- ❌ `raise_amount`

### Fix 2: Add Task Generation

After startup creation, add:
1. Generate 5 tasks via Gemini
2. Save tasks to `tasks` table
3. Return tasks in response

---

## Frontend Fixes Required

### Fix 3: Dashboard Wizard Check

**File:** `src/pages/Dashboard.tsx`

```typescript
// Add wizard completion check
const { session, isLoading: sessionLoading } = useWizardSession();

useEffect(() => {
  if (!sessionLoading && session) {
    const isComplete = session.status === 'completed' && session.startup_id;
    if (!isComplete) {
      navigate('/onboarding');
    }
  }
}, [session, sessionLoading, navigate]);
```

### Fix 4: Fix useStartup Query

**File:** `src/hooks/useDashboardData.ts`

```typescript
// Get user's startup via wizard session first
async function getUserStartup(userId: string) {
  // 1. Try wizard session first (most reliable)
  const { data: session } = await supabase
    .from('wizard_sessions')
    .select('startup_id')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .not('startup_id', 'is', null)
    .single();

  if (session?.startup_id) {
    return supabase.from('startups').select('*').eq('id', session.startup_id).single();
  }

  // 2. Fallback to org_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', userId)
    .single();

  if (profile?.org_id) {
    return supabase.from('startups').select('*').eq('org_id', profile.org_id).single();
  }

  return { data: null };
}
```

**CRITICAL:** Never use `.limit(1)` without filtering — this can return wrong user's data.

### Fix 5: Wizard Redirect Logic

**File:** `src/pages/OnboardingWizard.tsx`

```typescript
// Redirect if wizard already completed
useEffect(() => {
  if (!isLoading && session?.status === 'completed') {
    navigate('/dashboard');
  }
}, [session, isLoading, navigate]);
```

---

## Profile Pages Integration

### Company Profile (`/company-profile`)

**Data Source:** `startups` table via `useUserStartup()`

**Wizard Populates (when fixed):**
- ✅ `name` (Step 1)
- ✅ `description` (Step 1)
- ✅ `industry` (Step 1)
- ✅ `website_url` (Step 1) — needs backend fix
- ✅ `key_features` (Step 1) — needs backend fix
- ✅ `traction_data` (Step 2) — needs backend fix
- ✅ `stage` (Step 2)
- ✅ `is_raising` (Step 2) — needs backend fix
- ✅ `raise_amount` (Step 2) — needs backend fix

### User Profile (`/user-profile`)

**Status:** ❌ NOT POPULATED BY WIZARD

User profile is separate and populated by:
- Google OAuth (name, email, avatar)
- Manual user entry (bio, preferences)

---

## Redirect Logic Summary

### Dashboard → Onboarding

```typescript
// In Dashboard.tsx
if (!sessionLoading && (!session || session.status !== 'completed' || !session.startup_id)) {
  navigate('/onboarding');
}
```

### Onboarding → Dashboard

```typescript
// In OnboardingWizard.tsx
if (!isLoading && session?.status === 'completed' && session?.startup_id) {
  navigate('/dashboard');
}
```

---

## Integration Checklist

### Backend Fixes
- [ ] Save complete startup data in `complete_wizard`
- [ ] Add TaskGenerator to `complete_wizard`
- [ ] Return tasks in response

### Frontend Fixes
- [ ] Add wizard check to Dashboard
- [ ] Add redirect logic to Dashboard
- [ ] Fix `useStartup()` query
- [ ] Add redirect to OnboardingWizard

### Verification
- [ ] Wizard creates complete startup
- [ ] Wizard generates 5 tasks
- [ ] Dashboard redirects if incomplete
- [ ] Dashboard loads correct startup
- [ ] Dashboard shows tasks
- [ ] Wizard redirects if complete

---

## Success Criteria

- ✅ Wizard saves ALL collected fields to `startups` table
- ✅ `complete_wizard` generates 5 tasks
- ✅ Tasks saved to `tasks` table with `startup_id`
- ✅ Dashboard checks wizard completion on load
- ✅ Dashboard redirects to wizard if incomplete
- ✅ Dashboard loads user's startup (not random)
- ✅ Dashboard displays generated tasks
- ✅ Wizard redirects to dashboard if already completed
- ✅ No data leakage between users
- ✅ CompanyProfile displays wizard data correctly
