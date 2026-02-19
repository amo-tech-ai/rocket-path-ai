/**
 * Knowledge Search Edge Function
 * Semantic search over knowledge_chunks via search_knowledge RPC.
 * Migrated to shared patterns: JWT auth, rate limiting, shared CORS.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { handleCors, getCorsHeaders } from "../_shared/cors.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse } from "../_shared/rate-limit.ts";
import { generateEmbedding } from "../_shared/openai-embeddings.ts";

interface SearchRequest {
  query: string;
  filter_category?: string | null;
  filter_industry?: string | null;
  match_count?: number;
  match_threshold?: number;
}

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
    );
  }

  const corsHeaders = getCorsHeaders(req);

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // User-scoped client for auth verification
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limit
    const rateResult = checkRateLimit(user.id, "knowledge-search", RATE_LIMITS.standard);
    if (!rateResult.allowed) {
      return rateLimitResponse(rateResult, corsHeaders);
    }

    const body = (await req.json()) as SearchRequest;
    const { query, filter_category, filter_industry, match_count = 10, match_threshold = 0.5 } = body;

    if (!query?.trim()) {
      return new Response(
        JSON.stringify({ error: "query is required for search" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Service role client for vector search RPC (security definer function)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { embedding } = await generateEmbedding(query.trim());
    const filterCat = filter_category?.trim() || null;
    const filterInd = filter_industry?.trim() || null;

    const { data: results, error } = await supabase.rpc("search_knowledge", {
      query_embedding: embedding,
      match_threshold: Number(match_threshold) || 0.5,
      match_count: Math.min(Math.max(Number(match_count) || 10, 1), 50),
      filter_category: filterCat,
      filter_industry: filterInd,
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({
        query: query.trim(),
        results: results ?? [],
        count: (results ?? []).length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[knowledge-search] Error:", err);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: err instanceof Error ? err.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
