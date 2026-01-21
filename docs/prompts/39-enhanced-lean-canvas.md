# 39. Enhanced Lean Canvas Editor

## Overview

Transform static Lean Canvas display into an interactive, editable business model framework with autosave, AI-powered suggestions, and export capabilities.

## Current State Analysis

### Existing Features ✅
- 9-box Lean Canvas grid layout
- Inline editing per box
- AI pre-fill from profile
- AI hypothesis validation
- Manual save button
- Version display

### Gaps to Address 🔧
- No autosave (changes can be lost)
- Export functionality not implemented
- No version history UI
- No box-level AI suggestions
- No visual progress indicators per box

## Enhanced Features

### 1. Autosave System

**Implementation:**
- Debounced save every 2 seconds after changes
- Visual indicator showing save status (saved, saving, unsaved)
- Conflict resolution for concurrent edits
- Offline queue for network failures

**State Machine:**
```
IDLE → (change) → PENDING → (debounce 2s) → SAVING → (success) → SAVED
                     ↓                          ↓
                  (change)                   (error) → ERROR → (retry) → SAVING
                     ↓
                  PENDING
```

### 2. Export System

**PDF Export:**
- Professional layout with company branding
- All 9 boxes in single-page view
- Company name, date, version number
- Clean typography and spacing

**PNG Export:**
- High-resolution canvas capture
- Transparent or white background option
- Shareable format for presentations

**Implementation:**
- Use `html2canvas` for PNG generation
- Use `jspdf` for PDF generation
- Loading state during export
- Toast notification on completion

### 3. Version History

**Features:**
- List of previous versions with timestamps
- Preview version before restoring
- Restore to any previous version
- Auto-versioning on significant changes

**UI:**
- Slide-out panel or modal
- Version diff highlighting
- "Current" vs "Previous" comparison

### 4. Box-Level AI Suggestions

**Per-Box Enhancement:**
- "Suggest" button on each box when in edit mode
- Context-aware suggestions based on:
  - Startup profile and industry
  - Other filled boxes (cross-reference)
  - Best practices for that canvas section
- Quick-apply or dismiss suggestions

### 5. Visual Progress Indicators

**Per-Box Status:**
- Empty: Gray outline
- In Progress: Yellow dot
- Validated (good): Green checkmark
- Needs Review: Orange warning
- Error: Red alert

**Overall Canvas:**
- Completion percentage in header
- Progress ring visualization
- Celebratory animation at 100%

## AI Agent: CanvasAdvisor

```
SYSTEM PROMPT:
You are CanvasAdvisor, helping founders build compelling Lean Canvases.

MODES:
1. box_suggest: Generate suggestions for a specific box
2. validate: Evaluate entire canvas for consistency
3. improve: Suggest improvements for weak sections

INPUT for box_suggest:
{
  "box_key": "problem",
  "current_items": ["Founders waste time on manual bookkeeping"],
  "startup_context": { industry, stage, target_customers },
  "other_boxes": { solution: [...], customerSegments: [...] }
}

OUTPUT for box_suggest:
{
  "suggestions": [
    "Tax anxiety causes 40% of freelancers to underpay quarterly",
    "8+ hours/month spent on receipt organization",
    "Fear of IRS audit leads to overpaying accountants"
  ],
  "reasoning": "Added specificity with metrics and emotional drivers",
  "best_practices": "Problems should be measurable, urgent, and emotional"
}

INPUT for validate:
{
  "canvas": { full LeanCanvasData object },
  "startup_context": { ... }
}

OUTPUT for validate:
{
  "overall_score": 72,
  "box_scores": {
    "problem": { score: 85, feedback: "Clear and specific" },
    "solution": { score: 60, feedback: "Too feature-focused, add outcomes" }
  },
  "consistency_issues": [
    "Customer segments mention 'freelancers' but solution targets 'small businesses'"
  ],
  "top_improvements": [
    { box: "solution", suggestion: "Reframe features as customer outcomes" }
  ]
}
```

## Data Structures

### Canvas Version
```typescript
interface CanvasVersion {
  id: string;
  canvas_id: string;
  version: number;
  data: LeanCanvasData;
  created_at: string;
  created_by: string;
  change_summary?: string;
}
```

### Save State
```typescript
type SaveState = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

interface AutosaveState {
  status: SaveState;
  lastSaved: Date | null;
  pendingChanges: boolean;
  errorMessage?: string;
}
```

## UI Components

### AutosaveIndicator
- Positioned in header near title
- Shows: "Saved" (green), "Saving..." (gray), "Unsaved changes" (yellow)
- Timestamp of last save on hover

### ExportMenu
- Dropdown with PDF and PNG options
- Loading state during generation
- Preview before download (optional)

### VersionHistoryPanel
- Sheet or modal overlay
- Scrollable list of versions
- Preview pane
- Restore confirmation dialog

### BoxSuggestionPopover
- Triggered by sparkle icon in edit mode
- Shows 3-5 AI suggestions
- One-click apply or dismiss
- "Generate more" option

## Implementation Phases

### Phase 1: Autosave (Priority: High)
1. Add debounced save hook
2. Implement save state machine
3. Add visual indicator component
4. Test offline/error scenarios

### Phase 2: Export (Priority: High)
1. Install html2canvas and jspdf
2. Create export utility functions
3. Design PDF layout template
4. Add export buttons to UI

### Phase 3: Version History (Priority: Medium)
1. Create versions table or use document versioning
2. Implement version listing query
3. Build version history panel UI
4. Add restore functionality

### Phase 4: AI Enhancement (Priority: Medium)
1. Add box-level suggest action
2. Create CanvasAdvisor edge function
3. Integrate suggestion popover
4. Add per-box validation display

## Acceptance Criteria Checklist

- [ ] All 9 Lean Canvas sections are editable in-place
- [ ] Changes autosave to database every 2 seconds
- [ ] AI suggests improvements for each section based on best practices
- [ ] Users can export canvas as PDF or image
- [ ] Version history allows reverting to previous iterations
- [ ] Canvas data can be used by AI assistant for recommendations

## Dependencies

```json
{
  "html2canvas": "^1.4.1",
  "jspdf": "^2.5.1"
}
```
