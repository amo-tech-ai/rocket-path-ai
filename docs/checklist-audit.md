# Onboarding Wizard Forensic Audit Report

**Audit Date**: 2026-01-23  
**Auditor**: Forensic Software Audit System  
**Version**: 2.0

---

## 🎯 Executive Summary

| Category | Status | Score |
|----------|--------|-------|
| Step 3 "0 questions = complete" | ✅ **FIXED** | 100% |
| Topics covered logic | ⚠️ **PARTIAL** | 70% |
| Backend question schema | ✅ **FIXED** | 100% |
| `run_analysis` missing action | ❌ **RED FLAG** | 0% |
| Step 4 traction display | ❌ **BROKEN** | 20% |
| Advisor persona shape | ✅ **FIXED** | 100% |
| Multi-select answer storage | ⚠️ **RISK** | 50% |
| Authentication (401 fix) | ✅ **FIXED** | 100% |

**Overall Correctness**: **68%**

---

## 📊 Detailed Analysis

### ✅ Issue #1: Step 3 "0 questions = complete" (FIXED - 100%)

**Claim**: Step 3 treats empty questions as complete, causing instant skip.

**Verification**:
```typescript
// Step3Interview.tsx lines 71-75
const hasQuestions = questions && questions.length > 0;
const currentQuestion = hasQuestions ? questions[currentQuestionIndex] : null;
const isComplete = hasQuestions && currentQuestionIndex >= questions.length;
const progressPercent = hasQuestions ? Math.min((currentQuestionIndex / questions.length) * 100, 100) : 0;
```

**Status**: ✅ **CORRECTLY IMPLEMENTED**
- Guard `hasQuestions` prevents false completion
- NaN division prevented with `hasQuestions` check
- Loading state renders when questions empty (lines 102-114)

---

### ⚠️ Issue #2: Topics Covered Badge Logic (PARTIAL - 70%)

**Claim**: Topic matching is broken because of case mismatch.

**Verification**:
```typescript
// Step3Interview.tsx lines 134-137
const topicsCovered = [...new Set(answers.map(a => {
  const q = questions.find(q => q.id === a.question_id);
  return q?.topic;
}).filter(Boolean))] as string[];

// Line 155
const isCovered = topicsCovered.includes(topic.toLowerCase());
```

**Backend topics** (onboarding-agent lines 509-568):
```typescript
topic: "traction"  // lowercase
topic: "funding"   // lowercase
topic: "team"      // lowercase
topic: "market"    // lowercase
```

**UI TOPICS array** (line 53):
```typescript
const TOPICS = ['Business Model', 'Market', 'Traction', 'Team', 'Funding'];
```

**Problem Found**: 
- Backend sends: `"traction"`, `"market"`, `"team"`, `"funding"`
- UI checks: `"business model"`, `"market"`, `"traction"`, `"team"`, `"funding"`
- **Partial match**: `market`, `traction`, `team`, `funding` will work
- **Broken**: "Business Model" will NEVER match (backend has no such topic)

**Status**: ⚠️ **PARTIALLY WORKING** (4/5 topics match, 1 never matches)

---

### ✅ Issue #3: Backend Question Schema (FIXED - 100%)

**Claim**: Backend returns wrong shape (question/category vs text/topic).

**Verification** (onboarding-agent lines 504-570):
```typescript
const allQuestions = [
  {
    id: "q1_traction",
    text: "What's your current monthly revenue or traction?",  // ✅ text (not question)
    type: "multiple_choice" as const,                          // ✅ type present
    topic: "traction",                                          // ✅ topic (not category)
    why_matters: "Traction is one of the strongest...",        // ✅ why_matters present
    options: [
      { id: "a1", text: "Pre-revenue" },                       // ✅ correct shape
    ],
  },
];
```

**Status**: ✅ **CORRECTLY IMPLEMENTED**

---

### ❌ Issue #4: `run_analysis` Action Missing (RED FLAG - 0%)

**Claim**: Client calls `run_analysis` but backend has no case for it.

**Client** (useOnboardingAgent.ts lines 275-289):
```typescript
const runAnalysisMutation = useMutation({
  mutationFn: (params: { session_id: string }): Promise<...> =>
    invokeAgent({
      action: 'run_analysis',  // ❌ This action is called
      session_id: params.session_id,
    }),
});
```

**Backend switch** (onboarding-agent lines 1018-1111):
```typescript
switch (action) {
  case "create_session": ...
  case "update_session": ...
  // ... NO "run_analysis" case
  default:
    throw new Error(`Unknown action: ${action}`);  // ❌ Will hit this
}
```

**Status**: ❌ **GUARANTEED RUNTIME ERROR** when called

---

### ❌ Issue #5: Step 4 Traction Display (BROKEN - 20%)

**Claim**: Step 4 expects `current_mrr` but backend stores `mrr_range`.

**Step4Review expectations** (lines 307-338):
```typescript
{data.extracted_traction?.current_mrr    // expects NUMBER
  ? `$${data.extracted_traction.current_mrr.toLocaleString()}`
  : 'Not set'}
```

**Backend stores** (onboarding-agent lines 611-643):
```typescript
extractedTraction = { mrr_range: "10k_plus" };    // ❌ STRING not number
extractedFunding = { is_raising: true };          // ❌ No target_amount
```

**Status**: ❌ **WILL ALWAYS SHOW "Not set"**

---

### ✅ Issue #6: Advisor Persona Shape (FIXED - 100%)

**Status**: ✅ Backend now returns `intro` field (lines 581-584)

---

### ⚠️ Issue #7: Multi-select Answer Storage (RISK - 50%)

**Status**: ⚠️ **FUTURE BUG** - No multi_select questions exist yet, but when added, signals won't detect

---

### ✅ Issue #8: Authentication 401 Fix (FIXED - 100%)

**Status**: ✅ `invokeAgent()` helper explicitly attaches JWT (lines 114-131)

---

## 🔴 Critical Errors (P0 - Fix Immediately)

| # | Issue | File | Impact |
|---|-------|------|--------|
| 1 | `run_analysis` not implemented | `onboarding-agent/index.ts` | 400 error when called |
| 2 | Traction fields mismatch | `Step4Review.tsx` + backend | Always shows "Not set" |

---

## 🟡 Medium Issues (P1 - Fix Soon)

| # | Issue | File | Impact |
|---|-------|------|--------|
| 3 | "Business Model" topic never matches | `Step3Interview.tsx` | Badge never activates |
| 4 | Multi-select will break signals | `processAnswer()` | Future bug |

---

## 🟢 Working Correctly

| # | Feature | Status |
|---|---------|--------|
| 1 | Empty questions guard | ✅ |
| 2 | Question schema (text/topic/type) | ✅ |
| 3 | Advisor intro field | ✅ |
| 4 | JWT authentication helper | ✅ |
| 5 | Loading state for questions | ✅ |
| 6 | Questions load on Step 3 mount | ✅ |
| 7 | canProceed() guards empty questions | ✅ |

---

## 📋 Implementation Fixes Required

### Fix #1: Remove `run_analysis` (Immediate)
Remove lines 274-289, 301, 311, 322 from `useOnboardingAgent.ts`

### Fix #2: Align Traction Display (Immediate)
Update `Step4Review.tsx` to display `mrr_range` string instead of `current_mrr` number

### Fix #3: Normalize Topic Matching
Add normalization to topic comparison in `Step3Interview.tsx`

---

## 📈 Progress Tracker

| Milestone | Status |
|-----------|--------|
| Authentication fix (invokeAgent) | ✅ Done |
| Question schema alignment | ✅ Done |
| Empty questions guard | ✅ Done |
| Questions load on Step 3 mount | ✅ Done |
| canProceed() guards Step 3 | ✅ Done |
| Remove `run_analysis` | ⏳ Pending |
| Fix traction display | ⏳ Pending |
| Fix topic normalization | ⏳ Pending |

---

## 🧪 User Journey Verification

- [ ] **Step 1 → Step 2**: Form validates, advances
- [ ] **Step 2 → Step 3**: Readiness calculated, questions load
- [ ] **Step 3**: Questions render, answers record, topics highlight
- [ ] **Step 3 → Step 4**: Score calculates, summary generates
- [ ] **Step 4 → Complete**: Startup created, redirects to dashboard
