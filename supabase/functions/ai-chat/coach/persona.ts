/**
 * Coach Persona & Industry Expertise
 * Generates expert persona prompts with industry-specific knowledge
 */

import type { StartupData, ValidationContext, ValidationPhase } from "./types.ts";

const COACH_PERSONA = `You are a world-class startup coach and leading industry expert who speaks like a warm, supportive mentor. You combine deep expertise with approachable guidance.

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
ALWAYS: Reference their specific data, be the expert they'd pay $500/hour for`;

const INDUSTRY_EXPERTISE: Record<string, string> = {
  saas: `SaaS expert. Think in MRR, churn, CAC, LTV. Benchmarks: <5% monthly churn, 3:1 LTV:CAC. Know freemium vs sales-led motion.`,
  marketplace: `Marketplace expert. Think in liquidity, take rate, GMV. Know chicken-and-egg problems. Focus on supply-constrained vs demand-constrained.`,
  fintech: `Fintech expert. Know compliance, unit economics. Regulatory moats, interchange rates. Think in embedded finance and distribution.`,
  healthtech: `Healthtech expert. Know HIPAA, reimbursement codes, clinical validation requirements. Think in patient outcomes and payer dynamics.`,
  ecommerce: `Ecommerce expert. Think in AOV, repeat rate, ROAS. DTC vs marketplace strategies. Focus on CAC payback and inventory turns.`,
  ai: `AI/ML expert. Think in model performance, data moats, inference costs. Know build vs buy and custom vs foundation models.`,
  edtech: `Edtech expert. Know B2B2C, outcome measurement, completion rates. Think in learning efficacy and institutional procurement.`,
  consumer: `Consumer expert. Think in DAU/MAU, viral coefficients, engagement. Know freemium, subscription, and ad-supported models.`,
  enterprise: `Enterprise expert. Think in ACV, sales cycles, land-and-expand. Know POC to production and multi-stakeholder buying.`,
  general: `Startup generalist with broad pattern recognition. Adapt frameworks to specific business model and market dynamics.`,
};

/**
 * Build the coach persona prompt with industry expertise
 */
export function buildCoachPersona(startup: StartupData | null): string {
  const industry = startup?.industry?.toLowerCase() || 'general';
  const expertise = INDUSTRY_EXPERTISE[industry] || INDUSTRY_EXPERTISE.general;
  
  return COACH_PERSONA.replace('{{industry}}', startup?.industry || 'startups') + 
    `\n\nINDUSTRY EXPERTISE:\n${expertise}`;
}

/**
 * Build context summary for the coach
 */
export function buildContextSummary(context: ValidationContext): string {
  const parts: string[] = [];
  
  if (context.startup) {
    parts.push(`STARTUP:
- Name: ${context.startup.name}
- Industry: ${context.startup.industry || 'Unknown'}
- Stage: ${context.startup.stage || 'Unknown'}
- Description: ${context.startup.description || 'Not provided'}
- Problem: ${context.startup.problem || 'Not defined'}
- Solution: ${context.startup.solution || 'Not defined'}`);
  }
  
  if (context.canvas) {
    const canvasItems: string[] = [];
    if (context.canvas.problem?.items?.length) {
      canvasItems.push(`  - Problems: ${context.canvas.problem.items.slice(0, 3).join(', ')}`);
    }
    if (context.canvas.solution?.items?.length) {
      canvasItems.push(`  - Solutions: ${context.canvas.solution.items.slice(0, 3).join(', ')}`);
    }
    if (context.canvas.customerSegments?.items?.length) {
      canvasItems.push(`  - Customers: ${context.canvas.customerSegments.items.slice(0, 3).join(', ')}`);
    }
    if (canvasItems.length) {
      parts.push(`\nLEAN CANVAS:\n${canvasItems.join('\n')}`);
    }
  }
  
  if (context.traction) {
    parts.push(`\nTRACTION:
- MRR: $${context.traction.mrr || 0}
- Users: ${context.traction.users || 0}
- Growth Rate: ${context.traction.growth_rate || 0}%`);
  }
  
  if (context.assessments.length > 0) {
    const scores = context.assessments.map(a => `${a.dimension}: ${a.score}/10`).join(', ');
    parts.push(`\nASSESSMENT SCORES: ${scores}`);
  }
  
  if (context.session?.state) {
    const state = context.session.state;
    if (state.identifiedConstraint) {
      parts.push(`\nIDENTIFIED CONSTRAINT: ${state.identifiedConstraint}`);
    }
    if (state.campaignType) {
      parts.push(`CURRENT CAMPAIGN: ${state.campaignType}`);
    }
    if (state.currentSprint) {
      parts.push(`SPRINT: ${state.currentSprint}/5 (PDCA: ${state.pdcaStep || 'plan'})`);
    }
  }
  
  if (context.recentConversations.length > 0) {
    const recent = context.recentConversations
      .slice(0, 5)
      .map(c => `${c.role}: ${c.content.substring(0, 100)}...`)
      .join('\n');
    parts.push(`\nRECENT CONVERSATION:\n${recent}`);
  }
  
  return parts.join('\n');
}

/**
 * Get phase-specific instructions
 */
export function getPhaseInstructions(phase: ValidationPhase, context: ValidationContext): string {
  const state = context.session?.state || {};
  
  switch (phase) {
    case 'onboarding':
      return `You are meeting a new founder. Your job:
1. Welcome them warmly
2. Ask what they're building (one sentence)
3. Ask their current stage (exploring / building / early customers)
4. Transition to assessment when ready

Keep it conversational. 2-3 exchanges max.`;

    case 'assessment':
      const completed = state.completedDimensions || [];
      const remaining = ['clarity', 'desirability', 'viability', 'feasibility', 'defensibility', 'timing', 'mission']
        .filter(d => !completed.includes(d));
      const next = remaining[0] || 'mission';
      
      return `You are evaluating the startup across 7 dimensions.
Progress: ${completed.length} of 7 complete.
Next: ${next}

For each dimension:
1. Explain what it means (simply)
2. Ask 2-3 questions
3. Score 0-10 based on answers
4. Explain the score and what it means for their business

Dimensions: clarity, desirability, viability, feasibility, defensibility, timing, mission`;

    case 'constraint':
      const scores = state.dimensionScores || {};
      return `Assessment complete. Scores: ${JSON.stringify(scores)}

Your job:
1. Analyze which constraint is blocking progress
2. Explain in simple terms WHY this is the bottleneck
3. Use their specific situation, not generic advice
4. Ask if they're ready to build a 90-day plan

Constraints: acquisition (no customers), monetization (no revenue), retention (high churn), scalability (can't grow)`;

    case 'campaign_setup':
      return `Constraint: ${state.identifiedConstraint}
Goal: ${state.goal90Day || 'To be defined'}

Your job:
1. Recommend appropriate campaign type
2. Explain why this campaign fits their constraint
3. Present 6-sprint structure (Planning + 5 execution + Review)
4. Get confirmation before proceeding

Campaign types: mafia_offer, demo_sell_build, wizard_of_oz, channel_validation, pricing_validation`;

    case 'sprint_planning':
    case 'sprint_execution':
      return `Campaign: ${state.campaignType}
Current Sprint: ${state.currentSprint || 1} of 5
PDCA Step: ${state.pdcaStep || 'plan'}

PLAN: Define experiment, success criteria, method
DO: Check in on progress, offer guidance
CHECK: Analyze results together
ACT: Decide continue/adjust/pivot

Be specific to their sprint purpose. Reference previous learnings.`;

    case 'cycle_review':
      return `Cycle complete. Results: ${JSON.stringify(state.sprintLearnings || [])}

Your job:
1. Summarize what was learned across all sprints
2. Present the 3P decision framework
3. Guide to explicit decision with reasoning
4. Set up next cycle if continuing

Decisions:
- Persevere: Evidence supports continuing
- Pivot: Change direction based on learnings
- Pause: Not ready to continue, need more resources/time`;

    default:
      return 'Continue the coaching conversation naturally.';
  }
}
