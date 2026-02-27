-- =============================================================================
-- migration: 20260204101700_add_fk_indexes.sql
-- purpose: add missing foreign key indexes to existing tables
-- affected tables: multiple
-- dependencies: all previous migrations (run after 20260204101600)
-- =============================================================================

-- postgres does not automatically create indexes on foreign key columns
-- this causes performance issues when deleting parent rows (cascades)
-- and when joining tables on fk columns

-- =============================================================================
-- 1. startups table
-- =============================================================================

-- org_id fk index (if not exists)
create index if not exists idx_startups_org_id
  on public.startups(org_id);

-- =============================================================================
-- 2. profiles table
-- =============================================================================

-- org_id fk index
create index if not exists idx_profiles_org_id
  on public.profiles(org_id)
  where org_id is not null;

-- profiles.startup_id — SKIPPED (column exists in prod only)

-- =============================================================================
-- 3. projects table
-- =============================================================================

-- startup_id fk index
create index if not exists idx_projects_startup_id
  on public.projects(startup_id);

-- =============================================================================
-- 4. tasks table
-- =============================================================================

-- startup_id fk index
create index if not exists idx_tasks_startup_id
  on public.tasks(startup_id);

-- project_id fk index
create index if not exists idx_tasks_project_id
  on public.tasks(project_id)
  where project_id is not null;

-- assigned_to fk index
create index if not exists idx_tasks_assigned_to
  on public.tasks(assigned_to)
  where assigned_to is not null;

-- =============================================================================
-- 5. contacts table
-- =============================================================================

-- startup_id fk index
create index if not exists idx_contacts_startup_id
  on public.contacts(startup_id);

-- =============================================================================
-- 6. deals table
-- =============================================================================

-- startup_id fk index
create index if not exists idx_deals_startup_id
  on public.deals(startup_id);

-- contact_id fk index
create index if not exists idx_deals_contact_id
  on public.deals(contact_id)
  where contact_id is not null;

-- =============================================================================
-- 7. documents table
-- =============================================================================

-- startup_id fk index
create index if not exists idx_documents_startup_id
  on public.documents(startup_id);

-- =============================================================================
-- 8. investors table
-- =============================================================================

-- startup_id fk index (if this table has startup relationship)
-- note: investors may be global, check table definition

-- =============================================================================
-- 9. assumptions table
-- =============================================================================

-- startup_id fk index
create index if not exists idx_assumptions_startup_id
  on public.assumptions(startup_id);

-- =============================================================================
-- 10. experiments table
-- =============================================================================

-- experiments.startup_id — SKIPPED (experiments doesn't have startup_id; uses assumption_id → assumptions.startup_id)

-- assumption_id fk index (already exists from create_experiments migration, but IF NOT EXISTS is safe)
create index if not exists idx_experiments_assumption_id
  on public.experiments(assumption_id);

-- =============================================================================
-- 11. experiment_results table
-- =============================================================================

-- experiment_id fk index
create index if not exists idx_experiment_results_experiment_id
  on public.experiment_results(experiment_id);

-- =============================================================================
-- 12. customer_segments table
-- =============================================================================

-- startup_id fk index
create index if not exists idx_customer_segments_startup_id
  on public.customer_segments(startup_id);

-- =============================================================================
-- 13. customer_forces table
-- =============================================================================

-- segment_id fk index
create index if not exists idx_customer_forces_segment_id
  on public.customer_forces(segment_id);

-- =============================================================================
-- 14. jobs_to_be_done table
-- =============================================================================

-- segment_id fk index
create index if not exists idx_jobs_to_be_done_segment_id
  on public.jobs_to_be_done(segment_id);

-- =============================================================================
-- 15. interviews table
-- =============================================================================

-- startup_id fk index
create index if not exists idx_interviews_startup_id
  on public.interviews(startup_id);

-- segment_id fk index
create index if not exists idx_interviews_segment_id
  on public.interviews(segment_id)
  where segment_id is not null;

-- =============================================================================
-- 16. interview_insights table
-- =============================================================================

-- interview_id fk index
create index if not exists idx_interview_insights_interview_id
  on public.interview_insights(interview_id);

-- =============================================================================
-- end of migration: 20260204101700_add_fk_indexes.sql
-- =============================================================================
