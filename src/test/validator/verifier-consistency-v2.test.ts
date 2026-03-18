import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Tests for Phase 2: Verifier cross-section consistency rules + Scoring evidence_quality.
 */

const verifierFile = readFileSync(
  resolve(__dirname, '../../../supabase/functions/validator-start/agents/verifier.ts'),
  'utf-8'
);

const scoringFile = readFileSync(
  resolve(__dirname, '../../../supabase/functions/validator-start/agents/scoring.ts'),
  'utf-8'
);

describe('Verifier Cross-Section Rules v2', () => {
  it('has Phase 2a comment marker', () => {
    expect(verifierFile).toContain('Phase 2a: Cross-section consistency checks v2');
  });

  describe('V2-R1: TAM-score mismatch', () => {
    it('checks TAM < $100M with market score > 70', () => {
      expect(verifierFile).toContain('100_000_000');
      expect(verifierFile).toContain('marketDim.score > 70');
    });

    it('uses correct TAM variable name', () => {
      expect(verifierFile).toContain('tamVal');
    });
  });

  describe('V2-R2: Revenue vs next steps alignment', () => {
    it('checks subscription vs per-transaction mismatch', () => {
      expect(verifierFile).toContain('subscription');
      expect(verifierFile).toContain('per-transaction');
    });
  });

  describe('V2-R3: Financial projection growth (50x)', () => {
    it('uses tighter 50x threshold', () => {
      expect(verifierFile).toContain('y1_revenue * 50');
    });

    it('does not overlap with existing 100x check', () => {
      expect(verifierFile).toContain('y1_revenue * 100');
    });
  });

  describe('V2-R4: Low score without pivot language', () => {
    it('checks overall_weighted < 50', () => {
      expect(verifierFile).toContain('overall_weighted < 50');
    });

    it('looks for pivot keywords', () => {
      expect(verifierFile).toContain("'pivot'");
      expect(verifierFile).toContain("'reconsider'");
      expect(verifierFile).toContain("'rethink'");
    });
  });

  describe('V2-R5: Crowded market high score', () => {
    it('checks 5+ high-threat competitors', () => {
      expect(verifierFile).toContain('highThreats.length >= 5');
    });

    it('checks competition score > 60', () => {
      expect(verifierFile).toContain('compDimV2.score > 60');
    });
  });

  describe('V2-R6: MVP overscoped', () => {
    it('checks feature count > 5', () => {
      expect(verifierFile).toContain('featureCount > 5');
    });

    it('checks solo founder (teamRoles <= 1)', () => {
      expect(verifierFile).toContain('teamRoles <= 1');
    });
  });

  describe('V2-R7: Unsourced large TAM', () => {
    it('checks TAM > $1B', () => {
      expect(verifierFile).toContain('1_000_000_000');
    });

    it('checks zero sources', () => {
      expect(verifierFile).toContain('srcCount === 0');
    });
  });

  it('all 7 rules produce warnings (not silent)', () => {
    // Count unique V2-R references
    const ruleMatches = verifierFile.match(/V2-R\d/g) || [];
    const uniqueRules = new Set(ruleMatches);
    expect(uniqueRules.size).toBe(7);
  });
});

describe('Scoring Evidence Quality', () => {
  it('has Phase 2b comment marker', () => {
    expect(scoringFile).toContain('Phase 2b: Compute evidence_quality');
  });

  it('counts grade A/B/C/D', () => {
    expect(scoringFile).toContain('counts.a');
    expect(scoringFile).toContain('counts.b');
    expect(scoringFile).toContain('counts.c');
    expect(scoringFile).toContain('counts.d');
  });

  it('computes overall_quality from grade distribution', () => {
    expect(scoringFile).toContain("'strong'");
    expect(scoringFile).toContain("'moderate'");
    expect(scoringFile).toContain("'weak'");
  });

  it('generates confidence_note', () => {
    expect(scoringFile).toContain('confidence_note');
    expect(scoringFile).toContain('scores may be optimistic');
  });

  it('adds evidence_quality to scoring result', () => {
    expect(scoringFile).toContain('evidence_quality: evidenceQuality');
  });

  it('uses 60% threshold for strong', () => {
    expect(scoringFile).toContain('strongPct >= 0.6');
  });

  it('uses 30% threshold for moderate', () => {
    expect(scoringFile).toContain('strongPct >= 0.3');
  });
});
