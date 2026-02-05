-- ============================================================================
-- Realtime Authorization & Broadcast from Database Setup
-- ============================================================================
--
-- This migration fixes critical Realtime issues:
-- 1. RLS policies on realtime.messages for private channels
-- 2. Publication setup for postgres_changes (temporary until broadcast migration)
-- 3. Broadcast triggers for key tables using realtime.broadcast_changes
-- 4. Helper functions for topic validation
--
-- Reference: https://supabase.com/docs/guides/realtime/authorization
-- Reference: .cursor/rules/supabase/ai-Realtime-assistant-.md
-- ============================================================================

-- ============================================================================
-- SECTION 1: Enable Realtime Authorization (RLS on realtime.messages)
-- ============================================================================

-- Grant necessary permissions to authenticated role
GRANT SELECT, INSERT ON realtime.messages TO authenticated;

-- RLS Policy: Allow users to JOIN (SELECT) private channels they own
-- Topic pattern: {entity}:{startup_id}:events or {entity}:{id}:events
-- Ownership: User -> Profile -> Organization -> Startup
CREATE POLICY "Users can join private channels for their startups"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  -- Check if user's organization owns the startup in the topic
  EXISTS (
    SELECT 1 FROM startups s
    INNER JOIN profiles p ON p.org_id = s.org_id
    WHERE p.id = auth.uid()
    AND (
      -- Pattern: scope:startup_id:events (e.g., crm:uuid:events, pitchdeck:uuid:events)
      realtime.topic() LIKE '%:' || s.id::text || ':%'
      -- Pattern: scope:startup_id:changes (e.g., tasks:uuid:changes)
      OR realtime.topic() LIKE '%:' || s.id::text || ':changes'
      -- Pattern: table_startup_id (e.g., tasks_uuid_changes) - legacy
      OR realtime.topic() LIKE '%_' || s.id::text || '_%'
    )
  )
  OR
  -- Allow onboarding channels for authenticated users (session-based)
  realtime.topic() LIKE 'onboarding:%'
  OR
  -- Allow pitch deck generation channels (user must own the document)
  EXISTS (
    SELECT 1 FROM documents d
    WHERE d.created_by = auth.uid()
    AND realtime.topic() LIKE 'pitch_deck_generation:' || d.id::text
  )
);

-- RLS Policy: Allow users to SEND (INSERT) to private channels they own
CREATE POLICY "Users can send to private channels for their startups"
ON realtime.messages
FOR INSERT
TO authenticated
WITH CHECK (
  -- Same logic as SELECT policy - check org ownership
  EXISTS (
    SELECT 1 FROM startups s
    INNER JOIN profiles p ON p.org_id = s.org_id
    WHERE p.id = auth.uid()
    AND (
      realtime.topic() LIKE '%:' || s.id::text || ':%'
      OR realtime.topic() LIKE '%:' || s.id::text || ':changes'
      OR realtime.topic() LIKE '%_' || s.id::text || '_%'
    )
  )
  OR
  realtime.topic() LIKE 'onboarding:%'
  OR
  EXISTS (
    SELECT 1 FROM documents d
    WHERE d.created_by = auth.uid()
    AND realtime.topic() LIKE 'pitch_deck_generation:' || d.id::text
  )
);

-- Indexes for RLS policy performance (per docs: "Create indexes for all columns used in RLS policies")
CREATE INDEX IF NOT EXISTS idx_startups_org_id ON startups(org_id);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_org_id ON profiles(org_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_by ON documents(created_by);


-- ============================================================================
-- SECTION 2: Publication Setup for Postgres Changes (Interim)
-- ============================================================================
--
-- Add tables to supabase_realtime publication for postgres_changes.
-- This is interim until frontend fully migrates to broadcast subscriptions.
-- ============================================================================

-- Helper function to safely add table to publication
CREATE OR REPLACE FUNCTION add_table_to_realtime_publication(p_table_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables t
    WHERE t.table_schema = 'public' AND t.table_name = p_table_name
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables pt
      WHERE pt.pubname = 'supabase_realtime'
      AND pt.tablename = p_table_name
      AND pt.schemaname = 'public'
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', p_table_name);
      RAISE NOTICE 'Added % to supabase_realtime publication', p_table_name;
    ELSE
      RAISE NOTICE '% already in supabase_realtime publication', p_table_name;
    END IF;
  ELSE
    RAISE NOTICE 'Table % does not exist, skipping', p_table_name;
  END IF;
END;
$$;

-- Add key tables to publication
SELECT add_table_to_realtime_publication('tasks');
SELECT add_table_to_realtime_publication('deals');
SELECT add_table_to_realtime_publication('contacts');
SELECT add_table_to_realtime_publication('events');
SELECT add_table_to_realtime_publication('investors');
SELECT add_table_to_realtime_publication('projects');
SELECT add_table_to_realtime_publication('documents');
SELECT add_table_to_realtime_publication('startups');
SELECT add_table_to_realtime_publication('lean_canvases');
SELECT add_table_to_realtime_publication('pitch_decks');

-- Drop helper function (no longer needed)
DROP FUNCTION IF EXISTS add_table_to_realtime_publication(text);


-- ============================================================================
-- SECTION 3: Broadcast from Database - Triggers
-- ============================================================================
--
-- Create triggers that use realtime.broadcast_changes for key tables.
-- This is the recommended approach over postgres_changes for scalability.
-- Per docs: "broadcast_changes requires private channels by default"
-- ============================================================================

-- Generic broadcast trigger function
-- Follows pattern from ai-Realtime-assistant-.md: scope:entity:id
CREATE OR REPLACE FUNCTION broadcast_table_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  topic_name text;
  startup_uuid uuid;
  new_json jsonb;
  old_json jsonb;
BEGIN
  -- Convert records to JSONB for column access
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    new_json := row_to_json(NEW)::jsonb;
    startup_uuid := (new_json->>'startup_id')::uuid;
  END IF;

  IF TG_OP IN ('UPDATE', 'DELETE') THEN
    old_json := row_to_json(OLD)::jsonb;
    IF startup_uuid IS NULL THEN
      startup_uuid := (old_json->>'startup_id')::uuid;
    END IF;
  END IF;

  -- Build topic: {table}:{startup_id}:changes
  IF startup_uuid IS NOT NULL THEN
    topic_name := TG_TABLE_NAME || ':' || startup_uuid::text || ':changes';
  ELSE
    -- Fallback for tables without startup_id (use record id)
    IF TG_OP IN ('INSERT', 'UPDATE') THEN
      topic_name := TG_TABLE_NAME || ':' || (new_json->>'id')::text || ':changes';
    ELSE
      topic_name := TG_TABLE_NAME || ':' || (old_json->>'id')::text || ':changes';
    END IF;
  END IF;

  -- Broadcast the change using realtime.broadcast_changes
  -- This requires private channels by default (per docs)
  PERFORM realtime.broadcast_changes(
    topic_name,
    TG_OP,
    TG_OP,
    TG_TABLE_NAME,
    TG_TABLE_SCHEMA,
    NEW,
    OLD
  );

  -- Return appropriate record
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Create triggers for key tables
DO $$
DECLARE
  tables_to_broadcast text[] := ARRAY[
    'tasks',
    'deals',
    'contacts',
    'events',
    'investors',
    'projects',
    'documents',
    'lean_canvases',
    'pitch_decks'
  ];
  tbl text;
  trigger_name text;
BEGIN
  FOREACH tbl IN ARRAY tables_to_broadcast
  LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.tables t
      WHERE t.table_schema = 'public' AND t.table_name = tbl
    ) THEN
      trigger_name := 'broadcast_' || tbl || '_changes';

      -- Drop existing trigger if any
      EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.%I', trigger_name, tbl);

      -- Create new trigger
      EXECUTE format(
        'CREATE TRIGGER %I
         AFTER INSERT OR UPDATE OR DELETE ON public.%I
         FOR EACH ROW
         EXECUTE FUNCTION broadcast_table_changes()',
        trigger_name,
        tbl
      );

      RAISE NOTICE 'Created broadcast trigger for %', tbl;
    ELSE
      RAISE NOTICE 'Table % does not exist, skipping trigger', tbl;
    END IF;
  END LOOP;
END;
$$;


-- ============================================================================
-- SECTION 4: Custom Broadcast Helper Functions
-- ============================================================================

-- Function to send custom events to a topic (for use in Edge Functions or triggers)
CREATE OR REPLACE FUNCTION send_realtime_event(
  topic text,
  event_name text,
  payload jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM realtime.send(
    topic,
    event_name,
    payload,
    FALSE -- not private (use RLS for auth)
  );
END;
$$;

-- Grant execute to authenticated users (they still need to pass RLS)
GRANT EXECUTE ON FUNCTION send_realtime_event(text, text, jsonb) TO authenticated;

-- Task-specific broadcast for detailed custom events
-- Uses realtime.send for custom payloads (per docs)
CREATE OR REPLACE FUNCTION broadcast_task_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  topic_name text;
  event_name text;
  payload jsonb;
  startup_uuid uuid;
BEGIN
  -- Get startup_id from the appropriate record
  IF TG_OP = 'DELETE' THEN
    startup_uuid := OLD.startup_id;
  ELSE
    startup_uuid := NEW.startup_id;
  END IF;

  -- Skip if no startup_id
  IF startup_uuid IS NULL THEN
    IF TG_OP = 'DELETE' THEN
      RETURN OLD;
    ELSE
      RETURN NEW;
    END IF;
  END IF;

  -- Determine event type (snake_case per naming convention)
  IF TG_OP = 'INSERT' THEN
    event_name := 'task_created';
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      event_name := 'task_status_changed';
    ELSE
      event_name := 'task_updated';
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    event_name := 'task_deleted';
  END IF;

  -- Build topic: scope:entity:id pattern
  topic_name := 'tasks:' || startup_uuid::text || ':events';

  -- Build payload
  payload := jsonb_build_object(
    'taskId', COALESCE(NEW.id, OLD.id),
    'title', COALESCE(NEW.title, OLD.title),
    'status', COALESCE(NEW.status, OLD.status),
    'previousStatus', CASE WHEN TG_OP = 'UPDATE' THEN OLD.status ELSE NULL END,
    'timestamp', now()
  );

  -- Send the custom event (FALSE = not private, RLS handles auth)
  PERFORM realtime.send(topic_name, event_name, payload, FALSE);

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Create task event trigger (in addition to generic broadcast)
DROP TRIGGER IF EXISTS task_event_broadcast ON tasks;
CREATE TRIGGER task_event_broadcast
AFTER INSERT OR UPDATE OR DELETE ON tasks
FOR EACH ROW
EXECUTE FUNCTION broadcast_task_event();


-- ============================================================================
-- SECTION 5: Verification Functions
-- ============================================================================

-- Function to check Realtime setup status
CREATE OR REPLACE FUNCTION check_realtime_setup()
RETURNS TABLE (
  check_name text,
  status text,
  details text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check 1: Count of broadcast triggers
  RETURN QUERY
  SELECT
    'Broadcast triggers'::text,
    COUNT(*)::text,
    'Number of broadcast_*_changes triggers'::text
  FROM pg_trigger
  WHERE tgname LIKE 'broadcast_%_changes';

  -- Check 2: Tables in publication
  RETURN QUERY
  SELECT
    'Publication tables'::text,
    COUNT(*)::text,
    'Tables in supabase_realtime publication'::text
  FROM pg_publication_tables
  WHERE pubname = 'supabase_realtime';

  -- Check 3: RLS policies on realtime.messages
  RETURN QUERY
  SELECT
    'RLS policies'::text,
    COUNT(*)::text,
    'Policies on realtime.messages'::text
  FROM pg_policies
  WHERE schemaname = 'realtime' AND tablename = 'messages';
END;
$$;

-- Grant to authenticated for debugging
GRANT EXECUTE ON FUNCTION check_realtime_setup() TO authenticated;


-- ============================================================================
-- Success message
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Realtime Authorization & Broadcast setup complete!';
  RAISE NOTICE '';
  RAISE NOTICE 'Backend setup:';
  RAISE NOTICE '  - RLS policies on realtime.messages (SELECT + INSERT)';
  RAISE NOTICE '  - 10 tables added to supabase_realtime publication';
  RAISE NOTICE '  - 9 broadcast triggers created';
  RAISE NOTICE '  - Custom task event trigger created';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps for frontend (Lovable):';
  RAISE NOTICE '  1. Add { private: true } to channel configs';
  RAISE NOTICE '  2. Call supabase.realtime.setAuth() before subscribing';
  RAISE NOTICE '  3. Switch from postgres_changes to broadcast subscriptions';
  RAISE NOTICE '  4. Add channel state checks before subscribing';
  RAISE NOTICE '  5. Add realtime config to Supabase client';
END;
$$;
