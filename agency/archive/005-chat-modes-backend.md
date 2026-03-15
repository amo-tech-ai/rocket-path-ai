---
task_id: 010-CMB
title: AI Chat Modes Backend
phase: MVP
priority: P1
status: Not Started
estimated_effort: 1 day
skill: [sales-coach, gemeni]
subagents: [code-reviewer, supabase-expert]
edge_function: ai-chat
schema_tables: []
depends_on: [001-ALR]
---

| Aspect | Details |
|--------|---------|
| **Screens** | AI Chat (backend wiring only) |
| **Features** | 4 specialized chat modes via loadChatMode() |
| **Edge Functions** | `ai-chat` |
| **Real-World** | "AI chat can now switch between Practice Pitch, Growth Strategy, Deal Review, and Canvas Coach modes" |

## Description

**The situation:** The ai-chat edge function (`supabase/functions/ai-chat/index.ts`) uses a single `PUBLIC_SYSTEM_PROMPT` for all conversations. There's no way to specialize the AI's personality or knowledge for different tasks. A founder practicing their pitch gets the same generic AI as one analyzing their growth funnel.

**Why it matters:** Specialized modes dramatically improve AI quality. A Practice Pitch mode that acts like a skeptical investor gives better feedback than a generic assistant. A Growth Strategy mode that knows AARRR funnels suggests better experiments. Four modes cover the key founder workflows: pitching, growing, fundraising, and business modeling.

**What already exists:**
- `supabase/functions/ai-chat/index.ts` — Chat handler with `PUBLIC_SYSTEM_PROMPT`
- `agency/chat-modes/practice-pitch.md` — AI investor persona for pitch practice
- `agency/chat-modes/growth-strategy.md` — Growth strategist with AARRR and ICE
- `agency/chat-modes/deal-review.md` — Deal strategist with MEDDPICC
- `agency/chat-modes/canvas-coach.md` — Canvas coach with behavioral nudges
- `agency/lib/agent-loader.ts` — `loadChatMode()` utility

**The build:**
- Add `mode` field to chat request body (optional, default = 'general')
- Import `loadChatMode` in ai-chat
- When mode != 'general', load the mode prompt and use it as system prompt
- Inject startup context (name, industry, stage) into mode prompt
- General mode = existing behavior (no change)
- Deploy `ai-chat`

**Example:** Sarah selects "Practice Pitch" mode. The chat sends `{ action: 'chat', message: 'Here is my pitch...', mode: 'practice-pitch' }`. The edge function calls `loadChatMode('practice-pitch')`, gets the AI investor persona prompt, prepends startup context, and responds as a skeptical VC: "Your TAM claim of $50B needs a source. Walk me through your bottom-up calculation."

## Rationale
**Problem:** Single generic AI personality for all founder tasks.
**Solution:** 4 specialized modes loaded at runtime via `loadChatMode()`.
**Impact:** Each mode provides domain-specific expertise instead of generic advice.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | select a chat mode | I get specialized AI for my current task |
| Founder | practice my pitch with AI investor | I get realistic investor feedback |
| Founder | plan growth with AI strategist | I get AARRR-structured recommendations |

## Goals
1. **Primary:** 4 chat modes load correctly and produce specialized responses
2. **Quality:** General mode behavior unchanged (backward compatible)

## Acceptance Criteria
- [ ] Request body accepts optional `mode` field
- [ ] `loadChatMode(mode)` loads correct mode prompt
- [ ] Mode prompt replaces system prompt for that conversation
- [ ] Startup context injected into mode prompt
- [ ] General mode (no mode param) works exactly as before
- [ ] Invalid mode falls back to general
- [ ] `ai-chat` deployed

| Layer | File | Action |
|-------|------|--------|
| Edge Function | `supabase/functions/ai-chat/index.ts` | Modify — add mode routing, import loadChatMode |
| Types | `supabase/functions/ai-chat/types.ts` | Modify — add mode field |

## Real-World Examples

**Scenario 1 — Practice Pitch:** Marcus selects Practice Pitch mode and types his 30-second pitch. The AI responds as a skeptical investor: asks about TAM methodology, challenges the competitive moat, requests customer evidence. **With the specialized prompt,** the feedback is dramatically better than "that sounds good!"

**Scenario 2 — Growth Strategy:** Aisha selects Growth Strategy and asks "How should I acquire my first 100 users?" The AI uses the AARRR framework: identifies her funnel stage (Acquisition), suggests 3 ICE-scored channels, and proposes a 2-week experiment for the top channel. **With domain expertise,** she gets actionable growth tactics instead of generic advice.

## Outcomes

| Before | After |
|--------|-------|
| Single generic AI for all conversations | 4 specialized modes with domain expertise |
| Same system prompt regardless of task | Mode-specific prompts with frameworks (MEDDPICC, AARRR, etc.) |
| No startup context in chat | Startup data injected into mode prompts |
| No way to practice specific skills | Practice Pitch mode simulates investor Q&A |
