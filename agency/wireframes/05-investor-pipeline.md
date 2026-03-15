---
task_id: AGN-05
title: Investor Pipeline — Agency Enhancement
phase: P2
priority: P1
status: Draft
agents: [deal-strategist, pipeline-analyst, outbound-strategist]
fragments: [agency/prompts/crm-investor-fragment.md]
edge_functions: [investor-agent, crm-agent]
existing_components: [InvestorPipeline, InvestorCard, InvestorDetailSheet, DealPipeline]
schema_tables: [investors, contacts, deals, startups]
---

# Implementation Prompt

> Enhance the Investor Pipeline (`src/pages/Investors.tsx`) with agency framework features. Inject
> `crm-investor-fragment.md` into the `investor-agent` and `crm-agent` edge functions via `loadFragment()`.
> Add four UI elements: (1) MEDDPICC scorecard badge (/40) on each investor card with verdict color,
> (2) signal-based timing indicators showing when to engage each investor, (3) cold email anatomy
> builder following the proven framework (signal opener→value prop→social proof→CTA, under 120 words),
> (4) deal verdict badges (Strong/Battling/At Risk/Unqualified) on pipeline columns. Schema: add
> `meddpicc_score`, `deal_verdict`, `signal_data` to investors or deals table.

---

## User Journey

```
Founder opens Investor Pipeline (/investors)
     │
     ▼
[Pipeline loads] ─── Existing Kanban with 8 status columns
     │
     ▼
[Score Deals] ─── AI scores each deal with MEDDPICC
     │               ├── 8 dimensions × 5 points = /40
     │               ├── Verdict badge: Strong / Battling / At Risk / Unqualified
     │               └── Red flags surfaced per deal
     ▼
[Signal Timing] ─── AI monitors for engagement signals
     │                ├── Strong signal: Partner posted about your sector
     │                ├── Medium signal: Fund announced new thesis area
     │                └── Weak signal: General market activity
     ▼
[Cold Email] ─── Click "Draft Outreach" on any investor
     │              ├── Signal-based opener (references their recent activity)
     │              ├── Value prop (1 sentence, data-driven)
     │              ├── Social proof (traction metric or advisor name)
     │              ├── Low-friction CTA (15-min call, not full pitch)
     │              └── Under 120 words, no deck attached
     ▼
[Track] ─── Update deal status, AI re-scores
               └── Pipeline summary updates
```

---

## ASCII Wireframe — Desktop (3-Panel)

```
+--------------------------------------------------------------------------+
| [=] StartupAI                                         [?] [Bell] [AV]    |
+--------------------------------------------------------------------------+
|     |                                                  |                  |
| NAV | INVESTOR PIPELINE                [Kanban] [List] | AI PANEL         |
| RAIL|                                                  |                  |
|     | ┌─ PIPELINE SUMMARY ─────────────────────────┐  | ┌──────────────┐ |
|     | │ 8 investors │ 3 active │ Avg: 24/40         │  | │ PIPELINE     │ |
|     | │ [Strong:1] [Battling:2] [AtRisk:2] [Unq:3] │  | │ HEALTH       │ |
|     | └────────────────────────────────────────────┘  | │              │ |
|     |                                                  | │ Avg Score:   │ |
|     | ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    | │ 24/40        │ |
|     | │RESEARCH│ │REACHED │ │MEETING │ │PARTNER │    | │              │ |
|     | │  OUT   │ │  OUT   │ │  SET   │ │ENGAGED │    | │ ⚠ Red Flags: │ |
|     | │        │ │        │ │        │ │        │    | │ • No compel- │ |
|     | │┌──────┐│ │┌──────┐│ │┌──────┐│ │┌──────┐│   | │   ling event │ |
|     | ││Sequoia││ ││Angel ││ ││Light-││ ││ a16z ││   | │   on 3 deals │ |
|     | ││      ││ ││Fund  ││ ││speed ││ ││      ││   | │ • Single-    │ |
|     | ││14/40 ││ ││18/40 ││ ││28/40 ││ ││34/40 ││   | │   threaded   │ |
|     | ││[UNQF]││ ││[RISK]││ ││[BTTL]││ ││[STRG]││   | │   on 2 deals │ |
|     | ││      ││ ││      ││ ││      ││ ││      ││   | │              │ |
|     | ││Signal:││ ││Signal:││ ││Signal:││ ││Signal:││  | │ ────────────  │ |
|     | ││ None ││ ││ Weak ││ ││Strong││ ││Strong││   | │              │ |
|     | ││      ││ ││      ││ ││      ││ ││      ││   | │ SIGNALS      │ |
|     | ││[Email]││ ││[Email]││ ││[Prep]││ ││[Close]││  | │              │ |
|     | │└──────┘│ │└──────┘│ │└──────┘│ │└──────┘│   | │ 🟢 a16z:     │ |
|     | │        │ │        │ │        │ │        │    | │ GP posted    │ |
|     | │┌──────┐│ │┌──────┐│ │        │ │        │    | │ about AI     │ |
|     | ││YC    ││ ││Other ││ │        │ │        │    | │ infra thesis │ |
|     | ││      ││ ││VC    ││ │        │ │        │    | │              │ |
|     | ││ 8/40 ││ ││20/40 ││ │        │ │        │    | │ 🟡 Light-    │ |
|     | ││[UNQF]││ ││[RISK]││ │        │ │        │    | │ speed: Fund  │ |
|     | │└──────┘│ │└──────┘│ │        │ │        │    | │ announced    │ |
|     | └────────┘ └────────┘ └────────┘ └────────┘    | │ AI focus     │ |
|     |                                                  | │              │ |
|     | ──── COLD EMAIL BUILDER ──────────────────────  | │ ┌──────────┐ │ |
|     | ┌────────────────────────────────────────────┐  | │ │ Score    │ │ |
|     | │ To: partner@lightspeed.com                 │  | │ │ all      │ │ |
|     | │                                            │  | │ │ deals    │ │ |
|     | │ Subject: your enterprise AI thesis,        │  | │ └──────────┘ │ |
|     | │          extended                          │  | │              │ |
|     | │                                            │  | │ ┌──────────┐ │ |
|     | │ [Signal] Saw your post on AI infra for     │  | │ │ Draft    │ │ |
|     | │ enterprise — we're building exactly this.   │  | │ │ outreach │ │ |
|     | │                                            │  | │ └──────────┘ │ |
|     | │ [Value] DentAI cuts dental no-shows by 40% │  | │              │ |
|     | │ with predictive scheduling. 3 pilot clinics │  | │ ┌──────────┐ │ |
|     | │ saved $50K/year each.                      │  | │ │ Pipeline │ │ |
|     | │                                            │  | │ │ review   │ │ |
|     | │ [Proof] Dr. Chen at Smile Dental is our    │  | │ └──────────┘ │ |
|     | │ reference customer.                        │  | │              │ |
|     | │                                            │  | └──────────────┘ |
|     | │ [CTA] Worth 15 minutes next Tuesday?       │  |                  |
|     | │                                            │  |                  |
|     | │ 87 words ✓  [Copy] [Edit] [Regenerate]    │  |                  |
|     | └────────────────────────────────────────────┘  |                  |
+--------------------------------------------------------------------------+
```

---

## ASCII Wireframe — Mobile (< 768px)

```
+----------------------------------+
| [=] StartupAI        [?] [Bell]  |
+----------------------------------+
|                                  |
| INVESTOR PIPELINE    [+] [AI]    |
|                                  |
| Pipeline: [Strong:1] [Bttl:2]   |
|           [Risk:2] [Unq:3]      |
|                                  |
| [Research▾] ─── column select   |
|                                  |
| ┌────────────────────────────┐  |
| │ a16z                       │  |
| │ MEDDPICC: 34/40 [STRONG]  │  |
| │ 🟢 Signal: GP posted AI   │  |
| │ [Close] [Draft Email]     │  |
| └────────────────────────────┘  |
|                                  |
| ┌────────────────────────────┐  |
| │ Lightspeed                 │  |
| │ MEDDPICC: 28/40 [BATTLING]│  |
| │ 🟡 Signal: AI focus fund  │  |
| │ [Prep Meeting] [Email]    │  |
| └────────────────────────────┘  |
|                                  |
| ┌────────────────────────────┐  |
| │ Sequoia                    │  |
| │ MEDDPICC: 14/40 [UNQUALFD]│  |
| │ ⚪ Signal: None            │  |
| │ [Drop] [Request GP Intro] │  |
| └────────────────────────────┘  |
|                                  |
| ┌────────────────────────────┐  |
| │ [AI] Review my pipeline    │  |
| └────────────────────────────┘  |
+----------------------------------+
```

---

## Content & Data

### Investor Card (ENHANCED)

| Field | Source | Example |
|-------|--------|---------|
| `name` | `investors.name` | "Lightspeed Venture Partners" |
| `meddpicc_score` | `investors.meddpicc_score` (NEW) | `28` |
| `deal_verdict` | `investors.deal_verdict` (NEW) | `"strong"` / `"battling"` / `"at_risk"` / `"unqualified"` |
| `signal_data` | `investors.signal_data` (NEW) | `{type, description, source, strength, date}` |
| `check_size` | `investors.check_size` | "$2M-$10M" |
| `status` | `investors.status` | "meeting_set" |

### MEDDPICC Scoring

| Dimension | Max | Scoring Criteria |
|-----------|-----|-----------------|
| Metrics | 5 | Quantified success criteria defined |
| Economic Buyer | 5 | Direct access to check-writer |
| Decision Criteria | 5 | Evaluation framework known |
| Decision Process | 5 | Steps + timeline to close mapped |
| Paper Process | 5 | Legal/admin path clear |
| Identify Pain | 5 | Pain acknowledged by investor |
| Champion | 5 | Internal advocate actively pushing |
| Compelling Event | 5 | Why now — deadline or trigger exists |

### Deal Verdict Badges

| Verdict | Score Range | Color | Badge | Recommended Action |
|---------|------------|-------|-------|-------------------|
| Strong | 32-40 | Green | `bg-green-100 text-green-700` | Close — respond within 24h |
| Battling | 24-31 | Blue | `bg-blue-100 text-blue-700` | Push — request next concrete step |
| At Risk | 16-23 | Amber | `bg-amber-100 text-amber-700` | Rescue — find champion or compelling event |
| Unqualified | 0-15 | Red | `bg-red-100 text-red-700` | Stop — reallocate time |

### Signal Timing

| Signal Strength | Indicator | Source | Action Timing |
|----------------|-----------|--------|---------------|
| Strong | 🟢 Green dot | Partner posted about your sector, fund announced thesis match | Within 24h — reference signal in outreach |
| Medium | 🟡 Yellow dot | Fund announced adjacent thesis, portfolio company in space | Within 1 week — warm intro preferred |
| Weak | ⚪ Gray dot | General market activity, no direct signal | Low priority — wait for stronger signal |
| None | No dot | No recent activity detected | Deprioritize — focus elsewhere |

### Cold Email Anatomy

| Section | Max Length | Purpose | Example |
|---------|-----------|---------|---------|
| Subject | 5-8 words | Signal-based hook, lowercase | "your enterprise AI thesis, extended" |
| Signal Opener | 1-2 sentences | Reference their activity | "Saw your post on AI infra..." |
| Value Prop | 1-2 sentences | Data-driven outcome | "DentAI cuts no-shows by 40%" |
| Social Proof | 1 sentence | Traction or reference | "Dr. Chen at Smile Dental is our reference" |
| CTA | 1 sentence | Low-friction ask | "Worth 15 minutes next Tuesday?" |
| **Total** | **Under 120 words** | **No deck attached** | |

---

## Agency Features — Before / After

| Feature | Before (current) | After (with agency) |
|---------|-------------------|---------------------|
| Investor cards | Name + stage + check size | Name + MEDDPICC /40 + verdict badge + signal dot |
| Pipeline view | 8 columns, no scoring | 8 columns with verdict-colored headers |
| Deal assessment | Manual status updates | MEDDPICC-scored with specific dimension gaps |
| Outreach | Blank compose box | Signal-based cold email anatomy (4 sections, <120 words) |
| Timing | No guidance on when to engage | Signal-based timing indicators (strong/medium/weak) |
| Pipeline review | No aggregate analysis | Summary stats + red flags + reallocation recommendations |
| Prioritization | Manual ordering | Verdict-based: close Strong, push Battling, drop Unqualified |

---

## Agent & Fragment Wiring

```
investor-agent/index.ts
  │
  └── INJECT: loadFragment('crm-investor-fragment')
        ├── MEDDPICC Scoring: 8 dimensions × 5 = /40
        │     ├── Adapted for fundraising (not enterprise sales)
        │     ├── Economic Buyer = check-writer (GP, not associate)
        │     └── Compelling Event = fund timeline, demo day, market shift
        ├── Signal-Based Timing
        │     ├── Strong: partner activity in your sector (24h window)
        │     ├── Medium: fund thesis alignment (1-week window)
        │     └── Weak: general market (deprioritize)
        ├── Cold Email Anatomy
        │     ├── Under 120 words, no deck
        │     ├── Signal opener → value prop → social proof → CTA
        │     └── Subject line: lowercase, 5-8 words, signal-based
        └── OUTPUT: investors[].meddpicc_score, .deal_verdict,
                    .signal_data, email drafts

crm-agent/index.ts
  │
  └── INJECT: loadFragment('crm-investor-fragment')
        ├── Deal scoring (same MEDDPICC framework)
        ├── Pipeline health aggregation
        └── Contact enrichment with investor context
```

---

## Workflows

| Trigger | AI Action | UI Update |
|---------|-----------|-----------|
| Click "Score all deals" | `investor-agent` MEDDPICC-scores each deal | Verdict badges appear on all cards |
| Click investor card | Show MEDDPICC breakdown | Detail sheet shows 8-dim scores |
| Click "Draft Outreach" | Generate signal-based cold email | Email builder opens below pipeline |
| New signal detected | Signal strength computed | Green/yellow dot appears on card |
| Deal status change | Re-score MEDDPICC | Verdict badge updates, pipeline summary refreshes |
| Click "Pipeline Review" | Aggregate analysis in AI panel | Summary stats + red flags + recommendations |
| Verdict = Unqualified | AI suggests deprioritize | Red badge + "Consider dropping" label |
| Verdict = Strong | AI suggests close actions | Green badge + "Respond within 24h" label |
