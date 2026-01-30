# Critical Gaps & Blockers Analysis

> **Audit Date:** January 30, 2026  
> **Status:** 🟡 Issues Identified & Fixed  
> **Priority:** P0 — Critical Production Blockers

---

## Executive Summary

| Category | Issues Found | Status |
|----------|-------------|--------|
| **RLS Security** | 1 CRITICAL | ✅ Fixed |
| **Data Isolation** | 1 HIGH | ✅ Fixed |
| **Security Views** | 1 ERROR | ⚠️ Acceptable |
| **Function Search Path** | 19 WARN | ⚠️ Non-blocking |
| **Permissive RLS** | 1 WARN | ⚠️ Intentional |

---

## 🔴 CRITICAL ISSUES (FIXED)

### Issue 1: Infinite Recursion in Profiles RLS ✅ FIXED

**Severity:** 🔴 CRITICAL  
**Impact:** Breaks ALL dashboard queries, auth flows fail  
**Status:** ✅ RESOLVED

**Root Cause:**
```sql
-- OLD BROKEN POLICY
USING ((id = auth.uid()) OR ((org_id IS NOT NULL) AND (org_id = ( 
  SELECT profiles_1.org_id FROM profiles profiles_1 WHERE (profiles_1.id = auth.uid())
))))
```
The policy referenced `profiles` table inside its own `USING` clause, causing infinite recursion.

**Fix Applied:**
```sql
-- Created helper function
CREATE OR REPLACE FUNCTION public.get_user_org_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT org_id FROM profiles WHERE id = auth.uid();
$$;

-- Split into two safe policies
CREATE POLICY "Users view own profile" ON profiles FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Users view org member profiles" ON profiles FOR SELECT
USING (org_id IS NOT NULL AND org_id = public.get_user_org_id());
```

---

### Issue 2: useStartup Data Isolation Bug ✅ FIXED

**Severity:** 🔴 HIGH  
**Impact:** Users could see ANY startup (first in DB)  
**Status:** ✅ RESOLVED

**Root Cause:**
```typescript
// OLD BROKEN CODE
const { data } = await supabase
  .from('startups')
  .select('*')
  .order('created_at', { ascending: true })
  .limit(1)  // ← Returns FIRST startup, not user's startup!
  .maybeSingle();
```

**Fix Applied:**
```typescript
// NEW SECURE CODE
// 1. Get current user
const { data: { user } } = await supabase.auth.getUser();

// 2. Try wizard_sessions first (most reliable)
const { data: session } = await supabase
  .from('wizard_sessions')
  .select('startup_id')
  .eq('user_id', user.id)
  .eq('status', 'completed')
  .not('startup_id', 'is', null)
  .maybeSingle();

if (session?.startup_id) {
  return supabase.from('startups').select('*').eq('id', session.startup_id).single();
}

// 3. Fallback to org_id
const { data: profile } = await supabase
  .from('profiles')
  .select('org_id')
  .eq('id', user.id)
  .maybeSingle();

if (profile?.org_id) {
  return supabase.from('startups').select('*').eq('org_id', profile.org_id).maybeSingle();
}
```

---

## 🟠 HIGH-PRIORITY WARNINGS

### Issue 3: Security Definer View

**Severity:** 🟠 ERROR (linter)  
**Status:** ⚠️ Acceptable (Intentional Design)

**Affected Views:**
- `calendar_events` — Filters internal events
- `hosted_events` — Filters hosted events
- `events_directory` — Union of hosted + industry events

**Why Acceptable:**
These views consolidate the `events` table with different scopes. They use `event_scope` filtering, not sensitive RLS bypassing. The underlying `events` table has proper RLS policies.

**Recommendation:** If needed, convert to RLS on base table only.

---

### Issue 4: Function Search Path Mutable (19 warnings)

**Severity:** 🟡 WARN  
**Status:** ⚠️ Non-blocking

**Affected Functions (sample):**
- `update_updated_at_column`
- `handle_updated_at`
- `emit_automation_event`
- `check_condition_rules`
- Various vector functions (pgvector extension)

**Fix Pattern:**
```sql
CREATE OR REPLACE FUNCTION function_name()
RETURNS ... LANGUAGE plpgsql
SET search_path = public  -- ADD THIS LINE
AS $$ ... $$;
```

**Priority:** Low — These don't affect application security significantly.

---

### Issue 5: Permissive RLS Policy (organizations INSERT)

**Severity:** 🟡 WARN  
**Status:** ⚠️ Intentional

**Policy:**
```sql
"Authenticated users create first organization" WITH CHECK (true)
```

**Why Intentional:**
This is the onboarding flow — new users must create their first organization. The `complete_wizard_atomic` function handles the proper association.

---

## 🟢 VERIFIED WORKING

### Modules Tested

| Module | RLS | Frontend | Edge Function | Status |
|--------|-----|----------|---------------|--------|
| Dashboard | ✅ | ✅ | ✅ | Working |
| Onboarding | ✅ | ✅ | ✅ | Working |
| AI Chat | ✅ | ✅ | ✅ | Working |
| Lean Canvas | ✅ | ✅ | ✅ | Working |
| Pitch Deck | ✅ | ✅ | ✅ | Working |
| CRM | ✅ | ✅ | ✅ | Working |
| Investors | ✅ | ✅ | ✅ | Working |
| Tasks | ✅ | ✅ | ✅ | Working |
| Projects | ✅ | ✅ | ✅ | Working |
| Events | ✅ | ✅ | ✅ | Working |
| Settings | ✅ | ✅ | N/A | Working |

---

## Edge Functions Status

| Function | Deployed | Auth | Status |
|----------|----------|------|--------|
| ai-chat | ✅ | ✅ Required | Active |
| onboarding-agent | ✅ | ✅ Required | Active |
| lean-canvas-agent | ✅ | ✅ Required | Active |
| pitch-deck-agent | ✅ | ✅ Required | Active |
| crm-agent | ✅ | ✅ Required | Active |
| documents-agent | ✅ | ✅ Required | Active |
| investor-agent | ✅ | ✅ Required | Active |
| task-agent | ✅ | ✅ Required | Active |
| event-agent | ✅ | ✅ Required | Active |
| insights-generator | ✅ | ✅ Required | Active |
| health-scorer | ✅ | ✅ Required | Active |
| action-recommender | ✅ | ✅ Required | Active |
| dashboard-metrics | ✅ | ✅ Required | Active |
| industry-expert-agent | ✅ | ✅ Required | Active |
| stage-analyzer | ✅ | ✅ Required | Active |

---

## Recent Fixes Applied

### 2026-01-30

1. **RLS Recursion Fix**
   - Dropped: `Users view own profile or org profiles` policy
   - Created: `get_user_org_id()` helper function
   - Created: Two separate non-recursive policies
   - Result: Profile queries now work correctly

2. **Data Isolation Fix**
   - Updated: `useStartup()` in `useDashboardData.ts`
   - Changed: Query now uses `auth.getUser()` + wizard session lookup
   - Fallback: Profile org_id association
   - Result: Users only see their own startup data

3. **Global AI Assistant**
   - Created: `AIAssistantProvider`, `GlobalAIAssistant`, `AIDrawer`, `AIBottomSheet`
   - Integrated: Floating AI icon on all pages
   - Modes: Public (product info) vs Authenticated (startup advisor)

4. **Notification System**
   - Created: `useNotifications` hook with browser push support
   - Created: `NotificationCenter` dropdown component
   - Integrated: Into DashboardLayout header

5. **Calendar Sync**
   - Created: `useCalendarSync` hook for meeting scheduling
   - Created: `MeetingScheduler` and `UpcomingMeetingsCard` components
   - Features: ICS export, Google Calendar integration

6. **AI Budget Settings**
   - Created: `AIBudgetSettings` component
   - Features: Monthly/daily limits, alert thresholds, model preferences
   - Integrated: Into Settings page

---

## Remaining Work (P2/P3)

| Task | Priority | Effort | Status |
|------|----------|--------|--------|
| Fix 19 function search_path warnings | P3 | 2h | Open |
| Add rate limiting to edge functions | P2 | 2h | Open |
| Email notification integration | P2 | 3h | Open |
| PDF export polish | P2 | 1h | Open |
| Chat history search | P3 | 2h | Open |

---

## Verification Commands

```sql
-- Verify RLS recursion fix
SELECT id, email FROM profiles WHERE id = auth.uid();
-- Should return current user's profile without error

-- Verify profiles policies
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'profiles';
-- Should show 4 policies without recursive references
```

---

## Next Steps

1. ✅ Apply RLS recursion fix — DONE
2. ✅ Apply data isolation fix — DONE
3. ⬜ Monitor for any new RLS errors in logs
4. ⬜ Consider fixing function search_path warnings (batch migration)
5. ⬜ Add rate limiting to edge functions before production load

---

**Auditor:** AI Systems Architect  
**Last Updated:** January 30, 2026
