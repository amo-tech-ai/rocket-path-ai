-- Integration tests for the validator watchdog + agent-run constraint fixes.
-- Run with: psql "$DBURL" -v ON_ERROR_STOP=1 -f supabase/tests/validator_watchdog_and_agent_runs_test.sql
-- Designed to be re-runnable: wraps everything in a rollback-only transaction.

\set ON_ERROR_STOP on

begin;

-- ----------------------------------------------------------------
-- Set up: create an auth.users row so RLS FKs are satisfied.
-- ----------------------------------------------------------------
do $$
declare
  v_user uuid := gen_random_uuid();
begin
  insert into auth.users (id, email, instance_id, aud, role)
  values (v_user, 'watchdog-test+' || v_user || '@sunai.one', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated');
  perform set_config('test.user_id', v_user::text, true);
end $$;

-- ----------------------------------------------------------------
-- Test 1: long agent_name + 'completed' status now insert cleanly.
-- ----------------------------------------------------------------
do $$
declare
  v_user uuid := current_setting('test.user_id')::uuid;
  v_sid  uuid;
  v_count int;
begin
  insert into public.validator_sessions (user_id, input_text, status)
  values (v_user, 'test idea for watchdog regression', 'running')
  returning id into v_sid;

  -- All seven long names + 'queued'
  insert into public.validator_agent_runs (session_id, agent_name, status)
  values
    (v_sid, 'ExtractorAgent',  'queued'),
    (v_sid, 'ResearchAgent',   'queued'),
    (v_sid, 'CompetitorAgent', 'queued'),
    (v_sid, 'ScoringAgent',    'queued'),
    (v_sid, 'MVPAgent',        'queued'),
    (v_sid, 'ComposerAgent',   'queued'),
    (v_sid, 'VerifierAgent',   'queued');

  select count(*) into v_count from public.validator_agent_runs where session_id = v_sid;
  if v_count <> 7 then
    raise exception 'Test 1 FAIL: expected 7 agent runs, got %', v_count;
  end if;

  -- 'completed' status (used by completeAgentRun) must be accepted.
  update public.validator_agent_runs
    set status = 'completed', ended_at = now(), duration_ms = 1234
    where session_id = v_sid and agent_name = 'ExtractorAgent';

  select count(*) into v_count
    from public.validator_agent_runs
    where session_id = v_sid and status = 'completed';
  if v_count <> 1 then
    raise exception 'Test 1 FAIL: status=completed was not persisted';
  end if;

  raise notice 'Test 1 PASS: long agent_name + completed status accepted';

  perform set_config('test.session_recent', v_sid::text, true);
end $$;

-- ----------------------------------------------------------------
-- Test 2: zombie session older than threshold is reaped.
-- ----------------------------------------------------------------
do $$
declare
  v_user uuid := current_setting('test.user_id')::uuid;
  v_sid  uuid;
  v_status text;
  v_err    text;
begin
  insert into public.validator_sessions (user_id, input_text, status, created_at)
  values (v_user, 'zombie session', 'running', now() - interval '20 minutes')
  returning id into v_sid;

  perform public.mark_zombie_validator_sessions(7);

  select status, error_message into v_status, v_err
    from public.validator_sessions where id = v_sid;

  if v_status <> 'failed' then
    raise exception 'Test 2 FAIL: expected status=failed, got %', v_status;
  end if;
  if v_err is null or v_err = '' then
    raise exception 'Test 2 FAIL: expected error_message to be set';
  end if;

  raise notice 'Test 2 PASS: zombie session reaped (status=%, err=%)', v_status, left(v_err, 60);
end $$;

-- ----------------------------------------------------------------
-- Test 3: recent running session is NOT touched by watchdog.
-- ----------------------------------------------------------------
do $$
declare
  v_user uuid := current_setting('test.user_id')::uuid;
  v_sid  uuid;
  v_status text;
begin
  insert into public.validator_sessions (user_id, input_text, status, created_at)
  values (v_user, 'fresh running session', 'running', now() - interval '30 seconds')
  returning id into v_sid;

  perform public.mark_zombie_validator_sessions(7);

  select status into v_status from public.validator_sessions where id = v_sid;
  if v_status <> 'running' then
    raise exception 'Test 3 FAIL: fresh session should still be running, got %', v_status;
  end if;
  raise notice 'Test 3 PASS: fresh session left untouched';
end $$;

-- ----------------------------------------------------------------
-- Test 4: error_message preserved when already set (idempotent).
-- ----------------------------------------------------------------
do $$
declare
  v_user uuid := current_setting('test.user_id')::uuid;
  v_sid  uuid;
  v_err  text;
begin
  insert into public.validator_sessions (user_id, input_text, status, created_at, error_message)
  values (v_user, 'session with existing error', 'running', now() - interval '15 minutes', 'original error from agent');

  -- have to read back the id
  select id into v_sid from public.validator_sessions where input_text = 'session with existing error';

  perform public.mark_zombie_validator_sessions(7);

  select error_message into v_err from public.validator_sessions where id = v_sid;
  if v_err <> 'original error from agent' then
    raise exception 'Test 4 FAIL: existing error_message overwritten (got %)', v_err;
  end if;
  raise notice 'Test 4 PASS: existing error_message preserved';
end $$;

-- ----------------------------------------------------------------
-- Test 5: pg_cron job is scheduled and active.
-- ----------------------------------------------------------------
do $$
declare
  v_active boolean;
  v_schedule text;
begin
  select active, schedule into v_active, v_schedule
    from cron.job where jobname = 'validator-zombie-watchdog';
  if v_active is null then
    raise exception 'Test 5 FAIL: cron job validator-zombie-watchdog is not scheduled';
  end if;
  if v_active is false then
    raise exception 'Test 5 FAIL: cron job exists but is not active';
  end if;
  raise notice 'Test 5 PASS: cron job active (schedule=%)', v_schedule;
end $$;

-- ----------------------------------------------------------------
-- Always rollback so the test is reusable.
-- ----------------------------------------------------------------
rollback;

\echo 'All validator watchdog + agent-runs tests PASSED'
