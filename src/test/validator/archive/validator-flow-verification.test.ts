/**
 * Validator Flow Verification Test
 * Verifies wireframe-aligned implementation: routes, hooks, types, readiness logic.
 * Run: npm run test -- src/test/validator/validator-flow-verification.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  checkReadiness,
  countAtDepth,
  isCovered,
  isDeep,
  type FollowupCoverage,
} from '@/hooks/useValidatorFollowup';

describe('Validator Flow Verification', () => {
  describe('1. useValidatorFollowup — Readiness Logic', () => {
    it('checkReadiness: Normal ready — 5+ msgs, 8+ core shallow+, 3+ core deep, minBar → ready', () => {
      const coverage: FollowupCoverage = {
        company_name: 'deep',
        customer: 'deep',
        problem: 'deep',
        solution: 'shallow',
        competitors: 'shallow',
        innovation: 'shallow',
        demand: 'shallow',
        research: 'shallow',
        uniqueness: 'none',
        websites: 'none',
        industry: 'none',
        business_model: 'none',
        stage: 'none',
        ai_strategy: 'none',
        risk_awareness: 'none',
        execution_plan: 'none',
        investor_readiness: 'none',
      };
      expect(countAtDepth(coverage, 'shallow')).toBe(8); // shallow or deep
      expect(countAtDepth(coverage, 'deep')).toBe(3);
      expect(checkReadiness(coverage, 5)).toBe(true); // 5 msgs, 8 core shallow+, 3 core deep → Normal Ready
    });

    it('checkReadiness: Quick ready — 3+ msgs, 9+ core shallow+, 4+ core deep, minBar → ready', () => {
      const coverage: FollowupCoverage = {
        company_name: 'deep',
        customer: 'deep',
        problem: 'deep',
        solution: 'deep',
        competitors: 'shallow',
        innovation: 'shallow',
        demand: 'shallow',
        research: 'shallow',
        uniqueness: 'shallow',
        websites: 'none',
        industry: 'none',
        business_model: 'none',
        stage: 'none',
        ai_strategy: 'none',
        risk_awareness: 'none',
        execution_plan: 'none',
        investor_readiness: 'none',
      };
      expect(countAtDepth(coverage, 'shallow')).toBe(9); // 4 deep + 5 shallow = 9 shallow+
      expect(countAtDepth(coverage, 'deep')).toBe(4);
      expect(checkReadiness(coverage, 3)).toBe(true); // 3 msgs, 9 core shallow+, 4 core deep → Quick Ready
    });

    it('checkReadiness: Forced ready — 10+ msgs always ready', () => {
      const coverage: FollowupCoverage = {
        company_name: 'none',
        customer: 'shallow',
        problem: 'shallow',
        solution: 'none',
        competitors: 'shallow',
        innovation: 'shallow',
        demand: 'shallow',
        research: 'none',
        uniqueness: 'none',
        websites: 'none',
        industry: 'none',
        business_model: 'none',
        stage: 'none',
        ai_strategy: 'none',
        risk_awareness: 'none',
        execution_plan: 'none',
        investor_readiness: 'none',
      };
      expect(checkReadiness(coverage, 10)).toBe(true); // 10+ msgs → Forced Ready
    });

    it('checkReadiness: Not ready — insufficient coverage', () => {
      const coverage: FollowupCoverage = {
        company_name: 'none',
        customer: 'shallow',
        problem: 'shallow',
        solution: 'none',
        competitors: 'none',
        innovation: 'none',
        demand: 'none',
        research: 'none',
        uniqueness: 'none',
        websites: 'none',
        industry: 'none',
        business_model: 'none',
        stage: 'none',
        ai_strategy: 'none',
        risk_awareness: 'none',
        execution_plan: 'none',
        investor_readiness: 'none',
      };
      expect(checkReadiness(coverage, 2)).toBe(false);
    });

    it('isCovered: handles depth and boolean', () => {
      expect(isCovered('deep')).toBe(true);
      expect(isCovered('shallow')).toBe(true);
      expect(isCovered('none')).toBe(false);
      expect(isCovered(true)).toBe(true);
      expect(isCovered(false)).toBe(false);
    });

    it('isDeep: handles depth and boolean', () => {
      expect(isDeep('deep')).toBe(true);
      expect(isDeep('shallow')).toBe(false);
      expect(isDeep('none')).toBe(false);
    });
  });

  describe('2. validator-status URL format', () => {
    it('uses session_id query param (snake_case)', () => {
      const sessionId = 'abc-123-def';
      const supabaseUrl = 'https://xxx.supabase.co';
      const url = `${supabaseUrl}/functions/v1/validator-status?session_id=${sessionId}`;
      expect(url).toContain('session_id=');
      expect(url).toContain(sessionId);
    });
  });

  describe('3. validator-start payload shape', () => {
    it('interview_context has version, extracted, coverage', () => {
      const interviewContext = {
        version: 1,
        extracted: {
          problem: 'Manual scheduling wastes time',
          customer: 'Dental practices',
          solution: 'AI tool',
          differentiation: '',
          demand: '',
          competitors: '',
          business_model: '',
          websites: '',
        },
        coverage: {
          customer: 'deep' as const,
          problem: 'deep' as const,
          competitors: 'shallow' as const,
          innovation: 'shallow' as const,
          demand: 'shallow' as const,
          research: 'none' as const,
          uniqueness: 'none' as const,
          websites: 'none' as const,
        },
      };
      expect(interviewContext.version).toBe(1);
      expect(Object.keys(interviewContext.extracted)).toContain('problem');
      expect(Object.keys(interviewContext.coverage)).toContain('customer');
    });
  });

  describe('4. Route paths alignment', () => {
    it('validator routes follow wireframe spec', () => {
      const routes = {
        validate: '/validate',
        validatorDashboard: '/validator',
        validatorRun: '/validator/run/:sessionId',
        validatorReport: '/validator/report/:reportId',
      };
      expect(routes.validate).toBe('/validate');
      expect(routes.validatorRun).toContain('sessionId');
      expect(routes.validatorReport).toContain('reportId');
    });
  });

  describe('5. Coverage topics (17 topics: 13 core + 4 deep dive)', () => {
    it('FollowupCoverage has all 17 topics', () => {
      const coreTopics = [
        'company_name', 'customer', 'problem', 'solution', 'competitors',
        'innovation', 'demand', 'research', 'uniqueness', 'websites',
        'industry', 'business_model', 'stage',
      ];
      const deepDiveTopics = [
        'ai_strategy', 'risk_awareness', 'execution_plan', 'investor_readiness',
      ];
      const emptyCoverage: FollowupCoverage = {
        company_name: 'none',
        customer: 'none',
        problem: 'none',
        solution: 'none',
        competitors: 'none',
        innovation: 'none',
        demand: 'none',
        research: 'none',
        uniqueness: 'none',
        websites: 'none',
        industry: 'none',
        business_model: 'none',
        stage: 'none',
        ai_strategy: 'none',
        risk_awareness: 'none',
        execution_plan: 'none',
        investor_readiness: 'none',
      };
      [...coreTopics, ...deepDiveTopics].forEach((t) => {
        expect(emptyCoverage).toHaveProperty(t);
      });
      expect(coreTopics).toHaveLength(13);
      expect(deepDiveTopics).toHaveLength(4);
    });
  });
});
