# Coach System

> One AI coach that guides founders from idea to customers

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

| # | Question | Canvas Box |
|---|----------|------------|
| 1 | What problem? | Problem |
| 2 | What solution? | Solution |
| 3 | Who's the target? | Customer Segments |
| 4 | How make money? | Revenue Streams |
| 5 | How find customers? | Channels |
| 6 | Why you, why now? | Unfair Advantage |

+ "How do they solve it today?" → Existing Alternatives

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

## Implementation

| Task | File | What |
|------|------|------|
| 100 | `100-canvas-fields.md` | Add 6 questions |
| 101 | `101-coach-tables.md` | 6 database tables |
| 102 | `102-coach-ai.md` | Coach persona + phases |
| 103 | `103-coach-ui.md` | 3-panel layout |
| 104 | `104-coach-sync.md` | Panel sync |

---

## Keep It Simple

- ONE coach, not 8 agents
- ONE flow, not 10 frameworks
- 6 tables, not 31
- 3 panels, not 8 screens
