# Agency-Enhanced Features — Product Requirements Document

**Version:** 1.0 | **Date:** 2026-03-12
**Status:** Draft — all wireframes complete, no code changes yet
**Audience:** Engineering team, product builders
**Source:** 132-agent agency-agents library (MIT) → 27 curated files → 6 screens

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [What We Integrated](#3-what-we-integrated)
4. [Architecture](#4-architecture)
5. [Enhanced Screens (6)](#5-enhanced-screens-6)
6. [New Chat Modes (4)](#6-new-chat-modes-4)
7. [Schema Changes](#7-schema-changes)
8. [Edge Function Modifications](#8-edge-function-modifications)
9. [User Stories](#9-user-stories)
10. [User Journeys](#10-user-journeys)
11. [Acceptance Criteria](#11-acceptance-criteria)
12. [Implementation Phases](#12-implementation-phases)
13. [Dependencies](#13-dependencies)
14. [Risks & Mitigations](#14-risks--mitigations)
15. [Success Criteria](#15-success-criteria)
16. [References](#16-references)

---

## 1. Executive Summary

We integrated expert-level business frameworks from a 132-agent open source library into StartupAI's existing AI features. The integration adds professional methodologies (MEDDPICC, RICE, ICE, Kano, AARRR, Challenger Sale, Evidence Tiers) to 6 screens and creates 4 new AI Chat modes — with zero frontend build impact.

### What changes

| Before (current) | After (with agency) |
|-------------------|---------------------|
| Validation reports read like Wikipedia summaries | Three-act narrative with evidence-weighted scores and bias flags |
| Sprint tasks generated randomly | RICE-scored, Kano-classified, momentum-sequenced |
| Blank pitch deck slide generation | Challenger 5-step narrative with win themes and persuasion architecture |
| One AI chat mode that does everything poorly | 4 expert modes: Practice Pitch, Growth Strategy, Deal Review, Canvas Coach |
| Investor pipeline with names and stages | MEDDPICC-scored deals (/40), signal-based timing, cold email builder |
| Lean canvas with generic AI suggestions | Specificity scoring (0-100%), evidence types, behavioral nudges |

### Integration scope

- **27 files** added across 4 layers (no existing files modified)
- **0 frontend build impact** — all files are markdown prompts and a TypeScript loader
- **6 screens enhanced** — existing pages get richer AI output
- **4 new chat modes** — specialized AI personalities for specific tasks
- **MIT licensed** — fork pinned at `sunai-v1` tag

---

## 2. Problem Statement

StartupAI's AI features produce generic output. The validator scores ideas but doesn't explain *why* with a narrative. The sprint board generates tasks but doesn't prioritize them by impact. The investor pipeline tracks stages but doesn't score deal quality. The AI chat gives the same advice regardless of what the founder needs.

### Root cause

Our edge functions have good pipelines but **no domain expertise**. They call Gemini/Claude with task instructions but without the business frameworks that professional advisors use.

### Solution

Inject curated expert knowledge (prompt fragments and chat mode prompts) into the system prompts of existing edge functions at runtime. The edge function code stays the same — only the system prompt gets richer.

---

## 3. What We Integrated

### 4-Layer Architecture

| Layer | Count | Location | Runtime |
|-------|-------|----------|---------|
| **Dev Workflow Agents** | 10 | `.claude/agents/agency-*.md` | Dev time (Claude Code subagents) |
| **Domain Skills** | 8 | `.agents/skills/*/SKILL.md` | Dev time (reusable knowledge) |
| **Prompt Fragments** | 5 | `agency/prompts/*.md` | Runtime (injected into edge functions) |
| **Chat Mode Prompts** | 4 | `agency/chat-modes/*.md` | Runtime (loaded by AI Chat) |

### Prompt Fragments (runtime — injected into edge functions)

| Fragment | Target Edge Function | Frameworks Added |
|----------|---------------------|-----------------|
| `validator-scoring-fragment.md` | `validator-start` (scoring agent) | Evidence tiers (cited=1.0, claim=0.8, AI=0.6), RICE-scored priority actions, bias detection (anchoring, confirmation, survivorship, availability, optimism, sunk cost) |
| `validator-composer-fragment.md` | `validator-start` (composer agent) | Three-act narrative (mirror→tension→resolution), win themes extraction, ICE-scored channel recommendations |
| `crm-investor-fragment.md` | `investor-agent`, `crm-agent` | MEDDPICC scoring (8 dims × 5 = /40), signal-based engagement timing, cold email anatomy (signal→value→proof→CTA, <120 words) |
| `sprint-agent-fragment.md` | `sprint-agent` | RICE scoring (Reach×Impact×Confidence/Effort), Kano classification (must-have/performance/delighter), momentum sequencing (quick wins first) |
| `pitch-deck-fragment.md` | `pitch-deck-agent` | Win theme architecture (2-3 themes, each hit 2-3 times), Challenger narrative (insight→cost→new way→reveal→CTA), persuasion architecture (7 cognitive biases mapped to slide positions) |

### Chat Mode Prompts (runtime — loaded by AI Chat)

| Mode | Source Skills | User Scenario |
|------|-------------|---------------|
| `practice-pitch.md` | sales-coach + deal-strategist | Founder delivers 60-second pitch, AI scores 5 dimensions (/50), coaches weakest, re-delivery |
| `growth-strategy.md` | growth-hacker | AI diagnoses AARRR funnel, identifies bottleneck, designs ICE-scored experiments |
| `deal-review.md` | deal-strategist + pipeline-analyst | AI MEDDPICC-scores each investor deal, surfaces red flags, recommends next actions |
| `canvas-coach.md` | feedback-synthesizer + behavioral-nudge | AI finds weakest canvas box, asks probing questions, tracks specificity improvement |

### Domain Skills (dev time — background knowledge)

| Skill | Used By | Key Methodology |
|-------|---------|-----------------|
| `growth-hacker/` | Composer Group C, Growth Strategy mode | AARRR, viral loops, channel selection |
| `deal-strategist/` | investor-agent, Deal Review mode | MEDDPICC for fundraising |
| `sprint-prioritizer/` | sprint-agent | RICE + Kano + momentum |
| `outbound-strategist/` | crm-agent, investor outreach | Signal timing, email frameworks |
| `feedback-synthesizer/` | Scoring Agent, Canvas Coach mode | Evidence weighting |
| `behavioral-nudge/` | Dashboard, Sprint Board, Canvas | Progress triggers, loss framing |
| `sales-coach/` | Practice Pitch mode | Pitch scoring methodology |
| `proposal-strategist/` | pitch-deck-agent, Composer | Win themes, narrative arcs |

### Dev Workflow Agents (Claude Code subagents)

10 agents in `.claude/agents/agency-*.md` covering frontend, backend, database, security, architecture, code review, AI engineering, API testing, performance, and production readiness.

---

## 4. Architecture

### Runtime Flow

```
Edge Function receives request
     │
     ├─ loadFragment('validator-scoring-fragment')
     │      │
     │      └── Reads agency/prompts/validator-scoring-fragment.md
     │          Appends to system prompt as "Enhanced Scoring Rules"
     │
     └─ Edge function calls Gemini/Claude with enriched prompt
            │
            └── AI output now includes evidence tiers, bias flags, RICE scores
```

### Agent Loader (`agency/lib/agent-loader.ts`)

```typescript
import { loadFragment } from '../../agency/lib/agent-loader.ts'
import { loadChatMode } from '../../agency/lib/agent-loader.ts'

// Fragment injection (edge functions)
const fragment = await loadFragment('validator-scoring-fragment')
const systemPrompt = `${basePrompt}\n\n## Enhanced Rules\n${fragment}`

// Chat mode loading (AI Chat)
const modePrompt = await loadChatMode('practice-pitch')
const systemPrompt = `${baseContext}\n\n${modePrompt}`
```

### Screen ← Fragment ← Skill Mapping

```
SCREEN                    FRAGMENT                        SKILLS
─────                     ────────                        ──────
Validator Report    ←──   validator-scoring-fragment  ←── feedback-synthesizer
                    ←──   validator-composer-fragment ←── proposal-strategist, growth-hacker

Sprint Board        ←──   sprint-agent-fragment      ←── sprint-prioritizer, behavioral-nudge

Pitch Deck Editor   ←──   pitch-deck-fragment        ←── proposal-strategist, sales-coach

AI Chat (4 modes)   ←──   practice-pitch.md          ←── sales-coach, deal-strategist
                    ←──   growth-strategy.md          ←── growth-hacker
                    ←──   deal-review.md              ←── deal-strategist
                    ←──   canvas-coach.md             ←── feedback-synthesizer, behavioral-nudge

Investor Pipeline   ←──   crm-investor-fragment      ←── deal-strategist, outbound-strategist

Lean Canvas         ←──   canvas-coach.md (chat mode) ←── feedback-synthesizer, behavioral-nudge
```

---

## 5. Enhanced Screens (6)

### 5.1 Validator Report (`/validator/report/:id`)

**Current state:** 14-section report with prose executive summary, numeric scores, basic competitor grid.

**Agency enhancements:**

| Feature | Current | Enhanced |
|---------|---------|----------|
| Executive summary | Plain paragraph | Three-act narrative (mirror→tension→resolution) |
| Scoring confidence | All scores treated equally | Evidence-weighted: cited (1.0), founder claim (0.8), AI guess (0.6) |
| Bias detection | None | Flags anchoring, confirmation, survivorship, availability, optimism, sunk cost biases |
| Growth channels | Generic suggestions | ICE-scored (Impact×Confidence×Ease) with stage-appropriate recommendations |
| Priority actions | Unordered list | RICE-scored, top-5 ranked by Reach×Impact×Confidence/Effort |
| Win themes | Not present | 2-3 recurring strengths extracted from report, tracked across sections |

**New UI elements:**
- Evidence tier badges per data point: `[Cited] ✓` green, `[Founder] ?` amber, `[AI] ⚠` red
- Bias warning banners when detected
- ICE score chips on recommended channels
- Win theme badges in executive summary

**Wireframe:** `agency/wireframes/01-validator-report.md`

### 5.2 Sprint Board (`/sprint-plan`)

**Current state:** 5-column Kanban with AI-generated tasks. No prioritization framework.

**Agency enhancements:**

| Feature | Current | Enhanced |
|---------|---------|----------|
| Task priority | Manual (high/medium/low) | RICE-scored numeric priority |
| Task classification | None | Kano-classified: Must-Have, Performance, Delighter |
| Sprint sequencing | Random order | Momentum-optimized: quick wins in Sprint 1 |
| Task risk | None | Risk flags on experiment/research tasks |
| Sprint health | Task count | Kano balance indicator (>50% must-haves = healthy) |

**New UI elements:**
- RICE score badge on each task card (numeric, e.g., `12.0`)
- Kano type chips: `[Must-Have]` red, `[Performance]` blue, `[Delighter]` purple
- Sprint health bar showing Kano balance
- Quick Win indicator (green bolt icon) on highest-RICE tasks
- Momentum indicator at sprint level

**Wireframe:** `agency/wireframes/02-sprint-board.md`

### 5.3 Pitch Deck Editor (`/app/pitch-deck/:id/edit`)

**Current state:** Slide rail + canvas + AI generation. Generic slide content.

**Agency enhancements:**

| Feature | Current | Enhanced |
|---------|---------|----------|
| Slide generation | Feature-focused | Challenger 5-step narrative (insight→cost→new way→reveal→CTA) |
| Slide content | Generic copy | Win-theme-reinforced with loss framing |
| Narrative structure | No story arc | Story arc tracked with position indicator |
| Persuasion awareness | None | Each slide tagged with cognitive bias type |
| Speaker notes | Basic talking points | Include persuasion rationale and delivery cues |
| Deck review | No quality check | Arc completeness, theme coverage, bias balance checks |

**New UI elements:**
- Win theme badge on each slide card (e.g., `♦ AI cuts no-shows by 40%`)
- Narrative position label: `[1/5 Insight]`, `[2/5 Cost]`, etc.
- Persuasion type tag: `[Primacy]`, `[Loss Aversion]`, `[Social Proof]`, etc.
- Story arc progress indicator (5 dots, filled = covered)
- AI panel: Win theme coverage, narrative arc completeness, persuasion balance

**Persuasion architecture (7 biases mapped to deck position):**

| Bias | Deck Position | Effect |
|------|--------------|--------|
| Primacy | Slide 1 (Title) | First impression anchors perception |
| Loss aversion | Slides 2-3 (Problem/Stakes) | Fear of loss > desire for gain |
| Anchoring | Slide 4 (Solution) | Set reference point for value |
| Social proof | Slides 5-6 (Traction) | Others validate the claim |
| Authority | Slide 7 (Team) | Expert credibility |
| Scarcity | Slides 7-8 (Timeline) | Limited window to act |
| Recency | Slide 8 (Ask/CTA) | Last thing remembered |

**Wireframe:** `agency/wireframes/03-pitch-deck-editor.md`

### 5.4 Investor Pipeline (`/investors`)

**Current state:** 8-column Kanban with investor cards showing name, stage, check size.

**Agency enhancements:**

| Feature | Current | Enhanced |
|---------|---------|----------|
| Investor cards | Name + stage + check size | + MEDDPICC score (/40) + verdict badge + signal dot |
| Deal assessment | Manual status updates | MEDDPICC-scored with specific dimension gaps |
| Outreach | Blank compose box | Signal-based cold email anatomy (4 sections, <120 words) |
| Timing | No engagement guidance | Signal-based indicators (strong/medium/weak) |
| Pipeline review | No aggregate analysis | Summary stats + red flags + reallocation recommendations |
| Prioritization | Manual ordering | Verdict-based: close Strong, push Battling, drop Unqualified |

**MEDDPICC scoring (8 dimensions × 5 points = /40):**

| Dimension | Max | Scoring Criteria |
|-----------|-----|-----------------|
| Metrics | 5 | Quantified success criteria defined |
| Economic Buyer | 5 | Direct access to check-writer (GP, not associate) |
| Decision Criteria | 5 | Evaluation framework known |
| Decision Process | 5 | Steps + timeline to close mapped |
| Paper Process | 5 | Legal/admin path clear |
| Identify Pain | 5 | Pain acknowledged by investor |
| Champion | 5 | Internal advocate actively pushing |
| Compelling Event | 5 | Why now — deadline or trigger exists |

**Deal verdict badges:**

| Verdict | Score | Color | Action |
|---------|-------|-------|--------|
| Strong | 32-40 | Green | Close — respond within 24h |
| Battling | 24-31 | Blue | Push — request next concrete step |
| At Risk | 16-23 | Amber | Rescue — find champion or compelling event |
| Unqualified | 0-15 | Red | Stop — reallocate time |

**Signal timing indicators:**

| Strength | Indicator | Source | Action Window |
|----------|-----------|--------|---------------|
| Strong | 🟢 | Partner posted about your sector | Within 24h |
| Medium | 🟡 | Fund announced adjacent thesis | Within 1 week |
| Weak | ⚪ | General market activity | Low priority |

**Cold email anatomy (<120 words):**
1. Signal opener (1-2 sentences) — reference their recent activity
2. Value prop (1-2 sentences) — data-driven outcome
3. Social proof (1 sentence) — traction or reference customer
4. CTA (1 sentence) — low-friction ask (15-min call, not full pitch)

**Wireframe:** `agency/wireframes/05-investor-pipeline.md`

### 5.5 Lean Canvas (`/lean-canvas`)

**Current state:** 9-box editor with AI per-box suggestions, autosave, versioning.

**Agency enhancements:**

| Feature | Current | Enhanced |
|---------|---------|----------|
| Box content | Plain text, no quality indicator | Specificity score (0-100%) per box with colored progress bar |
| Evidence tracking | No distinction | Tagged: `[Cited]` (data), `[Founder]` (claim), `[AI]` (guess) |
| AI suggestions | Generic per-box suggestions | Coach-driven probing questions that sharpen specifics |
| Progress | Completion % (filled/empty) | Specificity-weighted progress with health dashboard |
| Nudges | None | Behavioral nudges at milestones, pauses, and risk points |
| Report integration | Manual prefill | Auto-populate with evidence types from validator report |

**Specificity scoring:**

| Score | Color | Label | Meaning |
|-------|-------|-------|---------|
| 80-100% | Green | Strong | Specific, testable, data-backed |
| 50-79% | Blue | Developing | Some specifics, needs more detail |
| 20-49% | Amber | Weak | Too vague to test or validate |
| 0-19% | Red | Empty/Generic | Placeholder or single word |

**Behavioral nudges:**

| Trigger | Type | Example |
|---------|------|---------|
| Session start | Progress anchor | "4 of 9 boxes filled — almost halfway!" |
| Box reaches 80% | Positive reinforcement | "Your Problem box is strong — build on it" |
| 3+ boxes strong | Social proof | "Founders who fill 6+ boxes raise 2x faster" |
| Revenue box empty | Loss frame | "67% of startups that skip Revenue modeling run out of cash" |
| Long pause (>5 min) | Gentle prompt | "Ready to work on the next box?" |

**Canvas health dashboard (AI panel):**
- Overall progress: average of 9 specificity scores
- Boxes strong (80%+): count
- Weakest box: name + score
- Evidence mix: ratio of cited/founder/AI items

**Wireframe:** `agency/wireframes/06-lean-canvas.md`

### 5.6 AI Chat — Mode Selector (`/ai-chat`)

**Current state:** Single chat mode that handles all queries generically.

**Agency enhancement:** Add a mode selector UI that loads specialized system prompts.

**New UI element:** Mode selector bar at top of chat: `[General] [Practice Pitch] [Growth Strategy] [Deal Review] [Canvas Coach]`

Each mode gets a specialized right panel — see Section 6 for details.

**Wireframe:** `agency/wireframes/04-ai-chat-modes.md`

---

## 6. New Chat Modes (4)

### 6.1 Practice Pitch Mode

**Purpose:** Founder practices 60-second elevator pitch with a tough AI investor.

**Flow:**
1. AI says: "Deliver your 60-second elevator pitch."
2. Founder delivers pitch (text)
3. AI scores 5 dimensions × 10 points = /50
4. AI asks 3 hard investor questions tailored to the data
5. AI coaches the weakest dimension with specific language changes
6. Founder re-delivers → score improves
7. AI assigns practice homework

**Scoring dimensions:**

| Dimension | Max | What it measures |
|-----------|-----|-----------------|
| Clarity | 10 | Can I explain this to a 5-year-old? |
| Urgency | 10 | Why should I care *now*? Cost of inaction quantified? |
| Differentiation | 10 | Why you and not 10 others? |
| The Ask | 10 | Specific amount, use of funds, timeline? |
| Confidence | 10 | Conviction without arrogance? |

**Right panel:** Score radar chart, dimension breakdown, coaching focus, session history.

### 6.2 Growth Strategy Mode

**Purpose:** Founder diagnoses growth bottleneck and designs experiments.

**Flow:**
1. AI asks: "What are your current numbers? Signups, activation, retention, revenue?"
2. AI maps to AARRR funnel, identifies weakest stage
3. AI recommends stage-appropriate channels (pre-PMF: organic; post-PMF: paid)
4. AI designs 3 ICE-scored experiments for the bottleneck
5. Top experiment becomes sprint tasks

**AARRR benchmarks:**

| Stage | Healthy | Warning | Critical |
|-------|---------|---------|----------|
| Acquisition | Positive trend | Flat | Declining |
| Activation | >60% | 30-60% | <30% |
| Retention | >40% M1 | 20-40% | <20% |
| Revenue | Growing MRR | Flat | Negative |
| Referral | >20% viral | 5-20% | <5% |

**ICE scoring:** Impact (1-10) × Confidence (1-10) × Ease (1-10) = /1000. Top experiment wins.

**Right panel:** AARRR funnel visualization, ICE leaderboard, experiment cards.

### 6.3 Deal Review Mode

**Purpose:** Founder reviews investor pipeline with AI deal strategist.

**Flow:**
1. AI says: "Walk me through your top 3 deals."
2. AI pulls CRM data for each investor
3. AI MEDDPICC-scores each deal /40
4. AI assigns verdicts: Strong / Battling / At Risk / Unqualified
5. AI surfaces red flags across pipeline
6. AI recommends: close Strong, push Battling, drop Unqualified

**Right panel:** Pipeline scorecard, dimension gaps per deal, red flag list, time allocation recommendation.

### 6.4 Canvas Coach Mode

**Purpose:** Founder improves lean canvas box-by-box with AI coaching.

**Flow:**
1. AI identifies weakest box by specificity score
2. AI asks probing questions: "Your Customer Segments says 'small businesses' — How many employees? What industry? Revenue range?"
3. Founder refines answer
4. AI updates specificity score, adds evidence tag
5. Behavioral nudge at milestones
6. Repeat for next weakest box

**Right panel:** Canvas health dashboard, current box specificity, probing question list, evidence type counts.

---

## 7. Schema Changes

### New columns on existing tables

| Table | Column | Type | Purpose |
|-------|--------|------|---------|
| `investors` | `meddpicc_score` | `integer` | MEDDPICC composite score (0-40) |
| `investors` | `deal_verdict` | `text` | `'strong'` / `'battling'` / `'at_risk'` / `'unqualified'` |
| `investors` | `signal_data` | `jsonb` | `{type, description, source, strength, date}` |

### Enhanced JSONB fields (no schema migration needed)

These fields are already JSONB and will receive additional structured data from enriched AI output:

| Table | Field | New Data |
|-------|-------|----------|
| `validator_reports` | `details` | `evidence_tiers`, `bias_flags`, `win_themes`, `ice_channels` in relevant sections |
| `pitch_decks` | `deck_json.slides[i]` | `win_theme`, `narrative_position`, `persuasion_type` per slide |
| `lean_canvases` | `canvas_data[box]` | `specificity_score`, `evidence_type` per item |
| `sprint_tasks` | task metadata | `rice_score`, `kano_type`, `momentum_sequence` |

### New table (optional — for chat mode state)

```sql
CREATE TABLE IF NOT EXISTS chat_mode_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id),
  user_id uuid REFERENCES auth.users(id),
  mode text NOT NULL, -- 'practice_pitch', 'growth_strategy', 'deal_review', 'canvas_coach'
  session_data jsonb DEFAULT '{}',
  score_history jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE chat_mode_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own sessions" ON chat_mode_sessions
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));
```

---

## 8. Edge Function Modifications

### Fragment injection pattern (same for all 5 EFs)

```typescript
// In edge function handler, after building base system prompt:
import { loadFragment } from '../../agency/lib/agent-loader.ts'

const fragment = await loadFragment('validator-scoring-fragment')
const systemPrompt = `${basePrompt}\n\n## Enhanced Scoring Rules\n${fragment}`
```

### Per-function changes

| Edge Function | Fragment to Load | Agent/Action Modified | New Output Fields |
|---------------|-----------------|----------------------|-------------------|
| `validator-start` (scoring.ts) | `validator-scoring-fragment` | Scoring agent system prompt | `evidence_tiers`, `bias_flags`, `rice_actions` |
| `validator-start` (composer.ts) | `validator-composer-fragment` | Composer Groups A/C/D prompts | `narrative_structure`, `win_themes`, `ice_channels` |
| `sprint-agent` | `sprint-agent-fragment` | Task generation prompt | `rice_score`, `kano_type`, `momentum_order` |
| `pitch-deck-agent` | `pitch-deck-fragment` | Slide generation prompt | `win_theme`, `narrative_position`, `persuasion_type` per slide |
| `investor-agent` | `crm-investor-fragment` | Scoring + outreach actions | `meddpicc_score`, `deal_verdict`, `signal_data`, email drafts |
| `crm-agent` | `crm-investor-fragment` | Deal scoring action | `meddpicc_score`, `deal_verdict` |
| `ai-chat` | Chat mode prompts (4) | Mode-specific system prompts | Scoring data, experiment designs, coaching output |
| `lean-canvas-agent` (coach) | `canvas-coach.md` (via loadChatMode) | Coach action prompt | `specificity_scores`, `evidence_types`, `nudge_cards` |

### Gemini schema updates

Each edge function's `responseJsonSchema` needs updating to include the new output fields. All new fields are **optional** for backward compatibility.

Example for scoring agent:
```typescript
// Add to existing schema
evidence_tiers: {
  type: "object",
  properties: {
    cited_count: { type: "integer" },
    founder_count: { type: "integer" },
    ai_count: { type: "integer" }
  }
},
bias_flags: {
  type: "array",
  items: {
    type: "object",
    properties: {
      type: { type: "string", enum: ["anchoring", "confirmation", "survivorship", "availability", "optimism", "sunk_cost"] },
      description: { type: "string" },
      severity: { type: "string", enum: ["high", "medium", "low"] }
    }
  }
}
```

---

## 9. User Stories

### Validation & Scoring

| ID | Story | Screen |
|----|-------|--------|
| AG-01 | As a founder, I want my validation report to tell a narrative so I can forward it to my advisor | Validator Report |
| AG-02 | As a founder, I want to see which claims are data-backed vs my own assumptions so I know what to validate | Validator Report |
| AG-03 | As a founder, I want bias warnings so I don't fool myself about market size | Validator Report |
| AG-04 | As a founder, I want growth channels ranked by impact/ease so I know which to try first | Validator Report |

### Sprint & Execution

| ID | Story | Screen |
|----|-------|--------|
| AG-05 | As a founder, I want tasks prioritized by RICE score so I work on highest-impact items | Sprint Board |
| AG-06 | As a founder, I want tasks classified as must-have/performance/delighter so I know what's essential vs nice-to-have | Sprint Board |
| AG-07 | As a founder, I want quick wins first in Sprint 1 so I build momentum | Sprint Board |

### Pitch Deck

| ID | Story | Screen |
|----|-------|--------|
| AG-08 | As a founder, I want my pitch deck to follow a proven narrative arc so investors stay engaged | Pitch Deck Editor |
| AG-09 | As a founder, I want win themes tracked across slides so my core strengths are reinforced | Pitch Deck Editor |
| AG-10 | As a founder, I want to see which cognitive bias each slide uses so I can balance my persuasion | Pitch Deck Editor |

### Investor Pipeline

| ID | Story | Screen |
|----|-------|--------|
| AG-11 | As a founder, I want each investor deal scored by MEDDPICC so I know deal strength objectively | Investor Pipeline |
| AG-12 | As a founder, I want signal-based timing so I know *when* to reach out to each investor | Investor Pipeline |
| AG-13 | As a founder, I want AI-drafted cold emails using proven anatomy so my outreach converts | Investor Pipeline |
| AG-14 | As a founder, I want deal verdicts (Strong/Battling/At Risk/Unqualified) so I stop wasting time | Investor Pipeline |

### AI Chat Modes

| ID | Story | Screen |
|----|-------|--------|
| AG-15 | As a founder, I want to practice my pitch with a tough AI investor so I'm ready for real meetings | AI Chat: Practice Pitch |
| AG-16 | As a founder, I want my growth bottleneck diagnosed from my AARRR funnel so I fix the right stage | AI Chat: Growth Strategy |
| AG-17 | As a founder, I want my investor pipeline reviewed and scored so I focus on winnable deals | AI Chat: Deal Review |
| AG-18 | As a founder, I want my lean canvas coached box-by-box so "small businesses" becomes a specific segment | AI Chat: Canvas Coach |

### Lean Canvas

| ID | Story | Screen |
|----|-------|--------|
| AG-19 | As a founder, I want specificity scores per box so I know which boxes need work | Lean Canvas |
| AG-20 | As a founder, I want evidence types on each item so I know what's data-backed vs assumed | Lean Canvas |
| AG-21 | As a founder, I want behavioral nudges at milestones so I stay motivated | Lean Canvas |

---

## 10. User Journeys

### Journey 1: Sarah Validates Her Idea

Sarah describes her B2B dental SaaS → AI asks 12 follow-up questions → 7-agent pipeline runs → Report comes back with:
- Three-act executive summary (not generic paragraph)
- Evidence tiers on all data points (cited vs founder claim vs AI guess)
- Bias flag: "TAM anchored to founder estimate" warning
- ICE-scored channels: Content marketing (720) > Dental associations (540) > Cold outreach (320)
- RICE-scored priority actions: "Interview 5 clinic managers" tops the list

Sarah forwards the report to her advisor — it reads like a consulting deliverable.

### Journey 2: Aisha Reviews Her Investor Pipeline

Aisha has 8 investor conversations → Opens Deal Review chat mode → AI MEDDPICC-scores each deal:
- Sequoia: 14/40, Unqualified (only spoke to associate, no champion)
- Lightspeed: 28/40, Battling (partner engaged but no paper process)
- a16z: 34/40, Strong (GP championing, term sheet started)

Red flags surfaced: "No compelling event on 3 deals." Signal timing: "Lightspeed partner just posted about AI infra — reach out within 24h." Aisha stops wasting time on Sequoia, pushes Lightspeed with a signal-based email, and focuses on closing a16z.

### Journey 3: Jake Plans Growth Experiments

Jake has 500 signups and 12% activation → Opens Growth Strategy mode → AI diagnoses: "Activation at 12% is your bottleneck (healthy is 60%+). Fix activation before acquiring more users."

AI designs 3 ICE-scored experiments:
1. Reduce onboarding 7→3 steps (ICE: 720, $0 cost, 2 weeks)
2. Welcome email series (ICE: 480)
3. In-app tooltips (ICE: 360)

Experiment #1 flows to Sprint Board as RICE-scored tasks with a quick win first.

### Journey 4: Priya Practices Her Pitch

Priya delivers her 60-second pitch → AI scores: 32/50 (Clarity 8, Urgency 4, Differentiation 7, Ask 6, Confidence 7). Weakest: Urgency (4/10).

AI coaches: "Replace 'supply chains are inefficient' with '$2.3M/year in excess inventory — we cut that by 60% in 90 days.'" Priya re-delivers → Score: 41/50 (+9). Urgency: 4→8/10.

AI assigns: "Practice this version 3 times before your Lightspeed meeting."

---

## 11. Acceptance Criteria

### Fragment Integration

- [ ] `loadFragment()` reads markdown file and returns string
- [ ] `loadChatMode()` reads chat mode file and returns string
- [ ] All 5 fragments loadable from edge function runtime
- [ ] All 4 chat modes loadable from AI Chat
- [ ] Fragment injection does not break existing edge function behavior
- [ ] All new output fields are optional (backward compatible)

### Validator Report (AG-01 through AG-04)

- [ ] Executive summary uses three-act structure (mirror→tension→resolution)
- [ ] Each data point shows evidence tier badge: `[Cited] ✓`, `[Founder] ?`, `[AI] ⚠`
- [ ] Bias flags display as amber warning banners when detected
- [ ] Growth channels show ICE score and are sorted by score descending
- [ ] Priority actions show RICE score and are ranked top-5
- [ ] Win themes extracted and displayed in summary

### Sprint Board (AG-05 through AG-07)

- [ ] Each task card shows RICE score badge
- [ ] Each task shows Kano type chip (Must-Have/Performance/Delighter)
- [ ] Sprint 1 starts with highest-RICE quick win task
- [ ] Sprint health bar shows Kano balance (>50% must-haves = green)

### Pitch Deck Editor (AG-08 through AG-10)

- [ ] Each slide card shows win theme badge
- [ ] Each slide shows narrative position (Act 1-5)
- [ ] Each slide shows persuasion type tag
- [ ] Story arc indicator shows 5 dots with coverage
- [ ] AI panel shows persuasion balance and missing biases
- [ ] Deck review warns if narrative arc incomplete

### Investor Pipeline (AG-11 through AG-14)

- [ ] Each investor card shows MEDDPICC score (/40) and verdict badge
- [ ] Verdict badge uses correct color: green/blue/amber/red
- [ ] Signal timing dot appears on cards with signals
- [ ] "Draft Outreach" generates <120 word email with 4-section anatomy
- [ ] Pipeline summary shows aggregate stats and red flags

### AI Chat Modes (AG-15 through AG-18)

- [ ] Mode selector bar appears at top of AI Chat page
- [ ] Selecting a mode loads the corresponding chat mode prompt
- [ ] Practice Pitch: scores 5 dimensions, coaches weakest, supports re-delivery
- [ ] Growth Strategy: diagnoses AARRR funnel, designs ICE-scored experiments
- [ ] Deal Review: MEDDPICC-scores deals, shows verdicts and red flags
- [ ] Canvas Coach: identifies weakest box, asks probing questions, tracks specificity

### Lean Canvas (AG-19 through AG-21)

- [ ] Each box shows specificity score (0-100%) with colored progress bar
- [ ] Each item shows evidence type badge
- [ ] Canvas health dashboard in AI panel shows overall progress
- [ ] Behavioral nudges appear at milestones (session start, box reaches 80%, 3+ strong, revenue empty)
- [ ] Canvas Coach integration works from AI panel

---

## 12. Implementation Phases

### Phase 1: Foundation (1-2 days)

**Goal:** Runtime loader working, first fragment wired.

| Task | Description | Files |
|------|-------------|-------|
| 1.1 | Implement `loadFragment()` in `agent-loader.ts` | `agency/lib/agent-loader.ts` |
| 1.2 | Implement `loadChatMode()` in `agent-loader.ts` | `agency/lib/agent-loader.ts` |
| 1.3 | Wire `validator-scoring-fragment` into scoring agent | `validator-start/agents/scoring.ts` |
| 1.4 | Wire `validator-composer-fragment` into composer | `validator-start/agents/composer.ts` |
| 1.5 | Update Gemini schemas for new output fields | `validator-start/schemas.ts` |
| 1.6 | Test: run validator pipeline, verify new fields in report | Manual E2E |

### Phase 2: Sprint + Investor (2-3 days)

**Goal:** Sprint and investor frameworks wired.

| Task | Description | Files |
|------|-------------|-------|
| 2.1 | Wire `sprint-agent-fragment` into sprint-agent | `sprint-agent/index.ts` |
| 2.2 | Add RICE/Kano UI to sprint board | `SprintPlan.tsx`, `KanbanBoard.tsx` |
| 2.3 | Wire `crm-investor-fragment` into investor-agent | `investor-agent/index.ts` |
| 2.4 | Add MEDDPICC + verdict UI to investor pipeline | `InvestorPipeline.tsx`, `InvestorCard.tsx` |
| 2.5 | Add cold email builder component | New component |
| 2.6 | Schema migration: add `meddpicc_score`, `deal_verdict`, `signal_data` to investors | Migration |

### Phase 3: Pitch Deck + Lean Canvas (2-3 days)

**Goal:** Pitch and canvas frameworks wired.

| Task | Description | Files |
|------|-------------|-------|
| 3.1 | Wire `pitch-deck-fragment` into pitch-deck-agent | `pitch-deck-agent/index.ts` |
| 3.2 | Add win theme + narrative + persuasion UI to editor | `PitchDeckEditor.tsx`, `SlideEditor.tsx` |
| 3.3 | Add story arc indicator component | New component |
| 3.4 | Wire `canvas-coach.md` into lean-canvas-agent | `lean-canvas-agent/index.ts` |
| 3.5 | Add specificity scoring UI to canvas | `LeanCanvas.tsx`, `CanvasBox.tsx` |
| 3.6 | Add evidence type badges | `CanvasBox.tsx` |
| 3.7 | Add behavioral nudge system | New component |

### Phase 4: AI Chat Modes (2-3 days)

**Goal:** 4 expert chat modes working.

| Task | Description | Files |
|------|-------------|-------|
| 4.1 | Add mode selector UI to AI Chat | `AIChat.tsx` or new component |
| 4.2 | Wire `loadChatMode()` into `ai-chat` edge function | `ai-chat/index.ts` |
| 4.3 | Build Practice Pitch mode right panel | New component |
| 4.4 | Build Growth Strategy mode right panel | New component |
| 4.5 | Build Deal Review mode right panel | New component |
| 4.6 | Build Canvas Coach mode right panel | New component |
| 4.7 | Optional: chat_mode_sessions table for persistence | Migration |

### Phase 5: Polish & Verify (1-2 days)

**Goal:** All features tested and backward compatible.

| Task | Description |
|------|-------------|
| 5.1 | Verify all existing reports still render correctly (backward compat) |
| 5.2 | Verify all existing sprint tasks still display correctly |
| 5.3 | Test each chat mode end-to-end |
| 5.4 | Update existing tests for new output fields |
| 5.5 | Write new tests for agency features |
| 5.6 | Deploy all modified edge functions |

**Estimated total: 8-13 days**

---

## 13. Dependencies

### Required before implementation

| Dependency | Status | Blocks |
|------------|--------|--------|
| `agency/lib/agent-loader.ts` exists | ✅ Created | All fragment loading |
| 5 prompt fragments exist | ✅ Created | Edge function wiring |
| 4 chat mode prompts exist | ✅ Created | AI Chat modes |
| 6 wireframes exist | ✅ Created | UI implementation |
| Edge functions deployable | ✅ Working | Backend changes |

### No dependencies on

- No new NPM packages needed
- No new edge functions needed (all modifications to existing)
- No new database tables needed (one optional)
- No frontend build changes (prompts are runtime-loaded server-side)

---

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Fragment makes system prompt too long | Medium | Medium | Fragments are 200-400 lines each; Gemini/Claude handle 100K+ context. Monitor token usage. |
| New output fields break existing report rendering | Medium | High | All new fields are optional. Frontend uses optional chaining. Test with existing reports. |
| MEDDPICC scoring quality is poor | Low | Medium | Fragment includes detailed scoring rubric with examples. Calibrate over 5+ deals. |
| Chat modes produce generic output | Medium | Medium | Each mode prompt is 300+ lines of specific methodology with examples and anti-patterns. |
| Performance regression from fragment loading | Low | Low | Fragments are small markdown files (<50KB). Cache after first load. |
| Founders confused by new UI elements | Medium | Medium | Phase UI additions gradually. Add tooltips explaining RICE, MEDDPICC, etc. |

---

## 15. Success Criteria

### Quantitative

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Report quality | Executive summaries reference evidence tiers in >80% of reports | Audit 10 reports |
| Sprint task adoption | >60% of AI-generated tasks have RICE scores | Check sprint_tasks metadata |
| Investor pipeline usage | >50% of investors have MEDDPICC scores | Check investors table |
| Chat mode engagement | Each mode used by >30% of active users within 30 days | Track ai_runs by mode |
| Pitch deck narrative | >80% of generated decks have all 5 narrative acts | Check deck_json structure |
| Canvas specificity | Average specificity improves from baseline after coach session | Compare pre/post scores |

### Qualitative

| Signal | How to Detect |
|--------|--------------|
| Founders forward validation reports to advisors | Share link usage increases |
| Founders use Practice Pitch before real investor meetings | Mode session frequency correlates with meeting dates |
| Founders stop pursuing Unqualified deals | Pipeline churn in bottom quartile increases |
| Canvas content becomes more specific over sessions | Specificity score trend per user |

---

## 16. References

| Document | Path | Purpose |
|----------|------|---------|
| Agency index | `agency/INDEX.md` | Master wiring map (27 files, 4 layers) |
| Agency benefits | `agency/WHY.md` | Why we integrated, examples |
| Wireframe index | `agency/wireframes/00-index.md` | Screen map, user journeys |
| Validator Report wireframe | `agency/wireframes/01-validator-report.md` | Detailed UI spec |
| Sprint Board wireframe | `agency/wireframes/02-sprint-board.md` | Detailed UI spec |
| Pitch Deck wireframe | `agency/wireframes/03-pitch-deck-editor.md` | Detailed UI spec |
| AI Chat Modes wireframe | `agency/wireframes/04-ai-chat-modes.md` | Detailed UI spec (4 modes) |
| Investor Pipeline wireframe | `agency/wireframes/05-investor-pipeline.md` | Detailed UI spec |
| Lean Canvas wireframe | `agency/wireframes/06-lean-canvas.md` | Detailed UI spec |
| Agent loader | `agency/lib/agent-loader.ts` | Runtime loader utility |
| Prompt fragments | `agency/prompts/*.md` | 5 framework documents |
| Chat mode prompts | `agency/chat-modes/*.md` | 4 mode documents |
| Domain skills | `.agents/skills/*/SKILL.md` | 8 background knowledge docs |
| Main PRD | `prd.md` | Product requirements v6.0 |
| Engineering PRD | `tasks/prd.md` | Technical PRD v11.0 |
| Fork source | `agency-agents-fork/` | Full 132-agent library (reference only, gitignored) |
