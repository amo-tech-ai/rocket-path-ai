/**
 * Knowledge Ingest Edge Function
 * Chunk, embed, insert markdown into knowledge_chunks.
 * Requires X-Internal-Token (verify_jwt = false). Never callable from browser.
 */

import { createClient } from "npm:@supabase/supabase-js@2";
import { handleCors, corsHeaders } from "../_shared/cors.ts";
import { generateEmbeddings, formatEmbeddingForStorage } from "../_shared/openai-embeddings.ts";
import { checkRateLimit, rateLimitResponse, RATE_LIMITS } from "../_shared/rate-limit.ts";

const BATCH_SIZE = 20;
const CHUNK_MAX_CHARS = 600;
const CHUNK_OVERLAP_CHARS = 80;

const HEADERS = {
  ...corsHeaders,
  "Content-Type": "application/json",
};

interface IngestRequest {
  markdown: string;
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
}

/** Compute SHA-256 hash for deduplication (normalize: trim, LF line endings) */
async function sha256Hex(text: string): Promise<string> {
  const normalized = text.trim().replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const data = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function chunkMarkdownByHeading(
  markdown: string
): { content: string; section_title?: string; page_start?: number; page_end?: number }[] {
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

  const chunks: { content: string; section_title?: string; page_start?: number; page_end?: number }[] = [];
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

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: HEADERS,
    });
  }

  const internalToken = req.headers.get("x-internal-token");
  const secret = Deno.env.get("KNOWLEDGE_INTERNAL_TOKEN");

  if (!secret) {
    console.error("[knowledge-ingest] KNOWLEDGE_INTERNAL_TOKEN not configured");
    return new Response(
      JSON.stringify({ error: "Ingest not configured" }),
      { status: 500, headers: HEADERS }
    );
  }

  if (!internalToken || internalToken !== secret) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: X-Internal-Token required" }),
      { status: 401, headers: HEADERS }
    );
  }

  const rl = checkRateLimit("knowledge-ingest", "ingest", {
    maxRequests: 20,
    windowSeconds: 300,
  });
  if (!rl.allowed) {
    return rateLimitResponse(rl, corsHeaders);
  }

  try {
    const body = (await req.json()) as IngestRequest;
    const { markdown, title, source, source_type, year, confidence, category, industry, sample_size, source_url, tags, document_id } = body;

    const docTitle = (title?.trim() || "Untitled").slice(0, 500);
    const docSource = (source?.trim() || docTitle).slice(0, 500);
    const rawMarkdown = typeof markdown === "string" ? markdown : "";
    if (!rawMarkdown.trim()) {
      return new Response(
        JSON.stringify({ error: "markdown is required" }),
        { status: 400, headers: HEADERS }
      );
    }

    const docSourceType = source_type?.trim() || "research";
    const docYear = year ?? new Date().getFullYear();
    const docConfidence =
      confidence === "high" || confidence === "medium" || confidence === "low"
        ? confidence
        : "medium";
    const docCategory = category?.trim() || "research";
    const docIndustry = industry?.trim() || null;
    const docSampleSize =
      typeof sample_size === "number" && sample_size >= 0 ? sample_size : null;
    const docSourceUrl = source_url?.trim() || null;
    const docTags = Array.isArray(tags) ? tags.filter((t): t is string => typeof t === "string") : null;

    const chunks = chunkMarkdownByHeading(rawMarkdown);
    if (chunks.length === 0) {
      return new Response(
        JSON.stringify({ error: "No chunks produced from markdown" }),
        { status: 400, headers: HEADERS }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 013: content_hash dedupe — skip if document with same content already exists
    const contentHash = await sha256Hex(rawMarkdown);
    const { data: existing } = await supabase
      .from("knowledge_documents")
      .select("id")
      .eq("content_hash", contentHash)
      .maybeSingle();
    if (existing?.id) {
      console.log("[knowledge-ingest] Duplicate skipped (content_hash match):", contentHash.slice(0, 16) + "...");
      return new Response(
        JSON.stringify({
          message: "Document already ingested (content_hash match), 0 new chunks",
          document_id: existing.id,
          chunks_created: 0,
          chunks_total: chunks.length,
          skipped: true,
        }),
        { headers: HEADERS }
      );
    }

    let docId = document_id?.trim() || null;
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
        console.error("[knowledge-ingest] knowledge_documents insert error:", insertDocError);
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
          const { error: insertError } = await supabase.from("knowledge_chunks").insert({
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
