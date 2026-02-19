/**
 * useCoachSession Hook
 * Manages coach chat session state and API integration
 * With bidirectional sync support
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { 
  CoachMessage, 
  CoachResponse, 
  ProgressInfo, 
  ValidationPhase,
  ValidationSession 
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

  // Fetch existing session
  const { 
    data: session, 
    isLoading: isLoadingSession,
    error: sessionError,
  } = useQuery({
    queryKey: ['coach-session', startupId],
    queryFn: async () => {
      // Legacy validation_sessions table dropped — return null until coach migrated to chat_sessions
      return null as ValidationSession | null;
    },
    enabled: !!startupId,
  });

  // Fetch conversation history when session exists
  const { data: conversationHistory } = useQuery({
    queryKey: ['coach-conversations', session?.id],
    queryFn: async () => {
      // Legacy validation_conversations table dropped — return empty until coach migrated
      return [];
    },
    enabled: !!session?.id,
  });

  // Load conversation history into messages
  useEffect(() => {
    if (conversationHistory && conversationHistory.length > 0) {
      const loadedMessages: CoachMessage[] = conversationHistory.map((conv, index) => ({
        id: `history-${index}`,
        role: conv.role as 'user' | 'assistant',
        content: conv.content,
        timestamp: new Date(conv.created_at),
        phase: conv.phase as ValidationPhase,
      }));
      setMessages(loadedMessages);
      
      // Set phase from last message
      const lastMessage = conversationHistory[conversationHistory.length - 1];
      if (lastMessage?.phase) {
        setPhase(lastMessage.phase as ValidationPhase);
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
      
      // Invalidate session query to refresh data
      queryClient.invalidateQueries({ queryKey: ['coach-session', startupId] });
    },
    onError: (error) => {
      console.error('[useCoachSession] Send error:', error);
      onError?.(error as Error);
    },
  });

  // Send message function
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    
    // Add user message immediately
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
    
    // Send empty message to get welcome
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
