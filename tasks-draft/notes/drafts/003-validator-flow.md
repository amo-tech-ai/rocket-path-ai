---
task_id: 003-VFL
title: Validator Flow (Chat-to-Results Experience) — INDEX
diagram_ref: D-03, D-06
phase: CORE
priority: P1
status: Partial
skill: /feature-dev
ai_model: gemini-3-flash-preview
subagents: [code-reviewer, frontend-designer]
edge_function: validator-start
schema_tables: [validation_sessions, validation_reports]
depends_on: []
---

# 003 - Validator Flow (INDEX)

> **This file was split into 3 focused sub-tasks.** The original was 1109 lines covering 6 screens, 6 agents, and 8 data flows — too large for a single task spec.

---

## Sub-Tasks

| File | Task ID | Title | Status | Lines |
|------|---------|-------|--------|-------|
| [003a-validator-chat.md](003a-validator-chat.md) | 003a-CHT | Chat & Conversation Flow | Done | ~190 |
| [003b-validator-pipeline.md](003b-validator-pipeline.md) | 003b-PIP | Processing & Pipeline | Done | ~220 |
| [003c-validator-report.md](003c-validator-report.md) | 003c-RPT | Report Dashboard & Actions | Partial | ~250 |

---

## Dependency Chain

```
003a-CHT (Chat) → 003b-PIP (Pipeline) → 003c-RPT (Report)
```

- **003a** has no dependencies (entry point)
- **003b** depends on 003a (needs chat data to run pipeline)
- **003c** depends on 003b (needs pipeline results to display report)

---

## What's Shipped vs Remaining

| Sub-Task | v1.0 (Shipped) | v1.1 (Next) |
|----------|----------------|-------------|
| 003a Chat | Chat UX, follow-ups, suggestion chips | Voice input, chat persistence |
| 003b Pipeline | 7-agent pipeline, progress animation | Per-agent progress, retry individual agents |
| 003c Report | 14-section display, scores, verdict | Share links (→010), PDF export, section edit+re-score |

---

## Real-World Example Journey

**Context:** Sarah has an idea for an AI-powered inventory management tool for small restaurants.

1. **Chat (003a):** Sarah describes her idea, coach asks 2 follow-ups about customer segment and current solutions
2. **Pipeline (003b):** 7 agents run in ~67s — extract idea, research market, find competitors, score dimensions, compose report
3. **Report (003c):** Sarah sees 72/100 score, "Worth Pursuing" verdict, expands Competition section, clicks "Generate Pitch Deck"
