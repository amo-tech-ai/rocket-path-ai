-- =============================================================================
-- Migration: 20260204101600_add_performance_indexes.sql
-- Description: Add missing indexes and materialized views for performance
-- Affected Tables: tasks, lean_canvases, activities, chat_sessions, ai_runs
-- Purpose: Optimize common query patterns identified in optimization audit
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

-- filter by category and phase
create index if not exists idx_tasks_category_phase
on public.tasks(startup_id, category, phase);

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

-- user's recent sessions
create index if not exists idx_chat_sessions_user_recent
on public.chat_sessions(user_id, started_at desc);

-- sessions by startup
create index if not exists idx_chat_sessions_startup
on public.chat_sessions(startup_id, started_at desc)
where startup_id is not null;

-- message history within session
create index if not exists idx_chat_messages_session_created
on public.chat_messages(session_id, created_at);

-- filter messages by tab
create index if not exists idx_chat_messages_session_tab
on public.chat_messages(session_id, tab, created_at desc);

-- =============================================================================
-- 5. AI RUNS INDEXES
-- =============================================================================

-- cost tracking by org
create index if not exists idx_ai_runs_org_created
on public.ai_runs(org_id, created_at desc);

-- cost tracking by agent
create index if not exists idx_ai_runs_agent_created
on public.ai_runs(agent_name, created_at desc);

-- find errors for debugging
create index if not exists idx_ai_runs_errors
on public.ai_runs(org_id, created_at desc)
where status = 'error';

-- usage by startup
create index if not exists idx_ai_runs_startup
on public.ai_runs(startup_id, created_at desc)
where startup_id is not null;

-- =============================================================================
-- 6. DEAL INDEXES
-- =============================================================================

-- pipeline view (by stage)
create index if not exists idx_deals_pipeline
on public.deals(startup_id, stage, expected_close);

-- active deals only
create index if not exists idx_deals_active
on public.deals(startup_id, stage, amount desc)
where is_active = true;

-- =============================================================================
-- 7. CONTACT INDEXES
-- =============================================================================

-- filter by type
create index if not exists idx_contacts_type
on public.contacts(startup_id, type);

-- recently contacted
create index if not exists idx_contacts_last_contacted
on public.contacts(startup_id, last_contacted_at desc);

-- =============================================================================
-- 8. DOCUMENT INDEXES
-- =============================================================================

-- filter by type
create index if not exists idx_documents_type
on public.documents(startup_id, type, created_at desc);

-- ai-generated documents
create index if not exists idx_documents_ai_generated
on public.documents(startup_id, created_at desc)
where ai_generated = true;

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

-- this materialized view pre-aggregates common dashboard metrics
-- refresh periodically (every 5 minutes via cron or on-demand)
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
  count(distinct d.id) filter (where d.is_active = true) as active_deals,
  coalesce(sum(d.amount) filter (where d.stage = 'won'), 0) as revenue_won,
  coalesce(sum(d.amount) filter (where d.is_active = true), 0) as pipeline_value,

  -- contact metrics
  count(distinct c.id) as total_contacts,
  count(distinct c.id) filter (
    where c.last_contacted_at > now() - interval '30 days'
  ) as contacts_active_30d,

  -- document metrics
  count(distinct doc.id) as total_documents,
  count(distinct doc.id) filter (where doc.ai_generated = true) as ai_documents,

  -- canvas metrics
  (select completeness_score from public.lean_canvases lc
   where lc.startup_id = s.id and lc.is_current = true
   limit 1) as canvas_completeness,

  -- deck metrics
  (select signal_strength from public.pitch_decks pd
   where pd.startup_id = s.id and pd.status in ('draft', 'active')
   order by pd.updated_at desc limit 1) as deck_signal_strength,

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

-- function to refresh the materialized view
create or replace function public.refresh_startup_metrics()
returns void as $$
begin
  refresh materialized view concurrently public.mv_startup_metrics;
end;
$$ language plpgsql security definer;

-- grant execute to authenticated users (they can trigger refresh)
grant execute on function public.refresh_startup_metrics() to authenticated;

-- =============================================================================
-- 12. COMMENTS
-- =============================================================================

comment on materialized view public.mv_startup_metrics is
'Pre-aggregated dashboard metrics per startup. Refresh every 5 minutes or on-demand.';

comment on function public.refresh_startup_metrics() is
'Refreshes the mv_startup_metrics materialized view concurrently (non-blocking).';

-- =============================================================================
-- 13. OPTIONAL: CRON JOB FOR AUTO-REFRESH
-- =============================================================================

-- uncomment the following if pg_cron extension is enabled:
-- select cron.schedule(
--   'refresh-startup-metrics',
--   '*/5 * * * *',  -- every 5 minutes
--   $$select public.refresh_startup_metrics()$$
-- );
