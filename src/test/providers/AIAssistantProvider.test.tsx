/**
 * AI Assistant Provider Tests
 * Tests for global AI state management
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { AIAssistantProvider, useAIAssistant } from '@/providers/AIAssistantProvider';
import { BrowserRouter } from 'react-router-dom';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ 
        data: { subscription: { unsubscribe: vi.fn() } } 
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          not: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      }),
    }),
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: { response: 'Test response' }, error: null }),
    },
  },
}));

// Mock useAuth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn().mockReturnValue({ user: null, profile: null, isLoading: false }),
}));

// Mock useDashboardData hook
vi.mock('@/hooks/useDashboardData', () => ({
  useStartup: vi.fn().mockReturnValue({ data: null, isLoading: false }),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AIAssistantProvider>
      {children}
    </AIAssistantProvider>
  </BrowserRouter>
);

describe('AIAssistantProvider', () => {
  describe('Initial State', () => {
    it('provides state.isOpen as false initially', () => {
      const { result } = renderHook(() => useAIAssistant(), { wrapper });
      expect(result.current.state.isOpen).toBe(false);
    });

    it('provides empty messages array initially', () => {
      const { result } = renderHook(() => useAIAssistant(), { wrapper });
      expect(result.current.state.messages).toEqual([]);
    });

    it('provides mode as "public" when not authenticated', () => {
      const { result } = renderHook(() => useAIAssistant(), { wrapper });
      expect(result.current.state.mode).toBe('public');
    });

    it('provides modeLabel as "Guest" when not authenticated', () => {
      const { result } = renderHook(() => useAIAssistant(), { wrapper });
      expect(result.current.modeLabel).toBe('Guest');
    });
  });

  describe('Toggle Actions', () => {
    it('open() sets isOpen to true', () => {
      const { result } = renderHook(() => useAIAssistant(), { wrapper });
      
      act(() => {
        result.current.open();
      });
      
      expect(result.current.state.isOpen).toBe(true);
    });

    it('close() sets isOpen to false', () => {
      const { result } = renderHook(() => useAIAssistant(), { wrapper });
      
      act(() => {
        result.current.open();
      });
      expect(result.current.state.isOpen).toBe(true);
      
      act(() => {
        result.current.close();
      });
      expect(result.current.state.isOpen).toBe(false);
    });

    it('toggle() toggles isOpen state', () => {
      const { result } = renderHook(() => useAIAssistant(), { wrapper });
      
      expect(result.current.state.isOpen).toBe(false);
      
      act(() => {
        result.current.toggle();
      });
      expect(result.current.state.isOpen).toBe(true);
      
      act(() => {
        result.current.toggle();
      });
      expect(result.current.state.isOpen).toBe(false);
    });

    it('toggleExpanded() toggles isExpanded state', () => {
      const { result } = renderHook(() => useAIAssistant(), { wrapper });
      
      expect(result.current.state.isExpanded).toBe(false);
      
      act(() => {
        result.current.toggleExpanded();
      });
      expect(result.current.state.isExpanded).toBe(true);
    });
  });

  describe('Message Management', () => {
    it('clearMessages() empties the messages array', async () => {
      const { result } = renderHook(() => useAIAssistant(), { wrapper });
      
      // Send a message first
      await act(async () => {
        await result.current.sendMessage('Hello');
      });
      
      // Clear messages
      act(() => {
        result.current.clearMessages();
      });
      
      expect(result.current.state.messages).toHaveLength(0);
    });
  });

  describe('Quick Actions', () => {
    it('provides quickActions array', () => {
      const { result } = renderHook(() => useAIAssistant(), { wrapper });
      expect(Array.isArray(result.current.quickActions)).toBe(true);
      expect(result.current.quickActions.length).toBeGreaterThan(0);
    });

    it('quickActions have required properties', () => {
      const { result } = renderHook(() => useAIAssistant(), { wrapper });
      result.current.quickActions.forEach(action => {
        expect(action).toHaveProperty('id');
        expect(action).toHaveProperty('label');
        expect(action).toHaveProperty('prompt');
      });
    });
  });

  describe('Context Labels', () => {
    it('provides contextLabel', () => {
      const { result } = renderHook(() => useAIAssistant(), { wrapper });
      expect(typeof result.current.contextLabel).toBe('string');
    });

    it('provides modeLabel', () => {
      const { result } = renderHook(() => useAIAssistant(), { wrapper });
      expect(typeof result.current.modeLabel).toBe('string');
    });
  });

  describe('State Properties', () => {
    it('has all expected state properties', () => {
      const { result } = renderHook(() => useAIAssistant(), { wrapper });
      const { state } = result.current;
      
      expect(state).toHaveProperty('isOpen');
      expect(state).toHaveProperty('isExpanded');
      expect(state).toHaveProperty('mode');
      expect(state).toHaveProperty('sessionId');
      expect(state).toHaveProperty('messages');
      expect(state).toHaveProperty('currentRoute');
      expect(state).toHaveProperty('startupContext');
      expect(state).toHaveProperty('isLoading');
      expect(state).toHaveProperty('isStreaming');
      expect(state).toHaveProperty('error');
    });
  });
});
