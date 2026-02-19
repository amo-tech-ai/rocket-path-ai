# Edge Functions Database Connections

## Using supabase-js Client (Recommended)

### User Operations (RLS Enforced)

```typescript
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  const authHeader = req.headers.get('Authorization')!

  // Use anon key with user's JWT - RLS enforced
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  // RLS policies automatically filter results
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    // User only sees their org's tasks

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ data })
})
```

### Admin Operations (Bypass RLS)

```typescript
// Use service role key - bypasses RLS
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Use for:
// - System tables (ai_runs, audit_log)
// - Bulk operations
// - Admin tasks

await supabaseAdmin.from('ai_runs').insert({
  user_id: user.id,
  org_id: profile.org_id,
  agent_name: 'ProfileExtractor',
  // ...
})
```

## Direct Postgres Connection

### Connection Pooling

```typescript
import { Pool } from 'npm:postgres@v0.17.0'

// Create pool with single connection (edge-friendly)
const pool = new Pool(Deno.env.get('SUPABASE_DB_URL')!, 1)

Deno.serve(async (req: Request) => {
  const connection = await pool.connect()

  try {
    const result = await connection.queryObject`
      SELECT * FROM tasks
      WHERE org_id = ${orgId}
      LIMIT 10
    `

    return Response.json(result.rows)

  } finally {
    // CRITICAL: Always release connection
    connection.release()
  }
})
```

### Connection Best Practices

- Use **single connection** per function instance
- Always release in `finally` block
- Use connection pooler port **6543** (not 5432)
- Functions are short-lived, no large pools needed

## Error Handling

```typescript
try {
  const { data, error } = await supabase.from('tasks').select('*')

  if (error) {
    console.error('Database error:', error)

    // Handle specific errors
    if (error.code === '23505') {  // Unique violation
      return Response.json({ error: 'Duplicate entry' }, { status: 409 })
    }

    return Response.json({ error: 'Database error' }, { status: 500 })
  }

  return Response.json({ data })

} catch (error) {
  console.error('Unexpected error:', error)
  return Response.json({ error: 'Internal error' }, { status: 500 })
}
```

## Query Patterns

### Select with Filters

```typescript
const { data } = await supabase
  .from('tasks')
  .select('id, title, status, assigned_to(name)')
  .eq('org_id', profile.org_id)
  .eq('status', 'active')
  .order('created_at', { ascending: false })
  .limit(50)
```

### Insert

```typescript
const { data, error } = await supabase
  .from('tasks')
  .insert({
    org_id: profile.org_id,
    title: 'New Task',
    status: 'pending',
    created_by: user.id
  })
  .select()
  .single()
```

### Update

```typescript
const { data, error } = await supabase
  .from('tasks')
  .update({ status: 'completed', completed_at: new Date().toISOString() })
  .eq('id', taskId)
  .eq('org_id', profile.org_id)  // Security: verify ownership
  .select()
  .single()
```

### Delete

```typescript
const { error } = await supabase
  .from('tasks')
  .delete()
  .eq('id', taskId)
  .eq('org_id', profile.org_id)  // Security: verify ownership
```

### Upsert

```typescript
const { data, error } = await supabase
  .from('settings')
  .upsert({
    user_id: user.id,
    key: 'theme',
    value: 'dark'
  }, { onConflict: 'user_id,key' })
  .select()
```

## Using Drizzle ORM

```typescript
import { drizzle } from 'npm:drizzle-orm@0.29.1/postgres-js'
import postgres from 'npm:postgres@3.4.3'

const connectionString = Deno.env.get('SUPABASE_DB_URL')!

Deno.serve(async (req: Request) => {
  // Disable prefetch for Transaction pool mode
  const client = postgres(connectionString, { prepare: false })
  const db = drizzle(client)

  const tasks = await db.select().from(tasks)

  return Response.json(tasks)
})
```

## SSL Connections

- **Production**: Automatic SSL, no configuration needed
- **Local Development**: May need SSL certificate

```bash
# Local dev with SSL
SSL_CERT_FILE=/path/to/cert.crt
DENO_TLS_CA_STORE=mozilla,system
```

## Anti-Patterns

```typescript
// DON'T create pool per request
Deno.serve(async (req: Request) => {
  const pool = new Pool(...)  // Creates new pool each time!
})

// DON'T forget to release connection
const connection = await pool.connect()
const result = await connection.query(...)
// Missing: connection.release()

// DON'T use direct port in production
new Pool({ port: 5432 })  // Use 6543 (pooler) instead

// DON'T expose service role key to client
return Response.json({ key: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') })
```
