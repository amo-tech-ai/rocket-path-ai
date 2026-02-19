/**
 * useAIUsageLimits — Read/update AI usage limits from ai_usage_limits table.
 * One row per org. Budget cap in cents, usage tracked monthly.
 */
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface AIUsageLimits {
  id: string;
  org_id: string;
  monthly_cap_cents: number;
  current_month_total_cents: number;
  current_month_start: string;
  last_reset_at: string | null;
}

export function useAIUsageLimits() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const orgId = profile?.org_id;

  const { data: limits, isLoading, error } = useQuery({
    queryKey: ['ai-usage-limits', orgId],
    queryFn: async (): Promise<AIUsageLimits | null> => {
      if (!orgId) return null;

      const { data, error } = await supabase
        .from('ai_usage_limits')
        .select('*')
        .eq('org_id', orgId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!orgId,
  });

  const updateCapMutation = useMutation({
    mutationFn: async (newCapCents: number) => {
      if (!orgId) throw new Error('No org');

      if (limits) {
        // Update existing row
        const { error } = await supabase
          .from('ai_usage_limits')
          .update({ monthly_cap_cents: newCapCents })
          .eq('org_id', orgId);
        if (error) throw error;
      } else {
        // Insert new row (first time setup)
        const { error } = await supabase
          .from('ai_usage_limits')
          .insert({
            org_id: orgId,
            monthly_cap_cents: newCapCents,
            current_month_total_cents: 0,
            current_month_start: new Date().toISOString().slice(0, 10),
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-usage-limits', orgId] });
    },
  });

  const budgetDollars = (limits?.monthly_cap_cents ?? 5000) / 100;
  const usedDollars = (limits?.current_month_total_cents ?? 0) / 100;
  const usagePercent = budgetDollars > 0 ? (usedDollars / budgetDollars) * 100 : 0;

  return {
    limits,
    isLoading,
    error,
    budgetDollars,
    usedDollars,
    usagePercent,
    updateCapCents: updateCapMutation.mutateAsync,
    isUpdating: updateCapMutation.isPending,
  };
}
