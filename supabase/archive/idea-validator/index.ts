/**
 * Idea Validator Edge Function
 * Action-based routing: quick | deep | competitor_finder | market_sizer | framework_analyzer | critic | generate_ideas
 */

import { corsHeaders, handleCors } from "../../functions/_shared/cors.ts";
import { verifyAuth } from "../../functions/_shared/auth.ts";
import { handleQuick } from "./handlers/quick.ts";
import { handleDeep } from "./handlers/deep.ts";
import { handleCompetitorFinder } from "./handlers/competitor_finder.ts";
import { handleMarketSizer } from "./handlers/market_sizer.ts";
import { handleFrameworkAnalyzer } from "./handlers/framework_analyzer.ts";
import { handleCritic } from "./handlers/critic.ts";
import { handleGenerateIdeas } from "./handlers/generate_ideas.ts";

// Validate required environment variables at startup
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

if (!GEMINI_API_KEY) {
  console.warn("[idea-validator] WARNING: GEMINI_API_KEY not set - AI features will fail");
}
if (!ANTHROPIC_API_KEY) {
  console.warn("[idea-validator] WARNING: ANTHROPIC_API_KEY not set - critic action will fail");
}

export interface ValidatorRequestBody {
  action: string;
  idea_text?: string;
  startup_id?: string;
  quick_report_id?: string;
  market?: string;
  region?: string;
  framework?: string;
  report_summary?: string;
  background?: string;
  count?: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return handleCors();
  }

  try {
    const auth = await verifyAuth(req);
    if (!auth) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", message: "Invalid or missing authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let body: ValidatorRequestBody;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action } = body;
    if (!action) {
      return new Response(
        JSON.stringify({ error: "Missing action" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[idea-validator] action=${action} user=${auth.user.id}`);

    let result: unknown;

    switch (action) {
      case "quick":
        if (!body.idea_text) {
          return new Response(
            JSON.stringify({ error: "idea_text required for quick" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = await handleQuick(auth, body.idea_text, body.startup_id);
        break;

      case "deep":
        if (!body.idea_text) {
          return new Response(
            JSON.stringify({ error: "idea_text required for deep" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = await handleDeep(auth, body.idea_text, body.startup_id, body.quick_report_id);
        break;

      case "competitor_finder":
        if (!body.idea_text) {
          return new Response(
            JSON.stringify({ error: "idea_text required for competitor_finder" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = await handleCompetitorFinder(auth, body.idea_text, body.market);
        break;

      case "market_sizer":
        if (!body.idea_text) {
          return new Response(
            JSON.stringify({ error: "idea_text required for market_sizer" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = await handleMarketSizer(auth, body.idea_text, body.region);
        break;

      case "framework_analyzer":
        if (!body.idea_text) {
          return new Response(
            JSON.stringify({ error: "idea_text required for framework_analyzer" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = await handleFrameworkAnalyzer(auth, body.idea_text, body.framework);
        break;

      case "critic":
        if (!body.idea_text) {
          return new Response(
            JSON.stringify({ error: "idea_text required for critic" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = await handleCritic(auth, body.idea_text, body.report_summary);
        break;

      case "generate_ideas":
        if (!body.background) {
          return new Response(
            JSON.stringify({ error: "background required for generate_ideas" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = await handleGenerateIdeas(auth, body.background, body.count);
        break;

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[idea-validator] error:", err);
    return new Response(
      JSON.stringify({ error: String(err), success: false }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
