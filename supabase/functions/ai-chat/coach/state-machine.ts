/**
 * State Machine
 * Handles phase transitions for the validation coaching flow
 */

import type { ValidationPhase, ValidationState, ValidationContext, ProgressInfo, PHASE_STEPS } from "./types.ts";

/**
 * Valid phase transitions
 */
const VALID_TRANSITIONS: Record<ValidationPhase, ValidationPhase[]> = {
  onboarding: ['assessment'],
  assessment: ['constraint'],
  constraint: ['campaign_setup'],
  campaign_setup: ['sprint_planning'],
  sprint_planning: ['sprint_execution'],
  sprint_execution: ['sprint_planning', 'cycle_review'],
  cycle_review: ['assessment', 'campaign_setup'],
};

/**
 * Check if a transition is valid
 */
export function canTransition(from: ValidationPhase, to: ValidationPhase): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Detect if a phase transition should occur based on AI response
 */
export function detectTransition(
  currentPhase: ValidationPhase,
  context: ValidationContext,
  aiResponse: string
): ValidationPhase | null {
  const response = aiResponse.toLowerCase();
  const state = context.session?.state || {};
  
  switch (currentPhase) {
    case 'onboarding':
      // Transition when we have enough context and AI indicates readiness
      if (
        (response.includes('let\'s assess') || 
         response.includes('start the assessment') ||
         response.includes('evaluate your startup') ||
         response.includes('7 dimensions')) &&
        context.startup?.name
      ) {
        return 'assessment';
      }
      break;
      
    case 'assessment':
      // Transition when all 7 dimensions are scored
      const completed = state.completedDimensions || [];
      if (completed.length >= 7) {
        return 'constraint';
      }
      // Also check if AI indicates completion
      if (
        response.includes('assessment complete') ||
        response.includes('all dimensions scored') ||
        response.includes('identified your constraint')
      ) {
        return 'constraint';
      }
      break;
      
    case 'constraint':
      // Transition when constraint is identified and user is ready
      if (
        state.identifiedConstraint &&
        (response.includes('90-day') || 
         response.includes('campaign') ||
         response.includes('let\'s plan'))
      ) {
        return 'campaign_setup';
      }
      break;
      
    case 'campaign_setup':
      // Transition when campaign is accepted
      if (
        state.campaignType &&
        (response.includes('sprint 1') ||
         response.includes('first sprint') ||
         response.includes('let\'s start planning'))
      ) {
        return 'sprint_planning';
      }
      break;
      
    case 'sprint_planning':
      // Transition when plan is set
      if (
        response.includes('execute') ||
        response.includes('go do') ||
        response.includes('check in')
      ) {
        return 'sprint_execution';
      }
      break;
      
    case 'sprint_execution':
      // Transition based on sprint completion
      const currentSprint = state.currentSprint || 1;
      if (
        (response.includes('sprint complete') ||
         response.includes('next sprint')) &&
        currentSprint < 5
      ) {
        return 'sprint_planning';
      }
      if (currentSprint >= 5 || response.includes('cycle review')) {
        return 'cycle_review';
      }
      break;
      
    case 'cycle_review':
      // Transition based on decision
      if (state.cycleDecision === 'persevere') {
        return 'campaign_setup';
      }
      if (state.cycleDecision === 'pivot') {
        return 'assessment';
      }
      break;
  }
  
  return null;
}

/**
 * Extract state updates from AI response
 */
export function extractStateUpdates(
  currentPhase: ValidationPhase,
  currentState: ValidationState,
  aiResponse: string
): Partial<ValidationState> | null {
  const response = aiResponse.toLowerCase();
  const updates: Partial<ValidationState> = {};
  let hasUpdates = false;
  
  // Extract dimension scores from assessment phase
  if (currentPhase === 'assessment') {
    const dimensions = ['clarity', 'desirability', 'viability', 'feasibility', 'defensibility', 'timing', 'mission'];
    const completed = [...(currentState.completedDimensions || [])];
    const scores = { ...(currentState.dimensionScores || {}) };
    
    // Look for score patterns like "clarity: 8/10" or "I'd give clarity an 8"
    for (const dim of dimensions) {
      if (response.includes(dim) && !completed.includes(dim)) {
        const scoreMatch = response.match(new RegExp(`${dim}[^\\d]*(\\d+)(?:\\/10)?`, 'i'));
        if (scoreMatch) {
          const score = parseInt(scoreMatch[1]);
          if (score >= 0 && score <= 10) {
            scores[dim] = score;
            completed.push(dim);
            hasUpdates = true;
          }
        }
      }
    }
    
    if (hasUpdates) {
      updates.completedDimensions = completed;
      updates.dimensionScores = scores;
    }
  }
  
  // Extract constraint from constraint phase
  if (currentPhase === 'constraint' || currentPhase === 'assessment') {
    const constraints: Array<{ key: string; patterns: string[] }> = [
      { key: 'acquisition', patterns: ['acquisition', 'customer acquisition', 'no customers', 'getting customers'] },
      { key: 'monetization', patterns: ['monetization', 'revenue', 'no revenue', 'making money'] },
      { key: 'retention', patterns: ['retention', 'churn', 'keeping customers', 'customer loss'] },
      { key: 'scalability', patterns: ['scalability', 'scaling', 'can\'t scale', 'growth limit'] },
    ];
    
    for (const { key, patterns } of constraints) {
      if (patterns.some(p => response.includes(p)) && 
          (response.includes('bottleneck') || response.includes('constraint') || response.includes('biggest challenge'))) {
        updates.identifiedConstraint = key as ValidationState['identifiedConstraint'];
        hasUpdates = true;
        break;
      }
    }
  }
  
  // Extract campaign type from campaign phase
  if (currentPhase === 'campaign_setup') {
    const campaigns: Array<{ key: string; patterns: string[] }> = [
      { key: 'mafia_offer', patterns: ['mafia offer', 'irresistible offer'] },
      { key: 'demo_sell_build', patterns: ['demo sell build', 'demo-sell-build', 'sell before building'] },
      { key: 'wizard_of_oz', patterns: ['wizard of oz', 'concierge', 'manual first'] },
      { key: 'channel_validation', patterns: ['channel validation', 'channel test', 'acquisition channel'] },
      { key: 'pricing_validation', patterns: ['pricing validation', 'price test', 'willingness to pay'] },
    ];
    
    for (const { key, patterns } of campaigns) {
      if (patterns.some(p => response.includes(p))) {
        updates.campaignType = key as ValidationState['campaignType'];
        hasUpdates = true;
        break;
      }
    }
  }
  
  // Extract PDCA step updates
  if (currentPhase === 'sprint_execution') {
    const pdcaSteps: Array<{ key: string; patterns: string[] }> = [
      { key: 'plan', patterns: ['let\'s plan', 'planning phase', 'define the experiment'] },
      { key: 'do', patterns: ['time to execute', 'go do', 'implement'] },
      { key: 'check', patterns: ['let\'s check', 'analyze results', 'what happened'] },
      { key: 'act', patterns: ['decide', 'continue or pivot', 'next action'] },
    ];
    
    for (const { key, patterns } of pdcaSteps) {
      if (patterns.some(p => response.includes(p))) {
        updates.pdcaStep = key as ValidationState['pdcaStep'];
        hasUpdates = true;
        break;
      }
    }
  }
  
  // Extract cycle decision
  if (currentPhase === 'cycle_review') {
    if (response.includes('persevere') && response.includes('decision')) {
      updates.cycleDecision = 'persevere';
      hasUpdates = true;
    } else if (response.includes('pivot') && response.includes('decision')) {
      updates.cycleDecision = 'pivot';
      hasUpdates = true;
    } else if (response.includes('pause') && response.includes('decision')) {
      updates.cycleDecision = 'pause';
      hasUpdates = true;
    }
  }
  
  return hasUpdates ? updates : null;
}

/**
 * Calculate progress info for current phase
 */
export function calculateProgress(
  phase: ValidationPhase,
  state: ValidationState
): ProgressInfo {
  const phaseSteps: Record<ValidationPhase, number> = {
    onboarding: 3,
    assessment: 7,
    constraint: 2,
    campaign_setup: 3,
    sprint_planning: 4,
    sprint_execution: 4,
    cycle_review: 3,
  };
  
  const totalSteps = phaseSteps[phase];
  let step = 1;
  
  switch (phase) {
    case 'assessment':
      step = (state.completedDimensions?.length || 0) + 1;
      break;
    case 'constraint':
      step = state.identifiedConstraint ? 2 : 1;
      break;
    case 'campaign_setup':
      step = state.campaignType ? 2 : 1;
      if (state.goal90Day) step = 3;
      break;
    case 'sprint_planning':
    case 'sprint_execution':
      const pdcaOrder = ['plan', 'do', 'check', 'act'];
      step = pdcaOrder.indexOf(state.pdcaStep || 'plan') + 1;
      break;
    case 'cycle_review':
      step = state.cycleDecision ? 3 : 1;
      break;
  }
  
  // Calculate overall percentage through entire journey
  const phaseOrder: ValidationPhase[] = ['onboarding', 'assessment', 'constraint', 'campaign_setup', 'sprint_planning', 'sprint_execution', 'cycle_review'];
  const phaseIndex = phaseOrder.indexOf(phase);
  const phasesComplete = phaseIndex;
  const phaseProgress = step / totalSteps;
  const totalPercentage = Math.round(((phasesComplete + phaseProgress) / phaseOrder.length) * 100);
  
  return {
    phase: phase.replace('_', ' '),
    step: Math.min(step, totalSteps),
    totalSteps,
    percentage: Math.min(totalPercentage, 100),
  };
}

/**
 * Get suggested actions based on current phase
 */
export function getSuggestedActions(
  phase: ValidationPhase,
  state: ValidationState,
  aiResponse: string
): string[] {
  const response = aiResponse.toLowerCase();
  const actions: string[] = [];
  
  // Context-aware suggestions based on phase
  switch (phase) {
    case 'onboarding':
      actions.push('Tell me about my startup');
      actions.push('I\'m ready to be assessed');
      break;
      
    case 'assessment':
      const remaining = 7 - (state.completedDimensions?.length || 0);
      if (remaining > 0) {
        actions.push(`Continue (${remaining} left)`);
        actions.push('Skip to constraint');
      } else {
        actions.push('Show my constraint');
      }
      break;
      
    case 'constraint':
      actions.push('Yes, let\'s plan a campaign');
      actions.push('Tell me more about this constraint');
      actions.push('I disagree with this analysis');
      break;
      
    case 'campaign_setup':
      actions.push('This sounds good, let\'s start');
      actions.push('Show me other campaign options');
      actions.push('I need to think about this');
      break;
      
    case 'sprint_planning':
      actions.push('Start the sprint');
      actions.push('Adjust the plan');
      actions.push('I need more guidance');
      break;
      
    case 'sprint_execution':
      actions.push('I completed the task');
      actions.push('I\'m stuck');
      actions.push('Skip to next step');
      break;
      
    case 'cycle_review':
      actions.push('Persevere - continue');
      actions.push('Pivot - change direction');
      actions.push('Pause - need more time');
      break;
  }
  
  // Add dynamic suggestions based on AI response
  if (response.includes('?')) {
    // AI asked a question, add response options
    if (response.includes('ready')) {
      actions.unshift('Yes, I\'m ready');
    }
    if (response.includes('understand')) {
      actions.unshift('Yes, I understand');
    }
  }
  
  return actions.slice(0, 4);
}
