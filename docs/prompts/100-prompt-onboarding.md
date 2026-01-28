# Prompt: Onboarding Wizard Module

> **Phase:** Complete | **Priority:** P0 | **Overall:** 100%
> **Edge Function:** `onboarding-agent` (deployed, v67, 13 actions)
> **AI Model:** Gemini 3 Flash (URL Context + Google Search + Structured Output)

---

## Module Purpose

4-step AI-powered onboarding wizard that transforms a company URL into a complete startup profile. Extracts data from websites, enriches founder profiles, conducts smart interviews, and generates investor readiness scores.

---

## Auth User Journey

### New User Flow

```
Landing Page (/)
  → Click "Get Started" or "Start Your Profile"
    → /login (OAuth buttons: Google, LinkedIn)
      → OAuth provider consent
        → /auth/callback (PKCE code exchange)
          → Check wizard_sessions for user
            → No completed session → /onboarding (wizard starts at Step 1)
            → Has completed session → /dashboard
```

### Returning User (Incomplete Wizard)

```
/login → OAuth → /auth/callback
  → Check wizard_sessions.status
    → status = 'in_progress' → /onboarding (resume at current_step)
    → status = 'completed' → /dashboard
```

### Session Recovery

```
User closes browser mid-wizard
  → Returns later, signs in
    → Wizard resumes at last saved step (auto-save every 2 seconds)
    → All form data preserved in wizard_sessions.form_data
```

---

## User Stories

| # | As a... | I want to... | So that... |
|---|---------|-------------|-----------|
| 1 | New founder | Enter my website URL and have AI extract my company info | I don't have to manually fill 20+ fields |
| 2 | First-time user | See what AI detected about my business | I can verify accuracy before proceeding |
| 3 | Founder | Answer targeted interview questions | The system understands my traction and goals |
| 4 | Startup owner | Get an investor readiness score | I know how prepared I am for fundraising |
| 5 | User | Resume where I left off if I close the browser | I don't lose my progress |
| 6 | Founder | See AI-generated summary of my startup | I have a pitch-ready description |

---

## Screen 1: Step 1 — Context & Input

### Purpose
Collect company basics and trigger AI enrichment from website URL.

### Screen Content

**Header:** "Let's set up your startup profile"

**Form Fields:**
- Company Name (required, text)
- Website URL (optional, triggers AI extraction on blur)
- Description (required, textarea, 500 char max)
- Target Market (required, combobox with suggestions)
- LinkedIn URL (optional, triggers founder enrichment)
- Additional URLs (optional, multi-URL array)

**AI Detected Fields (read-only badges after enrichment):**
- Industry (single-select chips)
- Business Model (multi-select chips)
- Stage (single-select chips)

**Right Panel — AI Assistant:**
- Enrichment status indicator
- Detected signals list
- Confidence score

### Data Flow

| User Action | AI Agent Action | Data Written |
|-------------|-----------------|--------------|
| Enters URL, blurs field | `enrich_url` | wizard_sessions.ai_extractions, wizard_extractions |
| Enters description | `enrich_context` | wizard_sessions.ai_extractions.context |
| Enters LinkedIn URL | `enrich_founder` | wizard_sessions.form_data.founder |
| Clicks Next | Validation + save | wizard_sessions.form_data, current_step = 2 |

### Validation Rules
- Company name: required, 2-100 characters
- Description: required, 10-500 characters
- Target market: required, must select from list

---

## Screen 2: Step 2 — AI Analysis

### Purpose
Display AI-extracted data for verification and calculate profile readiness score.

### Screen Content

**Header:** "Review what we found"

**Cards (6 total):**
1. **Startup Overview** — name, description, industry, stage
2. **Founder Identity** — name, title, LinkedIn summary, avatar
3. **Website Insights** — extracted value prop, features, pricing
4. **Competitor Intel** — list of 3-5 competitors with rescan button
5. **Detected Signals** — badges for PMF, traction, fundraising, etc.
6. **Research Queries** — AI-generated search queries used

**Right Panel:**
- Readiness Score (0-100 gauge)
- Score breakdown by category
- "Rescan" button to re-enrich

### Data Flow

| User Action | AI Agent Action | Data Written |
|-------------|-----------------|--------------|
| Page loads | `calculate_readiness` | wizard_sessions.profile_strength |
| Clicks Rescan | `enrich_url` + `generate_competitors` | wizard_sessions.ai_extractions |
| Clicks Next | Save | wizard_sessions.current_step = 3 |

---

## Screen 3: Step 3 — Smart Interview

### Purpose
Conduct AI-driven interview to extract traction data, funding status, and business signals.

### Screen Content

**Header:** "A few quick questions"

**Question Card:**
- Current question (1 of 5)
- Textarea for answer
- Skip button (optional questions)
- Continue button

**Topic Badges (track progress):**
- Traction, Market, Team, Product, Fundraising
- Badge fills when topic covered

**Right Panel — Signals Detected:**
- Real-time extraction as user answers
- Shows: MRR range, user count, team size, PMF status, fundraising status

### Data Flow

| User Action | AI Agent Action | Data Written |
|-------------|-----------------|--------------|
| Page loads | `get_questions` | Display 5 contextual questions |
| Submits answer | `process_answer` | wizard_sessions.interview_answers, extracted_traction, signals |
| Skips question | None | Skip to next question |
| Completes all | Save | wizard_sessions.current_step = 4, interview_progress = 100 |

### Interview Topics (5 questions, dynamic based on context)
1. **Traction** — "What's your current revenue or user growth?"
2. **Market** — "Who are your ideal customers?"
3. **Team** — "Tell us about your founding team"
4. **Product** — "What makes your solution unique?"
5. **Fundraising** — "Are you currently raising? What's your target?"

---

## Screen 4: Step 4 — Review & Complete

### Purpose
Show investor readiness score, AI summary, and create the startup record.

### Screen Content

**Header:** "Your startup profile is ready"

**Cards (4 total):**
1. **Investor Score Card** — 0-100 score with 5-category breakdown (team, traction, market, product, fundraising)
2. **AI Summary Card** — Generated pitch paragraph
3. **Company Details Card** — Collapsible review of all data
4. **Traction & Funding Card** — MRR, users, team size, fundraising status

**Complete Button:** "Complete Setup" (creates startup, org, redirects to dashboard)

### Data Flow

| User Action | AI Agent Action | Data Written |
|-------------|-----------------|--------------|
| Page loads | `calculate_score` | wizard_sessions.investor_score |
| Page loads | `generate_summary` | wizard_sessions.ai_summary |
| Clicks Complete | `complete_wizard` | organizations, startups, profiles.org_id, wizard_sessions.status = 'completed' |
| After complete | Redirect | Navigate to /dashboard |

---

## Supabase Backend

### Database Tables

**`wizard_sessions`** — Wizard state and progress

| Column | Type | Purpose |
|--------|------|---------|
| id | uuid PK | Session identifier |
| user_id | uuid FK → auth.users | Owner |
| startup_id | uuid FK → startups | Created startup (after completion) |
| current_step | integer | 1-4 |
| status | text | in_progress, completed, abandoned |
| form_data | jsonb | All form field values |
| interview_answers | jsonb | Q&A pairs |
| interview_progress | integer | 0-100 |
| signals | text[] | Detected business signals |
| extracted_traction | jsonb | MRR, users, team size |
| extracted_funding | jsonb | Fundraising status, target |
| ai_extractions | jsonb | URL enrichment results |
| ai_summary | jsonb | Generated pitch summary |
| investor_score | integer | 0-100 |
| profile_strength | integer | 0-100 readiness score |
| grounding_metadata | jsonb | Google Search sources |
| enrichment_confidence | integer | 0-100 |

**`wizard_extractions`** — Individual AI extraction records

| Column | Type | Purpose |
|--------|------|---------|
| id | uuid PK | Extraction identifier |
| session_id | uuid FK → wizard_sessions | Parent session |
| extraction_type | text | url, context, founder, competitors |
| source_url | text | URL that was analyzed |
| extracted_data | jsonb | Structured extraction result |
| confidence | numeric | 0-1 confidence score |
| ai_run_id | uuid FK → ai_runs | Logging reference |

**`profiles`** — User profile (updated on completion)

| Column | Type | Purpose |
|--------|------|---------|
| id | uuid PK = auth.users.id | User identifier |
| org_id | uuid FK → organizations | Set after wizard completion |
| onboarding_completed | boolean | Gates dashboard access |

**`organizations`** — Created on wizard completion

| Column | Type | Purpose |
|--------|------|---------|
| id | uuid PK | Org identifier |
| name | text | Company name |
| slug | text | URL-friendly identifier |

**`startups`** — Created on wizard completion

| Column | Type | Purpose |
|--------|------|---------|
| id | uuid PK | Startup identifier |
| org_id | uuid FK → organizations | Parent org |
| name | text | Company name |
| description | text | AI-enriched description |
| industry | text | Detected industry |
| stage | text | seed, pre_seed, series_a, etc. |
| business_model | text[] | SaaS, marketplace, etc. |
| traction_data | jsonb | Extracted metrics |
| investor_ready_score | integer | 0-100 |
| ai_summary | text | Generated pitch |

### RLS Policies

- `wizard_sessions`: user_id = auth.uid() (users own their sessions)
- `profiles`: id = auth.uid() (users own their profile)
- `organizations`: created via service role (bypasses RLS for new users)
- `startups`: org_id matches user's org via startup_in_org()

---

## Edge Function: onboarding-agent

### Actions Catalog

| Action | Input | Output | AI Features |
|--------|-------|--------|-------------|
| `create_session` | user_id | session_id | None |
| `update_session` | session_id, form_data, current_step | updated session | None |
| `reset_session` | session_id | new session_id | Archives old, creates new |
| `enrich_url` | session_id, url | extracted company data | Gemini URL Context |
| `enrich_context` | session_id, description | competitors, signals | Gemini Google Search |
| `enrich_founder` | session_id, linkedin_url | founder profile | Gemini URL Context |
| `generate_competitors` | session_id | competitor list | Gemini Google Search |
| `get_questions` | session_id, topics_covered | 5 questions | Gemini structured output |
| `process_answer` | session_id, question, answer | signals, traction | Gemini extraction |
| `calculate_readiness` | session_id | profile_strength 0-100 | Gemini analysis |
| `calculate_score` | session_id | investor_score 0-100 | Gemini scoring |
| `generate_summary` | session_id | pitch paragraph | Gemini generation |
| `complete_wizard` | session_id | startup_id, org_id | Service role client |

### Gemini 3 Features Used

| Feature | Used In | Purpose |
|---------|---------|---------|
| URL Context | enrich_url, enrich_founder | Read website content without scraping |
| Google Search | enrich_context, generate_competitors | Find competitors, market data |
| Structured Output | All extraction actions | JSON schema-constrained responses |
| Grounding Metadata | enrich_context | Citation sources for transparency |

---

## Frontend-Backend Wiring

| Component | Hook | Edge Function Action | Table Updated |
|-----------|------|---------------------|---------------|
| Step1Context | useEnrichment | enrich_url, enrich_context, enrich_founder | wizard_sessions, wizard_extractions |
| Step2Analysis | useScoring | calculate_readiness | wizard_sessions.profile_strength |
| Step3Interview | useInterview | get_questions, process_answer | wizard_sessions.interview_answers, extracted_traction |
| Step4Review | useScoring | calculate_score, generate_summary, complete_wizard | wizard_sessions, startups, organizations, profiles |
| WizardNavigation | useWizardSession | update_session | wizard_sessions.current_step |
| Auto-save | useWizardSession | update_session (debounced 2s) | wizard_sessions.form_data |

---

## Goals & Outcomes

| Goal | Metric | Target |
|------|--------|--------|
| Reduce manual data entry | Fields auto-filled vs typed | 80% auto-filled |
| Complete wizard in one session | Completion rate | 70%+ |
| Generate useful investor score | Score correlates with actual readiness | Validated by user feedback |
| Extract accurate traction data | Extraction accuracy | 85%+ |
| Fast AI responses | P95 latency | < 3 seconds per action |

---

## Success Criteria

### Functional
- [ ] New users redirected to /onboarding after OAuth
- [ ] URL enrichment extracts company name, description, industry, features
- [ ] Founder enrichment extracts name, title, and background
- [ ] Interview generates 5 contextual questions
- [ ] Answer processing extracts MRR, users, team size, fundraising status
- [ ] Investor score calculated with 5-category breakdown
- [ ] AI summary is a coherent 2-3 sentence pitch
- [ ] Complete wizard creates organization, startup, and updates profile
- [ ] User redirected to /dashboard after completion

### Data Integrity
- [ ] wizard_sessions.status changes from in_progress to completed
- [ ] startups record created with all extracted data
- [ ] profiles.org_id set to new organization
- [ ] profiles.onboarding_completed set to true

### Error Handling
- [ ] URL enrichment fails gracefully (allows manual entry)
- [ ] Founder enrichment optional (skip if LinkedIn not provided)
- [ ] Interview can be skipped (minimum data required)
- [ ] Complete wizard retries on failure

### Performance
- [ ] Page load < 2 seconds
- [ ] AI enrichment < 5 seconds
- [ ] Interview question generation < 3 seconds
- [ ] Complete wizard < 5 seconds

---

## Production Readiness Checklist

### Authentication
- [x] OAuth callback redirects to /onboarding for new users
- [x] Session check determines new vs returning user
- [x] JWT attached to all edge function calls
- [x] ProtectedRoute guards /onboarding route

### Database
- [x] wizard_sessions table with all required columns
- [x] wizard_extractions table for AI results
- [x] RLS policies on all tables
- [x] Service role client for complete_wizard (bypasses RLS)
- [x] Stage normalization (Seed → seed)

### Edge Function
- [x] All 13 actions implemented and tested
- [x] CORS headers for localhost:8500-8502
- [x] Error responses with user-friendly messages
- [x] AI run logging to ai_runs table
- [x] Retry logic with exponential backoff

### Frontend
- [x] All 4 steps render correctly
- [x] Form validation with Zod schemas
- [x] Auto-save debounced at 2 seconds
- [x] Loading states for all AI operations
- [x] Error toasts for failed operations
- [x] Mobile responsive layout

### AI Integration
- [x] Gemini URL Context for website extraction
- [x] Gemini Google Search for competitor discovery
- [x] Structured output schemas for all extractions
- [x] Grounding metadata preserved for citations

---

## Files Reference

| File | Purpose |
|------|---------|
| `src/pages/OnboardingWizard.tsx` | Main wizard page |
| `src/hooks/useWizardSession.ts` | Session state management |
| `src/hooks/onboarding/useEnrichment.ts` | URL/context/founder enrichment |
| `src/hooks/onboarding/useInterview.ts` | Question/answer processing |
| `src/hooks/onboarding/useScoring.ts` | Score/summary/completion |
| `src/hooks/onboarding/invokeAgent.ts` | Edge function caller with JWT |
| `src/components/onboarding/steps/` | Step components (4 files) |
| `src/components/onboarding/step1/` | Step 1 components (8 files) |
| `src/components/onboarding/step2/` | Step 2 components (7 files) |
| `src/components/onboarding/step3/` | Step 3 components (6 files) |
| `src/components/onboarding/step4/` | Step 4 components (5 files) |
| `supabase/functions/onboarding-agent/` | Edge function |
