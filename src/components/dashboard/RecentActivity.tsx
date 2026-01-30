/**
 * RecentActivity Component
 * Displays a timeline of the last 7 days of startup activity
 * Shows tasks completed, AI runs, canvas updates, etc.
 */

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { 
  CheckCircle2, 
  Sparkles, 
  FileEdit, 
  MessageSquare,
  Users,
  Presentation,
  LayoutGrid,
  Activity,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ActivityItem {
  id: string;
  activity_type: string;
  title: string;
  description: string | null;
  created_at: string;
  metadata: Record<string, unknown> | null;
}

interface RecentActivityProps {
  startupId?: string;
  limit?: number;
}

const ACTIVITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  task_completed: CheckCircle2,
  task_created: CheckCircle2,
  ai_run: Sparkles,
  document_created: FileEdit,
  document_updated: FileEdit,
  chat_message: MessageSquare,
  contact_added: Users,
  deal_created: Users,
  pitch_updated: Presentation,
  canvas_updated: LayoutGrid,
  default: Activity,
};

const ACTIVITY_COLORS: Record<string, { bg: string; text: string }> = {
  task_completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
  task_created: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
  ai_run: { bg: 'bg-violet-500/10', text: 'text-violet-500' },
  document_created: { bg: 'bg-amber-500/10', text: 'text-amber-500' },
  document_updated: { bg: 'bg-amber-500/10', text: 'text-amber-500' },
  chat_message: { bg: 'bg-cyan-500/10', text: 'text-cyan-500' },
  contact_added: { bg: 'bg-pink-500/10', text: 'text-pink-500' },
  deal_created: { bg: 'bg-rose-500/10', text: 'text-rose-500' },
  pitch_updated: { bg: 'bg-indigo-500/10', text: 'text-indigo-500' },
  canvas_updated: { bg: 'bg-teal-500/10', text: 'text-teal-500' },
  default: { bg: 'bg-muted', text: 'text-muted-foreground' },
};

export function RecentActivity({ startupId, limit = 10 }: RecentActivityProps) {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['recent-activity', startupId],
    queryFn: async () => {
      if (!startupId) return [];
      
      // Get activities from the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data, error } = await supabase
        .from('activities')
        .select('id, activity_type, title, description, created_at, metadata')
        .eq('startup_id', startupId)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching activities:', error);
        return [];
      }
      
      return data as ActivityItem[];
    },
    enabled: !!startupId,
    staleTime: 30000, // 30 seconds
  });

  if (isLoading) {
    return (
      <div className="card-premium p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Recent Activity
          </h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const hasActivities = activities && activities.length > 0;

  return (
    <div className="card-premium p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Recent Activity
          </h3>
        </div>
        <Badge variant="outline" className="text-xs">
          Last 7 days
        </Badge>
      </div>

      {!hasActivities ? (
        <div className="text-center py-6">
          <Activity className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">No recent activity</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Complete tasks and use features to see activity here
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[280px] pr-2">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-4 bottom-4 w-px bg-border" />
            
            <div className="space-y-3">
              {activities.map((activity, index) => {
                const activityType = activity.activity_type || 'default';
                const Icon = ACTIVITY_ICONS[activityType] || ACTIVITY_ICONS.default;
                const colors = ACTIVITY_COLORS[activityType] || ACTIVITY_COLORS.default;

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-start gap-3 relative"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 relative z-10 ${colors.bg}`}>
                      <Icon className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-sm font-medium text-foreground truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

export default RecentActivity;
