---
name: Testing
description: Write tests for React components, Edge functions, and integration tests using Vitest and React Testing Library. Use when writing tests, test-driven development, or debugging test failures.
version: 1.0.0
---

# Testing

This skill teaches agents how to write comprehensive tests for React components, Edge functions, Supabase integration, and end-to-end workflows using Vitest and React Testing Library.

## When to Use

- When writing tests for React components
- When testing Edge functions
- When implementing test-driven development (TDD)
- When debugging test failures
- When testing Supabase integration
- When writing integration tests

## Core Principles

### Test-Driven Development (TDD)

**TDD Workflow:**
1. Write tests first (describe expected behavior)
2. Run tests (confirm they fail)
3. Implement feature
4. Run tests (confirm they pass)
5. Refactor if needed
6. Commit with passing tests

**Benefits:**
- Clear requirements before implementation
- Better test coverage
- Confidence in refactoring
- Documentation through tests

### Testing Tools

**Framework:** Vitest  
**React Testing:** React Testing Library  
**Browser Testing:** Cursor Browser (`@browser`)  
**Console/Network:** Chrome DevTools MCP (`@chrome-devtools`)  
**Supabase Testing:** Supabase MCP or local Supabase instance

## React Component Testing

### Setup

**Test file location:**
- `src/components/**/*.test.tsx`
- `src/pages/**/*.test.tsx`
- `src/hooks/**/*.test.ts`

**Test setup file:** `src/test/setup.ts`

### Component Test Pattern

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    render(<ComponentName />);
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

### Testing with React Query

**Wrap component with QueryClientProvider:**

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

render(<ComponentName />, { wrapper });
```

### Testing with Supabase

**Mock Supabase client:**

```typescript
import { vi } from 'vitest';
import { createClient } from '@supabase/supabase-js';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}));
```

## Edge Function Testing

### Local Testing

**Start Supabase locally:**
```bash
supabase start
```

**Test function:**
```bash
supabase functions serve function-name
```

**Test with curl:**
```bash
curl -X POST http://localhost:54321/functions/v1/function-name \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Unit Testing Edge Functions

**Test file:** `supabase/functions/function-name/test.ts`

```typescript
import { assertEquals } from 'https://deno.land/std@0.168.0/testing/asserts.ts';
import { handler } from './index.ts';

Deno.test('handler returns expected response', async () => {
  const req = new Request('http://localhost:54321/functions/v1/function-name', {
    method: 'POST',
    body: JSON.stringify({ test: 'data' }),
  });

  const response = await handler(req);
  const data = await response.json();

  assertEquals(data.success, true);
});
```

## Integration Testing

### Supabase Integration Tests

**Test database operations:**

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

describe('Database operations', () => {
  it('creates startup profile', async () => {
    const { data, error } = await supabase
      .from('startups')
      .insert({ name: 'Test Startup', org_id: testOrgId })
      .select()
      .single();

    expect(error).toBeNull();
    expect(data?.name).toBe('Test Startup');
  });
});
```

### RLS Policy Testing

**Test row-level security:**

```typescript
describe('RLS policies', () => {
  it('users can only read own org data', async () => {
    // Test with user A
    const userASupabase = createClient(url, userAKey);
    const { data: userAData } = await userASupabase
      .from('startups')
      .select();

    // Test with user B
    const userBSupabase = createClient(url, userBKey);
    const { data: userBData } = await userBSupabase
      .from('startups')
      .select();

    // Verify isolation
    expect(userAData).not.toEqual(userBData);
  });
});
```

## Browser Testing

### Using Cursor Browser

**Visual verification:**
```
@browser Navigate to http://localhost:8080/dashboard
@browser Take screenshot
@browser Click "Create Project" button
```

**Console monitoring:**
```
@chrome-devtools list_console_messages
→ Filter: level='error'
→ Check for JavaScript errors
```

**Network monitoring:**
```
@chrome-devtools list_network_requests
→ Filter: status >= 400
→ Check for failed API calls
```

### End-to-End Testing

**Test complete workflows:**

```typescript
describe('Dashboard workflow', () => {
  it('user can create project and add tasks', async () => {
    // 1. Navigate to dashboard
    // 2. Click "Create Project"
    // 3. Fill form and submit
    // 4. Verify project appears in list
    // 5. Click project to open detail
    // 6. Add task
    // 7. Verify task appears
  });
});
```

## Test Organization

### File Structure

```
src/
├── components/
│   └── ComponentName/
│       ├── ComponentName.tsx
│       └── ComponentName.test.tsx
├── pages/
│   ├── Dashboard.tsx
│   └── Dashboard.test.tsx
├── hooks/
│   ├── useStartup.ts
│   └── useStartup.test.ts
└── test/
    └── setup.ts
```

### Test Naming

**Convention:**
- Component: `ComponentName.test.tsx`
- Hook: `useHookName.test.ts`
- Page: `PageName.test.tsx`
- Utility: `utility.test.ts`

## Best Practices

### ✅ DO

- Write tests before implementation (TDD)
- Test user interactions, not implementation details
- Use React Testing Library best practices
- Mock external dependencies (Supabase, APIs)
- Test error handling and edge cases
- Use descriptive test names
- Group related tests with `describe` blocks
- Clean up after tests (reset mocks, clear state)

### ❌ DON'T

- Don't test implementation details (internal state, methods)
- Don't skip error handling tests
- Don't write tests after implementation (when possible, use TDD)
- Don't mock everything (test real integrations when possible)
- Don't skip edge cases
- Don't write overly complex tests
- Don't forget to clean up test data

## Common Test Patterns

### Testing Forms

```typescript
it('submits form with valid data', async () => {
  render(<ProfileForm />);
  
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: 'Test User' },
  });
  
  fireEvent.click(screen.getByRole('button', { name: /save/i }));
  
  await waitFor(() => {
    expect(screen.getByText(/saved/i)).toBeInTheDocument();
  });
});
```

### Testing Loading States

```typescript
it('shows loading state while fetching', () => {
  const { result } = renderHook(() => useStartup());
  
  expect(result.current.isLoading).toBe(true);
});
```

### Testing Error States

```typescript
it('displays error message on fetch failure', async () => {
  vi.spyOn(supabase.from('startups'), 'select').mockRejectedValue(
    new Error('Network error')
  );

  render(<DashboardPage />);

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

## Reference

- **Testing Rules:** `.cursor/rules/supabase/test-supabase.mdc`
- **Browser Testing:** `.cursor/rules/testing-pitchdeck.mdc`
- **Vitest Docs:** [Vitest](https://vitest.dev/)
- **React Testing Library:** [React Testing Library](https://testing-library.com/react)

---

**Created:** 2025-01-16  
**Based on:** Testing best practices for React and Supabase  
**Version:** 1.0.0
