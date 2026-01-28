---
prompt_number: 12
title: Pitch Deck Generation
category: Design
focus: AI-animated generation progress + deck creation workflow
---

# Prompt 12: Pitch Deck Generation

> **Trigger:** User clicks "Generate Pitch Deck" from wizard Step 5
> **Output:** Fully structured pitch deck with 10-12 AI-designed slides
> **Transition:** Auto-redirect to Pitch Deck Editor (Prompt 13)

---

## Generation Trigger

### Entry Point

| Action | Source | Destination |
|--------|--------|-------------|
| Click "Generate Pitch Deck" | Wizard Step 5 (Review) | Generation Progress Screen |
| All wizard steps complete | Validation passes | Generation begins |
| Wizard data saved | `pitch_decks.metadata.wizard_data` | AI receives context |

### Pre-Generation Validation

- Step 1-4 data exists and is valid
- Startup profile linked
- Industry selected
- Template selected (or default applied)

---

## Screen 1: Animated AI Progress Screen

### Purpose

Premium, calming full-screen experience while AI generates the pitch deck. No black-box behavior — user sees exactly what AI is doing.

### Layout

**Full-screen overlay or dedicated route: `/pitch-deck/generating/:deckId`**

| Element | Position | Content |
|---------|----------|---------|
| Header | Top center | "Creating Your Pitch Deck" |
| Progress Bar | Center | Linear, 0% → 100%, smooth animation |
| Current Step | Below bar | Active step name + description |
| Step List | Below current | 5 steps with status icons |
| Reassurance Text | Bottom | "This usually takes under a minute." |

### Progress Steps (Sequential, Animated)

| Step | Icon | Title | Description | Duration |
|------|------|-------|-------------|----------|
| 1 | 🧠 | Understanding your startup | Parsing inputs from all wizard steps, industry context, investor expectations | 3-5s |
| 2 | 📊 | Researching your market | Industry benchmarks, comparable companies, market size, trends | 5-8s |
| 3 | 🧩 | Structuring your story | Slide order, narrative flow, investor logic (Problem → Solution → Proof → Ask) | 3-5s |
| 4 | 🎨 | Designing your deck | Choosing layouts per slide, visual hierarchy, content density by stage | 5-8s |
| 5 | ✨ | Finalizing slides | Metrics validation, language clarity, signal strength scoring | 3-5s |

### Visual Design

**Progress Indicator:**
- Linear progress bar with percentage
- Smooth CSS animation (ease-in-out)
- Brand color fill (sage/teal gradient)

**Step Transitions:**
- Active step: Bold text, pulsing icon
- Completed step: ✓ checkmark, muted text
- Pending step: Empty circle, light text

**Loading Animation:**
- Subtle background gradient shift
- No spinners (premium feel)
- Micro-animations on step icons

### Copy & Tone

| State | Message |
|-------|---------|
| Starting | "Getting to know your startup..." |
| 20% | "Researching industry benchmarks..." |
| 40% | "Building your investor narrative..." |
| 60% | "Designing slide layouts..." |
| 80% | "Adding finishing touches..." |
| 100% | "Your pitch deck is ready!" |

---

## AI Generation Logic

### Input Context

AI receives merged context from:

| Source | Data |
|--------|------|
| Wizard Step 1 | company_name, tagline, website_url, industry, stage |
| Wizard Step 2 | problem, solution, differentiator, users, revenue, growth_rate |
| Wizard Step 3 | Smart interview Q&A, research_context, url_extracted_data |
| Wizard Step 4 | deck_type, tone, signal_strength, template_selected |
| Startup Profile | Full startup entity from `startups` table |
| Lean Canvas | If exists, pull `lean_canvases` data |

### AI Models Used

| Agent | Model | Purpose |
|-------|-------|---------|
| Orchestrator | Gemini 3 Pro | Coordinates all generation steps |
| Industry Agent | Gemini 3 Flash | Applies industry-specific language, benchmarks |
| Investor Agent | Claude Sonnet 4.5 | Aligns slides to investor expectations |
| Narrative Agent | Gemini 3 Pro | Ensures story clarity and flow |
| Design Agent | Gemini 3 Flash | Chooses layouts and visual balance |
| Metrics Agent | Gemini 3 Flash | Validates traction, KPIs, credibility |

### Gemini 3 Features

| Feature | Usage |
|---------|-------|
| URL Context | Extract additional company data from website_url |
| Google Search | Market research, competitor discovery, industry benchmarks |
| Structured Output | JSON schema-constrained slide generation |
| Grounding Metadata | Citation sources for market data |

---

## AI-Generated Deck Structure

### Default Slide Set (10-12 slides)

| # | Slide Type | Content | Layout |
|---|------------|---------|--------|
| 1 | Title | Company name, tagline, logo | centered, minimal |
| 2 | Problem | Pain point, market gap | text-left, visual-right |
| 3 | Solution | Core offering, how it solves problem | split, visual-heavy |
| 4 | Product | Key features, demo screenshots | image-grid |
| 5 | Market | TAM/SAM/SOM, market trends | data-visualization |
| 6 | Traction | MRR, users, growth rate, milestones | metrics-grid |
| 7 | Business Model | Revenue streams, pricing | split, bullets |
| 8 | Competition | Competitive landscape, positioning | comparison-matrix |
| 9 | Team | Founders, key hires, advisors | team-grid |
| 10 | Roadmap | Next 12-18 months, milestones | timeline |
| 11 | Ask | Funding amount, use of funds | centered, emphasis |
| 12 | Contact | Website, email, social | minimal, CTA |

### Slide Emphasis by Stage

| Stage | Emphasis | De-emphasized |
|-------|----------|---------------|
| Pre-Seed | Problem, Solution, Team | Traction, Financials |
| Seed | Traction, Market, Product | Team depth |
| Series A | Metrics, Unit Economics, Scale | Problem (assumed known) |

### Each Slide Contains

| Field | Type | Description |
|-------|------|-------------|
| slide_type | TEXT | Matches slide type enum |
| title | TEXT | Headline (5-10 words) |
| subtitle | TEXT | Optional supporting line |
| content | JSONB | Bullets, paragraphs, metrics |
| layout_type | TEXT | visual-left, split, metrics-grid, etc. |
| speaker_notes | TEXT | AI-generated presenter notes |
| ai_suggestions | JSONB | Improvement recommendations |
| signal_strength | INTEGER | Slide-level score (0-100) |

---

## Data Flow

### Generation Workflow

| Step | Action | Data Written |
|------|--------|--------------|
| 1 | User clicks Generate | `pitch_decks.status = 'generating'` |
| 2 | Edge function starts | `metadata.generation_logs[]` appended |
| 3 | Aggregate context | Fetch startup, canvas, wizard data |
| 4 | Call AI agents | Sequential agent processing |
| 5 | Parse structured output | Validate JSON schema |
| 6 | Save deck | `pitch_decks` row updated |
| 7 | Save slides | `pitch_deck_slides` rows created |
| 8 | Update status | `status = 'draft'` |
| 9 | Broadcast complete | Realtime channel event |
| 10 | Redirect to editor | Navigate to `/pitch-deck/edit/:deckId` |

### Database Updates

**pitch_decks table:**
- `status`: generating → draft
- `slide_count`: Set to generated count
- `metadata.generation_logs[]`: Append generation record
- `metadata.wizard_data`: Already saved from wizard

**pitch_deck_slides table:**
- Create 10-12 slide rows
- Each with: title, content (JSONB), layout_type, slide_order
- Link via `deck_id` FK

---

## Real-Time Updates

### Realtime Channel

**Channel:** `pitch_deck_generation:{deck_id}`

**Broadcast Events:**

| Event | Payload | UI Update |
|-------|---------|-----------|
| `step_progress` | `{ step: 1, progress: 20, message: "..." }` | Update progress bar |
| `step_complete` | `{ step: 1, completed_at: "..." }` | Check step, move to next |
| `slide_generated` | `{ slide_number: 3, slide_type: "solution" }` | Show slide count |
| `generation_complete` | `{ deck_id: "...", slide_count: 12 }` | Transition to editor |
| `generation_failed` | `{ error: "...", retry_available: true }` | Show error state |

---

## Error States

### Generation Failure

**Display:**
- Title: "Something went wrong"
- Message: "We couldn't generate your deck. Don't worry — your data is saved."
- Actions:
  - "Try Again" (primary) — Retry generation
  - "Edit Wizard" (secondary) — Return to wizard
  - "Contact Support" (tertiary) — Help link

### Timeout (60s)

**Display:**
- Message: "This is taking longer than expected..."
- Sub-message: "We're still working on it. Please wait."
- Action: "Cancel" button (returns to wizard, data saved)

### Partial Failure

**Display:**
- Message: "Your deck was partially generated"
- Details: "8 of 12 slides created"
- Actions:
  - "Continue with what we have" → Opens editor
  - "Retry remaining slides" → Continues generation

---

## Success Transition

### Completion Animation

1. Progress bar hits 100%
2. All steps show ✓
3. Brief pause (500ms)
4. Message: "Your pitch deck is ready!"
5. Confetti or subtle celebration animation (optional)
6. Auto-redirect to editor (2s delay) or "View Deck" button

### Post-Generation State

- Deck status: `draft`
- All slides editable
- AI suggestions panel populated
- Signal strength calculated
- User in full control

---

## User Stories

| # | As a... | I want to... | So that... |
|---|---------|--------------|------------|
| 1 | Founder | See what AI is doing during generation | I understand the process, no black box |
| 2 | User | Know how long generation will take | I can wait confidently |
| 3 | User | Cancel if it takes too long | I'm not stuck waiting |
| 4 | Founder | See my deck immediately after generation | I can start editing right away |
| 5 | User | Understand why generation failed | I can fix issues and retry |

---

## Success Criteria

- [ ] Progress screen shows 5 animated steps
- [ ] Each step has clear status (pending, active, complete)
- [ ] Progress bar reflects actual generation progress
- [ ] User sees reassuring copy throughout
- [ ] Generation completes in under 60 seconds (P95)
- [ ] Error states have clear actions
- [ ] Auto-redirect to editor on success
- [ ] All wizard data used in generation
- [ ] Deck created with 10-12 slides
- [ ] Each slide has content, layout, speaker notes

---

## Files Reference

| File | Purpose |
|------|---------|
| `src/pages/PitchDeckGenerating.tsx` | Generation progress page |
| `src/hooks/usePitchDeckGeneration.ts` | Generation state + realtime |
| `src/components/pitch-deck/GenerationProgress.tsx` | Progress UI component |
| `supabase/functions/pitch-deck-agent/index.ts` | Generation edge function |

---

**Next:** See Prompt 13 for Pitch Deck Editor (post-generation editing)
