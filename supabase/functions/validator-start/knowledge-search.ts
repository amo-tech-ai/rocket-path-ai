/**
 * RAG search for validator pipeline.
 * Calls load-knowledge Edge Function with action test_search; used by Research agent.
 */

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
}

export interface KnowledgeSearchResult {
  query: string;
  results: KnowledgeChunk[];
  count: number;
}

const LOAD_KNOWLEDGE_TIMEOUT_MS = 15_000;

/**
 * Search the vector knowledge base via load-knowledge test_search.
 * Returns top chunks for the query; optional filter_industry (e.g. "fashion") narrows results.
 */
export async function searchKnowledge(
  supabaseUrl: string,
  serviceRoleKey: string,
  query: string,
  filterIndustry?: string | null
): Promise<KnowledgeSearchResult> {
  const url = `${supabaseUrl.replace(/\/$/, "")}/functions/v1/load-knowledge`;
  const body: Record<string, unknown> = {
    action: "test_search",
    query: query.trim(),
  };
  if (filterIndustry?.trim()) {
    body.filter_industry = filterIndustry.trim().toLowerCase();
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(LOAD_KNOWLEDGE_TIMEOUT_MS),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`load-knowledge test_search failed: ${res.status} ${errText}`);
  }

  const data = (await res.json()) as KnowledgeSearchResult;
  return {
    query: data.query ?? query,
    results: Array.isArray(data.results) ? data.results : [],
    count: data.count ?? 0,
  };
}

/**
 * Format RAG chunks for injection into the Research agent system prompt.
 */
export function formatKnowledgeForPrompt(chunks: KnowledgeChunk[], maxChars = 4000): string {
  if (chunks.length === 0) return "";

  let out = "";
  for (const c of chunks) {
    const line = `- [${c.source}${c.year ? ` ${c.year}` : ""}] (similarity ${(c.similarity ?? 0).toFixed(2)}): ${c.content}`;
    if (out.length + line.length + 2 > maxChars) break;
    out += (out ? "\n" : "") + line;
  }
  return out;
}
