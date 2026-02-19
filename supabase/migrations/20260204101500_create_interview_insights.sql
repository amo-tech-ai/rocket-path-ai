-- =============================================================================
-- Migration: 20260202100700_create_interview_insights.sql
-- Description: Create interview_insights table for AI-extracted insights
-- Affected Tables: interview_insights
-- Dependencies: interviews, assumptions
-- =============================================================================

-- =============================================================================
-- 1. ENUMS
-- =============================================================================

-- insight type categorizes what kind of insight this is
do $$ begin
  create type insight_type as enum (
    'pain_point',
    'desired_outcome',
    'current_behavior',
    'switching_trigger',
    'objection',
    'feature_request',
    'competitor_mention',
    'pricing_feedback',
    'aha_moment',
    'job_to_be_done',
    'quote',
    'other'
  );
exception
  when duplicate_object then null;
end $$;

-- =============================================================================
-- 2. TABLE: interview_insights
-- =============================================================================

-- interview_insights stores AI-extracted insights from interview transcripts
-- these are linked back to assumptions for validation
create table if not exists public.interview_insights (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  interview_id uuid not null references public.interviews(id) on delete cascade,

  -- insight content
  insight_type insight_type not null,
  insight text not null,

  -- source quote (the exact words from the interview)
  source_quote text,
  quote_timestamp text, -- "12:34" timestamp in the interview

  -- scoring
  confidence numeric(3,2) not null default 0.5 check (confidence >= 0 and confidence <= 1),
  importance integer default 5 check (importance >= 1 and importance <= 10),

  -- sentiment
  sentiment text check (sentiment in ('positive', 'negative', 'neutral', 'mixed')),

  -- linked assumptions (this insight supports/refutes these assumptions)
  linked_assumption_ids uuid[] default '{}',

  -- does this insight support or refute linked assumptions?
  supports_assumptions boolean, -- true=supports, false=refutes, null=unclear

  -- categorization
  tags text[] default '{}',

  -- ai metadata
  ai_model text,
  extraction_prompt_version text,

  -- user validation
  is_validated boolean default false,
  validated_by uuid references auth.users(id),
  validated_at timestamptz,
  is_dismissed boolean default false, -- user marked as not relevant

  -- timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================================================
-- 3. ROW LEVEL SECURITY
-- =============================================================================

alter table public.interview_insights enable row level security;

-- select: authenticated users can view insights for their org's interviews
create policy "interview_insights_select_authenticated"
on public.interview_insights for select
to authenticated
using (
  interview_id in (
    select i.id from public.interviews i
    inner join public.startups s on s.id = i.startup_id
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- insert: authenticated users can create insights for their org's interviews
create policy "interview_insights_insert_authenticated"
on public.interview_insights for insert
to authenticated
with check (
  interview_id in (
    select i.id from public.interviews i
    inner join public.startups s on s.id = i.startup_id
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- update: authenticated users can update insights for their org's interviews
create policy "interview_insights_update_authenticated"
on public.interview_insights for update
to authenticated
using (
  interview_id in (
    select i.id from public.interviews i
    inner join public.startups s on s.id = i.startup_id
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
)
with check (
  interview_id in (
    select i.id from public.interviews i
    inner join public.startups s on s.id = i.startup_id
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- delete: authenticated users can delete insights for their org's interviews
create policy "interview_insights_delete_authenticated"
on public.interview_insights for delete
to authenticated
using (
  interview_id in (
    select i.id from public.interviews i
    inner join public.startups s on s.id = i.startup_id
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- service role: full access for ai agents
create policy "interview_insights_service_role"
on public.interview_insights for all
to service_role
using (true)
with check (true);

-- =============================================================================
-- 4. INDEXES
-- =============================================================================

-- lookup by interview
create index if not exists idx_interview_insights_interview_id
on public.interview_insights(interview_id);

-- filter by type
create index if not exists idx_interview_insights_type
on public.interview_insights(interview_id, insight_type);

-- filter by confidence (find high-confidence insights)
create index if not exists idx_interview_insights_confidence
on public.interview_insights(interview_id, confidence desc);

-- find unvalidated insights
create index if not exists idx_interview_insights_unvalidated
on public.interview_insights(interview_id, importance desc)
where is_validated = false and is_dismissed = false;

-- search linked assumptions (GIN index for array)
create index if not exists idx_interview_insights_linked_assumptions
on public.interview_insights using gin(linked_assumption_ids);

-- tag search
create index if not exists idx_interview_insights_tags
on public.interview_insights using gin(tags);

-- =============================================================================
-- 5. TRIGGERS
-- =============================================================================

-- auto-update updated_at timestamp
create or replace function update_interview_insights_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_interview_insights_updated_at
before update on public.interview_insights
for each row execute function update_interview_insights_updated_at();

-- =============================================================================
-- 6. COMMENTS
-- =============================================================================

comment on table public.interview_insights is 'AI-extracted insights from customer interviews, linked to assumptions';
comment on column public.interview_insights.source_quote is 'Exact quote from the interview that supports this insight';
comment on column public.interview_insights.linked_assumption_ids is 'Array of assumption IDs this insight supports/refutes';
comment on column public.interview_insights.supports_assumptions is 'true=supports linked assumptions, false=refutes them';

-- =============================================================================
-- 7. HELPER VIEW: assumption_evidence
-- =============================================================================

-- this view aggregates all interview insights for each assumption
create or replace view public.assumption_evidence as
select
  a.id as assumption_id,
  a.startup_id,
  a.statement as assumption_statement,
  a.status as assumption_status,
  count(ii.id) as total_insights,
  count(ii.id) filter (where ii.supports_assumptions = true) as supporting_insights,
  count(ii.id) filter (where ii.supports_assumptions = false) as refuting_insights,
  count(ii.id) filter (where ii.supports_assumptions is null) as neutral_insights,
  avg(ii.confidence) as avg_confidence,
  array_agg(distinct ii.interview_id) filter (where ii.id is not null) as interview_ids
from public.assumptions a
left join public.interview_insights ii on a.id = any(ii.linked_assumption_ids)
group by a.id, a.startup_id, a.statement, a.status;

comment on view public.assumption_evidence is 'Aggregated evidence from interviews for each assumption';
