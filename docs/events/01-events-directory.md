# Events Directory Screen

**Route:** `/app/events`  
**Screen Type:** Dashboard  
**Classification:** 3-Panel Dashboard

---

## Description

Browse and filter all startup events (demo days, pitch nights, networking events, workshops) with grid/list views, search, filters, quick stats, and AI-powered insights about event readiness.

---

## Purpose & Goals

**Purpose:** Central hub for discovering and managing all events with filtering, search, and AI-powered readiness analysis.

**Goals:**
- Reduce event discovery time (see all events at a glance)
- Filter events by type, status, date range
- Quick stats (today's events, this week's events, upcoming count)
- AI insights for event readiness and suggestions
- One-click navigation to event detail or wizard

---

## Wireframe

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐  EVENTS                                    [+ New Event]  🔔 👤  │
│ │ 🏠 Home │───────────────────────────────────────────────────────────────── │
│ │ 📊 Dash │  ┌─────────────────────────────────────┐  ┌──────────────────┐  │
│ │ 📅 Events│  │ 🔍 Search events...        [Filters]│  │ AI EVENT COACH   │  │
│ │ 👥 CRM  │  └─────────────────────────────────────┘  │                  │  │
│ │ 💼 Deals│                                           │ "You have 2      │  │
│ │ 📁 Docs │  ┌─────────┐ ┌─────────┐ ┌─────────┐     │  upcoming events │  │
│ └─────────┘  │ Demo Day │ │ Pitch   │ │ Meetup  │     │  this month.     │  │
│              │ ─────────│ │ Night   │ │ ─────── │     │                  │  │
│ FILTERS      │ Apr 15   │ │ ─────── │ │ Mar 28  │     │  📊 Prep Score:  │  │
│ ──────────   │ 45 RSVPs │ │ Apr 22  │ │ 32 RSVPs│     │  Demo Day: 67%   │  │
│ ○ All       │ ████████ │ │ 28 RSVPs│ │ ████░░░ │     │                  │  │
│ ○ Upcoming  │ 67% ready│ │ ████░░░ │ │ 45% ready│     │ [Suggest Tasks]  │  │
│ ○ Draft     └─────────┘ │ 52% ready│ └─────────┘     │                  │  │
│ ○ Past                  └─────────┘                   │ ─────────────────│  │
│                                                       │ QUICK ACTIONS    │  │
│ TYPE         ┌─────────┐ ┌─────────┐ ┌─────────┐     │ • Find sponsors  │  │
│ ☑ Demo Day   │ Founder │ │ Investor│ │ Workshop│     │ • Book venue     │  │
│ ☑ Pitch      │ Dinner  │ │ Q&A     │ │ ─────── │     │ • Create invite  │  │
│ ☑ Networking │ ─────── │ │ ─────── │ │ May 10  │     │                  │  │
│ ☐ Workshop   │ May 5   │ │ May 8   │ │ 12 RSVPs│     │ [💬 Ask AI]      │  │
│              └─────────┘ └─────────┘ └─────────┘     └──────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 3-Panel Layout Logic

**Left Panel (240px) = Context:**
- Navigation menu (Dashboard, Projects, CRM, Events ⭐)
- Filters: Status (All, Upcoming, Draft, Past), Type (Demo Day, Pitch Night, etc.)
- Quick stats: Today's events, This week's events, Upcoming count

**Main Panel (Flexible) = Work:**
- Header: "Events" title, [+ New Event] button, View toggle [Grid/List]
- Search bar: "Search events..."
- Events grid/list: Event cards showing name, date, RSVP count (45/60), health score bar (67%), status badge

**Right Panel (320px) = Intelligence:**
- AI Coach: "You have 2 upcoming events this month"
- Prep scores: "Demo Day: 67% ready"
- Suggested actions: [Find sponsors], [Book venue], [Create invite]
- AI chat: "Ask me anything..." input

---

## Content & Data

**Supabase Tables:**
- `startup_events` — Main events (id, name, event_date, event_type, status, capacity, health_score)
- `event_attendees` — RSVP counts (count WHERE rsvp_status = 'confirmed')
- `event_sponsors` — Sponsor counts (count WHERE status = 'confirmed')

**Event Cards Show:**
- Event name (`startup_events.name`)
- Event date (`startup_events.event_date`)
- RSVP count (`COUNT(event_attendees WHERE rsvp_status = 'confirmed')` / `capacity`)
- Health score progress bar (`health_score` 0-100)
- Status badge (draft, planning, confirmed, live, completed)

**Filters:**
- Status: WHERE status IN ('draft', 'planning', 'confirmed', 'live', 'completed')
- Type: WHERE event_type IN ('demo_day', 'pitch_night', ...)
- Date: WHERE event_date >= NOW() (upcoming) or < NOW() (past)

---

## Features

- Grid/List toggle for event cards
- Filter by type, status, date range
- Search events by name, description
- Quick stats (today, this week, upcoming count)
- Event cards show readiness scores
- One-click navigation to event detail or wizard
- AI-powered readiness analysis

---

## AI Agents & Interactions

**Event Analytics Agent:**
- **Model:** `gemini-3-flash-preview`
- **Purpose:** Analyzes event readiness (tasks, sponsors, RSVPs)
- **Tools:** DB queries, Structured Output
- **Interaction:** On page load, analyzes all visible events, calculates health scores
- **Edge Function:** `event-analytics`
- **Input:** `{ event_ids: [], analysis_type: "readiness" }`
- **Reads from:** `startup_events`, `event_attendees`, `event_sponsors`, `startup_event_tasks`
- **Returns:** `{ insights: [{ event_id, prep_score, suggestions, risks }] }`

**AI Coach (Right Panel):**
- **Model:** `claude-sonnet-4-5`
- **Purpose:** Provides contextual suggestions and answers questions
- **Tools:** Event context, Chat interface
- **Interaction:** Chat input in right panel, responds with suggestions
- **Edge Function:** `event-coach-chat` *(Planned - not yet implemented)*
- **Input:** `{ query: "Ask me anything...", event_context: { event_ids: [] } }`
- **Returns:** `{ suggestions: [], quick_actions: [] }`

---

## Modules

- **EventsGrid** — Grid/list view component
- **EventCard** — Individual event card with health score
- **EventFilters** — Filter controls (status, type, date)
- **EventSearch** — Search input component
- **AICoachPanel** — Right panel AI assistant
- **QuickStats** — Today/this week/upcoming counts

---

## Workflows

**Page Load:**
1. Fetch events from `startup_events` WHERE startup_id
2. Count attendees for each event (GROUP BY startup_event_id)
3. Calculate quick stats (today, this week, upcoming)
4. Display in grid/list
5. Generate AI insights async (Event Analyzer Agent)

**Filter:**
1. User selects filter (status, type, date)
2. Refetch events with filter WHERE clause
3. Update quick stats
4. Refresh AI insights for filtered events

**Search:**
1. User types in search bar
2. Filter events WHERE name ILIKE search OR description ILIKE search
3. Update event list
4. Show search results count

**New Event:**
1. Click [+ New Event] button
2. Navigate to `/app/events/new` (wizard)

**View Event:**
1. Click event card
2. Navigate to `/app/events/:id` (detail page)

**AI Chat:**
1. User types question in right panel
2. Send to `event-coach-chat` edge function
3. Display AI response with suggestions
4. Show quick action buttons

---

## Automations

- **Auto-refresh:** Refresh event list every 5 minutes (if page visible)
- **Health score calculation:** Auto-calculate on event updates
- **AI insights refresh:** Refresh insights when filters change
- **Quick stats update:** Auto-update stats on event changes

---

## Supabase

**Queries:**
- List events: `SELECT * FROM startup_events WHERE startup_id = $1 ORDER BY event_date`
- Count attendees: `SELECT startup_event_id, COUNT(*) FROM event_attendees WHERE rsvp_status = 'confirmed' GROUP BY startup_event_id`
- Quick stats: `SELECT COUNT(*) FROM startup_events WHERE event_date = CURRENT_DATE` (today), `WHERE event_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'` (this week)

**RLS:**
- Filtered by `startup_in_org(startup_id)`

---

## Edge Functions

**`event-analytics`:**
- **Model:** `gemini-3-flash-preview`
- **Tool:** Structured Output
- **Input:** `{ event_ids: [], analysis_type: "readiness" | "health" | "trends" }`
- **Logic:** Query all event-related data, analyze readiness, calculate prep scores
- **Returns:** `{ insights: [{ event_id, prep_score, suggestions, risks }] }`

**`event-coach-chat`:** *(Planned - not yet implemented)*
- **Model:** `claude-sonnet-4-5`
- **Tool:** Chat interface
- **Input:** User query, event context
- **Logic:** Respond with suggestions based on visible events
- **Returns:** `{ response: "", suggestions: [], quick_actions: [] }`

---

## Claude SDK & Gemini 3

**Gemini 3 Tools:**
- `gemini-3-flash-preview` — Fast readiness analysis (Structured Output)
- `gemini-3-pro-preview` — Deep analysis if needed (not primary)

**Claude SDK:**
- `claude-sonnet-4-5` — AI Coach chat interface (right panel)

**Agent Workflows:**
1. Event Analyzer (Gemini) → Analyzes readiness → Updates health scores
2. AI Coach (Claude) → Responds to questions → Provides suggestions

**Logic:**
- Gemini for fast, structured analysis (readiness scores)
- Claude for conversational assistance (coach chat)
- Both agents read from same Supabase tables
- Results cached and refreshed on filter changes
