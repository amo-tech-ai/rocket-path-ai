# Frontend-Backend Wiring - Simple Prompts

**Purpose:** Simple, clear prompts for connecting React frontend to Supabase backend  
**Format:** Short, logical steps (no code)  
**Focus:** How frontend calls backend, how data flows  
**Current Lovable Build:** `/home/sk/startupai16L/` (source of truth)

**Repository Status:**
- **Lovable Build:** `/home/sk/startupai16L/` - Current production build
- **Working Repo:** `/home/sk/startupai16/` - Enhanced with shared utilities and additional edge functions
- **Key Files:**
  - Supabase Client: `src/integrations/supabase/client.ts`
  - Edge Functions: `supabase/functions/` (2 functions in startupai16L, 12+ in startupai16)
  - Hooks: `src/hooks/` (useOnboardingAgent, useWizardSession, etc.)

---

## Overview

**Architecture:**
- **Frontend:** React + TypeScript (Vite)
- **Backend:** Supabase (Database + Edge Functions)
- **Connection:** Supabase JS client + React Query

**Data Flow:**
```
React Component → Custom Hook → Supabase Client → Edge Function / Database
```

---

## 1. Supabase Client Setup

**Goal:** Initialize Supabase client in frontend

**Location:** `src/integrations/supabase/client.ts` (auto-generated, do not edit)

**Steps:**
- Import Supabase client: `import { supabase } from '@/integrations/supabase/client'`
- Client is already configured with:
  - URL: `https://yvyesmiczbjqwbqtlidy.supabase.co`
  - Anon key: Auto-configured
  - Auth storage: `localStorage` with auto-refresh
- Use `supabase` object for all backend calls

**Verified Methods:**
- `supabase.auth` - Authentication (signIn, signUp, signOut, getSession, refreshSession)
- `supabase.from('table_name')` - Database queries
- `supabase.rpc('function_name')` - Database functions
- `supabase.functions.invoke('function-name')` - Edge functions

**Verify:**
- [ ] Supabase client imports without errors
- [ ] Client has `auth`, `from()`, `rpc()`, `functions` methods
- [ ] Session auto-refreshes on expiration

---

## 2. Calling Edge Functions

**Goal:** Call Supabase Edge Functions from React components

**Pattern:**
- Use `supabase.functions.invoke('function-name', { body, headers })`
- Get auth token: `await supabase.auth.getSession()`
- Add token to headers: `Authorization: Bearer ${token}`
- Handle errors and loading states
- Auto-refresh session on 401/403 errors

**Verified Implementation (useOnboardingAgent.ts):**
```typescript
// Get session (with auto-refresh)
const { data: { session } } = await supabase.auth.getSession();

// If expired, refresh
if (!session?.access_token) {
  const { data: { session: refreshed } } = await supabase.auth.refreshSession();
  session = refreshed;
}

// Call edge function
const response = await supabase.functions.invoke('onboarding-agent', {
  body: { action: 'enrich_url', session_id, url },
  headers: { Authorization: `Bearer ${session.access_token}` }
});

// Handle response envelope: { success: boolean, ...data }
if (response.data.success === false) {
  throw new Error(response.data.error);
}
```

**Example Flow:**
1. User clicks button → Component calls hook function
2. Hook gets session token (with auto-refresh) → Calls `supabase.functions.invoke()`
3. Edge function processes → Returns `{ success: boolean, ...data }`
4. Hook validates success envelope → Returns data or throws error
5. Component updates UI → Shows results

**Verify:**
- [ ] Edge function call includes auth token
- [ ] Session auto-refreshes on 401/403
- [ ] Response envelope validated (`success` field)
- [ ] Errors are caught and displayed to user
- [ ] Loading state shows during request

---

## 3. Database Queries (Read)

**Goal:** Read data from Supabase tables

**Pattern:**
- Use `supabase.from('table_name').select('*')`
- Use React Query for caching and refetching
- Filter with `.eq()`, `.order()`, `.limit()`
- Handle RLS (Row Level Security) - queries respect user permissions

**Verified Example (wizard_sessions):**
```typescript
const { data, error } = await supabase
  .from('wizard_sessions')
  .select('*')
  .eq('user_id', userId)
  .eq('status', 'in_progress')
  .order('created_at', { ascending: false })
  .limit(1)
  .single();
```

**Example Flow:**
1. Component mounts → Hook calls `useQuery()`
2. React Query calls `supabase.from('table').select()`
3. Data returns → Component displays
4. React Query caches → Refetches on window focus

**Verify:**
- [ ] Data loads from database
- [ ] RLS policies allow access (user can only see own data)
- [ ] Loading state shows while fetching
- [ ] Errors are handled gracefully

---

## 4. Database Mutations (Write)

**Goal:** Create, update, or delete data

**Pattern:**
- Use `supabase.from('table').insert()`, `.update()`, `.delete()`
- Use React Query `useMutation()` for writes
- Invalidate queries after mutation to refetch
- Handle RLS (Row Level Security) - mutations respect user permissions

**Verified Example (wizard_sessions):**
```typescript
// Update form_data
const { data, error } = await supabase
  .from('wizard_sessions')
  .update({ 
    form_data: newFormData,
    last_activity_at: new Date().toISOString()
  })
  .eq('id', sessionId)
  .eq('user_id', userId) // RLS check
  .select()
  .single();
```

**Example Flow:**
1. User submits form → Hook calls `mutate()`
2. Mutation calls `supabase.from('table').insert()` or `.update()`
3. Success → Invalidate related queries
4. React Query refetches → UI updates

**Verify:**
- [ ] Data saves to database
- [ ] RLS policies allow mutation (user can only update own data)
- [ ] UI updates after save
- [ ] Optimistic updates work (optional)

---

## 5. Database Functions (RPC)

**Goal:** Call PostgreSQL functions for complex operations

**Pattern:**
- Use `supabase.rpc('function_name', { params })`
- Functions run inside database (atomic transactions)
- Used for complex business logic

**Example Flow:**
1. Component needs atomic operation → Calls `supabase.rpc()`
2. Database function executes → All-or-nothing transaction
3. Returns result → Component handles response

**Verify:**
- [ ] RPC function exists in database
- [ ] Parameters match function signature
- [ ] Transaction succeeds or fails completely

---

## 6. Authentication Flow

**Goal:** Handle user authentication

**Pattern:**
- Sign up: `supabase.auth.signUp({ email, password })`
- Sign in: `supabase.auth.signInWithPassword({ email, password })`
- Sign out: `supabase.auth.signOut()`
- Get session: `supabase.auth.getSession()`

**Example Flow:**
1. User enters credentials → Calls `signInWithPassword()`
2. Supabase validates → Returns session
3. Session stored → User redirected to dashboard
4. Protected routes check session → Allow/deny access

**Verify:**
- [ ] User can sign up and sign in
- [ ] Session persists on page refresh
- [ ] Protected routes require authentication

---

## 7. Custom Hooks Pattern

**Goal:** Create reusable hooks for backend operations

**Structure:**
- Hook file: `src/hooks/useFeatureName.ts`
- Uses React Query: `useQuery()` for reads, `useMutation()` for writes
- Returns: `{ data, isLoading, error, mutate }`

**Example:**
- `useOnboardingAgent()` - Calls onboarding edge function
- `useEvents()` - Reads events from database
- `useCreateEvent()` - Creates new event

**Verify:**
- [ ] Hook exports correct return values
- [ ] Loading and error states work
- [ ] Can be used in multiple components

---

## 8. Error Handling

**Goal:** Handle backend errors gracefully

**Pattern:**
- Catch errors in try/catch blocks
- Check error type: network, auth, validation, server
- Display user-friendly error messages
- Log errors for debugging

**Example Flow:**
1. Request fails → Error caught
2. Check error type → Network, auth, or server error
3. Show toast/alert → User-friendly message
4. Log error → Console or error tracking

**Verify:**
- [ ] Network errors show "Connection failed"
- [ ] Auth errors redirect to login
- [ ] Validation errors show field-specific messages

---

## 9. Loading States

**Goal:** Show loading indicators during requests

**Pattern:**
- Use `isLoading` from React Query
- Show spinner/skeleton while loading
- Disable buttons during mutations

**Example Flow:**
1. Request starts → `isLoading = true`
2. Show spinner → User knows request is processing
3. Request completes → `isLoading = false`
4. Hide spinner → Show data or error

**Verify:**
- [ ] Loading state shows during requests
- [ ] Buttons disabled while processing
- [ ] Spinner disappears when done

---

## 10. Data Refresh

**Goal:** Keep data up-to-date

**Pattern:**
- React Query auto-refetches on window focus
- Invalidate queries after mutations
- Manual refetch with `refetch()` function

**Example Flow:**
1. User creates new item → Mutation succeeds
2. Invalidate related queries → `queryClient.invalidateQueries()`
3. React Query refetches → UI updates with new data

**Verify:**
- [ ] Data refreshes after mutations
- [ ] Window focus triggers refetch
- [ ] Manual refetch works

---

## Quick Reference

**Edge Function Call:**
```
supabase.functions.invoke('function-name', {
  body: { action: 'action_name', ...params },
  headers: { Authorization: `Bearer ${token}` }
})
```

**Database Query:**
```
supabase.from('table_name')
  .select('*')
  .eq('column', value)
  .order('created_at', { ascending: false })
```

**Database Mutation:**
```
supabase.from('table_name')
  .insert({ column: value })
  .select()
```

**RPC Call:**
```
supabase.rpc('function_name', {
  param1: value1,
  param2: value2
})
```

**Auth:**
```
// Sign in
await supabase.auth.signInWithPassword({ email, password })

// Get session
const { data: { session } } = await supabase.auth.getSession()
```

---

## Verification Checklist

**Setup:**
- [ ] Supabase client configured
- [ ] Environment variables set (URL, anon key)

**Edge Functions:**
- [ ] Can call edge functions with auth
- [ ] Errors handled correctly
- [ ] Loading states work

**Database:**
- [ ] Can read from tables
- [ ] Can write to tables
- [ ] RPC functions work

**Auth:**
- [ ] Sign up works
- [ ] Sign in works
- [ ] Session persists
- [ ] Protected routes work

**Hooks:**
- [ ] Custom hooks created
- [ ] React Query integrated
- [ ] Error handling in hooks

---

**Verified Database Schema:**
- **wizard_sessions table:**
  - `form_data` (jsonb) - All form inputs
  - `ai_extractions` (jsonb) - AI-detected fields
  - `interview_answers` (jsonb) - Interview responses
  - `extracted_traction` (jsonb) - Traction metrics
  - `extracted_funding` (jsonb) - Funding info
  - `signals` (text[]) - Extracted signals array
  - `current_step` (integer, 1-4) - Current wizard step
  - `status` (text) - 'in_progress', 'completed', 'abandoned'
  - RLS enabled - Users can only access their own sessions

**Related:**
- Edge Functions: `supabase/functions/onboarding-agent/`
- Hooks: `src/hooks/useOnboardingAgent.ts`, `src/hooks/useWizardSession.ts`
- Supabase Client: `src/integrations/supabase/client.ts`
- Types: `src/integrations/supabase/types.ts` (auto-generated)

---

## Verification Status (2026-01-25)

**✅ Verified Against Supabase:**
- Supabase client: Configuration verified in `/home/sk/startupai16L/src/integrations/supabase/client.ts`
- URL: `https://yvyesmiczbjqwbqtlidy.supabase.co`
- Auth: localStorage with auto-refresh enabled
- Edge function calls: Pattern verified in `useOnboardingAgent.ts`
- Database queries: RLS policies verified
- Session management: Auto-refresh on 401/403 verified

**Key Patterns Verified:**
- Edge function response envelope: `{ success: boolean, ...data }` ✓
- Session auto-refresh on expiration ✓
- RLS checks in queries: `.eq('user_id', userId)` ✓
- Error handling: Try/catch with user-friendly messages ✓
