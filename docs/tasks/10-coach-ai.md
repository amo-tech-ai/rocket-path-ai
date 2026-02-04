# 102 - Coach AI

> Expert persona + industry knowledge + phase handlers

---

| Aspect | Details |
|--------|---------|
| **Screens** | AI Chat (coach mode) |
| **Features** | Expert persona, industry expertise, 6 phase handlers, context loading |
| **Agents** | ai-chat (extended) |
| **Edge Functions** | /ai-chat (extended with coach mode) |
| **Use Cases** | Conversational validation, assessment scoring, sprint planning |
| **Real-World** | "Coach asks about my SaaS, knows benchmarks, guides to next step" |

---

```yaml
---
task_id: 102-coach-ai
title: Coach AI
diagram_ref: startup-coach-design
phase: MVP
priority: P0
status: Not Started
skill: /edge-functions
ai_model: gemini-3-pro-preview
subagents: [code-reviewer, ai-agent-dev]
edge_function: ai-chat
schema_tables: [validation_sessions, validation_assessments, validation_campaigns, validation_sprints, validation_conversations]
depends_on: [101-coach-tables]
---
```

---

## Description

Extend the existing `ai-chat` edge function with "coach mode" - a conversational validation system that guides founders through Assessment → Constraint → Campaign → Sprint → Review phases. Includes expert persona with industry-specific knowledge, state machine logic, and full context loading from database.

## Rationale

**Problem:** Generic AI chat doesn't understand validation methodology or remember progress.
**Solution:** Coach mode with expert persona, phase-aware prompts, and persistent state.
**Impact:** Founders get $500/hr consultant-level guidance, personalized to their industry.

---

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | talk naturally to my coach | I don't need to learn frameworks |
| Founder | get industry-specific advice | guidance applies to my market |
| Founder | have coach remember my progress | I continue where I left off |
| Founder | get scored on 7 dimensions | I know my weak spots |

## Real-World Example

> Maya opens the chat. The coach says: "Welcome back! Your SaaS scores are strong
> at 78/100, but you've got zero customers. That's your bottleneck. I've seen this
> pattern - founders who focus on demand validation first succeed 3x more often.
> Ready for your 90-day acquisition sprint?"

---

## Goals

1. **Primary:** Coach mode handler routes from ai-chat
2. **Secondary:** 6 phase handlers with appropriate prompts
3. **Quality:** Context loads in < 500ms, response in < 3s

## Acceptance Criteria

- [ ] Coach mode activated via `mode: 'coach'` or existing active session
- [ ] Expert persona prompt with industry expertise injected
- [ ] Context loader fetches startup, canvas, traction, session, conversations
- [ ] Phase handlers for: onboarding, assessment, constraint, campaign, sprint, review
- [ ] State transitions trigger on phase completion
- [ ] Conversations persisted to validation_conversations
- [ ] Suggested actions returned for quick replies
- [ ] Progress indicator returned with each response
- [ ] **Retry logic with exponential backoff (1s→2s→4s)**
- [ ] **Timeout configuration (30s for AI, 5s for context loading)**
- [ ] **Fallback to Gemini Flash if Pro fails**
- [ ] **Response schema validation**

---

## File Structure

```
supabase/functions/ai-chat/
├── index.ts              # Main handler (extend)
├── coach/
│   ├── index.ts          # Coach mode handler
│   ├── persona.ts        # Expert persona + industry expertise
│   ├── state-machine.ts  # Phase transitions
│   ├── context-loader.ts # Load full project memory
│   └── phases/
│       ├── onboarding.ts
│       ├── assessment.ts
│       ├── constraint.ts
│       ├── campaign.ts
│       ├── sprint.ts
│       └── review.ts
└── types.ts
```

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Main Handler | `supabase/functions/ai-chat/index.ts` | Modify |
| Coach Handler | `supabase/functions/ai-chat/coach/index.ts` | Create |
| Persona | `supabase/functions/ai-chat/coach/persona.ts` | Create |
| State Machine | `supabase/functions/ai-chat/coach/state-machine.ts` | Create |
| Context Loader | `supabase/functions/ai-chat/coach/context-loader.ts` | Create |
| Onboarding Phase | `supabase/functions/ai-chat/coach/phases/onboarding.ts` | Create |
| Assessment Phase | `supabase/functions/ai-chat/coach/phases/assessment.ts` | Create |
| Constraint Phase | `supabase/functions/ai-chat/coach/phases/constraint.ts` | Create |
| Campaign Phase | `supabase/functions/ai-chat/coach/phases/campaign.ts` | Create |
| Sprint Phase | `supabase/functions/ai-chat/coach/phases/sprint.ts` | Create |
| Review Phase | `supabase/functions/ai-chat/coach/phases/review.ts` | Create |
| Types | `supabase/functions/ai-chat/types.ts` | Modify |

---

## API Contract

### Request

```typescript
POST /functions/v1/ai-chat
{
  "message": string,
  "startupId": string,
  "mode": "general" | "coach"  // optional, defaults based on session
}
```

### Response

```typescript
{
  "message": string,           // Coach response text
  "phase": ValidationPhase,    // Current phase
  "progress": {
    "phase": string,
    "step": number,
    "totalSteps": number,
    "percentage": number
  },
  "suggestedActions": string[],  // Quick reply text options
  "proposedActions"?: ProposedAction[],  // Actions requiring user approval (see 216-claude-sdk.md)
  "stateUpdate"?: Partial<ValidationState>  // If state changed
}

// IMPORTANT: Coach follows "AI suggests, user approves, system writes" pattern
// - Read operations (get_canvas, search_knowledge): Auto-execute
// - Write operations (create_task, update_assessment): Require approval
// - See 216-claude-sdk.md for ProposedAction interface and approval flow
```

---

## Coach Persona (Core Prompt)

```typescript
const COACH_PERSONA = `
You are a world-class startup coach and leading industry expert who
speaks like a warm, supportive mentor. You combine deep expertise
with approachable guidance.

EXPERTISE:
- You've helped hundreds of founders from zero to exit
- You're a recognized authority in {{industry}}
- You remember everything: canvas, scores, experiments, pivots, conversations

STYLE:
- Warm but direct ("Here's what I see..." not "Analysis indicates...")
- Use "we" language ("Let's figure this out together")
- Celebrate wins, normalize struggle
- One question at a time - never overwhelm
- Always end with clear next step

AUTHORITY:
- Confident ("Here's what works..." not "Maybe try...")
- Challenge weak thinking directly but kindly
- Share patterns from experience
- Give industry-specific benchmarks

NEVER: Say "As an AI...", use jargon without explaining, overwhelm with questions
ALWAYS: Reference their specific data, be the expert they'd pay $500/hour for
`;
```

---

## Industry Expertise Templates

```typescript
const INDUSTRY_EXPERTISE: Record<string, string> = {
  saas: `SaaS expert. Think in MRR, churn, CAC, LTV. Benchmarks: <5% monthly churn, 3:1 LTV:CAC.`,
  marketplace: `Marketplace expert. Think in liquidity, take rate, GMV. Know chicken-and-egg problems.`,
  fintech: `Fintech expert. Know compliance, unit economics. Regulatory moats, interchange.`,
  healthtech: `Healthtech expert. Know HIPAA, reimbursement, clinical validation.`,
  ecommerce: `Ecommerce expert. Think in AOV, repeat rate, ROAS. DTC vs marketplace.`,
  general: `Startup generalist with broad pattern recognition. Adapt frameworks to model.`
};
```

---

## Phase Handlers

### Onboarding Phase

```typescript
// Goal: Understand the founder and their business briefly
// Transition: When enough context gathered → assessment

const ONBOARDING_PROMPT = `
You are meeting a new founder. Your job:
1. Welcome them warmly
2. Ask what they're building (one sentence)
3. Ask their current stage (exploring / building / early customers)
4. Transition to assessment when ready

Keep it conversational. 2-3 exchanges max.
`;
```

### Assessment Phase

```typescript
// Goal: Score 7 dimensions through conversation
// Transition: When all 7 scored → constraint

const ASSESSMENT_PROMPT = `
You are evaluating the startup across 7 dimensions.
Progress: {{completedDimensions}} of 7 complete.
Next: {{nextDimension}}

For each dimension:
1. Explain what it means (simply)
2. Ask 2-3 questions
3. Score 0-10 based on answers
4. Explain the score and what it means for their business

Dimensions: clarity, desirability, viability, feasibility, defensibility, timing, mission
`;
```

### Constraint Phase

```typescript
// Goal: Identify the #1 bottleneck
// Transition: When constraint identified and explained → campaign_setup

const CONSTRAINT_PROMPT = `
Assessment complete. Scores: {{scores}}

Your job:
1. Analyze which constraint is blocking progress
2. Explain in simple terms WHY this is the bottleneck
3. Use their specific situation, not generic advice
4. Ask if they're ready to build a 90-day plan

Constraints: acquisition (no customers), monetization (no revenue),
retention (high churn), scalability (can't grow)
`;
```

### Campaign Phase

```typescript
// Goal: Design 90-day campaign with sprints
// Transition: When campaign accepted → sprint_planning

const CAMPAIGN_PROMPT = `
Constraint: {{constraint}}
Goal: {{goal90Day}}

Your job:
1. Recommend appropriate campaign type
2. Explain why this campaign fits their constraint
3. Present 6-sprint structure (Planning + 5 execution + Review)
4. Get confirmation before proceeding

Campaign types: mafia_offer, demo_sell_build, wizard_of_oz, channel_validation, pricing_validation
`;
```

### Sprint Phase

```typescript
// Goal: Guide through PDCA for current sprint
// Transition: Sprint complete → next sprint or cycle_review

const SPRINT_PROMPT = `
Campaign: {{campaignType}}
Current Sprint: {{currentSprint}} of 5
PDCA Step: {{pdcaStep}}

PLAN: Define experiment, success criteria, method
DO: Check in on progress, offer guidance
CHECK: Analyze results together
ACT: Decide continue/adjust/pivot

Be specific to their sprint purpose. Reference previous learnings.
`;
```

### Review Phase

```typescript
// Goal: Make Persevere/Pivot/Pause decision
// Transition: Decision made → new assessment or new campaign

const REVIEW_PROMPT = `
Cycle complete. Results: {{cycleResults}}

Your job:
1. Summarize what was learned across all sprints
2. Present the 3P decision framework
3. Guide to explicit decision with reasoning
4. Set up next cycle if continuing

Decisions:
- Persevere: Evidence supports continuing
- Pivot: Change direction based on learnings
- Pause: Not ready to continue, need more resources/time
`;
```

---

## Context Loader

```typescript
async function loadValidationContext(supabase, startupId: string) {
  const [startup, canvas, traction, session, assessments, campaign, sprint, conversations] =
    await Promise.all([
      supabase.from('startups').select('*').eq('id', startupId).single(),
      supabase.from('lean_canvases').select('*').eq('startup_id', startupId).order('created_at', { ascending: false }).limit(1).single(),
      supabase.from('traction_metrics').select('*').eq('startup_id', startupId).order('date', { ascending: false }).limit(1).single(),
      supabase.from('validation_sessions').select('*').eq('startup_id', startupId).eq('is_active', true).single(),
      supabase.from('validation_assessments').select('*').eq('session_id', session?.id).order('assessed_at', { ascending: false }),
      supabase.from('validation_campaigns').select('*').eq('session_id', session?.id).eq('status', 'active').single(),
      supabase.from('validation_sprints').select('*').eq('campaign_id', campaign?.id).order('sprint_number', { ascending: false }).limit(1).single(),
      supabase.from('validation_conversations').select('*').eq('session_id', session?.id).order('created_at', { ascending: false }).limit(10)
    ]);

  return { startup, canvas, traction, session, assessments, currentCampaign: campaign, currentSprint: sprint, recentConversations: conversations };
}
```

---

## State Machine Logic

```typescript
function canTransition(from: ValidationPhase, to: ValidationPhase): boolean {
  const transitions: Record<ValidationPhase, ValidationPhase[]> = {
    onboarding: ['assessment'],
    assessment: ['constraint'],
    constraint: ['campaign_setup'],
    campaign_setup: ['sprint_planning'],
    sprint_planning: ['sprint_execution'],
    sprint_execution: ['sprint_planning', 'cycle_review'],
    cycle_review: ['assessment', 'campaign_setup']
  };
  return transitions[from]?.includes(to) ?? false;
}

function detectTransition(phase: ValidationPhase, context: ValidationContext, response: string): ValidationPhase | null {
  // Logic to detect completion signals in AI response
  // Returns new phase or null if staying
}
```

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| No active session | Create new session, start at onboarding |
| User asks off-topic | Gently redirect to current phase |
| User wants to skip ahead | Explain why phases matter, offer brief skip |
| AI response unclear | Include fallback suggested actions |
| Context load fails | Graceful degradation with error message |

---

## Security Checklist

- [ ] JWT verified before processing
- [ ] User can only access own startup data
- [ ] No secrets exposed in prompts
- [ ] Input sanitized before DB insert
- [ ] Rate limiting applied

---

## Testing Requirements

| Type | Coverage |
|------|----------|
| Unit | Phase handlers, state transitions |
| Integration | Context loading, DB persistence |
| E2E | Full conversation flow through phases |

### Test Cases

- [ ] New user starts at onboarding
- [ ] Assessment scores all 7 dimensions
- [ ] Constraint correctly identified
- [ ] Campaign structure generated
- [ ] Sprint PDCA tracked
- [ ] Review decision persisted
- [ ] Conversations saved and loaded

---

## Verification

```bash
# Deploy function
supabase functions deploy ai-chat

# Test coach mode
curl -X POST https://[project].supabase.co/functions/v1/ai-chat \
  -H "Authorization: Bearer [token]" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "startupId": "[id]", "mode": "coach"}'

# Check logs
supabase functions logs ai-chat
```

---

## Codebase References

| Pattern | Reference |
|---------|-----------|
| Edge function structure | `supabase/functions/lean-canvas-agent/` |
| AI call patterns | `supabase/functions/_shared/ai-client.ts` |
| Gemini integration | `supabase/functions/lean-canvas-agent/ai-utils.ts` |

---

## AI Model

| Action | Model | Reason |
|--------|-------|--------|
| Coach responses | gemini-3-pro-preview | Deep reasoning, context handling |
| Quick extractions | gemini-3-flash-preview | Fast, simple parsing |

---

## Design Document

See: `/tasks/plan/2026-02-04-startup-coach-design.md`
