---
task_number: LC-14
title: Realtime Integration Strategy
category: Backend + Frontend
subcategory: Supabase Realtime
phase: Post-MVP
priority: P2
status: Strategy
percent_complete: 0
owner: Full Stack Developer
dependencies: [LC-06, LC-12]
ai_models: []
tools: [Supabase Realtime, React, TypeScript]
---

# LC-14: Realtime Integration Strategy for Lean Canvas

## Why Realtime Matters

The lean canvas is a living document. Founders iterate on it with co-founders, advisors, and mentors. Without realtime sync, users resort to screen sharing or copy-pasting — breaking the flow of strategic thinking. Realtime transforms the canvas from a solo tool into a collaborative workspace.

## Architecture

**Channel pattern:** `canvas:{documentId}:events` (private)
**Event pattern:** `canvas_box_updated`, `canvas_saved`, `cursor_moved`, `validation_completed`, `comment_added`

**Database trigger:** On `documents` table where `type = 'lean_canvas'`, broadcast changes via `realtime.broadcast_changes`.

**RLS policy:** SELECT on `realtime.messages` checking `startup_in_org()` to ensure only org members receive updates.

## Features

### Feature 1: Live Co-Editing

Multiple users edit the same canvas simultaneously. Each box shows who is currently editing (avatar + colored border). Changes appear instantly without page refresh.

**Events:**
- `box_editing_started` — user clicks into a box
- `box_updated` — user modifies items in a box
- `box_editing_stopped` — user leaves a box

**Conflict resolution:** Last-write-wins at the item level (not box level). If User A edits item 1 and User B edits item 2 in the same box, both changes merge. If both edit the same item, the latest timestamp wins.

**UI indicators:**
- Colored border around box being edited by another user
- Avatar pill showing who is editing
- Subtle pulse animation on incoming changes

### Feature 2: AI Generation Broadcast

When one user triggers AI prefill or suggest_box, the results broadcast to all viewers. No one misses AI-generated content.

**Events:**
- `ai_generation_started` — shows loading indicator to all users
- `ai_generation_completed` — delivers AI results to all users
- `ai_validation_completed` — shares validation scores with all users

**UI indicators:**
- "AI is generating..." banner visible to all viewers
- Results appear simultaneously for everyone
- Validation badges update in real time

### Feature 3: Advisor Live Review Mode

An advisor or mentor joins the canvas in read-only mode and adds comments/reactions to specific boxes. The founder sees feedback appearing live while presenting.

**Events:**
- `comment_added` — advisor comments on a specific box
- `reaction_added` — quick emoji reactions (thumbs up, warning, question mark)
- `advisor_joined` — notification that advisor is viewing

**UI indicators:**
- Comment bubbles appear next to boxes
- Reaction counts update live
- Presence indicator showing who is viewing

### Feature 4: Auto-Save Status Sync

All open tabs and users see the latest save state. No "someone else made changes" refresh prompts — changes flow automatically.

**Events:**
- `canvas_saved` — confirms save to all viewers
- `canvas_version_created` — notifies when a new version snapshot is saved (LC-06)

**UI indicators:**
- "Saved" / "Saving..." status synced across all tabs
- Version number updates live
- "New version available" toast if viewing an older version

### Feature 5: Canvas Activity Feed

A sidebar feed showing recent changes across the canvas — who changed what and when. Useful for founders reviewing changes made by co-founders overnight.

**Events:**
- All `box_updated` events aggregated into a feed
- `canvas_saved` events with timestamps
- `ai_generation_completed` events

**UI indicators:**
- Sidebar timeline with avatar, action, timestamp
- Click-to-navigate to the changed box
- Filter by user or by box

## Real-World Examples

### Example 1: YC Interview Prep (2 co-founders)

Sarah and Mike are preparing for their YC interview. They have 48 hours to refine their lean canvas.

- Sarah opens the canvas from her laptop in San Francisco
- Mike opens the same canvas from his phone in New York
- Sarah edits the Problem box — Mike sees it update instantly
- Mike triggers AI suggestions for the Revenue Streams box — Sarah sees the loading state and then the suggestions appear on her screen
- Both review the AI validation results together
- Sarah saves version "YC Interview v3" — Mike sees the version update
- Total sync latency: under 200ms

### Example 2: Mentor Office Hours (founder + advisor)

Alex has a 30-minute session with their Techstars mentor David.

- Alex shares the canvas link with David
- David joins in Advisor Review Mode (read-only + comments)
- Alex walks through each box while David adds live reactions
- David adds a comment on Customer Segments: "Too broad — pick ONE segment"
- Alex immediately narrows the segment and David sees the change
- David adds a thumbs-up reaction to the updated box
- After the session, Alex reviews all comments in the activity feed

### Example 3: Pivot Decision (3 co-founders)

The team discovers their initial customer segment isn't working. They need to pivot.

- All three founders open the canvas simultaneously
- CEO edits Problem and Customer Segments
- CTO edits Solution and Key Metrics
- COO edits Channels and Cost Structure
- Each sees the others' changes in real time with colored borders
- They trigger AI validation together — score jumps from 45 to 72
- CEO saves version "Post-Pivot v1"
- All three see the save confirmation and new version number

### Example 4: Accelerator Demo Day Prep (founder + design lead)

The founder needs to turn the lean canvas into a pitch deck (LC-08 integration).

- Founder opens the canvas to review
- Design lead opens the same canvas to extract content for slides
- Founder triggers AI to improve the Unique Value Proposition
- Design lead sees the new UVP appear and copies it to the pitch deck
- Founder marks boxes as "reviewed" — design lead sees green checkmarks
- Activity feed shows exactly which boxes were updated today

### Example 5: Investor Due Diligence (founder + investor)

An investor wants to see the thought process behind the business model.

- Founder shares a read-only canvas link with the investor
- Investor views the canvas with validation scores visible
- Investor clicks through version history (LC-06) to see how thinking evolved
- Each version loads with its validation scores
- Investor adds a comment: "Show me your unit economics behind Revenue Streams"
- Founder gets a notification and responds by updating the box
- Investor sees the update in real time

## Implementation Approach

### Phase 1: Foundation (requires LC-06, LC-12)

1. Add database trigger on `documents` table for `type = 'lean_canvas'` changes
2. Create RLS policy on `realtime.messages` using `startup_in_org()`
3. Create index on `realtime.messages` for the policy
4. Create `useLeanCanvasRealtime` hook wrapping channel setup + cleanup

### Phase 2: Core Sync

5. Implement Feature 4 (auto-save sync) — lowest complexity, highest value
6. Implement Feature 1 (live co-editing) — box-level editing indicators + item merge
7. Add presence tracking for active editors

### Phase 3: AI + Collaboration

8. Implement Feature 2 (AI broadcast) — wire existing AI actions to broadcast
9. Implement Feature 3 (advisor review mode) — read-only view + comments
10. Implement Feature 5 (activity feed) — aggregate events into sidebar

### Channel Setup

```
Topic: canvas:{documentId}:events (private)
Events: canvas_box_updated, canvas_saved, cursor_moved, validation_completed, comment_added, ai_generation_started, ai_generation_completed, reaction_added, advisor_joined
```

### Database Trigger

On `documents` table, `AFTER UPDATE`, where `type = 'lean_canvas'`:
- Broadcast to `canvas:{id}:events` with event `canvas_box_updated`
- Include changed box keys in payload
- Use `realtime.broadcast_changes` for private channel enforcement

### React Hook Pattern

`useLeanCanvasRealtime(documentId)` hook:
- Subscribes to `canvas:{documentId}:events` with `private: true`
- Calls `supabase.realtime.setAuth()` before subscribing
- Checks `channel.state` before subscribing (prevent duplicates)
- Returns `{ activeEditors, lastSaved, comments, isConnected }`
- Cleanup on unmount via `supabase.removeChannel`

## Dependencies

- **LC-06 (Version History):** Required for version sync events
- **LC-12 (Team Collaboration):** Required for multi-user access patterns
- **Supabase Realtime Settings:** Enable private-only channels in dashboard

## Success Metrics

- Co-editing latency: < 200ms
- Sync reliability: > 99.5%
- Concurrent users per canvas: support 5+
- User satisfaction with collaboration: > 85%
- Advisor session completion rate: > 90%
