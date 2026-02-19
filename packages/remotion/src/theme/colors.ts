/**
 * StartupAI Infographic Video — Color Tokens (BCG-Aligned Light Theme)
 *
 * Design philosophy: BCG uses aggressive restraint.
 * 90% neutral tones, color only for data and accents.
 * No colored section fills, no gradient backgrounds.
 */

export const COLORS = {
  // Backgrounds — BCG: pure white, ours: warm white
  bg: '#FAFAF8',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F3EF',     // stone — chart tracks ONLY (never colored tints)
  border: '#E6E2DC',
  borderDark: '#D0CBC4',

  // Brand — BCG green adjacent (used sparingly: CTAs, brand marks only)
  accent: '#2D6B4D',
  accentLight: '#E8F2EC',
  accentTint: '#F2F8F5',

  // StartupAI warmth (for highlight moments, not dominant)
  rose: '#B08D83',
  roseTint: '#F5EDEA',

  // Financial stats
  gold: '#B8941F',
  goldTint: '#FAF2D8',

  // Data Visualization — muted, editorial palette
  blue: '#2E5EA8',           // want bars, adoption metrics
  red: '#B83A3A',            // get bars, gap indicators
  sage: '#5C8A68',           // healthcare, governance
  purple: '#6B5AA8',         // insights, GenAI usage

  // Text hierarchy — BCG: near-black (#212427), we warm slightly
  textPrimary: '#1E1E1C',
  textSecondary: '#4A4744',
  textMuted: '#8A8580',
  textDimmed: '#BAB5AE',

  // Chart utilities
  axis: '#D0CBC4',
  gridLine: '#EDE8E2',
  track: '#F5F3EF',          // same as surfaceAlt — bar/ring backgrounds
} as const;

export type ColorKey = keyof typeof COLORS;
