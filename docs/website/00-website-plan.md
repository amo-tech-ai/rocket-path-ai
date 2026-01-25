# Website Implementation Plan

## Overview
Premium scroll-driven "How It Works" section with animated cursor demonstrating AI workflow across 4 product screens.

## Component Architecture
```
src/components/how-it-works/
├── HowItWorksScrollSection.tsx    # Main 400vh section with scroll detection
├── StepList.tsx                   # Left column with 4-step navigation
├── AppWindow.tsx                  # macOS-style window container
├── AnimatedCursor.tsx             # SVG cursor with choreography
├── useCursorAnimation.ts          # Animation hook with sequences
├── cursorSequences.ts             # Animation data per screen
└── screens/
    ├── ProfileScreen.tsx          # Step 1: Startup profile form
    ├── AnalysisScreen.tsx         # Step 2: Readiness score
    ├── PitchDeckScreen.tsx        # Step 3: Deck builder
    └── ExecutionScreen.tsx        # Step 4: Investor CRM
```

## Design Tokens
- **Emerald:** `hsl(var(--sage))` = #0d5f4e
- **Soft grey:** `bg-secondary/30` = #f5f5f3
- **White cards:** `bg-card`
- **Hairline border:** `border-border`

## Implementation Phases

### Phase 1: Layout Foundation
- [x] Create section structure (400vh, sticky left, fixed right)
- [x] Step list with active states
- [x] App window container with header

### Phase 2: Screens (Static)
- [x] ProfileScreen with form fields
- [x] AnalysisScreen with score & gaps
- [x] PitchDeckScreen with slide sidebar
- [x] ExecutionScreen with Kanban pipeline

### Phase 3: Scroll Detection
- [x] IntersectionObserver for step activation
- [x] Scroll position → activeStep mapping
- [x] Screen crossfade transitions

### Phase 4: Cursor Choreography
- [x] AnimatedCursor component (SVG)
- [x] useCursorAnimation hook
- [x] Movement sequences per screen
- [x] Click/drag/hover states

### Phase 5: UI Response States
- [x] Focus rings on inputs
- [x] Button press states
- [x] Card drag shadows
- [x] Column highlights

### Phase 6: Polish
- [x] Mobile responsive (stacked layout)
- [x] prefers-reduced-motion support
- [x] ARIA labels for accessibility
- [x] 60fps performance optimization

## Success Criteria
- ✅ Smooth 60fps scroll-driven experience
- ✅ Cursor demonstrates AI workflow naturally
- ✅ All content visible and readable
- ✅ Mobile-friendly vertical layout
- ✅ Respects motion preferences

## Status: IMPLEMENTING
Last updated: 2026-01-25
