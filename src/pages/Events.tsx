import { useState } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  Filter,
  Sparkles,
  Target,
  Clock,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useEvents, useEventStats, EventFilters } from '@/hooks/useEvents';

import EventCard from '@/components/events/EventCard';
import EventsAIPanel from '@/components/events/EventsAIPanel';
import EventFiltersPanel from '@/components/events/EventFiltersPanel';

export default function Events() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<EventFilters>({
    date_range: 'all',
    status: [],
    event_type: [],
  });

  const { data: events, isLoading } = useEvents({
    ...filters,
    search: search || undefined,
  });

  const { data: stats } = useEventStats();

  const handleFilterChange = (newFilters: Partial<EventFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <DashboardLayout>
      <div className="flex h-full">
        {/* Left Panel - Filters */}
        <div className="w-60 border-r bg-card/50 p-4 hidden lg:block">
          <EventFiltersPanel 
            filters={filters} 
            onFilterChange={handleFilterChange}
            stats={stats}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Events</h1>
              <p className="text-muted-foreground">
                Manage your startup events and demos
              </p>
            </div>
            <Link to="/app/events/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Event
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{stats?.upcoming || 0}</p>
                  <p className="text-xs text-muted-foreground">Upcoming</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{stats?.thisWeek || 0}</p>
                  <p className="text-xs text-muted-foreground">This Week</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Target className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{stats?.confirmed || 0}</p>
                  <p className="text-xs text-muted-foreground">Confirmed</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{stats?.completed || 0}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Search & View Toggle */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search events..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 border rounded-lg p-1">
              <Button 
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Events Grid/List */}
          {isLoading ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' 
              : 'space-y-3'
            }>
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-32 w-full mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </Card>
              ))}
            </div>
          ) : events && events.length > 0 ? (
            <motion.div 
              className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' 
                : 'space-y-3'
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <EventCard 
                    event={event} 
                    viewMode={viewMode}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-muted">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">No events yet</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Create your first event to get started with AI-powered planning
                  </p>
                  <Link to="/app/events/new">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create Event
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Panel - AI Coach */}
        <div className="w-80 border-l bg-card/50 p-4 hidden xl:block">
          <EventsAIPanel events={events || []} stats={stats} />
        </div>
      </div>
    </DashboardLayout>
  );
}
