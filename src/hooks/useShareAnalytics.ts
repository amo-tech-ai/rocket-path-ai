import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ShareView {
  id: string;
  viewed_at: string;
  user_agent: string | null;
  referrer: string | null;
  ip_hash: string | null;
}

interface ViewsByDay {
  date: string;
  count: number;
}

interface ShareAnalytics {
  totalViews: number;
  uniqueViews: number;
  viewsByDay: ViewsByDay[];
  recentViews: ShareView[];
  loading: boolean;
  refresh: () => Promise<void>;
}

function parseUserAgent(ua: string | null): string {
  if (!ua) return 'Unknown';
  const browser = ua.includes('Chrome') ? 'Chrome' :
    ua.includes('Safari') ? 'Safari' :
    ua.includes('Firefox') ? 'Firefox' :
    ua.includes('Edge') ? 'Edge' : 'Other';
  const os = ua.includes('Mac') ? 'Mac' :
    ua.includes('Windows') ? 'Win' :
    ua.includes('iPhone') || ua.includes('iPad') ? 'iOS' :
    ua.includes('Android') ? 'Android' :
    ua.includes('Linux') ? 'Linux' : '';
  return os ? `${browser}/${os}` : browser;
}

function parseReferrer(ref: string | null): string {
  if (!ref) return 'Direct';
  try {
    const host = new URL(ref).hostname;
    if (host.includes('linkedin')) return 'LinkedIn';
    if (host.includes('twitter') || host.includes('x.com')) return 'Twitter/X';
    if (host.includes('facebook')) return 'Facebook';
    if (host.includes('slack')) return 'Slack';
    if (host.includes('google')) return 'Google';
    return host.replace('www.', '');
  } catch {
    return 'Unknown';
  }
}

export function useShareAnalytics(linkId: string | null): ShareAnalytics {
  const [totalViews, setTotalViews] = useState(0);
  const [uniqueViews, setUniqueViews] = useState(0);
  const [viewsByDay, setViewsByDay] = useState<ViewsByDay[]>([]);
  const [recentViews, setRecentViews] = useState<ShareView[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!linkId) return;
    setLoading(true);
    try {
      const { data: views, error } = await supabase
        .from('share_views')
        .select('*')
        .eq('link_id', linkId)
        .order('viewed_at', { ascending: false })
        .limit(100);

      if (error || !views) {
        setLoading(false);
        return;
      }

      setTotalViews(views.length);

      // Unique by ip_hash
      const uniqueHashes = new Set(views.map(v => v.ip_hash).filter(Boolean));
      setUniqueViews(uniqueHashes.size);

      // Views by day (last 7 days)
      const dayMap = new Map<string, number>();
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dayMap.set(d.toISOString().slice(0, 10), 0);
      }
      for (const v of views) {
        const day = v.viewed_at.slice(0, 10);
        if (dayMap.has(day)) {
          dayMap.set(day, (dayMap.get(day) || 0) + 1);
        }
      }
      setViewsByDay(Array.from(dayMap.entries()).map(([date, count]) => ({ date, count })));

      // Recent views (last 10)
      setRecentViews(views.slice(0, 10));
    } finally {
      setLoading(false);
    }
  }, [linkId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { totalViews, uniqueViews, viewsByDay, recentViews, loading, refresh };
}

export { parseUserAgent, parseReferrer };
