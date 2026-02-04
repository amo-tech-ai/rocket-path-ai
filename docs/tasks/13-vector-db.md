# 105 - Vector DB Setup

> Load 200+ Tier A statistics into pgvector for RAG-powered Coach answers

---

| Aspect | Details |
|--------|---------|
| **Screens** | — (Backend infrastructure) |
| **Features** | Vector storage, embedding pipeline, semantic search |
| **Agents** | — |
| **Edge Functions** | /ai-chat (query), /load-knowledge (admin) |
| **Use Cases** | Coach answers with citations, confidence levels |
| **Real-World** | "Coach says 'B2B SaaS churn benchmark is <5% monthly (Source: Deloitte 2026)'" |

---

```yaml
---
task_id: 105-VDB
title: Vector DB Setup
diagram_ref: D-11
phase: MVP
priority: P0
status: Not Started
skill: /supabase
ai_model: text-embedding-3-small
embedding_dimensions: 1536
subagents: [supabase-expert, code-reviewer]
edge_function: ai-chat
schema_tables: [knowledge_chunks]
depends_on: [101-coach-tables]
---
```

---

## Data summary

**Consolidated:** [tasks/docs/data/data-summary.md](../docs/data/data-summary.md) (CORE + Coach + Vector).

| Table / object | Description | Key columns / notes |
|----------------|-------------|----------------------|
| knowledge_chunks | Tier A stats with embeddings for semantic search | content, embedding vector(768), source, source_type, year, confidence, category, tags |
| search_knowledge() | SQL function: semantic search by query embedding | query_embedding, match_threshold, match_count → id, content, source, similarity |

---

## Description

Set up pgvector extension and create the `knowledge_chunks` table to store embedded statistics from Tier A sources (Deloitte, BCG, PwC, McKinsey, CB Insights, Gartner). Build an embedding pipeline to process and store 200+ verified statistics with metadata for citation.

## Rationale

**Problem:** Coach answers lack credibility without sources.
**Solution:** RAG retrieval from verified industry statistics.
**Impact:** Every Coach answer includes citations and confidence levels.

---

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | get answers with sources | I can trust the advice |
| Founder | see confidence levels | I know how reliable the answer is |
| System | retrieve relevant stats | answers are backed by data |

## Real-World Example

> Founder asks: "What's a good churn rate for B2B SaaS?"
> Coach searches knowledge_chunks, finds Deloitte stat.
> Coach responds: "B2B SaaS benchmark is <5% monthly churn.
> **Source:** Deloitte State of AI 2026 (n=3,235) | **Confidence:** High"

---

## Goals

1. **Primary:** Store 200+ Tier A statistics with embeddings
2. **Secondary:** Semantic search returns relevant chunks
3. **Quality:** >0.85 relevance score on test queries

## Acceptance Criteria

- [x] pgvector extension enabled
- [x] knowledge_chunks table created with embedding column (vector(1536))
- [x] 100+ statistics loaded from Tier A sources
- [x] Embedding pipeline generates 1536-dim vectors (OpenAI text-embedding-3-small)
- [x] Semantic search function works (<100ms)
- [x] Metadata includes source, year, sample_size, confidence
- [x] RLS policies allow read for authenticated users
- [x] load-knowledge edge function for batch embedding generation

---

## Schema

### Table: knowledge_chunks

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| content | text | NOT NULL |
| embedding | vector(1536) | NULLABLE (OpenAI text-embedding-3-small) |
| source | text | NOT NULL |
| source_type | text | CHECK IN ('deloitte', 'bcg', 'pwc', 'mckinsey', 'cb_insights', 'gartner') |
| year | integer | NOT NULL |
| sample_size | integer | |
| confidence | text | CHECK IN ('high', 'medium', 'low') |
| category | text | NOT NULL |
| industry | text | |
| tags | text[] | |
| fetch_count | integer | DEFAULT 0 |
| last_fetched_at | timestamptz | |
| created_at | timestamptz | default now() |

### Index

```sql
CREATE INDEX ON knowledge_chunks
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

### RLS Policies

| Policy | Operation | Rule |
|--------|-----------|------|
| select_authenticated | SELECT | auth.role() = 'authenticated' |

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Migration | `supabase/migrations/xxx_knowledge_chunks.sql` | Create |
| Seed | `supabase/seeds/knowledge_stats.sql` | Create |
| Types | `src/types/knowledge.ts` | Create |
| Hook | `src/hooks/useKnowledgeSearch.ts` | Create |
| Edge Function | `supabase/functions/ai-chat/index.ts` | Modify (add RAG) |

---

## Data Sources

| Source | Stats | Sample Size | Year |
|--------|-------|-------------|------|
| Deloitte | 50+ | n=3,235 | 2026 |
| BCG | 40+ | n=2,360 | 2026 |
| PwC | 40+ | n=4,454 | 2026 |
| McKinsey | 30+ | varies | 2025-26 |
| CB Insights | 25+ | varies | 2025-26 |
| Gartner | 15+ | varies | 2025-26 |

---

## Embedding Pipeline

```typescript
// supabase/functions/ai-chat/index.ts - generateOpenAIEmbedding()
async function generateOpenAIEmbedding(text: string): Promise<number[]> {
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
  
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: text.replace(/\n/g, " ").trim(),
      encoding_format: "float",
    }),
  });

  const data = await response.json();
  return data.data[0].embedding; // 1536 dimensions
}
```

---

## Search Function

```sql
CREATE OR REPLACE FUNCTION search_knowledge(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.75,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  content text,
  source text,
  confidence text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    id,
    content,
    source,
    confidence,
    1 - (embedding <=> query_embedding) as similarity
  FROM knowledge_chunks
  WHERE 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
```

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| No relevant chunks found | Return generic answer without citation |
| Multiple relevant chunks | Combine top 3, cite all sources |
| Low confidence match (<0.75) | Add "Note: Limited data available" |
| Embedding API timeout | Use cached embeddings, log error |

---

## Verification

```bash
# Enable extension
supabase db reset

# Verify table
supabase db dump | grep knowledge_chunks

# Test search
curl -X POST $SUPABASE_URL/functions/v1/ai-chat \
  -H "Authorization: Bearer $ANON_KEY" \
  -d '{"action": "search", "query": "SaaS churn benchmark"}'

# Check embedding count
SELECT COUNT(*) FROM knowledge_chunks;
-- Expected: 200+
```

---

## Codebase References

| Pattern | Reference |
|---------|-----------|
| pgvector setup | `supabase/migrations/` |
| Embedding generation | `supabase/functions/_shared/` |
| Search implementation | Existing semantic search patterns |
