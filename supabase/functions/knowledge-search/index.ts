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
  /** Use hybrid (semantic + full-text) search when true; default false for backward compatibility */
  hybrid?: boolean;
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

    // Service-role calls (from pipeline agents) bypass JWT user verification.
    // The service-role key is a server secret — if it matches, caller is trusted.
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const isServiceCall = authHeader === `Bearer ${serviceRoleKey}`;

    let userId = "service-role";
    if (!isServiceCall) {
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
      userId = user.id;
    }

    // Rate limit (skip for service-role calls from internal pipeline)
    if (!isServiceCall) {
      const rateResult = checkRateLimit(userId, "knowledge-search", RATE_LIMITS.standard);
      if (!rateResult.allowed) {
        return rateLimitResponse(rateResult, corsHeaders);
      }
    }

    const body = (await req.json()) as SearchRequest;
    const { query, filter_category, filter_industry, match_count = 10, match_threshold = 0.5, hybrid = false } = body;

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
    const count = Math.min(Math.max(Number(match_count) || 10, 1), 50);
    const threshold = Number(match_threshold) || 0.5;

    const { data: results, error } = hybrid
      ? await supabase.rpc("hybrid_search_knowledge", {
          query_embedding: embedding,
          query_text: query.trim(),
          match_threshold: threshold,
          match_count: count,
          filter_category: filterCat,
          filter_industry: filterInd,
          rrf_k: 50,
        })
      : await supabase.rpc("search_knowledge", {
          query_embedding: embedding,
          match_threshold: threshold,
          match_count: count,
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
