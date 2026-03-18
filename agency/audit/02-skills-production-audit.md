# Skills → Production Audit Report

**Date:** 2026-03-18 | **Scope:** Skills wiring, fragments, edge functions, AI chat, validator pipeline
**Method:** Code inspection against documentation claims | **Confidence:** HIGH

---

## Executive Summary

All Session 45 deliverables are deployed and verified. 8 fragments wired to 8 edge functions. 3-layer expert prompt active. 7 verifier rules + evidence quality live. 674 tests passing. Zero broken imports.

**One remaining gap:** Phase 3 (3 screen overlays + public rate limiting) is planned but not yet implemented.

---

## Verified Inventory

| Asset | Count | Status |
|-------|------:|--------|
| Agency fragments (`_shared/agency-fragments.ts`) | 8 | 🟢 All deployed |
| Chat mode prompts (`_shared/agency-chat-modes.ts`) | 4 | 🟢 All deployed |
| Expert prompt layers (`_shared/startup-expert.ts`) | 3 layers | 🟢 Deployed v90 |
| Screen overlays | 8 explicit | 🟢 8/11 screens covered |
| Stage overlays | 4 | 🟢 idea, pre_seed, seed, series_a |
| Domain knowledge blocks | 7 | 🟢 All mapped to screens |
| Validator agents with fragments | 5/7 | 🟢 scoring, composer, research, competitors, mvp |
| Verifier consistency rules | 11 total | 🟢 4 original + 7 v2 |
| Evidence quality scoring | 1 | 🟢 Deterministic computation |
| Tests | 674 | 🟢 All passing |

---

## Fragment → Edge Function Wiring (verified via grep)

| Fragment | Lines | Edge Function | Import Verified |
|----------|------:|---------------|:---:|
| SCORING_FRAGMENT | 49 | validator-start/scoring.ts | ✅ |
| COMPOSER_FRAGMENT | 71 | validator-start/composer.ts | ✅ |
| RESEARCH_FRAGMENT | 40 | validator-start/research.ts | ✅ |
| COMPETITORS_FRAGMENT | 43 | validator-start/competitors.ts | ✅ |
| MVP_FRAGMENT | 50 | validator-start/mvp.ts | ✅ |
| SPRINT_FRAGMENT | 58 | sprint-agent/index.ts | ✅ |
| PITCH_DECK_FRAGMENT | 52 | pitch-deck-agent/generation.ts | ✅ |
| CRM_INVESTOR_FRAGMENT | 62 | investor-agent/prompt.ts | ✅ |
| **Total** | **425** | **8 edge functions** | **8/8** |

---

## Verifier Rules Inventory

### Original Rules (4)
- Score-verdict alignment
- Top threat in risks check
- Missing pricing step in next_steps
- Zero competitors with high score

### V2 Rules (7) — Added Session 45b
| Code | Rule | Severity |
|------|------|----------|
| V2-R1 | TAM < $100M with market score > 70 | error |
| V2-R2 | Revenue model vs next steps mismatch | warn |
| V2-R3 | Y3 revenue > 50x Y1 | warn |
| V2-R4 | Score < 50 without pivot language | warn |
| V2-R5 | 5+ high-threat competitors, score > 60 | warn |
| V2-R6 | MVP > 5 features, solo founder | warn |
| V2-R7 | TAM > $1B, zero sources | error |

---

## Red Flags & Failure Points

| # | Issue | Severity | Status | Mitigation |
|---|-------|----------|--------|------------|
| 1 | ai-chat public mode has no rate limiting | 🔴 HIGH | Open | Phase 3: add IP-based rate limit |
| 2 | CORS mixed patterns in ai-chat (static vs dynamic) | 🟡 MEDIUM | Open | Phase 3: standardize to getCorsHeaders(req) |
| 3 | 3 screen overlays missing (/market-research, /investors, /experiments) | 🟡 MEDIUM | Open | Phase 3: add overlays |
| 4 | gtm_strategy domain block exists but unmapped to screens | 🟡 LOW | Open | Phase 3: map to /sprint-plan, /lean-canvas |
| 5 | Extractor + Verifier have no fragments (2/7 unwired) | 🟡 LOW | By design | Extractor = extraction not analysis; Verifier = pure JS |
| 6 | beforeunload cleanup in validator-start is best-effort | 🟡 LOW | Mitigated | Pipeline marks failure on deadline timeout |
| 7 | Skill doc claims "42+ deployed" but repo has 30 | 🟡 LOW | Open | Update skill doc separately |
| 8 | prompt-pack README claims public auth but code requires JWT | 🟡 LOW | Open | Fix README or code |
| 9 | index-functions.md says 31 deployed, should be 30 | 🟡 LOW | Open | Fix count + add validator-retry, weekly-review |

---

## Architecture Diagram

```mermaid
graph TD
    subgraph "Skills (.agents/skills/)"
        S1[validation-scoring<br/>907 lines]
        S2[market-intelligence<br/>1150 lines]
        S3[competitive-strategy<br/>1448 lines]
        S4[mvp-execution<br/>529 lines]
        S5[challenger-narrative<br/>138 lines]
        S6[sales-coach<br/>132 lines]
        S7[growth-hacker<br/>159 lines]
        S8[behavioral-nudge<br/>136 lines]
        S9[8 startup skills<br/>combined]
    end

    subgraph "Bridge Layer (_shared/)"
        F1[agency-fragments.ts<br/>8 fragments, 504 lines]
        F2[agency-chat-modes.ts<br/>4 modes, 329 lines]
        F3[startup-expert.ts<br/>3-layer, ~200 lines]
    end

    subgraph "Edge Functions (Deno Deploy)"
        EF1[validator-start<br/>7 agents, 1.1MB]
        EF2[ai-chat<br/>chat router, 998KB]
        EF3[sprint-agent]
        EF4[pitch-deck-agent]
        EF5[investor-agent]
    end

    S1 -->|SCORING_FRAGMENT| F1
    S2 -->|RESEARCH_FRAGMENT| F1
    S3 -->|COMPETITORS_FRAGMENT| F1
    S4 -->|MVP_FRAGMENT| F1
    S5 -->|COMPOSER_FRAGMENT<br/>PITCH_DECK_FRAGMENT| F1
    S6 -->|PRACTICE_PITCH<br/>DEAL_REVIEW| F2
    S7 -->|GROWTH_STRATEGY| F2
    S8 -->|CANVAS_COACH| F2
    S9 -->|CORE_PROMPT<br/>SCREEN_OVERLAYS<br/>DOMAIN_KNOWLEDGE| F3

    F1 --> EF1
    F1 --> EF3
    F1 --> EF4
    F1 --> EF5
    F2 --> EF2
    F3 --> EF2
```

## Validator Pipeline Flow

```mermaid
graph LR
    subgraph "Pipeline (validator-start)"
        EX[Extractor<br/>no fragment]
        RE[Research<br/>+RESEARCH_FRAGMENT]
        CO[Competitors<br/>+COMPETITORS_FRAGMENT]
        SC[Scoring<br/>+SCORING_FRAGMENT]
        MV[MVP<br/>+MVP_FRAGMENT]
        CM[Composer<br/>+COMPOSER_FRAGMENT]
        VE[Verifier<br/>+7 V2 rules]
    end

    EX --> RE
    EX --> CO
    EX --> SC
    RE --> MV
    SC --> MV
    CO -.->|grace period| CM
    MV --> CM
    RE --> CM
    SC --> CM
    CM --> VE

    style EX fill:#f9f,stroke:#333
    style RE fill:#bfb,stroke:#333
    style CO fill:#bfb,stroke:#333
    style SC fill:#bfb,stroke:#333
    style MV fill:#bfb,stroke:#333
    style CM fill:#bfb,stroke:#333
    style VE fill:#bbf,stroke:#333
```

## AI Chat Architecture

```mermaid
graph TD
    subgraph "AI Chat (ai-chat/index.ts)"
        PUB[Public Mode<br/>PUBLIC_SYSTEM_PROMPT]
        AUTH[Authenticated Mode<br/>buildExpertPrompt]
        COACH[Coach Mode<br/>handleCoachMode]
        MODES[Coaching Modes<br/>CHAT_MODE_PROMPTS]
    end

    subgraph "Expert Prompt (startup-expert.ts)"
        CORE[Layer 1: CORE_PROMPT<br/>role + data rules]
        SCREEN[Layer 2: SCREEN_OVERLAYS<br/>8 screen focuses]
        STAGE[Layer 3: STAGE_OVERLAYS<br/>4 stages]
        DOMAIN[DOMAIN_KNOWLEDGE<br/>7 blocks loaded per screen]
    end

    AUTH --> CORE
    CORE --> SCREEN
    SCREEN --> STAGE
    SCREEN --> DOMAIN

    subgraph "Coaching Modes"
        PP[practice_pitch]
        GS[growth_strategy]
        DR[deal_review]
        CC[canvas_coach]
    end

    MODES --> PP
    MODES --> GS
    MODES --> DR
    MODES --> CC
```

## Evidence Quality Flow

```mermaid
graph LR
    GEM[Gemini Flash<br/>thinking: high] --> EG[evidence_grades<br/>claim + grade A-D]
    EG --> COUNT[Count A/B/C/D]
    COUNT --> PCT[Strong % =<br/>A+B / total]
    PCT --> TIER{>= 60%?}
    TIER -->|Yes| STRONG[strong]
    TIER -->|No| TIER2{>= 30%?}
    TIER2 -->|Yes| MOD[moderate]
    TIER2 -->|No| WEAK[weak]
    STRONG --> NOTE[confidence_note]
    MOD --> NOTE
    WEAK --> NOTE
    NOTE --> OUT[evidence_quality<br/>on ScoringResult]
```

---

## Acceptance Checks

| Check | Expected | Actual | Pass |
|-------|----------|--------|:----:|
| Fragments exported | 8 | 8 | ✅ |
| Fragments imported by agents | 8/8 | 8/8 | ✅ |
| Validator agents with fragments | 5/7 | 5/7 | ✅ |
| Verifier V2 rules | 7 | 7 | ✅ |
| Evidence quality computed | Yes | Yes | ✅ |
| Expert prompt wired | Yes | Yes (line 448) | ✅ |
| Screen overlays | 8 | 8 | ✅ |
| Stage overlays | 4 | 4 | ✅ |
| Domain knowledge blocks | 7 | 7 | ✅ |
| Chat coaching modes | 4 | 4 | ✅ |
| TypeScript errors | 0 | 0 | ✅ |
| Build time | <7s | 5.88s | ✅ |
| Tests passing | 674 | 674 | ✅ |
| Deploys successful | 2 | 2 (ai-chat v90 + validator-start v72) | ✅ |
| Public rate limiting | Required | ❌ Not yet | ⚠️ Phase 3 |

---

## Next Steps (Phase 3)

| # | Action | Priority | Effort |
|---|--------|----------|--------|
| 1 | Add public-mode IP rate limiting to ai-chat | 🔴 HIGH | 1h |
| 2 | Add 3 missing screen overlays (/market-research, /investors, /experiments) | 🟡 MEDIUM | 30m |
| 3 | Wire gtm_strategy to /sprint-plan and /lean-canvas screens | 🟡 MEDIUM | 10m |
| 4 | Standardize CORS to getCorsHeaders(req) in ai-chat | 🟡 MEDIUM | 20m |
| 5 | Fix index-functions.md inventory (30 not 31, add 2 missing) | 🟡 LOW | 15m |
| 6 | Update skill doc "42+" → "30" deployed count | 🟡 LOW | 5m |
| 7 | Fix prompt-pack README auth claim | 🟡 LOW | 5m |

**Total Phase 3 estimate:** ~2.5 hours
