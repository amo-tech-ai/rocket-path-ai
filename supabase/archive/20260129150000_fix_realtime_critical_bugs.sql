-- Fix 3 Critical Bugs in Realtime Setup
-- Reference: https://supabase.com/docs/guides/realtime/broadcast
-- Audit: tasks/realtime/03-realtime-audit.md

-- =============================================================================
-- FIX 1 & 2: send_realtime_event - correct argument order and is_private=TRUE
-- Correct: realtime.send(payload, event, topic, is_private)
-- =============================================================================
CREATE OR REPLACE FUNCTION send_realtime_event(
  topic text,
  event_name text,
  payload jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Correct order: payload, event, topic, is_private
  -- TRUE for private channels (clients use private: true)
  PERFORM realtime.send(payload, event_name, topic, TRUE);
END;
$$;

-- =============================================================================
-- FIX 1 & 2: broadcast_task_event - correct argument order and is_private=TRUE
-- =============================================================================
CREATE OR REPLACE FUNCTION broadcast_task_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  topic_name text;
  event_name text;
  payload jsonb;
  startup_uuid uuid;
BEGIN
  IF TG_OP = 'DELETE' THEN
    startup_uuid := OLD.startup_id;
  ELSE
    startup_uuid := NEW.startup_id;
  END IF;

  IF startup_uuid IS NULL THEN
    IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
  END IF;

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

  topic_name := 'tasks:' || startup_uuid::text || ':events';

  payload := jsonb_build_object(
    'taskId', COALESCE(NEW.id, OLD.id),
    'title', COALESCE(NEW.title, OLD.title),
    'status', COALESCE(NEW.status, OLD.status),
    'previousStatus', CASE WHEN TG_OP = 'UPDATE' THEN OLD.status ELSE NULL END,
    'timestamp', now()
  );

  -- Correct order: payload, event, topic, is_private=TRUE
  PERFORM realtime.send(payload, event_name, topic_name, TRUE);

  IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$;

-- =============================================================================
-- FIX 3: pitch_deck_generation RLS - use pitch_decks table (not documents)
-- =============================================================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can join private channels for their startups" ON realtime.messages;
DROP POLICY IF EXISTS "Users can send to private channels for their startups" ON realtime.messages;

-- Recreate SELECT policy with fixed pitch_decks check
CREATE POLICY "Users can join private channels for their startups"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  -- Startup-scoped channels
  EXISTS (
    SELECT 1 FROM public.startups s
    INNER JOIN public.profiles p ON p.org_id = s.org_id
    WHERE p.id = auth.uid()
    AND (
      realtime.topic() LIKE '%:' || s.id::text || ':%'
      OR realtime.topic() LIKE '%:' || s.id::text || ':changes'
    )
  )
  OR realtime.topic() LIKE 'onboarding:%'
  OR
  -- FIX: Use pitch_decks table (deckId = pitch_decks.id)
  EXISTS (
    SELECT 1 FROM public.pitch_decks pd
    INNER JOIN public.startups s ON s.id = pd.startup_id
    INNER JOIN public.profiles p ON p.org_id = s.org_id
    WHERE p.id = auth.uid()
    AND realtime.topic() = 'pitch_deck_generation:' || pd.id::text
  )
);

-- Recreate INSERT policy with fixed pitch_decks check
CREATE POLICY "Users can send to private channels for their startups"
ON realtime.messages
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.startups s
    INNER JOIN public.profiles p ON p.org_id = s.org_id
    WHERE p.id = auth.uid()
    AND (
      realtime.topic() LIKE '%:' || s.id::text || ':%'
      OR realtime.topic() LIKE '%:' || s.id::text || ':changes'
    )
  )
  OR realtime.topic() LIKE 'onboarding:%'
  OR
  EXISTS (
    SELECT 1 FROM public.pitch_decks pd
    INNER JOIN public.startups s ON s.id = pd.startup_id
    INNER JOIN public.profiles p ON p.org_id = s.org_id
    WHERE p.id = auth.uid()
    AND realtime.topic() = 'pitch_deck_generation:' || pd.id::text
  )
);

-- Add index for pitch_decks RLS lookup
CREATE INDEX IF NOT EXISTS idx_pitch_decks_startup_id ON public.pitch_decks(startup_id);
CREATE INDEX IF NOT EXISTS idx_pitch_decks_id ON public.pitch_decks(id);
