-- =============================================================================
-- Workflow Trigger Prerequisites
-- Migration: 20260204101800_workflow_trigger_prerequisites.sql
-- Purpose: Add missing columns and tables for workflow trigger system
-- Dependencies: org_members, activities (run after 20260204100200)
-- =============================================================================

-- 1. Add missing columns to tasks table
-- Note: tags and ai_generated already exist, only adding what's missing

ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS trigger_rule_id TEXT,
ADD COLUMN IF NOT EXISTS trigger_score NUMERIC(5,2);

COMMENT ON COLUMN public.tasks.source IS 'Origin: manual | ai_workflow | automation | integration';
COMMENT ON COLUMN public.tasks.trigger_rule_id IS 'ID of the trigger rule that created this task';
COMMENT ON COLUMN public.tasks.trigger_score IS 'Score value that triggered task creation';

-- 2. Create workflow_activity_log table for audit trail
CREATE TABLE IF NOT EXISTS public.workflow_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID REFERENCES public.startups(id) ON DELETE CASCADE,
  org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- score_calculated | task_triggered | task_skipped_duplicate | task_failed
  source TEXT NOT NULL, -- health_score | validation_report | investor_score | readiness_score
  score_value NUMERIC(5,2),
  threshold_value NUMERIC(5,2),
  rule_id TEXT,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE public.workflow_activity_log ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for workflow_activity_log

-- SELECT: Users can view activity for startups in their organization
CREATE POLICY "Users can view workflow activity for their startups"
ON public.workflow_activity_log FOR SELECT TO authenticated
USING (
  org_id IN (
    SELECT om.org_id FROM public.org_members om WHERE om.user_id = auth.uid()
  )
  OR
  startup_id IN (
    SELECT s.id FROM public.startups s
    JOIN public.org_members om ON s.org_id = om.org_id
    WHERE om.user_id = auth.uid()
  )
);

-- ALL: Service role has full access (for edge functions)
CREATE POLICY "Service role full access to workflow_activity_log"
ON public.workflow_activity_log FOR ALL TO service_role
USING (true) WITH CHECK (true);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_source ON public.tasks(source) WHERE source IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_trigger_rule ON public.tasks(trigger_rule_id) WHERE trigger_rule_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_workflow_activity_startup ON public.workflow_activity_log(startup_id);
CREATE INDEX IF NOT EXISTS idx_workflow_activity_source ON public.workflow_activity_log(source);
CREATE INDEX IF NOT EXISTS idx_workflow_activity_event ON public.workflow_activity_log(event_type);
CREATE INDEX IF NOT EXISTS idx_workflow_activity_created ON public.workflow_activity_log(created_at DESC);

-- 6. Add org_id to activities table if missing (for workflow logging)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'activities' AND column_name = 'org_id'
  ) THEN
    ALTER TABLE public.activities ADD COLUMN org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;
  END IF;
END $$;
