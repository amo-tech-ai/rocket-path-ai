-- =====================================================
-- Validator Pipeline Tables
-- Complete schema for AI-verified validation reports
-- =====================================================

-- 1) validator_sessions: Tracks each validation session
CREATE TABLE IF NOT EXISTS public.validator_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  startup_id UUID REFERENCES public.startups(id) ON DELETE SET NULL,
  input_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'complete', 'partial', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) validator_runs: Individual agent execution logs
CREATE TABLE IF NOT EXISTS public.validator_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.validator_sessions(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL,
  model_used TEXT NOT NULL DEFAULT 'gemini-3-flash-preview',
  tool_used JSONB DEFAULT '[]'::jsonb,
  input_json JSONB,
  output_json JSONB,
  citations JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'ok', 'partial', 'failed')),
  error_message TEXT,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3) Update existing validator_reports with session linkage
ALTER TABLE public.validation_reports 
  ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES public.validator_sessions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS verification_json JSONB;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_validator_sessions_user_id ON public.validator_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_validator_sessions_status ON public.validator_sessions(status);
CREATE INDEX IF NOT EXISTS idx_validator_runs_session_id ON public.validator_runs(session_id);
CREATE INDEX IF NOT EXISTS idx_validator_runs_agent_name ON public.validator_runs(agent_name);
CREATE INDEX IF NOT EXISTS idx_validation_reports_session_id ON public.validation_reports(session_id);

-- Enable RLS
ALTER TABLE public.validator_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validator_runs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for validator_sessions
CREATE POLICY "Users can view their own sessions"
  ON public.validator_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
  ON public.validator_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON public.validator_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
  ON public.validator_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for validator_runs (access via session ownership)
CREATE POLICY "Users can view runs from their sessions"
  ON public.validator_runs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.validator_sessions vs
      WHERE vs.id = session_id AND vs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert runs to their sessions"
  ON public.validator_runs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.validator_sessions vs
      WHERE vs.id = session_id AND vs.user_id = auth.uid()
    )
  );

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_validator_session_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_validator_sessions_timestamp ON public.validator_sessions;
CREATE TRIGGER update_validator_sessions_timestamp
  BEFORE UPDATE ON public.validator_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_validator_session_updated_at();