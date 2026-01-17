# Events System — Progress Tracker

> **Last Updated:** 2026-01-17  
> **Status:** 🟡 In Progress

---

## Overview

The Events System enables startup founders to create, manage, and promote small-scale events (demo days, pitch nights, networking meetups) with AI-powered planning, sponsor outreach, and marketing automation.

---

## Module Progress

### Backend (Supabase)

| Task Name | Description | Status | % Complete | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|-----------|-------------|--------|------------|--------------|---------------------|-----------------|
| Database Tables | Core event tables in Supabase | 🟢 Completed | 100% | `startup_events`, `event_sponsors`, `event_venues`, `event_attendees`, `event_assets`, `event_messages` | — | None |
| RLS Policies | Row Level Security policies | 🟢 Completed | 100% | All tables have RLS via `startup_in_org()` | — | None |
| Edge Functions | AI edge functions for events | 🟡 In Progress | 20% | `ai-chat` exists | `event-analytics`, `event-wizard`, `event-marketing`, `sponsor-search`, `venue-search` | Create edge functions |

### Frontend — Pages

| Task Name | Description | Status | % Complete | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|-----------|-------------|--------|------------|--------------|---------------------|-----------------|
| Events Directory | `/app/events` - Browse all events | 🟢 Completed | 100% | Page, EventCard, FiltersPanel, AIPanel | — | None |
| Event Detail | `/app/events/:id` - Event dashboard | 🔴 Not Started | 0% | — | Page, tabs, components | Create EventDetail.tsx |
| Event Wizard | `/app/events/new` - 4-step wizard | 🔴 Not Started | 0% | — | Wizard steps, AI integration | Create EventWizard.tsx |
| Sponsor Wizard | `/app/events/:id/sponsors/new` | 🔴 Not Started | 0% | — | Search, outreach generation | Create SponsorWizard.tsx |
| Venue Finder | `/app/events/:id/venues/search` | 🔴 Not Started | 0% | — | Search, photo analysis | Create VenueFinder.tsx |
| Marketing Hub | `/app/events/:id/marketing` | 🔴 Not Started | 0% | — | Asset generation, scheduling | Create MarketingHub.tsx |

### Frontend — Components

| Task Name | Description | Status | % Complete | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|-----------|-------------|--------|------------|--------------|---------------------|-----------------|
| EventCard | Event card with health score | 🟢 Completed | 100% | Grid/list views, status badges | — | None |
| EventFilters | Filter controls | 🟢 Completed | 100% | Status, type, date range filters | — | None |
| EventsAIPanel | Right panel AI coach | 🟢 Completed | 100% | Insights, quick actions, chat | — | None |
| HealthScoreCard | Progress breakdown card | 🔴 Not Started | 0% | — | Component not created | Create HealthScoreCard.tsx |
| TimelineView | Event preparation timeline | 🔴 Not Started | 0% | — | Component not created | Create TimelineView.tsx |

### Frontend — Hooks

| Task Name | Description | Status | % Complete | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|-----------|-------------|--------|------------|--------------|---------------------|-----------------|
| useEvents | Events CRUD operations | 🔴 Not Started | 0% | — | Hook not created | Create useEvents.ts |
| useEventDetail | Single event with relations | 🔴 Not Started | 0% | — | Hook not created | Create useEventDetail.ts |
| useEventSponsors | Sponsor management | 🔴 Not Started | 0% | — | Hook not created | Create useEventSponsors.ts |
| useEventAttendees | Attendee management | 🔴 Not Started | 0% | — | Hook not created | Create useEventAttendees.ts |

### AI Agents

| Task Name | Description | Status | % Complete | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|-----------|-------------|--------|------------|--------------|---------------------|-----------------|
| Event Analytics Agent | Health score calculation | 🔴 Not Started | 0% | — | Edge function missing | Create `event-analytics` |
| Planning Agent | Wizard assistance | 🔴 Not Started | 0% | — | Edge function missing | Create `event-wizard` |
| Sponsor Scout Agent | Sponsor discovery | 🔴 Not Started | 0% | — | Edge function missing | Create `sponsor-search` |
| Marketing Agent | Content generation | 🔴 Not Started | 0% | — | Edge function missing | Create `event-marketing` |
| Venue Agent | Venue discovery | 🔴 Not Started | 0% | — | Edge function missing | Create `venue-search` |

---

## Documentation Index

| # | Document | Description |
|---|----------|-------------|
| 00 | [Progress Tracker](./00-events-progress.md) | This file — implementation status |
| 01 | [Events Directory](./01-events-directory.md) | `/app/events` screen spec |
| 02 | [Event Detail](./02-event-detail.md) | `/app/events/:id` screen spec |
| 03 | [Event Wizard](./03-event-wizard.md) | `/app/events/new` wizard spec |
| 04 | [Event Dashboard](./04-event-dashboard.md) | Dashboard (same as detail) |
| 05 | [Sponsor Wizard](./05-sponsor-wizard.md) | Sponsor discovery spec |
| 06a | [Events System Design](./06-events-system-design.md) | Complete system design |
| 06b | [Venue Finder](./06-venue-finder.md) | Venue discovery spec |
| 07 | [Marketing Hub](./07-marketing-hub.md) | Marketing asset generation spec |

---

## Status Legend

- 🟢 **Completed** — Fully functional & tested  
- 🟡 **In Progress** — Partially working  
- 🔴 **Not Started** — Planned but not implemented  
- 🟥 **Blocked** — Missing dependency or critical failure

---

## Implementation Order

1. ✅ Database tables (Supabase) — **DONE**
2. ✅ RLS policies — **DONE**
3. 🔴 Create `useEvents` hook — **NEXT**
4. 🔴 Create Events Directory page (`/app/events`)
5. 🔴 Create Event Detail page (`/app/events/:id`)
6. 🔴 Create Event Wizard (`/app/events/new`)
7. 🔴 Create edge functions for AI agents
8. 🔴 Create Sponsor Wizard
9. 🔴 Create Venue Finder
10. 🔴 Create Marketing Hub

---

## Routes to Add

```typescript
// In App.tsx
<Route path="/app/events" element={<Events />} />
<Route path="/app/events/new" element={<EventWizard />} />
<Route path="/app/events/:id" element={<EventDetail />} />
<Route path="/app/events/:id/sponsors/new" element={<SponsorWizard />} />
<Route path="/app/events/:id/venues/search" element={<VenueFinder />} />
<Route path="/app/events/:id/marketing" element={<MarketingHub />} />
```

---

*Updated automatically as implementation progresses*
