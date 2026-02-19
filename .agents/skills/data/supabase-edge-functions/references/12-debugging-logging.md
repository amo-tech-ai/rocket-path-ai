# Edge Functions Debugging & Logging Best Practices

**Document:** 12-debugging-logging.md  
**Version:** 1.0  
**Date:** February 2026  
**Source:** [Debugging](https://supabase.com/docs/guides/functions/debugging-tools) + [Logging](https://supabase.com/docs/guides/functions/logging)

---

## Overview

Effective debugging and logging are essential for maintaining Edge Functions in production.

---

## Chrome DevTools Debugging

### ✅ CORRECT: Inspect Mode

```bash
# Serve function in inspect mode
supabase functions serve ai-helper --inspect-mode brk

# Then:
# 1. Open chrome://inspect
# 2. Configure target: 127.0.0.1:8083
# 3. Open DevTools
# 4. Set breakpoints in Sources tab
```

---

## Console Logging

### ✅ CORRECT: Structured Logging

```typescript
// ✅ CORRECT: Use console methods
console.log('Request received:', { action, userId })
console.warn('Deprecated action used:', action)
console.error('Function error:', error)

// ✅ CORRECT: Log request headers (convert to object)
const headersObject = Object.fromEntries(req.headers)
console.log('Request headers:', JSON.stringify(headersObject, null, 2))
```

### ❌ WRONG: Logging Headers

```typescript
// ❌ WRONG: Headers object appears empty
console.log('Headers:', JSON.stringify(req.headers))  // Outputs: "{}"

// ✅ CORRECT: Convert to object first
const headersObject = Object.fromEntries(req.headers)
console.log('Headers:', JSON.stringify(headersObject, null, 2))
```

---

## Production Logs

### ✅ CORRECT: Access Production Logs

1. **Dashboard → Functions → Select Function → Logs**
2. **Filter by:** Timestamp, level, message
3. **View:** Invocations, logs, errors

---

## Best Practices

### ✅ DO

1. **Use console.log/warn/error** - Appropriate levels
2. **Log structured data** - JSON objects
3. **Don't log secrets** - Security risk
4. **Log request context** - Action, user, timestamp
5. **Log errors with stack** - For debugging

### ❌ DON'T

1. **Don't log secrets** - API keys, tokens
2. **Don't log sensitive data** - PII, passwords
3. **Don't over-log** - Performance impact
4. **Don't use console in production** - Use structured logging

---

## References

- **Official Docs:** [Debugging](https://supabase.com/docs/guides/functions/debugging-tools)
- **Official Docs:** [Logging](https://supabase.com/docs/guides/functions/logging)
- **Next:** [13-performance-optimization.md](./13-performance-optimization.md)

---

**Last Updated:** February 2026
