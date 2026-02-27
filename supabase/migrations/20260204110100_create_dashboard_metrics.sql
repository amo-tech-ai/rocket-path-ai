-- =============================================================================
-- migration: 20260204110100_create_dashboard_metrics.sql
-- purpose: create dashboard_metrics materialized view and metric_snapshots table for task 020-DSH
-- affected tables: metric_snapshots, dashboard_metrics (materialized view)
-- dependencies: startups, tasks, contacts, deals, lean_canvases, pitch_decks, validation_sessions
-- =============================================================================

-- =============================================================================
-- 1. table: metric_snapshots
-- =============================================================================

-- metric_snapshots stores historical metric data points
create table if not exists public.metric_snapshots (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  startup_id uuid not null references public.startups(id) on delete cascade,

  -- snapshot period
  snapshot_date date not null default current_date,
  snapshot_type text not null default 'daily',

  -- core metrics
  tasks_total integer not null default 0,
  tasks_completed integer not null default 0,
  tasks_in_progress integer not null default 0,
  tasks_overdue integer not null default 0,

  -- CRM metrics
  contacts_total integer not null default 0,
  contacts_this_week integer not null default 0,
  deals_total integer not null default 0,
  deals_active integer not null default 0,
  deals_won integer not null default 0,
  deals_value_total numeric(15,2) not null default 0,

  -- document metrics
  documents_total integer not null default 0,
  canvas_completion_pct integer not null default 0,
  pitch_deck_slides integer not null default 0,

  -- validation metrics
  validation_score integer,
  experiments_total integer not null default 0,
  experiments_completed integer not null default 0,
  interviews_total integer not null default 0,

  -- activity metrics
  activities_this_week integer not null default 0,
  ai_runs_this_week integer not null default 0,

  -- calculated scores
  health_score integer,
  momentum_score integer,
  engagement_score integer,

  -- raw data for analysis
  raw_metrics jsonb not null default '{}'::jsonb,

  -- timestamps
  created_at timestamptz not null default now()
);

-- add table comments
comment on table public.metric_snapshots is 'Historical snapshots of startup metrics for trend analysis.';
comment on column public.metric_snapshots.snapshot_type is 'daily, weekly, or monthly';
comment on column public.metric_snapshots.health_score is 'Calculated 0-100 health score';

-- =============================================================================
-- 2. indexes for metric_snapshots
-- =============================================================================

create index if not exists idx_metric_snapshots_startup_id
  on public.metric_snapshots(startup_id);

create index if not exists idx_metric_snapshots_startup_date
  on public.metric_snapshots(startup_id, snapshot_date desc);

create unique index if not exists idx_metric_snapshots_unique_daily
  on public.metric_snapshots(startup_id, snapshot_date, snapshot_type);

create index if not exists idx_metric_snapshots_date
  on public.metric_snapshots(snapshot_date desc);

-- recent snapshots (simple desc index; partial with now() is not IMMUTABLE)
create index if not exists idx_metric_snapshots_recent
  on public.metric_snapshots(startup_id, created_at desc);

-- =============================================================================
-- 3. RLS for metric_snapshots
-- =============================================================================

alter table public.metric_snapshots enable row level security;

create policy "users can view startup metric snapshots"
  on public.metric_snapshots for select to authenticated
  using (startup_id in (
    select s.id from public.startups s
    where s.org_id = (select public.user_org_id())
  ));

create policy "users can create metric snapshots"
  on public.metric_snapshots for insert to authenticated
  with check (startup_id in (
    select s.id from public.startups s
    where s.org_id = (select public.user_org_id())
  ));

create policy "users can update metric snapshots"
  on public.metric_snapshots for update to authenticated
  using (startup_id in (
    select s.id from public.startups s
    where s.org_id = (select public.user_org_id())
  ))
  with check (startup_id in (
    select s.id from public.startups s
    where s.org_id = (select public.user_org_id())
  ));

create policy "users can delete metric snapshots"
  on public.metric_snapshots for delete to authenticated
  using (startup_id in (
    select s.id from public.startups s
    where s.org_id = (select public.user_org_id())
  ));

create policy "service role full access metric snapshots"
  on public.metric_snapshots for all to service_role
  using (true) with check (true);

-- =============================================================================
-- 4. materialized view: dashboard_metrics
-- =============================================================================

-- drop if exists for clean recreation
drop materialized view if exists public.dashboard_metrics;

-- create materialized view with aggregated metrics per startup
create materialized view public.dashboard_metrics as
select
  s.id as startup_id,
  s.name as startup_name,
  s.org_id,

  -- task metrics
  coalesce(t.tasks_total, 0) as tasks_total,
  coalesce(t.tasks_completed, 0) as tasks_completed,
  coalesce(t.tasks_in_progress, 0) as tasks_in_progress,
  coalesce(t.tasks_overdue, 0) as tasks_overdue,
  case when coalesce(t.tasks_total, 0) > 0
    then round((coalesce(t.tasks_completed, 0)::numeric / t.tasks_total) * 100)
    else 0
  end as task_completion_rate,

  -- contact metrics
  coalesce(c.contacts_total, 0) as contacts_total,
  coalesce(c.contacts_this_week, 0) as contacts_this_week,

  -- deal metrics
  coalesce(d.deals_total, 0) as deals_total,
  coalesce(d.deals_active, 0) as deals_active,
  coalesce(d.deals_won, 0) as deals_won,
  coalesce(d.deals_value, 0) as deals_total_value,
  case when coalesce(d.deals_total, 0) > 0
    then round((coalesce(d.deals_won, 0)::numeric / d.deals_total) * 100)
    else 0
  end as deal_win_rate,

  -- canvas metrics
  coalesce(lc.canvas_count, 0) as canvas_count,
  coalesce(lc.canvas_completion, 0) as canvas_completion_pct,

  -- pitch deck metrics
  coalesce(pd.deck_count, 0) as pitch_deck_count,
  coalesce(pd.total_slides, 0) as pitch_deck_slides,

  -- validation metrics
  coalesce(v.validation_score, 0) as validation_score,
  coalesce(v.is_active, false) as validation_active,

  -- experiment metrics
  coalesce(e.experiments_total, 0) as experiments_total,
  coalesce(e.experiments_completed, 0) as experiments_completed,

  -- interview metrics
  coalesce(i.interviews_total, 0) as interviews_total,
  coalesce(i.interviews_this_week, 0) as interviews_this_week,

  -- activity metrics
  coalesce(a.activities_this_week, 0) as activities_this_week,
  coalesce(a.activities_total, 0) as activities_total,

  -- calculated health score (0-100)
  least(100, greatest(0,
    (coalesce(t.tasks_completed, 0)::numeric / nullif(t.tasks_total, 0) * 20) +
    (case when coalesce(lc.canvas_completion, 0) > 0 then 20 else 0 end) +
    (case when coalesce(pd.total_slides, 0) >= 10 then 20 else coalesce(pd.total_slides, 0) * 2 end) +
    (case when coalesce(v.validation_score, 0) > 0 then 20 else 0 end) +
    (case when coalesce(a.activities_this_week, 0) >= 5 then 20 else coalesce(a.activities_this_week, 0) * 4 end)
  ))::integer as health_score,

  -- refresh timestamp
  now() as refreshed_at

from public.startups s

-- task aggregation
left join lateral (
  select
    count(*) as tasks_total,
    count(*) filter (where status = 'completed') as tasks_completed,
    count(*) filter (where status = 'in_progress') as tasks_in_progress,
    count(*) filter (where status != 'completed' and due_at < current_date) as tasks_overdue
  from public.tasks
  where startup_id = s.id
) t on true

-- contact aggregation
left join lateral (
  select
    count(*) as contacts_total,
    count(*) filter (where created_at > now() - interval '7 days') as contacts_this_week
  from public.contacts
  where startup_id = s.id
) c on true

-- deal aggregation
left join lateral (
  select
    count(*) as deals_total,
    count(*) filter (where stage != 'lost') as deals_active,
    count(*) filter (where stage = 'won') as deals_won,
    coalesce(sum(amount), 0) as deals_value
  from public.deals
  where startup_id = s.id
) d on true

-- lean canvas aggregation
left join lateral (
  select
    count(*) as canvas_count,
    max(
      case
        when problem is not null then 11
        when customer_segments is not null then 11
        when unique_value_proposition is not null then 11
        when solution is not null then 11
        when channels is not null then 11
        when revenue_streams is not null then 11
        when cost_structure is not null then 11
        when key_metrics is not null then 11
        when unfair_advantage is not null then 11
        else 0
      end
    ) as canvas_completion
  from public.lean_canvases
  where startup_id = s.id and is_current = true
) lc on true

-- pitch deck aggregation
left join lateral (
  select
    count(*) as deck_count,
    0 as total_slides  -- slide_count column exists in prod only
  from public.pitch_decks
  where startup_id = s.id
) pd on true

-- validation session
left join lateral (
  select
    coalesce((state->>'assessmentProgress')::integer, 0) as validation_score,
    is_active
  from public.validation_sessions
  where startup_id = s.id and is_active = true
  limit 1
) v on true

-- experiments aggregation (via assumptions)
left join lateral (
  select
    count(*) as experiments_total,
    count(*) filter (where ex.status = 'completed') as experiments_completed
  from public.experiments ex
  join public.assumptions asm on asm.id = ex.assumption_id
  where asm.startup_id = s.id
) e on true

-- interviews aggregation
left join lateral (
  select
    count(*) as interviews_total,
    count(*) filter (where conducted_at > now() - interval '7 days') as interviews_this_week
  from public.interviews
  where startup_id = s.id
) i on true

-- activities aggregation
left join lateral (
  select
    count(*) as activities_total,
    count(*) filter (where created_at > now() - interval '7 days') as activities_this_week
  from public.activities
  where startup_id = s.id
) a on true;

-- add comment to materialized view
comment on materialized view public.dashboard_metrics is 'Aggregated dashboard metrics per startup - refresh with REFRESH MATERIALIZED VIEW CONCURRENTLY';

-- =============================================================================
-- 5. indexes for materialized view
-- =============================================================================

create unique index if not exists idx_dashboard_metrics_startup_id
  on public.dashboard_metrics(startup_id);

create index if not exists idx_dashboard_metrics_org_id
  on public.dashboard_metrics(org_id);

create index if not exists idx_dashboard_metrics_health
  on public.dashboard_metrics(health_score desc);

-- =============================================================================
-- 6. refresh function
-- =============================================================================

-- function to refresh dashboard metrics
create or replace function public.refresh_dashboard_metrics()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  refresh materialized view concurrently public.dashboard_metrics;
end;
$$;

-- function to capture daily snapshot
create or replace function public.capture_metric_snapshot(p_startup_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_snapshot_id uuid;
  v_metrics record;
begin
  -- get current metrics from materialized view
  select * into v_metrics
  from public.dashboard_metrics
  where startup_id = p_startup_id;

  -- if no metrics found, return null
  if not found then
    return null;
  end if;

  -- insert snapshot
  insert into public.metric_snapshots (
    startup_id,
    snapshot_date,
    snapshot_type,
    tasks_total,
    tasks_completed,
    tasks_in_progress,
    tasks_overdue,
    contacts_total,
    contacts_this_week,
    deals_total,
    deals_active,
    deals_won,
    deals_value_total,
    canvas_completion_pct,
    pitch_deck_slides,
    validation_score,
    experiments_total,
    experiments_completed,
    interviews_total,
    activities_this_week,
    health_score,
    raw_metrics
  )
  values (
    p_startup_id,
    current_date,
    'daily',
    v_metrics.tasks_total,
    v_metrics.tasks_completed,
    v_metrics.tasks_in_progress,
    v_metrics.tasks_overdue,
    v_metrics.contacts_total,
    v_metrics.contacts_this_week,
    v_metrics.deals_total,
    v_metrics.deals_active,
    v_metrics.deals_won,
    v_metrics.deals_total_value,
    v_metrics.canvas_completion_pct,
    v_metrics.pitch_deck_slides,
    v_metrics.validation_score,
    v_metrics.experiments_total,
    v_metrics.experiments_completed,
    v_metrics.interviews_total,
    v_metrics.activities_this_week,
    v_metrics.health_score,
    to_jsonb(v_metrics)
  )
  on conflict (startup_id, snapshot_date, snapshot_type)
  do update set
    tasks_total = excluded.tasks_total,
    tasks_completed = excluded.tasks_completed,
    tasks_in_progress = excluded.tasks_in_progress,
    tasks_overdue = excluded.tasks_overdue,
    contacts_total = excluded.contacts_total,
    contacts_this_week = excluded.contacts_this_week,
    deals_total = excluded.deals_total,
    deals_active = excluded.deals_active,
    deals_won = excluded.deals_won,
    deals_value_total = excluded.deals_value_total,
    canvas_completion_pct = excluded.canvas_completion_pct,
    pitch_deck_slides = excluded.pitch_deck_slides,
    validation_score = excluded.validation_score,
    experiments_total = excluded.experiments_total,
    experiments_completed = excluded.experiments_completed,
    interviews_total = excluded.interviews_total,
    activities_this_week = excluded.activities_this_week,
    health_score = excluded.health_score,
    raw_metrics = excluded.raw_metrics
  returning id into v_snapshot_id;

  return v_snapshot_id;
end;
$$;

-- function to get metric trends
create or replace function public.get_metric_trends(
  p_startup_id uuid,
  p_days integer default 30
)
returns table (
  snapshot_date date,
  health_score integer,
  tasks_completed integer,
  contacts_total integer,
  deals_won integer,
  validation_score integer
)
language sql
security invoker
set search_path = public
as $$
  select
    snapshot_date,
    health_score,
    tasks_completed,
    contacts_total,
    deals_won,
    validation_score
  from public.metric_snapshots
  where startup_id = p_startup_id
    and snapshot_date >= current_date - p_days
  order by snapshot_date asc;
$$;

-- =============================================================================
-- end of migration: 20260204110100_create_dashboard_metrics.sql
-- =============================================================================
