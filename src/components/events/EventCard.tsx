import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Calendar, 
  MapPin, 
  User, 
  Users,
  CheckCircle2,
  MoreVertical,
  Rocket,
  Globe
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

// Priority mapping based on event status and health
const getPriority = (event: EventWithRelations) => {
  const healthScore = event.health_score || 0;
  if (healthScore < 30) return { label: 'CRITICAL', className: 'bg-red-500 text-white' };
  if (healthScore < 50) return { label: 'HIGH PRIORITY', className: 'bg-emerald-500 text-white' };
  if (healthScore < 70) return { label: 'MEDIUM PRIORITY', className: 'bg-amber-100 text-amber-800' };
  return { label: 'LOW PRIORITY', className: 'bg-gray-100 text-gray-700' };
};

// Event image placeholders based on type
const eventImages: Record<string, string> = {
  demo_day: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop',
  pitch_night: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=200&fit=crop',
  networking: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=200&fit=crop',
  workshop: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=200&fit=crop',
  investor_meetup: 'https://images.unsplash.com/photo-1560439514-4e9645039924?w=400&h=200&fit=crop',
  founder_dinner: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop',
  hackathon: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=200&fit=crop',
  conference: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=200&fit=crop',
  webinar: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=400&h=200&fit=crop',
  other: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop',
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
  const priority = getPriority(event);
  const attendeeCount = event.attendee_count || 0;
  const eventImage = eventImages[event.event_type] || eventImages.other;
  
  // Get primary venue
  const primaryVenue = event.venues?.find(v => v.is_primary) || event.venues?.[0];
  const locationName = primaryVenue?.name || primaryVenue?.city;

  // Format date & time
  const formattedDate = event.event_date 
    ? format(new Date(event.event_date), 'MMM dd, yyyy')
    : 'Date TBD';
  const formattedTime = event.event_date 
    ? format(new Date(event.event_date), 'h:mm a')
    : '';
  const isFullDay = event.event_type === 'conference' || event.event_type === 'hackathon';

  // Mock data for demo purposes
  const assignee = 'Team Lead';
  const statusInfo = event.status === 'confirmed' ? 'Booth Secured' : null;

  if (viewMode === 'list') {
    return (
      <Link to={`/app/events/${event.id}`}>
        <Card className="hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden">
          <div className="flex">
            {/* Image */}
            <div className="relative w-32 h-24 shrink-0">
              <img 
                src={eventImage} 
                alt={event.name}
                className="w-full h-full object-cover"
              />
              <Badge className={`absolute top-2 left-2 text-[10px] font-semibold ${priority.className}`}>
                {priority.label}
              </Badge>
            </div>
            
            {/* Content */}
            <div className="flex-1 p-4 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold line-clamp-1">{event.name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formattedDate}
                  </span>
                  {locationName && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {locationName}
                    </span>
                  )}
                </div>
              </div>
              
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
          </div>
        </Card>
      </Link>
    );
  }

  // Grid view - Premium card design
  return (
    <Link to={`/app/events/${event.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border-0 shadow-sm bg-card">
        {/* Image Section */}
        <div className="relative h-36 overflow-hidden">
          <img 
            src={eventImage} 
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          {/* Priority Badge */}
          <Badge className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide ${priority.className}`}>
            {priority.label}
          </Badge>

          {/* Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.preventDefault()}
              >
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

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
            {event.name}
          </h3>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {formattedDate}
              {formattedTime && !isFullDay && ` • ${formattedTime}`}
              {isFullDay && ' • Full Day'}
            </span>
          </div>

          {/* Assignee / Owner */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{assignee}</span>
          </div>

          {/* Bottom row - Status or Location info */}
          <div className="pt-1">
            {statusInfo ? (
              <div className="flex items-center gap-2 text-sm text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-medium">{statusInfo}</span>
              </div>
            ) : attendeeCount > 0 ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{attendeeCount} RSVPs Confirmed</span>
              </div>
            ) : locationName ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {event.location_type === 'virtual' ? (
                  <Globe className="h-4 w-4 text-blue-500" />
                ) : (
                  <MapPin className="h-4 w-4 text-emerald-600" />
                )}
                <span>{locationName}</span>
              </div>
            ) : event.event_type ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Rocket className="h-4 w-4" />
                <span>{typeLabels[event.event_type]}</span>
              </div>
            ) : null}
          </div>
        </div>
      </Card>
    </Link>
  );
}
