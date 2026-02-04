# 103 - Startup Coach 3-Panel UI

---

| Aspect | Details |
|--------|---------|
| **Screens** | Validator (refactored to 3-panel layout) |
| **Features** | Nav + Validator Main + Coach Chat side-by-side |
| **Agents** | - |
| **Edge Functions** | - |
| **Use Cases** | See validation data while chatting, visual progress tracking |
| **Real-World** | "I see my scores on the left while coach explains them on the right" |

---

```yaml
---
task_id: 103-VAL
title: Startup Coach 3-Panel UI
diagram_ref: startup-coach-design
phase: MVP
priority: P0
status: Not Started
skill: /frontend-design
ai_model: -
subagents: [frontend-designer, code-reviewer]
edge_function: -
schema_tables: []
depends_on: [101-VAL, 102-VAL]
---
```

---

## Description

Refactor the Validator page to a 3-panel layout: Navigation (left), Validator Dashboard (center), Coach Chat (right). The center panel shows validation scores, evidence blocks, and sprint progress. The right panel is the conversational coach interface with progress bar, messages, and quick actions.

## Rationale

**Problem:** Current Validator is a static dashboard; AI Chat is separate page.
**Solution:** 3-panel layout shows data and coach side-by-side.
**Impact:** Founders see context while getting guidance - no tab switching.

---

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | see my scores while chatting | I understand what coach is referencing |
| Founder | see my phase progress | I know where I am in the journey |
| Founder | click suggested actions | I don't have to type everything |
| Founder | collapse the coach panel | I can focus on data when needed |

## Real-World Example

> Priya opens the Validator. On the left she sees her 78/100 score with
> "Concerns: No customers" highlighted. On the right, the coach says:
> "That acquisition concern is your bottleneck. Ready for a 90-day sprint?"
> She clicks [Yes, let's plan] without typing.

---

## Goals

1. **Primary:** 3-panel layout with responsive behavior
2. **Secondary:** Coach panel with progress, messages, quick actions
3. **Quality:** Smooth animations, mobile-friendly collapse

## Acceptance Criteria

- [ ] 3-panel layout: Nav (80px) | Main (~60%) | Coach (~40%)
- [ ] Main panel shows Verdict, Tradeoffs, Evidence, Sprint Progress
- [ ] Coach panel shows Phase Progress, Messages, Quick Actions, Input
- [ ] Coach panel collapsible with [−] button
- [ ] Responsive: tablet = slide-over drawer, mobile = toggle view
- [ ] Loading skeletons for data fetch
- [ ] Error states handled gracefully

---

## Layout Wireframe

```
┌──────┬──────────────────────────────────────────────────┬──────────────────────────────────┐
│      │ VALIDATION DASHBOARD                       [⋮]  │ YOUR COACH              [−][×]  │
│      ├──────────────────────────────────────────────────┼──────────────────────────────────┤
│ NAV  │                                                  │                                  │
│      │ ┌──────────────────────────────────────────────┐ │ ┌────────────────────────────┐  │
│ 80px │ │ VERDICT                              78/100  │ │ │ Assessment ━━● Constraint  │  │
│      │ │ Promising - needs customer validation        │ │ │ ○ Campaign ○ Sprint        │  │
│      │ └──────────────────────────────────────────────┘ │ └────────────────────────────┘  │
│      │                                                  │                                  │
│      │ ┌─────────────┬─────────────┬─────────────────┐ │ ┌────────────────────────────┐  │
│      │ │ Strengths   │ Concerns    │ Next Steps      │ │ │ Coach message bubble       │  │
│      │ │ • Problem   │ • No users  │ 1. Interview    │ │ │ ...                        │  │
│      │ │   clarity   │ • Unproven  │ 2. Test pricing │ │ └────────────────────────────┘  │
│      │ └─────────────┴─────────────┴─────────────────┘ │                                  │
│      │                                                  │ ┌────────────────────────────┐  │
│      │ ┌──────────────────────────────────────────────┐ │ │[Yes, let's plan]           │  │
│      │ │ EVIDENCE                           [Expand]  │ │ │[Show details]              │  │
│      │ │ ┌────────┐┌────────┐┌────────┐┌────────┐    │ │ │[I have questions]          │  │
│      │ │ │Market  ││Problem ││Solution││Business│    │ │ └────────────────────────────┘  │
│      │ │ │ 8/10   ││ 9/10   ││ 7/10   ││ 7/10   │    │ │                                  │
│      │ │ └────────┘└────────┘└────────┘└────────┘    │ │ ┌────────────────────────────┐  │
│      │ └──────────────────────────────────────────────┘ │ │ Type message...       [→]  │  │
│      │                                                  │ └────────────────────────────┘  │
│      │ ┌──────────────────────────────────────────────┐ │                                  │
│      │ │ SPRINT PROGRESS                 Sprint 1/5  │ │                                  │
│      │ │ ████████░░░░░░░░░░░░░░░░░░░░░░  12%        │ │                                  │
│      │ └──────────────────────────────────────────────┘ │                                  │
└──────┴──────────────────────────────────────────────────┴──────────────────────────────────┘
```

---

## Component Structure

```
src/
├── pages/
│   └── Validator.tsx               # Refactor to 3-panel
├── components/
│   ├── validator/
│   │   ├── ValidatorLayout.tsx     # 3-panel container
│   │   ├── VerdictCard.tsx         # Score + status
│   │   ├── TradeoffsCard.tsx       # Strengths/Concerns/Next
│   │   ├── EvidenceBlocks.tsx      # Expandable dimension cards
│   │   └── SprintProgress.tsx      # Campaign progress bar
│   └── coach/
│       ├── CoachPanel.tsx          # Right panel container
│       ├── CoachProgress.tsx       # Phase progress stepper
│       ├── CoachMessage.tsx        # Styled message bubble
│       ├── QuickActions.tsx        # Suggested action buttons
│       └── CoachInput.tsx          # Message input field
└── hooks/
    └── useCoachSession.ts          # Session state + API
```

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Page | `src/pages/Validator.tsx` | Refactor |
| Layout | `src/components/validator/ValidatorLayout.tsx` | Create |
| Verdict | `src/components/validator/VerdictCard.tsx` | Modify |
| Tradeoffs | `src/components/validator/TradeoffsCard.tsx` | Create |
| Evidence | `src/components/validator/EvidenceBlocks.tsx` | Create |
| Sprint | `src/components/validator/SprintProgress.tsx` | Create |
| Coach Panel | `src/components/coach/CoachPanel.tsx` | Create |
| Coach Progress | `src/components/coach/CoachProgress.tsx` | Create |
| Coach Message | `src/components/coach/CoachMessage.tsx` | Create |
| Quick Actions | `src/components/coach/QuickActions.tsx` | Create |
| Coach Input | `src/components/coach/CoachInput.tsx` | Create |
| Hook | `src/hooks/useCoachSession.ts` | Create |

---

## Component Specifications

### ValidatorLayout.tsx

```typescript
interface ValidatorLayoutProps {
  children: React.ReactNode;  // Main content
  coachPanel: React.ReactNode;  // Coach panel
}

// Handles responsive breakpoints
// Desktop: side-by-side
// Tablet: coach as drawer
// Mobile: toggle between views
```

### CoachPanel.tsx

```typescript
interface CoachPanelProps {
  sessionId: string;
  onClose: () => void;
  onMinimize: () => void;
}

// Contains: CoachProgress, message list, QuickActions, CoachInput
// Handles: send message, display responses, loading states
```

### CoachProgress.tsx

```typescript
interface CoachProgressProps {
  phase: ValidationPhase;
  progress: {
    step: number;
    totalSteps: number;
    percentage: number;
  };
}

// Visual stepper showing: Assessment → Constraint → Campaign → Sprint → Review
// Current phase highlighted, completed phases checked
```

### CoachMessage.tsx

```typescript
interface CoachMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

// Styled bubble with avatar
// Coach messages on left with coach avatar
// User messages on right, different color
```

### QuickActions.tsx

```typescript
interface QuickActionsProps {
  actions: string[];
  onSelect: (action: string) => void;
  disabled?: boolean;
}

// Renders 2-4 buttons for suggested responses
// Clicking sends as user message
```

### useCoachSession.ts

```typescript
interface UseCoachSessionReturn {
  session: ValidationSession | null;
  messages: ConversationMessage[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (message: string) => Promise<void>;
  suggestedActions: string[];
  progress: ProgressInfo;
}

export function useCoachSession(startupId: string): UseCoachSessionReturn;
```

---

## Responsive Behavior

| Breakpoint | Layout | Coach Panel |
|------------|--------|-------------|
| Desktop (>1200px) | 3 columns side-by-side | Always visible, ~40% width |
| Tablet (768-1200px) | 2 columns | Slide-over drawer from right |
| Mobile (<768px) | Single column | Full-screen overlay with toggle |

### Responsive Implementation

```typescript
// In ValidatorLayout.tsx
const isDesktop = useMediaQuery('(min-width: 1200px)');
const isTablet = useMediaQuery('(min-width: 768px)');

if (isDesktop) {
  // Side-by-side layout
}
if (isTablet && !isDesktop) {
  // Drawer pattern
}
if (!isTablet) {
  // Toggle pattern
}
```

---

## Styling

### Color Tokens

```typescript
// Coach-specific colors
const coachColors = {
  panelBg: 'bg-muted/30',
  messageBg: 'bg-primary/5',
  userMessageBg: 'bg-secondary',
  progressActive: 'text-primary',
  progressComplete: 'text-green-500',
  progressPending: 'text-muted-foreground',
};
```

### Animation

```typescript
// Panel slide-in
const panelVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 20 } },
};

// Message appear
const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};
```

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| No active session | Show "Start Validation" CTA |
| Coach panel closed | Show floating button to reopen |
| Long message | Auto-scroll to bottom |
| Network error | Show retry button in chat |
| Empty suggested actions | Hide QuickActions component |
| Mobile keyboard open | Adjust layout to keep input visible |

---

## Accessibility

- [ ] Coach panel announced by screen reader when opened
- [ ] Messages have proper ARIA roles
- [ ] Quick actions are keyboard navigable
- [ ] Focus trapped in panel when open on mobile
- [ ] Color contrast meets WCAG AA

---

## Security Checklist

- [ ] No sensitive data in localStorage
- [ ] Messages sanitized before render
- [ ] API calls authenticated

---

## Testing Requirements

| Type | Coverage |
|------|----------|
| Unit | Component rendering, props |
| Integration | Hook + API calls |
| E2E | Full conversation flow |

### Test Cases

- [ ] 3-panel renders correctly on desktop
- [ ] Coach panel collapses/expands
- [ ] Messages display in order
- [ ] Quick actions trigger send
- [ ] Responsive breakpoints work
- [ ] Loading states shown

---

## Verification

```bash
npm run lint
npm run typecheck
npm run build

# Manual testing
- Desktop: 3 panels visible
- Tablet: drawer behavior
- Mobile: toggle behavior
- Send message, see response
- Click quick action
- Collapse/expand panel
```

---

## Codebase References

| Pattern | Reference |
|---------|-----------|
| Layout patterns | `src/components/layout/DashboardLayout.tsx` |
| Card components | `src/components/ui/card.tsx` |
| Animation | Existing framer-motion usage |
| Hooks | `src/hooks/useValidation.ts` |

---

## Design Document

See: `/tasks/plan/2026-02-04-startup-coach-design.md`
