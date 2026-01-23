# Prompt 03 — Step 2: Traction & Funding Form

**Purpose:** Implement Step 2 form for traction metrics and funding information  
**Status:** 🟡 Backend Ready | Frontend Pending  
**Priority:** P0 — Critical Blocker  
**Depends on:** Prompt 02 (Step 1)

---

## Schema Verification ✅

**`startups` Table - Step 2 Fields:**
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `traction_data` | jsonb | YES | Contains MRR, users, growth |
| `is_raising` | boolean | YES | Currently raising toggle |
| `raise_amount` | numeric(12,2) | YES | Target raise amount |
| `stage` | text | YES | Startup stage |

**`wizard_sessions` Table - Extraction Fields:**
| Column | Type | Notes |
|--------|------|-------|
| `extracted_traction` | jsonb | Traction metrics from AI/form |
| `extracted_funding` | jsonb | Funding details from form |

---

## Files to Create

**New Files:**
- `src/components/onboarding/Step2Traction.tsx` — Step 2 form component

**Files to Modify:**
- `src/pages/OnboardingWizard.tsx` — Render Step2Traction in main panel
- `src/hooks/useWizardSession.ts` — Handle Step 2 data persistence

---

## Field Mapping Contract

**IMPORTANT:** Traction metrics are stored in `traction_data` JSONB column, NOT as top-level columns.

| Form Field | Session Key | Startups Column | DB Type | Notes |
|------------|-------------|-----------------|---------|-------|
| MRR | `extracted_traction.current_mrr` | `traction_data->mrr` | jsonb | Inside traction_data |
| Users | `extracted_traction.users` | `traction_data->users` | jsonb | Inside traction_data |
| Growth Rate | `extracted_traction.growth_rate` | `traction_data->growth_rate_monthly` | jsonb | Inside traction_data |
| Is Raising | `extracted_funding.is_raising` | `is_raising` | boolean | Top-level column |
| Target Raise | `extracted_funding.target_amount` | `raise_amount` | numeric | Top-level column |
| Stage | `form_data.stage` | `stage` | text | Top-level column |

**CRITICAL NOTES:**
1. There is NO `startups.mrr` column — traction goes in `traction_data` JSONB
2. There is NO `startups.growth_rate` column — use `traction_data->growth_rate_monthly`
3. There is NO `startups.funding_stage` column — use `stage`
4. `traction_data` structure: `{mrr, arr, nrr, users, customers, churn_rate, growth_rate_monthly}`

---

## Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    STEP 2: TRACTION & FUNDING                           │
├──────────────────────────────────────────────┬─────────────────────────┤
│                                              │                         │
│  MAIN PANEL                                  │    RIGHT PANEL          │
│                                              │    (Step Guidance)      │
│  ┌──────────────────────────────────────┐   │                         │
│  │ Traction Metrics                      │   │  ┌───────────────────┐ │
│  │                                       │   │  │ Step Guidance     │ │
│  │ Monthly Recurring Revenue (MRR)       │   │  │                   │ │
│  │ [$________] USD                       │   │  │ Enter your        │ │
│  │                                       │   │  │ traction metrics  │ │
│  │ Number of Users/Customers             │   │  │                   │ │
│  │ [________]                            │   │  │ Example:          │ │
│  │                                       │   │  │ $5,000 MRR        │ │
│  │ Growth Rate                           │   │  │ 150 users         │ │
│  │ [____]%                               │   │  │ 20% growth       │ │
│  │                                       │   │  │                   │ │
│  │ ────────────────────────────────────  │   │  │ Tips:            │ │
│  │                                       │   │  │ • Be honest      │ │
│  │ Funding Information                   │   │  │ • Use real data  │ │
│  │                                       │   │  │                   │ │
│  │ Currently Raising?                    │   │  │ Next Step:       │ │
│  │ [○ No]  [● Yes]                       │   │  │ Review & Generate│ │
│  │                                       │   │  └───────────────────┘ │
│  │ Target Raise Amount (if raising)      │   │                         │
│  │ [$________] [USD ▼]                  │   │                         │
│  │                                       │   │                         │
│  │ Funding Stage                         │   │                         │
│  │ [Seed ▼]                              │   │                         │
│  │                                       │   │                         │
│  │ [← Back]            [Continue →]      │   │                         │
│  └──────────────────────────────────────┘   │                         │
└──────────────────────────────────────────────┴─────────────────────────┘
```

---

## Form Data Structure

```typescript
interface Step2FormData {
  // Traction
  mrr?: number;
  users?: number;
  growth_rate?: number;  // 0-100%
  
  // Funding
  is_raising: boolean;
  target_amount?: number;
  currency: 'USD' | 'EUR' | 'GBP';
  stage: 'idea' | 'pre_seed' | 'seed' | 'series_a' | 'series_b';
}
```

---

## Stage Options (Verified)

```typescript
const STAGE_OPTIONS = [
  { value: 'idea', label: 'Idea Stage' },
  { value: 'pre_seed', label: 'Pre-Seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series_a', label: 'Series A' },
  { value: 'series_b', label: 'Series B' },
];
```

---

## No AI in Step 2

- Step 2 is manual data entry only
- No AI agents active during Step 2
- Right panel shows step guidance and tips only

---

## Success Criteria

- ✅ Step 2 form renders with all fields
- ✅ Traction metrics fields work correctly
- ✅ "Currently raising" toggle shows/hides funding fields
- ✅ Form validation works (positive numbers)
- ✅ Currency and percentage formatting works
- ✅ Auto-save works (debounced 500ms)
- ✅ Back navigation preserves data
- ✅ Continue navigation validates and saves
- ✅ Form data persists on refresh
