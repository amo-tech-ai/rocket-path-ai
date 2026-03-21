import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Agency Fragment Integration Tests
 *
 * Verifies that:
 * 1. Fragment source files exist and have content
 * 2. The shared TypeScript module contains required sections
 * 3. Scoring agent source imports and uses the fragment
 * 4. Composer agent source imports and uses the fragment
 */

const ROOT = join(__dirname, '..', '..', '..');
const SHARED = join(ROOT, 'supabase', 'functions', '_shared');
const VALIDATOR = join(ROOT, 'supabase', 'functions', 'validator-start');

function readFile(path: string): string {
  return readFileSync(path, 'utf-8');
}

describe('Agency Fragments — Shared Module', () => {
  const fragmentsModule = readFile(join(SHARED, 'agency-fragments.ts'));

  it('exports SCORING_FRAGMENT constant', () => {
    expect(fragmentsModule).toContain('export const SCORING_FRAGMENT');
  });

  it('exports COMPOSER_FRAGMENT constant', () => {
    expect(fragmentsModule).toContain('export const COMPOSER_FRAGMENT');
  });

  it('exports getFragment function', () => {
    expect(fragmentsModule).toContain('export function getFragment');
  });

  describe('SCORING_FRAGMENT content', () => {
    it('contains Evidence-Weighted Scoring section', () => {
      expect(fragmentsModule).toContain('## Evidence-Weighted Scoring');
    });

    it('contains evidence tier table (High/Medium/Low)', () => {
      expect(fragmentsModule).toContain('| Cited external source');
      expect(fragmentsModule).toContain('| Founder claim with partial corroboration');
      expect(fragmentsModule).toContain('| AI inference only');
    });

    it('contains RICE-Based Priority Actions section', () => {
      expect(fragmentsModule).toContain('## RICE-Based Priority Actions');
    });

    it('contains full RICE component definitions', () => {
      expect(fragmentsModule).toContain('**Reach** (1-10)');
      expect(fragmentsModule).toContain('**Impact** (0.25 / 0.5 / 1 / 2 / 3)');
      expect(fragmentsModule).toContain('**Confidence** (0.5 / 0.8 / 1.0)');
      expect(fragmentsModule).toContain('**Effort** (1-10)');
    });

    it('specifies priority_actions output fields', () => {
      expect(fragmentsModule).toContain('- action:');
      expect(fragmentsModule).toContain('- rice_score:');
      expect(fragmentsModule).toContain('- timeframe:');
      expect(fragmentsModule).toContain('- effort:');
      expect(fragmentsModule).toContain('- dimension:');
    });

    it('contains Bias Detection section with 4 bias types', () => {
      expect(fragmentsModule).toContain('Confirmation Bias');
      expect(fragmentsModule).toContain('Survivorship Bias');
      expect(fragmentsModule).toContain('Anchoring Bias');
      expect(fragmentsModule).toContain('Optimism Bias');
    });

    it('instructs not to silently adjust scores', () => {
      expect(fragmentsModule).toContain('Do NOT silently adjust scores');
    });
  });

  describe('COMPOSER_FRAGMENT content', () => {
    it('contains Three-Act Report Narrative section', () => {
      expect(fragmentsModule).toContain('## Three-Act Report Narrative');
    });

    it('contains all three acts', () => {
      expect(fragmentsModule).toContain('Act 1 — Understanding');
      expect(fragmentsModule).toContain('Act 2 — Solution Journey');
      expect(fragmentsModule).toContain('Act 3 — Transformed State');
    });

    it('contains Win Theme Integration section', () => {
      expect(fragmentsModule).toContain('## Win Theme Integration');
    });

    it('specifies win theme criteria', () => {
      expect(fragmentsModule).toContain('**Buyer-specific**');
      expect(fragmentsModule).toContain('**Provable**');
      expect(fragmentsModule).toContain('**Differentiating**');
    });

    it('contains Growth Channel Recommendations with ICE scoring', () => {
      expect(fragmentsModule).toContain('## Growth Channel Recommendations');
      expect(fragmentsModule).toContain('ICE Score');
    });

    it('contains stage-appropriate channel table', () => {
      expect(fragmentsModule).toContain('Pre-PMF');
      expect(fragmentsModule).toContain('PMF (early traction)');
      expect(fragmentsModule).toContain('Scale (proven unit economics)');
    });

    it('contains Behavioral Framing section', () => {
      expect(fragmentsModule).toContain('## Behavioral Framing for Next Steps');
    });

    it('includes all 5 behavioral principles', () => {
      expect(fragmentsModule).toContain('Lead with micro-wins');
      expect(fragmentsModule).toContain('Momentum language');
      expect(fragmentsModule).toContain('Progressive commitment');
      expect(fragmentsModule).toContain('Loss framing for urgency');
      expect(fragmentsModule).toContain('Specificity over abstraction');
    });

    it('ends with coach framing (not consultant report)', () => {
      expect(fragmentsModule).toContain('coach giving a game plan, not a consultant delivering a report');
    });
  });
});

describe('Agency Fragments — Source Files', () => {
  it('scoring fragment .md file exists and matches module', () => {
    const mdFile = readFile(join(ROOT, 'agency', 'prompts', '036-fragment-validator-scoring.md'));
    expect(mdFile.length).toBeGreaterThan(500);
    // Key sections present in source .md
    expect(mdFile).toContain('Evidence-Weighted Scoring');
    expect(mdFile).toContain('RICE-Based Priority Actions');
    expect(mdFile).toContain('Bias Detection');
  });

  it('composer fragment .md file exists and matches module', () => {
    const mdFile = readFile(join(ROOT, 'agency', 'prompts', '037-fragment-validator-composer.md'));
    expect(mdFile.length).toBeGreaterThan(500);
    // Key sections present in source .md
    expect(mdFile).toContain('Three-Act Report Narrative');
    expect(mdFile).toContain('Win Theme Integration');
    expect(mdFile).toContain('Growth Channel Recommendations');
    expect(mdFile).toContain('Behavioral Framing');
  });
});

describe('Agency Fragments — Wiring Verification', () => {
  describe('scoring.ts imports and uses SCORING_FRAGMENT', () => {
    const scoringSource = readFile(join(VALIDATOR, 'agents', 'scoring.ts'));

    it('imports SCORING_FRAGMENT', () => {
      expect(scoringSource).toContain("import { SCORING_FRAGMENT } from \"../agency-fragments.ts\"");
    });

    it('appends fragment to system prompt', () => {
      expect(scoringSource).toContain('systemPrompt += SCORING_FRAGMENT');
    });

    it('does NOT contain hardcoded fragment content', () => {
      // The inline version had this exact string — it should now be in the shared module only
      expect(scoringSource).not.toContain('## Evidence-Weighted Scoring');
      expect(scoringSource).not.toContain('## RICE-Based Priority Actions');
    });
  });

  describe('composer.ts imports and uses COMPOSER_FRAGMENT', () => {
    const composerSource = readFile(join(VALIDATOR, 'agents', 'composer.ts'));

    it('imports COMPOSER_FRAGMENT', () => {
      expect(composerSource).toContain("import { COMPOSER_FRAGMENT } from \"../agency-fragments.ts\"");
    });

    it('interpolates fragment in Group D system prompt', () => {
      expect(composerSource).toContain('${COMPOSER_FRAGMENT}');
    });

    it('does NOT contain hardcoded Three-Act condensed version', () => {
      // The old condensed inline had this exact pattern — should be gone
      expect(composerSource).not.toContain('Structure summary_verdict using a three-act arc:');
    });
  });

  describe('validator-start/agency-fragments.ts re-exports from _shared', () => {
    const reExportSource = readFile(join(VALIDATOR, 'agency-fragments.ts'));

    it('re-exports SCORING_FRAGMENT', () => {
      expect(reExportSource).toContain('SCORING_FRAGMENT');
    });

    it('re-exports COMPOSER_FRAGMENT', () => {
      expect(reExportSource).toContain('COMPOSER_FRAGMENT');
    });

    it('imports from _shared/agency-fragments.ts', () => {
      expect(reExportSource).toContain('../_shared/agency-fragments.ts');
    });
  });
});
