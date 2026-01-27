/**
 * AI Helper: Lovable AI Gateway utilities for Lean Canvas
 */

const LOVABLE_AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

export async function callGemini(
  model: "google/gemini-3-pro-preview" | "google/gemini-3-flash-preview",
  systemPrompt: string,
  userPrompt: string
): Promise<string | undefined> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    console.warn("[callGemini] LOVABLE_API_KEY not set, using fallback");
    return undefined;
  }

  try {
    const response = await fetch(LOVABLE_AI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[callGemini] API error ${response.status}: ${errorText}`);
      return undefined;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || undefined;
  } catch (error) {
    console.error("[callGemini] Error:", error);
    return undefined;
  }
}

export function extractJSON<T>(text: string | undefined): T | null {
  if (!text) return null;
  
  try {
    // Try to find JSON in the response
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || 
                      text.match(/```\s*([\s\S]*?)\s*```/) ||
                      text.match(/\{[\s\S]*\}/);
    
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

// Compute a simple hash for profile comparison
export function computeProfileHash(profile: Record<string, unknown>): string {
  const relevantFields = [
    'description', 'tagline', 'industry', 'target_market',
    'traction_data', 'business_model', 'competitors', 'stage'
  ];
  
  const values = relevantFields.map(field => {
    const value = profile[field];
    if (Array.isArray(value)) return value.join(',');
    if (typeof value === 'object' && value !== null) return JSON.stringify(value);
    return String(value || '');
  });
  
  // Simple hash using string concatenation
  return btoa(values.join('|')).slice(0, 32);
}
