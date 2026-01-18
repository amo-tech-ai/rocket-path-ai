import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  Filter,
  SlidersHorizontal,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useEvents, useEventStats, EventFilters } from '@/hooks/useEvents';

import EventCard from '@/components/events/EventCard';
import EventsAIPanel from '@/components/events/EventsAIPanel';

export default function Events() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState<EventFilters>({
    date_range: 'all',
    status: [],
    event_type: [],
  });

  // Transform tab to filters
  const effectiveFilters: EventFilters = {
    ...filters,
    search: search || undefined,
    ...(activeTab === 'upcoming' ? { date_range: 'upcoming' as const } : {}),
    ...(activeTab === 'drafts' ? { status: ['draft'] } : {}),
    ...(activeTab === 'archive' ? { status: ['completed', 'cancelled'] } : {}),
  };

  const { data: events, isLoading } = useEvents(effectiveFilters);
  const { data: stats } = useEventStats();

  const networkingScore = 92; // Mock score - can be calculated from events data
  const roiEstimate = 15; // Mock ROI percentage

  return (
    <DashboardLayout>
      <div className="flex h-full bg-background">
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Breadcrumb & Header */}
          <div className="border-b bg-card/30">
            <div className="px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link to="/app" className="hover:text-foreground transition-colors">Home</Link>
                <span>›</span>
                <span className="text-foreground font-medium">Events Grid OS</span>
              </div>
              <Link to="/app/events/new">
                <Button className="gap-2 bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  Create New Event
                </Button>
              </Link>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 shadow-sm bg-card">
                <CardContent className="p-5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Total Events
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{stats?.total || 0}</span>
                    <span className="text-sm font-medium text-emerald-600 flex items-center gap-0.5">
                      +2%
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm bg-card">
                <CardContent className="p-5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Confirmed
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{stats?.confirmed || 0}</span>
                    <span className="text-sm text-muted-foreground">—</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm bg-card">
                <CardContent className="p-5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Networking Score
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-emerald-600">{networkingScore}%</span>
                    <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm bg-card">
                <CardContent className="p-5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    ROI Estimate
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-emerald-600">+{roiEstimate}%</span>
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-transparent p-0 h-auto gap-6">
                  <TabsTrigger 
                    value="all" 
                    className="px-0 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-foreground rounded-none font-medium"
                  >
                    All Events
                  </TabsTrigger>
                  <TabsTrigger 
                    value="upcoming" 
                    className="px-0 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-foreground rounded-none font-medium"
                  >
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger 
                    value="drafts" 
                    className="px-0 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-foreground rounded-none font-medium"
                  >
                    Drafts
                  </TabsTrigger>
                  <TabsTrigger 
                    value="archive" 
                    className="px-0 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-foreground rounded-none font-medium"
                  >
                    Archive
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2 h-9">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="gap-2 h-9">
                  <SlidersHorizontal className="h-4 w-4" />
                  Sort
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search events..." 
                className="pl-9 h-10 bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Events Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-40 w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : events && events.length > 0 ? (
              <motion.div 
                className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5' 
                  : 'space-y-4'
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
              <Card className="p-12 text-center border-dashed">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">No events yet</h3>
                    <p className="text-muted-foreground text-sm mb-4 max-w-sm mx-auto">
                      Create your first event to start managing demos, pitch nights, and investor meetups with AI
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
        </div>

        {/* Right Panel - AI Coach */}
        <div className="w-[340px] border-l bg-card/50 hidden xl:block overflow-auto">
          <EventsAIPanel events={events || []} stats={stats} />
        </div>
      </div>
    </DashboardLayout>
  );
}
