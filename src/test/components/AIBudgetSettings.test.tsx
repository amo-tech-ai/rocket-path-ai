/**
 * AIBudgetSettings Tests
 * Smoke test + verification of budget input, alert threshold, auto-disable toggle
 */

import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Polyfill ResizeObserver for jsdom (radix-ui Slider needs it)
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
});

// Mock supabase
const mockFrom = vi.fn();
vi.mock('@/integrations/supabase/client', () => {
  const chainable = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    then: (resolve: any) => resolve({ data: [], error: null }),
  };
  return {
    supabase: {
      from: (...args: any[]) => { mockFrom(...args); return chainable; },
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
    profile: { org_id: 'org-1', preferences: {} },
    isLoading: false,
  }),
}));

vi.mock('@/hooks/useAIUsageLimits', () => ({
  useAIUsageLimits: vi.fn().mockReturnValue({
    limits: { monthly_cap_cents: 10000 },
    budgetDollars: 100,
    usedDollars: 25,
    usagePercent: 25,
    updateCapCents: vi.fn().mockResolvedValue(undefined),
    isUpdating: false,
    isLoading: false,
  }),
}));

vi.mock('@/hooks/useNotifications', () => ({
  useNotifications: vi.fn().mockReturnValue({
    showBudgetAlert: vi.fn(),
  }),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }: any, ref: any) =>
      React.createElement('div', { ...props, ref }, children)),
  },
  AnimatePresence: ({ children }: any) => children,
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

describe('AIBudgetSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', async () => {
    const { AIBudgetSettings } = await import('@/components/settings/AIBudgetSettings');
    const { container } = render(
      React.createElement(AIBudgetSettings),
      { wrapper: createWrapper() },
    );
    expect(container.innerHTML).toBeTruthy();
  }, 15_000);

  it('shows AI Budget & Usage heading', async () => {
    const { AIBudgetSettings } = await import('@/components/settings/AIBudgetSettings');
    render(
      React.createElement(AIBudgetSettings),
      { wrapper: createWrapper() },
    );
    expect(screen.getByText('AI Budget & Usage')).toBeTruthy();
  });

  it('renders budget input fields', async () => {
    const { AIBudgetSettings } = await import('@/components/settings/AIBudgetSettings');
    render(
      React.createElement(AIBudgetSettings),
      { wrapper: createWrapper() },
    );
    expect(screen.getByLabelText('Monthly Budget ($)')).toBeTruthy();
    expect(screen.getByLabelText('Daily Limit ($)')).toBeTruthy();
  });

  it('renders alert and auto-disable controls', async () => {
    const { AIBudgetSettings } = await import('@/components/settings/AIBudgetSettings');
    render(
      React.createElement(AIBudgetSettings),
      { wrapper: createWrapper() },
    );
    expect(screen.getByText('Budget Alerts')).toBeTruthy();
    expect(screen.getByText('Auto-disable on Limit')).toBeTruthy();
  });

  it('renders save button', async () => {
    const { AIBudgetSettings } = await import('@/components/settings/AIBudgetSettings');
    render(
      React.createElement(AIBudgetSettings),
      { wrapper: createWrapper() },
    );
    expect(screen.getByText('Save Settings')).toBeTruthy();
  });
});
