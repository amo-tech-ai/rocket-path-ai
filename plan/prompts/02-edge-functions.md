# Task 2: Edge Functions for Prompt Pack System

> **Priority:** P0
> **Effort:** 8-12 hours
> **Dependencies:** Task 1 (Database Setup)

---

## Objective

Create three Edge Functions to search, run, and apply prompt packs.

---

## Checklist

### 2.1 Create Shared Utilities

**File:** `supabase/functions/_shared/prompt-utils.ts`

```typescript
// supabase/functions/_shared/prompt-utils.ts
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface PromptPack {
  id: string;
  title: string;
  slug: string;
  category: string;
  stage_tags: string[];
  industry_tags: string[];
  version: number;
  is_active: boolean;
}

export interface PromptStep {
  id: string;
  pack_id: string;
  step_order: number;
  purpose: string;
  prompt_template: string;
  input_schema: Record<string, any>;
  output_schema: Record<string, any>;
  model_preference: 'gemini' | 'claude' | 'auto';
  max_tokens: number;
  temperature: number;
}

export interface PromptRun {
  id: string;
  startup_id: string;
  user_id: string;
  pack_id: string;
  step_id: string;
  inputs_json: Record<string, any>;
  outputs_json: Record<string, any> | null;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
}

/**
 * Interpolate variables in prompt template
 */
export function interpolatePrompt(
  template: string,
  variables: Record<string, any>
): string {
  let result = template;

  for (const [key, value] of Object.entries(variables)) {
    const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(pattern, String(value ?? ''));
  }

  // Remove any remaining unmatched variables
  result = result.replace(/\{\{[^}]+\}\}/g, '');

  return result;
}

/**
 * Validate output against schema (basic validation)
 */
export function validateOutput(
  output: any,
  schema: Record<string, any>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!output || typeof output !== 'object') {
    return { valid: false, errors: ['Output must be an object'] };
  }

  // Check required fields
  for (const [key, spec] of Object.entries(schema)) {
    if (spec.required && !(key in output)) {
      errors.push(`Missing required field: ${key}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Extract startup context for prompt interpolation
 */
export async function getStartupContext(
  supabase: SupabaseClient,
  startupId: string
): Promise<Record<string, any>> {
  const { data: startup } = await supabase
    .from('startups')
    .select(`
      *,
      profiles!startups_created_by_fkey (
        full_name,
        email
      )
    `)
    .eq('id', startupId)
    .single();

  if (!startup) {
    throw new Error('Startup not found');
  }

  return {
    company_name: startup.company_name,
    product_description: startup.description,
    industry: startup.industry,
    stage: startup.stage,
    target_market: startup.target_customer,
    problem: startup.problem_statement,
    solution: startup.solution_description,
    founder_name: startup.profiles?.full_name,
    // Add more fields as needed
  };
}

/**
 * Calculate cost based on tokens and model
 */
export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing: Record<string, { input: number; output: number }> = {
    'gemini-2.0-flash': { input: 0.000075, output: 0.0003 },
    'gemini-1.5-pro': { input: 0.00125, output: 0.005 },
    'claude-sonnet-4': { input: 0.003, output: 0.015 },
    'claude-opus-4': { input: 0.015, output: 0.075 },
  };

  const rates = pricing[model] || { input: 0.001, output: 0.002 };
  return (inputTokens * rates.input + outputTokens * rates.output) / 1000;
}
```

---

### 2.2 Create prompt-pack-search Function

**File:** `supabase/functions/prompt-pack-search/index.ts`

```typescript
// supabase/functions/prompt-pack-search/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface SearchRequest {
  industry?: string;
  stage?: string;
  module: 'onboarding' | 'canvas' | 'pitch' | 'validation' | 'gtm' | 'pricing';
  goal?: string;
  startup_id?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { industry, stage, module, goal, startup_id } = await req.json() as SearchRequest;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Map UI module to pack categories
    const categoryMap: Record<string, string[]> = {
      onboarding: ['validation', 'ideation', 'market'],
      canvas: ['canvas', 'pricing', 'gtm'],
      pitch: ['pitch'],
      validation: ['validation', 'market'],
      gtm: ['gtm', 'pricing'],
      pricing: ['pricing'],
    };

    const categories = categoryMap[module] || [module];

    // Build query
    let query = supabase
      .from('prompt_packs')
      .select(`
        id,
        title,
        slug,
        description,
        category,
        stage_tags,
        industry_tags,
        version,
        prompt_pack_steps (
          id,
          step_order,
          purpose,
          prompt_template,
          output_schema,
          model_preference,
          max_tokens,
          temperature
        )
      `)
      .in('category', categories)
      .eq('is_active', true)
      .order('version', { ascending: false });

    // Apply filters
    if (industry) {
      query = query.contains('industry_tags', [industry.toLowerCase()]);
    }
    if (stage) {
      query = query.contains('stage_tags', [stage.toLowerCase()]);
    }

    const { data: packs, error } = await query.limit(5);

    if (error) {
      throw error;
    }

    // Sort steps by order
    const packsWithSortedSteps = packs?.map(pack => ({
      ...pack,
      prompt_pack_steps: pack.prompt_pack_steps
        ?.sort((a: any, b: any) => a.step_order - b.step_order),
    }));

    // Get best pack and first step
    const bestPack = packsWithSortedSteps?.[0];
    const firstStep = bestPack?.prompt_pack_steps?.[0];

    // If startup_id provided, get context for preview
    let context = null;
    if (startup_id && bestPack) {
      const { data: startup } = await supabase
        .from('startups')
        .select('company_name, description, industry, stage')
        .eq('id', startup_id)
        .single();
      context = startup;
    }

    return new Response(JSON.stringify({
      success: true,
      pack: bestPack,
      next_step: firstStep,
      alternatives: packsWithSortedSteps?.slice(1) || [],
      context,
      meta: {
        searched_categories: categories,
        filters: { industry, stage },
        total_found: packs?.length || 0,
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Search error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

---

### 2.3 Create prompt-pack-run Function

**File:** `supabase/functions/prompt-pack-run/index.ts`

```typescript
// supabase/functions/prompt-pack-run/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai';
import { corsHeaders } from '../_shared/cors.ts';
import {
  interpolatePrompt,
  validateOutput,
  getStartupContext,
  calculateCost,
} from '../_shared/prompt-utils.ts';

interface RunRequest {
  startup_id: string;
  pack_id: string;
  step_id: string;
  context?: Record<string, any>;
  user_id?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const { startup_id, pack_id, step_id, context: userContext, user_id } =
      await req.json() as RunRequest;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 1. Get the step configuration
    const { data: step, error: stepError } = await supabase
      .from('prompt_pack_steps')
      .select('*')
      .eq('id', step_id)
      .single();

    if (stepError || !step) {
      throw new Error(`Step not found: ${step_id}`);
    }

    // 2. Get startup context
    const startupContext = await getStartupContext(supabase, startup_id);

    // 3. Merge contexts (user context overrides startup context)
    const fullContext = {
      ...startupContext,
      ...userContext,
    };

    // 4. Create run record
    const { data: run, error: runError } = await supabase
      .from('prompt_runs')
      .insert({
        startup_id,
        user_id,
        pack_id,
        step_id,
        inputs_json: fullContext,
        status: 'running',
      })
      .select()
      .single();

    if (runError) {
      throw new Error(`Failed to create run: ${runError.message}`);
    }

    // 5. Interpolate prompt
    let prompt = interpolatePrompt(step.prompt_template, fullContext);

    // 6. Add output schema instruction
    const schemaInstruction = `

IMPORTANT: Return your response as valid JSON matching this exact schema:
${JSON.stringify(step.output_schema, null, 2)}

Do not include any text outside the JSON object.`;

    prompt += schemaInstruction;

    // 7. Call AI model
    let outputs: Record<string, any>;
    let modelUsed: string;
    let tokensInput = 0;
    let tokensOutput = 0;

    if (step.model_preference === 'gemini' || step.model_preference === 'auto') {
      const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: step.temperature,
          maxOutputTokens: step.max_tokens,
          responseMimeType: 'application/json',
        },
      });

      const responseText = result.response.text();
      outputs = JSON.parse(responseText);
      modelUsed = 'gemini-2.0-flash';
      tokensInput = result.response.usageMetadata?.promptTokenCount || 0;
      tokensOutput = result.response.usageMetadata?.candidatesTokenCount || 0;
    } else {
      // Claude fallback
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: step.max_tokens,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const claudeResult = await response.json();
      outputs = JSON.parse(claudeResult.content[0].text);
      modelUsed = 'claude-sonnet-4';
      tokensInput = claudeResult.usage?.input_tokens || 0;
      tokensOutput = claudeResult.usage?.output_tokens || 0;
    }

    // 8. Validate output
    const validation = validateOutput(outputs, step.output_schema);
    if (!validation.valid) {
      console.warn('Output validation warnings:', validation.errors);
    }

    // 9. Calculate metrics
    const latencyMs = Date.now() - startTime;
    const costUsd = calculateCost(modelUsed, tokensInput, tokensOutput);

    // 10. Update run record
    await supabase
      .from('prompt_runs')
      .update({
        outputs_json: outputs,
        model_used: modelUsed,
        tokens_input: tokensInput,
        tokens_output: tokensOutput,
        cost_usd: costUsd,
        latency_ms: latencyMs,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', run.id);

    // 11. Return response
    return new Response(JSON.stringify({
      success: true,
      run_id: run.id,
      outputs,
      meta: {
        model: modelUsed,
        latency_ms: latencyMs,
        tokens: { input: tokensInput, output: tokensOutput },
        cost_usd: costUsd,
        validation: validation,
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Run error:', error);

    // Try to update run status to failed
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      const body = await req.clone().json();
      if (body.run_id) {
        await supabase
          .from('prompt_runs')
          .update({
            status: 'failed',
            error_message: error.message,
            completed_at: new Date().toISOString(),
          })
          .eq('id', body.run_id);
      }
    } catch (e) {
      console.error('Failed to update run status:', e);
    }

    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      latency_ms: Date.now() - startTime,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

---

### 2.4 Create prompt-pack-apply Function

**File:** `supabase/functions/prompt-pack-apply/index.ts`

```typescript
// supabase/functions/prompt-pack-apply/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface ApplyRequest {
  startup_id: string;
  run_id: string;
  outputs_json: Record<string, any>;
  apply_to?: ('profile' | 'canvas' | 'slides' | 'tasks' | 'score')[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { startup_id, run_id, outputs_json, apply_to } = await req.json() as ApplyRequest;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const applied: { table: string; action: string; count: number }[] = [];
    const targets = apply_to || ['profile', 'canvas', 'slides', 'tasks', 'score'];

    // 1. Apply to startup profile
    if (targets.includes('profile')) {
      const profileUpdates: Record<string, any> = {};

      if (outputs_json.icp) profileUpdates.target_customer = outputs_json.icp;
      if (outputs_json.problem) profileUpdates.problem_statement = outputs_json.problem;
      if (outputs_json.solution) profileUpdates.solution_description = outputs_json.solution;
      if (outputs_json.uvp) profileUpdates.unique_value_proposition = outputs_json.uvp;
      if (outputs_json.one_liner) profileUpdates.one_liner = outputs_json.one_liner;

      if (Object.keys(profileUpdates).length > 0) {
        profileUpdates.updated_at = new Date().toISOString();

        const { error } = await supabase
          .from('startups')
          .update(profileUpdates)
          .eq('id', startup_id);

        if (!error) {
          applied.push({
            table: 'startups',
            action: 'update',
            count: Object.keys(profileUpdates).length - 1,
          });
        }
      }
    }

    // 2. Apply to lean canvas
    if (targets.includes('canvas') && outputs_json.canvas) {
      const { data: existingCanvas } = await supabase
        .from('lean_canvases')
        .select('id')
        .eq('startup_id', startup_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const canvasData = {
        ...outputs_json.canvas,
        updated_at: new Date().toISOString(),
      };

      if (existingCanvas) {
        await supabase
          .from('lean_canvases')
          .update(canvasData)
          .eq('id', existingCanvas.id);

        applied.push({ table: 'lean_canvases', action: 'update', count: 1 });
      } else {
        await supabase
          .from('lean_canvases')
          .insert({
            startup_id,
            ...canvasData,
          });

        applied.push({ table: 'lean_canvases', action: 'insert', count: 1 });
      }
    }

    // 3. Apply to pitch slides
    if (targets.includes('slides') && outputs_json.slides) {
      let slideCount = 0;

      for (const slide of outputs_json.slides) {
        const { error } = await supabase
          .from('pitch_slides')
          .upsert({
            startup_id,
            slide_type: slide.type,
            title: slide.title,
            content: slide.content,
            bullets: slide.bullets,
            notes: slide.notes,
            order_index: slide.order || 0,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'startup_id,slide_type',
          });

        if (!error) slideCount++;
      }

      if (slideCount > 0) {
        applied.push({ table: 'pitch_slides', action: 'upsert', count: slideCount });
      }
    }

    // 4. Create validation tasks
    if (targets.includes('tasks') && outputs_json.tasks) {
      let taskCount = 0;

      for (const task of outputs_json.tasks) {
        const { error } = await supabase
          .from('tasks')
          .insert({
            startup_id,
            title: task.title,
            description: task.description,
            category: task.category || 'validation',
            priority: task.priority || 'medium',
            status: 'pending',
            source: 'prompt_pack',
            metadata: {
              source_run_id: run_id,
              generated_at: new Date().toISOString(),
            },
          });

        if (!error) taskCount++;
      }

      if (taskCount > 0) {
        applied.push({ table: 'tasks', action: 'insert', count: taskCount });
      }
    }

    // 5. Update readiness score
    if (targets.includes('score') && outputs_json.readiness_score !== undefined) {
      const { error } = await supabase
        .from('startups')
        .update({
          readiness_score: outputs_json.readiness_score,
          readiness_rationale: outputs_json.readiness_rationale,
          readiness_updated_at: new Date().toISOString(),
        })
        .eq('id', startup_id);

      if (!error) {
        applied.push({ table: 'startups.readiness', action: 'update', count: 1 });
      }
    }

    // 6. Store in memory for RAG (optional)
    if (outputs_json.summary || outputs_json.key_insights) {
      await supabase
        .from('startup_memory')
        .insert({
          startup_id,
          entity_type: 'prompt_output',
          entity_id: run_id,
          content: outputs_json.summary || JSON.stringify(outputs_json.key_insights),
          source: `prompt_run:${run_id}`,
        });

      applied.push({ table: 'startup_memory', action: 'insert', count: 1 });
    }

    return new Response(JSON.stringify({
      success: true,
      applied,
      summary: {
        tables_updated: applied.length,
        total_records: applied.reduce((sum, a) => sum + a.count, 0),
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Apply error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

---

### 2.5 Deploy Functions

```bash
# Deploy all three functions
supabase functions deploy prompt-pack-search
supabase functions deploy prompt-pack-run
supabase functions deploy prompt-pack-apply

# Set secrets
supabase secrets set GEMINI_API_KEY=your-key
supabase secrets set ANTHROPIC_API_KEY=your-key

# Test locally
supabase functions serve prompt-pack-search --env-file .env.local
```

---

## Verification

- [ ] `prompt-pack-search` returns packs with steps
- [ ] `prompt-pack-run` executes prompts and saves runs
- [ ] `prompt-pack-apply` updates correct tables
- [ ] Error handling works (invalid inputs, missing data)
- [ ] CORS headers present
- [ ] Cost tracking works

---

## Files to Create

| File | Purpose |
|------|---------|
| `supabase/functions/_shared/prompt-utils.ts` | Shared utilities |
| `supabase/functions/prompt-pack-search/index.ts` | Search function |
| `supabase/functions/prompt-pack-run/index.ts` | Run function |
| `supabase/functions/prompt-pack-apply/index.ts` | Apply function |

---

## Test Payloads

**Search:**
```json
{
  "module": "validation",
  "industry": "saas",
  "stage": "seed"
}
```

**Run:**
```json
{
  "startup_id": "uuid-here",
  "pack_id": "uuid-here",
  "step_id": "uuid-here",
  "context": {
    "custom_field": "value"
  }
}
```

**Apply:**
```json
{
  "startup_id": "uuid-here",
  "run_id": "uuid-here",
  "outputs_json": {
    "icp": "RevOps managers at B2B SaaS",
    "tasks": [
      { "title": "Interview 5 customers", "priority": "high" }
    ],
    "readiness_score": 65
  }
}
```
