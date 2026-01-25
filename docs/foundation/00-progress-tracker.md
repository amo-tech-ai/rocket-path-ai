# Foundation Progress Tracker

**Last Updated:** 2026-01-25  
**Status:** ✅ Verified Against Supabase  
**Edge Function:** `onboarding-agent` (11 actions)  
**AI Model:** `gemini-2.0-flash` (primary)

---

## Supabase Truth Reference (Verified)

### wizard_sessions Table
| Column | Type | Nullable | Purpose |
|--------|------|----------|---------|
| `id` | uuid | NO | Primary key |
| `user_id` | uuid | NO | FK to auth.users |
| `startup_id` | uuid | YES | FK to startups (set on completion) |
| `current_step` | integer | YES | Current wizard step (1-4) |
| `status` | text | YES | 'in_progress' / 'completed' / 'abandoned' |
| `form_data` | jsonb | YES | All form inputs |
| `ai_extractions` | jsonb | YES | AI-detected fields from URL enrichment |
| `interview_answers` | jsonb | YES | Array of question answers |
| `extracted_traction` | jsonb | YES | Traction metrics from interview |
| `extracted_funding` | jsonb | YES | Funding info from interview |
| `signals` | text[] | YES | Extracted signals array (max 20) |
| `profile_strength` | integer | YES | Readiness score (0-100) |
| `investor_score` | integer | YES | Investor score (0-100) |
| `ai_summary` | jsonb | YES | AI-generated summary |
| `interview_progress` | integer | YES | Interview completion percentage |
| `enrichment_sources` | text[] | YES | Sources used for enrichment |
| `enrichment_confidence` | integer | YES | AI confidence score |
| `grounding_metadata` | jsonb | YES | Grounding metadata from Gemini |
| `started_at` | timestamptz | YES | Session start time |
| `completed_at` | timestamptz | YES | Session completion time |
| `last_activity_at` | timestamptz | YES | Last activity timestamp |

### startups Table (Key Columns)
| Column | Type | Purpose |
|--------|------|---------|
| `id` | uuid | Primary key |
| `org_id` | uuid | FK to organizations |
| `name` | text | Company name |
| `description` | text | Company description |
| `industry` | text | Primary industry |
| `stage` | text | Startup stage |
| `business_model` | text[] | Business models |
| `target_market` | text | Target market |
| `traction_data` | jsonb | Traction metrics |
| `is_raising` | boolean | Fundraising status |
| `profile_strength` | integer | Profile score |
| `investor_ready_score` | integer | Investor readiness |

### Database Functions (Atomic Transactions)
| Function | Purpose | Status |
|----------|---------|--------|
| `process_answer_atomic` | Atomic answer save (interview) | ✅ Verified |
| `complete_wizard_atomic` | Atomic completion (startup + org + tasks) | ✅ Verified |

---

## Edge Function Actions (Verified)

| Action | Purpose | AI Model | Status |
|--------|---------|----------|--------|
| `create_session` | Create new wizard session | N/A | ✅ |
| `update_session` | Update form_data/current_step | N/A | ✅ |
| `enrich_url` | Extract company data from URL | gemini-2.0-flash | ✅ |
| `enrich_context` | Extract from description | gemini-2.0-flash | ✅ |
| `enrich_founder` | Extract founder data | N/A (stub) | ⚠️ |
| `calculate_readiness` | Calculate readiness score | gemini-2.0-flash | ✅ |
| `get_questions` | Get interview questions (5) | N/A | ✅ |
| `process_answer` | Process answer, extract signals | N/A | ✅ |
| `calculate_score` | Calculate investor score | gemini-2.0-flash | ✅ |
| `generate_summary` | Generate AI summary | gemini-2.0-flash | ✅ |
| `complete_wizard` | Complete wizard (atomic) | N/A | ✅ |

---

## Feature Progress Summary

| Step | Screen | Agent Action | Status | % |
|------|--------|--------------|--------|---|
| 1 | Context & Enrichment | `enrich_url`, `enrich_context` | ✅ Complete | 100% |
| 2 | AI Analysis | `calculate_readiness` | ✅ Complete | 100% |
| 3 | Smart Interview | `get_questions`, `process_answer` | ✅ Complete | 100% |
| 4 | Review & Complete | `calculate_score`, `generate_summary`, `complete_wizard` | ✅ Complete | 100% |

---

## Gemini Model Configuration

| Model | Purpose | Fallback |
|-------|---------|----------|
| `gemini-2.0-flash` | Primary model (all actions) | - |
| `gemini-3-flash-preview` | Planned upgrade | gemini-2.0-flash |
| `gemini-1.5-flash` | Legacy fallback | - |

### Model Features Used
- URL Context (`urlContext`) - For URL enrichment
- JSON response mode (`responseMimeType: "application/json"`)
- Temperature: 0.2-0.5 depending on action

---

## 3 Tool Gemini Verification

| Tool | Status | Notes |
|------|--------|-------|
| **URL Context** | ✅ Active | Used in `enrich_url` action |
| **Google Search** | ⚠️ Not Active | Documented but not implemented |
| **JSON Response** | ✅ Active | All Gemini calls use JSON mode |

---

## Frontend Components (Verified)

| Component | Location | Status |
|-----------|----------|--------|
| `WizardLayout` | `src/components/onboarding/WizardLayout.tsx` | ✅ |
| `StepProgress` | `src/components/onboarding/StepProgress.tsx` | ✅ |
| `WizardAIPanel` | `src/components/onboarding/WizardAIPanel.tsx` | ✅ |
| `Step1Context` | `src/components/onboarding/step1/Step1Context.tsx` | ✅ |
| `Step2Analysis` | `src/components/onboarding/step2/Step2Analysis.tsx` | ✅ |
| `Step3Interview` | `src/components/onboarding/step3/Step3Interview.tsx` | ✅ |
| `Step4Review` | `src/components/onboarding/step4/Step4Review.tsx` | ✅ |

---

## Hooks (Verified)

| Hook | Location | Purpose |
|------|----------|---------|
| `useWizardSession` | `src/hooks/useWizardSession.ts` | Session management |
| `useOnboardingAgent` | `src/hooks/useOnboardingAgent.ts` | AI agent calls |

---

## Known Issues

| Issue | Severity | Status |
|-------|----------|--------|
| `enrich_founder` is a stub | Low | Open |
| Google Search tool not active | Low | Open |
| `gemini-3-flash-preview` not yet used | Info | Planned |

---

## Verification Checklist

### Backend ✅
- [x] wizard_sessions table exists with all columns
- [x] startups table exists with required columns
- [x] RPC functions exist (process_answer_atomic, complete_wizard_atomic)
- [x] Edge function deployed with 11 actions
- [x] Gemini API key configured

### Frontend ✅
- [x] WizardLayout 3-panel structure
- [x] All 4 step components exist
- [x] Hooks for session and agent calls
- [x] Auto-save to form_data

### AI Integration ✅
- [x] URL enrichment works
- [x] Context enrichment works
- [x] Readiness score calculation works
- [x] Investor score calculation works
- [x] Summary generation works

---

## Quick Reference

**Edge Function URL:**
```
https://yvyesmiczbjqwbqtlidy.supabase.co/functions/v1/onboarding-agent
```

**Supabase Project ID:** `yvyesmiczbjqwbqtlidy`

**Database Tables:**
- `wizard_sessions` - Onboarding session data
- `startups` - Created startup profiles
- `organizations` - User organizations
- `profiles` - User profiles
- `tasks` - Generated tasks
- `ai_runs` - AI run logging

---

*Generated: 2026-01-25*
*Verified against production Supabase schema*
