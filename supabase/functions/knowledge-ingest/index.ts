/**
 * Knowledge Ingest Edge Function
 * Consolidated knowledge management: ingest, embed, search, status.
 *
 * Actions & Auth:
 * - ingest              (X-Internal-Token) — chunk, embed, insert markdown
 * - ingest_from_llamacloud (JWT)           — fetch from LlamaCloud, chunk, embed, insert
 * - generate_embeddings    (JWT)           — backfill embeddings for chunks missing them
 * - status                 (JWT)           — check embedding status
 * - test_search            (JWT)           — run test query against search_knowledge RPC
 */

import { createClient } from "npm:@supabase/supabase-js@2";
import { handleCors, corsHeaders } from "../_shared/cors.ts";
import {
  generateEmbedding,
  generateEmbeddings,
  formatEmbeddingForStorage,
} from "../_shared/openai-embeddings.ts";
import { checkRateLimit, rateLimitResponse, RATE_LIMITS } from "../_shared/rate-limit.ts";

const BATCH_SIZE = 20;
const CHUNK_MAX_CHARS = 600;
const CHUNK_OVERLAP_CHARS = 80;
const LLAMACLOUD_MARKDOWN_URL =
  "https://api.cloud.llamaindex.ai/api/v1/parsing/job";

const HEADERS = {
  ...corsHeaders,
  "Content-Type": "application/json",
};

type Action =
  | "ingest"
  | "ingest_from_llamacloud"
  | "generate_embeddings"
  | "status"
  | "test_search";

interface IngestRequest {
  action?: Action;
  markdown?: string;
  title?: string;
  source?: string;
  source_type?: string;
  year?: number;
  confidence?: string;
  category?: string;
  industry?: string;
  sample_size?: number;
  source_url?: string;
  tags?: string[];
  document_id?: string;
  // ingest_from_llamacloud
  llama_parse_id?: string;
  // generate_embeddings
  limit?: number;
  // test_search
  query?: string;
  filter_category?: string | null;
  filter_industry?: string | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Compute SHA-256 hash for deduplication */
async function sha256Hex(text: string): Promise<string> {
  const normalized = text.trim().replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const data = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Chunk markdown by headings (## / ###), then by length with overlap. */
function chunkMarkdownByHeading(
  markdown: string
): {
  content: string;
  section_title?: string;
  page_start?: number;
  page_end?: number;
}[] {
  const sections: { title: string; text: string }[] = [];
  const parts = markdown.split(/\n(#{2,3}\s)/).filter(Boolean);
  let currentTitle = "Document";
  let currentText = "";

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (/^#{2,3}\s/.test(part)) {
      if (currentText.trim()) {
        sections.push({ title: currentTitle, text: currentText.trim() });
      }
      currentTitle = part.replace(/^#{2,3}\s*/, "").trim() || currentTitle;
      currentText = "";
    } else {
      currentText += (currentText ? "\n" : "") + part;
    }
  }
  if (currentText.trim()) {
    sections.push({ title: currentTitle, text: currentText.trim() });
  }

  const chunks: {
    content: string;
    section_title?: string;
    page_start?: number;
    page_end?: number;
  }[] = [];
  for (const { title, text } of sections) {
    if (text.length <= CHUNK_MAX_CHARS) {
      chunks.push({ content: text, section_title: title });
      continue;
    }
    let start = 0;
    while (start < text.length) {
      let end = Math.min(start + CHUNK_MAX_CHARS, text.length);
      if (end < text.length) {
        const lastSpace = text.lastIndexOf(" ", end);
        if (lastSpace > start) end = lastSpace;
      }
      const slice = text.slice(start, end).trim();
      if (slice) chunks.push({ content: slice, section_title: title });
      start = end - (end < text.length ? CHUNK_OVERLAP_CHARS : 0);
      if (start >= text.length) break;
    }
  }
  return chunks;
}

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

function verifyInternalToken(req: Request): boolean {
  const token = req.headers.get("x-internal-token");
  const secret = Deno.env.get("KNOWLEDGE_INTERNAL_TOKEN");
  return !!secret && !!token && token === secret;
}

async function verifyJwt(
  req: Request
): Promise<{ userId: string } | Response> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Missing Authorization header" }),
      { status: 401, headers: HEADERS }
    );
  }
  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const {
    data: { user },
    error,
  } = await authClient.auth.getUser();
  if (error || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: HEADERS,
    });
  }
  return { userId: user.id };
}

function getServiceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

// ---------------------------------------------------------------------------
// Action handlers
// ---------------------------------------------------------------------------

/** ingest — chunk, embed, insert markdown. Uses X-Internal-Token auth. */
async function handleIngest(body: IngestRequest) {
  const supabase = getServiceClient();

  const docTitle = (body.title?.trim() || "Untitled").slice(0, 500);
  const docSource = (body.source?.trim() || docTitle).slice(0, 500);
  const rawMarkdown = typeof body.markdown === "string" ? body.markdown : "";
  if (!rawMarkdown.trim()) {
    return new Response(JSON.stringify({ error: "markdown is required" }), {
      status: 400,
      headers: HEADERS,
    });
  }

  const docSourceType = body.source_type?.trim() || "research";
  const docYear = body.year ?? new Date().getFullYear();
  const docConfidence =
    body.confidence === "high" ||
    body.confidence === "medium" ||
    body.confidence === "low"
      ? body.confidence
      : "medium";
  const docCategory = body.category?.trim() || "research";
  const docIndustry = body.industry?.trim() || null;
  const docSampleSize =
    typeof body.sample_size === "number" && body.sample_size >= 0
      ? body.sample_size
      : null;
  const docSourceUrl = body.source_url?.trim() || null;
  const docTags = Array.isArray(body.tags)
    ? body.tags.filter((t): t is string => typeof t === "string")
    : null;

  const chunks = chunkMarkdownByHeading(rawMarkdown);
  if (chunks.length === 0) {
    return new Response(
      JSON.stringify({ error: "No chunks produced from markdown" }),
      { status: 400, headers: HEADERS }
    );
  }

  // Content-hash dedup
  const contentHash = await sha256Hex(rawMarkdown);
  const { data: existing } = await supabase
    .from("knowledge_documents")
    .select("id")
    .eq("content_hash", contentHash)
    .maybeSingle();
  if (existing?.id) {
    console.log(
      "[knowledge-ingest] Duplicate skipped:",
      contentHash.slice(0, 16) + "..."
    );
    return new Response(
      JSON.stringify({
        message:
          "Document already ingested (content_hash match), 0 new chunks",
        document_id: existing.id,
        chunks_created: 0,
        chunks_total: chunks.length,
        skipped: true,
      }),
      { headers: HEADERS }
    );
  }

  let docId = body.document_id?.trim() || null;
  if (!docId) {
    const { data: inserted, error: insertDocError } = await supabase
      .from("knowledge_documents")
      .insert({
        title: docTitle,
        source_type: docSourceType,
        year: docYear,
        llama_parse_id: null,
        content_hash: contentHash,
      })
      .select("id")
      .single();
    if (insertDocError) {
      console.error("[knowledge-ingest] doc insert error:", insertDocError);
      return new Response(
        JSON.stringify({
          error: "Failed to create knowledge_document",
          details: insertDocError.message,
        }),
        { status: 500, headers: HEADERS }
      );
    }
    docId = inserted?.id ?? null;
  }

  let processed = 0;
  const errors: string[] = [];

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    try {
      const results = await generateEmbeddings(batch.map((c) => c.content));
      for (let j = 0; j < batch.length; j++) {
        const chunk = batch[j];
        const embResult = results[j];
        if (!embResult?.embedding) continue;
        const { error: insertError } = await supabase
          .from("knowledge_chunks")
          .insert({
            content: chunk.content,
            embedding: formatEmbeddingForStorage(embResult.embedding),
            source: docSource,
            source_type: docSourceType,
            year: docYear,
            confidence: docConfidence,
            category: docCategory,
            document_id: docId,
            section_title: chunk.section_title ?? null,
            page_start: chunk.page_start ?? null,
            page_end: chunk.page_end ?? null,
            ...(docIndustry && { industry: docIndustry }),
            ...(docSampleSize != null && { sample_size: docSampleSize }),
            ...(docSourceUrl && { source_url: docSourceUrl }),
            ...(docTags && docTags.length > 0 && { tags: docTags }),
          });
        if (insertError) {
          errors.push(`Chunk ${i + j}: ${insertError.message}`);
        } else {
          processed++;
        }
      }
    } catch (batchErr) {
      errors.push(
        `Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batchErr instanceof Error ? batchErr.message : "Unknown"}`
      );
    }
    if (i + BATCH_SIZE < chunks.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return new Response(
    JSON.stringify({
      message: `Ingested ${processed} chunks from markdown`,
      document_id: docId,
      chunks_created: processed,
      chunks_total: chunks.length,
      errors: errors.length > 0 ? errors : undefined,
    }),
    { headers: HEADERS }
  );
}

/** ingest_from_llamacloud — fetch parsed doc from LlamaCloud, chunk, embed, insert */
async function handleIngestFromLlamacloud(body: IngestRequest) {
  const llamaCloudKey = Deno.env.get("LLAMACLOUD_API_KEY");
  if (!llamaCloudKey) {
    return new Response(
      JSON.stringify({ error: "LLAMACLOUD_API_KEY is not configured" }),
      { status: 500, headers: HEADERS }
    );
  }

  const llama_parse_id = body.llama_parse_id?.trim();
  if (!llama_parse_id) {
    return new Response(
      JSON.stringify({ error: "llama_parse_id is required" }),
      { status: 400, headers: HEADERS }
    );
  }

  const docTitle = (body.title?.trim() || "Untitled").slice(0, 500);
  const docSourceType = body.source_type?.trim() || "other";
  const docYear = body.year ?? new Date().getFullYear();
  const docConfidence =
    body.confidence === "high" ||
    body.confidence === "medium" ||
    body.confidence === "low"
      ? body.confidence
      : "medium";
  const docCategory = body.category?.trim() || "research";

  // Fetch markdown from LlamaCloud
  let markdown: string;
  try {
    const url = `${LLAMACLOUD_MARKDOWN_URL}/${encodeURIComponent(llama_parse_id)}/result/markdown`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${llamaCloudKey}`,
      },
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error("[knowledge-ingest] LlamaCloud error:", res.status, errText);
      return new Response(
        JSON.stringify({
          error: `LlamaCloud API error: ${res.status}`,
          details: errText.slice(0, 200),
        }),
        { status: 502, headers: HEADERS }
      );
    }
    const data = await res.json();
    markdown = typeof data.markdown === "string" ? data.markdown : "";
  } catch (e) {
    console.error("[knowledge-ingest] LlamaCloud fetch error:", e);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch from LlamaCloud",
        details: e instanceof Error ? e.message : "Unknown",
      }),
      { status: 502, headers: HEADERS }
    );
  }

  if (!markdown?.trim()) {
    return new Response(
      JSON.stringify({ error: "LlamaCloud returned empty markdown" }),
      { status: 400, headers: HEADERS }
    );
  }

  const chunks = chunkMarkdownByHeading(markdown);
  if (chunks.length === 0) {
    return new Response(
      JSON.stringify({ error: "No chunks produced from markdown" }),
      { status: 400, headers: HEADERS }
    );
  }

  const supabase = getServiceClient();

  let docId = body.document_id?.trim() || null;
  if (!docId) {
    const { data: inserted, error: insertDocError } = await supabase
      .from("knowledge_documents")
      .insert({
        title: docTitle,
        source_type: docSourceType,
        year: docYear,
        llama_parse_id,
      })
      .select("id")
      .single();
    if (insertDocError) {
      console.error("[knowledge-ingest] doc insert error:", insertDocError);
      return new Response(
        JSON.stringify({
          error: "Failed to create knowledge_document",
          details: insertDocError.message,
        }),
        { status: 500, headers: HEADERS }
      );
    }
    docId = inserted?.id ?? null;
  }

  let processed = 0;
  const errors: string[] = [];

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    try {
      const results = await generateEmbeddings(batch.map((c) => c.content));
      for (let j = 0; j < batch.length; j++) {
        const chunk = batch[j];
        const embResult = results[j];
        if (!embResult?.embedding) continue;
        const { error: insertError } = await supabase
          .from("knowledge_chunks")
          .insert({
            content: chunk.content,
            embedding: formatEmbeddingForStorage(embResult.embedding),
            source: docTitle,
            source_type: docSourceType,
            year: docYear,
            confidence: docConfidence,
            category: docCategory,
            document_id: docId,
            section_title: chunk.section_title || null,
            page_start: chunk.page_start ?? null,
            page_end: chunk.page_end ?? null,
          });
        if (insertError) {
          errors.push(`Chunk ${i + j}: ${insertError.message}`);
        } else {
          processed++;
        }
      }
    } catch (batchErr) {
      errors.push(
        `Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batchErr instanceof Error ? batchErr.message : "Unknown"}`
      );
    }
    if (i + BATCH_SIZE < chunks.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return new Response(
    JSON.stringify({
      message: `Ingested ${processed} chunks from LlamaCloud`,
      document_id: docId,
      chunks_created: processed,
      chunks_total: chunks.length,
      errors: errors.length > 0 ? errors : undefined,
    }),
    { headers: HEADERS }
  );
}

/** generate_embeddings — backfill embeddings for chunks that don't have them */
async function handleGenerateEmbeddings(body: IngestRequest) {
  const supabase = getServiceClient();
  const limit = body.limit || 50;

  const { data: chunks, error: fetchError } = await supabase
    .from("knowledge_chunks")
    .select("id, content")
    .is("embedding", null)
    .limit(limit);

  if (fetchError) throw fetchError;

  if (!chunks || chunks.length === 0) {
    return new Response(
      JSON.stringify({ message: "No chunks pending embeddings", processed: 0 }),
      { headers: HEADERS }
    );
  }

  console.log(`[knowledge-ingest] Backfilling ${chunks.length} embeddings`);

  let processed = 0;
  const errors: string[] = [];

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    try {
      const results = await generateEmbeddings(batch.map((c) => c.content));
      for (let j = 0; j < batch.length; j++) {
        const chunk = batch[j];
        const embResult = results[j];
        if (!embResult?.embedding) continue;
        const { error: updateError } = await supabase
          .from("knowledge_chunks")
          .update({
            embedding: formatEmbeddingForStorage(embResult.embedding),
          })
          .eq("id", chunk.id);
        if (updateError) {
          errors.push(`${chunk.id}: ${updateError.message}`);
        } else {
          processed++;
        }
      }
    } catch (batchErr) {
      errors.push(
        `Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batchErr instanceof Error ? batchErr.message : "Unknown"}`
      );
    }
    if (i + BATCH_SIZE < chunks.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  // Return updated status
  const { data: statusData } = await supabase
    .from("knowledge_chunks")
    .select("id, embedding")
    .limit(1000);

  const total = statusData?.length || 0;
  const withEmbeddings =
    statusData?.filter((s) => s.embedding !== null).length || 0;

  return new Response(
    JSON.stringify({
      message: `Processed ${processed} chunks`,
      processed,
      errors: errors.length > 0 ? errors : undefined,
      status: {
        total,
        withEmbeddings,
        pending: total - withEmbeddings,
        percentComplete:
          total > 0 ? Math.round((withEmbeddings / total) * 100) : 0,
      },
    }),
    { headers: HEADERS }
  );
}

/** status — check embedding status */
async function handleStatus() {
  const supabase = getServiceClient();

  const { data: stats, error } = await supabase
    .from("knowledge_chunks")
    .select("id, embedding")
    .limit(1000);

  if (error) throw error;

  const total = stats?.length || 0;
  const withEmbeddings =
    stats?.filter((s) => s.embedding !== null).length || 0;

  return new Response(
    JSON.stringify({
      total,
      withEmbeddings,
      pending: total - withEmbeddings,
      percentComplete:
        total > 0 ? Math.round((withEmbeddings / total) * 100) : 0,
    }),
    { headers: HEADERS }
  );
}

/** test_search — run a test query against search_knowledge RPC */
async function handleTestSearch(body: IngestRequest) {
  if (!body.query) {
    return new Response(
      JSON.stringify({ error: "query is required for test_search" }),
      { status: 400, headers: HEADERS }
    );
  }

  const supabase = getServiceClient();
  const embResult = await generateEmbedding(body.query);

  const { data: results, error: searchError } = await supabase.rpc(
    "search_knowledge",
    {
      query_embedding: formatEmbeddingForStorage(embResult.embedding),
      match_threshold: 0.5,
      match_count: 10,
      filter_category: body.filter_category?.trim() || null,
      filter_industry: body.filter_industry?.trim() || null,
    }
  );

  if (searchError) throw searchError;

  return new Response(
    JSON.stringify({
      query: body.query,
      results: results || [],
      count: results?.length || 0,
    }),
    { headers: HEADERS }
  );
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: HEADERS,
    });
  }

  try {
    const body = (await req.json()) as IngestRequest;
    const action: Action = body.action || "ingest";

    console.log(`[knowledge-ingest] Action: ${action}`);

    // Route: ingest uses internal token auth; everything else uses JWT
    if (action === "ingest") {
      if (!verifyInternalToken(req)) {
        return new Response(
          JSON.stringify({
            error: "Unauthorized: X-Internal-Token required",
          }),
          { status: 401, headers: HEADERS }
        );
      }

      const rl = checkRateLimit("knowledge-ingest", "ingest", {
        maxRequests: 20,
        windowSeconds: 300,
      });
      if (!rl.allowed) return rateLimitResponse(rl, corsHeaders);

      return await handleIngest(body);
    }

    // JWT-authenticated admin actions
    const authResult = await verifyJwt(req);
    if (authResult instanceof Response) return authResult;

    // Rate limit admin actions
    const rl = checkRateLimit(
      authResult.userId,
      "knowledge-ingest",
      RATE_LIMITS.standard
    );
    if (!rl.allowed) return rateLimitResponse(rl, corsHeaders);

    switch (action) {
      case "status":
        return await handleStatus();
      case "test_search":
        return await handleTestSearch(body);
      case "generate_embeddings":
        return await handleGenerateEmbeddings(body);
      case "ingest_from_llamacloud":
        return await handleIngestFromLlamacloud(body);
      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: HEADERS,
        });
    }
  } catch (err) {
    console.error("[knowledge-ingest] Error:", err);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: err instanceof Error ? err.message : "Unknown error",
      }),
      { status: 500, headers: HEADERS }
    );
  }
});
