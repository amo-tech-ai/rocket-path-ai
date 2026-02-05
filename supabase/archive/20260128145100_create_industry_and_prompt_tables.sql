-- =============================================================================
-- Migration: Industry + Prompt Pack tables from scratch
-- Purpose: Single migration for industry_packs, industry_questions, prompt_packs,
--          prompt_pack_steps, prompt_runs, startup_memory, playbooks, playbook_steps
-- Dependencies: startups, auth.users, user_roles (from base schema)
-- =============================================================================

-- Extensions (vector for startup_memory embeddings)
create extension if not exists "uuid-ossp";
create extension if not exists vector;

-- =============================================================================
-- INDUSTRY SYSTEM
-- =============================================================================

create table public.industry_packs (
  id uuid primary key default gen_random_uuid(),
  industry text not null unique,
  display_name text,
  description text,
  icon text,
  advisor_persona text,
  advisor_system_prompt text,
  terminology jsonb default '[]',
  benchmarks jsonb default '[]',
  competitive_intel jsonb default '{}',
  mental_models jsonb default '[]',
  diagnostics jsonb default '[]',
  market_context jsonb default '{}',
  success_stories jsonb default '[]',
  common_mistakes jsonb default '[]',
  investor_expectations jsonb default '{}',
  startup_types jsonb default '[]',
  question_intro text,
  is_active boolean default true,
  version text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.industry_packs is 'Industry packs for Smart Interviewer: terminology, benchmarks, advisor persona, AI context.';

create table public.industry_questions (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.industry_packs(id) on delete cascade,
  question_key text not null,
  category text not null,
  display_order integer not null default 0,
  question text not null,
  why_this_matters text,
  thinking_prompt text,
  ai_coach_prompt text,
  quality_criteria jsonb default '{}',
  red_flags jsonb default '[]',
  examples jsonb default '[]',
  input_type text not null default 'textarea',
  input_options jsonb default null,
  outputs_to text[] default array[]::text[],
  contexts text[] default array['onboarding']::text[],
  stage_filter text[] default array['pre_seed', 'seed', 'series_a']::text[],
  is_required boolean default false,
  is_active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(pack_id, question_key)
);
comment on table public.industry_questions is 'Industry-specific questions for Smart Interviewer.';

create index idx_industry_questions_pack_id on public.industry_questions(pack_id);
create index idx_industry_questions_category on public.industry_questions(category);
create index idx_industry_questions_contexts on public.industry_questions using gin(contexts);
create index idx_industry_questions_stage_filter on public.industry_questions using gin(stage_filter);
create index idx_industry_questions_active on public.industry_questions(is_active) where is_active = true;

alter table public.industry_questions enable row level security;
create policy "Anyone can view active industry questions"
  on public.industry_questions for select to anon, authenticated using (is_active = true);
create policy "Authenticated users can manage industry questions"
  on public.industry_questions for all to authenticated using (true) with check (true);

create or replace function public.update_updated_at_column()
returns trigger as $$ begin new.updated_at = now(); return new; end; $$ language plpgsql;
drop trigger if exists update_industry_questions_updated_at on public.industry_questions;
create trigger update_industry_questions_updated_at
  before update on public.industry_questions for each row execute function public.update_updated_at_column();

insert into public.industry_packs (industry, display_name, description, is_active)
values ('generic', 'Generic', 'Universal questions for all industries', true)
on conflict (industry) do nothing;

create or replace function public.get_industry_questions(
  p_industry text,
  p_context text default 'onboarding',
  p_stage text default 'seed'
)
returns table (
  id uuid, question_key text, category text, question text, why_this_matters text,
  thinking_prompt text, ai_coach_prompt text, quality_criteria jsonb, red_flags jsonb,
  examples jsonb, input_type text, input_options jsonb, outputs_to text[],
  is_required boolean, display_order integer
) as $$
begin
  return query
  select iq.id, iq.question_key, iq.category, iq.question, iq.why_this_matters,
    iq.thinking_prompt, iq.ai_coach_prompt, iq.quality_criteria, iq.red_flags,
    iq.examples, iq.input_type, iq.input_options, iq.outputs_to, iq.is_required, iq.display_order
  from public.industry_questions iq
  join public.industry_packs ip on ip.id = iq.pack_id
  where ip.industry = p_industry and ip.is_active = true and iq.is_active = true
    and p_context = any(iq.contexts) and p_stage = any(iq.stage_filter)
  order by iq.display_order, iq.category;
end;
$$ language plpgsql stable security definer;

create or replace function public.get_industry_ai_context(p_industry text)
returns jsonb as $$
declare v_result jsonb;
begin
  select jsonb_build_object(
    'industry', ip.industry, 'display_name', ip.display_name, 'description', ip.description,
    'advisor_persona', ip.advisor_persona, 'advisor_system_prompt', ip.advisor_system_prompt,
    'terminology', coalesce(ip.terminology, '[]'::jsonb), 'benchmarks', coalesce(ip.benchmarks, '[]'::jsonb),
    'competitive_intel', coalesce(ip.competitive_intel, '{}'::jsonb), 'mental_models', coalesce(ip.mental_models, '[]'::jsonb),
    'diagnostics', coalesce(ip.diagnostics, '[]'::jsonb), 'market_context', coalesce(ip.market_context, '{}'::jsonb),
    'success_stories', coalesce(ip.success_stories, '[]'::jsonb), 'common_mistakes', coalesce(ip.common_mistakes, '[]'::jsonb),
    'investor_expectations', coalesce(ip.investor_expectations, '{}'::jsonb),
    'startup_types', coalesce(ip.startup_types, '[]'::jsonb), 'question_intro', ip.question_intro
  ) into v_result
  from public.industry_packs ip
  where ip.industry = p_industry and ip.is_active = true limit 1;
  return coalesce(v_result, '{}'::jsonb);
end;
$$ language plpgsql stable security definer;

-- =============================================================================
-- PROMPT PACK SYSTEM
-- =============================================================================

create table public.prompt_packs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  category text not null,
  stage_tags text[] default '{}',
  industry_tags text[] default '{}',
  use_case_tags text[] default '{}',
  version int default 1,
  parent_pack_id uuid references public.prompt_packs(id),
  is_active boolean default true,
  is_premium boolean default false,
  source text default 'custom',
  author_id uuid references auth.users(id),
  metadata jsonb default '{}',
  estimated_time_seconds int,
  trigger_intents text[] default '{}',
  auto_trigger_routes text[] default '{}',
  priority int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
comment on table public.prompt_packs is 'AI prompt pack definitions with industry/stage targeting';

create table public.prompt_pack_steps (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.prompt_packs(id) on delete cascade,
  step_order int not null,
  name text,
  purpose text not null,
  prompt_template text not null,
  input_schema jsonb default '{}',
  output_schema jsonb not null,
  model_preference text default 'gemini',
  max_tokens int default 2000,
  temperature float default 0.7,
  timeout_seconds int default 60,
  retry_count int default 2,
  fallback_model text,
  apply_to text[] default '{}',
  required_fields text[] default '{}',
  created_at timestamptz default now(),
  constraint prompt_pack_steps_unique_order unique(pack_id, step_order)
);
comment on table public.prompt_pack_steps is 'Individual steps within a prompt pack';

create table public.prompt_runs (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid references public.startups(id) on delete cascade,
  user_id uuid references auth.users(id),
  pack_id uuid references public.prompt_packs(id),
  step_id uuid references public.prompt_pack_steps(id),
  playbook_run_id uuid,
  inputs_json jsonb not null,
  outputs_json jsonb,
  interpolated_prompt text,
  model_used text,
  model_version text,
  tokens_input int,
  tokens_output int,
  cost_usd numeric(10, 6),
  latency_ms int,
  status text default 'pending',
  error_message text,
  error_code text,
  retry_count int default 0,
  output_valid boolean,
  validation_errors text[],
  applied_to text[],
  applied_at timestamptz,
  created_at timestamptz default now(),
  completed_at timestamptz
);
comment on table public.prompt_runs is 'Execution history for prompt packs';

create table public.startup_memory (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid references public.startups(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  content text not null,
  embedding vector(512),
  source text,
  category text,
  importance numeric(3, 2) default 0.5,
  expires_at timestamptz,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);
comment on table public.startup_memory is 'RAG-enabled memory storage for startup context';

create table public.playbooks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  category text not null,
  stage_tags text[] default '{}',
  industry_tags text[] default '{}',
  estimated_time_minutes int,
  difficulty_level text default 'beginner',
  is_active boolean default true,
  is_featured boolean default false,
  icon text,
  color text,
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
comment on table public.playbooks is 'Multi-step guided journeys';

create table public.playbook_steps (
  id uuid primary key default gen_random_uuid(),
  playbook_id uuid not null references public.playbooks(id) on delete cascade,
  step_order int not null,
  title text not null,
  description text,
  instructions text,
  pack_id uuid references public.prompt_packs(id),
  pack_step_id uuid references public.prompt_pack_steps(id),
  action_type text default 'pack',
  action_config jsonb default '{}',
  required_fields text[] default '{}',
  skip_if_complete boolean default true,
  completion_check jsonb,
  created_at timestamptz default now(),
  constraint playbook_steps_unique_order unique(playbook_id, step_order)
);
comment on table public.playbook_steps is 'Steps within a playbook';

create table public.startup_playbooks (
  startup_id uuid not null references public.startups(id) on delete cascade,
  playbook_id uuid not null references public.playbooks(id) on delete cascade,
  status text default 'suggested',
  progress int default 0,
  current_step int default 1,
  matched_at timestamptz default now(),
  started_at timestamptz,
  completed_at timestamptz,
  last_activity_at timestamptz default now(),
  match_reason text,
  match_confidence numeric(3, 2),
  recommended_by text,
  completed_steps int[] default '{}',
  skipped_steps int[] default '{}',
  notes text,
  primary key (startup_id, playbook_id)
);
comment on table public.startup_playbooks is 'Track playbook progress per startup';

create table public.pack_dependencies (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.prompt_packs(id) on delete cascade,
  depends_on_pack_id uuid references public.prompt_packs(id) on delete cascade,
  depends_on_data text[],
  is_required boolean default true,
  created_at timestamptz default now(),
  constraint pack_deps_unique unique(pack_id, depends_on_pack_id)
);
comment on table public.pack_dependencies is 'Prerequisites for running a pack';

-- Indexes
create index idx_prompt_packs_category on public.prompt_packs(category);
create index idx_prompt_packs_active on public.prompt_packs(is_active) where is_active = true;
create index idx_prompt_packs_slug on public.prompt_packs(slug);
create index idx_prompt_pack_steps_pack on public.prompt_pack_steps(pack_id);
create index idx_prompt_runs_startup on public.prompt_runs(startup_id);
create index idx_prompt_runs_pack on public.prompt_runs(pack_id);
create index idx_startup_memory_startup on public.startup_memory(startup_id);
create index idx_startup_memory_type on public.startup_memory(entity_type);
create index idx_playbooks_category on public.playbooks(category);
create index idx_playbook_steps_playbook on public.playbook_steps(playbook_id);

-- RLS
alter table public.prompt_packs enable row level security;
alter table public.prompt_pack_steps enable row level security;
alter table public.prompt_runs enable row level security;
alter table public.startup_memory enable row level security;
alter table public.playbooks enable row level security;
alter table public.playbook_steps enable row level security;
alter table public.startup_playbooks enable row level security;
alter table public.pack_dependencies enable row level security;

create policy "prompt_packs_select_active" on public.prompt_packs for select using (is_active = true or exists (select 1 from public.user_roles where user_id = auth.uid() and role in ('admin', 'moderator')));
create policy "prompt_packs_insert_admin" on public.prompt_packs for insert with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role in ('admin', 'moderator')));
create policy "prompt_packs_update_admin" on public.prompt_packs for update using (exists (select 1 from public.user_roles where user_id = auth.uid() and role in ('admin', 'moderator')));
create policy "prompt_packs_delete_admin" on public.prompt_packs for delete using (exists (select 1 from public.user_roles where user_id = auth.uid() and role in ('admin', 'moderator')));

create policy "prompt_pack_steps_select" on public.prompt_pack_steps for select using (exists (select 1 from public.prompt_packs where id = prompt_pack_steps.pack_id and is_active = true));
create policy "prompt_pack_steps_admin" on public.prompt_pack_steps for all using (exists (select 1 from public.user_roles where user_id = auth.uid() and role in ('admin', 'moderator')));

create policy "prompt_runs_select_org" on public.prompt_runs for select using (public.user_org_id() = (select org_id from public.startups where id = prompt_runs.startup_id));
create policy "prompt_runs_insert_org" on public.prompt_runs for insert with check (public.user_org_id() = (select org_id from public.startups where id = prompt_runs.startup_id));

create policy "startup_memory_select_org" on public.startup_memory for select using (public.user_org_id() = (select org_id from public.startups where id = startup_memory.startup_id));
create policy "startup_memory_insert_org" on public.startup_memory for insert with check (public.user_org_id() = (select org_id from public.startups where id = startup_memory.startup_id));
create policy "startup_memory_update_org" on public.startup_memory for update using (public.user_org_id() = (select org_id from public.startups where id = startup_memory.startup_id));
create policy "startup_memory_delete_org" on public.startup_memory for delete using (public.user_org_id() = (select org_id from public.startups where id = startup_memory.startup_id));

create policy "playbooks_select" on public.playbooks for select using (is_active = true);
create policy "playbooks_admin" on public.playbooks for all using (exists (select 1 from public.user_roles where user_id = auth.uid() and role in ('admin', 'moderator')));

create policy "playbook_steps_select" on public.playbook_steps for select using (exists (select 1 from public.playbooks where id = playbook_steps.playbook_id and is_active = true));
create policy "playbook_steps_admin" on public.playbook_steps for all using (exists (select 1 from public.user_roles where user_id = auth.uid() and role in ('admin', 'moderator')));

create policy "startup_playbooks_org" on public.startup_playbooks for all using (public.user_org_id() = (select org_id from public.startups where id = startup_playbooks.startup_id));

create policy "pack_dependencies_select" on public.pack_dependencies for select using (true);
create policy "pack_dependencies_admin" on public.pack_dependencies for all using (exists (select 1 from public.user_roles where user_id = auth.uid() and role in ('admin', 'moderator')));

-- Trigger for prompt_packs updated_at
drop trigger if exists prompt_packs_updated_at on public.prompt_packs;
create trigger prompt_packs_updated_at before update on public.prompt_packs for each row execute function public.update_updated_at_column();
