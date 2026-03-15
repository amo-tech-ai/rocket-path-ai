---
task_id: 014-GSP
title: Growth Strategy Right Panel
phase: POST-MVP
priority: P2
status: Not Started
estimated_effort: 0.5 day
skill: [growth-hacker, design]
subagents: [frontend-designer, code-reviewer]
edge_function: none (frontend only)
schema_tables: []
depends_on: [010-CMB]
---

| Aspect | Details |
|--------|---------|
| **Screens** | AI Chat (right panel in Growth Strategy mode) |
| **Features** | AARRR funnel visualization, ICE-scored experiments, channel chips |
| **Edge Functions** | None (derives from chat response metadata) |
| **Real-World** | "While planning growth, right panel shows AARRR funnel stages and ICE-scored experiment suggestions" |

## Description

**The situation:** Growth Strategy chat mode provides AARRR-framework growth advice as text messages. But there's no visual funnel, no persistent experiment tracker, and no ranked channel recommendations in the right panel.

**Why it matters:** Growth strategy is visual — founders need to see their funnel, compare experiment impact scores, and track which channels to test. The right panel transforms text-based advice into an actionable dashboard.

**What already exists:**
- `src/components/ai/AIPanel.tsx` — 360px right panel
- Task 010/011 add Growth Strategy mode
- `agency/chat-modes/growth-strategy.md` — Growth strategist prompt with AARRR + ICE

**The build:**
- Create `AARRRFunnel` component — 5-stage funnel (Acquisition, Activation, Retention, Revenue, Referral) with current focus highlight
- Create `ICEExperimentCard` component — experiment name + ICE score breakdown
- Create `ChannelRecommendation` component — ranked channel chips
- Wire to right panel when mode = growth-strategy
- Parse AI response metadata for funnel stage, experiments, channels

**Example:** Aisha is in Growth Strategy mode discussing user acquisition. The right panel shows AARRR funnel with "Acquisition" highlighted. Three ICE-scored experiments appear: "LinkedIn thought leadership (ICE 8.1)" > "Product Hunt launch (ICE 7.4)" > "Cold outreach (ICE 5.2)". Channel chips show ranked recommendations below.

## Rationale
**Problem:** Growth advice is text-only — hard to action.
**Solution:** Visual funnel + scored experiments + ranked channels in right panel.
**Impact:** Growth strategy becomes visual and actionable.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | see my AARRR funnel stage | I know where to focus growth efforts |
| Founder | see ICE-scored experiments | I pick the highest-impact experiment |
| Founder | see ranked channels | I know which channels to test first |

## Goals
1. **Primary:** AARRR funnel with current stage highlighted
2. **Secondary:** ICE-scored experiment cards

## Acceptance Criteria
- [ ] `AARRRFunnel` renders 5-stage funnel with active highlight
- [ ] `ICEExperimentCard` shows experiment with ICE breakdown
- [ ] `ChannelRecommendation` shows ranked channel chips
- [ ] Right panel shows growth content only in growth-strategy mode
- [ ] Components handle empty state (no experiments yet)

| Layer | File | Action |
|-------|------|--------|
| Component | `src/components/ai/AARRRFunnel.tsx` | Create |
| Component | `src/components/ai/ICEExperimentCard.tsx` | Create |
| Component | `src/components/ai/ChannelRecommendation.tsx` | Create |
| Panel | `src/components/ai/AIPanel.tsx` | Modify — mode-conditional rendering |

## Real-World Examples

**Scenario 1 — Acquisition focus:** Jake's startup has strong product (Activation 80%) but low traffic (Acquisition 15%). The funnel highlights Acquisition in red. AI suggests 3 experiments. **With the visual funnel,** Jake immediately sees his bottleneck.

**Scenario 2 — Comparing experiments:** Priya has 5 experiment suggestions from the AI. ICE scores range from 3.2 to 8.7. **With ICE cards,** she picks the 8.7 experiment (highest Impact × Confidence × Ease) without second-guessing.

## Outcomes

| Before | After |
|--------|-------|
| Growth advice as text only | Visual AARRR funnel in right panel |
| No experiment prioritization | ICE-scored experiment cards |
| No channel ranking | Ranked channel recommendation chips |
| Same panel for all modes | Growth-specific panel content |
