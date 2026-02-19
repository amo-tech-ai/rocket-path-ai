-- =============================================================================
-- migration: 20260204102200_create_validation_campaigns.sql
-- purpose: create validation_campaigns table for 90-day plans
-- affected tables: validation_campaigns
-- dependencies: validation_sessions
-- =============================================================================

-- =============================================================================
-- 1. table: validation_campaigns
-- =============================================================================

-- validation_campaigns stores 90-day campaign plans
-- each campaign focuses on one constraint with a specific goal
create table if not exists public.validation_campaigns (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  session_id uuid not null references public.validation_sessions(id) on delete cascade,

  -- constraint identification
  constraint_type text not null check (constraint_type in (
    'acquisition',
    'monetization',
    'retention',
    'scalability'
  )),
  constraint_explanation text, -- why this is the bottleneck

  -- campaign details
  campaign_type text not null check (campaign_type in (
    'mafia_offer',
    'demo_sell_build',
    'wizard_of_oz',
    'channel_validation',
    'pricing_validation',
    'retention_audit',
    'scale_prep',
    'custom'
  )),
  campaign_name text,

  -- goal setting
  goal text not null, -- 90-day goal statement
  success_metrics jsonb default '[]'::jsonb, -- measurable success criteria
  target_value text, -- specific target (e.g., "10 paying customers")

  -- timeline
  duration_days integer not null default 90,
  start_date date,
  end_date date,

  -- status
  status text not null default 'planning' check (status in (
    'planning',
    'active',
    'paused',
    'completed',
    'abandoned'
  )),

  -- outcome
  outcome text check (outcome in ('persevere', 'pivot', 'pause')),
  outcome_notes text,
  learnings jsonb default '[]'::jsonb,

  -- timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- add table comment
comment on table public.validation_campaigns is '90-day validation campaigns targeting specific constraints.';
comment on column public.validation_campaigns.constraint_type is 'Bottleneck being addressed: acquisition, monetization, retention, scalability.';
comment on column public.validation_campaigns.campaign_type is 'Campaign methodology: mafia_offer, demo_sell_build, wizard_of_oz, etc.';
comment on column public.validation_campaigns.goal is '90-day goal statement for the campaign.';
comment on column public.validation_campaigns.outcome is 'Final decision: persevere, pivot, or pause.';

-- =============================================================================
-- 2. indexes
-- =============================================================================

-- fk index on session_id
create index if not exists idx_validation_campaigns_session_id
  on public.validation_campaigns(session_id);

-- find active campaign for session
create index if not exists idx_validation_campaigns_active
  on public.validation_campaigns(session_id, status)
  where status = 'active';

-- campaigns by constraint type for analytics
create index if not exists idx_validation_campaigns_constraint
  on public.validation_campaigns(constraint_type, created_at desc);

-- campaigns by outcome for analytics
create index if not exists idx_validation_campaigns_outcome
  on public.validation_campaigns(outcome, created_at desc)
  where outcome is not null;

-- =============================================================================
-- 3. triggers
-- =============================================================================

-- auto-update updated_at timestamp
create trigger trigger_validation_campaigns_updated_at
  before update on public.validation_campaigns
  for each row
  execute function public.handle_updated_at();

-- auto-calculate end_date when start_date is set
create or replace function public.calculate_campaign_end_date()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.start_date is not null and new.end_date is null then
    new.end_date := new.start_date + (new.duration_days || ' days')::interval;
  end if;
  return new;
end;
$$;

create trigger trigger_validation_campaigns_end_date
  before insert or update on public.validation_campaigns
  for each row
  execute function public.calculate_campaign_end_date();

-- =============================================================================
-- 4. row level security
-- =============================================================================

alter table public.validation_campaigns enable row level security;

-- select: authenticated users can view campaigns for their sessions
create policy "authenticated users can view validation campaigns"
  on public.validation_campaigns
  for select
  to authenticated
  using (
    session_id in (
      select vs.id
      from public.validation_sessions vs
      join public.startups s on s.id = vs.startup_id
      where s.org_id = (select public.user_org_id())
    )
  );

-- insert: authenticated users can create campaigns for their sessions
create policy "authenticated users can create validation campaigns"
  on public.validation_campaigns
  for insert
  to authenticated
  with check (
    session_id in (
      select vs.id
      from public.validation_sessions vs
      join public.startups s on s.id = vs.startup_id
      where s.org_id = (select public.user_org_id())
    )
  );

-- update: authenticated users can update campaigns for their sessions
create policy "authenticated users can update validation campaigns"
  on public.validation_campaigns
  for update
  to authenticated
  using (
    session_id in (
      select vs.id
      from public.validation_sessions vs
      join public.startups s on s.id = vs.startup_id
      where s.org_id = (select public.user_org_id())
    )
  )
  with check (
    session_id in (
      select vs.id
      from public.validation_sessions vs
      join public.startups s on s.id = vs.startup_id
      where s.org_id = (select public.user_org_id())
    )
  );

-- delete: authenticated users can delete campaigns for their sessions
create policy "authenticated users can delete validation campaigns"
  on public.validation_campaigns
  for delete
  to authenticated
  using (
    session_id in (
      select vs.id
      from public.validation_sessions vs
      join public.startups s on s.id = vs.startup_id
      where s.org_id = (select public.user_org_id())
    )
  );

-- service role: full access for AI agents
create policy "service role has full access to validation campaigns"
  on public.validation_campaigns
  for all
  to service_role
  using (true)
  with check (true);

-- =============================================================================
-- end of migration: 20260204102200_create_validation_campaigns.sql
-- =============================================================================
