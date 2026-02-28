/**
 * useHealthScore Hook
 * Fetches and manages startup health score from edge function
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HealthBreakdown {
  problemClarity: { score: number; weight: number; label: string };
  solutionFit: { score: number; weight: number; label: string };
  marketUnderstanding: { score: number; weight: number; label: string };
  tractionProof: { score: number; weight: number; label: string };
  teamReadiness: { score: number; weight: number; label: string };
  investorReadiness: { score: number; weight: number; label: string };
}

export interface HealthScore {
  overall: number;
  trend: number;
  breakdown: HealthBreakdown;
  warnings: string[];
  lastCalculated: string;
}

async function fetchHealthScore(startupId: string): Promise<HealthScore> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Not authenticated');

  const { data, error } = await supabase.functions.invoke('health-scorer', {
    body: { action: 'calculate', startupId },
    headers: { Authorization: `Bearer ${session.access_token}` },
  });

  if (error) throw error;
  return data;
}

export function useHealthScore(startupId: string | undefined) {
  return useQuery({
    queryKey: ['health-score', startupId],
    queryFn: () => fetchHealthScore(startupId!),
    enabled: !!startupId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
