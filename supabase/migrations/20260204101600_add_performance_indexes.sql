-- =============================================================================
-- Migration: 20260204101600_add_performance_indexes.sql
-- Description: Add missing indexes for performance
-- Affected Tables: tasks, lean_canvases, activities, chat_sessions, ai_runs
-- Purpose: Optimize common query patterns
-- NOTE: Some indexes from original migration skipped because the underlying
--       columns only exist in production (created via dashboard, not migrations).
--       Ghost columns: tasks.category, tasks.phase, documents.ai_generated,
--       contacts.last_contacted_at, deals.is_active, deals.expected_close,
--       pitch_decks.signal_strength, pitch_decks.slide_count
-- =============================================================================

-- =============================================================================
-- 1. TASK INDEXES
-- =============================================================================

-- most common query: filter tasks by startup, status, and priority
create index if not exists idx_tasks_startup_status_priority
on public.tasks(startup_id, status, priority);

-- filter tasks by assignee (user's task list)
create index if not exists idx_tasks_assigned_status
on public.tasks(assigned_to, status)
where assigned_to is not null;

-- find overdue tasks
create index if not exists idx_tasks_overdue
on public.tasks(startup_id, due_at)
where status not in ('completed', 'cancelled') and due_at is not null;

-- tasks.category and tasks.phase — SKIPPED (columns exist in prod only)

-- =============================================================================
-- 2. LEAN CANVAS INDEXES
-- =============================================================================

-- find current canvas for a startup
create index if not exists idx_lean_canvases_current
on public.lean_canvases(startup_id, is_current)
where is_current = true;

-- version history lookup
create index if not exists idx_lean_canvases_versions
on public.lean_canvases(startup_id, version desc);

-- =============================================================================
-- 3. ACTIVITY INDEXES
-- =============================================================================

-- activity feed (most recent first)
create index if not exists idx_activities_startup_created
on public.activities(startup_id, created_at desc);

-- filter by entity type
create index if not exists idx_activities_entity
on public.activities(startup_id, entity_type, entity_id);

-- filter by activity type
create index if not exists idx_activities_type
on public.activities(startup_id, activity_type, created_at desc);

-- =============================================================================
-- 4. CHAT INDEXES
-- =============================================================================

-- user's recent sessions (chat_sessions uses created_at, not started_at)
create index if not exists idx_chat_sessions_user_recent
on public.chat_sessions(user_id, created_at desc);

-- sessions by startup
create index if not exists idx_chat_sessions_startup
on public.chat_sessions(startup_id, created_at desc)
where startup_id is not null;

-- message history within session
create index if not exists idx_chat_messages_session_created
on public.chat_messages(session_id, created_at);

-- chat_messages.tab — SKIPPED (column exists in prod only)

-- =============================================================================
-- 5. AI RUNS INDEXES
-- =============================================================================

-- ai_runs.org_id, ai_runs.agent_name — SKIPPED (columns exist in prod only)
-- ai_runs uses agent_type (not agent_name) and has no org_id column

-- usage by startup
create index if not exists idx_ai_runs_startup
on public.ai_runs(startup_id, created_at desc)
where startup_id is not null;

-- find errors for debugging
create index if not exists idx_ai_runs_errors
on public.ai_runs(status, created_at desc)
where status = 'failed';

-- cost tracking by agent type
create index if not exists idx_ai_runs_agent_created
on public.ai_runs(agent_type, created_at desc);

-- =============================================================================
-- 6. DEAL INDEXES (only using columns from base schema)
-- =============================================================================

-- pipeline view (by stage)
create index if not exists idx_deals_pipeline
on public.deals(startup_id, stage);

-- =============================================================================
-- 7. CONTACT INDEXES (only using columns from base schema)
-- =============================================================================

-- filter by type
create index if not exists idx_contacts_type
on public.contacts(startup_id, type);

-- =============================================================================
-- 8. DOCUMENT INDEXES (only using columns from base schema)
-- =============================================================================

-- filter by type
create index if not exists idx_documents_type
on public.documents(startup_id, type, created_at desc);

-- documents.ai_generated — SKIPPED (column exists in prod only)

-- =============================================================================
-- 9. PITCH DECK INDEXES
-- =============================================================================

-- active decks
create index if not exists idx_pitch_decks_active
on public.pitch_decks(startup_id, updated_at desc)
where status in ('draft', 'active');

-- =============================================================================
-- 10. MATERIALIZED VIEW: startup_metrics
-- =============================================================================

-- simplified view using only columns that exist in migrations
create materialized view if not exists public.mv_startup_metrics as
select
  s.id as startup_id,
  s.org_id,
  s.name as startup_name,

  -- task metrics
  count(distinct t.id) filter (where t.status = 'completed') as tasks_completed,
  count(distinct t.id) filter (where t.status = 'pending') as tasks_pending,
  count(distinct t.id) filter (where t.status = 'in_progress') as tasks_in_progress,
  count(distinct t.id) filter (
    where t.status not in ('completed', 'cancelled')
    and t.due_at < now()
  ) as tasks_overdue,

  -- deal metrics
  count(distinct d.id) as total_deals,
  coalesce(sum(d.amount) filter (where d.stage = 'won'), 0) as revenue_won,

  -- contact metrics
  count(distinct c.id) as total_contacts,

  -- document metrics
  count(distinct doc.id) as total_documents,

  -- canvas metrics
  (select completeness_score from public.lean_canvases lc
   where lc.startup_id = s.id and lc.is_current = true
   limit 1) as canvas_completeness,

  -- activity metrics
  max(a.created_at) as last_activity_at,
  count(distinct a.id) filter (
    where a.created_at > now() - interval '7 days'
  ) as activities_7d,

  -- metadata
  now() as refreshed_at

from public.startups s
left join public.tasks t on t.startup_id = s.id
left join public.deals d on d.startup_id = s.id
left join public.contacts c on c.startup_id = s.id
left join public.documents doc on doc.startup_id = s.id
left join public.activities a on a.startup_id = s.id
group by s.id, s.org_id, s.name;

-- index on the materialized view
create unique index if not exists idx_mv_startup_metrics_startup_id
on public.mv_startup_metrics(startup_id);

create index if not exists idx_mv_startup_metrics_org_id
on public.mv_startup_metrics(org_id);

-- =============================================================================
-- 11. REFRESH FUNCTION
-- =============================================================================

create or replace function public.refresh_startup_metrics()
returns void as $$
begin
  refresh materialized view concurrently public.mv_startup_metrics;
end;
$$ language plpgsql security definer;

grant execute on function public.refresh_startup_metrics() to authenticated;

comment on materialized view public.mv_startup_metrics is
'Pre-aggregated dashboard metrics per startup. Refresh every 5 minutes or on-demand.';

comment on function public.refresh_startup_metrics() is
'Refreshes the mv_startup_metrics materialized view concurrently (non-blocking).';
