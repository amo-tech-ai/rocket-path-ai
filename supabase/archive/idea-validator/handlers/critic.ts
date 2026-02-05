/**
 * Critic agent: challenge assumptions, risk penalties using Claude.
 * Persists to critic_reviews table.
 */

import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AuthContext } from "../../../functions/_shared/auth.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

interface Risk {
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  probability?: number;
  impact?: number;
  mitigation?: string;
}

interface CriticResult {
  risks: Risk[];
  challenges: string[];
  risk_penalty: number;
  assumptions: Array<{ assumption: string; validity: string; evidence: string }>;
  investor_questions: string[];
  elephant_in_room?: string;
}

const CRITIC_PROMPT = `You are a devil's advocate investor analyst. Your job is to challenge this startup idea and identify all risks.

IDEA:
{idea_text}

{report_context}

Be harsh but fair. Identify real problems. Return JSON (no markdown):
{
  "risks": [
    {
      "title": "Risk title",
      "severity": "critical|high|medium|low",
      "description": "Why this is a risk",
      "probability": <1-5>,
      "impact": <1-5>,
      "mitigation": "How to address this risk"
    }
  ],
  "challenges": ["challenge1", "challenge2", "challenge3"],
  "assumptions": [
    {
      "assumption": "Assumption being made",
      "validity": "valid|questionable|invalid",
      "evidence": "What evidence supports or contradicts this"
    }
  ],
  "investor_questions": ["question1", "question2", "question3", "question4", "question5"],
  "elephant_in_room": "The biggest unaddressed issue with this idea"
}

Be specific and actionable. Identify 3-7 risks with varying severity levels.`;

export async function handleCritic(
  auth: AuthContext,
  ideaText: string,
  reportSummary?: string
): Promise<CriticResult> {
  let result: CriticResult;
  const reportContext = reportSummary
    ? `PREVIOUS VALIDATION SUMMARY:\n${reportSummary}`
    : "";

  // Try Claude first (preferred for critique), fallback to Gemini
  if (ANTHROPIC_API_KEY) {
    try {
      const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
      const prompt = CRITIC_PROMPT
        .replace("{idea_text}", ideaText)
        .replace("{report_context}", reportContext);

      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      });

      const responseText = message.content[0].type === "text"
        ? message.content[0].text
        : "";

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        result = parseResponse(parsed);
      } else {
        throw new Error("Failed to parse Claude response");
      }
    } catch (claudeError) {
      console.error("[critic] Claude error:", claudeError);
      // Try Gemini as fallback
      result = await tryGeminiFallback(ideaText, reportContext);
    }
  } else if (GEMINI_API_KEY) {
    result = await tryGeminiFallback(ideaText, reportContext);
  } else {
    result = getFallbackResult();
  }

  // Calculate risk penalty (0.5 to 2 pts per risk, max -10)
  const riskPenalty = Math.min(10, result.risks.reduce((sum, r) => {
    const severityPenalty = {
      critical: 2.5,
      high: 2,
      medium: 1,
      low: 0.5,
    };
    return sum + (severityPenalty[r.severity] || 1);
  }, 0));
  result.risk_penalty = Math.round(riskPenalty * 10) / 10;

  // Persist to database
  if (auth.supabase) {
    try {
      await auth.supabase.from("critic_reviews").insert({
        user_id: auth.user.id,
        startup_id: auth.startupId,
        validation_report_id: null,
        assumptions: result.assumptions,
        elephant_in_room: result.elephant_in_room,
        risks: result.risks,
        total_risk_score: result.risk_penalty,
        risk_level: getRiskLevel(result.risk_penalty),
        risk_deduction: result.risk_penalty,
        investor_questions: result.investor_questions,
        counter_arguments: result.challenges,
      });
    } catch (dbError) {
      console.error("[critic] DB error:", dbError);
    }
  }

  return result;
}

async function tryGeminiFallback(ideaText: string, reportContext: string): Promise<CriticResult> {
  if (!GEMINI_API_KEY) return getFallbackResult();

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = CRITIC_PROMPT
      .replace("{idea_text}", ideaText)
      .replace("{report_context}", reportContext);

    const aiResult = await model.generateContent(prompt);
    const responseText = aiResult.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parseResponse(parsed);
    }
  } catch (geminiError) {
    console.error("[critic] Gemini fallback error:", geminiError);
  }

  return getFallbackResult();
}

function parseResponse(parsed: any): CriticResult {
  return {
    risks: (parsed.risks || []).map((r: any) => ({
      title: r.title || "Unknown risk",
      severity: ["critical", "high", "medium", "low"].includes(r.severity) ? r.severity : "medium",
      description: r.description || "",
      probability: r.probability,
      impact: r.impact,
      mitigation: r.mitigation,
    })),
    challenges: parsed.challenges || [],
    risk_penalty: 0, // Calculated later
    assumptions: (parsed.assumptions || []).map((a: any) => ({
      assumption: a.assumption || "",
      validity: a.validity || "questionable",
      evidence: a.evidence || "",
    })),
    investor_questions: parsed.investor_questions || [],
    elephant_in_room: parsed.elephant_in_room,
  };
}

function getFallbackResult(): CriticResult {
  return {
    risks: [
      {
        title: "Critic analysis pending",
        severity: "medium",
        description: "Configure ANTHROPIC_API_KEY or GEMINI_API_KEY for risk assessment",
      },
    ],
    challenges: ["Enable AI for challenge identification"],
    risk_penalty: 2,
    assumptions: [],
    investor_questions: ["What is your unfair advantage?", "How do you acquire customers?"],
  };
}

function getRiskLevel(penalty: number): "critical" | "high" | "moderate" | "low" {
  if (penalty >= 8) return "critical";
  if (penalty >= 5) return "high";
  if (penalty >= 2) return "moderate";
  return "low";
}
