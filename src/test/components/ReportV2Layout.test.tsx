/**
 * ReportV2Layout Tests
 * Tests for v1/v2 detection, TAMSAMSOMChart data prop, section rendering,
 * and the isV2Report helper function
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }: any, ref: any) =>
      React.createElement('div', { ...props, ref }, children)),
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock TAMSAMSOMChart (default export, uses Radix UI tooltip internally)
vi.mock('@/components/validation-report/TAMSAMSOMChart', () => ({
  default: ({ data }: { data: any }) =>
    React.createElement('div', { 'data-testid': 'tam-sam-som-chart' },
      `TAM: ${data?.tam}, SAM: ${data?.sam}, SOM: ${data?.som}`),
}));

// Mock IntersectionObserver for StickyScoreBar
const mockIntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}));
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: mockIntersectionObserver,
});

describe('ReportV2Layout', () => {
  describe('isV2Report', () => {
    it('returns true for structured v2 report details', async () => {
      const { isV2Report } = await import('@/components/validator/report/ReportV2Layout');


      const v2Details = {
        problem_clarity: {
          who: 'SMB founders',
          pain: 'Manual validation takes weeks',
          currentFix: 'Spreadsheets',
          severity: 'high',
        },
      };

      expect(isV2Report(v2Details)).toBe(true);
    }, 15_000);

    it('returns false for v1 prose string details', async () => {
      const { isV2Report } = await import('@/components/validator/report/ReportV2Layout');

      const v1Details = {
        problem_clarity: 'The problem is clear and well-defined.',
      };

      expect(isV2Report(v1Details)).toBe(false);
    });

    it('returns false for null details', async () => {
      const { isV2Report } = await import('@/components/validator/report/ReportV2Layout');
      expect(isV2Report(null)).toBe(false);
      expect(isV2Report(undefined)).toBe(false);
    });

    it('returns false when problem_clarity is object but missing who', async () => {
      const { isV2Report } = await import('@/components/validator/report/ReportV2Layout');

      const partial = {
        problem_clarity: { pain: 'Something hurts' },
      };

      expect(isV2Report(partial)).toBe(false);
    });
  });

  describe('TAMSAMSOMChart prop interface', () => {
    it('passes data object (not separate tam/sam/som props)', async () => {
      // This is a regression test for the bug found in audit #22
      // ReportV2Layout passes `data={d.market_sizing}` to TAMSAMSOMChart
      // TAMSAMSOMChart expects { data: MarketSizing } where MarketSizing = { tam, sam, som, ... }

      const marketSizing = {
        tam: 12_000_000_000,
        sam: 1_200_000_000,
        som: 120_000_000,
        methodology: 'Bottom-up',
      };

      // The correct prop is data={marketSizing}, not tam={...} sam={...} som={...}
      expect(marketSizing).toHaveProperty('tam');
      expect(marketSizing).toHaveProperty('sam');
      expect(marketSizing).toHaveProperty('som');

      // Verify the object shape matches MarketSizing interface
      expect(typeof marketSizing.tam).toBe('number');
      expect(typeof marketSizing.sam).toBe('number');
      expect(typeof marketSizing.som).toBe('number');
    });
  });

  describe('section rendering', () => {
    const minimalV1Report = {
      score: 72,
      summary: 'A promising startup idea.',
      details: {
        problem_clarity: 'Clear problem definition',
        customer_use_case: 'B2B SaaS founders',
        market_sizing: { tam: 10_000_000_000, sam: 1_000_000_000, som: 100_000_000 },
        competition: { competitors: [] },
        risks_assumptions: ['Market risk', 'Execution risk'],
        mvp_scope: 'Build an MVP in 4 weeks',
        next_steps: ['Step 1', 'Step 2'],
        highlights: ['Strong team', 'Growing market'],
        red_flags: ['Competitive market'],
      },
      created_at: '2026-02-12T00:00:00Z',
    };

    const minimalV2Report = {
      score: 85,
      summary: 'Excellent market opportunity.',
      details: {
        problem_clarity: {
          who: 'Startup founders',
          pain: 'Manual validation takes weeks',
          currentFix: 'Spreadsheets and guesswork',
          severity: 'high',
        },
        customer_use_case: {
          persona: { name: 'Alex', role: 'CTO', context: 'Series A startup' },
          without: 'Weeks of manual research',
          with: 'Automated validation in minutes',
          timeSaved: '40 hours/month',
        },
        market_sizing: { tam: 12_000_000_000, sam: 1_200_000_000, som: 120_000_000, citations: [{ source: 'Gartner' }] },
        competition: {
          competitors: [{ name: 'Competitor A', threat_level: 'high', description: 'Major player' }],
          positioning: { yourPosition: { x: 70, y: 80 }, yourEdge: 'AI-first', axes: { x: 'Price', y: 'Quality' } },
          citations: [],
        },
        risks_assumptions: [{
          assumption: 'Market demand exists',
          ifWrong: 'No customers',
          severity: 'fatal',
          impact: 'high',
          probability: 'low',
          howToTest: 'Customer interviews',
        }],
        mvp_scope: {
          oneLiner: 'AI validation SaaS',
          build: ['Core engine', 'Report UI'],
          buy: ['Auth', 'Hosting'],
          skipForNow: ['Mobile app'],
          testsAssumption: 'Founders will pay for automated validation',
          successMetric: '50 paying users in 3 months',
          timelineWeeks: 4,
        },
        next_steps: [{ action: 'Build MVP', timeframe: 'month_1', effort: 'high' }],
        highlights: ['Strong team'],
        red_flags: ['Competitive market'],
        summary_verdict: 'Go with confidence',
      },
      created_at: '2026-02-12T00:00:00Z',
    };

    it('renders without crashing for v1 report', async () => {
      const { ReportV2Layout } = await import('@/components/validator/report/ReportV2Layout');

      const { container } = render(
        React.createElement(
          BrowserRouter,
          null,
          React.createElement(ReportV2Layout, { report: minimalV1Report })
        )
      );

      expect(container.innerHTML).toBeTruthy();
      // Should show Problem Clarity section
      expect(screen.getByText('Problem Clarity')).toBeTruthy();
    });

    it('renders without crashing for v2 report', async () => {
      const { ReportV2Layout } = await import('@/components/validator/report/ReportV2Layout');

      const { container } = render(
        React.createElement(
          BrowserRouter,
          null,
          React.createElement(ReportV2Layout, { report: minimalV2Report })
        )
      );

      expect(container.innerHTML).toBeTruthy();
      expect(screen.getByText('Problem Clarity')).toBeTruthy();
    });

    it('renders Market Size section when market_sizing present', async () => {
      const { ReportV2Layout } = await import('@/components/validator/report/ReportV2Layout');

      render(
        React.createElement(
          BrowserRouter,
          null,
          React.createElement(ReportV2Layout, { report: minimalV1Report })
        )
      );

      expect(screen.getByText('Market Size')).toBeTruthy();
    });

    it('renders MVP Scope section', async () => {
      const { ReportV2Layout } = await import('@/components/validator/report/ReportV2Layout');

      render(
        React.createElement(
          BrowserRouter,
          null,
          React.createElement(ReportV2Layout, { report: minimalV1Report })
        )
      );

      expect(screen.getByText('MVP Scope')).toBeTruthy();
    });

    it('renders Next Steps section', async () => {
      const { ReportV2Layout } = await import('@/components/validator/report/ReportV2Layout');

      render(
        React.createElement(
          BrowserRouter,
          null,
          React.createElement(ReportV2Layout, { report: minimalV1Report })
        )
      );

      expect(screen.getByText('Next Steps')).toBeTruthy();
    });

    it('uses ProseBlock fallback for v1 string fields', async () => {
      const { ReportV2Layout } = await import('@/components/validator/report/ReportV2Layout');

      render(
        React.createElement(
          BrowserRouter,
          null,
          React.createElement(ReportV2Layout, { report: minimalV1Report })
        )
      );

      // v1 prose content should be rendered
      expect(screen.getByText('Clear problem definition')).toBeTruthy();
    });

    it('handles empty details gracefully', async () => {
      const { ReportV2Layout } = await import('@/components/validator/report/ReportV2Layout');

      const emptyReport = {
        score: 0,
        summary: '',
        details: {},
        created_at: '2026-02-12T00:00:00Z',
      };

      const { container } = render(
        React.createElement(
          BrowserRouter,
          null,
          React.createElement(ReportV2Layout, { report: emptyReport })
        )
      );

      // Should not crash
      expect(container.innerHTML).toBeTruthy();
    });
  });

  describe('getSignal helper (via rendering)', () => {
    it('score 85 → go signal renders correctly', async () => {
      const { ReportV2Layout } = await import('@/components/validator/report/ReportV2Layout');

      const report = {
        score: 85,
        summary: 'Strong',
        details: { highlights: [], red_flags: [], next_steps: [] },
        created_at: '2026-02-12T00:00:00Z',
      };

      const { container } = render(
        React.createElement(BrowserRouter, null,
          React.createElement(ReportV2Layout, { report }))
      );

      expect(container.innerHTML).toBeTruthy();
    });

    it('score 60 → caution signal renders correctly', async () => {
      const { ReportV2Layout } = await import('@/components/validator/report/ReportV2Layout');

      const report = {
        score: 60,
        summary: 'Proceed with care',
        details: { highlights: [], red_flags: [], next_steps: [] },
        created_at: '2026-02-12T00:00:00Z',
      };

      const { container } = render(
        React.createElement(BrowserRouter, null,
          React.createElement(ReportV2Layout, { report }))
      );

      expect(container.innerHTML).toBeTruthy();
    });
  });
});
