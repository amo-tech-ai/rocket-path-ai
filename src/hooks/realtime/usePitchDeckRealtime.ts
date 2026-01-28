/**
 * Pitch Deck Realtime Hook
 * Channel: pitchdeck:{deckId}:events
 * 
 * Handles live updates during deck generation:
 * - Slide-by-slide progress
 * - Individual slide scores
 * - Overall signal strength
 */

import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PitchDeckRealtimeState, SlideCompletedPayload, DeckReadyPayload } from './types';
import { toast } from 'sonner';

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

    console.log('[PitchDeck Realtime] Subscribing to deck:', deckId);

    const channel = supabase
      .channel(`pitchdeck:${deckId}:events`)
      .on('broadcast', { event: 'slide_completed' }, ({ payload }) => {
        handleSlideCompleted(payload as SlideCompletedPayload);
      })
      .on('broadcast', { event: 'deck_ready' }, ({ payload }) => {
        handleDeckReady(payload as DeckReadyPayload);
      })
      // Listen for document updates
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'documents',
          filter: `id=eq.${deckId}`,
        },
        (payload) => {
          const doc = payload.new as { status?: string };
          if (doc.status === 'completed') {
            queryClient.invalidateQueries({ queryKey: ['pitch-deck', deckId] });
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[PitchDeck Realtime] Channel subscribed');
        }
      });

    return () => {
      console.log('[PitchDeck Realtime] Unsubscribing');
      supabase.removeChannel(channel);
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
