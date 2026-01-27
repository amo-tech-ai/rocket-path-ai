# Pitch Deck System — Core Workflows

> **Level:** Core | **Purpose:** Essential features, workflows, user interactions  
> **Task:** MVP-03 — Generation Wizard UI  
> **No Code:** Workflow logic, API specifications, and user interactions only

---

## Core Workflows

### Workflow 1: Wizard Flow (4 Steps)

**Step 1: Startup Info**
- Pre-filled from `startups` table (locked fields)
- Company name, website URL, one-line pitch, industry (13 tiles), sub-category, AI investor summary
- Auto-save to `metadata.wizard_data.step1_startup_info`
- Validation: Required fields, URL format, industry selection required

**Step 2: Market & Traction**
- Problem statement, core solution, differentiator
- Optional metrics: users, revenue, growth rate
- Funding stage selection (Pre-Seed, Seed, Series A)
- Auto-save to `metadata.wizard_data.step2_market_traction`

**Step 3: Smart Interviewer**
- AI asks 6-8 dynamic industry-specific questions based on Steps 1+2 data
- Gemini Search + URL Context research running in background
- Questions change based on selected industry (see `11-industry-strategy.md` for question packs)
- AI suggestions panel with "+Add to deck" buttons
- All optional — user can skip any question
- Auto-save to `metadata.wizard_data.step3_smart_interview`

**Step 4: Review & Generate**
- Summary of all steps + Smart Interview answers
- Deck type selection: Pre-Seed / Seed / Demo Day (AI pre-selects based on stage)
- Tone selection: Clear / Confident / Conservative
- Signal strength calculation and breakdown
- Potential gaps and "Improve before generating" link
- Generate CTA button
- Auto-save to `metadata.wizard_data.step4_review`

### Workflow 2: Generation Flow

**Trigger:** User clicks "Generate Deck" in Step 4

**Process:**
1. Fetch startup profile from `startups` table
2. Fetch lean canvas from `documents` table (type=lean_canvas, latest)
3. Read wizard_data (Steps 1-3 + Step 4 review settings)
4. Load industry playbook from `11-industry-strategy.md` based on selected_industry
5. Create generation log in `metadata.generation_logs[]` with status "in_progress"
6. Build prompt (profile + canvas + wizard + interview + playbook + research context)
7. Call Gemini 3 Pro Preview with Thinking Mode + structured output
8. Generate slides incrementally (save each slide as generated)
9. Update generation log with progress
10. On completion: Update log status to "completed", set deck status to "review"
11. On failure: Update log status to "failed", set deck status to "draft"

**Incremental Saving:**
- Each slide saves immediately to `pitch_deck_slides` table
- Generation log updated with `slide_count_generated`
- Partial recovery: If generation fails, existing slides preserved

### Workflow 3: Signal Strength Calculation

**Formula:**
- Profile completeness: 20% (Step 1 fields: name, pitch, URL, industry)
- Market & traction data: 20% (Step 2 fields: problem, solution, differentiator, metrics, stage)
- Smart interview depth: 25% (Step 3: answered/total ratio + research context quality)
- AI suggestions applied: 15% (count from content.ai_suggestions array where applied equals true)
- Slide content completeness: 10% (slides with both title and content)
- Industry specificity: 10% (Step 1 industry + Step 3 industry-specific answers quality)

**Calculation:**
- Runs after Step 4 load (Review & Generate)
- Stored in `metadata.wizard_data.step4_review.signal_strength`
- Breakdown stored in `metadata.wizard_data.step4_review.signal_breakdown`

---

## AI Agent Behaviors

### Deck Generator (Gemini 3 Pro Preview)

**Input:**
- Wizard data from metadata.wizard_data JSONB field
- Startup data from startups table
- Selected industry and template identifiers

**Output:**
- Structured deck object with title, template, and slides array
- Each slide contains: number, title, type, content, bullet_points array, speaker_notes

**Configuration:**
- Model: gemini-3-pro-preview
- Thinking Level: high
- Structured Output: Enabled
- Timeout: 60 seconds

### Industry Suggestions (Gemini 3 Flash Preview)

**Input:**
- Selected industry identifier
- Current wizard step data

**Output:**
- Real-time suggestions for improving step content
- Industry-specific recommendations

**Configuration:**
- Model: gemini-3-flash-preview
- Timeout: 5 seconds

---

## Data Operations

### Save Wizard Step

**Endpoint:** POST endpoint for saving wizard step data  
**Action:** save_wizard_step

**Payload Requirements:**
- **action:** Must be "save_wizard_step"
- **deck_id:** Optional UUID (creates new deck if missing)
- **step:** Required number (1, 2, 3, or 4)
- **step_data:** Required object containing step-specific data
- **selected_industry:** Optional string (set in step 1)
- **template_selected:** Optional string

**Process:**
1. If deck_id missing, create new pitch_decks row with status "in_progress"
2. Read current metadata from deck
3. Merge step_data into metadata.wizard_data.step{number}_* path
4. Update metadata.wizard_data.updated_at timestamp
5. Save to pitch_decks.metadata JSONB field
6. Return updated wizard data

**Response:**
- **deck_id:** UUID of deck
- **wizard_data:** Complete wizard data object
- **step:** Step number that was saved

### Resume Wizard

**Endpoint:** POST endpoint for resuming wizard  
**Action:** resume_wizard

**Payload Requirements:**
- **action:** Must be "resume_wizard"
- **deck_id:** Required UUID of deck

**Process:**
1. Read pitch_decks.metadata.wizard_data from deck
2. Return wizard data object or null if not found

**Response:**
- **deck_id:** UUID of deck
- **wizard_data:** Wizard data object or null if no wizard data exists

### Generate Deck

**Endpoint:** POST endpoint for generating deck  
**Action:** generate_deck

**Payload Requirements:**
- **action:** Must be "generate_deck"
- **template:** Required string (yc, sequoia, custom, or series_a)
- **wizard_data:** Required object containing deck_id UUID

**Process:**
1. Read wizard data from metadata.wizard_data JSONB field
2. Read startup data from startups table
3. Create generation log entry in metadata.generation_logs[] array
4. Call Gemini 3 Pro Preview with Thinking Mode
5. Save slides incrementally to pitch_deck_slides table
6. Update generation log with completion status
7. Calculate signal strength and store in metadata
8. Return deck ID and slide count

**Response:**
- **id:** UUID of deck
- **title:** Generated deck title string
- **template:** Template identifier string
- **slides:** Array of generated slide objects
- **total_slides:** Total number of slides generated
- **saved_slides:** Number of slides successfully saved

---

## User Interactions

### Wizard Navigation

- **Next Button:** Validates current step, saves data, advances to next step
- **Back Button:** Returns to previous step (data preserved)
- **Progress Indicator:** Shows current step (1/4, 2/4, etc.) and percentage (25%, 50%, 75%, 100%)
- **Save & Exit:** Saves current step, returns to dashboard

### Validation

- **Step 1:** Company name required, URL format validation, industry selection required
- **Step 2:** Problem statement required, solution required, funding stage required. Metrics optional
- **Step 3:** All questions optional (Smart Interviewer). AI fills gaps with research data
- **Step 4:** All previous steps must be complete. Deck type and tone required for generation

### Error Handling

- **Validation Errors:** Show inline error messages, prevent navigation
- **Save Errors:** Queue failed saves in localStorage, retry on reconnect
- **Generation Errors:** Show error message, allow retry, preserve partial progress

---

## Export Functionality (Post-MVP)

### Export Formats

- **PDF:** Full deck export with all slides
- **PPTX:** PowerPoint format with editable slides
- **Shareable Link:** Public URL with expiration

### Export Process

1. User clicks Export button
2. Select format (PDF/PPTX/Link)
3. Generate file or create share link
4. Upload to Supabase Storage
5. Return download URL or share link

---

## Offline Handling

### localStorage Backup

- **Wizard Data:** Auto-save to localStorage on every step change
- **Failed Saves:** Queue failed database saves, replay on reconnect
- **Connection Status:** Show Connected/Offline indicator

### Recovery

- **On Page Load:** Check localStorage for unsaved wizard data
- **On Reconnect:** Replay failed saves from queue
- **On Generation Failure:** Preserve partial slides, allow resume

---

**Core Level:** Defines essential workflows, AI agent behaviors, data operations, and user interactions. MVP implementation follows these workflows.

**Next:** See `03-mvp.md` for MVP specifications (Generation Wizard UI).
