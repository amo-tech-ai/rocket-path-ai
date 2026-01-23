# Prompt 05 — Wizard AI Panel Component

**Purpose:** Implement right panel AI intelligence component  
**Status:** 🟡 Backend Ready | Frontend Pending  
**Priority:** P1 — High Priority  
**Depends on:** Prompts 01-04 (All Steps)

---

## AI Models Verified ✅

| Agent | Model | Status | Notes |
|-------|-------|--------|-------|
| ProfileExtractor | `gemini-3-flash-preview` | ✅ | URL Context + Structured Output |
| TaskGenerator | `gemini-3-flash-preview` | ⚠️ | Needs implementation |

---

## Files to Create

**New Files:**
- `src/components/onboarding/WizardAIPanel.tsx` — Right panel AI component

**Files to Modify:**
- `src/pages/OnboardingWizard.tsx` — Pass WizardAIPanel to WizardLayout
- `src/components/onboarding/Step1Profile.tsx` — Connect extraction state

---

## Panel States by Step

### Step 1: Extraction States

**Empty State (Before Extraction):**
```
┌─────────────────────┐
│ Step 1 Guidance     │
│                     │
│ Profile & Business  │
│                     │
│ What we need:       │
│ • Company info      │
│ • Industry          │
│ • Description       │
│                     │
│ Tips:               │
│ • Use website URL   │
│   for AI extraction │
│ • Be specific       │
└─────────────────────┘
```

**Loading State (During Extraction):**
```
┌─────────────────────┐
│ AI Extraction       │
│                     │
│  🔄                │
│                     │
│ Analyzing website...│
│                     │
│ This may take a     │
│ few seconds         │
│                     │
│ [Cancel]            │
└─────────────────────┘
```

**Success State (After Extraction):**
```
┌─────────────────────┐
│ Extracted Data      │
│                     │
│ Company Name        │
│ "Example Inc."      │
│ Confidence: 95%     │
│ [✓ Apply]           │
│                     │
│ Industry            │
│ "SaaS"              │
│ Confidence: 92%     │
│ [✓ Apply]           │
│                     │
│ [Apply All]         │
│ [Reject]            │
└─────────────────────┘
```

### Step 2: Guidance State

```
┌─────────────────────┐
│ Step 2 Guidance     │
│                     │
│ Traction & Funding  │
│                     │
│ Examples:           │
│ • $5,000 MRR        │
│ • 150 users         │
│ • 20% growth        │
│                     │
│ Tips:               │
│ • Be honest         │
│ • Use real data     │
│                     │
│ Next: Review        │
└─────────────────────┘
```

### Step 3: Task Generation States

**Loading State:**
```
┌─────────────────────┐
│ Task Generation     │
│                     │
│  🔄                │
│                     │
│ Generating your     │
│ onboarding tasks... │
│                     │
│ This may take a     │
│ few seconds         │
└─────────────────────┘
```

**Success State:**
```
┌─────────────────────┐
│ Tasks Generated     │
│                     │
│ ✓ 5 tasks created   │
│                     │
│ Your dashboard      │
│ is ready!           │
│                     │
│ Redirecting...      │
└─────────────────────┘
```

---

## Component Interface

```typescript
interface WizardAIPanelProps {
  currentStep: 1 | 2 | 3;
  extraction?: ExtractionResult | null;
  isExtracting: boolean;
  tasks?: Task[] | null;
  isGeneratingTasks: boolean;
  onApplyField: (field: string, value: any) => void;
  onApplyAll: () => void;
  onReject: () => void;
  onCancelExtraction: () => void;
}
```

---

## Task Existence Guard (CRITICAL)

```typescript
// Step 3 panel must handle missing tasks gracefully
if (completionResult?.tasks?.length > 0) {
  return <TaskPreview tasks={completionResult.tasks} />;
} else if (completionResult?.startup_id) {
  return <PartialSuccess message="Startup saved! Tasks will be generated later." />;
} else if (isLoading) {
  return <TaskGenerationLoading />;
} else {
  return <StepGuidance step={3} />;
}
```

---

## Step Guidance Content

```typescript
const stepGuidance = {
  1: {
    title: 'Profile & Business',
    description: 'Tell us about your company',
    tips: [
      'Use your website URL for AI-powered extraction',
      'Be specific in your description',
      'Choose the most relevant industry',
    ],
  },
  2: {
    title: 'Traction & Funding',
    description: 'Share your metrics and goals',
    tips: [
      'Be honest about your numbers',
      'Include approximate values if unsure',
      'Funding information helps us prioritize tasks',
    ],
  },
  3: {
    title: 'Review & Generate',
    description: 'Confirm and create your profile',
    tips: [
      'Review all information carefully',
      'You can edit after completion',
      '5 personalized tasks will be generated',
    ],
  },
};
```

---

## Success Criteria

- ✅ AI panel displays correct content for each step
- ✅ Step 1: Extraction loading state works
- ✅ Step 1: Extracted data displays with confidence scores
- ✅ Step 1: Apply/Reject buttons work
- ✅ Step 2: Guidance displays correctly
- ✅ Step 3: Task generation status shows
- ✅ Step 3: Task preview displays correctly
- ✅ Panel content updates on step navigation
- ✅ Error states handled gracefully
- ✅ Partial success handled correctly
