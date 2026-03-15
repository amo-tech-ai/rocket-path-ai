---
task_id: AGN-01
title: Validator Report — Agency Enhancement
phase: P2
priority: P1
status: Draft
agents: [validator-scoring-fragment, validator-composer-fragment]
fragments: [agency/prompts/validator-scoring-fragment.md, agency/prompts/validator-composer-fragment.md]
edge_functions: [validator-start]
existing_components: [ReportV2Layout, ReportHeroLuxury, StrategicSummary, DimensionPage]
schema_tables: [validator_reports, validation_sessions, startups]
---

# Implementation Prompt

> Enhance the existing Validator Report (`src/components/validator/report/ReportV2Layout.tsx`) with agency
> framework features. Inject `validator-scoring-fragment.md` into the Scoring Agent and
> `validator-composer-fragment.md` into the Composer Agent via `agency/lib/agent-loader.ts`. Add three UI
> elements: (1) evidence tier badges on each dimension score, (2) bias flag warnings below the executive
> summary, (3) ICE-scored channel recommendations in the Strategy tab. No new pages — enhance existing
> components. Wire `loadFragment()` into `supabase/functions/validator-start/pipeline.ts`.

---

## User Journey

```
Founder completes chat interview (01-VCHAT)
     │
     ▼
Pipeline runs 7 agents (60-120s)
     │  ├── Scoring Agent: dimensions scored with EVIDENCE TIERS
     │  ├── Scoring Agent: BIAS FLAGS detected and surfaced
     │  ├── Scoring Agent: RICE-scored priority actions
     │  └── Composer Agent: THREE-ACT narrative + WIN THEMES + ICE channels
     ▼
Report loads with enhanced data
     ├── Executive Summary: Three-act narrative (market → solution → outcome)
     ├── Score Card: Evidence tier badges per dimension
     ├── Bias Warnings: Amber cards below exec summary
     ├── Strategy Tab: ICE-scored growth channels
     └── Priority Actions: RICE-scored with effort/timeframe badges
```

---

## ASCII Wireframe — Desktop (3-Panel)

```
+--------------------------------------------------------------------------+
| [=] StartupAI                                         [?] [Bell] [AV]    |
+--------------------------------------------------------------------------+
|     |                                                  |                  |
| NAV | MAIN CONTENT                                     | AI PANEL (360px) |
| RAIL|                                                  |                  |
|     | ┌──────────────────────────────────────────────┐ | ┌──────────────┐ |
|     | │  EXECUTIVE SUMMARY — Three-Act Narrative     │ | │ Score: 72    │ |
|     | │                                              │ | │ Verdict: GO  │ |
|     | │  Act 1: "$32B dental software market         │ | │              │ |
|     | │  growing 12%/yr. Clinics still manage         │ | │ Win Themes:  │ |
|     | │  scheduling manually — 23% no-show rate."    │ | │ ┌──────────┐ │ |
|     | │                                              │ | │ │ AI cuts  │ │ |
|     | │  Act 2: "DentAI uses predictive scheduling   │ | │ │ no-shows │ │ |
|     | │  to reduce no-shows by 40%. Dr. Chen at      │ | │ │ by 40%   │ │ |
|     | │  Smile Dental saved 8 hrs/week."             │ | │ └──────────┘ │ |
|     | │                                              │ | │ ┌──────────┐ │ |
|     | │  Act 3: "72/100 — GO. Validate pricing with  │ | │ │ First to │ │ |
|     | │  5 clinic managers this week."                │ | │ │ vertical │ │ |
|     | │                                              │ | │ └──────────┘ │ |
|     | └──────────────────────────────────────────────┘ | │              │ |
|     |                                                  | │ [Chat|Rsch|  │ |
|     | ┌──────────── BIAS WARNINGS ───────────────────┐ | │  Plan]       │ |
|     | │ [⚠] Anchoring Bias: TAM anchored to founder  │ | │              │ |
|     | │     estimate without bottom-up validation     │ | │ ┌──────────┐ │ |
|     | │     Affects: Market, Revenue                  │ | │ │ Explain  │ │ |
|     | │ [⚠] Optimism Bias: Revenue projections 3x    │ | │ │ my score │ │ |
|     | │     above industry median                     │ | │ └──────────┘ │ |
|     | └──────────────────────────────────────────────┘ | │ ┌──────────┐ │ |
|     |                                                  | │ │ Biggest  │ │ |
|     | DIMENSION SCORES (with evidence tiers)           | │ │ risks?   │ │ |
|     | ┌──────────────────────────────────────────────┐ | │ └──────────┘ │ |
|     | │                                              │ | │ ┌──────────┐ │ |
|     | │  Problem    ████████████████░░  82  [Cited]  │ | │ │ Generate │ │ |
|     | │  Customer   ██████████████░░░░  71  [Claim]  │ | │ │ Canvas   │ │ |
|     | │  Market     █████████████░░░░░  65  [AI ⚠]  │ | │ └──────────┘ │ |
|     | │  Defense    ████████████░░░░░░  60  [Claim]  │ | │              │ |
|     | │  Revenue    ██████████░░░░░░░░  52  [AI ⚠]  │ | │ ┌──────────┐ │ |
|     | │  AI         ████████████████░░  80  [Cited]  │ | │ │Type here │ │ |
|     | │  Execution  █████████████░░░░░  68  [Claim]  │ | │ └──────────┘ │ |
|     | │  Validation ████████░░░░░░░░░░  45  [AI ⚠]  │ | └──────────────┘ |
|     | │                                              │ |                  |
|     | │  Legend: [Cited]=1.0x [Claim]=0.8x [AI⚠]=0.6x│ |                  |
|     | └──────────────────────────────────────────────┘ |                  |
|     |                                                  |                  |
|     | TABS: [Overview] [Strategy] [Dimensions] [PDF]   |                  |
|     |                                                  |                  |
|     | ──── STRATEGY TAB ────────────────────────────── |                  |
|     |                                                  |                  |
|     | PRIORITY ACTIONS (RICE-scored)                    |                  |
|     | ┌──────────────────────────────────────────────┐ |                  |
|     | │ #1  Interview 5 clinic managers on pricing   │ |                  |
|     | │     RICE: 12.0  [1 week] [Low effort]  [→]  │ |                  |
|     | │                                              │ |                  |
|     | │ #2  Run landing page conversion test         │ |                  |
|     | │     RICE: 9.6   [2 weeks] [Med effort] [→]  │ |                  |
|     | │                                              │ |                  |
|     | │ #3  Define AI scheduling moat vs competitors │ |                  |
|     | │     RICE: 8.0   [1 week] [Low effort]  [→]  │ |                  |
|     | └──────────────────────────────────────────────┘ |                  |
|     |                                                  |                  |
|     | GROWTH CHANNELS (ICE-scored, stage: Pre-PMF)     |                  |
|     | ┌──────────────────────────────────────────────┐ |                  |
|     | │ #1  Content: "Dental practice management"    │ |                  |
|     | │     ICE: 720  Time: 4-6 weeks  Prereq: blog │ |                  |
|     | │                                              │ |                  |
|     | │ #2  Partnerships: Local dental associations  │ |                  |
|     | │     ICE: 540  Time: 8 weeks  Prereq: LOI    │ |                  |
|     | │                                              │ |                  |
|     | │ #3  Community: r/dentistry, dental forums    │ |                  |
|     | │     ICE: 480  Time: 2-3 weeks  Prereq: none │ |                  |
|     | │                                              │ |                  |
|     | │ ⚠ Stage Pre-PMF: Avoid paid ads, programmatic│ |                  |
|     | └──────────────────────────────────────────────┘ |                  |
|     |                                                  |                  |
|     | [Start Next Sprint]  [Generate Canvas]  [PDF]    |                  |
+--------------------------------------------------------------------------+
```

---

## ASCII Wireframe — Mobile (< 768px)

```
+----------------------------------+
| [=] StartupAI        [?] [Bell]  |
+----------------------------------+
|                                  |
| EXECUTIVE SUMMARY                |
| ═══════════════                  |
|                                  |
| "$32B dental market growing      |
|  12%/yr..."                      |
|                                  |
| "DentAI reduces no-shows by      |
|  40%..."                         |
|                                  |
| "72/100 — GO. Validate pricing   |
|  with 5 clinic managers."        |
|                                  |
| ┌────── BIAS WARNINGS ────────┐ |
| │ [⚠] Anchoring: TAM from     │ |
| │     founder estimate only    │ |
| └──────────────────────────────┘ |
|                                  |
| SCORES                           |
| Problem    ████████████░░  82 C  |
| Customer   ██████████░░░░  71 F  |
| Market     █████████░░░░░  65 A  |
| Revenue    ██████░░░░░░░░  52 A  |
|  C=Cited  F=Founder  A=AI       |
|                                  |
| [Overview] [Strategy] [Dims]     |
|                                  |
| PRIORITY ACTIONS                 |
| 1. Interview 5 clinics RICE:12.0 |
| 2. Landing page test   RICE:9.6  |
|                                  |
| CHANNELS (Pre-PMF)               |
| 1. Content (ICE:720)             |
| 2. Partnerships (ICE:540)        |
|                                  |
| [Sprint] [Canvas] [PDF]         |
|                                  |
| ┌────────────────────────────┐  |
| │ [AI] Ask about your report │  |
| └────────────────────────────┘  |
+----------------------------------+
```

---

## Content & Data

### Evidence Tier Badges (NEW)

| Field | Source | Example |
|-------|--------|---------|
| `evidence_tier` | `details.scores_matrix[dim].evidence_tier` | `"cited"` / `"claim"` / `"ai_only"` |
| `confidence_weight` | Computed from tier | `1.0` / `0.8` / `0.6` |
| Badge color | Computed | Green (cited), Amber (claim), Red (AI) |

### Bias Flags (NEW)

| Field | Source | Example |
|-------|--------|---------|
| `bias_flags` | `details.bias_flags[]` | `[{type, description, affected_dimensions}]` |
| `type` | Enum | `"confirmation"` / `"survivorship"` / `"anchoring"` / `"optimism"` |
| Display | Amber warning cards | Max 3 on overview, full list in risks |

### Three-Act Executive Summary (ENHANCED)

| Field | Source | Example |
|-------|--------|---------|
| `executive_summary` | `details.executive_summary` | Three-act narrative string |
| `win_themes` | `details.win_themes[]` | `["AI reduces no-shows by 40%", "First dental-vertical AI"]` |
| Act detection | Client-side paragraph split | Acts 1/2/3 by paragraph order |

### ICE Growth Channels (NEW)

| Field | Source | Example |
|-------|--------|---------|
| `growth_channels` | `details.growth_channels[]` | `[{name, ice_score, time_to_result, prerequisites}]` |
| `stage` | `startups.traction_data.stage` | `"pre_pmf"` |
| Stage warning | Computed from stage | "Avoid paid ads at this stage" |

### RICE Priority Actions (ENHANCED)

| Field | Source | Example |
|-------|--------|---------|
| `priority_actions` | `details.priority_actions[]` | `[{action, rice_score, timeframe, effort, dimension}]` |
| `rice_score` | Computed: (R×I×C)/E | `12.0` |
| Import to Sprint | `useSprintImport` hook | One-click to sprint board |

---

## Agency Features — Before / After

| Feature | Before (current) | After (with agency) |
|---------|-------------------|---------------------|
| Executive Summary | Single paragraph, often generic | Three-act narrative with market→solution→outcome arc |
| Dimension Scores | Raw numbers 0-100 | Numbers + evidence tier badge (Cited/Claim/AI) |
| Bias Detection | None | 4 bias types flagged with affected dimensions |
| Priority Actions | Text list with timeframe | RICE-scored with numeric score, ranked globally |
| Growth Channels | Not present | ICE-scored channels matched to startup stage |
| Win Themes | Not present | 2-3 recurring strengths surfaced in AI panel |
| Next Steps Framing | Passive list | Momentum-sequenced: micro-wins first, loss framing for urgency |

---

## Agent & Fragment Wiring

```
validator-start/pipeline.ts
  │
  ├── Scoring Agent
  │     └── INJECT: loadFragment('validator-scoring-fragment')
  │           ├── Evidence tier scoring (cited=1.0, claim=0.8, AI=0.6)
  │           ├── RICE priority actions formula
  │           ├── Bias detection (4 types)
  │           └── OUTPUT: scores_matrix[dim].evidence_tier, bias_flags[], priority_actions[].rice_score
  │
  └── Composer Agent
        └── INJECT: loadFragment('validator-composer-fragment')
              ├── Three-act narrative structure
              ├── Win theme extraction (2-3 themes)
              ├── ICE growth channels by stage
              ├── Behavioral framing for next steps
              └── OUTPUT: executive_summary (3-act), win_themes[], growth_channels[]
```

---

## Workflows

| Trigger | AI Action | UI Update |
|---------|-----------|-----------|
| Pipeline completes | Scoring agent returns evidence tiers | Tier badges appear on dimension bars |
| Pipeline completes | Scoring agent returns bias flags | Amber warning cards below exec summary |
| Pipeline completes | Composer returns three-act summary | Executive summary renders 3 paragraphs |
| Pipeline completes | Composer returns ICE channels | Channel cards in Strategy tab |
| User clicks "Start Next Sprint" | `useSprintImport` maps RICE actions to tasks | Navigate to Sprint Board |
| User clicks "Generate Canvas" | `lean-canvas-agent.generate_from_report` | Navigate to Lean Canvas |
| User clicks evidence badge | Expand evidence detail | Popover with source + confidence |
| User clicks bias warning | AI panel explains bias | Chat shows remediation steps |
