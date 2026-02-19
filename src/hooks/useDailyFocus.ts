/**
 * useDailyFocus Hook
 * Fetches AI-computed daily focus recommendation from compute-daily-focus edge function
 * Uses sophisticated scoring: health gaps, task priority, stage relevance, time urgency, momentum
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Types matching compute-daily-focus edge function output
export interface PrimaryAction {
  title: string;
  description: string;
  reason: string;
  expected_outcome: string;
  link: string;
  source: string;
}

export interface SecondaryAction {
  title: string;
  description: string;
  link: string;
  source: string;
}

export interface ScoringBreakdown {
  candidates_count: number;
  top_candidate_scores: {
    health_gap: number;
    task_priority: number;
    stage_relevance: number;
    time_urgency: number;
    momentum: number;
  };
  top_candidate_total: number;
  health_overall: number | null;
  stage: string;
}

export interface DailyFocusRecommendation {
  id: string;
  startup_id: string;
  computed_at: string;
  expires_at: string;
  action_completed_at: string | null;
  skipped_at: string | null;
  primary_action: PrimaryAction;
  secondary_actions: SecondaryAction[];
  signal_weights: {
    health_gap: number;
    task_priority: number;
    stage_relevance: number;
    time_urgency: number;
    momentum: number;
  };
  scoring_breakdown: ScoringBreakdown;
}

interface DailyFocusResponse {
  recommendation: DailyFocusRecommendation | null;
  cached: boolean;
  message?: string;
}

async function fetchDailyFocus(startupId: string): Promise<DailyFocusResponse> {
  const { data, error } = await supabase.functions.invoke('compute-daily-focus', {
    body: { startup_id: startupId },
  });

  if (error) throw error;
  return data;
}

export function useDailyFocus(startupId: string | undefined) {
  return useQuery({
    queryKey: ['daily-focus', startupId],
    queryFn: () => fetchDailyFocus(startupId!),
    enabled: !!startupId,
    staleTime: 30 * 60 * 1000, // 30 minutes (recommendation valid for 18 hours)
    refetchOnWindowFocus: false,
  });
}

// Mark action as completed
export function useCompleteDailyFocus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recommendationId, startupId }: { recommendationId: string; startupId: string }) => {
      const { error } = await supabase
        .from('daily_focus_recommendations')
        .update({ action_completed_at: new Date().toISOString() })
        .eq('id', recommendationId);

      if (error) throw error;

      // Create activity record
      await supabase.from('activities').insert({
        startup_id: startupId,
        activity_type: 'task_completed',
        title: 'Daily Focus completed',
        description: 'Completed the AI-recommended daily focus action',
        is_system_generated: false,
        importance: 'normal',
      });
    },
    onSuccess: (_, { startupId }) => {
      queryClient.invalidateQueries({ queryKey: ['daily-focus', startupId] });
      queryClient.invalidateQueries({ queryKey: ['activities', startupId] });
    },
  });
}

// Skip action (get new recommendation)
export function useSkipDailyFocus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recommendationId, startupId }: { recommendationId: string; startupId: string }) => {
      const { error } = await supabase
        .from('daily_focus_recommendations')
        .update({ skipped_at: new Date().toISOString() })
        .eq('id', recommendationId);

      if (error) throw error;
    },
    onSuccess: (_, { startupId }) => {
      queryClient.invalidateQueries({ queryKey: ['daily-focus', startupId] });
    },
  });
}
