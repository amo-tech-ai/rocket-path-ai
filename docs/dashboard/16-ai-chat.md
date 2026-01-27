# Prompt 16 — AI Chat Module

> **Phase:** Module | **Priority:** P2 | **Overall:** 30%
> **No code — screen specs, data sources, agent workflows only**
> **Reference:** `100-dashboard-system.md` Section 9

---

## Purpose

Industry-aware AI advisor. Context-rich conversations with memory and service routing.

## Goals

- Answer startup questions using industry knowledge packs
- Remember conversation context across sessions
- Route to specific dashboard features when relevant
- Provide benchmarks and competitive intelligence

## Outcomes

Founders have a knowledgeable co-pilot that understands their industry, stage, and history.

---

## Screen 16a: Chat Interface

```
┌─────────────────┬──────────────────────────────────────────────┬─────────────────┐
│  [LEFT NAV]     │                                              │  Context        │
│                 │  AI Chat                                     │                 │
│                 │                                              │  Industry:      │
│                 │  ┌──────────────────────────────────────┐    │  SaaS / B2B     │
│                 │  │                                      │    │                 │
│                 │  │  👤 How does my MRR compare to       │    │  Persona:       │
│                 │  │     other seed-stage SaaS companies? │    │  SaaS Advisor   │
│                 │  │                                      │    │                 │
│                 │  │  🤖 Your $8K MRR is in the 45th     │    │ ─────────────── │
│                 │  │     percentile for seed-stage SaaS. │    │                 │
│                 │  │     Industry average is $12K.       │    │  Quick Actions  │
│                 │  │                                      │    │                 │
│                 │  │     [Source: SaaS Benchmarks 2025]  │    │  [Benchmarks ▸] │
│                 │  │                                      │    │  [Pitch Deck ▸] │
│                 │  │  👤 What should I focus on to       │    │  [Traction   ▸] │
│                 │  │     improve?                         │    │                 │
│                 │  │                                      │    │ ─────────────── │
│                 │  │  🤖 Three priorities for your stage:│    │                 │
│                 │  │     1. Reduce churn below 5%        │    │  History        │
│                 │  │     2. Increase ARPU by 20%         │    │                 │
│                 │  │     3. Reach 50 paying customers    │    │  [Session 1]    │
│                 │  │                                      │    │  [Session 2]    │
│                 │  └──────────────────────────────────────┘    │                 │
│                 │                                              │                 │
│                 │  ┌──────────────────────────────────────┐    │                 │
│                 │  │  Type your question...          ➤   │    │                 │
│                 │  └──────────────────────────────────────┘    │                 │
└─────────────────┴──────────────────────────────────────────────┴─────────────────┘
```

---

## Screen 16b: Chat History

| Section | Content | Data Source |
|---------|---------|-------------|
| Session List | Previous conversations with summaries | `chat_sessions` table |
| Search | Find past conversations by topic | `chatbot-agent` -> `rag_search` |
| Session Detail | Full message thread | `chat_messages` |

---

## Data Sources

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `chat_sessions` | Conversation containers | title, summary, industry, persona |
| `chat_messages` | Individual messages | role, content, sources, suggested_actions |
| `chat_facts` | Extracted knowledge (RAG) | fact_type, content, confidence, embedding |
| `industry_packs` | Industry knowledge bases | benchmarks, terminology, competitive_intel |

---

## Agent Workflows

| Workflow | Trigger | Edge Function | Action | Output |
|----------|---------|---------------|--------|--------|
| Industry Detection | First message | `chatbot-agent` | `detect_industry` | Industry + persona |
| Chat Response | User sends message | `chatbot-agent` | `chat_message` | Response + sources |
| Benchmarks | User asks about metrics | `chatbot-agent` | `get_benchmarks` | Industry data |
| Service Routing | AI detects actionable request | `chatbot-agent` | `route_to_dashboard` | Module link |
| Save Session | Session ends | `chatbot-agent` | `save_conversation` | Persisted + facts |
| RAG Search | User searches history | `chatbot-agent` | `rag_search` | Relevant facts |

---

## User Stories

- As a founder, I ask "How does my MRR compare?" and get industry benchmarks
- As a founder, I say "Help me improve my pitch deck" and AI routes me to the editor
- As a founder, I return to a conversation and AI remembers our discussion
- As a founder, I search history for "pricing" and find past pricing discussions

---

## Acceptance Criteria

- [ ] Chat responses include industry-specific context
- [ ] Conversation history persists across sessions
- [ ] Service routing provides clickable links to features
- [ ] Benchmarks cite data sources
- [ ] Chat loads previous context within 2 seconds
- [ ] Quick action buttons in right panel work

---

## Frontend Components

| Component | File | Status |
|-----------|------|--------|
| `AIChat.tsx` | — | ⬜ Not created |
| `ChatInterface.tsx` | — | ⬜ Not created |
| `ChatHistory.tsx` | — | ⬜ Not created |
| `ChatMessage.tsx` | — | ⬜ Not created |
| `ChatAIPanel.tsx` | — | ⬜ Not created |

---

## Missing Work

1. **Create AI Chat page** — Dedicated route at `/ai-chat`
2. **Chat interface component** — Message thread + input
3. **History view** — Session list with search
4. **Wire to chatbot-agent** — All 22 actions available
5. **Context panel** — Industry, persona, quick actions

---

## Implementation Priority

| Step | Task | Effort | Impact |
|------|------|--------|--------|
| 1 | Create AIChat page with basic layout | 2h | High |
| 2 | Build ChatInterface component | 3h | High |
| 3 | Wire to `chatbot-agent` edge function | 2h | High |
| 4 | Add industry detection + persona display | 1h | Medium |
| 5 | Build chat history view | 2h | Medium |
| 6 | Implement RAG search | 3h | Low |
