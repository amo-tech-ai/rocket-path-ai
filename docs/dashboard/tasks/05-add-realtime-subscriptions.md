---
task_number: DASH-05
title: Add Real-time Dashboard Subscriptions
category: Frontend
subcategory: Real-time
phase: 3
priority: P2
status: Not Started
percent_complete: 0
owner: Frontend Developer
---

# DASH-05: Add Real-time Dashboard Subscriptions

## Current State

**Frontend:** ⚠️ PARTIAL
- Dashboard fetches data on mount
- No real-time updates when data changes
- User must refresh to see updates

**Backend:** ✅ DONE
- Supabase real-time enabled
- Tables support subscriptions

## Goal

Add Supabase real-time subscriptions so dashboard updates instantly when tasks, deals, or other data changes.

## Implementation

### 1. Create Real-time Hook

```typescript
// src/hooks/useRealtimeSubscription.ts
export function useRealtimeSubscription<T>(
  table: string,
  filter: { column: string; value: string },
  onUpdate: (payload: RealtimePostgresChangesPayload<T>) => void
) {
  useEffect(() => {
    const channel = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter: `${filter.column}=eq.${filter.value}`,
        },
        onUpdate
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter.column, filter.value, onUpdate]);
}
```

### 2. Add Task Subscription

```typescript
// src/hooks/useTasks.ts - Add real-time
export function useTasks(startupId: string) {
  const queryClient = useQueryClient();

  // Subscribe to task changes
  useRealtimeSubscription<Task>(
    'tasks',
    { column: 'startup_id', value: startupId },
    (payload) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', startupId] });

      // Show toast for new tasks
      if (payload.eventType === 'INSERT') {
        toast.info(`New task: ${payload.new.title}`);
      }
    }
  );

  return useQuery({...});
}
```

### 3. Add Deal Subscription

```typescript
// src/hooks/useCRM.ts - Add real-time
export function useDeals(startupId: string) {
  const queryClient = useQueryClient();

  useRealtimeSubscription<Deal>(
    'deals',
    { column: 'startup_id', value: startupId },
    (payload) => {
      queryClient.invalidateQueries({ queryKey: ['deals', startupId] });

      // Show toast for deal stage changes
      if (payload.eventType === 'UPDATE' && payload.old.stage !== payload.new.stage) {
        toast.success(`Deal "${payload.new.name}" moved to ${payload.new.stage}`);
      }
    }
  );

  return useQuery({...});
}
```

### 4. Add Dashboard Metrics Subscription

```typescript
// src/hooks/useDashboardData.ts
export function useDashboardRealtime(startupId: string) {
  const queryClient = useQueryClient();

  // Subscribe to multiple tables
  useEffect(() => {
    const channels = [
      supabase.channel('tasks_changes').on('postgres_changes',
        { event: '*', schema: 'public', table: 'tasks', filter: `startup_id=eq.${startupId}` },
        () => queryClient.invalidateQueries({ queryKey: ['dashboard-summary-metrics'] })
      ),
      supabase.channel('deals_changes').on('postgres_changes',
        { event: '*', schema: 'public', table: 'deals', filter: `startup_id=eq.${startupId}` },
        () => queryClient.invalidateQueries({ queryKey: ['dashboard-summary-metrics'] })
      ),
      supabase.channel('events_changes').on('postgres_changes',
        { event: '*', schema: 'public', table: 'events', filter: `startup_id=eq.${startupId}` },
        () => queryClient.invalidateQueries({ queryKey: ['dashboard-summary-metrics'] })
      ),
    ];

    channels.forEach(ch => ch.subscribe());

    return () => {
      channels.forEach(ch => supabase.removeChannel(ch));
    };
  }, [startupId, queryClient]);
}
```

### 5. Use in Dashboard

```tsx
// In Dashboard.tsx
const { startup } = useStartup();

// Enable real-time updates
useDashboardRealtime(startup?.id);

// Rest of dashboard...
```

## Files to Create/Modify

| File | Change |
|------|--------|
| `src/hooks/useRealtimeSubscription.ts` | Create new |
| `src/hooks/useTasks.ts` | Add subscription |
| `src/hooks/useCRM.ts` | Add subscription |
| `src/hooks/useDashboardData.ts` | Add useDashboardRealtime |
| `src/pages/Dashboard.tsx` | Enable real-time |

## Acceptance Criteria

- [ ] Tasks update in real-time on dashboard
- [ ] Deals update in real-time on dashboard
- [ ] Events update in real-time on dashboard
- [ ] Summary metrics refresh on changes
- [ ] Toast notifications for important changes
- [ ] Channels cleaned up on unmount

## Estimated Effort

- **Time:** 4-5 hours
- **Complexity:** Medium
