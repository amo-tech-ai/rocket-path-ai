/**
 * Industry Event Image Component
 * 
 * Production-safe Cloudinary integration with fallback to Supabase Storage
 */

import { getEventImageUrlWithFallback } from '@/lib/cloudinary';

interface IndustryEventImageProps {
  event: {
    cloudinary_public_id?: string | null;
    image_url?: string | null;
    name?: string;
  };
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}

export function IndustryEventImage({
  event,
  width = 800,
  height,
  className = '',
  alt
}: IndustryEventImageProps) {
  const imageUrl = getEventImageUrlWithFallback(event, {
    width,
    height,
    format: 'auto',
    quality: 'auto'
  });

  if (!imageUrl) {
    return (
      <div className={`bg-gradient-to-br from-sage to-sage/70 flex items-center justify-center ${className}`}>
        <span className="text-white/70 text-sm">📅 {event.name || 'Event'}</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt || event.name || 'Event image'}
      className={className}
      loading="lazy"
    />
  );
}
