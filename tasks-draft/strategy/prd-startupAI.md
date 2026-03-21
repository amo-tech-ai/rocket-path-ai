# StartupAI PRD (v1)

> **Version:** 1.0 | **Date:** 2026-02-10
> **Audience:** Founders, engineers, product builders
> **Stack:** React 18 + Vite 5 + TypeScript + Tailwind + shadcn/ui + Supabase + Gemini 3 + Claude 4.6
> **Operating Model:** AI proposes -> Human approves -> System writes
> **See also:** `lean/prompts/roadmap.md` (roadmap), `lean/features.md` (feature map), `prd.md` (v6.0)

---

## 1. Summary

StartupAI is an AI-powered operating system for startup founders. It takes a raw idea, validates it with a 7-agent pipeline, generates a 14-section report, and feeds that data into lean canvases, CRM, pitch decks, tasks, and a daily dashboard — all from one platform.

**What makes it different:** Every module is connected. Validation data flows into lean canvas. Canvas feeds pitch decks. CRM contacts link to experiments. AI doesn't just answer questions — it proactively surfaces what founders should do next based on their stage, data, and industry.

**Current state:** 42 pages, 31 edge functions, 83 tables, 321 RLS policies, 97 migrations. Validator pipeline E2E working (3 runs: 72/100, 68/100, 62/100). 75 features tracked across 17 categories.

**Core constraint:** AI proposes, human approves, system writes. No AI action without user confirmation.

---

## 2. Target Users

| User Type | Description | Key Pain | Example |
|-----------|-------------|----------|---------|
| **Solo Founders** | Building alone, wearing all hats | Need clarity, validation, automation | "I have a restaurant inventory idea but don't know if it's viable" |
| **Early-Stage Teams** | 1-10 people, pre-Series A | Need coordination, tracking, shared context | "Our team of 3 needs to align on what to build first" |
| **First-Time Founders** | Learning startup fundamentals | Need guidance, best practices, frameworks | "I don't know what a lean canvas is or how to validate assumptions" |
| **Accelerators** | Batch intake, portfolio tracking | Standardized data, comparison across cohorts | "We need to evaluate 50 startups in our batch consistently" |
| **Startup Consultants** | Client onboarding | Faster discovery, structured playbooks | "I advise 5 startups and need a repeatable process" |

---

## 3. Product Flow (5 Steps)

```
Step 1: ONBOARD  ->  Step 2: VALIDATE  ->  Step 3: PLAN  ->  Step 4: EXECUTE  ->  Step 5: FUNDRAISE
(Profile+Context)    (7-agent pipeline)     (Canvas+90-day)    (Tasks+Experiments)    (Deck+CRM+Investors)
```

| Step | What Happens | AI Behavior | Time |
|------|-------------|-------------|------|
| **1. Onboard** | Founder signs up, picks industry, answers 4-7 interview questions | AI asks industry-specific questions, detects competitors from description, imports URL data | 3-5 min |
| **2. Validate** | Pipeline runs 7 agents: extract, research, competitors, scoring, MVP, compose, verify | AI researches market (Google Search + RAG), scores 7-8 dimensions, writes 14-section report with GO/CAUTION/NO-GO verdict | 60-120s |
| **3. Plan** | Lean canvas auto-fills from report, 90-day plan generates, assumptions extracted | AI maps report sections to canvas blocks, suggests experiments for untested assumptions | 5-10 min |
| **4. Execute** | Daily dashboard shows priorities, tasks track experiments, documents generated | AI surfaces daily focus, suggests next experiments, scores leads, generates outreach | Ongoing |
| **5. Fundraise** | Pitch deck generates from canvas, CRM tracks investors, readiness scored | AI drafts slides, matches investors by stage/industry, scores fundability | When ready |

**Real-world example:** Maria has a restaurant food-waste idea. She signs up (Step 1, 3 min) -> runs validation (Step 2, 90s) -> gets 72/100 with CONDITIONAL GO -> lean canvas auto-fills (Step 3) -> daily dashboard says "Interview 5 restaurant owners this week" (Step 4) -> after 6 weeks of experiments, generates pitch deck for Techstars (Step 5).

---

## 4. Core Modules

| # | Module | Goal | Phase | Score | Edge Function(s) |
|---|--------|------|:-----:|:-----:|-------------------|
| 1 | **Validator Pipeline** | Validate startup ideas with AI research and scoring | CORE | 90/100 | `validator-flow`, `validator-start`, `validator-status`, `validator-followup` |
| 2 | **Onboarding Wizard** | Guided startup setup with AI interview | CORE | 85/100 | `onboarding-enrichment` |
| 3 | **Lean Canvas** | Interactive business model with AI coaching | CORE | 72/100 | `lean-coach` |
| 4 | **CRM** | Contact, deal, and investor tracking | CORE | 55/100 | `crm-agent`, `investor-agent` |
| 5 | **Pitch Deck** | AI-generated investor presentations | CORE | 70/100 | `pitch-deck-generator`, `pitch-deck-image` |
| 6 | **Tasks** | AI-prioritized task management | CORE | 55/100 | `task-agent` |
| 7 | **Documents** | Template-based document generation | CORE | 40/100 | `documents-agent` |
| 8 | **Dashboard** | Daily execution hub with health score | CORE | 35/100 | `insights-generator` |
| 9 | **Events** | Startup event discovery and matching | MVP | 65/100 | `event-agent` |
| 10 | **AI Chat** | Context-aware startup advisor | MVP | 70/100 | `ai-chat` |
| 11 | **Vector DB/RAG** | Knowledge base with 3,800+ chunks | MVP | 40/100 | `search-knowledge` |
| 12 | **Market Research** | TAM/SAM/SOM, trends, competitor grid | MVP | 50/100 | `market-research` |

---

## 5. Key Screens

| # | Screen | Question It Answers | Layout | Status |
|---|--------|-------------------|--------|--------|
| 01 | Chat Intake | What is this startup about? | Full-width chat | BUILT |
| 02 | Startup Profile | Do we have the full picture? | 3-panel | BUILT |
| 03 | Validator Report | Is this idea worth pursuing? | 3-panel (report + scores) | BUILT |
| 04 | Lean Canvas | What is the business model? | 3-panel (canvas + coach) | BUILT |
| 05 | 90-Day Plan | What do we do this week? | 3-panel (sprints + timeline) | PARTIAL |
| 06 | Dashboard | What should I do right now? | 3-panel (metrics + AI panel) | REDESIGN |
| 07 | Experiments Lab | How do we test assumptions? | 3-panel (cards + suggestions) | PARTIAL |
| 08 | Market Research Hub | What does the evidence say? | 3-panel (data + insights) | PARTIAL |
| 09 | Opportunity Canvas | Will people adopt this? | 3-panel (5-dimension scoring) | PARTIAL |
| 10 | CRM Contacts | Who are our leads/investors? | 3-panel (list + detail + AI) | BUILT |
| 11 | CRM Deals | What's our pipeline status? | 3-panel (kanban + scoring) | BUILT |
| 12 | Pitch Deck Editor | Is our pitch investor-ready? | Full-width editor | BUILT |
| 13 | Tasks Board | What needs doing? | 3-panel (kanban + AI) | BUILT |
| 14 | Documents | What docs do we need? | List + detail | BUILT |
| 15 | Events | What events should we attend? | List + detail + matching | BUILT |
| 16 | AI Chat | Global advisor | Chat panel | BUILT |
| 17 | Settings/Profile | Account and startup settings | Standard form | BUILT |

**3-Panel Layout:** Context (240px) | Work Area (flex) | AI Intelligence (320px). Every screen follows this pattern. Left panel shows navigation and context. Center is the main workspace. Right panel shows AI suggestions, scores, and coaching.

---

## 6. AI System (Agents + Tools)

### 6.1 Validator Pipeline Architecture

**Current (v2 — Monolith):** All 7 agents run inside `validator-start` as a single edge function. Working E2E but no per-agent retry, shared timeout budget, one failure kills pipeline.

**Target (v3 — Orchestrated):** Each agent becomes its own isolated edge function. `validator-orchestrate` dispatches via DAG with per-agent retry (max 1) on timeout/5xx/429. Returns session_id in <2s, pipeline runs in background via `EdgeRuntime.waitUntil()`.

```
v2 (current):  validator-start [Extractor→Research→Competitors→Scoring→MVP→Composer→Verifier]
v3 (target):   validator-orchestrate → dispatch → [isolated agent functions] → verify → done
```

**Strategy docs:** `lean/drafts/edge-functions/000-index.md` (8 tasks), `000-edge-functions-diagrams.md` (12 Mermaid diagrams)

### 6.2 Agent Functions (v3 Target — 16 Functions)

| Function | Model | Purpose | Timeout | Phase |
|----------|-------|---------|---------|-------|
| **validator-orchestrate** | — | DAG dispatch + retry + status tracking | 300s | MVP |
| **validator-agent-extract** | gemini-3-flash | Parse startup profile from pitch text + interview context | 30s | MVP |
| **validator-agent-research** | gemini-3-flash | Market sizing with Google Search + URL Context + RAG | 90s | MVP |
| **validator-agent-competitors** | gemini-3-flash | Competitor analysis with Google Search (parallel with research) | 90s | MVP |
| **validator-agent-score** | gemini-3-flash | Multi-dimensional scoring (7-8 dims, thinking mode) | 30s | MVP |
| **validator-agent-mvp** | gemini-3-flash | Practical MVP plan from scoring risks | 30s | MVP |
| **validator-agent-compose** | gemini-3-flash | Synthesize 14-18 section report (8192 maxOutputTokens) | 120s | MVP |
| **validator-followup** | gemini-3-flash | Smart interview with depth tracking (none/shallow/deep) | 25s | CORE |
| **validator-status** | — | Poll pipeline status + per-agent progress | — | CORE |
| **validator-panel-detail** | gemini-3-flash | Drill into report section for more detail | 15s | CORE |
| **validator-regenerate** | — | Re-run pipeline (proxy to orchestrator) | — | CORE |
| **validator-flow** | — | Unified facade (POST=start, GET=status) | — | CORE |
| **validator-board-extract** | gemini-3-flash | Extract 5-10 assumptions from report | 15s | ADVANCED |
| **validator-board-suggest** | gemini-3-flash | Suggest experiment for selected assumption | 15s | ADVANCED |
| **validator-board-coach** | gemini-3-flash | Next-action coaching from board state | 10s | ADVANCED |

**Execution DAG (Orchestrator dispatch):**

```
Stage 1 (Sequential):   Extractor
Stage 2 (Parallel):     Research + Competitors
Stage 3 (Sequential):   Scoring
Stage 4 (Parallel):     MVP + Composer
Stage 5 (Inline):       Verifier (pure JS, no LLM)
```

**Retry policy:** Max 1 retry on timeout/5xx/429 with 2s delay. Core agents (Extractor, Scoring, Composer) failure = pipeline failed. Optional agents (Research, Competitors, MVP) failure = degraded_success.

**Per-agent tracking:** `validator_agent_runs` table stores per-agent per-attempt status, duration, output, errors. Enables observability and retry metadata.

### 6.2 Feature Agents

| Agent | Model | Purpose | Edge Function |
|-------|-------|---------|---------------|
| **CRM Agent** | gemini-3-flash | Contact research, deal scoring, email drafts | `crm-agent` |
| **Investor Agent** | gemini-3-flash | Investor matching, fit scoring, outreach | `investor-agent` |
| **Task Agent** | gemini-3-flash | Task suggestions, breakdown, prioritization | `task-agent` |
| **Documents Agent** | gemini-3-flash | Document generation from templates | `documents-agent` |
| **Event Agent** | gemini-3-flash | Event matching, relevance scoring | `event-agent` |
| **Insights Generator** | gemini-3-flash | Health score analysis, daily focus | `insights-generator` |
| **Lean Coach** | gemini-3-flash | Canvas block suggestions, SWOT hints | `lean-coach` |
| **Pitch Deck Generator** | gemini-3-flash | Slide content generation | `pitch-deck-generator` |
| **Market Research** | gemini-3-flash | TAM/SAM/SOM, trends, competitor deep-dive | `market-research` |
| **AI Chat** | gemini-3-flash | Global context-aware advisor | `ai-chat` |
| **Follow-up Interviewer** | gemini-3-flash | Guided follow-up questions (8 topics) | `validator-followup` |

### 6.3 AI Tools

| Tool | Model | Purpose |
|------|-------|---------|
| Google Search | Gemini grounding | Real-time market data, competitor info |
| URL Context | Gemini grounding | Extract data from provided URLs |
| Vector Search (RAG) | text-embedding-3-small | Query 3,800+ startup knowledge chunks |
| Image Generation | gemini-3-pro-image | Pitch deck slide visuals |

### 6.4 Gemini Rules (Enforced)

| Rule | Implementation |
|------|---------------|
| G1: Guaranteed JSON | `responseJsonSchema` + `responseMimeType: "application/json"` on every call |
| G2: Temperature | Always 1.0 (lower causes Gemini 3 looping) |
| G4: API key | `x-goog-api-key` header (not query param) |
| Timeout | `Promise.race` with hard timeout (not `AbortSignal.timeout`) |
| JSON repair | 5-step `extractJSON`: direct parse, fence strip, balanced braces, truncated repair, array unwrap |

---

## 7. Data Model (Key Tables)

| Table | Purpose | Key Columns | RLS |
|-------|---------|-------------|-----|
| `startups` | Startup profile per org | name, industry, stage, description, deleted_at | org_id match |
| `validator_sessions` | Pipeline run tracking | startup_id, status, input_text, report_json | org_id match |
| `validator_messages` | Chat history for follow-up | session_id, role, content, extracted | org_id match |
| `lean_canvases` | 9-box canvas with versioning | startup_id, version, content (JSONB), is_current | org_id match |
| `assumptions` | Testable assumptions from canvas | canvas_id, statement, status, confidence, category, priority, evidence_count | org_id match |
| `experiments` | Validation experiments | assumption_id, method, hypothesis, success_criteria, result, status | org_id match |
| `contacts` | CRM contacts | name, email, company, type, lead_score, deleted_at | org_id match |
| `deals` | CRM deal pipeline | contact_id, stage, value, probability, deleted_at | org_id match |
| `pitch_decks` | Generated pitch decks | startup_id, slides (JSONB), source_report_id | org_id match |
| `projects` | Project portfolio | name, status, startup_id, deleted_at | org_id match |
| `tasks` | Task management | project_id, title, status, priority, ai_suggested, deleted_at | org_id match |
| `documents` | Document library | startup_id, title, content, template_type, deleted_at | org_id match |
| `events` | Startup events | title, date, type, location, url | public read, org write |
| `knowledge_chunks` | RAG knowledge base | content, embedding (vector), source, industry, metadata | service role |
| `decisions` | Decision log | startup_id, title, context, outcome, evidence_ids | org_id match |
| `weekly_reviews` | Weekly review snapshots | startup_id, week_start, metrics, focus_areas | org_id match |
| `ai_usage_limits` | AI cost tracking | org_id, period, usage_count, usage_tokens | org_id match |
| `interview_questions` | Onboarding interview Qs | industry, stage, question, order, is_active | service role |
| `shareable_links` | Public report sharing | resource_type, resource_id, token, expires_at | token match |
| `validator_agent_runs` | Per-agent per-attempt tracking (v3) | session_id, agent_name, attempt, status, output_json, duration_ms, error_message | org via session |

**Soft delete:** 6 tables use `deleted_at` column (startups, contacts, deals, documents, projects, tasks). RLS policies filter `deleted_at IS NULL`.

**Key counts:** 83 tables, 321 RLS policies, 516 indexes, 166 FKs, 90 triggers.

---

## 8. Module Specs (Per-Feature)

### 8.1 Validator Pipeline

**Goal:** Validate any startup idea in 60-120 seconds using 7 AI agents that research, score, and synthesize a comprehensive report.

**User flow:**
1. Founder describes idea in chat (or pastes URL)
2. Follow-up agent asks 4-7 targeted questions to build context
3. User clicks "Run Validation"
4. Pipeline streams progress: Extracting... Researching... Scoring... Composing...
5. 14-section report appears with overall score and GO/CAUTION/NO-GO verdict
6. User can export PDF, share link, or feed into lean canvas

**AI behavior:**
- Extractor parses free-text into structured profile (name, problem, customer, UVP, industry)
- Research uses Google Search + URL Context + RAG for market data with source citations
- Competitors finds 3-6 real competitors with features, pricing, and differentiation
- Scoring rates 7 dimensions (0-100 each) using thinking mode for reasoning
- Composer synthesizes all data into 14 sections with evidence-backed claims
- All new V2 sections (customer persona, competitive moat, GTM strategy, investor readiness) are optional — graceful degradation if data is insufficient

**Data written:**
- `validator_sessions` row with status progression (pending -> running -> completed/failed)
- `validator_messages` rows for follow-up chat
- `validator_sessions.report_json` stores complete report
- `startups` profile updated with extracted data

**Real-world example:** Founder types "P2P lending platform for gig workers." Follow-up asks: "Who's the primary borrower — drivers, freelancers, or all gig workers?" and "What's your lending model — peer-to-peer matching or pooled fund?" After 4 exchanges, pipeline runs: Research finds $3.4T gig economy, Competitors identifies Earnin/Dave/Branch, Scoring rates 68/100 (CONDITIONAL GO — regulatory risk HIGH), MVP suggests "Start with 1 gig platform API integration and 100 beta users."

**Acceptance checks:**
- [ ] Pipeline completes in < 150s for 95% of runs
- [ ] All 14 V1 sections present and non-empty
- [ ] Overall score in 40-90 range (not always high, not always low)
- [ ] At least 2 cited sources per research section
- [ ] Competitor section includes real companies (not hallucinated)
- [ ] Verifier reports `verified: true`
- [ ] `npm run build` passes with no TypeScript errors

---

### 8.2 Onboarding Wizard

**Goal:** Guide new founders through a 4-step setup that creates a structured startup profile with AI enrichment.

**User flow:**
1. Sign up with Google or LinkedIn OAuth
2. Step 1: Select industry (SaaS, FinTech, HealthTech, etc.) + describe idea
3. Step 2: AI analyzes industry, detects competitors, imports URL data if provided
4. Step 3: Answer 4-7 tailored questions (industry-specific)
5. Step 4: Review generated profile, confirm, land on dashboard

**AI behavior:**
- Industry detection triggers appropriate question set from `interview_questions` table
- URL import uses Gemini URL Context to extract company info
- Competitor detection runs lightweight search during Step 2
- Profile generation combines all inputs into structured startup record

**Data written:**
- `startups` row with full profile
- `organizations` row linking user to startup
- `profiles` row with user metadata
- `interview_questions` consumed (not written)

**Real-world example:** New founder selects "Restaurant Tech" + types "AI-powered inventory management." Step 2 detects Toast, MarketMan, BlueCart as competitors. Step 3 asks: "Are you targeting independent restaurants or chains?" "What's your pricing model?" "Do restaurants currently use any inventory software?" Step 4 shows generated profile with industry benchmarks.

**Acceptance checks:**
- [ ] Wizard completes in < 5 minutes for 90% of users
- [ ] All 4 steps reachable via back/forward navigation
- [ ] Industry-specific questions differ across at least 5 industries
- [ ] URL import extracts at least company name + description
- [ ] Generated profile has no empty required fields

---

### 8.3 Lean Canvas

**Goal:** Interactive 9-box business model canvas with AI coaching, auto-fill from validation, confidence scoring, and version history.

**User flow:**
1. After validation, canvas auto-fills from report (Problem, Customers, UVP, Solution, etc.)
2. Founder clicks any box to edit
3. AI Coach sidebar suggests improvements per block
4. Confidence badges show green/yellow/red per block
5. Versions auto-save; founder can compare v1 vs v4

**AI behavior:**
- Auto-fill maps: report.problem_clarity -> canvas.problem, report.customer_use_case -> canvas.customer_segments, report.competition -> canvas.unfair_advantage
- Coach observes which block is active and offers industry-specific suggestions
- Assumption extraction identifies testable claims from each block
- Confidence scoring based on: validated by experiment (green), stated but untested (yellow), missing (red)

**Data written:**
- `lean_canvases` row with JSONB content (9 blocks)
- `lean_canvases` version history (new row per save, `is_current` flag)
- `assumptions` extracted from canvas blocks

**Real-world example:** Restaurant founder's canvas auto-fills from validation: Problem = "Independent restaurants waste 30% of purchased food", Customer = "Restaurant owners with 1-3 locations", UVP = "AI inventory prediction reduces waste 40%". Coach suggests for Revenue: "Consider tiered pricing — $49/mo single location, $149/mo multi-location. Toast charges $69-$165/mo."

**Acceptance checks:**
- [ ] Auto-fill populates at least 5 of 9 canvas blocks from validation report
- [ ] Coach suggestions are industry-specific (not generic)
- [ ] Version comparison shows diffs between two versions
- [ ] Confidence badges render correctly (green/yellow/red)
- [ ] At least 3 assumptions auto-extracted from a well-filled canvas

---

### 8.4 CRM (Contacts + Deals + Investors)

**Goal:** Unified contact and deal tracking with AI enrichment, lead scoring, investor matching, and pipeline management.

**User flow:**
1. Add contacts manually or import CSV
2. AI enriches contacts with company data, role detection, lead scoring
3. Create deals linked to contacts, drag through pipeline stages
4. Investor pipeline: match investors by stage/industry, generate outreach emails
5. Track interactions and follow-ups

**AI behavior:**
- Lead scoring considers: pain score from interviews, budget authority, timeline urgency, engagement level
- Investor matching uses startup profile (industry, stage, raise amount) against investor database
- Email generation personalizes based on investor focus areas and founder's traction
- Deal probability auto-updates based on stage and interaction history

**Data written:**
- `contacts` rows with type (customer/investor/partner/mentor), lead_score
- `deals` rows with stage, value, probability
- `contact_interactions` log of emails, calls, meetings
- `investor_matches` with fit scores

**Real-world example:** Founder imports 20 customer interview contacts from CSV. AI scores Sarah Chen (Head of Ops, CloudKitchen) at 87/100 — high pain, budget authority, urgent timeline. For investor outreach, system matches Techstars Restaurant Cohort (92% fit) and generates: "Hi [name], I'm building AI inventory management for restaurants. Our pilot with 3 restaurants saved $2,100/month each in food waste..."

**Acceptance checks:**
- [ ] CSV import handles 100+ contacts without errors
- [ ] Lead scores are between 0-100 and correlate with engagement signals
- [ ] Investor matching returns 3-10 relevant matches
- [ ] Deal pipeline has at least 5 stages (Lead, Contacted, Interested, Negotiating, Won/Lost)
- [ ] Generated emails are personalized (not identical templates)

---

### 8.5 Pitch Deck

**Goal:** Generate investor pitch decks from validation data and lean canvas, with AI slide editing and visual generation.

**User flow:**
1. Click "Generate Pitch Deck" from canvas or report
2. 4-step wizard: Audience (angels/VCs/accelerators) -> Content (select sections) -> Style (tone/color) -> Generate
3. AI generates 10-12 slides with content from canvas + report
4. Edit individual slides with AI suggestions
5. Generate visuals (competitive landscape diagram, market size chart)
6. Export as PDF

**AI behavior:**
- Canvas-to-deck mapping: Problem -> Slide 2, Solution -> Slide 3, Market Size -> Slide 4, UVP -> Slide 5, Business Model -> Slide 6, Traction -> Slide 7, Team -> Slide 8, Ask -> Slide 9
- Audience selection changes emphasis: Angels (team + traction), VCs (market + growth), Accelerators (problem + learning)
- Image generation uses gemini-3-pro-image for slide visuals
- Slide editor offers per-slide suggestions ("Add a specific customer quote", "Include revenue projections")

**Data written:**
- `pitch_decks` row with slides JSONB array
- `pitch_decks.source_report_id` links to validation report
- Generated images stored in Supabase Storage

**Real-world example:** Restaurant founder selects "Angel Investors" audience. System generates: Cover (AI Restaurant Inventory), Problem (30% food waste), Solution (AI prediction), Market ($890B TAM, $2.3B SOM), Competition (2x2 matrix vs Toast/MarketMan), Traction (3 pilot restaurants, $6,300/mo savings), Team, Ask ($500K for 18 months).

**Acceptance checks:**
- [ ] Generated deck has 10-12 slides minimum
- [ ] No slide is empty or has placeholder text
- [ ] Content differs based on audience selection
- [ ] PDF export produces readable document
- [ ] Market data matches validation report (no contradictions)

---

### 8.6 Tasks

**Goal:** AI-prioritized task management tied to startup stage, experiments, and daily focus.

**User flow:**
1. Dashboard shows today's top 3 AI-suggested tasks
2. Full task board with Kanban columns (Backlog, This Sprint, In Progress, Done)
3. AI suggests new tasks based on stage, experiment results, canvas gaps
4. Tasks link to experiments, canvas blocks, and contacts

**AI behavior:**
- Task suggestions based on: startup stage (Idea/Validation/MVP/Traction/Fundraising), canvas completion, experiment status, time since last activity
- Priority scoring considers: impact on health score, urgency, dependency on other tasks
- Auto-breakdown: large tasks split into sub-tasks ("Run customer interviews" -> "Create interview script", "Find 10 prospects", "Schedule calls", "Synthesize findings")

**Data written:**
- `tasks` rows with title, status, priority, ai_suggested flag
- `tasks.project_id` links to project
- `tasks.experiment_id` links to experiment (if applicable)

**Real-world example:** Founder is in Validation stage, canvas confidence is low on Revenue block. AI suggests: "1. Interview 5 target customers about pricing (HIGH priority — revenue model untested). 2. Update lean canvas with interview findings. 3. Design a fake-door pricing test ($49 vs $99/mo)."

**Acceptance checks:**
- [ ] AI suggestions change based on startup stage
- [ ] Tasks have priorities (HIGH/MEDIUM/LOW) that make sense in context
- [ ] Kanban drag-and-drop updates status correctly
- [ ] Daily focus shows max 3 tasks (not overwhelming)
- [ ] Completed tasks mark linked experiments as tested

---

### 8.7 Documents

**Goal:** Generate startup documents from templates using canvas, report, and profile data.

**User flow:**
1. Browse document templates (Executive Summary, One-Pager, Investor Update, etc.)
2. Select template -> AI generates document from startup data
3. Edit generated document
4. Store in document library

**AI behavior:**
- Templates pull from: startup profile, lean canvas, validation report, recent metrics
- Executive Summary: 2-page overview for accelerator applications
- Investor Update: monthly email format with metrics, highlights, asks
- One-Pager: condensed pitch for networking events

**Data written:**
- `documents` rows with title, content, template_type
- Links to startup_id

**Real-world example:** Founder applying to Techstars needs Executive Summary. Clicks "Generate" -> AI pulls problem from canvas, market size from report, traction from experiments, team from profile -> produces 2-page doc: "FoodWaste AI helps independent restaurants reduce food waste 40% through AI-powered inventory prediction. Market: $2.3B SOM. Traction: 3 pilot customers saving $2,100/mo each."

**Acceptance checks:**
- [ ] At least 5 document templates available
- [ ] Generated documents are > 200 words and contextually relevant
- [ ] Document references real data from startup profile (not generic)
- [ ] Documents render correctly in viewer
- [ ] Export to PDF works

---

### 8.8 Dashboard (Command Centre)

**Goal:** Daily execution hub showing startup health, AI-generated priorities, stage guidance, and module progress.

**User flow:**
1. Land on dashboard after login
2. See: Health Score dial (6 dimensions), current stage badge, daily focus (top 3 tasks)
3. Quick action buttons: Run Validation, Update Canvas, Add Experiment, View Report
4. Module progress tracker: Canvas 80%, Validation Done, Experiments 2/5, Deck Not Started
5. AI panel shows proactive suggestions

**AI behavior:**
- Health Score computed from: team (profile completeness), product (canvas + experiments), market (research + competitors), traction (metrics), finance (revenue model), strategy (90-day plan)
- Daily Focus: AI selects 3 highest-impact tasks for today based on stage, gaps, and deadlines
- Stage guidance: "You're in Validation (Week 3). 4/8 assumptions tested. Next gate: 6/8 validated to advance to MVP"
- Proactive alerts: "Your competitor Toast just launched a new feature. Review competition section."

**Data written:**
- `dashboard_metrics` (cached health scores, updated daily)
- `weekly_reviews` (weekly snapshot)

**Real-world example:** Founder opens dashboard Monday morning. Health Score: 62/100 (Traction dragging at 23%). Daily Focus: "1. Follow up with 3 interview leads (overdue). 2. Update revenue model after pricing test. 3. Review Toast's new inventory feature." Stage badge: "Validation — Week 3 of 12."

**Acceptance checks:**
- [ ] Health score updates when canvas, experiments, or profile change
- [ ] Daily focus shows 3 relevant tasks (not random)
- [ ] Stage badge reflects actual progress (not hardcoded)
- [ ] Quick actions navigate to correct screens
- [ ] Dashboard loads in < 2 seconds

---

### 8.9 Events

**Goal:** Discover, create, and match startup events (demo days, meetups, conferences, accelerator deadlines).

**User flow:**
1. Browse public event directory with filters (type, date, location, price)
2. AI recommends events based on startup profile
3. View event detail with apply link, deadline, description
4. Create events (accelerators, organizers)

**AI behavior:**
- Event matching uses: startup industry, stage, location, interests
- Recommendations ranked by relevance score
- Deadline alerts for upcoming applications

**Data written:**
- `events` rows with title, date, type, location, url, description
- `event_registrations` (user -> event link)

**Real-world example:** Restaurant tech founder in Validation stage. AI recommends: "Techstars Restaurant Demo Day (Mar 20, 95% match), FoodTech Summit NYC (Apr 8, 82% match), YC Office Hours (ongoing, 78% match)."

**Acceptance checks:**
- [ ] Event list filters by type, date, location
- [ ] AI recommendations differ by industry
- [ ] Event detail page shows all required fields
- [ ] Deadline alerts fire for events < 7 days away
- [ ] Create event form validates required fields

---

### 8.10 AI Chat (Global Advisor)

**Goal:** Context-aware AI advisor that knows the founder's canvas, metrics, stage, and industry — gives specific, not generic, advice.

**User flow:**
1. Open chat from any screen (persistent sidebar or dedicated page)
2. Ask any startup question
3. AI responds with context from: startup profile, canvas, report, experiments, metrics, RAG knowledge
4. Follow-up questions maintain conversation history

**AI behavior:**
- Context assembly: pulls startup profile + canvas + recent experiments + health score + industry playbook before every response
- RAG retrieval: searches 3,800+ knowledge chunks for relevant benchmarks and best practices
- Proactive mode: AI can initiate suggestions (not just answer questions)
- Industry-specific: uses 8 playbooks (SaaS, Marketplace, FinTech, HealthTech, EdTech, E-commerce, AI/ML, Hardware) with industry-specific benchmarks and frameworks

**Data written:**
- `chat_messages` rows with role, content, context metadata
- RAG query logs for knowledge improvement

**Real-world example:** Founder asks: "Should I raise from angels or VCs?" AI responds with context: "Given your stage (Validation, Week 3), traction (3 pilot customers), and raise size ($500K), angels are your best path. Pre-seed SaaS rounds at your stage typically see $3-5M pre-money valuation. Comparable: Restaurant365 raised $2M seed from industry-focused angels before going to VCs."

**Acceptance checks:**
- [ ] Chat references startup-specific data (not generic)
- [ ] RAG retrieval returns relevant knowledge chunks
- [ ] Conversation history persists across sessions
- [ ] Response time < 5 seconds for typical queries
- [ ] Industry playbooks influence responses

---

### 8.11 Vector DB / RAG

**Goal:** Curated knowledge base with 3,800+ chunks covering startup frameworks, industry benchmarks, investor data, and best practices — powering AI Chat, Validator Research, and Coach suggestions.

**User flow:**
1. (Invisible to users — powers AI features behind the scenes)
2. Knowledge search exposed through AI Chat ("What's a good churn rate for B2B SaaS?")
3. Validator Research agent queries RAG for industry benchmarks
4. Lean Coach queries RAG for framework suggestions

**AI behavior:**
- Embedding: text-embedding-3-small (OpenAI) for vector generation
- Search: HNSW index on pgvector for fast nearest-neighbor lookup
- Source trust tiers: T1 Authority (Statista, PitchBook) > T2 Curated > T3 RAG > T4 Web > T5 AI inference
- 14 industry packs with benchmarks, unit economics, and stage-specific guidance
- 8 TypeScript playbooks: SaaS, Marketplace, FinTech, HealthTech, EdTech, E-commerce, AI/ML, Hardware

**Data written:**
- `knowledge_chunks` rows with content, embedding (vector), source, industry, metadata
- `knowledge_sources` tracking source quality and freshness

**Real-world example:** Validator Research agent processes "AI restaurant inventory." RAG returns: chunk from Statista showing $890B global restaurant tech market, chunk from industry report showing 30% average food waste, chunk from competitor analysis showing Toast's market share. These chunks get cited in the validation report.

**Acceptance checks:**
- [ ] Vector search returns relevant results for 90% of startup domain queries
- [ ] At least 3,000 knowledge chunks loaded
- [ ] Search latency < 500ms
- [ ] Source citations appear in validator reports
- [ ] Industry playbooks cover at least 8 industries

---

### 8.12 Market Research

**Goal:** AI-powered market research with TAM/SAM/SOM sizing, industry trends, and competitor grid — both as standalone screen and integrated into validator pipeline.

**User flow:**
1. Market Research Hub shows: TAM/SAM/SOM cards, industry trends, competitor grid
2. Data auto-populates from validation report (if exists)
3. Founder can trigger fresh research for specific topics
4. Competitor grid shows feature comparison matrix

**AI behavior:**
- Market sizing uses Google Search + RAG for real data points
- Trend analysis identifies growth drivers and risks
- Competitor grid populated from pipeline competitors agent
- Demand signals from search interest data (future: Google Trends integration)

**Data written:**
- Market data stored in `validator_sessions.report_json` (sections 4, 5)
- Competitor data in report section 5
- Standalone research queries logged

**Real-world example:** Hub shows for restaurant inventory AI: TAM $890B (global restaurant tech), SAM $45B (US restaurant management), SOM $2.3B (AI inventory specifically). Trends: "Cloud kitchen growth +340% since 2022", "Labor shortage driving automation." Competitor grid: Toast (POS + inventory, $25B), MarketMan (inventory only, $50M), BlueCart (ordering + inventory, $200M).

**Acceptance checks:**
- [ ] TAM/SAM/SOM cards show dollar amounts with sources
- [ ] At least 3 industry trends displayed
- [ ] Competitor grid shows 3-6 real companies
- [ ] Data matches validation report (no contradictions)
- [ ] Fresh research completes in < 30 seconds

---

## 9. Roadmap

### CORE (Weeks 1-3) — Production-Ready Baseline

| # | Task | Module | Effort | Goal |
|---|------|--------|--------|------|
| 1 | Validator V2: Enrich agent prompts with JTBD, Porter, Sequoia frameworks | Validator | S | +50% prompt richness |
| 2 | Validator V2: Customer Persona section (buyer/user, JTBD, triggers) | Validator | M | New section 15 |
| 3 | Validator V2: Competitive Moat section (Porter, Blue Ocean, 5 dimensions) | Validator | M | New section 16 |
| 4 | Validator V2: GTM Strategy section (channels, 90-day plan) | Validator | M | New section 17 |
| 5 | Validator V2: Investor Readiness section (Sequoia, fundability score) | Validator | M | New section 18 |
| 6 | Dashboard Command Centre: 3-panel redesign with AI panel | Dashboard | L | Health score + daily focus + proactive AI |
| 7 | Lean Canvas: Assumption extraction + experiment linking | Lean Canvas | M | Canvas -> testable hypotheses |
| 8 | CRM: Investor pipeline polish + outreach email generation | CRM | M | Investor matching + emails |
| 9 | SSE progress streaming for validator pipeline | Validator | M | Real-time agent progress |
| 10 | PDF export improvements (charts, formatting) | Validator | S | Shareable reports |
| 11 | Soft delete UI: filter `deleted_at IS NULL` in all list queries | Platform | S | No zombie data |
| 12 | Deploy `validator-flow` facade to production | Validator | S | Unified API endpoint |
| 13 | Health score recalculation on data changes | Dashboard | M | Real-time health |
| 14 | Daily focus card with AI prioritization | Dashboard | M | Top 3 daily tasks |

### MVP (Weeks 4-8) — Feature Completeness

| # | Task | Module | Effort |
|---|------|--------|--------|
| 15 | Experiments Lab: Full CRUD + experiment templates | Experiments | M |
| 16 | Market Research Hub: Standalone screen with fresh research trigger | Market Research | M |
| 17 | AI Chat: RAG-powered knowledge search + industry playbooks | AI Chat | L |
| 18 | 90-Day Plan: PDCA sprint cards with milestone tracking | Sprint Planning | M |
| 19 | Opportunity Canvas: 5-dimension scoring with radar chart | Opportunity Canvas | M |
| 20 | Business Readiness assessment screen | New Screen | M |
| 21 | Canvas-to-deck bridge: auto-populate pitch from canvas | Pitch Deck | M |
| 22 | Event matching: AI recommendations by profile | Events | S |
| 23 | Lean Canvas: AI Coach improvements with RAG-backed suggestions | Lean Canvas | M |
| 24 | V2 Frontend: 4 new report section components | Validator | M |
| 25 | Shareable links: public report/canvas sharing with token auth | Platform | M |
| 26 | Weekly review: automated snapshot + AI summary | Dashboard | M |
| 27 | AI usage tracking: per-org token/call limits | Platform | S |
| 28 | Decision log: decisions + evidence linking | Platform | M |
| 29-A | v3 Architecture: Agent Runs table + dual-write | Infrastructure | M |
| 30-A | v3 Architecture: Composer extraction to `validator-agent-compose` | Validator | M |
| 31-A | v3 Architecture: Research + Competitors isolated (parallel, 90s each) | Validator | M |
| 32-A | v3 Architecture: `validator-orchestrate` DAG dispatch + retry | Validator | L |

### ADVANCED (Weeks 9-14) — Differentiation

| # | Task | Module | Effort |
|---|------|--------|--------|
| 29 | Assessment tone selector (Brutal / Encouraging / Balanced) | Validator | S |
| 30 | Comparison mode: side-by-side idea validation | Validator | L |
| 31 | Coach personality modes (Mentor / Challenger / Analyst) | AI Chat | M |
| 32 | Validation board view (Assumption -> Method -> Result) | Experiments | L |
| 33 | SWOT/SOAR generation from canvas + competitors | Lean Canvas | M |
| 34 | Value Proposition Canvas (Jobs/Pains/Gains) | Lean Canvas | L |
| 35 | PMF Readiness Gate (Sean Ellis + retention curve) | Analytics | M |
| 36 | AARRR Metrics Dashboard | Analytics | L |
| 37 | Deck evaluator: AI scores pitch like an investor | Pitch Deck | M |
| 38 | Monetization optimizer: pricing suggestions from competitor data | Revenue | M |
| 39 | Customer journey map (awareness -> advocacy) | Analytics | L |
| 40 | Kanban board within sprint planning | Sprint Planning | M |
| 41-A | Validation Board: `board-extract` + `board-suggest` + `board-coach` agents | Experiments | L |

### PRODUCTION (Ongoing) — Scale + Polish

| # | Task | Module | Effort |
|---|------|--------|--------|
| 41 | Multi-tenant with team roles (admin/member/viewer) | Platform | L |
| 42 | Realtime collaboration (Supabase Realtime) | Platform | L |
| 43 | Webhook integrations (Slack, email, calendar) | Platform | M |
| 44 | Mobile-responsive layouts for all screens | Platform | L |
| 45 | GDPR export edge function | Security | M |
| 46 | Leaked password protection (Supabase Dashboard toggle) | Security | S |
| 47 | Vector extension migration to extensions schema | Infrastructure | S |
| 48 | Performance monitoring + error tracking | Infrastructure | M |
| 49 | Automated onboarding email sequence | Growth | M |
| 50 | Multi-canvas types (BMC, Value Prop Canvas) | Lean Canvas | L |
| 51 | Remotion motion infographics for reports | Pitch Deck | L |

---

## 10. Non-Goals

| # | What We Are NOT Building | Why |
|---|-------------------------|-----|
| 1 | Full accounting/bookkeeping | Founders use QuickBooks/Wave — we track metrics, not books |
| 2 | Legal document generation (contracts, terms) | Liability risk — refer to legal tools |
| 3 | Code generation or technical implementation | We plan, we don't code the startup's product |
| 4 | Social media management | Too many good tools exist (Buffer, Hootsuite) |
| 5 | Customer support ticketing | Not our domain — Intercom, Zendesk handle this |
| 6 | Marketplace for services | We advise, we don't broker services |
| 7 | Real-time video/audio collaboration | Zoom/Meet handles this — we do async |
| 8 | Custom ML model training | We use Gemini/Claude APIs — no custom training |

---

## 11. Acceptance Checks (Platform-Wide)

### Build + Deploy
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] `npm run lint` passes with zero warnings
- [ ] All 42 routes load without console errors
- [ ] All edge functions deploy with `verify_jwt: true`

### Security
- [ ] All tables have RLS policies with `TO authenticated` (not `TO public`)
- [ ] All edge functions verify JWT
- [ ] No API keys exposed in frontend code
- [ ] Soft-delete tables filter `deleted_at IS NULL` in RLS
- [ ] CORS restricted to allowed origins

### AI Quality
- [ ] Validator pipeline completes 3 different ideas in < 150s each
- [ ] Overall scores range 40-90 across different ideas (not clustered)
- [ ] Competitor sections reference real companies
- [ ] Market data includes source citations
- [ ] AI suggestions are industry-specific (not generic)

### Data Integrity
- [ ] All foreign keys have indexes
- [ ] `user_org_id()` uses `(SELECT auth.uid())` for performance
- [ ] Soft-delete tables work correctly (create, read, soft-delete, confirm hidden)
- [ ] RLS prevents cross-tenant data access

### UX
- [ ] All screens follow 3-panel layout (240px | flex | 320px)
- [ ] Loading states shown for all async operations
- [ ] Error states shown with retry options
- [ ] Mobile-responsive (minimum: readable, not broken)

---

## 12. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Composer exceeds 8192 tokens** | HIGH | Compress existing sections, monitor output tokens, test each V2 section addition |
| **Gemini API rate limits** | HIGH | Rate limiting per user (10 validations/hr), backoff + retry, cache research results |
| **Hallucinated competitors/data** | MEDIUM | Google Search grounding, source citations required, Verifier checks |
| **Old reports break on new frontend** | MEDIUM | All V2 fields optional, components use `?.` (optional chaining) |
| **Token costs escalate** | MEDIUM | AI usage tracking table, per-org limits, efficient prompts |
| **Slow pipeline (> 150s)** | MEDIUM | Background promises, parallel agents, 300s deadline with 400s wall-clock |
| **Single-tenant scaling** | LOW (for now) | Organizations table ready, RLS uses org_id, multi-tenant is PRODUCTION phase |
| **Knowledge base staleness** | LOW | Source freshness tracking, scheduled re-crawl (future) |

---

## 13. Open Questions (Max 5)

| # | Question | Impact | Options |
|---|----------|--------|---------|
| 1 | Should V2 sections be enabled by default or require a user toggle? | UX complexity | Default ON (graceful degradation if data insufficient) vs. Settings toggle |
| 2 | When do we add Stripe billing? | Revenue | MVP phase (after core features) vs. ADVANCED phase (after product-market fit signals) |
| 3 | Should AI Chat use Claude 4.6 for complex reasoning or stay on Gemini Flash? | Cost vs quality | Gemini Flash (fast, cheap) vs. Claude 4.6 (better reasoning, 5x cost) vs. Hybrid (detect complexity) |
| 4 | How deep should investor data go — public data only, or paid data sources? | Data quality | Public only (free, limited) vs. PitchBook/Crunchbase API (paid, comprehensive) |
| 5 | Should we support multi-startup per user (portfolio mode) before or after launch? | Scope | Before (useful for consultants/accelerators) vs. After (simpler first release) |

---

## Appendix A: Edge Functions Reference

### Current (v2 — Live)

| Function | Method | Purpose | Auth | Model |
|----------|--------|---------|------|-------|
| `validator-flow` | POST/GET | Unified validator facade (start + status) | JWT | — (proxy) |
| `validator-start` | POST | Start 7-agent monolith pipeline | JWT | gemini-3-flash |
| `validator-status` | GET | Poll pipeline status | JWT | — |
| `validator-followup` | POST | Guided follow-up questions | JWT | gemini-3-flash |
| `validator-panel-detail` | POST | Drill into report section | JWT | gemini-3-flash |
| `validator-regenerate` | POST | Re-run pipeline | JWT | — (proxy) |
| `onboarding-enrichment` | POST | AI profile enrichment | JWT | gemini-3-flash |
| `lean-coach` | POST | Canvas block suggestions | JWT | gemini-3-flash |
| `crm-agent` | POST | Contact research, deal scoring | JWT | gemini-3-flash |
| `investor-agent` | POST | Investor matching, outreach | JWT | gemini-3-flash |
| `task-agent` | POST | Task suggestions, breakdown | JWT | gemini-3-flash |
| `documents-agent` | POST | Document generation | JWT | gemini-3-flash |
| `event-agent` | POST | Event matching | JWT | gemini-3-flash |
| `insights-generator` | POST | Health score, daily focus | JWT | gemini-3-flash |
| `pitch-deck-generator` | POST | Slide content generation | JWT | gemini-3-flash |
| `pitch-deck-image` | POST | Slide visuals | JWT | gemini-3-pro-image |
| `market-research` | POST | TAM/SAM/SOM, trends | JWT | gemini-3-flash |
| `ai-chat` | POST | Global advisor | JWT | gemini-3-flash |
| `search-knowledge` | POST | RAG vector search | JWT | text-embedding-3-small |

### New (v3 — Orchestrated Architecture)

| Function | Method | Purpose | Auth | Model | Status |
|----------|--------|---------|------|-------|--------|
| `validator-orchestrate` | POST | DAG dispatch + retry + background pipeline | JWT | — | Planned |
| `validator-agent-extract` | POST | Parse startup profile from pitch | Service-role | gemini-3-flash | Planned |
| `validator-agent-research` | POST | Market sizing (Search + URL + RAG) | Service-role | gemini-3-flash | Planned |
| `validator-agent-competitors` | POST | Competitor analysis (Search + URL) | Service-role | gemini-3-flash | Planned |
| `validator-agent-score` | POST | 7-8 dimension scoring (thinking mode) | Service-role | gemini-3-flash | Planned |
| `validator-agent-mvp` | POST | MVP plan from scores + risks | Service-role | gemini-3-flash | Planned |
| `validator-agent-compose` | POST | 14-18 section report (8192 tokens) | Service-role | gemini-3-flash | Planned |
| `validator-board-extract` | POST | Extract assumptions from report | JWT | gemini-3-flash | Planned |
| `validator-board-suggest` | POST | Suggest experiments for assumptions | JWT | gemini-3-flash | Planned |
| `validator-board-coach` | POST | Next-action coaching from board state | JWT | gemini-3-flash | Planned |

**Strategy docs:** `lean/drafts/edge-functions/` (8 task specs + diagrams + audit)

### Build Order (Edge Functions)

```
Sprint 1 (CORE):  001-Smart Interview → 002-Context Passthrough, 007-Regenerate Cleanup
Sprint 2 (Infra): 003-Agent Runs Table
Sprint 3 (v3):    004-Composer Extraction → 005-Parallel Agents → 006-Orchestrator
Sprint 4 (Board): 008-Validation Board Agents
```

---

*See also: `lean/prompts/roadmap.md` (detailed roadmap), `lean/features.md` (75-feature map with scores), `lean/validator/prd-validator.md` (ThinkTank V2 PRD), `lean/validator/TT-000-index.md` (V2 spec index)*
