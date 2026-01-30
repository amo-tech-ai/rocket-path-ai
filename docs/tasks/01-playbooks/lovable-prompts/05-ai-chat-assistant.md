---
task_number: "05"
title: "AI Chat Assistant"
category: "AI"
subcategory: "AI Chatbot"
phase: 2
priority: "P1"
status: "Open"
percent_complete: 10
owner: "Frontend Developer"
---

# Lovable Prompt: AI Chat Assistant

## Summary Table

| Aspect | Details |
|--------|---------|
| **Screen** | `/app/chat` - AI Assistant chat interface |
| **Features** | Conversational AI, context-aware suggestions, prompt pack execution, action buttons |
| **Agents** | Chat Agent (Claude Sonnet), Intent Router (Gemini Flash), Action Executor (Gemini Pro) |
| **Use Cases** | Quick questions, strategy advice, task generation, competitive analysis |
| **Duration** | Ongoing conversations |
| **Outputs** | Responses, generated artifacts, executed actions |

---

## Description

Build a conversational AI chat assistant that understands the founder's startup context and provides intelligent, actionable responses. The chat can execute prompt packs, generate artifacts (tasks, canvas updates, pitch content), and route to appropriate AI agents based on intent.

---

## Purpose & Goals

**Purpose:** Give founders a single interface to ask anything about their startup and get expert-level, contextual responses.

**Goals:**
1. Understand natural language queries about the startup
2. Route to appropriate AI agent based on intent
3. Execute prompt packs conversationally
4. Generate artifacts that save directly to the database
5. Provide industry-specific advice using playbook knowledge

**Outcomes:**
- 80% of questions answered without leaving chat
- Generated artifacts automatically save to relevant tables
- Chat history persists and informs future responses
- Actions clearly labeled as AI-generated with undo option

---

## Real World Examples

**Example 1: Maria - Quick Competitive Analysis**
> Maria types: "Who are my main competitors in cross-border payments?"
> The AI routes to the Market Research agent, pulls her FinTech industry context, and returns a structured competitor analysis with positioning map.

**Example 2: James - Task Generation**
> James types: "What should I do this week to prepare for my investor meeting?"
> The AI recognizes the intent, pulls his fundraising stage, and generates 5 prioritized tasks that save to his task list with one click.

**Example 3: Sarah - Canvas Refinement**
> Sarah types: "Help me improve my value proposition for Enterprise buyers"
> The AI pulls her current canvas, applies B2B SaaS playbook best practices, and suggests refined value prop language with "Apply to Canvas" button.

---

## 3-Panel Layout

### Left Panel: Context

| Element | Content |
|---------|---------|
| **Conversation List** | Past conversations with titles |
| **Startup Context** | Current industry, stage, profile summary |
| **Quick Actions** | "New Chat", "Clear History" |
| **Prompt Pack Shortcuts** | Frequently used packs |
| **Recent Artifacts** | Tasks, canvas updates generated |

### Main Panel: Work Area

| Element | Content |
|---------|---------|
| **Chat History** | Scrollable conversation thread |
| **Message Bubbles** | User (right), AI (left), different styling |
| **Typing Indicator** | Shows when AI is thinking |
| **Input Field** | Multiline textarea with send button |
| **Suggested Follow-ups** | 3 chips after each AI response |
| **Artifact Cards** | Embedded tasks, canvas sections, pitch content with action buttons |

### Right Panel: Intelligence

| Element | Behavior |
|---------|----------|
| **Active Agent** | Shows which agent is responding |
| **Context Used** | "Using: FinTech playbook, $200K MRR" |
| **Related Prompts** | Prompt packs relevant to conversation |
| **Sources** | Links to playbook sections, documents |
| **Action Log** | History of executed actions |
| **Undo Stack** | Recent AI actions with undo buttons |

---

## Frontend/Backend Wiring

### Frontend Components

| Component | Purpose |
|-----------|---------|
| `ChatContainer` | Main chat layout with panels |
| `MessageList` | Scrollable conversation history |
| `MessageBubble` | Individual message with formatting |
| `ChatInput` | Multiline input with send |
| `ArtifactCard` | Embedded generated artifact |
| `ActionButton` | "Save to Tasks", "Apply to Canvas" |
| `AgentIndicator` | Current agent avatar and name |
| `ContextPanel` | Right panel intelligence display |

### Backend Edge Functions

| Function | Trigger | Input | Output |
|----------|---------|-------|--------|
| `chat-agent` | Message send | message, conversation_id, context | response, artifacts, actions |
| `intent-router` | Message send | message | intent, agent_slug, confidence |
| `prompt-pack` | Intent detected | pack_slug, inputs | structured output |
| `artifact-saver` | Action click | artifact_type, data | saved record |

### Data Flow

```
User Message → Intent Router → Agent Selection → AI Processing → Response
      ↓            ↓               ↓                ↓              ↓
  Textarea    Gemini Flash    chat-agent     Gemini/Claude    Stream
      ↓            ↓               ↓                ↓              ↓
  Optimistic   Intent + route   Industry context   Artifacts    Display
  UI update                      injection                     + actions
```

---

## Supabase Schema Mapping

| Table | Fields Used | When Updated |
|-------|-------------|--------------|
| `ai_runs` | `action=chat`, `input_text`, `output_text`, `context_tokens` | Every message |
| `conversations` | `id`, `user_id`, `title`, `last_message_at` | Conversation start, each message |
| `messages` | `conversation_id`, `role`, `content`, `artifacts` | Every message |
| `tasks` | Created via chat | When "Save as Task" clicked |
| `lean_canvases` | Updated via chat | When "Apply to Canvas" clicked |

---

## Edge Function Mapping

| Action | Function | Model | Knowledge Slice |
|--------|----------|-------|-----------------|
| `route_intent` | intent-router | Gemini 3 Flash | None |
| `chat_response` | chat-agent | Claude Sonnet | Full playbook for industry |
| `generate_tasks` | prompt-pack | Gemini 3 Pro | stage_checklists |
| `analyze_competition` | prompt-pack | Gemini 3 Pro | terminology, benchmarks |
| `refine_canvas` | prompt-pack | Claude Sonnet | success_stories |

---

## AI Agent Behaviors

### Intent Router

- **Trigger:** Every user message
- **Autonomy:** Background (user doesn't see routing)
- **Behavior:** Classifies intent, selects agent, extracts entities
- **Output:** `{ intent: string, agent: string, entities: {}, confidence: number }`

### Chat Agent

- **Trigger:** After intent routing
- **Autonomy:** Act freely (responds conversationally)
- **Behavior:** Generates response using context, may produce artifacts
- **Output:** `{ response: string, artifacts: [], suggested_actions: [] }`

### Action Executor

- **Trigger:** User clicks action button
- **Autonomy:** Act with approval (confirms before saving)
- **Behavior:** Saves artifact to appropriate table
- **Output:** `{ success: boolean, record_id: string, undo_token: string }`

---

## Intent Classification

| Intent | Example Query | Agent | Action |
|--------|---------------|-------|--------|
| `ask_strategy` | "How should I approach enterprise sales?" | Strategy Advisor | Response only |
| `generate_tasks` | "What should I do this week?" | Task Generator | Response + task artifacts |
| `analyze_market` | "Who are my competitors?" | Market Analyst | Response + analysis card |
| `refine_canvas` | "Improve my value proposition" | Canvas Builder | Response + canvas update |
| `prepare_pitch` | "Help me pitch to investors" | Pitch Coach | Response + pitch content |
| `clarify_concept` | "What is unit economics?" | Educator | Response only |

---

## Acceptance Criteria

- [ ] Intent routing works with 90%+ accuracy
- [ ] Responses stream in real-time (not wait for full response)
- [ ] Artifacts display as cards with action buttons
- [ ] "Save to Tasks" creates task in tasks table
- [ ] "Apply to Canvas" updates lean_canvases table
- [ ] Undo works for all artifact actions
- [ ] Conversation history persists across sessions
- [ ] Industry context injected into all responses
- [ ] Mobile responsive (full-width chat on mobile)
- [ ] Keyboard shortcuts: Enter to send, Shift+Enter for newline

---

## Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| `conversations` and `messages` tables | ✅ Ready | RLS policies in place |
| `chat-agent` edge function | 🔄 Needed | To be created |
| `intent-router` edge function | 🔄 Needed | To be created |
| Claude Sonnet API | ✅ Ready | For quality responses |
| Gemini 3 Flash API | ✅ Ready | For fast routing |
| Streaming response support | ✅ Ready | Supabase Edge Functions support SSE |
