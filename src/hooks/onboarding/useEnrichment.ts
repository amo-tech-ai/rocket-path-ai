/**
 * Enrichment Mutations
 * Handles URL, context, founder enrichment, and competitor generation via Gemini AI
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
  SessionIdParams,
} from './types';

interface CompetitorResult {
  success: boolean;
  competitors?: Array<{
    name: string;
    website?: string;
    description?: string;
    funding?: string;
    differentiator?: string;
  }>;
  market_trends?: string[];
}

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

  // Generate competitors using AI with Google Search grounding
  const generateCompetitorsMutation = useMutation({
    mutationFn: (params: SessionIdParams): Promise<CompetitorResult> =>
      invokeAgent<CompetitorResult>({
        action: 'generate_competitors',
        session_id: params.session_id,
      }),
    onSuccess: () => {
      toast({
        title: 'Competitors updated',
        description: 'AI found new competitor insights from web search.',
      });
    },
    onError: (error) => {
      console.error('Competitor generation failed:', error);
      toast({
        title: 'Re-scan failed',
        description: 'Could not find competitor data. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    enrichUrl: enrichUrlMutation.mutateAsync,
    enrichContext: enrichContextMutation.mutateAsync,
    enrichFounder: enrichFounderMutation.mutateAsync,
    generateCompetitors: generateCompetitorsMutation.mutateAsync,
    isEnrichingUrl: enrichUrlMutation.isPending,
    isEnrichingContext: enrichContextMutation.isPending,
    isEnrichingFounder: enrichFounderMutation.isPending,
    isGeneratingCompetitors: generateCompetitorsMutation.isPending,
  };
}
