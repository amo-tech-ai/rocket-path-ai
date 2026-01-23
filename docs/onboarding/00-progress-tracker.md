# Onboarding System Progress Tracker

**Last Updated:** 2026-01-23  
**Edge Function:** `https://yvyesmiczbjqwbqtlidy.supabase.co/functions/v1/onboarding-agent`  
**Status:** Backend Verified ✅ | Frontend Implementation Pending ❌

---

## Schema Verification Summary

| Table | Status | Key Columns Verified |
|-------|--------|---------------------|
| `wizard_sessions` | ✅ Verified | `id`, `user_id`, `startup_id`, `current_step`, `status`, `form_data`, `ai_extractions`, `extracted_traction`, `extracted_funding` |
| `startups` | ✅ Verified | `name`, `description`, `industry`, `stage`, `website_url`, `traction_data`, `is_raising`, `raise_amount`, `key_features`, `business_model`, `target_customers` |
| `tasks` | ✅ Verified | `startup_id`, `title`, `description`, `priority`, `status`, `category`, `ai_generated`, `ai_source` |
| `profiles` | ✅ Verified | `id`, `org_id`, `full_name`, `email` |

---

## Prompt Implementation Status

| # | Prompt | Backend | Frontend | AI Agent | Status | % |
|---|--------|---------|----------|----------|--------|---|
| 01 | Wizard Layout & Setup | ✅ `wizard_sessions` table | ❌ `OnboardingWizard.tsx` | N/A | Not Started | 0% |
| 02 | Step 1: Profile & Business | ✅ `enrich_url` action | ❌ `Step1Profile.tsx` | ✅ ProfileExtractor | Not Started | 0% |
| 03 | Step 2: Traction & Funding | ✅ `update_session` action | ❌ `Step2Traction.tsx` | N/A | Not Started | 0% |
| 04 | Step 3: Review & Generate | ✅ `complete_wizard` action | ❌ `Step3Review.tsx` | ⚠️ TaskGenerator | Backend Partial | 25% |
| 05 | Wizard AI Panel | ✅ Edge function ready | ❌ `WizardAIPanel.tsx` | ✅ Gemini models | Not Started | 0% |
| 06 | Hooks Integration | ✅ Supabase + React Query | ❌ `useWizardSession.ts` | N/A | Not Started | 0% |
| 07 | Dashboard Integration | ⚠️ Needs fixes | ❌ Redirect logic | N/A | Backend Issues | 10% |

---

## Backend Action Verification

| Action | Edge Function | Status | Notes |
|--------|---------------|--------|-------|
| `create_session` | `onboarding-agent` | ✅ Available | Creates new wizard session |
| `get_session` | `onboarding-agent` | ✅ Available | Loads existing session |
| `update_session` | `onboarding-agent` | ✅ Available | Auto-save form data |
| `enrich_url` | `onboarding-agent` | ✅ Available | Gemini URL Context extraction |
| `enrich_context` | `onboarding-agent` | ✅ Available | Gemini description extraction |
| `complete_wizard` | `onboarding-agent` | ⚠️ Partial | Saves startup, tasks TBD |
| `get_extraction` | `onboarding-agent` | ✅ Available | Retrieve AI extractions |

---

## Field Mapping Verification

### Step 1 → Startups Table

| Wizard Field | `form_data` Key | Startups Column | DB Type | Verified |
|--------------|-----------------|-----------------|---------|----------|
| Company Name | `name` | `name` | `text NOT NULL` | ✅ |
| Website URL | `website_url` | `website_url` | `text` | ✅ |
| Description | `description` | `description` | `text` | ✅ |
| Industry | `industry` | `industry` | `text` | ✅ |
| Key Features | `key_features[]` | `key_features` | `text[]` | ✅ |
| Tagline | `tagline` | `tagline` | `text` | ✅ |
| Business Model | `business_model` | `business_model` | `text[]` | ✅ |
| Target Customers | `target_customers[]` | `target_customers` | `text[]` | ✅ |

### Step 2 → Startups Table

| Wizard Field | `extracted_traction` Key | Startups Column | DB Type | Verified |
|--------------|--------------------------|-----------------|---------|----------|
| MRR | `current_mrr` | `traction_data->mrr` | `jsonb` | ✅ |
| Users | `users` | `traction_data->users` | `jsonb` | ✅ |
| Growth Rate | `growth_rate` | `traction_data->growth_rate_monthly` | `jsonb` | ✅ |
| Is Raising | `is_raising` | `is_raising` | `boolean` | ✅ |
| Target Raise | `target_amount` | `raise_amount` | `numeric(12,2)` | ✅ |
| Stage | `stage` | `stage` | `text` | ✅ |

---

## Known Issues

| Issue | Severity | Status | Location |
|-------|----------|--------|----------|
| Task generation not implemented | 🔴 High | Open | `complete_wizard` action |
| Only 4 fields saved to startups | 🔴 High | Open | `complete_wizard` action |
| Dashboard no wizard check | 🟡 Medium | Open | `Dashboard.tsx` |
| useStartup query not user-specific | 🟡 Medium | Open | `useDashboardData.ts` |
| No redirect if wizard complete | 🟡 Medium | Open | `OnboardingWizard.tsx` |

---

## Files to Create

| File | Type | Status | Priority |
|------|------|--------|----------|
| `src/pages/OnboardingWizard.tsx` | Page | ❌ | P0 |
| `src/components/onboarding/WizardLayout.tsx` | Component | ❌ | P0 |
| `src/components/onboarding/StepProgress.tsx` | Component | ❌ | P0 |
| `src/components/onboarding/Step1Profile.tsx` | Component | ❌ | P0 |
| `src/components/onboarding/Step2Traction.tsx` | Component | ❌ | P0 |
| `src/components/onboarding/Step3Review.tsx` | Component | ❌ | P0 |
| `src/components/onboarding/WizardAIPanel.tsx` | Component | ❌ | P1 |
| `src/components/onboarding/ExtractionDisplay.tsx` | Component | ❌ | P1 |
| `src/components/onboarding/TaskPreview.tsx` | Component | ❌ | P1 |
| `src/hooks/useWizardSession.ts` | Hook | ❌ | P0 |
| `src/hooks/useOnboardingAgent.ts` | Hook | ❌ | P0 |

---

## Implementation Order

1. **Phase 1: Hooks** (P0)
   - `useWizardSession.ts` - Session management
   - `useOnboardingAgent.ts` - Edge function integration

2. **Phase 2: Layout** (P0)
   - `OnboardingWizard.tsx` - Main page
   - `WizardLayout.tsx` - 3-panel structure
   - `StepProgress.tsx` - Left panel

3. **Phase 3: Step Forms** (P0)
   - `Step1Profile.tsx` - Profile form
   - `Step2Traction.tsx` - Metrics form
   - `Step3Review.tsx` - Review screen

4. **Phase 4: AI Panel** (P1)
   - `WizardAIPanel.tsx` - Right panel
   - `ExtractionDisplay.tsx` - AI results
   - `TaskPreview.tsx` - Generated tasks

5. **Phase 5: Integration** (P0)
   - Add `/onboarding` route
   - Dashboard redirect logic
   - Fix `useStartup` query
