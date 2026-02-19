#!/usr/bin/env tsx
/**
 * Download Event Images Script (Production-Safe with Cloudinary)
 * 
 * 1. Lists events with URLs that need images
 * 2. Uses Firecrawl to scrape and download images
 * 3. Uploads to Cloudinary using upload_stream (production-correct)
 * 4. Updates database with cloudinary_public_id and secure_url
 * 5. Idempotent (safe to re-run)
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

// Load environment variables
config({ path: join(PROJECT_ROOT, '.env.local') });

// Types
interface Event {
  id: string;
  name: string;
  full_name: string | null;
  website_url: string | null;
  image_url: string | null;
  image_path: string | null;
  cloudinary_public_id: string | null;
}

interface ImageManifest {
  [eventId: string]: {
    url: string;
    downloaded: boolean;
    uploaded: boolean;
    cloudinary_public_id?: string;
    error?: string;
  };
}

interface RunLog {
  start_time: string;
  end_time: string | null;
  total_events: number;
  processed: number;
  successful: number;
  failed: number;
  skipped: number;
  events_list: Array<{
    id: string;
    name: string;
    website_url: string | null;
    status: 'success' | 'failed' | 'skipped';
    error?: string;
  }>;
}

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yvyesmiczbjqwbqtlidy.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configure Cloudinary (backend only - secrets never exposed to browser)
const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudinaryCloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
  throw new Error('Cloudinary credentials required (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)');
}

cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
  secure: true, // Always use HTTPS
});

// Directories
const EVENTS_IMAGES_DIR = join(PROJECT_ROOT, 'events', 'images');
const OUTPUT_DIR = join(PROJECT_ROOT, 'events', 'enrichment');

// Ensure directories exist
[EVENTS_IMAGES_DIR, OUTPUT_DIR].forEach(dir => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
});

// ============================================================================
// Step 1: List events needing images (idempotent - skip if already has Cloudinary)
// ============================================================================

async function listEventsNeedingImages(limit?: number): Promise<Event[]> {
  console.log('📥 Loading events from Supabase...\n');
  
  let query = supabase
    .from('industry_events')
    .select('id, name, full_name, website_url, image_url, image_path, cloudinary_public_id')
    .or('cloudinary_public_id.is.null,image_url.is.null')
    .order('created_at', { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load events: ${error.message}`);
  }

  const events = (data || []) as Event[];

  // Display list
  console.log('📋 Events needing images:');
  console.log('='.repeat(80));
  events.forEach((event, index) => {
    const url = event.website_url || '❌ No URL';
    const hasCloudinary = event.cloudinary_public_id ? '✅ Cloudinary' : '❌';
    const hasSupabase = event.image_url ? '✅ Supabase' : '❌';
    console.log(`${index + 1}. ${event.name}`);
    console.log(`   URL: ${url}`);
    console.log(`   Cloudinary: ${hasCloudinary}`);
    console.log(`   Supabase: ${hasSupabase}`);
    console.log(`   ID: ${event.id}`);
    console.log('');
  });
  console.log(`Total: ${events.length} events\n`);

  return events;
}

// ============================================================================
// Step 2: Scrape page with Firecrawl
// ============================================================================

async function scrapePageWithFirecrawl(url: string, retryCount = 0): Promise<{
  images: string[];
  mainImage?: string;
}> {
  const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
  if (!FIRECRAWL_API_KEY) {
    throw new Error('FIRECRAWL_API_KEY is required');
  }

  console.log(`  🔍 Scraping: ${url}${retryCount > 0 ? ` (retry ${retryCount})` : ''}`);

  try {
    // Try scrape API first
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      // Retry on timeout (408 or 504)
      if ((response.status === 408 || response.status === 504) && retryCount < 2) {
        console.log(`  ⏳ Timeout, retrying in 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        return scrapePageWithFirecrawl(url, retryCount + 1);
      }
      throw new Error(`Firecrawl scrape failed: ${response.statusText}`);
    }

    const result = await response.json();
    const data = result?.data || {};

    // Extract images with priority scoring
    const images: Array<{ url: string; priority: number; keywords: string[] }> = [];
    let ogImage: string | undefined;

    // Priority 1: OG Image (highest priority)
    if (data.metadata?.ogImage) {
      ogImage = data.metadata.ogImage;
      images.push({ url: ogImage, priority: 100, keywords: ['og-image'] });
    } else if (data.openGraph?.image) {
      ogImage = data.openGraph.image;
      images.push({ url: ogImage, priority: 100, keywords: ['og-image'] });
    }

    // Priority 2: Hero/Banner/Cover images (main event image)
    const mainImageKeywords = ['hero', 'banner', 'cover', 'main', 'featured', 'event-image', 'event-image', 'header-image'];
    
    if (data.images && Array.isArray(data.images)) {
      data.images.forEach((img: string) => {
        if (!img) return;
        
        const lower = img.toLowerCase();
        const urlLower = new URL(img, url).pathname.toLowerCase();
        
        // Skip icons and small images
        if (lower.includes('favicon') || 
            lower.includes('icon') || 
            lower.match(/\.(ico|svg)$/) ||
            urlLower.includes('icon') ||
            urlLower.includes('logo') && !urlLower.includes('hero')) {
          return;
        }

        // Calculate priority based on keywords in URL
        let priority = 50; // Default priority
        const foundKeywords: string[] = [];
        
        for (const keyword of mainImageKeywords) {
          if (lower.includes(keyword) || urlLower.includes(keyword)) {
            priority = 90; // High priority for hero/banner/cover
            foundKeywords.push(keyword);
            break;
          }
        }

        // Boost priority for common event image patterns
        if (lower.includes('event') || urlLower.includes('event')) {
          priority = Math.max(priority, 80);
          foundKeywords.push('event');
        }

        // Check for large image indicators (usually main images)
        if (lower.match(/\d{3,4}x\d{3,4}/) || // Dimensions in filename (e.g., 1200x800)
            lower.includes('large') ||
            lower.includes('full')) {
          priority = Math.max(priority, 75);
          foundKeywords.push('large');
        }

        images.push({ url: img, priority, keywords: foundKeywords });
      });
    }

    // Sort by priority (highest first)
    images.sort((a, b) => b.priority - a.priority);

    const validImages = images.map(img => img.url);
    const mainImage = validImages[0] || ogImage;

    if (mainImage) {
      const mainImageData = images.find(img => img.url === mainImage);
      console.log(`  ✅ Found ${validImages.length} image(s)`);
      console.log(`  🎯 Main image: ${mainImage.substring(0, 60)}...`);
      if (mainImageData && mainImageData.keywords.length > 0) {
        console.log(`     Keywords: ${mainImageData.keywords.join(', ')}`);
      }
    } else {
      console.log(`  ⚠️  Found ${validImages.length} image(s), but none suitable`);
    }

    // If no images found with scrape, try extract API as fallback
    if (validImages.length === 0) {
      console.log(`  🔄 No images found with scrape, trying extract API...`);
      return await extractPageWithFirecrawl(url);
    }

    return {
      images: validImages,
      mainImage
    };
  } catch (error: any) {
    // Retry on timeout
    if (error.message.includes('Timeout') && retryCount < 2) {
      console.log(`  ⏳ Timeout, retrying in 3 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      return scrapePageWithFirecrawl(url, retryCount + 1);
    }
    console.error(`  ❌ Error scraping:`, error.message);
    throw error;
  }
}

// Fallback: Use Firecrawl extract API for better image extraction
async function extractPageWithFirecrawl(url: string): Promise<{
  images: string[];
  mainImage?: string;
}> {
  const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
  if (!FIRECRAWL_API_KEY) {
    throw new Error('FIRECRAWL_API_KEY is required');
  }

  try {
    const response = await fetch('https://api.firecrawl.dev/v1/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({
        url,
        extractorOptions: {
          mode: 'llm-extraction',
          extractionPrompt: 'Extract all image URLs from this page, especially the main event image, hero image, banner, or cover image. Return as JSON array of image URLs.'
        }
      })
    });

    if (!response.ok) {
      return { images: [], mainImage: undefined };
    }

    const result = await response.json();
    const extractedData = result?.data?.extracted || {};
    
    // Try to parse extracted images
    let images: string[] = [];
    
    // Check if extractor returned image URLs
    if (extractedData.images && Array.isArray(extractedData.images)) {
      images = extractedData.images;
    } else if (extractedData.imageUrls && Array.isArray(extractedData.imageUrls)) {
      images = extractedData.imageUrls;
    } else if (typeof extractedData === 'string') {
      // Try to parse JSON string
      try {
        const parsed = JSON.parse(extractedData);
        if (Array.isArray(parsed)) {
          images = parsed;
        }
      } catch {
        // Not JSON, skip
      }
    }

    // Filter valid images
    const validImages = images.filter(img => {
      if (!img || typeof img !== 'string') return false;
      const lower = img.toLowerCase();
      return !lower.includes('favicon') && 
             !lower.includes('icon') && 
             !lower.match(/\.(ico|svg)$/);
    });

    if (validImages.length > 0) {
      console.log(`  ✅ Found ${validImages.length} image(s) via extract API`);
      return {
        images: validImages,
        mainImage: validImages[0]
      };
    }

    return { images: [], mainImage: undefined };
  } catch (error: any) {
    console.log(`  ⚠️  Extract API also failed: ${error.message}`);
    return { images: [], mainImage: undefined };
  }
}

// ============================================================================
// Step 3: Download image
// ============================================================================

async function downloadImage(url: string, destination: string): Promise<Buffer | null> {
  try {
    let imageUrl = url;
    if (url.startsWith('//')) {
      imageUrl = 'https:' + url;
    } else if (url.startsWith('/')) {
      return null; // Skip relative URLs
    }

    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EventEnrichment/1.0)'
      }
    });

    if (!response.ok) {
      return null;
    }

    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  } catch (error) {
    return null;
  }
}

// ============================================================================
// Step 4: Upload to Cloudinary (PRODUCTION-CORRECT with upload_stream)
// ============================================================================

async function uploadImageToCloudinary(
  eventId: string,
  imageBuffer: Buffer
): Promise<{ public_id: string; secure_url: string; version: number } | null> {
  try {
    console.log(`  ☁️  Uploading to Cloudinary...`);

    // Use upload_stream for buffers (production-correct)
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'industry-events',
          public_id: `${eventId}/image`,
          resource_type: 'image',
          overwrite: true,
          format: 'webp',
          transformation: [
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );

      // Write buffer to stream
      stream.end(imageBuffer);
    });

    console.log(`  ✅ Uploaded: ${result.public_id}`);
    console.log(`     URL: ${result.secure_url.substring(0, 60)}...`);

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      version: result.version
    };
  } catch (error: any) {
    console.error(`  ❌ Upload failed:`, error.message);
    // Don't log full error (might contain secrets)
    return null;
  }
}

// ============================================================================
// Step 5: Update database (idempotent)
// ============================================================================

async function updateEventImage(
  eventId: string,
  cloudinaryData: { public_id: string; secure_url: string; version: number }
): Promise<void> {
  const { error } = await supabase
    .from('industry_events')
    .update({
      image_url: cloudinaryData.secure_url, // Store secure_url
      cloudinary_public_id: cloudinaryData.public_id,
      cloudinary_version: cloudinaryData.version,
      cloudinary_folder: 'industry-events',
      updated_at: new Date().toISOString()
    })
    .eq('id', eventId);

  if (error) {
    throw new Error(`Failed to update: ${error.message}`);
  }
}

// ============================================================================
// Main download process (idempotent)
// ============================================================================

async function downloadEventImage(event: Event): Promise<{ 
  success: boolean; 
  error?: string; 
  cloudinary_public_id?: string;
  skipped?: boolean;
}> {
  console.log(`\n📅 Processing: ${event.name}`);
  console.log(`   ID: ${event.id}`);

  try {
    // Idempotent check: Skip if already has Cloudinary image
    if (event.cloudinary_public_id) {
      console.log(`  ⏭️  Already has Cloudinary image, skipping`);
      return {
        success: true,
        skipped: true,
        cloudinary_public_id: event.cloudinary_public_id
      };
    }

    // Check if we have a URL
    if (!event.website_url) {
      return {
        success: false,
        error: 'No website_url - cannot scrape images'
      };
    }

    // Step 1: Scrape page with Firecrawl
    const { images, mainImage } = await scrapePageWithFirecrawl(event.website_url);

    if (images.length === 0) {
      return {
        success: false,
        error: 'No images found on page'
      };
    }

    // Step 2: Download main image (prioritized by hero/banner/cover/OG)
    const imageUrl = mainImage || images[0];
    const eventDir = join(EVENTS_IMAGES_DIR, event.id);
    if (!existsSync(eventDir)) {
      mkdirSync(eventDir, { recursive: true });
    }

    const imageBuffer = await downloadImage(imageUrl, '');

    if (!imageBuffer) {
      return {
        success: false,
        error: 'Failed to download image'
      };
    }

    console.log(`  ✅ Downloaded: ${imageUrl.substring(0, 60)}...`);

    // Step 3: Upload to Cloudinary (production-correct with upload_stream)
    const cloudinaryResult = await uploadImageToCloudinary(event.id, imageBuffer);

    if (!cloudinaryResult) {
      return {
        success: false,
        error: 'Failed to upload to Cloudinary'
      };
    }

    // Step 4: Update database
    await updateEventImage(event.id, cloudinaryResult);

    console.log(`  ✅ Database updated`);

    return {
      success: true,
      cloudinary_public_id: cloudinaryResult.public_id
    };
  } catch (error: any) {
    // Don't log full error (might contain secrets)
    const errorMessage = error.message || 'Unknown error';
    console.error(`  ❌ Error: ${errorMessage}`);
    return {
      success: false,
      error: errorMessage
    };
  }
}

// ============================================================================
// Main execution
// ============================================================================

async function main() {
  const limit = process.argv[2] ? parseInt(process.argv[2]) : undefined;
  
  console.log('🚀 Event Image Downloader (Cloudinary - Production-Safe)\n');

  const runLog: RunLog = {
    start_time: new Date().toISOString(),
    end_time: null,
    total_events: 0,
    processed: 0,
    successful: 0,
    failed: 0,
    skipped: 0,
    events_list: []
  };

  const imageManifest: ImageManifest = {};

  try {
    // Step 1: List events
    const events = await listEventsNeedingImages(limit);
    runLog.total_events = events.length;

    if (events.length === 0) {
      console.log('✅ No events need images!');
      return;
    }

    // Step 2: Process each event
    for (const event of events) {
      runLog.processed++;
      
      const eventInfo = {
        id: event.id,
        name: event.name,
        website_url: event.website_url,
        status: 'failed' as const,
        error: undefined as string | undefined
      };

      const result = await downloadEventImage(event);

      if (result.success) {
        if (result.skipped) {
          runLog.skipped++;
          eventInfo.status = 'skipped';
        } else {
          runLog.successful++;
          eventInfo.status = 'success';
        }
        imageManifest[event.id] = {
          url: event.website_url || '',
          downloaded: true,
          uploaded: true,
          cloudinary_public_id: result.cloudinary_public_id
        };
      } else {
        runLog.failed++;
        eventInfo.status = 'failed';
        eventInfo.error = result.error;
        imageManifest[event.id] = {
          url: event.website_url || '',
          downloaded: false,
          uploaded: false,
          error: result.error
        };
      }

      runLog.events_list.push(eventInfo);
    }

    runLog.end_time = new Date().toISOString();

    // Save output files
    writeFileSync(
      join(OUTPUT_DIR, 'run_log.json'),
      JSON.stringify(runLog, null, 2)
    );

    writeFileSync(
      join(OUTPUT_DIR, 'images_manifest.json'),
      JSON.stringify(imageManifest, null, 2)
    );

    // Print summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total events: ${runLog.total_events}`);
    console.log(`✅ Successful: ${runLog.successful}`);
    console.log(`⏭️  Skipped: ${runLog.skipped}`);
    console.log(`❌ Failed: ${runLog.failed}`);
    
    if (runLog.failed > 0) {
      console.log('\n❌ Failed events:');
      runLog.events_list
        .filter(e => e.status === 'failed')
        .forEach(e => {
          console.log(`  - ${e.name}`);
          console.log(`    URL: ${e.website_url || 'N/A'}`);
          console.log(`    Error: ${e.error}`);
        });
    }

    console.log(`\n📁 Files saved:`);
    console.log(`  - ${join(OUTPUT_DIR, 'run_log.json')}`);
    console.log(`  - ${join(OUTPUT_DIR, 'images_manifest.json')}`);
    console.log(`  - Images: ${EVENTS_IMAGES_DIR}`);

  } catch (error: any) {
    console.error('\n❌ Fatal error:', error.message);
    // Don't log full error (might contain secrets)
    runLog.end_time = new Date().toISOString();
    writeFileSync(
      join(OUTPUT_DIR, 'run_log.json'),
      JSON.stringify(runLog, null, 2)
    );
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('download-event-images-cloudinary')) {
  main().catch(console.error);
}

export { main, downloadEventImage, listEventsNeedingImages };
