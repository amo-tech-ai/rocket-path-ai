# Dashboard Modules — Master Index & Progress Tracker

> **Version:** 1.0 | **Date:** January 27, 2026  
> **Status:** 🟡 In Progress  
> **Overall Progress:** 35%

---

## Executive Summary

| Module | Status | Progress | Priority | Notes |
|--------|--------|----------|----------|-------|
| **Lean Canvas** | 🟡 Core MVP | 35% | P0 | AI pre-fill + validation working |
| Main Dashboard | 🟢 Complete | 100% | P0 | Metrics + guidance done |
| Tasks Kanban | 🟢 Complete | 100% | P0 | CRUD + drag-drop done |
| Projects | 🟢 Complete | 100% | P0 | Full CRUD working |
| Investors CRM | 🟢 Complete | 100% | P1 | Pipeline + tracking done |
| Documents | 🟢 Complete | 100% | P1 | Upload + AI generation |
| Events | 🟢 Complete | 100% | P2 | Directory + wizard done |
| Pitch Decks | 🟢 Complete | 100% | P0 | Wizard + editor done |

---

## Lean Canvas Enhancement Roadmap

Based on comprehensive design specifications, the Lean Canvas module has a 12-step enhancement plan across 4 phases.

### Phase 1: Smart Onboarding (Steps 1-4)

| Step | Feature | Status | Priority | Description |
|------|---------|--------|----------|-------------|
| LC-01 | Profile Mapper | 🔴 Not Started | P0 | Auto-map startup profile to 9 boxes |
| LC-02 | Gap Questions | 🔴 Not Started | P0 | Targeted questions for empty boxes |
| LC-03 | Enhanced Generation | 🔴 Not Started | P0 | Profile + answers + confidence |
| LC-04 | Confidence UI | 🔴 Not Started | P0 | Visual badges on boxes |

### Phase 2: Validation & History (Steps 5-7)

| Step | Feature | Status | Priority | Description |
|------|---------|--------|----------|-------------|
| LC-05 | Enhanced Validator | 🔴 Not Started | P1 | Risk levels + experiments |
| LC-06 | Version History | 🔴 Not Started | P1 | Snapshots + restore |
| LC-07 | Profile Sync | 🔴 Not Started | P2 | Detect profile changes |

### Phase 3: Intelligence (Steps 8-11)

| Step | Feature | Status | Priority | Description |
|------|---------|--------|----------|-------------|
| LC-08 | Canvas → Pitch Deck | 🔴 Not Started | P1 | Map to 10-slide deck |
| LC-09 | Competitor Canvas | 🔴 Not Started | P2 | Side-by-side comparison |
| LC-10 | Industry Benchmarks | 🔴 Not Started | P2 | Real-time benchmarks |
| LC-11 | Pivot Suggestions | 🔴 Not Started | P3 | AI-powered pivots |

### Phase 4: Collaboration (Step 12)

| Step | Feature | Status | Priority | Description |
|------|---------|--------|----------|-------------|
| LC-12 | Team Collaboration | 🔴 Not Started | P3 | Real-time editing |

---

## Documentation Files

| File | Module | Status | Purpose |
|------|--------|--------|---------|
| **00-index.md** | — | ✅ | Master index & tracker |
| **01-lean-canvas.md** | Lean Canvas | ✅ | Architecture + roadmap |
| 02-main-dashboard.md | Dashboard | — | Widget specs |
| 03-tasks-kanban.md | Tasks | — | Kanban architecture |
| 04-pitch-decks.md | Pitch Decks | → See `/docs/pitch-decks/` | |

---

## Current Implementation Status

### ✅ Working Features (Lean Canvas)

1. **9-Box Grid** — Responsive layout with Framer Motion animations
2. **Editable Boxes** — Add/remove bullet items with validation indicators
3. **AI Pre-fill** — Generate content from startup profile via `ai-chat` edge function
4. **AI Validation** — Analyze hypotheses for weak assumptions
5. **Per-box AI Suggestions** — Sparkle button with BoxSuggestionPopover
6. **Autosave** — 2-second debounced save with status indicator
7. **Export** — PDF and PNG via `jspdf` + `html2canvas`

### 🔴 Missing Features (Lean Canvas)

1. **Dedicated Edge Function** — Currently uses generic `ai-chat`, needs `lean-canvas-agent`
2. **Profile Mapping** — Automatic mapping from startup profile
3. **Gap Questions** — Targeted questionnaire for empty boxes
4. **Confidence Scores** — Visual indicators on AI-generated content
5. **Enhanced Validation** — Risk levels, experiments, sorted results
6. **Version History** — Snapshots and restore functionality
7. **Profile Sync** — Detect and apply profile changes
8. **Pitch Deck Integration** — Canvas → deck mapping
9. **Competitor Comparison** — Side-by-side analysis
10. **Industry Benchmarks** — Contextual benchmark tooltips
11. **Pivot Suggestions** — AI-recommended business model changes
12. **Real-time Collaboration** — Supabase Realtime + Presence

---

## File Structure

```
src/
├── pages/
│   └── LeanCanvas.tsx              ✅ Complete
├── components/leancanvas/
│   ├── AutosaveIndicator.tsx       ✅ Complete
│   ├── BoxSuggestionPopover.tsx    ✅ Complete
│   ├── CanvasAIPanel.tsx           ✅ Core done, needs enhancement
│   ├── CanvasBox.tsx               ✅ Complete
│   ├── LeanCanvasGrid.tsx          ✅ Complete
│   ├── GapQuestionsFlow.tsx        🔴 Not created
│   ├── VersionHistoryPanel.tsx     🔴 Not created
│   ├── ProfileSyncBanner.tsx       🔴 Not created
│   ├── CompetitorComparison.tsx    🔴 Not created
│   ├── PivotSuggestions.tsx        🔴 Not created
│   └── PresenceIndicator.tsx       🔴 Not created
├── hooks/
│   ├── useLeanCanvas.ts            ✅ Complete
│   └── useCanvasAutosave.ts        ✅ Complete
└── lib/
    └── canvasExport.ts             ✅ Complete
    
supabase/functions/
└── lean-canvas-agent/              🔴 Not created
    ├── index.ts
    └── actions/
        ├── mapping.ts
        ├── generation.ts
        ├── validation.ts
        ├── versions.ts
        ├── benchmarks.ts
        └── pivots.ts
```

---

## Database Dependencies

### Existing Tables (✅ Already Deployed)

| Table | Purpose | Status |
|-------|---------|--------|
| `documents` | Canvas storage with `type='lean_canvas'` | ✅ Has `content_json`, `metadata` columns |
| `document_versions` | Version history storage | ✅ Deployed with trigger + RLS |
| `startups` | Profile data for mapping | ✅ Has all required fields |
| `industry_packs` | Industry benchmarks | ✅ 5 packs (fintech, healthcare, marketplace, saas, generic) |

### No New Migrations Needed

The prompt confirms:
- `documents.metadata` JSONB column exists
- `document_versions` table exists with auto-increment trigger
- Industry packs are populated

---

## Priority Next Steps

| Priority | Task | Effort | Impact |
|----------|------|--------|--------|
| P0 | Create `lean-canvas-agent` edge function | 4h | Enables all AI features |
| P0 | Implement LC-01: Profile Mapper | 2h | First-run experience |
| P0 | Implement LC-02: Gap Questions | 2h | Data collection |
| P0 | Implement LC-03: Enhanced Generation | 2h | Better AI output |
| P0 | Implement LC-04: Confidence UI | 1h | Visual feedback |
| P1 | Implement LC-05: Enhanced Validator | 2h | Actionable insights |
| P1 | Implement LC-06: Version History | 3h | Safety net |

---

## Changelog

| Date | Change | Status |
|------|--------|--------|
| 2026-01-27 | Created master index | ✅ |
| 2026-01-27 | Documented current Lean Canvas state | ✅ |
| 2026-01-27 | Added 12-step enhancement roadmap | ✅ |

---

**Last Updated:** January 27, 2026  
**Maintainer:** AI Systems Architect
