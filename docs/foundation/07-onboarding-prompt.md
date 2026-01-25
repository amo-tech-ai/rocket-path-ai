# Onboarding Wizard - Simple Lovable Prompts

**Purpose:** Simple, direct prompts for Lovable to build the onboarding wizard  
**Current Build:** `/home/sk/startupai16L/` (source of truth)  
**Keep It Simple:** Short prompts, clear goals, verify at each step

---

## Quick Start

**What to Build:**
4-step wizard: Context → Analysis → Interview → Review

**Tech Stack:**
- React + TypeScript (Vite)
- Supabase (Database + Edge Functions)
- Gemini AI (gemini-3-flash-preview or gemini-2.0-flash fallback)

**Layout:**
3-panel: Left (Progress) | Main (Forms) | Right (AI Suggestions)

---

## Step 1: Context Collection

**Prompt:**
Create Step 1 form with:
- Company name, description, website URL
- "Enrich" button that calls `enrich_url` edge function
- Right panel shows AI-detected fields (company_name, industry, features, competitors)
- Founder cards with "Enrich from LinkedIn" button
- Required: company_name, description, target_market, 1+ founder
- Auto-save to `wizard_sessions.form_data`
- Mobile: Show toast when AI completes (right panel hidden)

**Verify:**
- [ ] Form saves data
- [ ] URL enrichment works
- [ ] Can proceed to Step 2 when valid

---

## Step 2: AI Analysis

**Prompt:**
Create Step 2 with analysis cards:
- Startup Overview (value prop, features, audience)
- Founder Identity (backgrounds, team strength)
- Competitor Intel (competitors array)
- Detected Signals (signal badges)
- Readiness Score (0-100 with "Recalculate" button)
- Right panel: AI coach with recommendations
- Auto-call `calculate_readiness` on load

**Verify:**
- [ ] Readiness score displays
- [ ] All cards render
- [ ] Can proceed to Step 3

---

## Step 3: Interview

**Prompt:**
Create Step 3 with 5 questions:
- Load questions from `get_questions` action
- Show one question at a time with progress ("X of 5")
- Radio button options for each question
- "Continue" button calls `process_answer`
- Extract signals, traction, funding, team_size, pmf_stage
- Right panel: Advisor persona + detected signals
- Save answers atomically (form_data + column-level in transaction)

**Questions:**
1. Traction (MRR) → Extract `mrr_range`
2. Users → Extract `users_range`
3. Fundraising → Extract `is_raising`, `status`
4. Team → Extract `team_size` + signals
5. PMF → Extract `pmf_stage` + signals

**Verify:**
- [ ] All 5 questions work
- [ ] Signals extract correctly
- [ ] Data saves atomically
- [ ] Can proceed to Step 4

---

## Step 4: Review & Complete

**Prompt:**
Create Step 4 with review cards:
- Investor Score (0-100 with category breakdown)
- AI Summary (executive summary, strengths, improvements)
- Traction Summary (MRR, Users from interview)
- Funding Summary (raising status from interview)
- Team Size (from Q4)
- PMF Stage (from Q5)
- "Complete Setup" button calls `complete_wizard`
- Atomic transaction: Create startup + org + tasks (all or nothing)

**Verify:**
- [ ] All data displays correctly
- [ ] Wizard completion works atomically
- [ ] Redirects to dashboard on success

---

## Edge Function Pattern

**Prompt:**
Create `onboarding-agent` edge function with:
- Handle CORS preflight (OPTIONS)
- Verify JWT authentication
- Route by action (verified actions):
  - `create_session` - Create new wizard session
  - `update_session` - Update session metadata
  - `enrich_url` - Extract company data from website URL
  - `enrich_context` - Extract market data from description
  - `enrich_founder` - Extract founder data from LinkedIn URL
  - `calculate_readiness` - Calculate readiness score (0-100)
  - `get_questions` - Get 5 interview questions
  - `process_answer` - Process answer, extract signals/traction/funding
  - `calculate_score` - Calculate investor score (0-100)
  - `generate_summary` - Generate AI summary
  - `complete_wizard` - Complete wizard (atomic: startup + org + tasks)
- Call Gemini API (gemini-3-flash-preview primary, gemini-2.0-flash fallback)
- Use URL Context + Google Search tools
- Return structured JSON with `{ success: boolean, ...data }` envelope
- Save to `wizard_sessions` table

**Error Handling:**
- Model 404 → Fallback to alternative model
- URL 403/404 → Return error with `manual_fallback: true`
- Transaction failure → Rollback, return error
- Session refresh on 401/403 errors (auto-retry once)

---

## Data Flow

**Pattern:**
1. User types → Auto-save to `wizard_sessions.form_data`
2. User clicks AI action → Hook calls edge function
3. Edge function processes → Updates database
4. Frontend updates UI → Shows results

**Database Schema (Verified):**
- Table: `wizard_sessions`
- Key columns:
  - `form_data` (jsonb) - All form inputs
  - `ai_extractions` (jsonb) - AI-detected fields from URL enrichment
  - `interview_answers` (jsonb) - Array of question answers
  - `extracted_traction` (jsonb) - Traction metrics from interview
  - `extracted_funding` (jsonb) - Funding info from interview
  - `signals` (text[]) - Extracted signals array (max 20 unique)
  - `current_step` (integer, 1-4) - Current wizard step
  - `status` (text) - 'in_progress', 'completed', 'abandoned'
  - `interview_progress` (integer) - Interview completion percentage
  - `profile_strength` (integer) - Profile strength score

**Critical:**
- `process_answer` saves to BOTH `form_data.extracted_traction/funding` AND column-level `extracted_traction/funding` (atomic transaction)
- Deduplicate signals: `signals = [...new Set(signals)]`
- Limit signals to 20 unique
- `complete_wizard` must be atomic (startup + org + tasks)

---

## Component Structure

**Files:**
- `src/components/onboarding/WizardAIPanel.tsx` - AI panel (599 lines in startupai16L)
- `src/components/onboarding/WizardLayout.tsx` - 3-panel layout
- `src/components/onboarding/StepProgress.tsx` - Progress indicator
- `src/components/onboarding/step1/` - Step 1 components
- `src/components/onboarding/step2/` - Step 2 components
- `src/components/onboarding/step3/` - Step 3 components
- `src/components/onboarding/step4/` - Step 4 components

**Hooks:**
- `src/hooks/useOnboardingAgent.ts` - AI agent calls
- `src/hooks/useWizardSession.ts` - Session management

---

## Quick Reference

**Edge Function Call:**
```typescript
supabase.functions.invoke('onboarding-agent', {
  body: { action: 'enrich_url', session_id, url },
  headers: { Authorization: `Bearer ${token}` }
})
```

**Database Save:**
```typescript
// Update form_data (with RLS check)
const { data, error } = await supabase
  .from('wizard_sessions')
  .update({ 
    form_data: data,
    last_activity_at: new Date().toISOString()
  })
  .eq('id', sessionId)
  .eq('user_id', userId) // RLS: ensure user owns session
  .select()
  .single();
```

**Database Read:**
```typescript
// Load session (with RLS check)
const { data, error } = await supabase
  .from('wizard_sessions')
  .select('*')
  .eq('id', sessionId)
  .eq('user_id', userId) // RLS: ensure user owns session
  .single();
```

**AI Model:**
- Primary: `gemini-3-flash-preview`
- Fallback: `gemini-2.0-flash` or `gemini-1.5-flash`

---

## Verification Checklist

**After Each Step:**
- [ ] Feature works
- [ ] Data saves
- [ ] Can proceed to next step
- [ ] No console errors

**Production Ready:**
- [ ] All 4 steps work end-to-end
- [ ] All AI actions work (with fallbacks)
- [ ] Atomic transactions work
- [ ] Error handling works
- [ ] Mobile feedback works (toast notifications)

---

**Keep It Simple:** One prompt at a time, verify, then move to next step.

---

## Verification Status (2026-01-25)

**✅ Verified Against Supabase:**
- Database schema: `wizard_sessions` table structure confirmed
- Edge function actions: All 11 actions verified in `/home/sk/startupai16L/supabase/functions/onboarding-agent/index.ts`
- Supabase client: Configuration verified in `src/integrations/supabase/client.ts`
- Hooks: `useOnboardingAgent.ts` and `useWizardSession.ts` patterns verified
- RLS: Row Level Security enabled on `wizard_sessions` table

**Database Columns Verified:**
- `form_data` (jsonb) ✓
- `ai_extractions` (jsonb) ✓
- `interview_answers` (jsonb) ✓
- `extracted_traction` (jsonb) ✓
- `extracted_funding` (jsonb) ✓
- `signals` (text[]) ✓
- `current_step` (integer, 1-4) ✓
- `status` (text: 'in_progress'|'completed'|'abandoned') ✓

**Edge Function Actions Verified:**
- `create_session` ✓
- `update_session` ✓
- `enrich_url` ✓
- `enrich_context` ✓
- `enrich_founder` ✓
- `calculate_readiness` ✓
- `get_questions` ✓
- `process_answer` ✓
- `calculate_score` ✓
- `generate_summary` ✓
- `complete_wizard` ✓
