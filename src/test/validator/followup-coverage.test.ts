import { describe, it, expect } from 'vitest';
import {
  isCovered,
  checkReadiness,
  hasMinimumData,
  type FollowupCoverage,
  type CoverageDepth,
} from '@/hooks/useValidatorFollowup';

// Helper to create coverage with all fields set to a single depth
function makeCoverage(depth: CoverageDepth): FollowupCoverage {
  return {
    company_name: depth,
    customer: depth,
    problem: depth,
    solution: depth,
    competitors: depth,
    innovation: depth,
    demand: depth,
    research: depth,
    uniqueness: depth,
    websites: depth,
    industry: depth,
    business_model: depth,
    stage: depth,
    ai_strategy: depth,
    risk_awareness: depth,
    execution_plan: depth,
    investor_readiness: depth,
  };
}

describe('isCovered', () => {
  it('returns false for "none"', () => {
    expect(isCovered('none')).toBe(false);
  });

  it('returns true for "shallow"', () => {
    expect(isCovered('shallow')).toBe(true);
  });

  it('returns true for "deep"', () => {
    expect(isCovered('deep')).toBe(true);
  });

  it('handles boolean true (backwards compat)', () => {
    expect(isCovered(true)).toBe(true);
  });

  it('handles boolean false (backwards compat)', () => {
    expect(isCovered(false)).toBe(false);
  });
});

describe('ExtractionPanel chip visibility logic', () => {
  it('shows chips when coverage is null (no data yet)', () => {
    const coverage: FollowupCoverage | null = null;
    // Simulates: (!coverage || !isCovered(coverage.customer))
    const shouldShow = !coverage || !isCovered(coverage.customer);
    expect(shouldShow).toBe(true);
  });

  it('shows chips when field is "none" (not yet covered)', () => {
    const coverage = makeCoverage('none');
    const shouldShow = !coverage || !isCovered(coverage.customer);
    expect(shouldShow).toBe(true);
  });

  it('hides chips when field is "shallow" (covered)', () => {
    const coverage = makeCoverage('shallow');
    const shouldShow = !coverage || !isCovered(coverage.customer);
    expect(shouldShow).toBe(false);
  });

  it('hides chips when field is "deep" (deeply covered)', () => {
    const coverage = makeCoverage('deep');
    const shouldShow = !coverage || !isCovered(coverage.customer);
    expect(shouldShow).toBe(false);
  });

  it('original bug: "none" is truthy, so !coverage?.customer was always false', () => {
    const coverage = makeCoverage('none');
    // This was the old (buggy) check:
    const buggyResult = !coverage?.customer; // "none" is truthy → !truthy = false
    expect(buggyResult).toBe(false); // Bug: chip hidden even though not covered

    // New correct check:
    const fixedResult = !coverage || !isCovered(coverage.customer);
    expect(fixedResult).toBe(true); // Fixed: chip visible
  });
});

describe('checkReadiness', () => {
  it('returns false when all coverage is "none"', () => {
    const coverage = makeCoverage('none');
    expect(checkReadiness(coverage, 3)).toBe(false);
  });

  it('returns false when all shallow but no deep (requires deep counts)', () => {
    const coverage = makeCoverage('shallow');
    expect(checkReadiness(coverage, 5)).toBe(false);
  });

  it('returns true when all core topics deep with enough messages', () => {
    const coverage = makeCoverage('deep');
    expect(checkReadiness(coverage, 5)).toBe(true);
  });

  it('returns true with forced readiness at 10+ messages', () => {
    const coverage = makeCoverage('none');
    expect(checkReadiness(coverage, 10)).toBe(true);
  });
});

describe('hasMinimumData', () => {
  it('returns false when all coverage is "none"', () => {
    const coverage = makeCoverage('none');
    expect(hasMinimumData(coverage)).toBe(false);
  });

  it('returns false with only problem and customer (needs company_name + 4 core)', () => {
    const coverage = makeCoverage('none');
    coverage.problem = 'shallow';
    coverage.customer = 'shallow';
    expect(hasMinimumData(coverage)).toBe(false);
  });

  it('returns true when problem, customer, company_name + 4 core covered', () => {
    const coverage = makeCoverage('none');
    coverage.problem = 'shallow';
    coverage.customer = 'shallow';
    coverage.company_name = 'shallow';
    coverage.competitors = 'shallow';
    expect(hasMinimumData(coverage)).toBe(true);
  });
});
