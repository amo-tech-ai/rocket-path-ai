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
  ]
}

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
    await completeRun(supabase, sessionId, agentName, 'ok', plan);
    return plan;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    await completeRun(supabase, sessionId, agentName, 'failed', null, [], msg);
    return null;
  }
}
