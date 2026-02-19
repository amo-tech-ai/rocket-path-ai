-- migration: create_validator_agent_runs
-- description: P0 validator agent runs table for v3 per-agent tracking + expand validator_sessions status CHECK
-- task_ref: 15a-validator-agent-runs-table
-- depends_on: validator_sessions

-- ============================================================
-- validator_agent_runs: per-agent status tracking for v3 pipeline
-- ============================================================
create table public.validator_agent_runs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.validator_sessions(id) on delete cascade,
  agent_name text not null check (agent_name in ('extract','research','competitors','score','mvp','compose','verify')),
  attempt int not null default 0,
  status text not null default 'queued' check (status in ('queued','running','ok','failed','skipped')),
  output_json jsonb,
  error text,
  duration_ms int,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  unique (session_id, agent_name, attempt)
);

comment on table public.validator_agent_runs is 'Per-agent status and output for the v3 validator pipeline';

-- indexes
create index idx_validator_agent_runs_session_id on public.validator_agent_runs (session_id);
create index idx_validator_agent_runs_status on public.validator_agent_runs (status);

-- RLS
alter table public.validator_agent_runs enable row level security;

-- authenticated users can read their own session runs
create policy "select_own_agent_runs"
  on public.validator_agent_runs
  for select
  to authenticated
  using (
    session_id in (
      select id from public.validator_sessions
      where user_id = (select auth.uid())
    )
  );

-- service_role inserts and updates (internal agents only)
create policy "service_role_insert_agent_runs"
  on public.validator_agent_runs
  for insert
  to service_role
  with check (true);

create policy "service_role_update_agent_runs"
  on public.validator_agent_runs
  for update
  to service_role
  using (true)
  with check (true);

-- ============================================================
-- expand validator_sessions status CHECK to include v3 statuses
-- ============================================================
alter table public.validator_sessions
  drop constraint if exists validator_sessions_status_check;

alter table public.validator_sessions
  add constraint validator_sessions_status_check
  check (status in ('queued','running','complete','partial','failed','success','degraded_success'));
