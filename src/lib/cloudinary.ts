/**
 * Cloudinary Helper (Frontend)
 * 
 * Production-safe: Only uses cloud name (no secrets exposed)
 * Generates optimized image URLs with transformations
 */

import { Cloudinary } from '@cloudinary/url-gen';
import { scale, fill } from '@cloudinary/url-gen/actions/resize';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';

// Frontend: Only cloud name (safe - no secrets)
// Handle both browser (import.meta.env) and Node.js (process.env) contexts
const getCloudName = () => {
  if (typeof window !== 'undefined') {
    // Browser context (Vite)
    return import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME;
  } else {
    // Node.js context (for testing)
    return process.env.VITE_CLOUDINARY_CLOUD_NAME;
  }
};

const cloudName = getCloudName();

if (!cloudName) {
  if (typeof window !== 'undefined') {
    console.warn('VITE_CLOUDINARY_CLOUD_NAME not set - Cloudinary features disabled');
  }
}

export const cld = cloudName ? new Cloudinary({
  cloud: {
    cloudName: cloudName
  }
}) : null;

/**
 * Generate optimized Cloudinary image URL from public_id
 */
export function getEventImageUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg';
  quality?: 'auto' | number;
}): string | null {
  if (!cld) {
    // In Node.js context, try to create instance if not already created
    const cloudName = typeof window !== 'undefined' 
      ? import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME
      : process.env.VITE_CLOUDINARY_CLOUD_NAME;
    
    if (!cloudName || !publicId) return null;
    
    // Create temporary instance for Node.js testing
    const tempCld = new Cloudinary({ cloud: { cloudName } });
    return buildImageUrl(tempCld, publicId, options);
  }
  
  if (!publicId) return null;
  
  return buildImageUrl(cld, publicId, options);
}

function buildImageUrl(
  cldInstance: Cloudinary,
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    format?: 'auto' | 'webp' | 'avif' | 'jpg';
    quality?: 'auto' | number;
  }
): string | null {
  if (!cldInstance || !publicId) return null;

  const { width, height, format: formatOption = 'auto', quality: qualityOption = 'auto' } = options || {};

  let img = cldInstance.image(publicId)
    .delivery(format(formatOption))
    .delivery(quality(qualityOption));

  // Resize if dimensions provided
  if (width && height) {
    img = img.resize(fill().width(width).height(height));
  } else if (width) {
    img = img.resize(scale().width(width));
  } else if (height) {
    img = img.resize(scale().height(height));
  }

  return img.toURL();
}

/**
 * Get event image URL with fallback to Supabase Storage
 * 
 * Priority:
 * 1. Cloudinary (if cloudinary_public_id exists)
 * 2. Supabase Storage (if image_url exists)
 * 3. null (no image)
 */
export function getEventImageUrlWithFallback(
  event: { 
    cloudinary_public_id?: string | null; 
    image_url?: string | null;
  },
  options?: {
    width?: number;
    height?: number;
    format?: 'auto' | 'webp' | 'avif' | 'jpg';
    quality?: 'auto' | number;
  }
): string | null {
  // Prefer Cloudinary if public_id exists
  if (event.cloudinary_public_id) {
    const cloudinaryUrl = getEventImageUrl(event.cloudinary_public_id, options);
    if (cloudinaryUrl) return cloudinaryUrl;
  }

  // Fallback to Supabase Storage URL
  return event.image_url || null;
}

/**
 * Generate responsive image URLs for different breakpoints
 */
export function getResponsiveImageUrls(
  publicId: string,
  breakpoints: number[] = [400, 800, 1200, 1600]
): string[] {
  if (!cld || !publicId) return [];

  return breakpoints.map(width => 
    getEventImageUrl(publicId, { width, format: 'auto', quality: 'auto' }) || ''
  ).filter(Boolean);
}

/**
 * Extract public_id from Cloudinary URL
 * Useful for migration/debugging
 */
export function extractPublicIdFromUrl(url: string): string | null {
  if (!url) return null;

  // Cloudinary URL pattern: https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}
  const match = url.match(/\/image\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return match ? match[1] : null;
}
