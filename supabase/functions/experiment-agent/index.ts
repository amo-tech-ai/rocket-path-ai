/**
 * Experiment Agent Edge Function
 * AI-generates experiment designs from startup assumptions using Gemini.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { callGemini, extractJSON } from "../_shared/gemini.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";

const experimentSchema = {
  type: "object",
  required: ["hypothesis", "success_criteria", "method", "target_sample_size", "planned_duration_days", "suggested_metrics"],
  properties: {
    hypothesis: { type: "string", description: "Testable hypothesis statement" },
    success_criteria: { type: "string", description: "Clear measurable criteria for success" },
    method: { type: "string", description: "Step-by-step experiment methodology" },
    target_sample_size: { type: "integer", description: "Recommended sample size" },
    planned_duration_days: { type: "integer", description: "Estimated duration in days" },
    suggested_metrics: {
      type: "array",
      items: { type: "string" },
      description: "Key metrics to track during the experiment",
    },
  },
};

const SYSTEM_PROMPT = `You are a lean startup experiment designer. Given an assumption and experiment type, design a rigorous yet practical experiment.

Rules:
- Hypothesis must be falsifiable and specific
- Success criteria must include a number or threshold
- Method should be actionable steps a solo founder can execute
- Sample size should be realistic (10-100 for interviews, 100-1000 for surveys/landing pages)
- Duration should be 1-14 days for quick tests, up to 30 for longer experiments
- Metrics should be measurable and directly related to the hypothesis`;

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

    // Rate limit: 30 requests per 60s
    const rl = checkRateLimit(user.id, 'experiment-agent', RATE_LIMITS.standard);
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

    const { assumption_text, experiment_type, startup_context } = body as {
      assumption_text?: string;
      experiment_type?: string;
      startup_context?: { name?: string; industry?: string; stage?: string; description?: string };
    };

    if (!assumption_text || !experiment_type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: assumption_text, experiment_type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const userPrompt = `Startup: ${startup_context?.name || 'Unknown'} | Industry: ${startup_context?.industry || 'Unknown'} | Stage: ${startup_context?.stage || 'Unknown'}
Description: ${startup_context?.description || 'No description'}

Assumption to test: "${assumption_text}"
Experiment type: ${experiment_type}

Design a practical experiment to test this assumption.`;

    console.log(`[experiment-agent] User ${user.id} | type: ${experiment_type}`);

    const result = await callGemini(
      'gemini-3-flash-preview',
      SYSTEM_PROMPT,
      userPrompt,
      { responseJsonSchema: experimentSchema, timeoutMs: 15_000, maxOutputTokens: 4096 },
    );

    const parsed = extractJSON<Record<string, unknown>>(result.text);

    if (!parsed) {
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, experiment: parsed }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('[experiment-agent] Error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    const isTimeout = message.includes('timed out') || message.includes('hard timeout');
    return new Response(
      JSON.stringify({ error: isTimeout ? 'AI request timed out -- please try again' : message }),
      { status: isTimeout ? 504 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
