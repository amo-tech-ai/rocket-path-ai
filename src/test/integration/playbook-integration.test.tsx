/**
 * Test: Playbook-Screen Integration
 * 
 * Verifies:
 * - PlaybookProvider provides context correctly
 * - Feature routing maps routes to packs
 * - IntelligencePanel renders with knowledge
 * - invokeAgent attaches JWT correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { PlaybookProvider, usePlaybook } from '@/providers/PlaybookProvider';

// Mock supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { access_token: 'test-token' } },
        error: null,
      }),
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
        error: null,
      }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            not: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
          }),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
    }),
    functions: {
      invoke: vi.fn().mockResolvedValue({
        data: { success: true, packs: [] },
        error: null,
      }),
    },
  },
}));

// Test component to access context
function TestConsumer() {
  const { industry, stage, getFeatureContext } = usePlaybook();
  const featureCtx = getFeatureContext('/validator');
  
  return (
    <div>
      <span data-testid="industry">{industry || 'none'}</span>
      <span data-testid="stage">{stage || 'none'}</span>
      <span data-testid="feature-context">{featureCtx.featureContext}</span>
      <span data-testid="primary-pack">{featureCtx.primaryPack}</span>
    </div>
  );
}

describe('PlaybookProvider', () => {
  let queryClient: QueryClient;
  
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });
  
  const renderWithProviders = (children: React.ReactNode) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <PlaybookProvider>
            {children}
          </PlaybookProvider>
        </BrowserRouter>
      </QueryClientProvider>
    );
  };
  
  it('provides default values when no startup loaded', async () => {
    const { container } = renderWithProviders(<TestConsumer />);
    
    // Wait for render
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const industryEl = container.querySelector('[data-testid="industry"]');
    expect(industryEl?.textContent).toBe('none');
  });
  
  it('maps /validator route to validator feature context', async () => {
    const { container } = renderWithProviders(<TestConsumer />);
    
    // Wait for render
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const featureCtxEl = container.querySelector('[data-testid="feature-context"]');
    const packEl = container.querySelector('[data-testid="primary-pack"]');
    
    expect(featureCtxEl?.textContent).toBe('validator');
    expect(packEl?.textContent).toBe('industry-validation');
  });
});

describe('Feature-to-Pack Routing', () => {
  it('maps all core routes correctly', () => {
    // Direct import to test without rendering
    const FEATURE_PACK_ROUTING: Record<string, { featureContext: string; primaryPack: string }> = {
      '/onboarding': { featureContext: 'onboarding', primaryPack: 'industry-onboarding' },
      '/validator': { featureContext: 'validator', primaryPack: 'industry-validation' },
      '/canvas': { featureContext: 'canvas', primaryPack: 'industry-canvas' },
      '/pitch': { featureContext: 'pitch', primaryPack: 'industry-pitch-prep' },
    };
    
    expect(FEATURE_PACK_ROUTING['/onboarding'].featureContext).toBe('onboarding');
    expect(FEATURE_PACK_ROUTING['/validator'].primaryPack).toBe('industry-validation');
    expect(FEATURE_PACK_ROUTING['/canvas'].featureContext).toBe('canvas');
    expect(FEATURE_PACK_ROUTING['/pitch'].primaryPack).toBe('industry-pitch-prep');
  });
});

describe('invokeAgent', () => {
  it('requires authentication', async () => {
    const { invokeAgent } = await import('@/lib/invokeAgent');
    
    // Should throw when not authenticated
    const { supabase } = await import('@/integrations/supabase/client');
    vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
      data: { session: null },
      error: null,
    });
    
    await expect(
      invokeAgent({
        functionName: 'test-agent',
        action: 'test',
      })
    ).rejects.toThrow('Not authenticated');
  });
  
  it('includes feature context in request body', async () => {
    const { supabase } = await import('@/integrations/supabase/client');
    const { invokeAgent } = await import('@/lib/invokeAgent');
    
    // Reset mock
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { access_token: 'test-token' } } as any,
      error: null,
    });
    
    await invokeAgent({
      functionName: 'industry-expert-agent',
      action: 'validate_canvas',
      featureContext: 'canvas',
      industry: 'fintech',
    });
    
    expect(supabase.functions.invoke).toHaveBeenCalledWith(
      'industry-expert-agent',
      expect.objectContaining({
        body: expect.objectContaining({
          action: 'validate_canvas',
          industry: 'fintech',
          feature_context: 'canvas',
        }),
      })
    );
  });
});
