-- =====================================================
-- Validator pipeline schema fixes (99-2-audit)
-- 1) validator_sessions.failed_steps for F11
-- 2) validation_reports.startup_id for report insert
-- 3) validation_reports.run_id nullable for validator pipeline (link by session_id)
-- =====================================================

-- 1) Track which agents failed per session
ALTER TABLE public.validator_sessions
  ADD COLUMN IF NOT EXISTS failed_steps TEXT[] DEFAULT '{}';

COMMENT ON COLUMN public.validator_sessions.failed_steps IS 'Agent names that failed (F11 from pipeline audit)';

-- 2) Optional startup linkage on report
ALTER TABLE public.validation_reports
  ADD COLUMN IF NOT EXISTS startup_id UUID REFERENCES public.startups(id) ON DELETE SET NULL;

-- 3) Allow validator pipeline to link by session_id only (run_id was for validation_runs)
ALTER TABLE public.validation_reports
  ALTER COLUMN run_id DROP NOT NULL;
