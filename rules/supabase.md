# Supabase Schema Rules

> **The Supabase schema is the source of truth for all data, authentication, and frontend-backend integration.**
> 
> **Project ID:** yvyesmiczbjqwbqtlidy  
> **Tables:** 43 | **RLS Policies:** 168

## Core Principles

### 1. Schema-First Development
- Database schema defines the data model
- Frontend types are **generated** from schema, never manually defined
- API calls must match table structures exactly
- Changes start with migrations, then propagate to frontend

### 2. Type Safety Chain
```
Supabase Schema → types.ts → React Components
       ↓              ↓              ↓
   Migrations    Auto-generated   Type-safe queries
```

### 3. Authentication Flow
- All auth flows through Supabase Auth
- `handle_new_user()` trigger creates profiles automatically
- User roles stored in `user_roles` table (app_role enum)
- Org membership via `profiles.org_id`

---

## Required Practices

### Querying Data

```typescript
// ✅ CORRECT: Use generated types
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Event = Tables<'events'>;

const { data } = await supabase
  .from('events')
  .select('*')
  .eq('startup_id', startupId);

// ❌ WRONG: Manual type definitions
interface Event {
  id: string;
  title: string;
  // ... duplicates schema
}
```

### Inserting Data

```typescript
// ✅ CORRECT: Use TablesInsert type
import { TablesInsert } from '@/integrations/supabase/types';

type NewEvent = TablesInsert<'events'>;

const newEvent: NewEvent = {
  startup_id: startupId,
  title: 'Demo Day 2026',
  start_date: new Date().toISOString(),
  event_type: 'demo_day',
};

await supabase.from('events').insert(newEvent);
```

### Updating Data

```typescript
// ✅ CORRECT: Use TablesUpdate type
import { TablesUpdate } from '@/integrations/supabase/types';

type UpdateEvent = TablesUpdate<'events'>;

const updates: UpdateEvent = {
  status: 'in_progress',
  health_score: 85,
};

await supabase.from('events').update(updates).eq('id', eventId);
```

---

## RLS Compliance

### Always Respect Row Level Security

```typescript
// RLS handles org-scoping automatically
// User can only see their org's data

// ✅ CORRECT: Let RLS filter
const { data: events } = await supabase
  .from('events')
  .select('*');
// Returns only events from user's org

// ⚠️ REDUNDANT but safe: Explicit startup filter
const { data: events } = await supabase
  .from('events')
  .select('*')
  .eq('startup_id', startupId);
```

### RLS Helper Functions

| Function | Purpose |
|----------|---------|
| `user_org_id()` | Get current user's org_id |
| `org_role()` | Get user's role in org (owner/admin/member) |
| `startup_in_org(id)` | Check startup belongs to user's org |

---

## Key Table Patterns

### Org-Scoped Tables (use `org_id`)
- `organizations`, `startups`, `ai_runs`, `proposed_actions`, `integrations`, `agent_configs`

### Startup-Scoped Tables (use `startup_in_org()`)
- `projects`, `tasks`, `contacts`, `deals`, `documents`, `communications`, `investors`, `events`

### Event-Scoped Tables (child of events)
- `event_attendees`, `event_venues`, `event_assets`, `sponsors`
- RLS checks: `event_id IN (SELECT id FROM events WHERE startup_in_org(startup_id))`

### User-Scoped Tables (use `auth.uid()`)
- `chat_sessions`, `chat_messages`, `notifications`, `chat_facts`

---

## Events System Rules

### Field Names (IMPORTANT!)
```typescript
// ✅ CORRECT field names for events table
event.start_date   // NOT event_date
event.title        // Primary display name
event.name         // Optional alternate name
event.status       // Uses event_status enum

// ✅ Event status enum values
type EventStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';

// ✅ Event type enum values  
type EventType = 'conference' | 'meetup' | 'workshop' | 'pitch_event' | 
                 'demo_day' | 'webinar' | 'networking' | 'hackathon' | 'other';
```

### Querying Events with Relations
```typescript
// ✅ CORRECT: Query events with child tables
const { data } = await supabase
  .from('events')
  .select(`
    *,
    event_attendees(id, rsvp_status),
    event_venues(id, name, city, is_primary),
    event_assets(id, asset_type, status)
  `)
  .eq('startup_id', startupId)
  .order('start_date', { ascending: true });
```

---

## Schema Change Protocol

### 1. Create Migration
```sql
-- Use Lovable migration tool
ALTER TABLE events ADD COLUMN custom_field text;
```

### 2. Types Auto-Sync
Types regenerate automatically when migration is applied.

### 3. Update Frontend
```typescript
// New column now available with type safety
const event: Tables<'events'> = {
  // ... custom_field is now a valid field
};
```

---

## Error Handling

```typescript
const { data, error } = await supabase
  .from('events')
  .select('*')
  .single();

if (error) {
  // Common errors:
  // - PGRST116: No rows returned for .single()
  // - 42501: RLS policy violation
  // - 23505: Unique constraint violation
  console.error('Database error:', error.message);
}
```

---

## AI Integration Pattern

### Proposed Actions Flow
```
AI suggests action → proposed_actions table → User approves → action_executions → Target table updated
```

### AI Runs Tracking
All AI operations logged to `ai_runs`:
- agent_name, model, provider
- input/output/thinking tokens
- cost_usd calculation
- status (success/error)

---

## Security Checklist

- [x] RLS enabled on all 43 tables
- [x] 168 RLS policies active
- [x] No service role key in frontend
- [x] User data scoped by `auth.uid()` or `user_org_id()`
- [x] Admin actions check `org_role()`
- [x] Event child tables scoped via parent event
- [ ] Leaked password protection (minor - OAuth primary)
