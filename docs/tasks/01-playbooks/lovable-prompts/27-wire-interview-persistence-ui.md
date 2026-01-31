---
task_number: "27"
title: "Wire Interview Persistence UI"
category: "Integration Fix"
subcategory: "Onboarding"
phase: 1
priority: "P0"
status: "Open"
percent_complete: 0
owner: "Frontend Developer"
source: "tasks/testing/07-lovable-audit.md"
depends_on: ["24"]
---

# Prompt 27: Wire Interview Persistence UI

> **Forensic Finding:** Task 24 code exists (`useInterviewPersistence`, `ResumeInterviewDialog`, `AutoSaveIndicator`) but is **not integrated** into `OnboardingWizard.tsx`. Users lose interview progress on refresh.

---

## 📋 Summary Table

| Item | Value |
|:---|:---|
| **Issue** | Interview persistence components exist but are NOT rendered in OnboardingWizard |
| **Components** | `ResumeInterviewDialog.tsx`, `AutoSaveIndicator.tsx` |
| **Hook** | `useInterviewPersistence()` |
| **Impact** | Users lose 5+ minutes of interview work on accidental refresh |
| **Fix Type** | Integration wiring (no new code needed, just imports + render) |

---

## 🎯 User Stories & Real-World Journeys

### Story 1: Sarah — The Interrupted Founder

**Persona:** Sarah, 34, SaaS founder, working from coffee shop with spotty WiFi.

**Journey:**
1. Sarah completes Step 1 (URL + context) in 3 minutes
2. She starts Step 3 interview, answers 3 of 5 questions (8 minutes invested)
3. Her laptop closes briefly when she grabs her coffee — browser refreshes
4. **Current behavior:** All answers gone, starts at Question 1 again
5. **Expected behavior:** "Resume Interview?" dialog appears, she clicks "Continue", picks up at Question 4

**Frustration quote:** "I literally just answered that. This is the third time I've had to redo this."

**Success quote:** "Oh nice, it remembered where I was. Smart."

---

### Story 2: Marcus — The Mobile Context-Switcher

**Persona:** Marcus, 28, fintech founder, doing onboarding between meetings on iPad.

**Journey:**
1. Marcus starts onboarding on iPad during lunch
2. Gets phone call — switches apps — iOS kills the browser tab
3. Returns 20 minutes later, reopens StartupAI
4. **Current behavior:** "Let's start your onboarding!" — all progress gone
5. **Expected behavior:** "Welcome back! You were on Question 4 of 5. Resume?" → Resume dialog

**Frustration quote:** "I don't have time to redo this. I'll come back later." (never returns)

**Success quote:** "Thank god it saved. I can finish this in 2 minutes."

---

### Story 3: Emma — The Power User

**Persona:** Emma, 41, serial entrepreneur, doing onboarding for 3rd startup.

**Journey:**
1. Emma answers questions quickly, sees auto-save indicator pulsing
2. She opens new tab to research something, accidentally closes original tab
3. **Current behavior:** No indication progress was saved, panics
4. **Expected behavior:** Auto-save indicator showed "Saved 10s ago" — she reopens tab confidently, resume dialog appears

**UX insight:** Power users want *visible confirmation* that data is being saved.

---

## ✅ Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| 1 | `useInterviewPersistence()` is called in `OnboardingWizard.tsx` | `grep 'useInterviewPersistence' OnboardingWizard.tsx` returns match |
| 2 | `ResumeInterviewDialog` is rendered conditionally | Inspect DOM on Step 3 mount with existing session |
| 3 | `AutoSaveIndicator` is visible during interview | Visible in header/toolbar area during Step 3 |
| 4 | Refresh during Step 3 → Resume dialog appears | Manual QA: answer 2 questions, refresh, dialog appears |
| 5 | "Start Fresh" button clears saved progress | Click "Start Fresh" → starts at Q1, old answers gone |
| 6 | "Continue" button restores question index + answers | Click "Continue" → shows Q3, Q1-Q2 answers preserved |

---

## 🛠 Implementation Steps

### Step 1: Add imports to OnboardingWizard.tsx

```typescript
// Add to existing imports (line ~19-34)
import { useInterviewPersistence } from '@/hooks/onboarding/useInterviewPersistence';
import { ResumeInterviewDialog } from '@/components/onboarding/ResumeInterviewDialog';
import { AutoSaveIndicator } from '@/components/onboarding/AutoSaveIndicator';
```

### Step 2: Call the hook

```typescript
// After useOnboardingAgent() call (line ~82)
const {
  showResumeDialog,
  setShowResumeDialog,
  lastSaved,
  handleResume,
  handleStartFresh,
} = useInterviewPersistence();
```

### Step 3: Render ResumeInterviewDialog

```tsx
// Inside the return, before WizardLayout (line ~384)
<ResumeInterviewDialog
  open={showResumeDialog && currentStep === 3}
  onOpenChange={setShowResumeDialog}
  progress={{
    currentQuestion: currentQuestionIndex + 1,
    totalQuestions: questions.length || 5,
    answeredCount: answers.length,
  }}
  onResume={() => {
    handleResume();
    setShowResumeDialog(false);
  }}
  onStartFresh={() => {
    handleStartFresh();
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setShowResumeDialog(false);
  }}
/>
```

### Step 4: Render AutoSaveIndicator

```tsx
// Inside the step header area (line ~462, after Step X of Y)
{currentStep === 3 && (
  <AutoSaveIndicator
    lastSaved={lastSaved}
    isSaving={isSaving}
    className="ml-auto"
  />
)}
```

### Step 5: Wire session sync

The `useInterviewPersistence` hook reads from `useWizardSession`, which already syncs `interview_answers` and `interview_progress`. Ensure the existing `useEffect` (line ~262) correctly populates `answers` and `currentQuestionIndex` from `session.form_data`.

---

## 🔬 Verification Commands

```bash
# 1. Check imports
grep -n "useInterviewPersistence\|ResumeInterviewDialog\|AutoSaveIndicator" src/pages/OnboardingWizard.tsx

# 2. Check component renders
grep -n "ResumeInterviewDialog\|AutoSaveIndicator" src/pages/OnboardingWizard.tsx | grep -v "import"

# 3. Manual test flow
# - Start onboarding, reach Step 3
# - Answer 2 questions
# - Refresh page
# - Expect: Resume dialog appears
# - Click "Continue"
# - Expect: At Question 3, with Q1-Q2 answers visible
```

---

## 📂 Files to Modify

| File | Change |
|------|--------|
| `src/pages/OnboardingWizard.tsx` | Add imports, call hook, render components |

**No new files needed.** All components and hooks already exist.

---

## 🚨 Common Pitfalls

1. **Don't import from index** — Import directly from the hook file if barrel export has issues
2. **Dialog placement** — Render *before* `<WizardLayout>` or inside it, not inside step content
3. **State sync** — `handleStartFresh` must clear local state (`setAnswers([])`) in addition to calling the hook
4. **Conditional render** — Only show dialog when `showResumeDialog && currentStep === 3`

---

## 📊 Success Metrics

| Metric | Before | After |
|--------|--------|-------|
| Interview abandonment rate | ~25% | <10% |
| Support tickets "lost progress" | 5/week | 0 |
| NPS for onboarding | 45 | 65+ |

---

## 📝 References

- **Audit finding:** `tasks/testing/07-lovable-audit.md` (Section 4, Task 24)
- **Original task:** `tasks/prompts/24-fix-interview-persistence.md`
- **Component source:** `src/components/onboarding/ResumeInterviewDialog.tsx`
- **Hook source:** `src/hooks/onboarding/useInterviewPersistence.ts`
