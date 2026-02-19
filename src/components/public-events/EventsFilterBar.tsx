import { useState } from 'react';
import { 
  Filter, 
  SlidersHorizontal, 
  Grid3X3, 
  List,
  Calendar,
  X
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PublicEventFilters } from '@/hooks/usePublicEvents';

interface EventsFilterBarProps {
  filters: PublicEventFilters;
  onFilterChange: (filters: Partial<PublicEventFilters>) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  totalEvents: number;
}

const eventTypeOptions = [
  { value: 'demo_day', label: 'Demo Day' },
  { value: 'pitch_night', label: 'Pitch Night' },
  { value: 'networking', label: 'Networking' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'conference', label: 'Conference' },
  { value: 'other', label: 'Other' },
];

const dateRangeOptions = [
  { value: 'all', label: 'All Dates' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'next_3_months', label: 'Next 3 Months' },
  { value: 'past', label: 'Past Events' },
];

const ticketCostOptions = [
  { value: 'free', label: 'Free' },
  { value: 'low', label: '$ (Low)' },
  { value: 'medium', label: '$$ (Medium)' },
  { value: 'high', label: '$$$ (High)' },
  { value: 'premium', label: '$$$$ (Premium)' },
];

export default function EventsFilterBar({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  totalEvents,
}: EventsFilterBarProps) {
  const activeFilterCount = 
    (filters.event_type?.length || 0) + 
    (filters.ticket_cost_tier?.length || 0) +
    (filters.date_range && filters.date_range !== 'all' ? 1 : 0);

  const handleEventTypeToggle = (type: string) => {
    const current = filters.event_type || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    onFilterChange({ event_type: updated });
  };

  const handleTicketCostToggle = (tier: string) => {
    const current = filters.ticket_cost_tier || [];
    const updated = current.includes(tier)
      ? current.filter(t => t !== tier)
      : [...current, tier];
    onFilterChange({ ticket_cost_tier: updated });
  };

  const clearAllFilters = () => {
    onFilterChange({
      event_source: 'all',
      date_range: 'all',
      event_type: [],
      ticket_cost_tier: [],
    });
  };

  return (
    <div className="space-y-4">
      {/* Primary tabs for event source */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Tabs 
          value={filters.event_source || 'all'} 
          onValueChange={(value) => onFilterChange({ event_source: value as 'all' | 'hosted' | 'industry' })}
        >
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-background">
              All Events
            </TabsTrigger>
            <TabsTrigger value="hosted" className="data-[state=active]:bg-background">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Hosted
              </div>
            </TabsTrigger>
            <TabsTrigger value="industry" className="data-[state=active]:bg-background">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                Industry
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center border rounded-lg p-0.5 bg-muted/30">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 px-2.5"
              onClick={() => onViewModeChange('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 px-2.5"
              onClick={() => onViewModeChange('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Secondary filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Date range */}
        <Select
          value={filters.date_range || 'all'}
          onValueChange={(value) => onFilterChange({ date_range: value as PublicEventFilters['date_range'] })}
        >
          <SelectTrigger className="w-[160px] h-9">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            {dateRangeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Event type filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-2">
              <Filter className="h-4 w-4" />
              Event Type
              {filters.event_type?.length ? (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {filters.event_type.length}
                </Badge>
              ) : null}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Event Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {eventTypeOptions.map(option => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={filters.event_type?.includes(option.value)}
                onCheckedChange={() => handleEventTypeToggle(option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Ticket cost filter (for industry events) */}
        {(filters.event_source === 'all' || filters.event_source === 'industry') && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Ticket Cost
                {filters.ticket_cost_tier?.length ? (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                    {filters.ticket_cost_tier.length}
                  </Badge>
                ) : null}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Ticket Cost Tier</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ticketCostOptions.map(option => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={filters.ticket_cost_tier?.includes(option.value)}
                  onCheckedChange={() => handleTicketCostToggle(option.value)}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Clear filters */}
        {activeFilterCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={clearAllFilters}
          >
            <X className="h-4 w-4" />
            Clear ({activeFilterCount})
          </Button>
        )}

        {/* Results count */}
        <div className="ml-auto text-sm text-muted-foreground">
          {totalEvents} event{totalEvents !== 1 ? 's' : ''} found
        </div>
      </div>
    </div>
  );
}
