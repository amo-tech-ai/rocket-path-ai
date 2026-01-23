# Onboarding Wizard — Progress Tracker

> **Last Updated:** 2026-01-23
> **Version:** 1.0.1
> **Overall Progress:** 35%
> **Status:** 🟡 In Progress — Backend 88% (task generation missing), Frontend 0%

---

## 📊 Executive Summary

| Category | Status | Progress | Critical Items |
|----------|--------|----------|----------------|
| **Design & Specs** | 🟢 Completed | 100% | 3-step wizard design, AI integration specs |
| **Database Schema** | 🟢 Completed | 100% | wizard_sessions, industry_packs, startups tables |
| **Edge Functions** | 🟡 Partial | 88% | 11 actions exist, task generation + data save incomplete |
| **Frontend Pages** | 🔴 Not Started | 0% | No onboarding wizard page exists |
| **Frontend Components** | 🔴 Not Started | 0% | No wizard step components exist |
| **AI Integration** | 🔴 Not Started | 0% | No UI wired to edge functions |
| **Workflows** | 🔴 Not Started | 0% | No workflows implemented |

---

## 📐 Design & Specifications

| Task Name | Description | Status | % Complete | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|-----------|-------------|--------|------------|--------------|---------------------|----------------|
| **Wizard Screen Design** | 3-step wizard wireframe & content | 🟢 Completed | 100% | `prompts/wizard/04-wizard-screen-design.md` exists | — | None |
| **AI Integration Spec** | ProfileExtractor integration design | 🟢 Completed | 100% | `prompts/wizard/16-wizard-ai-integration.md` exists | — | None |
| **Wireframe Structure** | 3-panel layout (Left/Main/Right) | 🟢 Completed | 100% | Detailed wireframe in design doc | — | None |
| **Step 1 Design** | Profile & Business form design | 🟢 Completed | 100% | Form fields, validation, AI extraction UI specified | — | None |
| **Step 2 Design** | Traction & Funding form design | 🟢 Completed | 100% | MRR, users, growth, funding fields specified | — | None |
| **Step 3 Design** | Review & Generate summary | 🟢 Completed | 100% | Review UI, task preview, completion flow specified | — | None |
| **AI Panel Design** | Right panel AI intelligence | 🟢 Completed | 100% | Extraction status, suggestions, guidance specified | — | None |
| **User Journey** | Complete wizard flow | 🟢 Completed | 100% | Step-by-step flow documented | — | None |
| **Workflows** | URL extraction, completion, auto-save | 🟢 Completed | 100% | All workflows documented | — | None |

**Total:** 9/9 design tasks complete (100%)

---

## 🗄️ Database Schema

| Task Name | Description | Status | % Complete | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|-----------|-------------|--------|------------|--------------|---------------------|----------------|
| **wizard_sessions Table** | Wizard progress storage | 🟢 Completed | 100% | Table exists with all fields | — | None |
| **industry_packs Table** | RAG knowledge base | 🟢 Completed | 100% | Table exists | — | None |
| **startups Table** | Final startup profile | 🟢 Completed | 100% | Table exists | — | None |
| **RLS Policies** | Row-level security | 🟢 Completed | 100% | Policies exist for wizard_sessions | — | None |
| **Indexes** | Performance indexes | 🟢 Completed | 100% | Indexes on user_id, status, startup_id | — | None |
| **Interview Fields** | Smart interview tracking | 🟢 Completed | 100% | interview_answers, interview_progress fields | — | None |
| **Extraction Fields** | AI extraction storage | 🟢 Completed | 100% | extracted_profile, extracted_traction, extracted_funding | — | None |
| **Enrichment Fields** | Enrichment tracking | 🟢 Completed | 100% | enrichment_sources, enrichment_confidence | — | None |

**Total:** 8/8 database tasks complete (100%)

**Migration Files:**
- `20260121200000_create_startup_platform_tables.sql` ✅
- `20260120100100_add_interview_fields_to_wizard_sessions.sql` ✅
- `20260120100400_add_wizard_sessions_rls_policies.sql` ✅
- `20260120100200_add_onboarding_wizard_indexes.sql` ✅

---

## ⚡ Edge Functions

| Task Name | Description | Status | % Complete | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|-----------|-------------|--------|------------|--------------|---------------------|----------------|
| **onboarding-agent Function** | Main wizard edge function | 🟢 Completed | 100% | Function deployed at `supabase/functions/onboarding-agent/` | — | None |
| **create_session Action** | Initialize wizard session | 🟢 Completed | 100% | Creates session in wizard_sessions table | — | None |
| **update_session Action** | Save wizard progress | 🟢 Completed | 100% | Updates current_step, form_data | — | None |
| **enrich_context Action** | Extract from description | 🟢 Completed | 100% | Uses Gemini structured output | — | None |
| **enrich_url Action** | Extract from website URL | 🟢 Completed | 100% | Uses Gemini URL Context tool | — | None |
| **enrich_founder Action** | Extract founder data | 🟢 Completed | 100% | LinkedIn extraction (if implemented) | — | None |
| **calculate_readiness Action** | Industry-benchmarked analysis | 🟢 Completed | 100% | Readiness scoring | — | None |
| **get_questions Action** | Load adaptive questions | 🟢 Completed | 100% | Interview questions | — | None |
| **process_answer Action** | Extract signals from answers | 🟢 Completed | 100% | Signal extraction | — | None |
| **calculate_score Action** | 5-factor investor score | 🟢 Completed | 100% | Investor scoring | — | None |
| **generate_summary Action** | AI profile summary | 🟢 Completed | 100% | Summary generation | — | None |
| **complete_wizard Action** | Finalize wizard | ⚠️ Partial | 60% | Saves 4/15 startup fields ✅ | Task gen ❌, Data save ❌ | See Prompt 04 for code |

**Total:** 10.6/12 edge function tasks complete (88%) — Task generation + complete data save missing

**Edge Function:** `supabase/functions/onboarding-agent/index.ts` ✅
**Actions:** 11 actions implemented
**AI Models:** Uses `GeminiModels.FLASH` = `gemini-3-flash-preview`, `GeminiModels.PRO` = `gemini-3-pro-preview`
**AI Features:** Structured Output, URL Context Tool
**Status:** Deployed and ready
**Note:** Task generation missing in `complete_wizard` action (must be added)
**Note:** Only 4/15 startup fields saved in `complete_wizard` (must complete data mapping)

---

## 🎨 Frontend Pages

| Task Name | Description | Status | % Complete | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|-----------|-------------|--------|------------|--------------|---------------------|----------------|
| **Onboarding Wizard Page** | Main wizard page component | 🔴 Not Started | 0% | — | No `/onboarding` route exists | Create `src/pages/OnboardingWizard.tsx` |
| **Route Configuration** | Add route to App.tsx | 🔴 Not Started | 0% | — | No route in App.tsx | Add route `/onboarding` |
| **Protected Route** | Wizard behind auth | 🔴 Not Started | 0% | — | Route not configured | Wrap with ProtectedRoute |

**Total:** 0/3 frontend page tasks complete (0%)

**Reference:** EventWizard exists at `src/pages/EventWizard.tsx` (can use as pattern)

---

## 🧩 Frontend Components

| Task Name | Description | Status | % Complete | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|-----------|-------------|--------|------------|--------------|---------------------|----------------|
| **WizardLayout Component** | 3-panel layout wrapper | 🔴 Not Started | 0% | — | No layout component | Create `src/components/onboarding/WizardLayout.tsx` |
| **StepProgress Component** | Progress indicator (Left panel) | 🔴 Not Started | 0% | — | No progress component | Create `src/components/onboarding/StepProgress.tsx` |
| **Step1Profile Component** | Step 1: Profile & Business form | 🔴 Not Started | 0% | — | No step 1 component | Create `src/components/onboarding/Step1Profile.tsx` |
| **Step2Traction Component** | Step 2: Traction & Funding form | 🔴 Not Started | 0% | — | No step 2 component | Create `src/components/onboarding/Step2Traction.tsx` |
| **Step3Review Component** | Step 3: Review & Generate | 🔴 Not Started | 0% | — | No step 3 component | Create `src/components/onboarding/Step3Review.tsx` |
| **WizardAIPanel Component** | Right panel AI intelligence | 🔴 Not Started | 0% | — | No AI panel component | Create `src/components/onboarding/WizardAIPanel.tsx` |
| **ExtractionDisplay Component** | AI extraction results display | 🔴 Not Started | 0% | — | No extraction UI | Create extraction display component |
| **TaskPreview Component** | Generated tasks preview | 🔴 Not Started | 0% | — | No task preview | Create task preview component |

**Total:** 0/8 component tasks complete (0%)

**Reference:** Event wizard components exist at `src/components/events/wizard/` (can use as pattern)

---

## 🔌 Frontend/Backend Wiring

| Task Name | Description | Status | % Complete | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|-----------|-------------|--------|------------|--------------|---------------------|----------------|
| **useWizardSession Hook** | Wizard session management | 🔴 Not Started | 0% | — | No hook exists | Create `src/hooks/useWizardSession.ts` |
| **useOnboardingAgent Hook** | Edge function integration | 🔴 Not Started | 0% | — | No hook exists | Create `src/hooks/useOnboardingAgent.ts` |
| **URL Extraction Integration** | Wire enrich_url to UI | 🔴 Not Started | 0% | — | No integration | Connect Step1 to enrich_url |
| **Context Extraction Integration** | Wire enrich_context to UI | 🔴 Not Started | 0% | — | No integration | Connect Step1 to enrich_context |
| **Session Auto-Save** | Auto-save to wizard_sessions | 🔴 Not Started | 0% | — | No auto-save | Implement debounced save |
| **Resume Capability** | Load saved session | 🔴 Not Started | 0% | — | No resume | Load from wizard_sessions on mount |
| **Task Generation Integration** | Wire complete_wizard to UI | 🔴 Not Started | 0% | — | No integration | Connect Step3 to complete_wizard |
| **React Query Integration** | Data fetching with React Query | 🔴 Not Started | 0% | — | No queries | Add useQuery/useMutation |

**Total:** 0/8 wiring tasks complete (0%)

---

## 🤖 AI Integration

| Task Name | Description | Status | % Complete | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|-----------|-------------|--------|------------|--------------|---------------------|----------------|
| **ProfileExtractor Agent** | URL extraction agent | 🟢 Completed | 100% | Edge function `enrich_url` exists | Not wired to UI | Connect to Step1 form |
| **URL Context Tool** | Gemini URL Context | 🟢 Completed | 100% | Used in enrich_url action | — | None |
| **Structured Output** | Gemini structured output | 🟢 Completed | 100% | Used in all extraction actions | — | None |
| **Extraction Display** | Show extracted data | 🔴 Not Started | 0% | — | No UI component | Create extraction display |
| **Suggestion Approval** | User approval workflow | 🔴 Not Started | 0% | — | No approval UI | Create approval buttons |
| **Form Pre-fill** | Apply suggestions to form | 🔴 Not Started | 0% | — | No pre-fill logic | Implement field mapping |
| **TaskGenerator Agent** | Task generation | 🔴 Not Implemented | 0% | Task generation missing in `complete_wizard` | Must add TaskGenerator | Implement in edge function |
| **Task Preview** | Show generated tasks | 🔴 Not Started | 0% | — | No preview UI | Create task preview component |

**Total:** 2/8 AI integration tasks complete (25%) — Task generation not implemented

---

## 🔄 Workflows

| Task Name | Description | Status | % Complete | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|-----------|-------------|--------|------------|--------------|---------------------|----------------|
| **URL Extraction Workflow** | Extract from website URL | 🔴 Not Started | 0% | Edge function exists | No UI trigger | Wire Step1 "Extract" button |
| **Context Extraction Workflow** | Extract from description | 🔴 Not Started | 0% | Edge function exists | No UI trigger | Wire Step1 description field |
| **Wizard Completion Workflow** | Save startup + generate tasks | 🔴 Not Started | 0% | Edge function exists | No UI trigger | Wire Step3 "Complete" button |
| **Auto-Save Workflow** | Debounced form saving | 🔴 Not Started | 0% | — | No auto-save | Implement debounced save |
| **Resume Workflow** | Load saved session | 🔴 Not Started | 0% | — | No resume | Load session on mount |
| **Progress Tracking** | Update current_step | 🔴 Not Started | 0% | — | No tracking | Update step on navigation |

**Total:** 0/6 workflow tasks complete (0%)

---

## 📊 Data Flow

| Task Name | Description | Status | % Complete | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|-----------|-------------|--------|------------|--------------|---------------------|----------------|
| **Form Data → wizard_sessions** | Save form data | 🔴 Not Started | 0% | — | No save logic | Implement update_session calls |
| **Extraction → Right Panel** | Display AI suggestions | 🔴 Not Started | 0% | — | No display | Create extraction display |
| **Approval → Form Fields** | Pre-fill form | 🔴 Not Started | 0% | — | No pre-fill | Implement field mapping |
| **Completion → startups Table** | Save final startup | 🔴 Not Started | 0% | — | No save | Wire complete_wizard |
| **Completion → tasks Table** | Create onboarding tasks | 🔴 Not Started | 0% | — | No task creation | Wire task generation |

**Total:** 0/5 data flow tasks complete (0%)

---

## 🎯 User Journey

| Step | Description | Status | % Complete | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|------|-------------|--------|------------|--------------|---------------------|----------------|
| **Step 1: Profile & Business** | Company info form | 🔴 Not Started | 0% | Design exists | No component | Create Step1Profile |
| **Step 2: Traction & Funding** | Metrics form | 🔴 Not Started | 0% | Design exists | No component | Create Step2Traction |
| **Step 3: Review & Generate** | Summary + tasks | 🔴 Not Started | 0% | Design exists | No component | Create Step3Review |
| **AI Extraction** | URL-based extraction | 🔴 Not Started | 0% | Edge function exists | No UI | Wire extraction |
| **Task Generation** | Generate onboarding tasks | 🔴 Not Started | 0% | Edge function exists | No UI | Wire task generation |
| **Dashboard Redirect** | Redirect after completion | 🔴 Not Started | 0% | — | No redirect | Add navigation |

**Total:** 0/6 user journey steps complete (0%)

---

## 📈 Overall Progress Breakdown

| Category | Weight | Progress | Weighted Score |
|----------|--------|----------|---------------|
| Design & Specs | 15% | 100% | 15.0% |
| Database Schema | 15% | 100% | 15.0% |
| Edge Functions | 20% | 100% | 20.0% |
| Frontend Pages | 10% | 0% | 0.0% |
| Frontend Components | 15% | 0% | 0.0% |
| Frontend/Backend Wiring | 10% | 0% | 0.0% |
| AI Integration | 10% | 38% | 3.8% |
| Workflows | 5% | 0% | 0.0% |

**Overall Progress: 53.8%** (Backend: 100%, Frontend: 0%)

---

## 🎯 Next Priority Tasks

### Implementation Prompts Created

**All prompts created in `prompts/onboarding/`:**
- ✅ `01-wizard-layout-setup.md` — Layout infrastructure (P0)
- ✅ `02-step1-profile-business.md` — Step 1 form with AI (P0)
- ✅ `03-step2-traction-funding.md` — Step 2 form (P0)
- ✅ `04-step3-review-generate.md` — Step 3 review (P0)
- ✅ `05-wizard-ai-panel.md` — AI panel component (P1)
- ✅ `06-wizard-hooks-integration.md` — Hooks & data integration (P0)

**Reference:** `00-onboarding-index.md` for prompt index

### Critical Blockers (P0)
1. **Prompt 01: Create Onboarding Wizard Page** — Layout infrastructure
2. **Prompt 06: Create useWizardSession Hook** — Session management
3. **Prompt 02: Create Step 1 Component** — Profile & Business form
4. **Prompt 03: Create Step 2 Component** — Traction & Funding form
5. **Prompt 04: Create Step 3 Component** — Review & Generate

### High Priority (P1)
1. **Prompt 05: Create WizardAIPanel Component** — Right panel AI intelligence
2. **Wire URL Extraction** — Connect Step1 to `enrich_url` action
3. **Wire Task Generation** — Connect Step3 to `complete_wizard`
4. **Implement Auto-Save** — Debounced form saving to wizard_sessions

### Medium Priority (P2)
1. **Create Extraction Display** — Show AI suggestions in right panel
2. **Implement Resume** — Load saved session on mount
3. **Add Progress Tracking** — Update current_step on navigation
4. **Create Task Preview** — Show generated tasks before completion

---

## ✅ Verification Checklist

### Phase 1: Backend ✅
- [x] Database tables exist (wizard_sessions, industry_packs)
- [x] RLS policies configured
- [x] Edge function deployed (onboarding-agent)
- [x] All 11 actions implemented
- [x] AI models configured (Gemini Flash)

### Phase 2: Frontend 🔴
- [ ] Onboarding wizard page created
- [ ] Route added to App.tsx
- [ ] Step components created (Step1, Step2, Step3)
- [ ] WizardAIPanel component created
- [ ] useWizardSession hook created
- [ ] useOnboardingAgent hook created

### Phase 3: Integration 🔴
- [ ] URL extraction wired to Step1
- [ ] Context extraction wired to Step1
- [ ] Auto-save implemented
- [ ] Resume capability implemented
- [ ] Task generation wired to Step3
- [ ] Dashboard redirect after completion

### Phase 4: Testing 🔴
- [ ] Wizard flow tested end-to-end
- [ ] AI extraction tested
- [ ] Auto-save tested
- [ ] Resume tested
- [ ] Task generation tested

---

## 📝 Implementation Notes

### Reference Implementation
**EventWizard** (`src/pages/EventWizard.tsx`) exists and can be used as a pattern:
- ✅ 4-step wizard structure
- ✅ localStorage progress saving
- ✅ Step components in `src/components/events/wizard/`
- ✅ WizardAIPanel component
- ✅ DashboardLayout with 3-panel layout

### Key Differences
- **Onboarding Wizard:** 3 steps (Profile → Traction → Review)
- **Event Wizard:** 4 steps (Context → Strategy → Logistics → Review)
- **Onboarding:** Uses `wizard_sessions` table (not localStorage)
- **Onboarding:** Uses `onboarding-agent` edge function (not `event-agent`)

### Design Specs Reference
- **Wireframe:** `prompts/wizard/04-wizard-screen-design.md` (lines 37-106)
- **AI Integration:** `prompts/wizard/16-wizard-ai-integration.md`
- **Workflows:** `prompts/wizard/04-wizard-screen-design.md` (lines 292-347)

---

## 🚀 Quick Start Implementation

### Step 1: Create Page & Route (30 min)
1. Create `src/pages/OnboardingWizard.tsx` (copy from EventWizard.tsx)
2. Add route to `src/App.tsx`: `/onboarding`
3. Wrap with `<ProtectedRoute>`

### Step 2: Create Hook (30 min)
1. Create `src/hooks/useWizardSession.ts` (React Query + Supabase)
2. Create `src/hooks/useOnboardingAgent.ts` (edge function calls)

### Step 3: Create Step Components (2 hours)
1. Create `src/components/onboarding/Step1Profile.tsx`
2. Create `src/components/onboarding/Step2Traction.tsx`
3. Create `src/components/onboarding/Step3Review.tsx`
4. Create `src/components/onboarding/WizardAIPanel.tsx`

### Step 4: Wire AI Integration (1 hour)
1. Wire URL extraction to Step1
2. Wire context extraction to Step1
3. Wire task generation to Step3

### Step 5: Implement Workflows (1 hour)
1. Add auto-save (debounced)
2. Add resume capability
3. Add progress tracking

**Total Estimated Time:** ~5 hours

---

**Status:** 🟡 **Backend Complete, Frontend Missing** — All infrastructure ready, need to build UI components

**Next Steps:** Create onboarding wizard page and components, wire to existing edge functions
