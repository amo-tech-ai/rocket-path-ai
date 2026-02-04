# 106 - Validation Report

> Generate 14-section validation reports with TAM/SAM/SOM and factor scores

---

| Aspect | Details |
|--------|---------|
| **Screens** | Validator (3-panel layout) |
| **Features** | 14-section report, executive summary, verdict, TAM/SAM/SOM, factor scores |
| **Agents** | Generator (lean-canvas-agent) |
| **Edge Functions** | /lean-canvas-agent (action: validate) |
| **Use Cases** | Comprehensive startup validation, investor-ready reports |
| **Real-World** | "Founder clicks 'Generate Report' → 14-section analysis in <60s" |

---

```yaml
---
task_id: 106-VAL
title: Validation Report
diagram_ref: D-07
phase: MVP
priority: P0
status: Complete
skill: /validation-lab
ai_model: gemini-3-pro-preview
subagents: [frontend-designer, supabase-expert, code-reviewer]
edge_function: lean-canvas-agent
schema_tables: [validation_reports, validation_sections]
depends_on: [105-vector-db]
---
```

---

## Description

Build a comprehensive 14-section validation report system that matches IdeaProof quality. Includes executive summary with verdict (GO/CAUTION/NO-GO), 7-dimension scoring, TAM/SAM/SOM visualization, highlights & red flags, and market/execution factor breakdown.

## Rationale

**Problem:** Current validation is shallow, doesn't match competitor quality.
**Solution:** 14-section structured report with industry benchmarks.
**Impact:** Founders get investor-ready validation reports.

---

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | get a comprehensive validation | I know if my idea is viable |
| Founder | see TAM/SAM/SOM numbers | I can communicate market size |
| Founder | understand my red flags | I can address weaknesses |
| Investor | review structured report | I can quickly assess the opportunity |

## Real-World Example

> Sarah clicks "Generate Validation Report" after completing her canvas.
> 45 seconds later, she sees:
> - **Verdict:** CAUTION (68/100)
> - **Highlights:** Strong problem clarity, unique solution
> - **Red Flags:** No customer validation yet, crowded market
> - **TAM:** $12B → **SAM:** $1.2B → **SOM:** $120M

---

## Goals

1. **Primary:** Generate 14-section validation report
2. **Secondary:** Include TAM/SAM/SOM visualization
3. **Quality:** Report generation <60 seconds

## Acceptance Criteria

- [x] Report has 14 sections (see structure below)
- [x] Executive summary with GO/CAUTION/NO-GO verdict
- [x] 7-dimension scoring (0-10 each)
- [x] TAM/SAM/SOM with visualization
- [x] Highlights column (strengths)
- [x] Red flags column (concerns)
- [x] Market factors breakdown
- [x] Execution factors breakdown
- [x] Citations from knowledge_chunks
- [x] Generation time <60 seconds
- [x] Report persists to database
- [x] Mobile responsive layout
- [x] Animated generation progress UI

---

## Report Structure (14 Sections)

| # | Section | Content |
|---|---------|---------|
| 1 | Executive Summary | Verdict, score, 3-sentence summary |
| 2 | Problem Analysis | Clarity, urgency, frequency |
| 3 | Solution Assessment | Uniqueness, feasibility, 10x factor |
| 4 | Market Size | TAM, SAM, SOM with methodology |
| 5 | Competition | Direct, indirect, alternatives |
| 6 | Business Model | Revenue streams, unit economics |
| 7 | Go-to-Market | Channels, acquisition strategy |
| 8 | Team Assessment | Founder-market fit, gaps |
| 9 | Timing Analysis | Why now, market readiness |
| 10 | Risk Assessment | Top 5 risks, mitigation |
| 11 | Financial Projections | 3-year forecast assumptions |
| 12 | Validation Status | Customer evidence, traction |
| 13 | Recommendations | Next 3 actions |
| 14 | Appendix | Sources, methodology, benchmarks |

---

## 7-Dimension Scoring

| Dimension | Weight | Factors |
|-----------|--------|---------|
| Problem Clarity | 15% | Pain severity, frequency, urgency |
| Solution Strength | 15% | Uniqueness, feasibility, defensibility |
| Market Size | 15% | TAM, SAM, SOM, growth rate |
| Competition | 10% | Differentiation, barriers |
| Business Model | 15% | Unit economics, scalability |
| Team Fit | 15% | Domain expertise, execution ability |
| Timing | 15% | Market readiness, trends |

---

## Schema

### Table: validation_reports

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| startup_id | uuid | FK → startups, NOT NULL |
| user_id | uuid | FK → auth.users, NOT NULL |
| verdict | text | CHECK IN ('go', 'caution', 'no_go') |
| overall_score | integer | CHECK 0-100 |
| dimension_scores | jsonb | NOT NULL |
| tam | bigint | |
| sam | bigint | |
| som | bigint | |
| highlights | text[] | |
| red_flags | text[] | |
| created_at | timestamptz | default now() |

### Table: validation_sections

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| report_id | uuid | FK → validation_reports |
| section_number | integer | 1-14 |
| title | text | NOT NULL |
| content | text | NOT NULL |
| score | integer | 0-10, nullable |
| citations | jsonb | array of source references |

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Migration | `supabase/migrations/xxx_validation_reports.sql` | Create |
| Types | `src/types/validation.ts` | Create |
| Hook | `src/hooks/useValidationReport.ts` | Create |
| Component | `src/components/validator/ReportViewer.tsx` | Create |
| Component | `src/components/validator/ExecutiveSummary.tsx` | Create |
| Component | `src/components/validator/TAMChart.tsx` | Create |
| Component | `src/components/validator/DimensionScores.tsx` | Create |
| Component | `src/components/validator/HighlightsRedFlags.tsx` | Create |
| Edge Function | `supabase/functions/lean-canvas-agent/actions/validation.ts` | Modify |

---

## TAM/SAM/SOM Visualization

```
┌─────────────────────────────────────┐
│           TAM: $12B                 │
│    ┌───────────────────────┐        │
│    │      SAM: $1.2B       │        │
│    │  ┌───────────────┐    │        │
│    │  │  SOM: $120M   │    │        │
│    │  └───────────────┘    │        │
│    └───────────────────────┘        │
└─────────────────────────────────────┘
```

---

## Verdict Logic

```typescript
function calculateVerdict(score: number): 'go' | 'caution' | 'no_go' {
  if (score >= 75) return 'go';
  if (score >= 50) return 'caution';
  return 'no_go';
}
```

| Verdict | Score | Color | Message |
|---------|-------|-------|---------|
| GO | 75-100 | Green | "Strong foundation, proceed with confidence" |
| CAUTION | 50-74 | Yellow | "Address red flags before scaling" |
| NO-GO | 0-49 | Red | "Significant pivot or validation needed" |

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Incomplete canvas data | Generate partial report, flag missing sections |
| AI generation timeout | Show progress, allow retry |
| Very niche market | Flag low TAM, suggest adjacent markets |
| No competition found | Flag as risk (market may not exist) |

---

## Verification

```bash
npm run lint
npm run typecheck
npm run build

# Manual testing
- Generate report from complete canvas
- Verify 14 sections render
- Check TAM/SAM/SOM chart displays
- Verify dimension scores calculate correctly
- Test mobile responsiveness
- Confirm report saves to database
```

---

## Validator audit alignment

**Question:** Does this prompt fulfill the validator audit (tasks/audit/02-tasks-audit.md) and validator plan (tasks/docs/101-validator-plan.md)?

**Short answer:** **Partially.** 106 delivers the **report output** and a **simplified schema**; it does **not** implement the full 31-table / 6-agent / 8-screen vision.

| Area | 106-validation.md (this prompt) | Validator plan / audit |
|------|---------------------------------|-------------------------|
| **Schema** | 2 tables: `validation_reports`, `validation_sections` | 31 tables: `ideas`, `idea_summaries`, `idea_validation_scores`, `idea_market_analysis`, `idea_competitors`, `idea_unit_economics`, `idea_roadmap_*`, etc. |
| **Report content** | ✅ 14 sections, verdict (GO/CAUTION/NO-GO), 7 dimensions, TAM/SAM/SOM, highlights/red flags, citations | ✅ Aligned with IdeaProof quality (01-idea-proof, 01-validate) |
| **Agents** | 1: lean-canvas-agent (action: validate) | 6: Onboarding, Validation, Market Research, Competitor, Financial, Roadmap |
| **Edge functions** | 1: /lean-canvas-agent | 12: validation-agent, market-research-agent, competitor-agent, financial-agent, roadmap-agent, chat-agent, idea-extractor, score-calculator, benchmark-lookup, etc. |
| **Screens** | 1: Validator 3-panel (report view) | 8: Idea Input Wizard, Validation Dashboard, Market Analysis, Competitor Intelligence, Financial Projections, Roadmap Builder, Risk Assessment, AI Chat Coach |
| **Input modes** | Canvas → Generate Report | Quick Form, Chat Validator, Full Wizard (101-validator-plan) |

**Audit recommendation (02-tasks-audit.md §2):** *"Align PRD §6 with actual validator schema — either implement '31 tables' or change PRD to describe current Coach + validation_runs model."*

**To fulfill the full validator audit you can either:**
1. **Expand:** Add prompts/tasks for the 31-table schema, 6 agents, 12 EFs, and 8 screens (per 101-validator-plan, 12-industry-agents, 01-idea-validation-guide, 20-saas).
2. **Document as phased:** State in PRD/plan that **Phase 1** = report-only (106 + validation_reports/sections + existing validation_runs/verdicts + Coach tables); **Phase 2** = full idea_* schema and multi-agent platform.

**References:** tasks/docs/101-validator-plan.md, tasks/docs/validator/01-idea-proof.md, tasks/docs/validator/01-validate.md, tasks/docs/agents/12-industry-agents.md, tasks/audit/02-tasks-audit.md.

---

## Codebase References

| Pattern | Reference |
|---------|-----------|
| Report generation | `supabase/functions/lean-canvas-agent/` |
| Chart components | `src/components/` (existing charts) |
| 3-panel layout | `src/components/validator/` |
