/**
 * Chat Realtime Hook
 * Channel: chat:{sessionId}:events
 * 
 * Handles live updates for AI chat:
 * - Token streaming
 * - Route link suggestions
 * - Context updates
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatRealtimeState } from './types';

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

    console.log('[Chat Realtime] Subscribing to session:', sessionId);

    const channel = supabase
      .channel(`chat:${sessionId}:events`)
      .on('broadcast', { event: 'message_chunk' }, ({ payload }) => {
        handleMessageChunk(payload as MessageChunk);
      })
      .on('broadcast', { event: 'message_received' }, ({ payload }) => {
        handleMessageChunk({
          content: (payload as { content: string }).content,
          isComplete: true,
          routeLinks: (payload as { routeLinks?: Array<{ module: string; action: string }> }).routeLinks,
        });
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Chat Realtime] Channel subscribed');
        }
      });

    return () => {
      console.log('[Chat Realtime] Unsubscribing');
      supabase.removeChannel(channel);
    };
  }, [sessionId, handleMessageChunk]);

  return {
    ...state,
    startStreaming,
    stopStreaming,
    reset,
  };
}
