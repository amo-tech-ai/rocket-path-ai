-- =============================================================================
-- Migration: Create Validator Schema
-- Purpose: Additional tables for the idea validator module including competitor
--          profiles, market sizing, framework analyses, and condition tracking
-- Affected tables: validation_scores, competitor_profiles, market_sizes,
--                  framework_analyses, generated_ideas, critic_reviews,
--                  validation_conditions, validation_metadata
-- Author: StartupAI
-- Created: 2026-01-29
-- =============================================================================

-- =============================================================================
-- TABLE: validation_scores
-- Purpose: Historical score breakdown for tracking changes over time
-- =============================================================================
create table if not exists public.validation_scores (
  id uuid primary key default gen_random_uuid(),
  validation_report_id uuid not null references public.validation_reports(id) on delete cascade,
  startup_id uuid references public.startups(id) on delete cascade,

  -- 6-dimension scores (0-100)
  problem_score numeric(5, 2),
  market_score numeric(5, 2),
  competition_score numeric(5, 2),
  solution_score numeric(5, 2),
  business_score numeric(5, 2),
  execution_score numeric(5, 2),

  -- composite scores
  base_score numeric(5, 2),
  risk_adjustment numeric(5, 2) default 0,
  blue_ocean_bonus numeric(5, 2) default 0,
  final_score numeric(5, 2),

  -- score weights used
  weights jsonb default '{"problem": 0.20, "market": 0.20, "competition": 0.15, "solution": 0.20, "business": 0.15, "execution": 0.10}',

  -- version tracking
  version int default 1,

  -- metadata
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.validation_scores is 'Historical score breakdown for validation reports with dimension-level tracking';
comment on column public.validation_scores.base_score is 'Weighted average of 6 dimension scores before adjustments';
comment on column public.validation_scores.final_score is 'Final score after risk adjustment and blue ocean bonus';

-- =============================================================================
-- TABLE: competitor_profiles
-- Purpose: Cache competitor data discovered during validation
-- =============================================================================
create table if not exists public.competitor_profiles (
  id uuid primary key default gen_random_uuid(),
  validation_report_id uuid references public.validation_reports(id) on delete set null,
  startup_id uuid references public.startups(id) on delete cascade,

  -- basic info
  name text not null,
  website text,
  description text,

  -- classification
  competitor_type text check (competitor_type in ('direct', 'indirect', 'potential', 'alternative')),
  threat_level text check (threat_level in ('high', 'medium', 'low')),

  -- funding & traction
  funding_stage text,
  funding_amount numeric,
  funding_currency text default 'USD',
  employee_count text,

  -- market position
  market_share numeric(5, 2),
  strengths text[],
  weaknesses text[],

  -- pricing
  pricing_model text,
  pricing_range text,

  -- discovery source
  source text, -- google_search, crunchbase, manual
  source_url text,

  -- metadata
  industry text,
  region text,
  discovered_at timestamptz default now(),
  last_updated_at timestamptz default now(),
  raw_data jsonb default '{}',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.competitor_profiles is 'Competitor data discovered during validation for market analysis';
comment on column public.competitor_profiles.threat_level is 'Assessed threat level: high, medium, low';
comment on column public.competitor_profiles.competitor_type is 'Competitor classification: direct, indirect, potential, alternative';

-- =============================================================================
-- TABLE: market_sizes
-- Purpose: Store TAM/SAM/SOM calculations
-- =============================================================================
create table if not exists public.market_sizes (
  id uuid primary key default gen_random_uuid(),
  validation_report_id uuid references public.validation_reports(id) on delete set null,
  startup_id uuid references public.startups(id) on delete cascade,

  -- market definition
  industry text not null,
  segment text,
  region text default 'global',

  -- TAM (Total Addressable Market)
  tam_value numeric,
  tam_currency text default 'USD',
  tam_unit text default 'billion',
  tam_year int,
  tam_source text,
  tam_methodology text,

  -- SAM (Serviceable Addressable Market)
  sam_value numeric,
  sam_percentage numeric(5, 2), -- percentage of TAM
  sam_rationale text,

  -- SOM (Serviceable Obtainable Market)
  som_value numeric,
  som_percentage numeric(5, 2), -- percentage of SAM
  som_rationale text,
  som_timeline text, -- 1 year, 3 years, 5 years

  -- market dynamics
  growth_rate numeric(5, 2), -- CAGR
  growth_drivers text[],
  market_trends text[],

  -- confidence
  confidence_level text check (confidence_level in ('high', 'medium', 'low')),
  data_quality text check (data_quality in ('verified', 'estimated', 'projected')),

  -- sources
  sources jsonb default '[]',

  -- metadata
  calculated_at timestamptz default now(),
  expires_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.market_sizes is 'TAM/SAM/SOM market sizing calculations for validation reports';
comment on column public.market_sizes.tam_methodology is 'Methodology used: top-down, bottom-up, value-theory';

-- =============================================================================
-- TABLE: framework_analyses
-- Purpose: Store strategic framework analysis results (SWOT, PESTEL, Porter)
-- =============================================================================
create table if not exists public.framework_analyses (
  id uuid primary key default gen_random_uuid(),
  validation_report_id uuid references public.validation_reports(id) on delete set null,
  startup_id uuid references public.startups(id) on delete cascade,

  -- framework type
  framework_type text not null check (framework_type in (
    'swot', 'pestel', 'porter', 'jobs_to_be_done', 'value_proposition_canvas',
    'business_model_canvas', 'lean_canvas', 'competitive_matrix'
  )),

  -- analysis data (structure varies by framework)
  analysis_data jsonb not null,

  -- summary
  key_insights text[],
  recommendations text[],

  -- scoring (optional)
  framework_score numeric(5, 2),

  -- context
  industry text,
  stage text,

  -- metadata
  model_used text,
  tokens_used int,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.framework_analyses is 'Strategic framework analysis results (SWOT, PESTEL, Porter, etc.)';
comment on column public.framework_analyses.analysis_data is 'Framework-specific JSON structure with analysis results';

-- =============================================================================
-- TABLE: generated_ideas
-- Purpose: Store AI-generated startup ideas
-- =============================================================================
create table if not exists public.generated_ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),

  -- generation context
  background_input jsonb not null, -- user background, skills, interests
  generation_type text default 'standard' check (generation_type in (
    'standard', 'background_based', 'trend_based', 'problem_first', 'technology_first'
  )),

  -- idea details
  title text not null,
  one_liner text,
  description text,
  problem_statement text,
  solution_description text,

  -- classification
  industry text,
  business_model text[],
  target_market text,

  -- pre-validation score
  pre_validation_score numeric(5, 2),
  score_rationale text,

  -- ranking among batch
  batch_id uuid,
  rank_in_batch int,
  comparison_notes text,

  -- status
  status text default 'generated' check (status in (
    'generated', 'saved', 'validated', 'developing', 'archived'
  )),

  -- linked validation
  validation_report_id uuid references public.validation_reports(id),

  -- metadata
  model_used text,
  generation_prompt text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.generated_ideas is 'AI-generated startup ideas based on user background and preferences';
comment on column public.generated_ideas.background_input is 'User context: skills, experience, interests, constraints';
comment on column public.generated_ideas.pre_validation_score is 'Initial score before full validation (0-100)';

-- =============================================================================
-- TABLE: critic_reviews
-- Purpose: Store critic agent analysis results
-- =============================================================================
create table if not exists public.critic_reviews (
  id uuid primary key default gen_random_uuid(),
  validation_report_id uuid not null references public.validation_reports(id) on delete cascade,
  startup_id uuid references public.startups(id) on delete cascade,

  -- assumptions analysis
  assumptions jsonb default '[]', -- array of {assumption, validity, evidence}
  elephant_in_room text,

  -- risk matrix
  risks jsonb default '[]', -- array of {category, description, probability, impact, score, mitigation}
  total_risk_score numeric(5, 2),
  risk_level text check (risk_level in ('critical', 'high', 'moderate', 'low')),

  -- score adjustment
  risk_deduction numeric(5, 2) default 0,
  adjusted_score numeric(5, 2),

  -- investor preparation
  investor_questions jsonb default '[]', -- array of {question, category, good_answer, red_flags}

  -- counter arguments
  counter_arguments jsonb default '[]',

  -- top risks summary
  top_3_risks jsonb default '[]',

  -- metadata
  model_used text,
  tokens_used int,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.critic_reviews is 'Devil advocate analysis challenging startup assumptions and identifying risks';
comment on column public.critic_reviews.risk_deduction is 'Points deducted from score based on risks (-0.5 to -10)';

-- =============================================================================
-- TABLE: validation_conditions
-- Purpose: Track Go/No-Go conditions and their completion
-- =============================================================================
create table if not exists public.validation_conditions (
  id uuid primary key default gen_random_uuid(),
  validation_report_id uuid not null references public.validation_reports(id) on delete cascade,
  startup_id uuid references public.startups(id) on delete cascade,

  -- condition details
  title text not null,
  description text,
  category text check (category in (
    'market', 'product', 'team', 'financial', 'technical', 'competitive', 'regulatory'
  )),

  -- SMART criteria
  current_state text,
  required_outcome text,
  evidence_needed text,
  deadline timestamptz,

  -- impact
  priority text default 'medium' check (priority in ('critical', 'high', 'medium', 'low')),
  expected_point_improvement numeric(5, 2),

  -- status
  status text default 'pending' check (status in ('pending', 'in_progress', 'completed', 'blocked', 'waived')),
  completion_evidence text,
  completed_at timestamptz,

  -- linked task (auto-generated; optional, null when task deleted)
  task_id uuid references public.tasks(id) on delete set null,

  -- ordering
  display_order int default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.validation_conditions is 'SMART conditions for Go/No-Go verdicts with completion tracking';
comment on column public.validation_conditions.expected_point_improvement is 'Expected score improvement when condition is met';

-- =============================================================================
-- TABLE: validation_metadata
-- Purpose: Store reliability/cache data for validation operations
-- =============================================================================
create table if not exists public.validation_metadata (
  id uuid primary key default gen_random_uuid(),
  validation_report_id uuid references public.validation_reports(id) on delete cascade,

  -- cache info
  cache_key text unique,
  cache_data jsonb,
  cache_hit boolean default false,

  -- timing
  total_duration_ms int,
  step_durations jsonb default '{}', -- {step: duration_ms}

  -- reliability
  retry_count int default 0,
  fallback_used boolean default false,
  fallback_reason text,

  -- model info
  models_used jsonb default '[]', -- array of {step, model, tokens, cost}
  total_tokens int,
  total_cost_usd numeric(10, 6),

  -- data sources
  external_apis_called jsonb default '[]', -- google, crunchbase, etc.
  api_errors jsonb default '[]',

  -- quality
  data_completeness numeric(3, 2), -- 0.00 to 1.00
  confidence_factors jsonb default '{}',

  -- expires
  expires_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.validation_metadata is 'Reliability tracking and caching metadata for validation operations';
comment on column public.validation_metadata.data_completeness is 'Percentage of required data successfully retrieved (0-1)';

-- =============================================================================
-- INDEXES: Performance optimization
-- =============================================================================

-- validation_scores indexes
create index if not exists idx_validation_scores_report on public.validation_scores(validation_report_id);
create index if not exists idx_validation_scores_startup on public.validation_scores(startup_id);
create index if not exists idx_validation_scores_final on public.validation_scores(final_score desc);

-- competitor_profiles indexes
create index if not exists idx_competitor_profiles_validation on public.competitor_profiles(validation_report_id);
create index if not exists idx_competitor_profiles_startup on public.competitor_profiles(startup_id);
create index if not exists idx_competitor_profiles_industry on public.competitor_profiles(industry);
create index if not exists idx_competitor_profiles_threat on public.competitor_profiles(threat_level);

-- market_sizes indexes
create index if not exists idx_market_sizes_validation on public.market_sizes(validation_report_id);
create index if not exists idx_market_sizes_startup on public.market_sizes(startup_id);
create index if not exists idx_market_sizes_industry on public.market_sizes(industry);

-- framework_analyses indexes
create index if not exists idx_framework_analyses_validation on public.framework_analyses(validation_report_id);
create index if not exists idx_framework_analyses_startup on public.framework_analyses(startup_id);
create index if not exists idx_framework_analyses_type on public.framework_analyses(framework_type);

-- generated_ideas indexes
create index if not exists idx_generated_ideas_user on public.generated_ideas(user_id);
create index if not exists idx_generated_ideas_batch on public.generated_ideas(batch_id);
create index if not exists idx_generated_ideas_status on public.generated_ideas(status);
create index if not exists idx_generated_ideas_score on public.generated_ideas(pre_validation_score desc);

-- critic_reviews indexes
create index if not exists idx_critic_reviews_validation on public.critic_reviews(validation_report_id);
create index if not exists idx_critic_reviews_startup on public.critic_reviews(startup_id);
create index if not exists idx_critic_reviews_risk_level on public.critic_reviews(risk_level);

-- validation_conditions indexes
create index if not exists idx_validation_conditions_validation on public.validation_conditions(validation_report_id);
create index if not exists idx_validation_conditions_startup on public.validation_conditions(startup_id);
create index if not exists idx_validation_conditions_status on public.validation_conditions(status);
create index if not exists idx_validation_conditions_priority on public.validation_conditions(priority);

-- validation_metadata indexes
create index if not exists idx_validation_metadata_validation on public.validation_metadata(validation_report_id);
create index if not exists idx_validation_metadata_cache_key on public.validation_metadata(cache_key);

-- =============================================================================
-- ROW LEVEL SECURITY: Enable RLS on all tables
-- =============================================================================
alter table public.validation_scores enable row level security;
alter table public.competitor_profiles enable row level security;
alter table public.market_sizes enable row level security;
alter table public.framework_analyses enable row level security;
alter table public.generated_ideas enable row level security;
alter table public.critic_reviews enable row level security;
alter table public.validation_conditions enable row level security;
alter table public.validation_metadata enable row level security;

-- =============================================================================
-- RLS POLICIES: validation_scores
-- =============================================================================

-- select: users can view scores for their validations
create policy "validation_scores_select_own"
  on public.validation_scores for select
  using (
    validation_report_id in (
      select id from public.validation_reports where user_id = auth.uid()
    )
  );

-- insert: users can create scores for their validations
create policy "validation_scores_insert_own"
  on public.validation_scores for insert
  with check (
    validation_report_id in (
      select id from public.validation_reports where user_id = auth.uid()
    )
  );

-- =============================================================================
-- RLS POLICIES: competitor_profiles
-- =============================================================================

-- select: users can view competitors for their org's startups
create policy "competitor_profiles_select_org"
  on public.competitor_profiles for select
  using (
    startup_id in (
      select s.id from public.startups s
      join public.profiles p on s.org_id = p.org_id
      where p.id = auth.uid()
    )
    or validation_report_id in (
      select id from public.validation_reports where user_id = auth.uid()
    )
  );

-- insert: users can create competitors for their validations
create policy "competitor_profiles_insert_org"
  on public.competitor_profiles for insert
  with check (
    startup_id in (
      select s.id from public.startups s
      join public.profiles p on s.org_id = p.org_id
      where p.id = auth.uid()
    )
    or validation_report_id in (
      select id from public.validation_reports where user_id = auth.uid()
    )
  );

-- update: users can update competitors they created
create policy "competitor_profiles_update_org"
  on public.competitor_profiles for update
  using (
    startup_id in (
      select s.id from public.startups s
      join public.profiles p on s.org_id = p.org_id
      where p.id = auth.uid()
    )
  );

-- =============================================================================
-- RLS POLICIES: market_sizes
-- =============================================================================

-- select: users can view market data for their validations/startups
create policy "market_sizes_select_own"
  on public.market_sizes for select
  using (
    startup_id in (
      select s.id from public.startups s
      join public.profiles p on s.org_id = p.org_id
      where p.id = auth.uid()
    )
    or validation_report_id in (
      select id from public.validation_reports where user_id = auth.uid()
    )
  );

-- insert: users can create market data
create policy "market_sizes_insert_own"
  on public.market_sizes for insert
  with check (
    startup_id in (
      select s.id from public.startups s
      join public.profiles p on s.org_id = p.org_id
      where p.id = auth.uid()
    )
    or validation_report_id in (
      select id from public.validation_reports where user_id = auth.uid()
    )
  );

-- =============================================================================
-- RLS POLICIES: framework_analyses
-- =============================================================================

-- select: users can view analyses for their validations/startups
create policy "framework_analyses_select_own"
  on public.framework_analyses for select
  using (
    startup_id in (
      select s.id from public.startups s
      join public.profiles p on s.org_id = p.org_id
      where p.id = auth.uid()
    )
    or validation_report_id in (
      select id from public.validation_reports where user_id = auth.uid()
    )
  );

-- insert: users can create analyses
create policy "framework_analyses_insert_own"
  on public.framework_analyses for insert
  with check (
    startup_id in (
      select s.id from public.startups s
      join public.profiles p on s.org_id = p.org_id
      where p.id = auth.uid()
    )
    or validation_report_id in (
      select id from public.validation_reports where user_id = auth.uid()
    )
  );

-- =============================================================================
-- RLS POLICIES: generated_ideas
-- =============================================================================

-- select: users can only view their own generated ideas
create policy "generated_ideas_select_own"
  on public.generated_ideas for select
  using (user_id = auth.uid());

-- insert: users can create ideas for themselves
create policy "generated_ideas_insert_own"
  on public.generated_ideas for insert
  with check (user_id = auth.uid());

-- update: users can update their own ideas
create policy "generated_ideas_update_own"
  on public.generated_ideas for update
  using (user_id = auth.uid());

-- delete: users can delete their own ideas
create policy "generated_ideas_delete_own"
  on public.generated_ideas for delete
  using (user_id = auth.uid());

-- =============================================================================
-- RLS POLICIES: critic_reviews
-- =============================================================================

-- select: users can view critic reviews for their validations
create policy "critic_reviews_select_own"
  on public.critic_reviews for select
  using (
    validation_report_id in (
      select id from public.validation_reports where user_id = auth.uid()
    )
  );

-- insert: users can create critic reviews for their validations
create policy "critic_reviews_insert_own"
  on public.critic_reviews for insert
  with check (
    validation_report_id in (
      select id from public.validation_reports where user_id = auth.uid()
    )
  );

-- =============================================================================
-- RLS POLICIES: validation_conditions
-- =============================================================================

-- select: users can view conditions for their validations
create policy "validation_conditions_select_own"
  on public.validation_conditions for select
  using (
    validation_report_id in (
      select id from public.validation_reports where user_id = auth.uid()
    )
  );

-- insert: users can create conditions for their validations
create policy "validation_conditions_insert_own"
  on public.validation_conditions for insert
  with check (
    validation_report_id in (
      select id from public.validation_reports where user_id = auth.uid()
    )
  );

-- update: users can update their conditions
create policy "validation_conditions_update_own"
  on public.validation_conditions for update
  using (
    validation_report_id in (
      select id from public.validation_reports where user_id = auth.uid()
    )
  );

-- =============================================================================
-- RLS POLICIES: validation_metadata
-- =============================================================================

-- select: users can view metadata for their validations
create policy "validation_metadata_select_own"
  on public.validation_metadata for select
  using (
    validation_report_id in (
      select id from public.validation_reports where user_id = auth.uid()
    )
  );

-- insert: users can create metadata for their validations
create policy "validation_metadata_insert_own"
  on public.validation_metadata for insert
  with check (
    validation_report_id in (
      select id from public.validation_reports where user_id = auth.uid()
    )
  );

-- =============================================================================
-- TRIGGERS: Auto-update timestamps
-- =============================================================================

-- validation_scores
drop trigger if exists validation_scores_updated_at on public.validation_scores;
create trigger validation_scores_updated_at
  before update on public.validation_scores
  for each row execute function update_updated_at_column();

-- competitor_profiles
drop trigger if exists competitor_profiles_updated_at on public.competitor_profiles;
create trigger competitor_profiles_updated_at
  before update on public.competitor_profiles
  for each row execute function update_updated_at_column();

-- market_sizes
drop trigger if exists market_sizes_updated_at on public.market_sizes;
create trigger market_sizes_updated_at
  before update on public.market_sizes
  for each row execute function update_updated_at_column();

-- framework_analyses
drop trigger if exists framework_analyses_updated_at on public.framework_analyses;
create trigger framework_analyses_updated_at
  before update on public.framework_analyses
  for each row execute function update_updated_at_column();

-- generated_ideas
drop trigger if exists generated_ideas_updated_at on public.generated_ideas;
create trigger generated_ideas_updated_at
  before update on public.generated_ideas
  for each row execute function update_updated_at_column();

-- critic_reviews
drop trigger if exists critic_reviews_updated_at on public.critic_reviews;
create trigger critic_reviews_updated_at
  before update on public.critic_reviews
  for each row execute function update_updated_at_column();

-- validation_conditions
drop trigger if exists validation_conditions_updated_at on public.validation_conditions;
create trigger validation_conditions_updated_at
  before update on public.validation_conditions
  for each row execute function update_updated_at_column();

-- validation_metadata
drop trigger if exists validation_metadata_updated_at on public.validation_metadata;
create trigger validation_metadata_updated_at
  before update on public.validation_metadata
  for each row execute function update_updated_at_column();

-- =============================================================================
-- FUNCTIONS: Helper functions for validator operations
-- =============================================================================

-- function to calculate weighted validation score
create or replace function calculate_validation_score(
  p_problem numeric,
  p_market numeric,
  p_competition numeric,
  p_solution numeric,
  p_business numeric,
  p_execution numeric,
  p_weights jsonb default '{"problem": 0.20, "market": 0.20, "competition": 0.15, "solution": 0.20, "business": 0.15, "execution": 0.10}'
)
returns numeric
language plpgsql stable
as $$
declare
  v_base_score numeric;
begin
  v_base_score := (
    coalesce(p_problem, 0) * coalesce((p_weights->>'problem')::numeric, 0.20) +
    coalesce(p_market, 0) * coalesce((p_weights->>'market')::numeric, 0.20) +
    coalesce(p_competition, 0) * coalesce((p_weights->>'competition')::numeric, 0.15) +
    coalesce(p_solution, 0) * coalesce((p_weights->>'solution')::numeric, 0.20) +
    coalesce(p_business, 0) * coalesce((p_weights->>'business')::numeric, 0.15) +
    coalesce(p_execution, 0) * coalesce((p_weights->>'execution')::numeric, 0.10)
  );

  return round(v_base_score, 2);
end;
$$;

comment on function calculate_validation_score is 'Calculate weighted validation score from 6 dimensions';

-- function to determine verdict from score
create or replace function get_validation_verdict(p_score numeric)
returns text
language plpgsql stable
as $$
begin
  if p_score >= 80 then
    return 'go';
  elsif p_score >= 60 then
    return 'conditional';
  elsif p_score >= 40 then
    return 'needs_work';
  else
    return 'pivot';
  end if;
end;
$$;

comment on function get_validation_verdict is 'Determine Go/No-Go verdict from validation score';

-- function to get pending conditions for a validation
create or replace function get_pending_conditions(p_validation_report_id uuid)
returns table (
  id uuid,
  title text,
  category text,
  priority text,
  expected_point_improvement numeric
)
language sql stable
security definer
set search_path = ''
as $$
  select
    vc.id,
    vc.title,
    vc.category,
    vc.priority,
    vc.expected_point_improvement
  from public.validation_conditions vc
  where vc.validation_report_id = get_pending_conditions.p_validation_report_id
    and vc.status in ('pending', 'in_progress')
  order by
    case vc.priority
      when 'critical' then 1
      when 'high' then 2
      when 'medium' then 3
      when 'low' then 4
    end,
    vc.display_order;
$$;

comment on function get_pending_conditions is 'Get pending conditions for a validation report, ordered by priority';

-- function to get competitor summary
create or replace function get_competitor_summary(p_validation_report_id uuid)
returns table (
  total_count bigint,
  direct_count bigint,
  indirect_count bigint,
  high_threat_count bigint,
  avg_funding numeric
)
language sql stable
security definer
set search_path = ''
as $$
  select
    count(*)::bigint as total_count,
    count(*) filter (where cp.competitor_type = 'direct')::bigint as direct_count,
    count(*) filter (where cp.competitor_type = 'indirect')::bigint as indirect_count,
    count(*) filter (where cp.threat_level = 'high')::bigint as high_threat_count,
    avg(cp.funding_amount) as avg_funding
  from public.competitor_profiles cp
  where cp.validation_report_id = get_competitor_summary.p_validation_report_id;
$$;

comment on function get_competitor_summary is 'Get competitor summary statistics for a validation report';

-- =============================================================================
-- GRANTS: Function permissions
-- =============================================================================
grant execute on function calculate_validation_score(numeric, numeric, numeric, numeric, numeric, numeric, jsonb) to authenticated;
grant execute on function get_validation_verdict(numeric) to authenticated;
grant execute on function get_pending_conditions(uuid) to authenticated;
grant execute on function get_competitor_summary(uuid) to authenticated;

-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
