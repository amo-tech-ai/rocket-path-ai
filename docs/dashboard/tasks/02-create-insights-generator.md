---
task_number: DASH-02
title: Create Daily Insights Generator
category: Backend
subcategory: Edge Function
phase: 2
priority: P1
status: Not Started
percent_complete: 0
owner: Backend Developer
---

# DASH-02: Create Daily Insights Generator

## Current State

**Frontend:** ✅ DONE
- `AIStrategicReview.tsx` displays insights in accordion format
- `InsightsTabs.tsx` shows insights, tasks, activity tabs

**Backend:** ❌ MISSING
- No edge function to generate AI insights
- AIStrategicReview uses hardcoded default insights
- No scheduled job to refresh insights daily

## Goal

Create `insights-generator` edge function that analyzes startup data and generates actionable AI insights.

## Implementation

### 1. Create Edge Function

```typescript
// supabase/functions/insights-generator/index.ts
/**
 * Daily Insights Generator
 *
 * Actions:
 * - generate_daily_insights: Full analysis of startup state
 * - generate_quick_insights: Fast insight refresh
 * - get_cached_insights: Return stored insights
 */

async function handleGenerateDailyInsights(auth: AuthContext) {
  // Gather context
  const context = await gatherStartupContext(auth.startup_id);

  const schema = Type.Object({
    insights: Type.Array(Type.Object({
      category: Type.Union([
        Type.Literal('opportunity'),
        Type.Literal('risk'),
        Type.Literal('action'),
        Type.Literal('milestone')
      ]),
      title: Type.String(),
      description: Type.String(),
      priority: Type.Union([Type.Literal('high'), Type.Literal('medium'), Type.Literal('low')]),
      actionable: Type.Boolean(),
      suggested_action: Type.Optional(Type.String()),
    })),
    summary: Type.String(),
  });

  const result = await generateStructuredContent({
    model: GeminiModels.FLASH,
    prompt: `Analyze this startup data and generate actionable insights:
      - Stage: ${context.stage}
      - Tasks: ${context.taskStats}
      - Deals: ${context.dealStats}
      - Runway: ${context.runway}
      - Recent Activity: ${context.recentActivity}

      Generate 3-5 high-priority insights with specific actions.`,
    schema,
  });

  // Cache insights
  await supabase
    .from('startup_insights')
    .upsert({
      startup_id: auth.startup_id,
      insights: result.insights,
      summary: result.summary,
      generated_at: new Date().toISOString(),
    });

  return result;
}
```

### 2. Create Insights Table

```sql
-- Migration: create_startup_insights
CREATE TABLE startup_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
  insights JSONB NOT NULL DEFAULT '[]',
  summary TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours',
  UNIQUE(startup_id)
);

CREATE INDEX idx_startup_insights_startup ON startup_insights(startup_id);
```

### 3. Add useInsights Hook

```typescript
// src/hooks/useInsights.ts
export function useInsights() {
  return useQuery({
    queryKey: ['dashboard-insights'],
    queryFn: async () => {
      const { data } = await supabase.functions.invoke('insights-generator', {
        body: { action: 'get_cached_insights' }
      });
      return data;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useRefreshInsights() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await supabase.functions.invoke('insights-generator', {
        body: { action: 'generate_daily_insights' }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-insights'] });
    },
  });
}
```

### 4. Update AIStrategicReview

```tsx
// In AIStrategicReview.tsx
const { data: insights, isLoading } = useInsights();
const { mutate: refreshInsights, isPending } = useRefreshInsights();

// Replace hardcoded insights with real data
{insights?.insights.map((insight) => (
  <InsightCard key={insight.title} insight={insight} />
))}

<Button onClick={() => refreshInsights()} disabled={isPending}>
  <RefreshCw /> Refresh Insights
</Button>
```

## Files to Create/Modify

| File | Change |
|------|--------|
| `supabase/functions/insights-generator/index.ts` | Create new |
| `supabase/migrations/xxx_create_startup_insights.sql` | Create table |
| `src/hooks/useInsights.ts` | Create new |
| `src/components/dashboard/AIStrategicReview.tsx` | Use real insights |

## Acceptance Criteria

- [ ] insights-generator edge function deployed
- [ ] generate_daily_insights returns AI-generated insights
- [ ] Insights cached in database
- [ ] AIStrategicReview shows real insights
- [ ] Manual refresh button works
- [ ] 24-hour cache expiration

## Estimated Effort

- **Time:** 5-6 hours
- **Complexity:** Medium-High
