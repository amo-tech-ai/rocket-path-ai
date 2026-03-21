# AI Product Requirements Document (AI-PRD)
# Lean Hybrid System — Chat, Wizards, Dashboards

> **Version:** 1.0 | **Status:** Draft | **Date:** 2026-02-10
> **Sources:** `lean/docs/lean-system/`, `lean/docs/ideas/`, `lean/wireframes/core/`, `lean/repos/11-leana-features.md`, `lean/prompts/prd-startupAI.md`
> **Operating model:** AI proposes → Human approves → System writes

---

## 1. Approvals

| Role | Owner | Reviewed | Status |
|------|-------|----------|--------|
| Product | TBD | — | Pending |
| Engineering | TBD | — | Pending |
| Design / UX | TBD | — | Pending |
| Legal / Compliance | TBD | — | Pending |
| AI / ML Owner | TBD | — | Pending |

---

## 2. Abstract

**What:** The Lean Hybrid System is an AI-powered operating system that unifies chat, wizards, and dashboards. It combines Lean Startup frameworks (Lean Canvas, Customer Journey, Story Mapping, Now-Next-Later roadmaps, 90-day sprints) with AI agents that guide founders through structured workflows.

**Why:** Traditional lean tools are disconnected. Founders switch between spreadsheets, canvases, and tools. The hybrid system provides one coherent flow: chat intake → wizard-guided setup → dashboard execution.

**Problem:** 94% of companies say journey maps help; only 47% have processes. Timeline roadmaps create deadline stress. Features get prioritized by dates, not learning.

**For whom:** Pre-seed to Series A founders, accelerators, innovation teams, startup consultants.

---

## 3. Business Objectives

| Objective | Description |
|-----------|-------------|
| **Primary** | Reduce time from idea to validated customer by 70% |
| **Strategic** | Become the default validation and planning platform for accelerators |
| **Vision** | "Validate and grow" — replace "build and hope" with evidence-driven execution |

**How this supports company vision:**
- StartupAI positions as AI-powered OS for founders
- Lean Hybrid System is the planning and execution layer between Validator and Fundraising
- Recurring engagement: founders return daily for dashboard, weekly for canvas/sprint updates

---

## 4. KPIs

| Goal | Metric | Question |
|------|--------|----------|
| **Adoption** | New signups / cohort starts | How many founders start using Lean Hybrid per month? |
| **Retention** | D7, D30 return rate | Are founders coming back after first session? |
| **Engagement** | Sessions/week, canvas edits, sprint logins | Do founders use wizards and dashboards actively? |
| **Revenue / cost savings** | Time to first validation (days), PMF rate | Does the system shorten validation cycles? |

---

## 5. Success Criteria

| Criteria | Target | Type |
|----------|--------|------|
| Journey map completion by STRATEGY stage | 90% | Quantitative |
| Story map usage for prioritization | 80% | Quantitative |
| Deadline-free roadmaps | 100% adoption | Quantitative |
| Learning sprint success (achieve goal) | 70% | Quantitative |
| Time to first canvas from wizard | < 10 min | Quantitative |
| User trust in AI suggestions | > 7/10 rating | Qualitative |
| Clarity of AI outputs | Citations, confidence scores visible | Qualitative |

---

## 6. User Journeys

| Persona | Entry point | End goal |
|---------|-------------|----------|
| **Solo founder** | Chat or onboarding wizard | Complete lean canvas, run first experiment |
| **Early-stage team** | Dashboard or canvas | Aligned roadmap, shared sprint |
| **Accelerator cohort** | Invite link, template | Standardized canvases, comparable data |
| **First-time founder** | Wizard + chat | Learn frameworks while filling |
| **Consultant** | Client project | Repeatable discovery for multiple startups |

---

## 7. Scenarios

### Happy path
1. Founder signs up → onboarding wizard (4–7 questions) → AI analyzes → profile created
2. Founder opens Lean Canvas → gap questions for empty boxes → AI generates draft → founder edits with per-block suggestions
3. Founder opens Dashboard → sees stage, health score, Now-Next-Later summary → clicks "Run experiment" → task created
4. Founder completes sprint retro → AI suggests next learning goal → sprint logged

### Edge cases
- Founder skips wizard → canvas loads blank, AI asks gap questions
- Founder goes off-topic in chat → AI redirects: "Let's focus on your business model"
- Founder claims "Scale" but has 15% churn → system shows warning, suggests "Traction"

### Failure handling
- AI timeout → show partial result + retry option
- Invalid JSON from agent → extractJSON repair (5-step fallback)
- Pipeline failure → show error message + support link; session saved for retry

---

## 8. User Flow

```
[Chat Intake / Idea] → [Onboarding Wizard] → [Profile Created]
        ↓                      ↓                      ↓
[Validator Run]  ←→  [Lean Canvas]  ←→  [90-Day Plan / Sprint]
        ↓                      ↓                      ↓
[Validator Report]    [Dashboard]      [Experiments / Tasks]
        ↓                      ↓                      ↓
[Export / Share]      [Now-Next-Later] [Learning Log]
```

**UI → AI → System → User loop:**
1. User interacts (chat, wizard step, canvas edit)
2. UI sends context to edge function
3. AI generates structured output (JSON)
4. System validates, persists (Supabase)
5. User sees result, approves or edits

---

## 9. AI User Experience

| Element | Specification |
|---------|----------------|
| **Output format** | JSON (all agents), text for chat; charts for dashboard |
| **Explainability** | Confidence score per canvas box; "Explain scores" button on report |
| **Citations** | Validator report links to sources (Google Search, URL Context, RAG) |
| **Human-in-the-loop** | No AI write without user approval; "Add +" to insert suggestion |
| **Feedback actions** | Criticize / Praise / Clarity (from ai-sparring-partner-v8 pattern) |

---

## 10. Functional Requirements

### 10.1 Chat

| # | User Story | Expected Behavior | AI Responsibilities | UI Surface |
|---|------------|-------------------|---------------------|------------|
| C1 | As a founder, I want to describe my idea in chat so the system extracts a profile | Chat accepts free text; system parses problem, customers, solution | Extractor agent: structured output; handles greetings, redirects off-topic | Chat panel (right or full-width) |
| C2 | As a founder, I want Socratic questions so I think deeper | AI asks 1–3 contextual questions before generating | Socratic Mentor style; probes numbers, evidence | Same chat |
| C3 | As a founder, I want per-block chat on canvas | Click ✨ on block → chat opens for that block only | Box Advisor: suggestions for that block; ≤18 words bullets | Lean Canvas right panel |

### 10.2 Wizards

| # | User Story | Expected Behavior | AI Responsibilities | UI Surface |
|---|------------|-------------------|---------------------|------------|
| W1 | As a founder, I want onboarding to ask only what's needed | 4–7 industry-specific questions | Industry Expert Agent; gap detection from profile | Onboarding steps 1–4 |
| W2 | As a founder, I want gap questions before canvas generation | Only asks about LOW-coverage boxes | Gap Analyst: 2–5 questions max | Pre-canvas flow |
| W3 | As a founder, I want AI to prefill canvas from profile + answers | Full 9-box draft with confidence per box | Canvas Generator: structured output | Lean Canvas first visit |

### 10.3 Dashboards

| # | User Story | Expected Behavior | AI Responsibilities | UI Surface |
|---|------------|-------------------|---------------------|------------|
| D1 | As a founder, I want a 3-panel layout on every screen | Left: context; Center: work; Right: AI | — | All Lean screens |
| D2 | As a founder, I want stage progress and health score on dashboard | Header shows stage, gate checklist, health % | Task Orchestrator: summarize progress | FounderDashboard |
| D3 | As a founder, I want Criticize / Praise / Clarity on report | 3 buttons produce tone-specific section updates | Feedback modes (Brutal / Encouraging / Explain) | Validator Report |
| D4 | As a founder, I want a "Connections" graph view | Persona → Problem → Solution → Assumptions | Knowledge Graph from Extractor output | Optional report tab |

---

## 11. Agent Types & Workflows

### 11.1 Agent Catalog

| Agent | Model | Purpose | Workflow | Screens |
|-------|-------|---------|----------|---------|
| **Task Orchestrator** | gemini-3-flash | Coordinate workflows, gates, next actions | check_gate, recommend_next | FounderDashboard |
| **Lean Canvas Agent** | gemini-3-pro | Generate, refine, validate canvas | generate, refine, validate, benchmark | LeanCanvas |
| **Customer Journey Agent** | gemini-3-pro | Map journey, find gaps | map, analyze_touchpoints, find_gaps | CustomerJourney |
| **Customer Forces Agent** | gemini-3-pro | Map forces, JTBD | map_forces, analyze_jtbd | CustomerCanvas |
| **Story Mapping Agent** | gemini-3-flash | Create backbone, prioritize stories | create_backbone, add_stories, identify_mvp | StoryMap |
| **Roadmap Agent** | gemini-3-pro | Now-Next-Later, stakeholder views | prioritize, generate_view | NowNextLater |
| **Sprint Coach Agent** | gemini-3-flash | 90-day sprints, learning goals | plan_90day, track_learning, retrospect | LeanSprint |
| **Risk Detector** | gemini-3-flash | Surface risks, score assumptions | detect_risks, score_risk, prioritize | RiskBoard |
| **Experiment Designer** | claude-sonnet-4-5 | Design validation tests | design, analyze, conclude | ExperimentLab |
| **PMF Assessor** | claude-sonnet-4-5 | PMF measurement | assess, analyze_survey | AnalyticsDashboard, PMFChecker |
| **Decision Advisor** | claude-opus-4-6 | Strategic decisions, pivots | analyze, recommend_pivot | DecisionLog |
| **Socratic Mentor** | gemini-3-flash | Ask clarifying questions, refuse shallow answers | One question at a time; redirect off-topic | Canvas right panel |
| **Canvas Composer** | gemini-3-flash | Chat insights → block text | Convert suggestions to ≤18-word bullets | LeanCanvas |
| **Backend Router** | — | Choose model per task | Gemini/OpenAI/Ollama by cost/latency | Edge function layer |

### 11.2 Workflow Types

| Workflow | Pattern | Example |
|----------|---------|---------|
| **Sequential wizard** | Step 1 → Step 2 → ... → Done | Onboarding, gap questions |
| **Chat-driven** | User message → AI response → User approval | Socratic Mentor, per-block chat |
| **Background pipeline** | Extractor → [Research + Competitors] → Score → Composer → Verifier | Validator |
| **Event-triggered** | Canvas save → Assumption extraction → Risk scoring | Lean Canvas → Risk Board |
| **Synchronous single-call** | One prompt → structured output | Canvas prefill, box suggest |

---

## 12. Model Requirements

| Specification | Requirement | Rationale |
|---------------|-------------|-----------|
| **Open vs closed** | Closed (Gemini, Claude) | StartupAI standard; no fine-tuning resources |
| **Context window** | 128K+ for Composer | 14–18 section report; upstream agent outputs |
| **Latency** | p50 < 5s for single-call; pipeline < 120s | Real-time chat; acceptable for full validation |
| **Modalities** | Text primary; Image for pitch deck | Gemini 3 Pro Image for slide visuals |
| **Fine-tuning** | Not required | Prompt engineering + RAG sufficient |
| **Fallback models** | gemini-3-flash → gemini-3-pro for quality | Cost vs quality trade-off |

---

## 13. Data Requirements

| Requirement | Specification |
|-------------|---------------|
| **Data sources** | `startups`, `validator_sessions`, `lean_canvases`, `assumptions`, `experiments`, `customer_journeys`, `story_maps`, `roadmap_initiatives`, `lean_sprints` |
| **RAG vs fine-tuning** | RAG (3,800+ chunks); no fine-tuning |
| **Data volume** | ~10–50KB per session context |
| **Update frequency** | Real-time on save; batch for analytics |
| **Data prep** | JSON schema validation; extractJSON repair |
| **Provenance** | `validator_agent_runs` tracks per-agent output; report links to sources |

---

## 14. Prompt Requirements

| Requirement | Specification |
|--------------|---------------|
| **Guardrails** | Refuse off-topic; redirect to Lean Canvas; no financial/legal advice |
| **Tone** | YC-caliber coach: direct, evidence-based, Socratic when appropriate |
| **Role** | "You are a lean startup validation expert with experience in [industry]" |
| **Structured output** | G1: `responseJsonSchema` + `responseMimeType` on every LLM call |
| **Accuracy targets** | 85%+ correct extraction; <5% hallucination on facts |

---

## 15. Evaluation Spec (Testing & Measurement)

| Method | Purpose |
|--------|---------|
| **Golden dataset** | 20 sample ideas + expected canvas/validator outputs |
| **Human evals** | 3 annotators score: completeness, relevance, clarity |
| **LLM-as-judge** | Gemini scores output against rubric (0–10) |
| **Automated checks** | JSON validity, required fields present, no PII in logs |
| **A/B tests** | Socratic vs one-shot canvas generation; Criticize vs Neutral tone |

---

## 16. Eval Gates (Risks & Mitigations)

| Gate | Type | Criteria |
|------|------|----------|
| **JSON validity** | Hard | All agent outputs parse; extractJSON success |
| **No PII in prompts** | Hard | Audit logs; no email/name in system prompts |
| **Pipeline timeout** | Soft | 300s cap; PM sign-off if >5% timeouts |
| **Hallucination rate** | Soft | <5% false facts in validator report |
| **User satisfaction** | Soft | >7/10 on AI helpfulness survey |

**Failure taxonomy:** Timeout | Invalid JSON | Empty output | Off-topic response | Safety refusal

**Severity vs frequency:** High severity + High frequency = block release; Low + Low = monitor only

---

## 17. AI Costs & Latency

| Item | Estimate |
|------|----------|
| **Token cost** | ~$0.01–0.05 per canvas generation; ~$0.10–0.20 per full validator run |
| **Infra** | Supabase Edge Functions; Vercel hosting |
| **p50 latency** | Single-call: 2–5s; Pipeline: 60–90s |
| **p95 latency** | Single-call: 10s; Pipeline: 120s |
| **Cost controls** | Per-org monthly quota; rate limit on validator; flash for fast ops, pro for analysis |

---

## 18. Assumptions & Dependencies

| Assumption | Validation |
|------------|------------|
| Founders will complete wizard if < 10 min | User testing |
| Gemini/Claude APIs remain available | Vendor SLA |
| Supabase RLS sufficient for multi-tenant | Security review |
| 3-panel layout suits all screens | Design review |

**External dependencies:** Google AI (Gemini), Anthropic (Claude), Supabase, Vercel

**Vendor risks:** API price increases; rate limits; model deprecation

---

## 19. Compliance / Privacy / Legal

| Area | Specification |
|------|---------------|
| **PII handling** | No PII in prompts; email/name in DB only; RLS enforces org isolation |
| **GDPR / SOC2** | Data export; deletion on request; audit logs |
| **Data retention** | Sessions 90 days; exports on demand |
| **Auditability** | `validator_agent_runs`, `prompt_execution_log` track inputs/outputs |

---

## 20. GTM / Rollout Plan

| Milestone | Scope | Timeline |
|-----------|-------|----------|
| **M1** | Lean Canvas + Socratic chat + gap wizard | Weeks 1–4 |
| **M2** | Dashboard redesign + Criticize/Praise/Clarity | Weeks 5–8 |
| **M3** | Connections graph + Knowledge Graph view | Weeks 9–10 |
| **M4** | Beta with 10 accelerator cohorts | Weeks 11–12 |
| **M5** | Phased rollout; feedback loops | Weeks 13+ |

**Beta strategy:** Invite-only; 2 cohorts of 20 founders; weekly feedback calls

**Feedback loops:** In-app rating; weekly usage analytics; support channel

---

## 21. Wireframes & Screen Inventory

All wireframes live in `lean/wireframes/core/`. Each screen answers a specific question and flows data to/from others.

### 21.1 Screen Catalog (by flow order)

| # | Screen | Route | Status | Question | Type |
|---|--------|-------|--------|----------|------|
| 01 | **Chat Intake** | `/chat-intake` | BUILT | What are you building and why? | Chat |
| 02 | **Startup Profile** | `/startup-profile` | BUILT | What's the baseline context? | Wizard |
| 03 | **Validator Report** | `/validator/report/:id` | BUILT | Should I build this? What are the risks? | Report |
| 04 | **Lean Canvas** | `/lean-canvas` | BUILT | What's my business model? | Canvas |
| 04b | **Validation Board (Risk & Assumption)** | `/validate/canvas` | PLANNED | What am I testing? Next experiment? | Canvas |
| 05 | **90-Day Plan** | `/90-day-plan` | BUILT | What should I work on, in what order? | Dashboard |
| 05b | **Chat v2** (depth, extraction preview) | `/validator` | PLANNED | Same as 01, with depth bars + industry badge | Chat |
| 06 | **Command Centre (Dashboard)** | `/dashboard` | BUILT | Founder journey, health, risks, next actions | Dashboard |
| 06b | **Report v2** (confidence, provenance) | `/validator/report/:id` | PLANNED | Same as 03, with confidence badges + disclaimers | Report |
| 09 | **Opportunity Canvas** | `/opportunity-canvas` | BUILT | How will users actually adopt this? | Canvas |
| 10 | **Business Readiness** | `/readiness` | NEW | Are we ready to show this to real users? | Checklist |
| 11 | **Outcomes Dashboard** | `/analytics` | PARTIAL | Is this actually worth continuing? | Dashboard |
| 14 | **Strategic Knowledge Map** | `/knowledge-map` | NEW | What must we be right about to win? | Map |
| 23 | **Value Proposition Canvas** | `/opportunity-canvas` (tab) | NEW | Does our product truly address customer needs? | Canvas |
| 38 | **Investment Readiness Level (IRL)** | `/readiness` or `/irl-gauge` | NEW | Where am I on the path to investor readiness? | Gauge |
| 42 | **AI Readiness Canvas** | `/ai-readiness` | NEW | Are we ready to implement AI initiatives? | Canvas |

### 21.2 Wireframe → Lean Hybrid Mapping

| Lean Hybrid Component | Wireframes |
|-----------------------|------------|
| **Chat** | 01 Chat Intake, 05b Chat v2 |
| **Wizards** | 02 Startup Profile (post-chat), onboarding steps |
| **Dashboards** | 06 Command Centre, 05 90-Day Plan, 11 Outcomes Dashboard |
| **Canvases** | 04 Lean Canvas, 04b Validation Board, 09 Opportunity, 23 Value Proposition, 42 AI Readiness |
| **Reports** | 03 Validator Report, 06b Report v2 |
| **Readiness / Gates** | 10 Business Readiness, 38 IRL |

### 21.3 Data Flow (wireframe connections)

```
[01 Chat Intake] ──► [02 Startup Profile] ──► [03 Validator Report]
       │                      │                        │
       │                      │                        ▼
       │                      │               [04 Lean Canvas] ◄──► [04b Validation Board]
       │                      │                        │
       │                      │                        ▼
       │                      │               [09 Opportunity Canvas] ◄──► [23 Value Prop]
       │                      │                        │
       │                      ▼                        ▼
       │               [06 Command Centre] ◄── [05 90-Day Plan]
       │                      │
       │                      ├──► [10 Business Readiness] ──► [11 Outcomes Dashboard]
       │                      │
       │                      ├──► [14 Knowledge Map]
       │                      │
       │                      └──► [38 IRL] ──► [42 AI Readiness Canvas]
       │
       └──► [05b Chat v2] (depth tracking, extraction preview)
```

### 21.4 Per-Screen Wireframe Reference

| Screen | Wireframe File | Key Features |
|--------|----------------|--------------|
| Chat Intake | `01-chat-intake.md` | 3-panel; extraction status bars; confidence 60% gate; Socratic follow-ups |
| Startup Profile | `02-startup-profile.md` | Completeness score; smart suggestions; URL import |
| Validator Report | `03-validator-report.md` | 7 agents; 14 sections; BUILD/PIVOT/DON'T BUILD; Create Lean Canvas CTA |
| Lean Canvas | `04-lean-canvas.md` | 11 sections; AI Coach per block; auto-save; completion tracker |
| Validation Board | `04-validate-canvas.md` | Current bet; assumptions; riskiest; experiment; pivot log; stage gates |
| 90-Day Plan | `05-90-day-plan.md` | 5-column Kanban; 24 cards; 6 sprints; Card Generator Agent |
| Chat v2 | `05-chat-v2.md` | 8 depth bars; extraction preview; industry badge; skip to generate |
| Command Centre | `06-dashboard.md` | 9 centre cards; 5 right sections; journey stepper; health score; smart suggestions |
| Report v2 | `06-report-v2.md` | Confidence badges (Data-Backed/Inferred/AI Suggestion); dimension breakdown; provenance; Start Validating CTA |
| Opportunity Canvas | `09-opportunity-canvas.md` | 10 sections; AI Risk Analysis (top 5); import from Lean Canvas |
| Business Readiness | `10-business-readiness.md` | Trust, Reliability, Cost, Support; GREEN/YELLOW/RED launch verdict |
| Outcomes Dashboard | `11-outcomes-dashboard.md` | ROI mirage detector; false progress detector; Double down/Adjust/Stop |
| Knowledge Map | `14-knowledge-map.md` | Market/Customer/Competition/Execution/Decision truth; confidence per area |
| Value Proposition Canvas | `23-value-proposition-canvas.md` | 6-box (Jobs, Pains, Gains | Products, Relievers, Creators); fit score |
| IRL | `38-investment-readiness-level.md` | 9-level pyramid; LOW/MED/HIGH tier; dimension breakdown |
| AI Readiness Canvas | `42-ai-readiness-canvas.md` | 9-box (Why/How/What); ✨ per box → AI suggestions panel |

### 21.5 Agents by Wireframe

| Wireframe | Agents |
|-----------|--------|
| Chat Intake | Intake Agent (extractor) |
| Startup Profile | Profile Agent (completeness, suggestions) |
| Validator Report | 7-agent pipeline (Market, Competition, Pricing, Team, Risk, Timing, GTM) |
| Lean Canvas | Canvas Coach Agent |
| Validation Board | Assumption Extractor, Experiment Suggester, Coach, Bias Nudge |
| 90-Day Plan | Card Generator Agent |
| Chat v2 | Same as 01 + depth/coverage |
| Command Centre | Health Scorer, Action Recommender, Smart Suggestions |
| Report v2 | Same pipeline + confidence/provenance |
| Opportunity Canvas | Opportunity Analyst (risk identification) |
| Business Readiness | Go-To-Market Advisor |
| Outcomes Dashboard | Founder ROI Coach |
| Knowledge Map | Strategy Knowledge Advisor |
| Value Proposition | Opportunity Analyst (extended) |
| IRL | IRL calculator + recommendations |
| AI Readiness | Per-box AI suggestions |

---

## Optional (Advanced AI Products)

| Feature | When to Use |
|---------|-------------|
| **AI confidence tiers** | Show HIGH/MED/LOW per canvas box |
| **Model drift monitoring** | Track output quality over time |
| **Bias & fairness audits** | Industry representation in suggestions |
| **Versioned prompts** | A/B test prompt variants |
| **Cost-performance dashboards** | Token usage by org, by agent |

---

## One-Line Rule

> **If a normal PRD answers *what* and *why*, an AI-PRD must also answer *how safe, how correct, how fast, and how expensive*.**

---

## References

**Lean System**
- `lean/docs/lean-system/03-lean-system.md` — Hybrid system spec
- `lean/docs/lean-system/01-lean-system-plan.md` — Implementation plan
- `lean/docs/lean-system/02-lean-canvas-strategy.md` — Canvas strategy
- `lean/repos/11-leana-features.md` — Lean AI repo features to adapt
- `lean/prompts/prd-startupAI.md` — Product PRD
- `prd.md` — Main product spec

**Wireframes** (`lean/wireframes/core/`)
- `01-chat-intake.md` | `02-startup-profile.md` | `03-validator-report.md`
- `04-lean-canvas.md` | `04-validate-canvas.md` | `05-90-day-plan.md` | `05-chat-v2.md`
- `06-dashboard.md` | `06-report-v2.md` | `09-opportunity-canvas.md`
- `10-business-readiness.md` | `11-outcomes-dashboard.md` | `14-knowledge-map.md`
- `23-value-proposition-canvas.md` | `38-investment-readiness-level.md` | `42-ai-readiness-canvas.md`
