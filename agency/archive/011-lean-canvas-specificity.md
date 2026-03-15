---
task_id: 009-LCS
title: Lean Canvas Specificity
phase: MVP
priority: P1
status: Not Started
estimated_effort: 0.5 day
skill: [feedback-synthesizer, lean]
subagents: [code-reviewer, frontend-designer]
edge_function: lean-canvas-agent
schema_tables: [lean_canvases]
depends_on: [001-ALR]
---

| Aspect | Details |
|--------|---------|
| **Screens** | Lean Canvas (9-box grid) |
| **Features** | Specificity meter per box, evidence gap markers |
| **Edge Functions** | `lean-canvas-agent` (coach action) |
| **Real-World** | "Each canvas box now shows whether content is Vague, Specific, or Quantified" |

## Description

**The situation:** The lean canvas editor shows 9 boxes (Problem, Customer Segments, Solution, etc.) with text content. The canvas coach provides AI suggestions but doesn't evaluate the specificity or evidence quality of each box's content. A box saying "everyone needs this" and one saying "42% of mid-market HR teams (500-2000 employees) spend $3K/month on manual compliance" look the same.

**Why it matters:** Vague canvases lead to vague strategies. Specificity scoring helps founders see which boxes need more research. Evidence gap markers highlight exactly where the canvas is weak — connecting to the validator's evidence tier system.

**What already exists:**
- `supabase/functions/lean-canvas-agent/index.ts` — 14 actions including coach
- `supabase/functions/lean-canvas-agent/actions/coach.ts` — Canvas coaching with RAG
- `src/pages/LeanCanvas.tsx` — 9-box canvas editor
- `src/components/lean-canvas/CanvasBox.tsx` — Individual box component

**The build:**
- Enhance canvas coach to return optional `specificity_score` per box (vague | specific | quantified)
- Enhance canvas coach to return optional `evidence_gaps: string[]` per box
- Frontend: Specificity meter bar on each canvas box header (red/amber/green)
- Frontend: Evidence gap markers below box content (small amber pills)
- Deploy `lean-canvas-agent`

**Example:** Jake's Lean Canvas has "Problem: Hiring is broken" (specificity: vague, gaps: ["No quantified impact", "No target segment defined"]). After he edits to "42% of Series A startups spend 120+ hours/quarter on hiring, costing $15K in founder time", the coach re-evaluates: specificity → quantified, gaps → empty. The meter turns green.

## Rationale
**Problem:** Canvas box quality is invisible — vague and specific content look the same.
**Solution:** Coach evaluates specificity per box and highlights evidence gaps.
**Impact:** Founders iteratively sharpen their canvas from vague → specific → quantified.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | see specificity level per box | I know which boxes need more research |
| Founder | see evidence gaps | I know exactly what's missing |

## Goals
1. **Primary:** Each canvas box shows a specificity meter
2. **Quality:** Meter updates when coach re-evaluates

## Acceptance Criteria
- [ ] Coach action returns optional `specificity_scores: Record<string, 'vague' | 'specific' | 'quantified'>`
- [ ] Coach action returns optional `evidence_gaps: Record<string, string[]>`
- [ ] Specificity meter displayed on each box header
- [ ] Evidence gap pills shown below box content
- [ ] Old canvases without scores show no meters (backward compat)
- [ ] `lean-canvas-agent` deployed

| Layer | File | Action |
|-------|------|--------|
| Edge Function | `supabase/functions/lean-canvas-agent/actions/coach.ts` | Modify — add specificity evaluation |
| Page | `src/pages/LeanCanvas.tsx` | Modify — wire specificity components |
| Component | `src/components/lean-canvas/CanvasBox.tsx` | Modify — add meter + gap pills |

## Real-World Examples

**Scenario 1 — Progressive improvement:** Aisha starts with vague canvas boxes. All 9 show red meters. She refines "Customer Segments" from "businesses" to "SaaS companies with 50-200 employees". Meter turns amber. She adds "spending $5K-15K/month on customer support tools". Meter turns green (quantified).

**Scenario 2 — Mixed quality:** Priya has strong Problem and Customer boxes (green) but vague Revenue and Channels (red). **With the meters,** she sees at a glance where to focus her next research session.

## Outcomes

| Before | After |
|--------|-------|
| All boxes look the same regardless of quality | Red/amber/green specificity meters |
| No indication of what's missing | Amber evidence gap pills per box |
| Coach gives general advice | Coach evaluates specificity per box |
| No way to track canvas improvement | Meters show progression from vague → quantified |
