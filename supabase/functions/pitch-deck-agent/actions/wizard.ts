/**
 * Wizard Actions: save_wizard_step, resume_wizard
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

export async function saveWizardStep(
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

export async function resumeWizard(
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
