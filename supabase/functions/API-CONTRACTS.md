# Edge Function API Contracts

> **Source:** `tasks/audit/42-edge-audit.md` (forensic audit, 2026-03-22)
> **Last verified:** 2026-03-22 against `supabase/functions/*/index.ts`

## Field Name Convention

| Pattern | Functions | Note |
|---------|----------|------|
| `startup_id` (snake_case) | All except 3 below | Standard convention |
| `startupId` (camelCase) | `health-scorer`, `ai-chat` | Legacy anomaly — do not change (breaking) |

## Method Anomalies

| Function | Method | Note |
|----------|--------|------|
| `validator-status` | **GET** | Only GET function. Returns 405 on POST. Query param: `?session_id=` |
| All others | POST | Standard |

## Response Quirks

| Function | Quirk |
|----------|-------|
| `validator-followup` | **Always returns HTTP 200** — even on error. Caller must check `success` boolean in response body |
| `knowledge-search` | Accepts `Authorization: Bearer <SERVICE_ROLE_KEY>` for internal pipeline callers. User JWT path uses `getUser()` + rate limit |
| `crm-agent` | **No `create_contact` action** — use `enrich_contact` (creates contact as side-effect of enrichment). Requires `name` + `company` or `linkedin_url` |

## Observability Variables (pre-populated on hosted Supabase)

| Variable | Purpose | Use In Logging |
|----------|---------|---------------|
| `SB_REGION` | Function invocation region | `Deno.env.get('SB_REGION')` |
| `SB_EXECUTION_ID` | Unique isolate instance | `Deno.env.get('SB_EXECUTION_ID')` |
| `DENO_DEPLOYMENT_ID` | Function code version | `Deno.env.get('DENO_DEPLOYMENT_ID')` |
