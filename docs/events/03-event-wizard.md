# Event Wizard Screen

**Route:** `/app/events/new`  
**Screen Type:** Wizard  
**Classification:** 4-Step Wizard (Modal or Full Page)

---

## Description

AI-powered 4-step wizard that transforms event goals into comprehensive execution plans with 50+ tasks, timeline, and recommendations. Steps: Context → Strategy → Logistics → Review.

---

## Purpose & Goals

**Purpose:** Reduce event planning from weeks to hours with AI-generated task lists, timeline, conflict detection, and feasibility analysis.

**Goals:**
- Reduce event planning from weeks to hours (4 steps, ~5 minutes)
- AI-generated task lists and timeline automatically
- Conflict detection (holidays, conferences, overlaps)
- Feasibility analysis (budget vs goals)
- Generate 50+ actionable tasks with dependencies

---

## Wireframe

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         CREATE NEW EVENT                              ✕      │
│──────────────────────────────────────────────────────────────────────────────│
│                                                                              │
│    ●━━━━━━━━━○━━━━━━━━━○━━━━━━━━━○                                          │
│    Context    Strategy   Logistics  Review                                   │
│                                                                              │
│  ┌────────────────────────────────────────┐  ┌────────────────────────────┐ │
│  │ STEP 1: EVENT CONTEXT                  │  │ AI ASSISTANT 🤖            │ │
│  │                                        │  │                            │ │
│  │ Event Name *                           │  │ "I'll help you plan your   │ │
│  │ ┌──────────────────────────────────┐  │  │  event! Start with a name  │ │
│  │ │ Q1 Demo Day 2024                 │  │  │  and I'll suggest the best │ │
│  │ └──────────────────────────────────┘  │  │  setup based on your       │ │
│  │                                        │  │  startup's profile."       │ │
│  │ Event Type *                           │  │                            │ │
│  │ ┌──────────────────────────────────┐  │  │ ─────────────────────────  │ │
│  │ │ ▼ Demo Day / Showcase            │  │  │                            │ │
│  │ └──────────────────────────────────┘  │  │ SIMILAR PAST EVENTS        │ │
│  │                                        │  │ • TechCrunch Disrupt       │ │
│  │ Reference URL (optional)               │  │ • YC Demo Day format       │ │
│  │ ┌──────────────────────────────────┐  │  │ • 500 Startups showcase    │ │
│  │ │ https://example.com/event        │  │  │                            │ │
│  │ └──────────────────────────────────┘  │  │ [Use as template]          │ │
│  │ [🔍 Extract details from URL]          │  │                            │ │
│  │                                        │  │ ─────────────────────────  │ │
│  │ Description                            │  │ 💡 TIP                     │ │
│  │ ┌──────────────────────────────────┐  │  │ "Demo days work best with  │ │
│  │ │ Showcase our Q1 portfolio...     │  │  │  5-min pitches + 2-min Q&A │ │
│  │ │ [AI: Generate description]       │  │  │  per startup. Plan for     │ │
│  │ └──────────────────────────────────┘  │  │  20-25 attendees/startup." │ │
│  │                                        │  │                            │ │
│  └────────────────────────────────────────┘  └────────────────────────────┘ │
│                                                                              │
│                              [Cancel]  [Next: Strategy →]                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 3-Panel Layout Logic

**Left Panel (Hidden in Wizard):**
- Not shown in wizard flow (full-screen or modal)

**Main Panel (Flexible) = Work:**
- Step indicator: ● ─── ○ ─── ○ ─── ○ (4 steps)
- Step names: Context → Strategy → Logistics → Review
- Progress bar showing current step
- Step-specific form fields
- [Back] [Next] buttons

**Right Panel (320px) = Intelligence:**
- AI Assistant: "I'll help you plan your event!"
- AI suggestions based on current step
- Similar past events (if available)
- Tips and guidance

---

## Content & Data

**Supabase Tables:**
- `startup_events` — Created on Step 4 completion
- `tasks` — Tasks generated by AI in Step 4
- `startup_event_tasks` — Links tasks to event (with category, due_offset_days)
- `wizard_sessions` — Progress saved during wizard (optional, localStorage backup)

**Wizard State:**
- Steps 1-3: Saved to localStorage (not database yet)
- Step 4: Creates event in `startup_events` table
- On completion: Event created, tasks generated, redirect to detail page

---

## Features

- 4-step wizard flow (Context → Strategy → Logistics → Review)
- AI pre-fill from URL (Step 1)
- Feasibility analysis (Step 2)
- Conflict detection (Step 3)
- Task generation preview (Step 4)
- Progress saving (localStorage)
- Form validation per step
- AI suggestions in right panel

---

## AI Agents & Interactions

**Planning Agent:**
- **Model:** `claude-sonnet-4-5`
- **Purpose:** Wizard assistance, task generation, pre-fill suggestions
- **Tools:** Calendar, venue search, templates, Function Calling (generate tasks)
- **Interaction:** Right panel suggestions, URL extraction (Step 1), task generation (Step 4)
- **Edge Functions:** `event-wizard` (steps 1-3), `event-plan-generator` (step 4)
- **Input:** All wizard step data
- **Returns:** Event blueprint with 50+ tasks

**Event Optimizer:**
- **Model:** `gemini-3-pro-preview` (Step 2), `gemini-3-flash-preview` (Step 3)
- **Purpose:** Feasibility analysis (Step 2), conflict detection (Step 3)
- **Tools:** Thinking Mode (Step 2), Google Search (Step 3)
- **Interaction:** Analyzes on step completion, shows warnings
- **Edge Functions:** Built into `event-wizard` (feasibility and conflict detection logic)

**Agent Interaction Flow:**
1. Step 1: User enters URL → Planning Agent extracts via Gemini URL Context tool
2. Step 2: User enters strategy → Event Optimizer analyzes feasibility (Gemini Thinking Mode)
3. Step 3: User enters logistics → Event Optimizer detects conflicts (Gemini Google Search)
4. Step 4: User reviews → Planning Agent generates 50+ tasks (Claude Function Calling)

---

## Modules

- **WizardContainer** — Main wizard container with step indicator
- **StepContext** — Step 1 form (name, type, URL, description)
- **StepStrategy** — Step 2 form (goals, audience, budget)
- **StepLogistics** — Step 3 form (date, location, timezone)
- **StepReview** — Step 4 review and task preview
- **AIAssistantPanel** — Right panel AI assistant
- **ProgressSaver** — localStorage progress saving

---

## Workflows

**Wizard Flow:**
1. Step 1: Enter context → AI extracts from URL (if provided) → Next
2. Step 2: Enter strategy → AI analyzes feasibility → Next
3. Step 3: Enter logistics → AI detects conflicts → Next
4. Step 4: Review → AI generates plan → Create Event → Redirect to detail

**Step 1 (Context):**
1. User enters event name and type
2. User optionally enters URL
3. User clicks [Extract details from URL]
4. Planning Agent extracts via Gemini URL Context tool
5. Pre-fills description and fields
6. User clicks [Next: Strategy]

**Step 2 (Strategy):**
1. User enters goals, audience, budget, expected attendees
2. User clicks [Next: Logistics]
3. Event Optimizer analyzes feasibility async
4. Shows warnings if budget/goals mismatch

**Step 3 (Logistics):**
1. User enters date, location type, location
2. User clicks [Next: Review]
3. Event Optimizer detects conflicts async (holidays, conferences)
4. Shows warnings if conflicts found

**Step 4 (Review):**
1. User reviews all entered data
2. User clicks [Generate Plan]
3. Planning Agent generates 50+ tasks via Function Calling
4. Creates event in `startup_events`
5. Creates tasks in `tasks`
6. Links tasks in `startup_event_tasks`
7. Redirects to `/app/events/:id` (detail page)

**Progress Saving:**
- Steps 1-3: Auto-save to localStorage on field change
- On page refresh: Restore from localStorage, continue from last step

---

## Automations

- **URL extraction:** Auto-extract on URL paste (Step 1)
- **Feasibility check:** Auto-analyze on step 2 completion
- **Conflict detection:** Auto-check on step 3 completion
- **Progress saving:** Auto-save to localStorage on field change

---

## Supabase

**Writes (Step 4 only):**
- INSERT into `startup_events` — Event created
- INSERT into `tasks` — 50+ tasks generated
- INSERT into `startup_event_tasks` — Links tasks to event

**RLS:**
- Create events filtered by `startup_in_org(startup_id)`

---

## Edge Functions

**`extract-event-context`:** *(Planned - not yet implemented)*
- **Model:** `gemini-3-flash-preview`
- **Tool:** URL Context
- **Input:** `{ url: string }`
- **Logic:** Extract event details from URL
- **Returns:** `{ name, description, date, location, ... }`

**`event-wizard`:**
- **Model:** `claude-sonnet-4-5`
- **Tool:** Structured Output + Thinking Mode
- **Input:** `{ step: number, event_data: object, startup_context: object }`
- **Logic:**
  - Step 1: Pre-fill suggestions from context
  - Step 2: Feasibility analysis (budget/goals realistic)
  - Step 3: Conflict detection (holidays, conferences, overlaps)
- **Returns:** `{ suggestions: [], tips: [], validation: {}, warnings: [] }`

**`event-plan-generator`:**
- **Model:** `claude-sonnet-4-5`
- **Tool:** Structured Output + Function Calling
- **Input:** All wizard step data `{ event: object, event_type: string, timeline_days: number }`
- **Logic:** Generate 50+ tasks with dependencies, timeline, milestones
- **Creates:** Event in `startup_events` + Tasks in `tasks` + Links in `startup_event_tasks`
- **Returns:** `{ event_id, task_count: 50, timeline: [] }`

---

## Claude SDK & Gemini 3

**Claude SDK:**
- `claude-sonnet-4-5` — Planning Agent (wizard assistance, task generation, Function Calling)

**Gemini 3 Tools:**
- `gemini-3-flash-preview` — URL extraction (URL Context tool), conflict detection (Google Search tool)
- `gemini-3-pro-preview` — Feasibility analysis (Thinking Mode)

**Agent Workflows:**
1. Planning Agent (Claude) → URL extraction via Gemini → Pre-fills form
2. Event Optimizer (Gemini) → Feasibility analysis → Shows warnings
3. Event Optimizer (Gemini) → Conflict detection → Shows conflicts
4. Planning Agent (Claude) → Task generation via Function Calling → Creates event + tasks

**Logic:**
- Claude for complex planning and task generation (Function Calling)
- Gemini for fast extraction (URL Context) and search (Google Search)
- Gemini Thinking Mode for deep feasibility analysis
- Planning Agent coordinates all steps and generates final plan
