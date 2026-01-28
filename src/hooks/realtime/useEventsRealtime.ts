/**
 * Events Realtime Hook
 * Channel: events:{startupId}:events
 * 
 * Handles live updates for events module:
 * - Event recommendations
 * - Sponsor match discoveries
 * - RSVP updates
 */

import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EventsRealtimeState } from './types';
import { toast } from 'sonner';

interface EventEnrichedPayload {
  eventId: string;
  matchScore: number;
  sponsorMatches?: Array<{ name: string; fitScore: number }>;
}

interface UseEventsRealtimeOptions {
  onEventEnriched?: (payload: EventEnrichedPayload) => void;
  showToasts?: boolean;
}

const initialState: EventsRealtimeState = {
  recommendations: [],
  sponsorMatches: [],
};

export function useEventsRealtime(
  startupId: string | undefined,
  options: UseEventsRealtimeOptions = { showToasts: true }
) {
  const [state, setState] = useState<EventsRealtimeState>(initialState);
  const queryClient = useQueryClient();

  const handleEventEnriched = useCallback((payload: EventEnrichedPayload) => {
    setState(prev => {
      const newRecommendations = [...prev.recommendations];
      const existingIndex = newRecommendations.findIndex(r => r.eventId === payload.eventId);
      
      if (existingIndex >= 0) {
        newRecommendations[existingIndex] = { eventId: payload.eventId, matchScore: payload.matchScore };
      } else {
        newRecommendations.push({ eventId: payload.eventId, matchScore: payload.matchScore });
      }

      // Sort by match score descending
      newRecommendations.sort((a, b) => b.matchScore - a.matchScore);

      return {
        ...prev,
        recommendations: newRecommendations.slice(0, 10),
        sponsorMatches: payload.sponsorMatches || prev.sponsorMatches,
      };
    });

    // Invalidate events queries
    queryClient.invalidateQueries({ queryKey: ['events', startupId] });
    queryClient.invalidateQueries({ queryKey: ['public-events'] });

    if (options.showToasts && payload.matchScore >= 80) {
      toast.success('High-match event found!', {
        description: `Match score: ${payload.matchScore}%`,
      });
    }

    options.onEventEnriched?.(payload);
  }, [queryClient, startupId, options]);

  useEffect(() => {
    if (!startupId) return;

    console.log('[Events Realtime] Subscribing to startup:', startupId);

    const channel = supabase
      .channel(`events:${startupId}:events`)
      .on('broadcast', { event: 'event_enriched' }, ({ payload }) => {
        handleEventEnriched(payload as EventEnrichedPayload);
      })
      // Listen for events table changes
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `startup_id=eq.${startupId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['events', startupId] });
          queryClient.invalidateQueries({ queryKey: ['upcoming-events'] });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Events Realtime] Channel subscribed');
        }
      });

    return () => {
      console.log('[Events Realtime] Unsubscribing');
      supabase.removeChannel(channel);
    };
  }, [startupId, handleEventEnriched, queryClient]);

  return {
    ...state,
    topRecommendations: state.recommendations.slice(0, 5),
    getMatchScore: (eventId: string) => 
      state.recommendations.find(r => r.eventId === eventId)?.matchScore,
  };
}
