-- migration: add_validation_board_schema
-- description: Add validation stage + current bet to startups, create pivot_logs table
-- task_ref: 05-validation-board
-- depends_on: startups, assumptions

-- ============================================================
-- 1. Add validation_stage and current_bet to startups
-- ============================================================

alter table public.startups
  add column validation_stage text not null default 'idea'
  check (validation_stage in ('idea', 'mvp', 'selling'));

alter table public.startups
  add column current_bet jsonb default '{}'::jsonb;

comment on column public.startups.validation_stage
  is 'Current validation stage: idea → mvp → selling';

comment on column public.startups.current_bet
  is 'Current bet: {audience, pain_point, solution} being validated';

-- ============================================================
-- 2. Create pivot_logs table
-- ============================================================

create table public.pivot_logs (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid not null references public.startups(id) on delete cascade,
  assumption_id uuid references public.assumptions(id) on delete set null,
  pivot_type text not null check (pivot_type in ('audience', 'pain', 'solution', 'stage_advance')),
  old_value text,
  new_value text,
  reason text not null,
  created_at timestamptz not null default now()
);

comment on table public.pivot_logs is 'History of pivots and stage advances during validation';

create index idx_pivot_logs_startup_id on public.pivot_logs (startup_id);
create index idx_pivot_logs_assumption_id on public.pivot_logs (assumption_id);

-- RLS
alter table public.pivot_logs enable row level security;

create policy "select_own_pivot_logs"
  on public.pivot_logs for select to authenticated
  using (startup_id in (
    select id from public.startups where org_id = (select public.user_org_id())
  ));

create policy "insert_own_pivot_logs"
  on public.pivot_logs for insert to authenticated
  with check (startup_id in (
    select id from public.startups where org_id = (select public.user_org_id())
  ));

create policy "delete_own_pivot_logs"
  on public.pivot_logs for delete to authenticated
  using (startup_id in (
    select id from public.startups where org_id = (select public.user_org_id())
  ));

-- no update — pivot logs are immutable history
