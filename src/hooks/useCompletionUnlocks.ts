import { useMemo } from 'react';

export interface MissingField {
  field: string;
  label: string;
  unlocks: string[];
  path: string;
}

export interface CompletionData {
  percent: number;
  filledCount: number;
  totalCount: number;
  missingFields: MissingField[];
}

// Field-to-unlock map from wireframe spec
const FIELD_MAP: { field: string; label: string; unlocks: string[]; path: string }[] = [
  { field: 'description', label: 'Description', unlocks: ['AI insights', 'Validator analysis'], path: '/company-profile' },
  { field: 'industry', label: 'Industry', unlocks: ['Industry benchmarks', 'Competitor analysis'], path: '/company-profile' },
  { field: 'target_market', label: 'Target market', unlocks: ['TAM/SAM/SOM validation', 'Market sizing chart'], path: '/company-profile' },
  { field: 'key_features', label: 'Key features', unlocks: ['Solution scoring', 'Feature prioritization'], path: '/company-profile' },
  { field: 'business_model', label: 'Business model', unlocks: ['Revenue projections', 'Unit economics'], path: '/company-profile' },
  { field: 'website_url', label: 'Website URL', unlocks: ['URL enrichment', 'Competitor discovery'], path: '/company-profile' },
  { field: 'traction_mrr', label: 'Monthly revenue (MRR)', unlocks: ['Financial projections', 'Runway calculation'], path: '/company-profile' },
  { field: 'is_raising', label: 'Funding status', unlocks: ['Investor readiness score', 'Fundraising strategy'], path: '/company-profile' },
  { field: 'competitors', label: 'Competitors', unlocks: ['Deep competitor analysis', 'Positioning map'], path: '/company-profile' },
  { field: 'tagline', label: 'Tagline / UVP', unlocks: ['Pitch clarity score', 'UVP validation'], path: '/company-profile' },
];

/**
 * Derives profile completion from startup data already loaded on dashboard.
 * No extra DB queries — uses the startup object.
 */
export function useCompletionUnlocks(startup: Record<string, unknown> | null | undefined): CompletionData {
  return useMemo(() => {
    if (!startup) {
      return { percent: 0, filledCount: 0, totalCount: FIELD_MAP.length, missingFields: FIELD_MAP };
    }

    const missing: MissingField[] = [];
    let filled = 0;

    for (const def of FIELD_MAP) {
      const value = def.field === 'traction_mrr'
        ? (startup.traction_data as Record<string, unknown> | null)?.mrr
        : startup[def.field];

      const isFilled = value != null && value !== '' && !(Array.isArray(value) && value.length === 0);
      if (isFilled) {
        filled++;
      } else {
        missing.push(def);
      }
    }

    return {
      percent: Math.round((filled / FIELD_MAP.length) * 100),
      filledCount: filled,
      totalCount: FIELD_MAP.length,
      missingFields: missing.slice(0, 5), // Show max 5
    };
  }, [startup]);
}
