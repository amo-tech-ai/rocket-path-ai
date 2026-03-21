# StartupAI Strategy v4.0

> **Version:** 4.3 | **Updated:** 2026-02-09 | **Status:** Plan-Then-Execute Architecture
> **Audience:** Founders, Operators, Accelerators
> **Core Principle:** Understand deeply first, then recommend confidently. Tier A sources only.

---

## 1. How We Think: Plan-Then-Execute

Every part of StartupAI—Coach, Validator, Onboarding, Lean Canvas, Pitch Deck, Chat—follows the same philosophy: **understand deeply first, then recommend confidently**.

When you arrive with a vague idea like "I want to help small businesses with AI," the system doesn't immediately start building slides or filling out forms. Instead, it explores: What kind of small businesses? What problem specifically? Who's the buyer? It researches your industry, pulls benchmarks, and builds a complete picture of your startup context. Only then does it transform your vague requirements into a detailed plan—your Canvas blocks, your validation tasks, your pitch narrative.

This mirrors how the best advisors work. A great mentor doesn't give generic advice; they ask smart questions, understand your unique situation, then give recommendations tailored to you. StartupAI does this at scale by combining multiple AI models: fast models for extraction and search, reasoning models for strategy and analysis. Each agent knows your full context—your canvas, your metrics, your industry—so advice builds on itself instead of starting from scratch every time.

### The Coach: Guided Questioning

The Coach doesn't just answer questions—it guides you through a logical thinking process. When you come with a vague idea like "I want to build something for restaurants," the Coach asks clarifying questions one at a time: "What specific problem do restaurants face that frustrates you?" Then based on your answer, it asks the next logical question: "Who in the restaurant would use this—the owner, manager, or staff?" Each question builds on the last, narrowing down until you have a clear problem, customer, and solution.

### The Coach: Fundraising Strategist

When you're ready to raise money, the Coach becomes your fundraising strategist. Funding-related issues are the #1 reason startups fail, so the Coach helps you navigate this critical phase with expert guidance. It knows the five main funding types—grants, bootstrapping, debt, convertible loans, and equity—and helps you choose the right one for your stage. When you ask "Should I raise from angels or VCs?", the Coach explains that angels invest €10K–€1M with a 1–3 month process and take 10–20% equity, while VCs invest €500K–€50M+ over 4–9 months and take 15–30%. It knows what VCs evaluate: team, product, market size, traction, value proposition, defensibility, and business model. The Coach advises you to maintain 12–18 months of runway, do your homework on each VC's investment mandate before reaching out, and remember that VCs target around 30% returns—so they need to believe your startup can be a big winner. This isn't generic advice; it's the same strategic thinking that $500/hour consultants provide.

### Every Answer Includes

| Component | Example |
|-----------|---------|
| **Number** | "$226B in AI funding" |
| **Source** | "BCG 2026 AI Radar Report" |
| **Confidence** | High / Medium / Low |

---

## 2. The 90-Day Cycle: Visual Sprint Planning

Every 90 days, StartupAI runs you through a structured validation sprint. Instead of wandering aimlessly, you follow a clear path with checkpoints that keep you accountable and moving forward.

### How It Works

```
┌─────────────────────────────────────────────────────────────────────────┐
│  90-Day Cycle 1                                          Sprint 1 of 7  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│    ●────●────●────○────○────○────○────○                                 │
│   BMD  90DC  S1   S2   S3   S4   S5  Review                             │
│    ✓    ✓    ✓                                                          │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│  STEP 1: Plan                                                           │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ ● Goal                                                              │ │
│  │   First 10 paying customers                                         │ │
│  │                                                                      │ │
│  │ ⚠ CONSTRAINT                                                        │ │
│  │   [traction] Problem/Solution Fit - Need first 18 customers         │ │
│  │              to validate willingness to pay                         │ │
│  │                                                                      │ │
│  │ ▶ Campaigns                                                         │ │
│  │   📋 Mafia Offer Campaign → View playbook                           │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  STEP 2: Execute                                                        │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │   Run experiments, track results, log learnings                     │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  STEP 3: Review                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │   Pivot or persevere? Update canvas, plan next cycle               │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### The 90-Day Cycle Structure

| Phase | Duration | What Happens |
|-------|----------|--------------|
| **BMD** | Week 1 | Business Model Design — refine your Canvas |
| **90DC** | Week 2 | 90-Day Cycle planning — set your goal and constraint |
| **S1–S5** | Weeks 3–12 | 5 two-week sprints — execute experiments |
| **Review** | Week 13 | Retrospective — pivot or persevere decision |

### Why 90 Days?

90 days is long enough to run meaningful experiments and see real results, but short enough to force focus and prevent drift. Each cycle has one clear goal (like "First 10 paying customers") and one constraint that blocks progress (like "Need to validate willingness to pay"). The AI Coach tracks your progress, reminds you of your goal, and helps you decide at the end: pivot to a new approach, or persevere with what's working.

### Campaigns & Playbooks

Each cycle includes recommended **Campaigns**—proven playbooks for achieving your goal. A "Mafia Offer Campaign" helps you get early customers by making an offer so good they can't refuse. The AI suggests the right campaign based on your stage and goal, then guides you through execution step by step.

---

## 3. Current System Status

### What's Built (Production Ready)

| Area | Status | Details |
|------|--------|---------|
| **Database** | DONE | 58 tables with RLS, 49 migrations |
| **Edge Functions** | DONE | 31 active functions (2 archived), 6 categories |
| **Validator Pipeline** | DONE | 7 agents, 14-section report, 300s deadline, 3 successful E2E runs |
| **Onboarding Wizard** | DONE | 5-step flow with AI extraction |
| **Lean Canvas + AI** | DONE | 9-block model, versioning, AI coach, 16 actions |
| **Pitch Deck + AI** | DONE | 3-panel editor, AI slides, 27+ actions |
| **CRM** | DONE | Contacts, deals, pipeline, AI enrichment |
| **Research** | DONE | 200+ Tier A statistics |
| **Playbooks** | DONE | 21 industry verticals |

### What's Working Well

- **Solid infrastructure** — Supabase + Vite + React + Edge Functions production-ready
- **AI model diversity** — Gemini 3 for speed, Claude 4.6 for reasoning
- **Validator pipeline** — 7 AI agents produce 14-section validation reports in under 5 minutes with real citations
- **21 industry playbooks** — Deep expertise in each vertical with benchmarks
- **200+ Tier A stats** — Real research from Deloitte, BCG, McKinsey, PwC
- **31 edge functions** — Canvas, pitch, CRM, validation, coaching, and more

### Recent Improvements (Feb 2026)

**Validator pipeline v0.9.0 (2026-02-08):** 7 agents complete end-to-end — Extractor (~5-8s), Research (~18-22s), Competitors (~16-22s), Scoring (~12-13s), MVP (~10-12s), Composer (~30-50s with 8192 tokens), Verifier (<1s). Pipeline produces full 14-section reports with real citations. 3 successful runs: Restaurant (72/100), InboxPilot (68/100), Travel AI (62/100). Critical fixes: extractJSON repair, Composer array unwrap, Promise.race timeouts for Deno Deploy, zombie cleanup threshold at 360s.

**Smart follow-up chat (2026-02-08):** After each founder response, Gemini Flash analyzes the conversation in real time, identifies which of 8 key topics (problem, customer, competitors, innovation, uniqueness, demand, research, websites) still have gaps, and generates the next best follow-up question. Anti-repetition rules prevent re-asking topics the founder just answered. Typically 4-7 exchanges before the Generate button appears.

**Canvas-coach merge (2026-02-09):** Merged standalone `canvas-coach` edge function into `lean-canvas-agent` as `action: 'coach'`. Eliminates duplicate CORS/auth/Gemini wrappers, adds cost tracking via `logAIRun`, and reduces function count from 30 to 29.

### What's Next (Priority Focus)

| Priority | Gap | Solution |
|----------|-----|----------|
| **Sprint 0** | 16 functions have security gaps | Add JWT, shared CORS, rate limiting (see Edge Function Strategy) |
| **P0** | Coach needs citations | Add Tier A sources to every answer |
| **P0** | No confidence levels | Add High/Medium/Low confidence tiers |
| **P1** | No PDF export | Add investor-ready report exports (PDF, PNG, Word) |
| **P1** | No share links | Add unique URLs per report + revocable share links |
| **P1** | Risk & Assumption Board | Not built (backend ready) — core to validation loop |
| **P2** | Founder Roadmap | Stage detection + Now-Next-Later view |

---

## 4. Chat as the Core Product

### Why Chat Must Be Primary

| Reason | Benefit |
|--------|---------|
| **Lowest friction** | Type a question, get an answer + action |
| **Natural for founders** | They already use ChatGPT, Slack, iMessage |
| **Context accumulation** | Chat remembers; dashboards forget |
| **Progressive discovery** | AI surfaces features as needed |
| **Reduces decision fatigue** | One interface, not 41 screens |

### What Users Can Do Entirely via Chat

| Action | Chat Command | Result |
|--------|--------------|--------|
| **Add a contact** | "Add Marc Andreessen from a16z" | Contact created in CRM |
| **Create a task** | "Remind me to follow up with Marc Friday" | Task created with due date |
| **Update canvas** | "Our main problem is inventory waste for restaurants" | Problem block updated |
| **Generate pitch deck** | "Create a pitch deck for my seed round" | 10-slide deck generated |
| **Research investors** | "Find 5 fintech investors in SF" | Investor list with context |
| **Analyze metrics** | "What's my biggest growth blocker?" | Traction analysis with recommendations |
| **Plan my week** | "What should I focus on this week?" | Prioritized task list |
| **Validate assumption** | "Is my pricing assumption valid?" | Experiment design + success criteria |

### What Remains as Structured UI

| Screen | Why Structured |
|--------|----------------|
| **Lean Canvas** | Visual 9-box layout is superior for business model |
| **Pitch Deck Editor** | Slide arrangement requires drag-drop |
| **CRM Pipeline** | Kanban view is best for deal stages |
| **Metrics Dashboard** | Charts and trends need visual display |
| **Task Board** | Kanban/list hybrid for task management |

### Chat Responsibilities (Explicit)

**Chat MUST:**
- Create, update, delete any entity (contacts, tasks, deals, etc.)
- Generate documents (decks, one-pagers, emails)
- Explain why recommendations are made
- Link to structured UI when appropriate
- Remember context across sessions

**Chat must NOT do without approval:**
- Delete anything (confirm first)
- Send emails/messages externally
- Share documents with others
- Make purchases or payments
- Connect to external services

---

## 5. Lean System + Idea Validation (Hybrid Approach)

### Current Lean System (Simplified)

The existing frameworks are consolidated into 4 core components plus 4 complementary tools that the AI applies at the right stage:

| Component | Purpose | Output |
|-----------|---------|--------|
| **Lean Canvas** | 1-page business model | 9 validated blocks |
| **Customer Forces** | Why customers switch | Triggers, jobs, friction |
| **Risk Board** | Prioritize assumptions | Ranked risks with experiments |
| **Experiment Lab** | Test assumptions | Validated/invalidated outcomes |

### Complementary Frameworks (Built Into the System, Not Separate Screens)

These tools are proven in practice but do not need their own screens. StartupAI surfaces them through the coach, canvas actions, and AI-generated insights at the right moment.

| Framework | What it is | How StartupAI uses it | When it surfaces |
|-----------|-----------|----------------------|-----------------|
| **Value Proposition Canvas (VPC)** | Maps customer Jobs/Pains/Gains against product Pain Relievers/Gain Creators. Created by Osterwalder to zoom into the "value fit" between what you build and what customers need. | Embedded in the Customer Canvas (Opportunity Canvas) as the Jobs/Pains/Gains → Solution Fit view. The coach references VPC structure when helping founders refine Problem, Solution, and UVP blocks. | Idea + Validation stages — when the founder is clarifying "does my solution actually fit this customer's pain?" |
| **SWOT Analysis** | Strengths, Weaknesses, Opportunities, Threats. Classic strategic lens covering internal capabilities and external market forces. | AI auto-generates a SWOT summary from the canvas, profile, competitors, and experiment results. Treated as a living document that updates with new data, not a one-time exercise. Coach surfaces it when founders ask about risks or competitive position. | Validation + MVP stages — after enough data exists to populate all four quadrants meaningfully. |
| **Validation Canvas** | Ash Maurya's tool for tracking experimental progress: Riskiest Assumption → Customer Definition → Validation Method → Results. The "central nervous system" of iterative learning. | This IS the Risk & Assumption Board. The board's design follows the Validation Canvas structure: identify riskiest assumption, define customer + problem + solution for that assumption, design experiment with success criteria, record results, decide pivot/persevere. | Validation stage — core workflow from canvas to experiment to evidence. |
| **SOAR Analysis** | Strengths, Opportunities, Aspirations, Results. A growth-focused, forward-looking alternative to SWOT that emphasizes what's working and where to aim. | Coach uses SOAR framing for post-validation founders who need to leverage strengths and set growth targets. Better than SWOT at this stage because the goal is acceleration, not risk mapping. Maps to Now-Next-Later planning with measurable results (KPIs, OKRs). | Traction + Growth stages — when the founder is past validation and needs a growth strategy. |

**Design principle:** No new screens. These frameworks surface as coach capabilities, AI-generated sections in reports, or views within existing screens (Customer Canvas, Risk Board, Analytics). The founder gets the benefit of each framework without having to learn or navigate a separate tool.

**What we deliberately exclude:**
- **Full Business Model Canvas** — Too heavy for pre-PMF startups. Lean Canvas covers the critical blocks; BMC is available post-PMF via export or hybrid view.
- **TOWS Matrix** (SWOT cross-analysis: SO/WO/ST/WT strategies) — Useful but adds complexity. The coach can surface TOWS-style strategic recommendations when a founder asks "How do I use my strengths against this threat?" without requiring a dedicated matrix.
- **Porter's Five Forces** — Better for established industry analysis. Research agent and competitors agent already cover competitive dynamics; explicit Five Forces adds more jargon than value at pre-PMF stage.

### How Validation Works (Step-by-Step)

```
1. PROBLEM CAPTURE
   ├── Founder describes idea in chat
   ├── AI extracts: problem, customer, solution
   └── Output: Problem clarity score (0-100)

2. CANVAS GENERATION
   ├── AI pre-fills 9 blocks from problem capture
   ├── Founder refines in visual editor
   └── Output: Lean Canvas v1 (target: under 30 minutes)

3. ASSUMPTION EXTRACTION
   ├── AI identifies 5-7 riskiest assumptions
   ├── Prioritized by: Impact × Uncertainty
   └── Output: Risk board with priorities

4. EXPERIMENT DESIGN
   ├── For each assumption, AI suggests experiment
   ├── Types: Interview, Landing Page, Fake Door, Concierge
   └── Output: Experiment spec with success criteria

5. VALIDATION LOOP
   ├── Founder runs experiment, logs results
   ├── AI analyzes: validated, invalidated, inconclusive
   └── Output: Updated canvas + next experiment
```

**Validation minimum:** Conduct at least 20-30 real customer conversations before committing significant resources. The system tracks this count and prompts founders who haven't hit it.

### The Four Validation Pillars

Every assumption should be tested across four dimensions (Bundl framework). The system tracks coverage across all four and warns when a pillar is untested:

| Pillar | Question | How to Test |
|--------|----------|-------------|
| **Desirability** | Do customers want it? | Interviews, surveys, landing page signups, fake door tests |
| **Feasibility** | Can we build and run it? | Tech assessment, resource check, scalability review |
| **Viability** | Can we make a business? | Pricing tests, margin analysis, market size validation |
| **Responsibility** | Should we build it? | Impact assessment, sustainability, accessibility |

### Validation Checklist (Gates)

The system uses these as progress gates. Items can be checked automatically from data or manually by the founder:

**Before you build:** Idea clarity (top 1-3 as customer problems), qualifications (why you), 5-15 customer conversations per problem, lead customers identified, market view (segment, size, 10+ keywords, competitors), riskiest assumption named with test method, first test executed.

**Before MVP:** Desirability evidence (interviews, waitlist, signups), feasibility confirmed (skills, time, partners), core assumptions for idea stage validated or pivoted, solution hypothesis tied to problem and audience.

**Before charging/scaling:** Viability evidence (willingness to pay, fake checkout, first payments), traction metrics defined and tracked, MVP assumptions validated, responsibility considered if relevant.

**Ongoing:** One assumption per experiment, behaviour over opinion, decide after each test (build/pivot/kill) and log decision with evidence.

### Experiment Types & Templates

The Experiment Lab supports these validated experiment types. Each has a prefilled method and success-criteria prompt:

| Type | When to Use | Success Criteria Example |
|------|-------------|------------------------|
| **Customer Interview** | Problem discovery; use Pain Index (6 questions, score 31+ = strong pain) | 7+/10 pain rating from 5+ interviews |
| **Landing Page / Smoke Test** | Demand validation; value prop + CTA, track visits and clicks | 5%+ signup or CTA conversion |
| **Fake Door / Button to Nowhere** | Feature demand; add button, measure clicks, then survey intent | 10%+ click-through, 50%+ "I expected this" |
| **Concierge / Wizard of Oz** | Can you deliver value manually before building? | 3+ customers complete the workflow |
| **Pitching / Commitment Test** | Must-have test; ask for currency (money, email, time) | 2+ LOIs or pre-orders |
| **Survey** | Quick signal; short (1-3 questions), embedded or standalone | 50+ responses, 40%+ positive signal |
| **Prototype-as-Funnel** | Solution resonance; clickable prototype, measure completion | 60%+ complete core flow |

**MVF tactics for the coach:** "Phone a friend" (subject explains to friend while you listen), "What would Bob do?" (project onto others to reduce false consensus), false payment (ask for payment then don't charge), watch competitor app usage, embedded one-question survey.

### Avoiding "Vibe-Founding"

**Vibe-founding** means relying on intuition and passion instead of structured validation. The system counters this:

- **Treat every claim as a hypothesis** — Problems, solution, UVP, channels, and metrics are assumptions until backed by evidence.
- **Challenge, not just document** — Validation and coach surface solution-first bias, missing blocks, and weak links.
- **Evidence-based decisions** — Pivot/persevere depends on experiment results, not self-declaration. Decision log ties decisions to evidence.
- **Bias audit habit** — Cross-check AI suggestions with other data or advisors. AI is a partner, not an oracle.

### Quality Criteria Per Block

The coach and validation engine use these criteria. Founders should know what "good" looks like:

| Block | Good | Red flag |
|-------|------|----------|
| **Problem** | Measurable, specific pains with frequency/cost data | Vague complaints ("it's hard to manage") |
| **Solution** | Directly addresses stated problems; concrete features | Feature list with no problem link |
| **UVP** | Passes the taxi test (one sentence to a stranger) | Jargon-heavy, generic |
| **Unfair Advantage** | Defensible: network effects, data, patents, expertise | "Hard work," "passion," "first mover" |
| **Customer Segments** | Specific personas with job titles and behaviors | "Everyone" or broad demographics |
| **Key Metrics** | Actionable, tied to decisions (activation, retention) | Vanity metrics (page views, followers) |
| **Channels** | Realistic paths with cost estimates | "We'll go viral" |
| **Cost Structure** | Major categories with rough sizing | Missing or "TBD" |
| **Revenue Streams** | Pricing model + willingness-to-pay evidence | "We'll figure it out later" |

### Signals That Matter Most

| Signal | How to Measure | Threshold |
|--------|----------------|-----------|
| **Problem severity** | Interview responses | 7+/10 rating |
| **Willingness to pay** | Pre-orders, fake door clicks | 5%+ conversion |
| **Switching intent** | Current solution satisfaction | 3-/10 rating |
| **Urgency** | Timeline to solve problem | Within 30 days |
| **Budget authority** | Can approve purchase | Yes |

### Data Flows

```
Profile → Canvas prefill → Assumption extraction → Experiments
                                                         ↓
Interviews → Insights → Assumption evidence         Evidence
                                                         ↓
Experiments + Canvas + Analytics → Stage and gates
                                                         ↓
Decisions + Versions + Evidence → Investor-ready audit trail
```

### Hybrid System: Structured Data + Conversational Reasoning

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Structured** | Lean Canvas, Risk Board | Store validated facts |
| **Conversational** | Chat (Amo) | Reasoning, advice, generation |
| **Memory** | Chat history + entity links | Context accumulation |

**Key insight:** Founders don't need to fill forms. They describe their business in natural language. AI populates structured artifacts. Founders refine.

### Data Quality: Profile Completeness → AI Confidence

AI prefill and suggestions depend on profile completeness. The system measures and displays profile quality (completeness %) and adjusts AI confidence accordingly:

| Profile Completeness | AI Confidence | Behaviour |
|---------------------|---------------|-----------|
| < 30% | Low | AI warns "suggestions may be generic"; prompts for more context |
| 30-70% | Medium | AI fills what it can; flags blocks where confidence is low |
| > 70% | High | Full prefill; industry-specific benchmarks; detailed suggestions |

Benchmarks source from verified industry data (Tier A sources, not AI hallucination). The system guides founders toward richer profiles before generating canvas content.

### Niche Strategy (Coach Capability)

For founders targeting narrow segments, the coach provides niche-specific guidance:

- **Micro-segmentation:** Nudge from broad segments ("fitness enthusiasts") to specific micro-markets ("post-surgery rehab for adults 50+")
- **White-space mapping:** Map competitors → find unmet needs, underserved segments, quality/service gaps
- **Four success factors:** (1) Unique customer needs, (2) Sufficient market size, (3) Manageable competition, (4) Effective communication channels
- **SWOT → niche moat:** "Your strengths + their unmet needs = defensible position"
- **Scalability path:** First dominate niche, then adjacent expansion; Now-Next-Later planning

### Real Example: Idea Validated or Killed

**Scenario:** Emma has a fintech idea for SMB inventory financing.

```
Day 1: Chat onboarding
├── Emma: "I want to help restaurants avoid food waste"
├── Amo: "Tell me about a specific restaurant's problem"
├── Emma: Describes owner who lost $3K last month to spoilage
└── Output: Problem clarity 72%

Day 2: Canvas generation
├── Amo: Auto-fills canvas from conversation
├── Emma: Refines customer segment to "restaurants <$2M revenue"
└── Output: Lean Canvas v1, 5 assumptions extracted

Day 7: Highest-risk assumption
├── Assumption: "Owners will pay $200/mo to reduce 20% waste"
├── Amo: Suggests landing page test
├── Emma: Runs ad campaign, 47 signups, 3 willing to pay
└── Output: Validated (6.4% conversion)

Day 14: Decision point
├── Amo: "Problem validated. Ready to scope MVP?"
├── Emma: Yes
└── Output: MVP scope with 3 core features
```

**Outcome:** Idea validated in 2 weeks. Emma avoided building the wrong product.

---

## 6. Onboarding via Chat (Primary Flow)

### How Day 1 Works

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        FOUNDER'S FIRST 10 MINUTES                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [OAuth Login] → [Chat Window Opens]                                     │
│                                                                          │
│  Amo: "Hey! I'm Amo, your startup copilot. What are you building?"      │
│                                                                          │
│  Founder: "An app to help restaurants reduce food waste"                 │
│                                                                          │
│  Amo: "Got it. Restaurant food waste is a $40B problem.                  │
│        Who specifically are you targeting?"                              │
│                                                                          │
│  Founder: "Independent restaurants with under $2M revenue"               │
│                                                                          │
│  Amo: "Perfect early adopter segment. What have you tried so far?"      │
│                                                                          │
│  Founder: "Just talking to a few owners"                                │
│                                                                          │
│  Amo: "Here's what I've captured. Check if this is right."              │
│        [Shows: Startup Profile Card]                                     │
│        - Problem: Food waste in independent restaurants                  │
│        - Customer: Restaurant owners <$2M revenue                        │
│        - Stage: Idea (3 interviews)                                      │
│        - Industry: Restaurant Tech                                       │
│                                                                          │
│  Amo: "I've assigned you the Restaurant Tech playbook.                   │
│        Tomorrow, I'll ask about your problem hypothesis.                 │
│        For now, your one task: [Interview 2 more restaurant owners]"    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### What Chat Asks (Progressive, Not Overwhelming)

| Turn | Question | Purpose | Auto-Fills |
|------|----------|---------|------------|
| 1 | "What are you building?" | Core idea | startup.description |
| 2 | "Who is it for?" | Customer segment | canvas.customer_segments |
| 3 | "What's the problem you're solving?" | Problem clarity | canvas.problem |
| 4 | "How far along are you?" | Stage detection | startup.stage |
| 5 | "What's your background?" | Founder context | profile.background |

**Maximum 5 questions.** Then AI shows what it captured and asks for corrections.

### How Chat Fills Structured Data

| Chat Input | Structured Output |
|------------|-------------------|
| "An app to help restaurants reduce food waste" | startup.description, canvas.problem |
| "Independent restaurants under $2M" | canvas.customer_segments, startup.industry |
| "Just talking to a few owners" | startup.stage = "Idea" |
| "I'm a former restaurant manager" | profile.background, startup.unfair_advantage |

### When UI Appears

| Trigger | UI Shown | Why |
|---------|----------|-----|
| "Show me my canvas" | Lean Canvas editor | Visual arrangement preferred |
| "Create my pitch deck" | Deck builder | Slide editing is visual |
| "Show my pipeline" | CRM Kanban | Deal stages are visual |
| Stage changes | Dashboard with milestone | Celebration moment |

**Default:** Chat. UI only when visual is better.

---

## 7. Founder Roadmap & Startup Stages

### Simplified Stage Model (5 Stages, Not 10)

| Stage | Question | Duration | Key Metric | AI Focus |
|-------|----------|----------|------------|----------|
| **1. Idea** | Is the problem real? | 1-4 weeks | Problem clarity score | Sharpen problem, identify customers |
| **2. Validation** | Will people pay? | 4-8 weeks | Willingness to pay % | Design experiments, analyze results |
| **3. MVP** | Can we deliver value? | 4-12 weeks | First 10 users | Scope cutting, build priorities |
| **4. Traction** | Is it growing? | 8-16 weeks | WoW growth rate | Bottleneck detection, channel testing |
| **5. Fundraising** | Can we raise? | 4-12 weeks | Investor meetings | Deck optimization, pipeline management |

### Lean Analytics Stage Mapping & OMTM

StartupAI's 5 stages map to Croll & Yoskovitz's Lean Analytics stages. Each stage has one OMTM (One Metric That Matters) with a "line in the sand" target:

| StartupAI Stage | Lean Analytics Stage | OMTM | Line in the Sand |
|-----------------|---------------------|------|------------------|
| **Idea** | Empathy | Problem clarity score | 70%+ from 10+ interviews |
| **Validation** | Stickiness | Retention / aha rate | 40%+ week-1 retention |
| **MVP** | Stickiness → Virality | Activation rate | 60%+ reach aha moment |
| **Traction** | Virality → Revenue | WoW growth rate | 5-7% weekly growth |
| **Fundraising** | Revenue → Scale | Burn multiple / LTV:CAC | Burn multiple < 2.0, LTV:CAC > 3:1 |

**Good metric checklist:** Every metric the system tracks or suggests must be (1) comparative (vs time/segment/competitor), (2) understandable, (3) a ratio or rate, and (4) something that changes behaviour. If a metric fails these criteria, it's vanity.

**Leading indicators per stage:** The AI finds early signals that predict core outcomes (e.g. "7 friends in 10 days" predicted Facebook engagement). For each founder, the system looks for patterns in retained vs churned users to surface the founder's own leading indicator.

### PMF Pyramid (Dan Olsen)

The system uses this 5-layer model to make founder hypotheses explicit and testable:

```
5. UX (how it feels)
4. Feature Set (MVP scope)
3. Value Proposition (why better than alternatives)
2. Underserved Needs (the problem)
1. Target Customer (who you serve)
```

Each layer influences the ones above/below. The coach prompts founders to be explicit about hypotheses at every layer, not just Problem and Solution.

### What Founder Focuses On (Per Stage)

| Stage | Founder Focus | NOT Focus |
|-------|---------------|-----------|
| **Idea** | Talking to customers | Building product |
| **Validation** | Running experiments | Scaling |
| **MVP** | Shipping to 10 users | Feature polish |
| **Traction** | Growth experiments | Fundraising |
| **Fundraising** | Investor meetings | Product expansion |

### Adapt to Founder Context

The system adjusts depth to who is using it:
- **Solo founders:** Streamlined flows (fewer screens, 2-3 key metrics, weekly review cycles). AI coaching acts as a substitute for co-founder/advisor input.
- **Teams:** Collaboration features and monthly reviews.
- **Social-impact ventures:** Adapted blocks (impact metrics alongside revenue).

**Founder resilience:** Building a startup is a marathon. The system celebrates milestones, frames setbacks as learning data, and encourages work-life boundaries. Especially important for first-time and solo founders.

### What AI Does (Per Stage)

| Stage | AI Actions | Frameworks Used |
|-------|------------|-----------------|
| **Idea** | Extract problem from conversations, suggest interview questions, score clarity, VPC mapping (jobs/pains/gains) | Lean Canvas, VPC |
| **Validation** | Design experiments (Validation Canvas flow), calculate significance, generate SWOT from canvas + competitors, recommend pivot/persevere | Validation Canvas, SWOT |
| **MVP** | RICE scoring, scope cutting, sprint planning, SWOT update with build-phase risks | Lean Canvas, SWOT |
| **Traction** | Identify OMTM, find bottlenecks, SOAR analysis (leverage strengths, set growth targets), suggest channel experiments, growth hacking | SOAR, Lean Canvas |
| **Fundraising** | Deck review, investor matching, objection prep, SWOT for investor due diligence | SWOT, Lean Canvas |

### Fundraising: Seed Round Specifics

When the founder enters Fundraising stage, the coach provides seed-specific guidance:

| Topic | Guidance |
|-------|---------|
| **Milestones, not vibes** | Define 3-5 concrete milestones that de-risk the next round (e.g. $1.2M ARR, 40% 8-week retention, 3 design-partner logos). Runway 18-24 months. |
| **Instrument** | Post-money SAFE with cap; avoid custom clauses. Keep terms clean. |
| **Deck** | 12-15 slides: problem, solution, traction, market, model, GTM, product, competition, roadmap, team, use of funds. |
| **Data room** | KPIs, cohort/retention, pipeline, roadmap, financial model, cap table, key contracts. |
| **Investor list** | 75-150 targeted (angels, seed funds, scouts, sector firms). Warm intros; batch into 1-2 weeks for momentum. |
| **Metrics that matter** | Burn multiple (< 2.0), activation + retention (8-12 week curve), CAC payback (< 12 mo for SMB SaaS), NRR, pipeline + cycle time. |

### Outputs Generated (Per Stage)

| Stage | Documents | Metrics | Tasks |
|-------|-----------|---------|-------|
| **Idea** | Problem hypothesis, interview scripts, VPC value fit map | Clarity score | Interview 10 customers |
| **Validation** | Experiment specs, results log, SWOT summary | Conversion rates | Run 3 experiments |
| **MVP** | Feature list, sprint plan, updated SWOT | User count | Ship MVP by date |
| **Traction** | Growth playbook, SOAR analysis, channel analysis | WoW growth, churn | Test 2 channels |
| **Fundraising** | Pitch deck, one-pager, SWOT for investors, data room | Meetings, term sheets | Meet 20 investors |

---

## 8. AI-Enabled Planning System

### How Strategy Becomes Tasks

```
STRATEGY (Lean Canvas)
    ↓
ROADMAP (Now / Next / Later)
    ↓
MILESTONES (Monthly goals)
    ↓
WEEKLY PLAN (Focus areas)
    ↓
DAILY TASKS (Specific actions)
```

### Planning Logic

| Layer | Source | AI Role | Human Role |
|-------|--------|---------|------------|
| **Strategy** | Lean Canvas + Stage | Validates assumptions | Defines vision |
| **Roadmap** | Stage + Industry playbook | Suggests milestones | Prioritizes |
| **Milestones** | Roadmap + Metrics | Proposes targets | Approves |
| **Weekly** | Milestones + Capacity | Selects focus | Adjusts |
| **Daily** | Weekly + Context | Generates tasks | Executes |

### How Plans Evolve Automatically

| Trigger | Plan Update |
|---------|-------------|
| Experiment invalidates assumption | Pivot suggestion, updated roadmap |
| Metric hits threshold | Stage advancement, new milestones |
| Task overdue | Re-prioritization, scope adjustment |
| New customer feedback | Assumption re-evaluation |

### Human Control Points

| Decision | Human Must Approve |
|----------|-------------------|
| Stage change | Yes |
| Pivot | Yes |
| Major scope change | Yes |
| Task creation | No (AI creates, human reviews) |
| Task completion | Human marks done |

---

## 9. MVP: What Actually Matters

### Not Features. Outcomes.

| Outcome | Matters Because | How to Measure |
|---------|-----------------|----------------|
| **Problem confirmed** | Building for real pain | 10+ people describe same problem |
| **Solution resonates** | Product idea connects | 70%+ say "I'd use that" |
| **Willing to pay** | Business viable | 5%+ pre-order/signup |
| **Can deliver value** | Execution capability | 10 users get promised outcome |
| **Repeatable acquisition** | Growth possible | CAC < LTV, one channel works |

### What Founders Must Learn Fast

1. **Is the problem real?** — Not "do people have this problem" but "is it painful enough to pay?"
2. **Am I talking to the right people?** — Early adopters, not mainstream
3. **What's the minimum to deliver value?** — Not minimum features, minimum value
4. **Can I reach these people?** — At least one scalable channel
5. **Will they pay what I need?** — Unit economics must work

### Signals That Matter

| Signal | Strong | Weak |
|--------|--------|------|
| **Problem interview** | "I've tried 3 solutions and still frustrated" | "Yeah, that's annoying I guess" |
| **Solution resonance** | "When can I use this?" | "That sounds cool" |
| **Willingness to pay** | "Here's my credit card" | "I'd probably pay something" |
| **Referrals** | "I know 5 people who need this" | "Maybe some friends" |

### What Should NOT Be Built Yet

| Avoid | Why |
|-------|-----|
| **Admin panels** | You can use Supabase dashboard |
| **Payment flows** | Collect manually first |
| **Multi-tenancy** | You're the only customer |
| **Mobile apps** | Web works on mobile |
| **Integrations** | Zapier can bridge |
| **Analytics dashboards** | Spreadsheet is fine |

### StartupAI Features by Priority

| Priority | Feature | Why |
|----------|---------|-----|
| **P0** | Chat that takes action | Core value prop |
| **P0** | Lean Canvas with AI assist | Business model clarity |
| **P0** | Problem validation scoring | Prevent building wrong thing |
| **P1** | Experiment lab | Structured validation |
| **P1** | Pitch deck generator | Fundraising essential |
| **P1** | Task management | Execution tracking |
| **P2** | Investor CRM | Fundraising support |
| **P2** | Industry playbooks | Contextual guidance |
| **P3** | Vector RAG | Expert-grade retrieval |
| **P3** | Team collaboration | Multi-founder support |

---

## 10. AI Agents Strategy

### Current Functions (31 Active, 2 Archived)

| Category | Functions | Count |
|----------|-----------|-------|
| **Pipeline** | validator-start (7-agent pipeline), validator-status, validator-followup, validator-panel-detail, validator-regenerate | 5 |
| **AI Agent** | ai-chat, lean-canvas-agent (16 actions incl. coach), pitch-deck-agent (27+ actions), industry-expert-agent, crm-agent, investor-agent, task-agent, documents-agent, event-agent, insights-generator, onboarding-agent, prompt-pack | 12 |
| **Coach** | experiment-agent, market-research, opportunity-canvas | 3 |
| **Data/Import** | load-knowledge, profile-import | 2 |
| **Utility** | health-scorer, action-recommender, compute-daily-focus, dashboard-metrics, stage-analyzer, workflow-trigger | 7 |

**Archived:** validation-agent (superseded by validator-start), canvas-coach (merged into lean-canvas-agent as action: 'coach').

### Function Quality (Grade Card)

| Grade | Functions | Why |
|-------|-----------|-----|
| **A+** | validator-start | Modular agents/, _shared imports, deadline management, background work |
| **A** | validator-followup, validator-panel-detail | Uses _shared, separate prompt/schema, proper validation |
| **B+** | profile-import, lean-canvas-agent | Good schemas, some inline patterns |
| **C** | industry-expert-agent, onboarding-agent | Monolithic (800-1800 lines), inline everything |
| **D** | crm-agent, documents-agent, investor-agent, task-agent, event-agent, insights-generator | Duplicate Gemini logic, no auth, no CORS, no rate limit |
| **F** | compute-daily-focus | Zero authentication, service role for everything |

**16 functions need security hardening** (Sprint 0): 9 missing JWT, 11 hardcoded CORS, 13 missing rate limiting.

### Ideal Agent Architecture (Simplified)

**4 Core Agent Types (Not 8)**

| Type | Role | Examples |
|------|------|----------|
| **Orchestrator** | Routes requests, coordinates | Atlas (main chat) |
| **Doer** | Executes actions, CRUD | CRM, Task, Canvas, Deck |
| **Analyst** | Scores, analyzes, recommends | Health, Stage, Insights |
| **Generator** | Creates content, documents | Pitch deck, emails, reports |

### MVP Agents (Minimum Set)

| Agent | Purpose | Actions |
|-------|---------|---------|
| **Atlas** | Main chat orchestrator | Route, context, memory |
| **Canvas Agent** | Lean Canvas operations | Fill blocks, extract assumptions, score |
| **Task Agent** | Task management | Create, prioritize, assign |
| **Deck Agent** | Pitch deck generation | Generate slides, optimize narrative |

### Gemini Tools Per Agent

| Tool | What It Does | Which Agents Use It |
|------|-------------|-------------------|
| `responseJsonSchema` | Guaranteed structured JSON output | ALL agents with structured output |
| `googleSearch` | Real-time web search grounding | Research, Competitors, Market Research, CRM |
| `urlContext` | Fetch and understand a URL | Profile Import, Research (future) |
| `thinkingLevel: 'high'` | Extended reasoning | Scorer, Composer (complex analysis) |
| `codeExecution` | Run code in sandbox | Future: Financial sub-agent |

**Gemini Rules:** Always `responseJsonSchema` + `responseMimeType` (G1). Temperature = 1.0 (G2, lower causes looping). API key in header (G4). Extract citations from `groundingMetadata` (G5).

### Model Selection

| Task | Model | Timeout |
|------|-------|---------|
| Fast extraction/chat | `gemini-3-flash-preview` | 15s |
| Deep analysis/scoring | `gemini-3-pro-preview` + thinking | 30s |
| Report writing | `gemini-3-pro-preview` (8192 tokens) | 90s |
| Orchestration | `claude-sonnet-4-5` | varies |
| Simple routing | `claude-haiku-4-5` | 5s |

### Agent Triggers

| Trigger | Agent | Action |
|---------|-------|--------|
| User types in chat | Atlas | Route to appropriate agent |
| Canvas block edited | Canvas Agent | Validate, suggest improvements |
| Task marked complete | Task Agent | Generate next task suggestions |
| Stage threshold met | Stage Analyzer | Notify, unlock features |
| Health score drops | Health Scorer | Surface warning, suggest actions |

---

## 11. Playbooks, Prompt Packs & Guides

### Current State

| Asset | Count | Purpose |
|-------|-------|---------|
| **Industry Playbooks** | 19 | Industry-specific knowledge (10 categories each) |
| **Prompt Packs** | 28 | Multi-step workflows |
| **Guides** | 14 | Reference documentation |

### Where They Create Friction

| Problem | Impact |
|---------|--------|
| **Too many packs** | Founders don't know which to use |
| **Separate from chat** | Have to navigate away to access |
| **Manual selection** | Founders pick wrong pack for stage |
| **Rigid sequences** | Can't skip steps or customize |

### How They Should Integrate with Chat

**Chat dynamically selects playbooks:**

```
Founder: "How should I price my SaaS product?"

Amo (internally):
├── Detect: Industry = AI SaaS
├── Detect: Stage = Validation
├── Load: ai-saas.md → gtm_patterns, benchmarks
├── Generate response with industry context
└── Output: Pricing frameworks specific to B2B SaaS
```

**Prompts become invisible intelligence:**

| Old Way | New Way |
|---------|---------|
| User selects "PP-05 GTM Strategy" | Chat detects GTM question, injects context |
| User follows 3-step sequence | Chat answers with pack knowledge embedded |
| User completes pack | Chat remembers context for follow-ups |

**Guides evolve as startup grows:**

| Stage | Active Guides |
|-------|---------------|
| **Idea** | Problem validation, customer interviews |
| **Validation** | Experiment design, assumption testing |
| **MVP** | Feature prioritization, sprint planning |
| **Traction** | Growth playbooks, channel testing |
| **Fundraising** | Deck templates, investor outreach |

### Simplified Prompt Pack Strategy

| Pack Category | When Triggered |
|---------------|----------------|
| **Validation** | Stage = Idea or Validation |
| **MVP Scoping** | Stage = MVP |
| **GTM** | Stage = Traction |
| **Fundraising** | Stage = Fundraising |

**One pack per stage.** Not 28 options.

### Improving AI Search Quality

Research agents should follow a source hierarchy and recency discipline:

| Principle | Implementation |
|-----------|---------------|
| **Source hierarchy** | Curated links first -> RAG knowledge -> Google Search grounding. State which layer each data point came from. |
| **Recency** | Prefer sources from last 12 months for market data; last 30 days for trends. Flag older sources. |
| **Adaptive queries** | Build 2-3 specific search queries from the founder's problem + customer + industry. Strip filler words. |
| **Two-phase search** | Phase 1: broad discovery. Phase 2: extract entity names (reports, competitors) and run targeted follow-ups. |
| **Synthesis** | Add "key_patterns" or "market_signals" arrays — short, cited bullets that summarize findings for reuse by coach and report. |

---

## 12. Vector DB & Memory Strategy

### What Should Be Stored

| Store | Content | Why |
|-------|---------|-----|
| **Structured DB** | Entities (contacts, tasks, canvas) | CRUD, relationships, RLS |
| **Chat History** | Conversations | Context accumulation |
| **Vector Store** | Industry research, deck benchmarks | Semantic retrieval |

### What Should NOT Be Stored (Yet)

| Avoid | Why |
|-------|-----|
| **All founder conversations** | Privacy, storage cost |
| **External web content** | Freshness, relevance |
| **Every playbook as vectors** | JSON retrieval is sufficient |

### Memory Architecture

```
SHORT-TERM (Session)
├── Current conversation
├── Active context (startup, stage, task)
└── In-memory, clears on session end

MID-TERM (Days/Weeks)
├── Recent chat history (30 days)
├── Active experiments
├── Current sprint tasks
└── PostgreSQL tables, queryable

LONG-TERM (Permanent)
├── Lean Canvas versions
├── Completed experiments
├── Decisions + outcomes
└── PostgreSQL + optional vector
```

### Founder-Specific vs Startup-Specific

| Type | Scope | Examples |
|------|-------|----------|
| **Founder-specific** | Per user | Communication preferences, background, strengths |
| **Startup-specific** | Per startup | Canvas, metrics, experiments, documents |
| **Shared** | Per organization | Team members, permissions |

### How Retrieval Improves Answers

| Without Vector | With Vector |
|----------------|-------------|
| "Fintech pricing should be competitive" | "Based on 12 similar fintech startups, median pricing is $49/mo with 15% annual discount. Your $79 is 60% above market." |
| "Your traction slide needs work" | "Comparing to 50 seed decks in our library, your traction slide is missing cohort retention—82% of funded decks include this." |

### Hallucination Prevention

| Rule | Implementation |
|------|----------------|
| **Retrieval first** | AI must search before answering |
| **Citation required** | Major claims need source reference |
| **Explicit gaps** | "I don't have data on X" is valid |
| **Confidence scores** | Low confidence → web search fallback |

---

## 13. Our Competitive Advantage

### vs Generic AI Tools

| Generic AI | StartupAI |
|------------|-----------|
| Unknown data sources | **Tier A sources** (Deloitte, BCG, McKinsey, PwC, Gartner, CB Insights) |
| No citations | **Every stat has a source** |
| No confidence levels | **High/Medium/Low confidence** |
| Generic benchmarks | **Industry-specific** (21 playbooks) |
| One-size-fits-all | **Context-aware** (knows your canvas, stage, industry) |

### vs Startup-Specific Tools

| Dimension | Canvas-only (siift.ai, Strategyzer) | Validation-only (IdeaProof) | StartupAI |
|-----------|-------------------------------------|-----------------------------|-----------|
| **Canvas creation** | Core strength: templates, AI prefill | Not offered | AI prefill + validation + coach |
| **Assumption management** | Not offered | Partial (score only) | Full: extract, rank, experiment, track |
| **Evidence loop** | Not offered | Report only (no iteration) | Canvas -> Assumptions -> Experiments -> Evidence -> Updated canvas |
| **Execution support** | Not offered | Not offered | Sprints, traction, MVP planner, analytics |
| **Validation depth** | AI suggestions on canvas | 14-section report (one-shot) | 7-agent pipeline + iterative coach + per-block validation |
| **Investor trail** | Version history only | PDF export | Decision log + versions + evidence + export |

**Positioning:** StartupAI is not just a canvas tool or a validation tool — it is a **lean execution system** that connects idea -> canvas -> assumptions -> experiments -> evidence -> MVP -> traction in one place, with AI coaching throughout.

### Why This Matters

StartupAI gives you the same quality advice that funded startups get from expensive consultants and advisors—but available 24/7, in seconds, for a fraction of the cost. We're not trying to replace human mentors; we're making expert-level guidance accessible to every founder.

---

## 14. Going Forward (Roadmap)

### Sprint 0: Security Hardening (1 session)

Fix 16 broken functions before adding features.
1. Add JWT via `_shared/auth.ts` to 9 functions
2. Replace hardcoded CORS in 11 functions with `_shared/cors.ts`
3. Add rate limiting to 13 functions via `_shared/rate-limit.ts`
4. Refactor 6 duplicate Gemini functions to use `_shared/gemini.ts`

### Sprint 1: Trust + Agent Tracking

| Task | Deliverable |
|------|-------------|
| Coach answers with citations | Tier A sources in every answer |
| Add confidence levels | High/Medium/Low on every answer |
| Agent runs schema (016) | Per-agent tracking in DB |
| Smart interviewer (031) | Depth tracking, expert questions |

### Sprint 2: Knowledge + Extraction

| Task | Deliverable |
|------|-------------|
| Expert knowledge system (020) | Playbooks + RAG into agents |
| Composer split (017) | Own edge function, 120s budget |
| Parallel agents (018) | Research + Competitors independent |
| PDF export | Investor-ready reports |
| Share links | Unique URLs per report |

### Sprint 3: Agent Intelligence

| Task | Deliverable |
|------|-------------|
| Research v2 (033) | Adaptive queries, recency windows, two-phase search |
| Scoring v2 (034) | Weighted dimensions, industry benchmarks |
| Composer v2 (035) | Confidence tiers (grounded/synthesized/speculative) |

### Sprint 4: Polish + Scale

| Task | Deliverable |
|------|-------------|
| Competitors v2 (036) | Threat rubric, URL Context |
| Agent skills/playbooks (037) | Industry injection per agent |
| Risk & Assumption Board | Frontend for assumption management |
| Full orchestrator (019) | DAG dispatch (only if scale demands) |

---

## 15. Success Metrics

### System Metrics

| Metric | Target | What it measures |
|--------|--------|------------------|
| Time to first canvas | < 10 min with AI prefill | Speed of onboarding |
| Canvas completeness at 7 days | > 80% blocks filled | Engagement depth |
| Assumptions extracted per canvas | > 5 | Risk awareness |
| Experiments created per user | > 1 in first 30 days | Validation behavior |
| Coach interactions per session | > 2 | AI value delivery |
| Canvas versions saved | > 3 per startup | Iteration frequency |
| Monthly review completion rate | > 50% of active users | Living document behavior |
| Assumption validation rate | > 30% tested within 60 days | Evidence-based progress |
| Time from canvas to first experiment | < 14 days | Validation velocity |
| Customer conversations before commit | > 20 | Validation rigor |
| Weekly metric review completion | > 70% of active weeks | Data-driven habits |
| Report generation time | < 5 minutes | Pipeline performance |
| Daily active users | 40%+ of registered | Habit formation |

### PMF Indicators (Tracked by AI)

The AI monitors these leading indicators and surfaces them in analytics:

- **Engagement signals:** Increasing activation rates, deepening feature adoption, improving retention curves
- **Organic growth signals:** Unsolicited referrals, unprompted testimonials, word-of-mouth acquisition
- **Efficiency signals:** Decreasing CAC trend, improving conversion rates, increasing customer lifetime value
- **Sentiment signals:** NPS > 40, "very disappointed" survey > 40% (Sean Ellis test), reduced support requests

### Traction Signals (For Founders)

| Signal | Strong | Weak |
|--------|--------|------|
| **Problem interview** | "I've tried 3 solutions and still frustrated" | "Yeah, that's annoying I guess" |
| **Solution resonance** | "When can I use this?" | "That sounds cool" |
| **Willingness to pay** | "Here's my credit card" | "I'd probably pay something" |
| **Referrals** | "I know 5 people who need this" | "Maybe some friends" |

---

## Summary

**StartupAI exists to prevent founders from building products nobody wants.**

### The Philosophy

Plan-then-execute: Understand deeply first, then recommend confidently. Every answer includes a number, a source, and a confidence level.

### The Core Loop

1. Founder describes idea in chat
2. Coach asks one clarifying question at a time
3. AI builds complete context (canvas, industry, stage)
4. AI generates validation report with verdict
5. Founder runs experiments, logs results
6. AI recommends pivot or persevere
7. Repeat until validated

### The Result

Founders who validate before they build. Startups that survive because they solve real problems. Expert-level guidance accessible to every founder.

---

## References

| Document | Path |
|----------|------|
| Hybrid Lean System Strategy | `lean/ideas/lean-strategy.md` |
| Lean Analytics Guide | `lean/ideas/lean-analytics.md` |
| Validation Strategy & Checklist | `lean/ideas/08-validate.md` |
| Canvas & Validation Ideas | `lean/ideas/ideas.md` |
| Product-Market Fit Guide | `lean/ideas/product-fit.md` |
| Product Management Features | `lean/ideas/product.md` |
| Lean Canvas AI (Competitor Review) | `lean/ideas/lean-ai.md` |
| SWOT/SOAR Analysis | `lean/ideas/swot.md` |
| Edge Function Strategy | `lean/prompts/notes-prompts.md` |
| Validator Agent Map | `lean/prompts/validator/notes-validator.md` |
| Edge Function Index | `supabase/functions/index-functions.md` |
| Changelog | `lean/changelog` |
| PRD | `prd.md` |
| Gemini Skill | `.agents/skills/gemini/SKILL.md` |
| Supabase Skill | `.agents/skills/supabase-postgres-best-practices/SKILL.md` |
| Validator Prompt Files | `lean/prompts/validator/` (16 files) |
| Best Practices Source | `knowledge/supabase/best-practices-edge/` (18 files) |
