# Pitch Deck System — Dashboard

> **Level:** Post-MVP | **Purpose:** Deck listing, filtering, and management dashboard  
> **Category:** Frontend | **Subcategory:** Pages  
> **Phase:** 2 | **Priority:** P1  
> **No Code:** Design requirements, screen specifications, and user interactions only

---

## Dashboard Overview

### Layout

- **Header:** Title, search bar, create button
- **Filters:** Status, template, date range
- **Deck Grid:** Card-based layout with deck previews
- **Empty State:** Message and CTA when no decks exist

### Features

1. **Deck Listing** — All user's decks with metadata
2. **Filtering** — By status, template, date
3. **Sorting** — By date, name, status, signal strength
4. **Search** — Full-text search across deck titles
5. **Resume Draft** — Continue incomplete wizards
6. **Quick Actions** — Edit, duplicate, delete, export

---

## Header Section

### Title

- **Text:** "Pitch Decks"
- **Subtitle:** Count of total decks (e.g., "12 decks")

### Search Bar

- **Placeholder:** "Search decks by title..."
- **Functionality:** Real-time search as user types
- **Scope:** Search deck titles only
- **Clear Button:** Appears when search has value

### Create Button

- **Label:** "Create New Deck"
- **Icon:** Plus icon
- **Action:** Navigate to Wizard Step 1
- **Style:** Primary button, prominent

---

## Filter Section

### Status Filter

**Options:**
- **All** (default)
- **Drafts** — Incomplete wizards
- **In Progress** — Generation in progress
- **Review** — Generation complete, ready for editing
- **Final** — Marked as final by user
- **Archived** — Archived decks

**Display:**
- Tabs or dropdown selector
- Count badge on each option (e.g., "Drafts (3)")

### Template Filter

**Options:**
- **All** (default)
- **YC** — Y Combinator template
- **Sequoia** — Sequoia template
- **Custom** — Custom template
- **Series A** — Series A template

**Display:**
- Dropdown or chip selector
- Visual template icons

### Date Range Filter

**Options:**
- **All Time** (default)
- **Last 7 Days**
- **Last 30 Days**
- **Last 90 Days**
- **Custom Range** — Date picker

**Display:**
- Dropdown selector
- Custom range opens date picker modal

---

## Deck Grid

### Deck Card Layout

**Card Components:**
- **Thumbnail:** First slide preview or template icon
- **Title:** Deck title (truncated if long)
- **Status Badge:** Draft, In Progress, Review, Final, Archived
- **Metadata:**
  - Template type
  - Slide count
  - Last modified date
  - Signal strength score (if available)
- **Quick Actions:** Edit, Duplicate, Delete, More menu

**Card States:**
- **Default:** Normal display
- **Hover:** Slight elevation, show quick actions
- **Selected:** Border highlight (for bulk actions, future)

### Empty State

**Display:**
- **Icon:** Empty state illustration
- **Title:** "No decks yet"
- **Message:** "Create your first pitch deck to get started"
- **CTA Button:** "Create New Deck"

---

## Sorting Options

### Sort Dropdown

**Options:**
- **Recently Edited** (default)
- **Recently Created**
- **Name (A-Z)**
- **Name (Z-A)**
- **Status**
- **Signal Strength (High to Low)**
- **Signal Strength (Low to High)**

**Display:**
- Dropdown in header or filter section
- Current sort indicator

---

## Deck Card Interactions

### Click Card

**Action:** Navigate to Deck Editor (if deck has slides) or Resume Wizard (if draft)

**Logic:**
- If `status` is "draft" or "in_progress" and has `metadata.wizard_data`: Resume Wizard
- If `status` is "review" or "final" and has slides: Open Deck Editor
- Otherwise: Show error message

### Quick Actions Menu

**Actions:**
- **Edit:** Navigate to Deck Editor
- **Duplicate:** Create copy of deck
- **Export:** Open export modal (PDF/PPTX/Link)
- **Archive:** Move to archived status
- **Delete:** Delete deck (with confirmation)
- **Rename:** Inline edit title

**Display:**
- Three-dot menu icon on card
- Dropdown menu on click
- Confirmation dialog for destructive actions

---

## Resume Draft Flow

### Draft Detection

**Criteria:**
- `status` is "draft" or "in_progress"
- `metadata.wizard_data` exists
- Last step completed < 5

### Resume UI

**Display:**
- "Resume" badge on card
- Progress indicator: "Step X of 5"
- Last modified timestamp

**Action:**
- Click card or "Resume" button
- Navigate to Wizard Step X+1
- Load wizard data from `metadata.wizard_data`

---

## Data Operations

### Load Decks

**Process:**
1. Fetch all `pitch_decks` for user
2. Filter by status (if filter applied)
3. Filter by template (if filter applied)
4. Filter by date range (if filter applied)
5. Search by title (if search query)
6. Sort by selected option
7. Return paginated results (20 per page)

**Query:**
- Use Supabase query with filters
- Apply RLS policies automatically
- Include `metadata` JSONB for wizard data check

### Delete Deck

**Process:**
1. Show confirmation dialog
2. Delete all `pitch_deck_slides` for deck
3. Delete `pitch_decks` row
4. Refresh deck list
5. Show success message

### Duplicate Deck

**Process:**
1. Read deck with metadata
2. Read all slides
3. Create new deck with copied metadata
4. Create new slides with copied content
5. Set new deck title: "{Original Title} (Copy)"
6. Refresh deck list
7. Navigate to new deck editor

### Archive Deck

**Process:**
1. Update deck `status` to "archived"
2. Refresh deck list
3. Show success message

---

## Pagination

### Display

- **Page Size:** 20 decks per page
- **Navigation:** Previous/Next buttons
- **Page Numbers:** Show current page and total pages
- **Info:** "Showing 1-20 of 45 decks"

### Behavior

- Load next page on scroll (infinite scroll, optional)
- Or click page number to jump
- Maintain filters and sort when paginating

---

## Performance Targets

- **Load Dashboard:** < 500ms
- **Load Decks:** < 800ms (20 decks)
- **Filter/Sort:** < 300ms
- **Search:** < 200ms (debounced)
- **Delete Deck:** < 500ms
- **Duplicate Deck:** < 1s

---

## Responsive Design

### Desktop (1024px+)

- **Grid:** 3 columns
- **Card Size:** Large with full metadata
- **Filters:** Horizontal tabs/dropdowns

### Tablet (768-1023px)

- **Grid:** 2 columns
- **Card Size:** Medium with essential metadata
- **Filters:** Collapsible section

### Mobile (<768px)

- **Grid:** 1 column
- **Card Size:** Compact with minimal metadata
- **Filters:** Bottom sheet or modal
- **Search:** Full-width in header

---

## Success Criteria

### Dashboard Completion Criteria

- [ ] Deck listing displays all user decks
- [ ] Filtering by status works
- [ ] Filtering by template works
- [ ] Filtering by date range works
- [ ] Search by title works
- [ ] Sorting options work
- [ ] Resume draft functionality works
- [ ] Quick actions menu works
- [ ] Delete deck with confirmation works
- [ ] Duplicate deck works
- [ ] Archive deck works
- [ ] Pagination works
- [ ] Responsive design works

### User Acceptance Criteria

- User can see all their decks
- User can filter decks easily
- User can search for specific decks
- User can resume incomplete wizards
- User can manage decks (edit, delete, duplicate)
- Dashboard loads quickly
- Dashboard works on mobile devices

---

**Dashboard Level:** Defines deck management interface with filtering, sorting, search, and quick actions.

**Next:** See `07-ai-integration.md` for AI integration details, `08-testing.md` for testing strategy.
