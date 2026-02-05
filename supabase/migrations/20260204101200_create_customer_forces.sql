-- =============================================================================
-- Migration: 20260202100400_create_customer_forces.sql
-- Description: Create customer_forces table for the Forces Diagram
--              (Push, Pull, Inertia, Friction from Jobs-to-be-Done framework)
-- Affected Tables: customer_forces
-- Dependencies: customer_segments
-- =============================================================================

-- =============================================================================
-- 1. ENUMS
-- =============================================================================

-- force type based on the Four Forces of Progress framework
do $$ begin
  create type force_type as enum (
    'push',      -- dissatisfaction with current solution (pushes toward change)
    'pull',      -- attraction of new solution (pulls toward change)
    'inertia',   -- habits and existing solutions (resists change)
    'friction'   -- concerns about new solution (resists change)
  );
exception
  when duplicate_object then null;
end $$;

-- =============================================================================
-- 2. TABLE: customer_forces
-- =============================================================================

-- customer_forces stores the four forces that influence buying decisions
-- based on the Jobs-to-be-Done "Four Forces" framework by Bob Moesta
create table if not exists public.customer_forces (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  segment_id uuid not null references public.customer_segments(id) on delete cascade,

  -- force details
  force_type force_type not null,
  description text not null,

  -- strength (1-10, how strong is this force?)
  strength integer not null default 5 check (strength >= 1 and strength <= 10),

  -- category/tag for grouping similar forces
  category text,

  -- source (where did this insight come from?)
  source text check (source in ('interview', 'survey', 'observation', 'assumption', 'research')),
  source_interview_id uuid, -- link to specific interview if applicable

  -- validation
  is_validated boolean default false,
  validated_at timestamptz,
  validation_notes text,

  -- ai metadata
  ai_generated boolean default false,

  -- ordering
  display_order integer default 0,

  -- timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================================================
-- 3. ROW LEVEL SECURITY
-- =============================================================================

alter table public.customer_forces enable row level security;

-- select: authenticated users can view forces for their org's segments
create policy "customer_forces_select_authenticated"
on public.customer_forces for select
to authenticated
using (
  segment_id in (
    select cs.id from public.customer_segments cs
    inner join public.startups s on s.id = cs.startup_id
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- insert: authenticated users can create forces for their org's segments
create policy "customer_forces_insert_authenticated"
on public.customer_forces for insert
to authenticated
with check (
  segment_id in (
    select cs.id from public.customer_segments cs
    inner join public.startups s on s.id = cs.startup_id
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- update: authenticated users can update forces for their org's segments
create policy "customer_forces_update_authenticated"
on public.customer_forces for update
to authenticated
using (
  segment_id in (
    select cs.id from public.customer_segments cs
    inner join public.startups s on s.id = cs.startup_id
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
)
with check (
  segment_id in (
    select cs.id from public.customer_segments cs
    inner join public.startups s on s.id = cs.startup_id
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- delete: authenticated users can delete forces for their org's segments
create policy "customer_forces_delete_authenticated"
on public.customer_forces for delete
to authenticated
using (
  segment_id in (
    select cs.id from public.customer_segments cs
    inner join public.startups s on s.id = cs.startup_id
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- service role: full access for ai agents
create policy "customer_forces_service_role"
on public.customer_forces for all
to service_role
using (true)
with check (true);

-- =============================================================================
-- 4. INDEXES
-- =============================================================================

-- lookup by segment
create index if not exists idx_customer_forces_segment_id
on public.customer_forces(segment_id);

-- filter by force type
create index if not exists idx_customer_forces_type
on public.customer_forces(segment_id, force_type);

-- order by strength for prioritization
create index if not exists idx_customer_forces_strength
on public.customer_forces(segment_id, force_type, strength desc);

-- =============================================================================
-- 5. TRIGGERS
-- =============================================================================

-- auto-update updated_at timestamp
create or replace function update_customer_forces_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_customer_forces_updated_at
before update on public.customer_forces
for each row execute function update_customer_forces_updated_at();

-- =============================================================================
-- 6. COMMENTS
-- =============================================================================

comment on table public.customer_forces is 'Four Forces of Progress: push, pull, inertia, friction for each customer segment';
comment on column public.customer_forces.force_type is 'push=away from old, pull=toward new, inertia=habit resistance, friction=new solution concerns';
comment on column public.customer_forces.strength is 'How strong this force is (1-10). Higher push+pull than inertia+friction = likely to switch';

-- =============================================================================
-- 7. HELPER VIEW: forces_balance
-- =============================================================================

-- this view calculates the net force balance for each segment
-- positive = customer likely to switch, negative = unlikely
create or replace view public.customer_forces_balance as
select
  cs.id as segment_id,
  cs.startup_id,
  cs.name as segment_name,
  coalesce(sum(case when cf.force_type = 'push' then cf.strength else 0 end), 0) as push_total,
  coalesce(sum(case when cf.force_type = 'pull' then cf.strength else 0 end), 0) as pull_total,
  coalesce(sum(case when cf.force_type = 'inertia' then cf.strength else 0 end), 0) as inertia_total,
  coalesce(sum(case when cf.force_type = 'friction' then cf.strength else 0 end), 0) as friction_total,
  -- change forces (push + pull) vs resistance forces (inertia + friction)
  coalesce(sum(case when cf.force_type in ('push', 'pull') then cf.strength else 0 end), 0) -
  coalesce(sum(case when cf.force_type in ('inertia', 'friction') then cf.strength else 0 end), 0) as net_force_balance
from public.customer_segments cs
left join public.customer_forces cf on cf.segment_id = cs.id
group by cs.id, cs.startup_id, cs.name;

comment on view public.customer_forces_balance is 'Aggregated force balance per segment. Positive net_force_balance = customer likely to switch';
