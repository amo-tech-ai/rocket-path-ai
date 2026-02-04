# Lean Startup Operating System (Hybrid)

> **Updated:** 2026-02-03
> **Status:** Planning
> **Edge Functions:** lean-canvas-agent, validation-agent, sprint-agent, traction-agent, roadmap-agent
> **Main Screen:** FounderDashboard

---

## 00-summary

### Quick Reference

| Screen | Features | Agent | Use Cases |
|--------|----------|-------|-----------|
| FounderDashboard | Stage tracker, health scores, Now-Next-Later view | Task Orchestrator | Monitor progress, identify blockers |
| LeanCanvas | 9-box model, AI suggestions, validation | Lean Canvas Agent | Define business model, test assumptions |
| CustomerJourney | Touchpoint map, persona flow, current/future state | Customer Journey Agent | Map customer experience, find gaps |
| CustomerCanvas | Forces diagram, JTBD, pain/gain map | Customer Forces Agent | Understand buyers, map switching triggers |
| StoryMap | Epic backbone, user stories, prioritization | Story Mapping Agent | Visualize feature flow, find gaps |
| RiskBoard | Assumption cards, risk scoring, experiments | Risk Detector | Prioritize risks, design tests |
| ExperimentLab | Test builder, results tracker, insights | Experiment Designer | Run validation experiments |
| LeanSprint | 90-day cycles, experiments, decisions | Sprint Coach Agent | Execute lean sprints, track learning |
| NowNextLater | Time horizons, initiatives, objectives | Roadmap Agent | Flexible planning, stakeholder views |
| TractionRoadmap | Milestones, channel tests, growth metrics | Traction Analyst | Plan growth, measure traction |
| AnalyticsDashboard | AARRR metrics, cohorts, LTV/CAC | PMF Assessor | Track pirate metrics, find PMF |
| MVPPlanner | Feature prioritization, MDVFP, scope | Idea Structurer | Define MVP, cut scope |
| PMFChecker | Survey analysis, retention curves, signals | PMF Assessor | Measure product-market fit |
| DecisionLog | Pivots, decisions, outcomes | Decision Advisor | Document decisions, learn from pivots |

### New Hybrid Features

| Feature | Source | Benefit |
|---------|--------|---------|
| Customer Journey Mapping | Founder Roadmap | Visualize full customer experience |
| Story Mapping | Agile/Lean | Connect features to user journey |
| Now-Next-Later | ProdPad/Lean | Flexible roadmap without deadlines |
| 90-Day Lean Sprints | Lean Startup | Learning cycles over delivery cycles |
| Stakeholder Views | Product Roadmap | Tailored roadmaps per audience |

### Agents

| Agent | Model | Purpose | Screens |
|-------|-------|---------|---------|
| Idea Structurer | gemini-3-flash | Structure raw ideas | MVPPlanner |
| Lean Canvas Agent | gemini-3-pro | Business model guidance | LeanCanvas |
| Customer Journey Agent | gemini-3-pro | Journey mapping | CustomerJourney |
| Customer Forces Agent | gemini-3-pro | Customer psychology | CustomerCanvas |
| Story Mapping Agent | gemini-3-flash | Story prioritization | StoryMap |
| Risk Detector | gemini-3-flash | Surface hidden risks | RiskBoard |
| Experiment Designer | claude-sonnet-4-5 | Design validation tests | ExperimentLab |
| Sprint Coach Agent | gemini-3-flash | 90-day sprint guidance | LeanSprint |
| Roadmap Agent | gemini-3-pro | Now-Next-Later planning | NowNextLater |
| Traction Analyst | gemini-3-pro | Growth analysis | TractionRoadmap |
| PMF Assessor | claude-sonnet-4-5 | PMF measurement | AnalyticsDashboard, PMFChecker |
| Decision Advisor | claude-opus-4-5 | Strategic guidance | DecisionLog |
| Task Orchestrator | gemini-3-flash | Workflow coordination | FounderDashboard |

### Edge Functions

| Function | Actions | Tables |
|----------|---------|--------|
| lean-canvas-agent | generate, refine, validate, benchmark | lean_canvases, assumptions |
| journey-agent | map, analyze_touchpoints, find_gaps | customer_journeys, touchpoints |
| story-agent | map, prioritize, cluster | story_maps, user_stories |
| roadmap-agent | plan, prioritize, generate_view | roadmap_initiatives, objectives |
| sprint-agent | plan_90day, track_learning, retrospect | lean_sprints, experiments |
| validation-agent | score, analyze, recommend | validation_runs, validation_verdicts |
| traction-agent | forecast, analyze, optimize | traction_metrics, channel_tests |
| experiment-agent | design, track, conclude | experiments, experiment_results |

---

## 01-description

The Lean Startup Operating System is an AI-powered platform that unifies Lean frameworks with founder roadmap methodologies. It combines 10 Lean frameworks, Customer Journey Mapping, Story Mapping, and Now-Next-Later roadmaps into a single coherent system.

### Core Frameworks

| # | Framework | Source | Purpose |
|---|-----------|--------|---------|
| 1 | Lean Canvas | Lean Startup | One-page business model |
| 2 | Customer Journey | Lucid/UX | Full experience mapping |
| 3 | Customer Canvas | Lean Startup | Customer psychology & forces |
| 4 | Jobs to Be Done | Christensen | Functional/emotional jobs |
| 5 | Story Mapping | Patton | Feature prioritization by journey |
| 6 | Now-Next-Later | ProdPad | Flexible roadmapping |
| 7 | 90-Day Lean Sprints | Lean Startup | Learning cycles |
| 8 | Traction Roadmap | Gabriel Weinberg | Growth channel planning |
| 9 | Lean Analytics | AARRR | Pirate metrics |
| 10 | PMF Framework | Ellis/Rachleff | Product-market fit |

### 10-Stage Lifecycle

| Stage | Name | Description | Key Deliverable |
|-------|------|-------------|-----------------|
| 1 | IDEA | Raw concept capture | Problem statement |
| 2 | JOURNEY | Customer journey mapping | Touchpoint map |
| 3 | MARKET | Customer discovery | 10 interviews |
| 4 | STRATEGY | Business model design | Lean Canvas |
| 5 | PSF | Problem-solution fit | 3 validated assumptions |
| 6 | MVP | Build minimum viable | Working product |
| 7 | GTM | Go-to-market launch | First customers |
| 8 | TRACTION | Channel optimization | Repeatable channel |
| 9 | SCALE | Growth acceleration | Positive unit economics |
| 10 | PMF | Product-market fit | 40%+ would be disappointed |

### Stage Gate System

| Transition | Gate Criteria |
|------------|---------------|
| IDEA → JOURNEY | Problem statement + 3 customer segments |
| JOURNEY → MARKET | Customer journey map with touchpoints |
| MARKET → STRATEGY | 10 interviews + validated pain points |
| STRATEGY → PSF | Complete Lean Canvas + story map |
| PSF → MVP | 3 validated assumptions + MVP scope |
| MVP → GTM | Working product + 5 beta users |
| GTM → TRACTION | Launch + first revenue |
| TRACTION → SCALE | 3 working channels + positive unit economics |
| SCALE → PMF | 40%+ "very disappointed" + D30 retention > 30% |

---

## 02-rationale

### Why Hybrid?

**Problem:** Traditional lean tools miss customer journey context and create rigid deadline-based roadmaps.

**Evidence:**
- 94% of companies say journey maps help develop better products (Hanover Research)
- Only 47% have journey mapping processes in place
- Timeline roadmaps create endless deadline shifting and low morale
- Story mapping connects features to user goals

**Solution:** A hybrid OS that combines:
1. Lean validation frameworks (assumptions, experiments)
2. Customer journey mapping (touchpoints, current/future state)
3. Story mapping (features by journey phase)
4. Now-Next-Later roadmaps (flexible time horizons)
5. 90-day learning sprints (outcomes over output)

### Key Differentiators

| Feature | Traditional Tools | Hybrid Lean OS |
|---------|-------------------|----------------|
| Roadmap Format | Timeline with deadlines | Now-Next-Later horizons |
| Feature Planning | Flat backlog | Story map by journey |
| Customer View | Isolated personas | Full journey mapping |
| Sprint Focus | Delivery/output | Learning/outcomes |
| Prioritization | Date-driven | Problem-driven |

---

## 03-stories

### User Stories

| ID | Role | Story | Acceptance |
|----|------|-------|------------|
| US-01 | Founder | I want to map my customer journey so I can find experience gaps | Journey map with touchpoints |
| US-02 | Founder | I want to organize features by journey phase so I see the big picture | Story map complete |
| US-03 | Founder | I want flexible roadmaps so I don't commit to arbitrary deadlines | Now-Next-Later view |
| US-04 | Founder | I want 90-day sprints so I focus on learning not just shipping | Sprint with learning goals |
| US-05 | Founder | I want stakeholder views so I can tailor roadmaps for each audience | Multiple view types |
| US-06 | Founder | I want to validate assumptions before building so I don't waste time | Experiments before code |
| US-07 | Founder | I want to track customer touchpoints so I optimize the full experience | Touchpoint analytics |
| US-08 | Founder | I want AI guidance so I get expert advice on demand | Agent suggestions |

---

## 04-examples

### Real-World Scenarios

**Scenario 1: SaaS Journey Discovery**

Sarah is building HR analytics software. She:
1. Opens CustomerJourney → Maps awareness to advocacy
2. Identifies 12 touchpoints across 5 phases
3. Finds gap: onboarding to first value takes too long
4. Opens StoryMap → Organizes features by journey phase
5. Opens NowNextLater → Prioritizes onboarding fixes in Now
6. LeanSprint → 90-day goal: reduce time-to-value by 50%
7. ExperimentLab → Tests 3 onboarding improvements

**Scenario 2: Consumer App Roadmap**

Marcus needs to present roadmap to investors. He:
1. Opens NowNextLater → Creates flexible roadmap
2. Generates Executive View → Strategy and outcomes focus
3. Generates Engineering View → Features and sprints
4. Generates Customer View → Benefits and timeline-free
5. Uses Roadmap Agent to tailor messaging per audience
6. No hard deadlines → Avoids over-commitment

**Scenario 3: Marketplace Story Mapping**

Lisa runs a pet services marketplace. She:
1. Opens StoryMap → Creates backbone of user journey
2. Maps: Search → Book → Experience → Review → Return
3. Under each phase, adds user stories
4. Identifies gaps: no post-service follow-up
5. Prioritizes: MVP = minimum to complete journey
6. Now column gets highest-priority gaps
7. Later column gets nice-to-have features

---

## 05-criteria

### Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Journey Map Completion | 90% have full map by STRATEGY stage | customer_journeys |
| Story Map Usage | 80% use story maps for prioritization | story_maps |
| Now-Next-Later Adoption | 100% roadmaps are deadline-free | roadmap_initiatives |
| Learning Sprint Success | 70% sprints achieve learning goal | lean_sprints.outcome |
| Touchpoint Coverage | 100% touchpoints tracked | touchpoints |
| Time-to-Value | Median < 3 days for new users | user_journeys |

### Key Outcomes

1. **Journey-Driven:** All features connected to customer journey phase
2. **Flexible Planning:** No arbitrary deadlines, time horizons instead
3. **Learning Focus:** 90-day sprints measure learning not just delivery
4. **Stakeholder Alignment:** Tailored views for each audience
5. **Gap Discovery:** Journey mapping surfaces hidden problems

---

## 06-layout

### 3-Panel Layout System

| Panel | Width | Purpose |
|-------|-------|---------|
| Header | 100% | Stage progress, health score, active sprint |
| Left (Context) | 20% | Stage info, journey phase, quick actions |
| Main (Work) | 55% | Journey map, story map, canvas, charts |
| Right (Intelligence) | 25% | AI agent chat, suggestions, playbook tips |

### Left Panel Components

| Component | Description |
|-----------|-------------|
| Stage Context | Current stage, progress percentage |
| Journey Phase | Current phase being optimized |
| Gate Status | Checklist of criteria (passed/pending) |
| Quick Actions | Add, Edit, Run Gate buttons |

### Main Panel Components

| Component | Description |
|-----------|-------------|
| Journey View | Horizontal flow of customer phases |
| Story View | Backbone with stories beneath |
| Canvas View | 9-box grid or other canvas |
| Roadmap View | Now-Next-Later columns |

### Right Panel Components

| Component | Description |
|-----------|-------------|
| AI Agent Chat | Conversational interface |
| Journey Insights | Gap analysis, friction points |
| Next Actions | Prioritized recommendations |
| Stakeholder Tips | Audience-specific guidance |

### Layout by Screen

| Screen | Left Panel | Main Panel | Right Panel |
|--------|------------|------------|-------------|
| CustomerJourney | Phase list | Horizontal journey flow | Journey Agent chat |
| StoryMap | Epic list | Backbone + stories grid | Story Agent chat |
| NowNextLater | Objective tags | 3-column roadmap | Roadmap Agent chat |
| LeanSprint | Sprint list | 90-day view with experiments | Sprint Coach chat |
| LeanCanvas | Assumptions | 9-box canvas | Canvas Agent chat |

---

## 07-screens

### Screen Specifications

#### 07a-dashboard

**FounderDashboard** — Hybrid command center

| Section | Content |
|---------|---------|
| Header | Stage (e.g., "PSF 5/10"), Health Score, Active Sprint Goal |
| Left Panel | Current stage, journey phase, gate checklist |
| Main Panel | Now-Next-Later summary, sprint progress, journey health |
| Right Panel | Task Orchestrator chat, next actions |

**Key Elements:**
- Journey Health: Touchpoint satisfaction scores
- Sprint Progress: Learning goals vs completed
- Now Column: Top 3 current priorities
- Gate Status: Visual checklist

#### 07b-journey

**CustomerJourney** — Full experience mapping

| Section | Content |
|---------|---------|
| Header | Persona selector, Journey score |
| Left Panel | Phase list (Awareness, Consideration, Purchase, Onboarding, Retention, Advocacy) |
| Main Panel | Horizontal journey flow with touchpoints, actions, emotions, pain points |
| Right Panel | Journey Agent chat, gap analysis |

**Key Elements:**
- Journey Phases: Horizontal swim lanes
- Touchpoints: Cards with channel, action, emotion
- Pain Points: Red flags on problematic touchpoints
- Future State: Toggle to see planned improvements

**Journey Phases:**

| Phase | Description | Sample Touchpoints |
|-------|-------------|-------------------|
| Awareness | Customer discovers problem/solution | Ads, content, referral |
| Consideration | Customer evaluates options | Website, demo, reviews |
| Purchase | Customer decides to buy | Pricing page, checkout |
| Onboarding | Customer starts using product | Welcome email, tutorial |
| Retention | Customer continues using | Dashboard, support |
| Advocacy | Customer recommends to others | NPS survey, referral program |

#### 07c-storymap

**StoryMap** — Feature prioritization by journey

| Section | Content |
|---------|---------|
| Header | View selector (Full/MVP/Release), Export |
| Left Panel | Epic list, Filter by phase |
| Main Panel | Horizontal backbone (journey steps), vertical stories under each |
| Right Panel | Story Agent chat, gap detection |

**Key Elements:**
- Backbone: Core journey steps (horizontal)
- Stories: User stories under each step (vertical, priority top-to-bottom)
- MVP Line: Horizontal line showing minimum for MVP
- Release Clusters: Groupings for each release

**Story Map Structure:**

| Layer | Content | Example |
|-------|---------|---------|
| Backbone | Core journey steps | Search → Select → Book → Pay → Use → Review |
| Stories | User stories per step | "As a user, I can filter by price" |
| MVP Line | Minimum required | Everything above line = MVP |
| Releases | Grouped stories | Release 1 = top priority under each |

#### 07d-nownextlater

**NowNextLater** — Flexible roadmap without deadlines

| Section | Content |
|---------|---------|
| Header | View selector (Executive/Engineering/Sales/Customer), Export |
| Left Panel | Objective tags, initiative status |
| Main Panel | 3 columns (Now/Next/Later), initiative cards |
| Right Panel | Roadmap Agent chat, prioritization help |

**Key Elements:**
- Now Column: Fully spec'd, in progress, high certainty
- Next Column: Defined but not started, medium certainty
- Later Column: Big boulders, low certainty, placeholder
- Objective Tags: Color-coded business goals

**Column Characteristics:**

| Column | Certainty | Detail Level | Commitment |
|--------|-----------|--------------|------------|
| Now | High | Fully spec'd, broken down | Committed |
| Next | Medium | Defined, not broken down | Planned |
| Later | Low | Big ideas, placeholders | Possibilities |

**Stakeholder Views:**

| View | Audience | Focus | Excludes |
|------|----------|-------|----------|
| Executive | C-suite, Board | Strategy, outcomes, alignment | Feature details |
| Engineering | Dev team | Features, sprints, dependencies | Business strategy |
| Sales | Sales reps | Benefits, customer value | Technical details |
| Customer | External | Benefits, improvements | Dates, internal metrics |

#### 07e-leansprint

**LeanSprint** — 90-day learning cycles

| Section | Content |
|---------|---------|
| Header | Sprint number, Day counter (e.g., "Day 45/90"), Learning goal |
| Left Panel | Sprint list, Past sprints, Goal history |
| Main Panel | Active experiments, pending decisions, learning log |
| Right Panel | Sprint Coach chat, bottleneck detection |

**Key Elements:**
- Learning Goal: What we want to learn this sprint
- Active Experiments: Currently running tests
- Pending Decisions: Waiting on experiment results
- Learning Log: Insights captured during sprint

**90-Day Sprint Structure:**

| Week | Focus | Activities |
|------|-------|------------|
| 1-2 | Goal Setting | Define learning goal, identify assumptions |
| 3-4 | Experiment Design | Design experiments, set success criteria |
| 5-8 | Execution | Run experiments, collect data |
| 9-10 | Analysis | Analyze results, draw conclusions |
| 11-12 | Decision | Make pivot/persevere decision |

#### 07f-canvas

**LeanCanvas** — One-page business model editor

| Section | Content |
|---------|---------|
| Header | Validate button, Export, Canvas score |
| Left Panel | Assumptions list, filter by status |
| Main Panel | 9-box canvas grid |
| Right Panel | Canvas Agent chat, suggestions |

**Key Elements:**
- 9-Box Grid: Problem, Solution, UVP, Unfair Advantage, Customer Segments, Key Metrics, Channels, Cost Structure, Revenue Streams
- Assumption Badges: Warning icons on unvalidated
- Journey Link: Connect canvas sections to journey phases

#### 07g-customer

**CustomerCanvas** — Customer psychology mapping

| Section | Content |
|---------|---------|
| Header | Segment selector, Evidence count |
| Left Panel | Segment list, JTBD categories |
| Main Panel | Forces diagram (Push/Pull/Anxiety/Habit), JTBD builder |
| Right Panel | Customer Forces Agent chat |

**Key Elements:**
- Forces Diagram: Visual quadrant showing force strengths
- JTBD Builder: "When I [situation], I want to [motivation], so I can [outcome]"
- Journey Link: Map forces to journey phases

#### 07h-risks

**RiskBoard** — Assumption and risk management

| Section | Content |
|---------|---------|
| Header | Add button, Prioritize, Risk score |
| Left Panel | Category filters, Sort options |
| Main Panel | 3-column grid (Critical/High/Medium) |
| Right Panel | Risk Detector chat, test suggestions |

**Key Elements:**
- Risk Columns: Critical (red), High (orange), Medium (yellow)
- Assumption Cards: Statement, score, Test button
- Journey Link: Which touchpoint does this assumption affect?

#### 07i-experiments

**ExperimentLab** — Validation experiment management

| Section | Content |
|---------|---------|
| Header | New button, Templates |
| Left Panel | Experiment list by status |
| Main Panel | Experiment detail (Hypothesis, Results, Status) |
| Right Panel | Experiment Designer chat |

**Key Elements:**
- Experiment Card: Hypothesis, target, actual, confidence
- Sprint Link: Which 90-day sprint is this part of?
- Journey Link: Which touchpoint are we testing?

---

## 08-agents

### Agent Specifications

#### 08a-journey

**Customer Journey Agent** — Experience mapping expert

| Property | Value |
|----------|-------|
| Model | gemini-3-pro |
| Purpose | Map customer journeys, identify gaps, suggest improvements |
| Screens | CustomerJourney |
| Actions | map, analyze_touchpoints, find_gaps, suggest_future_state |

**Capabilities:**
- Create journey maps from interviews/descriptions
- Identify friction points and gaps
- Suggest touchpoint improvements
- Compare current vs future state
- Link touchpoints to assumptions

**Prompt Template:**
- Input: Customer interviews, product description
- Output: Journey phases, touchpoints, emotions, pain points

#### 08b-story

**Story Mapping Agent** — Feature prioritization expert

| Property | Value |
|----------|-------|
| Model | gemini-3-flash |
| Purpose | Create story maps, prioritize features, identify MVP |
| Screens | StoryMap |
| Actions | create_backbone, add_stories, identify_mvp, cluster_releases |

**Capabilities:**
- Generate backbone from journey phases
- Add user stories under each phase
- Draw MVP line
- Cluster stories into releases
- Identify missing functionality

**Prompt Template:**
- Input: Journey map, feature ideas
- Output: Story map with backbone and prioritized stories

#### 08c-roadmap

**Roadmap Agent** — Now-Next-Later planning expert

| Property | Value |
|----------|-------|
| Model | gemini-3-pro |
| Purpose | Create flexible roadmaps, generate stakeholder views |
| Screens | NowNextLater |
| Actions | prioritize, generate_view, tie_to_objectives, reorder |

**Capabilities:**
- Prioritize initiatives by business objectives
- Generate tailored views per stakeholder
- Avoid deadline commitments
- Link initiatives to OKRs
- Balance Now/Next/Later columns

**Prompt Template:**
- Input: Initiatives, objectives, audience type
- Output: Now-Next-Later roadmap tailored for audience

#### 08d-sprint

**Sprint Coach Agent** — 90-day learning cycle guide

| Property | Value |
|----------|-------|
| Model | gemini-3-flash |
| Purpose | Guide 90-day sprints, focus on learning over delivery |
| Screens | LeanSprint |
| Actions | set_learning_goal, design_experiments, detect_bottleneck, retrospect |

**Capabilities:**
- Set learning goals for each sprint
- Design experiments to achieve goals
- Detect bottlenecks (e.g., interview volume too low)
- Guide retrospectives
- Track learning outcomes

**Prompt Template:**
- Input: Current stage, assumptions to test
- Output: 90-day sprint plan with learning goal and experiments

#### 08e-orchestrator

**Task Orchestrator** — Workflow coordination agent

| Property | Value |
|----------|-------|
| Model | gemini-3-flash |
| Purpose | Coordinate workflows, manage gates, track progress |
| Screens | FounderDashboard |
| Actions | check_gate, assign_tasks, summarize_progress, recommend_next |

**Capabilities:**
- Monitor stage progress
- Enforce gate criteria
- Surface blockers
- Generate summaries
- Connect journey, story, and roadmap data

#### 08f-canvas

**Lean Canvas Agent** — Business model guidance

| Property | Value |
|----------|-------|
| Model | gemini-3-pro |
| Purpose | Guide canvas creation, suggest improvements |
| Screens | LeanCanvas |
| Actions | generate, refine, validate, benchmark |

#### 08g-customer

**Customer Forces Agent** — Customer psychology expert

| Property | Value |
|----------|-------|
| Model | gemini-3-pro |
| Purpose | Map customer forces, analyze JTBD |
| Screens | CustomerCanvas |
| Actions | map_forces, analyze_jtbd, identify_triggers |

#### 08h-risk

**Risk Detector** — Assumption and risk analysis

| Property | Value |
|----------|-------|
| Model | gemini-3-flash |
| Purpose | Surface hidden risks, score assumptions |
| Screens | RiskBoard |
| Actions | detect_risks, score_risk, prioritize, suggest_tests |

#### 08i-experiment

**Experiment Designer** — Validation test design

| Property | Value |
|----------|-------|
| Model | claude-sonnet-4-5 |
| Purpose | Design experiments, analyze results |
| Screens | ExperimentLab |
| Actions | design, analyze, conclude, recommend_next |

#### 08j-traction

**Traction Analyst** — Growth analysis expert

| Property | Value |
|----------|-------|
| Model | gemini-3-pro |
| Purpose | Analyze channels, forecast growth |
| Screens | TractionRoadmap |
| Actions | analyze_channels, forecast, optimize |

#### 08k-pmf

**PMF Assessor** — Product-market fit measurement

| Property | Value |
|----------|-------|
| Model | claude-sonnet-4-5 |
| Purpose | Measure PMF, analyze signals |
| Screens | AnalyticsDashboard, PMFChecker |
| Actions | assess, analyze_survey, track_signals |

#### 08l-decision

**Decision Advisor** — Strategic decision guidance

| Property | Value |
|----------|-------|
| Model | claude-opus-4-5 |
| Purpose | Guide strategic decisions, recommend pivots |
| Screens | DecisionLog |
| Actions | analyze, recommend_pivot, document |

---

## 09-schema

### Database Schema

#### 09a-journey

**Journey Tables**

| Table | Columns | Purpose |
|-------|---------|---------|
| customer_journeys | id, project_id, persona_id, name, current_state, future_state, score, created_at | Journey map definitions |
| journey_phases | id, journey_id, name, order, description, created_at | Journey phases (Awareness, etc.) |
| touchpoints | id, phase_id, channel, action, emotion, pain_level, satisfaction, evidence, created_at | Individual touchpoints |
| touchpoint_improvements | id, touchpoint_id, current_state, future_state, priority, status, created_at | Planned improvements |

#### 09b-story

**Story Map Tables**

| Table | Columns | Purpose |
|-------|---------|---------|
| story_maps | id, project_id, name, journey_id, created_at | Story map definitions |
| story_backbone | id, story_map_id, name, order, journey_phase_id, created_at | Backbone steps |
| user_stories | id, backbone_id, title, description, priority, mvp_line, release_cluster, status, created_at | Individual stories |

#### 09c-roadmap

**Roadmap Tables**

| Table | Columns | Purpose |
|-------|---------|---------|
| roadmap_initiatives | id, project_id, title, description, column (now/next/later), objective_id, certainty, detail_level, created_at | Initiative cards |
| roadmap_objectives | id, project_id, name, color, description, created_at | Business objectives (OKRs) |
| roadmap_views | id, project_id, audience (executive/engineering/sales/customer), filters (jsonb), created_at | Saved stakeholder views |

#### 09d-sprint

**90-Day Sprint Tables**

| Table | Columns | Purpose |
|-------|---------|---------|
| lean_sprints | id, project_id, sprint_number, learning_goal, status, started_at, ended_at, outcome, created_at | 90-day sprint definitions |
| sprint_experiments | id, sprint_id, experiment_id, status, created_at | Experiments in sprint |
| sprint_decisions | id, sprint_id, decision_type, title, rationale, outcome, created_at | Decisions made during sprint |
| learning_log | id, sprint_id, insight, source, created_at | Captured learnings |

#### 09e-core

**Core Tables**

| Table | Columns | Purpose |
|-------|---------|---------|
| lean_canvases | id, project_id, problem, solution, uvp, unfair_advantage, customer_segments, key_metrics, channels, cost_structure, revenue_streams, assumptions (jsonb), created_at | Business model canvas |
| assumptions | id, project_id, lean_canvas_id, touchpoint_id, category, statement, risk_score, status, evidence (jsonb), created_at | Assumptions linked to touchpoints |
| experiments | id, project_id, assumption_id, sprint_id, type, hypothesis, success_criteria (jsonb), status, results (jsonb), created_at | Validation experiments |
| experiment_results | id, experiment_id, metric_name, target_value, actual_value, confidence, recorded_at | Experiment metrics |

#### 09f-customer

**Customer Tables**

| Table | Columns | Purpose |
|-------|---------|---------|
| customer_segments | id, project_id, name, description, size_estimate, is_primary, created_at | Customer segments |
| customer_forces | id, segment_id, force_type, description, strength, evidence, created_at | Forces diagram data |
| jobs_to_be_done | id, segment_id, job_type, situation, motivation, outcome, importance, satisfaction, created_at | JTBD statements |
| interviews | id, project_id, segment_id, interviewee_name, transcript, insights (jsonb), created_at | Interview records |

#### 09g-traction

**Traction Tables**

| Table | Columns | Purpose |
|-------|---------|---------|
| traction_milestones | id, project_id, name, target_value, current_value, metric_type, target_date, achieved_at, created_at | Growth milestones |
| channel_tests | id, project_id, channel_name, status, spend, acquisitions, cac (computed), ltv_estimate, created_at | Channel experiments |
| pmf_scores | id, project_id, score, sean_ellis_pct, nps, d30_retention, signals (jsonb), calculated_at | PMF measurements |

#### 09h-decisions

**Decision Tables**

| Table | Columns | Purpose |
|-------|---------|---------|
| decisions | id, project_id, sprint_id, decision_type, title, context, options (jsonb), chosen_option, rationale, outcome, created_at | Decision log |
| stage_gates | id, project_id, from_stage, to_stage, criteria (jsonb), status, blockers (jsonb), passed_at, created_at | Gate definitions |

---

## 10-functions

### Edge Functions

#### 10a-journey

**journey-agent**

| Action | Input | Output | Description |
|--------|-------|--------|-------------|
| map | persona, interviews | journey object | Create customer journey map |
| analyze_touchpoints | journeyId | touchpoint analysis | Analyze touchpoint health |
| find_gaps | journeyId | gap list | Identify experience gaps |
| suggest_future_state | journeyId, touchpointId | improvement plan | Suggest improvements |

#### 10b-story

**story-agent**

| Action | Input | Output | Description |
|--------|-------|--------|-------------|
| create_backbone | journeyId | backbone steps | Generate backbone from journey |
| add_stories | backboneId, features | stories list | Add stories under backbone |
| identify_mvp | storyMapId | mvp line position | Draw MVP line |
| cluster_releases | storyMapId, velocity | release clusters | Group into releases |

#### 10c-roadmap

**roadmap-agent**

| Action | Input | Output | Description |
|--------|-------|--------|-------------|
| prioritize | initiatives, objectives | ordered list | Prioritize by objectives |
| generate_view | projectId, audience | filtered roadmap | Create stakeholder view |
| tie_to_objectives | initiativeId, objectiveId | updated initiative | Link to OKR |
| reorder | initiativeId, newColumn | updated initiative | Move between columns |

#### 10d-sprint

**sprint-agent**

| Action | Input | Output | Description |
|--------|-------|--------|-------------|
| plan_90day | projectId, assumptions | sprint plan | Create 90-day sprint |
| track_learning | sprintId | learning summary | Track learning progress |
| detect_bottleneck | sprintId | bottleneck info | Identify blockers |
| retrospect | sprintId | retro insights | Generate retrospective |

#### 10e-canvas

**lean-canvas-agent**

| Action | Input | Output | Description |
|--------|-------|--------|-------------|
| generate | ideaDescription | canvas object | Generate initial canvas |
| refine | canvasId, section, feedback | updated section | Refine specific section |
| validate | canvasId | assumptions list | Extract assumptions |
| link_to_journey | canvasId, journeyId | linked canvas | Connect to journey |

#### 10f-experiment

**experiment-agent**

| Action | Input | Output | Description |
|--------|-------|--------|-------------|
| design | assumptionId, sprintId | experiment object | Design experiment |
| track | experimentId, metrics | updated results | Record metrics |
| conclude | experimentId | conclusion | Analyze and conclude |
| link_to_touchpoint | experimentId, touchpointId | linked experiment | Connect to touchpoint |

---

## 11-wiring

### Frontend-Backend Wiring

#### 11a-journey

**CustomerJourney Wiring**

| Component | Hook | Edge Function | Action |
|-----------|------|---------------|--------|
| JourneyCanvas | useJourney | journey-agent | map |
| TouchpointList | useTouchpoints | journey-agent | analyze_touchpoints |
| GapAnalysis | useGaps | journey-agent | find_gaps |
| FutureState | useFutureState | journey-agent | suggest_future_state |
| AgentChat | useAgent | journey-agent | — |

#### 11b-storymap

**StoryMap Wiring**

| Component | Hook | Edge Function | Action |
|-----------|------|---------------|--------|
| BackboneView | useBackbone | story-agent | create_backbone |
| StoryGrid | useStories | story-agent | add_stories |
| MVPLine | useMVP | story-agent | identify_mvp |
| ReleaseView | useReleases | story-agent | cluster_releases |
| AgentChat | useAgent | story-agent | — |

#### 11c-roadmap

**NowNextLater Wiring**

| Component | Hook | Edge Function | Action |
|-----------|------|---------------|--------|
| ColumnView | useRoadmap | roadmap-agent | prioritize |
| StakeholderView | useView | roadmap-agent | generate_view |
| InitiativeCard | useInitiative | roadmap-agent | tie_to_objectives |
| DragDrop | useReorder | roadmap-agent | reorder |
| AgentChat | useAgent | roadmap-agent | — |

#### 11d-sprint

**LeanSprint Wiring**

| Component | Hook | Edge Function | Action |
|-----------|------|---------------|--------|
| SprintPlan | useSprint | sprint-agent | plan_90day |
| LearningTracker | useLearning | sprint-agent | track_learning |
| BottleneckAlert | useBottleneck | sprint-agent | detect_bottleneck |
| RetroView | useRetro | sprint-agent | retrospect |
| AgentChat | useAgent | sprint-agent | — |

#### 11e-dashboard

**FounderDashboard Wiring**

| Component | Hook | Edge Function | Action |
|-----------|------|---------------|--------|
| StageProgress | useStage | gate-agent | check |
| JourneyHealth | useJourneyHealth | journey-agent | analyze_touchpoints |
| SprintProgress | useSprintProgress | sprint-agent | track_learning |
| NowColumn | useNow | roadmap-agent | prioritize |
| AgentChat | useAgent | orchestrator | recommend_next |

---

## 12-playbooks

### Industry Playbooks

| ID | Industry | Journey Focus | Roadmap Focus |
|----|----------|---------------|---------------|
| PB-01 | SaaS/B2B | Trial → Onboarding → Expansion | ARR, Churn reduction |
| PB-02 | Consumer Apps | Download → Activation → Retention | DAU/MAU, Viral loops |
| PB-03 | Fintech | Trust → Compliance → Usage | Regulatory gates |
| PB-04 | E-commerce | Browse → Cart → Purchase → Return | AOV, Repeat purchase |
| PB-05 | Marketplace | Supply → Demand → Transaction | Liquidity, Take rate |
| PB-06 | Healthtech | Symptom → Consult → Treatment → Follow-up | Outcomes, Compliance |
| PB-07 | Edtech | Discover → Enroll → Learn → Complete | Completion rate |

### Prompt Packs

| ID | Pack | Purpose | Screens |
|----|------|---------|---------|
| PP-01 | Journey Mapper | Create customer journey maps | CustomerJourney |
| PP-02 | Story Prioritizer | Prioritize features by journey | StoryMap |
| PP-03 | Roadmap Communicator | Tailor roadmaps for stakeholders | NowNextLater |
| PP-04 | Sprint Designer | Design 90-day learning sprints | LeanSprint |
| PP-05 | Gap Finder | Identify journey gaps | CustomerJourney |
| PP-06 | MVP Definer | Draw MVP line on story map | StoryMap |
| PP-07 | Experiment Designer | Create validation experiments | ExperimentLab |

---

## 13-dependencies

### External Dependencies

| Dependency | Purpose | Features Used |
|------------|---------|---------------|
| Gemini 3 | Fast AI operations | Flash for quick tasks, Pro for analysis |
| Claude 4.5 | Complex reasoning | Sonnet for experiments, Opus for decisions |
| Supabase | Backend | Auth, DB, RLS, Edge Functions, Realtime |
| React Query | Data fetching | Caching, mutations |
| Recharts | Visualization | Journey charts, funnel, cohorts |
| shadcn/ui | UI components | Cards, dialogs, forms |
| react-beautiful-dnd | Drag and drop | Story map, roadmap columns |

### Internal Dependencies

| Module | Depends On | Used By |
|--------|------------|---------|
| journey-agent | ai-client, database | CustomerJourney, StoryMap |
| story-agent | journey-agent, database | StoryMap, MVPPlanner |
| roadmap-agent | story-agent, database | NowNextLater, Dashboard |
| sprint-agent | experiment-agent, database | LeanSprint |
| lean-canvas-agent | journey-agent, database | LeanCanvas |
| experiment-agent | journey-agent, sprint-agent | ExperimentLab |

---

## 14-flows

### Key Workflows

#### 14a-journey

**Customer Journey Flow**

| Step | Action | Output |
|------|--------|--------|
| 1 | Define persona | Persona created |
| 2 | Map journey phases | 6 phases defined |
| 3 | Add touchpoints | Touchpoints per phase |
| 4 | Score satisfaction | Pain points identified |
| 5 | Find gaps | Gaps surfaced |
| 6 | Plan future state | Improvements defined |

#### 14b-story

**Story Mapping Flow**

| Step | Action | Output |
|------|--------|--------|
| 1 | Create backbone from journey | Backbone steps |
| 2 | Add user stories under each | Stories organized |
| 3 | Prioritize vertically | Top = highest priority |
| 4 | Draw MVP line | MVP scope defined |
| 5 | Cluster into releases | Release plan |
| 6 | Link to roadmap | Now/Next/Later populated |

#### 14c-roadmap

**Now-Next-Later Flow**

| Step | Action | Output |
|------|--------|--------|
| 1 | Import from story map | Initiatives created |
| 2 | Tie to objectives | OKRs linked |
| 3 | Prioritize into columns | Now/Next/Later sorted |
| 4 | Generate stakeholder view | Tailored roadmap |
| 5 | Present without deadlines | Flexible plan shared |
| 6 | Reorder as needed | Living document |

#### 14d-sprint

**90-Day Learning Sprint Flow**

| Step | Action | Output |
|------|--------|--------|
| 1 | Set learning goal | Goal defined |
| 2 | Identify assumptions | Assumptions from canvas |
| 3 | Design experiments | Experiments planned |
| 4 | Run experiments (6-8 weeks) | Data collected |
| 5 | Analyze results | Insights captured |
| 6 | Make decision | Pivot/Persevere |

---

## 15-execution

### Implementation Order

#### Phase 1: Foundation (Weeks 1-2)

| Task | Description |
|------|-------------|
| 01-schema | Create all database tables |
| 02-journey-agent | Implement journey-agent |
| 03-story-agent | Implement story-agent |
| 04-roadmap-agent | Implement roadmap-agent |

#### Phase 2: Screens (Weeks 3-4)

| Task | Description |
|------|-------------|
| 05-journey-screen | Build CustomerJourney screen |
| 06-storymap-screen | Build StoryMap screen |
| 07-nownextlater-screen | Build NowNextLater screen |
| 08-dashboard-screen | Build FounderDashboard |

#### Phase 3: Sprints (Weeks 5-6)

| Task | Description |
|------|-------------|
| 09-sprint-agent | Implement sprint-agent |
| 10-sprint-screen | Build LeanSprint screen |
| 11-experiment-link | Link experiments to sprints |
| 12-learning-log | Add learning log capture |

#### Phase 4: Integration (Weeks 7-8)

| Task | Description |
|------|-------------|
| 13-canvas-journey-link | Link canvas to journey |
| 14-assumption-touchpoint-link | Link assumptions to touchpoints |
| 15-stakeholder-views | Implement stakeholder view generation |
| 16-gate-updates | Update gates for new stages |

#### Phase 5: Polish (Weeks 9-10)

| Task | Description |
|------|-------------|
| 17-playbooks | Implement industry playbooks |
| 18-prompts | Implement prompt packs |
| 19-drag-drop | Add drag-and-drop to story map |
| 20-export | Add roadmap export views |

---

## 16-summary

### Key Points

1. **Hybrid System:** Combines Lean frameworks with founder roadmap methodologies
2. **Journey-First:** Customer journey mapping drives feature prioritization
3. **Story Mapping:** Features organized by journey phase, not flat backlog
4. **Now-Next-Later:** Flexible roadmaps without arbitrary deadlines
5. **90-Day Sprints:** Learning cycles focused on outcomes, not output
6. **Stakeholder Views:** Tailored roadmaps for each audience
7. **Connected Data:** Journey → Story Map → Roadmap → Sprint all linked

### Success Metrics

| Metric | Target |
|--------|--------|
| Journey map completion | 90% by STRATEGY stage |
| Story map usage | 80% use for prioritization |
| Deadline-free roadmaps | 100% adoption |
| Learning sprint success | 70% achieve learning goal |
| Stakeholder satisfaction | 4+ rating on roadmap clarity |

### Hybrid Benefits

| Benefit | How Achieved |
|---------|--------------|
| Better customer understanding | Journey mapping |
| Clear feature prioritization | Story mapping |
| Flexible planning | Now-Next-Later |
| Learning focus | 90-day sprints |
| Stakeholder alignment | Tailored views |
| Reduced deadline stress | No date commitments |

### Next Steps

1. Create database migrations for journey, story, roadmap tables
2. Implement journey-agent edge function
3. Build CustomerJourney screen with touchpoint mapping
4. Build StoryMap screen with drag-and-drop
5. Build NowNextLater with stakeholder view generation
6. Implement 90-day sprint tracking
