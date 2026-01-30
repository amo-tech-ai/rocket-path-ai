---
task_number: "23"
title: "Fix Step 4 calculate_score and generate_summary 400 Errors"
category: "Bug Fix"
subcategory: "Edge Functions"
phase: 0
priority: "P0"
status: "Open"
percent_complete: 0
owner: "Backend Developer"
source: "tasks/testing/02-testing-strategy.md"
blocker: true
---

# Fix Step 4: calculate_score and generate_summary 400 Errors

**Priority:** 🔴 CRITICAL - Blocks onboarding completion
**Source:** QA Testing (2026-01-30)
**Error:** `FunctionsHttpError: Edge Function returned a non-2xx status code`

---

## Problem Statement

The `onboarding-agent` edge function returns **400 Bad Request** for two critical actions in Step 4 (Review & Score):

```
POST /functions/v1/onboarding-agent → 400 (calculate_score)
POST /functions/v1/onboarding-agent → 400 (generate_summary)
```

**Impact:** Users complete Steps 1-3 successfully, but Step 4 loads with an empty content area. No investor readiness score or AI summary is displayed.

---

## Observed Behavior

| Step | Action | Expected | Actual |
|------|--------|----------|--------|
| Step 3→4 | Click "Continue to Review" | Load investor score + summary | ❌ Empty page |
| Step 4 | Page render | Show score (0-100) + AI summary | ❌ Console errors, no content |

**Console Errors:**
```javascript
Calculate score failed: FunctionsHttpError: Edge Function returned a non-2xx status code
Generate summary failed: FunctionsHttpError: Edge Function returned a non-2xx status code
```

---

## Debug Steps

### 1. Check Edge Function Handler

**File:** `supabase/functions/onboarding-agent/index.ts`

Look for these action handlers:
```typescript
case 'calculate_score':
  // What does this handler expect?
  // What is it returning?
  break;

case 'generate_summary':
  // What does this handler expect?
  // What is it returning?
  break;
```

### 2. Check Request Payload

Verify the frontend sends required fields:
```typescript
// Expected payload structure
{
  action: 'calculate_score' | 'generate_summary',
  startup_id: string,
  // What other fields are required?
  profile_data?: object,
  interview_answers?: object,
  industry?: string,
  stage?: string
}
```

### 3. Check Supabase Function Logs

```bash
# View recent function invocations
supabase functions logs onboarding-agent --project-ref yvyesmiczbjqwbqtlidy

# Or in Supabase Dashboard:
# Project → Edge Functions → onboarding-agent → Logs
```

### 4. Test with curl

```bash
# Get a valid JWT first
JWT="<your_jwt_token>"
STARTUP_ID="<your_startup_id>"

# Test calculate_score
curl -X POST https://yvyesmiczbjqwbqtlidy.supabase.co/functions/v1/onboarding-agent \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "calculate_score",
    "startup_id": "'$STARTUP_ID'"
  }'

# Test generate_summary
curl -X POST https://yvyesmiczbjqwbqtlidy.supabase.co/functions/v1/onboarding-agent \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "generate_summary",
    "startup_id": "'$STARTUP_ID'"
  }'
```

### 5. Check Required Environment Variables

Ensure these are set in Supabase Edge Function secrets:
- `GEMINI_API_KEY` (for AI generation)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## Likely Root Causes

| Cause | Probability | Check |
|-------|-------------|-------|
| Missing action handler | High | Search for `calculate_score` in edge function |
| Missing required field | High | Check request payload vs handler expectations |
| Missing API key | Medium | Check `GEMINI_API_KEY` in function secrets |
| Database query error | Medium | Check if startup data exists |
| Invalid industry/stage | Low | Validate industry is in playbooks table |

---

## Fix Implementation

### If action handler is missing:

```typescript
// supabase/functions/onboarding-agent/index.ts

case 'calculate_score': {
  const { startup_id } = body;

  // Fetch startup data
  const { data: startup, error } = await supabase
    .from('startups')
    .select('*, profiles(*)')
    .eq('id', startup_id)
    .single();

  if (error || !startup) {
    return new Response(
      JSON.stringify({ error: 'Startup not found' }),
      { status: 404 }
    );
  }

  // Calculate investor readiness score
  const score = calculateInvestorScore(startup);

  return new Response(
    JSON.stringify({ score, breakdown: score.breakdown }),
    { status: 200 }
  );
}

case 'generate_summary': {
  const { startup_id } = body;

  // Fetch startup + industry context
  const { data: startup } = await supabase
    .from('startups')
    .select('*, industry_playbooks(*)')
    .eq('id', startup_id)
    .single();

  // Generate AI summary with Gemini
  const summary = await generateAISummary(startup);

  return new Response(
    JSON.stringify({ summary }),
    { status: 200 }
  );
}
```

### If missing required field:

Update frontend to pass all required fields:

```typescript
// src/components/onboarding/step4/Step4Review.tsx

const calculateScore = async () => {
  const { data, error } = await supabase.functions.invoke('onboarding-agent', {
    body: {
      action: 'calculate_score',
      startup_id: startupId,
      // Add any missing required fields
      profile_data: profileData,
      interview_answers: interviewAnswers,
      industry: startup.industry,
      stage: startup.stage
    }
  });
};
```

---

## Acceptance Criteria

- [ ] `calculate_score` returns 200 with valid score (0-100)
- [ ] `generate_summary` returns 200 with AI-generated text
- [ ] Step 4 Review & Score page displays investor score
- [ ] Step 4 displays AI summary with recommendations
- [ ] No console errors on Step 4 load
- [ ] curl tests pass for both actions

---

## Verification

After fix, test with browser automation:

1. Complete Steps 1-3 of onboarding
2. Click "Continue to Review"
3. Verify Step 4 loads with:
   - Investor readiness score (0-100)
   - AI-generated summary
   - Improvement recommendations
4. Check Network tab: both POST requests return 200
5. Check Console: no FunctionsHttpError

---

## Related Files

| File | Purpose |
|------|---------|
| `supabase/functions/onboarding-agent/index.ts` | Edge function to fix |
| `src/components/onboarding/step4/Step4Review.tsx` | Frontend component |
| `tasks/testing/02-testing-strategy.md` | QA report with details |

---

## References

- Error source: QA Testing (2026-01-30)
- Supabase project: `yvyesmiczbjqwbqtlidy`
- Related task: `tasks/prompts/17-playbook-screen-integration.md`
