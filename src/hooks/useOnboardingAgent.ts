import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EnrichUrlParams {
  session_id: string;
  url: string;
}

interface EnrichContextParams {
  session_id: string;
  description: string;
  target_market?: string;
}

interface CompleteWizardParams {
  session_id: string;
}

interface EnrichmentResult {
  success: boolean;
  extractions?: {
    company_name?: string;
    industry?: string;
    description?: string;
    features?: string[];
    target_audience?: string;
    competitors?: string[];
    pricing_model?: string;
    unique_value_proposition?: string;
  };
  error?: string;
}

interface CompleteWizardResult {
  success: boolean;
  startup_id?: string;
  tasks_created?: number;
  error?: string;
}

export function useOnboardingAgent() {
  const { toast } = useToast();

  // Enrich from URL
  const enrichUrlMutation = useMutation({
    mutationFn: async (params: EnrichUrlParams): Promise<EnrichmentResult> => {
      const response = await supabase.functions.invoke('onboarding-agent', {
        body: {
          action: 'enrich_url',
          session_id: params.session_id,
          url: params.url,
        },
      });

      if (response.error) throw response.error;
      return response.data;
    },
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
    mutationFn: async (params: EnrichContextParams): Promise<EnrichmentResult> => {
      const response = await supabase.functions.invoke('onboarding-agent', {
        body: {
          action: 'enrich_context',
          session_id: params.session_id,
          description: params.description,
          target_market: params.target_market,
        },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onError: (error) => {
      console.error('Context enrichment failed:', error);
      toast({
        title: 'Enrichment failed',
        description: 'Could not analyze your description. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Complete wizard
  const completeWizardMutation = useMutation({
    mutationFn: async (params: CompleteWizardParams): Promise<CompleteWizardResult> => {
      const response = await supabase.functions.invoke('onboarding-agent', {
        body: {
          action: 'complete_wizard',
          session_id: params.session_id,
        },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: 'Setup complete!',
        description: `Your startup profile has been created${data.tasks_created ? ` with ${data.tasks_created} tasks` : ''}.`,
      });
    },
    onError: (error) => {
      console.error('Complete wizard failed:', error);
      toast({
        title: 'Setup failed',
        description: 'Could not complete setup. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Run AI analysis
  const runAnalysisMutation = useMutation({
    mutationFn: async (params: { session_id: string }): Promise<{ success: boolean; analysis?: Record<string, unknown> }> => {
      const response = await supabase.functions.invoke('onboarding-agent', {
        body: {
          action: 'run_analysis',
          session_id: params.session_id,
        },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onError: (error) => {
      console.error('Analysis failed:', error);
      toast({
        title: 'Analysis failed',
        description: 'Could not run AI analysis. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    enrichUrl: enrichUrlMutation.mutateAsync,
    enrichContext: enrichContextMutation.mutateAsync,
    completeWizard: completeWizardMutation.mutateAsync,
    runAnalysis: runAnalysisMutation.mutateAsync,
    isEnrichingUrl: enrichUrlMutation.isPending,
    isEnrichingContext: enrichContextMutation.isPending,
    isCompletingWizard: completeWizardMutation.isPending,
    isRunningAnalysis: runAnalysisMutation.isPending,
    isProcessing:
      enrichUrlMutation.isPending ||
      enrichContextMutation.isPending ||
      completeWizardMutation.isPending ||
      runAnalysisMutation.isPending,
  };
}

export default useOnboardingAgent;
