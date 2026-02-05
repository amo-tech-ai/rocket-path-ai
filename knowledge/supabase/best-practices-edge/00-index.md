# Supabase Edge Functions - Best Practices Guide

**Version:** 1.0  
**Date:** January 27, 2025  
**Status:** ✅ Production-Ready  
**Source:** Official Supabase Documentation + Project-Specific Patterns

---

## Overview

This guide provides comprehensive best practices for developing, deploying, and maintaining Supabase Edge Functions. It's based on official Supabase documentation and tailored for StartupAI's architecture.

---

## Document Structure

| Document | Title | Focus |
|----------|-------|-------|
| [01-architecture-setup.md](./01-architecture-setup.md) | Architecture & Setup | Function structure, Deno runtime, project organization |
| [02-security-authentication.md](./02-security-authentication.md) | Security & Authentication | JWT verification, secrets management, auth patterns |
| [03-dependencies-management.md](./03-dependencies-management.md) | Dependencies Management | npm/JSR imports, deno.json, versioning |
| [04-error-handling.md](./04-error-handling.md) | Error Handling | HTTP status codes, error responses, client-side handling |
| [05-routing-patterns.md](./05-routing-patterns.md) | Routing Patterns | Single function routing, Hono framework, URL patterns |
| [06-database-connections.md](./06-database-connections.md) | Database Connections | Supabase client, Postgres pools, RLS enforcement |
| [07-storage-integration.md](./07-storage-integration.md) | Storage Integration | File uploads, cache-first patterns, CDN |
| [08-background-tasks.md](./08-background-tasks.md) | Background Tasks | Async operations, waitUntil, cleanup |
| [09-ai-integration.md](./09-ai-integration.md) | AI Integration | Gemini 3 API, structured outputs, cost tracking |
| [10-deployment.md](./10-deployment.md) | Deployment | CI/CD, environment variables, production config |
| [11-testing.md](./11-testing.md) | Testing | Unit tests, local testing, Deno test runner |
| [12-debugging-logging.md](./12-debugging-logging.md) | Debugging & Logging | Chrome DevTools, console logging, production logs |
| [13-performance-optimization.md](./13-performance-optimization.md) | Performance Optimization | Cold starts, connection pooling, caching |

---

## Quick Reference

### Essential Patterns

**Basic Function Structure:**
```typescript
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  // JWT verification
  // Business logic
  // Database operations
  // Return response
})
```

**Security:**
- ✅ Always verify JWT (unless public webhook)
- ✅ Use `SUPABASE_SERVICE_ROLE_KEY` for admin operations
- ✅ Store secrets in Supabase Dashboard, not code

**Dependencies:**
- ✅ Use `npm:` prefix for npm packages
- ✅ Always specify versions: `npm:package@1.2.3`
- ✅ Use `deno.json` per function for isolation

**Error Handling:**
- ✅ Return proper HTTP status codes
- ✅ Include helpful error messages
- ✅ Log errors to console for debugging

---

## Project-Specific Patterns

### AI Agent Functions

For StartupAI's AI agent functions (ProfileExtractor, RiskAnalyzer, etc.):

```typescript
// Pattern: Action-based routing in ai-helper
const action = await req.json().action
switch (action) {
  case 'wizard_extract_startup':
    return await handleExtractStartup(req)
  case 'analyze_risks':
    return await handleAnalyzeRisks(req)
  // ...
}
```

### Cost Tracking

All AI functions must log to `ai_runs` table:

```typescript
await supabase.from('ai_runs').insert({
  user_id,
  org_id,
  agent_name: 'ProfileExtractor',
  action: 'wizard_extract_startup',
  model: 'gemini-3-pro-preview',
  input_tokens: 1000,
  output_tokens: 500,
  cost_usd: 0.001,
  duration_ms: 2000,
  status: 'success'
})
```

---

## Cross-References

- **Schema Documentation:** [`../01-new-supabase.md`](../01-new-supabase.md)
- **Production Plan:** [`../02-production-ready-plan.md`](../02-production-ready-plan.md)
- **Edge Functions Overview:** [`../03-edge-functions.md`](../03-edge-functions.md)
- **Cursor Rules:** [`../../.cursor/rules/supabase/writing-supabase-edge-functions.mdc`](../../.cursor/rules/supabase/writing-supabase-edge-functions.mdc)

---

## Related Documentation

- **Database Best Practices:** [`../database-best-practices/`](../database-best-practices/)
- **Schema Documentation:** [`../01-new-supabase.md`](../01-new-supabase.md)
- **Edge Functions Overview:** [`../03-edge-functions.md`](../03-edge-functions.md)

---

**Last Updated:** January 27, 2025  
**Maintained By:** Engineering Team
