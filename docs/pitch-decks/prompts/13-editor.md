---
prompt_number: 13
title: Pitch Deck Editor & Organizer
category: Design
focus: 3-panel editor system for post-generation deck editing
---

# Prompt 13: Pitch Deck Editor & Organizer

> **Entry:** Auto-redirect from Generation Progress (Prompt 12)
> **Purpose:** Full editing workspace for AI-generated pitch decks
> **Pattern:** 3-panel system consistent with dashboard design

---

## Core Concept

This is NOT a static output viewer.
It is an **editable, AI-assisted pitch deck workspace**.

The editor gives founders full control over their AI-generated deck while providing continuous AI coaching to improve investor readiness.

---

## 3-Panel Layout

### Overview

| Panel | Width | Purpose |
|-------|-------|---------|
| Left | 240px | Deck structure & slide organizer |
| Center | Flexible | Active slide editor |
| Right | 360px | AI intelligence & suggestions |

**Route:** `/pitch-deck/edit/:deckId`

---

## Left Panel — Deck Organizer

### Header

| Element | Content |
|---------|---------|
| Title | Deck title (editable inline) |
| Slide Count | "12 slides" badge |
| Status | Draft / Published badge |

### Slide List

**Each slide row shows:**

| Element | Description |
|---------|-------------|
| Number | Slide order (1, 2, 3...) |
| Thumbnail | Mini preview (optional) |
| Type Badge | Problem, Solution, Traction, etc. |
| Title | Truncated slide title |
| Status Icon | ✅ Strong / ⚠️ Needs work / 🧠 AI suggestion |

### Slide Actions

| Action | Trigger | Result |
|--------|---------|--------|
| Select | Click row | Load slide in center panel |
| Reorder | Drag & drop | Update slide_order |
| Add Slide | "+" button at bottom | Insert new slide (modal to select type) |
| Duplicate | Right-click → Duplicate | Copy slide below |
| Delete | Right-click → Delete | Remove with confirmation |

### Section Groupings (Optional)

Group slides by narrative section:

| Section | Slides |
|---------|--------|
| **The Problem** | Problem |
| **Our Solution** | Solution, Product |
| **Market Opportunity** | Market, Competition |
| **Proof Points** | Traction, Business Model |
| **The Team** | Team, Roadmap |
| **The Ask** | Ask, Contact |

---

## Center Panel — Slide Editor

### Layout

| Zone | Content |
|------|---------|
| Top Bar | Layout selector, preview toggle, save status |
| Main Area | Editable slide content |
| Bottom Bar | Speaker notes toggle, navigation |

### Editable Fields

| Field | Type | Description |
|-------|------|-------------|
| Title | Text input | Slide headline (5-10 words) |
| Subtitle | Text input | Optional supporting line |
| Content | Rich editor | Bullets, paragraphs, or data |
| Image | Upload/URL | Optional visual |
| Layout | Selector | 6 layout options |

### Layout Options

| Layout | Description | Best For |
|--------|-------------|----------|
| `text-only` | Full-width text content | Problem, Solution |
| `split` | 50/50 text and visual | Product, Team |
| `visual-left` | Image left, text right | Features |
| `visual-right` | Text left, image right | Demo |
| `metrics-grid` | 3-4 metric cards | Traction |
| `comparison-matrix` | 2x3 or 3x3 grid | Competition |

### Content Editor Features

| Feature | Behavior |
|---------|----------|
| Rich text | Bold, italic, bullet lists |
| Metrics | Special format for numbers + labels |
| Auto-save | Debounced 1s, "Saving..." indicator |
| Undo/Redo | Cmd+Z / Cmd+Shift+Z |
| Preview | Toggle full-screen slide view |

### Slide Content Structure (JSONB)

Stored in `pitch_deck_slides.content`:

**For bullet slides:**
```
{
  "type": "bullets",
  "items": [
    { "text": "First point", "emphasis": false },
    { "text": "Key insight", "emphasis": true },
    { "text": "Third point", "emphasis": false }
  ]
}
```

**For metrics slides:**
```
{
  "type": "metrics",
  "items": [
    { "value": "$50K", "label": "MRR", "trend": "+15%" },
    { "value": "2,500", "label": "Active Users", "trend": "+30%" },
    { "value": "45%", "label": "MoM Growth", "trend": null }
  ]
}
```

**For comparison slides:**
```
{
  "type": "comparison",
  "headers": ["Feature", "Us", "Competitor A", "Competitor B"],
  "rows": [
    ["AI-powered", "✓", "✗", "Partial"],
    ["Real-time sync", "✓", "✓", "✗"]
  ]
}
```

---

## Right Panel — AI Intelligence

### Signal Strength Indicator

| Element | Description |
|---------|-------------|
| Circular gauge | 0-100 score |
| Score label | "Signal Strength" |
| Sub-label | "Investor readiness" |
| Breakdown | 5 category bars |

### Score Categories

| Category | Weight | Measures |
|----------|--------|----------|
| Story Flow | 20% | Narrative coherence, slide order |
| Market Proof | 20% | TAM/SAM/SOM, benchmarks |
| Traction Evidence | 25% | Metrics, growth, milestones |
| Team Credibility | 15% | Founders, experience |
| Ask Clarity | 20% | Funding amount, use of funds |

### AI Agent Sections

**6 Agent Cards (collapsible):**

| Agent | Icon | Focus |
|-------|------|-------|
| **Narrative Agent** | 📖 | Story flow, slide order |
| **Industry Agent** | 🏭 | Industry-specific language |
| **Investor Agent** | 💰 | Investor expectations alignment |
| **Metrics Agent** | 📊 | Traction validation, KPIs |
| **Design Agent** | 🎨 | Layout and visual balance |
| **Clarity Agent** | 🔍 | Language clarity, conciseness |

### Each Agent Section Contains

| Element | Description |
|---------|-------------|
| Agent name + icon | Header |
| Insight (1 sentence) | Current assessment |
| Suggestion rows | 2-4 actionable items |
| "+" button per row | Apply suggestion |
| Status indicator | ✓ Strong / ⚠️ Improve / ✗ Weak |

### Suggestion Row Format

| Element | Position | Action |
|---------|----------|--------|
| Icon | Left | Agent icon |
| Text | Center | Suggestion (1 line) |
| "+" | Right | Apply to current slide |

### "+" Button States

| State | Visual | Behavior |
|-------|--------|----------|
| Default | Outline "+" | Clickable |
| Hover | Brand green + tooltip | "Apply suggestion" |
| Applied | Solid ✓ | Row tinted green |
| Loading | Spinner | While applying |

### Global AI Actions (Sticky Footer)

| Action | Effect |
|--------|--------|
| "Tighten Deck" | AI rewrites all slides for conciseness |
| "Compare to Top Decks" | Show benchmark comparison |
| "Generate Investor Rewrite" | Full deck rewrite for investor tone |
| "Simulate Objections" | AI generates investor Q&A |

---

## AI Agent Workflows

### When User Edits Slide

1. User edits content
2. Debounce 500ms
3. Send slide + context to edge function
4. AI agents re-analyze
5. Update suggestions in right panel
6. Recalculate signal strength
7. Update status icons in left panel

### When User Applies Suggestion

1. User clicks "+"
2. Optimistic update in center panel
3. Save to database
4. Update applied_suggestions tracking
5. "+" becomes "✓"
6. Signal strength recalculates
7. New suggestions may appear

### When User Reorders Slides

1. User drags slide in left panel
2. Update slide_order in database
3. Narrative Agent re-analyzes flow
4. Update story flow suggestions
5. Recalculate signal strength

---

## Data Flow

### Load Editor

| Step | Action | Data Source |
|------|--------|-------------|
| 1 | Fetch deck | `pitch_decks` WHERE id = :deckId |
| 2 | Fetch slides | `pitch_deck_slides` WHERE deck_id = :deckId |
| 3 | Subscribe realtime | Channel: `pitch_deck:{deck_id}` |
| 4 | Populate left panel | Slide list from slides |
| 5 | Select first slide | Load in center panel |
| 6 | Fetch AI suggestions | Edge function with deck context |
| 7 | Populate right panel | Signal strength + agent sections |

### Save Slide

| Step | Action | Data Written |
|------|--------|--------------|
| 1 | User edits content | Local state update |
| 2 | Debounce 1s | — |
| 3 | Save to database | `pitch_deck_slides` row |
| 4 | Update last_edited_by | `pitch_decks` timestamp |
| 5 | Broadcast change | Realtime event |
| 6 | Trigger AI re-analysis | Update suggestions |

### Database Tables

**pitch_decks:**
- status, title, template, theme
- metadata (JSONB with wizard_data, generation_logs, analytics)
- last_edited_by, updated_at

**pitch_deck_slides:**
- deck_id (FK), slide_order, slide_type
- title, subtitle, content (JSONB)
- layout_type, image_url, speaker_notes
- ai_suggestions (JSONB), signal_strength

---

## Real-Time Features

### Collaboration (Future)

| Feature | Implementation |
|---------|----------------|
| Presence | Show who's viewing/editing |
| Live cursors | Highlight active users |
| Lock slide | Prevent conflicts |
| Conflict resolution | Last-write-wins with notification |

### Current Session

| Event | Broadcast | UI Update |
|-------|-----------|-----------|
| Slide saved | `slide_updated` | Sync content |
| Order changed | `order_updated` | Reorder left panel |
| Suggestion applied | `suggestion_applied` | Update "+" → "✓" |
| Score changed | `score_updated` | Update gauge |

---

## Error States

### Load Error

**Display:**
- Message: "Unable to load pitch deck"
- Sub: "The deck may have been deleted or you don't have access."
- Actions: "Go to Dashboard" / "Retry"

### Save Error

**Display:**
- Toast: "Failed to save changes"
- Sub: "Changes saved locally. Retrying..."
- Action: Auto-retry + manual "Retry" button

### AI Suggestion Error

**Display:**
- Right panel message: "AI suggestions unavailable"
- Sub: "Check back in a moment."
- Action: "Retry" button
- Fallback: Show cached suggestions if available

---

## Empty States

### No Slides (Edge Case)

**Display:**
- Message: "This deck has no slides yet"
- Action: "Add First Slide" button
- Helper: "Start with your title slide"

### No Suggestions

**Display:**
- Message: "All suggestions applied ✓"
- Visual: Checkmark icon
- Helper: "Your deck is investor-ready!"

---

## User Stories

| # | As a... | I want to... | So that... |
|---|---------|--------------|------------|
| 1 | Founder | Edit AI-generated slides | I can customize my pitch |
| 2 | User | Understand why AI suggests changes | I learn to pitch better |
| 3 | Founder | See my investor readiness score | I know when I'm ready |
| 4 | User | Reorder slides easily | I can structure my narrative |
| 5 | Founder | Apply AI suggestions with one click | I save time improving |
| 6 | User | Know my changes are saved | I don't lose work |
| 7 | Founder | Preview slides full-screen | I see the final result |

---

## User Journey

### Post-Generation Flow

1. **Enter Editor** — Auto-redirect from generation
2. **Success Message** — "Your pitch deck is ready. You're in full control."
3. **See Slide List** — Left panel shows all 12 slides
4. **First Slide Selected** — Title slide loaded in center
5. **AI Panel Active** — Signal strength + suggestions visible
6. **Edit Content** — Customize headline, bullets
7. **Apply Suggestion** — Click "+" on AI recommendation
8. **Signal Strength Updates** — Score improves
9. **Reorder Slides** — Drag Problem above Solution
10. **Save & Preview** — Toggle full-screen view
11. **Export/Share** — When ready, export or share link

---

## Success Criteria

- [ ] 3-panel layout matches design system
- [ ] Left panel shows all slides with status icons
- [ ] Drag & drop reordering works
- [ ] Center panel loads selected slide content
- [ ] All content fields editable (title, subtitle, content)
- [ ] Layout selector changes slide layout
- [ ] Auto-save with visual indicator
- [ ] Right panel shows signal strength gauge
- [ ] 6 AI agent sections with suggestions
- [ ] "+" button applies suggestion immediately
- [ ] Signal strength recalculates on changes
- [ ] Speaker notes toggle works
- [ ] Preview mode shows full-screen slide
- [ ] Undo/Redo keyboard shortcuts work

---

## Files Reference

| File | Purpose |
|------|---------|
| `src/pages/PitchDeckEditor.tsx` | Editor page |
| `src/components/pitch-deck/editor/SlideOrganizer.tsx` | Left panel |
| `src/components/pitch-deck/editor/SlideEditor.tsx` | Center panel |
| `src/components/pitch-deck/editor/AIPanel.tsx` | Right panel |
| `src/components/pitch-deck/editor/SignalStrength.tsx` | Score gauge |
| `src/hooks/usePitchDeckEditor.ts` | Editor state |
| `src/hooks/usePitchDeckAI.ts` | AI suggestions |
| `supabase/functions/pitch-deck-agent/index.ts` | AI actions |

---

**Previous:** See Prompt 12 for Generation Progress Screen
**Reference:** See `00-schema.md` for database structure
