# Edge Functions Performance Optimization Best Practices

**Document:** 13-performance-optimization.md  
**Version:** 1.0  
**Date:** February 2026  
**Source:** Supabase Architecture Docs + Best Practices

---

## Overview

Optimize Edge Functions for low latency, minimal cold starts, and efficient resource usage.

---

## Cold Start Optimization

### ✅ CORRECT: Minimize Initialization

```typescript
// ✅ CORRECT: Lazy load heavy dependencies
let heavyLibrary: any = null

async function getHeavyLibrary() {
  if (!heavyLibrary) {
    heavyLibrary = await import('heavy-library')
  }
  return heavyLibrary
}

Deno.serve(async (req: Request) => {
  // Only load when needed
  if (needsHeavyLibrary) {
    const lib = await getHeavyLibrary()
    // Use library
  }
})
```

### ✅ CORRECT: Combine Related Actions

```typescript
// ✅ CORRECT: Single function for related operations
// ai-helper handles: extract, analyze, generate
// Stays warm for multiple actions

// ❌ WRONG: Separate functions
// extract-startup, analyze-risks, generate-tasks
// Each has its own cold start
```

---

## Connection Pooling

### ✅ CORRECT: Reuse Connections

```typescript
// ✅ CORRECT: Create pool once (outside handler)
const pool = new Pool(connectionString, 1)

Deno.serve(async (req: Request) => {
  const conn = await pool.connect()
  try {
    // Use connection
  } finally {
    conn.release()
  }
})
```

---

## Caching

### ✅ CORRECT: Cache-First Pattern

```typescript
// Check cache before expensive operation
const cacheKey = `result-${hash(input)}`
const cached = await getFromCache(cacheKey)

if (cached) {
  return new Response(JSON.stringify(cached), { status: 200 })
}

// Generate and cache
const result = await expensiveOperation()
await setCache(cacheKey, result, 3600)  // 1 hour TTL

return new Response(JSON.stringify(result), { status: 200 })
```

---

## Best Practices Summary

### ✅ DO

1. **Minimize cold starts** - Combine related actions
2. **Lazy load dependencies** - Only when needed
3. **Reuse connections** - Don't create per request
4. **Use caching** - Cache-first pattern
5. **Optimize queries** - Use indexes, limit results
6. **Set timeouts** - Prevent hanging requests
7. **Monitor performance** - Track duration in logs

### ❌ DON'T

1. **Don't block on heavy imports** - Lazy load
2. **Don't create pools per request** - Reuse
3. **Don't skip caching** - For expensive operations
4. **Don't ignore timeouts** - Set limits
5. **Don't over-fetch data** - Limit queries

---

## References

- **Official Docs:** [Architecture](https://supabase.com/docs/guides/functions/architecture)
- **Back to:** [00-index.md](./00-index.md)

---

**Last Updated:** February 2026
