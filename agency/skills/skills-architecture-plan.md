# StartupAI Skills Architecture Plan

> **Date:** 2026-03-18 | **Author:** AI Systems Architect | **Version:** 1.0

---

# 1. Executive Summary

StartupAI has **29 startup-domain skills** across two folders (`startup/` and `startupai/`), plus **7 agency skills** that are already wired into edge functions via TypeScript fragments. The system is more mature than it appears, but suffers from three structural problems:

1. **Duplication:** 3 exact file duplicates, 2 near-duplicates, 2 deprecated redirect stubs, and 3 MVP skills covering the same scope
2. **Folder confusion:** `startupai/.agents/skills/` nested directory creates a second shadow copy of 3 skills
3. **Two-tier gap:** Skills exist as rich `.md` files for Claude Code sessions, but only 7 of 29 are wired into production edge functions via the `agency-fragments.ts` pattern

**The best path forward:**
- **Clean up** the 8 duplicates/redirects/stubs (immediate, zero risk)
- **Consolidate** 29 skills → 15 canonical skills (merge MVP trio, merge news duo, remove shadows)
- **Do NOT scatter skill logic into many edge functions** — instead, extend the existing `_shared/agency-fragments.ts` pattern with 3-4 new fragments for the validator pipeline
- **Focus validator-start improvements** on 4 specific gaps: unit economics chain, cross-section consistency, market accessibility, and GTM motion analysis
- **Keep the existing architecture** — it's sound: Skills → Fragments → Edge Functions

**Estimated effort:** 2-3 sessions for cleanup, 2-3 sessions for validator upgrades, 1-2 sessions for broader wiring.

---

# 2. Skills Audit

## 2a. Startup Skills (`/.agents/skills/startup/`)

| Skill | Lines | Score | Overlap | Status | Best Use |
|-------|------:|------:|---------|--------|----------|
| validation-scoring | 907 | 92 | Primary scoring authority | **KEEP** | Scoring agent, Verifier |
| competitive-strategy | 1448 | 90 | GTM overlap with go-to-market | **KEEP** | Competitors agent, Composer |
| financial-modeling | 751 | 89 | Unit econ overlap with go-to-market | **KEEP** | Composer Group C, dashboard |
| market-intelligence | 1150 | 88 | Sizing overlap with competitive-strategy | **KEEP** | Research agent |
| go-to-market | 474 | 87 | Channel overlap with competitive-strategy | **KEEP** | MVP agent, Composer Group C |
| idea-discovery | 759 | 86 | Ideation overlap with validation-scoring | **KEEP** | Extractor agent |
| fundraising-strategy | 598 | 85 | Investor overlap with competitive-strategy | **KEEP** | Investor agent, pitch-deck |
| mvp-execution | 529 | 85 | **HIGH** with mvp-planning, mvp-architect | **KEEP** (absorb others) | MVP agent, sprint-agent |
| mvp-planning | 196 | 78 | Subset of mvp-execution | **MERGE** → mvp-execution | — |
| mvp-architect | 104 | 72 | Subset of mvp-execution | **MERGE** → mvp-execution | — |
| startup-idea-validation | 7 | 0 | Redirect stub → validation-scoring | **REMOVE** | — |
| creative-intelligence | 7 | 0 | Redirect stub → idea-discovery | **REMOVE** | — |

## 2b. StartupAI Skills (`/.agents/skills/startupai/`)

| Skill | Lines | Score | Overlap | Status | Best Use |
|-------|------:|------:|---------|--------|----------|
| ai-startup-strategist | 526 | 92 | **EXACT DUPLICATE** at nested path | **KEEP** (delete nested copy) | AI chat, strategy coaching |
| startup-pitch | 370 | 90 | Nested-only, no duplicate | **KEEP** (move to top level) | Pitch-deck-agent |
| lean-startup | 559 | 89 | Nested-only, no duplicate | **KEEP** (move to top level) | Canvas coach, AI chat |
| startup-positioning | 254 | 87 | Nested-only, no duplicate | **KEEP** (move to top level) | Competitors, Composer |
| startup-strategy-council | 327 | 86 | Nested-only, no duplicate | **KEEP** (move to top level) | AI chat strategy mode |
| growth-hacker | 159 | 85 | Already wired via chat mode | **KEEP** | AI chat growth mode |
| proposal-strategist | 137 | 88 | Already wired via fragment | **KEEP** | Composer, pitch-deck |
| startup-analyst | 324 | 82 | **EXACT DUPLICATE** at nested path | **KEEP** (delete nested copy) | AI chat, dashboard |
| startup-canvas | 138 | 81 | Nested-only, no duplicate | **KEEP** (move to top level) | Canvas coach |
| deal-strategist | 131 | 80 | Already wired via fragment | **KEEP** | Investor agent, CRM |
| idea-validator | 97 | 78 | **EXACT DUPLICATE** at nested path | **KEEP** (delete nested copy) | Extractor agent |
| validating-startup-ideas | 94 | 76 | Overlaps with idea-discovery | **MERGE** → idea-discovery | — |
| daily-ai-news | 327 | 75 | Near-duplicate of ai-news-collector | **KEEP** (merge collector in) | Scheduled task |
| ai-news-collector | 57 | 72 | Subset of daily-ai-news | **MERGE** → daily-ai-news | — |

## 2c. Agency Skills (already wired to EFs)

| Skill | Lines | Score | Fragment Target | Status |
|-------|------:|------:|-----------------|--------|
| evidence-weighting | 122 | 85 | SCORING_FRAGMENT → validator scoring | **WIRED** |
| challenger-narrative | 138 | 85 | COMPOSER_FRAGMENT + PITCH_DECK_FRAGMENT | **WIRED** |
| behavioral-nudge | 136 | 83 | CANVAS_COACH_PROMPT → ai-chat | **WIRED** |
| sprint-prioritizer | 133 | 82 | SPRINT_FRAGMENT → sprint-agent | **WIRED** |
| outbound-strategist | 191 | 82 | CRM_INVESTOR_FRAGMENT → investor-agent | **WIRED** |
| sales-coach | 132 | 80 | PRACTICE_PITCH + DEAL_REVIEW → ai-chat | **WIRED** |
| feedback-synthesizer | 129 | 80 | CANVAS_COACH_PROMPT → ai-chat | **WIRED** |

---

# 3. Functions Plan

## 3a. Edge Functions That Should Use Skills

| Function | Current Role | Should Use Skills? | Recommended Skill(s) | Pattern | Why |
|----------|-------------|-------------------|---------------------|---------|-----|
| **validator-start** | 7-agent pipeline | Yes (partially done) | validation-scoring, market-intelligence, competitive-strategy, idea-discovery, mvp-execution | Fragment import | Core product — quality directly impacts reports |
| **ai-chat** | 4-mode coaching | Yes (done) | sales-coach, growth-hacker, deal-strategist, behavioral-nudge | Chat mode prompts | Already wired via agency-chat-modes.ts |
| **sprint-agent** | Sprint task generation | Yes (done) | sprint-prioritizer | Fragment import | Already wired via SPRINT_FRAGMENT |
| **pitch-deck-agent** | Deck generation | Yes (done) | challenger-narrative, proposal-strategist | Fragment import | Already wired via PITCH_DECK_FRAGMENT |
| **investor-agent** | 12-action investor AI | Yes (done) | outbound-strategist, deal-strategist | Fragment import | Already wired via CRM_INVESTOR_FRAGMENT |
| **lean-canvas-agent** | Canvas coaching | Partial | lean-startup, startup-canvas | New fragment | Coach has RAG but no framework fragment |
| **onboarding-agent** | Wizard enrichment | No | — | Inline prompts sufficient | Simple extraction, low complexity |

## 3b. Edge Functions That Should Stay Plumbing

| Function | Current Role | Why No Skills Needed |
|----------|-------------|---------------------|
| validator-status | Progress polling | Pure CRUD/status, no AI reasoning |
| validator-retry | Per-agent retry | Orchestration logic, no domain knowledge |
| validator-regenerate | Re-run pipeline | Orchestration, delegates to validator-start |
| validator-followup | Chat follow-up | Uses interview knowledge inline (adequate) |
| validator-panel-detail | Section deep-dive | Uses section-specific prompts inline (adequate) |
| health-scorer | Health calculation | Pure scoring math, no AI needed |
| dashboard-metrics | KPI computation | Pure SQL aggregation |
| knowledge-ingest | RAG ingestion | ETL pipeline, no startup domain knowledge |
| knowledge-search | Vector search | Search orchestration, no domain knowledge |
| profile-import | URL extraction | Simple Gemini extraction, inline adequate |
| crm-agent | CRM actions | Simple CRUD + AI enrichment, inline adequate |
| documents-agent | Doc analysis | Generic extraction, not startup-specific |
| event-agent | Event planning | Generic, not startup-specific |
| task-agent | Task generation | Generic prioritization, inline adequate |
| prompt-pack | Prompt routing | Pure routing, no domain knowledge |

---

# 4. Skill Index

## Complete Canonical Index (after cleanup: 22 skills)

| # | Skill | Category | Folder | Purpose | Best Used By | EF Target | Status |
|---|-------|----------|--------|---------|-------------|-----------|--------|
| 1 | validation-scoring | Validator | startup/ | 7-dim scoring, risk taxonomy, bias detection | Scoring agent | validator-start | Fragment wired |
| 2 | market-intelligence | Validator | startup/ | TAM/SAM/SOM, Porter's, market maturity | Research agent | validator-start | Partially inline |
| 3 | competitive-strategy | Validator | startup/ | Positioning, battlecards, moat analysis | Competitors agent | validator-start | Partially inline |
| 4 | idea-discovery | Validator | startup/ | Problem framing, tarpit detection, Why Now | Extractor agent | validator-start | Partially inline |
| 5 | mvp-execution | Validator | startup/ | RICE, experiment design, PMF signals | MVP agent | validator-start | Partially inline |
| 6 | financial-modeling | Business | startup/ | Revenue models, unit economics, projections | Composer Group C | validator-start | Not wired |
| 7 | go-to-market | Business | startup/ | GTM motion, channel strategy, PLG | Composer Group C | validator-start | Not wired |
| 8 | fundraising-strategy | Business | startup/ | Readiness, investor matching, term sheets | Investor agent | investor-agent | Fragment wired |
| 9 | ai-startup-strategist | Strategy | startupai/ | 6 founder personas, OKR, execution | AI chat | ai-chat | Not wired |
| 10 | startup-pitch | Fundraising | startupai/ | 4-phase pitch workflow, formats | Pitch deck agent | pitch-deck-agent | Fragment wired |
| 11 | lean-startup | Framework | startupai/ | Build-Measure-Learn, MVP types, pivots | Canvas coach | lean-canvas-agent | Not wired |
| 12 | startup-positioning | Strategy | startupai/ | April Dunford + JTBD + Moore frameworks | Competitors agent | validator-start | Not wired |
| 13 | startup-strategy-council | Strategy | startupai/ | 6-advisor council, stage calibration | AI chat | ai-chat | Not wired |
| 14 | growth-hacker | Growth | startupai/ | AARRR, viral loops, ICE channels | AI chat growth mode | ai-chat | Chat mode wired |
| 15 | proposal-strategist | Communication | startupai/ | Win themes, 3-act narrative, exec summary | Composer Group D | validator-start | Fragment wired |
| 16 | startup-analyst | Analysis | startupai/ | Business analysis, market sizing, modeling | AI chat | ai-chat | Not wired |
| 17 | startup-canvas | Framework | startupai/ | Product Strategy Canvas, 9 sections | Canvas coach | lean-canvas-agent | Not wired |
| 18 | deal-strategist | Sales | startupai/ | MEDDPICC, competitive positioning | Investor agent | investor-agent | Fragment wired |
| 19 | idea-validator | Validation | startupai/ | Opportunity Memo, PCV scoring | Extractor agent | validator-start | Not wired |
| 20 | daily-ai-news | Content | startupai/ | Daily AI digest workflow | Scheduled task | — | Standalone |
| 21 | evidence-weighting | Agency | top-level | Evidence tier scoring, bias rules | Scoring agent | validator-start | Fragment wired |
| 22 | challenger-narrative | Agency | top-level | 3-Act, Challenger, persuasion | Composer + Pitch | validator-start, pitch-deck | Fragment wired |

**Removed/merged:** mvp-planning, mvp-architect, startup-idea-validation, creative-intelligence, validating-startup-ideas, ai-news-collector, + 3 nested duplicates

---

# 5. Recommended Skill Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLAUDE CODE SESSION                       │
│  Skills loaded via YAML frontmatter (progressive disclosure) │
│  ┌─────────────┐ ┌──────────────┐ ┌───────────────────┐    │
│  │ validation-  │ │ market-      │ │ competitive-      │    │
│  │ scoring      │ │ intelligence │ │ strategy          │    │
│  └──────┬───────┘ └──────┬───────┘ └────────┬──────────┘    │
│         │                │                   │               │
│         ▼                ▼                   ▼               │
│  ┌──────────────────────────────────────────────────┐       │
│  │     _shared/agency-fragments.ts (292 lines)      │       │
│  │     _shared/agency-chat-modes.ts (275 lines)     │       │
│  │     ─────────────────────────────────────────     │       │
│  │     TypeScript string constants (Deno safe)      │       │
│  │     Extracted from skill .md files               │       │
│  │     Type-safe registry: getFragment(name)        │       │
│  └──────────────────┬───────────────────────────────┘       │
│                     │                                        │
└─────────────────────┼────────────────────────────────────────┘
                      │
          ┌───────────┴───────────────────────┐
          │        EDGE FUNCTIONS (Deno)       │
          │                                    │
          │  validator-start/                  │
          │    agents/scoring.ts ← SCORING_FRAGMENT
          │    agents/composer.ts ← COMPOSER_FRAGMENT
          │    agents/research.ts ← (inline, needs fragment)
          │    agents/competitors.ts ← (inline, needs fragment)
          │                                    │
          │  ai-chat/ ← CHAT_MODE_PROMPTS      │
          │  sprint-agent/ ← SPRINT_FRAGMENT   │
          │  pitch-deck-agent/ ← PITCH_DECK_FRAGMENT
          │  investor-agent/ ← CRM_INVESTOR_FRAGMENT
          │  lean-canvas-agent/ ← (needs fragment)
          └────────────────────────────────────┘
```

### Key Architecture Rules

1. **Skills live in `.agents/skills/`** — rich markdown for Claude Code sessions
2. **Fragments live in `_shared/agency-fragments.ts`** — TypeScript constants extracted from skills for Deno Deploy
3. **Edge functions import fragments** — never read `.md` files at runtime
4. **One fragment per agent concern** — not per skill (a fragment can synthesize multiple skills)
5. **Chat modes are a separate module** — `_shared/agency-chat-modes.ts` for coaching prompts
6. **Skills inform fragments, not the reverse** — when a skill improves, update the corresponding fragment

---

# 6. Validator-Start Improvement Plan

## What to KEEP (working well)

| Component | Quality | Why Keep |
|-----------|---------|----------|
| 7-agent pipeline flow | 88/100 | Parallelism, checkpoints, deadline management all solid |
| SCORING_FRAGMENT wiring | 85/100 | Evidence tiers, RICE, bias detection add real value |
| COMPOSER_FRAGMENT wiring | 82/100 | Three-Act narrative, win themes improve summary |
| Post-processing guardrails | 90/100 | Signal-level capping, SAM>TAM correction, dedup — all deterministic |
| Structured JSON schemas | 85/100 | Every agent outputs typed JSON, fallback parsing is robust |
| Curated links + RAG in Research | 80/100 | 3,700+ chunks, industry-specific URLs, search grounding |

## What to CLEAN UP

| Issue | Affected | Fix | Effort |
|-------|----------|-----|--------|
| Inline domain knowledge in Research (TAM methods, source hierarchy) could be a fragment | research.ts | Extract RESEARCH_FRAGMENT from market-intelligence skill | 2h |
| Inline competitive frameworks in Competitors (tiering, moats, Dunford) could be a fragment | competitors.ts | Extract COMPETITORS_FRAGMENT from competitive-strategy skill | 2h |
| MVP agent has limited experiment templates | mvp.ts | Enrich from mvp-execution skill (10 experiment types) | 1h |
| Verifier checks only 15 sections, no cross-section validation | verifier.ts | Add 5 consistency rules (TAM→score, revenue→pricing, etc.) | 3h |

## What to WIRE NEXT (3 new fragments)

### Fragment 1: RESEARCH_FRAGMENT
**Source skills:** market-intelligence, competitive-strategy (Porter's Five Forces section)
**Content to extract:**
- TAM/SAM/SOM 3-method cross-validation rules
- Bottom-up sizing table template
- Source quality hierarchy (government > analyst > industry > news)
- Market maturity scoring (emerging/growing/mature/declining)
- Market accessibility analysis (distribution channels, regulatory barriers)
- Porter's Five Forces summary (buyer power, supplier power, substitutes, new entrants)
**Target:** `validator-start/agents/research.ts` system prompt
**Estimated lines:** 45-60

### Fragment 2: COMPETITORS_FRAGMENT
**Source skills:** competitive-strategy, startup-positioning
**Content to extract:**
- Competitor tiering definitions (Tier 1/2/3)
- Threat level calibration (HIGH/MEDIUM/LOW criteria)
- April Dunford positioning statement template
- Competitive moat types with durability assessment
- Battlecard structure (win/lose/counter/moat)
- GTM motion comparison framework
- Pricing comparison matrix template
**Target:** `validator-start/agents/competitors.ts` system prompt
**Estimated lines:** 50-65

### Fragment 3: CANVAS_COACH_FRAGMENT
**Source skills:** lean-startup, startup-canvas, behavioral-nudge
**Content to extract:**
- Build-Measure-Learn loop structure
- 9-box quality checklist (from existing chat mode, expanded)
- MVP type selection (Concierge, Wizard of Oz, Landing Page, etc.)
- Pivot type detection (10 types from lean-startup)
- Momentum patterns (from behavioral-nudge)
**Target:** `lean-canvas-agent/actions/coach.ts` system prompt
**Estimated lines:** 40-55

## What to AVOID

| Anti-pattern | Why Bad | Alternative |
|-------------|---------|-------------|
| Importing full skill `.md` files into EFs | Deno Deploy bundles only static imports, `.md` files not available at runtime | Use TypeScript string constant fragments |
| Creating a "skill router" EF | Over-engineering — each EF already knows which fragment it needs | Direct fragment import |
| Making every skill a separate fragment | Fragment explosion — 29 fragments would bloat `_shared/` | One fragment per pipeline agent (7 max) |
| Adding skills that don't map to a specific EF or agent | Orphan knowledge — skills without consumers add maintenance burden | Only create fragments for skills that feed a specific agent |
| Rewriting the validator pipeline architecture | Pipeline works (3/3 E2E runs, 72/68/62 scores) — focus on quality, not structure | Incremental fragment wiring |

## Structured Output Improvements

Current validator output is mostly well-structured. These specific fields need tightening:

| Field | Current | Improvement |
|-------|---------|-------------|
| `white_space` | Unstructured string | Change to `{gap_type, segment, description, opportunity_size}` |
| `moat_durability` | `defensible\|weak\|unknown` | Add `time_to_copy_months`, `compounding_factor` |
| `pricing_test` | Skips WTP discovery | Add `willingness_to_pay_method`, `price_sensitivity_score` |
| `experiment_cards[].method` | Free text | Constrain to enum: `interview\|landing_page\|wizard_of_oz\|concierge\|pre_sell\|spike\|prototype\|survey` |
| `financial_projections` | No sanity validation | Add Verifier rules: Y3<100x Y1, CAC<0.3x revenue, margin>industry |

---

# 7. Recommended Custom StartupAI Skills

The existing skills are strong. Rather than creating new custom skills, the recommendation is to **consolidate and enrich** the existing ones. Here are the 8 canonical "product skills" that should survive cleanup:

| Skill | Purpose | Input | Output | Used In | Replaces/Merges |
|-------|---------|-------|--------|---------|----------------|
| **validation-scoring** | 7-dim scoring rubric, risk taxonomy, bias detection, evidence grading | StartupProfile + market data | Scored dimensions, risk queue, bias flags | Scoring agent, Verifier | Absorbs evidence-weighting content |
| **market-intelligence** | TAM/SAM/SOM, Porter's Five Forces, market maturity, source quality | Idea + industry + search results | Market sizing, trend analysis, accessibility score | Research agent | Standalone (already comprehensive) |
| **competitive-strategy** | Positioning, battlecards, moat analysis, GTM motion comparison | Competitor data + market context | Positioning statement, threat analysis, white space | Competitors agent | Absorbs startup-positioning content |
| **idea-discovery** | Problem framing, tarpit detection, Why Now, assumption extraction | Raw idea text | Structured profile, quality filters, assumptions | Extractor agent | Absorbs validating-startup-ideas |
| **mvp-execution** | RICE scoring, experiment design, PMF signals, stage detection | Scoring results + profile | 3-phase roadmap, experiment cards, kill criteria | MVP agent, sprint-agent | Absorbs mvp-planning + mvp-architect |
| **financial-modeling** | Revenue models, unit economics, projections, pricing strategy | Business model + market data | Financial projections, unit economics, burn rate | Composer Group C | Standalone |
| **go-to-market** | GTM motion selection, channel strategy, PLG/sales-led/hybrid | Profile + competitive landscape | Channel recommendations, ICE scores, launch plan | Composer Group C, MVP | Standalone |
| **fundraising-strategy** | Readiness scoring, investor matching, pitch prep, term sheets | Full startup data + deck | Readiness score, investor list, prep checklist | Investor agent, pitch-deck | Standalone |

**What's NOT a custom skill:** `lean-startup`, `startup-pitch`, `startup-strategy-council`, `growth-hacker`, `deal-strategist` — these are coaching/advisory skills for AI chat sessions, not validator pipeline skills. They stay as-is.

---

# 8. Cleanup Plan

## Immediate Actions (Session 1, ~1 hour)

### 8a. Remove redirect stubs (2 files)
```
rm .agents/skills/startup/startup-idea-validation/SKILL.md
rm .agents/skills/startup/creative-intelligence/SKILL.md
rmdir .agents/skills/startup/startup-idea-validation
rmdir -p .agents/skills/startup/creative-intelligence/resources
rmdir -p .agents/skills/startup/creative-intelligence/templates
```

### 8b. Remove exact duplicates in nested folder (3 skill trees)
```
rm -rf .agents/skills/startupai/.agents/skills/ai-startup-strategist/
rm -rf .agents/skills/startupai/.agents/skills/idea-validator/
rm -rf .agents/skills/startupai/.agents/skills/startup-analyst/
```

### 8c. Move nested-only skills to top level (5 skills)
```
mv .agents/skills/startupai/.agents/skills/startup-pitch/ .agents/skills/startupai/startup-pitch/
mv .agents/skills/startupai/.agents/skills/lean-startup/ .agents/skills/startupai/lean-startup/
mv .agents/skills/startupai/.agents/skills/startup-positioning/ .agents/skills/startupai/startup-positioning/
mv .agents/skills/startupai/.agents/skills/startup-strategy-council/ .agents/skills/startupai/startup-strategy-council/
mv .agents/skills/startupai/.agents/skills/startup-canvas/ .agents/skills/startupai/startup-canvas/
rmdir .agents/skills/startupai/.agents/skills
rmdir .agents/skills/startupai/.agents
```

### 8d. Merge near-duplicates (2 merges)
- **ai-news-collector** → merge into **daily-ai-news** (add collector's 58 lines as section, delete original)
- **validating-startup-ideas** → merge unique content (tarpit detection, Bangaly Kaba frameworks) into **idea-discovery**, delete original

### 8e. Merge MVP trio (1 merge)
- Append mvp-planning's "Solopreneur Tactics" and "Fake It" content to mvp-execution
- Append mvp-architect's "Hexa Principles" as a subsection to mvp-execution
- Delete mvp-planning and mvp-architect folders
- Update mvp-execution SKILL.md description to cover all 3 scopes

### 8f. Add missing YAML frontmatter (3 files)
- `proposal-strategist/SKILL.md` — add `name: proposal-strategist` + `description:`
- `growth-hacker/SKILL.md` — add `name: growth-hacker` + `description:`
- `deal-strategist/SKILL.md` — add `name: deal-strategist` + `description:`

## Result After Cleanup

| Metric | Before | After |
|--------|--------|-------|
| Total skill folders | 29 + 7 agency | 22 + 7 agency |
| Exact duplicates | 3 | 0 |
| Redirect stubs | 2 | 0 |
| Near-duplicates | 2 | 0 |
| MVP skills | 3 | 1 |
| Nested folder depth issues | 5 skills in `.agents/skills/` subfolder | 0 |
| Skills without YAML frontmatter | 3 | 0 |

---

# 9. Next Steps

## Phase 1: Cleanup (1 session, ~2 hours)
1. Execute all cleanup actions from Section 8
2. Verify no broken references in CLAUDE.md or skills-lock.json
3. Update skills-lock.json with correct paths
4. Run `npm run build` and `npm test` to verify no breakage

## Phase 2: Validator-Start Upgrades (2-3 sessions, ~6-8 hours)
1. **Extract RESEARCH_FRAGMENT** from market-intelligence skill → wire to research.ts
2. **Extract COMPETITORS_FRAGMENT** from competitive-strategy + startup-positioning → wire to competitors.ts
3. **Add 5 cross-section consistency rules** to verifier.ts
4. **Tighten structured output** for white_space, moat_durability, experiment_cards enum
5. **Add unit economics validation chain** to Scoring post-processing
6. Run 2 E2E validator pipeline tests to verify quality improvement
7. Deploy updated validator-start edge function

## Phase 3: Broader App Wiring (1-2 sessions, ~4 hours)
1. **Extract CANVAS_COACH_FRAGMENT** from lean-startup + startup-canvas → wire to lean-canvas-agent
2. **Enrich AI chat modes** with ai-startup-strategist and startup-strategy-council content (optional 5th/6th mode)
3. **Wire financial-modeling** content into Composer Group C as inline enhancement (not a full fragment)
4. Deploy updated edge functions

## Phase 4: Testing and Validation (1 session, ~2 hours)
1. Run 3 E2E validator pipeline tests with different startup types (B2B SaaS, consumer, marketplace)
2. Compare report quality Before vs After (subjective scoring on 7 dimensions)
3. Verify all fragment imports compile cleanly
4. Check no orphan skill references in codebase
5. Update CHANGELOG.md with skills architecture improvements

---

# 10. Acceptance Checks

| Check | Metric | Target |
|-------|--------|--------|
| Duplicate skills reduced | Count of exact duplicates | 0 (from 3) |
| Redirect stubs removed | Count of stub files (<10 lines) | 0 (from 2) |
| MVP skills consolidated | Count of MVP-scoped skills | 1 (from 3) |
| Nested folder confusion resolved | Skills in `.agents/skills/` subfolder | 0 (from 5) |
| YAML frontmatter on all skills | Skills without frontmatter | 0 (from 3) |
| Validator fragments wired | Fragments imported by validator agents | 4 of 7 agents (from 2) |
| Cross-section validation | Verifier consistency rules | 5+ rules (from 0) |
| Scoring logic consistent | validation-scoring is sole scoring authority | Yes |
| Skills mapped to functions | Clean index exists | Yes (Section 4) |
| No prompt duplication | Same framework in >1 fragment | 0 |
| Fragment registry type-safe | `getFragment()` covers all fragments | Yes |
| E2E pipeline passes | Successful validation runs after changes | 3/3 |
| Build passes | `npm run build` clean | 0 errors |
| Tests pass | `npm test` | All pass |

---

# Appendix: File Count Summary

| Location | Files | Lines | Purpose |
|----------|------:|------:|---------|
| `.agents/skills/startup/` | 12 SKILL.md | 6,930 | Core startup domain knowledge |
| `.agents/skills/startupai/` | 17 SKILL.md (incl. nested) | 4,856 | StartupAI-specific coaching |
| `.agents/skills/` (agency) | 7 SKILL.md | 981 | Already wired to EFs |
| `_shared/agency-fragments.ts` | 1 | 350 | 5 pipeline fragments |
| `_shared/agency-chat-modes.ts` | 1 | 329 | 4 coaching modes |
| `validator-start/agents/` | 7 | ~2,500 | 7 pipeline agents |
| **Total domain knowledge** | — | **~15,946** | — |
