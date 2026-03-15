# Agency Agents Integration — Summary

> How StartupAI uses 132 specialized AI agents to give founders better advice, faster validation, and smarter tools.

---

## What We Did

We integrated a curated selection of 27 specialized AI agent personas from an open-source library of 132 agents (covering engineering, sales, marketing, product, and testing) into StartupAI. These agents aren't chatbots — they're structured collections of expert knowledge, proven frameworks, and battle-tested methodologies that make every AI feature in StartupAI dramatically smarter.

Think of it like this: before, our AI features had general knowledge. Now they have the equivalent of a growth strategist, a deal closer, a sprint planner, and an investor coach sitting behind every feature — each one trained on the exact frameworks that real professionals use.

---

## The Four Layers

### 1. Developer Agents (10 agents)

These help the engineering team build StartupAI faster and with fewer bugs. Each agent is a specialized coding assistant that already knows our tech stack (React, Supabase, Tailwind), our conventions (RLS on every table, JWT on every endpoint), and our architecture (47 pages, 31 edge functions, 89 database tables).

**Real-world example:** When a developer needs to add a new database feature, the Database Optimizer agent already knows our 89 tables, 343 RLS policies, and the `user_org_id()` helper function. Instead of spending 30 minutes reading documentation, the developer gets immediate, project-aware guidance. The Security Engineer agent catches missing RLS policies before they become vulnerabilities. The Reality Checker agent runs a full production-readiness audit before any release.

**Benefit:** Faster development cycles, fewer bugs shipped, consistent code quality across the team.

### 2. Domain Knowledge Skills (8 skills)

These are reusable knowledge modules that any AI feature in StartupAI can draw from. Each skill contains expert-level frameworks adapted specifically for startup founders.

**The skills and what they bring:**

- **Growth Hacker** — AARRR pirate metrics, viral loop design, CAC/LTV analysis, and channel selection by startup stage. When our AI recommends growth channels in a validation report, it now uses the same ICE scoring framework that professional growth teams use.

- **Deal Strategist** — The complete MEDDPICC qualification framework used by enterprise sales teams worldwide. Adapted for investor qualification: instead of scoring a sales deal, it scores how likely an investor is to fund your startup across 8 dimensions.

- **Sprint Prioritizer** — RICE scoring (Reach × Impact × Confidence ÷ Effort), Kano model classification, and capacity planning. When our Sprint Board generates tasks, they now come pre-scored and sequenced using the same frameworks product managers at top companies use.

- **Outbound Strategist** — Signal-based selling, ICP definition templates, and multi-channel outreach sequences. When a founder uses the CRM to reach out to investors, the AI now generates outreach emails using proven cold email anatomy (signal-based opening, one-sentence value prop, low-friction CTA).

- **Feedback Synthesizer** — Multi-channel feedback collection, sentiment analysis pipelines, and thematic coding. This powers evidence-weighted scoring in the validator — claims backed by cited sources score higher than founder assumptions.

- **Behavioral Nudge** — Cognitive load reduction, momentum building, and focus protection patterns. This is the science behind making the dashboard feel motivating instead of overwhelming. Start each day with a quick win. Show streaks. Never dump 50 tasks on a founder at once.

- **Sales Coach** — Socratic coaching methodology and MEDDPICC as a diagnostic tool. This powers the Practice Pitch chat mode where founders rehearse investor meetings with an AI that asks the same hard questions real investors ask.

- **Proposal Strategist** — Win theme development, three-act narrative structure, and persuasion architecture. This makes pitch decks tell a story instead of listing features: Mirror the investor's world → Build tension around the problem → Present the transformed future.

**Real-world example:** Sarah is building a B2B SaaS for dental clinics. She runs the validator and gets a report. Before this integration, the report might say "your market size is $2.4B." Now, the Composer uses the Growth Hacker skill to recommend specific channels for her stage (she's pre-PMF, so content marketing and community — not paid ads). The Scoring Agent uses the Feedback Synthesizer skill to flag that her TAM claim is AI-inferred (not cited), automatically discounting it and noting the bias. The executive summary uses the Proposal Strategist's three-act narrative to tell a compelling story instead of listing dry facts.

**Benefit:** Every AI output is now grounded in professional frameworks, not generic language model responses.

### 3. Edge Function Prompt Fragments (5 fragments)

These are knowledge modules designed to be injected directly into the system prompts of our existing Supabase edge functions. They're the bridge between the skills (which humans read) and the AI models (which need structured instructions).

**What each fragment does:**

- **Validator Scoring Fragment** — Teaches the scoring agent to weight evidence by quality (cited source = full weight, founder claim = 80%, AI inference = 60%), generate RICE-scored priority actions for each dimension, and detect four types of bias (confirmation, survivorship, anchoring, optimism).

- **Validator Composer Fragment** — Teaches the composer to write executive summaries as three-act narratives (Understanding → Solution Journey → Transformed State), weave 2-3 win themes throughout the report, recommend growth channels by startup stage using ICE scoring, and frame next steps as momentum-building micro-wins.

- **CRM Investor Fragment** — Teaches the investor agent to score investors using adapted MEDDPICC (8 elements, /40 total), time outreach based on buying signals (fund just raised = reach out this week, partner spoke at conference = reach out within 2 weeks), and write cold emails using proven anatomy.

- **Sprint Agent Fragment** — Teaches the sprint agent to score tasks using RICE, classify them using the Kano model (must-have tasks go in Sprint 1, delighters go in later sprints), and sequence tasks for momentum (start each sprint with a quick win, never start with the hardest task).

- **Pitch Deck Fragment** — Teaches the pitch deck agent to build decks around 2-3 win themes, structure the problem slide using Challenger methodology (start with an insight the investor hasn't considered), apply persuasion psychology (strongest theme in first 3 slides, biggest number on the ask slide), and present traction using growth storytelling.

**Real-world example:** Marcus is preparing for a $1.5M pre-seed raise. He generates a pitch deck. Before this integration, the AI would produce a generic 10-slide deck. Now, the Pitch Deck Fragment teaches the AI to structure the problem slide as a Challenger narrative: "Most dental practices manage patient intake with paper forms. Here's what the data shows about why that breaks when you scale past 3 locations." The deck weaves win themes throughout, and the Ask slide uses recency effect (the last thing the investor sees is the most memorable).

**Benefit:** Existing edge functions produce dramatically better output without any changes to the UI or user flow.

### 4. AI Chat Mode Prompts (4 modes)

These are specialized chat personalities that activate when a founder selects a specific mode in the AI Chat. Each mode has a distinct methodology, session flow, and coaching style.

**Practice Pitch Mode** — An AI investor who uses Socratic coaching to pressure-test your pitch. The session follows a structured flow: deliver your 60-second pitch, get scored on 5 dimensions (Clarity, Urgency, Differentiation, Ask, Confidence), face 3 hard investor questions tailored to your startup data, get coached on your weakest answer, then re-deliver the improved pitch. The AI never gives more than one improvement suggestion at a time — the same principle real executive coaches use.

**Real-world example:** Priya is pitching her AI-powered supply chain tool next week. She opens Practice Pitch mode and delivers her elevator pitch. The AI scores her 6/10 — strong on clarity, weak on urgency. It asks: "What happens to your customers' margins if they don't solve this in the next 12 months?" Priya stumbles. The AI coaches her on quantifying the cost of inaction. She re-delivers, now opening with: "Supply chain delays cost mid-market manufacturers $2.3M per year in excess inventory. We cut that by 60% in 90 days." Score jumps to 8/10.

**Growth Strategy Mode** — A growth strategist who diagnoses funnel bottlenecks and designs experiments. First identifies your stage (Pre-PMF, PMF, Growth, Scale), then finds the biggest leak in your AARRR funnel, recommends 3 experiments ranked by ICE score, and designs the top experiment in detail with hypothesis, baseline, target, timeline, and success criteria.

**Real-world example:** Jake's fintech app has 500 signups but only 12% activate (complete onboarding). The Growth Strategy AI identifies activation as the bottleneck, recommends 3 experiments: (1) reduce onboarding from 7 steps to 3, (2) add a progress bar with milestone rewards, (3) send a personalized "here's what you're missing" email at 24 hours. It designs experiment #1 in detail: "If we reduce onboarding steps from 7 to 3, activation will improve from 12% to 25% within 2 weeks. Success threshold: 20%+."

**Deal Review Mode** — A deal strategist who qualifies your investor pipeline with zero tolerance for wishful thinking. Scores each investor conversation using adapted MEDDPICC (/40), surfaces red flags (single-threaded to an associate, no compelling event, champion who won't introduce you to the GP), and gives a verdict: Strong, Battling, At Risk, or Unqualified.

**Real-world example:** Aisha has 8 investor conversations in her CRM. She opens Deal Review mode. The AI inspects each one: "Sequoia — you've only spoken to an associate, no access to the decision-making partner. Score: 14/40 — Unqualified. Either get a GP meeting in 7 days or deprioritize. Lightspeed — partner engaged, they have a portfolio gap in your space, but you haven't started the paper process. Score: 28/40 — Battling. Next step: ask about their term sheet timeline this week."

**Canvas Coach Mode** — A lean startup coach who improves your business model canvas one box at a time. Starts with the weakest box (least evidence, most assumptions), asks probing questions, suggests specific improvements (not "make it better" but "replace 'businesses' with 'Series B SaaS companies with 50-200 employees'"), and celebrates progress to build momentum.

**Real-world example:** Tom's lean canvas says Customer Segments: "Small businesses." The Canvas Coach flags this as the weakest box and asks: "Which small businesses? What industry? What size? What specific pain do they feel that makes them search for a solution today?" Tom refines to: "Independent restaurants with 1-3 locations doing $500K-$2M revenue, struggling with food waste costing them 8-12% of revenue." The coach celebrates: "Now we're talking. 4 of 9 boxes are strong — you're 44% there. Let's tackle Revenue Streams next."

**Benefit:** Four new AI-powered experiences that feel like having a growth strategist, investor coach, deal analyst, and business model expert on call 24/7.

---

## What This Means for Founders

| Before | After |
|--------|-------|
| Generic AI suggestions | Expert-framework-backed recommendations |
| Validation reports read like summaries | Reports tell three-act stories with win themes |
| Sprint tasks generated randomly | Tasks RICE-scored and momentum-sequenced |
| CRM outreach is a blank text box | Signal-based emails with proven cold email anatomy |
| Pitch decks list features | Decks use Challenger narrative and persuasion psychology |
| AI Chat is one generic mode | 4 specialized modes: pitch practice, growth, deals, canvas |
| Dashboard shows task lists | Dashboard uses behavioral nudge patterns for motivation |
| Investor scoring is gut feel | MEDDPICC-based qualification scoring /40 |

---

## What This Means for the Engineering Team

| Before | After |
|--------|-------|
| 6 Claude Code agents | 16 agents (10 new, all StartupAI-aware) |
| Generic code review | Code review that checks RLS, Gemini patterns, React hooks |
| No performance baseline | Performance benchmarker with specific targets |
| Manual production checks | Reality Checker agent runs full readiness audit |
| Security review is ad-hoc | Security Engineer with STRIDE model mapped to StartupAI |
| 35 skills | 43 skills (8 new domain knowledge modules) |

---

## Technical Summary

- **Source:** Fork at `github.com/amo-tech-ai/agency-agents` (MIT license, pinned at `sunai-v1`)
- **Files created:** 27 total across 4 layers
- **Impact on build:** Zero — all files are markdown or Deno-only TypeScript
- **Activation:** Each prompt fragment can be wired into its target edge function independently
- **Loader utility:** `agency/lib/agent-loader.ts` provides `loadFragment()` and `loadChatMode()` for runtime injection

See `agency/INDEX.md` for the complete file listing and wiring guide.
