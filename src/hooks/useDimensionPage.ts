/**
 * useDimensionPage — Fetches dimension data for a V3 report page.
 *
 * State machine: idle → loading → success | error | empty | v2-fallback | partial
 *   success: full data available
 *   error: fetch failed
 *   empty: dimension data is null (pipeline failure for this dimension)
 *   v2-fallback: V2 report, no dimensions field
 *   partial: some fields missing (e.g. no diagram)
 */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DIMENSION_CONFIG, type DimensionId } from '@/config/dimensions';
import type {
  DimensionPageData,
  SubScore,
  PriorityAction,
  RiskSignal,
  DiagramData,
  Verdict,
} from '@/types/v3-report';

export type DimensionPageState =
  | 'loading'
  | 'success'
  | 'error'
  | 'empty'
  | 'v2-fallback'
  | 'partial';

export interface UseDimensionPageResult {
  state: DimensionPageState;
  data: DimensionPageData | null;
  reportVersion: string | null;
  error: Error | null;
}

/**
 * Transform raw backend dimension data to frontend DimensionPageData shape.
 * Backend uses snake_case; frontend uses camelCase.
 */
function transformDimensionData(
  dimensionId: DimensionId,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raw: Record<string, any>,
): DimensionPageData {
  const config = DIMENSION_CONFIG[dimensionId];

  // Transform sub-scores: backend { name, score, label } → frontend SubScore
  const subScores: SubScore[] = (raw.sub_scores || []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (s: any, i: number) => ({
      id: s.name || `sub-${i}`,
      label: s.label || s.name || `Score ${i + 1}`,
      score: s.score ?? 0,
      weight: s.weight ?? 1 / (raw.sub_scores?.length || 1),
      color: config.color,
      description: s.description || '',
    }),
  );

  // Transform priority actions: backend strings → frontend PriorityAction
  const actions: PriorityAction[] = (raw.priority_actions || []).map(
    (action: string, i: number) => ({
      rank: i + 1,
      action,
      timeframe: '',
      effort: '',
      impact: '',
    }),
  );

  // Transform risk signals: backend strings → frontend RiskSignal
  const riskSignals: RiskSignal[] = (raw.risk_signals || []).map(
    (signal: string) => ({
      severity: 'medium' as const,
      category: config.label,
      description: signal,
      mitigation: '',
    }),
  );

  // Transform diagram data — already structured by Gemini, wrap with type discriminator
  let diagram: DiagramData | undefined;
  if (raw.diagram && typeof raw.diagram === 'object') {
    diagram = {
      type: config.diagramType,
      data: raw.diagram,
    } as DiagramData;
  }

  return {
    dimensionId,
    title: config.label,
    headline: raw.headline || '',
    diagram: diagram || { type: config.diagramType, data: {} } as DiagramData,
    compositeScore: raw.composite_score ?? 0,
    subScores,
    summary: raw.executive_summary || '',
    actions,
    riskSignals,
  };
}

async function fetchDimensionData(
  reportId: string,
  dimensionId: DimensionId,
): Promise<{ data: DimensionPageData | null; reportVersion: string | null; state: DimensionPageState }> {
  const { data: report, error } = await supabase
    .from('validator_reports')
    .select('details, report_version')
    .eq('id', reportId)
    .single();

  if (error || !report) {
    throw new Error(error?.message || 'Report not found');
  }

  const reportVersion = report.report_version || 'v2';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const details = report.details as Record<string, any> | null;

  // V2 report — no dimensions field
  if (!details?.dimensions) {
    return { data: null, reportVersion, state: 'v2-fallback' };
  }

  // Dimension not in the report (pipeline failure for this dimension)
  const raw = details.dimensions[dimensionId];
  if (!raw) {
    return { data: null, reportVersion, state: 'empty' };
  }

  // Transform the raw data
  const dimensionData = transformDimensionData(dimensionId, raw);

  // Check for partial data (missing diagram or sub-scores)
  const isPartial = !raw.diagram || !raw.sub_scores?.length;

  return {
    data: dimensionData,
    reportVersion,
    state: isPartial ? 'partial' : 'success',
  };
}

export function useDimensionPage(
  reportId: string | undefined,
  dimensionId: DimensionId | undefined,
): UseDimensionPageResult {
  const query = useQuery({
    queryKey: ['dimension-page', reportId, dimensionId],
    queryFn: () => fetchDimensionData(reportId!, dimensionId!),
    enabled: !!reportId && !!dimensionId,
    staleTime: 10 * 60 * 1000, // 10 minutes — report data doesn't change
  });

  if (!reportId || !dimensionId) {
    return { state: 'loading', data: null, reportVersion: null, error: null };
  }

  if (query.isLoading) {
    return { state: 'loading', data: null, reportVersion: null, error: null };
  }

  if (query.error) {
    return {
      state: 'error',
      data: null,
      reportVersion: null,
      error: query.error instanceof Error ? query.error : new Error('Unknown error'),
    };
  }

  if (!query.data) {
    return { state: 'empty', data: null, reportVersion: null, error: null };
  }

  return {
    state: query.data.state,
    data: query.data.data,
    reportVersion: query.data.reportVersion,
    error: null,
  };
}
