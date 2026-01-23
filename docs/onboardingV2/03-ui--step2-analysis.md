# Task 03: Step 2 — AI Analysis & Refinement

**Status:** READY FOR IMPLEMENTATION
**Priority:** P0 - Critical
**Depends on:** Task 02 (Step 1)
**Estimated:** 2-3 hours
**Backend Actions:** `calculate_readiness`, `enrich_context`, `update_session`

---

## Overview

Step 2 shows AI analysis of user's startup with **editable fields** and **AI enhancement** options. Users can refine their profile before proceeding to the interview.

> **Design Decision:** Step 2 is NOT read-only. Users can edit any field and trigger AI improvements with ✨ buttons.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Step 2: AI Analysis & Refinement                                        │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────┐  │  READINESS SCORE        │
│  │  ACME CORP                              │  │                          │
│  │  AI-native startup management platform  │  │  ┌────────────────┐     │
│  │                                         │  │  │      72        │     │
│  │  [SaaS] [B2B] [Pre-seed] [AI/ML]       │  │  │     /100       │     │
│  │                                         │  │  │  ████████░░░░  │     │
│  │  Description                      [✨]  │  │  │    GOOD        │     │
│  │  ┌─────────────────────────────────┐   │  │  └────────────────┘     │
│  │  │ We're building an AI platform   │   │  │                          │
│  │  │ that helps founders...          │   │  │  vs. SaaS Pre-seed       │
│  │  └─────────────────────────────────┘   │  │  Top 30% of profiles     │
│  └─────────────────────────────────────────┘  │                          │
│                                               │  ─────────────────────   │
│  ┌─────────────────────────────────────────┐  │                          │
│  │  KEY INSIGHTS FROM YOUR WEBSITE         │  │  CATEGORY SCORES        │
│  │                                         │  │                          │
│  │  Value Proposition            [✨] [✎]  │  │  Product   ████░░  75%  │
│  │  "AI-native management for founders"    │  │  Market    █████░  82%  │
│  │                                         │  │  Team      ███░░░  65%  │
│  │  Key Features                 [✨] [✎]  │  │  Clarity   ████░░  78%  │
│  │  • Dashboard • CRM • Pitch Deck         │  │                          │
│  │                                         │  │  ─────────────────────   │
│  │  Target Customers             [✨] [✎]  │  │                          │
│  │  • Pre-seed founders                    │  │  RECOMMENDATIONS        │
│  │  • Seed-stage startups                  │  │                          │
│  │                                         │  │  ☑ Industry detected    │
│  │  Competitors Identified       [✨] [✎]  │  │  ☑ Competitors found    │
│  │  • Notion • Monday.com                  │  │  ☐ Add more features    │
│  └─────────────────────────────────────────┘  │  ☐ Clarify target mkt   │
│                                               │                          │
│  ┌─────────────────────────────────────────┐  │  ─────────────────────   │
│  │  TEAM OVERVIEW                          │  │                          │
│  │                                         │  │  [🔄 Recalculate]       │
│  │  👤 Jane Doe, CEO           [✨] [✎]   │  │                          │
│  │     5+ years in SaaS                    │  │                          │
│  └─────────────────────────────────────────┘  │                          │
│                                               │                          │
│  [← Back]                [Next: Interview →]  │                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Files to Create

```
src/components/onboarding/step2/
├── Step2Analysis.tsx          # Main step component
├── CompanyCard.tsx            # Company summary card (editable)
├── ReadinessScore.tsx         # Radial score display
├── InsightSection.tsx         # Editable insight with AI enhance
├── CategoryScores.tsx         # Score breakdown bars
├── RecommendationsList.tsx    # Checklist of recommendations
└── EditableField.tsx          # Shared editable field component
```

---

## Component Specifications

### 1. Step2Analysis.tsx

**Purpose:** Main container orchestrating analysis display and edits

```tsx
interface Step2AnalysisProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  sessionId: string;
  readinessScore: ReadinessScore | null;
  onRecalculate: () => Promise<void>;
  isCalculating: boolean;
}

interface ReadinessScore {
  overall_score: number;
  category_scores: {
    product: number;
    market: number;
    team: number;
    clarity: number;
  };
  benchmarks: string[];
  recommendations: string[];
}
```

**Layout:**
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Left: Company Card + Insights (2 cols) */}
  <div className="lg:col-span-2 space-y-6">
    <CompanyCard />
    <InsightSection title="Key Insights" />
    <InsightSection title="Team Overview" />
  </div>

  {/* Right: Scores (1 col) - Only on desktop, in AI panel on mobile */}
  <div className="hidden lg:block">
    <ReadinessScore />
    <CategoryScores />
    <RecommendationsList />
  </div>
</div>
```

---

### 2. CompanyCard.tsx

**Purpose:** Editable company summary card

```tsx
interface CompanyCardProps {
  name: string;
  tagline: string;
  description: string;
  tags: string[]; // [industry, business_model, stage, ...]
  onUpdate: (field: string, value: string) => void;
  onEnhance: (field: string) => Promise<string>;
  isEnhancing: Record<string, boolean>;
}
```

**Editable Fields:**
| Field | Edit Mode | AI Enhance |
|-------|-----------|------------|
| Name | Inline text | ❌ No |
| Tagline | Inline text | ✨ Yes |
| Description | Textarea modal | ✨ Yes |
| Tags | Chip selector | ❌ No |

---

### 3. EditableField.tsx

**Purpose:** Reusable editable field with AI enhancement

```tsx
interface EditableFieldProps {
  label: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onEnhance?: () => Promise<void>;
  isEnhancing?: boolean;
  type: 'text' | 'textarea' | 'chips' | 'list';
  placeholder?: string;
  canEnhance?: boolean; // Show ✨ button
}
```

**States:**
| State | UI |
|-------|-----|
| Display | Value + [✨] + [✎] buttons |
| Editing | Input/textarea + Save/Cancel |
| Enhancing | Spinner on ✨ button |
| Enhanced | Show "AI improved" badge briefly |

**AI Enhancement Flow:**
```
1. User clicks ✨ button
2. Show loading spinner
3. Call AI enhancement (enrich_context with specific field)
4. Show preview modal: "Original" vs "AI Improved"
5. User clicks Accept/Reject/Edit
6. If accepted, update field value
```

---

### 4. InsightSection.tsx

**Purpose:** Section with multiple editable insights

```tsx
interface InsightSectionProps {
  title: string;
  items: InsightItem[];
  onUpdateItem: (index: number, value: string) => void;
  onEnhanceItem: (index: number) => Promise<void>;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

interface InsightItem {
  id: string;
  label: string;
  value: string | string[];
  type: 'text' | 'list';
  canEnhance: boolean;
}
```

**Example Sections:**

**Key Insights Section:**
```tsx
const keyInsights: InsightItem[] = [
  { id: 'value_prop', label: 'Value Proposition', value: data.tagline, type: 'text', canEnhance: true },
  { id: 'key_features', label: 'Key Features', value: data.key_features, type: 'list', canEnhance: true },
  { id: 'target_customers', label: 'Target Customers', value: data.target_customers, type: 'list', canEnhance: true },
  { id: 'competitors', label: 'Competitors', value: data.competitors, type: 'list', canEnhance: true },
];
```

**Team Section:**
```tsx
const teamInsights: InsightItem[] = data.founders.map(f => ({
  id: f.id,
  label: `${f.name}, ${f.role}`,
  value: f.bio || 'No bio added',
  type: 'text',
  canEnhance: !!f.linkedin_url,
}));
```

---

### 5. ReadinessScore.tsx

**Purpose:** Radial/circular score display

```tsx
interface ReadinessScoreProps {
  score: number; // 0-100
  label: string; // "GOOD", "STRONG", "NEEDS WORK"
  benchmark: string; // "Top 30% of SaaS Pre-seed"
  onRecalculate: () => void;
  isCalculating: boolean;
}
```

**Score Labels:**
```tsx
const getScoreLabel = (score: number) => {
  if (score >= 80) return { label: 'EXCELLENT', color: 'text-green-500' };
  if (score >= 65) return { label: 'GOOD', color: 'text-sage' };
  if (score >= 50) return { label: 'FAIR', color: 'text-yellow-500' };
  return { label: 'NEEDS WORK', color: 'text-orange-500' };
};
```

**Visual:**
- Radial progress circle (like a speedometer)
- Score number in center (large)
- Label below score
- Benchmark comparison text
- "Recalculate" button (after edits)

---

### 6. CategoryScores.tsx

**Purpose:** Horizontal bar breakdown of scores

```tsx
interface CategoryScoresProps {
  scores: {
    product: number;
    market: number;
    team: number;
    clarity: number;
  };
}
```

**Visual:**
```
Product   ████████░░  78%
Market    █████████░  85%
Team      ██████░░░░  62%
Clarity   ███████░░░  72%
```

---

### 7. RecommendationsList.tsx

**Purpose:** Checklist of recommendations

```tsx
interface RecommendationsListProps {
  recommendations: string[];
  completed: string[]; // IDs of completed items
}
```

**Visual:**
```
☑ Industry detected
☑ Competitors identified
☐ Add 2+ key features
☐ Clarify target market
☐ Add founder LinkedIn
```

---

## AI Enhancement Integration

### enhance_field Action (via enrich_context)

For field-specific enhancement, we reuse `enrich_context` with targeted prompts:

```typescript
// useOnboardingAgent.ts
const enhanceField = async (
  sessionId: string,
  fieldName: string,
  currentValue: string,
  context: { industry: string; stage: string; business_model: string }
) => {
  // Use enrich_context with a field-specific prompt
  const prompt = `Improve this ${fieldName} for a ${context.industry} startup at ${context.stage} stage:

Current: "${currentValue}"

Make it more compelling, specific, and investor-friendly. Keep it concise.`;

  const { data, error } = await supabase.functions.invoke('onboarding-agent', {
    body: {
      action: 'enrich_context',
      session_id: sessionId,
      description: prompt,
    },
  });

  // Extract the improved field from response
  return data;
};
```

### Enhancement Preview Modal

```tsx
interface EnhancementPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  fieldName: string;
  originalValue: string;
  enhancedValue: string;
  onAccept: () => void;
  onReject: () => void;
  onEdit: (value: string) => void;
}
```

**Modal Layout:**
```
┌─────────────────────────────────────────┐
│  ✨ AI Enhancement                      │
├─────────────────────────────────────────┤
│                                         │
│  Original:                              │
│  "AI platform for startup founders"     │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  AI Improved:                           │
│  "ACME empowers early-stage founders    │
│   with AI-native tools to navigate      │
│   from idea to Series A, replacing      │
│   scattered spreadsheets with a         │
│   unified command center."              │
│                                         │
├─────────────────────────────────────────┤
│  [Reject]    [Edit]    [✓ Accept]       │
└─────────────────────────────────────────┘
```

---

## Data Flow

### On Page Load
```
1. Load session data (already have from Step 1)
2. Check if readiness_score exists in session
   ├── If not: Call calculate_readiness action
   └── If yes: Use cached score
3. Display all data with edit capabilities
```

### On Field Edit
```
1. User clicks ✎ button
2. Show inline edit mode
3. User makes changes
4. User clicks Save
5. Update local state
6. Call update_session (debounced)
7. Mark score as "stale" (show recalculate prompt)
```

### On AI Enhance
```
1. User clicks ✨ button
2. Show loading state
3. Call enhance_field
4. Show preview modal
5. User accepts/rejects
6. If accepted:
   ├── Update field value
   ├── Save to session
   └── Mark score as "stale"
```

### On Recalculate
```
1. User clicks "Recalculate" button
2. Show loading state on score
3. Call calculate_readiness action
4. Update score display
5. Update recommendations
6. Clear "stale" state
```

---

## form_data Updates (Step 2)

Step 2 can modify these fields:

```typescript
// Editable in Step 2
{
  name: string;          // Company name
  tagline: string;       // One-liner
  description: string;   // Full description
  key_features: string[];
  target_customers: string[];
  competitors: string[];

  // From founders (bio can be edited)
  founders: Founder[];
}
```

---

## Validation Rules

Step 2 has **no blocking validation** - user can always proceed. However, recommendations highlight gaps:

| Gap | Recommendation |
|-----|----------------|
| No tagline | "Add a compelling one-liner" |
| < 3 features | "Add at least 3 key features" |
| No competitors | "Identify 2-3 competitors" |
| No founder bio | "Add founder background" |
| Low clarity score | "Clarify your value proposition" |

---

## Right Panel Content (Step 2)

The right panel shows scores and recommendations:

```tsx
// WizardAIPanel - Step 2
<div className="space-y-6">
  <ReadinessScore
    score={readinessScore.overall_score}
    label={getScoreLabel(readinessScore.overall_score).label}
    benchmark="Top 30% of SaaS Pre-seed"
    onRecalculate={handleRecalculate}
    isCalculating={isCalculating}
  />

  <Separator />

  <CategoryScores scores={readinessScore.category_scores} />

  <Separator />

  <RecommendationsList
    recommendations={readinessScore.recommendations}
    completed={completedRecommendations}
  />

  <Separator />

  <div className="text-sm text-muted-foreground">
    <p>💡 Edit any field to improve your score.</p>
    <p>Click ✨ for AI suggestions.</p>
  </div>
</div>
```

---

## Loading States

| Action | UI |
|--------|-----|
| `calculate_readiness` | Score card shows skeleton |
| Field enhancement | ✨ button shows spinner |
| Save after edit | Silent (no UI) |
| Recalculate | Score pulses + "Calculating..." |

---

## Success Criteria

- [ ] Company card displays with all data
- [ ] All text fields are editable (click ✎)
- [ ] AI enhance button (✨) triggers enhancement
- [ ] Enhancement preview modal shows original vs improved
- [ ] Accept/Reject/Edit work in preview modal
- [ ] Readiness score displays correctly
- [ ] Category scores show breakdown bars
- [ ] Recommendations checklist displays
- [ ] Recalculate button works after edits
- [ ] Edits save to session automatically
- [ ] Score marked as "stale" after edits
- [ ] Back button returns to Step 1
- [ ] Next button always enabled (no blocking)

---

## Next Task

`04-ui--step3-interview.md` - Step 3 Smart Interview

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2026-01-23 | Initial task specification |
| v1.1 | 2026-01-23 | Changed from read-only to editable with AI enhance |
