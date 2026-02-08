/**
 * Validator Status Edge Function
 * Returns current pipeline status for a session
 */

import { createClient } from "@supabase/supabase-js";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";

// Lazy-initialized admin client — reused across requests in the same isolate.
// Safe because it's stateless (no per-user auth context).
let _adminClient: ReturnType<typeof createClient> | null = null;
function getAdminClient(): ReturnType<typeof createClient> | null {
  if (_adminClient) return _adminClient;
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return null;
  _adminClient = createClient(url, key);
  return _adminClient;
}

// Zombie cleanup: track last cleanup time to avoid running on every poll
let lastZombieCleanup = 0;
const ZOMBIE_CLEANUP_INTERVAL = 30_000; // 30s between cleanups

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  // CORS preflight
  const preflight = handleCors(req);
  if (preflight) return preflight;

  // Only accept GET
  if (req.method !== 'GET') {
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

    // Rate limit: 120 requests per 60s (polled frequently)
    const rl = checkRateLimit(user.id, 'validator-status', RATE_LIMITS.light);
    if (!rl.allowed) {
      return rateLimitResponse(rl, corsHeaders);
    }

    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session_id');

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'session_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ZOMBIE CLEANUP: Rate-limited to once per 30s per isolate.
    // If THIS session has been "running" for > 6 minutes, the pipeline
    // deadline (300s) has been exceeded plus 60s buffer for DB writes.
    // Threshold must exceed PIPELINE_TIMEOUT_MS (300s) in pipeline.ts.
    const ZOMBIE_THRESHOLD_MS = 6 * 60 * 1000; // 360s = 300s pipeline + 60s buffer
    const now = Date.now();
    if (now - lastZombieCleanup > ZOMBIE_CLEANUP_INTERVAL) {
      lastZombieCleanup = now;
      const adminClient = getAdminClient();
      if (adminClient) {
        const cutoff = new Date(now - ZOMBIE_THRESHOLD_MS).toISOString();
        const { data: zombies } = await adminClient
          .from('validator_sessions')
          .update({
            status: 'failed',
            error_message: 'Pipeline timed out — Deno Deploy isolate was terminated before completion.',
          })
          .eq('id', sessionId)
          .eq('status', 'running')
          .lt('created_at', cutoff)
          .select('id');
        if (zombies?.length) {
          console.log(`[validator-status] Cleaned zombie session: ${sessionId}`);
        }
      }
    }

    // Get session
    const { data: session, error: sessionError } = await supabase
      .from('validator_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ error: 'Session not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get runs
    const { data: runs, error: runsError } = await supabase
      .from('validator_runs')
      .select('agent_name, status, started_at, finished_at, duration_ms, citations, error_message')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (runsError) {
      throw runsError;
    }

    // Get report if complete
    let report = null;
    if (session.status === 'complete' || session.status === 'partial') {
      const { data: reportData } = await supabase
        .from('validation_reports')
        .select('id, score, summary, verified, verification_json')
        .eq('session_id', sessionId)
        .single();

      report = reportData;
    }

    // Format steps for UI
    const agentOrder = [
      'ExtractorAgent',
      'ResearchAgent',
      'CompetitorAgent',
      'ScoringAgent',
      'MVPAgent',
      'ComposerAgent',
      'VerifierAgent',
    ];

    const steps = agentOrder.map((agentName, index) => {
      const run = runs?.find(r => r.agent_name === agentName);
      return {
        step: index + 1,
        name: getStepName(agentName),
        agent: agentName,
        status: run?.status || 'queued',
        started_at: run?.started_at,
        finished_at: run?.finished_at,
        duration_ms: run?.duration_ms,
        has_citations: (run?.citations?.length || 0) > 0,
        error: run?.error_message,
      };
    });

    // Calculate progress
    const completedSteps = steps.filter(s => s.status === 'ok' || s.status === 'partial').length;
    const failedSteps = steps.filter(s => s.status === 'failed').length;
    const progress = Math.round((completedSteps / steps.length) * 100);

    return new Response(
      JSON.stringify({
        success: true,
        session_id: sessionId,
        status: session.status,
        progress,
        failedSteps,
        steps,
        report: report ? {
          id: report.id,
          score: report.score,
          summary: report.summary,
          verified: report.verified,
          verification: report.verification_json,
        } : null,
        error: session.error_message,
        created_at: session.created_at,
        updated_at: session.updated_at,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[validator-status] Error:', error instanceof Error ? error.message : error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getStepName(agentName: string): string {
  const names: Record<string, string> = {
    ExtractorAgent: 'Extract profile',
    ResearchAgent: 'Market research',
    CompetitorAgent: 'Competitors',
    ScoringAgent: 'Score',
    MVPAgent: 'MVP plan',
    ComposerAgent: 'Compose report',
    VerifierAgent: 'Verify report',
  };
  return names[agentName] || agentName;
}
