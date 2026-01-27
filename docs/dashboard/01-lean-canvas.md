# Lean Canvas — Technical Specification

> **Version:** 1.0 | **Date:** January 27, 2026  
> **Status:** 🟡 Core MVP Complete  
> **Enhancement Progress:** 0/12 steps

---

## Table of Contents

1. [Current Architecture](#current-architecture)
2. [Data Structures](#data-structures)
3. [Edge Function Specification](#edge-function-specification)
4. [Enhancement Steps](#enhancement-steps)
5. [UI Components](#ui-components)
6. [Implementation Checklist](#implementation-checklist)

---

## Current Architecture

### Overview

The Lean Canvas module provides founders with an interactive business model canvas based on the Lean Canvas framework (9 boxes). It integrates with the AI system for content generation and validation.

```
┌─────────────────────────────────────────────────────────────┐
│                     LeanCanvas.tsx                          │
│  ┌─────────────┬────────────────────────┬────────────────┐  │
│  │   Header    │     Canvas Grid        │   AI Panel     │  │
│  │  ─────────  │    ┌───┬───┬───┬───┬───┐  ─────────────  │  │
│  │  Autosave   │    │ P │ S │ U │ U │ C │  Status Card   │  │
│  │  Export ▼   │    │ R │ O │ V │ A │ S │  ─────────────  │  │
│  │  History    │    │ O │ L │ P │   │   │  AI Actions    │  │
│  │             │    ├───┴───┼───┴───┴───┤  Pre-fill      │  │
│  │             │    │ K M   │ Channels  │  Validate      │  │
│  │             │    ├───────┴───────────┤  ─────────────  │  │
│  │             │    │ Cost    │ Revenue │  Tips Card     │  │
│  │             │    └─────────┴─────────┘                │  │
│  └─────────────┴────────────────────────┴────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Key Files

| File | Purpose | Lines |
|------|---------|-------|
| `src/pages/LeanCanvas.tsx` | Main page with DashboardLayout wrapper | ~300 |
| `src/components/leancanvas/LeanCanvasGrid.tsx` | 9-box responsive grid | ~105 |
| `src/components/leancanvas/CanvasBox.tsx` | Individual box with editing | ~194 |
| `src/components/leancanvas/CanvasAIPanel.tsx` | AI sidebar panel | ~283 |
| `src/components/leancanvas/BoxSuggestionPopover.tsx` | Per-box AI suggestions | — |
| `src/components/leancanvas/AutosaveIndicator.tsx` | Save status indicator | — |
| `src/hooks/useLeanCanvas.ts` | Data fetching and mutations | ~144 |
| `src/hooks/useCanvasAutosave.ts` | Debounced autosave state machine | ~123 |
| `src/lib/canvasExport.ts` | PDF/PNG export utilities | ~124 |

### Data Flow

```
User Edits → handleBoxUpdate() → setCanvasData() → autosave.markDirty()
                                                          ↓
                                            (2s debounce)
                                                          ↓
                                            performSave() → useSaveLeanCanvas.mutateAsync()
                                                          ↓
                                            Supabase documents table
```

---

## Data Structures

### LeanCanvasData (TypeScript)

```typescript
interface LeanCanvasBox {
  items: string[];
  validation?: 'valid' | 'warning' | 'error';
  validationMessage?: string;
  // Future additions:
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  source?: 'profile' | 'ai' | 'manual' | 'gap_answers';
}

interface LeanCanvasData {
  problem: LeanCanvasBox;
  solution: LeanCanvasBox;
  uniqueValueProp: LeanCanvasBox;
  unfairAdvantage: LeanCanvasBox;
  customerSegments: LeanCanvasBox;
  keyMetrics: LeanCanvasBox;
  channels: LeanCanvasBox;
  costStructure: LeanCanvasBox;
  revenueStreams: LeanCanvasBox;
}
```

### Database Schema

```sql
-- Canvas stored in documents table
documents (
  id UUID PRIMARY KEY,
  startup_id UUID REFERENCES startups(id),
  type TEXT DEFAULT 'lean_canvas',
  title TEXT,
  content_json JSONB,              -- LeanCanvasData
  metadata JSONB,                   -- confidence, benchmarks, validation results
  status TEXT DEFAULT 'draft',
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Version history
document_versions (
  id UUID PRIMARY KEY,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  version_number INTEGER,           -- Auto-incremented per document
  content_json JSONB,               -- Snapshot of canvas
  metadata JSONB,                   -- Snapshot of metadata
  label TEXT,                       -- Optional user label
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ
)
```

### Canvas Box Configuration

```typescript
const CANVAS_BOX_CONFIG = [
  { key: 'problem', title: 'Problem', row: 1, col: 1, 
    description: 'Top 3 customer problems',
    placeholder: 'e.g., Freelancers waste 8+ hours/month on bookkeeping' },
  { key: 'solution', title: 'Solution', row: 1, col: 2,
    description: 'Key features that solve problems' },
  { key: 'uniqueValueProp', title: 'Unique Value Proposition', row: 1, col: 3,
    description: 'Single compelling message' },
  { key: 'unfairAdvantage', title: 'Unfair Advantage', row: 1, col: 4,
    description: "What can't be easily copied" },
  { key: 'customerSegments', title: 'Customer Segments', row: 1, col: 5,
    description: 'Target customers and users' },
  { key: 'keyMetrics', title: 'Key Metrics', row: 2, col: 1,
    description: 'Numbers that matter' },
  { key: 'channels', title: 'Channels', row: 2, col: 2,
    description: 'Path to customers' },
  { key: 'costStructure', title: 'Cost Structure', row: 3, col: 'left',
    description: 'Fixed and variable costs' },
  { key: 'revenueStreams', title: 'Revenue Streams', row: 3, col: 'right',
    description: 'Sources of revenue' },
];
```

---

## Edge Function Specification

### Actions Overview

The `lean-canvas-agent` edge function will support these actions:

| Action | Input | Output | AI Model |
|--------|-------|--------|----------|
| `map_profile` | `startup_id` | `LeanCanvasData` + coverage levels | — (no AI) |
| `prefill_canvas` | `startup_id`, `gap_answers?` | `LeanCanvasData` + confidence | Gemini Flash |
| `suggest_box` | `startup_id`, `box_key`, `canvas_data` | 3-4 suggestions | Gemini Flash |
| `validate_canvas` | `startup_id`, `canvas_data` | Risk levels + experiments | Gemini Pro |
| `save_version` | `document_id`, `label?` | `document_version` record | — |
| `load_versions` | `document_id` | Array of versions | — |
| `restore_version` | `document_id`, `version_id` | Success + new version | — |
| `check_profile_sync` | `startup_id`, `document_id` | Changes diff | — |
| `canvas_to_pitch` | `startup_id`, `canvas_data` | Pitch deck slides | Gemini Pro |
| `generate_competitor_canvas` | `competitor_name`, `url?` | Estimated canvas | Gemini Pro + Search |
| `get_benchmarks` | `industry`, `stage` | Benchmark data | Industry Packs / Gemini |
| `suggest_pivots` | `startup_id`, `canvas_data` | 2-3 pivot options | Gemini Pro |

### Profile Mapping Rules (LC-01)

| Startup Field | → | Canvas Box | Coverage Logic |
|---------------|---|------------|----------------|
| `description` | → | Problem, Solution | HIGH if >100 chars |
| `tagline` | → | Unique Value Proposition | HIGH if exists |
| `industry` + `target_market` | → | Customer Segments | HIGH if both exist |
| `traction_data` (JSONB) | → | Key Metrics | HIGH if has numbers |
| `business_model` (array) | → | Revenue Streams | MODERATE if exists |
| `competitors` (array) | → | Unfair Advantage | MODERATE (infer differentiation) |
| `marketing_channels` | → | Channels | MODERATE if exists |
| `stage` | → | Cost Structure | LOW (infer burn from stage) |

### Confidence Scoring (LC-03)

```typescript
type Confidence = 'HIGH' | 'MEDIUM' | 'LOW';

// Rules:
// HIGH: Based on explicit profile data or user-provided gap answers
// MEDIUM: Inferred from related fields or context
// LOW: AI-generated with minimal supporting data
```

### Enhanced Validation Response (LC-05)

```typescript
interface ValidationResult {
  box: string;
  score: number;          // 1-10
  feedback: string;
  risk_level: 'critical' | 'moderate' | 'low';
  risk_reason: string;
  experiment: string;     // Concrete next step
}

interface ValidationResponse {
  overall_score: number;  // 0-100
  results: ValidationResult[];
  top_risks: ValidationResult[]; // Top 2-3 critical items
}
```

---

## Enhancement Steps

### Step 1: Profile Mapper (LC-01)

**Goal:** Auto-populate canvas from startup profile on first visit.

**Implementation:**
1. Add `map_profile` action to edge function
2. Query `startups` table for profile fields
3. Map fields to canvas boxes with coverage levels
4. Show banner in `LeanCanvas.tsx` when canvas is empty
5. Apply/Dismiss buttons to accept mapping

**Banner UI:**
```tsx
<motion.div className="bg-warm border-l-4 border-sage p-4 rounded-lg flex items-center gap-4">
  <Sparkles className="w-5 h-5 text-sage" />
  <div className="flex-1">
    <p className="font-medium">We mapped your startup profile to the canvas</p>
    <p className="text-sm text-muted-foreground">Review the pre-filled content below and edit as needed.</p>
  </div>
  <Button variant="sage" size="sm">Apply All</Button>
  <Button variant="ghost" size="sm">Dismiss</Button>
</motion.div>
```

---

### Step 2: Gap Questions (LC-02)

**Goal:** Collect targeted answers for empty/low-coverage boxes.

**Question Bank:**
| Box | Question |
|-----|----------|
| Problem | "What are the top 3 frustrations your customers face today?" |
| Solution | "How does your product solve these problems differently?" |
| UVP | "In one sentence, why should customers choose you over alternatives?" |
| Customer Segments | "Who is your ideal customer? (role, company size, industry)" |
| Key Metrics | "What numbers would prove your business is working?" |
| Channels | "How will customers first hear about you?" |
| Cost Structure | "What are your biggest monthly expenses?" |
| Revenue Streams | "How do you make money? (subscription, transaction, freemium)" |
| Unfair Advantage | "What do you have that competitors cannot easily copy?" |

**Component:** `GapQuestionsFlow.tsx`
- Modal with step-through questions
- Only shows questions for LOW/empty boxes
- Skip button available
- Answers passed to enhanced generation

---

### Step 3: Enhanced Generation (LC-03)

**Goal:** Use profile + gap answers + confidence scoring.

**Changes to `prefill_canvas`:**
- Accept optional `gap_answers: Record<string, string>`
- Include both profile and answers in AI prompt
- Return confidence per box
- Store confidence in `documents.metadata`

---

### Step 4: Confidence UI (LC-04)

**Goal:** Visual indicators showing data quality per box.

**Badge Design:**
- 8px colored circle in top-right of each box
- GREEN = HIGH confidence (tooltip: "Strong — based on your data")
- YELLOW = MEDIUM confidence (tooltip: "Review — inferred from context")
- RED = LOW confidence (tooltip: "Needs work — AI estimated")

**AI Panel Addition:**
- "Canvas Confidence: 72%" summary
- Stacked bar showing distribution
- Confidence auto-updates when user adds content

---

### Step 5: Enhanced Validator (LC-05)

**Goal:** Actionable validation with risk levels and experiments.

**New Response Fields:**
- `risk_level`: critical | moderate | low
- `risk_reason`: One sentence explanation
- `experiment`: Concrete next step to test

**UI Changes:**
- Sort results by risk level (critical first)
- Show "Top Risks" summary card
- Include experiment suggestions
- Persist to `documents.metadata.validation`

---

### Step 6: Version History (LC-06)

**Goal:** Save and restore canvas snapshots.

**Auto-save Triggers:**
- Manual "Save Version" button
- Before AI pre-fill
- Before applying pivot

**Component:** `VersionHistoryPanel.tsx`
- Slide-out panel from right
- List versions with timestamp, label, confidence
- Preview and restore functionality
- Label editing

---

### Step 7: Profile Sync (LC-07)

**Goal:** Detect profile changes and suggest canvas updates.

**Implementation:**
- Store `profile_snapshot_hash` in metadata
- Compare on page load
- Show sync banner if changed
- Diff view showing old → new values
- Apply changes per field or all at once

---

### Step 8: Canvas to Pitch Deck (LC-08)

**Goal:** Map canvas boxes to pitch deck slides.

**Mapping:**
| Canvas Box | → | Pitch Slide |
|------------|---|-------------|
| Problem | → | Slide 2: Problem |
| Solution | → | Slide 3: Solution |
| UVP | → | Slide 1: Title (tagline) |
| Customer Segments | → | Slide 5: Market |
| Key Metrics | → | Slide 6: Traction |
| Revenue Streams | → | Slide 7: Business Model |
| Channels | → | Slide 8: Go-to-Market |
| Cost Structure | → | Slide 9: Financials |
| Unfair Advantage | → | Slide 4: Competition |

**Button:** "Generate Pitch Deck from Canvas" (enabled at 70%+ completion)

---

### Step 9: Competitor Canvas (LC-09)

**Goal:** Generate estimated competitor canvas for comparison.

**Implementation:**
- Use Gemini Pro + Google Search grounding
- Research competitor from name/URL
- Generate 9-box canvas with "Estimated" badge
- Side-by-side comparison view
- Highlight advantages/weaknesses

---

### Step 10: Industry Benchmarks (LC-10)

**Goal:** Show contextual benchmarks next to canvas boxes.

**Data Source:** `industry_packs` table (5 active packs)

**Benchmark Boxes:** Key Metrics, Revenue Streams, Cost Structure, Customer Segments, Channels

**UI:** Small chart icon → expandable tooltip with benchmark + your position

---

### Step 11: Pivot Suggestions (LC-11)

**Goal:** AI-recommended business model changes when validation fails.

**Triggers:**
- Overall score < 50
- 2+ boxes score < 4/10
- Critical box (Problem, Solution, Customer Segments) < 5

**Pivot Types:** customer | problem | channel | revenue | technology

---

### Step 12: Team Collaboration (LC-12)

**Goal:** Real-time multi-user editing.

**Technology:** Supabase Realtime + Presence

**Features:**
- Presence bar showing online users
- Box-level locking indicators
- Live content updates
- Conflict resolution (merge items)

---

## UI Components

### New Components Needed

| Component | Purpose | Priority |
|-----------|---------|----------|
| `ProfileMappingBanner.tsx` | First-visit profile mapping | P0 |
| `GapQuestionsFlow.tsx` | Modal questionnaire | P0 |
| `ConfidenceBadge.tsx` | Box confidence indicator | P0 |
| `ConfidenceSummary.tsx` | AI panel summary | P0 |
| `ValidationResults.tsx` | Enhanced validation display | P1 |
| `VersionHistoryPanel.tsx` | Version list + restore | P1 |
| `ProfileSyncBanner.tsx` | Profile change detection | P2 |
| `CompetitorComparison.tsx` | Side-by-side view | P2 |
| `BenchmarkTooltip.tsx` | Industry benchmark display | P2 |
| `PivotSuggestions.tsx` | Pivot cards | P3 |
| `PresenceIndicator.tsx` | Team collaboration | P3 |

---

## Implementation Checklist

### Phase 1: Foundation

- [ ] Create `lean-canvas-agent` edge function structure
- [ ] Implement `map_profile` action
- [ ] Implement `prefill_canvas` with confidence
- [ ] Implement `suggest_box` action
- [ ] Implement `validate_canvas` with experiments

### Phase 2: Frontend - Core

- [ ] Create `ProfileMappingBanner.tsx`
- [ ] Create `GapQuestionsFlow.tsx`
- [ ] Add confidence badges to `CanvasBox.tsx`
- [ ] Add confidence summary to `CanvasAIPanel.tsx`
- [ ] Enhance validation results display

### Phase 3: Version History

- [ ] Implement `save_version` action
- [ ] Implement `load_versions` action
- [ ] Implement `restore_version` action
- [ ] Create `VersionHistoryPanel.tsx`
- [ ] Enable "Versions" button in header

### Phase 4: Intelligence

- [ ] Implement `canvas_to_pitch` action
- [ ] Add pitch deck generation button
- [ ] Implement `get_benchmarks` action
- [ ] Create `BenchmarkTooltip.tsx`
- [ ] Implement `generate_competitor_canvas` action
- [ ] Create `CompetitorComparison.tsx`

### Phase 5: Advanced

- [ ] Implement `suggest_pivots` action
- [ ] Create `PivotSuggestions.tsx`
- [ ] Implement profile sync detection
- [ ] Create `ProfileSyncBanner.tsx`
- [ ] Add Supabase Realtime subscription
- [ ] Create `PresenceIndicator.tsx`

---

**Last Updated:** January 27, 2026  
**Maintainer:** AI Systems Architect
