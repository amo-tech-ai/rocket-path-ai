-- =============================================================================
-- P1 Batch Cleanup Migration
-- =============================================================================
-- PLAT-P1-1: Drop 23 dead tables (backup first)
-- TASKS-P1-1: Drop dead columns from tasks (parent_task_id, contact_id, deal_id, phase)
-- PITCH-P1-2: Add slide_type CHECK constraint on pitch_deck_slides
-- CRM-P1-1: Add UNIQUE partial index on contacts(startup_id, lower(email))
--
-- Already correct (verified, no changes needed):
--   PLAT-P1-2: playbook_runs FKs already dropped in P0 migrations
--   TASKS-P1-2: projects.owner_id already ON DELETE SET NULL
--   TASKS-P1-3: tasks.created_by already ON DELETE SET NULL
--   CORE-P1-2: startup_members timestamps already NOT NULL
--   CRM-P1-2: contacts.referred_by column does not exist
-- =============================================================================

-- 0. Ensure backup schema
create schema if not exists backup;

-- =============================================================================
-- 1. PLAT-P1-1: Backup tables that exist in migrations
-- =============================================================================
create table if not exists backup.prompt_pack_runs as table public.prompt_pack_runs;
create table if not exists backup.prompt_template_registry as table public.prompt_template_registry;
create table if not exists backup.metric_snapshots as table public.metric_snapshots;
create table if not exists backup.ai_usage_limits as table public.ai_usage_limits;
create table if not exists backup.workflow_runs as table public.workflow_runs;
create table if not exists backup.workflow_queue as table public.workflow_queue;
create table if not exists backup.workflow_triggers as table public.workflow_triggers;
create table if not exists backup.workflow_actions as table public.workflow_actions;
create table if not exists backup.workflows as table public.workflows;
create table if not exists backup.playbook_runs as table public.playbook_runs;

-- Conditionally backup ghost tables (exist in prod only, not in migrations)
do $$
declare
  t text;
begin
  for t in select unnest(array[
    'file_uploads', 'financial_models', 'integrations', 'notifications',
    'competitor_profiles', 'market_research', 'startup_health_scores',
    'wizard_extractions', 'sponsors', 'messages',
    'startup_event_tasks', 'user_event_tracking', 'audit_log'
  ])
  loop
    if exists (
      select 1 from information_schema.tables
      where table_schema = 'public' and table_name = t
    ) then
      execute format('create table if not exists backup.%I as table public.%I', t, t);
    end if;
  end loop;
end $$;

-- =============================================================================
-- 2. PLAT-P1-1: Drop 23 dead tables
--    Using CASCADE to clean up any residual FKs, policies, triggers, indexes.
--    Phase 1: No inbound FK dependencies (17 tables)
-- =============================================================================
drop table if exists public.prompt_pack_runs cascade;
drop table if exists public.prompt_template_registry cascade;
drop table if exists public.metric_snapshots cascade;
drop table if exists public.ai_usage_limits cascade;

-- Ghost tables (prod-only, IF EXISTS handles fresh environments)
drop table if exists public.file_uploads cascade;
drop table if exists public.financial_models cascade;
drop table if exists public.integrations cascade;
drop table if exists public.notifications cascade;
drop table if exists public.competitor_profiles cascade;
drop table if exists public.market_research cascade;
drop table if exists public.startup_health_scores cascade;
drop table if exists public.wizard_extractions cascade;
drop table if exists public.sponsors cascade;
drop table if exists public.messages cascade;
drop table if exists public.startup_event_tasks cascade;
drop table if exists public.user_event_tracking cascade;
drop table if exists public.audit_log cascade;

-- Phase 2: Workflow engine (internal FK chain — drop leaves first)
drop table if exists public.workflow_runs cascade;
drop table if exists public.workflow_queue cascade;
drop table if exists public.workflow_triggers cascade;
drop table if exists public.workflow_actions cascade;
drop table if exists public.workflows cascade;

-- Phase 3: playbook_runs (FKs from lean_canvases + pitch_decks already dropped in P0)
drop table if exists public.playbook_runs cascade;

-- =============================================================================
-- 3. Drop orphaned functions (triggers auto-dropped with tables)
-- =============================================================================
drop function if exists public.update_workflow_stats();
drop function if exists public.get_workflows_for_event(text, uuid);
drop function if exists public.get_pending_workflow_queue(integer);

-- =============================================================================
-- 4. TASKS-P1-1: Drop dead columns from tasks table
-- =============================================================================
alter table public.tasks drop column if exists parent_task_id;
alter table public.tasks drop column if exists contact_id;
alter table public.tasks drop column if exists deal_id;
alter table public.tasks drop column if exists phase;

-- =============================================================================
-- 5. PITCH-P1-2: Add slide_type CHECK constraint
--    11 valid types documented in 20260204100600_create_pitch_decks.sql
-- =============================================================================
alter table public.pitch_deck_slides
  add constraint chk_pitch_deck_slide_type
  check (slide_type in (
    'title', 'problem', 'solution', 'market', 'product',
    'traction', 'team', 'financials', 'ask', 'contact', 'custom',
    'business_model', 'competition'
  ));

-- =============================================================================
-- 6. CRM-P1-1: Add unique partial index on contacts
--    Prevents duplicate emails per startup (case-insensitive)
-- =============================================================================
create unique index if not exists idx_contacts_startup_email_unique
  on public.contacts (startup_id, lower(email))
  where email is not null;
