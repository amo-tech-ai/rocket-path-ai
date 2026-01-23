# Prompt 01 — Wizard Layout & Infrastructure Setup

**Purpose:** Set up 3-panel wizard layout infrastructure and routing  
**Status:** 🟡 Backend Ready | Frontend Pending  
**Priority:** P0 — Critical Blocker

---

## Schema Verification ✅

**`wizard_sessions` Table (Verified):**
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | uuid | NO | Primary key |
| `user_id` | uuid | NO | Foreign key to auth.users |
| `startup_id` | uuid | YES | Set on completion |
| `current_step` | integer | YES | 1, 2, or 3 |
| `status` | text | YES | 'in_progress' or 'completed' |
| `form_data` | jsonb | YES | All form field values |
| `ai_extractions` | jsonb | YES | ProfileExtractor results |
| `extracted_traction` | jsonb | YES | Traction metrics |
| `extracted_funding` | jsonb | YES | Funding details |
| `profile_strength` | integer | YES | 0-100 |
| `started_at` | timestamptz | YES | Session start |
| `completed_at` | timestamptz | YES | Session completion |

---

## Edge Function Actions ✅

**Endpoint:** `https://yvyesmiczbjqwbqtlidy.supabase.co/functions/v1/onboarding-agent`

| Action | Status | Description |
|--------|--------|-------------|
| `create_session` | ✅ | Initialize new wizard session |
| `get_session` | ✅ | Load existing session |
| `update_session` | ✅ | Save form data (debounced) |
| `enrich_url` | ✅ | AI extraction from URL |
| `enrich_context` | ✅ | AI extraction from text |
| `complete_wizard` | ⚠️ | Saves startup, tasks TBD |

---

## Files to Create

**New Files:**
- `src/pages/OnboardingWizard.tsx` — Main wizard page
- `src/components/onboarding/WizardLayout.tsx` — 3-panel layout wrapper
- `src/components/onboarding/StepProgress.tsx` — Left panel progress indicator

**Files to Modify:**
- `src/App.tsx` — Add `/onboarding` route with ProtectedRoute

---

## Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ONBOARDING WIZARD                               │
├──────────┬──────────────────────────────────────────────┬───────────────┤
│          │                                              │               │
│  LEFT    │              MAIN PANEL                     │    RIGHT      │
│  PANEL   │         (Current Step Form)                │    PANEL      │
│  (256px) │                (flex)                       │   (320px)     │
│          │                                              │               │
│ ┌──────┐ │  ┌──────────────────────────────────────┐  │  ┌──────────┐ │
│ │ Step │ │  │  Step 1: Profile & Business          │  │  │   AI     │ │
│ │  1   │ │  │                                      │  │  │ Panel    │ │
│ │  ✓   │ │  │  Company Name: [____________]        │  │  │          │ │
│ ├──────┤ │  │                                      │  │  │ Loading  │ │
│ │ Step │ │  │  Website URL: [____________] [AI]   │  │  │ State    │ │
│ │  2   │ │  │                                      │  │  │          │ │
│ │  →   │ │  │  Description: [____________]        │  │  │          │ │
│ ├──────┤ │  │                                      │  │  │          │ │
│ │ Step │ │  │  Industry: [Dropdown ▼]            │  │  │          │ │
│ │  3   │ │  │                                      │  │  │          │ │
│ │      │ │  │  Features: [Tags...]                │  │  │          │ │
│ └──────┘ │  │                                      │  │  │          │ │
│          │  │  [Back]              [Continue →]    │  │  │          │ │
│ Progress │  └──────────────────────────────────────┘  │  └──────────┘ │
│  33%     │                                              │               │
│          │                                              │               │
│ [Save &  │                                              │               │
│ Continue │                                              │               │
│  Later]  │                                              │               │
└──────────┴──────────────────────────────────────────────┴───────────────┘
```

---

## Completion Source of Truth (CRITICAL)

```typescript
// A wizard is COMPLETE if and only if:
const isWizardComplete =
  wizardSession?.status === 'completed' &&
  wizardSession?.startup_id !== null;

// Redirect logic:
// - /onboarding → /dashboard if isWizardComplete
// - /dashboard → /onboarding if !isWizardComplete
```

---

## Implementation

### WizardLayout Component

```typescript
// src/components/onboarding/WizardLayout.tsx
interface WizardLayoutProps {
  currentStep: number;
  children: React.ReactNode;
  aiPanel: React.ReactNode;
  onStepChange: (step: number) => void;
  onSaveLater: () => void;
}
```

### StepProgress Component

```typescript
// src/components/onboarding/StepProgress.tsx
interface StepProgressProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

const steps = [
  { number: 1, title: 'Profile & Business', description: 'Company information' },
  { number: 2, title: 'Traction & Funding', description: 'Metrics and goals' },
  { number: 3, title: 'Review & Generate', description: 'Confirm and create' },
];
```

### Route Configuration

```typescript
// src/App.tsx - Add route
<Route
  path="/onboarding"
  element={
    <ProtectedRoute>
      <OnboardingWizard />
    </ProtectedRoute>
  }
/>
```

---

## Success Criteria

- ✅ `/onboarding` route accessible and protected
- ✅ 3-panel layout renders correctly
- ✅ Left panel shows step progress (1 of 3, 2 of 3, 3 of 3)
- ✅ Session loads from database on mount
- ✅ Auto-save works (debounced 500ms)
- ✅ Step navigation works (forward/back)
- ✅ Progress percentage calculates correctly
- ✅ Resume capability works (loads saved data)
- ✅ Redirect to dashboard if wizard already completed
