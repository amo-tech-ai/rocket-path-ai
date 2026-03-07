# 09 — Vector Storage Flow (Chat & Validator)

> How chat UI, chat EF, and validator pipeline consume the knowledge base (pgvector).
> Audited 2026-03-08 against actual code.

```mermaid
flowchart LR
    subgraph CONSUMERS["Consumers"]
        C1["Chat UI<br/>useKnowledgeSearch"]
        C2["Chat EF<br/>ai-chat action=search"]
        C3["Chat EF<br/>ai-chat/rag.ts"]
        C4["Validator<br/>ResearchAgent"]
        C5["Validator<br/>CompetitorAgent"]
        C6["Canvas Coach<br/>lean-canvas-agent"]
    end

    subgraph SEARCH_PATH["Search Path"]
        EF["knowledge-search<br/>Edge Function"]
        RPC_H["hybrid_search_knowledge<br/>RPC (pgvector + FTS)"]
        RPC_S["search_knowledge<br/>RPC (pgvector only)"]
        EMB["OpenAI<br/>text-embedding-3-small"]
    end

    subgraph DB["Supabase DB"]
        KC["knowledge_chunks<br/>4,251 rows"]
        KD["knowledge_documents<br/>parent docs"]
    end

    %% Chat UI → EF → RPC
    C1 -->|"invoke hybrid:true"| EF
    EF -->|"embedding"| EMB
    EF -->|"hybrid=true"| RPC_H
    EF -->|"hybrid=false"| RPC_S

    %% Chat EF → direct RPC
    C2 -->|"direct RPC"| RPC_S
    C2 -->|"embedding"| EMB
    C3 -->|"direct RPC"| RPC_S
    C3 -->|"embedding"| EMB

    %% Validator → direct RPC (Option B fix)
    C4 -->|"direct RPC"| RPC_H
    C4 -->|"embedding"| EMB
    C5 -->|"direct RPC"| RPC_H
    C5 -->|"embedding"| EMB

    %% Canvas Coach
    C6 -->|"direct RPC"| RPC_S
    C6 -->|"embedding"| EMB

    %% RPC → DB
    RPC_H --> KC
    RPC_S --> KC
    KC -.->|"FK"| KD

    style CONSUMERS fill:#dbeafe
    style SEARCH_PATH fill:#dcfce7
    style DB fill:#fce7f3
```

## Auth Matrix

| Consumer | Auth Method | Hybrid? | Status |
|----------|-----------|---------|--------|
| Chat UI (`useKnowledgeSearch`) | User JWT via EF | Yes (after fix) | Working |
| Chat EF (`ai-chat` search action) | User JWT → direct RPC | No (semantic only) | Working |
| Chat EF (`rag.ts`) | Service role → direct RPC | No | Working |
| Validator Research | Admin client → direct RPC | **Yes** (after fix) | **Fixed** |
| Validator Competitors | Admin client → direct RPC | **Yes** (after fix) | **Fixed** |
| Canvas Coach | Service role → direct RPC | No | Working |

## What Changed (2026-03-08)

| Before | After | Impact |
|--------|-------|--------|
| Validator called `knowledge-search` EF with Bearer service-role key | Validator calls `hybrid_search_knowledge` RPC directly via admin client | No 401, no HTTP round-trip, hybrid search |
| Chat UI used semantic-only search | Chat UI sends `hybrid: true` to EF | Better recall (semantic + full-text) |
| `KnowledgeSearchResult` type had no citation fields | Added `documentId`, `documentTitle`, `sectionTitle`, `pageStart`, `pageEnd` | UI can show citation sources |

## Remaining Gaps

| # | Gap | Severity | Next Step |
|---|-----|----------|-----------|
| 1 | `ai-chat/rag.ts` uses `search_knowledge` (semantic only) | Low | Switch to `hybrid_search_knowledge` for better recall |
| 2 | Chat UI has no circuit breaker for failed searches | Medium | Add retry/skip logic in `useKnowledgeSearch` |
| 3 | `ai-chat` search action uses `search_knowledge` (semantic only) | Low | Switch to hybrid when ready |
