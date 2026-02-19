import { Calendar, Clock, MapPin, Globe, Video, Users } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { WizardData } from '@/pages/EventWizard';

interface WizardStepLogisticsProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}

const timezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
];

export default function WizardStepLogistics({ data, updateData }: WizardStepLogisticsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Event Logistics</h2>
        <p className="text-muted-foreground">
          When and where will your event take place?
        </p>
      </div>

      <div className="space-y-6">
        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="event_date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="event_date"
              type="date"
              value={data.event_date}
              onChange={(e) => updateData({ event_date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Start Time
            </Label>
            <Input
              id="event_time"
              type="time"
              value={data.event_time}
              onChange={(e) => updateData({ event_time: e.target.value })}
            />
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-3">
          <Label className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Duration
            </span>
            <span className="font-medium">
              {data.duration_hours} {data.duration_hours === 1 ? 'hour' : 'hours'}
            </span>
          </Label>
          <Slider
            value={[data.duration_hours]}
            onValueChange={([value]) => updateData({ duration_hours: value })}
            min={1}
            max={12}
            step={0.5}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1h</span>
            <span>4h</span>
            <span>8h</span>
            <span>12h</span>
          </div>
        </div>

        {/* Timezone */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Timezone
          </Label>
          <Select
            value={data.timezone}
            onValueChange={(value) => updateData({ timezone: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Type */}
        <div className="space-y-3">
          <Label>Event Format</Label>
          <RadioGroup
            value={data.location_type}
            onValueChange={(value: 'in_person' | 'virtual' | 'hybrid') =>
              updateData({ location_type: value })
            }
            className="grid grid-cols-3 gap-3"
          >
            <Card className="relative">
              <label
                htmlFor="in_person"
                className={`flex flex-col items-center p-4 cursor-pointer rounded-lg border-2 transition-colors ${
                  data.location_type === 'in_person'
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent hover:bg-muted/50'
                }`}
              >
                <RadioGroupItem value="in_person" id="in_person" className="sr-only" />
                <MapPin className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">In Person</span>
              </label>
            </Card>

            <Card className="relative">
              <label
                htmlFor="virtual"
                className={`flex flex-col items-center p-4 cursor-pointer rounded-lg border-2 transition-colors ${
                  data.location_type === 'virtual'
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent hover:bg-muted/50'
                }`}
              >
                <RadioGroupItem value="virtual" id="virtual" className="sr-only" />
                <Video className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Virtual</span>
              </label>
            </Card>

            <Card className="relative">
              <label
                htmlFor="hybrid"
                className={`flex flex-col items-center p-4 cursor-pointer rounded-lg border-2 transition-colors ${
                  data.location_type === 'hybrid'
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent hover:bg-muted/50'
                }`}
              >
                <RadioGroupItem value="hybrid" id="hybrid" className="sr-only" />
                <Users className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Hybrid</span>
              </label>
            </Card>
          </RadioGroup>
        </div>

        {/* Venue Details (for in-person or hybrid) */}
        {(data.location_type === 'in_person' || data.location_type === 'hybrid') && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-2">
              <Label htmlFor="venue_name">Venue Name</Label>
              <Input
                id="venue_name"
                placeholder="e.g., The Innovation Hub"
                value={data.venue_name}
                onChange={(e) => updateData({ venue_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue_city">City</Label>
              <Input
                id="venue_city"
                placeholder="e.g., San Francisco, CA"
                value={data.venue_city}
                onChange={(e) => updateData({ venue_city: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
