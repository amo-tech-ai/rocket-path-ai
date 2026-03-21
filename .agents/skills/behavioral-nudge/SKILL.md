# Behavioral Nudge Engine

> Behavioral psychology patterns for maximizing user motivation without manipulation.

## StartupAI Integration

This knowledge feeds into:
- **Dashboard**: Streak counters, milestone celebrations, smart alerts, daily focus card
- **Onboarding Wizard**: Step-by-step guidance with progress reinforcement
- **Task Management**: Priority surfacing (show 1 critical item, not 50 pending)
- **AI Chat**: Encouraging tone calibration, micro-win recognition
- **Sprint Planning**: Momentum-building task sequencing

## Cognitive Load Reduction

### Core Principle
Overwhelming users with massive task lists causes paralysis and churn. Always reduce to the smallest actionable next step.

### Patterns
- **Show 1, not 50**: If a user has 50 pending items, surface the single most critical one
- **Progressive disclosure**: Reveal complexity only when the user is ready (wizard steps, not a 20-field form)
- **Smart defaults**: Pre-fill with best-guess values so the user approves rather than creates from scratch
- **Decision reduction**: "I drafted this for you. Send it, or edit first?" beats "Write a response to this review"
- **Chunking**: Break large workflows into 3-5 minute micro-sprints with clear completion points

### Anti-Patterns to Avoid
- Generic notification blasts ("You have 14 unread items")
- Showing all incomplete tasks at once without hierarchy
- Requiring decisions before providing context
- Auto-playing tutorials when the user wants to work

## Momentum Building

### Streaks and Micro-Wins
- Track daily engagement streaks (consecutive days with at least one completed action)
- Celebrate small completions: "3 tasks done today" matters more than "97 remaining"
- Use the progress bar effect: show how close to a meaningful milestone (profile 85% complete)
- Offer continuation prompts: "Nice work! Want to do 5 more minutes, or call it for today?"

### Progress Indicators
- Completion percentages for multi-step processes (wizard, canvas, profile)
- "You're ahead of X% of founders at this stage" social proof benchmarks
- Visual progress rings that animate on completion
- Milestone unlocks: completing validation unlocks lean canvas features

### Positive Reinforcement
- Celebrate the process, not just outcomes ("Your discovery quality improved" not just "Deal closed")
- Time-saved callouts: "That took 2 minutes. Without AI, founders typically spend 3 hours on this."
- Compound progress: "This week: 5 tasks done, canvas updated, 2 investor conversations tracked"

## Gamification Without Manipulation

### Ethical Guidelines
- Never create false urgency (fake countdown timers, artificial scarcity)
- Never withhold essential features behind engagement walls
- Always provide clear opt-out paths ("Skip this" / "Remind me later" / "Don't show again")
- Rewards should reflect genuine progress, not just platform engagement

### Effective Patterns
- Achievement badges tied to real milestones (first validation, first investor meeting)
- Leaderboards only against the user's own past performance, never other founders
- Variable rewards: occasionally surface unexpected insights ("I noticed your market grew 15%")
- Completion satisfaction: the feeling of checking off a well-designed checklist

## Focus Protection

### Respect Deep Work
- Honor user-specified focus hours (no notifications during blocked time)
- Batch non-urgent nudges into a single daily digest rather than interrupting throughout the day
- If a user ignores daily nudges, autonomously switch to weekly summary format
- Distinguish urgent (pipeline deal closing tomorrow) from important (update your canvas)

### Channel Adaptation
- Track which nudge channels get responses (in-app, email, push)
- If engagement drops on a channel, pause and ask preference rather than increasing volume
- Morning nudges for planning, afternoon nudges for execution, evening for reflection
- Never more than 3 nudges per day unless user-initiated

## StartupAI Trigger Map

Specific nudge triggers mapped to screens and CTAs:

| Trigger | Detection | Screen | Type | CTA | Snooze |
|---------|-----------|--------|------|-----|--------|
| Empty canvas box (any of 9 boxes blank) | `canvas_data[box] === null` | Lean Canvas | Suggestion (blue) | "Fill in [box name]" | 24h |
| Stale sprint (no task moved in 7 days) | `MAX(sprint_tasks.updated_at) < NOW() - 7d` | Sprint Board | Warning (amber) | "Review sprint tasks" | 24h |
| Low coverage score (validator < 50%) | `validation_reports.score < 50` | Dashboard | Warning (amber) | "Continue validation chat" | 24h |
| No validation run (0 reports) | `COUNT(validation_reports) = 0` | Dashboard | Progress (green) | "Validate your idea" | 24h |
| Incomplete profile (< 80% fields) | Profile completion calculation | Dashboard | Progress (green) | "Complete your profile" | 24h |

## localStorage State Management

Nudge state uses localStorage with these key patterns:

```
nudge:{triggerKey}:dismissed -> boolean (permanent until trigger condition changes)
nudge:{triggerKey}:snoozedUntil -> ISO timestamp (expires after 24h)
```

### State Check Logic

```typescript
function shouldShowNudge(triggerKey: string): boolean {
  const dismissed = localStorage.getItem(`nudge:${triggerKey}:dismissed`)
  if (dismissed === 'true') return false

  const snoozedUntil = localStorage.getItem(`nudge:${triggerKey}:snoozedUntil`)
  if (snoozedUntil && new Date(snoozedUntil) > new Date()) return false

  return true // Show the nudge
}
```

### NudgeBanner Component Contract

```typescript
interface NudgeBannerProps {
  triggerKey: string
  type: 'progress' | 'suggestion' | 'warning'
  message: string
  ctaLabel: string
  ctaPath: string
  onDismiss: () => void
  onSnooze: () => void
}
```

## Implementation Checklist
- [ ] Daily focus card shows 1 priority action with clear CTA
- [ ] Wizard progress bar with step completion animation
- [ ] Profile/canvas completion percentage with next-step suggestion
- [ ] Streak counter on dashboard (days active, tasks completed this week)
- [ ] Milestone celebration modals (first report, first deck, first investor added)
- [ ] Smart notification batching (digest mode vs. real-time for urgent only)
- [ ] "Call it for today" off-ramp after any completed session
