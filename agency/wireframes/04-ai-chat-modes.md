---
task_id: AGN-04
title: AI Chat — 4 Expert Modes
phase: P2
priority: P1
status: Draft
agents: [sales-coach, growth-hacker, deal-strategist, feedback-synthesizer, behavioral-nudge]
chat_modes: [practice-pitch.md, growth-strategy.md, deal-review.md, canvas-coach.md]
edge_functions: [ai-chat]
existing_components: [AIChat, AIChatInput]
schema_tables: [ai_chat_sessions, startups, contacts, deals, lean_canvases]
---

# Implementation Prompt

> Add 4 expert chat modes to the AI Chat page (`src/pages/AIChat.tsx`). Load mode-specific system prompts
> from `agency/chat-modes/*.md` via `loadChatMode()` in the `ai-chat` edge function. Add a mode selector
> UI at the top of the chat. Each mode has a distinct persona, scoring framework, and session flow. Modes:
> (1) Practice Pitch — 5-dimension scoring with re-delivery coaching, (2) Growth Strategy — AARRR diagnosis
> with ICE experiments, (3) Deal Review — MEDDPICC pipeline scoring /40, (4) Canvas Coach — box-by-box
> coaching with specificity scoring. Store mode in `ai_chat_sessions.mode` column.

---

## User Journey — Mode Selection

```
Founder opens AI Chat (/ai-chat)
     │
     ▼
[Mode Selector] ─── 4 mode cards at top of chat
     │                 ├── 🎤 Practice Pitch — "Sharpen your investor pitch"
     │                 ├── 📈 Growth Strategy — "Find your growth lever"
     │                 ├── 💼 Deal Review — "Score your investor deals"
     │                 └── 🧩 Canvas Coach — "Strengthen your business model"
     ▼
[Mode Selected] ─── Chat UI adapts to mode
     │                 ├── System prompt loaded from chat-modes/*.md
     │                 ├── Quick actions change per mode
     │                 └── Scoring framework shown in right panel
     ▼
[Session Runs] ─── Mode-specific conversation flow
                     └── (see individual mode journeys below)
```

---

## Mode 1: Practice Pitch

### User Journey

```
Select "Practice Pitch" mode
     │
     ▼
[AI says] ─── "Deliver your 60-second elevator pitch"
     │
     ▼
[Founder delivers] ─── Types or pastes their pitch
     │
     ▼
[Scoring] ─── AI scores 5 dimensions × 10 points
     │            ├── Clarity: 8/10
     │            ├── Urgency: 4/10 (WEAK — flagged)
     │            ├── Differentiation: 7/10
     │            ├── The Ask: 6/10
     │            └── Confidence: 7/10
     │            Total: 32/50
     ▼
[3 Hard Questions] ─── Tailored to startup data
     │                    ├── Q1: "Your TAM assumes 100% of clinics adopt AI..."
     │                    ├── Q2: "Dr. Chen is one clinic — how do you scale?"
     │                    └── Q3: "What happens when [competitor] adds scheduling?"
     ▼
[Coaching] ─── Focus on weakest dimension (Urgency)
     │           └── "Replace 'clinics are inefficient' with
     │                '$2.3M/year in excess no-shows — we cut that 40%'"
     ▼
[Re-delivery] ─── Founder re-delivers with coached language
     │              ├── New score: 41/50 (+9 points)
     │              └── Urgency: 4→8/10
     ▼
[Assignment] ─── "Practice 3 more times before your meeting"
```

### ASCII Wireframe — Practice Pitch (Desktop)

```
+--------------------------------------------------------------------------+
| [=] StartupAI                                         [?] [Bell] [AV]    |
+--------------------------------------------------------------------------+
|     |                                                  |                  |
| NAV | AI CHAT                                          | SCORE PANEL      |
| RAIL|                                                  |                  |
|     | [🎤 Pitch] [📈 Growth] [💼 Deal] [🧩 Canvas]   | ┌──────────────┐ |
|     |                                                  | │ PITCH SCORE  │ |
|     | ┌──────────────────────────────────────────────┐ | │              │ |
|     | │ 🎤 I'm your pitch coach. Deliver your        │ | │ Total: 32/50│ |
|     | │    60-second elevator pitch. I'll score it   │ | │              │ |
|     | │    on 5 dimensions and coach you to improve. │ | │ Clarity   8  │ |
|     | └──────────────────────────────────────────────┘ | │ ████████░░   │ |
|     |                                                  | │              │ |
|     | ┌──────────────────────────────────────────────┐ | │ Urgency   4  │ |
|     | │ 👤 DentAI uses predictive scheduling to       │ | │ ████░░░░░░   │ |
|     | │    reduce dental no-shows. We save clinics   │ | │ ⚠ WEAK       │ |
|     | │    8 hrs/week and $50K/year...               │ | │              │ |
|     | └──────────────────────────────────────────────┘ | │ Differntn  7  │ |
|     |                                                  | │ ███████░░░   │ |
|     | ┌──────────────────────────────────────────────┐ | │              │ |
|     | │ 🎤 SCORE: 32/50                              │ | │ The Ask    6  │ |
|     | │                                              │ | │ ██████░░░░   │ |
|     | │ ✓ Clarity: 8/10 — Clear problem statement   │ | │              │ |
|     | │ ⚠ Urgency: 4/10 — No cost of inaction       │ | │ Confidence 7  │ |
|     | │ ✓ Differentiation: 7/10 — Good positioning  │ | │ ███████░░░   │ |
|     | │ ○ The Ask: 6/10 — Vague next step           │ | │              │ |
|     | │ ✓ Confidence: 7/10 — Mostly assured          │ | │ ────────────  │ |
|     | │                                              │ | │              │ |
|     | │ 🔥 3 HARD QUESTIONS:                         │ | │ ATTEMPT #1   │ |
|     | │ 1. "Your TAM assumes 100% adoption..."      │ | │ ┌──────────┐ │ |
|     | │ 2. "Dr. Chen is one clinic..."              │ | │ │ 32/50    │ │ |
|     | │ 3. "What if competitors add scheduling?"     │ | │ └──────────┘ │ |
|     | │                                              │ | │              │ |
|     | │ 💡 COACHING (Urgency):                       │ | │ ┌──────────┐ │ |
|     | │ Replace: "clinics are inefficient"           │ | │ │Re-deliver│ │ |
|     | │ With: "$2.3M/year in no-shows — we cut 40%"  │ | │ │your pitch│ │ |
|     | │                                              │ | │ └──────────┘ │ |
|     | │ Now deliver your pitch again with this fix.  │ | │              │ |
|     | └──────────────────────────────────────────────┘ | └──────────────┘ |
|     |                                                  |                  |
|     | ┌──────────────────────────────────────────────┐ |                  |
|     | │ Type your pitch...                    [Send] │ |                  |
|     | └──────────────────────────────────────────────┘ |                  |
+--------------------------------------------------------------------------+
```

---

## Mode 2: Growth Strategy

### User Journey

```
Select "Growth Strategy" mode
     │
     ▼
[AI asks] ─── "What are your current numbers?"
     │           ├── Signups, activation %, retention, revenue
     │           └── Current channels, spend
     ▼
[AARRR Diagnosis] ─── Funnel analysis
     │                   ├── Acquisition: 500 signups (OK)
     │                   ├── Activation: 12% (RED — healthy is 60%+)
     │                   ├── Retention: Unknown
     │                   ├── Revenue: $0
     │                   └── Referral: None
     ▼
[Bottleneck ID] ─── "Activation is your bottleneck"
     │                 └── "Fix activation before acquiring more users"
     ▼
[3 Experiments] ─── ICE-scored experiments
     │                ├── #1: Reduce onboarding 7→3 steps (ICE: 720)
     │                ├── #2: Welcome email series (ICE: 480)
     │                └── #3: In-app tooltips (ICE: 360)
     ▼
[Experiment Design] ─── Full design for top experiment
     │                    ├── Hypothesis: "Activation improves 12%→25%"
     │                    ├── Baseline: 12% | Target: 25%
     │                    ├── Timeline: 2 weeks | Cost: $0
     │                    └── Pass/Fail: 25%+ = pass, <18% = fail
     ▼
[Sprint Import] ─── "Import to Sprint Board?"
```

### ASCII Wireframe — Growth Strategy (Desktop)

```
+--------------------------------------------------------------------------+
| [=] StartupAI                                         [?] [Bell] [AV]    |
+--------------------------------------------------------------------------+
|     |                                                  |                  |
| NAV | AI CHAT                                          | FUNNEL PANEL     |
| RAIL|                                                  |                  |
|     | [🎤 Pitch] [📈 Growth] [💼 Deal] [🧩 Canvas]   | ┌──────────────┐ |
|     |                                                  | │ AARRR FUNNEL │ |
|     | ┌──────────────────────────────────────────────┐ | │              │ |
|     | │ 📈 I'm your growth strategist. Tell me your  │ | │ Acquisition  │ |
|     | │    current metrics — signups, activation,    │ | │ ████████ 500 │ |
|     | │    retention, revenue, and channels.          │ | │ ✓ OK         │ |
|     | └──────────────────────────────────────────────┘ | │              │ |
|     |                                                  | │ Activation   │ |
|     | ┌──────────────────────────────────────────────┐ | │ ██░░░░░░ 12% │ |
|     | │ 👤 500 signups, 12% activated, no retention  │ | │ ⚠ BOTTLENECK │ |
|     | │    data yet. Using Twitter + ProductHunt.     │ | │              │ |
|     | └──────────────────────────────────────────────┘ | │ Retention    │ |
|     |                                                  | │ ░░░░░░░░  ?  │ |
|     | ┌──────────────────────────────────────────────┐ | │ ○ Unknown    │ |
|     | │ 📈 DIAGNOSIS: Activation is your bottleneck  │ | │              │ |
|     | │                                              │ | │ Revenue      │ |
|     | │ 🛑 Stop: Acquiring more users won't help     │ | │ ░░░░░░░░ $0  │ |
|     | │ ✓ Fix: Activation first (12% → 60%+ target) │ | │ ○ None yet   │ |
|     | │                                              │ | │              │ |
|     | │ TOP 3 EXPERIMENTS (ICE-scored):              │ | │ Referral     │ |
|     | │                                              │ | │ ░░░░░░░░  0  │ |
|     | │ #1 Reduce onboarding 7→3 steps              │ | │ ○ None       │ |
|     | │    ICE: 720  Timeline: 2 weeks  Cost: $0    │ | │              │ |
|     | │    Hypothesis: "Activation 12%→25%"          │ | │ ────────────  │ |
|     | │    [Import to Sprint →]                      │ | │              │ |
|     | │                                              │ | │ Stage:       │ |
|     | │ #2 Welcome email series (3-day)              │ | │ PRE-PMF      │ |
|     | │    ICE: 480  Timeline: 1 week  Cost: $0     │ | │              │ |
|     | │                                              │ | │ ⚠ Avoid:     │ |
|     | │ #3 In-app tooltips for key actions           │ | │ Paid ads     │ |
|     | │    ICE: 360  Timeline: 3 days  Cost: $0     │ | │ Programmatic │ |
|     | └──────────────────────────────────────────────┘ | └──────────────┘ |
|     |                                                  |                  |
|     | ┌──────────────────────────────────────────────┐ |                  |
|     | │ Ask about growth...                   [Send] │ |                  |
|     | └──────────────────────────────────────────────┘ |                  |
+--------------------------------------------------------------------------+
```

---

## Mode 3: Deal Review

### User Journey

```
Select "Deal Review" mode
     │
     ▼
[AI asks] ─── "Walk me through your top 3 investor conversations"
     │           └── Pulls CRM deal data for each investor
     ▼
[MEDDPICC Scoring] ─── Each deal scored /40 (8 dims × 5)
     │                    ├── Sequoia:    14/40 UNQUALIFIED
     │                    │   └── Single-threaded to associate, no budget discussion
     │                    ├── Lightspeed: 28/40 BATTLING
     │                    │   └── Partner engaged, no paper process started
     │                    └── a16z:       34/40 STRONG
     │                         └── GP championing, term sheet drafting
     ▼
[Red Flags] ─── 7 pipeline red flags checked
     │             ├── "No compelling event" on 3 deals
     │             ├── "Single-threaded" on Sequoia
     │             └── "No paper process" on Lightspeed
     ▼
[Recommendations] ─── Deal-level verdicts
     │                  ├── Sequoia: STOP — ask for GP intro or move on
     │                  ├── Lightspeed: PUSH — request term sheet timeline
     │                  └── a16z: CLOSE — respond within 24 hours
     ▼
[Pipeline Summary] ─── Overall pipeline health
                        ├── 1 Strong, 1 Battling, 1 Unqualified
                        └── "Concentrate on a16z, push Lightspeed, drop Sequoia"
```

### ASCII Wireframe — Deal Review (Desktop)

```
+--------------------------------------------------------------------------+
| [=] StartupAI                                         [?] [Bell] [AV]    |
+--------------------------------------------------------------------------+
|     |                                                  |                  |
| NAV | AI CHAT                                          | DEAL SCORES      |
| RAIL|                                                  |                  |
|     | [🎤 Pitch] [📈 Growth] [💼 Deal] [🧩 Canvas]   | ┌──────────────┐ |
|     |                                                  | │ MEDDPICC /40 │ |
|     | ┌──────────────────────────────────────────────┐ | │              │ |
|     | │ 💼 I'm your deal strategist. Let's score     │ | │ a16z         │ |
|     | │    your investor pipeline with MEDDPICC.     │ | │ ██████████34 │ |
|     | │    Walk me through your top deals.           │ | │ [STRONG]     │ |
|     | └──────────────────────────────────────────────┘ | │              │ |
|     |                                                  | │ Lightspeed   │ |
|     | ┌──────────────────────────────────────────────┐ | │ ███████░░ 28 │ |
|     | │ 👤 I have 3 active conversations: Sequoia    │ | │ [BATTLING]   │ |
|     | │    (associate), Lightspeed (partner), and    │ | │              │ |
|     | │    a16z (GP from demo day)                   │ | │ Sequoia      │ |
|     | └──────────────────────────────────────────────┘ | │ ████░░░░░ 14 │ |
|     |                                                  | │ [UNQUALIFIED]│ |
|     | ┌──────────────────────────────────────────────┐ | │              │ |
|     | │ 💼 MEDDPICC SCORECARD                        │ | │ ────────────  │ |
|     | │                                              │ | │              │ |
|     | │ a16z: 34/40 [STRONG] ✓                      │ | │ DIMENSIONS   │ |
|     | │ ├── Metrics: 5 ├── Econ Buyer: 5            │ | │ (a16z)       │ |
|     | │ ├── Decision: 4 ├── Decision Proc: 4        │ | │              │ |
|     | │ ├── Paper Proc: 4 ├── Identify Pain: 4      │ | │ M Metrics  5 │ |
|     | │ ├── Champion: 5  └── Compelling: 3           │ | │ E EconBuyr 5 │ |
|     | │                                              │ | │ D Decision 4 │ |
|     | │ Sequoia: 14/40 [UNQUALIFIED] ✗              │ | │ D DecProc  4 │ |
|     | │ ├── Metrics: 2 ├── Econ Buyer: 1            │ | │ P PaperPr  4 │ |
|     | │ ├── Decision: 1 ├── Decision Proc: 2        │ | │ I IdPain   4 │ |
|     | │ ├── Paper Proc: 1 ├── Identify Pain: 3      │ | │ C Champion 5 │ |
|     | │ ├── Champion: 2  └── Compelling: 2           │ | │ C Compel   3 │ |
|     | │                                              │ | │              │ |
|     | │ 🚩 RED FLAGS:                                │ | │ ┌──────────┐ │ |
|     | │ • Sequoia: Single-threaded to associate      │ | │ │ View in  │ │ |
|     | │ • Sequoia: No budget conversation            │ | │ │ CRM      │ │ |
|     | │ • Lightspeed: No paper process started       │ | │ └──────────┘ │ |
|     | │                                              │ | │              │ |
|     | │ 📋 VERDICTS:                                 │ | │ PIPELINE     │ |
|     | │ • a16z: CLOSE — respond within 24 hours     │ | │ Strong:   1  │ |
|     | │ • Lightspeed: PUSH — request term timeline   │ | │ Battling: 1  │ |
|     | │ • Sequoia: STOP — ask for GP or move on      │ | │ At Risk:  0  │ |
|     | └──────────────────────────────────────────────┘ | │ Unqual:   1  │ |
|     |                                                  | └──────────────┘ |
|     | ┌──────────────────────────────────────────────┐ |                  |
|     | │ Ask about a deal...                   [Send] │ |                  |
|     | └──────────────────────────────────────────────┘ |                  |
+--------------------------------------------------------------------------+
```

---

## Mode 4: Canvas Coach

### User Journey

```
Select "Canvas Coach" mode
     │
     ▼
[AI loads canvas] ─── Reads current lean canvas from DB
     │
     ▼
[Weakest Box] ─── AI identifies weakest box
     │               └── "Customer Segments says 'small businesses' —
     │                    that's too vague to test"
     ▼
[Probing Questions] ─── 3-5 questions per box
     │                    ├── "How many employees do these businesses have?"
     │                    ├── "What industry are they in?"
     │                    ├── "What's their annual revenue?"
     │                    └── "What specific pain do they have?"
     ▼
[Founder Answers] ─── Iterative refinement
     │                  └── "Independent restaurants, 1-3 locations,
     │                       $500K-$2M revenue, food waste problem"
     ▼
[Specificity Score] ─── Box quality improved
     │                    ├── Before: "Small businesses" → 20% specific
     │                    └── After: Full segment → 85% specific
     ▼
[Next Box] ─── Move to next weakest box
     │
     ▼
[Progress] ─── "3 of 9 boxes strong — you're a third done"
                  └── Nudge: "Founders who fill 6+ boxes raise 2x faster"
```

### ASCII Wireframe — Canvas Coach (Desktop)

```
+--------------------------------------------------------------------------+
| [=] StartupAI                                         [?] [Bell] [AV]    |
+--------------------------------------------------------------------------+
|     |                                                  |                  |
| NAV | AI CHAT                                          | CANVAS STATUS    |
| RAIL|                                                  |                  |
|     | [🎤 Pitch] [📈 Growth] [💼 Deal] [🧩 Canvas]   | ┌──────────────┐ |
|     |                                                  | │ CANVAS       │ |
|     | ┌──────────────────────────────────────────────┐ | │ PROGRESS     │ |
|     | │ 🧩 I'm your canvas coach. I've read your    │ | │              │ |
|     | │    lean canvas. Let's strengthen the weak    │ | │ ████████░░░  │ |
|     | │    spots. Starting with Customer Segments.   │ | │ 3/9 strong   │ |
|     | └──────────────────────────────────────────────┘ | │ (33%)        │ |
|     |                                                  | │              │ |
|     | ┌──────────────────────────────────────────────┐ | │ BOX STATUS   │ |
|     | │ 🧩 Your "Customer Segments" says "small      │ | │              │ |
|     | │    businesses." That's too vague to test.    │ | │ Problem   ✓  │ |
|     | │                                              │ | │ Customer  ⚠  │ |
|     | │    Let me ask you some questions:            │ | │ UVP       ✓  │ |
|     | │    1. How many employees?                    │ | │ Solution  ○  │ |
|     | │    2. What industry?                         │ | │ Channels  ○  │ |
|     | │    3. Annual revenue range?                  │ | │ Revenue   ✓  │ |
|     | │    4. What specific pain?                    │ | │ Cost      ○  │ |
|     | └──────────────────────────────────────────────┘ | │ Metrics   ○  │ |
|     |                                                  | │ Advantage ○  │ |
|     | ┌──────────────────────────────────────────────┐ | │              │ |
|     | │ 👤 Independent restaurants with 1-3           │ | │ ────────────  │ |
|     | │    locations, $500K-$2M revenue. They waste  │ | │              │ |
|     | │    8-12% of revenue on food waste.           │ | │ SPECIFICITY  │ |
|     | └──────────────────────────────────────────────┘ | │ Customer:    │ |
|     |                                                  | │              │ |
|     | ┌──────────────────────────────────────────────┐ | │ Before: 20%  │ |
|     | │ 🧩 Excellent! Let me update your canvas:    │ | │ ██░░░░░░░░   │ |
|     | │                                              │ | │              │ |
|     | │ ✓ Customer Segments (updated):               │ | │ After:  85%  │ |
|     | │   "Independent restaurants with 1-3          │ | │ █████████░   │ |
|     | │    locations doing $500K-$2M revenue,        │ | │              │ |
|     | │    struggling with food waste costing         │ | │ ────────────  │ |
|     | │    8-12% of revenue"                         │ | │              │ |
|     | │                                              │ | │ 💡 NUDGE     │ |
|     | │ Specificity: 20% → 85% ✓                    │ | │ "Founders    │ |
|     | │                                              │ | │ who fill 6+  │ |
|     | │ 💡 "3 of 9 boxes strong — a third done."    │ | │ boxes raise  │ |
|     | │    Let's work on Solution next.              │ | │ 2x faster"   │ |
|     | └──────────────────────────────────────────────┘ | │              │ |
|     |                                                  | │ ┌──────────┐ │ |
|     | ┌──────────────────────────────────────────────┐ | │ │ Open      │ │ |
|     | │ Tell me about your solution...        [Send] │ | │ │ Canvas   │ │ |
|     | └──────────────────────────────────────────────┘ | │ └──────────┘ │ |
|     |                                                  | └──────────────┘ |
+--------------------------------------------------------------------------+
```

---

## ASCII Wireframe — Mobile (< 768px, All Modes)

```
+----------------------------------+
| [=] StartupAI        [?] [Bell]  |
+----------------------------------+
|                                  |
| AI CHAT                  [Mode]  |
|                                  |
| ┌── MODE SELECTOR (bottom) ──┐ |
| │ [🎤] [📈] [💼] [🧩]       │ |
| └──────────────────────────────┘ |
|                                  |
| ┌────────────────────────────┐  |
| │ 🎤 Deliver your 60-second │  |
| │    elevator pitch.         │  |
| └────────────────────────────┘  |
|                                  |
| ┌────────────────────────────┐  |
| │ 👤 DentAI uses predictive │  |
| │    scheduling to reduce    │  |
| │    dental no-shows...      │  |
| └────────────────────────────┘  |
|                                  |
| ┌────────────────────────────┐  |
| │ 🎤 SCORE: 32/50           │  |
| │ Clarity 8 | Urgency 4 ⚠   │  |
| │ Diff 7 | Ask 6 | Conf 7   │  |
| │                            │  |
| │ 💡 Fix Urgency: Quantify  │  |
| │ the cost of inaction.      │  |
| └────────────────────────────┘  |
|                                  |
| ┌────────────────────────────┐  |
| │ Type here...        [Send] │  |
| └────────────────────────────┘  |
+----------------------------------+
```

---

## Content & Data

### Mode Configuration

| Mode | System Prompt | Persona | Scoring | Right Panel |
|------|--------------|---------|---------|-------------|
| Practice Pitch | `practice-pitch.md` | Tough investor coach | 5 dims × 10 = /50 | Score breakdown + attempts |
| Growth Strategy | `growth-strategy.md` | Growth strategist | AARRR funnel + ICE scores | Funnel visualization + stage |
| Deal Review | `deal-review.md` | Deal strategist | MEDDPICC /40 | Deal scores + pipeline summary |
| Canvas Coach | `canvas-coach.md` | Canvas coach | 9-box specificity % | Box status + progress + nudges |

### Practice Pitch Scoring

| Dimension | Weight | Scoring Criteria |
|-----------|--------|-----------------|
| Clarity | 10 | Clear problem + solution in <60s |
| Urgency | 10 | Quantified cost of inaction |
| Differentiation | 10 | Distinct from alternatives |
| The Ask | 10 | Specific, actionable next step |
| Confidence | 10 | Tone, conviction, credibility |

### MEDDPICC Dimensions

| Dimension | Max | What It Measures |
|-----------|-----|-----------------|
| Metrics | 5 | Quantified success criteria |
| Economic Buyer | 5 | Access to decision maker |
| Decision Criteria | 5 | How they'll evaluate |
| Decision Process | 5 | Steps to close |
| Paper Process | 5 | Legal/admin timeline |
| Identify Pain | 5 | Pain acknowledged |
| Champion | 5 | Internal advocate exists |
| Compelling Event | 5 | Why now (deadline/trigger) |

### Deal Verdicts

| Score Range | Verdict | Badge | Action |
|-------------|---------|-------|--------|
| 32-40 | STRONG | Green | Close — act within 24h |
| 24-31 | BATTLING | Blue | Push — request next step |
| 16-23 | AT RISK | Amber | Rescue — find champion |
| 0-15 | UNQUALIFIED | Red | Stop — reallocate time |

### AARRR Funnel Benchmarks

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| Activation | >60% | 30-60% | <30% |
| Retention (D7) | >40% | 20-40% | <20% |
| Retention (D30) | >20% | 10-20% | <10% |
| Referral | >10% | 5-10% | <5% |

---

## Agency Features — Before / After

| Feature | Before (current) | After (with agency) |
|---------|-------------------|---------------------|
| Chat modes | Single general-purpose chat | 4 expert modes with distinct personas |
| Pitch practice | Not available | 5-dim scoring + hard questions + coaching + re-delivery |
| Growth advice | Generic suggestions | AARRR diagnosis + ICE experiments + stage-matched channels |
| Deal scoring | No pipeline analysis | MEDDPICC /40 per deal + verdicts + red flags |
| Canvas coaching | Basic AI suggestions | Box-by-box specificity scoring + behavioral nudges |
| Right panel | Static context | Mode-specific scoring visualizations |

---

## Agent & Fragment Wiring

```
ai-chat/index.ts
  │
  ├── MODE: practice-pitch
  │     └── INJECT: loadChatMode('practice-pitch')
  │           ├── 5-dimension scoring rubric
  │           ├── Investor question bank (by dimension)
  │           ├── Coaching methodology (one fix at a time)
  │           └── Re-delivery loop (score → coach → re-deliver)
  │
  ├── MODE: growth-strategy
  │     └── INJECT: loadChatMode('growth-strategy')
  │           ├── AARRR pirate metrics framework
  │           ├── Stage identification (Pre-PMF/PMF/Growth/Scale)
  │           ├── ICE experiment design templates
  │           └── Channel recommendations by stage
  │
  ├── MODE: deal-review
  │     └── INJECT: loadChatMode('deal-review')
  │           ├── MEDDPICC 8-dimension scoring (/40)
  │           ├── Pipeline red flags (7 patterns)
  │           ├── Deal verdicts (Strong/Battling/At Risk/Unqualified)
  │           └── CRM data integration
  │
  └── MODE: canvas-coach
        └── INJECT: loadChatMode('canvas-coach')
              ├── 9-box quality checklist
              ├── Per-box red flags and probing questions
              ├── Specificity scoring (vague→specific %)
              └── Behavioral nudges (progress, social proof)
```

---

## Workflows

| Trigger | AI Action | UI Update |
|---------|-----------|-----------|
| Select mode | Load mode-specific system prompt | Chat UI adapts, right panel changes |
| Practice Pitch: deliver pitch | Score 5 dimensions, generate 3 hard questions | Score panel populates, weak dimension flagged |
| Practice Pitch: re-deliver | Re-score, compare with previous | Score panel shows improvement delta |
| Growth Strategy: share metrics | AARRR diagnosis, identify bottleneck | Funnel panel highlights bottleneck |
| Growth Strategy: request experiments | ICE-scored experiment designs | Experiment cards with "Import to Sprint" |
| Deal Review: describe deals | MEDDPICC scoring per deal | Deal score bars + verdicts in panel |
| Deal Review: ask about pipeline | Aggregate analysis, recommendations | Pipeline summary card |
| Canvas Coach: start session | Load canvas, find weakest box | Box status panel, specificity scores |
| Canvas Coach: answer questions | Update canvas box, re-score | Specificity bar improves, nudge shown |
