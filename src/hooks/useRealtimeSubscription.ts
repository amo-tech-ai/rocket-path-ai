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
 * Dashboard-specific real-time hook that uses a single multiplexed broadcast channel.
 * One channel handles all table events: tasks, deals, events, investors, projects, documents, contacts.
 * Events are named `{table}_changed` (e.g. `tasks_changed`, `deals_changed`).
 */
export function useDashboardRealtime(startupId: string | undefined) {
  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

  const invalidateMetrics = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-metric-changes'] });
    queryClient.invalidateQueries({ queryKey: ['analytics-metrics'] });
  }, [queryClient]);

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

    const topic = `dashboard:${startupId}:changes`;
    console.log(`[Dashboard Realtime] Subscribing to ${topic}`);

    // Table → query key mapping for invalidation
    const tableQueryKeys: Record<string, string[][]> = {
      tasks: [['tasks', startupId], ['all-tasks', startupId]],
      deals: [['deals', startupId]],
      events: [['events', startupId], ['upcoming-events']],
      investors: [['investors', startupId]],
      projects: [['projects', startupId]],
      documents: [['documents', startupId]],
      contacts: [['contacts', startupId]],
    };

    const invalidateTable = (table: string) => {
      const keys = tableQueryKeys[table];
      if (keys) {
        keys.forEach(key => queryClient.invalidateQueries({ queryKey: key }));
      }
      invalidateMetrics();
    };

    const channel = supabase
      .channel(topic, {
        config: {
          broadcast: { self: true, ack: true },
          private: true,
        },
      })
      .on('broadcast', { event: 'tasks_changed' }, ({ payload }) => {
        console.log('[Dashboard Realtime] tasks_changed:', payload);
        invalidateTable('tasks');
        const p = payload as { action?: string; title?: string; status?: string };
        if (p.action === 'INSERT' && p.title) {
          toast.info(`New task created: ${p.title}`);
        } else if (p.action === 'UPDATE' && p.status === 'completed' && p.title) {
          toast.success(`Task completed: ${p.title}`);
        }
      })
      .on('broadcast', { event: 'deals_changed' }, ({ payload }) => {
        console.log('[Dashboard Realtime] deals_changed:', payload);
        invalidateTable('deals');
        const p = payload as { action?: string; oldStage?: string; newStage?: string; name?: string };
        if (p.oldStage !== p.newStage && p.name) {
          toast.success(`Deal "${p.name}" moved to ${p.newStage}`);
        }
      })
      .on('broadcast', { event: 'events_changed' }, () => {
        invalidateTable('events');
      })
      .on('broadcast', { event: 'investors_changed' }, () => {
        invalidateTable('investors');
      })
      .on('broadcast', { event: 'projects_changed' }, () => {
        invalidateTable('projects');
      })
      .on('broadcast', { event: 'documents_changed' }, () => {
        invalidateTable('documents');
      })
      .on('broadcast', { event: 'contacts_changed' }, () => {
        invalidateTable('contacts');
      });

    channelRef.current = channel;

    supabase.realtime.setAuth().then(() => {
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[Dashboard Realtime] ✓ Subscribed to ${topic}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.warn(`[Dashboard Realtime] Channel unavailable: ${topic}`);
        }
      });
    });

    return () => {
      if (channelRef.current) {
        console.log('[Dashboard Realtime] Cleaning up subscription');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [startupId, queryClient, invalidateMetrics]);
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
