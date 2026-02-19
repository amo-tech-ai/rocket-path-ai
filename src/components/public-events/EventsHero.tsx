import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface EventsHeroProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function EventsHero({ searchValue, onSearchChange }: EventsHeroProps) {
  return (
    <section className="relative bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 mx-auto max-w-4xl text-center">
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
          Discover Startup Events
        </h1>
        
        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Find demo days, pitch nights, conferences, and networking opportunities from 
          the startup ecosystem. Connect with founders, investors, and industry leaders.
        </p>

        {/* Search bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="search"
            placeholder="Search events, conferences, meetups..."
            className="h-14 pl-12 pr-4 text-base rounded-xl shadow-lg border-border/50 bg-background focus-visible:ring-primary"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Quick stats */}
        <div className="flex items-center justify-center gap-8 mt-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Hosted Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Industry Events</span>
          </div>
        </div>
      </div>
    </section>
  );
}
