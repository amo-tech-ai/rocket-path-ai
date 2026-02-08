# Validator v2 Strategy — Index

> Split the monolith pipeline into per-agent Edge Functions for reliability, retry, and debuggability.

---

## Documents

| # | Document | Purpose |
|---|----------|---------|
| 01 | [01-validator-agents.md](01-validator-agents.md) | Original agent strategy — 7 phases, execution DAG, universal agent mapping |
| 02 | [02-validator-agents.md](02-validator-agents.md) | Refined v2 plan — per-agent functions, DB schema, retry rules, acceptance checks |
| 03 | [03-user-journey.md](03-user-journey.md) | Founder experience — journey maps, session lifecycle, progress UX, retry flow |
| 04 | [04-agent-workflows.md](04-agent-workflows.md) | Agent orchestration — DAG, sequence diagrams, state machines, dispatch patterns, timeouts |
| 05 | [05-edge-function-architecture.md](05-edge-function-architecture.md) | System architecture — C4 diagrams, DB schema, shared modules, migration plan, timeline |
| 06 | [06-improved-plan-audit.md](06-improved-plan-audit.md) | Forensic audit — errors, gaps, corrections, improved checklist, official docs verification |
| 99 | [99-audit-strategy.md](99-audit-strategy.md) | Original audit (superseded by 06) |

---

## Current State (v1) — Updated 2026-02-08

- Single Edge Function (`validator-start`) runs all 7 agents in one isolate
- 115s shared pipeline deadline (can increase to 300s — paid plan allows 400s)
- Composer hard-capped at 30s via Promise.race
- Working in production after critical fixes (Feb 2026)
- 3 successful E2E runs: Restaurant (72), InboxPilot (68), Travel AI (62)
- Fixed: truncated JSON repair, array unwrap, MAX_TOKENS logging

## Target State (v2)

- 8 Edge Functions (1 orchestrator + 7 agents)
- Per-agent timeouts (no shared deadline)
- DB-backed communication between agents
- Per-agent retry (max 1 retry per agent)
- `degraded_success` status when optional agents fail
- Frontend retry buttons per failed agent

## Why Migrate

| v1 Problem | v2 Solution |
|------------|-------------|
| One slow agent kills the whole pipeline | Each agent has its own 400s budget (paid plan) |
| Retry means re-running everything | Retry only the failed agent |
| Hard to debug (logs interleaved) | Per-function isolated logs |
| No partial progress visible | Per-agent status polling |
| Composer budget squeezed by earlier agents | Composer gets full 120s independently |

## Key Decisions

1. **Dispatch:** Direct invoke (agent calls next via fetch)
2. **Communication:** Database relay (no shared memory)
3. **Retry:** Max 1, only on timeout/5xx/rate-limit
4. **Optional agents:** Competitors, MVP (failure = degraded_success)
5. **Core agents:** Extractor, Research, Scoring, Composer (failure = failed)
