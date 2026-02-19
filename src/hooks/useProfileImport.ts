import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Confidence = 'high' | 'medium' | 'low';

export interface ExtractedField {
  key: string;
  label: string;
  value: unknown;
  currentValue: unknown;
  confidence: Confidence;
  selected: boolean;
  hasConflict: boolean;
}

interface ExtractionResult {
  extracted: Record<string, unknown> & { confidence?: Record<string, Confidence> };
  urlContext?: Array<{ url: string; status: string }>;
}

const FIELD_LABELS: Record<string, string> = {
  name: 'Company Name',
  tagline: 'Tagline',
  description: 'Description',
  industry: 'Industry',
  business_model: 'Business Model',
  stage: 'Stage',
  unique_value: 'Primary Differentiator',
  target_customers: 'Customer Segments',
  key_features: 'Key Features',
  team_size: 'Team Size',
  founded_year: 'Founded Year',
  website_url: 'Website',
  linkedin_url: 'LinkedIn',
  twitter_url: 'Twitter / X',
  headquarters: 'Headquarters',
  one_liner: 'One-Liner',
};

// Keys that we actually map to form fields
const EXTRACTABLE_KEYS = [
  'name', 'tagline', 'description', 'industry', 'business_model', 'stage',
  'unique_value', 'target_customers', 'key_features', 'team_size',
  'founded_year', 'website_url', 'linkedin_url', 'twitter_url', 'headquarters',
];

function isEmpty(v: unknown): boolean {
  if (v === null || v === undefined || v === '') return true;
  if (Array.isArray(v) && v.length === 0) return true;
  return false;
}

export function useProfileImport() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<ExtractedField[]>([]);

  const extractFromURL = useCallback(async (
    url: string,
    currentValues: Record<string, unknown>,
  ) => {
    setIsExtracting(true);
    setError(null);
    setFields([]);

    try {
      const { data, error: fnError } = await supabase.functions.invoke<ExtractionResult>(
        'profile-import',
        { body: { url } },
      );

      if (fnError) throw new Error(fnError.message || 'Edge function error');
      if (!data?.extracted) throw new Error('No data extracted from the page');

      const { extracted } = data;
      const confidence = extracted.confidence || {};

      const result: ExtractedField[] = [];
      for (const key of EXTRACTABLE_KEYS) {
        const value = extracted[key];
        if (isEmpty(value)) continue; // skip fields Gemini couldn't extract

        const currentValue = currentValues[key];
        const hasConflict = !isEmpty(currentValue);

        result.push({
          key,
          label: FIELD_LABELS[key] || key,
          value,
          currentValue,
          confidence: confidence[key] || 'medium',
          selected: !hasConflict, // pre-select only non-conflicting fields
          hasConflict,
        });
      }

      setFields(result);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Extraction failed';
      setError(msg);
      return null;
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const toggleField = useCallback((key: string) => {
    setFields(prev => prev.map(f =>
      f.key === key ? { ...f, selected: !f.selected } : f,
    ));
  }, []);

  const toggleAll = useCallback((selected: boolean) => {
    setFields(prev => prev.map(f => ({ ...f, selected })));
  }, []);

  const selectedCount = fields.filter(f => f.selected).length;

  const reset = useCallback(() => {
    setFields([]);
    setError(null);
    setIsExtracting(false);
  }, []);

  return {
    isExtracting,
    error,
    fields,
    selectedCount,
    extractFromURL,
    toggleField,
    toggleAll,
    reset,
  };
}
