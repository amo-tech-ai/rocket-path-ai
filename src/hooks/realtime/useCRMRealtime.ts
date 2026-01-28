/**
 * CRM Realtime Hook
 * Channel: crm:{startupId}:events
 * 
 * Handles live updates for CRM module:
 * - Contact enrichment
 * - Deal scoring
 * - Pipeline analysis alerts
 */

import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  CRMRealtimeState, 
  ContactEnrichedPayload, 
  DealScoredPayload, 
  RiskPayload 
} from './types';
import { toast } from 'sonner';

interface UseCRMRealtimeOptions {
  onContactEnriched?: (payload: ContactEnrichedPayload) => void;
  onDealScored?: (payload: DealScoredPayload) => void;
  onRiskDetected?: (payload: RiskPayload) => void;
  showToasts?: boolean;
}

const initialState: CRMRealtimeState = {
  enrichedContacts: new Map(),
  dealScores: new Map(),
  pipelineAlerts: [],
};

export function useCRMRealtime(
  startupId: string | undefined,
  options: UseCRMRealtimeOptions = { showToasts: true }
) {
  const [state, setState] = useState<CRMRealtimeState>(initialState);
  const queryClient = useQueryClient();

  const handleContactEnriched = useCallback((payload: ContactEnrichedPayload) => {
    setState(prev => {
      const newContacts = new Map(prev.enrichedContacts);
      newContacts.set(payload.contactId, payload);
      return { ...prev, enrichedContacts: newContacts };
    });

    // Invalidate contacts query
    queryClient.invalidateQueries({ queryKey: ['contacts', startupId] });

    if (options.showToasts) {
      toast.success('Contact enriched', {
        description: `Score improved to ${payload.newScore}`,
      });
    }

    options.onContactEnriched?.(payload);
  }, [queryClient, startupId, options]);

  const handleDealScored = useCallback((payload: DealScoredPayload) => {
    setState(prev => {
      const newScores = new Map(prev.dealScores);
      newScores.set(payload.dealId, payload);
      return { ...prev, dealScores: newScores };
    });

    // Invalidate deals query
    queryClient.invalidateQueries({ queryKey: ['deals', startupId] });

    if (options.showToasts && payload.oldProbability !== undefined) {
      const change = payload.newProbability - payload.oldProbability;
      const direction = change > 0 ? 'increased' : 'decreased';
      toast.info(`Deal probability ${direction}`, {
        description: `${payload.newProbability}% (${change > 0 ? '+' : ''}${change}%)`,
      });
    }

    options.onDealScored?.(payload);
  }, [queryClient, startupId, options]);

  const handlePipelineAnalyzed = useCallback((payload: RiskPayload) => {
    if (payload.riskType !== 'deal') return;

    setState(prev => ({
      ...prev,
      pipelineAlerts: [...prev.pipelineAlerts, payload].slice(-10), // Keep last 10
    }));

    if (options.showToasts && payload.severity !== 'low') {
      toast.warning(payload.title, {
        description: payload.description,
      });
    }

    options.onRiskDetected?.(payload);
  }, [options]);

  const dismissAlert = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      pipelineAlerts: prev.pipelineAlerts.filter((_, i) => i !== index),
    }));
  }, []);

  const clearAlerts = useCallback(() => {
    setState(prev => ({ ...prev, pipelineAlerts: [] }));
  }, []);

  useEffect(() => {
    if (!startupId) return;

    console.log('[CRM Realtime] Subscribing to startup:', startupId);

    const channel = supabase
      .channel(`crm:${startupId}:events`)
      .on('broadcast', { event: 'contact_enriched' }, ({ payload }) => {
        handleContactEnriched(payload as ContactEnrichedPayload);
      })
      .on('broadcast', { event: 'deal_scored' }, ({ payload }) => {
        handleDealScored(payload as DealScoredPayload);
      })
      .on('broadcast', { event: 'pipeline_analyzed' }, ({ payload }) => {
        handlePipelineAnalyzed(payload as RiskPayload);
      })
      .on('broadcast', { event: 'risk_detected' }, ({ payload }) => {
        const risk = payload as RiskPayload;
        if (risk.riskType === 'deal') {
          handlePipelineAnalyzed(risk);
        }
      })
      // Also listen to postgres changes for immediate updates
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'contacts',
          filter: `startup_id=eq.${startupId}`,
        },
        (payload) => {
          const contact = payload.new as { id: string; enriched_at?: string };
          if (contact.enriched_at) {
            queryClient.invalidateQueries({ queryKey: ['contacts', startupId] });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'deals',
          filter: `startup_id=eq.${startupId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['deals', startupId] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[CRM Realtime] Channel subscribed');
        }
      });

    return () => {
      console.log('[CRM Realtime] Unsubscribing');
      supabase.removeChannel(channel);
    };
  }, [startupId, handleContactEnriched, handleDealScored, handlePipelineAnalyzed, queryClient]);

  return {
    ...state,
    dismissAlert,
    clearAlerts,
    getContactScore: (contactId: string) => state.enrichedContacts.get(contactId)?.newScore,
    getDealScore: (dealId: string) => state.dealScores.get(dealId)?.newProbability,
  };
}
