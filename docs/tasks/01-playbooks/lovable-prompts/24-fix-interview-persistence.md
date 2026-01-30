---
task_number: "24"
title: "Fix Interview Answer Persistence"
category: "Bug Fix"
subcategory: "Frontend State"
phase: 1
priority: "P1"
status: "Open"
percent_complete: 0
owner: "Frontend Developer"
source: "tasks/testing/02-testing-strategy.md"
---

# Fix Interview Answer Persistence

**Priority:** Medium
**Source:** QA Testing (2026-01-30)
**Issue:** Interview answers reset on page refresh

---

## Problem Statement

During Step 3 (Smart Interviewer), users can answer 5 questions. However, if the page refreshes mid-interview, all answers are lost and the user must start over.

**Impact:** Users lose progress, leading to frustration and potential abandonment.

---

## Observed Behavior

| Action | Expected | Actual |
|--------|----------|--------|
| Answer Q1, Q2, refresh | Answers restored, continue from Q3 | ❌ All answers reset, back to Q1 |
| Complete 5 questions, refresh | "Interview Complete" shown | ⚠️ Need to verify |

**Root Cause:** Answers stored only in React component state (`useState`), not persisted.

---

## Implementation Plan

### Option A: localStorage (Quick Fix)

```typescript
// File: src/components/onboarding/step3/Step3Interview.tsx

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'interview_answers';

export function Step3Interview({ startupId }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_${startupId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed.answers || {});
        setCurrentQuestion(parsed.currentQuestion || 0);
      } catch (e) {
        console.error('Failed to restore interview state:', e);
      }
    }
  }, [startupId]);

  // Persist to localStorage on answer change
  const handleAnswerSelect = (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    // Persist immediately
    localStorage.setItem(`${STORAGE_KEY}_${startupId}`, JSON.stringify({
      answers: newAnswers,
      currentQuestion: currentQuestion + 1,
      updatedAt: new Date().toISOString()
    }));
  };

  // Clear on completion
  const handleInterviewComplete = () => {
    localStorage.removeItem(`${STORAGE_KEY}_${startupId}`);
    // ... proceed to Step 4
  };

  return (
    // ... component JSX
  );
}
```

### Option B: Supabase (Robust Fix - Recommended)

```typescript
// File: src/components/onboarding/step3/Step3Interview.tsx

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function Step3Interview({ startupId }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Restore from Supabase on mount
  useEffect(() => {
    async function loadProgress() {
      const { data, error } = await supabase
        .from('playbook_runs')
        .select('data')
        .eq('startup_id', startupId)
        .eq('step', 'interview')
        .single();

      if (data?.data) {
        setAnswers(data.data.answers || {});
        setCurrentQuestion(data.data.currentQuestion || 0);
      }
    }
    loadProgress();
  }, [startupId]);

  // Persist to Supabase on answer change
  const handleAnswerSelect = async (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    setIsSaving(true);

    const { error } = await supabase
      .from('playbook_runs')
      .upsert({
        startup_id: startupId,
        step: 'interview',
        data: {
          answers: newAnswers,
          currentQuestion: currentQuestion + 1
        },
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'startup_id,step'
      });

    if (error) {
      console.error('Failed to save interview progress:', error);
      // Fallback to localStorage
      localStorage.setItem(`interview_${startupId}`, JSON.stringify(newAnswers));
    }

    setIsSaving(false);
  };

  return (
    <div>
      {isSaving && <span className="text-muted-foreground text-sm">Saving...</span>}
      {/* ... rest of component */}
    </div>
  );
}
```

### Option C: Hybrid (localStorage + Supabase)

```typescript
// Best of both: instant localStorage, background Supabase sync

const handleAnswerSelect = async (questionId: string, answer: string) => {
  const newAnswers = { ...answers, [questionId]: answer };
  setAnswers(newAnswers);

  // Instant localStorage (offline-capable)
  localStorage.setItem(`interview_${startupId}`, JSON.stringify({
    answers: newAnswers,
    currentQuestion: currentQuestion + 1,
    syncedAt: null
  }));

  // Background Supabase sync
  try {
    await supabase.from('playbook_runs').upsert({
      startup_id: startupId,
      step: 'interview',
      data: { answers: newAnswers, currentQuestion: currentQuestion + 1 },
      updated_at: new Date().toISOString()
    });

    // Mark as synced
    const local = JSON.parse(localStorage.getItem(`interview_${startupId}`) || '{}');
    local.syncedAt = new Date().toISOString();
    localStorage.setItem(`interview_${startupId}`, JSON.stringify(local));
  } catch (e) {
    console.warn('Background sync failed, will retry:', e);
  }
};
```

---

## Database Schema

If using `playbook_runs` table (recommended):

```sql
-- Check if table exists
SELECT * FROM playbook_runs LIMIT 1;

-- If not, create it (or verify migration applied)
-- Migration: 20260130200000_advanced_playbook_tables.sql
CREATE TABLE IF NOT EXISTS playbook_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
  step TEXT NOT NULL,  -- 'interview', 'analysis', 'review'
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(startup_id, step)
);

-- RLS policy
ALTER TABLE playbook_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own playbook runs"
  ON playbook_runs
  FOR ALL
  USING (startup_id IN (
    SELECT id FROM startups WHERE user_id = auth.uid()
  ));
```

---

## UX Enhancements (Optional)

### Auto-save indicator

```tsx
{isSaving && (
  <div className="flex items-center gap-2 text-muted-foreground text-sm">
    <Loader2 className="h-3 w-3 animate-spin" />
    Saving...
  </div>
)}
```

### Resume modal

```tsx
const [showResumeModal, setShowResumeModal] = useState(false);

useEffect(() => {
  const saved = localStorage.getItem(`interview_${startupId}`);
  if (saved) {
    const { answers } = JSON.parse(saved);
    if (Object.keys(answers).length > 0) {
      setShowResumeModal(true);
    }
  }
}, []);

// Modal component
<AlertDialog open={showResumeModal}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Resume Interview?</AlertDialogTitle>
      <AlertDialogDescription>
        You have {Object.keys(savedAnswers).length} answers saved.
        Would you like to continue where you left off?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={handleStartFresh}>
        Start Fresh
      </AlertDialogCancel>
      <AlertDialogAction onClick={handleResume}>
        Continue
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## Acceptance Criteria

- [ ] Answer Q1 and Q2, refresh page → answers restored
- [ ] Complete all 5 questions, refresh → "Interview Complete" shown
- [ ] Verify `playbook_runs` table has interview data
- [ ] Auto-save indicator shows when persisting
- [ ] Clear saved data when interview completes

---

## Testing

```typescript
// Test: Interview persistence
describe('Step3Interview', () => {
  it('restores answers from localStorage on refresh', () => {
    // Setup: Save answers to localStorage
    localStorage.setItem('interview_abc123', JSON.stringify({
      answers: { q1: 'pre-revenue', q2: '100-1000' },
      currentQuestion: 2
    }));

    // Render component
    render(<Step3Interview startupId="abc123" />);

    // Assert: Should show Q3, not Q1
    expect(screen.getByText('Question 3 of 5')).toBeInTheDocument();
  });
});
```

---

## Related Files

| File | Purpose |
|------|---------|
| `src/components/onboarding/step3/Step3Interview.tsx` | Main component to fix |
| `src/components/onboarding/step3/QuestionCard.tsx` | Individual question UI |
| `supabase/migrations/20260130200000_advanced_playbook_tables.sql` | Schema for playbook_runs |

---

## References

- Error source: QA Testing (2026-01-30)
- Testing strategy: `tasks/testing/02-testing-strategy.md`
- Playbook runs schema: `tasks/prompts/11-playbook-system-implementation.md`
