---
task_id: 013-PPP
title: Practice Pitch Right Panel
phase: POST-MVP
priority: P2
status: Not Started
estimated_effort: 0.5 day
skill: [sales-coach, design]
subagents: [frontend-designer, code-reviewer]
edge_function: none (frontend only)
schema_tables: []
depends_on: [010-CMB]
---

| Aspect | Details |
|--------|---------|
| **Screens** | AI Chat (right panel in Practice Pitch mode) |
| **Features** | Real-time pitch scoring, score breakdown, objection library |
| **Edge Functions** | None (derives from chat response metadata) |
| **Real-World** | "While practicing pitch, right panel shows live scores for Clarity, Conviction, Data Quality, and Ask" |

## Description

**The situation:** When a founder uses Practice Pitch mode, the chat provides investor-style feedback as messages. But there's no persistent scorecard showing how the pitch is improving across dimensions. The right panel (360px column in DashboardLayout) shows generic AI summary during chat.

**Why it matters:** Real-time scoring creates a game-like improvement loop. Founders see their Clarity score go from 6/10 to 8/10 as they refine their pitch. The objection library gives them pre-prepared answers for the 10 most common investor questions.

**What already exists:**
- `src/components/ai/AIPanel.tsx` — 360px right panel in dashboard layout
- `src/pages/AIChat.tsx` — Chat page
- Task 010/011 add Practice Pitch mode

**The build:**
- Create `PitchScoreCard` component — 4 dimensions: Clarity, Conviction, Data Quality, Ask
- Create `PitchScoreBreakdown` component — expandable details per dimension
- Create `ObjectionLibrary` component — 10 common investor objections with suggested answers
- Wire right panel content to active chat mode (show PitchScoreCard when mode = practice-pitch)
- Parse AI response metadata for score updates (AI returns scores in structured format)

**Example:** Sarah is in Practice Pitch mode. She types her 30-second pitch. The AI scores: Clarity 7/10, Conviction 5/10, Data 6/10, Ask 4/10. She refines her ask from "We're raising" to "We're raising $1.5M at $6M post to hire 3 engineers and reach $50K MRR by Q3." Ask score jumps to 8/10. The right panel shows the improvement live.

## Rationale
**Problem:** No structured feedback during pitch practice.
**Solution:** Real-time scoring panel + objection library.
**Impact:** Founders measurably improve pitch quality over sessions.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | see pitch scores live | I know what to improve next |
| Founder | browse common objections | I prepare answers before investor meetings |

## Goals
1. **Primary:** 4-dimension pitch score card updates after each message
2. **Secondary:** Objection library with 10 common investor questions

## Acceptance Criteria
- [ ] `PitchScoreCard` shows 4 scores (0-10) with animated bars
- [ ] Scores update after each AI response in Practice Pitch mode
- [ ] `ObjectionLibrary` shows 10 objections with toggle-to-reveal answers
- [ ] Right panel shows pitch content only when mode = practice-pitch
- [ ] Other modes show default right panel content

| Layer | File | Action |
|-------|------|--------|
| Component | `src/components/ai/PitchScoreCard.tsx` | Create |
| Component | `src/components/ai/PitchScoreBreakdown.tsx` | Create |
| Component | `src/components/ai/ObjectionLibrary.tsx` | Create |
| Panel | `src/components/ai/AIPanel.tsx` | Modify — mode-conditional rendering |

## Real-World Examples

**Scenario 1 — Score improvement:** Jake practices 5 rounds. Round 1: Clarity 5, Conviction 4, Data 3, Ask 3. Round 5: Clarity 8, Conviction 7, Data 7, Ask 8. **With the scorecard,** he sees concrete improvement and knows exactly when he's ready for the real meeting.

**Scenario 2 — Objection prep:** Priya opens the Objection Library tab. She sees "What if a big player enters your market?" with a suggested framework: acknowledge, differentiate, evidence. She customizes the answer with her specific data.

## Outcomes

| Before | After |
|--------|-------|
| Generic right panel during pitch practice | 4-dimension live scorecard |
| No structured improvement tracking | Scores show progress over messages |
| No objection preparation tool | 10-objection library with answer frameworks |
| Right panel same for all modes | Mode-specific panel content |
