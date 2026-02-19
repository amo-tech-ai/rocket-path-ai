#!/usr/bin/env tsx
/**
 * Check Image Statistics
 * Shows how many events have Cloudinary images vs still needing images
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

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

async function main() {
  console.log('📊 Event Image Statistics\n');
  console.log('='.repeat(80));

  const { data, error } = await supabase
    .from('industry_events')
    .select('id, name, cloudinary_public_id, image_url, website_url')
    .order('name');

  if (error) {
    throw new Error(`Failed to load events: ${error.message}`);
  }

  const events = data || [];
  const total = events.length;
  const withCloudinary = events.filter(e => e.cloudinary_public_id).length;
  const withImage = events.filter(e => e.image_url).length;
  const withWebsite = events.filter(e => e.website_url).length;
  const needingImages = events.filter(e => !e.cloudinary_public_id && !e.image_url).length;

  console.log(`\nTotal Events: ${total}`);
  console.log(`With Cloudinary Images: ${withCloudinary} ✅`);
  console.log(`With Any Image (Cloudinary or Supabase): ${withImage} ✅`);
  console.log(`With Website URL: ${withWebsite}`);
  console.log(`Still Needing Images: ${needingImages} ⚠️`);

  console.log(`\n📈 Progress:`);
  console.log(`   Cloudinary Coverage: ${((withCloudinary / total) * 100).toFixed(1)}%`);
  console.log(`   Overall Image Coverage: ${((withImage / total) * 100).toFixed(1)}%`);

  if (needingImages > 0) {
    console.log(`\n⚠️  Events Still Needing Images:`);
    events
      .filter(e => !e.cloudinary_public_id && !e.image_url)
      .slice(0, 10)
      .forEach((e, i) => {
        const hasUrl = e.website_url ? '✅' : '❌';
        console.log(`   ${i + 1}. ${e.name} ${hasUrl} ${e.website_url || 'No URL'}`);
      });
    if (needingImages > 10) {
      console.log(`   ... and ${needingImages - 10} more`);
    }
  }

  console.log('\n' + '='.repeat(80));
}

main().catch(console.error);
