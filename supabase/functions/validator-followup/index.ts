/**
 * Validator Follow-up Edge Function
 * Analyzes conversation and generates the next best follow-up question.
 * Uses Gemini Flash for fast, contextual question generation.
 */

import { createClient } from "@supabase/supabase-js";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { callGemini, extractJSON } from "../_shared/gemini.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";
import { FOLLOWUP_SYSTEM_PROMPT } from "./prompt.ts";
import { followupResponseSchema, type FollowupResponse } from "./schema.ts";

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
    const rl = checkRateLimit(user.id, 'validator-followup', RATE_LIMITS.standard);
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

    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize: max 20 messages, max 2000 chars each, strip HTML
    const sanitizedMessages = messages.slice(0, 20).map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: (msg.content || '').replace(/<[^>]*>/g, '').trim().slice(0, 2000),
    }));

    // Build conversation text for Gemini
    const conversationText = sanitizedMessages
      .map((msg: { role: string; content: string }) => `${msg.role}: ${msg.content}`)
      .join('\n\n');

    const userMessageCount = sanitizedMessages.filter((m: { role: string }) => m.role === 'user').length;

    const userPrompt = `Here is the conversation so far (${userMessageCount} user messages):\n\n${conversationText}\n\nAnalyze the coverage and generate the next follow-up question (or signal "ready" if enough info is gathered).`;

    // Gemini Flash — 25s timeout, 1 retry, capped output tokens for cost
    const result = await callGemini(
      'gemini-3-flash-preview',
      FOLLOWUP_SYSTEM_PROMPT,
      userPrompt,
      {
        responseJsonSchema: followupResponseSchema,
        timeoutMs: 25000,
        maxRetries: 1,
        maxOutputTokens: 2048,
      }
    );

    console.log('[validator-followup] Raw Gemini text (first 500 chars):', result.text?.substring(0, 500));
    const parsed = extractJSON<FollowupResponse>(result.text);

    if (!parsed) {
      console.error('[validator-followup] Failed to parse Gemini response. Full text:', result.text);
      return new Response(
        JSON.stringify({ success: false, error: 'AI returned unexpected format — please try again' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[validator-followup] action=${parsed.action}, coverage=${JSON.stringify(parsed.coverage)}, q#=${parsed.questionNumber}`);

    return new Response(
      JSON.stringify({
        success: true,
        action: parsed.action,
        question: parsed.question,
        summary: parsed.summary,
        coverage: parsed.coverage,
        questionNumber: parsed.questionNumber,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[validator-followup] Error:', msg);
    // Differentiate timeout vs generic — but never leak internal details
    const isTimeout = msg.includes('timed out');
    return new Response(
      JSON.stringify({ success: false, error: isTimeout ? 'AI request timed out — please try again' : 'Internal server error' }),
      { status: isTimeout ? 504 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
