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
    const { profile, research, competitors, scoring, mvp } = await req.json();

    if (!profile || !research || !competitors || !scoring || !mvp) {
      return new Response(
        JSON.stringify({ error: "All agent results are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare prompt
    const userPrompt = `Compose a comprehensive 14-section validation report.

Profile:\n${JSON.stringify(profile, null, 2)}

Research:\n${JSON.stringify(research, null, 2)}

Competitors:\n${JSON.stringify(competitors, null, 2)}

Scoring:\n${JSON.stringify(scoring, null, 2)}

MVP:\n${JSON.stringify(mvp, null, 2)}

Create all 14 sections with rich, actionable content.`;

    // Call Gemini with positional args (model, systemPrompt, userPrompt, options)
    const timeoutMs = 120000; // 120s
    const result = await callGemini(
      "gemini-3-flash-preview",
      SYSTEM_PROMPT,
      userPrompt,
      { responseJsonSchema: RESPONSE_SCHEMA, timeoutMs, maxOutputTokens: 8192 }
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
    console.error("Error in validator-agent-compose:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Internal server error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
