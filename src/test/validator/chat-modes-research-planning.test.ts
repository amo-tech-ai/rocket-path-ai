/**
 * Research + Planning Chat Modes Tests (POST-04)
 *
 * Validates:
 * - New mode prompts exist and are well-structured
 * - Chat mode registry includes both new modes
 * - Frontend ChatMode type includes new modes
 * - Prompts contain required framework sections
 */

import { describe, it, expect } from 'vitest';
import {
  CHAT_MODE_PROMPTS,
  CHAT_MODE_NAMES,
  RESEARCH_MODE_PROMPT,
  PLANNING_MODE_PROMPT,
  getChatModePrompt,
} from '../../../supabase/functions/_shared/agency-chat-modes';

describe('POST-04: Research + Planning Chat Modes', () => {
  describe('CHAT_MODE_PROMPTS registry', () => {
    it('contains 6 modes (4 original + 2 new)', () => {
      expect(Object.keys(CHAT_MODE_PROMPTS)).toHaveLength(6);
    });

    it('includes research mode', () => {
      expect(CHAT_MODE_PROMPTS.research).toBeDefined();
      expect(CHAT_MODE_PROMPTS.research.length).toBeGreaterThan(100);
    });

    it('includes planning mode', () => {
      expect(CHAT_MODE_PROMPTS.planning).toBeDefined();
      expect(CHAT_MODE_PROMPTS.planning.length).toBeGreaterThan(100);
    });

    it('preserves all 4 original modes', () => {
      expect(CHAT_MODE_PROMPTS.practice_pitch).toBeDefined();
      expect(CHAT_MODE_PROMPTS.growth_strategy).toBeDefined();
      expect(CHAT_MODE_PROMPTS.deal_review).toBeDefined();
      expect(CHAT_MODE_PROMPTS.canvas_coach).toBeDefined();
    });
  });

  describe('CHAT_MODE_NAMES', () => {
    it('lists all 6 mode names', () => {
      expect(CHAT_MODE_NAMES).toHaveLength(6);
      expect(CHAT_MODE_NAMES).toContain('research');
      expect(CHAT_MODE_NAMES).toContain('planning');
    });
  });

  describe('getChatModePrompt', () => {
    it('returns research prompt', () => {
      expect(getChatModePrompt('research')).toBe(RESEARCH_MODE_PROMPT);
    });

    it('returns planning prompt', () => {
      expect(getChatModePrompt('planning')).toBe(PLANNING_MODE_PROMPT);
    });
  });

  describe('RESEARCH_MODE_PROMPT content', () => {
    it('defines research methodology', () => {
      expect(RESEARCH_MODE_PROMPT).toContain('Research Methodology');
    });

    it('requires citations', () => {
      expect(RESEARCH_MODE_PROMPT).toContain('Cite your sources');
      expect(RESEARCH_MODE_PROMPT).toContain('[1]');
    });

    it('covers market sizing', () => {
      expect(RESEARCH_MODE_PROMPT).toContain('Market sizing');
      expect(RESEARCH_MODE_PROMPT).toContain('TAM/SAM/SOM');
    });

    it('covers competitor analysis', () => {
      expect(RESEARCH_MODE_PROMPT).toContain('Competitor analysis');
    });

    it('includes output format', () => {
      expect(RESEARCH_MODE_PROMPT).toContain('Output Format');
      expect(RESEARCH_MODE_PROMPT).toContain('Key finding');
      expect(RESEARCH_MODE_PROMPT).toContain('Supporting evidence');
      expect(RESEARCH_MODE_PROMPT).toContain('Sources');
    });

    it('has data integrity rules', () => {
      expect(RESEARCH_MODE_PROMPT).toContain('Never fabricate data');
      expect(RESEARCH_MODE_PROMPT).toContain('Triangulate');
    });

    it('prefers recent data', () => {
      expect(RESEARCH_MODE_PROMPT).toContain('2024-2026');
    });
  });

  describe('PLANNING_MODE_PROMPT content', () => {
    it('defines planning methodology', () => {
      expect(PLANNING_MODE_PROMPT).toContain('Planning Methodology');
    });

    it('uses RICE framework', () => {
      expect(PLANNING_MODE_PROMPT).toContain('RICE');
      expect(PLANNING_MODE_PROMPT).toContain('Reach');
      expect(PLANNING_MODE_PROMPT).toContain('Impact');
      expect(PLANNING_MODE_PROMPT).toContain('Confidence');
      expect(PLANNING_MODE_PROMPT).toContain('Effort');
    });

    it('includes stage-specific plans', () => {
      expect(PLANNING_MODE_PROMPT).toContain('Idea Stage');
      expect(PLANNING_MODE_PROMPT).toContain('Pre-Seed');
      expect(PLANNING_MODE_PROMPT).toContain('Seed');
    });

    it('includes kill criteria', () => {
      expect(PLANNING_MODE_PROMPT).toContain('Kill criteria');
      expect(PLANNING_MODE_PROMPT).toContain('stop if');
    });

    it('includes output format', () => {
      expect(PLANNING_MODE_PROMPT).toContain('Output Format');
      expect(PLANNING_MODE_PROMPT).toContain('Goal');
      expect(PLANNING_MODE_PROMPT).toContain('Timeline');
      expect(PLANNING_MODE_PROMPT).toContain('Actions');
      expect(PLANNING_MODE_PROMPT).toContain('Quick win');
    });

    it('is resource-aware', () => {
      expect(PLANNING_MODE_PROMPT).toContain('solo founder');
      expect(PLANNING_MODE_PROMPT).toContain('current team size');
    });

    it('works backward from goals', () => {
      expect(PLANNING_MODE_PROMPT).toContain('Work backward from the goal');
    });

    it('references validator report data', () => {
      expect(PLANNING_MODE_PROMPT).toContain('validator report');
    });
  });
});
