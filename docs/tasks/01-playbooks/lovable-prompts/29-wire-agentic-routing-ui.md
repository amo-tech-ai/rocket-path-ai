---
task_number: "29"
title: "Wire Agentic Routing UI (Prompt Packs)"
category: "Integration Fix"
subcategory: "AI Features"
phase: 2
priority: "P1"
status: "Open"
percent_complete: 0
owner: "Full Stack Developer"
source: "tasks/testing/07-lovable-audit.md"
depends_on: ["22", "27", "28"]
---

# Prompt 29: Wire Agentic Routing UI (Prompt Packs)

> **Forensic Finding:** Task 22 code exists (`usePromptPack`, `PackExecutionDrawer`) but is **not integrated** into ANY screen. The entire agentic pack execution system is orphaned.

---

## 📋 Summary Table

| Item | Value |
|:---|:---|
| **Issue** | `usePromptPack` hook and `PackExecutionDrawer` exist but are NOT used anywhere |
| **Backend Status** | `prompt-pack` edge function works (search, run_pack, apply) |
| **Tables** | `prompt_packs`, `prompt_pack_steps`, `feature_pack_routing` — all populated |
| **Impact** | Users cannot run multi-step AI workflows like "Deep Validation" or "GTM Strategy" |
| **Fix Type** | Add entry point(s) to invoke pack execution |

---

## 🎯 User Stories & Real-World Journeys

### Story 1: Jason — The Validator Power User

**Persona:** Jason, 32, accelerator mentor reviewing a founder's idea.

**Journey (Current - Feature Missing):**
1. Jason opens the Validator page for a fintech startup
2. Sees AI validation results (single-pass analysis)
3. **Expectation:** "Run Deep Validation" button for comprehensive 5-step analysis
4. **Reality:** Button doesn't exist. Can only see shallow validation.

**Journey (Fixed):**
1. Jason opens Validator page
2. Sees "Run Deep Validation Pack" button
3. Clicks it → `PackExecutionDrawer` slides open
4. Watches 5 steps execute: Market Analysis → Competitor Scan → Regulatory Check → Team Assessment → Investment Thesis
5. Each step shows progress, context, and partial results
6. Final results are **applied** to startup profile
7. **Reaction:** "This is like having 5 analysts work in parallel. Incredible."

---

### Story 2: Aisha — The Onboarding Optimizer

**Persona:** Aisha, 29, product manager at StartupAI.

**Journey (Current - Feature Missing):**
1. Aisha wants to add a "Smart Onboarding Pack" that runs 3 AI steps during onboarding
2. Backend has the pack configured in `prompt_packs` table
3. **Reality:** No UI to trigger it — pack sits unused in database

**Journey (Fixed):**
1. Aisha configures "onboarding-enrichment" pack in database
2. Adds "Run AI Pack" button to Step 4 Review page
3. Users can optionally run deep analysis before completing onboarding
4. Pack drawer shows: Profile Enrichment → Competitor Discovery → Market Sizing
5. **Result:** 30% richer startup profiles, better downstream AI recommendations

---

### Story 3: Tom — The Pitch Deck Creator

**Persona:** Tom, 44, preparing investor deck for Series A.

**Journey (Current - Feature Missing):**
1. Tom opens Pitch Deck page
2. Sees basic AI-generated slides
3. **Expectation:** "Generate Investor-Ready Deck" button that runs a 4-step pack
4. **Reality:** Only single-shot generation, no iterative refinement

**Journey (Fixed):**
1. Tom opens Pitch Deck page
2. Clicks "Generate Investor-Ready Deck" button
3. `PackExecutionDrawer` shows:
   - Step 1: Industry-specific story arc
   - Step 2: Competitor positioning slides
   - Step 3: Financial projections
   - Step 4: Investor objection handling
4. Each step builds on previous context
5. Final deck is applied to his pitch deck document
6. **Reaction:** "This is like having a deck consultant. Worth the premium."

---

## ✅ Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| 1 | At least ONE screen has a "Run Pack" button | Visual inspection of Validator or Onboarding |
| 2 | Clicking button opens `PackExecutionDrawer` | DOM shows drawer component |
| 3 | Drawer shows pack name and step list | Visual: steps are listed with status |
| 4 | Steps execute sequentially with visible progress | Watch step statuses update |
| 5 | Final step triggers "Apply" action | Results are written to database |
| 6 | User can cancel mid-execution | Cancel button stops execution |

---

## 🛠 Implementation Steps

### Option A: Add to Onboarding Step 4 (Recommended First Target)

```typescript
// File: src/components/onboarding/step4/Step4Review.tsx

import { useState } from 'react';
import { usePromptPack } from '@/hooks/onboarding/usePromptPack';
import { PackExecutionDrawer } from '@/components/onboarding/PackExecutionDrawer';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export function Step4Review({ data, ... }: Props) {
  const [showPackDrawer, setShowPackDrawer] = useState(false);

  const {
    searchPack,
    runPack,
    applyPack,
    isSearching,
    isExecuting,
    currentPack,
    executionState,
  } = usePromptPack();

  const handleRunDeepAnalysis = async () => {
    // Search for the appropriate pack based on module + industry
    const pack = await searchPack({
      module: 'validator',
      industry: data.industry,
      stage: data.stage || 'idea',
    });

    if (pack) {
      setShowPackDrawer(true);
      await runPack({
        pack_id: pack.id,
        context: {
          startup_name: data.company_name,
          industry: data.industry,
          description: data.description,
        },
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* ... existing Step 4 content ... */}

        {/* Add Deep Analysis button */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-3">Optional: Deep Analysis</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Run a multi-step AI analysis pack for comprehensive insights.
          </p>
          <Button
            variant="outline"
            onClick={handleRunDeepAnalysis}
            disabled={isSearching || isExecuting}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isExecuting ? 'Running Analysis...' : 'Run Deep Analysis Pack'}
          </Button>
        </div>
      </div>

      {/* Pack Execution Drawer */}
      <PackExecutionDrawer
        open={showPackDrawer}
        onOpenChange={setShowPackDrawer}
        packName={currentPack?.name || 'Deep Analysis'}
        steps={currentPack?.steps || []}
        currentStepIndex={executionState?.currentStepIndex || 0}
        stepResults={executionState?.results || {}}
        isExecuting={isExecuting}
        onCancel={() => {
          // Handle cancellation
          setShowPackDrawer(false);
        }}
        onComplete={async (results) => {
          // Apply results to startup
          await applyPack({
            pack_id: currentPack?.id,
            results,
            target_table: 'startups',
            target_id: data.startup_id,
          });
          setShowPackDrawer(false);
        }}
      />
    </>
  );
}
```

### Option B: Add to Validator Page

```typescript
// File: src/pages/Validator.tsx

import { usePromptPack } from '@/hooks/onboarding/usePromptPack';
import { PackExecutionDrawer } from '@/components/onboarding/PackExecutionDrawer';

// Add "Run Deep Validation" button next to existing validation UI
<Button onClick={() => runValidationPack()}>
  <Target className="h-4 w-4 mr-2" />
  Run Deep Validation Pack
</Button>
```

### Option C: Create Dedicated "AI Packs" Page

```typescript
// File: src/pages/AIPacks.tsx

import { usePromptPack } from '@/hooks/onboarding/usePromptPack';
import { PackExecutionDrawer } from '@/components/onboarding/PackExecutionDrawer';

export default function AIPacks() {
  const { searchPack, runPack, isExecuting } = usePromptPack();
  const [availablePacks, setAvailablePacks] = useState([]);

  useEffect(() => {
    // Load available packs for current startup
    async function loadPacks() {
      const packs = await searchPack({ module: 'all' });
      setAvailablePacks(packs);
    }
    loadPacks();
  }, []);

  return (
    <DashboardLayout>
      <h1>AI Strategy Packs</h1>
      <div className="grid gap-4">
        {availablePacks.map(pack => (
          <PackCard
            key={pack.id}
            pack={pack}
            onRun={() => runPack({ pack_id: pack.id })}
            isRunning={isExecuting}
          />
        ))}
      </div>
    </DashboardLayout>
  );
}
```

---

## 📂 Files to Modify

| File | Change | Priority |
|------|--------|----------|
| `src/components/onboarding/step4/Step4Review.tsx` | Add pack button + drawer | HIGH |
| `src/pages/Validator.tsx` | Add deep validation pack | MEDIUM |
| `src/pages/AIPacks.tsx` | Create dedicated packs page | LOW |
| `src/App.tsx` | Add route for AIPacks (if Option C) | LOW |

---

## 🔬 Verification Commands

```bash
# 1. Check hook exports
grep -n "usePromptPack" src/hooks/onboarding/index.ts

# 2. Check drawer component exists
ls -la src/components/onboarding/PackExecutionDrawer.tsx

# 3. Check edge function has required actions
grep -n "run_pack\|apply" supabase/functions/prompt-pack/index.ts

# 4. Check feature_pack_routing has data
# Via Supabase MCP or SQL:
# SELECT * FROM feature_pack_routing LIMIT 5;

# 5. Manual test:
# - Navigate to Step 4 of onboarding
# - Click "Run Deep Analysis Pack"
# - Drawer should open with steps
# - Steps should execute and show progress
```

---

## 🗄 Data Dependencies

Ensure packs are seeded in the database:

```sql
-- Check prompt packs exist
SELECT slug, name, is_active FROM prompt_packs;

-- Check steps are linked
SELECT pp.slug, COUNT(pps.id) as step_count
FROM prompt_packs pp
LEFT JOIN prompt_pack_steps pps ON pps.pack_id = pp.id
GROUP BY pp.slug;

-- Check routing exists
SELECT module, industry_slug, default_pack_slug
FROM feature_pack_routing;
```

If missing, run seeds from:
- `supabase/prompt_packs_rows.sql`
- `supabase/prompt_pack_steps_rows.sql`
- `supabase/feature_pack_routing_rows.sql`

---

## 🚨 Common Pitfalls

1. **Pack not found** — Ensure `feature_pack_routing` has entry for module + industry
2. **Steps don't execute** — Check `prompt_pack_steps.is_active = true`
3. **Apply fails** — Verify target table has correct columns for field mapping
4. **Drawer closes unexpectedly** — Handle async state properly

---

## 📊 Success Metrics

| Metric | Before | After |
|--------|--------|-------|
| Pack executions per week | 0 | 50+ |
| User engagement with AI features | 20% | 60% |
| "AI feels powerful" feedback | 10% | 70% |

---

## 📝 References

- **Audit finding:** `tasks/testing/07-lovable-audit.md` (Section 2, Task 22)
- **Original task:** `tasks/prompts/22-agentic-routing-packs.md`
- **Hook source:** `src/hooks/onboarding/usePromptPack.ts`
- **Drawer source:** `src/components/onboarding/PackExecutionDrawer.tsx`
- **Edge function:** `supabase/functions/prompt-pack/index.ts`
