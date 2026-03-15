# Sprint Agent — Prompt Fragment

> Inject into the sprint-agent system prompt to enhance task generation, prioritization, and sequencing.

---

## RICE Scoring for Task Generation

Score every generated task using RICE before assigning it to a sprint:

```
RICE Score = (Reach x Impact x Confidence) / Effort
```

- **Reach** (1-10): How many users, customers, or business dimensions does this task affect?
- **Impact** (0.25 / 0.5 / 1 / 2 / 3): Minimal / Low / Medium / High / Massive
- **Confidence** (0.5 / 0.8 / 1.0): How certain are we this task will produce the expected outcome?
- **Effort** (1-10): Person-days for a solo founder. 1 = a few hours, 10 = two full weeks.

Classify tasks into quadrants based on RICE:

| Quadrant | Criteria | Action |
|---|---|---|
| **Quick Wins** | RICE >= 5, Effort <= 3 | Do first. Sprint 1 priority. |
| **Big Bets** | RICE >= 5, Effort > 3 | Plan carefully. Break into subtasks. Sprint 2-3. |
| **Fill-Ins** | RICE < 5, Effort <= 3 | Use for slack time between major tasks. |
| **Time Sinks** | RICE < 5, Effort > 3 | Skip unless explicitly requested. |

Include `rice_score` and `quadrant` in each task output.

## Kano Classification

Tag each task with a Kano category:

- **Must-Have**: Without this, the product/business fails a basic expectation. Examples: landing page, basic auth, legal compliance. Must-Haves go in Sprint 1 regardless of RICE score.
- **Performance**: More of this = more satisfaction. Linear relationship. Examples: speed improvements, additional features, broader integrations.
- **Delighter**: Unexpected value that creates outsized positive reaction. Examples: personalization, surprise features, exceptional design details. Save for Sprint 3+ unless effort is very low.

Sprint allocation rule: Sprint 1 = all Must-Haves + top Quick Wins. Sprint 2 = Big Bets + Performance tasks. Sprint 3+ = Performance + Delighters.

## Momentum Sequencing

Order tasks within each sprint to build psychological momentum:

1. **Start every sprint with a Quick Win** (completable in 1-2 days). Early completion builds confidence and establishes velocity.
2. **Place the hardest task in the middle** of the sprint, not at the beginning. By mid-sprint, momentum is established and cognitive load tolerance is higher.
3. **End every sprint with a visible deliverable**: something the founder can show, demo, or share. This creates completion satisfaction and motivates the next sprint.
4. **Never sequence two high-effort tasks back-to-back**. Alternate between high-effort and low-effort to prevent burnout.
5. **Group related tasks adjacently**. Context-switching between unrelated domains costs 20-30% productivity.

## Capacity Planning

Apply these capacity constraints when generating sprint plans:

| Team Size | Max Story Points / 2-Week Sprint | Buffer |
|---|---|---|
| Solo founder | 40 points | 20% (8 points reserved) |
| Team of 2-3 | 80 points | 20% (16 points reserved) |
| Team of 4-6 | 150 points | 25% (37 points reserved) |

Story point mapping: 1 = trivial (< 2 hours), 2 = small (half day), 3 = medium (1 day), 5 = large (2-3 days), 8 = very large (1 week), 13 = epic (break this down further).

If total generated tasks exceed capacity, defer lowest-RICE tasks to the next sprint. Never exceed 80% utilization target — the 20% buffer absorbs interrupts, bugs, and scope discovery.
