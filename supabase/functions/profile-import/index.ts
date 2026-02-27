/**
 * Profile Import Edge Function
 * Accepts a company URL, uses Gemini 3 Flash with URL Context to extract
 * structured startup profile fields. Returns extraction + confidence ratings.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { callGemini, extractJSON } from "../_shared/gemini.ts";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";

// ---------------------------------------------------------------------------
// Extraction schema
// ---------------------------------------------------------------------------
const EXTRACTION_SCHEMA = {
  type: 'object',
  properties: {
    name:              { type: 'string', description: 'Company name', nullable: true },
    tagline:           { type: 'string', description: 'One-line value proposition', nullable: true },
    description:       { type: 'string', description: 'Short description (2-3 sentences)', nullable: true },
    industry:          { type: 'string', description: 'Industry category', nullable: true, enum: ['saas','fintech','healthtech','edtech','ecommerce','marketplace','ai_ml','enterprise','consumer','hardware','biotech','cleantech','other'] },
    business_model:    { type: 'string', description: 'Business model', nullable: true, enum: ['saas','marketplace','b2b','b2c','enterprise','freemium','subscription'] },
    stage:             { type: 'string', description: 'Startup stage', nullable: true, enum: ['idea','pre_seed','seed','series_a','series_b','series_c','growth'] },
    unique_value:      { type: 'string', description: 'Primary differentiator', nullable: true },
    target_customers:  { type: 'array', items: { type: 'string' }, description: 'Target customer segments', nullable: true },
    key_features:      { type: 'array', items: { type: 'string' }, description: 'Key product features', nullable: true },
    team_size:         { type: 'integer', description: 'Number of employees', nullable: true },
    founded_year:      { type: 'integer', description: 'Year founded', nullable: true },
    website_url:       { type: 'string', description: 'Company website URL', nullable: true },
    linkedin_url:      { type: 'string', description: 'LinkedIn company page URL', nullable: true },
    twitter_url:       { type: 'string', description: 'Twitter/X profile URL', nullable: true },
    headquarters:      { type: 'string', description: 'HQ location', nullable: true },
    one_liner:         { type: 'string', description: 'Elevator pitch in one sentence', nullable: true },
    confidence:        {
      type: 'object',
      description: 'Per-field confidence: high, medium, or low',
      additionalProperties: { type: 'string', enum: ['high', 'medium', 'low'] },
    },
  },
  required: ['confidence'],
};

const SYSTEM_PROMPT = `You are a startup data extraction specialist. Given a company URL, extract structured profile information.

Rules:
- Only extract facts explicitly stated on the page. Do not infer or fabricate.
- Set fields to null if the information is not found.
- Map industry, business_model, and stage to the provided enum values.
- Rate your confidence for each extracted field as "high" (explicitly stated), "medium" (strongly implied), or "low" (loosely inferred).
- For target_customers, list distinct customer segments (max 5).
- For key_features, list distinct product features (max 8).
- Keep description concise (2-3 sentences max).`;

// ---------------------------------------------------------------------------
// URL validation
// ---------------------------------------------------------------------------
function isValidUrl(urlStr: string): boolean {
  try {
    const u = new URL(urlStr);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
    const host = u.hostname.toLowerCase();
    if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0') return false;
    if (host.startsWith('192.168.') || host.startsWith('10.') || host.startsWith('172.')) return false;
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------
Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const corsHeaders = getCorsHeaders(req);

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  try {
    // Auth
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    if (!supabaseUrl || !supabaseAnonKey) throw new Error('Missing env vars');

    const authHeader = req.headers.get('Authorization');
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: authHeader ? { Authorization: authHeader } : {} },
    });

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Rate limit — each call uses Gemini with URL context (expensive)
    const rateResult = checkRateLimit(user.id, 'profile-import', RATE_LIMITS.standard);
    if (!rateResult.allowed) {
      console.warn(`[profile-import] Rate limit hit: user=${user.id}`);
      return rateLimitResponse(rateResult, corsHeaders);
    }

    // Parse & validate input
    const { url: targetUrl } = await req.json();
    if (!targetUrl || typeof targetUrl !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing required field: url' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (!isValidUrl(targetUrl)) {
      return new Response(
        JSON.stringify({ error: 'Invalid URL. Must be a public https:// or http:// URL.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    console.log(`[profile-import] Extracting from: ${targetUrl} for user: ${user.id}`);

    // Call Gemini via shared client
    const result = await callGemini(
      'gemini-3-flash-preview',
      SYSTEM_PROMPT,
      `Extract startup profile data from this URL: ${targetUrl}`,
      {
        responseJsonSchema: EXTRACTION_SCHEMA,
        useUrlContext: true,
        timeoutMs: 30_000,
        maxOutputTokens: 4096,
      },
    );

    const extracted = extractJSON<Record<string, unknown>>(result.text);
    if (!extracted) {
      return new Response(
        JSON.stringify({ error: 'Failed to extract structured data from the page' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({
        extracted,
        urlContext: result.urlContextMetadata,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('[profile-import] Error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
