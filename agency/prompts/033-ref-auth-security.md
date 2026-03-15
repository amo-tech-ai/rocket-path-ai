---
task_id: 107-INF
title: Agency Auth & Security
phase: INFRASTRUCTURE
priority: P0
status: Not Started
estimated_effort: 0.5 day
skill: [data/supabase-postgres-best-practices, devops/security-hardening]
subagents: [security-auditor]
depends_on: [100-INF, 101-INF]
---

| Aspect | Details |
|--------|---------|
| **Screens** | None (infrastructure — auth, RLS, rate limiting, CORS) |
| **Features** | JWT verification, org isolation, rate limiting tiers, CORS enforcement, audit queries |
| **Edge Functions** | validator-start, lean-canvas-agent, investor-agent, sprint-agent, pitch-deck-agent, ai-chat (6 target EFs) |
| **Real-World** | "Every agency-enhanced edge function verifies JWT before loading fragments, queries user data through RLS, and respects rate limits" |

## Description

**The situation:** The agency integration adds prompt fragments, chat modes, MEDDPICC scoring, behavioral nudges, and evidence-tiered scoring across 6 existing edge functions and several new database tables. The existing security posture is strong — 88/89 tables have RLS, all edge functions verify JWT, CORS is restricted, and rate limiting covers three tiers. However, the agency features introduce new attack surfaces: fragment loading from disk, chat mode sessions tied to user data, org-scoped MEDDPICC scores, and client-side nudge state. Each of these needs explicit authorization rules, and the existing security contracts need verification against the new code paths.

**Why it matters:** A single authorization gap could expose one org's investor pipeline to another org, leak MEDDPICC deal verdicts, or allow unauthenticated fragment injection. The agency features touch the most sensitive data in the product — investor conversations, deal strategy, competitive positioning, and startup health scores. Security is P0 because every downstream feature prompt (002-024) depends on these guarantees holding.

**What already exists:**
- `supabase/functions/_shared/cors.ts` — Dynamic origin checking with `ALLOWED_ORIGINS` env var, `handleCors()` preflight handler, `requireMethod()` guard
- `supabase/functions/_shared/rate-limit.ts` — In-memory sliding window per user+function, 4 tiers: heavy (5/5min), standard (30/60s), light (120/60s), ingest (60/60s)
- `user_org_id()` — SECURITY DEFINER function returning the authenticated user's org_id
- `(SELECT auth.uid())` — Wrapped in subquery across all RLS policies for initPlan caching
- `agency/lib/agent-loader.ts` — `loadFragment()` and `loadChatMode()` using `Deno.readTextFile()`, server-side only
- All 6 target EFs already have JWT verification pattern: `getUser()` + 401 on failure
- RLS on 88/89 tables with org isolation via `user_org_id()`
- `has_role(uuid, app_role)` — Role check against `user_roles` table

**The build:**
1. Document the authorization contract for each agency code path (fragments, chat modes, MEDDPICC, nudges, scoring)
2. Define rate limiting tier assignments for every agency-enhanced endpoint
3. Provide JWT verification checklist for all 6 target edge functions
4. Supply SQL audit queries to verify RLS coverage on agency tables
5. Specify edge cases: cross-org data access, stale JWT, fragment path traversal, concurrent sessions
6. Define the security testing matrix for the agency test suite (task 022)

**Example:** Priya's edtech startup and Marcus's fintech startup are on the same Supabase instance. Marcus runs the validator with agency scoring fragments. The scoring agent loads `validator-scoring-fragment.md` from disk (no user data involved), then queries Marcus's startup profile through RLS-protected tables. Priya's startup data is invisible — `user_org_id()` returns Marcus's org, and all SELECT policies filter by `org_id = (SELECT public.user_org_id())`. If Marcus tries 6 pipeline runs in 5 minutes, the 6th returns 429 (heavy tier: 5/5min). His JWT expires mid-session — the edge function returns 401 and the frontend calls `refreshSession()` before retrying.

## Rationale

**Problem:** Agency features add new data flows (fragment loading, chat modes, MEDDPICC scoring, nudges) that must inherit the existing security guarantees without gaps. Without an explicit security contract, individual task implementers may miss authorization checks, apply wrong rate limiting tiers, or create tables without RLS.

**Solution:** A single infrastructure document that defines the authorization rules, rate limiting assignments, CORS behavior, and audit queries for every agency code path. This is the security checklist that task implementers reference before shipping.

**Impact:** Zero security regressions from agency features. Every new table has RLS. Every new endpoint has rate limiting. Every edge function verifies JWT. Org isolation is mathematically guaranteed by `user_org_id()` in all policies.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | know my investor data is only visible to my org | competitors on the same instance cannot see my deals |
| Founder | not get locked out by rate limiting during normal use | rate limits protect against abuse without blocking legitimate work |
| Developer | a clear JWT verification pattern for every EF | I don't accidentally ship an unauthenticated endpoint |
| Developer | audit queries I can run post-migration | I can verify RLS coverage on all agency tables before deploy |
| Security auditor | a complete threat model for agency features | I know what to test during the security review |

## Goals

1. **Primary:** Every agency code path has documented authorization rules, verified against the existing security infrastructure
2. **Quality:** Zero `FOR ALL` policies on agency tables, zero tables without RLS, zero endpoints without JWT verification

## Acceptance Criteria

- [ ] Fragment loading authorization documented — server-side only, no client import possible
- [ ] Chat mode authorization documented — JWT required before mode load + user data query
- [ ] MEDDPICC data isolation verified — `investors` and `deals` RLS covers `meddpicc_score`, `deal_verdict`
- [ ] Behavioral nudge security documented — org-scoped, no sensitive data in messages
- [ ] Rate limiting tier assigned to every agency-enhanced endpoint (table below)
- [ ] CORS behavior verified — no new endpoints exposed, all 6 EFs use `_shared/cors.ts`
- [ ] JWT verification checklist completed for all 6 target EFs
- [ ] SQL audit queries pass on all agency tables (0 rows = compliant)
- [ ] No `FOR ALL` policies on any agency table
- [ ] All UPDATE policies have WITH CHECK clause

---

## Security Contracts

### Contract 1: Fragment Loading Authorization

Fragments are markdown files read from disk by `agency/lib/agent-loader.ts` using `Deno.readTextFile()`.

**Authorization model:** None needed at the fragment level. Fragments are static knowledge files (like system prompts) that contain no user data. Authorization happens at the edge function level, which verifies JWT before calling `loadFragment()`.

**Invariants:**
- `loadFragment()` uses `Deno.readTextFile()` — a Deno-only API unavailable in browsers
- Fragment paths are constructed via `new URL(name, PROMPTS_DIR)` — relative to the module, not user input
- The `name` parameter comes from hardcoded constants (`FRAGMENTS` array), not from request bodies
- If `agent-loader.ts` is accidentally imported client-side, it fails at `Deno.readTextFile()` — no file access, no security risk

**Path traversal defense:** Fragment names are validated against the `FRAGMENTS` const array. Even if a name like `../../etc/passwd` were passed, `Deno.readTextFile()` would resolve relative to `PROMPTS_DIR` (the `agency/prompts/` directory), and the file would not exist — returning empty string via the catch handler.

**Rule:** Fragment loading never happens client-side. The `agency/lib/` directory is server-only code deployed alongside edge functions.

### Contract 2: Chat Mode Authorization

Chat modes are loaded by `loadChatMode()` using the same pattern as fragments — Deno file read, server-side only.

**Authorization model:** The edge function (e.g., `ai-chat`) verifies JWT before loading the chat mode. Chat modes may reference user-specific context (startup profile, investor pipeline), but that data is queried through RLS-protected Supabase tables — the mode file itself contains only prompt templates.

**Session isolation:**
- Each chat mode session links to the authenticated user via `chat_sessions.user_id`
- `chat_sessions` table has RLS: `user_id = (SELECT auth.uid())`
- User A cannot read or write User B's chat session
- Chat history is org-scoped if the table uses `org_id` — verify via `user_org_id()`

**Rule:** Edge function verifies JWT before loading mode AND before querying any user data. The sequence is:
1. Verify JWT (401 on failure)
2. Load chat mode from disk (static, no auth needed)
3. Query user data through RLS-protected client (org isolation guaranteed)
4. Combine mode prompt + user context and send to AI model

### Contract 3: MEDDPICC Data Isolation

MEDDPICC scoring adds `meddpicc_score JSONB` and `deal_verdict TEXT` columns to the existing `investors` table.

**Authorization model:** These columns inherit the existing `investors` RLS policies, which use `org_id = (SELECT public.user_org_id())`. No new policies needed for new columns on existing tables — RLS operates at the row level.

**Invariants:**
- `meddpicc_score` is visible only to org members (same visibility as `investors.name`, `investors.check_size`)
- `deal_verdict` (pursue/monitor/pass) same isolation
- The `investor-agent` edge function verifies JWT, then queries `investors` through a user-scoped Supabase client
- MEDDPICC scoring happens server-side (edge function) — the raw scoring logic is not exposed to the client

**Verification query:**
```sql
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'investors'
ORDER BY cmd;
-- Expect: SELECT, INSERT, UPDATE, DELETE policies all with org_id check
```

### Contract 4: Behavioral Nudge Security

Nudges are contextual banners triggered by client-side state analysis (stale sprint, empty canvas, etc.).

**Authorization model:** Nudge state is stored in localStorage (dismiss/snooze timestamps). No sensitive data is transmitted or stored in nudge messages — they contain only titles and CTA routes.

**If nudge state moves to database (future):**
- Table: `behavioral_nudges` with `user_id` column
- RLS: `user_id = (SELECT auth.uid())` — user sees only their own nudge dismissals
- Org-scoping: nudge triggers read from org-scoped tables (sprint_tasks, lean_canvases) through existing RLS

**Invariants:**
- Nudge messages contain no PII, no investor names, no financial data
- Nudge trigger evaluation reads data already authorized by existing RLS (sprint tasks, canvas boxes, validation reports)
- No new API endpoints for nudges (pure client-side in v1)

### Contract 5: Evidence-Tiered Scoring Security

The agency scoring fragments add evidence tiers (anecdote, survey, pilot, revenue) to the validator scoring agent.

**Authorization model:** Scoring runs inside `validator-start`, which verifies JWT and creates a `validation_session` tied to the user's org. Evidence tier labels are appended to system prompts via fragments — they are classification labels, not user data.

**Invariants:**
- Evidence tiers do not expose raw user data — they classify the strength of the user's claims
- Scoring results are stored in `validator_reports` (org-scoped RLS)
- The scoring fragment itself contains no user data — it defines rubrics, not results

---

## Rate Limiting Tier Assignments

| Endpoint / Action | Tier | Max/Window | Rationale |
|-------------------|------|------------|-----------|
| `validator-start` (with scoring fragment) | `heavy` | 5 / 5min | Multiple Gemini calls, pipeline runs 60-120s |
| `ai-chat` (with chat modes) | `standard` | 30 / 60s | Conversational rate, single Gemini call per message |
| `lean-canvas-agent` (with specificity fragment) | `standard` | 30 / 60s | Per-box suggestions, moderate Gemini usage |
| `investor-agent` (with MEDDPICC scoring) | `standard` | 30 / 60s | Deal scoring, multiple actions per session |
| `sprint-agent` (with RICE/Kano fragment) | `standard` | 30 / 60s | Task generation + prioritization |
| `pitch-deck-agent` (with challenger fragment) | `standard` | 30 / 60s | Deck generation, single call per action |
| Fragment loading (server-side file read) | **none** | unlimited | No network cost, no external API, no abuse vector |

**Implementation pattern in each EF:**
```typescript
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from '../_shared/rate-limit.ts'
import { getCorsHeaders } from '../_shared/cors.ts'

// After JWT verification:
const rateCheck = checkRateLimit(user.id, 'function-name', RATE_LIMITS.standard)
if (!rateCheck.allowed) {
  return rateLimitResponse(rateCheck, getCorsHeaders(req))
}
```

---

## CORS for Agency Endpoints

All 6 target edge functions already import and use `_shared/cors.ts`. The agency integration does not add new HTTP endpoints — it enhances existing ones by injecting fragment content into system prompts.

**Verification:** No new `Deno.serve()` handlers are created by agency tasks. All fragment loading happens inside existing edge function handlers.

**CORS checklist:**
- [ ] `validator-start` — uses `getCorsHeaders(req)` + `handleCors(req)` preflight
- [ ] `lean-canvas-agent` — same
- [ ] `investor-agent` — same
- [ ] `sprint-agent` — same
- [ ] `pitch-deck-agent` — same
- [ ] `ai-chat` — same

No changes needed. If future agency tasks create new edge functions, they must import `_shared/cors.ts` and follow the same pattern.

---

## JWT Verification Checklist

Every edge function that loads agency fragments or chat modes must verify JWT before any user data access.

**Required pattern (already present in all 6 EFs):**
```typescript
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  // 1. CORS preflight
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  // 2. JWT verification
  const authHeader = req.headers.get('Authorization')
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader! } } }
  )
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' }
    })
  }

  // 3. Rate limiting (after auth — keyed by user.id)
  const rateCheck = checkRateLimit(user.id, 'function-name', RATE_LIMITS.standard)
  if (!rateCheck.allowed) {
    return rateLimitResponse(rateCheck, getCorsHeaders(req))
  }

  // 4. NOW safe to load fragments and query user data
  const fragment = await loadFragment('validator-scoring-fragment')
  // ... business logic with RLS-protected queries
})
```

**Verification per EF:**

| Edge Function | JWT Check | Rate Limit | Fragment Load Point | Status |
|---------------|-----------|------------|---------------------|--------|
| `validator-start` | `auth.getUser()` L~20 | `RATE_LIMITS.heavy` | After JWT, before pipeline | Verify |
| `lean-canvas-agent` | `auth.getUser()` L~15 | `RATE_LIMITS.standard` | After JWT, before action dispatch | Verify |
| `investor-agent` | `auth.getUser()` L~12 | `RATE_LIMITS.standard` | After JWT, before MEDDPICC scoring | Verify |
| `sprint-agent` | `auth.getUser()` L~10 | `RATE_LIMITS.standard` | After JWT, before task generation | Verify |
| `pitch-deck-agent` | `auth.getUser()` L~18 | `RATE_LIMITS.standard` | After JWT, before deck generation | Verify |
| `ai-chat` | `auth.getUser()` L~20 | `RATE_LIMITS.standard` | After JWT, before mode load | Verify |

---

## Audit Queries

Run these queries after migrations to verify agency security posture.

### 1. RLS Enabled on All Agency Tables

```sql
-- Verify all agency-relevant tables have RLS enabled
-- Expected: 0 rows (all have RLS)
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'behavioral_nudges',
    'chat_mode_sessions',
    'sprint_tasks',
    'investors',
    'deals',
    'validator_reports',
    'validation_sessions',
    'lean_canvases',
    'pitch_decks',
    'contacts'
  )
  AND rowsecurity = false;
```

### 2. No FOR ALL Policies on Agency Tables

```sql
-- Verify no FOR ALL policies exist (should be split per operation)
-- Expected: 0 rows
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE cmd = 'ALL'
  AND tablename IN (
    'behavioral_nudges',
    'chat_mode_sessions',
    'sprint_tasks',
    'investors',
    'deals',
    'validator_reports',
    'validation_sessions'
  );
```

### 3. UPDATE Policies Have WITH CHECK

```sql
-- Verify UPDATE policies have WITH CHECK clauses
-- Expected: all UPDATE policies have non-null with_check
SELECT tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE cmd = 'UPDATE'
  AND tablename IN (
    'behavioral_nudges',
    'chat_mode_sessions',
    'sprint_tasks',
    'investors',
    'deals'
  )
  AND with_check IS NULL;
-- Should return 0 rows
```

### 4. Org Isolation via user_org_id()

```sql
-- Verify org-scoped tables use user_org_id() in policies
-- Expected: each org-scoped table has at least one policy referencing user_org_id
SELECT tablename, policyname, qual
FROM pg_policies
WHERE tablename IN ('investors', 'deals', 'sprint_tasks', 'lean_canvases', 'pitch_decks')
  AND qual LIKE '%user_org_id%';
-- Should return >= 1 row per table
```

### 5. auth.uid() Caching Compliance

```sql
-- Verify no bare auth.uid() in policies (should be wrapped in SELECT subquery)
-- Expected: 0 rows with bare auth.uid() (not wrapped in SELECT)
SELECT tablename, policyname, qual
FROM pg_policies
WHERE tablename IN (
    'behavioral_nudges',
    'chat_mode_sessions',
    'sprint_tasks',
    'investors',
    'deals'
  )
  AND qual LIKE '%auth.uid()%'
  AND qual NOT LIKE '%SELECT auth.uid()%'
  AND qual NOT LIKE '%select auth.uid()%';
```

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Reference | `agency/prompts/107-agency-auth-security.md` | This document (reference, not code) |
| Shared | `supabase/functions/_shared/rate-limit.ts` | Verify — no changes needed |
| Shared | `supabase/functions/_shared/cors.ts` | Verify — no changes needed |
| EF | `supabase/functions/validator-start/index.ts` | Verify — JWT + rate limit before fragment load |
| EF | `supabase/functions/lean-canvas-agent/index.ts` | Verify — JWT + rate limit before fragment load |
| EF | `supabase/functions/investor-agent/index.ts` | Verify — JWT + rate limit before MEDDPICC scoring |
| EF | `supabase/functions/sprint-agent/index.ts` | Verify — JWT + rate limit before fragment load |
| EF | `supabase/functions/pitch-deck-agent/index.ts` | Verify — JWT + rate limit before fragment load |
| EF | `supabase/functions/ai-chat/index.ts` | Verify — JWT + rate limit before chat mode load |
| Migration | `supabase/migrations/xxx_agency_rls_audit.sql` | Create — audit fixes if any queries above fail |
| Test | `agency/tests/auth-security.test.ts` | Create — 8+ tests (see test matrix below) |

---

## Security Testing Matrix (for task 022)

| Test | Category | Description |
|------|----------|-------------|
| `jwt-required-all-6-efs` | Auth | Each EF returns 401 without Authorization header |
| `expired-jwt-returns-401` | Auth | Expired token returns 401, not 500 |
| `cross-org-investor-invisible` | Isolation | User A cannot see User B's investors via direct query |
| `cross-org-meddpicc-invisible` | Isolation | User A cannot see User B's MEDDPICC scores |
| `cross-org-chat-session-invisible` | Isolation | User A cannot read User B's chat mode sessions |
| `rate-limit-heavy-enforced` | Rate Limit | 6th pipeline run in 5 min returns 429 |
| `rate-limit-standard-enforced` | Rate Limit | 31st chat message in 60s returns 429 |
| `fragment-missing-no-crash` | Resilience | Missing fragment returns empty string, EF continues |
| `cors-unknown-origin-blocked` | CORS | Request from unauthorized origin gets non-matching CORS header |
| `no-for-all-policies` | RLS | Audit query #2 returns 0 rows |

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| JWT expires mid-pipeline (300s run) | Pipeline uses service_role for DB writes; initial JWT check prevents unauthorized start |
| Fragment file deleted from disk | `loadFragment()` returns empty string, agent runs with base prompt only, logs warning |
| User switches org mid-session | `user_org_id()` returns new org; old session data invisible under new org's RLS |
| Concurrent fragment loads on cold start | Both read from disk, second cache write is idempotent (Map.set overwrites with same value) |
| Rate limit counter lost on isolate recycle | Deno Deploy spins up fresh isolate with empty Map; rate limits reset — acceptable tradeoff for in-memory approach |
| Chat mode references deleted startup | RLS returns empty result set for startup query; chat mode runs without user context, generic responses |
| Malformed Authorization header | `supabase.auth.getUser()` returns error; EF responds 401 |
| OPTIONS preflight without auth | `handleCors()` returns 200 with CORS headers — no JWT required for preflight (browser spec) |

## Real-World Examples

**Scenario 1 — Cross-org isolation:** Marcus (fintech startup, org A) and Priya (edtech startup, org B) are both on the same Supabase instance. Marcus opens the investor page and sees his 12 investors with MEDDPICC scores. Priya opens the same page — she sees her 8 investors, with her own MEDDPICC scores. Neither can see the other's data because every `investors` SELECT policy includes `org_id = (SELECT public.user_org_id())`. Marcus cannot craft a direct Supabase query to bypass this — RLS is enforced at the database level, and the Supabase client uses his JWT to determine `auth.uid()`.

**Scenario 2 — Rate limiting during heavy use:** Jake is stress-testing the validator. He submits 5 startup ideas in quick succession, each triggering the full 7-agent pipeline. All 5 complete successfully. He submits a 6th within the 5-minute window. The edge function returns `429 Too Many Requests` with `Retry-After: 180` header. The frontend shows a toast: "Rate limit reached. Try again in 3 minutes." Jake waits, then runs the 6th validation successfully. **With rate limiting,** the system protects against runaway AI costs ($0.02-0.05 per pipeline run) while allowing normal usage patterns.

**Scenario 3 — Stale JWT during chat mode:** Aisha opens the Practice Pitch chat mode and has a 45-minute conversation. Her JWT expires at the 30-minute mark. She sends the next message — the `ai-chat` edge function returns 401. The frontend's `useRealtimeAIChat` hook calls `supabase.auth.refreshSession()`, gets a new JWT, and retries the message. Aisha sees a brief loading state, then her response arrives. **With refresh-on-401,** long sessions don't break unexpectedly.

## Outcomes

| Before | After |
|--------|-------|
| No documented authorization contract for agency features | 5 explicit security contracts covering fragments, chat modes, MEDDPICC, nudges, scoring |
| Rate limiting tier assignments implicit | Explicit tier table for all 6 target EFs with rationale |
| No audit queries for post-migration verification | 5 SQL audit queries that return 0 rows when compliant |
| Security testing ad-hoc | 10-item security testing matrix integrated into task 022 |
| JWT verification assumed but not verified per-EF | Checklist with line numbers for all 6 edge functions |
| Cross-org isolation assumed from existing RLS | Verified with explicit queries against `user_org_id()` in policies |
| Fragment path traversal risk undocumented | Documented defense: const array validation + relative URL resolution + catch fallback |
| CORS behavior for agency features unclear | Confirmed: no new endpoints, all 6 EFs use `_shared/cors.ts`, no changes needed |

---

## Production Checklist

- [ ] All 5 audit queries return 0 rows
- [ ] JWT verification confirmed in all 6 EFs (manual code review)
- [ ] Rate limiting tier assigned and implemented in all 6 EFs
- [ ] No `FOR ALL` policies on any agency table
- [ ] All UPDATE policies have WITH CHECK clause
- [ ] `agent-loader.ts` not imported in any client-side code (grep for `agent-loader` in `src/`)
- [ ] No sensitive data in nudge messages (manual review of NudgeBanner content)
- [ ] `npm run build` passes
- [ ] `npm run test` passes (no regressions)
- [ ] Security test matrix items passing (task 022)

---

## Cross References

| Document | Path |
|----------|------|
| Infrastructure Index | `agency/prompts/100-index.md` |
| RLS Policies (101) | `agency/prompts/101-agency-rls-policies.md` |
| Schema Migrations (100) | `agency/prompts/100-agency-schema-migrations.md` |
| Agent Loader | `agency/lib/agent-loader.ts` |
| CORS Shared | `supabase/functions/_shared/cors.ts` |
| Rate Limit Shared | `supabase/functions/_shared/rate-limit.ts` |
| Test Suite (022) | `agency/prompts/022-agency-test-suite.md` |
| Supabase Best Practices | `.agents/skills/supabase-postgres-best-practices/SKILL.md` |
| Security Hardening Skill | `.agents/skills/devops/security-hardening/` |
| RLS Memory Note | `.claude/projects/-home-sk-startupai16L/memory/MEMORY.md` (Audit Session 34) |
