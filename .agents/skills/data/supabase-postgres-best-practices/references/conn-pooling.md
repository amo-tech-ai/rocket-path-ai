---
title: Use Connection Pooling for All Applications
impact: CRITICAL
impactDescription: Handle 10-100x more concurrent users
tags: connection-pooling, supavisor, performance, scalability
---

## Use Connection Pooling for All Applications

Postgres connections are expensive (1-3MB RAM each). Without pooling, applications exhaust connections under load.

**Incorrect (new connection per request):**

```sql
-- Each request creates a new connection
-- Application code: db.connect() per request
-- Result: 500 concurrent users = 500 connections = crashed database

-- Check current connections
select count(*) from pg_stat_activity;  -- 487 connections!
```

**Correct (connection pooling via Supavisor):**

Supabase uses **Supavisor** (not PgBouncer) as its connection pooler. Supavisor is an Elixir-based pooler purpose-built for multi-tenant Postgres.

```sql
-- Application connects to Supavisor pooler, which reuses a small pool to Postgres
-- Connection strings use port 6543 for pooled connections (vs 5432 for direct)

-- Result: 500 concurrent users share a small pool of actual connections
select count(*) from pg_stat_activity;  -- Small pool size
```

Pool modes (configure in Supabase Dashboard → Database → Connection Pooling):

- **Transaction mode** (port 6543): connection returned after each transaction (best for serverless/edge functions)
- **Session mode** (port 5432 via pooler): connection held for entire session (needed for prepared statements, temp tables, LISTEN/NOTIFY)

When to use which:

| Use Case | Mode | Port |
|----------|------|------|
| Edge Functions | Transaction | 6543 |
| Serverless / Lambda | Transaction | 6543 |
| Long-running backend | Session | 5432 (pooler) |
| Direct connection (migrations, pg_dump) | Direct | 5432 |
| Prepared statements | Session | 5432 (pooler) |

```typescript
// Edge Function example: use transaction mode via Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!,
  { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
);
// Supabase client automatically routes through the pooler
```

Reference: [Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
