---
task_number: "20"
title: "Industry Playbook Edge Functions Strategy"
category: "Supabase"
subcategory: "Edge Functions"
phase: 2
priority: "P1"
status: "Complete"
percent_complete: 100
owner: "Backend Developer"
---

# Industry Playbook Edge Functions Strategy

**Version:** 1.0
**Date:** 2026-01-29
**Status:** Implementation Ready

---

## Executive Summary

This document defines the strategy for implementing AI agent expertise injection via Supabase Edge Functions. The system loads industry-specific playbooks and injects relevant knowledge into AI prompts based on feature context.

**Goal:** Make every AI agent an industry expert by injecting relevant benchmarks, failure patterns, investor questions, GTM patterns, and decision frameworks.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         REQUEST FLOW                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Client Request                                                          │
│       │                                                                  │
│       ▼                                                                  │
│  ┌─────────────┐    ┌─────────────────┐    ┌──────────────────────┐    │
│  │ Edge Func   │───▶│ Industry Context │───▶│ AI Model (Gemini/   │    │
│  │ (ai-chat,   │    │ Loader           │    │ Claude)              │    │
│  │ onboarding, │    │                  │    │                      │    │
│  │ lean-canvas,│    │ • Load playbook  │    │ • Receives enriched  │    │
│  │ pitch-deck) │    │ • Filter by      │    │   system prompt      │    │
│  └─────────────┘    │   feature        │    │ • Industry-expert    │    │
│                     │ • Format for     │    │   responses          │    │
│                     │   injection      │    │                      │    │
│                     └─────────────────┘    └──────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema Updates

### New Table: `industry_playbooks`

Stores the 10 knowledge categories for each industry.

```sql
-- Migration: 20260129_create_industry_playbooks.sql

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for funding stages
CREATE TYPE funding_stage AS ENUM (
  'pre_seed',
  'seed',
  'series_a',
  'series_b',
  'growth'
);

-- Create enum for feature contexts
CREATE TYPE feature_context AS ENUM (
  'onboarding',
  'lean_canvas',
  'pitch_deck',
  'tasks',
  'chatbot',
  'validator',
  'gtm_planning',
  'fundraising'
);

-- Main playbook table
CREATE TABLE industry_playbooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identity
  industry_id TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  narrative_arc TEXT,

  -- 10 Knowledge Categories (JSONB for flexibility)
  investor_expectations JSONB NOT NULL DEFAULT '{}',
  failure_patterns JSONB NOT NULL DEFAULT '[]',
  success_stories JSONB NOT NULL DEFAULT '[]',
  benchmarks JSONB NOT NULL DEFAULT '[]',
  terminology JSONB NOT NULL DEFAULT '{}',
  gtm_patterns JSONB NOT NULL DEFAULT '[]',
  decision_frameworks JSONB NOT NULL DEFAULT '[]',
  investor_questions JSONB NOT NULL DEFAULT '[]',
  warning_signs JSONB NOT NULL DEFAULT '[]',
  stage_checklists JSONB NOT NULL DEFAULT '[]',

  -- Pitch-specific
  slide_emphasis JSONB DEFAULT '[]',

  -- Metadata
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup
CREATE INDEX idx_industry_playbooks_industry_id ON industry_playbooks(industry_id);
CREATE INDEX idx_industry_playbooks_active ON industry_playbooks(is_active) WHERE is_active = true;

-- Context injection mapping table
CREATE TABLE context_injection_map (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feature_context feature_context NOT NULL,
  knowledge_categories TEXT[] NOT NULL,
  prompt_template TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed the context injection mapping
INSERT INTO context_injection_map (feature_context, knowledge_categories, description) VALUES
  ('onboarding', ARRAY['failure_patterns', 'terminology'], 'Early warnings and industry language'),
  ('lean_canvas', ARRAY['gtm_patterns', 'benchmarks'], 'Go-to-market strategies and KPIs'),
  ('pitch_deck', ARRAY['investor_expectations', 'success_stories', 'failure_patterns', 'investor_questions', 'warning_signs'], 'Investor-focused knowledge'),
  ('tasks', ARRAY['gtm_patterns', 'failure_patterns', 'stage_checklists', 'decision_frameworks'], 'Planning and execution guidance'),
  ('chatbot', ARRAY['investor_expectations', 'failure_patterns', 'success_stories', 'benchmarks', 'terminology', 'gtm_patterns', 'decision_frameworks', 'investor_questions', 'warning_signs', 'stage_checklists'], 'Full expert mode'),
  ('validator', ARRAY['benchmarks', 'warning_signs', 'failure_patterns'], 'Validation criteria'),
  ('gtm_planning', ARRAY['gtm_patterns', 'failure_patterns', 'decision_frameworks'], 'Go-to-market planning'),
  ('fundraising', ARRAY['investor_expectations', 'investor_questions', 'stage_checklists', 'warning_signs'], 'Fundraising guidance');

-- RLS Policies (public read, admin write)
ALTER TABLE industry_playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_injection_map ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON industry_playbooks
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin write access" ON industry_playbooks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Public read access" ON context_injection_map
  FOR SELECT USING (true);

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_industry_playbooks_updated_at
  BEFORE UPDATE ON industry_playbooks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### JSONB Schema Definitions

```typescript
// investor_expectations structure (per stage)
interface InvestorExpectations {
  pre_seed: {
    focus: string[];
    metrics: string[];
    deal_breakers: string[];
  };
  seed: {
    focus: string[];
    metrics: string[];
    deal_breakers: string[];
  };
  series_a: {
    focus: string[];
    metrics: string[];
    deal_breakers: string[];
  };
}

// failure_patterns structure
interface FailurePattern {
  id: string;
  pattern: string;
  why_fatal: string;
  early_warning: string;
  how_to_avoid: string;
}

// success_stories structure
interface SuccessStory {
  id: string;
  archetype: string;
  pattern: string;
  key_moves: string[];
  outcome_signal: string;
}

// benchmarks structure
interface BenchmarkMetric {
  metric: string;
  good: string;
  great: string;
  stage: string;
  source: string;
}

// terminology structure
interface IndustryTerminology {
  use_phrases: string[];
  avoid_phrases: string[];
  investor_vocabulary: string[];
}

// gtm_patterns structure
interface GTMPattern {
  id: string;
  name: string;
  description: string;
  stages: string[];
  channels: string[];
  timeline: string;
  best_for: string;
}

// decision_frameworks structure
interface DecisionFramework {
  id: string;
  decision: string;
  rows: {
    if_condition: string;
    then_action: string;
    because: string;
  }[];
}

// investor_questions structure
interface InvestorQuestion {
  category: string;
  question: string;
  good_answer: string;
  bad_answer: string;
  follow_up: string;
}

// warning_signs structure
interface WarningSign {
  signal: string;
  trigger: string;
  action: string;
  severity: 'critical' | 'warning';
}

// stage_checklists structure
interface StageChecklist {
  stage: string;
  tasks: {
    task: string;
    why: string;
    how: string;
    time: string;
    cost: string;
  }[];
}

// slide_emphasis structure
interface SlideEmphasis {
  slide: string;
  weight: 'critical' | 'important' | 'standard';
  guidance: string;
}
```

---

## Shared Utility: `industry-context.ts`

Location: `supabase/functions/_shared/industry-context.ts`

```typescript
import { createClient } from 'npm:@supabase/supabase-js@2';

// Types
export interface IndustryPlaybook {
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

// Context injection mapping
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

// Cache for playbooks (per-instance)
const playbookCache = new Map<string, { data: IndustryPlaybook; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Load a playbook from database with caching
 */
export async function loadPlaybook(
  industryId: string,
  supabase?: ReturnType<typeof createClient>
): Promise<IndustryPlaybook | null> {
  // Check cache
  const cached = playbookCache.get(industryId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // Create client if not provided
  const client = supabase || createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!
  );

  const { data, error } = await client
    .from('industry_playbooks')
    .select('*')
    .eq('industry_id', industryId)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    console.error(`Failed to load playbook for ${industryId}:`, error);
    return null;
  }

  // Cache the result
  playbookCache.set(industryId, { data: data as IndustryPlaybook, timestamp: Date.now() });

  return data as IndustryPlaybook;
}

/**
 * Get filtered industry context for a specific feature
 */
export async function getIndustryContext(
  industryId: string,
  featureContext: FeatureContext,
  stage?: FundingStage,
  supabase?: ReturnType<typeof createClient>
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
    if (playbook[category]) {
      (filteredContext as any)[category] = playbook[category];
    }
  }

  // Filter stage-specific content if stage provided
  if (stage && filteredContext.investor_expectations) {
    filteredContext.investor_expectations = {
      [stage]: (filteredContext.investor_expectations as any)[stage]
    } as any;
  }

  if (stage && filteredContext.stage_checklists) {
    filteredContext.stage_checklists = (filteredContext.stage_checklists as StageChecklist[])
      .filter(c => c.stage.toLowerCase().includes(stage.replace('_', '-')) || c.stage.toLowerCase().includes(stage.replace('_', ' ')));
  }

  return filteredContext;
}

/**
 * Format industry context for prompt injection
 */
export function formatContextForPrompt(
  context: Partial<IndustryPlaybook>,
  featureContext: FeatureContext
): string {
  const sections: string[] = [];

  sections.push(`## INDUSTRY CONTEXT: ${context.display_name}`);

  if (context.narrative_arc) {
    sections.push(`\nNarrative: ${context.narrative_arc}`);
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

// Formatting helpers
function formatOnboardingContext(ctx: Partial<IndustryPlaybook>): string {
  const parts: string[] = [];

  if (ctx.failure_patterns?.length) {
    parts.push('\n### Common Mistakes to Warn About:');
    ctx.failure_patterns.slice(0, 3).forEach(fp => {
      parts.push(`- **${fp.pattern}**: ${fp.early_warning}`);
    });
  }

  if (ctx.terminology) {
    parts.push('\n### Industry Language:');
    parts.push(`- Use: ${ctx.terminology.use_phrases?.slice(0, 5).join(', ')}`);
    parts.push(`- Avoid: ${ctx.terminology.avoid_phrases?.slice(0, 3).join(', ')}`);
  }

  return parts.join('\n');
}

function formatLeanCanvasContext(ctx: Partial<IndustryPlaybook>): string {
  const parts: string[] = [];

  if (ctx.gtm_patterns?.length) {
    parts.push('\n### Proven GTM Strategies:');
    ctx.gtm_patterns.slice(0, 3).forEach(gp => {
      parts.push(`- **${gp.name}**: ${gp.description} (Best for: ${gp.best_for})`);
    });
  }

  if (ctx.benchmarks?.length) {
    parts.push('\n### Key Benchmarks:');
    ctx.benchmarks.slice(0, 5).forEach(b => {
      parts.push(`- ${b.metric}: Good=${b.good}, Great=${b.great}`);
    });
  }

  return parts.join('\n');
}

function formatPitchDeckContext(ctx: Partial<IndustryPlaybook>): string {
  const parts: string[] = [];

  if (ctx.investor_expectations) {
    parts.push('\n### Investor Expectations:');
    Object.entries(ctx.investor_expectations).forEach(([stage, exp]) => {
      if (exp && typeof exp === 'object') {
        parts.push(`\n**${stage.toUpperCase()}:**`);
        if ((exp as any).focus) parts.push(`- Focus: ${(exp as any).focus.join(', ')}`);
        if ((exp as any).metrics) parts.push(`- Metrics: ${(exp as any).metrics.join(', ')}`);
        if ((exp as any).deal_breakers) parts.push(`- Deal Breakers: ${(exp as any).deal_breakers.join(', ')}`);
      }
    });
  }

  if (ctx.investor_questions?.length) {
    parts.push('\n### Key Investor Questions:');
    ctx.investor_questions.slice(0, 5).forEach(q => {
      parts.push(`\n**Q: "${q.question}"**`);
      parts.push(`- Good: "${q.good_answer.substring(0, 150)}..."`);
      parts.push(`- Avoid: "${q.bad_answer}"`);
    });
  }

  if (ctx.warning_signs?.length) {
    parts.push('\n### Red Flags to Avoid:');
    ctx.warning_signs.filter(w => w.severity === 'critical').slice(0, 3).forEach(w => {
      parts.push(`- ${w.signal}: ${w.trigger}`);
    });
  }

  if (ctx.slide_emphasis?.length) {
    parts.push('\n### Slide Priorities:');
    ctx.slide_emphasis.forEach(s => {
      parts.push(`- ${s.slide} (${s.weight}): ${s.guidance}`);
    });
  }

  return parts.join('\n');
}

function formatTasksContext(ctx: Partial<IndustryPlaybook>): string {
  const parts: string[] = [];

  if (ctx.stage_checklists?.length) {
    parts.push('\n### Stage Checklist:');
    ctx.stage_checklists.forEach(sc => {
      parts.push(`\n**${sc.stage}:**`);
      sc.tasks.slice(0, 5).forEach(t => {
        parts.push(`- ${t.task} (${t.time}, ${t.cost}): ${t.why}`);
      });
    });
  }

  if (ctx.decision_frameworks?.length) {
    parts.push('\n### Decision Frameworks:');
    ctx.decision_frameworks.slice(0, 2).forEach(df => {
      parts.push(`\n**${df.decision}:**`);
      df.rows.slice(0, 3).forEach(r => {
        parts.push(`- If ${r.if_condition} → ${r.then_action}`);
      });
    });
  }

  if (ctx.failure_patterns?.length) {
    parts.push('\n### Avoid These Mistakes:');
    ctx.failure_patterns.slice(0, 3).forEach(fp => {
      parts.push(`- ${fp.pattern}: ${fp.how_to_avoid}`);
    });
  }

  return parts.join('\n');
}

function formatValidatorContext(ctx: Partial<IndustryPlaybook>): string {
  const parts: string[] = [];

  if (ctx.benchmarks?.length) {
    parts.push('\n### Validation Benchmarks:');
    ctx.benchmarks.forEach(b => {
      parts.push(`- ${b.metric}: Good=${b.good}, Great=${b.great} (${b.stage})`);
    });
  }

  if (ctx.warning_signs?.length) {
    parts.push('\n### Warning Signs:');
    ctx.warning_signs.forEach(w => {
      parts.push(`- [${w.severity.toUpperCase()}] ${w.signal}: ${w.trigger} → ${w.action}`);
    });
  }

  return parts.join('\n');
}

function formatGTMContext(ctx: Partial<IndustryPlaybook>): string {
  const parts: string[] = [];

  if (ctx.gtm_patterns?.length) {
    parts.push('\n### GTM Strategies:');
    ctx.gtm_patterns.forEach(gp => {
      parts.push(`\n**${gp.name}** (${gp.stages.join(', ')})`);
      parts.push(`${gp.description}`);
      parts.push(`- Channels: ${gp.channels.join(', ')}`);
      parts.push(`- Timeline: ${gp.timeline}`);
      parts.push(`- Best for: ${gp.best_for}`);
    });
  }

  if (ctx.decision_frameworks?.length) {
    parts.push('\n### Decision Frameworks:');
    ctx.decision_frameworks.forEach(df => {
      parts.push(`\n**${df.decision}:**`);
      df.rows.forEach(r => {
        parts.push(`- If ${r.if_condition} → ${r.then_action} (${r.because})`);
      });
    });
  }

  return parts.join('\n');
}

function formatFundraisingContext(ctx: Partial<IndustryPlaybook>): string {
  const parts: string[] = [];

  if (ctx.investor_expectations) {
    parts.push('\n### Stage Expectations:');
    Object.entries(ctx.investor_expectations).forEach(([stage, exp]) => {
      if (exp && typeof exp === 'object') {
        parts.push(`\n**${stage.toUpperCase()}:**`);
        if ((exp as any).focus) parts.push(`- Focus: ${(exp as any).focus.join(', ')}`);
        if ((exp as any).metrics) parts.push(`- Key Metrics: ${(exp as any).metrics.join(', ')}`);
        if ((exp as any).deal_breakers) parts.push(`- Deal Breakers: ${(exp as any).deal_breakers.join(', ')}`);
      }
    });
  }

  if (ctx.investor_questions?.length) {
    parts.push('\n### Prepare for These Questions:');
    ctx.investor_questions.forEach(q => {
      parts.push(`\n**"${q.question}"**`);
      parts.push(`✓ Good: ${q.good_answer.substring(0, 200)}...`);
      parts.push(`✗ Bad: ${q.bad_answer}`);
      if (q.follow_up) parts.push(`↳ Follow-up: ${q.follow_up}`);
    });
  }

  if (ctx.stage_checklists?.length) {
    parts.push('\n### Pre-Raise Checklist:');
    ctx.stage_checklists.forEach(sc => {
      parts.push(`\n**Before ${sc.stage}:**`);
      sc.tasks.forEach(t => {
        parts.push(`☐ ${t.task} — ${t.why} (${t.time})`);
      });
    });
  }

  return parts.join('\n');
}

function formatFullContext(ctx: Partial<IndustryPlaybook>): string {
  // Chatbot gets everything - combine all formatters
  return [
    formatOnboardingContext(ctx),
    formatLeanCanvasContext(ctx),
    formatPitchDeckContext(ctx),
    formatTasksContext(ctx),
    formatFundraisingContext(ctx)
  ].join('\n');
}

/**
 * Get all available industries
 */
export async function listIndustries(
  supabase?: ReturnType<typeof createClient>
): Promise<{ industry_id: string; display_name: string }[]> {
  const client = supabase || createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!
  );

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
```

---

## Edge Function Integration

### Updated `ai-chat/index.ts` Pattern

```typescript
import { getIndustryContext, formatContextForPrompt } from '../_shared/industry-context.ts';

// In the handler, after getting startup context:
async function buildEnrichedSystemPrompt(
  action: string,
  startup: StartupContext,
  featureContext: FeatureContext
): Promise<string> {
  const basePrompt = buildSystemPrompt(action, startup);

  // Load industry context if startup has industry
  if (startup.industry) {
    const industryContext = await getIndustryContext(
      startup.industry,
      featureContext,
      startup.stage as FundingStage
    );

    if (industryContext) {
      const contextBlock = formatContextForPrompt(industryContext, featureContext);
      return `${basePrompt}\n\n${contextBlock}`;
    }
  }

  return basePrompt;
}

// Usage in handler:
const systemPrompt = await buildEnrichedSystemPrompt(
  action,
  startupContext,
  mapActionToFeatureContext(action) // 'extract_profile' -> 'onboarding', etc.
);
```

### Action to Feature Context Mapping

```typescript
function mapActionToFeatureContext(action: string): FeatureContext {
  const mapping: Record<string, FeatureContext> = {
    // Onboarding actions
    'extract_profile': 'onboarding',
    'enrich_url': 'onboarding',
    'wizard_extract_startup': 'onboarding',
    'wizard_calculate_readiness': 'onboarding',

    // Lean canvas actions
    'generate_canvas': 'lean_canvas',
    'validate_canvas': 'lean_canvas',
    'improve_canvas_section': 'lean_canvas',

    // Pitch deck actions
    'generate_pitch_deck': 'pitch_deck',
    'generate_slide': 'pitch_deck',
    'improve_slide': 'pitch_deck',

    // Task actions
    'generate_tasks': 'tasks',
    'prioritize_tasks': 'tasks',

    // Chat actions
    'chat': 'chatbot',
    'quick_chat': 'chatbot',

    // Validation actions
    'validate_idea': 'validator',
    'calculate_readiness': 'validator',

    // GTM actions
    'generate_gtm_strategy': 'gtm_planning',

    // Fundraising actions
    'prepare_fundraising': 'fundraising',
    'investor_matching': 'fundraising'
  };

  return mapping[action] || 'chatbot';
}
```

---

## Seed Data Script

Create a script to load playbooks from markdown files into the database.

Location: `supabase/functions/seed-playbooks/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

// Playbook data structure matching the markdown files
const PLAYBOOKS = [
  {
    industry_id: 'ai_saas',
    display_name: 'AI SaaS / B2B',
    // ... parsed from ai-saas.md
  },
  {
    industry_id: 'fintech',
    display_name: 'FinTech',
    // ... parsed from fintech.md
  },
  // ... 17 more industries
];

serve(async (req) => {
  // Admin-only endpoint
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Upsert all playbooks
  const results = [];
  for (const playbook of PLAYBOOKS) {
    const { data, error } = await supabase
      .from('industry_playbooks')
      .upsert(playbook, { onConflict: 'industry_id' })
      .select();

    results.push({ industry_id: playbook.industry_id, success: !error, error });
  }

  return new Response(JSON.stringify({ results }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

---

## Phased Implementation Plan

---

### PHASE 1: CORE MVP
**Duration:** 3-5 days
**Goal:** Basic industry context injection working for 1 feature

#### Milestone 1.1: Database Foundation
**Deliverables:**
- [ ] Create migration `20260129_create_industry_playbooks.sql`
- [ ] Create `context_injection_map` table
- [ ] Run migration locally and verify
- [ ] Create TypeScript types in `src/integrations/supabase/types.ts`

**Exit Criteria:** Tables exist, can insert/query playbook data

#### Milestone 1.2: Shared Utility
**Deliverables:**
- [ ] Create `_shared/industry-context.ts`
- [ ] Implement `loadPlaybook()` with basic caching
- [ ] Implement `getIndustryContext()` with filtering
- [ ] Implement `formatContextForPrompt()` for one context (onboarding)
- [ ] Unit test utility functions

**Exit Criteria:** Can load playbook and format context string

#### Milestone 1.3: Seed 5 Core Industries
**Deliverables:**
- [ ] Parse 5 playbooks: `ai-saas`, `fintech`, `healthcare`, `ecommerce-pure`, `saas-marketing`
- [ ] Create JSON seed files
- [ ] Seed to database
- [ ] Verify all 10 categories populated

**Exit Criteria:** 5 industries with complete data in database

#### Milestone 1.4: First Integration (Onboarding)
**Deliverables:**
- [ ] Update `onboarding-agent` to call `getIndustryContext()`
- [ ] Inject context into system prompt
- [ ] Test with real onboarding flow
- [ ] Log context injection in `ai_runs`

**Exit Criteria:** Onboarding AI responses include industry-specific guidance

**Phase 1 Gate:** Demo onboarding with FinTech industry showing industry-specific failure patterns and terminology

---

### PHASE 2: ADVANCED
**Duration:** 5-7 days
**Goal:** All features using context injection, all 19 industries seeded

#### Milestone 2.1: Complete Industry Seeding
**Deliverables:**
- [ ] Parse remaining 14 playbooks to JSON
- [ ] Create seed-playbooks edge function
- [ ] Seed all 19 industries
- [ ] Data validation script

**Exit Criteria:** 19 industries with complete data, validation passing

#### Milestone 2.2: Feature-Specific Formatters
**Deliverables:**
- [ ] `formatLeanCanvasContext()` - GTM patterns, benchmarks
- [ ] `formatPitchDeckContext()` - Investor expectations, questions, warnings
- [ ] `formatTasksContext()` - Stage checklists, decision frameworks
- [ ] `formatValidatorContext()` - Benchmarks, warning signs
- [ ] `formatChatbotContext()` - Full expert mode (all categories)

**Exit Criteria:** Each feature context has optimized formatting

#### Milestone 2.3: Edge Function Integration
**Deliverables:**
- [ ] Update `ai-chat` with action-to-context mapping
- [ ] Update `lean-canvas-agent` to inject context
- [ ] Update `pitch-deck-agent` to inject context
- [ ] Create `mapActionToFeatureContext()` utility
- [ ] Add feature_context column to `ai_runs` for tracking

**Exit Criteria:** All AI agents receive industry context

#### Milestone 2.4: Stage-Specific Filtering
**Deliverables:**
- [ ] Filter `investor_expectations` by stage
- [ ] Filter `stage_checklists` by stage
- [ ] Pass stage from startup to context loader
- [ ] Test stage-specific outputs

**Exit Criteria:** Pre-seed startup gets different guidance than Series A

**Phase 2 Gate:** Demo all 5 features with different industries showing contextual AI responses

---

### PHASE 3: PRODUCTION
**Duration:** 3-5 days
**Goal:** Production-ready with monitoring, caching, error handling

#### Milestone 3.1: Performance Optimization
**Deliverables:**
- [ ] Implement Redis/KV caching (if available) or optimize in-memory cache
- [ ] Add cache warming on function cold start
- [ ] Measure and optimize context load time (<50ms p95)
- [ ] Lazy-load large context sections

**Exit Criteria:** Context loading adds <100ms to AI calls

#### Milestone 3.2: Error Handling & Fallbacks
**Deliverables:**
- [ ] Graceful fallback when playbook not found
- [ ] Default "general" playbook for unknown industries
- [ ] Error logging with context
- [ ] Retry logic for database failures

**Exit Criteria:** No user-facing errors from context loading

#### Milestone 3.3: Monitoring & Analytics
**Deliverables:**
- [ ] Log industry usage in `ai_runs.metadata`
- [ ] Create dashboard query for industry usage stats
- [ ] Track context size and token impact
- [ ] Alert on cache miss rate >30%

**Exit Criteria:** Can measure industry context usage and performance

#### Milestone 3.4: Quality Assurance
**Deliverables:**
- [ ] A/B test AI responses with/without context
- [ ] User feedback collection on response quality
- [ ] Manual review of 50+ AI responses per industry
- [ ] Document quality improvements

**Exit Criteria:** Measurable improvement in AI response relevance

#### Milestone 3.5: Documentation & Handoff
**Deliverables:**
- [ ] API documentation for industry context
- [ ] Playbook authoring guide (how to add new industries)
- [ ] Operations runbook (troubleshooting)
- [ ] Update CLAUDE.md with new patterns

**Exit Criteria:** Team can maintain and extend system

**Phase 3 Gate:** Production deployment with monitoring, <1% error rate, >20% quality improvement documented

---

### PHASE 4: EXPANSION (Future)
**Duration:** Ongoing
**Goal:** Continuous improvement and expansion

#### Milestone 4.1: Dynamic Playbook Updates
- [ ] Admin UI for playbook editing
- [ ] Version history and rollback
- [ ] A/B testing different playbook content

#### Milestone 4.2: User Feedback Loop
- [ ] "Was this helpful?" on AI responses
- [ ] Track which advice gets followed
- [ ] Auto-improve playbooks from feedback

#### Milestone 4.3: New Industries
- [ ] Playbook template generator
- [ ] Research pipeline for new industries
- [ ] Community-contributed playbooks

#### Milestone 4.4: Advanced Context
- [ ] Competitor-specific context
- [ ] Market-specific context (US vs EU vs APAC)
- [ ] Investor-specific context (which VC is meeting)

---

## Implementation Timeline

```
Week 1: Phase 1 (Core MVP)
├── Day 1-2: Milestones 1.1, 1.2 (Schema + Utility)
├── Day 3: Milestone 1.3 (Seed 5 industries)
└── Day 4-5: Milestone 1.4 (First integration)

Week 2: Phase 2 (Advanced)
├── Day 1-2: Milestones 2.1, 2.2 (Complete seeding + formatters)
├── Day 3-4: Milestone 2.3 (Edge function integration)
└── Day 5: Milestone 2.4 (Stage filtering)

Week 3: Phase 3 (Production)
├── Day 1-2: Milestones 3.1, 3.2 (Performance + errors)
├── Day 3: Milestone 3.3 (Monitoring)
└── Day 4-5: Milestones 3.4, 3.5 (QA + docs)
```

---

## Phase Gate Checklist

### Phase 1 → Phase 2
- [ ] Database schema deployed
- [ ] 5 industries seeded with complete data
- [ ] Onboarding agent using industry context
- [ ] Demo showing industry-specific AI guidance

### Phase 2 → Phase 3
- [ ] All 19 industries seeded
- [ ] All 5 feature contexts working
- [ ] Stage-specific filtering working
- [ ] No blocking bugs

### Phase 3 → Production
- [ ] <100ms context load time
- [ ] <1% error rate
- [ ] Monitoring dashboard live
- [ ] Documentation complete
- [ ] Quality improvement measured

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Context Load Time | <100ms | P95 latency |
| AI Response Quality | +20% relevance | User feedback |
| Industry-specific answers | 90%+ | Manual review |
| Cache Hit Rate | >80% | Cache metrics |
| Error Rate | <1% | Error logs |

---

## Security Considerations

1. **RLS Enforcement**: Playbooks are public read, admin write
2. **Input Validation**: Industry IDs validated against enum
3. **Output Sanitization**: Context formatted, not raw user data
4. **Rate Limiting**: Same as other AI endpoints
5. **Caching**: Per-instance cache, no cross-tenant leakage

---

## Related Documents

| Document | Path |
|----------|------|
| Playbooks Index | `tasks/00-plan/industry/playbooks/00-playbooks-index.md` |
| Schema Definition | `tasks/00-plan/prompts/10-enriched-playbooks-schema.md` |
| Context Injection Map | `tasks/00-plan/prompts/11-context-injection-map.md` |
| Design Document | `docs/plans/2026-01-29-ai-agent-expertise-design.md` |
