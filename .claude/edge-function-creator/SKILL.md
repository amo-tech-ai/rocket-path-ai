---
name: edge-function-creator
description: Use when creating, modifying, or deploying Supabase Edge Functions. Triggers on "edge function", "create function", "deploy function", "serverless", "Deno function", "new endpoint".
---

# Edge Function Creator

## Overview

Structured workflow for creating, testing, and deploying Supabase Edge Functions with consistent patterns.

## When to Use

- Creating a new edge function
- Modifying an existing one
- Deploying functions
- Adding AI integration to functions

## Workflow

### Phase 1: Plan

1. Define purpose and actions
2. Identify env vars needed
3. Determine auth (JWT on/off)
4. List Supabase tables accessed
5. Choose AI provider if needed (Gemini Flash = speed, Claude Sonnet = reasoning)

### Phase 2: Create

Structure: `supabase/functions/<name>/index.ts`

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { action, ...params } = await req.json();

    switch (action) {
      case "action_name":
        return handleAction(supabase, params, corsHeaders);
      default:
        return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

### Phase 3: Test

1. Local: `supabase functions serve <name> --env-file .env.local`
2. Curl test with JWT
3. Verify CORS preflight
4. Test error cases (missing auth, invalid action)

### Phase 4: Deploy

1. `supabase functions deploy <name>`
2. Set secrets: `supabase secrets set KEY=value`
3. Verify in Supabase dashboard logs

## Checklist

- [ ] CORS headers on all responses
- [ ] JWT verification enabled by default
- [ ] Action routing via switch
- [ ] Supabase client with user JWT
- [ ] Error handling returns JSON with status codes
- [ ] Env vars via `Deno.env.get()`, never hardcoded
- [ ] Tested locally, deployed and verified

## References

- `.claude/edge-functions/references/ARCHITECTURE.md`
- `.claude/edge-functions/references/AI-INTEGRATION.md`
- `.claude/edge-functions/references/SECURITY.md`
- `.claude/edge-functions/references/ERROR-HANDLING.md`
- `.claude/edge-functions/references/DATABASE.md`
