/**
 * Use Step 1 AI Hook
 * Manages AI operations for Step 1: Industry research, problem suggestions, interview drafts
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { AISuggestion, IndustryInsight } from '@/components/pitchdeck/wizard/step1/AISuggestionsPanel';
import type { DraftAnswer } from '@/components/pitchdeck/wizard/step1/SmartInterviewDrafts';
import type { CanvasFieldSuggestion, LeanCanvasData } from '@/components/pitchdeck/wizard/step1/LeanCanvasSection';

interface UseStep1AIOptions {
  deckId?: string | null;
  startupId?: string | null;
}

export function useStep1AI(options: UseStep1AIOptions = {}) {
  const [isResearchingIndustry, setIsResearchingIndustry] = useState(false);
  const [industryInsights, setIndustryInsights] = useState<IndustryInsight | null>(null);
  const [problemSuggestions, setProblemSuggestions] = useState<AISuggestion[]>([]);
  const [isLoadingProblemSuggestions, setIsLoadingProblemSuggestions] = useState(false);
  const [interviewDrafts, setInterviewDrafts] = useState<DraftAnswer[]>([]);
  const [isLoadingInterviewDrafts, setIsLoadingInterviewDrafts] = useState(false);
  const [canvasSuggestions, setCanvasSuggestions] = useState<Record<string, CanvasFieldSuggestion[]>>({});
  const [loadingCanvasField, setLoadingCanvasField] = useState<keyof LeanCanvasData | null>(null);

  // ============================================================================
  // Industry Research
  // ============================================================================

  const researchIndustry = useCallback(async (industry: string, subCategory?: string) => {
    if (!industry) return;
    
    setIsResearchingIndustry(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('pitch-deck-agent', {
        body: {
          action: 'research_industry',
          industry,
          sub_category: subCategory,
          deck_id: options.deckId,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;

      const insights: IndustryInsight = response.data?.insights || {
        coreProblems: [
          `Legacy systems creating inefficiencies in ${industry}`,
          'Manual processes limiting scale and accuracy',
          'Data silos preventing holistic insights',
        ],
        buyingPersonas: ['VPs of Operations', 'CTOs', 'Department Heads'],
        existingSolutions: {
          ai: ['Point solutions with limited integration'],
          nonAi: ['Spreadsheets', 'Legacy software', 'Manual workflows'],
        },
        gaps: [
          'Integration between existing tools',
          'Real-time decision support',
          'Scalable automation',
        ],
        trends: [
          'AI-first approaches gaining adoption',
          'Consolidation of point solutions',
          'Focus on ROI and time-to-value',
        ],
      };

      setIndustryInsights(insights);
      
      // Also generate problem suggestions based on industry
      const problems: AISuggestion[] = insights.coreProblems.map((problem, idx) => ({
        id: `problem-${idx}`,
        text: problem,
        explanation: 'Common pain point in this industry',
        category: 'problem' as const,
        confidence: 0.85,
      }));
      
      setProblemSuggestions(problems);
      
      return insights;
    } catch (error) {
      console.error('Failed to research industry:', error);
      // Return fallback insights
      const fallback: IndustryInsight = {
        coreProblems: [
          'Inefficient manual processes consuming valuable time',
          'Lack of real-time visibility into operations',
          'Difficulty scaling without increasing headcount',
        ],
        buyingPersonas: ['Operations Leaders', 'Department Heads', 'C-Suite'],
        existingSolutions: {
          ai: ['Emerging AI tools'],
          nonAi: ['Traditional software', 'Manual processes'],
        },
        gaps: ['Integration', 'Automation', 'Real-time insights'],
        trends: ['Digital transformation', 'AI adoption', 'Process automation'],
      };
      setIndustryInsights(fallback);
      return fallback;
    } finally {
      setIsResearchingIndustry(false);
    }
  }, [options.deckId]);

  // ============================================================================
  // Problem Suggestions
  // ============================================================================

  const generateProblemSuggestions = useCallback(async (
    industry: string,
    companyDescription: string,
    subCategory?: string
  ) => {
    setIsLoadingProblemSuggestions(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('pitch-deck-agent', {
        body: {
          action: 'suggest_problems',
          industry,
          sub_category: subCategory,
          company_description: companyDescription,
          deck_id: options.deckId,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;

      const suggestions: AISuggestion[] = response.data?.suggestions || [
        {
          id: 'p1',
          text: `Teams in ${industry} spend 40% of time on manual, repetitive tasks`,
          explanation: 'Quantified pain point that resonates with decision-makers',
          realWorldFraming: 'Every week, our team loses 2 full days to data entry and reconciliation',
          category: 'problem' as const,
          confidence: 0.9,
        },
        {
          id: 'p2',
          text: 'Existing solutions require months of implementation and customization',
          explanation: 'Time-to-value is a key concern for buyers',
          realWorldFraming: 'We evaluated 5 vendors but couldn\'t afford the 6-month rollout',
          category: 'problem' as const,
          confidence: 0.85,
        },
        {
          id: 'p3',
          text: 'Data trapped in silos prevents informed decision-making',
          explanation: 'Data accessibility is a universal enterprise pain',
          realWorldFraming: 'I can\'t get a simple report without asking 3 different teams',
          category: 'problem' as const,
          confidence: 0.8,
        },
      ];

      setProblemSuggestions(suggestions);
      return suggestions;
    } catch (error) {
      console.error('Failed to generate problem suggestions:', error);
      toast.error('Failed to generate suggestions');
      return [];
    } finally {
      setIsLoadingProblemSuggestions(false);
    }
  }, [options.deckId]);

  // ============================================================================
  // Smart Interview Drafts
  // ============================================================================

  const generateInterviewDrafts = useCallback(async (
    industry: string,
    companyDescription: string,
    problem: string
  ) => {
    if (!companyDescription || companyDescription.length < 50) return;
    
    setIsLoadingInterviewDrafts(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('pitch-deck-agent', {
        body: {
          action: 'generate_interview_drafts',
          industry,
          company_description: companyDescription,
          problem,
          deck_id: options.deckId,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;

      const drafts: DraftAnswer[] = response.data?.drafts || [
        {
          id: 'd1',
          question: 'What specific metrics demonstrate product-market fit?',
          draftAnswer: 'Based on your description, focus on customer retention rate, NPS scores, and organic growth metrics.',
          category: 'traction',
          confidence: 0.8,
        },
        {
          id: 'd2',
          question: 'How do you acquire customers today?',
          draftAnswer: 'Your approach suggests a product-led growth model with emphasis on word-of-mouth and organic discovery.',
          category: 'market',
          confidence: 0.75,
        },
        {
          id: 'd3',
          question: 'What makes your team uniquely qualified?',
          draftAnswer: 'Highlight domain expertise, previous startup experience, and specific industry knowledge.',
          category: 'team',
          confidence: 0.7,
        },
      ];

      setInterviewDrafts(drafts);
      return drafts;
    } catch (error) {
      console.error('Failed to generate interview drafts:', error);
      return [];
    } finally {
      setIsLoadingInterviewDrafts(false);
    }
  }, [options.deckId]);

  // ============================================================================
  // Lean Canvas Suggestions
  // ============================================================================

  const generateCanvasSuggestions = useCallback(async (
    field: keyof LeanCanvasData,
    industry: string,
    companyDescription: string
  ) => {
    setLoadingCanvasField(field);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('pitch-deck-agent', {
        body: {
          action: 'suggest_canvas_field',
          field,
          industry,
          company_description: companyDescription,
          deck_id: options.deckId,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;

      const suggestions: CanvasFieldSuggestion[] = response.data?.suggestions || getFallbackCanvasSuggestions(field);

      setCanvasSuggestions(prev => ({
        ...prev,
        [field]: suggestions,
      }));
      
      return suggestions;
    } catch (error) {
      console.error('Failed to generate canvas suggestions:', error);
      const fallback = getFallbackCanvasSuggestions(field);
      setCanvasSuggestions(prev => ({
        ...prev,
        [field]: fallback,
      }));
      return fallback;
    } finally {
      setLoadingCanvasField(null);
    }
  }, [options.deckId]);

  // ============================================================================
  // Reset State
  // ============================================================================

  const resetAIState = useCallback(() => {
    setIndustryInsights(null);
    setProblemSuggestions([]);
    setInterviewDrafts([]);
    setCanvasSuggestions({});
  }, []);

  return {
    // Industry Research
    isResearchingIndustry,
    industryInsights,
    researchIndustry,
    
    // Problem Suggestions
    problemSuggestions,
    isLoadingProblemSuggestions,
    generateProblemSuggestions,
    
    // Interview Drafts
    interviewDrafts,
    isLoadingInterviewDrafts,
    generateInterviewDrafts,
    
    // Canvas Suggestions
    canvasSuggestions,
    loadingCanvasField,
    generateCanvasSuggestions,
    
    // Utils
    resetAIState,
  };
}

// Fallback suggestions for Lean Canvas fields
function getFallbackCanvasSuggestions(field: keyof LeanCanvasData): CanvasFieldSuggestion[] {
  const fallbacks: Record<string, CanvasFieldSuggestion[]> = {
    problem: [
      { id: 'p1', title: 'Time-consuming manual processes', explanation: 'Highlight inefficiency that your solution addresses' },
      { id: 'p2', title: 'Lack of real-time visibility', explanation: 'Decision-makers need faster insights' },
      { id: 'p3', title: 'High error rates in current solutions', explanation: 'Quantify the cost of errors' },
    ],
    solution: [
      { id: 's1', title: 'AI-powered automation', explanation: 'Emphasize the technology advantage' },
      { id: 's2', title: 'Real-time dashboard', explanation: 'Visual, immediate insights' },
      { id: 's3', title: 'Self-service platform', explanation: 'Reduce dependency on specialists' },
    ],
    uniqueValueProp: [
      { id: 'u1', title: '10x faster than alternatives', explanation: 'Quantified speed improvement' },
      { id: 'u2', title: 'No-code implementation', explanation: 'Lower barrier to adoption' },
      { id: 'u3', title: 'Built by industry veterans', explanation: 'Domain expertise credibility' },
    ],
    customerSegments: [
      { id: 'c1', title: 'Mid-market companies (50-500 employees)', explanation: 'Specific, actionable segment' },
      { id: 'c2', title: 'Operations teams in [industry]', explanation: 'Role-based targeting' },
      { id: 'c3', title: 'Companies using legacy systems', explanation: 'Pain-based segmentation' },
    ],
    channels: [
      { id: 'ch1', title: 'Product-led growth', explanation: 'Free tier drives adoption' },
      { id: 'ch2', title: 'Content marketing + SEO', explanation: 'Thought leadership in the space' },
      { id: 'ch3', title: 'Strategic partnerships', explanation: 'Distribution through ecosystem' },
    ],
    revenueStreams: [
      { id: 'r1', title: 'SaaS subscription (monthly/annual)', explanation: 'Predictable recurring revenue' },
      { id: 'r2', title: 'Usage-based pricing tier', explanation: 'Scales with customer success' },
      { id: 'r3', title: 'Enterprise contracts', explanation: 'Higher ACV with longer commitments' },
    ],
  };

  return fallbacks[field] || [];
}
