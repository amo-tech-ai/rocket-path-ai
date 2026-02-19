# Edge Functions Architecture

## How Edge Functions Work

```
Request → Global API Gateway → Edge Location → V8 Isolate → Function → Response
```

- **Global Distribution**: Functions replicated to all edge locations
- **V8 Isolates**: Lightweight, isolated execution environments
- **ESZip Bundles**: Compact module graph for fast loading

## Project Structure

```
supabase/functions/
├── ai-helper/
│   ├── index.ts          # Main handler
│   ├── deno.json         # Function-specific config
│   └── handlers/         # Action handlers (optional)
├── webhook-handler/
│   ├── index.ts
│   └── deno.json
└── _shared/              # Cross-function utilities
    ├── cors.ts           # CORS headers
    ├── errors.ts         # Error helpers
    ├── jwt.ts            # JWT verification
    └── types.ts          # Shared types
```

### Rules

- Each function has its own directory
- Each function has its own `deno.json`
- Shared code in `_shared/` directory
- No cross-dependencies between functions

## Function Configuration

### Per-Function deno.json

```json
{
  "imports": {
    "@supabase/supabase-js": "npm:@supabase/supabase-js@2",
    "@google/genai": "npm:@google/genai@^1.0.0"
  }
}
```

### Config.toml Options

```toml
# Disable JWT for webhooks
[functions.stripe-webhook]
verify_jwt = false

# Custom entrypoint
[functions.legacy]
entrypoint = './functions/legacy/handler.js'
```

## Deno Runtime

### Use Built-in APIs

```typescript
// Use Deno.serve (built-in)
Deno.serve(async (req: Request) => {
  return new Response('Hello')
})

// DON'T use deprecated serve from std
// import { serve } from "https://deno.land/std/http/server.ts"
```

### Use Web APIs

```typescript
// Use fetch (Web API)
const response = await fetch('https://api.example.com')

// Use WebSocket API
const ws = new WebSocket('wss://example.com')
```

### Node APIs When Needed

```typescript
// Use node: prefix for Node built-ins
import { randomBytes } from 'node:crypto'
import process from 'node:process'
```

## Environment Variables

### Auto-Populated (Always Available)

```typescript
Deno.env.get('SUPABASE_URL')
Deno.env.get('SUPABASE_ANON_KEY')
Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
Deno.env.get('SUPABASE_DB_URL')
```

### Custom Secrets

```bash
# Local: supabase/functions/.env
GEMINI_API_KEY=your-key

# Production
supabase secrets set GEMINI_API_KEY=your-key
```

## File System

```typescript
// Write to /tmp only
await Deno.writeTextFile('/tmp/temp.txt', content)

// Read from /tmp
const content = await Deno.readTextFile('/tmp/temp.txt')

// DON'T write to other directories
```

## Cold Starts

### Design for Cold Starts

```typescript
// Keep functions lightweight
Deno.serve(async (req: Request) => {
  // Minimal initialization
  const supabase = createClient(...)

  // Fast execution
  const result = await processRequest(req)

  return new Response(JSON.stringify(result))
})
```

### Combine Actions to Reduce Cold Starts

```typescript
// GOOD: Single function with multiple actions
// ai-helper handles: extract, analyze, generate
// Keeps one function warm

// BAD: Separate function for each action
// extract-function, analyze-function, generate-function
// Each has its own cold start
```

## Deployment

```bash
# Deploy single function
supabase functions deploy ai-helper

# Deploy all functions
supabase functions deploy

# Function URL
# https://{project-ref}.supabase.co/functions/v1/{function-name}
```

### Deployment Checklist

- [ ] Function has `deno.json` with dependencies
- [ ] All secrets set in production
- [ ] JWT verification configured
- [ ] CORS headers included
- [ ] Error handling implemented
- [ ] Logging added for debugging
