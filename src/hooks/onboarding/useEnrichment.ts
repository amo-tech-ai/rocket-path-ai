/**
 * Enrichment Mutations
 * Handles URL, context, and founder enrichment via Gemini AI
 */

import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { invokeAgent } from './invokeAgent';
import type {
  EnrichUrlParams,
  EnrichContextParams,
  EnrichFounderParams,
  EnrichmentResult,
  FounderEnrichmentResult,
} from './types';

export function useEnrichment() {
  const { toast } = useToast();

  // Enrich from URL
  const enrichUrlMutation = useMutation({
    mutationFn: (params: EnrichUrlParams): Promise<EnrichmentResult> =>
      invokeAgent({
        action: 'enrich_url',
        session_id: params.session_id,
        url: params.url,
      }),
    onError: (error) => {
      console.error('URL enrichment failed:', error);
      toast({
        title: 'Enrichment failed',
        description: 'Could not extract data from URL. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Enrich from context/description
  const enrichContextMutation = useMutation({
    mutationFn: (params: EnrichContextParams): Promise<EnrichmentResult> =>
      invokeAgent({
        action: 'enrich_context',
        session_id: params.session_id,
        description: params.description,
        target_market: params.target_market,
      }),
    onError: (error) => {
      console.error('Context enrichment failed:', error);
      toast({
        title: 'Enrichment failed',
        description: 'Could not analyze your description. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Enrich founder from LinkedIn
  const enrichFounderMutation = useMutation({
    mutationFn: (params: EnrichFounderParams): Promise<FounderEnrichmentResult> =>
      invokeAgent<FounderEnrichmentResult>({
        action: 'enrich_founder',
        session_id: params.session_id,
        linkedin_url: params.linkedin_url,
        name: params.name,
      }),
    onError: (error) => {
      console.error('Founder enrichment failed:', error);
    },
  });

  return {
    enrichUrl: enrichUrlMutation.mutateAsync,
    enrichContext: enrichContextMutation.mutateAsync,
    enrichFounder: enrichFounderMutation.mutateAsync,
    isEnrichingUrl: enrichUrlMutation.isPending,
    isEnrichingContext: enrichContextMutation.isPending,
    isEnrichingFounder: enrichFounderMutation.isPending,
  };
}
