# Edge Functions Background Tasks Best Practices

**Document:** 08-background-tasks.md  
**Version:** 1.0  
**Date:** February 2026  
**Source:** [Background Tasks](https://supabase.com/docs/guides/functions/background-tasks)

---

## Overview

Background tasks allow Edge Functions to process work asynchronously without blocking the response. Use `EdgeRuntime.waitUntil()` to mark background operations.

---

## Core Pattern

### ✅ CORRECT: waitUntil Pattern

```typescript
import { EdgeRuntime } from 'jsr:@edge-runtime/js@2'

Deno.serve(async (req: Request) => {
  // ✅ CORRECT: Mark background task (don't await!)
  EdgeRuntime.waitUntil(asyncLongRunningTask())

  // Return response immediately
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
})
```

**Key Points:**
- ✅ Don't use `await` - Let it run in background
- ✅ Function stays alive until promise completes
- ✅ Response returns immediately

---

## Common Use Cases

### ✅ CORRECT: Upload to Storage

```typescript
Deno.serve(async (req: Request) => {
  const { imageData } = await req.json()

  // Return response immediately
  const response = new Response(JSON.stringify({ processing: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })

  // Upload in background
  EdgeRuntime.waitUntil(
    supabaseAdmin.storage
      .from('images')
      .upload(`generated/${Date.now()}.png`, imageData)
  )

  return response
})
```

### ✅ CORRECT: Log to Database

```typescript
EdgeRuntime.waitUntil(
  supabaseAdmin.from('ai_runs').insert({
    user_id: user.id,
    org_id: profile.org_id,
    agent_name: 'ProfileExtractor',
    // ...
  })
)
```

### ✅ CORRECT: Send Notifications

```typescript
EdgeRuntime.waitUntil(
  sendEmail({
    to: user.email,
    subject: 'Task completed',
    body: 'Your AI task has finished processing'
  })
)
```

---

## Error Handling

### ✅ CORRECT: Handle Background Errors

```typescript
EdgeRuntime.waitUntil(
  (async () => {
    try {
      await longRunningTask()
    } catch (error) {
      console.error('Background task error:', error)
      // Log to error tracking service
      await logError(error)
    }
  })()
)
```

### ✅ CORRECT: Unhandled Rejection Handler

```typescript
addEventListener('unhandledrejection', (ev) => {
  console.error('Unhandled rejection:', ev.reason)
  ev.preventDefault()  // Prevent default error behavior
})
```

---

## Cleanup on Shutdown

### ✅ CORRECT: beforeunload Handler

```typescript
EdgeRuntime.waitUntil(asyncLongRunningTask())

addEventListener('beforeunload', (ev) => {
  console.log('Function shutting down:', ev.detail?.reason)
  // Save state, log progress, cleanup
})
```

---

## Best Practices

### ✅ DO

1. **Use waitUntil for async ops** - Don't block response
2. **Handle errors in background** - Try-catch in background task
3. **Log background operations** - For debugging
4. **Set timeouts** - Prevent infinite tasks
5. **Use cleanup handlers** - Save state on shutdown

### ❌ DON'T

1. **Don't await waitUntil** - Defeats the purpose
2. **Don't ignore errors** - Always handle
3. **Don't run heavy tasks** - Move to background workers
4. **Don't forget cleanup** - Save state on shutdown

---

## References

- **Official Docs:** [Background Tasks](https://supabase.com/docs/guides/functions/background-tasks)
- **Next:** [09-ai-integration.md](./09-ai-integration.md)

---

**Last Updated:** February 2026
