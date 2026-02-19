#!/usr/bin/env tsx
/**
 * List Events Needing Images
 * 
 * Simple script to list all events that need images with their URLs.
 * Use this to see what will be processed before running the download script.
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
  const limit = process.argv[2] ? parseInt(process.argv[2]) : undefined;

  console.log('📋 Events Needing Images\n');
  console.log('='.repeat(100));

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

  const events = data || [];

  if (events.length === 0) {
    console.log('✅ All events have images!');
    return;
  }

  console.log(`\nFound ${events.length} events needing images:\n`);

  events.forEach((event: any, index: number) => {
    const url = event.website_url || '❌ NO URL';
    const hasImage = event.image_url ? '✅' : '❌';
    
    console.log(`${index + 1}. ${event.name}`);
    console.log(`   ID: ${event.id}`);
    console.log(`   URL: ${url}`);
    console.log(`   Has Image: ${hasImage}`);
    console.log('');
  });

  console.log('='.repeat(100));
  console.log('\nTo download images, run:');
  console.log(`  npm run download:images ${limit || ''}`);
  console.log('\nOr use Cursor Agent with MCP Firecrawl tools to process these URLs.');
}

main().catch(console.error);
