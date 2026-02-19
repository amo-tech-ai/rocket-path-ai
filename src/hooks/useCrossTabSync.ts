/**
 * Cross-Tab Synchronization Hook
 * Uses BroadcastChannel API for instant cross-tab updates
 * Falls back to localStorage events for older browsers
 */

import { useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type SyncEventType = 
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'TASK_DELETED'
  | 'DEAL_CREATED'
  | 'DEAL_UPDATED'
  | 'DEAL_DELETED'
  | 'CONTACT_CREATED'
  | 'CONTACT_UPDATED'
  | 'CONTACT_DELETED'
  | 'DOCUMENT_SAVED'
  | 'CANVAS_SAVED'
  | 'DECK_UPDATED'
  | 'CUSTOM';

interface SyncMessage {
  type: SyncEventType;
  payload?: unknown;
  timestamp: number;
  tabId: string;
  queryKeys?: string[][];
}

interface UseCrossTabSyncOptions {
  channelName?: string;
  onMessage?: (message: SyncMessage) => void;
  showToasts?: boolean;
}

// Generate unique tab ID
const TAB_ID = `tab_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// Check if BroadcastChannel is supported
const supportsBroadcastChannel = typeof BroadcastChannel !== 'undefined';

/**
 * Hook for cross-tab data synchronization
 * Automatically invalidates React Query caches across browser tabs
 */
export function useCrossTabSync(options: UseCrossTabSyncOptions = {}) {
  const {
    channelName = 'rocket-path-sync',
    onMessage,
    showToasts = false,
  } = options;

  const queryClient = useQueryClient();
  const channelRef = useRef<BroadcastChannel | null>(null);
  const lastMessageRef = useRef<string | null>(null);

  // Handle incoming sync messages
  const handleMessage = useCallback((message: SyncMessage) => {
    // Ignore messages from the same tab
    if (message.tabId === TAB_ID) return;

    // Prevent duplicate processing
    const messageKey = `${message.type}_${message.timestamp}`;
    if (lastMessageRef.current === messageKey) return;
    lastMessageRef.current = messageKey;

    console.log(`[CrossTabSync] Received ${message.type} from another tab`);

    // Invalidate specified query keys
    if (message.queryKeys?.length) {
      message.queryKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    }

    // Type-specific invalidations
    switch (message.type) {
      case 'TASK_CREATED':
      case 'TASK_UPDATED':
      case 'TASK_DELETED':
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['all-tasks'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
        if (showToasts && message.type === 'TASK_CREATED') {
          toast.info('Task list updated in another tab');
        }
        break;

      case 'DEAL_CREATED':
      case 'DEAL_UPDATED':
      case 'DEAL_DELETED':
        queryClient.invalidateQueries({ queryKey: ['deals'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
        if (showToasts && message.type === 'DEAL_UPDATED') {
          toast.info('Deal updated in another tab');
        }
        break;

      case 'CONTACT_CREATED':
      case 'CONTACT_UPDATED':
      case 'CONTACT_DELETED':
        queryClient.invalidateQueries({ queryKey: ['contacts'] });
        break;

      case 'DOCUMENT_SAVED':
      case 'CANVAS_SAVED':
        queryClient.invalidateQueries({ queryKey: ['documents'] });
        queryClient.invalidateQueries({ queryKey: ['lean-canvas'] });
        break;

      case 'DECK_UPDATED':
        queryClient.invalidateQueries({ queryKey: ['pitch-decks'] });
        queryClient.invalidateQueries({ queryKey: ['pitch-deck'] });
        break;
    }

    // Custom handler
    onMessage?.(message);
  }, [queryClient, onMessage, showToasts]);

  // Set up BroadcastChannel or localStorage fallback
  useEffect(() => {
    if (supportsBroadcastChannel) {
      // Use BroadcastChannel API
      const channel = new BroadcastChannel(channelName);
      channelRef.current = channel;

      channel.onmessage = (event) => {
        try {
          const message = event.data as SyncMessage;
          handleMessage(message);
        } catch (error) {
          console.error('[CrossTabSync] Failed to process message:', error);
        }
      };

      console.log(`[CrossTabSync] Listening on channel: ${channelName}`);

      return () => {
        channel.close();
        channelRef.current = null;
      };
    } else {
      // Fallback to localStorage events
      const handleStorageEvent = (event: StorageEvent) => {
        if (event.key !== channelName || !event.newValue) return;

        try {
          const message = JSON.parse(event.newValue) as SyncMessage;
          handleMessage(message);
        } catch (error) {
          console.error('[CrossTabSync] Failed to parse storage event:', error);
        }
      };

      window.addEventListener('storage', handleStorageEvent);
      console.log(`[CrossTabSync] Using localStorage fallback for: ${channelName}`);

      return () => {
        window.removeEventListener('storage', handleStorageEvent);
      };
    }
  }, [channelName, handleMessage]);

  // Broadcast a sync message to other tabs
  const broadcast = useCallback((
    type: SyncEventType,
    payload?: unknown,
    queryKeys?: string[][]
  ) => {
    const message: SyncMessage = {
      type,
      payload,
      timestamp: Date.now(),
      tabId: TAB_ID,
      queryKeys,
    };

    if (supportsBroadcastChannel && channelRef.current) {
      channelRef.current.postMessage(message);
    } else {
      // Fallback: use localStorage
      localStorage.setItem(channelName, JSON.stringify(message));
      // Clean up to allow future events with same key
      setTimeout(() => localStorage.removeItem(channelName), 100);
    }

    console.log(`[CrossTabSync] Broadcasted ${type}`);
  }, [channelName]);

  // Convenience methods
  const broadcastTaskChange = useCallback((
    action: 'created' | 'updated' | 'deleted',
    taskData?: unknown
  ) => {
    const type = `TASK_${action.toUpperCase()}` as SyncEventType;
    broadcast(type, taskData);
  }, [broadcast]);

  const broadcastDealChange = useCallback((
    action: 'created' | 'updated' | 'deleted',
    dealData?: unknown
  ) => {
    const type = `DEAL_${action.toUpperCase()}` as SyncEventType;
    broadcast(type, dealData);
  }, [broadcast]);

  const broadcastContactChange = useCallback((
    action: 'created' | 'updated' | 'deleted',
    contactData?: unknown
  ) => {
    const type = `CONTACT_${action.toUpperCase()}` as SyncEventType;
    broadcast(type, contactData);
  }, [broadcast]);

  const broadcastDocumentSaved = useCallback((documentId?: string) => {
    broadcast('DOCUMENT_SAVED', { documentId });
  }, [broadcast]);

  const broadcastCanvasSaved = useCallback((canvasId?: string) => {
    broadcast('CANVAS_SAVED', { canvasId });
  }, [broadcast]);

  const broadcastDeckUpdated = useCallback((deckId?: string) => {
    broadcast('DECK_UPDATED', { deckId });
  }, [broadcast]);

  return {
    broadcast,
    broadcastTaskChange,
    broadcastDealChange,
    broadcastContactChange,
    broadcastDocumentSaved,
    broadcastCanvasSaved,
    broadcastDeckUpdated,
    tabId: TAB_ID,
  };
}

/**
 * Simplified hook for task sync only
 */
export function useTaskCrossTabSync() {
  const { broadcastTaskChange } = useCrossTabSync({ showToasts: true });
  return { broadcastTaskChange };
}

/**
 * Simplified hook for CRM sync only
 */
export function useCRMCrossTabSync() {
  const { broadcastDealChange, broadcastContactChange } = useCrossTabSync({ showToasts: true });
  return { broadcastDealChange, broadcastContactChange };
}

export default useCrossTabSync;
