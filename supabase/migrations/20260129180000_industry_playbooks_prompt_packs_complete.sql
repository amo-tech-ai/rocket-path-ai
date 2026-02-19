-- ============================================================================
-- Migration: Industry Playbooks & Prompt Packs Complete Schema
-- ============================================================================
-- Purpose: Create the complete database schema for the Industry & Prompt Packs
--          system including tables, indexes, RLS policies, triggers, and functions
--
-- Tables created:
--   - industry_playbooks: Industry-specific knowledge (19 industries, 10 categories)
--   - prompt_packs: Workflow bundles (validation, pitch, GTM, etc.)
--   - prompt_pack_steps: Individual steps within packs
--   - prompt_pack_runs: Execution history tracking
--   - prompt_template_registry: Template definitions with playbook mappings
--   - feature_pack_routing: Auto-routing from features to packs
--   - context_injection_configs: Feature-to-category mapping
--
-- References:
--   - PRD: tasks/00-plan/prd-industry-prompt-playbooks.md
--   - Schema: tasks/00-plan/prompts/10-enriched-playbooks-schema.md
--   - Integration: tasks/00-plan/prompts/25-two-layer-integration.md
-- ============================================================================

-- ============================================================================
-- TYPES / ENUMS
-- ============================================================================

-- Feature context type for routing
do $$ begin
  create type public.feature_context as enum (
    'onboarding',
    'lean_canvas',
    'pitch_deck',
    'tasks',
    'chatbot',
    'validator',
    'gtm_planning',
    'fundraising'
  );
exception when duplicate_object then null;
end $$;
comment on type public.feature_context is 'Feature contexts for industry knowledge injection routing';

-- Funding stage type
do $$ begin
  create type public.funding_stage as enum (
    'pre_seed',
    'seed',
    'series_a',
    'series_b',
    'growth'
  );
exception when duplicate_object then null;
end $$;
comment on type public.funding_stage is 'Startup funding stages for stage-aware content filtering';

-- Pack category type
do $$ begin
  create type public.pack_category as enum (
    'validation',
    'ideation',
    'pitch',
    'canvas',
    'market',
    'gtm',
    'pricing',
    'planning',
    'fundraising'
  );
exception when duplicate_object then null;
end $$;
comment on type public.pack_category is 'Categories for prompt pack classification';

-- Warning sign severity
do $$ begin
  create type public.warning_severity as enum (
    'critical',
    'warning',
    'watch'
  );
exception when duplicate_object then null;
end $$;
comment on type public.warning_severity is 'Severity levels for startup warning signs';

-- ============================================================================
-- TABLE: industry_playbooks
-- ============================================================================
-- Primary table for industry-specific knowledge. Each playbook contains
-- 10 knowledge categories that get injected into AI prompts based on feature context.

create table if not exists public.industry_playbooks (
  -- Primary key
  id uuid primary key default gen_random_uuid(),

  -- Industry identification
  industry_id text not null unique,
  display_name text not null,

  -- Narrative and context
  narrative_arc text,
  prompt_context text,

  -- 10 Knowledge Categories (JSONB for flexibility)
  investor_expectations jsonb not null default '{}'::jsonb,
  failure_patterns jsonb not null default '[]'::jsonb,
  success_stories jsonb not null default '[]'::jsonb,
  benchmarks jsonb not null default '[]'::jsonb,
  terminology jsonb not null default '{}'::jsonb,
  gtm_patterns jsonb not null default '[]'::jsonb,
  decision_frameworks jsonb not null default '[]'::jsonb,
  investor_questions jsonb not null default '[]'::jsonb,
  warning_signs jsonb not null default '[]'::jsonb,
  stage_checklists jsonb not null default '[]'::jsonb,

  -- Pitch deck specific
  slide_emphasis jsonb default '[]'::jsonb,

  -- Metadata
  version integer not null default 1,
  is_active boolean not null default true,
  source text default 'system',

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.industry_playbooks is 'Industry-specific knowledge for AI agent expertise injection. Contains 10 knowledge categories per industry.';
comment on column public.industry_playbooks.industry_id is 'Unique identifier for the industry (e.g., fintech, healthcare, ai_saas)';
comment on column public.industry_playbooks.investor_expectations is 'What investors look for at each funding stage';
comment on column public.industry_playbooks.failure_patterns is 'Common mistakes and how to avoid them';
comment on column public.industry_playbooks.success_stories is 'Patterns that worked (anonymized examples)';
comment on column public.industry_playbooks.benchmarks is 'Industry KPIs with good/great thresholds';
comment on column public.industry_playbooks.terminology is 'Language to use and avoid with investor vocabulary';
comment on column public.industry_playbooks.gtm_patterns is 'Go-to-market strategies that work in this vertical';
comment on column public.industry_playbooks.decision_frameworks is 'If X then Y decision logic';
comment on column public.industry_playbooks.investor_questions is 'Exact questions with good/bad answer examples';
comment on column public.industry_playbooks.warning_signs is 'Signals with triggers and recommended actions';
comment on column public.industry_playbooks.stage_checklists is 'Tasks to complete before each funding raise';

-- Ensure columns exist when industry_playbooks was created by 20260129000000
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'industry_playbooks') then
    if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'industry_playbooks' and column_name = 'prompt_context') then
      alter table public.industry_playbooks add column prompt_context text;
    end if;
    if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'industry_playbooks' and column_name = 'source') then
      alter table public.industry_playbooks add column source text default 'system';
    end if;
  end if;
end $$;

-- ============================================================================
-- TABLE: prompt_packs
-- ============================================================================
-- Workflow bundles that combine multiple AI steps into reusable workflows.
-- Each pack is categorized and can be filtered by industry and stage.

create table if not exists public.prompt_packs (
  -- Primary key
  id text primary key,

  -- Pack identification
  title text not null,
  slug text not null unique,
  description text,

  -- Classification
  category text not null,
  stage_tags text[] default array[]::text[],
  industry_tags text[] default array['all']::text[],

  -- Metadata
  version integer not null default 1,
  is_active boolean not null default true,
  source text default 'system',
  metadata jsonb default '{}'::jsonb,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.prompt_packs is 'Workflow bundles combining multiple AI steps. Used by features like validation, pitch, GTM, etc.';
comment on column public.prompt_packs.category is 'Pack category: validation, ideation, pitch, canvas, market, gtm, pricing';
comment on column public.prompt_packs.stage_tags is 'Applicable funding stages (pre-seed, seed, series-a)';
comment on column public.prompt_packs.industry_tags is 'Applicable industries, or [all] for universal packs';

-- ============================================================================
-- TABLE: prompt_pack_steps
-- ============================================================================
-- Individual steps within a prompt pack. Each step has a prompt template,
-- input/output schemas, and model preferences.

create table if not exists public.prompt_pack_steps (
  -- Primary key
  id uuid primary key default gen_random_uuid(),

  -- Foreign key to pack
  pack_id text not null references public.prompt_packs(id) on delete cascade,

  -- Step identification
  step_order integer not null,
  purpose text not null,

  -- Prompt configuration
  prompt_template text not null,
  input_schema jsonb default '{}'::jsonb,
  output_schema jsonb default '{}'::jsonb,

  -- AI configuration
  model_preference text default 'gemini',
  max_tokens integer default 2000,
  temperature numeric(3,2) default 0.3,

  -- Tool configuration (optional)
  tools jsonb default '[]'::jsonb,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Unique constraint
  unique (pack_id, step_order)
);

comment on table public.prompt_pack_steps is 'Individual steps within a prompt pack. Executed sequentially with context passing.';
comment on column public.prompt_pack_steps.model_preference is 'Preferred AI model: gemini, claude, or any';
comment on column public.prompt_pack_steps.prompt_template is 'Prompt template with {{INDUSTRY_CONTEXT}} and other placeholders';

-- ============================================================================
-- TABLE: prompt_pack_runs
-- ============================================================================
-- Execution history for prompt pack runs. Tracks inputs, outputs, costs, and status.

create table if not exists public.prompt_pack_runs (
  -- Primary key
  id uuid primary key default gen_random_uuid(),

  -- Context
  user_id uuid references auth.users(id) on delete set null,
  org_id uuid references public.organizations(id) on delete set null,
  startup_id uuid references public.startups(id) on delete set null,

  -- Pack reference
  pack_id text references public.prompt_packs(id) on delete set null,
  pack_slug text,

  -- Execution details
  step_order integer,
  action text not null,

  -- Input/output
  inputs_json jsonb default '{}'::jsonb,
  outputs_json jsonb default '{}'::jsonb,

  -- AI details
  model text,
  input_tokens integer,
  output_tokens integer,
  cost_usd numeric(10,6),
  duration_ms integer,

  -- Status
  status text not null default 'pending',
  error_message text,

  -- Industry context
  industry_id text,
  stage text,
  feature_context text,

  -- Metadata
  metadata jsonb default '{}'::jsonb,

  -- Timestamps
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

comment on table public.prompt_pack_runs is 'Execution history for prompt pack runs. Tracks costs, tokens, and outputs for analytics.';

-- ============================================================================
-- TABLE: prompt_template_registry
-- ============================================================================
-- Registry of prompt templates with their playbook section mappings.

create table if not exists public.prompt_template_registry (
  -- Primary key
  id text primary key,

  -- Template identification
  name text not null,
  description text,

  -- Playbook integration
  playbook_sections text[] not null,

  -- AI configuration
  model_preference text default 'gemini',
  max_tokens integer default 2000,

  -- Timestamps
  created_at timestamptz not null default now()
);

comment on table public.prompt_template_registry is 'Maps prompt templates to playbook knowledge categories for context injection.';
comment on column public.prompt_template_registry.playbook_sections is 'Which playbook categories this template needs (e.g., failure_patterns, benchmarks)';

-- ============================================================================
-- TABLE: feature_pack_routing
-- ============================================================================
-- Routes feature contexts to default prompt packs. Enables automatic pack selection.

create table if not exists public.feature_pack_routing (
  -- Primary key
  id uuid primary key default gen_random_uuid(),

  -- Routing configuration
  feature_route text not null,
  intent text,
  default_pack_slug text not null,

  -- Override patterns
  industry_override_pattern text,
  stage_override_pattern text,

  -- Priority
  priority integer default 0,

  -- Timestamps
  created_at timestamptz not null default now()
);

comment on table public.feature_pack_routing is 'Auto-routing from feature routes to prompt packs. Enables agent-driven pack selection.';
comment on column public.feature_pack_routing.feature_route is 'Route pattern (e.g., /onboarding/*, /validator)';
comment on column public.feature_pack_routing.priority is 'Higher priority routes are matched first';

-- ============================================================================
-- TABLE: context_injection_configs
-- ============================================================================
-- Configuration for which playbook categories to inject for each feature context.

create table if not exists public.context_injection_configs (
  -- Primary key
  id uuid primary key default gen_random_uuid(),

  -- Feature context
  feature_context text not null unique,

  -- Categories to inject
  categories text[] not null,

  -- Metadata
  description text,
  is_active boolean default true,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.context_injection_configs is 'Maps feature contexts to playbook categories for context-filtered injection.';

-- ============================================================================
-- INDEXES
-- ============================================================================

-- industry_playbooks indexes
create index if not exists idx_industry_playbooks_industry_id
  on public.industry_playbooks(industry_id);
create index if not exists idx_industry_playbooks_active
  on public.industry_playbooks(is_active) where is_active = true;
create index if not exists idx_industry_playbooks_investor_expectations
  on public.industry_playbooks using gin(investor_expectations);
create index if not exists idx_industry_playbooks_benchmarks
  on public.industry_playbooks using gin(benchmarks);

-- prompt_packs indexes
create index if not exists idx_prompt_packs_slug
  on public.prompt_packs(slug);
create index if not exists idx_prompt_packs_category
  on public.prompt_packs(category);
create index if not exists idx_prompt_packs_active
  on public.prompt_packs(is_active) where is_active = true;
create index if not exists idx_prompt_packs_industry_tags
  on public.prompt_packs using gin(industry_tags);
create index if not exists idx_prompt_packs_stage_tags
  on public.prompt_packs using gin(stage_tags);

-- prompt_pack_steps indexes
create index if not exists idx_prompt_pack_steps_pack_id
  on public.prompt_pack_steps(pack_id);
create index if not exists idx_prompt_pack_steps_pack_order
  on public.prompt_pack_steps(pack_id, step_order);

-- prompt_pack_runs indexes
create index if not exists idx_prompt_pack_runs_user_id
  on public.prompt_pack_runs(user_id);
create index if not exists idx_prompt_pack_runs_startup_id
  on public.prompt_pack_runs(startup_id);
create index if not exists idx_prompt_pack_runs_pack_id
  on public.prompt_pack_runs(pack_id);
create index if not exists idx_prompt_pack_runs_created_at
  on public.prompt_pack_runs(created_at desc);
create index if not exists idx_prompt_pack_runs_status
  on public.prompt_pack_runs(status);

-- feature_pack_routing indexes
create index if not exists idx_feature_pack_routing_route
  on public.feature_pack_routing(feature_route);
create index if not exists idx_feature_pack_routing_priority
  on public.feature_pack_routing(priority desc);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
alter table public.industry_playbooks enable row level security;
alter table public.prompt_packs enable row level security;
alter table public.prompt_pack_steps enable row level security;
alter table public.prompt_pack_runs enable row level security;
alter table public.prompt_template_registry enable row level security;
alter table public.feature_pack_routing enable row level security;
alter table public.context_injection_configs enable row level security;

-- ============================================================================
-- RLS POLICIES: industry_playbooks (public read, admin write)
-- ============================================================================

-- Select: Anyone can read active playbooks
create policy "Anyone can view active industry playbooks"
  on public.industry_playbooks
  for select
  to anon, authenticated
  using (is_active = true);

-- Insert: Only admins can create playbooks
create policy "Admins can create industry playbooks"
  on public.industry_playbooks
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = (select auth.uid())
      and user_roles.role = 'admin'
    )
  );

-- Update: Only admins can update playbooks
create policy "Admins can update industry playbooks"
  on public.industry_playbooks
  for update
  to authenticated
  using (
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = (select auth.uid())
      and user_roles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = (select auth.uid())
      and user_roles.role = 'admin'
    )
  );

-- Delete: Only admins can delete playbooks
create policy "Admins can delete industry playbooks"
  on public.industry_playbooks
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = (select auth.uid())
      and user_roles.role = 'admin'
    )
  );

-- ============================================================================
-- RLS POLICIES: prompt_packs (public read, admin write)
-- ============================================================================

-- Select: Anyone can read active packs
create policy "Anyone can view active prompt packs"
  on public.prompt_packs
  for select
  to anon, authenticated
  using (is_active = true);

-- Insert: Only admins
create policy "Admins can create prompt packs"
  on public.prompt_packs
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = (select auth.uid())
      and user_roles.role = 'admin'
    )
  );

-- Update: Only admins
create policy "Admins can update prompt packs"
  on public.prompt_packs
  for update
  to authenticated
  using (
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = (select auth.uid())
      and user_roles.role = 'admin'
    )
  );

-- Delete: Only admins
create policy "Admins can delete prompt packs"
  on public.prompt_packs
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = (select auth.uid())
      and user_roles.role = 'admin'
    )
  );

-- ============================================================================
-- RLS POLICIES: prompt_pack_steps (public read, admin write)
-- ============================================================================

-- Select: Anyone can read steps of active packs
create policy "Anyone can view prompt pack steps"
  on public.prompt_pack_steps
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.prompt_packs
      where prompt_packs.id = prompt_pack_steps.pack_id
      and prompt_packs.is_active = true
    )
  );

-- Insert: Only admins
create policy "Admins can create prompt pack steps"
  on public.prompt_pack_steps
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = (select auth.uid())
      and user_roles.role = 'admin'
    )
  );

-- Update: Only admins
create policy "Admins can update prompt pack steps"
  on public.prompt_pack_steps
  for update
  to authenticated
  using (
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = (select auth.uid())
      and user_roles.role = 'admin'
    )
  );

-- Delete: Only admins
create policy "Admins can delete prompt pack steps"
  on public.prompt_pack_steps
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = (select auth.uid())
      and user_roles.role = 'admin'
    )
  );

-- ============================================================================
-- RLS POLICIES: prompt_pack_runs (user owns their runs)
-- ============================================================================

-- Select: Users can view their own runs
create policy "Users can view their own prompt pack runs"
  on public.prompt_pack_runs
  for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Insert: Authenticated users can create runs
create policy "Authenticated users can create prompt pack runs"
  on public.prompt_pack_runs
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

-- Update: Users can update their own runs
create policy "Users can update their own prompt pack runs"
  on public.prompt_pack_runs
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Service role bypass for edge functions
create policy "Service role can manage all prompt pack runs"
  on public.prompt_pack_runs
  for all
  to service_role
  using (true)
  with check (true);

-- ============================================================================
-- RLS POLICIES: prompt_template_registry (public read)
-- ============================================================================

create policy "Anyone can view prompt template registry"
  on public.prompt_template_registry
  for select
  to anon, authenticated
  using (true);

-- ============================================================================
-- RLS POLICIES: feature_pack_routing (public read)
-- ============================================================================

create policy "Anyone can view feature pack routing"
  on public.feature_pack_routing
  for select
  to anon, authenticated
  using (true);

-- ============================================================================
-- RLS POLICIES: context_injection_configs (public read)
-- ============================================================================

create policy "Anyone can view context injection configs"
  on public.context_injection_configs
  for select
  to anon, authenticated
  using (is_active = true);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger function for updated_at
create or replace function public.trigger_set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply updated_at trigger to relevant tables (drop prior trigger from 20260129000000 if present)
drop trigger if exists update_industry_playbooks_updated_at on public.industry_playbooks;
drop trigger if exists set_updated_at_industry_playbooks on public.industry_playbooks;
create trigger set_updated_at_industry_playbooks
  before update on public.industry_playbooks
  for each row execute function public.trigger_set_updated_at();

drop trigger if exists set_updated_at_prompt_packs on public.prompt_packs;
create trigger set_updated_at_prompt_packs
  before update on public.prompt_packs
  for each row execute function public.trigger_set_updated_at();

drop trigger if exists set_updated_at_prompt_pack_steps on public.prompt_pack_steps;
create trigger set_updated_at_prompt_pack_steps
  before update on public.prompt_pack_steps
  for each row execute function public.trigger_set_updated_at();

drop trigger if exists set_updated_at_context_injection_configs on public.context_injection_configs;
create trigger set_updated_at_context_injection_configs
  before update on public.context_injection_configs
  for each row execute function public.trigger_set_updated_at();

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function: Get industry playbook by ID
create or replace function public.get_industry_playbook(
  p_industry_id text
)
returns public.industry_playbooks
language sql
stable
security definer
set search_path = public
as $$
  select *
  from public.industry_playbooks
  where industry_id = lower(replace(p_industry_id, '-', '_'))
    and is_active = true
  limit 1;
$$;

comment on function public.get_industry_playbook is 'Get an active industry playbook by industry_id';

-- Function: Get filtered industry context for a feature
create or replace function public.get_filtered_industry_context(
  p_industry_id text,
  p_feature_context text,
  p_stage text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_playbook public.industry_playbooks;
  v_categories text[];
  v_result jsonb;
begin
  -- Get the playbook
  select * into v_playbook
  from public.industry_playbooks
  where industry_id = lower(replace(p_industry_id, '-', '_'))
    and is_active = true
  limit 1;

  if v_playbook is null then
    return null;
  end if;

  -- Get categories for this feature context
  select categories into v_categories
  from public.context_injection_configs
  where feature_context = p_feature_context
    and is_active = true
  limit 1;

  -- Default categories if not configured
  if v_categories is null then
    v_categories := array['failure_patterns', 'terminology'];
  end if;

  -- Build result JSON with only requested categories
  v_result := jsonb_build_object(
    'industry_id', v_playbook.industry_id,
    'display_name', v_playbook.display_name,
    'narrative_arc', v_playbook.narrative_arc
  );

  -- Add requested categories
  if 'investor_expectations' = any(v_categories) then
    v_result := v_result || jsonb_build_object('investor_expectations', v_playbook.investor_expectations);
  end if;
  if 'failure_patterns' = any(v_categories) then
    v_result := v_result || jsonb_build_object('failure_patterns', v_playbook.failure_patterns);
  end if;
  if 'success_stories' = any(v_categories) then
    v_result := v_result || jsonb_build_object('success_stories', v_playbook.success_stories);
  end if;
  if 'benchmarks' = any(v_categories) then
    v_result := v_result || jsonb_build_object('benchmarks', v_playbook.benchmarks);
  end if;
  if 'terminology' = any(v_categories) then
    v_result := v_result || jsonb_build_object('terminology', v_playbook.terminology);
  end if;
  if 'gtm_patterns' = any(v_categories) then
    v_result := v_result || jsonb_build_object('gtm_patterns', v_playbook.gtm_patterns);
  end if;
  if 'decision_frameworks' = any(v_categories) then
    v_result := v_result || jsonb_build_object('decision_frameworks', v_playbook.decision_frameworks);
  end if;
  if 'investor_questions' = any(v_categories) then
    v_result := v_result || jsonb_build_object('investor_questions', v_playbook.investor_questions);
  end if;
  if 'warning_signs' = any(v_categories) then
    v_result := v_result || jsonb_build_object('warning_signs', v_playbook.warning_signs);
  end if;
  if 'stage_checklists' = any(v_categories) then
    v_result := v_result || jsonb_build_object('stage_checklists', v_playbook.stage_checklists);
  end if;
  if 'slide_emphasis' = any(v_categories) then
    v_result := v_result || jsonb_build_object('slide_emphasis', v_playbook.slide_emphasis);
  end if;

  return v_result;
end;
$$;

comment on function public.get_filtered_industry_context is 'Get industry context filtered by feature context. Each feature gets only relevant knowledge categories.';

-- Function: Search for best pack
create or replace function public.search_prompt_pack(
  p_module text,
  p_industry text default null,
  p_stage text default null
)
returns table (
  pack_id text,
  pack_slug text,
  pack_title text,
  pack_category text,
  step_count bigint
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_pack_slug text;
begin
  -- First try feature_pack_routing
  select default_pack_slug into v_pack_slug
  from public.feature_pack_routing
  where feature_route ilike '%' || p_module || '%'
  order by priority desc
  limit 1;

  -- Return matching pack(s)
  return query
  select
    pp.id as pack_id,
    pp.slug as pack_slug,
    pp.title as pack_title,
    pp.category as pack_category,
    count(pps.id) as step_count
  from public.prompt_packs pp
  left join public.prompt_pack_steps pps on pp.id = pps.pack_id
  where pp.is_active = true
    and (
      (v_pack_slug is not null and pp.slug = v_pack_slug)
      or (v_pack_slug is null and pp.category = p_module)
    )
    and (p_industry is null or 'all' = any(pp.industry_tags) or p_industry = any(pp.industry_tags))
    and (p_stage is null or p_stage = any(pp.stage_tags) or array_length(pp.stage_tags, 1) is null)
  group by pp.id, pp.slug, pp.title, pp.category
  order by
    case when v_pack_slug is not null and pp.slug = v_pack_slug then 0 else 1 end,
    pp.created_at desc
  limit 5;
end;
$$;

comment on function public.search_prompt_pack is 'Search for the best matching prompt pack by module, industry, and stage';

-- Function: List all industries
create or replace function public.list_industries()
returns table (
  industry_id text,
  display_name text
)
language sql
stable
security definer
set search_path = public
as $$
  select industry_id, display_name
  from public.industry_playbooks
  where is_active = true
  order by display_name;
$$;

comment on function public.list_industries is 'List all active industries with their display names';

-- Function: Log prompt pack run
create or replace function public.log_prompt_pack_run(
  p_user_id uuid,
  p_pack_id text,
  p_action text,
  p_model text default null,
  p_input_tokens integer default null,
  p_output_tokens integer default null,
  p_duration_ms integer default null,
  p_status text default 'success',
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_run_id uuid;
begin
  insert into public.prompt_pack_runs (
    user_id,
    pack_id,
    action,
    model,
    input_tokens,
    output_tokens,
    duration_ms,
    status,
    metadata,
    completed_at
  )
  values (
    p_user_id,
    p_pack_id,
    p_action,
    p_model,
    p_input_tokens,
    p_output_tokens,
    p_duration_ms,
    p_status,
    p_metadata,
    case when p_status in ('success', 'error') then now() else null end
  )
  returning id into v_run_id;

  return v_run_id;
end;
$$;

comment on function public.log_prompt_pack_run is 'Log a prompt pack execution for analytics and cost tracking';

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View: Prompt packs with step count
create or replace view public.v_prompt_packs_summary as
select
  pp.id as pack_id,
  pp.title as pack_title,
  pp.slug as pack_slug,
  pp.category,
  pp.industry_tags,
  pp.stage_tags,
  pp.is_active,
  count(pps.id) as step_count,
  array_agg(pps.purpose order by pps.step_order) filter (where pps.id is not null) as step_purposes
from public.prompt_packs pp
left join public.prompt_pack_steps pps on pp.id = pps.pack_id
group by pp.id, pp.title, pp.slug, pp.category, pp.industry_tags, pp.stage_tags, pp.is_active
order by pp.title;

comment on view public.v_prompt_packs_summary is 'Summary view of prompt packs with step counts and purposes';

-- View: Industry playbooks summary
create or replace view public.v_industry_playbooks_summary as
select
  ip.industry_id,
  ip.display_name,
  ip.is_active,
  ip.version,
  jsonb_array_length(ip.failure_patterns) as failure_pattern_count,
  jsonb_array_length(ip.success_stories) as success_story_count,
  jsonb_array_length(ip.benchmarks) as benchmark_count,
  jsonb_array_length(ip.gtm_patterns) as gtm_pattern_count,
  jsonb_array_length(ip.investor_questions) as investor_question_count,
  jsonb_array_length(ip.warning_signs) as warning_sign_count,
  jsonb_array_length(ip.stage_checklists) as stage_checklist_count,
  ip.created_at,
  ip.updated_at
from public.industry_playbooks ip
order by ip.display_name;

comment on view public.v_industry_playbooks_summary is 'Summary view of industry playbooks with knowledge category counts';

-- ============================================================================
-- SEED: Context Injection Configs
-- ============================================================================

insert into public.context_injection_configs (feature_context, categories, description) values
  ('onboarding', array['failure_patterns', 'terminology'], 'Guide early decisions with warnings and industry language'),
  ('lean_canvas', array['gtm_patterns', 'benchmarks'], 'Validate business model with proven strategies and metrics'),
  ('pitch_deck', array['investor_expectations', 'success_stories', 'failure_patterns', 'investor_questions', 'warning_signs', 'slide_emphasis'], 'Make deck investor-ready with what VCs want to see'),
  ('tasks', array['gtm_patterns', 'failure_patterns', 'stage_checklists', 'decision_frameworks'], 'Build actionable roadmap avoiding known mistakes'),
  ('chatbot', array['investor_expectations', 'failure_patterns', 'success_stories', 'benchmarks', 'terminology', 'gtm_patterns', 'decision_frameworks', 'investor_questions', 'warning_signs', 'stage_checklists'], 'Full expert mode for open-ended Q&A'),
  ('validator', array['benchmarks', 'warning_signs', 'failure_patterns'], 'Score idea against industry standards and common pitfalls'),
  ('gtm_planning', array['gtm_patterns', 'failure_patterns', 'decision_frameworks'], 'GTM strategy formulation with decision frameworks'),
  ('fundraising', array['investor_expectations', 'investor_questions', 'stage_checklists', 'warning_signs'], 'Fundraising preparation and readiness assessment')
on conflict (feature_context) do update set
  categories = excluded.categories,
  description = excluded.description;

-- ============================================================================
-- GRANTS (for service role)
-- ============================================================================

grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on all tables in schema public to postgres, service_role;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on public.prompt_pack_runs to authenticated;
