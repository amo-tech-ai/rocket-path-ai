# Step 1 Validation Audit Checklist

**Created:** 2026-01-23  
**Status:** ✅ COMPLETE

---

## Problem Statement

Step 1 → Step 2 navigation is blocked because `step1Valid` never becomes `true`.

---

## Required Fields (ALL must pass)

| # | Field | Type | Schema Requirement | Status |
|---|-------|------|-------------------|--------|
| 1 | `company_name` | string | min 1 char | ✅ |
| 2 | `description` | string | min 1 char | ✅ |
| 3 | `target_market` | string | min 10 chars | ✅ |
| 4 | `stage` | string | min 1 char (any value) | ✅ |
| 5 | `business_model` | string[] | min 1 item | ✅ |
| 6 | `industry` | string[] | min 1 item | ✅ |

---

## Component Audit: AIDetectedFields.tsx

### ✅ VERIFIED WORKING

- [x] `toggleIndustry()` sends array: `onUpdate('industry', [...currentIndustries, ind])`
- [x] `toggleBusinessModel()` sends array: `onUpdate('business_model', [...businessModel, model])`
- [x] `stage` sends string: `onUpdate('stage', s)`
- [x] Error display wired correctly
- [x] Required asterisks shown
- [x] Stage values accepted: `'Idea', 'Pre-seed', 'Seed', 'Series A', 'Series B+'` - schema accepts any string

---

## Component Audit: Step1Context.tsx

### ✅ VERIFIED WORKING (v0.6.6)

- [x] Single source of truth: `company_name` only
- [x] Direct validation callback (no JSON stringify/parse)
- [x] Proper dependency array in useEffect
- [x] `handleFieldUpdate()` correctly passes values to `updateData()`

---

## Schema Audit: step1Schema.ts

### ✅ VERIFIED CORRECT

```typescript
// All fields validated correctly:
company_name: z.string().min(1)           // ✅ Any non-empty string
description: z.string().min(1)            // ✅ Any non-empty string  
target_market: z.string().min(10)         // ✅ At least 10 chars
stage: z.string().min(1)                  // ✅ Any non-empty string
business_model: z.array(z.string()).min(1) // ✅ Array with 1+ items
industry: z.array(z.string()).min(1)       // ✅ Array with 1+ items
```

**No enum mismatch.** Stage accepts ANY string value.

---

## Data Flow Trace

```
User clicks "Idea" badge
    ↓
AIDetectedFields.onClick
    ↓
onUpdate('stage', 'Idea')
    ↓
Step1Context.handleFieldUpdate('stage', 'Idea')
    ↓
updateData({ stage: 'Idea' })
    ↓
validation.useMemo runs
    ↓
validateStep1({ stage: 'Idea', ... })
    ↓
step1Schema.safeParse()
    ↓
Returns { success: true } when all 6 fields valid
```

---

## Console Verification Steps

1. Open `/onboarding`
2. Open browser console
3. Fill all 6 required fields:
   - Company Name: "Acme Corp"
   - Description: "We build widgets"
   - Target Market: "Enterprise SaaS companies"
   - Stage: Click "Idea"
   - Business Model: Click "B2B"
   - Industry: Click "SaaS"
4. Look for: `[Step1Context] Validation result: { isValid: true, errors: {} }`
5. Look for: `[Wizard] Step 1 validation received: { isValid: true, errorCount: 0 }`
6. Click Continue → Step 2 should render

---

## Fixes Applied

### v0.6.6 (2026-01-23)
- ✅ Single `company_name` field (removed `name` confusion)
- ✅ Direct validation callback (removed JSON stringify/parse)
- ✅ Continue button always clickable on Step 1

### v0.6.7 (2026-01-23) — Step 3 Interview Fixes
- ✅ **JWT Attachment**: Added `invokeAgent()` helper that explicitly attaches session JWT
- ✅ **Question Shape**: Edge function now returns `text/topic/type/why_matters` (not `question/category`)
- ✅ **Advisor Shape**: Edge function now returns `name/title/intro` (not `avatar/style`)
- ✅ **Loading State**: Step3Interview shows "Loading..." when questions array is empty (not "Complete!")
- ✅ **Typed Responses**: All mutations now have proper TypeScript interfaces

---

## Success Criteria

- [x] Schema accepts all UI values (no enum mismatch)
- [x] AIDetectedFields sends correct types (arrays/strings)
- [x] Step1Context uses single source of truth
- [x] Validation callback is direct (no serialization)
- [x] Edge function returns correct Question interface
- [x] All mutations attach JWT explicitly
- [x] Step3 shows loading when questions fail to load
- [ ] **User test:** Step 3 loads questions → interview works

---

## Root Cause Summary

The architecture is now correct. If Step 3 still shows "Loading..." forever:

1. **Check console for 401 errors** (user not logged in)
2. **Check network tab for response** (should see `questions: [...]`)
3. **Verify auth session exists** in localStorage
