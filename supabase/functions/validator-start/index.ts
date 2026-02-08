/**
 * Validator Start Edge Function
 * Multi-agent pipeline: Extractor -> Research(+Competitors bg) -> Score -> MVP -> [grace] -> Compose -> Verify
 * All sections verified AI-generated with citations tracking
 */

import { createClient } from "@supabase/supabase-js";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { AGENTS, type AgentName } from "./config.ts";
import { runPipeline } from "./pipeline.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";

// Per-session tracking for beforeunload cleanup.
// Uses a Map keyed by sessionId to safely handle concurrent requests in the same isolate.
const activeSessions = new Map<string, ReturnType<typeof createClient>>();

addEventListener('beforeunload', () => {
  for (const [sessionId, adminClient] of activeSessions) {
    console.error(`[beforeunload] Isolate dying with active session ${sessionId} — marking failed`);
    adminClient
      .from('validator_sessions')
      .update({
        status: 'failed',
        error_message: 'Isolate killed by Deno Deploy (wall-clock limit)',
      })
      .eq('id', sessionId)
      .eq('status', 'running')
      .then(({ error }: { error: unknown }) => {
        if (error) console.error('[beforeunload] Failed to mark session:', error);
      });
  }
});

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  // CORS preflight
  const preflight = handleCors(req);
  if (preflight) return preflight;

  // Only accept POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Validate required environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
      throw new Error('Missing required environment variables');
    }

    const authHeader = req.headers.get('Authorization');

    // Service role for admin operations on runs
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // User auth for session creation (respects RLS)
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: authHeader ? { Authorization: authHeader } : {} },
    });

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limit: 5 requests per 5 minutes for heavy AI pipeline
    const rl = checkRateLimit(user.id, 'validator-start', RATE_LIMITS.heavy);
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

    const { input_text, startup_id } = body as { input_text?: string; startup_id?: string };

    // Input sanitization — strip HTML tags, limit length
    const sanitized = (input_text || '').replace(/<[^>]*>/g, '').trim();
    if (sanitized.length < 10) {
      return new Response(
        JSON.stringify({ error: 'Input text too short (min 10 characters)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (sanitized.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Input text too long (max 5000 characters)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[validator-start] Starting validation for user:', user.id);

    // 1. Create session
    const { data: session, error: sessionError } = await supabaseUser
      .from('validator_sessions')
      .insert({
        user_id: user.id,
        startup_id: startup_id || null,
        input_text: sanitized,
        status: 'running',
      })
      .select()
      .single();

    if (sessionError) {
      console.error('[validator-start] Session creation failed:', sessionError);
      throw new Error('Failed to create session');
    }

    const sessionId = session.id;
    activeSessions.set(sessionId, supabaseAdmin);
    console.log('[validator-start] Session created:', sessionId);

    // 2. Create run entries for all agents (queued) — batch insert
    const agentNames: AgentName[] = ['extractor', 'research', 'competitors', 'scoring', 'mvp', 'composer', 'verifier'];
    const runRows = agentNames.map(agentKey => ({
      session_id: sessionId,
      agent_name: AGENTS[agentKey].name,
      model_used: AGENTS[agentKey].model,
      tool_used: AGENTS[agentKey].tools,
      status: 'queued',
    }));
    const { error: runsError } = await supabaseAdmin.from('validator_runs').insert(runRows);
    if (runsError) {
      console.error('[validator-start] Failed to create runs:', runsError);
    }

    // 3. Background pipeline via EdgeRuntime.waitUntil (official Supabase pattern).
    // Keeps the isolate alive for the pipeline up to the 400s wall-clock limit (paid plan).
    // Falls back to fire-and-forget if waitUntil is unavailable.
    const pipelinePromise = runPipeline(supabaseAdmin, sessionId, sanitized, startup_id)
      .catch(e => console.error('[pipeline] Unhandled:', e))
      .finally(() => { activeSessions.delete(sessionId); });

    // deno-lint-ignore no-explicit-any
    if (typeof (globalThis as any).EdgeRuntime?.waitUntil === 'function') {
      // deno-lint-ignore no-explicit-any
      (globalThis as any).EdgeRuntime.waitUntil(pipelinePromise);
    }

    return new Response(
      JSON.stringify({
        success: true,
        session_id: sessionId,
        status: 'running',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[validator-start] Error:', error instanceof Error ? error.message : error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
