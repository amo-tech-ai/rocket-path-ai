# StartupAI Product Requirements Document v5.0

> **Updated:** 2026-02-02 | **Version:** 5.0 (Unified)
> **Status:** Strategic Foundation Complete

---

## 1. Executive Summary

**StartupAI** is an AI-powered operating system that guides founders through the complete startup lifecycle—from raw idea to fundable company. Built on Lean Startup methodology with validation-first philosophy, it prevents the #1 startup killer: building something nobody wants.

### Mission
Transform any founder into a systematic entrepreneur using AI-guided validation, industry-specific playbooks, and intelligent automation.

### Core Value Proposition
> "Stop guessing. Start validating. Build what people actually want."

### Key Differentiators
1. **10-Stage Lifecycle System** — Stage-gated guidance from Idea to Maturity
2. **13 Industry Playbooks** — Pre-configured frameworks for each vertical
3. **Atlas AI Advisor** — Context-aware chatbot with deep startup expertise
4. **Validation Lab** — Experiment-driven assumption testing
5. **Prompt Pack System** — 28-step guided workflows for every phase

---

## 2. System Architecture Overview

### 2.1 Architecture Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE LAYER                         │
│   Onboarding → Dashboard → Canvas → Validation → Pitch → CRM        │
├─────────────────────────────────────────────────────────────────────┤
│                         AI ORCHESTRATION LAYER                       │
│   Atlas Chatbot → 15 Specialized Agents → Prompt Packs → Playbooks  │
├─────────────────────────────────────────────────────────────────────┤
│                         KNOWLEDGE LAYER                              │
│   Master System Prompt → Industry Knowledge → Stage Context → History│
├─────────────────────────────────────────────────────────────────────┤
│                         DATA LAYER                                   │
│   Supabase PostgreSQL → RLS → Edge Functions → Real-time Sync       │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite 5 + Tailwind + shadcn/ui |
| Backend | Supabase (PostgreSQL + RLS + Edge Functions) |
| AI Primary | Gemini 3 (`gemini-3-flash-preview`, `gemini-3-pro-preview`) |
| AI Reasoning | Claude 4.5 Sonnet (`claude-sonnet-4-5-20250929`) |
| Auth | OAuth (Google + LinkedIn) via Supabase |

---

## 3. Startup Lifecycle System

### 3.1 The 10 Stages

| # | Stage | Focus | Duration | Gate Criteria |
|---|-------|-------|----------|---------------|
| 1 | **Idea** | Problem Discovery | 1-2 weeks | 10+ interviews, 60% critical |
| 2 | **Market Discovery** | Customer Segments | 2-3 weeks | ICP defined, 3 segments tested |
| 3 | **Strategy** | Business Model | 1-2 weeks | Lean Canvas complete |
| 4 | **Problem-Solution Fit** | Validation | 4-6 weeks | 100+ signups or 10+ LOIs |
| 5 | **MVP Development** | Build Minimum Product | 4-8 weeks | MVP live with users |
| 6 | **Go-to-Market** | Launch Strategy | 2-4 weeks | Channel validated |
| 7 | **Traction** | Growth Metrics | 8-12 weeks | 40%+ PMF score |
| 8 | **Scale** | Systematic Growth | Ongoing | $1M+ ARR trajectory |
| 9 | **Fundraising** | Investor Relations | 8-12 weeks | Term sheet or funded |
| 10 | **Maturity** | Optimization | Ongoing | Sustainable unit economics |

### 3.2 Stage Gate System

Features unlock progressively based on validated progress:

```typescript
const STAGE_FEATURES = {
  'idea': ['lean_canvas', 'problem_interviews', 'competitor_research'],
  'market_discovery': [..., 'customer_segments', 'persona_builder'],
  'strategy': [..., 'business_model', 'pricing_experiments'],
  'psf': [..., 'validation_lab', 'landing_pages', 'mvp_scope'],
  'mvp': [..., 'sprint_planning', 'feature_prioritization'],
  'gtm': [..., 'channel_testing', 'messaging_experiments'],
  'traction': [..., 'pmf_survey', 'cohort_analysis', 'metrics_dashboard'],
  'scale': [..., 'fundraising_tools', 'pitch_deck_advanced'],
  'fundraising': [..., 'investor_crm', 'due_diligence', 'term_sheets'],
  'maturity': ['*'] // All features unlocked
};
```

---

## 4. Onboarding System

### 4.1 Progressive Onboarding Flow

```
Step 1: Account Creation
  ├── OAuth (Google/LinkedIn)
  ├── Basic profile
  └── Industry selection

Step 2: Website Analysis (if provided)
  ├── Firecrawl extraction
  ├── AI analysis → company insights
  └── Auto-populate startup profile

Step 3: Business Basics
  ├── Company name, description
  ├── Industry vertical
  ├── Target customers
  └── Business model type

Step 4: Stage Assessment
  ├── Progress indicators
  ├── Traction metrics
  ├── Team composition
  └── → Auto-detect stage

Step 5: Goals & Priorities
  ├── Primary objectives
  ├── 90-day goals
  └── Funding status

Step 6: Playbook Assignment
  ├── Match industry → playbook
  ├── Load relevant prompt packs
  └── Configure Atlas AI context
```

### 4.2 AI-Powered Extraction

The onboarding agent extracts and infers:
- Company information from website
- Industry classification
- Business model type
- Stage indicators
- Key competitors
- Market positioning

---

## 5. Lean Canvas System

### 5.1 The 9 Blocks

| Block | Description | Validation Method |
|-------|-------------|-------------------|
| Problem | Top 3 problems (ranked) | Customer interviews |
| Customer Segments | Early adopters (psychographic) | Segment testing |
| Unique Value Proposition | Single headline ≤120 chars | Landing page A/B |
| Solution | Top 3 MVP features | Concierge/Wizard tests |
| Channels | How to reach early adopters | Channel experiments |
| Revenue Streams | Pricing model | Price sensitivity tests |
| Cost Structure | CAC, operations, team | Financial modeling |
| Key Metrics | 3-5 outcome metrics | Dashboard tracking |
| Unfair Advantage | What can't be copied | Competitive analysis |

### 5.2 Canvas AI Features

1. **Smart Completion** — AI suggests content based on context
2. **Assumption Extraction** — Auto-detect testable assumptions
3. **Bias Detection** — Flag solution-first thinking
4. **Weekly Review** — Prompt for updates based on learnings
5. **Version History** — Track evolution over time

### 5.3 Canvas Score Algorithm

```typescript
function calculateCanvasScore(canvas: LeanCanvas): number {
  const weights = {
    problem: 0.20,        // Most critical
    customer_segments: 0.15,
    uvp: 0.15,
    solution: 0.10,
    channels: 0.10,
    revenue: 0.10,
    costs: 0.05,
    metrics: 0.10,
    unfair_advantage: 0.05
  };

  return Object.entries(weights).reduce((score, [block, weight]) => {
    return score + (evaluateBlock(canvas[block]) * weight);
  }, 0);
}
```

---

## 5B. MVP Canvas System

### 5B.1 The 7-Block MVP Canvas (Paulo Caroli Model)

The MVP Canvas integrates Lean Startup's build-measure-learn with User-Centric Design:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MVP CANVAS                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                         1. MVP PROPOSAL                                      │
│                    What's the proposal for this MVP?                        │
├───────────────────────────────┬─────────────────────────────────────────────┤
│     2. SEGMENTED PERSONAS     │              4. FEATURES                    │
│     Who is this MVP for?      │     What are we building in this MVP?      │
│     (smallest viable segment) │     Which actions are simplified/improved? │
├───────────────────────────────┼─────────────────────────────────────────────┤
│         3. JOURNEYS           │            5. EXPECTED RESULT               │
│  Which journeys are improved? │   What learning or result are we seeking?  │
├───────────────────────────────┴─────────────────────────────────────────────┤
│                  6. METRICS TO VALIDATE BUSINESS HYPOTHESES                 │
│                      How can we measure the results?                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                         7. COST & SCHEDULE                                  │
│              What's the expected cost and timeline?                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5B.2 MVP Canvas Completion Flow

| Order | Block | Question | AI Guidance |
|-------|-------|----------|-------------|
| 1 | MVP Proposal | What exactly is the proposal? | Ensure focus, not feature list |
| 2 | Segmented Personas | Who specifically? (smallest group) | Suggest A/B test segments |
| 3 | Journeys | Which user journeys improved? | Map to persona pain points |
| 4 | Features | Minimum features needed? | Apply Kano model, flag scope creep |
| 5 | Expected Result | What learning/outcome? | Link to business hypothesis |
| 6 | Metrics | How to measure? | Suggest specific KPIs |
| 7 | Cost & Schedule | Budget and timeline? | Reality-check estimates |

### 5B.3 MVP Canvas Rules

> **"AI IS NOT YOUR MVP PROPOSAL"** — Paulo Caroli

- MVP proposal = business hypothesis, NOT technology choice
- Validate user behavior, not the technology you're using
- Focus on specific persona journey, not broad audience
- Features must be minimum for viability
- Every feature links to measurable outcome

---

## 6. Validation Lab

### 6.1 Experiment Types

| Experiment | Purpose | Sample Size | Duration |
|------------|---------|-------------|----------|
| Problem Interview | Validate problem exists | 10-15 | 1-2 weeks |
| Solution Interview | Test solution resonance | 10-15 | 1-2 weeks |
| Landing Page | Measure interest (signup rate) | 100+ visitors | 2-4 weeks |
| Fake Door Test | Test feature demand | 50+ clicks | 1-2 weeks |
| Concierge MVP | Manual value delivery | 5-10 | 2-4 weeks |
| Wizard of Oz | Fake automation test | 10-20 | 2-4 weeks |
| Pre-orders | Willingness to pay | 10+ orders | 2-4 weeks |
| Smoke Test | General interest | 50+ signups | 1-2 weeks |

### 6.2 Experiment Design Workflow

```
1. Select assumption to test (from Canvas)
2. Choose experiment type
3. Define hypothesis: "If [action], then [outcome]"
4. Set success criteria: [metric] ≥ [target]
5. Determine sample size
6. Run experiment
7. Record results
8. AI analysis → recommendation
9. Update Canvas if validated/invalidated
```

### 6.3 Early Evangelist Hierarchy

| Level | Type | Behavior | Target % |
|-------|------|----------|----------|
| 1 | Latent | Unaware of problem | N/A |
| 2 | Passive | Aware but not seeking | 30% |
| 3 | Active | Actively seeking solution | 40% |
| 4 | Committed | Built own workaround | 20% |
| 5 | Visionary | Willing to co-create | 10% |

### 6.4 Problem-Solution Fit Evolution

| Stage | State | Description | Evidence |
|-------|-------|-------------|----------|
| **Gas** | Blurry | Idea exists in founder's mind | Written hypothesis only |
| **Liquid** | Fluid | Testing with early adopters | Landing pages, demos, prototypes |
| **Solid** | Tangible | Validated with paying customers | Early revenue, repeat usage |

### 6.5 The 5 Levels of Customer Pain

```
                    ┌───────────────────────┐
                    │   Level 5: BUDGET     │  ← Ideal target
                    │   Ready to buy NOW    │
                    ├───────────────────────┤
                    │   Level 4: COBBLED    │
                    │   Has interim solution│
                    ├───────────────────────┤
                    │   Level 3: SEARCHING  │
                    │   Actively looking    │
                    ├───────────────────────┤
                    │   Level 2: AWARE      │
                    │   Knows problem exists│
                    ├───────────────────────┤
                    │   Level 1: LATENT     │  ← Requires education
                    │   Has problem, unaware│
                    └───────────────────────┘
```

**Target customers at Level 4-5** — they have budget and urgency.

### 6.6 Validation Prompt Library

The system includes 40+ validation prompts organized by category:

| Category | Prompts | Purpose |
|----------|---------|---------|
| Problem Validation | 10 | Confirm problem exists and severity |
| Market Research | 10 | Analyze market size, competition |
| Customer Discovery | 8 | Understand target audience |
| Solution Validation | 8 | Test solution resonance |
| MVP Scoping | 6 | Define minimum viable features |

**Example Validation Prompts:**

1. **Problem Clarity**
   > "Help me validate the problem my business idea solves. Ask me 10 questions to clarify the specific problem. For each answer, point out blind spots."

2. **Customer Objections**
   > "Act as a skeptical customer. Provide 7 realistic objections to my offering. For each, suggest how to overcome it."

3. **Competitive Landscape**
   > "Analyze 5 competitors: strengths, weaknesses, pricing, reviews. Identify market gaps and unique angles."

4. **Lightweight MVP Test**
   > "Suggest 5 no-code ways to test market demand: landing pages, pre-orders, concierge MVPs. Include success metrics."

---

## 7. Industry Playbooks

### 7.1 Available Playbooks

| ID | Industry | Key Frameworks | Metrics Focus |
|----|----------|----------------|---------------|
| PB-01 | SaaS/B2B | Customer Factory, NRR | MRR, Churn, LTV:CAC |
| PB-02 | Consumer Apps | Hook Model, Viral Loops | DAU/MAU, K-factor |
| PB-03 | Fintech | Trust Framework, Compliance | AUM, Regulatory |
| PB-04 | E-commerce | AOV Optimization | Conversion, ROAS |
| PB-05 | Healthtech | HIPAA Journey, Outcomes | Patient outcomes |
| PB-06 | Edtech | Learning Loops | Completion, NPS |
| PB-07 | Proptech | Transaction Cycles | Deal flow, GMV |
| PB-08 | Marketplace | Liquidity, Network Effects | GMV, Take rate |
| PB-09 | AI/ML | Model Validation | Accuracy, Latency |
| PB-10 | Hardware | Manufacturing Scale | Units, Margins |
| PB-11 | Climate | Impact Measurement | CO2, Certifications |
| PB-12 | Gaming | Engagement Loops | Retention, ARPDAU |
| PB-13 | Creator Economy | Creator Success | GMV, Creator NPS |

### 7.2 Playbook Structure

Each playbook includes:
- Industry-specific Canvas guidance
- Relevant experiment templates
- Benchmark metrics by stage
- Common pitfalls to avoid
- Investor expectations
- Regulatory considerations
- Case studies and examples

### 7.3 AI Agent Playbook Template

Every AI agent follows this standardized playbook structure:

| Section | Content |
|---------|---------|
| **Executive Summary** | Agent type, autonomy level, purpose |
| **Problem Solved** | Who it's for, current pain, why AI agent (not chatbot) |
| **Responsibilities** | What agent OWNS, ASSISTS, NEVER does |
| **Core Workflow** | Trigger → Input → Analysis → Decision → Action → Output |
| **SOPs** | Standard Operating Procedures with inputs/outputs |
| **Data Requirements** | Required data, optional enrichment, priority order |
| **Human Controls** | Approval points, user controls (accept/edit/reject) |
| **Failure Handling** | Common failures, fallback behavior, never-allowed |
| **Success Metrics** | Operational, business, quality metrics |
| **Implementation** | Model choice, tools, persistence, phase readiness |

**Autonomy Levels:**

| Level | Behavior | Example |
|-------|----------|---------|
| Suggest Only | Proposes, never executes | Competitor analysis |
| Act with Approval | Prepares, waits for confirm | Email drafts |
| Fully Autonomous | Executes within guardrails | Task prioritization |

**Core Rule:** AI proposes → Human approves → System executes

---

## 8. Prompt Pack System

### 8.1 Prompt Pack Catalog

| ID | Pack Name | Steps | Trigger Stage |
|----|-----------|-------|---------------|
| PP-01 | Idea Clarity | 3 | Idea |
| PP-02 | Customer Discovery | 3 | Market Discovery |
| PP-03 | Problem-Solution | 3 | Strategy |
| PP-04 | MVP Scoping | 3 | PSF |
| PP-05 | Launch Readiness | 3 | MVP |
| PP-06 | GTM Strategy | 3 | GTM |
| PP-07 | Growth Experiments | 3 | Traction |
| PP-08 | Investor Prep | 3 | Scale |
| PP-09 | Due Diligence | 2 | Fundraising |
| PP-10 | Scale Operations | 2 | Maturity |

**Total: 28 guided steps across 10 packs**

### 8.2 Extended Prompt Categories

Beyond the 10 core packs, the system includes specialized prompt collections:

| Category | Count | Purpose |
|----------|-------|---------|
| **Idea Generation** | 10 | Discover problems worth solving |
| **Market Research** | 10 | Validate demand and competition |
| **Problem-Solution Fit** | 10 | Test solution value |
| **MVP Definition** | 10 | Scope minimum product |
| **Feature Prioritization** | 8 | RICE scoring, must-have vs nice-to-have |
| **Customer Persona** | 8 | Define ideal customer profiles |
| **Validation Testing** | 10 | Design experiments |
| **Feedback Collection** | 8 | Gather and analyze user input |
| **GTM Strategy** | 10 | Marketing and distribution |
| **Iteration** | 8 | Improve based on feedback |

**Example Prompts by Category:**

**Idea Generation:**
- "List daily tasks that waste time for [audience]"
- "Find gaps in existing products within [market]"
- "Turn manual processes into digital solutions"

**Feature Prioritization (RICE Framework):**
- Reach: How many users impacted (0-100%)
- Impact: Effect on UX (0.25-2.0)
- Confidence: Certainty of estimates (0-100%)
- Effort: Dev time needed (days)

**Customer Persona:**
- "Generate 3 detailed personas for [product] targeting [demographic]"
- "Create early adopter profile for [idea]"
- "Describe daily routine of [audience] and fit points"

### 8.3 Prompt Pack Structure

```typescript
interface PromptPack {
  id: string;           // PP-XX
  name: string;
  description: string;
  trigger_stage: Stage;
  trigger_conditions: Condition[];
  steps: PromptStep[];
  completion_criteria: Criteria[];
  next_pack?: string;   // Chain to next pack
}

interface PromptStep {
  order: number;
  title: string;
  prompt: string;       // AI prompt to execute
  input_required: boolean;
  output_type: 'text' | 'structured' | 'document';
  auto_populate?: string[];  // Fields to auto-fill
  validation?: Validation;
}
```

### 8.3 Example: PP-01 Idea Clarity Pack

**Step 1: Problem Articulation**
```
Based on your startup description, let's clarify the core problem.

1. Who experiences this problem? (specific person, role, or segment)
2. What is the problem in one sentence?
3. How often does this problem occur?
4. What's the cost of this problem (time, money, frustration)?

Let's start with who experiences this problem most acutely.
```

**Step 2: Solution Vision**
```
Now let's articulate your solution approach.

1. How does your solution address the problem?
2. What makes your approach different from alternatives?
3. What's the "10x better" aspect?

Remember: Focus on outcomes, not features.
```

**Step 3: Riskiest Assumptions**
```
Every business is built on assumptions. Let's identify yours.

I've identified these assumptions from your responses:
[AI-generated list]

Rate each:
- Impact if wrong (1-10)
- Your confidence level (1-10)

We'll prioritize testing the highest-risk assumptions first.
```

---

## 9. Atlas AI Advisor

### 9.1 AI Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    ATLAS AI ADVISOR                      │
├─────────────────────────────────────────────────────────┤
│  Layer 1: Core Identity & Methodology                    │
│  - Lean Startup principles                               │
│  - Customer Factory framework                            │
│  - Validation-first philosophy                           │
├─────────────────────────────────────────────────────────┤
│  Layer 2: Industry Knowledge (via Playbook)              │
│  - Vertical-specific guidance                            │
│  - Benchmark metrics                                     │
│  - Common pitfalls                                       │
├─────────────────────────────────────────────────────────┤
│  Layer 3: Startup Context (Real-time)                    │
│  - Current stage                                         │
│  - Canvas state                                          │
│  - Experiments running                                   │
│  - Metrics & trends                                      │
├─────────────────────────────────────────────────────────┤
│  Layer 4: Conversation History                           │
│  - Session memory                                        │
│  - Previous recommendations                              │
│  - User preferences                                      │
└─────────────────────────────────────────────────────────┘
```

### 9.2 Specialized Agents

| Agent | Trigger | Function |
|-------|---------|----------|
| StageDetector | Onboarding | Assess startup stage |
| ProfileExtractor | Website input | Extract company data |
| CanvasAgent | Canvas edit | Guide block completion |
| AssumptionExtractor | Canvas save | Identify testable assumptions |
| ExperimentDesigner | Validation Lab | Design experiments |
| InterviewAgent | Problem/Solution interviews | Generate questions |
| MetricsAnalyst | Dashboard view | Analyze trends |
| PitchAgent | Deck builder | Craft narrative |
| InvestorMatcher | CRM | Match to investors |
| TaskPrioritizer | Tasks view | Rank by impact |
| TaskGenerator | Stage transition | Create next actions |
| CompetitorAnalyst | Research | Map competitive landscape |
| PricingAgent | Revenue model | Optimize pricing |
| CopyAgent | Any content | Write compelling copy |
| ReportGenerator | Export | Create documents |

### 9.3 Knowledge Injection

Context is filtered by current screen and action:

```typescript
function buildAtlasContext(screen: string, action: string, startup: Startup) {
  const context = {
    // Always included
    core: CORE_IDENTITY,
    methodology: LEAN_METHODOLOGY,
    rules: RESPONSE_RULES,

    // Stage-specific
    stage: STAGE_GUIDANCE[startup.stage],

    // Screen-specific
    screen: SCREEN_CONTEXT[screen],

    // Action-specific
    action: ACTION_PROMPTS[action],

    // Startup-specific
    startup: {
      name: startup.name,
      stage: startup.stage,
      industry: startup.industry,
      canvas: startup.lean_canvas,
      metrics: startup.current_metrics,
      experiments: startup.active_experiments
    },

    // Playbook (if assigned)
    playbook: startup.industry ? PLAYBOOKS[startup.industry] : null
  };

  return buildMasterPrompt(context);
}
```

### 9.4 Chat Capabilities

Atlas can:
- Answer startup methodology questions
- Guide Canvas completion block-by-block
- Design validation experiments
- Analyze metrics and suggest focus
- Generate interview questions
- Write pitch deck narratives
- Prioritize tasks by impact
- Create documents and reports
- Provide stage-appropriate guidance
- Challenge assumptions constructively

---

## 10. Pitch Deck Builder

### 10.1 Deck Structure

| Slide | Purpose | Data Source |
|-------|---------|-------------|
| 1. Title | Identity | Profile |
| 2. Problem | Pain point | Canvas.problem |
| 3. Solution | Your approach | Canvas.solution |
| 4. Market | TAM/SAM/SOM | Research |
| 5. Product | Demo/screenshots | Uploads |
| 6. Traction | Metrics | Dashboard |
| 7. Business Model | Revenue | Canvas.revenue |
| 8. Competition | Positioning | Competitor analysis |
| 9. Team | Founders | Profile |
| 10. Financials | Projections | Financial model |
| 11. Ask | Funding request | Profile |
| 12. Vision | Future state | Strategy |

### 10.2 AI Features

- **Auto-populate** from Canvas and profile data
- **Narrative generation** per slide
- **Design suggestions** based on industry
- **Investor matching** based on deck content
- **Practice mode** with AI feedback

---

## 11. CRM & Investor Relations

### 11.1 Contact Management

- Unified contact database
- Company associations
- Interaction history
- Deal pipeline tracking
- Email integration

### 11.2 Investor CRM Features

| Feature | Description |
|---------|-------------|
| Investor Database | Curated list with preferences |
| Warm Intro Mapping | Find connection paths |
| Pipeline Stages | Custom funnel tracking |
| Meeting Prep | AI-generated briefs |
| Follow-up Automation | Scheduled reminders |
| Term Sheet Tracker | Document management |

### 11.3 Deal Pipeline

```
Lead → Contacted → Meeting → DD → Term Sheet → Closed
```

---

## 12. Dashboards & Analytics

### 12.1 Dashboard Types

| Dashboard | Audience | Key Widgets |
|-----------|----------|-------------|
| Founder Home | Daily use | Focus tasks, metrics, alerts |
| Traction | Growth | Funnel, cohorts, trends |
| Validation | Experiments | Active tests, results |
| Investor | Fundraising | Pipeline, metrics, deck |
| Team | Collaboration | Tasks, milestones, blockers |

### 12.2 Comprehensive Metrics Framework

**Customer Factory Metrics:**
```
Acquisition → Activation → Retention → Revenue → Referral
```

#### Core Revenue Metrics

| Metric | Formula | Benchmark |
|--------|---------|-----------|
| MRR | Sum of monthly subscriptions | Growing MoM |
| ARR | MRR × 12 | $1M+ for Series A |
| Net New MRR | New + Expansion - Contraction - Churned | Positive |
| ARPU | Revenue / Users | Increasing trend |

#### Customer Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| CAC | (Sales + Marketing) / New Customers | Varies by model |
| LTV | ARPU × Gross Margin × (1/Churn) | 3× CAC minimum |
| LTV:CAC | LTV / CAC | 3:1 or higher |
| CAC Payback | CAC / (ARPU × Margin) | < 12 months |
| Churn | Lost customers / Starting | < 5% monthly |
| NRR | (Start MRR - Churn + Expansion) / Start MRR | > 100% |

#### Product Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| DAU/MAU | Daily active / Monthly active | > 20% |
| Activation Rate | Activated / Signups | 25-40% |
| Conversion Rate | Paid / Free users | 2-5% freemium |
| NPS | % Promoters - % Detractors | > 40 excellent |

#### Growth Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| MoM Growth | (This - Last) / Last | 10-20% early |
| CMGR | (End/Start)^(1/months) - 1 | 15-20% |
| Quick Ratio | (New + Expansion) / (Churn + Contraction) | > 4 strong |
| Rule of 40 | Growth % + Profit % | > 40% |

#### Metrics by Stage

| Stage | Priority Metrics | Targets |
|-------|------------------|---------|
| Pre-seed | Interviews, Waitlist, WTP | 20+ interviews, 100+ signups |
| Seed | MRR, Activation, Retention | $10K-50K MRR, 25%+ activation |
| Series A | ARR, LTV:CAC, NRR | $1M-3M ARR, 3:1 ratio, 100%+ NRR |
| Series B+ | Rule of 40, Quick Ratio, GM | > 40 score, > 4 ratio, 70%+ margin |

#### Vanity Metrics to Avoid

| Vanity | Better Alternative |
|--------|-------------------|
| Total downloads | Activated users |
| Page views | Conversion rate |
| Registered users | Active users |
| Cumulative revenue | MoM growth |

---

## 13. Technical Architecture

### 13.1 Database Schema (Core Tables)

```sql
-- Startups
startups (
  id, user_id, name, description, industry, stage,
  website, business_model, target_customers,
  lean_canvas, created_at, updated_at
)

-- Playbook assignments
startup_playbooks (
  id, startup_id, playbook_id, activated_at, progress
)

-- Prompt pack progress
prompt_pack_progress (
  id, startup_id, pack_id, current_step,
  responses, completed_at
)

-- Experiments
experiments (
  id, startup_id, assumption_id, type, hypothesis,
  success_criteria, status, results, created_at
)

-- Lean Canvas versions
lean_canvas_versions (
  id, startup_id, version, canvas_data,
  score, created_at
)

-- Chat history
chat_messages (
  id, startup_id, role, content, agent_used,
  context, created_at
)
```

### 13.2 Edge Functions

| Function | Purpose |
|----------|---------|
| `ai-chat` | Atlas chatbot interactions |
| `onboarding-agent` | Profile extraction |
| `website-analysis` | Website scraping + analysis |
| `lean-canvas-agent` | Canvas completion guidance |
| `experiment-designer` | Experiment creation |
| `pitch-deck-generator` | Slide content generation |
| `task-prioritizer` | Task ranking |
| `stage-detector` | Stage assessment |
| `metrics-analyzer` | Dashboard insights |
| `investor-matcher` | Investor recommendations |
| `document-generator` | Export documents |
| `playbook-router` | Playbook assignment |
| `prompt-pack-executor` | Run prompt packs |
| `workflow-trigger` | Event-based automation |

### 13.3 AI Model Selection

```typescript
const MODEL_SELECTION = {
  // Fast operations (< 3s expected)
  chat: 'gemini-3-flash-preview',
  extraction: 'gemini-3-flash-preview',
  quick_analysis: 'gemini-3-flash-preview',

  // Deep analysis (3-10s acceptable)
  canvas_review: 'gemini-3-pro-preview',
  experiment_design: 'gemini-3-pro-preview',
  pitch_narrative: 'gemini-3-pro-preview',

  // Complex reasoning (10s+ acceptable)
  strategy_planning: 'claude-sonnet-4-5-20250929',
  competitive_analysis: 'claude-sonnet-4-5-20250929',
  investor_matching: 'claude-sonnet-4-5-20250929'
};
```

---

## 14. Implementation Phases

### Phase 1: Core MVP (Weeks 1-8)

**Focus:** Essential validation flow

| Module | Features |
|--------|----------|
| Auth | OAuth, protected routes |
| Onboarding | 6-step flow, website analysis |
| Dashboard | Focus tasks, stage indicator |
| Lean Canvas | 9 blocks, AI assistance |
| Atlas Chat | Basic Q&A, stage guidance |
| Tasks | CRUD, prioritization |

**Deliverables:**
- Users can sign up and complete onboarding
- Lean Canvas creation with AI help
- Basic chat functionality
- Task management

### Phase 2: Validation & Playbooks (Weeks 9-14)

**Focus:** Experiment system + industry customization

| Module | Features |
|--------|----------|
| Validation Lab | Experiment types, tracking |
| Playbooks | 6 core industries |
| Prompt Packs | 5 core packs (PP-01 to PP-05) |
| Metrics | Basic dashboard |
| Canvas v2 | Assumption extraction |

**Deliverables:**
- Validation experiments running
- Industry-specific guidance
- Guided prompt workflows
- Metrics tracking

### Phase 3: Growth Features (Weeks 15-20)

**Focus:** Fundraising + advanced AI

| Module | Features |
|--------|----------|
| Pitch Deck | 12-slide builder |
| Investor CRM | Pipeline, matching |
| Playbooks | Remaining 7 industries |
| Prompt Packs | All 10 packs |
| Atlas v2 | Full agent suite |

**Deliverables:**
- Complete pitch deck creation
- Investor relationship management
- All playbooks active
- Advanced AI capabilities

### Phase 4: Scale & Polish (Weeks 21-26)

**Focus:** Team collaboration + optimization

| Module | Features |
|--------|----------|
| Team | Multi-user, permissions |
| Documents | Templates, export |
| Analytics | Advanced dashboards |
| Integrations | Stripe, calendars |
| Mobile | PWA optimization |

**Deliverables:**
- Team collaboration
- Document management
- Advanced analytics
- Payment integration

---

## 15. Success Metrics

### 15.1 Product Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Onboarding completion | 80%+ | Funnel tracking |
| Canvas completion | 70%+ | Block fill rate |
| Experiments run | 3+ per startup | Count |
| Chat engagement | 5+ messages/week | Session data |
| Retention (Week 1) | 60%+ | Cohort analysis |
| PMF survey | 40%+ "very disappointed" | Survey |

### 15.2 Business Metrics

| Metric | Year 1 Target |
|--------|---------------|
| Registered users | 10,000 |
| Active startups | 2,000 |
| Paid conversions | 500 |
| MRR | $25,000 |
| NPS | 50+ |

---

## 16. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI accuracy issues | User trust | Human review, feedback loops |
| Playbook relevance | Poor guidance | Continuous validation, user feedback |
| Feature creep | Delayed launch | Stage-gated release |
| Data security | Legal/trust | RLS, encryption, audits |
| Dependency on AI APIs | Service disruption | Multi-provider fallback |
| Founder overwhelm | Low engagement | Progressive disclosure, focus mode |

---

## 17. AI-Assisted Founder Success Path

### 17.1 How AI Agents Help Founders Succeed

The system uses specialized AI agents that work together to guide founders through validation and planning:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FOUNDER SUCCESS PATH                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  IDEA → VALIDATION                                                          │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 1. Idea Structurer → "Transform your narrative into problem statement" │  │
│  │ 2. Market Evaluator → "Analyze market reality: go or no-go?"           │  │
│  │ 3. Customer Definer → "Build your ideal customer profile"              │  │
│  │ 4. Canvas Agent → "Complete your Lean Canvas block by block"           │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  VALIDATION → PLANNING                                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 5. Assumption Extractor → "Identify your riskiest assumptions"         │  │
│  │ 6. Experiment Designer → "Design tests to validate assumptions"        │  │
│  │ 7. Interview Generator → "Create customer interview scripts"           │  │
│  │ 8. Risk Detector → "Prioritize what to test first"                     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  PLANNING → EXECUTION                                                       │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 9. MVP Scoper → "Define minimum features with RICE scoring"            │  │
│  │ 10. Sprint Planner → "Plan 2-week execution cycles"                    │  │
│  │ 11. Task Orchestrator → "Prioritize daily actions"                     │  │
│  │ 12. Traction Analyst → "Identify your one metric that matters"         │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  EXECUTION → SUCCESS                                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 13. PMF Assessor → "Score product-market fit readiness"                │  │
│  │ 14. Decision Advisor → "Pivot or persevere based on evidence"          │  │
│  │ 15. Pitch Builder → "Generate investor-ready materials"                │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 17.2 Key AI Agent Capabilities

| Agent | What It Does for Founders |
|-------|---------------------------|
| **Idea Structurer** | Transforms vague ideas into testable problem statements |
| **Market Evaluator** | Provides honest go/no-go based on market reality |
| **Canvas Agent** | Completes Lean Canvas with AI-generated suggestions |
| **Experiment Designer** | Creates full validation experiment specifications |
| **MVP Scoper** | Defines minimum features using RICE framework |
| **Task Orchestrator** | Generates and prioritizes daily tasks |
| **Traction Analyst** | Identifies bottlenecks and recommends focus |
| **PMF Assessor** | Scores readiness for scaling |
| **Pitch Builder** | Generates investor materials from validated data |

### 17.3 Agent Guardrails

**What AI Agents Always Do:**
- Reference founder's actual startup context
- Suggest ONE specific next action
- Challenge assumptions constructively
- Link advice to metrics

**What AI Agents Never Do:**
- Encourage building before validation
- Give generic advice that applies to any startup
- Suggest adding features when retention is broken
- Ignore stage-appropriate guidance

---

## 18. Skills System

The StartupAI system is built on a comprehensive skill library that provides specialized capabilities for development and startup guidance.

### 18.1 Startup Skills

Located in `.claude/*/SKILL.md`, these skills provide startup-specific AI guidance:

| Skill | Triggers | Description |
|-------|----------|-------------|
| `lean-canvas` | canvas, business model, UVP, assumption | 9-block Lean Canvas with AI assistance, bias detection, assumption extraction |
| `idea-validator` | validate idea, problem score, go or no-go | Problem clarity scoring, market analysis, go/no-go recommendations |
| `mvp-builder` | MVP, minimum viable, RICE score, Kano | 7-block MVP Canvas, RICE scoring, feature prioritization |
| `lean-sprints` | sprint, 2-week cycle, retrospective | Sprint planning, 90-day macro-cycles, pivot/persevere decisions |
| `traction` | metrics, OMTM, PMF, cohort, growth | Customer Factory model, bottleneck detection, PMF assessment |
| `startup-metrics` | MRR, ARR, CAC, LTV, churn, runway | 20+ KPIs with formulas, benchmarks, stage-specific guidance |
| `playbooks` | playbook, industry workflow, founder journey | Industry-aware workflows, agent routing, knowledge injection |
| `prompt-packs` | prompt pack, prompt template, AI workflow | Multi-step prompt execution, templated workflows |
| `fundraising` | fundraising, investor, term sheet, Series A | Readiness checklists, investor matching, term sheet analysis |
| `validation-lab` | experiment, customer interview, smoke test | Experiment design, interview scripts, assumption testing |
| `pitch-deck` | pitch deck, investor presentation, slides | Slide generation, industry templates, critic agent |
| `atlas-chat` | AI chat, chatbot, Atlas, agent routing | Context-aware routing, conversation memory, agent orchestration |
| `startup-expertise` | startup, founder, venture | General startup guidance and methodology |

### 18.2 Infrastructure Skills

Development and platform skills for building StartupAI:

| Skill | Triggers | Description |
|-------|----------|-------------|
| `frontend-design` | UI, component, design, styling | React/Tailwind UI development |
| `feature-dev` | feature, implement, build | Feature development workflow |
| `api-wiring` | API, endpoint, integration | API development and integration |
| `edge-function-creator` | edge function, serverless | Supabase Edge Functions (Deno) |
| `database-migration` | migration, schema, database | Database schema changes |
| `supabase-realtime` | realtime, websocket, subscription | Supabase Realtime features |
| `realtime-features` | realtime, live updates | Real-time functionality |
| `security-hardening` | security, auth, RLS | Security implementation |
| `performance-optimization` | performance, optimize, speed | Performance tuning |
| `cicd-pipeline` | CI/CD, deploy, pipeline | Deployment automation |
| `accessibility` | a11y, accessibility, WCAG | Accessibility compliance |
| `gemini` | Gemini, Google AI | Gemini API integration |
| `sdk-agent` | Agent SDK, Claude SDK | Claude Agent SDK |

### 18.3 Supabase Skills

Located in `.cursor/rules/supabase/`, these cursor rules provide Supabase-specific guidance:

| Skill File | Triggers | Description |
|------------|----------|-------------|
| `supabase-schema.mdc` | schema design | Database schema patterns |
| `supabase-create-migration.mdc` | migrations | Creating migrations |
| `supabase-seeding.mdc` | seed data | Database seeding |
| `supabase-create-db-functions.mdc` | DB functions | PostgreSQL functions |
| `supabase-postgres-sql-style-guide.mdc` | SQL style | SQL conventions |
| `supabase-auth.mdc` | authentication | Auth patterns |
| `supabase-create-rls-policies.mdc` | RLS, security | Row-level security |
| `supabase-cli.mdc` | CLI commands | Supabase CLI usage |
| `writing-supabase-edge-functions.mdc` | edge functions | Deno edge functions |
| `ai-Realtime-assistant-.mdc` | realtime AI | AI + Realtime patterns |
| `test-supabase.mdc` | testing | Supabase testing |

### 18.4 Skill-to-Feature Mapping

| Feature | Primary Skill | Supporting Skills |
|---------|---------------|-------------------|
| Onboarding Wizard | `playbooks` | `idea-validator`, `prompt-packs` |
| Lean Canvas Editor | `lean-canvas` | `validation-lab`, `prompt-packs` |
| Validation Lab | `validation-lab` | `lean-sprints`, `startup-metrics` |
| Pitch Deck Builder | `pitch-deck` | `fundraising`, `playbooks` |
| Metrics Dashboard | `startup-metrics` | `traction`, `lean-sprints` |
| Atlas Chat | `atlas-chat` | All startup skills |
| Investor CRM | `fundraising` | `pitch-deck`, `startup-metrics` |
| Sprint Planning | `lean-sprints` | `traction`, `mvp-builder` |
| Task Management | `lean-sprints` | `playbooks`, `traction` |

### 18.5 Skill Usage Guidelines

**For Development:**
1. Check skill triggers before starting a feature
2. Load relevant skill for domain-specific guidance
3. Reference skill for AI model selection
4. Use skill patterns for consistent implementation

**For Task Creation:**
```yaml
# Include in task template
primary_skill: /skill-name
secondary_skills: [skill-1, skill-2]
```

**AI Model Selection (from skills):**

| Task Type | Model |
|-----------|-------|
| Fast generation | `gemini-3-flash-preview` |
| Deep analysis | `gemini-3-pro-preview` |
| Reasoning/Writing | `claude-sonnet-4-5-20250929` |

---

## 19. Universal Product System

A comprehensive blueprint for building products with website marketing, dashboards, chatbots, wizards, AI agents, workflows, and automations using a safe, preview-first intelligence layer.

### 19.1 Product Philosophy

**Core Principle:** Humans decide. AI assists. Nothing happens silently.

**System Mental Model:**
```
LEFT  → Context & Navigation
MAIN  → Human Work
RIGHT → Intelligence & Actions
```

This separation:
- Scales to any domain
- Prevents AI chaos
- Keeps users oriented and in control

### 19.2 Dashboard Layout (3-Panel)

| Panel | Purpose | Contains | Rule |
|-------|---------|----------|------|
| **LEFT** | Context | Navigation, Scope, Home, Explore, Domains, Saved, Chat, Settings | No editing, No AI execution |
| **MAIN** | Work | Lists, Details, Editors, Dashboards, Wizards, Chat threads | AI never replaces the human here |
| **RIGHT** | Intelligence | AI Actions, Warnings, Optimizations, Automations, "Why this matters" | AI can propose, not commit |

### 19.3 Global Routes

**Website (Marketing):**

| Screen | Route | Purpose |
|--------|-------|---------|
| Home | `/` | Explain value quickly |
| Use Cases | `/use-cases` | Match user intent |
| How It Works | `/how-it-works` | Trust & clarity |
| Pricing | `/pricing` | Monetization |
| Contact | `/contact` | Leads |

**Application (Dashboard):**

| Screen | Route |
|--------|-------|
| App Home | `/app` |
| Explore | `/app/explore` |
| Chatbot | `/app/chat` |
| Domain List | `/app/{domain}` |
| Domain Detail | `/app/{domain}/:id` |
| Calendar | `/app/calendar` |
| Settings | `/app/settings` |

### 19.4 AI Agent Archetypes

| Archetype | What It Does | Use Case | Role |
|-----------|--------------|----------|------|
| **Orchestrator** | Decides order of operations | Traffic control | Manager |
| **Planner** | Breaks goals into steps | Project initialization | Strategist |
| **Analyst** | Finds patterns and risks | Data review | Researcher |
| **Ops Automation** | Watches triggers, runs actions | Background jobs | Automator |
| **Content/Comms** | Drafts text/messages | Communication | Creator |
| **Retriever (RAG)** | Semantic search on docs | Knowledge access | Librarian |
| **Extractor** | Pulls structured data | Data entry | Processor |
| **Controller** | Human approval gate | Safety checks | Security |

### 19.5 AI Rules (Non-Negotiable)

1. **No Silent Writes** — Every action is approved or previewed
2. **Preview Before Apply** — Show the diff, not just the result
3. **Undo Always Available** — "Ctrl+Z" for AI actions
4. **Explain "Why"** — Rationale accompanies every suggestion
5. **Log Every Action** — Audit trails for all intelligence

### 19.6 Technology Capabilities

**Gemini 3 Features:**

| Feature | Purpose | Use Case |
|---------|---------|----------|
| Gemini 3 Pro | High-reasoning model | Complex analysis |
| Gemini 3 Flash | Fast, low-latency model | Real-time chat |
| Gemini Thinking | Extended reasoning | Debugging |
| Search Grounding | Live Google Search | Fact-checking |
| Code Execution | Writes & runs Python | Data analysis |
| Structured Output | Forces strict JSON | API integration |
| RAG | Retrieval Augmented Gen | Long-term memory |

**Claude Agent SDK Features:**

| Feature | Purpose | Use Case |
|---------|---------|----------|
| Agent Loop | Think → Act → Observe | Autonomous workflows |
| Sessions | Maintains state | Long tasks |
| Structured Outputs | Forces JSON/schemas | Reliable automation |
| Custom Tools | Define agent actions | Execution |
| Permissions | Limits actions | Security |
| MCP Connector | External tools | Integration |
| Subagents | Delegate tasks | Complex flows |

### 19.7 UI/UX Components

| Component | Purpose | System Part |
|-----------|---------|-------------|
| 3-Panel Layout | Context (L) · Work (M) · AI (R) | Structure |
| Wizards | Step-by-step flows | Interaction |
| Chatbots | Conversational interface | Interaction |
| Global Context | Holds current state | State Logic |
| Mermaid Docs | Visual diagrams from text | Generation |

### 19.8 Core vs Advanced Strategy

| Area | Core Approach | Advanced Approach |
|------|---------------|-------------------|
| Agent Basics | Agent loop, sessions | Subagents, skills |
| Safety | Permissions, hooks | Secure deployment |
| Execution | Custom tools | MCP, plugins |
| UX | Streaming mode | Slash commands |
| Cost | Cost tracking | Prompt caching |

### 19.9 Data Architecture

**Core Tables:**
- `profiles` — User profiles
- `domains` — Projects/trips/etc.
- `domain_items` — Items within domains
- `saved_items` — User favorites
- `calendar_items` — Calendar events

**AI Tables:**
- `chat_queries` — Chat inputs
- `chat_results` — AI responses
- `ai_runs` — Audit trail
- `automation_rules` — Trigger definitions
- `automation_runs` — Execution logs
- `knowledge_chunks` — RAG storage (pgvector)

**Edge Functions:**
- `POST /ai/chat_search` — Search via Gemini/Claude
- `POST /ai/run_action` — Execute authorized tool
- `POST /control/apply_patch` — Apply previewed change
- `POST /control/undo_patch` — Revert change

### 19.10 System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    UNIVERSAL PRODUCT SYSTEM                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   LEFT              MAIN               RIGHT                         │
│   ┌─────────┐       ┌─────────────┐    ┌─────────────┐              │
│   │ Context │──────▶│   Screens   │◀───│ AI Actions  │              │
│   │   Nav   │       │   Editors   │    │  Warnings   │              │
│   └─────────┘       └──────┬──────┘    └──────┬──────┘              │
│                            │                   │                     │
│                            ▼                   ▼                     │
│                    ┌───────────────────────────────┐                │
│                    │      Edge Functions           │                │
│                    └───────────────┬───────────────┘                │
│                                    │                                 │
│                    ┌───────────────┼───────────────┐                │
│                    ▼               ▼               ▼                 │
│              ┌──────────┐   ┌──────────┐   ┌──────────┐            │
│              │ Database │   │ AI Models│   │ AI Logs  │            │
│              │ Supabase │   │ Gemini   │   │  Audit   │            │
│              └──────────┘   │ Claude   │   └──────────┘            │
│                             └──────────┘                            │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| PSF | Problem-Solution Fit |
| PMF | Product-Market Fit |
| MVP | Minimum Viable Product |
| Canvas | Lean Canvas (9-block model) |
| Playbook | Industry-specific guidance package |
| Prompt Pack | Guided multi-step AI workflow |
| Atlas | StartupAI's AI advisor chatbot |
| Stage Gate | Criteria to unlock next stage |
| OMTM | One Metric That Matters |
| Customer Factory | Business as customer-producing system |

---

## Appendix B: File References

| Document | Path |
|----------|------|
| **Core Documents** | |
| System Index | `/startup-system/index-startup.md` |
| Strategy Document | `/startup-system/strategy.md` |
| Universal Product System | `/startup-system/02-universal-product-system.md` |
| Mermaid Diagrams | `/startup-system/03-mermaid-diagrams.md` |
| Diagram Index | `/startup-system/04-diagram-index.md` |
| Task Template | `/startup-system/TASK-TEMPLATE.md` |
| **Guides** | |
| Startup Guide | `/startup-system/guides/01-startup-guide.md` |
| MVP Guide | `/startup-system/guides/02-mvp-guide.md` |
| MVP Canvas Guide | `/startup-system/guides/07-mvp-canavas.md` |
| Startup Metrics | `/startup-system/guides/08-startup-metrics.md` |
| MVP Prompts | `/startup-system/guides/50-mvp-prompts.md` |
| Validation Prompts | `/startup-system/guides/53-validate-prompts.md` |
| Playbook Template | `/startup-system/guides/02-playbook-startups.md` |
| Startup Playbooks | `/startup-system/guides/101-startup-playbooks.md` |
| **Prompt Library** | |
| Prompt Index | `/startup-system/prompt-library/01-prompt-library-index.md` |
| Prompt Strategy | `/startup-system/prompt-library/101-prompt-strategy.md` |
| **Playbooks** | |
| Playbook Index | `/startup-system/playbooks/00-playbooks-index.md` |
| Playbook PRD | `/startup-system/playbooks/prd-playbooks.md` |
| **Skills** | |
| Startup Skills | `.claude/*/SKILL.md` (13 skills) |
| Supabase Skills | `.cursor/rules/supabase/*.mdc` (11 rules) |
| **Supabase** | |
| Master System Prompt | `/supabase/functions/_shared/master-system-prompt.ts` |

---

## Appendix C: Changelog

| Version | Date | Changes |
|---------|------|---------|
| 5.0 | 2026-02-02 | Initial unified PRD |
| 5.1 | 2026-02-02 | Added MVP Canvas, comprehensive metrics, validation prompts, AI agent success path |
| 5.2 | 2026-02-02 | Added Section 18: Skills System (startup, infrastructure, Supabase skills) |
| 5.3 | 2026-02-02 | Added Section 19: Universal Product System (3-panel layout, AI archetypes, rules) |

---

*Document generated by Claude Code — 2026-02-02*
