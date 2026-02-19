-- =============================================================================
-- Migration: 20260202100500_create_jobs_to_be_done.sql
-- Description: Create jobs_to_be_done table for JTBD framework
--              (Functional, Emotional, Social jobs)
-- Affected Tables: jobs_to_be_done
-- Dependencies: customer_segments
-- =============================================================================

-- =============================================================================
-- 1. ENUMS
-- =============================================================================

-- job type based on JTBD framework
do $$ begin
  create type job_type as enum (
    'functional',  -- what the customer needs to accomplish
    'emotional',   -- how the customer wants to feel
    'social'       -- how the customer wants to be perceived
  );
exception
  when duplicate_object then null;
end $$;

-- =============================================================================
-- 2. TABLE: jobs_to_be_done
-- =============================================================================

-- jobs_to_be_done stores the jobs customers are trying to accomplish
-- using the Jobs-to-be-Done framework (Clayton Christensen, Bob Moesta)
create table if not exists public.jobs_to_be_done (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  segment_id uuid not null references public.customer_segments(id) on delete cascade,

  -- job definition using the JTBD format
  job_type job_type not null,

  -- the job statement components:
  -- "When I [situation], I want to [motivation] so I can [expected_outcome]"
  situation text not null,        -- the triggering context
  motivation text not null,       -- what they want to do/feel/be seen as
  expected_outcome text not null, -- the end result they're seeking

  -- full job statement (generated or manual)
  job_statement text generated always as (
    'When I ' || situation || ', I want to ' || motivation || ' so I can ' || expected_outcome
  ) stored,

  -- importance and satisfaction
  importance integer default 5 check (importance >= 1 and importance <= 10),
  current_satisfaction integer default 5 check (current_satisfaction >= 1 and current_satisfaction <= 10),
  -- opportunity = importance - satisfaction (higher = bigger opportunity)
  opportunity_score integer generated always as (importance - current_satisfaction) stored,

  -- frequency (how often does this job need to be done?)
  frequency text check (frequency in ('hourly', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'situational')),

  -- related jobs
  related_functional_job_id uuid references public.jobs_to_be_done(id),

  -- source
  source text check (source in ('interview', 'survey', 'observation', 'assumption', 'research')),
  source_interview_id uuid,

  -- validation
  is_validated boolean default false,
  validated_at timestamptz,
  interview_count integer default 0,

  -- ai metadata
  ai_generated boolean default false,

  -- ordering
  priority integer default 1,

  -- timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================================================
-- 3. ROW LEVEL SECURITY
-- =============================================================================

alter table public.jobs_to_be_done enable row level security;

-- select: authenticated users can view jobs for their org's segments
create policy "jobs_to_be_done_select_authenticated"
on public.jobs_to_be_done for select
to authenticated
using (
  segment_id in (
    select cs.id from public.customer_segments cs
    inner join public.startups s on s.id = cs.startup_id
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- insert: authenticated users can create jobs for their org's segments
create policy "jobs_to_be_done_insert_authenticated"
on public.jobs_to_be_done for insert
to authenticated
with check (
  segment_id in (
    select cs.id from public.customer_segments cs
    inner join public.startups s on s.id = cs.startup_id
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- update: authenticated users can update jobs for their org's segments
create policy "jobs_to_be_done_update_authenticated"
on public.jobs_to_be_done for update
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

-- delete: authenticated users can delete jobs for their org's segments
create policy "jobs_to_be_done_delete_authenticated"
on public.jobs_to_be_done for delete
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
create policy "jobs_to_be_done_service_role"
on public.jobs_to_be_done for all
to service_role
using (true)
with check (true);

-- =============================================================================
-- 4. INDEXES
-- =============================================================================

-- lookup by segment
create index if not exists idx_jobs_to_be_done_segment_id
on public.jobs_to_be_done(segment_id);

-- filter by job type
create index if not exists idx_jobs_to_be_done_type
on public.jobs_to_be_done(segment_id, job_type);

-- order by opportunity score (biggest opportunities first)
create index if not exists idx_jobs_to_be_done_opportunity
on public.jobs_to_be_done(segment_id, opportunity_score desc);

-- find unvalidated high-priority jobs
create index if not exists idx_jobs_to_be_done_unvalidated
on public.jobs_to_be_done(segment_id, priority)
where is_validated = false;

-- =============================================================================
-- 5. TRIGGERS
-- =============================================================================

-- auto-update updated_at timestamp
create or replace function update_jobs_to_be_done_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_jobs_to_be_done_updated_at
before update on public.jobs_to_be_done
for each row execute function update_jobs_to_be_done_updated_at();

-- =============================================================================
-- 6. COMMENTS
-- =============================================================================

comment on table public.jobs_to_be_done is 'Jobs-to-be-Done framework: functional, emotional, and social jobs per segment';
comment on column public.jobs_to_be_done.job_type is 'functional=task, emotional=feeling, social=perception by others';
comment on column public.jobs_to_be_done.job_statement is 'Full JTBD format: When I [situation], I want to [motivation] so I can [outcome]';
comment on column public.jobs_to_be_done.opportunity_score is 'Calculated: importance - satisfaction. Higher = bigger opportunity';
comment on column public.jobs_to_be_done.related_functional_job_id is 'For emotional/social jobs, link to the related functional job';
