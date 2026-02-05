# Edge Functions Database Connections Best Practices

**Document:** 06-database-connections.md  
**Version:** 1.0  
**Date:** January 27, 2025  
**Source:** [Connect to Postgres](https://supabase.com/docs/guides/functions/connect-to-postgres)

---

## Overview

Edge Functions can connect to Supabase Postgres database using `supabase-js` client or direct Postgres connections. This guide covers best practices for both approaches.

---

## Using supabase-js Client (Recommended)

### ✅ CORRECT: User-Facing Operations (Respects RLS)

```typescript
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  const authHeader = req.headers.get('Authorization')!

  // ✅ CORRECT: Use anon key with user's JWT
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,  // Respects RLS
    {
      global: { headers: { Authorization: authHeader } }
    }
  )

  // RLS policies automatically enforced
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    // User only sees their org's tasks (RLS policy)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
})
```

**Benefits:**
- ✅ Automatic RLS enforcement
- ✅ Built-in JSON serialization
- ✅ TypeScript type safety
- ✅ Consistent error handling

### ✅ CORRECT: Admin Operations (Bypass RLS)

```typescript
// ✅ CORRECT: Use service role key for admin operations
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!  // Bypasses RLS
)

// Use for:
// - Writing to system tables (ai_runs, audit_log)
// - Bulk operations
// - Admin tasks

await supabaseAdmin.from('ai_runs').insert({
  user_id: user.id,
  org_id: profile.org_id,
  agent_name: 'ProfileExtractor',
  // ...
})
```

**⚠️ CRITICAL:** Never expose `SUPABASE_SERVICE_ROLE_KEY` to client-side code!

---

## Direct Postgres Connection

### ✅ CORRECT: Connection Pooling

```typescript
import { Pool } from 'npm:postgres@v0.17.0'

// ✅ CORRECT: Create pool with single connection (edge-friendly)
const pool = new Pool(
  {
    tls: { enabled: false },  // Local dev
    // tls: { enabled: true },  // Production (SSL)
    database: 'postgres',
    hostname: Deno.env.get('DB_HOSTNAME') || Deno.env.get('SUPABASE_DB_URL')?.split('@')[1]?.split('/')[0],
    user: Deno.env.get('DB_USER'),
    port: 6543,  // Connection pooler port
    password: Deno.env.get('DB_PASSWORD'),
  },
  1  // Single connection (edge functions are short-lived)
)

Deno.serve(async (_req: Request) => {
  const connection = await pool.connect()
  
  try {
    // Run query
    const result = await connection.queryObject`
      SELECT * FROM tasks 
      WHERE org_id = ${orgId}
      LIMIT 10
    `
    
    const tasks = result.rows

    // Return response
    return new Response(JSON.stringify(tasks), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } finally {
    // ✅ CRITICAL: Always release connection
    connection.release()
  }
})
```

### ✅ CORRECT: Connection String (Simpler)

```typescript
// ✅ CORRECT: Use SUPABASE_DB_URL
const connectionString = Deno.env.get('SUPABASE_DB_URL')!

const pool = new Pool(connectionString, 1)

Deno.serve(async (_req: Request) => {
  const connection = await pool.connect()
  
  try {
    const result = await connection.queryObject`SELECT * FROM tasks`
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } finally {
    connection.release()
  }
})
```

---

## Connection Best Practices

### ✅ CORRECT: Connection Pooling Strategy

**For Edge Functions:**
- ✅ Use **single connection** per function instance
- ✅ Functions are short-lived (no need for large pools)
- ✅ Always release connections in `finally` block
- ✅ Use connection pooler port (6543) not direct port (5432)

**Connection Pooler Benefits:**
- ✅ Faster connections
- ✅ Better for serverless
- ✅ Handles connection limits

### ✅ CORRECT: Error Handling

```typescript
Deno.serve(async (req: Request) => {
  const connection = await pool.connect()
  
  try {
    const result = await connection.queryObject`SELECT * FROM tasks`
    return new Response(JSON.stringify(result.rows), { status: 200 })
    
  } catch (error) {
    console.error('Database error:', error)
    
    // Handle specific errors
    if (error.code === '23505') {  // Unique violation
      return new Response(JSON.stringify({
        error: 'Duplicate entry'
      }), { status: 409 })
    }
    
    return new Response(JSON.stringify({
      error: 'Database error'
    }), { status: 500 })
    
  } finally {
    // ✅ ALWAYS release connection
    connection.release()
  }
})
```

### ❌ WRONG: Anti-Patterns

```typescript
// ❌ WRONG: Don't create new pool per request
Deno.serve(async (req: Request) => {
  const pool = new Pool(...)  // Creates new pool each time!
  // ...
})

// ❌ WRONG: Don't forget to release connection
const connection = await pool.connect()
const result = await connection.query(...)
// Missing: connection.release()  // Connection leak!

// ❌ WRONG: Don't use direct port in production
const pool = new Pool({
  port: 5432  // Use 6543 (pooler) instead
})
```

---

## SSL Connections

### Production (Automatic)

✅ **Deployed functions automatically use SSL** - No configuration needed

### Local Development

```bash
# 1. Download SSL certificate from Database Settings
# 2. Add to .env file:
SSL_CERT_FILE=/path/to/cert.crt
DENO_TLS_CA_STORE=mozilla,system

# 3. Restart function
supabase functions serve ai-helper
```

---

## Using Drizzle ORM

### ✅ CORRECT: Drizzle with Postgres.js

```typescript
import { drizzle } from 'npm:drizzle-orm@0.29.1/postgres-js'
import postgres from 'npm:postgres@3.4.3'
import { tasks } from '../_shared/schema.ts'

const connectionString = Deno.env.get('SUPABASE_DB_URL')!

Deno.serve(async (_req: Request) => {
  // Disable prefetch for Transaction pool mode
  const client = postgres(connectionString, { prepare: false })
  const db = drizzle(client)
  
  const allTasks = await db.select().from(tasks)
  
  return Response.json(allTasks)
})
```

---

## Best Practices Summary

### ✅ DO

1. **Use supabase-js for RLS** - User-facing operations
2. **Use service role for admin** - System tables, bulk ops
3. **Use connection pooling** - Single connection per function
4. **Always release connections** - In `finally` block
5. **Use pooler port (6543)** - Better for serverless
6. **Handle connection errors** - Retry, graceful degradation
7. **Use SSL in production** - Automatic, no config needed
8. **Validate query inputs** - Prevent SQL injection
9. **Use parameterized queries** - Never string concatenation
10. **Close connections properly** - Prevent leaks

### ❌ DON'T

1. **Don't use direct port (5432)** - Use pooler (6543)
2. **Don't create pool per request** - Reuse pool
3. **Don't forget to release** - Connection leaks
4. **Don't expose service role key** - Security risk
5. **Don't use string concatenation** - SQL injection risk
6. **Don't skip error handling** - Always catch errors
7. **Don't use large connection pools** - Single connection is enough
8. **Don't block on connections** - Use async/await properly

---

## Project-Specific Patterns

### AI Function Database Access

```typescript
// supabase/functions/ai-helper/index.ts
Deno.serve(async (req: Request) => {
  // User-facing client (RLS enforced)
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  // Get user data (RLS enforced)
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('org_id', profile.org_id)

  // Admin client (for cost tracking)
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Log to system table (bypasses RLS)
  await supabaseAdmin.from('ai_runs').insert({
    user_id: user.id,
    org_id: profile.org_id,
    // ...
  })

  return Response.json({ success: true })
})
```

---

## References

- **Official Docs:** [Connect to Postgres](https://supabase.com/docs/guides/functions/connect-to-postgres)
- **Next:** [07-storage-integration.md](./07-storage-integration.md)

---

**Last Updated:** January 27, 2025
