# Prompt 05 — Deck Editor Screen

> **Phase:** Post-MVP | **Category:** Frontend | **Priority:** P1
> **Depends on:** 03-mvp.md (wizard), 04-edge-functions.md (pitch-deck-agent)
> **No code in this prompt — design intent, screen specs, and AI behavior only**

---

## Screen Purpose

The Deck Editor is where founders refine AI-generated pitch decks. Uses 3-panel layout with AI intelligence on the right panel providing real-time suggestions, analysis, and copilot actions per slide.

---

## 3-Panel Layout

### Left Panel (240px) — Slide Navigation

**What it shows:**
- Slide outline list: slide number, title, type icon
- Current slide highlighted with active state
- Drag-to-reorder handle on each slide
- Badge indicators: has AI suggestions (sparkle), incomplete (warning), has image (thumbnail)
- Deck metadata at bottom: title (editable inline), template, slide count, signal strength score, last modified

**What the user can do:**
- Click any slide to navigate to it
- Drag slides to reorder (updates slide_number in database)
- Right-click for context menu: duplicate slide, delete slide, insert new slide above/below
- Edit deck title inline

**Responsive behavior:**
- Tablet: collapses to icon rail (slide numbers only), expands on hover
- Mobile: hidden, accessible via hamburger menu as drawer overlay

---

### Main Panel (Flexible) — Slide Editor

**What it shows:**
- Slide preview at top (read-only rendered view of the current slide as it would appear in presentation)
- Content editor below the preview:
  - Title field (text input, required)
  - Content field (rich text — bold, italic, headings, lists, links, alignment)
  - Bullet points editor (add, remove, reorder individual bullets)
  - Speaker notes (collapsible textarea, optional)
- Image area above content:
  - Current image preview (if exists)
  - Three buttons: Upload Image, Generate with AI, Remove
- Save indicator: "Saving...", "Saved", "Error — retry"
- Slide navigation: Previous / Next buttons, "Slide 3 of 12" counter

**What the user can do:**
- Edit any content field — auto-saves after 500ms debounce
- Upload image via drag-and-drop or file picker (JPG, PNG, WebP, max 5MB)
- Click "Generate with AI" to open image generation modal:
  - Pre-filled prompt from slide content
  - User can edit prompt
  - Shows loading state during Gemini image generation
  - Preview result, then Apply or Regenerate
- Navigate slides with Previous/Next buttons or keyboard arrows (Left/Right, Home/End)

**Responsive behavior:**
- Always full width of remaining space
- Mobile: full screen, slide preview smaller

---

### Right Panel (360px) — AI Intelligence

This is the key differentiator. The right panel is context-aware — it changes what it shows based on what the user is doing.

**Panel Sections (stacked vertically, scrollable):**

#### Section 1: Slide Analysis (always visible)

Quality scores for the current slide on a 0-10 scale:
- **Clarity** — How clear and understandable is this slide?
- **Impact** — How compelling and memorable?
- **Tone** — How appropriate for the target audience?
- Overall score (average of three)
- Each score shown as a colored progress bar: red (<5), yellow (5-7), green (>7)
- Expandable feedback text with specific recommendations

Analysis recalculates automatically when slide content changes (debounced, cached 5 minutes). Uses Gemini Flash for speed.

#### Section 2: AI Copilot Suggestions (context-aware)

Shows AI-generated suggestions specific to the current slide. Up to 6 suggestions, one per agent type:

| Agent | What It Suggests | When It Appears |
|-------|-----------------|-----------------|
| **Clarity Agent** | Rewrite unclear sentences, simplify jargon | Always |
| **Impact Agent** | Strengthen weak statements, add power phrases | Always |
| **Metric Agent** | Add relevant numbers, benchmarks from industry pack | When slide lacks metrics |
| **Problem Agent** | Sharpen problem statement, add urgency | Problem/solution slides |
| **Industry Agent** | Industry-specific improvements using terminology from industry pack | When industry pack exists |
| **Tone Agent** | Adjust formality, investor-appropriate language | Always |

Each suggestion card shows:
- Agent name and icon
- The suggestion text (what to change)
- Why it matters (reasoning for investors)
- "Apply" button — applies the suggestion to slide content automatically
- "Dismiss" button — hides this suggestion

Applied suggestions are tracked in the slide's `content.ai_suggestions[]` JSONB array with: id, type, suggestion, reasoning, applied status, applied_at timestamp.

#### Section 3: Quick Actions (bottom of panel)

Action buttons for common tasks:
- "Improve This Slide" — triggers all agents to regenerate suggestions
- "Add a Metric" — opens metric agent focused suggestion
- "Generate Image" — opens image generation modal
- "View Speaker Notes Tips" — shows tips for presenting this slide type

**Responsive behavior:**
- Tablet: right panel becomes a slide-in drawer (toggle button in header)
- Mobile: right panel becomes a bottom sheet (swipe up to reveal)

---

## AI Behavior Rules

### When suggestions load:
- On first load of a slide, fetch suggestions from Gemini Flash
- Cache suggestions per slide (invalidate when content changes)
- Show skeleton loading state while fetching
- If Gemini fails, show "Suggestions unavailable — click to retry"

### When user applies a suggestion:
- Update slide content immediately (optimistic)
- Mark suggestion as applied in database
- Remove from active suggestions list
- Recalculate slide analysis scores
- Auto-save triggers

### When user edits content manually:
- Invalidate cached suggestions after 3 seconds of no typing
- Recalculate analysis scores after 5 seconds of no typing
- Do NOT interrupt the user while they're actively typing

### Industry pack integration:
- If the deck has an industry pack, the Industry Agent uses benchmarks, terminology, and competitive intel from the pack
- The Metric Agent uses industry benchmarks to suggest relevant numbers
- The Tone Agent adjusts recommendations based on the industry's investor psychology

---

## Data Flow

### Opening the editor:
1. Call pitch-deck-agent `get_deck` action → returns deck + all slides sorted by slide_number
2. Display slide outline in left panel
3. Load first slide in main panel
4. Fetch AI suggestions for first slide from right panel

### Saving a slide:
1. User edits content
2. 500ms debounce
3. Call pitch-deck-agent `update_slide` action with merged content JSONB
4. Show "Saved" indicator
5. On failure: queue in localStorage, show "Error — retry" with retry button

### Reordering slides:
1. User drags slide in outline
2. Calculate new slide_number values for affected slides
3. Batch update via Supabase
4. Optimistic UI update (reorder immediately, rollback on failure)

---

## Export (accessed from deck editor header)

### Export Modal

Options:
- **PDF** — Generate PDF from slides, download
- **PPTX** — Generate PowerPoint, download
- **Shareable Link** — Generate public URL with expiration (1 day, 7 days, 30 days, never)

Each export includes options:
- Include speaker notes (checkbox)
- Include slide numbers (checkbox)
- Quality: Standard / High / Print

---

## Performance Targets

| Action | Target |
|--------|--------|
| Load deck + slides | < 500ms |
| Save slide (debounced) | < 300ms |
| Load AI suggestions | < 2s |
| Apply suggestion | < 500ms |
| Generate image | < 10s |
| Analyze slide scores | < 3s |
| Export PDF | < 5s |

---

## Success Criteria

- 3-panel layout renders correctly on desktop, tablet, mobile
- User can edit all slide content with auto-save
- User can reorder slides via drag-and-drop
- AI copilot shows relevant suggestions per slide
- User can apply suggestions with one click
- Slide analysis scores update on content changes
- Image upload and AI generation work
- Export to PDF/PPTX/link works
- Keyboard navigation (arrow keys) works between slides
