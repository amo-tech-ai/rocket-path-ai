# Edge Functions Dependencies Management Best Practices

**Document:** 03-dependencies-management.md  
**Version:** 1.0  
**Date:** February 2026  
**Source:** [Managing Dependencies](https://supabase.com/docs/guides/functions/dependencies)

---

## Overview

Edge Functions use Deno's module system. This guide covers best practices for importing and managing dependencies.

---

## Import Patterns

### ✅ CORRECT: npm: Prefix (Recommended)

```typescript
// ✅ CORRECT: npm: prefix with version
import { createClient } from 'npm:@supabase/supabase-js@2'
import { GoogleGenAI } from 'npm:@google/genai@^1.0.0'
import Stripe from 'npm:stripe@14.21.0'
```

**Rules:**
- ✅ Always use `npm:` prefix
- ✅ Always specify version
- ✅ Use exact version or caret (^) for minor updates

### ✅ CORRECT: jsr: Prefix (Deno Registry)

```typescript
// ✅ CORRECT: JSR modules
import { assert, assertEquals } from 'jsr:@std/assert@1'
import { load } from 'jsr:@std/dotenv@1'
```

### ✅ CORRECT: node: Prefix (Node Built-ins)

```typescript
// ✅ CORRECT: Node built-in APIs
import { randomBytes } from 'node:crypto'
import process from 'node:process'
import { createServer } from 'node:http'
```

**Use When:** Deno APIs don't exist or Node API is better

### ❌ WRONG: Anti-Patterns

```typescript
// ❌ WRONG: Bare specifiers (no prefix)
import { createClient } from '@supabase/supabase-js'  // Will fail

// ❌ WRONG: CDN imports (minimize use)
import { Hono } from 'https://esm.sh/hono'  // Prefer npm:hono

// ❌ WRONG: No version specified
import { createClient } from 'npm:@supabase/supabase-js'  // Unstable

// ❌ WRONG: Deprecated Deno std imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"  // Use Deno.serve
```

---

## deno.json Configuration

### ✅ CORRECT: Per-Function deno.json (Recommended)

**Why:** Each function should have isolated dependencies to prevent conflicts.

```json
// supabase/functions/ai-helper/deno.json
{
  "imports": {
    "supabase": "npm:@supabase/supabase-js@2",
    "@google/genai": "npm:@google/genai@^1.0.0",
    "hono": "npm:hono@4.0.0"
  },
  "compilerOptions": {
    "lib": ["deno.window"],
    "strict": true
  }
}
```

**Usage in Function:**
```typescript
// Now you can use shorter imports
import { createClient } from 'supabase'
import { GoogleGenAI } from '@google/genai'
import { Hono } from 'hono'
```

### ✅ CORRECT: Function Structure

```
supabase/functions/
├── ai-helper/
│   ├── index.ts
│   ├── deno.json          # Function-specific config
│   └── _shared/          # Shared utilities (relative imports)
│       └── utils.ts
└── chat-copilot/
    ├── index.ts
    └── deno.json          # Different dependencies
```

### ⚠️ Legacy: import_map.json (Still Supported)

```json
// supabase/functions/ai-helper/import_map.json
{
  "imports": {
    "supabase": "npm:@supabase/supabase-js@2"
  }
}
```

**Status:** Still works, but `deno.json` is recommended. If both exist, `deno.json` takes precedence.

---

## Shared Code

### ✅ CORRECT: _shared Directory Pattern

```
supabase/functions/
├── ai-helper/
│   ├── index.ts
│   └── _shared/          # Function-specific shared code
│       ├── jwt.ts
│       └── types.ts
└── _shared/              # Cross-function shared code
    ├── cors.ts
    ├── types.ts
    └── utils.ts
```

**Import Pattern:**
```typescript
// ✅ CORRECT: Relative imports for shared code
import { corsHeaders } from '../_shared/cors.ts'
import { verifyJWT } from '../_shared/jwt.ts'

// ✅ CORRECT: Function-specific shared code
import { handleExtractStartup } from './_shared/handlers.ts'
```

**Rules:**
- ✅ Use relative imports for shared code
- ✅ No cross-dependencies between functions
- ✅ Shared code in `_shared/` directory
- ✅ Function-specific shared code in function's `_shared/` subdirectory

---

## Version Management

### ✅ CORRECT: Version Pinning

```typescript
// ✅ CORRECT: Exact version (most stable)
import { createClient } from 'npm:@supabase/supabase-js@2.39.0'

// ✅ CORRECT: Caret range (allows minor updates)
import { GoogleGenAI } from 'npm:@google/genai@^1.0.0'

// ✅ CORRECT: Tilde range (allows patch updates)
import Stripe from 'npm:stripe@~14.21.0'
```

**Recommendation:** Use exact versions for production stability.

### ✅ CORRECT: Update Strategy

```bash
# 1. Test locally with new version
# Update deno.json
{
  "imports": {
    "supabase": "npm:@supabase/supabase-js@2.40.0"  # Updated
  }
}

# 2. Test function locally
supabase functions serve ai-helper

# 3. Deploy if tests pass
supabase functions deploy ai-helper
```

---

## Type Imports

### ✅ CORRECT: Type Imports

```typescript
// ✅ CORRECT: Types are included automatically
import { createClient, SupabaseClient } from 'npm:@supabase/supabase-js@2'

// ✅ CORRECT: @deno-types for packages without types
// @deno-types="npm:@types/express@^4.17"
import express from 'npm:express@^4.17'

// ✅ CORRECT: Node types reference
/// <reference types="npm:@types/node" />
import { randomBytes } from 'node:crypto'
```

---

## Private NPM Packages

### ✅ CORRECT: Private Package Configuration

**Setup:**
```bash
# supabase/functions/ai-helper/.npmrc
@myorg:registry=https://npm.registryhost.com
//npm.registryhost.com/:_authToken=VALID_AUTH_TOKEN
```

**Usage:**
```typescript
// ✅ CORRECT: Import private package
import package from 'npm:@myorg/private-package@v1.0.1'
```

**Rules:**
- ✅ Create `.npmrc` in function directory
- ✅ Never commit auth tokens
- ✅ Use function-specific `.npmrc` for isolation

---

## Custom NPM Registry

### ✅ CORRECT: Custom Registry Configuration

```bash
# Set via environment variable
NPM_CONFIG_REGISTRY=https://custom-registry/ supabase functions deploy ai-helper

# Or in .env file
NPM_CONFIG_REGISTRY=https://custom-registry/
```

---

## Dependency Best Practices

### ✅ DO

1. **Use npm: prefix** - Standard for npm packages
2. **Specify versions** - Always include version number
3. **Per-function deno.json** - Isolated dependencies
4. **Use exact versions** - For production stability
5. **Test before deploy** - Verify new versions work
6. **Use relative imports** - For shared code
7. **Keep dependencies minimal** - Faster cold starts
8. **Update regularly** - Security patches, bug fixes

### ❌ DON'T

1. **Don't use bare specifiers** - Always use npm:, jsr:, or node:
2. **Don't skip versions** - Unstable, breaking changes
3. **Don't use global deno.json** - Per-function isolation
4. **Don't cross-import functions** - Breaks isolation
5. **Don't use CDN imports** - Prefer npm: or jsr:
6. **Don't commit .npmrc** - Security risk (auth tokens)
7. **Don't use deprecated imports** - Deno std serve, etc.
8. **Don't ignore type errors** - Fix TypeScript issues

---

## Project-Specific Patterns

### AI Helper Function Dependencies

```json
// supabase/functions/ai-helper/deno.json
{
  "imports": {
    "supabase": "npm:@supabase/supabase-js@2",
    "@google/genai": "npm:@google/genai@^1.0.0",
    "hono": "npm:hono@4.0.0",
    "@panva/jose": "jsr:@panva/jose@6"
  }
}
```

**Usage:**
```typescript
// Clean imports thanks to deno.json
import { createClient } from 'supabase'
import { GoogleGenAI } from '@google/genai'
import { Hono } from 'hono'
import * as jose from '@panva/jose'
```

---

## Common Dependencies

### Recommended Versions

| Package | Import | Version | Use Case |
|---------|--------|---------|----------|
| **Supabase Client** | `npm:@supabase/supabase-js@2` | Latest v2 | Database operations |
| **Google GenAI** | `npm:@google/genai@^1.0.0` | ^0.21.0 | Gemini API calls |
| **Hono** | `npm:hono@4.0.0` | 4.0.0 | Routing framework |
| **Jose** | `jsr:@panva/jose@6` | 6 | JWT verification |
| **Stripe** | `npm:stripe@14` | Latest 14.x | Payment processing |

---

## References

- **Official Docs:** [Managing Dependencies](https://supabase.com/docs/guides/functions/dependencies)
- **Next:** [04-error-handling.md](./04-error-handling.md)

---

**Last Updated:** February 2026
