# Supabase Edge Functions — Skill Reference

**Version:** 2.1 | **Updated:** 2026-02-12
**Runtime:** Deno (Supabase Edge Runtime)
**Project:** StartupAI — 42+ edge functions deployed

---

## When to Use This Skill

Use when writing, reviewing, debugging, or deploying Supabase Edge Functions.
Covers: architecture, security, AI integration, background tasks, performance.

---

## Critical Rules (Project-Specific)

### C1: AbortSignal.timeout() is Broken on Deno Deploy
`AbortSignal.timeout()` does NOT reliably abort `response.json()` body reads.
Gemini sends headers fast but streams body over 30-60s.
**Fix:** Wrap fetch+parse in `Promise.race` with hard timeout. See `_shared/gemini.ts`.

### C2: Always Verify JWT
Every function must verify JWT unless it's a public webhook.
```typescript
const { data: { user }, error } = await supabase.auth.getUser();
if (error || !user) {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
}
```
Config: `verify_jwt = true` in `config.toml` for all functions.

### C3: CORS via Shared Helper
Never hardcode `"*"` for CORS. Use `_shared/cors.ts`:
```typescript
import { corsHeaders, getCorsHeaders, handleCors, withCors } from "../_shared/cors.ts";

// Option A: Manual (most common)
if (req.method === "OPTIONS") {
  return new Response("ok", { headers: getCorsHeaders(req) });
}
return new Response(JSON.stringify(data), {
  headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
});

// Option B: handleCors helper
const corsResponse = handleCors(req);
if (corsResponse) return corsResponse;
// ... then wrap final response:
return withCors(new Response(JSON.stringify(data)), req);
```
Set `ALLOWED_ORIGINS` env var (comma-separated) to restrict origins in production.
Falls back to `*` if unset (dev mode).

### C4: Gemini API via Shared Helper
Never call Gemini directly. Use `_shared/gemini.ts`:
```typescript
import { callGemini, extractJSON } from "../_shared/gemini.ts";
// Signature: callGemini(model, systemPrompt, userPrompt, options?)
const result = await callGemini(
  "gemini-3-flash-preview",
  systemPrompt,
  input,
  {
    responseJsonSchema: myJsonSchema,  // G1: guaranteed JSON
    timeoutMs: 25000,
    maxOutputTokens: 4096,
    // temperature defaults to 1.0 (G2: never lower for Gemini 3)
  }
);
const parsed = extractJSON(result.text);
```

### C5: Paid Plan Timeout = 400s
Wall-clock limit is 400s (not 150s). Pipeline deadline: 300s.
Use `EdgeRuntime.waitUntil()` for background work after response.

### C6: Dependencies
- Use `npm:` prefix: `import { GoogleGenAI } from "npm:@google/genai@^1.0.0"`
- API key via env: `Deno.env.get("GEMINI_API_KEY")`
- Supabase client: `npm:@supabase/supabase-js@2`
- Never use `esm.sh` — use `npm:` or `jsr:` only

---

## Function Architecture

### Standard Pattern
```
supabase/functions/
├── _shared/              # Shared modules
│   ├── gemini.ts         # callGemini + extractJSON
│   ├── cors.ts           # CORS headers
│   └── rate-limit.ts     # Rate limiting
├── my-function/
│   ├── index.ts          # Entry point (Deno.serve)
│   └── prompt.ts         # System prompts + JSON schemas
```

### Entry Point Template
```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, getCorsHeaders } from "../_shared/cors.ts";
import { callGemini, extractJSON } from "../_shared/gemini.ts";
import { SYSTEM_PROMPT, RESPONSE_SCHEMA } from "./prompt.ts";

Deno.serve(async (req: Request) => {
  // Use getCorsHeaders(req) for dynamic origin checking, or static corsHeaders
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }
  const headers = { ...getCorsHeaders(req), "Content-Type": "application/json" };
  try {
    // Use ANON_KEY (not SERVICE_ROLE_KEY) to enforce RLS with user's JWT
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );
    // Option A: Full user object (recommended for most cases)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    // Option B: Lightweight claims-only (newer API, avoids DB round-trip)
    // const { data: claims, error: authError } = await supabase.auth.getClaims(req.headers.get("Authorization")!.replace("Bearer ", ""));
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers,
      });
    }
    const body = await req.json();
    // ... business logic ...
    return new Response(JSON.stringify({ success: true, data: result }), { headers });
  } catch (err) {
    console.error("[my-function] Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers,
    });
  }
});
```

### Prompt File Template (`prompt.ts`)
```typescript
export const SYSTEM_PROMPT = `You are an AI assistant...`;

export const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    result: { type: "string" },
    confidence: { type: "number" },
  },
  required: ["result", "confidence"],
};
```

---

## Reference Documents

| # | File | Topic |
|---|------|-------|
| 01 | `references/01-architecture-setup.md` | Function structure, Deno runtime |
| 02 | `references/02-security-authentication.md` | JWT, secrets, auth patterns |
| 03 | `references/03-dependencies-management.md` | npm/JSR imports, versioning |
| 04 | `references/04-error-handling.md` | HTTP status codes, error responses |
| 05 | `references/05-routing-patterns.md` | URL patterns, Hono framework |
| 06 | `references/06-database-connections.md` | Supabase client, RLS enforcement |
| 07 | `references/07-storage-integration.md` | File uploads, CDN |
| 08 | `references/08-background-tasks.md` | waitUntil, async operations |
| 09 | `references/09-ai-integration.md` | Gemini 3 API, structured outputs |
| 10 | `references/10-deployment.md` | CI/CD, env vars, production |
| 11 | `references/11-testing.md` | Unit tests, Deno test runner |
| 12 | `references/12-debugging-logging.md` | DevTools, logging |
| 13 | `references/13-performance-optimization.md` | Cold starts, caching |
| 14 | `references/14-ai-agents.md` | AI agent function patterns |
| 15 | `references/15-wizard-functions.md` | Wizard/pipeline functions |
| 16 | `references/16-dashboard-functions.md` | Dashboard data functions |
| 18 | `references/18-advanced-patterns.md` | Advanced patterns |

---

## Deployed Functions (42+)

### Validator Pipeline
- `validator-start` — 7-agent pipeline (Extractor, Research, Competitors, Scoring, MVP, Composer, Verifier)
- `validator-status` — Poll pipeline progress
- `validator-followup` — Chat follow-up agent (Gemini Flash)
- `validator-regenerate` — Re-run single report sections
- `validator-orchestrate` — v3 pipeline entry (not yet wired)

### AI Agents (Migrated Grade-D → Grade-A)
- `insights-generator` — Business insights + readiness + outcomes
- `task-agent` — Task generation
- `crm-agent` — CRM operations
- `event-agent` — Event management
- `documents-agent` — Document analysis
- `investor-agent` — Investor matching
- `sprint-agent` — Sprint task generation (AI kanban)

### Other
- `ai-chat` — General AI chat (Promise.race hardened)
- `ai-helper` — Action-based AI routing
- `experiment-agent` — A/B experiments (shared callGemini)
- `profile-import` — LinkedIn import
- `opportunity-canvas` — Opportunity analysis (shared callGemini)
- `market-research` — Market data (shared callGemini)
- `lean-canvas-agent` — Canvas generation (Promise.race hardened)
- `health-scorer` — Startup health score calculation
- `onboarding-agent` — Guided onboarding
- `industry-expert-agent` — Industry-specific advice
- `load-knowledge` — RAG chunk ingestion
- `workflow-trigger` — Workflow automation

---

## AI Cost Tracking

All AI functions must log to `ai_runs`:
```typescript
await supabase.from("ai_runs").insert({
  user_id: user.id,
  org_id,
  agent_name: "my-agent",
  action: "my-action",
  model: "gemini-3-flash-preview",
  input_tokens,
  output_tokens,
  cost_usd,
  duration_ms,
  status: "success",
});
```
