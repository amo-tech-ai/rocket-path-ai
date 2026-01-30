/**
 * useWorkflowTrigger Hook
 * 
 * Frontend interface for the workflow-trigger edge function.
 * Processes scores and creates automated tasks based on thresholds.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// ============================================================================
// Types
// ============================================================================

export interface TriggerRule {
  id: string;
  source: 'investor_score' | 'readiness_score' | 'validation_report' | 'health_score';
  category: string;
  threshold: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  taskTemplate: {
    title: string;
    description: string;
    tags: string[];
  };
}

export interface ScoreData {
  startup_id: string;
  source: TriggerRule['source'];
  overall_score?: number;
  category_scores?: Record<string, number>;
  context?: Record<string, unknown>;
}

export interface ProcessScoreResult {
  success: boolean;
  tasks_created: number;
  tasks: { title: string; priority: string }[];
}

// ============================================================================
// Helper
// ============================================================================

async function invokeWorkflowTrigger<T>(
  action: string,
  payload: Record<string, unknown> = {}
): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('Not authenticated');
  }
  
  const { data, error } = await supabase.functions.invoke('workflow-trigger', {
    body: { action, ...payload },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });
  
  if (error) throw error;
  return data as T;
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Fetch trigger rules
 */
export function useTriggerRules() {
  return useQuery({
    queryKey: ['trigger-rules'],
    queryFn: async () => {
      const result = await invokeWorkflowTrigger<{ success: boolean; rules: TriggerRule[] }>(
        'get_trigger_rules'
      );
      return result.rules;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour (rules rarely change)
  });
}

/**
 * Process a score and trigger tasks if needed
 */
export function useProcessScore() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (scoreData: ScoreData) => {
      return invokeWorkflowTrigger<ProcessScoreResult>('process_score', {
        score_data: scoreData,
      });
    },
    onSuccess: (data) => {
      if (data.tasks_created > 0) {
        toast.info(
          `${data.tasks_created} action item${data.tasks_created > 1 ? 's' : ''} created based on your scores`,
          {
            description: 'Check your Tasks to see the recommended actions.',
            action: {
              label: 'View Tasks',
              onClick: () => window.location.href = '/tasks',
            },
          }
        );
        // Invalidate tasks query to refresh the list
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      }
    },
    onError: (error) => {
      console.error('[useProcessScore] Error:', error);
      // Don't show error toast - this is a background operation
    },
  });
}

/**
 * Check if a task would be a duplicate
 */
export function useCheckDuplicate() {
  return useMutation({
    mutationFn: async ({ startupId, title }: { startupId: string; title: string }) => {
      return invokeWorkflowTrigger<{ success: boolean; is_duplicate: boolean }>(
        'check_duplicates',
        { startup_id: startupId, title }
      );
    },
  });
}

/**
 * Composite hook for workflow automation
 */
export function useWorkflowTrigger() {
  const processScore = useProcessScore();
  const { data: rules } = useTriggerRules();
  
  return {
    processScore: processScore.mutateAsync,
    isProcessing: processScore.isPending,
    rules,
    
    // Helper to check if any rules would trigger
    wouldTrigger: (scoreData: Omit<ScoreData, 'startup_id'>): TriggerRule[] => {
      if (!rules) return [];
      
      return rules.filter(rule => {
        if (rule.source !== scoreData.source) return false;
        
        let score: number | undefined;
        if (rule.category === 'overall') {
          score = scoreData.overall_score;
        } else if (scoreData.category_scores) {
          score = scoreData.category_scores[rule.category];
        }
        
        return score !== undefined && score < rule.threshold;
      });
    },
  };
}

export default useWorkflowTrigger;
