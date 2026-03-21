/**
 * useReportProactiveMessage — Derive proactive AI greeting from report data
 *
 * Pure client-side derivation. No API calls. Returns a markdown message
 * summarizing the report score, top strengths, weak areas, and next steps.
 */

import { useMemo } from 'react';
import { DIMENSION_CONFIG, type DimensionId } from '@/config/dimensions';
import type { QuickAction } from '@/lib/ai-capabilities';
import type { StartupMeta } from '@/pages/ValidatorReport';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ReportDataForMessage {
  score: number | null;
  details: Record<string, any>;
}

interface DimensionScore {
  id: DimensionId;
  label: string;
  score: number;
}

// ---------------------------------------------------------------------------
// Report-specific quick actions
// ---------------------------------------------------------------------------

export const REPORT_QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'report_canvas',
    label: 'Generate Lean Canvas',
    prompt: 'Generate a Lean Canvas from this validation report.',
    route: '/lean-canvas',
  },
  {
    id: 'report_weak_area',
    label: 'How to fix weak areas',
    prompt: 'What are the weakest areas in my validation report and how can I address them?',
  },
  {
    id: 'report_pitch_deck',
    label: 'Create pitch deck',
    prompt: 'Help me create a pitch deck based on this validation report.',
    route: '/app/pitch-deck/new',
  },
  {
    id: 'report_sprint',
    label: 'Plan first sprint',
    prompt: 'Create a 90-day sprint plan from the priority actions in my validation report.',
    route: '/sprint-plan',
  },
  {
    id: 'report_explain',
    label: 'Explain my score',
    prompt: 'Break down my overall validation score and explain what each dimension means.',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getVerdict(score: number): string {
  if (score >= 70) return 'GO';
  if (score >= 40) return 'CAUTION';
  return 'NO-GO';
}

function getDimensionScores(details: Record<string, any>): DimensionScore[] {
  const matrix = details?.scores_matrix;
  if (!matrix?.dimensions || !Array.isArray(matrix.dimensions)) return [];

  return matrix.dimensions
    .map((d: any) => {
      const id = d.id || d.dimension;
      const config = id && id in DIMENSION_CONFIG
        ? DIMENSION_CONFIG[id as DimensionId]
        : null;
      if (!config || !d.score) return null;
      return { id: id as DimensionId, label: config.label, score: d.score };
    })
    .filter(Boolean) as DimensionScore[];
}

function getTopStrengths(
  details: Record<string, any>,
  dimensionScores: DimensionScore[],
): string[] {
  // Prefer highlights from report
  const highlights = details?.highlights;
  if (Array.isArray(highlights) && highlights.length > 0) {
    return highlights.slice(0, 3).map((h: any) =>
      typeof h === 'string' ? h : h?.text || h?.label || String(h),
    );
  }

  // Derive from top dimension scores
  if (dimensionScores.length > 0) {
    return [...dimensionScores]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(d => `${d.label} (${d.score}/100)`);
  }

  return [];
}

function getWeakAreas(
  details: Record<string, any>,
  dimensionScores: DimensionScore[],
): string[] {
  // Prefer red_flags from report
  const redFlags = details?.red_flags;
  if (Array.isArray(redFlags) && redFlags.length > 0) {
    return redFlags.slice(0, 3).map((r: any) =>
      typeof r === 'string' ? r : r?.text || r?.label || String(r),
    );
  }

  // Derive from weakest dimension scores
  if (dimensionScores.length > 0) {
    return [...dimensionScores]
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map(d => `${d.label} (${d.score}/100)`);
  }

  return [];
}

function getWeakestDimension(dimensionScores: DimensionScore[]): DimensionScore | null {
  if (dimensionScores.length === 0) return null;
  return [...dimensionScores].sort((a, b) => a.score - b.score)[0];
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useReportProactiveMessage(
  report: ReportDataForMessage | null,
  startupMeta?: StartupMeta,
): { proactiveMessage: string | null } {
  return useMemo(() => {
    if (!report) return { proactiveMessage: null };

    const name = startupMeta?.name || 'Your startup';
    const score = report.score;
    const details = report.details || {};
    const dimensionScores = getDimensionScores(details);
    const strengths = getTopStrengths(details, dimensionScores);
    const weakAreas = getWeakAreas(details, dimensionScores);
    const weakest = getWeakestDimension(dimensionScores);

    // Build message parts
    const lines: string[] = [];

    // Header
    if (score != null) {
      const verdict = getVerdict(score);
      lines.push(`**Your validation report is ready!** ${name} scored **${score}/100** — **${verdict}**.`);
    } else {
      lines.push(`**Your validation report is ready!** Score unavailable — some agents did not complete.`);
    }

    lines.push('');

    // Strengths
    if (strengths.length > 0) {
      lines.push(`**Top strengths:** ${strengths.join(' · ')}`);
    }

    // Weak areas
    if (weakAreas.length > 0) {
      lines.push(`**Areas to address:** ${weakAreas.join(' · ')}`);
    }

    lines.push('');
    lines.push('**Suggested next steps:**');
    lines.push('1. Generate a Lean Canvas from this report');
    if (weakest) {
      lines.push(`2. Address ${weakest.label} (${weakest.score}/100) — your weakest area`);
    } else {
      lines.push('2. Review each dimension for improvement opportunities');
    }
    lines.push('3. Create your pitch deck');
    lines.push('4. Plan your first 90-day sprint');

    return { proactiveMessage: lines.join('\n') };
  }, [report, startupMeta]);
}
