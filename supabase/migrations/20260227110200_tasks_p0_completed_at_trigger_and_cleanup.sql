-- TASKS-P0-FIX: completed_at trigger + dead trigger cleanup

-- 1. create trigger function for completed_at
create or replace function public.set_task_completed_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- set completed_at when status changes TO 'completed'
  if new.status = 'completed' and (old.status is distinct from 'completed') then
    new.completed_at = now();
  end if;
  -- clear completed_at when status changes AWAY FROM 'completed'
  if old.status = 'completed' and new.status != 'completed' then
    new.completed_at = null;
  end if;
  return new;
end;
$$;

-- 2. create the trigger (drop if exists first for idempotency)
drop trigger if exists trg_set_task_completed_at on public.tasks;
create trigger trg_set_task_completed_at
  before update on public.tasks
  for each row
  execute function public.set_task_completed_at();

-- 3. drop dead broadcast trigger + function
drop trigger if exists task_event_broadcast on public.tasks;
drop function if exists public.broadcast_task_event();
