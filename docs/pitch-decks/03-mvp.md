# Pitch Deck System — MVP: Generation Wizard UI

> **Level:** MVP | **Purpose:** Minimum viable product — Generation Wizard UI implementation  
> **Task:** MVP-03 — Generation Wizard UI  
> **Category:** Frontend | **Subcategory:** Pages  
> **Phase:** 1 | **Priority:** P0 | **Status:** Not Started | **Percent Complete:** 0%  
> **Owner:** Frontend Developer  
> **Dependencies:** []  
> **AI Models:** [gemini-3-pro-preview, gemini-3-flash-preview]  
> **Tools:** [React, TypeScript, Tailwind CSS]  
> **No Code:** Design requirements, screen specifications, and user flows only

---

## MVP Scope

### Included in MVP

1. **4-Step Wizard UI** — Complete wizard interface (Startup Info → Market & Traction → Smart Interviewer → Review & Generate)
2. **Wizard Data Persistence** — Auto-save to database
3. **Deck Generation** — AI-powered deck creation
4. **Signal Strength Calculation** — Quality scoring
5. **Basic Error Handling** — User feedback and recovery

### Excluded from MVP (Post-MVP)

- Deck Editor (3-panel layout)
- Dashboard (deck listing)
- Export functionality (PDF/PPTX)
- Presentation Mode
- QA Review Screen
- Real-time collaboration
- Advanced AI features (Claude SDK, Google Search)

---

## Screen Specifications

### Screen 1: Wizard Step 1 — Startup Info

**Layout:** 3-column (Left: stepper, Center: form, Right: AI Assistant panel)

**Fields (Center Column):**
- **Company Name** (locked, pre-filled from startups table)
- **Website URL** (editable, URL input, required, format validation, helper: "We'll auto-fill details from your website")
- **One-Line Pitch** (editable, textarea, required, max 120 chars, helper: "Who it's for + what problem you solve + why it's better")
- **Industry** (required, dropdown or 13 tiles: AI SaaS, FinTech, Healthcare, etc.)
- **Sub-category** (optional, dropdown, options change per industry, "AI Enhance" chip)
- **Stage** (editable, dropdown: pre-seed, seed, series_a, series_b)

**AI Assistant Panel (Right Column):**
- "Rewrite my pitch" AI button
- Industry-specific example pitch (e.g., "AI SDRs that book qualified meetings for B2B sales teams")
- Real-time suggestions via Gemini 3 Flash Preview

**Auto-Generated (Read-Only):**
- **Investor Summary** — AI-generated summary combining industry + sub-category + pitch (displayed in highlighted card)

**UI Elements:**
- Left stepper: 4 steps with completion indicators (Step 1 active, 2-4 numbered)
- Progress indicator: "Step 1 of 4" (25% complete)
- Locked field indicator: Visual distinction for non-editable fields
- Validation: Inline error messages for required fields and URL format
- Character counter on pitch field (e.g., "120/120")
- Continue button: Enabled when all required fields valid
- Back button: Hidden on step 1

**Data Flow:**
- On field change: Auto-save to localStorage
- On industry change: Load sub-category options, trigger AI investor summary generation
- On Continue click: Validate, save to `metadata.wizard_data.step1_startup_info`, navigate to Step 2
- On page load: Load from `metadata.wizard_data.step1_startup_info` if exists

---

### Screen 2: Wizard Step 2 — Market & Traction

**Layout:** 3-column (Left: stepper, Center: form, Right: AI Assistant panel)

**Problem & Solution (Center Column):**
- **Problem:** "Describe the pain in one sentence. Avoid features." (textarea, required)
- **Core Solution:** "How does your product solve it?" (textarea, required)
- **Differentiator:** "Why it's different" (textarea, required)

**Traction Metrics (Optional, inline row):**
- **Users:** Number input (optional)
- **Revenue (MRR):** Number input (optional)
- **Growth (%):** Number input (optional)

**Funding Stage:**
- **Stage:** Radio buttons: Pre-Seed, Seed, Series A — required

**AI Assistant Panel (Right Column):**
- Investor insight: "Investors look for clear pain + proof"
- Confidence Level indicator: "Traction is strong for Pre-Seed stage" (color-coded)
- Industry-specific metric suggestions from playbook

**UI Elements:**
- Left stepper: Step 1 completed (checkmark), Step 2 active, 3-4 numbered
- Progress indicator: "Step 2 of 4" (50% complete)
- Validation: Problem, solution, differentiator, and funding stage required. Metrics optional
- Continue button: Enabled when required fields filled
- Back button: Returns to Step 1

**Data Flow:**
- On field change: Auto-save to `metadata.wizard_data.step2_market_traction`
- On Continue click: Validate, save, navigate to Step 3
- Metrics presence determines if Traction slide appears in generated deck
- Funding stage feeds into Smart Interviewer question filtering

---

### Screen 3: Wizard Step 3 — Smart Interviewer

**Layout:** 3-column layout (see `100-pitch-deck-strategy.md` for full Figma spec)

| Column | Content |
|--------|---------|
| **Left** | Stepper (4 steps), answer quality/completeness progress bar |
| **Center** | Question cards (one-at-a-time or "show all"), inputs, skip/next/save draft |
| **Right** | AI Intelligence Panel: signal strength, research status, AI suggestions with +Add buttons |

**Pre-Fill Context Bar:** Read-only chips from Steps 1+2 (company, industry, stage, traction, problem)

**Research Status Bar:** Live progress from Gemini Search + URL Context:
- Website summary extracted
- Industry keywords detected
- Competitors + category patterns found
- Benchmarks (if available)

**Dynamic Questions:** 6-8 industry-specific questions from question packs (see `11-industry-strategy.md`). Questions change based on:
- Selected industry (Step 1)
- Funding stage (Step 2)
- What's already known from Steps 1+2 (de-duplication)

**Question Card Component:**
- Label: "Question 3 of 8"
- Question title (bold)
- "Why this matters to investors" hint
- Input field (type varies)
- AI suggestion chips with +Add button
- "Example answer" expandable
- All questions optional — user can skip any

**AI Suggestions Panel (Right Column):**
- Short suggestion text + **+Add to deck** button
- Optional slide assignment dropdown
- "Generate Deep Analysis" button
- "Compare to top Seed decks" toggle

**UI Elements:**
- Progress indicator: "Step 3 of 4: Smart Interview" (75% complete)
- Progressive disclosure: one question at a time (default), "Show all" for power users
- Answer quality indicator per question (brief/good/detailed)
- Autosave after each question
- Max 10 questions (6-8 typical)
- Next button: Always enabled (all questions optional)
- Back button: Returns to Step 2

**Data Flow:**
- On load: Call `generate_interview_questions` edge function with Step 1+2 data
- On answer: Auto-save to `metadata.wizard_data.step3_smart_interview.questions[]`
- Research context saved to `metadata.wizard_data.step3_smart_interview.research_context`
- On Next click: Save, show interview summary, navigate to Step 4

---

### Screen 4: Wizard Step 4 — Review & Generate

**Layout:** Full-width review screen with summary

**Review Sections:**
- **Step 1 Summary:** Company name, tagline, website, industry, stage
- **Step 2 Summary:** Problem, solution, differentiator, traction metrics
- **Step 3 Summary:** Smart Interview answers (slide-ready bullets), research insights
- Edit links per section to return to that step

**Deck Style Selection (included in Step 4):**
- **Deck Type:** Pre-Seed (8-10 slides) / Seed (10-12) / Demo Day (6-8) — AI pre-selects based on funding stage
- **Tone:** Clear / Confident / Conservative — AI recommends based on industry

**Signal Strength Display:**
- **Overall Score:** Large number (0-100) with visual indicator (color-coded)
- **Breakdown:** 6 components with individual scores:
  - Profile: 0-100 (20% weight)
  - Market: 0-100 (20% weight)
  - Smart Interview: 0-100 (25% weight)
  - Suggestions: 0-100 (15% weight)
  - Slides: 0-100 (10% weight)
  - Industry: 0-100 (10% weight)
- Visual: Progress bars or score cards for each component

**AI Deck Analysis:**
- Story clarity assessment
- Problem-solution fit
- Traction strength
- Market narrative quality
- Potential gaps with "Improve before generating" link

**Generate Button:**
- Primary CTA: "Generate Deck"
- Loading state: Show spinner, disable button during generation
- Success: Navigate to deck view
- Error: Show error message, allow retry

**UI Elements:**
- Progress indicator: "Step 4 of 4: Review & Generate" (100% complete)
- Edit links: Allow editing any step (returns to that step)
- Signal strength: Prominent display with breakdown
- Generate button: Large, prominent
- Back button: Returns to Step 3

**Data Flow:**
- On page load: Calculate signal strength, display summary
- On Generate click: Save `metadata.wizard_data.step4_review`, trigger generation
- Signal strength calculation: See Workflow 3 in `02-core.md`

---

## User Flows

### Flow 1: New User — Complete Wizard

1. User clicks "Create New Deck" from dashboard
2. Navigate to Step 1 (Startup Info)
3. Fill required fields (company, URL, pitch, industry, stage)
4. Click Next → Navigate to Step 2
5. Fill problem, solution, differentiator, funding stage, optional metrics
6. Click Next → Navigate to Step 3 (Smart Interviewer)
7. AI generates 6-8 industry-specific questions. Answer any/all, skip if desired
8. Click Next → Navigate to Step 4 (Review & Generate)
9. Select deck type + tone, review summary, see signal strength → Click "Generate Deck"
10. Navigate to deck view

### Flow 2: Returning User — Resume Wizard

1. User clicks "Resume Draft" from dashboard
2. Load wizard data from `metadata.wizard_data`
3. Navigate to last completed step + 1
4. Continue from that step
5. Complete remaining steps
6. Generate deck

### Flow 3: Edit Previous Step

1. User on Step 4 (Review & Generate)
2. Clicks "Edit" link on Step 2 summary
3. Navigate back to Step 2
4. Make changes
5. Click Next through remaining steps
6. Return to Step 4 with updated summary

---

## Validation Rules

### Step 1 Validation — Startup Info

- **Company Name:** Pre-filled, locked (no validation needed)
- **Tagline:** Required, minimum 10 characters, maximum 200 characters
- **Website URL:** Required, valid URL format (http:// or https://)
- **Industry:** Required, must select one of 13 industries
- **Stage:** Required, must be one of: pre-seed, seed, series_a, series_b

### Step 2 Validation — Market & Traction

- **Problem:** Required, minimum 20 characters
- **Core Solution:** Required, minimum 20 characters
- **Differentiator:** Required, minimum 20 characters
- **Funding Stage:** Required, must be one of: Pre-Seed, Seed, Series A
- **Users:** Optional, if provided must be positive number
- **Revenue:** Optional, if provided must be positive number
- **Growth Rate:** Optional, if provided must be non-empty string

### Step 3 Validation — Smart Interviewer

- **All questions optional** — user can skip any question
- **Per-question answer quality:** Brief / Good / Detailed (visual indicator only, not blocking)
- **Research context:** Loaded automatically, no user validation needed

### Step 4 Validation — Review & Generate

- **All previous steps:** Steps 1-2 required fields must be complete
- **Deck Type:** Required, must be one of: Pre-Seed, Seed, Demo Day
- **Tone:** Required, must be one of: Clear, Confident, Conservative
- **Signal Strength:** Calculated automatically, no user input required

---

## Error Handling

### Validation Errors

- **Inline Messages:** Show error message below invalid field
- **Prevent Navigation:** Disable Next button until all required fields valid
- **Visual Indicators:** Red border on invalid fields, checkmark on valid fields

### Save Errors

- **Queue Failed Saves:** Store in localStorage with timestamp
- **Retry on Reconnect:** Automatically retry failed saves when connection restored
- **User Notification:** Show toast/notification when save fails, show success when retry succeeds

### Generation Errors

- **Error Message:** Display user-friendly error message
- **Retry Option:** Allow user to retry generation
- **Partial Recovery:** Preserve any slides that were successfully generated
- **Status Update:** Update deck status to "draft" on failure

---

## Success Criteria

### MVP Completion Criteria

- [ ] All 4 wizard steps implemented and functional
- [ ] Wizard data saves to `metadata.wizard_data` JSONB field
- [ ] Industry selection triggers conditional questions
- [ ] Signal strength calculates and displays correctly
- [ ] Deck generation completes successfully
- [ ] Slides save incrementally during generation
- [ ] Error handling works for validation, save, and generation errors
- [ ] Auto-save works (localStorage + database)
- [ ] Resume wizard works from dashboard
- [ ] All validation rules enforced

### User Acceptance Criteria

- User can complete wizard in single session
- User can save and resume wizard later
- User sees signal strength before generating
- User receives clear error messages
- Generated deck contains expected slides
- All wizard data persists correctly

---

## Design Requirements

### Visual Design

- **Color Scheme:** Luxury minimalism with emerald accents
- **Typography:** Clear hierarchy, readable fonts
- **Spacing:** Generous padding and margins
- **Borders:** Muted borders, subtle shadows

### Responsive Design

- **Desktop (1024px+):** Full-width form, comfortable spacing
- **Tablet (768-1023px):** Adjusted spacing, stacked layouts where needed
- **Mobile (<768px):** Single column, full-width inputs, bottom navigation

### Accessibility

- **Keyboard Navigation:** Tab through all fields, Enter to submit
- **Screen Readers:** Proper labels, ARIA attributes
- **Color Contrast:** WCAG AA compliance
- **Focus Indicators:** Clear focus states on interactive elements

---

## Integration Points

### Frontend Hooks

- **usePitchDeckAgent:** Hook for calling edge function actions
  - `saveWizardStep`: Save step data
  - `resumeWizard`: Load wizard data
  - `generateDeck`: Trigger generation
- **usePitchDecks:** Hook for deck operations
  - `useCreatePitchDeck`: Create new deck
  - `useUpdatePitchDeck`: Update deck metadata

### Edge Function Actions

- **save_wizard_step:** Saves wizard step to `metadata.wizard_data`
- **resume_wizard:** Loads wizard data from `metadata.wizard_data`
- **generate_interview_questions:** Generates Smart Interviewer questions via Gemini Flash + Search
- **generate_deck:** Generates deck using Gemini 3 Pro Preview

### Database Operations

- **Read:** Fetch deck with `metadata` JSONB field
- **Write:** Update `metadata.wizard_data` JSONB paths
- **Create:** Create new `pitch_decks` row with initial metadata structure

---

## Performance Targets

- **Step Navigation:** < 100ms (instant)
- **Auto-save:** < 500ms (debounced)
- **Signal Strength Calculation:** < 200ms
- **Wizard Data Load:** < 300ms
- **Generation Trigger:** < 1s (before AI processing begins)

---

## Testing Requirements

### Unit Tests

- Wizard step validation logic
- Signal strength calculation formula
- Auto-save debounce logic
- Conditional question display logic

### Integration Tests

- Save wizard step → Verify database update
- Resume wizard → Verify data loads correctly
- Generate deck → Verify slides created
- Error handling → Verify error states

### E2E Tests

- Complete wizard flow (all 4 steps)
- Resume wizard flow
- Edit previous step flow
- Generation success flow
- Generation error flow

---

**MVP Level:** Defines minimum viable product for Generation Wizard UI. Implementation should follow these specifications exactly.

**Next:** See `00-schema.md` for database structure, `01-foundation.md` for architecture, `02-core.md` for workflows.
