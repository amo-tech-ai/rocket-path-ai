/**
 * Industry Context Loader
 *
 * Loads and formats industry-specific knowledge for AI agent expertise injection.
 * Each feature gets a filtered slice of the playbook based on context.
 *
 * Usage:
 *   import { getIndustryContext, formatContextForPrompt } from '../_shared/industry-context.ts';
 *
 *   const context = await getIndustryContext('fintech', 'pitch_deck', 'seed');
 *   const contextBlock = formatContextForPrompt(context, 'pitch_deck');
 *   // Append contextBlock to system prompt
 */

import { createClient, SupabaseClient } from 'npm:@supabase/supabase-js@2';

// ============================================================================
// TYPES
// ============================================================================

export interface InvestorExpectations {
  pre_seed?: StageExpectation;
  seed?: StageExpectation;
  series_a?: StageExpectation;
  series_b?: StageExpectation;
  growth?: StageExpectation;
}

export interface StageExpectation {
  focus: string[];
  metrics: string[];
  deal_breakers: string[];
}

export interface FailurePattern {
  id?: string;
  pattern: string;
  why_fatal: string;
  early_warning: string;
  how_to_avoid: string;
}

export interface SuccessStory {
  id?: string;
  archetype: string;
  pattern: string;
  key_moves: string[];
  outcome_signal: string;
}

export interface BenchmarkMetric {
  metric: string;
  good: string;
  great: string;
  stage: string;
  source?: string;
}

export interface IndustryTerminology {
  use_phrases: string[];
  avoid_phrases: string[];
  investor_vocabulary: string[];
}

export interface GTMPattern {
  id?: string;
  name: string;
  description: string;
  stages: string[];
  channels: string[];
  timeline: string;
  best_for: string;
}

export interface DecisionFramework {
  id?: string;
  decision: string;
  rows: DecisionRow[];
}

export interface DecisionRow {
  if_condition: string;
  then_action: string;
  because: string;
}

export interface InvestorQuestion {
  category: string;
  question: string;
  good_answer: string;
  bad_answer: string;
  follow_up?: string;
}

export interface WarningSign {
  signal: string;
  trigger: string;
  action: string;
  severity: 'critical' | 'warning';
}

export interface StageChecklist {
  stage: string;
  tasks: ChecklistTask[];
}

export interface ChecklistTask {
  task: string;
  why: string;
  how: string;
  time: string;
  cost: string;
}

export interface SlideEmphasis {
  slide: string;
  weight: 'critical' | 'important' | 'standard';
  guidance: string;
}

export interface IndustryPlaybook {
  id: string;
  industry_id: string;
  display_name: string;
  narrative_arc: string;
  investor_expectations: InvestorExpectations;
  failure_patterns: FailurePattern[];
  success_stories: SuccessStory[];
  benchmarks: BenchmarkMetric[];
  terminology: IndustryTerminology;
  gtm_patterns: GTMPattern[];
  decision_frameworks: DecisionFramework[];
  investor_questions: InvestorQuestion[];
  warning_signs: WarningSign[];
  stage_checklists: StageChecklist[];
  slide_emphasis: SlideEmphasis[];
  version: number;
  is_active: boolean;
}

export type FeatureContext =
  | 'onboarding'
  | 'lean_canvas'
  | 'pitch_deck'
  | 'tasks'
  | 'chatbot'
  | 'validator'
  | 'gtm_planning'
  | 'fundraising';

export type FundingStage = 'pre_seed' | 'seed' | 'series_a' | 'series_b' | 'growth';

// ============================================================================
// CONTEXT MAPPING
// ============================================================================

/**
 * Maps feature contexts to relevant knowledge categories.
 * Each feature gets only the categories it needs to keep context focused.
 */
const CONTEXT_MAP: Record<FeatureContext, (keyof IndustryPlaybook)[]> = {
  onboarding: ['failure_patterns', 'terminology'],
  lean_canvas: ['gtm_patterns', 'benchmarks'],
  pitch_deck: ['investor_expectations', 'success_stories', 'failure_patterns', 'investor_questions', 'warning_signs', 'slide_emphasis'],
  tasks: ['gtm_patterns', 'failure_patterns', 'stage_checklists', 'decision_frameworks'],
  chatbot: ['investor_expectations', 'failure_patterns', 'success_stories', 'benchmarks', 'terminology', 'gtm_patterns', 'decision_frameworks', 'investor_questions', 'warning_signs', 'stage_checklists'],
  validator: ['benchmarks', 'warning_signs', 'failure_patterns'],
  gtm_planning: ['gtm_patterns', 'failure_patterns', 'decision_frameworks'],
  fundraising: ['investor_expectations', 'investor_questions', 'stage_checklists', 'warning_signs']
};

// ============================================================================
// CACHING
// ============================================================================

interface CacheEntry {
  data: IndustryPlaybook;
  timestamp: number;
}

const playbookCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Clear the playbook cache (useful for testing or forced refresh)
 */
export function clearCache(): void {
  playbookCache.clear();
}

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Create a Supabase client for database access
 */
function getSupabaseClient(): SupabaseClient {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!
  );
}

/**
 * Load a playbook from database with caching
 */
export async function loadPlaybook(
  industryId: string,
  supabase?: SupabaseClient
): Promise<IndustryPlaybook | null> {
  // Normalize industry ID
  const normalizedId = industryId.toLowerCase().replace(/[\s-]+/g, '_');

  // Check cache
  const cached = playbookCache.get(normalizedId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // Load from database
  const client = supabase || getSupabaseClient();

  const { data, error } = await client
    .from('industry_playbooks')
    .select('*')
    .eq('industry_id', normalizedId)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    console.warn(`Playbook not found for industry: ${normalizedId}`, error?.message);
    return null;
  }

  const playbook = data as IndustryPlaybook;

  // Cache the result
  playbookCache.set(normalizedId, {
    data: playbook,
    timestamp: Date.now()
  });

  return playbook;
}

/**
 * Get filtered industry context for a specific feature
 *
 * @param industryId - The industry identifier (e.g., 'fintech', 'ai_saas')
 * @param featureContext - Which feature is requesting context
 * @param stage - Optional funding stage for stage-specific filtering
 * @param supabase - Optional Supabase client
 * @returns Filtered playbook with only relevant categories
 */
export async function getIndustryContext(
  industryId: string,
  featureContext: FeatureContext,
  stage?: FundingStage | string,
  supabase?: SupabaseClient
): Promise<Partial<IndustryPlaybook> | null> {
  const playbook = await loadPlaybook(industryId, supabase);
  if (!playbook) return null;

  const categories = CONTEXT_MAP[featureContext];
  const filteredContext: Partial<IndustryPlaybook> = {
    industry_id: playbook.industry_id,
    display_name: playbook.display_name,
    narrative_arc: playbook.narrative_arc
  };

  // Extract only the relevant categories
  for (const category of categories) {
    const value = playbook[category];
    if (value !== undefined && value !== null) {
      (filteredContext as Record<string, unknown>)[category] = value;
    }
  }

  // Filter stage-specific content if stage provided
  const normalizedStage = stage?.toLowerCase().replace(/[\s-]+/g, '_') as FundingStage | undefined;

  if (normalizedStage && filteredContext.investor_expectations) {
    const expectations = filteredContext.investor_expectations as InvestorExpectations;
    const stageExpectation = expectations[normalizedStage];
    if (stageExpectation) {
      filteredContext.investor_expectations = {
        [normalizedStage]: stageExpectation
      } as InvestorExpectations;
    }
  }

  if (normalizedStage && filteredContext.stage_checklists) {
    const checklists = filteredContext.stage_checklists as StageChecklist[];
    const stageWords = normalizedStage.replace('_', ' ').split(' ');
    filteredContext.stage_checklists = checklists.filter(c =>
      stageWords.some(word => c.stage.toLowerCase().includes(word))
    );
  }

  return filteredContext;
}

/**
 * List all available industries
 */
export async function listIndustries(
  supabase?: SupabaseClient
): Promise<{ industry_id: string; display_name: string }[]> {
  const client = supabase || getSupabaseClient();

  const { data, error } = await client
    .from('industry_playbooks')
    .select('industry_id, display_name')
    .eq('is_active', true)
    .order('display_name');

  if (error) {
    console.error('Failed to list industries:', error);
    return [];
  }

  return data || [];
}

// ============================================================================
// FORMATTING FUNCTIONS
// ============================================================================

/**
 * Format industry context for prompt injection
 * Creates a markdown-formatted string optimized for AI consumption
 */
export function formatContextForPrompt(
  context: Partial<IndustryPlaybook>,
  featureContext: FeatureContext
): string {
  const sections: string[] = [];

  sections.push(`## INDUSTRY EXPERTISE: ${context.display_name}`);

  if (context.narrative_arc) {
    sections.push(`\n**Success Pattern:** ${context.narrative_arc}`);
  }

  // Format based on feature context
  switch (featureContext) {
    case 'onboarding':
      sections.push(formatOnboardingContext(context));
      break;
    case 'lean_canvas':
      sections.push(formatLeanCanvasContext(context));
      break;
    case 'pitch_deck':
      sections.push(formatPitchDeckContext(context));
      break;
    case 'tasks':
      sections.push(formatTasksContext(context));
      break;
    case 'chatbot':
      sections.push(formatFullContext(context));
      break;
    case 'validator':
      sections.push(formatValidatorContext(context));
      break;
    case 'gtm_planning':
      sections.push(formatGTMContext(context));
      break;
    case 'fundraising':
      sections.push(formatFundraisingContext(context));
      break;
  }

  return sections.join('\n');
}

// ============================================================================
// CONTEXT-SPECIFIC FORMATTERS
// ============================================================================

function formatOnboardingContext(ctx: Partial<IndustryPlaybook>): string {
  const parts: string[] = [];

  if (ctx.failure_patterns?.length) {
    parts.push('\n### ⚠️ Common Mistakes to Warn About:');
    ctx.failure_patterns.slice(0, 3).forEach(fp => {
      parts.push(`\n**${fp.pattern}**`);
      parts.push(`- Early Warning: ${fp.early_warning}`);
      parts.push(`- How to Avoid: ${fp.how_to_avoid}`);
    });
  }

  if (ctx.terminology) {
    const term = ctx.terminology as IndustryTerminology;
    parts.push('\n### 📝 Industry Language:');
    if (term.use_phrases?.length) {
      parts.push(`- **Use these phrases:** ${term.use_phrases.slice(0, 6).join(', ')}`);
    }
    if (term.avoid_phrases?.length) {
      parts.push(`- **Avoid saying:** ${term.avoid_phrases.slice(0, 4).join(', ')}`);
    }
  }

  return parts.join('\n');
}

function formatLeanCanvasContext(ctx: Partial<IndustryPlaybook>): string {
  const parts: string[] = [];

  if (ctx.gtm_patterns?.length) {
    parts.push('\n### 🚀 Proven GTM Strategies:');
    (ctx.gtm_patterns as GTMPattern[]).slice(0, 3).forEach(gp => {
      parts.push(`\n**${gp.name}** (${gp.stages.join(', ')})`);
      parts.push(`- ${gp.description}`);
      parts.push(`- Channels: ${gp.channels.join(', ')}`);
      parts.push(`- Timeline: ${gp.timeline}`);
    });
  }

  if (ctx.benchmarks?.length) {
    parts.push('\n### 📊 Key Benchmarks:');
    (ctx.benchmarks as BenchmarkMetric[]).slice(0, 6).forEach(b => {
      parts.push(`- **${b.metric}:** Good = ${b.good}, Great = ${b.great}`);
    });
  }

  return parts.join('\n');
}

function formatPitchDeckContext(ctx: Partial<IndustryPlaybook>): string {
  const parts: string[] = [];

  // Investor expectations
  if (ctx.investor_expectations) {
    parts.push('\n### 🎯 Investor Expectations:');
    Object.entries(ctx.investor_expectations).forEach(([stage, exp]) => {
      if (exp && typeof exp === 'object') {
        const stageExp = exp as StageExpectation;
        parts.push(`\n**${stage.toUpperCase().replace('_', '-')}:**`);
        if (stageExp.focus?.length) parts.push(`- Focus: ${stageExp.focus.join(', ')}`);
        if (stageExp.metrics?.length) parts.push(`- Key Metrics: ${stageExp.metrics.join(', ')}`);
        if (stageExp.deal_breakers?.length) parts.push(`- Deal Breakers: ${stageExp.deal_breakers.join(', ')}`);
      }
    });
  }

  // Investor questions
  if (ctx.investor_questions?.length) {
    parts.push('\n### ❓ Key Investor Questions:');
    (ctx.investor_questions as InvestorQuestion[]).slice(0, 4).forEach(q => {
      parts.push(`\n**"${q.question}"**`);
      parts.push(`- ✓ Good: "${q.good_answer.substring(0, 200)}${q.good_answer.length > 200 ? '...' : ''}"`);
      parts.push(`- ✗ Bad: "${q.bad_answer}"`);
    });
  }

  // Warning signs
  if (ctx.warning_signs?.length) {
    const critical = (ctx.warning_signs as WarningSign[]).filter(w => w.severity === 'critical');
    if (critical.length) {
      parts.push('\n### 🚨 Red Flags to Avoid:');
      critical.slice(0, 3).forEach(w => {
        parts.push(`- **${w.signal}:** ${w.trigger}`);
      });
    }
  }

  // Slide emphasis
  if (ctx.slide_emphasis?.length) {
    parts.push('\n### 📑 Slide Priorities:');
    (ctx.slide_emphasis as SlideEmphasis[]).forEach(s => {
      const icon = s.weight === 'critical' ? '🔴' : s.weight === 'important' ? '🟡' : '⚪';
      parts.push(`- ${icon} **${s.slide}** (${s.weight}): ${s.guidance}`);
    });
  }

  return parts.join('\n');
}

function formatTasksContext(ctx: Partial<IndustryPlaybook>): string {
  const parts: string[] = [];

  // Stage checklists
  if (ctx.stage_checklists?.length) {
    parts.push('\n### ✅ Stage Checklist:');
    (ctx.stage_checklists as StageChecklist[]).forEach(sc => {
      parts.push(`\n**${sc.stage}:**`);
      sc.tasks.slice(0, 5).forEach(t => {
        parts.push(`- [ ] ${t.task}`);
        parts.push(`  - Why: ${t.why}`);
        parts.push(`  - Timeline: ${t.time} | Cost: ${t.cost}`);
      });
    });
  }

  // Decision frameworks
  if (ctx.decision_frameworks?.length) {
    parts.push('\n### 🧭 Decision Frameworks:');
    (ctx.decision_frameworks as DecisionFramework[]).slice(0, 2).forEach(df => {
      parts.push(`\n**${df.decision}:**`);
      df.rows.slice(0, 4).forEach(r => {
        parts.push(`- If ${r.if_condition} → ${r.then_action}`);
        parts.push(`  *(${r.because})*`);
      });
    });
  }

  // Failure patterns
  if (ctx.failure_patterns?.length) {
    parts.push('\n### ⚠️ Avoid These Mistakes:');
    (ctx.failure_patterns as FailurePattern[]).slice(0, 3).forEach(fp => {
      parts.push(`- **${fp.pattern}:** ${fp.how_to_avoid}`);
    });
  }

  return parts.join('\n');
}

function formatValidatorContext(ctx: Partial<IndustryPlaybook>): string {
  const parts: string[] = [];

  if (ctx.benchmarks?.length) {
    parts.push('\n### 📊 Validation Benchmarks:');
    (ctx.benchmarks as BenchmarkMetric[]).forEach(b => {
      parts.push(`- **${b.metric}:** Good = ${b.good}, Great = ${b.great} (${b.stage})`);
    });
  }

  if (ctx.warning_signs?.length) {
    parts.push('\n### 🚨 Warning Signs:');
    (ctx.warning_signs as WarningSign[]).forEach(w => {
      const icon = w.severity === 'critical' ? '🔴' : '🟡';
      parts.push(`- ${icon} **${w.signal}:** ${w.trigger}`);
      parts.push(`  → Action: ${w.action}`);
    });
  }

  if (ctx.failure_patterns?.length) {
    parts.push('\n### ⚠️ Common Failure Patterns:');
    (ctx.failure_patterns as FailurePattern[]).forEach(fp => {
      parts.push(`\n**${fp.pattern}**`);
      parts.push(`- Why Fatal: ${fp.why_fatal}`);
      parts.push(`- Early Warning: ${fp.early_warning}`);
    });
  }

  return parts.join('\n');
}

function formatGTMContext(ctx: Partial<IndustryPlaybook>): string {
  const parts: string[] = [];

  if (ctx.gtm_patterns?.length) {
    parts.push('\n### 🚀 GTM Strategies:');
    (ctx.gtm_patterns as GTMPattern[]).forEach(gp => {
      parts.push(`\n**${gp.name}** (Best for: ${gp.stages.join(', ')})`);
      parts.push(gp.description);
      parts.push(`- Channels: ${gp.channels.join(', ')}`);
      parts.push(`- Timeline: ${gp.timeline}`);
      parts.push(`- Best for: ${gp.best_for}`);
    });
  }

  if (ctx.decision_frameworks?.length) {
    parts.push('\n### 🧭 Decision Frameworks:');
    (ctx.decision_frameworks as DecisionFramework[]).forEach(df => {
      parts.push(`\n**${df.decision}:**`);
      df.rows.forEach(r => {
        parts.push(`- If ${r.if_condition} → ${r.then_action}`);
        parts.push(`  *(${r.because})*`);
      });
    });
  }

  if (ctx.failure_patterns?.length) {
    parts.push('\n### ⚠️ GTM Mistakes to Avoid:');
    (ctx.failure_patterns as FailurePattern[]).slice(0, 3).forEach(fp => {
      parts.push(`- **${fp.pattern}:** ${fp.how_to_avoid}`);
    });
  }

  return parts.join('\n');
}

function formatFundraisingContext(ctx: Partial<IndustryPlaybook>): string {
  const parts: string[] = [];

  // Investor expectations
  if (ctx.investor_expectations) {
    parts.push('\n### 🎯 Stage Expectations:');
    Object.entries(ctx.investor_expectations).forEach(([stage, exp]) => {
      if (exp && typeof exp === 'object') {
        const stageExp = exp as StageExpectation;
        parts.push(`\n**${stage.toUpperCase().replace('_', '-')}:**`);
        if (stageExp.focus?.length) parts.push(`- Focus: ${stageExp.focus.join(', ')}`);
        if (stageExp.metrics?.length) parts.push(`- Key Metrics: ${stageExp.metrics.join(', ')}`);
        if (stageExp.deal_breakers?.length) parts.push(`- Deal Breakers: ${stageExp.deal_breakers.join(', ')}`);
      }
    });
  }

  // Investor questions
  if (ctx.investor_questions?.length) {
    parts.push('\n### ❓ Prepare for These Questions:');
    (ctx.investor_questions as InvestorQuestion[]).forEach(q => {
      parts.push(`\n**"${q.question}"**`);
      parts.push(`- ✓ Good Answer: ${q.good_answer.substring(0, 250)}${q.good_answer.length > 250 ? '...' : ''}`);
      parts.push(`- ✗ Bad Answer: ${q.bad_answer}`);
      if (q.follow_up) {
        parts.push(`- ↳ Follow-up: ${q.follow_up}`);
      }
    });
  }

  // Stage checklists
  if (ctx.stage_checklists?.length) {
    parts.push('\n### ✅ Pre-Raise Checklist:');
    (ctx.stage_checklists as StageChecklist[]).forEach(sc => {
      parts.push(`\n**Before ${sc.stage}:**`);
      sc.tasks.forEach(t => {
        parts.push(`- [ ] ${t.task}`);
        parts.push(`  - Why: ${t.why}`);
        parts.push(`  - How: ${t.how}`);
        parts.push(`  - Timeline: ${t.time}`);
      });
    });
  }

  // Warning signs
  if (ctx.warning_signs?.length) {
    parts.push('\n### 🚨 Warning Signs:');
    (ctx.warning_signs as WarningSign[]).forEach(w => {
      const icon = w.severity === 'critical' ? '🔴' : '🟡';
      parts.push(`- ${icon} **${w.signal}:** ${w.trigger} → ${w.action}`);
    });
  }

  return parts.join('\n');
}

function formatFullContext(ctx: Partial<IndustryPlaybook>): string {
  // Chatbot gets comprehensive context - combine relevant sections
  const parts: string[] = [];

  // Success patterns
  if (ctx.success_stories?.length) {
    parts.push('\n### 🏆 Success Patterns:');
    (ctx.success_stories as SuccessStory[]).slice(0, 2).forEach(ss => {
      parts.push(`\n**${ss.archetype}**`);
      parts.push(`- Pattern: ${ss.pattern}`);
      parts.push(`- Key Moves: ${ss.key_moves.slice(0, 3).join('; ')}`);
      parts.push(`- Outcome: ${ss.outcome_signal}`);
    });
  }

  // Add other contexts
  parts.push(formatOnboardingContext(ctx));
  parts.push(formatLeanCanvasContext(ctx));
  parts.push(formatValidatorContext(ctx));

  // Investor questions (abbreviated for chatbot)
  if (ctx.investor_questions?.length) {
    parts.push('\n### ❓ Common Investor Questions:');
    (ctx.investor_questions as InvestorQuestion[]).slice(0, 3).forEach(q => {
      parts.push(`- "${q.question}"`);
    });
  }

  return parts.join('\n');
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Map action names to feature contexts
 */
export function mapActionToFeatureContext(action: string): FeatureContext {
  const mapping: Record<string, FeatureContext> = {
    // Onboarding actions
    'extract_profile': 'onboarding',
    'enrich_url': 'onboarding',
    'wizard_extract_startup': 'onboarding',
    'wizard_calculate_readiness': 'onboarding',
    'wizard_extract_traction': 'onboarding',
    'wizard_investor_score': 'onboarding',

    // Lean canvas actions
    'generate_canvas': 'lean_canvas',
    'validate_canvas': 'lean_canvas',
    'improve_canvas_section': 'lean_canvas',
    'canvas_generate': 'lean_canvas',

    // Pitch deck actions
    'generate_pitch_deck': 'pitch_deck',
    'generate_slide': 'pitch_deck',
    'improve_slide': 'pitch_deck',
    'pitch_generate': 'pitch_deck',
    'deck_generate': 'pitch_deck',

    // Task actions
    'generate_tasks': 'tasks',
    'prioritize_tasks': 'tasks',
    'create_tasks': 'tasks',

    // Chat actions
    'chat': 'chatbot',
    'quick_chat': 'chatbot',
    'ask': 'chatbot',

    // Validation actions
    'validate_idea': 'validator',
    'calculate_readiness': 'validator',
    'validate': 'validator',

    // GTM actions
    'generate_gtm_strategy': 'gtm_planning',
    'gtm_planning': 'gtm_planning',

    // Fundraising actions
    'prepare_fundraising': 'fundraising',
    'investor_matching': 'fundraising',
    'fundraising': 'fundraising'
  };

  return mapping[action] || 'chatbot';
}

/**
 * Estimate token count for context (rough approximation)
 */
export function estimateTokens(text: string): number {
  // Rough estimate: ~4 characters per token
  return Math.ceil(text.length / 4);
}

/**
 * Truncate context to fit within token budget
 */
export function truncateContext(
  context: string,
  maxTokens: number = 2000
): string {
  const estimated = estimateTokens(context);
  if (estimated <= maxTokens) return context;

  // Simple truncation - keep first N characters
  const maxChars = maxTokens * 4;
  return context.substring(0, maxChars) + '\n\n[Context truncated for length]';
}
