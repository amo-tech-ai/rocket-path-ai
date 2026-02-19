/**
 * Opportunity Canvas Edge Function
 * AI-scores opportunity dimensions and generates recommendation using Gemini Pro.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { callGemini, extractJSON } from "../_shared/gemini.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";

const opportunitySchema = {
  type: "object",
  required: ["market_readiness", "technical_feasibility", "competitive_advantage", "execution_capability", "timing_score", "adoption_barriers", "enablers", "strategic_fit", "recommendation", "reasoning"],
  properties: {
    market_readiness: { type: "integer", description: "Score 0-100: How ready is the market for this product?" },
    technical_feasibility: { type: "integer", description: "Score 0-100: How technically feasible is this?" },
    competitive_advantage: { type: "integer", description: "Score 0-100: How defensible is the competitive advantage?" },
    execution_capability: { type: "integer", description: "Score 0-100: Can the team execute on this?" },
    timing_score: { type: "integer", description: "Score 0-100: Is the timing right?" },
    adoption_barriers: {
      type: "array",
      items: {
        type: "object",
        required: ["title", "description", "severity"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          severity: { type: "string", description: "high, medium, or low" },
        },
      },
    },
    enablers: {
      type: "array",
      items: {
        type: "object",
        required: ["title", "description", "impact"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          impact: { type: "string", description: "high, medium, or low" },
        },
      },
    },
    strategic_fit: { type: "string", description: "Analysis of strategic fit and alignment" },
    recommendation: { type: "string", description: "One of: pursue, explore, defer, reject" },
    reasoning: { type: "string", description: "Detailed reasoning for the recommendation" },
  },
};

const SYSTEM_PROMPT = `You are a startup opportunity analyst. Evaluate the opportunity across 5 dimensions, identify barriers and enablers, and make a clear recommendation.

Scoring Guidelines (0-100 each):
- Market Readiness: Demand signals, buyer awareness, market maturity, regulatory environment
- Technical Feasibility: Tech stack complexity, talent availability, time to build, infrastructure needs
- Competitive Advantage: Moats, network effects, IP, switching costs, brand strength
- Execution Capability: Team experience, resources, track record, operational readiness
- Timing: Market cycle position, technology readiness, regulatory tailwinds/headwinds

Recommendation criteria:
- PURSUE (score > 70): Strong across most dimensions, clear path forward
- EXPLORE (score 50-70): Promising but needs validation in weak areas
- DEFER (score 30-50): Too many unknowns or barriers, revisit later
- REJECT (score < 30): Fundamental blockers or poor fit

Be honest and direct. Better to warn about real risks than give false confidence.`;

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
    const rl = checkRateLimit(user.id, 'opportunity-canvas', RATE_LIMITS.standard);
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

    // Fetch startup + market research + validation context
    const [startupRes, marketRes, reportsRes] = await Promise.all([
      sb.from('startups').select('name, industry, stage, description, target_market, business_model').eq('id', startup_id).single(),
      sb.from('market_research').select('*').eq('startup_id', startup_id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      sb.from('validator_reports').select('overall_score, summary').eq('startup_id', startup_id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    ]);

    if (startupRes.error || !startupRes.data) {
      return new Response(
        JSON.stringify({ error: 'Startup not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const startup = startupRes.data;
    const market = marketRes.data;
    const report = reportsRes.data;

    let contextStr = `Startup: ${startup.name || 'Unknown'}
Industry: ${startup.industry || 'Unknown'}
Stage: ${startup.stage || 'Unknown'}
Description: ${startup.description || 'No description'}
Target Market: ${startup.target_market || 'Not specified'}
Business Model: ${startup.business_model || 'Not specified'}`;

    if (market) {
      contextStr += `\n\nMarket Research Available:
TAM: $${market.tam_value || 'Unknown'}
SAM: $${market.sam_value || 'Unknown'}
SOM: $${market.som_value || 'Unknown'}`;
    }

    if (report) {
      contextStr += `\n\nValidation Score: ${report.overall_score || 'Unknown'}/100
Validation Summary: ${report.summary || 'Not available'}`;
    }

    const userPrompt = `${contextStr}\n\nEvaluate this startup opportunity across all 5 dimensions and provide your recommendation.`;

    console.log(`[opportunity-canvas] User ${user.id} | startup: ${startup_id}`);

    const result = await callGemini(
      'gemini-3-pro-preview',
      SYSTEM_PROMPT,
      userPrompt,
      { responseJsonSchema: opportunitySchema, timeoutMs: 30_000, maxOutputTokens: 8192 },
    );

    const parsed = extractJSON<Record<string, unknown>>(result.text);

    if (!parsed) {
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Calculate weighted opportunity score
    const opportunityScore = Math.round(
      (parsed.market_readiness as number) * 0.25 +
      (parsed.technical_feasibility as number) * 0.20 +
      (parsed.competitive_advantage as number) * 0.20 +
      (parsed.execution_capability as number) * 0.20 +
      (parsed.timing_score as number) * 0.15
    );

    // Save to DB
    const { data: saved, error: saveErr } = await sb
      .from('opportunity_canvas')
      .insert({
        startup_id,
        market_readiness: parsed.market_readiness,
        technical_feasibility: parsed.technical_feasibility,
        competitive_advantage: parsed.competitive_advantage,
        execution_capability: parsed.execution_capability,
        timing_score: parsed.timing_score,
        opportunity_score: opportunityScore,
        adoption_barriers: parsed.adoption_barriers,
        enablers: parsed.enablers,
        strategic_fit: parsed.strategic_fit,
        recommendation: parsed.recommendation,
        reasoning: parsed.reasoning,
      })
      .select()
      .single();

    if (saveErr) {
      console.error('[opportunity-canvas] Save error:', saveErr);
      return new Response(
        JSON.stringify({ success: true, canvas: { ...parsed, opportunity_score: opportunityScore }, saved: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, canvas: saved }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('[opportunity-canvas] Error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    const isTimeout = message.includes('timed out') || message.includes('hard timeout');
    return new Response(
      JSON.stringify({ error: isTimeout ? 'AI request timed out -- please try again' : message }),
      { status: isTimeout ? 504 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
