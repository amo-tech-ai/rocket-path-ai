---
name: supabase-realtime
description: Use when implementing Supabase Realtime features - broadcast, presence, or database change subscriptions. Includes private channel setup, RLS policies, and migration patterns.
---

# Supabase Realtime

## Quick Reference

### Do
- Use `broadcast` for all realtime events (prefer over postgres_changes)
- Use `private: true` for channels that need auth
- Call `setAuth()` before subscribing to private channels
- Use topic pattern: `scope:entity:id` (e.g., `tasks:uuid:events`)
- Use event pattern: `entity_action` (e.g., `task_created`)
- Include cleanup in useEffect return
- Create indexes for RLS policy columns

### Don't
- Use `postgres_changes` for new apps (single-threaded, doesn't scale)
- Call `realtime.send` or `realtime.broadcast_changes` from client code
- Subscribe without cleanup logic
- Use generic event names like "update" or "change"

## Client Setup

```typescript
// Create channel with private: true
const channel = supabase.channel(`tasks:${startupId}:events`, {
  config: {
    broadcast: { self: true, ack: true },
    private: true
  }
});

// Set auth BEFORE subscribing
await supabase.realtime.setAuth();

// Subscribe to broadcast events
channel
  .on('broadcast', { event: 'task_created' }, handleTaskCreated)
  .on('broadcast', { event: 'task_updated' }, handleTaskUpdated)
  .subscribe();

// Cleanup
return () => supabase.removeChannel(channel);
```

## React Hook Pattern

```typescript
const channelRef = useRef<RealtimeChannel | null>(null);

useEffect(() => {
  if (!startupId) return;

  // Prevent duplicate subscriptions
  if (channelRef.current?.state === 'subscribed') return;

  const channel = supabase.channel(`tasks:${startupId}:events`, {
    config: { private: true }
  });

  channelRef.current = channel;

  channel
    .on('broadcast', { event: 'task_created' }, ({ payload }) => {
      // Handle event
    })
    .subscribe();

  // Set auth
  supabase.realtime.setAuth();

  return () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  };
}, [startupId]);
```

## Database Trigger (Broadcast)

```sql
-- Trigger function using realtime.send
-- Correct argument order: payload, event, topic, is_private
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
BEGIN
  event_name := TG_OP || '_' || lower(TG_TABLE_NAME);
  topic_name := TG_TABLE_NAME || ':' || NEW.startup_id::text || ':events';

  payload := jsonb_build_object(
    'id', NEW.id,
    'event', event_name,
    'timestamp', now()
  );

  -- realtime.send(payload, event, topic, is_private)
  -- TRUE for private channels
  PERFORM realtime.send(payload, event_name, topic_name, TRUE);

  RETURN NEW;
END;
$$;

CREATE TRIGGER task_broadcast
AFTER INSERT OR UPDATE ON tasks
FOR EACH ROW EXECUTE FUNCTION broadcast_task_event();
```

## RLS for Private Channels

```sql
-- Allow users to join private channels for their startups
CREATE POLICY "Users can join startup channels"
ON realtime.messages
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM startups s
    INNER JOIN profiles p ON p.org_id = s.org_id
    WHERE p.id = auth.uid()
    AND realtime.topic() LIKE '%:' || s.id::text || ':%'
  )
);

-- Index for RLS performance
CREATE INDEX idx_profiles_org_id ON profiles(org_id);
CREATE INDEX idx_startups_org_id ON startups(org_id);
```

## Migration Checklist

- [ ] Grant permissions: `GRANT SELECT, INSERT ON realtime.messages TO authenticated`
- [ ] Create RLS policies on `realtime.messages` (SELECT + INSERT)
- [ ] Create broadcast triggers for key tables
- [ ] Add tables to publication: `ALTER PUBLICATION supabase_realtime ADD TABLE ...`
- [ ] Create indexes for RLS policy columns

## Resources

- [Realtime Docs](https://supabase.com/docs/guides/realtime)
- [Broadcast from DB](https://supabase.com/docs/guides/realtime/broadcast#broadcasting-a-message-from-your-database)
- [Authorization](https://supabase.com/docs/guides/realtime/authorization)
