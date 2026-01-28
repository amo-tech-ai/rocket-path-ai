/**
 * Co-founder Presence Hook
 * 
 * Enables multi-user onboarding via Supabase Realtime Presence:
 * - Track active co-founders in the session
 * - Share form state across users
 * - Show who's currently editing which field
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface CofounderPresence {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  onlineAt: string;
  currentField?: string; // Field they're currently editing
  cursor?: { x: number; y: number }; // Optional cursor position
}

export interface FormSyncPayload {
  field: string;
  value: unknown;
  userId: string;
  timestamp: string;
}

interface UseCofounderPresenceOptions {
  sessionId: string | undefined;
  onFormSync?: (payload: FormSyncPayload) => void;
  onPresenceChange?: (presences: CofounderPresence[]) => void;
}

export function useCofounderPresence(options: UseCofounderPresenceOptions) {
  const { sessionId, onFormSync, onPresenceChange } = options;
  const { user } = useAuth();
  
  const [presences, setPresences] = useState<CofounderPresence[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Track current user's presence
  const trackPresence = useCallback(async (currentField?: string) => {
    if (!channelRef.current || !user) return;

    const presenceData: CofounderPresence = {
      id: user.id,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Co-founder',
      email: user.email || '',
      avatarUrl: user.user_metadata?.avatar_url,
      onlineAt: new Date().toISOString(),
      currentField,
    };

    await channelRef.current.track(presenceData);
  }, [user]);

  // Broadcast form field change
  const broadcastFieldChange = useCallback((field: string, value: unknown) => {
    if (!channelRef.current || !user) return;

    const payload: FormSyncPayload = {
      field,
      value,
      userId: user.id,
      timestamp: new Date().toISOString(),
    };

    channelRef.current.send({
      type: 'broadcast',
      event: 'form_sync',
      payload,
    });
  }, [user]);

  // Update which field user is editing
  const setEditingField = useCallback((field: string | undefined) => {
    trackPresence(field);
  }, [trackPresence]);

  // Get other cofounders (exclude self)
  const otherCofounders = presences.filter(p => p.id !== user?.id);

  // Check if a field is being edited by someone else
  const isFieldLockedBy = useCallback((field: string): CofounderPresence | undefined => {
    return otherCofounders.find(p => p.currentField === field);
  }, [otherCofounders]);

  useEffect(() => {
    if (!sessionId || !user) return;

    const channelName = `onboarding:${sessionId}:presence`;
    console.log('[CofounderPresence] Subscribing to:', channelName);

    const channel = supabase.channel(channelName);
    channelRef.current = channel;

    channel
      // Presence events
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<CofounderPresence>();
        const allPresences: CofounderPresence[] = [];
        
        Object.values(state).forEach(presenceList => {
          presenceList.forEach(presence => {
            allPresences.push(presence);
          });
        });

        setPresences(allPresences);
        onPresenceChange?.(allPresences);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('[CofounderPresence] User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('[CofounderPresence] User left:', leftPresences);
      })
      // Form sync broadcast
      .on('broadcast', { event: 'form_sync' }, ({ payload }) => {
        const syncPayload = payload as FormSyncPayload;
        // Only handle changes from other users
        if (syncPayload.userId !== user.id) {
          onFormSync?.(syncPayload);
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          await trackPresence();
        }
      });

    return () => {
      console.log('[CofounderPresence] Unsubscribing');
      channel.unsubscribe();
      supabase.removeChannel(channel);
      channelRef.current = null;
      setIsConnected(false);
    };
  }, [sessionId, user, trackPresence, onFormSync, onPresenceChange]);

  return {
    presences,
    otherCofounders,
    isConnected,
    trackPresence,
    broadcastFieldChange,
    setEditingField,
    isFieldLockedBy,
    cofounderCount: presences.length,
  };
}

export default useCofounderPresence;
