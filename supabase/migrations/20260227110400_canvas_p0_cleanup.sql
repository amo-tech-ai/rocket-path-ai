-- CANVAS-P0: Drop 9 dead tables, 5 triggers, 4 functions, 1 orphan FK/column, 1 FK fix
-- All tables have 0 rows, 0 code references. Backed up per user request.
-- Views & materialized views that depend on dead tables are dropped and recreated.

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
-- 3. Drop dependent views/materialized views before tables
--    assumption_evidence (view) depends on interview_insights
--    customer_forces_balance (view) depends on customer_forces
--    dashboard_metrics (materialized view) depends on experiments + interviews
-- ============================================================
drop view if exists public.assumption_evidence;
drop view if exists public.customer_forces_balance;
drop materialized view if exists public.dashboard_metrics;

-- ============================================================
-- 4. Drop 9 dead tables in FK-safe order (leaf → parent) (CANVAS-P0-1)
--    RLS policies are dropped automatically with tables.
--    FK order: interview_questions → interviews → experiments
--              interview_insights → interviews
--              experiment_results → experiments
--              customer_forces → customer_segments
--              jobs_to_be_done → customer_segments
-- ============================================================

-- Leaf tables (no FK children)
drop table if exists public.interview_questions;
drop table if exists public.interview_insights;
drop table if exists public.experiment_results;
drop table if exists public.customer_forces;
drop table if exists public.jobs_to_be_done;
drop table if exists public.lean_canvas_versions;

-- Mid-level: interviews has FK to experiments (interviews_experiment_id_fkey)
drop table if exists public.interviews;

-- Parent tables (all children already dropped)
drop table if exists public.experiments;
drop table if exists public.customer_segments;

-- ============================================================
-- 5. Recreate dashboard_metrics WITHOUT experiments/interviews subqueries
--    (those tables are now dropped; metrics show 0 for those columns)
-- ============================================================
create materialized view dashboard_metrics as
select
  s.id as startup_id,
  s.name as startup_name,
  s.org_id,
  coalesce(t.tasks_total, 0) as tasks_total,
  coalesce(t.tasks_completed, 0) as tasks_completed,
  coalesce(t.tasks_in_progress, 0) as tasks_in_progress,
  coalesce(t.tasks_overdue, 0) as tasks_overdue,
  case
    when coalesce(t.tasks_total, 0) > 0
    then round(coalesce(t.tasks_completed, 0)::numeric / t.tasks_total::numeric * 100)
    else 0
  end as task_completion_rate,
  coalesce(c.contacts_total, 0) as contacts_total,
  coalesce(c.contacts_this_week, 0) as contacts_this_week,
  coalesce(d.deals_total, 0) as deals_total,
  coalesce(d.deals_active, 0) as deals_active,
  coalesce(d.deals_won, 0) as deals_won,
  coalesce(d.deals_value, 0) as deals_total_value,
  case
    when coalesce(d.deals_total, 0) > 0
    then round(coalesce(d.deals_won, 0)::numeric / d.deals_total::numeric * 100)
    else 0
  end as deal_win_rate,
  coalesce(lc.canvas_count, 0) as canvas_count,
  coalesce(lc.canvas_completion, 0) as canvas_completion_pct,
  coalesce(pd.deck_count, 0) as pitch_deck_count,
  coalesce(pd.total_slides, 0) as pitch_deck_slides,
  coalesce(v.validation_score, 0) as validation_score,
  coalesce(v.is_active, false) as validation_active,
  -- experiments and interviews tables dropped; columns kept for API compat (always 0)
  0 as experiments_total,
  0 as experiments_completed,
  0 as interviews_total,
  0 as interviews_this_week,
  coalesce(a.activities_this_week, 0) as activities_this_week,
  coalesce(a.activities_total, 0) as activities_total,
  least(100, greatest(0,
    coalesce(coalesce(t.tasks_completed, 0)::numeric / nullif(t.tasks_total, 0)::numeric * 20, 0) +
    case when coalesce(lc.canvas_completion, 0) > 0 then 20 else 0 end::numeric +
    case when coalesce(pd.total_slides, 0) >= 10 then 20 else coalesce(pd.total_slides, 0) * 2 end::numeric +
    case when coalesce(v.validation_score, 0) > 0 then 20 else 0 end::numeric +
    case when coalesce(a.activities_this_week, 0) >= 5 then 20 else coalesce(a.activities_this_week, 0) * 4 end::numeric
  ))::integer as health_score,
  now() as refreshed_at
from startups s
left join lateral (
  select
    count(*) as tasks_total,
    count(*) filter (where tasks.status = 'completed') as tasks_completed,
    count(*) filter (where tasks.status = 'in_progress') as tasks_in_progress,
    count(*) filter (where tasks.status <> 'completed' and tasks.due_at < current_date) as tasks_overdue
  from tasks where tasks.startup_id = s.id
) t on true
left join lateral (
  select
    count(*) as contacts_total,
    count(*) filter (where contacts.created_at > now() - interval '7 days') as contacts_this_week
  from contacts where contacts.startup_id = s.id
) c on true
left join lateral (
  select
    count(*) as deals_total,
    count(*) filter (where deals.stage != 'lost') as deals_active,
    count(*) filter (where deals.stage = 'won') as deals_won,
    coalesce(sum(deals.amount), 0) as deals_value
  from deals where deals.startup_id = s.id
) d on true
left join lateral (
  select
    count(*) as canvas_count,
    max(case
      when lean_canvases.problem is not null then 11
      when lean_canvases.customer_segments is not null then 11
      when lean_canvases.unique_value_proposition is not null then 11
      when lean_canvases.solution is not null then 11
      when lean_canvases.channels is not null then 11
      when lean_canvases.revenue_streams is not null then 11
      when lean_canvases.cost_structure is not null then 11
      when lean_canvases.key_metrics is not null then 11
      when lean_canvases.unfair_advantage is not null then 11
      else 0
    end) as canvas_completion
  from lean_canvases
  where lean_canvases.startup_id = s.id and lean_canvases.is_current = true
) lc on true
left join lateral (
  select
    count(*) as deck_count,
    0 as total_slides
  from pitch_decks where pitch_decks.startup_id = s.id
) pd on true
left join lateral (
  select
    coalesce(vr.score::integer, 0) as validation_score,
    true as is_active
  from validator_reports vr
  where vr.startup_id = s.id
  order by vr.created_at desc
  limit 1
) v on true
left join lateral (
  select
    count(*) as activities_total,
    count(*) filter (where activities.created_at > now() - interval '7 days') as activities_this_week
  from activities where activities.startup_id = s.id
) a on true;

-- Restore grants (same as before: authenticated + service_role)
grant select on dashboard_metrics to authenticated;
grant select on dashboard_metrics to service_role;

-- ============================================================
-- 6. Drop orphan lean_canvases.playbook_run_id FK + column (CANVAS-P0-3)
--    Column has 0 non-null values. Must drop before playbook_runs drop in P1.
-- ============================================================
alter table public.lean_canvases
    drop constraint if exists lean_canvases_playbook_run_id_fkey;
alter table public.lean_canvases
    drop column if exists playbook_run_id;

-- ============================================================
-- 7. Fix documents.created_by FK: NO ACTION → SET NULL (CANVAS-P0-4)
--    Prevents profile deletion from being blocked by document records.
--    Conditional: only if created_by column exists.
-- ============================================================
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'documents' and column_name = 'created_by'
  ) then
    alter table public.documents drop constraint if exists documents_created_by_fkey;
    alter table public.documents
      add constraint documents_created_by_fkey
      foreign key (created_by) references public.profiles(id) on delete set null;
  end if;
end
$$;
