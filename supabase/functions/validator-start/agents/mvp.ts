/**
 * Agent 5: MVP Plan
 * Creates a practical MVP plan based on profile and scoring.
 */

import type { SupabaseClient, StartupProfile, ScoringResult, MVPPlan } from "../types.ts";
import { AGENTS, AGENT_TIMEOUTS } from "../config.ts";
import { AGENT_SCHEMAS } from "../schemas.ts";
import { callGemini, extractJSON } from "../gemini.ts";
import { updateRunStatus, completeRun } from "../db.ts";

export async function runMVP(
  supabase: SupabaseClient,
  sessionId: string,
  profile: StartupProfile,
  scoring: ScoringResult
): Promise<MVPPlan | null> {
  const agentName = 'MVPAgent';
  await updateRunStatus(supabase, sessionId, agentName, 'running');

  const systemPrompt = `You are a product strategist advising a founder on what to build first. Be practical and specific — no hand-waving.

## Domain Knowledge — MVP & Prioritization

### RICE Scoring Framework (for feature prioritization)
Score each feature: Reach × Impact × Confidence / Effort
- Reach: How many users will this affect in 1 month? (100/1000/10000)
- Impact: 3 = massive, 2 = high, 1 = medium, 0.5 = low, 0.25 = minimal
- Confidence: 100% = high data, 80% = some data, 50% = gut feel
- Effort: Person-months to build (0.5 = 2 weeks, 1 = 1 month, 3 = 3 months)
→ Only include features with RICE > 10 in MVP scope

### Phase Constraints
1. VALIDATE before BUILD — Phase 1 should test assumptions, not ship code
2. Phase 1 experiments: customer interviews, smoke tests, landing pages, mockups
3. Phase 2: Build core feature that tests the riskiest assumption
4. Phase 3: Iterate based on Phase 2 data — add second feature only if Phase 2 validated

### De-Risking Experiment Types (match to risk)
- Problem risk → Customer interviews (15-20 structured conversations)
- Solution risk → Wizard of Oz / concierge MVP (manual backend, real UX)
- Market risk → Landing page + ads ($500 budget, measure signup rate)
- Technical risk → Spike / prototype (2-week time-boxed proof of concept)
- Revenue risk → Pre-sell / LOI collection (before building anything)

### PMF Signals to Target
- Sean Ellis test: 40%+ say "very disappointed" if product disappeared
- Retention: Week 4 retention > 20% (consumer), Month 3 > 70% (B2B SaaS)
- Organic growth: 30%+ of new users from referral or word-of-mouth

## Experiment Design

For each of the top 3 risks from scoring, generate an EXPERIMENT CARD:
  Risk:       [from risk taxonomy — domain + assumption]
  Hypothesis: "We believe [X] because [Y]. If wrong, [Z]."
  Method:     [select from decision tree below]
  Duration:   [timeboxed — 1 week / 2 weeks / 1 month]
  SMART Goal: [specific, measurable threshold]
  Pass:       [what result = validated]
  Fail:       [what result = invalidated]
  Cost:       [time + money budget]

METHOD SELECTION DECISION TREE:
  Desirability risk?
    → Haven't talked to 10+ users? → Customer Interviews
    → Interviews confirm pain? → Fake Door / Landing Page
    → 5%+ signed up? → Pre-Sell with real pricing
  Viability risk? → Financial modeling + competitor revenue analysis + pricing tests
  Feasibility risk? → Technical spike / prototype / team assessment (2-week timebox)
  External risk? → Legal review / regulatory research

PRE-REGISTER THRESHOLDS (before running any experiment):
  1. Pass threshold — what number means "validated"
  2. Fail threshold — what number means "invalidated"
  3. Ambiguous zone — what result means "need more data"

METHOD SELECTION BY STAGE:
  Idea only → Research + Interviews (skip MVP, pre-sales)
  Problem validated → Fake door + Surveys (skip MVP)
  Demand validated → Pre-sales + Prototype (skip surveys)
  Pre-sales confirmed → MVP + Actual usage (skip research, surveys)

## Founder Stage Detection
Based on the evidence provided, classify the founder's current stage:
  - idea_only: No evidence beyond the founder's own conviction
  - problem_validated: Customer interviews confirm the pain exists
  - demand_validated: Signup/waitlist/fake door shows real demand
  - presales_confirmed: Payment or LOI collected before building

## Writing style:
- Write like you're advising a friend who's about to invest their savings into this
- Every task should be something a developer or founder could start on Monday morning
- Explain WHY each feature is in the MVP — tie it to the riskiest assumption it tests
- Name specific tools, formats, and deliverables (not "conduct research" but "Interview 10 production managers using this script")
- Next steps should be ordered by impact — what de-risks the idea fastest comes first

Return JSON with exactly these fields:
{
  "mvp_scope": "What to build and why. Name the 2-3 core features. Explain what you're deliberately leaving out and why. Keep it to 2-3 sentences.",
  "phases": [
    {
      "phase": 1,
      "name": "Phase name (e.g., 'Validate the workflow')",
      "tasks": ["Specific task with deliverable", "Another specific task", "Third task"]
    },
    {
      "phase": 2,
      "name": "Phase name",
      "tasks": ["Task 1", "Task 2"]
    },
    {
      "phase": 3,
      "name": "Phase name",
      "tasks": ["Task 1", "Task 2"]
    }
  ],
  "next_steps": [
    "Action + deliverable + why it matters (e.g., 'Interview 10 production managers to map their Excel workflow — this validates whether the pain is real enough to pay for')",
    "Step 2",
    "Step 3",
    "Step 4",
    "Step 5",
    "Step 6",
    "Step 7"
  ],
  "experiment_cards": [
    {
      "risk_domain": "e.g. Problem Risk",
      "assumption": "The specific assumption being tested",
      "hypothesis": "We believe [X] because [Y]. If wrong, [Z].",
      "method": "Customer Interviews / Landing Page / Pre-sell / Spike etc.",
      "duration": "1 week / 2 weeks / 1 month",
      "smart_goal": "Specific measurable threshold",
      "pass_threshold": "What result = validated",
      "fail_threshold": "What result = invalidated",
      "estimated_cost": "Time + money budget"
    }
  ],
  "founder_stage": "idea_only | problem_validated | demand_validated | presales_confirmed",
  "recommended_methods": ["Method 1 appropriate for this stage", "Method 2"],
  "kill_criteria": ["Threshold 1 that triggers pivot/stop", "Threshold 2"],
  "pricing_test": {
    "hypothesis": "We believe [target customer] will pay [$X/mo] for [value prop]",
    "method": "Pre-sell / LOI / pricing page A/B test",
    "price_points": ["$X/mo", "$Y/mo", "$Z/mo"],
    "pass_threshold": "N% conversion or M LOIs collected"
  }
}

HARD RULES:
1. Every task in phases must include: deliverable (artifact) + measurement (number) + timebox (days)
   BAD: "Validate the market opportunity"
   GOOD: "Interview 15 Creative Directors using 10-question script → deliverable: spreadsheet with pain scores; pass: 60% rate pain ≥8/10; timebox: 7 days"
2. Phase 1, Task 1 MUST target the #1 risk from scoring — the riskiest assumption
3. Include kill_criteria: 2-3 thresholds that trigger pivot/stop. E.g., "If <30% of interviewees rate pain ≥7/10, pivot the value proposition"
4. Include a pricing_test in experiments for B2B unless evidence_tier is A (revenue/payment data)
5. Next steps must be ordered by learning speed — cheapest and fastest validation first

Focus on de-risking the biggest unknowns first. The goal is to learn fast, not build everything.`;

  try {
    // 022-SKI: Include weakest dimensions to focus de-risking
    const weakDims = scoring.dimension_scores
      ? Object.entries(scoring.dimension_scores)
          .filter(([, v]) => typeof v === 'number' && v < 60)
          .sort(([, a], [, b]) => (a as number) - (b as number))
          .map(([k, v]) => `${k}: ${v}/100`)
          .join(', ')
      : '';

    const { text } = await callGemini(
      AGENTS.mvp.model,
      systemPrompt,
      `Create MVP plan for:
Idea: ${profile.idea}
Solution: ${profile.solution}
Customer: ${profile.customer}
Key risks: ${scoring.red_flags.join(', ')}
Key assumptions: ${scoring.risks_assumptions.join(', ')}${weakDims ? `\nWeakest dimensions (prioritize de-risking these): ${weakDims}` : ''}`,
      { responseJsonSchema: AGENT_SCHEMAS.mvp, timeoutMs: AGENT_TIMEOUTS.mvp }
    );

    const plan = extractJSON<MVPPlan>(text);
    if (!plan) {
      await completeRun(supabase, sessionId, agentName, 'failed', { rawText: text }, [], 'JSON extraction failed');
      return null;
    }

    // === POST-PROCESSING GUARDRAILS ===

    // Deterministic founder stage detection (override model guess)
    const v = (profile.validation || '').toLowerCase();
    if (v.match(/paid|invoice|stripe|revenue|loi|letter of intent|signed/)) {
      plan.founder_stage = 'presales_confirmed';
    } else if (v.match(/waitlist|signup|landing|conversion|cpa|registered/)) {
      plan.founder_stage = 'demand_validated';
    } else if (v.match(/interview|survey|10\+|confirmed pain|user research/)) {
      plan.founder_stage = 'problem_validated';
    } else {
      plan.founder_stage = 'idea_only';
    }

    // Ensure phases length = 3
    if (!Array.isArray(plan.phases) || plan.phases.length === 0) {
      plan.phases = [
        { phase: 1, name: 'Validate core assumption', tasks: ['Define and run primary experiment'] },
        { phase: 2, name: 'Test solution', tasks: ['Build minimal prototype for riskiest feature'] },
        { phase: 3, name: 'Iterate and measure', tasks: ['Refine based on Phase 2 data'] },
      ];
    }
    while (plan.phases.length < 3) {
      plan.phases.push({ phase: plan.phases.length + 1, name: `Phase ${plan.phases.length + 1}`, tasks: ['Define based on previous phase results'] });
    }

    // Ensure next_steps length 5-8
    if (!Array.isArray(plan.next_steps)) plan.next_steps = [];
    if (plan.next_steps.length > 8) plan.next_steps = plan.next_steps.slice(0, 8);

    // Ensure experiment_cards exist (at least 1)
    if (!Array.isArray(plan.experiment_cards) || plan.experiment_cards.length === 0) {
      console.warn('[MVPAgent] No experiment cards generated — adding placeholder');
    }

    // Ensure kill_criteria exist
    if (!Array.isArray((plan as Record<string, unknown>).kill_criteria) || ((plan as Record<string, unknown>).kill_criteria as string[]).length === 0) {
      (plan as Record<string, unknown>).kill_criteria = [
        `If <30% of target customers confirm the problem in interviews, reconsider the value proposition`,
        `If zero pre-sales or LOIs within 60 days, pivot or stop`,
      ];
    }

    await completeRun(supabase, sessionId, agentName, 'ok', plan);
    return plan;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    await completeRun(supabase, sessionId, agentName, 'failed', null, [], msg);
    return null;
  }
}
