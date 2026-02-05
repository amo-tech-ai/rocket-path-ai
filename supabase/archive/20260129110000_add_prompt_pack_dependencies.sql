-- ============================================================================
-- Migration: Add Prompt Pack Dependencies
-- Description: Creates missing tables and columns required by prompt-pack-apply
--              and adds readiness tracking columns to startups table
-- Author: StartupAI
-- Created: 2026-01-29
--
-- Tables Created:
--   - lean_canvases: Lean Canvas methodology storage
--   - validation_reports: Idea validation reports with scoring
--
-- Columns Added:
--   - startups: readiness_score, readiness_rationale, validation_verdict,
--               readiness_updated_at, problem_statement, solution_description
--
-- Dependencies:
--   - startups table
--   - auth.users (Supabase Auth)
-- ============================================================================

-- ============================================================================
-- ALTER TABLE: startups - Add readiness and validation columns
-- ============================================================================

-- Add readiness tracking columns
alter table startups add column if not exists readiness_score numeric(5, 2);
alter table startups add column if not exists readiness_rationale text;
alter table startups add column if not exists validation_verdict text;
alter table startups add column if not exists readiness_updated_at timestamptz;

-- Add problem/solution columns for detailed tracking
alter table startups add column if not exists problem_statement text;
alter table startups add column if not exists solution_description text;

-- Add comments
comment on column startups.readiness_score is 'Overall investor/launch readiness score (0-100)';
comment on column startups.readiness_rationale is 'AI-generated rationale for readiness score';
comment on column startups.validation_verdict is 'Validation verdict: go, conditional, pivot, no-go';
comment on column startups.readiness_updated_at is 'Last time readiness was calculated';
comment on column startups.problem_statement is 'Problem the startup is solving (for validation)';
comment on column startups.solution_description is 'Solution description (for validation)';

-- ============================================================================
-- TABLE: lean_canvases
-- Purpose: Store Lean Canvas methodology data for startups
-- ============================================================================
create table if not exists lean_canvases (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid not null references startups(id) on delete cascade,

  -- Lean Canvas 9 blocks
  problem text,
  customer_segments text,
  unique_value_proposition text,
  solution text,
  channels text,
  revenue_streams text,
  cost_structure text,
  key_metrics text,
  unfair_advantage text,

  -- Additional fields
  validation_score numeric(5, 2),
  version int default 1,
  is_current boolean default true,

  -- Metadata
  source text default 'manual', -- manual, ai, imported
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add comments
comment on table lean_canvases is 'Lean Canvas methodology storage for startup validation';
comment on column lean_canvases.problem is 'Top 3 problems to solve';
comment on column lean_canvases.customer_segments is 'Target customers and early adopters';
comment on column lean_canvases.unique_value_proposition is 'Single clear compelling message';
comment on column lean_canvases.solution is 'Top 3 features/solutions';
comment on column lean_canvases.channels is 'Path to customers';
comment on column lean_canvases.revenue_streams is 'Revenue model and pricing';
comment on column lean_canvases.cost_structure is 'Customer acquisition costs, distribution, hosting, people';
comment on column lean_canvases.key_metrics is 'Key activities to measure';
comment on column lean_canvases.unfair_advantage is 'Something that cannot be easily copied';
comment on column lean_canvases.validation_score is 'AI-generated canvas validation score';
comment on column lean_canvases.is_current is 'Whether this is the current active canvas version';

-- ============================================================================
-- TABLE: validation_reports
-- Purpose: Store startup validation reports with detailed scoring
-- ============================================================================
create table if not exists validation_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  startup_id uuid references startups(id) on delete cascade,

  -- Input data
  idea_description text,
  input_data jsonb default '{}',

  -- Scoring dimensions (0-100)
  overall_score numeric(5, 2),
  problem_score numeric(5, 2),
  market_score numeric(5, 2),
  competition_score numeric(5, 2),
  solution_score numeric(5, 2),
  business_score numeric(5, 2),
  execution_score numeric(5, 2),

  -- Blue Ocean score
  blue_ocean_score numeric(5, 2),

  -- Risk adjustment
  risk_adjustment numeric(5, 2) default 0,

  -- Verdict and confidence
  verdict text check (verdict in ('go', 'conditional', 'pivot', 'no-go')),
  confidence numeric(3, 2), -- 0.00 to 1.00

  -- Conditions (for conditional verdict)
  conditions jsonb default '[]',

  -- Full report data
  report_data jsonb,

  -- Metadata
  validation_type text default 'standard', -- standard, quick, deep, prompt_pack
  model_used text,
  tokens_used int,
  cost_usd numeric(10, 6),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add comments
comment on table validation_reports is 'Startup idea validation reports with multi-dimensional scoring';
comment on column validation_reports.overall_score is 'Overall validation score (0-100)';
comment on column validation_reports.problem_score is 'Problem clarity and severity score';
comment on column validation_reports.market_score is 'Market size and growth potential score';
comment on column validation_reports.competition_score is 'Competitive landscape and differentiation score';
comment on column validation_reports.solution_score is 'Solution fit and feasibility score';
comment on column validation_reports.business_score is 'Business model viability score';
comment on column validation_reports.execution_score is 'Team and execution capability score';
comment on column validation_reports.blue_ocean_score is 'Blue Ocean strategy score (market creation potential)';
comment on column validation_reports.verdict is 'Validation verdict: go, conditional, pivot, no-go';
comment on column validation_reports.conditions is 'Array of conditions/milestones for conditional verdict';

-- ============================================================================
-- INDEXES: Performance optimization
-- ============================================================================

-- lean_canvases indexes
create index if not exists idx_lean_canvases_startup on lean_canvases(startup_id);
create index if not exists idx_lean_canvases_current on lean_canvases(startup_id, is_current) where is_current = true;
create index if not exists idx_lean_canvases_created on lean_canvases(created_at desc);

-- validation_reports indexes
create index if not exists idx_validation_reports_startup on validation_reports(startup_id);
create index if not exists idx_validation_reports_user on validation_reports(user_id);
create index if not exists idx_validation_reports_verdict on validation_reports(verdict);
create index if not exists idx_validation_reports_score on validation_reports(overall_score desc);
create index if not exists idx_validation_reports_created on validation_reports(created_at desc);

-- startups readiness index
create index if not exists idx_startups_readiness on startups(readiness_score desc) where readiness_score is not null;

-- ============================================================================
-- ROW LEVEL SECURITY: Enable RLS on new tables
-- ============================================================================
alter table lean_canvases enable row level security;
alter table validation_reports enable row level security;

-- ============================================================================
-- RLS POLICIES: lean_canvases
-- ============================================================================

-- SELECT: Users can view canvases for their organization's startups
create policy "lean_canvases_select_org"
  on lean_canvases for select
  using (
    startup_id in (
      select s.id from startups s
      join profiles p on s.org_id = p.org_id
      where p.id = auth.uid()
    )
  );

-- INSERT: Users can create canvases for their organization's startups
create policy "lean_canvases_insert_org"
  on lean_canvases for insert
  with check (
    startup_id in (
      select s.id from startups s
      join profiles p on s.org_id = p.org_id
      where p.id = auth.uid()
    )
  );

-- UPDATE: Users can update canvases for their organization's startups
create policy "lean_canvases_update_org"
  on lean_canvases for update
  using (
    startup_id in (
      select s.id from startups s
      join profiles p on s.org_id = p.org_id
      where p.id = auth.uid()
    )
  );

-- DELETE: Users can delete canvases for their organization's startups
create policy "lean_canvases_delete_org"
  on lean_canvases for delete
  using (
    startup_id in (
      select s.id from startups s
      join profiles p on s.org_id = p.org_id
      where p.id = auth.uid()
    )
  );

-- ============================================================================
-- RLS POLICIES: validation_reports
-- ============================================================================

-- SELECT: Users can view their own reports or reports for their org's startups
create policy "validation_reports_select_own_or_org"
  on validation_reports for select
  using (
    user_id = auth.uid()
    or startup_id in (
      select s.id from startups s
      join profiles p on s.org_id = p.org_id
      where p.id = auth.uid()
    )
  );

-- INSERT: Users can create reports (for themselves or their org's startups)
create policy "validation_reports_insert_own"
  on validation_reports for insert
  with check (
    user_id = auth.uid()
    or startup_id in (
      select s.id from startups s
      join profiles p on s.org_id = p.org_id
      where p.id = auth.uid()
    )
  );

-- UPDATE: Users can update their own reports
create policy "validation_reports_update_own"
  on validation_reports for update
  using (user_id = auth.uid());

-- DELETE: Users can delete their own reports
create policy "validation_reports_delete_own"
  on validation_reports for delete
  using (user_id = auth.uid());

-- ============================================================================
-- TRIGGERS: Auto-update timestamps
-- ============================================================================

-- lean_canvases updated_at trigger
drop trigger if exists lean_canvases_updated_at on lean_canvases;
create trigger lean_canvases_updated_at
  before update on lean_canvases
  for each row execute function update_updated_at_column();

-- validation_reports updated_at trigger
drop trigger if exists validation_reports_updated_at on validation_reports;
create trigger validation_reports_updated_at
  before update on validation_reports
  for each row execute function update_updated_at_column();

-- ============================================================================
-- FUNCTIONS: Helper functions
-- ============================================================================

-- Function to get the latest canvas for a startup
create or replace function get_current_canvas(p_startup_id uuid)
returns table (
  id uuid,
  problem text,
  customer_segments text,
  unique_value_proposition text,
  solution text,
  channels text,
  revenue_streams text,
  cost_structure text,
  key_metrics text,
  unfair_advantage text,
  validation_score numeric
)
language sql stable
security definer
as $$
  select
    id,
    problem,
    customer_segments,
    unique_value_proposition,
    solution,
    channels,
    revenue_streams,
    cost_structure,
    key_metrics,
    unfair_advantage,
    validation_score
  from lean_canvases
  where startup_id = p_startup_id
    and is_current = true
  order by created_at desc
  limit 1;
$$;

comment on function get_current_canvas is 'Get the current active Lean Canvas for a startup';

-- Function to get validation history for a startup
create or replace function get_validation_history(
  p_startup_id uuid,
  p_limit int default 10
)
returns table (
  id uuid,
  overall_score numeric,
  verdict text,
  created_at timestamptz
)
language sql stable
security definer
as $$
  select
    id,
    overall_score,
    verdict,
    created_at
  from validation_reports
  where startup_id = p_startup_id
  order by created_at desc
  limit p_limit;
$$;

comment on function get_validation_history is 'Get validation report history for a startup';

-- ============================================================================
-- GRANTS: Function permissions
-- ============================================================================
grant execute on function get_current_canvas(uuid) to authenticated;
grant execute on function get_validation_history(uuid, int) to authenticated;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
