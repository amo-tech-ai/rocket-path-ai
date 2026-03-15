---
task_id: AGN-06
title: Lean Canvas — Agency Enhancement
phase: P2
priority: P1
status: Draft
agents: [feedback-synthesizer, behavioral-nudge]
chat_modes: [canvas-coach.md]
edge_functions: [lean-canvas-agent, canvas-coach]
existing_components: [LeanCanvas, LeanCanvasGrid, CanvasBox, CanvasCoachChat, BoxSuggestionPopover]
schema_tables: [lean_canvases, documents, startups, validator_reports]
---

# Implementation Prompt

> Enhance the Lean Canvas (`src/pages/LeanCanvas.tsx`) with agency framework features. Load
> `canvas-coach.md` into the `canvas-coach` edge function via `loadChatMode()`. Add three UI elements:
> (1) specificity score per box (0-100%) with color-coded progress bars, (2) behavioral nudge cards
> that appear at key moments (progress milestones, session start, long pauses), (3) feedback synthesis
> indicators showing which boxes have evidence backing vs founder assumptions. Wire the Canvas Coach
> chat mode to provide box-by-box coaching with probing questions that sharpen vague statements into
> testable hypotheses. Update the AI panel to show canvas health dashboard.

---

## User Journey

```
Founder arrives from Validator Report ("Generate Canvas")
  OR opens Lean Canvas directly
     │
     ▼
[Canvas loads] ─── 9-box grid with existing content
     │                ├── Auto-populated from validator report (if available)
     │                └── Specificity scores computed per box
     ▼
[Canvas Health] ─── AI panel shows overall canvas status
     │                ├── 3 of 9 boxes strong (33%)
     │                ├── Weakest box highlighted: "Customer Segments"
     │                └── Nudge: "Founders who fill 6+ boxes raise 2x faster"
     ▼
[Coach Starts] ─── Canvas Coach engages on weakest box
     │               ├── "Your Customer Segments says 'small businesses'"
     │               ├── Probing: "How many employees? What industry?"
     │               └── Founder refines to specific testable segment
     ▼
[Box Updates] ─── Specificity improves per box
     │              ├── Before: "Small businesses" → 20% specific
     │              ├── After: "Independent restaurants, 1-3 locations,
     │              │          $500K-$2M revenue, food waste" → 85%
     │              └── Green check appears on box
     ▼
[Progress Nudge] ─── Behavioral nudge at milestone
     │                  ├── "3 boxes done → you're a third of the way!"
     │                  ├── "The Problem box is your strongest — build on it"
     │                  └── Loss frame: "67% of startups that skip Revenue
     │                       modeling run out of cash in 18 months"
     ▼
[Evidence Tags] ─── Each box item tagged by evidence type
     │                ├── [Cited] — backed by data from validator report
     │                ├── [Founder] — founder's own claim (needs testing)
     │                └── [AI] — AI-generated (lowest confidence)
     ▼
[Export] ─── Canvas with specificity overlay
               └── PDF/PNG shows scores + evidence types
```

---

## ASCII Wireframe — Desktop (3-Panel)

```
+--------------------------------------------------------------------------+
| [=] StartupAI                                         [?] [Bell] [AV]    |
+--------------------------------------------------------------------------+
|     |                                                  |                  |
| NAV | LEAN CANVAS                      [Save] [Export] | CANVAS COACH     |
| RAIL|                                                  |                  |
|     | ┌──── CANVAS HEALTH ─────────────────────────┐ | ┌──────────────┐ |
|     | │ ████████░░░ 44% complete │ 4/9 boxes strong │ | │ 🧩 COACH     │ |
|     | │ Weakest: Customer Segments (20%)            │ | │              │ |
|     | └────────────────────────────────────────────┘ | │ Your Customer│ |
|     |                                                  | │ Segments box │ |
|     | ┌─────────────┬─────────────┬──────────────┐   | │ says "small  │ |
|     | │ PROBLEM     │ SOLUTION    │ UVP          │   | │ businesses"  │ |
|     | │ ████████ 82%│ ██████░ 55% │ ████████ 78% │   | │ — too vague  │ |
|     | │             │             │              │   | │ to test.     │ |
|     | │ Dental      │ Predictive  │ "Cut no-shows│   | │              │ |
|     | │ clinics lose│ scheduling  │  by 40% with │   | │ Questions:   │ |
|     | │ 23% to no-  │ using AI +  │  zero manual │   | │ 1. How many  │ |
|     | │ shows —     │ patient     │  work"       │   | │    employees?│ |
|     | │ $50K/yr per │ history     │              │   | │ 2. What      │ |
|     | │ clinic      │             │ [Cited] ✓    │   | │    industry? │ |
|     | │ [Cited] ✓   │ [AI] ⚠     │              │   | │ 3. Revenue   │ |
|     | │ [✎] [✨]    │ [✎] [✨]    │ [✎] [✨]     │   | │    range?    │ |
|     | ├─────────────┼─────────────┤              │   | │ 4. What pain?│ |
|     | │ CUSTOMER    │ CHANNELS    │              │   | │              │ |
|     | │ ██░░░░ 20%  │ ████░░ 45%  │              │   | │ ────────────  │ |
|     | │ ⚠ WEAKEST   │             │              │   | │              │ |
|     | │             │ Content     │              │   | │ SPECIFICITY  │ |
|     | │ "Small      │ marketing,  │              │   | │ Customer:    │ |
|     | │ businesses" │ dental      │              │   | │ ██░░░░░░ 20% │ |
|     | │             │ associations│              │   | │              │ |
|     | │ [Founder] ? │ [Cited] ✓   │              │   | │ 💡 NUDGE     │ |
|     | │ [✎] [✨]    │ [✎] [✨]    │ [✎] [✨]     │   | │ "Founders    │ |
|     | ├─────────────┼─────────────┼──────────────┤   | │ who fill 6+  │ |
|     | │ KEY METRICS │ UNFAIR ADV  │ COST         │   | │ boxes raise  │ |
|     | │ ██████ 50%  │ ██████░ 60% │ ████░░ 40%   │   | │ 2x faster"   │ |
|     | │             │             │              │   | │              │ |
|     | │ No-show rate│ AI + patient│ $5K/mo       │   | │ ┌──────────┐ │ |
|     | │ 23%→5%,     │ history     │ cloud infra  │   | │ │ Coach me │ │ |
|     | │ Activation  │ data moat   │              │   | │ │ on this  │ │ |
|     | │ 60%+        │             │              │   | │ │ box      │ │ |
|     | │ [Founder] ? │ [AI] ⚠     │ [Founder] ?  │   | │ └──────────┘ │ |
|     | │ [✎] [✨]    │ [✎] [✨]    │ [✎] [✨]     │   | │              │ |
|     | ├─────────────┴─────────────┴──────────────┤   | │ ┌──────────┐ │ |
|     | │ REVENUE STREAMS                          │   | │ │ Generate │ │ |
|     | │ █████████ 72%                             │   | │ │ from     │ │ |
|     | │                                          │   | │ │ report   │ │ |
|     | │ SaaS: $299/mo per clinic, 3-tier pricing │   | │ └──────────┘ │ |
|     | │ Upsell: Premium analytics $99/mo         │   | │              │ |
|     | │ [Cited] ✓                       [✎] [✨] │   | └──────────────┘ |
|     | └──────────────────────────────────────────┘   |                  |
+--------------------------------------------------------------------------+
```

---

## ASCII Wireframe — Mobile (< 768px)

```
+----------------------------------+
| [=] StartupAI        [?] [Bell]  |
+----------------------------------+
|                                  |
| LEAN CANVAS         [Save] [AI]  |
|                                  |
| ████████░░░ 44% │ 4/9 strong    |
|                                  |
| [Prob] [Cust] [UVP] [Sol] ─tabs |
| [Chan] [Rev] [Cost] [Mtrc] [Adv]|
|                                  |
| ┌────────────────────────────┐  |
| │ PROBLEM         ████ 82%   │  |
| │                            │  |
| │ Dental clinics lose 23% to │  |
| │ no-shows — $50K/yr per     │  |
| │ clinic                     │  |
| │                            │  |
| │ [Cited] ✓  [✎ Edit] [✨ AI]│  |
| └────────────────────────────┘  |
|                                  |
| ┌────────────────────────────┐  |
| │ 💡 "Your Problem box is    │  |
| │ strong (82%) — now match   │  |
| │ it with specific customers"│  |
| └────────────────────────────┘  |
|                                  |
| ┌────────────────────────────┐  |
| │ [AI] Coach me on customers │  |
| └────────────────────────────┘  |
+----------------------------------+
```

---

## Content & Data

### Canvas Box (ENHANCED)

| Field | Source | Example |
|-------|--------|---------|
| `box_content` | `lean_canvases.canvas_data[box]` | "Independent restaurants, 1-3 locations..." |
| `specificity_score` | Computed by AI per box (NEW) | `82` (0-100) |
| `evidence_type` | Per-item tag (NEW) | `"cited"` / `"founder"` / `"ai"` |
| `coach_suggestions` | From `canvas-coach` (existing) | `["Add employee count", "Specify revenue range"]` |
| `citations` | From RAG (existing K3) | `["SaaS Playbook: dental market sizing"]` |

### Specificity Scoring

| Score Range | Color | Label | Meaning |
|-------------|-------|-------|---------|
| 80-100% | Green | Strong | Specific, testable, data-backed |
| 50-79% | Blue | Developing | Some specifics, needs more detail |
| 20-49% | Amber | Weak | Too vague to test or validate |
| 0-19% | Red | Empty/Generic | Placeholder or single word |

### Evidence Types

| Type | Badge | Source | Confidence |
|------|-------|--------|------------|
| Cited | `[Cited] ✓` green | Validator report data, RAG chunks | High — data-backed |
| Founder | `[Founder] ?` amber | Founder's own statement (unvalidated) | Medium — needs testing |
| AI | `[AI] ⚠` red | AI-generated suggestion | Low — hypothesis only |

### Behavioral Nudges

| Trigger | Nudge Type | Example |
|---------|-----------|---------|
| Session start | Progress anchor | "4 of 9 boxes filled — almost halfway!" |
| Box reaches 80% | Positive reinforcement | "Your Problem box is strong — build on it" |
| 3+ boxes strong | Social proof | "Founders who fill 6+ boxes raise 2x faster" |
| Revenue box empty | Loss frame | "67% of startups that skip Revenue modeling run out of cash" |
| Long pause (>5 min) | Gentle prompt | "Ready to work on the next box?" |
| Box downgraded | Constructive | "The edit made it less specific — add back the revenue range" |

### Canvas Health Dashboard

| Metric | Source | Example |
|--------|--------|---------|
| Overall progress | Avg of 9 specificity scores | "44% complete" |
| Boxes strong (80%+) | Count of high-scoring boxes | "4 of 9 strong" |
| Weakest box | Min specificity score | "Customer Segments (20%)" |
| Evidence mix | Ratio of cited/founder/AI items | "60% cited, 30% founder, 10% AI" |

---

## Agency Features — Before / After

| Feature | Before (current) | After (with agency) |
|---------|-------------------|---------------------|
| Box content | Plain text, no quality indicator | Specificity score (0-100%) per box |
| Evidence tracking | No distinction | Tagged: Cited (data) / Founder (claim) / AI (guess) |
| AI suggestions | Generic per-box suggestions | Coach-driven probing questions that sharpen specifics |
| Progress | Completion % (filled/empty) | Specificity-weighted progress with health dashboard |
| Nudges | None | Behavioral nudges at milestones, pauses, and risk points |
| Canvas Coach | Basic chat suggestions | Full coaching mode with box-by-box refinement loop |
| Report integration | Manual prefill | Auto-populate with evidence types from validator report |

---

## Agent & Fragment Wiring

```
canvas-coach/index.ts
  │
  └── INJECT: loadChatMode('canvas-coach')
        ├── Box Quality Checklist: 9 boxes × quality criteria
        │     ├── Problem: quantified impact, structural failure, evidence
        │     ├── Customer: persona name, revenue range, specific pain
        │     ├── UVP: concrete metric, testable claim, differentiated
        │     └── (6 more boxes with specific quality bars)
        ├── Per-Box Red Flags
        │     ├── "Small businesses" → too vague
        │     ├── "Everyone" → no segment
        │     ├── "AI-powered" → feature not benefit
        │     └── (per-box red flag patterns)
        ├── Probing Question Templates
        │     └── Open → Narrow → Quantify → Test pattern
        ├── Behavioral Nudges
        │     ├── Progress: milestone-based reinforcement
        │     ├── Social proof: "founders who X achieve Y"
        │     └── Loss frame: "startups that skip X face Y"
        └── OUTPUT: specificity_scores, evidence_types,
                    coach_suggestions, nudge_cards

lean-canvas-agent/index.ts
  │
  └── Uses canvas-coach output for:
        ├── generate_from_report: Auto-populate with evidence tags
        ├── suggest_box: Specificity-aware suggestions
        ├── validate_canvas: Health scoring across 9 boxes
        └── prefill_canvas: RAG-backed prefill with citations
```

---

## Workflows

| Trigger | AI Action | UI Update |
|---------|-----------|-----------|
| Canvas loads | Compute specificity per box | Colored progress bars on each box |
| Click "Coach me on this box" | Canvas Coach probes for specifics | Chat opens with targeted questions |
| Founder answers coach question | Update box content + re-score | Specificity bar improves, evidence tag added |
| Box reaches 80% | Positive nudge generated | Green check + "Strong" label on box |
| Revenue box empty >10 min | Loss-frame nudge | Amber card: "67% of startups that skip Revenue..." |
| Click "Generate from Report" | Map report dimensions to canvas boxes | Boxes populate with [Cited] evidence tags |
| Edit box content | Re-compute specificity | Bar animates to new score |
| Export canvas | Include specificity overlay | PDF shows scores + evidence types per box |
| 3+ boxes strong | Social proof nudge | "Founders who fill 6+ boxes raise 2x faster" |
