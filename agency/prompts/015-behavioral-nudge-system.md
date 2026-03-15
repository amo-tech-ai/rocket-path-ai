---
task_id: 015-BNS
title: Behavioral Nudge System
phase: POST-MVP
priority: P2
status: Not Started
estimated_effort: 1 day
skill: [behavioral-nudge, design]
subagents: [frontend-designer, code-reviewer]
edge_function: none (client-side only)
schema_tables: []
depends_on: [005-SRK]
---

| Aspect | Details |
|--------|---------|
| **Screens** | Dashboard, Lean Canvas, Sprint Board |
| **Features** | Contextual nudge banners, trigger conditions, dismiss/snooze |
| **Edge Functions** | None (pure client-side state) |
| **Real-World** | "When sprint tasks haven't moved in 7 days, an amber banner says 'Your sprint is stale — review your tasks'" |

## Description

**The situation:** Founders often start strong but lose momentum. They fill out their lean canvas once and never revisit it. Sprint tasks go stale. Validation reports gather dust. There's no system that detects these patterns and proactively nudges founders back on track.

**Why it matters:** Behavioral nudges increase user engagement by 30-40% (per behavioral-nudge skill research). Contextual prompts — not annoying pop-ups, but relevant banners that appear when the system detects inaction — keep founders executing their strategy.

**What already exists:**
- Dashboard, Lean Canvas, Sprint Board pages
- `agency/mermaid/07-behavioral-nudge-system.md` — Mermaid diagram of trigger conditions and nudge types
- `.agents/skills/behavioral-nudge/SKILL.md` — Behavioral nudge engine patterns

**The build:**
- Create `NudgeBanner` component — 3 types: progress (green), suggestion (blue), warning (amber)
- Create `useNudgeState` hook — evaluates trigger conditions on page load
- 5 trigger conditions: empty canvas box, stale sprint (7d), low coverage (<50%), no validation run, incomplete profile (<80%)
- State in localStorage: dismissed triggers (permanent) and snoozed triggers (24h TTL)
- CTA buttons navigate to relevant screens
- Wire into Dashboard, Lean Canvas, Sprint Board

**Example:** Jake hasn't moved any sprint tasks in 10 days. He opens the Sprint Board. An amber banner appears: "Your sprint hasn't had activity in 10 days. Review your tasks or regenerate priorities." CTA button: "Review Sprint". He clicks, reviews 3 tasks, marks one done. Banner disappears.

## Rationale
**Problem:** Founders lose momentum without proactive reminders.
**Solution:** Contextual banners triggered by inaction patterns.
**Impact:** Nudges keep founders engaged with their startup execution.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | see when my sprint is stale | I stay accountable |
| Founder | see when my canvas has gaps | I know what to fill in |
| Founder | dismiss or snooze nudges | I control the interruption level |

## Goals
1. **Primary:** 5 trigger conditions produce contextual nudge banners
2. **Quality:** Nudges appear only on relevant screens, never block workflow

## Acceptance Criteria
- [ ] `NudgeBanner` renders in 3 styles (progress/suggestion/warning)
- [ ] 5 triggers evaluated on page load
- [ ] Dismiss permanently hides that trigger's nudge
- [ ] Snooze hides for 24 hours (localStorage timestamp)
- [ ] CTA navigates to relevant screen
- [ ] Wired into Dashboard, Lean Canvas, Sprint Board
- [ ] No database table needed — pure localStorage

| Layer | File | Action |
|-------|------|--------|
| Component | `src/components/nudge/NudgeBanner.tsx` | Create |
| Hook | `src/hooks/useNudgeState.ts` | Create |
| Page | `src/pages/Dashboard.tsx` | Modify — add nudge banner |
| Page | `src/pages/LeanCanvas.tsx` | Modify — add nudge banner |
| Page | `src/pages/SprintPlan.tsx` | Modify — add nudge banner |

## Real-World Examples

**Scenario 1 — Empty canvas:** Aisha's lean canvas has 3 empty boxes (Revenue Streams, Cost Structure, Key Metrics). On the Lean Canvas page, a blue suggestion banner says: "3 canvas boxes need attention — fill in Revenue Streams, Cost Structure, and Key Metrics." She fills them in; banner disappears.

**Scenario 2 — No validation:** Priya created her startup profile 2 weeks ago but never ran validation. On the Dashboard, a green progress banner says: "You haven't validated your idea yet — run the validator to get your startup score." CTA: "Validate my idea".

## Outcomes

| Before | After |
|--------|-------|
| No proactive engagement prompts | 5 trigger-based contextual nudges |
| Founders forget to revisit canvas/sprint | Banners remind them when action is needed |
| No dismiss/snooze control | Users control interruption level |
| All pages show same static content | Screen-specific nudges (Dashboard/Canvas/Sprint) |
