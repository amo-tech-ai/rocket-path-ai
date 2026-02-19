/**
 * Events Realtime Hook
 * Channel: events:{startupId}:events
 * 
 * Handles live updates for events module with private channels:
 * - Event recommendations
 * - Sponsor match discoveries
 * - RSVP updates
 * 
 * @see docs/tasks/01-realtime-tasks.md
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EventsRealtimeState } from './types';
import { toast } from 'sonner';
import type { RealtimeChannel } from '@supabase/supabase-js';

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
  const channelRef = useRef<RealtimeChannel | null>(null);

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

    // Prevent duplicate subscriptions
    if (channelRef.current) {
      const state = channelRef.current.state;
      if (state === 'joined' || state === 'joining') {
        return;
      }
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const topic = `events:${startupId}:events`;
    console.log(`[Events Realtime] Subscribing to ${topic}`);

    const channel = supabase
      .channel(topic, {
        config: {
          broadcast: { self: true, ack: true },
          private: true,
        },
      })
      .on('broadcast', { event: 'event_enriched' }, ({ payload }) => {
        handleEventEnriched(payload as EventEnrichedPayload);
      })
      // Listen for table changes via broadcast
      .on('broadcast', { event: 'INSERT' }, () => {
        queryClient.invalidateQueries({ queryKey: ['events', startupId] });
        queryClient.invalidateQueries({ queryKey: ['upcoming-events'] });
      })
      .on('broadcast', { event: 'UPDATE' }, () => {
        queryClient.invalidateQueries({ queryKey: ['events', startupId] });
        queryClient.invalidateQueries({ queryKey: ['upcoming-events'] });
      })
      .on('broadcast', { event: 'DELETE' }, () => {
        queryClient.invalidateQueries({ queryKey: ['events', startupId] });
        queryClient.invalidateQueries({ queryKey: ['upcoming-events'] });
      });

    channelRef.current = channel;

    // Set auth before subscribing (required for private channels)
    supabase.realtime.setAuth().then(() => {
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[Events Realtime] ✓ Subscribed to ${topic}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`[Events Realtime] ✗ Error on ${topic}`);
        }
      });
    });

    return () => {
      if (channelRef.current) {
        console.log('[Events Realtime] Unsubscribing');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [startupId, handleEventEnriched, queryClient]);

  return {
    ...state,
    topRecommendations: state.recommendations.slice(0, 5),
    getMatchScore: (eventId: string) => 
      state.recommendations.find(r => r.eventId === eventId)?.matchScore,
  };
}
