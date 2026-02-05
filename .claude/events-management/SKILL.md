---
name: events-management
description: Skill for planning speaker events, networking meetups, and virtual events.
triggers:
  - event planning
  - speaker event
  - networking event
  - virtual event
---

# 🎪 Events Management Skill

> Plan and execute speaker events, networking meetups, and virtual gatherings.

---

## 🧠 Quick Start

```
📋 EVENT: [Name]
📅 DATE: [Date]
🎯 TYPE: [Speaker | Networking | Virtual]
👥 SIZE: [Expected attendees]
```

---

## 📋 Event Types

### 1. Speaker Events
| Element | Details |
|---------|---------|
| Speakers | 1-5 speakers, topics, bios |
| Agenda | Talks, Q&A, breaks |
| Venue/Platform | Physical or streaming |
| Registration | Tickets, RSVPs |

### 2. Networking Events
| Element | Details |
|---------|---------|
| Format | Mixer, roundtables, speed networking |
| Icebreakers | Activities, conversation starters |
| Facilitation | Host, moderator |
| Follow-up | Contact sharing, LinkedIn |

### 3. Virtual Events
| Element | Details |
|---------|---------|
| Platform | Zoom, Hopin, StreamYard |
| Engagement | Chat, polls, breakouts |
| Recording | Archive for replay |
| Tech check | Audio, video, screen share |

---

## ✅ Planning Checklist

### 4 Weeks Before
- [ ] Set date, time, format
- [ ] Confirm speakers/hosts
- [ ] Choose venue or platform
- [ ] Create event page
- [ ] Open registration

### 1 Week Before
- [ ] Send reminders
- [ ] Confirm final headcount
- [ ] Prep speaker materials
- [ ] Test tech (virtual)

### Day Of
- [ ] Setup/login early
- [ ] Welcome attendees
- [ ] Run agenda
- [ ] Capture photos/recording

### After Event
- [ ] Send thank-you + recording
- [ ] Collect feedback
- [ ] Share on social

---

## 🎤 Speaker Essentials

| Need | Description |
|------|-------------|
| Bio | 2-3 sentences |
| Headshot | High-res photo |
| Topic | Title + description |
| Slides | If presenting |

---

## 🔗 Related Docs

### Planning
- [Events Plan](../../supabase/events/03-events-plan.md) - Simple MVP plan
- [Schema Audit](../../supabase/events/04-audit.md) - Database schema
- [Docs Audit](../../supabase/events/05-audit.md) - Implementation status

### Design
- [Dashboards](../../supabase/events/06-event-dashboards.md) - Screen specs
- [Design Prompts](../../supabase/events/07-event%20prompts.md) - UI/UX wireframes

### Implementation
- [Changes & Next Steps](../../docs/events/10-changes.md) - Current status
- [Progress Tracker](../../docs/events/00-events-progress.md) - Detailed progress

---

## 🛠️ Implementation

### Hooks (Ready)
```
useEvents()          - List events with filters
useEvent(id)         - Single event with relations
useEventStats()      - Counts by status/date
useCreateEvent()     - Create event
useUpdateEvent()     - Update event
useDeleteEvent()     - Delete event
useEventSponsors()   - Sponsors by event
useEventAttendees()  - Attendees by event
```

### Components (Ready)
```
EventCard.tsx        - Event card with health score
EventFiltersPanel.tsx - Status/type/date filters
EventsAIPanel.tsx    - AI insights panel
```

### Pages (To Build)
```
/app/events          ✅ Done (Events.tsx)
/app/events/:id      🔴 Next (EventDetail.tsx)
/app/events/new      🔴 Next (EventWizard.tsx)
```

---

## 📊 Database Tables

```
startup_events       - Main events table
event_sponsors       - Sponsors per event
event_attendees      - RSVPs and check-ins
event_venues         - Venue details
event_assets         - Marketing materials
```

---

**Last Updated**: 2026-01-17
