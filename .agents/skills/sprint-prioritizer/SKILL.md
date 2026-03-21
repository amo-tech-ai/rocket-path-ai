# Sprint Prioritizer Skill

> Domain knowledge for sprint planning, feature prioritization, and capacity management.
> Feeds into: `sprint-agent` edge function (task generation, prioritization), Composer Group D (next steps prioritization).

## RICE Framework

The primary scoring model for ranking features and tasks. Formula:

```
RICE Score = (Reach x Impact x Confidence) / Effort
```

### Dimension Definitions

| Dimension | Scale | How to Estimate |
|-----------|-------|-----------------|
| **Reach** | Number of users affected per quarter | Use analytics data, user segments, or % of MAU |
| **Impact** | 0.25 = minimal, 0.5 = low, 1 = medium, 2 = high, 3 = massive | How much does this move the target metric per user? |
| **Confidence** | 100% = high (data-backed), 80% = medium (strong intuition), 50% = low (speculation) | Downgrade ambitious estimates honestly |
| **Effort** | Person-months (0.5 minimum) | Include design, dev, QA, deployment. Add 15% buffer |

### Scoring Example

| Feature | Reach | Impact | Confidence | Effort | RICE Score |
|---------|-------|--------|------------|--------|------------|
| Onboarding redesign | 500/qtr | 2 (high) | 80% | 2 pm | 400 |
| Dark mode | 200/qtr | 0.5 (low) | 100% | 1 pm | 100 |
| API webhooks | 50/qtr | 3 (massive) | 50% | 3 pm | 25 |

**Rule**: When two items score within 10% of each other, use strategic alignment as the tiebreaker, not the decimal.

## Value vs Effort Matrix

Plot features on a 2x2 grid for rapid triage:

| Quadrant | Value | Effort | Action |
|----------|-------|--------|--------|
| **Quick Wins** | High | Low | Do first. Highest ROI per sprint point |
| **Big Bets** | High | High | Plan carefully. Phase into milestones |
| **Fill-Ins** | Low | Low | Use for capacity balancing. Do not plan sprints around these |
| **Time Sinks** | Low | High | Reject or fundamentally redesign. Never "just do it" |

## Kano Model Classification

Categorize features by how they affect user satisfaction:

| Type | If Present | If Absent | Sprint Priority |
|------|-----------|-----------|-----------------|
| **Must-Have** | No increase in satisfaction (expected) | Strong dissatisfaction | Always include. Ship first |
| **Performance** | Linear satisfaction increase | Linear dissatisfaction | Optimize based on RICE score |
| **Delighter** | Disproportionate satisfaction | No dissatisfaction | Invest selectively for differentiation |
| **Indifferent** | No impact | No impact | Remove from backlog |
| **Reverse** | Decreases satisfaction | No impact | Do not build. Kill if exists |

**Key insight**: Must-Haves degrade over time (today's delighter is tomorrow's must-have). Re-evaluate quarterly.

## Sprint Planning Process

### Pre-Sprint (Week Before)

1. **Backlog Refinement**: Size stories, review acceptance criteria, validate definition of done
2. **Dependency Mapping**: Identify cross-team blockers. Resolve before sprint starts, not during
3. **Capacity Assessment**: Calculate available person-days (subtract PTO, meetings, overhead at 15-20%)
4. **Risk Identification**: Flag technical unknowns. Spike stories for anything with > 50% uncertainty
5. **Stakeholder Alignment**: Confirm priorities have not shifted. Get explicit sign-off

### Sprint Planning (Day 1)

1. **Sprint Goal**: One clear, measurable objective. "Ship X so that Y users can Z" format
2. **Story Selection**: Pull from ranked backlog up to capacity minus 15% buffer
3. **Task Breakdown**: Each story broken into tasks with individual estimates and skill matching
4. **Definition of Done**: Quality bar explicit -- includes tests, docs, review, deployment
5. **Team Commitment**: Collective agreement on deliverables. Not assigned top-down

### Execution Support

- **Daily standups**: 15 min. Three questions: done, doing, blocked. Solve blockers offline
- **Mid-sprint check**: Day 3-4. If burndown is off track, cut scope (do not extend time)
- **Stakeholder updates**: Proactive, not reactive. Share progress before they ask

## Capacity Planning

### Velocity Calculation

- Use 6-sprint rolling average (not last sprint, not best sprint)
- Adjust for team composition changes: new member = 50% velocity for first sprint
- Overhead factor: subtract 15-20% from raw capacity for meetings, reviews, support
- Uncertainty buffer: 10-15% for stable teams, 20-25% for new teams or new domains

### Capacity Formula

```
Available capacity = (team_size x working_days x hours_per_day)
                     x (1 - overhead_factor)
                     x (1 - uncertainty_buffer)
```

### Load Balancing Rules

- No individual above 85% utilization (burnout prevention)
- Each story has a primary and secondary owner (bus factor)
- Distribute complexity evenly -- do not stack all hard stories on one person
- Include one stretch assignment per sprint for growth

## Sprint Anti-Patterns

| Anti-Pattern | Symptom | Fix |
|-------------|---------|-----|
| Scope creep | Stories added mid-sprint | Strict change management: new work goes to next sprint |
| Carryover debt | Same stories roll 3+ sprints | Re-estimate, break down further, or kill |
| No slack | 100% capacity committed | Always keep 15% buffer for emergent work |
| Hero dependency | One person owns 60%+ of points | Redistribute, pair program, cross-train |
| Velocity inflation | Points increase but output does not | Calibrate against delivered value, not story counts |

## Success Metrics

| Metric | Target | What It Tells You |
|--------|--------|-------------------|
| Sprint completion rate | 90%+ committed points delivered | Planning accuracy |
| Velocity variance | < 15% sprint-to-sprint | Team stability and predictability |
| Carryover rate | < 10% of committed stories | Estimation and scoping quality |
| Cycle time | Trending downward | Process efficiency |
| Feature success rate | 80%+ meet predefined success criteria | Prioritization quality |
| Tech debt ratio | < 20% of sprint capacity | Long-term code health |

## StartupAI Integration Points

- **sprint-agent EF**: Generates 24 validation tasks (4 per sprint x 6 sprints) using RICE scoring for prioritization. Kano classification determines must-have vs delighter tasks
- **Composer Group D**: Next steps in validator reports are prioritized using Value vs Effort matrix (Quick Wins first, Big Bets phased)
- **Sprint Board UI**: KanbanBoard uses capacity planning formulas for load indicators, velocity calculation for sprint health
- **Validator scoring**: Execution dimension evaluates whether the startup has a credible sprint plan with realistic capacity estimates
