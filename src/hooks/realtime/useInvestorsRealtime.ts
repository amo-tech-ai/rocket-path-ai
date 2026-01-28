/**
 * Investors Realtime Hook
 * Channel: investors:{startupId}:events
 * 
 * Handles live updates for investor module:
 * - Fit score calculations
 * - Warm path discoveries
 * - Readiness updates
 */

import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { InvestorsRealtimeState, InvestorScoredPayload, ReadinessScorePayload } from './types';
import { toast } from 'sonner';

interface UseInvestorsRealtimeOptions {
  onInvestorScored?: (payload: InvestorScoredPayload) => void;
  onReadinessUpdate?: (payload: ReadinessScorePayload) => void;
  showToasts?: boolean;
}

const initialState: InvestorsRealtimeState = {
  fitScores: new Map(),
  readinessUpdates: [],
};

export function useInvestorsRealtime(
  startupId: string | undefined,
  options: UseInvestorsRealtimeOptions = { showToasts: true }
) {
  const [state, setState] = useState<InvestorsRealtimeState>(initialState);
  const queryClient = useQueryClient();

  const handleInvestorScored = useCallback((payload: InvestorScoredPayload) => {
    setState(prev => {
      const newScores = new Map(prev.fitScores);
      newScores.set(payload.investorId, payload);
      return { ...prev, fitScores: newScores };
    });

    // Invalidate investors query
    queryClient.invalidateQueries({ queryKey: ['investors', startupId] });

    if (options.showToasts && payload.fitScore >= 80) {
      toast.success('High-fit investor found!', {
        description: `Fit score: ${payload.fitScore}%`,
      });
    }

    options.onInvestorScored?.(payload);
  }, [queryClient, startupId, options]);

  const handleReadinessUpdate = useCallback((payload: ReadinessScorePayload) => {
    setState(prev => ({
      ...prev,
      readinessUpdates: [...prev.readinessUpdates, payload].slice(-5),
    }));

    options.onReadinessUpdate?.(payload);
  }, [options]);

  useEffect(() => {
    if (!startupId) return;

    console.log('[Investors Realtime] Subscribing to startup:', startupId);

    const channel = supabase
      .channel(`investors:${startupId}:events`)
      .on('broadcast', { event: 'investor_scored' }, ({ payload }) => {
        handleInvestorScored(payload as InvestorScoredPayload);
      })
      .on('broadcast', { event: 'readiness_score_updated' }, ({ payload }) => {
        handleReadinessUpdate(payload as ReadinessScorePayload);
      })
      // Listen for investor table changes
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'investors',
          filter: `startup_id=eq.${startupId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['investors', startupId] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Investors Realtime] Channel subscribed');
        }
      });

    return () => {
      console.log('[Investors Realtime] Unsubscribing');
      supabase.removeChannel(channel);
    };
  }, [startupId, handleInvestorScored, handleReadinessUpdate, queryClient]);

  return {
    ...state,
    getFitScore: (investorId: string) => state.fitScores.get(investorId)?.fitScore,
    getWarmPaths: (investorId: string) => state.fitScores.get(investorId)?.warmPaths,
    latestReadiness: state.readinessUpdates[state.readinessUpdates.length - 1]?.score ?? null,
  };
}
