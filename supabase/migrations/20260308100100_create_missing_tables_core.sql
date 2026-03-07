-- ============================================================================
-- Migration: 20260308100100_create_missing_tables_core.sql
-- Description: Create 9 core tables that exist on remote but have no local migration
--   1. communications (CRM)
--   2. contact_tags (CRM)
--   3. chat_facts (Chat)
--   4. wizard_sessions (Onboarding)
--   5. onboarding_questions (Onboarding)
--   6. proposed_actions (Workflow)
--   7. action_executions (Workflow)
--   8. agent_configs (AI pipeline)
--   9. daily_focus_recommendations (Dashboard)
--
-- Dependencies:
--   - profiles, startups, organizations, contacts, deals, chat_messages, ai_runs tables
--   - user_org_id(), startup_in_org(), org_role(), handle_updated_at() functions
--     (created in 20260308100300_create_missing_functions.sql or earlier migrations)
-- ============================================================================

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

-- question_type enum for onboarding_questions
DO $$ BEGIN
  CREATE TYPE public.question_type AS ENUM ('multiple_choice', 'multi_select', 'text', 'number');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- 1. COMMUNICATIONS (CRM)
-- 20 columns, 4 FK: startup_id→startups, contact_id→contacts, deal_id→deals, created_by→profiles
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.communications (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id      uuid NOT NULL,
  contact_id      uuid NOT NULL,
  deal_id         uuid,
  type            text NOT NULL,
  direction       text,
  subject         text,
  content         text,
  summary         text,
  occurred_at     timestamptz DEFAULT now(),
  duration_minutes integer,
  participants    uuid[] DEFAULT '{}'::uuid[],
  follow_up_required boolean DEFAULT false,
  follow_up_date  date,
  sentiment       text,
  key_points      text[] DEFAULT '{}'::text[],
  action_items    text[] DEFAULT '{}'::text[],
  created_by      uuid,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),

  -- Check constraints
  CONSTRAINT communications_type_check CHECK (
    type = ANY (ARRAY['email','call','meeting','note','linkedin','whatsapp','sms','other'])
  ),
  CONSTRAINT communications_direction_check CHECK (
    direction = ANY (ARRAY['inbound','outbound'])
  ),
  CONSTRAINT communications_sentiment_check CHECK (
    sentiment = ANY (ARRAY['positive','neutral','negative'])
  ),

  -- Foreign keys
  CONSTRAINT communications_startup_id_fkey FOREIGN KEY (startup_id) REFERENCES public.startups(id) ON DELETE CASCADE,
  CONSTRAINT communications_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id) ON DELETE CASCADE,
  CONSTRAINT communications_deal_id_fkey FOREIGN KEY (deal_id) REFERENCES public.deals(id) ON DELETE SET NULL,
  CONSTRAINT communications_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- RLS
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view communications in org"
  ON public.communications FOR SELECT TO authenticated
  USING (startup_in_org(startup_id));

CREATE POLICY "Users create communications in org"
  ON public.communications FOR INSERT TO authenticated
  WITH CHECK (startup_in_org(startup_id));

CREATE POLICY "Authenticated users update communications in org"
  ON public.communications FOR UPDATE TO authenticated
  USING (startup_in_org(startup_id))
  WITH CHECK (startup_in_org(startup_id));

CREATE POLICY "Users delete communications in org"
  ON public.communications FOR DELETE TO authenticated
  USING (startup_in_org(startup_id));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_communications_startup_id
  ON public.communications (startup_id);
CREATE INDEX IF NOT EXISTS idx_communications_contact_occurred
  ON public.communications (contact_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_communications_deal_id
  ON public.communications (deal_id);
CREATE INDEX IF NOT EXISTS idx_communications_created_by
  ON public.communications (created_by);

-- Trigger
CREATE TRIGGER handle_communications_updated_at
  BEFORE UPDATE ON public.communications
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================================
-- 2. CONTACT_TAGS (CRM)
-- 7 columns, 2 FK: contact_id→contacts, created_by→profiles
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.contact_tags (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id  uuid NOT NULL,
  tag         text NOT NULL,
  color       text DEFAULT '#6366f1',
  created_by  uuid,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now(),

  -- Unique constraint
  CONSTRAINT contact_tags_contact_id_tag_key UNIQUE (contact_id, tag),

  -- Foreign keys
  CONSTRAINT contact_tags_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id) ON DELETE CASCADE,
  CONSTRAINT contact_tags_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- RLS
ALTER TABLE public.contact_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view contact tags in org"
  ON public.contact_tags FOR SELECT TO authenticated
  USING (contact_id IN (
    SELECT contacts.id FROM contacts WHERE startup_in_org(contacts.startup_id)
  ));

CREATE POLICY "Users insert contact tags in org"
  ON public.contact_tags FOR INSERT TO authenticated
  WITH CHECK (contact_id IN (
    SELECT contacts.id FROM contacts WHERE startup_in_org(contacts.startup_id)
  ));

CREATE POLICY "Users update contact tags in org"
  ON public.contact_tags FOR UPDATE TO authenticated
  USING (contact_id IN (
    SELECT contacts.id FROM contacts WHERE startup_in_org(contacts.startup_id)
  ))
  WITH CHECK (contact_id IN (
    SELECT contacts.id FROM contacts WHERE startup_in_org(contacts.startup_id)
  ));

CREATE POLICY "Users delete contact tags in org"
  ON public.contact_tags FOR DELETE TO authenticated
  USING (contact_id IN (
    SELECT contacts.id FROM contacts WHERE startup_in_org(contacts.startup_id)
  ));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contact_tags_contact_id
  ON public.contact_tags (contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_tags_created_by
  ON public.contact_tags (created_by);

-- Trigger
CREATE TRIGGER handle_contact_tags_updated_at
  BEFORE UPDATE ON public.contact_tags
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================================
-- 3. CHAT_FACTS (Chat)
-- 9 columns, 3 FK: user_id→profiles, startup_id→startups, source_message_id→chat_messages
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.chat_facts (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL,
  startup_id        uuid,
  fact_type         text NOT NULL,
  content           text NOT NULL,
  confidence        numeric(3,2) DEFAULT 0.8,
  source_message_id uuid,
  expires_at        timestamptz,
  created_at        timestamptz DEFAULT now(),

  -- Check constraints
  CONSTRAINT chat_facts_fact_type_check CHECK (
    fact_type = ANY (ARRAY['goal','metric','preference','decision','context','constraint'])
  ),

  -- Foreign keys
  CONSTRAINT chat_facts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT chat_facts_startup_id_fkey FOREIGN KEY (startup_id) REFERENCES public.startups(id) ON DELETE SET NULL,
  CONSTRAINT chat_facts_source_message_id_fkey FOREIGN KEY (source_message_id) REFERENCES public.chat_messages(id) ON DELETE SET NULL
);

-- RLS
ALTER TABLE public.chat_facts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own chat facts"
  ON public.chat_facts FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users insert chat facts"
  ON public.chat_facts FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users update own chat facts"
  ON public.chat_facts FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users delete own chat facts"
  ON public.chat_facts FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chat_facts_user_id
  ON public.chat_facts (user_id);
CREATE INDEX IF NOT EXISTS idx_chat_facts_startup_id
  ON public.chat_facts (startup_id);
CREATE INDEX IF NOT EXISTS idx_chat_facts_source_message_id
  ON public.chat_facts (source_message_id);

-- ============================================================================
-- 4. WIZARD_SESSIONS (Onboarding)
-- 27 columns, 2 FK: user_id→profiles, startup_id→startups
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.wizard_sessions (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 uuid NOT NULL,
  startup_id              uuid,
  current_step            integer DEFAULT 1,
  status                  text DEFAULT 'in_progress',
  form_data               jsonb DEFAULT '{}'::jsonb,
  diagnostic_answers      jsonb DEFAULT '{}'::jsonb,
  signals                 text[] DEFAULT '{}'::text[],
  industry_pack_id        uuid,
  ai_extractions          jsonb DEFAULT '{}'::jsonb,
  profile_strength        integer DEFAULT 0,
  started_at              timestamptz DEFAULT now(),
  completed_at            timestamptz,
  last_activity_at        timestamptz DEFAULT now(),
  created_at              timestamptz DEFAULT now(),
  interview_answers       jsonb DEFAULT '[]'::jsonb,
  interview_progress      integer DEFAULT 0,
  extracted_traction      jsonb DEFAULT '{}'::jsonb,
  extracted_funding       jsonb DEFAULT '{}'::jsonb,
  enrichment_sources      text[] DEFAULT '{}'::text[],
  enrichment_confidence   integer DEFAULT 0,
  investor_score          integer DEFAULT 0,
  ai_summary              jsonb,
  ai_enrichments          jsonb,
  updated_at              timestamptz DEFAULT now(),
  grounding_metadata      jsonb,
  abandoned_at            timestamptz,

  -- Check constraints
  CONSTRAINT wizard_sessions_status_check CHECK (
    status = ANY (ARRAY['in_progress','completed','abandoned'])
  ),
  CONSTRAINT wizard_sessions_current_step_check CHECK (
    current_step >= 1 AND current_step <= 4
  ),
  CONSTRAINT wizard_sessions_interview_progress_check CHECK (
    interview_progress >= 0 AND interview_progress <= 100
  ),
  CONSTRAINT wizard_sessions_enrichment_confidence_check CHECK (
    enrichment_confidence >= 0 AND enrichment_confidence <= 100
  ),

  -- Foreign keys
  CONSTRAINT wizard_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT wizard_sessions_startup_id_fkey FOREIGN KEY (startup_id) REFERENCES public.startups(id) ON DELETE SET NULL
);

-- RLS
ALTER TABLE public.wizard_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own wizard sessions"
  ON public.wizard_sessions FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users insert own wizard sessions"
  ON public.wizard_sessions FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users update own wizard sessions"
  ON public.wizard_sessions FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users delete own wizard sessions"
  ON public.wizard_sessions FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_wizard_sessions_user_id
  ON public.wizard_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_wizard_sessions_startup_id
  ON public.wizard_sessions (startup_id);
CREATE INDEX IF NOT EXISTS idx_wizard_sessions_status
  ON public.wizard_sessions (status);
CREATE INDEX IF NOT EXISTS idx_wizard_sessions_user_status
  ON public.wizard_sessions (user_id, status) WHERE (status = 'in_progress');
CREATE INDEX IF NOT EXISTS idx_wizard_sessions_last_activity
  ON public.wizard_sessions (last_activity_at DESC NULLS LAST) WHERE (status = 'in_progress');
CREATE INDEX IF NOT EXISTS idx_wizard_sessions_industry_pack_id
  ON public.wizard_sessions (industry_pack_id);

-- Trigger
CREATE TRIGGER set_wizard_sessions_updated_at
  BEFORE UPDATE ON public.wizard_sessions
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================================
-- 5. ONBOARDING_QUESTIONS (Onboarding)
-- 10 columns, 0 FK. Uses question_type enum.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.onboarding_questions (
  id              text PRIMARY KEY,
  text            text NOT NULL,
  type            question_type NOT NULL DEFAULT 'multiple_choice',
  topic           text NOT NULL,
  why_matters     text,
  options         jsonb,
  is_active       boolean NOT NULL DEFAULT true,
  display_order   integer,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),

  -- Check constraints
  CONSTRAINT valid_options CHECK (
    (type IN ('text', 'number')) OR (options IS NOT NULL AND jsonb_array_length(options) > 0)
  )
);

-- RLS
ALTER TABLE public.onboarding_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read active questions"
  ON public.onboarding_questions FOR SELECT TO authenticated
  USING (is_active = true);

-- Trigger
CREATE TRIGGER set_onboarding_questions_updated_at
  BEFORE UPDATE ON public.onboarding_questions
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================================
-- 6. PROPOSED_ACTIONS (Workflow)
-- 21 columns, 5 FK: user_id→profiles, org_id→organizations, startup_id→startups,
--                    ai_run_id→ai_runs, approved_by→profiles
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.proposed_actions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL,
  org_id            uuid NOT NULL,
  startup_id        uuid,
  agent_name        text NOT NULL,
  ai_run_id         uuid,
  action_type       text NOT NULL,
  target_table      text NOT NULL,
  target_id         uuid,
  payload           jsonb NOT NULL,
  before_state      jsonb,
  after_state       jsonb,
  reasoning         text,
  confidence        numeric(3,2),
  status            text DEFAULT 'pending',
  approved_by       uuid,
  approved_at       timestamptz,
  rejection_reason  text,
  expires_at        timestamptz DEFAULT (now() + '7 days'::interval),
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now(),

  -- Check constraints
  CONSTRAINT proposed_actions_action_type_check CHECK (
    action_type = ANY (ARRAY['create','update','delete','send','external','bulk'])
  ),
  CONSTRAINT proposed_actions_confidence_check CHECK (
    confidence >= 0 AND confidence <= 1
  ),
  CONSTRAINT proposed_actions_status_check CHECK (
    status = ANY (ARRAY['pending','approved','rejected','expired','executing','completed','failed'])
  ),

  -- Foreign keys
  CONSTRAINT proposed_actions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT proposed_actions_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE,
  CONSTRAINT proposed_actions_startup_id_fkey FOREIGN KEY (startup_id) REFERENCES public.startups(id) ON DELETE SET NULL,
  CONSTRAINT proposed_actions_ai_run_id_fkey FOREIGN KEY (ai_run_id) REFERENCES public.ai_runs(id) ON DELETE NO ACTION,
  CONSTRAINT proposed_actions_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.profiles(id) ON DELETE NO ACTION
);

-- RLS
ALTER TABLE public.proposed_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view proposed actions in org"
  ON public.proposed_actions FOR SELECT TO authenticated
  USING (org_id = (SELECT user_org_id()));

CREATE POLICY "Users insert proposed actions in org"
  ON public.proposed_actions FOR INSERT TO authenticated
  WITH CHECK (org_id = (SELECT user_org_id()));

CREATE POLICY "Users update proposed actions in org"
  ON public.proposed_actions FOR UPDATE TO authenticated
  USING (org_id = (SELECT user_org_id()))
  WITH CHECK (org_id = (SELECT user_org_id()));

CREATE POLICY "Users delete own proposed actions"
  ON public.proposed_actions FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_proposed_actions_user_id
  ON public.proposed_actions (user_id);
CREATE INDEX IF NOT EXISTS idx_proposed_actions_org_id
  ON public.proposed_actions (org_id);
CREATE INDEX IF NOT EXISTS idx_proposed_actions_startup_id
  ON public.proposed_actions (startup_id);
CREATE INDEX IF NOT EXISTS idx_proposed_actions_ai_run_id
  ON public.proposed_actions (ai_run_id);
CREATE INDEX IF NOT EXISTS idx_proposed_actions_approved_by
  ON public.proposed_actions (approved_by);

-- Trigger
CREATE TRIGGER handle_proposed_actions_updated_at
  BEFORE UPDATE ON public.proposed_actions
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================================
-- 7. ACTION_EXECUTIONS (Workflow)
-- 11 columns, 2 FK: action_id→proposed_actions, rolled_back_by→profiles
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.action_executions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id       uuid NOT NULL,
  status          text DEFAULT 'pending',
  executed_at     timestamptz,
  result          jsonb,
  error_message   text,
  undo_state      jsonb,
  rolled_back_at  timestamptz,
  rolled_back_by  uuid,
  duration_ms     integer,
  created_at      timestamptz DEFAULT now(),

  -- Check constraints
  CONSTRAINT action_executions_status_check CHECK (
    status = ANY (ARRAY['pending','success','failed','rolled_back'])
  ),

  -- Foreign keys
  CONSTRAINT action_executions_action_id_fkey FOREIGN KEY (action_id) REFERENCES public.proposed_actions(id) ON DELETE CASCADE,
  CONSTRAINT action_executions_rolled_back_by_fkey FOREIGN KEY (rolled_back_by) REFERENCES public.profiles(id) ON DELETE NO ACTION
);

-- RLS
ALTER TABLE public.action_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view action executions in org"
  ON public.action_executions FOR SELECT TO authenticated
  USING (action_id IN (
    SELECT proposed_actions.id FROM proposed_actions
    WHERE proposed_actions.org_id = (SELECT user_org_id())
  ));

CREATE POLICY "System insert action executions"
  ON public.action_executions FOR INSERT TO authenticated
  WITH CHECK (action_id IN (
    SELECT proposed_actions.id FROM proposed_actions
    WHERE proposed_actions.org_id = (SELECT user_org_id())
  ));

CREATE POLICY "System update action executions"
  ON public.action_executions FOR UPDATE TO authenticated
  USING (action_id IN (
    SELECT proposed_actions.id FROM proposed_actions
    WHERE proposed_actions.org_id = (SELECT user_org_id())
  ))
  WITH CHECK (action_id IN (
    SELECT proposed_actions.id FROM proposed_actions
    WHERE proposed_actions.org_id = (SELECT user_org_id())
  ));

CREATE POLICY "Users delete action executions in org"
  ON public.action_executions FOR DELETE TO authenticated
  USING (action_id IN (
    SELECT proposed_actions.id FROM proposed_actions
    WHERE proposed_actions.org_id = (SELECT user_org_id())
  ));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_action_executions_action_id
  ON public.action_executions (action_id);
CREATE INDEX IF NOT EXISTS idx_action_executions_rolled_back_by
  ON public.action_executions (rolled_back_by);

-- ============================================================================
-- 8. AGENT_CONFIGS (AI pipeline)
-- 18 columns, 1 FK: org_id→organizations
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.agent_configs (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            uuid,
  agent_name        text NOT NULL,
  display_name      text NOT NULL,
  description       text,
  model             text NOT NULL DEFAULT 'gemini-3-flash-preview',
  fallback_model    text DEFAULT 'gemini-3-flash-preview',
  max_input_tokens  integer DEFAULT 8000,
  max_output_tokens integer DEFAULT 2000,
  thinking_level    text DEFAULT 'high',
  enabled_tools     text[] DEFAULT '{}'::text[],
  max_cost_per_run  numeric(6,4) DEFAULT 0.10,
  daily_budget      numeric(8,2),
  system_prompt     text,
  temperature       numeric(2,1) DEFAULT 0.7,
  is_active         boolean DEFAULT true,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now(),

  -- Unique constraint: one config per agent per org
  CONSTRAINT agent_configs_org_id_agent_name_key UNIQUE (org_id, agent_name),

  -- Check constraints
  CONSTRAINT agent_configs_thinking_level_check CHECK (
    thinking_level = ANY (ARRAY['none','low','high'])
  ),

  -- Foreign keys
  CONSTRAINT agent_configs_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE
);

-- RLS
ALTER TABLE public.agent_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view agent configs"
  ON public.agent_configs FOR SELECT TO authenticated
  USING (org_id IS NULL OR org_id = (SELECT user_org_id()));

CREATE POLICY "Admins insert agent configs"
  ON public.agent_configs FOR INSERT TO authenticated
  WITH CHECK (
    org_id = (SELECT user_org_id())
    AND (SELECT org_role()) = ANY (ARRAY['owner','admin'])
  );

CREATE POLICY "Admins update agent configs"
  ON public.agent_configs FOR UPDATE TO authenticated
  USING (
    org_id = (SELECT user_org_id())
    AND (SELECT org_role()) = ANY (ARRAY['owner','admin'])
  )
  WITH CHECK (
    org_id = (SELECT user_org_id())
    AND (SELECT org_role()) = ANY (ARRAY['owner','admin'])
  );

CREATE POLICY "Admins delete agent configs"
  ON public.agent_configs FOR DELETE TO authenticated
  USING (
    org_id = (SELECT user_org_id())
    AND (SELECT org_role()) = ANY (ARRAY['owner','admin'])
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_agent_configs_org_id
  ON public.agent_configs (org_id);

-- Trigger
CREATE TRIGGER handle_agent_configs_updated_at
  BEFORE UPDATE ON public.agent_configs
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================================
-- 9. DAILY_FOCUS_RECOMMENDATIONS (Dashboard)
-- 11 columns, 1 FK: startup_id→startups
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.daily_focus_recommendations (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id          uuid NOT NULL,
  computed_at         timestamptz NOT NULL DEFAULT now(),
  expires_at          timestamptz NOT NULL DEFAULT (now() + '18:00:00'::interval),
  primary_action      jsonb NOT NULL,
  secondary_actions   jsonb DEFAULT '[]'::jsonb,
  signal_weights      jsonb DEFAULT '{"momentum": 0.10, "health_gap": 0.25, "time_urgency": 0.15, "task_priority": 0.25, "stage_relevance": 0.25}'::jsonb,
  scoring_breakdown   jsonb DEFAULT '{}'::jsonb,
  action_completed_at timestamptz,
  skipped_at          timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),

  -- Foreign keys
  CONSTRAINT daily_focus_recommendations_startup_id_fkey FOREIGN KEY (startup_id) REFERENCES public.startups(id) ON DELETE CASCADE
);

-- RLS
ALTER TABLE public.daily_focus_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own recommendations"
  ON public.daily_focus_recommendations FOR SELECT TO authenticated
  USING (startup_id IN (
    SELECT startups.id FROM startups
    WHERE startups.org_id IN (
      SELECT profiles.org_id FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
    )
  ));

CREATE POLICY "Service writes daily focus"
  ON public.daily_focus_recommendations FOR INSERT TO authenticated
  WITH CHECK (startup_id IN (
    SELECT startups.id FROM startups
    WHERE startups.org_id = (SELECT user_org_id())
  ));

CREATE POLICY "Service updates daily focus"
  ON public.daily_focus_recommendations FOR UPDATE TO authenticated
  USING (startup_id IN (
    SELECT startups.id FROM startups
    WHERE startups.org_id = (SELECT user_org_id())
  ))
  WITH CHECK (startup_id IN (
    SELECT startups.id FROM startups
    WHERE startups.org_id = (SELECT user_org_id())
  ));

CREATE POLICY "Users can delete own focus"
  ON public.daily_focus_recommendations FOR DELETE TO authenticated
  USING (startup_id IN (
    SELECT startups.id FROM startups
    WHERE startups.org_id = (SELECT user_org_id())
  ));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_daily_focus_startup_id
  ON public.daily_focus_recommendations (startup_id);
CREATE INDEX IF NOT EXISTS idx_daily_focus_active
  ON public.daily_focus_recommendations (startup_id, expires_at)
  WHERE (action_completed_at IS NULL AND skipped_at IS NULL);
