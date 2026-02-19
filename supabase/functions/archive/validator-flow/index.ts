/**
 * validator-flow Edge Function
 * Unified flow API: POST = start, GET = status
 * Proxies to validator-start and validator-status. No breaking changes.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";
import { handleStart } from "./handlers/start.ts";
import { handleStatus } from "./handlers/status.ts";

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  const preflight = handleCors(req);
  if (preflight) return preflight;

  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
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

    // Rate limit by method
    const rl = req.method === 'POST'
      ? checkRateLimit(user.id, 'validator-flow-start', RATE_LIMITS.heavy)
      : checkRateLimit(user.id, 'validator-flow-status', RATE_LIMITS.light);

    if (!rl.allowed) {
      return rateLimitResponse(rl, corsHeaders);
    }

    if (req.method === 'POST') {
      return handleStart(req, corsHeaders);
    }

    return handleStatus(req, corsHeaders);
  } catch (error) {
    console.error('[validator-flow] Error:', error instanceof Error ? error.message : error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
