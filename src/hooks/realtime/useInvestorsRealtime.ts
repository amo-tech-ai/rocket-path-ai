/**
 * Investors Realtime Hook
 * Channel: investors:{startupId}:events
 * 
 * Handles live updates for investor module with private channels:
 * - Fit score calculations
 * - Warm path discoveries
 * - Readiness updates
 * 
 * @see docs/tasks/01-realtime-tasks.md
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { InvestorsRealtimeState, InvestorScoredPayload, ReadinessScorePayload } from './types';
import { toast } from 'sonner';
import type { RealtimeChannel } from '@supabase/supabase-js';

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
  const channelRef = useRef<RealtimeChannel | null>(null);

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

    // Prevent duplicate subscriptions
    if (channelRef.current) {
      const state = channelRef.current.state;
      if (state === 'joined' || state === 'joining') {
        return;
      }
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const topic = `investors:${startupId}:events`;
    console.log(`[Investors Realtime] Subscribing to ${topic}`);

    const channel = supabase
      .channel(topic, {
        config: {
          broadcast: { self: true, ack: true },
          private: true,
        },
      })
      .on('broadcast', { event: 'investor_scored' }, ({ payload }) => {
        handleInvestorScored(payload as InvestorScoredPayload);
      })
      .on('broadcast', { event: 'readiness_score_updated' }, ({ payload }) => {
        handleReadinessUpdate(payload as ReadinessScorePayload);
      })
      // Listen for table changes via broadcast
      .on('broadcast', { event: 'INSERT' }, () => {
        queryClient.invalidateQueries({ queryKey: ['investors', startupId] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      })
      .on('broadcast', { event: 'UPDATE' }, () => {
        queryClient.invalidateQueries({ queryKey: ['investors', startupId] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      })
      .on('broadcast', { event: 'DELETE' }, () => {
        queryClient.invalidateQueries({ queryKey: ['investors', startupId] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      });

    channelRef.current = channel;

    // Set auth before subscribing (required for private channels)
    supabase.realtime.setAuth().then(() => {
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[Investors Realtime] ✓ Subscribed to ${topic}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`[Investors Realtime] ✗ Error on ${topic}`);
        }
      });
    });

    return () => {
      if (channelRef.current) {
        console.log('[Investors Realtime] Unsubscribing');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [startupId, handleInvestorScored, handleReadinessUpdate, queryClient]);

  return {
    ...state,
    getFitScore: (investorId: string) => state.fitScores.get(investorId)?.fitScore,
    getWarmPaths: (investorId: string) => state.fitScores.get(investorId)?.warmPaths,
    latestReadiness: state.readinessUpdates[state.readinessUpdates.length - 1]?.score ?? null,
  };
}
