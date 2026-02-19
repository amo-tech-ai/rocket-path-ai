import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  ExternalLink, 
  Star,
  Ticket,
  Share2,
  Clock,
  Building2,
  Globe,
  Tag
} from 'lucide-react';

import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { usePublicEvent } from '@/hooks/usePublicEvents';
import { useToast } from '@/hooks/use-toast';

const eventTypeLabels: Record<string, string> = {
  demo_day: 'Demo Day',
  pitch_night: 'Pitch Night',
  networking: 'Networking',
  workshop: 'Workshop',
  conference: 'Conference',
  other: 'Event',
};

const ticketCostLabels: Record<string, string> = {
  free: 'Free',
  low: '$',
  medium: '$$',
  high: '$$$',
  premium: '$$$$',
};

export default function PublicEventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: event, isLoading, error } = usePublicEvent(eventId);

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.display_name || event?.name,
          text: event?.description || 'Check out this event!',
          url,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link copied!',
        description: 'Event link has been copied to your clipboard.',
      });
    }
  };

  const renderStarRating = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-48 w-full rounded-xl mb-6" />
          <Skeleton className="h-8 w-2/3 mb-4" />
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The event you're looking for doesn't exist or is no longer available.
          </p>
          <Link to="/events">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const isHosted = event.event_source === 'hosted';
  const displayName = event.display_name || event.name;
  const displayLocation = event.display_location || event.location || 'Location TBA';
  const eventDate = new Date(event.start_date);
  const isPast = eventDate < new Date();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <Link 
          to="/events" 
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events Directory
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Hero section */}
          <Card className="overflow-hidden mb-8">
            <div className={`h-48 md:h-64 relative ${
              isHosted
                ? 'bg-gradient-to-br from-primary/20 via-primary/10 to-primary/20'
                : 'bg-gradient-to-br from-sage/20 via-sage/10 to-sage/20'
            }`}>
              {/* Date badge */}
              <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                <p className="text-sm font-medium text-muted-foreground uppercase">
                  {format(eventDate, 'EEEE')}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {format(eventDate, 'd')}
                </p>
                <p className="text-sm font-medium text-primary uppercase">
                  {format(eventDate, 'MMM yyyy')}
                </p>
              </div>

              {/* Event source badge */}
              <Badge
                className={`absolute top-4 right-4 ${
                  isHosted
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    : 'bg-sage hover:bg-sage/90 text-white'
                }`}
              >
                {isHosted ? 'Hosted Event' : 'Industry Event'}
              </Badge>

              {/* Status badge */}
              {isPast && (
                <Badge variant="secondary" className="absolute bottom-4 right-4">
                  Past Event
                </Badge>
              )}
            </div>

            <CardContent className="p-6 md:p-8">
              {/* Event type */}
              <Badge variant="secondary" className="mb-3">
                {eventTypeLabels[event.event_type] || 'Event'}
              </Badge>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {displayName}
              </h1>

              {/* Quick info row */}
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{format(eventDate, 'PPP')}</span>
                </div>
                {event.end_date && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(eventDate, 'h:mm a')} - {format(new Date(event.end_date), 'h:mm a')}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{displayLocation}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                {isHosted && event.registration_url && !isPast && (
                  <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="gap-2">
                      Register Now
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                )}
                {!isHosted && event.external_url && (
                  <a href={event.external_url} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="gap-2">
                      <Globe className="h-4 w-4" />
                      Visit Event Website
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                )}
                <Button variant="outline" size="lg" className="gap-2" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Details grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="md:col-span-2 space-y-6">
              {/* Description */}
              {event.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>About This Event</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Topics */}
              {event.topics && event.topics.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Topics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {event.topics.map((topic, idx) => (
                        <Badge key={idx} variant="secondary">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Event details card */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Organizer */}
                  {event.organizer_name && (
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Organizer</p>
                        <p className="font-medium">{event.organizer_name}</p>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Hosted event details */}
                  {isHosted && (
                    <>
                      {event.capacity && (
                        <div className="flex items-start gap-3">
                          <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Capacity</p>
                            <p className="font-medium">{event.capacity} attendees</p>
                          </div>
                        </div>
                      )}

                      {event.ticket_price !== null && event.ticket_price !== undefined && (
                        <div className="flex items-start gap-3">
                          <Ticket className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Ticket Price</p>
                            <p className="font-medium">
                              {event.ticket_price === 0 ? 'Free' : `$${event.ticket_price}`}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Industry event details */}
                  {!isHosted && (
                    <>
                      {event.startup_relevance && (
                        <div className="flex items-start gap-3">
                          <Star className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Startup Relevance</p>
                            <div className="mt-1">
                              {renderStarRating(event.startup_relevance)}
                            </div>
                          </div>
                        </div>
                      )}

                      {event.ticket_cost_tier && (
                        <div className="flex items-start gap-3">
                          <Ticket className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Ticket Cost</p>
                            <p className="font-medium">
                              {ticketCostLabels[event.ticket_cost_tier] || event.ticket_cost_tier}
                              {event.ticket_cost_min !== null && event.ticket_cost_max !== null && (
                                <span className="text-muted-foreground text-sm ml-2">
                                  (${event.ticket_cost_min} - ${event.ticket_cost_max})
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
