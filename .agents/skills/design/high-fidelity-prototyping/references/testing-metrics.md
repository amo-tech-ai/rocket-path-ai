# Usability Testing Metrics Guide

## Quantitative Metrics

### Task Success Rate
**What**: Percentage of users who complete a task successfully.
**Target**: >= 80% for critical flows, >= 90% for simple tasks.
**How to measure**: Binary (pass/fail) per task per participant.

```
Success Rate = (successful completions / total attempts) x 100
```

### Time on Task
**What**: How long users take to complete each task.
**Target**: Define per task based on complexity; track against baseline.
**How to measure**: Start timer when task is read, stop on completion or abandonment.

```
Efficiency = successful completions within target time / total attempts
```

### Error Rate
**What**: Number of errors users make per task.
**Target**: <= 1 error per task for critical flows.
**Types**: Slips (accidental), mistakes (wrong mental model), recoverable vs. unrecoverable.

### First-Click Accuracy
**What**: Whether the user's first interaction is on the correct element.
**Target**: >= 70% first-click accuracy.
**Why it matters**: If the first click is correct, 87% of users complete the task; if wrong, only 46% complete it.

### Learnability
**What**: Improvement across repeated attempts.
**How to measure**: Compare task time/errors between first and subsequent attempts.

## Qualitative Metrics

### System Usability Scale (SUS)
10-question post-test survey scored 0-100.
- **Score >= 80**: Excellent usability
- **Score 68-80**: Above average
- **Score < 68**: Below average, needs improvement

### Single Ease Question (SEQ)
After each task: "How easy was this task?" (1-7 scale)
- **Score >= 5.5**: Task is easy enough
- **Score < 4.0**: Task needs significant redesign

### Net Promoter Score (NPS)
"How likely are you to recommend this?" (0-10 scale)
- **Promoters**: 9-10
- **Passives**: 7-8
- **Detractors**: 0-6

```
NPS = % Promoters - % Detractors
```

## Observation-Based Metrics

### Hesitation Points
- Pauses > 3 seconds before acting
- Mouse hovering without clicking
- Scrolling up and down (scanning behavior)

### Recovery Patterns
- User backtracks after wrong click
- Uses browser back instead of in-app navigation
- Closes and reopens a modal/panel
- Clears and re-enters form data

### Verbal Indicators
- "I'm not sure where..."
- "Is this where I..."
- "That's not what I expected"
- "Where did it go?"

## Reporting Template

```markdown
# Usability Test Report: [Feature/Flow]

## Summary
- **Participants**: [count], [demographic summary]
- **Date**: [date range]
- **Prototype fidelity**: [hi-fi interactive]
- **Overall SUS Score**: [score]

## Task Results

| Task | Success Rate | Avg Time | Errors | SEQ |
|------|-------------|----------|--------|-----|
| 1. [description] | 85% | 45s | 0.4 | 5.8 |
| 2. [description] | 60% | 120s | 1.8 | 3.2 |

## Critical Findings
1. [Finding with evidence and recommendation]

## Recommendations
| Priority | Issue | Recommendation | Effort |
|----------|-------|----------------|--------|
| P0 | [issue] | [fix] | [S/M/L] |
| P1 | [issue] | [fix] | [S/M/L] |
```

## Sample Size Guidelines

- **Qualitative testing**: 5 users uncover ~85% of usability issues
- **Quantitative testing**: 20+ users for statistically reliable metrics
- **A/B comparison**: 30+ users per variant
- **Benchmark testing**: 12-20 users for reliable SUS scores
