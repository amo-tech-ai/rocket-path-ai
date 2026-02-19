import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type DecisionType = 'pivot' | 'persevere' | 'launch' | 'kill' | 'invest' | 'partner' | 'hire' | 'other';
export type DecisionStatus = 'active' | 'reversed' | 'superseded';
export type EvidenceType = 'assumption' | 'experiment' | 'interview' | 'metric' | 'research' | 'other';

export interface Decision {
  id: string;
  startup_id: string;
  decision_type: DecisionType;
  title: string;
  reasoning: string | null;
  outcome: string | null;
  outcome_at: string | null;
  decided_by: string | null;
  decided_at: string | null;
  status: DecisionStatus;
  ai_suggested: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface DecisionEvidence {
  id: string;
  decision_id: string;
  evidence_type: EvidenceType;
  evidence_id: string | null;
  evidence_table: string | null;
  summary: string;
  supports_decision: boolean | null;
  created_at: string;
}

export function useDecisions(startupId: string | undefined) {
  return useQuery({
    queryKey: ['decisions', startupId],
    queryFn: async () => {
      if (!startupId) return [];
      const { data, error } = await supabase
        .from('decisions')
        .select('*')
        .eq('startup_id', startupId)
        .order('decided_at', { ascending: false });
      if (error) throw error;
      return (data || []) as Decision[];
    },
    enabled: !!startupId,
  });
}

export function useCreateDecision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (decision: {
      startup_id: string;
      title: string;
      decision_type: DecisionType;
      reasoning?: string;
    }) => {
      const { data, error } = await supabase
        .from('decisions')
        .insert(decision)
        .select()
        .single();
      if (error) throw error;
      return data as Decision;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['decisions'] });
    },
  });
}

export function useUpdateDecision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from('decisions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Decision;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['decisions'] });
    },
  });
}

export function useDeleteDecision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('decisions')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['decisions'] });
    },
  });
}

export function useDecisionEvidence(decisionId: string | undefined) {
  return useQuery({
    queryKey: ['decision-evidence', decisionId],
    queryFn: async () => {
      if (!decisionId) return [];
      const { data, error } = await supabase
        .from('decision_evidence')
        .select('*')
        .eq('decision_id', decisionId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as DecisionEvidence[];
    },
    enabled: !!decisionId,
  });
}

export function useAddEvidence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (evidence: {
      decision_id: string;
      evidence_type: EvidenceType;
      summary: string;
      supports_decision?: boolean;
      evidence_id?: string;
      evidence_table?: string;
    }) => {
      const { data, error } = await supabase
        .from('decision_evidence')
        .insert(evidence)
        .select()
        .single();
      if (error) throw error;
      return data as DecisionEvidence;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['decision-evidence', vars.decision_id] });
    },
  });
}
