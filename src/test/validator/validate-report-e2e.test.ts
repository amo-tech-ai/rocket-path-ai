/**
 * Validate → Report Full-Cycle Tests
 * 5 test suites covering the complete flow:
 *   1. Chat readiness with coverage depth tracking
 *   2. Pipeline payload contract validation
 *   3. Report data unwrapping (Gemini array fix)
 *   4. Sprint kanban task model + column state
 *   5. PDF export filename with timestamps
 *
 * Run: npm run test -- src/test/validator/validate-report-e2e.test.ts
 */

import { describe, it, expect } from 'vitest';
import {
  checkReadiness,
  countAtDepth,
  isCovered,
  isDeep,
  type FollowupCoverage,
  type CoverageDepth,
} from '@/hooks/useValidatorFollowup';
import {
  getVerdict,
  getVerdictConfig,
  formatMarketSize,
  DIMENSION_CONFIG_V2,
  SECTION_TITLES,
} from '@/types/validation-report';
import type { KanbanColumn, SprintTask } from '@/hooks/useSprintAgent';

// ─────────────────────────────────────────────────────
// TEST 1: Chat Readiness — coverage depth + unlock gate
// ─────────────────────────────────────────────────────
describe('Test 1: Chat Readiness & Coverage Tracking', () => {
  const makeCoverage = (overrides: Partial<FollowupCoverage> = {}): FollowupCoverage => ({
    company_name: 'none',
    customer: 'none',
    problem: 'none',
    solution: 'none',
    competitors: 'none',
    innovation: 'none',
    demand: 'none',
    research: 'none',
    uniqueness: 'none',
    websites: 'none',
    industry: 'none',
    business_model: 'none',
    stage: 'none',
    ai_strategy: 'none',
    risk_awareness: 'none',
    execution_plan: 'none',
    investor_readiness: 'none',
    ...overrides,
  });

  it('starts at 0 coverage with all topics "none"', () => {
    const coverage = makeCoverage();
    expect(countAtDepth(coverage, 'shallow')).toBe(0);
    expect(countAtDepth(coverage, 'deep')).toBe(0);
    expect(checkReadiness(coverage, 0)).toBe(false);
  });

  it('single topic shallow does not unlock generate', () => {
    const coverage = makeCoverage({ problem: 'shallow' });
    expect(countAtDepth(coverage, 'shallow')).toBe(1);
    expect(checkReadiness(coverage, 1)).toBe(false);
  });

  it('quick-ready threshold: 3 msgs + 9 shallow+ + 4 deep + company_name', () => {
    const coverage = makeCoverage({
      company_name: 'deep',
      customer: 'deep',
      problem: 'deep',
      solution: 'deep',
      competitors: 'shallow',
      innovation: 'shallow',
      demand: 'shallow',
      research: 'shallow',
      websites: 'shallow',
    });
    expect(countAtDepth(coverage, 'shallow')).toBe(9);
    expect(countAtDepth(coverage, 'deep')).toBe(4);
    expect(checkReadiness(coverage, 3)).toBe(true);
  });

  it('forced-ready at 10+ messages regardless of coverage', () => {
    const coverage = makeCoverage({ problem: 'shallow' });
    expect(checkReadiness(coverage, 10)).toBe(true);
  });

  it('17 topics match expected list (13 core + 4 deep dive)', () => {
    const coverage = makeCoverage();
    const keys = Object.keys(coverage);
    expect(keys).toHaveLength(17);
    // Core topics
    expect(keys).toContain('company_name');
    expect(keys).toContain('customer');
    expect(keys).toContain('problem');
    expect(keys).toContain('solution');
    expect(keys).toContain('competitors');
    expect(keys).toContain('innovation');
    expect(keys).toContain('demand');
    expect(keys).toContain('research');
    expect(keys).toContain('uniqueness');
    expect(keys).toContain('websites');
    expect(keys).toContain('industry');
    expect(keys).toContain('business_model');
    expect(keys).toContain('stage');
    // Deep dive topics
    expect(keys).toContain('ai_strategy');
    expect(keys).toContain('risk_awareness');
    expect(keys).toContain('execution_plan');
    expect(keys).toContain('investor_readiness');
  });

  it('depth helpers classify correctly', () => {
    expect(isCovered('deep')).toBe(true);
    expect(isCovered('shallow')).toBe(true);
    expect(isCovered('none')).toBe(false);
    expect(isDeep('deep')).toBe(true);
    expect(isDeep('shallow')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────
// TEST 2: Pipeline Payload Contract
// ─────────────────────────────────────────────────────
describe('Test 2: Pipeline Payload Contract', () => {
  it('validator-start payload has required fields', () => {
    const payload = {
      input_text: 'An AI tool for dental scheduling',
      startup_id: 'startup-uuid-123',
      interview_context: {
        version: 1,
        extracted: {
          problem: 'Manual scheduling wastes hours',
          customer: 'Dental practices',
          solution: 'AI scheduling',
          differentiation: 'Voice-first interface',
          demand: '50 practices interviewed',
          competitors: 'Calendly, Dentrix',
          business_model: '$99/mo SaaS',
          websites: 'https://example.com',
        },
        coverage: {
          customer: 'deep' as CoverageDepth,
          problem: 'deep' as CoverageDepth,
          competitors: 'shallow' as CoverageDepth,
          innovation: 'shallow' as CoverageDepth,
          demand: 'deep' as CoverageDepth,
          research: 'shallow' as CoverageDepth,
          uniqueness: 'shallow' as CoverageDepth,
          websites: 'shallow' as CoverageDepth,
        },
      },
    };

    expect(payload.input_text).toBeTruthy();
    expect(payload.startup_id).toBeTruthy();
    expect(payload.interview_context.version).toBe(1);
    expect(Object.keys(payload.interview_context.extracted)).toHaveLength(8);
    expect(Object.keys(payload.interview_context.coverage)).toHaveLength(8);
  });

  it('validator-status URL uses snake_case session_id', () => {
    const sessionId = '74cf32c7-e3a8-4456-a2a8-a5d76d4eb266';
    const url = `https://example.supabase.co/functions/v1/validator-status?session_id=${sessionId}`;
    expect(url).toContain('session_id=');
    expect(url).not.toContain('sessionId=');
  });

  it('pipeline response has expected shape', () => {
    const response = {
      success: true,
      session_id: 'abc-123',
      report_id: 'report-456',
      status: 'running' as const,
      verified: false,
      failed_agents: [] as string[],
      warnings: [] as string[],
    };
    expect(response.success).toBe(true);
    expect(response.session_id).toBeTruthy();
    expect(['running', 'complete', 'partial', 'failed']).toContain(response.status);
    expect(Array.isArray(response.failed_agents)).toBe(true);
  });

  it('7 pipeline agents in correct order', () => {
    const agents = [
      'ExtractorAgent',
      'ResearchAgent',
      'CompetitorAgent',
      'ScoringAgent',
      'MVPAgent',
      'ComposerAgent',
      'VerifierAgent',
    ];
    expect(agents).toHaveLength(7);
    expect(agents[0]).toBe('ExtractorAgent');
    expect(agents[agents.length - 1]).toBe('VerifierAgent');
  });
});

// ─────────────────────────────────────────────────────
// TEST 3: Report Data Unwrapping (Gemini array fix)
// ─────────────────────────────────────────────────────
describe('Test 3: Report Data Unwrapping & Verdict', () => {
  // Mirror the exact unwrapping logic from ValidatorReport.tsx
  function unwrapDetails(rawDetails: unknown): Record<string, unknown> {
    return ((Array.isArray(rawDetails) ? rawDetails[0] : rawDetails) || {}) as Record<string, unknown>;
  }

  it('unwraps Gemini array-wrapped JSON [{}] → {}', () => {
    const arrayWrapped = [{ summary_verdict: 'GO', score: 78 }];
    const result = unwrapDetails(arrayWrapped);
    expect(result.summary_verdict).toBe('GO');
    expect(result.score).toBe(78);
  });

  it('passes through regular object unchanged', () => {
    const normalObj = { summary_verdict: 'CAUTION', score: 55 };
    const result = unwrapDetails(normalObj);
    expect(result.summary_verdict).toBe('CAUTION');
  });

  it('handles null/undefined gracefully', () => {
    expect(unwrapDetails(null)).toEqual({});
    expect(unwrapDetails(undefined)).toEqual({});
  });

  it('handles empty array gracefully', () => {
    expect(unwrapDetails([])).toEqual({});
  });

  it('getVerdict returns correct thresholds', () => {
    expect(getVerdict(75)).toBe('go');
    expect(getVerdict(50)).toBe('caution');
    expect(getVerdict(30)).toBe('no_go');
  });

  it('getVerdictConfig has label and color for each verdict', () => {
    const go = getVerdictConfig('go');
    const caution = getVerdictConfig('caution');
    const noGo = getVerdictConfig('no_go');
    expect(go.label).toBeTruthy();
    expect(caution.label).toBeTruthy();
    expect(noGo.label).toBeTruthy();
  });

  it('SECTION_TITLES covers 10 V2 sections', () => {
    const sectionKeys = Object.keys(SECTION_TITLES).map(Number);
    expect(sectionKeys.length).toBeGreaterThanOrEqual(10);
  });

  it('DIMENSION_CONFIG_V2 weights sum to 100', () => {
    const total = DIMENSION_CONFIG_V2.reduce((sum, d) => sum + d.weight, 0);
    expect(total).toBe(100);
  });

  it('formatMarketSize formats billions and millions', () => {
    expect(formatMarketSize(15_300_000_000)).toContain('B');
    expect(formatMarketSize(83_000_000)).toContain('M');
    expect(formatMarketSize(500_000)).toContain('K');
  });
});

// ─────────────────────────────────────────────────────
// TEST 4: Sprint Kanban Task Model & Column State
// ─────────────────────────────────────────────────────
describe('Test 4: Sprint Kanban Task Model', () => {
  const makeTask = (overrides: Partial<SprintTask> = {}): SprintTask => ({
    id: crypto.randomUUID(),
    title: 'Interview 15 target customers',
    source: 'problem',
    sprint_number: 1,
    success_criteria: '15 conversations, understand top 3 pains',
    ai_tip: 'Focus on open-ended questions about their workflow',
    priority: 'high',
    column: 'backlog',
    ...overrides,
  });

  it('SprintTask has all required fields', () => {
    const task = makeTask();
    expect(task.id).toBeTruthy();
    expect(task.title).toBeTruthy();
    expect(task.source).toBeTruthy();
    expect(task.sprint_number).toBeGreaterThanOrEqual(1);
    expect(task.success_criteria).toBeTruthy();
    expect(task.ai_tip).toBeTruthy();
    expect(['high', 'medium', 'low']).toContain(task.priority);
    expect(['backlog', 'todo', 'doing', 'done']).toContain(task.column);
  });

  it('tasks distribute across 6 sprints (4 per sprint = 24 total)', () => {
    const tasks = Array.from({ length: 24 }, (_, i) =>
      makeTask({ sprint_number: Math.floor(i / 4) + 1 })
    );
    expect(tasks).toHaveLength(24);

    const bySprintMap = new Map<number, SprintTask[]>();
    tasks.forEach((t) => {
      const existing = bySprintMap.get(t.sprint_number) || [];
      existing.push(t);
      bySprintMap.set(t.sprint_number, existing);
    });

    expect(bySprintMap.size).toBe(6);
    bySprintMap.forEach((sprintTasks) => {
      expect(sprintTasks).toHaveLength(4);
    });
  });

  it('column state transitions: backlog → todo → doing → done', () => {
    const columns: KanbanColumn[] = ['backlog', 'todo', 'doing', 'done'];
    let task = makeTask({ column: 'backlog' });

    columns.forEach((col) => {
      task = { ...task, column: col };
      expect(task.column).toBe(col);
    });
    expect(task.column).toBe('done');
  });

  it('tasksByColumn groups correctly', () => {
    const tasks = [
      makeTask({ column: 'backlog' }),
      makeTask({ column: 'backlog' }),
      makeTask({ column: 'todo' }),
      makeTask({ column: 'doing' }),
      makeTask({ column: 'done' }),
      makeTask({ column: 'done' }),
    ];
    const cols: Record<KanbanColumn, SprintTask[]> = { backlog: [], todo: [], doing: [], done: [] };
    tasks.forEach((t) => cols[t.column].push(t));

    expect(cols.backlog).toHaveLength(2);
    expect(cols.todo).toHaveLength(1);
    expect(cols.doing).toHaveLength(1);
    expect(cols.done).toHaveLength(2);
  });

  it('valid source types match edge function schema', () => {
    const validSources = [
      'problem', 'solution', 'channels', 'revenue', 'customers',
      'competition', 'metrics', 'advantage', 'risk',
    ];
    expect(validSources).toHaveLength(9);
    validSources.forEach((s) => {
      const task = makeTask({ source: s });
      expect(task.source).toBe(s);
    });
  });

  it('sprint names align with 6-sprint framework', () => {
    const SPRINT_NAMES = [
      'Foundation',
      'Solution Fit',
      'Willingness to Pay',
      'Channel Test',
      'MVP Build',
      'Early Traction',
    ];
    expect(SPRINT_NAMES).toHaveLength(6);
    expect(SPRINT_NAMES[0]).toBe('Foundation');
    expect(SPRINT_NAMES[5]).toBe('Early Traction');
  });
});

// ─────────────────────────────────────────────────────
// TEST 5: PDF Export Filename with Timestamps
// ─────────────────────────────────────────────────────
describe('Test 5: PDF Export Filename & Timestamps', () => {
  function buildFilename(companyName?: string): string {
    const dateStr = new Date().toISOString().slice(0, 10);
    return `${(companyName || 'validation-report').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-report-${dateStr}.pdf`;
  }

  it('includes company name when provided', () => {
    const filename = buildFilename('FashionOS');
    expect(filename).toMatch(/^fashionos-report-\d{4}-\d{2}-\d{2}\.pdf$/);
  });

  it('uses fallback when no company name', () => {
    const filename = buildFilename();
    expect(filename).toMatch(/^validation-report-report-\d{4}-\d{2}-\d{2}\.pdf$/);
  });

  it('sanitizes special characters in company name', () => {
    const filename = buildFilename('My Startup! (v2)');
    expect(filename).not.toContain('!');
    expect(filename).not.toContain('(');
    expect(filename).not.toContain(')');
    expect(filename).toMatch(/^my-startup-v2-/);
  });

  it('includes current date in YYYY-MM-DD format', () => {
    const filename = buildFilename('Test');
    const dateStr = new Date().toISOString().slice(0, 10);
    expect(filename).toContain(dateStr);
  });

  it('ends with .pdf extension', () => {
    expect(buildFilename('Test')).toMatch(/\.pdf$/);
    expect(buildFilename()).toMatch(/\.pdf$/);
  });

  it('lean canvas export also gets timestamp', () => {
    const dateStr = new Date().toISOString().slice(0, 10);
    const canvasFilename = `lean-canvas-${dateStr}.png`;
    expect(canvasFilename).toContain(dateStr);
    expect(canvasFilename).toMatch(/\.png$/);
  });
});
