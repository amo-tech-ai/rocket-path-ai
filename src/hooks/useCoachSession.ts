/**
 * useCoachSession Hook
 * Manages coach chat session state and API integration
 * With bidirectional sync support
 *
 * Migrated from legacy validation_sessions/validation_conversations to
 * chat_sessions/chat_messages (CORE-01, 2026-02-25).
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type {
  CoachMessage,
  CoachResponse,
  ProgressInfo,
  ValidationPhase,
  ValidationSession,
} from '@/types/coach';
import type { HighlightableElement } from '@/contexts/CoachSyncContext';

interface UseCoachSessionOptions {
  startupId: string;
  onError?: (error: Error) => void;
  onHighlight?: (type: HighlightableElement, id: string) => void;
  onScoreUpdate?: (dimension: string, score: number) => void;
}

interface UseCoachSessionReturn {
  session: ValidationSession | null;
  messages: CoachMessage[];
  isLoading: boolean;
  isSending: boolean;
  error: Error | null;
  sendMessage: (message: string) => Promise<void>;
  suggestedActions: string[];
  progress: ProgressInfo;
  phase: ValidationPhase;
  startSession: () => Promise<void>;
  clearMessages: () => void;
  explainElement: (type: HighlightableElement, id: string) => Promise<void>;
}

export function useCoachSession({ startupId, onError, onHighlight, onScoreUpdate }: UseCoachSessionOptions): UseCoachSessionReturn {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [suggestedActions, setSuggestedActions] = useState<string[]>([]);
  const [progress, setProgress] = useState<ProgressInfo>({
    phase: 'onboarding',
    step: 1,
    totalSteps: 3,
    percentage: 0,
  });
  const [phase, setPhase] = useState<ValidationPhase>('onboarding');
  const messageIdRef = useRef(0);

  // Fetch existing coach session from chat_sessions
  const {
    data: session,
    isLoading: isLoadingSession,
    error: sessionError,
  } = useQuery({
    queryKey: ['coach-session', startupId, user?.id],
    queryFn: async (): Promise<ValidationSession | null> => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('chat_sessions')
        .select('id, startup_id, context_snapshot, started_at, updated_at')
        .eq('user_id', user.id)
        .eq('startup_id', startupId)
        .eq('last_tab', 'coach')
        .is('ended_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('[useCoachSession] Session query error:', error);
        return null;
      }

      if (!data) return null;

      // Map chat_sessions to ValidationSession
      const snapshot = (data.context_snapshot || {}) as Record<string, unknown>;
      return {
        id: data.id,
        startup_id: data.startup_id,
        phase: (snapshot.phase as ValidationPhase) || 'onboarding',
        state: (snapshot.state as Record<string, unknown>) || {},
        is_active: true,
        started_at: data.started_at,
        last_interaction_at: data.updated_at,
      };
    },
    enabled: !!startupId && !!user,
  });

  // Fetch conversation history from chat_messages
  const { data: conversationHistory } = useQuery({
    queryKey: ['coach-conversations', session?.id],
    queryFn: async () => {
      if (!session?.id || !user) return [];

      const { data, error } = await supabase
        .from('chat_messages')
        .select('id, role, content, metadata, created_at')
        .eq('session_id', session.id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) {
        console.error('[useCoachSession] Messages query error:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!session?.id && !!user,
  });

  // Load conversation history into messages
  useEffect(() => {
    if (conversationHistory && conversationHistory.length > 0) {
      const loadedMessages: CoachMessage[] = conversationHistory.map((msg) => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.created_at),
        phase: ((msg.metadata as Record<string, unknown>)?.phase as ValidationPhase) || 'onboarding',
      }));
      setMessages(loadedMessages);

      // Set phase from last message metadata
      const lastMsg = conversationHistory[conversationHistory.length - 1];
      const lastPhase = (lastMsg?.metadata as Record<string, unknown>)?.phase as ValidationPhase;
      if (lastPhase) {
        setPhase(lastPhase);
      }
    }
  }, [conversationHistory]);

  // Update phase from session
  useEffect(() => {
    if (session?.phase) {
      setPhase(session.phase as ValidationPhase);
    }
  }, [session?.phase]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string): Promise<CoachResponse> => {
      const { data: { session: authSession } } = await supabase.auth.getSession();

      if (!authSession?.access_token) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message,
          mode: 'coach',
          startupId,
        },
        headers: {
          Authorization: `Bearer ${authSession.access_token}`,
        },
      });

      if (error) throw error;
      return data as CoachResponse;
    },
    onSuccess: (response) => {
      // Add assistant message
      const assistantMessage: CoachMessage = {
        id: `msg-${++messageIdRef.current}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        phase: response.phase,
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Update state
      setSuggestedActions(response.suggestedActions);
      setProgress(response.progress);
      setPhase(response.phase);

      // Handle score updates from response
      if (response.stateUpdate?.assessmentScores && onScoreUpdate) {
        Object.entries(response.stateUpdate.assessmentScores).forEach(([dim, score]) => {
          onScoreUpdate(dim, score);
        });
      }

      // Handle element highlights from response
      if (response.stateUpdate?.highlightElement && onHighlight) {
        const highlightElement = response.stateUpdate.highlightElement;
        onHighlight(highlightElement.type as HighlightableElement, highlightElement.id);
      }

      // Invalidate queries to refresh session + messages from DB
      queryClient.invalidateQueries({ queryKey: ['coach-session', startupId] });
      queryClient.invalidateQueries({ queryKey: ['coach-conversations'] });
    },
    onError: (error) => {
      console.error('[useCoachSession] Send error:', error);
      onError?.(error as Error);
    },
  });

  // Send message function
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    // Add user message immediately (optimistic)
    const userMessage: CoachMessage = {
      id: `msg-${++messageIdRef.current}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
      phase,
    };
    setMessages(prev => [...prev, userMessage]);

    // Clear suggested actions while loading
    setSuggestedActions([]);

    // Send to API
    await sendMessageMutation.mutateAsync(message);
  }, [phase, sendMessageMutation]);

  // Start new session
  const startSession = useCallback(async () => {
    setMessages([]);
    setSuggestedActions([]);
    setProgress({ phase: 'onboarding', step: 1, totalSteps: 3, percentage: 0 });
    setPhase('onboarding');

    // Send 'start' to get welcome message (which the EF now persists)
    await sendMessageMutation.mutateAsync('start');
  }, [sendMessageMutation]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setSuggestedActions([]);
  }, []);

  // Explain an element (triggered from Main panel click)
  const explainElement = useCallback(async (type: HighlightableElement, id: string) => {
    const explainPrompt = `Explain the ${type} "${id}" in more detail. What does it mean for my startup and what should I do about it?`;
    await sendMessage(explainPrompt);
  }, [sendMessage]);

  return {
    session,
    messages,
    isLoading: isLoadingSession,
    isSending: sendMessageMutation.isPending,
    error: sessionError as Error | null,
    sendMessage,
    suggestedActions,
    progress,
    phase,
    startSession,
    clearMessages,
    explainElement,
  };
}

export default useCoachSession;
