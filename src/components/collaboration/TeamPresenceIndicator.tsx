/**
 * Team Presence Indicator
 * Shows real-time presence of team members across the platform
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Eye, Edit3, MessageSquare } from 'lucide-react';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status: 'online' | 'away' | 'busy';
  currentPage?: string;
  currentAction?: 'viewing' | 'editing' | 'chatting';
  lastSeen: string;
}

interface TeamPresenceIndicatorProps {
  channelName: string;
  currentPage?: string;
  compact?: boolean;
  maxVisible?: number;
  showActivity?: boolean;
}

export function TeamPresenceIndicator({
  channelName,
  currentPage,
  compact = false,
  maxVisible = 4,
  showActivity = true
}: TeamPresenceIndicatorProps) {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!user) return;

    const presenceChannel = supabase.channel(`presence:${channelName}`, {
      config: {
        presence: { key: user.id },
        private: true
      }
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState<TeamMember>();
        const members: TeamMember[] = [];
        
        Object.values(state).forEach(presenceList => {
          presenceList.forEach(presence => {
            if (presence.id !== user.id) {
              members.push(presence);
            }
          });
        });

        setTeamMembers(members);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('[TeamPresence] Member joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('[TeamPresence] Member left:', leftPresences);
      });

    // Set auth and subscribe
    supabase.realtime.setAuth().then(() => {
      presenceChannel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const presenceData: TeamMember = {
            id: user.id,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Team Member',
            email: user.email || '',
            avatarUrl: user.user_metadata?.avatar_url,
            status: 'online',
            currentPage,
            currentAction: 'viewing',
            lastSeen: new Date().toISOString()
          };
          await presenceChannel.track(presenceData);
        }
      });
    });

    setChannel(presenceChannel);

    return () => {
      presenceChannel.unsubscribe();
      supabase.removeChannel(presenceChannel);
    };
  }, [user, channelName, currentPage]);

  // Update presence when page changes
  useEffect(() => {
    if (!channel || !user) return;

    const updatePresence = async () => {
      await channel.track({
        id: user.id,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Team Member',
        email: user.email || '',
        avatarUrl: user.user_metadata?.avatar_url,
        status: 'online',
        currentPage,
        currentAction: 'viewing',
        lastSeen: new Date().toISOString()
      });
    };

    updatePresence();
  }, [channel, currentPage, user]);

  const getActionIcon = (action?: string) => {
    switch (action) {
      case 'editing':
        return <Edit3 className="w-3 h-3" />;
      case 'chatting':
        return <MessageSquare className="w-3 h-3" />;
      default:
        return <Eye className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const visibleMembers = teamMembers.slice(0, maxVisible);
  const remainingCount = Math.max(0, teamMembers.length - maxVisible);

  if (teamMembers.length === 0 && compact) {
    return null;
  }

  if (compact) {
    return (
      <TooltipProvider>
        <div className="flex items-center -space-x-2">
          <AnimatePresence mode="popLayout">
            {visibleMembers.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <Avatar className="w-7 h-7 border-2 border-background cursor-pointer">
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {member.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${getStatusColor(member.status)}`} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <p className="font-medium">{member.name}</p>
                    {showActivity && member.currentPage && (
                      <p className="text-muted-foreground flex items-center gap-1">
                        {getActionIcon(member.currentAction)}
                        {member.currentPage}
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {remainingCount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background"
            >
              +{remainingCount}
            </motion.div>
          )}
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>{teamMembers.length} team member{teamMembers.length !== 1 ? 's' : ''} online</span>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
            >
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={member.avatarUrl} />
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {member.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${getStatusColor(member.status)}`} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{member.name}</p>
                {showActivity && member.currentPage && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    {getActionIcon(member.currentAction)}
                    <span className="truncate">{member.currentPage}</span>
                  </p>
                )}
              </div>

              {member.currentAction === 'editing' && (
                <Badge variant="secondary" className="text-xs shrink-0">
                  <Edit3 className="w-3 h-3 mr-1" />
                  Editing
                </Badge>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default TeamPresenceIndicator;
