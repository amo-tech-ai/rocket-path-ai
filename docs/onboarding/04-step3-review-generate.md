# Prompt 04 — Step 3: Review & Generate

**Purpose:** Implement Step 3 review screen with task generation  
**Status:** 🟡 Backend Partial | Frontend Pending  
**Priority:** P0 — Critical Blocker  
**Depends on:** Prompt 03 (Step 2)

---

## Schema Verification ✅

**`tasks` Table:**
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | uuid | NO | Primary key |
| `startup_id` | uuid | NO | Foreign key to startups |
| `title` | text | NO | Task title |
| `description` | text | YES | Task details |
| `category` | text | YES | Task category |
| `priority` | text | YES | high/medium/low |
| `status` | text | YES | pending/in_progress/completed |
| `ai_generated` | boolean | YES | true if AI-created |
| `ai_source` | text | YES | 'onboarding-wizard' |

---

## Backend Status

| Action | Status | Notes |
|--------|--------|-------|
| `complete_wizard` | ⚠️ Partial | Saves startup, tasks TBD |
| Startup creation | ✅ | Creates startup record |
| Task generation | ❌ | Must be implemented |
| Session completion | ✅ | Marks session completed |

---

## Files to Create

**New Files:**
- `src/components/onboarding/Step3Review.tsx` — Step 3 review component
- `src/components/onboarding/TaskPreview.tsx` — Generated tasks preview

**Files to Modify:**
- `src/pages/OnboardingWizard.tsx` — Render Step3Review in main panel
- `src/hooks/useOnboardingAgent.ts` — Add `completeWizard` method

---

## Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    STEP 3: REVIEW & GENERATE                            │
├──────────────────────────────────────────────┬─────────────────────────┤
│                                              │                         │
│  MAIN PANEL                                  │    RIGHT PANEL          │
│                                              │    (Completion)         │
│  ┌──────────────────────────────────────┐   │                         │
│  │ Review Your Information              │   │  ┌───────────────────┐ │
│  │                                      │   │  │ Completion       │ │
│  │ ┌────────────────────────────────┐  │   │  │                   │ │
│  │ │ Profile & Business    [Edit]   │  │   │  │ Review all        │ │
│  │ │                                │  │   │  │ information       │ │
│  │ │ Company: Example Inc.          │  │   │  │                   │ │
│  │ │ Industry: SaaS                 │  │   │  │ After completion:│ │
│  │ │ Description: AI-powered...    │  │   │  │ • Tasks generated │ │
│  │ └────────────────────────────────┘  │   │  │ • Dashboard ready │ │
│  │                                      │   │  └───────────────────┘ │
│  │ ┌────────────────────────────────┐  │   │                         │
│  │ │ Traction & Funding    [Edit]   │  │   │  OR (During generation):│
│  │ │                                │  │   │                         │
│  │ │ MRR: $5,000                    │  │   │  ┌───────────────────┐ │
│  │ │ Users: 150                      │  │   │  │ Generating Tasks  │ │
│  │ │ Raising: Yes - $500K Seed       │  │   │  │                   │ │
│  │ └────────────────────────────────┘  │   │  │ 🔄 Creating your  │ │
│  │                                      │   │  │ onboarding tasks...│ │
│  │ ┌────────────────────────────────┐  │   │  └───────────────────┘ │
│  │ │ Generated Tasks Preview        │  │   │                         │
│  │ │                                │  │   │                         │
│  │ │ 1. [High] Setup payment...     │  │   │                         │
│  │ │ 2. [Medium] Configure...       │  │   │                         │
│  │ │ 3. [Low] Optimize...           │  │   │                         │
│  │ └────────────────────────────────┘  │   │                         │
│  │                                      │   │                         │
│  │ [← Back]    [Complete Setup ✓]       │   │                         │
│  └──────────────────────────────────────┘   │                         │
└──────────────────────────────────────────────┴─────────────────────────┘
```

---

## Task Generation (Backend Required)

The `complete_wizard` action needs to:
1. Save ALL startup fields (currently only saves 4)
2. Generate 5 tasks via Gemini
3. Insert tasks into `tasks` table
4. Return tasks in response

**Required Backend Changes:**

```typescript
// Task schema for Gemini structured output
const taskSchema = {
  type: 'OBJECT',
  properties: {
    tasks: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          description: { type: 'STRING' },
          priority: { type: 'STRING', enum: ['high', 'medium', 'low'] },
          category: { type: 'STRING' },
        },
        required: ['title', 'description', 'priority'],
      },
    },
  },
};

// Task generation prompt
const prompt = `Generate 5 prioritized onboarding tasks for a ${stage} stage ${industry} startup.
Context: ${description}
Is Raising: ${isRaising ? 'Yes' : 'No'}

Generate actionable tasks for: setup, growth, fundraising preparation.`;
```

---

## Transactional Flow (CRITICAL)

```
1. Validate session exists and is in_progress
2. Create/update startup with ALL fields
3. Generate tasks via AI
4. Insert tasks into database
5. ONLY THEN mark wizard as completed
6. Return { startup_id, tasks }
```

**Failure Handling:**
- Startup creation fails → Return error, don't proceed
- Task generation fails → Log warning, continue (non-blocking)
- Task insert fails → Log warning, continue (non-blocking)
- NEVER mark wizard completed if startup wasn't created

---

## Complete Wizard Response

```typescript
interface CompleteWizardResponse {
  success: boolean;
  startup_id: string | null;
  tasks: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
  }> | null;
  error?: string;
}
```

---

## Partial Success Handling

```typescript
// Frontend must handle all states:
if (result.startup_id && result.tasks?.length > 0) {
  // Full success - redirect to dashboard
  navigate('/dashboard');
} else if (result.startup_id && !result.tasks?.length) {
  // Partial success - startup saved, tasks failed
  toast.warning('Startup saved! Tasks will be generated later.');
  navigate('/dashboard');
} else {
  // Full failure - stay on wizard, show error
  toast.error(result.error || 'Failed to complete wizard');
}
```

---

## Success Criteria

- ✅ Step 3 review displays all wizard data
- ✅ User can edit sections before completion
- ✅ "Complete Setup" button triggers completion
- ✅ Loading state shows during task generation
- ✅ Generated tasks display in preview
- ✅ Startup profile saved to database
- ✅ Tasks saved to database (when implemented)
- ✅ Wizard session marked as completed
- ✅ Redirect to dashboard works
- ✅ Partial failure handled gracefully
