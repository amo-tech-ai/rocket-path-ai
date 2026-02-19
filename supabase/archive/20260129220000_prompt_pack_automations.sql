-- =====================================================
-- PROMPT PACK AUTOMATIONS SYSTEM
-- Event-driven, scheduled, and chained workflows
-- =====================================================

-- Automation triggers table
create table if not exists automation_triggers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,

  -- Trigger type: event, schedule, condition, webhook
  trigger_type text not null check (trigger_type in ('event', 'schedule', 'condition', 'webhook')),

  -- Event triggers (e.g., 'onboarding.step.completed', 'canvas.saved', 'profile.updated')
  event_name text,

  -- Schedule triggers (cron expression)
  schedule_cron text,

  -- Condition triggers (JSONB with field conditions)
  condition_rules jsonb default '{}',

  -- Webhook triggers
  webhook_secret text,

  -- What to execute
  pack_id uuid references prompt_packs(id) on delete cascade,
  playbook_id uuid references playbooks(id) on delete cascade,

  -- Execution settings
  execution_mode text default 'async' check (execution_mode in ('sync', 'async', 'background')),
  retry_count int default 3,
  retry_delay_seconds int default 60,
  timeout_seconds int default 300,

  -- Auto-apply settings
  auto_apply_outputs boolean default true,
  output_targets jsonb default '[]', -- e.g., ['profile', 'canvas', 'tasks']

  -- Status
  is_active boolean default true,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
comment on table automation_triggers is 'Event/schedule/condition triggers that run prompt packs or playbooks';

-- Automation execution log
create table if not exists automation_executions (
  id uuid primary key default gen_random_uuid(),
  trigger_id uuid references automation_triggers(id) on delete set null,
  user_id uuid references auth.users(id) on delete cascade,
  startup_id uuid references startups(id) on delete cascade,

  -- What was executed
  pack_id uuid references prompt_packs(id) on delete set null,
  playbook_id uuid references playbooks(id) on delete set null,

  -- Execution context
  trigger_event text,
  trigger_payload jsonb default '{}',

  -- Status tracking
  status text default 'pending' check (status in ('pending', 'running', 'completed', 'failed', 'cancelled', 'retrying')),
  started_at timestamptz,
  completed_at timestamptz,

  -- Results
  steps_completed int default 0,
  total_steps int default 0,
  outputs jsonb default '{}',
  applied_to jsonb default '[]', -- Records what was auto-applied

  -- Error handling
  error_message text,
  retry_attempt int default 0,

  created_at timestamptz default now()
);
comment on table automation_executions is 'Log of automation runs with status, outputs, and applied targets';

-- Automation chains (for multi-pack workflows)
create table if not exists automation_chains (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,

  -- Chain configuration
  steps jsonb not null default '[]',
  -- Format: [
  --   { "pack_id": "...", "condition": {...}, "on_success": "next", "on_failure": "stop" },
  --   { "pack_id": "...", "delay_seconds": 60 }
  -- ]

  -- Trigger settings
  trigger_event text,
  trigger_conditions jsonb default '{}',

  -- Status
  is_active boolean default true,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
comment on table automation_chains is 'Multi-step workflows (sequence of packs) with trigger and conditions';

-- Automation chain executions
create table if not exists chain_executions (
  id uuid primary key default gen_random_uuid(),
  chain_id uuid references automation_chains(id) on delete set null,
  user_id uuid references auth.users(id) on delete cascade,
  startup_id uuid references startups(id) on delete cascade,

  -- Progress tracking
  current_step int default 0,
  total_steps int default 0,
  status text default 'pending' check (status in ('pending', 'running', 'paused', 'completed', 'failed', 'cancelled')),

  -- Step results
  step_results jsonb default '[]',

  -- Timing
  started_at timestamptz,
  completed_at timestamptz,
  next_step_at timestamptz, -- For delayed steps

  created_at timestamptz default now()
);
comment on table chain_executions is 'Running state and results for automation chain runs';

-- Event log for trigger matching
create table if not exists automation_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  startup_id uuid references startups(id) on delete cascade,

  -- Event details
  event_name text not null,
  event_payload jsonb default '{}',
  source text, -- 'frontend', 'backend', 'webhook', 'system'

  -- Processing
  processed boolean default false,
  processed_at timestamptz,
  triggered_automations jsonb default '[]', -- IDs of triggered automations

  created_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_automation_triggers_event on automation_triggers(event_name) where is_active = true;
create index if not exists idx_automation_triggers_active on automation_triggers(is_active) where is_active = true;
create index if not exists idx_automation_executions_user on automation_executions(user_id, status);
create index if not exists idx_automation_executions_status on automation_executions(status) where status in ('pending', 'running', 'retrying');
create index if not exists idx_automation_events_unprocessed on automation_events(processed, created_at) where processed = false;
create index if not exists idx_chain_executions_status on chain_executions(status) where status in ('pending', 'running', 'paused');

-- Enable RLS
alter table automation_triggers enable row level security;
alter table automation_executions enable row level security;
alter table automation_chains enable row level security;
alter table chain_executions enable row level security;
alter table automation_events enable row level security;

-- RLS Policies (TO authenticated for logged-in users only)
create policy "Users can view active triggers"
  on automation_triggers for select to authenticated
  using (is_active = true);

create policy "Users can view own executions"
  on automation_executions for select to authenticated
  using (user_id = auth.uid());

create policy "Users can view active chains"
  on automation_chains for select to authenticated
  using (is_active = true);

create policy "Users can view own chain executions"
  on chain_executions for select to authenticated
  using (user_id = auth.uid());

create policy "Users can create own events"
  on automation_events for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can view own events"
  on automation_events for select to authenticated
  using (user_id = auth.uid());

-- =====================================================
-- AUTOMATION FUNCTIONS
-- =====================================================

-- Helper: Get user's startup ID via org
create or replace function get_user_startup_id(p_user_id uuid)
returns uuid
language sql stable
security definer
as $$
  select s.id
  from startups s
  join profiles p on p.org_id = s.org_id
  where p.id = p_user_id
  limit 1;
$$;

comment on function get_user_startup_id is 'Get the first startup for a user via their org membership';
grant execute on function get_user_startup_id(uuid) to authenticated;

-- Function to emit an automation event
create or replace function emit_automation_event(
  p_event_name text,
  p_payload jsonb default '{}',
  p_source text default 'frontend'
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_event_id uuid;
  v_user_id uuid := auth.uid();
  v_startup_id uuid;
begin
  -- Get user's startup via org (startups have org_id, not user_id)
  select s.id into v_startup_id
  from startups s
  join profiles p on p.org_id = s.org_id
  where p.id = v_user_id
  limit 1;

  -- Insert event
  insert into automation_events (user_id, startup_id, event_name, event_payload, source)
  values (v_user_id, v_startup_id, p_event_name, p_payload, p_source)
  returning id into v_event_id;

  -- Notify for real-time processing
  perform pg_notify('automation_event', json_build_object(
    'event_id', v_event_id,
    'event_name', p_event_name,
    'user_id', v_user_id
  )::text);

  return v_event_id;
end;
$$;

-- Function to find matching triggers for an event
create or replace function find_matching_triggers(
  p_event_name text,
  p_payload jsonb default '{}'
)
returns table (
  trigger_id uuid,
  trigger_name text,
  pack_id uuid,
  playbook_id uuid,
  execution_mode text,
  auto_apply_outputs boolean,
  output_targets jsonb
)
language plpgsql
security definer
as $$
begin
  return query
  select
    t.id as trigger_id,
    t.name as trigger_name,
    t.pack_id,
    t.playbook_id,
    t.execution_mode,
    t.auto_apply_outputs,
    t.output_targets
  from automation_triggers t
  where t.is_active = true
    and t.trigger_type = 'event'
    and t.event_name = p_event_name
    and (
      t.condition_rules = '{}'::jsonb
      or check_condition_rules(t.condition_rules, p_payload)
    );
end;
$$;

-- Function to check condition rules against payload
create or replace function check_condition_rules(
  p_rules jsonb,
  p_payload jsonb
)
returns boolean
language plpgsql
immutable
as $$
declare
  v_rule record;
  v_field_value jsonb;
begin
  -- Empty rules = always match
  if p_rules is null or p_rules = '{}'::jsonb then
    return true;
  end if;

  -- Check each rule
  for v_rule in select * from jsonb_each(p_rules)
  loop
    v_field_value := p_payload -> v_rule.key;

    -- Handle different comparison types
    if jsonb_typeof(v_rule.value) = 'object' then
      -- Complex rule: { "operator": ">=", "value": 70 }
      if v_rule.value ? 'operator' then
        case v_rule.value->>'operator'
          when '=' then
            if v_field_value is distinct from v_rule.value->'value' then
              return false;
            end if;
          when '!=' then
            if v_field_value is not distinct from v_rule.value->'value' then
              return false;
            end if;
          when '>' then
            if (v_field_value::text)::numeric <= (v_rule.value->>'value')::numeric then
              return false;
            end if;
          when '>=' then
            if (v_field_value::text)::numeric < (v_rule.value->>'value')::numeric then
              return false;
            end if;
          when '<' then
            if (v_field_value::text)::numeric >= (v_rule.value->>'value')::numeric then
              return false;
            end if;
          when '<=' then
            if (v_field_value::text)::numeric > (v_rule.value->>'value')::numeric then
              return false;
            end if;
          when 'contains' then
            if not (v_field_value::text ilike '%' || (v_rule.value->>'value') || '%') then
              return false;
            end if;
          when 'in' then
            if not (v_field_value <@ v_rule.value->'value') then
              return false;
            end if;
          else
            -- Unknown operator, skip
            null;
        end case;
      end if;
    else
      -- Simple equality check
      if v_field_value is distinct from v_rule.value then
        return false;
      end if;
    end if;
  end loop;

  return true;
end;
$$;

-- Function to start an automation execution
create or replace function start_automation_execution(
  p_trigger_id uuid,
  p_event_payload jsonb default '{}'
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_execution_id uuid;
  v_trigger record;
  v_user_id uuid := auth.uid();
  v_startup_id uuid;
  v_total_steps int;
begin
  -- Get trigger details
  select * into v_trigger
  from automation_triggers
  where id = p_trigger_id and is_active = true;

  if not found then
    raise exception 'Trigger not found or inactive';
  end if;

  -- Get user's startup via org (startups have org_id, not user_id)
  select s.id into v_startup_id
  from startups s
  join profiles p on p.org_id = s.org_id
  where p.id = v_user_id
  limit 1;

  -- Count steps
  if v_trigger.pack_id is not null then
    select count(*) into v_total_steps
    from prompt_pack_steps
    where pack_id = v_trigger.pack_id;
  elsif v_trigger.playbook_id is not null then
    select count(*) into v_total_steps
    from playbook_steps
    where playbook_id = v_trigger.playbook_id;
  else
    v_total_steps := 0;
  end if;

  -- Create execution record
  insert into automation_executions (
    trigger_id, user_id, startup_id, pack_id, playbook_id,
    trigger_event, trigger_payload, status, started_at, total_steps
  )
  values (
    p_trigger_id, v_user_id, v_startup_id, v_trigger.pack_id, v_trigger.playbook_id,
    v_trigger.event_name, p_event_payload, 'running', now(), v_total_steps
  )
  returning id into v_execution_id;

  return v_execution_id;
end;
$$;

-- Function to update execution status
create or replace function update_automation_execution(
  p_execution_id uuid,
  p_status text,
  p_steps_completed int default null,
  p_outputs jsonb default null,
  p_applied_to jsonb default null,
  p_error_message text default null
)
returns void
language plpgsql
security definer
as $$
begin
  update automation_executions
  set
    status = coalesce(p_status, status),
    steps_completed = coalesce(p_steps_completed, steps_completed),
    outputs = coalesce(p_outputs, outputs),
    applied_to = coalesce(p_applied_to, applied_to),
    error_message = p_error_message,
    completed_at = case when p_status in ('completed', 'failed', 'cancelled') then now() else completed_at end
  where id = p_execution_id
    and user_id = auth.uid();
end;
$$;

-- Function to get pending automations for processing
create or replace function get_pending_automations()
returns table (
  execution_id uuid,
  trigger_id uuid,
  user_id uuid,
  startup_id uuid,
  pack_id uuid,
  playbook_id uuid,
  trigger_payload jsonb,
  retry_attempt int
)
language plpgsql
security definer
as $$
begin
  return query
  select
    e.id as execution_id,
    e.trigger_id,
    e.user_id,
    e.startup_id,
    e.pack_id,
    e.playbook_id,
    e.trigger_payload,
    e.retry_attempt
  from automation_executions e
  join automation_triggers t on t.id = e.trigger_id
  where e.status in ('pending', 'retrying')
    and (e.retry_attempt < t.retry_count or e.retry_attempt = 0)
  order by e.created_at
  limit 10;
end;
$$;

-- =====================================================
-- STANDARD EVENTS
-- =====================================================

comment on table automation_events is 'Standard events:
- onboarding.started
- onboarding.step.completed (payload: { step: 1-4 })
- onboarding.completed
- profile.updated
- canvas.created
- canvas.updated
- canvas.validated
- pitch_deck.created
- pitch_deck.slide.generated
- validation.requested
- validation.completed (payload: { score: number })
- task.created
- task.completed
- deal.stage_changed (payload: { from: string, to: string })
- investor.matched
- document.uploaded
';
