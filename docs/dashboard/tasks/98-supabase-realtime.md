# Supabase Realtime AI Assistant — Dashboard Integration

> **Date:** 2026-01-27 | **Version:** 1.0
> **Source:** `100-new-dashboard-system.md` (screens) + `tasks/supabase/01-ai-real-time.md` (strategy)
> **Status:** Proposal

---

## Overview

This document maps the Supabase Realtime strategy onto every dashboard screen. Each screen gets a realtime channel, event subscriptions, and UI behaviors that make AI feel alive rather than request-response.

---

## Screen-by-Screen Realtime Plan

### 1. Main Dashboard (Command Center)

**Channel:** `dashboard:{userId}:events`
**Hook:** `useDashboardRealtime(userId)`

| UI Element | Realtime Event | Behavior |
|-----------|----------------|----------|
| Health Score gauge | `health_score_updated` | Animate score dial from old to new value. Flash category that changed. Show trend arrow (up/down). |
| KPI cards (Decks, Investors, Tasks, Events) | `tasks_generated`, `investor_scored`, `deck_ready` | Increment counter with subtle bounce. Show "+N new" badge that fades after 5s. |
| Daily Priority Briefing | `priorities_refreshed` | Refresh top 3-5 priorities on login. Completing one triggers re-rank for next session. |
| Strategy Progress Feed | All agent events | Append timestamped entries to scrollable timeline. Filter by module. Newest on top. |
| Risk Alerts | `risk_detected` | Orange/red card slides in from right. Severity badge. Dismiss after action. |
| Alignment Gauge | `alignment_updated` | Circular gauge animates. Green (80+), yellow (50-79), red (<50). "Realign" button appears on drop. |
| Deck Activity list | `deck_ready`, `slide_completed` | Update "edited X ago" timestamp. Show activity dot. |
| Insights Tabs | `strategy_synced` | Refresh tab content when underlying data changes. Subtle "Updated" badge. |
| Upcoming Events card | DB trigger on `industry_events` | Add new events, sort by date. |
| Calendar widget | `tasks_generated` | Dot indicators for days with due tasks. |

**What NOT to make realtime:** Static quick action links, greeting text (only refreshes on page load), stage label (rare change).

---

### 2. CRM Module

#### 2a. Contacts View

**Channel:** `crm:{startupId}:events`
**Hook:** `useCRMRealtime(startupId)`

| UI Element | Realtime Event | Behavior |
|-----------|----------------|----------|
| Contact cards | `contact_enriched` | Score badge animates to new value. Enriched fields fade in (company, role, bio). Shimmer effect during enrichment. |
| Score badges | `contact_enriched` | Color transitions: red→yellow→green as score improves. |
| AI Suggestions panel | `pipeline_analyzed` | "N contacts not reached in 30 days" count updates. Duplicate alerts appear. |

#### 2b. Deal Pipeline

| UI Element | Realtime Event | Behavior |
|-----------|----------------|----------|
| Deal cards | `deal_scored` | Probability % updates with animation. Stage-specific next steps refresh in tooltip. |
| Pipeline Summary bar | `deal_scored`, `pipeline_analyzed` | Total value, weighted forecast recalculate. Conversion rate badges update. |
| Stall alerts | `risk_detected` (deal type) | Orange border on deals idle >14 days. "Stalling" badge. |

#### 2c. Contact Detail Sheet

| UI Element | Realtime Event | Behavior |
|-----------|----------------|----------|
| Enrichment data section | `contact_enriched` | Cards animate in one by one (company info → focus areas → recent activity). |
| AI Suggestions | `contact_enriched` | Suggestions regenerate based on new enrichment data. |
| Communications timeline | DB trigger on `communications` | New entries prepend with slide-down animation. |

---

### 3. Investors Module

#### 3a. Investor Discovery

**Channel:** `investors:{startupId}:events`
**Hook:** `useInvestorsRealtime(startupId)`

| UI Element | Realtime Event | Behavior |
|-----------|----------------|----------|
| Investor cards | `investor_scored` | Fit score badge animates. Cards re-sort by score. New matches slide in at top. |
| Warm Paths panel | `investor_scored` | Mutual connection count updates. New paths appear. |
| Discovery results | `investor_scored` | After bulk discovery, cards appear one by one (staggered 300ms) instead of all at once. |

#### 3b. Investor Pipeline

| UI Element | Realtime Event | Behavior |
|-----------|----------------|----------|
| Pipeline columns | `investor_scored` | Cards update fit scores in-place. |
| Fundraising Progress bar | `readiness_score_updated` | Bar fills with animation. Committed amount updates. |
| Stage transitions | DB trigger on `investors` | Moving a card triggers AI rescore. New probability appears. |

#### 3c. Investor Detail Sheet

| UI Element | Realtime Event | Behavior |
|-----------|----------------|----------|
| Fit Breakdown bars | `investor_scored` | Each bar animates to new value. Category labels update. |
| Engagement History | DB trigger on `investors` | New entries prepend. |

---

### 4. Projects Module

#### 4a. Projects List

**Channel:** `tasks:{startupId}:events`
**Hook:** `useTasksRealtime(startupId)`

| UI Element | Realtime Event | Behavior |
|-----------|----------------|----------|
| Project cards | `tasks_generated` | Task count increments. Progress bar animates. "+N tasks" badge. |
| Progress bars | DB trigger on `tasks` (status change) | Fill percentage recalculates on task completion. |

#### 4b. Project Detail

| UI Element | Realtime Event | Behavior |
|-----------|----------------|----------|
| Task list | `tasks_generated` | New AI tasks slide in at top with AI badge icon. Counter updates. |
| AI Generate button | `tasks_generated` | Button shows spinner during generation, then "N tasks added" confirmation. |

#### 4c. Tasks Board (Kanban)

| UI Element | Realtime Event | Behavior |
|-----------|----------------|----------|
| Kanban columns | `tasks_generated` | New cards appear in Pending column with slide-in animation and AI badge. |
| AI Suggestions panel | `tasks_generated` | Suggestion cards appear. "Add" button adds to board with animation. |
| Priority badges | `priorities_refreshed` | Badge colors update. Cards may reorder within columns. |
| Bottleneck alert | `risk_detected` (bottleneck type) | Red banner appears above board showing blocked category and suggestion. |

---

### 5. Documents Module

#### 5a. Document Library

**Channel:** `documents:{startupId}:events`
**Hook:** `useDocumentsRealtime(startupId)`

| UI Element | Realtime Event | Behavior |
|-----------|----------------|----------|
| Document grid | `document_analyzed` | Analysis badge appears on card (quality score). |
| Upload zone | DB trigger on `documents` | New uploads appear in grid with fade-in. |

#### 5b. Document Detail

| UI Element | Realtime Event | Behavior |
|-----------|----------------|----------|
| Quality score | `document_analyzed` | Score animates from 0 to value. Completeness checklist items toggle green/red. |
| Suggestions panel | `document_analyzed` | Improvement suggestions appear one by one (staggered). |

#### 5c. AI Generate Dialog

| UI Element | Realtime Event | Behavior |
|-----------|----------------|----------|
| Generate button | `document_analyzed` | Progress indicator during generation. Redirects to detail on complete. |

---

### 6. Lean Canvas Module

#### 6a. Canvas Editor

**Channel:** `canvas:{documentId}:events`
**Hook:** `useCanvasRealtime(documentId)`

| UI Element | Realtime Event | Behavior |
|-----------|----------------|----------|
| 9-box grid | `canvas_prefilled` | Boxes populate one by one (staggered 200ms) with typing animation. |
| Individual boxes | `canvas_saved` | Autosave indicator: "Saving..." → "Saved ✓". |
| Validation badges | `canvas_validated` | Per-box colored borders appear: green (complete), yellow (needs work), red (missing). Overall score animates. |
| AI Suggestions panel | `box_suggested` | Suggestions for selected box appear. "Apply" buttons. |
| Co-editing indicators | `canvas_saved` (from other user) | Avatar bubble shows who's editing which box. Cursor presence (future). |

---

### 7. Pitch Deck Module

#### 7a. Deck Wizard

**Channel:** `pitchdeck:{deckId}:events`
**Hook:** `usePitchDeckRealtime(deckId)`

| UI Element | Realtime Event | Behavior |
|-----------|----------------|----------|
| Generate button | `slide_completed` | Progress bar: "Generating slide N of 12..." Each slide thumbnail appears as completed. |

#### 7b. Deck Editor

| UI Element | Realtime Event | Behavior |
|-----------|----------------|----------|
| Slide navigator thumbnails | `slide_completed` | Thumbnails populate left-to-right during generation. |
| Slide score badges | `slide_completed` | Score badge appears on each thumbnail after scoring. |
| Signal Strength meter | `deck_ready` | Overall signal bar fills. |
| "Improve" button result | `slide_completed` (for refinement) | Slide content updates with diff highlighting (new content in sage). |

#### 7c. Deck Preview

| UI Element | Realtime Event | Behavior |
|-----------|----------------|----------|
| Signal strength | `deck_ready` | Updates if deck is re-scored after edits. |

---

### 8. Events Module

#### 8a. Public Events Directory

**Channel:** `events:{startupId}:events` (for recommendations only)
**Hook:** `useEventsRealtime(startupId)`

| UI Element | Realtime Event | Behavior |
|-----------|----------------|----------|
| Recommended panel | `event_enriched` | Match scores update. New recommended events appear. |

#### 8b & 8c. My Events + Event Detail

| UI Element | Realtime Event | Behavior |
|-----------|----------------|----------|
| Event tasks | DB trigger on `startup_event_tasks` | New tasks appear. Completion updates progress. |
| Attendee list | DB trigger on `event_attendees` | RSVP count updates. New attendees appear. |
| Sponsor matches | `event_enriched` | Sponsor cards appear after "Find Sponsors" AI action. |
| Marketing content | `event_enriched` | Generated copy appears in sections (social, email, etc). |

---

### 9. AI Chat Module

#### 9a. Chat Interface

**Channel:** `chat:{sessionId}:events` (new channel)
**Hook:** `useChatRealtime(sessionId)`

| UI Element | Realtime Event | Behavior |
|-----------|----------------|----------|
| Message thread | `message_received` | AI response streams token-by-token (or sentence-by-sentence). Typing indicator while processing. |
| Service route links | `message_received` | Clickable module links appear inline when AI detects actionable requests. |
| Context indicator | `message_received` | Industry/persona badge updates if AI detects a new context. |

#### 9b. Chat History

| UI Element | Realtime Event | Behavior |
|-----------|----------------|----------|
| Session list | DB trigger on `chat_sessions` | New sessions appear at top. Summary updates after conversation ends. |

---

### 10. Settings Module

**No realtime.** Changes are rare, no AI recalculation, no downstream cascade.

---

### 11. Onboarding Wizard

**Channel:** `onboarding:{sessionId}:events`
**Hook:** `useOnboardingRealtime(sessionId)`

| Step | Realtime Event | Behavior |
|------|----------------|----------|
| Step 1: Context | `enrichment_url_completed` | Company info card animates in (5s). Independent of other enrichments. |
| Step 1: Context | `enrichment_context_completed` | Competitor/market cards appear (12s). |
| Step 1: Context | `enrichment_founder_completed` | Founder profile card appears (8s). Failed enrichments show retry without blocking. |
| Step 2: Analysis | `readiness_score_updated` | Score dial fills with animation. Category bars animate one by one. |
| Step 3: Interview | Per-answer processing | Green badges appear: "has_traction", "b2b_saas". Quality meter updates per answer. |
| Step 4: Review | `strategy_synced` | Investor score finalizes. AI summary populates. "Complete" triggers dashboard redirect. |

---

## Realtime Infrastructure Summary

### Channels (8 patterns)

| # | Channel | Auth | Subscribing Screens |
|---|---------|------|---------------------|
| 1 | `dashboard:{userId}:events` | userId match | Dashboard |
| 2 | `onboarding:{sessionId}:events` | Session owner | Onboarding Wizard |
| 3 | `canvas:{documentId}:events` | Org member | Lean Canvas |
| 4 | `crm:{startupId}:events` | Org member | CRM (all 3 screens) |
| 5 | `pitchdeck:{deckId}:events` | Org member | Pitch Deck (all 3 screens) |
| 6 | `tasks:{startupId}:events` | Org member | Tasks, Projects, Dashboard |
| 7 | `investors:{startupId}:events` | Org member | Investors, Dashboard |
| 8 | `documents:{startupId}:events` | Org member | Documents |

Plus new:
| 9 | `chat:{sessionId}:events` | Session owner | AI Chat |
| 10 | `events:{startupId}:events` | Org member | Events |

### Hooks (10 total)

| Hook | Returns |
|------|---------|
| `useDashboardRealtime` | healthScore, priorities, risks, alignment, feed |
| `useOnboardingRealtime` | enrichments, step, readinessScore |
| `useCanvasRealtime` | validationScores, lastSaved, activeEditors |
| `useCRMRealtime` | dealScores, enrichedContacts, pipelineAlerts |
| `usePitchDeckRealtime` | slidesCompleted, totalSlides, isGenerating |
| `useTasksRealtime` | newTasks, priorities, bottlenecks |
| `useInvestorsRealtime` | fitScores, readinessUpdates |
| `useDocumentsRealtime` | analysisResults |
| `useChatRealtime` | streamingMessage, routeLinks |
| `useEventsRealtime` | recommendations, sponsorMatches |

### Database Triggers (6)

| Table | Condition | Broadcasts To |
|-------|-----------|---------------|
| `wizard_sessions` | `ai_extractions` or `current_step` changes | `onboarding:{id}` |
| `documents` (lean_canvas) | `type = 'lean_canvas'` and `content_json` changes | `canvas:{id}` |
| `deals` | `stage` or `score` changes | `crm:{startup_id}` |
| `pitch_decks` | `status` changes | `pitchdeck:{id}` |
| `tasks` | New row with `created_by = 'ai'` | `tasks:{startup_id}` |
| `startups` | Profile fields change | `dashboard:{user_id}` |

### Events (21 types)

All events follow `entity_action` snake_case convention. Each carries a typed payload with the minimum data needed for UI updates (IDs + changed values, not full records).

---

## UI Animation Patterns

Consistent motion language across all realtime updates:

| Pattern | Duration | Use |
|---------|----------|-----|
| **Score animate** | 800ms ease-out | Health gauge, fit scores, quality scores |
| **Card slide-in** | 300ms ease-out | New tasks, new contacts, new suggestions |
| **Badge pulse** | 200ms + fade | "+N new" badges, score changes |
| **Staggered reveal** | 200ms delay per item | Onboarding enrichment cards, canvas prefill, slide generation |
| **Progress fill** | Linear, matches real progress | Deck generation, fundraising bar, project completion |
| **Border flash** | 400ms | Canvas validation badges, risk alerts |
| **Shimmer placeholder** | Loop until resolved | During AI processing (enrichment, scoring, generation) |

---

## Implementation Order

| # | Task | Phase | Effort | Dependency |
|---|------|-------|--------|------------|
| 1 | Enable Supabase Realtime + private channels | P0 | Low | None |
| 2 | `useDashboardRealtime` + health score animation | P0 | Med | #1 |
| 3 | Broadcast from `onboarding-agent` after each enrichment | P0 | Low | #1 |
| 4 | `useOnboardingRealtime` + progressive card reveal | P0 | Med | #3 |
| 5 | Task generation broadcast from `ai-chat` | P0 | Low | #1 |
| 6 | `useTasksRealtime` + kanban card slide-in | P0 | Med | #5 |
| 7 | Daily priority briefing (morning login) | P0 | Med | #2 |
| 8 | DB trigger on `deals` + `useCRMRealtime` | P1 | Med | #1 |
| 9 | Deal re-scoring animation on stage change | P1 | Med | #8 |
| 10 | Broadcast from `lean-canvas-agent` + `useCanvasRealtime` | P1 | Med | #1 |
| 11 | Canvas validation badges + prefill animation | P1 | Med | #10 |
| 12 | Slide-by-slide broadcast from `pitch-deck-agent` | P1 | Med | #1 |
| 13 | `usePitchDeckRealtime` + slide thumbnail stream | P1 | Med | #12 |
| 14 | `useInvestorsRealtime` + fit score animation | P1 | Med | #1 |
| 15 | Investor readiness checker with progress bar | P1 | Med | #14 |
| 16 | Risk detection engine + alert cards | P1 | High | #2, #8 |
| 17 | `useDocumentsRealtime` + analysis streaming | P2 | Med | #1 |
| 18 | `useChatRealtime` + message streaming | P2 | Med | #1 |
| 19 | `useEventsRealtime` + sponsor match cards | P2 | Med | #1 |
| 20 | Cross-module strategy sync | P3 | Very High | All above |

---

## What NOT to Make Realtime

| Feature | Reason |
|---------|--------|
| Settings changes | Rare, no cascade |
| Profile edits | Low frequency |
| PDF/PPTX export | One-time action |
| Login/auth | Session-based |
| Billing/Stripe | Security-sensitive, webhook-only |
| Image generation | Callback pattern sufficient |
| Static nav links | Never change |
| Greeting text | Refreshes on page load only |
