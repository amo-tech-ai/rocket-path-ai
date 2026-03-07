-- CHAT-P0-FIX: FK fix + dead table drop
-- Problem 1: chat_messages.ai_run_id has NO ACTION — blocks ai_run cleanup
-- Problem 2: chat_pending is dead (0 rows, 0 code refs, superseded by proposed_actions)
-- Idempotent: only alter if table and column exist (safe for shadow DB / db pull).

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'chat_messages' and column_name = 'ai_run_id'
  ) then
    alter table public.chat_messages drop constraint if exists chat_messages_ai_run_id_fkey;
    alter table public.chat_messages
      add constraint chat_messages_ai_run_id_fkey
      foreign key (ai_run_id) references public.ai_runs(id) on delete set null;
  end if;
end
$$;

-- back up dead table before dropping (only if it exists)
create schema if not exists backup;
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'chat_pending') then
    create table if not exists backup.chat_pending as table public.chat_pending;
    drop table public.chat_pending;
  end if;
end
$$;
