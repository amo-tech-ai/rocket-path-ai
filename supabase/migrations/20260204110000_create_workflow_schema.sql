-- =============================================================================
-- migration: 20260204110000_create_workflow_schema.sql
-- purpose: create workflow automation tables for task 018-WFL
-- affected tables: workflows, workflow_triggers, workflow_actions, workflow_queue, workflow_runs
-- dependencies: startups, organizations
-- =============================================================================

-- =============================================================================
-- 1. enums for workflow status and trigger types
-- =============================================================================

-- workflow status enum
do $$
begin
  if not exists (select 1 from pg_type where typname = 'workflow_status') then
    create type public.workflow_status as enum (
      'draft',
      'active',
      'paused',
      'archived'
    );
  end if;
end$$;

-- trigger type enum
do $$
begin
  if not exists (select 1 from pg_type where typname = 'trigger_type') then
    create type public.trigger_type as enum (
      'event',
      'schedule',
      'webhook',
      'manual'
    );
  end if;
end$$;

-- action type enum
do $$
begin
  if not exists (select 1 from pg_type where typname = 'action_type') then
    create type public.action_type as enum (
      'create_task',
      'send_notification',
      'update_record',
      'call_api',
      'send_email',
      'ai_generate',
      'delay',
      'condition'
    );
  end if;
end$$;

-- run status enum
do $$
begin
  if not exists (select 1 from pg_type where typname = 'run_status') then
    create type public.run_status as enum (
      'pending',
      'running',
      'completed',
      'failed',
      'cancelled'
    );
  end if;
end$$;

-- =============================================================================
-- 2. table: workflows
-- =============================================================================

-- workflows is the main workflow definition table
create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  org_id uuid not null references public.organizations(id) on delete cascade,
  startup_id uuid references public.startups(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,

  -- workflow definition
  name text not null,
  description text,
  status text not null default 'draft',

  -- configuration
  config jsonb not null default '{}'::jsonb,

  -- execution settings
  max_retries integer not null default 3,
  retry_delay_seconds integer not null default 60,
  timeout_seconds integer not null default 300,

  -- statistics
  run_count integer not null default 0,
  success_count integer not null default 0,
  failure_count integer not null default 0,
  last_run_at timestamptz,

  -- timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- add table comments
comment on table public.workflows is 'Workflow definitions for automation rules.';
comment on column public.workflows.status is 'draft, active, paused, archived';
comment on column public.workflows.config is 'JSONB configuration for workflow behavior';

-- =============================================================================
-- 3. table: workflow_triggers
-- =============================================================================

-- workflow_triggers defines what starts a workflow
create table if not exists public.workflow_triggers (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  workflow_id uuid not null references public.workflows(id) on delete cascade,

  -- trigger definition
  trigger_type text not null default 'event',
  event_name text,
  schedule_cron text,
  webhook_path text,

  -- conditions
  conditions jsonb not null default '[]'::jsonb,

  -- status
  is_active boolean not null default true,

  -- timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- add table comments
comment on table public.workflow_triggers is 'Trigger definitions for workflows - event, schedule, webhook, or manual.';
comment on column public.workflow_triggers.event_name is 'Event name to listen for (e.g., task.created, deal.stage_changed)';
comment on column public.workflow_triggers.schedule_cron is 'Cron expression for scheduled triggers';
comment on column public.workflow_triggers.conditions is 'JSONB array of conditions that must be met';

-- =============================================================================
-- 4. table: workflow_actions
-- =============================================================================

-- workflow_actions defines steps in a workflow
create table if not exists public.workflow_actions (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  workflow_id uuid not null references public.workflows(id) on delete cascade,

  -- action definition
  action_type text not null default 'create_task',
  name text not null,
  description text,

  -- sequencing
  step_order integer not null default 0,

  -- configuration
  config jsonb not null default '{}'::jsonb,

  -- conditions for this step
  conditions jsonb not null default '[]'::jsonb,

  -- error handling
  on_error text not null default 'stop',

  -- status
  is_active boolean not null default true,

  -- timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- add table comments
comment on table public.workflow_actions is 'Action steps within a workflow, executed in step_order sequence.';
comment on column public.workflow_actions.action_type is 'create_task, send_notification, update_record, call_api, send_email, ai_generate, delay, condition';
comment on column public.workflow_actions.on_error is 'stop, continue, or retry';

-- =============================================================================
-- 5. table: workflow_queue
-- =============================================================================

-- workflow_queue for async processing of workflow runs
create table if not exists public.workflow_queue (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  trigger_id uuid references public.workflow_triggers(id) on delete set null,

  -- context
  trigger_payload jsonb not null default '{}'::jsonb,

  -- scheduling
  scheduled_for timestamptz not null default now(),
  priority integer not null default 0,

  -- status
  status text not null default 'pending',
  attempts integer not null default 0,
  max_attempts integer not null default 3,

  -- processing
  locked_at timestamptz,
  locked_by text,

  -- error tracking
  last_error text,
  last_error_at timestamptz,

  -- timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- add table comments
comment on table public.workflow_queue is 'Queue for async workflow execution with retry support.';
comment on column public.workflow_queue.locked_by is 'Worker ID that locked this queue item';
comment on column public.workflow_queue.priority is 'Higher priority runs first (0 = normal)';

-- =============================================================================
-- 6. table: workflow_runs
-- =============================================================================

-- workflow_runs tracks execution history
create table if not exists public.workflow_runs (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  queue_id uuid references public.workflow_queue(id) on delete set null,
  trigger_id uuid references public.workflow_triggers(id) on delete set null,

  -- execution context
  trigger_payload jsonb not null default '{}'::jsonb,

  -- status
  status text not null default 'running',
  current_step integer not null default 0,

  -- results
  results jsonb not null default '[]'::jsonb,

  -- timing
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  duration_ms integer,

  -- error tracking
  error_message text,
  error_step integer,

  -- timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- add table comments
comment on table public.workflow_runs is 'Execution history for workflow runs with step-by-step results.';
comment on column public.workflow_runs.results is 'JSONB array of action results per step';
comment on column public.workflow_runs.duration_ms is 'Total execution time in milliseconds';

-- =============================================================================
-- 7. indexes
-- =============================================================================

-- workflows indexes
create index if not exists idx_workflows_org_id
  on public.workflows(org_id);

create index if not exists idx_workflows_startup_id
  on public.workflows(startup_id)
  where startup_id is not null;

create index if not exists idx_workflows_status
  on public.workflows(status)
  where status = 'active';

create index if not exists idx_workflows_org_status
  on public.workflows(org_id, status);

-- workflow_triggers indexes
create index if not exists idx_workflow_triggers_workflow_id
  on public.workflow_triggers(workflow_id);

create index if not exists idx_workflow_triggers_event
  on public.workflow_triggers(event_name)
  where event_name is not null and is_active = true;

create index if not exists idx_workflow_triggers_active
  on public.workflow_triggers(workflow_id)
  where is_active = true;

-- workflow_actions indexes
create index if not exists idx_workflow_actions_workflow_id
  on public.workflow_actions(workflow_id);

create index if not exists idx_workflow_actions_order
  on public.workflow_actions(workflow_id, step_order);

-- workflow_queue indexes
create index if not exists idx_workflow_queue_pending
  on public.workflow_queue(scheduled_for, priority desc)
  where status = 'pending' and locked_at is null;

create index if not exists idx_workflow_queue_workflow_id
  on public.workflow_queue(workflow_id);

create index if not exists idx_workflow_queue_status
  on public.workflow_queue(status, created_at desc);

-- workflow_runs indexes
create index if not exists idx_workflow_runs_workflow_id
  on public.workflow_runs(workflow_id);

create index if not exists idx_workflow_runs_status
  on public.workflow_runs(status)
  where status = 'running';

create index if not exists idx_workflow_runs_workflow_created
  on public.workflow_runs(workflow_id, created_at desc);

create index if not exists idx_workflow_runs_recent
  on public.workflow_runs(created_at desc)
  where created_at > now() - interval '7 days';

-- =============================================================================
-- 8. triggers
-- =============================================================================

-- workflows updated_at trigger
create trigger trigger_workflows_updated_at
  before update on public.workflows
  for each row
  execute function public.handle_updated_at();

-- workflow_triggers updated_at trigger
create trigger trigger_workflow_triggers_updated_at
  before update on public.workflow_triggers
  for each row
  execute function public.handle_updated_at();

-- workflow_actions updated_at trigger
create trigger trigger_workflow_actions_updated_at
  before update on public.workflow_actions
  for each row
  execute function public.handle_updated_at();

-- workflow_queue updated_at trigger
create trigger trigger_workflow_queue_updated_at
  before update on public.workflow_queue
  for each row
  execute function public.handle_updated_at();

-- workflow_runs updated_at trigger
create trigger trigger_workflow_runs_updated_at
  before update on public.workflow_runs
  for each row
  execute function public.handle_updated_at();

-- update workflow stats on run completion
create or replace function public.update_workflow_stats()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status in ('completed', 'failed') and old.status = 'running' then
    update public.workflows
    set
      run_count = run_count + 1,
      success_count = success_count + case when new.status = 'completed' then 1 else 0 end,
      failure_count = failure_count + case when new.status = 'failed' then 1 else 0 end,
      last_run_at = now()
    where id = new.workflow_id;
  end if;
  return new;
end;
$$;

create trigger trigger_workflow_runs_stats
  after update on public.workflow_runs
  for each row
  execute function public.update_workflow_stats();

-- =============================================================================
-- 9. row level security
-- =============================================================================

-- enable RLS on all tables
alter table public.workflows enable row level security;
alter table public.workflow_triggers enable row level security;
alter table public.workflow_actions enable row level security;
alter table public.workflow_queue enable row level security;
alter table public.workflow_runs enable row level security;

-- workflows RLS policies
create policy "users can view org workflows"
  on public.workflows for select to authenticated
  using (org_id = (select public.user_org_id()));

create policy "users can create org workflows"
  on public.workflows for insert to authenticated
  with check (org_id = (select public.user_org_id()));

create policy "users can update org workflows"
  on public.workflows for update to authenticated
  using (org_id = (select public.user_org_id()))
  with check (org_id = (select public.user_org_id()));

create policy "users can delete org workflows"
  on public.workflows for delete to authenticated
  using (org_id = (select public.user_org_id()));

create policy "service role full access workflows"
  on public.workflows for all to service_role
  using (true) with check (true);

-- workflow_triggers RLS policies
create policy "users can view workflow triggers"
  on public.workflow_triggers for select to authenticated
  using (workflow_id in (
    select id from public.workflows where org_id = (select public.user_org_id())
  ));

create policy "users can create workflow triggers"
  on public.workflow_triggers for insert to authenticated
  with check (workflow_id in (
    select id from public.workflows where org_id = (select public.user_org_id())
  ));

create policy "users can update workflow triggers"
  on public.workflow_triggers for update to authenticated
  using (workflow_id in (
    select id from public.workflows where org_id = (select public.user_org_id())
  ))
  with check (workflow_id in (
    select id from public.workflows where org_id = (select public.user_org_id())
  ));

create policy "users can delete workflow triggers"
  on public.workflow_triggers for delete to authenticated
  using (workflow_id in (
    select id from public.workflows where org_id = (select public.user_org_id())
  ));

create policy "service role full access workflow triggers"
  on public.workflow_triggers for all to service_role
  using (true) with check (true);

-- workflow_actions RLS policies
create policy "users can view workflow actions"
  on public.workflow_actions for select to authenticated
  using (workflow_id in (
    select id from public.workflows where org_id = (select public.user_org_id())
  ));

create policy "users can create workflow actions"
  on public.workflow_actions for insert to authenticated
  with check (workflow_id in (
    select id from public.workflows where org_id = (select public.user_org_id())
  ));

create policy "users can update workflow actions"
  on public.workflow_actions for update to authenticated
  using (workflow_id in (
    select id from public.workflows where org_id = (select public.user_org_id())
  ))
  with check (workflow_id in (
    select id from public.workflows where org_id = (select public.user_org_id())
  ));

create policy "users can delete workflow actions"
  on public.workflow_actions for delete to authenticated
  using (workflow_id in (
    select id from public.workflows where org_id = (select public.user_org_id())
  ));

create policy "service role full access workflow actions"
  on public.workflow_actions for all to service_role
  using (true) with check (true);

-- workflow_queue RLS policies
create policy "users can view workflow queue"
  on public.workflow_queue for select to authenticated
  using (workflow_id in (
    select id from public.workflows where org_id = (select public.user_org_id())
  ));

create policy "users can create queue items"
  on public.workflow_queue for insert to authenticated
  with check (workflow_id in (
    select id from public.workflows where org_id = (select public.user_org_id())
  ));

create policy "users can update queue items"
  on public.workflow_queue for update to authenticated
  using (workflow_id in (
    select id from public.workflows where org_id = (select public.user_org_id())
  ))
  with check (workflow_id in (
    select id from public.workflows where org_id = (select public.user_org_id())
  ));

create policy "users can delete queue items"
  on public.workflow_queue for delete to authenticated
  using (workflow_id in (
    select id from public.workflows where org_id = (select public.user_org_id())
  ));

create policy "service role full access workflow queue"
  on public.workflow_queue for all to service_role
  using (true) with check (true);

-- workflow_runs RLS policies
create policy "users can view workflow runs"
  on public.workflow_runs for select to authenticated
  using (workflow_id in (
    select id from public.workflows where org_id = (select public.user_org_id())
  ));

create policy "users can create workflow runs"
  on public.workflow_runs for insert to authenticated
  with check (workflow_id in (
    select id from public.workflows where org_id = (select public.user_org_id())
  ));

create policy "users can update workflow runs"
  on public.workflow_runs for update to authenticated
  using (workflow_id in (
    select id from public.workflows where org_id = (select public.user_org_id())
  ))
  with check (workflow_id in (
    select id from public.workflows where org_id = (select public.user_org_id())
  ));

create policy "users can delete workflow runs"
  on public.workflow_runs for delete to authenticated
  using (workflow_id in (
    select id from public.workflows where org_id = (select public.user_org_id())
  ));

create policy "service role full access workflow runs"
  on public.workflow_runs for all to service_role
  using (true) with check (true);

-- =============================================================================
-- 10. helper functions
-- =============================================================================

-- get active workflows for an event
create or replace function public.get_workflows_for_event(p_event_name text, p_org_id uuid)
returns table (
  workflow_id uuid,
  workflow_name text,
  trigger_id uuid,
  conditions jsonb
)
language sql
security invoker
set search_path = public
as $$
  select
    w.id as workflow_id,
    w.name as workflow_name,
    t.id as trigger_id,
    t.conditions
  from public.workflows w
  join public.workflow_triggers t on t.workflow_id = w.id
  where w.org_id = p_org_id
    and w.status = 'active'
    and t.is_active = true
    and t.trigger_type = 'event'
    and t.event_name = p_event_name;
$$;

-- get pending queue items for processing
create or replace function public.get_pending_workflow_queue(p_limit integer default 10)
returns table (
  id uuid,
  workflow_id uuid,
  trigger_id uuid,
  trigger_payload jsonb,
  attempts integer
)
language sql
security definer
set search_path = public
as $$
  select
    q.id,
    q.workflow_id,
    q.trigger_id,
    q.trigger_payload,
    q.attempts
  from public.workflow_queue q
  where q.status = 'pending'
    and q.scheduled_for <= now()
    and q.locked_at is null
    and q.attempts < q.max_attempts
  order by q.priority desc, q.scheduled_for asc
  limit p_limit
  for update skip locked;
$$;

-- =============================================================================
-- end of migration: 20260204110000_create_workflow_schema.sql
-- =============================================================================
