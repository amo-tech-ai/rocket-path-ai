# Events Quick Reference

## Event Types
- `demo_day` - Showcase/pitch event
- `pitch_night` - Pitch competition
- `networking` - Mixer/meetup
- `workshop` - Hands-on session
- `webinar` - Online presentation
- `hackathon` - Build event
- `conference` - Multi-session event

## Location Types
- `in_person` - Physical venue
- `virtual` - Online only
- `hybrid` - Both

## Status Flow
```
draft → planning → confirmed → live → completed
                           ↘ cancelled
                           ↘ postponed
```

## Key Hooks
```typescript
// List & Filter
const { data: events } = useEvents({ status: ['confirmed'] });
const { data: stats } = useEventStats();

// Single Event
const { data: event } = useEvent(eventId);

// CRUD
const createEvent = useCreateEvent();
const updateEvent = useUpdateEvent();
const deleteEvent = useDeleteEvent();

// Relations
const { data: sponsors } = useEventSponsors(eventId);
const { data: attendees } = useEventAttendees(eventId);
```

## Routes
| Route | Page | Status |
|-------|------|--------|
| `/app/events` | Events list | ✅ Done |
| `/app/events/new` | Event wizard | 🔴 Todo |
| `/app/events/:id` | Event detail | 🔴 Todo |

Done.
