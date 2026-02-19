-- =============================================================================
-- migration: 20260204102100_create_validation_assessments.sql
-- purpose: create validation_assessments table for 7-dimension scoring
-- affected tables: validation_assessments
-- dependencies: validation_sessions
-- =============================================================================

-- =============================================================================
-- 1. table: validation_assessments
-- =============================================================================

-- validation_assessments tracks scores across 7 dimensions over time
-- each assessment captures a single dimension score with evidence
create table if not exists public.validation_assessments (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  session_id uuid not null references public.validation_sessions(id) on delete cascade,

  -- dimension scoring
  dimension text not null check (dimension in (
    'clarity',
    'desirability',
    'viability',
    'feasibility',
    'defensibility',
    'timing',
    'mission'
  )),
  score integer not null check (score >= 0 and score <= 10),

  -- evidence and feedback
  feedback text,
  evidence jsonb default '[]'::jsonb, -- array of evidence items
  questions_asked jsonb default '[]'::jsonb, -- questions that led to this score
  answers_received jsonb default '[]'::jsonb, -- founder's answers

  -- metadata
  assessed_by text default 'coach', -- 'coach' or 'self'
  confidence text default 'medium' check (confidence in ('low', 'medium', 'high')),

  -- timestamps
  assessed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- add table comment
comment on table public.validation_assessments is 'Tracks 7-dimension validation scores over time for coach assessments.';
comment on column public.validation_assessments.dimension is 'One of 7 dimensions: clarity, desirability, viability, feasibility, defensibility, timing, mission.';
comment on column public.validation_assessments.score is 'Score from 0-10 for this dimension.';
comment on column public.validation_assessments.evidence is 'JSONB array of evidence items supporting the score.';

-- =============================================================================
-- 2. indexes
-- =============================================================================

-- fk index on session_id
create index if not exists idx_validation_assessments_session_id
  on public.validation_assessments(session_id);

-- find latest assessment per dimension
create index if not exists idx_validation_assessments_session_dimension
  on public.validation_assessments(session_id, dimension, assessed_at desc);

-- analytics: scores by dimension
create index if not exists idx_validation_assessments_dimension_score
  on public.validation_assessments(dimension, score);

-- time-based queries
create index if not exists idx_validation_assessments_assessed_at
  on public.validation_assessments(assessed_at desc);

-- =============================================================================
-- 3. row level security
-- =============================================================================

alter table public.validation_assessments enable row level security;

-- select: authenticated users can view assessments for their sessions
create policy "authenticated users can view validation assessments"
  on public.validation_assessments
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

-- insert: authenticated users can create assessments for their sessions
create policy "authenticated users can create validation assessments"
  on public.validation_assessments
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

-- update: authenticated users can update assessments for their sessions
create policy "authenticated users can update validation assessments"
  on public.validation_assessments
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

-- delete: authenticated users can delete assessments for their sessions
create policy "authenticated users can delete validation assessments"
  on public.validation_assessments
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
create policy "service role has full access to validation assessments"
  on public.validation_assessments
  for all
  to service_role
  using (true)
  with check (true);

-- =============================================================================
-- 4. helper function: get latest scores for session
-- =============================================================================

create or replace function public.get_validation_scores(p_session_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    jsonb_object_agg(dimension, score),
    '{}'::jsonb
  )
  from (
    select distinct on (dimension)
      dimension,
      score
    from public.validation_assessments
    where session_id = p_session_id
    order by dimension, assessed_at desc
  ) latest_scores;
$$;

comment on function public.get_validation_scores(uuid) is 'Returns the latest score for each dimension as a JSONB object.';

-- =============================================================================
-- end of migration: 20260204102100_create_validation_assessments.sql
-- =============================================================================
