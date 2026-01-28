/**
 * useStageAnalysis Hook
 * 
 * Consumes the stage-analyzer edge function to provide:
 * - Automated stage detection based on metrics
 * - Stage transition recommendations
 * - Missing requirements for next stage
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type StartupStage = 'ideation' | 'validation' | 'mvp' | 'growth' | 'scale';

export interface StageAnalysisResult {
  current_stage: StartupStage;
  detected_stage: StartupStage;
  score: number;
  category_scores: Record<string, number>;
  missing_for_next_stage: string[];
  ready_for_transition: boolean;
  recommendations: string[];
  next_stage: StartupStage | null;
}

export interface StageCriteria {
  stage: StartupStage;
  label: string;
  minScore: number;
  requirements: string[];
  description: string;
}

export interface StageTransitionSuggestion {
  should_transition: boolean;
  from_stage: StartupStage;
  to_stage: StartupStage | null;
  confidence: number;
  reasons: string[];
}

async function invokeStageAnalyzer<T>(action: string, startupId?: string): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Not authenticated');
  }

  const response = await supabase.functions.invoke('stage-analyzer', {
    body: { action, startupId },
  });

  if (response.error) {
    throw new Error(response.error.message || 'Stage analyzer request failed');
  }

  return response.data as T;
}

export function useStageAnalysis(startupId: string | undefined) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['stage-analysis', startupId],
    queryFn: () => invokeStageAnalyzer<StageAnalysisResult>('analyze_stage', startupId),
    enabled: !!startupId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - stage doesn't change often
    gcTime: 48 * 60 * 60 * 1000, // 48 hours cache
    retry: 2,
    meta: {
      onError: (error: Error) => {
        console.error('[useStageAnalysis] Error:', error);
        toast({
          title: 'Stage Analysis Failed',
          description: error.message,
          variant: 'destructive',
        });
      },
    },
  });
}

export function useStageCriteria() {
  return useQuery({
    queryKey: ['stage-criteria'],
    queryFn: () => invokeStageAnalyzer<{ stages: StageCriteria[] }>('get_stage_criteria'),
    staleTime: Infinity, // Criteria never changes
    gcTime: Infinity,
  });
}

export function useStageTransitionSuggestion(startupId: string | undefined) {
  return useQuery({
    queryKey: ['stage-transition', startupId],
    queryFn: () => invokeStageAnalyzer<StageTransitionSuggestion>('suggest_stage_transition', startupId),
    enabled: !!startupId,
    staleTime: 6 * 60 * 60 * 1000, // 6 hours
    gcTime: 12 * 60 * 60 * 1000,
  });
}

export function useUpdateStartupStage(startupId: string | undefined) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newStage: StartupStage) => {
      if (!startupId) throw new Error('No startup ID');
      
      const { error } = await supabase
        .from('startups')
        .update({ stage: newStage, updated_at: new Date().toISOString() })
        .eq('id', startupId);

      if (error) throw error;
      return newStage;
    },
    onSuccess: (newStage) => {
      queryClient.invalidateQueries({ queryKey: ['stage-analysis', startupId] });
      queryClient.invalidateQueries({ queryKey: ['stage-transition', startupId] });
      queryClient.invalidateQueries({ queryKey: ['startup', startupId] });
      
      toast({
        title: 'Stage Updated',
        description: `Your startup stage has been updated to ${newStage}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Re-export for convenience
export type { StartupStage };
