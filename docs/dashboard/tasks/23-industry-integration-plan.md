# Industry Integration System — Implementation Plan

> **Version:** 1.0 | **Date:** January 28, 2026
> **Priority:** P0 | **Status:** Planning
> **Dependencies:** industry-expert-agent deployed ✅

---

## Executive Summary

This document tracks the systematic integration of Industry Packs across the platform. The goal is zero-duplication data flow where industry context enriches all AI-powered features.

---

## Gap Analysis (Verified January 28, 2026)

### 🔴 Critical Blockers

| Issue | Impact | Fix Required |
|-------|--------|--------------|
| Onboarding Wizard doesn't use `useIndustryExpert` hook | Industry coaching not available during onboarding | Wire hook to Step 1 & Step 3 |
| Pitch Deck Wizard uses `pitch-deck-agent`, not `industry-expert-agent` | Industry context missing from pitch generation | Add industry-expert calls for coaching |
| Only **8 questions** in `industry_questions` table | Smart Interview lacks content | Seed 40+ universal questions |
| No `IndustrySelectionScreen` component | Users can't select industry with AI context | Build component |
| `useIndustryPacks()` hook exists but not imported anywhere | Frontend can't access industry packs | Wire to onboarding/pitch deck |

### 🟡 High-Risk Issues

| Issue | Impact | Fix Required |
|-------|--------|--------------|
| Pitch Deck Step 1 uses hardcoded `SUB_CATEGORIES` | Doesn't use dynamic `startup_types` from industry_packs | Read from database |
| Step 3 Smart Interview generates fallback questions | Loses industry-specific coaching value | Fallback to industry_questions table |
| Industry research uses `pitch-deck-agent` not `industry-expert-agent` | Inconsistent AI contexts | Consolidate to single agent |

### 🟢 Working Components

| Component | Status | Evidence |
|-----------|--------|----------|
| `industry_packs` table | ✅ 9 active packs | Query verified |
| `industry_questions` table | ✅ Schema correct | `pack_id` FK working |
| `industry-expert-agent` edge function | ✅ Deployed | 7 actions ready |
| `useIndustryExpert` hook | ✅ Created | All mutations/queries implemented |
| `get_industry_ai_context()` RPC | ✅ Working | Returns full pack data |
| `get_industry_questions()` RPC | ✅ Working | Filters by context/stage |

---

## Data Flow Architecture

```
┌─────────────────────┐
│  Onboarding Wizard  │
│  ┌───────────────┐  │
│  │ Step 1: Pick  │──┼──▶ IndustrySelectionScreen ──▶ industry_packs
│  │   Industry    │  │                               (startup_types, benchmarks)
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │ Step 3: Smart │──┼──▶ industry_questions (40+ universal)
│  │  Interviewer  │  │    + industry-expert-agent.coach_answer()
│  └───────────────┘  │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   startups table    │ ← industry stored here
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│  Pitch Deck Wizard  │
│  ┌───────────────┐  │
│  │ Step 1: Loads │──┼──▶ Pre-fills from startup.industry
│  │   Industry    │  │    + industry-expert-agent.get_industry_context()
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │ Step 4: Gen   │──┼──▶ industry-expert-agent.pitch_feedback()
│  │   Pitch Deck  │  │
│  └───────────────┘  │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│   Lean Canvas       │──▶ industry-expert-agent.validate_canvas()
└─────────────────────┘
```

---

## Implementation Plan (Sequential Order)

### Phase 1: Data Foundation (Day 1)

| Task | File | Status |
|------|------|--------|
| 1.1 Seed 40 universal questions | Migration | 🔴 TODO |
| 1.2 Add 4 industries missing questions | Migration | 🔴 TODO |
| 1.3 Verify RPC functions work | Test | 🔴 TODO |

**Questions Categories to Seed:**
- `problem_validation` (8 questions)
- `solution_design` (6 questions)
- `business_model` (6 questions)
- `competitive_strategy` (5 questions)
- `customer_discovery` (5 questions)
- `mvp_planning` (4 questions)
- `go_to_market` (4 questions)
- `execution_planning` (2 questions)

### Phase 2: Frontend Components (Days 2-3)

| Task | File | Priority |
|------|------|----------|
| 2.1 Create `IndustrySelectionScreen` | `src/components/onboarding/IndustrySelectionScreen.tsx` | P0 |
| 2.2 Create `IndustryCard` | `src/components/onboarding/IndustryCard.tsx` | P0 |
| 2.3 Create `StartupTypeSelector` | `src/components/onboarding/StartupTypeSelector.tsx` | P0 |
| 2.4 Create `useIndustryPacks` query hook | `src/hooks/useIndustryPacks.ts` | P0 |

### Phase 3: Onboarding Integration (Days 3-4)

| Task | File | Priority |
|------|------|----------|
| 3.1 Add industry selection to Step 1 | `src/pages/OnboardingWizard.tsx` | P0 |
| 3.2 Wire `useIndustryExpert` to Step 3 | `src/pages/onboarding/useStep3Handlers.ts` | P0 |
| 3.3 Add coaching responses to interview | `src/components/onboarding/step3/Step3Interview.tsx` | P1 |
| 3.4 Store `industry` in wizard_sessions | `useWizardSession.ts` | P0 |

### Phase 4: Pitch Deck Integration (Days 4-5)

| Task | File | Priority |
|------|------|----------|
| 4.1 Load industry from startup in Step 1 | `src/hooks/usePitchDeckWizard.ts` | P0 |
| 4.2 Replace hardcoded SUB_CATEGORIES | `src/components/pitchdeck/wizard/WizardStep1.tsx` | P1 |
| 4.3 Add industry feedback to Step 4 | `src/components/pitchdeck/wizard/WizardStep4.tsx` | P1 |
| 4.4 Wire `usePitchFeedback()` mutation | `src/hooks/useStep1AI.ts` | P1 |

### Phase 5: Agent Consolidation (Day 5)

| Task | File | Priority |
|------|------|----------|
| 5.1 Route pitch-deck-agent research to industry-expert | `supabase/functions/pitch-deck-agent/actions/step1.ts` | P1 |
| 5.2 Add industry context to onboarding-agent | `supabase/functions/onboarding-agent/index.ts` | P1 |
| 5.3 Add industry context to lean-canvas-agent | `supabase/functions/lean-canvas-agent/index.ts` | P1 |

### Phase 6: Testing & Verification (Day 6)

| Task | Method | Status |
|------|--------|--------|
| 6.1 Test industry selection UI | Browser automation | 🔴 TODO |
| 6.2 Test coaching responses | Edge function curl | 🔴 TODO |
| 6.3 Verify data flow to pitch deck | End-to-end test | 🔴 TODO |
| 6.4 Verify Lean Canvas validation | Edge function curl | 🔴 TODO |

---

## Success Criteria

| Metric | Target | Current |
|--------|--------|---------|
| Universal questions seeded | 40 | 0 |
| Industry questions seeded | 5 per industry | 0-4 |
| Frontend components | 4 new | 0 |
| Onboarding uses industry | ✅ | ❌ |
| Pitch Deck uses industry | ✅ | ❌ |
| Lean Canvas uses industry | ✅ | ❌ |

---

## Files to Create

```
src/
├── components/
│   └── onboarding/
│       ├── IndustrySelectionScreen.tsx   # NEW
│       ├── IndustryCard.tsx              # NEW
│       └── StartupTypeSelector.tsx       # NEW
├── hooks/
│   └── useIndustryPacks.ts               # NEW (simplified query hook)
```

## Files to Modify

```
src/
├── pages/
│   ├── OnboardingWizard.tsx              # Add industry selection
│   └── onboarding/
│       └── useStep3Handlers.ts           # Wire coaching
├── components/
│   └── pitchdeck/
│       └── wizard/
│           └── WizardStep1.tsx           # Use dynamic startup_types
├── hooks/
│   ├── usePitchDeckWizard.ts             # Load industry from startup
│   └── useStep1AI.ts                     # Add pitch feedback call
supabase/
├── functions/
│   ├── pitch-deck-agent/
│   │   └── actions/step1.ts              # Route to industry-expert
│   └── onboarding-agent/
│       └── index.ts                      # Add industry context
```

---

## Next Immediate Steps

1. **Create migration to seed 40 universal questions**
2. **Build `IndustrySelectionScreen` component**
3. **Wire `useIndustryExpert` hook to onboarding Step 3**
4. **Test end-to-end flow**

---

**Last Updated:** January 28, 2026
**Author:** AI System
**Status:** Ready for Implementation
