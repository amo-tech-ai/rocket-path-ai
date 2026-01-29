/**
 * Realtime Chat Room Hook
 * 
 * Provides room-based real-time chat with:
 * - Token streaming from AI responses
 * - Multi-user presence awareness
 * - Typing indicators
 * - Message synchronization
 * - Private channel security
 * 
 * @see docs/tasks/06-realtime-chat.md
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ============ Types ============

export interface ChatMessage {
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
    streamComplete?: boolean;
  };
  suggestedActions?: Array<{
    type: string;
    label: string;
    payload?: Record<string, unknown>;
  }>;
  createdAt: string;
  isStreaming?: boolean;
}

export interface ChatPresence {
  id: string;
  name: string;
  avatar?: string;
  isTyping: boolean;
  lastSeen: string;
}

export interface RoomState {
  messages: ChatMessage[];
  presence: ChatPresence[];
  isConnected: boolean;
  isStreaming: boolean;
  streamingMessageId: string | null;
  error: string | null;
}

export interface UseRealtimeChatRoomOptions {
  roomId: string;
  startupId?: string;
  username?: string;
  initialMessages?: ChatMessage[];
  onMessage?: (message: ChatMessage) => void;
  onPresenceChange?: (presence: ChatPresence[]) => void;
  onStreamStart?: () => void;
  onStreamEnd?: (fullMessage: string) => void;
}

// ============ Initial State ============

const initialState: RoomState = {
  messages: [],
  presence: [],
  isConnected: false,
  isStreaming: false,
  streamingMessageId: null,
  error: null,
};

// ============ Hook Implementation ============

export function useRealtimeChatRoom(options: UseRealtimeChatRoomOptions) {
  const {
    roomId,
    startupId,
    username = 'Anonymous',
    initialMessages = [],
    onMessage,
    onPresenceChange,
    onStreamStart,
    onStreamEnd,
  } = options;

  const { user } = useAuth();
  const [state, setState] = useState<RoomState>({
    ...initialState,
    messages: initialMessages,
  });

  const channelRef = useRef<RealtimeChannel | null>(null);
  const streamBufferRef = useRef<string>('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ============ Channel Setup ============

  useEffect(() => {
    if (!user || !roomId) return;

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
      ? `chat:${startupId}:${roomId}:events`
      : `chat:${user.id}:${roomId}:events`;

    console.log(`[RealtimeChatRoom] Subscribing to ${topic}`);

    const channel = supabase.channel(topic, {
      config: {
        broadcast: { self: true, ack: true },
        presence: { key: user.id },
        private: true,
      },
    });

    // ============ Event Handlers ============

    // User message from another user
    channel.on('broadcast', { event: 'user_message' }, ({ payload }) => {
      const message = payload as ChatMessage;
      if (message.user?.id !== user.id) {
        handleIncomingMessage(message);
      }
    });

    // Token chunk for streaming
    channel.on('broadcast', { event: 'token_chunk' }, ({ payload }) => {
      handleTokenChunk(payload as { 
        messageId: string; 
        token: string; 
        index: number;
      });
    });

    // AI response complete
    channel.on('broadcast', { event: 'message_complete' }, ({ payload }) => {
      handleMessageComplete(payload as ChatMessage);
    });

    // Typing indicators
    channel.on('broadcast', { event: 'typing_start' }, ({ payload }) => {
      handleTypingChange((payload as { userId: string }).userId, true);
    });

    channel.on('broadcast', { event: 'typing_stop' }, ({ payload }) => {
      handleTypingChange((payload as { userId: string }).userId, false);
    });

    // Presence tracking
    channel.on('presence', { event: 'sync' }, () => {
      const presenceState = channel.presenceState<{
        name: string;
        avatar?: string;
        isTyping: boolean;
        lastSeen: string;
      }>();

      const presenceList: ChatPresence[] = Object.entries(presenceState).map(
        ([id, data]) => ({
          id,
          name: data[0]?.name || 'Unknown',
          avatar: data[0]?.avatar,
          isTyping: data[0]?.isTyping || false,
          lastSeen: data[0]?.lastSeen || new Date().toISOString(),
        })
      );

      setState(prev => ({ ...prev, presence: presenceList }));
      onPresenceChange?.(presenceList);
    });

    channelRef.current = channel;

    // Set auth before subscribing (required for private channels)
    supabase.realtime.setAuth().then(() => {
      channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[RealtimeChatRoom] ✓ Subscribed to ${topic}`);
          setState(prev => ({ ...prev, isConnected: true, error: null }));

          // Track presence
          await channel.track({
            name: username,
            isTyping: false,
            lastSeen: new Date().toISOString(),
          });
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`[RealtimeChatRoom] ✗ Error on ${topic}`);
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
        console.log('[RealtimeChatRoom] Unsubscribing');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user, roomId, startupId, username, onPresenceChange]);

  // ============ Message Handlers ============

  const handleIncomingMessage = useCallback((message: ChatMessage) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
    onMessage?.(message);
  }, [onMessage]);

  const handleTokenChunk = useCallback((payload: {
    messageId: string;
    token: string;
    index: number;
  }) => {
    const { messageId, token } = payload;

    // Start streaming if not already
    if (!state.isStreaming) {
      streamBufferRef.current = '';
      onStreamStart?.();
      setState(prev => ({
        ...prev,
        isStreaming: true,
        streamingMessageId: messageId,
      }));
    }

    // Append token to buffer
    streamBufferRef.current += token;

    // Update streaming message in state
    setState(prev => {
      const existingIdx = prev.messages.findIndex(m => m.id === messageId);
      
      if (existingIdx >= 0) {
        // Update existing streaming message
        const updated = [...prev.messages];
        updated[existingIdx] = {
          ...updated[existingIdx],
          content: streamBufferRef.current,
          isStreaming: true,
        };
        return { ...prev, messages: updated };
      } else {
        // Create new streaming message
        const streamingMessage: ChatMessage = {
          id: messageId,
          content: streamBufferRef.current,
          role: 'assistant',
          createdAt: new Date().toISOString(),
          isStreaming: true,
        };
        return { ...prev, messages: [...prev.messages, streamingMessage] };
      }
    });
  }, [state.isStreaming, onStreamStart]);

  const handleMessageComplete = useCallback((message: ChatMessage) => {
    const fullContent = streamBufferRef.current || message.content;
    
    setState(prev => {
      const existingIdx = prev.messages.findIndex(
        m => m.id === message.id || m.id === prev.streamingMessageId
      );

      if (existingIdx >= 0) {
        const updated = [...prev.messages];
        updated[existingIdx] = {
          ...message,
          content: fullContent,
          isStreaming: false,
        };
        return {
          ...prev,
          messages: updated,
          isStreaming: false,
          streamingMessageId: null,
        };
      }

      return {
        ...prev,
        messages: [...prev.messages, { ...message, isStreaming: false }],
        isStreaming: false,
        streamingMessageId: null,
      };
    });

    streamBufferRef.current = '';
    onStreamEnd?.(fullContent);
    onMessage?.(message);
  }, [onStreamEnd, onMessage]);

  const handleTypingChange = useCallback((userId: string, isTyping: boolean) => {
    setState(prev => ({
      ...prev,
      presence: prev.presence.map(p =>
        p.id === userId ? { ...p, isTyping } : p
      ),
    }));
  }, []);

  // ============ Public Methods ============

  const sendMessage = useCallback(async (content: string) => {
    if (!user || !channelRef.current || !content.trim()) return null;

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      content: content.trim(),
      role: 'user',
      user: {
        id: user.id,
        name: username,
      },
      createdAt: new Date().toISOString(),
    };

    // Add to local state immediately (optimistic update)
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message],
    }));

    // Broadcast to room
    await channelRef.current.send({
      type: 'broadcast',
      event: 'user_message',
      payload: message,
    });

    // Stop typing indicator
    await setTyping(false);

    return message;
  }, [user, username]);

  const setTyping = useCallback(async (isTyping: boolean) => {
    if (!channelRef.current || !user) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Update presence
    await channelRef.current.track({
      name: username,
      isTyping,
      lastSeen: new Date().toISOString(),
    });

    // Broadcast typing event
    await channelRef.current.send({
      type: 'broadcast',
      event: isTyping ? 'typing_start' : 'typing_stop',
      payload: { userId: user.id },
    });

    // Auto-stop typing after 3 seconds
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(false);
      }, 3000);
    }
  }, [user, username]);

  const stopStreaming = useCallback(() => {
    setState(prev => ({
      ...prev,
      isStreaming: false,
      streamingMessageId: null,
    }));
    streamBufferRef.current = '';
  }, []);

  const clearMessages = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: [],
    }));
    streamBufferRef.current = '';
  }, []);

  // ============ Return ============

  return {
    // State
    messages: state.messages,
    presence: state.presence,
    isConnected: state.isConnected,
    isStreaming: state.isStreaming,
    error: state.error,

    // Methods
    sendMessage,
    setTyping,
    stopStreaming,
    clearMessages,
  };
}

export type UseRealtimeChatRoomReturn = ReturnType<typeof useRealtimeChatRoom>;
