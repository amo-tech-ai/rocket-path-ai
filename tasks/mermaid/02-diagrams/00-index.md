# StartupAI — Chat → Validate → Report Flow Audit & Diagrams

> **Date:** 2026-03-07 | **Session:** E2E QA Audit
> **Scope:** /validate → /validator/run/:sid → /validator/report/:rid → /dashboard
> **Location:** `tasks/mermaid/02-diagrams/`

## Audit Summary

Full E2E QA test revealed **3 critical**, **3 high**, and **2 medium** issues in the chat-to-validate-to-dashboard flow. **All 8 issues fixed** across two sessions (2026-03-07 and 2026-03-08). Vector storage audit added (diagram 09). K6 validator RAG fix verified with 5 production proof tests (diagram 10).

## Diagrams

| # | File | Type | What It Shows |
|---|------|------|---------------|
| 00 | `00-index.md` | Index | This file — audit summary + diagram inventory |
| 01 | `01-chat-to-report-flow.md` | Flowchart | Complete user journey: chat → pipeline → report → dashboard |
| 02 | `02-chat-state-machine.md` | State | ValidatorChat internal states: idle → requesting → streaming → delivered |
| 03 | `03-readiness-decision.md` | Flowchart | Generate button readiness logic (coverage, min bar, forced cap) |
| 04 | `04-pipeline-sequence.md` | Sequence | Actual 7-agent pipeline with edge functions, DB writes, realtime |
| 05 | `05-data-wiring.md` | Flowchart | Frontend ↔ backend wiring: hooks, edge functions, DB tables |
| 06 | `06-failure-points.md` | Flowchart | All identified failure points with severity classification |
| 07 | `07-dashboard-handoff.md` | Flowchart | Report completion → dashboard data flow (with fallback path) |
| 08 | `08-audit-report.md` | Report | Full audit findings, red flags, fixes applied, improvements |
| 09 | `09-vector-storage-flow.md` | Flowchart | Vector storage (pgvector) usage: chat UI, chat EF, validator, canvas coach |
| 10 | `10-vector-rag-verification.md` | Report | K6 verification: 5 proof tests, before/after flow, failure points, deploy proof |
| 11 | `11-vector-system-comprehensive.md` | Architecture | Full vector system: all 10 consumers, auth matrix, search algorithms, improvements |

## Issues Found (E2E Test 2026-03-07)

### Critical (C) — Data loss or broken core flow
| ID | Issue | Status | Fix |
|----|-------|--------|-----|
| C1 | Validator creates orphaned reports (no startup linkage for new users) | **Fixed** | Post-report guard: late-create startup + link report |
| C2 | Health-scorer dropped 'Timing' dimension from DIMENSION_MAP | **Fixed** | Added 'Timing' → 'marketUnderstanding' with averaging |
| C3 | Dashboard shows "--" score after successful validation (no startup) | **Fixed** | Added useLatestValidationScore fallback hook |

### High (H) — Degraded UX or missing data
| ID | Issue | Status | Fix Plan |
|----|-------|--------|----------|
| H1 | Journey stage stuck at "Idea 0%" when no startup exists | **Fixed** | effectiveScore fallback feeds journey calculation |
| H2 | Lean Canvas shows empty state after validation (no startup record) | **Fixed** | C1 fix ensures startup exists; canvas generation works |
| H3 | knowledge-search 401 errors during pipeline | **Fixed** | Validator now uses direct RPC (no HTTP round-trip) |

### Medium (M) — UX friction or cosmetic
| ID | Issue | Status | Fix Plan |
|----|-------|--------|----------|
| M1 | Chat skips follow-up questions on first message (goes to pipeline) | **Fixed** | `substantialSingleMessage` now requires MIN_EXCHANGES (2 msgs) |
| M2 | Dashboard realtime subscriptions error when no startup_id | **Fixed** | Downgraded CHANNEL_ERROR to console.warn across 12 hooks |
