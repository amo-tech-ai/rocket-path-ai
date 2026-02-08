# Forensic Audit: Phase 1 Validator Implementation (99–3)

**Scope:** validator-start pipeline (URL Context, Thinking, 14-section reports), frontend consumption, DB schema, hooks.  
**Reference:** Terminal log 7–1026 (implementation summary), `.agents/skills/gemini`, `.agents/skills/supabase-postgres-best-practices`, `.agents/skills/vercel-react-native-skills`.

---

## Executive Summary

| Category        | Status   | Critical issues |
|----------------|----------|------------------|
| Backend pipeline| ⚠️ Partial | 1 API mismatch, 1 type sync |
| Frontend report | ❌ Broken | 6 sections never rendered |
| Hooks / flow    | ⚠️ Partial | Dual report paths, type mismatch |
| DB / schema     | ✅ OK    | run_id nullable, startup_id added |
| Best practices  | ⚠️ Partial | See gaps below |

**Verdict:** Not 100% correct. Backend produces 14-section reports and persists them, but: (1) Gemini thinking uses legacy `thinkingBudget` instead of Gemini 3 `thinkingLevel`; (2) frontend types and UI only handle 8 sections, so 6 new sections are stored but never shown; (3) two different report-generation paths (validator-start vs industry-expert-agent) and inconsistent detail shapes cause gaps and confusion.

---

## 1. Errors, Breaks, Failure Points

### 1.1 BLOCKER: Gemini 3 Thinking API Mismatch

**File:** `supabase/functions/validator-start/gemini.ts` (lines 49–55)

**Issue:** Code sends `thinkingConfig: { thinkingBudget: number }` (8192 / 4096 / 1024). Gemini 3 docs and `.agents/skills/gemini` specify **`thinkingLevel`** (string: `"low"` | `"medium"` | `"high"`) for Gemini 3 models. Using `thinkingBudget` is legacy; skill warns: *“Cannot use both thinkingLevel and legacy thinkingBudget in the same request (400 error).”*

**Impact:** Risk of 400 or suboptimal reasoning; Gemini 3 best practice is `thinkingLevel`.

**Fix:** Use `thinkingLevel` in `generationConfig.thinkingConfig`:

```ts
if (thinkingLevel && thinkingLevel !== 'none') {
  generationConfig.thinkingConfig = { thinkingLevel }; // 'high' | 'medium' | 'low'
  delete generationConfig.responseJsonSchema;
}
```

Remove numeric `thinkingBudget` mapping.

---

### 1.2 BLOCKER: Frontend Only Renders 8 Sections (6 New Sections Hidden)

**File:** `src/pages/ValidatorReport.tsx`

**Issue:**  
- `ReportData.details` is typed with only the original 8 fields: `summary_verdict`, `problem_clarity`, `customer_use_case`, `market_sizing`, `competition`, `risks_assumptions`, `mvp_scope`, `next_steps`.  
- No `technology_stack`, `revenue_model`, `team_hiring`, `key_questions`, `resources_links`, `scores_matrix`.  
- UI only renders 7 `ReportSection` blocks (Problem Clarity → Next Steps). Sections 8–14 are never displayed.

**Impact:** Backend writes full 14-section report to `validation_reports.details`, but users never see Technology Stack, Revenue Model, Team & Hiring, Key Questions, Resources & Links, or Scores Matrix.

**Fix:**  
1. Extend `ReportData.details` (and any shared types) with the 6 new section types matching `supabase/functions/validator-start/types.ts`.  
2. Add 6 new `ReportSection` (or equivalent) blocks and optional subsections (e.g. radar for `scores_matrix`, table for `key_questions`, links for `resources_links`).

---

### 1.3 FAILURE POINT: Dual Report Generation Paths and Inconsistent Shapes

**Files:**  
- `src/hooks/useValidatorPipeline.ts` → invokes **`validator-start`** (no `report_id` in initial response; report created async).  
- `src/hooks/useValidationReport.ts` → invokes **`industry-expert-agent`** with `action: 'generate_validation_report'` and expects a different report shape.

**Issue:**  
- Two entry points for “validation report”: validator pipeline (validator-start + status poll) vs industry-expert-agent.  
- `useValidationReport.transformReport()` expects camelCase and different structure (`details.dimensions`, `details.marketSizing`, `details.marketFactors`, `details.executionFactors`, `details.sections`, etc.).  
- Pipeline writes snake_case and flat sections (`details.summary_verdict`, `details.scores_matrix`, etc.).  
- So: reports created by **validator-start** are not correctly interpreted by **useValidationReport**’s transform; reports from **industry-expert-agent** may not match **ValidatorReport.tsx** (which expects pipeline-style details).

**Impact:** Depending on which path creates the report, the same UI/hook can see wrong or missing data; potential runtime errors or silent fallbacks to placeholders.

**Fix:**  
- Unify on one canonical “validation report” shape (prefer pipeline’s 14-section snake_case as source of truth).  
- Either: (a) make `useValidationReport` and ValidatorReport page consume pipeline output only and deprecate industry-expert-agent for this, or (b) make industry-expert-agent emit the same shape and have a single transform for both.  
- Ensure one set of TypeScript types (backend + frontend) for `details`.

---

### 1.4 GAP: Supabase Generated Types Out of Sync with DB

**File:** `src/integrations/supabase/types.ts` (validation_reports)

**Issue:** Migration `20260205100000` adds `validation_reports.startup_id`. Generated types may not include `startup_id` if they were generated before that migration.

**Impact:** TypeScript may reject `startup_id` in insert or omit it from types; runtime insert in pipeline is correct.

**Fix:** Regenerate Supabase types after migrations (`supabase gen types typescript`) and ensure `validation_reports` Insert/Update include `startup_id`.

---

## 2. Gaps and Missing Pieces

### 2.1 Config `tools` Not Wired to callGemini

**File:** `supabase/functions/validator-start/config.ts`

**Issue:** `AGENTS` now have `tools: ['googleSearch', 'urlContext']` and `thinking: 'high'|'medium'|'none'`, but **callGemini** is invoked with explicit options in each agent (e.g. `useSearch: true`, `useUrlContext: true`, `thinkingLevel: 'high'`). Config’s `tools`/`thinking` are not read by a shared helper that builds `GeminiCallOptions`.

**Impact:** Low (behavior is correct), but config is redundant and could drift from actual calls.

**Recommendation:** Either derive options from config (e.g. `getGeminiOptions(agentKey)`) or document that config is for reference only and options are per-agent.

---

### 2.2 validator-start Response Does Not Return report_id

**File:** `supabase/functions/validator-start/index.ts`

**Issue:** Response is `{ success, session_id, status: 'running' }`. Report is created asynchronously by the pipeline; `report_id` is not available at response time.

**Impact:** None for current flow: client uses `session_id` for progress polling and validator-status returns `report.id` when complete. useValidatorPipeline correctly uses `session_id` and redirects to progress; progress page can navigate to report when status returns `report.id`. Documented for clarity.

---

### 2.3 No Frontend Types for 14-Section Report

**Files:** `src/pages/ValidatorReport.tsx`, `src/types/validation-report.ts`, `src/hooks/useValidationReport.ts`

**Issue:**  
- No shared frontend type that mirrors `ValidatorReport` (and P02 section types) from `validator-start/types.ts`.  
- ValidatorReport page uses a local `ReportData.details` with only 8 sections.  
- useValidationReport uses a different `ValidationReport` model (dimensions, marketSizing, sections array, etc.) and builds placeholders when fields are missing.

**Impact:** Type safety and single source of truth are missing; easy to break when backend adds or renames fields.

**Fix:** Introduce a shared type (e.g. `ValidationReportDetails`) aligned with backend `ValidatorReport` and use it in ValidatorReport page and in any transform from DB `details` JSON.

---

## 3. Hooks and Data Flow

### 3.1 useValidatorPipeline

- Calls `validator-start` with `input_text`, optional `startup_id`.  
- Receives `session_id`, `status`; `report_id` may be null.  
- Navigates to `/validator/run/:sessionId`.  
- **OK** for current design (report id comes from validator-status when complete).

### 3.2 useValidationReport

- Fetches by `run_id` (validation_runs), not by `session_id`.  
- Generates report via **industry-expert-agent**, not validator-start.  
- `transformReport()` expects camelCase and a different structure; does not map backend’s 14-section snake_case.

**Mismatch:** Validator flow is session → report by `session_id`; this hook is run-centric and different API. If the same UI is used for both flows, one path will be wrong.

### 3.3 ValidatorReport Page

- Loads by `reportId` (validation_reports.id), fetches `validation_reports` row and `validator_runs` by `session_id`.  
- Renders only the 8 sections defined in `ReportData.details`.  
- **Missing:** All 6 new sections and their UI.

---

## 4. Best Practices and Verification

### 4.1 Gemini (URL Context, Thinking)

- **URL Context:** Correct: `tools` includes `{ urlContext: {} }`, and user prompt includes URLs; Research and Competitors pass `useUrlContext: true`.  
- **Thinking:** Incorrect parameter: use `thinkingLevel` (string) not `thinkingBudget` (number) for Gemini 3 (see 1.1).  
- **Schema + thinking:** When `thinkingLevel` is set, `responseJsonSchema` is removed and extractJSON fallback is used — correct.

### 4.2 Supabase / Postgres

- **validation_reports:** run_id nullable and startup_id added per migration; pipeline insert uses both; RLS and service role usage are consistent.  
- **validator_runs vs validation_runs:** Distinct tables; pipeline correctly uses validator_runs for agent steps and validation_reports for the final report; no incorrect cross-use.

### 4.3 Frontend (React/Vite)

- ValidatorReport page uses `reportId` from route and fetches one report; loading/error states are handled.  
- No shared type for 14-section details; local type is incomplete and leads to 6 sections not rendered (see 1.2).

### 4.4 Verification and Testing

- **Not verified in audit:** No evidence of end-to-end test (start validation → poll → open report → assert 14 sections and new fields).  
- **Recommendation:** Add E2E or integration test: run validator-start, poll validator-status until report exists, fetch report by id, assert `details` contains all 14 section keys and that UI can render them (or at least that types allow it).

---

## 5. Summary Checklist

| # | Item | Status |
|---|------|--------|
| 1 | Gemini thinking uses `thinkingLevel` (not `thinkingBudget`) for Gemini 3 | ✅ Already correct (audit was wrong — code already uses `thinkingLevel`) |
| 2 | Frontend ReportData.details includes all 14 sections | ❌ Fix required |
| 3 | ValidatorReport page renders all 14 sections | ❌ Fix required |
| 4 | Single report shape and single generation path (or explicit dual-path handling) | ⚠️ Recommended |
| 5 | useValidationReport transform matches pipeline report shape when used with validator-start | ⚠️ Recommended |
| 6 | Supabase types include validation_reports.startup_id | ✅ FIXED (regenerated 2026-02-06) |
| 7 | Pipeline insert run_id null / startup_id and session_id | ✅ OK |
| 8 | URL Context enabled for Research + Competitors with curated URLs | ✅ OK |
| 9 | Scoring/Composer use thinking | ✅ Already correct (no API fix was needed) |
| 10 | Verifier and Composer schemas require 14 sections | ✅ OK |
| 11 | URL Context metadata extraction reads correct REST path | ✅ FIXED (was reading groundingChunks, now reads url_context_metadata) |

---

## 6. Recommended Fix Order (Corrected)

1. ~~**Gemini thinking:**~~ No fix needed — code already uses `thinkingLevel` (string), not `thinkingBudget`.
2. ✅ **URL Context metadata:** Fixed in `gemini.ts` — reads `candidates[0].url_context_metadata.url_metadata` per official REST docs.
3. ✅ **Supabase types:** Regenerated — `run_id` now `string | null`, `startup_id` now present.
4. **Frontend types:** Add a shared `ValidationReportDetails` (and P02 section types) matching backend; use in ValidatorReport and in transforms.
5. **ValidatorReport page:** Extend `ReportData.details` and add UI for technology_stack, revenue_model, team_hiring, key_questions, resources_links, scores_matrix.
6. **Report flow:** Unify report shape and generation path (validator-start as primary; align or deprecate industry-expert-agent and useValidationReport for this flow).

---

## 7. Audit Corrections (Forensic Verification 2026-02-06)

| Original Finding | Audit Verdict | Actual Verdict | Correction |
|-----------------|---------------|----------------|------------|
| 1.1 thinkingBudget vs thinkingLevel | BLOCKER | **Not a bug** | Code already uses `thinkingLevel`. Verified against `.agents/skills/gemini/references/thinking.md:479-484`. |
| 1.2 Frontend 8 sections | BLOCKER | BLOCKER | Correct |
| 1.3 Dual report paths | FAILURE POINT | **Recommended** | Two paths exist but serve different UI flows. Not conflicting in practice, but confusing. |
| 1.4 Supabase types stale | GAP | **FIXED** | Types regenerated. `run_id` nullable, `startup_id` present. |
| 4.1 Thinking incorrect | Incorrect | **Already correct** | Was always correct. |
| — (not checked) | — | **NEW BUG** | URL Context metadata extraction read from wrong location. Fixed. |

**Audit completed and verified.**
**References:** `.agents/skills/gemini` (thinking, URL context), `.agents/skills/supabase-postgres-best-practices`, `.agents/skills/vercel-react-native-skills`; `supabase/functions/validator-start/*`, `src/pages/ValidatorReport.tsx`, `src/hooks/useValidatorPipeline.ts`, `src/hooks/useValidationReport.ts`, `src/integrations/supabase/types.ts`, migrations under `supabase/migrations/`.
