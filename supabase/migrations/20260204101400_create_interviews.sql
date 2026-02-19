-- =============================================================================
-- Migration: 20260202100600_create_interviews.sql
-- Description: Create interviews table for customer discovery interviews
-- Affected Tables: interviews
-- Dependencies: startups, customer_segments
-- =============================================================================

-- =============================================================================
-- 1. ENUMS
-- =============================================================================

-- interview status tracks the workflow
do $$ begin
  create type interview_status as enum (
    'scheduled',
    'completed',
    'transcribed',
    'analyzed',
    'cancelled',
    'no_show'
  );
exception
  when duplicate_object then null;
end $$;

-- interview type categorizes the purpose
do $$ begin
  create type interview_type as enum (
    'problem_discovery',
    'solution_validation',
    'usability_test',
    'customer_development',
    'sales_call',
    'support_call',
    'other'
  );
exception
  when duplicate_object then null;
end $$;

-- =============================================================================
-- 2. TABLE: interviews
-- =============================================================================

-- interviews table stores customer discovery interviews and their transcripts
create table if not exists public.interviews (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  startup_id uuid not null references public.startups(id) on delete cascade,
  segment_id uuid references public.customer_segments(id) on delete set null,
  experiment_id uuid references public.experiments(id) on delete set null,

  -- interview details
  interview_type interview_type not null default 'problem_discovery',
  status interview_status not null default 'scheduled',

  -- interviewee info (anonymized or real)
  interviewee_name text,
  interviewee_role text,
  interviewee_company text,
  interviewee_email text,
  is_anonymous boolean default false,

  -- scheduling
  scheduled_at timestamptz,
  conducted_at timestamptz,
  duration_minutes integer,

  -- content
  transcript text,
  raw_notes text,
  summary text,

  -- recording (optional)
  recording_url text,
  recording_consent boolean default false,

  -- structure
  questions_used jsonb default '[]'::jsonb, -- questions asked
  interview_guide_id uuid, -- link to interview guide template

  -- ai analysis
  ai_analyzed boolean default false,
  ai_analyzed_at timestamptz,
  ai_summary text,
  ai_sentiment text check (ai_sentiment in ('positive', 'negative', 'neutral', 'mixed')),
  ai_key_quotes jsonb default '[]'::jsonb,

  -- metadata
  conducted_by uuid references auth.users(id),
  location text, -- "zoom", "in-person", "phone"
  notes text,

  -- timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================================================
-- 3. ROW LEVEL SECURITY
-- =============================================================================

alter table public.interviews enable row level security;

-- select: authenticated users can view interviews for their org's startups
create policy "interviews_select_authenticated"
on public.interviews for select
to authenticated
using (
  startup_id in (
    select s.id from public.startups s
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- insert: authenticated users can create interviews for their org's startups
create policy "interviews_insert_authenticated"
on public.interviews for insert
to authenticated
with check (
  startup_id in (
    select s.id from public.startups s
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- update: authenticated users can update interviews for their org's startups
create policy "interviews_update_authenticated"
on public.interviews for update
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

-- delete: authenticated users can delete interviews for their org's startups
create policy "interviews_delete_authenticated"
on public.interviews for delete
to authenticated
using (
  startup_id in (
    select s.id from public.startups s
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- service role: full access for ai agents
create policy "interviews_service_role"
on public.interviews for all
to service_role
using (true)
with check (true);

-- =============================================================================
-- 4. INDEXES
-- =============================================================================

-- lookup by startup
create index if not exists idx_interviews_startup_id
on public.interviews(startup_id);

-- filter by segment
create index if not exists idx_interviews_segment_id
on public.interviews(segment_id);

-- filter by experiment
create index if not exists idx_interviews_experiment_id
on public.interviews(experiment_id);

-- filter by status
create index if not exists idx_interviews_status
on public.interviews(startup_id, status);

-- filter by type
create index if not exists idx_interviews_type
on public.interviews(startup_id, interview_type);

-- find unanalyzed interviews
create index if not exists idx_interviews_unanalyzed
on public.interviews(startup_id, conducted_at)
where status = 'completed' and ai_analyzed = false;

-- chronological listing
create index if not exists idx_interviews_conducted_at
on public.interviews(startup_id, conducted_at desc);

-- =============================================================================
-- 5. TRIGGERS
-- =============================================================================

-- auto-update updated_at timestamp
create or replace function update_interviews_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_interviews_updated_at
before update on public.interviews
for each row execute function update_interviews_updated_at();

-- update segment interview count when interview is completed
create or replace function update_segment_interview_count()
returns trigger as $$
begin
  -- when interview is completed and has a segment
  if new.status = 'completed' and old.status != 'completed' and new.segment_id is not null then
    update public.customer_segments
    set interview_count = interview_count + 1, updated_at = now()
    where id = new.segment_id;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger trigger_update_segment_interview_count
after update on public.interviews
for each row execute function update_segment_interview_count();

-- =============================================================================
-- 6. COMMENTS
-- =============================================================================

comment on table public.interviews is 'Customer discovery interviews with transcripts and AI analysis';
comment on column public.interviews.transcript is 'Full interview transcript (manual or auto-transcribed)';
comment on column public.interviews.ai_key_quotes is 'JSON array of notable quotes extracted by AI';
comment on column public.interviews.questions_used is 'JSON array of questions asked during the interview';
