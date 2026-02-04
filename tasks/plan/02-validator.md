# Startup Validator: Strategy Planning Document

> **Version:** 2.0 | **Updated:** 2026-02-03 | **Status:** Planning
> **Task Index:** `startup-system/plan/01-idea/index-idea.md`
> **Data Plan:** `startup-system/plan/01-idea/82-data-plan.md`

---

## 00-progress-tracker

| Category | Existing | Planned | Total | Status |
|----------|----------|---------|-------|--------|
| **Tasks** | 4 (reference) | 19 | 23 | 🔄 17% |
| **Screens** | 1 | 15 | 16 | 🔄 6% |
| **Features** | 6 | 50+ | 56+ | 🔄 11% |
| **Agents** | 1 | 8 | 9 | 🔄 11% |
| **Edge Functions** | 1 | 2 | 3 | 🔄 33% |
| **Database Tables** | 11 | 22 | 33 | 🔄 33% |

### Task Progress by Phase

| Phase | Range | Total | Done | In Progress | Not Started |
|-------|-------|-------|------|-------------|-------------|
| CORE | 01-09 | 9 | 0 | 0 | 9 |
| MVP | 20-25 | 6 | 0 | 0 | 6 |
| ADVANCED | 40-43 | 4 | 0 | 0 | 4 |
| REFERENCE | 80-89 | 3 | 3 | 0 | 0 |
| AUDITS | 90-99 | 1 | 1 | 0 | 0 |
| **TOTAL** | — | **23** | **4** | **0** | **19** |

---

## 00-validation-modes

### Mode A: Quick Validation (30 seconds - 5 minutes)

**Purpose:** Instant idea scoring for quick iteration

| Screen | Key Features | Agent | Use Case | Real World Example |
|--------|--------------|-------|----------|-------------------|
| **Quick Validate** | 30s validation, AI enhance | Validation | Instant idea check | "SaaS for restaurant inventory" → Score 72 |
| **Chat Validator** | Conversational input, guided Q&A | Chat | Interactive validation | "Tell me about your idea" → structured data |
| **Validation Dashboard** | Score, flags, recommendations | Validation | Results display | Score 72/100, 3 red flags |
| **Market Analysis** | TAM/SAM/SOM, trends, benchmarks | Market Research | Deep market dive | "$3.1B TAM, 19.8% CAGR" |
| **Competitor Intel** | Positioning matrix, SWOT | Competitor | Competitive landscape | "7 competitors, gap identified" |
| **Financial Projections** | Unit economics, revenue models | Financial | Business model validation | "LTV:CAC 5:1, 12-mo payback" |
| **AI Coach** | Q&A, follow-up actions | Chat | Ongoing guidance | "How do I validate pricing?" |

### Mode B: Deep Validation (4-8 weeks) — Lean Startup Methodology

**Purpose:** Systematic validation with interviews and experiments

| Screen | Key Features | Agent | Use Case | Real World Example |
|--------|--------------|-------|----------|-------------------|
| **ValidationLab** | Phase overview, progress | Validation | Hub for validation | "CORE Phase: 60% complete" |
| **ICPDefinition** | Industry, size, role targeting | Validation | Define ideal customer | "VP Merchandising at 20-200 store chains" |
| **InterviewTracker** | Schedule, conduct, analyze | Validation | Track 15+ interviews | "8/15 done, 5 strong signals" |
| **PainPointMatrix** | Aggregate pain points | Validation | Validate problem | "Manual pricing: 85% combined score" |
| **LandingPageBuilder** | AI-assisted page creation | Frontend | Test value prop | "Headline from top pain point" |
| **DemandTestDashboard** | Conversion tracking | Validation | 2%+ conversion test | "3.1% conversion, PROCEED" |
| **DecisionMatrix** | Weighted scoring | Validation | Go/No-Go decision | "Score 4.2/5.0 → Build MVP" |
| **MVPBuilder** | Feature scoping | Validation | Define MVP scope | "Core feature: AI pricing recommendations" |
| **ChannelMapper** | GTM channel mapping | Validation | Find distribution | "LinkedIn: 5.8% conversion" |

---

## 01-description

### What is the Startup Validator?

The Startup Validator is an AI-powered platform that helps founders validate their business ideas **before building**. It combines 6 specialized AI agents to analyze market opportunity, competition, financials, and execution feasibility in **30 seconds to 5 minutes** rather than 4-8 weeks.

### Core Concept

Transform a 2-paragraph idea description into a comprehensive validation report with actionable recommendations, using the same rigor venture capitalists apply when evaluating investments.

### Key Differentiators

| Differentiator | Description |
|----------------|-------------|
| **Speed** | 30 seconds to full validation vs 4-8 weeks manual |
| **AI-Native** | Multi-agent architecture with specialized agents |
| **Dual Input** | Quick Form + Chat + Full Wizard modes |
| **Actionable** | Specific next steps, not generic advice |
| **Integrated** | Flows into Lean Canvas, Pitch Deck, CRM |

---

## 02-rationale

### Why Build This?

| Problem | Evidence | Impact |
|---------|----------|--------|
| **42% of startups fail due to no market need** | CB Insights 2024 | Primary cause of failure |
| Manual validation takes 4-8 weeks | Industry average | Founders lose momentum |
| Traditional research costs $5,000-$25,000 | Market research firms | Prohibitive for early-stage |
| AI validation achieves 89% accuracy | Internal benchmarks | vs 54% manual research |

### Business Opportunity

| Metric | Value |
|--------|-------|
| SaaS validation market | $380B by 2028 |
| Target SOM | $50M ARR potential |
| AI-native advantage | 3x faster growth than traditional |
| Competitive moat | Multi-agent AI + proprietary scoring |

### Strategic Fit

The Validator serves as the **entry point** to StartupAI, capturing users at the earliest stage of their journey and flowing them into the full platform ecosystem.

---

## 03-user-stories

### Epic 1: Quick Validation

| Story | Acceptance Criteria | Real World Example |
|-------|---------------------|-------------------|
| Validate idea in 30 seconds | Single textarea, instant score | Enter "AI for restaurant inventory" → Score 72/100 |
| AI improves my description | "Enhance with AI" button | Vague idea → 3-paragraph description |
| Automatic industry detection | AI suggests from text | "restaurant inventory" → SaaS > Restaurant Tech |

### Epic 2: Chat Validation

| Story | Acceptance Criteria | Real World Example |
|-------|---------------------|-------------------|
| Describe idea conversationally | Chat with guided questions | "I want to help restaurants waste less food" |
| AI asks clarifying questions | Bot identifies gaps | "Who specifically - fast food, fine dining?" |
| See extracted data in real-time | Sidebar shows structured data | Problem, Solution, Market, Model cards populate |

### Epic 3: Validation Scoring

| Story | Acceptance Criteria | Real World Example |
|-------|---------------------|-------------------|
| Get overall viability score | 0-100 with confidence | "Score: 72/100 (Confidence: 75%)" |
| See what's working | Green lights with evidence | "Strong market growth: 39% CAGR" |
| See risks to address | Red flags with severity | "High competition: 7 established players" |

### Epic 4: Market Analysis

| Story | Acceptance Criteria | Real World Example |
|-------|---------------------|-------------------|
| Know my market size | TAM/SAM/SOM with methodology | "TAM: $3.1B, SAM: $620M, SOM: $75M" |
| Understand market trends | Short/medium/long trends | "AI adoption growing 25% YoY" |
| Get industry benchmarks | CAC, LTV, churn by industry | "Restaurant SaaS CAC: $200, LTV: $1,000" |

### Epic 5: Competitive Intelligence

| Story | Acceptance Criteria | Real World Example |
|-------|---------------------|-------------------|
| Know my competitors | Direct, indirect, alternative | "MarketMan (direct), Toast (indirect)" |
| See competitive positioning | Quality vs price matrix | "Premium/High Quality quadrant" |
| Find competitor weaknesses | Opportunities for differentiation | "MarketMan lacks AI predictions" |

### Epic 6: Financial Validation

| Story | Acceptance Criteria | Real World Example |
|-------|---------------------|-------------------|
| Get unit economics estimates | CAC, LTV, payback, margins | "LTV:CAC = 5:1, Payback = 8 months" |
| See revenue model options | Fit score per model | "SaaS Subscription: High fit" |
| Get revenue projections | 3-5 year projections | "Year 1: $250K, Year 3: $1M" |

---

## 04-success-criteria

### Launch Metrics (Month 1)

| Metric | Target |
|--------|--------|
| Ideas validated | 1,000 |
| Wizard completion rate | 70% |
| Report generation time | <30 seconds |
| User satisfaction | >4.0/5 |

### Growth Metrics (Month 3)

| Metric | Target |
|--------|--------|
| Monthly active users | 5,000 |
| Premium conversion | 15% |
| Market Analysis unlock rate | 40% |
| Repeat validation rate | 30% |

### Quality Metrics (Ongoing)

| Metric | Target |
|--------|--------|
| Validation accuracy | 85% |
| Actionable recommendations | 90% |
| Data freshness | <7 days |
| AI confidence | >70% |

---

## 05-purpose-goals-outcomes

### Purpose

Enable founders to make **data-driven decisions** about their startup ideas before investing significant time and resources.

### Goals

| Goal | Timeline |
|------|----------|
| Reduce failure rate | Ongoing |
| Accelerate validation (4-8 weeks → 30 seconds) | Launch |
| Democratize enterprise-grade research | Launch |
| Create platform entry point | Month 1 |
| Generate revenue via credits | Month 2 |

### Outcomes

| Stakeholder | Outcome |
|-------------|---------|
| **Founders** | Validated ideas with actionable next steps |
| **StartupAI** | User acquisition, engagement, revenue |
| **Investors** | Better-prepared pitches, higher quality deal flow |
| **Ecosystem** | Reduced waste, more successful startups |

---

## 06-key-points

### Validation Framework

```
┌─────────────────────────────────────────────────────────────┐
│                    5-PHASE VALIDATION                        │
├─────────────────────────────────────────────────────────────┤
│  PHASE 1       PHASE 2       PHASE 3       PHASE 4  PHASE 5│
│  ┌───────┐    ┌───────┐    ┌───────┐    ┌───────┐ ┌───────┐│
│  │PROBLEM│ →  │MARKET │ →  │CUSTOMER│ → │  MVP  │→│BUSINESS│
│  │ CHECK │    │RESEARCH│   │DISCOVER│   │ TEST  │ │ MODEL │
│  └───────┘    └───────┘    └───────┘    └───────┘ └───────┘│
│                                                              │
│  Week 1-2     Week 2-3     Week 3-4     Week 4-6  Week 6-8 │
└─────────────────────────────────────────────────────────────┘
```

### Scoring Dimensions

| Dimension | Weight | Description |
|-----------|--------|-------------|
| Problem Validation | 25% | Is this a real, painful problem? |
| Solution Validation | 20% | Does the solution address the pain? |
| Market Validation | 20% | Is the market large enough? |
| Competitive Position | 15% | Can you differentiate? |
| Execution Feasibility | 10% | Can you build this? |
| Financial Viability | 10% | Will it make money? |

### Key Metrics

| Metric | Target | Why |
|--------|--------|-----|
| Overall Score | 70+ | Build with confidence |
| LTV:CAC | 5:1 | Sustainable unit economics |
| Payback Period | <12 months | Capital efficient |
| NRR | >100% | Growth from existing customers |

---

## 07-screens-features

### Screen 1: Quick Validate (Form)

```
┌─────────────────────────────────────────────────────────────┐
│  Quick Validate                                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │                                                         ││
│  │  Describe your idea in 2-3 paragraphs...               ││
│  │                                                         ││
│  │  Include: Problem, Solution, Target Audience,          ││
│  │  How you'll make money                                  ││
│  │                                                         ││
│  └─────────────────────────────────────────────────────────┘│
│                                               [47 words]    │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────────────────────┐  │
│  │ Enhance with AI │  │      Validate Now →              │  │
│  └─────────────────┘  └─────────────────────────────────┘  │
│                                                             │
│  Auto-detected: SaaS > Restaurant Tech                     │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Single textarea (min 50 words)
- AI Enhance button
- Auto industry detection
- 30-second validation

### Screen 2: Validation Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  Validation Report       ✓ Ready    Step 1/3    8-12 weeks │
├─────────────────────────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────────────────┐   │
│  │  63    │ │  80    │ │  75    │ │        72          │   │
│  │ Risk   │ │ Diff   │ │ Conf   │ │    Score /100      │   │
│  └────────┘ └────────┘ └────────┘ └────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Executive Summary                                          │
│  Strong Opportunity - The AI in fashion market is projected│
│  to grow from $1.99B to $2.78B in 2025. Focus on building  │
│  partnerships with fashion brands to validate PMF.          │
├─────────────────────────────────────────────────────────────┤
│  Key Recommendations                                        │
│  1. Focus on B2B partnerships with fashion brands          │
│  2. Consider freemium model to attract initial users       │
│  3. Leverage social media for targeted marketing           │
├──────────────────────────────┬──────────────────────────────┤
│  GREEN LIGHTS ✓              │  RED FLAGS ✗                 │
│  • Strong market growth 39%  │  • High competition (CLO 3D) │
│  • High demand for AI        │  • Technical complexity      │
│  • Positive user feedback    │  • MVP delays possible       │
└──────────────────────────────┴──────────────────────────────┘
```

### Screen 3: Market Analysis

```
┌─────────────────────────────────────────────────────────────┐
│  Market Analysis                                     70 cr  │
├──────────────────────────┬──────────────────────────────────┤
│  TAM   $3.1B            │  CAGR        19.8%               │
│  ████████████████████   │  Break-even  12-18 mo            │
│                         │  Startup $   $200-300K           │
│  SAM   $620M            │  MVP Time    6 months            │
│  ██████████░░░░░░░░░░   │                                  │
│                         │  Target Regions:                 │
│  SOM   $75M             │  • North America (high)          │
│  █████░░░░░░░░░░░░░░░   │  • Europe (diverse)              │
├──────────────────────────┴──────────────────────────────────┤
│  Trends                                                     │
│  1. AI-driven workflow platforms        Impact: HIGH       │
│  2. Content automation via AI           Impact: MEDIUM     │
├─────────────────────────────────────────────────────────────┤
│  Industry Benchmarks                                        │
│  CAC: $200  |  LTV: $1,000  |  LTV/CAC: 5:1               │
└─────────────────────────────────────────────────────────────┘
```

---

## 08-three-panel-layout

| Panel | Purpose | Width | Key Components |
|-------|---------|-------|----------------|
| **Left (Context)** | Navigation + state | 20% | Nav, idea summary, progress, history |
| **Main (Work)** | Primary content | 55% | Forms, charts, tables, actions |
| **Right (Intelligence)** | AI assistance | 25% | Recommendations, insights, chat |

```
┌────────────┬───────────────────────────────┬─────────────────┐
│   CONTEXT  │           WORK                │  INTELLIGENCE   │
│    20%     │           55%                 │      25%        │
├────────────┼───────────────────────────────┼─────────────────┤
│            │                               │                 │
│  My Ideas  │  Validation Dashboard         │  AI Coach       │
│  ─────────│                               │  ─────────────  │
│  • FoodAI │  Score: 72/100               │  Ask about      │
│  • StyleOS│  ┌───────────────────────────┐│     your score  │
│            │  │ Executive Summary        ││                 │
│  Progress  │  └───────────────────────────┘│  Suggestions    │
│  ─────────│                               │  ─────────────  │
│  Step 1/3 │  Green Lights  │  Red Flags  │  • Validate     │
│            │  ✓ Market      │  ✗ Comp     │    pricing      │
│  History   │  ✓ Timing      │  ✗ Tech     │  • Interview    │
│  ─────────│                               │    customers    │
│  v1 Draft  │  Validation Scorecard         │  • Build MVP    │
│  v2 Review │  Problem:  ████████░░ 80%   │                 │
│            │  Solution: ███████░░░ 75%   │  Quick Actions  │
│            │  Market:   ██████░░░░ 70%   │  ─────────────  │
│            │                               │  [Unlock Market]│
│            │  [View Market Analysis →]    │  [Export PDF]   │
└────────────┴───────────────────────────────┴─────────────────┘
```

**Responsive Behavior:**
- Desktop: 3-panel layout
- Tablet: 2-panel + drawer
- Mobile: Single panel + bottom nav

---

## 09-supabase-schema

**Source:** `startup-system/plan/01-idea/82-data-plan.md`

### Core Tables (Existing)

| Table | Purpose | Status |
|-------|---------|--------|
| `validation_reports` | Root entity | ✅ Exists |
| `validation_runs` | Run history | ✅ Exists |
| `validation_verdicts` | AI verdicts | ✅ Exists |
| `assumptions` | Riskiest assumptions | ✅ Exists |
| `experiments` | Experiment design | ✅ Exists |
| `experiment_results` | Test results | ✅ Exists |
| `customer_segments` | ICP profiles | ✅ Exists |
| `customer_forces` | Push/pull forces | ✅ Exists |
| `jobs_to_be_done` | JTBD framework | ✅ Exists |
| `interviews` | Customer interviews | ✅ Exists |
| `interview_insights` | Extracted insights | ✅ Exists |

### Deep Validation Tables (New — from Data Plan)

#### Phase 1: Customer Discovery

| Table | Purpose | Key Fields | Task |
|-------|---------|------------|------|
| `startup_validations` | Links all validation data | phase, status, scores, milestones | - |
| `icp_definitions` | ICP with industry guidance | industry, company_size, decision_maker_role, pain_indicators | 01-customer |

#### Phase 2: Interviews & Pain

| Table | Purpose | Key Fields | Task |
|-------|---------|------------|------|
| `pain_points` | Aggregated pain with industry evidence | interview_frequency, industry_stat, combined_score, severity | 03-pain |
| `problem_statements` | AI-generated problem statements | statement, who/what/why/impact components | 03-pain |

#### Phase 3: Demand Testing

| Table | Purpose | Key Fields | Task |
|-------|---------|------------|------|
| `landing_pages` | Landing page content | headline, subheadline, social_proof, cta_text, slug | 04-landing |
| `landing_page_signups` | Email captures | email, utm_source/medium/campaign | 04-landing |
| `demand_tests` | Conversion tracking | target/actual visitors, signups, conversion_rate, verdict | 05-demand |
| `demand_test_channels` | Channel performance | channel, visitors, signups, conversion_rate, spend | 05-demand |
| `validation_decisions` | Go/No-Go with weighted scoring | interview/industry/conversion scores, recommendation | 06-decision |

#### Research & Industry

| Table | Purpose | Key Fields | Task |
|-------|---------|------------|------|
| `research_reports` | Generated research reports | industry_id, report_type, content, sections | Shared |
| `industry_prompts` | 19 industry expert prompts | system_prompt, benchmarks, failure_patterns | Shared |
| `industry_benchmarks` | Normalized benchmarks | metric_name, good/great/critical thresholds | Shared |
| `competitors` | Competitor database | name, strengths, weaknesses, pricing, funding | Shared |
| `investor_questions` | Industry-specific investor Qs | question, why_asked, good/red_flag answers | Shared |
| `failure_patterns` | Risk detection patterns | pattern_name, warning_signs, prevention_tips | Shared |

### Quick Validation Tables (New — IdeaProof-style)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `ideas` | Quick validation root | name, description, status, overall_score |
| `idea_validation_scores` | Score breakdown | problem, solution, market scores |
| `idea_validation_signals` | Green/red flags | signal_type, signal_text, severity |
| `idea_market_analysis` | TAM/SAM/SOM | tam, sam, som, cagr, maturity |
| `idea_competitors` | Competitor profiles | name, funding, pricing, threat_level |
| `idea_unit_economics` | Unit metrics | cac, ltv, ratio, payback |

### Table Summary

| Category | Tables | Source |
|----------|--------|--------|
| Existing (Lean Validation) | 11 | validation-agent |
| Deep Validation (new) | 16 | 01-idea/82-data-plan.md |
| Quick Validation (new) | 6 | validator/50-validator-plan.md |
| **Total** | **32** (with some overlap) | - |

---

## 10-edge-functions

### Existing

| Function | Status | Actions |
|----------|--------|---------|
| `validation-agent` | ✅ | extract_assumptions, design_experiment, analyze_interview, analyze_segment, update_assumption_status |

### Planned (from `01-idea/05-edge-function-idea-validator.md`)

| Function | Purpose | Actions | Model |
|----------|---------|---------|-------|
| `idea-validator` | Quick validation orchestration | score_problem, analyze_market, assess_pain, recommend | Gemini Flash/Pro |

### Action Details (idea-validator)

| Action | Purpose | Model | Output |
|--------|---------|-------|--------|
| `score_problem` | Score problem severity 4 dimensions | Gemini Flash | problem_scores |
| `analyze_market` | TAM/SAM/SOM with Google Search grounding | Gemini Pro | market_analysis |
| `assess_pain` | Pain level 1-5 scale | Gemini Flash | pain_assessment |
| `recommend` | Go/No-Go recommendation | Claude Sonnet | validation_decisions |

### Future Extensions

| Function | Purpose | Priority |
|----------|---------|----------|
| `market-research-agent` | Deep market analysis | P1 |
| `competitor-agent` | Competitive intelligence | P1 |
| `financial-agent` | Unit economics modeling | P2 |
| `roadmap-agent` | Execution planning | P2 |

---

## 11-dependencies

### Technical Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| Supabase (PostgreSQL) | ✅ Ready | Existing infrastructure |
| Supabase Auth | ✅ Ready | OAuth + RLS |
| Gemini 3 API | ✅ Ready | Fast extraction, grounding |
| Claude API | ✅ Ready | Deep analysis |
| shadcn/ui | ✅ Ready | Component library |

### Data Dependencies

| Data Source | Purpose | Refresh |
|-------------|---------|---------|
| Industry benchmarks | CAC, LTV, churn by vertical | Monthly |
| Market reports | TAM/SAM/SOM estimates | Quarterly |
| Competitor data | Pricing, features, funding | Weekly |

### Integration Dependencies

| Integration | Priority | Notes |
|-------------|----------|-------|
| Stripe | P1 | Credit purchases |
| PDF export | P1 | Report download |
| Notion | P2 | Export to workspace |
| Google Docs | P2 | Document generation |
| Email | P2 | Nudges, summaries |

---

## 12-gemini-features

### Models Used

| Model | Use Case | Reason |
|-------|----------|--------|
| `gemini-3-flash-preview` | Fast extraction, classification | Speed, cost |
| `gemini-3-pro-preview` | Deep analysis, reasoning | Quality, accuracy |
| `gemini-3-pro-image-preview` | Screenshot analysis | Multimodal |

### Gemini Tools

| Tool | Purpose | Agent |
|------|---------|-------|
| **Grounding with Search** | Real-time market data | Market Research |
| **URL Fetch** | Company website analysis | Competitor |
| **Code Execution** | Financial calculations | Financial |
| **Structured Output** | JSON for UI rendering | All |
| **Long Context** | Full report analysis | Validation |

### Gemini Agent Capabilities

| Capability | Application |
|------------|-------------|
| Industry classification | Auto-detect from description |
| Entity extraction | Problem, solution, audience |
| Market sizing | TAM/SAM/SOM calculations |
| Competitor profiling | Company data extraction |
| Trend analysis | Grounded search for trends |

---

## 13-claude-sdk

### Models Used

| Model | Use Case | Reason |
|-------|----------|--------|
| `claude-haiku-4-5` | Fast tasks, chat | Speed, cost |
| `claude-sonnet-4-5` | Balanced analysis | Quality/speed balance |
| `claude-opus-4-5` | Complex reasoning | Deep analysis |

### Claude Agent SDK Features

| Feature | Application |
|---------|-------------|
| **Extended Thinking** | Complex validation scoring |
| **Tool Use** | Database queries, calculations |
| **Prompt Caching** | Repeated analysis patterns |
| **Streaming** | Real-time chat responses |

### Claude Tools

| Tool | Purpose | Agent |
|------|---------|-------|
| Read | Access validation data | All |
| Write | Store results | All |
| WebSearch | Market research | Market |
| WebFetch | Competitor pages | Competitor |
| Task | Subagent orchestration | Orchestrator |

### Message API Patterns

| Pattern | Use Case |
|---------|----------|
| System + User | Standard validation |
| Multi-turn | Chat coach |
| Tool calling | Database operations |
| Structured output | JSON for UI |

---

## 14-ai-agents

### Agent Overview

| Agent | Role | Model | Triggers |
|-------|------|-------|----------|
| **Orchestrator** | Route and coordinate | Claude Sonnet | User action |
| **Validation** | Score and assess | Claude Sonnet | Idea ready |
| **Market Research** | Market intelligence | Gemini Pro | Validation complete |
| **Competitor** | Competitive landscape | Gemini Pro | Market ready |
| **Financial** | Business economics | Claude Sonnet | Competitor ready |
| **Roadmap** | Execution planning | Claude Haiku | Financial ready |

### Agent Flow

```
                    ┌─────────────────┐
                    │   User Input    │
                    │  (Form/Chat)    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Orchestrator  │
                    │  Claude Sonnet  │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
   ┌────────▼────────┐ ┌─────▼─────┐ ┌────────▼────────┐
   │   Validation    │ │  Market   │ │   Competitor    │
   │  Claude Sonnet  │ │Gemini Pro │ │   Gemini Pro    │
   └────────┬────────┘ └─────┬─────┘ └────────┬────────┘
            │                │                │
            └────────────────┼────────────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
   ┌────────▼────────┐ ┌─────▼─────┐ ┌────────▼────────┐
   │    Financial    │ │  Roadmap  │ │   Chat Coach    │
   │  Claude Sonnet  │ │Claude Haiku│ │  Claude Haiku   │
   └─────────────────┘ └───────────┘ └─────────────────┘
```

---

## 15-automations

### Automated Workflows

| Workflow | Trigger | Actions | Outcome |
|----------|---------|---------|---------|
| **Idea Validation** | Wizard complete | Extract → Score → Summarize → Recommend | Full report |
| **Market Unlock** | Credits spent | Research → Analyze → Benchmark | Market section |
| **Competitor Refresh** | Weekly schedule | Scrape → Compare → Update | Fresh data |
| **Score Recalculation** | Data update | Recalculate → Update → Notify | Updated scores |

### Wizard Flows

| Wizard | Steps | Duration |
|--------|-------|----------|
| **Quick Validate** | 1 (textarea) | 30 seconds |
| **Chat Validate** | 5 Q&A turns | 2-3 minutes |
| **Full Wizard** | 4 steps | 5-10 minutes |

### Workflow States

```
draft → validating → validated → market_analysis → competitor_analysis
                                        ↓
                               financial_analysis → roadmap → building
                                                              ↓
                                                           archived
```

---

## 16-dashboard-mapping

### Entry Points → Mode → Agent

| Entry Point | Default Mode | Agent |
|-------------|--------------|-------|
| Homepage CTA | Quick Form | Validation |
| Dashboard CTA | Full Wizard | Onboarding + Validation |
| Chat "I have an idea" | Chat Validator | Chat + Validation |
| Onboarding Step 4 | Auto-validate | Onboarding |

### Dashboard Sections → Agents

| Section | Agent | Data Source |
|---------|-------|-------------|
| Score chips | Validation | `idea_validation_scores` |
| Executive Summary | Validation | `idea_summaries` |
| Recommendations | Validation | `idea_recommendations` |
| Green/Red Flags | Validation | `idea_validation_signals` |
| Market Analysis | Market Research | `idea_market_analysis` |
| Competitors | Competitor | `idea_competitors` |
| Financials | Financial | `idea_unit_economics` |
| Roadmap | Roadmap | `idea_roadmap_phases` |

### Chatbot Context Injection

| Context | Source | Refresh |
|---------|--------|---------|
| Current validation | `ideas` | On change |
| Startup profile | `startups` | On load |
| Industry playbook | `industry_playbooks` | On load |
| Recent scores | `idea_validation_scores` | On validation |

---

## 17-wiring-plan

### API Endpoints (Edge Functions)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/idea-validator` | POST | Main validation |
| `/market-research-agent` | POST | Market analysis |
| `/competitor-agent` | POST | Competitor intelligence |
| `/financial-agent` | POST | Financial modeling |
| `/roadmap-agent` | POST | Execution planning |

### Request/Response Pattern

```typescript
// Request
{
  action: 'validate' | 'quick_validate' | 'chat_validate',
  startup_id: string,
  idea_id?: string,
  data: {
    description?: string,
    industry?: string,
    chat_history?: Message[]
  }
}

// Response
{
  success: true,
  data: {
    idea: Idea,
    scores: ValidationScores,
    signals: ValidationSignals[],
    recommendations: Recommendation[],
    summary: IdeaSummary
  },
  meta: {
    ai_model: string,
    cost_credits: number,
    latency_ms: number
  }
}
```

### Frontend Components → Edge Functions

| Component | Edge Function | Action |
|-----------|---------------|--------|
| `QuickValidateForm` | `idea-validator` | quick_validate |
| `ChatValidator` | `idea-validator` | chat_validate |
| `ValidationWizard` | `idea-validator` | validate |
| `ValidationDashboard` | - | Read only |
| `MarketAnalysis` | `market-research-agent` | analyze |
| `CompetitorIntel` | `competitor-agent` | profile |
| `FinancialProjections` | `financial-agent` | model |
| `RoadmapBuilder` | `roadmap-agent` | plan |

### Realtime Subscriptions

| Channel | Events | Component |
|---------|--------|-----------|
| `validation:{idea_id}` | score_updated, signal_added | Dashboard |
| `market:{idea_id}` | analysis_complete | MarketAnalysis |
| `competitor:{idea_id}` | profile_added | CompetitorIntel |

---

## 18-task-index

**Source:** `startup-system/plan/01-idea/index-idea.md`

### CORE Phase — Problem Validation (01-06)

| ID | Task | Screen | Edge Function | Subagent | Schema | Priority | Effort |
|----|------|--------|---------------|----------|--------|----------|--------|
| 01-customer | Identify Target Customer Segment | ICPDefinition | validation-agent | startup-expert | icp_definitions | P0 | 4-8h |
| 02-interviews | Conduct 15 Customer Interviews | InterviewTracker | validation-agent | startup-expert | interviews | P0 | 8-12h |
| 03-pain | Document Pain Points | PainPointMatrix | validation-agent | startup-expert | pain_points | P0 | 4-8h |
| 04-landing | Build Landing Page | LandingPageBuilder | — | frontend-designer | landing_pages | P1 | 8-12h |
| 05-demand | Run Demand Test | DemandTestDashboard | validation-agent | startup-expert | demand_tests | P1 | 6-10h |
| 06-decision | Make Go/No-Go Decision | DecisionMatrix | validation-agent | startup-expert | validation_decisions | P1 | 6-10h |

### MVP Phase — Solution Validation (20-25)

| ID | Task | Screen | Edge Function | Subagent | Schema | Priority |
|----|------|--------|---------------|----------|--------|----------|
| 20-overview | Phase Overview | ValidationLab | validation-agent | startup-expert | mvp_definitions | P0 |
| 21-scope | Define MVP Scope | MVPBuilder | validation-agent | ai-agent-dev | mvp_features | P1 |
| 22-testing | Run User Testing | UserTesting | validation-agent | ai-agent-dev | user_tests | P1 |
| 23-revenue | Validate First Revenue | RevenueTracker | validation-agent | ai-agent-dev | revenue_events | P0 |
| 24-hooks | Claude SDK Hooks | — | _shared/hooks | — | ai_audit_log | P2 |
| 25-subagents | Validation Subagents | — | idea-validator | multiple | — | P2 |

### ADVANCED Phase — Market Validation (40-43)

| ID | Task | Screen | Edge Function | Subagent | Schema | Priority |
|----|------|--------|---------------|----------|--------|----------|
| 40-overview | Phase Overview | ValidationLab | validation-agent | startup-expert | — | P1 |
| 41-channels | Channel Discovery | ChannelMapper | validation-agent | startup-expert | channel_tests | P1 |
| 42-conversion | Channel Testing | ChannelTestDashboard | validation-agent | startup-expert | unit_economics | P1 |
| 43-scale | Growth & Scaling | GrowthDashboard | validation-agent | startup-expert, doc-writer | growth_tracking | P2 |

---

## 19-task-dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                    TASK DEPENDENCY GRAPH                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  CORE PHASE (01-06)                                               │
│  ─────────────────                                                │
│  01-customer ──► 02-interviews ──► 03-pain ──► 04-landing ──► 05-demand ──► 06-decision
│                                                                   │
│  TECHNICAL DEPENDENCIES                                           │
│  ─────────────────────                                            │
│  06-thought-signatures ──► 05-edge-function ──┬──► 07-score       │
│                                               ├──► 08-market      │
│                                               └──► 24-hooks       │
│                                                                   │
│  07-score + 08-market ──► 09-decision ──► 25-subagents           │
│                                                                   │
│  MVP PHASE (20-25)                                                │
│  ────────────────                                                 │
│  06-decision ──► 20-overview ──► 21-scope ──► 22-testing ──► 23-revenue
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Dependency Table

| Task | Blocked By | Blocks |
|------|------------|--------|
| 01-customer | — | 02-interviews |
| 02-interviews | 01-customer | 03-pain |
| 03-pain | 02-interviews | 04-landing |
| 04-landing | 03-pain | 05-demand |
| 05-demand | 04-landing | 06-decision |
| 06-decision | 05-demand | 20-overview |
| 05-edge-function | 06-thought-signatures | 07-score, 08-market, 09-decision, 24-hooks |
| 07-score-problem | 05-edge-function | 09-decision |
| 08-market-analysis | 05-edge-function | 09-decision |
| 09-decision | 07-score, 08-market | 25-subagents |

---

## 20-execution-order

### P0 Tasks (Do First)

| Order | Task | File | Reason | Effort |
|-------|------|------|--------|--------|
| 1 | Thought Signatures | 06-thought-signatures.md | Blocks multi-turn Gemini | 4h |
| 2 | Edge Function Setup | 05-edge-function.md | Needs thought signatures | 6h |
| 3 | Customer Discovery | 01-customer.md | ICP required for validation | 4-8h |
| 4 | Pain Validation | 03-pain.md | Pain points from interviews | 4-8h |
| 5 | First Revenue | 23-revenue.md | First paying customers | 8h |

### P1 Tasks (Do Next)

| Order | Task | File | Reason | Effort |
|-------|------|------|--------|--------|
| 1 | Score Problem | 07-score-problem.md | Feeds go/no-go | 4h |
| 2 | Market Analysis | 08-market-analysis.md | Feeds go/no-go | 6h |
| 3 | Go/No-Go Logic | 09-go-no-go.md | Needs 07 + 08 | 6h |
| 4 | Demand Testing | 04-landing.md, 05-demand.md | Landing page test | 8-12h |
| 5 | MVP Definition | 21-scope.md | Define MVP scope | 8h |
| 6 | User Testing | 22-testing.md | User friction analysis | 8h |

### P2 Tasks (Enhancements)

| Order | Task | File | Reason | Effort |
|-------|------|------|--------|--------|
| 1 | Claude SDK Hooks | 24-hooks.md | Security/audit | 4h |
| 2 | Validation Subagents | 25-subagents.md | Parallel processing | 8h |
| 3 | Channel Discovery | 41-channels.md | GTM channels | 6h |
| 4 | Growth Dashboard | 43-scale.md | Scaling playbook | 8h |

---

## 21-implementation-plan

### Phase 1: Technical Foundation (Week 1)

| Task | File | Priority | Effort |
|------|------|----------|--------|
| Gemini 3 Thought Signatures | 06-thought-signatures-gemini3.md | P0 | 4h |
| idea-validator Edge Function | 05-edge-function-idea-validator.md | P0 | 6h |
| Core DB Tables | 82-data-plan.md migrations | P0 | 4h |
| Shared AI Client | _shared/ai-client.ts | P0 | 2h |

### Phase 2: Core Validation Flow (Weeks 2-3)

| Task | Screen | Priority | Effort |
|------|--------|----------|--------|
| 01-customer | ICPDefinition | P0 | 4-8h |
| 02-interviews | InterviewTracker | P0 | 8-12h |
| 03-pain | PainPointMatrix | P0 | 4-8h |
| 07-score-problem | score_problem action | P1 | 4h |

### Phase 3: Demand Testing (Weeks 4-5)

| Task | Screen | Priority | Effort |
|------|--------|----------|--------|
| 04-landing | LandingPageBuilder | P1 | 8-12h |
| 05-demand | DemandTestDashboard | P1 | 6-10h |
| 08-market-analysis | analyze_market action | P1 | 6h |
| 06-decision | DecisionMatrix | P1 | 6-10h |

### Phase 4: Quick Validation Mode (Week 6)

| Task | Screen | Priority | Effort |
|------|--------|----------|--------|
| Quick Validate Form | QuickValidate | P0 | 4h |
| Chat Validator | ChatValidator | P1 | 8h |
| Validation Dashboard | ValidationDashboard | P0 | 8h |
| Score Visualization | ScoreCard | P0 | 4h |

### Phase 5: Market & Competitor (Weeks 7-8)

| Task | Screen | Priority | Effort |
|------|--------|----------|--------|
| Market Analysis Screen | MarketAnalysis | P0 | 8h |
| Competitor Intel Screen | CompetitorIntel | P0 | 8h |
| market-research-agent | Edge Function | P1 | 8h |
| competitor-agent | Edge Function | P1 | 8h |

### Phase 6: Financial & Roadmap (Weeks 9-10)

| Task | Screen | Priority | Effort |
|------|--------|----------|--------|
| Financial Projections | FinancialProjections | P1 | 8h |
| Roadmap Builder | RoadmapBuilder | P1 | 6h |
| financial-agent | Edge Function | P2 | 8h |
| roadmap-agent | Edge Function | P2 | 6h |

### Phase 7: MVP Phase Support (Weeks 11-12)

| Task | Screen | Priority | Effort |
|------|--------|----------|--------|
| 21-scope | MVPBuilder | P1 | 8h |
| 22-testing | UserTesting | P1 | 8h |
| 23-revenue | RevenueTracker | P0 | 8h |
| 24-hooks | Security Layer | P2 | 4h |

---

## 22-core-milestones

### Success Criteria

| Metric | Target | Validation Signal |
|--------|--------|-------------------|
| Interviews completed | 15+ | Problem confirmed by real users |
| Strong signals | 5+ | Genuine interest (asked price, timing) |
| Pain points validated | 3+ | Industry data confirms interview findings |
| Landing page conversion | 2%+ | Market demand exists |
| Go/No-Go decision | Made | Data-driven proceed/pivot/stop |

### CORE Phase Wiring Summary

| Task | Edge Function | Schema | Skill | Model |
|------|---------------|--------|-------|-------|
| 01-customer | validation-agent | icp_definitions | /startup | gemini-3-flash |
| 02-interviews | validation-agent | interviews | /feature-dev | gemini-3-flash |
| 03-pain | validation-agent | pain_points | /startup | gemini-3-pro |
| 04-landing | — | landing_pages | /frontend-design | gemini-3-flash |
| 05-demand | validation-agent | demand_tests | /startup | gemini-3-flash |
| 06-decision | validation-agent | validation_decisions | /startup | gemini-3-pro |

### Phase Gate Logic

```
┌─────────────────────────────────────────────────────────────────┐
│                   CORE PHASE GATE DECISION                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Score ≥ 4.0  →  ✅ PROCEED TO MVP                               │
│  │                                                                │
│  │   • 8+ strong signals from 15 interviews                      │
│  │   • 70%+ industry evidence alignment                          │
│  │   • 2%+ landing page conversion                               │
│  │                                                                │
│  Score 3.0-3.9  →  🟡 ADDRESS WEAK AREAS                         │
│  │                                                                │
│  │   • Run 5 more interviews in weak segment                     │
│  │   • A/B test landing page headline                            │
│  │   • Re-run demand test                                        │
│  │                                                                │
│  Score 2.0-2.9  →  🔄 PIVOT                                      │
│  │                                                                │
│  │   • Redefine ICP based on interview feedback                  │
│  │   • Consider adjacent problem                                 │
│  │   • Run new validation cycle                                  │
│  │                                                                │
│  Score < 2.0  →  🛑 STOP                                         │
│                                                                   │
│       • Problem not validated                                    │
│       • Archive learnings                                        │
│       • Start fresh with new idea                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 23-quick-reference

| What | Location |
|------|----------|
| Task Index | startup-system/plan/01-idea/index-idea.md |
| Data Plan | startup-system/plan/01-idea/82-data-plan.md |
| CORE Tasks | startup-system/plan/01-idea/01-core.md |
| Edge Function Spec | startup-system/plan/01-idea/05-edge-function-idea-validator.md |
| Validation Components | src/components/validation/ |
| Validation Page | src/pages/ValidationLab.tsx |
| Edge Functions | supabase/functions/validation-agent/, supabase/functions/idea-validator/ |
| Database Migrations | supabase/migrations/ |
| Agent Definitions | .claude/agents/ |
| Gemini 3 Docs | knowledge/gemeni/docs-gemeni/gemini-3.md |

---

## 24-summary

The Startup Validator transforms idea validation from **4-8 weeks to 30 seconds** using:

**Two Validation Modes:**
- **Mode A: Quick Validation** — 30 seconds to 5 minutes, IdeaProof-style instant scoring
- **Mode B: Deep Validation** — 4-8 weeks Lean Startup methodology with interviews

**Key Components:**
- **23 Tasks** across CORE (9), MVP (6), ADVANCED (4), REFERENCE (4) phases
- **8 AI Agents**: Orchestrator, Validation, Market, Competitor, Financial, Roadmap + 4 Subagents
- **16 Screens**: ValidationLab, ICPDefinition, InterviewTracker, PainPointMatrix, LandingPageBuilder, DemandTestDashboard, DecisionMatrix, MVPBuilder, UserTesting, RevenueTracker, ChannelMapper, GrowthDashboard + Quick screens
- **32 Database Tables**: 11 existing + 16 deep validation + 6 quick validation
- **3 Edge Functions**: validation-agent (exists), idea-validator (new), market-research-agent (future)
- **3-Panel Layout**: Context (20%), Work (55%), Intelligence (25%)

**CORE Phase Success Criteria:**
- 15+ customer interviews completed
- 5+ strong validation signals
- 2%+ landing page conversion
- Go/No-Go score ≥ 4.0 to proceed

**Key Metrics Target:**
- Score >70 = Build with confidence
- LTV:CAC >5:1 = Sustainable economics
- Payback <12 months = Capital efficient

---

*Document Version 2.0 — Merged Quick + Deep Validation Plans*
*Source: startup-system/plan/validator/ + startup-system/plan/01-idea/*
*Generated for PRD v6.1 — 2026-02-03*
