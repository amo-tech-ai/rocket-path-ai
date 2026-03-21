/**
 * 2026 AI in Professional Services Report — Design Tokens
 * Source: remotion/videos/2026-report.md (Thomson Reuters Institute style)
 * Resolution: 1280x720 (16:9) | 25fps | 160s total
 */

export const REPORT2026_FPS = 25;
export const REPORT2026_DURATION_SEC = 160;
export const REPORT2026_TOTAL_FRAMES = REPORT2026_FPS * REPORT2026_DURATION_SEC; // 4000

export const REPORT2026_COLORS = {
  redOrange: '#C7400B',
  darkGreen: '#1A3A1A',
  white: '#FFFFFF',
  beige: '#F5E6D8',
  mint: '#E0F0D8',
  iceBlue: '#E8F0F8',
  lime: '#90DD60',
  orangeBg: '#C54A0A',
  mutedGreen: '#6B8B6B',
  textOnDark: '#FFFFFF',
  textOnLight: '#1A3A1A',
  keyword: '#C7400B',
} as const;

/** Typography scale (approx. for 1280px width; scale from 1920 ref if needed) */
export const REPORT2026_TYPO = {
  heroStat: 180,      // 180-250px for key stats
  h1: 56,             // 60-80px → scaled for 1280
  h2: 32,             // 36-48px
  emphasis: 32,       // match surrounding, bold
  small: 22,          // 24-30px transitional
} as const;

/** Motion: word reveal ~0.3-0.5s per word at 25fps = 7.5-12.5 frames per word */
export const REPORT2026_WORD_FRAMES = 10;
/** Stat scale-up duration */
export const REPORT2026_STAT_DURATION_FRAMES = 20; // 0.8s
/** Scene transition duration */
export const REPORT2026_TRANSITION_FRAMES = 12;   // ~0.5s
/** Hold time after content complete (frames) */
export const REPORT2026_HOLD_FRAMES = 38;         // ~1.5s

/** Scene durations in frames (from spec §2 table); first 12 scenes for Phase 1 */
export const REPORT2026_SCENE_DURATIONS: number[] = [
  100,  // 0:00-0:04 Scene 1 Hook "AI is"
  50,   // 0:04-0:06 Scene 2 "the professional services"
  100,  // 0:06-0:10 Scene 3 "Some technologies take decades"
  50,   // 0:10-0:12 Scene 4 "to change how professionals work"
  100,  // 0:12-0:16 Scene 5 "But" + transition
  50,   // 0:16-0:18 Scene 6 "It took just 3 years — 2024"
  50,   // 0:18-0:20 Scene 7 "It took just 3 years — 2026"
  50,   // 0:20-0:22 Scene 8 Transition wipe
  50,   // 0:22-0:24 Scene 9 Title card
  50,   // 0:24-0:26 Scene 10 Logo
  50,   // 0:26-0:28 Scene 11 Transition to survey
  100,  // 0:28-0:32 Scene 12 "With more than 1,500 responses"
];

export type Report2026ColorKey = keyof typeof REPORT2026_COLORS;
