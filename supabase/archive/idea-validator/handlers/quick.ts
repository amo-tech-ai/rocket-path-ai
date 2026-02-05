/**
 * Quick validation: 60-second score, 6 dimensions, verdict.
 * Uses Gemini 3 Flash for fast analysis, persists to validation_reports + validation_scores.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AuthContext } from "../../../functions/_shared/auth.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const WEIGHTS = {
  problem: 0.2,
  market: 0.2,
  competition: 0.15,
  solution: 0.2,
  business: 0.15,
  execution: 0.1,
} as const;

// Match schema verdict values exactly
type Verdict = "go" | "conditional" | "needs_work" | "pivot";

function getVerdict(score: number): Verdict {
  if (score >= 80) return "go";
  if (score >= 60) return "conditional";
  if (score >= 40) return "needs_work";
  return "pivot";
}

interface QuickValidationResult {
  score: number;
  verdict: Verdict;
  scorecard: {
    problem: number;
    market: number;
    competition: number;
    solution: number;
    business: number;
    execution: number;
  };
  strengths: string[];
  concerns: string[];
  report_id?: string;
}

const QUICK_VALIDATION_PROMPT = `You are an expert startup validator. Analyze this startup idea and provide a structured assessment.

IDEA:
{idea_text}

Evaluate across 6 dimensions (score 0-100 each):
1. Problem Clarity - Is the problem real, specific, urgent?
2. Market Size - TAM/SAM/SOM potential
3. Competition - Competitive landscape risk (higher = less competitive = better)
4. Solution Fit - Does solution match problem?
5. Business Model - Revenue viability
6. Execution - Team/feasibility assessment

Return a JSON object with this EXACT structure (no markdown, just JSON):
{
  "problem": <0-100>,
  "market": <0-100>,
  "competition": <0-100>,
  "solution": <0-100>,
  "business": <0-100>,
  "execution": <0-100>,
  "strengths": ["strength1", "strength2", "strength3"],
  "concerns": ["concern1", "concern2", "concern3"]
}

Be realistic and critical. Most ideas should score 40-70. Only exceptional ideas score above 80.`;

export async function handleQuick(
  auth: AuthContext,
  ideaText: string,
  startupId?: string
): Promise<QuickValidationResult> {
  let scorecard: QuickValidationResult["scorecard"];
  let strengths: string[];
  let concerns: string[];

  // Attempt AI analysis with Gemini
  if (GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = QUICK_VALIDATION_PROMPT.replace("{idea_text}", ideaText);
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Extract JSON from response (handle potential markdown wrapping)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        scorecard = {
          problem: Math.min(100, Math.max(0, parsed.problem || 50)),
          market: Math.min(100, Math.max(0, parsed.market || 50)),
          competition: Math.min(100, Math.max(0, parsed.competition || 50)),
          solution: Math.min(100, Math.max(0, parsed.solution || 50)),
          business: Math.min(100, Math.max(0, parsed.business || 50)),
          execution: Math.min(100, Math.max(0, parsed.execution || 50)),
        };
        strengths = Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 5) : [];
        concerns = Array.isArray(parsed.concerns) ? parsed.concerns.slice(0, 5) : [];
      } else {
        throw new Error("Failed to parse AI response JSON");
      }
    } catch (aiError) {
      console.error("[quick] Gemini AI error:", aiError);
      // Fallback to heuristic scoring
      scorecard = getFallbackScorecard(ideaText);
      strengths = ["Clear problem statement"];
      concerns = ["AI analysis unavailable - using heuristic scoring"];
    }
  } else {
    // No API key - use fallback
    console.warn("[quick] No GEMINI_API_KEY, using fallback scoring");
    scorecard = getFallbackScorecard(ideaText);
    strengths = ["Clear problem statement"];
    concerns = ["AI analysis unavailable - configure GEMINI_API_KEY"];
  }

  // Calculate weighted overall score
  const overall =
    scorecard.problem * WEIGHTS.problem +
    scorecard.market * WEIGHTS.market +
    scorecard.competition * WEIGHTS.competition +
    scorecard.solution * WEIGHTS.solution +
    scorecard.business * WEIGHTS.business +
    scorecard.execution * WEIGHTS.execution;
  const score = Math.round(overall);
  const verdict = getVerdict(score);

  // Persist to database if we have auth context
  let reportId: string | undefined;
  if (auth.supabase) {
    try {
      // Insert validation report
      const { data: report, error: reportError } = await auth.supabase
        .from("validation_reports")
        .insert({
          user_id: auth.user.id,
          startup_id: startupId || null,
          idea_description: ideaText,
          overall_score: score,
          verdict: verdict,
          validation_type: "quick",
          report_data: {
            scorecard,
            strengths,
            concerns,
          },
        })
        .select("id")
        .single();

      if (reportError) {
        console.error("[quick] Failed to insert report:", reportError);
      } else if (report) {
        reportId = report.id;

        // Insert validation scores for historical tracking
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
            base_score: score,
            final_score: score,
            weights: WEIGHTS,
          });

        if (scoresError) {
          console.error("[quick] Failed to insert scores:", scoresError);
        }
      }
    } catch (dbError) {
      console.error("[quick] Database error:", dbError);
    }
  }

  return {
    score,
    verdict,
    scorecard,
    strengths,
    concerns,
    ...(reportId ? { report_id: reportId } : {}),
  };
}

/**
 * Fallback heuristic scoring when AI is unavailable
 */
function getFallbackScorecard(ideaText: string): QuickValidationResult["scorecard"] {
  // Simple heuristics based on text content
  const words = ideaText.toLowerCase().split(/\s+/).length;
  const hasNumbers = /\d/.test(ideaText);
  const hasProblem = /problem|pain|struggle|difficult|challenge/i.test(ideaText);
  const hasMarket = /market|customer|user|b2b|b2c|enterprise|consumer/i.test(ideaText);
  const hasSolution = /solution|platform|app|tool|service|software/i.test(ideaText);
  const hasRevenue = /revenue|pricing|subscription|saas|monetiz/i.test(ideaText);

  // Base scores with bonuses for good content
  return {
    problem: 45 + (hasProblem ? 15 : 0) + (words > 50 ? 10 : 0),
    market: 45 + (hasMarket ? 15 : 0) + (hasNumbers ? 10 : 0),
    competition: 50, // Neutral without AI research
    solution: 45 + (hasSolution ? 15 : 0) + (words > 30 ? 10 : 0),
    business: 40 + (hasRevenue ? 20 : 0),
    execution: 50, // Neutral without team info
  };
}
