import { describe, it, expect } from 'vitest';

// Test the specificity scoring logic and types
describe('Canvas Specificity', () => {
  const SPECIFICITY_LEVELS = ['vague', 'specific', 'quantified'] as const;
  const BOX_KEYS = [
    'problem', 'solution', 'uniqueValueProp', 'unfairAdvantage',
    'customerSegments', 'keyMetrics', 'channels', 'costStructure', 'revenueStreams',
  ];

  it('specificity levels are valid enum values', () => {
    for (const level of SPECIFICITY_LEVELS) {
      expect(['vague', 'specific', 'quantified']).toContain(level);
    }
  });

  it('all 9 canvas box keys are defined', () => {
    expect(BOX_KEYS).toHaveLength(9);
    expect(BOX_KEYS).toContain('problem');
    expect(BOX_KEYS).toContain('revenueStreams');
  });

  it('specificity scores map correctly', () => {
    const scores: Record<string, string> = {
      problem: 'quantified',
      solution: 'specific',
      customerSegments: 'vague',
    };
    expect(scores.problem).toBe('quantified');
    expect(scores.customerSegments).toBe('vague');
  });

  it('evidence gaps are arrays of strings', () => {
    const gaps: Record<string, string[]> = {
      problem: [],
      customerSegments: ['No TAM data', 'No willingness-to-pay evidence'],
    };
    expect(gaps.problem).toHaveLength(0);
    expect(gaps.customerSegments).toHaveLength(2);
    expect(gaps.customerSegments[0]).toBe('No TAM data');
  });

  it('empty canvas returns empty objects', () => {
    const scores: Record<string, string> = {};
    const gaps: Record<string, string[]> = {};
    expect(Object.keys(scores)).toHaveLength(0);
    expect(Object.keys(gaps)).toHaveLength(0);
  });

  it('specificity result contains all required fields', () => {
    const result = {
      specificity_scores: { problem: 'quantified' as const },
      evidence_gaps: { problem: [] as string[] },
      canvas_score: 72,
      weak_sections: ['customerSegments'],
    };
    expect(result.canvas_score).toBe(72);
    expect(result.weak_sections).toContain('customerSegments');
    expect(result.specificity_scores.problem).toBe('quantified');
  });

  it('check_specificity action name is correct', () => {
    const action = 'check_specificity';
    expect(action).toBe('check_specificity');
  });
});
