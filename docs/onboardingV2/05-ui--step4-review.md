# Task 05: Step 4 — Review & Complete

**Status:** READY FOR IMPLEMENTATION
**Priority:** P0 - Critical
**Depends on:** Task 04 (Step 3)
**Estimated:** 4-5 hours
**Backend Actions:** `calculate_score`, `generate_summary`, `complete_wizard`

---

## Overview

Step 4 is the **final review** before creating the startup profile. Users see their Investor-Ready Score, AI-generated summary, and can make final edits before completing onboarding.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Step 4: Review & Complete                                               │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  INVESTOR-READY SCORE                           │  KEY METRICS           │
│  ┌─────────────────────────────────────────┐   │                        │
│  │            78 / 100                     │   │  $25K MRR              │
│  │    ████████████████████░░░░░░░░░░       │   │  +15% Growth           │
│  │         STRONG — Ready for Seed         │   │  150 Users             │
│  │                                         │   │  18mo Runway           │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐   │   │                        │
│  │  │Team│ │Trac│ │Mkt │ │Prod│ │Fund│   │   │  ─────────────────     │
│  │  │ 85 │ │ 72 │ │ 80 │ │ 75 │ │ 70 │   │   │                        │
│  │  └────┘ └────┘ └────┘ └────┘ └────┘   │   │  QUICK ACTIONS         │
│  └─────────────────────────────────────────┘   │                        │
│                                                 │  [🔄 Regenerate Score] │
│  ┌─────────────────────────────────────────┐   │  [✨ Improve Summary]  │
│  │  ▼ AI-GENERATED SUMMARY            [✨] │   │                        │
│  │                                         │   │  ─────────────────     │
│  │  ACME Corp is a B2B SaaS platform       │   │                        │
│  │  empowering early-stage founders with   │   │  TOP IMPROVEMENTS      │
│  │  AI-native tools to navigate from idea  │   │                        │
│  │  to Series A...                         │   │  1. Add case studies   │
│  │                                         │   │     (+5 points)        │
│  │  STRENGTHS           AREAS TO IMPROVE   │   │                        │
│  │  ✓ Strong team       • Add testimonials │   │  2. Complete pitch     │
│  │  ✓ Clear value       • Define sales     │   │     deck (+4 points)   │
│  │  ✓ Growing MRR       • Use of funds     │   │                        │
│  └─────────────────────────────────────────┘   │  3. Add advisor        │
│                                                 │     (+3 points)        │
│  ┌─────────────────────────────────────────┐   │                        │
│  │  ▶ COMPANY DETAILS (collapsed)     [✎] │   │                        │
│  └─────────────────────────────────────────┘   │                        │
│                                                 │                        │
│  ┌─────────────────────────────────────────┐   │                        │
│  │  ▶ TRACTION & FUNDING (collapsed)  [✎] │   │                        │
│  └─────────────────────────────────────────┘   │                        │
│                                                 │                        │
│  ┌─────────────────────────────────────────┐   │                        │
│  │  ▶ INTERVIEW ANSWERS (collapsed)   👁️  │   │                        │
│  └─────────────────────────────────────────┘   │                        │
│                                                 │                        │
│  [← Back]              [✓ Complete Setup →]    │                        │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Files to Create

```
src/components/onboarding/step4/
├── Step4Review.tsx            # Main step component
├── InvestorScoreCard.tsx      # Large score display with breakdown
├── ScoreBreakdownBar.tsx      # Individual factor bar
├── AISummaryCard.tsx          # AI-generated summary (editable)
├── StrengthsWeaknesses.tsx    # Two-column strengths/improvements
├── CollapsibleSection.tsx     # Reusable collapsible
├── CompanyDetailsSection.tsx  # Company info review
├── TractionSection.tsx        # Traction metrics review
├── InterviewAnswersSection.tsx# Interview Q&A review
├── ImprovementsList.tsx       # Score improvement actions
└── CompleteModal.tsx          # Completion confirmation
```

---

## Component Specifications

### 1. Step4Review.tsx

**Purpose:** Main container orchestrating final review

```tsx
interface Step4ReviewProps {
  sessionId: string;
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onComplete: () => Promise<void>;
}

interface Step4State {
  investorScore: InvestorScore | null;
  aiSummary: AISummary | null;
  isCalculatingScore: boolean;
  isGeneratingSummary: boolean;
  isCompleting: boolean;
  scoreStale: boolean; // True if edits made since last calculation
}

interface InvestorScore {
  total_score: number;
  breakdown: {
    team: number;
    traction: number;
    market: number;
    product: number;
    fundraising: number;
  };
  recommendations: ScoreRecommendation[];
}

interface AISummary {
  summary: string;
  strengths: string[];
  improvements: string[];
}
```

**Layout:**
```tsx
<div className="space-y-6">
  <InvestorScoreCard />
  <AISummaryCard />
  <CollapsibleSection title="Company Details" />
  <CollapsibleSection title="Traction & Funding" />
  <CollapsibleSection title="Interview Answers" readonly />

  <div className="flex justify-between">
    <Button variant="outline" onClick={goBack}>← Back</Button>
    <Button onClick={handleComplete} disabled={isCompleting}>
      {isCompleting ? <Spinner /> : '✓ Complete Setup'}
    </Button>
  </div>
</div>
```

---

### 2. InvestorScoreCard.tsx

**Purpose:** Display investor-ready score with 5-factor breakdown

```tsx
interface InvestorScoreCardProps {
  score: InvestorScore;
  onRecalculate: () => void;
  isCalculating: boolean;
  isStale: boolean;
}
```

**Visual Design:**
```
┌─────────────────────────────────────────────────────┐
│  INVESTOR-READY SCORE                               │
│                                                     │
│              ┌───────────────┐                      │
│              │      78       │                      │
│              │    / 100      │                      │
│              │  ████████░░░  │                      │
│              │   STRONG      │                      │
│              └───────────────┘                      │
│                                                     │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  │ Team   │ │Traction│ │ Market │ │Product │ │Funding │
│  │  85    │ │   72   │ │   80   │ │   75   │ │   70   │
│  │ ████░  │ │ ███░░  │ │ ████░  │ │ ███░░  │ │ ███░░  │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘
│                                                     │
│  {isStale && "Score may be outdated. [Recalculate]"}│
└─────────────────────────────────────────────────────┘
```

**Score Thresholds:**
```tsx
const getScoreLabel = (score: number) => {
  if (score >= 85) return { label: 'EXCELLENT', sublabel: 'Ready for Series A talks', color: 'text-emerald-500' };
  if (score >= 70) return { label: 'STRONG', sublabel: 'Ready for Seed talks', color: 'text-green-500' };
  if (score >= 55) return { label: 'GOOD', sublabel: 'Building momentum', color: 'text-sage' };
  if (score >= 40) return { label: 'FAIR', sublabel: 'Keep building', color: 'text-yellow-500' };
  return { label: 'EARLY', sublabel: 'Focus on fundamentals', color: 'text-orange-500' };
};
```

---

### 3. ScoreBreakdownBar.tsx

**Purpose:** Single factor score bar

```tsx
interface ScoreBreakdownBarProps {
  label: string;
  score: number;
  maxScore: number; // Usually 25 for Team/Traction, 20 for Market, 15 for Product/Funding
  color: string;
}
```

**Factor Weights:**
| Factor | Max Score | Weight |
|--------|-----------|--------|
| Team | 25 | 25% |
| Traction | 25 | 25% |
| Market | 20 | 20% |
| Product | 15 | 15% |
| Fundraising | 15 | 15% |

---

### 4. AISummaryCard.tsx

**Purpose:** AI-generated investor summary with edit/regenerate

```tsx
interface AISummaryCardProps {
  summary: AISummary;
  onRegenerate: () => void;
  onEdit: (field: 'summary' | 'strengths' | 'improvements', value: string | string[]) => void;
  isRegenerating: boolean;
}
```

**Features:**
- Summary text (editable textarea)
- Strengths list (editable)
- Improvements list (editable)
- "Regenerate" button for new AI summary
- AI enhance button (✨) for each section

---

### 5. StrengthsWeaknesses.tsx

**Purpose:** Two-column display of strengths and improvements

```tsx
interface StrengthsWeaknessesProps {
  strengths: string[];
  improvements: string[];
  onEditStrengths: (strengths: string[]) => void;
  onEditImprovements: (improvements: string[]) => void;
}
```

**Visual:**
```
┌─────────────────────┬─────────────────────┐
│  STRENGTHS          │  AREAS TO IMPROVE   │
│                     │                     │
│  ✓ Strong team      │  • Add testimonials │
│  ✓ Clear value prop │  • Define sales     │
│  ✓ Growing MRR      │    process          │
│  ✓ Technical depth  │  • Clarify use of   │
│                     │    funds            │
└─────────────────────┴─────────────────────┘
```

---

### 6. CollapsibleSection.tsx

**Purpose:** Reusable collapsible section for details

```tsx
interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  editable?: boolean;
  onEdit?: () => void;
}
```

**Sections:**
| Section | Default State | Editable |
|---------|---------------|----------|
| AI Summary | Expanded | ✨ AI + ✎ Edit |
| Company Details | Collapsed | ✎ Edit |
| Traction & Funding | Collapsed | ✎ Edit |
| Interview Answers | Collapsed | Read-only (👁️) |

---

### 7. CompanyDetailsSection.tsx

**Purpose:** Review and edit company information

```tsx
interface CompanyDetailsSectionProps {
  data: {
    name: string;
    description: string;
    tagline: string;
    industry: string;
    business_model: string[];
    stage: string;
    website_url: string;
    linkedin_url: string;
    key_features: string[];
    target_customers: string[];
    competitors: string[];
    founders: Founder[];
  };
  onUpdate: (field: string, value: any) => void;
}
```

---

### 8. TractionSection.tsx

**Purpose:** Review and edit traction metrics

```tsx
interface TractionSectionProps {
  traction: {
    current_mrr: number;
    growth_rate: number;
    users: number;
    customers: number;
  };
  funding: {
    is_raising: boolean;
    target_amount: number;
    use_of_funds: string[];
  };
  onUpdate: (section: 'traction' | 'funding', field: string, value: any) => void;
}
```

**Display:**
```
TRACTION
MRR: $25,000 [✎]
Growth: 15% MoM [✎]
Users: 150 [✎]

FUNDING
Status: Actively Raising [✎]
Target: $500,000 [✎]
Use of Funds: Engineering, Sales, Marketing [✎]
```

---

### 9. InterviewAnswersSection.tsx

**Purpose:** Read-only display of interview Q&A

```tsx
interface InterviewAnswersSectionProps {
  answers: InterviewAnswer[];
  questions: Question[];
}
```

**Display:**
```
Q: What's your current MRR?
A: $10K - $50K MRR

Q: How are new users finding you?
A: Organic inbound (SEO, content, social)

Q: Are you currently raising?
A: Actively raising now
```

---

### 10. ImprovementsList.tsx

**Purpose:** Ranked list of score improvements (right panel)

```tsx
interface ImprovementsListProps {
  recommendations: ScoreRecommendation[];
}

interface ScoreRecommendation {
  action: string;
  points_gain: number;
}
```

**Visual:**
```
TOP IMPROVEMENTS

1. Add case studies
   +5 points

2. Complete pitch deck
   +4 points

3. Add advisor to team
   +3 points
```

---

### 11. CompleteModal.tsx

**Purpose:** Confirmation modal before completing

```tsx
interface CompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  startupName: string;
  score: number;
}
```

**Modal Content:**
```
┌─────────────────────────────────────────┐
│  ✓ Ready to Complete Setup?            │
├─────────────────────────────────────────┤
│                                         │
│  You're about to create your startup    │
│  profile for ACME Corp.                 │
│                                         │
│  Investor-Ready Score: 78/100           │
│                                         │
│  This will:                             │
│  • Create your startup profile          │
│  • Generate onboarding tasks            │
│  • Unlock your dashboard                │
│                                         │
│  You can always edit your profile       │
│  later from the Company Profile page.   │
│                                         │
├─────────────────────────────────────────┤
│  [Cancel]          [✓ Complete Setup]   │
└─────────────────────────────────────────┘
```

---

## Data Flow

### On Page Load
```
1. Load session data (from previous steps)
2. Call calculate_score action
   → Returns total_score, breakdown, recommendations
3. Call generate_summary action
   → Returns summary, strengths, improvements
4. Display all data
```

### On Edit (Any Section)
```
1. User clicks ✎ button
2. Show edit mode for that field
3. User makes changes
4. Save to session (update_session)
5. Mark score as "stale"
6. Show "Recalculate" prompt
```

### On Regenerate Summary
```
1. User clicks "Regenerate" or ✨
2. Show loading state
3. Call generate_summary action
4. Update summary display
```

### On Recalculate Score
```
1. User clicks "Recalculate"
2. Show loading state on score card
3. Call calculate_score action
4. Update score and recommendations
5. Clear "stale" state
```

### On Complete
```
1. User clicks "Complete Setup"
2. Show CompleteModal
3. User confirms
4. Call complete_wizard action
   → Creates/updates startup record
   → Generates onboarding tasks
   → Marks session as completed
5. Show success animation
6. Redirect to /dashboard
```

---

## complete_wizard Action

This is the final action that:
1. Gets user's org_id (creates org if needed)
2. Creates startup record in `startups` table
3. Copies all data from wizard_sessions
4. Generates initial tasks
5. Marks session as completed

**Request:**
```typescript
const completeWizard = async (sessionId: string) => {
  const { data, error } = await supabase.functions.invoke('onboarding-agent', {
    body: {
      action: 'complete_wizard',
      session_id: sessionId,
    },
  });

  if (error) throw error;
  return data; // { completed: true, startup_id: 'uuid', tasks: [...] }
};
```

---

## Right Panel Content (Step 4)

```tsx
// WizardAIPanel - Step 4
<div className="space-y-6">
  {/* Key Metrics */}
  <div>
    <h4 className="font-medium mb-3">Key Metrics</h4>
    <div className="space-y-2">
      <MetricRow label="MRR" value={`$${traction.current_mrr?.toLocaleString()}`} />
      <MetricRow label="Growth" value={`+${traction.growth_rate}%`} />
      <MetricRow label="Users" value={traction.users?.toLocaleString()} />
      {funding.is_raising && (
        <MetricRow label="Raising" value={`$${funding.target_amount?.toLocaleString()}`} />
      )}
    </div>
  </div>

  <Separator />

  {/* Quick Actions */}
  <div>
    <h4 className="font-medium mb-3">Quick Actions</h4>
    <div className="space-y-2">
      <Button variant="outline" size="sm" onClick={handleRecalculate}>
        🔄 Recalculate Score
      </Button>
      <Button variant="outline" size="sm" onClick={handleRegenerateSummary}>
        ✨ Regenerate Summary
      </Button>
    </div>
  </div>

  <Separator />

  {/* Improvements */}
  <ImprovementsList recommendations={investorScore?.recommendations || []} />
</div>
```

---

## Validation Rules

Step 4 has minimal validation - users should be able to complete:

| Requirement | Validation |
|-------------|------------|
| Score calculated | Auto-calculated on load |
| Summary generated | Auto-generated on load |
| Session exists | Must have valid session_id |

---

## Loading States

| Action | UI |
|--------|-----|
| `calculate_score` | Score card skeleton |
| `generate_summary` | Summary card skeleton |
| Recalculate | Score pulses + "Calculating..." |
| Regenerate | Summary skeleton |
| `complete_wizard` | Modal button spinner + disabled |

---

## Success Animation

After successful completion:
```tsx
// Show success state for 2 seconds
<motion.div
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  className="text-center"
>
  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
  <h2 className="text-2xl font-bold mt-4">Welcome to StartupAI!</h2>
  <p className="text-muted-foreground mt-2">
    Your startup profile has been created.
  </p>
</motion.div>

// Then redirect to dashboard
setTimeout(() => navigate('/dashboard'), 2000);
```

---

## Error Handling

| Error | User Action |
|-------|-------------|
| `calculate_score` fails | Show error, allow retry |
| `generate_summary` fails | Show error, allow retry |
| `complete_wizard` fails | Show error in modal, allow retry |
| Org creation fails | Show specific error message |

---

## Success Criteria

- [ ] Score card displays with total and breakdown
- [ ] 5-factor breakdown bars render correctly
- [ ] Score label (STRONG, GOOD, etc.) shows correctly
- [ ] AI summary displays with strengths/improvements
- [ ] All collapsible sections work
- [ ] Company details section is editable
- [ ] Traction section is editable
- [ ] Interview answers display (read-only)
- [ ] Edit triggers "stale" state on score
- [ ] Recalculate button works
- [ ] Regenerate summary button works
- [ ] ✨ AI enhance buttons work
- [ ] Complete button opens confirmation modal
- [ ] Completion creates startup successfully
- [ ] Success animation shows
- [ ] Redirect to dashboard works
- [ ] Back button returns to Step 3

---

## Post-Completion

After completion:
1. Session marked as `status: 'completed'`
2. Startup record created with all data
3. User redirected to `/dashboard`
4. Dashboard shows:
   - Investor Score widget
   - Generated tasks
   - Company profile
   - "Re-run Wizard" option (updates existing)

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2026-01-23 | Initial task specification |
