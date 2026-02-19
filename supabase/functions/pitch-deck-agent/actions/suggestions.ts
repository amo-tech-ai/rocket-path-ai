/**
 * Pitch Suggestions Actions
 * AI-powered investor-ready copy suggestions for wizard fields
 */

import { callGemini, extractJSON } from "../ai-utils.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

export interface PitchSuggestion {
  id: string;
  text: string;
  reason: string;
}

export interface PitchSuggestionsResult {
  success: boolean;
  problem: PitchSuggestion[];
  core_solution: PitchSuggestion[];
  differentiation: PitchSuggestion[];
}

interface StartupContext {
  company_name?: string;
  industry?: string;
  sub_category?: string;
  stage?: string;
  tagline?: string;
  website_url?: string;
  problem?: string;
  core_solution?: string;
  differentiator?: string;
  users?: number;
  revenue?: number;
  growth_rate?: string;
  funding_stage?: string;
}

/**
 * Generate investor-ready pitch suggestions for Step 2 fields
 */
export async function generatePitchSuggestions(
  supabase: SupabaseClient,
  userId: string,
  startupContext: StartupContext
): Promise<PitchSuggestionsResult> {
  console.log(`[pitch_suggestions] Generating for ${startupContext.company_name || 'startup'}`);

  const systemPrompt = `You are an investor-grade pitch assistant who has helped startups raise over $500M.

CONTEXT:
- Startup Profile: ${startupContext.company_name || 'Startup'} in ${startupContext.industry || 'Technology'}
- Stage: ${startupContext.funding_stage || startupContext.stage || 'Seed'}
- Tagline: ${startupContext.tagline || 'Not provided'}
- Current problem text: ${startupContext.problem || 'Not provided'}
- Current solution text: ${startupContext.core_solution || 'Not provided'}
- Current differentiator text: ${startupContext.differentiator || 'Not provided'}
- Traction: ${startupContext.users ? `${startupContext.users} users` : 'Not provided'}, ${startupContext.revenue ? `$${startupContext.revenue} MRR` : 'No revenue shared'}
- Growth: ${startupContext.growth_rate || 'Not specified'}%

TASK:
Generate 3 concise, high-quality suggestions for each field:
1. Problem (1 sentence, pain-focused, no features, quantify the pain)
2. Core Solution (1 sentence, outcome-focused, what changes for the user)
3. Why It's Different (1 sentence, clear differentiation, competitive advantage)

RULES:
- Tailor language to the startup's industry and stage
- Avoid buzzwords and generic AI claims
- Prefer concrete outcomes over features
- Write as if for a ${startupContext.funding_stage || 'Seed'}-stage investor deck
- Max 25 words per suggestion
- Each suggestion must include a "reason" explaining why it works for investors

OUTPUT FORMAT (STRICT JSON):
{
  "problem": [
    { "id": "p1", "text": "The problem statement", "reason": "Why this works for investors" },
    { "id": "p2", "text": "Alternative problem framing", "reason": "Why this works for investors" },
    { "id": "p3", "text": "Third problem variation", "reason": "Why this works for investors" }
  ],
  "core_solution": [
    { "id": "s1", "text": "Solution statement", "reason": "Why this works for investors" },
    { "id": "s2", "text": "Alternative solution framing", "reason": "Why this works for investors" },
    { "id": "s3", "text": "Third solution variation", "reason": "Why this works for investors" }
  ],
  "differentiation": [
    { "id": "d1", "text": "Differentiation statement", "reason": "Why this works for investors" },
    { "id": "d2", "text": "Alternative differentiation", "reason": "Why this works for investors" },
    { "id": "d3", "text": "Third differentiation variation", "reason": "Why this works for investors" }
  ]
}`;

  const userPrompt = `Generate investor-ready suggestions for this ${startupContext.industry || 'technology'} startup at ${startupContext.funding_stage || 'Seed'} stage.

Company: ${startupContext.company_name || 'Unnamed startup'}
Industry: ${startupContext.industry || 'Technology'}${startupContext.sub_category ? ` (${startupContext.sub_category})` : ''}
Current inputs:
- Problem: ${startupContext.problem || 'Not yet defined'}
- Solution: ${startupContext.core_solution || 'Not yet defined'}
- Differentiator: ${startupContext.differentiator || 'Not yet defined'}

Traction signals:
- Users: ${startupContext.users || 'N/A'}
- Revenue: $${startupContext.revenue || 0} MRR
- Growth: ${startupContext.growth_rate || 'N/A'}%

Generate 3 variations for each of: problem, core_solution, differentiation.
Make them specific to this industry and stage.`;

  try {
    const response = await callGemini(
      "google/gemini-3-flash-preview",
      systemPrompt,
      userPrompt
    );

    if (response.content) {
      const parsed = extractJSON<{
        problem: PitchSuggestion[];
        core_solution: PitchSuggestion[];
        differentiation: PitchSuggestion[];
      }>(response.content);

      if (parsed && parsed.problem && parsed.core_solution && parsed.differentiation) {
        console.log(`[pitch_suggestions] Successfully generated suggestions`);
        return {
          success: true,
          problem: parsed.problem,
          core_solution: parsed.core_solution,
          differentiation: parsed.differentiation,
        };
      }
    }
  } catch (error) {
    console.error("[pitch_suggestions] Error:", error);
  }

  // Return fallback suggestions
  return {
    success: true,
    problem: getDefaultProblemSuggestions(startupContext),
    core_solution: getDefaultSolutionSuggestions(startupContext),
    differentiation: getDefaultDifferentiationSuggestions(startupContext),
  };
}

/**
 * Generate suggestions for a single field
 */
export async function generateFieldSuggestion(
  supabase: SupabaseClient,
  userId: string,
  field: 'problem' | 'core_solution' | 'differentiator',
  startupContext: StartupContext
): Promise<{ success: boolean; suggestions: PitchSuggestion[] }> {
  console.log(`[field_suggestion] Generating for field: ${field}`);

  const fieldDescriptions: Record<string, string> = {
    problem: "The pain point or challenge your target customers face. Be specific, quantify the pain, avoid features.",
    core_solution: "How your product solves the problem. Focus on outcomes, not features. What changes for the user?",
    differentiator: "What makes you different from alternatives. Your unique advantage or unfair competitive edge.",
  };

  const systemPrompt = `You are an investor pitch expert. Generate 3 compelling variations for the "${field}" field.

Field definition: ${fieldDescriptions[field]}

RULES:
- Industry: ${startupContext.industry || 'Technology'}
- Stage: ${startupContext.funding_stage || 'Seed'}
- Max 25 words per suggestion
- Be specific to this industry
- Include quantification where possible
- Each needs a "reason" explaining investor appeal

OUTPUT (JSON array):
[
  { "id": "1", "text": "...", "reason": "..." },
  { "id": "2", "text": "...", "reason": "..." },
  { "id": "3", "text": "...", "reason": "..." }
]`;

  const userPrompt = `Company: ${startupContext.company_name || 'Startup'}
Industry: ${startupContext.industry || 'Technology'}
Current ${field}: ${startupContext[field as keyof StartupContext] || 'Not defined'}
Traction: ${startupContext.users || 0} users, $${startupContext.revenue || 0} MRR

Generate 3 investor-ready suggestions.`;

  try {
    const response = await callGemini(
      "google/gemini-3-flash-preview",
      systemPrompt,
      userPrompt
    );

    const suggestions = extractJSON<PitchSuggestion[]>(response.content);
    if (suggestions && suggestions.length > 0) {
      return { success: true, suggestions };
    }
  } catch (error) {
    console.error("[field_suggestion] Error:", error);
  }

  // Return fallback
  const fallbackMap: Record<string, PitchSuggestion[]> = {
    problem: getDefaultProblemSuggestions(startupContext),
    core_solution: getDefaultSolutionSuggestions(startupContext),
    differentiator: getDefaultDifferentiationSuggestions(startupContext),
  };

  return { success: true, suggestions: fallbackMap[field] || [] };
}

// ============================================================================
// Fallback Suggestions
// ============================================================================

function getDefaultProblemSuggestions(ctx: StartupContext): PitchSuggestion[] {
  const industry = ctx.industry || 'Technology';
  return [
    {
      id: "p1",
      text: `${industry} teams lose 40%+ of productive time to manual, fragmented workflows that prevent scale.`,
      reason: "Quantifies the pain with a specific metric that resonates with efficiency-focused investors.",
    },
    {
      id: "p2",
      text: `Existing ${industry.toLowerCase()} solutions require months of setup and heavy customization, delaying time-to-value.`,
      reason: "Addresses switching costs and implementation friction—a key enterprise buyer concern.",
    },
    {
      id: "p3",
      text: `Critical data is trapped in silos, leaving ${industry.toLowerCase()} decision-makers blind to real-time insights.`,
      reason: "Highlights the visibility gap that leads to poor decisions and missed opportunities.",
    },
  ];
}

function getDefaultSolutionSuggestions(ctx: StartupContext): PitchSuggestion[] {
  const industry = ctx.industry || 'Technology';
  return [
    {
      id: "s1",
      text: `An AI-powered platform that automates ${industry.toLowerCase()} workflows, reducing manual work by 80%.`,
      reason: "Leads with quantified outcome, not features—investors care about impact.",
    },
    {
      id: "s2",
      text: `A unified operating system for ${industry.toLowerCase()} teams that replaces 5+ point solutions.`,
      reason: "Positions as consolidation play—a strong narrative in crowded markets.",
    },
    {
      id: "s3",
      text: `Self-service analytics that give ${industry.toLowerCase()} leaders real-time visibility in hours, not months.`,
      reason: "Emphasizes speed to value, a key differentiator for modern SaaS.",
    },
  ];
}

function getDefaultDifferentiationSuggestions(ctx: StartupContext): PitchSuggestion[] {
  const industry = ctx.industry || 'Technology';
  return [
    {
      id: "d1",
      text: `Purpose-built for ${industry.toLowerCase()} with AI that understands domain-specific terminology and workflows.`,
      reason: "Vertical focus creates defensibility—horizontal tools can't replicate domain depth.",
    },
    {
      id: "d2",
      text: `10x faster implementation than alternatives with no-code configuration and pre-built integrations.`,
      reason: "Speed to value is measurable and compelling for enterprise buyers.",
    },
    {
      id: "d3",
      text: `Founded by ${industry.toLowerCase()} operators with 20+ years of combined industry experience.`,
      reason: "Team credibility creates trust—especially in domain-specific plays.",
    },
  ];
}
