import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Target,
  Video,
  Globe,
  FileText,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { WizardData } from '@/pages/EventWizard';

interface WizardStepReviewProps {
  data: WizardData;
}

const eventTypeLabels: Record<string, string> = {
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

const locationTypeLabels: Record<string, { label: string; icon: any }> = {
  in_person: { label: 'In Person', icon: MapPin },
  virtual: { label: 'Virtual', icon: Video },
  hybrid: { label: 'Hybrid', icon: Globe },
};

export default function WizardStepReview({ data }: WizardStepReviewProps) {
  const LocationIcon = locationTypeLabels[data.location_type]?.icon || MapPin;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review Your Event</h2>
        <p className="text-muted-foreground">
          Everything look good? Click "Create Event" to finish.
        </p>
      </div>

      {/* Event Header Preview */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
          <Badge className="mb-3">
            {eventTypeLabels[data.event_type] || data.event_type}
          </Badge>
          <h3 className="text-2xl font-bold mb-2">{data.name || 'Untitled Event'}</h3>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {data.event_date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {format(new Date(data.event_date), 'EEEE, MMMM d, yyyy')}
              </span>
            )}
            {data.event_time && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {data.event_time}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <LocationIcon className="h-4 w-4" />
              {locationTypeLabels[data.location_type]?.label}
              {data.venue_city && ` • ${data.venue_city}`}
            </span>
          </div>
        </div>

        {data.description && (
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">{data.description}</p>
          </CardContent>
        )}
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strategy */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-xs font-medium text-muted-foreground uppercase">Goals</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {data.goals.length > 0 ? (
                  data.goals.map((goal) => (
                    <Badge key={goal} variant="secondary" className="text-xs">
                      {goal}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No goals set</span>
                )}
              </div>
            </div>

            {data.target_audience && (
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase">
                  Target Audience
                </span>
                <p className="text-sm capitalize mt-0.5">
                  {data.target_audience.replace('_', ' ')}
                </p>
              </div>
            )}

            {data.success_metrics.length > 0 && (
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase">
                  Success Metrics
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {data.success_metrics.map((metric) => (
                    <Badge key={metric} variant="outline" className="text-xs">
                      {metric}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Logistics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Logistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                Expected Attendees
              </span>
              <span className="font-medium">{data.expected_attendees}</span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                Budget
              </span>
              <span className="font-medium">${data.budget.toLocaleString()}</span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Duration
              </span>
              <span className="font-medium">
                {data.duration_hours} {data.duration_hours === 1 ? 'hour' : 'hours'}
              </span>
            </div>

            {data.venue_name && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Venue
                  </span>
                  <span className="font-medium text-right">
                    {data.venue_name}
                    {data.venue_city && <span className="text-muted-foreground"> • {data.venue_city}</span>}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Next Steps Preview */}
      <Card className="border-dashed">
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground text-center">
            After creation, you'll be able to add sponsors, manage attendees,
            create marketing assets, and track event performance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
