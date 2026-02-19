/**
 * Shared types for pitch-deck-agent
 */

export interface RequestBody {
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

export interface SlideContent {
  slide_type: string;
  title: string;
  content: Record<string, unknown>;
  speaker_notes?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SupabaseClient = any;
