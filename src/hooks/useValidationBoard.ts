/**
 * Validation Board hooks — stage tracking, current bet, pivot logs
 *
 * Uses: startups.validation_stage, startups.current_bet, pivot_logs table
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// ---------- Interfaces ----------

export interface CurrentBet {
  audience: string;
  pain_point: string;
  solution: string;
}

export interface PivotLog {
  id: string;
  startup_id: string;
  assumption_id: string | null;
  pivot_type: 'audience' | 'pain' | 'solution' | 'stage_advance';
  old_value: string | null;
  new_value: string | null;
  reason: string;
  created_at: string;
}

export type ValidationStage = 'idea' | 'mvp' | 'selling';

// ---------- Hooks ----------

/** Read the current validation stage and bet for a startup */
export function useValidationStage(startupId: string | undefined) {
  return useQuery({
    queryKey: ['validation-stage', startupId],
    queryFn: async () => {
      if (!startupId) return null;
      const { data, error } = await supabase
        .from('startups')
        .select('validation_stage, current_bet')
        .is('deleted_at', null)
        .eq('id', startupId)
        .single();
      if (error) throw error;
      return {
        stage: (data.validation_stage || 'idea') as ValidationStage,
        bet: (data.current_bet && typeof data.current_bet === 'object' && !Array.isArray(data.current_bet))
          ? data.current_bet as unknown as CurrentBet
          : { audience: '', pain_point: '', solution: '' },
      };
    },
    enabled: !!startupId,
  });
}

/** Update the current bet (audience, pain, solution) */
export function useUpdateBet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ startupId, bet }: { startupId: string; bet: CurrentBet }) => {
      const { error } = await supabase
        .from('startups')
        .update({ current_bet: bet as unknown as Record<string, unknown> })
        .eq('id', startupId);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['validation-stage', vars.startupId] });
    },
  });
}

/** Advance to next validation stage + log the advance */
export function useAdvanceStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ startupId, fromStage, toStage, reason }: {
      startupId: string;
      fromStage: ValidationStage;
      toStage: ValidationStage;
      reason: string;
    }) => {
      // Update stage
      const { error: updateErr } = await supabase
        .from('startups')
        .update({ validation_stage: toStage })
        .eq('id', startupId);
      if (updateErr) throw updateErr;

      // Log the advance
      const { error: logErr } = await supabase
        .from('pivot_logs')
        .insert({
          startup_id: startupId,
          pivot_type: 'stage_advance',
          old_value: fromStage,
          new_value: toStage,
          reason,
        });
      if (logErr) throw logErr;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['validation-stage', vars.startupId] });
      qc.invalidateQueries({ queryKey: ['pivot-logs', vars.startupId] });
    },
  });
}

/** Record a pivot (audience/pain/solution change) */
export function useRecordPivot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (pivot: {
      startup_id: string;
      assumption_id?: string;
      pivot_type: 'audience' | 'pain' | 'solution';
      old_value: string;
      new_value: string;
      reason: string;
    }) => {
      const { error } = await supabase
        .from('pivot_logs')
        .insert({
          startup_id: pivot.startup_id,
          assumption_id: pivot.assumption_id || null,
          pivot_type: pivot.pivot_type,
          old_value: pivot.old_value,
          new_value: pivot.new_value,
          reason: pivot.reason,
        });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['pivot-logs', vars.startup_id] });
    },
  });
}

/** Fetch pivot log history for a startup */
export function usePivotLogs(startupId: string | undefined) {
  return useQuery({
    queryKey: ['pivot-logs', startupId],
    queryFn: async () => {
      if (!startupId) return [];
      const { data, error } = await supabase
        .from('pivot_logs')
        .select('*')
        .eq('startup_id', startupId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as PivotLog[];
    },
    enabled: !!startupId,
  });
}
