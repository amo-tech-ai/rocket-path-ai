/**
 * Prompt Pack Hook with Agentic Routing
 * Implements Task 22: Agentic Routing & Multi-Step Pack Execution
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Pack step status
export type StepStatus = 'pending' | 'running' | 'completed' | 'error';

export interface PackStep {
  id: string;
  step_number: number;
  title: string;
  description?: string;
  status: StepStatus;
  output?: Record<string, unknown>;
  error?: string;
}

export interface PromptPack {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category?: string;
  steps: PackStep[];
  industry_specific: boolean;
}

export interface PackExecutionResult {
  success: boolean;
  pack_id: string;
  run_id: string;
  steps_completed: number;
  total_steps: number;
  final_output?: Record<string, unknown>;
  applied_to_db?: boolean;
}

interface UsePromptPackOptions {
  onStepComplete?: (step: PackStep, stepIndex: number) => void;
  onPackComplete?: (result: PackExecutionResult) => void;
}

// Feature to pack routing table
const FEATURE_PACK_ROUTING: Record<string, { defaultPack: string; industryOverrides?: Record<string, string> }> = {
  validator: {
    defaultPack: 'idea-validation',
    industryOverrides: {
      fintech: 'fintech-compliance-validation',
      healthcare: 'healthtech-compliance-validation',
      saas: 'saas-gtm-validation',
    },
  },
  canvas: {
    defaultPack: 'canvas-completion',
    industryOverrides: {
      marketplace: 'marketplace-canvas',
      saas: 'saas-canvas',
    },
  },
  pitch: {
    defaultPack: 'pitch-deck-generation',
  },
  gtm: {
    defaultPack: 'gtm-strategy',
    industryOverrides: {
      ecommerce: 'ecommerce-gtm',
      saas: 'saas-gtm',
    },
  },
  competitor: {
    defaultPack: 'competitor-analysis',
  },
};

export function usePromptPack(options: UsePromptPackOptions = {}) {
  const { toast } = useToast();
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentPack, setCurrentPack] = useState<PromptPack | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Get the appropriate pack slug based on feature and industry
  const getPackSlug = useCallback((feature: string, industry?: string): string => {
    const routing = FEATURE_PACK_ROUTING[feature];
    if (!routing) {
      return feature; // Use feature name as pack slug fallback
    }

    // Check for industry-specific override
    if (industry && routing.industryOverrides) {
      const normalizedIndustry = industry.toLowerCase().replace(/\s+/g, '-');
      const override = routing.industryOverrides[normalizedIndustry];
      if (override) {
        return override;
      }
    }

    return routing.defaultPack;
  }, []);

  // Search for packs
  const searchPacks = useCallback(async (query: string, category?: string) => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke('prompt-pack', {
        body: {
          action: 'search',
          query,
          category,
        },
      });

      if (fnError) throw new Error(fnError.message);
      return data?.packs || [];
    } catch (err) {
      console.error('[usePromptPack] Search error:', err);
      return [];
    }
  }, []);

  // Run a prompt pack with context passing between steps
  const runPack = useCallback(async (params: {
    module: string;
    industry?: string;
    stage?: string;
    startupId?: string;
    initialContext?: Record<string, unknown>;
  }): Promise<PackExecutionResult | null> => {
    const { module, industry, stage, startupId, initialContext = {} } = params;
    
    setIsExecuting(true);
    setError(null);
    setProgress(0);
    setCurrentStep(0);

    try {
      // 1. Determine the correct pack via routing
      const packSlug = getPackSlug(module, industry);
      console.log(`[usePromptPack] Running pack: ${packSlug} for module: ${module}, industry: ${industry}`);

      // 2. Invoke prompt-pack agent with run_pack action
      const { data, error: fnError } = await supabase.functions.invoke('prompt-pack', {
        body: {
          action: 'run_pack',
          pack_slug: packSlug,
          startup_id: startupId,
          industry,
          stage,
          context: {
            ...initialContext,
            startup_id: startupId,
            featureContext: module,
            industry,
            stage,
          },
        },
      });

      if (fnError) throw new Error(fnError.message);

      // 3. Track step progress
      if (data?.steps) {
        const totalSteps = data.steps.length;
        
        for (let i = 0; i < data.steps.length; i++) {
          setCurrentStep(i);
          setProgress(Math.round(((i + 1) / totalSteps) * 100));
          
          const step = data.steps[i];
          options.onStepComplete?.(step, i);
          
          // Small delay for UI feedback
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      const result: PackExecutionResult = {
        success: data?.success ?? true,
        pack_id: data?.pack_id || packSlug,
        run_id: data?.run_id || `run_${Date.now()}`,
        steps_completed: data?.steps?.length || 0,
        total_steps: data?.total_steps || data?.steps?.length || 0,
        final_output: data?.output,
        applied_to_db: data?.applied,
      };

      options.onPackComplete?.(result);
      
      toast({
        title: "Pack completed",
        description: `Completed ${result.steps_completed} steps successfully.`,
      });

      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Pack execution failed';
      setError(errorMessage);
      console.error('[usePromptPack] Execution error:', err);
      
      toast({
        title: "Pack failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsExecuting(false);
    }
  }, [getPackSlug, options, toast]);

  // Apply pack results to database
  const applyResults = useCallback(async (runId: string, targetTable: string) => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke('prompt-pack', {
        body: {
          action: 'apply',
          run_id: runId,
          target_table: targetTable,
        },
      });

      if (fnError) throw new Error(fnError.message);
      
      toast({
        title: "Results applied",
        description: `Successfully saved to ${targetTable}.`,
      });
      
      return data?.success ?? true;
    } catch (err) {
      console.error('[usePromptPack] Apply error:', err);
      toast({
        title: "Apply failed",
        description: err instanceof Error ? err.message : 'Failed to apply results',
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Preview a pack without running
  const previewPack = useCallback(async (packSlug: string) => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke('prompt-pack', {
        body: {
          action: 'preview',
          pack_slug: packSlug,
        },
      });

      if (fnError) throw new Error(fnError.message);
      return data?.pack || null;
    } catch (err) {
      console.error('[usePromptPack] Preview error:', err);
      return null;
    }
  }, []);

  return {
    // State
    isExecuting,
    currentPack,
    currentStep,
    progress,
    error,
    
    // Actions
    runPack,
    searchPacks,
    applyResults,
    previewPack,
    getPackSlug,
  };
}

export default usePromptPack;
