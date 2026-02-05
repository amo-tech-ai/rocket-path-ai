---
name: realtime-features
description: Use when adding live updates, co-editing, presence indicators, or push notifications via Supabase Realtime. Triggers on "realtime", "live update", "co-editing", "presence", "broadcast", "subscription".
---

# Realtime Features

## Overview

Implement Supabase Realtime for live data subscriptions, presence, and broadcast channels.

## When to Use

- Live data updates (items appear without refresh)
- Co-editing (multiple users same document)
- Presence (who's online)
- Ephemeral events (typing indicators)

## Workflow

### Phase 1: Choose Pattern

| Pattern | Use Case | Persistence |
|---------|----------|-------------|
| **Postgres Changes** | Row CRUD events | Yes (DB) |
| **Presence** | Online users, cursors | Session only |
| **Broadcast** | Typing, cursor moves | None |

### Phase 2: Implement

**Database changes:**
```typescript
useEffect(() => {
  const channel = supabase
    .channel(`${table}-changes`)
    .on("postgres_changes", { event: "*", schema: "public", table }, () => {
      queryClient.invalidateQueries({ queryKey });
    })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}, [table]);
```

**Presence:**
```typescript
const channel = supabase.channel(`room:${roomId}`);
channel
  .on("presence", { event: "sync" }, () => {
    setUsers(Object.values(channel.presenceState()).flat());
  })
  .subscribe(async (status) => {
    if (status === "SUBSCRIBED") await channel.track({ user_id, name });
  });
```

**Broadcast:**
```typescript
const channel = supabase.channel(name)
  .on("broadcast", { event: "cursor" }, ({ payload }) => { /* handle */ })
  .subscribe();
channel.send({ type: "broadcast", event: "cursor", payload });
```

### Phase 3: RLS for Realtime

1. Table has RLS enabled
2. SELECT policy exists
3. Migration includes: `alter publication supabase_realtime add table <name>;`
4. Test: user A's subscription doesn't get user B's changes

### Phase 4: Cleanup

1. Always `removeChannel` in useEffect cleanup
2. Handle reconnection (automatic by Supabase client)
3. Add connection status indicator

## Checklist

- [ ] Correct pattern (Changes/Presence/Broadcast)
- [ ] Channel cleanup in useEffect return
- [ ] RLS allows SELECT for subscribers
- [ ] Table in `supabase_realtime` publication
- [ ] React Query invalidation (not manual state)
- [ ] Tested with multiple browser tabs
- [ ] No memory leaks

## References

- `tasks/onboarding/11-realtime-strategy.md`
- `tasks/onboarding/12-realtime-ai-strategy-features.md`
