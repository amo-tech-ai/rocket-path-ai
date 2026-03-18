import { describe, it, expect } from 'vitest';

/**
 * Tests for the 3-layer STARTUP_EXPERT_PROMPT system.
 *
 * Layer 1: CORE_PROMPT (role, data rules, response format)
 * Layer 2: SCREEN_OVERLAYS (per-screen focus narrowing)
 * Layer 3: STAGE_OVERLAYS (stage-appropriate priorities)
 * + DOMAIN_KNOWLEDGE (loaded per-screen, not globally)
 *
 * Source: supabase/functions/_shared/startup-expert.ts
 * Wired into: supabase/functions/ai-chat/index.ts (default chat action)
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const expertFile = readFileSync(
  resolve(__dirname, '../../../supabase/functions/_shared/startup-expert.ts'),
  'utf-8'
);

describe('Layer 1: CORE_PROMPT', () => {
  it('names the advisor Atlas', () => {
    expect(expertFile).toContain('You are Atlas');
  });

  describe('Data Reliability Rules', () => {
    it('prevents inventing precise numbers', () => {
      expect(expertFile).toContain('Do NOT invent precise numbers');
    });

    it('requires stating assumptions', () => {
      expect(expertFile).toContain('state your assumptions');
    });

    it('defers to validator scores', () => {
      expect(expertFile).toContain('defer to its scores');
      expect(expertFile).toContain('Do NOT generate a conflicting score');
    });

    it('requires labeling estimates', () => {
      expect(expertFile).toContain('Rough estimate based on');
    });

    it('notes benchmarks are defaults, not absolutes', () => {
      expect(expertFile).toContain('defaults for typical venture-backed');
    });
  });

  describe('Thinking Rules', () => {
    it('uses founder actual data', () => {
      expect(expertFile).toContain("founder's actual data");
    });

    it('prefers frameworks over opinions', () => {
      expect(expertFile).toContain('Frameworks over opinions');
    });

    it('is honest not encouraging', () => {
      expect(expertFile).toContain('Honest, not encouraging');
    });

    it('prioritizes one thing at a time', () => {
      expect(expertFile).toContain('One thing at a time');
    });
  });

  describe('Response Format', () => {
    it('has 3-part structure (answer, why, next step)', () => {
      expect(expertFile).toContain('Direct answer');
      expect(expertFile).toContain('Why');
      expect(expertFile).toContain('Best next step');
    });

    it('keeps responses under 300 words', () => {
      expect(expertFile).toContain('300 words');
    });
  });
});

describe('Layer 2: SCREEN_OVERLAYS', () => {
  it('has dashboard overlay', () => {
    expect(expertFile).toContain('SCREEN FOCUS: Dashboard');
    expect(expertFile).toContain('top bottleneck');
  });

  it('has validate overlay', () => {
    expect(expertFile).toContain('SCREEN FOCUS: Idea Validation');
    expect(expertFile).toContain('Why Now Test');
    expect(expertFile).toContain('Tarpit Detection');
    expect(expertFile).toContain('Paul Graham Filters');
  });

  it('has validator report overlay that defers to scores', () => {
    expect(expertFile).toContain('SCREEN FOCUS: Validator Report');
    expect(expertFile).toContain('Do NOT generate a competing score');
  });

  it('has lean canvas overlay', () => {
    expect(expertFile).toContain('SCREEN FOCUS: Lean Canvas');
    expect(expertFile).toContain('ICP specificity');
  });

  it('has CRM overlay', () => {
    expect(expertFile).toContain('SCREEN FOCUS: CRM');
  });

  it('has pitch deck overlay', () => {
    expect(expertFile).toContain('SCREEN FOCUS: Pitch Deck');
  });

  it('has tasks overlay', () => {
    expect(expertFile).toContain('SCREEN FOCUS: Tasks');
    expect(expertFile).toContain('RICE');
  });

  it('has sprint plan overlay', () => {
    expect(expertFile).toContain('SCREEN FOCUS: Sprint Planning');
  });
});

describe('Layer 3: STAGE_OVERLAYS', () => {
  it('has idea stage', () => {
    expect(expertFile).toContain('STAGE: Ideation');
    expect(expertFile).toContain('problem-solution fit');
  });

  it('has pre-seed stage', () => {
    expect(expertFile).toContain('STAGE: Pre-Seed');
    expect(expertFile).toContain('riskiest assumption');
  });

  it('has seed stage', () => {
    expect(expertFile).toContain('STAGE: Seed');
    expect(expertFile).toContain('Sean Ellis');
  });

  it('has series A stage', () => {
    expect(expertFile).toContain('STAGE: Series A');
    expect(expertFile).toContain('burn multiple');
  });
});

describe('DOMAIN_KNOWLEDGE', () => {
  describe('market_sizing', () => {
    it('includes TAM/SAM/SOM methods', () => {
      expect(expertFile).toContain('Top-Down');
      expect(expertFile).toContain('Bottom-Up (preferred)');
      expect(expertFile).toContain('Value Theory');
    });

    it('includes SOM calibration by stage', () => {
      expect(expertFile).toContain('Pre-seed 0.1-0.5%');
      expect(expertFile).toContain('Seed 1-3%');
    });

    it('includes cross-validation rule', () => {
      expect(expertFile).toContain('differ by >3x');
    });
  });

  describe('unit_economics', () => {
    it('includes key metrics with softer language', () => {
      expect(expertFile).toContain('typically healthy');
      expect(expertFile).toContain('usually unsustainable');
    });

    it('includes Burn Multiple', () => {
      expect(expertFile).toContain('Burn Multiple');
    });

    it('includes Rule of 40', () => {
      expect(expertFile).toContain('Rule of 40');
    });

    it('includes NRR benchmarks', () => {
      expect(expertFile).toContain('NRR');
    });

    it('includes revenue models', () => {
      expect(expertFile).toContain('Subscription');
      expect(expertFile).toContain('Usage-Based');
      expect(expertFile).toContain('Marketplace');
    });
  });

  describe('competitive_strategy', () => {
    it('includes competitor tiering', () => {
      expect(expertFile).toContain('Tier 1 (Direct)');
      expect(expertFile).toContain('Tier 2 (Adjacent)');
      expect(expertFile).toContain('Tier 3 (Indirect)');
    });

    it('includes moat types', () => {
      expect(expertFile).toContain('Network effects');
      expect(expertFile).toContain('Switching costs');
    });

    it('includes April Dunford positioning', () => {
      expect(expertFile).toContain('April Dunford');
    });
  });

  describe('fundraising', () => {
    it('includes stage benchmarks with softer language', () => {
      expect(expertFile).toContain('typical ranges');
      expect(expertFile).toContain('Pre-seed $250K-$1M');
    });

    it('includes common red flags', () => {
      expect(expertFile).toContain('red flags');
    });
  });

  describe('gtm_strategy', () => {
    it('includes motion selection', () => {
      expect(expertFile).toContain('PLG');
      expect(expertFile).toContain('Sales-led');
    });

    it('includes PQL definition', () => {
      expect(expertFile).toContain('PQL');
    });

    it('includes channel sequencing rule', () => {
      expect(expertFile).toContain('1-2 channels sequentially');
    });
  });

  describe('experiments', () => {
    it('includes RICE scoring', () => {
      expect(expertFile).toContain('RICE');
      expect(expertFile).toContain('Reach x Impact x Confidence');
    });

    it('includes Kano Model', () => {
      expect(expertFile).toContain('Kano');
      expect(expertFile).toContain('Must-Have');
      expect(expertFile).toContain('Delighter');
    });

    it('includes experiment types', () => {
      expect(expertFile).toContain('Wizard of Oz');
      expect(expertFile).toContain('Concierge');
    });

    it('includes PMF signals', () => {
      expect(expertFile).toContain('Sean Ellis');
      expect(expertFile).toContain('40%');
    });

    it('includes Kill criteria with softer language', () => {
      expect(expertFile).toContain('Kill criteria examples');
      expect(expertFile).toContain('consider pivot');
    });
  });

  describe('scoring_explained', () => {
    it('includes 9 dimensions', () => {
      expect(expertFile).toContain('Problem Severity');
      expect(expertFile).toContain('Market Timing');
      expect(expertFile).toContain('Competitive Moat');
      expect(expertFile).toContain('Unit Economics');
      expect(expertFile).toContain('GTM Clarity');
    });

    it('marks as explain-only, not re-score', () => {
      expect(expertFile).toContain('do NOT re-score');
    });

    it('includes bias types', () => {
      expect(expertFile).toContain('Confirmation');
      expect(expertFile).toContain('Optimism');
      expect(expertFile).toContain('Sunk Cost');
    });
  });
});

describe('Screen → Domain mapping', () => {
  it('maps /dashboard to unit_economics', () => {
    expect(expertFile).toContain("'/dashboard': ['unit_economics']");
  });

  it('maps /validator to scoring_explained', () => {
    expect(expertFile).toContain("'/validator': ['scoring_explained']");
  });

  it('maps /lean-canvas to market_sizing + competitive_strategy + gtm_strategy', () => {
    expect(expertFile).toContain("'/lean-canvas': ['market_sizing', 'competitive_strategy', 'gtm_strategy']");
  });

  it('maps /app/pitch-deck to fundraising + competitive_strategy', () => {
    expect(expertFile).toContain("'/app/pitch-deck': ['fundraising', 'competitive_strategy']");
  });
});

describe('buildExpertPrompt function', () => {
  it('exports buildExpertPrompt', () => {
    expect(expertFile).toContain('export function buildExpertPrompt');
  });

  it('accepts all context fields', () => {
    expect(expertFile).toContain('user_name');
    expect(expertFile).toContain('startup_name');
    expect(expertFile).toContain('startup_stage');
    expect(expertFile).toContain('industry');
    expect(expertFile).toContain('is_raising');
    expect(expertFile).toContain('description');
    expect(expertFile).toContain('screen');
  });

  it('assembles 3 layers', () => {
    // Layer 1: core
    expect(expertFile).toContain('let prompt = CORE_PROMPT');
    // Layer 2: screen
    expect(expertFile).toContain('SCREEN_OVERLAYS[screenKey]');
    // Layer 3: stage
    expect(expertFile).toContain('STAGE_OVERLAYS[stageKey]');
  });

  it('loads domain knowledge per screen', () => {
    expect(expertFile).toContain('SCREEN_DOMAINS[screenKey]');
    expect(expertFile).toContain('DOMAIN_KNOWLEDGE[d]');
  });
});

describe('ai-chat wiring', () => {
  const chatFile = readFileSync(
    resolve(__dirname, '../../../supabase/functions/ai-chat/index.ts'),
    'utf-8'
  );

  it('imports buildExpertPrompt', () => {
    expect(chatFile).toContain("import { buildExpertPrompt } from '../_shared/startup-expert.ts'");
  });

  it('uses expert prompt for default chat action', () => {
    expect(chatFile).toContain("if (effectiveAction === 'chat')");
    expect(chatFile).toContain('buildExpertPrompt({');
  });

  it('passes startup description', () => {
    expect(chatFile).toContain('description: startup?.description');
  });

  it('preserves legacy buildSystemPrompt for specialized actions', () => {
    expect(chatFile).toContain('buildSystemPrompt(effectiveAction');
  });
});
