# StartupAI — Content Infographic System v1.0

> **What this is**: The complete operating system for researching, planning, designing, animating, and distributing infographic content. One document that connects all 25+ files into a single production pipeline.
>
> **Who it's for**: Anyone creating StartupAI content — articles, social, video, presentations.
>
> **Rule**: Visual first. Always. If it can be a chart, diagram, or card — it is never text.

---

## SYSTEM MAP

```
┌═══════════════════════════════════════════════════════════════════════════════┐
║                                                                               ║
║  PHASE 1          PHASE 2          PHASE 3         PHASE 4        PHASE 5     ║
║  RESEARCH         PLAN             BUILD           ANIMATE        DISTRIBUTE  ║
║                                                                               ║
║  ┌─────────┐     ┌─────────┐     ┌─────────┐    ┌─────────┐    ┌─────────┐  ║
║  │ Find    │     │ Pick    │     │ Design  │    │ Add     │    │ Export  │  ║
║  │ data    │ ──▶ │ charts  │ ──▶ │ visuals │ ──▶│ motion  │ ──▶│ to all  │  ║
║  │ + stats │     │ + story │     │ + layout│    │ + inter │    │ channels│  ║
║  └─────────┘     └─────────┘     └─────────┘    └─────────┘    └─────────┘  ║
║                                                                               ║
║  Uses:            Uses:            Uses:          Uses:          Uses:         ║
║  • Web search     • Pre-flight     • Style spec   • Animation    • Channel    ║
║  • Landscape      • Chart type     • Design       • Flourish     • strategy   ║
║  •   research     •   selector     •   prompts    • Figma        • Export     ║
║  • Source          • Article        • Visual-first • Motion       •   specs    ║
║  •   library       •  template     •   template   •  storyboard  • Calendar  ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

---

## PHASE 1 — RESEARCH

> **Goal**: Find credible data, stats, and sources before touching any design tool.

### Step 1.1 — Define the Topic

Answer these 4 questions (from the Pre-Flight Checklist):

| Question | Your Answer |
|----------|-------------|
| What founder pain does this address? | _____________ |
| What data proves this is real? | _____________ |
| What daily workflow does this change? | _____________ |
| What should a founder do after reading? | _____________ |

**If you can't answer all 4 → stop. Research more.**

### Step 1.2 — Find Data

| Source Type | Where to Look | Quality Bar |
|------------|---------------|-------------|
| Primary research | Stanford HAI, McKinsey, HubSpot State of AI, Gartner | Peer-reviewed or n=500+ |
| Industry reports | CB Insights, Crunchbase, PitchBook, Sifted | Named methodology, dated |
| Benchmark data | Ramp, Brex, Carta, OpenView SaaS | Real company data |
| Startup-specific | Y Combinator, a16z, First Round Capital blogs | Practitioner experience |
| Academic | arXiv, Google Scholar, Stanford SAIL | Peer-reviewed |

**Every stat needs**: Source name + year + sample size. No exceptions.

### Step 1.3 — Organize Data into Sections

Map every data point to a section BEFORE designing:

| Data Point | Value | Source | Section it Fits |
|-----------|-------|--------|----------------|
| [stat 1] | XX% | [source, year, n=] | Section 1 (Hook) |
| [stat 2] | XX% | [source, year, n=] | Section 2 (Where) |
| [stat 3] | XX% | [source, year, n=] | Section 3 (ROI) |
| [stat 4] | XX% | [source, year, n=] | Section 4 (Benchmark) |
| [stat 5] | XX% | [source, year, n=] | Section 5 (Fails) |
| [stat 6] | XX% | [source, year, n=] | Section 6 (Next) |

**Minimum**: 2 stats per section. If a section has 0 stats → don't write that section.

### Reference Files

| File | Location | When to Use |
|------|----------|-------------|
| AI Startup Landscape | `ai-startup-landscape-2026.md` | Background data: 127 startups, funding, categories |
| 8 Content Briefs | `infographic-content/01–08` | Pre-validated article topics with data mapped |

---

## PHASE 2 — PLAN

> **Goal**: Pick the right chart type for each section, write the narrative arc, assign visual treatments.

### Step 2.1 — Choose Chart Types

Use the Chart Type Selector (`20-chart-type-selector.md`). For each section, answer:

```
WHAT AM I SHOWING?
│
├─ One big number → KPI TILE (counter rollup animation)
├─ Ranked categories → HORIZONTAL BAR (sorted high → low)
├─ Part of a whole → DONUT (max 5 segments)
├─ Trend over time → LINE CHART or BAR CHART RACE
├─ Where am I on a scale? → GAUGE (needle sweep)
├─ A vs B comparison → SPLIT COMPARISON or GAP BAR
├─ Process / steps → FLOWCHART (path drawing animation)
├─ Root cause pattern → MINI FLOWCHART (3 nodes + arrows)
├─ Geographic data → CHOROPLETH MAP
└─ Action items → CHECKLIST CARD
```

### Step 2.2 — Fill the Section Planner

| Section | Story Goal | Chart Type | Data Points | Animation | Design Prompt |
|---------|-----------|------------|-------------|-----------|---------------|
| 1 — Hook | Shock with a number | KPI tiles | [3 stats] | Counter rollup | `01-statistical-dashboard.md` |
| 2 — Where it works | Rank by impact | Horizontal bars | [3–5 categories + %] | Bars grow | `01-statistical-dashboard.md` |
| 3 — What to use | Show top use cases | Icon cards (2×2) | [4 use cases + %] | Cards fade in | `07-illustrated-visual-cards.md` |
| 4 — Am I normal? | Peer benchmark | Gauge OR split comparison | [scale data or A vs B] | Needle sweep or slide-in | `10-gauge-speedometer.md` or `03-comparison-split.md` |
| 5 — Why it fails | Show blockers | Bars + mini flowchart | [4 blockers + root cause] | Bars + path draw | `01-statistical-dashboard.md` + `05-flowchart-diagram.md` |
| 6 — What's next | Show momentum | KPI tiles + checklist | [2 forward stats + 3 actions] | Counter + fade | `01-statistical-dashboard.md` |

### Step 2.3 — Write the Narrative Arc (5 sentences)

```
HOOK: [One surprising stat that stops the scroll]
CONTEXT: [Why this matters to founders right now]
TENSION: [The gap, problem, or contradiction in the data]
INSIGHT: [The one thing most founders get wrong]
CTA: [The specific next action]
```

### Step 2.4 — Run the Anti-Pattern Check

Before building, verify each chart choice against these 10 rules:

| Rule | Check |
|------|-------|
| Bars sorted high → low? | ☐ |
| Pie/donut has ≤ 5 segments? | ☐ |
| No 3D charts anywhere? | ☐ |
| No dual Y-axis? | ☐ |
| Line chart has time on X-axis? | ☐ |
| Every stat has source + year + n=? | ☐ |
| No more than 5 colors per chart? | ☐ |
| Direct labels (no separate legend)? | ☐ |
| Title states the insight, not the topic? | ☐ |
| Map used only when geography IS the story? | ☐ |

### Reference Files

| File | Location | When to Use |
|------|----------|-------------|
| Chart Type Selector | `20-chart-type-selector.md` | Pick the right chart for each section |
| Infographic Master Matrix | `01-infographic-master-matrix.md` | See all 13 types with animation + channel mapping |
| Article Template | `startupai-infographic-article-template.md` | Copy structure, editorial rules, word bans |
| Visual-First Template | `startupai-visual-first-template.md` | Wireframes, component library, 70/20/10 ratio |

---

## PHASE 3 — BUILD

> **Goal**: Design each visual using the prompt files and style spec.

### Step 3.1 — Paste the Global Style Spec

**Every single design prompt starts with the style block from `00-global-style-spec.md`.** No exceptions.

This ensures: DM Sans + Cormorant Garamond typography, warm ivory backgrounds, 90% neutral / 10% accent color, BCG editorial restraint, proper hierarchy.

### Step 3.2 — Build Each Section Visual

For each section, open the matched design prompt file and fill in the brackets:

| Section | Design Prompt File | What to Fill In |
|---------|-------------------|----------------|
| 1 — Hook | `01-statistical-dashboard.md` → Prompt 1B (Bento Dashboard) | 3 hero stats + source |
| 2 — Where | `01-statistical-dashboard.md` → Card 3 (Dual Bar) | 3–5 ranked categories + % |
| 3 — ROI | `07-illustrated-visual-cards.md` → Prompt 7B (Feature Cards) | 4 use cases + icons + examples |
| 4a — Scale | `10-gauge-speedometer.md` → Prompt 10A (Single Gauge) | Scale segments + value |
| 4b — Split | `03-comparison-split.md` → Prompt 3A (Split Screen) | Left vs right data rows |
| 5 — Fails | `01-statistical-dashboard.md` (bars) + `05-flowchart-diagram.md` → Prompt 5A (Decision Flowchart) | 4 blockers + 3-node root cause flow |
| 6 — Next | `01-statistical-dashboard.md` (tiles) + action checklist | 2 forward stats + 3 action items |

### Step 3.3 — Build in Tools

| Tool | Use For | Speed |
|------|---------|-------|
| **Flourish** | Interactive web charts (bars, gauges, races, maps, timelines) | Fastest for web |
| **Figma** | Static layouts, card grids, social carousel frames, prototypes | Fastest for static |
| **Claude/AI** | Generate React/HTML components for custom charts | Fastest for custom |
| **After Effects** | Hero video animations, Lottie web exports | Slowest but highest quality |

### Step 3.4 — Visual Quality Rules

```
THE 70/20/10 RATIO
├── 70% VISUALS — charts, diagrams, cards, icons
├── 20% CAPTIONS — one-liners under each visual
└── 10% BODY TEXT — transitions + takeaways only

If a section has 3+ sentences in a row → replace with a visual.
Max text per article: 15–20 lines total.
Max visuals per article: 8–12 components.
```

### Step 3.5 — Component Library (10 reusable pieces)

| # | Component | When to Use | Design Prompt |
|---|-----------|-------------|---------------|
| 1 | KPI Tile | Hero stats, single big numbers | `01` → Card 1 |
| 2 | Horizontal Bar | Rankings, magnitude, blockers | `01` → Card 3 |
| 3 | Icon Card | Use cases, features, tools | `07` → Prompt 7B |
| 4 | Donut / Ring | Part of whole, completion % | `01` → Card 2 |
| 5 | Split Comparison | A vs B, early vs growth, want vs get | `03` → Prompt 3A |
| 6 | Progress Scale | "Am I normal?" spectrum | Custom (scale variant) |
| 7 | Gauge | Single metric on a scale, benchmark | `10` → Prompt 10A |
| 8 | Mini Flowchart | Root cause, decision path, process | `05` → Prompt 5A |
| 9 | Gap Bar | Want vs get, expectation vs reality | `01` → Card 4 |
| 10 | Action Checklist | CTA, next steps, time-bound tasks | `02` → step cards |
| 11 | Callout Strip | One-line takeaway, section closer | `01` → Card 6 |

### Reference Files

| File | Location | When to Use |
|------|----------|-------------|
| Global Style Spec | `00-global-style-spec.md` | Paste at top of EVERY prompt |
| Statistical Dashboard | `01-statistical-dashboard.md` | KPI tiles, bars, donuts, gap bars |
| Process & How-To | `02-process-howto.md` | Step-by-step, numbered flows |
| Comparison & Split | `03-comparison-split.md` | A vs B, split screen, gap bars |
| Timeline & Roadmap | `04-timeline-roadmap.md` | Milestones, product evolution |
| Flowchart & Diagram | `05-flowchart-diagram.md` | Decision trees, architecture, root cause |
| Thought Leadership | `06-informational-thought-leadership.md` | Editorial cards, frameworks |
| Illustrated Cards | `07-illustrated-visual-cards.md` | Icon packs, feature cards, motifs |
| Gauge & Speedometer | `10-gauge-speedometer.md` | KPI scores, benchmarks, probability |

---

## PHASE 4 — ANIMATE

> **Goal**: Add motion to web embeds and video exports.

### Step 4.1 — Choose Animation per Section

| Section | Animation Type | Duration | Trigger | Tool |
|---------|---------------|----------|---------|------|
| 1 — Hook | Counter rollup (0 → value) | 1.2s | Page load or scroll | Flourish, CSS/JS |
| 2 — Where | Bars grow left → right (staggered) | 0.8s each, 150ms stagger | Scroll into view | Flourish, CSS |
| 3 — ROI | Cards fade + slide up | 0.3s each, 100ms stagger | Scroll into view | CSS, Figma Smart Animate |
| 4 — Benchmark | Gauge needle sweep | 1.5s | Scroll into view | Flourish Gauge |
| 5 — Fails | Bars grow + flowchart path draws | 0.8s bars, 0.3s per path | Scroll into view | Flourish + custom SVG |
| 6 — Next | Counter rollup + checklist fade | 1.2s counter, 0.3s cards | Scroll into view | CSS/JS |

### Step 4.2 — Animation Spec Reference

| Animation | CSS/JS Implementation | Easing |
|-----------|----------------------|--------|
| Counter rollup | `requestAnimationFrame` counting from 0 → value | `cubic-bezier(0.25, 0.1, 0.25, 1)` |
| Bar grow | `width` transition from `0%` → `{value}%` | `ease-out` |
| Card fade-in | `opacity: 0→1` + `translateY: 20px→0` | `ease-out` |
| Needle sweep | SVG `transform: rotate()` from 0° → value° | `ease-out with overshoot` |
| Path draw | SVG `stroke-dashoffset` from full → 0 | `linear` |
| Slide-in | `translateX: ±100%→0` | `cubic-bezier(0.16, 1, 0.3, 1)` |

### Step 4.3 — Flourish Animation Setup

| Feature | How to Enable | Template |
|---------|--------------|----------|
| Auto-play racing bars | Built-in on Bar Chart Race template | Bar Chart Race |
| Gauge needle | Built-in on Gauge template | Gauge |
| Time slider | Add date column → bind to Filter → choose "Time slider" control | Line/Bar/Pie |
| Story mode | Create Flourish Story → add slides → set auto-play + loop | Any template |
| Scrollytelling | Story mode + scrollytelling layout (Publisher/Enterprise) | Any template |
| Filter transitions | Add filter column → smooth animated transitions between states | Scatter, Bar, Survey |

### Step 4.4 — Video Production (for animated infographic videos)

| Step | Action | Tool | Output |
|------|--------|------|--------|
| 1 | Screen-record Flourish charts at 60fps | OBS, Loom | Raw clips |
| 2 | Import clips to editor | DaVinci Resolve, CapCut | Timeline |
| 3 | Add section title cards between clips | Editor text tool | Paced flow |
| 4 | Add transitions (cross-dissolve, 0.5s) | Editor | Smooth cuts |
| 5 | Optional: voiceover | Record narration | Audio track |
| 6 | Export 1920×1080 (YouTube) or 1080×1920 (Reels) | H.264 | Final video |

**Motion storyboard template**: `08-remotion-motion-storyboard.md`

### Reference Files

| File | Location | When to Use |
|------|----------|-------------|
| Motion Storyboard | `08-remotion-motion-storyboard.md` | Convert static to 15–18s animated video |
| Infographic Type Prompts | `02-infographic-type-prompts.md` | Animation specs for all chart types |
| Gauge Prompt | `10-gauge-speedometer.md` | Needle sweep animation keyframes |
| Master Matrix | `01-infographic-master-matrix.md` | Animation type reference (15 types) |

---

## PHASE 5 — DISTRIBUTE

> **Goal**: Export to all channels from one source article.

### Step 5.1 — The Content Cascade

```
ONE ARTICLE → 8 FORMATS → 4–5 HOURS TOTAL

Step 1: Build 6 charts in Flourish .................. 2–3 hrs
Step 2: Embed in blog article ....................... 30 min
Step 3: Screenshot all charts at 2× ................. 15 min
Step 4: Import to Figma carousel template ........... 30 min
Step 5: Screen-record Flourish animations ........... 20 min
Step 6: Edit video (CapCut/DaVinci) ................. 45 min
Step 7: Export hero stat PNG for email ............... 5 min
Step 8: Copy key chart to slide template ............ 10 min
```

### Step 5.2 — Channel Export Specs

| Channel | Dimensions | Format | Animation? | Visuals |
|---------|-----------|--------|------------|---------|
| Website | Responsive | Flourish script embed | Full | 6–10 per article |
| LinkedIn | 1080×1350px | PNG carousel (10 slides) | No | 1 per slide |
| Twitter/X | 1200×675px | PNG + thread | GIF optional | 1–4 images |
| Instagram carousel | 1080×1350px | PNG slides | No | 10 slides |
| Instagram Reel | 1080×1920px | MP4 (30–90s) | Full | Screen-recorded |
| YouTube | 1920×1080px | MP4 (60–180s) | Full | All sections animated |
| Email | 600×400px | PNG hero + link | No | 1 image |
| Pitch deck | 1920×1080px | Screenshot in slide | Slide builds | 1 per slide |
| PDF report | 300dpi | SVG/PNG in layout | No | 2–3 per page |

### Step 5.3 — Social Carousel Slide Map

| Slide | Content | Source Section |
|-------|---------|---------------|
| 1 | Title + hook stat | Section 1 |
| 2 | Source credibility card | Section 1 |
| 3 | Top ranked bars | Section 2 |
| 4 | Use case card #1 | Section 3 |
| 5 | Use case card #2 | Section 3 |
| 6 | Benchmark gauge or scale | Section 4 |
| 7 | Top blocker bars | Section 5 |
| 8 | Root cause flowchart | Section 5 |
| 9 | Forward momentum stats | Section 6 |
| 10 | Action checklist + CTA | Section 6 |

### Reference Files

| File | Location | When to Use |
|------|----------|-------------|
| Channel Strategy | `04-channel-strategy.md` | Full specs for all 8 channels |
| Resource Review | `03-resource-review-scoring.md` | Tool ratings and recommendations |

---

## PHASE 6 — QA

> **Goal**: Review every visual before publishing.

### Step 6.1 — Visual Quality Checklist

| # | Check | Pass? |
|---|-------|-------|
| 1 | Is every section led by a visual (chart, diagram, or card)? | ☐ |
| 2 | Is there zero paragraph text between sections? | ☐ |
| 3 | Does each visual have exactly ONE caption line? | ☐ |
| 4 | Are all bars ranked highest → lowest? | ☐ |
| 5 | Does the article use at least 3 different visual types? | ☐ |
| 6 | Is the root cause shown as a flowchart, not a paragraph? | ☐ |
| 7 | Is the CTA a checklist with time estimates, not a sentence? | ☐ |
| 8 | Can a founder get the key insight by looking at visuals only? | ☐ |
| 9 | Total text lines < 20? | ☐ |
| 10 | Every stat has source name + year + sample size? | ☐ |

### Step 6.2 — Editorial Quality Score

| Criteria | Score (1–5) |
|----------|-------------|
| Pain clarity — is the founder pain obvious in 5 seconds? | /5 |
| Data credibility — are sources named and sample sizes shown? | /5 |
| Workflow connection — does it touch a real daily task? | /5 |
| Scannability — can you get 80% of the value from visuals alone? | /5 |
| Honesty — does Section 5 show real failure reasons? | /5 |
| Actionability — is the CTA doable in one afternoon? | /5 |
| Language — zero banned words (revolutionary, leverage, paradigm)? | /5 |
| Visual logic — does each chart type match the data type? | /5 |
| Peer comparison — does Section 4 let founders find themselves? | /5 |
| Trust — would you share this on LinkedIn under your real name? | /5 |

**40+ → ship it. 30–39 → fix weak sections. Below 30 → rethink topic.**

### Step 6.3 — Premium Design Critique

Run the final output through `09-qa-premium-critique.md` for BCG-tier polish.

### Reference Files

| File | Location | When to Use |
|------|----------|-------------|
| QA & Premium Critique | `09-qa-premium-critique.md` | Final design audit before publish |
| Visual-First Template | `startupai-visual-first-template.md` | Master wireframe to check layout against |

---

## COMPLETE FILE INDEX

### System Documents (how the machine works)

| # | File | Purpose |
|---|------|---------|
| — | **This file** (`content-infographic-system.md`) | Master operating doc — start here |
| 00 | `00-global-style-spec.md` | Brand DNA — paste at top of every prompt |
| — | `startupai-infographic-article-template.md` | 6-section article structure + editorial rules + copy standards |
| — | `startupai-visual-first-template.md` | Visual-first wireframes + 70/20/10 ratio + component library |
| 20 | `20-chart-type-selector.md` | Chart type decision engine + anti-patterns + Flourish picker |
| — | `01-infographic-master-matrix.md` | 13 infographic types × animation × channel × tools |
| — | `04-channel-strategy.md` | One article → 8 channel formats workflow |
| — | `03-resource-review-scoring.md` | 23 tools/resources rated and ranked |

### Design Prompts (how to make each visual)

| # | File | Visual Type |
|---|------|------------|
| 01 | `01-statistical-dashboard.md` | KPI tiles, bars, donuts, gap bars |
| 02 | `02-process-howto.md` | Step-by-step flows, numbered processes |
| 03 | `03-comparison-split.md` | A vs B, split screen, gap visualization |
| 04 | `04-timeline-roadmap.md` | Milestones, fundraising stages, product roadmap |
| 05 | `05-flowchart-diagram.md` | Decision trees, system architecture, root cause |
| 06 | `06-informational-thought-leadership.md` | Editorial cards, frameworks, key points |
| 07 | `07-illustrated-visual-cards.md` | Icon packs, feature cards, background motifs |
| 08 | `08-remotion-motion-storyboard.md` | Static → animated video conversion |
| 09 | `09-qa-premium-critique.md` | Final design audit and polish |
| 10 | `10-gauge-speedometer.md` | Gauges, needle sweep, probability visualization |
| 11–19 | `02-infographic-type-prompts.md` | Animation prompts for all remaining types |

### Content (what to publish)

| # | File | Topic |
|---|------|-------|
| 01 | `infographic-content/01-the-226b-question.md` | Where AI money is going |
| 02 | `infographic-content/02-the-ai-adoption-gap.md` | What leaders want vs what they get |
| 03 | `infographic-content/03-ai-in-your-gtm-stack.md` | Where to start with AI in GTM |
| 04 | `infographic-content/04-the-10-20-70-rule.md` | Why AI fails at startups |
| 05 | `infographic-content/05-agentic-ai-next-wave.md` | Agentic AI for dev teams |
| 06 | `infographic-content/06-ai-dev-teams-top-vs-bottom.md` | Top vs bottom dev team AI usage |
| 07 | `infographic-content/07-startup-ai-stack.md` | The essential AI tool stack |
| 08 | `infographic-content/08-founders-ai-checklist.md` | Founders AI readiness checklist |

### Data Source

| File | What's Inside |
|------|--------------|
| `ai-startup-landscape-2026.md` | 127 startups, 5 data tables, 13 accelerators, key stats |

---

## QUICK START (new article in 30 minutes)

```
STEP 1 (5 min)  → Answer the 4 pre-flight questions
STEP 2 (5 min)  → Open chart type selector → pick chart per section
STEP 3 (5 min)  → Fill the section planner table
STEP 4 (5 min)  → Write the 5-sentence narrative arc
STEP 5 (5 min)  → Run the 10-rule anti-pattern check
STEP 6 (5 min)  → Copy the blank template from visual-first template

RESULT: Complete content brief ready for design phase.
```

---

## PRODUCTION CHECKLIST (use for every article)

```
☐ PHASE 1 — RESEARCH
  ☐ Pre-flight questions answered
  ☐ 2+ stats per section sourced
  ☐ All stats have source + year + n=

☐ PHASE 2 — PLAN
  ☐ Chart type selected per section
  ☐ Section planner filled
  ☐ Narrative arc written (5 sentences)
  ☐ Anti-pattern check passed (10/10)

☐ PHASE 3 — BUILD
  ☐ Global style spec pasted
  ☐ 6 section visuals designed
  ☐ 70/20/10 ratio maintained
  ☐ 3+ different visual types used

☐ PHASE 4 — ANIMATE
  ☐ Animation type assigned per section
  ☐ Flourish charts built with animation
  ☐ Video clips screen-recorded (if video)

☐ PHASE 5 — DISTRIBUTE
  ☐ Website embed live
  ☐ LinkedIn carousel exported
  ☐ Twitter thread drafted
  ☐ Email hero image exported
  ☐ Video edited (if applicable)

☐ PHASE 6 — QA
  ☐ 10-point visual checklist passed
  ☐ Editorial score 40+
  ☐ Premium critique reviewed
  ☐ Published
```
