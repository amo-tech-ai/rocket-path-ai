# Pitch Deck System — Foundation

> **Level:** Foundation | **Purpose:** Core architecture, layout, and essential structure  
> **Task:** MVP-03 — Generation Wizard UI  
> **AI Models:** Gemini 3 Pro Preview, Gemini 3 Flash Preview  
> **No Code:** Design requirements, information architecture, and system structure only

---

## System Architecture

### Three-Panel Layout Model

- **Left Panel (240px):** Context — Navigation, progress, filters, slide outline
- **Main Panel (Flexible):** Work — Primary content area, forms, editor, generation
- **Right Panel (360px):** Intelligence — AI suggestions, insights, guidance, analysis

### Core Screens (5 for MVP)

1. **Wizard Step 1:** Startup Info (pre-filled from profile)
2. **Wizard Step 2:** Industry Focus (13 industry tiles, conditional logic)
3. **Wizard Step 3:** Market & Traction (TAM/SAM/SOM, optional metrics)
4. **Wizard Step 4:** Deck Style (4 templates, slide count selector)
5. **Wizard Step 5:** Review & Generate (summary, signal strength, generate CTA)

**Future Screens (Post-MVP):**
6. Generating Screen (full-screen progress)
7. Deck Editor (3-panel layout)
8. Dashboard (all decks)
9. Export Modal
10. Presentation Mode

---

## Data Foundation

### Core Data Structures

**Wizard Data:** 5-step collection stored in `pitch_decks.metadata.wizard_data` JSONB field

**Structure:**
- **Step 1 (step1_startup_info):** Company name (string), tagline (string), website URL (string), stage (pre-seed, seed, series_a, series_b)
- **Step 2 (step2_industry_focus):** Selected industry (ai_saas, fintech, healthcare, etc.), target customer (string), core problem (string), AI advantage (string), proof metrics (string)
- **Step 3 (step3_market_traction):** TAM (string), SAM (string), SOM (string), revenue (number), users (number), growth rate (string)
- **Step 4 (step4_deck_style):** Template selected (yc, sequoia, custom, series_a), slide count (10, 12, or 15), theme (classic, modern, bold, storytelling)
- **Step 5 (step5_review):** Acceptance criteria (boolean), signal strength (0-100), signal breakdown object with profile, market, traction, suggestions, slides, industry (each 0-100)
- **Additional fields:** selected_industry (string), template_selected (string), updated_at (ISO timestamp)

**Generation Logs:** Stored in `pitch_decks.metadata.generation_logs[]` JSONB array

**Structure (each log entry):**
- **id:** UUID identifier
- **generation_status:** in_progress, completed, or failed
- **input_context:** Object containing template, startup_data, wizard_data, industry
- **ai_model_used:** Object with model name (gemini-3-pro-preview) and thinkingLevel (high)
- **started_at:** ISO timestamp when generation began
- **completed_at:** ISO timestamp when generation finished (null if in progress)
- **duration_seconds:** Number of seconds generation took
- **slide_count_generated:** Number of slides successfully generated
- **error_message:** Error message string if generation failed

**Slide Content:** Stored in `pitch_deck_slides.content` JSONB field

**Structure:**
- **bullets:** Array of bullet point strings
- **content:** Main slide text content (string)
- **ai_suggestions:** Array of suggestion objects, each with:
  - **id:** UUID identifier
  - **type:** improve_clarity, add_metric, strengthen_problem, or industry_specific
  - **suggestion:** Suggestion text (string)
  - **reasoning:** Explanation of suggestion (string)
  - **applied:** Boolean flag indicating if suggestion was applied
  - **applied_at:** ISO timestamp when applied (null if not applied)
  - **created_at:** ISO timestamp when suggestion was created
- **image_prompt:** Text prompt for image generation (string)
- **layout_config:** Object for layout configuration

### Data Flow Principles

- **Auto-save on every wizard step change** (localStorage + database)
  - Wizard data saved to `pitch_decks.metadata.wizard_data` JSONB field
  - Each step update merges into existing metadata structure
- **Incremental slide saving during generation** (partial recovery enabled)
  - Generation logs appended to `pitch_decks.metadata.generation_logs[]` array
  - Each slide saves immediately to `pitch_deck_slides` table
- **Debounced editor saves** (500ms delay, queue failed saves)
  - Slide content updates `pitch_deck_slides.content` JSONB
  - AI suggestions stored in `content.ai_suggestions[]` array

---

## AI Agent Foundation

### Gemini 3 Agents

- **Deck Generator:** Gemini 3 Pro Preview with Thinking Mode, Structured Output
- **Industry Suggestions:** Gemini 3 Flash Preview for real-time recommendations
- **Slide Analyzer:** Gemini 3 Pro Preview for quality scoring and feedback
- **Image Generator:** Gemini 3 Pro Image Preview for slide visuals

### AI Features

- **Structured Output** for consistent deck JSON format
- **URL Context** for company data extraction
- **Google Search Grounding** for market research (future)
- **Thinking Mode** for complex multi-slide coherence

---

## User Journey Foundation

### Primary Flow (MVP)

1. **Dashboard** → Create New Deck
2. **Wizard Steps 1-5** (progressive data collection)
3. **Generate Deck** (AI generation with progress)
4. **Deck Editor** (edit, enhance, refine) — Post-MVP
5. **Export/Share** (PDF, PPTX, or shareable link) — Post-MVP

### Secondary Flows (Post-MVP)

- Resume Draft: Continue abandoned wizard from dashboard
- Presentation Mode: Full-screen deck viewing
- QA Review: Auto-Smart validation loop

---

## Design Principles

### Core Principles

- **One CTA per panel:** Primary action clearly defined
- **Luxury minimalism:** Generous spacing, muted borders, emerald accents
- **Progressive disclosure:** Summary first, detail on demand
- **AI is calm:** One suggestion per agent, no hype, always reasoning
- **Data never lost:** Auto-save everywhere, localStorage backup
- **Human always approves:** AI suggests, founder decides

### Responsive Breakpoints

- **Desktop (1024px+):** Full 3-panel layout
- **Tablet (768-1023px):** Left collapses to icon rail, right becomes drawer
- **Mobile (<768px):** Bottom tab navigation, full-screen main, bottom sheet for AI

---

## Industry Logic System

### Conditional Logic

- **IF `selectedIndustry == "X"` THEN show X-specific content**
- Industry content stored in `tasks/pitch-deck/design/00-industry-content-definitions.md`
- Logic system defined in `tasks/pitch-deck/design/01-industry-logic.md`

### Content Structure per Industry

Each industry has 4 sections:
1. **Target Customer** (question, placeholder, example)
2. **Core Problem** (question, placeholder, example)
3. **Solution/AI Advantage** (question, placeholder, example)
4. **Proof & Metrics** (suggested metrics, example)

Plus **AI Suggestions** (insight, suggestions list, pro tip)

### Industries (13 Total)

1. AI SaaS
2. FinTech
3. Healthcare
4. Retail & eCommerce
5. Cybersecurity
6. Logistics & Supply Chain
7. Education
8. Legal / Professional Services
9. Financial Services
10. Sales & Marketing
11. CRM & Social Media AI
12. Events Management
13. eCommerce

---

## Frontend-Backend Foundation

### API Endpoints

- **Save Wizard Step:** POST endpoint that saves wizard step data to `pitch_decks.metadata.wizard_data` JSONB field
- **Generate Deck:** POST endpoint that triggers deck generation and writes logs to `pitch_decks.metadata.generation_logs[]` JSONB array
- **Fetch Deck:** GET endpoint that retrieves deck data including metadata JSONB field
- **Update Slide:** PATCH endpoint that updates slide content including `content.ai_suggestions[]` JSONB array

### Real-time Channels (Post-MVP)

- `pitchdeck:{deckId}:generation` — Generation progress events
- `pitchdeck:{deckId}:editing` — Slide update events
- `pitchdeck:{userId}:presence` — User presence tracking

---

## Essential Features (MVP Focus)

### Wizard Features

- Step progress indicator (20% increments)
- Locked fields from startup profile (non-editable)
- Editable fields with validation (funding goal, tagline)
- Industry grid with adaptive questions
- Market sizing with AI-sourced defaults
- Template gallery with live preview
- Signal strength calculation and breakdown

### Editor Features (Post-MVP)

- Slide outline with drag-to-reorder
- Rich text editor for slide content
- Image upload and AI generation
- Speaker notes per slide
- AI Copilot with 6 agent suggestions
- Slide analysis scores (clarity, impact, tone)
- Export and Presentation buttons

### Dashboard Features (Post-MVP)

- Filter by status (Drafts, In Progress, Final, Archived)
- Filter by template type
- Resume incomplete wizards
- Deck cards with thumbnail, status, slide count, views
- Sort options (Recently edited, Created, Name, Status)
- Create New Deck CTA

---

## Content Foundation

### Slide Types (13 Total)

1. Title
2. Problem
3. Solution
4. Product
5. Market
6. Business Model
7. Traction (conditional — only if metrics provided)
8. Competition
9. Team
10. Financials (conditional — only if funding data exists)
11. Ask
12. Contact
13. Custom (user-added)

### Default Slide Ordering

Title → Problem → Solution → Product → Market → Business Model → Traction → Competition → Team → Financials → Ask → Contact

### Conditional Logic

- Traction slide appears only if Step 3 has metrics
- Financials slide appears only if funding data exists
- Custom slides can be inserted anywhere

---

## Error Handling Foundation

### Recovery Mechanisms

- Partial generation recovery (save slides incrementally)
- Failed save queue in localStorage (replay on reconnect)
- Connection status indicator (Connected/Offline)
- Abandoned wizard cleanup (30-day auto-delete)

### User Feedback

- Progress indicators for all async operations
- Error messages with actionable next steps
- Success confirmations for critical actions
- Loading states for AI operations

---

**Foundation Level:** Establishes core architecture, layout model, data structures, AI agent roles, and essential user flows. All subsequent levels build upon this foundation.

**Next:** See `02-core.md` for core workflows and features.
