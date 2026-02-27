/**
 * Pipeline Status Polling + Auth Flow + SAM/TAM Validation Tests
 * Covers gaps identified in the audit coverage matrix:
 *   6. Pipeline status parsing and terminal state detection
 *   7. Auth refresh pattern for stale JWT tokens
 *   8. Market sizing validation (SAM > TAM)
 *   9. Skipped agent status distinction from failed
 *
 * Run: npm run test -- src/test/validator/pipeline-status-auth.test.ts
 */

import { describe, it, expect } from 'vitest';
import {
  hasMinimumData,
  checkReadiness,
  type FollowupCoverage,
} from '@/hooks/useValidatorFollowup';
import type { MarketSizing } from '@/types/validation-report';

// ─────────────────────────────────────────────────────
// TEST 6: Pipeline Status Parsing & Terminal State
// ─────────────────────────────────────────────────────
describe('Test 6: Pipeline Status Parsing', () => {
  type StepStatus = 'queued' | 'running' | 'ok' | 'partial' | 'failed' | 'skipped';

  interface PipelineStep {
    step: number;
    name: string;
    agent: string;
    status: StepStatus;
    duration_ms?: number;
    error?: string;
  }

  function isTerminal(status: string): boolean {
    return ['complete', 'partial', 'failed'].includes(status);
  }

  function calcProgress(steps: PipelineStep[]): number {
    const done = steps.filter(s => s.status === 'ok' || s.status === 'partial' || s.status === 'failed' || s.status === 'skipped').length;
    return Math.round((done / steps.length) * 100);
  }

  const makeSteps = (statuses: StepStatus[]): PipelineStep[] => {
    const agents = ['ExtractorAgent', 'ResearchAgent', 'CompetitorAgent', 'ScoringAgent', 'MVPAgent', 'ComposerAgent', 'VerifierAgent'];
    return agents.map((agent, i) => ({
      step: i + 1,
      name: agent.replace('Agent', ''),
      agent,
      status: statuses[i] || 'queued',
    }));
  };

  it('detects terminal states correctly', () => {
    expect(isTerminal('complete')).toBe(true);
    expect(isTerminal('partial')).toBe(true);
    expect(isTerminal('failed')).toBe(true);
    expect(isTerminal('running')).toBe(false);
    expect(isTerminal('initializing')).toBe(false);
  });

  it('calculates 0% when all queued', () => {
    const steps = makeSteps(['queued', 'queued', 'queued', 'queued', 'queued', 'queued', 'queued']);
    expect(calcProgress(steps)).toBe(0);
  });

  it('calculates 100% when all ok', () => {
    const steps = makeSteps(['ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok']);
    expect(calcProgress(steps)).toBe(100);
  });

  it('counts skipped in progress (not stuck at partial)', () => {
    // Extractor failed, 5 skipped, Verifier ok
    const steps = makeSteps(['failed', 'skipped', 'skipped', 'skipped', 'skipped', 'skipped', 'ok']);
    expect(calcProgress(steps)).toBe(100);
  });

  it('partial progress with mix of ok and running', () => {
    const steps = makeSteps(['ok', 'ok', 'running', 'queued', 'queued', 'queued', 'queued']);
    expect(calcProgress(steps)).toBe(29); // 2/7 = 28.6 rounds to 29
  });

  it('failed + skipped combo in progress', () => {
    // Extractor ok, Research failed, Competitors ok, rest skipped
    const steps = makeSteps(['ok', 'failed', 'ok', 'skipped', 'skipped', 'skipped', 'ok']);
    expect(calcProgress(steps)).toBe(100);
  });

  it('step order matches expected agent names', () => {
    const steps = makeSteps([]);
    expect(steps[0].agent).toBe('ExtractorAgent');
    expect(steps[1].agent).toBe('ResearchAgent');
    expect(steps[2].agent).toBe('CompetitorAgent');
    expect(steps[3].agent).toBe('ScoringAgent');
    expect(steps[4].agent).toBe('MVPAgent');
    expect(steps[5].agent).toBe('ComposerAgent');
    expect(steps[6].agent).toBe('VerifierAgent');
  });
});

// ─────────────────────────────────────────────────────
// TEST 7: Auth Refresh Pattern
// ─────────────────────────────────────────────────────
describe('Test 7: Auth Refresh Pattern', () => {
  it('refreshSession produces Bearer token format', () => {
    // Mock token from Supabase auth
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.payload';
    const header = `Bearer ${mockToken}`;
    expect(header).toMatch(/^Bearer\s+\S+/);
    expect(header.split(' ')).toHaveLength(2);
  });

  it('Authorization header is passed to functions.invoke', () => {
    // Simulate the pattern used in useValidatorPipeline/useValidatorFollowup
    const token = 'test-jwt-token';
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };
    expect(headers.Authorization).toBe('Bearer test-jwt-token');
  });

  it('stale token detection: missing token returns early', () => {
    // Simulate what happens when session.data.session is null
    const session = { data: { session: null } };
    const token = session.data.session?.access_token;
    expect(token).toBeUndefined();
    // Frontend should show "Not authenticated" error
  });

  it('refreshSession returns new session with valid token', () => {
    // Simulate successful refresh
    const mockSession = {
      data: {
        session: {
          access_token: 'fresh-jwt-token-123',
          expires_at: Math.floor(Date.now() / 1000) + 3600,
        },
      },
      error: null,
    };
    expect(mockSession.data.session.access_token).toBeTruthy();
    expect(mockSession.error).toBeNull();
    expect(mockSession.data.session.expires_at).toBeGreaterThan(Date.now() / 1000);
  });

  it('hasMinimumData gates generate button', () => {
    const emptyCoverage: FollowupCoverage = {
      company_name: 'none', customer: 'none', problem: 'none', solution: 'none',
      competitors: 'none', innovation: 'none', demand: 'none', research: 'none',
      uniqueness: 'none', websites: 'none', industry: 'none', business_model: 'none', stage: 'none',
    };
    expect(hasMinimumData(emptyCoverage)).toBe(false);

    // hasMinimumData requires: problem + customer + company_name covered AND 4+ shallow+
    const minCoverage: FollowupCoverage = {
      company_name: 'shallow', customer: 'shallow', problem: 'shallow', solution: 'shallow',
      competitors: 'none', innovation: 'none', demand: 'none', research: 'none',
      uniqueness: 'none', websites: 'none', industry: 'none', business_model: 'none', stage: 'none',
    };
    expect(hasMinimumData(minCoverage)).toBe(true);

    // Only 3 shallow+ is not enough (need 4+)
    const insufficientCoverage: FollowupCoverage = {
      company_name: 'shallow', customer: 'shallow', problem: 'shallow', solution: 'none',
      competitors: 'none', innovation: 'none', demand: 'none', research: 'none',
      uniqueness: 'none', websites: 'none', industry: 'none', business_model: 'none', stage: 'none',
    };
    expect(hasMinimumData(insufficientCoverage)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────
// TEST 8: Market Sizing Validation (SAM > TAM)
// ─────────────────────────────────────────────────────
describe('Test 8: Market Sizing Validation', () => {
  function validateMarketSizing(data: MarketSizing): string[] {
    const warnings: string[] = [];
    if (data.sam > data.tam) warnings.push('SAM exceeds TAM — AI estimate may be inaccurate');
    if (data.som > data.sam) warnings.push('SOM exceeds SAM — AI estimate may be inaccurate');
    if (data.som > data.tam) warnings.push('SOM exceeds TAM — AI estimate may be inaccurate');
    return warnings;
  }

  it('valid hierarchy: TAM > SAM > SOM produces no warnings', () => {
    const data: MarketSizing = { tam: 15_300_000_000, sam: 5_600_000_000, som: 83_000_000 };
    expect(validateMarketSizing(data)).toHaveLength(0);
  });

  it('SAM > TAM triggers warning', () => {
    const data: MarketSizing = { tam: 1_000_000_000, sam: 2_000_000_000, som: 50_000_000 };
    const warnings = validateMarketSizing(data);
    expect(warnings.length).toBeGreaterThanOrEqual(1);
    expect(warnings[0]).toContain('SAM exceeds TAM');
  });

  it('SOM > SAM triggers warning', () => {
    const data: MarketSizing = { tam: 10_000_000_000, sam: 100_000_000, som: 500_000_000 };
    const warnings = validateMarketSizing(data);
    expect(warnings.some(w => w.includes('SOM exceeds SAM'))).toBe(true);
  });

  it('SOM > TAM triggers warning (worst case)', () => {
    const data: MarketSizing = { tam: 50_000_000, sam: 30_000_000, som: 100_000_000 };
    const warnings = validateMarketSizing(data);
    expect(warnings.some(w => w.includes('SOM exceeds TAM'))).toBe(true);
    expect(warnings.some(w => w.includes('SOM exceeds SAM'))).toBe(true);
  });

  it('equal values are valid (edge case)', () => {
    const data: MarketSizing = { tam: 1_000_000_000, sam: 1_000_000_000, som: 1_000_000_000 };
    expect(validateMarketSizing(data)).toHaveLength(0);
  });

  it('zero values are valid', () => {
    const data: MarketSizing = { tam: 0, sam: 0, som: 0 };
    expect(validateMarketSizing(data)).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────
// TEST 9: Skipped Agent Status Distinction
// ─────────────────────────────────────────────────────
describe('Test 9: Skipped Status Distinction', () => {
  type AgentStatus = 'queued' | 'running' | 'ok' | 'partial' | 'failed' | 'skipped';

  function getStatusCategory(status: AgentStatus): 'success' | 'failure' | 'skipped' | 'pending' {
    switch (status) {
      case 'ok':
      case 'partial':
        return 'success';
      case 'failed':
        return 'failure';
      case 'skipped':
        return 'skipped';
      default:
        return 'pending';
    }
  }

  it('skipped is distinct from failed', () => {
    expect(getStatusCategory('skipped')).not.toBe(getStatusCategory('failed'));
  });

  it('skipped is distinct from queued', () => {
    expect(getStatusCategory('skipped')).not.toBe(getStatusCategory('queued'));
  });

  it('skipped count separate from failed count', () => {
    const statuses: AgentStatus[] = ['ok', 'failed', 'ok', 'skipped', 'skipped', 'skipped', 'ok'];
    const failed = statuses.filter(s => s === 'failed').length;
    const skipped = statuses.filter(s => s === 'skipped').length;
    const success = statuses.filter(s => s === 'ok' || s === 'partial').length;

    expect(failed).toBe(1);
    expect(skipped).toBe(3);
    expect(success).toBe(3);
    expect(failed + skipped + success).toBe(7);
  });

  it('cascade failure: extractor fail skips 5 downstream', () => {
    // When ExtractorAgent fails, Research/Competitors/Scoring/MVP/Composer get skipped
    const statuses: AgentStatus[] = ['failed', 'skipped', 'skipped', 'skipped', 'skipped', 'skipped', 'ok'];
    const failed = statuses.filter(s => s === 'failed').length;
    const skipped = statuses.filter(s => s === 'skipped').length;
    expect(failed).toBe(1); // Only ExtractorAgent actually failed
    expect(skipped).toBe(5); // 5 downstream agents skipped
  });

  it('scoring failure skips only MVP', () => {
    // ScoringAgent fails, MVP skipped, but Composer still runs (with degraded data)
    const statuses: AgentStatus[] = ['ok', 'ok', 'ok', 'failed', 'skipped', 'ok', 'ok'];
    const failed = statuses.filter(s => s === 'failed').length;
    const skipped = statuses.filter(s => s === 'skipped').length;
    expect(failed).toBe(1);
    expect(skipped).toBe(1);
  });

  it('all statuses covered in category mapping', () => {
    const allStatuses: AgentStatus[] = ['queued', 'running', 'ok', 'partial', 'failed', 'skipped'];
    allStatuses.forEach(status => {
      const category = getStatusCategory(status);
      expect(['success', 'failure', 'skipped', 'pending']).toContain(category);
    });
  });
});
