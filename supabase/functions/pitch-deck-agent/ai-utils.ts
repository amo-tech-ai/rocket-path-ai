/**
 * AI Helper: Lovable AI Gateway utilities
 * Supports: Text generation, Google Search grounding, Image generation
 */

const LOVABLE_AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

// Hard timeout wrapper — AbortSignal.timeout unreliable on Deno Deploy for .json()
async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function jsonWithTimeout<T>(res: Response, timeoutMs = 15_000): Promise<T> {
  return Promise.race([
    res.json() as Promise<T>,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("JSON parse timeout")), timeoutMs),
    ),
  ]);
}

// ============================================================================
// Text Generation (Gemini Pro/Flash)
// ============================================================================

export async function callGemini(
  model: "google/gemini-3-pro-preview" | "google/gemini-3-flash-preview",
  systemPrompt: string,
  userPrompt: string,
  tools?: unknown[]
): Promise<{ content?: string; toolCall?: unknown }> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    console.warn("[callGemini] LOVABLE_API_KEY not set, using fallback");
    return { content: undefined };
  }

  const body: Record<string, unknown> = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  };

  if (tools && tools.length > 0) {
    body.tools = tools;
    body.tool_choice = "auto";
  }

  try {
    const response = await fetchWithTimeout(LOVABLE_AI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }, 30_000);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[callGemini] API error ${response.status}: ${errorText}`);
      return { content: undefined };
    }

    const data = await jsonWithTimeout<Record<string, unknown>>(response);
    const choice = (data.choices as unknown[])?.[0] as Record<string, unknown> | undefined;
    const message = choice?.message as Record<string, unknown> | undefined;

    if ((message?.tool_calls as unknown[])?.[0]) {
      return { toolCall: (message!.tool_calls as unknown[])[0] };
    }

    return { content: (message?.content as string) || undefined };
  } catch (error) {
    console.error("[callGemini] Error:", error);
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

export async function callGeminiWithGrounding(
  query: string,
  context: string
): Promise<GroundedSearchResult> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    console.warn("[callGeminiWithGrounding] LOVABLE_API_KEY not set");
    return { content: undefined };
  }

  // Use google_search tool for grounding
  const googleSearchTool = {
    type: "function",
    function: {
      name: "google_search",
      description: "Search Google for real-time market data, competitor information, and industry statistics",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query"
          }
        },
        required: ["query"]
      }
    }
  };

  const systemPrompt = `You are a market research analyst specializing in startup funding and competitive analysis.
Use Google Search grounding to find real-time, accurate data about:
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
    const response = await fetchWithTimeout(LOVABLE_AI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [googleSearchTool],
        tool_choice: "auto",
      }),
    }, 30_000);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[callGeminiWithGrounding] API error ${response.status}: ${errorText}`);
      return { content: undefined };
    }

    // deno-lint-ignore no-explicit-any
    const data = await jsonWithTimeout<any>(response);
    const choice = data.choices?.[0];
    
    // Extract citations if available
    const citations: string[] = [];
    if (choice?.message?.tool_calls) {
      for (const toolCall of choice.message.tool_calls) {
        if (toolCall.function?.name === "google_search") {
          try {
            const args = JSON.parse(toolCall.function.arguments);
            citations.push(`Search: ${args.query}`);
          } catch {
            // Ignore parse errors
          }
        }
      }
    }

    return {
      content: choice?.message?.content || undefined,
      citations,
      searchQueries: citations,
    };
  } catch (error) {
    console.error("[callGeminiWithGrounding] Error:", error);
    return { content: undefined };
  }
}

// ============================================================================
// Image Generation (Gemini Image)
// ============================================================================

export interface ImageGenerationResult {
  success: boolean;
  imageBase64?: string;
  error?: string;
}

export async function generateSlideImage(
  prompt: string,
  slideType: string,
  brandColors?: { primary?: string; secondary?: string }
): Promise<ImageGenerationResult> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    console.warn("[generateSlideImage] LOVABLE_API_KEY not set");
    return { success: false, error: "API key not configured" };
  }

  // Build image prompt based on slide type
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
  const fullPrompt = `${specificPrompt}. ${styleGuide}. ${prompt}`;

  try {
    console.log(`[generateSlideImage] Generating image for ${slideType} slide`);

    const response = await fetchWithTimeout(LOVABLE_AI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [
          { role: "user", content: fullPrompt }
        ],
        modalities: ["image", "text"],
      }),
    }, 60_000); // Image generation needs longer timeout

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[generateSlideImage] API error ${response.status}: ${errorText}`);
      return { success: false, error: `API error: ${response.status}` };
    }

    // deno-lint-ignore no-explicit-any
    const data = await jsonWithTimeout<any>(response, 30_000);
    const images = data.choices?.[0]?.message?.images;
    
    if (images && images.length > 0) {
      const imageUrl = images[0]?.image_url?.url;
      if (imageUrl && imageUrl.startsWith("data:image")) {
        // Extract base64 from data URL
        const base64Match = imageUrl.match(/base64,(.+)/);
        if (base64Match) {
          console.log(`[generateSlideImage] Successfully generated image for ${slideType}`);
          return { success: true, imageBase64: base64Match[1] };
        }
      }
    }

    console.log("[generateSlideImage] No image in response");
    return { success: false, error: "No image generated" };
  } catch (error) {
    console.error("[generateSlideImage] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// ============================================================================
// Batch Image Generation for Full Deck
// ============================================================================

export async function generateDeckImages(
  slides: Array<{ slide_type: string; title: string }>,
  companyContext: string,
  brandColors?: { primary?: string; secondary?: string }
): Promise<Map<string, string>> {
  const imageMap = new Map<string, string>();
  
  // Generate images for key slides (not all to save cost)
  const prioritySlides = ["title", "problem", "solution", "market", "traction"];
  
  for (const slide of slides) {
    if (prioritySlides.includes(slide.slide_type)) {
      const prompt = `${companyContext} - ${slide.title}`;
      const result = await generateSlideImage(prompt, slide.slide_type, brandColors);
      
      if (result.success && result.imageBase64) {
        imageMap.set(slide.slide_type, `data:image/png;base64,${result.imageBase64}`);
      }
      
      // Rate limiting - wait between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log(`[generateDeckImages] Generated ${imageMap.size} images for deck`);
  return imageMap;
}

// ============================================================================
// JSON Extraction Utility
// ============================================================================

export function extractJSON<T>(text: string | undefined): T | null {
  if (!text) return null;
  
  try {
    // Try to find JSON in the response
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || 
                      text.match(/```\s*([\s\S]*?)\s*```/) ||
                      text.match(/\{[\s\S]*\}/) ||
                      text.match(/\[[\s\S]*\]/);
    
    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      return JSON.parse(jsonStr.trim());
    }
    return null;
  } catch {
    console.error("[extractJSON] Failed to parse JSON from response");
    return null;
  }
}
