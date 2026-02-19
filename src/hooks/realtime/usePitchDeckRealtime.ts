/**
 * Pitch Deck Realtime Hook
 * Channel: pitchdeck:{deckId}:events
 * 
 * Handles live updates during deck generation with private channels:
 * - Slide-by-slide progress
 * - Individual slide scores
 * - Overall signal strength
 * 
 * @see docs/tasks/01-realtime-tasks.md
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PitchDeckRealtimeState, SlideCompletedPayload, DeckReadyPayload } from './types';
import { toast } from 'sonner';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface UsePitchDeckRealtimeOptions {
  onSlideComplete?: (slideIndex: number, totalSlides: number) => void;
  onDeckReady?: (signalStrength: number) => void;
  showToasts?: boolean;
}

const initialState: PitchDeckRealtimeState = {
  isGenerating: false,
  slidesCompleted: 0,
  totalSlides: 0,
  slideScores: new Map(),
  signalStrength: null,
};

export function usePitchDeckRealtime(
  deckId: string | undefined,
  options: UsePitchDeckRealtimeOptions = { showToasts: true }
) {
  const [state, setState] = useState<PitchDeckRealtimeState>(initialState);
  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

  const handleSlideCompleted = useCallback((payload: SlideCompletedPayload) => {
    setState(prev => {
      const newScores = new Map(prev.slideScores);
      if (payload.slideScore !== undefined) {
        newScores.set(payload.slideIndex, payload.slideScore);
      }
      
      return {
        ...prev,
        isGenerating: payload.slideIndex < payload.totalSlides,
        slidesCompleted: payload.slideIndex,
        totalSlides: payload.totalSlides,
        slideScores: newScores,
      };
    });

    options.onSlideComplete?.(payload.slideIndex, payload.totalSlides);
  }, [options]);

  const handleDeckReady = useCallback((payload: DeckReadyPayload) => {
    setState(prev => ({
      ...prev,
      isGenerating: false,
      slidesCompleted: payload.totalSlides,
      totalSlides: payload.totalSlides,
      signalStrength: payload.signalStrength,
    }));

    // Invalidate deck queries
    queryClient.invalidateQueries({ queryKey: ['pitch-deck', deckId] });
    queryClient.invalidateQueries({ queryKey: ['pitch-decks'] });

    if (options.showToasts) {
      toast.success('Pitch deck ready!', {
        description: `Signal strength: ${payload.signalStrength}%`,
      });
    }

    options.onDeckReady?.(payload.signalStrength);
  }, [deckId, queryClient, options]);

  const startGeneration = useCallback((totalSlides: number) => {
    setState(prev => ({
      ...prev,
      isGenerating: true,
      slidesCompleted: 0,
      totalSlides,
      slideScores: new Map(),
      signalStrength: null,
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  useEffect(() => {
    if (!deckId) return;

    // Prevent duplicate subscriptions
    if (channelRef.current) {
      const state = channelRef.current.state;
      if (state === 'joined' || state === 'joining') {
        return;
      }
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const topic = `pitchdeck:${deckId}:events`;
    console.log(`[PitchDeck Realtime] Subscribing to ${topic}`);

    const channel = supabase
      .channel(topic, {
        config: {
          broadcast: { self: true, ack: true },
          private: true,
        },
      })
      .on('broadcast', { event: 'slide_completed' }, ({ payload }) => {
        handleSlideCompleted(payload as SlideCompletedPayload);
      })
      .on('broadcast', { event: 'deck_ready' }, ({ payload }) => {
        handleDeckReady(payload as DeckReadyPayload);
      });

    channelRef.current = channel;

    // Set auth before subscribing (required for private channels)
    supabase.realtime.setAuth().then(() => {
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[PitchDeck Realtime] ✓ Subscribed to ${topic}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`[PitchDeck Realtime] ✗ Error on ${topic}`);
        }
      });
    });

    return () => {
      if (channelRef.current) {
        console.log('[PitchDeck Realtime] Unsubscribing');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [deckId, handleSlideCompleted, handleDeckReady, queryClient]);

  return {
    ...state,
    startGeneration,
    reset,
    progress: state.totalSlides > 0 
      ? Math.round((state.slidesCompleted / state.totalSlides) * 100) 
      : 0,
    getSlideScore: (index: number) => state.slideScores.get(index),
  };
}
