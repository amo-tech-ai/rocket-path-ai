import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = "https://yvyesmiczbjqwbqtlidy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2eWVzbWljemJqcXdicXRsaWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NTA1OTcsImV4cCI6MjA4NDAyNjU5N30.eSN491MztXvWR03q4v-Zfc0zrG06mrIxdSRe_FFZDu4";
const LOVABLE_AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

interface RequestBody {
  action: string;
  deck_id?: string;
  step?: number;
  step_data?: Record<string, unknown>;
  step1_data?: Record<string, unknown>;
  step2_data?: Record<string, unknown>;
  template?: string;
  slide_id?: string;
  content?: Record<string, unknown>;
  slide_type?: string;
  slide_content?: Record<string, unknown>;
}

interface SlideContent {
  slide_type: string;
  title: string;
  content: Record<string, unknown>;
  speaker_notes?: string;
}

function getSupabaseClient(authHeader: string | null): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
  });
}

// ============================================================================
// AI Helper: Call Lovable AI Gateway
// ============================================================================

async function callGemini(
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

// ============================================================================
// Action: save_wizard_step
// ============================================================================

async function saveWizardStep(
  supabase: SupabaseClient,
  userId: string,
  deckId: string | null,
  step: number,
  stepData: Record<string, unknown>,
  selectedIndustry?: string
) {
  console.log(`[save_wizard_step] User: ${userId}, Deck: ${deckId}, Step: ${step}`);

  try {
    let deck;
    
    if (deckId) {
      const { data: existingDeck, error: fetchError } = await supabase
        .from("pitch_decks")
        .select("*")
        .eq("id", deckId)
        .single();

      if (fetchError) throw fetchError;
      deck = existingDeck;
    } else {
      const { data: profile } = await supabase
        .from("profiles")
        .select("org_id")
        .eq("id", userId)
        .maybeSingle();

      if (!profile?.org_id) {
        throw new Error("User has no organization. Complete onboarding first.");
      }

      const { data: startup } = await supabase
        .from("startups")
        .select("id")
        .eq("org_id", profile.org_id)
        .maybeSingle();

      if (!startup) {
        throw new Error("No startup found. Complete onboarding first.");
      }

      const { data: newDeck, error: createError } = await supabase
        .from("pitch_decks")
        .insert([{
          startup_id: startup.id,
          title: (stepData as { company_name?: string }).company_name 
            ? `${(stepData as { company_name?: string }).company_name} Pitch Deck` 
            : "New Pitch Deck",
          status: "in_progress",
          created_by: userId,
          metadata: {},
        }])
        .select()
        .single();

      if (createError) throw createError;
      deck = newDeck;
    }

    const stepKeys = ["step1_startup_info", "step2_market_traction", "step3_smart_interview", "step4_review"];
    const stepKey = stepKeys[step - 1];

    const currentMetadata = (deck.metadata || {}) as Record<string, unknown>;
    const currentWizardData = (currentMetadata.wizard_data || {}) as Record<string, unknown>;
    
    const newWizardData = {
      ...currentWizardData,
      [stepKey]: stepData,
      updated_at: new Date().toISOString(),
    };

    if (selectedIndustry) {
      newWizardData.selected_industry = selectedIndustry;
    }

    const newMetadata = {
      ...currentMetadata,
      wizard_data: newWizardData,
    };

    const { error: updateError } = await supabase
      .from("pitch_decks")
      .update({ 
        metadata: newMetadata,
        updated_at: new Date().toISOString(),
      })
      .eq("id", deck.id);

    if (updateError) throw updateError;

    return {
      success: true,
      deck_id: deck.id,
      wizard_data: newWizardData,
      step: step,
    };
  } catch (error) {
    console.error("[save_wizard_step] Error:", error);
    throw error;
  }
}

// ============================================================================
// Action: resume_wizard
// ============================================================================

async function resumeWizard(
  supabase: SupabaseClient,
  userId: string,
  deckId: string
) {
  console.log(`[resume_wizard] User: ${userId}, Deck: ${deckId}`);

  const { data: deck, error } = await supabase
    .from("pitch_decks")
    .select("*")
    .eq("id", deckId)
    .single();

  if (error) throw error;

  const metadata = (deck.metadata || {}) as Record<string, unknown>;
  
  return {
    success: true,
    deck_id: deck.id,
    wizard_data: metadata.wizard_data || null,
  };
}

// ============================================================================
// Action: generate_interview_questions (P0 - Gemini Flash)
// ============================================================================

async function generateInterviewQuestions(
  supabase: SupabaseClient,
  userId: string,
  deckId: string,
  step1Data: Record<string, unknown>,
  step2Data: Record<string, unknown>
) {
  console.log(`[generate_interview_questions] Deck: ${deckId}`);

  const industry = (step1Data.industry as string) || "technology";
  const stage = (step1Data.stage as string) || "seed";
  const companyName = (step1Data.company_name as string) || "Startup";
  const tagline = (step1Data.tagline as string) || "";
  const problem = (step2Data.problem as string) || "";
  const solution = (step2Data.core_solution as string) || "";
  const fundingStage = (step2Data.funding_stage as string) || "seed";

  // Build AI prompt for dynamic question generation
  const systemPrompt = `You are an expert venture capital analyst specializing in ${industry} startups at the ${stage} stage.
Your task is to generate 6-8 highly specific, probing interview questions that will help create a compelling pitch deck.

Focus areas:
1. Fill knowledge gaps in the provided data
2. Extract quantitative metrics and proof points
3. Uncover unique insights about team, market, and traction
4. Generate questions investors would actually ask

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "id": "q1",
      "question": "Your specific question here?",
      "category": "traction|market|team|product|financials|competition",
      "slide_mapping": "traction|market|team|solution|business_model|competition|ask",
      "why_important": "Brief reason this matters for the pitch"
    }
  ],
  "research_context": {
    "industry_insights": ["key insight 1", "key insight 2"],
    "funding_landscape": "brief market context",
    "key_metrics_needed": ["metric 1", "metric 2"]
  }
}`;

  const userPrompt = `Generate interview questions for this startup:

Company: ${companyName}
Industry: ${industry}
Stage: ${stage}
Tagline: ${tagline}
Problem: ${problem}
Solution: ${solution}
Funding Stage: ${fundingStage}

Known data gaps to fill:
- Specific traction metrics (users, revenue, growth rate)
- Unit economics (CAC, LTV, margins)
- Team backgrounds and unfair advantages
- Competitive differentiation with proof
- Go-to-market strategy details`;

  // Try AI generation with Gemini Flash (fast)
  const aiResponse = await callGemini(
    "google/gemini-3-flash-preview",
    systemPrompt,
    userPrompt
  );

  let questions: Array<{ id: string; question: string; category: string; slide_mapping: string; source: string }> = [];
  let researchContext: Record<string, unknown> = {};

  if (aiResponse.content) {
    try {
      // Extract JSON from response
      const jsonMatch = aiResponse.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        questions = (parsed.questions || []).map((q: Record<string, unknown>, idx: number) => ({
          id: q.id || `q${idx + 1}`,
          question: q.question as string,
          category: q.category as string,
          slide_mapping: q.slide_mapping as string,
          source: "ai_generated",
          why_important: q.why_important as string,
          skipped: false,
        }));
        researchContext = parsed.research_context || {};
        console.log(`[generate_interview_questions] AI generated ${questions.length} questions`);
      }
    } catch (parseError) {
      console.error("[generate_interview_questions] JSON parse error:", parseError);
    }
  }

  // Fallback to static questions if AI fails
  if (questions.length === 0) {
    console.log("[generate_interview_questions] Using fallback questions");
    
    const industryQuestions: Record<string, Array<{ id: string; question: string; category: string; slide_mapping: string }>> = {
      ai_saas: [
        { id: "ai_1", question: "What specific AI/ML models power your product and how proprietary are they?", category: "product", slide_mapping: "solution" },
        { id: "ai_2", question: "How do you handle data privacy and model training with customer data?", category: "product", slide_mapping: "solution" },
        { id: "ai_3", question: "What's your path to achieving AI defensibility (data moats, proprietary models)?", category: "competition", slide_mapping: "competition" },
      ],
      fintech: [
        { id: "fin_1", question: "What regulatory licenses do you have or need?", category: "product", slide_mapping: "solution" },
        { id: "fin_2", question: "How do you acquire customers and what's your CAC?", category: "market", slide_mapping: "business_model" },
        { id: "fin_3", question: "What partnerships with banks or financial institutions do you have?", category: "market", slide_mapping: "traction" },
      ],
      healthcare: [
        { id: "hc_1", question: "What's your path to FDA approval or regulatory clearance?", category: "product", slide_mapping: "solution" },
        { id: "hc_2", question: "How do you work with healthcare providers or payers?", category: "market", slide_mapping: "market" },
        { id: "hc_3", question: "What clinical evidence supports your solution?", category: "traction", slide_mapping: "traction" },
      ],
    };

    const baseQuestions = [
      { id: "gen_1", question: "What specific metrics demonstrate your product-market fit?", category: "traction", slide_mapping: "traction" },
      { id: "gen_2", question: "How do you acquire customers today and what's working best?", category: "market", slide_mapping: "business_model" },
      { id: "gen_3", question: "What are your unit economics (CAC, LTV)?", category: "financials", slide_mapping: "business_model" },
      { id: "gen_4", question: "Who are your key competitors and how are you differentiated?", category: "competition", slide_mapping: "competition" },
      { id: "gen_5", question: "What's your team's unfair advantage in this space?", category: "team", slide_mapping: "team" },
      { id: "gen_6", question: "What will you use the funding for over the next 18 months?", category: "financials", slide_mapping: "ask" },
    ];

    const industrySpecific = industryQuestions[industry] || [];
    questions = [...industrySpecific, ...baseQuestions].slice(0, 8).map(q => ({
      ...q,
      source: "fallback",
      skipped: false,
    }));

    researchContext = {
      industry_insights: [`${industry} industry analysis`],
      funding_stage: fundingStage,
      analyzed_at: new Date().toISOString(),
    };
  }

  return {
    success: true,
    questions,
    research_context: researchContext,
    total_questions: questions.length,
    ai_generated: questions[0]?.source === "ai_generated",
  };
}

// ============================================================================
// Action: generate_deck (P0 - Gemini 3 Pro)
// ============================================================================

async function generateDeck(
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
  const companyContext = `
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
        "metrics": {"label": "value"} // if applicable
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
    slides = [
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
  generationLog.generation_status = "completed";
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

// ============================================================================
// Action: update_slide (P1 - Edit individual slides)
// ============================================================================

async function updateSlide(
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

// ============================================================================
// Action: get_deck
// ============================================================================

async function getDeck(
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

// ============================================================================
// Action: get_signal_strength
// ============================================================================

async function getSignalStrength(
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

  let score = 0;
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

  score = Math.round(
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

// ============================================================================
// Action: analyze_slide (AI suggestions for slide improvement)
// ============================================================================

async function analyzeSlide(
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

// ============================================================================
// Main Handler
// ============================================================================

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    const supabase = getSupabaseClient(authHeader);

    // Get user from JWT
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", message: "Invalid or missing authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: RequestBody = await req.json();
    const { action } = body;

    console.log(`[pitch-deck-agent] Action: ${action}, User: ${user.id}`);

    let result;

    switch (action) {
      case "save_wizard_step":
        result = await saveWizardStep(
          supabase,
          user.id,
          body.deck_id || null,
          body.step || 1,
          body.step_data || {},
          (body.step_data as Record<string, unknown>)?.industry as string
        );
        break;

      case "resume_wizard":
        if (!body.deck_id) {
          throw new Error("deck_id is required");
        }
        result = await resumeWizard(supabase, user.id, body.deck_id);
        break;

      case "generate_interview_questions":
        if (!body.deck_id) {
          throw new Error("deck_id is required");
        }
        result = await generateInterviewQuestions(
          supabase,
          user.id,
          body.deck_id,
          body.step1_data || {},
          body.step2_data || {}
        );
        break;

      case "generate_deck":
        if (!body.deck_id) {
          throw new Error("deck_id is required");
        }
        result = await generateDeck(
          supabase,
          user.id,
          body.deck_id,
          body.template || "yc"
        );
        break;

      case "update_slide":
        if (!body.slide_id) {
          throw new Error("slide_id is required");
        }
        result = await updateSlide(
          supabase,
          user.id,
          body.slide_id,
          body.content || {}
        );
        break;

      case "get_deck":
        if (!body.deck_id) {
          throw new Error("deck_id is required");
        }
        result = await getDeck(supabase, user.id, body.deck_id);
        break;

      case "get_signal_strength":
        if (!body.deck_id) {
          throw new Error("deck_id is required");
        }
        result = await getSignalStrength(supabase, user.id, body.deck_id);
        break;

      case "analyze_slide":
        if (!body.slide_id) {
          throw new Error("slide_id is required");
        }
        result = await analyzeSlide(
          supabase,
          user.id,
          body.slide_id,
          body.slide_type || "unknown",
          body.slide_content || {}
        );
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[pitch-deck-agent] Error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal Server Error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
