-- =============================================================================
-- Migration: 20260202100000_create_assumptions.sql
-- Description: Create assumptions table for tracking business hypotheses
--              extracted from Lean Canvas boxes
-- Affected Tables: assumptions
-- Dependencies: startups, lean_canvases
-- =============================================================================

-- =============================================================================
-- 1. ENUMS
-- =============================================================================

-- assumption status tracks the validation lifecycle
do $$ begin
  create type assumption_status as enum ('untested', 'testing', 'validated', 'invalidated', 'obsolete');
exception
  when duplicate_object then null;
end $$;

-- source block identifies which lean canvas box the assumption came from
do $$ begin
  create type assumption_source as enum (
    'problem',
    'solution',
    'unique_value_proposition',
    'unfair_advantage',
    'customer_segments',
    'channels',
    'revenue_streams',
    'cost_structure',
    'key_metrics'
  );
exception
  when duplicate_object then null;
end $$;

-- =============================================================================
-- 2. TABLE: assumptions
-- =============================================================================

-- assumptions table stores business hypotheses that need validation
-- these are extracted from lean canvas boxes and prioritized by risk
create table if not exists public.assumptions (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  startup_id uuid not null references public.startups(id) on delete cascade,
  lean_canvas_id uuid references public.lean_canvases(id) on delete set null,

  -- core fields
  source_block assumption_source not null,
  statement text not null,

  -- scoring (higher = riskier, should test first)
  -- impact: how much does this affect business success (1-10)
  impact_score integer not null default 5 check (impact_score >= 1 and impact_score <= 10),
  -- uncertainty: how confident are we this is true (1-10, higher = less certain)
  uncertainty_score integer not null default 5 check (uncertainty_score >= 1 and uncertainty_score <= 10),
  -- priority: impact * uncertainty (calculated, higher = test first)
  priority_score integer generated always as (impact_score * uncertainty_score) stored,

  -- status tracking
  status assumption_status not null default 'untested',
  tested_at timestamptz,

  -- ai metadata
  ai_extracted boolean default false,
  extraction_confidence numeric(3,2) check (extraction_confidence >= 0 and extraction_confidence <= 1),

  -- notes
  notes text,

  -- timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================================================
-- 3. ROW LEVEL SECURITY
-- =============================================================================

alter table public.assumptions enable row level security;

-- select: authenticated users can view assumptions for their org's startups
create policy "assumptions_select_authenticated"
on public.assumptions for select
to authenticated
using (
  startup_id in (
    select s.id from public.startups s
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- insert: authenticated users can create assumptions for their org's startups
create policy "assumptions_insert_authenticated"
on public.assumptions for insert
to authenticated
with check (
  startup_id in (
    select s.id from public.startups s
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- update: authenticated users can update assumptions for their org's startups
create policy "assumptions_update_authenticated"
on public.assumptions for update
to authenticated
using (
  startup_id in (
    select s.id from public.startups s
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
)
with check (
  startup_id in (
    select s.id from public.startups s
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- delete: authenticated users can delete assumptions for their org's startups
create policy "assumptions_delete_authenticated"
on public.assumptions for delete
to authenticated
using (
  startup_id in (
    select s.id from public.startups s
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- service role: full access for ai agents
create policy "assumptions_service_role"
on public.assumptions for all
to service_role
using (true)
with check (true);

-- =============================================================================
-- 4. INDEXES
-- =============================================================================

-- primary lookup by startup
create index if not exists idx_assumptions_startup_id
on public.assumptions(startup_id);

-- filter by status and priority for risk board
create index if not exists idx_assumptions_startup_status_priority
on public.assumptions(startup_id, status, priority_score desc);

-- link to lean canvas
create index if not exists idx_assumptions_lean_canvas_id
on public.assumptions(lean_canvas_id);

-- filter by source block
create index if not exists idx_assumptions_source_block
on public.assumptions(startup_id, source_block);

-- =============================================================================
-- 5. TRIGGERS
-- =============================================================================

-- auto-update updated_at timestamp
create or replace function update_assumptions_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_assumptions_updated_at
before update on public.assumptions
for each row execute function update_assumptions_updated_at();

-- =============================================================================
-- 6. COMMENTS
-- =============================================================================

comment on table public.assumptions is 'Business hypotheses extracted from Lean Canvas for validation tracking';
comment on column public.assumptions.source_block is 'Which Lean Canvas box this assumption came from';
comment on column public.assumptions.impact_score is 'How much business success depends on this (1-10)';
comment on column public.assumptions.uncertainty_score is 'How uncertain we are this is true (1-10, higher = less certain)';
comment on column public.assumptions.priority_score is 'Calculated: impact * uncertainty. Higher = test first';
