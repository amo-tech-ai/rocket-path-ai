---
task_id: 016-EXO
title: Export Overlays
phase: POST-MVP
priority: P2
status: Not Started
estimated_effort: 0.5 day
skill: [design, startup]
subagents: [frontend-designer, code-reviewer]
edge_function: none (frontend only)
schema_tables: []
depends_on: [004-RUI]
---

| Aspect | Details |
|--------|---------|
| **Screens** | Validator Report PDF, Sprint Board export, Investor Pipeline export |
| **Features** | Evidence tiers in PDF, RICE scores in sprint export, MEDDPICC in pipeline export |
| **Edge Functions** | None (export templates only) |
| **Real-World** | "Exported validator PDF now shows evidence tier badges and bias warnings alongside scores" |

## Description

**The situation:** The validator report has a PDF export, the sprint board can export task lists, and the investor pipeline can export to CSV. But exports don't include agency-enhanced data (evidence tiers, RICE scores, MEDDPICC scores). Users see rich data on screen but get stripped-down exports.

**Why it matters:** Founders share exports with advisors, co-founders, and investors. Without agency data in exports, the consulting-grade quality is lost in the output format.

**What already exists:**
- Validator PDF export (jsPDF in `src/pages/ValidatorReport.tsx`)
- Sprint export (task list)
- Investor export (CSV)
- Tasks 002-004 add evidence tiers, bias flags, ICE channels to report UI
- Tasks 005-007 add RICE, MEDDPICC to other screens

**The build:**
- Validator PDF: add evidence tier labels next to dimension scores
- Validator PDF: add bias flag section (amber highlights)
- Validator PDF: add ICE-scored channels in growth section
- Sprint export: include RICE score and Kano class per task
- Investor export: include meddpicc_score and deal_verdict columns

**Example:** Sarah exports her validation report as PDF. Each dimension score line now reads: "Market: 89/100 [Cited]" instead of just "Market: 89/100". Two bias flags appear in an amber box below the exec summary. Growth channels show ICE scores: "Product-Led Growth (8.3) > Content Marketing (6.7)".

## Rationale
**Problem:** Exports lose agency-enhanced data.
**Solution:** Include evidence tiers, RICE, MEDDPICC in export templates.
**Impact:** Shared exports maintain consulting-grade quality.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | PDF with evidence tiers | advisors see evidence quality |
| Founder | sprint export with RICE | team sees priority scores |
| Founder | investor CSV with MEDDPICC | pipeline export is complete |

## Goals
1. **Primary:** All agency data included in exports
2. **Quality:** Export renders correctly with and without agency data

## Acceptance Criteria
- [ ] Validator PDF includes evidence tier labels per dimension
- [ ] Validator PDF includes bias flag section
- [ ] Validator PDF includes ICE channel scores
- [ ] Sprint export includes RICE score and Kano class columns
- [ ] Investor CSV includes meddpicc_score and deal_verdict columns
- [ ] Exports work for pre-agency data (no tiers → no labels, no crash)

| Layer | File | Action |
|-------|------|--------|
| Page | `src/pages/ValidatorReport.tsx` | Modify — PDF template additions |
| Page | `src/pages/SprintPlan.tsx` | Modify — export column additions |
| Page | `src/pages/Investors.tsx` | Modify — CSV column additions |

## Real-World Examples

**Scenario 1 — Investor meeting prep:** Marcus exports his validation report before a VC meeting. The PDF shows evidence tiers — the investor sees "Market: 89/100 [Cited]" and trusts the data. **With evidence in the export,** the report is self-explanatory.

**Scenario 2 — Old report export:** Priya exports a report from before agency enhancement. No evidence tiers exist. **With graceful handling,** the PDF renders dimension scores without tier labels — same as before.

## Outcomes

| Before | After |
|--------|-------|
| PDF shows scores without evidence quality | Tier labels next to each dimension score |
| No bias warnings in PDF | Amber bias flag section in export |
| Sprint export has no priority scores | RICE + Kano columns in export |
| Investor CSV has no deal scoring | meddpicc_score + deal_verdict columns |
