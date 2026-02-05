# StartupAI Forensic Software Audit

> **Generated:** 2026-02-02  
> **Scope:** Schema, RLS, Edge Functions, Frontend/Backend, AI Agents, Wizards, Dashboards, Workflows  
> **Sources:** `startup-system/data/06-supabase-strategy.md`, migrations, edge functions, `src/`, `.env.local` (var names only)

---

## Executive Summary

| Category | Status | Critical Issues |
|----------|--------|-----------------|
| **Supabase schema** | ⚠️ Partial | 24+ tables from strategy doc not in migrations; some tables referenced in migrations may exist only in DB (lean_canvases, pitch_decks, activities, org_members) |
| **RLS** | ✅ Present | All base tables have RLS; Dev policies allow read when no auth — review for production |
| **Edge functions** | ⚠️ Partial | 8 strategy agents missing (validation-agent, customer-agent, pmf-agent, stage-agent, mvp-agent, metrics-agent, sprint-agent, decision-agent) |
| **Frontend ↔ Supabase** | ✅ Connected | 29 files use `supabase.from`/`rpc`/`auth`; client may use hardcoded URL/key vs `.env.local` |
| **Build** | ✅ Pass | Warnings: CSS @import order, chunk size >500KB |
| **Lint** | ❌ Fail | 952 errors, 152 warnings (no-explicit-any, no-require-imports) |
| **Env / secrets** | ⚠️ Verify | Edge functions need GEMINI_API_KEY, ANTHROPIC_API_KEY in Supabase; client uses literals in `client.ts` |

**Verdict:** Not 100% correct. Gaps: missing tables/agents per strategy, lint failures, env/client mismatch risk.

---

## 1. Critical Errors & Red Flags

### 1.1 CRITICAL

| # | Issue | Location | Impact |
|---|--------|----------|--------|
| 1 | **Supabase client URL/key hardcoded** | `src/integrations/supabase/client.ts` | Client uses literal `SUPABASE_URL` and publishable key; `.env.local` has `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. If codegen overwrites client, env vars are ignored → wrong project in different envs. |
| 2 | **24 strategy tables not in migrations** | `06-supabase-strategy.md` vs `supabase/migrations/` | experiments, experiment_results, customer_canvases, customer_interviews, mvp_canvases, mvp_features, traction_metrics, traction_milestones, customer_factory_metrics, pmf_assessments, pmf_survey_responses, stage_assessments, gate_checks, decisions, assumptions, playbook_questions, playbook_responses, playbook_benchmarks, lean_sprints, lean_sprint_tasks not created in current migration set. Validation Lab, PMF, Stage, MVP, and playbook enhancements cannot be fully implemented. |
| 3 | **lean_canvases / pitch_decks / activities creation** | Migrations | `advanced_playbook_tables` and `workflow_trigger_prerequisites` ALTER lean_canvases, pitch_decks, activities. CREATE TABLE for these exists only in archive (`20260129110000_add_prompt_pack_dependencies.sql` for lean_canvases). DB types show they exist — verify they are created in an applied migration or manual step; otherwise migrations are not self-contained. |
| 4 | **org_members referenced in RLS, creation unclear** | `workflow_trigger_prerequisites.sql`, `advanced_playbook_tables.sql`, `create_validation_schema.sql` | Policies use `org_members`; `types.ts` has `org_members`. No CREATE TABLE org_members in migrations read — confirm creation (e.g. in 20260129180000 or elsewhere). If missing, RLS can break. |
| 5 | **952 ESLint errors** | Project-wide | `@typescript-eslint/no-explicit-any` (and similar) in `src/` and `supabase/functions/`. Fails CI if lint required; weak type safety. |

### 1.2 HIGH

| # | Issue | Location | Impact |
|---|--------|----------|--------|
| 6 | **8 edge functions from strategy missing** | Strategy Part 7 | validation-agent, customer-agent, pmf-agent, stage-agent, mvp-agent, metrics-agent, sprint-agent, decision-agent not present. Validation Lab, PMF, Stage, MVP, and metrics workflows not implemented. |
| 7 | **Dev-only RLS policies** | `20260115204935_*`, `20260117092536_*` | "Dev: Allow read when no auth" policies allow SELECT when `user_org_id()` IS NULL. Must be disabled or gated in production to avoid data leak. |
| 8 | **CSS @import order** | Build output | `@import url('...fonts...')` appears after other statements; can cause non-deterministic styling. Move to top of global CSS. |
| 9 | **Large main chunk (~3.2MB)** | Build | Single chunk >500KB; consider code-splitting (e.g. pitch deck, canvas, CRM) for faster load. |

### 1.3 MEDIUM

| # | Issue | Location | Impact |
|---|--------|----------|--------|
| 10 | **Duplicate org helpers?** | Migrations | `user_org_id()` in base_schema; `get_user_org_id()` in 20260130195942. Confirm single source of truth and policy consistency. |
| 11 | **Event tables permissive SELECT** | `20260119210736_*`, `20260119210808_*` | "authenticated users can view all events/attendees/sponsors/venues/assets" — broad read; confirm intended for demo only and restrict for production. |
| 12 | **workflow_activity_log RLS** | `workflow_trigger_prerequisites.sql` | Service role has FOR ALL; authenticated uses org_id/startup_id. Edge functions using service role are correct; ensure no anon key access to sensitive log. |

---

## 2. Schema Audit

### 2.1 Tables in Migrations (CREATE TABLE)

From `supabase/migrations/`:

- **Base:** organizations, profiles, startups, projects, contacts, deals, tasks, documents  
- **Auth/roles:** user_roles  
- **Investors:** investors  
- **Industry/prompt:** industry_playbooks, context_injection_map (20260129000000); prompt_packs, prompt_pack_steps, prompt_pack_runs, prompt_template_registry, feature_pack_routing, context_injection_configs (20260129180000)  
- **Validation:** validation_runs, validation_reports, validation_verdicts  
- **Playbook:** playbook_runs  
- **Workflow:** workflow_activity_log  

**Not found as CREATE in active migrations:** activities, lean_canvases, pitch_decks, org_members, startup_events, event_attendees, event_sponsors, event_venues, event_assets, and many others present in `types.ts`. Migration 20260129180000 only creates industry_playbooks, prompt_packs, prompt_pack_steps, prompt_pack_runs, prompt_template_registry, feature_pack_routing, context_injection_configs — **lean_canvases, pitch_decks, activities, org_members must be created elsewhere (other migrations or manual). Verify migration order and that all tables in types are created in migrations.**

### 2.2 Strategy Doc vs Current Migrations

| Strategy table | In migrations? | Notes |
|----------------|----------------|-------|
| experiments | ❌ | Missing |
| experiment_results | ❌ | Missing |
| customer_canvases | ❌ | Missing |
| customer_interviews | ❌ | Missing |
| mvp_canvases | ❌ | Missing |
| mvp_features | ❌ | Missing |
| traction_metrics | ❌ | Missing |
| traction_milestones | ❌ | Missing |
| customer_factory_metrics | ❌ | Missing |
| pmf_assessments | ❌ | Missing |
| pmf_survey_responses | ❌ | Missing |
| stage_assessments | ❌ | Missing |
| gate_checks | ❌ | Missing |
| decisions | ❌ | Missing |
| assumptions | ❌ | Missing |
| playbook_questions | ❌ | Missing |
| playbook_responses | ❌ | Missing |
| playbook_benchmarks | ❌ | Missing |
| lean_sprints | ❌ | Missing |
| lean_sprint_tasks | ❌ | Missing |

### 2.3 Indexes

- workflow_trigger_prerequisites: idx_tasks_source, idx_tasks_trigger_rule, idx_workflow_activity_* created.
- Strategy doc Part 3 lists many indexes for experiments, traction_metrics, customer_canvases, pmf_assessments, stage_assessments, decisions, assumptions, mvp_*, lean_sprints — **all depend on missing tables; add when tables are added.**

### 2.4 Triggers

- Base: `handle_updated_at()` on several tables.
- Strategy Part 5: update_startup_stage, log_experiment_completion, update_startup_pmf, update_startup_traction, sync_canvas_validation — **all depend on missing tables (e.g. experiments, stage_assessments, pmf_assessments, traction_metrics).** Not applied.

---

## 3. RLS Audit

- **Enabled on:** organizations (if applied), profiles, startups, projects, contacts, deals, tasks, documents, user_roles, investors, validation_*, playbook_runs, workflow_activity_log, and others per migrations.
- **Helpers:** `user_org_id()`, `startup_in_org(startup_id)` in base_schema; `get_user_org_id()` in 20260130195942.
- **Gaps:** New strategy tables (when added) need RLS and policies following Part 4 of 06-supabase-strategy.md (startup_in_org / org-based).
- **Risk:** Dev policies that allow SELECT when `user_org_id()` IS NULL must not be active in production.

---

## 4. Edge Functions Audit

### 4.1 Present (in `supabase/functions/`)

- ai-chat, onboarding-agent, workflow-trigger, compute-daily-focus  
- lean-canvas-agent, pitch-deck-agent, task-agent, crm-agent, investor-agent  
- documents-agent, event-agent, health-scorer, insights-generator, action-recommender  
- industry-expert-agent, stage-analyzer, prompt-pack  
- dashboard-metrics  

### 4.2 Missing vs Strategy (Part 7)

- validation-agent  
- customer-agent  
- pmf-agent  
- stage-agent  
- mvp-agent  
- metrics-agent (distinct from dashboard-metrics if intended)  
- sprint-agent  
- decision-agent  

### 4.3 Env Requirements (Supabase Edge Secrets)

- **SUPABASE_URL**, **SUPABASE_ANON_KEY** — set by Supabase for invocations.  
- **GEMINI_API_KEY** — required by ai-chat, onboarding-agent, prompt-pack (and possibly others).  
- **ANTHROPIC_API_KEY** — required by ai-chat, prompt-pack.  

If these are not set in the project, affected functions will throw at runtime.

### 4.4 Lint

- Edge functions (e.g. onboarding-agent, prompt-pack, stage-analyzer) report `@typescript-eslint/no-explicit-any`. Fix for consistency and type safety.

---

## 5. Frontend & Backend Integration

### 5.1 Supabase Usage

- **Client:** `src/integrations/supabase/client.ts` — single createClient with Database types.
- **Usage:** 29 files use `supabase.from`, `supabase.rpc`, or `supabase.auth` (hooks, pages, components).
- **Types:** `src/integrations/supabase/types.ts` — generated; includes activities, lean_canvases, pitch_decks, org_members, and 50+ tables.

### 5.2 Env vs Client

- `.env.local`: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_SUPABASE_PROJECT_ID, VITE_DEV_MODE, VITE_DEV_BYPASS_AUTH, VITE_FORCE_REAL_API, VITE_CLOUDINARY_*.
- `client.ts`: Uses literal URL and publishable key (likely from Supabase codegen).  
- **Action:** Prefer `import.meta.env.VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in client (or ensure codegen uses env) so deployments use correct project.

### 5.3 Key Hooks / Flows

- Auth: useAuth, AuthCallback  
- Dashboard: useDashboardData, useDailyFocus  
- Agents: useLeanCanvasAgent, usePitchDeckAgent, useTaskAgent, useCRMAgent, useDocumentsAgent, useIndustryExpert, useStageAnalysis, useWorkflowTrigger, useActionRecommender, useHealthScore, useInsights, useValidation  
- Data: useDocuments, usePitchDecks, usePitchDeckEditor, usePitchDeckWizard, useSettings  
- Onboarding: onboarding invokeAgent  

No automated E2E verification was run; manual and E2E tests recommended for wizards and dashboards.

---

## 6. AI Agents & Gemini / Claude

- **Gemini:** Used in ai-chat, onboarding-agent, prompt-pack (gemini-3-flash-preview, gemini-3-pro-preview).  
- **Claude:** Used in ai-chat, prompt-pack (claude-sonnet-4-5, claude-haiku-4-5).  
- **Strategy:** 06-supabase-strategy and PRD reference Gemini 3 and Claude 4.5; model names in code match (e.g. gemini-3-flash-preview, claude-sonnet-4-5-20250929).  
- **Gaps:** Validation, customer, PMF, stage, MVP, metrics, sprint, decision agents not implemented; no automated test of agent ↔ Supabase.

---

## 7. Tests Executed

| Test | Result | Notes |
|------|--------|------|
| `npm run build` | ✅ Pass | 6.19s; CSS @import warning, chunk size warning |
| `npm run lint` | ❌ Fail | 952 errors, 152 warnings |
| Schema (migrations vs strategy) | ⚠️ Gap | 24 tables and related indexes/triggers not in migrations |
| RLS (policies present) | ✅ | Present on audited tables; dev policies need production review |
| Edge function list vs strategy | ⚠️ Gap | 8 agents missing |
| Client env (VITE_ vs literals) | ⚠️ | client.ts uses literals; .env.local has VITE_* |

---

## 8. Recommendations (Priority)

### P0 – Critical

1. **Client config:** Use `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY` in `client.ts` (or ensure codegen reads env) and validate in CI.  
2. **Schema:** Add migrations for strategy tables (experiments, customer_canvases, traction_metrics, pmf_assessments, stage_assessments, etc.) and for any table referenced in RLS but not created in migrations (e.g. org_members, activities, lean_canvases, pitch_decks if not already created elsewhere).  
3. **RLS:** Confirm org_members (and any other auth/org tables) exist and are created in migrations; remove or gate “Dev: Allow read when no auth” for production.

### P1 – High

4. **Edge functions:** Implement validation-agent, customer-agent, pmf-agent, stage-agent (or extend stage-analyzer), then mvp-agent, metrics-agent, sprint-agent, decision-agent per strategy.  
5. **Lint:** Fix or relax no-explicit-any (and related rules) in `src/` and `supabase/functions/` so lint passes; prefer fixing types.  
6. **Supabase secrets:** Ensure GEMINI_API_KEY and ANTHROPIC_API_KEY are set for all environments that invoke AI edge functions.

### P2 – Medium

7. **CSS:** Move `@import url('...fonts...')` to the top of the global CSS file.  
8. **Bundle:** Add code-splitting for heavy flows (pitch deck, canvas, CRM) to reduce main chunk size.  
9. **E2E:** Add at least one E2E (e.g. onboarding or dashboard load) that hits Supabase and optional edge function.

---

## 9. Document References

- Strategy: `startup-system/data/06-supabase-strategy.md`  
- PRD: `startup-system/prd.md`  
- Index: `startup-system/index-startup.md`  
- Edge API: `startup-system/data/05-edge-functions.md`  
- Migrations: `supabase/migrations/`  
- Edge functions: `supabase/functions/`  
- Env (names only): `.env.local` (VITE_*, SUPABASE_*)

---

*Audit generated 2026-02-02. Re-run after schema changes, new edge functions, and lint fixes.*
