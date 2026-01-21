# Events System - Implementation Plan

**Based on:** [12-event-changes.md](../prompts/12-event-changes.md)
**Created:** 2026-01-21

---

## Summary of Changes

This document outlines the implementation plan for connecting the Events system to real AI backend via edge functions and fixing critical issues.

---

## Implementation Steps (Sequential Order)

### Step 1: Fix Date Field References ✅
**Priority:** Critical
**Files:** 
- `src/pages/EventDetail.tsx`
- `src/components/events/EventsAIPanel.tsx`
- `src/hooks/useEvents.ts`

**Changes:**
- Replace `event.event_date` → `event.start_date` throughout
- Update query ordering from `event_date` → `start_date`

### Step 2: Connect EventsAIPanel to event-agent ✅
**Priority:** High
**File:** `src/components/events/EventsAIPanel.tsx`

**Changes:**
- Add `useQuery` hook to call `event-agent` edge function
- Replace mocked insights with AI-generated recommendations
- Add loading and error states
- Wire chat input to edge function

### Step 3: Connect WizardAIPanel to event-agent ✅
**Priority:** High  
**File:** `src/components/events/wizard/WizardAIPanel.tsx`

**Changes:**
- Add `useQuery` hook that calls edge function per wizard step
- Display AI suggestions with "Apply" buttons
- Pass callback to parent for auto-filling form fields

### Step 4: Add Analytics Tab to EventDetail ✅
**Priority:** Medium
**File:** `src/pages/EventDetail.tsx`

**Changes:**
- Add "Analytics" tab to tabs array
- Create analytics content that calls `event-agent` with `action: 'analyze'`
- Display attendance analysis, revenue breakdown, recommendations, risks
- Add "Refresh Analysis" button

### Step 5: Add Marketing Tab to EventDetail ✅
**Priority:** Medium
**File:** `src/pages/EventDetail.tsx`

**Changes:**
- Add "Marketing" tab to tabs array
- Add content type selector (social_post, email_invite, press_release, landing_page)
- Create mutation to generate content via edge function
- Display generated content with copy buttons
- Add regenerate functionality

### Step 6: Add Sponsor Search Feature ✅
**Priority:** Medium
**File:** `src/pages/EventDetail.tsx` (Sponsors tab)

**Changes:**
- Add "Find Sponsors" button with dialog
- Add industry and budget tier filters
- Call edge function for AI-powered sponsor search
- Display results with fit scores and reasoning
- Add "Generate Outreach" button for each sponsor

### Step 7: Add Venue Search Feature ✅
**Priority:** Medium
**File:** `src/pages/EventDetail.tsx` (Logistics tab)

**Changes:**
- Add "Find Venues" button with dialog
- Add location, capacity, budget filters
- Call edge function for AI-powered venue search
- Display venue suggestions with amenities
- Add "Add to Event" button

---

## Files Modified

1. `src/pages/EventDetail.tsx` - Date fix, new tabs, search features
2. `src/components/events/EventsAIPanel.tsx` - Edge function integration
3. `src/components/events/wizard/WizardAIPanel.tsx` - Edge function integration
4. `src/hooks/useEvents.ts` - Date field ordering fix
5. `docs/events/00-events-progress.md` - Updated progress
6. `CHANGELOG.md` - Documented changes

---

## Assumptions

1. **Edge function `event-agent` exists** - The changes call this function but do not create it
2. **Edge function returns structured JSON** - Expected response format is documented
3. **No new Supabase tables** - Uses existing schema only
4. **RLS policies remain as-is** - Priority 4.1 (security) is deferred for Supabase migration

---

## Testing Checklist

After implementation, verify:

- [ ] No TypeScript errors
- [ ] Pages load without console errors
- [ ] Edge function calls return data (check Network tab)
- [ ] Loading states display correctly
- [ ] Error states handled gracefully
- [ ] Date displays correctly (uses start_date)
- [ ] Analytics tab shows analysis or graceful empty state
- [ ] Marketing tab generates content or shows loading
- [ ] Sponsor search returns results
- [ ] Venue search returns results

---

## Status: 100% Complete

All requested changes have been implemented.
