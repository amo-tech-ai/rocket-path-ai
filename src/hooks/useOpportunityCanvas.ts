import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface OpportunityCanvas {
  id: string;
  startup_id: string;
  market_readiness: number | null;
  technical_feasibility: number | null;
  competitive_advantage: number | null;
  execution_capability: number | null;
  timing_score: number | null;
  opportunity_score: number | null;
  adoption_barriers: Array<{ title: string; description: string; severity: string }>;
  enablers: Array<{ title: string; description: string; impact: string }>;
  strategic_fit: string | null;
  recommendation: string | null;
  reasoning: string | null;
  created_at: string;
  updated_at: string;
}

export function useOpportunityCanvas(startupId: string | undefined) {
  return useQuery({
    queryKey: ['opportunity-canvas', startupId],
    queryFn: async () => {
      if (!startupId) return null;
      const { data, error } = await supabase
        .from('opportunity_canvas')
        .select('*')
        .eq('startup_id', startupId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as OpportunityCanvas | null;
    },
    enabled: !!startupId,
  });
}

export function useGenerateOpportunityCanvas() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (startupId: string) => {
      const { data, error } = await supabase.functions.invoke('opportunity-canvas', {
        body: { startup_id: startupId },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Analysis failed');
      return data.canvas as OpportunityCanvas;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['opportunity-canvas'] });
    },
  });
}
