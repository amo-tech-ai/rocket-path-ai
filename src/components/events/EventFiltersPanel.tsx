import { 
  Calendar, 
  Filter, 
  CheckCircle2, 
  Clock, 
  FileEdit, 
  XCircle,
  Mic2,
  Users,
  Presentation,
  Coffee,
  Code,
  Video,
  PartyPopper
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { EventFilters } from '@/hooks/useEvents';
import type { Enums } from '@/integrations/supabase/types';

type StartupEventStatus = Enums<'startup_event_status'>;
type StartupEventType = Enums<'startup_event_type'>;

interface EventFiltersPanelProps {
  filters: EventFilters;
  onFilterChange: (filters: Partial<EventFilters>) => void;
  stats?: {
    total: number;
    upcoming: number;
    draft: number;
    planning: number;
    confirmed: number;
    completed: number;
  } | null;
}

const statusOptions: { value: StartupEventStatus; label: string; icon: React.ReactNode }[] = [
  { value: 'draft', label: 'Draft', icon: <FileEdit className="h-4 w-4" /> },
  { value: 'planning', label: 'Planning', icon: <Clock className="h-4 w-4" /> },
  { value: 'confirmed', label: 'Confirmed', icon: <CheckCircle2 className="h-4 w-4" /> },
  { value: 'live', label: 'Live', icon: <Mic2 className="h-4 w-4" /> },
  { value: 'completed', label: 'Completed', icon: <CheckCircle2 className="h-4 w-4" /> },
  { value: 'cancelled', label: 'Cancelled', icon: <XCircle className="h-4 w-4" /> },
];

const typeOptions: { value: StartupEventType; label: string; icon: React.ReactNode }[] = [
  { value: 'demo_day', label: 'Demo Day', icon: <Presentation className="h-4 w-4" /> },
  { value: 'pitch_night', label: 'Pitch Night', icon: <Mic2 className="h-4 w-4" /> },
  { value: 'networking', label: 'Networking', icon: <Users className="h-4 w-4" /> },
  { value: 'workshop', label: 'Workshop', icon: <Code className="h-4 w-4" /> },
  { value: 'investor_meetup', label: 'Investor Meetup', icon: <Users className="h-4 w-4" /> },
  { value: 'founder_dinner', label: 'Founder Dinner', icon: <Coffee className="h-4 w-4" /> },
  { value: 'hackathon', label: 'Hackathon', icon: <Code className="h-4 w-4" /> },
  { value: 'webinar', label: 'Webinar', icon: <Video className="h-4 w-4" /> },
  { value: 'conference', label: 'Conference', icon: <PartyPopper className="h-4 w-4" /> },
];

export default function EventFiltersPanel({ 
  filters, 
  onFilterChange,
  stats 
}: EventFiltersPanelProps) {
  const handleStatusToggle = (status: StartupEventStatus) => {
    const current = filters.status || [];
    const updated = current.includes(status)
      ? current.filter(s => s !== status)
      : [...current, status];
    onFilterChange({ status: updated });
  };

  const handleTypeToggle = (type: StartupEventType) => {
    const current = filters.event_type || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    onFilterChange({ event_type: updated });
  };

  const clearFilters = () => {
    onFilterChange({
      status: [],
      event_type: [],
      date_range: 'all',
    });
  };

  const hasActiveFilters = 
    (filters.status && filters.status.length > 0) ||
    (filters.event_type && filters.event_type.length > 0) ||
    filters.date_range !== 'all';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filters</span>
        </div>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs"
            onClick={clearFilters}
          >
            Clear all
          </Button>
        )}
      </div>

      <Separator />

      {/* Quick Stats */}
      {stats && (
        <>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase">Quick Stats</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-muted/50">
                <p className="text-lg font-semibold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/50">
                <p className="text-lg font-semibold">{stats.upcoming}</p>
                <p className="text-xs text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Date Range */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase">Date Range</p>
        <RadioGroup 
          value={filters.date_range || 'all'}
          onValueChange={(value) => onFilterChange({ date_range: value as 'all' | 'upcoming' | 'past' })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="text-sm cursor-pointer">All Events</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="upcoming" id="upcoming" />
            <Label htmlFor="upcoming" className="text-sm cursor-pointer">Upcoming</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="past" id="past" />
            <Label htmlFor="past" className="text-sm cursor-pointer">Past</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      {/* Status Filter */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase">Status</p>
        <div className="space-y-2">
          {statusOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`status-${option.value}`}
                checked={filters.status?.includes(option.value)}
                onCheckedChange={() => handleStatusToggle(option.value)}
              />
              <Label 
                htmlFor={`status-${option.value}`} 
                className="text-sm cursor-pointer flex items-center gap-2"
              >
                {option.icon}
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Type Filter */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase">Event Type</p>
        <div className="space-y-2">
          {typeOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`type-${option.value}`}
                checked={filters.event_type?.includes(option.value)}
                onCheckedChange={() => handleTypeToggle(option.value)}
              />
              <Label 
                htmlFor={`type-${option.value}`} 
                className="text-sm cursor-pointer flex items-center gap-2"
              >
                {option.icon}
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
