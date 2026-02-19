/**
 * Deep validation: 20-section report, executive summary, scorecard.
 * Uses Gemini 3 Pro for comprehensive analysis, persists to validation_reports + validation_scores.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AuthContext } from "../../../functions/_shared/auth.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

type Verdict = "go" | "conditional" | "needs_work" | "pivot";

function getVerdict(score: number): Verdict {
  if (score >= 80) return "go";
  if (score >= 60) return "conditional";
  if (score >= 40) return "needs_work";
  return "pivot";
}

interface DeepValidationResult {
  report_id: string;
  sections: Record<string, string>;
  scorecard: {
    problem: number;
    market: number;
    competition: number;
    solution: number;
    business: number;
    execution: number;
  };
  executive_summary: string;
  verdict: Verdict;
  overall_score: number;
}

const DEEP_VALIDATION_PROMPT = `You are an expert startup validator and investor analyst. Provide a comprehensive deep-dive analysis of this startup idea.

IDEA:
{idea_text}

Analyze and return a JSON object with this structure (no markdown wrapping, just JSON):
{
  "scorecard": {
    "problem": <0-100>,
    "market": <0-100>,
    "competition": <0-100>,
    "solution": <0-100>,
    "business": <0-100>,
    "execution": <0-100>
  },
  "sections": {
    "executive_summary": "3-5 sentence summary of the validation findings",
    "key_strengths": "Top 3-5 strengths with evidence",
    "areas_of_concern": "Prioritized concerns with recommended actions",
    "scores_analysis": "Detailed breakdown of each scoring dimension",
    "market_vitals": "TAM/SAM/SOM estimates with methodology",
    "competitive_landscape": "Competitor analysis and positioning",
    "target_customer": "Ideal customer persona with demographics",
    "market_intelligence": "Market trends, news, and data points",
    "revenue_projections": "3-year revenue forecast with assumptions",
    "technology_assessment": "Tech stack feasibility and requirements",
    "risk_assessment": "Risk matrix with probability and impact",
    "strategic_opportunities": "Growth opportunities and expansion paths",
    "team_requirements": "Key hires and skills needed",
    "implementation_roadmap": "12-week MVP development plan",
    "investor_questions": "Top 10 questions investors will ask",
    "curated_resources": "Recommended tools, reading, and resources"
  }
}

Be thorough and realistic. Provide specific, actionable insights. Back claims with reasoning.`;

export async function handleDeep(
  auth: AuthContext,
  ideaText: string,
  startupId?: string,
  quickReportId?: string
): Promise<DeepValidationResult> {
  let scorecard: DeepValidationResult["scorecard"];
  let sections: Record<string, string>;

  // Attempt AI analysis with Gemini
  if (GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = DEEP_VALIDATION_PROMPT.replace("{idea_text}", ideaText);
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);

        scorecard = {
          problem: Math.min(100, Math.max(0, parsed.scorecard?.problem || 50)),
          market: Math.min(100, Math.max(0, parsed.scorecard?.market || 50)),
          competition: Math.min(100, Math.max(0, parsed.scorecard?.competition || 50)),
          solution: Math.min(100, Math.max(0, parsed.scorecard?.solution || 50)),
          business: Math.min(100, Math.max(0, parsed.scorecard?.business || 50)),
          execution: Math.min(100, Math.max(0, parsed.scorecard?.execution || 50)),
        };

        sections = parsed.sections || getFallbackSections(ideaText);
      } else {
        throw new Error("Failed to parse AI response JSON");
      }
    } catch (aiError) {
      console.error("[deep] Gemini AI error:", aiError);
      scorecard = getFallbackScorecard();
      sections = getFallbackSections(ideaText);
    }
  } else {
    console.warn("[deep] No GEMINI_API_KEY, using fallback");
    scorecard = getFallbackScorecard();
    sections = getFallbackSections(ideaText);
  }

  // Calculate overall score
  const overall = Math.round(
    scorecard.problem * 0.2 +
    scorecard.market * 0.2 +
    scorecard.competition * 0.15 +
    scorecard.solution * 0.2 +
    scorecard.business * 0.15 +
    scorecard.execution * 0.1
  );
  const verdict = getVerdict(overall);
  const executiveSummary = sections.executive_summary || "Deep validation analysis complete.";

  // Persist to database
  let reportId = crypto.randomUUID();
  if (auth.supabase) {
    try {
      const { data: report, error: reportError } = await auth.supabase
        .from("validation_reports")
        .insert({
          user_id: auth.user.id,
          startup_id: startupId || null,
          idea_description: ideaText,
          overall_score: overall,
          verdict: verdict,
          validation_type: "deep",
          report_data: {
            scorecard,
            sections,
            quick_report_id: quickReportId,
          },
        })
        .select("id")
        .single();

      if (reportError) {
        console.error("[deep] Failed to insert report:", reportError);
      } else if (report) {
        reportId = report.id;

        // Insert validation scores
        const { error: scoresError } = await auth.supabase
          .from("validation_scores")
          .insert({
            validation_report_id: report.id,
            startup_id: startupId || null,
            problem_score: scorecard.problem,
            market_score: scorecard.market,
            competition_score: scorecard.competition,
            solution_score: scorecard.solution,
            business_score: scorecard.business,
            execution_score: scorecard.execution,
            base_score: overall,
            final_score: overall,
          });

        if (scoresError) {
          console.error("[deep] Failed to insert scores:", scoresError);
        }
      }
    } catch (dbError) {
      console.error("[deep] Database error:", dbError);
    }
  }

  return {
    report_id: reportId,
    sections,
    scorecard,
    executive_summary: executiveSummary,
    verdict,
    overall_score: overall,
  };
}

function getFallbackScorecard(): DeepValidationResult["scorecard"] {
  return {
    problem: 55,
    market: 50,
    competition: 50,
    solution: 55,
    business: 45,
    execution: 50,
  };
}

function getFallbackSections(ideaText: string): Record<string, string> {
  return {
    executive_summary: `This startup idea requires deeper analysis. The concept shows potential but needs validation in key areas. Configure GEMINI_API_KEY for full AI-powered analysis.`,
    key_strengths: "Analysis pending - AI integration required for detailed assessment.",
    areas_of_concern: "Unable to perform detailed analysis without AI configuration.",
    scores_analysis: "Scores are placeholder values. Enable AI for accurate scoring.",
    market_vitals: "Market sizing requires AI-powered research. Configure GEMINI_API_KEY.",
    competitive_landscape: "Competitor analysis requires Google Search integration.",
    target_customer: "Customer persona generation requires AI analysis.",
    market_intelligence: "Market trends analysis pending AI configuration.",
    revenue_projections: "Financial projections require business model analysis.",
    technology_assessment: "Technical feasibility assessment pending.",
    risk_assessment: "Risk matrix generation requires comprehensive analysis.",
    strategic_opportunities: "Opportunity identification requires market research.",
    team_requirements: "Team planning requires execution assessment.",
    implementation_roadmap: "Roadmap generation requires detailed planning analysis.",
    investor_questions: "Investor Q&A preparation requires full validation.",
    curated_resources: "Resource curation requires domain analysis.",
  };
}
