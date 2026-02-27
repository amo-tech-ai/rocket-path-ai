/**
 * useAssumptions — CRUD hooks for the assumptions table
 *
 * Extracted from useExperiments.ts during CORE-05 dead-code removal.
 * The M1 Experiments Lab screen was removed; AssumptionBoard.tsx keeps
 * working against the shared `assumptions` table.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
