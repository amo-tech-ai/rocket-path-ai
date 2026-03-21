/**
 * Shared RAG context helper for all edge functions.
 * Searches knowledge_chunks via hybrid_search_knowledge RPC.
 * Returns formatted context for prompt injection. Never throws — fails open.
 *
 * Usage:
 *   import { getRAGContext, buildRAGBlock } from "../_shared/rag-context.ts";
 *   const rag = await getRAGContext(supabaseAdmin, { query: "healthtech benchmarks", industry: "healthcare" });
 *   const systemPrompt = `${basePrompt}${buildRAGBlock(rag)}`;
 */

import { generateEmbedding } from "./openai-embeddings.ts";

// deno-lint-ignore no-explicit-any
type SupabaseClient = any;

export interface RAGOptions {
  query: string;
  industry?: string | null;
  category?: string | null;
  matchCount?: number;
  matchThreshold?: number;
}

export interface RAGChunk {
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

export interface RAGResult {
  context: string;
  citations: string[];
  chunkCount: number;
}

const EMPTY: RAGResult = { context: "", citations: [], chunkCount: 0 };
const RAG_TIMEOUT_MS = 10_000;
const MAX_CONTEXT_CHARS = 4000;

/**
 * Retrieve RAG context from knowledge_chunks via hybrid search.
 * Returns formatted context string for prompt injection.
 * Never throws — returns EMPTY on any failure.
 */
export async function getRAGContext(
  supabase: SupabaseClient,
  options: RAGOptions
): Promise<RAGResult> {
  const q = options.query?.trim();
  if (!q) return EMPTY;

  try {
    // Promise.race: 10s hard timeout (embedding + search combined)
    const result = await Promise.race([
      _executeSearch(supabase, q, options),
      new Promise<RAGResult>((_, reject) =>
        setTimeout(() => reject(new Error("RAG timeout")), RAG_TIMEOUT_MS)
      ),
    ]);
    return result;
  } catch (e) {
    console.warn(
      "[RAG] Failed (continuing without):",
      e instanceof Error ? e.message : e
    );
    return EMPTY;
  }
}

async function _executeSearch(
  supabase: SupabaseClient,
  query: string,
  options: RAGOptions
): Promise<RAGResult> {
  const { embedding } = await generateEmbedding(query);

  const { data, error } = await supabase.rpc("hybrid_search_knowledge", {
    query_embedding: `[${embedding.join(",")}]`,
    query_text: query,
    match_threshold: options.matchThreshold ?? 0.5,
    match_count: options.matchCount ?? 5,
    filter_category: options.category ?? null,
    filter_industry: options.industry?.trim()?.toLowerCase() ?? null,
    rrf_k: 50,
  });

  if (error) {
    console.warn("[RAG] hybrid_search_knowledge error:", error.message);
    return EMPTY;
  }

  const chunks = (data ?? []) as RAGChunk[];
  if (chunks.length === 0) return EMPTY;

  console.log(`[RAG] Found ${chunks.length} chunks for "${query.slice(0, 60)}..."`);

  const context = _formatChunks(chunks);
  const citations = chunks
    .map((c) => c.document_title || c.source)
    .filter(Boolean) as string[];
  // Deduplicate citations
  const uniqueCitations = [...new Set(citations)];

  return { context, citations: uniqueCitations, chunkCount: chunks.length };
}

function _formatChunks(chunks: RAGChunk[]): string {
  let out = "";
  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i];
    const title = c.document_title || c.source;
    const section = c.section_title ? ` — ${c.section_title}` : "";
    const year = c.year ? ` ${c.year}` : "";
    const page = c.page_start != null ? `, p.${c.page_start}` : "";
    const sim = (c.similarity ?? 0).toFixed(2);
    const line = `[${i + 1}] ${title}${section}${year}${page} (${sim}): ${c.content.slice(0, 600)}`;
    if (out.length + line.length + 2 > MAX_CONTEXT_CHARS) break;
    out += (out ? "\n\n" : "") + line;
  }
  return out;
}

/**
 * Build a prompt block from RAG results.
 * Append this to any system prompt to inject knowledge base context.
 * Returns empty string if no context — safe to always append.
 */
export function buildRAGBlock(rag: RAGResult): string {
  if (!rag.context) return "";
  return `

## EXPERT KNOWLEDGE (from verified sources — cite when used)

${rag.context}

RULES:
- When you use data from these sources, label it [CITED] with the source name
- When you estimate without a source, label it [ESTIMATED]
- When you infer from the founder's own data, label it [FOUNDER DATA]
- Never present [ESTIMATED] data as if it were [CITED]
`;
}

/**
 * Build a RAG query enriched with feature context.
 * Combines the user's input with feature-specific keywords for better retrieval.
 */
export function buildRAGQuery(params: {
  userInput: string;
  industry?: string | null;
  feature:
    | "validator"
    | "pitch"
    | "sprint"
    | "canvas"
    | "investor"
    | "chat";
}): RAGOptions {
  const prefix: Record<string, string> = {
    validator: "startup validation benchmarks metrics",
    pitch: "investor pitch deck market data traction",
    sprint: "execution plan priorities tasks milestones",
    canvas: "business model lean canvas strategy",
    investor: "fundraising investor expectations deal terms",
    chat: "",
  };

  const query = `${prefix[params.feature] || ""} ${params.industry || ""} ${params.userInput}`.trim();

  return {
    query,
    industry: params.industry,
    matchCount: params.feature === "validator" ? 10 : 5,
    matchThreshold: params.feature === "chat" ? 0.5 : 0.6,
  };
}
