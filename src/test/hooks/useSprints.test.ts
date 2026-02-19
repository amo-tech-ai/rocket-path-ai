/**
 * useSprints Hook Tests
 * Tests for campaign/sprint CRUD hooks
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock data
const mockCampaigns = [
  { id: 'c1', startup_id: 's1', name: '90-Day Plan', status: 'active', start_date: null, end_date: null, created_at: '2026-01-01', updated_at: '2026-01-01' },
];

const mockSprintRows = [
  { id: 'sp1', campaign_id: 'c1', sprint_number: 1, name: 'Validate problem', status: 'active', start_date: null, end_date: null, created_at: '2026-01-01', updated_at: '2026-01-01', cards: { plan: { hypothesis: 'Users want X' } } },
];

// Supabase mock with configurable responses
let mockSelectData: unknown[] = [];
let mockInsertData: unknown = null;
let mockUpdateError: Error | null = null;

const mockChainable = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn().mockImplementation(function (this: typeof mockChainable) {
    return { ...this, then: (resolve: (value: { data: unknown[]; error: null }) => void) => resolve({ data: mockSelectData, error: null }) };
  }),
  insert: vi.fn().mockImplementation(function () {
    return {
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: mockInsertData, error: null }),
      }),
    };
  }),
  update: vi.fn().mockImplementation(function () {
    return {
      eq: vi.fn().mockResolvedValue({ error: mockUpdateError }),
    };
  }),
  single: vi.fn().mockResolvedValue({ data: null, error: null }),
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnValue(mockChainable),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('useSprints hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelectData = [];
    mockInsertData = null;
    mockUpdateError = null;
  });

  it('useCampaigns fetches campaigns for startup', async () => {
    mockSelectData = mockCampaigns;
    const { useCampaigns } = await import('@/hooks/useSprints');

    const { result } = renderHook(() => useCampaigns('s1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data![0].name).toBe('90-Day Plan');
  });

  it('useCampaigns returns empty when no startupId', async () => {
    const { useCampaigns } = await import('@/hooks/useSprints');

    const { result } = renderHook(() => useCampaigns(undefined), { wrapper: createWrapper() });

    // Query is disabled, should not fetch
    expect(result.current.data).toBeUndefined();
    expect(result.current.isFetching).toBe(false);
  });

  it('useSprints fetches sprints for campaign', async () => {
    mockSelectData = mockSprintRows;
    const { useSprints } = await import('@/hooks/useSprints');

    const { result } = renderHook(() => useSprints('c1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data![0].sprint_number).toBe(1);
    // PDCA unpacking: plan.hypothesis exists → pdca_step should be 'do'
    expect(result.current.data![0].pdca_step).toBe('do');
  });

  it('useCreateSprint inserts and returns unpacked sprint', async () => {
    mockInsertData = { ...mockSprintRows[0], cards: {} };
    const { useCreateSprint } = await import('@/hooks/useSprints');

    const { result } = renderHook(() => useCreateSprint(), { wrapper: createWrapper() });

    const sprint = await result.current.mutateAsync({
      campaign_id: 'c1',
      sprint_number: 2,
      purpose: 'Test WTP',
    });

    expect(sprint.sprint_number).toBe(1);
    expect(sprint.id).toBe('sp1');
  });

  it('useCompleteSprint sets status to completed', async () => {
    const { useCompleteSprint } = await import('@/hooks/useSprints');

    const { result } = renderHook(() => useCompleteSprint(), { wrapper: createWrapper() });

    // Should not throw
    await result.current.mutateAsync('sp1');

    const { supabase } = await import('@/integrations/supabase/client');
    expect(supabase.from).toHaveBeenCalledWith('sprints');
  });
});
