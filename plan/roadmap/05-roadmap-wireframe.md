# SCREEN — FOUNDER ROADMAP (Stage Progress Tracker)

> **Version:** 1.0 | **Created:** 2026-02-02 | **Status:** Design

3-Panel Editorial Operating System (Context / Work / Intelligence)

---

## Purpose

Guide founders through the startup lifecycle with a visual journey map, stage-scoped planning, and AI coaching. Integrates funding milestones with validation gates.

This screen answers:
**"Where am I, what do I do now, and what's blocking my progress?"**

---

## Core Concept

### 5 Phases with 10 Sub-Stages

| Phase | Icon | Funding | Sub-Stages | Key Question |
|-------|------|---------|------------|--------------|
| **1. IDEA** | lightbulb | Pre-seed | 1.1 Idea & Vision, 1.2 Market Discovery | Is this worth pursuing? |
| **2. SEED** | seedling | Seed | 2.1 Strategy & Readiness, 2.2 Problem-Solution Fit | Does the problem exist? |
| **3. EARLY** | clipboard | Series A | 3.1 MVP Build, 3.2 Go-To-Market | Can we sell it? |
| **4. GROWTH** | chart | Series B | 4.1 Traction, 4.2 Scale | Is it growing? |
| **5. MATURITY** | trophy | Series C+ | 5.1 Fundraising, 5.2 Expansion | What's next? |

### Design Principles

- Stages are **learning gates**, not timeline milestones
- Progress requires **evidence**, not self-declaration
- System uses **lower stage** when claimed vs detected conflict
- Each phase has its own **Now-Next-Later** scope

---

## LEFT PANEL — CONTEXT (Navigation)

### Navigation Menu
- Lean Canvas
- Customer Forces
- Risks & Assumptions
- Experiments
- **Founder Roadmap** (active)
- Traction Analytics
- Decisions

### Meta (Read-only)
- Current Phase: **SEED**
- Current Sub-Stage: **2.2 Problem-Solution Fit**
- Stage Confidence: **78%**
- Days in Stage: **14**

### Quick Stats
- Milestones Complete: **7/12**
- Gate Progress: **58%**
- Next Gate: **3 items remaining**

Rules:
- No charts in left panel
- No AI suggestions here
- Pure navigation and orientation

---

## CENTER PANEL — WORK (Primary Surface)

### Section 1: Visual Journey Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FOUNDER JOURNEY                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   [1]           [2]           [3]           [4]           [5]               │
│    ●━━━━━━━━━━━━●━━━━━━━━━━━━○━━━━━━━━━━━━○━━━━━━━━━━━━○                    │
│   IDEA         SEED        EARLY       GROWTH      MATURITY                 │
│    ✓            ◉            ○            ○            ○                    │
│                                                                              │
│   Pre-seed     Seed       Series A    Series B    Series C+                 │
│                                                                              │
│   [Completed]  [Current]   [Locked]    [Locked]    [Locked]                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

Legend:
● = Completed phase
◉ = Current phase (highlighted, pulsing)
○ = Future phase (locked, greyed)
━ = Progress path (solid = complete, dotted = remaining)
```

**Interaction:**
- Click any phase to expand sub-stages
- Hover shows phase summary tooltip
- Current phase is visually emphasized (glow, larger)
- Locked phases show "Complete [requirement] to unlock"

---

### Section 2: Phase Detail Card (Expanded Current Phase)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SEED PHASE                                                    Series Seed  │
│  "Does the problem exist?"                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  SUB-STAGES                                                                  │
│  ┌─────────────────────────┐    ┌─────────────────────────┐                 │
│  │ 2.1 Strategy            │    │ 2.2 Problem-Solution    │                 │
│  │     & Readiness         │    │     Fit                 │                 │
│  │                         │    │                         │                 │
│  │ ✓ SWOT complete         │    │ ◉ 7/10 interviews       │                 │
│  │ ✓ Assumptions ranked    │    │ ○ 0/1 validated         │                 │
│  │ ✓ Resources assessed    │    │ ○ Customer canvas       │                 │
│  │                         │    │                         │                 │
│  │ [COMPLETED]             │    │ [IN PROGRESS - 58%]     │                 │
│  └─────────────────────────┘    └─────────────────────────┘                 │
│                                                                              │
│  PHASE MILESTONES                                          Progress: 7/12   │
│  ────────────────────────────────────────────────────────────────────────   │
│  ✓ SWOT analysis complete                                                   │
│  ✓ Top 3 assumptions identified                                             │
│  ✓ Risk board prioritized                                                   │
│  ✓ Interview script created                                                 │
│  ✓ First 5 interviews conducted                                             │
│  ✓ Problem patterns identified                                              │
│  ✓ Customer segment refined                                                 │
│  ◉ 10+ customer interviews (7/10)                          [IN PROGRESS]    │
│  ○ 1+ assumption validated                                 [BLOCKED]        │
│  ○ Customer canvas complete                                [NOT STARTED]    │
│  ○ Prototype/concierge tested                              [NOT STARTED]    │
│  ○ Problem-Solution Fit signal (60%+)                      [NOT STARTED]    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Interaction:**
- Click milestone to see details/evidence
- Progress bar fills as milestones complete
- Blocked items show dependency
- Links to relevant Lean System screens

---

### Section 3: Stage-Scoped Now-Next-Later

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE PLAN                                              SEED Phase         │
├───────────────────────┬───────────────────────┬─────────────────────────────┤
│  NOW                  │  NEXT                 │  LATER                      │
│  Current Stage Tasks  │  Gate Requirements    │  Future Phase Preview       │
├───────────────────────┼───────────────────────┼─────────────────────────────┤
│                       │                       │                             │
│  ◉ Complete 3 more    │  ○ Validate core      │  ○ Define MVP scope         │
│    customer           │    assumption         │                             │
│    interviews         │                       │  ○ Identify first 10        │
│                       │  ○ Complete customer  │    target customers         │
│  ○ Synthesize         │    canvas             │                             │
│    interview          │                       │  ○ Choose acquisition       │
│    insights           │  ○ Run concierge      │    channel                  │
│                       │    MVP test           │                             │
│  ○ Update risk        │                       │  ○ Set pricing              │
│    board with         │  ○ Achieve 60%        │    hypothesis               │
│    learnings          │    "I need this"      │                             │
│                       │    signal             │                             │
│                       │                       │                             │
│  [3 tasks]            │  [4 gate items]       │  [4 future items]           │
│                       │                       │                             │
└───────────────────────┴───────────────────────┴─────────────────────────────┘
```

**Column Definitions:**
- **NOW**: Tasks for current sub-stage (manually added + AI suggested)
- **NEXT**: Gate requirements to advance to next phase (auto-generated)
- **LATER**: Preview of next phase's early tasks (read-only, for context)

**Interaction:**
- Drag tasks within NOW column to reorder
- Click task to see details/link to action
- Check off completed tasks
- NEXT items link to relevant screens (Experiments, Canvas, etc.)

---

### Section 4: Gate Progress (Next Transition)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  GATE: SEED → EARLY                                                         │
│  "Can we move from validation to building?"                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  READINESS: 58%  ████████████░░░░░░░░░                                      │
│                                                                              │
│  REQUIREMENTS                                              STATUS            │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ✓ SWOT analysis complete                                  Evidence ↗       │
│  ✓ Top 3 assumptions identified                            View ↗           │
│  ◉ 10+ customer interviews                                 7/10             │
│  ○ 1+ core assumption validated                            0/1 - Blocked    │
│  ○ Problem-Solution Fit signal (60%+ "I need this")        Not tested       │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  BLOCKER: Cannot validate assumption without completing interviews          │
│                                                                              │
│  [Request Gate Review]  (disabled until 80% ready)                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Rules:**
- Gate review requires 80%+ readiness
- AI validates evidence quality, not just completion
- Blockers are explicitly stated
- Links to evidence for each requirement

---

## RIGHT PANEL — INTELLIGENCE (Stage Coach Agent)

### Agent Identity

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE COACH                                                                │
│  Your AI guide through the startup journey                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Summary Block

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SUMMARY                                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  You're making solid progress in SEED phase. Interview velocity is good     │
│  (7 in 14 days), but you haven't validated any assumptions yet. Focus on   │
│  synthesizing learnings before conducting more interviews.                  │
│                                                                              │
│  Stage Confidence: 78% — Evidence supports your current stage.              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Priority Focus

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  THIS WEEK'S FOCUS                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. Synthesize your 7 interviews                                            │
│     → Patterns are emerging. Document them before they fade.                │
│     [Go to Interview Log →]                                                 │
│                                                                              │
│  2. Test your riskiest assumption                                           │
│     → "Users will pay before seeing the product" is high-risk.              │
│     [Design Experiment →]                                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Warnings

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ⚠ WATCH OUT                                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  You're interviewing faster than synthesizing. Risk: Confirmation bias.     │
│  Pause interviews until you've extracted patterns from existing data.       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Celebration (Contextual)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  MILESTONE ACHIEVED                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  You completed "Strategy & Readiness" sub-stage!                            │
│  Average time: 21 days. You did it in 12 days.                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Why This Matters

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  WHY VALIDATION BEFORE BUILDING?                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  42% of startups fail because they build products nobody wants.             │
│  The SEED phase exists to prevent this. Every interview is cheaper          │
│  than code. Every invalidated assumption saves months of wasted work.       │
│                                                                              │
│  You're 3 interviews away from unlocking MVP planning.                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Stage Coach Behaviors

| Trigger | Response |
|---------|----------|
| Milestone completed | Celebrate + suggest next action |
| Stalled >7 days | Gentle nudge with specific task |
| Skipped validation | Warning + block explanation |
| Gate ready | Prompt for gate review |
| Stage mismatch | Explain evidence gap |
| Premature advancement | Block + educate |

---

## PHASE MILESTONES (Complete Reference)

### Phase 1: IDEA (Pre-seed)

| Milestone | Evidence Required | Links To |
|-----------|-------------------|----------|
| Problem statement documented | ≥50 words in Startup Profile | Profile |
| Target customer described | Psychographic profile | Lean Canvas |
| Problem clarity ≥70% | AI assessment score | Profile |
| Business model hypothesis | Lean Canvas draft started | Lean Canvas |
| Market demand signals | Supply-Demand matrix | Market Analysis |
| Core team identified | Team section complete | Profile |

**Gate to SEED:** Problem worth solving + initial market validation

---

### Phase 2: SEED (Seed Round)

| Milestone | Evidence Required | Links To |
|-----------|-------------------|----------|
| SWOT analysis complete | ≥3 items per quadrant | SWOT Screen |
| Top 3 assumptions identified | Risk board prioritized | Risk Board |
| Resources assessed | Team/budget documented | Profile |
| 10+ customer interviews | Logged in Interview Log | Interviews |
| 1+ assumption validated | Experiment result | Experiments |
| Customer canvas complete | Forces + JTBD filled | Customer Canvas |
| Prototype/concierge tested | Experiment logged | Experiments |
| PSF signal achieved | 60%+ "I need this" | Experiments |

**Gate to EARLY:** Problem-Solution Fit validated

---

### Phase 3: EARLY (Series A)

| Milestone | Evidence Required | Links To |
|-----------|-------------------|----------|
| MVP scope defined | Feature list + Kano | MVP Planner |
| MVP shipped | User list documented | MVP Planner |
| First 10 paying customers | Revenue logged | Traction |
| Pricing validated | Someone paid | Traction |
| 1 acquisition channel tested | CAC estimate | Analytics |
| Business model refined | Updated Lean Canvas | Lean Canvas |
| Feedback loop active | Feedback log started | Feedback |

**Gate to GROWTH:** First customers acquired + revenue

---

### Phase 4: GROWTH (Series B)

| Milestone | Evidence Required | Links To |
|-----------|-------------------|----------|
| OMTM defined | Single metric selected | Analytics |
| OMTM improving 4+ weeks | Trend data | Analytics |
| Churn <10% | Retention metrics | Analytics |
| Unit economics positive | LTV > CAC | Analytics |
| Growth loop identified | Documented playbook | Traction |
| PMF achieved | 40%+ "very disappointed" | PMF Checker |
| Expansion ready | Bottleneck addressed | Customer Factory |

**Gate to MATURITY:** Product-Market Fit confirmed

---

### Phase 5: MATURITY (Series C+)

| Milestone | Evidence Required | Links To |
|-----------|-------------------|----------|
| Repeatable growth | Not founder-dependent | Playbook |
| Team >5 people | Org chart | Team |
| Profitability OR funding | Financial docs | Financials |
| Leadership team | Key hires made | Team |
| New market identified | Expansion plan | Strategy |
| Exit strategy defined | Options documented | Strategy |

**Gate to EXIT:** Ready for acquisition or IPO

---

## CROSS-PHASE MILESTONES (Across All Stages)

From Finro model — tracked separately:

| Category | Milestones |
|----------|------------|
| **Key Hires** | First hire, key roles filled, leadership team |
| **Compliance & Legal** | Entity formed, IP protected, contracts in place |
| **Technology** | MVP shipped, v2 launched, platform stable |
| **Exit Events** | Acquisition offers, IPO readiness, exit execution |

---

## DATA MODEL

### Core Tables

```sql
-- Phase progress tracking
CREATE TABLE founder_roadmap (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id UUID REFERENCES startups ON DELETE CASCADE NOT NULL,
    current_phase TEXT CHECK (current_phase IN ('idea', 'seed', 'early', 'growth', 'maturity')),
    current_sub_stage TEXT NOT NULL,
    claimed_phase TEXT,
    detected_phase TEXT,
    effective_phase TEXT NOT NULL,
    stage_confidence INTEGER CHECK (stage_confidence BETWEEN 0 AND 100),
    days_in_stage INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Milestone tracking
CREATE TABLE roadmap_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id UUID REFERENCES startups ON DELETE CASCADE NOT NULL,
    phase TEXT NOT NULL,
    sub_stage TEXT,
    milestone_key TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'blocked')) DEFAULT 'not_started',
    evidence_type TEXT, -- 'manual', 'auto', 'ai_verified'
    evidence_link TEXT, -- link to source (experiment, canvas, etc.)
    evidence_data JSONB,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(startup_id, milestone_key)
);

-- Gate checks
CREATE TABLE roadmap_gates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id UUID REFERENCES startups ON DELETE CASCADE NOT NULL,
    from_phase TEXT NOT NULL,
    to_phase TEXT NOT NULL,
    readiness_score INTEGER CHECK (readiness_score BETWEEN 0 AND 100),
    requirements_met JSONB, -- {requirement_key: true/false}
    blockers JSONB, -- list of blocking items
    passed BOOLEAN DEFAULT FALSE,
    passed_at TIMESTAMPTZ,
    checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stage-scoped Now-Next-Later
CREATE TABLE roadmap_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id UUID REFERENCES startups ON DELETE CASCADE NOT NULL,
    phase TEXT NOT NULL,
    column TEXT CHECK (column IN ('now', 'next', 'later')) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    source TEXT CHECK (source IN ('manual', 'ai_suggested', 'gate_requirement')) DEFAULT 'manual',
    linked_milestone_id UUID REFERENCES roadmap_milestones,
    linked_screen TEXT, -- 'experiments', 'canvas', etc.
    priority INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Stage Coach interactions
CREATE TABLE coach_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id UUID REFERENCES startups ON DELETE CASCADE NOT NULL,
    interaction_type TEXT CHECK (interaction_type IN ('summary', 'focus', 'warning', 'celebration', 'nudge')),
    message TEXT NOT NULL,
    context JSONB, -- what triggered this
    acknowledged BOOLEAN DEFAULT FALSE,
    action_taken TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cross-phase milestones
CREATE TABLE cross_phase_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id UUID REFERENCES startups ON DELETE CASCADE NOT NULL,
    category TEXT CHECK (category IN ('key_hires', 'compliance_legal', 'technology', 'exit_events')),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
    target_date DATE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes

```sql
CREATE INDEX idx_roadmap_startup ON founder_roadmap(startup_id);
CREATE INDEX idx_milestones_startup_phase ON roadmap_milestones(startup_id, phase);
CREATE INDEX idx_tasks_startup_phase ON roadmap_tasks(startup_id, phase, column);
CREATE INDEX idx_gates_startup ON roadmap_gates(startup_id, from_phase);
```

---

## AI AGENTS

### Stage Coach Agent (Primary)

| Attribute | Detail |
|-----------|--------|
| Purpose | Guide founders through stages with personalized coaching |
| Trigger | Page load, milestone change, daily check |
| Input | Current stage, milestones, tasks, experiments, metrics |
| Output | Summary, focus items, warnings, celebrations |
| Tone | Encouraging but honest, evidence-focused |

**Behaviors:**
- Celebrates completed milestones
- Suggests next high-impact task
- Warns about stalls, skipped validation, premature advancement
- Explains "why" behind guidance
- Adapts tone to founder's progress velocity

### Gate Validator Agent

| Attribute | Detail |
|-----------|--------|
| Purpose | Evaluate gate readiness, verify evidence quality |
| Trigger | Gate review requested, evidence updated |
| Input | Gate requirements, linked evidence |
| Output | Readiness score, missing items, blockers |
| Rule | Never passes without evidence |

### Stage Detector Agent

| Attribute | Detail |
|-----------|--------|
| Purpose | Auto-detect stage from evidence (vs. claimed) |
| Trigger | Daily cron, major milestone completion |
| Input | All startup data (canvas, experiments, metrics) |
| Output | Detected stage, confidence score, signals used |
| Rule | When conflict, use lower (more conservative) stage |

---

## EDGE FUNCTIONS

| Function | Purpose | Trigger | Output |
|----------|---------|---------|--------|
| `roadmap-stage-coach` | Generate coaching content | Page load, milestone change | Summary, focus, warnings |
| `roadmap-gate-check` | Evaluate gate readiness | Gate review request | Readiness score, blockers |
| `roadmap-stage-detect` | Auto-detect stage | Daily cron | Detected stage, confidence |
| `roadmap-milestone-sync` | Sync milestones from other screens | Canvas/experiment update | Updated milestone status |
| `roadmap-task-suggest` | AI-suggest NOW tasks | Column empty, stall detected | Suggested tasks |

---

## USER WORKFLOWS

### Workflow 1: Daily Check-In

```
1. Founder opens Roadmap
2. Sees current position on journey map
3. Reviews Stage Coach summary
4. Checks NOW column for today's focus
5. Completes task → milestone auto-updates
6. Stage Coach celebrates progress
```

### Workflow 2: Gate Advancement

```
1. Founder completes milestones
2. Gate readiness reaches 80%+
3. "Request Gate Review" button enables
4. Gate Validator checks evidence quality
5. If passed → advance to next phase
6. If failed → specific feedback on gaps
7. Stage Coach explains next steps
```

### Workflow 3: Stage Mismatch Resolution

```
1. Stage Detector notices claimed ≠ detected
2. Warning appears: "Evidence suggests earlier stage"
3. Founder reviews evidence gaps
4. Either: Provide missing evidence OR accept lower stage
5. System uses effective stage for all guidance
```

### Workflow 4: Stall Recovery

```
1. No milestone progress for 7+ days
2. Stage Coach sends gentle nudge
3. Suggests smallest possible next action
4. Links directly to relevant screen
5. If still stalled → escalate warning level
```

---

## UI/UX LAYOUT RULES

### Visual Hierarchy
1. Journey map is hero element (top of center panel)
2. Current phase detail is primary work area
3. Now-Next-Later is secondary planning area
4. Gate progress is call-to-action area

### Interaction Patterns
- Click phase → expand detail
- Click milestone → see evidence/link to source
- Drag NOW tasks to reorder
- Check tasks to complete
- Hover for tooltips everywhere

### Color Coding
- Completed: Green
- Current/Active: Blue (with pulse/glow)
- Locked: Grey (with lock icon)
- Blocked: Orange
- Warning: Red

### Typography
- Phase names: Large, bold
- Sub-stage names: Medium, semi-bold
- Milestones: Regular, list format
- Stage Coach: Conversational, slightly smaller

### Responsive Behavior
- Mobile: Stack panels vertically
- Journey map becomes vertical on mobile
- Collapsible sections for phase details

---

## ACCEPTANCE CRITERIA

### Founder Success
| Metric | Target |
|--------|--------|
| Understands current position | <10 seconds to identify stage |
| Knows next action | <30 seconds to find task |
| Gate clarity | 100% know what's blocking advancement |
| Weekly engagement | ≥3 roadmap views per week |

### System Success
| Metric | Target |
|--------|--------|
| Stage accuracy | >90% detected = actual |
| Premature advancement prevention | 100% blocked without evidence |
| Milestone sync | <5 min lag from source |
| Coach relevance | >70% suggestions acted upon |

### Anti-Metrics (Avoid)
- Time on roadmap page (not a goal)
- Total milestones created (quality > quantity)
- Fastest advancement (speed ≠ success)

---

## SAMPLE CONTENT

### Founder: "LaunchPad AI" — Solo founder building AI writing tool

**Current State:**
- Phase: SEED
- Sub-Stage: 2.2 Problem-Solution Fit
- Days in Stage: 14
- Milestones: 7/12 complete

**Stage Coach Summary:**
> "You're making solid progress in SEED phase. Interview velocity is good (7 in 14 days), but you haven't validated any assumptions yet. Focus on synthesizing learnings before conducting more interviews."

**NOW Tasks:**
1. Complete 3 more customer interviews
2. Synthesize interview insights
3. Update risk board with learnings

**NEXT (Gate Requirements):**
1. Validate core assumption
2. Complete customer canvas
3. Run concierge MVP test
4. Achieve 60% "I need this" signal

**LATER (Early Phase Preview):**
1. Define MVP scope
2. Identify first 10 target customers
3. Choose acquisition channel
4. Set pricing hypothesis

---

## INTEGRATION POINTS

### From Other Screens
| Source Screen | Updates Milestone |
|---------------|-------------------|
| Lean Canvas | "Business model hypothesis" |
| Customer Canvas | "Customer canvas complete" |
| Experiments | "Assumption validated", "PSF signal" |
| Interviews | "10+ interviews conducted" |
| Analytics | "OMTM defined", "Churn <10%" |
| PMF Checker | "PMF achieved" |

### To Other Screens
| Roadmap Action | Navigates To |
|----------------|--------------|
| Click "Design Experiment" | Experiment Lab |
| Click "Complete Canvas" | Customer Canvas |
| Click "View Evidence" | Source screen |
| Click milestone | Linked artifact |

---

## FIGMA DESIGN NOTES

### Page Structure
1. **Desktop Layout** (1440px)
   - Left Panel: 240px fixed
   - Center Panel: Fluid (fill)
   - Right Panel: 320px fixed

2. **Component Library**
   - Journey Map (horizontal timeline)
   - Phase Card (expandable)
   - Milestone List Item
   - Now-Next-Later Board
   - Gate Progress Bar
   - Coach Message Card

3. **States to Design**
   - Empty state (new founder)
   - In-progress state (mid-phase)
   - Gate-ready state (80%+)
   - Celebration state (milestone complete)
   - Warning state (stalled/mismatch)
   - Locked phase state

4. **Animations**
   - Current phase pulse/glow
   - Milestone completion check animation
   - Gate unlock celebration
   - Progress bar fill

---

*End of Founder Roadmap Wireframe*
