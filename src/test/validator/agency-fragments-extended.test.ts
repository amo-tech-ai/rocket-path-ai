import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Agency Fragments Extended Tests — Sprint, Pitch Deck, CRM Investor
 *
 * Verifies:
 * 1. All 5 fragment exports exist in shared module
 * 2. Each new fragment contains its key frameworks
 * 3. Edge functions import and use fragments (not hardcoded)
 * 4. Source .md files exist and match
 */

const ROOT = join(__dirname, '..', '..', '..');
const SHARED = join(ROOT, 'supabase', 'functions', '_shared');

function readFile(path: string): string {
  return readFileSync(path, 'utf-8');
}

describe('Agency Fragments — Extended Module (5/5)', () => {
  const fragmentsModule = readFile(join(SHARED, 'agency-fragments.ts'));

  it('exports all 5 fragment constants', () => {
    expect(fragmentsModule).toContain('export const SCORING_FRAGMENT');
    expect(fragmentsModule).toContain('export const COMPOSER_FRAGMENT');
    expect(fragmentsModule).toContain('export const SPRINT_FRAGMENT');
    expect(fragmentsModule).toContain('export const PITCH_DECK_FRAGMENT');
    expect(fragmentsModule).toContain('export const CRM_INVESTOR_FRAGMENT');
  });

  it('FRAGMENT_NAMES has 5 entries', () => {
    expect(fragmentsModule).toContain("'scoring', 'composer', 'sprint', 'pitch_deck', 'crm_investor'");
  });

  describe('SPRINT_FRAGMENT content', () => {
    it('contains RICE scoring with quadrant table', () => {
      expect(fragmentsModule).toContain('RICE Scoring for Task Generation');
      expect(fragmentsModule).toContain('**Quick Wins**');
      expect(fragmentsModule).toContain('**Big Bets**');
      expect(fragmentsModule).toContain('**Fill-Ins**');
      expect(fragmentsModule).toContain('**Time Sinks**');
    });

    it('contains Kano classification with examples', () => {
      expect(fragmentsModule).toContain('Kano Classification');
      expect(fragmentsModule).toContain('**Must-Have**');
      expect(fragmentsModule).toContain('**Performance**');
      expect(fragmentsModule).toContain('**Delighter**');
    });

    it('contains momentum sequencing rules', () => {
      expect(fragmentsModule).toContain('Momentum Sequencing');
      expect(fragmentsModule).toContain('Start every sprint with a Quick Win');
    });

    it('contains capacity planning table with team sizes', () => {
      expect(fragmentsModule).toContain('Capacity Planning');
      expect(fragmentsModule).toContain('Solo founder');
      expect(fragmentsModule).toContain('Team of 2-3');
      expect(fragmentsModule).toContain('Team of 4-6');
    });
  });

  describe('PITCH_DECK_FRAGMENT content', () => {
    it('contains Win Theme Architecture with application rules', () => {
      expect(fragmentsModule).toContain('Win Theme Architecture');
      expect(fragmentsModule).toContain('Investor-thesis-specific');
      expect(fragmentsModule).toContain('primacy effect');
      expect(fragmentsModule).toContain('recency effect');
    });

    it('contains Challenger Narrative with 4 steps', () => {
      expect(fragmentsModule).toContain('Challenger Narrative');
      expect(fragmentsModule).toContain('**Industry insight**');
      expect(fragmentsModule).toContain('**Cost of the status quo**');
      expect(fragmentsModule).toContain('**The new way**');
      expect(fragmentsModule).toContain('**Product reveal**');
    });

    it('contains Persuasion Architecture with 5 principles', () => {
      expect(fragmentsModule).toContain('Persuasion Architecture');
      expect(fragmentsModule).toContain('**Primacy Effect**');
      expect(fragmentsModule).toContain('**Progressive Disclosure**');
      expect(fragmentsModule).toContain('**Loss Aversion**');
      expect(fragmentsModule).toContain('**Social Proof Cascade**');
      expect(fragmentsModule).toContain('**Recency Effect**');
    });

    it('contains Growth Story on Traction Slide', () => {
      expect(fragmentsModule).toContain('Growth Story on the Traction Slide');
      expect(fragmentsModule).toContain('validation velocity');
    });
  });

  describe('CRM_INVESTOR_FRAGMENT content', () => {
    it('contains MEDDPICC scoring table', () => {
      expect(fragmentsModule).toContain('Investor MEDDPICC Adaptation');
      expect(fragmentsModule).toContain('**Economic Buyer**');
      expect(fragmentsModule).toContain('**Champion**');
      expect(fragmentsModule).toContain('Total: /40');
    });

    it('contains signal-based outreach timing', () => {
      expect(fragmentsModule).toContain('Signal-Based Outreach Timing');
      expect(fragmentsModule).toContain('Strong Signals (reach out within 1 week)');
      expect(fragmentsModule).toContain('Medium Signals (reach out within 2-4 weeks)');
      expect(fragmentsModule).toContain('Weak Signals (add to nurture');
    });

    it('contains cold email framework', () => {
      expect(fragmentsModule).toContain('Cold Email Framework');
      expect(fragmentsModule).toContain('Signal-based opening');
      expect(fragmentsModule).toContain('Low-friction CTA');
      expect(fragmentsModule).toContain('Anti-patterns to avoid');
    });
  });
});

describe('Agency Fragments — Source .md Files', () => {
  const files = [
    { name: '038-fragment-sprint-agent.md', key: 'RICE Scoring' },
    { name: '039-fragment-crm-investor.md', key: 'MEDDPICC' },
    { name: '040-fragment-pitch-deck.md', key: 'Win Theme' },
  ];

  for (const { name, key } of files) {
    it(`${name} exists and contains key framework`, () => {
      const mdFile = readFile(join(ROOT, 'agency', 'prompts', name));
      expect(mdFile.length).toBeGreaterThan(400);
      expect(mdFile).toContain(key);
    });
  }
});

describe('Agency Fragments — Wiring Verification', () => {
  it('sprint-agent imports SPRINT_FRAGMENT from shared', () => {
    const src = readFile(join(ROOT, 'supabase', 'functions', 'sprint-agent', 'index.ts'));
    expect(src).toContain('import { SPRINT_FRAGMENT } from "../_shared/agency-fragments.ts"');
    expect(src).not.toContain('const SPRINT_FRAGMENT =');
  });

  it('pitch-deck-agent imports PITCH_DECK_FRAGMENT from shared', () => {
    const src = readFile(join(ROOT, 'supabase', 'functions', 'pitch-deck-agent', 'actions', 'generation.ts'));
    expect(src).toContain('import { PITCH_DECK_FRAGMENT } from "../../_shared/agency-fragments.ts"');
    expect(src).toContain('${PITCH_DECK_FRAGMENT}');
  });

  it('investor-agent imports CRM_INVESTOR_FRAGMENT from shared', () => {
    const src = readFile(join(ROOT, 'supabase', 'functions', 'investor-agent', 'prompt.ts'));
    expect(src).toContain('import { CRM_INVESTOR_FRAGMENT } from "../_shared/agency-fragments.ts"');
    expect(src).toContain('${CRM_INVESTOR_FRAGMENT}');
  });

  it('investor-agent no longer has hardcoded MEDDPICC in ANALYZE prompt', () => {
    const src = readFile(join(ROOT, 'supabase', 'functions', 'investor-agent', 'prompt.ts'));
    expect(src).not.toContain('Score each investor using adapted MEDDPICC (rate each 1-5):');
  });
});
