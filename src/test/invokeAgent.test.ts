/**
 * Invoke Agent Tests
 * Unit tests for edge function invocation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthError } from '@supabase/supabase-js';
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
    // Create a proper AuthError instance
    const authError = new AuthError('no session', 401, 'session_not_found');
    vi.mocked(supabase.auth.refreshSession).mockResolvedValue({
      data: { session: null, user: null },
      error: authError,
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
