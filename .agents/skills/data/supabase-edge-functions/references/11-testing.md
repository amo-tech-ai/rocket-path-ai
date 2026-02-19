# Edge Functions Testing Best Practices

**Document:** 11-testing.md  
**Version:** 1.0  
**Date:** February 2026  
**Source:** [Testing Functions](https://supabase.com/docs/guides/functions/unit-test)

---

## Overview

Testing Edge Functions ensures reliability and catches bugs before production. Use Deno's built-in test runner.

---

## Test Structure

### ✅ CORRECT: Test File Organization

```
supabase/functions/
├── ai-helper/
│   └── index.ts
└── tests/
    └── ai-helper-test.ts
```

---

## Basic Test Pattern

### ✅ CORRECT: Deno Test

```typescript
// supabase/functions/tests/ai-helper-test.ts
import { assert, assertEquals } from 'jsr:@std/assert@1'
import { createClient } from 'npm:@supabase/supabase-js@2'
import 'jsr:@std/dotenv/load'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!

Deno.test('AI Helper - Extract Startup', async () => {
  const client = createClient(supabaseUrl, supabaseKey)
  
  const { data, error } = await client.functions.invoke('ai-helper', {
    body: {
      action: 'wizard_extract_startup',
      payload: { url: 'https://example.com' }
    }
  })
  
  assert(!error, 'Function should not error')
  assertEquals(data?.success, true)
})
```

---

## Local Testing

### ✅ CORRECT: Serve and Test

```bash
# 1. Start Supabase locally
supabase start

# 2. Serve functions
supabase functions serve ai-helper

# 3. Run tests
deno test --allow-all supabase/functions/tests/ai-helper-test.ts
```

---

## Best Practices

### ✅ DO

1. **Test locally first** - Before deployment
2. **Test error cases** - Invalid inputs, auth failures
3. **Test success cases** - Happy path
4. **Mock external APIs** - For faster tests
5. **Test edge cases** - Boundary conditions

### ❌ DON'T

1. **Don't skip tests** - Write tests for all functions
2. **Don't test in production** - Use local/staging
3. **Don't ignore test failures** - Fix before deploying

---

## References

- **Official Docs:** [Testing Functions](https://supabase.com/docs/guides/functions/unit-test)
- **Next:** [12-debugging-logging.md](./12-debugging-logging.md)

---

**Last Updated:** February 2026
