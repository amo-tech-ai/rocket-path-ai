-- =============================================================================
-- migration: 20260204100400_create_chat_messages.sql
-- purpose: create chat_messages table for AI conversation messages
-- affected tables: chat_messages
-- dependencies: chat_sessions
-- =============================================================================

-- =============================================================================
-- 1. table: chat_messages
-- =============================================================================

-- chat_messages stores individual messages in a conversation
-- supports user messages, assistant responses, and system messages
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  session_id uuid not null references public.chat_sessions(id) on delete cascade,

  -- message content
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,

  -- ai metadata (for assistant messages)
  model text, -- 'gemini-3-flash', 'gemini-3-pro', 'claude-sonnet-4-5', etc.
  tokens_used integer,
  latency_ms integer, -- response time in milliseconds

  -- tool usage tracking
  tool_calls jsonb, -- array of tool calls made by the assistant
  tool_results jsonb, -- results from tool executions

  -- feedback
  feedback text check (feedback in ('positive', 'negative')),
  feedback_text text,

  -- metadata
  metadata jsonb default '{}'::jsonb,

  -- timestamps
  created_at timestamptz not null default now()
  -- note: messages are immutable, no updated_at needed
);

-- add table comment
comment on table public.chat_messages is 'Individual messages within AI chat sessions.';
comment on column public.chat_messages.role is 'Message role: user, assistant, or system.';
comment on column public.chat_messages.model is 'AI model used for assistant responses.';
comment on column public.chat_messages.tool_calls is 'JSONB array of tool calls made by the assistant.';

-- =============================================================================
-- 2. indexes
-- =============================================================================

-- fk index on session_id
create index if not exists idx_chat_messages_session_id
  on public.chat_messages(session_id);

-- messages in session order
create index if not exists idx_chat_messages_session_order
  on public.chat_messages(session_id, created_at);

-- find messages with feedback
create index if not exists idx_chat_messages_feedback
  on public.chat_messages(feedback, created_at desc)
  where feedback is not null;

-- =============================================================================
-- 3. trigger: update session message count and last_message_at
-- =============================================================================

create or replace function public.update_chat_session_stats()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.chat_sessions
  set
    message_count = message_count + 1,
    last_message_at = new.created_at,
    updated_at = now()
  where id = new.session_id;

  return new;
end;
$$;

create trigger trigger_chat_messages_update_session
  after insert on public.chat_messages
  for each row
  execute function public.update_chat_session_stats();

-- =============================================================================
-- 4. row level security
-- =============================================================================

alter table public.chat_messages enable row level security;

-- select: users can view messages in their sessions
create policy "users can view their chat messages"
  on public.chat_messages
  for select
  to authenticated
  using (
    session_id in (
      select cs.id
      from public.chat_sessions cs
      where cs.user_id = (select auth.uid())
    )
  );

-- insert: users can add messages to their sessions
create policy "users can create chat messages"
  on public.chat_messages
  for insert
  to authenticated
  with check (
    session_id in (
      select cs.id
      from public.chat_sessions cs
      where cs.user_id = (select auth.uid())
    )
  );

-- update: users can update feedback on messages in their sessions
create policy "users can update message feedback"
  on public.chat_messages
  for update
  to authenticated
  using (
    session_id in (
      select cs.id
      from public.chat_sessions cs
      where cs.user_id = (select auth.uid())
    )
  )
  with check (
    session_id in (
      select cs.id
      from public.chat_sessions cs
      where cs.user_id = (select auth.uid())
    )
  );

-- note: messages are immutable - no delete policy for users
-- only service role can delete messages

-- service role: full access for AI agents
create policy "service role has full access to chat messages"
  on public.chat_messages
  for all
  to service_role
  using (true)
  with check (true);

-- =============================================================================
-- end of migration: 20260204100400_create_chat_messages.sql
-- =============================================================================
