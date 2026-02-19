/**
 * Prompt Pack Utilities
 *
 * Shared utilities for prompt pack operations:
 * - Template interpolation
 * - Output validation
 * - Startup context extraction
 * - Cost calculation
 */

import { SupabaseClient } from 'jsr:@supabase/supabase-js@2';

// =============================================================================
// Type Definitions
// =============================================================================

export interface PromptPack {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  stage_tags: string[];
  industry_tags: string[];
  version: number;
  is_active: boolean;
  source: string;
  metadata: Record<string, unknown>;
}

export interface PromptStep {
  id: string;
  pack_id: string;
  step_order: number;
  purpose: string;
  prompt_template: string;
  input_schema: Record<string, unknown>;
  output_schema: Record<string, unknown>;
  model_preference: 'gemini' | 'claude' | 'claude-sonnet' | 'auto';
  max_tokens: number;
  temperature: number;
}

export interface PromptRun {
  id: string;
  startup_id: string | null;
  user_id: string | null;
  pack_id: string | null;
  step_id: string | null;
  inputs_json: Record<string, unknown>;
  outputs_json: Record<string, unknown> | null;
  model_used: string | null;
  tokens_input: number | null;
  tokens_output: number | null;
  cost_usd: number | null;
  latency_ms: number | null;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  error_message: string | null;
}

export interface StartupContext {
  startup_name: string;
  company_name: string;
  description: string;
  one_liner: string;
  industry: string;
  stage: string;
  target_customer: string;
  target_market: string;
  problem_statement: string;
  solution_description: string;
  uvp: string;
  founder_name: string;
  founder_email: string;
  [key: string]: unknown;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// =============================================================================
// Template Interpolation
// =============================================================================

/**
 * Interpolate variables in a prompt template
 *
 * Supports:
 * - {{variable}} - Simple replacement
 * - {{object.property}} - Nested property access
 * - {{array[0]}} - Array index access
 * - {{previous_output}} - Previous step output
 * - {{step_1_output}} - Specific step output
 *
 * @param template - Prompt template with {{variable}} placeholders
 * @param variables - Object containing variable values
 * @returns Interpolated prompt string
 */
export function interpolatePrompt(
  template: string,
  variables: Record<string, unknown>
): string {
  let result = template;

  // Replace {{variable.nested.path}} patterns
  const nestedPattern = /\{\{([^}]+)\}\}/g;

  result = result.replace(nestedPattern, (match, path) => {
    const value = getNestedValue(variables, path.trim());

    if (value === undefined || value === null) {
      return ''; // Remove unmatched variables
    }

    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }

    return String(value);
  });

  return result;
}

/**
 * Get nested value from object using dot notation or bracket notation
 *
 * @param obj - Object to extract value from
 * @param path - Path like "object.property" or "array[0].field"
 * @returns The value at the path, or undefined
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  // Sanitize: only allow alphanumeric, underscores, dots, brackets with digits
  if (!/^[a-zA-Z0-9_]+([.\[][a-zA-Z0-9_\]]*)*$/.test(path)) {
    return undefined;
  }

  // Block prototype pollution paths
  if (/(^|\.)(__proto__|constructor|prototype)(\.|$)/.test(path)) {
    return undefined;
  }

  // Handle array bracket notation: step_1_output.segments[0].name
  const normalizedPath = path.replace(/\[(\d+)\]/g, '.$1');
  const parts = normalizedPath.split('.');

  let current: unknown = obj;

  for (const part of parts) {
    if (current === undefined || current === null) {
      return undefined;
    }

    if (typeof current === 'object' && current !== null) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return current;
}

// =============================================================================
// Output Validation
// =============================================================================

/**
 * Validate output against a JSON Schema-like specification
 *
 * @param output - The output object to validate
 * @param schema - JSON Schema specification
 * @returns Validation result with errors and warnings
 */
export function validateOutput(
  output: unknown,
  schema: Record<string, unknown>
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (output === undefined || output === null) {
    return { valid: false, errors: ['Output is null or undefined'], warnings: [] };
  }

  if (typeof output !== 'object') {
    return { valid: false, errors: ['Output must be an object'], warnings: [] };
  }

  const properties = schema.properties as Record<string, unknown> | undefined;
  const required = schema.required as string[] | undefined;

  // Check required fields
  if (required && Array.isArray(required)) {
    for (const field of required) {
      if (!(field in (output as Record<string, unknown>))) {
        errors.push(`Missing required field: ${field}`);
      }
    }
  }

  // Check property types
  if (properties) {
    for (const [key, spec] of Object.entries(properties)) {
      const value = (output as Record<string, unknown>)[key];
      const propSpec = spec as Record<string, unknown>;

      if (value !== undefined) {
        const expectedType = propSpec.type as string;
        const actualType = Array.isArray(value) ? 'array' : typeof value;

        if (expectedType && expectedType !== actualType) {
          if (expectedType === 'number' && actualType === 'string') {
            // Allow string numbers
            if (isNaN(Number(value))) {
              warnings.push(`Field "${key}" should be ${expectedType}, got ${actualType}`);
            }
          } else if (expectedType !== 'object' || actualType !== 'array') {
            warnings.push(`Field "${key}" should be ${expectedType}, got ${actualType}`);
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// =============================================================================
// Startup Context Extraction
// =============================================================================

/**
 * Extract startup context for prompt interpolation
 *
 * @param supabase - Supabase client
 * @param startupId - Startup ID to fetch context for
 * @returns StartupContext object with all relevant fields
 */
export async function getStartupContext(
  supabase: SupabaseClient,
  startupId: string
): Promise<StartupContext> {
  const { data: startup, error } = await supabase
    .from('startups')
    .select(`
      id,
      name,
      description,
      tagline,
      industry,
      stage,
      target_market,
      target_customers,
      unique_value,
      business_model,
      raise_amount,
      website_url,
      metadata
    `)
    .eq('id', startupId)
    .single();

  if (error || !startup) {
    throw new Error(`Failed to fetch startup: ${error?.message || 'Not found'}`);
  }

  const targetCustomer =
    typeof startup.target_customers === 'string'
      ? startup.target_customers
      : Array.isArray(startup.target_customers) && startup.target_customers.length > 0
        ? startup.target_customers[0]
        : startup.target_market || '';

  return {
    startup_name: startup.name || '',
    company_name: startup.name || '',
    description: startup.description || '',
    one_liner: startup.tagline || '',
    industry: startup.industry || '',
    stage: startup.stage || '',
    target_customer,
    target_market: startup.target_market || targetCustomer,
    problem_statement: startup.description || '',
    solution_description: startup.description || '',
    solution: startup.description || '',
    problem: startup.description || '',
    uvp: startup.unique_value || '',
    unique_value_proposition: startup.unique_value || '',
    founder_name: '',
    founder_email: '',
    // Include raw metadata for custom fields
    ...(startup.metadata as Record<string, unknown> || {}),
  };
}

// =============================================================================
// Cost Calculation
// =============================================================================

/**
 * Model pricing per 1K tokens (as of Jan 2026)
 */
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  // Gemini models
  'gemini-2.0-flash': { input: 0.000075, output: 0.0003 },
  'gemini-2.0-flash-exp': { input: 0.000075, output: 0.0003 },
  'gemini-1.5-flash': { input: 0.000075, output: 0.0003 },
  'gemini-1.5-pro': { input: 0.00125, output: 0.005 },
  'gemini-3-flash-preview': { input: 0.0001, output: 0.0004 },

  // Claude models
  'claude-3-5-sonnet-20241022': { input: 0.003, output: 0.015 },
  'claude-sonnet-4-20250514': { input: 0.003, output: 0.015 },
  'claude-sonnet-4': { input: 0.003, output: 0.015 },
  'claude-opus-4': { input: 0.015, output: 0.075 },
  'claude-opus-4-5-20251101': { input: 0.015, output: 0.075 },

  // Default fallback
  'default': { input: 0.001, output: 0.002 },
};

/**
 * Calculate cost based on tokens and model
 *
 * @param model - Model name/ID
 * @param inputTokens - Number of input tokens
 * @param outputTokens - Number of output tokens
 * @returns Cost in USD
 */
export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const rates = MODEL_PRICING[model] || MODEL_PRICING['default'];

  const inputCost = (inputTokens / 1000) * rates.input;
  const outputCost = (outputTokens / 1000) * rates.output;

  return Number((inputCost + outputCost).toFixed(6));
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get the next step in a prompt pack
 *
 * @param supabase - Supabase client
 * @param packId - Pack ID
 * @param currentStepOrder - Current step order (0 for first step)
 * @returns Next step or null if no more steps
 */
export async function getNextStep(
  supabase: SupabaseClient,
  packId: string,
  currentStepOrder: number = 0
): Promise<PromptStep | null> {
  const { data, error } = await supabase
    .from('prompt_pack_steps')
    .select('*')
    .eq('pack_id', packId)
    .gt('step_order', currentStepOrder)
    .order('step_order', { ascending: true })
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return data as PromptStep;
}

/**
 * Get all steps for a prompt pack
 *
 * @param supabase - Supabase client
 * @param packId - Pack ID
 * @returns Array of steps in order
 */
export async function getAllSteps(
  supabase: SupabaseClient,
  packId: string
): Promise<PromptStep[]> {
  const { data, error } = await supabase
    .from('prompt_pack_steps')
    .select('*')
    .eq('pack_id', packId)
    .order('step_order', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch steps: ${error.message}`);
  }

  return (data || []) as PromptStep[];
}

/**
 * Create a prompt run record
 *
 * @param supabase - Supabase client
 * @param params - Run parameters
 * @returns Created run record
 */
export async function createPromptRun(
  supabase: SupabaseClient,
  params: {
    startup_id?: string;
    user_id?: string;
    pack_id?: string;
    step_id?: string;
    inputs_json: Record<string, unknown>;
  }
): Promise<PromptRun> {
  const { data, error } = await supabase
    .from('prompt_runs')
    .insert({
      ...params,
      status: 'pending',
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to create run: ${error?.message || 'Unknown error'}`);
  }

  return data as PromptRun;
}

/**
 * Update a prompt run record
 *
 * @param supabase - Supabase client
 * @param runId - Run ID to update
 * @param updates - Fields to update
 */
export async function updatePromptRun(
  supabase: SupabaseClient,
  runId: string,
  updates: Partial<PromptRun>
): Promise<void> {
  const { error } = await supabase
    .from('prompt_runs')
    .update(updates)
    .eq('id', runId);

  if (error) {
    console.error('Failed to update run:', error.message);
  }
}
