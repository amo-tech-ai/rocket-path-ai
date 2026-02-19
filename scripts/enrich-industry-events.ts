#!/usr/bin/env tsx
/**
 * Industry Events Enrichment Script
 * 
 * Enriches existing industry_events with:
 * - Official website URLs
 * - Event images (OG, hero, logo)
 * - Dates, location, format
 * - Speakers, pricing
 * 
 * Uses Firecrawl MCP for web scraping and data extraction
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

// Load environment variables
import { config } from 'dotenv';
config({ path: join(PROJECT_ROOT, '.env.local') });

// Firecrawl API client
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const FIRECRAWL_API_URL = 'https://api.firecrawl.dev';

async function firecrawlSearch(query: string, limit: number = 5): Promise<any> {
  if (!FIRECRAWL_API_KEY) {
    throw new Error('FIRECRAWL_API_KEY is required');
  }

  const response = await fetch(`${FIRECRAWL_API_URL}/v1/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
    },
    body: JSON.stringify({ query, limit })
  });

  if (!response.ok) {
    throw new Error(`Firecrawl search failed: ${response.statusText}`);
  }

  return response.json();
}

async function firecrawlScrape(url: string): Promise<any> {
  if (!FIRECRAWL_API_KEY) {
    throw new Error('FIRECRAWL_API_KEY is required');
  }

  const response = await fetch(`${FIRECRAWL_API_URL}/v1/scrape`, {
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

  return response.json();
}

async function firecrawlExtract(url: string, schema: any): Promise<any> {
  if (!FIRECRAWL_API_KEY) {
    throw new Error('FIRECRAWL_API_KEY is required');
  }

  const response = await fetch(`${FIRECRAWL_API_URL}/v1/extract`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
    },
    body: JSON.stringify({ url, schema })
  });

  if (!response.ok) {
    throw new Error(`Firecrawl extract failed: ${response.statusText}`);
  }

  return response.json();
}

// Types
interface Event {
  id: string;
  name: string;
  full_name: string | null;
  website_url: string | null;
  image_url: string | null;
  image_path: string | null;
  event_date: string | null;
  end_date: string | null;
  location_city: string | null;
  location_country: string | null;
  format: 'in_person' | 'virtual' | 'hybrid' | null;
  enrichment_status: string | null;
  source_domain: string | null;
  enrichment_metadata: Record<string, any> | null;
}

interface EnrichmentQueue {
  events: Event[];
  created_at: string;
}

interface RunLog {
  start_time: string;
  end_time: string | null;
  total_events: number;
  processed: number;
  successful: number;
  failed: number;
  errors: Array<{ event_id: string; event_name: string; error: string }>;
}

interface ImageManifest {
  [eventId: string]: {
    og?: string;
    hero?: string;
    logo?: string;
    uploaded: boolean;
    storage_path?: string;
  };
}

// Initialize Supabase client (using service role for admin operations)
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
// Step 1: Load events from Supabase that need enrichment
// ============================================================================

async function loadEventsNeedingEnrichment(limit?: number): Promise<Event[]> {
  console.log('📥 Loading events from Supabase...');
  
  let query = supabase
    .from('industry_events')
    .select('id, name, full_name, website_url, image_url, image_path, event_date, end_date, location_city, location_country, format, enrichment_status, source_domain, enrichment_metadata')
    .or('website_url.is.null,image_url.is.null,image_path.is.null')
    .order('created_at', { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load events: ${error.message}`);
  }

  console.log(`✅ Loaded ${data?.length || 0} events needing enrichment`);
  return (data || []) as Event[];
}

// ============================================================================
// Step 2: Find official event page using Firecrawl MCP
// ============================================================================

async function findOfficialEventPage(eventName: string, year: number = 2026): Promise<{ url: string; domain: string } | null> {
  console.log(`  🔍 Searching for official page: ${eventName} ${year}`);
  
  try {
    // Use Firecrawl MCP search tool
    const searchQuery = `${eventName} ${year} official site`;
    
    // Use Firecrawl API directly
    const result = await firecrawlSearch(searchQuery, 5);

    // Firecrawl search returns { data: [{ url, title, ... }] }
    const results = result?.data || result?.results || [];
    
    if (results.length > 0) {
      // Pick the first result that looks like an official page
      const officialResult = results.find((r: any) => 
        r.url && (
          r.url.includes(eventName.toLowerCase().replace(/\s+/g, '')) ||
          r.title?.toLowerCase().includes(eventName.toLowerCase())
        )
      ) || results[0];

      const url = officialResult.url;
      const domain = new URL(url).hostname;

      console.log(`  ✅ Found official page: ${url}`);
      return { url, domain };
    }

    console.log(`  ⚠️  No official page found for ${eventName}`);
    return null;
  } catch (error: any) {
    console.error(`  ❌ Error searching for ${eventName}:`, error.message);
    return null;
  }
}

// ============================================================================
// Step 3: Extract event data using Firecrawl MCP
// ============================================================================

async function extractEventData(url: string): Promise<{
  date_start?: string;
  date_end?: string;
  city?: string;
  country?: string;
  format?: 'in_person' | 'virtual' | 'hybrid';
  speakers?: string[];
  pricing?: string;
  images?: {
    og?: string;
    hero?: string;
    logo?: string;
  };
}> {
  console.log(`  📄 Extracting data from: ${url}`);

  try {
    // Use Firecrawl API extract with schema
    const extractSchema = {
      type: 'object',
      properties: {
        date_start: { type: 'string', description: 'Event start date (YYYY-MM-DD)' },
        date_end: { type: 'string', description: 'Event end date (YYYY-MM-DD)' },
        city: { type: 'string', description: 'Event city' },
        country: { type: 'string', description: 'Event country' },
        format: { 
          type: 'string', 
          enum: ['in_person', 'virtual', 'hybrid'],
          description: 'Event format'
        },
        speakers: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of notable speakers'
        },
        pricing: { type: 'string', description: 'Ticket pricing information' },
        images: {
          type: 'object',
          properties: {
            og: { type: 'string', description: 'OG image URL' },
            hero: { type: 'string', description: 'Hero image URL' },
            logo: { type: 'string', description: 'Event logo URL' }
          }
        }
      }
    };

    const result = await firecrawlExtract(url, extractSchema);

    // Firecrawl extract returns { data: { ... } }
    if (result && result.data) {
      console.log(`  ✅ Extracted data successfully`);
      return result.data;
    }

    // Fallback: Use scrape tool if extract doesn't work
    const scrapeResult = await firecrawlScrape(url);

    // Firecrawl scrape returns { data: { content, markdown, ... } }
    if (scrapeResult && scrapeResult.data) {
      const content = scrapeResult.data.content || scrapeResult.data.markdown || '';
      // Parse basic info from scraped content
      return parseEventDataFromContent(content, url);
    }

    return {};
  } catch (error: any) {
    console.error(`  ❌ Error extracting data:`, error.message);
    return {};
  }
}

function parseEventDataFromContent(content: string, url: string): any {
  // Basic parsing fallback - extract what we can
  const data: any = {};

  // Try to find dates
  const datePattern = /(\d{4}-\d{2}-\d{2})/g;
  const dates = content.match(datePattern);
  if (dates && dates.length > 0) {
    data.date_start = dates[0];
    if (dates.length > 1) {
      data.date_end = dates[1];
    }
  }

  // Try to find images from meta tags (would need HTML parsing)
  // For now, return empty
  return data;
}

// ============================================================================
// Step 4: Download images
// ============================================================================

async function downloadImage(url: string, destination: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return false;
    }

    const buffer = await response.arrayBuffer();
    const fs = await import('fs/promises');
    await fs.writeFile(destination, Buffer.from(buffer));
    return true;
  } catch (error) {
    console.error(`  ❌ Failed to download image: ${url}`, error);
    return false;
  }
}

async function downloadEventImages(
  eventId: string,
  images: { og?: string; hero?: string; logo?: string }
): Promise<{ og?: string; hero?: string; logo?: string }> {
  const eventDir = join(EVENTS_IMAGES_DIR, eventId);
  if (!existsSync(eventDir)) {
    mkdirSync(eventDir, { recursive: true });
  }

  const downloaded: any = {};

  // Download in priority order: OG → hero → logo
  if (images.og) {
    const path = join(eventDir, 'og.webp');
    if (await downloadImage(images.og, path)) {
      downloaded.og = path;
    }
  }

  if (images.hero && !downloaded.og) {
    const path = join(eventDir, 'hero.webp');
    if (await downloadImage(images.hero, path)) {
      downloaded.hero = path;
    }
  }

  if (images.logo && !downloaded.og && !downloaded.hero) {
    const path = join(eventDir, 'logo.webp');
    if (await downloadImage(images.logo, path)) {
      downloaded.logo = path;
    }
  }

  return downloaded;
}

// ============================================================================
// Step 5: Upload images to Supabase Storage
// ============================================================================

async function uploadImageToStorage(
  eventId: string,
  localPath: string,
  filename: string
): Promise<string | null> {
  try {
    const fs = await import('fs/promises');
    const fileBuffer = await fs.readFile(localPath);

    const storagePath = `industry-events/${eventId}/${filename}`;

    const { data, error } = await supabase.storage
      .from('industry-events')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/webp',
        upsert: true
      });

    if (error) {
      console.error(`  ❌ Failed to upload ${filename}:`, error.message);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('industry-events')
      .getPublicUrl(storagePath);

    return urlData.publicUrl;
  } catch (error: any) {
    console.error(`  ❌ Error uploading image:`, error.message);
    return null;
  }
}

// ============================================================================
// Step 6: Update Supabase with enriched data
// ============================================================================

async function updateEventInSupabase(
  eventId: string,
  enrichmentData: {
    website_url?: string;
    source_domain?: string;
    date_start?: string;
    date_end?: string;
    city?: string;
    country?: string;
    format?: 'in_person' | 'virtual' | 'hybrid';
    image_url?: string;
    image_path?: string;
    enrichment_metadata?: Record<string, any>;
    enrichment_status: 'success' | 'partial' | 'needs_review' | 'failed';
  }
): Promise<void> {
  const updateData: any = {
    ...enrichmentData,
    enriched_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Only update fields that have values (don't overwrite with null)
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === null || updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  const { error } = await supabase
    .from('industry_events')
    .update(updateData)
    .eq('id', eventId);

  if (error) {
    throw new Error(`Failed to update event: ${error.message}`);
  }
}

// ============================================================================
// Main enrichment process
// ============================================================================

async function enrichEvent(event: Event): Promise<{ success: boolean; error?: string }> {
  console.log(`\n📅 Processing: ${event.name} (${event.id})`);

  try {
    // Step 1: Find official website
    let websiteUrl = event.website_url;
    let sourceDomain = event.source_domain;

    if (!websiteUrl) {
      const officialPage = await findOfficialEventPage(event.name || event.full_name || '');
      if (officialPage) {
        websiteUrl = officialPage.url;
        sourceDomain = officialPage.domain;
      } else {
        return {
          success: false,
          error: 'Could not find official website'
        };
      }
    } else {
      sourceDomain = new URL(websiteUrl).hostname;
    }

    // Step 2: Extract event data
    const extractedData = await extractEventData(websiteUrl);

    // Step 3: Download images
    let imageUrl: string | undefined;
    let imagePath: string | undefined;
    const downloadedImages: any = {};

    if (extractedData.images) {
      const downloaded = await downloadEventImages(event.id, extractedData.images);
      
      // Upload to Supabase Storage
      if (downloaded.og) {
        const storageUrl = await uploadImageToStorage(event.id, downloaded.og, 'og.webp');
        if (storageUrl) {
          imageUrl = storageUrl;
          imagePath = `industry-events/${event.id}/og.webp`;
        }
      } else if (downloaded.hero) {
        const storageUrl = await uploadImageToStorage(event.id, downloaded.hero, 'hero.webp');
        if (storageUrl) {
          imageUrl = storageUrl;
          imagePath = `industry-events/${event.id}/hero.webp`;
        }
      } else if (downloaded.logo) {
        const storageUrl = await uploadImageToStorage(event.id, downloaded.logo, 'logo.webp');
        if (storageUrl) {
          imageUrl = storageUrl;
          imagePath = `industry-events/${event.id}/logo.webp`;
        }
      }

      Object.assign(downloadedImages, downloaded);
    }

    // Step 4: Determine enrichment status
    const hasDates = extractedData.date_start || event.event_date;
    const hasLocation = extractedData.city || extractedData.country || event.location_city;
    const hasImage = !!imageUrl;
    const hasWebsite = !!websiteUrl;

    let enrichmentStatus: 'success' | 'partial' | 'needs_review' | 'failed';
    if (hasWebsite && hasImage && hasDates && hasLocation) {
      enrichmentStatus = 'success';
    } else if (hasWebsite || hasImage) {
      enrichmentStatus = 'partial';
    } else {
      enrichmentStatus = 'needs_review';
    }

    // Step 5: Update Supabase
    await updateEventInSupabase(event.id, {
      website_url: websiteUrl,
      source_domain: sourceDomain,
      date_start: extractedData.date_start || undefined,
      date_end: extractedData.date_end || undefined,
      city: extractedData.city || undefined,
      country: extractedData.country || undefined,
      format: extractedData.format || undefined,
      image_url: imageUrl,
      image_path: imagePath,
      enrichment_metadata: {
        speakers: extractedData.speakers || [],
        pricing: extractedData.pricing || 'Not publicly disclosed',
        images_downloaded: Object.keys(downloadedImages).length > 0,
        ...extractedData
      },
      enrichment_status: enrichmentStatus
    });

    console.log(`  ✅ Enrichment complete: ${enrichmentStatus}`);
    return { success: true };
  } catch (error: any) {
    console.error(`  ❌ Enrichment failed:`, error.message);
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
  const limit = process.argv[2] ? parseInt(process.argv[2]) : 5;
  console.log(`🚀 Starting enrichment process (limit: ${limit})`);

  const runLog: RunLog = {
    start_time: new Date().toISOString(),
    end_time: null,
    total_events: 0,
    processed: 0,
    successful: 0,
    failed: 0,
    errors: []
  };

  try {
    // Step 1: Load events
    const events = await loadEventsNeedingEnrichment(limit);
    runLog.total_events = events.length;

    // Save enrichment queue
    const queue: EnrichmentQueue = {
      events,
      created_at: new Date().toISOString()
    };
    writeFileSync(
      join(OUTPUT_DIR, 'enrichment_queue.json'),
      JSON.stringify(queue, null, 2)
    );

    // Step 2: Process each event
    const imageManifest: ImageManifest = {};

    for (const event of events) {
      runLog.processed++;
      const result = await enrichEvent(event);

      if (result.success) {
        runLog.successful++;
      } else {
        runLog.failed++;
        runLog.errors.push({
          event_id: event.id,
          event_name: event.name,
          error: result.error || 'Unknown error'
        });
      }

      // Update image manifest
      imageManifest[event.id] = {
        uploaded: result.success
      };
    }

    // Save image manifest
    writeFileSync(
      join(OUTPUT_DIR, 'images_manifest.json'),
      JSON.stringify(imageManifest, null, 2)
    );

    runLog.end_time = new Date().toISOString();

    // Save run log
    writeFileSync(
      join(OUTPUT_DIR, 'run_log.json'),
      JSON.stringify(runLog, null, 2)
    );

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 ENRICHMENT SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total events: ${runLog.total_events}`);
    console.log(`Processed: ${runLog.processed}`);
    console.log(`✅ Successful: ${runLog.successful}`);
    console.log(`❌ Failed: ${runLog.failed}`);
    console.log(`\nDuration: ${new Date(runLog.end_time).getTime() - new Date(runLog.start_time).getTime()}ms`);
    
    if (runLog.errors.length > 0) {
      console.log('\nErrors:');
      runLog.errors.forEach(err => {
        console.log(`  - ${err.event_name}: ${err.error}`);
      });
    }

    console.log(`\n📁 Output files:`);
    console.log(`  - ${join(OUTPUT_DIR, 'enrichment_queue.json')}`);
    console.log(`  - ${join(OUTPUT_DIR, 'run_log.json')}`);
    console.log(`  - ${join(OUTPUT_DIR, 'images_manifest.json')}`);
    console.log(`  - Images: ${EVENTS_IMAGES_DIR}`);

  } catch (error: any) {
    console.error('❌ Fatal error:', error.message);
    runLog.end_time = new Date().toISOString();
    writeFileSync(
      join(OUTPUT_DIR, 'run_log.json'),
      JSON.stringify(runLog, null, 2)
    );
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('enrich-industry-events')) {
  main().catch(console.error);
}

export { main, enrichEvent, loadEventsNeedingEnrichment };
