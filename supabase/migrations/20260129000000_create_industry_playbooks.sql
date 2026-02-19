-- Migration: Create Industry Playbooks Tables
-- Purpose: Store enriched industry knowledge for AI agent expertise injection
-- Date: 2026-01-29

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for feature contexts (what feature is requesting context)
DO $$ BEGIN
  CREATE TYPE feature_context AS ENUM (
    'onboarding',
    'lean_canvas',
    'pitch_deck',
    'tasks',
    'chatbot',
    'validator',
    'gtm_planning',
    'fundraising'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Main playbook table storing all 10 knowledge categories per industry
CREATE TABLE IF NOT EXISTS industry_playbooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identity
  industry_id TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  narrative_arc TEXT,

  -- 10 Knowledge Categories (JSONB for flexibility and querying)
  investor_expectations JSONB NOT NULL DEFAULT '{}',
  failure_patterns JSONB NOT NULL DEFAULT '[]',
  success_stories JSONB NOT NULL DEFAULT '[]',
  benchmarks JSONB NOT NULL DEFAULT '[]',
  terminology JSONB NOT NULL DEFAULT '{}',
  gtm_patterns JSONB NOT NULL DEFAULT '[]',
  decision_frameworks JSONB NOT NULL DEFAULT '[]',
  investor_questions JSONB NOT NULL DEFAULT '[]',
  warning_signs JSONB NOT NULL DEFAULT '[]',
  stage_checklists JSONB NOT NULL DEFAULT '[]',

  -- Pitch-specific guidance
  slide_emphasis JSONB DEFAULT '[]',

  -- Metadata
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_industry_playbooks_industry_id
  ON industry_playbooks(industry_id);
CREATE INDEX IF NOT EXISTS idx_industry_playbooks_active
  ON industry_playbooks(is_active) WHERE is_active = true;

-- Context injection mapping table (which categories go to which feature)
CREATE TABLE IF NOT EXISTS context_injection_map (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feature_context feature_context NOT NULL UNIQUE,
  knowledge_categories TEXT[] NOT NULL,
  prompt_template TEXT,
  max_tokens INTEGER DEFAULT 2000,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed the context injection mapping
INSERT INTO context_injection_map (feature_context, knowledge_categories, description, max_tokens) VALUES
  ('onboarding', ARRAY['failure_patterns', 'terminology'], 'Early warnings and industry language for onboarding', 800),
  ('lean_canvas', ARRAY['gtm_patterns', 'benchmarks'], 'Go-to-market strategies and KPIs for canvas building', 1000),
  ('pitch_deck', ARRAY['investor_expectations', 'success_stories', 'failure_patterns', 'investor_questions', 'warning_signs', 'slide_emphasis'], 'Investor-focused knowledge for pitch creation', 2500),
  ('tasks', ARRAY['gtm_patterns', 'failure_patterns', 'stage_checklists', 'decision_frameworks'], 'Planning and execution guidance for task generation', 1500),
  ('chatbot', ARRAY['investor_expectations', 'failure_patterns', 'success_stories', 'benchmarks', 'terminology', 'gtm_patterns', 'decision_frameworks', 'investor_questions', 'warning_signs', 'stage_checklists'], 'Full expert mode for conversational AI', 4000),
  ('validator', ARRAY['benchmarks', 'warning_signs', 'failure_patterns'], 'Validation criteria for idea/startup validation', 1200),
  ('gtm_planning', ARRAY['gtm_patterns', 'failure_patterns', 'decision_frameworks'], 'Go-to-market planning guidance', 1500),
  ('fundraising', ARRAY['investor_expectations', 'investor_questions', 'stage_checklists', 'warning_signs'], 'Fundraising preparation guidance', 2000)
ON CONFLICT (feature_context) DO UPDATE SET
  knowledge_categories = EXCLUDED.knowledge_categories,
  description = EXCLUDED.description,
  max_tokens = EXCLUDED.max_tokens;

-- Enable RLS
ALTER TABLE industry_playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_injection_map ENABLE ROW LEVEL SECURITY;

-- Public read access for playbooks (needed by edge functions)
DROP POLICY IF EXISTS "Public read access" ON industry_playbooks;
CREATE POLICY "Public read access" ON industry_playbooks
  FOR SELECT USING (is_active = true);

-- Admin write access for playbooks
DROP POLICY IF EXISTS "Admin write access" ON industry_playbooks;
CREATE POLICY "Admin write access" ON industry_playbooks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Service role bypass for seeding
DROP POLICY IF EXISTS "Service role bypass" ON industry_playbooks;
CREATE POLICY "Service role bypass" ON industry_playbooks
  FOR ALL USING (
    current_setting('role') = 'service_role'
  );

-- Public read access for context map
DROP POLICY IF EXISTS "Public read context map" ON context_injection_map;
CREATE POLICY "Public read context map" ON context_injection_map
  FOR SELECT USING (true);

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_industry_playbooks_updated_at ON industry_playbooks;
CREATE TRIGGER update_industry_playbooks_updated_at
  BEFORE UPDATE ON industry_playbooks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add industry_context tracking to ai_runs if table exists and column doesn't
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_runs') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'ai_runs' AND column_name = 'industry_context_used'
    ) THEN
      ALTER TABLE ai_runs ADD COLUMN industry_context_used TEXT;
      ALTER TABLE ai_runs ADD COLUMN feature_context TEXT;
      ALTER TABLE ai_runs ADD COLUMN context_tokens INTEGER;
    END IF;
  END IF;
END $$;

-- Create index for industry context analytics (only if ai_runs exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_runs') THEN
    CREATE INDEX IF NOT EXISTS idx_ai_runs_industry_context
      ON ai_runs(industry_context_used) WHERE industry_context_used IS NOT NULL;
  END IF;
END $$;

-- Comment on tables
COMMENT ON TABLE industry_playbooks IS 'Enriched industry knowledge for AI agent expertise injection. Contains 10 knowledge categories per industry.';
COMMENT ON TABLE context_injection_map IS 'Maps feature contexts to relevant knowledge categories for filtered injection.';
COMMENT ON COLUMN industry_playbooks.investor_expectations IS 'Stage-specific investor focus, metrics, and deal breakers';
COMMENT ON COLUMN industry_playbooks.failure_patterns IS 'Common startup mistakes with early warnings and avoidance strategies';
COMMENT ON COLUMN industry_playbooks.success_stories IS 'Anonymized success patterns with key moves and outcomes';
COMMENT ON COLUMN industry_playbooks.benchmarks IS 'Industry KPIs with good/great thresholds by stage';
COMMENT ON COLUMN industry_playbooks.terminology IS 'Industry language: phrases to use, avoid, and investor vocabulary';
COMMENT ON COLUMN industry_playbooks.gtm_patterns IS 'Go-to-market strategies with channels, timelines, and best-fit criteria';
COMMENT ON COLUMN industry_playbooks.decision_frameworks IS 'If-then decision logic for common strategic choices';
COMMENT ON COLUMN industry_playbooks.investor_questions IS 'Key questions with good/bad answer examples';
COMMENT ON COLUMN industry_playbooks.warning_signs IS 'Red flags with triggers, actions, and severity';
COMMENT ON COLUMN industry_playbooks.stage_checklists IS 'Pre-raise tasks with time and cost estimates';
