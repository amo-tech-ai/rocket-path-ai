import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MarketResearch {
  id: string;
  startup_id: string;
  tam_value: number | null;
  tam_source: string | null;
  sam_value: number | null;
  sam_source: string | null;
  som_value: number | null;
  som_source: string | null;
  methodology: string | null;
  trends: Array<{ name: string; impact: string; timeframe: string; evidence: string }>;
  market_leaders: Array<{ name: string; description: string; market_share?: string }>;
  emerging_players: Array<{ name: string; description: string; differentiator?: string }>;
  sources: Array<{ title: string; url?: string }>;
  ai_generated: boolean | null;
  confidence_score: number | null;
  created_at: string;
  updated_at: string;
}

export function useMarketResearch(startupId: string | undefined) {
  return useQuery({
    queryKey: ['market-research', startupId],
    queryFn: async () => {
      if (!startupId) return null;
      const { data, error } = await supabase
        .from('market_research')
        .select('*')
        .eq('startup_id', startupId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as MarketResearch | null;
    },
    enabled: !!startupId,
  });
}

export function useGenerateMarketResearch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (startupId: string) => {
      const { data, error } = await supabase.functions.invoke('market-research', {
        body: { startup_id: startupId },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Research generation failed');
      return data.research as MarketResearch;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['market-research'] });
    },
  });
}
