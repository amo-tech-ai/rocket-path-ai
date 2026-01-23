# Task 02: Step 1 — Context & Enrichment

**Status:** READY FOR IMPLEMENTATION
**Priority:** P0 - Critical
**Depends on:** Task 01 (Layout)
**Estimated:** 3-4 hours
**Backend Actions:** `create_session`, `update_session`, `enrich_context`, `enrich_url`, `enrich_founder`

---

## Overview

Build Step 1 where users provide startup context. AI extracts and enriches data in real-time.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Step 1: Context & Enrichment                                            │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Describe your startup *                        │  AI ASSISTANT          │
│  ┌────────────────────────────────────────────┐ │                        │
│  │ We're building an AI platform that helps   │ │  "Add your website     │
│  │ founders manage their startup journey...   │ │   URL and I'll         │
│  │                                            │ │   auto-fill fields!"   │
│  └────────────────────────────────────────────┘ │                        │
│  52/50 words ✓                                  │  ─────────────────     │
│                                                 │                        │
│  Website URL (recommended)                      │  ENRICHMENT STATUS     │
│  ┌─────────────────────────────┐ [🔍 Extract]  │                        │
│  │ https://acme.com            │              │  Description ████░░    │
│  └─────────────────────────────┘              │  Website ░░░░░░░░░░    │
│                                                 │  Team ░░░░░░░░░░░░    │
│  ─────────────────────────────────────────────  │                        │
│  AI DETECTED (click to edit)                    │  ─────────────────     │
│  ─────────────────────────────────────────────  │                        │
│                                                 │  WHY THIS MATTERS      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐       │                        │
│  │ Industry │ │ Model    │ │ Stage    │       │  "Good context =       │
│  │ SaaS   ✓ │ │ B2B    ✓ │ │Pre-seed✓ │       │   better AI insights   │
│  └──────────┘ └──────────┘ └──────────┘       │   and scoring."        │
│                                                 │                        │
│  FOUNDING TEAM (at least 1 required)            │                        │
│  ┌─────────────┐  ┌─────────────┐              │                        │
│  │ + Add       │  │ Jane Doe    │              │                        │
│  │   Founder   │  │ CEO ✓       │              │                        │
│  └─────────────┘  └─────────────┘              │                        │
│                                                 │                        │
│                      [Next: AI Analysis →]      │                        │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Files to Create

```
src/components/onboarding/step1/
├── Step1Context.tsx           # Main step component
├── DescriptionInput.tsx       # Textarea with word count + auto-enrich
├── URLInput.tsx               # URL field + extract button
├── AIDetectedFields.tsx       # Industry, Model, Stage editable chips
├── FounderCard.tsx            # Founder entry/display card
└── FounderModal.tsx           # Add/edit founder modal
```

---

## Component Specifications

### 1. Step1Context.tsx

**Purpose:** Main container for Step 1

```tsx
interface Step1ContextProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onEnrich: (type: 'context' | 'url' | 'founder', payload: any) => Promise<void>;
  isEnriching: boolean;
  enrichmentStatus: EnrichmentStatus;
}

interface EnrichmentStatus {
  description: 'idle' | 'enriching' | 'done' | 'error';
  url: 'idle' | 'enriching' | 'done' | 'error';
  founders: 'idle' | 'enriching' | 'done' | 'error';
}
```

**Layout:**
```tsx
<div className="space-y-8">
  <DescriptionInput />
  <URLInput />
  <Separator />
  <AIDetectedFields />
  <Separator />
  <FounderSection />
</div>
```

---

### 2. DescriptionInput.tsx

**Purpose:** Textarea with word count, triggers `enrich_context` on blur

```tsx
interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onEnrich: () => void;
  isEnriching: boolean;
  minWords: number; // 50
}
```

**Features:**
- Word count display (e.g., "52/50 words")
- Green checkmark when >= 50 words
- Debounced auto-enrich on blur (if >= 50 words)
- Manual "Analyze" button for re-enrichment
- Placeholder: "Describe what your startup does, the problem you solve, and who your customers are..."

**Validation:**
```tsx
const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
const isValid = wordCount >= 50;
```

---

### 3. URLInput.tsx

**Purpose:** Website URL input with AI extraction button

```tsx
interface URLInputProps {
  value: string;
  onChange: (value: string) => void;
  onExtract: () => void;
  isExtracting: boolean;
  extractionResult?: UrlExtractionResult;
}
```

**States:**
| State | UI |
|-------|-----|
| Empty | Input with placeholder |
| Has URL | Input + "Extract with AI" button |
| Extracting | Input disabled + spinner on button |
| Done | Input + "Re-extract" link + success indicator |
| Error | Input + error message + retry button |

**URL Validation:**
```tsx
const isValidUrl = (url: string) => {
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
};
```

---

### 4. AIDetectedFields.tsx

**Purpose:** Display and edit AI-detected Industry, Business Model, Stage

```tsx
interface AIDetectedFieldsProps {
  industry: string;
  businessModel: string[];
  stage: string;
  onUpdate: (field: string, value: string | string[]) => void;
  isFromAI: boolean; // Show "AI Detected" badge
}
```

**Industry Options:**
```tsx
const INDUSTRIES = [
  'SaaS', 'Marketplace', 'E-commerce', 'Fintech',
  'Healthcare', 'EdTech', 'AI/ML', 'Consumer', 'Other'
];
```

**Business Model Options:**
```tsx
const BUSINESS_MODELS = [
  'B2B', 'B2C', 'B2B2C', 'Marketplace', 'Platform', 'Services'
];
```

**Stage Options:**
```tsx
const STAGES = [
  'Idea', 'Pre-seed', 'Seed', 'Series A', 'Series B+'
];
```

**UI Pattern:**
- Show as selectable chips/badges
- Highlight AI-suggested values
- User can click to change
- Multiple selection for business_model (array)

---

### 5. FounderCard.tsx

**Purpose:** Display/add founder with optional LinkedIn enrichment

```tsx
interface FounderCardProps {
  founder?: Founder;
  onAdd: () => void;
  onEdit: (founder: Founder) => void;
  onRemove: (id: string) => void;
  onEnrichLinkedIn: (linkedinUrl: string) => void;
  isEnriching: boolean;
}

interface Founder {
  id: string;
  name: string;
  role: string;
  linkedin_url?: string;
  enriched?: boolean; // Has LinkedIn data
}
```

**Founder Roles:**
```tsx
const FOUNDER_ROLES = [
  'CEO', 'CTO', 'COO', 'CFO', 'CPO',
  'Co-founder', 'Technical Co-founder', 'Other'
];
```

**States:**
| State | UI |
|-------|-----|
| Add Card | Dashed border + "Add Founder" + icon |
| Founder Card | Name, Role, LinkedIn indicator, Edit/Remove |
| With LinkedIn | Green badge "Verified" |
| Enriching | Spinner on card |

---

### 6. FounderModal.tsx

**Purpose:** Modal for adding/editing founder

```tsx
interface FounderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (founder: Founder) => void;
  founder?: Founder; // Null = add mode, Founder = edit mode
}
```

**Fields:**
- Name (required)
- Role (dropdown, required)
- LinkedIn URL (optional, triggers enrichment)

---

## Data Flow

### On Page Load
```
1. Check for existing session (useWizardSession)
   ├── If exists: Load form_data into state
   └── If not: Call create_session action
2. Initialize enrichment status to 'idle'
3. Render form with loaded/empty data
```

### On Description Change (Debounced)
```
1. User types description
2. Debounce 500ms
3. Update local state
4. Auto-save to session (update_session)
5. If wordCount >= 50 AND blur:
   ├── Set enrichmentStatus.description = 'enriching'
   ├── Call enrich_context action
   ├── Receive { industry, business_model, stage, keywords, competitors }
   ├── Update AI-detected fields
   └── Set enrichmentStatus.description = 'done'
```

### On URL Extract
```
1. User enters URL, clicks "Extract"
2. Validate URL format
3. Set enrichmentStatus.url = 'enriching'
4. Call enrich_url action
5. Receive { name, description, industry, features, target_customers, competitors }
6. Show extraction results in right panel
7. User clicks "Apply" to populate fields
8. Set enrichmentStatus.url = 'done'
```

### On Founder LinkedIn Enrich
```
1. User adds founder with LinkedIn URL
2. Call enrich_founder action
3. Receive { name, title, experience_years, previous_companies, skills }
4. Auto-fill founder details
5. Mark founder as "enriched"
```

---

## Supabase Integration

### Edge Function Calls

```typescript
// useOnboardingAgent.ts

export function useOnboardingAgent() {
  const supabase = useSupabaseClient();

  const enrichContext = async (sessionId: string, description: string) => {
    const { data, error } = await supabase.functions.invoke('onboarding-agent', {
      body: {
        action: 'enrich_context',
        session_id: sessionId,
        description,
      },
    });
    if (error) throw error;
    return data as EnrichContextResult;
  };

  const enrichUrl = async (sessionId: string, url: string) => {
    const { data, error } = await supabase.functions.invoke('onboarding-agent', {
      body: {
        action: 'enrich_url',
        session_id: sessionId,
        url,
      },
    });
    if (error) throw error;
    return data as EnrichUrlResult;
  };

  const enrichFounder = async (sessionId: string, linkedinUrl: string, name?: string) => {
    const { data, error } = await supabase.functions.invoke('onboarding-agent', {
      body: {
        action: 'enrich_founder',
        session_id: sessionId,
        linkedin_url: linkedinUrl,
        name,
      },
    });
    if (error) throw error;
    return data as EnrichFounderResult;
  };

  return { enrichContext, enrichUrl, enrichFounder };
}
```

### Session Update

```typescript
// On any field change (debounced)
const saveProgress = async (formData: Partial<WizardData>) => {
  await supabase.functions.invoke('onboarding-agent', {
    body: {
      action: 'update_session',
      session_id: sessionId,
      form_data: {
        ...existingFormData,
        ...formData,
      },
    },
  });
};
```

---

## form_data Structure (Step 1)

```typescript
// wizard_sessions.form_data after Step 1
{
  // User input
  name: "ACME Corp",
  description: "We're building an AI platform...",
  website_url: "https://acme.com",
  linkedin_url: "https://linkedin.com/company/acme",

  // AI-detected (editable)
  industry: "SaaS",
  business_model: ["B2B"], // Array!
  stage: "pre_seed",

  // Enrichment results
  tagline: "AI-native startup management", // From URL
  key_features: ["Dashboard", "CRM", "Pitch Deck"], // From URL
  target_customers: ["Pre-seed founders", "Seed-stage startups"], // From URL
  competitors: ["Notion", "Monday.com"], // From context

  // Founders
  founders: [
    {
      id: "f1",
      name: "Jane Doe",
      role: "CEO",
      linkedin_url: "https://linkedin.com/in/janedoe",
      enriched: true
    }
  ]
}
```

---

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Description | >= 50 words | "Please add at least 50 words" |
| Industry | Required | "Please select an industry" |
| Business Model | At least 1 | "Please select a business model" |
| Stage | Required | "Please select your stage" |
| Founders | At least 1 | "Please add at least one founder" |
| Founder Name | Required | "Name is required" |
| Founder Role | Required | "Role is required" |
| URL | Valid format | "Please enter a valid URL" |

### Can Proceed to Step 2

```typescript
const canProceed = () => {
  const wordCount = data.description.trim().split(/\s+/).filter(Boolean).length;
  return (
    wordCount >= 50 &&
    data.industry !== '' &&
    data.business_model.length > 0 &&
    data.stage !== '' &&
    data.founders.length >= 1 &&
    data.founders.every(f => f.name && f.role)
  );
};
```

---

## Right Panel Content (Step 1)

### WizardAIPanel - Step 1 State

```tsx
// Before any enrichment
<div>
  <h3>AI Assistant</h3>
  <p>"Add your website URL and I'll auto-fill most fields!"</p>

  <Separator />

  <h4>Tips</h4>
  <ul>
    <li>Be specific about your target customers</li>
    <li>Mention your unique value proposition</li>
    <li>Include any traction or metrics</li>
  </ul>
</div>

// During/after enrichment
<div>
  <h3>Enrichment Status</h3>

  <EnrichmentBar label="Description" status={status.description} />
  <EnrichmentBar label="Website" status={status.url} />
  <EnrichmentBar label="Team" status={status.founders} />

  <Separator />

  {urlExtractionResult && (
    <div>
      <h4>From Your Website</h4>
      <p>Name: {urlExtractionResult.name}</p>
      <p>Features: {urlExtractionResult.features.join(', ')}</p>
      <Button onClick={applyUrlData}>Apply All</Button>
    </div>
  )}
</div>
```

---

## Loading States

| Action | Button State | Field State |
|--------|--------------|-------------|
| `enrich_context` | "Analyzing..." spinner | Description field enabled |
| `enrich_url` | "Extracting..." spinner | URL field disabled |
| `enrich_founder` | Card shows spinner | Modal stays open |
| `update_session` | None (silent) | None |

---

## Error Handling

| Error | User Action |
|-------|-------------|
| `enrich_context` fails | Hide AI fields, allow manual entry |
| `enrich_url` fails | Show error toast, allow retry |
| `enrich_founder` fails | Show error on card, allow manual entry |
| LinkedIn login required | Show message "LinkedIn data unavailable" |
| Session save fails | Show error toast, retry button |

---

## Accessibility

- All inputs have labels
- Error messages announced by screen readers
- Focus management on modal open/close
- Keyboard navigation for chips
- Loading states announced

---

## Success Criteria

- [ ] Description textarea with word count works
- [ ] Word count shows green check at 50+ words
- [ ] URL extraction button triggers AI
- [ ] Extraction results show in right panel
- [ ] "Apply All" populates form fields
- [ ] Industry/Model/Stage chips are editable
- [ ] Add founder modal works
- [ ] Edit/remove founder works
- [ ] LinkedIn enrichment for founders works
- [ ] Auto-save to session (debounced)
- [ ] Validation prevents proceeding without required fields
- [ ] Next button enabled only when valid
- [ ] Loading states show during AI actions
- [ ] Errors handled gracefully

---

## Next Task

`03-ui--step2-analysis.md` - Step 2 AI Analysis (read-only display)

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2026-01-23 | Initial task specification |
