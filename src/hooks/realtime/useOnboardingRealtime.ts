/**
 * Onboarding Realtime Hook
 * Channel: onboarding:{sessionId}:events
 * 
 * Handles live updates during the onboarding wizard with private channels:
 * - URL enrichment progress
 * - Context/competitor discovery
 * - Founder profile enrichment
 * - Readiness score updates
 * 
 * @see docs/tasks/01-realtime-tasks.md
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingRealtimeState, EnrichmentPayload, ReadinessScorePayload } from './types';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface UseOnboardingRealtimeOptions {
  onEnrichmentComplete?: (type: 'url' | 'context' | 'founder', data: Record<string, unknown>) => void;
  onReadinessUpdate?: (score: number, categories: Record<string, number>) => void;
  onError?: (error: string) => void;
}

const initialState: OnboardingRealtimeState = {
  urlEnrichment: { status: 'idle' },
  contextEnrichment: { status: 'idle' },
  founderEnrichment: { status: 'idle' },
  readinessScore: null,
  currentStep: 1,
};

export function useOnboardingRealtime(
  sessionId: string | undefined,
  options: UseOnboardingRealtimeOptions = {}
) {
  const [state, setState] = useState<OnboardingRealtimeState>(initialState);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const handleEnrichmentEvent = useCallback((payload: EnrichmentPayload) => {
    const enrichmentType = payload.eventType.replace('enrichment_', '').replace('_completed', '') as 'url' | 'context' | 'founder';
    
    const newStatus = payload.success ? 'success' : 'error';
    const updateKey = `${enrichmentType}Enrichment` as keyof OnboardingRealtimeState;

    setState(prev => ({
      ...prev,
      [updateKey]: {
        status: newStatus,
        data: payload.data,
        error: payload.error,
      },
    }));

    if (payload.success && payload.data) {
      options.onEnrichmentComplete?.(enrichmentType, payload.data);
    } else if (!payload.success && payload.error) {
      options.onError?.(payload.error);
    }
  }, [options]);

  const handleReadinessEvent = useCallback((payload: ReadinessScorePayload) => {
    setState(prev => ({
      ...prev,
      readinessScore: payload.score,
    }));

    options.onReadinessUpdate?.(payload.score, payload.categories);
  }, [options]);

  // Set enrichment loading state
  const setEnrichmentLoading = useCallback((type: 'url' | 'context' | 'founder') => {
    const updateKey = `${type}Enrichment` as keyof OnboardingRealtimeState;
    setState(prev => ({
      ...prev,
      [updateKey]: { status: 'loading' },
    }));
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    // Prevent duplicate subscriptions
    if (channelRef.current) {
      const state = channelRef.current.state;
      if (state === 'joined' || state === 'joining') {
        return;
      }
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const topic = `onboarding:${sessionId}:events`;
    console.log(`[Onboarding Realtime] Subscribing to ${topic}`);

    const channel = supabase
      .channel(topic, {
        config: {
          broadcast: { self: true, ack: true },
          private: true,
        },
      })
      .on('broadcast', { event: 'enrichment_url_completed' }, ({ payload }) => {
        handleEnrichmentEvent(payload as EnrichmentPayload);
      })
      .on('broadcast', { event: 'enrichment_context_completed' }, ({ payload }) => {
        handleEnrichmentEvent(payload as EnrichmentPayload);
      })
      .on('broadcast', { event: 'enrichment_founder_completed' }, ({ payload }) => {
        handleEnrichmentEvent(payload as EnrichmentPayload);
      })
      .on('broadcast', { event: 'readiness_score_updated' }, ({ payload }) => {
        handleReadinessEvent(payload as ReadinessScorePayload);
      });

    channelRef.current = channel;

    // Set auth before subscribing (required for private channels)
    supabase.realtime.setAuth().then(() => {
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[Onboarding Realtime] ✓ Subscribed to ${topic}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`[Onboarding Realtime] ✗ Error on ${topic}`);
        }
      });
    });

    return () => {
      if (channelRef.current) {
        console.log('[Onboarding Realtime] Unsubscribing');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [sessionId, handleEnrichmentEvent, handleReadinessEvent]);

  return {
    ...state,
    setEnrichmentLoading,
    reset,
    isEnriching: 
      state.urlEnrichment.status === 'loading' ||
      state.contextEnrichment.status === 'loading' ||
      state.founderEnrichment.status === 'loading',
  };
}
