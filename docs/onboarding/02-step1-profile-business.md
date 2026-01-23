# Prompt 02 — Step 1: Profile & Business Form

**Purpose:** Implement Step 1 form with AI extraction integration  
**Status:** 🟡 Backend Ready | Frontend Pending  
**Priority:** P0 — Critical Blocker  
**Depends on:** Prompt 01 (Wizard Layout)

---

## Schema Verification ✅

**`startups` Table - Step 1 Fields:**
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `name` | text | NO | Required |
| `description` | text | YES | 50-200 words |
| `tagline` | text | YES | Short pitch |
| `industry` | text | YES | Required in form |
| `website_url` | text | YES | For AI extraction |
| `linkedin_url` | text | YES | Social link |
| `business_model` | text[] | YES | **ARRAY** |
| `target_customers` | text[] | YES | **ARRAY** |
| `key_features` | text[] | YES | **ARRAY** |

---

## Edge Function Actions ✅

| Action | Model | Input | Output |
|--------|-------|-------|--------|
| `enrich_url` | `gemini-3-flash-preview` | `{ url: string }` | Extracted profile JSON |
| `enrich_context` | `gemini-3-flash-preview` | `{ description: string }` | Extracted context JSON |

---

## Files to Create

**New Files:**
- `src/components/onboarding/Step1Profile.tsx` — Step 1 form component
- `src/components/onboarding/ExtractionDisplay.tsx` — AI extraction results

**Files to Modify:**
- `src/pages/OnboardingWizard.tsx` — Render Step1Profile in main panel
- `src/hooks/useOnboardingAgent.ts` — Add extraction methods

---

## Field Mapping Contract

| Form Field | `form_data` Key | Startups Column | DB Type | Notes |
|------------|-----------------|-----------------|---------|-------|
| Company Name | `name` | `name` | `text` | Required |
| Website URL | `website_url` | `website_url` | `text` | For AI extraction |
| Description | `description` | `description` | `text` | Required |
| Industry | `industry` | `industry` | `text` | Required |
| Key Features | `key_features` | `key_features` | `text[]` | Array of strings |
| Tagline | `tagline` | `tagline` | `text` | From extraction |
| Business Model | `business_model` | `business_model` | `text[]` | **ARRAY** |
| Target Customers | `target_customers` | `target_customers` | `text[]` | **ARRAY** |

**CRITICAL NOTES:**
1. `business_model` and `target_customers` are **arrays** — always store as `['value']` not `'value'`
2. There is NO `social_links` column — use `linkedin_url`, `twitter_url` directly
3. There is NO `website` column — use `website_url`
4. There is NO `tech_stack` column — use `key_features`

---

## Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    STEP 1: PROFILE & BUSINESS                           │
├──────────────────────────────────────────────┬─────────────────────────┤
│                                              │                         │
│  MAIN PANEL                                  │    RIGHT PANEL          │
│                                              │    (AI Extraction)      │
│  ┌──────────────────────────────────────┐   │                         │
│  │ Company Name *                        │   │  ┌───────────────────┐ │
│  │ [________________________________]    │   │  │  AI Extraction    │ │
│  │                                      │   │  │                   │ │
│  │ Website URL                          │   │  │  🔄 Analyzing...  │ │
│  │ [https://example.com] [Extract AI]  │   │  │                   │ │
│  │                                      │   │  │  (Loading state)  │ │
│  │ Company Description *                │   │  └───────────────────┘ │
│  │ [________________________________]   │   │                         │
│  │ (50-200 words)                       │   │  OR (After extraction): │
│  │                                      │   │                         │
│  │ Industry *                           │   │  ┌───────────────────┐ │
│  │ [SaaS ▼]                             │   │  │ Extracted Data    │ │
│  │                                      │   │  │                   │ │
│  │ Key Features/Products                │   │  │ Name: "Example"   │ │
│  │ [Feature 1] [Feature 2] [+ Add]       │   │  │ ✓ Apply           │ │
│  │                                      │   │  │                   │ │
│  │                                      │   │  │ Industry: "SaaS"  │ │
│  │ [Back]              [Continue →]     │   │  │ ✓ Apply           │ │
│  └──────────────────────────────────────┘   │  │                   │ │
│                                              │  │ [Apply All]       │ │
│                                              │  └───────────────────┘ │
└──────────────────────────────────────────────┴─────────────────────────┘
```

---

## AI Extraction Workflow

```typescript
// Step 1: User clicks "Extract with AI"
const handleExtract = async () => {
  setExtracting(true);
  
  const result = await extractUrl(formData.website_url);
  
  if (result.success) {
    setExtraction(result.data);
    // Display in right panel for user approval
  }
  
  setExtracting(false);
};

// Step 2: User approves suggestions
const handleApply = (field: string, value: any) => {
  updateFormData({ [field]: value });
};

const handleApplyAll = () => {
  Object.entries(extraction).forEach(([key, value]) => {
    if (value && fieldMapping[key]) {
      updateFormData({ [fieldMapping[key]]: value });
    }
  });
};
```

---

## Extraction Response Structure

```typescript
interface ExtractionResult {
  company_name?: string;
  description?: string;
  tagline?: string;
  industry?: string;
  business_model?: string[];
  target_customers?: string[];
  key_features?: string[];
  stage?: string;
  confidence: {
    company_name?: number;
    description?: number;
    industry?: number;
  };
}
```

---

## Success Criteria

- ✅ Step 1 form renders with all fields
- ✅ URL extraction button triggers AI extraction
- ✅ Loading state shows during extraction (<5 seconds)
- ✅ Extracted suggestions display in right panel
- ✅ User can approve suggestions (all or individual)
- ✅ Approved data pre-fills form fields
- ✅ Form validation works (required fields)
- ✅ Auto-save works (debounced 500ms)
- ✅ Form data persists on navigation
- ✅ Manual entry always available
