/**
 * Lean Canvas Agent Hook
 * Frontend interface for Lean Canvas AI actions (mapping, prefill, validation)
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { LeanCanvasData } from './useLeanCanvas';

// ============================================================================
// Types
// ============================================================================

export type BoxKey = keyof LeanCanvasData;

export type CoverageLevel = 'HIGH' | 'MODERATE' | 'LOW';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ProfileMappingResult {
  success: boolean;
  canvas?: LeanCanvasData;
  coverage?: Record<BoxKey, CoverageLevel>;
  hasLowCoverage?: boolean;
  lowCoverageBoxes?: BoxKey[];
  error?: string;
}

export interface BoxSuggestion {
  suggestion: string;
  reasoning: string;
  confidence: ConfidenceLevel;
}

export interface SuggestBoxResult {
  success: boolean;
  suggestions?: BoxSuggestion[];
  error?: string;
}

export interface ValidationResult {
  box: BoxKey;
  score: number;
  feedback: string;
  risk_level: 'critical' | 'moderate' | 'low';
  risk_reason: string;
  experiment: string;
}

export interface ValidateCanvasResult {
  success: boolean;
  overall_score?: number;
  results?: ValidationResult[];
  top_risks?: ValidationResult[];
  error?: string;
}

export interface CanvasVersion {
  id: string;
  version_number: number;
  label: string;
  created_at: string;
}

export interface BenchmarkData {
  box: BoxKey;
  benchmark: string;
  value: string;
  yourPosition?: 'above' | 'below' | 'within';
  context: string;
  source: string;
}

export interface GetBenchmarksResult {
  success: boolean;
  benchmarks?: BenchmarkData[];
  error?: string;
}

// ============================================================================
// Helper: Invoke Lean Canvas Agent
// ============================================================================

async function invokeLeanCanvasAgent<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase.functions.invoke('lean-canvas-agent', {
    body: { action, ...payload },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) throw error;
  return data as T;
}

// ============================================================================
// Mutations
// ============================================================================

/**
 * Map startup profile to canvas boxes with coverage indicators
 */
export function useMapProfile() {
  return useMutation({
    mutationFn: async ({ startupId }: { startupId: string }) => {
      return invokeLeanCanvasAgent<ProfileMappingResult>('map_profile', {
        startup_id: startupId,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        if (data.hasLowCoverage) {
          toast.info(`Profile mapped. ${data.lowCoverageBoxes?.length || 0} sections need more data.`);
        } else {
          toast.success('Profile mapped successfully');
        }
      } else {
        toast.error(data.error || 'Failed to map profile');
      }
    },
    onError: (error) => {
      console.error('Map profile error:', error);
      toast.error('Failed to map profile');
    },
  });
}

/**
 * Prefill canvas with AI-generated content
 */
export function usePrefillCanvas() {
  return useMutation({
    mutationFn: async ({ startupId }: { startupId: string }) => {
      return invokeLeanCanvasAgent<ProfileMappingResult>('prefill_canvas', {
        startup_id: startupId,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Canvas pre-filled with AI suggestions');
      } else {
        toast.error(data.error || 'Failed to prefill canvas');
      }
    },
    onError: (error) => {
      console.error('Prefill canvas error:', error);
      toast.error('Failed to prefill canvas');
    },
  });
}

/**
 * Get AI suggestions for a specific canvas box
 */
export function useSuggestBox() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      boxKey, 
      existingItems,
      canvasContext
    }: { 
      startupId: string; 
      boxKey: BoxKey;
      existingItems?: string[];
      canvasContext?: Partial<LeanCanvasData>;
    }) => {
      return invokeLeanCanvasAgent<SuggestBoxResult>('suggest_box', {
        startup_id: startupId,
        box_key: boxKey,
        existing_items: existingItems,
        canvas_context: canvasContext,
      });
    },
    onError: (error) => {
      console.error('Suggest box error:', error);
      toast.error('Failed to get suggestions');
    },
  });
}

/**
 * Validate canvas hypotheses and identify risks
 */
export function useValidateCanvas() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      canvasData 
    }: { 
      startupId: string; 
      canvasData: LeanCanvasData;
    }) => {
      return invokeLeanCanvasAgent<ValidateCanvasResult>('validate_canvas', {
        startup_id: startupId,
        canvas_data: canvasData,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        const score = data.overall_score || 0;
        if (score >= 80) {
          toast.success(`Canvas score: ${score}/100 - Strong foundation!`);
        } else if (score >= 60) {
          toast.info(`Canvas score: ${score}/100 - Some assumptions need testing`);
        } else {
          toast.warning(`Canvas score: ${score}/100 - Critical risks identified`);
        }
      } else {
        toast.error(data.error || 'Failed to validate canvas');
      }
    },
    onError: (error) => {
      console.error('Validate canvas error:', error);
      toast.error('Failed to validate canvas');
    },
  });
}

/**
 * Get industry benchmarks for canvas boxes
 */
export function useGetBenchmarks() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      industry 
    }: { 
      startupId: string; 
      industry?: string;
    }) => {
      return invokeLeanCanvasAgent<GetBenchmarksResult>('get_benchmarks', {
        startup_id: startupId,
        industry,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Industry benchmarks loaded');
      } else {
        toast.error(data.error || 'Failed to get benchmarks');
      }
    },
    onError: (error) => {
      console.error('Get benchmarks error:', error);
      toast.error('Failed to get benchmarks');
    },
  });
}

/**
 * Save a canvas version snapshot
 */
export function useSaveCanvasVersion() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      canvasData,
      label
    }: { 
      startupId: string; 
      canvasData: LeanCanvasData;
      label?: string;
    }) => {
      return invokeLeanCanvasAgent<{ success: boolean; version_id?: string; error?: string }>('save_version', {
        startup_id: startupId,
        canvas_data: canvasData,
        label,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Canvas version saved');
      } else {
        toast.error(data.error || 'Failed to save version');
      }
    },
    onError: (error) => {
      console.error('Save version error:', error);
      toast.error('Failed to save canvas version');
    },
  });
}

/**
 * Load canvas version history
 */
export function useCanvasVersions(startupId: string | undefined) {
  return useQuery({
    queryKey: ['canvas-versions', startupId],
    queryFn: async () => {
      if (!startupId) return [];
      const result = await invokeLeanCanvasAgent<{ success: boolean; versions?: CanvasVersion[] }>('load_versions', {
        startup_id: startupId,
      });
      return result.versions || [];
    },
    enabled: !!startupId,
  });
}

/**
 * Restore a specific canvas version
 */
export function useRestoreCanvasVersion() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      versionId 
    }: { 
      startupId: string; 
      versionId: string;
    }) => {
      return invokeLeanCanvasAgent<{ success: boolean; canvas?: LeanCanvasData; error?: string }>('restore_version', {
        startup_id: startupId,
        version_id: versionId,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Canvas version restored');
      } else {
        toast.error(data.error || 'Failed to restore version');
      }
    },
    onError: (error) => {
      console.error('Restore version error:', error);
      toast.error('Failed to restore canvas version');
    },
  });
}

// ============================================================================
// Composite Hook
// ============================================================================

export function useLeanCanvasAgent() {
  return {
    mapProfile: useMapProfile(),
    prefillCanvas: usePrefillCanvas(),
    suggestBox: useSuggestBox(),
    validateCanvas: useValidateCanvas(),
    getBenchmarks: useGetBenchmarks(),
    saveVersion: useSaveCanvasVersion(),
    restoreVersion: useRestoreCanvasVersion(),
  };
}
