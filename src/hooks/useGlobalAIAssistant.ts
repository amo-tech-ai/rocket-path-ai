/**
 * Global AI Assistant Hook
 * 
 * Convenience hook that provides access to the AI assistant context
 * with additional utilities for common use cases.
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAIAssistant } from '@/providers/AIAssistantProvider';
import type { QuickAction } from '@/lib/ai-capabilities';

export interface UseGlobalAIAssistantReturn {
  // State
  isOpen: boolean;
  isExpanded: boolean;
  isLoading: boolean;
  isStreaming: boolean;
  isAuthenticated: boolean;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
  }>;
  error: string | null;
  
  // Labels
  modeLabel: string;
  contextLabel: string;
  
  // Quick Actions
  quickActions: QuickAction[];
  
  // UI Actions
  open: () => void;
  close: () => void;
  toggle: () => void;
  toggleExpanded: () => void;
  
  // Chat Actions
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  executeQuickAction: (action: QuickAction) => void;
  
  // Suggested Action Handler
  handleSuggestedAction: (action: { type: string; label: string; payload?: Record<string, unknown> }) => void;
}

export function useGlobalAIAssistant(): UseGlobalAIAssistantReturn {
  const navigate = useNavigate();
  const {
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
  } = useAIAssistant();

  const executeQuickAction = useCallback((action: QuickAction) => {
    sendMessage(action.prompt);
  }, [sendMessage]);

  const handleSuggestedAction = useCallback((action: { type: string; label: string; payload?: Record<string, unknown> }) => {
    switch (action.type) {
      case 'navigate':
        if (action.payload?.route) {
          navigate(action.payload.route as string);
        }
        break;
      case 'auth':
        if (action.payload?.action === 'signup' || action.payload?.action === 'login') {
          navigate('/login');
        }
        break;
      case 'action':
        // Handle other action types
        console.log('Action:', action);
        break;
      default:
        console.log('Unknown action type:', action.type);
    }
  }, [navigate]);

  return {
    // State
    isOpen: state.isOpen,
    isExpanded: state.isExpanded,
    isLoading: state.isLoading,
    isStreaming: state.isStreaming,
    isAuthenticated: state.mode === 'authenticated',
    messages: state.messages,
    error: state.error,
    
    // Labels
    modeLabel,
    contextLabel,
    
    // Quick Actions
    quickActions,
    
    // UI Actions
    open,
    close,
    toggle,
    toggleExpanded,
    
    // Chat Actions
    sendMessage,
    clearMessages,
    executeQuickAction,
    
    // Suggested Action Handler
    handleSuggestedAction,
  };
}

export default useGlobalAIAssistant;
