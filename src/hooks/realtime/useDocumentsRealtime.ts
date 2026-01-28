/**
 * Documents Realtime Hook
 * Channel: documents:{startupId}:events
 * 
 * Handles live updates for document module:
 * - Document analysis results
 * - Quality score updates
 * - AI suggestions
 */

import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DocumentsRealtimeState, DocumentAnalyzedPayload } from './types';
import { toast } from 'sonner';

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

    console.log('[Documents Realtime] Subscribing to startup:', startupId);

    const channel = supabase
      .channel(`documents:${startupId}:events`)
      .on('broadcast', { event: 'document_analyzed' }, ({ payload }) => {
        handleDocumentAnalyzed(payload as DocumentAnalyzedPayload);
      })
      // Listen for document table changes
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents',
          filter: `startup_id=eq.${startupId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['documents', startupId] });
          
          if (payload.eventType === 'INSERT') {
            const doc = payload.new as { title?: string };
            if (options.showToasts) {
              toast.info(`New document: ${doc.title || 'Untitled'}`);
            }
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Documents Realtime] Channel subscribed');
        }
      });

    return () => {
      console.log('[Documents Realtime] Unsubscribing');
      supabase.removeChannel(channel);
    };
  }, [startupId, handleDocumentAnalyzed, queryClient, options]);

  return {
    ...state,
    getAnalysis: (documentId: string) => state.analysisResults.get(documentId),
    getQualityScore: (documentId: string) => state.analysisResults.get(documentId)?.qualityScore,
    getSuggestions: (documentId: string) => state.analysisResults.get(documentId)?.suggestions || [],
  };
}
