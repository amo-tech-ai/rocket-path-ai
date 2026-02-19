import { useMemo } from 'react';
import type { HealthBreakdown } from '@/hooks/useHealthScore';

export interface Risk {
  title: string;
  severity: 'fatal' | 'high' | 'medium' | 'low';
  source: string;
}

/**
 * Derives top risks from health score breakdown.
 * No extra DB queries — uses the breakdown already fetched.
 */
export function useTopRisks(
  breakdown: HealthBreakdown | undefined,
  warnings: string[] | undefined
): Risk[] {
  return useMemo(() => {
    if (!breakdown) return [];

    const risks: Risk[] = [];

    // Derive risks from low-scoring dimensions
    const dimensions: { key: keyof HealthBreakdown; label: string }[] = [
      { key: 'problemClarity', label: 'Problem clarity' },
      { key: 'solutionFit', label: 'Solution fit' },
      { key: 'marketUnderstanding', label: 'Market understanding' },
      { key: 'tractionProof', label: 'Traction proof' },
      { key: 'teamReadiness', label: 'Team readiness' },
      { key: 'investorReadiness', label: 'Investor readiness' },
    ];

    for (const dim of dimensions) {
      const score = breakdown[dim.key]?.score ?? 100;
      if (score < 40) {
        risks.push({
          title: `${dim.label} is critically low (${score}/100)`,
          severity: score < 20 ? 'fatal' : 'high',
          source: 'Health Score',
        });
      } else if (score < 60) {
        risks.push({
          title: `${dim.label} needs work (${score}/100)`,
          severity: 'medium',
          source: 'Health Score',
        });
      }
    }

    // Add explicit warnings from health scorer
    if (warnings) {
      for (const w of warnings.slice(0, 2)) {
        if (!risks.some((r) => r.title.includes(w.slice(0, 20)))) {
          risks.push({ title: w, severity: 'medium', source: 'Health Scorer' });
        }
      }
    }

    // Sort: fatal > high > medium > low, max 3
    const order = { fatal: 0, high: 1, medium: 2, low: 3 };
    risks.sort((a, b) => order[a.severity] - order[b.severity]);
    return risks.slice(0, 3);
  }, [breakdown, warnings]);
}
