# Validator Knowledge Plans: Current vs Trend Intelligence vs Quilt

> **Created:** 2026-02-06 | **Purpose:** Compare current validator knowledge plan (Prompt 04) with Trend Intelligence (01 + Prompt 12) and Quilt adaptation (03). Decide which is better and why.

---

## Summary Table

| Dimension | Current plan (04) | Trend Intelligence (01 + 12) | Quilt adaptation (03) |
|-----------|-------------------|------------------------------|------------------------|
| **Source** | `tasks/validator/prompts/04-knowledge-integration.md` | `tasks/plan/01-trend-intelligence.md` + `12-trend-intelligence-engine.md` | `tasks/plan/03-quilt-startupai.md` |
| **Schema** | 1 table: `knowledge_chunks` (existing) | 4 tables: `source_catalog`, `source_chunks`, `source_facts`, `source_embeddings` | Same as Trend Intelligence (03 builds on 01) |
| **Content model** | Raw chunks (300–500 tokens) from URLs | Chunks + **extracted facts** (statistic, quote, prediction, benchmark) | Same; adds framework + persona/positioning in report |
| **Ingestion** | One-time/batch seed 500+ URLs → chunk → embed | Catalog per source → ingest → chunk → **extract facts** → embed; re-ingest/stale handling | Same as Trend Intelligence |
| **Search** | Semantic search over chunks (1536D) | Semantic search over chunks (768D) + fact-level retrieval + confidence | Same; agents get facts + citations |
| **Citations** | Metadata (source, type, year); no per-fact confidence | **Source + confidence per fact**; report cites e.g. “McKinsey 2026 (0.95)” | Same; “slide-ready” report with citations |
| **Pipeline fit** | ResearchAgent / CompetitorAgent query RAG before Google | KnowledgeSearcher (verified facts) → then Google Search | Framework Mapper → Knowledge Weaver → Trend Spotter → Synthesizer (named sequence) |
| **Current DB state** | `knowledge_chunks` exists, 1536D, seeded manually; **no agent uses it yet** | Not built (0%) | Not built; depends on 01 |

---

## Current Plan (04) — What We Have and What’s Planned

**Implemented:**
- `knowledge_chunks` table (content, embedding 1536D, source, source_type, year, sample_size, confidence, category, industry, tags)
- RLS, indexes, `search_knowledge`-style search
- Seed data (manual INSERTs); `load-knowledge` edge function for embeddings

**Planned (04):**
- Seed 500+ URLs: fetch → extract text → chunk (300–500 tokens) → embed → store in `knowledge_chunks`
- Wire ResearchAgent and CompetitorAgent to query `knowledge_chunks` **before** Google Search
- Ongoing: “research link embedding pipeline” to add new URLs over time

**Strengths:** One table, simpler. Reuses existing table. Can ship “RAG before Google” faster if we only do chunking (no fact extraction).

**Weaknesses:** No source catalog (no URL-level status, no re-ingest by source). No structured **facts** — agents see raw chunks, so citations are “from a chunk” not “this specific statistic (0.95 confidence).” No freshness per source. 500+ URLs is a lot to process once; no clear “which sources are stale.”

---

## Trend Intelligence (01 + 12) — Full Design

**Designed:**
- **source_catalog:** URL, title, industry, authority_score, last_ingested_at, status (pending/ready/stale/failed)
- **source_chunks:** chunk text, token count, link to source
- **source_facts:** extracted fact text, fact_type, confidence, industry, year — the “gold” layer
- **source_embeddings:** 768D vectors (Gemini) on chunks for semantic search

**Flow:** Ingest → chunk → **FactExtractor (Claude)** → embed. Search returns chunks + facts with source and confidence. ResearchAgent/CompetitorAgent get verified facts first, then Google.

**Strengths:** Investor-grade citations (named source + confidence). Stale/source management. Fact-level retrieval (e.g. “TAM $4.9B, McKinsey 2026, 0.95”). Aligns with “verified first, live second” like Quilt. One ingestion pipeline (e.g. 75 URLs from curated-links) then scale.

**Weaknesses:** Bigger build (4 tables, 3 edge functions, FactExtractor + EmbeddingAgent). More moving parts. 01 scored 75/100 (Grade B) — “plan for upcoming cycle” after Adaptive Thinking.

---

## Quilt Adaptation (03) — Productization on Top of 01

03 does **not** replace 01. It defines:
- **Named pipeline:** Framework Mapper → Knowledge Weaver → Persona/Positioner → Trend Spotter → Synthesizer
- **Framework first:** Set validation axes before heavy research (can use Adaptive Thinking)
- **Persona/positioning:** “Who is this for?” + optional 2×2 in report
- **One report:** Slide-ready, with citations
- **Metrics:** Time to report, citation quality, etc.

So: **03 = how we expose and run the validator once 01 (and ideally 02) exist.** It doesn’t change the data model; it changes naming, order, and report shape.

---

## Side-by-Side: Current (04) vs Trend Intelligence (01+12)

| Criteria | Current (04) | Trend Intelligence (01+12) | Winner |
|----------|--------------|----------------------------|--------|
| **Citation quality** | Chunk + metadata; no per-fact confidence | Per-fact source + confidence; “McKinsey 2026 (0.95)” | **01+12** |
| **Source lifecycle** | No catalog; URLs processed in bulk | Catalog with status, last_ingested, stale detection, re-ingest | **01+12** |
| **Retrieval granularity** | Chunk-level only | Chunk + fact-level; agents can use “this statistic” not “this paragraph” | **01+12** |
| **Time to first value** | Potentially faster (1 table, wire RAG to agents) | Slower (4 tables, ingestion + fact extraction) | **04** |
| **Implementation risk** | Lower (extend existing table + pipeline) | Higher (new schema, new agents, PDF/URL parsing) | **04** |
| **Report credibility** | “Based on curated research” | “Based on [McKinsey 2026] (confidence 0.95)” | **01+12** |
| **Maintenance** | Re-seed or ad-hoc pipeline; no per-source state | Per-source status, refresh, drop low-value sources | **01+12** |
| **Alignment with Quilt** | RAG + Search only | RAG (verified) + Search (live) + structured facts = Quilt-style | **01+12** |

---

## Which Is Better, and Why

**For report quality and long-term product: Trend Intelligence (01 + 12) is better.**

Reasons:
1. **Citations and trust** — Founders and investors want “McKinsey 2026, p.12” and a confidence score, not “from our knowledge base.” 01+12 gives that; 04 stays at chunk-level.
2. **Source management** — Knowing which reports are ingested, which are stale, and which to re-run is essential as the library grows. 04 has no catalog; 01 has source_catalog and status.
3. **Fact-level retrieval** — Agents can pull “TAM $4.9B, 36% CAGR” as a fact instead of a long chunk. Better for scoring and for report wording.
4. **Quilt alignment** — Our Quilt adaptation (03) assumes a “Knowledge Weaver” that provides structured, verified data and a “Trend Spotter” that adds live search. That’s 01+12, not 04. So choosing 01+12 keeps the path to 03 open without redoing the data layer.

**When current (04) might still be useful:**
- **Short-term bridge:** If we need “RAG before Google” in the next 2–3 weeks, we could wire 04’s `knowledge_chunks` to ResearchAgent/CompetitorAgent and seed a subset of URLs with a simple chunk-only pipeline. Then replace with 01+12 when ready.
- **Lower risk / lower scope:** If we want to avoid FactExtractor and 4 tables for now, 04 is simpler — but we give up per-fact citations and source lifecycle.

**Recommendation:** Treat **Trend Intelligence (01 + 12) as the target**. If we need something sooner, do a **minimal 04-style bridge** (wire existing `knowledge_chunks` to agents, seed a small set of high-value URLs with chunk-only ingestion) and document it as temporary until 01+12 is in place. Do **not** invest in a full 500+ URL pipeline on 04’s single-table design; that would duplicate effort and then require a migration to 01’s schema.

---

## Quilt (03) vs “Current Plan”

03 is not an alternative to 04 or 01. It’s the **product and pipeline layer**:
- 04 = “add RAG with one table and chunks.”
- 01+12 = “add RAG with catalog, facts, and citations.”
- 03 = “name the pipeline, add framework first, persona/positioning, one slide-ready report.”

So:
- **03 vs 04:** 03 assumes a strong knowledge layer (verified facts, citations). 04’s chunk-only model doesn’t give 03 what it needs for “Synthesizer & Reporter” with investor-grade citations. So **03 is not a good fit on top of 04 alone.**
- **03 vs 01+12:** 03 is the right next step **on top of** 01+12. It defines how we present and run the pipeline (framework → weaver → trend spotter → synthesizer) and how the report looks (slide-ready, cited).

**Conclusion:** 01+12 is better than 04 for the validator’s knowledge layer. 03 is better as the productization of 01+12 (and 02), not of 04.

---

## One-Line Summary

> **Trend Intelligence (01+12) is better than the current plan (04)** because it gives per-fact citations with confidence, source catalog and refresh, and fact-level retrieval — which the Quilt adaptation (03) and investor-ready reports need; 04 can be used only as a short-term bridge (wire existing knowledge_chunks, minimal seed) until 01+12 is built.
