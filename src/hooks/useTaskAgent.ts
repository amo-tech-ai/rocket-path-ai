/**
 * Task Agent Hook
 * Frontend interface for Task AI actions (generation, prioritization, productivity)
 */

import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// ============================================================================
// Types
// ============================================================================

export interface GeneratedTask {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  estimated_hours: number;
  suggested_due_days: number;
}

export interface TaskGenerationResult {
  success: boolean;
  tasks?: GeneratedTask[];
  reasoning?: string;
  count?: number;
  error?: string;
}

export interface PrioritizedTask {
  task_id: string;
  new_priority: string;
  rank: number;
  reasoning: string;
  impact_score: number;
  urgency_score: number;
  effort_estimate: string;
}

export interface PrioritizationResult {
  success: boolean;
  prioritized_tasks?: PrioritizedTask[];
  focus_recommendation?: string;
  defer_recommendation?: string;
  updated_count?: number;
  error?: string;
}

export interface TaskSuggestion {
  title: string;
  why_now: string;
  estimated_time: string;
  momentum_tip: string;
}

export interface SuggestNextResult {
  success: boolean;
  suggestions?: TaskSuggestion[];
  batch_suggestion?: string;
  avoid_now?: string;
  message?: string;
  error?: string;
}

export interface Subtask {
  title: string;
  description: string;
  estimated_minutes: number;
  order: number;
  can_be_delegated: boolean;
  tools_needed: string[];
}

export interface BreakdownResult {
  success: boolean;
  parent_task?: string;
  subtasks?: Subtask[];
  total_estimated_hours?: number;
  complexity?: string;
  suggested_approach?: string;
  error?: string;
}

export interface ProductivityStats {
  total: number;
  completed: number;
  in_progress: number;
  pending: number;
  completion_rate: number;
}

export interface ProductivityRecommendation {
  action: string;
  expected_impact: string;
}

export interface ProductivityResult {
  success: boolean;
  period_days?: number;
  stats?: ProductivityStats;
  health_score?: number;
  summary?: string;
  strengths?: string[];
  areas_to_improve?: string[];
  recommendations?: ProductivityRecommendation[];
  focus_suggestion?: string;
  error?: string;
}

export interface DailyPlanBlock {
  time_block: string;
  task: string;
  duration_minutes: number;
  focus_type: string;
  energy_required: string;
  tip: string;
}

export interface DailyPlanResult {
  success: boolean;
  available_hours?: number;
  plan?: DailyPlanBlock[];
  breaks?: string[];
  buffer_time?: string;
  daily_goal?: string;
  evening_prep?: string;
  error?: string;
}

// ============================================================================
// Helper: Invoke Task Agent
// ============================================================================

async function invokeTaskAgent<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase.functions.invoke('task-agent', {
    body: { action, ...payload },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) throw error;
  return data as T;
}

// ============================================================================
// Mutations
// ============================================================================

/**
 * Generate AI tasks based on startup context
 */
export function useGenerateTasks() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      projectId,
      context,
      count,
      focusArea
    }: { 
      startupId: string; 
      projectId?: string;
      context?: string;
      count?: number;
      focusArea?: string;
    }) => {
      return invokeTaskAgent<TaskGenerationResult>('generate_tasks', {
        startup_id: startupId,
        project_id: projectId,
        context,
        count,
        focus_area: focusArea,
      });
    },
    onSuccess: (data) => {
      if (data.success && data.tasks) {
        toast.success(`Generated ${data.tasks.length} task suggestions`);
      } else {
        toast.error(data.error || 'Failed to generate tasks');
      }
    },
    onError: (error) => {
      console.error('Generate tasks error:', error);
      toast.error('Failed to generate tasks');
    },
  });
}

/**
 * Prioritize existing tasks with AI
 */
export function usePrioritizeTasks() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      taskIds 
    }: { 
      startupId: string; 
      taskIds?: string[];
    }) => {
      return invokeTaskAgent<PrioritizationResult>('prioritize_tasks', {
        startup_id: startupId,
        task_ids: taskIds,
      });
    },
    onSuccess: (data) => {
      if (data.success && data.updated_count) {
        toast.success(`Prioritized ${data.updated_count} tasks`);
      } else if (data.success) {
        toast.info('No tasks to prioritize');
      } else {
        toast.error(data.error || 'Failed to prioritize tasks');
      }
    },
    onError: (error) => {
      console.error('Prioritize tasks error:', error);
      toast.error('Failed to prioritize tasks');
    },
  });
}

/**
 * Get AI suggestions for what to work on next
 */
export function useSuggestNextTasks() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      availableTime,
      energyLevel,
      focusArea
    }: { 
      startupId: string; 
      availableTime?: number;
      energyLevel?: 'high' | 'medium' | 'low';
      focusArea?: string;
    }) => {
      return invokeTaskAgent<SuggestNextResult>('suggest_next', {
        startup_id: startupId,
        available_time: availableTime,
        energy_level: energyLevel,
        focus_area: focusArea,
      });
    },
    onSuccess: (data) => {
      if (data.success && data.suggestions?.length) {
        toast.success('Got task suggestions');
      } else if (data.message) {
        toast.info(data.message);
      }
    },
    onError: (error) => {
      console.error('Suggest next error:', error);
      toast.error('Failed to get suggestions');
    },
  });
}

/**
 * Break down a complex task into subtasks
 */
export function useBreakdownTask() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      taskId 
    }: { 
      startupId: string; 
      taskId: string;
    }) => {
      return invokeTaskAgent<BreakdownResult>('breakdown_task', {
        startup_id: startupId,
        task_id: taskId,
      });
    },
    onSuccess: (data) => {
      if (data.success && data.subtasks) {
        toast.success(`Broken into ${data.subtasks.length} subtasks`);
      } else {
        toast.error(data.error || 'Failed to break down task');
      }
    },
    onError: (error) => {
      console.error('Breakdown task error:', error);
      toast.error('Failed to break down task');
    },
  });
}

/**
 * Analyze productivity patterns
 */
export function useAnalyzeProductivity() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      days 
    }: { 
      startupId: string; 
      days?: number;
    }) => {
      return invokeTaskAgent<ProductivityResult>('analyze_productivity', {
        startup_id: startupId,
        days,
      });
    },
    onSuccess: (data) => {
      if (data.success && data.health_score !== undefined) {
        const score = data.health_score;
        if (score >= 80) {
          toast.success(`Productivity score: ${score}/100 - Excellent!`);
        } else if (score >= 60) {
          toast.info(`Productivity score: ${score}/100 - Good progress`);
        } else {
          toast.warning(`Productivity score: ${score}/100 - Needs improvement`);
        }
      }
    },
    onError: (error) => {
      console.error('Analyze productivity error:', error);
      toast.error('Failed to analyze productivity');
    },
  });
}

/**
 * Generate an optimal daily work plan
 */
export function useGenerateDailyPlan() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      availableHours,
      priorities
    }: { 
      startupId: string; 
      availableHours?: number;
      priorities?: string[];
    }) => {
      return invokeTaskAgent<DailyPlanResult>('generate_daily_plan', {
        startup_id: startupId,
        available_hours: availableHours,
        priorities,
      });
    },
    onSuccess: (data) => {
      if (data.success && data.plan) {
        toast.success('Daily plan generated');
      } else {
        toast.error(data.error || 'Failed to generate plan');
      }
    },
    onError: (error) => {
      console.error('Generate daily plan error:', error);
      toast.error('Failed to generate daily plan');
    },
  });
}

// ============================================================================
// Composite Hook
// ============================================================================

export function useTaskAgent() {
  return {
    generateTasks: useGenerateTasks(),
    prioritizeTasks: usePrioritizeTasks(),
    suggestNext: useSuggestNextTasks(),
    breakdownTask: useBreakdownTask(),
    analyzeProductivity: useAnalyzeProductivity(),
    generateDailyPlan: useGenerateDailyPlan(),
  };
}
