/**
 * AI Helper for Pitch Deck Agent
 * V08: Consolidated to use _shared/gemini.ts (single Gemini client).
 * Removed Lovable AI Gateway dependency. All calls route through shared REST client.
 */

import {
  callGemini as sharedCallGemini,
  callGeminiChat as sharedCallGeminiChat,
  extractJSON as sharedExtractJSON,
} from "../_shared/gemini.ts";

// Re-export shared extractJSON
export { sharedExtractJSON as extractJSON };

// ============================================================================
// Text Generation (Gemini Pro/Flash via _shared/gemini.ts)
// ============================================================================

/**
 * Call Gemini for text generation.
 * Backward-compatible interface: returns { content?, toolCall? }
 */
export async function callGemini(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  _tools?: unknown[],
): Promise<{ content?: string; toolCall?: unknown }> {
  try {
    // Strip "google/" prefix if present (Lovable format → standard format)
    const cleanModel = model.replace(/^google\//, '');

    const result = await sharedCallGemini(cleanModel, systemPrompt, userPrompt, {
      timeoutMs: 30_000,
      maxOutputTokens: 4096,
    });

    return { content: result.text || undefined };
  } catch (error) {
    console.error("[callGemini] Error:", error instanceof Error ? error.message : error);
    return { content: undefined };
  }
}

// ============================================================================
// Google Search Grounding (Market Research)
// ============================================================================

export interface GroundedSearchResult {
  content?: string;
  citations?: string[];
  searchQueries?: string[];
}

/**
 * Call Gemini with Google Search grounding for market research.
 * Uses _shared/gemini.ts callGemini with useSearch option.
 */
export async function callGeminiWithGrounding(
  query: string,
  context: string,
): Promise<GroundedSearchResult> {
  const systemPrompt = `You are a market research analyst specializing in startup funding and competitive analysis.
Use the search results to find real-time, accurate data about:
- Market size and growth rates (TAM, SAM, SOM)
- Industry trends and forecasts
- Competitor information and funding rounds
- Relevant statistics and benchmarks

Always cite your sources. Return data that would strengthen an investor pitch deck.`;

  const userPrompt = `Research context: ${context}

Query: ${query}

Return a JSON response with:
{
  "market_size": { "tam": "...", "sam": "...", "som": "...", "source": "..." },
  "growth_rate": { "value": "...", "period": "...", "source": "..." },
  "key_trends": ["...", "..."],
  "competitors": [{ "name": "...", "funding": "...", "valuation": "..." }],
  "key_statistics": [{ "stat": "...", "value": "...", "source": "..." }]
}`;

  try {
    const result = await sharedCallGemini(
      'gemini-3.1-pro-preview',
      systemPrompt,
      userPrompt,
      {
        useSearch: true,
        timeoutMs: 30_000,
        maxOutputTokens: 4096,
      },
    );

    return {
      content: result.text || undefined,
      citations: result.citations || [],
      searchQueries: [],
    };
  } catch (error) {
    console.error("[callGeminiWithGrounding] Error:", error instanceof Error ? error.message : error);
    return { content: undefined };
  }
}

// ============================================================================
// Image Generation (Gemini Image via direct REST — no gateway)
// ============================================================================

export interface ImageGenerationResult {
  success: boolean;
  imageBase64?: string;
  error?: string;
}

/**
 * Generate a slide image using Gemini image model.
 * Uses direct Gemini REST API (not Lovable gateway).
 */
export async function generateSlideImage(
  prompt: string,
  slideType: string,
  brandColors?: { primary?: string; secondary?: string },
): Promise<ImageGenerationResult> {
  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  if (!GEMINI_API_KEY) {
    console.warn("[generateSlideImage] GEMINI_API_KEY not set");
    return { success: false, error: "API key not configured" };
  }

  const styleGuide = `
Style: Professional, clean, modern pitch deck aesthetic
Aspect ratio: 16:9
Colors: ${brandColors?.primary || "#1E3A5F"} primary, ${brandColors?.secondary || "#4A90D9"} accent
No text overlays - just visual elements
High contrast, suitable for presentations`;

  const slidePrompts: Record<string, string> = {
    title: "Abstract geometric pattern with depth and dimension, representing innovation and growth",
    problem: "Visual metaphor showing a challenge or obstacle, dramatic lighting, conceptual business illustration",
    solution: "Bright, optimistic visual showing breakthrough or clarity, light emerging from complexity",
    market: "Global network visualization, interconnected nodes representing market opportunity",
    traction: "Upward trending graph visualization with momentum, growth trajectory illustration",
    team: "Abstract representation of collaboration and expertise, professional team concept",
    competition: "Strategic positioning visualization, comparative landscape abstract",
    business_model: "Value flow diagram concept, monetization visual metaphor",
    ask: "Investment opportunity visualization, partnership and funding concept art",
  };

  const specificPrompt = slidePrompts[slideType] || slidePrompts.title;
  const fullPrompt = `Generate an image: ${specificPrompt}. ${styleGuide}. ${prompt}`;

  try {
    console.log(`[generateSlideImage] Generating image for ${slideType} slide`);

    const response = await Promise.race([
      fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
            generationConfig: {
              temperature: 1.0,
              responseModalities: ["IMAGE", "TEXT"],
            },
          }),
        },
      ),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Image generation timeout")), 60_000),
      ),
    ]);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[generateSlideImage] API error ${response.status}: ${errorText}`);
      return { success: false, error: `API error: ${response.status}` };
    }

    // deno-lint-ignore no-explicit-any
    const data = await response.json() as any;
    const parts = data?.candidates?.[0]?.content?.parts;

    if (parts) {
      for (const part of parts) {
        if (part.inlineData?.mimeType?.startsWith("image/")) {
          console.log(`[generateSlideImage] Successfully generated image for ${slideType}`);
          return { success: true, imageBase64: part.inlineData.data };
        }
      }
    }

    console.log("[generateSlideImage] No image in response");
    return { success: false, error: "No image generated" };
  } catch (error) {
    console.error("[generateSlideImage] Error:", error instanceof Error ? error.message : error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// ============================================================================
// Batch Image Generation for Full Deck
// ============================================================================

export async function generateDeckImages(
  slides: Array<{ slide_type: string; title: string }>,
  companyContext: string,
  brandColors?: { primary?: string; secondary?: string },
): Promise<Map<string, string>> {
  const imageMap = new Map<string, string>();

  const prioritySlides = ["title", "problem", "solution", "market", "traction"];

  for (const slide of slides) {
    if (prioritySlides.includes(slide.slide_type)) {
      const prompt = `${companyContext} - ${slide.title}`;
      const result = await generateSlideImage(prompt, slide.slide_type, brandColors);

      if (result.success && result.imageBase64) {
        imageMap.set(slide.slide_type, `data:image/png;base64,${result.imageBase64}`);
      }

      // Rate limiting between image requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log(`[generateDeckImages] Generated ${imageMap.size} images for deck`);
  return imageMap;
}
