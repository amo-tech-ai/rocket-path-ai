/**
 * Pitch Deck Agent - Main Handler
 * Orchestrates all pitch deck operations
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import {
  saveWizardStep,
  resumeWizard,
  generateInterviewQuestions,
  generateDeck,
  updateSlide,
  getDeck,
  getSignalStrength,
  analyzeSlide,
  conductMarketResearch,
  analyzeCompetitors,
  generateSlideVisual,
  generateDeckVisuals,
  regenerateSlideImage,
} from "./actions/index.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = "https://yvyesmiczbjqwbqtlidy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2eWVzbWljemJqcXdicXRsaWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NTA1OTcsImV4cCI6MjA4NDAyNjU5N30.eSN491MztXvWR03q4v-Zfc0zrG06mrIxdSRe_FFZDu4";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

interface RequestBody {
  action: string;
  deck_id?: string;
  slide_id?: string;
  step?: number;
  step_data?: Record<string, unknown>;
  step1_data?: Record<string, unknown>;
  step2_data?: Record<string, unknown>;
  template?: string;
  content?: Record<string, unknown>;
  slide_type?: string;
  slide_content?: Record<string, unknown>;
  industry?: string;
  company_context?: string;
  company_name?: string;
  differentiator?: string;
  slide_title?: string;
  brand_colors?: { primary?: string; secondary?: string };
  custom_prompt?: string;
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

    const body: RequestBody = await req.json();
    const { action } = body;

    console.log(`[pitch-deck-agent] Action: ${action}, User: ${user.id}`);

    let result;

    switch (action) {
      // ===== Wizard Actions =====
      case "save_wizard_step":
        result = await saveWizardStep(
          supabase,
          user.id,
          body.deck_id || null,
          body.step || 1,
          body.step_data || {},
          (body.step_data as Record<string, unknown>)?.industry as string
        );
        break;

      case "resume_wizard":
        if (!body.deck_id) throw new Error("deck_id is required");
        result = await resumeWizard(supabase, user.id, body.deck_id);
        break;

      // ===== Generation Actions =====
      case "generate_interview_questions":
        if (!body.deck_id) throw new Error("deck_id is required");
        result = await generateInterviewQuestions(
          supabase,
          user.id,
          body.deck_id,
          body.step1_data || {},
          body.step2_data || {}
        );
        break;

      case "generate_deck":
        if (!body.deck_id) throw new Error("deck_id is required");
        result = await generateDeck(
          supabase,
          user.id,
          body.deck_id,
          body.template || "yc"
        );
        break;

      // ===== Slide Actions =====
      case "update_slide":
        if (!body.slide_id) throw new Error("slide_id is required");
        result = await updateSlide(
          supabase,
          user.id,
          body.slide_id,
          body.content || {}
        );
        break;

      case "get_deck":
        if (!body.deck_id) throw new Error("deck_id is required");
        result = await getDeck(supabase, user.id, body.deck_id);
        break;

      case "get_signal_strength":
        if (!body.deck_id) throw new Error("deck_id is required");
        result = await getSignalStrength(supabase, user.id, body.deck_id);
        break;

      case "analyze_slide":
        if (!body.slide_id) throw new Error("slide_id is required");
        result = await analyzeSlide(
          supabase,
          user.id,
          body.slide_id,
          body.slide_type || "unknown",
          body.slide_content || {}
        );
        break;

      // ===== Research Actions (Google Search Grounding) =====
      case "market_research":
        if (!body.deck_id) throw new Error("deck_id is required");
        if (!body.industry) throw new Error("industry is required");
        result = await conductMarketResearch(
          supabase,
          user.id,
          body.deck_id,
          body.industry,
          body.company_context || ""
        );
        break;

      case "competitor_analysis":
        if (!body.deck_id) throw new Error("deck_id is required");
        if (!body.industry) throw new Error("industry is required");
        result = await analyzeCompetitors(
          supabase,
          user.id,
          body.deck_id,
          body.industry,
          body.company_name || "",
          body.differentiator || ""
        );
        break;

      // ===== Image Generation Actions =====
      case "generate_slide_image":
        if (!body.slide_id) throw new Error("slide_id is required");
        result = await generateSlideVisual(
          supabase,
          user.id,
          body.slide_id,
          body.slide_type || "title",
          body.slide_title || "",
          body.company_context,
          body.brand_colors
        );
        break;

      case "generate_deck_images":
        if (!body.deck_id) throw new Error("deck_id is required");
        result = await generateDeckVisuals(
          supabase,
          user.id,
          body.deck_id,
          body.company_context || "",
          body.brand_colors
        );
        break;

      case "regenerate_slide_image":
        if (!body.slide_id) throw new Error("slide_id is required");
        result = await regenerateSlideImage(
          supabase,
          user.id,
          body.slide_id,
          body.custom_prompt
        );
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[pitch-deck-agent] Error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal Server Error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
