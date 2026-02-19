/**
 * Test script for health-scorer edge function
 * Run: npx ts-node scripts/test-health-scorer.ts
 * Or: deno run --allow-net --allow-env scripts/test-health-scorer.ts
 */

const SUPABASE_URL = 'https://yvyesmiczbjqwbqtlidy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2eWVzbWljemJqcXdicXRsaWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NTA1OTcsImV4cCI6MjA4NDAyNjU5N30.eSN491MztXvWR03q4v-Zfc0zrG06mrIxdSRe_FFZDu4';

// Test data from startup_members backfill
const TEST_CASES = {
  validStartup: {
    startupId: 'd33f795b-5a99-4df3-9819-52a4baba0895', // StartupAI
    userId: '4bf963de-44fa-4dcf-ab50-1d3b178497a3',    // ai@sunai.one
    email: 'ai@sunai.one'
  },
  invalidStartup: {
    startupId: '00000000-0000-0000-0000-000000000000',
    userId: '4bf963de-44fa-4dcf-ab50-1d3b178497a3'
  }
};

async function testHealthScorer() {
  console.log('=== Health Scorer Edge Function Test ===\n');

  // Test 1: Without auth header (should fail)
  console.log('Test 1: Request without auth header');
  try {
    const res1 = await fetch(`${SUPABASE_URL}/functions/v1/health-scorer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        action: 'calculate',
        startupId: TEST_CASES.validStartup.startupId
      })
    });
    const data1 = await res1.json();
    console.log(`  Status: ${res1.status}`);
    console.log(`  Response: ${JSON.stringify(data1)}`);
    console.log(`  Expected: 401 Unauthorized`);
    console.log(`  Result: ${res1.status === 401 ? '✅ PASS' : '❌ FAIL'}\n`);
  } catch (e) {
    console.log(`  Error: ${e}`);
    console.log(`  Result: ❌ FAIL\n`);
  }

  // Test 2: Without startupId (should fail)
  console.log('Test 2: Request without startupId');
  try {
    const res2 = await fetch(`${SUPABASE_URL}/functions/v1/health-scorer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}` // Invalid token, but tests param validation
      },
      body: JSON.stringify({
        action: 'calculate'
      })
    });
    const data2 = await res2.json();
    console.log(`  Status: ${res2.status}`);
    console.log(`  Response: ${JSON.stringify(data2)}`);
    console.log(`  Expected: 400 or 401`);
    console.log(`  Result: ${[400, 401].includes(res2.status) ? '✅ PASS' : '❌ FAIL'}\n`);
  } catch (e) {
    console.log(`  Error: ${e}`);
    console.log(`  Result: ❌ FAIL\n`);
  }

  // Test 3: CORS preflight
  console.log('Test 3: CORS preflight (OPTIONS)');
  try {
    const res3 = await fetch(`${SUPABASE_URL}/functions/v1/health-scorer`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:8082',
        'Access-Control-Request-Method': 'POST'
      }
    });
    console.log(`  Status: ${res3.status}`);
    console.log(`  CORS Headers: ${res3.headers.get('Access-Control-Allow-Origin')}`);
    console.log(`  Expected: 200 with CORS headers`);
    console.log(`  Result: ${res3.status === 200 ? '✅ PASS' : '❌ FAIL'}\n`);
  } catch (e) {
    console.log(`  Error: ${e}`);
    console.log(`  Result: ❌ FAIL\n`);
  }

  console.log('=== Test Summary ===');
  console.log('To test with valid auth, sign in via the app and use browser dev tools');
  console.log('to capture a valid JWT token from localStorage or network requests.\n');

  console.log('Manual test command:');
  console.log(`curl -X POST '${SUPABASE_URL}/functions/v1/health-scorer' \\`);
  console.log(`  -H 'Content-Type: application/json' \\`);
  console.log(`  -H 'apikey: ${SUPABASE_ANON_KEY}' \\`);
  console.log(`  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\`);
  console.log(`  -d '{"action":"calculate","startupId":"${TEST_CASES.validStartup.startupId}"}'`);
}

// Run tests
testHealthScorer().catch(console.error);
