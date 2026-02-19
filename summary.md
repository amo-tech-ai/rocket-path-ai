# StartupAI Summary

> **Updated:** 2026-02-14 | **Tables:** 89 | **Edge Functions:** 45 | **Pages:** 47 | **Tests:** 284/284

StartupAI is an AI-powered operating system that takes founders from raw idea to fundable startup. You describe your idea in a chat conversation — no forms — and a pipeline of 7 specialized AI agents researches your market, scores your assumptions against Tier A benchmarks (Deloitte, BCG, McKinsey), and delivers a decision-first validation report in under 60 seconds. From there, the system builds your Lean Canvas, creates investor-ready pitch decks, manages your CRM and experiments, and runs structured 90-day validation sprints — all connected through a single context that remembers everything about your startup. Behind the scenes: 21 industry playbooks, 200+ verified statistics in a vector database, and a multi-model AI stack (Gemini 3 for speed, Claude for reasoning) power every answer with cited sources, confidence levels, and concrete next actions. The goal is simple — give every founder the same quality guidance that funded startups get from $500/hour consultants, available 24/7 in seconds.

---

### Recent Changes (Wave 2 — 2026-02-07)

**Completed all 5 Wave 2 tasks — 4 new screens + PDF verification:**

1. **PDF Export Verified (F-108 → 100%)** — Build confirmed with 0 errors. jsPDF code-split chunk (413KB) and validationReportPdf chunk (18.5KB) present in build output.

2. **Experiments Lab (L-100 → 90%)** — Full CRUD page for designing and tracking experiments. Experiments.tsx page with search + status/type filters, ExperimentCard (type badge, status progress bar), CreateExperimentDialog with AI generate button, experiment-agent edge func (Gemini Flash designs experiments from assumptions), useExperiments hook. 5 new files + 2 modified.

3. **90-Day Sprint Plan (L-005 → 85%)** — Sprint management with PDCA phase tracking. SprintPlan.tsx page with campaign selector, SprintCard with PDCA step indicator (Plan/Do/Check/Act), PDCAEditor with 4 collapsible sections and save-per-section, SprintTimeline horizontal bar, useSprints hook. 5 new files + 2 modified.

4. **Market Research Hub (L-101 → 90%)** — AI-generated market research. MarketResearch.tsx page, market-research edge func (Gemini Pro), MarketSizingCards (TAM/SAM/SOM with formatted $values and methodology tooltip), TrendList (impact badges: high=red, medium=amber, low=green), CompetitorGrid (leaders vs emerging players), useMarketResearch hook, market_research DB table + RLS + indexes. 7 new files + 1 migration + 3 modified.

5. **Opportunity Canvas (L-102 → 90%)** — AI-scored opportunity assessment. OpportunityCanvas.tsx page, opportunity-canvas edge func (Gemini Pro, fetches startup + market research + validation context), ScoreCard (radial SVG progress, 0-100, color-coded), RecommendationBadge (pursue/explore/defer/reject verdict card), 5 dimension scores (market readiness, tech feasibility, competitive advantage, execution, timing) with weighted average, barriers (red-tinted), enablers (green-tinted), strategic fit, opportunity_canvas DB table + RLS + indexes. 6 new files + 1 migration + 3 modified.

**Wave 2 totals:** 23 new files, 2 migrations applied, 3 edge functions, 4 new routes, 4 new nav items. Build: 0 errors.

---

### Previous Changes (Wave 1 — 2026-02-07)

**Completed 3 of 5 Wave 1 tasks:**

1. **Report Sections (V-02 → 100%)** — Expanded the validator report from 8 to 15 sections. Added Competition Deep Dive (SWOT grid, feature comparison table, positioning scatter plot), Financial Projections (3 scenarios table, monthly Y1 bar chart, break-even analysis), and top-level highlights/red_flags. Updated composer agent prompt, JSON schema, and TypeScript types.

2. **Chat Intake 3-Panel (L-001 → 95%)** — Enhanced the validation chat page with clickable suggestion chips that prefill the chat input, confidence badges ("Captured"/"Needed") on the context panel, and mobile Sheet triggers for accessing side panels on small screens.

3. **Validator Report Polish (L-003 → 95%)** — Added 3-column summary card (Strengths/Concerns/Next Steps), sticky section nav sidebar with anchor links, collapsible report sections with chevron toggle animation, and widened layout to 1300px.

---

**What is StartupAI?** An AI-powered operating system that helps founders go from raw idea to fundable company. You chat with an AI Coach that gives expert advice backed by real numbers from Deloitte, BCG, and McKinsey—not generic tips. The system builds your Lean Canvas, validates your assumptions, creates investor-ready pitch decks, and manages your CRM. Behind the scenes, 24 specialized AI agents work together, pulling from 21 industry playbooks and 200+ verified statistics. The goal: help you make better decisions faster. In 30 seconds, know if your idea is worth pursuing, what your biggest risk is, and what to do next.

---

## System Strategy

**How it works:** You start by chatting with the **Coach**—ask any startup question and get an expert answer with real numbers and sources. During onboarding, **Prompt Packs** guide you through a step-by-step flow that builds your **Canvas** (your business model). The Canvas feeds into the **Validator**, which tells you if your idea is worth pursuing and what to fix. Behind the scenes, **Chat** routes your questions to specialized **Agents** (24 experts for canvas, pitch, CRM, etc.) who pull industry-specific advice from **Playbooks** and research stats from the **Vector DB**. Every 90 days, the **Lean System** cycles you through validation sprints so you keep improving. It all connects: you talk → AI understands your context → gives you decisions, not just data.

---

## Dashboards & Wizards

When you log in, the **Dashboard** is your home base. It shows you what to focus on today, your startup's health score, and recent activity. Instead of overwhelming you with numbers, the AI tells you "Here's your top priority right now" so you know exactly where to start.

The **Onboarding Wizard** is a 5-step conversation that builds your business model. You answer questions about your idea, and the AI extracts key insights to create your Lean Canvas automatically. It takes about 10 minutes and you walk away with a complete business model.

Your **Lean Canvas** is the heart of everything. It's your 9-block business model that the AI generated from onboarding. You can edit any block, and the AI will help you improve it. Every change here flows through to your validation reports and pitch deck—one source of truth.

The **Pitch Deck** screen lets you create investor-ready slides. The AI pulls content from your Canvas and writes slides for problem, solution, market size, traction, team, and your ask. You can edit, rearrange, and export to PDF.

**CRM** manages your relationships—investors, customers, partners. Track deals through your pipeline, log conversations, and see who to follow up with. The AI can score leads and suggest who's most likely to convert.

**Tasks** shows action items that come from the Coach and Validator. When the AI says "Run a pricing test," it becomes a task here. Everything is prioritized by impact so you work on what matters most.

**Analytics** displays your metrics—MRR, churn, CAC, LTV—with industry benchmarks overlaid. You don't just see "5% churn," you see "5% churn vs 7% industry median (you're ahead)."

**The key idea:** Every screen should give you an insight, not just data. Wizards feel like conversations with a coach, not forms to fill out. And everything connects back to your Canvas—change it once, and it updates everywhere.

---

## What is StartupAI?

StartupAI is your AI-powered co-pilot for building a startup from scratch. Think of it as having a team of expert advisors available 24/7—without the $500/hour consulting fees. Whether you're validating an idea, building your business model, or preparing for investors, StartupAI guides you every step of the way.

The system is built for non-technical founders who want real answers, not generic advice. Every response comes with actual numbers from trusted sources like Deloitte, BCG, and McKinsey. You'll know exactly where the data comes from and how confident we are in it.

Instead of overwhelming you with forms and dashboards, StartupAI works like a conversation. Ask questions, get expert answers, and take action. The AI remembers your context—your canvas, your metrics, your industry—so you never have to repeat yourself.

Our goal is simple: help you make better decisions faster. In 30 seconds, you should know if your idea is worth pursuing, what your biggest risk is, and what to do next.

## How We Become the Leading Expert

StartupAI isn't just another chatbot—we're building the most knowledgeable startup advisor in the world. Here's how we do it.

First, we only use **Tier A research sources**. Every stat in our system comes from Deloitte, BCG, McKinsey, PwC, Gartner, and CB Insights—the same sources that $500/hour consultants use. When the Coach tells you "AI SaaS received $226B in funding," that number comes from BCG's 2026 AI Radar report, not a random blog post.

Second, we built **21 industry playbooks** with deep expertise in each vertical. Healthcare, FinTech, SaaS, Legal, Retail, Manufacturing—each playbook contains benchmarks, risks, GTM patterns, and investor expectations specific to that industry. When you say you're building a HealthTech startup, the AI knows that 85% of healthcare leaders are adopting GenAI, typical ROI is 200-400% over 3-5 years, and your biggest risk is AI governance compliance.

Third, we use a **Vector Database** to store and search 200+ validated statistics. When you ask a question, the AI doesn't guess—it searches our knowledge base, finds relevant research, and cites the source. This is called RAG (Retrieval-Augmented Generation), and it means answers are grounded in real data, not hallucinated.

Fourth, every answer includes a **confidence level**. High confidence means multiple Tier A sources agree. Medium means we found supporting data but it's limited. Low means we're extrapolating. You always know how much to trust the answer.

The result: StartupAI gives you the same quality advice that funded startups get from expensive consultants and advisors—but available 24/7, in seconds, for a fraction of the cost. We're not trying to replace human mentors; we're making expert-level guidance accessible to every founder.

---

## What's Built

| System | Status |
|--------|:------:|
| Database (82 tables + RLS) | DONE |
| Edge Functions (27 agents) | DONE |
| Onboarding Wizard | DONE |
| Lean Canvas + AI | DONE |
| Pitch Deck + AI | DONE |
| CRM (contacts, deals) | DONE |
| Research (200+ Tier A stats) | DONE |
| Playbooks (21 industries) | DONE |
| Experiments Lab + AI | DONE |
| 90-Day Sprint Plan (PDCA) | DONE |
| Market Research (TAM/SAM/SOM) | DONE |
| Opportunity Canvas (5-dim AI scoring) | DONE |
| PDF Export (code-split) | DONE |

---

## How It Thinks: Plan-Then-Execute

Every part of StartupAI—Coach, Validator, Onboarding, Lean Canvas, Pitch Deck, Chat—follows the same philosophy: **understand deeply first, then recommend confidently**.

When you arrive with a vague idea like "I want to help small businesses with AI," the system doesn't immediately start building slides or filling out forms. Instead, it explores: What kind of small businesses? What problem specifically? Who's the buyer? It researches your industry, pulls benchmarks, and builds a complete picture of your startup context. Only then does it transform your vague requirements into a detailed plan—your Canvas blocks, your validation tasks, your pitch narrative.

This mirrors how the best advisors work. A great mentor doesn't give generic advice; they ask smart questions, understand your unique situation, then give recommendations tailored to you. StartupAI does this at scale by combining multiple AI models: fast models for extraction and search, reasoning models for strategy and analysis. Each agent knows your full context—your canvas, your metrics, your industry—so advice builds on itself instead of starting from scratch every time.

The result is a system that manages your entire journey: Onboarding captures your idea → Coach clarifies and advises → Canvas structures your model → Validator tests your assumptions → Lean System runs 90-day sprints → Pitch Deck tells your story to investors. Each step flows into the next, with the AI remembering everything and guiding you to the next most important action.

### The 90-Day Cycle

Every 90 days, you run a structured validation sprint with a clear goal and constraint. The cycle has 7 phases: **BMD** (Business Model Design) → **90DC** (Cycle Planning) → **S1–S5** (Five 2-week sprints) → **Review** (Pivot or Persevere). Each cycle focuses on one goal like "First 10 paying customers" and one constraint like "Validate willingness to pay." The AI suggests **Campaigns**—proven playbooks like the "Mafia Offer Campaign"—and tracks your progress through each sprint. At the end of 90 days, you review what you learned and decide: pivot to a new approach, or persevere with what's working. This keeps you accountable, focused, and always moving forward.

---

## Core Systems

### Coach
AI startup mentor. Expert, friendly, intelligent, logical. Every answer includes:
- **Number** — "$226B in AI funding"
- **Source** — "BCG 2026"
- **Confidence** — High/Medium/Low

The Coach doesn't just answer questions—it guides you through a logical thinking process. When you come with a vague idea like "I want to build something for restaurants," the Coach asks clarifying questions one at a time: "What specific problem do restaurants face that frustrates you?" Then based on your answer, it asks the next logical question: "Who in the restaurant would use this—the owner, manager, or staff?" Each question builds on the last, narrowing down until you have a clear problem, customer, and solution. It's like having a senior advisor who knows exactly what to ask next to move you forward. The Coach never overwhelms you with ten questions at once—it picks the single most important thing to clarify, waits for your answer, and then guides you to the next step. This structured approach helps founders go from "I have an idea" to "I have a validated business model" without getting stuck or going in circles.

When you're ready to raise money, the Coach becomes your fundraising strategist. Funding-related issues are the #1 reason startups fail (CB Insights), so the Coach helps you navigate this critical phase. It knows the five main funding types—grants, bootstrapping, debt, convertible loans, and equity—and helps you choose the right one for your stage. When you ask "Should I raise from angels or VCs?", the Coach explains that angels invest €10K–€1M with a 1–3 month process and take 10–20% equity, while VCs invest €500K–€50M+ over 4–9 months and take 15–30%. It knows what VCs evaluate: team, product, market size, traction, value proposition, defensibility, and business model. The Coach advises you to maintain 12–18 months of runway, do your homework on each VC's investment mandate before reaching out, and remember that VCs target around 30% returns—so they need to believe your startup can be a big winner. This isn't generic advice; it's the same strategic thinking that $500/hour consultants provide, sourced from PwC's Fundraising for Startups guide.

### Canvas
Lean Canvas (9 blocks). AI generates from onboarding. Versioned for pivot tracking. Feeds into Validator and Pitch Deck.

Your Canvas isn't just a static document—it's the central brain that connects everything. When you update your problem statement, the AI automatically considers how that affects your solution, your customer segments, and your pitch. When the Validator finds a weak assumption, it suggests specific edits to your Canvas. When you're ready to fundraise, the Pitch Deck pulls directly from your Canvas blocks. Every version is saved, so when you pivot, you can see exactly what changed and why. It's your single source of truth that evolves as your startup evolves.

### Validator
Decision-first validation reports:
1. **Verdict** — "Worth pursuing" or "High risk" (shows first)
2. **Benchmarks** — "Your $20K vs $15K median"
3. **Actions** — "Run pricing test with 200 users"

The Validator follows the same "understand first, then recommend" approach as the Coach. Before giving you a score, it researches your industry, pulls relevant benchmarks from Tier A sources, and compares your assumptions against real market data. It doesn't just say "your idea is risky"—it tells you exactly why, shows you the numbers, and gives you a clear action plan to reduce that risk. Think of it as getting a detailed audit from a consulting firm, but in 30 seconds instead of 3 weeks.

**New Chat-to-Validator Flow:** You don't fill out forms—you just describe your idea in chat. The AI Coach asks 1-2 clarifying questions, then triggers a 4-phase animation (Analyzing → Researching → Scoring → Complete). You land on `/startup-validator-v3` with everything pre-filled: overall score, verdict badge, 7-dimension breakdown, TAM/SAM/SOM, competitors, risks, and next actions. From there you can edit sections, generate a pitch deck, export PDF, or share a link with co-founders.

### Agents
24 edge functions: lean-canvas, pitch-deck, investor, crm, task, etc. Uses Gemini 3 (fast) + Claude (reasoning).

Behind every conversation is a team of specialized AI agents working together. When you ask "How should I price my SaaS?", the system routes your question to the right experts: the pricing agent pulls industry benchmarks, the Canvas agent checks your cost structure, and the Coach synthesizes it into clear advice. Fast models handle extraction and search; reasoning models handle strategy and nuance. You don't need to know which agent is working—you just ask your question and get an expert answer. It's like having 24 consultants on call, each with deep expertise in their domain, collaborating to give you the best possible guidance.

### Playbooks
21 industry guides with benchmarks, risks, and GTM patterns.

### Vector DB
RAG knowledge base. 200+ Tier A stats as embeddings. Coach searches and cites relevant research.

---

## Going Forward

### Wave 3 — Intelligence Layer (Next 2 Weeks)

| # | Task | Source | What |
|---|------|--------|------|
| 11 | Knowledge Integration + RAG | V-04 + F-105/200 | Foundation for smart features |
| 12 | Lean Canvas from Validation | V-10 | Auto-populate canvas from report |
| 13 | Agent Intelligence | V-05 | Smarter extraction, adaptive questions |
| 14 | Business Readiness Check | L-103 | Traffic light verdict, high value |
| 15 | Outcomes Dashboard | L-104 | ROI tracking, false progress detection |

### Wave 4 — Polish & Advanced (3 weeks)
UX enhancements (streaming, chips, accessibility), Idea Wall, Story Map, Knowledge Map, Capability Strategy.

### Wave 5 — Production & Niche (2 weeks)
Decision Guardrails, Plan Mode, reliability/security hardening, monitoring, performance optimization, Agent POC Canvas, Trend Intelligence.

---

## Our Advantage

| vs Competitors | StartupAI |
|----------------|-----------|
| Generic AI | **Tier A sources** (Deloitte, BCG, McKinsey) |
| No citations | **Every stat has a source** |
| No confidence | **High/Medium/Low confidence** |
| Generic benchmarks | **Industry-specific** (21 playbooks) |

---

## Success Metric

> Founders copy StartupAI answers directly into their pitch decks.

---

## Key Files

| File | Purpose |
|------|---------|
| `tasks/changelog` | Full change history |
| `tasks/prompts/106-1-prompt-validatorL.md` | Validator chat flow design spec (NEW) |
| `tasks/docs/data/03-supabase-audit.md` | Security audit + ERD |
| `tasks/plan/31-validator-plan.md` | Validator implementation |
| `tasks/plan/32-validator-ideaproof-comparison.md` | Gap analysis |
