# Edge Functions Security & Authentication Best Practices

**Document:** 02-security-authentication.md  
**Version:** 1.0  
**Date:** February 2026  
**Source:** [Supabase Edge Functions Auth](https://supabase.com/docs/guides/functions/auth)

---

## Overview

Security is critical for Edge Functions. This guide covers JWT verification, secrets management, and authentication patterns following Supabase best practices.

---

## JWT Verification

### ✅ CORRECT: Manual JWT Verification (Advanced)

**Why:** For projects using new JWT Signing Keys or JWKS rotation, manual verification via `jose` provides more control. The `verify_jwt` config flag remains the standard approach for most projects.

```typescript
// supabase/functions/_shared/jwt/default.ts
import * as jose from "jsr:@panva/jose@6"
import { createClient } from 'npm:@supabase/supabase-js@2'

const SUPABASE_JWT_ISSUER = Deno.env.get("SB_JWT_ISSUER") ??
  Deno.env.get("SUPABASE_URL") + "/auth/v1"

const SUPABASE_JWT_KEYS = jose.createRemoteJWKSet(
  new URL(Deno.env.get("SUPABASE_URL")! + "/auth/v1/.well-known/jwks.json"),
)

function getAuthToken(req: Request): string {
  const authHeader = req.headers.get("authorization")
  if (!authHeader) {
    throw new Error("Missing authorization header")
  }
  
  const [bearer, token] = authHeader.split(" ")
  if (bearer !== "Bearer") {
    throw new Error(`Auth header is not 'Bearer {token}'`)
  }
  
  return token
}

async function verifySupabaseJWT(jwt: string) {
  return jose.jwtVerify(jwt, SUPABASE_JWT_KEYS, {
    issuer: SUPABASE_JWT_ISSUER,
  })
}

// Middleware pattern
export async function AuthMiddleware(
  req: Request,
  next: (req: Request) => Promise<Response>,
) {
  if (req.method === "OPTIONS") return await next(req)

  try {
    const token = getAuthToken(req)
    const isValidJWT = await verifySupabaseJWT(token)

    if (isValidJWT) return await next(req)

    return Response.json({ msg: "Invalid JWT" }, { status: 401 })
  } catch (e) {
    return Response.json({ msg: e?.toString() }, { status: 401 })
  }
}
```

### ✅ CORRECT: Using Supabase Client (Simpler)

```typescript
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  const authHeader = req.headers.get('Authorization')!
  const token = authHeader.replace('Bearer ', '')

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_PUBLISHABLE_KEY')! // or SUPABASE_ANON_KEY
  )

  // Verify JWT and get user
  const { data, error } = await supabase.auth.getClaims(token)
  const userEmail = data?.claims?.email
  
  if (!userEmail || error) {
    return Response.json({ msg: 'Invalid JWT' }, { status: 401 })
  }

  // Function logic here
  return Response.json({ message: `hello ${userEmail}` })
})
```

### ⚠️ Legacy: verify_jwt Flag (Deprecated)

```toml
# supabase/config.toml
# ⚠️ Legacy approach - being deprecated
[functions.my-function]
verify_jwt = true  # Default, but moving to manual verification
```

**Status:** Still works but manual verification is recommended for new JWT Signing Keys.

---

## Secrets Management

### ✅ CORRECT: Store Secrets Securely

**Local Development:**
```bash
# supabase/functions/.env (or function-specific)
GEMINI_API_KEY=your-api-key-here
STRIPE_SECRET_KEY=sk_test_...
```

**Never commit .env files:**
```bash
# .gitignore
.env
.env.local
supabase/functions/.env
```

**Production:**
```bash
# Via Dashboard: Settings → Edge Functions → Secrets

# Via CLI:
supabase secrets set GEMINI_API_KEY=your-api-key
supabase secrets set STRIPE_SECRET_KEY=sk_live_...

# Or from file:
supabase secrets set --env-file .env
```

### ✅ CORRECT: Access Secrets in Functions

```typescript
// ✅ CORRECT: Get secret with validation
const apiKey = Deno.env.get('GEMINI_API_KEY')
if (!apiKey) {
  throw new Error('GEMINI_API_KEY environment variable is required')
}

// ✅ CORRECT: Use in API calls
const response = await fetch('https://api.example.com', {
  headers: {
    'Authorization': `Bearer ${apiKey}`
  }
})
```

### ❌ WRONG: Security Anti-Patterns

```typescript
// ❌ WRONG: Hardcode secrets
const apiKey = 'sk-1234567890'  // Never do this!

// ❌ WRONG: Log secrets
console.log('API Key:', Deno.env.get('GEMINI_API_KEY'))  // Security risk!

// ❌ WRONG: Expose in response
return Response.json({ apiKey: Deno.env.get('GEMINI_API_KEY') })  // Never!
```

---

## API Key Selection

### ✅ CORRECT: Key Selection Guide

| Operation | Key Type | Why |
|-----------|----------|-----|
| **User-facing operations** | `SUPABASE_ANON_KEY` or `SUPABASE_PUBLISHABLE_KEY` | Respects RLS policies |
| **Admin operations** | `SUPABASE_SERVICE_ROLE_KEY` | Bypasses RLS (server-side only) |
| **External API calls** | Custom secrets (e.g., `GEMINI_API_KEY`) | Third-party services |

### ✅ CORRECT: User-Facing Operations

```typescript
// ✅ CORRECT: Use anon key for user operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!,  // Respects RLS
  {
    global: { headers: { Authorization: req.headers.get('Authorization')! } }
  }
)

// This respects RLS policies
const { data } = await supabase
  .from('tasks')
  .select('*')
  .eq('user_id', user.id)  // RLS ensures user only sees their tasks
```

### ✅ CORRECT: Admin Operations

```typescript
// ✅ CORRECT: Use service role key for admin operations
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!  // Bypasses RLS
)

// Use for:
// - Writing to ai_runs table (system operation)
// - Bulk operations
// - Admin tasks

// ⚠️ CRITICAL: Never expose service role key to client!
```

---

## Public Functions (Webhooks)

### ✅ CORRECT: Disable JWT for Public Webhooks

**Use Case:** Stripe webhooks, GitHub webhooks, etc.

```toml
# supabase/config.toml
[functions.stripe-webhook]
verify_jwt = false  # Stripe doesn't have user tokens
```

**Function Implementation:**
```typescript
// supabase/functions/stripe-webhook/index.ts
import Stripe from 'npm:stripe@14'

const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY')!)

Deno.serve(async (req: Request) => {
  const signature = req.headers.get('Stripe-Signature')
  const body = await req.text()
  
  // Verify Stripe signature instead of JWT
  const event = await stripe.webhooks.constructEventAsync(
    body,
    signature!,
    Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')!
  )
  
  // Process webhook
  return new Response(JSON.stringify({ ok: true }), { status: 200 })
})
```

**Security:**
- ✅ Verify webhook signature (Stripe, GitHub, etc.)
- ✅ Use webhook signing secrets
- ✅ Don't rely on JWT for third-party webhooks

---

## Multi-Tenant Security

### ✅ CORRECT: Org-Based Isolation

```typescript
// ✅ CORRECT: Always filter by org_id
const { data: { user } } = await supabase.auth.getUser()

// Get user's org_id from profile
const { data: profile } = await supabase
  .from('profiles')
  .select('org_id')
  .eq('id', user.id)
  .single()

// All queries filtered by org_id
const { data: tasks } = await supabase
  .from('tasks')
  .select('*')
  .eq('org_id', profile.org_id)  // Critical: Org isolation
```

### ✅ CORRECT: RLS Enforcement

```typescript
// ✅ CORRECT: Use anon key to enforce RLS
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!,  // RLS enforced
  {
    global: { headers: { Authorization: authHeader } }
  }
)

// RLS policies automatically filter results
const { data } = await supabase.from('tasks').select('*')
// User only sees tasks from their org (RLS policy)
```

---

## CORS Configuration

### ✅ CORRECT: CORS Headers

```typescript
// supabase/functions/_shared/cors.ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',  // Or specific domain
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

// In function
Deno.serve(async (req: Request) => {
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Main handler
  try {
    const result = await processRequest(req)
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
```

### ✅ CORRECT: Production CORS

```typescript
// ✅ CORRECT: Restrict origin in production
const allowedOrigins = [
  'https://yourdomain.com',
  'https://www.yourdomain.com'
]

const origin = req.headers.get('Origin')
const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigins.includes(origin || '') 
    ? origin! 
    : 'null',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}
```

---

## Best Practices Summary

### ✅ DO

1. **Verify JWT manually** - Use jose library or Supabase client
2. **Use service role key** - For admin operations only
3. **Store secrets securely** - Dashboard or CLI, never in code
4. **Filter by org_id** - Multi-tenant isolation
5. **Respect RLS** - Use anon key for user operations
6. **Verify webhook signatures** - For public functions
7. **Include CORS headers** - If calling from browser
8. **Validate all inputs** - Don't trust client data
9. **Log security events** - Failed auth attempts, etc.
10. **Use HTTPS only** - Never expose secrets over HTTP

### ❌ DON'T

1. **Don't expose service role key** - Client-side security risk
2. **Don't hardcode secrets** - Use environment variables
3. **Don't log secrets** - Security risk in logs
4. **Don't skip JWT verification** - Unless public webhook
5. **Don't trust client data** - Always validate
6. **Don't bypass RLS** - Unless admin operation
7. **Don't use wildcard CORS** - Restrict in production
8. **Don't commit .env files** - Add to .gitignore
9. **Don't return secrets** - In error messages or responses
10. **Don't skip input validation** - SQL injection, XSS risks

---

## Project-Specific Security Patterns

### AI Helper Function Security

```typescript
// supabase/functions/ai-helper/index.ts
Deno.serve(async (req: Request) => {
  // 1. CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // 2. JWT verification
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,  // Respects RLS
    { global: { headers: { Authorization: authHeader } } }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return Response.json({ error: 'Invalid JWT' }, { status: 401 })
  }

  // 3. Get user's org_id (for multi-tenant)
  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return Response.json({ error: 'Profile not found' }, { status: 404 })
  }

  // 4. Business logic with org_id
  const { action, payload } = await req.json()
  // All operations use profile.org_id for isolation

  // 5. Cost tracking (admin operation)
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!  // Bypass RLS for system tables
  )

  await supabaseAdmin.from('ai_runs').insert({
    user_id: user.id,
    org_id: profile.org_id,  // Track costs per org
    agent_name: 'ProfileExtractor',
    // ...
  })

  return Response.json({ success: true })
})
```

---

## References

- **Official Docs:** [Securing Edge Functions](https://supabase.com/docs/guides/functions/auth)
- **Official Docs:** [Environment Variables](https://supabase.com/docs/guides/functions/secrets)
- **Next:** [03-dependencies-management.md](./03-dependencies-management.md)

---

**Last Updated:** February 2026
