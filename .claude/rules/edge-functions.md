---
paths:
  - "supabase/functions/**"
---

# Edge Function Rules

- Deno runtime — use `Deno.serve()`, not Node.js APIs
- Always verify JWT: `const authHeader = req.headers.get('Authorization')` + supabase `auth.getUser()`
- `AbortSignal.timeout()` does NOT work reliably — wrap `fetch().json()` in `Promise.race` with a hard timeout
- Gemini API: use `responseJsonSchema` + `responseMimeType: "application/json"` for guaranteed JSON
- Gemini 3: keep `temperature: 1.0` (lower causes looping)
- API key in `x-goog-api-key` header, never query param
- Paid plan: 400s wall-clock limit. Pipeline deadline: 300s
- Use `EdgeRuntime.waitUntil()` for background work after response
- Import shared code from `../_shared/` (cors.ts, gemini.ts, rate-limit.ts)
- Always call `corsHeaders(req)` and handle OPTIONS preflight
- Never import from `npm:` — use `https://esm.sh/` or vendored deps
