import { describe, it, expect } from 'vitest';
import { computeScore, type DimensionScoresInput, type FactorInput } from '@/lib/scoring-math';

describe('computeScore', () => {
  const defaultDimensions: DimensionScoresInput = {
    problemClarity: 80,
    solutionStrength: 70,
    marketSize: 75,
    competition: 60,
    businessModel: 65,
    teamFit: 85,
    timing: 70,
  };

  const defaultMarketFactors: FactorInput[] = [
    { name: 'Market Size', score: 8, description: 'Large market' },
    { name: 'Growth Rate', score: 7, description: 'Growing fast' },
    { name: 'Competition', score: 5, description: 'Moderate competition' },
    { name: 'Timing', score: 9, description: 'Perfect timing' },
  ];

  const defaultExecutionFactors: FactorInput[] = [
    { name: 'Team', score: 8, description: 'Strong team' },
    { name: 'Product', score: 6, description: 'Good product' },
    { name: 'Go-to-Market', score: 5, description: 'Clear GTM' },
    { name: 'Unit Economics', score: 3, description: 'Weak economics' },
  ];

  it('should compute correct weighted average', () => {
    const result = computeScore(defaultDimensions, defaultMarketFactors, defaultExecutionFactors);
    // Manual: 80*0.15 + 70*0.15 + 75*0.15 + 60*0.10 + 65*0.15 + 85*0.15 + 70*0.15
    //       = 12 + 10.5 + 11.25 + 6 + 9.75 + 12.75 + 10.5 = 72.75 -> 73
    expect(result.overall_score).toBe(73);
  });

  it('should derive GO verdict for score >= 75', () => {
    const dims: DimensionScoresInput = {
      problemClarity: 90,
      solutionStrength: 80,
      marketSize: 85,
      competition: 70,
      businessModel: 80,
      teamFit: 90,
      timing: 80,
    };
    const result = computeScore(dims, defaultMarketFactors, defaultExecutionFactors);
    expect(result.verdict).toBe('go');
    expect(result.overall_score).toBeGreaterThanOrEqual(75);
  });

  it('should derive CAUTION verdict for score 50-74', () => {
    const result = computeScore(defaultDimensions, defaultMarketFactors, defaultExecutionFactors);
    expect(result.verdict).toBe('caution');
    expect(result.overall_score).toBeGreaterThanOrEqual(50);
    expect(result.overall_score).toBeLessThan(75);
  });

  it('should derive NO_GO verdict for score < 50', () => {
    const dims: DimensionScoresInput = {
      problemClarity: 30,
      solutionStrength: 20,
      marketSize: 40,
      competition: 35,
      businessModel: 25,
      teamFit: 30,
      timing: 20,
    };
    const result = computeScore(dims, defaultMarketFactors, defaultExecutionFactors);
    expect(result.verdict).toBe('no_go');
    expect(result.overall_score).toBeLessThan(50);
  });

  it('should clamp dimension scores to [0, 100]', () => {
    const dims: DimensionScoresInput = {
      problemClarity: 150,
      solutionStrength: -10,
      marketSize: 75,
      competition: 60,
      businessModel: 65,
      teamFit: 85,
      timing: 70,
    };
    const result = computeScore(dims, defaultMarketFactors, defaultExecutionFactors);
    expect(result.metadata.clamped_dimensions['problemClarity']).toBe(100);
    expect(result.metadata.clamped_dimensions['solutionStrength']).toBe(0);
  });

  it('should handle NaN dimension scores by clamping to 0', () => {
    const dims = {
      problemClarity: NaN,
      solutionStrength: 70,
      marketSize: 75,
      competition: 60,
      businessModel: 65,
      teamFit: 85,
      timing: 70,
    } as DimensionScoresInput;
    const result = computeScore(dims, defaultMarketFactors, defaultExecutionFactors);
    expect(result.metadata.clamped_dimensions['problemClarity']).toBe(0);
    expect(typeof result.overall_score).toBe('number');
    expect(isNaN(result.overall_score)).toBe(false);
  });

  it('should derive factor status: strong for score >= 7', () => {
    const result = computeScore(defaultDimensions, defaultMarketFactors, defaultExecutionFactors);
    const marketSize = result.market_factors.find(f => f.name === 'Market Size');
    expect(marketSize?.status).toBe('strong');
  });

  it('should derive factor status: moderate for score 4-6', () => {
    const result = computeScore(defaultDimensions, defaultMarketFactors, defaultExecutionFactors);
    const competition = result.market_factors.find(f => f.name === 'Competition');
    expect(competition?.status).toBe('moderate');
  });

  it('should derive factor status: weak for score < 4', () => {
    const result = computeScore(defaultDimensions, defaultMarketFactors, defaultExecutionFactors);
    const unitEcon = result.execution_factors.find(f => f.name === 'Unit Economics');
    expect(unitEcon?.status).toBe('weak');
  });

  it('should clamp factor scores to [1, 10]', () => {
    const factors: FactorInput[] = [
      { name: 'Over', score: 15, description: 'Over max' },
      { name: 'Under', score: -2, description: 'Under min' },
    ];
    const result = computeScore(defaultDimensions, factors, []);
    expect(result.market_factors[0].score).toBe(10);
    expect(result.market_factors[1].score).toBe(1);
  });

  it('should build correct scores_matrix', () => {
    const result = computeScore(defaultDimensions, defaultMarketFactors, defaultExecutionFactors);
    expect(result.scores_matrix.dimensions).toHaveLength(7);
    expect(result.scores_matrix.overall_weighted).toBe(result.overall_score);

    const problemClarity = result.scores_matrix.dimensions.find(d => d.name === 'Problem Clarity');
    expect(problemClarity?.score).toBe(80);
    expect(problemClarity?.weight).toBe(15);
  });

  it('should apply bias correction', () => {
    const result1 = computeScore(defaultDimensions, defaultMarketFactors, defaultExecutionFactors, 0);
    const result2 = computeScore(defaultDimensions, defaultMarketFactors, defaultExecutionFactors, 5);
    expect(result2.overall_score).toBe(result1.overall_score + 5);
  });

  it('should clamp final score after bias correction', () => {
    const highDims: DimensionScoresInput = {
      problemClarity: 100,
      solutionStrength: 100,
      marketSize: 100,
      competition: 100,
      businessModel: 100,
      teamFit: 100,
      timing: 100,
    };
    const result = computeScore(highDims, defaultMarketFactors, defaultExecutionFactors, 10);
    expect(result.overall_score).toBe(100);
  });

  it('should handle empty factor arrays', () => {
    const result = computeScore(defaultDimensions, [], []);
    expect(result.market_factors).toEqual([]);
    expect(result.execution_factors).toEqual([]);
    expect(typeof result.overall_score).toBe('number');
  });

  it('should produce deterministic results for same input', () => {
    const result1 = computeScore(defaultDimensions, defaultMarketFactors, defaultExecutionFactors);
    const result2 = computeScore(defaultDimensions, defaultMarketFactors, defaultExecutionFactors);
    expect(result1.overall_score).toBe(result2.overall_score);
    expect(result1.verdict).toBe(result2.verdict);
    expect(JSON.stringify(result1.scores_matrix)).toBe(JSON.stringify(result2.scores_matrix));
  });

  it('should include metadata with raw_weighted_average', () => {
    const result = computeScore(defaultDimensions, defaultMarketFactors, defaultExecutionFactors);
    expect(result.metadata.raw_weighted_average).toBeCloseTo(72.75, 1);
    expect(result.metadata.bias_correction).toBe(0);
  });

  it('should handle all zeros', () => {
    const zeros: DimensionScoresInput = {
      problemClarity: 0,
      solutionStrength: 0,
      marketSize: 0,
      competition: 0,
      businessModel: 0,
      teamFit: 0,
      timing: 0,
    };
    const result = computeScore(zeros, [], []);
    expect(result.overall_score).toBe(0);
    expect(result.verdict).toBe('no_go');
  });

  it('should handle all 100s', () => {
    const perfect: DimensionScoresInput = {
      problemClarity: 100,
      solutionStrength: 100,
      marketSize: 100,
      competition: 100,
      businessModel: 100,
      teamFit: 100,
      timing: 100,
    };
    const result = computeScore(perfect, [], []);
    expect(result.overall_score).toBe(100);
    expect(result.verdict).toBe('go');
  });

  it('should handle exact threshold boundaries', () => {
    // All equal at 75 → weighted avg = 75 → GO
    const at75: DimensionScoresInput = {
      problemClarity: 75,
      solutionStrength: 75,
      marketSize: 75,
      competition: 75,
      businessModel: 75,
      teamFit: 75,
      timing: 75,
    };
    const result75 = computeScore(at75, [], []);
    expect(result75.overall_score).toBe(75);
    expect(result75.verdict).toBe('go');

    // All equal at 50 → weighted avg = 50 → CAUTION
    const at50: DimensionScoresInput = {
      problemClarity: 50,
      solutionStrength: 50,
      marketSize: 50,
      competition: 50,
      businessModel: 50,
      teamFit: 50,
      timing: 50,
    };
    const result50 = computeScore(at50, [], []);
    expect(result50.overall_score).toBe(50);
    expect(result50.verdict).toBe('caution');

    // All equal at 49 → NO-GO
    const at49: DimensionScoresInput = {
      problemClarity: 49,
      solutionStrength: 49,
      marketSize: 49,
      competition: 49,
      businessModel: 49,
      teamFit: 49,
      timing: 49,
    };
    const result49 = computeScore(at49, [], []);
    expect(result49.overall_score).toBe(49);
    expect(result49.verdict).toBe('no_go');
  });

  it('should handle negative bias correction', () => {
    const result = computeScore(defaultDimensions, defaultMarketFactors, defaultExecutionFactors, -10);
    // 72.75 - 10 = 62.75 → 63
    expect(result.overall_score).toBe(63);
    expect(result.verdict).toBe('caution');
  });
});
