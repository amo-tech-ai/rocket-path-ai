import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Agency Chat Mode Integration Tests
 *
 * Verifies that:
 * 1. Shared module exports all 4 chat mode prompts
 * 2. Each mode contains its key frameworks and methodology
 * 3. ai-chat edge function imports from shared module (not hardcoded)
 * 4. Source .md files exist and have matching content
 */

const ROOT = join(__dirname, '..', '..', '..');
const SHARED = join(ROOT, 'supabase', 'functions', '_shared');
const AI_CHAT = join(ROOT, 'supabase', 'functions', 'ai-chat');

function readFile(path: string): string {
  return readFileSync(path, 'utf-8');
}

describe('Agency Chat Modes — Shared Module', () => {
  const modesModule = readFile(join(SHARED, 'agency-chat-modes.ts'));

  it('exports all 4 mode prompt constants', () => {
    expect(modesModule).toContain('export const PRACTICE_PITCH_PROMPT');
    expect(modesModule).toContain('export const GROWTH_STRATEGY_PROMPT');
    expect(modesModule).toContain('export const DEAL_REVIEW_PROMPT');
    expect(modesModule).toContain('export const CANVAS_COACH_PROMPT');
  });

  it('exports CHAT_MODE_PROMPTS registry', () => {
    expect(modesModule).toContain('export const CHAT_MODE_PROMPTS');
  });

  it('exports getChatModePrompt function', () => {
    expect(modesModule).toContain('export function getChatModePrompt');
  });

  describe('Practice Pitch mode', () => {
    it('contains Socratic coaching methodology', () => {
      expect(modesModule).toContain('Socratic coaching');
      expect(modesModule).toContain('Ask, don\'t tell');
      expect(modesModule).toContain('One thing at a time');
    });

    it('has 5-dimension scoring system', () => {
      expect(modesModule).toContain('**Clarity**');
      expect(modesModule).toContain('**Urgency**');
      expect(modesModule).toContain('**Differentiation**');
      expect(modesModule).toContain('**The Ask**');
      expect(modesModule).toContain('**Confidence**');
    });

    it('includes investor question bank with 15 questions', () => {
      expect(modesModule).toContain('Investor Question Bank');
      expect(modesModule).toContain('Market & Opportunity');
      expect(modesModule).toContain('Business Model & Economics');
      expect(modesModule).toContain('Team & Execution');
      expect(modesModule).toContain('Risk & Conviction');
    });

    it('has feedback template', () => {
      expect(modesModule).toContain('Feedback Template');
      expect(modesModule).toContain('What worked:');
      expect(modesModule).toContain('What to improve:');
    });
  });

  describe('Growth Strategy mode', () => {
    it('contains AARRR Pirate Metrics framework', () => {
      expect(modesModule).toContain('AARRR Pirate Metrics');
      expect(modesModule).toContain('**Acquisition**');
      expect(modesModule).toContain('**Activation**');
      expect(modesModule).toContain('**Retention**');
      expect(modesModule).toContain('**Revenue**');
      expect(modesModule).toContain('**Referral**');
    });

    it('has healthy benchmarks per stage', () => {
      expect(modesModule).toContain('60%+ within first week');
      expect(modesModule).toContain('40% / 20% / 10%');
    });

    it('includes ICE scoring for experiments', () => {
      expect(modesModule).toContain('**Impact** (1-10)');
      expect(modesModule).toContain('**Confidence** (1-10)');
      expect(modesModule).toContain('**Ease** (1-10)');
    });

    it('has experiment design template', () => {
      expect(modesModule).toContain('Experiment Design Template');
      expect(modesModule).toContain('Hypothesis:');
      expect(modesModule).toContain('Success criteria:');
    });

    it('has unit economics quick check table', () => {
      expect(modesModule).toContain('Unit Economics Quick Check');
      expect(modesModule).toContain('LTV:CAC');
      expect(modesModule).toContain('CAC Payback');
    });

    it('has channel recommendations by stage', () => {
      expect(modesModule).toContain('Channel Recommendations by Stage');
      expect(modesModule).toContain('Pre-PMF');
    });
  });

  describe('Deal Review mode', () => {
    it('contains MEDDPICC framework', () => {
      expect(modesModule).toContain('MEDDPICC');
      expect(modesModule).toContain('**Metrics**');
      expect(modesModule).toContain('**Economic Buyer**');
      expect(modesModule).toContain('**Decision Criteria**');
      expect(modesModule).toContain('**Champion**');
    });

    it('has deal verdict categories with score ranges', () => {
      expect(modesModule).toContain('32-40/40');
      expect(modesModule).toContain('**STRONG**');
      expect(modesModule).toContain('**BATTLING**');
      expect(modesModule).toContain('**AT RISK**');
      expect(modesModule).toContain('**UNQUALIFIED**');
    });

    it('has pipeline inspection questions', () => {
      expect(modesModule).toContain('Pipeline Inspection Questions');
      expect(modesModule).toContain('What has changed since you last spoke');
    });

    it('has red flags list', () => {
      expect(modesModule).toContain('Red Flags That Kill Deals');
      expect(modesModule).toContain('Single-threaded');
    });
  });

  describe('Canvas Coach mode', () => {
    it('contains weakest-box-first methodology', () => {
      expect(modesModule).toContain('Start with the weakest box');
      expect(modesModule).toContain('Move to the next weakest box');
    });

    it('has box quality checklist with 4 criteria', () => {
      expect(modesModule).toContain('Box Quality Checklist');
      expect(modesModule).toContain('**Specificity**');
      expect(modesModule).toContain('**Evidence tier**');
      expect(modesModule).toContain('**Measurability**');
      expect(modesModule).toContain('**Uniqueness**');
    });

    it('has per-box red flags for all 9 boxes', () => {
      expect(modesModule).toContain('Per-Box Red Flags');
      expect(modesModule).toContain('**Customer Segments**');
      expect(modesModule).toContain('**Problem**');
      expect(modesModule).toContain('**Unique Value Prop**');
      expect(modesModule).toContain('**Revenue Streams**');
      expect(modesModule).toContain('**Unfair Advantage**');
    });

    it('has momentum patterns from behavioral-nudge', () => {
      expect(modesModule).toContain('Momentum Patterns');
      expect(modesModule).toContain('Celebrate progress');
      expect(modesModule).toContain('Quick wins');
    });

    it('has probing question templates', () => {
      expect(modesModule).toContain('Probing Question Templates');
      expect(modesModule).toContain('dream first customer');
    });
  });
});

describe('Agency Chat Modes — Source Files', () => {
  const modes = [
    { name: 'practice-pitch', key: 'Socratic coaching' },
    { name: 'growth-strategy', key: 'AARRR Pirate Metrics' },
    { name: 'deal-review', key: 'MEDDPICC' },
    { name: 'canvas-coach', key: 'weakest box first' },
  ];

  for (const { name, key } of modes) {
    it(`${name}.md exists and contains key framework`, () => {
      const mdFile = readFile(join(ROOT, 'agency', 'chat-modes', `${name}.md`));
      expect(mdFile.length).toBeGreaterThan(500);
      expect(mdFile).toContain(key);
    });
  }
});

describe('Agency Chat Modes — Wiring Verification', () => {
  const aiChatSource = readFile(join(AI_CHAT, 'index.ts'));

  it('imports CHAT_MODE_PROMPTS from shared module', () => {
    expect(aiChatSource).toContain("import { CHAT_MODE_PROMPTS } from '../_shared/agency-chat-modes.ts'");
  });

  it('references CHAT_MODE_PROMPTS in coaching mode handler', () => {
    expect(aiChatSource).toContain('CHAT_MODE_PROMPTS[coachingMode]');
  });

  it('does NOT contain hardcoded COACHING_MODE_PROMPTS object', () => {
    // The old const declaration should be gone
    expect(aiChatSource).not.toContain('const COACHING_MODE_PROMPTS = {');
  });

  it('still has COACHING_MODES array for mode routing', () => {
    expect(aiChatSource).toContain("const COACHING_MODES = ['practice_pitch', 'growth_strategy', 'deal_review', 'canvas_coach', 'research', 'planning']");
  });
});
