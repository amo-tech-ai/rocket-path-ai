# Prompt 06 — Wizard Hooks & Data Integration

**Purpose:** Create React hooks for wizard session and edge function integration  
**Status:** 🟡 Backend Ready | Frontend Pending  
**Priority:** P0 — Critical Blocker  
**Depends on:** Prompt 01 (Wizard Layout)

---

## Backend Verification ✅

| Resource | Status | Notes |
|----------|--------|-------|
| `wizard_sessions` table | ✅ | All fields verified |
| `onboarding-agent` edge function | ✅ | All actions available |
| Supabase client | ✅ | Configured |
| React Query | ✅ | Installed |

---

## Files to Create

**New Files:**
- `src/hooks/useWizardSession.ts` — Wizard session management
- `src/hooks/useOnboardingAgent.ts` — Edge function integration

**Pattern References:**
- `src/hooks/useEvents.ts` — Query pattern
- `src/hooks/useCRM.ts` — Mutation pattern

---

## useWizardSession Hook

```typescript
// src/hooks/useWizardSession.ts
interface WizardSession {
  id: string;
  user_id: string;
  startup_id: string | null;
  current_step: number;
  status: 'in_progress' | 'completed';
  form_data: Record<string, any>;
  ai_extractions: Record<string, any> | null;
  extracted_traction: Record<string, any> | null;
  extracted_funding: Record<string, any> | null;
  created_at: string;
  completed_at: string | null;
}

interface UseWizardSessionReturn {
  session: WizardSession | null;
  isLoading: boolean;
  error: Error | null;
  
  // Session management
  createSession: () => Promise<WizardSession>;
  updateSession: (data: Partial<WizardSession['form_data']>) => Promise<void>;
  updateStep: (step: number) => Promise<void>;
  
  // Computed
  isComplete: boolean;
  canResume: boolean;
}
```

**Query Pattern:**
```typescript
const { data: session, isLoading } = useQuery({
  queryKey: ['wizard-session'],
  queryFn: async () => {
    const { data, error } = await supabase.functions.invoke('onboarding-agent', {
      body: { action: 'get_session' },
    });
    if (error) throw error;
    return data.session;
  },
});
```

**Auto-Save Pattern:**
```typescript
const updateSession = useMutation({
  mutationFn: async (formData: Record<string, any>) => {
    const { error } = await supabase.functions.invoke('onboarding-agent', {
      body: { 
        action: 'update_session',
        session_id: session?.id,
        form_data: formData,
      },
    });
    if (error) throw error;
  },
  // Debounce via React state, not mutation
});

// Debounced save in component
const debouncedSave = useDebouncedCallback(
  (data) => updateSession.mutate(data),
  500
);
```

---

## useOnboardingAgent Hook

```typescript
// src/hooks/useOnboardingAgent.ts
interface UseOnboardingAgentReturn {
  // Extraction
  extractUrl: (url: string) => Promise<ExtractionResult>;
  extractContext: (description: string) => Promise<ExtractionResult>;
  isExtracting: boolean;
  extractionError: Error | null;
  
  // Completion
  completeWizard: (sessionId: string) => Promise<CompleteWizardResult>;
  isCompleting: boolean;
  completionError: Error | null;
}

interface ExtractionResult {
  success: boolean;
  data: {
    company_name?: string;
    description?: string;
    industry?: string;
    key_features?: string[];
    confidence: Record<string, number>;
  } | null;
  error?: string;
}

interface CompleteWizardResult {
  success: boolean;
  startup_id: string | null;
  tasks: Task[] | null;
  error?: string;
}
```

**Extraction Pattern:**
```typescript
const extractUrl = useMutation({
  mutationFn: async (url: string) => {
    const { data, error } = await supabase.functions.invoke('onboarding-agent', {
      body: { action: 'enrich_url', url },
    });
    if (error) throw error;
    return data;
  },
});
```

**Completion Pattern:**
```typescript
const completeWizard = useMutation({
  mutationFn: async (sessionId: string) => {
    const { data, error } = await supabase.functions.invoke('onboarding-agent', {
      body: { action: 'complete_wizard', session_id: sessionId },
    });
    if (error) throw error;
    return data;
  },
  onSuccess: (result) => {
    if (result.startup_id) {
      queryClient.invalidateQueries(['startup']);
      queryClient.invalidateQueries(['tasks']);
    }
  },
});
```

---

## Debounce Collision Handling

```typescript
// Use React Query's built-in mutation cancellation
const updateSession = useMutation({
  mutationFn: updateSessionFn,
  onMutate: async (newData) => {
    await queryClient.cancelQueries(['wizard-session']);
    return { previousData: queryClient.getQueryData(['wizard-session']) };
  },
  onError: (err, newData, context) => {
    queryClient.setQueryData(['wizard-session'], context.previousData);
  },
});
```

---

## Partial Failure Handling (CRITICAL)

```typescript
interface CompleteWizardResult {
  success: boolean;
  startup_id: string | null;
  tasks: Task[] | null;
  error?: string;
}

// Handle all possible states:
if (result.startup_id && result.tasks?.length > 0) {
  // Full success
  navigate('/dashboard');
} else if (result.startup_id && !result.tasks?.length) {
  // Partial success
  toast.warning('Startup saved! Tasks will be generated later.');
  navigate('/dashboard');
} else {
  // Full failure
  toast.error(result.error || 'Failed to complete wizard');
}
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         COMPONENT LAYER                             │
├─────────────────────────────────────────────────────────────────────┤
│  OnboardingWizard.tsx                                              │
│    ├─→ useWizardSession()                                          │
│    │     ├─→ useQuery(['wizard-session'])                          │
│    │     └─→ useMutation(updateSession)                            │
│    └─→ Step1Profile.tsx                                            │
│          ├─→ useWizardSession()                                    │
│          └─→ useOnboardingAgent()                                  │
│                ├─→ enrichUrl(url)                                  │
│                └─→ enrichContext(description)                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND LAYER                                  │
├─────────────────────────────────────────────────────────────────────┤
│  Edge Function: onboarding-agent                                    │
│    ├─→ create_session                                              │
│    ├─→ get_session                                                 │
│    ├─→ update_session                                              │
│    ├─→ enrich_url (→ Gemini API)                                   │
│    ├─→ enrich_context (→ Gemini API)                               │
│    └─→ complete_wizard (→ Gemini API + Supabase)                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Success Criteria

- ✅ `useWizardSession` loads existing session
- ✅ `useWizardSession` creates new session if needed
- ✅ `useWizardSession` auto-saves form data (debounced 500ms)
- ✅ `useWizardSession` updates current step
- ✅ `useOnboardingAgent.extractUrl` works
- ✅ `useOnboardingAgent.extractContext` works
- ✅ `useOnboardingAgent.completeWizard` works
- ✅ Loading states work for all actions
- ✅ Error handling works for all actions
- ✅ Partial failure handled correctly
