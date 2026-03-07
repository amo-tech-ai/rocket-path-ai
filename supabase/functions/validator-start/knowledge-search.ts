/**
 * RAG search for validator pipeline.
 * Uses direct RPC to hybrid_search_knowledge (no HTTP round-trip, no 401).
 */

import { generateEmbedding } from "../_shared/openai-embeddings.ts";

export interface KnowledgeChunk {
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

export interface KnowledgeSearchResult {
  query: string;
  results: KnowledgeChunk[];
  count: number;
}

// R-04: Circuit breaker — skip knowledge search after repeated failures to save pipeline budget
const CIRCUIT_BREAKER = {
  failureCount: 0,
  lastFailureAt: 0,
  FAILURE_THRESHOLD: 3,
  COOLDOWN_MS: 5 * 60_000,
};

function isCircuitOpen(): boolean {
  if (CIRCUIT_BREAKER.failureCount < CIRCUIT_BREAKER.FAILURE_THRESHOLD) return false;
  const elapsed = Date.now() - CIRCUIT_BREAKER.lastFailureAt;
  if (elapsed > CIRCUIT_BREAKER.COOLDOWN_MS) {
    CIRCUIT_BREAKER.failureCount = CIRCUIT_BREAKER.FAILURE_THRESHOLD - 1;
    console.log('[knowledge-search] Circuit breaker half-open — allowing probe request');
    return false;
  }
  return true;
}

function recordFailure(): void {
  CIRCUIT_BREAKER.failureCount++;
  CIRCUIT_BREAKER.lastFailureAt = Date.now();
  if (CIRCUIT_BREAKER.failureCount >= CIRCUIT_BREAKER.FAILURE_THRESHOLD) {
    console.warn(`[knowledge-search] Circuit breaker OPEN — skipping for ${CIRCUIT_BREAKER.COOLDOWN_MS / 1000}s`);
  }
}

function recordSuccess(): void {
  if (CIRCUIT_BREAKER.failureCount > 0) {
    console.log('[knowledge-search] Circuit breaker reset');
  }
  CIRCUIT_BREAKER.failureCount = 0;
}

// deno-lint-ignore no-explicit-any
type SupabaseClient = any;

/**
 * Direct RPC search — calls hybrid_search_knowledge via the admin Supabase client.
 * No HTTP round-trip, no 401 issues. Uses OpenAI embedding + Postgres hybrid search.
 */
export async function searchKnowledge(
  supabase: SupabaseClient,
  query: string,
  filterIndustry?: string | null
): Promise<KnowledgeSearchResult> {
  if (isCircuitOpen()) {
    return { query, results: [], count: 0 };
  }

  const trimmedQuery = query.trim();
  if (!trimmedQuery) return { query, results: [], count: 0 };

  try {
    const { embedding } = await generateEmbedding(trimmedQuery);

    const { data: results, error } = await supabase.rpc("hybrid_search_knowledge", {
      query_embedding: `[${embedding.join(",")}]`,
      query_text: trimmedQuery,
      match_threshold: 0.5,
      match_count: 10,
      filter_category: null,
      filter_industry: filterIndustry?.trim()?.toLowerCase() ?? null,
      rrf_k: 50,
    });

    if (error) {
      recordFailure();
      throw new Error(`hybrid_search_knowledge RPC: ${error.message}`);
    }

    recordSuccess();
    const chunks: KnowledgeChunk[] = (results ?? []).map((r: Record<string, unknown>) => ({
      id: r.id as string,
      content: r.content as string,
      source: r.source as string,
      source_type: r.source_type as string,
      year: r.year as number | null,
      confidence: r.confidence as string | null,
      category: r.category as string | null,
      industry: r.industry as string | null,
      similarity: r.similarity as number,
      document_id: r.document_id as string | null,
      document_title: r.document_title as string | null,
      section_title: r.section_title as string | null,
      page_start: r.page_start as number | null,
      page_end: r.page_end as number | null,
    }));

    return { query: trimmedQuery, results: chunks, count: chunks.length };
  } catch (e) {
    recordFailure();
    throw e;
  }
}

/**
 * Format RAG chunks for injection into the Research agent system prompt.
 */
export function formatKnowledgeForPrompt(chunks: KnowledgeChunk[], maxChars = 4000): string {
  if (chunks.length === 0) return "";

  let out = "";
  for (const c of chunks) {
    const title = c.document_title || c.source;
    const section = c.section_title ? ` — ${c.section_title}` : "";
    const year = c.year ? ` ${c.year}` : "";
    const page = c.page_start != null ? `, p.${c.page_start}` : "";
    const line = `- [${title}${section}${year}${page}] (similarity ${(c.similarity ?? 0).toFixed(2)}): ${c.content}`;
    if (out.length + line.length + 2 > maxChars) break;
    out += (out ? "\n" : "") + line;
  }
  return out;
}
