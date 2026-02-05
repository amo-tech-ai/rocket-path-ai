/**
 * Framework analysis (SWOT, PESTEL, Porter's, JTBD).
 * Persists to framework_analyses table.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AuthContext } from "../../../functions/_shared/auth.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

type FrameworkType = "swot" | "pestel" | "porter" | "jobs_to_be_done";

interface FrameworkAnalyzerResult {
  framework: FrameworkType;
  analysis: Record<string, string[]>;
  summary: string;
  key_insights: string[];
  recommendations: string[];
}

const FRAMEWORK_PROMPTS: Record<FrameworkType, string> = {
  swot: `Perform a SWOT analysis for this startup idea.

IDEA: {idea_text}

Return JSON (no markdown):
{
  "analysis": {
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2", "weakness3"],
    "opportunities": ["opportunity1", "opportunity2", "opportunity3"],
    "threats": ["threat1", "threat2", "threat3"]
  },
  "summary": "Overall SWOT summary",
  "key_insights": ["insight1", "insight2"],
  "recommendations": ["recommendation1", "recommendation2"]
}`,

  pestel: `Perform a PESTEL analysis for this startup idea.

IDEA: {idea_text}

Return JSON (no markdown):
{
  "analysis": {
    "political": ["factor1", "factor2"],
    "economic": ["factor1", "factor2"],
    "social": ["factor1", "factor2"],
    "technological": ["factor1", "factor2"],
    "environmental": ["factor1", "factor2"],
    "legal": ["factor1", "factor2"]
  },
  "summary": "Overall PESTEL summary",
  "key_insights": ["insight1", "insight2"],
  "recommendations": ["recommendation1", "recommendation2"]
}`,

  porter: `Perform Porter's Five Forces analysis for this startup idea.

IDEA: {idea_text}

Return JSON (no markdown):
{
  "analysis": {
    "competitive_rivalry": ["factor1", "factor2"],
    "supplier_power": ["factor1", "factor2"],
    "buyer_power": ["factor1", "factor2"],
    "threat_of_substitution": ["factor1", "factor2"],
    "threat_of_new_entry": ["factor1", "factor2"]
  },
  "summary": "Overall competitive forces summary",
  "key_insights": ["insight1", "insight2"],
  "recommendations": ["recommendation1", "recommendation2"]
}`,

  jobs_to_be_done: `Perform Jobs-to-be-Done analysis for this startup idea.

IDEA: {idea_text}

Return JSON (no markdown):
{
  "analysis": {
    "functional_jobs": ["job1", "job2", "job3"],
    "emotional_jobs": ["job1", "job2"],
    "social_jobs": ["job1", "job2"],
    "pain_points": ["pain1", "pain2", "pain3"],
    "gains": ["gain1", "gain2", "gain3"]
  },
  "summary": "Overall JTBD summary",
  "key_insights": ["insight1", "insight2"],
  "recommendations": ["recommendation1", "recommendation2"]
}`,
};

export async function handleFrameworkAnalyzer(
  auth: AuthContext,
  ideaText: string,
  framework?: string
): Promise<FrameworkAnalyzerResult> {
  const fw = (framework?.toLowerCase() as FrameworkType) || "swot";
  const validFramework: FrameworkType = ["swot", "pestel", "porter", "jobs_to_be_done"].includes(fw)
    ? fw : "swot";

  let analysis: Record<string, string[]>;
  let summary: string;
  let keyInsights: string[] = [];
  let recommendations: string[] = [];

  if (GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = FRAMEWORK_PROMPTS[validFramework].replace("{idea_text}", ideaText);
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        analysis = parsed.analysis || getDefaultAnalysis(validFramework);
        summary = parsed.summary || "Analysis complete.";
        keyInsights = parsed.key_insights || [];
        recommendations = parsed.recommendations || [];
      } else {
        throw new Error("Failed to parse framework analysis");
      }
    } catch (aiError) {
      console.error("[framework_analyzer] AI error:", aiError);
      analysis = getDefaultAnalysis(validFramework);
      summary = "Analysis requires AI configuration.";
    }
  } else {
    analysis = getDefaultAnalysis(validFramework);
    summary = "Configure GEMINI_API_KEY for AI-powered analysis.";
  }

  // Persist to database
  if (auth.supabase) {
    try {
      await auth.supabase.from("framework_analyses").insert({
        startup_id: auth.startupId,
        framework_type: validFramework,
        analysis_data: { analysis, summary },
        key_insights: keyInsights,
        recommendations: recommendations,
      });
    } catch (dbError) {
      console.error("[framework_analyzer] DB error:", dbError);
    }
  }

  return {
    framework: validFramework,
    analysis,
    summary,
    key_insights: keyInsights,
    recommendations,
  };
}

function getDefaultAnalysis(framework: FrameworkType): Record<string, string[]> {
  const defaults: Record<FrameworkType, Record<string, string[]>> = {
    swot: {
      strengths: ["Analysis pending"],
      weaknesses: ["Analysis pending"],
      opportunities: ["Analysis pending"],
      threats: ["Analysis pending"],
    },
    pestel: {
      political: ["Analysis pending"],
      economic: ["Analysis pending"],
      social: ["Analysis pending"],
      technological: ["Analysis pending"],
      environmental: ["Analysis pending"],
      legal: ["Analysis pending"],
    },
    porter: {
      competitive_rivalry: ["Analysis pending"],
      supplier_power: ["Analysis pending"],
      buyer_power: ["Analysis pending"],
      threat_of_substitution: ["Analysis pending"],
      threat_of_new_entry: ["Analysis pending"],
    },
    jobs_to_be_done: {
      functional_jobs: ["Analysis pending"],
      emotional_jobs: ["Analysis pending"],
      social_jobs: ["Analysis pending"],
      pain_points: ["Analysis pending"],
      gains: ["Analysis pending"],
    },
  };
  return defaults[framework];
}
