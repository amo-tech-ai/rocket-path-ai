---
prompt_number: 14
title: Pitch Deck Generation Cycle & User Journey
category: Workflow
focus: Data flow from onboarding → lean canvas → pitch deck
---

# Prompt 14: Pitch Deck Generation Cycle & User Journey

> **Core Principle:** The AI never asks founders to repeat themselves.
> **Philosophy:** Pitch decks are **assembled intelligently** from existing data, not created from scratch.
> **Depends on:** Onboarding (Prompt 100), Lean Canvas (10-lean-canvas.md), Prompt 12 (Generation), Prompt 13 (Editor)

---

## The Zero-Duplication Promise

The Pitch Deck AI Agent **pulls, synthesizes, and structures** information from:

| Source | Data Used |
|--------|-----------|
| Onboarding Wizard | Company name, industry, stage, description, founder profile |
| Lean Canvas | Problem, solution, UVP, segments, revenue, costs, metrics |
| Market & Traction | Users, MRR, growth rate, funding status |
| Industry Pack | Benchmarks, language, investor expectations |

**No form asks for data that already exists.**

---

## User Journey Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY FLOW                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   [Onboarding]  →  [Lean Canvas]  →  [Pitch Deck]  →  [Editor]     │
│      (4 steps)      (9 boxes)        (Generate)       (Refine)     │
│                                                                     │
│   ────────────────────────────────────────────────────────────────  │
│   Startup Profile    Business Model    AI Assembly    Full Control  │
│   Industry Context   Value Prop        Investor Flow  AI Coaching   │
│   Founder Data       Customer Fit      Slide Design   Signal Score  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Step 0: Preconditions (Completed Inputs)

Before pitch deck generation, user has completed:

### ✅ Onboarding Wizard (4 Steps)

| Step | Data Collected |
|------|----------------|
| Step 1 | Company name, website URL, description, target market, LinkedIn |
| Step 2 | AI extractions (industry, features, competitors, signals) |
| Step 3 | Smart interview (traction, market, team, product, fundraising) |
| Step 4 | Review, investor score, AI summary |

**Stored in:** `wizard_sessions.form_data`, `wizard_sessions.ai_extractions`, `startups` table

### ✅ Lean Canvas (9 Boxes)

| Box | Content |
|-----|---------|
| Problem | Top 3 problems |
| Customer Segments | Target customers |
| Unique Value Proposition | Single clear message |
| Solution | Top 3 features |
| Channels | Path to customers |
| Revenue Streams | How you make money |
| Cost Structure | Fixed and variable costs |
| Key Metrics | Numbers that matter |
| Unfair Advantage | What can't be copied |

**Stored in:** `documents` table (`type = 'lean_canvas'`), `content_json` field

### ✅ Market & Traction Basics

| Metric | Source |
|--------|--------|
| Active users | Onboarding interview |
| MRR/Revenue | Onboarding interview |
| Growth rate | Onboarding interview |
| Funding stage | Onboarding interview |
| Funding target | Onboarding interview |

**Stored in:** `wizard_sessions.extracted_traction`, `startups.traction_data`

---

## Step 1: Entry Point — "Generate Pitch Deck"

### Trigger

User clicks **"Generate Pitch Deck"** from:
- My Presentations dashboard
- Lean Canvas completion CTA
- Main dashboard quick action
- Documents hub

### Pre-Generation Check

Before generation starts, validate:

| Check | Fail Action |
|-------|-------------|
| Onboarding completed | Redirect to `/onboarding` |
| Startup profile exists | Show error |
| Lean canvas exists (recommended) | Show warning, allow proceed |
| Industry selected | Prompt selection |

### UI Response

Transition to animated **AI Processing Screen** (Prompt 12):

```
┌────────────────────────────────────────┐
│     Creating Your Pitch Deck           │
│     ════════════════════════           │
│                                        │
│     [████████████░░░░░░░░░] 60%        │
│                                        │
│     🧠 Analyzing startup profile       ✓ │
│     📋 Mapping Lean Canvas to slides   ✓ │
│     🎯 Applying investor narrative     ● │
│     🎨 Designing slide layouts         ○ │
│     ✨ Generating visuals              ○ │
│                                        │
│     This usually takes under a minute  │
└────────────────────────────────────────┘
```

---

## Step 2: AI Agent — Data Ingestion Phase

The Pitch Deck AI Agent automatically loads all existing data:

### Data Aggregation Query

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI AGENT DATA INGESTION                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │  startups   │    │  wizard_    │    │  documents  │         │
│  │   table     │    │  sessions   │    │  (canvas)   │         │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘         │
│         │                  │                  │                 │
│         └──────────────────┼──────────────────┘                 │
│                            │                                    │
│                    ┌───────▼───────┐                            │
│                    │  AI Context   │                            │
│                    │   Builder     │                            │
│                    └───────┬───────┘                            │
│                            │                                    │
│                    ┌───────▼───────┐                            │
│                    │ Pitch Deck    │                            │
│                    │ AI Agent      │                            │
│                    └───────────────┘                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Startup Profile (from `startups` + `wizard_sessions`)

| Field | Maps To |
|-------|---------|
| `name` | Title slide, throughout deck |
| `description` | Solution slide opener |
| `industry` | Industry-specific language |
| `stage` | Slide emphasis, narrative tone |
| `traction_data.mrr` | Traction slide metrics |
| `traction_data.users` | Traction slide metrics |
| `ai_summary` | Executive summary content |
| `investor_ready_score` | Signal strength baseline |

### Lean Canvas (from `documents.content_json`)

| Canvas Box | Extracted Content |
|------------|-------------------|
| `problem` | Array of 3 problems |
| `solution` | Array of 3 solutions |
| `unique_value_proposition` | Single statement |
| `customer_segments` | Target customer descriptions |
| `revenue_streams` | Revenue model details |
| `cost_structure` | Cost breakdown |
| `key_metrics` | KPIs and targets |
| `unfair_advantage` | Competitive moat |
| `channels` | Go-to-market approach |

### Interview Answers (from `wizard_sessions.interview_answers`)

| Question Topic | Used In |
|----------------|---------|
| Traction | Traction slide, metrics |
| Market | Market slide, TAM/SAM/SOM |
| Team | Team slide |
| Product | Product slide, features |
| Fundraising | Ask slide, use of funds |

---

## Step 3: AI Agent — Intelligence Layer

### Cross-Validation

AI validates consistency across sources:

| Check | Action if Inconsistent |
|-------|------------------------|
| Lean Canvas problem ≠ onboarding description | Flag for review, use most detailed |
| Revenue in canvas ≠ interview MRR | Use interview (more specific) |
| Customer segment ≠ target market | Merge intelligently |

### Gap Detection

AI identifies missing or weak data:

| Missing Element | Impact | AI Action |
|-----------------|--------|-----------|
| Team information | Team slide empty | Generate placeholder + flag |
| Financial metrics | Traction weak | Emphasize product/market instead |
| Competitive analysis | Competition slide sparse | Use industry benchmarks |
| Use of funds | Ask slide incomplete | Generate standard allocation |

### Industry-Specific Framing

AI adjusts language and emphasis based on industry:

| Industry | Emphasis | Language |
|----------|----------|----------|
| SaaS | MRR, CAC, LTV, churn | "ARR", "net revenue retention" |
| FinTech | Compliance, security | "Regulated", "bank-grade" |
| Healthcare | Clinical validation | "FDA pathway", "patient outcomes" |
| Marketplace | GMV, liquidity | "Take rate", "supply/demand" |

### Stage-Based Narrative

| Stage | Narrative Focus | De-emphasized |
|-------|-----------------|---------------|
| Pre-Seed | Vision, problem, team | Metrics (too early) |
| Seed | Traction, PMF signals | Detailed financials |
| Series A | Unit economics, scale | Problem discovery |

---

## Step 4: Lean Canvas → Slide Mapping

Direct translation from Lean Canvas to pitch deck:

| Lean Canvas Element | Pitch Deck Slide | Content Transformation |
|--------------------|------------------|------------------------|
| **Problem** | Problem | Top 3 problems → bullet points |
| **Solution** | Solution | Top 3 features → visual + bullets |
| **Unique Value Proposition** | Why Us / Differentiation | Statement → headline |
| **Customer Segments** | Target Market | Segments → TAM/SAM/SOM context |
| **Revenue Streams** | Business Model | Revenue model → visual diagram |
| **Cost Structure** | (Informs financials) | Context for Use of Funds |
| **Key Metrics** | Traction | KPIs → metrics grid |
| **Unfair Advantage** | Moat / Competition | Competitive positioning |
| **Channels** | Go-To-Market (optional) | GTM strategy bullets |

### Mapping Visualization

```
┌─────────────────────────────────────────────────────────────────┐
│              LEAN CANVAS → PITCH DECK MAPPING                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  LEAN CANVAS                        PITCH DECK                  │
│  ┌─────────────┐                    ┌─────────────┐             │
│  │ Problem     │ ─────────────────→ │ Slide 2     │             │
│  ├─────────────┤                    │ PROBLEM     │             │
│  │ Solution    │ ─────────────────→ ├─────────────┤             │
│  ├─────────────┤                    │ Slide 3     │             │
│  │ UVP         │ ─────────────────→ │ SOLUTION    │             │
│  ├─────────────┤                    ├─────────────┤             │
│  │ Customer    │ ─────────────────→ │ Slide 5     │             │
│  │ Segments    │                    │ MARKET      │             │
│  ├─────────────┤                    ├─────────────┤             │
│  │ Revenue     │ ─────────────────→ │ Slide 7     │             │
│  │ Streams     │                    │ BIZ MODEL   │             │
│  ├─────────────┤                    ├─────────────┤             │
│  │ Key Metrics │ ─────────────────→ │ Slide 6     │             │
│  ├─────────────┤                    │ TRACTION    │             │
│  │ Unfair      │ ─────────────────→ ├─────────────┤             │
│  │ Advantage   │                    │ Slide 8     │             │
│  └─────────────┘                    │ COMPETITION │             │
│                                     └─────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Step 5: Narrative Assembly

AI constructs a **proven investor flow**:

### Standard Slide Order

| # | Slide | Source | Purpose |
|---|-------|--------|---------|
| 1 | **Title** | Startup name, tagline | Hook investor |
| 2 | **Problem** | Lean Canvas: Problem | Create urgency |
| 3 | **Solution** | Lean Canvas: Solution | Present answer |
| 4 | **Product** | Onboarding: description | Show what you built |
| 5 | **Market** | Interview: market | Prove opportunity size |
| 6 | **Traction** | Interview: traction, Canvas: metrics | Show proof |
| 7 | **Business Model** | Canvas: revenue streams | Explain economics |
| 8 | **Competition** | Canvas: unfair advantage | Position vs alternatives |
| 9 | **Team** | Interview: team | Build credibility |
| 10 | **Roadmap** | (Generated) | Show vision |
| 11 | **Ask** | Interview: fundraising | Make the request |
| 12 | **Contact** | Startup info | Enable follow-up |

### Adaptive Ordering by Stage

| Stage | Order Adjustment |
|-------|------------------|
| Pre-Seed | Team earlier (slide 4-5), minimize traction |
| Seed | Standard order, emphasize traction |
| Demo Day | Compressed (8 slides), traction + ask prominent |
| Series A | Lead with metrics, detailed financials |

### Narrative Arc

```
HOOK → PAIN → PROMISE → PROOF → ASK

Slide 1-2:   HOOK      (Title, Problem)
Slide 3-4:   PROMISE   (Solution, Product)
Slide 5-6:   PROOF     (Market, Traction)
Slide 7-9:   CREDIBILITY (Model, Competition, Team)
Slide 10-12: CLOSE     (Roadmap, Ask, Contact)
```

---

## Step 6: Design & Layout Generation

### Layout Selection Logic

| Slide Type | Recommended Layout | Rationale |
|------------|-------------------|-----------|
| Title | Centered, minimal | Maximum impact |
| Problem | Text-left, visual-right | Story + evidence |
| Solution | Split, visual-heavy | Show the product |
| Product | Image-grid | Feature showcase |
| Market | Data-visualization | TAM/SAM/SOM circles |
| Traction | Metrics-grid | Numbers prominent |
| Business Model | Flow diagram | Revenue visualization |
| Competition | 2x2 matrix | Positioning clarity |
| Team | Team-grid | Faces + credentials |
| Roadmap | Timeline | Visual progression |
| Ask | Centered, emphasis | Clear call-to-action |

### Design Rules

| Rule | Implementation |
|------|----------------|
| Clean | Maximum 3 elements per slide |
| Minimal | No decorative graphics |
| Readable | 24pt minimum for body text |
| Consistent | Same font, color, spacing |
| Professional | Investor-grade aesthetic |

---

## Step 7: Visual Generation (Nano Banana Pro)

AI generates slide visuals using `gemini-3-pro-image-preview`:

| Slide | Visual Generated |
|-------|------------------|
| Title | Abstract brand graphic |
| Problem | Pain point diagram |
| Solution | "After" visualization |
| Product | Process flow |
| Market | TAM/SAM/SOM circles |
| Traction | Growth chart |
| Business Model | Revenue flow |
| Competition | 2x2 positioning |
| Team | Role icons |
| Roadmap | Timeline |
| Ask | Allocation pie/bars |

**See:** `12.1-image-generation.md` for detailed visual prompts per slide

---

## Step 8: Post-Generation — Pitch Deck Editor

### Editor Entry

After generation completes:
- Auto-redirect to `/pitch-deck/edit/:deckId`
- Success message: "Your pitch deck is ready. You're in full control."

### 3-Panel Editor System

| Panel | Content | User Actions |
|-------|---------|--------------|
| **Left** | Slide list, status icons, reorder | Select, drag, add, delete |
| **Center** | Slide canvas, content editor | Edit text, change layout |
| **Right** | AI suggestions, signal strength | Apply/ignore suggestions |

### AI Coaching Actions

| Action | What AI Does |
|--------|--------------|
| Improve clarity | Rewrites for conciseness |
| Tighten messaging | Removes jargon, simplifies |
| Suggest upgrades | Adds missing proof points |
| Highlight risks | Flags investor concerns |
| Compare to top decks | Benchmarks vs best practices |

### Traceability

Every slide shows its data source:

```
┌─────────────────────────────────────┐
│ Problem Slide                       │
│ ─────────────────────               │
│ Content from: Lean Canvas > Problem │
│ Last synced: 2 hours ago            │
│ [Resync from Canvas]                │
└─────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLETE DATA FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐        │
│  │ Onboarding   │   │ Lean Canvas  │   │ Industry     │        │
│  │ wizard_      │   │ documents    │   │ industry_    │        │
│  │ sessions     │   │ (type=lc)    │   │ packs        │        │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘        │
│         │                  │                  │                 │
│         └──────────────────┼──────────────────┘                 │
│                            ▼                                    │
│                  ┌──────────────────┐                           │
│                  │ pitch-deck-agent │                           │
│                  │ (Edge Function)  │                           │
│                  └────────┬─────────┘                           │
│                           │                                     │
│           ┌───────────────┼───────────────┐                     │
│           ▼               ▼               ▼                     │
│  ┌────────────┐   ┌────────────┐   ┌────────────┐              │
│  │ Narrative  │   │ Design     │   │ Visual     │              │
│  │ Agent      │   │ Agent      │   │ Agent      │              │
│  │ (Gemini)   │   │ (Gemini)   │   │ (Nano      │              │
│  │            │   │            │   │  Banana)   │              │
│  └─────┬──────┘   └─────┬──────┘   └─────┬──────┘              │
│        │                │                │                      │
│        └────────────────┼────────────────┘                      │
│                         ▼                                       │
│               ┌──────────────────┐                              │
│               │   pitch_decks    │                              │
│               │ pitch_deck_slides│                              │
│               └────────┬─────────┘                              │
│                        │                                        │
│                        ▼                                        │
│               ┌──────────────────┐                              │
│               │  Pitch Deck      │                              │
│               │  Editor (UI)     │                              │
│               └──────────────────┘                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key UX Principles

| Principle | Implementation |
|-----------|----------------|
| **No duplication** | AI pulls from existing data, never asks twice |
| **Explainability** | AI explains *why* it suggests changes |
| **User control** | Founder can accept or ignore AI input |
| **Traceability** | Every slide traceable to source (Canvas, Interview) |
| **Consistency** | Narrative consistent across all documents |

---

## Outcome

After the cycle completes, the founder has:

| Deliverable | Quality |
|-------------|---------|
| Coherent pitch deck | 10-12 slides, investor-ready |
| Narrative consistency | Aligned with Lean Canvas and profile |
| Signal strength score | 0-100 with breakdown |
| AI coaching | Continuous improvement suggestions |
| Full control | Edit, reorder, regenerate any slide |

---

## The Experience

> This system should feel like:
> **A senior partner assembling your story — not a form generator.**

The AI:
- Knows your business deeply (from onboarding + canvas)
- Structures your narrative (investor-proven flow)
- Designs your slides (professional, clean)
- Coaches you to improve (suggestions, not automation)
- Never asks you to repeat yourself

---

## Success Criteria

- [ ] Pitch deck uses data from onboarding (no re-entry)
- [ ] Lean Canvas maps to correct slides
- [ ] Industry context affects language and metrics
- [ ] Stage affects slide emphasis and order
- [ ] AI validates data consistency
- [ ] Gap detection flags missing elements
- [ ] Narrative follows proven investor flow
- [ ] Every slide shows its data source
- [ ] User can sync slide with source data
- [ ] Editor provides AI coaching suggestions

---

## Files Reference

| File | Purpose |
|------|---------|
| `src/hooks/usePitchDeckContext.ts` | Aggregates data from all sources |
| `supabase/functions/pitch-deck-agent/handlers/aggregate.ts` | Data aggregation logic |
| `supabase/functions/pitch-deck-agent/handlers/generate.ts` | Deck generation |
| `src/components/pitch-deck/DataSourceBadge.tsx` | Shows slide data origin |

---

**Previous:** Prompt 13 (Pitch Deck Editor)
**Reference:** `tasks/onboarding/100-prompt-onboarding.md`, `00-prompts/10-lean-canvas.md`
