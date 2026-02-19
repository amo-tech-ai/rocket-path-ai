/**
 * WeeklyReview Tests
 * Smoke test + stats + cards + AI generate button
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const mockReviews = [
  {
    id: 'r1',
    startup_id: 's1',
    week_start: '2026-02-10',
    week_end: '2026-02-16',
    summary: 'Great week with 3 customer interviews completed.',
    key_learnings: ['B2B users prefer self-serve', 'Pricing needs work'],
    priorities_next_week: ['Ship MVP v2', 'Run pricing experiment'],
    metrics: null,
    assumptions_tested: 2,
    experiments_run: 1,
    decisions_made: 1,
    tasks_completed: 8,
    health_score_start: 65,
    health_score_end: 72,
    ai_generated: true,
    edited_by_user: false,
    created_by: 'u1',
    created_at: '2026-02-16T10:00:00Z',
    updated_at: '2026-02-16T10:00:00Z',
  },
  {
    id: 'r2',
    startup_id: 's1',
    week_start: '2026-02-03',
    week_end: '2026-02-09',
    summary: 'Focused on validation and market research.',
    key_learnings: ['Market is larger than expected'],
    priorities_next_week: ['Customer interviews'],
    metrics: null,
    assumptions_tested: 1,
    experiments_run: 0,
    decisions_made: 2,
    tasks_completed: 5,
    health_score_start: 60,
    health_score_end: 65,
    ai_generated: false,
    edited_by_user: true,
    created_by: 'u1',
    created_at: '2026-02-09T10:00:00Z',
    updated_at: '2026-02-09T12:00:00Z',
  },
];

vi.mock('@/integrations/supabase/client', () => {
  const chainable = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    then: (resolve: any) => resolve({ data: [], error: null }),
  };
  return {
    supabase: {
      from: vi.fn().mockReturnValue(chainable),
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }),
        onAuthStateChange: vi.fn().mockReturnValue({
          data: { subscription: { unsubscribe: vi.fn() } },
        }),
      },
      functions: {
        invoke: vi.fn().mockResolvedValue({ data: null, error: null }),
      },
    },
  };
});

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn().mockReturnValue({
    user: { id: 'user-1' },
    profile: { org_id: 'org-1' },
    isLoading: false,
  }),
}));

vi.mock('@/hooks/useNotifications', () => ({
  useNotifications: vi.fn().mockReturnValue({
    notifications: [],
    unreadCount: 0,
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
    showBudgetAlert: vi.fn(),
  }),
}));

vi.mock('@/hooks/useDashboardData', () => ({
  useStartup: vi.fn().mockReturnValue({
    data: { id: 's1', name: 'Test Startup' },
    isLoading: false,
  }),
}));

vi.mock('@/hooks/useWeeklyReviews', () => ({
  useWeeklyReviews: vi.fn().mockReturnValue({
    data: mockReviews,
    isLoading: false,
    refetch: vi.fn(),
  }),
  useCreateWeeklyReview: vi.fn().mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useUpdateWeeklyReview: vi.fn().mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useDeleteWeeklyReview: vi.fn().mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useGenerateWeeklyReview: vi.fn().mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue({
      success: true,
      review: { ...mockReviews[0], health_score_end: 75 },
      coaching: { headline: 'Good momentum!', observation: '', suggestion: '', question: '' },
      priorities_detail: [],
      metrics_summary: {},
      is_update: false,
    }),
    isPending: false,
  }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(BrowserRouter, null, children)
    );
  };
}

describe('WeeklyReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page heading', async () => {
    const WeeklyReview = (await import('@/pages/WeeklyReview')).default;
    render(React.createElement(WeeklyReview), { wrapper: createWrapper() });
    // "Weekly Review" appears in both nav sidebar and page heading
    expect(screen.getAllByText('Weekly Review').length).toBeGreaterThanOrEqual(1);
  }, 15_000);

  it('renders stats row', async () => {
    const WeeklyReview = (await import('@/pages/WeeklyReview')).default;
    render(React.createElement(WeeklyReview), { wrapper: createWrapper() });
    expect(screen.getByText('Reviews')).toBeTruthy();
    expect(screen.getByText('Latest Score')).toBeTruthy();
    expect(screen.getByText('Avg Score')).toBeTruthy();
    expect(screen.getByText('Tasks Done')).toBeTruthy();
  }, 15_000);

  it('renders review cards with summaries', async () => {
    const WeeklyReview = (await import('@/pages/WeeklyReview')).default;
    render(React.createElement(WeeklyReview), { wrapper: createWrapper() });
    expect(screen.getByText(/Great week with 3 customer interviews/)).toBeTruthy();
    expect(screen.getByText(/Focused on validation and market research/)).toBeTruthy();
  });

  it('renders AI Review button', async () => {
    const WeeklyReview = (await import('@/pages/WeeklyReview')).default;
    render(React.createElement(WeeklyReview), { wrapper: createWrapper() });
    expect(screen.getByText('AI Review')).toBeTruthy();
  });

  it('renders Manual button', async () => {
    const WeeklyReview = (await import('@/pages/WeeklyReview')).default;
    render(React.createElement(WeeklyReview), { wrapper: createWrapper() });
    expect(screen.getByText('Manual')).toBeTruthy();
  });

  it('renders tab navigation', async () => {
    const WeeklyReview = (await import('@/pages/WeeklyReview')).default;
    render(React.createElement(WeeklyReview), { wrapper: createWrapper() });
    expect(screen.getByText('Cards')).toBeTruthy();
    expect(screen.getByText('Table')).toBeTruthy();
  });

  it('shows AI badge on AI-generated reviews', async () => {
    const WeeklyReview = (await import('@/pages/WeeklyReview')).default;
    render(React.createElement(WeeklyReview), { wrapper: createWrapper() });
    expect(screen.getAllByText('AI').length).toBeGreaterThanOrEqual(1);
  });

  it('shows Edited badge on user-edited reviews', async () => {
    const WeeklyReview = (await import('@/pages/WeeklyReview')).default;
    render(React.createElement(WeeklyReview), { wrapper: createWrapper() });
    expect(screen.getByText('Edited')).toBeTruthy();
  });
});
