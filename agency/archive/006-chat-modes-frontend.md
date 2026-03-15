---
task_id: 011-CMF
title: AI Chat Modes Frontend
phase: MVP
priority: P1
status: Not Started
estimated_effort: 0.5 day
skill: [design, sales-coach]
subagents: [frontend-designer, code-reviewer]
edge_function: none (frontend only)
schema_tables: []
depends_on: [010-CMB]
---

| Aspect | Details |
|--------|---------|
| **Screens** | AI Chat (mode selector, header pill, quick actions) |
| **Features** | Mode selector cards, mode indicator, mode-specific quick action chips |
| **Edge Functions** | None (frontend only — sends mode to backend from task 010) |
| **Real-World** | "The chat page shows 4 mode cards before conversation starts, and the active mode as a pill in the header" |

## Description

**The situation:** The AI chat page (`/ai-chat`) shows a single conversation thread with a text input. Task 010 adds backend support for 4 modes. The frontend needs a way for users to select and switch modes, see which mode is active, and access mode-specific quick actions.

**Why it matters:** The mode selector is the visible entry point to the agency-enhanced chat experience. Without it, users don't know specialized modes exist. Quick action chips (e.g., "Score my pitch" in Practice Pitch mode) guide users toward the mode's capabilities.

**What already exists:**
- `src/pages/AIChat.tsx` — Chat page with message thread
- `src/components/ai/AIChatInput.tsx` — Chat input with auto-resize
- `src/components/ai/AIPanel.tsx` — Persistent AI panel in dashboard

**The build:**
- Create `ChatModeSelector` — 4 cards with mode name, icon, description
- Create `ChatModePill` — small pill in chat header showing active mode
- Create `ChatModeQuickActions` — mode-specific suggestion chips
- Wire mode state to chat input (sends `mode` param to backend)
- Mode selection persists in component state (not localStorage — one session scope)
- "Switch mode" button in chat header to return to selector

**Example:** Sarah opens `/ai-chat`. She sees 4 cards: Practice Pitch (microphone icon), Growth Strategy (rocket icon), Deal Review (chart icon), Canvas Coach (layout icon). She clicks Practice Pitch. The header shows a blue "Practice Pitch" pill. Quick actions appear: "Score my pitch", "Common objections", "Improve my ask". She types her pitch and gets investor-quality feedback.

## Rationale
**Problem:** No way to select or see active chat modes in the UI.
**Solution:** Mode selector, header pill, and quick action chips.
**Impact:** Users discover and use specialized modes instead of defaulting to generic chat.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | pick a chat mode from 4 cards | I get specialized AI for my task |
| Founder | see which mode I'm in | I know the AI's current expertise |
| Founder | quick action chips per mode | I discover what the mode can do |

## Goals
1. **Primary:** Mode selector UI with 4 cards + mode pill in header
2. **Quality:** Mode-specific quick actions guide users

## Acceptance Criteria
- [ ] `ChatModeSelector` renders 4 mode cards with icons and descriptions
- [ ] Selecting a mode sends `mode` param with chat messages
- [ ] `ChatModePill` shows active mode in chat header
- [ ] `ChatModeQuickActions` shows 3-4 chips per mode
- [ ] "Switch mode" button returns to selector
- [ ] Default (no selection) uses general mode
- [ ] Mobile responsive: cards stack vertically on small screens

| Layer | File | Action |
|-------|------|--------|
| Component | `src/components/ai/ChatModeSelector.tsx` | Create |
| Component | `src/components/ai/ChatModePill.tsx` | Create |
| Component | `src/components/ai/ChatModeQuickActions.tsx` | Create |
| Page | `src/pages/AIChat.tsx` | Modify — integrate mode components |
| Hook | `src/hooks/useAIChat.ts` | Modify — add mode param to requests |

## Real-World Examples

**Scenario 1 — First visit:** Jake opens AI Chat for the first time. Instead of an empty chat, he sees 4 mode cards with descriptions. He picks "Growth Strategy" and immediately sees chips: "Plan user acquisition", "Design an experiment", "Analyze my funnel". **With the selector,** he discovers capabilities he didn't know existed.

**Scenario 2 — Mode switch:** Priya is in Practice Pitch mode but wants growth advice. She clicks "Switch mode" in the header, returns to the selector, picks Growth Strategy. The chat clears (mode switch = new conversation). **With mode switching,** she moves between tasks without leaving the chat.

## Outcomes

| Before | After |
|--------|-------|
| Empty chat with generic input | 4 mode cards with icons and descriptions |
| No indication of AI personality | Mode pill in header shows active mode |
| No guided actions per mode | 3-4 quick action chips per mode |
| No way to switch modes | "Switch mode" button in header |
