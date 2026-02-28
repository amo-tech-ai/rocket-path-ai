/**
 * useReportAIContext — Report-Aware AI Panel Context
 *
 * Extracts reportId and dimensionId from the current URL.
 * Returns dimension-specific quick action chips and header props
 * for the AI panel when viewing a V3 report dimension page.
 *
 * MVP-06: Section-aware AI panel context.
 */

import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { DIMENSION_CONFIG, type DimensionId } from '@/config/dimensions';
import type { QuickAction } from '@/lib/ai-capabilities';

const DIMENSION_IDS = new Set<string>(Object.keys(DIMENSION_CONFIG));

export interface ReportAIContext {
  /** True when on any /validator/report/:id route */
  isOnReportPage: boolean;
  /** True when the section is a valid dimension ID */
  isOnDimensionPage: boolean;
  reportId: string | null;
  dimensionId: DimensionId | null;
  dimensionLabel: string | null;
  dimensionColor: string | null;
  /** 4 dimension-specific quick action chips (empty when not on a dimension page) */
  quickActions: QuickAction[];
}

export function useReportAIContext(): ReportAIContext {
  const { pathname } = useLocation();

  return useMemo(() => {
    // Parse /validator/report/:reportId/:section?
    const match = pathname.match(
      /^\/validator\/report\/([^/]+)(?:\/([^/]+))?/,
    );

    if (!match) {
      return {
        isOnReportPage: false,
        isOnDimensionPage: false,
        reportId: null,
        dimensionId: null,
        dimensionLabel: null,
        dimensionColor: null,
        quickActions: [],
      };
    }

    const reportId = match[1];
    const section = match[2] ?? null;
    const dimensionId =
      section && DIMENSION_IDS.has(section)
        ? (section as DimensionId)
        : null;
    const config = dimensionId ? DIMENSION_CONFIG[dimensionId] : null;

    // Build dimension-specific quick action chips (per task spec MVP-06)
    const quickActions: QuickAction[] =
      dimensionId && config
        ? [
            {
              id: 'explain_score',
              label: 'Explain this score',
              prompt: `Explain how the ${config.label} composite score was calculated and what the sub-scores mean.`,
            },
            {
              id: 'how_to_improve',
              label: 'How to improve',
              prompt: `Based on the ${config.label} analysis, what are the most impactful things I can do to improve this score?`,
            },
            {
              id: 'compare_benchmarks',
              label: 'Compare to benchmarks',
              prompt: `How does my ${config.label} score compare to typical startups at my stage?`,
            },
            {
              id: 'drill_subscores',
              label: 'Drill into sub-scores',
              prompt: `Break down each sub-score in ${config.label} and explain what's driving the numbers.`,
            },
          ]
        : [];

    return {
      isOnReportPage: true,
      isOnDimensionPage: !!dimensionId,
      reportId,
      dimensionId,
      dimensionLabel: config?.label ?? null,
      dimensionColor: config?.color ?? null,
      quickActions,
    };
  }, [pathname]);
}
