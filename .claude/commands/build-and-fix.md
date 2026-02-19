---
description: Run build/lint/type checks and fix all errors
---

# Build and Fix

Run all quality checks and fix any errors found.

## Steps

1. **TypeScript Check**
   ```bash
   npx tsc --noEmit
   ```
   Fix any type errors found.

2. **ESLint**
   ```bash
   npm run lint
   ```
   Fix any linting errors.

3. **Build**
   ```bash
   npm run build
   ```
   Fix any build errors.

4. **Tests** (if applicable)
   ```bash
   npm run test
   ```
   Fix any failing tests.

## Rules

- Fix errors one at a time
- Don't ignore or suppress errors without good reason
- If a fix requires significant changes, explain before implementing

$ARGUMENTS - Optional: specific check to run (e.g., "lint", "types", "build")
