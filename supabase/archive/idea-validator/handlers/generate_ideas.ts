/**
 * Idea generation from background using Gemini 3 Pro.
 * Persists to generated_ideas table.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AuthContext } from "../../../functions/_shared/auth.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

interface GeneratedIdea {
  title: string;
  one_liner: string;
  description?: string;
  problem_statement?: string;
  solution_description?: string;
  industry?: string;
  target_market?: string;
  pre_score?: number;
}

interface GenerateIdeasResult {
  ideas: GeneratedIdea[];
  generation_context: string;
}

const IDEA_GENERATION_PROMPT = `You are a startup idea generator. Based on the user's background, generate unique and viable startup ideas.

USER BACKGROUND:
{background}

Generate {count} startup ideas that:
1. Leverage the user's skills and experience
2. Solve real problems with market potential
3. Are differentiated from existing solutions
4. Have clear paths to revenue

Return JSON (no markdown):
{
  "ideas": [
    {
      "title": "Startup Name/Title",
      "one_liner": "One sentence pitch",
      "description": "2-3 sentence description",
      "problem_statement": "The problem being solved",
      "solution_description": "How it solves the problem",
      "industry": "Industry category",
      "target_market": "B2B|B2C|B2B2C",
      "pre_score": <40-85>
    }
  ],
  "generation_context": "Brief explanation of why these ideas fit the user"
}

Be creative but realistic. Pre-scores should vary - not all ideas are equal.`;

export async function handleGenerateIdeas(
  auth: AuthContext,
  background: string,
  count?: number
): Promise<GenerateIdeasResult> {
  const ideaCount = Math.min(Math.max(count || 3, 1), 10);
  let ideas: GeneratedIdea[] = [];
  let generationContext = "";

  if (GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = IDEA_GENERATION_PROMPT
        .replace("{background}", background)
        .replace("{count}", ideaCount.toString());

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        ideas = (parsed.ideas || []).slice(0, ideaCount).map((idea: any) => ({
          title: idea.title || "Untitled Idea",
          one_liner: idea.one_liner || "",
          description: idea.description,
          problem_statement: idea.problem_statement,
          solution_description: idea.solution_description,
          industry: idea.industry,
          target_market: idea.target_market,
          pre_score: Math.min(100, Math.max(0, idea.pre_score || 50)),
        }));
        generationContext = parsed.generation_context || "";
      } else {
        throw new Error("Failed to parse idea generation response");
      }
    } catch (aiError) {
      console.error("[generate_ideas] AI error:", aiError);
    }
  }

  // Fallback if no AI results
  if (ideas.length === 0) {
    ideas = Array.from({ length: ideaCount }, (_, i) => ({
      title: `Idea ${i + 1}`,
      one_liner: "Configure GEMINI_API_KEY for AI-powered idea generation",
      pre_score: 50,
    }));
    generationContext = "AI idea generation requires GEMINI_API_KEY configuration.";
  }

  // Persist to database
  const batchId = crypto.randomUUID();
  if (auth.supabase && ideas.length > 0 && ideas[0].title !== "Idea 1") {
    try {
      for (let i = 0; i < ideas.length; i++) {
        const idea = ideas[i];
        await auth.supabase.from("generated_ideas").insert({
          user_id: auth.user.id,
          background_input: { background },
          generation_type: "background_based",
          title: idea.title,
          one_liner: idea.one_liner,
          description: idea.description,
          problem_statement: idea.problem_statement,
          solution_description: idea.solution_description,
          industry: idea.industry,
          target_market: idea.target_market,
          pre_validation_score: idea.pre_score,
          batch_id: batchId,
          rank_in_batch: i + 1,
          status: "generated",
        });
      }
    } catch (dbError) {
      console.error("[generate_ideas] DB error:", dbError);
    }
  }

  return {
    ideas,
    generation_context: generationContext,
  };
}
