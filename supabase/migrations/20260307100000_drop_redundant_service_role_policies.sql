-- Drop redundant RLS policies for service_role.
-- Best practice: service_role bypasses RLS (BYPASSRLS); explicit policies are unnecessary.
-- See .cursor/rules/supabase/supabase-create-rls-policies.mdc
-- Wrapped in DO block: some tables may have been dropped by earlier migrations
-- (e.g. interview_questions by canvas_p0_cleanup, validation_* by drop_legacy).

do $$
declare
  _tbl text;
  _pol text;
begin
  -- Array of (table_name, policy_name) pairs to drop
  for _tbl, _pol in
    values
      ('weekly_reviews',          'reviews_service'),
      ('interview_questions',     'interview_questions_service_role'),
      ('workflows',               'service role full access workflows'),
      ('workflow_triggers',       'service role full access workflow triggers'),
      ('workflow_actions',        'service role full access workflow actions'),
      ('workflow_queue',          'service role full access workflow queue'),
      ('workflow_runs',           'service role full access workflow runs'),
      ('validation_experiments',  'service role full access validation experiments'),
      ('validation_conversations','service role full access validation conversations'),
      ('metric_snapshots',        'service role full access metric snapshots'),
      ('knowledge_chunks',        'service role can manage knowledge'),
      ('workflow_activity_log',   'Service role full access to workflow_activity_log'),
      ('decisions',               'decisions_service'),
      ('decision_evidence',       'evidence_service'),
      ('shareable_links',         'links_service'),
      ('ai_usage_limits',         'limits_service'),
      ('knowledge_documents',     'service_role can manage knowledge_documents')
  loop
    -- Only drop if the table still exists (some dropped by earlier cleanup migrations)
    if exists (
      select 1 from information_schema.tables
      where table_schema = 'public' and table_name = _tbl
    ) then
      execute format('drop policy if exists %I on public.%I', _pol, _tbl);
    end if;
  end loop;
end
$$;
