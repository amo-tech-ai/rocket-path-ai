/**
 * AssumptionBoard Tests
 * Smoke test + kanban columns + stats row + edit dialog
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const mockAssumptions = [
  {
    id: 'a1',
    startup_id: 's1',
    source_block: 'problem',
    statement: 'Users need faster onboarding',
    impact_score: 8,
    uncertainty_score: 7,
    priority_score: 56,
    status: 'untested',
    risk_score: null,
    evidence_count: 0,
    notes: null,
    ai_extracted: false,
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'a2',
    startup_id: 's1',
    source_block: 'solution',
    statement: 'AI chat reduces support tickets',
    impact_score: 6,
    uncertainty_score: 5,
    priority_score: 30,
    status: 'testing',
    risk_score: null,
    evidence_count: 2,
    notes: 'Testing with beta users',
    ai_extracted: true,
    created_at: '2026-02-02T00:00:00Z',
  },
  {
    id: 'a3',
    startup_id: 's1',
    source_block: 'revenue_streams',
    statement: 'Customers will pay $29/mo',
    impact_score: 9,
    uncertainty_score: 3,
    priority_score: 27,
    status: 'validated',
    risk_score: null,
    evidence_count: 5,
    notes: null,
    ai_extracted: false,
    created_at: '2026-02-03T00:00:00Z',
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

vi.mock('@/hooks/useExperiments', () => ({
  useAssumptions: vi.fn().mockReturnValue({
    data: mockAssumptions,
    isLoading: false,
    refetch: vi.fn(),
  }),
  useCreateAssumption: vi.fn().mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useUpdateAssumption: vi.fn().mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useDeleteAssumption: vi.fn().mockReturnValue({
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

describe('AssumptionBoard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page heading', async () => {
    const AssumptionBoard = (await import('@/pages/AssumptionBoard')).default;
    render(React.createElement(AssumptionBoard), { wrapper: createWrapper() });
    expect(screen.getByText('Risk & Assumption Board')).toBeTruthy();
  }, 15_000);

  it('renders kanban column headers', async () => {
    const AssumptionBoard = (await import('@/pages/AssumptionBoard')).default;
    render(React.createElement(AssumptionBoard), { wrapper: createWrapper() });
    // Status labels appear in column headers and on card quick-status buttons
    expect(screen.getAllByText('Untested').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Testing').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Validated').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Invalidated').length).toBeGreaterThanOrEqual(1);
  });

  it('renders stats row with correct totals', async () => {
    const AssumptionBoard = (await import('@/pages/AssumptionBoard')).default;
    render(React.createElement(AssumptionBoard), { wrapper: createWrapper() });
    // Total count
    expect(screen.getByText('3')).toBeTruthy();
    // "Total" label
    expect(screen.getByText('Total')).toBeTruthy();
  });

  it('renders assumption cards', async () => {
    const AssumptionBoard = (await import('@/pages/AssumptionBoard')).default;
    render(React.createElement(AssumptionBoard), { wrapper: createWrapper() });
    expect(screen.getByText('Users need faster onboarding')).toBeTruthy();
    expect(screen.getByText('AI chat reduces support tickets')).toBeTruthy();
    expect(screen.getByText('Customers will pay $29/mo')).toBeTruthy();
  });

  it('renders Add Assumption button', async () => {
    const AssumptionBoard = (await import('@/pages/AssumptionBoard')).default;
    render(React.createElement(AssumptionBoard), { wrapper: createWrapper() });
    expect(screen.getByText('Add Assumption')).toBeTruthy();
  });

  it('renders tab navigation', async () => {
    const AssumptionBoard = (await import('@/pages/AssumptionBoard')).default;
    render(React.createElement(AssumptionBoard), { wrapper: createWrapper() });
    expect(screen.getByText('Board')).toBeTruthy();
    expect(screen.getByText('Risk Matrix')).toBeTruthy();
    expect(screen.getByText('List')).toBeTruthy();
  });
});
