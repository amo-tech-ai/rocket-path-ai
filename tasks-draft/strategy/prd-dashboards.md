# PRD: StartupAI Dashboard System

> **Version:** 1.0 | **Date:** 2026-02-16 | **Author:** Product
> **Status:** Draft
> **Scope:** 12-screen product redesign across 3 phases

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Product Vision & Strategy](#3-product-vision--strategy)
4. [System Architecture](#4-system-architecture)
5. [Screen Specifications](#5-screen-specifications)
6. [AI Agents](#6-ai-agents)
7. [Data Model](#7-data-model)
8. [Workflows & Logic](#8-workflows--logic)
9. [User Journeys](#9-user-journeys)
10. [Design System](#10-design-system)
11. [Information Architecture](#11-information-architecture)
12. [Phased Rollout](#12-phased-rollout)
13. [Success Metrics](#13-success-metrics)
14. [Appendix: Competitive Analysis](#14-appendix-competitive-analysis)

---

## 1. Executive Summary

StartupAI is an AI-powered OS for startup founders. This PRD defines the complete dashboard system redesign: **12 purpose-built screens** replacing the current 31-page application, organized into a 3-phase rollout (MVP, Growth, Differentiation).

### Core Principle

**Humans decide. AI assists. Nothing happens silently.**

### Layout Mental Model

```
LEFT   -> Context & Navigation (10 items, down from 23)
MAIN   -> Human Work (focused screens, one job each)
RIGHT  -> Intelligence & Actions (AI suggestions, scores, coaching)
```

### What Changes

| Metric | Current | Target |
|--------|---------|--------|
| Sidebar items | 23 | 10 |
| Dashboard panels above fold | 15+ | 4 |
| Validation report screens | 1 mega-scroll | 8 focused sub-screens |
| Pages with AI assistance | ~3 | 12/12 |
| Pages with time estimates | 0 | 12/12 |
| New user time-to-value | >10 min | <3 min |

---

## 2. Problem Statement

### Current State (Dashboard Audit Score: 49/100)

| Criteria | Score | Issue |
|----------|-------|-------|
| Strategic Clarity | 55 | Dashboard tries to be health monitor + task manager + CRM + fundraising tracker + activity feed |
| UX Simplicity | 40 | 15+ panels, 20+ CTAs competing for attention |
| Execution Focus | 45 | No clear "do this next" signal |
| Over-engineering Risk | 85 | Quick-action bar links to non-existent features, 0% progress bars demoralize |
| MVP Necessity | 50 | Half the panels serve Phase 2+ features |

### Specific Problems

1. **Information overload** -- 15+ dashboard panels overwhelm first-time users
2. **Empty state demoralization** -- "0 Decks, 0 Investors, 0 Events" on day one
3. **Sidebar bloat** -- 23 navigation items across 5 groups, most leading to stubs
4. **Mega-scroll report** -- 14-section validation report in one page, hard to scan/share
5. **Premature features** -- CRM, Analytics, Documents, Events cluttering the MVP
6. **Dark/dense aesthetic** -- Doesn't match the calm, trustworthy brand promise
7. **Redundant patterns** -- Journey Stepper, Module Progress, Completion Panel all overlap

---

## 3. Product Vision & Strategy

### Three-Phase Rollout

```
Phase 1 (MVP)              Phase 1.5 (Growth)         Phase 2 (Differentiation)
7 screens                  3 screens                   2 screens
-----------------------    -----------------------     -----------------------
Company Profile            Pitch Deck Wizard           AI Readiness Canvas
Validator Chat             Investor Strategy            Industry Radar
Validation Report (x8)    Roadmap / Gantt
Lean Canvas
Dashboard
Sprint Board
Settings
```

### Design Principles

| # | Principle | Implementation |
|---|-----------|----------------|
| 1 | One screen = one job | Each screen has a single purpose. No multi-purpose dashboards. |
| 2 | Card-grid overview | Dashboard uses 3-4 warm cards, not 15 panels |
| 3 | Color-code by section | 7 section colors consistent across all screens |
| 4 | Max 10 sidebar items | Collapse Phase 2+ items until they ship |
| 5 | Warm, calm aesthetic | Cream backgrounds, rounded cards, soft shadows, generous whitespace |
| 6 | AI always present | Every screen has contextual AI (insight panels, suggestion drawers) |
| 7 | Time estimates everywhere | Every action shows estimated minutes |
| 8 | Preview before apply | AI proposes, user approves, undo always available |

### What Inspired This (Competitive Learnings)

| Source | Learning Applied |
|--------|-----------------|
| VenturusAI | Multiple focused report screens beat mega-scrolls |
| Venture Planner | Color-coded sections, warm aesthetic, card-based navigation |
| VenturKit | Radar for market intelligence, sidebar structure, AI consultant pattern |
| Venturis | Strategic frameworks (SWOT, Porter's), validity scoring, right-panel guidance |

---

## 4. System Architecture

### 4.1 Three-Panel Layout

```
+------------------------------------------------------------------+
| Mobile TopBar (Menu, Logo, Notifications)         [lg:hidden]     |
+----------+-----------------------------------+--------------------+
| LEFT     |                                   | RIGHT              |
| Sidebar  |       MAIN CONTENT AREA           | AI Panel           |
| (16rem)  | Flex-1, overflow-y-auto            | (20rem / 80px)     |
| Fixed    | p-4 sm:p-6 lg:p-8                 | Hidden < xl        |
| lg:block |                                   |                    |
|          |                                   |                    |
| [Logo]   |                                   | AI Intelligence    |
| [Nav x5] |                                   | Suggestions        |
| [Prog]   |                                   | Scores             |
| [Sett]   |                                   | Coaching           |
+----------+-----------------------------------+--------------------+
| Mobile Bottom Nav [lg:hidden]                                     |
+------------------------------------------------------------------+
```

### 4.2 Responsive Breakpoints

| Breakpoint | Left | Main | Right | Bottom Nav |
|------------|------|------|-------|------------|
| Mobile (<768px) | Hidden (sheet) | Full width | Hidden (sheet) | Visible |
| Tablet (768-1279px) | 16rem fixed | Flex-1 | Hidden | Hidden |
| Desktop (1280px+) | 16rem fixed | Flex-1 | 20rem fixed | Hidden |

### 4.3 Tech Stack

- **Frontend:** Vite 5 + React 18 + TypeScript + Tailwind + shadcn/ui
- **Backend:** Supabase (PostgreSQL + RLS + Edge Functions)
- **AI:** Gemini 3 (fast ops, suggestions, extraction) + Claude 4.6 (reasoning, generation)
- **State:** React Query (server state) + React Context (UI state)
- **Routing:** React Router v6 with lazy-loaded routes

### 4.4 AI Rules (Non-Negotiable)

Every AI-powered feature must satisfy all 6 rules before shipping:

```
[ ] No silent writes    -- AI never changes data without user action
[ ] Preview before apply -- User sees what will change before it happens
[ ] Undo available      -- Every AI-applied change can be reverted
[ ] "Why" explanation   -- AI explains its reasoning
[ ] Action logged       -- Every AI action recorded in ai_action_logs
[ ] Respects user scope -- RLS enforced, user data only
```

---

## 5. Screen Specifications

### 5.1 Company Profile (`/company-profile`) -- Phase 1

**Purpose:** Data intake. 7 core fields that feed all downstream AI features.

**Layout:** Single-column centered form with completeness progress bar.

**Fields:**

| # | Field | Type | Validation | Maps To |
|---|-------|------|------------|---------|
| 1 | Startup Name | Text input | Required, 2-100 chars | All screens (header) |
| 2 | Industry | Select + custom | Required | Competitor analysis, benchmarks |
| 3 | Stage | Select (Pre-idea through Series B+) | Required | Stage-appropriate metrics, advice |
| 4 | Problem | Textarea | Required, 20-500 chars | Validation, Canvas (Problem box) |
| 5 | Solution | Textarea | Required, 20-500 chars | Validation, Canvas (Solution box) |
| 6 | Target Customer (ICP) | Textarea | Required, 20-500 chars | Validation, Canvas (Segments box) |
| 7 | 90-Day Goal | Textarea | Optional, 20-300 chars | Sprint planning, focus items |

**Features:**
- Completeness progress bar (0-100%, non-empty fields / 7)
- Auto-save with debounce (500ms) + status indicator
- "Run Validation" button enabled at 50% completeness (4+ fields)
- Field-level inline validation (min char counts)
- Mobile: stacked layout, same fields

**AI Agents:** None. Pure data input. All downstream agents consume this data.

**What's Removed (vs current):**
- Smart Suggestions sidebar (premature)
- URL Import (unbuilt)
- Funding Distribution chart (premature)
- Section tabs (7 fields fit on one scroll)
- Match Confidence 82% metric (confusing)

---

### 5.2 Validator Chat (`/validate`) -- Phase 1

**Purpose:** Conversational AI startup validation. The core product "aha moment."

**Layout:** 3-panel -- Coverage tracker (left), Chat (center), Readiness (right).

**Left Panel -- Coverage Tracker:**

| Field | Source | Icon |
|-------|--------|------|
| Problem | Extracted from chat | Checkmark when detected |
| Solution | Extracted from chat | Checkmark when detected |
| ICP | Extracted from chat | Checkmark when detected |
| Stage | Extracted from chat | Checkmark when detected |
| Competitors | Extracted from chat | Checkmark when detected |
| Traction | Extracted from chat | Checkmark when detected |
| Revenue Model | Extracted from chat | Checkmark when detected |
| Team | Extracted from chat | Checkmark when detected |

**Center Panel -- Chat:**
- Streamed AI responses with typing indicator
- Markdown rendering in messages
- Auto-scroll with "New message" pill
- Message persistence (resume across sessions)
- Profile auto-load with personalized AI greeting

**Right Panel -- Readiness:**
- Readiness % (mirrors coverage tracker completion)
- Validation mode selector:
  - Quick (~30s, 3 agents)
  - Deep (~60s, 7 agents) -- default
  - Investor Lens (~45s, investor-focused weighting)
- "Run Validation" button (enabled at 80%+ coverage)

**AI Agents:**

| Agent | Role | Model | Timing |
|-------|------|-------|--------|
| Context Extractor | Parse messages, extract structured data, update coverage | Gemini Flash | Real-time (500ms debounce) |
| Validation Coach | Generate conversational responses, prioritize by coverage gaps | Claude Sonnet | Per-message |
| Pipeline Orchestrator | Manage 7-agent validation when user clicks Run | Edge function | On trigger |

---

### 5.3 Validation Report (`/validator/report/:id`) -- Phase 1

**Purpose:** 8-screen analysis from 7-agent pipeline. The payoff.

**Layout:** Tab-navigated sub-screens, each with a single analysis topic.

**Tab Navigation:**

| # | Screen | Route Suffix | Color | Time Est. | Score Range |
|---|--------|-------------|-------|-----------|-------------|
| 1 | Overview | `/` | Neutral | 2 min | 0-100 composite |
| 2 | Problem & Solution | `/problem` | Emerald #0E6E47 | 5 min | 0-100 |
| 3 | Market & Competition | `/market` | Teal #0D9488 | 8 min | 0-100 |
| 4 | Customer & ICP | `/customer` | Blue #3B82F6 | 5 min | 0-100 |
| 5 | Business Model | `/model` | Amber #D97706 | 6 min | 0-100 |
| 6 | MVP Path | `/mvp` | Orange #EA580C | 8 min | 0-100 |
| 7 | Team & Execution | `/team` | Purple #7C3AED | 4 min | 0-100 |
| 8 | Investor Readiness | `/investor` | Coral #E11D48 | 5 min | 0-100 |

**Screen 1: Overview**
- Viability score (0-100 radial gauge with color band)
- Top 3 strengths (green badges)
- Top 3 risks (amber/red badges)
- Section card grid (7 cards, each showing section name + score + color)
- Action bar: [Download PDF] [Share Link] [Re-run Validation]

**Screen 2: Problem & Solution**
- Problem clarity score + AI narrative (strengths, weaknesses)
- Solution fit score + alignment analysis
- UVP assessment (current text vs AI-suggested improvement)
- Gap analysis table (3-5 actionable items)
- Dark insight card with key takeaway

**Screen 3: Market & Competition**
- TAM / SAM / SOM (nested concentric rectangles with dollar amounts)
- Competitive landscape table (5-8 competitors, features, pricing)
- 2x2 positioning matrix (Price axis vs AI/Automation axis)
- Moat assessment: Weak / Medium / Strong with rationale

**Screen 4: Customer & ICP**
- ICP validation score + feedback narrative
- 2 AI-generated personas (demographics, pains, goals, WTP)
- Customer segments table (segment name, size, fit score, priority)
- Acquisition channel recommendations (3-4 channels with expected CAC)

**Screen 5: Business Model**
- Revenue model table (tier name, price, features, target segment)
- Unit economics: CAC, LTV, LTV:CAC ratio (with visual gauges)
- 12-month financial projection chart (MRR line + cumulative revenue bar)
- Pricing recommendations (2-3 specific suggestions)

**Screen 6: MVP Path**
- Core feature list (5-8 items with MoSCoW priority tags)
- 12-week Gantt timeline with milestones (compact visual)
- Budget estimate table (category, monthly cost, 12-month total)
- GTM plan: 3 channels with expected outcomes + timeline

**Screen 7: Team & Execution**
- Team readiness table (6 dimensions scored: Technical, Product, Sales, Marketing, Operations, Leadership)
- Skill gap analysis: Critical vs Nice-to-Have
- Hiring plan timeline with cost projections
- Advisory board recommendations

**Screen 8: Investor Readiness**
- Investor readiness score + summary narrative
- Investor criteria gap table (what investors expect vs current status)
- SWOT 2x2 grid
- Pitch preparation checklist (interactive checkboxes)
- Pre-written pitch angle (2-3 sentences)

**Cross-Screen Features:**
- Color-coded tab bar with dot + label + score badge
- Previous / Next navigation arrows
- "Share this section" per sub-screen
- Structure View (scores + timeline) vs Document View (full narrative) toggle
- Score color bands: green 80+, blue 60-79, amber 40-59, red 0-39
- Export full report or individual section as PDF

**AI Agents (7-Agent Pipeline):**

| # | Agent | Responsibility | Model | Duration |
|---|-------|---------------|-------|----------|
| 1 | Problem Analyst | Problem clarity, solution fit, UVP, gap analysis | Gemini Pro | ~8s |
| 2 | Market Intelligence | TAM/SAM/SOM, competitive landscape, positioning | Gemini Pro | ~12s |
| 3 | Customer Insight | Personas, segments, acquisition channels | Gemini Pro | ~9s |
| 4 | Business Model | Revenue analysis, unit economics, projections | Gemini Pro | ~10s |
| 5 | MVP Architect | Feature priority, timeline, budget, GTM | Gemini Pro | ~12s |
| 6 | Team Assessor | Readiness scoring, skill gaps, hiring plan | Gemini Flash | ~7s |
| 7 | Investor Lens | Fundraising readiness, SWOT, pitch recommendations | Gemini Pro | ~10s |
| 8 | Report Composer | Aggregate scores, generate overview, rank strengths/risks | Gemini Flash | ~2s |

---

### 5.4 Lean Canvas (`/lean-canvas`) -- Phase 1

**Purpose:** Interactive 9-box business model editor with AI per-box coaching.

**Layout:** CSS Grid (5 columns x 3 rows) with right-side AI suggestion drawer.

**9-Box Grid:**

| Position | Box | Grid Span |
|----------|-----|-----------|
| R1C1 | Problem | 1x1 |
| R1C2 | Solution | 2 rows |
| R1C3 | Key Metrics | 1x1 |
| R1C4 | UVP | 1x1 |
| R1C5 | Unfair Advantage | 2 rows |
| R2C1 | Customer Segments | 1x1 |
| R2C3 | Channels | 1x1 |
| R2C4 | Cost Structure | 1x1 |
| R3C1-2 | Revenue Streams | 2 cols |
| R3C3-5 | Existing Alternatives | 3 cols |

**Features:**
- **Inline editing** -- Click any box to edit. Box expands, shows cursor + char count. Done button or click-away saves.
- **Auto-save** -- 500ms debounce after last keystroke. Status: "Saving..." -> "Saved just now."
- **Character limits** -- 300 chars most boxes, 500 for Problem and Solution.
- **AI suggestion button [AI !!]** -- Per box. Opens right drawer with contextual recommendations.
- **AI Suggestions right drawer** -- Toggleable panel showing box-specific suggestions, rationale, benchmarks, confidence score. Buttons: [Apply Suggestions], [Regenerate].
- **Consistency Checker** -- Runs silently (2s debounce after edit). Flags cross-box contradictions as subtle inline warnings.
- **Version history** -- Significant edits create versions. Counter: "Version X of Y." Click to open version modal with [Restore] buttons.
- **Pre-fill from Profile** -- Auto-populates Problem, Solution, Customer Segments on first open.
- **Post-validation enhancement** -- If report exists, enriches pre-fill with cost quantification, personas, benchmarks.
- **Export** -- PDF (grid layout), PNG (screenshot quality), Print CSS.
- **Keyboard nav** -- Tab: next box. Shift+Tab: previous. Enter: edit. Escape: close. Ctrl+Shift+A: AI suggestions.

**AI Agents:**

| Agent | Role | Model | Trigger |
|-------|------|-------|---------|
| Canvas Coach | Per-box suggestions based on profile, industry, stage, report data. 3-5 suggestions with rationale + confidence score. | Gemini Flash | User clicks [AI !!] |
| Consistency Checker | Cross-box alignment validation. Flags: revenue/pricing mismatch, channels/ICP mismatch, cost gaps. Advisory only. | Gemini Flash | After any edit (2s debounce) |

**Per-Box Validation Feedback (shown during editing):**

| Box | Example Feedback |
|-----|-----------------|
| Problem | "Strong -- specific and quantified. Consider adding emotional impact." |
| Solution | "Good -- names specific integrations. Clarify the AI component." |
| Key Metrics | "Solid metrics. Add a leading indicator (e.g., signup-to-activation rate)." |
| UVP | "Compelling -- uses customer language. Test this in landing page A/B." |
| Unfair Advantage | "Weak -- 'AI sync engine' is replicable. What data moat do you build?" |
| Customer Segments | "Well-defined primary. Secondary needs more detail." |
| Channels | "Good mix. Add estimated CAC per channel." |
| Cost Structure | "Complete. Flag: no marketing budget listed." |
| Revenue Streams | "Clear tiers. Consider adding annual discount option." |

---

### 5.5 Dashboard / Command Centre (`/dashboard`) -- Phase 1

**Purpose:** Daily command center. AI-generated priorities, health score, module progress.

**Layout:** 4-card grid with personalized greeting header.

**Wireframe:**

```
+------------------------------------------------------------------+
| [=]  StartupAI                          [!]  [Avatar] Settings   |
+------------------------------------------------------------------+
|                                                                   |
|  Monday, February 16, 2026                                       |
|  Good morning, TaskFlow AI.                                      |
|                                                                   |
| +--------------------------------------------------------------+ |
| |  STARTUP HEALTH                                    72/100     | |
| |  ################################............  +4 this wk     | |
| |                                                               | |
| |  Problem [78]  Solution [72]  Market [65]                     | |
| |  Traction [60]  Team [55]  Investor [45]                     | |
| |                                                               | |
| |  "Strong concept. Focus on traction evidence this week."      | |
| +--------------------------------------------------------------+ |
|                                                                   |
| +-----------------------------+  +------------------------------+ |
| |  TODAY'S FOCUS              |  |  MODULE PROGRESS             | |
| |  AI-generated priorities    |  |                              | |
| |                             |  |  # Profile      ####. 80% ->| |
| |  1. Complete Lean Canvas    |  |  # Validation   ###.. 60% ->| |
| |     15 min | Strategy       |  |  # Canvas       ##... 30% ->| |
| |     [Open ->]               |  |  # Tasks        #.... 20% ->| |
| |                             |  |  # Pitch Deck   ..... 0% -> | |
| |  2. Review pricing model    |  |                              | |
| |     10 min | Market         |  +------------------------------+ |
| |     [Open ->]               |                                   |
| |                             |  +------------------------------+ |
| |  3. Interview 1 customer    |  |  QUICK ACTIONS               | |
| |     30 min | Traction       |  |                              | |
| |     [Open ->]               |  |  [Run Validation]            | |
| |                             |  |  [Open Canvas]               | |
| +-----------------------------+  |  [Create Task]               | |
|                                  +------------------------------+ |
+------------------------------------------------------------------+
```

**Features:**
- **Personalized greeting** -- Time-of-day + startup name + current date
- **Health Score Card** -- 0-100 composite with:
  - 6 dimension badges (Problem, Solution, Market, Traction, Team, Investor)
  - Weekly trend indicator (+/- delta)
  - AI insight sentence (1 line)
- **Today's Focus Card** -- 3 AI-prioritized actions with:
  - Time estimate per action
  - Category tag (Strategy, Market, Traction, etc.)
  - CTA button linking to relevant screen
  - Regenerates daily or on data change
- **Module Progress Card** -- 5 modules with completion bars:
  - Profile, Validation, Canvas, Tasks, Pitch Deck
  - Color-coded: grey 0%, orange 1-30%, yellow 31-60%, blue 61-89%, green 90%+
  - Click any row to navigate to that module
- **Quick Actions Card** -- 3 primary CTAs
- **Skeleton loading** -- All cards show skeleton placeholders during data fetch
- **Staggered FadeIn** -- Cards animate in sequence (100ms delay each)

**What's Removed (vs current dashboard):**
- Quick-action bar (5 non-existent buttons)
- Welcome card (one-time, not permanent)
- Journey Stepper (redundant with Module Progress)
- Completion & Unlocks panel (redundant)
- Fundraising Readiness (demoralizing pre-seed, moved to Investor Strategy)
- Recent Activity feed (empty for new users)
- Insights/Perks/Events tabs (Phase 3)
- Summary Metrics (0 Decks, 0 Investors = demoralizing)
- Search bar (single-startup, unnecessary)
- Top Risks panel (folded into Today's Focus)
- Bottom nav duplication

**AI Agents:**

| Agent | Role | Model | Trigger |
|-------|------|-------|---------|
| Health Score Agent | 6-factor weighted score: Problem 20%, Solution 20%, Market 15%, Traction 20%, Team 10%, Investor 15%. Generates 1-line insight. | Local computation + Gemini Flash (insight) | On page load + data change |
| Daily Focus Agent | Identifies 2 lowest health dimensions, maps to actionable tasks, prioritizes by impact + recency, adds time estimates. | Gemini Flash | Daily + on page load (5-min cache) |

---

### 5.6 Sprint Board (`/tasks`) -- Phase 1

**Purpose:** Kanban execution engine. Tasks from validation report become trackable work.

**Layout:** 5-column Kanban board with filter bar and sprint context header.

**Columns:**

| # | Column | Purpose | Color |
|---|--------|---------|-------|
| 1 | Backlog | Ideas and future tasks | Grey |
| 2 | To Do | Committed for this sprint | Blue |
| 3 | In Progress | Active work | Indigo |
| 4 | Review | Needs verification | Amber |
| 5 | Done | Completed | Green |

**Task Card Anatomy:**
```
+----------------------------------+
| [Priority Badge]  Task Title     |
| [Tag] [Tag]         [Due: Feb 20]|
|                    [Avatar]       |
+----------------------------------+
```

**Features:**
- **Drag-and-drop** between columns (smooth animation, touch support)
- **Add task** -- Manual creation or "Generate Tasks from Report" (AI creates 5-8 tasks from validation findings)
- **Task detail slide panel** -- Description, subtasks (checkable), time estimates, activity log, AI context
- **AI Assist per task [AI *]** -- Opens slide panel with subtask breakdown, approach suggestions, relevant context
- **Sprint auto-creation** -- Weekly sprints, incomplete tasks roll forward
- **Filter/Sort** -- By tag, priority, assignee, due date
- **Sprint Stats footer** -- Total, in progress, done, high priority counts
- **Keyboard shortcuts** -- n: new task, 1-5: move to column, /: filter
- **Bidirectional sync with Roadmap** -- Status changes propagate both ways

**AI Agents:**

| Agent | Role | Model | Trigger |
|-------|------|-------|---------|
| Task Generator | Creates 5-8 discrete tasks from report recommendations. Assigns priority + tags + effort estimates. Deduplicates. | Gemini Flash | User clicks "Generate from Report" |
| Task AI Assist | Per-task subtask breakdown, approach suggestions, relevant context from profile/report. | Gemini Flash | User clicks [AI *] on any task |
| Sprint Planner | Suggests weekly composition based on health score gaps + available time + velocity. | Gemini Flash | User clicks "Plan My Week" |

---

### 5.7 Settings (`/settings`) -- Phase 1

**Purpose:** Account management. Minimal at MVP, grows in Phase 2.

**Layout:** Tabbed interface (Account | Notifications | Billing).

**Account Tab (MVP):**
- Avatar + Name + Email (verified indicator)
- Role dropdown, Timezone selector, LinkedIn URL
- Security: Password change, 2FA toggle (TOTP), active sessions
- Connected Accounts: Google OAuth, GitHub OAuth
- Danger Zone: Export My Data (GDPR JSON/CSV), Delete Account (30-day grace)

**Notifications Tab (Phase 2):**
- Email toggles: Weekly Digest, Validation Complete, Task Due, Competitor Alert
- In-app toggles: Agent Completions, Radar New Signals, Sprint Updates

**Billing Tab (Phase 2):**
- Current plan + usage meter
- Plan comparison (Free, Pro $29/mo, Team $79/mo)
- Stripe Elements for payment
- Invoice history

**AI Agents:** None.

---

### 5.8 Pitch Deck Wizard (`/pitch-deck`) -- Phase 1.5

**Purpose:** 4-step AI-powered pitch deck generator. Gated at validation score >= 50.

**Layout:** Linear wizard with progress bar. Gate screen if score < 50.

**Steps:**

| Step | Name | Content | Time Est. |
|------|------|---------|-----------|
| 1 | Startup Info | Pre-filled: name, tagline, industry, stage, problem, solution. Editable. Source attribution shown. | ~2 min |
| 2 | Market & Traction | Pre-filled from report: TAM/SAM/SOM, competitors, differentiator, traction evidence. | ~3 min |
| 3 | Smart Interview | 3-5 AI-generated gap questions (Why Now, The Ask, Milestones, etc.). Free-text answers. Signal Strength meter. | ~5 min |
| 4 | Generated Deck | 10-slide grid. Click slide to expand for preview + edit. [Regenerate with AI] per slide. Export PDF/PPTX. | ~5 min |

**10 Slides Generated:**
1. Cover (name, tagline, logo)
2. Problem (pain point, cost, scale)
3. Solution (product, key features, demo)
4. Market (TAM/SAM/SOM, growth)
5. Traction (metrics, milestones, testimonials)
6. Business Model (pricing, unit economics)
7. Competition (positioning matrix, differentiators)
8. Team (founders, key hires, advisors)
9. The Ask (funding amount, use of funds, milestones)
10. Contact (email, website, social)

**AI Agents:**

| Agent | Role | Model | Trigger |
|-------|------|-------|---------|
| Pitch Interview | Analyze narrative gaps, generate 3-5 targeted questions with examples | Gemini Flash | Step 3 load |
| Deck Generator | Create 10 slides from compiled data, apply pitch best practices, maintain narrative flow | Claude Sonnet | User clicks "Generate Deck" |
| Slide Content | Rewrite/regenerate individual slides on-demand | Gemini Flash | User clicks "Regenerate" on a slide |

---

### 5.9 Investor Strategy (`/investor-strategy`) -- Phase 1.5

**Purpose:** Fundraising planning. Replaces 3 current pages (CRM, Investors, Fundraising Readiness panel).

**Layout:** Single-scroll with card sections. Readiness score at top, checklist + archetypes below.

**Sections:**

**Readiness Score (0-100):**
- 7-factor weighted breakdown:
  - Pitch Deck ready (15%)
  - Financial model (10%)
  - Validation score (20%)
  - Profile completeness (10%)
  - Canvas completion (15%)
  - Traction evidence (20%)
  - Team section (10%)
- Weekly trend + AI insight sentence

**Target Configuration:**
- Stage selector: Pre-Seed / Seed / Series A / B+
- Target amount input + auto-generated human-readable label

**Fundraising Checklist (8 items):**

| # | Item | Priority | Auto-Complete Source |
|---|------|----------|---------------------|
| 1 | Pitch Deck | Critical | Pitch Deck Wizard |
| 2 | Validation Report | Critical | Validator Pipeline |
| 3 | Financial Model | High | Manual (template link) |
| 4 | Legal Entity | High | Manual |
| 5 | Team Bios | Medium | Company Profile |
| 6 | Data Room | Medium | Documents section |
| 7 | Advisory Board | Low | Manual |
| 8 | Traction Proof | Critical | Validation Report |

**4 Investor Archetype Cards:**

| Archetype | Check Size | Timeline | Fit Score (AI) |
|-----------|-----------|----------|---------------|
| Angel | $25K-$250K | 2-6 weeks | 0-100 |
| Micro VC | $100K-$1M | 4-8 weeks | 0-100 |
| Traditional VC | $1M-$10M | 8-16 weeks | 0-100 |
| Corporate VC | $500K-$5M | 12-24 weeks | 0-100 |

Each card shows: check size range, typical timeline, 3 pros, 3 cons. Expandable.

**AI Recommendation:** Below archetypes -- best-fit archetype + fit score + rationale.

**Timeline Estimate:**
- Phase 1: Preparation (4-6 weeks)
- Phase 2: Outreach (6-8 weeks)
- Phase 3: Due Diligence (4-8 weeks)
- Projected close date

**AI Agents:**

| Agent | Role | Model | Trigger |
|-------|------|-------|---------|
| Fundraising Advisor | Calculate readiness, generate insight, prioritize checklist | Local + Gemini Flash | Page load |
| Investor Matching | Score each archetype (0-100), rank by fit, generate rationale | Gemini Flash | Page load + stage change |

---

### 5.10 Roadmap / Gantt (`/roadmap`) -- Phase 1.5

**Purpose:** Visual 12-week timeline. Connected to Sprint Board.

**Layout:** Left sidebar (phase cards) + main Gantt chart area.

**3 View Modes:**

| Mode | Description |
|------|-------------|
| Timeline (Gantt) | Weeks 1-12 horizontal, task bars with % completion, dependency arrows, "Today" marker |
| Phase View | Tasks grouped by phase, card layout |
| Agent View | Tasks grouped by owner/team member |

**Gantt Features:**
- Colored bars: green (complete), blue (in progress), grey (not started), red (blocked)
- % completion overlay on each bar
- Dependency arrows (finish-to-start)
- "Today" red dashed vertical marker (auto-scrolls on load)
- Drag bar edges to resize duration (snaps to weekly grid)
- Click bar to open task detail modal
- Filter by status / priority / owner
- Phase cards in left sidebar (name, week range, completion %, progress bar)

**Key Behavior:**
- AI-generated initial roadmap from Validation Report MVP Path section
- Bidirectional sync with Sprint Board (status changes propagate both ways)
- Inline task add per phase
- Export to PNG/PDF
- Share link for stakeholders (read-only)

**AI Agents:**

| Agent | Role | Model | Trigger |
|-------|------|-------|---------|
| Roadmap Planner | Generate 12-week plan from report MVP Path. Extract features, group into phases, estimate durations, set milestones. | Claude Sonnet | First visit (no roadmap exists) |
| Dependency Analyzer | Analyze task descriptions for implicit dependencies. Flag circular deps. Suggest reordering. | Gemini Flash | After task add/edit |
| Timeline Optimizer | On-demand optimization. Identify parallelizable tasks. Suggest resequencing. Flag overloaded weeks. | Claude Sonnet | User clicks "Optimize" |

---

### 5.11 AI Readiness Canvas (`/ai-readiness`) -- Phase 2

**Purpose:** 9-box framework for AI implementation readiness. Unique differentiator -- no competitor has this.

**Layout:** Same grid pattern as Lean Canvas but with AI-specific dimensions.

**9-Box Grid:**

| Row | Col 1 | Col 2 | Col 3 |
|-----|-------|-------|-------|
| Strategy | Vision & Outcomes | AI Value Proposition | Use Cases & Priority |
| Infrastructure | Data Strategy | Tech Stack | People & Skills |
| Operations | Governance & Ethics | Cost Structure | Success Metrics & ROI |

**Features:**
- 2 assessment modes: 9-Box (full) and 4-Category (simplified: Strategy, Legal, Business, Systems & Data)
- Import buttons: [Import from Lean Canvas], [Import from Profile]
- AI suggestion button per box [AI]
- Readiness score (0-100) with 4 sub-dimension scores
- Auto-generated strengths list (3-5 items)
- Auto-generated gaps to address (prioritized)
- Deloitte 4 Questions (contextual reflection prompts)
- Export to PDF (grid + scores + gaps + recommendations)

**AI Agents:**

| Agent | Role | Model | Trigger |
|-------|------|-------|---------|
| AI Readiness Assessor | Score each box (0-100), calculate 4 sub-dimensions, generate weighted overall score | Claude Sonnet | After any edit (2s debounce) |
| AI Strategy Coach | Per-box analysis vs best practices. 2-4 suggestions per box. Industry-specific. | Claude Sonnet | User clicks [AI] |
| Gap Analyzer | Identify boxes <60, cross-reference consistency, prioritize by impact, generate action items | Gemini Flash | After scoring |

---

### 5.12 Industry Radar (`/radar`) -- Phase 2

**Purpose:** Industry monitoring. News, events, social mentions, competitor tracking.

**Layout:** 5 tabbed views with radar visualization on Overview.

**Tabs:**

| Tab | Content | Update Frequency |
|-----|---------|-----------------|
| Overview | Radar viz (pulsing nodes), 4 preview cards (3 items each) | Real-time |
| News | Article feed with AI summaries, relevance scores, filters | Daily crawl |
| Events | Industry event calendar with "Add to Calendar" | Weekly crawl |
| Social | Twitter, Reddit, LinkedIn mentions with sentiment | Daily crawl |
| Competitors | Tracked profiles, activity timeline, threat level | Weekly crawl |

**Features:**
- Radar circular visualization (node size = signal volume, pulse = new <24h)
- AI 2-3 sentence summaries per article
- Relevance scoring: High / Medium / Low
- Sentiment indicators: Positive / Neutral / Negative
- Alert system: real-time, daily digest, weekly digest (in-app + email + Slack webhook)
- Auto-seeded from Company Profile (industry, competitors, keywords)
- "Manage Topics" customization
- Competitor profiles: company info, activity timeline, threat level (AI-assessed), differentiator notes
- Weekly narrative digest email (Monday morning)

**AI Agents:**

| Agent | Role | Model | Trigger |
|-------|------|-------|---------|
| Industry Monitor | Crawl configured sources + social APIs. Filter relevance. Deduplicate. Categorize. | Gemini Flash | Scheduled (daily) |
| Competitor Intelligence | Monitor competitor sites, Crunchbase, app stores. Assess threat level. | Gemini Flash + Claude Sonnet | Scheduled (weekly) |
| Signal Summarizer | 2-3 sentence summaries + relevance scores. Weekly narrative synthesis. | Gemini Flash + Claude Sonnet | After crawl |

---

## 6. AI Agents -- Complete Registry

### 6.1 Agent Inventory

| # | Agent | Screen(s) | Model | Trigger | Phase |
|---|-------|-----------|-------|---------|-------|
| 1 | Context Extractor | Validator Chat | Gemini Flash | Real-time (500ms) | MVP |
| 2 | Validation Coach | Validator Chat | Claude Sonnet | Per-message | MVP |
| 3 | Pipeline Orchestrator | Validator Chat | Edge function | User trigger | MVP |
| 4 | Problem Analyst | Report | Gemini Pro | Pipeline | MVP |
| 5 | Market Intelligence | Report | Gemini Pro | Pipeline | MVP |
| 6 | Customer Insight | Report | Gemini Pro | Pipeline | MVP |
| 7 | Business Model Analyst | Report | Gemini Pro | Pipeline | MVP |
| 8 | MVP Architect | Report | Gemini Pro | Pipeline | MVP |
| 9 | Team Assessor | Report | Gemini Flash | Pipeline | MVP |
| 10 | Investor Lens | Report | Gemini Pro | Pipeline | MVP |
| 11 | Report Composer | Report | Gemini Flash | Pipeline | MVP |
| 12 | Canvas Coach | Lean Canvas | Gemini Flash | User click | MVP |
| 13 | Consistency Checker | Lean Canvas | Gemini Flash | Auto (2s debounce) | MVP |
| 14 | Health Score Agent | Dashboard | Local + Gemini Flash | Page load | MVP |
| 15 | Daily Focus Agent | Dashboard | Gemini Flash | Daily + page load | MVP |
| 16 | Task Generator | Sprint Board | Gemini Flash | User click | MVP |
| 17 | Task AI Assist | Sprint Board | Gemini Flash | User click | MVP |
| 18 | Sprint Planner | Sprint Board | Gemini Flash | User click | MVP |
| 19 | Pitch Interview | Pitch Deck | Gemini Flash | Step 3 load | 1.5 |
| 20 | Deck Generator | Pitch Deck | Claude Sonnet | User trigger | 1.5 |
| 21 | Slide Content | Pitch Deck | Gemini Flash | User click | 1.5 |
| 22 | Fundraising Advisor | Investor Strategy | Local + Gemini Flash | Page load | 1.5 |
| 23 | Investor Matching | Investor Strategy | Gemini Flash | Page load | 1.5 |
| 24 | Roadmap Planner | Roadmap | Claude Sonnet | First visit | 1.5 |
| 25 | Dependency Analyzer | Roadmap | Gemini Flash | After edit | 1.5 |
| 26 | Timeline Optimizer | Roadmap | Claude Sonnet | User click | 1.5 |
| 27 | AI Readiness Assessor | AI Readiness | Claude Sonnet | Auto (2s debounce) | 2 |
| 28 | AI Strategy Coach | AI Readiness | Claude Sonnet | User click | 2 |
| 29 | Gap Analyzer | AI Readiness | Gemini Flash | After scoring | 2 |
| 30 | Industry Monitor | Radar | Gemini Flash | Scheduled (daily) | 2 |
| 31 | Competitor Intelligence | Radar | Gemini Flash + Claude Sonnet | Scheduled (weekly) | 2 |
| 32 | Signal Summarizer | Radar | Gemini Flash + Claude Sonnet | After crawl | 2 |

### 6.2 Model Selection Logic

| Use Case | Model | Rationale |
|----------|-------|-----------|
| Real-time extraction, summaries | `gemini-3-flash-preview` | Fast (<2s), cheap, good for structured output |
| Per-box suggestions, task breakdown | `gemini-3-flash-preview` | Interactive speed required |
| Deep analysis (pipeline agents) | `gemini-3-pro-preview` | Quality matters for report sections |
| Content generation (slides, roadmap) | `claude-sonnet-4-5` | Best narrative quality |
| Complex reasoning (optimizer) | `claude-sonnet-4-5` | Needs multi-step planning |

### 6.3 Universal Agent Contract

Every agent must implement:

```typescript
interface AgentInput {
  user_id: string;
  profile: CompanyProfile;
  context: Record<string, unknown>;  // screen-specific data
}

interface AgentOutput {
  result: Record<string, unknown>;   // structured output
  confidence: number;                // 0-100
  reasoning: string;                 // "why" explanation
  suggestions?: string[];            // optional follow-up actions
}
```

Every agent call is logged:

```typescript
interface AIActionLog {
  id: string;
  user_id: string;
  agent_name: string;
  screen: string;
  input_summary: string;
  output_summary: string;
  model: string;
  duration_ms: number;
  confidence: number;
  created_at: string;
}
```

---

## 7. Data Model

### 7.1 Core Tables

```sql
-- Company profile (data foundation for all AI)
company_profiles (
  id, user_id, name, industry, stage,
  problem, solution, icp, ninety_day_goal,
  completeness, created_at, updated_at
)

-- Validation
validator_sessions (id, user_id, profile_id, mode, status, coverage, created_at)
validator_messages (id, session_id, role, content, extractions, created_at)
validation_reports (id, session_id, user_id, viability_score, strengths, risks, created_at)
validation_report_sections (id, report_id, section_type, score, content, created_at)

-- Lean Canvas
lean_canvases (id, user_id, profile_id, version, boxes, consistency_warnings, created_at, updated_at)
lean_canvas_versions (id, canvas_id, version, boxes, created_at)

-- Tasks / Sprint Board
sprints (id, user_id, name, start_date, end_date, status)
tasks (id, user_id, sprint_id, title, description, status, priority, tags, due_date, effort_estimate, column_order)
task_subtasks (id, task_id, title, completed, created_at)

-- Dashboard
startup_health_scores (id, user_id, overall, problem, solution, market, traction, team, investor, insight, calculated_at)

-- Pitch Deck (Phase 1.5)
pitch_decks (id, user_id, version, signal_strength, slides, status, created_at)
pitch_deck_interviews (id, deck_id, questions, answers, created_at)

-- Investor Strategy (Phase 1.5)
fundraising_readiness (id, user_id, score, factors, target_stage, target_amount, archetype_scores, timeline, created_at, updated_at)
fundraising_checklist (id, user_id, item_key, status, auto_completed, completed_at)

-- AI Readiness (Phase 2)
ai_readiness_canvas (id, user_id, boxes, readiness_score, sub_scores, strengths, gaps, created_at, updated_at)

-- Industry Radar (Phase 2)
radar_topics (id, user_id, keyword, type, active, created_at)
radar_signals (id, user_id, type, title, summary, url, relevance, sentiment, source, created_at)
radar_competitors (id, user_id, name, url, threat_level, differentiator, activity_timeline, updated_at)

-- AI Audit (all screens)
ai_action_logs (id, user_id, agent_name, screen, input_summary, output_summary, model, duration_ms, confidence, created_at)
```

### 7.2 Cross-Screen Data Flow

```
company_profiles ─────┬──> Validator Chat (pre-fill greeting + coverage)
                      ├──> Lean Canvas (auto-import 3 boxes)
                      ├──> AI Readiness (auto-import)
                      ├──> Dashboard (name in greeting, stage for coaching)
                      ├──> Pitch Deck (pre-fill Steps 1-2)
                      └──> Industry Radar (auto-seed topics)

validation_reports ───┬──> Dashboard (health score source)
                      ├──> Lean Canvas (enhance pre-fill)
                      ├──> Sprint Board ("Generate Tasks from Report")
                      ├──> Pitch Deck (pre-fill + validation gate)
                      ├──> Investor Strategy (readiness factors)
                      └──> Roadmap (MVP Path -> Gantt)

lean_canvases ────────┬──> AI Readiness (import boxes)
                      └──> Pitch Deck (business model context)

tasks ←──────────────> Roadmap (bidirectional sync)

pitch_decks ──────────> Investor Strategy (checklist auto-update)
```

### 7.3 Real-Time Subscriptions (Supabase Realtime)

| Table | Event | Consumer |
|-------|-------|----------|
| validator_sessions | UPDATE (status) | Validator progress screen |
| tasks | UPDATE (status, column) | Sprint Board + Roadmap |
| startup_health_scores | INSERT/UPDATE | Dashboard |
| company_profiles | UPDATE | Dashboard greeting + all dependent screens |

---

## 8. Workflows & Logic

### W1: First-Time Founder Journey (MVP)

```
Login/Signup
  |
  v
Onboarding (if new user)
  |
  v
Company Profile (fill 7 fields, ~3 min)
  |
  v
[Run Validation] (enabled at 50% completeness)
  |
  v
Validator Chat (conversational, ~5-10 min)
  |-- Coverage tracker fills as user provides info
  |-- AI asks prioritized follow-up questions
  |-- At 80%+ coverage: "Run Validation" enables
  |
  v
Validation Pipeline (7 agents, 30-60s)
  |-- Live progress screen showing agent-by-agent status
  |
  v
Validation Report Overview (viability score reveal)
  |-- Browse 8 sub-screens at own pace
  |-- Each section: score + narrative + actionable gaps
  |
  v
"Build Your Business Model" CTA
  |
  v
Lean Canvas (pre-filled from profile + report, ~15 min)
  |-- AI suggestions per box
  |-- Consistency checker catches contradictions
  |
  v
"Plan Your Execution" CTA
  |
  v
Sprint Board (AI generates 5-8 tasks from report, ~5 min)
  |-- Drag tasks to columns
  |-- AI assist for subtask breakdown
  |
  v
Dashboard (health score + today's focus + module progress)
  |-- Daily return point from here forward
```

### W2: Daily Founder Return Loop

```
Open App -> Dashboard loads
  |
  v
Scan Health Score (72/100, +4 this week)
  |
  v
Read Today's Focus (3 AI-prioritized actions)
  |-- Action 1: "Complete Lean Canvas" (15 min | Strategy)
  |-- Action 2: "Review pricing model" (10 min | Market)
  |-- Action 3: "Interview 1 customer" (30 min | Traction)
  |
  v
Click priority #1 -> Navigate to relevant screen
  |
  v
Complete action -> Return to Dashboard
  |
  v
Health score auto-recalculates
Next priority surfaces
Module progress bar updates
```

### W3: Validation -> Execution Pipeline

```
Validation Report (section findings + recommendations)
  |
  v
Sprint Board -> Click "Generate Tasks from Report"
  |
  v
Task Generator AI creates 5-8 tasks:
  - Each task: title, description, priority, tags, effort estimate
  - Deduplicates against existing tasks
  - Maps report section -> task category
  |
  v
User reviews generated tasks -> drags to "To Do"
  |
  v
User assigns, sets due dates, adds subtasks
  |
  v
Roadmap auto-populates with tasks (Phase 1.5)
  |-- Phase grouping from report MVP Path
  |-- Timeline from effort estimates
  |-- Dependencies from Dependency Analyzer
```

### W4: Lean Canvas AI Coaching Loop

```
User clicks [AI !!] on any box
  |
  v
Right drawer slides open
  |
  v
Canvas Coach Agent runs:
  Input: current box content + profile + industry + stage + report
  Output: 3-5 suggestions + rationale + confidence score
  |
  v
User reads suggestions
  |
  +-- [Apply Suggestions] -> Box content replaced, drawer closes
  |     |
  |     v
  |   Consistency Checker runs (2s debounce)
  |     |
  |     v
  |   If inconsistency found -> subtle warning below affected box
  |
  +-- [Regenerate] -> New suggestions generated (different angle)
  |
  +-- [X Close] -> Drawer closes, no changes
```

### W5: Fundraising Pipeline (Phase 1.5)

```
Investor Strategy (readiness score, checklist)
  |
  v
Checklist item: "Build Pitch Deck" -> [Go]
  |
  v
Pitch Deck Wizard
  |-- Gate check: validation score >= 50?
  |     NO -> Gate screen with improvement suggestions
  |     YES -> Proceed to Step 1
  |
  v
4-step wizard -> Generated 10-slide deck
  |
  v
Return to Investor Strategy
  |-- Checklist auto-updates ("Pitch Deck: Complete")
  |-- Readiness score recalculates
  |
  v
Archetype recommendation updates
  |
  v
Timeline estimate adjusts based on new readiness
```

### W6: Strategy Refinement Loop

```
Lean Canvas (edit boxes, AI suggestions)
  |
  v
Consistency Checker flags misalignment:
  "Revenue model doesn't match customer segment pricing expectations"
  |
  v
User fixes or applies AI suggestion
  |
  v
Optionally: "Re-validate" -> Validator Chat with updated data
  |
  v
New validation report -> compare scores
  |
  v
Dashboard health score updates -> new focus items surface
```

### W7: Industry Monitoring (Phase 2)

```
Company Profile (industry, competitors) -> auto-seeds Radar
  |
  v
Industry Radar Overview
  |-- Radar viz shows signal categories
  |-- Preview cards: News, Events, Social, Competitors
  |
  v
User browses tabs:
  |-- News: AI summaries (saves time vs reading full articles)
  |-- Competitors: threat level + differentiator analysis
  |-- Events: calendar integration
  |
  v
Set alerts (real-time / daily / weekly)
  |
  v
Weekly digest email arrives Monday morning
  (AI narrative synthesis of week's signals)
```

---

## 9. User Journeys

### Journey 1: Alex -- First-Time Founder (MVP)

**Persona:** Alex, non-technical founder with a SaaS idea for PMs.
**Goal:** Validate idea, build business model, create execution plan.
**Entry:** Signed up via Google OAuth.

```
Day 1 (30 min):
  1. Completes Company Profile (7 fields, 3 min)
  2. Enters Validator Chat, answers 8-10 AI questions (10 min)
  3. Triggers Deep validation (60s pipeline)
  4. Reviews Report Overview: 72/100 viability score
  5. Reads Problem & Solution section (strong: 78/100)
  6. Reads Market section (opportunity: $2.4B TAM)
  7. Bookmarks report, closes app

Day 2 (20 min):
  1. Opens app -> Dashboard shows health score 72, +0 trend
  2. Today's Focus: "Complete Lean Canvas (15 min)"
  3. Opens Lean Canvas -> 3 boxes pre-filled from profile
  4. Uses AI suggestions on Key Metrics, UVP, Channels
  5. Fills remaining boxes manually
  6. Consistency Checker flags: "No marketing budget in Cost Structure"
  7. Fixes it. Canvas complete.

Day 3 (15 min):
  1. Dashboard: health score 74, +2. Focus: "Create execution tasks"
  2. Opens Sprint Board -> "Generate Tasks from Report"
  3. AI creates 6 tasks from report recommendations
  4. Drags 3 to "To Do" for this week
  5. Clicks [AI *] on first task -> gets subtask breakdown
  6. Starts working

Week 2+:
  1. Daily: Dashboard -> Focus items -> Execute -> Return
  2. Weekly: Review Sprint Board, roll incomplete tasks
  3. Monthly: Re-validate with updated data, compare scores
```

**Outcome:** In 3 days, Alex went from idea to validated concept with a business model and execution plan.

### Journey 2: Sam -- Fundraising Preparation (Phase 1.5)

**Persona:** Sam, technical founder, validation score 68, needs to pitch investors.
**Goal:** Build pitch deck, understand investor landscape, prepare for meetings.

```
Week 1:
  1. Opens Investor Strategy -> Readiness score: 42/100
  2. Checklist shows: Pitch Deck (missing), Financial Model (missing)
  3. Clicks "Build Pitch Deck" -> Pitch Deck Wizard
  4. Steps 1-2 pre-filled from profile + report
  5. Step 3: Answers "Why Now?", "The Ask", "Key Milestones"
  6. Step 4: 10-slide deck generated. Edits 3 slides.
  7. Exports PDF for advisor review.

Week 2:
  1. Returns to Investor Strategy -> Readiness: 58/100 (+16)
  2. Checklist: Pitch Deck (complete), Financial Model (still missing)
  3. AI recommends: "Angel investors or Micro VCs are best fit"
  4. Archetype card: Angel (fit: 82/100), Micro VC (fit: 74/100)
  5. Timeline: 14-22 weeks to close
  6. Next action: "Complete financial model (template provided)"

Week 3:
  1. Builds financial model from template
  2. Returns to Investor Strategy -> Readiness: 71/100 (+13)
  3. Downloads updated pitch deck + financial model
  4. Starts outreach based on archetype recommendations
```

### Journey 3: Jordan -- AI Startup Assessment (Phase 2)

**Persona:** Jordan, CTO of an AI startup, needs to assess organizational AI readiness.
**Goal:** Evaluate AI implementation gaps, present to board.

```
  1. Opens AI Readiness Canvas
  2. Clicks [Import from Profile] -> Tech Stack, People pre-fill
  3. Clicks [Import from Lean Canvas] -> Vision, Use Cases, Costs pre-fill
  4. Manually fills: Data Strategy, Governance, Success Metrics
  5. Readiness Score: 64/100
  6. Strengths: Strong tech stack, clear use cases
  7. Gaps: Data governance (42/100), ROI metrics (38/100)
  8. Clicks [AI] on Governance box -> gets industry-specific recommendations
  9. Updates governance framework based on suggestions
  10. Score improves to 71/100
  11. Exports PDF for board meeting
```

---

## 10. Design System

### 10.1 Section Color System

| Section | Color Name | Hex | Usage |
|---------|-----------|-----|-------|
| Problem & Solution | Emerald | #0E6E47 | Report tab, canvas box borders, badges |
| Market & Competition | Teal | #0D9488 | Report tab, radar viz |
| Customer & ICP | Blue | #3B82F6 | Report tab, persona cards |
| Business Model | Amber | #D97706 | Report tab, revenue cards |
| MVP Path | Orange | #EA580C | Report tab, roadmap phases |
| Team & Execution | Purple | #7C3AED | Report tab, team cards |
| Investor Readiness | Coral | #E11D48 | Report tab, fundraising |

### 10.2 Score Color Bands

| Range | Color | Tailwind | Meaning |
|-------|-------|----------|---------|
| 80-100 | Sage Green | `text-green-600 bg-green-50` | Strong |
| 60-79 | Blue | `text-blue-600 bg-blue-50` | Good |
| 40-59 | Amber | `text-amber-600 bg-amber-50` | Needs Work |
| 0-39 | Red | `text-red-600 bg-red-50` | Critical |

### 10.3 Module Progress Colors

| Range | Color | Meaning |
|-------|-------|---------|
| 0% | Grey | Not started |
| 1-30% | Orange | Just beginning |
| 31-60% | Yellow | In progress |
| 61-89% | Blue | Almost there |
| 90-100% | Green | Complete |

### 10.4 Visual Style

| Element | Specification |
|---------|--------------|
| Background | Cream/ivory (`bg-stone-50` or `bg-amber-50/30`) |
| Cards | White, rounded-xl, shadow-sm, border border-stone-200 |
| Spacing | Generous whitespace (p-6 cards, gap-6 grids) |
| Typography | Inter font, clear hierarchy (text-2xl headings, text-sm labels) |
| Icons | Lucide icon set, consistent 18px stroke |
| Animations | Staggered FadeIn (100ms delay), smooth transitions (200ms) |
| AI Markers | Sparkles icon + "AI" badge on generated content |
| Dark Insight Cards | `bg-slate-800 text-white` for AI takeaway panels |

### 10.5 Shared Components

| Component | Usage |
|-----------|-------|
| `PageHeader` | Title + subtitle + breadcrumb on every screen |
| `ScoreBadge` | Circular score with color band (used in report, dashboard, readiness) |
| `AIBadge` | Sparkles icon badge marking AI-generated content |
| `TimeEstimate` | Clock icon + "X min" label |
| `EmptyState` | Illustration + message + CTA button |
| `FadeIn` | Staggered animation wrapper (delay prop) |
| `SkeletonCard` | Loading placeholder matching card dimensions |
| `AISuggestionsDrawer` | Right-slide panel for AI suggestions (reusable across Canvas, Tasks, etc.) |

---

## 11. Information Architecture

### 11.1 Sidebar Navigation (10 items)

```
STARTUPAI
  Dashboard                /dashboard
  Validate                 /validate

STRATEGY
  Lean Canvas              /lean-canvas
  AI Readiness             /ai-readiness        (Phase 2, hidden until ship)

EXECUTION
  Sprint Board             /tasks
  Roadmap                  /roadmap             (Phase 1.5, hidden until ship)

FUNDRAISING
  Pitch Deck               /pitch-deck          (Phase 1.5, hidden until ship)
  Investor Strategy        /investor-strategy   (Phase 1.5, hidden until ship)

------
  Settings                 /settings
  Company Profile          /company-profile
```

**At MVP launch:** 7 visible items (Dashboard, Validate, Lean Canvas, Sprint Board, Settings, Company Profile + Validation Report accessible via Validate flow).

### 11.2 Routes Removed (vs current 31)

| Removed Route | Reason | Replacement |
|---------------|--------|-------------|
| `/projects`, `/projects/:id` | Generic, not startup-specific | Tasks + Roadmap |
| `/crm` | Phase 3+ | Investor Strategy (Phase 1.5) |
| `/investors` | Phase 3+ | Investor Strategy (Phase 1.5) |
| `/documents` | Phase 3+ | Defer |
| `/analytics` | Phase 3+ | Dashboard health score |
| `/diagrams` | Phase 3+ | Defer |
| `/ai-chat` | Overlaps with Validator Chat | Validator Chat |
| `/market-research` | Stub | Industry Radar (Phase 2) |
| `/opportunity-canvas` | Overlaps Lean Canvas | Lean Canvas |
| `/experiments` | Premature | Sprint Board (experiment tasks) |
| `/assumption-board` | Premature | Defer |
| `/decision-log` | Premature | Defer |
| `/weekly-review` | Premature habit feature | Dashboard (daily loop) |
| `/sprint-plan` | Replaced | Roadmap (Phase 1.5) |
| `/app/events/*` | Phase 3+ | Industry Radar events tab (Phase 2) |
| `/user-profile` | Merged | Settings (Account tab) |

---

## 12. Phased Rollout

### Phase 1: MVP (Ship First)

**Screens:** 7 (Company Profile, Validator Chat, Validation Report x8, Lean Canvas, Dashboard, Sprint Board, Settings)

**Implementation Order:**

| Step | Task | Depends On |
|------|------|-----------|
| 1 | New 10-item sidebar component | -- |
| 2 | Update DashboardLayout (new sidebar, warm background, remove bottom nav dupe) | Step 1 |
| 3 | Add section color CSS variables to index.css | -- |
| 4 | Create shared components (FadeIn, PageHeader, ScoreBadge, AIBadge, TimeEstimate, EmptyState) | -- |
| 5 | Rebuild Dashboard (4-card grid) | Steps 1-4 |
| 6 | Simplify Company Profile (7 fields, progress bar) | Steps 1-4 |
| 7 | Split Validation Report into 8 sub-screens with tab nav | Steps 1-4 |
| 8 | Upgrade Sprint Board (list -> 5-column Kanban) | Steps 1-4 |
| 9 | Polish Lean Canvas (consistency checker, AI drawer) | Steps 1-4 |
| 10 | Merge User Profile into Settings | Steps 1-4 |
| 11 | Remove dead routes + unused components | Steps 5-10 |
| 12 | Redirect old routes | Step 11 |

### Phase 1.5: Growth

**Screens:** 3 (Pitch Deck Wizard, Investor Strategy, Roadmap/Gantt)

**Prerequisites:**
- Validation pipeline stable (for pitch deck gate)
- Sprint Board complete (for roadmap sync)
- Core edge functions deployed (canvas-suggest, canvas-consistency)

**Implementation Order:**

| Step | Task |
|------|------|
| 1 | Consolidate Pitch Deck routes (wizard flow) |
| 2 | Build Investor Strategy (readiness score + checklist + archetypes) |
| 3 | Build Roadmap Gantt (timeline + phase + agent views) |
| 4 | Wire bidirectional sync: Sprint Board <-> Roadmap |
| 5 | Wire checklist auto-complete: Pitch Deck -> Investor Strategy |
| 6 | Unhide sidebar items |

### Phase 2: Differentiation

**Screens:** 2 (AI Readiness Canvas, Industry Radar)

**Prerequisites:**
- Lean Canvas complete (for AI Readiness import)
- Company Profile complete (for Radar auto-seed)
- Edge function infrastructure for scheduled crawls

**Implementation Order:**

| Step | Task |
|------|------|
| 1 | Build AI Readiness Canvas (9-box grid, same pattern as Lean Canvas) |
| 2 | Wire import from Profile + Canvas |
| 3 | Build Radar Overview + 5 tabs |
| 4 | Deploy scheduled crawl edge functions |
| 5 | Build alert system + weekly digest |
| 6 | Unhide sidebar items |

---

## 13. Success Metrics

### 13.1 Product Metrics

| Metric | Current Baseline | MVP Target | Growth Target |
|--------|-----------------|------------|--------------|
| Time to first validation | >10 min | <5 min | <3 min |
| Profile completion rate | ~40% | >80% | >90% |
| Report sections viewed (avg) | 3 of 14 | 5 of 8 | 7 of 8 |
| Canvas completion (9 boxes) | ~30% | >60% | >80% |
| Daily active return rate | Unknown | >30% | >50% |
| Tasks created per user | ~2 | >5 | >10 |
| AI suggestion acceptance rate | N/A | >40% | >60% |

### 13.2 UX Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Sidebar items visible | 23 | 7 (MVP), 10 (Growth) |
| Clicks to reach any feature | ~5 | <=2 |
| Dashboard panels above fold | 15+ | 4 |
| Pages with time estimates | 0 | 12/12 |
| Pages with AI assistance | ~3 | 12/12 |
| Empty state encounters (new user) | Many (demoralizing) | 0 (guided CTAs instead) |

### 13.3 Technical Metrics

| Metric | Target |
|--------|--------|
| Page load time (LCP) | <2s |
| AI response time (suggestions) | <3s |
| Validation pipeline (7 agents) | <90s |
| Auto-save latency | <1s |
| Real-time sync delay | <500ms |

---

## 14. Appendix: Competitive Analysis

### 14.1 VenturusAI

**Strengths adopted:**
- Multiple focused report screens (not mega-scroll)
- Score-per-section with color coding
- "Structure View" vs "Document View" toggle

**Weaknesses avoided:**
- No execution tools (validation only, no tasks/roadmap)
- No business model editor

### 14.2 Venture Planner

**Strengths adopted:**
- Color-coded section hierarchy (7 colors)
- Card-based navigation for plan sections
- Warm, calm aesthetic (cream, rounded, soft shadows)
- Progressive disclosure (expand/collapse)

**Weaknesses avoided:**
- No AI validation pipeline
- Plan-only (no execution tracking)

### 14.3 VenturKit

**Strengths adopted:**
- Radar for market intelligence (5-tab structure)
- AI Consultant chat pattern
- Sidebar navigation structure (compact, icon + text)

**Weaknesses avoided:**
- Feature bloat (20+ dashboard widgets)
- Dark theme not suitable for calm/trust aesthetic

### 14.4 Venturis (FashionOS)

**Strengths adopted:**
- Strategic frameworks (SWOT, Porter's) -> inspired AI Readiness Canvas
- Validity scoring with sub-dimensions
- Right-panel contextual guidance ("Hint with data", "Pro tips")
- "Advanced Feature" gating pattern for premium tiers

**Weaknesses avoided:**
- Limited AI depth (manual frameworks, not AI-generated)
- No execution pipeline

---

> **End of PRD.** This document is the single source of truth for the StartupAI dashboard system redesign. All wireframes, specs, and implementation work should reference this PRD.
