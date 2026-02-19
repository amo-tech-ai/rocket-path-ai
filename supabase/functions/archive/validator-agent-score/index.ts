import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { callGemini, extractJSON } from "../_shared/gemini.ts";
import { SYSTEM_PROMPT, RESPONSE_SCHEMA } from "./prompt.ts";

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  const preflight = handleCors(req);
  if (preflight) return preflight;

  const corsHeaders = getCorsHeaders(req);

  try {
    // Only accept POST
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Service-role authentication
    const authHeader = req.headers.get("Authorization");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!authHeader || !serviceRoleKey || !authHeader.includes(serviceRoleKey)) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - service role required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { profile, research, competitors } = await req.json();

    if (!profile || !research || !competitors) {
      return new Response(
        JSON.stringify({ error: "profile, research, and competitors are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare prompt
    const userPrompt = `Startup profile:\n${JSON.stringify(profile, null, 2)}\n\nMarket research:\n${JSON.stringify(research, null, 2)}\n\nCompetitors:\n${JSON.stringify(competitors, null, 2)}\n\nScore this startup idea across all dimensions and provide an overall verdict.`;

    // Call Gemini with thinking enabled (thinkingLevel disables responseJsonSchema per Gemini)
    const timeoutMs = 30000; // 30s
    const result = await callGemini(
      "gemini-3-flash-preview",
      SYSTEM_PROMPT,
      userPrompt,
      { responseJsonSchema: RESPONSE_SCHEMA, timeoutMs, thinkingLevel: "high" }
    );
    const data = extractJSON(result.text);

    return new Response(
      JSON.stringify({
        success: true,
        data,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in validator-agent-score:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Internal server error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
