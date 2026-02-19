# Edge Functions Security

## JWT Verification

### Using Supabase Client (Recommended)

```typescript
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  const authHeader = req.headers.get('Authorization')!

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  // Verify JWT and get user
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return Response.json({ error: 'Invalid JWT' }, { status: 401 })
  }

  // Proceed with user context
})
```

### Manual JWT Verification (Advanced)

```typescript
import * as jose from "jsr:@panva/jose@6"

const SUPABASE_JWT_ISSUER = Deno.env.get("SUPABASE_URL") + "/auth/v1"
const SUPABASE_JWT_KEYS = jose.createRemoteJWKSet(
  new URL(Deno.env.get("SUPABASE_URL")! + "/auth/v1/.well-known/jwks.json")
)

async function verifyJWT(token: string) {
  return jose.jwtVerify(token, SUPABASE_JWT_KEYS, {
    issuer: SUPABASE_JWT_ISSUER,
  })
}
```

## Secrets Management

### Local Development

```bash
# supabase/functions/.env
GEMINI_API_KEY=your-api-key
STRIPE_SECRET_KEY=sk_test_...
```

### Production

```bash
# Via CLI
supabase secrets set GEMINI_API_KEY=your-key

# From file
supabase secrets set --env-file .env

# List secrets
supabase secrets list
```

### Access in Function

```typescript
const apiKey = Deno.env.get('GEMINI_API_KEY')
if (!apiKey) {
  throw new Error('GEMINI_API_KEY not set')
}
```

### Security Anti-Patterns

```typescript
// DON'T hardcode secrets
const apiKey = 'sk-1234567890'

// DON'T log secrets
console.log('Key:', Deno.env.get('GEMINI_API_KEY'))

// DON'T expose in response
return Response.json({ apiKey: Deno.env.get('GEMINI_API_KEY') })
```

## API Key Selection

| Operation | Key | RLS |
|-----------|-----|-----|
| User operations | `SUPABASE_ANON_KEY` | Enforced |
| Admin operations | `SUPABASE_SERVICE_ROLE_KEY` | Bypassed |
| External APIs | Custom secrets | N/A |

### User Operations (RLS Enforced)

```typescript
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!,
  { global: { headers: { Authorization: authHeader } } }
)

// RLS policies apply - user sees only their data
const { data } = await supabase.from('tasks').select('*')
```

### Admin Operations (Bypass RLS)

```typescript
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Use for system tables, bulk operations
await supabaseAdmin.from('ai_runs').insert({...})
```

## Public Webhooks

### Disable JWT Verification

```toml
# supabase/config.toml
[functions.stripe-webhook]
verify_jwt = false
```

### Verify Webhook Signature Instead

```typescript
import Stripe from 'npm:stripe@14'

const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY')!)

Deno.serve(async (req: Request) => {
  const signature = req.headers.get('Stripe-Signature')
  const body = await req.text()

  // Verify Stripe signature
  const event = await stripe.webhooks.constructEventAsync(
    body,
    signature!,
    Deno.env.get('STRIPE_WEBHOOK_SECRET')!
  )

  // Process webhook
  return Response.json({ ok: true })
})
```

## CORS Configuration

### Basic CORS Headers

```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

Deno.serve(async (req: Request) => {
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Include in all responses
  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
})
```

### Production CORS (Restricted)

```typescript
const allowedOrigins = [
  'https://yourdomain.com',
  'https://www.yourdomain.com'
]

const origin = req.headers.get('Origin')
const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigins.includes(origin || '')
    ? origin!
    : 'null',
  // ...
}
```

## Multi-Tenant Security

```typescript
// Get user's org_id
const { data: profile } = await supabase
  .from('profiles')
  .select('org_id')
  .eq('id', user.id)
  .single()

// All queries filtered by org_id
const { data } = await supabase
  .from('tasks')
  .select('*')
  .eq('org_id', profile.org_id)
```

## Security Checklist

- [ ] JWT verified (unless webhook)
- [ ] Secrets in env vars, not code
- [ ] Service role key never exposed to client
- [ ] CORS headers configured
- [ ] Input validation implemented
- [ ] Webhook signatures verified
- [ ] Org isolation enforced
