---
name: pgvector-setup
description: |
  Supabase pgvector setup, RAG pipeline, and vector search for StartupAI. Covers knowledge_chunks schema,
  HNSW/IVFFlat indexes, search_knowledge + hybrid_search_knowledge RPCs, embedding generation via OpenAI,
  Edge Function integration, and Gemini web search grounding.

  **Trigger when user asks to:**
  - Set up or modify vector search, embeddings, or knowledge base
  - Ingest documents into knowledge_chunks
  - Debug search quality or missing results
  - Tune HNSW parameters or search performance
  - Wire RAG into edge functions or AI chat
  - Use Google Search grounding or URL Context with Gemini

  **This project:** OpenAI text-embedding-3-small (1536 dims), stored in knowledge_chunks, HNSW index,
  search via search_knowledge() and hybrid_search_knowledge() RPCs.
allowed-tools: Bash, Read, Write, Edit
---

# pgvector for StartupAI

## Our Setup (Live DB — audited 2026-03-19)

| Component | Value |
|-----------|-------|
| Extension | pgvector 0.8.0 |
| Embedding model | OpenAI text-embedding-3-small |
| Dimensions | 1536 |
| Table | `knowledge_chunks` |
| Index | HNSW (m=16, ef_construction=64, vector_cosine_ops) |
| FTS | GIN index on `fts` tsvector column |
| Total chunks | 3,973 (3,865 with embeddings) |
| Documents | 89 (all with content_hash dedup) |
| Search RPCs | `search_knowledge` + `hybrid_search_knowledge` |
| RLS | Authenticated SELECT; service_role writes |

### Industry Distribution (problem: 78% AI/ML)

| Industry | Chunks | With Embedding |
|----------|-------:|:-:|
| ai_ml | 3,106 | 3,102 |
| fashion | 508 | 508 |
| retail | 219 | 219 |
| GTM | 22 | 22 |
| saas | 36 | 0 |
| 7 others | 1-2 each | 0 |

**Gap:** 16 of 19 industries have <3 chunks. healthtech, fintech, ecommerce, education, legal, manufacturing, etc. are essentially empty.

### Empty Tables

- `industry_playbooks` — 0 rows (edge functions query this and get nothing)
- `prompt_packs` — 0 rows (prompt-pack edge function queries this)

---

## Schema

```sql
-- knowledge_chunks (main vector table)
CREATE TABLE knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL CHECK (length(content) >= 20),
  embedding vector(1536),
  source TEXT,
  source_type TEXT,
  year INT,
  confidence TEXT,           -- high/medium/low
  category TEXT,
  industry TEXT,
  document_id UUID REFERENCES knowledge_documents(id),
  page_start INT,
  page_end INT,
  section_title TEXT,
  chunk_kind TEXT,           -- text/table
  chunk_index INT,
  source_path TEXT,
  tags TEXT[],
  fts TSVECTOR,              -- auto-maintained via trigger
  fetch_count INT DEFAULT 0,
  last_fetched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- knowledge_documents (source tracking)
CREATE TABLE knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source_type TEXT,
  year INT,
  llama_parse_id TEXT,       -- LlamaCloud job ID for PDFs
  content_hash TEXT NOT NULL, -- SHA-256 dedup
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Indexes (12 total)

```sql
-- Vector search (HNSW)
CREATE INDEX knowledge_chunks_embedding_idx
  ON knowledge_chunks USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Full-text search
CREATE INDEX idx_knowledge_chunks_fts ON knowledge_chunks USING gin (fts);

-- Dedup (prevents re-embedding same content)
CREATE UNIQUE INDEX idx_knowledge_chunks_doc_content_hash
  ON knowledge_chunks (document_id, md5(content))
  WHERE document_id IS NOT NULL;

-- Filter indexes
CREATE INDEX idx_knowledge_chunks_category ON knowledge_chunks (category);
CREATE INDEX idx_knowledge_chunks_industry ON knowledge_chunks (industry) WHERE industry IS NOT NULL;
CREATE INDEX idx_knowledge_chunks_source_type ON knowledge_chunks (source_type);
CREATE INDEX idx_knowledge_chunks_year ON knowledge_chunks (year DESC);
CREATE INDEX idx_knowledge_chunks_category_year ON knowledge_chunks (category, year DESC);
CREATE INDEX idx_knowledge_chunks_tags ON knowledge_chunks USING gin (tags);
CREATE INDEX idx_knowledge_chunks_document_id ON knowledge_chunks (document_id) WHERE document_id IS NOT NULL;
```

---

## Search Functions

### search_knowledge (semantic only)

```sql
search_knowledge(
  query_embedding vector,
  match_threshold float DEFAULT 0.75,
  match_count int DEFAULT 5,
  filter_category text DEFAULT NULL,
  filter_industry text DEFAULT NULL
) RETURNS TABLE(id, content, source, source_type, year, confidence, category, tags, similarity)
```

### hybrid_search_knowledge (semantic + keyword with RRF)

```sql
hybrid_search_knowledge(
  query_embedding vector,
  query_text text,
  match_threshold float DEFAULT 0.75,
  match_count int DEFAULT 10,
  filter_category text DEFAULT NULL,
  filter_industry text DEFAULT NULL,
  rrf_k int DEFAULT 50
) RETURNS TABLE(id, content, source, source_type, year, confidence, category, tags, similarity,
                document_id, document_title, section_title, page_start, page_end)
```

**How RRF works:** Runs vector search (top 20) and FTS search (top 20) independently, then combines ranks using `1/(k+rank)` formula. Captures both semantic meaning and exact keyword matches.

### Calling from Edge Functions

```typescript
// Via service-role client (bypasses RLS for pipeline callers)
const { data } = await supabaseAdmin.rpc('hybrid_search_knowledge', {
  query_embedding: embedding,
  query_text: userQuery,
  match_threshold: 0.5,
  match_count: 10,
  filter_industry: 'healthcare',
});
```

---

## Embedding Generation

**File:** `supabase/functions/_shared/openai-embeddings.ts`

```typescript
// Single embedding
const result = await generateEmbedding(text);
// result.embedding = number[1536]

// Batch (20 at a time, 500ms throttle)
const results = await generateEmbeddings(texts);
```

**Known issue:** No `Promise.race` timeout — OpenAI calls can hang. Add 15s timeout wrapper.

---

## RAG Integration Points

### Where RAG is wired today

| Feature | File | How |
|---------|------|-----|
| AI Chat (coaching modes) | `ai-chat/rag.ts` | `getRAGContext()` → injects top-5 chunks into Gemini system prompt |
| Canvas Coach | `lean-canvas-agent/actions/coach.ts` | `searchCoachingContext()` → service-role RPC → citations as badges |

### Where RAG should be wired (not yet done)

| Feature | Integration point | Expected impact |
|---------|------------------|----------------|
| Validator Composer | `validator-start/agents/composer.ts` Group D | Cite benchmarks in executive summary |
| Sprint Agent | `sprint-agent/index.ts` | Industry-specific task prioritization |
| Pitch Deck Generation | `pitch-deck-agent/actions/generation.ts` | Market data in slides |
| Investor Agent | `investor-agent/index.ts` | Stage-specific fundraising benchmarks |

### RAG failure pattern (graceful degradation)

```typescript
try {
  const context = await getRAGContext(supabase, query, filterIndustry);
  // Inject into system prompt if non-empty
} catch (e) {
  console.warn("[RAG] Failed:", e);
  return ""; // Fail open — chat continues without RAG
}
```

---

## Web Search (Not pgvector — Gemini API features)

For live web data, use Gemini's built-in search instead of vectorizing URLs.

### Google Search Grounding

```typescript
const result = await callGeminiChat(model, systemPrompt, messages, {
  useSearch: true, // Gemini searches Google in real-time
  timeoutMs: 45_000,
});
// Citations in result.citations (extracted from groundingMetadata)
```

**Where used:** Validator Research Agent, Competitors Agent, AI Chat research mode.

### URL Context (read a specific webpage)

```typescript
const result = await callGemini(model, systemPrompt, userPrompt, {
  useUrlContext: true, // Gemini fetches and reads the URL
});
```

**Where used:** profile-import, Research Agent (reads competitor URLs).

### When to use which

| Content Type | Method | Why |
|-------------|--------|-----|
| Our curated benchmarks/playbooks | **pgvector** | Static, authoritative, fast |
| Market trends, news, competitor data | **Google Search** | Always fresh |
| Specific website content | **URL Context** | Reads actual page |
| PDF reports we've ingested | **pgvector** | Already chunked + embedded |
| External research links (research/links/) | **Google Search / URL Context** | Live reads get latest data |

---

## Ingestion Pipeline

### Scripts

```bash
# Batch ingest all markdown docs
node scripts/ingest-industry-docs-batch.mjs

# Single directory ingest
node scripts/ingest-markdown-knowledge.mjs --dir=research/<path> --industry=<tag>

# Verify vectors after ingest
node scripts/verify-vector-rag.mjs
```

### Edge Function: knowledge-ingest

**Auth:** X-Internal-Token header (not JWT — used by scripts)
**Actions:** `ingest`, `ingest_from_llamacloud`, `generate_embeddings`, `status`, `test_search`

**Chunking strategy:**
- Heading-based segmentation (## and ### level)
- Table extraction (entire tables as single chunks, 3600-char max)
- Narrative text: 3600-char chunks, 200-char overlap
- SHA-256 content-hash dedup (unique index prevents re-embedding)

---

## HNSW Tuning Guide

### Parameters

| Parameter | Our Value | Range | Effect |
|-----------|----------|-------|--------|
| `m` | 16 | 12-48 | Higher = better recall, more memory |
| `ef_construction` | 64 | 64-256 | Higher = better graph quality, slower builds |
| `ef_search` | 40 (default) | 40-400 | Higher = better recall, slower queries |

### When to change

- **Poor recall (missing relevant results):** Increase `ef_search` first (cheapest). Then increase `m` + `ef_construction` (requires reindex).
- **High latency:** Decrease `ef_search`. Check if index fits in memory (`pg_size_pretty`).
- **Filtered search returns too few results:** Enable iterative scan:
  ```sql
  SET hnsw.iterative_scan = relaxed_order;
  SET hnsw.max_scan_tuples = 50000;
  ```

### Performance at our scale (3,973 chunks, 1536-dim)

At this data volume, HNSW is massive overkill — queries are <50ms. Tuning only matters at 100K+ vectors. Current config is fine.

### Monitoring

```sql
-- Index size
SELECT pg_size_pretty(pg_relation_size('knowledge_chunks_embedding_idx'));

-- Query plan (verify index is used)
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, content FROM knowledge_chunks
ORDER BY embedding <=> $1::vector(1536) LIMIT 10;

-- Check for chunks without embeddings
SELECT count(*) FROM knowledge_chunks WHERE embedding IS NULL;
```

---

## Common Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| Search returns AI/ML data for non-AI founders | 78% of chunks are ai_ml | Ingest more industry-specific content |
| `industry_playbooks` queries return empty | 0 rows in table | Seed 19 industry playbooks |
| `prompt_packs` queries return empty | 0 rows in table | Seed prompt pack definitions |
| 108 chunks missing embeddings | saas + null-industry chunks | Run `generate_embeddings` action |
| Hybrid search not finding keyword matches | FTS query syntax edge cases | Use `websearch_to_tsquery` (handles phrases, AND/OR) |
| Search quality low for non-English content | text-embedding-3-small optimized for English | Consider multilingual model if needed |

---

## Priority Improvements

**P0 — Fill empty industries:**
- Ingest `research/services/02-12*.md` (11 industry guides)
- Ingest `research/sports/reports/*.md` (5 synthesis reports)
- Seed `industry_playbooks` table (19 rows)

**P1 — Wire RAG into more features:**
- Add `getRAGContext()` to Validator Composer (Group D)
- Add `getRAGContext()` to Sprint Agent
- Add `Promise.race(15s)` to `openai-embeddings.ts`

**P2 — Expand knowledge base:**
- Ingest remaining PDFs via LlamaCloud
- Generate embeddings for 108 missing chunks
- Seed `prompt_packs` table

---

**Docs:** https://supabase.com/docs/guides/ai
**Version:** 2.0.0
**Last Updated:** 2026-03-19
