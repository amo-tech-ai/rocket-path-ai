#!/usr/bin/env tsx
/**
 * Migrate Images to Cloudinary (Idempotent)
 * 
 * Migrates existing Supabase Storage images to Cloudinary.
 * Safe to re-run (skips already migrated events).
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

config({ path: join(PROJECT_ROOT, '.env.local') });

// Types
interface Event {
  id: string;
  name: string;
  image_url: string | null;
  image_path: string | null;
  cloudinary_public_id: string | null;
}

interface MigrationLog {
  start_time: string;
  end_time: string | null;
  total_events: number;
  migrated: number;
  skipped: number;
  failed: number;
  events: Array<{
    id: string;
    name: string;
    status: 'migrated' | 'skipped' | 'failed';
    error?: string;
  }>;
}

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yvyesmiczbjqwbqtlidy.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configure Cloudinary
const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudinaryCloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
  throw new Error('Cloudinary credentials required');
}

cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
  secure: true,
});

const OUTPUT_DIR = join(PROJECT_ROOT, 'events', 'enrichment');
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

// ============================================================================
// Load events with Supabase images
// ============================================================================

async function loadEventsToMigrate(): Promise<Event[]> {
  console.log('📥 Loading events with Supabase Storage images...\n');

  const { data, error } = await supabase
    .from('industry_events')
    .select('id, name, image_url, image_path, cloudinary_public_id')
    .not('image_url', 'is', null)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to load events: ${error.message}`);
  }

  const events = (data || []) as Event[];

  console.log(`Found ${events.length} events with images\n`);
  return events;
}

// ============================================================================
// Download from Supabase Storage
// ============================================================================

async function downloadFromSupabaseStorage(imagePath: string): Promise<Buffer | null> {
  try {
    const { data, error } = await supabase.storage
      .from('industry-events')
      .download(imagePath);

    if (error || !data) {
      return null;
    }

    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    return null;
  }
}

// ============================================================================
// Upload to Cloudinary (production-correct)
// ============================================================================

async function uploadToCloudinary(
  eventId: string,
  imageBuffer: Buffer
): Promise<{ public_id: string; secure_url: string; version: number } | null> {
  try {
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

      stream.end(imageBuffer);
    });

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      version: result.version
    };
  } catch (error: any) {
    console.error(`  ❌ Upload failed: ${error.message}`);
    return null;
  }
}

// ============================================================================
// Migrate single event (idempotent)
// ============================================================================

async function migrateEvent(event: Event): Promise<{
  success: boolean;
  skipped: boolean;
  error?: string;
}> {
  console.log(`\n📅 Migrating: ${event.name}`);
  console.log(`   ID: ${event.id}`);

  // Idempotent: Skip if already migrated
  if (event.cloudinary_public_id) {
    console.log(`  ⏭️  Already migrated (has cloudinary_public_id), skipping`);
    return { success: true, skipped: true };
  }

  // Need image_path to download from Supabase
  if (!event.image_path) {
    return {
      success: false,
      skipped: false,
      error: 'No image_path - cannot download from Supabase Storage'
    };
  }

  try {
    // Step 1: Download from Supabase Storage
    console.log(`  📥 Downloading from Supabase: ${event.image_path}`);
    const imageBuffer = await downloadFromSupabaseStorage(event.image_path);

    if (!imageBuffer) {
      return {
        success: false,
        skipped: false,
        error: 'Failed to download from Supabase Storage'
      };
    }

    console.log(`  ✅ Downloaded (${(imageBuffer.length / 1024).toFixed(0)}KB)`);

    // Step 2: Upload to Cloudinary
    console.log(`  ☁️  Uploading to Cloudinary...`);
    const cloudinaryResult = await uploadToCloudinary(event.id, imageBuffer);

    if (!cloudinaryResult) {
      return {
        success: false,
        skipped: false,
        error: 'Failed to upload to Cloudinary'
      };
    }

    console.log(`  ✅ Uploaded: ${cloudinaryResult.public_id}`);

    // Step 3: Update database
    const { error } = await supabase
      .from('industry_events')
      .update({
        image_url: cloudinaryResult.secure_url, // Update to Cloudinary URL
        cloudinary_public_id: cloudinaryResult.public_id,
        cloudinary_version: cloudinaryResult.version,
        cloudinary_folder: 'industry-events',
        updated_at: new Date().toISOString()
      })
      .eq('id', event.id);

    if (error) {
      throw new Error(`Failed to update database: ${error.message}`);
    }

    console.log(`  ✅ Database updated`);

    return { success: true, skipped: false };
  } catch (error: any) {
    return {
      success: false,
      skipped: false,
      error: error.message
    };
  }
}

// ============================================================================
// Main execution
// ============================================================================

async function main() {
  console.log('🚀 Migrate Images to Cloudinary (Idempotent)\n');

  const log: MigrationLog = {
    start_time: new Date().toISOString(),
    end_time: null,
    total_events: 0,
    migrated: 0,
    skipped: 0,
    failed: 0,
    events: []
  };

  try {
    // Load events
    const events = await loadEventsToMigrate();
    log.total_events = events.length;

    if (events.length === 0) {
      console.log('✅ No events to migrate!');
      return;
    }

    // Migrate each event
    for (const event of events) {
      const result = await migrateEvent(event);

      const eventLog = {
        id: event.id,
        name: event.name,
        status: result.skipped ? 'skipped' as const : (result.success ? 'migrated' as const : 'failed' as const),
        error: result.error
      };

      log.events.push(eventLog);

      if (result.success) {
        if (result.skipped) {
          log.skipped++;
        } else {
          log.migrated++;
        }
      } else {
        log.failed++;
      }
    }

    log.end_time = new Date().toISOString();

    // Save log
    writeFileSync(
      join(OUTPUT_DIR, 'migration_log.json'),
      JSON.stringify(log, null, 2)
    );

    // Print summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total events: ${log.total_events}`);
    console.log(`✅ Migrated: ${log.migrated}`);
    console.log(`⏭️  Skipped: ${log.skipped}`);
    console.log(`❌ Failed: ${log.failed}`);

    if (log.failed > 0) {
      console.log('\n❌ Failed events:');
      log.events
        .filter(e => e.status === 'failed')
        .forEach(e => {
          console.log(`  - ${e.name}: ${e.error}`);
        });
    }

    console.log(`\n📁 Log saved: ${join(OUTPUT_DIR, 'migration_log.json')}`);

  } catch (error: any) {
    console.error('\n❌ Fatal error:', error.message);
    log.end_time = new Date().toISOString();
    writeFileSync(
      join(OUTPUT_DIR, 'migration_log.json'),
      JSON.stringify(log, null, 2)
    );
    process.exit(1);
  }
}

if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('migrate-images-to-cloudinary')) {
  main().catch(console.error);
}

export { main, migrateEvent };
