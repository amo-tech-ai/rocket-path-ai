/**
 * Cloudinary Helper (Frontend)
 * 
 * Production-safe: Only uses cloud name (no secrets exposed)
 * Generates optimized image URLs with transformations
 * 
 * Note: Cloudinary SDK removed - using URL-based approach for simplicity
 */

// Frontend: Only cloud name (safe - no secrets)
const getCloudName = () => {
  if (typeof window !== 'undefined') {
    return import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME;
  } else {
    return process.env.VITE_CLOUDINARY_CLOUD_NAME;
  }
};

const cloudName = getCloudName();

if (!cloudName && typeof window !== 'undefined') {
  console.warn('VITE_CLOUDINARY_CLOUD_NAME not set - Cloudinary features disabled');
}

/**
 * Generate Cloudinary image URL from public_id using URL construction
 */
export function getEventImageUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg';
  quality?: 'auto' | number;
}): string | null {
  const currentCloudName = cloudName || getCloudName();
  if (!currentCloudName || !publicId) return null;

  const { width, height, format = 'auto', quality = 'auto' } = options || {};

  // Build transformation string
  const transforms: string[] = [];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width && height) transforms.push('c_fill');
  else if (width || height) transforms.push('c_scale');
  transforms.push(`f_${format}`);
  transforms.push(typeof quality === 'number' ? `q_${quality}` : 'q_auto');

  const transformString = transforms.join(',');
  return `https://res.cloudinary.com/${currentCloudName}/image/upload/${transformString}/${publicId}`;
}

/**
 * Get event image URL with fallback to Supabase Storage
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
  if (event.cloudinary_public_id) {
    const cloudinaryUrl = getEventImageUrl(event.cloudinary_public_id, options);
    if (cloudinaryUrl) return cloudinaryUrl;
  }
  return event.image_url || null;
}

/**
 * Generate responsive image URLs for different breakpoints
 */
export function getResponsiveImageUrls(
  publicId: string,
  breakpoints: number[] = [400, 800, 1200, 1600]
): string[] {
  if (!publicId) return [];
  return breakpoints
    .map(width => getEventImageUrl(publicId, { width, format: 'auto', quality: 'auto' }) || '')
    .filter(Boolean);
}
