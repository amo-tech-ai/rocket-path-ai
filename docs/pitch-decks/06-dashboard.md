# Prompt 06 — Pitch Deck Dashboard Screen

> **Phase:** Post-MVP | **Category:** Frontend | **Priority:** P1
> **Depends on:** 03-mvp.md (wizard), 05-deck-editor.md (editor)
> **No code in this prompt — design intent, screen specs, and AI behavior only**

---

## Screen Purpose

The Pitch Deck Dashboard is the landing page for the pitch deck module. It shows all decks, lets users create new ones, resume drafts, and provides AI-powered insights about their decks portfolio.

Uses the standard DashboardLayout with the AI intelligence right panel showing portfolio-level insights rather than slide-level suggestions.

---

## 3-Panel Layout

### Left Panel (240px) — Navigation & Filters

**What it shows:**
- Module navigation: links to Wizard, Editor, Templates
- Filter section:
  - Status filter: All, Drafts, Generating, Review, Final, Archived (with count badges)
  - Template filter: All, YC, Sequoia, Series A, Custom
  - Date range: All Time, Last 7 Days, Last 30 Days, Last 90 Days, Custom
- Sort selector: Recently Edited (default), Recently Created, Name A-Z, Signal Strength High-Low
- Quick stats at bottom:
  - Total decks count
  - Average signal strength
  - Decks in review

**What the user can do:**
- Click any filter to narrow the deck grid
- Change sort order
- Filters combine (status AND template AND date)
- Clear all filters button

**Responsive behavior:**
- Tablet: collapses to icon rail, filters move to horizontal bar above grid
- Mobile: hidden, filters accessible via filter icon → bottom sheet

---

### Main Panel (Flexible) — Deck Grid

**Header area:**
- Title: "Pitch Decks" with subtitle showing deck count ("12 decks")
- Search bar: "Search decks by title..." with real-time filtering
- Create button: "Create New Deck" (primary, prominent) → navigates to Wizard Step 1

**Deck grid:**
- Card-based layout (3 columns desktop, 2 tablet, 1 mobile)
- Each card shows:
  - Thumbnail: first slide preview or template icon placeholder
  - Title (truncated if long)
  - Status badge: Draft (gray), Generating (blue pulse), Review (yellow), Final (green), Archived (muted)
  - Template type label
  - Slide count
  - Signal strength mini-bar (colored: red/yellow/green)
  - Last modified date
  - Quick actions: Edit, Duplicate, Export, Archive, Delete (via three-dot menu)

**Card click behavior:**
- Draft with wizard_data → Resume Wizard at last completed step
- Generating → Show generation progress (cannot edit)
- Review or Final with slides → Open Deck Editor
- Archived → Open in read-only mode

**Draft cards special treatment:**
- "Resume" badge overlay
- Progress indicator: "Step 2 of 4"
- Slightly different card style (dashed border or muted background)

**Empty state:**
- Illustration of a pitch deck
- Title: "No pitch decks yet"
- Subtitle: "Create your first AI-powered pitch deck"
- CTA button: "Create New Deck"

**Pagination:**
- 20 decks per page
- Previous/Next buttons
- "Showing 1-20 of 45 decks"
- Maintains filters and sort when paginating

---

### Right Panel (360px) — AI Portfolio Intelligence

This panel shows portfolio-level insights rather than slide-level suggestions. It's the AI dashboard for the user's pitch deck collection.

**Panel Sections (stacked vertically, scrollable):**

#### Section 1: Portfolio Summary (always visible)

Overview stats with visual indicators:
- **Total Decks:** count with trend arrow (vs last month)
- **Average Signal Strength:** score with colored indicator
- **Strongest Deck:** name + score (link to open)
- **Weakest Deck:** name + score (link to open with improvement suggestions)
- **Decks Needing Attention:** count of decks with signal < 50%

#### Section 2: AI Recommendations (context-aware)

Personalized recommendations based on the user's deck portfolio:

| Recommendation Type | When It Appears | What It Suggests |
|-------------------|-----------------|------------------|
| **Complete Your Draft** | User has incomplete wizard | "Your SaaS deck is 75% ready — finish Step 3 to generate" |
| **Improve Signal** | Deck has low signal strength | "Add traction metrics to boost your Fintech deck from 42% to 65%" |
| **Try Another Template** | User only has one template | "Your seed-stage startup might benefit from the YC template" |
| **Update Stale Deck** | Deck not edited in 30+ days | "Your Series A deck hasn't been updated since Dec — refresh metrics?" |
| **Add Industry Context** | Deck missing industry pack | "Connect your Healthcare pack for industry-specific benchmarks" |

Each recommendation shows:
- Icon + short title
- Description with specific action
- Action button: "Resume", "Improve", "Try", "Update"
- Dismiss button

#### Section 3: Recent Activity (bottom)

Timeline of recent deck activity:
- "Generated SaaS Pitch Deck — 2 hours ago"
- "Applied 3 AI suggestions to Fintech Deck — yesterday"
- "Exported Series A Deck as PDF — 3 days ago"
- "Started new wizard for Healthcare — 5 days ago"

Shows last 5-10 activities. Each entry is clickable (navigates to relevant deck).

**Responsive behavior:**
- Tablet: right panel becomes a collapsible section below the grid
- Mobile: hidden, accessible via "AI Insights" floating action button → bottom sheet

---

## AI Behavior Rules

### Portfolio intelligence:
- Recalculate portfolio stats on dashboard load
- AI recommendations refresh every time the dashboard loads (cached 15 minutes)
- Uses Gemini Flash for fast recommendation generation
- Recommendations are personalized based on: deck statuses, signal scores, last edit dates, industry packs used

### When user creates a new deck:
- Right panel updates "Total Decks" count
- If user has no decks, right panel shows onboarding guidance instead of portfolio stats

### When user returns to dashboard after editing:
- Right panel updates signal strength if it changed
- May show new recommendation: "Great progress! Your deck improved from 55% to 72%"

---

## Quick Actions Detail

### Duplicate Deck
1. Confirmation: "Duplicate 'SaaS Pitch Deck'?"
2. Creates copy of deck + all slides
3. New title: "{Original Title} (Copy)"
4. Status: "draft"
5. Navigate to new deck in editor

### Delete Deck
1. Confirmation dialog: "Delete 'SaaS Pitch Deck'? This will remove all slides and cannot be undone."
2. Deletes deck + all slides
3. Refresh grid
4. Success toast

### Archive Deck
1. Update status to "archived"
2. Card moves to archived filter
3. Success toast with "Undo" option (5 seconds)

### Export (from card menu)
1. Opens export modal (same as in deck editor)
2. PDF, PPTX, or Shareable Link options

---

## Performance Targets

| Action | Target |
|--------|--------|
| Load dashboard | < 500ms |
| Load deck grid (20 cards) | < 800ms |
| Filter/sort | < 300ms |
| Search (debounced) | < 200ms |
| Delete deck | < 500ms |
| Duplicate deck | < 1s |
| Load AI recommendations | < 2s |

---

## Success Criteria

- Dashboard shows all user decks with correct metadata
- All filters work (status, template, date) and combine correctly
- Search finds decks by title in real-time
- Draft decks show resume flow with correct wizard step
- Quick actions (edit, duplicate, delete, archive, export) all work
- Right panel shows portfolio-level AI insights
- AI recommendations are relevant and actionable
- Empty state guides new users to create first deck
- Responsive design works on desktop, tablet, mobile
- Pagination works with filters maintained
