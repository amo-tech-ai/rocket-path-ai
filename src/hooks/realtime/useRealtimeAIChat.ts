/**
 * Realtime AI Chat Hook
 * 
 * Bridges the RealtimeChat component with the AI edge function:
 * - Sends user messages to ai-chat edge function
 * - Broadcasts AI responses to realtime channel
 * - Manages streaming state and optimistic updates
 * - Integrates with existing useAIChat for backwards compatibility
 * 
 * @see docs/tasks/06-realtime-chat.md
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ============ Types ============

export interface RealtimeAIMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  metadata?: {
    model?: string;
    provider?: string;
    tokens?: number;
  };
  suggestedActions?: Array<{
    type: string;
    label: string;
    payload?: Record<string, unknown>;
  }>;
  createdAt: string;
  isStreaming?: boolean;
}

export interface RealtimeAIChatState {
  messages: RealtimeAIMessage[];
  isConnected: boolean;
  isLoading: boolean;
  isStreaming: boolean;
  isThinking: boolean;
  thinkingModel: string | null;
  error: string | null;
}

export interface UseRealtimeAIChatOptions {
  roomId?: string;
  startupId?: string;
  username?: string;
  onStreamStart?: () => void;
  onStreamEnd?: (fullMessage: string) => void;
  onError?: (error: string) => void;
}

// ============ Initial State ============

const initialState: RealtimeAIChatState = {
  messages: [],
  isConnected: false,
  isLoading: false,
  isStreaming: false,
  isThinking: false,
  thinkingModel: null,
  error: null,
};

// ============ Hook Implementation ============

export function useRealtimeAIChat(options: UseRealtimeAIChatOptions = {}) {
  const {
    roomId = 'ai-chat',
    startupId,
    username = 'User',
    onStreamStart,
    onStreamEnd,
    onError,
  } = options;

  const { user } = useAuth();
  const [state, setState] = useState<RealtimeAIChatState>(initialState);
  
  const channelRef = useRef<RealtimeChannel | null>(null);
  const streamBufferRef = useRef<string>('');
  const streamingMessageIdRef = useRef<string | null>(null);

  // ============ Channel Setup ============

  useEffect(() => {
    if (!user) return;

    // Prevent duplicate subscriptions
    if (channelRef.current) {
      const channelState = channelRef.current.state;
      if (channelState === 'joined' || channelState === 'joining') {
        return;
      }
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const topic = startupId 
      ? `chat:${startupId}:${roomId}:ai`
      : `chat:${user.id}:${roomId}:ai`;

    console.log(`[RealtimeAIChat] Subscribing to ${topic}`);

    const channel = supabase.channel(topic, {
      config: {
        broadcast: { self: true, ack: true },
        private: true,
      },
    });

    // Listen for AI response chunks (if edge function broadcasts them)
    channel.on('broadcast', { event: 'token_chunk' }, ({ payload }) => {
      handleTokenChunk(payload as { messageId: string; token: string });
    });

    // Listen for AI thinking indicator (RT-2)
    channel.on('broadcast', { event: 'ai_thinking' }, ({ payload }) => {
      const p = payload as { model?: string; provider?: string; startedAt?: number };
      setState(prev => ({ ...prev, isThinking: true, thinkingModel: p.model || null }));
    });

    // Listen for complete AI messages
    channel.on('broadcast', { event: 'ai_response' }, ({ payload }) => {
      handleAIResponse(payload as RealtimeAIMessage);
    });

    channelRef.current = channel;

    // Set auth before subscribing (required for private channels)
    supabase.realtime.setAuth().then(() => {
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[RealtimeAIChat] ✓ Connected to ${topic}`);
          setState(prev => ({ ...prev, isConnected: true, error: null }));
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`[RealtimeAIChat] ✗ Error on ${topic}`);
          setState(prev => ({ 
            ...prev, 
            isConnected: false, 
            error: 'Connection error' 
          }));
        } else if (status === 'CLOSED') {
          setState(prev => ({ ...prev, isConnected: false }));
        }
      });
    });

    return () => {
      if (channelRef.current) {
        console.log('[RealtimeAIChat] Unsubscribing');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user, roomId, startupId]);

  // ============ Event Handlers ============

  const handleTokenChunk = useCallback((payload: { messageId: string; token: string }) => {
    const { messageId, token } = payload;

    if (!streamingMessageIdRef.current) {
      streamingMessageIdRef.current = messageId;
      streamBufferRef.current = '';
      setState(prev => ({ ...prev, isStreaming: true }));
      onStreamStart?.();
    }

    streamBufferRef.current += token;

    setState(prev => {
      const existingIdx = prev.messages.findIndex(m => m.id === messageId);
      
      if (existingIdx >= 0) {
        const updated = [...prev.messages];
        updated[existingIdx] = {
          ...updated[existingIdx],
          content: streamBufferRef.current,
          isStreaming: true,
        };
        return { ...prev, messages: updated };
      } else {
        const streamingMessage: RealtimeAIMessage = {
          id: messageId,
          content: streamBufferRef.current,
          role: 'assistant',
          createdAt: new Date().toISOString(),
          isStreaming: true,
        };
        return { ...prev, messages: [...prev.messages, streamingMessage] };
      }
    });
  }, [onStreamStart]);

  const handleAIResponse = useCallback((message: RealtimeAIMessage) => {
    setState(prev => {
      const existingIdx = prev.messages.findIndex(
        m => m.id === message.id || m.id === streamingMessageIdRef.current
      );

      if (existingIdx >= 0) {
        const updated = [...prev.messages];
        updated[existingIdx] = { ...message, isStreaming: false };
        return {
          ...prev,
          messages: updated,
          isStreaming: false,
          isLoading: false,
          isThinking: false,
          thinkingModel: null,
        };
      }

      return {
        ...prev,
        messages: [...prev.messages, { ...message, isStreaming: false }],
        isStreaming: false,
        isLoading: false,
        isThinking: false,
        thinkingModel: null,
      };
    });

    if (streamBufferRef.current) {
      onStreamEnd?.(streamBufferRef.current);
    }
    
    streamBufferRef.current = '';
    streamingMessageIdRef.current = null;
  }, [onStreamEnd]);

  // ============ Public Methods ============

  const sendMessage = useCallback(async (
    content: string,
    action: 'chat' | 'prioritize_tasks' | 'generate_tasks' | 'extract_profile' | 'stage_guidance' = 'chat',
    context?: Record<string, unknown>
  ) => {
    if (!user || !content.trim()) return null;

    const userMessage: RealtimeAIMessage = {
      id: crypto.randomUUID(),
      content: content.trim(),
      role: 'user',
      user: {
        id: user.id,
        name: username,
      },
      createdAt: new Date().toISOString(),
    };

    // Optimistic update - add user message immediately
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      // Call AI edge function
      const { data, error: fnError } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: content.trim(),
          messages: state.messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          action,
          context: {
            screen: 'ai-chat',
            startup_id: startupId,
            room_id: roomId,
            ...context,
          },
        },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      // Create assistant message from response
      const assistantMessage: RealtimeAIMessage = {
        id: crypto.randomUUID(),
        content: data.response || data.message,
        role: 'assistant',
        metadata: {
          model: data.model,
          provider: data.provider,
          tokens: data.usage?.completionTokens,
        },
        suggestedActions: data.suggested_actions,
        createdAt: new Date().toISOString(),
        isStreaming: false,
      };

      // Add assistant message to state
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
        error: null,
      }));

      // Broadcast to channel for other listeners
      if (channelRef.current) {
        await channelRef.current.send({
          type: 'broadcast',
          event: 'ai_response',
          payload: assistantMessage,
        });
      }

      return assistantMessage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI response';
      console.error('[RealtimeAIChat] Error:', err);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      onError?.(errorMessage);
      return null;
    }
  }, [user, username, state.messages, startupId, roomId, onError]);

  const clearMessages = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: [],
      error: null,
    }));
    streamBufferRef.current = '';
    streamingMessageIdRef.current = null;
  }, []);

  const stopStreaming = useCallback(() => {
    setState(prev => ({
      ...prev,
      isStreaming: false,
    }));
    streamBufferRef.current = '';
    streamingMessageIdRef.current = null;
  }, []);

  // ============ Return ============

  return {
    // State
    messages: state.messages,
    isConnected: state.isConnected,
    isLoading: state.isLoading,
    isStreaming: state.isStreaming,
    isThinking: state.isThinking,
    thinkingModel: state.thinkingModel,
    error: state.error,

    // Methods
    sendMessage,
    clearMessages,
    stopStreaming,
  };
}

export type UseRealtimeAIChatReturn = ReturnType<typeof useRealtimeAIChat>;
