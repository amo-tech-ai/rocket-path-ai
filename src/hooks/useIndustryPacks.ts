/**
 * useIndustryPacks Hook
 * Simple query hook for fetching industry packs from database
 * Re-exports types and provides direct Supabase query
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// Types
// ============================================================================

export interface StartupType {
  id: string;
  label: string;
  description?: string;
}

export interface IndustryPack {
  id: string;
  industry: string;
  display_name: string;
  description: string | null;
  icon: string | null;
  startup_types: StartupType[] | null;
  is_active: boolean;
  benchmarks?: Record<string, unknown>;
  terminology?: { term: string; definition: string }[];
}

// ============================================================================
// Hook
// ============================================================================

export function useIndustryPacks() {
  return useQuery({
    queryKey: ['industry-packs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('industry_packs')
        .select('id, industry, display_name, description, icon, startup_types, is_active, benchmarks, terminology')
        .eq('is_active', true)
        .order('display_name');

      if (error) throw error;

      // Type assertion for startup_types - cast through unknown to satisfy TS
      return (data || []).map(pack => ({
        ...pack,
        startup_types: pack.startup_types as unknown as StartupType[] | null,
        benchmarks: pack.benchmarks as unknown as Record<string, unknown> | undefined,
        terminology: pack.terminology as unknown as { term: string; definition: string }[] | undefined,
      })) as IndustryPack[];
    },
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  });
}

/**
 * Get a single industry pack by industry slug
 */
export function useIndustryPack(industry: string | undefined) {
  return useQuery({
    queryKey: ['industry-pack', industry],
    queryFn: async () => {
      if (!industry) return null;

      const { data, error } = await supabase
        .from('industry_packs')
        .select('*')
        .eq('industry', industry)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      return {
        ...data,
        startup_types: data.startup_types as unknown as StartupType[] | null,
        benchmarks: data.benchmarks as unknown as Record<string, unknown> | undefined,
        terminology: data.terminology as unknown as { term: string; definition: string }[] | undefined,
      } as IndustryPack;
    },
    enabled: !!industry,
    staleTime: 1000 * 60 * 30,
  });
}
