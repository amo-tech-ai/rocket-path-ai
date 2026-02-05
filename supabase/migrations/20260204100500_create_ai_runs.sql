-- =============================================================================
-- migration: 20260204100500_create_ai_runs.sql
-- purpose: create ai_runs table for tracking AI agent executions
-- affected tables: ai_runs
-- dependencies: startups, profiles
-- =============================================================================

-- =============================================================================
-- 1. table: ai_runs
-- =============================================================================

-- ai_runs tracks individual AI agent executions for monitoring and debugging
-- stores input, output, metrics, and any errors
create table if not exists public.ai_runs (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  startup_id uuid references public.startups(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  session_id uuid references public.chat_sessions(id) on delete set null,

  -- agent identification
  agent_type text not null, -- 'lean-canvas', 'validation', 'pitch-deck', 'crm', 'onboarding', etc.
  action text not null, -- 'generate', 'analyze', 'suggest', 'extract', etc.

  -- ai model details
  model text not null, -- 'gemini-3-flash-preview', 'gemini-3-pro-preview', 'claude-sonnet-4-5', etc.
  provider text not null default 'gemini', -- 'gemini', 'anthropic', 'openai'

  -- input/output
  input_data jsonb not null default '{}'::jsonb,
  output_data jsonb,

  -- execution status
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed', 'cancelled')),
  error_message text,
  error_code text,

  -- metrics
  tokens_input integer,
  tokens_output integer,
  tokens_total integer,
  latency_ms integer,
  cost_cents numeric(10, 4), -- cost in cents for tracking

  -- timing
  started_at timestamptz,
  completed_at timestamptz,

  -- metadata
  metadata jsonb default '{}'::jsonb, -- additional context, feature flags, etc.

  -- timestamps
  created_at timestamptz not null default now()
);

-- add table comment
comment on table public.ai_runs is 'Tracks AI agent executions for monitoring, debugging, and cost analysis.';
comment on column public.ai_runs.agent_type is 'Type of AI agent: lean-canvas, validation, pitch-deck, crm, onboarding, etc.';
comment on column public.ai_runs.action is 'Action performed: generate, analyze, suggest, extract, etc.';
comment on column public.ai_runs.cost_cents is 'Estimated cost in cents for tracking AI spend.';

-- =============================================================================
-- 2. indexes
-- =============================================================================

-- fk indexes
create index if not exists idx_ai_runs_startup_id
  on public.ai_runs(startup_id)
  where startup_id is not null;

create index if not exists idx_ai_runs_user_id
  on public.ai_runs(user_id)
  where user_id is not null;

create index if not exists idx_ai_runs_session_id
  on public.ai_runs(session_id)
  where session_id is not null;

-- monitoring: recent runs by status
create index if not exists idx_ai_runs_status_recent
  on public.ai_runs(status, created_at desc);

-- analytics: runs by agent type
create index if not exists idx_ai_runs_agent_type
  on public.ai_runs(agent_type, created_at desc);

-- analytics: runs by model
create index if not exists idx_ai_runs_model
  on public.ai_runs(model, created_at desc);

-- cost analysis: runs with cost
create index if not exists idx_ai_runs_cost
  on public.ai_runs(created_at desc, cost_cents)
  where cost_cents is not null;

-- error tracking: failed runs
create index if not exists idx_ai_runs_errors
  on public.ai_runs(error_code, created_at desc)
  where status = 'failed';

-- =============================================================================
-- 3. row level security
-- =============================================================================

alter table public.ai_runs enable row level security;

-- select: users can view runs for their org's startups
create policy "users can view ai runs for their startups"
  on public.ai_runs
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or startup_id in (
      select s.id
      from public.startups s
      where s.org_id = (select public.user_org_id())
    )
  );

-- insert: service role only (AI agents create runs)
-- no insert policy for authenticated users

-- update: service role only (status updates during execution)
-- no update policy for authenticated users

-- delete: no delete policy (runs are immutable audit trail)

-- service role: full access for AI agents and admin operations
create policy "service role has full access to ai runs"
  on public.ai_runs
  for all
  to service_role
  using (true)
  with check (true);

-- =============================================================================
-- end of migration: 20260204100500_create_ai_runs.sql
-- =============================================================================
