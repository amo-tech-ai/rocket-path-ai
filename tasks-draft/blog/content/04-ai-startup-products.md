# AI Startup Products — Content Enhancements

> **See `00-design-principles.md` for visual rules.**
> This report's #1 problem: says "most funded" but has zero funding data. Fix with named companies + $ in every section.

---

## HERO

**KPI Strip:**

| $250B+ | $33.9B | 3× | 84% |
|--------|--------|----|-----|
| invested in AI (2024) | into GenAI startups | more AI startups funded vs last year | focus on B2B workflow automation |

**Context (2 sentences):**
The most-funded AI startups don't build better models. They pick a specific expensive job and build AI that does 80% of it.

**Opening example (company card):**
```
┌─ Cursor (Anysphere) ─────────────┐
│  AI code editor                  │
│                                  │
│  $9B   valuation                 │
│  3-5×  developer productivity    │
│  $20-40/month per seat           │
│                                  │
│  Didn't replace programmers.     │
│  Made them dramatically faster.  │
│  Developer costs $150-300K/yr.   │
│  3× productivity = $300-600K     │
│  value per seat per year.        │
└──────────────────────────────────┘
```

---

## SECTION: Where the Money Goes — 3 Layers

**Visual: Stacked layer diagram with company cards**

```
┌─ LAYER 1: APPLICATIONS ─────────────────────────────────┐
│  Where value accrues. Pick a job, own the workflow.      │
│                                                          │
│  Harvey    Legal AI         $300M+   $500-2K/seat/mo     │
│  Sierra    CX agents        $175M+   Bret Taylor (ex-    │
│                                      Salesforce CEO)     │
│  Cursor    Code editor      $9B      3-5× dev speed      │
│  CuspAI    Material science $100M    34 people, Cambridge │
│  Legora    Legal workflows  €74M     165 people, Stockholm│
│  Neura     Factory robots   €120M    1,000 employees      │
├──────────────────────────────────────────────────────────┤
│  LAYER 2: INFRASTRUCTURE                                 │
│  Picks and shovels. Tools that AI apps run on.           │
│                                                          │
│  Coreweave   GPU rental     Multi-B  "AWS for AI"        │
│  Encord      Training data  AI 100   Data pipeline        │
│  PhysicsX    Simulation     €124M    188 people, London   │
│  Multiverse  Quantum+AI     €189M    185 people           │
├──────────────────────────────────────────────────────────┤
│  LAYER 3: MODELS                                         │
│  Commoditizing fast. Getting cheaper every month.        │
│                                                          │
│  OpenAI      ChatGPT        ~$300B   Top 15 if public    │
│  Anthropic   Claude         $60B+    Safety-focused       │
│  Mistral     Open-source    $6B+     <500 people          │
│  H Company   Next-gen       €202M    Largest EU AI seed   │
│              models         seed     75 people, Paris      │
└──────────────────────────────────────────────────────────┘
```

**Insight card:**
```
┌──────────────────────────────────────────────────────┐
│  Why models are commoditizing:                       │
│                                                      │
│  280×   cost drop in 24 months                       │
│  5.4%   gap between #1 and #10 model (was 11.9%)    │
│  1.7%   gap between open-source and paid (was 8%)    │
│  90%    of notable models from industry (was 60%)    │
│                                                      │
│  The model is becoming a utility — like electricity. │
│  Value has moved to the application layer.           │
└──────────────────────────────────────────────────────┘
```

---

## SECTION: The Pattern — 3 Stories

**Instead of abstract "strategic pillars," show 3 company stories:**

```
┌─ Story 1: Own the Workflow ──────────────────────────────┐
│                                                          │
│  🔴 The obvious approach: Build a VS Code plugin that    │
│     suggests code. Hundreds of startups did this.        │
│                                                          │
│  🟢 What Cursor did: Built an entirely new editor        │
│     designed around AI from the ground up.               │
│                                                          │
│  Result: Developers don't use Cursor alongside their     │
│  old editor. They switch completely. The startup         │
│  becomes the primary tool, not an add-on. $9B.           │
│                                                          │
│  Pattern: Find the $100K+ worker. Map their day.         │
│  Automate the repetitive 80%. Keep humans for the 20%.   │
└──────────────────────────────────────────────────────────┘

┌─ Story 2: Humans Stay in Control ────────────────────────┐
│                                                          │
│  Sierra (founded by ex-Salesforce CEO) builds AI agents  │
│  for customer service. Routine questions: autonomous.    │
│  Complex issues: escalates to a human WITH full context. │
│                                                          │
│  Why investors love this:                                │
│  74% of companies want agents.                           │
│  21% have governance for full autonomy.                  │
│  79% CAN'T deploy fully autonomous AI.                   │
│                                                          │
│  Startups with human fallback deploy 3-5× faster.        │
│  "Human in the loop" isn't a weakness — it's a moat.     │
└──────────────────────────────────────────────────────────┘

┌─ Story 3: The Data Moat ─────────────────────────────────┐
│                                                          │
│  Every law firm using Harvey trains it on THEIR specific │
│  contracts, clause preferences, and legal style.         │
│  After 6 months, no competitor can match it.             │
│                                                          │
│  The model costs $1/million operations (and falling).    │
│  The proprietary data from 1000s of interactions?        │
│  Priceless.                                              │
│                                                          │
│  Harvey ── legal data compounds with each firm           │
│  Cursor ── codebase knowledge compounds per team         │
│  CuspAI ── decades of material science data, AI-ready    │
└──────────────────────────────────────────────────────────┘
```

---

## SECTION: What Customers Actually Pay (and Why)

**Visual: Value/pricing cards**

```
┌─ Time Saved ─────────────────────┐
│  Cursor: $20-40/mo per dev       │
│  Dev costs $150-300K/yr          │
│  3× productivity = $300-600K     │
│  value per seat per year.        │
│  ROI: 600×+                      │
└──────────────────────────────────┘

┌─ Revenue Lift ───────────────────┐
│  Slazenger + Insider AI          │
│  49× ROI                         │
│  700% more new customers         │
│  When AI makes you $49 for       │
│  every $1 spent, the pricing     │
│  conversation is 30 seconds.     │
└──────────────────────────────────┘

┌─ Cost Reduction ─────────────────┐
│  Avis: WhatsApp AI               │
│  70% of queries automated        │
│  39% cost reduction              │
│  Thousands of agents globally    │
│  = tens of millions saved.       │
└──────────────────────────────────┘

┌─ Better Decisions ───────────────┐
│  GrowthFactor: $200-2K/mo        │
│  AI picks where to open stores   │
│  Cavender's: 3× store growth     │
│  Wrong location: $500K+ loss     │
│  Right location: millions.       │
└──────────────────────────────────┘
```

**Quote card:**
```
┌────────────────────────────────────────────────────┐
│  "The best-funded AI startups charge based on the  │
│   value they create, not the compute they consume. │
│   If your AI saves a $200K/year lawyer 20 hours    │
│   a week, you can charge $2K/month and the client  │
│   is thrilled."                                    │
└────────────────────────────────────────────────────┘
```

---

## SECTION: What Gets Funded vs What Kills Deals

**Visual: Green/Red two-column comparison**

```
✅ GETS FUNDED                      ❌ KILLS THE DEAL
─────────────────────────────────────────────────────────
Replaces a specific expensive       "We're basically ChatGPT
task. Harvey → contract review.     with a nicer interface."
Cursor → boilerplate code.          Model gap: 5.4%. If the
                                    API improves, you're done.

Every customer makes the            One-time value. Generate
product better. Data compounds.     a doc, translate a text.
After 6 months, no competitor       A feature, not a company.
can match you for that client.

Has a way to reach customers.       "AI for everyone." Burned
Shopify reaches 4.4M merchants.     seed round trying to sell
Salesforce reaches every CRM.       to every industry.
                                    41 of top 100 are vertical.

Humans stay in control.             Full autonomy, no rules.
Audit trails, approval flows.       79% of companies CAN'T
Deploys 3-5× faster.               buy fully autonomous AI.
```

---

## SECTION: Why AI Startups Fail

**Visual: 4 failure pattern cards (dark background)**

```
┌─ 💀 The Margin Trap ─────────────────────────────────────┐
│  Built on GPT-4 at $30/million tokens. Priced at         │
│  $50/month with $20 margin. Then API prices dropped to   │
│  $1/million tokens. Every competitor matched them at      │
│  one-tenth the cost. No data moat = no business.          │
└──────────────────────────────────────────────────────────┘

┌─ 💀 Can't Be Deployed ──────────────────────────────────┐
│  Built a financial AI agent. Worked beautifully in demos.│
│  Banks couldn't use it: no audit trail, no approval      │
│  flow, no way to explain decisions to regulators.        │
│  The product worked — it just couldn't be used.          │
└──────────────────────────────────────────────────────────┘

┌─ 💀 The Horizontal Trap ────────────────────────────────┐
│  "AI for everyone" → sold to no one. 18 months selling   │
│  to restaurants, law firms, e-commerce, manufacturers.   │
│  Each needed different features. Ran out of money before │
│  closing 10 customers. Meanwhile, a law-only competitor  │
│  closed 200 deals.                                       │
└──────────────────────────────────────────────────────────┘

┌─ 💀 The Pilot Graveyard ────────────────────────────────┐
│  Only 26% of AI projects get past proof-of-concept.      │
│  Signed a pilot with a big company. Pilot worked. But    │
│  data wasn't clean, teams weren't trained, IT had 50     │
│  other priorities. Sat in "successful pilot" limbo for   │
│  a year. Ran out of runway.                              │
└──────────────────────────────────────────────────────────┘
```

---

## SECTION: Europe's AI Startup Ecosystem

**Visual: Company grid with map pins**

| Company | Where | What (in plain English) | Raised | Team |
|---------|-------|------------------------|--------|------|
| H Company | Paris | Building next-gen AI models | €202M seed | 75 |
| Multiverse | San Sebastián | Quantum computing for AI | €189M | 185 |
| PhysicsX | London | Simulating factories & engines | €124M | 188 |
| Neura Robotics | Germany | AI-powered factory robots | €120M | 1,000 |
| CuspAI | Cambridge | Discovering new materials | $100M | 34 |
| Legora | Stockholm | AI for legal work | €74M | 165 |

**Comparison strip:**
```
US AI Startups                  European AI Startups
─────────────────────────────────────────────────────
Consumer-focused                Industrial-focused
Large teams                     Lean teams (CuspAI: 34)
$109.1B invested                Growing fast, less capital
Average age: 5-10 years         Average founding: 2022
```

**Sector distribution (horizontal bar):**
```
Vertical Apps       ██████████████████████████████████████████ 41
Infrastructure      █████████████████████ 21
Robotics            ███████████ 11
Industrial          ████████ 8
Defense             ████████ 8
Biotech             ██████ 6
Enterprise Agents   ██████ 6
```

---

## SECTION: 3 Takeaways

**Visual: Large quote cards (dark background, full-width)**

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  1. Pick a specific expensive job and own it completely.   │
│                                                            │
│  The $1.6T AI market will be captured by 10,000 vertical   │
│  startups, not 100 platform companies. Harvey owns legal   │
│  contracts. Cursor owns coding. Find yours.                │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                                                            │
│  2. Build a data moat or die slowly.                       │
│                                                            │
│  AI costs dropped 280×. If your value comes from the       │
│  model, every price drop helps competitors equally.        │
│  Proprietary data is the only moat that survives.          │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                                                            │
│  3. Solve governance and you'll deploy faster than anyone. │
│                                                            │
│  74% want agents. 21% can govern them. Build a product     │
│  that compliance can approve, and you'll close deals       │
│  while competitors are stuck in pilot purgatory.           │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## SOURCES

Stanford HAI 2025 · Bloomberg GenAI · Bain Tech Report · McKinsey State of AI · McKinsey Tech Services · Deloitte 2026 · Sifted AI 100 · a16z State of AI · Insider / Slazenger · Avis Case Study · GrowthFactor / Cavender's
