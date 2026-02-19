/**
 * Validator v3 Orchestrator Edge Function
 * Production-ready: rate limit, input sanitization, correctness verification at every stage.
 * Creates session, runs pipeline in background via EdgeRuntime.waitUntil.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";
import { runPipeline } from "./pipeline.ts";

// Per-session tracking for beforeunload cleanup (isolate death)
const activeSessions = new Map<string, ReturnType<typeof createClient>>();

addEventListener("beforeunload", () => {
  for (const [sessionId, adminClient] of activeSessions) {
    console.error(`[beforeunload] Isolate dying with active session ${sessionId} — marking failed`);
    adminClient
      .from("validator_sessions")
      .update({
        status: "failed",
        error_message: "Isolate killed by Deno Deploy (wall-clock limit)",
      })
      .eq("id", sessionId)
      .eq("status", "running")
      .then(({ error }) => {
        if (error) console.error("[beforeunload] Failed to mark session:", error);
      });
  }
});

Deno.serve(async (req: Request) => {
  const preflight = handleCors(req);
  if (preflight) return preflight;

  const corsHeaders = getCorsHeaders(req);

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limit: 5 requests per 5 minutes (heavy AI pipeline)
    const rl = checkRateLimit(user.id, "validator-orchestrate", RATE_LIMITS.heavy);
    if (!rl.allowed) {
      return rateLimitResponse(rl, corsHeaders);
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { input_text, startup_id, interview_context } = body as {
      input_text?: string;
      startup_id?: string;
      interview_context?: unknown;
    };

    // Input sanitization: strip HTML, enforce 10–5000 chars
    const sanitized = (input_text ?? "").replace(/<[^>]*>/g, "").trim();
    if (sanitized.length < 10) {
      return new Response(JSON.stringify({ error: "Input text too short (min 10 characters)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (sanitized.length > 5000) {
      return new Response(JSON.stringify({ error: "Input text too long (max 5000 characters)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!serviceRoleKey) {
      throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
    }
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { data: session, error: sessionError } = await supabase
      .from("validator_sessions")
      .insert({
        user_id: user.id,
        startup_id: startup_id ?? null,
        input_text: sanitized,
        status: "running",
      })
      .select()
      .single();

    if (sessionError || !session) {
      console.error("Failed to create session:", sessionError);
      return new Response(JSON.stringify({ error: "Failed to create session" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    activeSessions.delete("pending");
    activeSessions.set(session.id, supabaseAdmin);

    const pipelinePromise = runPipeline(
      session.id,
      sanitized,
      interview_context ?? null,
      startup_id ?? null,
      supabaseUrl
    )
      .catch((err) => console.error("[pipeline] Unhandled:", err))
      .finally(() => activeSessions.delete(session.id));

    if (typeof (globalThis as { EdgeRuntime?: { waitUntil?: (p: Promise<unknown>) => void } }).EdgeRuntime?.waitUntil === "function") {
      (globalThis as { EdgeRuntime: { waitUntil: (p: Promise<unknown>) => void } }).EdgeRuntime.waitUntil(pipelinePromise);
    } else {
      pipelinePromise.catch((err) => console.error("Background pipeline error:", err));
    }

    return new Response(
      JSON.stringify({ success: true, session_id: session.id, status: "running" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in validator-orchestrate:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
