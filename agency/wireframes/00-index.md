# Agency-Enhanced Wireframes — Index

> **Version:** 1.0 | **Date:** 2026-03-12
> **Location:** `agency/wireframes/`
> **Source:** 132-agent agency-agents library → 27 curated files → 6 screens

---

## Screen Map

```
VALIDATOR REPORT ──→ SPRINT BOARD ──→ LEAN CANVAS
(01-validator)       (02-sprint)       (06-lean-canvas)
  Three-act            RICE scoring      Canvas Coach
  Evidence tiers       Kano classify     Nudges
  Bias flags           Momentum seq      Feedback synth
  ICE channels

PITCH DECK EDITOR    AI CHAT (4 modes)  INVESTOR PIPELINE
(03-pitch-deck)      (04-ai-chat)       (05-investor)
  Win themes           Practice Pitch     MEDDPICC /40
  Challenger           Growth Strategy    Signal timing
  Persuasion arch      Deal Review        Cold email anatomy
                       Canvas Coach
```

---

## Agency → Screen Wiring

### Prompt Fragments → Edge Functions → Screens

| Fragment | Edge Function | Screen | What It Adds |
|----------|--------------|--------|--------------|
| `validator-scoring-fragment.md` | `validator-start` (scoring agent) | Validator Report | Evidence tiers, RICE actions, bias detection |
| `validator-composer-fragment.md` | `validator-start` (composer agent) | Validator Report | Three-act narrative, win themes, ICE channels |
| `crm-investor-fragment.md` | `investor-agent`, `crm-agent` | Investor Pipeline | MEDDPICC /40, signal timing, email anatomy |
| `sprint-agent-fragment.md` | `sprint-agent` | Sprint Board | RICE scoring, Kano tags, momentum sequencing |
| `pitch-deck-fragment.md` | `pitch-deck-agent` | Pitch Deck Editor | Win themes, Challenger narrative, persuasion |

### Chat Mode Prompts → AI Chat Screen

| Chat Mode | Source Skills | Session Type |
|-----------|-------------|--------------|
| `practice-pitch.md` | sales-coach, deal-strategist | Pitch scoring (5 dims × 10), re-delivery loop |
| `growth-strategy.md` | growth-hacker | AARRR diagnosis, ICE experiments, channel recs |
| `deal-review.md` | deal-strategist, pipeline-analyst | MEDDPICC pipeline inspection, verdict badges |
| `canvas-coach.md` | feedback-synthesizer, behavioral-nudge | Box-by-box coaching, specificity scoring |

### Domain Skills → Background Knowledge

| Skill | Used By | Purpose |
|-------|---------|---------|
| `growth-hacker/` | Composer Group C, AI Chat growth mode | Channel recs, funnel diagnosis |
| `deal-strategist/` | investor-agent, CRM deal scoring | MEDDPICC framework |
| `sprint-prioritizer/` | sprint-agent, Composer Group D | RICE + Kano + momentum |
| `outbound-strategist/` | crm-agent, investor outreach | Signal timing, email templates |
| `feedback-synthesizer/` | Scoring Agent, Canvas Coach | Evidence weighting |
| `behavioral-nudge/` | Dashboard, Sprint Board, Canvas Coach | Momentum patterns |
| `sales-coach/` | AI Chat practice-pitch | Pitch scoring methodology |
| `proposal-strategist/` | pitch-deck-agent, Composer exec summary | Win themes, narrative |

---

## User Journeys

### Journey 1: Sarah Validates Her Idea

```
Sarah describes her B2B dental SaaS
     │
     ▼
[Validator Chat] ─── AI asks 12 follow-up questions
     │                  ├── Coverage scores build (0→100%)
     │                  └── Context panel shows extracted fields
     ▼
[Pipeline Runs] ─── 7 agents (60-120s)
     │                  ├── Scoring uses EVIDENCE TIERS (cited=1.0, claim=0.8, AI=0.6)
     │                  ├── BIAS FLAGS surface (anchoring on founder TAM)
     │                  └── RICE-scored priority actions generated
     ▼
[Validator Report] ─── Three-act executive summary
     │                  ├── Act 1: $32B dental software market growing 12%
     │                  ├── Act 2: Sarah's AI scheduling vs. manual status quo
     │                  ├── Act 3: 72/100 GO — "Interview 5 clinic managers this week"
     │                  ├── Win themes: "AI reduces no-shows by 40%"
     │                  ├── ICE-scored channels: Content (ICE 720) > Partnerships (540)
     │                  └── Bias warning: "TAM anchored to founder estimate"
     ▼
[Sprint Board] ─── Priority actions imported as tasks
     │                  ├── RICE-scored (Quick Win: "Interview 5 clinics" = 12.0)
     │                  ├── Kano-tagged (Must-Have / Performance / Delighter)
     │                  └── Sprint 1 starts with quick win for momentum
     ▼
[Lean Canvas] ─── Auto-generated from report
                        ├── Canvas Coach refines "Customer: businesses" → specific segment
                        └── Nudge: "3 of 9 boxes strong — you're a third done"
```

### Journey 2: Aisha Reviews Her Investor Pipeline

```
Aisha has 8 investor conversations in CRM
     │
     ▼
[AI Chat: Deal Review] ─── Selects "Deal Review" mode
     │                       ├── AI asks: "Walk me through your top 3 deals"
     │                       └── Pulls CRM data for each investor
     ▼
[MEDDPICC Scoring] ─── Each deal scored /40
     │                    ├── Sequoia: 14/40 UNQUALIFIED (single-threaded to associate)
     │                    ├── Lightspeed: 28/40 BATTLING (partner engaged, no paper)
     │                    └── a16z: 34/40 STRONG (GP championing, term sheet started)
     ▼
[Investor Pipeline] ─── Kanban with verdict badges
     │                    ├── Red flags surfaced: "No compelling event" on 3 deals
     │                    ├── Signal timing: "Lightspeed partner posted about AI infra"
     │                    └── Recommended: Stop Sequoia, push a16z to close
     ▼
[Cold Email] ─── AI generates signal-based outreach
                   ├── Subject: "your enterprise AI thesis, extended"
                   ├── Body: Signal opener → value prop → social proof → low-friction CTA
                   └── Under 120 words, no deck attached
```

### Journey 3: Jake Plans Growth Experiments

```
Jake has 500 signups, 12% activation, no revenue
     │
     ▼
[AI Chat: Growth Strategy] ─── Selects "Growth Strategy" mode
     │                          ├── AI asks: "What are your current numbers?"
     │                          └── Diagnoses: "Activation is your bottleneck"
     ▼
[AARRR Diagnosis] ─── Funnel analysis
     │                  ├── Acquisition: OK (500 signups)
     │                  ├── Activation: 12% (RED — healthy is 60%+)
     │                  ├── Retention: Unknown
     │                  └── AI says: "Fix activation before acquiring more users"
     ▼
[Experiment Design] ─── 3 experiments ranked by ICE
     │                    ├── #1: Reduce onboarding 7→3 steps (ICE: 720)
     │                    │       Hypothesis: "Activation improves from 12% to 25%"
     │                    │       Timeline: 2 weeks, Cost: $0
     │                    ├── #2: Add welcome email series (ICE: 480)
     │                    └── #3: In-app tooltips (ICE: 360)
     ▼
[Sprint Board] ─── Experiment #1 becomes Sprint 1 tasks
                     ├── "Audit current onboarding flow" (Quick Win, Day 1)
                     ├── "Redesign 3-step onboarding" (Big Bet, Days 2-8)
                     └── "A/B test old vs new" (Performance, Days 9-14)
```

### Journey 4: Priya Practices Her Pitch

```
Priya has AI supply chain startup, preparing for investor meetings
     │
     ▼
[AI Chat: Practice Pitch] ─── Selects "Practice Pitch" mode
     │                          ├── AI says: "Deliver your 60-second elevator pitch"
     │                          └── Priya delivers
     ▼
[Pitch Scoring] ─── 5 dimensions × 10 points
     │                ├── Clarity: 8/10
     │                ├── Urgency: 4/10 (WEAK — "no cost of inaction")
     │                ├── Differentiation: 7/10
     │                ├── The Ask: 6/10
     │                ├── Confidence: 7/10
     │                └── Total: 32/50
     ▼
[Coaching] ─── AI focuses on weakest dimension (Urgency)
     │           ├── "When you said 'supply chains are inefficient,' replace with
     │           │    '$2.3M/year in excess inventory — we cut that by 60% in 90 days'"
     │           └── "Now deliver it again with the new language"
     ▼
[Re-delivery] ─── Priya re-delivers with quantified urgency
     │              ├── New score: 41/50 (+9 points)
     │              └── Urgency: 4→8/10
     ▼
[Assignment] ─── "Practice this version 3 times before your Lightspeed meeting"
```

---

## Wireframe Files

| # | File | Screen | Route | Status |
|---|------|--------|-------|--------|
| 01 | `01-validator-report.md` | Validator Report (enhanced) | `/validator/report/:id` | Draft |
| 02 | `02-sprint-board.md` | Sprint Board (enhanced) | `/sprint-plan` | Draft |
| 03 | `03-pitch-deck-editor.md` | Pitch Deck Editor (enhanced) | `/app/pitch-deck/:id/edit` | Draft |
| 04 | `04-ai-chat-modes.md` | AI Chat — 4 Modes | `/ai-chat` | Draft |
| 05 | `05-investor-pipeline.md` | Investor Pipeline (enhanced) | `/investors` | Draft |
| 06 | `06-lean-canvas.md` | Lean Canvas (enhanced) | `/lean-canvas` | Draft |

---

## File Reference

| Type | Path | Count |
|------|------|-------|
| Prompt fragments | `agency/prompts/*.md` | 5 |
| Chat mode prompts | `agency/chat-modes/*.md` | 4 |
| Agent loader | `agency/lib/agent-loader.ts` | 1 |
| Domain skills | `.agents/skills/*/SKILL.md` | 8 |
| Dev agents | `.claude/agents/agency-*.md` | 10 |
| Full fork (ref) | `agency-agents-fork/` | 179 files |
