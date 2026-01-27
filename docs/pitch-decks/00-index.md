# Pitch Deck System — Master Index & Progress Tracker

> **Version:** 2.1 | **Date:** January 27, 2026  
> **Status:** Core Phase — Production Implementation  
> **Task:** MVP-03 — Generation Wizard UI  
> **Overall Progress:** 72%

---

## 🔴 CRITICAL ISSUES (Fix Immediately)

| # | Issue | File | Impact | Status |
|---|-------|------|--------|--------|
| 1 | No Gemini AI integration | `pitch-deck-agent/index.ts` | Generation uses static templates | 🟡 **PARTIAL** |
| 2 | No Smart Interviewer AI | `generate_interview_questions` | Static question packs only | 🟡 **PARTIAL** |
| 3 | No Deck Editor screen | Post-MVP | Cannot edit generated decks | 🔴 **NOT STARTED** |

---

## Executive Summary

| Category | Status | Progress | Verified | Critical Issues |
|----------|--------|----------|----------|-----------------|
| Database Schema | 🟢 Completed | 100% | ✅ | None |
| Edge Function (pitch-deck-agent) | 🟡 Partial | 75% | ⚠️ | No real AI generation |
| 4-Step Wizard UI | 🟢 Completed | 95% | ✅ | Minor polish needed |
| Signal Strength Calculation | 🟢 Completed | 100% | ✅ | None |
| Auto-save & Persistence | 🟢 Completed | 100% | ✅ | None |
| Interview Question Generation | 🟡 Partial | 60% | ⚠️ | Static fallback only |
| Deck Generation | 🟡 Partial | 50% | ⚠️ | Template-based, no AI |
| Deck Editor | 🔴 Not Started | 0% | ❌ | Post-MVP |
| Pitch Deck Dashboard | 🔴 Not Started | 0% | ❌ | Post-MVP |
| Export (PDF/PPTX) | 🔴 Not Started | 0% | ❌ | Post-MVP |

---

## Documentation Files

| File | Phase | Category | Priority | Status | Purpose |
|------|-------|----------|----------|--------|---------|
| **00-index.md** | — | Reference | P0 | 📋 | Master index & progress tracker |
| **01-foundation.md** | 0: Foundation | Architecture | P0 | ✅ Done | Core architecture, layout, essential structure |
| **02-core.md** | 1: Core | Workflows | P0 | ✅ Done | Essential workflows, AI behaviors |
| **03-mvp.md** | 1: MVP | Frontend | P0 | 🟡 In Progress | 4-step wizard UI specifications |
| **04-edge-functions.md** | 1: MVP | Backend | P0 | 🟡 In Progress | Edge function specifications |
| **05-deck-editor.md** | 2: Post-MVP | Frontend | P1 | 🔴 Not Started | 3-panel deck editor |
| **06-dashboard.md** | 2: Post-MVP | Frontend | P1 | 🔴 Not Started | Deck listing & management |
| **07-ai-integration.md** | 1: MVP | AI | P0 | 🟡 In Progress | AI agent specifications |
| **09-industry-logic.md** | 1: MVP | Logic | P0 | ✅ Done | Industry conditional logic |
| **11-industry-strategy.md** | 1: MVP | Content | P0 | ✅ Done | Question packs & playbooks |

---

## Implementation Progress Tracker

### Phase 0: Foundation ✅

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|------|-------------|--------|---|--------------|---------------------|-----------------|
| Database Schema | pitch_decks, pitch_deck_slides tables | 🟢 Completed | 100% | Tables exist with RLS | — | None |
| JSONB Structures | metadata.wizard_data schema | 🟢 Completed | 100% | Schema defined | — | None |
| Zod Schemas | Frontend validation schemas | 🟢 Completed | 100% | `pitchDeckSchema.ts` | — | None |
| Route Configuration | /app/pitch-deck routes | 🟢 Completed | 100% | Routes in App.tsx | — | None |

### Phase 1: Core MVP 🟡

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|------|-------------|--------|---|--------------|---------------------|-----------------|
| **Wizard Layout** | 3-panel layout | 🟢 Completed | 100% | WizardLayout.tsx | — | None |
| **WizardStepper** | Left panel navigation | 🟢 Completed | 100% | WizardStepper.tsx | — | None |
| **WizardAIPanel** | Right panel AI tips | 🟢 Completed | 100% | WizardAIPanel.tsx | — | None |
| **Step 1: Startup Info** | Form with validation | 🟢 Completed | 100% | Industry tiles, stages | — | None |
| **Step 2: Market & Traction** | Problem/solution form | 🟢 Completed | 100% | All fields work | — | None |
| **Step 3: Smart Interview** | Dynamic questions | 🟡 Partial | 70% | Question cards work | No real AI questions | Add Gemini Search |
| **Step 4: Review & Generate** | Summary + generate | 🟢 Completed | 95% | Checklist, gaps analysis | — | None |
| **usePitchDeckWizard Hook** | State management | 🟢 Completed | 100% | All actions work | — | None |
| **Auto-save** | Database persistence | 🟢 Completed | 100% | Saves on step change | — | None |
| **Signal Strength** | Quality calculation | 🟢 Completed | 100% | Formula implemented | — | None |

### Phase 1: Edge Functions 🟡

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|------|-------------|--------|---|--------------|---------------------|-----------------|
| **save_wizard_step** | Save step to JSONB | 🟢 Completed | 100% | Creates/updates deck | — | None |
| **resume_wizard** | Load wizard data | 🟢 Completed | 100% | Returns wizard_data | — | None |
| **generate_interview_questions** | AI questions | 🟡 Partial | 60% | Returns static packs | No Gemini + Search | Add Gemini Flash |
| **generate_deck** | AI deck generation | 🟡 Partial | 50% | Creates slides | Template-based only | Add Gemini Pro |
| **get_deck** | Fetch deck + slides | 🟢 Completed | 100% | Returns full deck | — | None |
| **get_signal_strength** | Calculate score | 🟢 Completed | 100% | Returns breakdown | — | None |
| **update_slide** | Update slide content | 🔴 Not Started | 0% | — | Not implemented | Implement for editor |

### Phase 2: Post-MVP 🔴

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|------|-------------|--------|---|--------------|---------------------|-----------------|
| **Deck Editor** | 3-panel slide editor | 🔴 Not Started | 0% | — | No implementation | Design & build |
| **Slide Outline** | Left panel navigation | 🔴 Not Started | 0% | — | — | Part of editor |
| **Rich Text Editor** | Slide content editing | 🔴 Not Started | 0% | — | — | Part of editor |
| **AI Copilot (6 agents)** | Clarity, Impact, etc. | 🔴 Not Started | 0% | — | — | Post-MVP |
| **Slide Analysis** | Quality scoring | 🔴 Not Started | 0% | — | — | Post-MVP |
| **Image Generation** | AI slide images | 🔴 Not Started | 0% | — | — | Post-MVP |
| **Pitch Deck Dashboard** | Deck listing | 🔴 Not Started | 0% | — | — | Post-MVP |
| **Export PDF** | Download as PDF | 🔴 Not Started | 0% | — | — | Post-MVP |
| **Export PPTX** | Download as PowerPoint | 🔴 Not Started | 0% | — | — | Post-MVP |
| **Shareable Link** | Public deck URL | 🔴 Not Started | 0% | — | — | Post-MVP |

---

## File Structure

```
src/
├── pages/
│   └── PitchDeckWizard.tsx          ✅ Complete
├── components/pitchdeck/
│   ├── wizard/
│   │   ├── index.ts                  ✅ Complete
│   │   ├── WizardLayout.tsx          ✅ Complete
│   │   ├── WizardStepper.tsx         ✅ Complete
│   │   ├── WizardStep1.tsx           ✅ Complete
│   │   ├── WizardStep2.tsx           ✅ Complete
│   │   ├── WizardStep3.tsx           ✅ Complete
│   │   ├── WizardStep4.tsx           ✅ Complete
│   │   └── WizardAIPanel.tsx         ✅ Complete
│   ├── editor/                       🔴 Not Started
│   └── shared/                       🔴 Not Started
├── hooks/
│   └── usePitchDeckWizard.ts         ✅ Complete
└── lib/
    └── pitchDeckSchema.ts            ✅ Complete
    
supabase/functions/
└── pitch-deck-agent/
    └── index.ts                      🟡 Partial (no real AI)
    
docs/pitch-decks/
├── 00-index.md                       📋 This file
├── 01-foundation.md                  ✅ Complete
├── 02-core.md                        ✅ Complete
├── 03-mvp.md                         ✅ Complete
├── 04-edge-functions.md              ✅ Complete
├── 05-deck-editor.md                 ✅ Complete (spec)
├── 06-dashboard.md                   ✅ Complete (spec)
├── 07-ai-integration.md              ✅ Complete (spec)
├── 09-industry-logic.md              ✅ Complete
└── 11-industry-strategy.md           ✅ Complete
```

---

## MVP Success Criteria

| Criteria | Status | Evidence |
|----------|--------|----------|
| ✅ All 4 wizard steps implemented | ✅ | WizardStep1-4.tsx exist |
| ✅ Wizard data saves to JSONB | ✅ | save_wizard_step works |
| ✅ Industry selection triggers conditional questions | 🟡 | Static packs, no AI |
| ✅ Signal strength calculates correctly | ✅ | calculateSignalStrength() |
| 🟡 Deck generation completes | 🟡 | Template-based, no AI |
| ✅ Slides save incrementally | ✅ | pitch_deck_slides populated |
| ✅ Error handling works | ✅ | Toast notifications |
| ✅ Auto-save works | ✅ | Database persistence |
| ✅ Resume wizard works | ✅ | resume_wizard action |
| ✅ All validation rules enforced | ✅ | Zod schemas |

---

## Priority Next Steps

| Priority | Task | Impact | Effort | Target |
|----------|------|--------|--------|--------|
| P0 | Add Gemini 3 Pro to `generate_deck` | Real AI-generated decks | 4h | Core MVP |
| P0 | Add Gemini Flash to `generate_interview_questions` | Dynamic industry questions | 2h | Core MVP |
| P1 | Implement `update_slide` action | Enable editing | 1h | MVP |
| P2 | Build Deck Editor skeleton | 3-panel layout for editing | 8h | Post-MVP |
| P2 | Build Pitch Deck Dashboard | Deck listing & filtering | 6h | Post-MVP |
| P3 | Add Export functionality | PDF/PPTX download | 4h | Post-MVP |

---

## Quick Start

1. Navigate to `/app/pitch-deck/new` to start wizard
2. Complete 4 steps: Startup Info → Market & Traction → Smart Interview → Review & Generate
3. Click "Generate Deck" to create pitch deck
4. View generated deck at `/app/pitch-deck/:id/edit` (Post-MVP)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          PITCH DECK SYSTEM                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐   ┌───────────────┐   ┌──────────────────────────┐   │
│  │   FRONTEND   │   │   SUPABASE    │   │      EDGE FUNCTIONS      │   │
│  │              │   │               │   │                          │   │
│  │ WizardStep1  │──▶│ pitch_decks   │◀──│ save_wizard_step ✅      │   │
│  │ WizardStep2  │   │ (metadata)    │   │ resume_wizard ✅         │   │
│  │ WizardStep3  │   │               │   │ generate_interview 🟡    │   │
│  │ WizardStep4  │   │ pitch_deck_   │   │ generate_deck 🟡         │   │
│  │              │   │ slides        │   │ get_deck ✅              │   │
│  │ usePitchDeck │   │ (content)     │   │ get_signal_strength ✅   │   │
│  │ Wizard ✅    │   │               │   │ update_slide 🔴          │   │
│  └──────────────┘   └───────────────┘   └──────────────────────────┘   │
│         │                                          │                     │
│         │                                          │                     │
│         │           ┌──────────────┐               │                     │
│         └──────────▶│   GEMINI AI  │◀──────────────┘                     │
│                     │              │                                      │
│                     │ Flash (Q&A)  │ 🟡 Not Connected                     │
│                     │ Pro (Gen)    │ 🟡 Not Connected                     │
│                     │ Pro Image    │ 🔴 Not Started                       │
│                     └──────────────┘                                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

Legend: ✅ Implemented  🟡 Partial  🔴 Not Started
```

---

**Last Updated:** January 27, 2026  
**Maintainer:** AI Systems Architect
