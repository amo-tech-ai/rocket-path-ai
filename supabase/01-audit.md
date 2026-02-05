# Supabase migrations audit

**Date:** 2026-02-04  
**Scope:** All migrations under `supabase/migrations/`  
**Rules:** `.cursor/rules/supabase/supabase-create-migration.mdc`, `supabase-postgres-sql-style-guide.mdc`

---

## 1. Migration order and dependencies

Migrations run in **filename order** (lexicographic by `YYYYMMDDHHmmss_*`). Dependencies must be created in earlier migrations.

### 1.1 Critical order issues (fixed by renames below)

| Issue | Detail |
|-------|--------|
| **workflow_trigger_prerequisites** (20260131) | References `org_members` (RLS) and `activities` (adds `org_id`). Both are created in 20260204*, so 20260131 runs **before** they exist → RLS and `ALTER TABLE activities` fail. |
| **20260202\*** (assumptions, experiments, …) | Reference `org_members` and `lean_canvases` in RLS/FKs. Those tables are created in 20260204*. 20260202* run **before** 20260204* → create_assumptions and others fail. |
| **20260202100800** (performance indexes) | Indexes on `lean_canvases`, `activities`, `chat_sessions`, `ai_runs`. Must run **after** 20260204* table-creation migrations. |
| **20260204100700** (add_fk_indexes) | Creates indexes on `assumptions`, `experiments`, `customer_segments`, etc. Must run **after** 20260202* table-creation migrations. |

### 1.2 Correct dependency order

```
base_schema (organizations, startups, profiles, tasks, …)
  → user_org_id(), handle_updated_at()
  → 20260204100000 org_members
  → 20260204100100 lean_canvases
  → 20260204100200 activities
  → 20260204100300 chat_sessions, 20260204100400 chat_messages, 20260204100500 ai_runs, 20260204100600 pitch_decks
  → 20260204100800 create_assumptions (needs org_members, lean_canvases)
  → 20260204100900 … 20260204101600 (experiments, customer_segments, … performance_indexes)
  → 20260204101700 add_fk_indexes
  → 20260204101800 workflow_trigger_prerequisites (needs org_members, activities)
```

---

## 2. Renames applied to fix order

| Old filename | New filename | Reason |
|--------------|-------------|--------|
| `20260131120000_workflow_trigger_prerequisites.sql` | `20260204101800_workflow_trigger_prerequisites.sql` | Run after org_members and activities. |
| `20260202100000_create_assumptions.sql` | `20260204100800_create_assumptions.sql` | Run after org_members and lean_canvases. |
| `20260202100100_create_experiments.sql` | `20260204100900_create_experiments.sql` | Same. |
| `20260202100200_create_experiment_results.sql` | `20260204101000_create_experiment_results.sql` | Same. |
| `20260202100300_create_customer_segments.sql` | `20260204101100_create_customer_segments.sql` | Same. |
| `20260202100400_create_customer_forces.sql` | `20260204101200_create_customer_forces.sql` | Same. |
| `20260202100500_create_jobs_to_be_done.sql` | `20260204101300_create_jobs_to_be_done.sql` | Same. |
| `20260202100600_create_interviews.sql` | `20260204101400_create_interviews.sql` | Same. |
| `20260202100700_create_interview_insights.sql` | `20260204101500_create_interview_insights.sql` | Same. |
| `20260202100800_add_performance_indexes.sql` | `20260204101600_add_performance_indexes.sql` | Run after lean_canvases, activities, chat_sessions, ai_runs. |
| `20260204100700_add_fk_indexes.sql` | `20260204101700_add_fk_indexes.sql` | Run after all 20260202*-sourced table creations. |

---

## 3. Rules compliance

### 3.1 Naming and style

- **Naming:** `YYYYMMDDHHmmss_short_description.sql` — followed in 20260202* and 20260204*.
- **SQL keywords:** Lowercase — followed in 20260204*; 20260131 and some 20260202* use mixed case (e.g. `CREATE TABLE`, `REFERENCES`).
- **timestamptz:** Used for timestamps in 20260204* and 20260202*.

### 3.2 RLS

- RLS enabled on new tables.
- Separate policies per operation (select / insert / update / delete) where applicable.
- `(select auth.uid())` and `(select public.user_org_id())` used for stable evaluation.
- Service role policies for AI/edge functions present where needed.

### 3.3 Gaps / recommendations

| Item | Recommendation |
|------|----------------|
| **Trigger function** | 20260202* use `update_*_updated_at()` per table; 20260204* use shared `handle_updated_at()`. Prefer one shared `handle_updated_at()` and migrate 20260202* to use it. |
| **SQL casing** | Normalize 20260131 and 20260202* to lowercase keywords for style-guide consistency. |
| **Table/column comments** | 20260204* have comments; ensure 20260202* and 20260131 have table/column comments where useful. |
| **Seed data** | Keep seed data in `supabase/seeds/`; do not add new seed data inside migrations. |

---

## 4. Helper dependencies

- **handle_updated_at()** — defined in `20260115201716_base_schema.sql`; used in 20260204* and org_members.
- **user_org_id()** — same migration; used in 20260204* RLS.
- **get_user_org_id()** — in `20260130195942_*.sql`; name differs from `user_org_id()`; consider consolidating to one helper.

---

## 5. File list after renames (relevant segment)

```
…
20260204100600_create_pitch_decks.sql
20260204100800_create_assumptions.sql
20260204100900_create_experiments.sql
20260204101000_create_experiment_results.sql
20260204101100_create_customer_segments.sql
20260204101200_create_customer_forces.sql
20260204101300_create_jobs_to_be_done.sql
20260204101400_create_interviews.sql
20260204101500_create_interview_insights.sql
20260204101600_add_performance_indexes.sql
20260204101700_add_fk_indexes.sql
20260204101800_workflow_trigger_prerequisites.sql
```

---

## 6. Verification

After renames:

```bash
cd /home/sk/startupai16L
npx supabase db reset
# or
npx supabase migration up
```

Confirm no "relation does not exist" or "function does not exist" errors.
