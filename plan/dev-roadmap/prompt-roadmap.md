# Product Roadmap Generation Prompt

> **Version:** 2.0 | **Updated:** 2026-02-02
> **Sources:** Atlassian, ProductPlan, ProductSchool, Aha.io
> **Purpose:** Generate comprehensive, stakeholder-appropriate product roadmaps

---

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Product Vision](#product-vision)
3. [Prioritization Frameworks](#prioritization-frameworks)
4. [User Stories & User Flows](#user-stories--user-flows)
5. [Master Roadmap Prompt](#master-roadmap-generation-prompt)
6. [Specialized Prompts](#specialized-prompts)
7. [Roadmap Types](#roadmap-types)
8. [Methodologies](#product-management-methodologies)
9. [Anti-Patterns & Checklists](#anti-patterns-to-avoid)
10. [References](#references)

---

## Quick Reference

### Strategy vs Roadmap

| Aspect | Strategy | Roadmap |
|--------|----------|---------|
| Question | What & Why | How & When |
| Timeframe | Long-term (1-3 years) | Short-term (weeks-quarters) |
| Scope | Bird's-eye view | Granular perspective |
| Focus | Outward (market, customers) | Inward (tasks, milestones) |
| Flexibility | Highly adaptive | More fixed, specific |

### Roadmap Types

| Type | Focus | Best For |
|------|-------|----------|
| **Features** | Specific deliverables with dates | Teams needing concrete releases |
| **Outcome-based** | Themes tied to measurable results | Strategic, flexible planning |
| **Now-Next-Later** | Time horizons over fixed dates | Reducing overcommitment |
| **Agile** | Iterative, sprint-based cycles | Rapid feedback environments |
| **Release** | Activities before market launch | Launch coordination |
| **Portfolio** | Cross-product alignment | Multi-product organizations |
| **Strategy** | High-level efforts aligned with goals | Executive communication |
| **Features** | Specific functionality with delivery dates | Detailed execution view |
| **Go-to-Market** | Launch activities and coordination | Cross-functional launches |
| **Technology** | IT infrastructure and improvements | Technical planning |

---

## Product Vision

### Definition
Product Vision is a strategic long-term framework (2-5 years for software, 5-10 years for hardware) that defines a product's overarching direction. It serves as a compass for decision-making.

### Vision vs Roadmap

| Aspect | Vision | Roadmap |
|--------|--------|---------|
| Timeframe | 2-10 years | Months to 2 years |
| Nature | Strategic, stable | Tactical, flexible |
| Content | Broad aspirations | Specific features/timelines |
| Purpose | Inspire & guide | Execute & deliver |

### Creating a Product Vision (6 Steps)

1. **Deep market research** — Understand competition and trends
2. **Identify target customers** — Map their pain points
3. **Develop value proposition** — Explain unique benefits
4. **Define differentiators** — What makes you unique?
5. **Draft vision statement** — Clear, concise, inspiring
6. **Create vision document** — Single source of truth

### Vision Statement Examples

| Company | Vision |
|---------|--------|
| **Amazon Kindle** | "Every book ever printed in any language all available in 60 seconds" |
| **LinkedIn** | "Create economic opportunity for every member of the global workforce" |
| **Slack** | "Make work life simpler, more pleasant and more productive" |

### Product Vision Prompt

```
Generate a product vision for {{product_name}}.

## VISION COMPONENTS

1. **Vision Statement** (1-2 sentences)
   - Inspirational and aspirational
   - Customer-focused benefit
   - 2-5 year horizon

2. **Target Customer**
   - Who are they? (specific persona)
   - What pain do they experience?
   - What transformation do they seek?

3. **Value Proposition**
   - What unique value do we provide?
   - Why us over alternatives?

4. **Success Metrics**
   - How will we know we've achieved the vision?
   - 3-5 measurable KPIs

5. **Guiding Principles**
   - 3-5 principles that guide decisions
   - What we will and won't do

## OUTPUT FORMAT

### Vision Statement
[One inspiring sentence]

### The Problem We Solve
[Customer pain point in their words]

### Our Solution
[How we uniquely address it]

### Success Looks Like
[Measurable outcomes in 3-5 years]

### Principles
1. [Principle]: [Why it matters]
2. [Principle]: [Why it matters]
3. [Principle]: [Why it matters]
```

---

## Prioritization Frameworks

### Framework Comparison

| Framework | Best For | Complexity | Quantitative |
|-----------|----------|------------|--------------|
| **MoSCoW** | Stakeholder communication | Low | No |
| **RICE** | Data-driven decisions | Medium | Yes |
| **Impact-Effort** | Quick visual sorting | Low | No |
| **Kano** | Customer satisfaction | Medium | Semi |
| **Cost of Delay** | ROI focus | High | Yes |
| **Weighted Scoring** | Custom criteria | Medium | Yes |
| **DFV** | Balanced evaluation | Medium | Yes |
| **Product Tree** | Collaborative sessions | Low | No |
| **Buy a Feature** | Stakeholder buy-in | Low | No |

### 1. MoSCoW Method

| Category | Description | Action |
|----------|-------------|--------|
| **Must Have** | Product cannot function without | Build first |
| **Should Have** | Important but not essential | Build second |
| **Could Have** | Nice-to-have enhancements | Build if time |
| **Won't Have** | Low value, high effort | Skip |

### 2. RICE Scoring

```
RICE Score = (Reach × Impact × Confidence) / Effort

Reach: Users impacted (0-100% or absolute number)
Impact: Effect on goal (0.25 = minimal, 0.5 = low, 1 = medium, 2 = high, 3 = massive)
Confidence: Certainty (0-100%)
Effort: Person-weeks or story points
```

### 3. Impact-Effort Matrix

```
                    HIGH IMPACT
                         │
         QUICK WINS      │      BIG BETS
         (Do First)      │    (Plan Carefully)
                         │
LOW EFFORT ──────────────┼────────────── HIGH EFFORT
                         │
         FILL-INS        │    MONEY PITS
         (Do If Time)    │      (Avoid)
                         │
                    LOW IMPACT
```

### 4. Kano Model

| Feature Type | Customer Reaction | Priority |
|--------------|-------------------|----------|
| **Delighters** | Unexpected, creates WOW | Differentiate |
| **Performance** | More = more satisfaction | Optimize |
| **Basic** | Expected, absence = dissatisfaction | Must have |

### 5. Desirability, Feasibility, Viability (DFV)

Score each feature 1-10 on:
- **Desirability**: Do customers want it?
- **Feasibility**: Can we build it?
- **Viability**: Does it make business sense?

DFV Score = (D + F + V) / 3

### 6. Cost of Delay

```
Cost of Delay = (Weekly Revenue × Delay Weeks) + Opportunity Cost

Priority = Cost of Delay / Development Duration
```

### Prioritization Prompt

```
Prioritize the following features/initiatives for {{product_name}} using multiple frameworks.

## FEATURES TO PRIORITIZE
{{feature_list}}

## APPLY FRAMEWORKS

### 1. MoSCoW Classification
| Feature | Must | Should | Could | Won't | Rationale |
|---------|------|--------|-------|-------|-----------|

### 2. RICE Scoring
| Feature | Reach | Impact | Confidence | Effort | Score |
|---------|-------|--------|------------|--------|-------|

### 3. Impact-Effort Matrix
| Quadrant | Features |
|----------|----------|
| Quick Wins | |
| Big Bets | |
| Fill-Ins | |
| Money Pits | |

### 4. Final Priority Stack
Based on all frameworks, rank features:
1. [Feature] - [Reason]
2. [Feature] - [Reason]
...

### Conflicts & Trade-offs
Note any framework disagreements and recommend resolution.
```

### Prioritization Anti-Patterns

| Mistake | Problem | Fix |
|---------|---------|-----|
| No scoring definitions | Inconsistent ratings | Create explicit guides with examples |
| Mixing discovery & delivery | Confusion | Separate backlogs |
| Recency bias | New ideas always win | Regular backlog grooming |
| Ignoring constraints | Unrealistic plans | Factor in dependencies/deadlines |
| Over-complicating | Analysis paralysis | Timebox discussions |
| One-time exercise | Stale priorities | Treat as iterative process |

---

## User Stories & User Flows

### User Story Format

```
As a [user type],
I want [action/feature],
So that [benefit/outcome].
```

### User Story Examples

| Story | Acceptance Criteria |
|-------|---------------------|
| As a **project manager**, I want to set task deadlines, so that my team knows when deliverables are due. | - Deadline picker on task creation<br>- Email notification 24h before<br>- Overdue indicator |
| As a **mobile user**, I want offline access to saved documents, so that I can work without internet. | - Documents cached locally<br>- Sync when online<br>- Conflict resolution UI |

### Writing Effective User Stories

**Do:**
- Keep concise (one feature per story)
- Make testable
- Include acceptance criteria
- Collaborate with team
- Use clear language

**Don't:**
- Over-specify implementation
- Include technical jargon
- Skip the "so that" benefit
- Write without user input

### User Flow Components

```
┌─────────┐    ┌─────────┐    ┌─────────┐
│  START  │───▶│ SCREEN  │───▶│  END    │
└─────────┘    └────┬────┘    └─────────┘
                   │
                   ▼
              ┌─────────┐
              │DECISION │
              │   ?     │
              └────┬────┘
                   │
          ┌────────┴────────┐
          ▼                 ▼
     [Option A]        [Option B]
```

### User Flow Creation (7 Steps)

1. **User Story** — Define the primary objective
2. **Task Flow** — Break into sequential actions
3. **Wireflow** — Connect tasks to UI components
4. **Diagram Mapping** — Visualize complete sequence
5. **Alternative Paths** — Include different user routes
6. **Testing** — Validate with heatmaps, A/B tests
7. **Iteration** — Improve based on feedback

### User Stories Generation Prompt

```
Generate user stories for {{feature_name}} in {{product_name}}.

## CONTEXT
Target User: {{persona}}
Problem: {{problem}}
Goal: {{goal}}

## OUTPUT FORMAT

For each story, provide:

### Story {{number}}
**As a** [user type]
**I want** [action]
**So that** [benefit]

**Acceptance Criteria:**
- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

**Priority:** Must Have / Should Have / Could Have
**Effort Estimate:** S / M / L / XL
**Dependencies:** [List any blockers]

Generate 5-10 stories covering:
- Happy path (main flow)
- Edge cases
- Error handling
- Accessibility needs
```

---

## Master Roadmap Generation Prompt

```
You are an expert product strategist creating a product roadmap. Generate a comprehensive roadmap that translates vision into actionable plans.

## CONTEXT
Product: {{product_name}}
Stage: {{stage}} (Idea / PSF / MVP / Traction / Scale)
Industry: {{industry}}
Target Audience: {{audience}}
Current Status: {{current_status}}

## STRATEGY FOUNDATION (Answer first)

1. **Vision**: What future are we creating?
2. **Why Now**: What market forces make this urgent?
3. **Who We Serve**: Who is the ideal customer (specific persona)?
4. **Success Definition**: What metrics prove we've succeeded?
5. **Competitive Position**: How do we differentiate?
6. **Go-to-Market**: How will we reach customers?

## ROADMAP REQUIREMENTS

### Time Horizons
- **NOW** (0-6 weeks): Detailed, committed work with specific deliverables
- **NEXT** (6-12 weeks): Planned work with estimated scope
- **LATER** (3-6 months): Strategic themes, flexible timing

### For Each Initiative Include:
1. **Initiative Name**: Clear, outcome-focused title
2. **Problem Statement**: What user/business problem does this solve?
3. **Expected Outcome**: Measurable success criteria
4. **Key Features/Deliverables**: Specific items to build
5. **Dependencies**: What must happen first?
6. **Resources Required**: Team, tools, budget estimates
7. **Risks & Mitigations**: What could go wrong?
8. **Success Metrics**: How we measure impact

### Prioritization Framework (RICE)
For each initiative, score:
- **Reach**: How many users impacted (0-100%)
- **Impact**: Effect on goal (0.25 = minimal, 3 = massive)
- **Confidence**: Certainty of estimates (0-100%)
- **Effort**: Dev time in person-weeks

RICE Score = (Reach × Impact × Confidence) / Effort

## OUTPUT FORMAT

### Executive Summary
- Product vision (1-2 sentences)
- Key objectives for this period
- Major milestones with target dates
- Resource requirements summary
- Key risks and dependencies

### Detailed Roadmap

#### NOW (Weeks 1-6)
| Initiative | Problem | Outcome | Features | Owner | Target |
|------------|---------|---------|----------|-------|--------|
| [Name] | [Problem] | [Metric] | [List] | [Team] | [Date] |

#### NEXT (Weeks 7-12)
| Initiative | Problem | Outcome | Dependencies | Estimate |
|------------|---------|---------|--------------|----------|
| [Name] | [Problem] | [Metric] | [Blockers] | [Weeks] |

#### LATER (Months 3-6)
| Theme | Strategic Goal | Success Looks Like |
|-------|----------------|-------------------|
| [Theme] | [Why this matters] | [Outcome description] |

### Dependencies Map
```
[Initiative A] ──blocks──> [Initiative B]
[Initiative C] ──requires──> [External: API/Partner]
```

### Risk Register
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| [Risk] | High/Med/Low | % | [Action] |

### Success Metrics Dashboard
| Metric | Current | Target | Timeframe |
|--------|---------|--------|-----------|
| [Metric] | [Value] | [Goal] | [When] |

## RULES
1. Never lock dates more than 6 weeks out without buffers
2. Focus on outcomes over features
3. Include "Why" for every initiative
4. Identify at least one metric per initiative
5. Flag dependencies early
6. Plan for 70% capacity (leave room for unknowns)
7. Review and update weekly

## STAKEHOLDER VIEWS

Generate tailored versions:

### Executive View
- Strategic alignment with company goals
- Revenue/growth impact projections
- Resource investment summary
- Key decision points needed

### Development View
- Technical dependencies and architecture
- Sprint-level breakdown for NOW items
- Capacity requirements by skill
- Technical debt considerations

### Customer/Sales View
- Features with customer value statements
- Release timing for customer communication
- Competitive positioning updates
- Training/documentation needs
```

---

## Specialized Prompts

### Startup Roadmap Prompt (Early Stage)

```
Generate a lean startup roadmap for {{product_name}} at {{stage}} stage.

Focus on validation over building:

## PHASE 1: VALIDATE (Weeks 1-4)
- Problem validation experiments
- Customer interview targets
- Hypothesis to test
- Success/failure criteria

## PHASE 2: BUILD MINIMUM (Weeks 5-8)
- MVP feature scope (max 5 features)
- Build vs buy decisions
- Launch criteria

## PHASE 3: MEASURE (Weeks 9-12)
- Key metrics to track
- PMF assessment criteria
- Pivot or persevere decision point

For each phase:
- What we're testing
- How we're testing it
- What "good" looks like
- What we do if it fails

Constraints:
- Budget: {{budget}}
- Team size: {{team_size}}
- Runway: {{runway_months}} months
```

### Feature Release Roadmap Prompt

```
Create a feature release roadmap for {{feature_name}}.

## PRE-LAUNCH (T-4 weeks to T-0)
| Week | Engineering | Design | Marketing | Sales |
|------|-------------|--------|-----------|-------|

## LAUNCH (T-0)
- Go-live checklist
- Rollout strategy (% rollout)
- Monitoring plan
- Support enablement

## POST-LAUNCH (T+1 to T+4 weeks)
- Success metrics tracking
- Bug fix prioritization
- Iteration opportunities
- Customer feedback loop

Include:
- Dependencies between teams
- Decision points (go/no-go)
- Rollback plan
- Communication timeline
```

### Quarterly Planning Roadmap Prompt

```
Generate a quarterly roadmap for {{quarter}} for {{product_name}}.

## QUARTER GOALS
- 3-5 measurable objectives
- Tied to company OKRs
- Clear success criteria

## MONTHLY BREAKDOWN

### Month 1: Foundation
| Week | Focus | Deliverables | Owners |
|------|-------|--------------|--------|

### Month 2: Build
| Week | Focus | Deliverables | Owners |
|------|-------|--------------|--------|

### Month 3: Ship & Measure
| Week | Focus | Deliverables | Owners |
|------|-------|--------------|--------|

## CAPACITY PLANNING
| Team | Available | Allocated | Buffer |
|------|-----------|-----------|--------|

## QUARTERLY REVIEW CRITERIA
- What we committed to
- What we delivered
- Learnings for next quarter
```

---

## Now-Next-Later Template

```
## NOW (Committed, In Progress)
High confidence. Detailed scope. Assigned owners.

| Initiative | Owner | Status | Ship Date |
|------------|-------|--------|-----------|
| {{initiative_1}} | {{owner}} | {{status}} | {{date}} |

## NEXT (Planned, Scoped)
Medium confidence. Estimated effort. Dependencies identified.

| Initiative | Why Now | Depends On | Est. Effort |
|------------|---------|------------|-------------|
| {{initiative_2}} | {{reason}} | {{blockers}} | {{weeks}} |

## LATER (Exploring, Strategic)
Low confidence. Themes only. Flexible timing.

| Theme | Strategic Value | Open Questions |
|-------|-----------------|----------------|
| {{theme_1}} | {{value}} | {{questions}} |
```

---

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Instead Do |
|--------------|---------|------------|
| Date-driven roadmaps | Creates rigid contracts | Use time horizons (Now/Next/Later) |
| Feature factories | Disconnected from goals | Lead with outcomes, not outputs |
| Building in isolation | Lacks feasibility/buy-in | Involve engineering early |
| Infrequent updates | Erodes trust | Review weekly, update monthly |
| Multiple versions | Causes confusion | Single source of truth |
| Over-commitment | Sets up for failure | Plan at 70% capacity |
| No success metrics | Can't prove value | Metric for every initiative |

---

## Roadmap Review Checklist

Before sharing, verify:

- [ ] Each initiative has a clear "why"
- [ ] Success metrics are defined and measurable
- [ ] Dependencies are mapped and communicated
- [ ] NOW items have owners and target dates
- [ ] NEXT items have effort estimates
- [ ] LATER items are themes, not commitments
- [ ] Capacity is realistic (70% rule)
- [ ] Risks are identified with mitigations
- [ ] Stakeholder-specific views are prepared
- [ ] Review cadence is established

---

## AI Model Selection

| Task | Model |
|------|-------|
| Roadmap generation | `gemini-3-pro-preview` |
| Prioritization analysis | `gemini-3-flash-preview` |
| Risk assessment | `claude-sonnet-4-5-20250929` |
| Stakeholder communication | `claude-sonnet-4-5-20250929` |

---

## References

- [Atlassian: Product Roadmaps](https://www.atlassian.com/agile/product-management/product-roadmaps)
- [ProductPlan: What is a Product Roadmap](https://www.productplan.com/learn/what-is-a-product-roadmap/)
- [ProductSchool: What is a Product Roadmap](https://productschool.com/blog/product-strategy/what-is-a-product-roadmap)
- [ProductSchool: Strategy vs Roadmap](https://productschool.com/blog/product-strategy/product-strategy-vs-product-roadmap-when-and-how-of-effective-planning)
- [Aha.io: Product Roadmap Guide](https://www.aha.io/roadmapping/guide/product-roadmap)

---

*Generated by Claude Code — 2026-02-02*
io