# Startup Coach - Design Document

> **Created:** 2026-02-04
> **Status:** Ready for Implementation
> **Inspired by:** LeanSpark.ai validation system

---

## Overview

**Startup Coach** is a conversational AI validation system that guides non-technical founders through systematic business validation in 90 days.

### Core Concept

```
Assessment → Constraint → Campaign → Sprints (PDCA) → Review
    ↑                                                   |
    └──────────────── (next 90-day cycle) ←────────────┘
```

### Key Principles

1. **Always know where user is** - State machine tracks phase, sprint, PDCA step
2. **Never overwhelm** - One question at a time, multiple choice when possible
3. **Context-aware** - Loads canvas, traction, history automatically
4. **Decision-forcing** - Guides to explicit Persevere/Pivot/Pause decisions
5. **Expert + Warm** - Authority of a $500/hr consultant, warmth of a mentor

---

## Target User

**Non-technical first-time founders** who:
- Don't know lean methodology
- Need heavy guidance and explanation
- Want a mentor-like experience, not forms to fill
- Need someone to tell them what to do next

---

## Coach Persona

### Expert & Mentor Combined

```typescript
const COACH_PERSONA = `
You are a world-class startup coach and leading industry expert who
speaks like a warm, supportive mentor. You combine deep expertise
with approachable guidance.

EXPERTISE (what you know):
- You've helped hundreds of founders from zero to exit
- You're a recognized authority in {{industry}} - you know the players,
  benchmarks, patterns, and pitfalls
- You see what others miss and connect dots across the founder's journey
- You remember everything: canvas, scores, experiments, pivots, conversations

STYLE (how you communicate):
- Warm but direct ("Here's what I see..." not "Analysis indicates...")
- Use "we" language ("Let's figure this out together")
- Celebrate wins ("Nice! That puts you ahead of most {{industry}} startups")
- Normalize struggle ("This is the hard part - most founders get stuck here")
- One question at a time - never overwhelm
- Always end with a clear next step
- Reference past context naturally ("Last time you mentioned..." / "Your canvas says...")

AUTHORITY (how you guide):
- Confident expert ("Here's what works in {{industry}}..." not "Maybe try...")
- Challenge weak thinking directly but kindly ("That assumption is risky - here's why...")
- Share patterns ("I've seen this before. Founders who do X tend to...")
- Give industry-specific benchmarks ("For SaaS, you want churn under 5%...")

NEVER:
- Say "As an AI..." or "I don't have feelings..."
- Use jargon without explaining it
- Overwhelm with multiple questions
- Give generic advice when you know their specific situation

ALWAYS:
- Speak as a coach who genuinely wants this founder to succeed
- Make complex concepts feel approachable
- Reference their specific data, not hypotheticals
- Be THE expert they'd pay $500/hour for - and they're getting you for free
`;
```

### Industry-Specific Expertise

```typescript
const INDUSTRY_EXPERTISE: Record<string, string> = {
  saas: `
    You're a SaaS expert. You think in MRR, churn, CAC, LTV, NRR.
    You know the benchmarks: <5% monthly churn, 3:1 LTV:CAC, etc.
    Reference: Salesforce, HubSpot, Slack patterns. PLG vs sales-led.
  `,

  marketplace: `
    You're a marketplace expert. You think in liquidity, take rate, GMV.
    You know chicken-and-egg problems, supply vs demand constraints.
    Reference: Airbnb, Uber, DoorDash patterns. How to bootstrap both sides.
  `,

  fintech: `
    You're a fintech expert. You know compliance, unit economics, trust.
    You understand regulatory moats, interchange, embedded finance.
    Reference: Stripe, Plaid, Chime patterns. When to partner vs build.
  `,

  healthtech: `
    You're a healthtech expert. You know HIPAA, reimbursement, clinical validation.
    You understand B2B2C, payer dynamics, provider workflows.
    Reference: Oscar, Livongo, Ro patterns. Regulatory as moat.
  `,

  ecommerce: `
    You're an ecommerce expert. You think in AOV, repeat rate, ROAS.
    You know DTC vs marketplace, subscription models, fulfillment.
    Reference: Warby Parker, Dollar Shave Club, Glossier patterns.
  `,

  general: `
    You're a startup generalist with broad pattern recognition.
    You adapt frameworks to the specific business model.
    You know when standard playbooks apply and when they don't.
  `
};
```

---

## State Machine

### Validation Phases

```
┌─────────────────────────────────────────────────────────────────┐
│                        VALIDATION STATES                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ONBOARDING ──► ASSESSMENT ──► CONSTRAINT ──► CAMPAIGN_SETUP   │
│       │              │              │               │           │
│       ▼              ▼              ▼               ▼           │
│  (new user)    (7 dimensions)  (find #1 blocker)  (90-day goal) │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CAMPAIGN_SETUP ──► SPRINT_PLANNING ──► SPRINT_EXECUTION        │
│                            │                   │                │
│                            ▼                   ▼                │
│                     (PDCA: Plan)    (PDCA: Do/Check/Act)        │
│                                                                 │
│  SPRINT_EXECUTION ──► CYCLE_REVIEW ──► (back to ASSESSMENT)     │
│                            │                                    │
│                            ▼                                    │
│                   (Persevere/Pivot/Pause)                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### State Object

```typescript
interface ValidationState {
  phase: 'onboarding' | 'assessment' | 'constraint' |
         'campaign_setup' | 'sprint_planning' | 'sprint_execution' | 'cycle_review';

  // Assessment progress
  assessmentScores?: Record<Dimension, number>;  // 7 dimensions
  assessmentProgress?: number;  // 0-7 dimensions completed

  // Campaign context
  constraint?: 'acquisition' | 'monetization' | 'retention' | 'scalability';
  campaignType?: string;  // 'mafia_offer', 'demo_sell_build', etc.
  goal90Day?: string;     // "0 → 20 paying customers"

  // Sprint tracking
  currentSprint?: number;  // 0-5
  pdcaStep?: 'plan' | 'do' | 'check' | 'act';

  // History
  sprintResults?: SprintResult[];
  cycleDecisions?: CycleDecision[];
}

type Dimension = 'clarity' | 'desirability' | 'viability' | 'feasibility' |
                 'defensibility' | 'timing' | 'mission';
```

### State Transitions

```typescript
const STATE_TRANSITIONS: Record<Phase, Phase[]> = {
  onboarding: ['assessment'],
  assessment: ['constraint'],
  constraint: ['campaign_setup'],
  campaign_setup: ['sprint_planning'],
  sprint_planning: ['sprint_execution'],
  sprint_execution: ['sprint_planning', 'cycle_review'],
  cycle_review: ['assessment', 'campaign_setup']
};
```

---

## Database Schema

### Core Tables

```sql
-- Main validation session (one active per startup)
CREATE TABLE validation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
  state JSONB NOT NULL DEFAULT '{"phase": "onboarding"}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(startup_id, is_active) WHERE is_active = true
);

-- Assessment history (scores over time)
CREATE TABLE validation_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES validation_sessions(id) ON DELETE CASCADE,
  dimension TEXT NOT NULL,
  score INTEGER CHECK (score >= 0 AND score <= 10),
  feedback TEXT,
  assessed_at TIMESTAMPTZ DEFAULT now()
);

-- 90-day campaigns
CREATE TABLE validation_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES validation_sessions(id) ON DELETE CASCADE,
  constraint_type TEXT NOT NULL,
  campaign_type TEXT NOT NULL,
  goal TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active'
);

-- Sprint tracking
CREATE TABLE validation_sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES validation_campaigns(id) ON DELETE CASCADE,
  sprint_number INTEGER NOT NULL,
  purpose TEXT,
  pdca_step TEXT DEFAULT 'plan',
  outcomes JSONB,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Experiments within sprints
CREATE TABLE validation_experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id UUID REFERENCES validation_sprints(id) ON DELETE CASCADE,
  hypothesis TEXT NOT NULL,
  method TEXT,
  success_criteria TEXT,
  result TEXT,
  learning TEXT,
  status TEXT DEFAULT 'planned'
);

-- Conversation history
CREATE TABLE validation_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES validation_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  phase TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_validation_sessions_startup ON validation_sessions(startup_id);
CREATE INDEX idx_validation_conversations_session ON validation_conversations(session_id);
CREATE INDEX idx_validation_sprints_campaign ON validation_sprints(campaign_id);
```

### RLS Policies

```sql
-- Users can only access their own startup's validation data
ALTER TABLE validation_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own startup sessions"
  ON validation_sessions FOR SELECT
  USING (startup_id IN (
    SELECT id FROM startups WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own startup sessions"
  ON validation_sessions FOR ALL
  USING (startup_id IN (
    SELECT id FROM startups WHERE user_id = auth.uid()
  ));

-- Similar policies for other tables...
```

---

## Backend Architecture

### File Structure

```
supabase/functions/
├── ai-chat/
│   ├── index.ts              # Main handler (extend)
│   ├── coach/
│   │   ├── index.ts          # Coach mode handler
│   │   ├── persona.ts        # Persona + industry expertise
│   │   ├── state-machine.ts  # Phase transitions
│   │   ├── context-loader.ts # Load full project memory
│   │   └── phases/
│   │       ├── onboarding.ts
│   │       ├── assessment.ts
│   │       ├── constraint.ts
│   │       ├── campaign.ts
│   │       ├── sprint.ts
│   │       └── review.ts
│   └── types.ts
```

### Main Handler Extension

```typescript
// ai-chat/index.ts
import { handleCoachMode } from "./coach/index.ts";

Deno.serve(async (req) => {
  const { message, startupId, mode } = await req.json();

  // Route to coach mode if enabled
  if (mode === 'coach' || await hasActiveCoachSession(startupId)) {
    return handleCoachMode(req, message, startupId);
  }

  // Existing ai-chat logic
  return handleGeneralChat(req, message, startupId);
});
```

### Coach Mode Handler

```typescript
// ai-chat/coach/index.ts
export async function handleCoachMode(
  req: Request,
  message: string,
  startupId: string
): Promise<Response> {

  // 1. Load full context
  const context = await loadValidationContext(startupId);

  // 2. Get or create session
  const session = await getOrCreateSession(startupId);

  // 3. Build phase-specific prompt
  const systemPrompt = buildCoachPrompt(context, session);
  const phasePrompt = getPhasePrompt(session.state.phase, context);

  // 4. Call AI with full context
  const response = await callGemini("gemini-3-pro-preview",
    systemPrompt + phasePrompt,
    formatConversationHistory(session, message),
    { jsonMode: false, maxTokens: 1500 }
  );

  // 5. Parse response for state updates
  const { reply, stateUpdate, suggestedActions } = parseCoachResponse(response);

  // 6. Update state if phase transition
  if (stateUpdate) {
    await updateSessionState(session.id, stateUpdate);
  }

  // 7. Save conversation
  await saveConversation(session.id, message, reply, session.state.phase);

  // 8. Return response
  return new Response(JSON.stringify({
    message: reply,
    phase: stateUpdate?.phase || session.state.phase,
    progress: calculateProgress(session.state),
    suggestedActions
  }));
}
```

### Context Loader

```typescript
// ai-chat/coach/context-loader.ts
export async function loadValidationContext(startupId: string) {
  const [startup, canvas, traction, session, assessments, campaign, sprint, conversations] =
    await Promise.all([
      getStartup(startupId),
      getCanvas(startupId),
      getTraction(startupId),
      getActiveSession(startupId),
      getAssessmentHistory(startupId),
      getActiveCampaign(startupId),
      getCurrentSprint(startupId),
      getRecentConversations(startupId, 10)
    ]);

  return {
    startup,
    canvas,
    traction,
    session,
    assessments,
    currentCampaign: campaign,
    currentSprint: sprint,
    recentConversations: conversations
  };
}
```

---

## Frontend Architecture

### 3-Panel Layout

```
┌──────┬──────────────────────────────────────────────────┬──────────────────────────────────┐
│      │ VALIDATION DASHBOARD                       [⋮]  │ 🧑‍💼 YOUR COACH          [−][×] │
│      ├──────────────────────────────────────────────────┼──────────────────────────────────┤
│ 🏠   │                                                  │                                  │
│      │ ┌──────────────────────────────────────────────┐ │ ┌────────────────────────────┐  │
│ 📊   │ │ VERDICT                              78/100  │ │ │ Assessment ━━● Constraint  │  │
│      │ │ Promising - needs customer validation        │ │ │ ○ Campaign ○ Sprint        │  │
│ 📋   │ └──────────────────────────────────────────────┘ │ └────────────────────────────┘  │
│      │                                                  │                                  │
│ 💬   │ ┌─────────────┬─────────────┬─────────────────┐ │ Your SaaS scores look solid.   │
│      │ │ Strengths   │ Concerns    │ Next Steps      │ │ But zero customers at $99 is   │
│ ⚙️   │ │ • Problem   │ • No users  │ 1. Interview 5  │ │ your bottleneck.               │
│      │ │   clarity   │ • Unproven  │ 2. Test pricing │ │                                  │
│      │ │ • Timing    │   demand    │ 3. Build demo   │ │ Ready for your 90-day sprint?  │
│      │ └─────────────┴─────────────┴─────────────────┘ │                                  │
│      │                                                  │ ┌────────────────────────────┐  │
│      │ ┌──────────────────────────────────────────────┐ │ │[Yes, let's plan]           │  │
│      │ │ EVIDENCE BLOCKS                    [Expand]  │ │ │[Show details first]        │  │
│      │ │ ┌────────┐┌────────┐┌────────┐┌────────┐    │ │ │[I have questions]          │  │
│      │ │ │Market  ││Problem ││Solution││Business│    │ │ └────────────────────────────┘  │
│      │ │ │ 8/10   ││ 9/10   ││ 7/10   ││ 7/10   │    │ │                                  │
│      │ │ └────────┘└────────┘└────────┘└────────┘    │ │ ┌────────────────────────────┐  │
│      │ └──────────────────────────────────────────────┘ │ │ 💬 Type message...    [→] │  │
│      │                                                  │ └────────────────────────────┘  │
│      │ ┌──────────────────────────────────────────────┐ │                                  │
│      │ │ 90-DAY SPRINT PROGRESS          Sprint 1/5  │ │                                  │
│      │ │ ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░  12%   │ │                                  │
│      │ │ Current: Customer Discovery                  │ │                                  │
│      │ └──────────────────────────────────────────────┘ │                                  │
└──────┴──────────────────────────────────────────────────┴──────────────────────────────────┘
```

### Component Structure

```
src/
├── pages/
│   └── Validator.tsx            # Refactor to 3-panel layout
├── components/
│   ├── validator/
│   │   ├── ValidatorLayout.tsx  # 3-panel container
│   │   ├── VerdictCard.tsx
│   │   ├── TradeoffsCard.tsx
│   │   ├── EvidenceBlocks.tsx
│   │   └── SprintProgress.tsx
│   └── coach/
│       ├── CoachPanel.tsx       # Right panel container
│       ├── CoachMessage.tsx     # Styled message bubble
│       ├── CoachProgress.tsx    # Phase progress bar
│       ├── QuickActions.tsx     # Suggested response buttons
│       └── ContextSync.tsx      # Main ↔ Coach synchronization
└── hooks/
    ├── useCoachSession.ts       # Session state + API
    └── useValidatorSync.ts      # Cross-panel sync
```

### Synchronized Interaction

```typescript
// When coach suggests action, main panel highlights it
COACH: "Let's look at your Problem score"
→ Main panel auto-scrolls to Problem block, highlights it

// When user clicks element in main, coach explains
USER: [Clicks "Concerns: No users"]
→ Coach: "Right - this is why acquisition is your constraint..."

// When coach completes assessment, main panel updates live
COACH: "Your Clarity score is 8/10"
→ Clarity block animates from ? to 8/10
```

### Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| Desktop (>1200px) | 3-panel side-by-side |
| Tablet (768-1200px) | 2-panel, coach as slide-over drawer |
| Mobile (<768px) | Single panel, toggle between Validator/Coach |

---

## Implementation Phases

### Phase 1: Database + State Machine
**Scope:** Foundation
- [ ] Create 6 database tables with RLS
- [ ] Implement state machine types
- [ ] Create migration file

### Phase 2: Coach Backend
**Scope:** AI logic
- [ ] Extend ai-chat with coach mode routing
- [ ] Implement persona + industry expertise
- [ ] Build context loader
- [ ] Create 6 phase handlers (onboarding → review)
- [ ] Add conversation persistence

### Phase 3: 3-Panel UI
**Scope:** Frontend structure
- [ ] Refactor Validator.tsx to 3-panel layout
- [ ] Build CoachPanel component
- [ ] Implement CoachMessage + QuickActions
- [ ] Add CoachProgress bar
- [ ] Connect to backend API

### Phase 4: Sync + Polish
**Scope:** Integration
- [ ] Implement Main ↔ Coach synchronization
- [ ] Add click-to-explain from main panel
- [ ] Live score updates during assessment
- [ ] Responsive breakpoints
- [ ] Loading states + error handling

---

## Example Conversations

### First Meeting (Onboarding)

```
COACH: "Hey! I'm your startup coach. I'll be with you through
        the whole journey - from validating your idea to landing
        your first paying customers.

        So tell me - what are you building? Just a sentence or
        two is perfect."

USER:  "I'm building an app that helps busy parents find
        last-minute babysitters"

COACH: "Got it - solving the 'I need a sitter NOW' problem for
        busy parents. Before we dive in, are you:

        A) Just exploring the idea
        B) Building but no customers yet
        C) Have some early customers"

        [A] [B] [C]
```

### Assessment Phase

```
COACH: "Alright, let's see how solid your foundation is. I'm going
        to ask you about 7 areas - don't worry, I'll explain each
        one as we go.

        First up: Clarity. Can you explain your startup to me like
        I'm a stranger at a coffee shop? What problem do you solve,
        and for whom?"
```

### Finding Constraint

```
COACH: "Okay, I've got the picture now. Here's what stands out:

        Your scores look strong overall - 78/100. But you've got
        zero customers. That's your bottleneck right now.

        Everything else - the product ideas, the business model -
        none of it matters until we solve acquisition.

        I've seen this pattern hundreds of times. Founders who
        focus on demand validation first succeed 3x more often.

        Ready to build a 90-day plan to get your first 20 customers?"

        [Yes, let's do it] [Tell me more first]
```

### During Sprint

```
COACH: "Welcome back! You're in Sprint 1 - customer discovery.

        Last week you said you'd do 5 interviews. How'd that go?"

USER:  "Only did 2, but learned a lot"

COACH: "Two is better than zero! That's more than most founders
        get done. What surprised you most from those conversations?"
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Session completion rate | >60% finish assessment |
| Return rate | >40% return within 7 days |
| Sprint completion | >50% complete Sprint 1 |
| User satisfaction | >4.5/5 coach rating |

---

## Open Questions

1. **Pricing integration** - Should coach access Stripe for pricing experiments?
2. **Team support** - Multiple founders per startup?
3. **Export** - PDF reports of validation progress?
4. **Notifications** - Remind users to continue sprints?

---

## References

- [LeanSpark.ai Summary](/tasks/leanspark/leansparkai-summary.md)
- [Validator Wireframe v2](/tasks/wireframes/15-2-validator-wireframe-v2.md)
- [Existing Validator Page](/src/pages/Validator.tsx)
- [Lean Canvas Agent](/supabase/functions/lean-canvas-agent/)
