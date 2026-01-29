/**
 * Prompt Pack Hook
 * Frontend interface for Prompt Pack catalog, run, and apply actions
 * 
 * @see docs/tasks/07-prompt-packs.md
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// ============================================================================
// Types
// ============================================================================

export interface PromptPack {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  stage_tags: string[] | null;
  industry_tags: string[] | null;
  version: number;
  is_active: boolean;
  source: string | null;
  metadata: {
    author?: string;
    estimated_time_seconds?: number;
    model?: string;
    version?: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface PromptPackStep {
  id: string;
  pack_id: string;
  step_order: number;
  purpose: string;
  prompt_template: string;
  input_schema: Record<string, unknown> | null;
  output_schema: Record<string, unknown>;
  model_preference: string | null;
  max_tokens: number | null;
  temperature: number | null;
}

export interface PackWithSteps extends PromptPack {
  steps?: PromptPackStep[];
}

export interface ListPacksResponse {
  packs: PromptPack[];
  by_category: Record<string, PromptPack[]>;
  total: number;
}

export interface SearchPacksResponse {
  pack: PromptPack | null;
  next_step: PromptPackStep | null;
  alternatives: PromptPack[];
  meta: {
    query: Record<string, unknown>;
    total_alternatives: number;
  };
}

export interface GetPackResponse {
  pack: PackWithSteps;
  step_count: number;
}

export interface RunStepResponse {
  success: boolean;
  outputs: Record<string, unknown>;
  tokens: { input: number; output: number };
  cost_usd: number;
  latency_ms: number;
  run_id: string;
  error?: string;
}

export interface RunPackResult {
  step_id: string;
  step_order: number;
  purpose: string;
  success: boolean;
  outputs: Record<string, unknown>;
  tokens: { input: number; output: number };
  cost_usd: number;
  latency_ms: number;
}

export interface RunPackResponse {
  success: boolean;
  results: RunPackResult[];
  final_output: Record<string, unknown>;
  meta: {
    pack_id: string;
    startup_id: string;
    total_steps: number;
    completed_steps: number;
    total_cost_usd: number;
    total_latency_ms: number;
    total_tokens: { input: number; output: number };
  };
  error?: string;
}

export interface ApplyTarget {
  table: string;
  count: number;
  action: 'insert' | 'update' | 'upsert';
}

export interface ApplyResponse {
  success: boolean;
  applied: ApplyTarget[];
  summary: {
    tables_updated: number;
    total_records: number;
  };
  error?: string;
}

// ============================================================================
// Helper: Invoke Prompt Pack Edge Function
// ============================================================================

async function invokePromptPack<T>(
  action: string,
  payload: Record<string, unknown>,
  requiresAuth = false
): Promise<T> {
  const headers: Record<string, string> = {};

  if (requiresAuth) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('Authentication required. Please log in.');
    }
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  const { data, error } = await supabase.functions.invoke('prompt-pack', {
    body: { action, ...payload },
    headers: Object.keys(headers).length > 0 ? headers : undefined,
  });

  if (error) {
    console.error(`[PromptPack] ${action} error:`, error);
    throw error;
  }

  return data as T;
}

// ============================================================================
// Catalog Queries (No Auth Required)
// ============================================================================

/**
 * List all active prompt packs
 */
export function useListPacks(limit = 20) {
  return useQuery({
    queryKey: ['prompt-packs', 'list', limit],
    queryFn: () => invokePromptPack<ListPacksResponse>('list', { limit }, false),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

/**
 * Search prompt packs by filters
 */
export function useSearchPacks(params: {
  module?: string;
  industry?: string;
  stage?: string;
  startup_id?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['prompt-packs', 'search', params],
    queryFn: () => invokePromptPack<SearchPacksResponse>('search', params, false),
    enabled: Object.values(params).some(v => v !== undefined),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Get a single pack by ID or slug
 */
export function useGetPack(packIdOrSlug?: string) {
  const isUuid = packIdOrSlug?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  
  return useQuery({
    queryKey: ['prompt-packs', 'get', packIdOrSlug],
    queryFn: () => invokePromptPack<GetPackResponse>(
      'get',
      isUuid ? { pack_id: packIdOrSlug } : { slug: packIdOrSlug },
      false
    ),
    enabled: !!packIdOrSlug,
    staleTime: 1000 * 60 * 10,
  });
}

// ============================================================================
// Run Mutations (Auth Required)
// ============================================================================

/**
 * Run a single step of a pack
 */
export function useRunStep() {
  return useMutation({
    mutationFn: async ({
      startupId,
      packId,
      stepId,
      context,
      previousOutputs,
    }: {
      startupId: string;
      packId: string;
      stepId: string;
      context?: Record<string, unknown>;
      previousOutputs?: Record<string, unknown>;
    }) => {
      return invokePromptPack<RunStepResponse>(
        'run_step',
        {
          startup_id: startupId,
          pack_id: packId,
          step_id: stepId,
          context,
          previous_outputs: previousOutputs,
        },
        true
      );
    },
    onSuccess: (data) => {
      if (data.success) {
        const cost = data.cost_usd.toFixed(4);
        const latency = (data.latency_ms / 1000).toFixed(1);
        toast.success(`Step completed • $${cost} • ${latency}s`);
      } else {
        toast.error(data.error || 'Step execution failed');
      }
    },
    onError: (error) => {
      console.error('[PromptPack] runStep error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to run step');
    },
  });
}

/**
 * Run all steps of a pack sequentially
 */
export function useRunPack() {
  return useMutation({
    mutationFn: async ({
      startupId,
      packId,
      context,
      stopOnError = true,
    }: {
      startupId: string;
      packId: string;
      context?: Record<string, unknown>;
      stopOnError?: boolean;
    }) => {
      return invokePromptPack<RunPackResponse>(
        'run_pack',
        {
          startup_id: startupId,
          pack_id: packId,
          context,
          stop_on_error: stopOnError,
        },
        true
      );
    },
    onSuccess: (data) => {
      if (data.success) {
        const cost = data.meta.total_cost_usd.toFixed(4);
        const latency = (data.meta.total_latency_ms / 1000).toFixed(1);
        const steps = `${data.meta.completed_steps}/${data.meta.total_steps}`;
        toast.success(`Pack completed (${steps} steps) • $${cost} • ${latency}s`);
      } else {
        toast.error(data.error || 'Pack execution failed');
      }
    },
    onError: (error) => {
      console.error('[PromptPack] runPack error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to run pack');
    },
  });
}

// ============================================================================
// Apply Mutations (Auth Required)
// ============================================================================

/**
 * Preview what would be applied (no DB write)
 */
export function usePreviewApply() {
  return useMutation({
    mutationFn: async ({
      startupId,
      outputsJson,
      applyTo,
      runId,
    }: {
      startupId: string;
      outputsJson: Record<string, unknown>;
      applyTo?: string[];
      runId?: string;
    }) => {
      return invokePromptPack<ApplyResponse>(
        'preview',
        {
          startup_id: startupId,
          outputs_json: outputsJson,
          apply_to: applyTo,
          run_id: runId,
        },
        true
      );
    },
    onError: (error) => {
      console.error('[PromptPack] preview error:', error);
      toast.error('Failed to preview changes');
    },
  });
}

/**
 * Apply outputs to database tables
 */
export function useApplyOutputs() {
  return useMutation({
    mutationFn: async ({
      startupId,
      outputsJson,
      applyTo,
      runId,
    }: {
      startupId: string;
      outputsJson: Record<string, unknown>;
      applyTo?: string[];
      runId?: string;
    }) => {
      return invokePromptPack<ApplyResponse>(
        'apply',
        {
          startup_id: startupId,
          outputs_json: outputsJson,
          apply_to: applyTo,
          run_id: runId,
        },
        true
      );
    },
    onSuccess: (data) => {
      if (data.success) {
        const { tables_updated, total_records } = data.summary;
        toast.success(`Applied to ${tables_updated} table(s), ${total_records} record(s)`);
      } else {
        toast.error(data.error || 'Failed to apply changes');
      }
    },
    onError: (error) => {
      console.error('[PromptPack] apply error:', error);
      toast.error('Failed to apply changes');
    },
  });
}

// ============================================================================
// Composite Hook
// ============================================================================

/**
 * Combined hook exposing all prompt pack operations
 */
export function usePromptPack() {
  const listPacks = useListPacks();
  const runStep = useRunStep();
  const runPack = useRunPack();
  const previewApply = usePreviewApply();
  const applyOutputs = useApplyOutputs();

  return {
    // Catalog (queries)
    listPacks,
    
    // Run (mutations)
    runStep,
    runPack,
    
    // Apply (mutations)
    previewApply,
    applyOutputs,
    
    // Loading states
    isRunning: runStep.isPending || runPack.isPending,
    isApplying: applyOutputs.isPending,
  };
}

// Re-export individual hooks for selective imports
export {
  useListPacks as usePromptPackList,
  useSearchPacks as usePromptPackSearch,
  useGetPack as usePromptPackGet,
  useRunStep as usePromptPackRunStep,
  useRunPack as usePromptPackRun,
  usePreviewApply as usePromptPackPreview,
  useApplyOutputs as usePromptPackApply,
};
