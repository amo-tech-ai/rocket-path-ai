# StartupAI — Product Requirements Document (PRD)

**Version:** 6.0 | **Date:** February 8, 2026
**Role:** Senior Product Strategist
**Audience:** Founders, product builders, non-technical operators, engineering team
**Goal:** Clear, beginner-friendly, production-oriented PRD with real-world grounding

**Current Status:**
- **Overall Health:** 93% core systems working
- **Validator Pipeline:** ✅ 95% — 7 agents E2E, 14-section report, 3 successful runs (72/68/62 scores)
- **Onboarding Wizard:** ✅ 100% — Browser Audit Passed
- **Lean Canvas:** ✅ 100% — Editor, AI coach, versioning, autosave
- **CRM:** ✅ 95% — Contacts, deals, pipeline, CSV import, AI panel
- **Pitch Deck:** ✅ 95% — Wizard, editor, generation, image gen, export
- **Events:** ✅ 85% — Backend 100%, frontend 85%
- **Dashboard:** 🟡 85% — Health score, metrics, stage guidance (Command Centre redesign planned)
- **Documents:** ✅ 90% — CRUD, AI extraction, file upload
- **Tasks:** ✅ 90% — Kanban, AI suggestions, breakdown, prioritization
- **Vector DB/RAG:** 🟡 70% — 347 chunks, HNSW index, search works, validator wired
- **Security:** ✅ 90% — Organizations RLS applied, dev bypass dropped, CORS restricted, rate limiting active

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Target Users](#3-target-users)
4. [Directory Structure / Routes](#4-directory-structure--routes)
5. [Core Features (MVP)](#5-core-features-mvp)
6. [Advanced Features](#6-advanced-features)
7. [Lean System (17-Screen Architecture)](#7-lean-system-17-screen-architecture)
8. [Real-World Use Cases](#8-real-world-use-cases)
9. [User Stories](#9-user-stories)
10. [User Journeys](#10-user-journeys)
11. [Workflows](#11-workflows)
12. [3-Panel Layout Logic](#12-3-panel-layout-logic)
13. [Screen Specifications](#13-screen-specifications)
14. [Wizards](#14-wizards)
15. [Chatbot System](#15-chatbot-system)
16. [Data Model](#16-data-model)
17. [AI Architecture](#17-ai-architecture)
18. [AI Models & Agents](#18-ai-models--agents)
19. [Supabase Realtime Strategy](#19-supabase-realtime-strategy)
20. [Implementation Phases](#20-implementation-phases)
21. [Success Criteria](#21-success-criteria)
22. [Risks & Constraints](#22-risks--constraints)
23. [Verification Checklist](#23-verification-checklist)

---

## 1. Executive Summary

**StartupAI** is an AI-powered operating system for founders that transforms raw ideas into validated strategy, execution plans, and daily priorities using guided wizards, AI agents, and industry-specific knowledge.

### Core Value

```
Idea → Validation → Strategy → Execution → Fundraising (in ~30 minutes)
```

### What It Replaces

| Before StartupAI | After StartupAI |
|------------------|-----------------|
| Scattered docs, sheets, notes | One structured profile |
| Guessing if idea is viable | 7-agent AI validation with 14-section report |
| Multiple CRM tools | Unified contact + deal tracking |
| Manual task lists | AI-generated priorities |
| Generic AI chatbots | Context-aware AI Coach with industry expertise |
| Static business plans | Living lean canvas with AI validation |
| Manual pitch decks | AI-generated investor decks |

### System Architecture

**29 Task Specs** across 4 phases, **17 Screens** with 3-panel layout:

| Module | Status | Phase |
|--------|--------|-------|
| **Validator Pipeline** (7 agents) | ✅ 95% | P1 |
| **Lean Canvas** | ✅ 100% | P1 |
| **CRM & Contacts** | ✅ 95% | P1 |
| **Pitch Deck** | ✅ 95% | P1 |
| **Onboarding Wizard** | ✅ 100% | P0 |
| **Documents** | ✅ 90% | P1 |
| **Tasks** | ✅ 90% | P1 |
| **Dashboard** | 🟡 85% | P1 |
| **Events** | ✅ 85% | P2 |
| **AI Chat** | 🟡 80% | P2 |
| **Market Research** | 🟡 50% | P2 |
| **Experiments Lab** | 🟡 65% | P2 |
| **Opportunity Canvas** | 🟡 40% | P2 |
| **Vector DB / RAG** | 🟡 70% | P2 |
| **Investor Features** | ✅ 85% | P2 |
| **Sprint Planning** | 🟡 60% | P1 |

**29 Edge Functions** deployed, **89 database tables**, **370+ components**, **24 AI agent hooks**

**Hybrid AI:** Gemini 3 for fast ops (extraction, search, images) + Claude 4.5/4.6 for reasoning

---

## 2. Problem Statement

Early-stage founders struggle with:

| Problem | Impact | How StartupAI Solves |
|---------|--------|---------------------|
| **Unclear strategy** | Wasted effort on wrong priorities | 7-agent validator + guided wizard |
| **No idea validation** | Building wrong things | AI validation report with GO/CAUTION/NO-GO verdict |
| **Fragmented tools** | Context lost across apps | Single platform for all startup ops |
| **Overwhelming AI** | No structure, inconsistent outputs | Domain-specific AI with industry playbooks |
| **Planning paralysis** | Weeks planning instead of doing | Strategy → Daily tasks automatically |
| **No feedback loops** | Changes feel disconnected | Realtime AI recalculates on every input |

---

## 3. Target Users

### Primary Users

| User Type | Description | Key Pain Points |
|-----------|-------------|-----------------|
| **Solo Founders** | Building alone, wearing all hats | Need clarity, validation, automation |
| **Early-Stage Teams** | 1-10 people, pre-Series A | Need coordination, tracking |
| **First-Time Founders** | Learning startup fundamentals | Need guidance, best practices |

### Secondary Users

| User Type | Use Case | Value |
|-----------|----------|-------|
| **Accelerators** | Batch intake, portfolio tracking | Standardized data, comparison |
| **Startup Consultants** | Client onboarding | Faster discovery, playbooks |
| **Venture Studios** | Multiple startup operations | Repeatable processes |

---

## 4. Directory Structure / Routes

```
/
├── /                         # Marketing Home
├── /how-it-works             # How It Works
├── /features                 # Features
├── /blog                     # Blog Index
├── /blog/:slug               # Blog Post
├── /events                   # Public Events
├── /login                    # Authentication
├── /auth/callback            # OAuth Callback
│
├── /onboarding               # Startup Profile Wizard (4 steps)
├── /onboarding/complete      # Wizard Completion
│
├── /dashboard                # Main overview (Command Centre)
├── /user-profile             # User profile
├── /company-profile          # Company profile
├── /settings                 # Settings
│
├── /validate                 # Validator chat entry (3-panel)
├── /validator                # Validator dashboard + history
├── /validator/run/:sessionId # Real-time pipeline progress
├── /validator/report/:reportId # 14-section validation report
│
├── /lean-canvas              # Lean Canvas with AI Coach
├── /market-research          # Market Research Hub
├── /opportunity-canvas       # Opportunity Canvas
├── /sprint-plan              # 90-Day Sprint Plan
├── /experiments              # Experiments Lab
│
├── /app/pitch-decks          # Pitch Deck Dashboard
├── /app/pitch-deck/new       # Pitch Deck Wizard
├── /app/pitch-deck/:id/edit  # Pitch Deck Editor
├── /app/pitch-deck/:id/generating # Generation Progress
│
├── /projects                 # Project list
├── /projects/:id             # Project detail
├── /tasks                    # Task management (Kanban)
├── /crm                      # CRM (contacts + deals)
├── /investors                # Investor pipeline
├── /documents                # Document storage
├── /app/events               # Events Dashboard
├── /app/events/new           # Event Wizard
├── /app/events/:id           # Event Detail
├── /ai-chat                  # AI Assistant
├── /analytics                # Analytics Dashboard
└── /diagrams                 # System Diagrams
```

---

## 5. Core Features (MVP)

| # | Feature | Purpose | Priority | Status |
|---|---------|---------|----------|--------|
| 1 | **Validator Pipeline** (7 agents) | Validate startup ideas with AI research, scoring, report | P1 | ✅ 95% |
| 2 | **Startup Wizard** (4 steps) | Capture structured startup context with AI enrichment | P0 | ✅ 100% |
| 3 | **Lean Canvas** | AI-powered business model canvas with coach | P1 | ✅ 100% |
| 4 | **CRM** | Track investors, partners, customers, deals | P1 | ✅ 95% |
| 5 | **Pitch Deck** | AI-powered investor deck creation + image gen | P1 | ✅ 95% |
| 6 | **Task Management** | Kanban board with AI prioritization | P1 | ✅ 90% |
| 7 | **Documents** | Document storage with AI extraction | P1 | ✅ 90% |
| 8 | **Main Dashboard** | Daily execution overview with AI insights | P1 | 🟡 85% |
| 9 | **Investor Pipeline** | 12-action agent, term sheet analysis | P2 | ✅ 85% |

### Validator Pipeline (Core Product)

The validator is the primary product — a 7-agent AI pipeline that validates startup ideas:

```
User describes idea → Follow-up questions (8 topics) → Pipeline runs (60-120s)
→ 14-section report with GO/CAUTION/NO-GO verdict
```

| Agent | Model | Purpose | Timeout |
|-------|-------|---------|---------|
| **Extractor** | Gemini Flash | Extract startup profile from pitch text | 10s |
| **Research** | Gemini Flash | Market sizing with Google Search + URL Context + RAG | 30s |
| **Competitors** | Gemini Flash | Competitor analysis with Google Search | 25s |
| **Scoring** | Gemini Flash | Multi-dimensional scoring (7 dimensions, thinking mode) | 15s |
| **MVP** | Gemini Flash | Practical MVP plan from scoring risks | 15s |
| **Composer** | Gemini Flash | Synthesize 14-section report (8192 tokens) | 90s |
| **Verifier** | Pure JS | Report completeness validation | <1s |

**Pipeline deadline:** 300s (paid plan allows 400s). Rate limited per user.

### MVP Scope Rules

- Focus on **one founder** use case first
- AI features should **suggest, not auto-execute**
- No team collaboration in MVP
- Security hardening before any production deployment

---

## 6. Advanced Features

| # | Feature | Purpose | Phase | Status |
|---|---------|---------|-------|--------|
| 1 | **Market Research Hub** | TAM/SAM/SOM, trends, competitor grid | P2 | 🟡 50% |
| 2 | **Experiments Lab** | Hypothesis testing with evidence tracking | P2 | 🟡 65% |
| 3 | **Opportunity Canvas** | 9-block opportunity assessment | P2 | 🟡 40% |
| 4 | **Sprint Planning** | 90-day plan with Kanban + PDCA | P1 | 🟡 60% |
| 5 | **Share Links** | Shareable validation reports | P2 | 🔴 0% |
| 6 | **Business Readiness** | 6-dimension readiness scoring | P2 | 🔴 0% |
| 7 | **Outcomes Dashboard** | ROI tracking, benchmarks | P2 | 🔴 0% |
| 8 | **Validator v2** | Per-agent edge functions, orchestrator | P2 | 🔴 0% |
| 9 | **Expert Knowledge** | Industry playbooks + prompt packs in all agents | P2 | 🔴 0% |
| 10 | **Vector Hybrid Search** | Keyword + semantic + RRF search | P2 | 🔴 0% |
| 11 | **Idea Wall** | Divergent thinking with AI clustering | P3 | 🔴 0% |
| 12 | **Story Map** | User journey with MVP cutline | P3 | 🔴 0% |
| 13 | **Knowledge Map** | Strategic knowledge dependencies | P3 | 🔴 0% |
| 14 | **Decision Guardrails** | Human vs AI decision boundaries | P3 | 🔴 0% |
| 15 | **Live Strategy Re-Simulation** | Full strategy recalc on assumption changes | P3 | 🔴 0% |
| 16 | **Market Signal Alerts** | Strategy adjustments from external events | P3 | 🔴 0% |

---

## 7. Lean System (17-Screen Architecture)

> **Rule:** Wireframes -> Diagrams -> Tasks -> Implementation
> **Layout:** 3-panel (Context | Work | AI Intelligence) on all screens

### Screen Map (Implementation Order)

| # | Screen | Question | Phase | Status |
|---|--------|----------|:-----:|:------:|
| 01 | Chat Intake | What is this startup about? | P1 | BUILT |
| 02 | Startup Profile | Do we have the full picture? | P1 | BUILT |
| 03 | Validator Report | Is this idea worth pursuing? | P1 | BUILT |
| 04 | Lean Canvas | What is the business model? | P1 | BUILT |
| 05 | 90-Day Plan | What do we do this week? | P1 | PARTIAL |
| 06 | Dashboard | What should I do right now? | P1 | REDESIGN |
| 07 | Experiments Lab | How do we test our assumptions? | P2 | PARTIAL |
| 08 | Market Research Hub | What does the evidence say? | P2 | PARTIAL |
| 09 | Opportunity Canvas | Will people actually adopt this? | P2 | PARTIAL |
| 10 | Business Readiness | Are we ready for real users? | P2 | NEW |
| 11 | Outcomes Dashboard | Is this actually worth continuing? | P2 | NEW |
| 12 | Idea Wall | What are all our options? | P3 | NEW |
| 13 | Story Map | What is the user's journey? | P3 | NEW |
| 14 | Knowledge Map | What must we be right about to win? | P3 | NEW |
| 15 | Capability Strategy | What intelligence do we need? | P3 | NEW |
| 16 | Decision Guardrails | Which decisions must stay human? | P3 | NEW |
| 17 | Agent POC Canvas | What will the AI agent do? | NICHE | NEW |

### Screen Flow

```
[01] Chat --> [02] Profile --> [03] Validator --> [08] Research
                                                       |
[04] Lean Canvas <------------------------------------+
        |
[09] Opportunity --> [12] Idea Wall --> [13] Story Map
        |
[07] Experiments --> [05] 90-Day Plan
        |
[06] Dashboard (hub -- links to all screens)
        |
[14] Knowledge Map --> [15] Capability Strategy
        |
[10] Business Readiness --> [11] Outcomes --> [16] Decision Guardrails
```

### Task Specs

29 task specs in `lean/prompts/` covering:
- **P1 CORE** (7 tasks): Enhance existing screens to 3-panel layout
- **P2 MVP** (16 tasks): New screens + vector RAG + validator v2 + expert knowledge
- **P3 ADVANCED** (6 tasks): Advanced strategy screens
- **NICHE** (1 task): AI product founders only

**References:** Wireframes in `lean/wireframes/`, task specs in `lean/prompts/`, diagrams in `lean/tasks/mermaid-lean/`

---

## 8. Real-World Use Cases

### Use Case 1: Solo Founder Validates Idea (Sarah)

**Situation:** Sarah has a B2B SaaS idea but isn't sure it's worth pursuing

**Journey:**
- **Day 1 (10 min):** Describes idea in chat → AI asks follow-up questions (8 topics) → Triggers validator pipeline
- **Day 1 (2 min wait):** 7 AI agents research market, score idea, analyze competitors → Receives 14-section report with 72/100 score (GO verdict)
- **Day 1 (15 min):** Reviews report → Lean canvas auto-populates → AI coach helps refine business model
- **Week 1 (5 min/day):** Checks dashboard → Completes priorities → Runs experiments
- **Month 1:** Uses CRM to track 10 investor conversations → Closes first meeting

**Outcome:** Idea → Validated → Structured business → First investor meeting in 4 weeks

### Use Case 2: Fundraising Preparation (Marcus)

**Situation:** Marcus preparing for $1.5M pre-seed raise

**Journey:**
- **Preparation:** Profile at 95% → AI generates pitch deck → Lean canvas validated → Practices Q&A with AI Coach
- **Discovery:** Searches "Pre-seed VCs in AI developer tools" → 50 matches → Adds top 20 to CRM
- **Execution:** Tracks 30 conversations → AI alerts stalled deals → 8 meetings → 3 term sheets → Funded

### Use Case 3: Accelerator Batch Intake (TechBoost)

**Situation:** TechBoost needs to onboard 20 startups

**Journey:**
- Admin sends wizard link → Each founder completes in 20 min → Standardized data
- Each founder runs validator → Portfolio view compares all 20 → AI flags 3 startups at risk

---

## 9. User Stories

### Core Stories (MVP)

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| US-1 | As a founder, I want to validate my idea so I know if it's worth pursuing | Chat intake → 7-agent pipeline → 14-section report with verdict |
| US-2 | As a founder, I want to complete a wizard so I have a structured profile | Wizard saves to DB, profile strength calculated |
| US-3 | As a founder, I want to see my daily priorities so I know what to work on | Dashboard shows top 5 tasks by priority |
| US-4 | As a founder, I want AI to explain suggestions so I understand the reasoning | AI panel shows explanation for each insight |
| US-5 | As a founder, I want to track investor conversations so I don't lose context | CRM shows deals with stage, notes, last contact |
| US-6 | As a founder, I want a lean canvas so I can validate my business model | Canvas auto-prefills from validator, AI validates |
| US-7 | As a founder, I want AI to generate my pitch deck from my data | Deck generated from profile + canvas + traction |
| US-8 | As a founder, I want to share my validation report with advisors | Shareable link with public report view |

---

## 10. User Journeys

### Journey 1: Idea Validation (Primary)

```
Describe idea in chat → AI asks follow-up questions (8 topics, anti-repetition)
→ User reaches coverage threshold → Pipeline triggers (7 agents, 60-120s)
→ Real-time progress page shows agent steps
→ 14-section report: Executive Summary, Market Sizing, Competitors, SWOT,
  Scoring (7 dimensions), MVP Plan, Revenue Projections, Next Steps
→ GO / CAUTION / NO-GO verdict with score
→ Auto-populate Lean Canvas from report data
```

### Journey 2: First Day (Onboarding → Dashboard)

```
Sign up → Wizard Step 1 (URL + profile) → AI extracts company data
→ Wizard Step 2 (AI analysis + competitors) → AI enriches context
→ Wizard Step 3 (Smart interview) → AI detects signals
→ Wizard Step 4 (Review + readiness score) → Redirect to Dashboard
→ Dashboard shows: health score, metrics, next best action
```

### Journey 3: Weekly Strategy Session

```
Open Dashboard → Check health score → Review AI-generated priorities
→ Update lean canvas → AI validates changes → Score improves
→ Check experiments → Record evidence → Update assumptions
→ Review CRM → Follow up on stalled deals
→ Generate updated pitch deck section
```

### Journey 4: Fundraising Prep

```
Investor Readiness Checker → Shows gaps identified
→ Fix pitch deck (financial projections)
→ AI generates investor objection answers from own data
→ Search investors → Add to CRM → Track conversations
```

---

## 11. Workflows

### Core Workflow: AI Suggest → Approve → Execute

```
User Action → AI Analysis → Suggestion (Right Panel) → User Approval → Database Write → Audit Log
```

**Rule:** AI NEVER writes to database without user approval.

### Workflow by Phase

| Phase | Trigger | AI Action | Output |
|-------|---------|-----------|--------|
| **P1** | User describes idea | 7-agent validation pipeline | 14-section report |
| **P1** | User completes wizard | Generate tasks, calculate readiness | 5 tasks + score |
| **P1** | User opens dashboard | Analyze risks, calculate health | Health score + actions |
| **P1** | Report complete | Auto-populate lean canvas | Pre-filled canvas |
| **P2** | Deal stage change | Score deal, suggest next steps | Updated probability |
| **P2** | User adds contact | Enrich contact | Filled profile |
| **P2** | Strategy input changes | Recalculate health score | Updated score |
| **P3** | Growth stalls 3 weeks | Suggest pivot options | 2-3 pivot strategies |
| **P3** | Competitor raises funding | Alert + strategic adjustment | Action items |

---

## 12. 3-Panel Layout Logic

```
+---------------+-----------------------------------------------+---------------+
|   LEFT PANEL  |               MAIN PANEL                      |  RIGHT PANEL  |
|   CONTEXT     |               WORK                            |  INTELLIGENCE |
|   240px fixed |               flex (grow)                     |  320px fixed  |
|               |                                               |               |
| WHERE AM I?   |  WHAT AM I DOING?                            |  HELP ME      |
|               |                                               |               |
| - Navigation  |  - Forms, Tables, Editors                    |  - AI Summary |
| - Filters     |  - Kanban boards, Wizards                    |  - Insights   |
| - Progress    |  - Canvas, Deck editor                       |  - Risks      |
| - Status      |  - Chat, Reports                             |  - Next steps |
+---------------+-----------------------------------------------+---------------+
```

**Hard Rule:**
```
AI → PROPOSE (Right panel shows recommendations)
Human → APPROVE (User acts in Main panel)
System → EXECUTE (Backend processes confirmed changes)
```

### Responsive Behavior

| Viewport | Layout |
|----------|--------|
| Desktop (>=1280px) | 3-panel: Left + Main + Right |
| Tablet (768-1279px) | 2-panel: Left (collapsible) + Main, Right = slide-over |
| Mobile (<768px) | 1-panel: Main only, Left = hamburger, Right = bottom sheet |

### Screens Using 3-Panel Layout (16)

ValidateIdea, ValidatorReport, Validator Dashboard, Dashboard, LeanCanvas, Company Profile, Onboarding, Pitch Deck Wizard, Pitch Deck Editor, Pitch Deck Dashboard, Projects, Tasks, CRM, Investors, Documents, AI Chat

---

## 13. Screen Specifications

### Screen Map

| Screen | Purpose | Primary AI | Status |
|--------|---------|------------|--------|
| **Validate Idea** | Chat-based idea validation (3-panel) | validator-start (7 agents) | ✅ 100% |
| **Validator Progress** | Real-time pipeline step tracking | validator-status | ✅ 100% |
| **Validator Report** | 14-section report with charts | validator-panel-detail | ✅ 95% |
| **Validator Dashboard** | Mode selection + history | — | ✅ 90% |
| **Wizard** (4 steps) | Structured startup capture | onboarding-agent | ✅ 100% |
| **Lean Canvas** | Business model validation | canvas-coach, lean-canvas-agent | ✅ 100% |
| **CRM / Deals** | Pipeline management | crm-agent | ✅ 95% |
| **Pitch Deck** | Investor deck creation | pitch-deck-agent | ✅ 95% |
| **Tasks** | Execution tracking (Kanban) | task-agent | ✅ 90% |
| **Documents** | Document storage + AI | documents-agent | ✅ 90% |
| **Dashboard** | Daily execution overview | health-scorer, action-recommender | 🟡 85% |
| **Events** | Event management | event-agent | ✅ 85% |
| **Investors** | Investor pipeline (12 actions) | investor-agent | ✅ 85% |
| **AI Chat** | AI assistant | ai-chat | 🟡 80% |
| **Analytics** | Task trends, pipeline, export | — | 🟡 80% |
| **Market Research** | TAM/SAM/SOM, trends, competitors | market-research | 🟡 50% |
| **Experiments** | Hypothesis testing | experiment-agent | 🟡 65% |
| **Sprint Plan** | 90-day plan, PDCA | — | 🟡 60% |
| **Opportunity Canvas** | Opportunity assessment | opportunity-canvas | 🟡 40% |

### Wizard (4 Steps) — ✅ 100%

| Step | Content | AI Feature |
|------|---------|------------|
| 1. Profile & Business | URL, name, industry, description | Smart Autofill (URL extraction) |
| 2. AI Analysis | Competitors, trends, context | AI enrichment (3 parallel operations) |
| 3. Smart Interview | 5 adaptive questions | Signal detection, coaching tips |
| 4. Review & Score | Readiness score, summary, tasks | Industry-benchmarked scoring |

---

## 14. Wizards

### Wizard Best Practices

| Rule | Implementation |
|------|----------------|
| Required vs optional clear | Visual distinction, validation |
| AI assists but never blocks | Fallback to manual always available |
| Resume capability | Save state to wizard_sessions |
| Incremental progress | Each AI result appears as it completes |

---

## 15. Chatbot System

| Can Do | Cannot Do |
|--------|-----------|
| Explain data | Write to database directly |
| Suggest actions | Execute without approval |
| Generate drafts | Auto-send emails |
| Answer questions | Make decisions for user |

### Safety Rules
1. Stateless by default
2. Human approval gates for writes
3. All suggestions clearly labeled as AI-generated
4. Undo available for all AI actions

---

## 16. Data Model

### Overview

**89 tables**, 50 migrations, RLS on 88/89 tables, pgvector HNSW index

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `organizations` | Multi-tenant isolation | id, name, settings |
| `profiles` | User data | id, email, org_id, role |
| `startups` | Startup entities | id, org_id, name, industry, traction_data |
| `validation_sessions` | Validator pipeline runs | id, org_id, status, pitch_text |
| `validation_reports` | 14-section validation reports | id, session_id, report_json, score |
| `lean_canvases` | Business model canvases | id, org_id, canvas_data, version |
| `projects` | Project management | id, startup_id, name, health |
| `tasks` | Task tracking | id, startup_id, title, priority, status |
| `contacts` | CRM contacts | id, startup_id, name, type, email |
| `deals` | Deal pipeline | id, contact_id, stage, amount |
| `documents` | Document storage | id, startup_id, type, content_json |
| `wizard_sessions` | Wizard state | id, user_id, current_step, ai_extractions |
| `ai_runs` | AI cost tracking | id, user_id, agent_name, model, cost_usd |
| `experiments` | Hypothesis testing | id, org_id, hypothesis, status |
| `sprints` | Sprint planning | id, org_id, name, goals |
| `market_research` | Market analysis data | id, org_id, research_json |
| `opportunity_canvases` | Opportunity assessment | id, org_id, canvas_data |
| `knowledge_chunks` | RAG vector embeddings | id, content, embedding, industry |
| `knowledge_documents` | RAG source documents | id, title, source_url, industry |
| `industry_playbooks` | 19 industry expert playbooks | id, industry, playbook_json |
| `prompt_packs` | 54 prompt packs | id, name, pack_type |
| `pitch_decks` | Pitch deck data | id, org_id, deck_json |
| `investors` | Investor records | id, org_id, name, type |
| `events` | Event management | id, org_id, name, event_type |

### Key Relationships

- org → startups, validation_sessions, lean_canvases, experiments (1:many, multi-tenant)
- validation_session → validation_reports (1:1)
- startup → projects, tasks, contacts, documents, events (1:many)
- contact → deals, communications (1:many)
- All tables have RLS policies using `auth.uid()` for isolation

---

## 17. AI Architecture

### Overview

```
Frontend (React) → Edge Functions (Deno) → AI Models (Gemini 3 + Claude 4.5/4.6)
                                         → Database (Supabase PostgreSQL + pgvector)
                                         → Realtime (Supabase Channels)
```

### Hard Rule

```
AI → PROPOSE (suggestions in right panel)
Human → APPROVE (user confirms in main panel)
System → EXECUTE (backend writes to database)
```

### Edge Functions (29 Deployed)

| Function | Model | Purpose | Status |
|----------|-------|---------|--------|
| `validator-start` | Gemini Flash | 7-agent pipeline (300s deadline) | ✅ |
| `validator-status` | — | Progress polling + zombie cleanup (360s) | ✅ |
| `validator-followup` | Gemini Flash | Chat follow-up (8 topics, anti-repetition) | ✅ |
| `validator-regenerate` | Gemini Flash | Re-run pipeline | ✅ |
| `validator-panel-detail` | Gemini Flash | Report section deep-dive | ✅ |
| `onboarding-agent` | Gemini Flash | Wizard enrichment, scoring (10 actions) | ✅ |
| `lean-canvas-agent` | Gemini Flash | Canvas prefill, suggest, validate (8 actions) | ✅ |
| `canvas-coach` | Gemini Flash | Canvas coaching chat | ✅ |
| `market-research` | Gemini Pro | Market sizing, trends | ✅ |
| `opportunity-canvas` | Gemini Pro | Opportunity analysis | ✅ |
| `experiment-agent` | Gemini Flash | Experiment design | ✅ |
| `profile-import` | Gemini Flash | URL scraping + extraction | ✅ |
| `crm-agent` | Claude | Contact enrichment, deal scoring | ✅ |
| `investor-agent` | Claude | 12-action investor agent | ✅ |
| `pitch-deck-agent` | Gemini Pro | Deck generation + image gen | ✅ |
| `documents-agent` | Gemini Pro | Document analysis | ✅ |
| `task-agent` | Gemini Flash | Task generation/prioritization (6 actions) | ✅ |
| `event-agent` | Gemini Flash | Event planning | ✅ |
| `ai-chat` | Claude/Gemini | Chat assistant | ✅ |
| `industry-expert-agent` | Claude | Industry validation | ✅ |
| `health-scorer` | Computed | 6-dimension health score | ✅ |
| `action-recommender` | Claude | Daily action suggestions | ✅ |
| `stage-analyzer` | Claude | Startup stage assessment | ✅ |
| `insights-generator` | Claude | Data insights | ✅ |
| `compute-daily-focus` | Computed | Daily focus priorities | ✅ |
| `dashboard-metrics` | Computed | Dashboard KPIs | ✅ |
| `workflow-trigger` | — | Workflow automation | ✅ |
| `prompt-pack` | — | Prompt library routing | ✅ |
| `load-knowledge` | OpenAI Embed | RAG ingestion | ✅ |

### Shared Utilities (`_shared/`)

| File | Purpose |
|------|---------|
| `gemini.ts` | Gemini REST client + `extractJSON` 5-step fallback + `Promise.race` timeout |
| `cors.ts` | CORS restricted to app domain |
| `rate-limit.ts` | In-memory sliding window: heavy (5/5min), standard (30/60s), light (120/60s) |

---

## 18. AI Models & Agents

### Hybrid Strategy: Gemini 3 + Claude 4.5/4.6

| Model | Use Case | Edge Functions |
|-------|----------|:--------------:|
| **gemini-3-flash-preview** | Fast extraction, chat, validation agents | 6 |
| **gemini-3-pro-preview** | Complex reasoning, deep analysis | 3 |
| **gemini-3-pro-image-preview** | Slide images, marketing visuals | 1 |
| **claude-opus-4-6** | Strategic planning, complex reasoning | 6 |
| **claude-haiku-4-5** | Fast tasks, automation | 2 |
| **text-embedding-3-small** (OpenAI) | Vector embeddings for RAG | 1 |

### Gemini Best Practices (Enforced)

| Rule | Implementation |
|------|----------------|
| Guaranteed JSON | `responseJsonSchema` + `responseMimeType: "application/json"` |
| Temperature | Always 1.0 (lower causes Gemini 3 looping) |
| API key | `x-goog-api-key` header (not query param) |
| Timeout | `Promise.race` with hard timeout (not `AbortSignal.timeout`) |
| JSON fallback | 5-step `extractJSON`: direct → fence strip → balanced braces → truncated repair → array unwrap |

### Agent Types (24 AI hooks)

| Hook | Edge Function | Actions | Model |
|------|--------------|:-------:|-------|
| `useValidatorPipeline` | `validator-start` | 1 | Gemini Flash |
| `useValidatorFollowup` | `validator-followup` | 1 | Gemini Flash |
| `useCanvasCoach` | `canvas-coach` | 1 | Gemini Flash |
| `useLeanCanvasAgent` | `lean-canvas-agent` | 8 | Gemini Flash |
| `useTaskAgent` | `task-agent` | 6 | Gemini Flash |
| `useCRMAgent` | `crm-agent` | 3 | Claude |
| `useInvestorAgent` | `investor-agent` | 12 | Claude |
| `usePitchDeckAgent` | `pitch-deck-agent` | 4 | Gemini Pro |
| `useMarketResearch` | `market-research` | 1 | Gemini Pro |
| `useOpportunityCanvas` | `opportunity-canvas` | 1 | Gemini Pro |
| `useExperiments` | `experiment-agent` | 1 | Claude |
| `useOnboardingAgent` | `onboarding-agent` | 10 | Gemini Flash |
| `useProfileImport` | `profile-import` | 1 | Gemini Flash |
| + 11 more | Various | Various | Various |

---

## 19. Supabase Realtime Strategy

### Mental Model

```
Founder changes something → AI recalculates → Realtime pushes update → Screen updates instantly
```

### Planned Features (20 total)

**Core (10 features, Phase 2):**

| # | Feature | Score |
|---|---------|-------|
| 1 | Startup Health Score (live dial) | 96 |
| 2 | Strategy → Task Generator (instant task creation) | 95 |
| 3 | Investor Readiness Checker (progress bar) | 94 |
| 4 | Risk Detection Engine (alert cards) | 93 |
| 5 | 30-60-90 Day Plan (living roadmap) | 92 |
| 6 | Deal Strategy Re-Scoring (probability updates) | 91 |
| 7 | Strategy Alignment Monitor (drift detection) | 90 |
| 8 | Daily Priority Generator (morning briefing) | 89 |
| 9 | Execution Bottleneck Detector (blocked chains) | 88 |
| 10 | Strategy Progress Feed (AI activity timeline) | 87 |

**Advanced (10 features, Phase 3):**

| # | Feature | Score |
|---|---------|-------|
| 1 | Live Strategy Re-Simulation (cascade recalculation) | 97 |
| 2 | Fundraising Scenario Planner (dilution/runway sliders) | 96 |
| 3 | Market Signal Alerts (competitor monitoring) | 95 |
| 4 | AI Pivot Recommendation Engine (pivot options) | 94 |
| 5 | Multi-Strategy Comparison (side-by-side evaluation) | 93 |
| 6 | Execution Load Balancer (capacity management) | 92 |
| 7 | Strategic Dependency Mapper (critical path visualization) | 91 |
| 8 | Revenue Sensitivity Analyzer (financial sliders) | 90 |
| 9 | Investor Objection Anticipator (pre-answered questions) | 89 |
| 10 | Cross-Module Strategy Sync (unified updates) | 88 |

### What NOT to Make Realtime

| Feature | Why Not |
|---------|---------|
| Historical reports | Static data, no urgency |
| PDF exports | One-time action |
| Settings changes | Rare, low frequency |
| Billing/subscription | Security-sensitive |

---

## 20. Implementation Phases

### Phase 0 — Foundation (100% Complete)

| Deliverable | Status |
|-------------|--------|
| Vite + React + TypeScript + Tailwind + shadcn/ui | ✅ |
| Database schema (89 tables) | ✅ |
| Supabase client + RLS (88/89 tables) | ✅ |
| Auth wiring (Google + LinkedIn OAuth) | ✅ |
| Onboarding Wizard (4 steps, 50+ components) | ✅ |
| Organizations RLS | ✅ (migration `20260208100000`) |
| Dev bypass policies dropped | ✅ (migration `20260208100001`) |

**Gate:** ✅ Auth works, RLS tested, wizard completes, browser audit passed

### Phase 1 — Core MVP (90% Complete)

| Deliverable | Status |
|-------------|--------|
| Validator Pipeline (7 agents, 300s deadline) | ✅ 95% |
| Lean Canvas (editor + AI coach + versioning) | ✅ 100% |
| CRM (contacts + deals + pipeline + CSV import) | ✅ 95% |
| Pitch Deck (wizard + editor + generation + image gen) | ✅ 95% |
| Tasks (Kanban + AI prioritization) | ✅ 90% |
| Documents (CRUD + AI extraction) | ✅ 90% |
| Dashboard (health score + metrics + stage guidance) | 🟡 85% |
| Sprint Plan (PDCA editor + sprint cards) | 🟡 60% |
| CORS restricted to app domain | ✅ |
| Rate limiting (3 tiers) | ✅ |
| Code splitting (40 lazy chunks) | ✅ |

**Gate:** 🟡 Founder validates idea → sees report → lean canvas populated → pitch deck generated

### Phase 2 — Lean System + RAG (25% Complete)

| Deliverable | Status |
|-------------|--------|
| Market Research Hub (3 components exist) | 🟡 50% |
| Experiments Lab (CRUD + agent exist) | 🟡 65% |
| Opportunity Canvas (2 components exist) | 🟡 40% |
| Events system | ✅ 85% |
| AI Chat | 🟡 80% |
| Share Links | 🔴 0% |
| Business Readiness | 🔴 0% |
| Outcomes Dashboard | 🔴 0% |
| Vector RAG deploy + ingest | 🔴 0% |
| Vector Schema v2 + hybrid search | 🔴 0% |
| Validator Agent Runs schema | 🔴 0% |
| Validator v2 (composer split, parallel agents) | 🔴 0% |
| Expert Knowledge System (playbooks + packs) | 🔴 0% |

**Gate:** AI features explain outputs, RAG working, no cross-org data leaks

### Phase 3 — Advanced AI (0%)

| Deliverable | Status |
|-------------|--------|
| Idea Wall, Story Map, Knowledge Map | 🔴 |
| Capability Strategy, Decision Guardrails | 🔴 |
| Live Strategy Re-Simulation | 🔴 |
| Market Signal Alerts | 🔴 |
| Validator Orchestrator (full v2) | 🔴 |
| Cross-Module Strategy Sync | 🔴 |

**Gate:** Advanced features measurable, workflow orchestration operational

### Phase 4 — Production Hardening (20%)

| Deliverable | Status |
|-------------|--------|
| CORS restricted | ✅ |
| Rate limiting | ✅ |
| RLS on all tables | 🟡 88/89 |
| JWT verification (all 29 edge functions) | ✅ |
| CI/CD pipeline | 🔴 |
| Monitoring & alerting | 🔴 |
| Performance optimization | 🔴 |
| Load testing | 🔴 |

**Gate:** System handles real usage, metrics tracked, all gates pass

---

## 21. Success Criteria

### MVP Metrics (Phase 1)

| Metric | Target | Current |
|--------|--------|---------|
| Wizard completion rate | >80% | ✅ ~85% |
| Validation report generation | <120s | ✅ 60-120s |
| AI response latency | <3s | ✅ <2s |
| Zero cross-org data leaks | 0 incidents | ✅ 0 |
| Validator E2E success | >90% | ✅ 3/3 runs |

### Advanced Metrics (Phase 2+)

| Metric | Target |
|--------|--------|
| Health Score adoption | >70% of active users check weekly |
| Task completion rate | >60% of AI-generated tasks completed |
| Perceived wait time (with Realtime) | 50% reduction |
| Lean canvas validation score | Average >70/100 |

---

## 22. Risks & Constraints

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Gemini API instability | Medium | High | `extractJSON` 5-step fallback, `Promise.race` timeout |
| Over-reliance on AI | Medium | High | AI suggests, never auto-executes |
| Pipeline timeout cascades | Low | High | Per-agent timeouts, 300s deadline, zombie cleanup |
| Cost overruns from AI usage | Medium | Medium | Daily caps, usage alerts, `ai_runs` tracking, rate limiting |
| Cross-org data leaks | Low | Critical | RLS on every table, JWT verification on all edge functions |

### Constraints (Non-Negotiable)

| Constraint | Implementation |
|------------|----------------|
| AI must be explainable | Show reasoning in right panel |
| Security first | RLS on every table, server-side AI, CORS restricted |
| No AI auto-actions | Human approval for all writes |
| No production secrets client-side | `import.meta.env.VITE_*` only |
| Gemini best practices | `responseJsonSchema`, temperature 1.0, `x-goog-api-key` header |
| Edge function resilience | `Promise.race` timeout, `EdgeRuntime.waitUntil()` for background work |

---

## 23. Verification Checklist

### Per-Phase Gates

| Phase | Verification |
|-------|--------------|
| 0 | ✅ Build succeeds, wizard completes, browser audit passed |
| 1 | 🟡 User journey: chat → validate → report → canvas → deck |
| 2 | AI explainable, RAG working, no cross-org leaks |
| 3 | Advanced AI features measurable, orchestration operational |
| 4 | Performance under load, cost controls active, metrics live |

### Pre-Launch Checklist

- [x] Fresh DB deploy succeeds
- [x] All RLS policies tested (88/89)
- [x] Validator pipeline E2E (3 runs verified)
- [x] Rate limiting active (3 tiers)
- [x] CORS restricted to app domain
- [x] Code splitting (40 lazy chunks)
- [x] Edge functions verify JWT
- [ ] Wizard → Dashboard → Tasks E2E journey
- [ ] Share links feature
- [ ] PDF export cross-browser tested
- [ ] Cost controls active
- [ ] Error handling covers edge cases

---

## Cross-References

| Document | Path | Purpose |
|----------|------|---------|
| **Master Progress Tracker** | `lean/index-progress.md` | Comprehensive status (24 sections) |
| **Lean Task Map** | `lean/prompts/000-index.md` | 29 task specs with wireframe links |
| **Lean Task Progress** | `lean/prompts/index-lean.md` | Per-task checklists |
| **Wireframe Index** | `lean/wireframes/00-index.md` | 17 screens in implementation order |
| **Mermaid Diagrams** | `lean/tasks/mermaid-lean/` | 9 system architecture diagrams |
| **Validator v2 Strategy** | `tasks/validator/strategy/00-INDEX.md` | Pipeline migration plan |
| **Vector RAG Plan** | `plan/vector/09-startupai-vectordb.md` | RAG strategy |
| **Roadmap** | `roadmap.md` | Phase gates, timeline |
| **Changelog** | `CHANGELOG.md` | Version history |
| **Gemini Skill** | `.agents/skills/gemini/SKILL.md` | Gemini 3 API integration guide |

---

**Last Updated:** February 8, 2026
**Version:** 6.0
**Owner:** Product + Engineering

**Key Changes (v6.0):**
- Validator Pipeline promoted to Core Feature #1 with full agent/pipeline documentation
- Added Section 7: Lean System (17-screen architecture with screen flow)
- All feature percentages updated to match `lean/index-progress.md` verified state
- Routes fixed to match actual codebase (flat routes, not `/app/` prefix)
- Data Model: 42 → 89 tables, added 12 key tables (validation, knowledge, playbooks, etc.)
- Edge Functions: complete list of all 29 + shared utilities
- AI Models: fixed to `claude-opus-4-6`, removed stale `gemini-2.5` reference
- Security: Organizations RLS done, dev bypass dropped, CORS restricted, rate limiting active
- Implementation Phases: all percentages updated, Phase 0 now 100%, Phase 1 now 90%
- Cross-references updated to current paths (`lean/prompts/`, `lean/wireframes/`)
- Added Gemini best practices table (JSON schema, temperature, timeout patterns)
- Updated user stories and journeys to reflect validator as primary flow
