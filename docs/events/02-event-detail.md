# Event Detail Dashboard Screen

**Route:** `/app/events/:id`  
**Screen Type:** Dashboard  
**Classification:** 3-Panel Dashboard

---

## Description

Command center for managing individual events with tabs (Overview, Tasks, Sponsors, Marketing, Attendees), health scores, timeline visualization, activity feed, and AI-powered Event Orchestrator with chat interface.

---

## Purpose & Goals

**Purpose:** Comprehensive command center for managing individual events with all workstreams (tasks, sponsors, marketing, attendees) in one place with AI-powered orchestration.

**Goals:**
- Centralize all event management in one dashboard
- Track progress across all workstreams (tasks, sponsors, RSVPs, marketing)
- AI-powered suggestions and automation for next actions
- Timeline visualization for event preparation
- Quick access to all related items (sponsors, venue, attendees, tasks)

---

## Wireframe

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ← Back   DEMO DAY 2024                    [Edit] [Share] [Duplicate]  🔔 👤  │
│──────────────────────────────────────────────────────────────────────────────│
│ ┌─────────┐  ┌───────────────────────────────────────┐  ┌──────────────────┐│
│ │ SUMMARY │  │ [Overview] [Tasks] [Sponsors] [Mktg]  │  │ EVENT AGENT 🤖   ││
│ │─────────│  │─────────────────────────────────────── │  │──────────────────││
│ │ 📅 Apr15│  │                                        │  │ "45 people have  ││
│ │ 📍 TechHub│ │  ┌─────────────────────────────────┐  │  │  RSVP'd. Based   ││
│ │ 👥 45/60 │  │  │     EVENT HEALTH SCORE          │  │  │  on past events, ││
│ │         │  │  │     ████████████░░░ 67%          │  │  │  expect 38 to    ││
│ │ PROGRESS│  │  │  Tasks: 12/18  Sponsors: 2/4    │  │  │  attend."        ││
│ │─────────│  │  └─────────────────────────────────┘  │  │                  ││
│ │ ████░░░ │  │                                        │  │ SUGGESTIONS      ││
│ │ 67%     │  │  ┌──────────┐ ┌──────────┐ ┌───────┐  │  │ ─────────────────││
│ │         │  │  │ATTENDEES │ │ BUDGET   │ │TIMELINE│ │  │ ⚡ Send reminder ││
│ │ SPONSORS│  │  │ 45 / 60  │ │ $2.4k    │ │ 12 days│ │  │ ⚡ Confirm venue ││
│ │─────────│  │  │ ████████ │ │ of $3k   │ │ left   │ │  │ ⚡ Draft agenda  ││
│ │ TechCorp│  │  └──────────┘ └──────────┘ └───────┘  │  │                  ││
│ │ $1,500  │  │                                        │  │ [Execute All]    ││
│ │         │  │  TIMELINE                              │  │                  ││
│ │ StartupX│  │  ○────●────○────○────○────◐           │  │ ─────────────────││
│ │ $500    │  │  Venue  Sponsors  Agenda  Mktg  Event │  │ 💬 Chat          ││
│ │         │  │         ↑ YOU ARE HERE                 │  │ ┌──────────────┐ ││
│ │ [+Add]  │  │                                        │  │ │How can I help│ ││
│ │         │  │  RECENT ACTIVITY                       │  │ │with Demo Day?│ ││
│ │ VENUE   │  │  • Sarah confirmed catering (2h ago)  │  │ └──────────────┘ ││
│ │─────────│  │  • TechCorp sponsorship signed (1d)   │  │ [Send]           ││
│ │ TechHub │  │  • Venue deposit paid (2d)            │  │                  ││
│ └─────────┘  └───────────────────────────────────────┘  └──────────────────┘│
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 3-Panel Layout Logic

**Left Panel (240px) = Context:**
- Event summary: Name, date, status, type
- Related items: Sponsors list, Venue info
- Quick actions: [Edit], [Complete], [Share]

**Main Panel (Flexible) = Work:**
- Header: Event name, [Edit] [Share] [Duplicate] buttons
- Tabs: [Overview] [Tasks] [Sponsors] [Marketing] [Attendees]
- Health score card: Progress bar (67%), metrics (Tasks 12/18, Sponsors 2/4)
- Metrics cards: Attendees (45/60), Budget ($2.4k/$3k), Timeline (12 days left)
- Timeline view: Progress milestones (Venue → Sponsors → Agenda → Marketing → Event)
- Recent activity feed: Updates from tasks, sponsors, attendees

**Right Panel (320px) = Intelligence:**
- Event Agent: AI coach with chat interface
- Suggestions: "45 people have RSVP'd. Based on past events, expect 38 to attend."
- Suggested actions: [Send reminder], [Confirm venue], [Draft agenda], [Execute All]
- AI chat: "How can I help with Demo Day?" input

---

## Content & Data

**Supabase Tables:**
- `startup_events` — Main event (id, name, event_date, status, budget, capacity, health_score, tasks_total, tasks_completed, sponsors_target, sponsors_confirmed)
- `event_sponsors` — Sponsors list (WHERE startup_event_id = event_id)
- `event_venues` — Venue info (WHERE startup_event_id = event_id AND is_primary = true)
- `event_attendees` — Attendees list (WHERE startup_event_id = event_id)
- `startup_event_tasks` — Tasks (JOIN tasks WHERE startup_event_id = event_id)
- `event_assets` — Marketing assets (WHERE startup_event_id = event_id)

**Overview Tab:**
- Event details (name, date, description, location)
- Health score and metrics
- Timeline visualization
- Recent activity

**Tasks Tab:**
- Task list from `startup_event_tasks` JOIN `tasks`
- Filter by category (planning, venue, sponsors, marketing, etc.)
- Show progress (completed/total)

**Sponsors Tab:**
- Sponsors from `event_sponsors`
- Sponsor cards: Name, tier, status, amount, contact
- [+ Find Sponsors] button (opens sponsor wizard)

**Marketing Tab:**
- Assets from `event_assets`
- Social posts, emails, graphics
- [+ Generate Content] button

**Attendees Tab:**
- Attendees from `event_attendees`
- RSVP status, check-in status
- Export list, send messages

---

## Features

- Tabbed interface (Overview, Tasks, Sponsors, Marketing, Attendees)
- Health score card with progress breakdown
- Metrics cards (Attendees, Budget, Timeline)
- Timeline visualization with milestones
- Activity feed with real-time updates
- Quick actions (Edit, Share, Duplicate)
- AI chat interface in right panel
- Execute All suggestions button

---

## AI Agents & Interactions

**Event Orchestrator Agent:**
- **Model:** `claude-opus-4-5`
- **Purpose:** Master coordinator, task routing, multi-step planning
- **Tools:** All sub-agents, DB access, Function Calling
- **Interaction:** Right panel chat, provides suggestions, can execute actions
- **Edge Function:** `event-orchestrator` *(Planned - not yet implemented)*
- **Input:** `{ event_id, action }` (e.g., "suggest_next_steps")
- **Reads from:** All event-related tables
- **Returns:** `{ suggestions: [], actions: [], risks: [] }`

**Event Analytics Agent:**
- **Model:** `gemini-3-flash-preview`
- **Purpose:** Analyzes event health and progress
- **Tools:** DB queries, Structured Output
- **Interaction:** On page load, calculates health score
- **Edge Function:** `event-analytics`
- **Input:** `{ event_id, analysis_type: "health" }`
- **Reads from:** `startup_events`, `event_sponsors`, `startup_event_tasks`, `event_attendees`
- **Returns:** `{ health_score: 67, breakdown: { tasks: 67, sponsors: 50 }, suggestions: [] }`

**Agent Interaction Flow:**
1. Page loads → Event Analyzer calculates health score
2. Event Orchestrator reads event context → Generates suggestions
3. User chats with Event Orchestrator → Provides next actions
4. User clicks [Execute All] → Event Orchestrator executes suggested actions via Function Calling

---

## Modules

- **EventOverview** — Overview tab with health score and metrics
- **EventTasks** — Tasks tab with category filters
- **EventSponsors** — Sponsors tab with sponsor cards
- **EventMarketing** — Marketing tab with asset management
- **EventAttendees** — Attendees tab with RSVP management
- **HealthScoreCard** — Health score progress breakdown
- **MetricsCards** — Attendees, Budget, Timeline metrics
- **TimelineView** — Milestone timeline visualization
- **ActivityFeed** — Recent activity updates
- **EventAgentPanel** — Right panel AI orchestrator

---

## Workflows

**Page Load:**
1. Fetch event from `startup_events` by ID
2. Fetch related data (sponsors, venue, attendees, tasks, assets)
3. Calculate metrics (RSVP count, task completion, sponsor count)
4. Event Analyzer Agent calculates health score (async)
5. Event Orchestrator Agent generates suggestions (async)
6. Display in tabs with health score

**Tab Switch:**
1. User clicks tab (Overview, Tasks, Sponsors, Marketing, Attendees)
2. Update active tab state
3. Load tab-specific data if not cached
4. Update right panel suggestions based on active tab

**AI Chat:**
1. User asks question in right panel chat
2. Send to `event-orchestrator` edge function with event context
3. Event Orchestrator analyzes event state
4. Display AI response with suggestions
5. Show [Execute All] button if actions available

**Execute All Actions:**
1. User clicks [Execute All] button
2. Event Orchestrator executes suggested actions via Function Calling
3. Update event data in Supabase
4. Refresh event data and suggestions
5. Show success/error messages

**Edit Event:**
1. Click [Edit] button
2. Open edit form (inline or modal)
3. Update `startup_events` table
4. Refresh event data and health score

---

## Automations

- **Health score refresh:** Auto-calculate on task/sponsor/attendee changes
- **Timeline updates:** Auto-update timeline on milestone completion
- **Activity feed:** Real-time updates on task/sponsor/attendee changes
- **Suggestions refresh:** Auto-refresh suggestions on event state changes

---

## Supabase

**Queries:**
- Event detail: `SELECT * FROM startup_events WHERE id = $1`
- Sponsors: `SELECT * FROM event_sponsors WHERE startup_event_id = $1`
- Venue: `SELECT * FROM event_venues WHERE startup_event_id = $1 AND is_primary = true`
- Attendees: `SELECT * FROM event_attendees WHERE startup_event_id = $1`
- Tasks: `SELECT * FROM startup_event_tasks JOIN tasks ON task_id = tasks.id WHERE startup_event_id = $1`
- Assets: `SELECT * FROM event_assets WHERE startup_event_id = $1`

**RLS:**
- Filtered by `startup_in_org(startup_id)`

---

## Edge Functions

**`event-orchestrator`:**
- **Model:** `claude-opus-4-5`
- **Tool:** Function Calling (can execute actions), Chat interface
- **Input:** `{ event_id, action, query? }` (action = "suggest_next_steps" or chat query)
- **Logic:** Analyze event state, generate suggestions, execute actions via Function Calling
- **Returns:** `{ suggestions: [], actions: [], risks: [] }` or chat response

**`event-analytics`:**
- **Model:** `gemini-3-flash-preview`
- **Tool:** Structured Output
- **Input:** `{ event_id, analysis_type: "health" }`
- **Logic:** Query all event data, calculate health score breakdown
- **Returns:** `{ health_score: 67, breakdown: { tasks: 67, sponsors: 50, attendees: 75 }, suggestions: [] }`

---

## Claude SDK & Gemini 3

**Claude SDK:**
- `claude-opus-4-5` — Event Orchestrator (master coordinator, Function Calling)

**Gemini 3 Tools:**
- `gemini-3-flash-preview` — Event Analyzer (fast health score calculation, Structured Output)

**Agent Workflows:**
1. Event Analyzer (Gemini) → Calculates health score → Updates UI
2. Event Orchestrator (Claude) → Reads event context → Generates suggestions
3. Event Orchestrator (Claude) → Executes actions via Function Calling → Updates Supabase

**Logic:**
- Claude for complex orchestration and Function Calling (execute actions)
- Gemini for fast, structured analysis (health scores)
- Both agents read from same Supabase tables
- Event Orchestrator can trigger sub-agents (Sponsor Scout, Marketing Agent) via Function Calling
