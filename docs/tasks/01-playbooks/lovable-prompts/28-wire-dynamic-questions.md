---
task_number: "28"
title: "Wire Dynamic Industry Questions"
category: "Integration Fix"
subcategory: "Onboarding"
phase: 1
priority: "P1"
status: "Open"
percent_complete: 0
owner: "Full Stack Developer"
source: "tasks/testing/07-lovable-audit.md"
depends_on: ["20", "27"]
---

# Prompt 28: Wire Dynamic Industry Questions

> **Forensic Finding:** Task 20 code exists (`useOnboardingQuestions`) but is **not integrated** into `OnboardingWizard.tsx`. The wizard uses `useOnboardingAgent.getQuestions()` which only calls `onboarding-agent` — NO industry-specific questions.

---

## 📋 Summary Table

| Item | Value |
|:---|:---|
| **Issue** | `useOnboardingQuestions(industryId)` exists but is NOT used in wizard |
| **Current Path** | `step3Handlers.loadQuestions()` → `useOnboardingAgent.getQuestions()` → `onboarding-agent` |
| **Expected Path** | `useOnboardingQuestions(industryId)` → `industry-expert-agent` (fallback: `onboarding-agent`) |
| **Impact** | Fintech founders get generic questions, not "How do you handle KYC/AML?" |
| **Fix Type** | Replace question loading logic in Step 3 |

---

## 🎯 User Stories & Real-World Journeys

### Story 1: Raj — The Fintech Founder

**Persona:** Raj, 38, building a neobank for gig workers in India.

**Journey (Current - Broken):**
1. Raj selects "Fintech" industry in Step 1
2. Reaches Step 3 interview
3. Gets asked: "What's your revenue model?" (generic question)
4. **Frustration:** "They don't even ask about RBI licensing? This platform doesn't understand fintech."

**Journey (Fixed):**
1. Raj selects "Fintech" industry in Step 1
2. Reaches Step 3 interview
3. Gets asked: "What's your regulatory strategy for RBI/NPCI compliance?"
4. Gets asked: "How do you plan to handle KYC verification at scale?"
5. **Reaction:** "Okay, this platform actually gets fintech. Let me take this seriously."

---

### Story 2: Dr. Maya — The Biotech Researcher

**Persona:** Dr. Maya, 45, spinning out a CRISPR therapy company from Stanford.

**Journey (Current - Broken):**
1. Maya selects "Healthcare / Biotech" in Step 1
2. Reaches Step 3 interview
3. Gets asked: "Who are your target customers?" (generic)
4. **Frustration:** "Customer? It's the FDA! I need to talk about clinical trials, not sales."

**Journey (Fixed):**
1. Maya selects "Healthcare / Biotech" in Step 1
2. Reaches Step 3 interview
3. Gets asked: "What phase is your clinical development (preclinical, Phase I/II/III)?"
4. Gets asked: "What's your IND filing timeline and regulatory pathway?"
5. **Reaction:** "Finally, an AI that speaks biotech. Let me fill this out properly."

---

### Story 3: Priya — The E-commerce Dropshipper

**Persona:** Priya, 26, running a jewelry dropshipping store.

**Journey (Current - Broken):**
1. Priya selects "E-commerce / Retail" in Step 1
2. Gets same generic questions as Raj and Maya
3. **Reaction:** "This feels like a template. Not useful."

**Journey (Fixed):**
1. Priya selects "E-commerce / Retail" in Step 1
2. Gets asked: "What's your average order value and repeat purchase rate?"
3. Gets asked: "How do you differentiate from Amazon/Alibaba competitors?"
4. **Reaction:** "These questions make me think about my business more strategically."

---

## ✅ Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| 1 | Industry ID is extracted from Step 1 form data | `console.log(formData.industry)` shows selected industry |
| 2 | `useOnboardingQuestions(industryId)` is called | `grep 'useOnboardingQuestions' OnboardingWizard.tsx` returns match |
| 3 | Questions come from `industry-expert-agent` first | Network tab shows call to `industry-expert-agent` with `action: get_questions` |
| 4 | Fallback to `onboarding-agent` if industry-expert fails | Test with invalid industry → still gets questions |
| 5 | Fintech industry → KYC/regulatory questions appear | Manual QA with "Fintech" selection |
| 6 | Healthcare industry → clinical/FDA questions appear | Manual QA with "Healthcare" selection |

---

## 🛠 Implementation Steps

### Step 1: Locate industry from form data

```typescript
// Already exists in OnboardingWizard.tsx (~line 201-203)
const selectedIndustry = Array.isArray(formData.industry)
  ? formData.industry[0]
  : formData.industry;
```

### Step 2: Add useOnboardingQuestions hook

```typescript
// Add import
import { useOnboardingQuestions } from '@/hooks/onboarding/useOnboardingQuestions';

// Call hook after selectedIndustry is defined
const {
  questions: industryQuestions,
  isLoading: isLoadingIndustryQuestions,
  error: industryQuestionsError,
  refetch: refetchQuestions,
} = useOnboardingQuestions(selectedIndustry);
```

### Step 3: Update question loading logic

Replace the current `step3Handlers.loadQuestions()` flow with industry-aware loading:

```typescript
// In useEffect for Step 3 question loading (~line 293-298)
useEffect(() => {
  if (currentStep === 3 && session?.id) {
    // Option A: Use industryQuestions from the hook directly
    if (industryQuestions && industryQuestions.length > 0) {
      setQuestions(industryQuestions);
    } else if (!isLoadingIndustryQuestions && questions.length === 0) {
      // Fallback to onboarding-agent if industry questions failed/empty
      console.log('[Wizard] No industry questions, falling back to onboarding-agent');
      step3Handlers.loadQuestions().catch(console.error);
    }
  }
}, [currentStep, session?.id, industryQuestions, isLoadingIndustryQuestions]);
```

### Step 4: Alternative — Modify useStep3Handlers

If you prefer to keep the handler pattern, modify `useStep3Handlers.ts`:

```typescript
// In src/pages/onboarding/useStep3Handlers.ts
import { useOnboardingQuestions } from '@/hooks/onboarding/useOnboardingQuestions';

export function useStep3Handlers({
  sessionId,
  industry, // Already passed in
  // ...other props
}: Step3HandlersProps) {

  // Use the industry-aware hook
  const { questions: industryQuestions } = useOnboardingQuestions(industry);

  const loadQuestions = useCallback(async () => {
    if (!sessionId) return;

    // Try industry questions first
    if (industryQuestions && industryQuestions.length > 0) {
      const mapped = industryQuestions.map(q => ({
        id: q.id,
        topic: q.topic,
        text: q.text,
        answer_type: q.answer_type,
        options: q.options,
      }));
      setQuestions(mapped);
      return;
    }

    // Fallback to onboarding-agent
    console.log('[Step3] Falling back to onboarding-agent for questions');
    const result = await getQuestions({ session_id: sessionId });
    // ... existing logic
  }, [sessionId, industryQuestions, getQuestions, setQuestions]);
}
```

---

## 📂 Files to Modify

| File | Change |
|------|--------|
| `src/pages/OnboardingWizard.tsx` | Add `useOnboardingQuestions` import and call |
| `src/pages/onboarding/useStep3Handlers.ts` | (Alternative) Integrate industry questions |

---

## 🔬 Verification Commands

```bash
# 1. Check hook exists and exports correctly
grep -n "useOnboardingQuestions" src/hooks/onboarding/index.ts

# 2. Check industry-expert-agent has get_questions action
grep -n "get_questions" supabase/functions/industry-expert-agent/index.ts

# 3. Check useOnboardingQuestions calls industry-expert
grep -n "industry-expert\|get_questions" src/hooks/onboarding/useOnboardingQuestions.ts

# 4. Manual test:
# - Select "Fintech" in Step 1
# - Proceed to Step 3
# - Open Network tab → look for industry-expert-agent call
# - Questions should reference "KYC", "compliance", "licensing"
```

---

## 🗄 Data Dependencies

The `industry_playbooks` table must have `investor_questions` JSONB populated for each industry:

```sql
-- Verify industry questions exist
SELECT
  industry_slug,
  jsonb_array_length(investor_questions) as question_count
FROM industry_playbooks
WHERE investor_questions IS NOT NULL;

-- Expected: 19 rows with 5-10 questions each
```

If questions are missing, run the seed from `supabase/industry_playbooks_rows.sql`.

---

## 🚨 Common Pitfalls

1. **Industry not passed** — Ensure `selectedIndustry` is defined before calling the hook
2. **Hook called with undefined** — Add guard: `useOnboardingQuestions(selectedIndustry ?? 'general')`
3. **Questions shape mismatch** — Map `industryQuestions` to expected `Question` type
4. **Fallback not triggered** — If industry-expert fails silently, check error handling

---

## 📊 Success Metrics

| Metric | Before | After |
|--------|--------|-------|
| Question relevance score (user rating) | 3.2/5 | 4.5/5 |
| Time to complete Step 3 | 8 min | 6 min |
| "Questions feel generic" feedback | 40% | <10% |

---

## 📝 References

- **Audit finding:** `tasks/testing/07-lovable-audit.md` (Section 1, Task 20)
- **Original task:** `tasks/prompts/20-onboarding-dynamic-questions.md`
- **Hook source:** `src/hooks/onboarding/useOnboardingQuestions.ts`
- **Industry playbooks schema:** `supabase/migrations/20260129000000_create_industry_playbooks.sql`
