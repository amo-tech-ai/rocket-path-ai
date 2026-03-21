-- Agency Schema Migrations
-- Applied: 2026-03-12
-- Source: agency/prompts/100-agency-schema-migrations.md
--
-- Adds agency framework columns and tables:
--   sprint_tasks: RICE scoring (4 components + auto-computed score), Kano category, momentum sequence
--   investors: MEDDPICC 8-dimension scoring + composite score + signal tier
--   behavioral_nudges: New table — org/user-scoped nudge system with triggers, snooze, dismiss
--   chat_mode_sessions: New table — user-scoped AI coaching sessions (5 modes)
--   deals: INSERT RLS policy fix (was missing)

SET search_path = '';

-- ============================================================
-- 1. sprint_tasks — RICE scoring + Kano + momentum
-- ============================================================
ALTER TABLE public.sprint_tasks
  ADD COLUMN IF NOT EXISTS rice_reach       integer,
  ADD COLUMN IF NOT EXISTS rice_impact      integer,
  ADD COLUMN IF NOT EXISTS rice_confidence  integer,
  ADD COLUMN IF NOT EXISTS rice_effort      integer,
  ADD COLUMN IF NOT EXISTS kano_category    text,
  ADD COLUMN IF NOT EXISTS momentum_sequence integer;

-- Auto-compute RICE score: reach × impact × confidence / effort
-- Must use ALTER TABLE ... ADD COLUMN separately for generated columns
DO $$ BEGIN
  ALTER TABLE public.sprint_tasks
    ADD COLUMN rice_score numeric GENERATED ALWAYS AS (
      CASE WHEN rice_effort > 0
           THEN (rice_reach * rice_impact * rice_confidence)::numeric / rice_effort
           ELSE 0 END
    ) STORED;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Constraints
DO $$ BEGIN
  ALTER TABLE public.sprint_tasks ADD CONSTRAINT sprint_tasks_rice_reach_check
    CHECK (rice_reach IS NULL OR (rice_reach >= 1 AND rice_reach <= 10));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.sprint_tasks ADD CONSTRAINT sprint_tasks_rice_impact_check
    CHECK (rice_impact IS NULL OR (rice_impact >= 1 AND rice_impact <= 10));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.sprint_tasks ADD CONSTRAINT sprint_tasks_rice_confidence_check
    CHECK (rice_confidence IS NULL OR (rice_confidence >= 1 AND rice_confidence <= 10));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.sprint_tasks ADD CONSTRAINT sprint_tasks_rice_effort_check
    CHECK (rice_effort IS NULL OR (rice_effort >= 1 AND rice_effort <= 10));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.sprint_tasks ADD CONSTRAINT sprint_tasks_kano_category_check
    CHECK (kano_category IS NULL OR kano_category IN ('must_have', 'performance', 'delight', 'indifferent'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.sprint_tasks ADD CONSTRAINT sprint_tasks_momentum_sequence_check
    CHECK (momentum_sequence IS NULL OR momentum_sequence >= 0);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Indexes for RICE sorting and Kano filtering
CREATE INDEX IF NOT EXISTS idx_sprint_tasks_rice_score ON public.sprint_tasks (rice_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_sprint_tasks_kano_category ON public.sprint_tasks (kano_category) WHERE kano_category IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sprint_tasks_momentum ON public.sprint_tasks (momentum_sequence ASC NULLS LAST);

-- ============================================================
-- 2. investors — MEDDPICC scoring + signal tier
-- ============================================================
ALTER TABLE public.investors
  ADD COLUMN IF NOT EXISTS meddpicc_metrics         integer,
  ADD COLUMN IF NOT EXISTS meddpicc_economic_buyer   integer,
  ADD COLUMN IF NOT EXISTS meddpicc_decision_criteria integer,
  ADD COLUMN IF NOT EXISTS meddpicc_decision_process  integer,
  ADD COLUMN IF NOT EXISTS meddpicc_paper_process     integer,
  ADD COLUMN IF NOT EXISTS meddpicc_identified_pain   integer,
  ADD COLUMN IF NOT EXISTS meddpicc_champion          integer,
  ADD COLUMN IF NOT EXISTS meddpicc_competition        integer,
  ADD COLUMN IF NOT EXISTS meddpicc_score              integer,
  ADD COLUMN IF NOT EXISTS signal_tier                 text,
  ADD COLUMN IF NOT EXISTS last_signal_at              timestamptz;

-- Constraints: each MEDDPICC dimension 0-5
DO $$ BEGIN
  ALTER TABLE public.investors ADD CONSTRAINT investors_meddpicc_metrics_check
    CHECK (meddpicc_metrics IS NULL OR (meddpicc_metrics >= 0 AND meddpicc_metrics <= 5));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.investors ADD CONSTRAINT investors_meddpicc_economic_buyer_check
    CHECK (meddpicc_economic_buyer IS NULL OR (meddpicc_economic_buyer >= 0 AND meddpicc_economic_buyer <= 5));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.investors ADD CONSTRAINT investors_meddpicc_decision_criteria_check
    CHECK (meddpicc_decision_criteria IS NULL OR (meddpicc_decision_criteria >= 0 AND meddpicc_decision_criteria <= 5));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.investors ADD CONSTRAINT investors_meddpicc_decision_process_check
    CHECK (meddpicc_decision_process IS NULL OR (meddpicc_decision_process >= 0 AND meddpicc_decision_process <= 5));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.investors ADD CONSTRAINT investors_meddpicc_paper_process_check
    CHECK (meddpicc_paper_process IS NULL OR (meddpicc_paper_process >= 0 AND meddpicc_paper_process <= 5));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.investors ADD CONSTRAINT investors_meddpicc_identified_pain_check
    CHECK (meddpicc_identified_pain IS NULL OR (meddpicc_identified_pain >= 0 AND meddpicc_identified_pain <= 5));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.investors ADD CONSTRAINT investors_meddpicc_champion_check
    CHECK (meddpicc_champion IS NULL OR (meddpicc_champion >= 0 AND meddpicc_champion <= 5));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.investors ADD CONSTRAINT investors_meddpicc_competition_check
    CHECK (meddpicc_competition IS NULL OR (meddpicc_competition >= 0 AND meddpicc_competition <= 5));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.investors ADD CONSTRAINT investors_meddpicc_score_check
    CHECK (meddpicc_score IS NULL OR (meddpicc_score >= 0 AND meddpicc_score <= 40));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.investors ADD CONSTRAINT investors_signal_tier_check
    CHECK (signal_tier IS NULL OR signal_tier IN ('hot', 'warm', 'cool', 'cold'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_investors_meddpicc_score ON public.investors (meddpicc_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_investors_signal_tier ON public.investors (signal_tier) WHERE signal_tier IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_investors_last_signal_at ON public.investors (last_signal_at DESC NULLS LAST);

-- ============================================================
-- 3. behavioral_nudges — new table (org + user scoped)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.behavioral_nudges (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nudge_type     text NOT NULL,
  trigger_type   text NOT NULL,
  title          text NOT NULL,
  message        text NOT NULL,
  priority       integer NOT NULL DEFAULT 50,
  context_data   jsonb DEFAULT '{}'::jsonb,
  dismissed_at   timestamptz,
  snoozed_until  timestamptz,
  delivered_at   timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- Constraints
DO $$ BEGIN
  ALTER TABLE public.behavioral_nudges ADD CONSTRAINT behavioral_nudges_nudge_type_check
    CHECK (nudge_type IN ('action', 'insight', 'celebration', 'warning', 'tip'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.behavioral_nudges ADD CONSTRAINT behavioral_nudges_trigger_type_check
    CHECK (trigger_type IN ('inactivity', 'milestone', 'decay', 'opportunity', 'risk', 'celebration'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.behavioral_nudges ADD CONSTRAINT behavioral_nudges_priority_check
    CHECK (priority >= 0 AND priority <= 100);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_behavioral_nudges_org_user ON public.behavioral_nudges (org_id, user_id);
CREATE INDEX IF NOT EXISTS idx_behavioral_nudges_trigger_type ON public.behavioral_nudges (trigger_type);
CREATE INDEX IF NOT EXISTS idx_behavioral_nudges_priority ON public.behavioral_nudges (priority DESC);
CREATE INDEX IF NOT EXISTS idx_behavioral_nudges_active ON public.behavioral_nudges (org_id, user_id)
  WHERE dismissed_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_behavioral_nudges_dedup
  ON public.behavioral_nudges (org_id, user_id, nudge_type, trigger_type)
  WHERE dismissed_at IS NULL;

-- RLS
ALTER TABLE public.behavioral_nudges ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY behavioral_nudges_select_authenticated ON public.behavioral_nudges
    FOR SELECT TO authenticated
    USING (user_id = (SELECT auth.uid()) AND org_id = (SELECT public.user_org_id()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY behavioral_nudges_insert_authenticated ON public.behavioral_nudges
    FOR INSERT TO authenticated
    WITH CHECK (user_id = (SELECT auth.uid()) AND org_id = (SELECT public.user_org_id()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY behavioral_nudges_update_authenticated ON public.behavioral_nudges
    FOR UPDATE TO authenticated
    USING (user_id = (SELECT auth.uid()) AND org_id = (SELECT public.user_org_id()))
    WITH CHECK (user_id = (SELECT auth.uid()) AND org_id = (SELECT public.user_org_id()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY behavioral_nudges_delete_authenticated ON public.behavioral_nudges
    FOR DELETE TO authenticated
    USING (user_id = (SELECT auth.uid()) AND org_id = (SELECT public.user_org_id()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Trigger
CREATE OR REPLACE TRIGGER handle_behavioral_nudges_updated_at
  BEFORE UPDATE ON public.behavioral_nudges
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 4. chat_mode_sessions — new table (user-scoped only)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.chat_mode_sessions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode         text NOT NULL,
  title        text,
  context_data jsonb DEFAULT '{}'::jsonb,
  messages     jsonb DEFAULT '[]'::jsonb,
  metadata     jsonb DEFAULT '{}'::jsonb,
  started_at   timestamptz NOT NULL DEFAULT now(),
  ended_at     timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Constraints
DO $$ BEGIN
  ALTER TABLE public.chat_mode_sessions ADD CONSTRAINT chat_mode_sessions_mode_check
    CHECK (mode IN ('general', 'practice_pitch', 'growth_strategy', 'deal_review', 'canvas_coach'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chat_mode_sessions_user ON public.chat_mode_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_chat_mode_sessions_mode ON public.chat_mode_sessions (mode);
CREATE INDEX IF NOT EXISTS idx_chat_mode_sessions_started ON public.chat_mode_sessions (started_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_mode_sessions_active ON public.chat_mode_sessions (user_id, mode)
  WHERE ended_at IS NULL;

-- RLS (user-scoped — no org_id on this table)
ALTER TABLE public.chat_mode_sessions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY chat_mode_sessions_select_authenticated ON public.chat_mode_sessions
    FOR SELECT TO authenticated
    USING (user_id = (SELECT auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY chat_mode_sessions_insert_authenticated ON public.chat_mode_sessions
    FOR INSERT TO authenticated
    WITH CHECK (user_id = (SELECT auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY chat_mode_sessions_update_authenticated ON public.chat_mode_sessions
    FOR UPDATE TO authenticated
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY chat_mode_sessions_delete_authenticated ON public.chat_mode_sessions
    FOR DELETE TO authenticated
    USING (user_id = (SELECT auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Trigger
CREATE OR REPLACE TRIGGER handle_chat_mode_sessions_updated_at
  BEFORE UPDATE ON public.chat_mode_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 5. deals — fix missing INSERT RLS policy
-- ============================================================
DO $$ BEGIN
  CREATE POLICY deals_insert_authenticated ON public.deals
    FOR INSERT TO authenticated
    WITH CHECK (
      contact_id IN (
        SELECT c.id FROM public.contacts c
        JOIN public.startups s ON s.id = c.startup_id
        WHERE s.org_id = (SELECT public.user_org_id())
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
