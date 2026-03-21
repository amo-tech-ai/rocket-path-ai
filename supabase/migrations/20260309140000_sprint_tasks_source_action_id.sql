-- Migration: Add source_action_id to sprint_tasks for report import deduplication
-- POST-02: Sprint Board ← Report Priority Actions Import
--
-- source_action_id is a deterministic hash of (reportId + dimensionId + rank)
-- Used to prevent duplicate imports when a founder re-imports the same actions.
-- UNIQUE constraint per campaign ensures one import per action per campaign.

ALTER TABLE public.sprint_tasks
  ADD COLUMN IF NOT EXISTS source_action_id text;

-- Unique per campaign: same action can't be imported twice to the same campaign
CREATE UNIQUE INDEX IF NOT EXISTS idx_sprint_tasks_source_action_id
  ON public.sprint_tasks (campaign_id, source_action_id)
  WHERE source_action_id IS NOT NULL;
