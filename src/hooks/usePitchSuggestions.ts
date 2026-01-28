/**
 * usePitchSuggestions Hook
 * Manages AI-powered pitch suggestions for Step 2 fields
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Step1Data, Step2Data } from '@/lib/pitchDeckSchema';

export interface PitchSuggestion {
  id: string;
  text: string;
  reason: string;
}

export interface PitchSuggestions {
  problem: PitchSuggestion[];
  core_solution: PitchSuggestion[];
  differentiation: PitchSuggestion[];
}

interface UsePitchSuggestionsOptions {
  step1Data?: Partial<Step1Data>;
  step2Data?: Partial<Step2Data>;
  autoLoad?: boolean;
}

export function usePitchSuggestions(options: UsePitchSuggestionsOptions = {}) {
  const [suggestions, setSuggestions] = useState<PitchSuggestions>({
    problem: [],
    core_solution: [],
    differentiation: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeField, setActiveField] = useState<keyof PitchSuggestions | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  /**
   * Fetch all suggestions for Step 2 fields
   */
  const fetchSuggestions = useCallback(async () => {
    if (!options.step1Data?.industry) {
      console.log('[usePitchSuggestions] No industry selected, skipping');
      return;
    }

    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const startupContext = {
        company_name: options.step1Data?.company_name,
        industry: options.step1Data?.industry,
        sub_category: options.step1Data?.sub_category,
        stage: options.step1Data?.stage,
        tagline: options.step1Data?.tagline,
        website_url: options.step1Data?.website_url,
        problem: options.step2Data?.problem,
        core_solution: options.step2Data?.core_solution,
        differentiator: options.step2Data?.differentiator,
        users: options.step2Data?.users,
        revenue: options.step2Data?.revenue,
        growth_rate: options.step2Data?.growth_rate,
        funding_stage: options.step2Data?.funding_stage,
      };

      const response = await supabase.functions.invoke('pitch-deck-agent', {
        body: {
          action: 'pitch_suggestions',
          startup_context: startupContext,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;

      if (response.data?.success) {
        setSuggestions({
          problem: response.data.problem || [],
          core_solution: response.data.core_solution || [],
          differentiation: response.data.differentiation || [],
        });
        setHasLoaded(true);
      }
    } catch (error) {
      console.error('[usePitchSuggestions] Error fetching suggestions:', error);
      // Use fallback suggestions on error
      setSuggestions(getFallbackSuggestions(options.step1Data?.industry || 'Technology'));
      setHasLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }, [options.step1Data, options.step2Data]);

  /**
   * Refresh suggestions for a specific field
   */
  const refreshFieldSuggestions = useCallback(async (field: keyof PitchSuggestions) => {
    if (!options.step1Data?.industry) return;

    setActiveField(field);
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const startupContext = {
        company_name: options.step1Data?.company_name,
        industry: options.step1Data?.industry,
        sub_category: options.step1Data?.sub_category,
        stage: options.step1Data?.stage,
        problem: options.step2Data?.problem,
        core_solution: options.step2Data?.core_solution,
        differentiator: options.step2Data?.differentiator,
        users: options.step2Data?.users,
        revenue: options.step2Data?.revenue,
        funding_stage: options.step2Data?.funding_stage,
      };

      const response = await supabase.functions.invoke('pitch-deck-agent', {
        body: {
          action: 'field_suggestion',
          field,
          startup_context: startupContext,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;

      if (response.data?.success && response.data?.suggestions) {
        setSuggestions(prev => ({
          ...prev,
          [field]: response.data.suggestions,
        }));
      }
    } catch (error) {
      console.error(`[usePitchSuggestions] Error refreshing ${field}:`, error);
      toast.error('Failed to refresh suggestions');
    } finally {
      setIsLoading(false);
      setActiveField(null);
    }
  }, [options.step1Data, options.step2Data]);

  /**
   * Auto-load suggestions when industry changes
   */
  useEffect(() => {
    if (options.autoLoad && options.step1Data?.industry && !hasLoaded) {
      fetchSuggestions();
    }
  }, [options.autoLoad, options.step1Data?.industry, hasLoaded, fetchSuggestions]);

  return {
    suggestions,
    isLoading,
    activeField,
    hasLoaded,
    fetchSuggestions,
    refreshFieldSuggestions,
  };
}

/**
 * Fallback suggestions when API fails
 */
function getFallbackSuggestions(industry: string): PitchSuggestions {
  return {
    problem: [
      {
        id: 'p1',
        text: `${industry} teams spend 40%+ of time on manual, repetitive tasks that should be automated.`,
        reason: 'Quantifies the pain with a specific metric that resonates with efficiency-focused investors.',
      },
      {
        id: 'p2',
        text: 'Existing solutions require months of implementation and heavy customization to deliver value.',
        reason: 'Addresses switching costs and implementation friction—a key enterprise buyer concern.',
      },
      {
        id: 'p3',
        text: 'Critical data is trapped in silos, preventing informed decision-making at the speed of business.',
        reason: 'Highlights the visibility gap that leads to poor decisions and missed opportunities.',
      },
    ],
    core_solution: [
      {
        id: 's1',
        text: 'An AI-powered platform that automates workflows and reduces manual work by 80%.',
        reason: 'Leads with quantified outcome, not features—investors care about impact.',
      },
      {
        id: 's2',
        text: 'A unified operating system that replaces 5+ point solutions with one integrated platform.',
        reason: 'Positions as consolidation play—a strong narrative in crowded markets.',
      },
      {
        id: 's3',
        text: 'Self-service tools that deliver real-time visibility in hours, not months.',
        reason: 'Emphasizes speed to value, a key differentiator for modern SaaS.',
      },
    ],
    differentiation: [
      {
        id: 'd1',
        text: `Purpose-built for ${industry.toLowerCase()} with AI that understands domain-specific workflows.`,
        reason: 'Vertical focus creates defensibility—horizontal tools cannot replicate domain depth.',
      },
      {
        id: 'd2',
        text: '10x faster implementation with no-code configuration and pre-built integrations.',
        reason: 'Speed to value is measurable and compelling for enterprise buyers.',
      },
      {
        id: 'd3',
        text: 'Founded by industry operators with 20+ years of combined domain experience.',
        reason: 'Team credibility creates trust—especially in domain-specific plays.',
      },
    ],
  };
}
