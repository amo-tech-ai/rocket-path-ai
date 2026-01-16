import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SuggestedAction {
  type: string;
  label: string;
  payload?: Record<string, unknown>;
}

export interface AIResponse {
  response: string;
  message: string;
  suggested_actions: SuggestedAction[];
  model: string;
  provider: string;
  usage?: { promptTokens: number; completionTokens: number };
}

export interface AIContext {
  screen?: string;
  startup_id?: string;
  data?: Record<string, unknown>;
}

type AIAction = 'chat' | 'prioritize_tasks' | 'generate_tasks' | 'extract_profile';

export function useAIChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    message: string, 
    action: AIAction = 'chat',
    context?: AIContext
  ): Promise<AIResponse | null> => {
    if (!user) {
      setError('You must be logged in to use AI features');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Add user message to local state
      const userMessage: AIMessage = { role: 'user', content: message };
      setMessages(prev => [...prev, userMessage]);

      const { data, error: fnError } = await supabase.functions.invoke('ai-chat', {
        body: {
          message,
          messages: [...messages, userMessage],
          action,
          context: context || { screen: 'dashboard' }
        }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      const response = data as AIResponse;

      // Add assistant response to local state
      const assistantMessage: AIMessage = { role: 'assistant', content: response.response };
      setMessages(prev => [...prev, assistantMessage]);

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI response';
      setError(errorMessage);
      console.error('AI Chat error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    setMessages
  };
}

// Hook for quick AI insights (no chat history)
export function useAIInsights() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInsights = useCallback(async (
    prompt: string,
    context?: AIContext
  ): Promise<AIResponse | null> => {
    if (!user) {
      setError('You must be logged in to use AI features');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: prompt,
          action: 'chat',
          context: context || { screen: 'dashboard' }
        }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      return data as AIResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI insights';
      setError(errorMessage);
      console.error('AI Insights error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    isLoading,
    error,
    getInsights
  };
}

// Hook for task prioritization
export function useAITaskPrioritization() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prioritizeTasks = useCallback(async (
    tasks: Array<{ id: string; title: string; priority: string; status: string }>
  ) => {
    if (!user) {
      setError('You must be logged in to use AI features');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: 'Prioritize these tasks for maximum impact today',
          action: 'prioritize_tasks',
          context: {
            screen: 'tasks',
            data: { tasks }
          }
        }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      return data as AIResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to prioritize tasks';
      setError(errorMessage);
      console.error('Task prioritization error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    isLoading,
    error,
    prioritizeTasks
  };
}

// Hook for task generation
export function useAITaskGeneration() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTasks = useCallback(async (
    startupContext: Record<string, unknown>
  ) => {
    if (!user) {
      setError('You must be logged in to use AI features');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: 'Generate onboarding tasks based on my startup profile',
          action: 'generate_tasks',
          context: {
            screen: 'wizard',
            data: startupContext
          }
        }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      return data as AIResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate tasks';
      setError(errorMessage);
      console.error('Task generation error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    isLoading,
    error,
    generateTasks
  };
}
