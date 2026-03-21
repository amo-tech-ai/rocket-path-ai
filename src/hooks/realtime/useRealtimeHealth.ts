/**
 * Realtime Health Hook
 *
 * Monitors the Supabase Realtime WebSocket connection health:
 * - Subscribes to a lightweight heartbeat channel
 * - Tracks connection state: connected / degraded / disconnected
 * - Measures round-trip latency via self-broadcast ping/pong
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export type RealtimeHealthStatus = 'connected' | 'degraded' | 'disconnected';

export interface RealtimeHealthState {
  status: RealtimeHealthStatus;
  latencyMs: number | null;
  lastPingAt: number | null;
}

const PING_INTERVAL_MS = 30_000;
const DEGRADED_THRESHOLD_MS = 2_000;

export function useRealtimeHealth() {
  const [state, setState] = useState<RealtimeHealthState>({
    status: 'disconnected',
    latencyMs: null,
    lastPingAt: null,
  });

  const channelRef = useRef<RealtimeChannel | null>(null);
  const pingSentRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sendPing = useCallback(() => {
    if (!channelRef.current) return;
    pingSentRef.current = Date.now();
    channelRef.current.send({
      type: 'broadcast',
      event: 'ping',
      payload: { t: pingSentRef.current },
    }).catch(() => {
      setState(prev => ({ ...prev, status: 'disconnected' }));
    });
  }, []);

  useEffect(() => {
    // Guard: supabase.channel may not exist in test environments
    if (typeof supabase.channel !== 'function') return;

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channel = supabase
      .channel('realtime-health', {
        config: {
          broadcast: { self: true, ack: false },
        },
      })
      .on('broadcast', { event: 'ping' }, ({ payload }) => {
        const sent = (payload as { t?: number })?.t;
        if (sent) {
          const latencyMs = Date.now() - sent;
          setState({
            status: latencyMs > DEGRADED_THRESHOLD_MS ? 'degraded' : 'connected',
            latencyMs,
            lastPingAt: Date.now(),
          });
        }
      });

    channelRef.current = channel;

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setState(prev => ({ ...prev, status: 'connected' }));
        sendPing();
        intervalRef.current = setInterval(sendPing, PING_INTERVAL_MS);
      } else if (status === 'CHANNEL_ERROR' || status === 'CLOSED') {
        setState(prev => ({ ...prev, status: 'disconnected' }));
      }
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [sendPing]);

  return state;
}
