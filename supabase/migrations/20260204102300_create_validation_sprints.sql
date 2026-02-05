-- =============================================================================
-- migration: 20260204102300_create_validation_sprints.sql
-- purpose: create validation_sprints table for PDCA tracking
-- affected tables: validation_sprints
-- dependencies: validation_campaigns
-- =============================================================================

-- =============================================================================
-- 1. table: validation_sprints
-- =============================================================================

-- validation_sprints tracks individual sprints within a campaign
-- each sprint follows PDCA methodology (Plan, Do, Check, Act)
create table if not exists public.validation_sprints (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  campaign_id uuid not null references public.validation_campaigns(id) on delete cascade,

  -- sprint details
  sprint_number integer not null,
  purpose text not null, -- what this sprint aims to achieve

  -- pdca tracking
  pdca_step text not null default 'plan' check (pdca_step in ('plan', 'do', 'check', 'act')),

  -- plan phase
  hypothesis text,
  experiment_design text,
  success_criteria text,
  method text,

  -- do phase
  actions_taken jsonb default '[]'::jsonb,
  notes text,

  -- check phase
  results jsonb default '{}'::jsonb,
  metrics_achieved jsonb default '{}'::jsonb,
  success boolean,

  -- act phase
  learnings jsonb default '[]'::jsonb,
  decision text check (decision in ('continue', 'adjust', 'pivot')),
  decision_rationale text,
  next_steps jsonb default '[]'::jsonb,

  -- outcomes
  outcomes jsonb default '{}'::jsonb, -- structured outcomes

  -- timeline
  started_at timestamptz,
  completed_at timestamptz,

  -- status
  status text not null default 'planning' check (status in (
    'planning',
    'in_progress',
    'reviewing',
    'completed',
    'skipped'
  )),

  -- timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- ensure unique sprint numbers per campaign
  unique (campaign_id, sprint_number)
);

-- add table comment
comment on table public.validation_sprints is 'Individual sprints within a 90-day campaign following PDCA methodology.';
comment on column public.validation_sprints.sprint_number is 'Sprint number within the campaign (1-6 typically).';
comment on column public.validation_sprints.pdca_step is 'Current PDCA step: plan, do, check, act.';
comment on column public.validation_sprints.decision is 'Sprint decision: continue, adjust, or pivot.';

-- =============================================================================
-- 2. indexes
-- =============================================================================

-- fk index on campaign_id
create index if not exists idx_validation_sprints_campaign_id
  on public.validation_sprints(campaign_id);

-- find current sprint for campaign
create index if not exists idx_validation_sprints_current
  on public.validation_sprints(campaign_id, sprint_number desc);

-- sprints by status
create index if not exists idx_validation_sprints_status
  on public.validation_sprints(status, created_at desc);

-- sprints by pdca step (for analytics)
create index if not exists idx_validation_sprints_pdca
  on public.validation_sprints(pdca_step, status);

-- =============================================================================
-- 3. triggers
-- =============================================================================

-- auto-update updated_at timestamp
create trigger trigger_validation_sprints_updated_at
  before update on public.validation_sprints
  for each row
  execute function public.handle_updated_at();

-- auto-set started_at when status changes to in_progress
create or replace function public.track_sprint_timeline()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- set started_at when moving to in_progress
  if new.status = 'in_progress' and old.status = 'planning' and new.started_at is null then
    new.started_at := now();
  end if;

  -- set completed_at when moving to completed
  if new.status = 'completed' and old.status != 'completed' and new.completed_at is null then
    new.completed_at := now();
  end if;

  return new;
end;
$$;

create trigger trigger_validation_sprints_timeline
  before update on public.validation_sprints
  for each row
  execute function public.track_sprint_timeline();

-- =============================================================================
-- 4. row level security
-- =============================================================================

alter table public.validation_sprints enable row level security;

-- select: authenticated users can view sprints for their campaigns
create policy "authenticated users can view validation sprints"
  on public.validation_sprints
  for select
  to authenticated
  using (
    campaign_id in (
      select vc.id
      from public.validation_campaigns vc
      join public.validation_sessions vs on vs.id = vc.session_id
      join public.startups s on s.id = vs.startup_id
      where s.org_id = (select public.user_org_id())
    )
  );

-- insert: authenticated users can create sprints for their campaigns
create policy "authenticated users can create validation sprints"
  on public.validation_sprints
  for insert
  to authenticated
  with check (
    campaign_id in (
      select vc.id
      from public.validation_campaigns vc
      join public.validation_sessions vs on vs.id = vc.session_id
      join public.startups s on s.id = vs.startup_id
      where s.org_id = (select public.user_org_id())
    )
  );

-- update: authenticated users can update sprints for their campaigns
create policy "authenticated users can update validation sprints"
  on public.validation_sprints
  for update
  to authenticated
  using (
    campaign_id in (
      select vc.id
      from public.validation_campaigns vc
      join public.validation_sessions vs on vs.id = vc.session_id
      join public.startups s on s.id = vs.startup_id
      where s.org_id = (select public.user_org_id())
    )
  )
  with check (
    campaign_id in (
      select vc.id
      from public.validation_campaigns vc
      join public.validation_sessions vs on vs.id = vc.session_id
      join public.startups s on s.id = vs.startup_id
      where s.org_id = (select public.user_org_id())
    )
  );

-- delete: authenticated users can delete sprints for their campaigns
create policy "authenticated users can delete validation sprints"
  on public.validation_sprints
  for delete
  to authenticated
  using (
    campaign_id in (
      select vc.id
      from public.validation_campaigns vc
      join public.validation_sessions vs on vs.id = vc.session_id
      join public.startups s on s.id = vs.startup_id
      where s.org_id = (select public.user_org_id())
    )
  );

-- service role: full access for AI agents
create policy "service role has full access to validation sprints"
  on public.validation_sprints
  for all
  to service_role
  using (true)
  with check (true);

-- =============================================================================
-- 5. helper function: get current sprint for campaign
-- =============================================================================

create or replace function public.get_current_sprint(p_campaign_id uuid)
returns public.validation_sprints
language sql
stable
security definer
set search_path = public
as $$
  select *
  from public.validation_sprints
  where campaign_id = p_campaign_id
    and status in ('planning', 'in_progress', 'reviewing')
  order by sprint_number desc
  limit 1;
$$;

comment on function public.get_current_sprint(uuid) is 'Returns the current active sprint for a campaign.';

-- =============================================================================
-- end of migration: 20260204102300_create_validation_sprints.sql
-- =============================================================================
