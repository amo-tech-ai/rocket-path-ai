---
task_number: OB-11
title: Realtime Integration Strategy for Onboarding
category: Backend + Frontend
subcategory: Supabase Realtime
phase: Post-MVP
priority: P2
status: Strategy
percent_complete: 0
owner: Full Stack Developer
dependencies: []
ai_models: [Gemini]
tools: [Supabase Realtime, React, TypeScript]
---

# OB-11: Realtime Strategy for Onboarding Wizard

## Why Realtime for Onboarding

The onboarding wizard runs multiple AI operations (URL enrichment, competitor discovery, readiness scoring, interview processing, summary generation). These operations take 5-30 seconds each. Today the user stares at a spinner. With Realtime, each AI result streams to the UI as it completes — the experience shifts from "waiting for AI" to "watching AI work."

Beyond single-user UX, Realtime enables co-founder onboarding (two founders completing the wizard together), admin monitoring (accelerator program managers watching new startups onboard), and cross-device session continuity.

## Architecture

**Channel pattern:** `onboarding:{sessionId}:events` (private)
**Event pattern:** `enrichment_completed`, `score_updated`, `step_changed`, `wizard_completed`

**Database trigger:** On `wizard_sessions` table, `AFTER UPDATE`, broadcast step changes and AI extraction updates via `realtime.broadcast_changes`.

**RLS policy:** SELECT on `realtime.messages` where topic matches user's own session ID (via `auth.uid()` ownership check on `wizard_sessions`).

## Features

### Feature 1: Live AI Progress Stream

AI enrichment results appear one by one as they complete, instead of waiting for all operations to finish. The user sees the profile building in real time.

**Current problem:** Step 1 triggers 3 AI operations (URL enrichment, context enrichment, founder enrichment). The user sees a single spinner until all 3 complete. If one fails, the entire loading state feels broken.

**Realtime solution:** Each AI operation broadcasts its result individually. The UI updates incrementally — company info appears first, then competitors, then founder data.

**Events:**
- `enrichment_url_completed` — website data extracted, show company info
- `enrichment_context_completed` — competitors and trends discovered
- `enrichment_founder_completed` — LinkedIn data extracted
- `enrichment_failed` — show which enrichment failed with retry option

**UI behavior:**
- Card-by-card reveal animation as each enrichment completes
- Progress counter: "Analyzing... (2 of 3 complete)"
- Each card animates in when its data arrives
- Failed enrichments show inline retry button without blocking others

### Feature 2: Co-Founder Onboarding

Two co-founders complete the wizard together from separate devices. One leads the session while the other follows along and contributes answers.

**Current problem:** Only one person can fill out the wizard. The co-founder has to watch over their shoulder or wait until it's done.

**Realtime solution:** Both co-founders join the same session. One is the "driver" (can edit), the other is a "passenger" (sees changes live, can suggest edits).

**Events:**
- `step_changed` — both users navigate together
- `form_data_updated` — input changes appear on both screens
- `cofounder_joined` — notification that co-founder is watching
- `cofounder_suggested` — passenger suggests an edit (driver approves/rejects)

**UI behavior:**
- "Co-founder is viewing" indicator with avatar
- Passenger sees a "Suggest Edit" button next to each field
- Driver sees suggestions as inline proposals (accept/reject)
- Both see AI results stream simultaneously
- Step navigation synced — both move forward together

### Feature 3: Accelerator Admin Dashboard

Program managers at accelerators (YC, Techstars, 500 Global) see a live feed of startups completing onboarding. They monitor readiness scores and can intervene if a founder is stuck.

**Current problem:** Admins have no visibility into the onboarding process. They only see the startup after completion. If a founder abandons at Step 2, nobody knows.

**Realtime solution:** Admin dashboard subscribes to all onboarding sessions for their program. Live cards show each founder's progress.

**Events:**
- `wizard_started` — new card appears on admin dashboard
- `step_changed` — progress bar updates live
- `score_updated` — readiness score updates as AI analyzes
- `wizard_completed` — card moves to "completed" column
- `wizard_abandoned` — card turns yellow after 10 min inactivity

**UI behavior:**
- Kanban-style board: In Progress | Completed | Abandoned
- Each card shows founder name, current step, readiness score
- Click card to see detailed progress
- "Send Nudge" button for stuck founders (sends email or in-app notification)
- Live counter: "3 founders onboarding right now"

### Feature 4: Cross-Device Session Continuity

A founder starts onboarding on their laptop, leaves for a meeting, and resumes on their phone. The session syncs instantly — no data loss, no re-entering information.

**Current problem:** Sessions persist in the database via `wizard_sessions`, but there's no live sync. If a founder opens the wizard on a second device, they see stale data until they refresh.

**Realtime solution:** All session changes broadcast to every device with the session open. The latest state is always visible.

**Events:**
- `session_resumed` — notifies other devices that session is active elsewhere
- `form_data_updated` — syncs input changes across devices
- `step_changed` — syncs current step
- `ai_extractions_updated` — syncs AI results

**UI behavior:**
- "This session is also open on another device" banner
- Changes sync bidirectionally without conflict (last-write-wins per field)
- If both devices are on different steps, show "Other device is on Step 3" indicator
- Seamless handoff — close laptop, phone has full state

### Feature 5: AI Interview Live Coaching

During Step 3 (Smart Interview), AI provides real-time coaching as the founder types their answers. Instead of processing answers after submission, the AI analyzes in real time and shows tips.

**Current problem:** The founder answers 5 questions and submits. AI processes answers one by one. The founder gets no feedback until after submission.

**Realtime solution:** As the founder types, AI provides live coaching tips via broadcast. The edge function uses `EdgeRuntime.waitUntil` for background analysis and broadcasts results.

**Events:**
- `answer_typing` — debounced (500ms) text of current answer
- `coaching_tip` — AI suggests improvements while user types
- `signal_detected` — AI detects a signal (has_revenue, has_pmf) and highlights it
- `answer_quality_score` — live quality indicator for the current answer

**UI behavior:**
- Subtle coaching sidebar that updates as user types
- "Tip: Mention specific numbers — investors love metrics" appears when answer is vague
- Green badge appears when AI detects a strong signal
- Quality meter (weak/ok/strong) for current answer
- All coaching is non-blocking — user can ignore and continue

## Real-World Examples

### Example 1: Solo Founder with Slow Internet (India)

Priya is onboarding her EdTech startup from Bangalore on a 3G connection.

- She enters her company name and website URL
- AI URL enrichment completes first (8 seconds) — company info card animates in
- AI competitor discovery takes longer (15 seconds) — she sees "Analyzing competitors..." while company info is already visible
- AI founder enrichment fails (LinkedIn blocked) — she sees "Could not access LinkedIn" with a retry button, but Steps 1 content is already usable
- She clicks Next without waiting for LinkedIn — the wizard proceeds with what it has
- Total wait time feels like 8 seconds instead of 15 because useful content appeared incrementally

### Example 2: Two Co-Founders at YC Startup School (remote)

Jake (CEO) in Austin and Lisa (CTO) in Berlin are filling out onboarding together before their YC Startup School session.

- Jake starts the wizard and shares the session link with Lisa
- Lisa joins — both see "Co-founder connected" indicator
- Jake enters company description, Lisa sees it appear on her screen
- Lisa suggests changing "AI-powered" to "machine learning-powered" — Jake sees the suggestion and accepts
- AI enrichment results stream to both screens simultaneously
- During the interview (Step 3), Jake answers business questions while Lisa answers technical ones
- Both review the final readiness score together on Step 4
- Jake clicks "Complete" — both redirect to the dashboard

### Example 3: Techstars Program Manager Monitoring Batch

Maria manages the incoming Techstars batch of 12 startups. All founders are onboarding this week.

- Maria opens the Admin Onboarding Dashboard
- She sees 4 founders actively onboarding (cards with live progress bars)
- Founder A reaches Step 4 with a readiness score of 78 — card turns green
- Founder B has been stuck on Step 2 for 20 minutes — card turns yellow
- Maria clicks "Send Nudge" on Founder B — sends an email: "Need help with the analysis step?"
- Founder C completes onboarding — card slides to "Completed" column with a score of 85
- At end of day, Maria sees: 8 completed, 2 in progress, 2 not started
- She exports the readiness scores for the weekly report

### Example 4: Founder Switching Devices Mid-Wizard

Alex starts onboarding on his MacBook at the office. Gets a call and has to leave.

- He's on Step 2 (AI Analysis) when he closes the laptop
- In the Uber, he opens the app on his phone
- The wizard loads at Step 2 with all data intact — AI results are already there
- He sees "Session also open on MacBook" banner (laptop is in sleep mode)
- He continues to Step 3 on his phone, answers interview questions
- Back at home, he opens the laptop — it's now on Step 3 with his phone answers visible
- He finishes Step 4 on the laptop and completes onboarding
- Zero data loss, zero re-entry

### Example 5: AI-Coached Interview for First-Time Founder

Sam is a first-time founder who's never pitched to investors. Step 3's interview questions feel intimidating.

- Question 1: "Describe your traction so far"
- Sam starts typing: "We have some users..."
- Coaching sidebar updates: "Tip: How many users? Weekly or monthly active? Growth rate?"
- Sam adds: "We have 340 monthly active users, growing 15% month over month"
- Green badge appears: "Signal detected: has_traction"
- Quality meter moves from "weak" to "strong"
- Question 3: "What's your revenue model?"
- Sam types: "We plan to charge subscriptions"
- Coaching sidebar: "Tip: What price point? Any paying customers yet? What's the conversion rate?"
- Sam revises: "B2B SaaS at $49/mo, 12 paying customers, 3.5% free-to-paid conversion"
- Two signals detected: "has_revenue" and "b2b_saas"
- Final interview score: 82/100 (vs typical first-time founder score of 55)

## Implementation Approach

### Phase 1: Live AI Progress (highest impact, lowest effort)

1. Add broadcast to `onboarding-agent` edge function after each enrichment action
2. Use `realtime.send` to broadcast `enrichment_*_completed` events to `onboarding:{sessionId}:events`
3. Create `useOnboardingRealtime(sessionId)` hook
4. Update Step 1 UI to reveal cards incrementally as events arrive
5. Add RLS policy on `realtime.messages` for session ownership

### Phase 2: Cross-Device Sync

6. Add database trigger on `wizard_sessions` for `form_data` and `current_step` changes
7. Broadcast `form_data_updated` and `step_changed` events
8. Update `useWizardSession` hook to merge incoming realtime updates
9. Add "session active on another device" banner

### Phase 3: Co-Founder + Admin Features

10. Implement co-founder join flow (share session link)
11. Add presence tracking for connected users
12. Create admin dashboard with multi-session subscription
13. Add "Send Nudge" action for stuck founders
14. Implement AI coaching for interview step (Feature 5)

### Channel Setup

```
Topic: onboarding:{sessionId}:events (private)
Events: enrichment_url_completed, enrichment_context_completed, enrichment_founder_completed, enrichment_failed, step_changed, form_data_updated, score_updated, wizard_completed, cofounder_joined, cofounder_suggested, coaching_tip, signal_detected
```

### Database Trigger

On `wizard_sessions` table, `AFTER UPDATE`:
- Broadcast to `onboarding:{id}:events`
- Include `current_step`, `ai_extractions` diff, `profile_strength`
- Use `realtime.broadcast_changes` for private channel enforcement
- Conditional: only broadcast when `current_step` or `ai_extractions` actually changed

### React Hook Pattern

`useOnboardingRealtime(sessionId)` hook:
- Subscribes to `onboarding:{sessionId}:events` with `private: true`
- Calls `supabase.realtime.setAuth()` before subscribing
- Checks `channelRef.current?.state` before subscribing
- Returns `{ enrichments, activeStep, connectedUsers, coachingTips, isConnected }`
- Cleanup via `supabase.removeChannel` on unmount

### Edge Function Changes

In `onboarding-agent/index.ts`, after each enrichment action completes:
- Use `realtime.send` via Supabase client to broadcast result
- Or use `EdgeRuntime.waitUntil` to broadcast without blocking the HTTP response
- Include action name, result summary, and timestamp in payload

## Dependencies

- **Supabase Realtime** enabled on project
- **Private-only channels** enabled in Realtime Settings
- **wizard_sessions** table (exists)
- **onboarding-agent** edge function (exists, 1400+ lines)
- **useWizardSession** hook (exists)

## Success Metrics

| Metric | Target |
|--------|--------|
| Perceived wait time reduction (Step 1) | 50% faster feeling |
| Wizard completion rate | > 90% (currently ~85%) |
| Co-founder session adoption | > 30% of multi-founder startups |
| Cross-device session continuity | > 95% sync reliability |
| Admin intervention on stuck founders | < 5 min response time |
| AI coaching impact on interview scores | +15 points average |
