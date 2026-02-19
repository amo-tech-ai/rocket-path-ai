/**
 * Multi-User Canvas Editor
 * Real-time collaborative editing with cursor tracking and field locking
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface UserCursor {
  userId: string;
  userName: string;
  userColor: string;
  x: number;
  y: number;
  currentField?: string;
}

interface FieldLock {
  fieldId: string;
  userId: string;
  userName: string;
  userColor: string;
  lockedAt: string;
}

interface CollaboratorPresence {
  id: string;
  name: string;
  email: string;
  color: string;
  cursor?: { x: number; y: number };
  currentField?: string;
}

interface MultiUserCanvasEditorProps {
  documentId: string;
  startupId: string;
  children: React.ReactNode;
  onFieldLockChange?: (locks: FieldLock[]) => void;
  enableCursors?: boolean;
}

// Generate consistent color based on user ID
const getUserColor = (userId: string): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E9', '#F8B500', '#00CED1'
  ];
  const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

export function MultiUserCanvasEditor({
  documentId,
  startupId,
  children,
  onFieldLockChange,
  enableCursors = true
}: MultiUserCanvasEditorProps) {
  const { user } = useAuth();
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>([]);
  const [fieldLocks, setFieldLocks] = useState<FieldLock[]>([]);
  const [cursors, setCursors] = useState<UserCursor[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const userColor = user ? getUserColor(user.id) : '#888';

  useEffect(() => {
    if (!user || !documentId) return;

    const channelName = `canvas:${documentId}`;
    console.log('[MultiUserCanvas] Connecting to:', channelName);

    const channel = supabase.channel(channelName, {
      config: {
        presence: { key: user.id },
        private: true
      }
    });

    channelRef.current = channel;

    channel
      // Presence sync
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<CollaboratorPresence>();
        const collabs: CollaboratorPresence[] = [];
        
        Object.values(state).forEach(presenceList => {
          presenceList.forEach(presence => {
            if (presence.id !== user.id) {
              collabs.push(presence);
            }
          });
        });

        setCollaborators(collabs);
        
        // Update cursors from presence
        const newCursors: UserCursor[] = collabs
          .filter(c => c.cursor)
          .map(c => ({
            userId: c.id,
            userName: c.name,
            userColor: c.color,
            x: c.cursor!.x,
            y: c.cursor!.y,
            currentField: c.currentField
          }));
        setCursors(newCursors);
      })
      // Field lock broadcasts
      .on('broadcast', { event: 'field_lock' }, ({ payload }) => {
        const { fieldId, userId, userName, userColor, action } = payload;
        
        setFieldLocks(prev => {
          if (action === 'lock') {
            const existing = prev.find(l => l.fieldId === fieldId);
            if (existing) return prev;
            
            const newLocks = [...prev, {
              fieldId,
              userId,
              userName,
              userColor,
              lockedAt: new Date().toISOString()
            }];
            onFieldLockChange?.(newLocks);
            return newLocks;
          } else {
            const newLocks = prev.filter(l => !(l.fieldId === fieldId && l.userId === userId));
            onFieldLockChange?.(newLocks);
            return newLocks;
          }
        });
      });

    // Subscribe with auth
    supabase.realtime.setAuth().then(() => {
      channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            id: user.id,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            color: userColor
          });
          console.log('[MultiUserCanvas] ✓ Connected');
        }
      });
    });

    return () => {
      channel.unsubscribe();
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [user, documentId, userColor, onFieldLockChange]);

  // Track mouse movement for cursor sharing
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!enableCursors || !channelRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Update presence with cursor position
    channelRef.current.track({
      id: user?.id,
      name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
      email: user?.email || '',
      color: userColor,
      cursor: { x, y }
    });
  }, [enableCursors, user, userColor]);

  // Lock a field when editing starts
  const lockField = useCallback((fieldId: string) => {
    if (!channelRef.current || !user) return;

    channelRef.current.send({
      type: 'broadcast',
      event: 'field_lock',
      payload: {
        fieldId,
        userId: user.id,
        userName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        userColor,
        action: 'lock'
      }
    });

    // Also update presence
    channelRef.current.track({
      id: user.id,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      color: userColor,
      currentField: fieldId
    });
  }, [user, userColor]);

  // Unlock a field when editing ends
  const unlockField = useCallback((fieldId: string) => {
    if (!channelRef.current || !user) return;

    channelRef.current.send({
      type: 'broadcast',
      event: 'field_lock',
      payload: {
        fieldId,
        userId: user.id,
        userName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        userColor,
        action: 'unlock'
      }
    });

    // Clear current field in presence
    channelRef.current.track({
      id: user.id,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      color: userColor,
      currentField: undefined
    });
  }, [user, userColor]);

  // Check if a field is locked by another user
  const isFieldLocked = useCallback((fieldId: string): FieldLock | undefined => {
    return fieldLocks.find(l => l.fieldId === fieldId && l.userId !== user?.id);
  }, [fieldLocks, user?.id]);

  return (
    <div 
      ref={containerRef}
      className="relative"
      onMouseMove={handleMouseMove}
    >
      {/* Collaborator indicators */}
      {collaborators.length > 0 && (
        <div className="absolute top-2 right-2 z-50 flex items-center gap-1">
          <Badge variant="secondary" className="text-xs">
            {collaborators.length + 1} editing
          </Badge>
          <div className="flex -space-x-2">
            {collaborators.slice(0, 3).map(collab => (
              <Avatar key={collab.id} className="w-6 h-6 border-2 border-background">
                <AvatarFallback 
                  className="text-xs text-white"
                  style={{ backgroundColor: collab.color }}
                >
                  {collab.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      )}

      {/* Remote cursors */}
      <AnimatePresence>
        {enableCursors && cursors.map(cursor => (
          <motion.div
            key={cursor.userId}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              left: `${cursor.x}%`,
              top: `${cursor.y}%`
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', damping: 30, stiffness: 500 }}
            className="absolute pointer-events-none z-50"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            {/* Cursor arrow */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
            >
              <path
                d="M5 3L19 12L12 13L9 20L5 3Z"
                fill={cursor.userColor}
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
            {/* Name label */}
            <div
              className="absolute left-5 top-4 px-2 py-0.5 rounded text-xs text-white whitespace-nowrap"
              style={{ backgroundColor: cursor.userColor }}
            >
              {cursor.userName}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Field lock overlays are rendered by children using context */}
      {children}
    </div>
  );
}

// Context for field locking
import { createContext, useContext } from 'react';

interface CanvasCollaborationContextType {
  lockField: (fieldId: string) => void;
  unlockField: (fieldId: string) => void;
  isFieldLocked: (fieldId: string) => FieldLock | undefined;
  collaborators: CollaboratorPresence[];
}

export const CanvasCollaborationContext = createContext<CanvasCollaborationContextType | null>(null);

export function useCanvasCollaboration() {
  const context = useContext(CanvasCollaborationContext);
  if (!context) {
    // Return no-op functions if not within provider
    return {
      lockField: () => {},
      unlockField: () => {},
      isFieldLocked: () => undefined,
      collaborators: []
    };
  }
  return context;
}

export default MultiUserCanvasEditor;
