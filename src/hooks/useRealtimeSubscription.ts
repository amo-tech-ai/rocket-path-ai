import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { toast } from 'sonner';

/**
 * Generic hook for subscribing to real-time changes on a Supabase table
 */
export function useRealtimeSubscription<T extends Record<string, unknown>>(
  table: string,
  filter: { column: string; value: string },
  onUpdate?: (payload: RealtimePostgresChangesPayload<T>) => void,
  options?: { showToasts?: boolean }
) {
  useEffect(() => {
    if (!filter.value) return;

    const channel = supabase
      .channel(`${table}_${filter.value}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter: `${filter.column}=eq.${filter.value}`,
        },
        (payload: RealtimePostgresChangesPayload<T>) => {
          console.log(`[Realtime] ${table} change:`, payload.eventType);
          onUpdate?.(payload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[Realtime] Subscribed to ${table} changes`);
        }
      });

    return () => {
      console.log(`[Realtime] Unsubscribing from ${table} changes`);
      supabase.removeChannel(channel);
    };
  }, [table, filter.column, filter.value, onUpdate]);
}

/**
 * Dashboard-specific real-time hook that invalidates relevant queries
 * when tasks, deals, events, or investors change
 */
export function useDashboardRealtime(startupId: string | undefined) {
  const queryClient = useQueryClient();

  const invalidateMetrics = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-metric-changes'] });
    queryClient.invalidateQueries({ queryKey: ['analytics-metrics'] });
  }, [queryClient]);

  useEffect(() => {
    if (!startupId) return;

    console.log('[Dashboard Realtime] Setting up subscriptions for startup:', startupId);

    const channels = [
      // Tasks channel
      supabase
        .channel(`tasks_${startupId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tasks',
            filter: `startup_id=eq.${startupId}`,
          },
          (payload) => {
            console.log('[Realtime] Tasks changed:', payload.eventType);
            queryClient.invalidateQueries({ queryKey: ['tasks', startupId] });
            invalidateMetrics();
            
            if (payload.eventType === 'INSERT') {
              const newTask = payload.new as { title?: string };
              toast.info(`New task created: ${newTask.title || 'Untitled'}`);
            } else if (payload.eventType === 'UPDATE') {
              const updatedTask = payload.new as { status?: string; title?: string };
              if (updatedTask.status === 'completed') {
                toast.success(`Task completed: ${updatedTask.title || 'Untitled'}`);
              }
            }
          }
        ),

      // Deals channel
      supabase
        .channel(`deals_${startupId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'deals',
            filter: `startup_id=eq.${startupId}`,
          },
          (payload) => {
            console.log('[Realtime] Deals changed:', payload.eventType);
            queryClient.invalidateQueries({ queryKey: ['deals', startupId] });
            invalidateMetrics();
            
            if (payload.eventType === 'UPDATE') {
              const oldDeal = payload.old as { stage?: string };
              const newDeal = payload.new as { stage?: string; name?: string };
              if (oldDeal.stage !== newDeal.stage) {
                toast.success(`Deal "${newDeal.name}" moved to ${newDeal.stage}`);
              }
            }
          }
        ),

      // Events channel
      supabase
        .channel(`events_${startupId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'events',
            filter: `startup_id=eq.${startupId}`,
          },
          (payload) => {
            console.log('[Realtime] Events changed:', payload.eventType);
            queryClient.invalidateQueries({ queryKey: ['events', startupId] });
            queryClient.invalidateQueries({ queryKey: ['upcoming-events'] });
            invalidateMetrics();
          }
        ),

      // Investors channel
      supabase
        .channel(`investors_${startupId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'investors',
            filter: `startup_id=eq.${startupId}`,
          },
          (payload) => {
            console.log('[Realtime] Investors changed:', payload.eventType);
            queryClient.invalidateQueries({ queryKey: ['investors', startupId] });
            invalidateMetrics();
          }
        ),

      // Projects channel
      supabase
        .channel(`projects_${startupId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'projects',
            filter: `startup_id=eq.${startupId}`,
          },
          (payload) => {
            console.log('[Realtime] Projects changed:', payload.eventType);
            queryClient.invalidateQueries({ queryKey: ['projects', startupId] });
            invalidateMetrics();
          }
        ),

      // Documents channel
      supabase
        .channel(`documents_${startupId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'documents',
            filter: `startup_id=eq.${startupId}`,
          },
          (payload) => {
            console.log('[Realtime] Documents changed:', payload.eventType);
            queryClient.invalidateQueries({ queryKey: ['documents', startupId] });
            invalidateMetrics();
          }
        ),

      // Contacts channel  
      supabase
        .channel(`contacts_${startupId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'contacts',
            filter: `startup_id=eq.${startupId}`,
          },
          (payload) => {
            console.log('[Realtime] Contacts changed:', payload.eventType);
            queryClient.invalidateQueries({ queryKey: ['contacts', startupId] });
            invalidateMetrics();
          }
        ),
    ];

    // Subscribe to all channels
    channels.forEach((channel) => {
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Dashboard Realtime] Channel subscribed');
        }
      });
    });

    return () => {
      console.log('[Dashboard Realtime] Cleaning up subscriptions');
      channels.forEach((channel) => {
        supabase.removeChannel(channel);
      });
    };
  }, [startupId, queryClient, invalidateMetrics]);
}

/**
 * Hook for real-time task updates with automatic query invalidation
 */
export function useTasksRealtime(startupId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!startupId) return;

    const channel = supabase
      .channel(`tasks_realtime_${startupId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `startup_id=eq.${startupId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['tasks', startupId] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-metrics', startupId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [startupId, queryClient]);
}

/**
 * Hook for real-time deal updates with automatic query invalidation
 */
export function useDealsRealtime(startupId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!startupId) return;

    const channel = supabase
      .channel(`deals_realtime_${startupId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deals',
          filter: `startup_id=eq.${startupId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['deals', startupId] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-metrics', startupId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [startupId, queryClient]);
}
