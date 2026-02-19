/**
 * Knowledge Map hooks — strategic confidence across 5 dimensions
 *
 * Uses: knowledge_map table (startup_id, dimension, confidence_score, etc.)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// ---------- Interfaces ----------

export type KnowledgeDimension = 'customer' | 'market' | 'product' | 'business_model' | 'technology';

export type SourceTier = 'T1' | 'T2' | 'T3' | 'T4';

export interface KnowledgeEntry {
  id: string;
  startup_id: string;
  dimension: KnowledgeDimension;
  confidence_score: number;
  source_tier: SourceTier;
  evidence_count: number;
  key_insights: string[];
  gaps: string[];
  last_updated_from: string | null;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeMapSummary {
  entries: KnowledgeEntry[];
  overall_score: number;
  strong_areas: KnowledgeDimension[];
  weak_areas: KnowledgeDimension[];
  critical_gaps: KnowledgeDimension[];
}

// ---------- Helpers ----------

const ALL_DIMENSIONS: KnowledgeDimension[] = ['customer', 'market', 'product', 'business_model', 'technology'];

function parseJsonArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  return [];
}

function summarize(entries: KnowledgeEntry[]): KnowledgeMapSummary {
  const scores = entries.map((e) => e.confidence_score);
  const overall = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const strong = entries.filter((e) => e.confidence_score >= 70).map((e) => e.dimension);
  const weak = entries.filter((e) => e.confidence_score < 50 && e.confidence_score >= 25).map((e) => e.dimension);
  const critical = entries.filter((e) => e.confidence_score < 25).map((e) => e.dimension);

  // Add missing dimensions as critical gaps
  const present = new Set(entries.map((e) => e.dimension));
  const missing = ALL_DIMENSIONS.filter((d) => !present.has(d));

  return {
    entries,
    overall_score: overall,
    strong_areas: strong,
    weak_areas: weak,
    critical_gaps: [...critical, ...missing],
  };
}

// ---------- Hooks ----------

/** Fetch all 5 knowledge dimensions for a startup */
export function useKnowledgeMap(startupId: string | undefined) {
  return useQuery({
    queryKey: ['knowledge-map', startupId],
    queryFn: async () => {
      if (!startupId) return summarize([]);
      const { data, error } = await supabase
        .from('knowledge_map')
        .select('*')
        .eq('startup_id', startupId)
        .order('dimension');
      if (error) throw error;
      const entries: KnowledgeEntry[] = (data || []).map((row) => ({
        id: row.id,
        startup_id: row.startup_id,
        dimension: row.dimension as KnowledgeDimension,
        confidence_score: row.confidence_score,
        source_tier: row.source_tier as SourceTier,
        evidence_count: row.evidence_count,
        key_insights: parseJsonArray(row.key_insights),
        gaps: parseJsonArray(row.gaps),
        last_updated_from: row.last_updated_from,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));
      return summarize(entries);
    },
    enabled: !!startupId,
  });
}

/** Upsert a single knowledge dimension */
export function useUpdateKnowledgeDimension() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entry: {
      startup_id: string;
      dimension: KnowledgeDimension;
      confidence_score: number;
      source_tier?: SourceTier;
      evidence_count?: number;
      key_insights?: string[];
      gaps?: string[];
      last_updated_from?: string;
    }) => {
      const { error } = await supabase
        .from('knowledge_map')
        .upsert(
          {
            startup_id: entry.startup_id,
            dimension: entry.dimension,
            confidence_score: entry.confidence_score,
            source_tier: entry.source_tier || 'T4',
            evidence_count: entry.evidence_count || 0,
            key_insights: (entry.key_insights || []) as unknown as Record<string, unknown>,
            gaps: (entry.gaps || []) as unknown as Record<string, unknown>,
            last_updated_from: entry.last_updated_from || null,
          },
          { onConflict: 'startup_id,dimension' }
        );
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['knowledge-map', vars.startup_id] });
    },
  });
}
