/**
 * useCoachSession Hook
 * Manages coach chat session state and API integration
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

interface UseCoachSessionOptions {
  startupId: string;
  onError?: (error: Error) => void;
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
}

export function useCoachSession({ startupId, onError }: UseCoachSessionOptions): UseCoachSessionReturn {
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
      const { data, error } = await supabase
        .from('validation_sessions')
        .select('*')
        .eq('startup_id', startupId)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) throw error;
      return data as ValidationSession | null;
    },
    enabled: !!startupId,
  });

  // Fetch conversation history when session exists
  const { data: conversationHistory } = useQuery({
    queryKey: ['coach-conversations', session?.id],
    queryFn: async () => {
      if (!session?.id) return [];
      
      const { data, error } = await supabase
        .from('validation_conversations')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true })
        .limit(50);
      
      if (error) throw error;
      return data || [];
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
  };
}

export default useCoachSession;
