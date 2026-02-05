# Edge Functions Error Handling

## HTTP Status Codes

| Code | Meaning | Use When |
|------|---------|----------|
| 200 | OK | Success |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid JWT |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate, conflict |
| 500 | Internal Error | Server error |
| 502 | Bad Gateway | Upstream service error |

## Error Response Format

```typescript
// Consistent error structure
interface ErrorResponse {
  error: string
  message?: string
  code?: string
}

// Success response
return Response.json({ success: true, data: result }, { status: 200 })

// Error response
return Response.json({
  error: 'Validation failed',
  message: 'Missing required field: email',
  code: 'VALIDATION_ERROR'
}, { status: 400 })
```

## Error Helper Functions

```typescript
// supabase/functions/_shared/errors.ts

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export function badRequest(message: string) {
  return new Response(JSON.stringify({
    error: 'Bad Request',
    message
  }), {
    status: 400,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

export function unauthorized(message = 'Unauthorized') {
  return new Response(JSON.stringify({
    error: 'Unauthorized',
    message
  }), {
    status: 401,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

export function notFound(resource: string) {
  return new Response(JSON.stringify({
    error: 'Not Found',
    message: `${resource} not found`
  }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

export function internalError(error: Error) {
  console.error('Function error:', error)
  return new Response(JSON.stringify({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  }), {
    status: 500,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
```

## Comprehensive Error Handling

```typescript
import { badRequest, unauthorized, internalError, corsHeaders } from '../_shared/errors.ts'

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Validate method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Parse JSON
    let payload
    try {
      payload = await req.json()
    } catch {
      return badRequest('Invalid JSON')
    }

    // 3. Validate input
    if (!payload.action) {
      return badRequest('Missing required field: action')
    }

    // 4. Authenticate
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return unauthorized('Missing authorization header')
    }

    // 5. Business logic
    const result = await processAction(payload)

    // 6. Success
    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return internalError(error)
  }
})
```

## Logging

### Console Logging

```typescript
// Log request info (not sensitive data)
console.log(`[${req.method}] ${new URL(req.url).pathname}`)

// Log errors with context
console.error('Function error:', {
  message: error.message,
  stack: error.stack,
  name: error.name
})

// DON'T log sensitive data
// console.error('Error with key:', Deno.env.get('GEMINI_API_KEY'))
```

### Structured Logging

```typescript
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
logError(error, {
  action: 'wizard_extract_startup',
  userId: user.id,
  orgId: profile.org_id
})
```

## Retry Logic

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
      await new Promise(r => setTimeout(r, delay * Math.pow(2, i)))
      console.log(`Retry ${i + 1}/${maxRetries}`)
    }
  }
  throw new Error('Max retries exceeded')
}

// Usage
const result = await callWithRetry(async () => {
  return await externalAPI.call()
})
```

## Graceful Degradation

```typescript
try {
  // Primary method
  const result = await primaryMethod()
  return Response.json(result)

} catch (error) {
  console.warn('Primary failed, trying fallback:', error)

  try {
    // Fallback method
    const fallbackResult = await fallbackMethod()
    return Response.json({
      ...fallbackResult,
      warning: 'Using fallback method'
    })

  } catch (fallbackError) {
    return internalError(fallbackError)
  }
}
```

## Client-Side Error Handling

```typescript
// Frontend service
async function callEdgeFunction(action: string, payload: any) {
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

    if (response.status === 401) {
      throw new Error('Session expired. Please log in again.')
    }

    if (response.status === 429) {
      throw new Error('Too many requests. Please try again later.')
    }

    throw new Error(errorData.message || 'Request failed')
  }

  return response.json()
}
```
