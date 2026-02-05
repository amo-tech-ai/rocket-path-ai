-- =============================================================================
-- migration: 20260204100200_create_activities.sql
-- purpose: create activities table for audit trail and activity feeds
-- affected tables: activities
-- dependencies: startups, profiles
-- =============================================================================

-- =============================================================================
-- 1. table: activities
-- =============================================================================

-- activities tracks all user actions for audit trail and activity feeds
-- used for dashboard activity feed and change tracking
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  startup_id uuid not null references public.startups(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,

  -- activity details
  entity_type text not null, -- 'task', 'project', 'deal', 'canvas', 'document', etc.
  entity_id uuid not null,
  action text not null, -- 'created', 'updated', 'deleted', 'completed', 'assigned', etc.
  activity_type text, -- more specific action type for filtering

  -- change tracking
  changes jsonb, -- { "old": {...}, "new": {...} }
  metadata jsonb default '{}'::jsonb, -- additional context

  -- display
  title text, -- human-readable title for activity
  description text, -- detailed description

  -- timestamps
  created_at timestamptz not null default now()
  -- note: activities are immutable, no updated_at needed
);

-- add table comment
comment on table public.activities is 'Immutable activity log for audit trail and activity feeds.';
comment on column public.activities.entity_type is 'Type of entity that was acted upon: task, project, deal, canvas, document, etc.';
comment on column public.activities.action is 'Action performed: created, updated, deleted, completed, assigned, etc.';
comment on column public.activities.changes is 'JSONB with old and new values for tracking changes.';

-- =============================================================================
-- 2. indexes
-- =============================================================================

-- fk index on startup_id
create index if not exists idx_activities_startup_id
  on public.activities(startup_id);

-- activity feed (most recent first)
create index if not exists idx_activities_startup_created
  on public.activities(startup_id, created_at desc);

-- filter by entity type
create index if not exists idx_activities_entity
  on public.activities(startup_id, entity_type, entity_id);

-- filter by activity type
create index if not exists idx_activities_type
  on public.activities(startup_id, activity_type, created_at desc);

-- filter by user
create index if not exists idx_activities_user
  on public.activities(user_id, created_at desc)
  where user_id is not null;

-- =============================================================================
-- 3. row level security
-- =============================================================================

alter table public.activities enable row level security;

-- select: authenticated users can view activities for their org's startups
create policy "authenticated users can view activities"
  on public.activities
  for select
  to authenticated
  using (
    startup_id in (
      select s.id
      from public.startups s
      where s.org_id = (select public.user_org_id())
    )
  );

-- insert: authenticated users can create activities for their org's startups
create policy "authenticated users can create activities"
  on public.activities
  for insert
  to authenticated
  with check (
    startup_id in (
      select s.id
      from public.startups s
      where s.org_id = (select public.user_org_id())
    )
  );

-- note: activities are immutable - no update or delete policies
-- activities should only be created, never modified or deleted

-- service role: full access for system-generated activities
create policy "service role has full access to activities"
  on public.activities
  for all
  to service_role
  using (true)
  with check (true);

-- =============================================================================
-- 4. trigger function: log_activity
-- =============================================================================

-- this function can be called by triggers on other tables to auto-log activities
create or replace function public.log_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text;
  v_changes jsonb;
  v_startup_id uuid;
  v_title text;
begin
  -- determine action
  if tg_op = 'INSERT' then
    v_action := 'created';
    v_changes := to_jsonb(new);
    v_startup_id := new.startup_id;
    v_title := tg_table_name || ' created';
  elsif tg_op = 'UPDATE' then
    v_action := 'updated';
    -- track specific status changes
    if new.status is distinct from old.status then
      if new.status = 'done' or new.status = 'completed' then
        v_action := 'completed';
        v_title := tg_table_name || ' completed';
      else
        v_title := tg_table_name || ' status changed to ' || new.status;
      end if;
    else
      v_title := tg_table_name || ' updated';
    end if;
    v_changes := jsonb_build_object(
      'old', to_jsonb(old),
      'new', to_jsonb(new)
    );
    v_startup_id := new.startup_id;
  elsif tg_op = 'DELETE' then
    v_action := 'deleted';
    v_changes := to_jsonb(old);
    v_startup_id := old.startup_id;
    v_title := tg_table_name || ' deleted';
  end if;

  -- insert activity record
  insert into public.activities (
    startup_id,
    user_id,
    entity_type,
    entity_id,
    action,
    activity_type,
    changes,
    title
  )
  values (
    v_startup_id,
    auth.uid(),
    tg_table_name,
    coalesce(new.id, old.id),
    v_action,
    tg_op,
    v_changes,
    v_title
  );

  return coalesce(new, old);
end;
$$;

comment on function public.log_activity() is 'Trigger function to automatically log activities when tables change.';

-- =============================================================================
-- end of migration: 20260204100200_create_activities.sql
-- =============================================================================
