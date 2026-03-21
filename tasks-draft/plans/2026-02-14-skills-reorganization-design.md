# Skills Reorganization Design — 17 → 8 Pipeline-Aligned Skills

> **Date:** 2026-02-14 | **Status:** Approved
> **Scope:** `.agents/skills/startup/` — consolidate 17 skills into 8 pipeline-aligned skills
> **Rule:** NEVER DELETE SKILLS — old skills become redirects to new merged skills

---

## Problem

17 startup skills (~5,500 lines) have significant overlap:
- 3 financial skills cover the same unit economics formulas
- 3 skills cover TAM/SAM/SOM methodology
- 3 skills cover GTM/channel strategy
- `marketing-strategy-pmm` (1,164 lines) is 21% of all skills — needs splitting
- 4 skills are thin stubs (58-131 lines) that need enrichment

Skills are organized by **topic** but agents need them organized by **pipeline stage**.

## Solution

Consolidate into 8 skills aligned to the validator pipeline stages:

```
.agents/skills/startup/
  idea-discovery/SKILL.md         # ExtractorAgent
  market-intelligence/SKILL.md    # ResearchAgent
  competitive-strategy/SKILL.md   # CompetitorAgent
  validation-scoring/SKILL.md     # ScoringAgent
  mvp-execution/SKILL.md          # MVPAgent + Composer Group C
  financial-modeling/SKILL.md     # Composer Group C
  go-to-market/SKILL.md           # Composer Group C
  fundraising-strategy/SKILL.md   # Composer Group D
```

## Merge Map

### 1. idea-discovery (~400 lines)

**Sources:** startup-ideation (58) + lean-canvas (135) + creative-intelligence (441)

**Sections:**
- Idea Generation: "Why Now" test, personal experience, information diet (from ideation)
- Problem Framing: 5 Whys, SCAMPER, Six Thinking Hats, Reverse Brainstorming (from creative-intelligence)
- Lean Canvas: 9-block framework, canvas scoring, bias detection, assumption extraction (from lean-canvas)
- Research Methods: Market, Competitive, Technical, User research templates (from creative-intelligence)

**Dedup:** Remove generic brainstorming advice (creative-intelligence has ~200 lines of process guidance that's Claude-session-specific, not domain knowledge).

### 2. market-intelligence (~800 lines)

**Sources:** market-research-reports (902) + startup-trend-prediction (389) + startup-analyst (329, market portion)

**Sections:**
- Market Sizing: TAM/SAM/SOM bottom-up + top-down methodology, sample calculations (from analyst + reports)
- Market Analysis Frameworks: Porter's Five Forces, PESTLE, BCG Matrix, Value Chain (from reports)
- Trend Analysis: Leading/lagging indicators, hype cycle, Rogers Diffusion, Bass Model (from trend-prediction)
- Adoption Curves: Stage positioning, timing decisions (enter/wait/avoid) (from trend-prediction)
- Research Execution: Data sources (Gartner, Forrester, IDC), report structure (from reports)

**Dedup:** TAM methodology appears in all 3 sources — keep analyst's calculation-focused version. Remove reports' LaTeX/PDF formatting (not useful for agents). Remove trend-prediction's implementation details (signal database schema, etc.).

### 3. competitive-strategy (~500 lines)

**Sources:** marketing-strategy-pmm (1164, competitive sections ~400) + product-strategist (380, competitive ~150) + startup-analyst (329, competitive ~100)

**Sections:**
- Competitive Positioning: April Dunford 6-step framework, positioning statement template (from PMM)
- Competitive Analysis: Feature comparison matrix, threat levels, moat assessment (from analyst)
- Battlecards: 10-section template, win/loss analysis, competitive responses (from PMM)
- SWOT Analysis: Structured framework with industry examples (from product-strategist)
- Positioning Map: X/Y axis selection, coordinate assignment, founder positioning (from PMM)

**Dedup:** Competitive matrix appears in PMM + product-strategist + analyst. Keep PMM's (most detailed). Remove PMM's international expansion (goes to go-to-market).

### 4. validation-scoring (~500 lines)

**Sources:** startup-idea-validation (153) + startup-metrics (170) + startup-expertise (362)

**Sections:**
- 9-Dimension Scorecard: Weights, calculation, verdict thresholds GO/CONDITIONAL/PIVOT/NO-GO (from idea-validation)
- Evidence Grading: A/B/C/D hierarchy, triangulation rules, signal strength (from idea-validation)
- 15-Domain Risk Taxonomy: Complete taxonomy with scoring formula (from idea-validation)
- Validation Ladder: Interviews → Smoke test → Concierge → Paid pilot (from idea-validation)
- Health Score: 5-dimension calculation by stage, YC factors + weights (from expertise)
- Benchmarks: Churn by segment, Series A/B targets, efficiency metrics (from metrics)
- Stage-Appropriate KPIs: Pre-seed through Series B+ with formulas (from metrics)
- Industry Playbooks: Reference to 19 playbook schemas (from expertise)
- Cognitive Bias Detection: 6 founder biases with mitigation (from idea-validation)

**Dedup:** Health scoring formula in expertise vs. scoring formula in idea-validation — keep both (different purposes). Remove expertise's edge function routing logic (implementation detail).

### 5. mvp-execution (~350 lines)

**Sources:** mvp-builder (95) + lean-sprints (124) + traction (131)

**Sections:**
- MVP Canvas: 7-block framework with validation methods (from mvp-builder)
- Feature Prioritization: RICE formula with ranges, Kano model, scoping rules (from mvp-builder)
- Sprint Cycles: 2-week structure, Week 1 (Expose/Define), Week 2 (Test/Decide) (from lean-sprints)
- 90-Day Macro-Cycles: 5 sprints + retrospective + pivot/persevere (from lean-sprints)
- Customer Factory: 5-stage funnel, bottleneck detection, benchmarks (from traction)
- PMF Assessment: Sean Ellis test (≥40%), cohort analysis (from traction)
- OMTM by Stage: Idea→interviews, Pre-seed→signups, MVP→activation, Traction→retention (from traction)
- Traction Roadmap: Now/Next/Later with user + revenue milestones (from traction)

**Enrichment needed:** Add experiment templates, pivot decision framework, feature scoping examples (thin in originals).

### 6. financial-modeling (~600 lines)

**Sources:** startup-financial-modeling (495) + startup-business-models (141) + startup-metrics (170, unit econ portion)

**Sections:**
- Revenue Models: 8 model types with selection criteria (from business-models)
- Pricing Strategy: WTP research, tier design, experiment design, lag windows (from business-models)
- Unit Economics: CAC, LTV, LTV:CAC, payback, gross margin with formulas + benchmarks (from all 3)
- 3-5 Year Financial Models: Cohort-based projections, 3 scenarios (from financial-modeling)
- Cost Structure: COGS, S&M, R&D, G&A breakdown with ratios (from financial-modeling)
- Cash Flow: Beginning → inflows → outflows → ending cash (from financial-modeling)
- Headcount Planning: Dept ratios, fully-loaded cost multiplier, stage-appropriate (from financial-modeling)
- SaaS Metrics: MRR, ARR, churn, NRR, Quick Ratio, Magic Number, Rule of 40 (from all 3)
- Business Model Templates: SaaS, Marketplace, E-Commerce, Services (from financial-modeling)

**Dedup:** Unit economics formulas appear in all 3 — keep financial-modeling's (most complete with worked examples).

### 7. go-to-market (~500 lines)

**Sources:** marketing-strategy-pmm (1164, GTM sections ~400) + startup-go-to-market (262) + product-strategist (380, GTM ~150)

**Sections:**
- GTM Motion Selection: PLG/Sales-Led/Hybrid decision tree by ACV (from go-to-market)
- ICP Definition: Firmographics, Technographics, Pain/Success indicators, scoring formula (from go-to-market)
- Channel Strategy: Organic/Paid/Outbound/Product channels by stage (from go-to-market)
- Launch Playbooks: Soft/Beta/ProductHunt/Full launches with timelines (from go-to-market + PMM)
- PLG Flywheel: 6-stage model with metrics per stage (from product-strategist)
- Growth Loops: Viral/Content/UGC/Paid/Sales/Partner loops (from go-to-market)
- Sales Enablement: Deck, one-pager, battlecard, demo script, ROI calc (from PMM)
- International Expansion: 5-phase strategy, budget allocation (from PMM)
- PQL Scoring: Formula + implementation guidance (from go-to-market)

**Dedup:** Launch playbooks in PMM + go-to-market — merge into single comprehensive version.

### 8. fundraising-strategy (~400 lines)

**Sources:** fundraising (241) + startup-expertise (362, YC + playbooks portion)

**Sections:**
- Readiness Assessment: Pre-seed/Seed/Series A criteria with weighted scoring (from fundraising)
- Investor Matching: Fit scoring algorithm (stage, industry, check size, geography) (from fundraising)
- Pitch Deck: 12-slide structure with time allocations (from fundraising)
- Data Room: 6-category structure, 15+ document types (from fundraising)
- Term Sheet Analysis: Framework and object model (from fundraising)
- YC Success Factors: 5 factors with weights (30/25/20/15/10) (from expertise)
- YC Application Tips: Clarity, Traction, Insight, Determination, Speed (from expertise)
- Stage-Appropriate Guidance: Idea → Pre-seed → Seed → Series A milestones (from expertise)
- Industry Context: Reference to 19 industry playbooks for investor expectations (from expertise)

**Dedup:** Stage milestones appear in both — keep fundraising's investor-focused version.

## Old Skills → Redirects

Each of the 17 old SKILL.md files becomes a redirect (~10 lines):

```markdown
# [Old Skill Name] — Merged

> **Merged into:** `[new-skill-name]`
> **Location:** `.agents/skills/startup/[new-skill-name]/SKILL.md`

## What Moved
- [Section A] → [new-skill] § [Section X]
- [Section B] → [new-skill] § [Section Y]
```

## Effort Estimate

| Step | Work | Size |
|------|------|------|
| 1. Create 8 new skill directories | mkdir + initial SKILL.md | S |
| 2. Write idea-discovery | Merge 3 sources, dedup brainstorming fluff | M |
| 3. Write market-intelligence | Merge 3 sources, dedup TAM, remove LaTeX | L |
| 4. Write competitive-strategy | Extract from PMM + merge 2 sources | M |
| 5. Write validation-scoring | Merge 3 sources, consolidate scoring | M |
| 6. Write mvp-execution | Merge 3 thin sources, enrich | M |
| 7. Write financial-modeling | Merge 3 sources, heavy unit econ dedup | L |
| 8. Write go-to-market | Extract from PMM + merge 2 sources | M |
| 9. Write fundraising-strategy | Merge 2 sources, dedup stages | M |
| 10. Convert 17 old skills to redirects | 17 × 10-line redirect files | S |
| **Total** | | **2-3 sessions** |

## Acceptance Criteria

- [ ] 8 new skill directories created under `.agents/skills/startup/`
- [ ] Each new SKILL.md is self-contained (no cross-references needed to understand it)
- [ ] All 17 old SKILL.md files converted to redirects (not deleted)
- [ ] No domain knowledge lost — every framework, formula, benchmark preserved
- [ ] Deduplication removes ~1,500 lines of overlap
- [ ] Thin skills enriched (mvp-execution, idea-discovery)
- [ ] Total new skill lines: ~4,000 (down from ~5,500)
- [ ] Build still passes (skills are docs, not code — low risk)
