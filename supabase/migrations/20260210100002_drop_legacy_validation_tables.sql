-- Week 2: Drop 8 legacy validation_* tables + rename validation_reports → validator_reports
--
-- Preconditions verified 2026-02-10:
--   - All code references to these 8 tables have been removed or redirected
--   - context-loader.ts: gutted (no-op session/conversation functions)
--   - useSprints.ts: stubbed (returns empty data)
--   - prompt-pack, pipeline, validator-status, industry-expert-agent,
--     opportunity-canvas, workflow-trigger, ValidatorReport.tsx,
--     useValidationReport.ts: validation_reports → validator_reports
--   - Row counts: all 0 except validation_runs (1 test row, acceptable loss)
--   - validation_reports (16 rows): RENAME only, data preserved
--
-- 8 triggers on these tables will be auto-dropped with the tables.
-- All indexes and RLS policies on dropped tables will also be removed.
-- RLS policies on validation_reports survive the RENAME automatically.

-- =============================================
-- 0a. Drop dashboard_metrics materialized view (depends on validation_sessions)
-- =============================================
-- Will be recreated in step 5 with validator_reports instead of validation_sessions.
drop materialized view if exists dashboard_metrics;

-- =============================================
-- 0b. Drop legacy helper functions that depend on validation_* types
-- =============================================

-- get_current_sprint returns validation_sprints type — blocks table DROP
drop function if exists get_current_sprint(uuid);

-- These query validation_* tables internally — dead code after DROP
drop function if exists get_validation_scores(uuid);
drop function if exists get_conversation_history(uuid, integer);
drop function if exists get_sprint_experiments(uuid);
drop function if exists get_validation_history(uuid, integer);

-- =============================================
-- 1. Drop leaf tables (no inbound FKs)
-- =============================================

-- validation_verdicts → FK to validation_runs only
drop table if exists validation_verdicts;

-- validation_experiments → FK to validation_sprints only
drop table if exists validation_experiments;

-- validation_assessments → FK to validation_sessions only
drop table if exists validation_assessments;

-- validation_conversations → FK to validation_sessions only
drop table if exists validation_conversations;

-- =============================================
-- 2. Drop mid-level tables
-- =============================================

-- validation_sprints → FK to validation_campaigns (children already dropped)
drop table if exists validation_sprints;

-- validation_campaigns → FK to validation_sessions (children already dropped)
drop table if exists validation_campaigns;

-- =============================================
-- 3. Drop root tables
-- =============================================

-- validation_sessions → FK to startups (all children already dropped)
-- 0 rows, 0 active code references
drop table if exists validation_sessions;

-- validation_runs → FK to startups, organizations, prompt_pack_runs
-- 1 test row (acceptable loss). No inbound FKs after validation_verdicts dropped.
drop table if exists validation_runs;

-- =============================================
-- 4. Rename active table: validation_reports → validator_reports
-- =============================================

-- 16 rows of active data. FKs to validator_sessions + startups preserved.
-- 3 RLS policies (service_role ALL, authenticated INSERT, authenticated SELECT)
-- follow the rename automatically.
alter table if exists validation_reports rename to validator_reports;

-- =============================================
-- 5. Recreate dashboard_metrics materialized view
-- =============================================
-- Changed: validation_sessions lateral join → validator_reports lateral join
-- (uses actual validation report score instead of session-level assessment progress)

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
  coalesce(e.experiments_total, 0) as experiments_total,
  coalesce(e.experiments_completed, 0) as experiments_completed,
  coalesce(i.interviews_total, 0) as interviews_total,
  coalesce(i.interviews_this_week, 0) as interviews_this_week,
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
    count(*) filter (where deals.is_active = true) as deals_active,
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
    coalesce(max(pitch_decks.slide_count), 0) as total_slides
  from pitch_decks where pitch_decks.startup_id = s.id
) pd on true
left join lateral (
  -- Changed: reads from validator_reports instead of legacy validation_sessions
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
    count(*) as experiments_total,
    count(*) filter (where ex.status = 'completed'::experiment_status) as experiments_completed
  from experiments ex
  join assumptions asm on asm.id = ex.assumption_id
  where asm.startup_id = s.id
) e on true
left join lateral (
  select
    count(*) as interviews_total,
    count(*) filter (where interviews.conducted_at > now() - interval '7 days') as interviews_this_week
  from interviews where interviews.startup_id = s.id
) i on true
left join lateral (
  select
    count(*) as activities_total,
    count(*) filter (where activities.created_at > now() - interval '7 days') as activities_this_week
  from activities where activities.startup_id = s.id
) a on true;

-- Restore grants (same as original: authenticated + service_role)
grant select on dashboard_metrics to authenticated;
grant select on dashboard_metrics to service_role;

-- =============================================
-- Verification: should return 0 rows after migration
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema='public' AND table_name LIKE 'validation_%';
-- =============================================
