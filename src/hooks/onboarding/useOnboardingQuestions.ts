/**
 * Dynamic Onboarding Questions Hook
 * Fetches industry-specific questions from industry_playbooks table
 * Implements Task 20: Dynamic Question Rendering & Onboarding Flow
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DynamicQuestion {
  id: string;
  text: string;
  type: 'multiple_choice' | 'multi_select' | 'text' | 'number';
  topic: string;
  priority: 'high' | 'medium' | 'low';
  why_matters: string;
  benchmark?: string;
  options?: { id: string; text: string; emoji?: string }[];
  industry_specific: boolean;
}

interface UseOnboardingQuestionsOptions {
  industryId?: string;
  stage?: string;
  maxQuestions?: number;
}

export function useOnboardingQuestions({
  industryId,
  stage = 'Idea',
  maxQuestions = 5,
}: UseOnboardingQuestionsOptions = {}) {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<DynamicQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch industry-specific questions from the industry-expert-agent
  const fetchQuestions = useCallback(async (industry?: string) => {
    const targetIndustry = industry || industryId;
    setIsLoading(true);
    setError(null);

    try {
      // Call industry-expert-agent with get_questions action
      const { data, error: fnError } = await supabase.functions.invoke('industry-expert-agent', {
        body: {
          action: 'get_questions',
          industry: targetIndustry,
          stage,
          context: 'onboarding',
          max_questions: maxQuestions,
        },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.questions && Array.isArray(data.questions)) {
        // Transform to DynamicQuestion format
        const dynamicQuestions: DynamicQuestion[] = data.questions.map((q: any, idx: number) => ({
          id: q.id || `q_${idx}`,
          text: q.text || q.question,
          type: q.type || 'multiple_choice',
          topic: q.topic || q.category || 'general',
          priority: q.priority || 'medium',
          why_matters: q.why_matters || q.rationale || 'This helps us understand your business better.',
          benchmark: q.benchmark,
          options: q.options || generateDefaultOptions(q.type),
          industry_specific: true,
        }));

        setQuestions(dynamicQuestions);
        return dynamicQuestions;
      }

      // Fallback to universal questions if no industry-specific ones
      const fallbackQuestions = getUniversalQuestions(stage);
      setQuestions(fallbackQuestions);
      return fallbackQuestions;

    } catch (err) {
      console.error('[useOnboardingQuestions] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch questions');
      
      // Use fallback questions on error
      const fallbackQuestions = getUniversalQuestions(stage);
      setQuestions(fallbackQuestions);
      return fallbackQuestions;
    } finally {
      setIsLoading(false);
    }
  }, [industryId, stage, maxQuestions, toast]);

  return {
    questions,
    isLoading,
    error,
    fetchQuestions,
  };
}

// Generate default options based on question type
function generateDefaultOptions(type: string) {
  if (type === 'number' || type === 'text') {
    return undefined;
  }
  return [
    { id: 'a1', text: 'Not yet' },
    { id: 'a2', text: 'Working on it' },
    { id: 'a3', text: 'In progress' },
    { id: 'a4', text: 'Completed' },
  ];
}

// Universal questions for any industry/stage
function getUniversalQuestions(stage: string): DynamicQuestion[] {
  const ideaQuestions: DynamicQuestion[] = [
    {
      id: 'q1_problem',
      text: 'How clearly defined is the problem you\'re solving?',
      type: 'multiple_choice',
      topic: 'problem',
      priority: 'high',
      why_matters: 'A well-defined problem is the foundation of product-market fit.',
      industry_specific: false,
      options: [
        { id: 'a1', text: 'Still exploring', emoji: '🔍' },
        { id: 'a2', text: 'Have initial hypothesis', emoji: '💡' },
        { id: 'a3', text: 'Validated with 5+ interviews', emoji: '✅' },
        { id: 'a4', text: 'Proven with customer data', emoji: '📊' },
      ],
    },
    {
      id: 'q2_customers',
      text: 'How many potential customers have you spoken to?',
      type: 'multiple_choice',
      topic: 'validation',
      priority: 'high',
      why_matters: 'Customer discovery is crucial for understanding market needs.',
      industry_specific: false,
      options: [
        { id: 'a1', text: 'None yet' },
        { id: 'a2', text: '1-5 conversations' },
        { id: 'a3', text: '5-20 conversations' },
        { id: 'a4', text: '20+ conversations' },
      ],
    },
    {
      id: 'q3_competition',
      text: 'How do you differentiate from existing solutions?',
      type: 'multiple_choice',
      topic: 'market',
      priority: 'medium',
      why_matters: 'Understanding competition helps position your unique value.',
      industry_specific: false,
      options: [
        { id: 'a1', text: 'Still researching competitors' },
        { id: 'a2', text: 'Have general awareness' },
        { id: 'a3', text: 'Clear differentiators identified' },
        { id: 'a4', text: 'Validated differentiation with customers' },
      ],
    },
    {
      id: 'q4_traction',
      text: 'What\'s your current monthly revenue or traction?',
      type: 'multiple_choice',
      topic: 'traction',
      priority: 'high',
      why_matters: 'Traction is one of the strongest predictors of investor interest.',
      industry_specific: false,
      options: [
        { id: 'a1', text: 'Pre-revenue' },
        { id: 'a2', text: 'Under $1K MRR' },
        { id: 'a3', text: '$1K - $10K MRR' },
        { id: 'a4', text: '$10K+ MRR' },
      ],
    },
    {
      id: 'q5_team',
      text: 'What\'s your team composition?',
      type: 'multiple_choice',
      topic: 'team',
      priority: 'medium',
      why_matters: 'Team composition is key to early-stage investment decisions.',
      industry_specific: false,
      options: [
        { id: 'a1', text: 'Solo founder' },
        { id: 'a2', text: '2-3 co-founders' },
        { id: 'a3', text: '4-10 people' },
        { id: 'a4', text: '10+ people' },
      ],
    },
  ];

  const growthQuestions: DynamicQuestion[] = [
    {
      id: 'q1_mrr',
      text: 'What\'s your current Monthly Recurring Revenue (MRR)?',
      type: 'multiple_choice',
      topic: 'traction',
      priority: 'high',
      why_matters: 'MRR is the primary metric for SaaS valuations.',
      industry_specific: false,
      options: [
        { id: 'a1', text: 'Under $10K' },
        { id: 'a2', text: '$10K - $50K' },
        { id: 'a3', text: '$50K - $100K' },
        { id: 'a4', text: '$100K+' },
      ],
    },
    {
      id: 'q2_growth',
      text: 'What\'s your month-over-month growth rate?',
      type: 'multiple_choice',
      topic: 'traction',
      priority: 'high',
      why_matters: 'Growth rate determines fundraising multiple.',
      industry_specific: false,
      options: [
        { id: 'a1', text: 'Under 5%' },
        { id: 'a2', text: '5-15%' },
        { id: 'a3', text: '15-30%' },
        { id: 'a4', text: '30%+' },
      ],
    },
    {
      id: 'q3_cac',
      text: 'Do you know your Customer Acquisition Cost (CAC)?',
      type: 'multiple_choice',
      topic: 'metrics',
      priority: 'medium',
      why_matters: 'CAC efficiency determines scalability.',
      industry_specific: false,
      options: [
        { id: 'a1', text: 'Not tracked yet' },
        { id: 'a2', text: 'Have rough estimates' },
        { id: 'a3', text: 'Tracked by channel' },
        { id: 'a4', text: 'Optimized and improving' },
      ],
    },
    {
      id: 'q4_churn',
      text: 'What\'s your monthly customer churn rate?',
      type: 'multiple_choice',
      topic: 'retention',
      priority: 'high',
      why_matters: 'Low churn indicates product-market fit.',
      industry_specific: false,
      options: [
        { id: 'a1', text: 'Over 10%' },
        { id: 'a2', text: '5-10%' },
        { id: 'a3', text: '2-5%' },
        { id: 'a4', text: 'Under 2%' },
      ],
    },
    {
      id: 'q5_runway',
      text: 'How many months of runway do you have?',
      type: 'multiple_choice',
      topic: 'funding',
      priority: 'medium',
      why_matters: 'Runway determines fundraising urgency.',
      industry_specific: false,
      options: [
        { id: 'a1', text: 'Under 6 months' },
        { id: 'a2', text: '6-12 months' },
        { id: 'a3', text: '12-18 months' },
        { id: 'a4', text: '18+ months' },
      ],
    },
  ];

  // Return questions based on stage
  if (stage === 'Seed' || stage === 'Series A' || stage === 'Series B+') {
    return growthQuestions;
  }
  
  return ideaQuestions;
}

export default useOnboardingQuestions;
