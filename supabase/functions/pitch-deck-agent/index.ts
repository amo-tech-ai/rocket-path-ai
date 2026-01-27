import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = "https://yvyesmiczbjqwbqtlidy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2eWVzbWljemJqcXdicXRsaWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NTA1OTcsImV4cCI6MjA4NDAyNjU5N30.eSN491MztXvWR03q4v-Zfc0zrG06mrIxdSRe_FFZDu4";

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
}

function getSupabaseClient(authHeader: string | null): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
  });
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
      // Update existing deck
      const { data: existingDeck, error: fetchError } = await supabase
        .from("pitch_decks")
        .select("*")
        .eq("id", deckId)
        .single();

      if (fetchError) throw fetchError;
      deck = existingDeck;
    } else {
      // Get user's startup_id
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

      // Create new deck
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

    // Build step key
    const stepKeys = ["step1_startup_info", "step2_market_traction", "step3_smart_interview", "step4_review"];
    const stepKey = stepKeys[step - 1];

    // Merge wizard data
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

    // Update deck
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
// Action: generate_interview_questions
// ============================================================================

async function generateInterviewQuestions(
  supabase: SupabaseClient,
  userId: string,
  deckId: string,
  step1Data: Record<string, unknown>,
  step2Data: Record<string, unknown>
) {
  console.log(`[generate_interview_questions] Deck: ${deckId}`);

  const industry = (step1Data.industry as string) || "other";
  const fundingStage = (step2Data.funding_stage as string) || "seed";

  // Industry-specific question packs
  const questionPacks: Record<string, Array<{ id: string; question: string; category: string; slide_mapping: string }>> = {
    ai_saas: [
      { id: "ai_1", question: "What specific AI/ML models power your product and how proprietary are they?", category: "product", slide_mapping: "technology" },
      { id: "ai_2", question: "How do you handle data privacy and model training with customer data?", category: "product", slide_mapping: "solution" },
      { id: "ai_3", question: "What's your path to achieving AI defensibility (data moats, proprietary models)?", category: "competition", slide_mapping: "competition" },
    ],
    fintech: [
      { id: "fin_1", question: "What regulatory licenses do you have or need?", category: "product", slide_mapping: "solution" },
      { id: "fin_2", question: "How do you acquire customers and what's your CAC?", category: "market", slide_mapping: "go_to_market" },
      { id: "fin_3", question: "What partnerships with banks or financial institutions do you have?", category: "market", slide_mapping: "partnerships" },
    ],
    healthcare: [
      { id: "hc_1", question: "What's your path to FDA approval or regulatory clearance?", category: "product", slide_mapping: "solution" },
      { id: "hc_2", question: "How do you work with healthcare providers or payers?", category: "market", slide_mapping: "go_to_market" },
      { id: "hc_3", question: "What clinical evidence supports your solution?", category: "traction", slide_mapping: "traction" },
    ],
    default: [
      { id: "gen_1", question: "What specific metrics demonstrate your product-market fit?", category: "traction", slide_mapping: "traction" },
      { id: "gen_2", question: "How do you acquire customers today and what's working best?", category: "market", slide_mapping: "go_to_market" },
      { id: "gen_3", question: "What are your unit economics (CAC, LTV)?", category: "financials", slide_mapping: "business_model" },
      { id: "gen_4", question: "Who are your key competitors and how are you differentiated?", category: "competition", slide_mapping: "competition" },
      { id: "gen_5", question: "What's your team's unfair advantage in this space?", category: "team", slide_mapping: "team" },
      { id: "gen_6", question: "What will you use the funding for over the next 18 months?", category: "financials", slide_mapping: "ask" },
    ],
  };

  // Get industry-specific questions or default
  const industryQuestions = questionPacks[industry] || [];
  const baseQuestions = questionPacks.default;

  // Combine and limit to 6-8 questions
  const allQuestions = [...industryQuestions, ...baseQuestions].slice(0, 8);

  // Format questions
  const formattedQuestions = allQuestions.map(q => ({
    ...q,
    source: industry !== "other" ? "industry" : "gap_analysis",
    skipped: false,
  }));

  // Save research context to deck metadata
  const researchContext = {
    industry_insights: [`${industry} industry analysis`],
    funding_stage: fundingStage,
    analyzed_at: new Date().toISOString(),
  };

  return {
    success: true,
    questions: formattedQuestions,
    research_context: researchContext,
    total_questions: formattedQuestions.length,
  };
}

// ============================================================================
// Action: generate_deck
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

  // Create generation log
  const generationLog = {
    id: crypto.randomUUID(),
    generation_status: "in_progress",
    started_at: new Date().toISOString(),
    ai_model_used: { model: "gemini-3-pro-preview", thinkingLevel: "high" },
  };

  // Update deck with generation log
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

  // Generate slides based on wizard data
  const step1 = (wizardData.step1_startup_info || {}) as Record<string, unknown>;
  const step2 = (wizardData.step2_market_traction || {}) as Record<string, unknown>;
  const step3 = (wizardData.step3_smart_interview || {}) as Record<string, unknown>;

  const slideTemplates = [
    { slide_type: "title", title: step1.company_name || "Company Name", content: { tagline: step1.tagline || "" } },
    { slide_type: "problem", title: "The Problem", content: { problem: step2.problem || "" } },
    { slide_type: "solution", title: "Our Solution", content: { solution: step2.core_solution || "" } },
    { slide_type: "market", title: "Market Opportunity", content: { market_size: "Large and growing" } },
    { slide_type: "product", title: "How It Works", content: { features: [] } },
    { slide_type: "traction", title: "Traction", content: { users: step2.users, revenue: step2.revenue } },
    { slide_type: "competition", title: "Competition", content: { differentiator: step2.differentiator } },
    { slide_type: "business_model", title: "Business Model", content: {} },
    { slide_type: "team", title: "Team", content: {} },
    { slide_type: "ask", title: "The Ask", content: { funding_stage: step2.funding_stage } },
  ];

  // Delete existing slides
  await supabase
    .from("pitch_deck_slides")
    .delete()
    .eq("deck_id", deckId);

  // Create new slides
  for (let i = 0; i < slideTemplates.length; i++) {
    const slideTemplate = slideTemplates[i];
    await supabase
      .from("pitch_deck_slides")
      .insert([{
        deck_id: deckId,
        slide_number: i + 1,
        slide_type: slideTemplate.slide_type,
        title: slideTemplate.title,
        content: slideTemplate.content,
        is_visible: true,
      }]);
  }

  // Update generation log to completed
  generationLog.generation_status = "completed";
  (generationLog as Record<string, unknown>).completed_at = new Date().toISOString();
  (generationLog as Record<string, unknown>).slide_count_generated = slideTemplates.length;

  const finalMetadata = {
    ...metadata,
    generation_logs: [...((metadata.generation_logs as unknown[]) || []).filter((l: unknown) => (l as { id: string }).id !== generationLog.id), generationLog],
  };

  await supabase
    .from("pitch_decks")
    .update({ 
      status: "review",
      slide_count: slideTemplates.length,
      metadata: finalMetadata,
    })
    .eq("id", deckId);

  return {
    success: true,
    deck_id: deckId,
    title: deck.title,
    template: template,
    total_slides: slideTemplates.length,
    saved_slides: slideTemplates.length,
    generation_log_id: generationLog.id,
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

  // Calculate signal strength
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
