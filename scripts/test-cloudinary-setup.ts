#!/usr/bin/env tsx
/**
 * Test Cloudinary Setup
 * 
 * Validates:
 * 1. Environment variables configured
 * 2. Cloudinary SDK can connect
 * 3. Database migration applied
 * 4. Frontend helper works
 */

import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { v2 as cloudinary } from 'cloudinary';
import { getEventImageUrl, getEventImageUrlWithFallback } from '../src/lib/cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

config({ path: join(PROJECT_ROOT, '.env.local') });

async function testEnvironmentVariables() {
  console.log('🔍 Testing Environment Variables...\n');

  const frontendCloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
  const backendCloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  console.log('Frontend (Vite):');
  console.log(`  VITE_CLOUDINARY_CLOUD_NAME: ${frontendCloudName ? '✅ Set' : '❌ Missing'}`);

  console.log('\nBackend:');
  console.log(`  CLOUDINARY_CLOUD_NAME: ${backendCloudName ? '✅ Set' : '❌ Missing'}`);
  console.log(`  CLOUDINARY_API_KEY: ${apiKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`  CLOUDINARY_API_SECRET: ${apiSecret ? '✅ Set (hidden)' : '❌ Missing'}`);

  if (!frontendCloudName || !backendCloudName || !apiKey || !apiSecret) {
    throw new Error('Missing required Cloudinary environment variables');
  }

  if (frontendCloudName !== backendCloudName) {
    throw new Error('Frontend and backend cloud names do not match');
  }

  console.log('\n✅ Environment variables configured correctly\n');
}

async function testCloudinaryConnection() {
  console.log('☁️  Testing Cloudinary Connection...\n');

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  try {
    // Test connection by checking account details
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful');
    console.log(`   Status: ${result.status}\n`);
  } catch (error: any) {
    throw new Error(`Cloudinary connection failed: ${error.message}`);
  }
}

async function testDatabaseMigration() {
  console.log('🗄️  Testing Database Migration...\n');

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yvyesmiczbjqwbqtlidy.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Check if columns exist
  const { data, error } = await supabase
    .from('industry_events')
    .select('cloudinary_public_id, cloudinary_version, cloudinary_folder')
    .limit(1);

  if (error) {
    // Check if error is about missing columns
    if (error.message.includes('column') && error.message.includes('does not exist')) {
      throw new Error('Database migration not applied - columns missing');
    }
    throw new Error(`Database query failed: ${error.message}`);
  }

  console.log('✅ Database migration applied');
  console.log('   Columns exist: cloudinary_public_id, cloudinary_version, cloudinary_folder\n');
}

async function testFrontendHelper() {
  console.log('🎨 Testing Frontend Helper...\n');

  // Test with mock public_id
  const testPublicId = 'industry-events/test-event/image';

  const url = getEventImageUrl(testPublicId, {
    width: 800,
    format: 'auto',
    quality: 'auto'
  });

  if (!url) {
    throw new Error('Frontend helper returned null (check VITE_CLOUDINARY_CLOUD_NAME)');
  }

  console.log('✅ Frontend helper works');
  console.log(`   Generated URL: ${url.substring(0, 80)}...\n`);

  // Test fallback
  const fallbackUrl = getEventImageUrlWithFallback(
    {
      cloudinary_public_id: null,
      image_url: 'https://example.com/image.jpg'
    },
    { width: 800 }
  );

  if (fallbackUrl !== 'https://example.com/image.jpg') {
    throw new Error('Fallback not working correctly');
  }

  console.log('✅ Fallback mechanism works');
  console.log(`   Fallback URL: ${fallbackUrl}\n`);
}

async function main() {
  console.log('🚀 Cloudinary Setup Test\n');
  console.log('='.repeat(80) + '\n');

  try {
    await testEnvironmentVariables();
    await testCloudinaryConnection();
    await testDatabaseMigration();
    await testFrontendHelper();

    console.log('='.repeat(80));
    console.log('✅ ALL TESTS PASSED');
    console.log('='.repeat(80));
    console.log('\nNext steps:');
    console.log('  1. Run migration: npm run migrate:cloudinary');
    console.log('  2. Test download: npm run download:images:cloudinary 1');
    console.log('  3. Update frontend components to use IndustryEventImage\n');

  } catch (error: any) {
    console.error('\n' + '='.repeat(80));
    console.error('❌ TEST FAILED');
    console.error('='.repeat(80));
    console.error(`\nError: ${error.message}\n`);
    process.exit(1);
  }
}

if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('test-cloudinary-setup')) {
  main().catch(console.error);
}

export { main };
