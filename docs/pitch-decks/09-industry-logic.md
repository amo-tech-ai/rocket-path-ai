# Pitch Deck System — Industry Logic

> **Level:** Implementation | **Purpose:** Industry-specific conditional logic and content  
> **Category:** Frontend | **Subcategory:** Logic  
> **Phase:** 1 | **Priority:** P0  
> **No Code:** Logic specifications, content structure, and conditional rules only

---

## Industry Logic Overview

### Conditional System

**Principle:** IF `selected_industry == "X"` THEN show X-specific content

**Implementation:**
- Industry selection in Step 1 (Startup Info) triggers conditional logic across all subsequent steps
- Industry question packs and playbooks defined in `11-industry-strategy.md`
- Smart Interviewer (Step 3) uses industry-specific dynamic questions from shared question packs

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

## Industry Content Structure

### Per-Industry Content (from `11-industry-strategy.md`)

Each industry has two components:

1. **Question Pack** (8 questions each)
   - `question_text`, `input_type` (text/textarea/number/select)
   - `slide_mapping` (which slide the answer feeds)
   - `investor_weight` (0-1, importance for signal strength)
   - `stage_filter` (which funding stages see this question)
   - `why_it_matters` (investor context hint)
   - `example_answer` (expandable example)
   - `contexts` (["onboarding", "pitch_deck"] — shared across wizards)

2. **Playbook** (generation context)
   - `narrative_arc` (recommended story flow)
   - `slide_emphasis` (which slides get more depth)
   - `investor_psychology` (what investors look for)
   - `red_flags` (what to avoid)
   - `power_phrases` / `weak_phrases`
   - `benchmark_metrics` (industry-specific benchmarks)
   - `prompt_context` (injected into Gemini generation prompt)

---

## Conditional Logic Rules

### Step 1: Startup Info — Industry Selection

**Rule 1: Industry Selection**
- User selects industry from 13 tiles in Step 1
- Store in `metadata.wizard_data.step1_startup_info.industry`
- Also store in `metadata.wizard_data.selected_industry` for quick access
- Triggers conditional logic in all subsequent steps

**Rule 2: Sub-Category Selection**
- After industry selection, show sub-category options specific to that industry
- Store in `metadata.wizard_data.step1_startup_info.sub_category`

### Step 2: Market & Traction — Industry Context

**Rule 1: Traction Slide Conditional**
- IF `step2_market_traction` has revenue, users, or growth_rate:
  - Include Traction slide in generated deck
- ELSE:
  - Skip Traction slide in generated deck

**Rule 2: Industry-Specific Metric Suggestions**
- IF `selected_industry` exists:
  - Show industry-specific benchmark metrics from playbook
  - Pre-fill suggested metrics if available
- ELSE:
  - Show generic metric suggestions

### Step 3: Smart Interviewer — Dynamic Questions

**Rule 1: Question Pack Loading**
- Load question pack for `selected_industry` from `11-industry-strategy.md`
- Filter questions by `stage_filter` matching user's funding stage (from Step 1)
- De-duplicate questions already answered in Steps 1+2
- Display 6-8 questions (max 10)

**Rule 2: AI Suggestions Panel**
- Show industry-specific AI suggestions in right column
- Use `investor_weight` to prioritize higher-value questions
- Show `why_it_matters` hint per question for investor context

**Rule 3: Research Context**
- Gemini Search + URL Context runs in background using `website_url` from Step 1
- Extract industry keywords, competitors, benchmarks
- Feed research into AI suggestion chips with "+Add to deck" buttons

### Step 4: Review & Generate — Industry Context

**Rule 1: Deck Type Recommendations**
- AI pre-selects deck type based on funding stage and industry
- IF `selected_industry == "ai_saas"` AND stage == "pre_seed": Pre-Seed (8-10 slides)
- IF `selected_industry == "healthcare"`: Recommend more slides (regulatory content)

**Rule 2: Tone Recommendations**
- AI recommends tone based on industry playbook `investor_psychology`

**Rule 3: Industry-Specific Signal Strength**
- IF `selected_industry` exists AND Smart Interview has industry-specific answers:
  - Industry component = 10% (weighted by answer quality)
- ELSE:
  - Industry component = 0%

**Rule 4: Generation Context**
- Industry playbook `prompt_context` injected into Gemini generation prompt
- Playbook `narrative_arc` guides slide ordering
- Playbook `slide_emphasis` determines slide depth
- Playbook `red_flags` and `weak_phrases` used for quality checks

---

## Content Loading Strategy

### Content Source

**File:** `11-industry-strategy.md` (question packs + playbooks for all 13 industries)

**Structure:**
- Each industry has a question pack (8 questions) and a playbook (generation context)
- Question packs are shared across onboarding and pitch deck wizards via `contexts` field

### Loading Process

**Step 1: Industry Selection (Step 1 of Wizard)**
- User selects industry from 13 tiles
- Store `selected_industry` identifier

**Step 2: Question Pack Loading (Step 3 — Smart Interviewer)**
- Load question pack for `selected_industry`
- Filter by `stage_filter` matching user's funding stage
- De-duplicate with data already provided in Steps 1+2
- Generate 6-8 dynamic questions

**Step 3: Playbook Loading (Step 4 — Generation)**
- Load playbook for `selected_industry`
- Inject `prompt_context` into Gemini generation prompt
- Use `narrative_arc`, `slide_emphasis`, `benchmark_metrics` for deck structure

**Step 4: Validation**
- Step 1: Industry selection required
- Step 3: All questions optional (Smart Interviewer)
- Step 4: All previous steps must be complete for generation

---

## Industry-Specific AI Behavior

### Deck Generation

**Industry Context:**
- Include `selected_industry` in generation prompt
- Include industry-specific content in context
- Use industry-specific slide structures

**Industry Templates:**
- Some industries have preferred slide orders
- Some industries require additional slides
- Some industries have industry-specific slide types

### AI Suggestions

**Industry Agent:**
- Uses `selected_industry` for suggestions
- Provides industry-specific recommendations
- References industry best practices

**Industry-Specific Prompts:**
- Industry context included in all AI prompts
- Industry examples used in few-shot learning
- Industry terminology used in suggestions

---

## Data Storage

### Wizard Data Structure

**Industry Selection:**
- Stored in `metadata.wizard_data.step1_startup_info.industry`
- Also in `metadata.wizard_data.selected_industry` (quick access)
- String identifier (e.g., "ai_saas", "fintech")

**Smart Interview Answers:**
- Stored in `metadata.wizard_data.step3_smart_interview.questions[]`
- Each answer maps to a slide via `slide_mapping`
- Research context stored in `metadata.wizard_data.step3_smart_interview.research_context`

### Generation Context

**Industry in Generation:**
- `selected_industry` included in generation prompt
- Industry playbook `prompt_context` injected into Gemini prompt
- Smart Interview answers included as slide-ready content
- Research context (competitors, benchmarks) included

---

## Validation Rules

### Industry Selection

- **Required:** User must select one industry
- **Validation:** Industry must be one of 13 valid identifiers
- **Error:** Show error if industry not selected

### Smart Interview Questions

- **Optional:** All questions in Smart Interviewer are optional
- **Quality indicator:** Brief / Good / Detailed per answer (visual only, not blocking)
- **Fallback:** If question pack missing, show generic questions

### Industry Content Loading

- **Required:** Content file must exist
- **Validation:** Industry section must exist in content file
- **Error:** Show fallback content if industry not found

---

## Error Handling

### Missing Industry Content

**Scenario:** Industry selected but content not found in file

**Handling:**
- Log error to console
- Show generic questions as fallback
- Display warning message to user
- Allow user to continue with generic content

### Invalid Industry Identifier

**Scenario:** Invalid industry identifier in wizard data

**Handling:**
- Validate industry identifier on load
- Reset to null if invalid
- Prompt user to select industry again
- Show error message

### Industry Content Load Failure

**Scenario:** Content file fails to load

**Handling:**
- Show generic questions as fallback
- Log error for debugging
- Allow user to continue
- Retry content load in background

---

## Performance Considerations

### Content Loading

- **Strategy:** Load all industry content on wizard initialization
- **Caching:** Cache content in memory after first load
- **Lazy Loading:** Load industry-specific content only when industry selected

### Content File Size

- **Target:** Keep content file under 100KB
- **Optimization:** Use efficient data structure
- **Compression:** Consider compression if file grows large

---

## Success Criteria

### Industry Logic Completion Criteria

- [ ] All 13 industries have content definitions
- [ ] Conditional questions display correctly for each industry
- [ ] Industry selection triggers correct content
- [ ] Industry-specific validation works
- [ ] Industry content loads efficiently
- [ ] Error handling works for missing content
- [ ] Industry context included in AI generation
- [ ] Industry-specific AI suggestions work

### User Acceptance Criteria

- User can select any industry
- User sees industry-specific questions
- User can complete industry-specific sections
- Industry context used in deck generation
- Industry-specific suggestions appear
- All industries work correctly

---

**Industry Logic Level:** Defines conditional logic system for industry-specific content and behavior.

**Next:** See `10-export.md` for export functionality, `11-presentation-mode.md` for presentation mode.
