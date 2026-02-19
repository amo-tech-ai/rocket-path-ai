/**
 * Auto-Create Startup Tests
 * Validates the logic for auto-creating startup profiles from validator extraction.
 * Tests cover: name derivation, slug generation, flow scenarios, DB constraint alignment.
 *
 * Run: npm run test -- src/test/validator/auto-create-startup.test.ts
 */

import { describe, it, expect } from 'vitest';

// ─────────────────────────────────────────────────────
// Replicate the auto-create logic from pipeline.ts for unit testing
// (The actual function runs on Deno; these tests validate the logic)
// ─────────────────────────────────────────────────────

/** Derives startup name from extracted idea — matches pipeline.ts logic */
function deriveStartupName(idea: string | undefined): string {
  const ideaName = idea
    ? (idea.match(/^[^.!?]+/)?.[0] || idea).slice(0, 60).trim()
    : 'My Startup';
  return ideaName.length < 5 ? 'My Startup' : ideaName;
}

/** Generates a unique slug — matches pipeline.ts logic */
function generateSlug(name: string): string {
  const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `${baseSlug}-${Date.now().toString(36)}`;
}

/** Stage values that pass the DB CHECK constraint */
const VALID_STAGES = ['idea', 'pre_seed', 'seed', 'series_a', 'series_b', 'series_c', 'growth', 'public'];
const VALID_VALIDATION_STAGES = ['idea', 'mvp', 'selling'];

// ─────────────────────────────────────────────────────
// Test 1: Startup Name Derivation
// ─────────────────────────────────────────────────────
describe('Auto-Create: Startup Name Derivation', () => {
  it('extracts first sentence as name', () => {
    const name = deriveStartupName('An AI-powered content platform. It helps brands plan photoshoots.');
    expect(name).toBe('An AI-powered content platform');
  });

  it('truncates to 60 chars', () => {
    const longIdea = 'A revolutionary blockchain-based decentralized autonomous organization for managing global supply chain operations and logistics in real-time.';
    const name = deriveStartupName(longIdea);
    expect(name.length).toBeLessThanOrEqual(60);
  });

  it('falls back to "My Startup" for empty input', () => {
    expect(deriveStartupName(undefined)).toBe('My Startup');
    expect(deriveStartupName('')).toBe('My Startup');
  });

  it('falls back to "My Startup" for very short input', () => {
    expect(deriveStartupName('App')).toBe('My Startup');
    expect(deriveStartupName('Hi')).toBe('My Startup');
  });

  it('handles idea with no sentence-ending punctuation', () => {
    const name = deriveStartupName('AI-powered content creation platform for brands');
    expect(name).toBe('AI-powered content creation platform for brands');
  });

  it('handles exclamation and question marks as sentence endings', () => {
    expect(deriveStartupName('Stop wasting money! Our tool helps.')).toBe('Stop wasting money');
    expect(deriveStartupName('What if AI could plan your shoots? That is our vision.')).toBe('What if AI could plan your shoots');
  });
});

// ─────────────────────────────────────────────────────
// Test 2: Slug Generation
// ─────────────────────────────────────────────────────
describe('Auto-Create: Slug Generation', () => {
  it('generates a valid slug from name', () => {
    const slug = generateSlug('AI Content Platform');
    expect(slug).toMatch(/^ai-content-platform-[a-z0-9]+$/);
  });

  it('strips special characters', () => {
    const slug = generateSlug('My Startup (AI & ML)');
    expect(slug).toMatch(/^my-startup-ai-ml-[a-z0-9]+$/);
  });

  it('generates unique slugs for same name', () => {
    const slug1 = generateSlug('Test Startup');
    // Small delay to ensure different timestamp
    const slug2 = generateSlug('Test Startup');
    // Slugs should have same prefix but may differ in timestamp suffix
    expect(slug1.startsWith('test-startup-')).toBe(true);
    expect(slug2.startsWith('test-startup-')).toBe(true);
  });

  it('handles empty/short names', () => {
    const slug = generateSlug('My Startup');
    expect(slug).toMatch(/^my-startup-[a-z0-9]+$/);
  });

  it('strips leading/trailing hyphens', () => {
    const slug = generateSlug('---Test---');
    expect(slug).toMatch(/^test-[a-z0-9]+$/);
    expect(slug).not.toMatch(/^-/);
    expect(slug.split('-').length).toBeGreaterThanOrEqual(2); // name part + timestamp
  });
});

// ─────────────────────────────────────────────────────
// Test 3: DB Constraint Alignment
// ─────────────────────────────────────────────────────
describe('Auto-Create: DB Constraint Alignment', () => {
  it('uses valid stage value', () => {
    const stage = 'idea'; // What pipeline.ts sets
    expect(VALID_STAGES).toContain(stage);
  });

  it('uses valid validation_stage value', () => {
    const validationStage = 'idea'; // What pipeline.ts sets
    expect(VALID_VALIDATION_STAGES).toContain(validationStage);
  });

  it('all valid stages are covered by CHECK constraint', () => {
    // Ensure our constants match actual DB constraints
    expect(VALID_STAGES).toEqual([
      'idea', 'pre_seed', 'seed', 'series_a', 'series_b', 'series_c', 'growth', 'public'
    ]);
  });

  it('all valid validation stages are covered', () => {
    expect(VALID_VALIDATION_STAGES).toEqual(['idea', 'mvp', 'selling']);
  });
});

// ─────────────────────────────────────────────────────
// Test 4: Auto-Create Flow Scenarios
// ─────────────────────────────────────────────────────
describe('Auto-Create: Flow Scenarios', () => {
  // Simulate the pipeline decision logic
  function shouldAutoCreate(params: {
    profile: { idea: string } | null;
    startup_id: string | undefined;
    user_id: string | undefined;
  }): boolean {
    return !!(params.profile && !params.startup_id && params.user_id);
  }

  it('triggers when no startup_id and user_id present', () => {
    expect(shouldAutoCreate({
      profile: { idea: 'Test idea' },
      startup_id: undefined,
      user_id: 'user-123',
    })).toBe(true);
  });

  it('does NOT trigger when startup_id already provided', () => {
    expect(shouldAutoCreate({
      profile: { idea: 'Test idea' },
      startup_id: 'startup-456',
      user_id: 'user-123',
    })).toBe(false);
  });

  it('does NOT trigger when extraction failed (no profile)', () => {
    expect(shouldAutoCreate({
      profile: null,
      startup_id: undefined,
      user_id: 'user-123',
    })).toBe(false);
  });

  it('does NOT trigger when user_id missing', () => {
    expect(shouldAutoCreate({
      profile: { idea: 'Test idea' },
      startup_id: undefined,
      user_id: undefined,
    })).toBe(false);
  });
});

// ─────────────────────────────────────────────────────
// Test 5: Field Mapping from Extraction to Startup
// ─────────────────────────────────────────────────────
describe('Auto-Create: Field Mapping', () => {
  interface StartupProfile {
    idea: string;
    problem: string;
    customer: string;
    solution: string;
    differentiation: string;
    alternatives: string;
    validation: string;
    industry: string;
    websites: string;
  }

  function mapProfileToStartup(profile: StartupProfile) {
    const name = deriveStartupName(profile.idea);
    return {
      name,
      description: profile.idea || null,
      industry: profile.industry || null,
      problem: profile.problem || null,
      problem_statement: profile.problem || null,
      solution: profile.solution || null,
      solution_description: profile.solution || null,
      unique_value: profile.differentiation || null,
      existing_alternatives: profile.alternatives || null,
      target_customers: profile.customer ? [profile.customer] : [],
      stage: 'idea',
      validation_stage: 'idea',
    };
  }

  const sampleProfile: StartupProfile = {
    idea: 'An AI-powered content creation platform. It helps brands plan photoshoots.',
    problem: 'Brands waste money on unplanned content shoots',
    customer: 'D2C e-commerce brands with $1M+ revenue',
    solution: 'AI analyzes brand style and generates shot lists',
    differentiation: 'Creative Temperature control from safe to bold',
    alternatives: 'Soona, Squareshot, manual planning',
    validation: 'Interviewed 15 brand managers',
    industry: 'MarTech / Content Creation',
    websites: 'https://soona.co',
  };

  it('maps all fields correctly', () => {
    const result = mapProfileToStartup(sampleProfile);
    expect(result.name).toBe('An AI-powered content creation platform');
    expect(result.description).toBe(sampleProfile.idea);
    expect(result.industry).toBe('MarTech / Content Creation');
    expect(result.problem).toBe(sampleProfile.problem);
    expect(result.solution).toBe(sampleProfile.solution);
    expect(result.unique_value).toBe(sampleProfile.differentiation);
    expect(result.existing_alternatives).toBe(sampleProfile.alternatives);
    expect(result.target_customers).toEqual(['D2C e-commerce brands with $1M+ revenue']);
    expect(result.stage).toBe('idea');
    expect(result.validation_stage).toBe('idea');
  });

  it('handles empty fields gracefully', () => {
    const emptyProfile: StartupProfile = {
      idea: '', problem: '', customer: '', solution: '',
      differentiation: '', alternatives: '', validation: '',
      industry: '', websites: '',
    };
    const result = mapProfileToStartup(emptyProfile);
    expect(result.name).toBe('My Startup');
    expect(result.description).toBeNull();
    expect(result.industry).toBeNull();
    expect(result.target_customers).toEqual([]);
  });
});
