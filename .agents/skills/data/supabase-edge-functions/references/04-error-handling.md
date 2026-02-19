# Edge Functions Error Handling Best Practices

**Document:** 04-error-handling.md  
**Version:** 1.0  
**Date:** February 2026  
**Source:** [Error Handling](https://supabase.com/docs/guides/functions/error-handling)

---

## Overview

Proper error handling makes Edge Functions reliable, debuggable, and production-ready. This guide covers HTTP status codes, error responses, and client-side error handling.

---

## HTTP Status Codes

### ✅ CORRECT: Use Appropriate Status Codes

```typescript
Deno.serve(async (req: Request) => {
  try {
    // 200 OK - Success
    const result = await processRequest(req)
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    // 400 Bad Request - Invalid input
    if (error.name === 'ValidationError') {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 401 Unauthorized - Missing/invalid auth
    if (error.name === 'AuthError') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 404 Not Found - Resource doesn't exist
    if (error.name === 'NotFoundError') {
      return new Response(
        JSON.stringify({ error: 'Resource not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 500 Internal Server Error - Server error
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

### Status Code Reference

| Code | Meaning | Use When |
|------|---------|----------|
| **200** | OK | Request succeeded |
| **201** | Created | Resource created successfully |
| **400** | Bad Request | Invalid input, validation failed |
| **401** | Unauthorized | Missing/invalid JWT |
| **403** | Forbidden | Valid JWT but insufficient permissions |
| **404** | Not Found | Resource doesn't exist |
| **409** | Conflict | Resource conflict (duplicate, etc.) |
| **500** | Internal Server Error | Server error, unexpected failure |
| **502** | Bad Gateway | Upstream service error |
| **503** | Service Unavailable | Service temporarily unavailable |

---

## Error Response Format

### ✅ CORRECT: Consistent Error Format

```typescript
// ✅ CORRECT: Consistent error structure
interface ErrorResponse {
  error: string
  message?: string
  code?: string
  details?: any
}

// Success response
return new Response(JSON.stringify({ 
  success: true,
  data: result 
}), {
  status: 200,
  headers: { 'Content-Type': 'application/json' }
})

// Error response
return new Response(JSON.stringify({
  error: 'Validation failed',
  message: 'Missing required field: email',
  code: 'VALIDATION_ERROR'
}), {
  status: 400,
  headers: { 'Content-Type': 'application/json' }
})
```

### ✅ CORRECT: Error Helper Functions

```typescript
// supabase/functions/_shared/errors.ts

export function badRequest(message: string, details?: any) {
  return new Response(JSON.stringify({
    error: 'Bad Request',
    message,
    details
  }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  })
}

export function unauthorized(message = 'Unauthorized') {
  return new Response(JSON.stringify({
    error: 'Unauthorized',
    message
  }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  })
}

export function notFound(resource: string) {
  return new Response(JSON.stringify({
    error: 'Not Found',
    message: `${resource} not found`
  }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  })
}

export function internalError(error: Error) {
  console.error('Function error:', error)
  return new Response(JSON.stringify({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

**Usage:**
```typescript
import { badRequest, unauthorized, notFound, internalError } from '../_shared/errors.ts'

Deno.serve(async (req: Request) => {
  try {
    const { email } = await req.json()
    if (!email) {
      return badRequest('Missing required field: email')
    }
    // ...
  } catch (error) {
    return internalError(error)
  }
})
```

---

## Try-Catch Patterns

### ✅ CORRECT: Comprehensive Error Handling

```typescript
Deno.serve(async (req: Request) => {
  try {
    // 1. Validate request
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 2. Parse and validate input
    let payload
    try {
      payload = await req.json()
    } catch {
      return badRequest('Invalid JSON in request body')
    }

    if (!payload.action) {
      return badRequest('Missing required field: action')
    }

    // 3. Authenticate
    const user = await verifyJWT(req)
    if (!user) {
      return unauthorized()
    }

    // 4. Business logic
    const result = await processAction(payload, user)

    // 5. Success response
    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    // 6. Error handling
    console.error('Function error:', error)
    
    // Don't expose internal errors to client
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
```

---

## Client-Side Error Handling

### ✅ CORRECT: Handle Different Error Types

```typescript
// Frontend: services/edgeFunctions.ts
import { 
  FunctionsHttpError, 
  FunctionsRelayError, 
  FunctionsFetchError 
} from '@supabase/supabase-js'

export async function callEdgeFunction(action: string, payload: any) {
  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/ai-helper`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, payload })
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new FunctionsHttpError(
        errorData,
        response.status,
        response
      )
    }

    return await response.json()

  } catch (error) {
    if (error instanceof FunctionsHttpError) {
      // Function executed but returned error (4xx/5xx)
      const errorMessage = error.context?.error || error.message
      console.error('Function error:', errorMessage)
      throw new Error(`Function error: ${errorMessage}`)
      
    } else if (error instanceof FunctionsRelayError) {
      // Network issue between client and Supabase
      console.error('Relay error:', error.message)
      throw new Error('Network error: Please try again')
      
    } else if (error instanceof FunctionsFetchError) {
      // Function couldn't be reached
      console.error('Fetch error:', error.message)
      throw new Error('Service unavailable: Please try again later')
      
    } else {
      // Unknown error
      console.error('Unknown error:', error)
      throw new Error('An unexpected error occurred')
    }
  }
}
```

---

## Logging Errors

### ✅ CORRECT: Console Logging

```typescript
Deno.serve(async (req: Request) => {
  try {
    // Log request info (not sensitive data)
    console.log(`[${req.method}] ${new URL(req.url).pathname}`)

    // Business logic
    const result = await processRequest(req)

    // Log success
    console.log('Request processed successfully')

    return new Response(JSON.stringify(result), { status: 200 })

  } catch (error) {
    // ✅ CORRECT: Log full error for debugging
    console.error('Function error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })

    // ❌ WRONG: Don't log sensitive data
    // console.error('Error with API key:', Deno.env.get('GEMINI_API_KEY'))

    return new Response(JSON.stringify({
      error: 'Internal Server Error'
    }), { status: 500 })
  }
})
```

### ✅ CORRECT: Structured Logging

```typescript
// ✅ CORRECT: Structured logs for production
function logError(error: Error, context: Record<string, any>) {
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'error',
    message: error.message,
    stack: error.stack,
    context
  }))
}

// Usage
try {
  // ...
} catch (error) {
  logError(error, {
    action: 'wizard_extract_startup',
    userId: user.id,
    orgId: profile.org_id
  })
  return internalError(error)
}
```

---

## Error Recovery

### ✅ CORRECT: Retry Logic

```typescript
async function callWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
      console.log(`Retry attempt ${i + 1}/${maxRetries}`)
    }
  }
  throw new Error('Max retries exceeded')
}

// Usage
const result = await callWithRetry(async () => {
  return await geminiAPI.generateContent(...)
})
```

### ✅ CORRECT: Graceful Degradation

```typescript
Deno.serve(async (req: Request) => {
  try {
    // Try primary method
    const result = await primaryMethod()
    return new Response(JSON.stringify(result), { status: 200 })
    
  } catch (error) {
    console.warn('Primary method failed, trying fallback:', error)
    
    try {
      // Fallback method
      const fallbackResult = await fallbackMethod()
      return new Response(JSON.stringify({
        ...fallbackResult,
        warning: 'Using fallback method'
      }), { status: 200 })
      
    } catch (fallbackError) {
      // Both failed
      return internalError(fallbackError)
    }
  }
})
```

---

## Best Practices Summary

### ✅ DO

1. **Use proper HTTP codes** - 200, 400, 401, 404, 500
2. **Return consistent error format** - Same structure for all errors
3. **Log errors to console** - For debugging in Dashboard
4. **Don't expose internal errors** - Generic message to client
5. **Validate all inputs** - Catch errors early
6. **Handle async errors** - Try-catch around await
7. **Use error helper functions** - Consistent error responses
8. **Include error context** - Helpful messages for debugging
9. **Implement retry logic** - For transient failures
10. **Graceful degradation** - Fallback when possible

### ❌ DON'T

1. **Don't return 200 for errors** - Use appropriate status codes
2. **Don't expose stack traces** - Security risk
3. **Don't log secrets** - API keys, tokens, etc.
4. **Don't ignore errors** - Always handle
5. **Don't return raw errors** - Format for client
6. **Don't skip validation** - Validate before processing
7. **Don't use generic messages** - Be specific when helpful
8. **Don't forget CORS headers** - Include in error responses
9. **Don't block on errors** - Return quickly
10. **Don't retry forever** - Set max retries

---

## Project-Specific Patterns

### AI Function Error Handling

```typescript
// supabase/functions/ai-helper/index.ts
Deno.serve(async (req: Request) => {
  try {
    // Validate action
    const { action, payload } = await req.json()
    if (!action) {
      return badRequest('Missing required field: action')
    }

    // Route to handler
    const handler = actionHandlers[action]
    if (!handler) {
      return badRequest(`Unknown action: ${action}`)
    }

    // Execute with error handling
    try {
      const result = await handler(payload)
      return new Response(JSON.stringify({ success: true, data: result }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (handlerError: any) {
      // Handler-specific errors
      if (handlerError.name === 'ValidationError') {
        return badRequest(handlerError.message)
      }
      if (handlerError.name === 'APIError') {
        console.error('AI API error:', handlerError)
        return new Response(JSON.stringify({
          error: 'AI service error',
          message: 'Failed to process request'
        }), { status: 502 })
      }
      throw handlerError // Re-throw for outer catch
    }

  } catch (error) {
    console.error('Function error:', error)
    return internalError(error)
  }
})
```

---

## References

- **Official Docs:** [Error Handling](https://supabase.com/docs/guides/functions/error-handling)
- **Next:** [05-routing-patterns.md](./05-routing-patterns.md)

---

**Last Updated:** February 2026
