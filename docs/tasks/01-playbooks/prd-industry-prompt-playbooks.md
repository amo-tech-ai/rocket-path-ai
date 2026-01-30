# PRD: Industry & Prompt Packs

**Product:** Industry intelligence + prompt packs (unified core)  
**Version:** 1.0  
**Date:** 2026-01-30  
**Status:** Audit Complete & Seeded

---

## Executive summary

**Industry & Prompt Packs** is the core that makes StartupAI **industry-aware** and **prompt-driven**. When a founder picks an industry (e.g. FinTech, Healthcare), every flow—onboarding, validator, lean canvas, pitch deck—uses the right questions, terminology, and AI prompts for that vertical. **Prompt packs** are reusable, step-by-step AI playbooks (validation, pitch, GTM, pricing, etc.) that are **automated**, **agentic**, and **best-practices-driven**, with **industry-conditional logic** so the right pack and content run for the selected industry (and stage).

**In one sentence:** User selects Industry → Platform adapts everywhere via industry-conditional logic; the agent picks and runs the right prompt pack automatically; outputs apply without copy-paste.

### Key points (at a glance)

| Area | Key point |
|------|-----------|
| **Industry** | One selection (e.g. FinTech, Healthcare) drives questions, terminology, and benchmarks everywhere (onboarding, pitch, canvas, validator). |
| **Prompt packs** | Automated + agentic: agent picks pack from context (module + industry + stage); runs steps; applies. No “choose pack” in main flow. |
| **Design** | Best-practices prompts; industry-conditional logic; structured JSON apply to profile, canvas, slides, tasks. |
| **Content** | 8+ questions per industry seeded (19 industries total); 48 universal questions seeded; shared schema (question text, slide_mapping, stage_filter, contexts). |
| **Routing** | Context (route + intent + industry + stage) → which pack/step runs. Onboarding Step 1 → ideation; Validator → validation; etc. |
| **Implementation** | Foundation → Industry context → Prompt library content → Prompt pack implementation → Integration. |

| What | Why it matters |
|------|----------------|
| **Industry layer** | Strategy, question packs, playbooks, benchmarks, and logic per vertical (13 industries). Single source of truth for onboarding + pitch deck + canvas. |
| **Prompt packs** | Automated, agentic AI “recipes” (DB + edge + frontend). Agent picks pack from context; runs steps; applies outputs. Best-practices prompts; industry-conditional logic. |
| **Together** | Industry defines *what* to ask and *how* to talk; prompt packs define *how* to run AI and *where* results go. One core, not two products. |

---

## Summary table

| Section | Summary |
|---------|---------|
| **Scope** | Industry strategy, question packs, playbooks, benchmarks; prompt pack schema, steps, search, run, apply; edge functions; industry selection UI; agent routing; **and Core Screens (Audited prompts for Onboarding, Validator, Canvas, Pitch, Chat, CRM, Tasks, Dashboard).** |
| **Out of scope (this PRD)** | Full GTM module implementation details, i18n, third-party API keys (beyond LLMs). |
| **Users** | Founders (primary), internal/admin (seed and pack management). |
| **Success metrics** | Industry selection used in onboarding; 8+ questions per industry seeded; prompt pack search/run used by onboarding + validator + canvas + pitch; structured apply to profile/canvas/slides. |
| **Dependencies** | Supabase (schema, RLS); edge functions (industry-expert-agent, prompt-pack, onboarding-agent, lean-canvas-agent, pitch-deck-agent); frontend routes and profile (industry, stage). |
| **Implementation order** | 1) Foundation 🟢 | 2) Industry context 🟢 | 3) Prompt library content 🟢 | 4) Prompt pack implementation 🟢 |

---

## Problem & opportunity

**Problem**
- Generic startup tools feel like one-size-fits-all; investors spot “generic AI” decks.
- Founders repeat the same prompts and copy-paste results into profile, canvas, and slides.
- No single place that defines “what to ask” and “how to run AI” per industry and per flow.

**Opportunity**
- **Industry layer:** One place for industry strategy, questions, playbooks, and benchmarks. Onboarding and pitch deck (and later canvas/validator) read from it.
- **Prompt packs:** One system for “run this AI playbook, get structured JSON, apply it here.” Agent chooses pack from context (module + industry + stage).
- **Result:** Industry-aware, consistent, high-quality AI across the product, with less duplication and less manual work.

---

## Purpose

**Why we're building this:** So every founder gets the *right* questions and *right* AI outputs for their industry, in the right place—without copy-paste or generic templates. Industry drives *what* we ask; prompt packs drive *how* we run AI and *where* results go.

---

## Goals & success metrics

| Goal | Metric |
|------|--------|
| Industry is the core for “what to ask” | Industry selection in onboarding; 13 industries with question packs and playbooks (or agreed subset for MVP). |
| Prompt packs power AI flows | Prompt pack search + run used by onboarding, validator, lean canvas, pitch deck; apply to profile, canvas, slides, tasks. |
| Quality and consistency | 8+ questions per industry; 40+ universal questions; structured outputs (JSON) applied automatically. |
| Developer clarity | Single schema and routing doc; clear implementation order (industry → prompt library content → prompt pack tasks). |

---

## User personas

| Persona | Need |
|---------|------|
| **Founder** | Pick industry once; get relevant questions, terminology, and benchmarks everywhere. Run validation/pitch/canvas without picking “which pack”—system chooses. |
| **Admin / ops** | Seed and update industry packs and prompt packs; verify questions and playbooks. |

---

## User stories & real-world examples

Short, easy-to-understand examples of how the system behaves for real users.

| Story | Who | What happens |
|-------|-----|--------------|
| **Onboarding that fits my industry** | Maria (FinTech founder) | She picks "FinTech — Payments" once. The wizard asks about compliance, CAC/LTV, and payment metrics—not generic startup questions. Her answers save to her profile and later pre-fill pitch deck and canvas. |
| **Validator that speaks my language** | James (Healthcare founder) | He runs the idea validator. The system uses the Healthcare pack automatically. He gets feedback in healthcare terms (clinical evidence, reimbursement, FDA path); results land in his validation report. |
| **One answer, many places** | Any founder | After onboarding, the "ICP and pain point" summary appears in profile and pre-fills the Lean Canvas customer box. The same data powers the pitch deck problem slide. One run, no copy-paste. |
| **Pitch deck that gets my vertical** | Maria / James | FinTech deck emphasizes unit economics and compliance; Healthcare deck emphasizes clinical evidence. Same pitch flow, different playbook and wording per industry. |
| **Adding a new industry** | Admin / ops | Ops adds "Climate Tech," seeds 8 questions and a playbook. Founders who select Climate Tech immediately see those questions and benchmarks—no frontend deploy for content. |
| **No "which pack?" in the main flow** | Founder | Founder never has to choose "validation pack" or "pitch pack." System picks from context (e.g. "onboarding step 2" → ICP/pain pack; "validator" → validation pack by industry). |

---

## Product overview: one core, two layers

Industry and prompt packs are **one core** with two layers:

1.  **Industry layer** — *What* to ask and *how* to sound (strategy, questions, playbooks, benchmarks, **industry-conditional logic**).
2.  **Prompt pack layer** — *How* to run AI and *where* results go (packs, steps, search, run, apply); **automated**, **agentic**, **best-practices-driven**.

Flow: **User selects industry** → **Context (module + industry + stage)** → **Agent selects prompt pack** (industry-conditional) → **Knowledge injection** → **Run step/pack** → **Structured output** → **Apply to profile/canvas/slides/tasks**.

### Prompt pack design principles

| Principle | Meaning |
|-----------|--------|
| **Automated** | No "choose a pack" in the main flow. System selects and runs the right pack from context (module + industry + stage). |
| **Agentic** | The AI agent chooses which pack/step to run, executes it, and applies structured outputs to profile, canvas, slides, tasks. |
| **Best practices** | Pack prompts and step logic follow documented best practices (e.g. verification doc, industry playbooks, investor psychology, red flags). |
| **Industry-conditional logic** | Content, questions, and behavior depend on `selected_industry` (and optionally stage). FinTech ≠ Healthcare ≠ Climate Tech in questions, terminology, and benchmarks. |
| **AI Agent Expertise** | Make the AI a true startup expert per industry with knowledge injection, benchmarks, and contextual advice that goes beyond generic prompts. Agents speak the industry's language and understand investor expectations. |
| **Static Knowledge Injection** | Enrich each industry playbook with embedded expertise: success stories, failure patterns, investor expectations, benchmark data, red flags, and terminology. This knowledge gets injected into every prompt at runtime based on `selected_industry`. |

### AI Agent Expertise (Deep Dive)

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

### Static Knowledge Injection (Architecture)

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

**Example Enriched Prompt (FinTech):**

```
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

### Context-Filtered Injection

**Purpose:** Each feature gets a tailored slice of the playbook — not the full knowledge dump, but the specific expertise relevant to that context.

| Feature | Knowledge Slice | Why This Slice |
|---------|-----------------|----------------|
| **Onboarding** | Failure patterns + Terminology | Guide early decisions with warnings and industry language |
| **Lean Canvas** | GTM patterns + Benchmark data | Validate business model with proven strategies and metrics |
| **Pitch Deck** | Investor expectations + Success stories + Red flags | Make deck investor-ready with what VCs want to see |
| **Validator** | Benchmark data + Red flags + Failure patterns | Score idea against industry standards and common pitfalls |
| **Tasks/Planning** | GTM patterns + Failure patterns | Build actionable roadmap avoiding known mistakes |
| **Chatbot** | All six knowledge types | Full expert mode for open-ended Q&A |

**Knowledge Types:**

| # | Type | Description |
|---|------|-------------|
| 1 | **Failure Patterns** | Common mistakes that kill startups in this industry |
| 2 | **Terminology** | Industry-specific language, jargon, and definitions |
| 3 | **GTM Patterns** | Go-to-market strategies that work in this vertical |
| 4 | **Benchmark Data** | KPIs with good/great thresholds |
| 5 | **Investor Expectations** | What VCs look for at each stage |
| 6 | **Success Stories** | What winning startups in this space did right |
| 7 | **Red Flags** | What kills investor interest |

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
│        ✓ investor_expectations                                   │
│        ✓ success_stories                                         │
│        ✓ red_flags                                               │
│        ✗ failure_patterns (not needed for pitch)                 │
│        ✗ gtm_patterns (not needed for pitch)                     │
│        ✗ terminology (minimal, for jargon only)                  │
│                                                                  │
│   3. ENRICHED PROMPT                                             │
│      System prompt includes only the filtered slice              │
│                                                                  │
│   4. OPTIMIZED OUTPUT                                            │
│      Smaller context = faster, cheaper, more focused             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Edge Function Signature:**

```typescript
// Get filtered knowledge based on context
function getFilteredKnowledge(
  industry_id: string,
  stage: "pre-seed" | "seed" | "series-a",
  feature: "onboarding" | "canvas" | "pitch" | "validator" | "tasks" | "chatbot"
): FilteredKnowledge;

// Filter mapping
const FEATURE_KNOWLEDGE_MAP = {
  onboarding: ["failure_patterns", "terminology"],
  canvas: ["gtm_patterns", "benchmark_data"],
  pitch: ["investor_expectations", "success_stories", "red_flags"],
  validator: ["benchmark_data", "red_flags", "failure_patterns"],
  tasks: ["gtm_patterns", "failure_patterns"],
  chatbot: ["all"] // Full expert mode
};
```

---

## Requirements

### Summary of requirements (table)

| ID | Area | Requirement | Priority |
|----|------|--------------|----------|
| I1 | Industry | Industry selection in onboarding (and available to pitch/canvas/validator). | P0 |
| I2 | Industry | 13 industry packs with question packs (8 questions each) and playbooks (narrative, benchmarks, terminology). | P0 |
| I3 | Industry | Shared question pack schema: question text, input_type, slide_mapping, investor_weight, stage_filter, contexts (onboarding, pitch_deck). | P0 |
| I4 | Industry | Industry logic: conditional content and questions by `selected_industry` across flows. | P0 |
| I5 | Industry | Industry-expert-agent (or equivalent) returns context, questions, and validates answers. | P0 |
| **K1** | **Knowledge** | **Static Knowledge Injection**: Each industry has embedded expertise (success stories, failure patterns, investor expectations, benchmark data, red flags, terminology) injected into prompts at runtime. | **P0** |
| **K2** | **Knowledge** | **AI Agent Expertise**: Agents speak the industry's language, understand investor psychology, and provide contextual advice beyond generic prompts. | **P0** |
| **K3** | **Knowledge** | **Industry Benchmarks**: Embedded KPIs with good/great thresholds per industry (e.g., CAC payback, net retention, fraud reduction). | **P1** |
| **K4** | **Knowledge** | **Knowledge Lookup**: Edge function to retrieve and inject industry knowledge into prompts based on `selected_industry`. | **P0** |
| **K5** | **Knowledge** | **Context-Filtered Injection**: Each feature (onboarding, canvas, pitch, validator, tasks, chatbot) gets a tailored slice of knowledge — not the full dump. Onboarding: failure patterns + terminology; Canvas: GTM + benchmarks; Pitch: investor expectations + success stories + red flags; Chatbot: all. | **P0** |
| P1 | Prompt packs | DB: prompt_packs, prompt_pack_steps, run history; RLS; indexes. | P0 |
| P2 | Prompt packs | Categories: validation, ideation, pitch, canvas, market, gtm, pricing. | P0 |
| P3 | Prompt packs | Edge: prompt_pack_search(module, industry, stage), run_step, run_pack, apply. | P0 |
| P4 | Prompt packs | Seed: at least one pack per category; industry/stage tags. | P0 |
| P5 | Prompt packs | **Agentic** routing (industry-conditional): onboarding, validator, canvas, pitch, GTM use routing table (context → pack). | P0 |
| P6 | Prompt packs | **Automated** apply (best-practices prompts): to profile, canvas, slides, tasks (no "choose pack" required in main flow). | P0 |

---

### Industry layer (detail)

- **Industry strategy and content** (source: industry strategy docs; prompt library: `tasks/00-plan/prompts/prompt-library/`)
  - Single source of truth for question packs and playbooks per industry.
  - **Question pack:** 8 questions per industry. Fields: question text, why_investors_care / why_this_matters, input_type (text, textarea, select, multi_select, metrics, bullets), slide_mapping (problem, solution, market, product, traction, business_model, competition, team, financials, ask), investor_weight (high/medium/low), stage_filter (pre_seed, seed, series_a), contexts (onboarding, pitch_deck). Optional: conditional follow-ups, examples, ai_suggestions.
  - **Question → slide mapping:** Target customer → Market/Problem; Problem/pain → Problem; Solution/product → Solution, Product; Proof/metrics → Traction; Monetization/GTM → Business Model; Defensibility → Competition.
  - **Stage-aware filtering:** Pre-Seed (qualitative, founder-market fit); Seed (full 8 questions); Series A (unit economics, CAC/LTV, cohort).
  - **Playbook (per industry):** narrative_arc, slide_emphasis, investor_psychology, red_flags, power_phrases / weak_phrases, benchmark_metrics, terminology, prompt_context (injected into generation).
  - **13 industries:** AI SaaS, FinTech, Healthcare, Retail & eCommerce, Cybersecurity, Logistics & Supply Chain, Education, Legal / Professional Services, Financial Services, Sales & Marketing, CRM & Social Media AI, Events Management, eCommerce, PropTech, MarTech, CleanTech, EdTech, MedTech, InsurTech (19 industries total).
  - **8 question categories (universal):** problem_validation, customer_discovery, solution_design, mvp_planning, go_to_market, business_model, competitive_strategy, execution_planning. Outputs map to: lean_canvas, pitch_deck, startup_profile, task_list, gtm_strategy, risk_register.
- **Industry logic**
  - Conditional content and questions by `selected_industry` (and optionally stage) in onboarding, pitch deck, canvas. Step 1 stores industry + sub_category; Step 2/3/4 use industry for metrics, questions, and tone.
- **Verification**
  - Best-practices verification and industry progress tracking.

### Prompt pack layer (detail)

- **Schema** (implementation tasks; prompt library: `tasks/00-plan/prompts/prompt-library/`)
  - Tables: prompt_packs (title, slug, category, industry_tags, stage_tags, etc.), prompt_pack_steps (pack_id, order, prompt, output_schema), run history.
  - RLS, indexes, helpers (e.g. get_industry_questions, get_industry_ai_context where applicable).
- **Edge functions**
  - prompt_pack_search({ module, industry, stage }) → best pack + next step.
  - run_step / run_pack with context → structured JSON.
  - apply(outputs_json, apply_to) → profile, canvas, slides, tasks, validation.
- **Routing** (see `prompts/prompt-library/101-prompt-strategy.md`)
  - **Agent-driven selection:** Context (module + industry + stage) → which pack/step runs. No user “choose pack” in main flow. Triggers: route (e.g. /onboarding/1 → ideation), intent (e.g. “validate my idea” → validation), startup profile (industry + stage).
  - **Context → module:** Onboarding Step 1 → ideation; Step 2 → market; Step 3 → founder-fit; Step 4 → pitch; Validator → validation; Lean Canvas → canvas; Pitch Deck → pitch; AI Chat → intent-based.
- **Content** (see `prompts/prompt-library/01-prompt-library-index.md`)
  - Domains: ideation (02), market (03), marketing (04), product (05), funding (06), revenue (07), founder-fit (08), pitch (09), pitch-deck (09.1). Each domain has multiple prompts with “when to use” and agent context. Seed into packs/steps.
  - **Prompts vs playbooks:** Single-step prompts produce one structured output; playbooks are multi-step journeys with progress. Packs group prompts by category with input/output schema for automation.
- **Frontend**
  - No mandatory “pick a pack” UI; optional catalog for power users. Apply results into existing screens (profile, canvas, slides, tasks).

---

## Dependencies & implementation order

| Order | Item | Owner |
|-------|------|--------|
| 1 | Foundation: schema audit (Supabase, edge functions). | Backend |
| 2 | Industry context: strategy, logic, verification (industry docs + prompts-library index). | Product / eng |
| 3 | Prompt library content: prompts-library by domain (ideation → pitch-deck). | Content / eng |
| 4 | Prompt pack implementation: DB migration → edge (search, run, apply) → seed → frontend apply. | Backend → Frontend |

Detailed steps: see `tasks/00-plan/1-index-tasks.md` (Industry + prompt packs as one stream).

---

## In Scope (Integrated via Lovable Prompts)

- Onboarding Wizard (Step-by-step 4-part flow)
- Validation Dashboard (Quick/Deep/Investor modes)
- Lean Canvas Builder (Interactive 9-box editor)
- Pitch Deck Generator (Industry-specific templates)
- AI Chat Assistant (Context-aware bot)
- CRM & Investor Outreach (Enrichment and matching)
- Task Management (AI-prioritized roadmap)
- Main Dashboard (KPIs and health scoring)

## Out of scope

- Full GTM module and docs (separate initiative).
- i18n / translate (separate initiative).
- Third-party API keys management.

---

## Playbook System Integration

> **Reference:** [101-startup-playbooks.md](prompts/101-startup-playbooks.md)

The playbook system extends industry + prompt packs into a comprehensive operating system for AI-powered startup development. Playbooks combine **wizards**, **AI agents**, **automations**, and **dashboards** to guide founders from idea to investor-ready.

### Playbook Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    STARTUPAI PLAYBOOK SYSTEM                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   FOUNDER SELECTS INDUSTRY → ROUTER (Context) → PLAYBOOKS       │
│                                                                  │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│   │    CORE     │    │  ADVANCED   │    │  INDUSTRY   │         │
│   │  PLAYBOOKS  │    │  PLAYBOOKS  │    │  PLAYBOOKS  │         │
│   │             │    │             │    │             │         │
│   │ • Onboarding│    │ • Fundraise │    │ • FinTech   │         │
│   │ • Validator │    │ • GTM       │    │ • Healthcare│         │
│   │ • Canvas    │    │ • Roadmap   │    │ • SaaS      │         │
│   │ • Pitch     │    │ • Scale     │    │ • +10 more  │         │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘         │
│          │                  │                  │                 │
│          └──────────────────┼──────────────────┘                 │
│                             │                                    │
│                      ┌──────▼──────┐                             │
│                      │   PROMPT    │                             │
│                      │    PACKS    │                             │
│                      │  (28 steps) │                             │
│                      └──────┬──────┘                             │
│                             │                                    │
│          ┌──────────────────┼──────────────────┐                 │
│          │                  │                  │                 │
│          ▼                  ▼                  ▼                 │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│   │   WIZARDS   │    │ AI AGENTS   │    │ AUTOMATIONS │         │
│   │   (4-step)  │    │ (10 agents) │    │ (7 triggers)│         │
│   └─────────────┘    └─────────────┘    └─────────────┘         │
│                             │                                    │
│                      ┌──────▼──────┐                             │
│                      │   OUTPUTS   │                             │
│                      │ Profile /   │                             │
│                      │ Canvas /    │                             │
│                      │ Deck / Tasks│                             │
│                      └─────────────┘                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Core Playbooks

| Playbook | Purpose | Steps | Agents | Outputs |
|----------|---------|-------|--------|---------|
| **Onboarding** | Transform idea into structured profile | 4 | Industry Expert, Problem Sharpener, Founder Analyst, Pitch Writer | Profile, one-liner |
| **Validation** | Score and validate startup idea | 3 | Validator Agent | Score, risks, tasks |
| **Lean Canvas** | Build complete business canvas | 9 boxes | Canvas Builder | Complete canvas |
| **Pitch Deck** | Generate investor-ready deck | 5 | Deck Writer, Critic | Full deck, critique |

### Advanced Playbooks

| Playbook | Purpose | Phases | Key Outputs |
|----------|---------|--------|-------------|
| **Go-to-Market** | Define and execute market entry | 5 | ICP, positioning, channels, launch plan |
| **Fundraising** | Prepare, execute, close funding | 6 | Materials, investor list, pipeline, terms |
| **Roadmap** | 12-month development plan | 4 quarters | Milestones, resources, risks |
| **Operations** | Scale processes and team | 4 | Hiring, culture, tools, workflows |

### AI Agent Inventory

| Agent | Type | Playbook(s) | Autonomy | Model |
|-------|------|-------------|----------|-------|
| **Industry Expert** | Research | All | Suggest | Gemini 3 Flash |
| **Problem Sharpener** | Planner | Onboarding, Validation | Act w/ Approval | Claude Sonnet |
| **Validator Agent** | Research | Validation | Suggest | Gemini 3 Pro |
| **Canvas Builder** | Planner | Lean Canvas | Act w/ Approval | Gemini 3 Pro |
| **Deck Writer** | Operator | Pitch Deck | Act w/ Approval | Claude Sonnet |
| **Critic Agent** | Research | Pitch Deck | Suggest | Claude Sonnet |
| **Investor Research** | Research | Fundraising | Suggest | Gemini 3 Pro |
| **Outreach Agent** | Operator | Fundraising | Act w/ Approval | Gemini 3 Flash |
| **Task Generator** | Operator | All | Autonomous | Gemini 3 Flash |
| **Chat Router** | Orchestrator | All | Suggest | Gemini 3 Flash |

### Agent Routing Table

| Context | Module | Agent | Pack(s) |
|---------|--------|-------|---------|
| Onboarding Step 1 | ideation | Industry Expert | problem-validation |
| Onboarding Step 2 | market | Problem Sharpener | problem-validation |
| Onboarding Step 3 | founder-fit | Founder Analyst | founder-fit |
| Onboarding Step 4 | pitch | Pitch Writer | one-liner-generator |
| Validator Quick | validation | Validator Agent | idea-validation |
| Validator Deep | validation | Validator Agent | idea-validation, competitor-analysis |
| Canvas Generate | canvas | Canvas Builder | lean-canvas-generator |
| Pitch Generate | pitch | Deck Writer | industry_pitch_pack |
| Pitch Review | pitch | Critic Agent | pitch-review |

### Wizards & Screens

| Wizard | Steps | Duration | Screen | Key Features |
|--------|-------|----------|--------|--------------|
| **Onboarding** | 4 | 5-10 min | `/onboarding` | Industry picker, problem wizard |
| **Validation** | 3 | 3-15 min | `/validator` | Quick/deep/investor modes |
| **Canvas Builder** | 9 | 15-20 min | `/canvas` | Box-by-box with AI |
| **Pitch Generator** | 5 | 10-15 min | `/pitch` | Industry-specific templates |
| **GTM Planner** | 5 | 20-30 min | `/gtm` | ICP, channels, launch |
| **Fundraising Prep** | 6 | 30-45 min | `/fundraise` | Docs, investors, pipeline |

### Automations & Triggers

| Trigger | Condition | Action | Playbook |
|---------|-----------|--------|----------|
| **Onboarding Complete** | Step 4 saved | Generate 5 validation tasks | Onboarding |
| **Validation Score < 60** | Quick validate done | Suggest pivot or refine | Validation |
| **Canvas Incomplete** | 3+ boxes empty after 7 days | Reminder + AI suggestions | Lean Canvas |
| **Pitch Deck Generated** | Deck created | Run critic agent | Pitch Deck |
| **Investor Added** | New investor in CRM | Research + personalize | Fundraising |
| **Task Overdue** | Due date passed | Alert + reschedule suggest | All |
| **Competitive Alert** | New competitor detected | Update positioning | GTM |

### Dashboard Widgets

| Widget | Data Source | Update | Agent |
|--------|-------------|--------|-------|
| Validation Score | validation_reports | On run | Validator |
| Canvas Completeness | lean_canvases | Real-time | Canvas Builder |
| Pitch Readiness | pitch_decks | On update | Critic |
| Task Progress | tasks | Real-time | Task Generator |
| Competitive Intel | External APIs | Weekly | Competitor Agent |
| Investor Pipeline | investor_interactions | Real-time | CRM Agent |

### Playbook Database Schema

```sql
-- Playbook run tracking
CREATE TABLE playbook_runs (
  id UUID PRIMARY KEY,
  startup_id UUID REFERENCES startups(id),
  playbook_type TEXT NOT NULL, -- onboarding, validation, canvas, pitch, gtm, fundraise
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  current_step INTEGER DEFAULT 1,
  total_steps INTEGER,
  status TEXT DEFAULT 'in_progress',
  metadata JSONB
);

-- Validation reports
CREATE TABLE validation_reports (
  id UUID PRIMARY KEY,
  startup_id UUID REFERENCES startups(id),
  validation_type TEXT, -- quick, deep, investor_lens
  score INTEGER,
  scores_breakdown JSONB,
  risks TEXT[],
  opportunities TEXT[],
  tasks_generated UUID[]
);

-- Lean canvases
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
  completeness_score INTEGER
);

### Industry layer (actual schema)

-- industry_playbooks (Expert-verified knowledge)
CREATE TABLE industry_playbooks (
  industry_id TEXT PRIMARY KEY,
  display_name TEXT,
  narrative_arc TEXT,
  prompt_context TEXT,
  investor_expectations JSONB,
  failure_patterns JSONB,
  success_stories JSONB,
  benchmarks JSONB,
  terminology JSONB,
  gtm_patterns JSONB,
  decision_frameworks JSONB,
  investor_questions JSONB,
  warning_signs JSONB,
  stage_checklists JSONB,
  slide_emphasis JSONB,
  version INTEGER,
  is_active BOOLEAN,
  source TEXT
);

-- onboarding_questions
CREATE TABLE onboarding_questions (
  id UUID PRIMARY KEY,
  text TEXT,
  type TEXT,
  topic TEXT,
  why_matters TEXT,
  options JSONB,
  is_active BOOLEAN,
  display_order INTEGER
);

### Prompt pack layer (actual schema)

-- prompt_packs
CREATE TABLE prompt_packs (
  id UUID PRIMARY KEY,
  title TEXT,
  slug TEXT UNIQUE,
  description TEXT,
  category TEXT,
  stage_tags TEXT[],
  industry_tags TEXT[],
  version INTEGER,
  is_active BOOLEAN,
  source TEXT,
  metadata JSONB
);

-- prompt_pack_steps
CREATE TABLE prompt_pack_steps (
  id UUID PRIMARY KEY,
  pack_id UUID REFERENCES prompt_packs(id),
  step_order INTEGER,
  purpose TEXT,
  prompt_template TEXT,
  input_schema JSONB,
  output_schema JSONB,
  model_preference TEXT,
  tools TEXT[]
);

-- feature_pack_routing
CREATE TABLE feature_pack_routing (
  feature_route TEXT PRIMARY KEY,
  intent TEXT,
  default_pack_slug TEXT,
  industry_override_pattern JSONB,
  priority INTEGER
);

-- Pitch decks
CREATE TABLE pitch_decks (
  id UUID PRIMARY KEY,
  startup_id UUID REFERENCES startups(id),
  template TEXT,
  industry_pack TEXT,
  wizard_data JSONB,
  slides JSONB[],
  critique JSONB,
  export_url TEXT
);
```

### Improvement Roadmap

| Area | Gap | Recommendation | Priority |
|------|-----|----------------|----------|
| **Prompt Packs** | No team-building pack | Add Team Building Pack | P1 |
| **Prompt Packs** | Limited financial modeling | Add Financial Model Pack | P1 |
| **Agents** | Single model per agent | Add model fallback (Gemini → Claude) | P0 |
| **Agents** | No learning loop | Add feedback loop from user edits | P2 |
| **Wizards** | No save-and-continue | Add progress persistence | P0 |
| **Wizards** | Limited skip logic | Add conditional step skipping | P1 |
| **Dashboards** | Static widgets | Add real-time updates with subscriptions | P1 |
| **Edge Functions** | No rate limiting | Add per-user rate limits | P0 |
| **Edge Functions** | No cost tracking | Add token/cost tracking per startup | P0 |
| **Schema** | No audit log | Add audit_log table for changes | P1 |

### New Playbooks to Add (Future)

| Playbook | Description | Priority |
|----------|-------------|----------|
| **Team Building** | Hiring, culture, equity, org design | P1 |
| **Financial Planning** | Projections, burn, runway, scenarios | P1 |
| **Product Development** | Spec, roadmap, sprint planning | P1 |
| **Customer Success** | Onboarding, retention, expansion | P2 |
| **Legal & Compliance** | Entity, IP, contracts, regulatory | P2 |
| **Pivot Framework** | When to pivot, how, revalidation | P2 |

---

## References

| Doc | Purpose |
|-----|---------|
| `tasks/00-plan/index-tasks.md` | Task index and structure. |
| `tasks/00-plan/1-index-tasks.md` | Implementation order (industry + prompt packs as one stream). |
| Industry strategy docs | Question packs (8 per industry), playbooks, 13 industries, shared schema, stage filtering, conditional logic. |
| `tasks/00-plan/prompts/prompt-library/00-startupai-ai-agents-prompt-packs.md` | Master spec: prompt packs + AI agents, flow, acceptance criteria. |
| `tasks/00-plan/prompts/prompt-library/01-prompt-library-index.md` | When to use each prompt; list of prompts by domain (ideation → pitch-deck). |
| `tasks/00-plan/prompts/prompt-library/100-prompt-pack-strategy.md` | Pack strategy, categories, flow, Supabase schema. |
| `tasks/00-plan/prompts/prompt-library/101-prompt-strategy.md` | Agent-driven routing, context detection (route/intent → module), prompts vs playbooks, system architecture. |
| `tasks/00-plan/prompts/101-startup-playbooks.md` | **Startup Playbooks Master Guide** — comprehensive playbook system with architecture, core/advanced playbooks, AI agents, automations, dashboards, and implementation plan. |
| Implementation tasks (DB, edge, seed) | DB schema, edge functions, seed per PRD P1–P4. |
