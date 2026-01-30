/**
 * usePlaybookIntegration Hook
 * 
 * Connects screens to the Industry Playbook intelligence layer.
 * Provides unified interface for AI calls with automatic context injection.
 * 
 * Features:
 * - Auto-injects industry/stage context
 * - Routes to correct prompt pack
 * - Handles response mapping
 * - Audit logging
 */

import { useMemo, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { usePlaybook } from '@/providers/PlaybookProvider';
import { invokeAgent, InvokeAgentOptions } from '@/lib/invokeAgent';
import { toast } from 'sonner';

// ============================================================================
// Types
// ============================================================================

export interface PlaybookAction<TPayload = Record<string, unknown>, TResult = unknown> {
  /** Edge function to call */
  functionName: string;
  /** Action identifier */
  action: string;
  /** Transform payload before sending */
  transformPayload?: (payload: TPayload, context: PlaybookContext) => Record<string, unknown>;
  /** Transform response after receiving */
  transformResponse?: (response: unknown) => TResult;
  /** Success message */
  successMessage?: string;
  /** Error message */
  errorMessage?: string;
}

export interface PlaybookContext {
  industry: string | null;
  stage: string | null;
  featureContext: string;
  categories: string[];
}

// ============================================================================
// Predefined Actions
// ============================================================================

export const PLAYBOOK_ACTIONS = {
  // Onboarding
  ENRICH_URL: {
    functionName: 'onboarding-agent',
    action: 'enrich_url',
    successMessage: 'Profile enriched from URL',
  },
  CALCULATE_READINESS: {
    functionName: 'onboarding-agent',
    action: 'calculate_readiness',
    successMessage: 'Readiness calculated',
  },
  CALCULATE_SCORE: {
    functionName: 'onboarding-agent',
    action: 'calculate_score',
    successMessage: 'Investor score calculated',
  },
  
  // Validation
  VALIDATE_IDEA: {
    functionName: 'industry-expert-agent',
    action: 'validate_canvas',
    successMessage: 'Validation complete',
  },
  GET_BENCHMARKS: {
    functionName: 'industry-expert-agent',
    action: 'get_benchmarks',
  },
  
  // Canvas
  GENERATE_SUGGESTIONS: {
    functionName: 'lean-canvas-agent',
    action: 'generate_suggestions',
    successMessage: 'Suggestions generated',
  },
  PREFILL_CANVAS: {
    functionName: 'lean-canvas-agent',
    action: 'prefill',
    successMessage: 'Canvas prefilled with AI',
  },
  
  // Pitch
  GENERATE_PITCH: {
    functionName: 'pitch-deck-agent',
    action: 'generate',
    successMessage: 'Pitch deck generated',
  },
  CRITIQUE_PITCH: {
    functionName: 'pitch-deck-agent',
    action: 'critique',
    successMessage: 'Critique received',
  },
  
  // CRM
  ENRICH_CONTACT: {
    functionName: 'crm-agent',
    action: 'enrich',
    successMessage: 'Contact enriched',
  },
  SCORE_CONTACT: {
    functionName: 'crm-agent',
    action: 'score',
    successMessage: 'Contact scored',
  },
  
  // Investors
  DISCOVER_INVESTORS: {
    functionName: 'investor-agent',
    action: 'discover',
    successMessage: 'Investors discovered',
  },
  ANALYZE_FIT: {
    functionName: 'investor-agent',
    action: 'fit_analysis',
    successMessage: 'Fit analysis complete',
  },
} as const;

// ============================================================================
// Hook
// ============================================================================

export function usePlaybookIntegration() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { industry, stage, getFeatureContext, getKnowledge } = usePlaybook();
  
  // Get current feature context
  const featureCtx = useMemo(
    () => getFeatureContext(location.pathname),
    [location.pathname, getFeatureContext]
  );
  
  // Build full context
  const context: PlaybookContext = useMemo(() => ({
    industry,
    stage,
    featureContext: featureCtx.featureContext,
    categories: featureCtx.categories,
  }), [industry, stage, featureCtx]);
  
  // Generic action invoker
  const invokeAction = useCallback(async <TPayload extends Record<string, unknown>, TResult>(
    actionDef: PlaybookAction<TPayload, TResult>,
    payload: TPayload
  ): Promise<TResult> => {
    const options: InvokeAgentOptions = {
      functionName: actionDef.functionName,
      action: actionDef.action,
      payload: actionDef.transformPayload 
        ? actionDef.transformPayload(payload, context) 
        : payload,
      industry: industry || undefined,
      stage: stage || undefined,
      featureContext: featureCtx.featureContext,
    };
    
    const result = await invokeAgent<TResult>(options);
    
    return actionDef.transformResponse 
      ? actionDef.transformResponse(result) 
      : result;
  }, [context, industry, stage, featureCtx]);
  
  // Create mutation for an action
  const usePlaybookAction = <TPayload extends Record<string, unknown>, TResult>(
    actionDef: PlaybookAction<TPayload, TResult>
  ) => {
    return useMutation({
      mutationFn: (payload: TPayload) => invokeAction(actionDef, payload),
      onSuccess: () => {
        if (actionDef.successMessage) {
          toast.success(actionDef.successMessage);
        }
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['startup'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      },
      onError: (error) => {
        console.error(`[Playbook] ${actionDef.action} error:`, error);
        toast.error(actionDef.errorMessage || 'Action failed');
      },
    });
  };
  
  return {
    // Context
    context,
    industry,
    stage,
    featureContext: featureCtx,
    getKnowledge,
    
    // Action helpers
    invokeAction,
    usePlaybookAction,
    
    // Predefined action hooks
    useEnrichUrl: () => usePlaybookAction(PLAYBOOK_ACTIONS.ENRICH_URL),
    useCalculateReadiness: () => usePlaybookAction(PLAYBOOK_ACTIONS.CALCULATE_READINESS),
    useCalculateScore: () => usePlaybookAction(PLAYBOOK_ACTIONS.CALCULATE_SCORE),
    useValidateIdea: () => usePlaybookAction(PLAYBOOK_ACTIONS.VALIDATE_IDEA),
    useGetBenchmarks: () => usePlaybookAction(PLAYBOOK_ACTIONS.GET_BENCHMARKS),
    useGenerateSuggestions: () => usePlaybookAction(PLAYBOOK_ACTIONS.GENERATE_SUGGESTIONS),
    usePrefillCanvas: () => usePlaybookAction(PLAYBOOK_ACTIONS.PREFILL_CANVAS),
    useGeneratePitch: () => usePlaybookAction(PLAYBOOK_ACTIONS.GENERATE_PITCH),
    useCritiquePitch: () => usePlaybookAction(PLAYBOOK_ACTIONS.CRITIQUE_PITCH),
    useEnrichContact: () => usePlaybookAction(PLAYBOOK_ACTIONS.ENRICH_CONTACT),
    useScoreContact: () => usePlaybookAction(PLAYBOOK_ACTIONS.SCORE_CONTACT),
    useDiscoverInvestors: () => usePlaybookAction(PLAYBOOK_ACTIONS.DISCOVER_INVESTORS),
    useAnalyzeFit: () => usePlaybookAction(PLAYBOOK_ACTIONS.ANALYZE_FIT),
  };
}

export default usePlaybookIntegration;
