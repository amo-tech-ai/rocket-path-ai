---
paths:
  - "**/*.test.*"
  - "**/*.spec.*"
  - "src/__tests__/**"
---

# Testing Rules

- Framework: Vitest (not Jest)
- Run single test: `npx vitest run path/to/file.test.ts`
- Run all tests: `npm run test`
- Use `describe`/`it` blocks with clear descriptions
- Mock Supabase client with `vi.mock('@/integrations/supabase/client')`
- Test edge functions by mocking `Deno.serve` handler
- Test React hooks with `@testing-library/react-hooks`
- Test components with `@testing-library/react`
- Prefer `getByRole` over `getByTestId` for accessibility
- Always test error states and loading states, not just happy path
