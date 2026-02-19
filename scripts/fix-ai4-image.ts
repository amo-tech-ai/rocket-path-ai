#!/usr/bin/env tsx
/**
 * Fix Ai4 2026 Image
 * 
 * Uses Firecrawl extract to get a better image URL for Ai4 2026
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

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

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

async function extractImageWithFirecrawl(url: string): Promise<string | null> {
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
          extractionPrompt: 'Extract the main event image URL (hero image, banner, or cover image) from this page. Return only the image URL as a plain string, no JSON.'
        }
      })
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    const extractedData = result?.data?.extracted || {};
    
    // Try to find image URL in extracted data
    if (typeof extractedData === 'string') {
      // If it's a direct URL string
      if (extractedData.startsWith('http')) {
        return extractedData.trim();
      }
    } else if (extractedData.imageUrl || extractedData.image || extractedData.ogImage) {
      return extractedData.imageUrl || extractedData.image || extractedData.ogImage;
    }

    return null;
  } catch (error: any) {
    console.error(`  ❌ Firecrawl extract failed:`, error.message);
    return null;
  }
}

async function uploadImageFromUrlToCloudinary(
  eventId: string,
  imageUrl: string
): Promise<{ public_id: string; secure_url: string; version: number } | null> {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'industry-events',
      public_id: `${eventId}/image`,
      resource_type: 'image',
      overwrite: true,
      format: 'webp',
      transformation: [
        { width: 1200, height: 630, crop: 'fill', gravity: 'auto' },
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

async function main() {
  console.log('🚀 Fixing Ai4 2026 Image\n');

  // Get Ai4 event
  const { data: event, error } = await supabase
    .from('industry_events')
    .select('id, name, website_url, cloudinary_public_id')
    .eq('slug', 'ai4-2026')
    .single();

  if (error || !event) {
    console.error('❌ Event not found');
    return;
  }

  if (event.cloudinary_public_id) {
    console.log('✅ Already has Cloudinary image');
    return;
  }

  console.log(`📅 Event: ${event.name}`);
  console.log(`🔗 URL: ${event.website_url}\n`);

  // Try Firecrawl extract
  console.log('🔍 Extracting image URL with Firecrawl...');
  const imageUrl = await extractImageWithFirecrawl(event.website_url || '');

  if (!imageUrl) {
    console.error('❌ Could not extract image URL');
    return;
  }

  console.log(`✅ Found image: ${imageUrl.substring(0, 80)}...\n`);

  // Upload to Cloudinary
  console.log('☁️  Uploading to Cloudinary...');
  const cloudinaryResult = await uploadImageFromUrlToCloudinary(event.id, imageUrl);

  if (!cloudinaryResult) {
    console.error('❌ Upload failed');
    return;
  }

  console.log(`✅ Uploaded: ${cloudinaryResult.public_id}`);

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
    console.error(`❌ Database update failed:`, updateError.message);
    return;
  }

  console.log('✅ Database updated');
  console.log(`\n✅ Success! Image URL: ${cloudinaryResult.secure_url.substring(0, 80)}...`);
}

if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('fix-ai4-image')) {
  main().catch(console.error);
}

export { main };
