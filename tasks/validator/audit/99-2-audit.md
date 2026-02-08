# Forensic Audit Report — Phase 0 Implementation (Post–7 Steps)

> **Date:** 2026-02-05  
> **Scope:** Implementation of 7-step Phase 0 pipeline fixes (validator-start, validator-status, ValidatorProgress)  
> **Reference:** Terminal summary (steps 1–7), `99-audit.md`, `11-pipeline-fixes.md`  
> **Method:** Code vs schema vs prompt verification; failure-point and blocker identification

---

## Executive Summary

| Metric | Value |
|--------|--------|
| **Steps implemented** | 7 (11G, 11A, 11B, 11D, 11C, 11E, 11F) |
| **Implementation correctness** | ~75% — logic and flow match prompts; **3 critical schema/code mismatches** will cause runtime failures |
| **Critical errors / red flags** | 3 (schema missing column; FK mismatch; F8 not implemented) |
| **Blockers for "100% working"** | Must fix before deploy: add `failed_steps` to `validator_sessions`; fix `validation_reports` insert (run_id/startup_id); wire Retry to pipeline (F8) |

**Verdict:** Implementation is **not 100% correct**. Edge function will **fail at runtime** when the pipeline completes: (1) update to `validator_sessions.failed_steps` will error (column does not exist); (2) insert into `validation_reports` may fail (run_id FK and/or startup_id column). Retry button still does not restart the pipeline (F8 omitted).

---

## Percent Correct by Area (Summary Table)

| Area | % Correct | Errors / gaps | Blockers |
|------|----------:|---------------|----------|
| **Edge: validator-start (logic)** | 95% | 11G/11A/11B/11C/11E/11F logic correct; session update and report insert use non-existent/wrong schema | Schema + insert |
| **Edge: validator-status** | 100% | failedSteps in response; progress calc unchanged (M2 deferred) | None |
| **Frontend: ValidatorProgress** | 85% | F6, F7, F9 done; F8 (Retry → pipeline) not done; F10 (skeleton) skipped | F8 |
| **Supabase schema** | 70% | validator_sessions missing `failed_steps`; validation_reports has no `startup_id`, run_id FK to validation_runs(id) | Migrations |
| **Hooks / wiring** | 80% | Status uses session_id for report; start still uses input_text only (extractedData not sent from chat — F15 partial) | — |

**Overall implementation correctness:** ~**78%** (would be ~95% after fixing the 3 critical items below).

---

## Critical Errors & Red Flags

### 1. **CRITICAL — `validator_sessions` has no `failed_steps` column**

**Code:** `validator-start/index.ts` lines 331–337:

```ts
await supabaseAdmin
  .from('validator_sessions')
  .update({
    status: finalStatus,
    failed_steps: failedAgents, // F11: Track which agents failed
    error_message: ...
  })
  .eq('id', sessionId);
```

**Schema:** Migration `20260204235414_...` defines `validator_sessions` with columns: `id`, `user_id`, `startup_id`, `input_text`, `status`, `error_message`, `created_at`, `updated_at`. **No `failed_steps`.**

**Impact:** When the pipeline finishes, this update will throw (e.g. "column failed_steps does not exist"). Session never leaves "running" in DB; frontend may still see terminal state from last successful poll, but DB is inconsistent.

**Fix:** Add migration: `ALTER TABLE validator_sessions ADD COLUMN IF NOT EXISTS failed_steps TEXT[] DEFAULT '{}';` (or JSONB array of agent names). Then edge function can write `failed_steps: failedAgents` safely.

**Done:** Migration `20260205100000_validator_sessions_failed_steps_validation_reports.sql` adds `failed_steps`.

---

### 2. **CRITICAL — `validation_reports` insert: run_id FK and startup_id column**

**Code:** `validator-start/index.ts` lines 309–327:

```ts
.insert({
  run_id: sessionId,           // validator_sessions.id
  session_id: sessionId,
  startup_id: startup_id || null,  // column may not exist
  report_type: 'deep',
  ...
})
```

**Schema:**

- **run_id:** Original `validation_reports` (20260130100000) has `run_id UUID NOT NULL REFERENCES public.validation_runs(id)`. So `run_id` must be a `validation_runs.id`. The code passes `sessionId` (a `validator_sessions.id`). **FK violation** unless a later migration changed this.
- **startup_id:** No migration adds `startup_id` to `validation_reports`. Only 20260204 adds `session_id`, `verified`, `verification_json`. **Insert will fail** with "column startup_id does not exist" (or unknown column).

**Impact:** Report insert fails when pipeline completes with a report. User gets terminal status but no report; "View Report" or auto-navigate may 404 or show nothing.

**Fix:**

1. Add migration: `ALTER TABLE validation_reports ADD COLUMN IF NOT EXISTS startup_id UUID REFERENCES public.startups(id) ON DELETE SET NULL;` if product wants startup_id on reports.
2. Make `run_id` nullable and use `run_id: null` for validator pipeline; link by `session_id` only.

**Done:** Migration adds `startup_id` and makes `run_id` nullable. Edge function updated to insert `run_id: null` for validator pipeline (link by `session_id` only).

---

### 3. **CRITICAL — F8 Retry button does not restart pipeline**

**Prompt 11D (F8):** "The 'Retry' button should call the validator-start edge function with session_id and retry: true (or 'Start New Validation')."

**Code:** `ValidatorProgress.tsx` lines 359–362 (failed state) and 330–332 (unverified):

```tsx
<Button onClick={() => setPolling(true)}>
  <RefreshCw ... />
  Retry
</Button>
```

**Impact:** Retry only restarts polling. Same failed/partial session is polled again; pipeline is not re-run. Founder has no way to "Retry" from the progress page other than going back to chat and starting again.

**Fix:** Retry should call `validator-start` with body e.g. `{ session_id: sessionId, retry: true }` (and optionally `input_text` from session), or navigate to `/validator` with a "Start new validation" CTA. Minimum: "Start Over" navigates to `/validator`; "Retry" should invoke the edge function to re-run (or explicitly "Start new" and pass session context if backend supports it).

---

## Other Gaps and Mismatches

| Item | Expected (prompt/audit) | Actual | Severity |
|------|-------------------------|--------|----------|
| F10 Loading skeleton | Show skeleton until first poll | Skipped (intentionally) | Low |
| M2 Progress for partial | Progress 100% when all agents in terminal state | Still `completedSteps / total`; partial can show &lt;100% | Low |
| validator_runs UPDATE policy | F17: Add UPDATE for service role | Not added; service_role usually bypasses RLS | Medium (hardening) |
| Frontend SessionStatus type | — | No `failedSteps` in interface; status API now returns it | Low (can add for UI) |
| F15 extractedData to pipeline | Send extractedData from chat to validator-start | Not implemented; only input_text sent | Medium (data quality) |

---

## What’s Working (Verified)

| Component | Status |
|-----------|--------|
| 11G: responseJsonSchema, temperature 1.0, API key header, citations | Implemented in callGemini |
| 11A: extractJSON 5-strategy fallback for 6 agents | Implemented; all 6 agents use it |
| 11B: AbortController timeouts, catch-all safety net | timeouts and try/catch around runPipeline |
| 11C: Research + Competitor in parallel | Promise.allSettled(runResearch, runCompetitors) |
| 11D: F6 partial stops polling | `complete \|\| partial \|\| failed` stops polling |
| 11D: F7 auto-navigate for terminal with report | complete or partial with report.id → navigate |
| 11D: F9 max 3 min polling | pollingStart ref + MAX_POLL_MS 180_000 |
| 11E: run_id = sessionId, extractedData in report details | run_id and session_id set; profile in details.extractedData |
| 11F: Input sanitization | Strip HTML, max 5000 chars, use sanitized in session + pipeline |
| validator-status: failedSteps in response | Returned in JSON |

---

## Hooks & Data Flow Verification

| Flow | Status |
|------|--------|
| Chat → validator-start | Still only input_text (no extractedData); sanitized used in pipeline |
| validator-start → validator_sessions update | **Fails** — failed_steps column missing |
| validator-start → validation_reports insert | **Fails** — startup_id missing; run_id FK wrong unless schema was changed |
| validator-status → report by session_id | Uses session_id; correct if report insert used session_id |
| Progress: terminal state → stop polling | Correct (complete/partial/failed) |
| Progress: Retry button | **Wrong** — only setPolling(true), does not call validator-start |

---

## Recommended Fix Order (Before Deploy)

1. ~~**Migration 1:** Add `validator_sessions.failed_steps`~~ **Done:** `20260205100000_validator_sessions_failed_steps_validation_reports.sql`
2. ~~**Migration 2:** Add `validation_reports.startup_id`; make `run_id` nullable; use `run_id: null` in validator insert~~ **Done:** same migration; edge function now inserts `run_id: null`.
3. **Code:** Wire Retry (and optionally "Regenerate") to call `validator-start` with retry or new session (F8).
4. **(Optional)** Add UPDATE policy on `validator_runs` for service role (F17).
5. **(Optional)** Progress: use `failedSteps` from status in UI; consider 100% progress when all steps are in terminal state (M2).

---

## Summary Table (Top)

| # | Issue | Severity | Blocks deploy? |
|---|--------|----------|----------------|
| 1 | validator_sessions.failed_steps column missing | **CRITICAL** | Yes |
| 2 | validation_reports insert (run_id FK + startup_id) | **CRITICAL** | Yes |
| 3 | F8 Retry does not call validator-start | **CRITICAL** | No (UX only) |
| 4 | validator_runs UPDATE RLS (F17) | HIGH | No (service_role usually bypasses) |
| 5 | F15 extractedData not sent from chat | MEDIUM | No |
| 6 | M2 progress &lt;100% for partial | LOW | No |

**Conclusion:** Implementation is **not 100% correct**. Fix the two schema/insert issues before deploy so the pipeline can complete and save reports; then add F8 (Retry → pipeline) for full 11D compliance.
