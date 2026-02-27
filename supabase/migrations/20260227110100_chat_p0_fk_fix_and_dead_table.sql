-- CHAT-P0-FIX: FK fix + dead table drop
-- Problem 1: chat_messages.ai_run_id has NO ACTION — blocks ai_run cleanup
-- Problem 2: chat_pending is dead (0 rows, 0 code refs, superseded by proposed_actions)

-- fix chat_messages.ai_run_id FK
alter table public.chat_messages
    drop constraint if exists chat_messages_ai_run_id_fkey;
alter table public.chat_messages
    add constraint chat_messages_ai_run_id_fkey
    foreign key (ai_run_id) references public.ai_runs(id) on delete set null;

-- back up dead table before dropping
create schema if not exists backup;
create table if not exists backup.chat_pending as table public.chat_pending;

-- drop dead table (RLS policies are dropped automatically with the table)
drop table if exists public.chat_pending;
