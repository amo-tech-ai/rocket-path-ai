-- =============================================================================
-- Migration: 20260202100300_create_customer_segments.sql
-- Description: Create customer_segments table for customer personas and targeting
-- Affected Tables: customer_segments
-- Dependencies: startups
-- =============================================================================

-- =============================================================================
-- 1. ENUMS
-- =============================================================================

-- segment type categorizes the customer segment
do $$ begin
  create type segment_type as enum (
    'early_adopter',
    'mainstream',
    'enterprise',
    'smb',
    'consumer',
    'prosumer',
    'developer',
    'other'
  );
exception
  when duplicate_object then null;
end $$;

-- =============================================================================
-- 2. TABLE: customer_segments
-- =============================================================================

-- customer_segments stores detailed customer personas including
-- psychographics, triggers, and jobs-to-be-done context
create table if not exists public.customer_segments (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  startup_id uuid not null references public.startups(id) on delete cascade,

  -- identification
  name text not null,
  segment_type segment_type not null default 'early_adopter',

  -- demographics (optional, for B2C)
  demographics jsonb default '{}'::jsonb, -- age_range, location, income, etc.

  -- firmographics (optional, for B2B)
  firmographics jsonb default '{}'::jsonb, -- industry, company_size, revenue, etc.

  -- psychographics (required - this is the key insight)
  psychographics jsonb default '{}'::jsonb, -- attitudes, values, interests, lifestyle

  -- behavioral
  behaviors jsonb default '{}'::jsonb, -- buying habits, usage patterns, brand loyalty

  -- pain points and triggers
  pain_points text[] default '{}',
  trigger_event text, -- "when does the customer actively seek a solution?"
  desired_outcome text, -- "what does success look like for them?"

  -- current alternatives
  current_solutions text[] default '{}',
  switching_barriers text[] default '{}',

  -- meta
  description text,
  is_primary boolean default false, -- is this the main target segment?
  is_early_adopter boolean default true,
  priority integer default 1 check (priority >= 1 and priority <= 10),

  -- validation status
  interview_count integer default 0,
  validated_at timestamptz,

  -- ai metadata
  ai_generated boolean default false,
  ai_confidence numeric(3,2),

  -- timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================================================
-- 3. ROW LEVEL SECURITY
-- =============================================================================

alter table public.customer_segments enable row level security;

-- select: authenticated users can view segments for their org's startups
create policy "customer_segments_select_authenticated"
on public.customer_segments for select
to authenticated
using (
  startup_id in (
    select s.id from public.startups s
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- insert: authenticated users can create segments for their org's startups
create policy "customer_segments_insert_authenticated"
on public.customer_segments for insert
to authenticated
with check (
  startup_id in (
    select s.id from public.startups s
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- update: authenticated users can update segments for their org's startups
create policy "customer_segments_update_authenticated"
on public.customer_segments for update
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

-- delete: authenticated users can delete segments for their org's startups
create policy "customer_segments_delete_authenticated"
on public.customer_segments for delete
to authenticated
using (
  startup_id in (
    select s.id from public.startups s
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- service role: full access for ai agents
create policy "customer_segments_service_role"
on public.customer_segments for all
to service_role
using (true)
with check (true);

-- =============================================================================
-- 4. INDEXES
-- =============================================================================

-- lookup by startup
create index if not exists idx_customer_segments_startup_id
on public.customer_segments(startup_id);

-- find primary segment
create index if not exists idx_customer_segments_primary
on public.customer_segments(startup_id, is_primary)
where is_primary = true;

-- filter by type
create index if not exists idx_customer_segments_type
on public.customer_segments(startup_id, segment_type);

-- priority ordering
create index if not exists idx_customer_segments_priority
on public.customer_segments(startup_id, priority);

-- =============================================================================
-- 5. TRIGGERS
-- =============================================================================

-- auto-update updated_at timestamp
create or replace function update_customer_segments_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_customer_segments_updated_at
before update on public.customer_segments
for each row execute function update_customer_segments_updated_at();

-- ensure only one primary segment per startup
create or replace function ensure_single_primary_segment()
returns trigger as $$
begin
  if new.is_primary = true then
    update public.customer_segments
    set is_primary = false, updated_at = now()
    where startup_id = new.startup_id
      and id != new.id
      and is_primary = true;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trigger_ensure_single_primary_segment
before insert or update on public.customer_segments
for each row execute function ensure_single_primary_segment();

-- =============================================================================
-- 6. COMMENTS
-- =============================================================================

comment on table public.customer_segments is 'Customer personas and target segments with psychographics and JTBD context';
comment on column public.customer_segments.trigger_event is 'The specific event/moment when customer actively seeks a solution';
comment on column public.customer_segments.desired_outcome is 'What success looks like for this customer segment';
comment on column public.customer_segments.psychographics is 'JSON: attitudes, values, interests, motivations, lifestyle';
