/**
 * Shared Realtime Channel Hook
 * 
 * A reusable hook that implements Supabase Realtime best practices:
 * - Private channels with RLS authorization
 * - setAuth() before subscribing
 * - Duplicate subscription prevention
 * - Proper cleanup on unmount
 * 
 * @see docs/tasks/01-realtime-tasks.md
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface RealtimeChannelOptions {
  /**
   * Channel topic (e.g., "tasks:abc-123:changes")
   * Pattern: {scope}:{entity_id}:{type}
   */
  topic: string;
  
  /**
   * Broadcast event handlers
   * Key: event name (e.g., "INSERT", "UPDATE", "DELETE", "custom_event")
   * Value: callback function receiving the payload
   */
  onBroadcast?: Record<string, (payload: unknown) => void>;
  
  /**
   * Whether the subscription is enabled
   * Use this to conditionally subscribe based on auth state or data availability
   */
  enabled?: boolean;
  
  /**
   * Whether to use private channel (default: true)
   * Private channels require RLS policies on realtime.messages
   */
  private?: boolean;
  
  /**
   * Whether to receive own broadcasts (default: true)
   */
  self?: boolean;
  
  /**
   * Whether to wait for acknowledgment (default: true)
   */
  ack?: boolean;
}

export interface RealtimeChannelResult {
  /** Current channel instance (null if not subscribed) */
  channel: RealtimeChannel | null;
  /** Whether currently subscribed */
  isSubscribed: boolean;
  /** Last error if any */
  error: string | null;
  /** Manually trigger resubscription */
  reconnect: () => Promise<void>;
}

/**
 * Hook for managing Supabase Realtime channel subscriptions
 * 
 * @example
 * // Subscribe to task changes
 * const { isSubscribed } = useRealtimeChannel({
 *   topic: `tasks:${startupId}:changes`,
 *   onBroadcast: {
 *     INSERT: (payload) => addTask(payload.new),
 *     UPDATE: (payload) => updateTask(payload.new),
 *     DELETE: (payload) => removeTask(payload.old),
 *   },
 *   enabled: !!startupId,
 * });
 */
export function useRealtimeChannel({
  topic,
  onBroadcast,
  enabled = true,
  private: isPrivate = true,
  self = true,
  ack = true,
}: RealtimeChannelOptions): RealtimeChannelResult {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Store handlers in ref to avoid dependency issues
  const handlersRef = useRef(onBroadcast);
  handlersRef.current = onBroadcast;

  const subscribe = useCallback(async () => {
    // Prevent duplicate subscriptions
    if (channelRef.current) {
      const state = channelRef.current.state;
      if (state === 'joined' || state === 'joining') {
        console.log(`[Realtime] Already subscribed to ${topic}`);
        return;
      }
      // Clear existing channel if in other states
      await supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    setError(null);

    // Create channel with private: true for RLS authorization
    const channel = supabase.channel(topic, {
      config: {
        broadcast: { self, ack },
        private: isPrivate,
      },
    });

    channelRef.current = channel;

    // Register broadcast handlers
    if (handlersRef.current) {
      Object.entries(handlersRef.current).forEach(([event, handler]) => {
        channel.on('broadcast', { event }, ({ payload }) => {
          console.log(`[Realtime] ${topic} received ${event}:`, payload);
          handler(payload);
        });
      });
    }

    try {
      // Set auth before subscribing (required for private channels)
      if (isPrivate) {
        await supabase.realtime.setAuth();
      }

      // Subscribe
      channel.subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          setIsSubscribed(true);
          setError(null);
          console.log(`[Realtime] ✓ Subscribed to ${topic}`);
        } else if (status === 'CHANNEL_ERROR') {
          setIsSubscribed(false);
          const errorMsg = err?.message || 'Channel error';
          setError(errorMsg);
          console.error(`[Realtime] ✗ Error on ${topic}:`, errorMsg);
        } else if (status === 'TIMED_OUT') {
          setIsSubscribed(false);
          setError('Connection timed out');
          console.warn(`[Realtime] ⏱ Timeout on ${topic}`);
        } else if (status === 'CLOSED') {
          setIsSubscribed(false);
          console.log(`[Realtime] Channel ${topic} closed`);
        }
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      console.error(`[Realtime] Failed to subscribe to ${topic}:`, errorMsg);
    }
  }, [topic, isPrivate, self, ack]);

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      console.log(`[Realtime] Unsubscribing from ${topic}`);
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      setIsSubscribed(false);
    }
  }, [topic]);

  useEffect(() => {
    if (!enabled || !topic) {
      cleanup();
      return;
    }

    subscribe();

    return cleanup;
  }, [topic, enabled, subscribe, cleanup]);

  return {
    channel: channelRef.current,
    isSubscribed,
    error,
    reconnect: subscribe,
  };
}

/**
 * Hook for table change subscriptions via broadcast
 * Convenience wrapper for database CRUD events
 */
export interface TableChangeOptions<T> {
  table: string;
  scopeId: string;
  onInsert?: (record: T) => void;
  onUpdate?: (record: T) => void;
  onDelete?: (record: T) => void;
  enabled?: boolean;
}

export function useTableChanges<T>({
  table,
  scopeId,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true,
}: TableChangeOptions<T>) {
  const topic = `${table}:${scopeId}:changes`;

  const handlers: Record<string, (payload: unknown) => void> = {};
  
  if (onInsert) {
    handlers.INSERT = (payload: unknown) => {
      const p = payload as { new?: T };
      if (p.new) onInsert(p.new);
    };
  }
  
  if (onUpdate) {
    handlers.UPDATE = (payload: unknown) => {
      const p = payload as { new?: T };
      if (p.new) onUpdate(p.new);
    };
  }
  
  if (onDelete) {
    handlers.DELETE = (payload: unknown) => {
      const p = payload as { old?: T };
      if (p.old) onDelete(p.old);
    };
  }

  return useRealtimeChannel({
    topic,
    onBroadcast: handlers,
    enabled: enabled && !!scopeId,
  });
}
