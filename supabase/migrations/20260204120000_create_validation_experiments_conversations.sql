-- =============================================================================
-- migration: 20260204120000_create_validation_experiments_conversations.sql
-- purpose: complete coach tables - validation_experiments and validation_conversations
-- task_ref: 101-COACH
-- dependencies: validation_sessions, validation_sprints
-- =============================================================================

-- =============================================================================
-- 1. table: validation_experiments
-- =============================================================================

-- validation_experiments tracks hypotheses tested during sprints
create table if not exists public.validation_experiments (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  sprint_id uuid not null references public.validation_sprints(id) on delete cascade,

  -- experiment definition
  hypothesis text not null,
  method text,
  success_criteria text,

  -- results
  result text,
  learning text,
  evidence jsonb default '[]'::jsonb,

  -- status tracking
  status text not null default 'planned' check (status in ('planned', 'running', 'completed', 'abandoned')),

  -- metrics
  target_metric text,
  baseline_value numeric,
  actual_value numeric,

  -- timestamps
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- add table comments
comment on table public.validation_experiments is 'Experiments run during validation sprints - tracks hypotheses, methods, and learnings.';
comment on column public.validation_experiments.hypothesis is 'The hypothesis being tested (e.g., "Users will pay $50/mo for this feature")';
comment on column public.validation_experiments.evidence is 'JSONB array of evidence collected (quotes, data points, screenshots)';
comment on column public.validation_experiments.learning is 'Key insight gained from this experiment';

-- =============================================================================
-- 2. table: validation_conversations
-- =============================================================================

-- validation_conversations stores coach chat history per session
create table if not exists public.validation_conversations (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  session_id uuid not null references public.validation_sessions(id) on delete cascade,

  -- message content
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,

  -- context
  phase text,
  tool_calls jsonb,
  citations jsonb,

  -- metadata
  tokens_used integer,
  model_used text,

  -- timestamps
  created_at timestamptz not null default now()
);

-- add table comments
comment on table public.validation_conversations is 'Coach chat history - enables full conversation memory across sessions.';
comment on column public.validation_conversations.phase is 'Validation phase when message was sent (assessment, constraint, sprint_execution, etc.)';
comment on column public.validation_conversations.tool_calls is 'JSONB of any tool calls made by the assistant';
comment on column public.validation_conversations.citations is 'JSONB of any citations/sources used in the response';

-- =============================================================================
-- 3. indexes
-- =============================================================================

-- validation_experiments indexes
create index if not exists idx_validation_experiments_sprint_id
  on public.validation_experiments(sprint_id);

create index if not exists idx_validation_experiments_status
  on public.validation_experiments(status)
  where status in ('planned', 'running');

create index if not exists idx_validation_experiments_sprint_status
  on public.validation_experiments(sprint_id, status);

-- validation_conversations indexes
create index if not exists idx_validation_conversations_session_id
  on public.validation_conversations(session_id);

create index if not exists idx_validation_conversations_created
  on public.validation_conversations(session_id, created_at desc);

create index if not exists idx_validation_conversations_phase
  on public.validation_conversations(session_id, phase);

create index if not exists idx_validation_conversations_role
  on public.validation_conversations(session_id, role)
  where role = 'assistant';

-- =============================================================================
-- 4. triggers
-- =============================================================================

-- validation_experiments updated_at trigger
create trigger trigger_validation_experiments_updated_at
  before update on public.validation_experiments
  for each row
  execute function public.handle_updated_at();

-- =============================================================================
-- 5. row level security
-- =============================================================================

alter table public.validation_experiments enable row level security;
alter table public.validation_conversations enable row level security;

-- Helper: get startup_id from sprint via campaign → session
-- validation_experiments RLS (via sprint → campaign → session → startup)
create policy "users can view validation experiments"
  on public.validation_experiments for select to authenticated
  using (
    sprint_id in (
      select vs.id from public.validation_sprints vs
      join public.validation_campaigns vc on vc.id = vs.campaign_id
      join public.validation_sessions vss on vss.id = vc.session_id
      join public.startups s on s.id = vss.startup_id
      where s.org_id = (select public.user_org_id())
    )
  );

create policy "users can create validation experiments"
  on public.validation_experiments for insert to authenticated
  with check (
    sprint_id in (
      select vs.id from public.validation_sprints vs
      join public.validation_campaigns vc on vc.id = vs.campaign_id
      join public.validation_sessions vss on vss.id = vc.session_id
      join public.startups s on s.id = vss.startup_id
      where s.org_id = (select public.user_org_id())
    )
  );

create policy "users can update validation experiments"
  on public.validation_experiments for update to authenticated
  using (
    sprint_id in (
      select vs.id from public.validation_sprints vs
      join public.validation_campaigns vc on vc.id = vs.campaign_id
      join public.validation_sessions vss on vss.id = vc.session_id
      join public.startups s on s.id = vss.startup_id
      where s.org_id = (select public.user_org_id())
    )
  )
  with check (
    sprint_id in (
      select vs.id from public.validation_sprints vs
      join public.validation_campaigns vc on vc.id = vs.campaign_id
      join public.validation_sessions vss on vss.id = vc.session_id
      join public.startups s on s.id = vss.startup_id
      where s.org_id = (select public.user_org_id())
    )
  );

create policy "users can delete validation experiments"
  on public.validation_experiments for delete to authenticated
  using (
    sprint_id in (
      select vs.id from public.validation_sprints vs
      join public.validation_campaigns vc on vc.id = vs.campaign_id
      join public.validation_sessions vss on vss.id = vc.session_id
      join public.startups s on s.id = vss.startup_id
      where s.org_id = (select public.user_org_id())
    )
  );

create policy "service role full access validation experiments"
  on public.validation_experiments for all to service_role
  using (true) with check (true);

-- validation_conversations RLS (via session → startup)
create policy "users can view validation conversations"
  on public.validation_conversations for select to authenticated
  using (
    session_id in (
      select vss.id from public.validation_sessions vss
      join public.startups s on s.id = vss.startup_id
      where s.org_id = (select public.user_org_id())
    )
  );

create policy "users can create validation conversations"
  on public.validation_conversations for insert to authenticated
  with check (
    session_id in (
      select vss.id from public.validation_sessions vss
      join public.startups s on s.id = vss.startup_id
      where s.org_id = (select public.user_org_id())
    )
  );

create policy "users can update validation conversations"
  on public.validation_conversations for update to authenticated
  using (
    session_id in (
      select vss.id from public.validation_sessions vss
      join public.startups s on s.id = vss.startup_id
      where s.org_id = (select public.user_org_id())
    )
  )
  with check (
    session_id in (
      select vss.id from public.validation_sessions vss
      join public.startups s on s.id = vss.startup_id
      where s.org_id = (select public.user_org_id())
    )
  );

create policy "users can delete validation conversations"
  on public.validation_conversations for delete to authenticated
  using (
    session_id in (
      select vss.id from public.validation_sessions vss
      join public.startups s on s.id = vss.startup_id
      where s.org_id = (select public.user_org_id())
    )
  );

create policy "service role full access validation conversations"
  on public.validation_conversations for all to service_role
  using (true) with check (true);

-- =============================================================================
-- 6. helper functions
-- =============================================================================

-- Get conversation history for a session
create or replace function public.get_conversation_history(
  p_session_id uuid,
  p_limit integer default 50
)
returns table (
  id uuid,
  role text,
  content text,
  phase text,
  created_at timestamptz
)
language sql
security invoker
set search_path = public
as $$
  select id, role, content, phase, created_at
  from public.validation_conversations
  where session_id = p_session_id
  order by created_at desc
  limit p_limit;
$$;

-- Get experiments for a sprint
create or replace function public.get_sprint_experiments(p_sprint_id uuid)
returns table (
  id uuid,
  hypothesis text,
  status text,
  result text,
  learning text
)
language sql
security invoker
set search_path = public
as $$
  select id, hypothesis, status, result, learning
  from public.validation_experiments
  where sprint_id = p_sprint_id
  order by created_at asc;
$$;

-- =============================================================================
-- end of migration
-- =============================================================================
