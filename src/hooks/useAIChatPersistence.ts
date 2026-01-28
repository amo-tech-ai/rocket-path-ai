/**
 * AI Chat Persistence Hook
 * 
 * Manages chat session persistence to Supabase:
 * - Creates/retrieves chat sessions
 * - Persists messages to chat_messages table
 * - Loads message history on mount
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ChatSession {
  id: string;
  title: string | null;
  startupId: string | null;
  messageCount: number;
  lastTab: string | null;
  createdAt: string;
}

export interface PersistedMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tab: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
  suggestedActions?: Array<{ type: string; label: string; payload?: Record<string, unknown> }>;
}

interface UseChatPersistenceOptions {
  tab?: string;
  startupId?: string;
  autoLoadHistory?: boolean;
}

export function useChatPersistence(options: UseChatPersistenceOptions = {}) {
  const { tab = 'dashboard', startupId, autoLoadHistory = true } = options;
  const { user } = useAuth();
  
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<PersistedMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Get or create a chat session
  const ensureSession = useCallback(async (): Promise<string | null> => {
    if (!user) return null;
    if (sessionId) return sessionId;

    try {
      // Check for recent active session (within last 24 hours)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      const { data: existingSession } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('user_id', user.id)
        .eq('last_tab', tab)
        .gte('created_at', oneDayAgo)
        .is('ended_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingSession) {
        setSessionId(existingSession.id);
        return existingSession.id;
      }

      // Create new session
      const { data: newSession, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          startup_id: startupId || null,
          last_tab: tab,
          started_at: new Date().toISOString(),
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
    }
  }, [user, startupId, sessionId, tab]);

  // Load message history
  const loadHistory = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const sid = await ensureSession();
      if (!sid) return;

      const { data, error } = await supabase
        .from('chat_messages')
        .select('id, role, content, tab, created_at, metadata, suggested_actions')
        .eq('session_id', sid)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      const formattedMessages: PersistedMessage[] = (data || []).map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        tab: msg.tab,
        createdAt: msg.created_at || new Date().toISOString(),
        metadata: msg.metadata as Record<string, unknown> | undefined,
        suggestedActions: msg.suggested_actions as PersistedMessage['suggestedActions'],
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
    suggestedActions?: PersistedMessage['suggestedActions']
  ): Promise<PersistedMessage | null> => {
    if (!user) return null;

    setIsSaving(true);
    try {
      const sid = await ensureSession();
      if (!sid) return null;

      const insertData = {
        session_id: sid,
        user_id: user.id,
        role,
        content,
        tab,
        metadata: metadata || null,
        suggested_actions: suggestedActions || null,
      };

      const { data, error } = await supabase
        .from('chat_messages')
        .insert(insertData as any) // Type assertion for Supabase generated types
        .select('id, created_at')
        .single();

      if (error) throw error;

      // Update session message count asynchronously
      (async () => {
        try {
          await supabase
            .from('chat_sessions')
            .update({ 
              message_count: messages.length + 1,
              last_tab: tab,
            })
            .eq('id', sid);
        } catch (err) {
          console.warn('[ChatPersistence] Failed to update message count:', err);
        }
      })();

      const newMessage: PersistedMessage = {
        id: data.id,
        role,
        content,
        tab,
        createdAt: data.created_at,
        metadata,
        suggestedActions,
      };

      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (error) {
      console.error('[ChatPersistence] Failed to save message:', error);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [user, ensureSession, tab, messages.length]);

  // End current session
  const endSession = useCallback(async () => {
    if (!sessionId) return;

    try {
      await supabase
        .from('chat_sessions')
        .update({ ended_at: new Date().toISOString() })
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
  }, [autoLoadHistory, user, loadHistory]);

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
