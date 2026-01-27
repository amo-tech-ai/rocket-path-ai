# Pitch Deck System — Prompts Index

> **Version:** 2.0 | **Date:** January 27, 2026  
> **Status:** Core Phase — Production Implementation  
> **Task:** MVP-03 — Generation Wizard UI

---

## Prompt Files

| File | Phase | Category | Priority | Status | Purpose |
|------|-------|----------|----------|--------|---------|
| **00-schema.md** | 0: Foundation | Database | P0 | ✅ Done | Database schema verified |
| **01-foundation.md** | 0: Foundation | Architecture | P0 | ✅ Done | Core architecture, layout, essential structure |
| **02-core.md** | 1: MVP | Workflows | P0 | ✅ Ready | Essential features, workflows, user interactions |
| **03-mvp.md** | 1: MVP | Frontend | P0 | 🚧 In Progress | Generation Wizard UI (4-step wizard) |
| **04-edge-functions.md** | 1: MVP | Backend | P0 | 🚧 In Progress | Supabase Edge Functions specifications |

---

## Implementation Status

### Database Schema ✅
- `pitch_decks` table with `metadata` JSONB column
- `pitch_deck_slides` table with `content` JSONB column
- `pitch_deck_status` enum (draft, in_progress, generating, review, final, archived)
- `slide_type` enum (title, problem, solution, market, etc.)

### Edge Functions 🚧
- `pitch-deck-agent` — 7 actions for wizard operations

### Frontend Components 🚧
- 4-step wizard UI
- AI assistant panel
- Signal strength calculation

---

## File Structure

```
src/
├── pages/
│   └── PitchDeckWizard.tsx          # Main wizard page
├── components/pitchdeck/
│   ├── wizard/
│   │   ├── WizardLayout.tsx          # 3-panel layout
│   │   ├── WizardStepper.tsx         # Left panel stepper
│   │   ├── WizardStep1.tsx           # Startup Info
│   │   ├── WizardStep2.tsx           # Market & Traction
│   │   ├── WizardStep3.tsx           # Smart Interview
│   │   ├── WizardStep4.tsx           # Review & Generate
│   │   └── WizardAIPanel.tsx         # Right panel AI assistant
│   └── shared/
│       ├── SignalStrength.tsx        # Signal strength display
│       └── IndustrySelector.tsx      # Industry tiles
├── hooks/
│   └── usePitchDeckWizard.ts         # Wizard state management
└── lib/
    └── pitchDeckSchema.ts            # Zod validation schemas
    
supabase/functions/
└── pitch-deck-agent/
    └── index.ts                       # Edge function
```

---

## Quick Start

1. Navigate to `/app/pitch-deck/new` to start wizard
2. Complete 4 steps: Startup Info → Market & Traction → Smart Interview → Review & Generate
3. Click "Generate Deck" to create AI-powered pitch deck
4. View and edit deck at `/app/pitch-deck/:id/edit`
