/**
 * Interview Actions: generate_interview_questions
 */

import { callGemini } from "../ai-utils.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

export async function generateInterviewQuestions(
  supabase: SupabaseClient,
  userId: string,
  deckId: string,
  step1Data: Record<string, unknown>,
  step2Data: Record<string, unknown>
) {
  console.log(`[generate_interview_questions] Deck: ${deckId}`);

  const industry = (step1Data.industry as string) || "technology";
  const stage = (step1Data.stage as string) || "seed";
  const companyName = (step1Data.company_name as string) || "Startup";
  const tagline = (step1Data.tagline as string) || "";
  const problem = (step2Data.problem as string) || "";
  const solution = (step2Data.core_solution as string) || "";
  const fundingStage = (step2Data.funding_stage as string) || "seed";

  const systemPrompt = `You are an expert venture capital analyst specializing in ${industry} startups at the ${stage} stage.
Your task is to generate 6-8 highly specific, probing interview questions that will help create a compelling pitch deck.

Focus areas:
1. Fill knowledge gaps in the provided data
2. Extract quantitative metrics and proof points
3. Uncover unique insights about team, market, and traction
4. Generate questions investors would actually ask

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "id": "q1",
      "question": "Your specific question here?",
      "category": "traction|market|team|product|financials|competition",
      "slide_mapping": "traction|market|team|solution|business_model|competition|ask",
      "why_important": "Brief reason this matters for the pitch"
    }
  ],
  "research_context": {
    "industry_insights": ["key insight 1", "key insight 2"],
    "funding_landscape": "brief market context",
    "key_metrics_needed": ["metric 1", "metric 2"]
  }
}`;

  const userPrompt = `Generate interview questions for this startup:

Company: ${companyName}
Industry: ${industry}
Stage: ${stage}
Tagline: ${tagline}
Problem: ${problem}
Solution: ${solution}
Funding Stage: ${fundingStage}

Known data gaps to fill:
- Specific traction metrics (users, revenue, growth rate)
- Unit economics (CAC, LTV, margins)
- Team backgrounds and unfair advantages
- Competitive differentiation with proof
- Go-to-market strategy details`;

  const aiResponse = await callGemini(
    "google/gemini-3-flash-preview",
    systemPrompt,
    userPrompt
  );

  let questions: Array<{ id: string; question: string; category: string; slide_mapping: string; source: string }> = [];
  let researchContext: Record<string, unknown> = {};

  if (aiResponse.content) {
    try {
      const jsonMatch = aiResponse.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        questions = (parsed.questions || []).map((q: Record<string, unknown>, idx: number) => ({
          id: q.id || `q${idx + 1}`,
          question: q.question as string,
          category: q.category as string,
          slide_mapping: q.slide_mapping as string,
          source: "ai_generated",
          why_important: q.why_important as string,
          skipped: false,
        }));
        researchContext = parsed.research_context || {};
        console.log(`[generate_interview_questions] AI generated ${questions.length} questions`);
      }
    } catch (parseError) {
      console.error("[generate_interview_questions] JSON parse error:", parseError);
    }
  }

  // Fallback to static questions if AI fails
  if (questions.length === 0) {
    console.log("[generate_interview_questions] Using fallback questions");
    questions = getFallbackQuestions(industry, fundingStage);
    researchContext = {
      industry_insights: [`${industry} industry analysis`],
      funding_stage: fundingStage,
      analyzed_at: new Date().toISOString(),
    };
  }

  return {
    success: true,
    questions,
    research_context: researchContext,
    total_questions: questions.length,
    ai_generated: questions[0]?.source === "ai_generated",
  };
}

function getFallbackQuestions(industry: string, fundingStage: string) {
  const industryQuestions: Record<string, Array<{ id: string; question: string; category: string; slide_mapping: string }>> = {
    ai_saas: [
      { id: "ai_1", question: "What specific AI/ML models power your product and how proprietary are they?", category: "product", slide_mapping: "solution" },
      { id: "ai_2", question: "How do you handle data privacy and model training with customer data?", category: "product", slide_mapping: "solution" },
      { id: "ai_3", question: "What's your path to achieving AI defensibility (data moats, proprietary models)?", category: "competition", slide_mapping: "competition" },
    ],
    fintech: [
      { id: "fin_1", question: "What regulatory licenses do you have or need?", category: "product", slide_mapping: "solution" },
      { id: "fin_2", question: "How do you acquire customers and what's your CAC?", category: "market", slide_mapping: "business_model" },
      { id: "fin_3", question: "What partnerships with banks or financial institutions do you have?", category: "market", slide_mapping: "traction" },
    ],
    healthcare: [
      { id: "hc_1", question: "What's your path to FDA approval or regulatory clearance?", category: "product", slide_mapping: "solution" },
      { id: "hc_2", question: "How do you work with healthcare providers or payers?", category: "market", slide_mapping: "market" },
      { id: "hc_3", question: "What clinical evidence supports your solution?", category: "traction", slide_mapping: "traction" },
    ],
  };

  const baseQuestions = [
    { id: "gen_1", question: "What specific metrics demonstrate your product-market fit?", category: "traction", slide_mapping: "traction" },
    { id: "gen_2", question: "How do you acquire customers today and what's working best?", category: "market", slide_mapping: "business_model" },
    { id: "gen_3", question: "What are your unit economics (CAC, LTV)?", category: "financials", slide_mapping: "business_model" },
    { id: "gen_4", question: "Who are your key competitors and how are you differentiated?", category: "competition", slide_mapping: "competition" },
    { id: "gen_5", question: "What's your team's unfair advantage in this space?", category: "team", slide_mapping: "team" },
    { id: "gen_6", question: "What will you use the funding for over the next 18 months?", category: "financials", slide_mapping: "ask" },
  ];

  const industrySpecific = industryQuestions[industry] || [];
  return [...industrySpecific, ...baseQuestions].slice(0, 8).map(q => ({
    ...q,
    source: "fallback",
    skipped: false,
  }));
}
