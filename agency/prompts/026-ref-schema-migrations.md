---
task_id: 100-INF
title: Agency Schema Migrations
phase: INFRASTRUCTURE
priority: P0
status: Not Started
estimated_effort: 1 day
skill: [data/supabase-postgres-best-practices, data/database-migration]
subagents: [supabase-expert, security-auditor]
schema_tables: [sprint_tasks, investors, chat_sessions, validator_reports, lean_canvases, pitch_decks, deals, behavioral_nudges, chat_mode_sessions]
depends_on: []
---

| Aspect | Details |
|--------|---------|
| **Screens** | None (schema migration only) |
| **Features** | RICE scoring, MEDDPICC columns, chat modes, evidence tiers, specificity scoring, win themes, behavioral nudges |
| **Edge Functions** | None (schema-only — downstream EFs wire in tasks 104+) |
| **Real-World** | "All agency features now have proper database columns, constraints, indexes, and triggers ready for wiring" |

---

## Description

**The situation:** The agency features (RICE scoring, MEDDPICC deal qualification, chat modes, behavioral nudges, evidence tiers, specificity scoring, and challenger narratives) each need new columns on existing tables or entirely new tables. Currently none of these columns or tables exist. The existing 90+ migrations define the base schema: `sprint_tasks` has basic Kanban columns, `investors` has contact/status fields, `chat_sessions` has `agent_type` but no structured modes, `validator_reports` has `details JSONB` but no evidence tier tracking, `lean_canvases` has 9 canvas blocks but no specificity scoring, `pitch_decks` has deck metadata but no narrative structure, and `deals` has basic amount/stage but no MEDDPICC or signal scoring.

**Why it matters:** Every agency feature prompt (001-024) depends on these columns existing in the database. Without the schema layer, no edge function can persist RICE scores, no frontend can display MEDDPICC ratings, no chat mode can be tracked, and no behavioral nudge can be stored or dismissed. This migration is the critical path — nothing else in the agency stack can ship until the data layer is ready.

**What already exists:**
- `supabase/migrations/` — 90 existing migrations following `SET search_path = '';` + `IF NOT EXISTS` conventions
- `sprint_tasks` — id, campaign_id, sprint_number, title, source, success_criteria, ai_tip, priority, column, position, created_at, updated_at (migration `20260308100200`)
- `investors` — id, startup_id, name, firm_name, type, status, priority, check_size_min/max, custom_fields JSONB, etc. (migration `20260115210638`)
- `chat_sessions` — id, startup_id, user_id, title, agent_type, context JSONB, status, message_count, last_message_at (migration `20260204100300`)
- `validator_reports` — id, run_id, report_type, score, summary, details JSONB, key_findings, session_id, verified, report_version (originally `validation_reports`, renamed in `20260210100002`)
- `lean_canvases` — id, startup_id, 9 canvas blocks, version, completeness_score, ai_suggestions JSONB (migration `20260204100100`)
- `pitch_decks` — id, startup_id, title, deck_type, funding_stage, status, version, share_token, ai_generated, completeness_score (migration `20260204100600`)
- `deals` — id, startup_id, contact_id, name, amount, stage, status (migration `20260115201716`)
- `public.handle_updated_at()` trigger function — already exists and used on all tables with `updated_at`
- `public.user_org_id()` — SECURITY DEFINER function for org isolation
- `startup_in_org(uuid)` — Helper that calls `user_org_id()` internally

**The build:**
- One migration file with 9 ALTER TABLE blocks and 2 CREATE TABLE blocks
- Each ALTER uses `ADD COLUMN IF NOT EXISTS` for idempotency
- New tables use `CREATE TABLE IF NOT EXISTS` with full RLS, indexes, and triggers
- Generated column for RICE score auto-calculation
- CHECK constraints on all enum-like text fields
- Indexes on every column used in WHERE, ORDER BY, or JOIN
- `handle_updated_at()` trigger on both new tables
- Total: ~7 ALTER TABLE statements, 2 CREATE TABLE statements, ~15 indexes, 2 triggers, ~8 RLS policies

**Example:** After running this migration, a developer can `INSERT INTO sprint_tasks (campaign_id, sprint_number, title, source, priority, rice_reach, rice_impact, rice_confidence, rice_effort) VALUES (..., 500, 3, 0.85, 2)` and the `rice_score` column automatically computes to `637.50`. The `kano_category` column rejects any value not in the allowed set. The `behavioral_nudges` table accepts nudge records scoped to an org with dismissal and snooze tracking.

---

## Rationale

**Problem:** Nine agency feature streams need database storage but no columns or tables exist yet. Feature work is blocked.

**Solution:** A single comprehensive migration adding all required columns to 7 existing tables and creating 2 new tables, with proper constraints, indexes, triggers, and RLS policies.

**Impact:** Unblocks all 24 agency feature prompts. Schema is backward-compatible (all new columns are nullable or have defaults), so existing queries and UI continue working unchanged.

---

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Developer | schema ready for RICE scoring | sprint-agent can persist computed scores |
| Developer | MEDDPICC columns on investors | investor-agent can write deal qualification data |
| Developer | chat_mode column on chat_sessions | chat modes (practice pitch, deal review) are tracked |
| Developer | evidence tier counts on validator_reports | report UI can show evidence quality badges |
| Developer | specificity scores on lean_canvases | canvas coach can score and track specificity |
| Developer | win themes on pitch_decks | pitch deck agent can store narrative structure |
| Developer | behavioral_nudges table | nudge system can persist triggers and dismissals |
| Founder | MEDDPICC score on deals | deal pipeline shows qualification scores |

---

## Goals

1. **Primary:** All 9 schema changes applied in a single idempotent migration
2. **Quality:** Zero breaking changes to existing data or queries
3. **Safety:** CHECK constraints prevent invalid data on every enum field
4. **Performance:** Indexes on every filterable/sortable column

## Acceptance Criteria

- [ ] Migration runs cleanly on production database (idempotent — safe to re-run)
- [ ] `sprint_tasks`: 5 RICE columns + `rice_score` generated column + `kano_category` + `momentum_sequence` added
- [ ] `investors`: 10 MEDDPICC columns + `signal_tier` + `last_signal_at` added
- [ ] `chat_sessions`: `chat_mode` + `mode_context` columns added
- [ ] `validator_reports`: `evidence_tier_counts` + `bias_flags` + `fragments_loaded` columns added
- [ ] `lean_canvases`: `specificity_scores` + `evidence_gaps` + `feedback_synthesis` columns added
- [ ] `pitch_decks`: `win_themes` + `challenger_narrative` + `persuasion_architecture` columns added
- [ ] `deals`: `meddpicc_score` + `signal_tier` + `deal_verdict` columns added
- [ ] `behavioral_nudges` table created with RLS policies, indexes, and trigger
- [ ] `chat_mode_sessions` table created with RLS policies, indexes, and trigger
- [ ] All CHECK constraints enforce valid enum values
- [ ] All new columns are nullable or have defaults (backward compatible)
- [ ] `rice_score` auto-computes from RICE components
- [ ] Existing data in all 7 tables is unaffected
- [ ] `npm run build` passes (no TypeScript changes needed — types update in task 108)

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Migration | `supabase/migrations/YYYYMMDDHHMMSS_agency_schema_migrations.sql` | Create |

No frontend, hook, or edge function changes — this is schema-only. Downstream tasks wire the data:
- Task 101: RLS policies for new tables (behavioral_nudges, chat_mode_sessions)
- Task 104: Edge function wiring
- Task 108: Frontend TypeScript types + hooks

---

## Schema

### 1. ALTER TABLE: sprint_tasks — RICE Scoring + Kano

```sql
-- RICE scoring columns
ALTER TABLE public.sprint_tasks
  ADD COLUMN IF NOT EXISTS rice_reach integer,
  ADD COLUMN IF NOT EXISTS rice_impact integer,
  ADD COLUMN IF NOT EXISTS rice_confidence decimal(3,2),
  ADD COLUMN IF NOT EXISTS rice_effort integer;

-- Kano classification
ALTER TABLE public.sprint_tasks
  ADD COLUMN IF NOT EXISTS kano_category text;

-- Momentum sequencing
ALTER TABLE public.sprint_tasks
  ADD COLUMN IF NOT EXISTS momentum_sequence integer;

-- RICE auto-computed score (generated column)
-- Note: Generated columns cannot use IF NOT EXISTS, so wrap in DO block
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'sprint_tasks'
      AND column_name = 'rice_score'
  ) THEN
    ALTER TABLE public.sprint_tasks
      ADD COLUMN rice_score decimal(6,2)
        GENERATED ALWAYS AS (
          rice_reach * rice_impact * rice_confidence / NULLIF(rice_effort, 0)
        ) STORED;
  END IF;
END $$;

-- Constraints
ALTER TABLE public.sprint_tasks
  ADD CONSTRAINT IF NOT EXISTS sprint_tasks_rice_impact_check
    CHECK (rice_impact IS NULL OR (rice_impact >= 1 AND rice_impact <= 3));

ALTER TABLE public.sprint_tasks
  ADD CONSTRAINT IF NOT EXISTS sprint_tasks_rice_confidence_check
    CHECK (rice_confidence IS NULL OR (rice_confidence >= 0 AND rice_confidence <= 1));

ALTER TABLE public.sprint_tasks
  ADD CONSTRAINT IF NOT EXISTS sprint_tasks_rice_effort_check
    CHECK (rice_effort IS NULL OR (rice_effort >= 1 AND rice_effort <= 3));

ALTER TABLE public.sprint_tasks
  ADD CONSTRAINT IF NOT EXISTS sprint_tasks_kano_category_check
    CHECK (kano_category IS NULL OR kano_category IN ('must_have', 'performance', 'delight', 'indifferent'));
```

**Column details:**

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| rice_reach | integer | nullable | How many users this task impacts (raw count) |
| rice_impact | integer | CHECK 1-3 | Impact level: 1=low, 2=medium, 3=high |
| rice_confidence | decimal(3,2) | CHECK 0-1.00 | Confidence in the estimate (0.5, 0.8, 1.0) |
| rice_effort | integer | CHECK 1-3 | Effort level: 1=small, 2=medium, 3=large |
| rice_score | decimal(6,2) | GENERATED STORED | Auto-computed: reach * impact * confidence / effort |
| kano_category | text | CHECK enum | must_have, performance, delight, indifferent |
| momentum_sequence | integer | nullable | Ordering for quick-wins-first display |

**Indexes:**

```sql
CREATE INDEX IF NOT EXISTS idx_sprint_tasks_rice_score
  ON public.sprint_tasks (rice_score DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_sprint_tasks_kano_category
  ON public.sprint_tasks (kano_category)
  WHERE kano_category IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sprint_tasks_momentum_sequence
  ON public.sprint_tasks (momentum_sequence ASC NULLS LAST);
```

---

### 2. ALTER TABLE: investors — MEDDPICC

```sql
ALTER TABLE public.investors
  ADD COLUMN IF NOT EXISTS meddpicc_metrics jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS meddpicc_economic_buyer text,
  ADD COLUMN IF NOT EXISTS meddpicc_decision_criteria jsonb,
  ADD COLUMN IF NOT EXISTS meddpicc_decision_process text,
  ADD COLUMN IF NOT EXISTS meddpicc_paper_process text,
  ADD COLUMN IF NOT EXISTS meddpicc_identified_pain text,
  ADD COLUMN IF NOT EXISTS meddpicc_champion text,
  ADD COLUMN IF NOT EXISTS meddpicc_competition text,
  ADD COLUMN IF NOT EXISTS meddpicc_score integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS signal_tier text,
  ADD COLUMN IF NOT EXISTS last_signal_at timestamptz;

-- Constraints
ALTER TABLE public.investors
  ADD CONSTRAINT IF NOT EXISTS investors_meddpicc_score_check
    CHECK (meddpicc_score >= 0 AND meddpicc_score <= 40);

ALTER TABLE public.investors
  ADD CONSTRAINT IF NOT EXISTS investors_signal_tier_check
    CHECK (signal_tier IS NULL OR signal_tier IN ('hot', 'warm', 'cold'));
```

**Column details:**

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| meddpicc_metrics | jsonb | DEFAULT '{}' | Quantified outcomes the buyer wants to achieve |
| meddpicc_economic_buyer | text | nullable | Person with budget authority |
| meddpicc_decision_criteria | jsonb | nullable | Criteria used to evaluate (technical, business, etc.) |
| meddpicc_decision_process | text | nullable | Steps/timeline to reach a decision |
| meddpicc_paper_process | text | nullable | Legal/procurement process for closing |
| meddpicc_identified_pain | text | nullable | Core pain point driving the deal |
| meddpicc_champion | text | nullable | Internal advocate for the deal |
| meddpicc_competition | text | nullable | Competing alternatives (inc. do-nothing) |
| meddpicc_score | integer | CHECK 0-40, DEFAULT 0 | Composite score: 8 dimensions x 5 points each |
| signal_tier | text | CHECK enum | hot, warm, cold — derived from recency + engagement |
| last_signal_at | timestamptz | nullable | Timestamp of most recent engagement signal |

**Indexes:**

```sql
CREATE INDEX IF NOT EXISTS idx_investors_meddpicc_score
  ON public.investors (meddpicc_score DESC);

CREATE INDEX IF NOT EXISTS idx_investors_signal_tier
  ON public.investors (signal_tier)
  WHERE signal_tier IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_investors_last_signal_at
  ON public.investors (last_signal_at DESC NULLS LAST);
```

---

### 3. ALTER TABLE: chat_sessions — Mode Support

```sql
ALTER TABLE public.chat_sessions
  ADD COLUMN IF NOT EXISTS chat_mode text DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS mode_context jsonb DEFAULT '{}'::jsonb;

ALTER TABLE public.chat_sessions
  ADD CONSTRAINT IF NOT EXISTS chat_sessions_chat_mode_check
    CHECK (chat_mode IN (
      'general', 'practice_pitch', 'growth_strategy', 'deal_review', 'canvas_coach'
    ));
```

**Column details:**

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| chat_mode | text | DEFAULT 'general', CHECK enum | Active chat mode for this session |
| mode_context | jsonb | DEFAULT '{}' | Mode-specific context (deck_id for pitch, deal_id for review, etc.) |

**Indexes:**

```sql
CREATE INDEX IF NOT EXISTS idx_chat_sessions_chat_mode
  ON public.chat_sessions (chat_mode, updated_at DESC)
  WHERE status = 'active';
```

---

### 4. ALTER TABLE: validator_reports — Evidence Tiers + Bias Flags

```sql
ALTER TABLE public.validator_reports
  ADD COLUMN IF NOT EXISTS evidence_tier_counts jsonb
    DEFAULT '{"cited": 0, "founder": 0, "ai_inferred": 0}'::jsonb,
  ADD COLUMN IF NOT EXISTS bias_flags jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS fragments_loaded text[] DEFAULT '{}'::text[];
```

**Column details:**

| Column | Type | Default | Purpose |
|--------|------|---------|---------|
| evidence_tier_counts | jsonb | `{"cited":0,"founder":0,"ai_inferred":0}` | Count of claims by evidence quality tier |
| bias_flags | jsonb | `[]` | Array of detected bias objects `{type, description, severity}` |
| fragments_loaded | text[] | `{}` | List of fragment IDs injected during this report generation |

No new indexes needed — these columns are read when displaying a specific report (fetched by PK).

---

### 5. ALTER TABLE: lean_canvases — Specificity Scoring

```sql
ALTER TABLE public.lean_canvases
  ADD COLUMN IF NOT EXISTS specificity_scores jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS evidence_gaps jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS feedback_synthesis jsonb;
```

**Column details:**

| Column | Type | Default | Purpose |
|--------|------|---------|---------|
| specificity_scores | jsonb | `{}` | Per-box specificity score: `{"problem": 0.7, "solution": 0.4, ...}` |
| evidence_gaps | jsonb | `[]` | Array of gap objects: `{box, gap, suggestion}` |
| feedback_synthesis | jsonb | nullable | Aggregated AI feedback from coaching sessions |

No new indexes — accessed by canvas PK via startup_id lookup.

---

### 6. ALTER TABLE: pitch_decks — Narrative Structure

```sql
ALTER TABLE public.pitch_decks
  ADD COLUMN IF NOT EXISTS win_themes jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS challenger_narrative jsonb,
  ADD COLUMN IF NOT EXISTS persuasion_architecture jsonb;
```

**Column details:**

| Column | Type | Default | Purpose |
|--------|------|---------|---------|
| win_themes | jsonb | `[]` | Array of win theme objects: `{theme, evidence, impact_statement}` |
| challenger_narrative | jsonb | nullable | Challenger sale structure: `{reframe, teach, tailor, control}` |
| persuasion_architecture | jsonb | nullable | Slide-level persuasion mapping: `{slide_id, technique, hook, evidence}` |

No new indexes — accessed by deck PK.

---

### 7. ALTER TABLE: deals — Agency Scoring

```sql
ALTER TABLE public.deals
  ADD COLUMN IF NOT EXISTS meddpicc_score integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS signal_tier text,
  ADD COLUMN IF NOT EXISTS deal_verdict text;

ALTER TABLE public.deals
  ADD CONSTRAINT IF NOT EXISTS deals_meddpicc_score_check
    CHECK (meddpicc_score >= 0 AND meddpicc_score <= 40);

ALTER TABLE public.deals
  ADD CONSTRAINT IF NOT EXISTS deals_signal_tier_check
    CHECK (signal_tier IS NULL OR signal_tier IN ('hot', 'warm', 'cold'));

ALTER TABLE public.deals
  ADD CONSTRAINT IF NOT EXISTS deals_deal_verdict_check
    CHECK (deal_verdict IS NULL OR deal_verdict IN ('pursue', 'monitor', 'pass'));
```

**Column details:**

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| meddpicc_score | integer | CHECK 0-40, DEFAULT 0 | MEDDPICC qualification score for this deal |
| signal_tier | text | CHECK enum | hot, warm, cold |
| deal_verdict | text | CHECK enum | pursue, monitor, pass — AI recommendation |

**Indexes:**

```sql
CREATE INDEX IF NOT EXISTS idx_deals_meddpicc_score
  ON public.deals (meddpicc_score DESC);

CREATE INDEX IF NOT EXISTS idx_deals_signal_tier
  ON public.deals (signal_tier)
  WHERE signal_tier IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_deals_deal_verdict
  ON public.deals (deal_verdict)
  WHERE deal_verdict IS NOT NULL;
```

---

### 8. NEW TABLE: behavioral_nudges

```sql
CREATE TABLE IF NOT EXISTS public.behavioral_nudges (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Nudge identity
  trigger_key   text NOT NULL,
  trigger_type  text NOT NULL,

  -- Display content
  title         text NOT NULL,
  message       text NOT NULL,
  cta_text      text,
  cta_route     text,

  -- Priority and state
  priority      integer NOT NULL DEFAULT 5,
  dismissed_at  timestamptz,
  snoozed_until timestamptz,

  -- Timestamps
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT behavioral_nudges_trigger_type_check
    CHECK (trigger_type IN (
      'inactivity', 'milestone', 'decay', 'opportunity', 'risk', 'celebration'
    )),
  CONSTRAINT behavioral_nudges_priority_check
    CHECK (priority >= 1 AND priority <= 10)
);

-- Prevent duplicate active nudges for same trigger
CREATE UNIQUE INDEX IF NOT EXISTS idx_behavioral_nudges_active_trigger
  ON public.behavioral_nudges (org_id, user_id, trigger_key)
  WHERE dismissed_at IS NULL AND snoozed_until IS NULL;

-- User's pending nudges (dashboard query)
CREATE INDEX IF NOT EXISTS idx_behavioral_nudges_user_pending
  ON public.behavioral_nudges (user_id, priority DESC, created_at DESC)
  WHERE dismissed_at IS NULL
    AND (snoozed_until IS NULL OR snoozed_until <= now());

-- Org-level nudge lookup
CREATE INDEX IF NOT EXISTS idx_behavioral_nudges_org_id
  ON public.behavioral_nudges (org_id);

-- Trigger
CREATE TRIGGER handle_behavioral_nudges_updated_at
  BEFORE UPDATE ON public.behavioral_nudges
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS
ALTER TABLE public.behavioral_nudges ENABLE ROW LEVEL SECURITY;

CREATE POLICY behavioral_nudges_select_authenticated
  ON public.behavioral_nudges FOR SELECT TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    AND org_id = (SELECT public.user_org_id())
  );

CREATE POLICY behavioral_nudges_insert_authenticated
  ON public.behavioral_nudges FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND org_id = (SELECT public.user_org_id())
  );

CREATE POLICY behavioral_nudges_update_authenticated
  ON public.behavioral_nudges FOR UPDATE TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    AND org_id = (SELECT public.user_org_id())
  )
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND org_id = (SELECT public.user_org_id())
  );

CREATE POLICY behavioral_nudges_delete_authenticated
  ON public.behavioral_nudges FOR DELETE TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    AND org_id = (SELECT public.user_org_id())
  );
```

**Column summary:**

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| id | uuid | PK | Primary key |
| org_id | uuid | FK organizations, NOT NULL | Org isolation |
| user_id | uuid | FK auth.users, NOT NULL | Target user for the nudge |
| trigger_key | text | NOT NULL | Unique key for the nudge type (e.g. `canvas_stale_7d`) |
| trigger_type | text | CHECK enum, NOT NULL | Category: inactivity, milestone, decay, opportunity, risk, celebration |
| title | text | NOT NULL | Display title |
| message | text | NOT NULL | Display message body |
| cta_text | text | nullable | Call-to-action button text |
| cta_route | text | nullable | Route to navigate on CTA click |
| priority | integer | CHECK 1-10, DEFAULT 5 | Display priority (1=highest) |
| dismissed_at | timestamptz | nullable | When the user dismissed this nudge |
| snoozed_until | timestamptz | nullable | When snooze expires (nudge reappears) |
| created_at | timestamptz | NOT NULL, DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | Last update timestamp |

---

### 9. NEW TABLE: chat_mode_sessions

```sql
CREATE TABLE IF NOT EXISTS public.chat_mode_sessions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_session_id  uuid NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Mode details
  mode             text NOT NULL,
  mode_context     jsonb DEFAULT '{}'::jsonb,

  -- Scoring (for practice-pitch mode)
  score            jsonb,
  feedback         text[] DEFAULT '{}'::text[],

  -- Status
  status           text NOT NULL DEFAULT 'active',

  -- Timestamps
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT chat_mode_sessions_mode_check
    CHECK (mode IN (
      'general', 'practice_pitch', 'growth_strategy', 'deal_review', 'canvas_coach'
    )),
  CONSTRAINT chat_mode_sessions_status_check
    CHECK (status IN ('active', 'completed', 'abandoned'))
);

-- FK index
CREATE INDEX IF NOT EXISTS idx_chat_mode_sessions_chat_session_id
  ON public.chat_mode_sessions (chat_session_id);

-- User's mode sessions
CREATE INDEX IF NOT EXISTS idx_chat_mode_sessions_user_id
  ON public.chat_mode_sessions (user_id, created_at DESC);

-- Active sessions by mode
CREATE INDEX IF NOT EXISTS idx_chat_mode_sessions_mode_active
  ON public.chat_mode_sessions (mode, status)
  WHERE status = 'active';

-- Trigger
CREATE TRIGGER handle_chat_mode_sessions_updated_at
  BEFORE UPDATE ON public.chat_mode_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS
ALTER TABLE public.chat_mode_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY chat_mode_sessions_select_authenticated
  ON public.chat_mode_sessions FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY chat_mode_sessions_insert_authenticated
  ON public.chat_mode_sessions FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY chat_mode_sessions_update_authenticated
  ON public.chat_mode_sessions FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY chat_mode_sessions_delete_authenticated
  ON public.chat_mode_sessions FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));
```

**Column summary:**

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| id | uuid | PK | Primary key |
| chat_session_id | uuid | FK chat_sessions, NOT NULL | Parent chat session |
| user_id | uuid | FK auth.users, NOT NULL | Owner for RLS |
| mode | text | CHECK enum, NOT NULL | Chat mode type |
| mode_context | jsonb | DEFAULT '{}' | Mode-specific context (deck_id, deal_id, canvas_id) |
| score | jsonb | nullable | Scoring data (practice-pitch: `{clarity, structure, persuasion, overall}`) |
| feedback | text[] | DEFAULT '{}' | Array of feedback points from AI |
| status | text | CHECK enum, DEFAULT 'active' | active, completed, abandoned |
| created_at | timestamptz | NOT NULL, DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | Last update timestamp |

---

## Full Migration SQL

The complete migration file should be named with the current timestamp, e.g. `supabase/migrations/20260312120000_agency_schema_migrations.sql`.

```sql
-- =============================================================================
-- Migration: agency_schema_migrations
-- Purpose: Add all agency feature columns + create new tables
-- Tables modified: sprint_tasks, investors, chat_sessions, validator_reports,
--                  lean_canvases, pitch_decks, deals
-- Tables created: behavioral_nudges, chat_mode_sessions
-- Conventions: SET search_path, IF NOT EXISTS, (SELECT auth.uid()), user_org_id()
-- =============================================================================

SET search_path = '';

-- =============================================================================
-- 1. sprint_tasks — RICE scoring + Kano classification
-- =============================================================================

ALTER TABLE public.sprint_tasks
  ADD COLUMN IF NOT EXISTS rice_reach integer,
  ADD COLUMN IF NOT EXISTS rice_impact integer,
  ADD COLUMN IF NOT EXISTS rice_confidence decimal(3,2),
  ADD COLUMN IF NOT EXISTS rice_effort integer,
  ADD COLUMN IF NOT EXISTS kano_category text,
  ADD COLUMN IF NOT EXISTS momentum_sequence integer;

-- Generated column for auto-computed RICE score
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'sprint_tasks'
      AND column_name = 'rice_score'
  ) THEN
    ALTER TABLE public.sprint_tasks
      ADD COLUMN rice_score decimal(6,2)
        GENERATED ALWAYS AS (
          rice_reach * rice_impact * rice_confidence / NULLIF(rice_effort, 0)
        ) STORED;
  END IF;
END $$;

-- Constraints (idempotent via IF NOT EXISTS on named constraints)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sprint_tasks_rice_impact_check') THEN
    ALTER TABLE public.sprint_tasks
      ADD CONSTRAINT sprint_tasks_rice_impact_check
        CHECK (rice_impact IS NULL OR (rice_impact >= 1 AND rice_impact <= 3));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sprint_tasks_rice_confidence_check') THEN
    ALTER TABLE public.sprint_tasks
      ADD CONSTRAINT sprint_tasks_rice_confidence_check
        CHECK (rice_confidence IS NULL OR (rice_confidence >= 0.00 AND rice_confidence <= 1.00));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sprint_tasks_rice_effort_check') THEN
    ALTER TABLE public.sprint_tasks
      ADD CONSTRAINT sprint_tasks_rice_effort_check
        CHECK (rice_effort IS NULL OR (rice_effort >= 1 AND rice_effort <= 3));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sprint_tasks_kano_category_check') THEN
    ALTER TABLE public.sprint_tasks
      ADD CONSTRAINT sprint_tasks_kano_category_check
        CHECK (kano_category IS NULL OR kano_category IN ('must_have', 'performance', 'delight', 'indifferent'));
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sprint_tasks_rice_score
  ON public.sprint_tasks (rice_score DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_sprint_tasks_kano_category
  ON public.sprint_tasks (kano_category)
  WHERE kano_category IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sprint_tasks_momentum_sequence
  ON public.sprint_tasks (momentum_sequence ASC NULLS LAST);

-- =============================================================================
-- 2. investors — MEDDPICC deal qualification
-- =============================================================================

ALTER TABLE public.investors
  ADD COLUMN IF NOT EXISTS meddpicc_metrics jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS meddpicc_economic_buyer text,
  ADD COLUMN IF NOT EXISTS meddpicc_decision_criteria jsonb,
  ADD COLUMN IF NOT EXISTS meddpicc_decision_process text,
  ADD COLUMN IF NOT EXISTS meddpicc_paper_process text,
  ADD COLUMN IF NOT EXISTS meddpicc_identified_pain text,
  ADD COLUMN IF NOT EXISTS meddpicc_champion text,
  ADD COLUMN IF NOT EXISTS meddpicc_competition text,
  ADD COLUMN IF NOT EXISTS meddpicc_score integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS signal_tier text,
  ADD COLUMN IF NOT EXISTS last_signal_at timestamptz;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'investors_meddpicc_score_check') THEN
    ALTER TABLE public.investors
      ADD CONSTRAINT investors_meddpicc_score_check
        CHECK (meddpicc_score >= 0 AND meddpicc_score <= 40);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'investors_signal_tier_check') THEN
    ALTER TABLE public.investors
      ADD CONSTRAINT investors_signal_tier_check
        CHECK (signal_tier IS NULL OR signal_tier IN ('hot', 'warm', 'cold'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_investors_meddpicc_score
  ON public.investors (meddpicc_score DESC);

CREATE INDEX IF NOT EXISTS idx_investors_signal_tier
  ON public.investors (signal_tier)
  WHERE signal_tier IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_investors_last_signal_at
  ON public.investors (last_signal_at DESC NULLS LAST);

-- =============================================================================
-- 3. chat_sessions — Mode support
-- =============================================================================

ALTER TABLE public.chat_sessions
  ADD COLUMN IF NOT EXISTS chat_mode text DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS mode_context jsonb DEFAULT '{}'::jsonb;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chat_sessions_chat_mode_check') THEN
    ALTER TABLE public.chat_sessions
      ADD CONSTRAINT chat_sessions_chat_mode_check
        CHECK (chat_mode IN ('general', 'practice_pitch', 'growth_strategy', 'deal_review', 'canvas_coach'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_chat_sessions_chat_mode
  ON public.chat_sessions (chat_mode, updated_at DESC)
  WHERE status = 'active';

-- =============================================================================
-- 4. validator_reports — Evidence tiers + bias flags
-- =============================================================================

ALTER TABLE public.validator_reports
  ADD COLUMN IF NOT EXISTS evidence_tier_counts jsonb
    DEFAULT '{"cited": 0, "founder": 0, "ai_inferred": 0}'::jsonb,
  ADD COLUMN IF NOT EXISTS bias_flags jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS fragments_loaded text[] DEFAULT '{}'::text[];

-- =============================================================================
-- 5. lean_canvases — Specificity scoring
-- =============================================================================

ALTER TABLE public.lean_canvases
  ADD COLUMN IF NOT EXISTS specificity_scores jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS evidence_gaps jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS feedback_synthesis jsonb;

-- =============================================================================
-- 6. pitch_decks — Narrative structure
-- =============================================================================

ALTER TABLE public.pitch_decks
  ADD COLUMN IF NOT EXISTS win_themes jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS challenger_narrative jsonb,
  ADD COLUMN IF NOT EXISTS persuasion_architecture jsonb;

-- =============================================================================
-- 7. deals — Agency scoring
-- =============================================================================

ALTER TABLE public.deals
  ADD COLUMN IF NOT EXISTS meddpicc_score integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS signal_tier text,
  ADD COLUMN IF NOT EXISTS deal_verdict text;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'deals_meddpicc_score_check') THEN
    ALTER TABLE public.deals
      ADD CONSTRAINT deals_meddpicc_score_check
        CHECK (meddpicc_score >= 0 AND meddpicc_score <= 40);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'deals_signal_tier_check') THEN
    ALTER TABLE public.deals
      ADD CONSTRAINT deals_signal_tier_check
        CHECK (signal_tier IS NULL OR signal_tier IN ('hot', 'warm', 'cold'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'deals_deal_verdict_check') THEN
    ALTER TABLE public.deals
      ADD CONSTRAINT deals_deal_verdict_check
        CHECK (deal_verdict IS NULL OR deal_verdict IN ('pursue', 'monitor', 'pass'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_deals_meddpicc_score
  ON public.deals (meddpicc_score DESC);

CREATE INDEX IF NOT EXISTS idx_deals_signal_tier
  ON public.deals (signal_tier)
  WHERE signal_tier IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_deals_deal_verdict
  ON public.deals (deal_verdict)
  WHERE deal_verdict IS NOT NULL;

-- =============================================================================
-- 8. NEW TABLE: behavioral_nudges
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.behavioral_nudges (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  trigger_key   text NOT NULL,
  trigger_type  text NOT NULL,

  title         text NOT NULL,
  message       text NOT NULL,
  cta_text      text,
  cta_route     text,

  priority      integer NOT NULL DEFAULT 5,
  dismissed_at  timestamptz,
  snoozed_until timestamptz,

  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT behavioral_nudges_trigger_type_check
    CHECK (trigger_type IN ('inactivity', 'milestone', 'decay', 'opportunity', 'risk', 'celebration')),
  CONSTRAINT behavioral_nudges_priority_check
    CHECK (priority >= 1 AND priority <= 10)
);

-- Unique active nudge per trigger per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_behavioral_nudges_active_trigger
  ON public.behavioral_nudges (org_id, user_id, trigger_key)
  WHERE dismissed_at IS NULL AND snoozed_until IS NULL;

CREATE INDEX IF NOT EXISTS idx_behavioral_nudges_user_pending
  ON public.behavioral_nudges (user_id, priority DESC, created_at DESC)
  WHERE dismissed_at IS NULL
    AND (snoozed_until IS NULL OR snoozed_until <= now());

CREATE INDEX IF NOT EXISTS idx_behavioral_nudges_org_id
  ON public.behavioral_nudges (org_id);

CREATE TRIGGER handle_behavioral_nudges_updated_at
  BEFORE UPDATE ON public.behavioral_nudges
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.behavioral_nudges ENABLE ROW LEVEL SECURITY;

CREATE POLICY behavioral_nudges_select_authenticated
  ON public.behavioral_nudges FOR SELECT TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    AND org_id = (SELECT public.user_org_id())
  );

CREATE POLICY behavioral_nudges_insert_authenticated
  ON public.behavioral_nudges FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND org_id = (SELECT public.user_org_id())
  );

CREATE POLICY behavioral_nudges_update_authenticated
  ON public.behavioral_nudges FOR UPDATE TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    AND org_id = (SELECT public.user_org_id())
  )
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND org_id = (SELECT public.user_org_id())
  );

CREATE POLICY behavioral_nudges_delete_authenticated
  ON public.behavioral_nudges FOR DELETE TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    AND org_id = (SELECT public.user_org_id())
  );

-- =============================================================================
-- 9. NEW TABLE: chat_mode_sessions
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.chat_mode_sessions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_session_id  uuid NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  mode             text NOT NULL,
  mode_context     jsonb DEFAULT '{}'::jsonb,
  score            jsonb,
  feedback         text[] DEFAULT '{}'::text[],
  status           text NOT NULL DEFAULT 'active',

  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT chat_mode_sessions_mode_check
    CHECK (mode IN ('general', 'practice_pitch', 'growth_strategy', 'deal_review', 'canvas_coach')),
  CONSTRAINT chat_mode_sessions_status_check
    CHECK (status IN ('active', 'completed', 'abandoned'))
);

CREATE INDEX IF NOT EXISTS idx_chat_mode_sessions_chat_session_id
  ON public.chat_mode_sessions (chat_session_id);

CREATE INDEX IF NOT EXISTS idx_chat_mode_sessions_user_id
  ON public.chat_mode_sessions (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_mode_sessions_mode_active
  ON public.chat_mode_sessions (mode, status)
  WHERE status = 'active';

CREATE TRIGGER handle_chat_mode_sessions_updated_at
  BEFORE UPDATE ON public.chat_mode_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.chat_mode_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY chat_mode_sessions_select_authenticated
  ON public.chat_mode_sessions FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY chat_mode_sessions_insert_authenticated
  ON public.chat_mode_sessions FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY chat_mode_sessions_update_authenticated
  ON public.chat_mode_sessions FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY chat_mode_sessions_delete_authenticated
  ON public.chat_mode_sessions FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- =============================================================================
-- End of migration: agency_schema_migrations
-- =============================================================================
```

---

## Research Before Implementation

Before running the migration, verify:

1. Read `supabase/migrations/20260308100200_create_missing_tables_events_cache.sql` lines 602-640 to confirm `sprint_tasks` current column set
2. Read `supabase/migrations/20260115210638_*.sql` to confirm `investors` current column set
3. Read `supabase/migrations/20260204100300_create_chat_sessions.sql` to confirm `chat_sessions` does not already have `chat_mode`
4. Check `pg_constraint` for any existing constraints that might conflict with the new named constraints
5. Verify `public.handle_updated_at()` function exists (it does — used by 30+ existing triggers)
6. Verify `public.user_org_id()` function exists (it does — SECURITY DEFINER)

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Migration re-run on same database | All `IF NOT EXISTS` guards prevent errors; fully idempotent |
| Existing sprint_tasks rows with no RICE data | All RICE columns are NULL; `rice_score` generated column returns NULL (NULLIF prevents div-by-zero) |
| RICE effort = 0 passed directly | `NULLIF(rice_effort, 0)` returns NULL, so `rice_score` = NULL (not division error) |
| RICE confidence = 0.00 | Valid per CHECK (>= 0), `rice_score` = 0 (mathematically correct) |
| Investor with meddpicc_score = 41 | CHECK constraint rejects INSERT/UPDATE |
| Deal verdict = 'reject' (invalid) | CHECK constraint rejects — must be pursue/monitor/pass |
| Behavioral nudge with same trigger_key for same user | Unique partial index prevents duplicate active nudges |
| Nudge dismissed then same trigger fires | dismissed_at is set, new nudge can be inserted (unique index only covers non-dismissed) |
| Chat mode session for deleted chat_session | ON DELETE CASCADE removes the mode session |
| Generated column rice_score with NULL components | NULL * anything = NULL — returns NULL gracefully |
| Large JSONB in meddpicc_decision_criteria | PostgreSQL JSONB handles up to 255MB — no practical limit |
| Concurrent nudge creation for same trigger | Unique index serializes the INSERT — one wins, other gets constraint violation |

---

## Real-World Examples

**Scenario 1 -- Sprint RICE scoring:** Aisha generates a sprint plan for her edtech startup. The sprint-agent (task 005) calls `INSERT INTO sprint_tasks (..., rice_reach, rice_impact, rice_confidence, rice_effort) VALUES (..., 500, 3, 0.85, 1)`. The database auto-computes `rice_score = 1275.00`. She sorts her board by RICE score descending and sees "Build LMS integration" (1275) above "Add dark mode" (42). **Without this migration,** the INSERT would fail because the columns do not exist.

**Scenario 2 -- Investor MEDDPICC:** Marcus tracks 15 investor conversations. The investor-agent (task 007) runs MEDDPICC analysis and writes `meddpicc_score = 32, signal_tier = 'hot', meddpicc_champion = 'VP of Eng at Target Fund'`. His investor pipeline now shows a sortable score column. He focuses on the three investors scoring 30+ instead of spreading effort equally. **Without this migration,** the agent has nowhere to store the scores.

**Scenario 3 -- Behavioral nudge dismissal:** Priya has not updated her lean canvas in 10 days. The nudge system creates a record with `trigger_key = 'canvas_stale_10d', trigger_type = 'decay', title = 'Your canvas is getting stale'`. She dismisses it (`dismissed_at = now()`). Three days later, the system tries to create another stale-canvas nudge but the unique partial index allows it because the old one is dismissed. She sees a fresh nudge. **Without this migration,** there is no table to store nudges.

---

## Outcomes

| Before | After |
|--------|-------|
| sprint_tasks has no prioritization columns | RICE score auto-computed, Kano category filterable, momentum sequencing sortable |
| investors has no deal qualification data | 8 MEDDPICC text/JSONB fields + composite score (0-40) + signal tier |
| chat_sessions has no mode tracking | chat_mode column with 5 valid modes + mode_context JSONB |
| validator_reports has no evidence quality data | evidence_tier_counts, bias_flags, and fragments_loaded columns |
| lean_canvases has no specificity tracking | Per-box specificity scores, evidence gaps, and feedback synthesis |
| pitch_decks has no narrative structure | Win themes array, challenger narrative, persuasion architecture |
| deals has no scoring or verdict columns | meddpicc_score, signal_tier, deal_verdict with CHECK constraints |
| No way to store or track behavioral nudges | behavioral_nudges table with org isolation, dedup index, dismiss/snooze |
| No way to track chat mode session history | chat_mode_sessions table with scoring, feedback, and status tracking |

---

## Checklist

### Production Ready

- [ ] `SET search_path = '';` at top of migration
- [ ] All `CREATE TABLE IF NOT EXISTS` / `ADD COLUMN IF NOT EXISTS`
- [ ] All CHECK constraints use named constraints with `IF NOT EXISTS` guard
- [ ] Generated column wrapped in DO block with existence check
- [ ] `handle_updated_at()` trigger on both new tables
- [ ] RLS enabled and 4 policies (SELECT/INSERT/UPDATE/DELETE) on both new tables
- [ ] `(SELECT auth.uid())` subquery form used everywhere (initPlan caching)
- [ ] `(SELECT public.user_org_id())` used for org isolation
- [ ] UPDATE policies include WITH CHECK clause
- [ ] All new columns are nullable or have defaults
- [ ] No existing data modified or deleted
- [ ] Indexes on every filterable/sortable column
- [ ] Migration is fully idempotent (safe to re-run)

### Regression

- [ ] Existing sprint board loads with NULL RICE columns
- [ ] Existing investor records display correctly
- [ ] Existing chat sessions work with default 'general' mode
- [ ] Existing validator reports render without errors
- [ ] Existing lean canvases load and save normally
- [ ] Existing pitch decks unaffected
- [ ] Existing deals display in pipeline view
