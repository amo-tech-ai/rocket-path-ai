---
task_number: DASH-04
title: Create Stage Analyzer Edge Function
category: Backend
subcategory: AI Agent
phase: 3
priority: P2
status: Not Started
percent_complete: 0
owner: Backend Developer
---

# DASH-04: Create Stage Analyzer Edge Function

## Current State

**Frontend:** ✅ DONE
- `StageGuidanceCard.tsx` displays current stage
- `useStageGuidance.ts` calculates milestones

**Backend:** ⚠️ PARTIAL
- Stage is manually set in startup profile
- No automatic stage detection based on metrics
- `useStageGuidanceAI.ts` exists but limited

## Goal

Create `stage-analyzer` edge function that automatically detects startup stage based on metrics and milestones.

## Implementation

### 1. Create Edge Function

```typescript
// supabase/functions/stage-analyzer/index.ts
/**
 * Stage Analyzer
 *
 * Actions:
 * - analyze_stage: Determine current stage from metrics
 * - get_stage_criteria: Return criteria for each stage
 * - suggest_stage_transition: Check if ready for next stage
 */

const STAGE_CRITERIA = {
  ideation: {
    minScore: 0,
    requirements: ['has_idea', 'has_target_market'],
  },
  validation: {
    minScore: 20,
    requirements: ['has_pitch_deck', 'has_market_research', 'has_interviews'],
  },
  mvp: {
    minScore: 40,
    requirements: ['has_product', 'has_users', 'has_feedback'],
  },
  growth: {
    minScore: 60,
    requirements: ['has_revenue', 'has_team', 'has_metrics'],
  },
  scale: {
    minScore: 80,
    requirements: ['has_funding', 'has_growth_rate', 'has_expansion_plan'],
  },
};

async function handleAnalyzeStage(auth: AuthContext) {
  const metrics = await gatherStartupMetrics(auth.startup_id);

  // Score based on completeness
  const score = calculateStageScore(metrics);

  // Determine stage
  const detectedStage = determineStage(score, metrics);

  // Check transition readiness
  const transitionReadiness = checkTransitionReadiness(detectedStage, metrics);

  return {
    current_stage: detectedStage,
    score,
    missing_for_next_stage: transitionReadiness.missing,
    ready_for_transition: transitionReadiness.ready,
    recommendations: transitionReadiness.recommendations,
  };
}
```

### 2. Add Stage Detection Logic

```typescript
function calculateStageScore(metrics: StartupMetrics): number {
  let score = 0;

  // Idea & Planning (0-20)
  if (metrics.has_pitch_deck) score += 5;
  if (metrics.has_business_model) score += 5;
  if (metrics.has_market_research) score += 5;
  if (metrics.has_competitor_analysis) score += 5;

  // Validation (20-40)
  if (metrics.customer_interviews > 0) score += 5;
  if (metrics.has_prototype) score += 5;
  if (metrics.has_landing_page) score += 5;
  if (metrics.waitlist_signups > 0) score += 5;

  // MVP (40-60)
  if (metrics.has_product) score += 5;
  if (metrics.active_users > 0) score += 5;
  if (metrics.has_feedback_loop) score += 5;
  if (metrics.feature_releases > 0) score += 5;

  // Growth (60-80)
  if (metrics.mrr > 0) score += 5;
  if (metrics.team_size > 1) score += 5;
  if (metrics.has_marketing) score += 5;
  if (metrics.month_over_month_growth > 0) score += 5;

  // Scale (80-100)
  if (metrics.funding_raised > 0) score += 5;
  if (metrics.growth_rate > 20) score += 5;
  if (metrics.has_expansion_plan) score += 5;
  if (metrics.has_partnerships) score += 5;

  return score;
}
```

### 3. Update useStageGuidance Hook

```typescript
// Add to useStageGuidance.ts
export function useStageAnalysis() {
  return useQuery({
    queryKey: ['stage-analysis'],
    queryFn: async () => {
      const { data } = await supabase.functions.invoke('stage-analyzer', {
        body: { action: 'analyze_stage' }
      });
      return data;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}
```

### 4. Update StageGuidanceCard

```tsx
// In StageGuidanceCard.tsx
const { data: analysis } = useStageAnalysis();

// Show detected stage vs current stage
{analysis?.current_stage !== startup.stage && (
  <Alert>
    <AlertTitle>Stage Update Available</AlertTitle>
    <AlertDescription>
      Based on your progress, you may be ready for {analysis?.current_stage} stage.
      {analysis?.missing_for_next_stage.length > 0 && (
        <p>To advance further, complete: {analysis?.missing_for_next_stage.join(', ')}</p>
      )}
    </AlertDescription>
    <Button onClick={() => updateStage(analysis?.current_stage)}>
      Update Stage
    </Button>
  </Alert>
)}
```

## Files to Create/Modify

| File | Change |
|------|--------|
| `supabase/functions/stage-analyzer/index.ts` | Create new |
| `src/hooks/useStageGuidance.ts` | Add useStageAnalysis |
| `src/components/dashboard/StageGuidanceCard.tsx` | Show analysis |

## Acceptance Criteria

- [ ] stage-analyzer edge function deployed
- [ ] Analyzes metrics to determine stage
- [ ] Returns missing requirements for next stage
- [ ] StageGuidanceCard shows stage suggestions
- [ ] User can accept/decline stage update
- [ ] Stage history tracked

## Estimated Effort

- **Time:** 5-6 hours
- **Complexity:** Medium-High
