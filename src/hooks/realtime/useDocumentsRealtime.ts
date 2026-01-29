/**
 * Documents Realtime Hook
 * Channel: documents:{startupId}:events
 * 
 * Handles live updates for document module with private channels:
 * - Document analysis results
 * - Quality score updates
 * - AI suggestions
 * 
 * @see docs/tasks/01-realtime-tasks.md
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DocumentsRealtimeState, DocumentAnalyzedPayload } from './types';
import { toast } from 'sonner';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface UseDocumentsRealtimeOptions {
  onDocumentAnalyzed?: (payload: DocumentAnalyzedPayload) => void;
  showToasts?: boolean;
}

const initialState: DocumentsRealtimeState = {
  analysisResults: new Map(),
};

export function useDocumentsRealtime(
  startupId: string | undefined,
  options: UseDocumentsRealtimeOptions = { showToasts: true }
) {
  const [state, setState] = useState<DocumentsRealtimeState>(initialState);
  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

  const handleDocumentAnalyzed = useCallback((payload: DocumentAnalyzedPayload) => {
    setState(prev => {
      const newResults = new Map(prev.analysisResults);
      newResults.set(payload.documentId, payload);
      return { ...prev, analysisResults: newResults };
    });

    // Invalidate documents query
    queryClient.invalidateQueries({ queryKey: ['documents', startupId] });
    queryClient.invalidateQueries({ queryKey: ['document', payload.documentId] });

    if (options.showToasts) {
      toast.success('Document analyzed', {
        description: `Quality score: ${payload.qualityScore}%`,
      });
    }

    options.onDocumentAnalyzed?.(payload);
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

    const topic = `documents:${startupId}:events`;
    console.log(`[Documents Realtime] Subscribing to ${topic}`);

    const channel = supabase
      .channel(topic, {
        config: {
          broadcast: { self: true, ack: true },
          private: true,
        },
      })
      .on('broadcast', { event: 'document_analyzed' }, ({ payload }) => {
        handleDocumentAnalyzed(payload as DocumentAnalyzedPayload);
      })
      // Listen for table changes via broadcast
      .on('broadcast', { event: 'INSERT' }, ({ payload }) => {
        queryClient.invalidateQueries({ queryKey: ['documents', startupId] });
        
        const doc = (payload as { new?: { title?: string } })?.new;
        if (options.showToasts && doc?.title) {
          toast.info(`New document: ${doc.title}`);
        }
      })
      .on('broadcast', { event: 'UPDATE' }, () => {
        queryClient.invalidateQueries({ queryKey: ['documents', startupId] });
      })
      .on('broadcast', { event: 'DELETE' }, () => {
        queryClient.invalidateQueries({ queryKey: ['documents', startupId] });
      });

    channelRef.current = channel;

    // Set auth before subscribing (required for private channels)
    supabase.realtime.setAuth().then(() => {
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[Documents Realtime] ✓ Subscribed to ${topic}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`[Documents Realtime] ✗ Error on ${topic}`);
        }
      });
    });

    return () => {
      if (channelRef.current) {
        console.log('[Documents Realtime] Unsubscribing');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [startupId, handleDocumentAnalyzed, queryClient, options]);

  return {
    ...state,
    getAnalysis: (documentId: string) => state.analysisResults.get(documentId),
    getQualityScore: (documentId: string) => state.analysisResults.get(documentId)?.qualityScore,
    getSuggestions: (documentId: string) => state.analysisResults.get(documentId)?.suggestions || [],
  };
}
