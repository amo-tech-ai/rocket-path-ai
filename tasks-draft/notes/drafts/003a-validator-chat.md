---
task_id: 003a-CHT
title: Validator Chat & Conversation Flow
diagram_ref: D-03
phase: CORE
priority: P1
status: Done
skill: /feature-dev
ai_model: gemini-3-flash-preview
subagents: [code-reviewer, frontend-designer]
edge_function: validator-followup
schema_tables: [validation_sessions]
depends_on: []
---

# 003a - Validator Chat & Conversation Flow

> Chat input screen, follow-up questions, suggestion chips, idea extraction

**Parent:** [003-validator-flow.md](003-validator-flow.md) (split into 003a/003b/003c)

---

## Scope Guard

**Already shipped (v1.0):** Chat UX, follow-up questions, suggestion chips, typing indicator, send button.
**Introduce in v1.1:** Voice input, character count enforcement, chat history persistence across sessions.
**Do NOT build:** Real-time collaborative chat, multi-user conversations.

---

## Overview

The chat screen is the entry point for idea validation. Users describe their startup idea in natural language. An AI coach asks 1-2 follow-up questions to clarify problem, customer, and solution. Once enough info is gathered, the user triggers validation.

---

## User Journey (Steps 1-2)

**Step 1: Entry Point**
User clicks "Validate My Idea" from dashboard or navigation. They arrive at a welcoming chat interface.

**Step 2: Conversation**
AI coach greets user and asks about their startup idea. User describes their concept in natural language. Coach may ask 1-2 follow-up questions to clarify problem, customer, or solution.

---

## Screen 1: Chat Validator Input

**Header Area**
- Logo in top left corner
- "Idea Validator" title centered
- Close or back button in top right

**Chat Area (Main Content)**
- Full height scrollable message container
- AI messages appear on left with coach avatar
- User messages appear on right in brand color bubbles
- Typing indicator shows when AI is preparing response
- Timestamp shown beneath each message group

**Input Area (Fixed Bottom)**
- Large text input spanning most of width
- Placeholder text: "Describe your startup idea..."
- Send button with arrow icon on right side
- Character count showing "0/500 recommended"

**Suggestion Chips (Above Input)**
- Quick prompt examples appear before user types
- "AI tool for small business"
- "Marketplace connecting X and Y"
- "SaaS platform for industry"
- Chips disappear once user starts typing

---

## Chat Content

**Welcome Message**
"Hi! I'm your validation coach. Tell me about your startup idea - what problem are you solving and who are you solving it for?"

**Follow-up Questions (AI selects 1-2 based on missing info)**
- "Who specifically experiences this problem?"
- "How are people currently solving this?"
- "What makes your solution different?"
- "How would customers pay for this?"
- "Have you talked to potential customers yet?"

**Confirmation Message**
"Great, I have a clear picture of your idea. Ready to run the validation analysis? This will take about 30 seconds."

**Processing Started Message**
"Analyzing now... I'm researching your market, checking competition, and calculating viability scores."

---

## AI Agents (Chat Phase)

### Agent 1: Chat Coach Agent

**Purpose:** Guide the user through describing their idea and extract key information

**Capabilities:**
- Natural conversation about startup ideas
- Asking clarifying follow-up questions
- Recognizing when enough information is gathered
- Extracting structured data from unstructured chat
- Suggesting a startup name from the description

**Behavior:**
- Friendly, encouraging tone
- Asks one question at a time
- Acknowledges user responses before asking more
- Limits to 2-3 follow-up questions maximum
- Confirms readiness before triggering validation

### Agent 2: Idea Analyzer Agent

**Purpose:** Parse the chat conversation and extract structured idea components

**Capabilities:**
- Identifying problem statement from text
- Extracting customer segment
- Recognizing solution approach
- Detecting mentioned competitors or alternatives
- Categorizing industry and business model type

**Behavior:**
- Works behind the scenes (not user-facing)
- Runs when validation is triggered
- Outputs structured data for pipeline agents

---

## Data Captured from Chat

**User Input Data**
- Problem description (text from user messages)
- Customer segment (extracted from conversation)
- Current solutions mentioned
- Differentiators described
- Revenue model if mentioned
- Team background if mentioned

**AI Extracted Data**
- Startup name (suggested from description)
- Industry category
- Business model type
- Target customer persona
- Key pain points
- Proposed solution summary

---

## Workflow: Chat to Validation Trigger

**Trigger:** User clicks "Validate Now" in chat

**Steps:**
1. Chat coach agent confirms user is ready
2. System captures all chat messages
3. Navigate to processing/progress screen
4. Hand off extracted data to pipeline (see 003b)

**Error Handling:**
- If extraction fails: Show error, offer retry with prompts

---

## Frontend Functions (Chat)

- sendMessage: Submit user message to chat
- receiveMessage: Display AI response in chat
- showTypingIndicator: Show AI is preparing response
- extractSuggestions: Display prompt suggestion chips
- triggerValidation: Start the validation process

---

## Database: Chat Session

**chat_sessions (subset of validation_sessions)**
- Session identifier links to validation
- Message history preserved
- Extracted data from conversation
- Can resume or reference later

---

## Edge Function Reference

- **validator-followup**: Handles AI follow-up question generation (Gemini Flash, 25s timeout)
- Prompt: `supabase/functions/validator-followup/prompt.ts`
- Schema: `supabase/functions/validator-followup/schema.ts`
- 8 coverage topics: problem, customer, competitors, websites, innovation, uniqueness, demand, research

---

## Files Reference

| File | Purpose |
|------|---------|
| `src/pages/ValidateIdea.tsx` | Chat page |
| `src/components/validator/chat/ValidatorChat.tsx` | Chat component |
| `src/components/validator/chat/ValidatorChatInput.tsx` | Input component |
| `src/components/validator/chat/ContextPanel.tsx` | Side context panel |
| `src/components/validator/chat/ExtractionPanel.tsx` | Extraction display |
| `src/hooks/useValidatorFollowup.ts` | Follow-up hook |
| `supabase/functions/validator-followup/` | Follow-up edge function |

---

## Success Criteria

- [ ] Chat screen loads with welcome message
- [ ] User can type and send messages
- [ ] AI responds with follow-up questions based on missing info
- [ ] Suggestion chips appear before first message, disappear after
- [ ] "Validate Now" button triggers navigation to progress screen
- [ ] Chat messages persist during session

---

## Production Ready Checklist

- [ ] `npm run build` passes (no new errors)
- [ ] `npm run test` passes (no regressions)
- [ ] New component renders without console errors
- [ ] Loading, error, empty states handled
- [ ] Works on desktop (1280px+) and mobile (375px)
- [ ] Data persists after page refresh
- [ ] RLS policies verified (if new tables)
- [ ] Edge function deployed and responds 200 (if applicable)
- [ ] No secrets in client code

## Regression Checklist

> Verify existing features still work after this task.

- [ ] Validator: Chat → Progress → Report flow works
- [ ] Lean Canvas: Auto-populate from report works
- [ ] Dashboard: Loads without errors
- [ ] Auth: Login/logout works
- [ ] Onboarding: Wizard completes

## Testing

- [ ] Unit tests for new hooks/utilities
- [ ] Manual test: happy path works end-to-end
- [ ] Manual test: error/empty states handled
- [ ] No console errors in browser DevTools
