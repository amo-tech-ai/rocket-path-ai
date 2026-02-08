# Validator Strategy vs Implementation — Forensic Audit

> **Audit date:** 2026-02-08  
> **Scope:** Strategy docs (`01`–`05`), current implementation (v1 monolith), official Supabase/Deno/Gemini patterns  
> **Verdict:** Plan is **internally consistent** for v2; **implementation is v1** and does not yet match the plan. Several correctness gaps and failure points identified below.

---

## 1. Strategy vs Implementation — Compliance Matrix

| # | Strategy / Doc requirement | Implementation status | Correct? | Notes |
|---|----------------------------|----------------------|----------|--------|
| 1 | **8 Edge Functions** (orchestrate + 7 agents) | ❌ Single `validator-start` | **Gap** | v2 not implemented; only v1 monolith exists |
| 2 | **validator_agent_runs** table with `(session_id, agent_name, attempt)` unique | ❌ Uses `validator_runs` (no `attempt`) | **Gap** | Retries would overwrite same row; no idempotent retry support |
| 3 | Session status: `queued \| running \| success \| degraded_success \| failed` | ❌ Uses `running \| complete \| partial \| failed` | **Mismatch** | Plan says 5 states; DB CHECK allows 4 different values; no `degraded_success` |
| 4 | Agent status: `queued \| running \| ok \| failed` | ✅ Matches `validator_runs.status` | **OK** | Plus `partial` in code (not in 02 plan) |
| 5 | **Per-agent retry** (max 1), timeout/5xx only | ❌ No per-agent retry | **Gap** | Only full pipeline restart; no "Retry MVP" path |
| 6 | **Composer accepts null optional inputs** (MVP, Competitors) | ✅ Composer receives `mvpPlan \| null`, `competitorAnalysis \| null` | **OK** | Grace period for Competitors; MVP failure doesn't block Composer |
| 7 | **Orchestrator returns immediately** (fire-and-forget) | ✅ `validator-start` returns 200 with `session_id` then runs pipeline async | **OK** | `runPipeline().catch().finally()` after response |
| 8 | **Direct invoke** (agent calls next via fetch) | ❌ N/A — single process | **N/A** | v2 only |
| 9 | **DB relay** for inter-agent data | ✅ In-memory in v1; pipeline passes objects; results also in `validator_runs.output_json` | **Partial** | v1 shares memory; v2 plan is DB-only |
| 10 | **Core vs optional agents** (Extractor/Research/Score/Compose = core; Competitors/MVP = optional) | ✅ Pipeline continues without Competitors/MVP; `failedAgents` tracked | **OK** | `finalStatus`: complete / partial / failed by count |
| 11 | **Verifier** runs last, pure JS, no AI | ✅ `verifier.ts` — no Gemini, validates 15 sections | **OK** | |
| 12 | **validator-status** polls session + runs | ✅ GET with `session_id`, returns session + `validator_runs` + report | **OK** | Zombie cleanup for running > 3 min |
| 13 | **Report sections** (14 vs 15) | ⚠️ Verifier comment says "14 required sections"; array has **15** | **Doc bug** | `verifier.ts` line 19 comment wrong; list is 15 sections |
| 14 | **CORS** on all edge functions | ✅ `_shared/cors.ts` + handleCors preflight | **OK** | Matches Supabase CORS guidance |
| 15 | **JWT auth** (user context for session create, service role for admin) | ✅ User client for insert session; service role for runs/updates | **OK** | Matches Supabase auth pattern |
| 16 | **Rate limiting** | ✅ `_shared/rate-limit.ts` — validator-start heavy, validator-status light | **OK** | |
| 17 | **Input validation** (length, sanitization) | ✅ 10–5000 chars, strip HTML | **OK** | |
| 18 | **beforeunload** / isolate death handling | ✅ Marks session `failed` on beforeunload | **OK** | Deno Deploy best practice |

---

## 2. Implementation vs Official Docs / Best Practices

| # | Check | Result | Evidence / Fix |
|---|--------|--------|-----------------|
| 1 | **Supabase Edge Function**: Deno.serve, async handler | ✅ | `Deno.serve(async (req) => { ... })` |
| 2 | **Supabase Edge Function**: CORS for browser | ✅ | OPTIONS + corsHeaders on response |
| 3 | **Supabase Edge Function**: Auth via Authorization header | ✅ | `supabaseUser.auth.getUser()` with header |
| 4 | **Supabase Edge Function**: Env vars (SUPABASE_URL, SERVICE_ROLE, ANON) | ✅ | Checked at start; throw if missing |
| 5 | **Gemini API**: Key in header `x-goog-api-key` | ✅ | `gemini.ts` uses header, not query |
| 6 | **Gemini API**: Temperature 1.0 (Gemini 3 guidance) | ✅ | generationConfig.temperature = 1.0 |
| 7 | **Gemini API**: responseJsonSchema when no thinking | ✅ | Set when no thinking; removed when thinkingConfig used |
| 8 | **Gemini API**: thinkingConfig.thinkingLevel (not thinkingBudget) | ✅ | `thinkingLevel: 'high' \| 'low' \| 'none'` |
| 9 | **Gemini API**: Citations from groundingChunks | ✅ | groundingMetadata.groundingChunks, filter `.web` |
| 10 | **Postgres**: RLS on validator_sessions / validator_runs | ✅ | Migration enables RLS + policies by user_id |
| 11 | **Postgres**: validation_reports.run_id nullable | ✅ | Migration 20260205100000 drops NOT NULL |
| 12 | **Postgres**: failed_steps on validator_sessions | ✅ | Migration adds failed_steps TEXT[] |
| 13 | **Deno**: AbortSignal.timeout + Promise.race for Gemini | ✅ | Prevents hung requests |
| 14 | **Error handling**: All DB writes log errors | ✅ | db.ts and pipeline.ts log dbError |
| 15 | **Error handling**: Session never stuck "running" | ✅ | try/catch marks failed; beforeunload; zombie cleanup in validator-status |

---

## 3. Errors, Breaks, Failure Points

| # | Severity | Item | Location | Description |
|---|----------|------|----------|-------------|
| 1 | **High** | Session status vocabulary | Strategy 02, 04, 05 vs DB + code | Plan: `success`, `degraded_success`. Code/DB: `complete`, `partial`, `failed`. Frontend and status API use current schema; plan assumes v2 schema. **Blocker for v2 cutover:** migration must add new statuses or map them. |
| 2 | **High** | No `validator_agent_runs` / no attempt column | Strategy 02, 05 | Retry semantics in plan require one row per attempt. Current `validator_runs` is one row per agent per session; retry would overwrite. **Blocker for per-agent retry.** |
| 3 | **Medium** | Verifier comment "14 required sections" | `verifier.ts` L19 | Array has 15 sections. Comment is wrong; fix to "15 required sections". |
| 4 | **Medium** | Strategy doc inconsistency: "14-section" vs "15-section" | 01, 05, reports | Some docs say 14, some 15. Implementation and verifier use 15. Standardize on 15 in all strategy docs. |
| 5 | **Medium** | Zombie cleanup updates by `session_id` only | `validator-status/index.ts` L86–94 | `.eq('id', sessionId)` — so only the **requested** session is updated. Correct. But cleanup runs only when that session is polled; other zombie sessions are not cleaned until polled. Consider periodic job or cleanup by `updated_at` for all running sessions. |
| 6 | **Low** | `validator_sessions` CHECK constraint | Migration 20260204235414 | `status IN ('running','complete','partial','failed')`. Plan’s `queued`, `success`, `degraded_success` cannot be stored without migration. |
| 7 | **Low** | Composer timeout budget can be &lt; 15s | `pipeline.ts` L176–181 | If remaining time &lt; 15s, Composer is skipped. Correct behavior; documented in code. |

---

## 4. Gaps (Missing vs Plan)

| # | Missing item | Plan reference | Impact |
|---|----------------|----------------|--------|
| 1 | **validator-orchestrate** function | 02, 05 | No orchestrator; validator-start does create + dispatch inline. |
| 2 | **validator-agent-*** (7 agent functions) | 01, 02, 05 | All agents live in `validator-start/agents/`. |
| 3 | **validator_agent_runs** table | 02, 05 | Only validator_runs exists. |
| 4 | **Per-agent retry API** (e.g. POST retry for one agent) | 03, 04 | No retry endpoint; frontend cannot "Retry MVP". |
| 5 | **Frontend: retry buttons per failed agent** | 03, 05 Phase 5 | Not implemented. |
| 6 | **Frontend: degraded_success UX** (warnings, partial report CTA) | 03, 05 | Status is partial/complete; no explicit degraded_success. |
| 7 | **_shared/prompts/** (shared prompt files) | 05 | Prompts are inline in agent files. |
| 8 | **agent_dag** on session (JSONB) | 01 | Not in schema; plan shows DAG tracking. |

---

## 5. Blocker Summary

| Blocker | Blocks | Resolution |
|---------|--------|------------|
| Single monolith (no per-agent functions) | v2 architecture, per-agent timeout/retry | Implement 05 migration phases 1–4. |
| validator_runs has no attempt | Idempotent per-agent retry | Add validator_agent_runs or add attempt column + unique (session_id, agent_name, attempt). |
| Session status enum mismatch | v2 status semantics (degraded_success) | Migration: add new statuses or map complete→success, partial→degraded_success. |
| No retry endpoint | "Retry MVP" UX | Add endpoint (e.g. validator-retry or orchestrate with retry param) that re-runs one agent and optionally re-composes. |

---

## 6. Best-Practice Verification

| Practice | Status | Notes |
|----------|--------|--------|
| No secrets in code | ✅ | GEMINI_API_KEY, Supabase keys from env. |
| Input length limits | ✅ | 10–5000 chars. |
| HTML strip on input | ✅ | `.replace(/<[^>]*>/g,'')`. |
| Idempotent session create | ⚠️ | One session per POST; no idempotency key. |
| Structured errors to client | ✅ | JSON body, 400/401/405/500. |
| Logging (no PII in logs) | ✅ | session_id, user id; no input_text in logs. |
| Pipeline deadline enforced | ✅ | remainingMs(), isExpired() before each agent. |
| Composer budget capped | ✅ | COMPOSER_MAX_BUDGET_MS 30s, minimum 15s. |
| Grace period for Competitors | ✅ | Up to 5s wait before Composer. |
| Checkpoint before Composer | ✅ | failed_steps and session update before runComposer. |
| Safety net on unhandled error | ✅ | catch marks session failed. |

---

## 7. Plan Correctness (Internal Consistency)

| Check | Result | Notes |
|-------|--------|--------|
| 00-INDEX vs 01–05 | ✅ | Index accurately summarizes v1 vs v2 and doc list. |
| 01 vs 02 agent list | ✅ | Same 7 agents + orchestrator; 02 refines timeouts and DB. |
| 02 vs 05 schema | ✅ | validator_sessions + validator_agent_runs + validation_reports aligned. |
| 04 DAG vs 01 DAG | ✅ | Extractor → (Research \|\| Competitors) → Scorer → MVP → Composer → Verifier. |
| 04 dispatch (Direct Invoke) vs 05 | ✅ | 05 "Agent Chain Dispatch" matches Option B. |
| 05 migration phases | ✅ | Phases 1–6 are ordered and feasible. |
| Session state machine 04 vs status in 02 | ✅ | queued→running→success/degraded_success/failed. |
| Report section count | ⚠️ | 01/05 say "14-section" or "15-section"; standardize to 15. |

---

## 8. Summary Table (Quick Reference)

| Category | Pass | Fail | Gap / N/A |
|----------|------|------|-----------|
| Strategy vs implementation (v2 items) | 0 | 0 | 8 (v2 not built) |
| Strategy vs implementation (v1 items) | 10 | 1 (section count comment) | 2 |
| Implementation vs official docs | 15 | 0 | 0 |
| **Vs Supabase Postgres & Edge best practices** | **14** | **0** | **3 optional** |
| Errors / failure points | — | 3 medium, 2 low | — |
| Gaps (missing) | 0 | 8 | — |
| Blockers | — | 4 | — |
| Best practices | 11 | 0 | 1 (idempotency) |
| Plan internal consistency | 7 | 0 | 1 (section count) |

---

## 9. Audit vs Official Supabase Best Practices

Cross-check against **`.agents/skills/supabase-postgres-best-practices`** and **`knowledge/supabase/best-practices-edge`**.

### 9.1 Postgres (supabase-postgres-best-practices)

| # | Practice | Reference | Implementation | Result |
|---|----------|-----------|----------------|--------|
| 1 | **RLS enabled** on tenant tables | security-rls-basics | `validator_sessions` and `validator_runs` have RLS enabled | ✅ |
| 2 | **RLS policies use auth.uid()** for user isolation | security-rls-basics | Policies: `auth.uid() = user_id` (sessions); EXISTS on session ownership (runs) | ✅ |
| 3 | **Index FK columns** | schema-foreign-key-indexes | `idx_validator_runs_session_id`, `idx_validation_reports_session_id` | ✅ |
| 4 | **Composite index** for multi-column lookups | query-composite-indexes | `db.ts` updates by `(session_id, agent_name)`; only single-column indexes exist | ⚠️ Optional: add `(session_id, agent_name)` composite on `validator_runs` for faster UPDATE lookup |
| 5 | **Primary key strategy** (avoid random UUIDv4 on large tables) | schema-primary-keys | `gen_random_uuid()` (v4) used; validator tables are moderate volume | ⚠️ Low impact; consider UUIDv7 for v2 if scale grows |
| 6 | **RLS UPDATE/DELETE** on validator_runs | — | No UPDATE/DELETE policy; pipeline uses **service role** to update runs | ✅ Intentional (only backend updates runs) |

### 9.2 Edge Functions (knowledge/supabase/best-practices-edge)

| # | Practice | Reference | Implementation | Result |
|---|----------|-----------|----------------|--------|
| 1 | **JWT verification** (manual or Supabase client) | 02-security-authentication | `supabaseUser.auth.getUser()` with anon key + Authorization header | ✅ |
| 2 | **Anon key for user ops**, service role for admin | 02, 06-database-connections | User client: session insert (RLS). Admin: runs insert/update, session update | ✅ |
| 3 | **Secrets from env**, never in code | 02 | GEMINI_API_KEY, SUPABASE_* from `Deno.env.get()`; validated at start | ✅ |
| 4 | **CORS** preflight + headers on all responses | 02 | `_shared/cors.ts`, handleCors, corsHeaders on every response | ✅ |
| 5 | **HTTP status codes** 200/400/401/405/500 | 04-error-handling | 200 success; 400 invalid input/short/long; 401 no user; 405 not POST; 500 catch-all | ✅ |
| 6 | **Consistent error body** (JSON, no stack to client) | 04 | `JSON.stringify({ error: ... })`, no internal details to client | ✅ |
| 7 | **DB: supabase-js only**, no raw Pool in validator | 06-database-connections | Only createClient (anon + service role); no direct Postgres pool | ✅ |
| 8 | **Background work** after response | 08-background-tasks | Pipeline started without await; response returned then `runPipeline().catch().finally()` | ✅ |
| 9 | **waitUntil** for background (official pattern) | 08 | Uses fire-and-forget promise, not `EdgeRuntime.waitUntil()` | ⚠️ Optional: align with waitUntil for doc clarity; behavior is correct on Deno Deploy |
| 10 | **beforeunload** cleanup | 08 | `addEventListener('beforeunload', ...)` marks session failed | ✅ |
| 11 | **Input validation** (length, sanitization) | 02 (don’t trust client) | 10–5000 chars, HTML stripped | ✅ |
| 12 | **No secrets in logs** | 02, 04 | No logging of API keys or tokens | ✅ |

### 9.3 Summary vs Supabase / Edge Docs

| Source | Pass | Warn (optional) | Fail |
|--------|------|------------------|------|
| Postgres best practices | 4 | 2 | 0 |
| Edge best practices | 10 | 1 | 0 |

**Verdict:** Implementation is **correct** against both Supabase Postgres and Edge best practices. Optional improvements: composite index on `(session_id, agent_name)` for validator_runs; consider `EdgeRuntime.waitUntil()` for background pipeline for alignment with official Edge docs.

---

**Verdict:**  
- **Plan (v2):** Internally consistent and correct for the target architecture; only report section count (14 vs 15) should be standardized.  
- **Implementation (v1):** Correct and aligned with Supabase/Deno/Gemini best practices for the **current** monolith design. It does **not** implement v2 (no per-agent functions, no validator_agent_runs, no degraded_success, no per-agent retry).  
- **Vs Supabase Postgres & Edge docs:** Implementation matches official Postgres and Edge guidance; optional tweaks (composite index, waitUntil) only.  
- **To be 100% correct to the plan:** Execute migration strategy in 05 (DB → shared modules → agent functions → orchestrator → frontend → cutover) and fix the verifier comment + doc section count to 15.
