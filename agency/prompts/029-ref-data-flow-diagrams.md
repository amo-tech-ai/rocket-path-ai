---
task_id: 103-INF
title: Agency Data Flow Diagrams
phase: INFRASTRUCTURE
priority: P1
status: Not Started
estimated_effort: 0.5 day
skill: [infographic/mermaid-diagrams]
subagents: []
depends_on: [102-INF]
---

| Aspect | Details |
|--------|---------|
| **Screens** | All agency-enhanced screens (Validator, Chat, Investors, Sprint, Pitch Deck, Canvas, Dashboard) |
| **Features** | 8 Mermaid data flow diagrams covering every agency-enhanced workflow |
| **Edge Functions** | validator-start, ai-chat, investor-agent, sprint-agent, pitch-deck-agent, lean-canvas-agent, health-scorer |
| **Real-World** | "Open `agency/mermaid/` and see exactly how data flows through every agency-enhanced feature" |

## Description

**The situation:** The agency system adds fragments, chat modes, MEDDPICC scoring, RICE/Kano prioritization, Challenger narratives, specificity coaching, behavioral nudges, and realtime dashboards to 7 different screens. Existing Mermaid diagrams (AGN-01 through AGN-09) cover individual components — the agent loader, fragment wiring map, validator pipeline sequence, chat mode selection, screen enhancement map, investor MEDDPICC flow, behavioral nudge system, phase dependency graph, and Gantt timeline. What is missing are end-to-end data flow diagrams that show how data moves through the complete system: from user input through edge functions, AI models, fragment injection, database writes, realtime broadcasts, and back to the UI. Without these, a developer building task 005 (sprint RICE/Kano) has no single diagram showing how validator report actions become RICE-scored sprint cards.

**Why it matters:** Data flow diagrams are the developer's map. When a task prompt says "wire the sprint-agent-fragment into sprint-agent," the developer needs to see the full path: where the data originates (validator report), how it transforms (priority_actions to RICE scores), where it lands (sprint_tasks table), and what triggers the UI update (realtime broadcast or React Query invalidation). Without flow diagrams, developers guess at integration points, miss intermediate transformations, and wire things incorrectly. The existing AGN-03 (validator pipeline sequence) is excellent but covers only one workflow. Seven more are needed.

**What already exists:**
- `agency/mermaid/00-index.md` — Index of 9 existing diagrams (AGN-01 through AGN-09)
- `agency/mermaid/03-validator-enhanced-pipeline.md` — Sequence diagram of scoring + composer fragment injection
- `agency/mermaid/04-chat-mode-flow.md` — Sequence diagram of mode selection and specialized AI response
- `agency/mermaid/06-investor-meddpicc-flow.md` — Flowchart of MEDDPICC scoring to deal verdict
- `agency/mermaid/07-behavioral-nudge-system.md` — Flowchart of trigger conditions to nudge banners
- `agency/prompts/validator-scoring-fragment.md` — Evidence tier rules, bias detection
- `agency/prompts/validator-composer-fragment.md` — Three-act narrative, win themes, ICE channels
- `agency/prompts/crm-investor-fragment.md` — MEDDPICC scorecard, signal timing, email anatomy
- `agency/prompts/sprint-agent-fragment.md` — RICE scoring, Kano classification, momentum sequencing
- `agency/prompts/pitch-deck-fragment.md` — Challenger narrative, persuasion architecture, win themes
- `agency/lib/agent-loader.ts` — `loadFragment()` and `loadChatMode()` utilities

**The build:**
- Create 8 new Mermaid diagrams in `agency/mermaid/` (numbered AGN-10 through AGN-17)
- Each diagram is a `flowchart LR` or `sequenceDiagram` showing the complete data path for one agency workflow
- Use subgraphs to distinguish agency additions (green) from existing infrastructure (blue)
- Each diagram file includes: Mermaid code, field table (new/modified fields), and integration notes
- Update `agency/mermaid/00-index.md` to register all 8 new diagrams

**Example:** Priya is implementing task 005-SRK (Sprint Board RICE/Kano). She opens `agency/mermaid/14-sprint-rice-kano-flow.md` and sees the complete path: Validator report `priority_actions` are imported via `useSprintImport` hook, sent to `sprint-agent` edge function which loads `sprint-agent-fragment.md`, Gemini scores each action with RICE (reach x impact x confidence / effort), classifies via Kano (must-have/performance/delight), sequences for momentum (quick win first), writes to `sprint_tasks` table, and the Sprint Board renders scored cards with RICE badges and Kano classification chips. She knows every file to touch and every data transformation along the way.

## Rationale
**Problem:** Developers lack end-to-end visibility into how agency features transform data across the full system.
**Solution:** 8 comprehensive Mermaid diagrams — one per agency-enhanced workflow — showing complete data paths.
**Impact:** Developers can trace any piece of agency data from origin to UI, reducing integration errors and speeding up implementation.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Developer | see the full data flow for each agency feature | I know every file and transformation involved |
| Tech lead | review data flows before implementation | I can catch missing integrations and race conditions |
| New contributor | understand how agency fragments reach the UI | I can onboard without reading 25 task prompts |

## Goals
1. **Primary:** 8 Mermaid diagrams covering all agency-enhanced workflows
2. **Quality:** Each diagram traces data from user input to database write to UI render
3. **Clarity:** Subgraphs separate agency additions from existing infrastructure

## Acceptance Criteria
- [ ] Diagram 1 (AGN-10): Validator Pipeline + Agency Flow — complete sequence from user input through 7 agents with fragment injection points
- [ ] Diagram 2 (AGN-11): Chat Mode Selection Flow — mode selector through agent loader to specialized AI response
- [ ] Diagram 3 (AGN-12): MEDDPICC Investor Pipeline Flow — investor add through scoring to deal verdict and email generation
- [ ] Diagram 4 (AGN-13): Sprint Board RICE/Kano Flow — report actions through RICE scoring to Kanban cards
- [ ] Diagram 5 (AGN-14): Pitch Deck Challenger Flow — startup profile through win theme extraction to slide generation
- [ ] Diagram 6 (AGN-15): Lean Canvas Coach Flow — canvas edit through specificity scoring to RAG-backed coaching
- [ ] Diagram 7 (AGN-16): Behavioral Nudge System Flow — trigger events through nudge engine to user actions
- [ ] Diagram 8 (AGN-17): Dashboard Realtime + Agency Flow — data changes through realtime broadcasts to agency-enriched dashboard
- [ ] Each diagram uses subgraphs to distinguish agency additions from existing infrastructure
- [ ] `agency/mermaid/00-index.md` updated with all 8 new entries (AGN-10 through AGN-17)

| Layer | File | Action |
|-------|------|--------|
| Diagram | `agency/mermaid/10-validator-agency-flow.md` | Create |
| Diagram | `agency/mermaid/11-chat-mode-flow.md` | Create |
| Diagram | `agency/mermaid/12-meddpicc-pipeline-flow.md` | Create |
| Diagram | `agency/mermaid/13-sprint-rice-kano-flow.md` | Create |
| Diagram | `agency/mermaid/14-pitch-challenger-flow.md` | Create |
| Diagram | `agency/mermaid/15-canvas-coach-flow.md` | Create |
| Diagram | `agency/mermaid/16-behavioral-nudge-flow.md` | Create |
| Diagram | `agency/mermaid/17-dashboard-realtime-flow.md` | Create |
| Index | `agency/mermaid/00-index.md` | Modify — add AGN-10 through AGN-17 |

---

## Diagram 1: Validator Pipeline + Agency Flow (AGN-10)

**File:** `agency/mermaid/10-validator-agency-flow.md`

Shows how agency fragments inject into the 7-agent pipeline. Scoring and Composer agents receive enriched prompts while Extractor, Research, and Competitors run unchanged. The report output includes agency-specific fields (evidence tiers, bias flags, narrative arc, win themes, ICE channels) alongside standard fields.

```mermaid
flowchart LR
    UI["User Input<br/>(pitch text)"] --> EF["validator-start<br/>Edge Function"]

    subgraph Existing Pipeline
        EF --> EXT["ExtractorAgent<br/>(Gemini Flash)"]
        EXT --> RES["ResearchAgent<br/>(+ Google Search + RAG)"]
        EXT --> COMP["CompetitorAgent<br/>(+ Google Search)"]
    end

    subgraph Agency-Enhanced Agents
        RES --> SC["ScoringAgent<br/>(thinking: high)"]
        COMP --> SC
        SC --> MVP["MVPAgent"]
        MVP --> CO["ComposerAgent<br/>(8192 tokens)"]
        CO --> VER["VerifierAgent<br/>(pure JS)"]
    end

    subgraph Fragment Injection
        SF["validator-scoring-fragment.md"] -.->|"loadFragment()"| SC
        CF["validator-composer-fragment.md"] -.->|"loadFragment()"| CO
    end

    subgraph Scoring Output
        SC --> S_OUT["evidence_tier_counts<br/>bias_flags[]<br/>signal_strength"]
    end

    subgraph Composer Output
        CO --> C_OUT["narrative_arc{}<br/>win_themes[]<br/>ice_channels[]"]
    end

    VER --> DB["INSERT validator_reports<br/>(JSONB with agency fields)"]
    DB --> BC["Supabase Broadcast<br/>progress events"]
    BC --> RPT["Report UI<br/>(evidence badges,<br/>bias banner,<br/>ICE chips)"]

    style SF fill:#059669,color:#fff
    style CF fill:#059669,color:#fff
    style S_OUT fill:#d1fae5,stroke:#059669
    style C_OUT fill:#d1fae5,stroke:#059669
    style EXT fill:#dbeafe,stroke:#3b82f6
    style RES fill:#dbeafe,stroke:#3b82f6
    style COMP fill:#dbeafe,stroke:#3b82f6
```

### New Fields from Agency Fragments

| Source | Field | Type | Added By |
|--------|-------|------|----------|
| Scoring fragment | `evidence_tier_counts` | `Record<string, {cited, founder, ai_inferred}>` | `validator-scoring-fragment.md` |
| Scoring fragment | `bias_flags` | `Array<{dimension, bias_type, explanation}>` | `validator-scoring-fragment.md` |
| Scoring fragment | `signal_strength` | `'level_1' \| 'level_2' \| ... \| 'level_5'` | `validator-scoring-fragment.md` |
| Composer fragment | `narrative_arc` | `{setup, tension, resolution}` | `validator-composer-fragment.md` |
| Composer fragment | `win_themes` | `string[]` | `validator-composer-fragment.md` |
| Composer fragment | `ice_channels` | `Array<{channel, impact, confidence, ease, score}>` | `validator-composer-fragment.md` |

### Integration Notes

- Fragment injection happens in `pipeline.ts` before each agent call
- All new fields are optional — old reports render without them
- VerifierAgent checks for new fields if present (non-blocking)
- Broadcast events include `has_agency_data: true` flag for frontend conditional rendering

---

## Diagram 2: Chat Mode Selection Flow (AGN-11)

**File:** `agency/mermaid/11-chat-mode-flow.md`

Shows the complete flow from mode selection through agent loader to mode-specific UI rendering. Each mode activates a different AI persona, scoring system, and set of quick actions.

```mermaid
sequenceDiagram
    participant U as Founder
    participant FE as AI Chat Page
    participant MS as Mode Selector
    participant EF as ai-chat EF
    participant AL as Agent Loader
    participant GM as Gemini/Claude
    participant DB as chat_sessions

    U->>FE: Open /ai-chat
    FE->>MS: Render 5 mode cards

    Note over MS: general (default)<br/>practice-pitch<br/>growth-strategy<br/>deal-review<br/>canvas-coach

    U->>MS: Select "growth-strategy"
    MS->>FE: setMode("growth-strategy")
    FE->>FE: Show mode pill + AARRR quick actions

    U->>FE: Type: "My activation rate is 12%"
    FE->>EF: POST /ai-chat<br/>{mode: "growth-strategy", message, session_id}

    EF->>AL: loadChatMode("growth-strategy")
    AL-->>EF: System prompt with AARRR framework

    EF->>EF: Merge: base context + mode prompt + startup data

    EF->>GM: Chat with growth advisor persona
    GM-->>EF: AARRR diagnosis + experiment suggestions

    EF->>DB: Upsert chat_sessions<br/>{mode, messages[], updated_at}

    EF-->>FE: Streamed response

    FE-->>U: Growth advisor response<br/>+ AARRR funnel visualization<br/>+ experiment design CTA

    Note over FE: Mode-specific UI elements<br/>AARRR funnel chart<br/>"Design Experiment" button<br/>Metric target cards
```

### Mode-to-UI Mapping

| Mode | AI Persona | System Prompt Source | Scoring UI | Quick Actions |
|------|-----------|---------------------|------------|---------------|
| `general` | Helpful assistant | Base prompt only | None | General startup Qs |
| `practice-pitch` | Skeptical VC | `chat-modes/practice-pitch.md` | Pitch score /50 (5 dims x 10) | "Score my pitch", "Objections" |
| `growth-strategy` | Growth advisor | `chat-modes/growth-strategy.md` | AARRR diagnosis | "Diagnose funnel", "Design experiment" |
| `deal-review` | Deal strategist | `chat-modes/deal-review.md` | MEDDPICC /40 | "Score deal", "Red flags" |
| `canvas-coach` | Business model coach | `chat-modes/canvas-coach.md` | Specificity 0-100% | "Find weakest box", "Sharpen segment" |

### Integration Notes

- Mode persists per session (stored in `chat_sessions.mode`)
- Changing mode mid-conversation starts a new session
- `loadChatMode()` returns full system prompt text (cached by agent-loader)
- No mode param falls through to general mode (zero changes to existing behavior)

---

## Diagram 3: MEDDPICC Investor Pipeline Flow (AGN-12)

**File:** `agency/mermaid/12-meddpicc-pipeline-flow.md`

Shows the complete investor workflow from adding an investor through MEDDPICC scoring, signal detection, email generation, and pipeline Kanban rendering.

```mermaid
flowchart LR
    ADD["Founder adds investor<br/>or triggers scoring"] --> EF["investor-agent EF"]

    subgraph Existing Flow
        EF --> AUTH["JWT verify +<br/>org isolation"]
        AUTH --> FETCH["Fetch investor +<br/>startup context"]
    end

    subgraph Agency Enhancement
        FETCH --> LOAD["loadFragment<br/>(crm-investor-fragment)"]
        LOAD --> SCORE["MEDDPICC Scoring"]
    end

    subgraph MEDDPICC Dimensions
        SCORE --> D1["Metrics (0-5)"]
        SCORE --> D2["Economic Buyer (0-5)"]
        SCORE --> D3["Decision Criteria (0-5)"]
        SCORE --> D4["Decision Process (0-5)"]
        SCORE --> D5["Paper Process (0-5)"]
        SCORE --> D6["Identify Pain (0-5)"]
        SCORE --> D7["Champion (0-5)"]
        SCORE --> D8["Competition (0-5)"]
    end

    D1 & D2 & D3 & D4 & D5 & D6 & D7 & D8 --> TOTAL["/40 Total"]

    TOTAL --> VERDICT{"Score Range"}
    VERDICT -->|"32-40"| SB["Strong Buy"]
    VERDICT -->|"24-31"| BUY["Buy"]
    VERDICT -->|"16-23"| HOLD["Hold"]
    VERDICT -->|"0-15"| PASS["Pass"]

    SB & BUY & HOLD & PASS --> SIGNAL["Signal Detection"]

    subgraph Signal Analysis
        SIGNAL --> SIG_CHK{"Active signals?"}
        SIG_CHK -->|"funding round,<br/>portfolio fit,<br/>warm intro"| HOT["Hot (green dot)"]
        SIG_CHK -->|"some activity"| WARM["Warm (amber dot)"]
        SIG_CHK -->|"none"| COLD["Cold (gray dot)"]
    end

    HOT --> EMAIL["Cold Email Builder<br/>(signal + value + proof + CTA<br/>< 120 words)"]
    WARM --> DB["Write to investors table<br/>(meddpicc_score, verdict,<br/>signal_data JSONB)"]
    COLD --> DB
    EMAIL --> DB

    DB --> UI["Investor Pipeline Kanban<br/>(verdict pill + signal dot<br/>+ MEDDPICC badge)"]

    style LOAD fill:#059669,color:#fff
    style SCORE fill:#d1fae5,stroke:#059669
    style SB fill:#059669,color:#fff
    style BUY fill:#3b82f6,color:#fff
    style HOLD fill:#d97706,color:#fff
    style PASS fill:#dc2626,color:#fff
    style HOT fill:#059669,color:#fff
```

### Data Transformations

| Step | Input | Output | Storage |
|------|-------|--------|---------|
| MEDDPICC score | Investor profile + startup context | 8 dimension scores, total /40 | `investors.meddpicc_score` |
| Deal verdict | Total score | Strong Buy / Buy / Hold / Pass | `investors.deal_verdict` |
| Signal detection | Investor activity + market events | Hot / Warm / Cold + reasons | `investors.signal_data` JSONB |
| Email generation | Signal + startup value props | Subject + 4-line body < 120 words | `investors.outreach_draft` JSONB |

---

## Diagram 4: Sprint Board RICE/Kano Flow (AGN-13)

**File:** `agency/mermaid/13-sprint-rice-kano-flow.md`

Shows the path from validator report priority actions through RICE scoring and Kano classification to rendered sprint Kanban cards with scoring badges.

```mermaid
flowchart LR
    RPT["Validator Report<br/>priority_actions[]"] --> IMP["useSprintImport hook<br/>(one-click import)"]

    subgraph Import
        IMP --> MAP["Map fields:<br/>action -> title<br/>timeframe -> sprint_name<br/>effort -> priority"]
        MAP --> DEDUP["Dedup via source_action_id<br/>(report:id:dim:idx)"]
        DEDUP --> CAMP["Auto-create campaign<br/>if not exists"]
    end

    CAMP --> EF["sprint-agent EF"]

    subgraph Agency Enhancement
        EF --> LOAD["loadFragment<br/>(sprint-agent-fragment)"]
        LOAD --> RICE["RICE Scoring"]
    end

    subgraph RICE Calculation
        RICE --> R["Reach<br/>(users affected 1-10)"]
        RICE --> I["Impact<br/>(severity 0.25-3)"]
        RICE --> C["Confidence<br/>(evidence 0.5-1.0)"]
        RICE --> E["Effort<br/>(person-weeks 0.5-10)"]
        R & I & C & E --> SCORE["RICE = R*I*C / E"]
    end

    SCORE --> KANO["Kano Classification"]

    subgraph Kano Types
        KANO --> MH["Must-Have<br/>(red badge)"]
        KANO --> PF["Performance<br/>(blue badge)"]
        KANO --> DL["Delight<br/>(green badge)"]
    end

    MH & PF & DL --> SEQ["Momentum Sequencing<br/>(quick wins first)"]

    SEQ --> DB["Write sprint_tasks<br/>(rice_score, kano_type,<br/>momentum_order)"]

    DB --> KB["Sprint Kanban Board<br/>(RICE badge + Kano chip<br/>+ momentum position)"]

    style LOAD fill:#059669,color:#fff
    style RICE fill:#d1fae5,stroke:#059669
    style KANO fill:#d1fae5,stroke:#059669
    style MH fill:#dc2626,color:#fff
    style PF fill:#3b82f6,color:#fff
    style DL fill:#059669,color:#fff
```

### Data Transformations

| Step | Input | Output | Storage |
|------|-------|--------|---------|
| Import mapping | `priority_actions[{action, timeframe, effort}]` | `sprint_tasks[{title, sprint_name, priority}]` | `sprint_tasks` table |
| RICE scoring | Task description + startup context | `rice_score` (float), component scores | `sprint_tasks.rice_score` JSONB |
| Kano classification | Task type + user impact | `must_have` / `performance` / `delight` | `sprint_tasks.kano_type` text |
| Momentum sequence | RICE scores + Kano types | Ordered list (quick wins first) | `sprint_tasks.momentum_order` int |

---

## Diagram 5: Pitch Deck Challenger Flow (AGN-14)

**File:** `agency/mermaid/14-pitch-challenger-flow.md`

Shows how the pitch deck agent builds a Challenger-style narrative deck from startup profile and validation report data, with per-slide persuasion architecture.

```mermaid
sequenceDiagram
    participant U as Founder
    participant FE as Pitch Deck Editor
    participant EF as pitch-deck-agent EF
    participant AL as Agent Loader
    participant GM as Gemini Pro
    participant DB as pitch_decks table

    U->>FE: Click "Generate Deck"
    FE->>EF: POST /pitch-deck-agent<br/>{action: "generate", startup_id}

    EF->>EF: Fetch startup profile +<br/>validation report + lean canvas

    EF->>AL: loadFragment("pitch-deck-fragment")
    AL-->>EF: Challenger narrative rules +<br/>persuasion architecture +<br/>win theme extraction

    Note over EF: System prompt =<br/>base deck prompt +<br/>pitch-deck-fragment<br/>+ startup data

    EF->>GM: Generate deck structure

    Note over GM: Challenger 5-step narrative:<br/>1. Warmer (pattern recognition)<br/>2. Reframe (challenge assumption)<br/>3. Rational Drowning (data wall)<br/>4. Emotional Impact (story)<br/>5. A New Way (your solution)

    GM-->>EF: Structured deck JSON

    Note over EF: Per-slide persuasion:<br/>hook, evidence, emotion,<br/>objection preempt, CTA

    EF->>GM: Generate slide images<br/>(gemini-3.1-flash-image-preview)
    GM-->>EF: Slide image URLs

    EF->>DB: Upsert pitch_decks<br/>{deck_json with agency overlays}

    EF-->>FE: Deck data + images

    FE-->>U: Deck editor with<br/>win theme badges<br/>+ persuasion hints<br/>+ narrative flow indicator

    Note over FE: Agency overlay elements:<br/>Win theme badges per slide<br/>Persuasion tooltip (hook/evidence)<br/>Narrative position indicator<br/>Challenger step label
```

### Challenger Narrative Structure

| Step | Slide Purpose | Agency Field |
|------|-------------|-------------|
| 1. Warmer | Pattern investor recognizes | `challenger_step: "warmer"` |
| 2. Reframe | Challenge their assumption | `challenger_step: "reframe"` |
| 3. Rational Drowning | Data wall (TAM, metrics) | `challenger_step: "rational_drowning"` |
| 4. Emotional Impact | Founder story or user pain | `challenger_step: "emotional_impact"` |
| 5. A New Way | Your solution + traction | `challenger_step: "new_way"` |

### Per-Slide Persuasion Fields

| Field | Type | Purpose |
|-------|------|---------|
| `hook` | string | Opening line that grabs attention |
| `evidence` | string[] | Data points supporting the claim |
| `emotion` | string | Emotional connection point |
| `objection_preempt` | string | Anticipated investor pushback + counter |
| `win_themes` | string[] | Which win themes this slide supports |

---

## Diagram 6: Lean Canvas Coach Flow (AGN-15)

**File:** `agency/mermaid/15-canvas-coach-flow.md`

Shows how canvas edits trigger specificity scoring, evidence gap detection, and RAG-backed coaching with behavioral nudges.

```mermaid
flowchart LR
    EDIT["Founder edits<br/>canvas box"] --> HOOK["useLeanCanvas hook<br/>(2s debounce autosave)"]

    subgraph Existing Save Flow
        HOOK --> SAVE["Save to documents table"]
        SAVE --> INV["Invalidate React Query"]
    end

    subgraph Agency Enhancement
        EDIT --> COACH_BTN["Click coach sparkle<br/>on box header"]
        COACH_BTN --> EF["lean-canvas-agent EF<br/>(action: coach)"]
    end

    subgraph Fragment + RAG
        EF --> LOAD["loadFragment logic<br/>(canvas-coach mode)"]
        LOAD --> SPEC["Specificity Scoring<br/>(0-100% per box)"]
        SPEC --> GAP["Evidence Gap Detection<br/>(vague vs. quantified)"]
        GAP --> RAG["RAG Search<br/>(knowledge_chunks table)"]
    end

    subgraph RAG Pipeline
        RAG --> EMB["OpenAI Embedding<br/>(text-embedding-3-small)"]
        EMB --> SEARCH["search_knowledge RPC<br/>(cosine similarity)"]
        SEARCH --> TOP5["Top 5 relevant chunks"]
    end

    TOP5 --> GM["Gemini Flash<br/>(coach persona +<br/>specificity rules +<br/>RAG citations)"]

    GM --> RESP["Coach response:<br/>suggestion text +<br/>citations[] +<br/>specificity_score"]

    RESP --> UI["Canvas Coach Chat<br/>(BookOpen citation badges<br/>+ specificity bar<br/>+ nudge if < 40%)"]

    subgraph Nudge Trigger
        SPEC --> NUDGE_CHK{"Specificity < 40%?"}
        NUDGE_CHK -->|"Yes"| NUDGE["Blue suggestion nudge:<br/>'Your [box] needs<br/>more specifics'"]
        NUDGE_CHK -->|"No"| NO_NUDGE["No nudge"]
    end

    style LOAD fill:#059669,color:#fff
    style SPEC fill:#d1fae5,stroke:#059669
    style GAP fill:#d1fae5,stroke:#059669
    style RAG fill:#dbeafe,stroke:#3b82f6
    style NUDGE fill:#3b82f6,color:#fff
```

### Specificity Scoring Rules

| Score Range | Label | Meaning | Nudge? |
|-------------|-------|---------|--------|
| 0-39% | Vague | No numbers, no names, generic claims | Yes (blue banner) |
| 40-69% | Partial | Some specifics but missing key data | No |
| 70-89% | Good | Named segments, quantified metrics | No |
| 90-100% | Sharp | Precise data with evidence sources | No |

### RAG Integration

| Step | Input | Output |
|------|-------|--------|
| Embedding | Canvas box text | 1536-dim vector |
| Search | Vector query + industry filter | Top 5 knowledge_chunks |
| Injection | Chunks as numbered citations | System prompt context |
| Response | Coach advice with `[1]` style refs | `citations: string[]` in response |

---

## Diagram 7: Behavioral Nudge System Flow (AGN-16)

**File:** `agency/mermaid/16-behavioral-nudge-flow.md`

Shows the complete lifecycle of a behavioral nudge: trigger detection, condition evaluation, rendering, and user response handling with localStorage persistence.

```mermaid
flowchart TD
    subgraph Trigger Events
        T1["Sprint stale<br/>(no task moved 7d)"]
        T2["Canvas box empty<br/>(any of 9 boxes blank)"]
        T3["Report generated<br/>(has priority_actions)"]
        T4["Profile incomplete<br/>(< 80% fields)"]
        T5["No validation run<br/>(0 reports)"]
    end

    subgraph Page Load Detection
        T1 & T2 & T3 & T4 & T5 --> HOOK["useNudgeState hook<br/>(evaluates on mount)"]
    end

    HOOK --> LS_CHECK{"Check localStorage<br/>nudge:{key}:*"}
    LS_CHECK -->|"dismissed"| SKIP["Skip nudge<br/>(permanent)"]
    LS_CHECK -->|"snoozed + not expired"| SKIP
    LS_CHECK -->|"snoozed + expired"| EVAL["Evaluate condition"]
    LS_CHECK -->|"no record"| EVAL

    EVAL --> COND{"Condition met?"}
    COND -->|"No"| HIDE["Hide nudge"]
    COND -->|"Yes"| TYPE{"Nudge Type"}

    TYPE -->|"Action needed"| GREEN["NudgeBanner<br/>(green / progress)"]
    TYPE -->|"Opportunity"| BLUE["NudgeBanner<br/>(blue / suggestion)"]
    TYPE -->|"Risk detected"| AMBER["NudgeBanner<br/>(amber / warning)"]

    GREEN & BLUE & AMBER --> RENDER["Render banner<br/>(message + CTA button)"]

    RENDER --> ACTION{"User response?"}
    ACTION -->|"Click CTA"| NAV["Navigate to<br/>target screen"]
    ACTION -->|"Dismiss (X)"| DISMISS["localStorage set<br/>nudge:{key}:dismissed = true"]
    ACTION -->|"Snooze"| SNOOZE["localStorage set<br/>nudge:{key}:snoozedUntil<br/>= now + 24h"]
    ACTION -->|"Ignore"| PERSIST["Banner persists<br/>until resolved"]

    NAV --> RESOLVE["Condition resolves<br/>(task moved, box filled, etc.)"]
    RESOLVE --> REMOVE["Banner removed<br/>on next evaluation"]

    subgraph Target Screens
        NAV --> SC1["Dashboard<br/>(T4, T5)"]
        NAV --> SC2["Lean Canvas<br/>(T2)"]
        NAV --> SC3["Sprint Board<br/>(T1)"]
        NAV --> SC4["Validator Report<br/>(T3)"]
    end

    style GREEN fill:#059669,color:#fff
    style BLUE fill:#3b82f6,color:#fff
    style AMBER fill:#d97706,color:#fff
    style DISMISS fill:#6b7280,color:#fff
    style SNOOZE fill:#6b7280,color:#fff
```

### Nudge Configuration Table

| Key | Trigger | Type | Screen | CTA Text | Condition |
|-----|---------|------|--------|----------|-----------|
| `sprint_stale` | No task moved in 7d | Warning (amber) | Sprint Board | "Review sprint tasks" | `sprint_tasks.updated_at < now() - 7d` |
| `canvas_empty_{box}` | Any canvas box blank | Suggestion (blue) | Lean Canvas | "Fill in {box name}" | `canvas_data[box].length === 0` |
| `report_actions` | Report has actions | Progress (green) | Validator Report | "Import to sprint" | `report.priority_actions.length > 0 && !imported` |
| `profile_incomplete` | Profile < 80% | Progress (green) | Dashboard | "Complete your profile" | `profileCompleteness < 80` |
| `no_validation` | 0 reports exist | Progress (green) | Dashboard | "Validate your idea" | `validator_reports.count === 0` |

### State Persistence

| Storage Key | Value | Behavior |
|-------------|-------|----------|
| `nudge:{key}:dismissed` | `true` | Permanent hide for this trigger |
| `nudge:{key}:snoozedUntil` | ISO timestamp | Hide until timestamp passes, then re-evaluate |

---

## Diagram 8: Dashboard Realtime + Agency Flow (AGN-17)

**File:** `agency/mermaid/17-dashboard-realtime-flow.md`

Shows how data changes propagate through Supabase Realtime to update agency-enriched dashboard components: health score, stage guidance, AI right panel insights, and nudge triggers.

```mermaid
flowchart LR
    subgraph Data Sources
        VAL["Validator report saved"]
        CANVAS["Canvas updated"]
        SPRINT["Sprint task moved"]
        CRM["Investor scored"]
        DECK["Deck generated"]
    end

    subgraph Supabase Realtime
        VAL --> BC["Broadcast Channel<br/>(dashboard:{org_id})"]
        CANVAS --> BC
        SPRINT --> BC
        CRM --> BC
        DECK --> BC
    end

    subgraph Dashboard Hooks
        BC --> DH["useDashboardMetrics<br/>(multiplexed channel)"]
        DH --> HEALTH["health-scorer EF"]
        DH --> STAGE["useJourneyStage"]
        DH --> METRICS["Metric cards<br/>(decks, investors,<br/>tasks, events)"]
    end

    subgraph Agency Enhancement
        HEALTH --> HS_AGN["Health score with<br/>validator agency data<br/>(evidence tiers factor<br/>into confidence)"]
        STAGE --> ST_AGN["Stage guidance with<br/>agency context<br/>(MEDDPICC readiness,<br/>RICE coverage)"]
    end

    subgraph AI Right Panel
        DH --> RTP["Right Intelligence Panel"]
        RTP --> SG["StageGuidance<br/>(agency-aware)"]
        RTP --> BM["Benchmarks"]
        RTP --> SR["AIStrategicReview<br/>(uses evidence tiers)"]
        RTP --> RISK["TopRisks<br/>(uses bias_flags)"]
    end

    subgraph Nudge Integration
        DH --> NUDGE_EVAL["useNudgeState<br/>(re-evaluate on<br/>realtime event)"]
        NUDGE_EVAL --> NUDGE_RENDER["NudgeBanner<br/>(if conditions met)"]
    end

    HS_AGN --> DIAL["Health Score Dial<br/>(animated ring)"]
    ST_AGN --> STEP["Journey Stepper<br/>(6 steps)"]
    NUDGE_RENDER --> BANNER["Dashboard banner<br/>(above content)"]

    style HS_AGN fill:#d1fae5,stroke:#059669
    style ST_AGN fill:#d1fae5,stroke:#059669
    style BC fill:#dbeafe,stroke:#3b82f6
    style NUDGE_EVAL fill:#d1fae5,stroke:#059669
```

### Realtime Event Types

| Event | Source | Dashboard Update |
|-------|--------|-----------------|
| `report_complete` | validator-start | Refresh health score, show "Import to Sprint" nudge |
| `canvas_saved` | lean-canvas-agent | Refresh completion metrics, update stage guidance |
| `sprint_task_moved` | Sprint Board UI | Refresh task counts, clear stale sprint nudge |
| `investor_scored` | investor-agent | Refresh investor count, update fundraising readiness |
| `deck_generated` | pitch-deck-agent | Refresh deck count, update journey stepper |

### Agency Data in Dashboard Components

| Component | Existing Data | Agency Enhancement |
|-----------|--------------|-------------------|
| Health Score | Canvas + profile completeness | + validator evidence tier confidence weighting |
| Stage Guidance | Journey step detection | + MEDDPICC readiness for fundraising stage |
| TopRisks | Health breakdown dimensions | + bias_flags from scoring fragment |
| AIStrategicReview | Report summary | + narrative_arc for structured review |
| FundraisingReadiness | Investor count + pipeline | + MEDDPICC aggregate scores |

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| No agency data in report | Diagrams 1, 8 still valid — agency subgraphs show as "skipped" |
| Chat mode not selected | Diagram 2 falls through to general mode — no fragment loaded |
| Investor has no MEDDPICC score | Diagram 3 shows existing flow only — MEDDPICC subgraph bypassed |
| Sprint board empty (no report import) | Diagram 4 starts from manual task creation instead of report import |
| RAG returns 0 chunks | Diagram 6 coach response works without citations (graceful degradation) |
| All nudge conditions false | Diagram 7 evaluates all triggers, renders nothing |
| Realtime disconnected | Diagram 8 falls back to polling via usePollingFallback hook |

## Real-World Examples

**Scenario 1 -- Full Pipeline Trace (Validator):** Marcus runs validation for his FinTech lending platform. A developer working on the pipeline opens `agency/mermaid/10-validator-agency-flow.md` and traces the entire data path: Marcus's pitch text enters the ExtractorAgent, flows through Research (with RAG search against 4,000+ knowledge chunks), hits ScoringAgent (where `validator-scoring-fragment.md` injects evidence tier rules via `loadFragment()`), producing `evidence_tier_counts` and `bias_flags`. These flow into ComposerAgent (where `validator-composer-fragment.md` adds three-act narrative structure), producing `narrative_arc` and `win_themes`. The VerifierAgent checks completeness, and the full report — including all agency fields — is inserted into `validator_reports` as JSONB. The developer knows exactly where evidence tiers originate and how they reach the Report UI. Without this diagram, they would need to read 6 files across 3 directories.

**Scenario 2 -- Sprint Integration Trace:** Priya's startup passes validation with 5 priority actions. She clicks "Import to Sprint" on the report page. A developer implementing this feature opens `agency/mermaid/13-sprint-rice-kano-flow.md` and sees: the `useSprintImport` hook maps `priority_actions[].action` to `sprint_tasks.title`, deduplicates via `source_action_id`, sends tasks to `sprint-agent` edge function which loads `sprint-agent-fragment.md`, Gemini applies RICE scoring (Reach x Impact x Confidence / Effort), classifies each task via Kano (must-have/performance/delight), sequences for momentum (quick wins first), and writes scored tasks to `sprint_tasks`. The Sprint Kanban renders cards with RICE score badges and Kano classification chips. The developer traces every transformation without guessing.

**Scenario 3 -- Dashboard Agency Enrichment:** A developer building the agency-aware dashboard opens `agency/mermaid/17-dashboard-realtime-flow.md`. They see that when a validator report completes, a broadcast event hits the `dashboard:{org_id}` channel, the `useDashboardMetrics` hook triggers `health-scorer` (which now factors in evidence tier confidence from the agency-enriched report), updates the health dial, refreshes stage guidance (now aware of MEDDPICC readiness for fundraising stages), and triggers `useNudgeState` to evaluate whether an "Import to Sprint" nudge should appear. The entire cascade from data write to UI render is visible in one diagram.

## Outcomes

| Before | After |
|--------|-------|
| Developers read 25+ task prompts to understand data flow | Each workflow has a single diagram showing the complete data path |
| Fragment injection points are described in prose | Visual subgraphs show exactly where fragments enter the pipeline |
| Agency vs. existing code boundaries are unclear | Green subgraphs (agency) vs. blue subgraphs (existing) make boundaries obvious |
| Dashboard realtime cascade is undocumented | Diagram 8 shows every event type and its downstream UI effect |
| RICE/Kano scoring integration is scattered across 3 prompts | Diagram 4 traces the full path: report actions to scored Kanban cards |
| RAG integration in canvas coaching is implicit | Diagram 6 shows embedding, search, citation injection, and UI rendering |

---

## Production Ready Checklist

- [ ] All 8 diagram files created in `agency/mermaid/`
- [ ] Each file has YAML frontmatter (id, phase, type, title, prd_section, roadmap_task)
- [ ] Each Mermaid diagram renders correctly (validate with Mermaid Live Editor)
- [ ] Green styling (`fill:#059669` / `fill:#d1fae5`) used for agency additions
- [ ] Blue styling (`fill:#dbeafe` / `fill:#3b82f6`) used for existing infrastructure
- [ ] `agency/mermaid/00-index.md` updated with AGN-10 through AGN-17
- [ ] Field tables document all new/modified fields per diagram
- [ ] Integration notes explain key wiring decisions

## Cross References

| Document | Path |
|----------|------|
| Existing Diagram Index | `agency/mermaid/00-index.md` |
| Validator Pipeline Sequence | `agency/mermaid/03-validator-enhanced-pipeline.md` |
| Chat Mode Flow | `agency/mermaid/04-chat-mode-flow.md` |
| Investor MEDDPICC Flow | `agency/mermaid/06-investor-meddpicc-flow.md` |
| Behavioral Nudge System | `agency/mermaid/07-behavioral-nudge-system.md` |
| Infrastructure Index | `agency/prompts/100-index.md` |
| ERD Diagrams (dependency) | `agency/prompts/102-agency-erd-diagrams.md` |
| Agent Loader Runtime | `agency/prompts/001-agent-loader-runtime.md` |
| Fragment Files | `agency/prompts/validator-scoring-fragment.md`, `validator-composer-fragment.md`, `crm-investor-fragment.md`, `sprint-agent-fragment.md`, `pitch-deck-fragment.md` |
