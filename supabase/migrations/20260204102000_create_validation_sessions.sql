-- =============================================================================
-- migration: 20260204102000_create_validation_sessions.sql
-- purpose: create validation_sessions table for coach state machine
-- affected tables: validation_sessions
-- dependencies: startups
-- =============================================================================

-- =============================================================================
-- 1. enums for coach phases
-- =============================================================================

-- coach phase enum for state machine tracking
do $$
begin
  if not exists (select 1 from pg_type where typname = 'coach_phase') then
    create type public.coach_phase as enum (
      'onboarding',
      'assessment',
      'constraint',
      'campaign_setup',
      'sprint_planning',
      'sprint_execution',
      'cycle_review'
    );
  end if;
end$$;

-- constraint type enum for identifying bottlenecks
do $$
begin
  if not exists (select 1 from pg_type where typname = 'constraint_type') then
    create type public.constraint_type as enum (
      'acquisition',
      'monetization',
      'retention',
      'scalability'
    );
  end if;
end$$;

-- pdca step enum for sprint tracking
do $$
begin
  if not exists (select 1 from pg_type where typname = 'pdca_step') then
    create type public.pdca_step as enum (
      'plan',
      'do',
      'check',
      'act'
    );
  end if;
end$$;

-- =============================================================================
-- 2. table: validation_sessions
-- =============================================================================

-- validation_sessions is the root of the coach state machine
-- tracks the founder's progress through validation phases
create table if not exists public.validation_sessions (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  startup_id uuid not null references public.startups(id) on delete cascade,

  -- state machine
  phase text not null default 'onboarding',
  state jsonb not null default '{
    "phase": "onboarding",
    "assessmentProgress": 0,
    "assessmentScores": {},
    "constraint": null,
    "campaignType": null,
    "goal90Day": null,
    "currentSprint": 0,
    "pdcaStep": "plan"
  }'::jsonb,

  -- session status
  is_active boolean not null default true,

  -- metadata
  started_at timestamptz not null default now(),
  last_interaction_at timestamptz default now(),

  -- timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- add table comment
comment on table public.validation_sessions is 'Coach state machine root - tracks founder progress through validation phases.';
comment on column public.validation_sessions.phase is 'Current phase: onboarding, assessment, constraint, campaign_setup, sprint_planning, sprint_execution, cycle_review.';
comment on column public.validation_sessions.state is 'JSONB state containing scores, constraint, campaign, sprint info.';
comment on column public.validation_sessions.is_active is 'Only one active session per startup allowed.';

-- =============================================================================
-- 3. indexes
-- =============================================================================

-- fk index on startup_id
create index if not exists idx_validation_sessions_startup_id
  on public.validation_sessions(startup_id);

-- find active session for startup (unique constraint handled by partial index)
create unique index if not exists idx_validation_sessions_active_startup
  on public.validation_sessions(startup_id)
  where is_active = true;

-- sessions by phase for analytics
create index if not exists idx_validation_sessions_phase
  on public.validation_sessions(phase, created_at desc);

-- recent sessions
create index if not exists idx_validation_sessions_recent
  on public.validation_sessions(startup_id, last_interaction_at desc);

-- =============================================================================
-- 4. triggers
-- =============================================================================

-- auto-update updated_at timestamp
create trigger trigger_validation_sessions_updated_at
  before update on public.validation_sessions
  for each row
  execute function public.handle_updated_at();

-- auto-update last_interaction_at on any update
create or replace function public.update_validation_session_interaction()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.last_interaction_at := now();
  return new;
end;
$$;

create trigger trigger_validation_sessions_interaction
  before update on public.validation_sessions
  for each row
  execute function public.update_validation_session_interaction();

-- =============================================================================
-- 5. row level security
-- =============================================================================

alter table public.validation_sessions enable row level security;

-- select: authenticated users can view sessions for their org's startups
create policy "authenticated users can view validation sessions"
  on public.validation_sessions
  for select
  to authenticated
  using (
    startup_id in (
      select s.id
      from public.startups s
      where s.org_id = (select public.user_org_id())
    )
  );

-- insert: authenticated users can create sessions for their org's startups
create policy "authenticated users can create validation sessions"
  on public.validation_sessions
  for insert
  to authenticated
  with check (
    startup_id in (
      select s.id
      from public.startups s
      where s.org_id = (select public.user_org_id())
    )
  );

-- update: authenticated users can update sessions for their org's startups
create policy "authenticated users can update validation sessions"
  on public.validation_sessions
  for update
  to authenticated
  using (
    startup_id in (
      select s.id
      from public.startups s
      where s.org_id = (select public.user_org_id())
    )
  )
  with check (
    startup_id in (
      select s.id
      from public.startups s
      where s.org_id = (select public.user_org_id())
    )
  );

-- delete: authenticated users can delete sessions for their org's startups
create policy "authenticated users can delete validation sessions"
  on public.validation_sessions
  for delete
  to authenticated
  using (
    startup_id in (
      select s.id
      from public.startups s
      where s.org_id = (select public.user_org_id())
    )
  );

-- service role: full access for AI agents
create policy "service role has full access to validation sessions"
  on public.validation_sessions
  for all
  to service_role
  using (true)
  with check (true);

-- =============================================================================
-- end of migration: 20260204102000_create_validation_sessions.sql
-- =============================================================================
