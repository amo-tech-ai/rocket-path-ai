import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PanelDetailResponse {
  section_number: number;
  more_detail: string;
  why_this_matters: string;
  risks_gaps: string[];
  validate_next: string[];
}

/** Static fallback data keyed by section number — used when EF call fails */
const FALLBACK_DATA: Record<number, Omit<PanelDetailResponse, 'section_number'>> = {
  1: {
    more_detail: 'Detailed analysis of the problem space — how severe the pain is, who experiences it, and what existing solutions fail to address.',
    why_this_matters: 'Problem severity directly drives willingness to pay. This dimension carries significant weight in validation scoring.',
    risks_gaps: ['Primary research may be needed to confirm quantitative claims', 'Seasonal vs consistent patterns unclear'],
    validate_next: ['Interview 5 target users about their current workflow', 'Survey competitors\' review pages for pain point patterns'],
  },
};

export function useReportPanelDetail() {
  const cache = useRef<Map<number, PanelDetailResponse>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PanelDetailResponse | null>(null);
  const [currentSection, setCurrentSection] = useState<number | null>(null);

  const fetchPanelDetail = useCallback(async (
    reportId: string,
    sectionNumber: number,
    sectionTitle: string,
    sectionContent: string,
    score?: number,
    dimensionScore?: number,
  ) => {
    setCurrentSection(sectionNumber);
    setError(null);

    // Check cache
    const cached = cache.current.get(sectionNumber);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    setData(null);

    try {
      // Refresh session to avoid stale JWT
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const { data: efData, error: efError } = await supabase.functions.invoke(
        'validator-panel-detail',
        {
          body: {
            report_id: reportId,
            section_number: sectionNumber,
            section_title: sectionTitle,
            section_content: sectionContent,
            score,
            dimension_score: dimensionScore,
          },
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      if (efError) throw efError;

      const result: PanelDetailResponse = {
        section_number: sectionNumber,
        more_detail: efData?.more_detail || '',
        why_this_matters: efData?.why_this_matters || '',
        risks_gaps: efData?.risks_gaps || [],
        validate_next: efData?.validate_next || [],
      };

      cache.current.set(sectionNumber, result);
      setData(result);
    } catch (err) {
      console.warn('[useReportPanelDetail] EF call failed, using fallback:', err);

      // Fallback to static data on EF failure
      const fallback = FALLBACK_DATA[sectionNumber];
      if (fallback) {
        const result: PanelDetailResponse = { section_number: sectionNumber, ...fallback };
        cache.current.set(sectionNumber, result);
        setData(result);
      } else {
        setError('Unable to load detail for this section');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, data, currentSection, fetchPanelDetail };
}
