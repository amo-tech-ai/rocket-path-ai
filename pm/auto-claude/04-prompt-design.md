Below are **copy/paste design prompts** tailored to the **exact UI pattern in your screenshot**: **Left sidebar + Main Kanban + Right intelligence/detail panel** (luxury, calm, premium).
I’m focusing on the **main Kanban dashboard system**, plus **Task Detail drawer** and **Full Task modal**, and your **Roadmap Kanban** view.

---

# 0) Master Prompt — Dashboard System (Left / Main / Right)

```markdown
Design a luxury SaaS dashboard system with a 3-panel layout:

LAYOUT
- Left: Navigation rail (primary modules + keyboard hints)
- Main: Workspace (kanban + filters + progress)
- Right: Context panel (AI + details + actions)

STYLE
- Quiet luxury, editorial spacing, high-end minimalism
- Soft off-white surfaces, warm stone borders, subtle shadow
- Emerald as primary accent; muted gold for premium highlights
- No loud gradients, no neon status colors

TYPOGRAPHY
- H1: editorial, calm authority
- H2: clear section headers
- Body: highly readable, generous line-height
- Microcopy: understated + helpful

INTERACTION RULES
- Only 1 primary CTA per area (Left, Main, Right)
- Right panel always answers: WHAT, WHY, NEXT
- Main panel optimized for scanning + drag/drop
- Maintain focus: avoid cluttered chips; use subtle tags

RESPONSIVE
- Desktop: 3 panels
- Tablet: Right panel becomes drawer
- Mobile: Kanban becomes list; Right panel becomes bottom sheet
```

---

# 1) Kanban Board Dashboard — “Planning → Queue → In Progress → AI Review”

## A) UI Prompt (Design + Layout + Behavior)

```markdown
Design a premium Kanban Board dashboard for an AI task runner.

HEADER STRIP
- Project tabs (fashionosv11, ilmv10, startupai16, startupai16L)
- Progress indicator: "0% • 0/7 tasks"
- Verified status at top right

FILTER ROW
- Phase dropdown (All Phases)
- Category dropdown (All Categories)
- Search (optional)
- Refresh tasks action (icon)

KANBAN COLUMNS (4)
1) Planning (count)
   - Cards: short summary, tags, age, Start button
   - Controls: sort icon, add icon
2) Queue
   - Empty state explaining concurrency rule:
     "Tasks wait here when parallel limit is reached"
3) In Progress (0/3)
   - Empty state: "Nothing running. Start a task from Planning"
4) AI Review
   - Empty state: "AI will review completed tasks"

CARD DESIGN (Planning column)
- Title (bold)
- One-line description (2 lines max)
- Tags: Status (Pending), Type (Feature)
- Timestamp: "6h ago"
- Primary action: "Start" button (quiet emerald)
- Overflow menu: (...)

RIGHT PANEL BEHAVIOR
- When card is selected:
  Right panel shows compact metadata + markdown preview + actions

EMPTY STATE AESTHETIC
- Soft dashed container + minimal icon
- Calm copy, no harsh CTA

MICROINTERACTIONS
- Drag preview is subtle
- Column hover highlight is minimal
- Card hover shows a gentle lift + border accent

AI LOGIC UI
- AI does not spam: 1 insight + 1 next step + 1 risk max
```

## B) Sample Content (Cards + States)

```markdown
PLANNING (7)
Card 1: Competitive Analysis Tools
- Desc: Track competitors, monitor market changes, analyze positioning.
- Tags: Pending • Feature
- Age: 6h ago
- CTA: Start

Card 2: Third-Party Integrations Hub
- Desc: Connect StartupAI with tools like Slack, Gmail, Calendar.
- Tags: Pending • Feature
- Age: 6h ago

Card 3: Advanced AI Strategic Advisor
- Desc: Deep strategic analysis for founders using high-trust workflows.
- Tags: Pending • Feature
- Age: 6h ago

QUEUE (empty)
- Copy: "Queue is empty. Tasks wait here when parallel task limit is reached."

IN PROGRESS (empty)
- Copy: "Nothing running. Start a task from Planning."

AI REVIEW (empty)
- Copy: "No tasks in review. AI reviews completed tasks automatically."
```

## C) Right Panel Logic (Selected Card)

```markdown
RIGHT PANEL: Task Preview (when card selected)

TOP
- Chips: Phase (Planning) • Type (Feature) • Priority (Medium)
- Title: Competitive Analysis Tools
- ID: 007-competitive-analysis-tools

METADATA MINI-CARDS
- Status: 0%
- Priority: P2
- Skills: /frontend (or /edge-functions etc)

CONTENT (Markdown preview)
- Description
- Rationale
- User stories
- Acceptance criteria

PRIMARY ACTION
- "Open Full Task" (single strong CTA)
SECONDARY
- "Start Task" (if not started)
- "Add Subtask" (secondary)
```

---

# 2) Task Detail Drawer (Right Panel) — Premium Information Design

```markdown
Design the right-side task detail drawer for a luxury SaaS.

GOAL
Make long task docs feel readable and executive-grade.

STRUCTURE
- Compact header: Title + ID + badges
- Summary block: 2 lines max
- Metadata grid: Status, Priority, Skills
- Markdown content: spaced headings, readable lists
- Sticky bottom action bar:
  - Primary: Open Full Task
  - Secondary: Start Task / Close

TYPOGRAPHY RULES
- H2 headings are strong and spaced
- Bullets are airy (line-height 1.6+)
- Checklist items are tappable

VISUAL RULES
- Use subtle dividers between sections
- Avoid dense blocks; use cards for metadata
```

### Sample Drawer Content (Short, Premium)

```markdown
Summary
Track competitors and auto-generate positioning insights for pitch decks.

Rationale
Founders need fast answers to investor “Why you?” questions.

Next Suggested Action (AI)
Add 3 competitors, then generate a differentiation matrix.
```

---

# 3) Full Task Modal — “Overview / Subtasks / Logs / Files”

```markdown
Design a full-screen modal for a task document.

HEADER
- Title + ID
- Status chip (Planning)
- Edit icon + Close icon

TABS
- Overview (default)
- Subtasks (0)
- Logs
- Files

OVERVIEW CONTENT DESIGN
- Big title (editorial)
- One-line description
- Sections:
  - Rationale
  - User Stories
  - Acceptance Criteria (checkbox list)

BOTTOM BAR
- Left: Delete Task (danger but muted)
- Right: Primary "Start Task" + Secondary "Close"

STYLE
- Calm surfaces, high readability
- No cramped spacing
- The doc should feel like an investor memo
```

### Sample Acceptance Criteria (Better, More Specific)

```markdown
Acceptance Criteria
- [ ] Add competitors (name, URL, category, target customer)
- [ ] AI generates summary per competitor (positioning, pricing, GTM)
- [ ] Competitive matrix view (2x2 + feature table)
- [ ] Alerts for competitor changes (monthly digest)
- [ ] Export to Pitch Deck “Competition” slide
```

---

# 4) Roadmap Kanban Dashboard — “Under Review / Planned / In Progress / Done”

## A) UI Prompt (Matches your Roadmap screenshot)

```markdown
Design a premium Roadmap Kanban view for SaaS product features.

HEADER
- Product title: StartupAI (draft)
- Context chips: Competitor Analysis
- Target persona line (short)
- Stats row:
  - 20 features
  - 4 phases
  - Must/Should/Could/Won’t chips

VIEW SWITCHER
- Kanban (active)
- Phases
- All Features
- By Priority

KANBAN COLUMNS
- Under Review (11)
- Planned (8)
- In Progress (1)
- Done (0)

FEATURE CARD
- Must Have / Should Have chip (top left)
- Category chip (Foundation & …)
- Title + 2-line description
- Small impact tags (high/medium) in muted pills
- Right side action:
  - "Build" button for review items
  - "Task" button for planned items

DESIGN RULES
- Cards feel like premium product briefs
- Tags never dominate the card
- One CTA per card, consistent placement
```

## B) Sample Feature Cards (Luxury Copy)

```markdown
Under Review
1) Email Integration for Investor Communication Tracking
- Auto-link Gmail/Outlook threads to investors and deals.
- Tags: Must Have • Foundation • Impact: High

2) Subscription Billing System
- Stripe plans with usage-based AI credits + receipts.
- Tags: Must Have • Foundation • Impact: High

Planned
1) Autosave Everywhere
- Save edits across canvas, docs, CRM notes automatically.
- Tags: Must Have • Foundation • Impact: Medium

2) AI-Enriched Investor Profiles
- Auto-enrich thesis, portfolio, warm intro paths.
- Tags: Should Have • Collaboration • Impact: High

In Progress
1) AI-Powered Pitch Deck Builder
- Generate deck + slide-by-slide rewrites + export.
- Tags: Must Have • Foundation • Impact: High
```

---

# 5) “Left / Main / Right” Logic — System Behavior Prompt

```markdown
Implement dashboard logic for a 3-panel kanban system.

LEFT NAV
- Shows modules and keyboard shortcuts
- Active state is subtle, premium

MAIN KANBAN
- Card click selects and updates Right Panel
- Drag/drop updates status instantly (optimistic UI)
- Queue is automatic when parallel limit reached

RIGHT PANEL
- Always shows:
  1) Summary (what)
  2) Rationale (why)
  3) Next action (do this)
- One primary button only:
  - If selected in Planning → Start Task
  - If selected and has doc → Open Full Task
  - If in progress → View Logs

AI RULES
- AI writes short, executive copy
- AI suggests one next step, not 10
- AI flags risk only when actionable
```

---

# 6) Premium Microcopy Pack (Use Everywhere)

```markdown
Empty states (luxury tone)
- "No tasks running. Start from Planning when you're ready."
- "Queue is clear. We'll hold tasks here if capacity is reached."
- "Nothing to review yet. Completed work appears here automatically."

AI tone
- Calm, direct, confident
- No hype words (revolutionary, game-changing)
- Always gives a reason
```

---

## If you want the *next level* (production-ready prompts)

Say: **“Generate shadcn/tailwind component prompts”** and I’ll output prompts for:

* Kanban columns + card components
* Right panel drawer component
* Modal task viewer layout
* Responsive behavior (tablet/mobile)
* Tokens (spacing/typography/border/shadow) for luxury look
