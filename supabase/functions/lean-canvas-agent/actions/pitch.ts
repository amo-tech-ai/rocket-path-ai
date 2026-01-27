/**
 * Canvas to Pitch Deck Mapping
 */

import type { BoxKey, PitchSlide } from "../types.ts";
import { callGemini, extractJSON } from "../ai-utils.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

// Mapping from canvas boxes to pitch deck slides
const CANVAS_TO_SLIDE_MAP: Record<BoxKey, { slideNumber: number; slideType: string }> = {
  uniqueValueProp: { slideNumber: 1, slideType: 'title' },
  problem: { slideNumber: 2, slideType: 'problem' },
  solution: { slideNumber: 3, slideType: 'solution' },
  unfairAdvantage: { slideNumber: 4, slideType: 'competition' },
  customerSegments: { slideNumber: 5, slideType: 'market' },
  keyMetrics: { slideNumber: 6, slideType: 'traction' },
  revenueStreams: { slideNumber: 7, slideType: 'business_model' },
  channels: { slideNumber: 8, slideType: 'go_to_market' },
  costStructure: { slideNumber: 9, slideType: 'financials' },
};

interface PitchDeckResult {
  slides: PitchSlide[];
  completeness: number;
  mapping: Array<{ canvasBox: BoxKey; pitchSlide: string }>;
}

/**
 * Convert canvas content to pitch deck slides
 */
export async function canvasToPitch(
  supabase: SupabaseClient,
  userId: string,
  startupId: string,
  canvasData: Record<string, unknown>
): Promise<PitchDeckResult> {
  console.log(`[canvasToPitch] Converting canvas to pitch deck for startup ${startupId}`);

  // Fetch startup for context
  const { data: startup } = await supabase
    .from("startups")
    .select("name, industry, stage")
    .eq("id", startupId)
    .single();

  // Calculate completeness
  const filledBoxes = Object.entries(canvasData).filter(
    ([_, value]) => {
      const boxValue = value as { items?: string[] } | undefined;
      return boxValue?.items && boxValue.items.length > 0;
    }
  ).length;
  const completeness = Math.round((filledBoxes / 9) * 100);

  if (completeness < 70) {
    return {
      slides: [],
      completeness,
      mapping: [],
    };
  }

  const systemPrompt = `You are a pitch deck expert. Convert Lean Canvas bullet points into compelling pitch deck slide content.
For each slide, expand the bullets into 2-4 clear, investor-ready statements.
Keep language concise but impactful.`;

  const userPrompt = `Startup: ${startup?.name || 'Unknown'} (${startup?.industry || 'Unknown'})

LEAN CANVAS:
${JSON.stringify(canvasData, null, 2)}

Convert to pitch deck slides. Return JSON:
{
  "slides": [
    {
      "slideNumber": 1,
      "slideType": "title",
      "title": "Company Name",
      "content": ["Tagline/UVP statement"],
      "sourceBox": "uniqueValueProp"
    },
    {
      "slideNumber": 2,
      "slideType": "problem",
      "title": "The Problem",
      "content": ["Problem statement 1", "Problem statement 2"],
      "sourceBox": "problem"
    }
    // ... up to slide 10
  ]
}`;

  const response = await callGemini("google/gemini-3-pro-preview", systemPrompt, userPrompt);
  const parsed = extractJSON<{ slides: PitchSlide[] }>(response);

  if (parsed && Array.isArray(parsed.slides)) {
    const mapping = Object.entries(CANVAS_TO_SLIDE_MAP).map(([box, slide]) => ({
      canvasBox: box as BoxKey,
      pitchSlide: slide.slideType,
    }));

    return {
      slides: parsed.slides,
      completeness,
      mapping,
    };
  }

  // Fallback: create basic mapping
  const fallbackSlides: PitchSlide[] = [];
  for (const [boxKey, slideInfo] of Object.entries(CANVAS_TO_SLIDE_MAP)) {
    const boxData = canvasData[boxKey] as { items?: string[] } | undefined;
    if (boxData?.items?.length) {
      fallbackSlides.push({
        slideNumber: slideInfo.slideNumber,
        slideType: slideInfo.slideType,
        title: slideInfo.slideType.replace('_', ' ').toUpperCase(),
        content: boxData.items,
        sourceBox: boxKey as BoxKey,
      });
    }
  }

  return {
    slides: fallbackSlides.sort((a, b) => a.slideNumber - b.slideNumber),
    completeness,
    mapping: Object.entries(CANVAS_TO_SLIDE_MAP).map(([box, slide]) => ({
      canvasBox: box as BoxKey,
      pitchSlide: slide.slideType,
    })),
  };
}
