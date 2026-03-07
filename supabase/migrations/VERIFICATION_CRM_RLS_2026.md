# Verification: Migration Chain Fix — Full db reset green

**Date:** 2026-03-07
**Scope:** Fix entire migration chain so `supabase db reset` passes end-to-end (55+ migrations).

---

## 1. High: Conditional CRM FK migration

- **File:** `20260227110000_fix_crm_fk_cascades.sql`
- **Change:** Alters `communications` and `contact_tags` only when each table exists (DO block + `information_schema.tables`).
- **Proof:** `supabase db reset` applies this migration successfully; no "relation does not exist" error.

---

## 2. Chat P0 idempotent FK fix

- **File:** `20260227110100_chat_p0_fk_fix_and_dead_table.sql`
- **Change:** Made conditional — only alters `chat_messages.ai_run_id` if column exists, only drops `chat_pending` if table exists.
- **Proof:** Applies cleanly on reset.

---

## 3. Canvas P0 cleanup (major rewrite)

- **File:** `20260227110400_canvas_p0_cleanup.sql`
- **Issues fixed (3 blockers):**
  1. `assumption_evidence` view depended on `interview_insights` → added `DROP VIEW IF EXISTS` before table drops
  2. `customer_forces_balance` view depended on `customer_forces` → added `DROP VIEW IF EXISTS`
  3. `dashboard_metrics` materialized view depended on `experiments` + `interviews` → added `DROP MATERIALIZED VIEW IF EXISTS`, recreated without those subqueries (hardcoded 0 for API compat)
  4. Wrong table drop order: `interviews` has FK to `experiments` → reordered drops (child before parent)
  5. `documents.created_by` column may not exist → wrapped FK fix in DO block with `information_schema.columns` check
- **Proof:** All 9 tables dropped, `dashboard_metrics` recreated, migration applies cleanly.

---

## 4. Events + industry_events creation migration (new)

- **File:** `20260228100000_create_events_and_industry_events.sql` (NEW)
- **Why:** Tables existed on remote DB but had no creation migration — blocked all downstream `events_directory` view migrations.
- **Content:**
  - 9 enums with `DO $$ ... IF NOT EXISTS` pattern
  - `events` table: 55 columns, 4 FKs, 6 RLS policies, 8 indexes
  - `industry_events` table: 42 columns, 5 RLS policies, 3 indexes
  - All DDL pulled from remote via MCP `execute_sql`
  - RLS follows best practices: separate per-operation, `startup_in_org()` helper, UPDATE has USING+WITH CHECK
- **Proof:** Migration applies on reset; downstream view migrations succeed.

---

## 5. Events directory youtube_url view fix

- **File:** `20260306120000_events_directory_youtube_url.sql`
- **Issue:** `CREATE OR REPLACE VIEW` cannot change column order (adding `youtube_url` shifted columns).
- **Fix:** Changed to `DROP VIEW IF EXISTS` + `CREATE VIEW`.
- **Proof:** View creates successfully on reset.

---

## 6. Medium: Redundant service_role policies removed (rewritten)

- **File:** `20260307100000_drop_redundant_service_role_policies.sql`
- **Issue:** Bare `DROP POLICY IF EXISTS` fails when table doesn't exist (e.g., `interview_questions` dropped by canvas_p0_cleanup).
- **Fix:** Rewritten as DO block with dynamic SQL — checks `information_schema.tables` before each drop.
- **Content:** Drops 17 policies on 17 tables (weekly_reviews, interview_questions, workflows, workflow_*, validation_*, metric_snapshots, knowledge_*, workflow_activity_log, decisions, decision_evidence, shareable_links, ai_usage_limits, knowledge_documents).
- **Proof:** Migration applies on reset. service_role bypasses RLS, so policies were redundant per project rules.

---

## 7. Low: Split FOR ALL example (industry_questions)

- **File:** `20260307100001_split_industry_questions_rls.sql`
- **Content:** Drops single "Authenticated users can manage industry questions" (FOR ALL); adds separate INSERT, UPDATE, DELETE policies for authenticated (SELECT already exists).
- **Proof:** Migration applies on reset. Serves as reference for splitting other FOR ALL policies.

---

## Full db reset result (proof)

```text
Finished supabase db reset on branch main.
```

All 55+ migrations from `20260115` through `20260307` apply cleanly — zero errors.

---

## Test results (proof)

```text
 Test Files  31 passed (31)
      Tests  389 passed (389)
   Duration  2.97s
```

Zero regressions.

---

## Summary

| # | Task | File | Status | Proof |
|---|------|------|--------|-------|
| 1 | Conditional CRM FK | 20260227110000 | ✅ Done | Applies on reset |
| 2 | Chat P0 idempotent | 20260227110100 | ✅ Done | Conditional; applies on reset |
| 3 | Canvas P0 cleanup (rewrite) | 20260227110400 | ✅ Done | 5 fixes; applies on reset |
| 4 | Events tables creation | 20260228100000 | ✅ Done | New file; applies on reset |
| 5 | Events directory view fix | 20260306120000 | ✅ Done | DROP+CREATE; applies on reset |
| 6 | Drop service_role policies | 20260307100000 | ✅ Done | DO block; applies on reset |
| 7 | Split industry_questions RLS | 20260307100001 | ✅ Done | Applies on reset |

**Full chain:** `supabase db reset` → **green** ✅
**Tests:** 389/389 passed ✅
**Iterations to fix:** 7 (systematic iterative approach — run reset, fix first error, repeat)
