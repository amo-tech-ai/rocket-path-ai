#!/usr/bin/env tsx
/**
 * Download Event Images Script (MCP Firecrawl)
 * 
 * 1. Lists events with URLs that need images
 * 2. Uses Firecrawl MCP to scrape and download images
 * 3. Uploads to Supabase Storage
 * 4. Updates database
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

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
}

interface ImageManifest {
  [eventId: string]: {
    url: string;
    downloaded: boolean;
    uploaded: boolean;
    storage_path?: string;
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
// Step 1: List events needing images
// ============================================================================

async function listEventsNeedingImages(limit?: number): Promise<Event[]> {
  console.log('📥 Loading events from Supabase...\n');
  
  let query = supabase
    .from('industry_events')
    .select('id, name, full_name, website_url, image_url, image_path')
    .or('image_url.is.null,image_path.is.null')
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
    const hasImage = event.image_url ? '✅' : '❌';
    console.log(`${index + 1}. ${event.name}`);
    console.log(`   URL: ${url}`);
    console.log(`   Image: ${hasImage}`);
    console.log(`   ID: ${event.id}`);
    console.log('');
  });
  console.log(`Total: ${events.length} events\n`);

  return events;
}

// ============================================================================
// Step 2: Use MCP Firecrawl to scrape page and extract images
// ============================================================================

/**
 * Note: This function should be called from Cursor Agent with MCP tools.
 * For standalone execution, we'll use a fallback to direct API calls.
 */
async function scrapePageWithFirecrawl(url: string): Promise<{
  images: string[];
  ogImage?: string;
}> {
  // Try to use MCP if available (when run from Cursor Agent)
  // Otherwise fallback to direct API
  
  const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
  if (!FIRECRAWL_API_KEY) {
    throw new Error('FIRECRAWL_API_KEY is required');
  }

  console.log(`  🔍 Scraping: ${url}`);

  try {
    // Direct API call (fallback when MCP not available)
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      throw new Error(`Firecrawl scrape failed: ${response.statusText}`);
    }

    const result = await response.json();
    const data = result?.data || {};

    // Extract images
    const images: string[] = [];
    let ogImage: string | undefined;

    // OG image from metadata
    if (data.metadata?.ogImage) {
      ogImage = data.metadata.ogImage;
      images.push(ogImage);
    } else if (data.openGraph?.image) {
      ogImage = data.openGraph.image;
      images.push(ogImage);
    }

    // All images from page
    if (data.images && Array.isArray(data.images)) {
      data.images.forEach((img: string) => {
        if (img && !images.includes(img)) {
          images.push(img);
        }
      });
    }

    // Filter out very small images and icons
    const validImages = images.filter(img => {
      // Skip favicons, icons, small images
      const lower = img.toLowerCase();
      return !lower.includes('favicon') && 
             !lower.includes('icon') && 
             !lower.match(/\.(ico|svg)$/);
    });

    console.log(`  ✅ Found ${validImages.length} image(s)`);
    return {
      images: validImages,
      ogImage: ogImage || validImages[0]
    };
  } catch (error: any) {
    console.error(`  ❌ Error scraping:`, error.message);
    throw error;
  }
}

// ============================================================================
// Step 3: Download image
// ============================================================================

async function downloadImage(url: string, destination: string): Promise<boolean> {
  try {
    // Handle relative URLs
    let imageUrl = url;
    if (url.startsWith('//')) {
      imageUrl = 'https:' + url;
    } else if (url.startsWith('/')) {
      // Skip relative URLs for now
      return false;
    }

    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EventEnrichment/1.0)'
      }
    });

    if (!response.ok) {
      return false;
    }

    const buffer = await response.arrayBuffer();
    const fs = await import('fs/promises');
    await fs.writeFile(destination, Buffer.from(buffer));
    return true;
  } catch (error) {
    return false;
  }
}

// ============================================================================
// Step 4: Upload to Supabase Storage
// ============================================================================

async function uploadImageToStorage(
  eventId: string,
  localPath: string,
  filename: string
): Promise<{ url: string; path: string } | null> {
  try {
    const fs = await import('fs/promises');
    const fileBuffer = await fs.readFile(localPath);

    const storagePath = `industry-events/${eventId}/${filename}`;

    const { error } = await supabase.storage
      .from('industry-events')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/webp',
        upsert: true
      });

    if (error) {
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('industry-events')
      .getPublicUrl(storagePath);

    return {
      url: urlData.publicUrl,
      path: storagePath
    };
  } catch (error) {
    return null;
  }
}

// ============================================================================
// Step 5: Update database
// ============================================================================

async function updateEventImage(
  eventId: string,
  imageUrl: string,
  imagePath: string
): Promise<void> {
  const { error } = await supabase
    .from('industry_events')
    .update({
      image_url: imageUrl,
      image_path: imagePath,
      updated_at: new Date().toISOString()
    })
    .eq('id', eventId);

  if (error) {
    throw new Error(`Failed to update: ${error.message}`);
  }
}

// ============================================================================
// Main download process
// ============================================================================

async function downloadEventImage(event: Event): Promise<{ success: boolean; error?: string; imageUrl?: string }> {
  console.log(`\n📅 Processing: ${event.name}`);
  console.log(`   ID: ${event.id}`);

  try {
    // Check if we have a URL
    if (!event.website_url) {
      return {
        success: false,
        error: 'No website_url - cannot scrape images'
      };
    }

    // Step 1: Scrape page with Firecrawl (MCP or API)
    const { images, ogImage } = await scrapePageWithFirecrawl(event.website_url);

    if (images.length === 0) {
      return {
        success: false,
        error: 'No images found on page'
      };
    }

    // Step 2: Download best image (OG image or first valid image)
    const imageUrl = ogImage || images[0];
    const eventDir = join(EVENTS_IMAGES_DIR, event.id);
    if (!existsSync(eventDir)) {
      mkdirSync(eventDir, { recursive: true });
    }

    const localPath = join(eventDir, 'image.webp');
    const downloaded = await downloadImage(imageUrl, localPath);

    if (!downloaded) {
      return {
        success: false,
        error: 'Failed to download image'
      };
    }

    console.log(`  ✅ Downloaded: ${imageUrl.substring(0, 60)}...`);

    // Step 3: Upload to Supabase Storage
    const uploadResult = await uploadImageToStorage(
      event.id,
      localPath,
      'image.webp'
    );

    if (!uploadResult) {
      return {
        success: false,
        error: 'Failed to upload to storage'
      };
    }

    console.log(`  ✅ Uploaded to: ${uploadResult.url}`);

    // Step 4: Update database
    await updateEventImage(event.id, uploadResult.url, uploadResult.path);

    console.log(`  ✅ Database updated`);

    return {
      success: true,
      imageUrl: uploadResult.url
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

// ============================================================================
// Main execution
// ============================================================================

async function main() {
  const limit = process.argv[2] ? parseInt(process.argv[2]) : undefined;
  
  console.log('🚀 Event Image Downloader (MCP Firecrawl)\n');

  const runLog: RunLog = {
    start_time: new Date().toISOString(),
    end_time: null,
    total_events: 0,
    processed: 0,
    successful: 0,
    failed: 0,
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
        runLog.successful++;
        eventInfo.status = 'success';
        imageManifest[event.id] = {
          url: result.imageUrl!,
          downloaded: true,
          uploaded: true,
          storage_path: `industry-events/${event.id}/image.webp`
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
    runLog.end_time = new Date().toISOString();
    writeFileSync(
      join(OUTPUT_DIR, 'run_log.json'),
      JSON.stringify(runLog, null, 2)
    );
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('download-event-images')) {
  main().catch(console.error);
}

export { main, downloadEventImage, listEventsNeedingImages };
