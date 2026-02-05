# Coach System

> One AI coach that guides founders from idea to customers

**What is this?** The Coach is your AI startup mentor that asks 6 smart questions to understand your idea, then generates a Lean Canvas and Validation Report. It guides you through 90-day sprints with clear goals like "get 10 paying customers." The Coach remembers everything—your problem, your customers, your experiments—so you never have to explain context twice. It uses clickable suggestion chips to help you give better answers ("What's the cost?" "How often?") and knows industry benchmarks so it can say "your 5% churn is better than the 7% SaaS median."

---

## What It Does

```
User → Coach → Canvas + Report → 90-Day Plan → Sprints → Customers
```

---

## Two Entry Points

| Path | Experience |
|------|------------|
| **Wizard** | Form-based onboarding (Steps 1-4) |
| **Chat** | Conversational ("Tell me about your startup") |

Both capture same 6 questions → same output.

---

## 6 Questions

| # | Main Question | Canvas Box |
|---|---------------|------------|
| 1 | What pain or problem are you solving? | Problem |
| 2 | How does your product solve this? | Solution |
| 3 | Who is your ideal first customer? | Customer Segments |
| 4 | Why would they pay for this? | Value & Revenue |
| 5 | How will you reach them? | Channels |
| 6 | Why you, why now? | Unfair Advantage |

+ "How do they solve this today?" → Existing Alternatives

### Suggested Follow-ups (Bottom of Chat)

After each main question, show clickable suggestion chips at the bottom of the chat window:

```
┌─────────────────────────────────────────────────────────────┐
│ Coach: What pain or problem are you solving?                │
├─────────────────────────────────────────────────────────────┤
│ [What's the cost?] [How often?] [How urgent?] [Who feels it most?] │
└─────────────────────────────────────────────────────────────┘
```

| Question | Suggestion Chips |
|----------|------------------|
| 1. Problem | `What's the cost?` `How often?` `How urgent?` `Who feels it most?` |
| 2. Solution | `Core feature?` `10x better how?` `How is it different?` |
| 3. Customer | `Job title?` `Company size?` `Industry?` `Budget?` `Location?` |
| 4. Value | `Time saved?` `Money earned?` `Risk reduced?` `Pain removed?` `Status gained?` |
| 5. Channels | `LinkedIn` `Cold email` `Communities` `Referrals` `Ads` `Events` `Content` `Partnerships` |
| 6. Advantage | `Domain expertise?` `Network?` `Technology?` `Timing?` `First-mover?` |

**How it works:** User can click a chip to add it to their response, or type freely. Chips help founders who get stuck or don't know what details to include.

**Good answers are specific:** Not "small businesses" but "restaurant owners with 2-5 locations doing $1-5M revenue who lose $2K/month to inventory waste."

---

## Coach Persona

**Expert + Mentor**

- Industry authority (knows SaaS, fintech, etc.)
- Warm and direct ("Here's what I see...")
- One question at a time
- Remembers everything

---

## Flow

```
1. CAPTURE (6 questions)
      ↓
2. GENERATE
   - Lean Canvas (9 boxes)
   - Validation Report (7 scores)
      ↓
3. IDENTIFY CONSTRAINT
   - Acquisition / Monetization / Retention / Scale
      ↓
4. 90-DAY CAMPAIGN
   - Sprint 0: Planning
   - Sprint 1-5: Execution (PDCA)
   - Review: Persevere/Pivot/Pause
      ↓
5. REPEAT
```

---

## 7 Validation Dimensions

| Dimension | Question |
|-----------|----------|
| Clarity | Is it easy to understand? |
| Desirability | Do people want it? |
| Viability | Can it make money? |
| Feasibility | Can you build it? |
| Defensibility | Can others copy it? |
| Timing | Is now the right time? |
| Mission | Why you? |

---

## State Machine

```
onboarding → assessment → constraint → campaign → sprint → review
     ↑                                                    |
     └────────────────── (next cycle) ←───────────────────┘
```

---

## UI: 3-Panel Layout

```
┌──────┬─────────────────────────┬─────────────────────┐
│ NAV  │ VALIDATOR (scores)      │ COACH (chat)        │
│      │ - Verdict               │ - Progress bar      │
│      │ - Strengths/Concerns    │ - Messages          │
│      │ - Evidence blocks       │ - Quick actions     │
│      │ - Sprint progress       │ - Input             │
└──────┴─────────────────────────┴─────────────────────┘
```

---

## Implementation Tasks

| Task | File | What | Status |
|------|------|------|--------|
| 100 | [`100-canvas-fields.md`](../prompts/100-canvas-fields.md) | 6 questions + suggestion chips | Ready |
| 101 | [`101-coach-tables.md`](../prompts/101-coach-tables.md) | 6 database tables | Ready |
| 102 | [`102-coach-ai.md`](../prompts/102-coach-ai.md) | Coach persona + phases | Ready |
| 103 | [`103-coach-ui.md`](../prompts/103-coach-ui.md) | 3-panel layout | Ready |
| 104 | [`104-coach-sync.md`](../prompts/104-coach-sync.md) | Panel sync + realtime | Ready |

---

## Keep It Simple

- ONE coach, not 8 agents
- ONE flow, not 10 frameworks
- 6 tables, not 31
- 3 panels, not 8 screens

---

## Related Documents

| Document | Path |
|----------|------|
| Coach Design | `tasks/plan/2026-02-04-startup-coach-design.md` |
| Data Strategy | `tasks/plan/09-data.md` |
| Edge Functions | `tasks/plan/10-edge-functions.md` |
| Frontend-Backend | `tasks/plan/12-frontend-backend.md` |
| Task Template | `tasks/TASK-TEMPLATE.md` |
