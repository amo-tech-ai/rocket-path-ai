import { format } from 'date-fns';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Star, 
  ExternalLink,
  Ticket,
  Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PublicEvent } from '@/hooks/usePublicEvents';

interface PublicEventCardProps {
  event: PublicEvent;
  viewMode?: 'grid' | 'list';
}

const eventTypeLabels: Record<string, string> = {
  demo_day: 'Demo Day',
  pitch_night: 'Pitch Night',
  networking: 'Networking',
  workshop: 'Workshop',
  conference: 'Conference',
  other: 'Event',
};

const eventTypeColors: Record<string, string> = {
  demo_day: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  pitch_night: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  networking: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  workshop: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  conference: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  other: 'bg-muted text-muted-foreground',
};

const ticketCostLabels: Record<string, string> = {
  free: 'Free',
  low: '$',
  medium: '$$',
  high: '$$$',
  premium: '$$$$',
};

export default function PublicEventCard({ event, viewMode = 'grid' }: PublicEventCardProps) {
  const navigate = useNavigate();
  const isHosted = event.event_source === 'hosted';
  const displayName = event.display_name || event.name;
  const displayLocation = event.display_location || event.location || 'TBA';
  
  const handleClick = () => {
    if (isHosted) {
      navigate(`/events/${event.id}`);
    } else if (event.external_url) {
      window.open(event.external_url, '_blank', 'noopener,noreferrer');
    }
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    );
  };

  if (viewMode === 'list') {
    return (
      <Card 
        className="cursor-pointer hover:shadow-md transition-all duration-200 border-border/50 hover:border-border"
        onClick={handleClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              {/* Date badge */}
              <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                <span className="text-xs font-medium text-primary uppercase">
                  {format(new Date(event.start_date), 'MMM')}
                </span>
                <span className="text-xl font-bold text-primary">
                  {format(new Date(event.start_date), 'd')}
                </span>
              </div>

              {/* Event info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge 
                    variant="outline" 
                    className={isHosted 
                      ? 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800' 
                      : 'bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800'
                    }
                  >
                    {isHosted ? 'Hosted' : 'Industry'}
                  </Badge>
                  <Badge variant="secondary" className={eventTypeColors[event.event_type] || eventTypeColors.other}>
                    {eventTypeLabels[event.event_type] || 'Event'}
                  </Badge>
                </div>
                <h3 className="font-semibold text-foreground truncate">{displayName}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {displayLocation}
                  </span>
                </div>
              </div>
            </div>

            {/* Right side info */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {isHosted ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{event.capacity || '—'} capacity</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {event.startup_relevance && renderStarRating(event.startup_relevance)}
                  {event.ticket_cost_tier && (
                    <Badge variant="outline" className="text-xs">
                      <Ticket className="h-3 w-3 mr-1" />
                      {ticketCostLabels[event.ticket_cost_tier] || event.ticket_cost_tier}
                    </Badge>
                  )}
                </div>
              )}
              {!isHosted && (
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden border-border/50 hover:border-border"
      onClick={handleClick}
    >
      {/* Event header with gradient */}
      <div className={`h-32 relative ${
        isHosted 
          ? 'bg-gradient-to-br from-blue-500/20 via-primary/10 to-blue-600/20' 
          : 'bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-purple-600/20'
      }`}>
        {/* Date badge */}
        <div className="absolute top-3 left-3 bg-background/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            {format(new Date(event.start_date), 'MMM')}
          </p>
          <p className="text-xl font-bold text-foreground">
            {format(new Date(event.start_date), 'd')}
          </p>
        </div>

        {/* Event source badge */}
        <Badge 
          className={`absolute top-3 right-3 ${
            isHosted 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-purple-500 hover:bg-purple-600 text-white'
          }`}
        >
          {isHosted ? 'Hosted' : 'Industry'}
        </Badge>

        {/* Organizer */}
        {event.organizer_name && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm rounded-full px-2 py-1">
            <Building2 className="h-3 w-3" />
            {event.organizer_name}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Event type */}
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className={eventTypeColors[event.event_type] || eventTypeColors.other}>
            {eventTypeLabels[event.event_type] || 'Event'}
          </Badge>
          {!isHosted && event.external_url && (
            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {displayName}
        </h3>

        {/* Description */}
        {event.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {event.description}
          </p>
        )}

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{displayLocation}</span>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          {isHosted ? (
            <>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{event.capacity || '—'}</span>
              </div>
              {event.ticket_price !== null && event.ticket_price !== undefined && (
                <Badge variant="outline" className="text-xs">
                  {event.ticket_price === 0 ? 'Free' : `$${event.ticket_price}`}
                </Badge>
              )}
            </>
          ) : (
            <>
              {event.startup_relevance && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground mr-1">Relevance:</span>
                  {renderStarRating(event.startup_relevance)}
                </div>
              )}
              {event.ticket_cost_tier && (
                <Badge variant="outline" className="text-xs">
                  <Ticket className="h-3 w-3 mr-1" />
                  {ticketCostLabels[event.ticket_cost_tier] || event.ticket_cost_tier}
                </Badge>
              )}
            </>
          )}
        </div>

        {/* Topics/Tags */}
        {(event.topics?.length || event.tags?.length) && (
          <div className="flex flex-wrap gap-1 mt-3">
            {(event.topics || event.tags || []).slice(0, 3).map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs bg-muted/50">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
