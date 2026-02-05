# Edge Functions Routing Patterns Best Practices

**Document:** 05-routing-patterns.md  
**Version:** 1.0  
**Date:** January 27, 2025  
**Source:** [Handling Routing](https://supabase.com/docs/guides/functions/routing)

---

## Overview

Edge Functions can handle multiple routes in a single function to reduce cold starts and improve performance. This guide covers routing patterns using Hono, Oak, or manual routing.

---

## Why Combine Routes?

### Benefits

- ✅ **Reduced Cold Starts** - One function stays warm for multiple endpoints
- ✅ **Better Performance** - Fewer function instances needed
- ✅ **Simpler Deployment** - Fewer functions to manage
- ✅ **Shared Code** - Common utilities, auth, error handling

### When to Combine

- ✅ Related operations (CRUD for same resource)
- ✅ Multiple actions in same domain (AI operations)
- ✅ Operations with shared dependencies

---

## Routing with Hono (Recommended)

### ✅ CORRECT: Hono Framework

```typescript
// supabase/functions/ai-helper/index.ts
import { Hono } from 'npm:hono@4.0.0'
import { cors } from 'npm:hono@4.0.0/cors'

const app = new Hono()

// CORS middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['authorization', 'x-client-info', 'apikey', 'content-type'],
}))

// Auth middleware
app.use('*', async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  // Verify JWT...
  await next()
})

// Routes
app.post('/hello-world', async (c) => {
  const { name } = await c.req.json()
  return c.json({ message: `Hello ${name}!` })
})

app.get('/hello-world', (c) => {
  return c.json({ message: 'Hello World!' })
})

// Action-based routing (for AI helper)
app.post('/ai-helper', async (c) => {
  const { action, payload } = await c.req.json()
  
  switch (action) {
    case 'wizard_extract_startup':
      return await handleExtractStartup(c, payload)
    case 'analyze_risks':
      return await handleAnalyzeRisks(c, payload)
    default:
      return c.json({ error: 'Unknown action' }, 400)
  }
})

Deno.serve(app.fetch)
```

**Note:** Paths must be prefixed with function name: `/ai-helper/hello-world`

---

## Manual Routing (Simple Cases)

### ✅ CORRECT: URL Pattern API

```typescript
Deno.serve(async (req: Request) => {
  const url = new URL(req.url)
  const method = req.method
  const pathname = url.pathname

  // Extract function name prefix
  const functionName = 'ai-helper'
  const route = pathname.replace(`/functions/v1/${functionName}`, '') || '/'

  // Route patterns
  const extractPattern = new URLPattern({ pathname: '/extract/:id' })
  const analyzePattern = new URLPattern({ pathname: '/analyze' })

  try {
    // Match routes
    if (method === 'POST' && route === '/extract') {
      return await handleExtract(req)
    }
    
    if (method === 'POST' && route === '/analyze') {
      return await handleAnalyze(req)
    }

    // Default/fallback
    return new Response(JSON.stringify({ error: 'Route not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
```

---

## Action-Based Routing (AI Functions)

### ✅ CORRECT: Action-Based Pattern

**Best for:** AI helper functions with multiple actions

```typescript
// supabase/functions/ai-helper/index.ts
Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse action from body
    const { action, payload } = await req.json()

    // Route to handler
    const handlers: Record<string, (payload: any) => Promise<Response>> = {
      'wizard_extract_startup': handleExtractStartup,
      'wizard_analyze_readiness': handleAnalyzeReadiness,
      'wizard_generate_tasks': handleGenerateTasks,
      'analyze_risks': handleAnalyzeRisks,
      'generate_content': handleGenerateContent,
    }

    const handler = handlers[action]
    if (!handler) {
      return new Response(JSON.stringify({
        error: 'Unknown action',
        availableActions: Object.keys(handlers)
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Execute handler
    return await handler(payload)

  } catch (error) {
    console.error('Routing error:', error)
    return new Response(JSON.stringify({
      error: 'Internal Server Error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
```

**Benefits:**
- ✅ Single function for all AI operations
- ✅ Easy to add new actions
- ✅ Consistent error handling
- ✅ Shared authentication

---

## Route Parameters

### ✅ CORRECT: Extract Parameters

```typescript
// Using URL Pattern API
const taskPattern = new URLPattern({ pathname: '/tasks/:taskId' })
const matchingPath = taskPattern.exec(url)
const taskId = matchingPath?.pathname.groups.taskId

// Using Hono
app.get('/tasks/:taskId', async (c) => {
  const taskId = c.req.param('taskId')
  // ...
})

// Manual parsing
const pathParts = url.pathname.split('/')
const taskId = pathParts[pathParts.length - 1]
```

---

## Best Practices Summary

### ✅ DO

1. **Combine related routes** - Reduce cold starts
2. **Use Hono for complex routing** - Clean, maintainable
3. **Prefix paths with function name** - Required for routing
4. **Handle OPTIONS requests** - CORS preflight
5. **Validate route parameters** - Don't trust client input
6. **Use action-based routing** - For AI/API functions
7. **Return 404 for unknown routes** - Clear error messages
8. **Share middleware** - Auth, CORS, logging

### ❌ DON'T

1. **Don't create separate functions** - For related operations
2. **Don't forget function name prefix** - Routes won't work
3. **Don't skip OPTIONS handling** - CORS will fail
4. **Don't trust route parameters** - Always validate
5. **Don't mix routing patterns** - Choose one approach
6. **Don't ignore 404s** - Return proper error responses

---

## Project-Specific Pattern

### AI Helper Function Routing

```typescript
// supabase/functions/ai-helper/index.ts
const actionHandlers = {
  // Wizard actions
  'wizard_extract_startup': handleExtractStartup,
  'wizard_analyze_readiness': handleAnalyzeReadiness,
  'wizard_generate_tasks': handleGenerateTasks,
  
  // Analysis actions
  'analyze_risks': handleAnalyzeRisks,
  'analyze_context': handleAnalyzeContext,
  
  // Generation actions
  'generate_content': handleGenerateContent,
  'generate_image': handleGenerateImage,
}

Deno.serve(async (req: Request) => {
  const { action, payload } = await req.json()
  const handler = actionHandlers[action]
  
  if (!handler) {
    return badRequest(`Unknown action: ${action}`)
  }
  
  return await handler(payload)
})
```

---

## References

- **Official Docs:** [Handling Routing](https://supabase.com/docs/guides/functions/routing)
- **Next:** [06-database-connections.md](./06-database-connections.md)

---

**Last Updated:** January 27, 2025
