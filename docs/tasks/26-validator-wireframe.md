# 15-Validator Wireframe

> Decision-first validation report - Idea Proof style

---

## Design Philosophy

| Principle | Implementation |
|-----------|----------------|
| One question at a time | Sequential decision blocks |
| Decision blocks, not data categories | Verdict → Confidence → Action → Evidence |
| Scan-first, expand-later | Headlines visible, details collapsed |
| Repetitive patterns | Consistent card layouts throughout |
| Decision tool, not document | Guide action, don't dump data |

---

## Layout

| Panel | Width | Content |
|-------|-------|---------|
| Header | 100% | Idea name, verdict badge, last updated |
| Main | 100% | Sequential decision blocks (no side panels) |
| Footer | 100% | Export, share, compare versions |

---

## Decision Sequence

| Step | Question | Content |
|------|----------|---------|
| 1 | Should I continue? | Verdict + Score |
| 2 | What are the tradeoffs? | Strengths vs Concerns |
| 3 | How confident is this? | Confidence band + signals |
| 4 | What should I do next? | Top 3 actions |
| 5 | Show me the proof | Expandable evidence sections |

---

## Header Bar

| Element | Sample Content |
|---------|----------------|
| Idea Name | TaskFlow - Team Task Management |
| Verdict Badge | Worth Pursuing |
| Score | 72/100 |
| Updated | 2 hours ago |
| Actions | Share, Export, Compare |

---

## Block 1 - Verdict

### Visible by Default

| Element | Content |
|---------|---------|
| ........................... | |
| Verdict Label | Worth Pursuing |
| Verdict Color | Green |
| Score | 72/100 |
| One-Line Summary | Strong problem-solution fit with clear market demand. Execute with focus on SMB teams. |
| ........................... | |

### Verdict Scale

| Score | Label | Color | Meaning |
|-------|-------|-------|---------|
| 80-100 | Strong Yes | Green | High confidence, proceed aggressively |
| 60-79 | Worth Pursuing | Light Green | Good potential, address concerns |
| 40-59 | Needs Work | Yellow | Significant issues, pivot or validate more |
| 20-39 | High Risk | Orange | Major concerns, reconsider approach |
| 0-19 | Stop | Red | Fundamental flaws, do not proceed |

---

## Block 2 - Tradeoffs

### Two-Column Comparison

| Strengths | Concerns |
|-----------|----------|
| ........................... | ........................... |
| Clear pain point validated | Crowded market |
| 15 interviews confirm need | No mobile experience yet |
| Simple solution resonates | Pricing not fully validated |
| Team has relevant experience | Limited runway (8 months) |
| ........................... | ........................... |

### Format Rules

| Rule | Implementation |
|------|----------------|
| Max items | 4-5 per column |
| Item length | Single line, <10 words |
| No explanations | Just the point |
| Icons | Checkmark for strengths, warning for concerns |

---

## Block 3 - Confidence

### Confidence Band

| Element | Content |
|---------|---------|
| ........................... | |
| Confidence Level | Medium-High |
| Confidence Score | 75% |
| ........................... | |

### Confidence Bar

| Low | Medium | High |
|-----|--------|------|
| ░░░ | ███░░ | ░░░ |
| 0-40% | 40-70% | 70-100% |

### Signal Summary (Collapsed by Default)

| Signal Type | Count | Status |
|-------------|-------|--------|
| Interviews completed | 15/15 | Done |
| Assumptions validated | 8/12 | In Progress |
| Experiments run | 3/5 | In Progress |
| Market data points | 12 | Sufficient |

---

## Block 4 - Next Actions

### Top 3 Actions Card

| Priority | Action | Why |
|----------|--------|-----|
| ........................... | | |
| 1 | Validate $29 pricing | Highest risk assumption |
| 2 | Build mobile prototype | Top feature request |
| 3 | Close 5 more beta users | Need usage data |
| ........................... | | |

### Action Card Format

| Element | Content |
|---------|---------|
| Number | 1, 2, 3 |
| Action | Imperative verb + object |
| Why | Single reason (optional) |
| CTA | Start → links to relevant screen |

---

## Block 5 - Evidence (Expandable)

### Evidence Accordion

| Section | Visible | Expanded |
|---------|---------|----------|
| Market | Score only | Full analysis |
| Problem | Score only | Interview quotes |
| Solution | Score only | Validation data |
| Business Model | Score only | Unit economics |
| Risks | Count only | Risk cards |
| Roadmap | Status only | Timeline |

### Section Header Pattern

| Market | 8/10 | [Expand] |
|--------|------|----------|

### Market - Collapsed

| Element | Content |
|---------|---------|
| Section Name | Market |
| Score Badge | 8/10 |
| One-Line | $12B TAM with 15% CAGR |
| Expand Arrow | → |

### Market - Expanded

| Field | Value |
|-------|-------|
| TAM | $12B |
| SAM | $2.4B |
| SOM | $24M |
| Growth Rate | 15% CAGR |
| Key Trend | Remote work adoption |
| Competition | Fragmented, no clear leader in SMB |
| Source | Gartner 2025, internal analysis |

### Problem - Collapsed

| Element | Content |
|---------|---------|
| Section Name | Problem |
| Score Badge | 9/10 |
| One-Line | 15/15 interviews confirm pain point |
| Expand Arrow | → |

### Problem - Expanded

| Evidence | Source |
|----------|--------|
| "I spend 2 hours/day just tracking tasks" | Sarah, PM at Acme |
| "We lose things between Slack and email" | Marcus, Founder |
| "No visibility into team workload" | Lisa, Team Lead |
| Frequency | Daily pain for 90% |
| Severity | High (8.2/10 average) |
| Alternatives tried | Asana (too complex), Trello (too simple) |

### Solution - Collapsed

| Element | Content |
|---------|---------|
| Section Name | Solution |
| Score Badge | 7/10 |
| One-Line | 5-min setup resonates, mobile gap |
| Expand Arrow | → |

### Solution - Expanded

| Validation | Status |
|------------|--------|
| Core value prop tested | Validated |
| Setup time validated | 4.2 min average |
| Feature-problem fit | 8/10 features map to pains |
| Gap identified | Mobile experience missing |
| Competitor advantage | Simpler than Asana, richer than Trello |

### Business Model - Collapsed

| Element | Content |
|---------|---------|
| Section Name | Business Model |
| Score Badge | 7/10 |
| One-Line | 8.5x LTV/CAC, pricing needs validation |
| Expand Arrow | → |

### Business Model - Expanded

| Metric | Value | Status |
|--------|-------|--------|
| LTV | $384 | Estimated |
| CAC | $45 | Validated |
| LTV/CAC | 8.5x | Healthy |
| Payback | 1.5 months | Excellent |
| Pricing | $29/mo | Testing |
| Gross Margin | 85% | Target |

### Risks - Collapsed

| Element | Content |
|---------|---------|
| Section Name | Risks |
| Count Badge | 3 critical |
| One-Line | Pricing, competition, runway |
| Expand Arrow | → |

### Risks - Expanded

| Risk | Severity | Mitigation |
|------|----------|------------|
| Pricing not validated | High | A/B test running |
| Competitor may copy | Medium | Speed to market |
| 8-month runway | High | Raise or revenue |

### Roadmap - Collapsed

| Element | Content |
|---------|---------|
| Section Name | Roadmap |
| Status Badge | On Track |
| One-Line | MVP in 8 weeks, beta in 12 |
| Expand Arrow | → |

### Roadmap - Expanded

| Milestone | Target | Status |
|-----------|--------|--------|
| MVP Complete | Week 8 | On Track |
| Beta Launch | Week 12 | Planned |
| First Revenue | Week 16 | Planned |
| PMF Target | Week 24 | Goal |

---

## Component Patterns

### Score Card (Reused Everywhere)

| Element | Style |
|---------|-------|
| ........................... | |
| Score Number | Large, bold |
| Label | Small, muted |
| Color | Based on threshold |
| ........................... | |

### Two-Column Compare (Reused)

| Left Column | Right Column |
|-------------|--------------|
| Positive items | Negative items |
| Green icons | Yellow/red icons |
| Same layout | Same layout |

### Expand/Collapse (Reused)

| State | Display |
|-------|---------|
| Collapsed | Header + score + one-line + arrow |
| Expanded | Full content with tables |
| Transition | Smooth accordion |

### Action Card (Reused)

| Element | Style |
|---------|-------|
| Number | Circle badge |
| Action | Bold text |
| Reason | Muted subtext |
| CTA | Button or link |

---

## Mobile Layout

| Block | Mobile Adaptation |
|-------|-------------------|
| Verdict | Full width, stacked |
| Tradeoffs | Stacked (strengths, then concerns) |
| Confidence | Horizontal bar |
| Actions | Vertical list |
| Evidence | Same accordion |

---

## Interaction Flow

| Step | User Action | System Response |
|------|-------------|-----------------|
| 1 | View page | See verdict + score immediately |
| 2 | Scan tradeoffs | Understand key strengths/concerns |
| 3 | Check confidence | Know how much to trust verdict |
| 4 | Read actions | Know exactly what to do next |
| 5 | Click expand | See detailed evidence if curious |
| 6 | Click action | Navigate to relevant tool |

---

## Comparison: Old vs New

| Aspect | Old (Busy) | New (Clean) |
|--------|------------|-------------|
| Structure | 10+ equal sections | 5 sequential blocks |
| Default state | Everything visible | Only decisions visible |
| Mental model | Document to read | Tool to use |
| First impression | "This is complicated" | "I know what to do" |
| Time to value | 5+ minutes | 30 seconds |
| Cognitive load | High | Low |

---

## Sample Data

### Idea: TaskFlow

| Field | Value |
|-------|-------|
| Verdict | Worth Pursuing |
| Score | 72/100 |
| Confidence | 75% (Medium-High) |
| Top Strength | Clear pain point validated |
| Top Concern | Crowded market |
| Top Action | Validate $29 pricing |
| Stage | PSF (Problem-Solution Fit) |
| Updated | 2 hours ago |

---

## Edge Cases

| Scenario | Display |
|----------|---------|
| No data yet | "Run validation to see results" |
| Partial data | Show available, gray out missing |
| Very low score | Red verdict, clear "why" and "what to do" |
| Very high score | Green verdict, still show concerns |
| Multiple ideas | Comparison view available |

---

## Export Options

| Format | Content |
|--------|---------|
| Summary (1-page) | Verdict + tradeoffs + actions only |
| Full Report | All sections expanded |
| Investor Brief | Verdict + market + business model |
| Team Brief | Actions + roadmap + risks |
