/**
 * TAM/SAM/SOM market sizing using Gemini.
 * Persists to market_sizes table.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AuthContext } from "../../../functions/_shared/auth.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

interface MarketSize {
  value: number;
  unit: string;
  currency: string;
  year?: number;
  methodology?: string;
  rationale?: string;
}

interface MarketSizerResult {
  tam: MarketSize;
  sam: MarketSize;
  som: MarketSize;
  assumptions: string[];
  growth_rate?: number;
  market_trends?: string[];
  confidence_level: "high" | "medium" | "low";
}

const MARKET_SIZE_PROMPT = `You are a market research analyst. Calculate TAM/SAM/SOM for this startup idea.

IDEA:
{idea_text}

REGION: {region}

Return a JSON object (no markdown, just JSON):
{
  "tam": {
    "value": <number>,
    "unit": "billion|million",
    "currency": "USD",
    "year": 2030,
    "methodology": "top-down|bottom-up|value-theory",
    "rationale": "Brief explanation"
  },
  "sam": {
    "value": <number>,
    "unit": "billion|million",
    "currency": "USD",
    "rationale": "Why this addressable market size"
  },
  "som": {
    "value": <number>,
    "unit": "million",
    "currency": "USD",
    "rationale": "Realistic obtainable market in 3-5 years"
  },
  "assumptions": ["assumption1", "assumption2", "assumption3"],
  "growth_rate": <CAGR percentage>,
  "market_trends": ["trend1", "trend2"],
  "confidence_level": "high|medium|low"
}

Be realistic with market sizes. TAM should be the total market, SAM the addressable segment, SOM the realistic capture.`;

export async function handleMarketSizer(
  auth: AuthContext,
  ideaText: string,
  region?: string
): Promise<MarketSizerResult> {
  let result: MarketSizerResult;

  if (GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = MARKET_SIZE_PROMPT
        .replace("{idea_text}", ideaText)
        .replace("{region}", region || "global");

      const aiResult = await model.generateContent(prompt);
      const responseText = aiResult.response.text();

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        result = {
          tam: {
            value: parsed.tam?.value || 50,
            unit: parsed.tam?.unit || "billion",
            currency: parsed.tam?.currency || "USD",
            year: parsed.tam?.year || 2030,
            methodology: parsed.tam?.methodology,
            rationale: parsed.tam?.rationale,
          },
          sam: {
            value: parsed.sam?.value || 5,
            unit: parsed.sam?.unit || "billion",
            currency: parsed.sam?.currency || "USD",
            rationale: parsed.sam?.rationale,
          },
          som: {
            value: parsed.som?.value || 100,
            unit: parsed.som?.unit || "million",
            currency: parsed.som?.currency || "USD",
            rationale: parsed.som?.rationale,
          },
          assumptions: parsed.assumptions || [],
          growth_rate: parsed.growth_rate,
          market_trends: parsed.market_trends,
          confidence_level: ["high", "medium", "low"].includes(parsed.confidence_level)
            ? parsed.confidence_level : "medium",
        };
      } else {
        throw new Error("Failed to parse market size response");
      }
    } catch (aiError) {
      console.error("[market_sizer] AI error:", aiError);
      result = getFallbackResult();
    }
  } else {
    result = getFallbackResult();
  }

  // Persist to database
  if (auth.supabase && result.confidence_level !== "low") {
    try {
      await auth.supabase.from("market_sizes").insert({
        startup_id: auth.startupId,
        industry: "general",
        region: region || "global",
        tam_value: result.tam.value,
        tam_unit: result.tam.unit,
        tam_currency: result.tam.currency,
        tam_year: result.tam.year,
        tam_methodology: result.tam.methodology,
        sam_value: result.sam.value,
        sam_rationale: result.sam.rationale,
        som_value: result.som.value,
        som_rationale: result.som.rationale,
        growth_rate: result.growth_rate,
        market_trends: result.market_trends,
        confidence_level: result.confidence_level,
        data_quality: "estimated",
      });
    } catch (dbError) {
      console.error("[market_sizer] DB error:", dbError);
    }
  }

  return result;
}

function getFallbackResult(): MarketSizerResult {
  return {
    tam: { value: 50, unit: "billion", currency: "USD", year: 2030 },
    sam: { value: 5, unit: "billion", currency: "USD" },
    som: { value: 100, unit: "million", currency: "USD" },
    assumptions: [
      "Market sizing requires AI analysis",
      "Configure GEMINI_API_KEY for accurate estimates",
      "Values are placeholder estimates",
    ],
    confidence_level: "low",
  };
}
