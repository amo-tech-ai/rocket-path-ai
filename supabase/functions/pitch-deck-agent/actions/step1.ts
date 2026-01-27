/**
 * Step 1 AI Actions: Industry research, problem suggestions, canvas suggestions
 * Uses Google Search grounding for real-time intelligence
 */

import { callGemini, callGeminiWithGrounding, extractJSON } from "../ai-utils.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

export interface IndustryInsights {
  coreProblems: string[];
  buyingPersonas: string[];
  existingSolutions: {
    ai: string[];
    nonAi: string[];
  };
  gaps: string[];
  trends: string[];
}

export interface ProblemSuggestion {
  id: string;
  text: string;
  explanation: string;
  realWorldFraming: string;
  category: string;
  confidence: number;
}

export interface CanvasFieldSuggestion {
  id: string;
  title: string;
  explanation: string;
}

// ============================================================================
// Research Industry
// ============================================================================

export async function researchIndustry(
  supabase: SupabaseClient,
  userId: string,
  industry: string,
  subCategory?: string
): Promise<{ success: boolean; insights: IndustryInsights }> {
  console.log(`[research_industry] Industry: ${industry}, Sub: ${subCategory}`);

  const query = `${industry} ${subCategory || ''} startup market problems challenges solutions trends 2024 2025`;
  const context = `Analyze the ${industry} industry for a startup founder creating a pitch deck. Identify core problems, buying personas, existing solutions (both AI and traditional), market gaps, and current trends.`;

  try {
    const result = await callGeminiWithGrounding(query, context);

    if (result.content) {
      // Try to extract structured insights
      const systemPrompt = `You are an industry analyst. Extract structured insights from this research about the ${industry} industry. Return JSON with:
{
  "coreProblems": ["problem1", "problem2", ...],
  "buyingPersonas": ["persona1", "persona2", ...],
  "existingSolutions": { "ai": ["solution1"], "nonAi": ["solution2"] },
  "gaps": ["gap1", "gap2"],
  "trends": ["trend1", "trend2"]
}`;

      const structuredResponse = await callGemini(
        "google/gemini-3-flash-preview",
        systemPrompt,
        result.content
      );

      const insights = extractJSON<IndustryInsights>(structuredResponse.content);
      if (insights) {
        return { success: true, insights };
      }
    }
  } catch (error) {
    console.error("[research_industry] Error:", error);
  }

  // Return fallback insights
  return {
    success: true,
    insights: getDefaultIndustryInsights(industry),
  };
}

// ============================================================================
// Suggest Problems
// ============================================================================

export async function suggestProblems(
  supabase: SupabaseClient,
  userId: string,
  industry: string,
  subCategory: string | undefined,
  companyDescription: string
): Promise<{ success: boolean; suggestions: ProblemSuggestion[] }> {
  console.log(`[suggest_problems] Industry: ${industry}`);

  const systemPrompt = `You are an expert startup advisor helping founders articulate their problem statement for investor pitches.

Based on the company description and industry, generate 3-5 compelling problem statements that:
1. Quantify the pain (time, money, frustration)
2. Are specific to the target customer
3. Explain why existing solutions fall short
4. Include real-world framing (how customers describe the pain)

Return JSON array:
[{
  "id": "p1",
  "text": "Clear problem statement",
  "explanation": "Why this matters to investors",
  "realWorldFraming": "How customers actually describe this pain",
  "category": "problem",
  "confidence": 0.85
}]`;

  const userPrompt = `Industry: ${industry}${subCategory ? ` (${subCategory})` : ''}
Company Description: ${companyDescription || 'Not provided'}

Generate 3-5 problem statements that would resonate with investors in this space.`;

  try {
    const response = await callGemini(
      "google/gemini-3-flash-preview",
      systemPrompt,
      userPrompt
    );

    const suggestions = extractJSON<ProblemSuggestion[]>(response.content);
    if (suggestions && suggestions.length > 0) {
      return { success: true, suggestions };
    }
  } catch (error) {
    console.error("[suggest_problems] Error:", error);
  }

  // Return fallback suggestions
  return {
    success: true,
    suggestions: getDefaultProblemSuggestions(industry),
  };
}

// ============================================================================
// Suggest Canvas Field
// ============================================================================

export async function suggestCanvasField(
  supabase: SupabaseClient,
  userId: string,
  field: string,
  industry: string,
  companyDescription: string
): Promise<{ success: boolean; suggestions: CanvasFieldSuggestion[] }> {
  console.log(`[suggest_canvas_field] Field: ${field}, Industry: ${industry}`);

  const fieldDescriptions: Record<string, string> = {
    problem: "Top problems the startup solves",
    solution: "How the startup solves these problems",
    uniqueValueProp: "Why customers should choose this over alternatives",
    customerSegments: "Target customers and early adopters",
    channels: "How to reach and acquire customers",
    revenueStreams: "How the business makes money",
    keyMetrics: "Key metrics to track success",
    costStructure: "Major cost drivers",
    unfairAdvantage: "What can't be easily copied",
  };

  const systemPrompt = `You are a Lean Canvas expert helping startups articulate their business model.

Generate 3 suggestions for the "${field}" section of a Lean Canvas.
Field definition: ${fieldDescriptions[field] || field}

Return JSON array:
[{
  "id": "s1",
  "title": "Concise entry for the canvas box",
  "explanation": "Why this matters and how to think about it"
}]`;

  const userPrompt = `Industry: ${industry}
Company Description: ${companyDescription || 'Not provided'}

Generate 3 suggestions for the ${field} section of the Lean Canvas.`;

  try {
    const response = await callGemini(
      "google/gemini-3-flash-preview",
      systemPrompt,
      userPrompt
    );

    const suggestions = extractJSON<CanvasFieldSuggestion[]>(response.content);
    if (suggestions && suggestions.length > 0) {
      return { success: true, suggestions };
    }
  } catch (error) {
    console.error("[suggest_canvas_field] Error:", error);
  }

  // Return fallback suggestions
  return {
    success: true,
    suggestions: getDefaultCanvasSuggestions(field),
  };
}

// ============================================================================
// Generate Interview Drafts
// ============================================================================

export async function generateInterviewDrafts(
  supabase: SupabaseClient,
  userId: string,
  industry: string,
  companyDescription: string,
  problem: string
): Promise<{
  success: boolean;
  drafts: Array<{
    id: string;
    question: string;
    draftAnswer: string;
    category: string;
    confidence: number;
  }>;
}> {
  console.log(`[generate_interview_drafts] Industry: ${industry}`);

  const systemPrompt = `You are a startup pitch coach helping founders prepare for investor questions.

Based on the company description and problem statement, generate draft answers to key investor questions. These drafts help founders get started, not replace their thinking.

Return JSON array:
[{
  "id": "d1",
  "question": "The investor question",
  "draftAnswer": "A starting point for the founder's answer",
  "category": "traction|market|team|product|financials",
  "confidence": 0.7
}]`;

  const userPrompt = `Industry: ${industry}
Company Description: ${companyDescription || 'Not provided'}
Problem Statement: ${problem || 'Not provided'}

Generate 3-4 draft answers to key investor questions.`;

  try {
    const response = await callGemini(
      "google/gemini-3-flash-preview",
      systemPrompt,
      userPrompt
    );

    const drafts = extractJSON<Array<{
      id: string;
      question: string;
      draftAnswer: string;
      category: string;
      confidence: number;
    }>>(response.content);

    if (drafts && drafts.length > 0) {
      return { success: true, drafts };
    }
  } catch (error) {
    console.error("[generate_interview_drafts] Error:", error);
  }

  // Return fallback drafts
  return {
    success: true,
    drafts: [
      {
        id: "d1",
        question: "What specific metrics demonstrate product-market fit?",
        draftAnswer: "Focus on retention, NPS, and organic growth as leading indicators.",
        category: "traction",
        confidence: 0.7,
      },
      {
        id: "d2",
        question: "How do you acquire customers today?",
        draftAnswer: "Consider your primary channels and unit economics.",
        category: "market",
        confidence: 0.7,
      },
      {
        id: "d3",
        question: "What makes your team uniquely qualified?",
        draftAnswer: "Highlight relevant domain expertise and startup experience.",
        category: "team",
        confidence: 0.7,
      },
    ],
  };
}

// ============================================================================
// Fallback Data
// ============================================================================

function getDefaultIndustryInsights(industry: string): IndustryInsights {
  const defaults: Record<string, IndustryInsights> = {
    ai_saas: {
      coreProblems: [
        "Enterprise teams spend 40%+ of time on repetitive tasks that could be automated",
        "Existing AI tools require significant technical expertise to deploy",
        "Data silos prevent organizations from leveraging AI effectively",
      ],
      buyingPersonas: ["VPs of Engineering", "CTOs", "Heads of Operations", "Product Leaders"],
      existingSolutions: {
        ai: ["Point solutions with limited integration", "Expensive enterprise platforms", "DIY ML infrastructure"],
        nonAi: ["Spreadsheets and manual processes", "Legacy software", "Outsourcing"],
      },
      gaps: [
        "Easy-to-deploy AI that works with existing workflows",
        "Vertical-specific AI that understands domain context",
        "Affordable AI for mid-market companies",
      ],
      trends: [
        "AI-first approaches replacing traditional software",
        "Agentic AI gaining enterprise adoption",
        "Focus on ROI and time-to-value over features",
      ],
    },
    fintech: {
      coreProblems: [
        "Financial processes are slow, manual, and error-prone",
        "Regulatory compliance is complex and resource-intensive",
        "Underserved segments lack access to financial services",
      ],
      buyingPersonas: ["CFOs", "Treasury Managers", "Compliance Officers", "Finance Teams"],
      existingSolutions: {
        ai: ["Basic automation tools", "Fraud detection systems"],
        nonAi: ["Legacy banking systems", "Manual reconciliation", "Spreadsheets"],
      },
      gaps: [
        "Real-time financial visibility",
        "Embedded finance for non-financial platforms",
        "Simplified compliance automation",
      ],
      trends: [
        "Open banking creating new opportunities",
        "Embedded finance becoming standard",
        "AI-powered underwriting and risk assessment",
      ],
    },
  };

  return defaults[industry] || {
    coreProblems: [
      "Inefficient processes consuming valuable resources",
      "Lack of real-time visibility into operations",
      "Difficulty scaling without proportional cost increase",
    ],
    buyingPersonas: ["Department Heads", "Operations Leaders", "C-Suite Executives"],
    existingSolutions: {
      ai: ["Emerging AI tools with limited adoption"],
      nonAi: ["Traditional software", "Manual processes", "Consultants"],
    },
    gaps: ["Integration between existing tools", "Automation of complex workflows", "Real-time decision support"],
    trends: ["Digital transformation", "AI adoption", "Process automation"],
  };
}

function getDefaultProblemSuggestions(industry: string): ProblemSuggestion[] {
  return [
    {
      id: "p1",
      text: `Teams in ${industry} spend 40%+ of their time on manual, repetitive tasks`,
      explanation: "Quantified pain point that resonates with efficiency-focused buyers",
      realWorldFraming: "We lose 2 days every week just on data entry and reconciliation",
      category: "problem",
      confidence: 0.85,
    },
    {
      id: "p2",
      text: "Existing solutions require months of implementation and heavy customization",
      explanation: "Time-to-value is a key concern for decision-makers",
      realWorldFraming: "We evaluated 5 vendors but couldn't afford the 6-month rollout",
      category: "problem",
      confidence: 0.8,
    },
    {
      id: "p3",
      text: "Critical data is trapped in silos, preventing informed decision-making",
      explanation: "Data accessibility is a universal enterprise pain point",
      realWorldFraming: "I need to ask 3 different teams just to get a simple report",
      category: "problem",
      confidence: 0.75,
    },
  ];
}

function getDefaultCanvasSuggestions(field: string): CanvasFieldSuggestion[] {
  const defaults: Record<string, CanvasFieldSuggestion[]> = {
    problem: [
      { id: "s1", title: "Time-consuming manual processes", explanation: "Quantify the time/cost waste" },
      { id: "s2", title: "Lack of real-time visibility", explanation: "Decision-makers need faster insights" },
      { id: "s3", title: "High error rates in current workflows", explanation: "Quality issues have measurable costs" },
    ],
    solution: [
      { id: "s1", title: "AI-powered automation", explanation: "Highlight the technology advantage" },
      { id: "s2", title: "Self-service platform", explanation: "Reduce dependency on specialists" },
      { id: "s3", title: "Real-time analytics dashboard", explanation: "Immediate visibility into operations" },
    ],
    uniqueValueProp: [
      { id: "s1", title: "10x faster than alternatives", explanation: "Quantified speed improvement" },
      { id: "s2", title: "No-code implementation", explanation: "Lower barrier to adoption" },
      { id: "s3", title: "Industry-specific AI", explanation: "Domain expertise as differentiator" },
    ],
    customerSegments: [
      { id: "s1", title: "Mid-market companies (50-500 employees)", explanation: "Specific, actionable segment" },
      { id: "s2", title: "Operations teams in [industry]", explanation: "Role-based targeting" },
      { id: "s3", title: "Companies using legacy systems", explanation: "Pain-based segmentation" },
    ],
    channels: [
      { id: "s1", title: "Product-led growth", explanation: "Free tier drives adoption" },
      { id: "s2", title: "Content marketing + SEO", explanation: "Thought leadership strategy" },
      { id: "s3", title: "Strategic partnerships", explanation: "Distribution through ecosystem" },
    ],
    revenueStreams: [
      { id: "s1", title: "SaaS subscription (monthly/annual)", explanation: "Predictable recurring revenue" },
      { id: "s2", title: "Usage-based pricing tier", explanation: "Scales with customer success" },
      { id: "s3", title: "Enterprise contracts", explanation: "Higher ACV for large customers" },
    ],
  };

  return defaults[field] || [
    { id: "s1", title: "Primary approach", explanation: "Main strategy for this area" },
    { id: "s2", title: "Secondary approach", explanation: "Alternative or complementary strategy" },
    { id: "s3", title: "Future consideration", explanation: "Growth opportunity to explore" },
  ];
}
