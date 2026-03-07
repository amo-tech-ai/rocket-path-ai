# pg-vector skills — Which to use

> **This project uses OpenAI for embeddings.** Embeddings are generated with **OpenAI text-embedding-3-small** (1536 dimensions) in Supabase Edge Functions (`knowledge-ingest`, `_shared/openai-embeddings.ts`) and stored in `knowledge_chunks` (pgvector in Postgres).

---

## Skills in this folder

| Skill | Use when | Notes |
|-------|----------|--------|
| **pgvector-setup** | Setting up pgvector, RAG, or vector search in Supabase; creating tables/indexes; hybrid search | **Primary.** Supabase-focused, includes OpenAI dimensions (1536/3072), scripts, templates. Matches our flow. |
| **pgvector-semantic-search** | Tuning HNSW, recall, filtered search, halfvec/binary quantization, performance | **Secondary.** Use for optimization and troubleshooting. We currently use `vector(1536)`; halfvec is optional later. |
| **pgvector** | Low-level pgvector API reference (multi-language examples) | **Reference only.** Generic docs; not Supabase/OpenAI-specific. Use when you need operator/index API details. |

---

## Our stack (quick reference)

| Item | Value |
|------|--------|
| **Embedding model** | OpenAI `text-embedding-3-small` |
| **Dimensions** | 1536 |
| **Where embeddings are created** | Edge Functions: `knowledge-ingest`, `ai-chat/rag.ts`; shared: `_shared/openai-embeddings.ts` |
| **Table** | `knowledge_chunks` (vector column: `embedding vector(1536)`) |
| **Index** | HNSW, `vector_cosine_ops`, m=16, ef_construction=64 |
| **Search** | `search_knowledge()` RPC; Edge Function `knowledge-search` |
| **Distance** | Cosine (`<=>`); similarity = 1 - distance |

Use **pgvector-setup** for any new vector tables or hybrid search (e.g. 014/015). Use **pgvector-semantic-search** when tuning recall, memory, or filtered queries.
