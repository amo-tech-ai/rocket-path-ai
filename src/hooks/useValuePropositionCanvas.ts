/**
 * Value Proposition Canvas hooks
 *
 * VPC data stored in opportunity_canvas.vpc_data JSONB column.
 * 6-box Strategyzer canvas: Customer Profile (jobs, pains, gains) vs
 * Value Map (products, pain_relievers, gain_creators) + fit_score.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// ---------- Interfaces ----------

export interface VPCItem {
  text: string;
  priority?: 'high' | 'medium' | 'low';
  severity?: 'high' | 'medium' | 'low';
  importance?: 'high' | 'medium' | 'low';
  matched_index?: number | null;
}

export interface VPCData {
  customer_jobs: VPCItem[];
  pains: VPCItem[];
  gains: VPCItem[];
  products_services: VPCItem[];
  pain_relievers: VPCItem[];
  gain_creators: VPCItem[];
  fit_score: number;
  unmatched_pains: number[];
  unmatched_gains: number[];
}

const EMPTY_VPC: VPCData = {
  customer_jobs: [],
  pains: [],
  gains: [],
  products_services: [],
  pain_relievers: [],
  gain_creators: [],
  fit_score: 0,
  unmatched_pains: [],
  unmatched_gains: [],
};

// ---------- Hooks ----------

/** Fetch VPC data for a startup (from opportunity_canvas.vpc_data) */
export function useVPCData(startupId: string | undefined) {
  return useQuery({
    queryKey: ['vpc-data', startupId],
    queryFn: async () => {
      if (!startupId) return null;
      const { data, error } = await supabase
        .from('opportunity_canvas')
        .select('id, vpc_data')
        .eq('startup_id', startupId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;

      const raw = data.vpc_data;
      const vpc = (raw && typeof raw === 'object' && !Array.isArray(raw))
        ? { ...EMPTY_VPC, ...(raw as Record<string, unknown>) } as VPCData
        : EMPTY_VPC;

      return { canvasId: data.id as string, vpc };
    },
    enabled: !!startupId,
  });
}

/** Save VPC data to opportunity_canvas.vpc_data */
export function useSaveVPCData() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ canvasId, vpc }: { canvasId: string; vpc: VPCData }) => {
      const { error } = await supabase
        .from('opportunity_canvas')
        .update({ vpc_data: vpc as unknown as Record<string, unknown> })
        .eq('id', canvasId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vpc-data'] });
    },
  });
}

/** Calculate fit score from VPC data */
export function calculateFitScore(vpc: VPCData): {
  score: number;
  unmatchedPains: number[];
  unmatchedGains: number[];
} {
  const totalPains = vpc.pains.length;
  const totalGains = vpc.gains.length;
  const total = totalPains + totalGains;
  if (total === 0) return { score: 0, unmatchedPains: [], unmatchedGains: [] };

  // Find pains with matching relievers
  const matchedPainIndices = new Set(
    vpc.pain_relievers
      .map((r) => r.matched_index)
      .filter((i): i is number => i != null && i >= 0 && i < totalPains)
  );
  const unmatchedPains = vpc.pains
    .map((_, i) => i)
    .filter((i) => !matchedPainIndices.has(i));

  // Find gains with matching creators
  const matchedGainIndices = new Set(
    vpc.gain_creators
      .map((c) => c.matched_index)
      .filter((i): i is number => i != null && i >= 0 && i < totalGains)
  );
  const unmatchedGains = vpc.gains
    .map((_, i) => i)
    .filter((i) => !matchedGainIndices.has(i));

  const matched = matchedPainIndices.size + matchedGainIndices.size;
  const score = Math.round((matched / total) * 100);

  return { score, unmatchedPains, unmatchedGains };
}
