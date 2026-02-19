-- supabase/migrations/20260130100000_create_validation_schema.sql
-- Description: Core tables for validation reports and AI critic verdicts.
-- Screen: 02 Validation Dashboard

-- =============================================================================
-- 1. TABLES
-- =============================================================================

-- tracks each validation session (quick, deep, or critic-based)
CREATE TABLE IF NOT EXISTS public.validation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  pack_run_id UUID REFERENCES public.prompt_pack_runs(id) ON DELETE SET NULL,
  
  validation_type TEXT NOT NULL CHECK (validation_type IN ('quick', 'deep', 'critic')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'success', 'failed')),
  
  metadata JSONB DEFAULT '{}'::jsonb,
  results_summary TEXT,
  
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- stores the detailed reports and scores (market, founder, product, finance)
CREATE TABLE IF NOT EXISTS public.validation_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES public.validation_runs(id) ON DELETE CASCADE,
  
  report_type TEXT NOT NULL CHECK (report_type IN ('market', 'founder', 'product', 'finance', 'overall')),
  score NUMERIC(5,2) CHECK (score >= 0 AND score <= 100),
  
  summary TEXT,
  details JSONB DEFAULT '{}'::jsonb, -- stores nested scores for radar charts
  key_findings TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- stores individual AI critic feedback and verdicts
CREATE TABLE IF NOT EXISTS public.validation_verdicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES public.validation_runs(id) ON DELETE CASCADE,
  
  critic_id TEXT NOT NULL, -- slug for the critic persona (skeptic, strategist, etc)
  verdict TEXT NOT NULL CHECK (verdict IN ('pass', 'watch', 'pivot', 'fail')),
  
  feedback TEXT,
  risk_level TEXT CHECK (risk_level IN ('high', 'medium', 'low', 'none')),
  suggestions JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 2. RLS & SECURITY
-- =============================================================================

ALTER TABLE public.validation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validation_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validation_verdicts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see validation data for their organizations
CREATE POLICY "Users can view validation runs for their organization"
ON public.validation_runs FOR SELECT
TO authenticated
USING (
  org_id IN (
    SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can view validation reports for their organization"
ON public.validation_reports FOR SELECT
TO authenticated
USING (
  run_id IN (
    SELECT id FROM public.validation_runs WHERE org_id IN (
      SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can view validation verdicts for their organization"
ON public.validation_verdicts FOR SELECT
TO authenticated
USING (
  run_id IN (
    SELECT id FROM public.validation_runs WHERE org_id IN (
      SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
    )
  )
);

-- Service Role (AI Agent) access
CREATE POLICY "Service role has full access to validation_runs"
ON public.validation_runs FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access to validation_reports"
ON public.validation_reports FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access to validation_verdicts"
ON public.validation_verdicts FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- =============================================================================
-- 3. INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_validation_runs_startup_id ON public.validation_runs(startup_id);
CREATE INDEX IF NOT EXISTS idx_validation_runs_org_id ON public.validation_runs(org_id);
CREATE INDEX IF NOT EXISTS idx_validation_runs_pack_run_id ON public.validation_runs(pack_run_id);
CREATE INDEX IF NOT EXISTS idx_validation_reports_run_id ON public.validation_reports(run_id);
CREATE INDEX IF NOT EXISTS idx_validation_verdicts_run_id ON public.validation_verdicts(run_id);
CREATE INDEX IF NOT EXISTS idx_validation_verdicts_critic_id ON public.validation_verdicts(critic_id);
