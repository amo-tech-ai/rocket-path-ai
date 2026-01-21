import { 
  Calendar, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Video,
  Phone,
  Target,
  Clock3,
  Flag,
  Bell,
  MoreHorizontal
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { EventFilters } from '@/hooks/useEvents';

interface EventFiltersPanelProps {
  filters: EventFilters;
  onFilterChange: (filters: Partial<EventFilters>) => void;
  stats?: {
    total: number;
    upcoming: number;
    draft?: number;
    planning?: number;
    confirmed?: number;
    completed?: number;
  } | null;
}

// Status options matching the actual event_status enum
const statusOptions = [
  { value: 'scheduled', label: 'Scheduled', icon: <Clock className="h-4 w-4" /> },
  { value: 'in_progress', label: 'In Progress', icon: <Clock3 className="h-4 w-4" /> },
  { value: 'completed', label: 'Completed', icon: <CheckCircle2 className="h-4 w-4" /> },
  { value: 'cancelled', label: 'Cancelled', icon: <XCircle className="h-4 w-4" /> },
  { value: 'rescheduled', label: 'Rescheduled', icon: <Calendar className="h-4 w-4" /> },
];

// Type options matching the actual event_type enum
const typeOptions = [
  { value: 'meeting', label: 'Meeting', icon: <Video className="h-4 w-4" /> },
  { value: 'call', label: 'Call', icon: <Phone className="h-4 w-4" /> },
  { value: 'demo', label: 'Demo', icon: <Target className="h-4 w-4" /> },
  { value: 'pitch', label: 'Pitch', icon: <Target className="h-4 w-4" /> },
  { value: 'deadline', label: 'Deadline', icon: <Flag className="h-4 w-4" /> },
  { value: 'milestone', label: 'Milestone', icon: <CheckCircle2 className="h-4 w-4" /> },
  { value: 'reminder', label: 'Reminder', icon: <Bell className="h-4 w-4" /> },
  { value: 'funding_round', label: 'Funding Round', icon: <Target className="h-4 w-4" /> },
  { value: 'other', label: 'Other', icon: <MoreHorizontal className="h-4 w-4" /> },
];

export default function EventFiltersPanel({ 
  filters, 
  onFilterChange,
  stats 
}: EventFiltersPanelProps) {
  const handleStatusToggle = (status: string) => {
    const current = filters.status || [];
    const updated = current.includes(status)
      ? current.filter(s => s !== status)
      : [...current, status];
    onFilterChange({ status: updated });
  };

  const handleTypeToggle = (type: string) => {
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
