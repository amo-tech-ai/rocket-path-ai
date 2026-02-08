# Validator Pipeline Checklist

> **Date:** 2026-02-08 | **Session:** Chat-to-Validator E2E Test

---

## 1. Chat Flow (ValidateIdea page)

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1.1 | Page loads at `/validate` | PASS | 3-panel layout: Extraction, Chat, Readiness |
| 1.2 | Welcome message displays | PASS | "Tell me about your startup idea" |
| 1.3 | User can type in chat input | PASS | Textarea with 500 char recommendation |
| 1.4 | Quick prompts work | PASS | 8 quick prompts in right panel |
| 1.5 | First message extracts fields | PASS | 7/8 fields captured from single message |
| 1.6 | Extraction Progress updates live | PASS | Green "Captured" badges appear |
| 1.7 | Coverage Score updates | PASS | Jumped to 88% after first message |
| 1.8 | AI asks follow-up for missing fields | PASS | Asked for References (websites) |
| 1.9 | Second message fills remaining fields | PASS | 8/8 fields, 100% coverage |
| 1.10 | "Ready to generate" prompt appears | PASS | Right panel shows ready state |
| 1.11 | Generate button triggers pipeline | PASS | Navigates to `/validator/run/{id}` |

## 2. Pipeline Execution (ValidatorProgress page)

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 2.1 | Progress page loads with 7 agents | PASS | All agents listed with icons |
| 2.2 | ExtractorAgent completes | PASS | 6.6s, Flash model |
| 2.3 | ResearchAgent completes | PASS | 19.4s, Google Search + Citations badge |
| 2.4 | CompetitorAgent completes | **FAIL** | Timed out at 25s (fixed: now 35s) |
| 2.5 | ScoringAgent completes | PASS | 11.9s, thinking: high |
| 2.6 | MVPAgent completes | PASS | 9.7s |
| 2.7 | ComposerAgent completes | **FAIL** | Timed out (fixed: budget now 55s) |
| 2.8 | VerifierAgent completes | FAIL | Never started (blocked by Composer) |
| 2.9 | Report saved to validation_reports | FAIL | Composer never produced output |
| 2.10 | Session status updated to complete | **FAIL** | Stuck as "running" (Deno killed isolate) |
| 2.11 | Redirect to report page on success | FAIL | Error page shown instead |

## 3. Fixes Applied

| # | Fix | File | What Changed |
|---|-----|------|--------------|
| 3.1 | Competitors timeout 25s -> 35s | `config.ts:38` | `AGENT_TIMEOUTS.competitors = 35_000` |
| 3.2 | Composer timeout 35s -> 55s | `config.ts:41` | `AGENT_TIMEOUTS.composer = 55_000` |
| 3.3 | Composer budget uncapped | `agents/composer.ts:102` | Removed `Math.min()` cap, uses pipeline dynamic budget |
| 3.4 | Zombie session cleaned | DB | Updated stuck session to "failed" |

## 4. Gemini Implementation vs Skill Docs Audit

Compared `gemini.ts` against `.agents/skills/gemini/SKILL.md` (G1-G6 rules):

| Rule | Requirement | Implementation | Status |
|------|-------------|----------------|--------|
| **G1** | Use `responseJsonSchema` + `responseMimeType` | `responseMimeType: 'application/json'` always set. `responseJsonSchema` passed when available. Correctly removed when thinking mode is active (incompatible). | PASS |
| **G2** | Temperature 1.0 for Gemini 3 | `temperature: 1.0` hardcoded at line 37 | PASS |
| **G3** | Combine schema with Google Search | Schema + googleSearch used together (extractor, competitors). Composer can't use schema (too complex) but uses `responseMimeType` + `extractJSON` fallback | PASS |
| **G4** | API key in `x-goog-api-key` header | Header used at line 101, NOT query param | PASS |
| **G5** | Extract `groundingChunks` citations | Extracted at lines 136-143, returned as `citations` array | PASS |
| **G6** | Use camelCase for tool names | `googleSearch` and `urlContext` (camelCase) | PASS |
| **Retry** | Exponential backoff for 429/5xx | `RETRYABLE_CODES = [429, 500, 502, 503, 504]`, delay `1s, 2s, 4s` | PASS |
| **Thinking** | Use `thinkingLevel` not `thinkingBudget` | `thinkingConfig: { thinkingLevel }` at line 50 | PASS |
| **Thinking+Schema** | Can't use both simultaneously | Schema deleted when thinking active (line 52) | PASS |
| **Timeout** | Per-agent AbortSignal | `AbortSignal.timeout(timeoutMs)` at line 93 | PASS |
| **SDK** | Use `npm:@google/genai@^0.21.0` | Uses raw `fetch()` REST API (valid alternative per docs) | PASS |

### Gemini Issues Found

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| G-1 | Composer schema too complex for `responseJsonSchema` (400 error) | Low | Expected - uses `extractJSON` fallback |
| G-2 | Thinking mode disables JSON schema enforcement | Medium | Handled - only ScoringAgent uses thinking:high, schema is removed |
| G-3 | `maxOutputTokens: 8192` may be low for 15-section Composer report | **High** | Should increase to 16384 for Composer |

## 5. Timeout Budget Analysis

```
Pipeline wall-clock: 130s (Deno Deploy limit: 150s, 20s buffer)

Actual timing from test run:
  ExtractorAgent:   6.6s
  ResearchAgent:   19.4s  (parallel with Competitors)
  CompetitorAgent: 25.3s  (FAILED - timeout)
  ScoringAgent:    11.9s
  MVPAgent:         9.7s
  ComposerAgent:    ???   (FAILED - timeout)
  VerifierAgent:    N/A

Total before Composer: ~53s
Remaining for Composer: 130 - 53 - 10 = ~67s (dynamic budget)
Old Composer cap: 35s (too low!)
New Composer cap: 55s (matches needs)
```

## 6. Security Fixes (from previous session)

| # | Fix | File | Status |
|---|-----|------|--------|
| 6.1 | RLS on organizations table | `20260208100000_organizations_rls.sql` | CREATED |
| 6.2 | CORS origin restriction | `_shared/cors.ts` | FIXED |
| 6.3 | Rate limiting (5 req/5min) | `_shared/rate-limit.ts` + `validator-start/index.ts` | CREATED + WIRED |
| 6.4 | Drop dev bypass policies | `20260208100001_drop_dev_bypass_policies.sql` | CREATED |
| 6.5 | Code splitting (React.lazy) | `src/App.tsx` | FIXED |
| 6.6 | Fix failing tests (localStorage) | `src/test/setup.ts` | FIXED |

## 7. Build & Test Verification

| Check | Result |
|-------|--------|
| `npm run build` | PASS (6.47s) |
| `npm run test` | PASS (96/96 tests) |
| Code splitting active | PASS (40 lazy-loaded page chunks) |

## 8. Supabase Schema Audit (Postgres Best Practices)

Full audit: `docs/supabase-audit.md`

### 8.1 Tables & RLS

| Check | Result | Notes |
|-------|--------|-------|
| All tables have RLS enabled | **PASS** | 83/83 tables |
| All tables have RLS policies | **PASS** | No locked-out tables |
| SECURITY DEFINER functions set search_path | **PASS** | 50/50 functions |

### 8.2 RLS Performance (bare `auth.uid()` anti-pattern)

| Check | Result | Notes |
|-------|--------|-------|
| validator_sessions policies use `(SELECT auth.uid())` | **FIXED** | 4 policies rewritten |
| validator_runs policies use `(SELECT auth.uid())` | **FIXED** | 2 policies rewritten |
| validation_reports policies use `(SELECT auth.uid())` | **FIXED** | 2 policies rewritten |
| profiles policies use `(SELECT auth.uid())` | **FIXED** | 4 policies rewritten |
| Remaining 28 tables still bare `auth.uid()` | P2 | 73 policies across chat_*, assumptions, etc. |

Migration: `20260208_fix_rls_performance_and_missing_fk_indexes.sql`

### 8.3 Missing FK Indexes

| Check | Result | Notes |
|-------|--------|-------|
| activities (document_id, org_id) | **FIXED** | 2 indexes created |
| playbook_runs (startup_id) | **FIXED** | 1 index created |
| prompt_pack_runs (org_id, pack_id, startup_id) | **FIXED** | 3 indexes created |
| lean_canvases (playbook_run_id) | **FIXED** | 1 index created |
| pitch_decks (playbook_run_id) | **FIXED** | 1 index created |
| workflow_activity_log (org_id, task_id) | **FIXED** | 2 indexes created |
| workflow_queue (trigger_id) | **FIXED** | 1 index created |
| workflow_runs (queue_id, trigger_id) | **FIXED** | 2 indexes created |
| events (related_project_id) | **FIXED** | 1 index created |
| event_assets (parent_asset_id) | **FIXED** | 1 index created |
| jobs_to_be_done (related_functional_job_id) | **FIXED** | 1 index created |
| **Total** | **16/16 CREATED** | All use partial indexes (WHERE col IS NOT NULL) |

### 8.4 Duplicate Indexes

| Check | Result | Notes |
|-------|--------|-------|
| events: idx_events_startup_id_rls | **DROPPED** | Duplicate of idx_events_startup_id |
| startup_event_tasks: idx_startup_event_tasks_task | **DROPPED** | Duplicate of idx_startup_event_tasks_task_id |

### 8.5 Supabase Security Advisors

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| S1 | `vector` extension in public schema | WARN | P2 — move to extensions schema |
| S2 | `dashboard_metrics` materialized view accessible to anon | WARN | P1 — revoke anon SELECT |
| S3 | Leaked password protection disabled | WARN | P2 — enable in Auth settings |

### 8.6 Edge Functions

| Check | Result | Notes |
|-------|--------|-------|
| 33 edge functions deployed | PASS | All ACTIVE status |
| validator-start internal auth check | PASS | Verifies JWT + rate limiting |
| 25/33 have verify_jwt: false | WARN | Auth handled in app code (valid pattern) |

### 8.7 Triggers

| Check | Result | Notes |
|-------|--------|-------|
| All mutable tables have updated_at trigger | **PASS** | 89 triggers total |
| Realtime broadcast on key tables | **PASS** | contacts, deals, documents, events, etc. |
| Business logic triggers correct | **PASS** | Experiment sync, campaign dates, etc. |

### 8.8 Multiple Permissive Policies

| Table | Issue | Priority |
|-------|-------|----------|
| daily_focus_recommendations | Multiple SELECT for anon + authenticated | P2 |
| events | Multiple SELECT/INSERT/UPDATE for authenticated | P2 |
| profiles | Multiple SELECT for anon + authenticated | P2 |
| startup_members | Multiple SELECT for anon + authenticated | P2 |
| deck_templates | Multiple SELECT for authenticated | P2 |
| user_roles | Multiple SELECT for authenticated | P2 |

---

## 9. Remaining Issues (Next Steps)

| Priority | Issue | Action | Status |
|----------|-------|--------|--------|
| ~~**P0**~~ | ~~Composer maxOutputTokens too low~~ | ~~Increase to 16384~~ | **DONE** |
| ~~**P0**~~ | ~~Edge function not redeployed with timeout fixes~~ | ~~CLI deploy validator-start v29 + validator-status v8~~ | **DONE** (2026-02-08) |
| ~~**P0**~~ | ~~RLS bare auth.uid() on validator tables~~ | ~~Migration applied~~ | **DONE** |
| ~~**P0**~~ | ~~Missing FK indexes on active tables~~ | ~~16 indexes created~~ | **DONE** |
| ~~**P1**~~ | ~~Zombie session cleanup~~ | ~~pg_cron v1.6.4, `cleanup_zombie_sessions()` every 2min~~ | **DONE** (2026-02-08) |
| ~~**P1**~~ | ~~UI shows generic "Pipeline timed out"~~ | ~~Enhanced ValidatorProgress: partial results summary, per-agent error details~~ | **DONE** (2026-02-08) |
| ~~**P1**~~ | ~~dashboard_metrics accessible to anon~~ | ~~REVOKE ALL FROM anon, authenticated=SELECT only~~ | **DONE** (2026-02-08) |
| **P2** | 73 remaining RLS policies use bare auth.uid() | Batch migration for 28 tables | PENDING |
| **P2** | Multiple permissive policies on 6 tables | Consolidate overlapping policies | PENDING |
| **P2** | vector extension in public schema | Move to extensions schema | PENDING |
| **P2** | Leaked password protection disabled | Enable in Auth dashboard | PENDING |
| **P2** | Competitors uses Google Search only | Consider re-enabling urlContext | PENDING |
| **P2** | No retry on Composer timeout | Accept or split into 2 agents | PENDING |

## 10. Retest Plan

After deploying edge function fixes:

1. Navigate to `/validate`
2. Enter startup idea (cover all 8 fields)
3. Click Generate
4. Verify all 7 agents complete (green checkmarks)
5. Verify report page loads with 15 sections
6. Verify report is saved in `validation_reports` table
7. Verify session status is "complete" or "partial" (not "running")

---

*Generated by Claude Code audit | 2026-02-08*
