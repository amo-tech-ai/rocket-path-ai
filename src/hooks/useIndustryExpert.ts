/**
 * useIndustryExpert Hook
 * Frontend interface for industry-expert-agent edge function
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// ============================================================================
// Types
// ============================================================================

export interface IndustryPack {
  industry: string;
  display_name: string;
  description: string;
  icon: string;
  startup_types: { id: string; label: string; description: string }[];
  is_active: boolean;
}

export interface IndustryContext {
  industry: string;
  display_name: string;
  description: string;
  advisor_persona: string;
  advisor_system_prompt: string;
  terminology: { term: string; definition: string }[];
  benchmarks: Record<string, unknown>;
  competitive_intel: Record<string, unknown>;
  mental_models: string[];
  diagnostics: unknown[];
  market_context: Record<string, unknown>;
  success_stories: unknown[];
  common_mistakes: string[];
  investor_expectations: Record<string, unknown>;
  startup_types: { id: string; label: string; description: string }[];
  question_intro: string;
}

export interface IndustryQuestion {
  id: string;
  question_key: string;
  category: string;
  question: string;
  why_this_matters: string;
  thinking_prompt: string;
  ai_coach_prompt: string;
  quality_criteria: Record<string, unknown>;
  red_flags: string[];
  examples: unknown[];
  input_type: string;
  input_options: unknown;
  outputs_to: string[];
  is_required: boolean;
  display_order: number;
}

export interface CoachingResult {
  coaching: string;
  question: string;
  outputs_to: string[];
}

export interface CanvasValidation {
  overall_score: number;
  sections: Record<string, { score: number; feedback: string; suggestions: string[] }>;
  industry_specific_insights: string[];
  recommended_next_steps: string[];
}

export interface PitchFeedback {
  overall_score: number;
  investment_readiness: 'not_ready' | 'early' | 'promising' | 'investor_ready';
  strengths: string[];
  weaknesses: string[];
  critical_gaps: string[];
  slide_feedback: { slide_type: string; score: number; feedback: string; improvement: string }[];
  investor_questions: string[];
  next_steps: string[];
}

export interface CompetitorAnalysis {
  direct_competitors: { name: string; description: string; strengths: string[]; weaknesses: string[]; pricing: string; target_segment: string }[];
  indirect_competitors: { name: string; how_they_compete: string }[];
  market_gaps: string[];
  differentiation_opportunities: string[];
  competitive_moat_suggestions: string[];
}

// ============================================================================
// Helper: Invoke Industry Expert Agent
// ============================================================================

async function invokeIndustryExpert<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase.functions.invoke('industry-expert-agent', {
    body: { action, ...payload },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) throw error;
  return data as T;
}

// ============================================================================
// Queries
// ============================================================================

/**
 * Fetch all active industry packs
 */
export function useIndustryPacks() {
  return useQuery({
    queryKey: ['industry-packs'],
    queryFn: async () => {
      const result = await invokeIndustryExpert<{ success: boolean; packs: IndustryPack[] }>(
        'get_industry_context',
        {}
      );
      return result.packs || [];
    },
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  });
}

/**
 * Fetch full context for a specific industry
 */
export function useIndustryContext(industry: string | undefined) {
  return useQuery({
    queryKey: ['industry-context', industry],
    queryFn: async () => {
      if (!industry) return null;
      const result = await invokeIndustryExpert<{ success: boolean; context: IndustryContext }>(
        'get_industry_context',
        { industry }
      );
      return result.context;
    },
    enabled: !!industry,
    staleTime: 1000 * 60 * 30,
  });
}

/**
 * Fetch industry questions
 */
export function useIndustryQuestions(
  industry: string | undefined,
  category?: string,
  stage?: string,
  context?: string
) {
  return useQuery({
    queryKey: ['industry-questions', industry, category, stage, context],
    queryFn: async () => {
      if (!industry) return [];
      const result = await invokeIndustryExpert<{ 
        success: boolean; 
        questions: IndustryQuestion[];
        count: number;
        categories: string[];
      }>(
        'get_questions',
        { industry, category, stage, context }
      );
      return result.questions || [];
    },
    enabled: !!industry,
    staleTime: 1000 * 60 * 15,
  });
}

/**
 * Fetch industry benchmarks
 */
export function useIndustryBenchmarks(industry: string | undefined, stage?: string) {
  return useQuery({
    queryKey: ['industry-benchmarks', industry, stage],
    queryFn: async () => {
      if (!industry) return null;
      const result = await invokeIndustryExpert<{
        success: boolean;
        benchmarks: Record<string, unknown>;
        terminology: unknown[];
        competitive_intel: Record<string, unknown>;
        market_context: Record<string, unknown>;
      }>(
        'get_benchmarks',
        { industry, stage }
      );
      return result;
    },
    enabled: !!industry,
    staleTime: 1000 * 60 * 30,
  });
}

// ============================================================================
// Mutations
// ============================================================================

/**
 * Get AI coaching on an answer
 */
export function useCoachAnswer() {
  return useMutation({
    mutationFn: async ({ 
      industry, 
      questionKey, 
      answer 
    }: { 
      industry: string; 
      questionKey: string; 
      answer: string;
    }) => {
      return invokeIndustryExpert<{ success: boolean } & CoachingResult>(
        'coach_answer',
        { industry, question_key: questionKey, answer }
      );
    },
    onError: (error) => {
      console.error('Coach answer error:', error);
      toast.error('Failed to get coaching feedback');
    },
  });
}

/**
 * Validate a Lean Canvas with industry context
 */
export function useValidateCanvas() {
  return useMutation({
    mutationFn: async ({ 
      industry, 
      canvasData 
    }: { 
      industry: string; 
      canvasData: Record<string, unknown>;
    }) => {
      return invokeIndustryExpert<{ success: boolean; validation: CanvasValidation }>(
        'validate_canvas',
        { industry, canvas_data: canvasData }
      );
    },
    onSuccess: (data) => {
      if (data.success && data.validation?.overall_score) {
        const score = data.validation.overall_score;
        if (score >= 80) {
          toast.success(`Canvas Score: ${score}/100 - Excellent!`);
        } else if (score >= 60) {
          toast.info(`Canvas Score: ${score}/100 - Good progress`);
        } else {
          toast.warning(`Canvas Score: ${score}/100 - Needs work`);
        }
      }
    },
    onError: (error) => {
      console.error('Validate canvas error:', error);
      toast.error('Failed to validate canvas');
    },
  });
}

/**
 * Get pitch deck feedback from industry perspective
 */
export function usePitchFeedback() {
  return useMutation({
    mutationFn: async ({ 
      industry, 
      pitchData 
    }: { 
      industry: string; 
      pitchData: Record<string, unknown>;
    }) => {
      return invokeIndustryExpert<{ success: boolean; feedback: PitchFeedback }>(
        'pitch_feedback',
        { industry, pitch_data: pitchData }
      );
    },
    onSuccess: (data) => {
      if (data.success && data.feedback?.overall_score) {
        const score = data.feedback.overall_score;
        toast.success(`Pitch Score: ${score}/100`);
      }
    },
    onError: (error) => {
      console.error('Pitch feedback error:', error);
      toast.error('Failed to get pitch feedback');
    },
  });
}

/**
 * Analyze competitors for an industry
 */
export function useAnalyzeCompetitors() {
  return useMutation({
    mutationFn: async ({ 
      industry, 
      startupId 
    }: { 
      industry: string; 
      startupId?: string;
    }) => {
      return invokeIndustryExpert<{ success: boolean; analysis: CompetitorAnalysis }>(
        'analyze_competitors',
        { industry, startup_id: startupId }
      );
    },
    onSuccess: (data) => {
      if (data.success && data.analysis?.direct_competitors) {
        toast.success(`Found ${data.analysis.direct_competitors.length} competitors`);
      }
    },
    onError: (error) => {
      console.error('Analyze competitors error:', error);
      toast.error('Failed to analyze competitors');
    },
  });
}

// ============================================================================
// Composite Hook
// ============================================================================

export function useIndustryExpert() {
  return {
    coachAnswer: useCoachAnswer(),
    validateCanvas: useValidateCanvas(),
    pitchFeedback: usePitchFeedback(),
    analyzeCompetitors: useAnalyzeCompetitors(),
  };
}
