-- migration: validator_agent_runs_fixes_and_watchdog
-- description: Production-safe fixes for the validator pipeline:
--              (1) align CHECK constraints on validator_agent_runs with the values the
--                  Edge Function actually emits (long agent names + 'completed' status),
--              (2) add a scheduled watchdog (pg_cron) that auto-fails sessions stuck in
--                  'running' beyond a safety threshold so dead Deno isolates don't leave
--                  zombie rows that block the UI.
-- task_ref: tasks/audit/43-audit.md
-- depends_on: 20260210213839_create_validator_agent_runs.sql

-- =================================================================
-- 1) Fix CHECK constraint drift on validator_agent_runs
-- =================================================================
-- ROOT CAUSE: The original migration restricted agent_name to short tokens
-- ('extract','research','competitors','score','mvp','compose','verify'),
-- but supabase/functions/validator-start/index.ts (lines 154-159) inserts
-- the long names from AGENTS[k].name in config.ts ('ExtractorAgent', etc.).
-- Every pre-create insert silently failed, so the table stayed empty and
-- startAgentRun() updates matched zero rows.
--
-- FIX: Replace the constraint with one that accepts both forms so we can
-- evolve naming later without another migration, and add 'completed' to
-- the status set (used by completeAgentRun in supabase/functions/validator-start/db.ts).

alter table public.validator_agent_runs
  drop constraint if exists validator_agent_runs_agent_name_check;

alter table public.validator_agent_runs
  add constraint validator_agent_runs_agent_name_check
  check (agent_name in (
    -- long form (current code in supabase/functions/validator-start/config.ts)
    'ExtractorAgent','ResearchAgent','CompetitorAgent','ScoringAgent',
    'MVPAgent','ComposerAgent','VerifierAgent',
    -- short form (original migration vocabulary, kept for backward compatibility)
    'extract','research','competitors','score','mvp','compose','verify'
  ));

alter table public.validator_agent_runs
  drop constraint if exists validator_agent_runs_status_check;

alter table public.validator_agent_runs
  add constraint validator_agent_runs_status_check
  check (status in ('queued','running','ok','completed','failed','skipped'));

comment on constraint validator_agent_runs_agent_name_check on public.validator_agent_runs
  is 'Accepts both AGENTS[k].name long form (used by Edge Function) and the short tokens from the original migration.';

-- =================================================================
-- 2) Watchdog function + pg_cron schedule for zombie sessions
-- =================================================================
-- ROOT CAUSE: When Deno Deploy terminates the isolate mid-pipeline (wall-clock
-- limit, OOM, deploy rollover) the `try/catch/finally` blocks in
-- supabase/functions/validator-start/pipeline.ts never run, so
-- validator_sessions.status stays 'running' forever. The existing cleanup
-- in supabase/functions/validator-status/index.ts (lines 79-104) only
-- triggers when a client polls THAT specific session — so once the user
-- closes the tab, the zombie is permanent.
--
-- FIX: Move zombie reaping into the database via a SECURITY DEFINER function
-- + pg_cron schedule, so it runs regardless of client polling.

create extension if not exists pg_cron;

create or replace function public.mark_zombie_validator_sessions(timeout_minutes int default 7)
returns table (id uuid, age interval)
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Threshold: PIPELINE_TIMEOUT_MS (300s) in pipeline.ts + 120s buffer for DB writes / cron drift.
  -- Default = 7 minutes. Configurable per call.
  return query
  update public.validator_sessions s
    set status = 'failed',
        error_message = coalesce(
          nullif(s.error_message, ''),
          'Isolate killed by Deno Deploy (wall-clock limit) — auto-reaped by mark_zombie_validator_sessions'
        ),
        failed_steps = case
          when array_length(s.failed_steps, 1) is null then array['watchdog']
          else s.failed_steps
        end
  where s.status = 'running'
    and s.created_at < (now() - make_interval(mins => timeout_minutes))
  returning s.id, (now() - s.created_at) as age;
end;
$$;

comment on function public.mark_zombie_validator_sessions(int)
  is 'Marks any validator_sessions row stuck in status=running beyond the timeout as failed. Returns the affected ids. Called by the validator-zombie-watchdog pg_cron job every 2 minutes.';

-- Permissions: only postgres / service_role should invoke directly. RLS on
-- validator_sessions does not apply to SECURITY DEFINER functions owned by postgres.
revoke all on function public.mark_zombie_validator_sessions(int) from public;
grant execute on function public.mark_zombie_validator_sessions(int) to postgres, service_role;

-- Schedule: every 2 minutes. Idempotent — unschedule any prior version first.
do $$
declare
  v_jobid bigint;
begin
  select jobid into v_jobid from cron.job where jobname = 'validator-zombie-watchdog';
  if v_jobid is not null then
    perform cron.unschedule(v_jobid);
  end if;
end;
$$;

select cron.schedule(
  'validator-zombie-watchdog',
  '*/2 * * * *',
  $$select public.mark_zombie_validator_sessions(7);$$
);

-- =================================================================
-- 3) One-time backfill: reap existing zombies
-- =================================================================
-- Any sessions already stuck in 'running' for >7 minutes get marked failed
-- so the UI stops showing them as in-progress.
select public.mark_zombie_validator_sessions(7);
