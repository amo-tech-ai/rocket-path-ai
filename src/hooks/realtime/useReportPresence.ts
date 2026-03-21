/**
 * Report Presence Hook
 * Channel: report:{reportId}:presence
 *
 * Uses Supabase Realtime Presence to show who is viewing a report
 * and which section they are currently reading.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface ReportViewer {
  userId: string;
  name: string;
  avatar?: string;
  section?: string;
  joinedAt: string;
}

export function useReportPresence(reportId: string | undefined) {
  const { user } = useAuth();
  const [viewers, setViewers] = useState<ReportViewer[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const updateSection = useCallback((section: string) => {
    if (!channelRef.current || !user) return;
    channelRef.current.track({
      userId: user.id,
      name: user.user_metadata?.full_name || user.email || 'Anonymous',
      avatar: user.user_metadata?.avatar_url,
      section,
      joinedAt: new Date().toISOString(),
    }).catch(() => { /* fire-and-forget */ });
  }, [user]);

  useEffect(() => {
    if (!reportId || !user) return;

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const topic = `report:${reportId}:presence`;

    const channel = supabase.channel(topic, {
      config: { presence: { key: user.id } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<ReportViewer>();
        const allViewers: ReportViewer[] = [];
        for (const presences of Object.values(state)) {
          for (const p of presences) {
            if (p.userId !== user.id) {
              allViewers.push(p);
            }
          }
        }
        setViewers(allViewers);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            userId: user.id,
            name: user.user_metadata?.full_name || user.email || 'Anonymous',
            avatar: user.user_metadata?.avatar_url,
            section: 'overview',
            joinedAt: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [reportId, user]);

  return {
    viewers,
    viewerCount: viewers.length,
    updateSection,
  };
}
