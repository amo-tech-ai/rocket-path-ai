# Validator v2 — Improved Plan & Forensic Audit

> **Date:** 2026-02-08 | **Auditor:** Claude Opus 4.6 | **Scope:** Strategy docs 01-05, v1 implementation, Supabase/Gemini/Deno official docs

---

## 1. Executive Summary

The v2 strategy (docs 01-05) is **internally consistent and architecturally sound**. However, the **implementation is still v1** (monolith pipeline). This audit identifies 4 critical blockers, 4 high-priority fixes, 4 medium improvements, and provides corrected diagrams, a migration checklist, and verification against official Supabase Postgres, Edge Function, and Gemini 3 documentation.

**Key discovery:** Supabase paid plans now support **400s wall-clock** (up from 150s). This fundamentally changes the v2 timeout strategy — Composer can get 120s independently.

---

## 2. Diagrams

All diagrams exported to `diagrams/` subdirectory as SVG.

| Diagram | File | Purpose |
|---------|------|---------|
| V1 vs V2 Architecture | `diagrams/v1-vs-v2-architecture.svg` | Side-by-side comparison |
| Audit Findings by Severity | `diagrams/audit-findings-severity.svg` | All issues categorized |
| V2 Happy Path Sequence | `diagrams/v2-happy-path-sequence.svg` | Full pipeline flow |
| V2 Migration Timeline | `diagrams/v2-migration-timeline.svg` | Gantt chart with phases |
| V2 Session State Machine | `diagrams/v2-session-state-machine.svg` | Corrected 5-state model |
| V2 Database Schema | `diagrams/v2-database-schema.svg` | ER diagram with all fields |

---

## 3. Findings: Errors, Breaks, Failure Points

### 3.1 CRITICAL (Blockers for v2)

| ID | Issue | Location | Impact | Fix |
|----|-------|----------|--------|-----|
| **C1** | Session status enum mismatch | DB CHECK constraint vs strategy | v2 statuses (`queued`, `success`, `degraded_success`) cannot be stored | Migration: ALTER CHECK to include all 5 states |
| **C2** | No `validator_agent_runs` table | Strategy 02, 05 vs DB | No `attempt` column = no idempotent retry | Create table with `(session_id, agent_name, attempt)` unique |
| **C3** | No per-agent retry endpoint | Strategy 03, 04 | Frontend cannot "Retry MVP" without re-running all agents | Build retry API in orchestrator |
| **C4** | Fire-and-forget without `waitUntil` | `validator-start/index.ts:150` | Supabase docs now recommend `EdgeRuntime.waitUntil()` for background work | Wrap pipeline promise in `waitUntil` |

### 3.2 HIGH (Should fix)

| ID | Issue | Location | Impact | Fix |
|----|-------|----------|--------|-----|
| **H1** | Verifier comment "14 required sections" | `verifier.ts:19` | Comment is wrong; array has 15 items | Change comment to "15 required sections" |
| **H2** | Composer `maxOutputTokens: 4096` causes truncation | `composer.ts:97` | Gemini 3 has known ~4k token output issues; JSON gets truncated | Increase to 8192 + keep repair fallback; or upgrade Composer to `gemini-3-pro` |
| **H3** | Pipeline deadline 115s vs 400s available | `pipeline.ts:33` | Paid plan now allows 400s; current 115s is unnecessarily tight | Increase to 300s for v1; remove shared deadline in v2 |
| **H4** | No composite index on `validator_runs` | DB schema | Queries by `(session_id, agent_name)` do sequential scan | `CREATE INDEX idx_validator_runs_session_agent ON validator_runs(session_id, agent_name)` |

### 3.3 MEDIUM (Nice to have)

| ID | Issue | Location | Impact | Fix |
|----|-------|----------|--------|-----|
| **M1** | Prompts inline in agent files | `agents/*.ts` | Hard to audit/version prompts independently | Extract to `_shared/prompts/*.ts` |
| **M2** | No `agent_dag` JSONB on sessions | DB schema | Cannot track DAG execution state | Add column in v2 migration |
| **M3** | No idempotency key on session create | `index.ts:113-122` | Duplicate sessions on network retry | Add `idempotency_key` column |
| **M4** | Zombie cleanup only on poll | `validator-status` | Stale running sessions persist until polled | Add periodic cleanup or Supabase cron |

---

## 4. Verification Against Official Docs

### 4.1 Gemini 3 API (google.dev/gemini-api)

| # | Check | Code | Official Doc | Result | Action |
|---|-------|------|-------------|--------|--------|
| 1 | `responseMimeType` + `responseJsonSchema` | `gemini.ts:40-46` | Confirmed: correct pattern for structured output | PASS | None |
| 2 | `thinkingConfig.thinkingLevel` (string) | `gemini.ts:50-53` | Confirmed: `thinkingLevel` not legacy `thinkingBudget` | PASS | None |
| 3 | Temperature 1.0 | `gemini.ts:38` | Confirmed: DO NOT lower below 1.0 for Gemini 3 | PASS | None |
| 4 | API key in `x-goog-api-key` header | `gemini.ts:100` | Confirmed: header, not query param | PASS | None |
| 5 | `v1beta` endpoint | `gemini.ts:77` | Confirmed: still the active endpoint for Gemini 3 | PASS | None |
| 6 | `finishReason: MAX_TOKENS` handling | `gemini.ts:148-151` | Confirmed: must check and log; response may be truncated | PASS | Added in today's fix |
| 7 | Thinking + JSON schema incompatible | `gemini.ts:50-53` | Confirmed: cannot use both together | PASS | Code correctly deletes schema when thinking enabled |
| 8 | `maxOutputTokens` truncation risk | `composer.ts:97` | KNOWN ISSUE: Gemini 3 ~4k token output limit reported | WARN | Increase to 8192 or use Pro model |
| 9 | Google Search + structured output combo | `research.ts:91-96` | Confirmed: now works together as of Gemini 3 | PASS | None |
| 10 | URL Context limits (20 URLs, 34MB) | Gemini skill ref | Confirmed in docs | PASS | Research agent uses it correctly |

### 4.2 Supabase Edge Functions (supabase.com/docs)

| # | Check | Code | Official Doc | Result | Action |
|---|-------|------|-------------|--------|--------|
| 1 | `Deno.serve()` pattern | `index.ts:34` | Confirmed: still the standard | PASS | None |
| 2 | Wall-clock limit | `pipeline.ts:33` (115s) | **UPDATED: 400s on paid plans** | WARN | Increase budget; v2 agents get own 400s |
| 3 | `beforeunload` cleanup | `index.ts:17-32` | Still recommended for cleanup | PASS | None |
| 4 | Background work pattern | `index.ts:150-152` | **CHANGED: Use `EdgeRuntime.waitUntil()`** | FAIL | Wrap `runPipeline()` in `waitUntil` |
| 5 | Inter-function fetch | N/A (v1 monolith) | Use service role key + standard fetch | N/A | Implement in v2 |
| 6 | `AbortSignal.timeout()` on Deno Deploy | `gemini.ts:91` | No official fix; `Promise.race` workaround confirmed valid | PASS | Current workaround is correct |
| 7 | CORS preflight + headers | `_shared/cors.ts` | Matches official pattern | PASS | None |
| 8 | Service role vs anon key | `index.ts:61-66` | User client for RLS ops, admin for backend | PASS | None |
| 9 | Input validation | `index.ts:96-108` | Sanitize user input, length checks | PASS | None |
| 10 | No secrets in logs | All files | No API keys logged | PASS | None |

### 4.3 Supabase Postgres Best Practices (skill)

| # | Check | Code | Best Practice | Result | Action |
|---|-------|------|--------------|--------|--------|
| 1 | RLS enabled on tenant tables | Migrations | `security-rls-basics`: ENABLE ROW LEVEL SECURITY | PASS | None |
| 2 | RLS policies use `auth.uid()` | Migrations | User isolation via `auth.uid() = user_id` | PASS | None |
| 3 | FK columns indexed | Migrations | `schema-foreign-key-indexes`: Always index FKs | PASS | `idx_validator_runs_session_id` exists |
| 4 | Composite index for multi-column queries | DB | `query-composite-indexes`: Create for WHERE pairs | WARN | Add `(session_id, agent_name)` composite |
| 5 | Primary key strategy | DB | `schema-primary-keys`: UUIDv4 ok for moderate volume | PASS | Consider UUIDv7 for v2 at scale |
| 6 | JSONB indexing | DB | `advanced-jsonb-indexing`: GIN for containment queries | N/A | Not needed yet (no JSONB WHERE clauses) |
| 7 | Batch inserts | `index.ts:135-145` | `data-batch-inserts`: Multiple rows in single INSERT | PASS | 7 runs inserted in one batch |
| 8 | Short transactions | `pipeline.ts` | `lock-short-transactions`: Don't hold locks during AI calls | PASS | No transactions span AI calls |

---

## 5. Strategy Plan Corrections

Changes needed to the strategy docs (01-05) based on this audit:

### 5.1 Corrections to Apply

| Doc | Section | Current | Corrected |
|-----|---------|---------|-----------|
| 01 | Section 4.1 critical path | "95s" and "104s" | Irrelevant with 400s limit; update to note agents are independent |
| 01, 05 | Report section count | "14-section" in some places | Standardize to **15 sections** everywhere |
| 02 | Composer model | `gemini-3-pro` | Confirm: upgrade from Flash to Pro for Composer |
| 02 | Timeouts table | 90s Research, 120s Competitors | Validated: generous but reasonable with 400s limit |
| 04 | Dispatch pattern | "Option B: Direct Invoke" | Add note: use `EdgeRuntime.waitUntil()` for fire-and-forget dispatch |
| 05 | Wall-clock limit | "150s Deno Deploy limit" | **Correct to 400s on paid plans** |
| 05 | Phase 1 DB migration | Only `validator_agent_runs` | Add: session status enum migration + composite index |
| 99 | Audit results | Various | Superseded by this document (06) |

### 5.2 New Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Background work | `EdgeRuntime.waitUntil()` | Official Supabase docs now recommend this over fire-and-forget |
| Wall-clock budget | 400s per agent (paid plan) | Removes the core constraint that drove v2 architecture |
| Composer model | `gemini-3-pro-preview` | Better JSON generation for 15-section report; 120s budget feasible |
| Composer `maxOutputTokens` | 8192 (up from 4096) | Prevents truncation; repair fallback still active as safety net |
| `extractJSON` repair | Keep in `_shared/gemini.ts` | Proven fix for truncated JSON; zero-cost safety net |

---

## 6. Improved Implementation Checklist

### Phase 0: Immediate V1 Fixes (Today)

- [x] Fix `extractJSON` truncated JSON repair (`_shared/gemini.ts`)
- [x] Fix Composer array unwrap (`agents/composer.ts`)
- [x] Add `finishReason: MAX_TOKENS` logging (`_shared/gemini.ts`)
- [x] Deploy `validator-start` with fixes
- [ ] Fix verifier comment: "14" -> "15" (`verifier.ts:19`)
- [ ] Add `EdgeRuntime.waitUntil()` to `validator-start/index.ts:150`
- [ ] Increase pipeline deadline: 115s -> 300s (`pipeline.ts:33`)
- [ ] Consider increasing Composer `maxOutputTokens`: 4096 -> 8192

### Phase 1: Database Migration

- [ ] Create `validator_agent_runs` table:
  ```sql
  CREATE TABLE validator_agent_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES validator_sessions(id),
    agent_name TEXT NOT NULL,
    attempt INT NOT NULL DEFAULT 0,
    model_used TEXT,
    tool_used TEXT,
    status TEXT NOT NULL DEFAULT 'queued'
      CHECK (status IN ('queued','running','ok','partial','failed')),
    output_json JSONB,
    citations JSONB,
    error_message TEXT,
    duration_ms INT,
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (session_id, agent_name, attempt)
  );
  ```
- [ ] Add composite index: `CREATE INDEX idx_agent_runs_session_agent ON validator_agent_runs(session_id, agent_name)`
- [ ] Migrate session status CHECK: `ALTER TABLE validator_sessions DROP CONSTRAINT ...; ALTER TABLE validator_sessions ADD CONSTRAINT ... CHECK (status IN ('queued','running','success','degraded_success','failed','complete','partial'))`
- [ ] Add `agent_dag JSONB` column to `validator_sessions`
- [ ] Enable RLS on `validator_agent_runs` + policies
- [ ] Add composite index on existing `validator_runs`: `CREATE INDEX idx_validator_runs_session_agent ON validator_runs(session_id, agent_name)`

### Phase 2: Shared Modules

- [ ] Extract prompts from agent files to `_shared/prompts/`:
  - `extract.ts`, `research.ts`, `competitors.ts`, `score.ts`, `mvp.ts`, `compose.ts`
- [ ] Create `_shared/db.ts` agent CRUD helpers (read output, write output, update status)
- [ ] Move `types.ts` and `schemas.ts` to `_shared/`
- [ ] Ensure all shared files are importable from any edge function

### Phase 3: Agent Edge Functions

For each agent:
- [ ] Create `supabase/functions/validator-agent-{name}/index.ts`
- [ ] Read inputs from `validator_agent_runs.output_json` (DB relay)
- [ ] Call Gemini with agent-specific config
- [ ] Write output to `validator_agent_runs.output_json`
- [ ] Trigger next agent(s) via `fetch()` with service role key
- [ ] Exit cleanly

Agent-specific notes:
- [ ] **Extractor** (20s): `responseJsonSchema`, Flash model
- [ ] **Research** (90s): Google Search + URL Context + RAG, Flash
- [ ] **Competitors** (120s): Google Search only, Flash
- [ ] **Scoring** (45s): `thinking: high`, Flash (disables schema)
- [ ] **MVP** (60s): `responseJsonSchema`, Flash
- [ ] **Composer** (120s): **Upgrade to `gemini-3-pro-preview`**, `thinking: medium`, `maxOutputTokens: 8192`
- [ ] **Verifier** (5s): Pure JS, no Gemini call

### Phase 4: Orchestrator

- [ ] Create `validator-orchestrate/index.ts`
- [ ] Auth: JWT validation, rate limit (heavy)
- [ ] Create session + 7 agent runs (all `queued`)
- [ ] Use `EdgeRuntime.waitUntil()` for dispatch
- [ ] Dispatch Extractor via `fetch()` (fire-and-forget)
- [ ] Return 200 `{session_id}` immediately
- [ ] Add retry endpoint: `POST /validator-orchestrate {session_id, retry: "MVP"}`
  - Creates new agent run with `attempt: 1`
  - Triggers single agent + re-compose + re-verify
- [ ] Update `validator-status` to read from `validator_agent_runs`

### Phase 5: Frontend

- [ ] Update progress tracker for per-agent status from `validator_agent_runs`
- [ ] Add "Retry {Agent}" buttons for failed optional agents
- [ ] Handle `degraded_success` status:
  - Show report with warnings
  - Highlight missing sections
  - Show retry CTAs
- [ ] Map `success` -> green, `degraded_success` -> amber, `failed` -> red

### Phase 6: Cutover

- [ ] Deploy all new edge functions
- [ ] Run 10 consecutive E2E tests (acceptance criteria)
- [ ] Switch frontend to `validator-orchestrate`
- [ ] Monitor for 48h
- [ ] Deprecate `validator-start`

---

## 7. Acceptance Criteria

| # | Criterion | Measurement |
|---|-----------|-------------|
| 1 | 10 consecutive E2E runs with no "pipeline failed at 57%" | 10/10 success or degraded_success |
| 2 | MVP timeout does NOT block report generation | Session = `degraded_success`, report has 13/15 sections |
| 3 | "Retry MVP" re-runs only MVP and updates report | Only 1 new agent run row, Composer re-runs, session upgrades |
| 4 | Per-agent logs are isolated | Each function has separate log stream in Supabase dashboard |
| 5 | Session statuses match: `success`, `degraded_success`, `failed` | DB query confirms correct terminal states |
| 6 | Composer gets full 120s budget | No truncated JSON due to shared deadline |
| 7 | `extractJSON` repair handles truncated output | Log shows "Repaired truncated JSON" when triggered |
| 8 | Frontend shows per-agent progress | Each agent status updates independently during polling |
| 9 | Retry buttons work per agent | Click "Retry Competitors" -> only Competitors re-runs |
| 10 | All 15 report sections verified | Verifier checks 15 sections, no "14" references remain |

---

## 8. Risk Matrix (Updated)

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Inter-agent dispatch fails silently | High | Medium | Agent writes `triggered_next` flag; status endpoint detects stuck agents after 5min |
| Deno Deploy cold starts add latency | Medium | High | Accept 2-3s per agent; Supabase keeps warm on paid plans |
| Retry creates duplicate agent runs | High | Low | Unique constraint `(session_id, agent_name, attempt)` |
| Migration breaks existing sessions | High | Low | Keep v1 running; no shared tables; feature flag for v2 |
| Gemini 3 token truncation (~4k) | Medium | Medium | `extractJSON` repair + increase `maxOutputTokens` to 8192 |
| Composer array-wrapped JSON `[{}]` | Medium | Low | Array unwrap in both Composer and frontend (already fixed) |
| `EdgeRuntime.waitUntil` not available | Low | Low | Fallback to fire-and-forget (current pattern works) |
| 8 function deployments slow CI/CD | Low | Medium | Deploy in parallel; shared modules reduce per-function code |

---

## 9. Summary: What Is Correct vs What Needs Change

### Correct (Keep As-Is)

| Item | Location | Why It's Correct |
|------|----------|-----------------|
| Gemini API key in header | `gemini.ts:100` | G4: Matches official docs |
| Temperature 1.0 | `gemini.ts:38` | G2: Gemini 3 requires it |
| `responseJsonSchema` + `responseMimeType` | `gemini.ts:40-46` | G1: Guarantees valid JSON |
| `thinkingConfig.thinkingLevel` | `gemini.ts:50-53` | Matches Gemini 3 API, not legacy `thinkingBudget` |
| `AbortSignal.timeout` + `Promise.race` | `gemini.ts:88-134` | Workaround for Deno Deploy body-read issue |
| `extractJSON` multi-fallback + repair | `gemini.ts:194-275` | Handles truncated JSON, array wrap, code fences |
| Composer array unwrap | `composer.ts:100-102` | Handles Gemini `[{}]` wrapping |
| RLS on all tables | Migrations | Matches `security-rls-basics` |
| Service role for admin, anon for user | `index.ts:61-66` | Matches Supabase auth pattern |
| `beforeunload` isolate cleanup | `index.ts:17-32` | Matches Deno Deploy best practice |
| Batch INSERT for agent runs | `index.ts:135-145` | Matches `data-batch-inserts` |
| Input sanitization (HTML strip, length) | `index.ts:96-108` | Security best practice |
| Competitors as background promise | `pipeline.ts:83-91` | Non-blocking critical path |
| Grace period for Competitors | `pipeline.ts:136-153` | Maximizes data for Composer |
| Checkpoint before Composer | `pipeline.ts:157-171` | Saves progress if isolate dies |
| Safety net catch-all | `pipeline.ts:257-270` | Session never stuck "running" |

### Needs Change

| Item | Location | What to Change |
|------|----------|---------------|
| `EdgeRuntime.waitUntil()` | `index.ts:150` | Wrap `runPipeline()` in `waitUntil` |
| Pipeline deadline 115s | `pipeline.ts:33` | Increase to 300s (400s limit on paid) |
| Verifier comment "14" | `verifier.ts:19` | Change to "15 required sections" |
| Composer `maxOutputTokens` | `composer.ts:97` | Increase 4096 -> 8192 |
| Session status enum | DB CHECK constraint | Add `queued`, `success`, `degraded_success` |
| No composite index | `validator_runs` | Add `(session_id, agent_name)` index |
| Strategy docs section count | 01, 05 | Standardize all to "15 sections" |
| Strategy docs wall-clock | 01, 05 | Update from "150s" to "400s on paid plans" |

---

## 10. Updated 00-INDEX Reference

Add this document to the strategy index:

```
| 06 | [06-improved-plan-audit.md](06-improved-plan-audit.md) | Forensic audit — errors, gaps, corrections, improved checklist, official docs verification |
```
