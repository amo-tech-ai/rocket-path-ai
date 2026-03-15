---
task_id: 101-INF
title: Agency RLS Policies
phase: INFRASTRUCTURE
priority: P0
status: Not Started
estimated_effort: 0.5 day
skill: [data/supabase-postgres-best-practices, devops/security-hardening, data/database-migration]
subagents: [supabase-expert, security-auditor]
edge_function: none (migration only)
schema_tables: [sprint_tasks, investors, chat_sessions, validation_reports, lean_canvases, pitch_decks, deals, behavioral_nudges, chat_mode_sessions]
depends_on: [100-INF]
---

| Aspect | Details |
|--------|---------|
| **Screens** | None (infrastructure migration only) |
| **Features** | RLS policies for all agency-touched tables, org isolation, user scoping |
| **Edge Functions** | None |
| **Real-World** | "Every agency feature column is protected by existing or new RLS policies — no cross-org data leaks" |

## Description

**The situation:** The agency feature set (prompts 001-024) adds new columns to 7 existing tables and creates 2 new tables. The existing tables already have RLS policies, but we need to verify those policies cover the new columns and that the new tables get full per-operation RLS from day one. Currently, `behavioral_nudges` and `chat_mode_sessions` have no RLS because the tables do not exist yet (created in prompt 100-INF). Without RLS, any authenticated user could read or modify another org's nudges or chat sessions.

**Why it matters:** RLS is the primary security boundary in Supabase. Every table without proper policies is a data leak risk. The agency features add sensitive data — MEDDPICC investor scores, deal verdicts, behavioral nudge triggers, and persistent chat sessions with AI coaching history. Cross-org exposure of this data would be a critical security incident.

**What already exists:**
- `sprint_tasks` — 4 RLS policies via campaign_id -> startup -> org chain (`supabase/migrations/20260308100200_create_missing_tables_events_cache.sql` L633-670)
- `investors` — 4 RLS policies via `startup_in_org(startup_id)` (`supabase/migrations/20260308100000_reconcile_rls_policies.sql` L571-589)
- `chat_sessions` — 5 RLS policies: user_id + org startup chain for SELECT/INSERT, user_id for UPDATE/DELETE, plus service_role FOR ALL (`supabase/migrations/20260204100300_create_chat_sessions.sql` L81-132)
- `validator_reports` — 3 RLS policies via session_id -> validator_sessions -> user_id, plus anon share token read (`supabase/migrations/20260308100000_reconcile_rls_policies.sql` L700-730)
- `lean_canvases` — 4 RLS policies via startup_id -> startups -> org_id join (`supabase/migrations/20260308100000_reconcile_rls_policies.sql` L283-316)
- `pitch_decks` — 4 RLS policies via `startup_in_org(startup_id)` (`supabase/migrations/20260308100000_reconcile_rls_policies.sql` L400-417)
- `deals` — 3 RLS policies for SELECT/UPDATE/DELETE via org join (`supabase/migrations/20260210120000_week6_assumption_board_weekly_review_soft_delete.sql` L113-122)
- `user_org_id()` — SECURITY DEFINER function returning org_id from profiles (`supabase/migrations/20260115201716_base_schema.sql` L155-163)
- `startup_in_org(uuid)` — SECURITY DEFINER function checking startup belongs to user's org (`supabase/migrations/20260115201716_base_schema.sql` L166-174)

**The build:**
1. Audit all 7 existing tables — confirm new agency columns (RICE/Kano, MEDDPICC, chat_mode, evidence tiers, specificity scores, win themes, deal verdicts) are covered by existing policies. Document findings.
2. Write full RLS for `behavioral_nudges` — org-scoped via `user_org_id()`, 4 per-operation policies.
3. Write full RLS for `chat_mode_sessions` — user-scoped via `auth.uid()` with org check, 4 per-operation policies.
4. Fix deals table — currently missing INSERT policy. Add it.
5. Remove redundant `service_role FOR ALL` policy on `chat_sessions` (service_role bypasses RLS automatically).
6. Produce verification queries to prove isolation works.

**Example:** Sarah runs StartupAI for her fintech startup (org A). Marcus runs a separate edtech startup (org B). Sarah's behavioral nudges ("Your sprint is stale") must never appear for Marcus. Her Practice Pitch chat sessions must never show in his sidebar. The MEDDPICC scores she computed for investor Sequoia must not leak to Marcus's investor pipeline. After this migration, every SELECT/INSERT/UPDATE/DELETE on these 9 tables is gated by org or user ownership.

## Rationale
**Problem:** 2 new tables have no RLS; 1 existing table is missing an INSERT policy; 1 table has a redundant service_role policy.
**Solution:** Full per-operation RLS on all agency-touched tables following the naming convention `{tablename}_{operation}_{role}`.
**Impact:** Zero cross-org data leaks for all agency features.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | see only my org's behavioral nudges | I don't see nudges for someone else's startup |
| Founder | access only my own chat mode sessions | my AI coaching conversations are private |
| Security auditor | verify all tables have per-operation RLS | there are no data isolation gaps |
| Developer | have a standard RLS pattern to follow | new tables get consistent security |

## Goals
1. **Primary:** All 9 tables have complete per-operation RLS policies
2. **Quality:** Zero `FOR ALL` policies, zero missing WITH CHECK on UPDATE, zero bare `auth.uid()` calls

## Acceptance Criteria
- [ ] `behavioral_nudges` has 4 RLS policies (SELECT/INSERT/UPDATE/DELETE) with org isolation
- [ ] `chat_mode_sessions` has 4 RLS policies with user + org isolation
- [ ] `deals` table has INSERT policy added (currently missing)
- [ ] Redundant `service_role FOR ALL` on `chat_sessions` dropped
- [ ] All `auth.uid()` wrapped in `(SELECT auth.uid())` for initPlan caching
- [ ] All UPDATE policies have both USING and WITH CHECK
- [ ] Policy names follow `{tablename}_{operation}_authenticated` convention
- [ ] Verification queries confirm org isolation works
- [ ] Migration runs cleanly (idempotent with IF NOT EXISTS / DROP IF EXISTS)

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Migration | `supabase/migrations/YYYYMMDD_agency_rls_policies.sql` | Create |

## Schema

### Section 1: Existing Tables — Audit Results

These tables already have RLS. New agency columns are data-only (no FK, no ownership semantics). Existing policies cover them automatically because PostgreSQL RLS operates at the row level, not the column level.

#### sprint_tasks (RICE/Kano columns)
New columns from prompt 005: `rice_score int`, `kano_class text`, `momentum_order int`.
**Existing RLS:** 4 policies via `campaign_id IN (SELECT c.id FROM campaigns c JOIN startups s ON s.id = c.startup_id WHERE s.org_id = (SELECT user_org_id()))`.
**Verdict:** Covered. No changes needed.

#### investors (MEDDPICC columns)
New columns from prompt 006: `meddpicc_score int`, `deal_verdict text`, `signal_data jsonb`.
**Existing RLS:** 4 policies via `startup_in_org(startup_id)`.
**Verdict:** Covered. No changes needed.

#### chat_sessions (chat_mode column)
New column from prompt 010: `chat_mode text`.
**Existing RLS:** 4 user/org policies + 1 redundant service_role FOR ALL.
**Verdict:** Covered. Remove redundant service_role policy (service_role bypasses RLS).

#### validator_reports (evidence tier, bias flags, fragments)
New columns from prompt 002/003: `evidence_tier_counts jsonb`, `bias_flags jsonb`, `fragments_loaded text[]`.
**Existing RLS:** 3 policies via `session_id IN (SELECT id FROM validator_sessions WHERE user_id = (SELECT auth.uid()))` + anon share token.
**Verdict:** Covered. No changes needed.

#### lean_canvases (specificity scores, evidence gaps)
New columns from prompt 009: `specificity_scores jsonb`, `evidence_gaps jsonb`.
**Existing RLS:** 4 policies via startup_id -> startups -> org_id join.
**Verdict:** Covered. No changes needed.

#### pitch_decks (win themes, challenger narrative)
New columns from prompt 008: `win_themes jsonb`, `challenger_narrative jsonb`.
**Existing RLS:** 4 policies via `startup_in_org(startup_id)`.
**Verdict:** Covered. No changes needed.

#### deals (MEDDPICC score, signal tier, deal verdict)
New columns from prompt 007: `meddpicc_score int`, `signal_tier text`, `deal_verdict text`.
**Existing RLS:** SELECT, UPDATE, DELETE via org join. Missing INSERT policy.
**Verdict:** Partially covered. Add INSERT policy.

### Section 2: New Tables — Full RLS

#### Table: behavioral_nudges (from prompt 015)

Org-scoped nudges. Users see, create, modify, and dismiss nudges for their org.

```sql
-- ============================================================================
-- behavioral_nudges RLS
-- ============================================================================

ALTER TABLE public.behavioral_nudges ENABLE ROW LEVEL SECURITY;

-- SELECT: authenticated users see nudges for their org
CREATE POLICY behavioral_nudges_select_authenticated
  ON public.behavioral_nudges
  FOR SELECT TO authenticated
  USING (org_id = (SELECT public.user_org_id()));

-- INSERT: authenticated users create nudges for their org
CREATE POLICY behavioral_nudges_insert_authenticated
  ON public.behavioral_nudges
  FOR INSERT TO authenticated
  WITH CHECK (org_id = (SELECT public.user_org_id()));

-- UPDATE: authenticated users update nudges in their org
CREATE POLICY behavioral_nudges_update_authenticated
  ON public.behavioral_nudges
  FOR UPDATE TO authenticated
  USING (org_id = (SELECT public.user_org_id()))
  WITH CHECK (org_id = (SELECT public.user_org_id()));

-- DELETE: authenticated users delete (dismiss) nudges in their org
CREATE POLICY behavioral_nudges_delete_authenticated
  ON public.behavioral_nudges
  FOR DELETE TO authenticated
  USING (org_id = (SELECT public.user_org_id()));
```

#### Table: chat_mode_sessions (from prompt 012)

User-scoped chat sessions. Users access only their own sessions, constrained to their org.

```sql
-- ============================================================================
-- chat_mode_sessions RLS
-- ============================================================================

ALTER TABLE public.chat_mode_sessions ENABLE ROW LEVEL SECURITY;

-- SELECT: users see only their own sessions
CREATE POLICY chat_mode_sessions_select_authenticated
  ON public.chat_mode_sessions
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- INSERT: users create sessions for themselves within their org
CREATE POLICY chat_mode_sessions_insert_authenticated
  ON public.chat_mode_sessions
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND org_id = (SELECT public.user_org_id())
  );

-- UPDATE: users update only their own sessions
CREATE POLICY chat_mode_sessions_update_authenticated
  ON public.chat_mode_sessions
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- DELETE: users delete only their own sessions
CREATE POLICY chat_mode_sessions_delete_authenticated
  ON public.chat_mode_sessions
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));
```

### Section 3: Fixes to Existing Tables

#### deals — Add missing INSERT policy

```sql
-- ============================================================================
-- deals: add missing INSERT policy
-- ============================================================================

CREATE POLICY deals_insert_authenticated
  ON public.deals
  FOR INSERT TO authenticated
  WITH CHECK (
    contact_id IN (
      SELECT c.id FROM contacts c
      JOIN startups s ON s.id = c.startup_id
      WHERE s.org_id = (SELECT public.user_org_id())
    )
  );
```

#### chat_sessions — Remove redundant service_role FOR ALL

```sql
-- ============================================================================
-- chat_sessions: remove redundant service_role policy
-- service_role bypasses RLS automatically — explicit policy is unnecessary
-- ============================================================================

DROP POLICY IF EXISTS "service role has full access to chat sessions"
  ON public.chat_sessions;
```

### Section 4: Complete Migration SQL

```sql
-- =============================================================================
-- Migration: agency_rls_policies
-- Purpose: RLS for all agency-touched tables (behavioral_nudges, chat_mode_sessions,
--          deals INSERT fix, chat_sessions cleanup)
-- Depends on: 100-INF (agency schema migrations)
-- Convention: {tablename}_{operation}_authenticated
-- =============================================================================

-- ============================================================================
-- 1. behavioral_nudges — org-scoped (4 policies)
-- ============================================================================

ALTER TABLE public.behavioral_nudges ENABLE ROW LEVEL SECURITY;

CREATE POLICY behavioral_nudges_select_authenticated
  ON public.behavioral_nudges
  FOR SELECT TO authenticated
  USING (org_id = (SELECT public.user_org_id()));

CREATE POLICY behavioral_nudges_insert_authenticated
  ON public.behavioral_nudges
  FOR INSERT TO authenticated
  WITH CHECK (org_id = (SELECT public.user_org_id()));

CREATE POLICY behavioral_nudges_update_authenticated
  ON public.behavioral_nudges
  FOR UPDATE TO authenticated
  USING (org_id = (SELECT public.user_org_id()))
  WITH CHECK (org_id = (SELECT public.user_org_id()));

CREATE POLICY behavioral_nudges_delete_authenticated
  ON public.behavioral_nudges
  FOR DELETE TO authenticated
  USING (org_id = (SELECT public.user_org_id()));

-- ============================================================================
-- 2. chat_mode_sessions — user-scoped with org check (4 policies)
-- ============================================================================

ALTER TABLE public.chat_mode_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY chat_mode_sessions_select_authenticated
  ON public.chat_mode_sessions
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY chat_mode_sessions_insert_authenticated
  ON public.chat_mode_sessions
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND org_id = (SELECT public.user_org_id())
  );

CREATE POLICY chat_mode_sessions_update_authenticated
  ON public.chat_mode_sessions
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY chat_mode_sessions_delete_authenticated
  ON public.chat_mode_sessions
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- ============================================================================
-- 3. deals — add missing INSERT policy
-- ============================================================================

CREATE POLICY deals_insert_authenticated
  ON public.deals
  FOR INSERT TO authenticated
  WITH CHECK (
    contact_id IN (
      SELECT c.id FROM contacts c
      JOIN startups s ON s.id = c.startup_id
      WHERE s.org_id = (SELECT public.user_org_id())
    )
  );

-- ============================================================================
-- 4. chat_sessions — drop redundant service_role FOR ALL policy
--    (service_role bypasses RLS; explicit policy is unnecessary and uses FOR ALL)
-- ============================================================================

DROP POLICY IF EXISTS "service role has full access to chat sessions"
  ON public.chat_sessions;
```

## Verification Queries

Run these after applying the migration to confirm isolation works.

### Test 1: behavioral_nudges org isolation

```sql
-- As test user (org A), verify only org A nudges visible
SET request.jwt.claims = '{"sub": "4bf963de-44fa-4dcf-ab50-1d3b178497a3"}';
SELECT COUNT(*) FROM behavioral_nudges; -- should return only org A rows

-- Attempt cross-org INSERT (should fail)
INSERT INTO behavioral_nudges (org_id, nudge_type, trigger_condition, message)
VALUES ('00000000-0000-0000-0000-000000000000', 'warning', 'stale_sprint', 'test');
-- Expected: 0 rows inserted (org mismatch, WITH CHECK fails)
```

### Test 2: chat_mode_sessions user isolation

```sql
-- As user A, verify only user A sessions visible
SET request.jwt.claims = '{"sub": "4bf963de-44fa-4dcf-ab50-1d3b178497a3"}';
SELECT COUNT(*) FROM chat_mode_sessions;
-- should return only sessions where user_id = auth.uid()

-- As user B, verify user A sessions not visible
SET request.jwt.claims = '{"sub": "other-user-uuid"}';
SELECT COUNT(*) FROM chat_mode_sessions WHERE user_id = '4bf963de-44fa-4dcf-ab50-1d3b178497a3';
-- Expected: 0 rows (user isolation)
```

### Test 3: deals INSERT policy

```sql
-- As authenticated user, insert deal for own org's contact
INSERT INTO deals (contact_id, stage, amount, title)
VALUES ('<valid-contact-in-org>', 'discovery', 50000, 'Test deal');
-- Expected: success

-- Insert deal for contact in different org
INSERT INTO deals (contact_id, stage, amount, title)
VALUES ('<contact-in-other-org>', 'discovery', 50000, 'Cross-org deal');
-- Expected: fails (WITH CHECK violation)
```

### Test 4: Existing tables still work with new columns

```sql
-- sprint_tasks: new columns accessible within org
SELECT id, rice_score, kano_class, momentum_order FROM sprint_tasks LIMIT 5;
-- Expected: returns rows for user's org (NULL values for new columns initially)

-- investors: MEDDPICC columns accessible
SELECT id, meddpicc_score, deal_verdict, signal_data FROM investors LIMIT 5;
-- Expected: returns rows for user's org

-- lean_canvases: specificity columns accessible
SELECT id, specificity_scores, evidence_gaps FROM lean_canvases LIMIT 5;
-- Expected: returns rows for user's org
```

### Test 5: Anonymous access blocked

```sql
-- As anon role, all agency tables should return 0 rows
SET ROLE anon;
SELECT COUNT(*) FROM behavioral_nudges;   -- Expected: 0
SELECT COUNT(*) FROM chat_mode_sessions;  -- Expected: 0
SELECT COUNT(*) FROM sprint_tasks;        -- Expected: 0
SELECT COUNT(*) FROM investors;           -- Expected: 0
```

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Anonymous user queries behavioral_nudges | 0 rows returned (no anon policies) |
| User with no org_id queries behavioral_nudges | 0 rows (user_org_id() returns NULL, NULL != any org_id) |
| User tries to INSERT nudge for another org | WITH CHECK fails, 0 rows inserted |
| User tries to UPDATE chat session they don't own | USING clause filters it out, 0 rows updated |
| service_role queries chat_sessions after policy drop | Full access (service_role bypasses RLS) |
| User creates chat_mode_session with mismatched org_id | WITH CHECK fails (org_id must equal user_org_id()) |
| User tries to INSERT deal for contact in another org | WITH CHECK fails via contact -> startup -> org chain |
| Two users in same org access behavioral_nudges | Both see all org nudges (org-scoped, not user-scoped) |
| User deletes their chat_mode_session | Allowed (user_id matches) |
| User tries to delete another user's chat_mode_session | USING clause filters it out, 0 rows deleted |

## Research Before Implementation

Before writing the migration, verify the current state:

1. Read existing RLS on `deals` table — confirm INSERT policy is actually missing:
   ```sql
   SELECT policyname, cmd FROM pg_policies WHERE tablename = 'deals';
   ```

2. Read existing RLS on `chat_sessions` — confirm service_role FOR ALL exists:
   ```sql
   SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'chat_sessions';
   ```

3. Confirm `behavioral_nudges` and `chat_mode_sessions` tables exist (from prompt 100-INF):
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public' AND table_name IN ('behavioral_nudges', 'chat_mode_sessions');
   ```

4. Confirm `user_org_id()` and `startup_in_org()` functions exist:
   ```sql
   SELECT routine_name FROM information_schema.routines
   WHERE routine_schema = 'public' AND routine_name IN ('user_org_id', 'startup_in_org');
   ```

## Real-World Examples

**Scenario 1 -- Cross-org nudge isolation:** Sarah (org A, fintech) and Marcus (org B, edtech) both use the sprint board. Sarah's sprint has been stale for 10 days, producing an amber nudge. Marcus's sprint is active. With org-scoped RLS, Sarah sees her stale-sprint nudge but Marcus does not. If a bug accidentally queries all nudges without a WHERE clause, RLS silently filters to only the user's org rows. No cross-org data leak.

**Scenario 2 -- Chat session privacy:** Aisha (org A) has 5 Practice Pitch sessions containing sensitive pitch strategy and investor feedback. Jake (org A, same org) should not see Aisha's sessions because chat_mode_sessions uses user-scoped isolation (`user_id = auth.uid()`), not org-scoped. Even within the same org, coaching conversations are private. If an admin dashboard later needs org-wide session analytics, it would use a service_role client that bypasses RLS.

**Scenario 3 -- Deals INSERT gap:** Before this migration, deals has SELECT/UPDATE/DELETE policies but no INSERT policy. On tables with RLS enabled and no INSERT policy, all INSERT attempts fail for authenticated users. This means any deal creation via the CRM would silently fail or require service_role. After adding the INSERT policy, founders can create deals for contacts within their org's startups.

## Outcomes

| Before | After |
|--------|-------|
| `behavioral_nudges` has no RLS — any user can read/write any org's nudges | 4 per-operation policies enforce org isolation |
| `chat_mode_sessions` has no RLS — any user can read another user's AI coaching history | 4 per-operation policies enforce user isolation |
| `deals` table missing INSERT policy — deal creation fails or requires service_role | INSERT policy added, gated by contact -> startup -> org chain |
| `chat_sessions` has redundant `service_role FOR ALL` policy (anti-pattern) | Dropped — service_role bypasses RLS automatically |
| No verification queries for agency RLS | 5 test suites confirm isolation for org, user, anon, cross-org, and column access |
| Inconsistent policy naming across tables | New policies follow `{tablename}_{operation}_authenticated` convention |

## Checklist

### Production Ready
- [ ] Migration runs without errors on clean database
- [ ] Migration is idempotent (safe to re-run with DROP IF EXISTS)
- [ ] All 9 tables have RLS enabled
- [ ] Zero `FOR ALL` policies remain in new code
- [ ] All UPDATE policies have both USING and WITH CHECK
- [ ] All `auth.uid()` calls use `(SELECT auth.uid())` form
- [ ] Verification queries pass
- [ ] `npm run build` passes (no frontend changes, but confirm no breaks)
- [ ] `npm run test` passes (no regressions)

### RLS Audit Summary

| Table | SELECT | INSERT | UPDATE | DELETE | Isolation | Status |
|-------|--------|--------|--------|--------|-----------|--------|
| sprint_tasks | org via campaign | org via campaign | org via campaign + WITH CHECK | org via campaign | Org | No change |
| investors | startup_in_org | startup_in_org | startup_in_org + WITH CHECK | startup_in_org | Org | No change |
| chat_sessions | user_id + org | user_id + org | user_id + WITH CHECK | user_id | User+Org | Drop service_role |
| validator_reports | session->user | session->user | session->user + WITH CHECK | (none) | User | No change |
| lean_canvases | startup->org | startup->org | startup->org + WITH CHECK | startup->org | Org | No change |
| pitch_decks | startup_in_org | startup_in_org | startup_in_org + WITH CHECK | startup_in_org | Org | No change |
| deals | org join | **MISSING** | org join + WITH CHECK | org join | Org | Add INSERT |
| behavioral_nudges | **NEW** | **NEW** | **NEW** | **NEW** | Org | Create all 4 |
| chat_mode_sessions | **NEW** | **NEW** | **NEW** | **NEW** | User | Create all 4 |
