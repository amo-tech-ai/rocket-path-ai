import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  MoreVertical,
  ExternalLink
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EventWithRelations } from '@/hooks/useEvents';

interface EventCardProps {
  event: EventWithRelations;
  viewMode: 'grid' | 'list';
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  planning: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  live: 'bg-blue-100 text-blue-700',
  completed: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-red-100 text-red-700',
  postponed: 'bg-orange-100 text-orange-700',
};

const typeLabels: Record<string, string> = {
  demo_day: 'Demo Day',
  pitch_night: 'Pitch Night',
  networking: 'Networking',
  workshop: 'Workshop',
  investor_meetup: 'Investor Meetup',
  founder_dinner: 'Founder Dinner',
  hackathon: 'Hackathon',
  conference: 'Conference',
  webinar: 'Webinar',
  other: 'Other',
};

export default function EventCard({ event, viewMode }: EventCardProps) {
  const healthScore = event.health_score || 0;
  const attendeeCount = event.attendee_count || 0;
  const capacity = event.capacity || 0;
  
  // Get primary venue name from venues array
  const primaryVenue = event.venues?.find(v => v.is_primary) || event.venues?.[0];
  const locationName = primaryVenue?.name;

  if (viewMode === 'list') {
    return (
      <Link to={`/app/events/${event.id}`}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Date */}
              <div className="w-16 text-center shrink-0">
                {event.event_date ? (
                  <>
                    <p className="text-xs text-muted-foreground uppercase">
                      {format(new Date(event.event_date), 'MMM')}
                    </p>
                    <p className="text-2xl font-bold">
                      {format(new Date(event.event_date), 'd')}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">TBD</p>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium truncate">{event.name}</h3>
                  <Badge variant="outline" className={statusColors[event.status]}>
                    {event.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {typeLabels[event.event_type] || event.event_type}
                  </span>
                  {locationName && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {locationName}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {attendeeCount}/{capacity || '∞'}
                  </span>
                </div>
              </div>

              {/* Health Score */}
              <div className="w-24 shrink-0">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Ready</span>
                  <span className="font-medium">{healthScore}%</span>
                </div>
                <Progress value={healthScore} className="h-2" />
              </div>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={(e) => e.preventDefault()}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Grid view
  return (
    <Link to={`/app/events/${event.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <Badge variant="outline" className={statusColors[event.status]}>
              {event.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.preventDefault()}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Title & Type */}
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{event.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {typeLabels[event.event_type] || event.event_type}
          </p>

          {/* Date & Location */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {event.event_date ? (
                <span>{format(new Date(event.event_date), 'MMM d, yyyy • h:mm a')}</span>
              ) : (
                <span className="text-muted-foreground">Date TBD</span>
              )}
            </div>
            {locationName && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{locationName}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{attendeeCount}</span>
              <span className="text-sm text-muted-foreground">/{capacity || '∞'}</span>
            </div>
            {event.sponsor_count !== undefined && event.sponsor_count > 0 && (
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{event.sponsor_count}</span>
                <span className="text-sm text-muted-foreground">sponsors</span>
              </div>
            )}
          </div>

          {/* Health Score */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">Readiness</span>
              <span className="font-medium">{healthScore}%</span>
            </div>
            <Progress 
              value={healthScore} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
