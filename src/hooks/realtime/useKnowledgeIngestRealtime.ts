/**
 * Knowledge Ingest Realtime Hook
 * Channel: knowledge:{documentId}:ingest
 *
 * Provides live progress updates during knowledge document ingestion:
 * - ingest_started: initial notification with total chunks
 * - batch_completed: per-batch progress with percentage
 * - ingest_complete: final summary
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface IngestProgress {
  documentId: string;
  title?: string;
  chunksTotal: number;
  chunksProcessed: number;
  percentComplete: number;
  batch: number;
  batchesTotal: number;
  status: 'idle' | 'ingesting' | 'complete' | 'failed';
  errors: number;
}

const initialProgress: IngestProgress = {
  documentId: '',
  chunksTotal: 0,
  chunksProcessed: 0,
  percentComplete: 0,
  batch: 0,
  batchesTotal: 0,
  status: 'idle',
  errors: 0,
};

interface UseKnowledgeIngestRealtimeOptions {
  onComplete?: (progress: IngestProgress) => void;
  onError?: (progress: IngestProgress) => void;
}

export function useKnowledgeIngestRealtime(
  documentId: string | undefined,
  options: UseKnowledgeIngestRealtimeOptions = {},
) {
  const [progress, setProgress] = useState<IngestProgress>(initialProgress);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const handleStarted = useCallback((payload: Record<string, unknown>) => {
    setProgress({
      documentId: (payload.documentId as string) || '',
      title: payload.title as string | undefined,
      chunksTotal: (payload.chunksTotal as number) || 0,
      chunksProcessed: 0,
      percentComplete: 0,
      batch: 0,
      batchesTotal: (payload.batchesTotal as number) || 0,
      status: 'ingesting',
      errors: 0,
    });
  }, []);

  const handleBatchCompleted = useCallback((payload: Record<string, unknown>) => {
    setProgress(prev => ({
      ...prev,
      batch: (payload.batch as number) || prev.batch,
      batchesTotal: (payload.batchesTotal as number) || prev.batchesTotal,
      chunksProcessed: (payload.chunksProcessed as number) || prev.chunksProcessed,
      chunksTotal: (payload.chunksTotal as number) || prev.chunksTotal,
      percentComplete: (payload.percentComplete as number) || prev.percentComplete,
    }));
  }, []);

  const handleComplete = useCallback((payload: Record<string, unknown>) => {
    const final: IngestProgress = {
      documentId: (payload.documentId as string) || '',
      chunksTotal: (payload.chunksTotal as number) || 0,
      chunksProcessed: (payload.chunksCreated as number) || 0,
      percentComplete: 100,
      batch: 0,
      batchesTotal: 0,
      status: (payload.errors as number) > 0 ? 'failed' : 'complete',
      errors: (payload.errors as number) || 0,
    };
    setProgress(final);
    if (final.errors > 0) {
      options.onError?.(final);
    } else {
      options.onComplete?.(final);
    }
  }, [options]);

  useEffect(() => {
    if (!documentId) return;

    if (channelRef.current) {
      const state = channelRef.current.state;
      if (state === 'joined' || state === 'joining') return;
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const topic = `knowledge:${documentId}:ingest`;
    console.log(`[Knowledge Ingest Realtime] Subscribing to ${topic}`);

    const channel = supabase
      .channel(topic, {
        config: {
          broadcast: { self: true, ack: true },
          private: true,
        },
      })
      .on('broadcast', { event: 'ingest_started' }, ({ payload }) => {
        handleStarted(payload as Record<string, unknown>);
      })
      .on('broadcast', { event: 'batch_completed' }, ({ payload }) => {
        handleBatchCompleted(payload as Record<string, unknown>);
      })
      .on('broadcast', { event: 'ingest_complete' }, ({ payload }) => {
        handleComplete(payload as Record<string, unknown>);
      });

    channelRef.current = channel;

    supabase.realtime.setAuth().then(() => {
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[Knowledge Ingest Realtime] Subscribed to ${topic}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.warn(`[Knowledge Ingest Realtime] Channel unavailable: ${topic}`);
        }
      });
    });

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [documentId, handleStarted, handleBatchCompleted, handleComplete]);

  return {
    progress,
    isIngesting: progress.status === 'ingesting',
    isComplete: progress.status === 'complete',
    isFailed: progress.status === 'failed',
    reset: () => setProgress(initialProgress),
  };
}
