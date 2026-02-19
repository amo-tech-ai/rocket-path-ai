/**
 * Lean Canvas Agent - Main Handler
 * Orchestrates all Lean Canvas AI operations
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import {
  mapProfile,
  checkProfileSync,
  prefillCanvas,
  suggestBox,
  validateCanvas,
  saveVersion,
  loadVersions,
  restoreVersion,
  canvasToPitch,
  getBenchmarks,
  suggestPivots,
  extractAssumptions,
  suggestExperiment,
  getAssumptions,
  updateAssumptionStatus,
  coach,
} from "./actions/index.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";

// Use environment variables (set automatically by Supabase)
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

interface RequestBody {
  action: string;
  startup_id?: string;
  document_id?: string;
  version_id?: string;
  box_key?: string;
  canvas_data?: Record<string, unknown>;
  gap_answers?: Record<string, string>;
  label?: string;
  industry?: string;
  stage?: string;
  // Assumption-related fields
  assumption_id?: string;
  assumption_status?: 'validated' | 'invalidated' | 'pivoted';
  evidence?: string;
  validation_results?: Array<{ box: string; score: number; issues: string[] }>;
  // Coach-related fields
  messages?: unknown[];
  startup_context?: { name?: string; industry?: string; stage?: string; description?: string };
  focused_box?: string;
}

function getSupabaseClient(authHeader: string | null): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
  });
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const authHeader = req.headers.get("authorization");
    const supabase = getSupabaseClient(authHeader);

    // Get user from JWT
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", message: "Invalid or missing authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limit: 30 requests per 60s
    const rl = checkRateLimit(user.id, 'lean-canvas-agent', RATE_LIMITS.standard);
    if (!rl.allowed) {
      return rateLimitResponse(rl, corsHeaders);
    }

    let body: RequestBody;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action } = body;

    console.log(`[lean-canvas-agent] Action: ${action}, User: ${user.id}`);

    let result;

    switch (action) {
      // ===== Profile Mapping Actions =====
      case "map_profile":
        if (!body.startup_id) throw new Error("startup_id is required");
        result = await mapProfile(supabase, user.id, body.startup_id);
        break;

      case "check_profile_sync":
        if (!body.startup_id) throw new Error("startup_id is required");
        if (!body.document_id) throw new Error("document_id is required");
        result = await checkProfileSync(supabase, user.id, body.startup_id, body.document_id);
        break;

      // ===== AI Generation Actions =====
      case "prefill_canvas":
        if (!body.startup_id) throw new Error("startup_id is required");
        result = await prefillCanvas(
          supabase,
          user.id,
          body.startup_id,
          body.gap_answers
        );
        break;

      case "suggest_box":
        if (!body.startup_id) throw new Error("startup_id is required");
        if (!body.box_key) throw new Error("box_key is required");
        result = await suggestBox(
          supabase,
          user.id,
          body.startup_id,
          body.box_key,
          body.canvas_data
        );
        break;

      // ===== Validation Actions =====
      case "validate_canvas":
        if (!body.startup_id) throw new Error("startup_id is required");
        if (!body.canvas_data) throw new Error("canvas_data is required");
        result = await validateCanvas(
          supabase,
          user.id,
          body.startup_id,
          body.canvas_data
        );
        break;

      // ===== Version History Actions =====
      case "save_version":
        if (!body.document_id) throw new Error("document_id is required");
        result = await saveVersion(
          supabase,
          user.id,
          body.document_id,
          body.label
        );
        break;

      case "load_versions":
        if (!body.document_id) throw new Error("document_id is required");
        result = await loadVersions(supabase, user.id, body.document_id);
        break;

      case "restore_version":
        if (!body.document_id) throw new Error("document_id is required");
        if (!body.version_id) throw new Error("version_id is required");
        result = await restoreVersion(
          supabase,
          user.id,
          body.document_id,
          body.version_id
        );
        break;

      // ===== Intelligence Actions =====
      case "canvas_to_pitch":
        if (!body.startup_id) throw new Error("startup_id is required");
        if (!body.canvas_data) throw new Error("canvas_data is required");
        result = await canvasToPitch(
          supabase,
          user.id,
          body.startup_id,
          body.canvas_data
        );
        break;

      case "get_benchmarks":
        if (!body.industry) throw new Error("industry is required");
        result = await getBenchmarks(
          supabase,
          body.industry,
          body.stage || "seed"
        );
        break;

      case "suggest_pivots":
        if (!body.startup_id) throw new Error("startup_id is required");
        if (!body.canvas_data) throw new Error("canvas_data is required");
        result = await suggestPivots(
          supabase,
          user.id,
          body.startup_id,
          body.canvas_data
        );
        break;

      // ===== Assumption Management Actions =====
      case "extract_assumptions":
        if (!body.startup_id) throw new Error("startup_id is required");
        if (!body.canvas_data) throw new Error("canvas_data is required");
        result = await extractAssumptions(
          supabase,
          user.id,
          body.startup_id,
          body.canvas_data,
          body.validation_results
        );
        break;

      case "suggest_experiment":
        if (!body.startup_id) throw new Error("startup_id is required");
        if (!body.assumption_id) throw new Error("assumption_id is required");
        result = await suggestExperiment(
          supabase,
          user.id,
          body.startup_id,
          body.assumption_id
        );
        break;

      case "get_assumptions":
        if (!body.startup_id) throw new Error("startup_id is required");
        result = await getAssumptions(
          supabase,
          user.id,
          body.startup_id
        );
        break;

      case "update_assumption_status":
        if (!body.assumption_id) throw new Error("assumption_id is required");
        if (!body.assumption_status) throw new Error("assumption_status is required");
        result = await updateAssumptionStatus(
          supabase,
          user.id,
          body.assumption_id,
          body.assumption_status,
          body.evidence
        );
        break;

      // ===== Coach Action =====
      case "coach":
        if (!body.canvas_data) throw new Error("canvas_data is required");
        result = await coach(supabase, user.id, {
          messages: body.messages,
          canvas_data: body.canvas_data as Record<string, { items?: string[] }>,
          startup_context: body.startup_context,
          focused_box: body.focused_box,
        });
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[lean-canvas-agent] Error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal Server Error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
