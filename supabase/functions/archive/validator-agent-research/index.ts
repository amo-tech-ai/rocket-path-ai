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
    const { profile, search_queries } = await req.json();

    if (!profile) {
      return new Response(
        JSON.stringify({ error: "profile is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare prompt
    const userPrompt = `Startup profile:\n${JSON.stringify(profile, null, 2)}\n\nSearch queries:\n${
      search_queries ? search_queries.join("\n") : "None provided"
    }\n\nPerform market research and estimate TAM, SAM, SOM. Identify trends and growth rate.`;

    // Call Gemini with Google Search and URL context enabled
    const timeoutMs = 90000; // 90s
    const result = await callGemini(
      "gemini-3-flash-preview",
      SYSTEM_PROMPT,
      userPrompt,
      { responseJsonSchema: RESPONSE_SCHEMA, timeoutMs, useSearch: true, useUrlContext: true }
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
    console.error("Error in validator-agent-research:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Internal server error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
