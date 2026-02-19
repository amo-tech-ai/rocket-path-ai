import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  category?: string;
  imageUrl?: string;
}

export function EventCard({ 
  title = "Rhythm & Beats Music Festival",
  date = "APR 20",
  location = "Sunset Park, Los Angeles, CA",
  category = "Networking",
  imageUrl
}: Partial<EventCardProps> = {}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.35 }}
      className="card-premium overflow-hidden"
    >
      {/* Image placeholder with gradient */}
      <div className="relative h-32 bg-gradient-to-br from-sage to-sage/70 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white/70 text-sm">🎵 {title}</span>
        )}
        
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-medium uppercase tracking-wide text-white/90 bg-black/20 px-2 py-1 rounded-full">
            {category}
          </span>
        </div>

        {/* Date badge */}
        <div className="absolute bottom-3 right-3 bg-primary text-white text-center px-2 py-1 rounded-lg">
          <div className="text-[10px] font-medium uppercase">
            {date.split(' ')[0]}
          </div>
          <div className="text-lg font-bold leading-none">
            {date.split(' ')[1]}
          </div>
        </div>
      </div>

      <div className="p-4">
        <h4 className="font-semibold text-foreground mb-2">{title}</h4>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <MapPin className="w-3.5 h-3.5 text-destructive" />
          <span>{location}</span>
        </div>
        <Button variant="outline" size="sm" className="w-full">
          View Details
        </Button>
      </div>
    </motion.div>
  );
}