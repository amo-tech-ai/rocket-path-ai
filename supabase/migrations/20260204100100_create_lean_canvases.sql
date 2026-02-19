-- =============================================================================
-- migration: 20260204100100_create_lean_canvases.sql
-- purpose: create lean_canvases table for storing business model canvases
-- affected tables: lean_canvases
-- dependencies: startups
-- =============================================================================

-- =============================================================================
-- 1. table: lean_canvases
-- =============================================================================

-- lean_canvases stores the lean canvas business model for each startup
-- supports versioning for tracking changes over time
create table if not exists public.lean_canvases (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  startup_id uuid not null references public.startups(id) on delete cascade,

  -- lean canvas 9 blocks
  problem text,
  existing_alternatives text,
  solution text,
  key_metrics text,
  unique_value_proposition text,
  unfair_advantage text,
  channels text,
  customer_segments jsonb default '[]'::jsonb,
  cost_structure text,
  revenue_streams text,

  -- additional fields
  early_adopters text,
  high_level_concept text,

  -- versioning
  version integer not null default 1,
  is_current boolean not null default true,
  parent_version_id uuid references public.lean_canvases(id) on delete set null,

  -- scoring and status
  completeness_score integer default 0 check (completeness_score >= 0 and completeness_score <= 100),
  status text default 'draft' check (status in ('draft', 'review', 'final')),

  -- ai metadata
  ai_generated boolean default false,
  ai_suggestions jsonb default '{}'::jsonb,

  -- timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- add table comment
comment on table public.lean_canvases is 'Lean Canvas business model canvases for startups with versioning support.';
comment on column public.lean_canvases.completeness_score is 'Percentage of canvas fields completed (0-100).';
comment on column public.lean_canvases.is_current is 'True if this is the active version of the canvas.';
comment on column public.lean_canvases.customer_segments is 'JSONB array of customer segment objects with name, description, and pain points.';

-- =============================================================================
-- 2. indexes
-- =============================================================================

-- fk index on startup_id
create index if not exists idx_lean_canvases_startup_id
  on public.lean_canvases(startup_id);

-- find current canvas for a startup
create index if not exists idx_lean_canvases_current
  on public.lean_canvases(startup_id, is_current)
  where is_current = true;

-- version history lookup
create index if not exists idx_lean_canvases_versions
  on public.lean_canvases(startup_id, version desc);

-- parent version for history navigation
create index if not exists idx_lean_canvases_parent
  on public.lean_canvases(parent_version_id)
  where parent_version_id is not null;

-- =============================================================================
-- 3. triggers
-- =============================================================================

-- auto-update updated_at timestamp
create trigger trigger_lean_canvases_updated_at
  before update on public.lean_canvases
  for each row
  execute function public.handle_updated_at();

-- =============================================================================
-- 4. helper function: check startup belongs to user's org
-- =============================================================================

-- this function is already defined in base_schema, but adding a safety check
-- create or replace function public.startup_in_org(check_startup_id uuid)
-- returns boolean as $$
--   select exists (
--     select 1 from public.startups
--     where id = check_startup_id and org_id = public.user_org_id()
--   )
-- $$ language sql stable security definer;

-- =============================================================================
-- 5. row level security
-- =============================================================================

alter table public.lean_canvases enable row level security;

-- select: authenticated users can view canvases for their org's startups
create policy "authenticated users can view lean canvases"
  on public.lean_canvases
  for select
  to authenticated
  using (
    startup_id in (
      select s.id
      from public.startups s
      where s.org_id = (select public.user_org_id())
    )
  );

-- insert: authenticated users can create canvases for their org's startups
create policy "authenticated users can create lean canvases"
  on public.lean_canvases
  for insert
  to authenticated
  with check (
    startup_id in (
      select s.id
      from public.startups s
      where s.org_id = (select public.user_org_id())
    )
  );

-- update: authenticated users can update canvases for their org's startups
create policy "authenticated users can update lean canvases"
  on public.lean_canvases
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

-- delete: authenticated users can delete canvases for their org's startups
create policy "authenticated users can delete lean canvases"
  on public.lean_canvases
  for delete
  to authenticated
  using (
    startup_id in (
      select s.id
      from public.startups s
      where s.org_id = (select public.user_org_id())
    )
  );

-- service role: full access for ai agents
create policy "service role has full access to lean canvases"
  on public.lean_canvases
  for all
  to service_role
  using (true)
  with check (true);

-- =============================================================================
-- end of migration: 20260204100100_create_lean_canvases.sql
-- =============================================================================
