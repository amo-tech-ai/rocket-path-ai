# StartupAI — Complete Feature Map

> **Updated:** 2026-02-09 | **Version:** 1.0
> **Sources:** `lean/ideas/` (13 docs), `lean/lean-system/` (14 docs), `lean/strategy.md`, `lean/next-steps.md`, codebase audit (41 pages, 31 edge functions)
> **Purpose:** Every feature rated, staged, with real-world examples. Core vs Advanced. What exists vs what's needed.

---

## Summary

**42 pages built, 31 edge functions deployed.** The Validator pipeline (95%) and Auth (100%) are production-ready. The Lean Canvas (72%) and Onboarding (85%) are close. Everything else ranges from 15-70% complete. Below is every feature across the platform — what it does, who it's for, a real-world example, whether it's Core MVP or Advanced, what stage it belongs to, and a review score based on current implementation quality.

**Scoring criteria:** Implementation completeness (30%), UX polish (20%), AI integration depth (20%), data flow to other features (15%), edge cases handled (15%).

---

## 1. Validator Pipeline

| # | Feature | Use Case | Real-World Example | Tier | Stage | Score |
|---|---------|----------|--------------------|------|-------|:-----:|
| V1 | **Smart Follow-Up Chat** | Extract idea details through guided conversation instead of a blank form | Founder types "AI meal planner for diabetics" → system asks "Who's the buyer — the patient, caregiver, or hospital?" → 4-7 exchanges build a complete picture | Core | Built | **88/100** |
| V2 | **7-Agent Pipeline** | Deep validation with research, competitors, scoring, MVP plan in one run | "P2P lending for gig workers" → Extractor parses idea → Research finds $3.4T gig economy data → Competitors identifies 6 players → Scoring rates 14 dimensions → MVP suggests 90-day plan → Composer writes 14-section report | Core | Built | **90/100** |
| V3 | **14-Section Report** | Comprehensive validation document with evidence and citations | Restaurant founder gets: Executive Summary, Problem Analysis, Market Size (TAM $890B), Competitor Map (Toast, Square, MarketMan), Risk Assessment, MVP Roadmap — all with source citations | Core | Built | **85/100** |
| V4 | **Validation Modes** | Different depth levels for different needs | Quick Scan (30s, surface check) vs Deep Dive (90s, full research) vs Investor Lens (focused on what VCs look for) | Core | Built | **75/100** |
| V5 | **PDF Export** | Share report with co-founders, mentors, investors | Founder exports 14-page PDF with charts, sends to Y Combinator mentor for feedback before applying | Core | Built | **70/100** |
| V6 | **Assessment Tone Selector** | Let founders choose feedback harshness | Brutal mode: "Your TAM is under $200M and incumbents dominate" vs Encouraging: "There's a real niche here big players underserve" — same data, different framing | Advanced | Idea | **0/100** |
| V7 | **SSE Progress Streaming** | Show real-time agent steps instead of spinner | "Extracting idea... done (3s) → Researching market... done (18s) → Analyzing 6 competitors... done (16s)" — each step appearing live | Advanced | Idea | **0/100** |
| V8 | **Risk Dimensions + Go/No-Go** | Categorized risk verdict with mitigation steps | "Conditional Go — Market: LOW, Technical: MEDIUM, Regulatory: HIGH. Recommendation: Validate lending licenses in 2 states before building" | Advanced | Idea | **0/100** |
| V9 | **Panel Deep-Dive Regeneration** | Drill into any report section for more detail | Founder clicks "Expand" on Competitor section → system runs deeper analysis on just that section with fresh search | Advanced | Built (backend) | **30/100** |
| V10 | **Comparison Mode** | Compare two ideas side-by-side | Founder validates "AI tutor for kids" and "AI tutor for corporate training" → sees scores, markets, risks compared in two columns | Advanced | Idea | **0/100** |

---

## 2. Lean Canvas

| # | Feature | Use Case | Real-World Example | Tier | Stage | Score |
|---|---------|----------|--------------------|------|-------|:-----:|
| LC1 | **Interactive 9-Box Canvas** | Visual Lean Canvas editor with drag/edit | Founder clicks "Problem" box → types top 3 problems → clicks "Solution" → types matching solutions. Color-coded confidence levels per box | Core | Built | **78/100** |
| LC2 | **AI Auto-Fill from Validation** | Pre-populate canvas from validator results | After running validation on "sustainable fashion marketplace," canvas auto-fills: Problem (fast fashion waste), Customers (eco-conscious millennials), UVP (verified sustainable brands only) | Core | Built | **72/100** |
| LC3 | **AI Coach Sidebar** | Real-time AI suggestions per canvas block | Founder fills "Revenue Streams" with "subscriptions" → Coach suggests: "Consider transaction fees too — marketplaces typically earn 15-20% per sale. Etsy charges 6.5% + $0.20" | Core | Built | **65/100** |
| LC4 | **Version History** | Track canvas evolution over time | Founder sees Version 1 (Day 1) → Version 4 (Week 3) → can compare what changed after customer interviews invalidated original problem hypothesis | Core | Built | **60/100** |
| LC5 | **Confidence Scoring** | Rate certainty per canvas block | Problem block shows "High confidence" (validated by 15 interviews), Revenue shows "Low confidence" (untested pricing assumption) — visual green/yellow/red badges | Core | Built | **55/100** |
| LC6 | **Assumption Extraction** | Auto-extract testable assumptions from canvas blocks | Canvas Problem says "Restaurants waste 30% of food" → system extracts: "Assumption: Restaurants waste 30%+ of food. Status: Untested. Risk: High (if false, no market)" | Core | Built (partial) | **40/100** |
| LC7 | **Canvas-to-Pitch Bridge** | Generate pitch deck from canvas data | Founder clicks "Generate Pitch" → system maps Problem→Slide 2, Solution→Slide 3, Market Size→Slide 4, UVP→Slide 5 → creates 10-slide deck | Advanced | Built (partial) | **35/100** |
| LC8 | **Multi-Canvas Types** | Switch between Lean Canvas, BMC, Value Proposition Canvas | Pre-PMF founder uses Lean Canvas; after finding fit, switches to BMC view for investor meetings without re-entering data | Advanced | Idea | **0/100** |
| LC9 | **SWOT/SOAR Generation** | AI generates strategic analysis from canvas + competitors | Coach generates: "Strengths: Technical team, low burn. Weaknesses: No distribution. Opportunities: $890B restaurant market. Threats: Toast expanding into inventory" | Advanced | Idea | **0/100** |
| LC10 | **Workshop/Collaboration Mode** | Multiple founders edit simultaneously | Co-founders in different cities both edit canvas live — changes sync in real-time, each sees the other's cursor | Advanced | Idea | **0/100** |

---

## 3. Onboarding

| # | Feature | Use Case | Real-World Example | Tier | Stage | Score |
|---|---------|----------|--------------------|------|-------|:-----:|
| O1 | **4-Step Wizard** | Guided startup setup (Context → AI Analysis → Interview → Review) | New founder signs up → Step 1: selects "SaaS" + "EdTech" → Step 2: AI analyzes industry → Step 3: answers tailored questions → Step 4: reviews generated profile | Core | Built | **85/100** |
| O2 | **Industry Expert Agent** | AI asks industry-specific follow-up questions | Founder selects "FinTech" → system asks about regulatory approach, payment rails, compliance strategy — not generic questions | Core | Built | **80/100** |
| O3 | **URL Import** | Extract company profile from existing website | Founder pastes "myrestaurant.ai" → Gemini URL Context pulls: company description, team size, product features, target market → auto-fills profile | Core | Built | **75/100** |
| O4 | **Competitor Intel Detection** | Auto-detect competitors during onboarding | System finds 6 competitors from the founder's industry + description, shows logos and key differentiators before the founder even asks | Core | Built | **70/100** |

---

## 4. Dashboard (Command Centre)

| # | Feature | Use Case | Real-World Example | Tier | Stage | Score |
|---|---------|----------|--------------------|------|-------|:-----:|
| D1 | **Startup Health Score** | 6-dimension health snapshot (team, product, market, traction, finance, strategy) | Dashboard shows: Product 78%, Traction 23%, Finance 45% → founder instantly sees traction is the bottleneck | Core | Built | **40/100** |
| D2 | **Daily Focus Card** | AI-recommended top 3 actions for today | "Today: (1) Follow up with 3 interview leads, (2) Update Revenue model after pricing test, (3) Review competitor Toast's new feature launch" | Core | Built | **35/100** |
| D3 | **Quick Actions** | One-click shortcuts to common tasks | Buttons: "Run Validation" / "Update Canvas" / "Add Experiment" / "View Report" — each links to the right screen pre-filled | Core | Built | **30/100** |
| D4 | **Stage Guidance** | Show where founder is in the startup journey | "You're in Validation stage (Week 3 of 12). 4 of 8 assumptions tested. Next gate: 6/8 assumptions validated to advance to MVP stage" | Core | Built (partial) | **25/100** |
| D5 | **Module Progress Tracker** | Visual progress across all StartupAI modules | Canvas: 80% → Validation: Done → Experiments: 2/5 → Pitch Deck: Not started. Click any to jump to that module | Core | Built (partial) | **20/100** |
| D6 | **Command Centre Redesign** | Full 3-panel dashboard per wireframe 06 | Left: navigation + filters. Center: stage timeline + sprint cards + metrics. Right: AI coach panel with contextual suggestions | Advanced | Planned | **15/100** |
| D7 | **AARRR Metrics Dashboard** | Acquisition, Activation, Retention, Revenue, Referral funnel | Shows: 500 landing visits → 80 signups (16%) → 35 active (44%) → 12 paying (34%) → 3 referrals (25%). Each stage clickable for breakdown | Advanced | Planned | **15/100** |

---

## 5. Experiments Lab

| # | Feature | Use Case | Real-World Example | Tier | Stage | Score |
|---|---------|----------|--------------------|------|-------|:-----:|
| E1 | **Experiment Cards** | Track individual validation experiments | Card: "Fake Door Test — Landing page for AI meal planner. Success criteria: >5% signup rate. Status: Running. Result: 8.2% (Validated)" | Core | Built | **45/100** |
| E2 | **Create Experiment Dialog** | Define hypothesis, method, success criteria | Founder creates: Hypothesis "Restaurants will pay $99/mo for inventory AI" → Method "10 cold calls with pricing pitch" → Success ">3 verbal commits" | Core | Built | **40/100** |
| E3 | **AI Experiment Generator** | Auto-suggest experiments from canvas assumptions | System reads assumption "Customers will switch from spreadsheets" → suggests: "Concierge test: manually manage inventory for 3 restaurants for 2 weeks. Success: 2/3 say they'd pay" | Core | Built (backend) | **30/100** |
| E4 | **Experiment Templates** | Pre-built experiment types (interview, landing page, concierge, fake door, survey) | Founder picks "Landing Page Test" template → pre-filled: method (build page, run ads), metrics (visits, signups, conversion), timeline (2 weeks), budget ($200 ad spend) | Advanced | Idea | **0/100** |
| E5 | **Pain Index Scoring** | Score customer interviews with 6-question framework | After 10 interviews: ranked problems (4.2/5), actively solving (3.1/5), engaged (4.5/5), follow-up (3.8/5), referrals (2.9/5), willing to pay (3.5/5) → Pain Index: 35/50 (Strong) | Advanced | Idea | **0/100** |
| E6 | **Experiment History per Assumption** | Track all tests run against one assumption | Assumption "Users will pay $49/mo" → Test 1: Survey (invalidated at $49) → Test 2: Survey (validated at $29) → Test 3: Fake checkout (validated at $29) | Advanced | Idea | **0/100** |

---

## 6. Market Research

| # | Feature | Use Case | Real-World Example | Tier | Stage | Score |
|---|---------|----------|--------------------|------|-------|:-----:|
| MR1 | **TAM/SAM/SOM Cards** | Market sizing with AI research | "AI Restaurant Inventory" → TAM: $890B (global restaurant tech), SAM: $45B (US restaurant management), SOM: $2.3B (AI inventory specifically) | Core | Built | **50/100** |
| MR2 | **Industry Trends** | AI-curated trend analysis | Shows: "Cloud kitchen growth +340% since 2022", "Ghost kitchen market $72B by 2028", "Labor shortage driving automation adoption" | Core | Built | **45/100** |
| MR3 | **Competitor Grid** | Visual competitor comparison matrix | Grid: Toast (POS + inventory, $25B), Square (payments + basic inventory, $40B), MarketMan (inventory only, $50M) — with feature checkmarks | Core | Built | **45/100** |
| MR4 | **Competitor URL Deep-Dive** | Paste URL → get structured company dossier | Founder pastes "toast.com" → system returns: founding year, funding ($950M), employee count (5000+), product features, pricing tiers, key customers, recent news | Advanced | Idea | **0/100** |
| MR5 | **Search Interest / Demand Signals** | Google Trends + keyword data for demand validation | "AI inventory restaurant" → search volume: 12,100/mo (+180% YoY), related queries: "restaurant food waste solution" (8,400/mo), seasonal peak: January | Advanced | Idea | **0/100** |

---

## 7. Opportunity Canvas

| # | Feature | Use Case | Real-World Example | Tier | Stage | Score |
|---|---------|----------|--------------------|------|-------|:-----:|
| OC1 | **5-Dimension Scoring** | Score opportunity across Problem, Market, Solution, Team, Timing | "AI tutor for kids" scores: Problem 85 (real pain), Market 72 (growing), Solution 60 (crowded), Team 80 (ML background), Timing 90 (post-COVID ed-tech boom) | Core | Built | **40/100** |
| OC2 | **Recommendation Badge** | Pursue / Explore / Defer / Reject verdict | Total score 77 → "Pursue" with callout: "Strong timing and problem scores offset competitive solution space. Focus differentiation on adaptive learning" | Core | Built | **35/100** |
| OC3 | **Radar Chart** | Visual comparison of opportunity dimensions | 5-axis radar showing Problem (high), Market (medium), Solution (low) — instantly see where the idea is strong vs weak | Advanced | Planned | **0/100** |

---

## 8. Pitch Deck

| # | Feature | Use Case | Real-World Example | Tier | Stage | Score |
|---|---------|----------|--------------------|------|-------|:-----:|
| PD1 | **4-Step Wizard** | Guided deck creation (Audience → Content → Style → Generate) | Founder selects "Angel investors" → system prioritizes team and traction slides → picks professional tone → generates 10-slide deck in 60s | Core | Built | **70/100** |
| PD2 | **Slide Editor** | Edit individual slides with AI suggestions | Founder edits Slide 3 (Problem) → AI suggests: "Add a specific customer quote from your interviews to make this concrete" | Core | Built | **65/100** |
| PD3 | **Canvas-to-Deck Mapping** | Auto-populate slides from Lean Canvas data | Canvas Problem → Problem Slide, Canvas UVP → Value Prop Slide, Canvas Metrics → Traction Slide — no re-typing | Core | Built | **60/100** |
| PD4 | **Visual Generation** | AI-generated slide visuals and diagrams | "Generate a competitive landscape diagram" → produces 2x2 matrix positioning your product vs 4 competitors | Advanced | Built (partial) | **40/100** |
| PD5 | **Deck Evaluator** | AI scores your pitch deck like an investor would | Scores: Story arc 7/10, Problem clarity 9/10, Market sizing 6/10 (too generic), Team 8/10, Ask 5/10 (missing use of funds breakdown) | Advanced | Idea | **0/100** |

---

## 9. Sprint Planning (90-Day Cycles)

| # | Feature | Use Case | Real-World Example | Tier | Stage | Score |
|---|---------|----------|--------------------|------|-------|:-----:|
| SP1 | **Sprint Cards** | Plan-Do-Check-Act cards for each sprint | Sprint 1 (Weeks 1-2): Plan — validate top 3 assumptions. Do — run 10 customer interviews. Check — 7/10 confirmed pain. Act — proceed to pricing test | Core | Built | **35/100** |
| SP2 | **Sprint Timeline** | Visual 90-day timeline with milestones | Timeline shows: BMD (Week 1) → Sprint 1 (Weeks 2-3) → Sprint 2 (Weeks 4-5) → Review (Week 6) → Sprint 3... with progress markers | Core | Built | **30/100** |
| SP3 | **PDCA Editor** | Structured Plan-Do-Check-Act per sprint | Editor with 4 tabs: Plan (goals + constraints), Do (tasks + experiments), Check (results + learnings), Act (pivot/persevere decisions) | Core | Built | **25/100** |
| SP4 | **Kanban Board** | Drag-and-drop task management within sprints | Columns: Backlog → This Sprint → In Progress → Done. Cards show task, owner, experiment link, due date | Advanced | Planned | **0/100** |
| SP5 | **Stage Gates** | Auto-detect when founder is ready for next stage | System checks: "6/8 assumptions validated, retention >20%, 3 paying customers → Ready to advance from Validation to MVP stage" | Advanced | Idea | **0/100** |

---

## 10. AI Coach & Chat

| # | Feature | Use Case | Real-World Example | Tier | Stage | Score |
|---|---------|----------|--------------------|------|-------|:-----:|
| AC1 | **Global AI Chat** | Ask anything about your startup | "Should I raise from angels or VCs?" → Coach explains: Angels invest 10K-1M (1-3 months, 10-20% equity) vs VCs 500K-50M+ (4-9 months, 15-30%) based on your stage and traction | Core | Built | **70/100** |
| AC2 | **Context-Aware Suggestions** | AI knows your canvas, metrics, stage | Coach sees low traction score → proactively suggests: "You haven't run any experiments this week. Your riskiest assumption is still untested. Want me to suggest an experiment?" | Core | Built | **60/100** |
| AC3 | **Fundraising Strategist Mode** | Deep fundraising guidance | "What's my pre-money valuation?" → Coach calculates based on stage, traction, market, and comps: "Comparable pre-seed SaaS deals in EdTech: $3-5M. Your traction supports $3.5M" | Advanced | Planned | **20/100** |
| AC4 | **Coach Personality Modes** | Adjust coaching style (Mentor, Challenger, Analyst) | Mentor mode: warm encouragement + next steps. Challenger mode: "Why would anyone switch from Toast? Your differentiation is weak." Analyst mode: data-heavy, minimal opinion | Advanced | Idea | **0/100** |
| AC5 | **Knowledge Search (RAG)** | Search curated startup knowledge base | Founder asks "What's a good churn rate for B2B SaaS?" → RAG retrieves from knowledge chunks: "Bessemer says <5% monthly for healthy B2B SaaS" with source link | Advanced | Built (backend) | **25/100** |

---

## 11. CRM & Investors

| # | Feature | Use Case | Real-World Example | Tier | Stage | Score |
|---|---------|----------|--------------------|------|-------|:-----:|
| CR1 | **Contact Management** | Track customer interview contacts | Add "Sarah Chen, Head of Ops, CloudKitchen" → log: interviewed 2/5, pain score 4.2/5, interested in beta, follow up next week | Core | Built | **55/100** |
| CR2 | **AI Lead Scoring** | Auto-score contacts by likelihood to convert | Sarah Chen: Pain score HIGH, Budget authority YES, Timeline URGENT → Lead score: 87/100 (Hot) | Core | Built | **45/100** |
| CR3 | **Investor Matching** | Match startup to relevant investors | "AI + Restaurant Tech, Pre-Seed, $500K" → matches: Techstars (restaurant cohort), Innovation Endeavors (food-tech), Initialized Capital (B2B SaaS) | Core | Built | **50/100** |
| CR4 | **Investor Fit Scoring** | Rate how well each investor matches | Techstars Restaurant: Fit 92% (focus area match, stage match, check size match). General Catalyst: Fit 45% (too large, Series A focus) | Advanced | Built | **40/100** |
| CR5 | **Email Generation** | AI-drafted outreach emails | "Generate intro email for Techstars" → drafts: personalized opening (references their restaurant cohort), your traction, specific ask, CTA | Advanced | Built | **35/100** |

---

## 12. Documents & Templates

| # | Feature | Use Case | Real-World Example | Tier | Stage | Score |
|---|---------|----------|--------------------|------|-------|:-----:|
| DO1 | **Document Management** | Store and organize startup documents | Library shows: Validation Report v3, Lean Canvas v7, Pitch Deck v2, Customer Interview Notes — searchable and tagged | Core | Built | **40/100** |
| DO2 | **AI Document Generation** | Generate documents from templates | "Generate Executive Summary" → pulls from canvas, validation, and metrics to create 2-page summary for accelerator application | Core | Built | **35/100** |
| DO3 | **5 Document Templates** | Pre-built templates for common startup docs | Templates: Executive Summary, One-Pager, Investor Update, Customer Case Study, Partnership Proposal | Advanced | Built | **30/100** |

---

## 13. Events

| # | Feature | Use Case | Real-World Example | Tier | Stage | Score |
|---|---------|----------|--------------------|------|-------|:-----:|
| EV1 | **Event List & Detail** | Browse startup events (demo days, meetups, conferences) | Shows: "TechCrunch Disrupt SF — Oct 15-17, Startup battlefield, $595, Deadline: Aug 30" with apply link | Core | Built | **65/100** |
| EV2 | **Event Creation Wizard** | Create and publish events | Accelerator creates: "FoodTech Demo Day, Virtual, May 15, Free, 200 seats" → published to public directory | Core | Built | **55/100** |
| EV3 | **AI Event Matching** | Recommend relevant events based on startup profile | "You're in restaurant tech + pre-seed → recommended: Techstars Restaurant Demo Day (Mar 20), FoodTech Summit (Apr 8), YC Office Hours (ongoing)" | Advanced | Built (partial) | **30/100** |

---

## 14. Projects & Tasks

| # | Feature | Use Case | Real-World Example | Tier | Stage | Score |
|---|---------|----------|--------------------|------|-------|:-----:|
| PT1 | **Project Portfolio** | Track multiple startup projects | Solo founder with 3 ideas: "AI Meal Planner" (validated), "Restaurant Inventory" (in progress), "Kitchen Marketplace" (paused) | Core | Built | **60/100** |
| PT2 | **Task Management** | Create, assign, track tasks | Tasks: "Interview 5 restaurant owners (3/5 done)", "Build landing page (not started)", "Submit YC application (due Feb 15)" | Core | Built | **55/100** |
| PT3 | **AI Task Suggestions** | Auto-suggest next tasks based on stage and progress | After completing 5 interviews → AI suggests: "Synthesize interview findings", "Update canvas with new insights", "Design pricing experiment" | Advanced | Built | **40/100** |

---

## 15. Analytics & Insights

| # | Feature | Use Case | Real-World Example | Tier | Stage | Score |
|---|---------|----------|--------------------|------|-------|:-----:|
| AN1 | **AARRR Funnel** | Pirate metrics visualization | Acquisition: 500 → Activation: 80 (16%) → Retention: 35 (44%) → Revenue: 12 (34%) → Referral: 3 (25%) | Core | Planned | **15/100** |
| AN2 | **Insights Generator** | AI surfaces opportunities and risks from metrics | "Your activation rate dropped 12% this week. The drop correlates with the new onboarding flow change. Consider reverting or A/B testing" | Advanced | Built (backend) | **20/100** |
| AN3 | **OMTM Tracker** | One Metric That Matters per stage | Stickiness stage → OMTM: "Weekly retention rate" → Target: >40% → Current: 32% → Coach: "Focus on 'aha moment' before adding features" | Advanced | Idea | **0/100** |

---

## 16. Lean Analytics & Frameworks (From Ideas Docs)

These features come from `lean/ideas/` research but have NO implementation yet:

| # | Feature | Use Case | Real-World Example | Tier | Stage | Score |
|---|---------|----------|--------------------|------|-------|:-----:|
| LA1 | **Validation Board View** | Visual board: Assumption → Method → Result → Status | Board shows 8 assumptions as cards flowing through: Untested → Testing → Validated/Invalidated. Founder drags "Pricing" card from Testing to Validated after fake checkout test | Advanced | Idea | **0/100** |
| LA2 | **Customer Journey Map** | Visual touchpoint map from awareness to advocacy | Map: See ad → Visit landing → Sign up → First use → "Aha" moment → Habit → Refer. Each step shows: conversion rate, drop-off %, pain points, improvement ideas | Advanced | Idea | **0/100** |
| LA3 | **Value Proposition Canvas** | Deep-dive: Customer Jobs/Pains/Gains vs Pain Relievers/Gain Creators | Left side (customer): "Job: Track inventory daily. Pain: Manual counts take 2hrs. Gain: Save food costs." Right side (product): "Pain reliever: Auto-counting via camera. Gain creator: Predictive ordering" | Advanced | Idea | **0/100** |
| LA4 | **PMF Readiness Gate** | Automated product-market fit assessment | System evaluates: Sean Ellis score (38%), retention curve (flattening at 28%), NPS (42), revenue growth (+15% MoM) → "Approaching PMF — focus on retention before scaling" | Advanced | Idea | **0/100** |
| LA5 | **Investment Readiness Level (IRL)** | Fundraising readiness scoring | IRL score: 6/9 — Team (2/2), Problem validated (2/2), Solution tested (1/2), Market proved (1/2), Revenue model (0/1). "Complete revenue model validation before investor outreach" | Advanced | Idea | **0/100** |
| LA6 | **Remotion Motion Infographics** | Animated data videos for pitches and reports | Validation report exported as 30-second animated video: score counting up, market size bars growing, competitor logos appearing — ready for LinkedIn or pitch | Advanced | Idea | **0/100** |
| LA7 | **Tech Stack Recommender** | AI suggests optimal tech stack for MVP | "Restaurant inventory SaaS" → recommends: "Next.js + Supabase + Stripe (fast to market, low cost) vs React Native + Firebase (if mobile-first). Estimated build: 6-8 weeks solo" | Advanced | Idea | **0/100** |
| LA8 | **30-Second Pitch Generator** | One-sentence investor pitch from canvas | "We help independent restaurants reduce food waste 40% with AI-powered inventory management, unlike Toast we focus exclusively on waste reduction — our pilot saved 3 restaurants $2,100/month each" | Advanced | Idea | **0/100** |
| LA9 | **Monetization Optimizer** | AI-suggested pricing and revenue models | Analyzes competitors' pricing + founder's cost structure → suggests: "Tiered SaaS: $49/mo (single location) / $149/mo (multi-location) / $399/mo (enterprise). Based on Toast ($69-$165) and MarketMan ($199+)" | Advanced | Idea | **0/100** |

---

## 17. Infrastructure & Platform

| # | Feature | Use Case | Real-World Example | Tier | Stage | Score |
|---|---------|----------|--------------------|------|-------|:-----:|
| IF1 | **OAuth Auth (Google, LinkedIn)** | Secure login | Founder clicks "Sign in with Google" → redirects → lands on dashboard. Session persists across devices | Core | Built | **95/100** |
| IF2 | **RLS Policies** | Row-level security on all tables | Each founder only sees their own data. 88/89 tables have RLS. No cross-tenant data leaks | Core | Built | **90/100** |
| IF3 | **Shared AI Client** | Centralized Gemini + Claude interface with cost tracking | All edge functions use `_shared/gemini.ts` with timeout, retry, and cost logging. (8 functions still use inline — Gemini compliance fix pending) | Core | Built (partial) | **75/100** |
| IF4 | **Rate Limiting** | 3-tier rate limiting (per user, per function, global) | Prevents abuse: 10 validations/hour per user, 100/hour global. Returns 429 with retry-after header | Core | Built | **70/100** |
| IF5 | **Code Splitting** | 40 lazy-loaded chunks for fast initial load | Landing page loads in <2s. Dashboard, Validator, Canvas each load on demand | Core | Built | **85/100** |
| IF6 | **Knowledge RAG Pipeline** | Vector embeddings for startup knowledge search | 347 knowledge chunks embedded with OpenAI. Supports: "What's a good SaaS churn rate?" → retrieves relevant passages | Advanced | Built | **40/100** |
| IF7 | **Workflow Triggers** | Score-to-task automation (18 trigger rules) | Health score drops below 30% on "traction" → auto-creates task: "Run customer interviews this week" → assigns to founder | Advanced | Built | **35/100** |

---

## Score Distribution

| Range | Count | Examples |
|-------|:-----:|---------|
| **90-100** | 3 | Auth (95%), 7-Agent Pipeline (90%), RLS (90%) |
| **70-89** | 10 | Follow-up Chat (88%), Onboarding (85%), Code Splitting (85%), Canvas Grid (78%) |
| **50-69** | 10 | Pitch Wizard (70%), AI Chat (70%), Events (65%), Canvas Coach (65%) |
| **30-49** | 18 | CRM (55%), Market Research (50%), Experiments (45%), Sprints (35%) |
| **1-29** | 10 | Dashboard (15-25%), Analytics (15-20%), Insights (20%) |
| **0 (Idea only)** | 24 | Tone Selector, SSE Streaming, Risk Dimensions, Validation Board, SWOT, SOAR, VPC, Kanban, PMF Gate, Remotion, Tech Stack, etc. |

**Total features tracked: 75**
- Core MVP: 42 features (31 built, 11 planned/idea)
- Advanced: 33 features (12 built/partial, 21 idea)

---

## Prompts Needed

These features from `lean/ideas/` and `lean/lean-system/` have strategy docs but **no implementation task prompts**:

| # | Feature | Source Doc | Priority |
|---|---------|-----------|:--------:|
| 1 | Assessment Tone Selector (V6) | `ideas/validateAI-repos.md` | P1 |
| 2 | SSE Progress Streaming (V7) | `ideas/validateAI-repos.md` | P1 |
| 3 | Risk Dimensions + Go/No-Go (V8) | `ideas/validateAI-repos.md` | P2 |
| 4 | Experiment Templates (E4) | `ideas/ideas.md` §1.1, `ideas/validate.md` §1.1 | P2 |
| 5 | Pain Index Scoring (E5) | `ideas/ideas.md` §1.1 (Lean Analytics) | P2 |
| 6 | Validation Board View (LA1) | `ideas/validate.md` §Slidebean, `lean-system/11-scenario-planning.md` | P2 |
| 7 | Customer Journey Map (LA2) | `ideas/product.md` §2 | P3 |
| 8 | Value Proposition Canvas (LA3) | `ideas/lean-strategy.md` §2, `lean-system/02-lean-canvas-strategy.md` | P3 |
| 9 | SWOT/SOAR Generation (LC9) | `ideas/swot.md`, `ideas/lean-strategy.md` §2 | P3 |
| 10 | PMF Readiness Gate (LA4) | `ideas/product-fit.md`, `ideas/product.md` §1 | P3 |
| 11 | OMTM Tracker (AN3) | `ideas/lean-analytics.md` §2-3 | P3 |
| 12 | Tech Stack Recommender (LA7) | `ideas/validateAI-repos.md` §6 (ThinkTank) | P3 |
| 13 | 30-Second Pitch Generator (LA8) | `ideas/validateAI-repos.md` §6 (ai_idea_validator) | P3 |
| 14 | Monetization Optimizer (LA9) | `ideas/validateAI-repos.md` §6 (ThinkTank) | P3 |
| 15 | Motion Infographics (LA6) | `ideas/remotion.md` | P4 |
| 16 | Comparison Mode (V10) | New idea | P4 |
| 17 | Multi-Canvas Types (LC8) | `ideas/lean-ai.md` §1 (bcanvas) | P4 |
| 18 | Coach Personality Modes (AC4) | `ideas/validateAI-repos.md` §6 (idea-sieve tone) | P3 |
| 19 | Competitor URL Deep-Dive (MR4) | `ideas/validateAI-repos.md` §6 (Exa) | P2 |
| 20 | Search Interest / Demand Signals (MR5) | `ideas/ideas.md` §1.3 (Fe/male) | P3 |
| 21 | Investment Readiness Level (LA5) | `ideas/validate.md` §Merlin (IRL) | P3 |
| 22 | Kanban Board (SP4) | `lean-system/01-tasks-core.md` | P2 |
| 23 | Stage Gates (SP5) | `ideas/lean-strategy.md` §3, `ideas/lean-analytics.md` §3 | P3 |
| 24 | Deck Evaluator (PD5) | `ideas/validate-startup.md` §1.2 (Inodash) | P3 |

---

## New Features Discovered (from `lean/docs/ideas/` deep review — 2026-02-10)

> **Source:** 10 strategy docs in `lean/docs/ideas/` (ideas.md, lean-ai.md, lean-analytics.md, lean-strategy.md, product-fit.md, product.md, swot.md, validateAI-repos.md, validate.md, validate-startup.md)
> These features are NOT in the 75 above. Extracted from competitor analysis, framework research, and strategic planning docs.

### P1 — High Impact, Ship First

| # | Feature | Description | Source | Category |
|---|---------|-------------|--------|----------|
| N1 | **Confidence Tiers** | Label ALL insights: Grounded (cited source), Synthesized (LLM reasoning), Speculative (extrapolation). Show on report, coach, canvas | `validate-startup.md` (Equisy) | Validator |
| N2 | **Problem/Solution Fit Score** | 0-100 with 4 sub-scores: problem understanding, solution match, UVP clarity, implementation clarity | `validate-startup.md` §scoring | Validator |
| N3 | **Riskiest Assumption Flag** | Mark one assumption as "riskiest" on canvas/board, AI suggests "test this first" | `ideas.md` §validation-canvas | Experiments |
| N4 | **OMTM per Stage** | One Metric That Matters field on canvas/roadmap with stage detection + baseline/target suggestion | `lean-analytics.md` §OMTM | Analytics |
| N5 | **"Generate from Idea" One-Shot** | Paste idea → auto-fill entire canvas + 1-3 name suggestions. No wizard needed | `lean-ai.md` §leancanvasai | Lean Canvas |
| N6 | **Tier A Source Citations** | Prioritize Deloitte, BCG, McKinsey, Gartner, CB Insights citations over generic web sources | `validate-startup.md` §sources | Validator |
| N7 | **Solo Founder Weekly Review** | 30-min guided prompt: what learned, decisions made, metrics changed, next week focus | `lean-strategy.md` §solo-founder | Dashboard |
| N8 | **Coach: Behavior vs Opinion Nudge** | When logging experiment results, prompt: "Did you measure what they DO or what they SAID?" | `validate.md` §4-pillars | Coach |

### P2 — Medium Impact, Next Sprint

| # | Feature | Description | Source | Category |
|---|---------|-------------|--------|----------|
| N9 | **"Refine Block" Action** | Per-canvas-block "Improve this" → AI suggests better text, user accepts/edits/rejects | `lean-ai.md` §lean-businesses-ai | Lean Canvas |
| N10 | **Socratic Coach** | Ask one question at a time (riskiest assumption, success criteria, customer segment), persist answers | `lean-ai.md` §ai-sparring-partner | Coach |
| N11 | **"Criticize / Praise / Clarity" Buttons** | Three distinct AI actions on canvas or report with different tones | `lean-ai.md` §ai-sparring-partner | Coach |
| N12 | **Share Canvas Link** | Revocable read-only or edit link for co-founders/mentors | `lean-ai.md` §canvanizer | Lean Canvas |
| N13 | **Per-Block "Use AI To..." Hints** | Contextual AI actions per block: "Generate value props", "List channels", "Suggest pricing" | `lean-ai.md` §creately | Lean Canvas |
| N14 | **SWOT-to-Actions Coach** | Generate SO/WO/ST/WT strategies from SWOT analysis | `ideas.md` §SOAR, `swot.md` | Coach |
| N15 | **Coach: Framework Picker** | "When to use Lean Canvas vs BMC vs VPC vs Validation Board?" guidance | `lean-ai.md` §multi-canvas | Coach |
| N16 | **Coach: Traction in Parallel** | At Idea/Seed stage, remind: "Do 20-30 customer conversations alongside building" | `lean-strategy.md` §traction | Coach |
| N17 | **Niche Checklist** | 4-factor validation: unique needs, sufficient size, manageable competition, effective channels | `ideas.md` §niche-market | Validator |
| N18 | **VC Interrogator** | Practice investor Q&A — AI asks probing Qs, scores clarity/confidence/completeness | `validateAI-repos.md` §StartupVision | Pitch Deck |
| N19 | **Industry/Template Hints** | "SaaS", "D2C", "Marketplace" buttons to tailor canvas generation and coaching | `lean-ai.md` §convoboss | Lean Canvas |
| N20 | **Validation Checklist (Gated)** | Pre-build → Before MVP → Before charging → Ongoing checklists as linear view | `validate.md` §checklist | Experiments |
| N21 | **Action Plan Output** | After report: Quick wins (1-2w), Critical tasks (1-2m), Risk mitigation items | `validate-startup.md` §action-plan | Validator |
| N22 | **Traction Planning Framework** | 5-step guide: early adopters → value prop → MVP experiment → targeted outreach → 30-day validation | `lean-strategy.md` §traction-planning | Dashboard |
| N23 | **Live Adaptive Scoring** | Score evolves as founder provides feedback/experiment results, not one-shot | `validateAI-repos.md` §Equisy | Validator |
| N24 | **PMF Readiness Signals** | Automated tracker: NPS, "very disappointed" %, unsolicited referrals, organic growth, declining CAC | `product-fit.md` §signals, `lean-strategy.md` | Analytics |
| N25 | **B2B vs B2C Experiment Hints** | When creating experiments, suggest different methods based on business model | `validate.md` §b2b-vs-b2c | Experiments |
| N26 | **Customer Journey Map** | Stages, touchpoints, conversion %, drop-off %, pain points, improvements per stage | `product.md` §journey | Analytics |
| N27 | **ROI / Effort Matrix** | 2x2 prioritization for features: Quick Wins, Strategic Bets, Nice-to-Haves, Resource Drains | `product.md` §roi | Tasks |

### P3 — Nice-to-Have, Future

| # | Feature | Description | Source | Category |
|---|---------|-------------|--------|----------|
| N28 | **Batch Validation** | Compare 5-10 ideas side-by-side with ranking | `validateAI-repos.md` §IdeaValidationPro | Validator |
| N29 | **Scenario Modeling** | "What if CAC doubles?" or "market is 50% smaller?" with canvas variants | `lean-strategy.md` §scenario | Canvas |
| N30 | **Early Warning System** | Monitor CAC/conversion/churn trends, predict decline, alert before recovery point | `lean-strategy.md` §early-warning | Analytics |
| N31 | **PMF Pyramid Screen** | Hypothesis testing across Dan Olsen's 5 layers (customer → needs → UVP → features → UX) | `product-fit.md` §pyramid | Analytics |
| N32 | **Knowledge Graph View** | Mermaid visualization: persona ↔ problem ↔ solution ↔ assumptions ↔ experiments | `lean-ai.md` §ai-sparring-partner | Lean Canvas |
| N33 | **User Story Template Exporter** | Generate "As a / I want / So that" + acceptance criteria from MVP Planner output | `product.md` §user-stories | Tasks |
| N34 | **Product Launch Checklist** | Pre/Dev/Brand/Sales/Ops/Day-of/Post-launch in Coach or Roadmap | `product.md` §launch | Dashboard |
| N35 | **48-Hour Validation Checklist** | 8-step process: demand, competition, personas, willingness to pay, interviews, TAM/SAM, pricing, score | `validate-startup.md` §48hr | Experiments |
| N36 | **Founder Resilience Metrics** | Track resilience, expertise, network strength alongside business metrics | `lean-strategy.md` §resilience | Dashboard |
| N37 | **Leading Indicators Tracking** | "7 friends in 10 days" (Facebook-style) for engagement/retention | `lean-analytics.md` §leading | Analytics |
| N38 | **Confidence Bands on Predictions** | "Market size likely $20-50B (80% confidence)" with ranges, not point estimates | `validate-startup.md` §confidence | Validator |

---

## Updated Summary

**Total features tracked: 113**
- Original 75 features (Core: 42, Advanced: 33)
- New 38 features from ideas deep review (P1: 8, P2: 19, P3: 11)

**Score distribution (original 75):**
| Range | Count |
|-------|:-----:|
| 90-100 | 3 |
| 70-89 | 10 |
| 50-69 | 10 |
| 30-49 | 18 |
| 1-29 | 10 |
| 0 (Idea) | 24 |

**New features (all Idea stage, score 0/100):** 38 features across 8 categories — mostly Lean Canvas (7), Coach (5), Validator (7), Analytics (5), Experiments (4), Dashboard (4), Tasks (2), Pitch Deck (1)

---

*See also: `lean/next-steps.md` (phased build plan), `lean/strategy.md` (architecture), `lean/docs/ideas/` (10 strategy docs), `lean/prompts/` (PRD, roadmap, strategy, personas, stories, value-prop, features-analysis)*
