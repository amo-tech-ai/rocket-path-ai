/**
 * Deck Generation Actions: generate_deck
 */

import { callGemini } from "../ai-utils.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

interface SlideContent {
  slide_type: string;
  title: string;
  content: Record<string, unknown>;
  speaker_notes?: string;
}

export async function generateDeck(
  supabase: SupabaseClient,
  userId: string,
  deckId: string,
  template: string
) {
  console.log(`[generate_deck] Deck: ${deckId}, Template: ${template}`);

  // Fetch deck with wizard data
  const { data: deck, error: fetchError } = await supabase
    .from("pitch_decks")
    .select("*, startups(*)")
    .eq("id", deckId)
    .single();

  if (fetchError) throw fetchError;

  const metadata = (deck.metadata || {}) as Record<string, unknown>;
  const wizardData = (metadata.wizard_data || {}) as Record<string, unknown>;

  // Extract wizard data
  const step1 = (wizardData.step1_startup_info || {}) as Record<string, unknown>;
  const step2 = (wizardData.step2_market_traction || {}) as Record<string, unknown>;
  const step3 = (wizardData.step3_smart_interview || {}) as Record<string, unknown>;
  const interviewAnswers = (step3.answers || {}) as Record<string, string>;

  // Create generation log
  const generationLog = {
    id: crypto.randomUUID(),
    generation_status: "in_progress",
    started_at: new Date().toISOString(),
    ai_model_used: { model: "google/gemini-3-pro-preview", thinkingLevel: "high" },
  };

  // Update deck status to generating
  const updatedMetadata = {
    ...metadata,
    generation_logs: [...((metadata.generation_logs as unknown[]) || []), generationLog],
  };

  await supabase
    .from("pitch_decks")
    .update({ 
      status: "generating",
      metadata: updatedMetadata,
    })
    .eq("id", deckId);

  // Build comprehensive context for AI
  const companyContext = buildCompanyContext(step1, step2, interviewAnswers);
  const { systemPrompt, userPrompt } = buildGenerationPrompts(template, companyContext);

  // Try AI generation with Gemini Pro
  const aiResponse = await callGemini(
    "google/gemini-3-pro-preview",
    systemPrompt,
    userPrompt
  );

  let slides: SlideContent[] = [];

  if (aiResponse.content) {
    try {
      const jsonMatch = aiResponse.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        slides = (parsed.slides || []).map((s: Record<string, unknown>) => ({
          slide_type: s.slide_type as string,
          title: s.title as string,
          content: s.content as Record<string, unknown>,
          speaker_notes: s.speaker_notes as string,
        }));
        console.log(`[generate_deck] AI generated ${slides.length} slides`);
      }
    } catch (parseError) {
      console.error("[generate_deck] JSON parse error:", parseError);
    }
  }

  // Fallback to template-based slides if AI fails
  if (slides.length === 0) {
    console.log("[generate_deck] Using fallback template slides");
    slides = getFallbackSlides(step1, step2);
  }

  // Delete existing slides
  await supabase
    .from("pitch_deck_slides")
    .delete()
    .eq("deck_id", deckId);

  // Insert new slides
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    await supabase
      .from("pitch_deck_slides")
      .insert([{
        deck_id: deckId,
        slide_number: i + 1,
        slide_type: slide.slide_type,
        title: slide.title,
        content: slide.content,
        speaker_notes: slide.speaker_notes || null,
        is_visible: true,
      }]);
  }

  // Update generation log to completed
  (generationLog as Record<string, unknown>).generation_status = "completed";
  (generationLog as Record<string, unknown>).completed_at = new Date().toISOString();
  (generationLog as Record<string, unknown>).slide_count_generated = slides.length;
  (generationLog as Record<string, unknown>).ai_generated = slides.length > 0;

  const finalMetadata = {
    ...metadata,
    generation_logs: [
      ...((metadata.generation_logs as unknown[]) || []).filter((l: unknown) => (l as { id: string }).id !== generationLog.id), 
      generationLog
    ],
  };

  await supabase
    .from("pitch_decks")
    .update({ 
      status: "review",
      slide_count: slides.length,
      metadata: finalMetadata,
    })
    .eq("id", deckId);

  return {
    success: true,
    deck_id: deckId,
    title: deck.title,
    template: template,
    total_slides: slides.length,
    saved_slides: slides.length,
    generation_log_id: generationLog.id,
    ai_generated: aiResponse.content !== null,
  };
}

function buildCompanyContext(
  step1: Record<string, unknown>,
  step2: Record<string, unknown>,
  interviewAnswers: Record<string, string>
): string {
  return `
Company: ${step1.company_name || "Startup"}
Industry: ${step1.industry || "Technology"}
Stage: ${step1.stage || "Seed"}
Tagline: ${step1.tagline || ""}
Website: ${step1.website_url || ""}

Problem: ${step2.problem || "Not specified"}
Solution: ${step2.core_solution || "Not specified"}
Differentiator: ${step2.differentiator || "Not specified"}
Target Market: ${step2.target_market || "Not specified"}

Traction:
- Users: ${step2.users || "Not specified"}
- Revenue: ${step2.revenue || "Not specified"}
- Growth: ${step2.growth_rate || "Not specified"}

Funding:
- Stage: ${step2.funding_stage || "Seed"}
- Amount Raising: ${step2.raise_amount || "Not specified"}
- Use of Funds: ${step2.use_of_funds || "Not specified"}

Interview Answers:
${Object.entries(interviewAnswers).map(([q, a]) => `Q: ${q}\nA: ${a}`).join("\n\n")}
`;
}

function buildGenerationPrompts(template: string, companyContext: string) {
  const systemPrompt = `You are an expert pitch deck writer who has helped startups raise over $1B in venture capital.
Create compelling, investor-ready slide content that is specific, quantitative, and memorable.

Template style: ${template === "yc" ? "YC-style: Simple, direct, metrics-focused" : "Standard VC: Professional, comprehensive"}

Return ONLY valid JSON with exactly 10 slides in this format:
{
  "slides": [
    {
      "slide_type": "title|problem|solution|market|product|traction|competition|business_model|team|ask",
      "title": "Slide Title",
      "content": {
        "headline": "Main message (1 powerful sentence)",
        "body": "Supporting content with specific details",
        "bullets": ["Key point 1", "Key point 2", "Key point 3"],
        "metrics": {"label": "value"}
      },
      "speaker_notes": "What to say when presenting this slide"
    }
  ]
}

Requirements:
1. Every claim must be specific and quantifiable where possible
2. Use the exact numbers from the data provided
3. Make the problem emotionally compelling
4. Make the solution clear and differentiated
5. Include specific metrics in traction slide
6. Competition slide should position against real or implied competitors
7. Ask slide should be clear about amount and use of funds`;

  const userPrompt = `Create a complete 10-slide pitch deck for this startup:

${companyContext}

Generate compelling content for each slide that will resonate with investors.`;

  return { systemPrompt, userPrompt };
}

function getFallbackSlides(
  step1: Record<string, unknown>,
  step2: Record<string, unknown>
): SlideContent[] {
  return [
    { 
      slide_type: "title", 
      title: String(step1.company_name || "Company Name"), 
      content: { 
        headline: String(step1.tagline || "Transform how the world works"),
        body: String(step1.industry || "Technology"),
      } 
    },
    { 
      slide_type: "problem", 
      title: "The Problem", 
      content: { 
        headline: String(step2.problem || "A significant market problem exists"),
        bullets: ["Pain point 1", "Pain point 2", "Pain point 3"],
      } 
    },
    { 
      slide_type: "solution", 
      title: "Our Solution", 
      content: { 
        headline: String(step2.core_solution || "Our innovative solution"),
        body: String(step2.differentiator || "What makes us different"),
      } 
    },
    { 
      slide_type: "market", 
      title: "Market Opportunity", 
      content: { 
        headline: "Large and growing market",
        metrics: { "TAM": "$XB", "SAM": "$XB", "SOM": "$XM" },
      } 
    },
    { 
      slide_type: "product", 
      title: "How It Works", 
      content: { 
        headline: "Simple, powerful, effective",
        bullets: ["Feature 1", "Feature 2", "Feature 3"],
      } 
    },
    { 
      slide_type: "traction", 
      title: "Traction", 
      content: { 
        metrics: { 
          "Users": String(step2.users || "Growing"), 
          "Revenue": String(step2.revenue || "Early"),
          "Growth": String(step2.growth_rate || "Month-over-month"),
        },
      } 
    },
    { 
      slide_type: "competition", 
      title: "Competition", 
      content: { 
        headline: String(step2.differentiator || "Our unique advantage"),
        body: "Competitive landscape analysis",
      } 
    },
    { 
      slide_type: "business_model", 
      title: "Business Model", 
      content: { 
        headline: "How we make money",
        bullets: ["Revenue stream 1", "Revenue stream 2"],
      } 
    },
    { 
      slide_type: "team", 
      title: "Team", 
      content: { 
        headline: "World-class team",
        body: "Combined experience in industry and technology",
      } 
    },
    { 
      slide_type: "ask", 
      title: "The Ask", 
      content: { 
        headline: `Raising ${step2.raise_amount || "Seed Round"}`,
        body: String(step2.use_of_funds || "To accelerate growth and expand the team"),
        funding_stage: String(step2.funding_stage || "Seed"),
      } 
    },
  ];
}
