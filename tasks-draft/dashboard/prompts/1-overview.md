# StartupAI Dashboard Redesign — Master Prompt

> **Version:** 1.0 | **Date:** 2026-02-16
> **Status:** Implementation-ready specification
> **Inputs:** UX audit (31 pages scored), competitive analysis (VenturusAI, VenturKit, Venture Planner), 12 wireframes (333KB), style guide, existing codebase (42 pages, 29 edge functions)

---

## Purpose

Redesign the StartupAI authenticated dashboard from a **cluttered 22-item sidebar / 15-panel dashboard / 1-mega-scroll report** into a **focused 10-item sidebar / 4-card dashboard / 8-screen report** system that feels like opening a beautifully designed journal, not a trading terminal.

The redesign consolidates 42 existing pages into **12 purpose-built screens** organized across 3 phases — stripping out unused features, merging redundant pages, and introducing a warm, calm, editorial aesthetic inspired by Venture Planner's visual polish and VenturusAI's focused-screen architecture.

---

## Goals

### Primary Goals

1. **Reduce cognitive load** — From 22 sidebar items to 10. From 15+ dashboard panels to 4 cards. One screen = one job.
2. **Deliver the validation report properly** — Split the 14-section mega-scroll into 8 color-coded sub-screens with tab navigation, Structure/Document view toggle, and shareable sections.
3. **Warm, calm, premium aesthetic** — Cream/ivory backgrounds, Playfair Display headlines, soft shadows, rounded cards, generous whitespace. Match Venture Planner's visual polish.
4. **AI-guided founder experience** — AI insights on every screen. Time estimates on every action. Contextual suggestions. The founder is never abandoned.
5. **Ship in phases** — MVP (7 screens) → Phase 1.5 (3 screens) → Phase 2 (2 screens). No big-bang rewrite.

### Success Metrics

| Metric | Current | Target |
|---|---|---|
| Sidebar items | 22 | 10 |
| Dashboard cards above fold | 15+ | 4 |
| Validation report screens | 1 (mega-scroll) | 8 (focused) |
| Time to find any feature | ~5 clicks | ≤ 2 clicks |
| New user time-to-value | > 10 min | < 3 min (profile → validation) |
| Pages with AI assistance | ~3 | 12/12 |
| Pages with time estimates | 0 | 12/12 |

---

## Sitemap & Information Architecture

### Navigation Structure (10 Items, 4 Groups)

```
STARTUPAI
├── Dashboard                /dashboard              MVP        Hub
├── Validate                 /validate               MVP        AI Core
│   ├── Chat                 /validate                          Input
│   ├── Progress             /validator/run/:sid                Pipeline
│   └── Report               /validator/report/:id             Output
│       ├── Overview         /validator/report/:id
│       ├── Problem          /validator/report/:id/problem
│       ├── Market           /validator/report/:id/market
│       ├── Customer         /validator/report/:id/customer
│       ├── Model            /validator/report/:id/model
│       ├── MVP Path         /validator/report/:id/mvp
│       ├── Team             /validator/report/:id/team
│       └── Investor         /validator/report/:id/investor
│
├── STRATEGY
│   ├── Lean Canvas          /lean-canvas            MVP        Strategy
│   └── AI Readiness         /ai-readiness           Phase 2    Strategy
│
├── EXECUTION
│   ├── Sprint Board         /tasks                  MVP        Execution
│   └── Roadmap              /roadmap                Phase 1.5  Execution
│
├── FUNDRAISING
│   ├── Pitch Deck           /pitch-deck             Phase 1.5  Fundraising
│   └── Investor Strategy    /investor-strategy      Phase 1.5  Fundraising
│
├── ─────────────
├── Settings                 /settings               MVP        Utility
└── Company Profile          /company-profile        MVP        Input
```

### Route Map (New → Old)

| New Route | Screen | Replaces / Consolidates |
|---|---|---|
| `/dashboard` | Command Centre | `/dashboard` (gutted and rebuilt) |
| `/validate` | Validator Chat | `/validate` + `/validator` (merged) |
| `/validator/run/:sid` | Validator Progress | `/validator/run/:sessionId` (kept) |
| `/validator/report/:id` | Report Overview | `/validator/report/:id` (split into 8) |
| `/validator/report/:id/problem` | Problem & Solution | New sub-screen |
| `/validator/report/:id/market` | Market & Competition | New sub-screen |
| `/validator/report/:id/customer` | Customer & ICP | New sub-screen |
| `/validator/report/:id/model` | Business Model | New sub-screen |
| `/validator/report/:id/mvp` | MVP Path | New sub-screen |
| `/validator/report/:id/team` | Team & Execution | New sub-screen |
| `/validator/report/:id/investor` | Investor Readiness | New sub-screen |
| `/lean-canvas` | Lean Canvas | `/lean-canvas` (kept, polish) |
| `/tasks` | Sprint Board | `/tasks` (major upgrade from list to kanban) |
| `/company-profile` | Company Profile | `/company-profile` (simplified 16→7 fields) |
| `/settings` | Settings | `/settings` (kept, minimal) |
| `/pitch-deck` | Pitch Deck Wizard | `/app/pitch-deck/new` + `/app/pitch-decks` (consolidated) |
| `/investor-strategy` | Investor Strategy | `/investors` + `/crm` (replaced by new screen) |
| `/roadmap` | Roadmap Gantt | `/sprint-plan` (replaced by gantt prototype) |
| `/ai-readiness` | AI Readiness Canvas | New screen |
| `/radar` | Industry Radar | New screen |

### Pages Removed

| Removed Route | Reason |
|---|---|
| `/projects`, `/projects/:id` | Redundant — one startup per user, no project switching needed |
| `/crm` | Replaced by Investor Strategy screen |
| `/documents` | Deferred — Google Drive exists |
| `/investors` | Replaced by Investor Strategy screen |
| `/analytics` | Deferred — no data until weeks of activity |
| `/ai-chat` | Merged into contextual AI on every page |
| `/market-research` | Covered by Validation Report market section |
| `/experiments` | Deferred to Phase 3 |
| `/opportunity-canvas` | Merged into Lean Canvas |
| `/user-profile` | Merged into Settings |
| `/app/events/*` | Deferred — community feature |
| `/app/pitch-deck/:id/edit` | Merged into Pitch Deck Wizard flow |
| `/app/pitch-deck/:id/generating` | Merged into Pitch Deck Wizard flow |

---

## Screen Specifications (12 Screens)

### Phase 1 — MVP (7 Screens)

#### 1. Company Profile `/company-profile`

**Purpose:** Collect 7 core fields that power all downstream AI features.
**Template:** Single Focus (centered column, max-w-2xl)

| Field | Type | Required | Max |
|---|---|---|---|
| Company Name | text | yes | 100 chars |
| Industry | select | yes | Predefined list |
| Stage | select | yes | Idea / Pre-seed / Seed / Series A+ |
| One-Line Description | text | yes | 150 chars |
| Problem Statement | textarea | yes | 500 chars |
| Target Customer | textarea | yes | 500 chars |
| Business Model | select | no | SaaS / Marketplace / E-commerce / Services / Hardware / Other |

**Key Features:**
- Completeness progress bar (e.g., 5/7, 71%)
- Auto-save on field blur (debounced 500ms)
- "Run Validation" button gated at 50%+ completeness
- Inline field validation with character counters

**Wireframe:** `wireframes/01-company-profile.md`

---

#### 2. Validator Chat `/validate`

**Purpose:** Conversational AI validation — gathers missing data, runs 7-agent pipeline, produces 14-section report.
**Template:** Chat (3-panel: context left, chat center, readiness right)

**Key Features:**
- 3 validation modes: Quick (30s), Deep (60s), Investor Lens (45s)
- Profile snapshot in left panel (auto-populated from Company Profile)
- Coverage tracker: 8 fields with checkmarks, readiness % gauge
- Streaming AI responses with markdown rendering
- Collapsible side panels (Ctrl+[ / Ctrl+])
- Pre-fills known data from Company Profile
- Transitions to Progress screen when pipeline starts

**AI Agents:** Validator Pipeline (7 agents — extractor, market, competitive, financial, team, risk, synthesizer)
**Edge Functions:** `validator-start`, `validator-status`, `validator-followup`
**Wireframe:** `wireframes/02-validator-chat.md`

---

#### 3. Validation Report `/validator/report/:id` (8 Sub-Screens)

**Purpose:** Multi-screen AI analysis — the product founders pay for.
**Template:** Report Section (tabs + content + bottom nav)

**Sub-Screens:**

| # | Screen | Route Suffix | Color | Content |
|---|---|---|---|---|
| 1 | Overview | (root) | Neutral | Viability score (radial gauge), executive summary, top 3 strengths, top 3 risks, 8 section nav cards |
| 2 | Problem & Solution | `/problem` | Emerald #0E6E47 | Problem clarity score, solution fit score, UVP assessment, gap analysis |
| 3 | Market & Competition | `/market` | Teal #0D9488 | TAM/SAM/SOM visualization, competitive landscape, 2×2 positioning matrix |
| 4 | Customer & ICP | `/customer` | Blue #3B82F6 | Generated personas, ICP validation, segments, willingness-to-pay |
| 5 | Business Model | `/model` | Amber #D97706 | Revenue model, pricing analysis, unit economics, projections chart |
| 6 | MVP Path | `/mvp` | Orange #EA580C | Core features, timeline (Gantt), milestones, budget, go-to-market |
| 7 | Team & Execution | `/team` | Purple #7C3AED | Team readiness, skill gaps, hiring plan, advisory needs |
| 8 | Investor Readiness | `/investor` | Coral #E11D48 | Fundraising readiness radar, SWOT, pitch recommendations |

**Key Features:**
- Color-coded tab navigation (dot + label + score badge)
- Previous/Next navigation arrows
- Structure View (Venture Planner-style timeline with scores) + Document View toggle
- "Share this section" button per sub-screen
- Dark insight panel for AI-generated key takeaways per section
- Time estimate per section (2-8 min read)
- Export to PDF (full report or individual sections)

**Edge Functions:** `validator-panel-detail`, `validator-regenerate`
**Wireframe:** `wireframes/03-validation-report.md`

---

#### 4. Lean Canvas `/lean-canvas`

**Purpose:** One-page business model editor with AI suggestions.
**Template:** Canvas (3×3 grid + AI drawer)

**9 Boxes:** Problem, Customer Segments, Unique Value Proposition, Solution, Channels, Revenue Streams, Cost Structure, Key Metrics, Unfair Advantage

**Key Features:**
- Interactive 9-box CSS Grid (click-to-edit, Escape to close)
- AI suggestion button per box → side drawer with contextual recommendations
- Color-coded borders: gray=empty, yellow=partial, green=complete
- Version history with restore (Version 3 of 3)
- Consistency checker validates cross-box alignment
- Auto-import from Company Profile and Validation Report
- Tab/Shift+Tab navigation between boxes
- Character counters (500 chars per box)
- Export to PDF/PNG

**AI Agents:** `lean-canvas-agent`
**Wireframe:** `wireframes/04-lean-canvas.md`

---

#### 5. Dashboard (Command Centre) `/dashboard`

**Purpose:** Daily home screen — health score, today's priorities, module progress.
**Template:** Card Grid (2-column, max 4 cards above fold)

**Cards:**

| Card | Content |
|---|---|
| **Health Score** | Composite score (0-100) with trend (+/- delta), 6 dimension badges (Problem, Solution, Market, Traction, Team, Investor), AI insight |
| **Today's Focus** | 3 AI-prioritized actions with time estimates, category tags, and CTAs. Regenerates daily |
| **Module Progress** | 5 rows (Profile, Validation, Canvas, Tasks, Pitch) with color-coded progress bars and navigation arrows |
| **Quick Actions** | 3 primary buttons: Run Validation, Open Canvas, Create Task |

**Key Features:**
- Personalized greeting (time-of-day + company name)
- Warm, calm aesthetic (cream background, rounded cards, soft shadows)
- Every action includes time estimate
- Score recalculates on dependency data changes (event-driven)
- Skeleton loading on initial render
- Cards animate in with staggered FadeIn

**Edge Functions:** `health-scorer`, `action-recommender`, `compute-daily-focus`, `dashboard-metrics`
**Wireframe:** `wireframes/05-dashboard.md`

---

#### 6. Sprint Board (Kanban) `/tasks`

**Purpose:** Sprint-based task execution with AI assist per task.
**Template:** Board (5-column horizontal, full-width)

**Columns:** Backlog → To Do → In Progress → Review → Done

**Key Features:**
- Drag-and-drop between columns (optimistic UI)
- Task cards: title, priority badge (High/Med/Low), tags, due date, assignee avatar
- AI Assist button per card → subtask generation, time estimates, context from report
- "Generate Tasks from Report" → auto-creates tasks from latest validation findings
- "Plan My Week" → AI suggests sprint composition
- Sprint context bar (week range + task counts)
- Filter by tag, priority, assignee, sort order
- Keyboard shortcuts (n=new, 1-5=move column, /=filter)
- Task detail slide panel (right)
- Bidirectional sync with Roadmap (Phase 1.5)

**AI Agents:** `task-agent`
**Wireframe:** `wireframes/06-sprint-board.md`

---

#### 7. Settings `/settings`

**Purpose:** Account management, notifications, billing.
**Template:** Single Focus (3-tab interface)

**Tabs:** Account | Notifications | Billing

**Key Features:**
- Account: avatar, name, email, role, LinkedIn, timezone, password, 2FA, connected accounts (Google/GitHub OAuth), danger zone (export/delete)
- Notifications: 6 email toggles, 3 in-app toggles
- Billing: plan comparison (Free/Pro/Team), usage meter (AI runs/month), Stripe payment, invoice history
- Pre-filled from OAuth registration
- Explicit save buttons (no auto-save on this screen)

**Wireframe:** `wireframes/12-settings.md`

---

### Phase 1.5 — Growth (3 Screens)

#### 8. Pitch Deck Wizard `/pitch-deck`

**Purpose:** 4-step AI wizard to generate investor-ready 10-slide deck.
**Template:** Single Focus (wizard steps) → Card Grid (slide grid) → Split (slide editor)

**Wizard Steps:**
1. **Review Data** — pre-filled from Profile + Report, edit any field
2. **Smart Interview** — AI asks only what's missing (3-5 questions)
3. **Generate** — Signal Strength meter → Generate button → 10-15s loading
4. **Edit & Export** — 10-slide grid view, click to edit per-slide, regenerate per-slide, export PDF/PPTX

**Key Features:**
- Validation gate: score ≥ 50 required to access
- Pre-fill from Profile + Report reduces typing
- Signal Strength meter builds confidence before generation
- Per-slide live preview + edit
- Source attribution ("Pre-filled from your Company Profile")

**AI Agents:** `pitch-deck-agent`
**Edge Functions:** `pitch-deck-agent`
**Wireframe:** `wireframes/07-pitch-deck.md`

---

#### 9. Investor Strategy `/investor-strategy`

**Purpose:** Fundraising readiness assessment, investor targeting, checklist.
**Template:** Card Grid (3-row layout)

**Key Features:**
- Readiness Score (0-100) with AI insight and 7-factor weighted breakdown
- Target Stage selector (Pre-Seed / Seed / Series A / Series B+) → cascades to amount range
- Fundraising Checklist (8 items): pitch deck, validation report, financial model, legal entity, team bios, data room, advisory board, traction proof — with priority badges, completion status, expand for detail, link to relevant tool
- 4 Investor Archetype cards (Angel, Micro VC, Traditional VC, Corporate VC) with check size, timeline, pros/cons, fit score
- AI Recommendation: best-fit archetype with rationale
- Next Actions: 4 prioritized buttons with time estimates
- Timeline Estimate: 3 phases (Prep 4-6 wks, Outreach 6-8 wks, DD 4-8 wks) + total + projected close date

**AI Agents:** `investor-agent`
**Wireframe:** `wireframes/08-investor-strategy.md`
**Replaces:** `/investors` + `/crm` + dashboard Fundraising Readiness panel

---

#### 10. Roadmap (Gantt) `/roadmap`

**Purpose:** Visual 12-week timeline connected to Sprint Board.
**Template:** Board (sidebar + gantt timeline, full-width)

**Key Features:**
- 3 view modes: Timeline (Gantt), Phase View, Agent View
- Gantt bars with % complete overlays, color-coded by status
- "Today" marker (red dashed vertical line, auto-scrolls on load)
- Left sidebar: collapsible phase cards with progress bars
- Filter by status, priority, owner
- Drag bar edges to resize duration
- Task detail modal on bar click
- AI "Optimize Timeline" button → suggests resequencing and parallelization
- Bidirectional sync with Sprint Board
- AI-generated initial roadmap from Validation Report MVP Path section

**Wireframe:** `wireframes/09-roadmap-gantt.md`
**Replaces:** `/sprint-plan`

---

### Phase 2 — Differentiation (2 Screens)

#### 11. AI Readiness Canvas `/ai-readiness`

**Purpose:** 9-box framework to assess organizational AI implementation readiness.
**Template:** Canvas (3×3 grid + AI drawer)

**9 Boxes:** Vision & Strategy, AI Use Cases, Data Readiness, Technology Infrastructure, People & Skills, AI Value Proposition, Governance & Ethics, Costs & ROI, Success Metrics

**Key Features:**
- 2 assessment modes: 9-Box grid + 4-Category view (Strategy, Legal, Business, Systems & Data)
- Bidirectional sync between modes
- Readiness Score (0-100) with 4 sub-dimension scores
- Auto-generated Strengths list (3-5 items) and Gaps to Address (prioritized)
- Deloitte 4 Questions strategic reflection prompts
- Import from Company Profile and Lean Canvas
- Per-box AI coaching with contextual suggestions
- Color-coded borders: gray=empty, yellow=partial, green=complete
- Export to PDF

**Wireframe:** `wireframes/10-ai-readiness.md`
**Differentiator:** No competitor has this. Unique to AI-era startups.

---

#### 12. Industry Radar `/radar`

**Purpose:** Bird's-eye view of industry signals — news, events, social, competitors.
**Template:** Card Grid (5-tab interface)

**Tabs:** Overview | News | Events | Social | Competitors

**Key Features:**
- Radar circular visualization (nodes = signal categories, pulsing for new signals <24h)
- Overview: 3 preview cards per category, signal counts, week-over-week delta
- News: AI-generated 2-3 sentence summaries, relevance scores (High/Med/Low)
- Events: cards with "Add to Calendar" integration (Google Calendar / Outlook)
- Social: platform badges (Twitter/Reddit/LinkedIn), sentiment (positive/neutral/negative)
- Competitors: profile cards, activity timeline, Threat Level gauge, differentiator notes
- Auto-seeded topics from Company Profile (industry, competitors named)
- Alert system: real-time / daily / weekly digest options
- Manage Topics button for customization
- Weekly narrative digest email

**Wireframe:** `wireframes/11-industry-radar.md`
**Inspired by:** VenturKit Radar

---

## Shared Features (All 12 Screens)

### AI Presence

Every screen has contextual AI:
- **AI Insight panels** — dark card with Sparkles icon, appears within relevant cards
- **AI Suggestion drawers** — slide-from-right panel for Canvas boxes, task assist, report editing
- **AI Badge** — marks any AI-generated content (`<Sparkles /> AI` pill)
- **Global AI Assistant** — floating button, available on every page (existing `GlobalAIAssistant` component)

### Time Estimates

Every action and content block shows estimated time:
- Report sections: "5 min read"
- Today's Focus items: "15 min | Strategy"
- Checklist items: "~30 min"
- Wizard steps: "Step 2 of 4 — ~3 min"

### Color-Coded System

Modules and sections are identified by consistent accent colors throughout the app:

| Module | Accent | Hex |
|---|---|---|
| Problem & Solution | Emerald | #0E6E47 |
| Market & Competition | Teal | #0D9488 |
| Customer & ICP | Blue | #3B82F6 |
| Business Model | Amber | #D97706 |
| MVP Path | Orange | #EA580C |
| Team & Execution | Purple | #7C3AED |
| Investor Readiness | Coral | #E11D48 |

### Score Color Bands

| Range | Color | Meaning |
|---|---|---|
| 80-100 | Sage green | Strong |
| 60-79 | Blue | Good |
| 40-59 | Amber | Needs work |
| 0-39 | Red | Critical |

---

## AI Agents & Edge Functions

### Existing Agents (Keep & Enhance)

| Agent | Edge Function | Used By Screens |
|---|---|---|
| **Validator Pipeline** (7 agents) | `validator-start` | Validator Chat, Report |
| **Validator Status** | `validator-status` | Validator Progress |
| **Validator Detail** | `validator-panel-detail` | Report sub-screens |
| **Validator Regenerate** | `validator-regenerate` | Report sub-screens |
| **Validator Follow-up** | `validator-followup` | Validator Chat |
| **Lean Canvas Agent** | `lean-canvas-agent` | Lean Canvas |
| **Pitch Deck Agent** | `pitch-deck-agent` | Pitch Deck Wizard |
| **Task Agent** | `task-agent` | Sprint Board, Dashboard |
| **Health Scorer** | `health-scorer` | Dashboard |
| **Action Recommender** | `action-recommender` | Dashboard (Today's Focus) |
| **Daily Focus** | `compute-daily-focus` | Dashboard |
| **Dashboard Metrics** | `dashboard-metrics` | Dashboard |
| **Insights Generator** | `insights-generator` | Dashboard, Report |
| **Investor Agent** | `investor-agent` | Investor Strategy |
| **Stage Analyzer** | `stage-analyzer` | Dashboard, Profile |
| **Onboarding Agent** | `onboarding-agent` | Company Profile (import) |

### New Agents Required

| Agent | Purpose | Used By | Priority |
|---|---|---|---|
| **Consistency Checker** | Validates cross-box alignment in Canvas | Lean Canvas, AI Readiness | MVP |
| **Roadmap Generator** | Creates initial Gantt from Report MVP Path | Roadmap | Phase 1.5 |
| **Timeline Optimizer** | Suggests resequencing/parallelization | Roadmap | Phase 1.5 |
| **Sprint Planner** | AI "Plan My Week" composition | Sprint Board | MVP |
| **Readiness Scorer** | 7-factor weighted fundraising readiness | Investor Strategy | Phase 1.5 |
| **Archetype Matcher** | Best-fit investor type recommendation | Investor Strategy | Phase 1.5 |
| **AI Readiness Assessor** | Calculates AI readiness score from 9 boxes | AI Readiness Canvas | Phase 2 |
| **Gap Analyzer** | Auto-generates strengths/gaps lists | AI Readiness Canvas | Phase 2 |
| **News Summarizer** | AI 2-3 sentence summaries of news articles | Industry Radar | Phase 2 |
| **Relevance Scorer** | Rates signal relevance to startup | Industry Radar | Phase 2 |
| **Threat Assessor** | Competitor threat level analysis | Industry Radar | Phase 2 |
| **Digest Writer** | Weekly narrative summary of signals | Industry Radar | Phase 2 |

---

## Workflows

### W1: First-Time Founder Journey (MVP)

```
Landing Page → Login (Google OAuth)
    → Company Profile (7 fields, ~3 min)
        → "Run Validation" button (enabled at 50%+ completeness)
            → Validator Chat (mode selection, AI questions, ~2 min)
                → Validator Progress (7-agent pipeline, 30-60s)
                    → Validation Report Overview (viability score reveal)
                        → Browse 8 sub-screens (tab navigation)
                        → "Open in Lean Canvas" → pre-filled canvas
                        → "Create Tasks" → Sprint Board with AI-generated tasks
    → Dashboard (health score, today's focus, module progress)
```

### W2: Daily Founder Return Loop

```
Dashboard (health score + trend, today's 3 priorities)
    → Click priority #1 → relevant screen (Canvas / Tasks / Report)
        → Complete action → return to Dashboard
            → Score updates, next priority surfaces
    → Module Progress bar → click any module → navigate directly
```

### W3: Validation → Execution Pipeline

```
Validation Report (findings + recommendations per section)
    → "Generate Tasks from Report" on Sprint Board
        → AI creates discrete tasks from validation findings
            → Drag to "To Do" → assign → set due date
                → Roadmap auto-populates from tasks (Phase 1.5)
```

### W4: Fundraising Pipeline (Phase 1.5)

```
Investor Strategy (readiness score, checklist)
    → Checklist item: "Build Pitch Deck" → [Go] → Pitch Deck Wizard
        → Validation gate (score ≥ 50)
            → 4-step wizard → generate 10-slide deck
                → Return to Investor Strategy → checklist auto-updates
    → Archetype recommendation → target investor type
    → Timeline estimate → projected close date
```

### W5: Strategy Refinement Loop

```
Lean Canvas (edit boxes, AI suggestions)
    → Consistency checker flags misalignment
        → AI suggestion: "Your revenue model doesn't match customer segment"
            → Apply suggestion → update box
    → "Re-validate" → Validator Chat with updated data
        → New report → compare scores
```

### W6: AI Readiness Assessment (Phase 2)

```
AI Readiness Canvas → Import from Profile + Lean Canvas
    → Edit 9 boxes with AI coaching per box
        → Toggle to 4-Category view for strategic grouping
            → Readiness Score auto-calculated
                → Strengths + Gaps auto-generated
                    → Deloitte 4 Questions reflection
                        → Export assessment to PDF
```

### W7: Industry Monitoring (Phase 2)

```
Company Profile (industry, competitors) → auto-seeds Radar topics
    → Industry Radar Overview (signal counts, preview cards)
        → News tab (AI summaries, relevance scores)
        → Competitors tab (activity timeline, threat level)
    → Set alerts (real-time / daily / weekly)
    → Weekly digest email (narrative summary)
```

---

## Data Flow Architecture

### Cross-Screen Data Dependencies

```
Company Profile ─────────────┬──→ Validator Chat (pre-fill)
                             ├──→ Lean Canvas (auto-import)
                             ├──→ AI Readiness (auto-import)
                             ├──→ Dashboard (name, stage)
                             ├──→ Pitch Deck (pre-fill step 1)
                             └──→ Industry Radar (auto-seed topics)

Validation Report ───────────┬──→ Dashboard (health score, insights)
                             ├──→ Lean Canvas (AI suggestions context)
                             ├──→ Sprint Board (generate tasks)
                             ├──→ Pitch Deck (pre-fill data + scores)
                             ├──→ Investor Strategy (readiness factors)
                             └──→ Roadmap (MVP Path → initial gantt)

Lean Canvas ─────────────────┬──→ AI Readiness (import)
                             └──→ Pitch Deck (business model context)

Sprint Board ←───────────────→ Roadmap (bidirectional sync)

Investor Strategy ←──────────── Pitch Deck (checklist auto-update)
```

### Supabase Tables (Core)

| Table | Purpose | Used By |
|---|---|---|
| `startups` | Company profile data | All screens |
| `startup_profiles` | Extended profile fields | Profile, Dashboard |
| `validator_sessions` | Validation run records | Validator, Report |
| `validator_results` | 14-section report data | Report, Dashboard |
| `lean_canvases` | Canvas versions + content | Lean Canvas |
| `tasks` | Sprint board tasks | Sprint Board, Roadmap, Dashboard |
| `pitch_decks` | Generated deck data | Pitch Deck |
| `pitch_deck_slides` | Individual slide content | Pitch Deck |

### Real-Time Subscriptions (Existing)

- `validator_sessions` — progress updates during pipeline run
- `tasks` — kanban card movements across users
- `startups` — profile changes propagate to dashboard

---

## Suggested Additional Features

### High-Value Additions (Consider for Scope)

| Feature | Screen | Value | Effort |
|---|---|---|---|
| **Comparison Mode** | Report | Side-by-side diff of two validation runs | Medium |
| **Export All** | Report | One-click PDF of full 8-section report with branding | Low |
| **Task Templates** | Sprint Board | Pre-built task sets for common activities (customer interviews, landing page, etc.) | Low |
| **Milestone Markers** | Roadmap | Diamond shapes on Gantt for key dates (launch, demo day, fundraise close) | Low |
| **Dependency Arrows** | Roadmap | Visual lines showing task→task dependencies | Medium |
| **Onboarding Tour** | All | 5-step guided tour on first login highlighting key features | Medium |
| **Keyboard Shortcuts** | All | Global shortcut panel (? to open). ⌘K command palette | Medium |
| **Undo/Redo** | Canvas, Board | Ctrl+Z / Ctrl+Shift+Z for canvas edits and task moves | Medium |
| **Dark Mode** | All | Toggle in Settings. Design tokens already support `.dark` class | Medium |
| **Notifications Center** | Dashboard | Bell icon → dropdown with recent events, completions, AI insights | Low |
| **Weekly Email Digest** | N/A | Summary of health score changes, completed tasks, new signals | Low |
| **Collaboration Invite** | Settings | Invite co-founder/advisor to view dashboard (read-only) | High |
| **Public Report Link** | Report | Shareable URL for a single report section (no auth required) | Medium |
| **CSV/Excel Export** | Board, Strategy | Export task list or investor checklist to spreadsheet | Low |

### Technical Improvements (Recommended)

| Improvement | Impact |
|---|---|
| **Route-level code splitting** | Already exists (lazy loading). Ensure new report sub-screens are also lazy. |
| **Optimistic UI** | Kanban drag-drop and canvas edits should update UI instantly, sync to server in background. |
| **SWR/Stale-While-Revalidate** | React Query already configured. Ensure all dashboard data uses `staleTime` for instant returns on revisit. |
| **Skeleton loading** | Every card should have a matching skeleton shape for perceived performance. |
| **Prefetching** | Prefetch adjacent report sections when viewing one (Next/Prev). Prefetch dashboard data on login. |
| **Service Worker** | Cache static assets + fonts for instant repeat loads. |
| **Error boundaries** | Per-card error boundaries so one failing card doesn't break the dashboard. |

---

## Phase Plan

### Phase 1 — MVP (Ship First)

| Screen | Status | Work |
|---|---|---|
| Company Profile | Exists | Simplify from 16 to 7 fields. Remove right sidebar. New layout. |
| Validator Chat | Exists | Polish chat UX. Add mode selector. Pre-fill from profile. Merge `/validate` + `/validator`. |
| Validation Report | Exists | **Major:** Split 1 mega-scroll → 8 sub-screens. Tab nav. Color coding. Structure/Document toggle. |
| Lean Canvas | Exists, working | Keep. Polish AI suggestions. Add consistency checker. |
| Dashboard | Exists | **Redesign:** Gut 15+ panels → 4 cards. Warm aesthetic. New layout. |
| Sprint Board | Exists | **Upgrade:** List view → 5-column Kanban. AI Assist. Drag-drop. Sprint context. |
| Settings | Exists | Keep minimal. Merge User Profile into Account tab. |

### Phase 1.5 — Growth

| Screen | Status | Work |
|---|---|---|
| Pitch Deck Wizard | Exists, working | Consolidate routes. Add validation gate. Improve wizard flow. |
| Investor Strategy | Prototype ready | Build new: readiness score, checklist, archetype cards, timeline. |
| Roadmap (Gantt) | Prototype ready | Build new: 3 view modes, Gantt bars, bidirectional Sprint Board sync. |

### Phase 2 — Differentiation

| Screen | Status | Work |
|---|---|---|
| AI Readiness Canvas | Prototype ready | Build new: 9-box grid, dual mode, AI assessor, import, scoring. |
| Industry Radar | Concept only | Build new: 5-tab interface, radar viz, AI summaries, alerts, digest. |

---

## Design References

| Document | Path | Content |
|---|---|---|
| **Style Guide** | `tasks/dashboard/design/style-guide.md` | Full design system: typography, colors, cards, components, animations, layout templates |
| **Dashboard Plan** | `tasks/dashboard/plan/03-dash-plan.md` | Competitive analysis, screen rankings, sidebar structure, phase roadmap |
| **Navigation Audit** | `tasks/dashboard/plan/02-summary-table.md` | Audit of all 31 current pages with scores |
| **Wireframes** | `tasks/dashboard/wireframes/01-12*.md` | 12 wireframes with ASCII layouts, sample data, features, agents, workflows, user journeys |
| **Tailwind Config** | `tailwind.config.ts` | Font families, color tokens, shadows, animations |
| **CSS Variables** | `src/index.css` | HSL design tokens, component classes, utility classes |
| **Current Router** | `src/App.tsx` | All 35+ existing routes with lazy loading |
| **Layout Component** | `src/components/layout/DashboardLayout.tsx` | Current sidebar nav (22 items), mobile nav, AI panel |
| **PRD** | `plan/prd-draft.md` | Full product requirements, 10-stage lifecycle, 13 playbooks |

---

## Implementation Order (Recommended Build Sequence)

### Step 1: Foundation

1. Create new sidebar component (10 items, 4 groups)
2. Update `DashboardLayout.tsx` — new sidebar, remove bottom nav duplication, warm background
3. Add section color CSS variables to `src/index.css`
4. Create shared components: `FadeIn`, `PageHeader`, `ScoreBadge`, `AIBadge`, `TimeEstimate`, `EmptyState`

### Step 2: Core Screens (MVP)

5. Rebuild `Dashboard.tsx` — 4-card grid, health score, today's focus, module progress, quick actions
6. Simplify `CompanyProfile.tsx` — 7 fields, progress bar, auto-save, validation gate
7. Split `ValidatorReport.tsx` → 8 sub-screen components with tab navigation and color coding
8. Upgrade `Tasks.tsx` — list → 5-column Kanban board with drag-drop
9. Polish `LeanCanvas.tsx` — add consistency checker, improve AI suggestion panel
10. Merge `UserProfile.tsx` into `Settings.tsx` Account tab

### Step 3: Remove Dead Routes

11. Remove routes: `/projects`, `/crm`, `/documents`, `/investors`, `/analytics`, `/ai-chat`, `/market-research`, `/experiments`, `/opportunity-canvas`, `/user-profile`, `/app/events/*`
12. Redirect old routes to new equivalents where applicable
13. Clean up unused page components and their imports

### Step 4: Phase 1.5 Screens

14. Consolidate Pitch Deck routes, add validation gate
15. Build Investor Strategy screen from prototype
16. Build Roadmap Gantt from prototype, connect to Sprint Board

### Step 5: Phase 2 Screens

17. Build AI Readiness Canvas from prototype
18. Build Industry Radar (new)
