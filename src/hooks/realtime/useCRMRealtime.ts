/**
 * CRM Realtime Hook
 * Channel: crm:{startupId}:events
 * 
 * Handles live updates for CRM module with private channels:
 * - Contact enrichment
 * - Deal scoring
 * - Pipeline analysis alerts
 * 
 * @see docs/tasks/01-realtime-tasks.md
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  CRMRealtimeState, 
  ContactEnrichedPayload, 
  DealScoredPayload, 
  RiskPayload 
} from './types';
import { toast } from 'sonner';
import type { RealtimeChannel } from '@supabase/supabase-js';

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
  const channelRef = useRef<RealtimeChannel | null>(null);

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

    // Prevent duplicate subscriptions
    if (channelRef.current) {
      const state = channelRef.current.state;
      if (state === 'joined' || state === 'joining') {
        return;
      }
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const topic = `crm:${startupId}:events`;
    console.log(`[CRM Realtime] Subscribing to ${topic}`);

    const channel = supabase
      .channel(topic, {
        config: {
          broadcast: { self: true, ack: true },
          private: true,
        },
      })
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
      // Also listen to broadcast changes from database triggers
      .on('broadcast', { event: 'UPDATE' }, ({ payload }) => {
        const data = payload as { new?: { enriched_at?: string } };
        if (data.new?.enriched_at) {
          queryClient.invalidateQueries({ queryKey: ['contacts', startupId] });
        }
      });

    channelRef.current = channel;

    // Set auth before subscribing (required for private channels)
    supabase.realtime.setAuth().then(() => {
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[CRM Realtime] ✓ Subscribed to ${topic}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`[CRM Realtime] ✗ Error on ${topic}`);
        }
      });
    });

    return () => {
      if (channelRef.current) {
        console.log('[CRM Realtime] Unsubscribing');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
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
