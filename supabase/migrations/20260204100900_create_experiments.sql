-- =============================================================================
-- Migration: 20260202100100_create_experiments.sql
-- Description: Create experiments table for testing assumptions
-- Affected Tables: experiments
-- Dependencies: assumptions
-- =============================================================================

-- =============================================================================
-- 1. ENUMS
-- =============================================================================

-- experiment type defines the methodology
do $$ begin
  create type experiment_type as enum (
    'customer_interview',
    'survey',
    'landing_page',
    'prototype_test',
    'concierge',
    'wizard_of_oz',
    'smoke_test',
    'a_b_test',
    'fake_door',
    'other'
  );
exception
  when duplicate_object then null;
end $$;

-- experiment status tracks progress
do $$ begin
  create type experiment_status as enum (
    'designed',
    'recruiting',
    'running',
    'collecting',
    'analyzing',
    'completed',
    'paused',
    'cancelled'
  );
exception
  when duplicate_object then null;
end $$;

-- =============================================================================
-- 2. TABLE: experiments
-- =============================================================================

-- experiments table stores tests designed to validate assumptions
create table if not exists public.experiments (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  assumption_id uuid not null references public.assumptions(id) on delete cascade,

  -- experiment design
  experiment_type experiment_type not null,
  title text not null,
  hypothesis text not null,
  success_criteria text not null,
  method text,

  -- execution details
  status experiment_status not null default 'designed',
  target_sample_size integer default 5,
  actual_sample_size integer default 0,

  -- timeline
  planned_start_date date,
  planned_end_date date,
  started_at timestamptz,
  completed_at timestamptz,

  -- outcome (set after completion)
  outcome text check (outcome in ('validated', 'invalidated', 'inconclusive')),
  confidence_level numeric(3,2) check (confidence_level >= 0 and confidence_level <= 1),
  summary text,

  -- ai assistance
  ai_designed boolean default false,
  ai_suggestions jsonb default '[]'::jsonb,

  -- metadata
  notes text,
  metadata jsonb default '{}'::jsonb,

  -- timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================================================
-- 3. ROW LEVEL SECURITY
-- =============================================================================

alter table public.experiments enable row level security;

-- select: authenticated users can view experiments for their org's assumptions
create policy "experiments_select_authenticated"
on public.experiments for select
to authenticated
using (
  assumption_id in (
    select a.id from public.assumptions a
    inner join public.startups s on s.id = a.startup_id
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- insert: authenticated users can create experiments for their org's assumptions
create policy "experiments_insert_authenticated"
on public.experiments for insert
to authenticated
with check (
  assumption_id in (
    select a.id from public.assumptions a
    inner join public.startups s on s.id = a.startup_id
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- update: authenticated users can update experiments for their org's assumptions
create policy "experiments_update_authenticated"
on public.experiments for update
to authenticated
using (
  assumption_id in (
    select a.id from public.assumptions a
    inner join public.startups s on s.id = a.startup_id
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
)
with check (
  assumption_id in (
    select a.id from public.assumptions a
    inner join public.startups s on s.id = a.startup_id
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- delete: authenticated users can delete experiments for their org's assumptions
create policy "experiments_delete_authenticated"
on public.experiments for delete
to authenticated
using (
  assumption_id in (
    select a.id from public.assumptions a
    inner join public.startups s on s.id = a.startup_id
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- service role: full access for ai agents
create policy "experiments_service_role"
on public.experiments for all
to service_role
using (true)
with check (true);

-- =============================================================================
-- 4. INDEXES
-- =============================================================================

-- lookup by assumption
create index if not exists idx_experiments_assumption_id
on public.experiments(assumption_id);

-- filter by status
create index if not exists idx_experiments_status
on public.experiments(status);

-- filter by type
create index if not exists idx_experiments_type
on public.experiments(experiment_type);

-- active experiments (for dashboard)
create index if not exists idx_experiments_active
on public.experiments(assumption_id, status)
where status in ('recruiting', 'running', 'collecting', 'analyzing');

-- =============================================================================
-- 5. TRIGGERS
-- =============================================================================

-- auto-update updated_at timestamp
create or replace function update_experiments_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_experiments_updated_at
before update on public.experiments
for each row execute function update_experiments_updated_at();

-- update assumption status when experiment status changes
create or replace function sync_assumption_status()
returns trigger as $$
begin
  -- when experiment starts, mark assumption as testing
  if new.status = 'running' and old.status = 'designed' then
    update public.assumptions
    set status = 'testing', updated_at = now()
    where id = new.assumption_id and status = 'untested';
  end if;

  -- when experiment completes with outcome, update assumption
  if new.status = 'completed' and new.outcome is not null then
    update public.assumptions
    set
      status = case
        when new.outcome = 'validated' then 'validated'::assumption_status
        when new.outcome = 'invalidated' then 'invalidated'::assumption_status
        else status
      end,
      tested_at = now(),
      updated_at = now()
    where id = new.assumption_id;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger trigger_sync_assumption_status
after update on public.experiments
for each row execute function sync_assumption_status();

-- =============================================================================
-- 6. COMMENTS
-- =============================================================================

comment on table public.experiments is 'Tests designed to validate or invalidate business assumptions';
comment on column public.experiments.hypothesis is 'What we believe will happen if assumption is true';
comment on column public.experiments.success_criteria is 'Measurable threshold to validate the assumption';
comment on column public.experiments.outcome is 'Final result after analysis: validated, invalidated, or inconclusive';
