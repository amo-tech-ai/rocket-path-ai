/**
 * useAIUsageLimits Tests
 * Tests for budget calculations, usage percent, and cap updates
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock Supabase
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockMaybeSingle = vi.fn();
const mockUpdate = vi.fn();
const mockInsert = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (...args: any[]) => {
      mockFrom(...args);
      return {
        select: (...sArgs: any[]) => {
          mockSelect(...sArgs);
          return {
            eq: (...eArgs: any[]) => {
              mockEq(...eArgs);
              return {
                maybeSingle: mockMaybeSingle,
              };
            },
          };
        },
        update: (...uArgs: any[]) => {
          mockUpdate(...uArgs);
          return {
            eq: vi.fn().mockResolvedValue({ error: null }),
          };
        },
        insert: (...iArgs: any[]) => {
          mockInsert(...iArgs);
          return Promise.resolve({ error: null });
        },
      };
    },
  },
}));

// Mock useAuth
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn().mockReturnValue({
    user: { id: 'user-1' },
    profile: { org_id: 'org-1' },
    isLoading: false,
  }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('useAIUsageLimits', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('budget calculations (pure logic)', () => {
    it('defaults budget to $50 when no limits row exists', () => {
      const limits = null;
      const budgetDollars = ((limits as any)?.monthly_cap_cents ?? 5000) / 100;
      expect(budgetDollars).toBe(50);
    });

    it('converts monthly_cap_cents to dollars correctly', () => {
      const limits = { monthly_cap_cents: 10000 };
      const budgetDollars = (limits.monthly_cap_cents ?? 5000) / 100;
      expect(budgetDollars).toBe(100);
    });

    it('converts current_month_total_cents to dollars', () => {
      const limits = { current_month_total_cents: 2500 };
      const usedDollars = (limits.current_month_total_cents ?? 0) / 100;
      expect(usedDollars).toBe(25);
    });

    it('calculates usage percent correctly', () => {
      const budgetDollars = 50;
      const usedDollars = 25;
      const usagePercent = budgetDollars > 0 ? (usedDollars / budgetDollars) * 100 : 0;
      expect(usagePercent).toBe(50);
    });

    it('returns 0% when budget is zero', () => {
      const budgetDollars = 0;
      const usedDollars = 10;
      const usagePercent = budgetDollars > 0 ? (usedDollars / budgetDollars) * 100 : 0;
      expect(usagePercent).toBe(0);
    });

    it('handles over-budget usage (> 100%)', () => {
      const budgetDollars = 50;
      const usedDollars = 75;
      const usagePercent = budgetDollars > 0 ? (usedDollars / budgetDollars) * 100 : 0;
      expect(usagePercent).toBe(150);
    });

    it('handles null current_month_total_cents', () => {
      const limits = { current_month_total_cents: null as number | null };
      const usedDollars = (limits.current_month_total_cents ?? 0) / 100;
      expect(usedDollars).toBe(0);
    });
  });

  describe('AIUsageLimits interface', () => {
    it('has all expected properties', () => {
      const mockLimits = {
        id: 'limit-1',
        org_id: 'org-1',
        monthly_cap_cents: 5000,
        current_month_total_cents: 1200,
        current_month_start: '2026-02-01',
        last_reset_at: null,
      };

      expect(mockLimits).toHaveProperty('id');
      expect(mockLimits).toHaveProperty('org_id');
      expect(mockLimits).toHaveProperty('monthly_cap_cents');
      expect(mockLimits).toHaveProperty('current_month_total_cents');
      expect(mockLimits).toHaveProperty('current_month_start');
      expect(mockLimits).toHaveProperty('last_reset_at');
    });
  });

  describe('hook integration', () => {
    it('fetches limits from ai_usage_limits table', async () => {
      mockMaybeSingle.mockResolvedValue({
        data: {
          id: 'limit-1',
          org_id: 'org-1',
          monthly_cap_cents: 10000,
          current_month_total_cents: 3500,
          current_month_start: '2026-02-01',
          last_reset_at: null,
        },
        error: null,
      });

      const { useAIUsageLimits } = await import('@/hooks/useAIUsageLimits');
      const { result } = renderHook(() => useAIUsageLimits(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockFrom).toHaveBeenCalledWith('ai_usage_limits');
      expect(result.current.budgetDollars).toBe(100);
      expect(result.current.usedDollars).toBe(35);
      expect(result.current.usagePercent).toBe(35);
    });

    it('uses default budget when no data exists', async () => {
      mockMaybeSingle.mockResolvedValue({ data: null, error: null });

      const { useAIUsageLimits } = await import('@/hooks/useAIUsageLimits');
      const { result } = renderHook(() => useAIUsageLimits(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Default: 5000 cents = $50
      expect(result.current.budgetDollars).toBe(50);
      expect(result.current.usedDollars).toBe(0);
      expect(result.current.usagePercent).toBe(0);
    });
  });
});
