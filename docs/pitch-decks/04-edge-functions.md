# Pitch Deck System — Edge Functions

> **Level:** Implementation | **Purpose:** Supabase Edge Functions for pitch deck operations  
> **Category:** Backend | **Subcategory:** Edge Functions  
> **Phase:** 1 | **Priority:** P0  
> **No Code:** Function specifications, API contracts, and behavior definitions only

---

## Edge Function: pitch-deck-agent

### Function Overview

**Location:** `supabase/functions/pitch-deck-agent/index.ts`  
**Runtime:** Deno  
**Authentication:** JWT required (verify via `auth.supabase`)  
**CORS:** Enabled for browser requests

### Supported Actions

1. **save_wizard_step** — Save wizard step data to JSONB
2. **resume_wizard** — Load wizard data from JSONB
3. **generate_interview_questions** — Generate Smart Interviewer questions via Gemini
4. **generate_deck** — Generate deck using Gemini 3 Pro Preview
5. **get_deck** — Fetch deck with metadata
6. **update_slide** — Update slide content JSONB
7. **get_signal_strength** — Calculate signal strength score

---

## Action Specifications

### Action 1: save_wizard_step

**Purpose:** Save wizard step data to `pitch_decks.metadata.wizard_data` JSONB field

**Request:**
- **action:** "save_wizard_step"
- **deck_id:** Optional UUID (creates new deck if missing)
- **step:** Required number (1, 2, 3, or 4)
- **step_data:** Required object with step-specific fields
- **selected_industry:** Optional string (set in step 1)
- **template_selected:** Optional string

**Process:**
1. Verify JWT token, extract user ID
2. If deck_id missing, create new `pitch_decks` row:
   - Set `user_id` from JWT
   - Set `status` to "in_progress"
   - Initialize `metadata` JSONB with empty `wizard_data` structure
3. Read current `metadata` from deck
4. Merge `step_data` into `metadata.wizard_data.step{number}_*` path
5. Update `metadata.wizard_data.updated_at` timestamp
6. Update `metadata.wizard_data.selected_industry` if provided (step 1)
8. Save updated `metadata` JSONB to database
9. Return updated wizard data

**Response:**
- **deck_id:** UUID of deck
- **wizard_data:** Complete wizard data object
- **step:** Step number that was saved
- **status:** "success" or "error"
- **error:** Error message if status is "error"

**Error Handling:**
- Invalid JWT: Return 401 Unauthorized
- Invalid step number: Return 400 Bad Request
- Missing required fields: Return 400 Bad Request
- Database error: Return 500 Internal Server Error with error message

---

### Action 2: resume_wizard

**Purpose:** Load wizard data from `pitch_decks.metadata.wizard_data` JSONB field

**Request:**
- **action:** "resume_wizard"
- **deck_id:** Required UUID

**Process:**
1. Verify JWT token, extract user ID
2. Verify deck belongs to user (RLS policy)
3. Read `pitch_decks.metadata.wizard_data` from deck
4. Return wizard data or null if not found

**Response:**
- **deck_id:** UUID of deck
- **wizard_data:** Wizard data object or null
- **status:** "success" or "error"
- **error:** Error message if status is "error"

**Error Handling:**
- Invalid JWT: Return 401 Unauthorized
- Deck not found: Return 404 Not Found
- Deck belongs to different user: Return 403 Forbidden
- Database error: Return 500 Internal Server Error

---

### Action 3: generate_interview_questions

**Purpose:** Generate Smart Interviewer questions based on Steps 1+2 data, using Gemini with Search + URL Context

**Request:**
- **action:** "generate_interview_questions"
- **deck_id:** Required UUID
- **step1_data:** Required object (startup info from step 1)
- **step2_data:** Required object (market & traction from step 2)

**Process:**
1. Verify JWT token, extract user ID
2. Verify deck belongs to user
3. Load industry question pack from `11-industry-strategy.md` based on `selected_industry`
4. Call Gemini 3 Flash Preview with Search + URL Context:
   - Extract website summary from `website_url`
   - Detect industry keywords and competitors
   - Find benchmark metrics
5. Generate 6-8 dynamic questions filtered by funding stage
6. De-duplicate questions already answered in Steps 1+2
7. Save research context to `metadata.wizard_data.step3_smart_interview.research_context`
8. Return questions array + research context

**Response:**
- **questions:** Array of question objects (id, question_text, input_type, slide_mapping, why_it_matters, example_answer)
- **research_context:** Object with website_summary, industry_keywords, competitors, benchmarks
- **total_questions:** Number of questions generated
- **status:** "success" or "error"

**Error Handling:**
- Invalid JWT: Return 401 Unauthorized
- Deck not found: Return 404 Not Found
- Missing step data: Return 400 Bad Request
- Gemini API error: Return fallback questions from static question pack
- URL extraction failure: Continue without website context

---

### Action 4: generate_deck

**Purpose:** Generate deck using Gemini 3 Pro Preview with Thinking Mode

**Request:**
- **action:** "generate_deck"
- **deck_id:** Required UUID
- **template:** Required string (yc, sequoia, custom, series_a)

**Process:**
1. Verify JWT token, extract user ID
2. Verify deck belongs to user
3. Read wizard data from `metadata.wizard_data`
4. Read startup data from `startups` table (join via user_id)
5. Fetch lean canvas from `documents` table (type=lean_canvas, latest)
6. Load industry playbook from `11-industry-strategy.md` based on `selected_industry`
7. Create generation log entry in `metadata.generation_logs[]`:
   - Set `generation_status` to "in_progress"
   - Set `started_at` to current timestamp
   - Set `ai_model_used.model` to "gemini-3-pro-preview"
   - Set `ai_model_used.thinkingLevel` to "high"
8. Call Gemini 3 Pro Preview API:
   - Use Structured Output for consistent deck format
   - Include wizard data, startup data, lean canvas, interview answers, industry playbook, research context
   - Set timeout to 60 seconds
9. For each generated slide:
   - Create `pitch_deck_slides` row immediately
   - Set `deck_id`, `slide_number`, `slide_type`, `title`
   - Store slide content in `content` JSONB field
   - Update generation log `slide_count_generated`
10. On completion:
    - Update generation log `generation_status` to "completed"
    - Set `completed_at` timestamp
    - Calculate `duration_seconds`
    - Update deck `status` to "review"
11. Calculate signal strength and store in `metadata.wizard_data.step4_review`
12. Return deck ID and slide count

**Response:**
- **deck_id:** UUID of deck
- **title:** Generated deck title
- **template:** Template identifier
- **total_slides:** Total number of slides generated
- **saved_slides:** Number of slides successfully saved
- **generation_log_id:** UUID of generation log entry
- **status:** "success" or "error"
- **error:** Error message if status is "error"

**Error Handling:**
- Invalid JWT: Return 401 Unauthorized
- Deck not found: Return 404 Not Found
- Missing wizard data: Return 400 Bad Request
- Gemini API error: Update generation log status to "failed", return error
- Partial generation: Preserve successfully saved slides, return partial success
- Database error: Return 500 Internal Server Error

**Incremental Saving:**
- Each slide saves immediately after generation
- Generation log updated with `slide_count_generated` after each slide
- If generation fails, existing slides preserved for partial recovery

---

### Action 5: get_deck

**Purpose:** Fetch deck with complete metadata JSONB

**Request:**
- **action:** "get_deck"
- **deck_id:** Required UUID

**Process:**
1. Verify JWT token, extract user ID
2. Verify deck belongs to user (RLS policy)
3. Read `pitch_decks` row with `metadata` JSONB
4. Read all `pitch_deck_slides` rows for deck
5. Return deck with slides array

**Response:**
- **deck:** Deck object with metadata JSONB
- **slides:** Array of slide objects with content JSONB
- **status:** "success" or "error"
- **error:** Error message if status is "error"

**Error Handling:**
- Invalid JWT: Return 401 Unauthorized
- Deck not found: Return 404 Not Found
- Database error: Return 500 Internal Server Error

---

### Action 6: update_slide

**Purpose:** Update slide content JSONB field

**Request:**
- **action:** "update_slide"
- **slide_id:** Required UUID
- **content:** Required object to merge into `content` JSONB

**Process:**
1. Verify JWT token, extract user ID
2. Read slide and verify deck belongs to user
3. Read current `content` JSONB from slide
4. Merge new content into existing JSONB
5. Update `pitch_deck_slides.content` JSONB field
6. Return updated slide

**Response:**
- **slide:** Updated slide object with content JSONB
- **status:** "success" or "error"
- **error:** Error message if status is "error"

**Error Handling:**
- Invalid JWT: Return 401 Unauthorized
- Slide not found: Return 404 Not Found
- Invalid content structure: Return 400 Bad Request
- Database error: Return 500 Internal Server Error

---

### Action 7: get_signal_strength

**Purpose:** Calculate signal strength score for deck

**Request:**
- **action:** "get_signal_strength"
- **deck_id:** Required UUID

**Process:**
1. Verify JWT token, extract user ID
2. Verify deck belongs to user
3. Read `metadata.wizard_data` from deck
4. Calculate signal strength using formula:
   - Profile completeness: 20% (step1_startup_info fields: name, tagline, URL, industry, stage)
   - Market & traction data: 20% (step2_market_traction: problem, solution, differentiator, metrics)
   - Smart interview depth: 25% (step3_smart_interview: answered/total ratio + research context quality)
   - AI suggestions applied: 15% (count from content.ai_suggestions[] where applied = true)
   - Slide content completeness: 10% (slides with both title and content)
   - Industry specificity: 10% (industry selection + industry-specific answers quality)
5. Calculate breakdown for each component
6. Return signal strength and breakdown

**Response:**
- **signal_strength:** Overall score (0-100)
- **signal_breakdown:** Object with individual component scores
- **status:** "success" or "error"
- **error:** Error message if status is "error"

**Error Handling:**
- Invalid JWT: Return 401 Unauthorized
- Deck not found: Return 404 Not Found
- Database error: Return 500 Internal Server Error

---

## Shared Utilities

### Authentication

**File:** `supabase/functions/_shared/auth.ts`

**Function:** `verifyAuth(request: Request)`

**Process:**
1. Extract Authorization header
2. Verify JWT token with Supabase
3. Extract user ID from token
4. Return user ID or throw error

**Error Handling:**
- Missing token: Throw 401 Unauthorized
- Invalid token: Throw 401 Unauthorized
- Expired token: Throw 401 Unauthorized

---

### CORS Handling

**File:** `supabase/functions/_shared/cors.ts`

**Headers:**
- `Access-Control-Allow-Origin`: Request origin or wildcard
- `Access-Control-Allow-Methods`: POST, GET, OPTIONS
- `Access-Control-Allow-Headers`: Content-Type, Authorization
- `Access-Control-Max-Age`: 3600

**OPTIONS Request:**
- Return 200 OK with CORS headers
- No processing required

---

### Error Responses

**File:** `supabase/functions/_shared/errors.ts`

**Standard Error Format:**
- **status:** "error"
- **error:** User-friendly error message
- **code:** Error code (optional)
- **details:** Additional error details (optional)

**HTTP Status Codes:**
- 400: Bad Request (validation errors)
- 401: Unauthorized (authentication errors)
- 403: Forbidden (authorization errors)
- 404: Not Found (resource not found)
- 500: Internal Server Error (server errors)

---

### Gemini Integration

**File:** `supabase/functions/_shared/gemini.ts`

**Function:** `generateDeck(prompt: string, config: GeminiConfig)`

**Configuration:**
- **model:** "gemini-3-pro-preview"
- **thinkingLevel:** "high"
- **responseSchema:** Structured output schema for deck format
- **temperature:** 0.7
- **timeout:** 60 seconds

**Response Format:**
- **title:** Deck title string
- **template:** Template identifier
- **slides:** Array of slide objects with number, title, type, content, bullet_points, speaker_notes

**Error Handling:**
- API errors: Retry with exponential backoff (max 3 retries)
- Timeout: Return partial results if available
- Rate limiting: Return 429 Too Many Requests

---

## Performance Requirements

### Response Times

- **save_wizard_step:** < 500ms
- **resume_wizard:** < 300ms
- **generate_deck:** < 60s (AI processing time)
- **get_deck:** < 400ms
- **update_slide:** < 300ms
- **get_signal_strength:** < 200ms

### Rate Limiting

- **Per User:** 100 requests per minute
- **Per Deck:** 10 generation requests per hour
- **Global:** 1000 requests per minute

### Cold Start Optimization

- **Warm-up:** Keep function warm with periodic pings
- **Connection Pooling:** Reuse Supabase client connections
- **Lazy Loading:** Load dependencies only when needed

---

## Security Requirements

### Authentication

- All actions require valid JWT token
- Verify token on every request
- Extract user ID from token claims

### Authorization

- Verify deck belongs to user (RLS policy)
- Verify slide belongs to user's deck
- Prevent cross-user data access

### Input Validation

- Validate all required fields
- Validate UUID formats
- Validate step numbers (1-4)
- Validate template identifiers
- Sanitize user input

### Error Messages

- Don't expose internal errors to users
- Log detailed errors server-side
- Return user-friendly error messages

---

## Logging Requirements

### Log Levels

- **INFO:** Successful operations, generation started/completed
- **WARN:** Validation errors, partial failures
- **ERROR:** API errors, database errors, generation failures

### Log Fields

- **timestamp:** ISO timestamp
- **action:** Action name
- **user_id:** User ID from JWT
- **deck_id:** Deck ID (if applicable)
- **status:** success, error, partial
- **duration:** Operation duration in milliseconds
- **error:** Error message (if applicable)

### Log Destinations

- **Console:** All logs for development
- **Supabase Logs:** Production logs
- **Error Tracking:** External service for error alerts

---

**Edge Functions Level:** Defines all backend operations for pitch deck system. Implementation should follow these specifications exactly.

**Next:** See `05-deck-editor.md` for Deck Editor implementation, `06-dashboard.md` for Dashboard implementation.
