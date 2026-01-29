/**
 * Canvas Realtime Hook
 * Channel: canvas:{documentId}:events
 * 
 * Handles live updates for Lean Canvas with private channels:
 * - Box validation scores
 * - Autosave confirmations
 * - Co-editing indicators (future)
 * 
 * @see docs/tasks/01-realtime-tasks.md
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CanvasRealtimeState, CanvasPayload } from './types';
import { toast } from 'sonner';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface UseCanvasRealtimeOptions {
  onValidated?: (boxes: Record<string, { status: 'complete' | 'needs_work' | 'missing' }>) => void;
  onSaved?: () => void;
  showToasts?: boolean;
}

const initialState: CanvasRealtimeState = {
  validationScores: {},
  overallScore: null,
  lastSaved: null,
  activeEditors: [],
};

export function useCanvasRealtime(
  documentId: string | undefined,
  options: UseCanvasRealtimeOptions = { showToasts: true }
) {
  const [state, setState] = useState<CanvasRealtimeState>(initialState);
  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

  const handleCanvasValidated = useCallback((payload: CanvasPayload) => {
    if (payload.eventType !== 'canvas_validated') return;

    setState(prev => ({
      ...prev,
      validationScores: payload.boxes || {},
      overallScore: payload.overallScore ?? prev.overallScore,
    }));

    if (payload.boxes) {
      options.onValidated?.(payload.boxes);
    }
  }, [options]);

  const handleCanvasSaved = useCallback((payload: CanvasPayload) => {
    if (payload.eventType !== 'canvas_saved') return;

    setState(prev => ({
      ...prev,
      lastSaved: payload.timestamp,
    }));

    if (options.showToasts) {
      toast.success('Canvas saved', { duration: 1500 });
    }

    options.onSaved?.();
  }, [options]);

  const handleCanvasPrefilled = useCallback((payload: CanvasPayload) => {
    if (payload.eventType !== 'canvas_prefilled') return;

    // Invalidate to refetch prefilled content
    queryClient.invalidateQueries({ queryKey: ['lean-canvas', documentId] });

    if (options.showToasts) {
      toast.success('Canvas prefilled with AI suggestions');
    }
  }, [documentId, queryClient, options]);

  useEffect(() => {
    if (!documentId) return;

    // Prevent duplicate subscriptions
    if (channelRef.current) {
      const state = channelRef.current.state;
      if (state === 'joined' || state === 'joining') {
        return;
      }
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const topic = `canvas:${documentId}:events`;
    console.log(`[Canvas Realtime] Subscribing to ${topic}`);

    const channel = supabase
      .channel(topic, {
        config: {
          broadcast: { self: true, ack: true },
          private: true,
        },
      })
      .on('broadcast', { event: 'canvas_validated' }, ({ payload }) => {
        handleCanvasValidated(payload as CanvasPayload);
      })
      .on('broadcast', { event: 'canvas_saved' }, ({ payload }) => {
        handleCanvasSaved(payload as CanvasPayload);
      })
      .on('broadcast', { event: 'canvas_prefilled' }, ({ payload }) => {
        handleCanvasPrefilled(payload as CanvasPayload);
      })
      // Listen for document changes
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'documents',
          filter: `id=eq.${documentId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['lean-canvas', documentId] });
        }
      );

    channelRef.current = channel;

    // Set auth before subscribing (required for private channels)
    supabase.realtime.setAuth().then(() => {
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[Canvas Realtime] ✓ Subscribed to ${topic}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`[Canvas Realtime] ✗ Error on ${topic}`);
        }
      });
    });

    return () => {
      if (channelRef.current) {
        console.log('[Canvas Realtime] Unsubscribing');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [documentId, handleCanvasValidated, handleCanvasSaved, handleCanvasPrefilled, queryClient]);

  return {
    ...state,
    getBoxStatus: (boxId: string) => state.validationScores[boxId]?.status,
    isComplete: Object.values(state.validationScores).every(b => b.status === 'complete'),
    needsWorkCount: Object.values(state.validationScores).filter(b => b.status === 'needs_work').length,
    missingCount: Object.values(state.validationScores).filter(b => b.status === 'missing').length,
  };
}
