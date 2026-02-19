#!/usr/bin/env tsx
/**
 * Manually Add Images to Events
 * 
 * Adds Cloudinary images for events where we have direct image URLs
 * from web search results
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

// Load environment variables
config({ path: join(PROJECT_ROOT, '.env.local') });

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

// Event image mappings from web search results and fetched content
const eventImages: Record<string, string> = {
  'ai4-2026': 'https://ai4.io/wp-content/themes/ai4-26/assets/images/Ai4_2026_W_logo.svg', // Try logo instead
  'the-briefing-enterprise-agents-2026': 'https://cdn.prod.website-files.com/67ed58c92cfedc451ebbbca1/694301b3d3a4b8281e308803_Hand-ShapeArrow.png', // Anthropic event image
  'google-cloud-next-2026': 'https://assets.swoogo.com/uploads/full/5954830-68ec4f8f1463c.png', // Google Cloud Next static image instead of GIF
  'the-ai-conference-2026': 'https://aiconference.com/wp-content/uploads/2025/10/Logo-web-1.png', // AI Conference logo
};

async function uploadImageFromUrlToCloudinary(
  eventId: string,
  imageUrl: string
): Promise<{ public_id: string; secure_url: string; version: number } | null> {
  try {
    // Use Cloudinary's upload from URL feature (more reliable)
    // For SVG, convert to PNG first by downloading and re-uploading
    let uploadUrl = imageUrl;
    
    if (imageUrl.endsWith('.svg')) {
      // Download SVG and convert to buffer for upload
      const response = await fetch(imageUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch SVG: ${response.statusText}`);
      }
      const svgBuffer = Buffer.from(await response.arrayBuffer());
      
      // Upload SVG buffer directly
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'industry-events',
            public_id: `${eventId}/image`,
            resource_type: 'image',
            overwrite: true,
            format: 'png', // Convert SVG to PNG
            transformation: [
              { width: 1200, height: 630, crop: 'fill', gravity: 'auto' },
              { quality: 'auto' }
            ]
          },
          (err, res) => {
            if (err) reject(err);
            else resolve(res);
          }
        );
        stream.end(svgBuffer);
      });
      
      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        version: result.version
      };
    }
    
    // For regular images, use direct URL upload
    const result = await cloudinary.uploader.upload(imageUrl, {
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

async function processEvent(slug: string, imageUrl: string) {
  console.log(`\n📅 Processing: ${slug}`);
  
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

  if (event.cloudinary_public_id) {
    console.log(`  ⏭️  Already has Cloudinary image, skipping`);
    return { success: true, skipped: true };
  }

  console.log(`  ☁️  Uploading from URL to Cloudinary: ${imageUrl}`);
  
  const cloudinaryResult = await uploadImageFromUrlToCloudinary(event.id, imageUrl);

  if (!cloudinaryResult) {
    return { success: false, error: 'Failed to upload' };
  }

  console.log(`  ✅ Uploaded: ${cloudinaryResult.public_id}`);

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
  console.log('🚀 Manually Adding Images to Events\n');

  const results = [];

  // Process all events with known image URLs
  for (const [slug, imageUrl] of Object.entries(eventImages)) {
    const eventName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const result = await processEvent(slug, imageUrl);
    results.push({ event: eventName, ...result });
    
    // Small delay between uploads
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  const successful = results.filter(r => r.success && !r.skipped).length;
  const skipped = results.filter(r => r.skipped).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`✅ Successful: ${successful}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n❌ Failed events:');
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`  - ${r.event}: ${r.error}`);
      });
  }

  console.log('\n📝 Note: For other events, run the full download script:');
  console.log('   npx tsx scripts/download-event-images-cloudinary.ts');
}

if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('add-images-manually')) {
  main().catch(console.error);
}

export { main, processEvent };
