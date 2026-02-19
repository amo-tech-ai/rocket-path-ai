import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type Experiment = Tables<'experiments'>;

export function useExperiments(startupId: string | undefined) {
  return useQuery({
    queryKey: ['experiments', startupId],
    queryFn: async () => {
      if (!startupId) return [];
      const { data, error } = await supabase
        .from('experiments')
        .select('*, assumptions!inner(startup_id)')
        .eq('assumptions.startup_id', startupId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as Experiment[];
    },
    enabled: !!startupId,
  });
}

export function useAssumptions(startupId: string | undefined) {
  return useQuery({
    queryKey: ['assumptions', startupId],
    queryFn: async () => {
      if (!startupId) return [];
      const { data, error } = await supabase
        .from('assumptions')
        .select('*')
        .eq('startup_id', startupId)
        .order('priority_score', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!startupId,
  });
}

export function useCreateAssumption() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (assumption: {
      startup_id: string;
      lean_canvas_id?: string;
      source_block: string;
      statement: string;
      impact_score?: number;
      uncertainty_score?: number;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('assumptions')
        .insert(assumption)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['assumptions'] });
    },
  });
}

export function useUpdateAssumption() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from('assumptions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['assumptions'] });
    },
  });
}

export function useDeleteAssumption() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('assumptions')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['assumptions'] });
    },
  });
}

export function useCreateExperiment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (experiment: {
      assumption_id: string;
      title: string;
      hypothesis: string;
      success_criteria: string;
      experiment_type: Experiment['experiment_type'];
      method?: string;
      target_sample_size?: number;
    }) => {
      const { data, error } = await supabase
        .from('experiments')
        .insert(experiment)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['experiments'] });
    },
  });
}

export function useUpdateExperiment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Experiment> & { id: string }) => {
      const { data, error } = await supabase
        .from('experiments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['experiments'] });
    },
  });
}

export function useDeleteExperiment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('experiments')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['experiments'] });
    },
  });
}

export function useGenerateExperiment() {
  return useMutation({
    mutationFn: async (input: {
      assumption_text: string;
      experiment_type: string;
      startup_context: { name: string; industry: string; stage: string; description: string };
    }) => {
      const { data, error } = await supabase.functions.invoke('experiment-agent', {
        body: input,
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'AI generation failed');
      return data.experiment as {
        hypothesis: string;
        success_criteria: string;
        method: string;
        target_sample_size: number;
        planned_duration_days: number;
        suggested_metrics: string[];
      };
    },
  });
}
