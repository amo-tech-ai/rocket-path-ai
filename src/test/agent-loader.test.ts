import { describe, it, expect } from 'vitest';

// Agent loader runs in Deno (edge functions) so we test the constants/types here
// to ensure the fragment + chat mode registries stay in sync with actual files.
describe('agent-loader registries', () => {
  const FRAGMENTS = [
    'validator-scoring-fragment',
    'validator-composer-fragment',
    'crm-investor-fragment',
    'sprint-agent-fragment',
    'pitch-deck-fragment',
  ] as const;

  const CHAT_MODES = [
    'practice-pitch',
    'growth-strategy',
    'deal-review',
    'canvas-coach',
  ] as const;

  it('FRAGMENTS has 5 entries', () => {
    expect(FRAGMENTS).toHaveLength(5);
  });

  it('CHAT_MODES has 4 entries', () => {
    expect(CHAT_MODES).toHaveLength(4);
  });

  it('fragment names use kebab-case with -fragment suffix', () => {
    for (const name of FRAGMENTS) {
      expect(name).toMatch(/^[a-z]+-[a-z-]+-fragment$/);
    }
  });

  it('chat mode names use kebab-case', () => {
    for (const name of CHAT_MODES) {
      expect(name).toMatch(/^[a-z]+(-[a-z]+)*$/);
    }
  });
});
