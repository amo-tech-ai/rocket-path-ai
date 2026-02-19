#!/usr/bin/env tsx
/**
 * Retry Uploads - Upload locally downloaded images to Supabase Storage
 */

import { createClient } from '@supabase/supabase-js';
import { readdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

config({ path: join(PROJECT_ROOT, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yvyesmiczbjqwbqtlidy.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const EVENTS_IMAGES_DIR = join(PROJECT_ROOT, 'events', 'images');

async function uploadImage(eventId: string, filename: string = 'image.webp') {
  const localPath = join(EVENTS_IMAGES_DIR, eventId, filename);
  
  if (!existsSync(localPath)) {
    console.log(`  ⚠️  No image found: ${localPath}`);
    return null;
  }

  try {
    const fileBuffer = await readFile(localPath);
    const storagePath = `industry-events/${eventId}/${filename}`;

    const { error } = await supabase.storage
      .from('industry-events')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/webp',
        upsert: true
      });

    if (error) {
      console.error(`  ❌ Upload failed: ${error.message}`);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('industry-events')
      .getPublicUrl(storagePath);

    // Update database
    await supabase
      .from('industry_events')
      .update({
        image_url: urlData.publicUrl,
        image_path: storagePath,
        updated_at: new Date().toISOString()
      })
      .eq('id', eventId);

    console.log(`  ✅ Uploaded: ${urlData.publicUrl}`);
    return urlData.publicUrl;
  } catch (error: any) {
    console.error(`  ❌ Error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🔄 Retrying uploads for locally downloaded images...\n');

  const eventDirs = await readdir(EVENTS_IMAGES_DIR);
  let success = 0;
  let failed = 0;

  for (const eventId of eventDirs) {
    const eventDir = join(EVENTS_IMAGES_DIR, eventId);
    const files = await readdir(eventDir);
    const imageFile = files.find(f => f.endsWith('.webp'));

    if (imageFile) {
      console.log(`📅 ${eventId}`);
      const result = await uploadImage(eventId, imageFile);
      if (result) {
        success++;
      } else {
        failed++;
      }
    }
  }

  console.log(`\n✅ Successful: ${success}`);
  console.log(`❌ Failed: ${failed}`);
}

main().catch(console.error);
