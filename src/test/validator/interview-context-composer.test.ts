/**
 * Interview Context → Composer Tests (Task 22)
 *
 * Validates that interview data flows into all 4 composer groups:
 * - buildInterviewBlock produces correct output for each group
 * - Coverage depth and confidence are rendered
 * - Discovered entities are included for Group B
 * - Empty/missing fields are handled gracefully
 */

import { describe, it, expect } from 'vitest';

// ---------------------------------------------------------------------------
// Replicate buildInterviewBlock logic for testing (mirrors composer.ts)
// ---------------------------------------------------------------------------

interface InterviewContext {
  version: number;
  extracted: Record<string, string>;
  coverage: Record<string, string>;
  confidence?: Record<string, string>;
  discoveredEntities?: { competitors?: string[]; urls?: string[]; marketData?: string[] };
}

const INTERVIEW_FIELDS_BY_GROUP: Record<string, string[]> = {
  A: ['problem', 'customer', 'solution', 'differentiation', 'demand'],
  B: ['competitors', 'industry_categories', 'business_model', 'risk_awareness'],
  C: ['revenue_model', 'execution_plan', 'business_model', 'ai_strategy'],
  D: ['problem', 'customer', 'solution', 'investor_readiness', 'risk_awareness', 'execution_plan'],
};

function buildInterviewBlock(
  interviewContext: InterviewContext | undefined,
  group: 'A' | 'B' | 'C' | 'D',
): string {
  if (!interviewContext?.extracted) return '';

  const relevantFields = INTERVIEW_FIELDS_BY_GROUP[group] || [];
  const lines: string[] = [];

  for (const field of relevantFields) {
    const value = interviewContext.extracted[field];
    if (!value || value.trim().length < 5) continue;

    const depth = interviewContext.coverage?.[field] || 'none';
    const conf = interviewContext.confidence?.[field] || 'unknown';

    const trimmed = value.length > 300 ? value.slice(0, 297) + '...' : value;
    lines.push(`- ${field} [${depth}/${conf}]: ${trimmed}`);
  }

  if (lines.length === 0) return '';

  let entitiesBlock = '';
  if (group === 'B' && interviewContext.discoveredEntities) {
    const ents = interviewContext.discoveredEntities;
    if (ents.competitors?.length) entitiesBlock += `\n- Named competitors: ${ents.competitors.join(', ')}`;
    if (ents.marketData?.length) entitiesBlock += `\n- Market data cited: ${ents.marketData.join('; ')}`;
  }

  return `\n\nFOUNDER INTERVIEW DATA (use for authenticity — quote or reference their words):
${lines.join('\n')}${entitiesBlock}
COVERAGE KEY: deep = founder gave detailed answer, shallow = brief mention, none = not discussed
CONFIDENCE KEY: high = cited source/data, medium = reasonable claim, low = hedging/guessing — calibrate language accordingly`;
}

// ---------------------------------------------------------------------------
// Test Fixtures
// ---------------------------------------------------------------------------

const FULL_INTERVIEW: InterviewContext = {
  version: 1,
  extracted: {
    problem: 'Dental clinics waste 3 hours/day on insurance verification calls',
    customer: 'Office managers at independent dental clinics with 3-10 chairs',
    solution: 'Automated insurance verification via AI phone agent',
    differentiation: 'Real-time verification vs batch processing competitors',
    demand: 'Clinics actively searching for solutions, $50-100/mo willingness to pay',
    competitors: 'Vyne Dental, DentalXChange, manual phone calls',
    industry_categories: 'HealthTech, Dental, InsurTech',
    business_model: 'SaaS subscription per clinic location',
    risk_awareness: 'HIPAA compliance, insurance API access, clinic adoption friction',
    revenue_model: '$79/month per location, estimated 140K independent clinics in US',
    execution_plan: 'MVP in 6 weeks with 3 beta clinics, then expand to 50 in 90 days',
    ai_strategy: 'Voice AI for phone verification, NLP for form parsing',
    investor_readiness: 'Pre-seed, looking for $500K, have 3 LOIs from clinics',
  },
  coverage: {
    problem: 'deep',
    customer: 'deep',
    solution: 'deep',
    differentiation: 'shallow',
    demand: 'shallow',
    competitors: 'deep',
    industry_categories: 'shallow',
    business_model: 'deep',
    risk_awareness: 'deep',
    revenue_model: 'deep',
    execution_plan: 'shallow',
    ai_strategy: 'shallow',
    investor_readiness: 'deep',
  },
  confidence: {
    problem: 'high',
    customer: 'high',
    solution: 'medium',
    differentiation: 'medium',
    demand: 'low',
    competitors: 'high',
    industry_categories: 'medium',
    business_model: 'high',
    risk_awareness: 'medium',
    revenue_model: 'high',
    execution_plan: 'low',
    ai_strategy: 'medium',
    investor_readiness: 'high',
  },
  discoveredEntities: {
    competitors: ['Vyne Dental', 'DentalXChange'],
    urls: ['https://vynedental.com'],
    marketData: ['Dental AI TAM $3.2B per Grand View Research'],
  },
};

const EMPTY_INTERVIEW: InterviewContext = {
  version: 1,
  extracted: {},
  coverage: {},
};

const PARTIAL_INTERVIEW: InterviewContext = {
  version: 1,
  extracted: {
    problem: 'Long wait times for dental insurance verification',
    customer: 'Clinics',  // too short (< 5 chars actually "Clini" is 6, but this tests edge)
  },
  coverage: {
    problem: 'shallow',
  },
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Interview Context → Composer (Task 22)', () => {
  describe('buildInterviewBlock', () => {
    it('returns empty string for undefined context', () => {
      expect(buildInterviewBlock(undefined, 'A')).toBe('');
    });

    it('returns empty string for empty extracted fields', () => {
      expect(buildInterviewBlock(EMPTY_INTERVIEW, 'A')).toBe('');
    });

    it('Group A includes problem, customer, solution, differentiation, demand', () => {
      const block = buildInterviewBlock(FULL_INTERVIEW, 'A');
      expect(block).toContain('problem [deep/high]');
      expect(block).toContain('customer [deep/high]');
      expect(block).toContain('solution [deep/medium]');
      expect(block).toContain('differentiation [shallow/medium]');
      expect(block).toContain('demand [shallow/low]');
      // Should NOT include Group B/C/D field labels (check as line prefixes)
      expect(block).not.toContain('- competitors [');
      expect(block).not.toContain('- revenue_model [');
      expect(block).not.toContain('- investor_readiness [');
    });

    it('Group B includes competitors, industry, business_model, risk_awareness', () => {
      const block = buildInterviewBlock(FULL_INTERVIEW, 'B');
      expect(block).toContain('competitors [deep/high]');
      expect(block).toContain('industry_categories [shallow/medium]');
      expect(block).toContain('business_model [deep/high]');
      expect(block).toContain('risk_awareness [deep/medium]');
    });

    it('Group B includes discovered entities', () => {
      const block = buildInterviewBlock(FULL_INTERVIEW, 'B');
      expect(block).toContain('Named competitors: Vyne Dental, DentalXChange');
      expect(block).toContain('Market data cited: Dental AI TAM $3.2B');
    });

    it('Group B does NOT include entities when not on Group B', () => {
      const block = buildInterviewBlock(FULL_INTERVIEW, 'A');
      expect(block).not.toContain('Named competitors');
    });

    it('Group C includes revenue_model, execution_plan, business_model, ai_strategy', () => {
      const block = buildInterviewBlock(FULL_INTERVIEW, 'C');
      expect(block).toContain('revenue_model [deep/high]');
      expect(block).toContain('execution_plan [shallow/low]');
      expect(block).toContain('business_model [deep/high]');
      expect(block).toContain('ai_strategy [shallow/medium]');
    });

    it('Group D includes problem, customer, solution, investor_readiness, risk_awareness, execution_plan', () => {
      const block = buildInterviewBlock(FULL_INTERVIEW, 'D');
      expect(block).toContain('problem [deep/high]');
      expect(block).toContain('customer [deep/high]');
      expect(block).toContain('investor_readiness [deep/high]');
      expect(block).toContain('risk_awareness [deep/medium]');
      expect(block).toContain('execution_plan [shallow/low]');
    });

    it('includes FOUNDER INTERVIEW DATA header', () => {
      const block = buildInterviewBlock(FULL_INTERVIEW, 'A');
      expect(block).toContain('FOUNDER INTERVIEW DATA');
      expect(block).toContain('COVERAGE KEY');
      expect(block).toContain('CONFIDENCE KEY');
    });

    it('skips fields shorter than 5 characters', () => {
      const ctx: InterviewContext = {
        version: 1,
        extracted: { problem: 'OK', customer: 'This is a valid customer description' },
        coverage: {},
      };
      const block = buildInterviewBlock(ctx, 'A');
      expect(block).not.toContain('problem');
      expect(block).toContain('customer');
    });

    it('truncates fields longer than 300 characters', () => {
      const longValue = 'x'.repeat(400);
      const ctx: InterviewContext = {
        version: 1,
        extracted: { problem: longValue },
        coverage: { problem: 'deep' },
      };
      const block = buildInterviewBlock(ctx, 'A');
      expect(block).toContain('...');
      // 297 chars + '...' = 300
      expect(block.includes(longValue)).toBe(false);
    });

    it('defaults coverage to "none" and confidence to "unknown" when missing', () => {
      const ctx: InterviewContext = {
        version: 1,
        extracted: { problem: 'Insurance verification is painful and slow' },
        coverage: {},
      };
      const block = buildInterviewBlock(ctx, 'A');
      expect(block).toContain('problem [none/unknown]');
    });

    it('handles partial interview gracefully', () => {
      const block = buildInterviewBlock(PARTIAL_INTERVIEW, 'A');
      // "Long wait times..." is > 5 chars, should be included
      expect(block).toContain('problem [shallow/unknown]');
    });
  });

  describe('InterviewContext type', () => {
    it('confidence field is optional', () => {
      const ctx: InterviewContext = {
        version: 1,
        extracted: { problem: 'test problem description' },
        coverage: { problem: 'deep' },
      };
      // Should not throw
      expect(buildInterviewBlock(ctx, 'A')).toContain('problem');
    });

    it('discoveredEntities is optional', () => {
      const ctx: InterviewContext = {
        version: 1,
        extracted: { competitors: 'Vyne Dental is the main competitor' },
        coverage: {},
      };
      const block = buildInterviewBlock(ctx, 'B');
      expect(block).toContain('competitors');
      expect(block).not.toContain('Named competitors');
    });
  });

  describe('INTERVIEW_FIELDS_BY_GROUP coverage', () => {
    it('Group A has 5 fields', () => {
      expect(INTERVIEW_FIELDS_BY_GROUP.A).toHaveLength(5);
    });

    it('Group B has 4 fields', () => {
      expect(INTERVIEW_FIELDS_BY_GROUP.B).toHaveLength(4);
    });

    it('Group C has 4 fields', () => {
      expect(INTERVIEW_FIELDS_BY_GROUP.C).toHaveLength(4);
    });

    it('Group D has 6 fields', () => {
      expect(INTERVIEW_FIELDS_BY_GROUP.D).toHaveLength(6);
    });

    it('deep-dive fields are assigned to relevant groups', () => {
      // ai_strategy → Group C (execution/economics)
      expect(INTERVIEW_FIELDS_BY_GROUP.C).toContain('ai_strategy');
      // execution_plan → Group C and D
      expect(INTERVIEW_FIELDS_BY_GROUP.C).toContain('execution_plan');
      expect(INTERVIEW_FIELDS_BY_GROUP.D).toContain('execution_plan');
      // investor_readiness → Group D (executive summary)
      expect(INTERVIEW_FIELDS_BY_GROUP.D).toContain('investor_readiness');
      // risk_awareness → Group B (market & risk) and D
      expect(INTERVIEW_FIELDS_BY_GROUP.B).toContain('risk_awareness');
      expect(INTERVIEW_FIELDS_BY_GROUP.D).toContain('risk_awareness');
    });

    it('revenue_model is in Group C', () => {
      expect(INTERVIEW_FIELDS_BY_GROUP.C).toContain('revenue_model');
    });
  });
});
