/**
 * AI Adoption by Industry — Dark Theme Tokens
 *
 * Dark navy background with electric blue primary and amber accent.
 * Used for the long-form AI Adoption infographic video.
 */

export const DARK = {
  // Backgrounds
  bg: '#0A1628',
  surface: '#0F1D32',
  surfaceAlt: '#152440',
  border: '#1E3254',

  // Primary — electric blue
  primary: '#3B82F6',
  primaryMuted: '#2563EB',
  primaryGlow: 'rgba(59, 130, 246, 0.15)',

  // Accent — amber (tension / highlight stats)
  accent: '#F59E0B',
  accentGlow: 'rgba(245, 158, 11, 0.15)',

  // Success — green (positive stats)
  success: '#10B981',
  successGlow: 'rgba(16, 185, 129, 0.15)',

  // Text
  text: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textDim: '#475569',

  // Chart utilities
  track: '#1E3254',
  gridLine: '#1E3254',
} as const;
