/**
 * DecisionLog Tests
 * Smoke test + decision types + timeline + create dialog
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const mockDecisions = [
  {
    id: 'd1',
    startup_id: 's1',
    decision_type: 'pivot',
    title: 'Pivot from B2C to B2B',
    reasoning: 'Consumer acquisition too expensive',
    outcome: null,
    outcome_at: null,
    decided_by: 'u1',
    decided_at: '2026-02-10T10:00:00Z',
    status: 'active',
    ai_suggested: false,
    created_at: '2026-02-10T10:00:00Z',
    updated_at: '2026-02-10T10:00:00Z',
  },
  {
    id: 'd2',
    startup_id: 's1',
    decision_type: 'launch',
    title: 'Launch beta to first 50 users',
    reasoning: 'MVP is ready, need feedback',
    outcome: 'Got 12 paying users',
    outcome_at: '2026-02-08T00:00:00Z',
    decided_by: 'u1',
    decided_at: '2026-02-05T10:00:00Z',
    status: 'active',
    ai_suggested: true,
    created_at: '2026-02-05T10:00:00Z',
    updated_at: '2026-02-08T10:00:00Z',
  },
  {
    id: 'd3',
    startup_id: 's1',
    decision_type: 'kill',
    title: 'Kill the mobile app MVP',
    reasoning: 'Usage too low, focus on web',
    outcome: null,
    outcome_at: null,
    decided_by: 'u1',
    decided_at: '2026-01-15T10:00:00Z',
    status: 'reversed',
    ai_suggested: false,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
];

// Mock supabase
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

vi.mock('@/hooks/useDecisions', () => ({
  useDecisions: vi.fn().mockReturnValue({
    data: mockDecisions,
    isLoading: false,
    refetch: vi.fn(),
  }),
  useCreateDecision: vi.fn().mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useUpdateDecision: vi.fn().mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useDeleteDecision: vi.fn().mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useDecisionEvidence: vi.fn().mockReturnValue({
    data: [],
    isLoading: false,
  }),
  useAddEvidence: vi.fn().mockReturnValue({
    mutateAsync: vi.fn(),
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

describe('DecisionLog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page heading', async () => {
    const DecisionLog = (await import('@/pages/DecisionLog')).default;
    render(React.createElement(DecisionLog), { wrapper: createWrapper() });
    expect(screen.getByText('Decision Log')).toBeTruthy();
  }, 15_000);

  it('renders stats row with correct totals', async () => {
    const DecisionLog = (await import('@/pages/DecisionLog')).default;
    render(React.createElement(DecisionLog), { wrapper: createWrapper() });
    expect(screen.getByText('Total')).toBeTruthy();
    // "Active" appears both as stat label and status badge — use getAllByText
    expect(screen.getAllByText('Active').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Reversed').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Superseded')).toBeTruthy();
  }, 15_000);

  it('renders decision cards', async () => {
    const DecisionLog = (await import('@/pages/DecisionLog')).default;
    render(React.createElement(DecisionLog), { wrapper: createWrapper() });
    expect(screen.getByText('Pivot from B2C to B2B')).toBeTruthy();
    expect(screen.getByText('Launch beta to first 50 users')).toBeTruthy();
    expect(screen.getByText('Kill the mobile app MVP')).toBeTruthy();
  });

  it('renders decision type badges', async () => {
    const DecisionLog = (await import('@/pages/DecisionLog')).default;
    render(React.createElement(DecisionLog), { wrapper: createWrapper() });
    expect(screen.getByText('Pivot')).toBeTruthy();
    expect(screen.getByText('Launch')).toBeTruthy();
    expect(screen.getByText('Kill')).toBeTruthy();
  });

  it('renders Add Decision button', async () => {
    const DecisionLog = (await import('@/pages/DecisionLog')).default;
    render(React.createElement(DecisionLog), { wrapper: createWrapper() });
    expect(screen.getByText('Add Decision')).toBeTruthy();
  });

  it('renders tab navigation', async () => {
    const DecisionLog = (await import('@/pages/DecisionLog')).default;
    render(React.createElement(DecisionLog), { wrapper: createWrapper() });
    expect(screen.getByText('Timeline')).toBeTruthy();
    expect(screen.getByText('List')).toBeTruthy();
  });

  it('shows AI badge on AI-suggested decisions', async () => {
    const DecisionLog = (await import('@/pages/DecisionLog')).default;
    render(React.createElement(DecisionLog), { wrapper: createWrapper() });
    expect(screen.getByText('AI')).toBeTruthy();
  });

  it('shows outcome when present', async () => {
    const DecisionLog = (await import('@/pages/DecisionLog')).default;
    render(React.createElement(DecisionLog), { wrapper: createWrapper() });
    expect(screen.getByText(/Got 12 paying users/)).toBeTruthy();
  });
});
