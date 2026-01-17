import { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Target,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Users,
  Calendar
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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

  // Find events that need attention (low health scores)
  const eventsNeedingAttention = events.filter(e => 
    (e.health_score || 0) < 50 && 
    ['draft', 'planning', 'confirmed'].includes(e.status)
  );

  // Upcoming events in the next 7 days
  const upcomingEvents = events.filter(e => {
    if (!e.event_date) return false;
    const eventDate = new Date(e.event_date);
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return eventDate >= now && eventDate <= weekFromNow;
  });

  const handleSend = () => {
    // TODO: Integrate with AI chat
    console.log('Send message:', message);
    setMessage('');
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* AI Coach Header */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Event Coach</h3>
          <p className="text-xs text-muted-foreground">AI-powered insights</p>
        </div>
      </div>

      <Separator />

      {/* Insights */}
      <div className="space-y-3 flex-1 overflow-auto">
        {/* Summary */}
        <Card className="bg-muted/50 border-0">
          <CardContent className="p-3">
            <p className="text-sm">
              {stats?.upcoming === 0 
                ? "You have no upcoming events. Ready to plan your next demo day or pitch night?"
                : `You have ${stats?.upcoming} upcoming event${stats?.upcoming === 1 ? '' : 's'}${stats?.thisWeek ? ` (${stats.thisWeek} this week)` : ''}.`
              }
            </p>
          </CardContent>
        </Card>

        {/* Events Needing Attention */}
        {eventsNeedingAttention.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Needs Attention</span>
            </div>
            {eventsNeedingAttention.slice(0, 3).map((event) => (
              <Card key={event.id} className="bg-amber-50 border-amber-200">
                <CardContent className="p-3">
                  <p className="text-sm font-medium">{event.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Readiness: {event.health_score || 0}%
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Upcoming This Week */}
        {upcomingEvents.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">This Week</span>
            </div>
            {upcomingEvents.slice(0, 3).map((event) => (
              <Card key={event.id} className="bg-blue-50 border-blue-200">
                <CardContent className="p-3">
                  <p className="text-sm font-medium">{event.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.event_date && new Date(event.event_date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Separator />

        {/* Quick Actions */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase">Quick Actions</p>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2 h-9" size="sm">
              <Target className="h-4 w-4" />
              Find Sponsors
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 h-9" size="sm">
              <Users className="h-4 w-4" />
              Book Venue
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 h-9" size="sm">
              <Zap className="h-4 w-4" />
              Create Invite
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Chat Input */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Ask AI</p>
        <div className="flex gap-2">
          <Input 
            placeholder="Ask about your events..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="text-sm"
          />
          <Button size="icon" onClick={handleSend} disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
