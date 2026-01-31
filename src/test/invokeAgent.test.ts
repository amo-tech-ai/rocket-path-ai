/**
 * Invoke Agent Tests
 * Unit tests for edge function invocation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { invokeAgent } from '../hooks/onboarding/invokeAgent';

// Mock Supabase
vi.mock('../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      refreshSession: vi.fn(),
    },
    functions: {
      invoke: vi.fn(),
    },
  },
}));

describe('invokeAgent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw when no session and refresh fails (real API path)', async () => {
    const { supabase } = await import('../integrations/supabase/client');
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    // When real API is forced and there is no session, refreshSession is called; mock it so destructuring doesn't throw
    vi.mocked(supabase.auth.refreshSession).mockResolvedValue({
      data: { session: null, user: null },
      error: { message: 'no session', name: 'AuthSessionMissing', status: 401 },
    });

    // With no session and refresh failing, invokeAgent throws (real API path)
    await expect(
      invokeAgent({
        action: 'enrich_context',
        session_id: 'test-session',
        description: 'Test description',
      })
    ).rejects.toThrow(/No active Supabase session|not authenticated/i);
  });

  it('should handle errors gracefully', async () => {
    const { supabase } = await import('../integrations/supabase/client');
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    // Mock should handle unknown actions
    await expect(
      invokeAgent({
        action: 'unknown_action',
        session_id: 'test-session',
      })
    ).rejects.toThrow();
  });
});
