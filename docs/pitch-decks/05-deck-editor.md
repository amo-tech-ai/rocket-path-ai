# Pitch Deck System — Deck Editor

> **Level:** Post-MVP | **Purpose:** 3-panel deck editor for editing and enhancing generated decks  
> **Category:** Frontend | **Subcategory:** Pages  
> **Phase:** 2 | **Priority:** P1  
> **No Code:** Design requirements, screen specifications, and user interactions only

---

## Editor Overview

### Three-Panel Layout

- **Left Panel (240px):** Context — Slide outline, navigation, deck metadata
- **Main Panel (Flexible):** Work — Slide editor, content editing, preview
- **Right Panel (360px):** Intelligence — AI suggestions, slide analysis, copilot

### Editor Features

1. **Slide Management** — Outline, reorder, add, delete
2. **Content Editing** — Rich text, bullets, formatting
3. **AI Copilot** — 6 agent suggestions per slide
4. **Slide Analysis** — Quality scores (clarity, impact, tone)
5. **Image Management** — Upload, AI generation, replace
6. **Export** — PDF, PPTX, shareable link

---

## Left Panel: Context

### Slide Outline

**Display:**
- List of all slides in deck
- Slide number, title, type
- Current slide highlighted
- Drag-to-reorder enabled

**Interactions:**
- Click slide: Navigate to that slide
- Drag slide: Reorder slides (updates `slide_number` in database)
- Right-click: Context menu (duplicate, delete, insert)

**Visual States:**
- **Current Slide:** Highlighted background, bold text
- **Has AI Suggestions:** Indicator badge
- **Incomplete:** Warning icon (missing title or content)
- **Has Image:** Thumbnail preview

### Deck Metadata

**Display:**
- Deck title (editable)
- Template type
- Slide count
- Last modified timestamp
- Signal strength score

**Actions:**
- Edit title: Inline editing
- Change template: Modal selector (future)
- View analytics: Navigate to analytics screen (future)

---

## Main Panel: Work

### Slide Editor

**Layout:**
- Full-width editor area
- Slide preview at top (read-only)
- Content editor below

**Content Editor:**
- **Title Field:** Text input, required
- **Content Field:** Rich text editor (markdown or WYSIWYG)
- **Bullet Points:** List editor (add, remove, reorder)
- **Speaker Notes:** Textarea (optional, collapsible)

**Formatting Options:**
- Bold, italic, underline
- Headings (H1, H2, H3)
- Lists (ordered, unordered)
- Links
- Text alignment

**Auto-save:**
- Debounced save (500ms delay)
- Save indicator (saving, saved, error)
- Queue failed saves in localStorage

### Image Management

**Image Display:**
- Image preview area above content
- Replace button
- Remove button
- AI Generate button

**Image Upload:**
- Drag-and-drop zone
- File picker button
- Supported formats: JPG, PNG, WebP
- Max size: 5MB
- Upload to Supabase Storage

**AI Image Generation:**
- Button: "Generate Image with AI"
- Input: Image prompt (pre-filled from `content.image_prompt`)
- Model: Gemini 3 Pro Image Preview
- Loading state during generation
- Preview generated image
- Apply or regenerate

### Slide Navigation

**Controls:**
- Previous button (disabled on first slide)
- Next button (disabled on last slide)
- Slide counter: "Slide 3 of 12"
- Jump to slide: Dropdown or input

**Keyboard Shortcuts:**
- Arrow Left: Previous slide
- Arrow Right: Next slide
- Home: First slide
- End: Last slide

---

## Right Panel: Intelligence

### AI Copilot

**Display:**
- One suggestion per agent (6 total)
- Agent name and icon
- Suggestion text
- Reasoning explanation
- Apply button

**Agents:**
1. **Clarity Agent** — Improves slide clarity
2. **Impact Agent** — Strengthens impact statements
3. **Metric Agent** — Suggests relevant metrics
4. **Problem Agent** — Strengthens problem statement
5. **Industry Agent** — Industry-specific improvements
6. **Tone Agent** — Adjusts tone for audience

**Interactions:**
- Click "Apply": Apply suggestion to slide content
- Click "Dismiss": Hide suggestion
- Click "View All": Expand to see all suggestions

**Data Storage:**
- Suggestions stored in `content.ai_suggestions[]` JSONB array
- Each suggestion has: id, type, suggestion, reasoning, applied, applied_at, created_at

### Slide Analysis

**Display:**
- Quality scores (0-10 scale):
  - **Clarity:** How clear and understandable
  - **Impact:** How compelling and memorable
  - **Tone:** How appropriate for audience
- Overall score (average of three)
- Feedback text with specific recommendations

**Calculation:**
- Runs automatically on slide content change
- Uses Gemini 3 Pro Preview for analysis
- Cached for 5 minutes (recalculate on content change)

**Visual:**
- Progress bars for each score
- Color-coded (red < 5, yellow 5-7, green > 7)
- Expandable feedback section

### Quick Actions

**Actions:**
- **Improve Clarity:** Trigger clarity agent
- **Add Metric:** Trigger metric agent
- **Strengthen Problem:** Trigger problem agent
- **Generate Image:** Open image generation modal
- **Analyze Slide:** Recalculate analysis scores

---

## User Interactions

### Editing Flow

1. User opens deck editor
2. Left panel shows slide outline
3. Main panel shows first slide
4. User edits content
5. Auto-save triggers after 500ms
6. Right panel shows AI suggestions
7. User applies suggestion
8. Content updates, auto-save triggers
9. User navigates to next slide
10. Repeat for all slides

### Slide Reordering

1. User drags slide in outline
2. Visual feedback shows new position
3. User drops slide
4. Update `slide_number` for all affected slides
5. Save changes to database
6. Refresh slide outline

### AI Suggestion Flow

1. User views slide
2. Right panel loads AI suggestions
3. User reads suggestion and reasoning
4. User clicks "Apply"
5. Content updates with suggestion
6. Suggestion marked as applied in `content.ai_suggestions[]`
7. Auto-save triggers
8. Suggestion removed from active suggestions list

### Image Generation Flow

1. User clicks "Generate Image with AI"
2. Modal opens with prompt input
3. Prompt pre-filled from `content.image_prompt`
4. User edits prompt (optional)
5. User clicks "Generate"
6. Loading state shows progress
7. Generated image displays in preview
8. User clicks "Apply" or "Regenerate"
9. Image saved to slide, `content.image_url` updated
10. Auto-save triggers

---

## Data Operations

### Load Deck

**Process:**
1. Fetch deck with `metadata` JSONB
2. Fetch all slides with `content` JSONB
3. Sort slides by `slide_number`
4. Display in slide outline
5. Load first slide in editor

### Save Slide

**Process:**
1. Debounce user input (500ms)
2. Read current `content` JSONB
3. Merge edited content
4. Update `pitch_deck_slides.content` JSONB
5. Update `updated_at` timestamp
6. Queue failed saves in localStorage

### Reorder Slides

**Process:**
1. Calculate new `slide_number` for each slide
2. Batch update all affected slides
3. Update `slide_number` in database
4. Refresh slide outline

### Apply AI Suggestion

**Process:**
1. Read current `content` JSONB
2. Apply suggestion to content
3. Mark suggestion as applied in `content.ai_suggestions[]`
4. Set `applied_at` timestamp
5. Save updated `content` JSONB
6. Refresh editor display

---

## Export Functionality

### Export Modal

**Display:**
- Format selector: PDF, PPTX, Shareable Link
- Options:
  - Include speaker notes (checkbox)
  - Include slide numbers (checkbox)
  - Quality: Standard, High, Print (dropdown)
- Export button

### Export Process

**PDF Export:**
1. User selects PDF format
2. User selects options
3. Click "Export"
4. Generate PDF from slides
5. Upload to Supabase Storage
6. Return download URL
7. Trigger browser download

**PPTX Export:**
1. User selects PPTX format
2. User selects options
3. Click "Export"
4. Generate PowerPoint file from slides
5. Upload to Supabase Storage
6. Return download URL
7. Trigger browser download

**Shareable Link:**
1. User selects Shareable Link format
2. User sets expiration (1 day, 7 days, 30 days, never)
3. Click "Generate Link"
4. Create share record in `metadata.shares[]` JSONB
5. Generate public URL
6. Copy link to clipboard
7. Display link with copy button

---

## Responsive Design

### Desktop (1024px+)

- Full 3-panel layout
- Left: 240px fixed
- Main: Flexible width
- Right: 360px fixed

### Tablet (768-1023px)

- Left panel: Collapses to icon rail
- Main panel: Full width
- Right panel: Drawer (slide in from right)

### Mobile (<768px)

- Bottom tab navigation
- Main panel: Full screen
- Left panel: Hidden (access via menu)
- Right panel: Bottom sheet (slide up from bottom)

---

## Performance Targets

- **Load Deck:** < 500ms
- **Save Slide:** < 300ms (debounced)
- **Load AI Suggestions:** < 2s
- **Apply Suggestion:** < 500ms
- **Generate Image:** < 10s
- **Analyze Slide:** < 3s
- **Export PDF:** < 5s
- **Export PPTX:** < 8s

---

## Success Criteria

### Editor Completion Criteria

- [ ] 3-panel layout implemented
- [ ] Slide outline with drag-to-reorder
- [ ] Rich text editor for content
- [ ] Auto-save works (debounced)
- [ ] AI Copilot shows 6 suggestions
- [ ] Slide analysis calculates scores
- [ ] Image upload and AI generation
- [ ] Export to PDF and PPTX
- [ ] Shareable link generation
- [ ] Responsive design (desktop, tablet, mobile)

### User Acceptance Criteria

- User can edit all slide content
- User can reorder slides
- User can apply AI suggestions
- User can generate images
- User can export deck
- User can share deck via link
- All changes auto-save
- Editor works on mobile devices

---

**Deck Editor Level:** Defines complete deck editing experience with 3-panel layout, AI copilot, and export functionality.

**Next:** See `06-dashboard.md` for Dashboard implementation, `07-ai-integration.md` for AI integration details.
