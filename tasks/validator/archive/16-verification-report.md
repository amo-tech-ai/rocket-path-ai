# Verification Report — Plans vs Official Docs

> **Date:** 2026-02-06 | **Verified by:** Claude Opus 4.6
> **Plans checked:** `02-adaptive-thinking.md`, `01-trend-intelligence.md`, `16-trend-intelligence-engine.md`
> **Docs checked:** Claude adaptive thinking, Gemini skill (G1-G6), Supabase pgvector best practices

---

## Verification Summary

| Plan | Issues Found | Critical | Warnings | Correct |
|------|:----------:|:--------:|:--------:|:-------:|
| **02-adaptive-thinking.md** | 0 | 0 | 0 | 10/10 |
| **01-trend-intelligence.md** | 4 | 1 | 3 | 8/12 |
| **16-trend-intelligence-engine.md** | 4 | 1 | 3 | 8/12 |
| **Current code** (gemini.ts, research.ts, competitors.ts) | 0 | 0 | 0 | 5/5 |

---

## Plan 1: Adaptive Thinking (02-adaptive-thinking.md) — ALL CORRECT

| # | Claim in Plan | Official Doc Says | Verdict |
|---|---------------|-------------------|:-------:|
| 1 | Model: `claude-opus-4-6` | Adaptive thinking supported on `claude-opus-4-6` | CORRECT |
| 2 | `thinking: { type: "adaptive" }` | Set `thinking.type` to `"adaptive"` | CORRECT |
| 3 | `output_config: { effort: "low\|medium\|high\|max" }` | Effort levels: `low`, `medium`, `high` (default), `max` (Opus 4.6 only) | CORRECT |
| 4 | No beta header required | "No beta header is required" | CORRECT |
| 5 | `budget_tokens` deprecated on Opus 4.6 | "`budget_tokens` are deprecated on Opus 4.6 and will be removed" | CORRECT |
| 6 | Interleaved thinking auto-enabled | "Automatically enables interleaved thinking" | CORRECT |
| 7 | Prompt cache preserved in adaptive mode | "Consecutive requests using adaptive preserve cache breakpoints" | CORRECT |
| 8 | Streaming via `thinking_delta` events | "Thinking blocks are streamed via thinking_delta events" | CORRECT |
| 9 | `max_tokens` = hard cap on thinking + response | "Use max_tokens as a hard limit on total output (thinking + response text)" | CORRECT |
| 10 | Older models need `type: "enabled"` + `budget_tokens` | "Older models require thinking.type: enabled with budget_tokens" | CORRECT |

**Result: 10/10 correct. No changes needed.**

---

## Plan 2: Trend Intelligence (01-trend-intelligence.md) — 4 ISSUES

### CRITICAL: Use HNSW index, not IVFFlat

| # | Claim in Plan | Official Doc Says | Verdict |
|---|---------------|-------------------|:-------:|
| C1 | `source_embeddings` index type: `ivfflat (cosine)` | **HNSW is recommended default.** IVFFlat only for special cases. HNSW has "better performance and robustness against changing data" | **WRONG** |

**Fix needed in `01-trend-intelligence.md`:**
```
WRONG:  idx_embeddings_vector | embedding | ivfflat (cosine)
RIGHT:  idx_embeddings_vector | embedding | hnsw (vector_cosine_ops)
```

### WARNING: Extension schema should be `extensions`

| # | Claim in Plan | Official Doc Says | Verdict |
|---|---------------|-------------------|:-------:|
| W1 | `embedding vector(768)` | Supabase best practice: `create extension vector with schema extensions;` then use `extensions.vector(768)` | **WARNING** |

**Fix:** Use `extensions.vector(768)` in column definitions, not bare `vector(768)`.

### WARNING: Missing FK indexes

| # | Claim in Plan | Official Doc Says | Verdict |
|---|---------------|-------------------|:-------:|
| W2 | Plan lists indexes but no FK indexes for `source_id`, `chunk_id` columns | "Postgres does NOT automatically index foreign key columns" — missing indexes cause 10-100x slower JOINs and CASCADE deletes | **WARNING** |

**Fix:** Add these indexes to the plan:
```
source_chunks.source_id → btree index
source_facts.chunk_id → btree index
source_facts.source_id → btree index
source_embeddings.chunk_id → btree index (already UNIQUE, which creates an index)
```

### WARNING: `match_chunks` function should use `language sql stable`

| # | Claim in Plan | Official Doc Says | Verdict |
|---|---------------|-------------------|:-------:|
| W3 | `match_chunks` uses `language plpgsql` | Supabase pattern uses `language sql stable` for pure SQL functions — more efficient, allows query optimization | **WARNING** |

### Correct items

| # | Claim | Verdict |
|---|-------|:-------:|
| 1 | pgvector for semantic search | CORRECT |
| 2 | `vector(768)` for Gemini text-embedding-004 | CORRECT |
| 3 | Cosine distance `<=>` operator | CORRECT |
| 4 | `1 - (embedding <=> query_embedding)` for similarity | CORRECT |
| 5 | ON DELETE CASCADE for FK relationships | CORRECT |
| 6 | Similarity threshold of 0.8 default | CORRECT (reasonable) |
| 7 | Claude Sonnet 4.5 for fact extraction (complex reasoning) | CORRECT |
| 8 | Gemini Flash for chunking (speed) | CORRECT |

---

## Prompt 16: Trend Intelligence Engine (16-trend-intelligence-engine.md) — 4 ISSUES

Same issues as Plan 2 (they share the schema definition):

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| C1 | IVFFlat index → should be HNSW | CRITICAL | Change to `hnsw (vector_cosine_ops)` |
| W1 | Bare `vector(768)` → should be `extensions.vector(768)` | WARNING | Prefix with `extensions.` |
| W2 | Missing FK indexes on `source_id`, `chunk_id` | WARNING | Add btree indexes |
| W3 | `match_chunks` uses plpgsql → should be sql stable | WARNING | Change language |

### Corrected `match_chunks` function:

```sql
CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding extensions.vector(768),
  match_threshold float DEFAULT 0.8,
  match_count int DEFAULT 5,
  filter_industry text DEFAULT NULL
)
RETURNS TABLE (
  chunk_id uuid,
  source_id uuid,
  content text,
  similarity float,
  source_title text,
  authority_score int
)
LANGUAGE sql STABLE
AS $$
  SELECT
    se.chunk_id,
    sc.source_id,
    sc.content,
    1 - (se.embedding <=> query_embedding) AS similarity,
    cat.title AS source_title,
    cat.authority_score
  FROM source_embeddings se
  JOIN source_chunks sc ON sc.id = se.chunk_id
  JOIN source_catalog cat ON cat.id = sc.source_id
  WHERE 1 - (se.embedding <=> query_embedding) > match_threshold
    AND (filter_industry IS NULL OR cat.industry = filter_industry)
    AND cat.status = 'ready'
  ORDER BY (se.embedding <=> query_embedding) ASC
  LIMIT match_count;
$$;
```

### Corrected index section:

```
| source_embeddings | idx_embeddings_vector | embedding | hnsw (vector_cosine_ops) |
| source_chunks     | idx_chunks_source_id  | source_id | btree |
| source_facts      | idx_facts_chunk_id    | chunk_id  | btree |
| source_facts      | idx_facts_source_id   | source_id | btree |
```

---

## Current Code Verification (deployed edge functions)

### gemini.ts — ALL CORRECT

| # | Code Pattern | Official Doc Rule | Verdict |
|---|-------------|-------------------|:-------:|
| 1 | `'x-goog-api-key': GEMINI_API_KEY` in headers | G4: API key in header, not query param | CORRECT |
| 2 | `temperature: 1.0` | G2: Keep temperature at 1.0 for Gemini 3 | CORRECT |
| 3 | `responseMimeType: 'application/json'` + `responseJsonSchema` | G1: Both required for guaranteed JSON | CORRECT |
| 4 | `tools: [{ googleSearch: {} }]` | G3+G6: camelCase accepted, works with schema | CORRECT |
| 5 | Extracts `groundingChunks` → `{ url, title }` | G5: Extract citations from groundingChunks | CORRECT |

### research.ts + competitors.ts — ALL CORRECT

| # | Pattern | Verdict |
|---|---------|:-------:|
| 1 | Uses `getCuratedLinks()` for industry-specific URLs | CORRECT |
| 2 | Formats links into system prompt as "Preferred Sources" | CORRECT |
| 3 | Passes `useSearch: true` for Google Search grounding | CORRECT |
| 4 | Uses `responseJsonSchema` for typed output | CORRECT |
| 5 | Handles `searchGrounding` flag for result quality | CORRECT |

---

## Gemini Skill Audit Rules (G1-G6) — Compliance Check

| Rule | Description | Code Status | Plan Status |
|------|-------------|:-----------:|:-----------:|
| G1 | Always use `responseJsonSchema` + `responseMimeType` | COMPLIANT | COMPLIANT |
| G2 | Temperature at 1.0 for Gemini 3 | COMPLIANT | COMPLIANT |
| G3 | Combine `responseJsonSchema` + `googleSearch` | COMPLIANT | COMPLIANT |
| G4 | API key in `x-goog-api-key` header | COMPLIANT | COMPLIANT |
| G5 | Extract `groundingChunks` citations | COMPLIANT | COMPLIANT |
| G6 | camelCase for tool names | COMPLIANT | COMPLIANT |

---

## Action Items

| Priority | Action | File to Update |
|----------|--------|----------------|
| **CRITICAL** | Change vector index from IVFFlat to HNSW | `01-trend-intelligence.md`, `16-trend-intelligence-engine.md` |
| WARNING | Use `extensions.vector(768)` not bare `vector(768)` | Both plan files |
| WARNING | Add FK indexes on `source_id`, `chunk_id` columns | Both plan files |
| WARNING | Change `match_chunks` from plpgsql to sql stable | `16-trend-intelligence-engine.md` |
| NONE | Adaptive Thinking plan — no changes needed | — |
| NONE | Current deployed code — no changes needed | — |
