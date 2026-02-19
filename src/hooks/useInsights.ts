/**
 * Insights Hook
 * Frontend interface for Dashboard AI insights (daily insights, stage recommendations, weekly summaries)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// ============================================================================
// Types
// ============================================================================

export interface Insight {
  category: 'opportunity' | 'risk' | 'action' | 'milestone';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  suggested_action?: string;
  metric?: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface DailyInsightsResult {
  success: boolean;
  startup_id?: string;
  generated_at?: string;
  insights?: Insight[];
  summary?: string;
  focus_area?: string;
  quick_wins?: string[];
  error?: string;
}

export interface StageMilestone {
  milestone: string;
  why_important: string;
  typical_timeline: string;
}

export interface StagePriority {
  area: string;
  recommendation: string;
  anti_pattern: string;
}

export interface FundraisingReadiness {
  score: number;
  gaps: string[];
  strengths: string[];
}

export interface StageRecommendationsResult {
  success: boolean;
  startup_id?: string;
  current_stage?: string;
  stage_assessment?: string;
  key_milestones?: StageMilestone[];
  priorities?: StagePriority[];
  fundraising_readiness?: FundraisingReadiness;
  next_stage_requirements?: string[];
  error?: string;
}

export interface WeeklyPriority {
  priority: string;
  reason: string;
  success_metric: string;
}

export interface WeeklySummaryResult {
  success: boolean;
  startup_id?: string;
  week_ending?: string;
  week_score?: number;
  highlights?: string[];
  challenges?: string[];
  metrics_summary?: Record<string, string>;
  next_week_priorities?: WeeklyPriority[];
  ceo_note?: string;
  raw_stats?: {
    tasks: { total: number; pending: number; completed: number; overdue: number };
    deals: { total: number; pipeline_value: number; won: number; lost: number };
    investors: { total: number; contacted: number; meetings: number; interested: number };
  };
  error?: string;
}

// ============================================================================
// Helper: Invoke Insights Generator
// ============================================================================

async function invokeInsightsGenerator<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase.functions.invoke('insights-generator', {
    body: { action, ...payload },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) throw error;
  return data as T;
}

// ============================================================================
// Queries
// ============================================================================

/**
 * Fetch quick insights (fast, no AI call)
 */
export function useQuickInsights(startupId: string | undefined) {
  return useQuery({
    queryKey: ['quick-insights', startupId],
    queryFn: async () => {
      if (!startupId) throw new Error('No startup ID');
      return invokeInsightsGenerator<DailyInsightsResult>('generate_quick_insights', {
        startup_id: startupId,
      });
    },
    enabled: !!startupId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
}

// ============================================================================
// Mutations
// ============================================================================

/**
 * Generate comprehensive daily AI insights
 */
export function useDailyInsights() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ startupId }: { startupId: string }) => {
      return invokeInsightsGenerator<DailyInsightsResult>('generate_daily_insights', {
        startup_id: startupId,
      });
    },
    onSuccess: (data, variables) => {
      if (data.success && data.insights) {
        toast.success(`Generated ${data.insights.length} insights`);
        // Invalidate quick insights to refresh
        queryClient.invalidateQueries({ queryKey: ['quick-insights', variables.startupId] });
      } else {
        toast.error(data.error || 'Failed to generate insights');
      }
    },
    onError: (error) => {
      console.error('Daily insights error:', error);
      toast.error('Failed to generate daily insights');
    },
  });
}

/**
 * Get stage-specific recommendations
 */
export function useStageRecommendations() {
  return useMutation({
    mutationFn: async ({ startupId }: { startupId: string }) => {
      return invokeInsightsGenerator<StageRecommendationsResult>('get_stage_recommendations', {
        startup_id: startupId,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Stage recommendations loaded');
      } else {
        toast.error(data.error || 'Failed to get recommendations');
      }
    },
    onError: (error) => {
      console.error('Stage recommendations error:', error);
      toast.error('Failed to get stage recommendations');
    },
  });
}

/**
 * Generate weekly summary report
 */
export function useWeeklySummary() {
  return useMutation({
    mutationFn: async ({ startupId }: { startupId: string }) => {
      return invokeInsightsGenerator<WeeklySummaryResult>('generate_weekly_summary', {
        startup_id: startupId,
      });
    },
    onSuccess: (data) => {
      if (data.success && data.week_score !== undefined) {
        const score = data.week_score;
        if (score >= 80) {
          toast.success(`Week score: ${score}/100 - Great week!`);
        } else if (score >= 60) {
          toast.info(`Week score: ${score}/100 - Solid progress`);
        } else {
          toast.warning(`Week score: ${score}/100 - Room for improvement`);
        }
      }
    },
    onError: (error) => {
      console.error('Weekly summary error:', error);
      toast.error('Failed to generate weekly summary');
    },
  });
}

// ============================================================================
// Business Readiness (P1: Task 21)
// ============================================================================

export interface ReadinessDimension {
  score: number;
  label: string;
  evidence: string[];
  gaps: string[];
}

export interface ReadinessBlocker {
  title: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  dimension: string;
  fix: string;
}

export interface LaunchPlanWeek {
  week: number;
  goal: string;
  tasks: string[];
}

export interface BusinessReadinessResult {
  success: boolean;
  startup_id?: string;
  generated_at?: string;
  overall_score?: number;
  verdict?: 'GREEN' | 'YELLOW' | 'RED';
  summary?: string;
  dimensions?: {
    trust: ReadinessDimension;
    reliability: ReadinessDimension;
    cost_control: ReadinessDimension;
    support: ReadinessDimension;
  };
  blockers?: ReadinessBlocker[];
  launch_plan?: LaunchPlanWeek[];
  error?: string;
}

/**
 * Compute business readiness assessment (4 dimensions, verdict, blockers, launch plan)
 */
export function useBusinessReadiness() {
  return useMutation({
    mutationFn: async ({ startupId }: { startupId: string }) => {
      return invokeInsightsGenerator<BusinessReadinessResult>('compute_readiness', {
        startup_id: startupId,
      });
    },
    onSuccess: (data) => {
      if (data.success && data.verdict) {
        const icon = data.verdict === 'GREEN' ? 'Ready!' : data.verdict === 'YELLOW' ? 'Almost there' : 'Not ready';
        toast.info(`Readiness: ${data.overall_score}/100 — ${icon}`);
      } else {
        toast.error(data.error || 'Failed to compute readiness');
      }
    },
    onError: (error) => {
      console.error('Business readiness error:', error);
      toast.error('Failed to compute business readiness');
    },
  });
}

// ============================================================================
// Outcomes & ROI (P2: Task 22)
// ============================================================================

export interface OutcomeCards {
  decisions_made: number;
  plans_completed: number;
  experiments_validated: number;
  assumptions_tested: number;
  interviews_conducted: number;
}

export interface TimeSaved {
  hours_per_month: number;
  value_estimate: string;
  breakdown: { area: string; hours: number }[];
}

export interface CostPerInsight {
  total_ai_cost: number;
  total_insights: number;
  cost_per_insight: number;
  trend: 'improving' | 'stable' | 'worsening';
}

export interface RetentionStage {
  stage: string;
  count: number;
  percentage: number;
}

export interface ROIMirage {
  detected: boolean;
  activity_count: number;
  outcome_count: number;
  ratio: number;
  warnings: string[];
}

export interface FounderDecision {
  area: string;
  recommendation: 'Double Down' | 'Adjust' | 'Stop';
  reason: string;
  action: string;
}

export interface OutcomesResult {
  success: boolean;
  startup_id?: string;
  generated_at?: string;
  summary?: string;
  outcome_cards?: OutcomeCards;
  time_saved?: TimeSaved;
  cost_per_insight?: CostPerInsight;
  retention_funnel?: RetentionStage[];
  roi_mirage?: ROIMirage;
  founder_decisions?: FounderDecision[];
  raw_stats?: Record<string, unknown>;
  error?: string;
}

/**
 * Compute outcomes & ROI dashboard (outcome cards, time saved, ROI Mirage detection)
 */
export function useOutcomes() {
  return useMutation({
    mutationFn: async ({ startupId }: { startupId: string }) => {
      return invokeInsightsGenerator<OutcomesResult>('compute_outcomes', {
        startup_id: startupId,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        if (data.roi_mirage?.detected) {
          toast.warning('ROI Mirage detected — high activity but low outcomes');
        } else {
          toast.success('Outcomes analysis complete');
        }
      } else {
        toast.error(data.error || 'Failed to compute outcomes');
      }
    },
    onError: (error) => {
      console.error('Outcomes error:', error);
      toast.error('Failed to compute outcomes');
    },
  });
}

// ============================================================================
// Composite Hook
// ============================================================================

export function useInsightsAgent() {
  return {
    dailyInsights: useDailyInsights(),
    stageRecommendations: useStageRecommendations(),
    weeklySummary: useWeeklySummary(),
    businessReadiness: useBusinessReadiness(),
    outcomes: useOutcomes(),
  };
}
