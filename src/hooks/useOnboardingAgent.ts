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

  // Enrich founder from LinkedIn
  const enrichFounderMutation = useMutation({
    mutationFn: async (params: { session_id: string; linkedin_url: string; name?: string }) => {
      const response = await supabase.functions.invoke('onboarding-agent', {
        body: {
          action: 'enrich_founder',
          session_id: params.session_id,
          linkedin_url: params.linkedin_url,
          name: params.name,
        },
      });
      if (response.error) throw response.error;
      return response.data;
    },
    onError: (error) => {
      console.error('Founder enrichment failed:', error);
    },
  });

  // Calculate readiness score (Step 2)
  const calculateReadinessMutation = useMutation({
    mutationFn: async (params: { session_id: string }) => {
      const response = await supabase.functions.invoke('onboarding-agent', {
        body: {
          action: 'calculate_readiness',
          session_id: params.session_id,
        },
      });
      if (response.error) throw response.error;
      return response.data;
    },
    onError: (error) => {
      console.error('Readiness calculation failed:', error);
    },
  });

  // Get interview questions (Step 3)
  const getQuestionsMutation = useMutation({
    mutationFn: async (params: { session_id: string; answered_question_ids?: string[] }) => {
      const response = await supabase.functions.invoke('onboarding-agent', {
        body: {
          action: 'get_questions',
          session_id: params.session_id,
          answered_question_ids: params.answered_question_ids || [],
        },
      });
      if (response.error) throw response.error;
      return response.data;
    },
    onError: (error) => {
      console.error('Get questions failed:', error);
    },
  });

  // Process answer (Step 3)
  const processAnswerMutation = useMutation({
    mutationFn: async (params: { session_id: string; question_id: string; answer_id: string; answer_text?: string }) => {
      const response = await supabase.functions.invoke('onboarding-agent', {
        body: {
          action: 'process_answer',
          session_id: params.session_id,
          question_id: params.question_id,
          answer_id: params.answer_id,
          answer_text: params.answer_text,
        },
      });
      if (response.error) throw response.error;
      return response.data;
    },
    onError: (error) => {
      console.error('Process answer failed:', error);
    },
  });

  // Calculate investor score (Step 4)
  const calculateScoreMutation = useMutation({
    mutationFn: async (params: { session_id: string }) => {
      const response = await supabase.functions.invoke('onboarding-agent', {
        body: {
          action: 'calculate_score',
          session_id: params.session_id,
        },
      });
      if (response.error) throw response.error;
      return response.data;
    },
    onError: (error) => {
      console.error('Calculate score failed:', error);
    },
  });

  // Generate summary (Step 4)
  const generateSummaryMutation = useMutation({
    mutationFn: async (params: { session_id: string }) => {
      const response = await supabase.functions.invoke('onboarding-agent', {
        body: {
          action: 'generate_summary',
          session_id: params.session_id,
        },
      });
      if (response.error) throw response.error;
      return response.data;
    },
    onError: (error) => {
      console.error('Generate summary failed:', error);
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
    enrichFounder: enrichFounderMutation.mutateAsync,
    calculateReadiness: calculateReadinessMutation.mutateAsync,
    getQuestions: getQuestionsMutation.mutateAsync,
    processAnswer: processAnswerMutation.mutateAsync,
    calculateScore: calculateScoreMutation.mutateAsync,
    generateSummary: generateSummaryMutation.mutateAsync,
    completeWizard: completeWizardMutation.mutateAsync,
    runAnalysis: runAnalysisMutation.mutateAsync,
    isEnrichingUrl: enrichUrlMutation.isPending,
    isEnrichingContext: enrichContextMutation.isPending,
    isEnrichingFounder: enrichFounderMutation.isPending,
    isCalculatingReadiness: calculateReadinessMutation.isPending,
    isGettingQuestions: getQuestionsMutation.isPending,
    isProcessingAnswer: processAnswerMutation.isPending,
    isCalculatingScore: calculateScoreMutation.isPending,
    isGeneratingSummary: generateSummaryMutation.isPending,
    isCompletingWizard: completeWizardMutation.isPending,
    isRunningAnalysis: runAnalysisMutation.isPending,
    isProcessing:
      enrichUrlMutation.isPending ||
      enrichContextMutation.isPending ||
      enrichFounderMutation.isPending ||
      calculateReadinessMutation.isPending ||
      getQuestionsMutation.isPending ||
      processAnswerMutation.isPending ||
      calculateScoreMutation.isPending ||
      generateSummaryMutation.isPending ||
      completeWizardMutation.isPending ||
      runAnalysisMutation.isPending,
  };
}

export default useOnboardingAgent;
