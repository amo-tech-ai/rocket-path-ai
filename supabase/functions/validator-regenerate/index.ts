/**
 * Validator Regenerate Edge Function
 * Re-run pipeline for an existing session.
 * Migrated to shared patterns (007-EFN): Deno.serve, shared CORS, rate limiting.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  }

  const corsHeaders = getCorsHeaders(req);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Auth check
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limit
    const rateResult = checkRateLimit(user.id, "validator-regenerate", RATE_LIMITS.heavy);
    if (!rateResult.allowed) {
      return rateLimitResponse(rateResult, corsHeaders);
    }

    const body = await req.json();
    const { session_id, agent_name } = body;

    if (!session_id) {
      return new Response(
        JSON.stringify({ error: "session_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[validator-regenerate] User: ${user.id}, Session: ${session_id}, Agent: ${agent_name || "full"}`);

    // Verify session ownership — user must own the session
    const { data: session, error: sessionError } = await supabase
      .from("validator_sessions")
      .select("id, input_text, startup_id, user_id")
      .eq("id", session_id)
      .single();

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ error: "Session not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (session.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: "Not authorized to regenerate this session" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Proxy to validator-start to re-run the full pipeline
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const REGENERATE_TIMEOUT = 15_000; // 15s — fast fail for UX

    // Promise.race wraps the ENTIRE upstream call (fetch + body read)
    // so neither TCP connect, headers, nor .json() can hang beyond 15s
    const result = await Promise.race([
      (async () => {
        const response = await fetch(`${supabaseUrl}/functions/v1/validator-start`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({
            input_text: session.input_text,
            startup_id: session.startup_id,
          }),
        });

        if (!response.ok) {
          console.error("[validator-regenerate] Upstream error:", {
            status: response.status,
            statusText: response.statusText,
          });
          throw new Error("UPSTREAM_ERROR");
        }

        return await response.json();
      })(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("TIMEOUT")), REGENERATE_TIMEOUT)
      ),
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Regenerating ${agent_name || "full pipeline"}`,
        new_session_id: result.session_id,
        report_id: result.report_id,
        verified: result.verified,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const isTimeout = error instanceof Error && error.message === "TIMEOUT";

    // Log detailed error server-side only
    console.error("[validator-regenerate] Error:", {
      message: error instanceof Error ? error.message : "Unknown",
      isTimeout,
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: isTimeout
          ? "Section regeneration timed out. Please try again."
          : "Failed to regenerate section. Please try again.",
      }),
      {
        status: isTimeout ? 504 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
