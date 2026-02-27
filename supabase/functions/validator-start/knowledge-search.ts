/**
 * RAG search for validator pipeline.
 * Calls knowledge-search Edge Function (search-only). Ingest uses knowledge-ingest (X-Internal-Token).
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

const LOAD_KNOWLEDGE_TIMEOUT_MS = 15_000;

// R-04: Circuit breaker — skip knowledge search after repeated failures to save pipeline budget
const CIRCUIT_BREAKER = {
  failureCount: 0,
  lastFailureAt: 0,
  FAILURE_THRESHOLD: 3,      // Open circuit after 3 failures
  COOLDOWN_MS: 5 * 60_000,   // Stay open for 5 minutes
};

function isCircuitOpen(): boolean {
  if (CIRCUIT_BREAKER.failureCount < CIRCUIT_BREAKER.FAILURE_THRESHOLD) return false;
  const elapsed = Date.now() - CIRCUIT_BREAKER.lastFailureAt;
  if (elapsed > CIRCUIT_BREAKER.COOLDOWN_MS) {
    // Half-open: allow one attempt to test recovery
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
    console.warn(`[knowledge-search] Circuit breaker OPEN — skipping for ${CIRCUIT_BREAKER.COOLDOWN_MS / 1000}s after ${CIRCUIT_BREAKER.failureCount} failures`);
  }
}

function recordSuccess(): void {
  if (CIRCUIT_BREAKER.failureCount > 0) {
    console.log('[knowledge-search] Circuit breaker reset — service recovered');
  }
  CIRCUIT_BREAKER.failureCount = 0;
}

/**
 * Search the vector knowledge base via knowledge-search Edge Function.
 * Returns top chunks for the query; optional filter_industry (e.g. "fashion") narrows results.
 * R-04: Circuit breaker skips after 3 failures within 5 minutes.
 */
export async function searchKnowledge(
  supabaseUrl: string,
  serviceRoleKey: string,
  query: string,
  filterIndustry?: string | null
): Promise<KnowledgeSearchResult> {
  // R-04: Circuit breaker — fast-fail if service is persistently down
  if (isCircuitOpen()) {
    return { query, results: [], count: 0 };
  }

  const url = `${supabaseUrl.replace(/\/$/, "")}/functions/v1/knowledge-search`;
  const body: Record<string, unknown> = {
    query: query.trim(),
  };
  if (filterIndustry?.trim()) {
    body.filter_industry = filterIndustry.trim().toLowerCase();
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LOAD_KNOWLEDGE_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (fetchErr) {
    clearTimeout(timeout);
    recordFailure();
    throw fetchErr;
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const errText = await res.text();
    recordFailure();
    throw new Error(`knowledge-search failed: ${res.status} ${errText}`);
  }

  // Promise.race hard timeout — AbortSignal.timeout unreliable on Deno Deploy for .json()
  let data: KnowledgeSearchResult;
  try {
    data = await Promise.race([
      res.json() as Promise<KnowledgeSearchResult>,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("knowledge-search JSON parse timeout")), 10_000)
      ),
    ]);
  } catch (parseErr) {
    recordFailure();
    throw parseErr;
  }

  recordSuccess();
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
