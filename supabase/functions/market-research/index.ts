/**
 * Market Research Edge Function
 * AI-generates market research (TAM/SAM/SOM, trends, competitive landscape) using Gemini Pro.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { callGemini, extractJSON } from "../_shared/gemini.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";

const marketResearchSchema = {
  type: "object",
  required: ["tam", "sam", "som", "methodology", "trends", "market_leaders", "emerging_players"],
  properties: {
    tam: {
      type: "object",
      required: ["value", "source"],
      properties: {
        value: { type: "number", description: "Total Addressable Market in USD" },
        source: { type: "string", description: "Source or basis for the estimate" },
      },
    },
    sam: {
      type: "object",
      required: ["value", "source"],
      properties: {
        value: { type: "number", description: "Serviceable Addressable Market in USD" },
        source: { type: "string", description: "Source or basis for the estimate" },
      },
    },
    som: {
      type: "object",
      required: ["value", "source"],
      properties: {
        value: { type: "number", description: "Serviceable Obtainable Market in USD" },
        source: { type: "string", description: "Source or basis for the estimate" },
      },
    },
    methodology: { type: "string", description: "Brief explanation of sizing methodology" },
    trends: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "impact", "timeframe", "evidence"],
        properties: {
          name: { type: "string" },
          impact: { type: "string", description: "high, medium, or low" },
          timeframe: { type: "string" },
          evidence: { type: "string" },
        },
      },
    },
    market_leaders: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "description"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          market_share: { type: "string" },
        },
      },
    },
    emerging_players: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "description"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          differentiator: { type: "string" },
        },
      },
    },
  },
};

const SYSTEM_PROMPT = `You are a market research analyst specializing in startup markets. Generate detailed, data-informed market research.

Rules:
- TAM/SAM/SOM values should be realistic and sourced. Use USD.
- TAM: Total market if you sold to everyone. SAM: Segment you can reach. SOM: What you can realistically capture in 1-3 years.
- Trends should be current and evidence-based
- Market leaders: established players with estimated market share
- Emerging players: startups or new entrants with clear differentiators
- Be specific with numbers, names, and sources
- Methodology should explain top-down or bottom-up approach used`;

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  const preflight = handleCors(req);
  if (preflight) return preflight;

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    if (!supabaseUrl || !supabaseAnonKey) throw new Error('Missing env vars');

    const authHeader = req.headers.get('Authorization');
    const sb = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: authHeader ? { Authorization: authHeader } : {} },
    });

    const { data: { user }, error: userError } = await sb.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Rate limit: 30 requests per 60s
    const rl = checkRateLimit(user.id, 'market-research', RATE_LIMITS.standard);
    if (!rl.allowed) {
      return rateLimitResponse(rl, corsHeaders);
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const { startup_id } = body;
    if (!startup_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: startup_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Fetch startup context
    const { data: startup, error: startupErr } = await sb
      .from('startups')
      .select('name, industry, stage, description, target_market, business_model')
      .eq('id', startup_id)
      .single();
    if (startupErr || !startup) {
      return new Response(
        JSON.stringify({ error: 'Startup not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const userPrompt = `Startup: ${startup.name || 'Unknown'}
Industry: ${startup.industry || 'Unknown'}
Stage: ${startup.stage || 'Unknown'}
Description: ${startup.description || 'No description'}
Target Market: ${startup.target_market || 'Not specified'}
Business Model: ${startup.business_model || 'Not specified'}

Generate comprehensive market research for this startup including market sizing, trends, and competitive landscape.`;

    console.log(`[market-research] User ${user.id} | startup: ${startup_id}`);

    const result = await callGemini(
      'gemini-3-pro-preview',
      SYSTEM_PROMPT,
      userPrompt,
      { responseJsonSchema: marketResearchSchema, timeoutMs: 30_000, maxOutputTokens: 8192 },
    );

    const parsed = extractJSON<Record<string, unknown>>(result.text);

    if (!parsed) {
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Save to DB
    const tamObj = parsed.tam as Record<string, unknown> | undefined;
    const samObj = parsed.sam as Record<string, unknown> | undefined;
    const somObj = parsed.som as Record<string, unknown> | undefined;

    const { data: saved, error: saveErr } = await sb
      .from('market_research')
      .insert({
        startup_id,
        tam_value: tamObj?.value,
        tam_source: tamObj?.source,
        sam_value: samObj?.value,
        sam_source: samObj?.source,
        som_value: somObj?.value,
        som_source: somObj?.source,
        methodology: parsed.methodology,
        trends: parsed.trends,
        market_leaders: parsed.market_leaders,
        emerging_players: parsed.emerging_players,
        sources: [],
        ai_generated: true,
        confidence_score: 0.75,
      })
      .select()
      .single();

    if (saveErr) {
      console.error('[market-research] Save error:', saveErr);
      // Return data even if save fails
      return new Response(
        JSON.stringify({ success: true, research: parsed, saved: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, research: saved }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('[market-research] Error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    const isTimeout = message.includes('timed out') || message.includes('hard timeout');
    return new Response(
      JSON.stringify({ error: isTimeout ? 'AI request timed out -- please try again' : message }),
      { status: isTimeout ? 504 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
