/**
 * useActionRecommender Hook
 * Fetches Today's Focus actions and recommendations from edge function
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HealthBreakdown } from './useHealthScore';

export interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  module: 'canvas' | 'pitch' | 'tasks' | 'crm' | 'profile' | 'validation';
  impact: 'high' | 'medium' | 'low';
  effort: 'quick' | 'medium' | 'involved';
  route: string;
  priority: number;
  reason: string;
}

export interface UpcomingTask {
  id: string;
  title: string;
  dueDate: string | null;
}

export interface RecentActivity {
  type: string;
  description: string;
  timestamp: string;
}

export interface ActionRecommendation {
  todaysFocus: RecommendedAction[];
  upcomingTasks: UpcomingTask[];
  recentActivity: RecentActivity[];
}

async function fetchRecommendations(
  startupId: string, 
  healthBreakdown?: HealthBreakdown
): Promise<ActionRecommendation> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Not authenticated');

  const { data, error } = await supabase.functions.invoke('action-recommender', {
    body: { startupId, healthScore: healthBreakdown ? { breakdown: healthBreakdown } : undefined },
  });

  if (error) throw error;
  return data;
}

export function useActionRecommender(startupId: string | undefined, healthBreakdown?: HealthBreakdown) {
  return useQuery({
    queryKey: ['action-recommendations', startupId, healthBreakdown],
    queryFn: () => fetchRecommendations(startupId!, healthBreakdown),
    enabled: !!startupId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}
