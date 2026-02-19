/**
 * Report Section Components — Smoke Tests
 * Verifies all 10 section components render without crashing given valid props
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock IntersectionObserver (used by AnimatedBar)
const mockIntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}));
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: mockIntersectionObserver,
});

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }: any, ref: any) =>
      React.createElement('div', { ...props, ref }, children)),
    span: React.forwardRef(({ children, ...props }: any, ref: any) =>
      React.createElement('span', { ...props, ref }, children)),
    p: React.forwardRef(({ children, ...props }: any, ref: any) =>
      React.createElement('p', { ...props, ref }, children)),
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('Report Section Components', () => {
  describe('ReportHero', () => {
    it('renders without crashing', async () => {
      const { ReportHero } = await import('@/components/validator/report/ReportHero');
      const { container } = render(
        React.createElement(ReportHero, {
          score: 72,
          signal: 'caution',
          oneLiner: 'A promising idea with some risks',
          strengths: [{ title: 'Strong team', description: 'Experienced founders' }],
          concerns: [{ title: 'Competition', description: 'Crowded market' }],
          nextSteps: ['Validate with customers', 'Build MVP'],
        })
      );
      expect(container.innerHTML).toBeTruthy();
    });

    it('renders go signal', async () => {
      const { ReportHero } = await import('@/components/validator/report/ReportHero');
      const { container } = render(
        React.createElement(ReportHero, {
          score: 85,
          signal: 'go',
          oneLiner: 'Excellent opportunity',
          strengths: [],
          concerns: [],
          nextSteps: [],
        })
      );
      expect(container.innerHTML).toBeTruthy();
    });
  });

  describe('ProblemCard', () => {
    it('renders all props', async () => {
      const { ProblemCard } = await import('@/components/validator/report/ProblemCard');
      render(
        React.createElement(ProblemCard, {
          who: 'Startup founders',
          pain: 'Manual validation takes weeks',
          currentFix: 'Spreadsheets and guesswork',
          severity: 'high',
        })
      );
      expect(screen.getByText(/Startup founders/)).toBeTruthy();
    });

    it('handles low severity', async () => {
      const { ProblemCard } = await import('@/components/validator/report/ProblemCard');
      const { container } = render(
        React.createElement(ProblemCard, {
          who: 'Users',
          pain: 'Minor inconvenience',
          currentFix: 'Manual workaround',
          severity: 'low',
        })
      );
      expect(container.innerHTML).toBeTruthy();
    });
  });

  describe('CustomerPersona', () => {
    it('renders persona card', async () => {
      const { CustomerPersona } = await import('@/components/validator/report/CustomerPersona');
      const { container } = render(
        React.createElement(CustomerPersona, {
          persona: { name: 'Alex', role: 'CTO', context: 'Series A startup' },
          without: 'Weeks of manual research',
          with: 'Automated validation in minutes',
          timeSaved: '40 hours/month',
        })
      );
      expect(container.innerHTML).toBeTruthy();
    });
  });

  describe('CompetitorMatrix', () => {
    it('renders with competitors', async () => {
      const { CompetitorMatrix } = await import('@/components/validator/report/CompetitorMatrix');
      const { container } = render(
        React.createElement(CompetitorMatrix, {
          competitors: [
            { name: 'Competitor A', threat: 'high', description: 'Market leader', position: { x: 80, y: 60 } },
            { name: 'Competitor B', threat: 'low', description: 'Niche player', position: { x: 30, y: 40 } },
          ],
          yourPosition: { x: 70, y: 80 },
          yourEdge: 'AI-first approach',
          axes: { x: 'Price', y: 'Quality' },
        })
      );
      expect(container.innerHTML).toBeTruthy();
    });

    it('handles empty competitors', async () => {
      const { CompetitorMatrix } = await import('@/components/validator/report/CompetitorMatrix');
      const { container } = render(
        React.createElement(CompetitorMatrix, {
          competitors: [],
          yourPosition: { x: 50, y: 50 },
          yourEdge: '',
          axes: { x: 'X', y: 'Y' },
        })
      );
      expect(container.innerHTML).toBeTruthy();
    });
  });

  describe('RiskHeatmap', () => {
    it('renders risks with severity levels', async () => {
      const { RiskHeatmap } = await import('@/components/validator/report/RiskHeatmap');
      const { container } = render(
        React.createElement(RiskHeatmap, {
          risks: [
            {
              assumption: 'Market demand exists',
              ifWrong: 'No customers',
              severity: 'fatal',
              impact: 'high',
              probability: 'low',
              howToTest: 'Customer interviews',
            },
            {
              assumption: 'Tech is feasible',
              ifWrong: 'Delayed launch',
              severity: 'risky',
              impact: 'high',
              probability: 'low',
              howToTest: 'Prototype sprint',
            },
          ],
        })
      );
      expect(container.innerHTML).toBeTruthy();
    });

    it('handles empty risks array', async () => {
      const { RiskHeatmap } = await import('@/components/validator/report/RiskHeatmap');
      const { container } = render(
        React.createElement(RiskHeatmap, { risks: [] })
      );
      expect(container.innerHTML).toBeTruthy();
    });
  });

  describe('MVPScope', () => {
    it('renders all MVP sections', async () => {
      const { MVPScope } = await import('@/components/validator/report/MVPScope');
      render(
        React.createElement(MVPScope, {
          oneLiner: 'AI-powered validation platform',
          build: ['Core engine', 'Report UI', 'Chat interface'],
          buy: ['Auth (Supabase)', 'Hosting (Vercel)'],
          skipForNow: ['Mobile app', 'Enterprise features'],
          testsAssumption: 'Founders will pay for validation',
          successMetric: '50 paying users in 3 months',
          timelineWeeks: 6,
        })
      );
      expect(screen.getByText(/AI-powered validation platform/)).toBeTruthy();
    });
  });

  describe('NextStepsTimeline', () => {
    it('renders timeline steps', async () => {
      const { NextStepsTimeline } = await import('@/components/validator/report/NextStepsTimeline');
      const { container } = render(
        React.createElement(NextStepsTimeline, {
          steps: [
            { action: 'Customer interviews', timeframe: 'week_1', effort: 'medium' },
            { action: 'Build MVP', timeframe: 'month_1', effort: 'high' },
            { action: 'Launch beta', timeframe: 'quarter_1', effort: 'high' },
          ],
        })
      );
      expect(container.innerHTML).toBeTruthy();
    });

    it('handles empty steps', async () => {
      const { NextStepsTimeline } = await import('@/components/validator/report/NextStepsTimeline');
      const { container } = render(
        React.createElement(NextStepsTimeline, { steps: [] })
      );
      expect(container.innerHTML).toBeTruthy();
    });
  });

  describe('RevenueModelDash', () => {
    it('renders revenue model with metrics', async () => {
      const { RevenueModelDash } = await import('@/components/validator/report/RevenueModelDash');
      const { container } = render(
        React.createElement(RevenueModelDash, {
          recommended: 'SaaS Subscription',
          description: 'Monthly recurring revenue model',
          metrics: [
            { label: 'CAC', value: '$50', explanation: 'Customer acquisition cost' },
            { label: 'LTV', value: '$600', explanation: 'Lifetime value' },
            { label: 'LTV:CAC', value: '12x', explanation: 'Target > 3x' },
          ],
          alternatives: [
            { name: 'Freemium', pros: ['Low friction'], cons: ['Lower ARPU'] },
          ],
        })
      );
      expect(container.innerHTML).toBeTruthy();
    });
  });

  describe('TeamPlanCards', () => {
    it('renders team plan with hires', async () => {
      const { TeamPlanCards } = await import('@/components/validator/report/TeamPlanCards');
      const { container } = render(
        React.createElement(TeamPlanCards, {
          monthlyBurn: 15000,
          burnComparison: 'vs $50k typical seed-stage burn',
          hires: [
            { priority: 1, role: 'Full-stack developer', costPerMonth: 8000, description: 'Build core product' },
            { priority: 2, role: 'Growth marketer', costPerMonth: 5000, description: 'Acquire early users' },
          ],
          gaps: ['Technical co-founder', 'Sales experience'],
        })
      );
      expect(container.innerHTML).toBeTruthy();
    });
  });

  describe('KeyQuestionsCards', () => {
    it('renders questions with severity', async () => {
      const { KeyQuestionsCards } = await import('@/components/validator/report/KeyQuestionsCards');
      const { container } = render(
        React.createElement(KeyQuestionsCards, {
          questions: [
            {
              question: 'Will founders pay for automated validation?',
              severity: 'fatal',
              why: 'Core business assumption',
              howToTest: 'Run a pre-order campaign',
            },
            {
              question: 'Can AI quality match manual reports?',
              severity: 'important',
              why: 'User retention depends on quality',
              howToTest: 'A/B test with beta users',
            },
          ],
        })
      );
      expect(container.innerHTML).toBeTruthy();
    });

    it('handles empty questions', async () => {
      const { KeyQuestionsCards } = await import('@/components/validator/report/KeyQuestionsCards');
      const { container } = render(
        React.createElement(KeyQuestionsCards, { questions: [] })
      );
      expect(container.innerHTML).toBeTruthy();
    });
  });

  describe('Shared Components', () => {
    it('SectionShell renders with children', async () => {
      const { SectionShell } = await import('@/components/validator/report/shared/SectionShell');
      render(
        React.createElement(SectionShell, {
          id: 'test',
          number: 1,
          title: 'Test Section',
          agent: 'Test',
          children: React.createElement('p', null, 'Test content'),
        })
      );
      expect(screen.getByText('Test Section')).toBeTruthy();
      expect(screen.getByText('Test content')).toBeTruthy();
    });

    it('StickyScoreBar renders', async () => {
      const { StickyScoreBar } = await import('@/components/validator/report/shared/StickyScoreBar');
      const { container } = render(
        React.createElement(StickyScoreBar, {
          score: 72,
          signal: 'caution',
          metrics: [{ label: 'TAM', value: '$12B' }],
          visible: true,
        })
      );
      expect(container.innerHTML).toBeTruthy();
    });
  });
});
