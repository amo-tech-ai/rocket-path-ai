# Pitch Deck System — AI Integration

> **Level:** Implementation | **Purpose:** AI agent integration specifications and behaviors  
> **Category:** Backend | **Subcategory:** AI Integration  
> **Phase:** 1 | **Priority:** P0  
> **No Code:** AI model specifications, prompt engineering, and behavior definitions only

---

## AI Models Overview

### Primary Models

1. **Gemini 3 Pro Preview** — Deck generation, deep analysis, structured output
2. **Gemini 3 Flash Preview** — Real-time suggestions, quick responses
3. **Gemini 3 Pro Image Preview** — Image generation for slides

### Model Selection Strategy

- **Deck Generation:** Gemini 3 Pro Preview (high thinking, structured output)
- **Industry Suggestions:** Gemini 3 Flash Preview (fast, real-time)
- **Slide Analysis:** Gemini 3 Pro Preview (deep analysis)
- **Image Generation:** Gemini 3 Pro Image Preview (image creation)

---

## Deck Generator Agent

### Model Configuration

**Model:** gemini-3-pro-preview  
**Thinking Level:** high  
**Temperature:** 0.7  
**Max Tokens:** 8000  
**Timeout:** 60 seconds

### Input Structure

**Required Data:**
- Wizard data from `metadata.wizard_data`
- Startup data from `startups` table
- Selected industry identifier
- Template identifier (yc, sequoia, custom, series_a)
- Slide count (10, 12, or 15)

**Prompt Structure:**
- System context: Role definition, output format requirements
- User context: Wizard data, startup data, industry, template
- Instructions: Generate deck following template structure

### Output Structure

**Structured Output Schema:**
- **title:** Deck title string
- **template:** Template identifier
- **slides:** Array of slide objects

**Slide Object Structure:**
- **number:** Slide number (1-based)
- **title:** Slide title string
- **type:** Slide type (title, problem, solution, product, market, business_model, traction, competition, team, financials, ask, contact, custom)
- **content:** Main slide content text
- **bullet_points:** Array of bullet point strings
- **speaker_notes:** Speaker notes text (optional)

### Generation Process

**Step 1: Context Preparation**
- Load wizard data
- Load startup data
- Load industry-specific content
- Prepare template structure

**Step 2: Prompt Construction**
- Build system prompt with role and format
- Build user prompt with all context data
- Include industry-specific instructions
- Include template-specific guidelines

**Step 3: API Call**
- Call Gemini 3 Pro Preview with Thinking Mode
- Use Structured Output for consistent format
- Set timeout to 60 seconds
- Handle streaming response (if supported)

**Step 4: Response Processing**
- Parse structured output
- Validate slide structure
- Extract slides array
- Validate slide count matches request

**Step 5: Incremental Saving**
- For each slide in response:
  - Create `pitch_deck_slides` row
  - Set `deck_id`, `slide_number`, `slide_type`, `title`
  - Store content in `content` JSONB field
  - Update generation log `slide_count_generated`

### Error Handling

**API Errors:**
- Rate limiting: Retry with exponential backoff (max 3 retries)
- Timeout: Return partial results if available
- Invalid response: Retry with adjusted prompt
- Network error: Queue for retry, return error to user

**Validation Errors:**
- Missing slides: Log error, return partial deck
- Invalid slide structure: Log error, skip invalid slides
- Slide count mismatch: Log warning, use actual count

---

## Smart Interviewer Agent

### Model Configuration

**Model:** gemini-3-flash-preview (with Search + URL Context)
**Temperature:** 0.7
**Max Tokens:** 4000
**Timeout:** 15 seconds

### Purpose

Generate 6-8 dynamic industry-specific interview questions for Step 3 of the wizard. Uses Gemini Search + URL Context to research the startup's website and industry before generating questions.

### Input Structure

**Required Data:**
- Step 1 data: company name, website URL, industry, sub-category, stage
- Step 2 data: problem, solution, differentiator, metrics, funding stage
- Industry question pack from `11-industry-strategy.md`

### Process

1. Load industry question pack for `selected_industry`
2. Call Gemini Flash with Search + URL Context:
   - Extract website summary from `website_url`
   - Detect industry keywords and competitors
   - Find benchmark metrics for the industry
3. Filter question pack by `stage_filter` matching funding stage
4. De-duplicate: Remove questions already answered in Steps 1+2
5. Rank by `investor_weight` (highest priority first)
6. Return 6-8 questions + research context

### Output Structure

**Questions Array:**
- **id:** Question identifier
- **question_text:** The question to display
- **input_type:** text, textarea, number, or select
- **slide_mapping:** Which slide this answer feeds (e.g., "market_size", "competition")
- **why_it_matters:** Investor context hint
- **example_answer:** Expandable example
- **ai_suggestion:** Pre-filled suggestion from research (optional)

**Research Context:**
- **website_summary:** Extracted website description
- **industry_keywords:** Detected keywords
- **competitors:** Found competitors
- **benchmarks:** Industry benchmark metrics

### Error Handling

- Gemini API error: Return static questions from question pack (no research context)
- URL extraction failure: Continue with questions, skip website research
- Timeout: Return first available questions, continue research in background

---

## Industry Suggestions Agent

### Model Configuration

**Model:** gemini-3-flash-preview  
**Temperature:** 0.8  
**Max Tokens:** 1000  
**Timeout:** 5 seconds

### Input Structure

**Required Data:**
- Selected industry identifier
- Current wizard step data
- Step number (1, 2, 3, or 4)

**Prompt Structure:**
- System context: Industry expert role
- User context: Industry, step data, step number
- Instructions: Provide industry-specific suggestions

### Output Structure

**Suggestion Format:**
- **insight:** Industry-specific insight text
- **suggestions:** Array of 3-4 suggestion strings
- **pro_tip:** Industry-specific pro tip

### Generation Process

**Step 1: Context Preparation**
- Load industry-specific content
- Load current step data
- Identify step context

**Step 2: Prompt Construction**
- Build industry-specific prompt
- Include step context
- Request suggestions format

**Step 3: API Call**
- Call Gemini 3 Flash Preview
- Set timeout to 5 seconds
- Handle quick response

**Step 4: Response Processing**
- Parse suggestion response
- Extract insight, suggestions, pro tip
- Return to frontend for display

### Error Handling

**API Errors:**
- Timeout: Return cached suggestions if available
- Error: Return empty suggestions, don't block user
- Network error: Silently fail, don't show error

---

## Slide Analyzer Agent

### Model Configuration

**Model:** gemini-3-pro-preview  
**Temperature:** 0.5  
**Max Tokens:** 2000  
**Timeout:** 10 seconds

### Input Structure

**Required Data:**
- Slide content (title, content, bullet_points)
- Slide type
- Deck context (industry, template, stage)

**Prompt Structure:**
- System context: Slide quality analyst role
- User context: Slide content, type, context
- Instructions: Analyze clarity, impact, tone

### Output Structure

**Analysis Format:**
- **clarity:** Score 0-10 with reasoning
- **impact:** Score 0-10 with reasoning
- **tone:** Score 0-10 with reasoning
- **feedback:** Specific recommendations text
- **overall_score:** Average of three scores

### Generation Process

**Step 1: Context Preparation**
- Load slide content
- Load deck context
- Identify slide type

**Step 2: Prompt Construction**
- Build analysis prompt
- Include scoring criteria
- Request structured output

**Step 3: API Call**
- Call Gemini 3 Pro Preview
- Set timeout to 10 seconds
- Use structured output

**Step 4: Response Processing**
- Parse analysis response
- Extract scores and feedback
- Cache for 5 minutes
- Return to frontend

### Error Handling

**API Errors:**
- Timeout: Return cached analysis if available
- Error: Return default scores (5/10), no feedback
- Network error: Silently fail, show cached analysis

---

## Image Generator Agent

### Model Configuration

**Model:** gemini-3-pro-image-preview  
**Temperature:** 0.8  
**Max Tokens:** 500  
**Timeout:** 15 seconds

### Input Structure

**Required Data:**
- Image prompt text
- Slide context (title, content, type)
- Deck context (industry, template)

**Prompt Structure:**
- System context: Image generation guidelines
- User context: Image prompt, slide context
- Instructions: Generate appropriate slide image

### Output Structure

**Image Format:**
- **image_url:** URL to generated image
- **image_prompt:** Prompt used for generation
- **generated_at:** Timestamp of generation

### Generation Process

**Step 1: Prompt Enhancement**
- Start with `content.image_prompt` from slide
- Enhance with slide context if prompt is generic
- Add industry-specific style guidance
- Add template-specific style guidance

**Step 2: API Call**
- Call Gemini 3 Pro Image Preview
- Send enhanced prompt
- Set timeout to 15 seconds

**Step 3: Response Processing**
- Receive image data (base64 or URL)
- Upload to Supabase Storage
- Get public URL
- Update `content.image_url` in slide

**Step 4: Storage**
- Store image in Supabase Storage
- Path: `pitch-decks/{deck_id}/slides/{slide_id}/image.{ext}`
- Set public access
- Return public URL

### Error Handling

**API Errors:**
- Timeout: Return error, allow retry
- Invalid prompt: Return error with suggestion
- Network error: Return error, allow retry

**Storage Errors:**
- Upload failure: Return error, allow retry
- Permission error: Log error, return error to user

---

## AI Copilot Agents (6 Agents — Post-MVP)

### Agent 1: Clarity Agent

**Purpose:** Improve slide clarity and understandability

**Input:**
- Slide content (title, content, bullet_points)
- Slide type

**Output:**
- Suggestion text for improving clarity
- Reasoning explanation
- Specific recommendations

**Model:** gemini-3-flash-preview  
**Timeout:** 3 seconds

### Agent 2: Impact Agent

**Purpose:** Strengthen impact statements

**Input:**
- Slide content
- Slide type

**Output:**
- Suggestion text for strengthening impact
- Reasoning explanation
- Specific recommendations

**Model:** gemini-3-flash-preview  
**Timeout:** 3 seconds

### Agent 3: Metric Agent

**Purpose:** Suggest relevant metrics

**Input:**
- Slide content
- Slide type
- Wizard data (market, traction)

**Output:**
- Suggestion text for adding metrics
- Reasoning explanation
- Specific metric recommendations

**Model:** gemini-3-flash-preview  
**Timeout:** 3 seconds

### Agent 4: Problem Agent

**Purpose:** Strengthen problem statement

**Input:**
- Slide content (if problem slide)
- Wizard data (step2_market_traction)

**Output:**
- Suggestion text for strengthening problem
- Reasoning explanation
- Specific recommendations

**Model:** gemini-3-flash-preview  
**Timeout:** 3 seconds

### Agent 5: Industry Agent

**Purpose:** Industry-specific improvements

**Input:**
- Slide content
- Selected industry
- Industry-specific content

**Output:**
- Industry-specific suggestion text
- Reasoning explanation
- Industry-specific recommendations

**Model:** gemini-3-flash-preview  
**Timeout:** 3 seconds

### Agent 6: Tone Agent

**Purpose:** Adjust tone for audience

**Input:**
- Slide content
- Deck stage (pre-seed, seed, series_a, series_b)
- Template type

**Output:**
- Suggestion text for tone adjustment
- Reasoning explanation
- Specific recommendations

**Model:** gemini-3-flash-preview  
**Timeout:** 3 seconds

### Copilot Generation Process

**Parallel Execution:**
- Call all 6 agents in parallel
- Each agent returns one suggestion
- Aggregate results into suggestions array
- Return to frontend for display

**Error Handling:**
- If agent fails: Return empty suggestion for that agent
- Don't block other agents
- Show available suggestions only

---

## Prompt Engineering Guidelines

### System Prompts

**Structure:**
- Role definition (e.g., "You are a pitch deck expert")
- Output format requirements
- Quality criteria
- Constraints and guidelines

**Best Practices:**
- Be specific about role and expertise
- Define output format clearly
- Include quality criteria
- Set constraints (length, style, tone)

### User Prompts

**Structure:**
- Context data (wizard data, startup data)
- Specific instructions
- Examples (few-shot learning, optional)
- Output format reminder

**Best Practices:**
- Include all relevant context
- Be specific about requirements
- Use structured data format
- Include examples when helpful

### Few-Shot Examples

**When to Use:**
- Complex output formats
- Industry-specific patterns
- Template-specific structures
- Quality benchmarks

**Format:**
- Input example
- Output example
- Explanation of pattern

---

## Performance Optimization

### Caching Strategy

**Cache Keys:**
- Industry suggestions: `industry:{industry}:step:{step}`
- Slide analysis: `slide:{slide_id}:analysis`
- AI copilot: `slide:{slide_id}:copilot`

**Cache Duration:**
- Industry suggestions: 1 hour
- Slide analysis: 5 minutes
- AI copilot: 10 minutes

**Cache Invalidation:**
- Slide analysis: Invalidate on content change
- AI copilot: Invalidate on content change
- Industry suggestions: Invalidate on industry change

### Rate Limiting

**Per User:**
- Deck generation: 10 per hour
- Image generation: 20 per hour
- Slide analysis: 50 per hour
- AI copilot: 100 per hour

**Global:**
- API rate limits: Respect Gemini API limits
- Queue system: Queue requests if rate limit exceeded

### Error Recovery

**Retry Strategy:**
- Exponential backoff: 1s, 2s, 4s
- Max retries: 3
- Retry on: Network errors, rate limits, timeouts
- Don't retry on: Validation errors, authentication errors

**Fallback Strategy:**
- Cached responses: Use cached data if available
- Default values: Return safe defaults
- Partial results: Return partial data if possible

---

## Security Considerations

### API Key Management

- Store API keys in environment variables
- Never expose keys in client code
- Rotate keys regularly
- Monitor key usage

### Input Validation

- Validate all input data
- Sanitize user-provided prompts
- Limit prompt length
- Validate structured output

### Output Validation

- Validate structured output format
- Sanitize generated content
- Check for inappropriate content
- Validate image URLs

---

**AI Integration Level:** Defines all AI agent behaviors, model configurations, and prompt engineering guidelines.

**Next:** See `08-testing.md` for testing strategy, `09-industry-logic.md` for industry logic implementation.
