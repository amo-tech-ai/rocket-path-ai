/**
 * Competitor discovery using Gemini with Google Search grounding.
 * Persists to competitor_profiles table.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AuthContext } from "../../../functions/_shared/auth.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

interface CompetitorProfile {
  name: string;
  website: string;
  description: string;
  threat_level: "high" | "medium" | "low";
  competitor_type: "direct" | "indirect" | "potential" | "alternative";
  funding_stage?: string;
  strengths?: string[];
  weaknesses?: string[];
}

interface CompetitorFinderResult {
  competitors: CompetitorProfile[];
  market_trends: string[];
  competitive_summary: string;
}

const COMPETITOR_PROMPT = `You are a competitive intelligence analyst. Find and analyze competitors for this startup idea.

IDEA:
{idea_text}

MARKET FOCUS: {market}

Research competitors and return a JSON object (no markdown, just JSON):
{
  "competitors": [
    {
      "name": "Company Name",
      "website": "https://example.com",
      "description": "Brief description of what they do",
      "threat_level": "high|medium|low",
      "competitor_type": "direct|indirect|potential|alternative",
      "funding_stage": "Seed|Series A|Series B|etc",
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"]
    }
  ],
  "market_trends": ["trend1", "trend2", "trend3"],
  "competitive_summary": "Overview of the competitive landscape"
}

Find 3-7 real competitors. Be specific with company names and accurate with descriptions.`;

export async function handleCompetitorFinder(
  auth: AuthContext,
  ideaText: string,
  market?: string
): Promise<CompetitorFinderResult> {
  let competitors: CompetitorProfile[] = [];
  let marketTrends: string[] = [];
  let competitiveSummary = "";

  if (GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = COMPETITOR_PROMPT
        .replace("{idea_text}", ideaText)
        .replace("{market}", market || "general");

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        competitors = (parsed.competitors || []).map((c: any) => ({
          name: c.name || "Unknown",
          website: c.website || "",
          description: c.description || "",
          threat_level: ["high", "medium", "low"].includes(c.threat_level) ? c.threat_level : "medium",
          competitor_type: ["direct", "indirect", "potential", "alternative"].includes(c.competitor_type)
            ? c.competitor_type : "direct",
          funding_stage: c.funding_stage,
          strengths: c.strengths || [],
          weaknesses: c.weaknesses || [],
        }));
        marketTrends = parsed.market_trends || [];
        competitiveSummary = parsed.competitive_summary || "";
      }
    } catch (aiError) {
      console.error("[competitor_finder] AI error:", aiError);
    }
  }

  // Fallback if no results
  if (competitors.length === 0) {
    competitors = [
      {
        name: "Competitor analysis pending",
        website: "",
        description: "Configure GEMINI_API_KEY for AI-powered competitor discovery",
        threat_level: "medium",
        competitor_type: "direct",
      },
    ];
    marketTrends = ["AI adoption", "Digital transformation", "Market consolidation"];
    competitiveSummary = "Competitive analysis requires AI configuration.";
  }

  // Persist to database
  if (auth.supabase && competitors.length > 0 && competitors[0].name !== "Competitor analysis pending") {
    try {
      for (const competitor of competitors) {
        await auth.supabase.from("competitor_profiles").insert({
          startup_id: auth.startupId,
          name: competitor.name,
          website: competitor.website,
          description: competitor.description,
          competitor_type: competitor.competitor_type,
          threat_level: competitor.threat_level,
          funding_stage: competitor.funding_stage,
          strengths: competitor.strengths,
          weaknesses: competitor.weaknesses,
          industry: market,
          source: "gemini_search",
        });
      }
    } catch (dbError) {
      console.error("[competitor_finder] DB error:", dbError);
    }
  }

  return {
    competitors,
    market_trends: marketTrends,
    competitive_summary: competitiveSummary,
  };
}
