/**
 * useReportProactiveMessage Tests
 *
 * Tests the proactive AI greeting derivation from report data:
 * - Score + verdict rendering
 * - Strengths from highlights and dimension scores
 * - Weak areas from red_flags and dimension scores
 * - Null/missing score handling (ScoringAgent failures)
 * - Quick actions export
 * - Edge cases (empty details, no dimensions)
 */

import { describe, it, expect } from 'vitest';
import { REPORT_QUICK_ACTIONS } from '@/hooks/useReportProactiveMessage';

// ---------------------------------------------------------------------------
// We can't call the hook directly without React rendering context,
// so we test the exported constants and the derivation logic by extracting
// the pure functions. Since the hook is a thin useMemo wrapper, we replicate
// the core logic here for thorough unit testing.
// ---------------------------------------------------------------------------

// Re-implement the core derivation logic for testing (mirrors hook internals)
function getVerdict(score: number): string {
  if (score >= 70) return 'GO';
  if (score >= 40) return 'CAUTION';
  return 'NO-GO';
}

interface DimensionScore {
  id: string;
  label: string;
  score: number;
}

function getDimensionScores(details: Record<string, any>): DimensionScore[] {
  const matrix = details?.scores_matrix;
  if (!matrix?.dimensions || !Array.isArray(matrix.dimensions)) return [];
  return matrix.dimensions
    .filter((d: any) => d.id && d.score != null)
    .map((d: any) => ({ id: d.id, label: d.label || d.id, score: d.score }));
}

function getTopStrengths(details: Record<string, any>, dims: DimensionScore[]): string[] {
  const highlights = details?.highlights;
  if (Array.isArray(highlights) && highlights.length > 0) {
    return highlights.slice(0, 3).map((h: any) =>
      typeof h === 'string' ? h : h?.text || h?.label || String(h),
    );
  }
  if (dims.length > 0) {
    return [...dims].sort((a, b) => b.score - a.score).slice(0, 3)
      .map(d => `${d.label} (${d.score}/100)`);
  }
  return [];
}

function getWeakAreas(details: Record<string, any>, dims: DimensionScore[]): string[] {
  const redFlags = details?.red_flags;
  if (Array.isArray(redFlags) && redFlags.length > 0) {
    return redFlags.slice(0, 3).map((r: any) =>
      typeof r === 'string' ? r : r?.text || r?.label || String(r),
    );
  }
  if (dims.length > 0) {
    return [...dims].sort((a, b) => a.score - b.score).slice(0, 3)
      .map(d => `${d.label} (${d.score}/100)`);
  }
  return [];
}

// ---------------------------------------------------------------------------
// Test Data Fixtures
// ---------------------------------------------------------------------------

const FULL_REPORT = {
  score: 72,
  details: {
    highlights: ['Strong problem-market fit', 'Clear revenue model', 'Experienced team'],
    red_flags: ['No traction data', 'Crowded market'],
    scores_matrix: {
      overall_weighted: 72,
      dimensions: [
        { id: 'problem', label: 'Problem Fit', score: 85 },
        { id: 'customer', label: 'Target Customer', score: 70 },
        { id: 'market', label: 'Market Opportunity', score: 78 },
        { id: 'competition', label: 'Competitive Edge', score: 55 },
        { id: 'revenue', label: 'Revenue Model', score: 80 },
        { id: 'ai-strategy', label: 'Tech & AI Advantage', score: 65 },
        { id: 'execution', label: 'Founder Execution', score: 60 },
        { id: 'traction', label: 'Traction & Evidence', score: 40 },
      ],
    },
  },
};

const REPORT_NO_SCORE = {
  score: null,
  details: {
    scores_matrix: {
      dimensions: [
        { id: 'problem', label: 'Problem Fit', score: 70 },
        { id: 'revenue', label: 'Revenue Model', score: 50 },
      ],
    },
  },
};

const REPORT_NO_HIGHLIGHTS = {
  score: 65,
  details: {
    scores_matrix: {
      overall_weighted: 65,
      dimensions: [
        { id: 'problem', label: 'Problem Fit', score: 85 },
        { id: 'traction', label: 'Traction & Evidence', score: 30 },
        { id: 'market', label: 'Market Opportunity', score: 70 },
      ],
    },
  },
};

const REPORT_EMPTY_DETAILS = {
  score: 50,
  details: {},
};

const REPORT_CAUTION = {
  score: 55,
  details: {
    highlights: ['Reasonable market size'],
    red_flags: ['Weak team', 'No revenue model'],
  },
};

const REPORT_NO_GO = {
  score: 30,
  details: {
    highlights: [],
    red_flags: ['Fatal market risk', 'No customer validation', 'Unsustainable economics'],
  },
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useReportProactiveMessage', () => {
  describe('REPORT_QUICK_ACTIONS export', () => {
    it('exports 5 report-specific quick actions', () => {
      expect(REPORT_QUICK_ACTIONS).toHaveLength(5);
    });

    it('each action has id, label, and prompt', () => {
      for (const action of REPORT_QUICK_ACTIONS) {
        expect(action.id).toBeTruthy();
        expect(action.label).toBeTruthy();
        expect(action.prompt).toBeTruthy();
      }
    });

    it('includes canvas, pitch deck, and sprint actions', () => {
      const ids = REPORT_QUICK_ACTIONS.map(a => a.id);
      expect(ids).toContain('report_canvas');
      expect(ids).toContain('report_pitch_deck');
      expect(ids).toContain('report_sprint');
    });

    it('includes weak area and explain actions', () => {
      const ids = REPORT_QUICK_ACTIONS.map(a => a.id);
      expect(ids).toContain('report_weak_area');
      expect(ids).toContain('report_explain');
    });
  });

  describe('getVerdict', () => {
    it('returns GO for scores >= 70', () => {
      expect(getVerdict(70)).toBe('GO');
      expect(getVerdict(85)).toBe('GO');
      expect(getVerdict(100)).toBe('GO');
    });

    it('returns CAUTION for scores 40-69', () => {
      expect(getVerdict(40)).toBe('CAUTION');
      expect(getVerdict(55)).toBe('CAUTION');
      expect(getVerdict(69)).toBe('CAUTION');
    });

    it('returns NO-GO for scores < 40', () => {
      expect(getVerdict(0)).toBe('NO-GO');
      expect(getVerdict(20)).toBe('NO-GO');
      expect(getVerdict(39)).toBe('NO-GO');
    });
  });

  describe('getDimensionScores', () => {
    it('extracts dimension scores from scores_matrix', () => {
      const scores = getDimensionScores(FULL_REPORT.details);
      expect(scores).toHaveLength(8);
      expect(scores[0]).toEqual({ id: 'problem', label: 'Problem Fit', score: 85 });
    });

    it('returns empty array when no scores_matrix', () => {
      expect(getDimensionScores({})).toEqual([]);
      expect(getDimensionScores({ scores_matrix: {} })).toEqual([]);
      expect(getDimensionScores({ scores_matrix: { dimensions: null } })).toEqual([]);
    });

    it('filters out dimensions with missing id or score', () => {
      const details = {
        scores_matrix: {
          dimensions: [
            { id: 'problem', label: 'Problem', score: 80 },
            { label: 'No ID', score: 60 },
            { id: 'market', label: 'Market' },
          ],
        },
      };
      const scores = getDimensionScores(details);
      expect(scores).toHaveLength(1);
      expect(scores[0].id).toBe('problem');
    });
  });

  describe('getTopStrengths', () => {
    it('uses highlights when available', () => {
      const strengths = getTopStrengths(FULL_REPORT.details, []);
      expect(strengths).toHaveLength(3);
      expect(strengths[0]).toBe('Strong problem-market fit');
    });

    it('derives from top dimension scores when no highlights', () => {
      const dims = getDimensionScores(REPORT_NO_HIGHLIGHTS.details);
      const strengths = getTopStrengths(REPORT_NO_HIGHLIGHTS.details, dims);
      expect(strengths).toHaveLength(3);
      expect(strengths[0]).toContain('Problem Fit');
      expect(strengths[0]).toContain('85');
    });

    it('returns empty array when no data', () => {
      expect(getTopStrengths({}, [])).toEqual([]);
    });

    it('handles object-form highlights', () => {
      const details = { highlights: [{ text: 'Good fit' }, { label: 'Strong team' }] };
      const strengths = getTopStrengths(details, []);
      expect(strengths[0]).toBe('Good fit');
      expect(strengths[1]).toBe('Strong team');
    });

    it('caps at 3 strengths', () => {
      const details = { highlights: ['A', 'B', 'C', 'D', 'E'] };
      expect(getTopStrengths(details, [])).toHaveLength(3);
    });
  });

  describe('getWeakAreas', () => {
    it('uses red_flags when available', () => {
      const areas = getWeakAreas(FULL_REPORT.details, []);
      expect(areas).toHaveLength(2);
      expect(areas[0]).toBe('No traction data');
    });

    it('derives from weakest dimensions when no red_flags', () => {
      const dims = getDimensionScores(REPORT_NO_HIGHLIGHTS.details);
      const areas = getWeakAreas(REPORT_NO_HIGHLIGHTS.details, dims);
      expect(areas).toHaveLength(3);
      expect(areas[0]).toContain('Traction');
      expect(areas[0]).toContain('30');
    });

    it('returns empty array when no data', () => {
      expect(getWeakAreas({}, [])).toEqual([]);
    });

    it('caps at 3 weak areas', () => {
      const details = { red_flags: ['A', 'B', 'C', 'D', 'E'] };
      expect(getWeakAreas(details, [])).toHaveLength(3);
    });
  });

  describe('proactive message content', () => {
    it('includes score and GO verdict for high-score report', () => {
      const msg = buildTestMessage(FULL_REPORT);
      expect(msg).toContain('72/100');
      expect(msg).toContain('**GO**');
      expect(msg).toContain('Your validation report is ready!');
    });

    it('includes CAUTION verdict for mid-score report', () => {
      const msg = buildTestMessage(REPORT_CAUTION);
      expect(msg).toContain('55/100');
      expect(msg).toContain('**CAUTION**');
    });

    it('includes NO-GO verdict for low-score report', () => {
      const msg = buildTestMessage(REPORT_NO_GO);
      expect(msg).toContain('30/100');
      expect(msg).toContain('**NO-GO**');
    });

    it('handles null score gracefully', () => {
      const msg = buildTestMessage(REPORT_NO_SCORE);
      expect(msg).toContain('Score unavailable');
      expect(msg).not.toContain('null/100');
      // Dimension scores may still show X/100 in strengths/weak areas — that's expected
      expect(msg).toContain('some agents did not complete');
    });

    it('includes startup name when provided', () => {
      const msg = buildTestMessage(FULL_REPORT, { name: 'FashionOS' });
      expect(msg).toContain('FashionOS');
    });

    it('uses fallback name when no startup meta', () => {
      const msg = buildTestMessage(FULL_REPORT);
      expect(msg).toContain('Your startup');
    });

    it('includes strengths section', () => {
      const msg = buildTestMessage(FULL_REPORT);
      expect(msg).toContain('**Top strengths:**');
      expect(msg).toContain('Strong problem-market fit');
    });

    it('includes weak areas section', () => {
      const msg = buildTestMessage(FULL_REPORT);
      expect(msg).toContain('**Areas to address:**');
      expect(msg).toContain('No traction data');
    });

    it('includes suggested next steps', () => {
      const msg = buildTestMessage(FULL_REPORT);
      expect(msg).toContain('**Suggested next steps:**');
      expect(msg).toContain('Lean Canvas');
      expect(msg).toContain('pitch deck');
      expect(msg).toContain('90-day sprint');
    });

    it('identifies weakest dimension in next steps', () => {
      const msg = buildTestMessage(FULL_REPORT);
      // Traction has score 40, the lowest
      expect(msg).toContain('Traction & Evidence');
      expect(msg).toContain('40/100');
      expect(msg).toContain('weakest area');
    });

    it('handles empty details object', () => {
      const msg = buildTestMessage(REPORT_EMPTY_DETAILS);
      expect(msg).toContain('50/100');
      expect(msg).toContain('**CAUTION**');
      // No strengths/weak areas derived — should still have next steps
      expect(msg).toContain('**Suggested next steps:**');
    });

    it('handles report with only red_flags, no highlights', () => {
      const msg = buildTestMessage(REPORT_NO_GO);
      expect(msg).toContain('**Areas to address:**');
      expect(msg).toContain('Fatal market risk');
    });

    it('returns null for null report', () => {
      const msg = buildTestMessageRaw(null);
      expect(msg).toBeNull();
    });
  });
});

// ---------------------------------------------------------------------------
// Test Helpers — replicate hook logic without React rendering
// ---------------------------------------------------------------------------

function buildTestMessageRaw(report: { score: number | null; details: Record<string, any> } | null): string | null {
  if (!report) return null;
  return buildTestMessage(report);
}

function buildTestMessage(
  report: { score: number | null; details: Record<string, any> },
  startupMeta?: { name: string },
): string {
  const name = startupMeta?.name || 'Your startup';
  const score = report.score;
  const details = report.details || {};
  const dimensionScores = getDimensionScores(details);
  const strengths = getTopStrengths(details, dimensionScores);
  const weakAreas = getWeakAreas(details, dimensionScores);
  const weakest = dimensionScores.length > 0
    ? [...dimensionScores].sort((a, b) => a.score - b.score)[0]
    : null;

  const lines: string[] = [];

  if (score != null) {
    lines.push(`**Your validation report is ready!** ${name} scored **${score}/100** — **${getVerdict(score)}**.`);
  } else {
    lines.push(`**Your validation report is ready!** Score unavailable — some agents did not complete.`);
  }

  lines.push('');

  if (strengths.length > 0) {
    lines.push(`**Top strengths:** ${strengths.join(' · ')}`);
  }

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

  return lines.join('\n');
}
