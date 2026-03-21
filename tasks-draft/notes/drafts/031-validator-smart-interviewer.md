---
task_id: 031-INT
title: Validator Smart Interviewer
diagram_ref: D-03
phase: ENHANCE
priority: P1
status: Not Started
skill: /gemini
ai_model: gemini-3-flash-preview
subagents: [code-reviewer, frontend-designer]
edge_function: validator-followup
schema_tables: [validator_sessions]
depends_on: []
---

| Aspect | Details |
|--------|---------|
| **Screens** | ValidateIdea (chat panel, context panel, extraction panel) |
| **Features** | Expert interviewing, depth tracking, extracted field preview |
| **Agents** | validator-followup |
| **Edge Functions** | /validator-followup |
| **Use Cases** | Founder describes idea, AI probes for specifics |
| **Real-World** | "Founder says 'consumers' → AI asks 'What size businesses? A 5-person agency has different needs than a 500-person enterprise.'" |

## Description

> Upgrade the follow-up agent from a generic topic-coverage checker to an expert startup interviewer that thinks like a YC partner. Replace boolean coverage with depth levels (none/shallow/deep). Add an `extracted` object so founders see what the AI understood before generating.

## Rationale

**Problem:** Current follow-up agent asks generic questions ("Who is your target customer?") and marks boolean coverage. A founder saying "consumers" counts as customer=true. This produces shallow input that weakens every downstream pipeline agent.

**Solution:** New system prompt with Lean Startup interview framework, probing/quantifying/challenging techniques, depth-based coverage, and extracted field output.

**Impact:** Pipeline receives 3-5x richer input. Report quality improves without changing any pipeline agent code.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | get probing follow-up questions | I think more deeply about my idea |
| Founder | see what the AI extracted from my answers | I can correct misunderstandings before generating |
| Founder | know which answers need more detail | I can provide better input for the report |

## Real-World Example

> Alex types "An AI travel planner for digital nomads." The AI responds: "Interesting — are these nomads booking $50/night hostels in Bali, or $500/night apartments in Lisbon? The price range completely changes the business model and competition." Alex provides specifics. The extraction panel shows: Customer: "Digital nomads, 25-40, $2-5K/mo travel budget, currently using Google Sheets + Reddit."

## Goals

1. **Primary:** Follow-up agent asks expert-level questions that extract specific, actionable details
2. **Secondary:** Coverage tracks depth (none/shallow/deep) instead of boolean
3. **Quality:** Extracted fields visible to user before Generate; readiness requires 2+ deep topics

## Acceptance Criteria

- [ ] System prompt uses Lean Startup interview framework with probing/quantifying/challenging techniques
- [ ] Coverage tracks depth: `"none" | "shallow" | "deep"` per topic
- [ ] New `extracted` object captures what AI understood per field
- [ ] ExtractionPanel shows extracted text with depth color coding (gray/amber/green)
- [ ] Readiness requires 3+ messages AND 2+ topics at "deep" level
- [ ] Anti-repetition still works (no re-asking answered topics)
- [ ] Fallback questions updated for new 8 topics (business_model replaces research)
- [ ] Build passes, E2E chat flow works

## Wiring Plan

### API Flow
```
User message → ValidatorChat → useValidatorFollowup → validator-followup EF → Gemini Flash → { coverage (depth), extracted, question } → UI panels
```

### Files

| Layer | File | Action |
|-------|------|--------|
| Prompt | `supabase/functions/validator-followup/prompt.ts` | Rewrite — expert interviewer persona |
| Schema | `supabase/functions/validator-followup/schema.ts` | Modify — depth enum + extracted object |
| Edge Function | `supabase/functions/validator-followup/index.ts` | Modify — handle new response shape |
| Hook | `src/hooks/useValidatorFollowup.ts` | Modify — updated types |
| Component | `src/components/validator/chat/ValidatorChat.tsx` | Modify — new readiness logic, fallback questions |
| Component | `src/components/validator/chat/ExtractionPanel.tsx` | Modify — show extracted fields with depth |
| Component | `src/components/validator/chat/ContextPanel.tsx` | Modify — depth indicators |

## New System Prompt

```
You are a seasoned startup advisor who has reviewed 500+ pitch decks and mentored founders through YC, Techstars, and 500 Global. You think like an investor but talk like a helpful friend.

Your job: interview the founder to understand their startup deeply enough to generate a rigorous validation report. You need SPECIFICS, not generalities.

## Interview Strategy (Lean Startup Framework)

Explore topics in this priority order:
1. **problem** — Who has this problem? How painful? What do they do today? Quantify the cost.
2. **customer** — Job title, company size, industry, budget authority. Not "businesses" but "production managers at indie fashion labels with 10-50 employees."
3. **competitors** — What exists today? Why isn't it good enough? What's the switching cost?
4. **business_model** — How will you make money? Who pays? What's the price point?
5. **demand** — Evidence people want this: conversations, waitlists, LOIs, usage data.
6. **uniqueness** — Unfair advantage competitors can't easily copy (expertise, data, network, IP).
7. **innovation** — What's novel about the approach? Why now?
8. **websites** — URLs to research (founder's site, competitors, market reports).

## Interviewing Techniques

### Probing (dig deeper on vague answers)
- "businesses" → "What size businesses? A 5-person agency has completely different needs than a 500-person enterprise."
- "it's better" → "Better how exactly? Faster? Cheaper? More accurate? Give me a specific example."

### Quantifying (turn vague into concrete)
- "How many potential customers have you talked to? What was the most surprising thing they said?"
- "If you charged $X/month starting tomorrow, would anyone pay? Who specifically?"
- "How much time/money does the current workaround cost them per week?"

### Challenging (test assumptions respectfully)
- "You said no competitors — what do people do TODAY to solve this? Even a spreadsheet counts."
- "If [big company] launched this tomorrow with 10x your budget, what keeps users with you?"
- "What's the one assumption that, if wrong, kills the entire idea?"

## Coverage Depth Levels

Track each topic at THREE levels:
- **none** — Zero information provided
- **shallow** — Mentioned but vague ("consumers", "it's AI-powered", "no competitors")
- **deep** — Specific and actionable ("production managers at indie fashion labels, 10-50 employees")

## Question Rules
- ONE question at a time. 1-2 sentences.
- ALWAYS reference the founder's own words — make it conversational, not a checklist.
- Never re-ask a topic the founder just answered. Move to the next uncovered topic.
- If asking about websites: "Got any links? Competitor sites, your landing page — helps me find real market data."

## Readiness Criteria
- 3+ user messages AND 5+ topics at shallow+, AND 2+ topics at deep → ready
- 4+ user messages AND 4+ topics at deep → ready
- 8+ user messages → always ready
```

## Updated Schema

```typescript
export interface FollowupResponse {
  action: "ask" | "ready";
  question: string;
  summary: string;
  coverage: {
    problem: "none" | "shallow" | "deep";
    customer: "none" | "shallow" | "deep";
    competitors: "none" | "shallow" | "deep";
    business_model: "none" | "shallow" | "deep";
    demand: "none" | "shallow" | "deep";
    uniqueness: "none" | "shallow" | "deep";
    innovation: "none" | "shallow" | "deep";
    websites: "none" | "shallow" | "deep";
  };
  extracted: {
    problem: string;
    customer: string;
    competitors: string;
    business_model: string;
    demand: string;
    uniqueness: string;
    innovation: string;
    websites: string;
  };
  questionNumber: number;
  reasoning: string;
}
```

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Founder gives one-word answers | AI asks deepening question, doesn't mark as "deep" |
| Founder says "I don't know" | Mark as "shallow", suggest how to find out, move to next topic |
| Founder asks AI a question | Answer briefly, then redirect to next interview topic |
| All topics shallow, none deep | Don't trigger ready — keep probing for depth |
| AI fails (timeout/parse error) | Fallback questions adapted for new 8 topics |

## Security Checklist

- [ ] JWT verified in edge function (already done)
- [ ] Input sanitized (max 20 messages, 2000 chars each — already done)
- [ ] No secrets in client code

## Production Ready Checklist

- [ ] `npm run build` passes
- [ ] `npm run test` passes
- [ ] No `console.log` left in production code
- [ ] Loading, error, empty states handled
- [ ] Works on desktop and mobile
- [ ] Edge function deployed and responds 200

## Regression Checklist

- [ ] Validator: Chat → follow-up → Generate still works E2E
- [ ] Coverage panel updates in real time
- [ ] Fallback questions fire when AI fails
- [ ] Generate button enables at correct readiness threshold
