---
task_number: DASH-01
title: Create Dashboard Metrics Aggregator
category: Backend
subcategory: Edge Function
phase: 2
priority: P1
status: Not Started
percent_complete: 0
owner: Backend Developer
---

# DASH-01: Create Dashboard Metrics Aggregator

## Current State

**Frontend:** ✅ DONE
- `Dashboard.tsx` renders SummaryMetrics with 4 cards
- `SummaryMetrics.tsx` displays decks, investors, tasks, events counts

**Backend:** ❌ MISSING
- No edge function to aggregate real metrics
- Dashboard shows hardcoded values (12 decks, 28 tasks, etc.)
- `useDashboardData.ts` fetches raw data but doesn't aggregate

## Goal

Create `dashboard-metrics` edge function that returns real aggregated metrics from the database.

## Implementation

### 1. Create Edge Function

```typescript
// supabase/functions/dashboard-metrics/index.ts
/**
 * Dashboard Metrics Aggregator
 *
 * Actions:
 * - get_summary_metrics: Counts for decks, investors, tasks, events
 * - get_pipeline_metrics: Deal stages and values
 * - get_task_metrics: Completion rates, overdue counts
 * - get_investor_metrics: Pipeline stage distribution
 * - get_growth_metrics: MRR, ARR, user growth
 */

async function handleGetSummaryMetrics(auth: AuthContext) {
  const { data: counts } = await supabase
    .from('startup_metrics_view')
    .select('*')
    .eq('startup_id', auth.startup_id)
    .single();

  return {
    decks: counts.total_decks,
    investors: counts.total_investors,
    tasks: counts.open_tasks,
    events: counts.upcoming_events,
    deals: counts.active_deals,
    projects: counts.active_projects,
  };
}
```

### 2. Create Metrics View

```sql
-- Migration: create_startup_metrics_view
CREATE OR REPLACE VIEW startup_metrics_view AS
SELECT
  s.id as startup_id,
  (SELECT COUNT(*) FROM pitch_decks WHERE startup_id = s.id) as total_decks,
  (SELECT COUNT(*) FROM investors WHERE startup_id = s.id) as total_investors,
  (SELECT COUNT(*) FROM tasks WHERE startup_id = s.id AND status != 'completed') as open_tasks,
  (SELECT COUNT(*) FROM events WHERE startup_id = s.id AND start_date > NOW()) as upcoming_events,
  (SELECT COUNT(*) FROM deals WHERE startup_id = s.id AND status = 'active') as active_deals,
  (SELECT COUNT(*) FROM projects WHERE startup_id = s.id AND status = 'active') as active_projects
FROM startups s;
```

### 3. Update useDashboardData Hook

```typescript
// Add to useDashboardData.ts
export function useSummaryMetrics() {
  return useQuery({
    queryKey: ['dashboard-summary-metrics'],
    queryFn: async () => {
      const { data } = await supabase.functions.invoke('dashboard-metrics', {
        body: { action: 'get_summary_metrics' }
      });
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### 4. Update SummaryMetrics Component

```tsx
// In SummaryMetrics.tsx
const { data: metrics, isLoading } = useSummaryMetrics();

// Replace hardcoded values with real metrics
<MetricCard
  title="Pitch Decks"
  value={metrics?.decks ?? 0}
  loading={isLoading}
/>
```

## Files to Create/Modify

| File | Change |
|------|--------|
| `supabase/functions/dashboard-metrics/index.ts` | Create new |
| `supabase/migrations/xxx_create_metrics_view.sql` | Create view |
| `src/hooks/useDashboardData.ts` | Add useSummaryMetrics |
| `src/components/dashboard/SummaryMetrics.tsx` | Use real metrics |

## Acceptance Criteria

- [ ] dashboard-metrics edge function deployed
- [ ] get_summary_metrics returns real counts
- [ ] Database view aggregates efficiently
- [ ] SummaryMetrics shows real data
- [ ] Loading states display properly
- [ ] 5-minute cache for performance

## Estimated Effort

- **Time:** 4-5 hours
- **Complexity:** Medium
