import { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Mail,
  Plane,
  FileText,
  CalendarSync,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { EventWithRelations } from '@/hooks/useEvents';

interface EventsAIPanelProps {
  events: EventWithRelations[];
  stats?: {
    total: number;
    upcoming: number;
    thisWeek: number;
    today: number;
  } | null;
}

export default function EventsAIPanel({ events, stats }: EventsAIPanelProps) {
  const [message, setMessage] = useState('');

  // Find events needing attention
  const eventsNeedingAttention = events.filter(e => 
    (e.health_score || 0) < 50 && 
    ['draft', 'planning', 'confirmed'].includes(e.status)
  );

  // Mock insight - in production this would come from AI
  const insight = stats?.thisWeek && stats.thisWeek > 2 
    ? `3 events overlap on next Tuesday. I recommend delegating the Tech Hub Meetup to the Community Lead.`
    : `You have ${stats?.upcoming || 0} upcoming events. Consider adding more networking opportunities.`;

  const handleSend = () => {
    console.log('Send message:', message);
    setMessage('');
  };

  const suggestedActions = [
    { icon: Mail, label: 'Delegate RSVP', color: 'text-emerald-600' },
    { icon: Plane, label: 'Book Lisbon Travel', color: 'text-blue-600' },
    { icon: FileText, label: 'View Briefing Docs', color: 'text-amber-600' },
    { icon: CalendarSync, label: 'Sync with Calendar', color: 'text-purple-600' },
  ];

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

        {/* Suggested Actions */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Suggested Actions
          </p>
          <div className="space-y-2">
            {suggestedActions.map((action, index) => (
              <Button 
                key={index}
                variant="ghost" 
                className="w-full justify-start gap-3 h-11 hover:bg-muted/50 px-3"
              >
                <div className={`p-1.5 rounded-md bg-muted ${action.color}`}>
                  <action.icon className="h-4 w-4" />
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
            <span className="text-xs font-semibold text-emerald-600 uppercase">Excellent</span>
          </div>
          <Progress value={85} className="h-2 bg-muted" />
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
                      <p className="text-sm font-medium line-clamp-1">{event.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.event_date 
                          ? format(new Date(event.event_date), 'MMM d, yyyy')
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
          />
          <Button 
            size="icon" 
            onClick={handleSend} 
            disabled={!message.trim()}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
