/**
 * useStrategicSummary — Derives strategic insights from V3 dimension data
 *
 * Client-side derivation: reads ReportDetailsV2/V3ReportDetails and produces
 * 3 strategic sections (Positioning, Build Focus, Fundability) with V2 fallback.
 *
 * Follows useReportLeanCanvas pattern: useMemo, V3 first → V2 fallback.
 *
 * POST-01: Strategic Summary Report Page (Consolidated)
 */

import { useMemo } from 'react';
import { DIMENSION_CONFIG, type DimensionId } from '@/config/dimensions';
import type { ReportDetailsV2 } from '@/types/validation-report';
import type { DimensionPageData, V3ReportDetails } from '@/types/v3-report';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PositioningData {
  sentence: string;
  differentiators: string[];
  moatGap: string | null;
}

export interface BuildItem {
  rank: number;
  action: string;
  source: DimensionId;
  timeframe: string;
  impact: string;
}

export interface BuildFocusData {
  topActions: BuildItem[];
  ninetyDayPreview: string;
}

export interface FundabilitySignal {
  label: string;
  dimension: DimensionId;
  score: number;
}

export interface FundabilityData {
  strengths: FundabilitySignal[];
  weaknesses: FundabilitySignal[];
  improvementActions: string[];
}

export interface StrategicSummaryResult {
  hasData: boolean;
  hasV3Dimensions: boolean;
  positioning: PositioningData;
  buildFocus: BuildFocusData;
  fundability: FundabilityData;
}

// ---------------------------------------------------------------------------
// Impact ordering for sorting priority actions
// ---------------------------------------------------------------------------

const IMPACT_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function impactRank(impact: string): number {
  return IMPACT_ORDER[impact.toLowerCase()] ?? 3;
}

// ---------------------------------------------------------------------------
// V3 Extraction helpers
// ---------------------------------------------------------------------------

function extractPositioningV3(
  dims: Partial<Record<DimensionId, DimensionPageData>>,
): PositioningData {
  const comp = dims.competition;
  const prob = dims.problem;

  // Sentence: combine problem + competition headlines
  const sentenceParts: string[] = [];
  if (prob?.headline) sentenceParts.push(prob.headline);
  if (comp?.headline) sentenceParts.push(comp.headline);
  const sentence = sentenceParts.join(' — ') || 'Positioning data not yet available.';

  // Differentiators: top-scoring sub-scores from competition dimension
  const differentiators: string[] = [];
  if (comp?.subScores?.length) {
    const sorted = [...comp.subScores].sort((a, b) => b.score - a.score);
    for (const ss of sorted.slice(0, 3)) {
      differentiators.push(`${ss.label}: ${ss.description}`);
    }
  }
  // Pad from problem sub-scores if needed
  if (differentiators.length < 3 && prob?.subScores?.length) {
    const sorted = [...prob.subScores].sort((a, b) => b.score - a.score);
    for (const ss of sorted) {
      if (differentiators.length >= 3) break;
      differentiators.push(`${ss.label}: ${ss.description}`);
    }
  }

  // Moat gap: lowest-scoring competition sub-score
  let moatGap: string | null = null;
  if (comp?.subScores?.length) {
    const weakest = [...comp.subScores].sort((a, b) => a.score - b.score)[0];
    if (weakest && weakest.score < 70) {
      moatGap = `${weakest.label} (${weakest.score}/100) — ${weakest.description}`;
    }
  }

  return { sentence, differentiators, moatGap };
}

function extractBuildFocusV3(
  dims: Partial<Record<DimensionId, DimensionPageData>>,
): BuildFocusData {
  // Collect all priority actions across all dimensions
  const allActions: BuildItem[] = [];

  for (const [dimId, dim] of Object.entries(dims)) {
    if (!dim?.actions?.length) continue;
    for (const a of dim.actions) {
      allActions.push({
        rank: a.rank,
        action: a.action,
        source: dimId as DimensionId,
        timeframe: a.timeframe,
        impact: a.impact,
      });
    }
  }

  // Sort: impact descending (Critical > High > Medium > Low), then rank ascending
  allActions.sort((a, b) => {
    const impDiff = impactRank(a.impact) - impactRank(b.impact);
    if (impDiff !== 0) return impDiff;
    return a.rank - b.rank;
  });

  const topActions = allActions.slice(0, 5).map((a, i) => ({ ...a, rank: i + 1 }));

  // 90-day preview from execution timeline
  let ninetyDayPreview = '';
  const exec = dims.execution;
  if (exec?.diagram?.type === 'execution-timeline') {
    const phases = exec.diagram.data.phases || [];
    const first3 = phases.slice(0, 3);
    if (first3.length > 0) {
      ninetyDayPreview = first3
        .map(p => `${p.name} (${p.duration}): ${p.milestones.slice(0, 2).join(', ')}`)
        .join(' → ');
    }
  }
  if (!ninetyDayPreview && exec?.summary) {
    ninetyDayPreview = exec.summary;
  }

  return { topActions, ninetyDayPreview };
}

function extractFundabilityV3(
  dims: Partial<Record<DimensionId, DimensionPageData>>,
): FundabilityData {
  // Rank dimensions by composite score
  const scored: { id: DimensionId; label: string; score: number; actions: string[] }[] = [];

  for (const [dimId, dim] of Object.entries(dims)) {
    if (!dim) continue;
    const cfg = DIMENSION_CONFIG[dimId as DimensionId];
    if (!cfg) continue;
    scored.push({
      id: dimId as DimensionId,
      label: cfg.label,
      score: dim.compositeScore ?? 0,
      actions: (dim.actions || []).map(a => a.action),
    });
  }

  scored.sort((a, b) => b.score - a.score);

  const strengths: FundabilitySignal[] = scored.slice(0, 3).map(s => ({
    label: s.label,
    dimension: s.id,
    score: s.score,
  }));

  const weaknesses: FundabilitySignal[] = scored
    .slice(-3)
    .reverse()
    .map(s => ({
      label: s.label,
      dimension: s.id,
      score: s.score,
    }));

  // Improvement actions: first action from each of the 3 weakest
  const improvementActions: string[] = scored
    .slice(-3)
    .map(s => s.actions[0])
    .filter(Boolean);

  return { strengths, weaknesses, improvementActions };
}

// ---------------------------------------------------------------------------
// V2 Extraction helpers
// ---------------------------------------------------------------------------

function extractPositioningV2(d: ReportDetailsV2): PositioningData {
  const parts: string[] = [];

  // Sentence from positioning description + problem pain
  if (d.competition?.positioning?.description) {
    parts.push(d.competition.positioning.description);
  }
  const pc = d.problem_clarity;
  if (typeof pc === 'object' && pc?.pain) {
    parts.push(pc.pain);
  }
  const sentence = parts.join(' — ') || 'Positioning data not yet available.';

  // Differentiators from market_gaps
  const differentiators = (d.competition?.market_gaps || []).slice(0, 3);

  // Moat gap from red_flags mentioning competition/moat/defensib
  const moatGap = (d.red_flags || []).find(
    (f: string) => /competi|moat|defensib|barrier/i.test(typeof f === 'string' ? f : ''),
  ) as string | undefined || null;

  return { sentence, differentiators, moatGap };
}

function extractBuildFocusV2(d: ReportDetailsV2): BuildFocusData {
  const steps = d.next_steps || [];
  const topActions: BuildItem[] = steps.slice(0, 5).map((s: any, i: number) => {
    const action = typeof s === 'string' ? s : s.action || '';
    const timeframe = typeof s === 'object' ? s.timeframe || '' : '';
    return {
      rank: i + 1,
      action,
      source: 'execution' as DimensionId,
      timeframe,
      impact: i < 2 ? 'High' : 'Medium',
    };
  });

  const mvpWeeks = (d.technology_stack as any)?.mvp_timeline_weeks
    || (d.mvp_scope as any)?.timeline_weeks;
  let ninetyDayPreview = '';
  if (mvpWeeks) {
    const firstSteps = steps.slice(0, 2).map((s: any) =>
      typeof s === 'string' ? s : s.action || '',
    ).filter(Boolean);
    ninetyDayPreview = `${mvpWeeks}-week MVP timeline. ${firstSteps.join('. ')}`.trim();
  }

  return { topActions, ninetyDayPreview };
}

function extractFundabilityV2(d: ReportDetailsV2): FundabilityData {
  const highlights: string[] = d.highlights || [];
  const redFlags: string[] = d.red_flags || [];

  const strengths: FundabilitySignal[] = highlights.slice(0, 3).map((h, i) => ({
    label: typeof h === 'string' ? h : String(h),
    dimension: (['problem', 'market', 'revenue'] as DimensionId[])[i] || 'problem',
    score: 0, // V2 doesn't have per-dimension scores
  }));

  const weaknesses: FundabilitySignal[] = redFlags.slice(0, 3).map((r, i) => ({
    label: typeof r === 'string' ? r : String(r),
    dimension: (['competition', 'traction', 'risk'] as DimensionId[])[i] || 'risk',
    score: 0,
  }));

  const improvementActions: string[] = (d.next_steps || [])
    .slice(0, 3)
    .map((s: any) => typeof s === 'string' ? s : s.action || '')
    .filter(Boolean);

  return { strengths, weaknesses, improvementActions };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

const EMPTY_POSITIONING: PositioningData = {
  sentence: 'Complete more dimensions to see your positioning.',
  differentiators: [],
  moatGap: null,
};

const EMPTY_BUILD_FOCUS: BuildFocusData = {
  topActions: [],
  ninetyDayPreview: '',
};

const EMPTY_FUNDABILITY: FundabilityData = {
  strengths: [],
  weaknesses: [],
  improvementActions: [],
};

export function useStrategicSummary(
  details: ReportDetailsV2 | null | undefined,
): StrategicSummaryResult {
  return useMemo(() => {
    if (!details) {
      return {
        hasData: false,
        hasV3Dimensions: false,
        positioning: EMPTY_POSITIONING,
        buildFocus: EMPTY_BUILD_FOCUS,
        fundability: EMPTY_FUNDABILITY,
      };
    }

    // Check for V3 dimensions (same pattern as useReportLeanCanvas)
    const dims = (details as V3ReportDetails).dimensions as
      | Partial<Record<DimensionId, DimensionPageData>>
      | undefined;
    const hasV3 = !!(dims && typeof dims === 'object' && Object.keys(dims).length > 0);

    let positioning: PositioningData;
    let buildFocus: BuildFocusData;
    let fundability: FundabilityData;

    if (hasV3 && dims) {
      positioning = extractPositioningV3(dims);
      buildFocus = extractBuildFocusV3(dims);
      fundability = extractFundabilityV3(dims);
    } else {
      positioning = extractPositioningV2(details);
      buildFocus = extractBuildFocusV2(details);
      fundability = extractFundabilityV2(details);
    }

    const hasData =
      positioning.differentiators.length > 0 ||
      buildFocus.topActions.length > 0 ||
      fundability.strengths.length > 0;

    return { hasData, hasV3Dimensions: hasV3, positioning, buildFocus, fundability };
  }, [details]);
}
