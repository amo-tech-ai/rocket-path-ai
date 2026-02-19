/**
 * Chat Realtime Hook
 * Channel: chat:{sessionId}:events
 * 
 * Handles live updates for AI chat with private channels:
 * - Token streaming
 * - Route link suggestions
 * - Context updates
 * 
 * @see docs/tasks/01-realtime-tasks.md
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatRealtimeState } from './types';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface MessageChunk {
  content: string;
  isComplete: boolean;
  routeLinks?: Array<{ module: string; action: string }>;
}

interface UseChatRealtimeOptions {
  onChunk?: (chunk: string) => void;
  onComplete?: (fullMessage: string) => void;
  onRouteLink?: (link: { module: string; action: string }) => void;
}

const initialState: ChatRealtimeState = {
  streamingMessage: '',
  isStreaming: false,
  routeLinks: [],
};

export function useChatRealtime(
  sessionId: string | undefined,
  options: UseChatRealtimeOptions = {}
) {
  const [state, setState] = useState<ChatRealtimeState>(initialState);
  const messageBuffer = useRef<string>('');
  const channelRef = useRef<RealtimeChannel | null>(null);

  const handleMessageChunk = useCallback((chunk: MessageChunk) => {
    messageBuffer.current += chunk.content;
    
    setState(prev => ({
      ...prev,
      streamingMessage: messageBuffer.current,
      isStreaming: !chunk.isComplete,
      routeLinks: chunk.routeLinks || prev.routeLinks,
    }));

    options.onChunk?.(chunk.content);

    if (chunk.isComplete) {
      options.onComplete?.(messageBuffer.current);
      messageBuffer.current = '';
    }

    if (chunk.routeLinks) {
      chunk.routeLinks.forEach(link => options.onRouteLink?.(link));
    }
  }, [options]);

  const startStreaming = useCallback(() => {
    messageBuffer.current = '';
    setState({
      streamingMessage: '',
      isStreaming: true,
      routeLinks: [],
    });
  }, []);

  const stopStreaming = useCallback(() => {
    setState(prev => ({
      ...prev,
      isStreaming: false,
    }));
  }, []);

  const reset = useCallback(() => {
    messageBuffer.current = '';
    setState(initialState);
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    // Prevent duplicate subscriptions
    if (channelRef.current) {
      const state = channelRef.current.state;
      if (state === 'joined' || state === 'joining') {
        return;
      }
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const topic = `chat:${sessionId}:events`;
    console.log(`[Chat Realtime] Subscribing to ${topic}`);

    const channel = supabase
      .channel(topic, {
        config: {
          broadcast: { self: true, ack: true },
          private: true,
        },
      })
      .on('broadcast', { event: 'message_chunk' }, ({ payload }) => {
        handleMessageChunk(payload as MessageChunk);
      })
      .on('broadcast', { event: 'message_received' }, ({ payload }) => {
        handleMessageChunk({
          content: (payload as { content: string }).content,
          isComplete: true,
          routeLinks: (payload as { routeLinks?: Array<{ module: string; action: string }> }).routeLinks,
        });
      });

    channelRef.current = channel;

    // Set auth before subscribing (required for private channels)
    supabase.realtime.setAuth().then(() => {
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[Chat Realtime] ✓ Subscribed to ${topic}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`[Chat Realtime] ✗ Error on ${topic}`);
        }
      });
    });

    return () => {
      if (channelRef.current) {
        console.log('[Chat Realtime] Unsubscribing');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [sessionId, handleMessageChunk]);

  return {
    ...state,
    startStreaming,
    stopStreaming,
    reset,
  };
}
