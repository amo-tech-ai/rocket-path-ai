/**
 * Image Actions: generate_slide_images
 * Uses Gemini 3 Pro Image for visual generation
 */

import { generateSlideImage, generateDeckImages } from "../ai-utils.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

export interface SlideImageResult {
  success: boolean;
  slide_type: string;
  image_url?: string;
  error?: string;
}

export async function generateSlideVisual(
  supabase: SupabaseClient,
  userId: string,
  slideId: string,
  slideType: string,
  slideTitle: string,
  companyContext?: string,
  brandColors?: { primary?: string; secondary?: string }
): Promise<SlideImageResult> {
  console.log(`[generate_slide_visual] Slide: ${slideId}, Type: ${slideType}`);

  const prompt = companyContext 
    ? `${companyContext} - ${slideTitle}`
    : slideTitle;

  const result = await generateSlideImage(prompt, slideType, brandColors);

  if (!result.success) {
    return {
      success: false,
      slide_type: slideType,
      error: result.error,
    };
  }

  // Store image in slide content
  if (result.imageBase64) {
    const imageUrl = `data:image/png;base64,${result.imageBase64}`;
    
    try {
      const { data: slide } = await supabase
        .from("pitch_deck_slides")
        .select("content")
        .eq("id", slideId)
        .single();

      const currentContent = (slide?.content || {}) as Record<string, unknown>;
      const newContent = {
        ...currentContent,
        background_image: imageUrl,
        image_generated_at: new Date().toISOString(),
      };

      await supabase
        .from("pitch_deck_slides")
        .update({ 
          content: newContent,
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", slideId);

      console.log(`[generate_slide_visual] Saved image to slide ${slideId}`);

      return {
        success: true,
        slide_type: slideType,
        image_url: imageUrl,
      };
    } catch (error) {
      console.error("[generate_slide_visual] Save error:", error);
      return {
        success: false,
        slide_type: slideType,
        error: "Failed to save image",
      };
    }
  }

  return {
    success: false,
    slide_type: slideType,
    error: "No image generated",
  };
}

export async function generateDeckVisuals(
  supabase: SupabaseClient,
  userId: string,
  deckId: string,
  companyContext: string,
  brandColors?: { primary?: string; secondary?: string }
): Promise<{
  success: boolean;
  images_generated: number;
  slides_updated: string[];
  errors: string[];
}> {
  console.log(`[generate_deck_visuals] Deck: ${deckId}`);

  // Fetch slides
  const { data: slides, error: fetchError } = await supabase
    .from("pitch_deck_slides")
    .select("id, slide_type, title")
    .eq("deck_id", deckId)
    .order("slide_number", { ascending: true });

  if (fetchError || !slides) {
    return {
      success: false,
      images_generated: 0,
      slides_updated: [],
      errors: ["Failed to fetch slides"],
    };
  }

  // Generate images for key slides
  const slideData = slides.map((s: { slide_type: string; title: string }) => ({
    slide_type: s.slide_type,
    title: s.title || s.slide_type,
  }));

  const imageMap = await generateDeckImages(slideData, companyContext, brandColors);

  const slidesUpdated: string[] = [];
  const errors: string[] = [];

  // Update slides with generated images
  for (const slide of slides) {
    const imageUrl = imageMap.get(slide.slide_type);
    if (imageUrl) {
      try {
        const currentContent = (slide.content || {}) as Record<string, unknown>;
        await supabase
          .from("pitch_deck_slides")
          .update({
            content: {
              ...currentContent,
              background_image: imageUrl,
              image_generated_at: new Date().toISOString(),
            },
            image_url: imageUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", slide.id);

        slidesUpdated.push(slide.id);
      } catch (error) {
        errors.push(`Failed to update slide ${slide.id}`);
      }
    }
  }

  // Update deck metadata
  await supabase
    .from("pitch_decks")
    .update({
      metadata: {
        images_generated: slidesUpdated.length,
        images_generated_at: new Date().toISOString(),
      },
      updated_at: new Date().toISOString(),
    })
    .eq("id", deckId);

  console.log(`[generate_deck_visuals] Generated ${slidesUpdated.length} images`);

  return {
    success: true,
    images_generated: slidesUpdated.length,
    slides_updated: slidesUpdated,
    errors,
  };
}

export async function regenerateSlideImage(
  supabase: SupabaseClient,
  userId: string,
  slideId: string,
  customPrompt?: string
): Promise<SlideImageResult> {
  console.log(`[regenerate_slide_image] Slide: ${slideId}`);

  // Get slide info
  const { data: slide, error: fetchError } = await supabase
    .from("pitch_deck_slides")
    .select("slide_type, title, deck_id")
    .eq("id", slideId)
    .single();

  if (fetchError || !slide) {
    return {
      success: false,
      slide_type: "unknown",
      error: "Slide not found",
    };
  }

  // Get deck for company context
  const { data: deck } = await supabase
    .from("pitch_decks")
    .select("title, metadata")
    .eq("id", slide.deck_id)
    .single();

  const metadata = (deck?.metadata || {}) as Record<string, unknown>;
  const wizardData = (metadata.wizard_data || {}) as Record<string, unknown>;
  const step1 = (wizardData.step1_startup_info || {}) as Record<string, unknown>;
  
  const companyContext = `${step1.company_name || deck?.title || "Startup"} - ${step1.industry || "Technology"}`;
  const prompt = customPrompt || `${companyContext} - ${slide.title}`;

  const result = await generateSlideImage(prompt, slide.slide_type);

  if (result.success && result.imageBase64) {
    const imageUrl = `data:image/png;base64,${result.imageBase64}`;

    await supabase
      .from("pitch_deck_slides")
      .update({
        image_url: imageUrl,
        content: {
          ...(slide.content || {}),
          background_image: imageUrl,
          image_regenerated_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .eq("id", slideId);

    return {
      success: true,
      slide_type: slide.slide_type,
      image_url: imageUrl,
    };
  }

  return {
    success: false,
    slide_type: slide.slide_type,
    error: result.error,
  };
}
