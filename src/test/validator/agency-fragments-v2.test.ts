import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Tests for 3 new validator fragments (Phase 1):
 * RESEARCH_FRAGMENT, COMPETITORS_FRAGMENT, MVP_FRAGMENT
 *
 * Verifies: content, registry, agent imports, domain knowledge
 */

const fragmentsFile = readFileSync(
  resolve(__dirname, '../../../supabase/functions/_shared/agency-fragments.ts'),
  'utf-8'
);

const shimFile = readFileSync(
  resolve(__dirname, '../../../supabase/functions/validator-start/agency-fragments.ts'),
  'utf-8'
);

const researchFile = readFileSync(
  resolve(__dirname, '../../../supabase/functions/validator-start/agents/research.ts'),
  'utf-8'
);

const competitorsFile = readFileSync(
  resolve(__dirname, '../../../supabase/functions/validator-start/agents/competitors.ts'),
  'utf-8'
);

const mvpFile = readFileSync(
  resolve(__dirname, '../../../supabase/functions/validator-start/agents/mvp.ts'),
  'utf-8'
);

const typesFile = readFileSync(
  resolve(__dirname, '../../../supabase/functions/validator-start/types.ts'),
  'utf-8'
);

// ─── Registry ───────────────────────────────────────────────
describe('Fragment Registry', () => {
  it('has 8 fragment names', () => {
    expect(fragmentsFile).toContain("'scoring', 'composer', 'sprint', 'pitch_deck', 'crm_investor', 'research', 'competitors', 'mvp'");
  });

  it('getFragment handles research', () => {
    expect(fragmentsFile).toContain("case 'research': return RESEARCH_FRAGMENT;");
  });

  it('getFragment handles competitors', () => {
    expect(fragmentsFile).toContain("case 'competitors': return COMPETITORS_FRAGMENT;");
  });

  it('getFragment handles mvp', () => {
    expect(fragmentsFile).toContain("case 'mvp': return MVP_FRAGMENT;");
  });
});

// ─── Re-export Shim ─────────────────────────────────────────
describe('Re-export Shim', () => {
  it('exports RESEARCH_FRAGMENT', () => {
    expect(shimFile).toContain('RESEARCH_FRAGMENT');
  });

  it('exports COMPETITORS_FRAGMENT', () => {
    expect(shimFile).toContain('COMPETITORS_FRAGMENT');
  });

  it('exports MVP_FRAGMENT', () => {
    expect(shimFile).toContain('MVP_FRAGMENT');
  });
});

// ─── RESEARCH_FRAGMENT ──────────────────────────────────────
describe('RESEARCH_FRAGMENT', () => {
  it('exports RESEARCH_FRAGMENT constant', () => {
    expect(fragmentsFile).toContain('export const RESEARCH_FRAGMENT');
  });

  describe("Porter's Five Forces", () => {
    it('includes all 5 forces', () => {
      expect(fragmentsFile).toContain('Competitive Rivalry');
      expect(fragmentsFile).toContain('Threat of New Entrants');
      expect(fragmentsFile).toContain('Supplier Power');
      expect(fragmentsFile).toContain('Buyer Power');
      expect(fragmentsFile).toContain('Threat of Substitutes');
    });

    it('includes attractiveness rating', () => {
      expect(fragmentsFile).toContain('Overall attractiveness');
    });
  });

  describe('Market Accessibility', () => {
    it('includes 4 dimensions', () => {
      expect(fragmentsFile).toContain('Buyer Reachability');
      expect(fragmentsFile).toContain('Sales Cycle Complexity');
      expect(fragmentsFile).toContain('Regulatory Burden');
      expect(fragmentsFile).toContain('Distribution Existing');
    });

    it('includes composite threshold', () => {
      expect(fragmentsFile).toContain('Below 4.0');
    });
  });

  describe('Founder Optimism Detection', () => {
    it('includes TAM divergence rule', () => {
      expect(fragmentsFile).toContain('>3x');
    });

    it('includes growth rate divergence rule', () => {
      expect(fragmentsFile).toContain('>2x');
    });

    it('includes optimism_flags output', () => {
      expect(fragmentsFile).toContain('optimism_flags');
    });

    it('prevents silent correction', () => {
      expect(fragmentsFile).toContain('Do NOT silently correct');
    });
  });
});

// ─── COMPETITORS_FRAGMENT ───────────────────────────────────
describe('COMPETITORS_FRAGMENT', () => {
  it('exports COMPETITORS_FRAGMENT constant', () => {
    expect(fragmentsFile).toContain('export const COMPETITORS_FRAGMENT');
  });

  describe('Competitive Velocity', () => {
    it('includes velocity dimensions', () => {
      expect(fragmentsFile).toContain('Feature Shipping Rate');
      expect(fragmentsFile).toContain('Funding Trajectory');
      expect(fragmentsFile).toContain('Market Share Trend');
      expect(fragmentsFile).toContain('Response Capability');
    });

    it('includes velocity_rating output', () => {
      expect(fragmentsFile).toContain('velocity_rating');
      expect(fragmentsFile).toContain('fast | moderate | slow');
    });
  });

  describe('Zombie Detection', () => {
    it('includes zombie criteria', () => {
      expect(fragmentsFile).toContain('zombie');
      expect(fragmentsFile).toContain('Last product update >12 months');
    });

    it('forces zombie threat level to low', () => {
      expect(fragmentsFile).toContain('threat_level: low');
    });
  });

  describe('Pricing Landscape', () => {
    it('includes pricing model types', () => {
      expect(fragmentsFile).toContain('subscription | usage-based | freemium');
    });

    it('includes pricing_landscape output', () => {
      expect(fragmentsFile).toContain('pricing_landscape');
    });

    it('includes price gap analysis', () => {
      expect(fragmentsFile).toContain('Price Gap');
    });
  });

  describe('Win/Loss Patterns', () => {
    it('includes win/lose/switching', () => {
      expect(fragmentsFile).toContain('Win When');
      expect(fragmentsFile).toContain('Lose When');
      expect(fragmentsFile).toContain('Switching Triggers');
    });

    it('includes win_loss_patterns output', () => {
      expect(fragmentsFile).toContain('win_loss_patterns');
    });
  });
});

// ─── MVP_FRAGMENT ───────────────────────────────────────────
describe('MVP_FRAGMENT', () => {
  it('exports MVP_FRAGMENT constant', () => {
    expect(fragmentsFile).toContain('export const MVP_FRAGMENT');
  });

  describe('Build/Buy/Skip', () => {
    it('includes all 3 classifications', () => {
      expect(fragmentsFile).toContain('**Build**');
      expect(fragmentsFile).toContain('**Buy**');
      expect(fragmentsFile).toContain('**Skip**');
    });

    it('includes feature_classifications output', () => {
      expect(fragmentsFile).toContain('feature_classifications');
    });
  });

  describe('Resource Allocation', () => {
    it('includes team size table', () => {
      expect(fragmentsFile).toContain('Solo founder');
      expect(fragmentsFile).toContain('2-person team');
      expect(fragmentsFile).toContain('3-5 person team');
    });

    it('includes resource_plan output', () => {
      expect(fragmentsFile).toContain('resource_plan');
    });
  });

  describe('Pivot Criteria', () => {
    it('includes decision options', () => {
      expect(fragmentsFile).toContain('persevere');
      expect(fragmentsFile).toContain('pivot');
      expect(fragmentsFile).toContain('kill');
      expect(fragmentsFile).toContain('too_early_to_tell');
    });

    it('includes PMF threshold', () => {
      expect(fragmentsFile).toContain('25% PMF');
    });
  });

  describe('GTM Motion', () => {
    it('includes ACV-based selection', () => {
      expect(fragmentsFile).toContain('PLG');
      expect(fragmentsFile).toContain('Hybrid');
      expect(fragmentsFile).toContain('Sales-led');
    });

    it('includes gtm_motion output', () => {
      expect(fragmentsFile).toContain('gtm_motion');
    });

    it('includes pre-PMF rule', () => {
      expect(fragmentsFile).toContain('Founder-led sales');
    });
  });
});

// ─── Agent Wiring ───────────────────────────────────────────
describe('Agent Wiring', () => {
  it('research.ts imports RESEARCH_FRAGMENT', () => {
    expect(researchFile).toContain('import { RESEARCH_FRAGMENT }');
  });

  it('research.ts injects fragment into prompt', () => {
    expect(researchFile).toContain('RESEARCH_FRAGMENT');
  });

  it('competitors.ts imports COMPETITORS_FRAGMENT', () => {
    expect(competitorsFile).toContain('import { COMPETITORS_FRAGMENT }');
  });

  it('competitors.ts injects fragment into prompt', () => {
    expect(competitorsFile).toContain('COMPETITORS_FRAGMENT');
  });

  it('mvp.ts imports MVP_FRAGMENT', () => {
    expect(mvpFile).toContain('import { MVP_FRAGMENT }');
  });

  it('mvp.ts injects fragment into prompt', () => {
    expect(mvpFile).toContain('MVP_FRAGMENT');
  });
});

// ─── Types ──────────────────────────────────────────────────
describe('Types', () => {
  it('MarketResearch has market_forces', () => {
    expect(typesFile).toContain('market_forces');
    expect(typesFile).toContain('competitive_rivalry');
    expect(typesFile).toContain('overall_attractiveness');
  });

  it('MarketResearch has market_accessibility', () => {
    expect(typesFile).toContain('market_accessibility');
    expect(typesFile).toContain('buyer_reachability');
    expect(typesFile).toContain('composite');
  });

  it('MarketResearch has optimism_flags', () => {
    expect(typesFile).toContain('optimism_flags');
    expect(typesFile).toContain('divergence_factor');
  });

  it('Competitor has velocity_rating', () => {
    expect(typesFile).toContain("velocity_rating?: 'fast' | 'moderate' | 'slow'");
  });

  it('Competitor has status', () => {
    expect(typesFile).toContain("status?: 'active' | 'zombie' | 'unknown'");
  });

  it('CompetitorAnalysis has pricing_landscape', () => {
    expect(typesFile).toContain('pricing_landscape');
  });

  it('CompetitorAnalysis has win_loss_patterns', () => {
    expect(typesFile).toContain('win_loss_patterns');
    expect(typesFile).toContain('switching_triggers');
  });

  it('MVPPlan has feature_classifications', () => {
    expect(typesFile).toContain('feature_classifications');
    expect(typesFile).toContain("'build' | 'buy' | 'skip'");
  });

  it('MVPPlan has pivot_assessment', () => {
    expect(typesFile).toContain('pivot_assessment');
    expect(typesFile).toContain("'persevere' | 'pivot' | 'kill' | 'too_early_to_tell'");
  });

  it('MVPPlan has gtm_motion', () => {
    expect(typesFile).toContain('gtm_motion');
    expect(typesFile).toContain("'plg' | 'hybrid' | 'sales_led'");
  });

  it('ScoringResult has evidence_quality', () => {
    expect(typesFile).toContain('evidence_quality');
    expect(typesFile).toContain('grade_a_count');
    expect(typesFile).toContain("'strong' | 'moderate' | 'weak'");
  });
});
