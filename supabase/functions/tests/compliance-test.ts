/**
 * Edge Function Compliance Tests
 *
 * Validates C3/C6/C7 fixes from audit 42-edge-audit.md.
 * Tests the actual deployed functions via HTTP.
 *
 * Run: deno test --allow-all supabase/functions/tests/compliance-test.ts
 * Requires: supabase functions serve (local) OR deployed functions
 */

import { assert, assertEquals, assertNotEquals } from 'jsr:@std/assert@1'
import 'jsr:@std/dotenv/load'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? 'http://localhost:54321'
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? ''
const USER_TOKEN = Deno.env.get('STARTUPAI_USER_TOKEN') ?? ''

const BASE = `${SUPABASE_URL}/functions/v1`

// Helper: call an EF with proper headers
async function callEF(
  name: string,
  opts: { method?: string; body?: unknown; noAuth?: boolean } = {}
): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
  }
  if (!opts.noAuth && USER_TOKEN) {
    headers['Authorization'] = `Bearer ${USER_TOKEN}`
  }

  return fetch(`${BASE}/${name}`, {
    method: opts.method ?? 'POST',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  })
}

// ============================================================
// C3: Dynamic CORS — OPTIONS returns correct headers
// ============================================================

const C3_FUNCTIONS = [
  'compute-daily-focus',
  'industry-expert-agent',
  'knowledge-ingest',
  'lean-canvas-agent',
  'onboarding-agent',
  'pitch-deck-agent',
  'prompt-pack',
  'workflow-trigger',
]

for (const fn of C3_FUNCTIONS) {
  Deno.test(`C3: ${fn} — OPTIONS returns CORS headers`, async () => {
    const res = await fetch(`${BASE}/${fn}`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://startupai.app',
        'Access-Control-Request-Method': 'POST',
      },
    })

    // OPTIONS should return 200 or 204
    assert(res.status < 300, `${fn} OPTIONS returned ${res.status}`)

    // Must have Access-Control-Allow-Origin
    const allowOrigin = res.headers.get('Access-Control-Allow-Origin')
    assert(allowOrigin, `${fn} missing Access-Control-Allow-Origin header`)

    // Should NOT be wildcard in production (if ALLOWED_ORIGINS is set)
    // In dev/test, wildcard is acceptable
    await res.body?.cancel()
  })
}

// ============================================================
// C6: req.json try/catch — malformed JSON returns 400
// ============================================================

const C6_FUNCTIONS = [
  'compute-daily-focus',
  'industry-expert-agent',
  'knowledge-ingest',
  'knowledge-search',
  'validator-regenerate',
  'validator-retry',
  'prompt-pack',
]

for (const fn of C6_FUNCTIONS) {
  Deno.test(`C6: ${fn} — malformed JSON returns 400 (not 500)`, async () => {
    const res = await fetch(`${BASE}/${fn}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${USER_TOKEN}`,
      },
      body: '{ invalid json ???',
    })

    // Must return 400 (bad request), NOT 500 (unhandled error)
    assertEquals(res.status, 400, `${fn} returned ${res.status} on malformed JSON — expected 400`)

    const data = await res.json()
    assert(data.error, `${fn} should return error message on malformed JSON`)
  })
}

// ============================================================
// C7: Edge runtime import — function loads without error
// (Verified by successful OPTIONS/POST response — if import
// was wrong, function would fail to load entirely)
// ============================================================

const C7_FUNCTIONS = [
  'compute-daily-focus',
  'industry-expert-agent',
  'knowledge-ingest',
  'onboarding-agent',
  'pitch-deck-agent',
  'prompt-pack',
  'workflow-trigger',
]

for (const fn of C7_FUNCTIONS) {
  Deno.test(`C7: ${fn} — function loads successfully (edge-runtime import present)`, async () => {
    // If the edge-runtime import is broken, the function won't even load
    // A successful OPTIONS response proves it loaded
    const res = await fetch(`${BASE}/${fn}`, {
      method: 'OPTIONS',
      headers: { 'Origin': 'https://test.com' },
    })
    assert(res.status < 500, `${fn} returned ${res.status} — function may not have loaded`)
    await res.body?.cancel()
  })
}

// ============================================================
// Validator-status: Verify GET method works (A3 anomaly)
// ============================================================

Deno.test('A3: validator-status — GET method works', async () => {
  const res = await fetch(`${BASE}/validator-status?session_id=test-nonexistent`, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${USER_TOKEN}`,
    },
  })
  // Should NOT be 405 (method not allowed)
  assertNotEquals(res.status, 405, 'validator-status rejected GET — should accept GET')
  await res.body?.cancel()
})

Deno.test('A3: validator-status — POST returns 405', async () => {
  const res = await fetch(`${BASE}/validator-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${USER_TOKEN}`,
    },
    body: JSON.stringify({ session_id: 'test' }),
  })
  assertEquals(res.status, 405, 'validator-status should reject POST with 405')
  await res.body?.cancel()
})

// ============================================================
// Auth: Verify functions reject unauthenticated requests
// ============================================================

const AUTH_FUNCTIONS = [
  'health-scorer',
  'compute-daily-focus',
  'crm-agent',
  'task-agent',
]

for (const fn of AUTH_FUNCTIONS) {
  Deno.test(`C2: ${fn} — rejects request without JWT`, async () => {
    const res = await fetch(`${BASE}/${fn}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        // No Authorization header
      },
      body: JSON.stringify({ action: 'test' }),
    })
    assertEquals(res.status, 401, `${fn} should return 401 without JWT`)
    await res.body?.cancel()
  })
}
