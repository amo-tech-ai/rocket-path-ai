/**
 * StartupAI Infographic Video — Motion & Timing (BCG-Aligned)
 *
 * BCG uses minimal animation: simple fade-ins, no bounces.
 * Our springs are HIGH DAMPING by default (no overshoot on data).
 * Only the brand CTA gets bounce.
 */

export const SPRING = {
  /** Editorial: smooth, no bounce — DEFAULT for most elements */
  editorial: { damping: 200 },
  /** Precise: snappy settle — UI labels, badges */
  precise: { damping: 100, stiffness: 150 },
  /** Data: natural growth — chart bars, donut rings */
  data: { damping: 80, stiffness: 100 },
  /** Heavy: slow, weighty — large counting stat numbers */
  heavy: { damping: 40, stiffness: 60, mass: 2 },
  /** Brand: slight bounce — CTA logo ONLY */
  brand: { damping: 12 },
} as const;

/** Stagger delay between sequential elements (frames) */
export const STAGGER_FRAMES = 7;    // BCG carousel ~200ms → 6-7 frames at 30fps

/** Scene frame boundaries */
export const SCENE_FRAMES = {
  hook:    { start: 0,   end: 60  },
  context: { start: 60,  end: 150 },
  data:    { start: 150, end: 360 },
  insight: { start: 360, end: 450 },
  cta:     { start: 450, end: 540 },
} as const;

export const FPS = 30;
export const TOTAL_FRAMES = 540;
export const TOTAL_DURATION = TOTAL_FRAMES / FPS; // 18s

/** Scene transition: fade only, 10 frames (BCG uses opacity only) */
export const TRANSITION_FRAMES = 10;

/** Text reveal: subtle 16px translateY (BCG-style) */
export const TEXT_REVEAL_DISTANCE = 16;

/** Hold time before exit: let data breathe */
export const HOLD_FRAMES = 45; // 1.5s at 30fps

/** Source citation delay after main content */
export const SOURCE_DELAY_FRAMES = 20;
