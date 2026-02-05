# Edge Functions Architecture & Setup Best Practices

**Document:** 01-architecture-setup.md  
**Version:** 1.0  
**Date:** January 27, 2025  
**Source:** [Supabase Edge Functions Architecture](https://supabase.com/docs/guides/functions/architecture)

---

## Overview

Supabase Edge Functions are serverless TypeScript functions running on Deno, distributed globally at the edge for low latency. This guide covers architecture patterns and setup best practices.

---

## Core Architecture

### How Edge Functions Work

```
Request → Global API Gateway → Edge Location → V8 Isolate → Function Execution → Response
```

**Key Components:**
1. **Global API Gateway** - Routes requests to nearest edge location
2. **Edge Locations** - Distributed data centers worldwide
3. **V8 Isolates** - Lightweight, isolated execution environments
4. **ESZip Bundles** - Compact module graph for fast loading

### Architecture Benefits

- ✅ **Low Latency** - Code runs close to users
- ✅ **Automatic Scaling** - Handles variable loads
- ✅ **No Infrastructure** - Supabase manages everything
- ✅ **Global Distribution** - Functions replicated to all edge locations

---

## Project Structure

### ✅ CORRECT: Function Organization

```
supabase/
└── functions/
    ├── ai-helper/
    │   ├── index.ts          # Main handler
    │   ├── deno.json         # Function-specific config
    │   └── _shared/          # Shared utilities (if needed)
    ├── chat-copilot/
    │   ├── index.ts
    │   └── deno.json
    └── _shared/              # Cross-function utilities
        ├── jwt.ts            # JWT verification
        ├── types.ts          # Shared types
        └── utils.ts          # Utility functions
```

**Rules:**
- ✅ Each function has its own directory
- ✅ Each function has its own `deno.json`
- ✅ Shared code in `_shared/` directory
- ✅ No cross-dependencies between functions

### ❌ WRONG: Anti-Patterns

```
# ❌ DON'T: Global deno.json for all functions
supabase/functions/deno.json  # Not recommended for deployment

# ❌ DON'T: Cross-function imports
ai-helper/index.ts
  import from '../chat-copilot/utils'  # Breaks isolation

# ❌ DON'T: Mixed function code
supabase/functions/index.ts  # All functions in one file
```

---

## Function Structure

### ✅ CORRECT: Basic Function Template

```typescript
// supabase/functions/ai-helper/index.ts

import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // JWT verification
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      {
        global: { headers: { Authorization: authHeader } }
      }
    )

    // Verify JWT and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid JWT' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Business logic
    const { action, payload } = await req.json()
    
    // Route to handler
    switch (action) {
      case 'wizard_extract_startup':
        return await handleExtractStartup(supabase, user, payload)
      case 'analyze_risks':
        return await handleAnalyzeRisks(supabase, user, payload)
      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

---

## Deno Runtime

### ✅ CORRECT: Use Built-in APIs

```typescript
// ✅ CORRECT: Use Deno.serve (built-in)
Deno.serve(async (req: Request) => {
  return new Response('Hello')
})

// ❌ WRONG: Don't use deprecated serve from std
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
```

### ✅ CORRECT: Use Web APIs

```typescript
// ✅ CORRECT: Use fetch (Web API)
const response = await fetch('https://api.example.com')

// ✅ CORRECT: Use WebSocket API
const ws = new WebSocket('wss://example.com')

// ❌ WRONG: Don't use Node-specific libraries
import axios from 'axios'  // Use fetch instead
```

### ✅ CORRECT: Use Node APIs When Needed

```typescript
// ✅ CORRECT: Use node: prefix for Node built-ins
import { randomBytes } from 'node:crypto'
import process from 'node:process'

// Use when Deno APIs don't exist
const randomString = randomBytes(16).toString('hex')
```

---

## Environment Variables

### Default Secrets (Auto-Populated)

These are automatically available in all Edge Functions:

```typescript
// ✅ Available by default
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const dbUrl = Deno.env.get('SUPABASE_DB_URL')

// ✅ Hosted environment only
const region = Deno.env.get('SB_REGION')
const executionId = Deno.env.get('SB_EXECUTION_ID')
const deploymentId = Deno.env.get('DENO_DEPLOYMENT_ID')
```

### Custom Secrets

**Local Development:**
```bash
# supabase/functions/.env (or function-specific .env)
GEMINI_API_KEY=your-api-key
STRIPE_SECRET_KEY=sk_test_...
```

**Production:**
```bash
# Set via Dashboard or CLI
supabase secrets set GEMINI_API_KEY=your-api-key
supabase secrets set STRIPE_SECRET_KEY=sk_live_...

# Or from .env file
supabase secrets set --env-file .env
```

**Access in Function:**
```typescript
const apiKey = Deno.env.get('GEMINI_API_KEY')
if (!apiKey) {
  throw new Error('GEMINI_API_KEY not set')
}
```

---

## File System Access

### ✅ CORRECT: Temporary Files Only

```typescript
// ✅ CORRECT: Write to /tmp directory
const tempFile = await Deno.writeTextFile(
  '/tmp/generated-image.png',
  imageData
)

// ✅ CORRECT: Read from /tmp
const fileContent = await Deno.readTextFile('/tmp/generated-image.png')

// ❌ WRONG: Don't write to other directories
await Deno.writeTextFile('/data/file.txt', content)  // Will fail
```

---

## Cold Starts & Performance

### Understanding Cold Starts

- **Cold Start:** First request to a function (isolate needs to boot)
- **Warm Start:** Subsequent requests (isolate already running)
- **Duration:** Cold starts are fast (milliseconds) due to ESZip format

### ✅ CORRECT: Design for Cold Starts

```typescript
// ✅ CORRECT: Keep functions lightweight
Deno.serve(async (req: Request) => {
  // Minimal initialization
  const supabase = createClient(...)
  
  // Fast execution
  const result = await processRequest(req)
  
  return new Response(JSON.stringify(result))
})

// ❌ WRONG: Heavy initialization blocks cold start
const heavyLibrary = await import('heavy-library')  // Don't do this at top level
```

### ✅ CORRECT: Combine Actions to Reduce Cold Starts

```typescript
// ✅ CORRECT: Single function with multiple actions
// ai-helper handles: extract_startup, analyze_risks, generate_tasks
// Reduces cold starts by keeping one function warm

// ❌ WRONG: Separate function for each action
// extract-startup, analyze-risks, generate-tasks
// Each has its own cold start
```

---

## Function Configuration

### ✅ CORRECT: Per-Function Config

**supabase/config.toml:**
```toml
# Disable JWT for public webhooks
[functions.stripe-webhook]
verify_jwt = false

# Custom entrypoint
[functions.legacy-processor]
entrypoint = './functions/legacy-processor/index.js'

# Custom import map (legacy, prefer deno.json)
[functions.image-processor]
import_map = './functions/image-processor/import_map.json'
```

**Rules:**
- ✅ Configure per-function in `config.toml`
- ✅ Use `verify_jwt = false` only for public webhooks
- ✅ Prefer `deno.json` over `import_map` in config

---

## Deployment Architecture

### Deployment Process

1. **Bundle Function:**
   ```bash
   supabase functions deploy ai-helper
   ```
   - CLI creates ESZip bundle
   - Includes all dependencies
   - Uploads to Supabase backend

2. **Global Distribution:**
   - Bundle automatically distributed to all edge locations
   - No manual CDN configuration needed

3. **Function URL:**
   ```
   https://{project-ref}.supabase.co/functions/v1/{function-name}
   ```

### ✅ CORRECT: Deployment Checklist

- [ ] Function has `deno.json` with dependencies
- [ ] All secrets set in production
- [ ] JWT verification configured correctly
- [ ] CORS headers included (if needed)
- [ ] Error handling implemented
- [ ] Logging added for debugging

---

## Best Practices Summary

### ✅ DO

1. **Use Deno.serve** - Built-in, no external dependencies
2. **Use Web APIs** - fetch, WebSocket, etc.
3. **Per-function deno.json** - Isolated dependencies
4. **Shared code in _shared/** - Reusable utilities
5. **Write to /tmp only** - File system restrictions
6. **Keep functions lightweight** - Fast cold starts
7. **Combine related actions** - Reduce cold starts
8. **Use service role key** - For admin operations
9. **Verify JWT** - Security first (unless public webhook)
10. **Return proper HTTP codes** - 200, 400, 401, 500

### ❌ DON'T

1. **Don't use deprecated serve** - Use Deno.serve
2. **Don't cross-import functions** - Breaks isolation
3. **Don't write outside /tmp** - Will fail
4. **Don't use global deno.json** - Per-function config
5. **Don't expose service role key** - Client-side security risk
6. **Don't skip JWT verification** - Unless public webhook
7. **Don't use bare specifiers** - Always use npm: or jsr:
8. **Don't forget versions** - Always specify package versions
9. **Don't block on heavy imports** - Lazy load if needed
10. **Don't ignore errors** - Always handle and log

---

## Project-Specific Patterns

### AI Helper Function Pattern

For StartupAI's centralized AI gateway:

```typescript
// supabase/functions/ai-helper/index.ts
Deno.serve(async (req: Request) => {
  // 1. CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // 2. JWT verification
  const user = await verifyJWT(req)
  if (!user) {
    return unauthorized()
  }

  // 3. Parse action
  const { action, payload } = await req.json()

  // 4. Route to handler
  const handler = actionHandlers[action]
  if (!handler) {
    return badRequest('Unknown action')
  }

  // 5. Execute and return
  return await handler(user, payload)
})
```

**Benefits:**
- ✅ Single function stays warm
- ✅ Centralized error handling
- ✅ Consistent logging
- ✅ Cost tracking in one place

---

## References

- **Official Docs:** [Supabase Edge Functions Architecture](https://supabase.com/docs/guides/functions/architecture)
- **Cursor Rules:** [`../../.cursor/rules/supabase/writing-supabase-edge-functions.mdc`](../../.cursor/rules/supabase/writing-supabase-edge-functions.mdc)
- **Next:** [02-security-authentication.md](./02-security-authentication.md)

---

**Last Updated:** January 27, 2025
