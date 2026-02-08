# Validator Pipeline — Working State Record

> Snapshot: 2026-02-08 10:55 AM
> Status: **Production-ready** — 3 consecutive successful E2E runs

---

## Pipeline Configuration (current working values)

### Edge Functions Deployed

| Function | Version | JWT |
|----------|---------|-----|
| `validator-start` | latest | verified |
| `validator-followup` | latest (updated 2026-02-08) | no-verify |
| `validator-status` | latest | verified |

### Pipeline Settings (`pipeline.ts`)

| Setting | Value | Notes |
|---------|-------|-------|
| PIPELINE_TIMEOUT_MS | 115,000ms | Reduced from 130s after production failures |
| COMPOSER_MAX_BUDGET_MS | 30,000ms | Hard cap, enforced by Promise.race |
| Composer minimum budget | 15,000ms | Skipped if less than 15s remaining |
| Composer DB buffer | 10,000ms | Reserved for DB writes after Composer |
| Competitors grace period | min(5s, remaining - 30s) | Tightened from 40s |

### Agent Timeouts (`config.ts`)

| Agent | Timeout | Model | Tools | Thinking |
|-------|---------|-------|-------|----------|
| Extractor | 10s | gemini-3-flash-preview | none | none |
| Research | 40s | gemini-3-flash-preview | googleSearch, urlContext | none |
| Competitors | 45s | gemini-3-flash-preview | googleSearch | none |
| Scoring | 15s | gemini-3-flash-preview | none | high |
| MVP | 30s | gemini-3-flash-preview | none | none |
| Composer | 40s (dynamic cap to 30s) | gemini-3-flash-preview | none | none |
| Verifier | 5s | none (pure JS) | none | none |

### Gemini API Settings (`_shared/gemini.ts`)

| Setting | Value |
|---------|-------|
| Temperature | 1.0 (G2: Gemini 3 requirement) |
| Default maxOutputTokens | 8192 |
| Composer maxOutputTokens | 4096 (P04: halved for speed) |
| responseMimeType | application/json |
| API key header | x-goog-api-key (G4) |
| Timeout mechanism | AbortSignal.timeout + Promise.race backup |
| Retry codes | 429, 500, 502, 503, 504 |
| Composer maxRetries | 0 |
| Default maxRetries | 2 |

### Follow-up Chat Agent (`validator-followup`)

| Setting | Value |
|---------|-------|
| Model | gemini-3-flash-preview |
| Timeout | 25s |
| maxRetries | 1 |
| maxOutputTokens | 2048 |
| Coverage topics | 8 (problem, customer, competitors, websites, innovation, uniqueness, demand, research) |
| MIN_EXCHANGES | 2 (before Generate enabled) |
| MAX_EXCHANGES | 7 (hard cap, always ready) |

---

## Verified E2E Runs

### Run 1: AI Restaurant Menu Pricing (2026-02-08 ~10:15 AM)
- Score: **72/100** — Promising
- All 7 agents: OK
- Timing: Extractor 8.1s, Research 21.9s, Competitors 16.5s, Scoring 12.2s, MVP 11.8s, Composer 18.2s, Verifier 0.3s
- Total: ~73s
- Verified: true

### Run 2: InboxPilot Email AI (2026-02-08 ~10:30 AM)
- Score: **68/100** — Caution
- All 7 agents: OK
- Timing: Extractor 5.2s, Research 18.3s, Competitors 21.7s, Scoring 13.2s, MVP 10.1s, Composer 19.8s, Verifier 0.3s
- Total: ~67s
- Verified: true, all 14 sections present

### Run 3: AI Travel Planning Platform (2026-02-08 ~10:55 AM)
- Session: `aafa853e-aa44-4d91-acc0-d67f861f84e8`
- Score: **62/100** — Caution
- Summary: "The product addresses the high-friction 'mid-trip pivot' problem with real-time adaptability. However, hyper-congested competition from incumbents like Google and Expedia poses an existential threat."
- All 14 sections populated:
  1. Problem Clarity (ExtractorAgent)
  2. Customer Use Case (ExtractorAgent)
  3. Market Sizing (ResearchAgent) — TAM $663.7B, SAM $13.5B, SOM $400M, 3 sources
  4. Competition Deep Dive (CompetitorAgent) — Mindtrip, Layla, Expedia Romie AI, 2 sources
  5. Risks & Assumptions (ScoringAgent) — 3 risks identified
  6. MVP Scope (MVPAgent) — "Pivot My Day" button concept
  7. Next Steps (MVPAgent) — 4 actionable steps with deliverables
  8. Scores Matrix (ScoringAgent) — 5 dimensions, weighted 62/100
  9. Technology Stack (ComposerAgent) — feasibility HIGH, ~6 weeks
  10. Revenue Model (ComposerAgent) — B2B SaaS + Affiliate, LTV/CAC 3.0x
  11. Team & Hiring (ComposerAgent) — $13K burn, 3 gaps, 2 MVP roles
  12. Key Questions (ComposerAgent) — 3 questions (1 fatal, 2 important)
  13. Resources & Links (ResearchAgent) — market data + competitor intelligence
  14. Financial Projections (ComposerAgent) — conservative/aggressive scenarios, 14mo break-even

---

## Known Bugs (not blocking)

| ID | Severity | Description |
|----|----------|-------------|
| P2-1 | P2 | Strengths/Concerns cards show "Run a new report to see" placeholder |
| P2-2 | P2 | SAM > TAM validation missing in Composer prompt |
| P3-1 | P3 | Research/Evidence field extraction edge case |
| P3-2 | P3 | Whitespace characters count toward input length |

## Recent Fixes (2026-02-08)

| Fix | Description |
|-----|-------------|
| Promise.race hard timeout | `_shared/gemini.ts` — guarantees callGemini returns within timeoutMs even when AbortSignal fails on Deno Deploy |
| Composer budget cap | `pipeline.ts` — COMPOSER_MAX_BUDGET_MS = 30s, prevents Composer from consuming remaining budget |
| Follow-up prompt anti-repetition | `validator-followup/prompt.ts` — brief answers now count as covered, explicit anti-repetition rules |
| Context-aware fallbacks | `ValidatorChat.tsx` — fallback questions skip topics already discussed via keyword matching |

---

## v2 Strategy (planned, not implemented)

Strategy docs at `tasks/validator/strategy/`:
- 00-INDEX.md — master index
- 01-validator-agents.md — original agent strategy
- 02-validator-agents.md — refined v2 plan
- 03-user-journey.md — founder journey maps (4 Mermaid diagrams)
- 04-agent-workflows.md — agent orchestration (8 Mermaid diagrams)
- 05-edge-function-architecture.md — C4 architecture + migration plan (7 Mermaid diagrams)
