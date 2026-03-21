/**
 * AI Chat Persistence Hook
 *
 * Manages chat session persistence to Supabase:
 * - Creates/retrieves chat sessions (chat_sessions table)
 * - Persists messages (chat_messages table)
 * - Loads message history on mount
 *
 * Schema-aligned: uses actual column names from chat_sessions and chat_messages.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ChatSession {
  id: string;
  title: string | null;
  startupId: string;
  messageCount: number;
  createdAt: string;
}

export interface PersistedMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

interface UseChatPersistenceOptions {
  startupId?: string;
  autoLoadHistory?: boolean;
}

export function useChatPersistence(options: UseChatPersistenceOptions = {}) {
  const { startupId, autoLoadHistory = true } = options;
  const { user } = useAuth();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<PersistedMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const ensureRef = useRef(false);

  // Get or create a chat session
  const ensureSession = useCallback(async (): Promise<string | null> => {
    if (!user) return null;
    if (sessionId) return sessionId;
    if (ensureRef.current) return null; // prevent double-call
    ensureRef.current = true;

    try {
      // Check for recent active session (within last 24 hours)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const { data: existingSession } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('created_at', oneDayAgo)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingSession) {
        setSessionId(existingSession.id);
        return existingSession.id;
      }

      // Create new session — startup_id is required by schema
      const sid = startupId || '00000000-0000-0000-0000-000000000000';
      const { data: newSession, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          startup_id: sid,
          agent_type: 'atlas',
          status: 'active',
          message_count: 0,
        })
        .select('id')
        .single();

      if (error) throw error;

      setSessionId(newSession.id);
      return newSession.id;
    } catch (error) {
      console.error('[ChatPersistence] Failed to ensure session:', error);
      return null;
    } finally {
      ensureRef.current = false;
    }
  }, [user, startupId, sessionId]);

  // Load message history
  const loadHistory = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const sid = await ensureSession();
      if (!sid) return;

      const { data, error } = await supabase
        .from('chat_messages')
        .select('id, role, content, created_at, metadata')
        .eq('session_id', sid)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      const formattedMessages: PersistedMessage[] = (data || []).map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        createdAt: msg.created_at || new Date().toISOString(),
        metadata: msg.metadata as Record<string, unknown> | undefined,
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('[ChatPersistence] Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, ensureSession]);

  // Save a message
  const saveMessage = useCallback(async (
    role: 'user' | 'assistant',
    content: string,
    metadata?: Record<string, unknown>,
  ): Promise<PersistedMessage | null> => {
    if (!user) return null;

    setIsSaving(true);
    try {
      const sid = await ensureSession();
      if (!sid) return null;

      const insertPayload: Record<string, unknown> = {
        session_id: sid,
        role,
        content,
        metadata: metadata || null,
      };

      const { data, error } = await supabase
        .from('chat_messages')
        .insert(insertPayload)
        .select('id, created_at')
        .single();

      if (error) throw error;

      const newMessage: PersistedMessage = {
        id: data.id,
        role,
        content,
        createdAt: data.created_at,
        metadata,
      };

      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (error) {
      console.error('[ChatPersistence] Failed to save message:', error);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [user, ensureSession]);

  // End current session
  const endSession = useCallback(async () => {
    if (!sessionId) return;

    try {
      await supabase
        .from('chat_sessions')
        .update({ status: 'ended' })
        .eq('id', sessionId);

      setSessionId(null);
      setMessages([]);
    } catch (error) {
      console.error('[ChatPersistence] Failed to end session:', error);
    }
  }, [sessionId]);

  // Clear messages (but keep session)
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Auto-load history on mount
  useEffect(() => {
    if (autoLoadHistory && user) {
      loadHistory();
    }
  }, [autoLoadHistory, user]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    sessionId,
    messages,
    isLoading,
    isSaving,
    ensureSession,
    loadHistory,
    saveMessage,
    endSession,
    clearMessages,
    setMessages,
  };
}
