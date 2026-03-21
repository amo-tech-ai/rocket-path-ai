# PRD: Validator V2 — ThinkTank AI Adaptation

> **Version:** 1.2 | **Status:** Draft | **Date:** 2026-02-10
> **Author:** Claude Code (Senior AI Product Architect)
> **Sources:** ThinkTank AI (`lean/repos/thinktank-adaptation-plan.md`), Validator Strategy (`lean/validator/strategy.md`), Product PRD (`lean/validator/prd-startupai.md`), last30days Adaptation (`lean/validator/30-days.md`), Core Wireframes (`lean/wireframes/core/`)
> **Spec Index:** `TT-000-index.md`

---

## 1. Executive Summary

### Product Context

StartupAI is an AI-powered OS for founders: **Idea -> Validation -> Strategy -> Execution -> Fundraising** (in ~30 minutes). The Validator is the core product — a 7-agent pipeline that turns a founder's idea (via chat + follow-up questions) into a structured report with a GO/CAUTION/NO-GO verdict. The product follows a **plan-then-execute** philosophy: understand deeply first (research + score), then recommend. AI suggests, human approves, system executes.

### The Problem

The validator pipeline produces a 14-section report through 7 Gemini-powered agents. Reports work E2E but lack strategic depth: agent prompts reference zero named frameworks, persona richness is 1-2/5, and the Composer generates 7 of 14 sections from scratch with no strategic grounding. The follow-up agent needs to be a **YC-caliber startup expert** who probes for specifics, numbers, and evidence — not generic questions.

### The Solution

ThinkTank AI is a 9-agent CrewAI system with rich agent personas that reference specific frameworks (Porter's Five Forces, Blue Ocean Strategy, JTBD, Sequoia evaluation criteria). The last30days skill contributes intent parsing and post-report idea generation patterns. The validator strategy (`lean/validator/strategy.md`) defines Smart Interviewer principles and context assembly logic.

**This PRD adapts all three sources to StartupAI's existing React 18 + TypeScript + Supabase + Gemini stack.** No Python. No CrewAI. No new agents. All improvements flow through enriched prompts, 4 new Composer-generated report sections, and aligned strategy patterns.

### What Changes

- **4 new report sections:** Customer Persona, Competitive Moat, GTM Strategy, Investor Readiness
- **6 named frameworks** woven into agent prompts: JTBD, Porter's Five Forces, Blue Ocean Strategy, Sequoia Evaluation, Lean Startup, Business Model Canvas
- **1 new scoring dimension:** `competitiveMoat` (0-100)
- **4 new frontend components** to render the new sections
- **All new sections are optional** — old reports render without them (graceful degradation)

### What Does NOT Change

- Pipeline topology (7 agents, same execution order)
- Pipeline timeouts (300s deadline, 90s Composer cap)
- Agent models (all `gemini-3-flash-preview`)
- Database schema (JSONB `details` column absorbs new fields)
- Authentication, RLS, or edge function infrastructure

---

## 2. Current vs Target State

| Dimension | Current (V1) | Target (V2) |
|-----------|-------------|-------------|
| Report sections | 14 | 18 (+4 new optional) |
| Named frameworks in prompts | 0 | 6 (JTBD, Porter, Blue Ocean, Sequoia, Lean, BMC) |
| Agent persona depth | 1-2/5 | 3-4/5 |
| Scoring dimensions | 7 | 8 (+competitiveMoat) |
| Investor lens | None | Fundability score + stage + concerns |
| GTM guidance | 1-10 score only | Channel strategy + 90-day launch plan |
| Customer depth | Single paragraph (`customer_use_case`) | Buyer/user distinction + JTBD + triggers + objections |
| Competitive analysis | List of competitors | Moat type + 5-dimension defensibility + Porter summary |
| Composer output tokens | ~6000-7000 of 8192 | ~7200-7800 of 8192 (after compression) |

---

## 3. ThinkTank Agent Mapping

What to adapt from each ThinkTank agent, and what to skip.

| ThinkTank Agent | Rich Backstory Pattern | StartupAI Adaptation | Action |
|-----------------|----------------------|---------------------|--------|
| Market Research Agent | Market analytics methodology transparency | Enrich Research agent prompt with methodology naming | Adapt prompt |
| Feasibility Analysis Agent | Technical + financial + legal assessment | Expand `technology_stack` section with blockers/risks/timeline | Adapt prompt |
| Customer Persona Agent | Demographics + psychology + JTBD | New `customer_persona` section via Composer | New section |
| Business Model Agent | Platform economics, subscription models | Enrich `revenue_model` with pricing strategy depth | Adapt prompt |
| Competitive Advantage Agent | Porter's Five Forces + Blue Ocean | New `competitive_moat` section + Scoring dimension | New section |
| GTM Strategy Agent | Channel strategy + launch timelines | New `gtm_strategy` section via Composer | New section |
| Monetization Optimization Agent | Behavioral economics, LTV optimization | Enhance `revenue_model` with optimization tactics | Adapt prompt (minor) |
| Tech Stack Recommender | Architecture blueprints, scaling plans | Already exists as `technology_stack` section | Skip (exists) |
| Investor Pitch Agent | Multi-audience pitch materials | New `investor_readiness` section via Composer | New section |

### What NOT to Copy

| ThinkTank Pattern | Why Skip |
|---|---|
| Python / CrewAI / FastAPI | StartupAI is TS/Deno/Edge Functions |
| Streamlit UI | StartupAI uses React + shadcn/ui |
| Unstructured bullet-point output | StartupAI already has JSON schemas (G1) |
| No search grounding | StartupAI already has Google Search + URL Context |
| Sequential-only execution | StartupAI already runs Research + Competitors in parallel |
| 100-char truncation | StartupAI uses extractJSON repair |
| No verification step | StartupAI has Verifier agent |
| No auth / RLS | StartupAI has Supabase auth + RLS |

---

## 4. Architecture

### No New Agents

All 4 new sections are **Composer-generated**. The Composer already synthesizes all upstream agent data into the final report. Adding 4 sections to its prompt is the lowest-risk approach — no new agent functions, no pipeline topology changes, no new Gemini API calls.

### Section Generation Model

```
Sections 1-8:   Grounded — sourced directly from upstream agents (Extractor, Research, Competitors, Scoring, MVP)
Sections 9-14:  Synthesized — Composer combines upstream data with domain reasoning
Sections 15-18: Speculative — Composer applies named frameworks to generate strategic analysis
```

All V2 sections (15-18) are **speculative** — they require the Composer to apply frameworks (JTBD, Porter, Sequoia) to available data. This is the same pattern used for `technology_stack`, `revenue_model`, and `team_hiring` in V1.

### Optional Sections (Graceful Degradation)

New sections are NOT added to the Verifier's `requiredSections` list. They are checked via a separate `optionalSections` list that generates warnings (not failures) when missing. This means:

- Old reports (V1) render fine in the V2 frontend — missing sections just don't appear
- If Composer runs out of tokens, it can skip optional sections without failing verification
- Frontend components use optional chaining (`report.customer_persona?.buyer`)

### Pipeline Topology (Unchanged)

```
User Input -> Extractor -> [Research + Competitors(bg)] -> Scoring -> MVP -> Composer(+4 sections) -> Verifier
```

The only change is Composer's prompt gets longer (instructions for 4 new sections) and its output grows by ~800-1200 tokens.

### 3-Tier Naming (from Strategy)

The pipeline maps to ThinkTank's 3-tier model with StartupAI-specific names:

| Tier | Name | Agents | Purpose |
|------|------|--------|---------|
| 1 | **Gathering** | Extractor | Structured profile from input/interview |
| 2 | **Analysis** | Research, Competitors (parallel), Scoring, MVP | Market, competition, scores, MVP plan |
| 3 | **Synthesis** | Composer, Verifier | 18-section report + verification |

---

## 5. Strategy Integration

This section captures patterns from `lean/validator/strategy.md`, `lean/validator/30-days.md`, and `lean/validator/notes.md` that V2 should align with.

### 5.1 Smart Interviewer Principles

The follow-up agent (`validator-followup`) must be a **YC-caliber startup expert** — not a generic chatbot. V2 prompt enrichment (TT-005) must reinforce these principles:

| Principle | Implementation |
|-----------|----------------|
| **Depth over breadth** | 8 topics with none/shallow/deep tracking; never re-ask a covered topic |
| **Industry-aware** | Inject industry playbook questions; use validation prompts from prompt packs |
| **Probe for numbers** | Quantifying technique for vague claims ("how many?", "what %?") |
| **Challenge assumptions** | Sanity checks: TAM >$50B, "no competitors", revenue without customer count |
| **Explicit persona** | "You are a YC-caliber startup validation coach with deep experience in [industry]" |

**Alignment with TT-005:** The enriched Extractor prompt should carry over the Smart Interviewer's depth. If the interview already covered customer details at "deep" coverage, the Extractor should trust and refine (not re-derive), and the Composer should produce a richer `customer_persona` section.

### 5.2 Context Assembly Logic

Today context comes from multiple sources with implicit logic. The strategy calls for centralizing and documenting the flow:

```
User input + chat history
    |
    v
[Follow-up agent] — 8 topics, depth tracking, playbook questions
    |  Outputs: extracted fields, coverage map, discovered entities
    v
[Extractor] — input_text + interview_context
    |  Outputs: StartupProfile + search_queries + competitor_search_queries (planned)
    v
[Research]              [Competitors] (parallel)
  - Curated links         - Google Search
  - RAG (search_queries)  - competitor_search_queries (planned)
  - URL context
  - Google Search
    |
    v
[Scoring] -> [MVP] -> [Composer] -> [Verifier]
  All receive prior outputs + named frameworks in prompts
```

**V2 additions to context flow:**
- **`competitor_search_queries`:** Extractor generates targeted competitor queries (from strategy P1 item 5). Feeds into Competitors agent prompt.
- **Search queries for RAG:** Use Extractor's `search_queries` for vector DB queries too, not just web search (strategy P1 item 4).
- **Playbook injection:** Industry-specific validation questions injected into follow-up and Research agents (strategy P0 items 1, 3).

### 5.3 Post-Report Idea Generator (from last30days)

After the report renders, the UI should NOT auto-generate follow-up content. Instead, follow the **last30days invitation pattern**:

1. Show 2-3 **specific** "What you can do next" options grounded in THIS report:
   - "Generate a 10-slide pitch deck from this validation" (uses investor_readiness + summary)
   - "Create a one-pager for [investor type] using your moat and GTM sections"
   - "Deep-dive on [named competitor] vs your positioning"
2. **Wait** for user to pick one
3. Execute **one** action using the report as context

This is a **frontend-only** change (post-report UI). The backend already has the data. Implementation lands in TT-006 or a separate P1 ticket.

### 5.4 Intent Parsing (from last30days, future)

Before the pipeline starts, derive user intent to tailor search and post-report suggestions:

- **IDEA_TOPIC:** The startup idea/domain
- **GOAL:** "validate" | "pitch deck" | "competitor deep-dive" | "market size only"
- **QUERY_FLAVOR:** RECOMMENDATIONS (competitors, benchmarks) | NEWS (funding, launches) | GENERAL (broad validation)

**V2 scope:** Not in initial tickets (TT-001 through TT-006). Captured as future P2 work. When implemented, GOAL drives which post-report "What's next" options appear, and QUERY_FLAVOR drives targeted web search queries run in parallel with the pipeline.

### 5.5 AI Governance Principle

From the product PRD: **AI suggests, human approves, system executes.**

- Report and downstream actions (canvas prefill, deck generation) are driven by user choice
- AI never auto-writes without approval
- Post-report idea generator follows this: suggest, wait, then execute on approval

### 5.6 Strategy Priority Alignment

The existing strategy (`lean/validator/strategy.md`) defines priorities. V2 tickets map to them:

| Strategy Priority | Strategy Item | V2 Ticket |
|-------------------|--------------|-----------|
| P0 (Quick Win) | Explicit "startup expert" persona in agent prompts | TT-005 |
| P0 (Quick Win) | Playbook injection to follow-up | TT-005 (partial — prompts only, not playbook infra) |
| P1 (Report Quality) | Named frameworks in Scoring + Composer | TT-005 |
| P1 (Report Quality) | New report sections: persona, moat, GTM, investor | TT-001, TT-002, TT-003, TT-004 |
| P1 (Report Quality) | Post-report "What's next?" options | TT-006 (frontend) |
| P1 (Context) | `competitor_search_queries` from Extractor | TT-005 (add to Extractor output) |
| P1 (Context) | Search queries for RAG | Future (not in V2 scope) |
| P2 (Deeper Intel) | Idea clarity score from Extractor | Future |
| P2 (Deeper Intel) | Intent parsing (GOAL, QUERY_FLAVOR) | Future |
| P2 (Deeper Intel) | Industry playbook injection into Research/Scoring | Future (partial in TT-005) |

---

## 6. 4 New Report Sections

### 6.1 Customer Persona (TT-001)

**Source:** ThinkTank Customer Persona Agent + JTBD framework
**Data inputs:** Extractor (`customer`, `problem`), Scoring (`market_factors`), Smart Interviewer context

```typescript
interface CustomerPersona {
  buyer: {                              // Who pays
    title: string;                      // "VP of Production"
    company_type: string;               // "Independent fashion label, 10-50 employees"
    budget_authority: string;            // "Owns $50K-200K annual software budget"
  };
  user: {                               // Who uses daily
    title: string;                      // "Production Manager"
    daily_pain: string;                 // "Spends 3hrs/day coordinating vendors via email"
    current_workaround: string;         // "Google Sheets + WhatsApp groups"
  };
  jtbd_statement: string;               // "When [situation], I want [motivation], so I can [outcome]"
  purchase_triggers: string[];           // Events that make them search for a solution (3 max)
  top_objections: string[];             // Why they'd say no (3 max)
  before_after: {
    before: string;                     // Current state pain
    after: string;                      // Desired outcome with product
  };
}
```

### 6.2 Competitive Moat (TT-002)

**Source:** ThinkTank Competitive Advantage Agent + Porter's Five Forces + Blue Ocean Strategy
**Data inputs:** Competitors agent, Scoring (`competition` dimension), Research (market gaps)

```typescript
interface CompetitiveMoat {
  moat_type: string;                    // "Network Effects" | "Data Moat" | "Switching Costs" | "Brand/Trust" | "Technical IP" | "None Identified"
  dimensions: Array<{                   // 5 moat dimensions, each scored
    name: string;                       // "Network Effects" | "Data Moat" | "Switching Costs" | "Brand/Trust" | "Technical IP"
    score: number;                      // 0-10
    rationale: string;                  // Why this score, with evidence
  }>;
  overall_defensibility: 'strong' | 'moderate' | 'weak';
  defensibility_timeline: string;       // "A well-funded competitor could replicate core features in 6-12 months, but the data moat grows with each customer"
  porter_summary: {
    supplier_power: string;             // 1-sentence assessment
    buyer_power: string;
    threat_of_substitutes: string;
    threat_of_new_entrants: string;
    competitive_rivalry: string;
  };
}
```

### 6.3 GTM Strategy (TT-003)

**Source:** ThinkTank GTM Strategy Agent
**Data inputs:** Extractor (`industry`, `customer`), Scoring (`Go-to-Market` execution factor), Research (market data)

```typescript
interface GTMStrategy {
  primary_channel: {
    name: string;                       // "Content Marketing + SEO"
    rationale: string;                  // Why this channel for this startup
    estimated_cac: number;              // USD
    time_to_first_customer: string;     // "4-6 weeks"
  };
  channel_options: Array<{              // 2-3 alternatives
    name: string;
    cost: 'low' | 'medium' | 'high';
    timeline: string;
    confidence: 'high' | 'medium' | 'low';
  }>;
  first_90_days: Array<{               // 3-phase launch plan
    phase: string;                      // "Days 1-30: Foundation"
    actions: string[];                  // 2-3 actions per phase
    milestone: string;                  // What success looks like
  }>;
  growth_loops: string[];               // Viral/organic mechanisms (2 max)
}
```

### 6.4 Investor Readiness (TT-004)

**Source:** ThinkTank Investor Pitch Agent + Sequoia evaluation criteria
**Data inputs:** Scoring (overall_score, verdict), all upstream data

```typescript
interface InvestorReadiness {
  fundability_score: number;            // 0-100, derived from scoring but investor-weighted
  stage: 'pre-idea' | 'pre-seed' | 'seed' | 'series-a';
  top_strengths: string[];              // 3 items: what investors would like (Sequoia lens)
  top_concerns: string[];               // 3 items: what investors would probe
  metrics_to_prove: Array<{             // What to demonstrate before raising
    metric: string;                     // "Monthly active users"
    target: string;                     // ">500 MAU"
    why: string;                        // "Proves product-market fit"
  }>;
  comparable_exits: Array<{             // 1-2 relevant exits/raises
    company: string;
    event: string;                      // "$50M Series B" or "Acquired by X for $200M"
    relevance: string;                  // Why comparable
  }>;
}
```

---

## 7. Agent Prompt Enrichment (TT-005)

### 7.1 Extractor Prompt Additions

Add to the existing system prompt:

- **Buyer vs. user distinction:** Extract who pays separately from who uses the product daily
- **JTBD language:** When extracting `problem`, frame as "When [situation], they want [motivation], so they can [outcome]"
- **Pain quantification:** Push the model to quantify the problem (time lost, money wasted, frequency)
- **`competitor_search_queries`:** New output field — 2-3 targeted queries for the Competitors agent (e.g., "top [industry] startups funded 2025", "[named competitor] vs alternatives"). From strategy P1 item 5.
- **Explicit persona:** "You are a YC-caliber startup analyst who extracts structure from ambiguity." From strategy P0 item 2.

**Token impact:** +150 tokens in system prompt. No timeout risk (Extractor runs in ~6s).

### 7.2 Scoring Prompt Additions

Add to the existing system prompt:

- **Sequoia evaluation framework:** "Evaluate using: Why now? Why this team? What's the unfair advantage? How big can it get?"
- **Porter's Five Forces reference:** Add as context for the Competition market_factor
- **New dimension:** `competitiveMoat` (0-100) added to `dimension_scores`
- **Scoring rubric per dimension:** Explicit criteria for what constitutes 80+, 50-79, <50

**Token impact:** +200 tokens in system prompt. Scoring uses `thinking: 'high'` and runs in ~13s — no timeout risk.

### 7.3 Composer Prompt Additions

Add 5 expert lenses to the system prompt:

```
When composing each section, apply the relevant expert lens:
- Market Analyst: Size claims backed by methodology. Growth rates contextualized.
- Customer Strategist: Buyer vs. user. JTBD framing. Purchase triggers.
- Moat Architect: Porter's 5 Forces. Blue Ocean positioning. Defensibility timeline.
- GTM Advisor: Channel economics. 90-day milestones. Growth loops.
- Investor Lens: Sequoia criteria. Fundability calibration. Comparable exits.
```

**Token impact:** +180 tokens in system prompt. Composer has 90s budget — no timeout risk.

---

## 8. Token Budget Management

### The Constraint

Composer maxOutputTokens = 8192. Current output uses ~6000-7000 tokens (14 sections). Adding 4 new sections adds ~800-1200 tokens. This pushes total to ~7200-7800, leaving 400-1000 token margin.

### Compression Strategy (applied in TT-004)

| Section | Current | Compressed | Token Savings |
|---------|---------|------------|---------------|
| `financial_projections.monthly_y1` | In schema as required | Already optional in `types.ts` — remove from Composer prompt | ~200 |
| `resources_links` | Up to 3 categories, unbounded links | Cap at 2 categories, 2 links each | ~150 |
| `team_hiring.advisory_needs` | Unbounded array | Max 2 items in prompt instruction | ~100 |
| `competition.feature_comparison` | In schema, complex nested object | Already not produced by Composer (prompt doesn't ask for it) — remove from required | ~0 (no-op) |
| **Total reclaimed** | | | **~450 tokens** |

### Token Budget After V2

```
Existing 14 sections:  ~6000-6500 tokens (after compression)
New customer_persona:  ~200 tokens
New competitive_moat:  ~250 tokens (includes porter_summary)
New gtm_strategy:      ~200 tokens
New investor_readiness: ~200 tokens
---
Estimated total:       ~6850-7350 tokens
Margin from 8192:      ~850-1350 tokens
```

This provides a safe 10-16% margin. If the Composer still truncates, extractJSON repair in `gemini.ts` handles trailing JSON truncation as a safety net.

---

## 9. New Scoring Dimension

### `competitiveMoat` (0-100)

Added to `dimension_scores` in the Scoring agent output and schema.

| Score Range | Meaning |
|-------------|---------|
| 80-100 | Strong moat — network effects, proprietary data, or high switching costs |
| 50-79 | Moderate moat — some differentiation but replicable within 12-18 months |
| 0-49 | Weak moat — commodity market, low barriers to entry |

**Scoring prompt instruction:**
```
"competitiveMoat": Evaluate using Porter's Five Forces. Consider: Does this startup have network effects?
Proprietary data that grows with usage? High switching costs? A brand trust advantage?
Technical IP that's hard to replicate? Score 80+ only if at least 2 of these are present.
```

**Impact on `scores_matrix`:** The Composer already generates `scores_matrix.dimensions` from its own reasoning. The Scoring agent's `dimension_scores.competitiveMoat` feeds into this. No separate wiring needed.

---

## 10. Frontend Components (TT-006)

4 new React components in `src/components/validator/`:

### 10.1 CustomerPersonaSection.tsx

- Two-column layout: Buyer (left) | User (right)
- JTBD statement in highlighted card
- Purchase triggers as tag chips
- Objections as warning cards
- Before/After comparison row
- **Reuses:** `ReportSection` wrapper, shadcn Card, Badge

### 10.2 CompetitiveMoatSection.tsx

- 5-dimension radar/spider chart (recharts — already in deps)
- Moat type badge (e.g., "Network Effects")
- Overall defensibility indicator (strong/moderate/weak with color)
- Porter's Five Forces as 5-row table
- Defensibility timeline as callout
- **Reuses:** `ReportSection`, recharts `RadarChart`

### 10.3 GTMStrategySection.tsx

- Primary channel as hero card with CAC and timeline
- Channel options as horizontal cards with cost/timeline/confidence badges
- 90-day plan as 3-phase timeline (vertical stepper pattern)
- Growth loops as tag list
- **Reuses:** `ReportSection`, shadcn Card, Badge, Timeline pattern

### 10.4 InvestorReadinessSection.tsx

- Fundability gauge (reuse `ScoreCircle` pattern, 0-100)
- Stage badge ("Pre-Seed", "Seed", etc.)
- Strengths/Concerns as two-column card list (green checkmark / red flag icons)
- Metrics to prove as progress-style checklist
- Comparable exits as compact cards
- **Reuses:** `ScoreCircle`, `ReportSection`, shadcn Card

### Integration into ValidatorReport.tsx

New sections render after `financial_projections` (section 14) and before any footer:

```typescript
{report.customer_persona && <CustomerPersonaSection data={report.customer_persona} />}
{report.competitive_moat && <CompetitiveMoatSection data={report.competitive_moat} />}
{report.gtm_strategy && <GTMStrategySection data={report.gtm_strategy} />}
{report.investor_readiness && <InvestorReadinessSection data={report.investor_readiness} />}
```

Optional chaining ensures old reports without these sections render without errors.

### 10.5 Post-Report "What's Next" (from Strategy + last30days)

After the report renders, show a **"What you can do next"** panel with 2-3 context-aware options:

```typescript
// Options derived from THIS report's data
const nextOptions = [
  report.investor_readiness && {
    label: "Generate pitch deck from this validation",
    action: "deck-from-report",
    enabled: true,
  },
  report.competitive_moat && {
    label: `Deep-dive: ${report.competition?.competitors?.[0]?.name} vs your positioning`,
    action: "competitor-deep-dive",
    enabled: true,
  },
  { label: "Create a one-pager for angel investors", action: "one-pager", enabled: true },
].filter(Boolean);
```

User picks one, then system executes that single action using the report as context. No auto-generation. Follows AI governance principle: suggest, wait, execute on approval.

---

## 11. Implementation Order

```
Sprint 1 (2-3 days):
  TT-005: Enriched Agent Prompts (prompt-only, zero risk, ~2hrs)
  TT-001: Customer Persona section (types + schema + prompt + verifier)

Sprint 2 (2-3 days):
  TT-002: Competitive Moat section (types + schema + scoring dimension + prompt)
  TT-003: GTM Strategy section (types + schema + prompt)

Sprint 3 (3-4 days):
  TT-004: Investor Readiness section (types + schema + prompt + token compression)
  TT-006: Frontend components (4 new sections + ValidatorReport integration)

Backlog:
  TT-007: Task-Spec Layer + Deck Export (future architecture)
```

### Critical Path Per Section

```
types.ts (interface) -> schemas.ts (JSON schema) -> composer.ts (prompt) -> verifier.ts (optionalSections) -> E2E test -> frontend component
```

---

## 12. Risk Matrix

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| Composer exceeds 8192 tokens with 4 new sections | HIGH | Medium | Compress existing sections (TT-004). Test incrementally — add 1 section at a time. extractJSON repair as safety net. |
| Quality regression in existing 14 sections | MEDIUM | Low | Run 3 E2E tests (restaurant, SaaS, healthtech) after each TT merge. Compare section lengths and scores. |
| Old reports break on new frontend components | MEDIUM | Low | All new fields optional. Components use `?.` and `&&` guards. Test with V1 report data. |
| Named frameworks produce generic "textbook" output | MEDIUM | Medium | Prompt instructions say "apply framework to THIS startup" not "describe the framework." Manual quality review of 2 reports per sprint. |
| Scoring dimension count change breaks frontend | LOW | Low | Frontend reads `dimension_scores` dynamically. `competitiveMoat` defaults to 50 if missing. |
| Composer timeout increases with longer prompt | LOW | Low | Prompt adds ~500 tokens. Composer budget is 90s. Typical run is 30-50s. 40s margin. |

---

## 13. Success Metrics

### Quantitative

| Metric | Current | Target | How to Measure |
|--------|---------|--------|---------------|
| Report sections | 14 | 18 | Count non-null fields in report JSON |
| Framework references in output | 0 | 3+ per report | Grep for "JTBD", "Porter", "Sequoia", "Blue Ocean" in report text |
| Scoring dimensions | 7 | 8 | Check `dimension_scores` keys |
| Composer tokens used | ~6500 | <7800 | Log from callGemini `usage_metadata` |
| Pipeline completion time | ~67s | <90s | Log from pipeline.ts |
| Verifier pass rate | 100% | 100% (with optional section warnings) | Check `verification.verified` |

### Qualitative (Manual Review)

- Do customer personas feel like real people or generic segments?
- Does the moat analysis name specific defensibility mechanisms?
- Does the GTM plan give actionable first steps (not "do marketing")?
- Does investor readiness calibrate stage correctly (pre-seed vs seed)?
- Are existing 14 sections still high quality after prompt changes?

---

## 14. Files Modified Per Ticket

| File | TT-005 | TT-001 | TT-002 | TT-003 | TT-004 | TT-006 |
|------|--------|--------|--------|--------|--------|--------|
| `validator-start/types.ts` | | X | X | X | X | |
| `validator-start/schemas.ts` | | X | X | X | X | |
| `validator-start/agents/extractor.ts` | X | | | | | |
| `validator-start/agents/scoring.ts` | X | | X | | | |
| `validator-start/agents/composer.ts` | X | X | X | X | X | |
| `validator-start/agents/verifier.ts` | | X | X | X | X | |
| `src/components/validator/CustomerPersonaSection.tsx` | | | | | | X |
| `src/components/validator/CompetitiveMoatSection.tsx` | | | | | | X |
| `src/components/validator/GTMStrategySection.tsx` | | | | | | X |
| `src/components/validator/InvestorReadinessSection.tsx` | | | | | | X |
| `src/pages/ValidatorReport.tsx` | | | | | | X |

---

## 15. Verification Strategy

### Per-Ticket Verification

1. Run 3 E2E validator pipelines (restaurant, SaaS tool, healthtech idea)
2. Confirm all 14 existing sections still present and non-truncated
3. Confirm new section(s) populated with framework-aligned content
4. Confirm pipeline completes within 150s (well under 300s deadline)
5. Confirm Composer output tokens under 7800 (500+ margin from 8192)

### Regression Checks

- Scores remain in 60-80 range (no inflation from framework language)
- Verifier passes with updated optionalSections
- Old reports (V1, without new sections) still render in frontend
- No new TypeScript errors (`npm run build` passes)

### Quality Review (Manual)

- Do new sections add actionable insight or just filler?
- Are named frameworks reflected in output structure (not just name-dropped)?
- Is the report narrative coherent across 18 sections?
- Would a founder find the GTM plan actionable on day 1?
- Would an investor find the readiness assessment credible?

---

## 16. Future Work (Out of Scope)

### TT-007: Task-Spec Layer

Declarative `task-specs/` directory defining each agent's input schema, output schema, success criteria, and timeout as data (not code). Enables A/B testing prompts without redeploying edge functions.

### TT-008: Deck Export from Report

"Generate Pitch Deck" button on validator results page. Maps `investor_readiness`, `summary_verdict`, `market_sizing`, `customer_persona`, `competitive_moat`, and `gtm_strategy` into a 10-slide pitch deck JSON. Links to existing deck wizard. Premium gate for monetization.

### Report Versioning

Store `report_version: 1 | 2` in `validator_reports` to distinguish V1 (14 sections) from V2 (18 sections). Frontend conditionally renders V2 components. Not needed for initial rollout since all fields are optional.

---

## Appendix A: ThinkTank Agent Backstory Patterns

The value from ThinkTank is in its **prompt engineering patterns**, not its infrastructure. Key patterns to adapt:

1. **Named expertise domains:** "expert in competitive intelligence using Porter's Five Forces and Blue Ocean Strategy" vs generic "you are a startup analyst"
2. **Collaboration references:** "Working with the Market Research Agent..." establishes that the agent should consider adjacent data
3. **Methodology naming:** "techniques like sentiment analysis, social listening, and trend mapping" tells the model which analytical tools to simulate
4. **Specificity constraints:** "exactly 3-4 key insights" with "specific and quantitative where possible"

These patterns are adapted in TT-005 as framework references and expert lenses in StartupAI's agent prompts.

## Appendix B: Existing Validator Pipeline Metrics

From 3 successful E2E runs (2026-02-08):

| Metric | Restaurant | InboxPilot | Travel AI |
|--------|-----------|------------|-----------|
| Overall score | 72/100 | 68/100 | 62/100 |
| Pipeline time | ~67s | ~70s | ~65s |
| Composer tokens | ~6200 | ~6800 | ~6500 |
| Sections populated | 14/14 | 14/14 | 14/14 |
| Verifier pass | Yes | Yes | Yes |

These serve as the V1 baseline for V2 regression testing.

## Appendix C: Cross-References

This PRD synthesizes insights from multiple source documents:

| Document | Path | What it Contributed |
|----------|------|---------------------|
| ThinkTank Adaptation Plan | `lean/repos/thinktank-adaptation-plan.md` | 9-agent mapping, 4 new sections, 8 engineering tickets, named frameworks |
| ThinkTank Agent Definitions | `lean/repos/agents-thinkai.md` | Rich backstory patterns, framework naming, persona depth model |
| Validator Strategy | `lean/validator/strategy.md` | Smart Interviewer principles, context assembly logic, P0-P2 priorities, `competitor_search_queries` |
| Product PRD (Best-of) | `lean/validator/prd-startupai.md` | Product context, target audience, AI governance, NFRs, success criteria |
| Technical PRD | `lean/validator/prd-validator.md` | 3-tier naming, agent responsibilities, report schema, bidirectional refinement note |
| last30days Adaptation | `lean/validator/30-days.md` | Intent parsing (GOAL, QUERY_FLAVOR), post-report idea generator, parallel search, context memory |
| Open Questions | `lean/validator/notes.md` | Smart interviewer philosophy, agent intelligence questions, playbook/skill questions |
| Task Template | `lean/prompts/TASK-TEMPLATE.md` | Spec file format for TT-001 through TT-007 |
| Validator v2 Strategy Index | `tasks/validator/strategy/00-INDEX.md` | Forensic audit, corrected plan, Mermaid diagrams |
| Core Wireframes (16 files) | `lean/wireframes/core/` | Screen inventory, 3-panel layout, agent specs per screen, data flows, mobile layouts |
| Wireframe Index | `lean/wireframes/00-index.md` | Screen flow, P1/P2/P3 tiers, missing screen list |
| Chat v2 Wireframe | `lean/wireframes/core/05-chat-v2.md` | Depth tracking, extraction preview, industry badge, suggestion chips |
| Report v2 Wireframe | `lean/wireframes/core/06-report-v2.md` | Confidence badges, dimension breakdown, provenance, speculative disclaimers |
| Dashboard Wireframe | `lean/wireframes/core/06-dashboard.md` | 9 centre cards, 5 right panel sections, 5 hooks, field unlock map |
| Validation Board Wireframe | `lean/wireframes/core/04-validate-canvas.md` | Risk/assumption board, stage gates, pivot log, 4 agents |

### Key Principles Carried Forward

1. **Smart Interviewer First** (strategy.md) — Agent must be YC-caliber expert, not generic chatbot
2. **Plan-then-Execute** (prd-startupai.md) — Research and score deeply before recommending
3. **AI Suggests, Human Approves** (prd-startupai.md) — No auto-generation without user choice
4. **No Sub-Agents** (strategy.md) — Richer prompts + playbooks first; defer sub-agent architecture
5. **No URL Context on Competitors** (strategy.md) — Removed for speed (~40s -> ~16s); Google Search alone finds competitors
6. **Weight Pipeline Over Web** (30-days.md) — Pipeline data is primary; web search is supplementary context
7. **One Action at a Time** (30-days.md) — Post-report: show options, wait, execute one

## Appendix D: Core Wireframe Audit & Screen Map

> **Source:** `lean/wireframes/core/` (16 files reviewed 2026-02-10)

### D.1 Screen Inventory

| # | Screen | Route | Status | Wireframe | V2 Impact |
|---|--------|-------|--------|-----------|-----------|
| 01 | Chat Intake | `/validate` | BUILT | `01-chat-intake.md` | v2 upgrade: depth bars, extraction preview, industry badge (`05-chat-v2.md`) |
| 02 | Startup Profile | `/startup-profile` | BUILT | `02-startup-profile.md` | Needs buyer/user distinction fields from TT-001 |
| 03 | Validator Report | `/validator/report/:id` | BUILT | `03-validator-report.md` | v2 upgrade: confidence badges, provenance panel (`06-report-v2.md`) + 4 new V2 sections |
| 04 | Lean Canvas | `/lean-canvas` | BUILT | `04-lean-canvas.md` | No V2 changes. 11 sections, auto-save, AI Coach |
| 04b | Validation Board | `/validate/canvas` | PLANNED | `04-validate-canvas.md` | New screen: risk/assumption board, stage gates, pivot log, 4 agents |
| 05 | 90-Day Plan | `/90-day-plan` | BUILT | `05-90-day-plan.md` | No V2 changes. 5-column Kanban, 6 sprints, 24 cards |
| 06 | Dashboard | `/dashboard` | REDESIGN | `06-dashboard.md` | Needs V2 integration: moat badge, investor readiness gauge, GTM progress |
| 09 | Opportunity Canvas | `/opportunity-canvas` | BUILT (UI) | `09-opportunity-canvas.md` | AI Risk Analyzer not wired. 10 sections, auto-import from Lean Canvas |
| 10 | Business Readiness | `/readiness` | NEW (P2) | `10-business-readiness.md` | Pre-launch trust checklist. 4 areas: trust, reliability, cost, support |
| 11 | Outcomes Dashboard | `/analytics` | PARTIAL | `11-outcomes-dashboard.md` | ROI Mirage detector, false progress detection. Analytics page exists |
| 14 | Knowledge Map | `/knowledge-map` | NEW (P2) | `14-knowledge-map.md` | Strategic truths + confidence scoring + gap detection |
| 23 | Value Proposition Canvas | `/opportunity-canvas` (tab) | NEW | `23-value-proposition-canvas.md` | Strategyzer 6-box (Jobs/Pains/Gains vs Relievers/Creators/Products). Fit score |
| 38 | Investment Readiness Level | `/readiness` (IRL section) | NEW | `38-investment-readiness-level.md` | Steve Blank 9-level IRL progression. Connects to TT-004 `investor_readiness` |
| 42 | AI Readiness Canvas | `/ai-readiness` | NEW | `42-ai-readiness-canvas.md` | 9-box AI assessment (Incremental Excellence). Per-box AI suggestions |

### D.2 Layout Convention (3-Panel)

All core screens follow a consistent 3-panel layout:

```
+---------------------------+--------------------------------------------+---------------------------+
|  CONTEXT PANEL            |  WORK AREA                                 |  AI INTELLIGENCE          |
|  (240px, sticky)          |  (main, scrollable)                        |  (280px, sticky)          |
|                           |                                            |                           |
|  Stage / Score / Status   |  Primary content                           |  AI recommendations       |
|  Navigation / Links       |  Cards, canvases, reports                  |  Suggestions, chips       |
|  Quick actions            |  Interactive elements                      |  Readiness / Next steps   |
+---------------------------+--------------------------------------------+---------------------------+
```

Mobile: Left panel = hamburger drawer, Right panel = bottom sheet or tab icon.

### D.3 V2 Report Screen Impact

The Report v2 wireframe (`06-report-v2.md`) defines changes that align with V2 new sections:

| V2 Feature | Report v2 Wireframe Coverage |
|-----------|---------------------------|
| Confidence badges (grounded/synthesized/speculative) | Fully specified: green/yellow/gray badges per section |
| 7-dimension weighted breakdown | Fully specified: bar chart with score x weight |
| Provenance stats (source counts by tier) | Fully specified: T1-T4 source counts, recency, confidence % |
| Contradictions panel (founder vs research) | Fully specified: side-by-side founder claims vs findings |
| Speculative section disclaimers | Fully specified: warning boxes for AI-suggested sections |
| Financial projections disclaimer | Fully specified: stronger "NOT FORECASTS" warning |
| New V2 sections (persona, moat, GTM, investor) | NOT in wireframe yet — need 4 section card designs |
| Start Validating button | Specified: links to Validation Board |

**Gap:** Report v2 wireframe predates the V2 sections. TT-006 frontend spec must define card layouts for: `CustomerPersonaSection`, `CompetitiveMoatSection`, `GTMStrategySection`, `InvestorReadinessSection`.

### D.4 Dashboard V2 Integration

The Dashboard wireframe (`06-dashboard.md`) defines 9 centre cards + 5 right panel sections. V2 sections should feed into:

| Dashboard Element | V2 Data Source |
|-------------------|---------------|
| Health Score | `investor_readiness.fundability_score` (new) + existing `overall_score` |
| Top Risks card | `competitive_moat.porter_summary` threats + existing `risks_assumptions` |
| Fundraising Readiness card | `investor_readiness.stage` + `metrics_to_prove` |
| Primary Opportunity card | `gtm_strategy.primary_channel` + `first_90_days[0]` |
| Smart Suggestions (right panel) | Report "What's Next" options from Section 10.5 |

### D.5 Screen Flow (Validator Journey)

```
Chat Intake (01) --> Startup Profile (02) --> Validator Pipeline --> Report (03)
     |                    |                                              |
     v                    v                                              v
  Chat v2 (05)        Profile v2                              Report v2 (06) + 4 new sections
                     (buyer/user)                                        |
                                                              +----------+-----------+
                                                              |          |           |
                                                              v          v           v
                                                     Lean Canvas(04)  Validation  Dashboard(06)
                                                              |       Board(04b)       |
                                                              v          |           v
                                                     Opportunity(09)     |     Outcomes(11)
                                                              |          v
                                                              v     Knowledge
                                                     90-Day Plan(05)  Map(14)
                                                              |
                                                              v
                                                     Business Readiness(10)
```

### D.6 Missing Wireframes (Gaps)

Screens needed but not yet wireframed:

| Screen | Need | Priority | Data Layer Ready? |
|--------|------|----------|-------------------|
| **Report History** | List past validation reports, compare scores, track progress | P1 | Yes (`validation_reports` table) |
| **Decision Log** | Track strategic decisions with evidence links | P1 | Yes (`decisions` + `decision_evidence` tables, Week 5 migration) |
| **Weekly Review** | Recurring reflection with AI coaching | P1 | Yes (`weekly_reviews` table, Week 6 migration) |
| **Shareable Links** | Manage report sharing links with expiry | P2 | Yes (`shareable_links` table, Week 5 migration) |
| **AI Usage Dashboard** | Cost tracking, model usage, limits | P2 | Yes (`ai_usage_limits` table, Week 5 migration) |
| **Assumption Board** | Kanban for hypotheses with test/validated status | P1 | Yes (`assumptions` table with new columns, Week 6 migration) |
| **Settings/Account** | User preferences, subscription, API keys | P2 | Partial (auth exists, no preferences table) |
| **Onboarding** | First-time user guided tour | P2 | No (Chat Intake serves as onboarding currently) |

**Recommendation:** Prioritize Report History, Decision Log, and Assumption Board wireframes for the next sprint. These have complete data layers and directly connect to the validator journey. Weekly Review follows as the data layer is ready.

### D.7 Wireframe Sources Added to Cross-References

| Document | Path | What it Contributed |
|----------|------|---------------------|
| Core Wireframes (16 files) | `lean/wireframes/core/` | Screen inventory, 3-panel layout convention, agent definitions per screen, data flows, mobile layouts |
| Wireframe Index | `lean/wireframes/00-index.md` | Screen flow diagram, P1/P2/P3 priority tiers, additional wireframes needed list |
