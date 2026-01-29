/**
 * Realtime Subscription Hooks
 * 
 * Uses Supabase Realtime with private channels and broadcast pattern
 * for secure, scalable real-time updates.
 * 
 * @see docs/tasks/01-realtime-tasks.md
 */

import { useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Dashboard-specific real-time hook that uses broadcast pattern
 * Subscribes to broadcast topics for tasks, deals, events, investors, projects, documents, contacts
 */
export function useDashboardRealtime(startupId: string | undefined) {
  const queryClient = useQueryClient();
  const channelsRef = useRef<RealtimeChannel[]>([]);

  const invalidateMetrics = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-metric-changes'] });
    queryClient.invalidateQueries({ queryKey: ['analytics-metrics'] });
  }, [queryClient]);

  useEffect(() => {
    if (!startupId) return;

    // Cleanup existing channels
    channelsRef.current.forEach(ch => supabase.removeChannel(ch));
    channelsRef.current = [];

    console.log('[Dashboard Realtime] Setting up broadcast subscriptions for startup:', startupId);

    // Helper to create a broadcast channel
    const createBroadcastChannel = (
      table: string,
      queryKeys: string[][],
      options?: {
        onInsert?: (payload: unknown) => void;
        onUpdate?: (payload: unknown) => void;
        onDelete?: (payload: unknown) => void;
      }
    ) => {
      const topic = `${table}:${startupId}:changes`;
      
      const channel = supabase
        .channel(topic, {
          config: {
            broadcast: { self: true, ack: true },
            private: true,
          },
        })
        .on('broadcast', { event: 'INSERT' }, ({ payload }) => {
          console.log(`[Realtime] ${table} INSERT:`, payload);
          queryKeys.forEach(key => queryClient.invalidateQueries({ queryKey: key }));
          invalidateMetrics();
          options?.onInsert?.(payload);
        })
        .on('broadcast', { event: 'UPDATE' }, ({ payload }) => {
          console.log(`[Realtime] ${table} UPDATE:`, payload);
          queryKeys.forEach(key => queryClient.invalidateQueries({ queryKey: key }));
          invalidateMetrics();
          options?.onUpdate?.(payload);
        })
        .on('broadcast', { event: 'DELETE' }, ({ payload }) => {
          console.log(`[Realtime] ${table} DELETE:`, payload);
          queryKeys.forEach(key => queryClient.invalidateQueries({ queryKey: key }));
          invalidateMetrics();
          options?.onDelete?.(payload);
        });

      return { channel, topic };
    };

    // Create channels for each table
    const tableConfigs = [
      {
        table: 'tasks',
        queryKeys: [['tasks', startupId], ['all-tasks', startupId]],
        options: {
          onInsert: (payload: unknown) => {
            const task = (payload as { new?: { title?: string } })?.new;
            if (task?.title) {
              toast.info(`New task created: ${task.title}`);
            }
          },
          onUpdate: (payload: unknown) => {
            const task = (payload as { new?: { status?: string; title?: string } })?.new;
            if (task?.status === 'completed' && task?.title) {
              toast.success(`Task completed: ${task.title}`);
            }
          },
        },
      },
      {
        table: 'deals',
        queryKeys: [['deals', startupId]],
        options: {
          onUpdate: (payload: unknown) => {
            const data = payload as { old?: { stage?: string }; new?: { stage?: string; name?: string } };
            if (data.old?.stage !== data.new?.stage && data.new?.name) {
              toast.success(`Deal "${data.new.name}" moved to ${data.new.stage}`);
            }
          },
        },
      },
      {
        table: 'events',
        queryKeys: [['events', startupId], ['upcoming-events']],
      },
      {
        table: 'investors',
        queryKeys: [['investors', startupId]],
      },
      {
        table: 'projects',
        queryKeys: [['projects', startupId]],
      },
      {
        table: 'documents',
        queryKeys: [['documents', startupId]],
      },
      {
        table: 'contacts',
        queryKeys: [['contacts', startupId]],
      },
    ];

    const channels: RealtimeChannel[] = [];

    // Set auth once before subscribing to all channels
    supabase.realtime.setAuth().then(() => {
      tableConfigs.forEach(config => {
        const { channel, topic } = createBroadcastChannel(
          config.table,
          config.queryKeys,
          config.options
        );

        channel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`[Dashboard Realtime] ✓ Subscribed to ${topic}`);
          } else if (status === 'CHANNEL_ERROR') {
            console.error(`[Dashboard Realtime] ✗ Error on ${topic}`);
          }
        });

        channels.push(channel);
      });
    });

    channelsRef.current = channels;

    return () => {
      console.log('[Dashboard Realtime] Cleaning up subscriptions');
      channelsRef.current.forEach(channel => {
        supabase.removeChannel(channel);
      });
      channelsRef.current = [];
    };
  }, [startupId, queryClient, invalidateMetrics]);
}

/**
 * Hook for real-time task updates - uses the shared dashboard subscription
 * This is kept for backwards compatibility but now uses broadcast
 */
export function useTasksRealtime(startupId: string | undefined) {
  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

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

    const topic = `tasks:${startupId}:changes`;
    console.log(`[Tasks Realtime] Subscribing to ${topic}`);

    const channel = supabase
      .channel(topic, {
        config: {
          broadcast: { self: true, ack: true },
          private: true,
        },
      })
      .on('broadcast', { event: 'INSERT' }, () => {
        queryClient.invalidateQueries({ queryKey: ['tasks', startupId] });
        queryClient.invalidateQueries({ queryKey: ['all-tasks', startupId] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-metrics', startupId] });
      })
      .on('broadcast', { event: 'UPDATE' }, () => {
        queryClient.invalidateQueries({ queryKey: ['tasks', startupId] });
        queryClient.invalidateQueries({ queryKey: ['all-tasks', startupId] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-metrics', startupId] });
      })
      .on('broadcast', { event: 'DELETE' }, () => {
        queryClient.invalidateQueries({ queryKey: ['tasks', startupId] });
        queryClient.invalidateQueries({ queryKey: ['all-tasks', startupId] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-metrics', startupId] });
      });

    channelRef.current = channel;

    supabase.realtime.setAuth().then(() => {
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[Tasks Realtime] ✓ Subscribed to ${topic}`);
        }
      });
    });

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [startupId, queryClient]);
}

/**
 * Hook for real-time deal updates with broadcast
 */
export function useDealsRealtime(startupId: string | undefined) {
  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

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

    const topic = `deals:${startupId}:changes`;
    console.log(`[Deals Realtime] Subscribing to ${topic}`);

    const channel = supabase
      .channel(topic, {
        config: {
          broadcast: { self: true, ack: true },
          private: true,
        },
      })
      .on('broadcast', { event: 'INSERT' }, () => {
        queryClient.invalidateQueries({ queryKey: ['deals', startupId] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-metrics', startupId] });
      })
      .on('broadcast', { event: 'UPDATE' }, () => {
        queryClient.invalidateQueries({ queryKey: ['deals', startupId] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-metrics', startupId] });
      })
      .on('broadcast', { event: 'DELETE' }, () => {
        queryClient.invalidateQueries({ queryKey: ['deals', startupId] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-metrics', startupId] });
      });

    channelRef.current = channel;

    supabase.realtime.setAuth().then(() => {
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[Deals Realtime] ✓ Subscribed to ${topic}`);
        }
      });
    });

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [startupId, queryClient]);
}

/**
 * Generic hook for subscribing to real-time changes on a Supabase table
 * Uses broadcast pattern with private channels
 */
export function useRealtimeSubscription<T extends Record<string, unknown>>(
  table: string,
  filter: { column: string; value: string },
  onUpdate?: (payload: { eventType: string; new?: T; old?: T }) => void,
  options?: { showToasts?: boolean }
) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!filter.value) return;

    // Prevent duplicate subscriptions
    if (channelRef.current) {
      const state = channelRef.current.state;
      if (state === 'joined' || state === 'joining') {
        return;
      }
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const topic = `${table}:${filter.value}:changes`;

    const channel = supabase
      .channel(topic, {
        config: {
          broadcast: { self: true, ack: true },
          private: true,
        },
      })
      .on('broadcast', { event: 'INSERT' }, ({ payload }) => {
        console.log(`[Realtime] ${table} INSERT:`, payload);
        onUpdate?.({ eventType: 'INSERT', new: payload?.new as T });
      })
      .on('broadcast', { event: 'UPDATE' }, ({ payload }) => {
        console.log(`[Realtime] ${table} UPDATE:`, payload);
        onUpdate?.({ eventType: 'UPDATE', new: payload?.new as T, old: payload?.old as T });
      })
      .on('broadcast', { event: 'DELETE' }, ({ payload }) => {
        console.log(`[Realtime] ${table} DELETE:`, payload);
        onUpdate?.({ eventType: 'DELETE', old: payload?.old as T });
      });

    channelRef.current = channel;

    supabase.realtime.setAuth().then(() => {
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[Realtime] ✓ Subscribed to ${topic}`);
        }
      });
    });

    return () => {
      if (channelRef.current) {
        console.log(`[Realtime] Unsubscribing from ${topic}`);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table, filter.column, filter.value, onUpdate]);
}
