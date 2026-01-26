import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Calendar, ArrowRight, Rocket } from 'lucide-react';

import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import EventsHero from '@/components/public-events/EventsHero';
import EventsFilterBar from '@/components/public-events/EventsFilterBar';
import PublicEventCard from '@/components/public-events/PublicEventCard';
import { usePublicEvents, usePublicEventStats, type PublicEventFilters } from '@/hooks/usePublicEvents';

export default function PublicEventsDirectory() {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<PublicEventFilters>({
    event_source: 'all',
    date_range: 'upcoming',
    event_type: [],
    ticket_cost_tier: [],
  });

  // Debounced search
  const effectiveFilters: PublicEventFilters = useMemo(() => ({
    ...filters,
    search: search || undefined,
  }), [filters, search]);

  const { data: events, isLoading } = usePublicEvents(effectiveFilters);
  const { data: stats } = usePublicEventStats();

  const handleFilterChange = (newFilters: Partial<PublicEventFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <EventsHero 
        searchValue={search}
        onSearchChange={setSearch}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Events</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">{stats.upcoming}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <p className="text-3xl font-bold text-foreground">{stats.hosted}</p>
                </div>
                <p className="text-sm text-muted-foreground">Hosted Events</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <p className="text-3xl font-bold text-foreground">{stats.industry}</p>
                </div>
                <p className="text-sm text-muted-foreground">Industry Events</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <EventsFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalEvents={events?.length || 0}
        />

        {/* Events Grid */}
        <div className="mt-6">
          {isLoading ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-32 w-full" />
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
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
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
                  transition={{ delay: index * 0.03 }}
                >
                  <PublicEventCard event={event} viewMode={viewMode} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <Card className="p-12 text-center border-dashed border-2">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">No events found</h3>
                  <p className="text-muted-foreground text-sm mb-4 max-w-sm mx-auto">
                    {search 
                      ? `No events matching "${search}". Try a different search term.`
                      : 'No events match your current filters. Try adjusting your criteria.'
                    }
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearch('');
                      setFilters({
                        event_source: 'all',
                        date_range: 'all',
                        event_type: [],
                        ticket_cost_tier: [],
                      });
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* CTA Section */}
        <section className="mt-16 py-12 px-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-purple-500/10 border border-border/50">
          <div className="max-w-2xl mx-auto text-center">
            <Rocket className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Hosting Your Own Event?
            </h2>
            <p className="text-muted-foreground mb-6">
              Create and manage demo days, pitch nights, and networking events with AI-powered 
              planning tools. Get your event in front of the startup community.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/login">
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Create Your Event
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="outline" size="lg" className="gap-2">
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
