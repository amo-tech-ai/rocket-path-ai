# Task 01: Onboarding Wizard UI Layout

**Status:** READY FOR LOVABLE
**Priority:** P0 - Foundation
**Estimated:** 2-3 hours
**Backend:** VERIFIED READY (see `100-onboarding-checklist.md`)

---

## Overview

Build the 4-step onboarding wizard with a custom 3-panel layout (NOT DashboardLayout).

```
┌────────────────────────────────────────────────────────────────────────┐
│  LEFT PANEL (256px)  │  CENTER PANEL (flex)  │  RIGHT PANEL (320px)   │
│  ─────────────────   │  ─────────────────    │  ─────────────────     │
│  WizardProgress      │  Step Content         │  WizardAIPanel         │
│  • Step indicators   │  • Forms              │  • AI suggestions      │
│  • Signals           │  • Questions          │  • Benchmarks          │
│  • Topics covered    │  • Review             │  • Advisor persona     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## File Structure to Create

```
src/
├── pages/
│   └── OnboardingWizard.tsx              # Main wizard page (router entry)
│
├── components/
│   └── onboarding/
│       ├── layout/
│       │   ├── WizardLayout.tsx          # 3-panel wizard layout
│       │   ├── WizardProgress.tsx        # Left panel progress
│       │   └── WizardNavigation.tsx      # Back/Next buttons
│       │
│       ├── step1/
│       │   ├── Step1Context.tsx          # Step 1 main component
│       │   ├── DescriptionInput.tsx      # Textarea with word count
│       │   ├── URLInput.tsx              # URL field + extract button
│       │   ├── AIDetectedFields.tsx      # Industry, Model, Stage chips
│       │   └── FounderCard.tsx           # Founder entry card
│       │
│       ├── step2/
│       │   ├── Step2Analysis.tsx         # Step 2 main component
│       │   ├── CompanyCard.tsx           # Summary card
│       │   ├── ReadinessScore.tsx        # Radial score display
│       │   └── InsightsList.tsx          # URL insights
│       │
│       ├── step3/
│       │   ├── Step3Interview.tsx        # Step 3 main component
│       │   ├── QuestionCard.tsx          # Question display
│       │   ├── AnswerOptions.tsx         # Radio/chips options
│       │   ├── TopicChecklist.tsx        # Topics covered
│       │   └── SignalBadges.tsx          # Detected signals
│       │
│       ├── step4/
│       │   ├── Step4Review.tsx           # Step 4 main component
│       │   ├── EditableSection.tsx       # Collapsible edit section
│       │   ├── ScoreBreakdown.tsx        # 5-factor breakdown
│       │   └── AISummaryCard.tsx         # Generated summary
│       │
│       └── shared/
│           ├── WizardAIPanel.tsx         # Right panel AI assistant
│           ├── AdvisorAvatar.tsx         # Advisor persona display
│           └── BenchmarkCard.tsx         # Industry benchmark
│
└── hooks/
    ├── useWizardSession.ts               # Session CRUD
    └── useOnboardingAgent.ts             # Edge function calls
```

---

## Route Configuration

**Add to `src/App.tsx`:**

```tsx
import OnboardingWizard from '@/pages/OnboardingWizard';

// Inside Routes, ABOVE the catch-all:
<Route
  path="/onboarding"
  element={
    <ProtectedRoute>
      <OnboardingWizard />
    </ProtectedRoute>
  }
/>
```

---

## Component Specifications

### 1. WizardLayout.tsx

**Purpose:** Custom 3-panel layout for wizard (replaces DashboardLayout for wizard)

```tsx
interface WizardLayoutProps {
  children: React.ReactNode;
  aiPanel: React.ReactNode;
  leftPanel: React.ReactNode;
}
```

**Layout CSS:**
```css
.wizard-layout {
  display: flex;
  min-height: 100vh;
  background: var(--background);
}
.wizard-left { width: 256px; flex-shrink: 0; }
.wizard-main { flex: 1; overflow-y: auto; }
.wizard-right { width: 320px; flex-shrink: 0; }
```

**Key Features:**
- Full-screen wizard (no dashboard nav)
- Close button → redirect to /dashboard
- Progress saved on close
- Responsive: hide right panel on tablet, drawer on mobile

---

### 2. WizardProgress.tsx (Left Panel)

**Purpose:** Show step progress, topics covered, signals detected

```tsx
interface WizardProgressProps {
  currentStep: 1 | 2 | 3 | 4;
  completedSteps: number[];
  signals: string[];
  topicsCovered: string[];
  progress: number; // 0-100
}
```

**Visual Spec:**
```
┌─────────────────────┐
│  StartupAI          │  ← Logo + close button
│  ─────────────────  │
│                     │
│  ● Step 1 ✓         │  ← Completed (green check)
│    Context          │
│                     │
│  ● Step 2 ←         │  ← Current (highlighted)
│    Analysis         │
│                     │
│  ○ Step 3           │  ← Future (dim)
│    Interview        │
│                     │
│  ○ Step 4           │
│    Review           │
│                     │
│  ─────────────────  │
│                     │
│  PROGRESS           │
│  ████████░░  75%    │
│                     │
│  ─────────────────  │
│                     │
│  SIGNALS            │  ← Only show in Step 3+
│  • b2b_saas         │
│  • has_revenue      │
│  • raising_seed     │
│                     │
└─────────────────────┘
```

---

### 3. OnboardingWizard.tsx (Main Page)

**Purpose:** Orchestrate wizard flow, manage state

```tsx
interface WizardData {
  // Step 1: Context
  name: string;
  description: string;
  website_url: string;
  linkedin_url: string;
  industry: string;
  business_model: string[];
  stage: string;
  founders: Founder[];

  // Step 2: Analysis (read from session)
  readiness_score: number;
  url_insights: UrlInsights | null;

  // Step 3: Interview (accumulated)
  interview_answers: InterviewAnswer[];
  signals: string[];
  extracted_traction: TractionData;
  extracted_funding: FundingData;

  // Step 4: Review
  investor_score: number;
  score_breakdown: ScoreBreakdown;
  ai_summary: string;
}

interface Founder {
  name: string;
  role: string;
  linkedin_url?: string;
}
```

**State Management:**
- Use React state for form data
- Use `useWizardSession` hook for persistence
- Auto-save to Supabase (debounced 500ms)
- Load existing session on mount

---

### 4. WizardAIPanel.tsx (Right Panel)

**Purpose:** AI assistant, contextual help, benchmarks

**States by Step:**

| Step | Panel Content |
|------|---------------|
| 1 | Enrichment status, tips, "Add URL for AI extraction" |
| 2 | Industry benchmark, readiness comparison, recommendations |
| 3 | Advisor persona, "Why this question", signals detected |
| 4 | Score breakdown, improvement actions, regenerate button |

```tsx
interface WizardAIPanelProps {
  step: 1 | 2 | 3 | 4;
  sessionId: string;
  // Step-specific data
  enrichmentStatus?: EnrichmentStatus;
  readinessScore?: number;
  advisor?: AdvisorPersona;
  investorScore?: InvestorScore;
}
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           OnboardingWizard.tsx                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  useWizardSession()                                              │    │
│  │    → session_id                                                  │    │
│  │    → form_data                                                   │    │
│  │    → current_step                                                │    │
│  │    → saveProgress()                                              │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                    │                                     │
│  ┌─────────────────────────────────┼─────────────────────────────────┐  │
│  │  useOnboardingAgent()           │                                 │  │
│  │    → createSession()            │                                 │  │
│  │    → updateSession()            │                                 │  │
│  │    → enrichContext()            │                                 │  │
│  │    → enrichUrl()                │                                 │  │
│  │    → calculateReadiness()       │                                 │  │
│  │    → getQuestions()             │                                 │  │
│  │    → processAnswer()            │                                 │  │
│  │    → calculateScore()           │                                 │  │
│  │    → generateSummary()          │                                 │  │
│  │    → completeWizard()           │                                 │  │
│  └─────────────────────────────────┼─────────────────────────────────┘  │
│                                    ↓                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │
│  │ Step1Context │  │ Step2Analysis│  │Step3Interview│  → Step4Review    │
│  └──────────────┘  └──────────────┘  └──────────────┘                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ↓
              ┌─────────────────────────────────────────┐
              │           Supabase                       │
              │  ┌─────────────────────────────────┐    │
              │  │  wizard_sessions                 │    │
              │  │    • form_data (JSONB)          │    │
              │  │    • current_step (1-4)         │    │
              │  │    • signals[]                   │    │
              │  │    • interview_answers[]         │    │
              │  │    • extracted_traction          │    │
              │  │    • extracted_funding           │    │
              │  └─────────────────────────────────┘    │
              │                                          │
              │  ┌─────────────────────────────────┐    │
              │  │  onboarding-agent (Edge Fn)     │    │
              │  │    • 11 actions                  │    │
              │  │    • Gemini Flash/Pro            │    │
              │  └─────────────────────────────────┘    │
              └─────────────────────────────────────────┘
```

---

## Supabase Field Mapping

### form_data Keys → startups Columns

| form_data Key | DB Column | Type | Notes |
|---------------|-----------|------|-------|
| `name` | `startups.name` | TEXT | Required |
| `description` | `startups.description` | TEXT | Required |
| `tagline` | `startups.tagline` | TEXT | Optional |
| `industry` | `startups.industry` | TEXT | From enrichment |
| `stage` | `startups.stage` | TEXT | From enrichment |
| `business_model` | `startups.business_model` | TEXT[] | **Array** |
| `website_url` | `startups.website_url` | TEXT | Direct column |
| `linkedin_url` | `startups.linkedin_url` | TEXT | Direct column |
| `target_customers` | `startups.target_customers` | TEXT[] | **Array** |
| `key_features` | `startups.key_features` | TEXT[] | **Array** |
| `founders` | `startups.founders` | JSONB | `[{name, role, linkedin_url}]` |

### Session Fields → Computed

| Session Column | Computed By | Notes |
|----------------|-------------|-------|
| `extracted_traction` | `process_answer` | `{current_mrr, growth_rate, users}` |
| `extracted_funding` | `process_answer` | `{is_raising, target_amount, use_of_funds[]}` |
| `signals[]` | `process_answer` | Accumulated from answers |
| `interview_progress` | Auto | `(answered / total) * 100` |

---

## Navigation Rules

| From | To | Condition |
|------|-----|-----------|
| Step 1 | Step 2 | `description.length >= 50` AND `founders.length >= 1` |
| Step 2 | Step 3 | Always (read-only step) |
| Step 3 | Step 4 | All required questions answered OR skipped |
| Step 4 | Dashboard | `complete_wizard` success |
| Any | Previous | Always (data preserved) |

---

## Loading States

| Action | Loading Location | Duration |
|--------|------------------|----------|
| `enrichUrl` | URL input button | 3-5s |
| `enrichContext` | Description field indicator | 2-3s |
| `calculateReadiness` | Step 2 score card | 2-3s |
| `processAnswer` | Continue button | 1-2s |
| `calculateScore` | Step 4 score card | 3-5s |
| `generateSummary` | Summary card | 3-5s |
| `completeWizard` | Complete button | 2-3s |

---

## Error Handling

| Error | User Action |
|-------|-------------|
| AI enrichment fails | Show manual input, hide AI suggestions |
| Session load fails | Create new session, show toast |
| Save fails | Show retry button, keep data in state |
| Network error | Queue action, retry on reconnect |
| Question load fails | Load generic questions |

---

## Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| Desktop (>1280px) | 3-panel (256 + flex + 320) |
| Tablet (768-1280px) | 2-panel (hide right, show on toggle) |
| Mobile (<768px) | 1-panel (drawer navigation, bottom sheet AI) |

---

## Lovable Prompt Template

```
Build an onboarding wizard with these specifications:

LAYOUT:
- 3-panel layout: Left (256px) + Center (flex) + Right (320px)
- Full-screen wizard (not inside dashboard nav)
- Close button returns to /dashboard

LEFT PANEL (WizardProgress):
- Logo with close button
- 4 step indicators with completion status
- Progress bar showing overall completion
- Signal badges (shown in step 3+)

CENTER PANEL:
- Step 1: Form with description, URL input, industry/model/stage chips, founder cards
- Step 2: Company card, readiness score (0-100 radial), insights list
- Step 3: One question at a time, radio options, skip button
- Step 4: Collapsible sections for review, score breakdown, AI summary

RIGHT PANEL (WizardAIPanel):
- Step 1: Enrichment tips, "Add URL for AI magic"
- Step 2: Industry benchmark comparison
- Step 3: Advisor persona with contextual help
- Step 4: Improvement actions with score impact

STYLING:
- Use existing design system (Tailwind + shadcn/ui)
- Premium SaaS aesthetic
- Framer Motion for step transitions
- Skeleton loaders for AI actions

NAVIGATION:
- Back/Next buttons in center panel
- Step 1 → 2 requires description (50+ chars) + 1 founder
- Step 2 → 3 always allowed
- Step 3 → 4 requires interview completion
- Step 4 Complete → redirect to /dashboard
```

---

## Success Criteria

- [ ] `/onboarding` route accessible and protected
- [ ] 3-panel layout renders correctly on desktop
- [ ] Left panel shows step progress with indicators
- [ ] Center panel switches content per step
- [ ] Right panel shows contextual AI content
- [ ] Navigation buttons work (Back/Next)
- [ ] Close button saves and redirects to /dashboard
- [ ] Loading states show during AI actions
- [ ] Error states handled gracefully
- [ ] Responsive: works on tablet (hide right panel)
- [ ] Framer Motion transitions between steps

---

## Next Tasks

After this task:
- `02-ui--step1-context.md` - Step 1 form implementation
- `03-ui--step2-analysis.md` - Step 2 read-only display
- `04-ui--step3-interview.md` - Step 3 smart interview
- `05-ui--step4-review.md` - Step 4 review and complete

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2026-01-23 | Initial task specification |
