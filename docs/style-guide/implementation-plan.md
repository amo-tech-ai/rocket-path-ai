# Style Guide Implementation Plan

**Target:** Apply consistent design system across all 10 screens  
**Priority:** Sequential rollout for stability  
**Last Updated:** February 8, 2026

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
**Goal:** Establish shared tokens and base components

| Step | Task | Files | Priority |
|------|------|-------|----------|
| 1.1 | Add canvas color tokens to tailwind.config.ts | `tailwind.config.ts` | P1 |
| 1.2 | Add CSS variables to index.css | `src/index.css` | P1 |
| 1.3 | Create CanvasCard base component | `src/components/ui/canvas-card.tsx` | P1 |
| 1.4 | Create ThreePanelLayout component | `src/components/layout/ThreePanelLayout.tsx` | P1 |
| 1.5 | Create AIPanel component | `src/components/layout/AIPanel.tsx` | P1 |

### Phase 2: Canvas Screens (Week 2)
**Goal:** Apply style guide to all canvas-type screens

| Step | Screen | File | Status |
|------|--------|------|--------|
| 2.1 | Lean Canvas | `src/pages/LeanCanvas.tsx` | 🔴 |
| 2.2 | Opportunity Canvas | `src/pages/OpportunityCanvas.tsx` | 🔴 |
| 2.3 | Story Map | `src/pages/StoryMap.tsx` | 🔴 |
| 2.4 | Idea Wall | `src/pages/IdeaWall.tsx` | 🔴 |

### Phase 3: Wizard Screens (Week 3)
**Goal:** Standardize wizard/form layouts

| Step | Screen | File | Status |
|------|--------|------|--------|
| 3.1 | Onboarding Wizard | `src/pages/Onboarding.tsx` | 🔴 |
| 3.2 | Pitch Deck Wizard | `src/pages/PitchDeckWizard.tsx` | 🔴 |
| 3.3 | Chat Intake | `src/pages/ChatIntake.tsx` | 🔴 |

### Phase 4: Dashboard Screens (Week 4)
**Goal:** Unify dashboard layouts

| Step | Screen | File | Status |
|------|--------|------|--------|
| 4.1 | Main Dashboard | `src/pages/Dashboard.tsx` | 🔴 |
| 4.2 | Validation Report | `src/pages/ValidatorReport.tsx` | 🔴 |
| 4.3 | Market Research Hub | `src/pages/MarketResearchHub.tsx` | 🔴 |
| 4.4 | 90-Day Plan | `src/pages/90DayPlan.tsx` | 🔴 |
| 4.5 | Experiments Lab | `src/pages/ExperimentsLab.tsx` | 🔴 |

---

## CSS Token Implementation

### tailwind.config.ts additions

```typescript
colors: {
  canvas: {
    primary: 'hsl(var(--canvas-primary))',
    'primary-hover': 'hsl(var(--canvas-primary-hover))',
    accent: 'hsl(var(--canvas-accent))',
    sage: 'hsl(var(--canvas-sage))',
    success: 'hsl(var(--canvas-success))',
    bg: 'hsl(var(--canvas-bg))',
    surface: 'hsl(var(--canvas-surface))',
    'surface-hover': 'hsl(var(--canvas-surface-hover))',
    divider: 'hsl(var(--canvas-divider))',
    'focus-border': 'hsl(var(--canvas-focus-border))',
  },
  'canvas-text': {
    primary: 'hsl(var(--canvas-text-primary))',
    secondary: 'hsl(var(--canvas-text-secondary))',
    tertiary: 'hsl(var(--canvas-text-tertiary))',
    muted: 'hsl(var(--canvas-text-muted))',
  }
}
```

### index.css additions

```css
:root {
  /* Canvas Primary Accents */
  --canvas-primary: 153 24% 30%;        /* #3B5F52 */
  --canvas-primary-hover: 153 24% 23%;  /* #2D4840 */
  --canvas-accent: 166 77% 21%;         /* #0d5f4e */
  --canvas-sage: 153 21% 51%;           /* #6b9d89 */
  --canvas-success: 137 63% 92%;        /* #DCF9E3 */
  
  /* Canvas Backgrounds */
  --canvas-bg: 40 14% 97%;              /* #FAF9F7 */
  --canvas-surface: 0 0% 100%;          /* #FFFFFF */
  --canvas-surface-hover: 330 14% 98%;  /* #FBF9FA */
  
  /* Canvas Text */
  --canvas-text-primary: 210 7% 14%;    /* #212427 */
  --canvas-text-secondary: 220 9% 46%;  /* #6B7280 */
  --canvas-text-tertiary: 218 11% 65%;  /* #9CA3AF */
  --canvas-text-muted: 218 14% 83%;     /* #D1D5DB */
  
  /* Canvas Borders */
  --canvas-divider: 220 13% 91%;        /* #E5E7EB */
  --canvas-focus-border: 153 24% 30%;   /* #3B5F52 */
}
```

---

## Component Templates

### ThreePanelLayout.tsx

```tsx
interface ThreePanelLayoutProps {
  leftPanel: React.ReactNode;
  mainPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  leftWidth?: string;  // default: 240px
  rightWidth?: string; // default: 320px
}
```

### CanvasCard.tsx

```tsx
interface CanvasCardProps {
  title: string;
  description?: string;
  status?: 'default' | 'active' | 'complete';
  children: React.ReactNode;
}
```

### AIPanel.tsx

```tsx
interface AIPanelProps {
  summary?: React.ReactNode;
  risks?: string[];
  suggestions?: string[];
  insights?: React.ReactNode;
}
```

---

## Migration Checklist Per Screen

For each screen, complete:

- [ ] Replace hardcoded colors with canvas tokens
- [ ] Apply ThreePanelLayout wrapper
- [ ] Standardize header with back link + progress
- [ ] Add AI panel to right side
- [ ] Apply typography hierarchy
- [ ] Add focus states to interactive elements
- [ ] Test responsive breakpoints
- [ ] Verify mobile bottom sheet behavior

---

## Quality Gates

### Before merging each phase:

1. **Color Audit** - No hardcoded hex values in components
2. **Layout Check** - 3-panel structure on desktop
3. **Mobile Test** - Bottom sheet AI panel works
4. **Typography** - Consistent heading/body hierarchy
5. **Focus States** - Visible keyboard navigation

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Color Tokens | 100% usage | No raw hex in components |
| Layout Consistency | 10/10 screens | 3-panel structure |
| Mobile Responsive | 10/10 screens | Bottom sheet pattern |
| Typography | 100% | Semantic heading levels |

---

## Auth Flow Integration

### Login Routing Logic

```typescript
// After successful authentication:
const handleAuthSuccess = async (user: User) => {
  const profile = await fetchProfile(user.id);
  
  if (profile?.onboarding_completed) {
    // Existing user → Dashboard
    navigate('/dashboard');
  } else {
    // New user → Onboarding
    navigate('/onboarding');
  }
};
```

### Profile Check

```typescript
// profiles table schema
interface Profile {
  id: string;
  onboarding_completed: boolean;
  onboarding_step?: number;
  created_at: string;
}
```

---

**Next Action:** Start Phase 1.1 - Add canvas tokens to tailwind.config.ts
