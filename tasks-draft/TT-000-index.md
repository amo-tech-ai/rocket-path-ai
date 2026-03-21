# TT-000: Validator V2 — Spec Index

> **Version:** 1.0 | **Date:** 2026-02-10
> **PRD:** `prd-validator.md`
> **Status:** Planning

---

## File Listing

| File | Ticket | Title | Priority | Effort | Status |
|------|--------|-------|----------|--------|--------|
| `prd-validator.md` | — | Master PRD | P0 | — | Draft |
| `TT-000-index.md` | — | This file: index + diagrams | P0 | — | Draft |
| `TT-005-enriched-agent-prompts.md` | SA-TT-005 | Enrich agent prompts with named frameworks | P0 | S | Not Started |
| `TT-001-customer-persona.md` | SA-TT-001 | Customer Persona report section | P1 | M | Not Started |
| `TT-002-competitive-moat.md` | SA-TT-002 | Competitive Moat section + scoring dimension | P1 | M | Not Started |
| `TT-003-gtm-strategy.md` | SA-TT-003 | GTM Strategy report section | P1 | M | Not Started |
| `TT-004-investor-readiness.md` | SA-TT-004 | Investor Readiness section + token compression | P1 | M | Not Started |
| `TT-006-frontend-sections.md` | SA-TT-006 | 4 new frontend components | P1 | M | Not Started |
| `TT-007-task-spec-layer.md` | SA-TT-007+008 | Task-spec architecture + deck export | P2 | L | Not Started |

---

## Dependency Graph

```
TT-005 (Prompts)         # Ships first, zero risk, no dependencies
   |
   v
TT-001 (Persona) ------> TT-006 (Frontend)
   |                         ^
   v                         |
TT-002 (Moat) -----------> TT-006
   |                         ^
   v                         |
TT-003 (GTM) ------------> TT-006
   |                         ^
   v                         |
TT-004 (Investor) -------> TT-006
                             |
                             v
                          TT-007 (Task-Specs + Deck Export)  [backlog]
```

### Dependency Rules

- **TT-005** has no dependencies — ships first as pure prompt changes
- **TT-001 through TT-004** each depend on TT-005 (enriched prompts provide context for new sections)
- **TT-001 through TT-004** are independent of each other — can ship in any order
- **TT-006** depends on all of TT-001 through TT-004 (needs types + schemas to build components)
- **TT-007** depends on TT-006 (task-specs + deck export build on the complete V2 report)

### Recommended Build Order

```
TT-005 -> TT-001 -> TT-002 -> TT-003 -> TT-004 -> TT-006 -> TT-007
```

TT-001 through TT-004 are ordered by complexity (persona is simplest, investor readiness includes token compression). TT-006 ships last because frontend components need all 4 types defined first.

---

## Sprint Allocation

| Sprint | Tickets | Duration | Deliverable |
|--------|---------|----------|-------------|
| Sprint 1 | TT-005, TT-001 | 2-3 days | Enriched prompts + customer persona section in report JSON |
| Sprint 2 | TT-002, TT-003 | 2-3 days | Competitive moat + GTM strategy sections in report JSON |
| Sprint 3 | TT-004, TT-006 | 3-4 days | Investor readiness + all 4 frontend components |
| Backlog | TT-007 | 5-7 days | Task-spec layer + deck export |

---

## Token Budget Summary

### Prompt Token Impact (Input)

| Agent | Current Prompt | V2 Addition | V2 Total | Timeout Budget |
|-------|---------------|-------------|----------|---------------|
| Extractor | ~350 tokens | +120 (JTBD, buyer/user) | ~470 | 10s (typical ~6s) |
| Scoring | ~500 tokens | +200 (Sequoia, Porter, moat dimension) | ~700 | 15s (typical ~13s) |
| Composer | ~600 tokens | +180 (expert lenses) + ~400 (4 new section specs) | ~1180 | 90s (typical ~40s) |
| Research | ~400 tokens | +0 | ~400 | 40s (typical ~20s) |
| Competitors | ~300 tokens | +0 | ~300 | 45s (background) |
| MVP | ~250 tokens | +0 | ~250 | 30s (typical ~11s) |
| Verifier | 0 (no LLM) | +0 | 0 | 5s (typical <1s) |

### Output Token Budget (Composer)

| Category | Tokens | Notes |
|----------|--------|-------|
| maxOutputTokens limit | 8192 | Hard cap in composer.ts |
| V1 output (14 sections) | ~6500 | Average across 3 E2E runs |
| Compression savings | ~-450 | monthly_y1 optional, resources capped, advisory capped |
| V1 after compression | ~6050 | |
| customer_persona | ~200 | Buyer/user/JTBD/triggers/objections |
| competitive_moat | ~250 | 5 dimensions + Porter summary |
| gtm_strategy | ~200 | Primary + channels + 90-day + loops |
| investor_readiness | ~200 | Score + stage + strengths/concerns + metrics + exits |
| **V2 total** | **~6900** | |
| **Margin** | **~1300** | 15.8% buffer |

---

## Diagram 1: Enhanced Pipeline Flow

```mermaid
flowchart TD
    subgraph INPUT["User Input"]
        A[Startup Idea + Interview Context]
    end

    subgraph TIER1["Tier 1: Gathering"]
        B[ExtractorAgent<br/>+JTBD extraction<br/>+buyer/user split]
        C[ResearchAgent<br/>Google Search + URL Context]
        D[CompetitorAgent<br/>Google Search<br/>background promise]
    end

    subgraph TIER2["Tier 2: Analysis"]
        E[ScoringAgent<br/>+Sequoia framework<br/>+Porter reference<br/>+competitiveMoat dim<br/>thinking: high]
        F[MVPAgent<br/>phases + next steps]
    end

    subgraph TIER3["Tier 3: Synthesis"]
        G[ComposerAgent<br/>5 expert lenses<br/>14 required + 4 optional sections<br/>maxOutputTokens: 8192]
        H[VerifierAgent<br/>15 required + 4 optional checks<br/>no LLM call]
    end

    subgraph OUTPUT["Report Output"]
        I["V1 Sections 1-14<br/>(required)"]
        J["V2 Section 15: Customer Persona<br/>(optional, JTBD)"]
        K["V2 Section 16: Competitive Moat<br/>(optional, Porter + Blue Ocean)"]
        L["V2 Section 17: GTM Strategy<br/>(optional, channel + 90-day)"]
        M["V2 Section 18: Investor Readiness<br/>(optional, Sequoia)"]
    end

    A --> B
    B --> C
    B --> D
    C --> E
    D -.->|grace period| G
    E --> F
    F --> G
    G --> H
    H --> I
    H --> J
    H --> K
    H --> L
    H --> M

    style J fill:#e8f5e9,stroke:#4caf50
    style K fill:#e8f5e9,stroke:#4caf50
    style L fill:#e8f5e9,stroke:#4caf50
    style M fill:#e8f5e9,stroke:#4caf50
```

---

## Diagram 2: Report Section Map

```mermaid
flowchart LR
    subgraph GROUNDED["Grounded Sections (1-8)<br/>Direct from upstream agents"]
        S1[1. summary_verdict]
        S2[2. problem_clarity]
        S3[3. customer_use_case]
        S4[4. market_sizing]
        S5[5. competition]
        S6[6. risks_assumptions]
        S7[7. mvp_scope]
        S8[8. next_steps]
    end

    subgraph SYNTHESIZED["Synthesized Sections (9-14)<br/>Composer + upstream data"]
        S9[9. technology_stack]
        S10[10. revenue_model]
        S11[11. team_hiring]
        S12[12. key_questions]
        S13[13. resources_links]
        S14[14. scores_matrix]
        S14b[14b. financial_projections]
    end

    subgraph STRATEGIC["V2 Strategic Sections (15-18)<br/>Composer + named frameworks<br/>ALL OPTIONAL"]
        S15["15. customer_persona<br/>JTBD + buyer/user"]
        S16["16. competitive_moat<br/>Porter + Blue Ocean"]
        S17["17. gtm_strategy<br/>Channel + 90-day plan"]
        S18["18. investor_readiness<br/>Sequoia + fundability"]
    end

    EXT[ExtractorAgent] --> S2
    EXT --> S3
    RES[ResearchAgent] --> S4
    RES --> S13
    COMP[CompetitorAgent] --> S5
    SCR[ScoringAgent] --> S1
    SCR --> S6
    SCR --> S14
    MVP[MVPAgent] --> S7
    MVP --> S8

    COM[ComposerAgent] --> S9
    COM --> S10
    COM --> S11
    COM --> S12
    COM --> S14b
    COM --> S15
    COM --> S16
    COM --> S17
    COM --> S18

    style S15 fill:#e8f5e9,stroke:#4caf50
    style S16 fill:#e8f5e9,stroke:#4caf50
    style S17 fill:#e8f5e9,stroke:#4caf50
    style S18 fill:#e8f5e9,stroke:#4caf50
```

---

## Diagram 3: Implementation Sequence

```mermaid
gantt
    title Validator V2 Implementation
    dateFormat  YYYY-MM-DD
    axisFormat  %b %d

    section Sprint 1
    TT-005 Enriched Prompts       :tt005, 2026-02-11, 1d
    TT-001 Customer Persona       :tt001, after tt005, 2d

    section Sprint 2
    TT-002 Competitive Moat       :tt002, after tt001, 2d
    TT-003 GTM Strategy           :tt003, after tt002, 1d

    section Sprint 3
    TT-004 Investor Readiness     :tt004, after tt003, 2d
    TT-006 Frontend Components    :tt006, after tt004, 3d

    section Backlog
    TT-007 Task-Specs + Deck      :tt007, after tt006, 5d
```

---

## Critical Files Reference

| File | Role | Current Lines | Modified By |
|------|------|--------------|-------------|
| `supabase/functions/validator-start/types.ts` | TypeScript interfaces | 145 | TT-001, TT-002, TT-003, TT-004 |
| `supabase/functions/validator-start/schemas.ts` | Gemini JSON schemas (G1) | 393 | TT-001, TT-002, TT-003, TT-004 |
| `supabase/functions/validator-start/agents/extractor.ts` | Extraction + JTBD | 89 | TT-005 |
| `supabase/functions/validator-start/agents/scoring.ts` | Scoring + Porter + moat | 92 | TT-005, TT-002 |
| `supabase/functions/validator-start/agents/composer.ts` | 18-section synthesis | 116 | TT-005, TT-001-004 |
| `supabase/functions/validator-start/agents/verifier.ts` | Section validation | 132 | TT-001, TT-002, TT-003, TT-004 |
| `supabase/functions/validator-start/config.ts` | Agent configs (no changes) | 37 | — |
| `supabase/functions/validator-start/pipeline.ts` | Pipeline orchestrator (no changes) | 276 | — |
| `src/components/validator/ScoreCircle.tsx` | Reuse for fundability | ~40 | — (reference only) |
| `src/components/validator/ReportSection.tsx` | Reuse for section wrapper | ~30 | — (reference only) |
| `src/pages/ValidatorReport.tsx` | Add 4 new section renders | ~250 | TT-006 |
| `lean/repos/thinktank-adaptation-plan.md` | Source adaptation plan | 431 | — (reference only) |
| `lean/repos/agents-thinkai.md` | ThinkTank agent definitions | 528 | — (reference only) |
| `lean/prompts/TASK-TEMPLATE.md` | Task spec format | 488 | — (reference only) |

---

## Verification Checklist (All Tickets)

### Per-Ticket E2E Test Protocol

1. Run validator with: "AI-powered restaurant management platform for independent restaurants"
2. Run validator with: "SaaS tool that auto-generates investor update emails from Notion workspace"
3. Run validator with: "Healthtech wearable that predicts migraine attacks 2 hours before onset"
4. For each run, verify:
   - [ ] All 14 V1 sections present and non-empty
   - [ ] New V2 section(s) present (or gracefully absent with warning)
   - [ ] Overall score in 60-80 range (no inflation)
   - [ ] Pipeline time < 150s
   - [ ] Composer output tokens < 7800
   - [ ] Verifier reports `verified: true`
   - [ ] `npm run build` passes

### Regression Checklist

- [ ] Old reports (V1, no V2 sections) still render in frontend
- [ ] Scoring dimension_scores has 7 or 8 keys (never fails on 7)
- [ ] Frontend handles missing `customer_persona`, `competitive_moat`, `gtm_strategy`, `investor_readiness`
- [ ] No TypeScript errors in build
