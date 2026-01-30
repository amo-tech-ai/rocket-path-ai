# StartupAI — Startup Playbooks Master Guide

> **Version:** 1.0 | **Date:** January 29, 2026  
> **Purpose:** Comprehensive playbook system for AI-powered startup development  
> **Status:** Active

---

## Executive Summary

StartupAI Playbooks transform the startup journey from chaotic guesswork into a **structured, AI-powered operating system**. Each playbook is an industry-aware, stage-specific, automated workflow that combines **prompt packs**, **AI agents**, **wizards**, **dashboards**, and **automations** to guide founders from idea to investor-ready.

### Key Value Proposition

| What | Why It Matters |
|------|----------------|
| **Industry-Aware** | FinTech ≠ Healthcare ≠ SaaS — questions, metrics, and advice adapt automatically |
| **Stage-Specific** | Pre-Seed gets vision questions; Series A gets unit economics |
| **Automated** | AI selects the right playbook from context — no manual pack selection |
| **Agentic** | Agents own tasks end-to-end: research, draft, apply, monitor |
| **One Answer, Many Places** | Enter data once; it flows to profile, canvas, pitch, and tasks |
| **AI Agent Expertise** | AI becomes a true startup expert per industry with knowledge injection, benchmarks, and contextual advice beyond generic prompts |
| **Static Knowledge Injection** | Each industry playbook includes embedded expertise (success stories, failure patterns, investor expectations, red flags, terminology) injected into every prompt at runtime |

---

## Table of Contents

1. [Playbook Architecture](#1-playbook-architecture)
2. [Core Playbooks](#2-core-playbooks)
3. [Advanced Playbooks](#3-advanced-playbooks)
4. [Screens & Wizards](#4-screens--wizards)
5. [AI Agents by Playbook](#5-ai-agents-by-playbook)
6. [Automations & Workflows](#6-automations--workflows)
7. [Industry Strategy Integration](#7-industry-strategy-integration)
8. [Prompt Packs Mapping](#8-prompt-packs-mapping)
9. [Edge Functions & Schema](#9-edge-functions--schema)
10. [Implementation Plan](#10-implementation-plan)
11. [Use Cases & Real-World Examples](#11-use-cases--real-world-examples)
12. [Improvement Recommendations](#12-improvement-recommendations)

---

## 1. Playbook Architecture

### System Overview

```
┌────────────────────────────────────────────────────────────────────┐
│                    STARTUPAI PLAYBOOK SYSTEM                        │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐            │
│  │   FOUNDER   │───▶│  INDUSTRY   │───▶│   ROUTER    │            │
│  │   SELECTS   │    │  DETECTED   │    │  (Context)  │            │
│  │   INDUSTRY  │    │             │    │             │            │
│  └─────────────┘    └─────────────┘    └──────┬──────┘            │
│                                                │                    │
│         ┌──────────────────────────────────────┼───────────────┐   │
│         │                                      │               │   │
│         ▼                                      ▼               ▼   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐            │
│  │   CORE      │    │  ADVANCED   │    │  INDUSTRY   │            │
│  │  PLAYBOOKS  │    │  PLAYBOOKS  │    │  PLAYBOOKS  │            │
│  │             │    │             │    │             │            │
│  │ • Onboarding│    │ • Fundraise │    │ • FinTech   │            │
│  │ • Validator │    │ • Scale     │    │ • Healthcare│            │
│  │ • Canvas    │    │ • Pivot     │    │ • SaaS      │            │
│  │ • Pitch     │    │ • Exit      │    │ • +10 more  │            │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘            │
│         │                  │                  │                    │
│         └──────────────────┼──────────────────┘                    │
│                            │                                       │
│                     ┌──────▼──────┐                                │
│                     │   PROMPT    │                                │
│                     │    PACKS    │                                │
│                     │  (28 steps) │                                │
│                     └──────┬──────┘                                │
│                            │                                       │
│         ┌──────────────────┼──────────────────┐                    │
│         │                  │                  │                    │
│         ▼                  ▼                  ▼                    │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐            │
│  │   WIZARDS   │    │    AI       │    │ AUTOMATIONS │            │
│  │   (4-step)  │    │   AGENTS    │    │  (Triggers) │            │
│  │             │    │             │    │             │            │
│  └─────────────┘    └─────────────┘    └─────────────┘            │
│         │                  │                  │                    │
│         └──────────────────┼──────────────────┘                    │
│                            │                                       │
│                     ┌──────▼──────┐                                │
│                     │   OUTPUTS   │                                │
│                     │ Profile/    │                                │
│                     │ Canvas/Deck │                                │
│                     │ /Tasks      │                                │
│                     └─────────────┘                                │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### Playbook Categories

| Category | Description | Playbooks Included |
|----------|-------------|-------------------|
| **Core** | Essential startup fundamentals | Onboarding, Idea Validation, Lean Canvas, Pitch Deck |
| **Advanced** | Growth and scaling | GTM, Fundraising, Team Building, Operations |
| **Industry** | Vertical-specific guidance | 13 industries with tailored questions, metrics, playbooks |
| **Stage** | Milestone-specific | Pre-Seed, Seed, Series A, Growth |

---

## 2. Core Playbooks

### 2.1 Onboarding Playbook

**Purpose:** Transform a rough idea into a structured startup profile in 4 steps

| Step | Screen | Wizard | Agent | Outputs |
|------|--------|--------|-------|---------|
| 1 | Industry Selection | Industry Picker | Industry Expert | `industry`, `sub_category` |
| 2 | Problem Definition | Problem Wizard | Problem Sharpener | `who`, `struggle`, `why_now` |
| 3 | Team/Founder | Founder Fit Wizard | Founder Analyst | `founder_market_fit`, `gaps` |
| 4 | One-Liner | Pitch Generator | Pitch Writer | `one_sentence_pitch` |

**Prompt Packs Used:**
- `problem-validation` (Step 1-2)
- `founder-fit` (Step 3)
- `one-liner-generator` (Step 4)

**Real-World Example:**
> Maria selects "FinTech — Payments." The wizard asks about compliance, CAC/LTV, and payment metrics. Her answers save to profile and later pre-fill pitch deck and canvas.

**Chatbot Integration:**
- Context-aware suggestions at each step
- "Sharpen my problem statement"
- "What questions will investors ask?"

---

### 2.2 Idea Validation Playbook

**Purpose:** Validate startup idea with structured scoring and actionable tasks

| Validation Type | Duration | Agent | Outputs |
|-----------------|----------|-------|---------|
| **Quick Validate** | 2-3 min | Validator Agent | Score, top 3 risks, 3 tasks |
| **Deep Validate** | 10-15 min | Deep Analysis Agent | Full scorecard, market data, competitive intel |
| **Investor Lens** | 5-7 min | Investor Simulator | Red flags, elephant questions, deal-breakers |

**Validation Scorecard:**

| Dimension | Weight | Metrics |
|-----------|--------|---------|
| Problem Clarity | 20% | Who/struggle/why-now defined |
| Market Size | 15% | TAM/SAM/SOM estimated |
| Solution Fit | 15% | Solution matches problem |
| Competitive Position | 15% | Differentiation clear |
| Team Fit | 10% | Founder-market fit score |
| Traction | 15% | Evidence of demand |
| Business Model | 10% | Revenue path clear |

**Prompt Packs Used:**
- `problem-validation`
- `idea-validation`
- `competitor-analysis`

**Automations:**
- Auto-generate validation tasks after scoring
- Trigger follow-up validation after 30 days
- Alert on competitive landscape changes

---

### 2.3 Lean Canvas Playbook

**Purpose:** Build a complete Lean Canvas from validated inputs

| Canvas Box | Source Data | Agent | Enhancement |
|------------|-------------|-------|-------------|
| **Problem** | Onboarding Step 2 | Problem Agent | Top 3 problems ranked |
| **Customer Segments** | Market research | ICP Builder | First buyer profile |
| **Unique Value Prop** | One-liner + problem | UVP Generator | A/B test variants |
| **Solution** | Product description | Solution Agent | Must-have features |
| **Channels** | Industry playbook | Channel Advisor | Top 3 channels ranked |
| **Revenue Streams** | Pricing analysis | Pricing Agent | 3 pricing models |
| **Cost Structure** | Business model | Cost Analyst | Fixed vs variable |
| **Key Metrics** | Industry benchmarks | Metrics Agent | Stage-appropriate KPIs |
| **Unfair Advantage** | Moat analysis | Moat Identifier | Defensibility score |

**Prompt Packs Used:**
- `lean-canvas-generator`
- `customer-archetype`
- `pricing-strategy`

**Dashboard Widgets:**
- Canvas completeness score
- Box-by-box strength rating
- Investor-readiness indicator

---

### 2.4 Pitch Deck Playbook

**Purpose:** Generate investor-ready pitch deck with industry-specific best practices

| Step | Screen | Agent | Output |
|------|--------|-------|--------|
| 1 | Template Selection | Template Advisor | Template style + slide count |
| 2 | Smart Interview | Industry Expert | 8 industry questions answered |
| 3 | Content Generation | Deck Writer | All slides with bullets |
| 4 | Visual Enhancement | Visual Agent | Design suggestions |
| 5 | Review & Refine | Critic Agent | Elephant identifier, red flags |

**Industry-Specific Decks:**

| Industry | Slide Emphasis | Unique Slides |
|----------|---------------|---------------|
| **SaaS** | Traction, Retention | Net Revenue Retention |
| **FinTech** | Compliance, Trust | Regulatory Pathway |
| **Healthcare** | Clinical Evidence | FDA/CE Pathway |
| **Marketplace** | Liquidity, Take Rate | Supply/Demand Balance |

**Prompt Packs Used:**
- `investor-pitch-builder`
- Industry-specific pitch packs (SaaS, FinTech, Healthcare, etc.)

**AI Features:**
- Before/after comparison
- Investor question predictor
- Competitive positioning matrix

---

## 3. Advanced Playbooks

### 3.1 Go-to-Market (GTM) Playbook

**Purpose:** Define and execute market entry strategy

| Phase | Wizard | Agent | Key Outputs |
|-------|--------|-------|-------------|
| **ICP Definition** | Customer Builder | ICP Analyst | 3 ICPs with scoring |
| **Positioning** | Positioning Wizard | Positioning Agent | Category, differentiation |
| **Channel Strategy** | Channel Selector | Channel Optimizer | Top 3 channels, cost/channel |
| **Launch Plan** | Launch Planner | Launch Coordinator | 12-week launch calendar |
| **Metrics Setup** | Metrics Wizard | Analytics Agent | Dashboard with KPIs |

**Prompt Packs Used:**
- `gtm-strategy`
- `customer-archetype`
- `competitor-analysis`

**Automations:**
- Weekly channel performance review
- ICP refinement based on conversion data
- Competitive alert monitoring

---

### 3.2 Fundraising Playbook

**Purpose:** Prepare, execute, and close funding rounds

| Phase | Screen | Agent | Outputs |
|-------|--------|-------|---------|
| **Readiness** | Investment Ready | Readiness Analyst | Checklist, gaps |
| **Materials** | Doc Prep | Doc Generator | Deck, data room, one-pager |
| **Targets** | Investor CRM | Investor Research | 50+ investors matched |
| **Outreach** | Campaign Manager | Outreach Agent | Personalized sequences |
| **Pipeline** | Deal Tracker | Pipeline Manager | Stage tracking, follow-ups |
| **Close** | Term Sheet | Deal Analyst | Term comparison, negotiation |

**Investor Doc Wizard:**

| Document | Template | Agent | Time to Generate |
|----------|----------|-------|------------------|
| Pitch Deck | Industry-specific | Deck Agent | 5-10 min |
| One-Pager | Executive summary | Summary Agent | 2-3 min |
| Financial Model | Stage-appropriate | Model Agent | 10-15 min |
| Data Room | Due diligence | Org Agent | Manual + auto |

**Prompt Packs Used:**
- `investor-pitch-builder`
- Funding prompts (Capital Requirements, Milestones, Outreach)

---

### 3.3 Startup Roadmap Playbook

**Purpose:** Create actionable 12-month development plan

| Quarter | Focus | Wizard | Key Deliverables |
|---------|-------|--------|------------------|
| **Q1** | Foundation | MVP Planner | Core product, first users |
| **Q2** | Validation | Validation Tracker | PMF signals, pivot/proceed |
| **Q3** | Growth | Growth Planner | Scaling playbook |
| **Q4** | Scale | Scale Advisor | Team, process, funding |

**Roadmap Dashboard:**
- Milestone tracker with dependencies
- Resource allocation heatmap
- Risk register with mitigations
- Auto-generated weekly review

---

## 4. Screens & Wizards

### 4.1 Screen Inventory

| Screen | Playbook(s) | Primary Agent | Key Actions |
|--------|-------------|---------------|-------------|
| **Dashboard** | All | Dashboard Agent | Overview, alerts, tasks |
| **Profile** | Onboarding | Profile Agent | Edit startup data |
| **Validator** | Validation | Validator Agent | Run validation, view scores |
| **Canvas** | Lean Canvas | Canvas Agent | Build/edit canvas boxes |
| **Pitch Deck** | Pitch | Deck Agent | Generate, edit, export |
| **Investor CRM** | Fundraising | CRM Agent | Track investors, pipeline |
| **Tasks** | All | Task Agent | View, complete, generate |
| **Documents** | All | Doc Agent | Store, organize, generate |
| **Settings** | All | Config Agent | Preferences, integrations |
| **AI Chat** | All | Chat Router | Ask anything, contextual |

### 4.2 Wizard Structure

| Wizard | Steps | Duration | Outputs |
|--------|-------|----------|---------|
| **Onboarding** | 4 | 5-10 min | Profile, one-liner |
| **Validation** | 3 | 3-15 min | Score, tasks, report |
| **Canvas Builder** | 9 | 15-20 min | Complete canvas |
| **Pitch Generator** | 5 | 10-15 min | Full deck |
| **GTM Planner** | 5 | 20-30 min | Launch plan |
| **Fundraising Prep** | 6 | 30-45 min | All investor materials |

### 4.3 Wizard UX Pattern

```
┌────────────────────────────────────────────────────────────┐
│  WIZARD HEADER                                              │
│  [Step 1] [Step 2] [Step 3] [Step 4]                       │
│   ●────────●────────○────────○                             │
│  "Problem Definition"                                       │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  LEFT PANEL              MAIN PANEL         RIGHT PANEL     │
│  ┌──────────┐            ┌──────────┐      ┌──────────┐    │
│  │ Context  │            │ Current  │      │ AI       │    │
│  │          │            │ Question │      │ Assist   │    │
│  │ • Prior  │            │          │      │          │    │
│  │   answers│            │ [Input]  │      │ Suggest  │    │
│  │ • Profile│            │ [Field]  │      │ ions     │    │
│  │ • Tips   │            │          │      │          │    │
│  │          │            │ [Help]   │      │ [+Add]   │    │
│  └──────────┘            └──────────┘      └──────────┘    │
│                                                             │
├────────────────────────────────────────────────────────────┤
│  [Back]                                [Save & Continue →] │
└────────────────────────────────────────────────────────────┘
```

---

## 5. AI Agents by Playbook

### 5.1 Agent Inventory

| Agent | Type | Playbook(s) | Autonomy | Primary Function |
|-------|------|-------------|----------|------------------|
| **Industry Expert** | Research | All | Suggest | Industry-specific questions, benchmarks |
| **Problem Sharpener** | Planner | Onboarding, Validation | Act w/ Approval | Who/struggle/why-now refinement |
| **Validator Agent** | Research | Validation | Suggest | Idea scoring, risk identification |
| **Canvas Builder** | Planner | Lean Canvas | Act w/ Approval | Box-by-box canvas generation |
| **Deck Writer** | Operator | Pitch Deck | Act w/ Approval | Slide content generation |
| **Critic Agent** | Research | Pitch Deck | Suggest | Red flags, elephant questions |
| **Investor Research** | Research | Fundraising | Suggest | Investor matching, personalization |
| **Outreach Agent** | Operator | Fundraising | Act w/ Approval | Email sequences, follow-ups |
| **Task Generator** | Operator | All | Autonomous | Create tasks from outputs |
| **Chat Router** | Orchestrator | All | Suggest | Route chat to correct agent |

### 5.2 Agent Configuration

| Agent | Model | Temperature | Max Tokens | Tools |
|-------|-------|-------------|------------|-------|
| Industry Expert | Gemini 3 Flash | 0.3 | 2048 | Search, Structured Output |
| Problem Sharpener | Claude Sonnet | 0.4 | 1024 | None |
| Validator Agent | Gemini 3 Pro | 0.2 | 4096 | Search, Analysis |
| Deck Writer | Claude Sonnet | 0.5 | 8192 | Structured Output |
| Critic Agent | Claude Sonnet | 0.6 | 2048 | None |
| Investor Research | Gemini 3 Pro | 0.3 | 4096 | Search, Enrichment |

### 5.3 Agent Routing Logic

```yaml
routing_table:
  onboarding_step_1:
    agent: industry_expert
    pack: problem-validation
    context: [industry, company_description]
    
  onboarding_step_2:
    agent: problem_sharpener
    pack: problem-validation
    context: [industry, step_1_data]
    
  onboarding_step_3:
    agent: founder_analyst
    pack: founder-fit
    context: [industry, stage, team_info]
    
  onboarding_step_4:
    agent: pitch_writer
    pack: one-liner-generator
    context: [all_prior_steps]
    
  validator_quick:
    agent: validator_agent
    pack: idea-validation
    context: [idea_text, industry]
    
  validator_deep:
    agent: validator_agent
    pack: [idea-validation, competitor-analysis]
    context: [idea_text, industry, market_data]
    
  canvas_generate:
    agent: canvas_builder
    pack: lean-canvas-generator
    context: [profile, validation_data]
    
  pitch_generate:
    agent: deck_writer
    pack: industry_pitch_pack
    context: [profile, canvas, interview_data]
    
  pitch_review:
    agent: critic_agent
    pack: pitch-review
    context: [deck_slides]
```

---

## 6. Automations & Workflows

### 6.1 Automation Triggers

| Trigger | Condition | Action | Playbook |
|---------|-----------|--------|----------|
| **Onboarding Complete** | Step 4 saved | Generate 5 validation tasks | Onboarding |
| **Validation Score < 60** | Quick validate done | Suggest pivot or refine | Validation |
| **Canvas Incomplete** | 3+ boxes empty after 7 days | Reminder + AI suggestions | Lean Canvas |
| **Pitch Deck Generated** | Deck created | Run critic agent | Pitch Deck |
| **Investor Added** | New investor in CRM | Research + personalize | Fundraising |
| **Task Overdue** | Due date passed | Alert + reschedule suggest | All |
| **Competitive Alert** | New competitor detected | Update positioning | GTM |

### 6.2 Workflow Templates

#### Validation → Tasks Workflow

```yaml
workflow:
  name: validation_to_tasks
  trigger: validation_complete
  steps:
    - step: analyze_gaps
      agent: validator_agent
      input: validation_report
      output: gap_list
      
    - step: generate_tasks
      agent: task_generator
      input: gap_list
      output: task_list
      
    - step: prioritize_tasks
      agent: task_generator
      input: task_list
      output: prioritized_tasks
      
    - step: apply_tasks
      action: insert_to_tasks_table
      input: prioritized_tasks
```

#### Pitch Deck Review Workflow

```yaml
workflow:
  name: pitch_deck_review
  trigger: deck_generated
  steps:
    - step: run_critic
      agent: critic_agent
      input: deck_slides
      output: critique
      
    - step: identify_elephants
      agent: critic_agent
      input: deck_slides
      output: elephant_questions
      
    - step: generate_improvements
      agent: deck_writer
      input: [critique, elephant_questions]
      output: improvement_suggestions
      
    - step: notify_founder
      action: send_notification
      input: [critique, improvement_suggestions]
```

### 6.3 Dashboard Automations

| Widget | Update Frequency | Data Source | Agent |
|--------|------------------|-------------|-------|
| Validation Score | On validation run | validation_reports | Validator |
| Canvas Completeness | Real-time | lean_canvases | Canvas Builder |
| Pitch Readiness | On deck update | pitch_decks | Critic |
| Task Progress | Real-time | tasks | Task Generator |
| Competitive Intel | Weekly | External APIs | Competitor Agent |
| Investor Pipeline | Real-time | investor_interactions | CRM Agent |

---

## 7. Industry Strategy Integration

### 7.1 Industry Question Packs

| Industry | Questions | Unique Focus | Investor Psychology |
|----------|-----------|--------------|---------------------|
| **AI SaaS** | 8 | Workflow automation, data moat | Net retention > 120% |
| **FinTech** | 8 | Compliance, trust, unit economics | Regulatory moat |
| **Healthcare** | 8 | Clinical evidence, FDA pathway | Team credibility |
| **Retail/eCommerce** | 8 | Revenue impact, platform fit | Fear of platform building it |
| **Cybersecurity** | 8 | Threat detection, false positives | Compliance as moat |
| **Logistics** | 8 | Cost savings, integration | Hard ROI data |
| **Education** | 8 | Learning outcomes, procurement | Long sales cycle strategy |
| **Legal** | 8 | Time savings, accuracy | Confidentiality controls |
| **Financial Services** | 8 | Risk/returns, regulatory status | Institutional partnerships |
| **Sales & Marketing** | 8 | Revenue attribution, automation | CAC reduction proof |
| **CRM & Social** | 8 | Engagement quality, data moat | Behavioral data value |
| **Events** | 8 | Time savings, recurring model | Seasonality strategy |
| **eCommerce** | 8 | Unit economics, data flywheel | Before/after merchant data |

### 7.2 Industry Playbook Schema

```typescript
interface IndustryPlaybook {
  industry_id: string;
  narrative_arc: string;
  slide_emphasis: SlideEmphasis[];
  investor_psychology: string;
  red_flags: string[];
  power_phrases: string[];
  weak_phrases: string[];
  benchmark_metrics: BenchmarkMetric[];
  prompt_context: string;
  example_hooks: string[];
  competitive_framing: string;
}
```

### 7.3 Cross-Industry Universal Rules

| Rule | Application |
|------|-------------|
| **Problem slide = numbers** | Cost, time, risk — never just qualitative |
| **Solution = before/after** | Transformation, not feature list |
| **Traction = graph-ready** | Numbers with timeframes |
| **Competition = honest** | Never "no competitors" |
| **Team = achievements** | "Built X at Y" > "VP of Engineering" |
| **Ask = specific** | "$2M seed: 50% product, 30% GTM, 20% ops" |

### 7.4 AI Agent Expertise

**Purpose:** Make the AI a true startup expert per industry with knowledge injection, benchmarks, and contextual advice that goes beyond generic prompts.

The AI agent becomes a **true startup expert** per industry by combining:

| Component | Description | Example |
|-----------|-------------|---------|
| **Industry Benchmarks** | Embedded KPIs and metrics specific to the vertical | FinTech: "Good CAC payback < 12 months; Great < 6 months" |
| **Investor Psychology** | What investors care about in this industry | Healthcare: "Clinical validation is non-negotiable" |
| **Success Patterns** | What winning startups in this space do | SaaS: "Net retention > 120% signals product-market fit" |
| **Failure Patterns** | Common mistakes that kill startups | Marketplace: "Ignoring supply-side quality leads to churn" |
| **Terminology** | Industry-specific language and jargon | Legal: "Matter management", "e-discovery", "billable hours" |
| **Red Flags** | What kills investor interest | FinTech: "No regulatory compliance plan = deal-breaker" |
| **Power Phrases** | Language that resonates with investors | Cybersecurity: "Reduced false positives by 80%" |
| **Weak Phrases** | Language to avoid | Generic: "AI-powered platform", "disruptive", "world-class" |

**Agent Expertise Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI AGENT EXPERTISE FLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   1. Agent receives context (industry, stage, module)            │
│   2. Agent loads industry-specific expertise:                    │
│      ├── Benchmarks (with good/great thresholds)                 │
│      ├── Investor psychology (what they fear, what excites)      │
│      ├── Success patterns (what winners do)                      │
│      ├── Failure patterns (what kills startups)                  │
│      └── Terminology (jargon, buzzwords)                         │
│   3. Agent applies expertise to every response:                  │
│      ├── Uses industry terminology naturally                     │
│      ├── Cites relevant benchmarks                               │
│      ├── Warns about red flags                                   │
│      └── Suggests power phrases                                  │
│   4. Output sounds like an industry-specific advisor             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.5 Static Knowledge Injection

**Purpose:** Enrich each industry playbook with embedded expertise that gets injected into every prompt at runtime based on `selected_industry`.

**Architecture:**

```
┌─────────────────────────────────────────────────────────────────┐
│                 STATIC KNOWLEDGE INJECTION                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   1. INDUSTRY SELECTED                                           │
│      └── e.g. "FinTech — Payments"                              │
│                                                                  │
│   2. KNOWLEDGE LOOKUP                                            │
│      ├── industry_playbooks (benchmarks, narrative_arc)          │
│      ├── industry_knowledge (success_stories, failure_patterns)  │
│      ├── industry_terminology (jargon, definitions)              │
│      └── industry_benchmarks (KPIs, good/great thresholds)       │
│                                                                  │
│   3. PROMPT ENRICHMENT                                           │
│      ├── Inject INDUSTRY_CONTEXT block into system prompt        │
│      ├── Add BENCHMARKS section with specific metrics            │
│      ├── Include RED_FLAGS and POWER_PHRASES                     │
│      └── Add INVESTOR_PSYCHOLOGY context                         │
│                                                                  │
│   4. RUNTIME EXECUTION                                           │
│      └── Agent uses enriched prompt for expert-level output      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Knowledge Schema:**

```typescript
interface IndustryKnowledge {
  industry_id: string;
  
  // Success stories
  success_stories: {
    company: string;
    what_worked: string;
    metric_proof: string;
  }[];
  
  // Failure patterns
  failure_patterns: {
    pattern: string;
    why_it_fails: string;
    warning_signs: string[];
  }[];
  
  // Investor expectations
  investor_expectations: {
    stage: "pre-seed" | "seed" | "series-a";
    must_have: string[];
    nice_to_have: string[];
    deal_breakers: string[];
  }[];
  
  // Benchmark data
  benchmarks: {
    metric: string;
    good_threshold: string;
    great_threshold: string;
    source?: string;
  }[];
  
  // Red flags
  red_flags: {
    flag: string;
    why_it_kills: string;
  }[];
  
  // Terminology
  terminology: {
    term: string;
    definition: string;
    usage_example: string;
  }[];
}
```

**Example Enriched Prompt (FinTech):**

```text
INDUSTRY CONTEXT: FinTech — Payments
- Regulatory compliance is existential — address it directly
- Show cost/risk reduction with specific numbers
- Trust acquisition is the hardest part — explain GTM for trust
- If payments: show transaction volume trajectory

BENCHMARKS:
- Transaction Volume: Good $1M+/mo, Great $10M+/mo
- Fraud Reduction: Good 30-50%, Great 50%+
- False Positive Rate: Good <5%, Great <2%
- CAC Payback: Good <18mo, Great <12mo

SUCCESS PATTERNS:
- Stripe: Built trust through developer experience first
- Plaid: Became infrastructure, not just a product
- Wise: Led with transparent pricing as differentiator

FAILURE PATTERNS:
- Ignoring regulatory compliance until too late
- Underestimating bank partnership timelines
- Consumer focus without sustainable unit economics

RED FLAGS:
- No regulatory compliance mention
- "We'll figure out licensing later"
- No fraud/risk metrics
- Consumer FinTech without unit economics

POWER PHRASES:
- "Regulatory-first approach"
- "Licensed in X jurisdictions"
- "Reduced fraud by X% while cutting false positives"
- "Bank-grade security"

INVESTOR PSYCHOLOGY:
- Looking for regulatory moat + trust acquisition strategy
- Fear: "Can they survive a regulatory change?"
```

**Implementation Requirements:**

| ID | Requirement | Priority |
|----|-------------|----------|
| K1 | `industry_knowledge` table with schema above | P0 |
| K2 | Edge function `get_industry_knowledge(industry_id)` | P0 |
| K3 | Prompt enrichment function that injects knowledge blocks | P0 |
| K4 | Knowledge content for 13 industries (3+ success stories, 3+ failures, 5+ benchmarks each) | P0 |
| K5 | Stage-specific investor expectations (Pre-Seed, Seed, Series A) | P1 |
| K6 | Knowledge versioning for updates and A/B testing | P2 |

### 7.6 Context-Filtered Injection

**Purpose:** Each feature gets a tailored slice of the playbook — not the full knowledge dump, but the specific expertise relevant to that context. This reduces prompt size, improves relevance, and lowers cost.

**Feature → Knowledge Mapping:**

| Feature | Knowledge Slice | Why This Slice |
|---------|-----------------|----------------|
| **Onboarding** | Failure patterns + Terminology | Guide early decisions with warnings and industry language |
| **Lean Canvas** | GTM patterns + Benchmark data | Validate business model with proven strategies and metrics |
| **Pitch Deck** | Investor expectations + Success stories + Red flags | Make deck investor-ready with what VCs want to see |
| **Validator** | Benchmark data + Red flags + Failure patterns | Score idea against industry standards and common pitfalls |
| **Tasks/Planning** | GTM patterns + Failure patterns | Build actionable roadmap avoiding known mistakes |
| **Chatbot** | All seven knowledge types | Full expert mode for open-ended Q&A |

**Knowledge Types (7 Total):**

| # | Type | Description | Used By |
|---|------|-------------|---------|
| 1 | **Failure Patterns** | Common mistakes that kill startups | Onboarding, Validator, Tasks |
| 2 | **Terminology** | Industry-specific language and jargon | Onboarding, Chatbot |
| 3 | **GTM Patterns** | Go-to-market strategies that work | Canvas, Tasks, Chatbot |
| 4 | **Benchmark Data** | KPIs with good/great thresholds | Canvas, Validator, Chatbot |
| 5 | **Investor Expectations** | What VCs look for at each stage | Pitch, Chatbot |
| 6 | **Success Stories** | What winning startups did right | Pitch, Chatbot |
| 7 | **Red Flags** | What kills investor interest | Pitch, Validator, Chatbot |

**Context-Filtered Injection Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│                 CONTEXT-FILTERED INJECTION                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   1. CONTEXT DETECTED                                            │
│      ├── Industry: FinTech                                       │
│      ├── Stage: Seed                                             │
│      └── Feature: Pitch Deck                                     │
│                                                                  │
│   2. FILTER APPLIED                                              │
│      Feature "Pitch Deck" → Inject:                              │
│        ✓ investor_expectations (must-haves, deal-breakers)       │
│        ✓ success_stories (Stripe, Plaid, Wise)                   │
│        ✓ red_flags (no compliance, no fraud metrics)             │
│        ✗ failure_patterns (not needed for pitch)                 │
│        ✗ gtm_patterns (not needed for pitch)                     │
│        ✗ terminology (minimal, for jargon only)                  │
│                                                                  │
│   3. ENRICHED PROMPT                                             │
│      System prompt includes only the filtered slice              │
│      (~500 tokens instead of ~2000 tokens)                       │
│                                                                  │
│   4. OPTIMIZED OUTPUT                                            │
│      Smaller context = faster, cheaper, more focused             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Edge Function Implementation:**

```typescript
// Filter mapping
const FEATURE_KNOWLEDGE_MAP: Record<Feature, KnowledgeType[]> = {
  onboarding: ["failure_patterns", "terminology"],
  canvas: ["gtm_patterns", "benchmark_data"],
  pitch: ["investor_expectations", "success_stories", "red_flags"],
  validator: ["benchmark_data", "red_flags", "failure_patterns"],
  tasks: ["gtm_patterns", "failure_patterns"],
  chatbot: ["all"] // Full expert mode
};

// Get filtered knowledge based on context
async function getFilteredKnowledge(
  industry_id: string,
  stage: Stage,
  feature: Feature
): Promise<FilteredKnowledge> {
  const knowledgeTypes = FEATURE_KNOWLEDGE_MAP[feature];
  
  if (knowledgeTypes.includes("all")) {
    return await getFullKnowledge(industry_id, stage);
  }
  
  return await getKnowledgeSlice(industry_id, stage, knowledgeTypes);
}

// Inject into prompt
function enrichPromptWithKnowledge(
  basePrompt: string,
  knowledge: FilteredKnowledge
): string {
  return `
${basePrompt}

---
INDUSTRY CONTEXT: ${knowledge.industry_name}

${knowledge.sections.map(s => `
${s.title.toUpperCase()}:
${s.content.map(c => `- ${c}`).join('\n')}
`).join('\n')}
---
`;
}
```

**Benefits:**

| Benefit | Description |
|---------|-------------|
| **Smaller prompts** | ~500 tokens vs ~2000 tokens for full knowledge |
| **Lower cost** | 75% reduction in knowledge injection tokens |
| **Faster response** | Less context = faster model processing |
| **More focused** | Only relevant knowledge = better outputs |
| **Easier testing** | Can A/B test knowledge slices per feature |

---

## 8. Prompt Packs Mapping

### 8.1 Current Prompt Packs

| Pack | Slug | Category | Steps | Maps to Playbook |
|------|------|----------|-------|------------------|
| Problem Validation Framework | `problem-validation` | validation | 3 | Onboarding, Validation |
| Idea Validation Sprint | `idea-validation` | validation | 2 | Validation |
| Perfect One-Liner Generator | `one-liner-generator` | pitch | 3 | Onboarding Step 4 |
| Investor Pitch Builder | `investor-pitch-builder` | pitch | 3 | Pitch Deck |
| AI Lean Canvas Generator | `lean-canvas-generator` | canvas | 3 | Lean Canvas |
| Customer Archetype Builder | `customer-archetype` | canvas | 3 | GTM, Canvas |
| Go-to-Market Strategy Builder | `gtm-strategy` | gtm | 3 | GTM |
| SaaS Pricing Strategy | `pricing-strategy` | pricing | 3 | Revenue Model |
| Competitor Deep Dive | `competitor-analysis` | market | 3 | Validation, GTM |
| Startup Idea Generator | `idea-generator` | ideation | 2 | Ideation |

**Total: 10 packs, 28 steps**

### 8.2 Prompt-to-Playbook Routing

| Context | Module | Prompt Pack(s) |
|---------|--------|----------------|
| Onboarding Step 1 | ideation | `problem-validation` |
| Onboarding Step 2 | market | `problem-validation`, `competitor-analysis` |
| Onboarding Step 3 | founder-fit | `founder-fit` |
| Onboarding Step 4 | pitch | `one-liner-generator` |
| Validator Quick | validation | `idea-validation` |
| Validator Deep | validation | `idea-validation`, `competitor-analysis` |
| Lean Canvas | canvas | `lean-canvas-generator`, `customer-archetype` |
| Pitch Deck | pitch | `investor-pitch-builder`, industry-specific |
| GTM Planning | gtm | `gtm-strategy`, `customer-archetype` |
| Fundraising | funding | Funding prompts, `investor-pitch-builder` |

### 8.3 Prompts by Category

| Category | Prompts | Source File |
|----------|---------|-------------|
| **Ideation** | Problem Snapshot, First Principles, Bad Ideas Blitz, Why Now | `02-ideation.md` |
| **Market** | Competitor List, Market Definition, Who Buys First | `03-prompt-market.md` |
| **Marketing** | Channel Focused, Launch Week Plan, One Channel | `04-marketing.md` |
| **Product** | Product Spec, Roadmap, Feature Scorecard | `05-product.md` |
| **Funding** | Capital Requirements, Investor Matrix, Milestones | `06-funding.md` |
| **Revenue** | Pricing Design, Free vs Trial, One Number | `07-revenue-model.md` |
| **Founder** | Founder-Market Fit, Skill Stack, Risk Appetite | `08-founder-fit.md` |
| **Pitch** | One Sentence Pitch, Elevator Pitch, Elephant Identifier | `09-pitch-prompts.md` |
| **Deck** | Pitch Creation, Pitch Analysis, Investor Visuals | `09.1-pitch-deck.md` |

---

## 9. Edge Functions & Schema

### 9.1 Edge Functions

| Function | Actions | Auth | Purpose |
|----------|---------|------|---------|
| **prompt-pack** | search, get, list, run_step, run_pack, apply | JWT (run/apply) | Unified prompt pack execution |
| **industry-expert-agent** | get_questions, validate_answers | JWT | Industry-specific question handling |
| **onboarding-agent** | step_handler, complete | JWT | Onboarding flow management |
| **validator-agent** | quick, deep, investor_lens | JWT | Idea validation |
| **lean-canvas-agent** | generate, suggest, apply | JWT | Canvas generation |
| **pitch-deck-agent** | generate, review, export | JWT | Deck generation |
| **investor-research-agent** | search, personalize, match | JWT | Investor targeting |

### 9.2 Database Schema

```sql
-- Core Playbook Tables
CREATE TABLE prompt_packs (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- validation, pitch, canvas, gtm, pricing, ideation, market
  industry_tags TEXT[],
  stage_tags TEXT[],
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prompt_pack_steps (
  id UUID PRIMARY KEY,
  pack_id UUID REFERENCES prompt_packs(id),
  step_order INTEGER NOT NULL,
  purpose TEXT NOT NULL,
  prompt_template TEXT NOT NULL,
  input_schema JSONB,
  output_schema JSONB,
  model_preference TEXT DEFAULT 'gemini-3-flash',
  max_tokens INTEGER DEFAULT 2048,
  temperature NUMERIC DEFAULT 0.4
);

CREATE TABLE prompt_runs (
  id UUID PRIMARY KEY,
  startup_id UUID REFERENCES startups(id),
  user_id UUID REFERENCES auth.users(id),
  pack_id UUID REFERENCES prompt_packs(id),
  step_id UUID REFERENCES prompt_pack_steps(id),
  inputs_json JSONB,
  outputs_json JSONB,
  model_used TEXT,
  tokens INTEGER,
  cost_usd NUMERIC,
  latency_ms INTEGER,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Playbook Outputs
CREATE TABLE validation_reports (
  id UUID PRIMARY KEY,
  startup_id UUID REFERENCES startups(id),
  validation_type TEXT, -- quick, deep, investor_lens
  score INTEGER,
  scores_breakdown JSONB,
  risks TEXT[],
  opportunities TEXT[],
  tasks_generated UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lean_canvases (
  id UUID PRIMARY KEY,
  startup_id UUID REFERENCES startups(id),
  problem TEXT[],
  customer_segments TEXT[],
  unique_value_proposition TEXT,
  solution TEXT[],
  channels TEXT[],
  revenue_streams TEXT[],
  cost_structure TEXT[],
  key_metrics TEXT[],
  unfair_advantage TEXT,
  completeness_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pitch_decks (
  id UUID PRIMARY KEY,
  startup_id UUID REFERENCES startups(id),
  template TEXT,
  industry_pack TEXT,
  wizard_data JSONB,
  slides JSONB[], -- Array of slide objects
  critique JSONB,
  export_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 9.3 RLS Policies

```sql
-- Users can only access their startup's data
CREATE POLICY "Users access own startup data"
ON prompt_runs FOR ALL
USING (startup_id IN (
  SELECT id FROM startups WHERE user_id = auth.uid()
));

-- Similar policies for validation_reports, lean_canvases, pitch_decks
```

---

## 10. Implementation Plan

### 10.1 Phase Overview

| Phase | Focus | Duration | Gate |
|-------|-------|----------|------|
| **0: Foundation** | Schema audit, baseline | 1-2 days | Schema agreed |
| **1: Industry Context** | Strategy, playbooks, questions | 2-3 days | Content locked |
| **2: Prompt Library** | All prompts documented, routing | 3-5 days | Routing agreed |
| **3: Implementation** | DB, edge, seed, frontend | 5-8 days | E2E working |
| **4: Integration** | All flows connected, metrics | 2-3 days | PRD success |

### 10.2 Detailed Tasks

#### Phase 0: Foundation

| Task | Owner | Status |
|------|-------|--------|
| Schema audit (Supabase, edge functions) | Backend | ☐ |
| Baseline documentation | Backend | ☐ |
| Change agreement | Product + Eng | ☐ |

#### Phase 1: Industry Context

| Task | Owner | Status |
|------|-------|--------|
| Progress tracker created | Product | ☐ |
| 13 industry playbooks defined | Content | ☐ |
| 8 questions per industry | Content | ☐ |
| Industry logic documented | Eng | ☐ |
| Verification process | QA | ☐ |

#### Phase 2: Prompt Library

| Task | Owner | Status |
|------|-------|--------|
| Library index complete | Content | ☐ |
| Domain prompts (02-09.1) | Content | ☐ |
| Agent routing agreed | Eng | ☐ |
| Categories finalized | Product | ☐ |

#### Phase 3: Implementation

| Task | Owner | Status |
|------|-------|--------|
| DB migration | Backend | ☐ |
| Edge: search function | Backend | ☐ |
| Edge: run function | Backend | ☐ |
| Edge: apply function | Backend | ☐ |
| Seed data | Backend | ☐ |
| Frontend integration | Frontend | ☐ |

#### Phase 4: Integration

| Task | Owner | Status |
|------|-------|--------|
| Onboarding integration | Frontend | ☐ |
| Validator integration | Frontend | ☐ |
| Canvas integration | Frontend | ☐ |
| Pitch integration | Frontend | ☐ |
| Metrics verification | QA | ☐ |

---

## 11. Use Cases & Real-World Examples

### 11.1 Founder Journey: Maria (FinTech)

| Step | Maria's Action | System Response | Output |
|------|----------------|-----------------|--------|
| 1 | Selects "FinTech — Payments" | Industry Expert loads FinTech playbook | Industry set |
| 2 | Describes payment problem | Problem Sharpener refines to who/struggle/why-now | Problem statement |
| 3 | Enters team background | Founder Analyst evaluates fit | Founder-market fit score |
| 4 | Reviews one-liner | Pitch Writer generates options | One-sentence pitch |
| 5 | Runs Quick Validate | Validator scores with FinTech lens | 72/100, compliance risk flagged |
| 6 | Opens Lean Canvas | Canvas Builder pre-fills from profile | 6/9 boxes filled |
| 7 | Generates Pitch Deck | Deck Writer uses FinTech pack | 12-slide deck with compliance slide |
| 8 | Reviews with Critic | Critic Agent identifies elephants | "How do you handle PCI compliance?" |

### 11.2 Founder Journey: James (Healthcare)

| Step | James's Action | System Response | Output |
|------|----------------|-----------------|--------|
| 1 | Selects "Healthcare — Clinical" | Industry Expert loads Healthcare playbook | Industry set |
| 2 | Describes clinical AI tool | Problem Sharpener focuses on patient outcomes | Problem statement |
| 3 | Enters clinical advisor team | Founder Analyst highlights credibility | Team credibility score |
| 4 | Runs Deep Validate | Validator emphasizes clinical evidence | 65/100, FDA path unclear |
| 5 | Generates Pitch Deck | Deck Writer adds FDA pathway slide | Healthcare-specific deck |
| 6 | Reviews deck | Critic flags missing clinical data | "Where's your clinical validation?" |

### 11.3 Use Case Matrix

| Use Case | Playbook | Agents | Outcome |
|----------|----------|--------|---------|
| First-time founder, no idea | Ideation + Onboarding | Idea Generator, Problem Sharpener | Validated idea + profile |
| Experienced founder, needs deck | Pitch Deck | Deck Writer, Critic | Investor-ready deck |
| Raising seed round | Fundraising | Investor Research, Outreach | 50 matched investors + sequences |
| Pivoting idea | Validation + Canvas | Validator, Canvas Builder | New direction validated |
| Scaling GTM | GTM | ICP Builder, Channel Optimizer | Launch plan + metrics |

---

## 12. Improvement Recommendations

### 12.1 Prompt Pack Improvements

| Current Gap | Recommendation | Priority |
|-------------|----------------|----------|
| No team-building pack | Add "Team Building Pack" with hiring, culture, equity | P1 |
| Limited financial modeling | Add "Financial Model Pack" with projections, unit economics | P1 |
| No operations pack | Add "Ops Playbook" for process, tools, vendors | P2 |
| Missing pivot guidance | Add "Pivot Pack" with structured pivot framework | P2 |
| No exit planning | Add "Exit Planning Pack" for M&A, IPO scenarios | P3 |

### 12.2 Agent Improvements

| Current Gap | Recommendation | Priority |
|-------------|----------------|----------|
| Single model per agent | Add model fallback (Gemini → Claude) | P0 |
| No A/B testing | Add output comparison for pack steps | P1 |
| Limited memory | Add conversation memory across sessions | P1 |
| No learning loop | Add feedback loop from user edits | P2 |

### 12.3 Wizard Improvements

| Current Gap | Recommendation | Priority |
|-------------|----------------|----------|
| No save-and-continue | Add progress persistence across sessions | P0 |
| Limited skip logic | Add conditional step skipping based on profile | P1 |
| No collaboration | Add team member invite to wizards | P2 |
| No version history | Add wizard response versioning | P2 |

### 12.4 Dashboard Improvements

| Current Gap | Recommendation | Priority |
|-------------|----------------|----------|
| Static widgets | Add real-time updates with subscriptions | P1 |
| No benchmarking | Add industry benchmark comparison | P1 |
| Limited alerts | Add configurable alert thresholds | P2 |
| No export | Add PDF/PNG dashboard export | P2 |

### 12.5 New Playbooks to Add

| Playbook | Description | Priority |
|----------|-------------|----------|
| **Team Building** | Hiring, culture, equity, org design | P1 |
| **Financial Planning** | Projections, burn, runway, scenarios | P1 |
| **Product Development** | Spec, roadmap, sprint planning | P1 |
| **Customer Success** | Onboarding, retention, expansion | P2 |
| **Legal & Compliance** | Entity, IP, contracts, regulatory | P2 |
| **Pivot Framework** | When to pivot, how, revalidation | P2 |

### 12.6 Edge Function Improvements

| Current Gap | Recommendation | Priority |
|-------------|----------------|----------|
| No rate limiting | Add per-user rate limits | P0 |
| No cost tracking | Add token/cost tracking per startup | P0 |
| No caching | Add response caching for common queries | P1 |
| No batch processing | Add batch run for multiple steps | P2 |

### 12.7 Schema Improvements

| Current Gap | Recommendation | Priority |
|-------------|----------------|----------|
| No soft delete | Add `deleted_at` to all tables | P1 |
| No audit log | Add `audit_log` table for changes | P1 |
| No versioning | Add `version` column for canvases, decks | P1 |
| Limited indexing | Add indexes on frequent queries | P2 |

---

## Appendix A: Prompt Template Examples

### Problem Snapshot Prompt

```
You are an expert startup advisor helping a founder clarify their problem statement.

INDUSTRY: {{industry}}
COMPANY DESCRIPTION: {{company_description}}

Transform this into a structured problem statement:

1. WHO: [Specific persona with job title, company size, or demographic]
2. STRUGGLE: [The specific pain they experience today]
3. WHY NOW: [Why this problem is urgent today, not 5 years ago]

Output as JSON:
{
  "who": "...",
  "struggle": "...",
  "why_now": "...",
  "confidence": 0-100
}
```

### Validation Scorecard Prompt

```
You are an investor evaluating a startup idea.

INDUSTRY: {{industry}}
STAGE: {{stage}}
IDEA: {{idea_text}}
PROBLEM: {{problem_statement}}

Score this idea on:
1. Problem Clarity (0-20): Is the who/struggle/why-now clear?
2. Market Size (0-15): Is this a large, growing market?
3. Solution Fit (0-15): Does the solution match the problem?
4. Competition (0-15): Is there clear differentiation?
5. Team Fit (0-10): Does this team have an edge?
6. Traction (0-15): Is there evidence of demand?
7. Business Model (0-10): Is the revenue path clear?

Output as JSON with scores, total, and top 3 risks.
```

---

## Appendix B: Agent Configuration Templates

### Validator Agent YAML

```yaml
agent:
  name: validator_agent
  type: research
  model: gemini-3-pro
  temperature: 0.2
  max_tokens: 4096
  
tools:
  - name: search
    description: Search for market data and competitors
  - name: structured_output
    description: Return validation scorecard as JSON

prompts:
  quick:
    system: |
      You are a seasoned startup advisor evaluating ideas.
      Industry: {{industry}}
      Stage: {{stage}}
    user: |
      Evaluate this idea: {{idea_text}}
      Return a validation scorecard with scores, risks, and 3 tasks.
      
  deep:
    system: |
      You are conducting deep due diligence on a startup idea.
      Industry: {{industry}}
      Stage: {{stage}}
    user: |
      Conduct thorough analysis of: {{idea_text}}
      Include: market research, competitive analysis, red flags, opportunities.
```

---

## Appendix C: Glossary

| Term | Definition |
|------|------------|
| **Playbook** | A structured workflow combining wizards, agents, and automations |
| **Prompt Pack** | A collection of prompt templates for a specific domain |
| **Wizard** | A multi-step guided flow for data collection |
| **Agent** | An AI component that owns a specific task or analysis |
| **Automation** | A trigger-based action that runs without user initiation |
| **Edge Function** | A serverless function that executes AI logic |
| **Industry Pack** | Industry-specific questions, playbooks, and benchmarks |

---

*Document generated by StartupAI Playbook System*
