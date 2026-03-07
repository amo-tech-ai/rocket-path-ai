---
name: pgvector
description: pgvector - PostgreSQL extension for vector similarity search. Use for embedding storage, cosine similarity, IVFFlat indexes, and HNSW indexes. For this project prefer pgvector-setup (Supabase + OpenAI embeddings) and pgvector-semantic-search (tuning); use this skill for low-level API reference only.
---

# Pgvector Skill

Comprehensive assistance with pgvector development, generated from official documentation.

**This project:** We use **OpenAI text-embedding-3-small** (1536) in Supabase. For setup and RAG flows use **pgvector-setup**; for tuning use **pgvector-semantic-search**. This skill is for pgvector API/reference details (operators, index options) when the other two don't cover it.

## When to Use This Skill

This skill should be triggered when:
- Working with pgvector
- Asking about pgvector features or APIs
- Implementing pgvector solutions
- Debugging pgvector code
- Learning pgvector best practices

## Quick Reference

### Common Patterns

**SQL — Enable extension (Supabase):**
```sql
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;
-- Set search_path in functions: SET search_path = public, extensions
```

**SQL — Create table with embeddings:**
```sql
CREATE TABLE items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  content TEXT NOT NULL,
  embedding vector(1536) NOT NULL
);
CREATE INDEX ON items USING hnsw (embedding vector_cosine_ops);
```

**SQL — Cosine similarity search:**
```sql
SELECT id, content, 1 - (embedding <=> $1) AS similarity
FROM items
ORDER BY embedding <=> $1
LIMIT 10;
```

**TypeScript (Supabase RPC):**
```typescript
const { data } = await supabase.rpc('match_items', {
  query_embedding: embedding,
  match_threshold: 0.78,
  match_count: 10,
});
```

### Distance Operators

| Operator | Distance | Index Ops |
|----------|----------|-----------|
| `<=>` | Cosine | `vector_cosine_ops` |
| `<->` | Euclidean (L2) | `vector_l2_ops` |
| `<#>` | Inner product | `vector_ip_ops` |

## Reference Files

This skill includes comprehensive documentation in `references/`:

- **pgvector.md** - Pgvector documentation

Use `view` to read specific reference files when detailed information is needed.

## Working with This Skill

### For Beginners
Start with the getting_started or tutorials reference files for foundational concepts.

### For Specific Features
Use the appropriate category reference file (api, guides, etc.) for detailed information.

### For Code Examples
The quick reference section above contains common patterns extracted from the official docs.

## Resources

### references/
Organized documentation extracted from official sources. These files contain:
- Detailed explanations
- Code examples with language annotations
- Links to original documentation
- Table of contents for quick navigation

### scripts/
Add helper scripts here for common automation tasks.

### assets/
Add templates, boilerplate, or example projects here.

## Notes

- This skill was automatically generated from official documentation
- Reference files preserve the structure and examples from source docs
- Code examples include language detection for better syntax highlighting
- Quick reference patterns are extracted from common usage examples in the docs

## Updating

To refresh this skill with updated documentation:
1. Re-run the scraper with the same configuration
2. The skill will be rebuilt with the latest information
