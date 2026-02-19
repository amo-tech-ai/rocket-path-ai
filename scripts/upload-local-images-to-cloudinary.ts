#!/usr/bin/env tsx
/**
 * Upload Local Event Images to Cloudinary
 * 
 * Uploads local image files to Cloudinary and updates Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { readFileSync, existsSync } from 'fs';

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

// Map image filenames to event slugs
const imageToEventMap: Record<string, string> = {
  'Ai4_2025_Social_Share_Image.jpg': 'ai4-2026',
  'nvidia-gtc.jpg': 'nvidia-gtc-2026',
  'vivatechparis.png': 'vivatech-2026',
  'ycdemoday1.jpg': 'yc-demo-day-2026',
};

async function uploadImageToCloudinary(
  eventId: string,
  imagePath: string
): Promise<{ public_id: string; secure_url: string; version: number } | null> {
  try {
    if (!existsSync(imagePath)) {
      console.error(`  ❌ File not found: ${imagePath}`);
      return null;
    }

    const imageBuffer = readFileSync(imagePath);
    
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'industry-events',
          public_id: `${eventId}/image`,
          resource_type: 'image',
          overwrite: true,
          format: 'webp',
          transformation: [
            { width: 1200, height: 630, crop: 'fill', gravity: 'auto' }, // Optimize for event cards
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
    console.error(`  ❌ Upload failed:`, error.message);
    return null;
  }
}

async function processImage(filename: string) {
  console.log(`\n📅 Processing: ${filename}`);
  
  const slug = imageToEventMap[filename];
  if (!slug) {
    console.error(`  ❌ No event mapping found for ${filename}`);
    return { success: false, error: 'No event mapping' };
  }

  // Get event from database
  const { data: event, error: fetchError } = await supabase
    .from('industry_events')
    .select('id, name, cloudinary_public_id')
    .eq('slug', slug)
    .single();

  if (fetchError || !event) {
    console.error(`  ❌ Event not found: ${slug}`);
    return { success: false, error: 'Event not found' };
  }

  console.log(`  📋 Event: ${event.name} (${event.id})`);

  if (event.cloudinary_public_id) {
    console.log(`  ⏭️  Already has Cloudinary image, overwriting...`);
  }

  const imagePath = join(PROJECT_ROOT, 'events', filename);
  console.log(`  📁 Image path: ${imagePath}`);
  console.log(`  ☁️  Uploading to Cloudinary...`);

  const cloudinaryResult = await uploadImageToCloudinary(event.id, imagePath);

  if (!cloudinaryResult) {
    return { success: false, error: 'Failed to upload' };
  }

  console.log(`  ✅ Uploaded: ${cloudinaryResult.public_id}`);
  console.log(`     URL: ${cloudinaryResult.secure_url.substring(0, 60)}...`);

  // Update database
  const { error: updateError } = await supabase
    .from('industry_events')
    .update({
      image_url: cloudinaryResult.secure_url,
      cloudinary_public_id: cloudinaryResult.public_id,
      cloudinary_version: cloudinaryResult.version,
      cloudinary_folder: 'industry-events',
      updated_at: new Date().toISOString()
    })
    .eq('id', event.id);

  if (updateError) {
    console.error(`  ❌ Database update failed:`, updateError.message);
    return { success: false, error: updateError.message };
  }

  console.log(`  ✅ Database updated`);
  return { success: true, cloudinary_public_id: cloudinaryResult.public_id };
}

async function main() {
  console.log('🚀 Uploading Local Event Images to Cloudinary\n');

  const imageFiles = Object.keys(imageToEventMap);
  const results = [];

  for (const filename of imageFiles) {
    const result = await processImage(filename);
    results.push({ filename, ...result });
    
    // Small delay between uploads
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n❌ Failed images:');
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`  - ${r.filename}: ${r.error}`);
      });
  }

  if (successful > 0) {
    console.log('\n✅ Successfully uploaded images:');
    results
      .filter(r => r.success)
      .forEach(r => {
        console.log(`  - ${r.filename}`);
      });
    
    console.log('\n📝 Images are now available on the website at:');
    console.log('   http://localhost:8500/events');
    console.log('\n   The images will display via the events_directory view');
    console.log('   which maps industry_events.image_url → cover_image_url');
  }
}

if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('upload-local-images-to-cloudinary')) {
  main().catch(console.error);
}

export { main, processImage };
