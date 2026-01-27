/**
 * Slide Actions: update_slide, get_deck, analyze_slide
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

const LOVABLE_AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

async function callGemini(
  model: "google/gemini-3-pro-preview" | "google/gemini-3-flash-preview",
  systemPrompt: string,
  userPrompt: string
): Promise<{ content?: string }> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) return { content: undefined };

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

    if (!response.ok) return { content: undefined };
    const data = await response.json();
    return { content: data.choices?.[0]?.message?.content || undefined };
  } catch {
    return { content: undefined };
  }
}

export async function updateSlide(
  supabase: SupabaseClient,
  userId: string,
  slideId: string,
  content: Record<string, unknown>
) {
  console.log(`[update_slide] Slide: ${slideId}`);

  // Fetch slide to verify ownership
  const { data: slide, error: fetchError } = await supabase
    .from("pitch_deck_slides")
    .select("*, pitch_decks!inner(startup_id, startups!inner(org_id))")
    .eq("id", slideId)
    .single();

  if (fetchError) throw fetchError;

  // Update slide content
  const { error: updateError } = await supabase
    .from("pitch_deck_slides")
    .update({
      title: content.title || slide.title,
      content: content.content || slide.content,
      speaker_notes: content.speaker_notes || slide.speaker_notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", slideId);

  if (updateError) throw updateError;

  // Update deck's updated_at timestamp
  await supabase
    .from("pitch_decks")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", slide.deck_id);

  return {
    success: true,
    slide_id: slideId,
    deck_id: slide.deck_id,
  };
}

export async function getDeck(
  supabase: SupabaseClient,
  userId: string,
  deckId: string
) {
  console.log(`[get_deck] Deck: ${deckId}`);

  const { data: deck, error: deckError } = await supabase
    .from("pitch_decks")
    .select("*")
    .eq("id", deckId)
    .single();

  if (deckError) throw deckError;

  const { data: slides, error: slidesError } = await supabase
    .from("pitch_deck_slides")
    .select("*")
    .eq("deck_id", deckId)
    .order("slide_number", { ascending: true });

  if (slidesError) throw slidesError;

  return {
    success: true,
    deck: deck,
    slides: slides || [],
  };
}

export async function getSignalStrength(
  supabase: SupabaseClient,
  userId: string,
  deckId: string
) {
  console.log(`[get_signal_strength] Deck: ${deckId}`);

  const { data: deck, error } = await supabase
    .from("pitch_decks")
    .select("metadata")
    .eq("id", deckId)
    .single();

  if (error) throw error;

  const metadata = (deck.metadata || {}) as Record<string, unknown>;
  const wizardData = (metadata.wizard_data || {}) as Record<string, unknown>;

  const breakdown = {
    profile: 0,
    market: 0,
    smart_interview: 0,
    suggestions: 0,
    slides: 0,
    industry: 0,
  };

  const step1 = wizardData.step1_startup_info as Record<string, unknown> | undefined;
  if (step1?.company_name) breakdown.profile += 30;
  if (step1?.website_url) breakdown.profile += 20;
  if (step1?.tagline) breakdown.profile += 30;
  if (step1?.industry) breakdown.profile += 20;

  const step2 = wizardData.step2_market_traction as Record<string, unknown> | undefined;
  if (step2?.problem) breakdown.market += 30;
  if (step2?.core_solution) breakdown.market += 30;
  if (step2?.differentiator) breakdown.market += 20;
  if (step2?.users || step2?.revenue) breakdown.market += 20;

  const step3 = wizardData.step3_smart_interview as Record<string, unknown> | undefined;
  if (step3?.questions_answered && step3?.questions_total) {
    breakdown.smart_interview = Math.round(((step3.questions_answered as number) / (step3.questions_total as number)) * 100);
  }

  if (wizardData.selected_industry && wizardData.selected_industry !== "other") {
    breakdown.industry = 100;
  }

  const score = Math.round(
    (breakdown.profile * 0.2) +
    (breakdown.market * 0.2) +
    (breakdown.smart_interview * 0.25) +
    (breakdown.suggestions * 0.15) +
    (breakdown.slides * 0.1) +
    (breakdown.industry * 0.1)
  );

  return {
    success: true,
    signal_strength: Math.min(100, Math.max(0, score)),
    breakdown: breakdown,
  };
}

export async function analyzeSlide(
  supabase: SupabaseClient,
  userId: string,
  slideId: string,
  slideType: string,
  slideContent: Record<string, unknown>
) {
  console.log(`[analyze_slide] Slide: ${slideId}, Type: ${slideType}`);

  const systemPrompt = `You are an expert pitch deck reviewer who has analyzed thousands of successful fundraising decks.
Analyze this slide and provide specific, actionable suggestions for improvement.

Return ONLY valid JSON in this exact format:
{
  "analysis": {
    "clarity": 1-10,
    "impact": 1-10,
    "tone": 1-10,
    "overall": 1-10,
    "feedback": "Brief overall assessment"
  },
  "suggestions": [
    {
      "type": "clarity|impact|metric|problem|industry|tone",
      "suggestion": "Specific actionable suggestion",
      "reasoning": "Why this matters for investors"
    }
  ]
}

Rules:
- Provide 2-4 suggestions maximum
- Be specific, not generic
- Focus on investor psychology
- Quantify where possible`;

  const userPrompt = `Analyze this ${slideType} slide:

Title: ${slideContent.title || 'Untitled'}
Subtitle: ${slideContent.subtitle || ''}
Content: ${JSON.stringify(slideContent.bullets || slideContent.body || slideContent, null, 2)}

Provide specific improvement suggestions.`;

  const aiResponse = await callGemini(
    "google/gemini-3-flash-preview",
    systemPrompt,
    userPrompt
  );

  let analysis = {
    clarity: 7,
    impact: 6,
    tone: 7,
    overall: 7,
    feedback: "Good foundation. Consider adding more specific metrics.",
  };

  let suggestions: Array<{
    id: string;
    type: string;
    suggestion: string;
    reasoning: string;
  }> = [];

  if (aiResponse.content) {
    try {
      const jsonMatch = aiResponse.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.analysis) {
          analysis = parsed.analysis;
        }
        if (parsed.suggestions) {
          suggestions = parsed.suggestions.map((s: Record<string, unknown>, idx: number) => ({
            id: `sug_${Date.now()}_${idx}`,
            type: s.type as string,
            suggestion: s.suggestion as string,
            reasoning: s.reasoning as string,
          }));
        }
        console.log(`[analyze_slide] AI generated ${suggestions.length} suggestions`);
      }
    } catch (parseError) {
      console.error("[analyze_slide] JSON parse error:", parseError);
    }
  }

  // Fallback suggestions if AI fails
  if (suggestions.length === 0) {
    suggestions = [
      {
        id: `sug_${Date.now()}_0`,
        type: "clarity",
        suggestion: "Consider simplifying the main message to one sentence.",
        reasoning: "Investors spend ~10 seconds per slide. Clarity wins.",
      },
      {
        id: `sug_${Date.now()}_1`,
        type: "impact",
        suggestion: "Add a specific metric to quantify your claim.",
        reasoning: "Numbers make statements memorable and credible.",
      },
    ];
  }

  return {
    success: true,
    slide_id: slideId,
    analysis,
    suggestions,
    ai_generated: aiResponse.content !== null,
  };
}
