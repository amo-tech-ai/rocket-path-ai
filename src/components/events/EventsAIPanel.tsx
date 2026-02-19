import { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Mail,
  Plane,
  FileText,
  CalendarSync,
  TrendingUp,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { useQuery, useMutation } from '@tanstack/react-query';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { EventWithRelations } from '@/hooks/useEvents';
import { supabase } from '@/integrations/supabase/client';

interface EventsAIPanelProps {
  events: EventWithRelations[];
  stats?: {
    total: number;
    upcoming: number;
    thisWeek: number;
    today: number;
  } | null;
}

interface AIAnalysisResponse {
  insight?: string;
  recommendations?: string[];
  suggestions?: Array<{ icon: string; label: string; action: string }>;
  network_score?: number;
}

export default function EventsAIPanel({ events, stats }: EventsAIPanelProps) {
  const [message, setMessage] = useState('');
  const [chatResponse, setChatResponse] = useState<string | null>(null);

  // Call event-agent for AI analysis
  const { data: aiAnalysis, isLoading: analysisLoading } = useQuery({
    queryKey: ['events-ai-analysis', events.length],
    queryFn: async (): Promise<AIAnalysisResponse> => {
      try {
        const { data, error } = await supabase.functions.invoke('event-agent', {
          body: { 
            action: 'analyze_events',
            events_summary: {
              total: events.length,
              upcoming: stats?.upcoming || 0,
              thisWeek: stats?.thisWeek || 0,
            }
          }
        });
        if (error) throw error;
        return data || {};
      } catch (err) {
        console.warn('AI analysis not available:', err);
        return {};
      }
    },
    enabled: events.length > 0,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Chat mutation
  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const { data, error } = await supabase.functions.invoke('event-agent', {
        body: {
          action: 'chat',
          message: userMessage,
          context: {
            events_count: events.length,
            upcoming: stats?.upcoming || 0,
          }
        }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setChatResponse(data?.response || 'I can help you with your events!');
    },
  });

  // Find events needing attention
  const eventsNeedingAttention = events.filter(e => 
    (e.health_score || 0) < 50 && 
    ['scheduled', 'in_progress'].includes(e.status)
  );

  // Use AI insight or fallback
  const insight = aiAnalysis?.insight || (
    stats?.thisWeek && stats.thisWeek > 2 
      ? `3 events overlap on next Tuesday. I recommend reviewing the schedule.`
      : `You have ${stats?.upcoming || 0} upcoming events. Consider adding more networking opportunities.`
  );

  const handleSend = () => {
    if (!message.trim()) return;
    chatMutation.mutate(message);
    setMessage('');
  };

  // Use AI suggestions or fallback defaults
  const suggestedActions = aiAnalysis?.suggestions || [
    { icon: 'Mail', label: 'Delegate RSVP', action: 'delegate_rsvp' },
    { icon: 'Plane', label: 'Book Travel', action: 'book_travel' },
    { icon: 'FileText', label: 'View Briefing Docs', action: 'view_docs' },
    { icon: 'CalendarSync', label: 'Sync with Calendar', action: 'sync_calendar' },
  ];

  const iconMap: Record<string, React.ReactNode> = {
    Mail: <Mail className="h-4 w-4" />,
    Plane: <Plane className="h-4 w-4" />,
    FileText: <FileText className="h-4 w-4" />,
    CalendarSync: <CalendarSync className="h-4 w-4" />,
  };

  const networkScore = aiAnalysis?.network_score || 85;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-emerald-100">
            <Sparkles className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI EVENT COACH</h3>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-5">
        {/* Insight Card */}
        {analysisLoading ? (
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <p className="text-sm">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">Insight: </span>
                  <span className="text-foreground/80">{insight}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat Response */}
        {chatResponse && (
          <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900">
            <CardContent className="p-4">
              <p className="text-sm text-foreground/80">{chatResponse}</p>
            </CardContent>
          </Card>
        )}

        {/* Suggested Actions */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Suggested Actions
          </p>
          <div className="space-y-2">
            {suggestedActions.slice(0, 4).map((action, index) => (
              <Button 
                key={index}
                variant="ghost" 
                className="w-full justify-start gap-3 h-11 hover:bg-muted/50 px-3"
              >
                <div className="p-1.5 rounded-md bg-muted text-emerald-600">
                  {iconMap[action.icon] || <Sparkles className="h-4 w-4" />}
                </div>
                <span className="font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Network Growth Trend */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Network Growth Trend</p>
            <span className="text-xs font-semibold text-emerald-600 uppercase">
              {networkScore >= 80 ? 'Excellent' : networkScore >= 60 ? 'Good' : 'Needs Attention'}
            </span>
          </div>
          <Progress value={networkScore} className="h-2 bg-muted" />
        </div>

        {/* Events Needing Attention */}
        {eventsNeedingAttention.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Needs Attention
                </p>
              </div>
              <div className="space-y-2">
                {eventsNeedingAttention.slice(0, 3).map((event) => (
                  <Card key={event.id} className="bg-amber-50 border-amber-100 dark:bg-amber-950/30 dark:border-amber-900">
                    <CardContent className="p-3">
                      <p className="text-sm font-medium line-clamp-1">{event.title || event.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.start_date 
                          ? format(new Date(event.start_date), 'MMM d, yyyy')
                          : 'Date TBD'
                        } • Readiness: {event.health_score || 0}%
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Upcoming This Week */}
        {stats?.thisWeek && stats.thisWeek > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  This Week ({stats.thisWeek})
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {stats.thisWeek === 1 
                  ? '1 event scheduled this week'
                  : `${stats.thisWeek} events scheduled this week`
                }
              </div>
            </div>
          </>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t bg-card/50">
        <div className="flex gap-2">
          <Input 
            placeholder="Ask about your events..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="text-sm bg-background"
            disabled={chatMutation.isPending}
          />
          <Button 
            size="icon" 
            onClick={handleSend} 
            disabled={!message.trim() || chatMutation.isPending}
            className="shrink-0"
          >
            {chatMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
