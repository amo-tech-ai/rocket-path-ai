# Supabase Schema Rules

> **The Supabase schema is the source of truth for all data, authentication, and frontend-backend integration.**

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
- User roles stored in `user_roles` table
- Org membership via `profiles.org_id`

---

## Required Practices

### Querying Data

```typescript
// ✅ CORRECT: Use generated types
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Startup = Tables<'startups'>;

const { data } = await supabase
  .from('startups')
  .select('*')
  .eq('org_id', orgId);

// ❌ WRONG: Manual type definitions
interface Startup {
  id: string;
  name: string;
  // ... duplicates schema
}
```

### Inserting Data

```typescript
// ✅ CORRECT: Use TablesInsert type
import { TablesInsert } from '@/integrations/supabase/types';

type NewContact = TablesInsert<'contacts'>;

const newContact: NewContact = {
  startup_id: startupId,
  name: 'John Doe',
  email: 'john@example.com',
  type: 'investor',
};

await supabase.from('contacts').insert(newContact);
```

### Updating Data

```typescript
// ✅ CORRECT: Use TablesUpdate type
import { TablesUpdate } from '@/integrations/supabase/types';

type UpdateDeal = TablesUpdate<'deals'>;

const updates: UpdateDeal = {
  stage: 'meeting',
  probability: 50,
};

await supabase.from('deals').update(updates).eq('id', dealId);
```

---

## RLS Compliance

### Always Respect Row Level Security

```typescript
// RLS handles org-scoping automatically
// User can only see their org's data

// ✅ CORRECT: Let RLS filter
const { data: tasks } = await supabase
  .from('tasks')
  .select('*');
// Returns only tasks from user's org

// ⚠️ REDUNDANT but safe: Explicit org filter
const { data: tasks } = await supabase
  .from('tasks')
  .select('*')
  .eq('startup_id', startupId);
```

### Use Helper Functions in Policies

| Function | Purpose |
|----------|---------|
| `user_org_id()` | Get current user's org_id |
| `org_role()` | Get user's role in org |
| `startup_in_org(id)` | Check startup belongs to user's org |
| `has_role(user_id, role)` | Check app-level role |

---

## Schema Change Protocol

### 1. Create Migration
```sql
-- supabase/migrations/YYYYMMDD_description.sql
ALTER TABLE contacts ADD COLUMN priority text DEFAULT 'normal';
```

### 2. Regenerate Types
Types auto-sync when migration is applied in Lovable.

### 3. Update Frontend
```typescript
// New column now available with type safety
const contact: Tables<'contacts'> = {
  // ... priority is now a valid field
};
```

---

## Relationship Patterns

### Org-Scoped Data
Tables with `org_id` column use direct org filtering:
- `organizations`
- `startups`
- `ai_runs`
- `proposed_actions`
- `integrations`

### Startup-Scoped Data
Tables with `startup_id` use `startup_in_org()` for access:
- `projects`
- `tasks`
- `contacts`
- `deals`
- `documents`
- `communications`

### User-Scoped Data
Tables with `user_id` use `auth.uid()` for access:
- `chat_sessions`
- `chat_messages`
- `notifications`
- `chat_facts`

---

## Foreign Key Relationships

When selecting related data:

```typescript
// ✅ CORRECT: Join via Supabase query syntax
const { data } = await supabase
  .from('deals')
  .select(`
    *,
    contact:contacts(name, email),
    startup:startups(name)
  `)
  .eq('stage', 'meeting');

// ❌ WRONG: Multiple separate queries
const deals = await supabase.from('deals').select('*');
const contacts = await supabase.from('contacts').select('*');
// Manual joining in JS...
```

---

## Enums

Use the Constants export for enum values:

```typescript
import { Constants } from '@/integrations/supabase/types';

// Available app roles
const roles = Constants.public.Enums.app_role;
// ['admin', 'moderator', 'user']
```

---

## Error Handling

```typescript
const { data, error } = await supabase
  .from('startups')
  .select('*')
  .single();

if (error) {
  // Handle Supabase errors
  console.error('Database error:', error.message);
  
  // Common errors:
  // - PGRST116: No rows returned for .single()
  // - 42501: RLS policy violation
  // - 23505: Unique constraint violation
}
```

---

## AI Integration Pattern

### Proposed Actions Flow
```
AI suggests action → proposed_actions table → User approves → action_executions → Target table updated
```

### Tracking AI Usage
All AI operations logged to `ai_runs`:
- Model used
- Token counts
- Cost calculation
- Success/error status

---

## Security Checklist

- [ ] RLS enabled on all tables
- [ ] No service role key in frontend
- [ ] User data scoped by `auth.uid()` or `user_org_id()`
- [ ] Admin actions check `org_role()` 
- [ ] Sensitive operations use `SECURITY DEFINER`
- [ ] Audit log captures important changes
