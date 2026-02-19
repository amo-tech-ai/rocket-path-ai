/**
 * Server-side RAG for Coach and AI Chat.
 * Searches knowledge base, formats chunks for LLM injection. No raw chunks to client.
 */

import { generateEmbedding } from "../_shared/openai-embeddings.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

interface KnowledgeChunk {
  id: string;
  content: string;
  source: string;
  source_type: string;
  year: number | null;
  confidence: string | null;
  category: string | null;
  industry: string | null;
  similarity: number;
  document_id?: string | null;
  document_title?: string | null;
  section_title?: string | null;
  page_start?: number | null;
  page_end?: number | null;
}

const RAG_TIMEOUT_MS = 10_000;
const MAX_CHARS = 4000;

function formatChunksForPrompt(chunks: KnowledgeChunk[]): string {
  if (chunks.length === 0) return "";
  let out = "";
  for (const c of chunks) {
    const title = c.document_title || c.source;
    const section = c.section_title ? ` — ${c.section_title}` : "";
    const year = c.year ? ` ${c.year}` : "";
    const page = c.page_start != null ? `, p.${c.page_start}` : "";
    const line = `- [${title}${section}${year}${page}] (similarity ${(c.similarity ?? 0).toFixed(2)}): ${c.content}`;
    if (out.length + line.length + 2 > MAX_CHARS) break;
    out += (out ? "\n" : "") + line;
  }
  return out;
}

/**
 * Get RAG context for injection into LLM prompt.
 * Returns formatted string or empty. Never throws — fails open for chat continuity.
 */
export async function getRAGContext(
  supabase: SupabaseClient,
  query: string,
  filterIndustry?: string | null
): Promise<string> {
  const q = query?.trim();
  if (!q) return "";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), RAG_TIMEOUT_MS);

    const { embedding } = await generateEmbedding(q);
    clearTimeout(timeoutId);

    const filterInd = filterIndustry?.trim()?.toLowerCase() || null;

    const { data: results, error } = await supabase.rpc("search_knowledge", {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 10,
      filter_category: null,
      filter_industry: filterInd,
    });

    if (error) {
      console.warn("[AI Chat RAG] search_knowledge error:", error.message);
      return "";
    }

    const chunks = (results ?? []) as KnowledgeChunk[];
    if (chunks.length === 0) return "";

    console.log(`[AI Chat RAG] Found ${chunks.length} chunks for query`);
    return formatChunksForPrompt(chunks);
  } catch (e) {
    console.warn("[AI Chat RAG] Failed (continuing without):", e instanceof Error ? e.message : e);
    return "";
  }
}
