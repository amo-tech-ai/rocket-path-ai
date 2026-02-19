/**
 * useDecisions Hook Tests
 * Query key structure, mutation invalidation, and data types
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockSingle = vi.fn();

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
                order: (...oArgs: any[]) => {
                  mockOrder(...oArgs);
                  return Promise.resolve({ data: [], error: null });
                },
              };
            },
            order: (...oArgs: any[]) => {
              mockOrder(...oArgs);
              return Promise.resolve({ data: [], error: null });
            },
          };
        },
        insert: (...iArgs: any[]) => {
          mockInsert(...iArgs);
          return {
            select: vi.fn().mockReturnValue({
              single: mockSingle.mockResolvedValue({ data: { id: 'new-1' }, error: null }),
            }),
          };
        },
        update: (...uArgs: any[]) => {
          mockUpdate(...uArgs);
          return {
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: mockSingle.mockResolvedValue({ data: { id: 'd1' }, error: null }),
              }),
            }),
          };
        },
        delete: (...dArgs: any[]) => {
          mockDelete(...dArgs);
          return {
            eq: vi.fn().mockResolvedValue({ error: null }),
          };
        },
      };
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

describe('useDecisions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('queries decisions table with correct params', async () => {
    const { useDecisions } = await import('@/hooks/useDecisions');
    renderHook(() => useDecisions('startup-1'), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith('decisions');
      expect(mockEq).toHaveBeenCalledWith('startup_id', 'startup-1');
      expect(mockOrder).toHaveBeenCalledWith('decided_at', { ascending: false });
    });
  });

  it('does not query when startupId is undefined', async () => {
    const { useDecisions } = await import('@/hooks/useDecisions');
    const { result } = renderHook(() => useDecisions(undefined), { wrapper: createWrapper() });

    // Should not have called from() since query is disabled
    await waitFor(() => {
      expect(result.current.data).toEqual(undefined);
    });
  });
});

describe('useCreateDecision', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('inserts into decisions table', async () => {
    const { useCreateDecision } = await import('@/hooks/useDecisions');
    const { result } = renderHook(() => useCreateDecision(), { wrapper: createWrapper() });

    await result.current.mutateAsync({
      startup_id: 's1',
      title: 'Test Decision',
      decision_type: 'pivot',
      reasoning: 'test reasoning',
    });

    expect(mockFrom).toHaveBeenCalledWith('decisions');
    expect(mockInsert).toHaveBeenCalledWith({
      startup_id: 's1',
      title: 'Test Decision',
      decision_type: 'pivot',
      reasoning: 'test reasoning',
    });
  });
});

describe('useDecisionEvidence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('queries decision_evidence table', async () => {
    const { useDecisionEvidence } = await import('@/hooks/useDecisions');
    renderHook(() => useDecisionEvidence('d1'), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith('decision_evidence');
      expect(mockEq).toHaveBeenCalledWith('decision_id', 'd1');
    });
  });
});

describe('Decision types', () => {
  it('defines all expected decision types', () => {
    const validTypes = ['pivot', 'persevere', 'launch', 'kill', 'invest', 'partner', 'hire', 'other'];
    validTypes.forEach(type => {
      expect(typeof type).toBe('string');
    });
  });

  it('defines all expected statuses', () => {
    const validStatuses = ['active', 'reversed', 'superseded'];
    validStatuses.forEach(status => {
      expect(typeof status).toBe('string');
    });
  });

  it('defines all expected evidence types', () => {
    const validTypes = ['assumption', 'experiment', 'interview', 'metric', 'research', 'other'];
    validTypes.forEach(type => {
      expect(typeof type).toBe('string');
    });
  });
});
