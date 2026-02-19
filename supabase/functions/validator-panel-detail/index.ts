/**
 * Validator Panel Detail Edge Function
 * Generates deeper context for a single report section on demand.
 * Uses Gemini Flash for fast, structured responses.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { callGemini, extractJSON } from "../_shared/gemini.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";
import { buildSystemPrompt } from "./prompt.ts";
import { panelDetailResponseSchema, type PanelDetailResponse } from "./schema.ts";

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  // CORS preflight
  const preflight = handleCors(req);
  if (preflight) return preflight;

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Validate env vars
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing required environment variables');
    }

    // Auth check
    const authHeader = req.headers.get('Authorization');
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: authHeader ? { Authorization: authHeader } : {} },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limit: 30 requests per 60s
    const rl = checkRateLimit(user.id, 'validator-panel-detail', RATE_LIMITS.standard);
    if (!rl.allowed) {
      return rateLimitResponse(rl, corsHeaders);
    }

    // Parse JSON with error handling
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { section_number, section_title, section_content, score, dimension_score } = body;

    if (typeof section_number !== 'number' || section_number < 1 || section_number > 14) {
      return new Response(
        JSON.stringify({ error: 'section_number must be 1-14' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!section_content || typeof section_content !== 'string') {
      return new Response(
        JSON.stringify({ error: 'section_content is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build prompt
    const systemPrompt = buildSystemPrompt(section_number);
    const userPrompt = [
      `Section ${section_number}: ${section_title || 'Unknown'}`,
      score != null ? `Overall report score: ${score}/100` : null,
      dimension_score != null ? `This dimension score: ${dimension_score}/100` : null,
      `\nSection content:\n${(section_content as string).slice(0, 3000)}`,
      `\nGenerate the 4 blocks for section ${section_number}.`,
    ].filter(Boolean).join('\n');

    // Gemini Flash — 10s timeout, 1 retry, 512 max tokens
    const result = await callGemini(
      'gemini-3-flash-preview',
      systemPrompt,
      userPrompt,
      {
        responseJsonSchema: panelDetailResponseSchema,
        timeoutMs: 10000,
        maxRetries: 1,
        maxOutputTokens: 512,
      }
    );

    const parsed = extractJSON<PanelDetailResponse>(result.text);

    if (!parsed) {
      console.error('[validator-panel-detail] Failed to parse Gemini response. Text:', result.text?.substring(0, 500));
      return new Response(
        JSON.stringify({ success: false, error: 'AI returned unexpected format' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: parsed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[validator-panel-detail] Error:', msg);
    const isTimeout = msg.includes('timed out') || msg.includes('hard timeout');
    return new Response(
      JSON.stringify({ success: false, error: isTimeout ? 'AI request timed out -- please try again' : 'Internal server error' }),
      { status: isTimeout ? 504 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
