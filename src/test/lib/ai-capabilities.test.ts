/**
 * AI Capabilities Tests
 * Tests for public/authenticated mode gating
 */

import { describe, it, expect } from 'vitest';
import { 
  checkGatedAction, 
  getCapabilities,
  hasCapability,
  getQuickActions,
  PUBLIC_CAPABILITIES,
  AUTHENTICATED_CAPABILITIES,
  PUBLIC_QUICK_ACTIONS,
  AUTHENTICATED_QUICK_ACTIONS,
  type AIMode,
} from '@/lib/ai-capabilities';

describe('AI Capabilities', () => {
  describe('getCapabilities', () => {
    it('returns public capabilities for public mode', () => {
      const capabilities = getCapabilities('public');
      expect(capabilities).toEqual(PUBLIC_CAPABILITIES);
    });

    it('returns authenticated capabilities for authenticated mode', () => {
      const capabilities = getCapabilities('authenticated');
      expect(capabilities).toEqual(AUTHENTICATED_CAPABILITIES);
    });

    it('authenticated capabilities include public ones', () => {
      const authCaps = getCapabilities('authenticated');
      const publicCaps = getCapabilities('public');
      
      publicCaps.forEach(pubCap => {
        expect(authCaps.some(cap => cap.id === pubCap.id)).toBe(true);
      });
    });
  });

  describe('hasCapability', () => {
    it('returns true for public capability in public mode', () => {
      expect(hasCapability('public', 'explain_features')).toBe(true);
    });

    it('returns true for public capability in authenticated mode', () => {
      expect(hasCapability('authenticated', 'explain_features')).toBe(true);
    });

    it('returns false for authenticated capability in public mode', () => {
      expect(hasCapability('public', 'task_planning')).toBe(false);
    });

    it('returns true for authenticated capability in authenticated mode', () => {
      expect(hasCapability('authenticated', 'task_planning')).toBe(true);
    });
  });

  describe('checkGatedAction', () => {
    it('allows all actions in authenticated mode', () => {
      const result = checkGatedAction('create a business plan for my startup', 'authenticated');
      expect(result.allowed).toBe(true);
    });

    it('allows general questions in public mode', () => {
      const result = checkGatedAction('What is StartupAI?', 'public');
      expect(result.allowed).toBe(true);
    });

    it('allows pricing questions in public mode', () => {
      const result = checkGatedAction('How much does it cost?', 'public');
      expect(result.allowed).toBe(true);
    });

    it('blocks task generation in public mode', () => {
      const result = checkGatedAction('generate task for my startup', 'public');
      expect(result.allowed).toBe(false);
      expect(result.action).toBe('signup');
    });

    it('blocks pitch deck creation in public mode', () => {
      const result = checkGatedAction('create a pitch deck', 'public');
      expect(result.allowed).toBe(false);
      expect(result.action).toBe('signup');
    });

    it('blocks business planning in public mode', () => {
      const result = checkGatedAction('analyze my startup', 'public');
      expect(result.allowed).toBe(false);
      expect(result.action).toBe('signup');
    });

    it('blocks investor research in public mode', () => {
      const result = checkGatedAction('find investors for my company', 'public');
      expect(result.allowed).toBe(false);
      expect(result.action).toBe('signup');
    });
  });

  describe('getQuickActions', () => {
    it('returns public quick actions for public mode', () => {
      const actions = getQuickActions('public');
      expect(actions).toEqual(PUBLIC_QUICK_ACTIONS);
    });

    it('returns authenticated quick actions for authenticated mode', () => {
      const actions = getQuickActions('authenticated');
      expect(actions).toEqual(AUTHENTICATED_QUICK_ACTIONS);
    });

    it('public quick actions have expected structure', () => {
      PUBLIC_QUICK_ACTIONS.forEach(action => {
        expect(action).toHaveProperty('id');
        expect(action).toHaveProperty('label');
        expect(action).toHaveProperty('prompt');
      });
    });
  });

  describe('Capability Definitions', () => {
    it('PUBLIC_CAPABILITIES has expected categories', () => {
      const categories = PUBLIC_CAPABILITIES.map(c => c.category);
      expect(categories).toContain('info');
    });

    it('AUTHENTICATED_CAPABILITIES includes action category', () => {
      const categories = AUTHENTICATED_CAPABILITIES.map(c => c.category);
      expect(categories).toContain('action');
      expect(categories).toContain('navigation');
    });

    it('all capabilities have required fields', () => {
      [...PUBLIC_CAPABILITIES, ...AUTHENTICATED_CAPABILITIES].forEach(cap => {
        expect(cap).toHaveProperty('id');
        expect(cap).toHaveProperty('label');
        expect(cap).toHaveProperty('description');
        expect(cap).toHaveProperty('mode');
        expect(cap).toHaveProperty('category');
      });
    });
  });
});
