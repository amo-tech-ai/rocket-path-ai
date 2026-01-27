/**
 * Pitch Deck Wizard Schemas
 * Zod validation for wizard steps and JSONB structures
 */

import { z } from 'zod';

// ============================================================================
// Industry Options
// ============================================================================

export const INDUSTRIES = [
  { value: 'ai_saas', label: 'AI / SaaS', icon: 'Sparkles' },
  { value: 'fintech', label: 'FinTech', icon: 'DollarSign' },
  { value: 'healthcare', label: 'Healthcare', icon: 'Heart' },
  { value: 'edtech', label: 'EdTech', icon: 'GraduationCap' },
  { value: 'ecommerce', label: 'E-Commerce', icon: 'ShoppingCart' },
  { value: 'marketplace', label: 'Marketplace', icon: 'Store' },
  { value: 'enterprise', label: 'Enterprise', icon: 'Building2' },
  { value: 'consumer', label: 'Consumer', icon: 'Users' },
  { value: 'climate', label: 'Climate', icon: 'Leaf' },
  { value: 'proptech', label: 'PropTech', icon: 'Home' },
  { value: 'logistics', label: 'Logistics', icon: 'Truck' },
  { value: 'media', label: 'Media', icon: 'Video' },
  { value: 'other', label: 'Other', icon: 'Briefcase' },
] as const;

export const FUNDING_STAGES = [
  { value: 'pre_seed', label: 'Pre-Seed', slides: '8-10' },
  { value: 'seed', label: 'Seed', slides: '10-12' },
  { value: 'series_a', label: 'Series A', slides: '12-15' },
] as const;

export const DECK_TYPES = [
  { value: 'pre_seed', label: 'Pre-Seed', description: '8-10 slides, focus on vision' },
  { value: 'seed', label: 'Seed', description: '10-12 slides, emphasis on traction' },
  { value: 'demo_day', label: 'Demo Day', description: '6-8 slides, high impact' },
] as const;

export const TONES = [
  { value: 'clear', label: 'Clear', description: 'Direct and straightforward' },
  { value: 'confident', label: 'Confident', description: 'Bold and assertive' },
  { value: 'conservative', label: 'Conservative', description: 'Measured and cautious' },
] as const;

// ============================================================================
// Step 1: Startup Info Schema
// ============================================================================

export const step1Schema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  website_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  tagline: z.string().max(120, 'Pitch must be under 120 characters').optional(),
  industry: z.string().min(1, 'Industry is required'),
  sub_category: z.string().optional(),
  stage: z.enum(['pre_seed', 'seed', 'series_a', 'series_b']).optional(),
  ai_investor_summary: z.string().optional(),
});

export type Step1Data = z.infer<typeof step1Schema>;

// ============================================================================
// Step 2: Market & Traction Schema
// ============================================================================

export const step2Schema = z.object({
  problem: z.string().min(10, 'Describe the problem clearly'),
  core_solution: z.string().min(10, 'Describe your solution'),
  differentiator: z.string().min(10, 'What makes you different?'),
  users: z.number().optional(),
  revenue: z.number().optional(),
  growth_rate: z.string().optional(),
  funding_stage: z.enum(['pre_seed', 'seed', 'series_a']),
});

export type Step2Data = z.infer<typeof step2Schema>;

// ============================================================================
// Step 3: Smart Interview Schema
// ============================================================================

export const interviewQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  response: z.string().optional(),
  category: z.enum(['market', 'traction', 'competition', 'team', 'financials', 'product']),
  source: z.enum(['industry', 'gap_analysis', 'url_context', 'search']),
  slide_mapping: z.string().optional(),
  skipped: z.boolean().default(false),
});

export const step3Schema = z.object({
  questions: z.array(interviewQuestionSchema).default([]),
  research_context: z.object({
    industry_insights: z.array(z.string()).optional(),
    url_extracted_data: z.record(z.unknown()).optional(),
    competitor_mentions: z.array(z.string()).optional(),
    market_data: z.record(z.unknown()).optional(),
  }).optional(),
  questions_answered: z.number().default(0),
  questions_total: z.number().default(0),
});

export type Step3Data = z.infer<typeof step3Schema>;
export type InterviewQuestion = z.infer<typeof interviewQuestionSchema>;

// ============================================================================
// Step 4: Review Schema
// ============================================================================

export const step4Schema = z.object({
  deck_type: z.enum(['pre_seed', 'seed', 'demo_day']),
  tone: z.enum(['clear', 'confident', 'conservative']).default('clear'),
  signal_strength: z.number().min(0).max(100).optional(),
  signal_breakdown: z.object({
    profile: z.number().min(0).max(100).default(0),
    market: z.number().min(0).max(100).default(0),
    smart_interview: z.number().min(0).max(100).default(0),
    suggestions: z.number().min(0).max(100).default(0),
    slides: z.number().min(0).max(100).default(0),
    industry: z.number().min(0).max(100).default(0),
  }).optional(),
});

export type Step4Data = z.infer<typeof step4Schema>;

// ============================================================================
// Complete Wizard Data Schema
// ============================================================================

export const wizardDataSchema = z.object({
  step1_startup_info: step1Schema.optional(),
  step2_market_traction: step2Schema.optional(),
  step3_smart_interview: step3Schema.optional(),
  step4_review: step4Schema.optional(),
  selected_industry: z.string().optional(),
  template_selected: z.string().optional(),
  updated_at: z.string().optional(),
});

export type WizardData = z.infer<typeof wizardDataSchema>;

// ============================================================================
// Pitch Deck Metadata Schema
// ============================================================================

export const pitchDeckMetadataSchema = z.object({
  wizard_data: wizardDataSchema.optional(),
  generation_logs: z.array(z.object({
    id: z.string(),
    generation_status: z.enum(['in_progress', 'completed', 'failed']),
    started_at: z.string(),
    completed_at: z.string().optional(),
    duration_seconds: z.number().optional(),
    slide_count_generated: z.number().optional(),
    error_message: z.string().optional(),
  })).optional(),
});

export type PitchDeckMetadata = z.infer<typeof pitchDeckMetadataSchema>;

// ============================================================================
// Utility Functions
// ============================================================================

export function calculateSignalStrength(wizardData: WizardData): number {
  let score = 0;
  const breakdown = {
    profile: 0,
    market: 0,
    smart_interview: 0,
    suggestions: 0,
    slides: 0,
    industry: 0,
  };

  // Profile (20% weight)
  const step1 = wizardData.step1_startup_info;
  if (step1?.company_name) breakdown.profile += 30;
  if (step1?.website_url) breakdown.profile += 20;
  if (step1?.tagline) breakdown.profile += 30;
  if (step1?.industry) breakdown.profile += 20;

  // Market (20% weight)
  const step2 = wizardData.step2_market_traction;
  if (step2?.problem) breakdown.market += 30;
  if (step2?.core_solution) breakdown.market += 30;
  if (step2?.differentiator) breakdown.market += 20;
  if (step2?.users || step2?.revenue) breakdown.market += 20;

  // Smart Interview (25% weight)
  const step3 = wizardData.step3_smart_interview;
  if (step3?.questions_answered && step3?.questions_total) {
    breakdown.smart_interview = Math.round((step3.questions_answered / step3.questions_total) * 100);
  }

  // Industry specificity (10% weight)
  if (wizardData.selected_industry && wizardData.selected_industry !== 'other') {
    breakdown.industry = 100;
  }

  // Calculate weighted average
  score = Math.round(
    (breakdown.profile * 0.2) +
    (breakdown.market * 0.2) +
    (breakdown.smart_interview * 0.25) +
    (breakdown.suggestions * 0.15) +
    (breakdown.slides * 0.1) +
    (breakdown.industry * 0.1)
  );

  return Math.min(100, Math.max(0, score));
}

export function getIndustryLabel(value: string): string {
  return INDUSTRIES.find(i => i.value === value)?.label || value;
}

export function getFundingStageLabel(value: string): string {
  return FUNDING_STAGES.find(s => s.value === value)?.label || value;
}
