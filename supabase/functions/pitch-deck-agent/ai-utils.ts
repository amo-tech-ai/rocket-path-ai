/**
 * AI Helper: Call Lovable AI Gateway
 */

const LOVABLE_AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

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
    const response = await fetch(LOVABLE_AI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[callGemini] API error ${response.status}: ${errorText}`);
      return { content: undefined };
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    
    if (choice?.message?.tool_calls?.[0]) {
      return { toolCall: choice.message.tool_calls[0] };
    }
    
    return { content: choice?.message?.content || undefined };
  } catch (error) {
    console.error("[callGemini] Error:", error);
    return { content: undefined };
  }
}
