---
task_number: DASH-03
title: Complete Analytics Dashboard
category: Frontend
subcategory: Analytics
phase: 2
priority: P1
status: Not Started
percent_complete: 0
owner: Frontend Developer
depends_on: DASH-01
---

# DASH-03: Complete Analytics Dashboard

## Current State

**Frontend:** ❌ NOT STARTED
- No analytics page exists
- No chart components implemented
- No trend visualization

**Backend:** Depends on DASH-01 (dashboard-metrics)

## Goal

Create comprehensive analytics dashboard with charts showing task completion trends, project velocity, and pipeline health.

## Implementation

### 1. Create Analytics Page

```tsx
// src/pages/Analytics.tsx
export default function Analytics() {
  const { data: metrics } = useAnalyticsMetrics();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AnalyticsHeader />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TaskCompletionChart data={metrics?.taskTrends} />
          <ProjectVelocityChart data={metrics?.projectVelocity} />
          <PipelineConversionChart data={metrics?.pipelineConversion} />
          <InvestorEngagementChart data={metrics?.investorEngagement} />
        </div>

        <AnalyticsSummary metrics={metrics} />
      </div>
    </DashboardLayout>
  );
}
```

### 2. Create Chart Components

```tsx
// src/components/analytics/TaskCompletionChart.tsx
import { AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export function TaskCompletionChart({ data }: { data: TaskTrend[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Completion Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <AreaChart width={400} height={300} data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="completed"
            stroke="#22c55e"
            fill="#22c55e20"
          />
          <Area
            type="monotone"
            dataKey="created"
            stroke="#3b82f6"
            fill="#3b82f620"
          />
        </AreaChart>
      </CardContent>
    </Card>
  );
}
```

### 3. Add Analytics Hook

```typescript
// src/hooks/useAnalytics.ts
export function useAnalyticsMetrics(dateRange?: DateRange) {
  return useQuery({
    queryKey: ['analytics-metrics', dateRange],
    queryFn: async () => {
      const { data } = await supabase.functions.invoke('dashboard-metrics', {
        body: {
          action: 'get_analytics_metrics',
          dateRange
        }
      });
      return data;
    },
  });
}
```

### 4. Add Analytics Action to Edge Function

```typescript
// Add to dashboard-metrics/index.ts
async function handleGetAnalyticsMetrics(payload: { dateRange?: DateRange }, auth: AuthContext) {
  const { startDate, endDate } = payload.dateRange || getDefaultRange();

  const [taskTrends, projectVelocity, pipelineConversion] = await Promise.all([
    getTaskTrends(auth.startup_id, startDate, endDate),
    getProjectVelocity(auth.startup_id, startDate, endDate),
    getPipelineConversion(auth.startup_id, startDate, endDate),
  ]);

  return { taskTrends, projectVelocity, pipelineConversion };
}
```

### 5. Add Date Range Filter

```tsx
// src/components/analytics/DateRangeFilter.tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">
      <CalendarIcon className="mr-2 h-4 w-4" />
      {dateRange ? format(dateRange, 'PPP') : 'Pick a date range'}
    </Button>
  </PopoverTrigger>
  <PopoverContent>
    <Calendar
      mode="range"
      selected={dateRange}
      onSelect={setDateRange}
    />
  </PopoverContent>
</Popover>
```

## Files to Create/Modify

| File | Change |
|------|--------|
| `src/pages/Analytics.tsx` | Create new |
| `src/components/analytics/TaskCompletionChart.tsx` | Create new |
| `src/components/analytics/ProjectVelocityChart.tsx` | Create new |
| `src/components/analytics/PipelineConversionChart.tsx` | Create new |
| `src/components/analytics/DateRangeFilter.tsx` | Create new |
| `src/hooks/useAnalytics.ts` | Create new |
| `supabase/functions/dashboard-metrics/index.ts` | Add analytics action |
| `src/App.tsx` | Add /analytics route |

## Acceptance Criteria

- [ ] Analytics page accessible from navigation
- [ ] Task completion trend chart (area chart)
- [ ] Project velocity chart (bar chart)
- [ ] Pipeline conversion chart (funnel or bar)
- [ ] Date range filter works
- [ ] Responsive layout on mobile
- [ ] Loading states for charts

## Estimated Effort

- **Time:** 8-10 hours
- **Complexity:** High
