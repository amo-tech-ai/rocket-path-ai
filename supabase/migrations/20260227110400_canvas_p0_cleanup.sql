-- CANVAS-P0: Drop 9 dead tables, 5 triggers, 4 functions, 1 orphan FK/column, 1 FK fix
-- All tables have 0 rows, 0 code references. Backed up per user request.

-- ============================================================
-- 0. Create backup schema and back up all tables before dropping
-- ============================================================
create schema if not exists backup;

-- Back up leaf tables first (no FK children)
create table if not exists backup.interview_questions as table public.interview_questions;
create table if not exists backup.interview_insights as table public.interview_insights;
create table if not exists backup.experiment_results as table public.experiment_results;
create table if not exists backup.customer_forces as table public.customer_forces;
create table if not exists backup.jobs_to_be_done as table public.jobs_to_be_done;
create table if not exists backup.lean_canvas_versions as table public.lean_canvas_versions;

-- Back up parent tables
create table if not exists backup.experiments as table public.experiments;
create table if not exists backup.interviews as table public.interviews;
create table if not exists backup.customer_segments as table public.customer_segments;

-- ============================================================
-- 1. Drop triggers on tables being dropped (CANVAS-P0-2)
-- ============================================================
drop trigger if exists trigger_experiments_updated_at on public.experiments;
drop trigger if exists trigger_sync_assumption_status on public.experiments;
drop trigger if exists trigger_sync_experiment_sample_size on public.experiment_results;
drop trigger if exists trigger_update_segment_interview_count on public.interviews;
drop trigger if exists trigger_ensure_single_primary_segment on public.customer_segments;

-- ============================================================
-- 2. Drop functions associated with dead triggers (CANVAS-P0-2)
-- ============================================================
drop function if exists public.sync_assumption_status();
drop function if exists public.sync_experiment_sample_size();
drop function if exists public.update_segment_interview_count();
drop function if exists public.ensure_single_primary_segment();

-- ============================================================
-- 3. Drop 9 dead tables in FK-safe order (leaf → parent) (CANVAS-P0-1)
--    RLS policies are dropped automatically with tables.
-- ============================================================

-- Leaf tables (no children)
drop table if exists public.interview_questions;
drop table if exists public.interview_insights;
drop table if exists public.experiment_results;
drop table if exists public.customer_forces;
drop table if exists public.jobs_to_be_done;
drop table if exists public.lean_canvas_versions;

-- Parent tables (children already dropped above)
drop table if exists public.experiments;
drop table if exists public.interviews;
drop table if exists public.customer_segments;

-- ============================================================
-- 4. Drop orphan lean_canvases.playbook_run_id FK + column (CANVAS-P0-3)
--    Column has 0 non-null values. Must drop before playbook_runs drop in P1.
-- ============================================================
alter table public.lean_canvases
    drop constraint if exists lean_canvases_playbook_run_id_fkey;
alter table public.lean_canvases
    drop column if exists playbook_run_id;

-- ============================================================
-- 5. Fix documents.created_by FK: NO ACTION → SET NULL (CANVAS-P0-4)
--    Prevents profile deletion from being blocked by document records.
-- ============================================================
alter table public.documents
    drop constraint if exists documents_created_by_fkey;
alter table public.documents
    add constraint documents_created_by_fkey
    foreign key (created_by) references public.profiles(id) on delete set null;
