# Event Dashboard Screen (Same as Detail)

**Route:** `/app/events/:id`  
**Screen Type:** Dashboard  
**Classification:** 3-Panel Dashboard

**Note:** Event Dashboard and Event Detail are the same screen. See `02-event-detail.md` for complete specification.

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

**Tables Used:**
- `startup_events`, `event_sponsors`, `event_venues`, `event_attendees`, `startup_event_tasks`, `event_assets`

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

**Screen Features:**
- Left: Event summary, sponsors list, venue info
- Main: Tabbed interface (Overview, Tasks, Sponsors, Marketing, Attendees)
- Main: Health score card, metrics cards (Attendees, Budget, Timeline), timeline visualization, activity feed
- Right: AI Event Agent with suggestions and chat interface
