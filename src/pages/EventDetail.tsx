import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  MoreHorizontal,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  Building2,
  Globe,
  Send,
  Lightbulb,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useEvent, useEventAttendees, useEventSponsors, useEventVenues } from '@/hooks/useEvents';

// Status badge styling
const statusStyles: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  planning: 'bg-status-warning-light text-status-warning',
  confirmed: 'bg-status-success text-white',
  in_progress: 'bg-status-info text-white',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-800',
};

// RSVP status styling
const rsvpStyles: Record<string, string> = {
  invited: 'bg-muted text-muted-foreground',
  pending: 'bg-status-warning-light text-status-warning border-status-warning/20',
  registered: 'bg-status-info-light text-status-info border-status-info/20',
  confirmed: 'bg-status-success-light text-status-success border-status-success/20',
  declined: 'bg-red-100 text-red-800 border-red-200',
  waitlist: 'bg-primary/10 text-primary border-primary/20',
  checked_in: 'bg-status-success text-white',
};

// Sponsor tier styling
const tierStyles: Record<string, string> = {
  platinum: 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-800',
  gold: 'bg-gradient-to-r from-status-warning/30 to-status-warning/40 text-status-warning',
  silver: 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800',
  bronze: 'bg-gradient-to-r from-warm to-warm text-warm-foreground',
  community: 'bg-muted text-muted-foreground',
  in_kind: 'bg-status-info-light text-status-info',
};

// Placeholder image based on event type
const eventPlaceholders: Record<string, string> = {
  demo_day: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
  pitch_night: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop',
  networking: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop',
  workshop: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop',
  investor_meetup: 'https://images.unsplash.com/photo-1560439514-4e9645039924?w=800&h=400&fit=crop',
  founder_dinner: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
  hackathon: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
  conference: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop',
  webinar: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&h=400&fit=crop',
  other: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
};

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [chatMessage, setChatMessage] = useState('');

  const { data: event, isLoading: eventLoading } = useEvent(id);
  const { data: attendees = [] } = useEventAttendees(id);
  const { data: sponsors = [] } = useEventSponsors(id);
  const { data: venues = [] } = useEventVenues(id);

  const primaryVenue = venues.find(v => v.is_primary) || venues[0];
  const confirmedAttendees = attendees.filter(a => ['confirmed', 'checked_in'].includes(a.rsvp_status));
  const confirmedSponsors = sponsors.filter(s => s.status === 'confirmed');
  const totalSponsorRevenue = confirmedSponsors.reduce((acc, s) => acc + (s.amount || 0), 0);

  if (eventLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 p-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!event) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <AlertCircle className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Event not found</h2>
          <Link to="/app/events">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const eventImage = event.cover_image_url || eventPlaceholders[event.event_type] || eventPlaceholders.other;
  const formattedDate = event.start_date ? format(new Date(event.start_date), 'MMM dd, yyyy') : 'TBD';
  const formattedTime = event.start_date ? format(new Date(event.start_date), 'h:mm a') : '';
  const healthScore = event.health_score || 0;
  const taskProgress = event.tasks_total ? Math.round((event.tasks_completed || 0) / event.tasks_total * 100) : 0;

  return (
    <DashboardLayout>
      <div className="flex h-full bg-background">
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Breadcrumb */}
          <div className="border-b bg-card/30">
            <div className="px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link to="/app" className="hover:text-foreground transition-colors">Home</Link>
                <span>›</span>
                <Link to="/app/events" className="hover:text-foreground transition-colors">Events</Link>
                <span>›</span>
                <span className="text-foreground font-medium truncate max-w-[200px]">{event.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Edit Event</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem>Export</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Cancel Event</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Hero Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h1 className="text-3xl font-serif font-bold tracking-tight">{event.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formattedDate} {formattedTime && `• ${formattedTime}`}
                </span>
                {primaryVenue && (
                  <span className="flex items-center gap-1.5">
                    {event.location_type === 'virtual' ? (
                      <Globe className="h-4 w-4" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                    {primaryVenue.name || primaryVenue.city}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Badge className={statusStyles[event.status] || statusStyles.draft}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1).replace('_', ' ')}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Change Status</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <Card className="border-0 shadow-sm bg-card">
                <CardContent className="p-5">
                  <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">
                    Guests
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{confirmedAttendees.length}</span>
                    <span className="text-muted-foreground text-sm">/ {event.capacity || '∞'} cap</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm bg-card">
                <CardContent className="p-5">
                  <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">
                    Budget
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">
                      ${((event.budget || 0) / 1000).toFixed(1)}k
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm bg-card">
                <CardContent className="p-5">
                  <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">
                    Status
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold capitalize">
                      {event.status.replace('_', ' ')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-transparent p-0 h-auto gap-6 border-b w-full justify-start rounded-none">
                <TabsTrigger 
                  value="overview" 
                  className="px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-foreground rounded-none font-medium"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="guests" 
                  className="px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-foreground rounded-none font-medium"
                >
                  Guests ({attendees.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="sponsors" 
                  className="px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-foreground rounded-none font-medium"
                >
                  Sponsors ({sponsors.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="logistics" 
                  className="px-0 py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-foreground rounded-none font-medium"
                >
                  Logistics
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Guest List Preview */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                      <CardTitle className="text-lg font-semibold">Guest List</CardTitle>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Guest
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs font-semibold text-primary uppercase">Name</TableHead>
                            <TableHead className="text-xs font-semibold text-primary uppercase">Role</TableHead>
                            <TableHead className="text-xs font-semibold text-primary uppercase">RSVP</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {attendees.slice(0, 4).map((attendee) => (
                            <TableRow key={attendee.id}>
                              <TableCell className="font-medium">{attendee.name}</TableCell>
                              <TableCell className="text-muted-foreground italic text-sm">
                                {attendee.title || 'Guest'}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={rsvpStyles[attendee.rsvp_status]}>
                                  {attendee.rsvp_status.charAt(0).toUpperCase() + attendee.rsvp_status.slice(1)}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                          {attendees.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                                No guests added yet
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                      {attendees.length > 4 && (
                        <Button 
                          variant="ghost" 
                          className="w-full mt-2 text-muted-foreground"
                          onClick={() => setActiveTab('guests')}
                        >
                          View all {attendees.length} guests
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  {/* Venue Logistics */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold">Venue Logistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Map Placeholder */}
                      <div className="relative h-32 bg-muted rounded-lg overflow-hidden">
                        <img 
                          src={eventImage}
                          alt="Venue"
                          className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                            <MapPin className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </div>

                      {primaryVenue ? (
                        <>
                          <div>
                            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Location</p>
                            <p className="font-medium">{primaryVenue.name}</p>
                            {primaryVenue.address && <p className="text-sm text-muted-foreground">{primaryVenue.address}</p>}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Arrival</p>
                              <p className="font-medium">{formattedTime || 'TBD'}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Catering</p>
                              <p className="font-medium">{primaryVenue.catering_available ? 'Available' : 'Self-catered'}</p>
                            </div>
                          </div>

                          {(primaryVenue.wifi_available || primaryVenue.av_equipment) && (
                            <div>
                              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Tech Requirements</p>
                              <ul className="text-sm space-y-1">
                                {primaryVenue.wifi_available && <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-status-success" /> WiFi Available</li>}
                                {primaryVenue.av_equipment && <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-status-success" /> AV Equipment</li>}
                              </ul>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No venue selected yet</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Find Venue
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Task Progress */}
                {event.tasks_total && event.tasks_total > 0 && (
                  <Card>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Task Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {event.tasks_completed || 0} / {event.tasks_total} completed
                        </span>
                      </div>
                      <Progress value={taskProgress} className="h-2" />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Guests Tab */}
              <TabsContent value="guests" className="mt-0">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">All Guests</CardTitle>
                    <Button className="gap-2 bg-primary">
                      <Plus className="h-4 w-4" />
                      Add Guest
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs font-semibold text-primary uppercase">Name</TableHead>
                          <TableHead className="text-xs font-semibold text-primary uppercase">Email</TableHead>
                          <TableHead className="text-xs font-semibold text-primary uppercase">Company</TableHead>
                          <TableHead className="text-xs font-semibold text-primary uppercase">Role</TableHead>
                          <TableHead className="text-xs font-semibold text-primary uppercase">RSVP</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendees.map((attendee) => (
                          <TableRow key={attendee.id}>
                            <TableCell className="font-medium">{attendee.name}</TableCell>
                            <TableCell className="text-muted-foreground">{attendee.email}</TableCell>
                            <TableCell>{attendee.company || '-'}</TableCell>
                            <TableCell className="text-muted-foreground italic">{attendee.title || 'Guest'}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={rsvpStyles[attendee.rsvp_status]}>
                                {attendee.rsvp_status.charAt(0).toUpperCase() + attendee.rsvp_status.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        {attendees.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                              No guests added yet. Add your first guest to get started.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Sponsors Tab */}
              <TabsContent value="sponsors" className="mt-0">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">Sponsors</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {confirmedSponsors.length} confirmed • ${totalSponsorRevenue.toLocaleString()} total
                      </p>
                    </div>
                    <Button className="gap-2 bg-primary">
                      <Plus className="h-4 w-4" />
                      Add Sponsor
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs font-semibold text-primary uppercase">Name</TableHead>
                          <TableHead className="text-xs font-semibold text-primary uppercase">Contact</TableHead>
                          <TableHead className="text-xs font-semibold text-primary uppercase">Tier</TableHead>
                          <TableHead className="text-xs font-semibold text-primary uppercase">Amount</TableHead>
                          <TableHead className="text-xs font-semibold text-primary uppercase">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sponsors.map((sponsor) => (
                          <TableRow key={sponsor.id}>
                            <TableCell className="font-medium">{sponsor.name}</TableCell>
                            <TableCell className="text-muted-foreground">{sponsor.contact_name || sponsor.contact_email || '-'}</TableCell>
                            <TableCell>
                              <Badge className={tierStyles[sponsor.tier]}>
                                {sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>${(sponsor.amount || 0).toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={sponsor.status === 'confirmed' ? 'bg-status-success-light text-status-success' : ''}>
                                {sponsor.status.charAt(0).toUpperCase() + sponsor.status.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        {sponsors.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                              No sponsors added yet. Start reaching out to potential sponsors.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Logistics Tab */}
              <TabsContent value="logistics" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Venues */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg font-semibold">Venues</CardTitle>
                      <Button variant="outline" size="sm">Find Venue</Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {venues.map((venue) => (
                        <div key={venue.id} className="p-4 border rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{venue.name}</h4>
                            {venue.is_primary && <Badge variant="secondary">Primary</Badge>}
                          </div>
                          {venue.address && <p className="text-sm text-muted-foreground">{venue.address}</p>}
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            {venue.capacity && <span>Capacity: {venue.capacity}</span>}
                            {venue.rental_cost && <span>Cost: ${venue.rental_cost}</span>}
                          </div>
                        </div>
                      ))}
                      {venues.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No venues added yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Event Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Event Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Description</p>
                        <p className="text-sm">{event.description || 'No description provided'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Type</p>
                          <p className="text-sm capitalize">{event.event_type.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Visibility</p>
                          <p className="text-sm">{event.is_public ? 'Public' : 'Private'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Ticket Price</p>
                          <p className="text-sm">{event.ticket_price ? `$${event.ticket_price}` : 'Free'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Location Type</p>
                          <p className="text-sm capitalize">{event.location_type?.replace('_', ' ') || 'TBD'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Panel - AI Coach */}
        <div className="w-[340px] border-l bg-card/50 hidden xl:block overflow-auto">
          <div className="p-5 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sage-light flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold">AI Event Coach</span>
            </div>

            {/* Smart Suggestions */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wide">
                Smart Suggestions
              </h3>
              <div className="space-y-3">
                <div className="p-3 border-l-2 border-primary bg-card rounded-r-lg">
                  <p className="text-sm font-medium mb-2">Send 24h reminder</p>
                  <Button variant="outline" size="sm" className="w-full">Draft Email</Button>
                </div>
                <div className="p-3 border-l-2 border-status-warning bg-card rounded-r-lg">
                  <p className="text-sm font-medium mb-2">Check microphone setup</p>
                  <Button variant="outline" size="sm" className="w-full">Ping Tech Team</Button>
                </div>
              </div>
            </div>

            {/* Event Health */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wide">
                Event Health
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Guest Ratio</span>
                  <span className="font-semibold">{healthScore}% Match</span>
                </div>
                <Progress value={healthScore} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground italic">
                "The current mix of attendees is optimal for networking outcomes."
              </p>
            </div>

            {/* Pro Tip */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-status-warning" />
                  <span className="text-xs font-bold uppercase">Protip</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  "Boutique events thrive on personal touches. Add handwritten place cards for the confirmed VIPs."
                </p>
              </CardContent>
            </Card>

            {/* Chat Input */}
            <div className="pt-4 border-t">
              <div className="flex gap-2">
                <Input 
                  placeholder="Ask about this event..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="text-sm"
                />
                <Button size="icon" className="shrink-0 bg-primary">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
