-- =============================================================================
-- migration: 20260204100300_create_chat_sessions.sql
-- purpose: create chat_sessions table for AI conversation tracking
-- affected tables: chat_sessions
-- dependencies: startups, profiles
-- =============================================================================

-- =============================================================================
-- 1. table: chat_sessions
-- =============================================================================

-- chat_sessions stores conversation threads with AI assistants
-- each session can have multiple messages and maintains context
create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  startup_id uuid not null references public.startups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,

  -- session details
  title text,
  agent_type text not null default 'general', -- 'general', 'canvas', 'validation', 'pitch', 'crm', etc.

  -- context for the conversation
  context jsonb default '{}'::jsonb, -- stores relevant context like canvas_id, project_id, etc.

  -- status
  status text not null default 'active' check (status in ('active', 'archived', 'deleted')),

  -- metadata
  message_count integer not null default 0,
  last_message_at timestamptz,

  -- timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- add table comment
comment on table public.chat_sessions is 'AI conversation threads for startup coaching and assistance.';
comment on column public.chat_sessions.agent_type is 'Type of AI agent: general, canvas, validation, pitch, crm, etc.';
comment on column public.chat_sessions.context is 'JSONB context data relevant to the conversation (canvas_id, project_id, etc).';

-- =============================================================================
-- 2. indexes
-- =============================================================================

-- fk index on startup_id
create index if not exists idx_chat_sessions_startup_id
  on public.chat_sessions(startup_id);

-- fk index on user_id
create index if not exists idx_chat_sessions_user_id
  on public.chat_sessions(user_id);

-- user's sessions (most recent first)
create index if not exists idx_chat_sessions_user_recent
  on public.chat_sessions(user_id, updated_at desc)
  where status = 'active';

-- sessions by agent type
create index if not exists idx_chat_sessions_agent_type
  on public.chat_sessions(startup_id, agent_type, updated_at desc)
  where status = 'active';

-- =============================================================================
-- 3. triggers
-- =============================================================================

-- auto-update updated_at timestamp
create trigger trigger_chat_sessions_updated_at
  before update on public.chat_sessions
  for each row
  execute function public.handle_updated_at();

-- =============================================================================
-- 4. row level security
-- =============================================================================

alter table public.chat_sessions enable row level security;

-- select: users can view their own chat sessions
create policy "users can view their chat sessions"
  on public.chat_sessions
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

-- insert: users can create chat sessions for their org's startups
create policy "users can create chat sessions"
  on public.chat_sessions
  for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and startup_id in (
      select s.id
      from public.startups s
      where s.org_id = (select public.user_org_id())
    )
  );

-- update: users can update their own chat sessions
create policy "users can update their chat sessions"
  on public.chat_sessions
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- delete: users can delete their own chat sessions
create policy "users can delete their chat sessions"
  on public.chat_sessions
  for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- service role: full access for AI agents
create policy "service role has full access to chat sessions"
  on public.chat_sessions
  for all
  to service_role
  using (true)
  with check (true);

-- =============================================================================
-- end of migration: 20260204100300_create_chat_sessions.sql
-- =============================================================================
