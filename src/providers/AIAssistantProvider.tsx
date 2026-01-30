/**
 * Global AI Assistant Provider
 * 
 * Centralized state management for the AI assistant across the entire app.
 * Handles both public (unauthenticated) and authenticated modes.
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useStartup } from '@/hooks/useDashboardData';
import type { AIMode, QuickAction } from '@/lib/ai-capabilities';
import { getQuickActions, checkGatedAction, getAuthenticatedSystemPrompt, PUBLIC_SYSTEM_PROMPT } from '@/lib/ai-capabilities';
import { supabase } from '@/integrations/supabase/client';

// ============ Types ============

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  suggestedActions?: Array<{
    type: string;
    label: string;
    payload?: Record<string, unknown>;
  }>;
}

export interface StartupContext {
  id: string;
  name: string;
  industry: string;
  stage: string;
  completionPercentage: number;
}

interface AIAssistantState {
  // UI State
  isOpen: boolean;
  isExpanded: boolean;
  
  // Mode
  mode: AIMode;
  
  // Session
  sessionId: string | null;
  messages: AIMessage[];
  
  // Context
  currentRoute: string;
  startupContext: StartupContext | null;
  
  // Loading
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
}

type AIAssistantAction =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'TOGGLE_EXPANDED' }
  | { type: 'SET_MODE'; payload: AIMode }
  | { type: 'SET_ROUTE'; payload: string }
  | { type: 'SET_STARTUP_CONTEXT'; payload: StartupContext | null }
  | { type: 'ADD_MESSAGE'; payload: AIMessage }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; content: string; isStreaming?: boolean } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_STREAMING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SET_SESSION'; payload: string };

interface AIAssistantContextValue {
  state: AIAssistantState;
  
  // UI Actions
  open: () => void;
  close: () => void;
  toggle: () => void;
  toggleExpanded: () => void;
  
  // Chat Actions
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  
  // Helpers
  quickActions: QuickAction[];
  modeLabel: string;
  contextLabel: string;
}

// ============ Initial State ============

const initialState: AIAssistantState = {
  isOpen: false,
  isExpanded: false,
  mode: 'public',
  sessionId: null,
  messages: [],
  currentRoute: '/',
  startupContext: null,
  isLoading: false,
  isStreaming: false,
  error: null,
};

// ============ Reducer ============

function aiAssistantReducer(state: AIAssistantState, action: AIAssistantAction): AIAssistantState {
  switch (action.type) {
    case 'OPEN':
      return { ...state, isOpen: true };
    case 'CLOSE':
      return { ...state, isOpen: false };
    case 'TOGGLE':
      return { ...state, isOpen: !state.isOpen };
    case 'TOGGLE_EXPANDED':
      return { ...state, isExpanded: !state.isExpanded };
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SET_ROUTE':
      return { ...state, currentRoute: action.payload };
    case 'SET_STARTUP_CONTEXT':
      return { ...state, startupContext: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(m =>
          m.id === action.payload.id
            ? { ...m, content: action.payload.content, isStreaming: action.payload.isStreaming }
            : m
        ),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_STREAMING':
      return { ...state, isStreaming: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [], error: null };
    case 'SET_SESSION':
      return { ...state, sessionId: action.payload };
    default:
      return state;
  }
}

// ============ Context ============

const AIAssistantContext = createContext<AIAssistantContextValue | null>(null);

// ============ Provider Component ============

export function AIAssistantProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(aiAssistantReducer, initialState);
  const { user } = useAuth();
  const location = useLocation();
  const { data: startup } = useStartup();
  const streamBufferRef = useRef<string>('');

  // Update mode based on auth state
  useEffect(() => {
    dispatch({ type: 'SET_MODE', payload: user ? 'authenticated' : 'public' });
  }, [user]);

  // Update route
  useEffect(() => {
    dispatch({ type: 'SET_ROUTE', payload: location.pathname });
  }, [location.pathname]);

  // Update startup context
  useEffect(() => {
    if (startup) {
      // Calculate completion percentage based on available fields
      const fields = [startup.name, startup.industry, startup.stage, startup.description, startup.elevator_pitch];
      const filledFields = fields.filter(Boolean).length;
      const completionPercentage = Math.round((filledFields / fields.length) * 100);
      
      dispatch({
        type: 'SET_STARTUP_CONTEXT',
        payload: {
          id: startup.id,
          name: startup.name || 'My Startup',
          industry: startup.industry || 'Unknown',
          stage: startup.stage || 'idea',
          completionPercentage,
        },
      });
    } else {
      dispatch({ type: 'SET_STARTUP_CONTEXT', payload: null });
    }
  }, [startup]);

  // Initialize anonymous session for public mode
  useEffect(() => {
    if (!state.sessionId) {
      const sessionId = `session_${crypto.randomUUID()}`;
      dispatch({ type: 'SET_SESSION', payload: sessionId });
    }
  }, [state.sessionId]);

  // ============ Actions ============

  const open = useCallback(() => dispatch({ type: 'OPEN' }), []);
  const close = useCallback(() => dispatch({ type: 'CLOSE' }), []);
  const toggle = useCallback(() => dispatch({ type: 'TOGGLE' }), []);
  const toggleExpanded = useCallback(() => dispatch({ type: 'TOGGLE_EXPANDED' }), []);
  const clearMessages = useCallback(() => dispatch({ type: 'CLEAR_MESSAGES' }), []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Check for gated actions in public mode
    const gateCheck = checkGatedAction(content, state.mode);
    
    // Add user message
    const userMessage: AIMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

    // If gated, respond with gated message
    if (!gateCheck.allowed) {
      const gatedResponse: AIMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: gateCheck.message || 'Please sign in to access this feature.',
        timestamp: new Date().toISOString(),
        suggestedActions: [
          { type: 'auth', label: 'Sign Up', payload: { action: 'signup' } },
          { type: 'auth', label: 'Sign In', payload: { action: 'login' } },
        ],
      };
      dispatch({ type: 'ADD_MESSAGE', payload: gatedResponse });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Build request body
      const requestBody = {
        message: content.trim(),
        messages: state.messages.map(m => ({ role: m.role, content: m.content })),
        action: 'chat',
        mode: state.mode,
        context: {
          screen: state.currentRoute,
          startup_id: state.startupContext?.id,
          is_public: state.mode === 'public',
          data: state.mode === 'authenticated' && state.startupContext ? {
            startup_name: state.startupContext.name,
            industry: state.startupContext.industry,
            stage: state.startupContext.stage,
            completion: state.startupContext.completionPercentage,
          } : undefined,
        },
      };

      const { data, error: fnError } = await supabase.functions.invoke('ai-chat', {
        body: requestBody,
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      // Add assistant response
      const assistantMessage: AIMessage = {
        id: data.id || crypto.randomUUID(),
        role: 'assistant',
        content: data.response || data.message,
        timestamp: new Date().toISOString(),
        suggestedActions: data.suggested_actions,
      };
      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI response';
      console.error('[AIAssistant] Error:', err);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      
      // Add error message
      const errorResponse: AIMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: errorResponse });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.mode, state.messages, state.currentRoute, state.startupContext]);

  // ============ Computed Values ============

  const quickActions = getQuickActions(state.mode);

  const modeLabel = state.mode === 'authenticated'
    ? state.startupContext?.name || 'Connected'
    : 'Guest';

  const contextLabel = state.mode === 'authenticated'
    ? `Active in: ${getScreenLabel(state.currentRoute)}`
    : 'StartupAI Assistant';

  // ============ Context Value ============

  const value: AIAssistantContextValue = {
    state,
    open,
    close,
    toggle,
    toggleExpanded,
    sendMessage,
    clearMessages,
    quickActions,
    modeLabel,
    contextLabel,
  };

  return (
    <AIAssistantContext.Provider value={value}>
      {children}
    </AIAssistantContext.Provider>
  );
}

// ============ Hook ============

export function useAIAssistant() {
  const context = useContext(AIAssistantContext);
  if (!context) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
}

// ============ Helpers ============

function getScreenLabel(path: string): string {
  const labels: Record<string, string> = {
    '/': 'Home',
    '/dashboard': 'Dashboard',
    '/tasks': 'Tasks',
    '/projects': 'Projects',
    '/crm': 'CRM',
    '/documents': 'Documents',
    '/investors': 'Investors',
    '/lean-canvas': 'Lean Canvas',
    '/onboarding': 'Onboarding',
    '/settings': 'Settings',
    '/analytics': 'Analytics',
  };

  // Check for exact match
  if (labels[path]) return labels[path];

  // Check for partial match
  for (const [key, label] of Object.entries(labels)) {
    if (path.startsWith(key) && key !== '/') return label;
  }

  return 'App';
}

export default AIAssistantProvider;
