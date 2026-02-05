-- =============================================================================
-- Migration: 20260202100200_create_experiment_results.sql
-- Description: Create experiment_results table for storing individual data points
-- Affected Tables: experiment_results
-- Dependencies: experiments
-- =============================================================================

-- =============================================================================
-- 1. TABLE: experiment_results
-- =============================================================================

-- experiment_results stores individual data points collected during experiments
-- this could be interview responses, survey answers, test metrics, etc.
create table if not exists public.experiment_results (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  experiment_id uuid not null references public.experiments(id) on delete cascade,

  -- result identification
  participant_id text, -- anonymous identifier for the participant
  result_type text not null check (result_type in (
    'interview_response',
    'survey_response',
    'conversion_event',
    'signup_event',
    'engagement_metric',
    'feedback',
    'observation',
    'other'
  )),

  -- data
  data jsonb not null default '{}'::jsonb,
  raw_notes text,
  summary text,

  -- scoring/classification
  supports_hypothesis boolean, -- true = supports, false = refutes, null = neutral
  sentiment text check (sentiment in ('positive', 'negative', 'neutral', 'mixed')),
  confidence numeric(3,2) check (confidence >= 0 and confidence <= 1),

  -- ai analysis
  ai_analyzed boolean default false,
  ai_insights jsonb default '[]'::jsonb,

  -- metadata
  source text, -- where this data came from
  recorded_at timestamptz default now(),
  recorded_by uuid references auth.users(id),

  -- timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================================================
-- 2. ROW LEVEL SECURITY
-- =============================================================================

alter table public.experiment_results enable row level security;

-- select: authenticated users can view results for their org's experiments
create policy "experiment_results_select_authenticated"
on public.experiment_results for select
to authenticated
using (
  experiment_id in (
    select e.id from public.experiments e
    inner join public.assumptions a on a.id = e.assumption_id
    inner join public.startups s on s.id = a.startup_id
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- insert: authenticated users can create results for their org's experiments
create policy "experiment_results_insert_authenticated"
on public.experiment_results for insert
to authenticated
with check (
  experiment_id in (
    select e.id from public.experiments e
    inner join public.assumptions a on a.id = e.assumption_id
    inner join public.startups s on s.id = a.startup_id
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- update: authenticated users can update results for their org's experiments
create policy "experiment_results_update_authenticated"
on public.experiment_results for update
to authenticated
using (
  experiment_id in (
    select e.id from public.experiments e
    inner join public.assumptions a on a.id = e.assumption_id
    inner join public.startups s on s.id = a.startup_id
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
)
with check (
  experiment_id in (
    select e.id from public.experiments e
    inner join public.assumptions a on a.id = e.assumption_id
    inner join public.startups s on s.id = a.startup_id
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- delete: authenticated users can delete results for their org's experiments
create policy "experiment_results_delete_authenticated"
on public.experiment_results for delete
to authenticated
using (
  experiment_id in (
    select e.id from public.experiments e
    inner join public.assumptions a on a.id = e.assumption_id
    inner join public.startups s on s.id = a.startup_id
    inner join public.org_members om on om.org_id = s.org_id
    where om.user_id = auth.uid()
  )
);

-- service role: full access for ai agents
create policy "experiment_results_service_role"
on public.experiment_results for all
to service_role
using (true)
with check (true);

-- =============================================================================
-- 3. INDEXES
-- =============================================================================

-- lookup by experiment
create index if not exists idx_experiment_results_experiment_id
on public.experiment_results(experiment_id);

-- filter by type
create index if not exists idx_experiment_results_type
on public.experiment_results(experiment_id, result_type);

-- filter by hypothesis support
create index if not exists idx_experiment_results_hypothesis
on public.experiment_results(experiment_id, supports_hypothesis)
where supports_hypothesis is not null;

-- jsonb search on data
create index if not exists idx_experiment_results_data
on public.experiment_results using gin(data);

-- =============================================================================
-- 4. TRIGGERS
-- =============================================================================

-- auto-update updated_at timestamp
create or replace function update_experiment_results_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_experiment_results_updated_at
before update on public.experiment_results
for each row execute function update_experiment_results_updated_at();

-- update experiment sample size when result is added/removed
create or replace function sync_experiment_sample_size()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update public.experiments
    set actual_sample_size = actual_sample_size + 1, updated_at = now()
    where id = new.experiment_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.experiments
    set actual_sample_size = greatest(0, actual_sample_size - 1), updated_at = now()
    where id = old.experiment_id;
    return old;
  end if;
  return null;
end;
$$ language plpgsql;

create trigger trigger_sync_experiment_sample_size
after insert or delete on public.experiment_results
for each row execute function sync_experiment_sample_size();

-- =============================================================================
-- 5. COMMENTS
-- =============================================================================

comment on table public.experiment_results is 'Individual data points collected during experiments';
comment on column public.experiment_results.supports_hypothesis is 'Whether this data point supports (true) or refutes (false) the hypothesis';
comment on column public.experiment_results.data is 'Structured data specific to the result type (interview answers, metrics, etc.)';
