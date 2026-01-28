/**
 * Realtime Animation Utilities
 * Consistent motion language for all realtime updates
 * Based on docs/dashboard/tasks/98-supabase-realtime.md
 */

import { Variants, Transition } from 'framer-motion';

// ============ Duration Constants ============
export const ANIMATION_DURATIONS = {
  scoreAnimate: 0.8,    // 800ms - Health gauge, fit scores, quality scores
  cardSlideIn: 0.3,     // 300ms - New tasks, contacts, suggestions
  badgePulse: 0.2,      // 200ms + fade - "+N new" badges, score changes
  staggerDelay: 0.2,    // 200ms per item - Onboarding cards, canvas prefill
  progressFill: 1.0,    // Linear - Deck generation, fundraising bar
  borderFlash: 0.4,     // 400ms - Canvas validation, risk alerts
  shimmerLoop: 1.5,     // Loop until resolved - AI processing
} as const;

// ============ Ease Functions ============
export const EASING = {
  easeOut: [0.0, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
  easeInOut: [0.4, 0.0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
} as const;

// ============ Transition Presets ============
export const transitions: Record<string, Transition> = {
  scoreAnimate: {
    duration: ANIMATION_DURATIONS.scoreAnimate,
    ease: EASING.easeOut,
  },
  cardSlideIn: {
    duration: ANIMATION_DURATIONS.cardSlideIn,
    ease: EASING.easeOut,
  },
  badgePulse: {
    duration: ANIMATION_DURATIONS.badgePulse,
    ease: EASING.easeOut,
  },
  staggerContainer: {
    staggerChildren: ANIMATION_DURATIONS.staggerDelay,
  },
  progressFill: {
    duration: ANIMATION_DURATIONS.progressFill,
    ease: 'linear',
  },
  borderFlash: {
    duration: ANIMATION_DURATIONS.borderFlash,
    ease: EASING.easeOut,
  },
};

// ============ Variant Presets ============

/** Score gauge animation (health, fit, quality scores) */
export const scoreGaugeVariants: Variants = {
  initial: { 
    scale: 1,
    opacity: 0.8,
  },
  animate: { 
    scale: [1, 1.05, 1],
    opacity: 1,
    transition: transitions.scoreAnimate,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
  },
};

/** Card slide-in animation (new items) */
export const cardSlideInVariants: Variants = {
  initial: { 
    opacity: 0, 
    x: 20,
    scale: 0.95,
  },
  animate: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: transitions.cardSlideIn,
  },
  exit: { 
    opacity: 0, 
    x: -20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

/** Card slide-down animation (prepended items) */
export const cardSlideDownVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: -20,
    height: 0,
  },
  animate: { 
    opacity: 1, 
    y: 0,
    height: 'auto',
    transition: transitions.cardSlideIn,
  },
  exit: { 
    opacity: 0, 
    y: 20,
    height: 0,
  },
};

/** Badge pulse animation (counters, scores) */
export const badgePulseVariants: Variants = {
  initial: { 
    scale: 1,
    opacity: 1,
  },
  pulse: { 
    scale: [1, 1.2, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: ANIMATION_DURATIONS.badgePulse * 2,
      ease: EASING.bounce,
    },
  },
};

/** "+N new" badge that fades out */
export const newBadgeVariants: Variants = {
  initial: { 
    opacity: 0,
    scale: 0.8,
  },
  animate: { 
    opacity: 1,
    scale: 1,
    transition: transitions.badgePulse,
  },
  fadeOut: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.5, delay: 5 }, // Fades after 5s
  },
};

/** Stagger container for lists */
export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: ANIMATION_DURATIONS.staggerDelay,
      delayChildren: 0.1,
    },
  },
};

/** Stagger child items */
export const staggerItemVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 10,
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: transitions.cardSlideIn,
  },
};

/** Progress bar fill animation */
export const progressFillVariants: Variants = {
  initial: { 
    scaleX: 0,
    originX: 0,
  },
  animate: (progress: number) => ({ 
    scaleX: progress / 100,
    transition: transitions.progressFill,
  }),
};

/** Border flash for validation/alerts */
export const borderFlashVariants: Variants = {
  initial: { 
    boxShadow: '0 0 0 0 transparent',
  },
  flash: (color: string) => ({
    boxShadow: [
      `0 0 0 0 ${color}`,
      `0 0 0 4px ${color}`,
      `0 0 0 0 ${color}`,
    ],
    transition: transitions.borderFlash,
  }),
};

/** Risk alert slide-in from right */
export const riskAlertVariants: Variants = {
  initial: { 
    opacity: 0, 
    x: 100,
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: { 
    opacity: 0, 
    x: 100,
    transition: { duration: 0.2 },
  },
};

/** Shimmer effect for loading states */
export const shimmerVariants: Variants = {
  initial: {
    backgroundPosition: '-200% 0',
  },
  animate: {
    backgroundPosition: '200% 0',
    transition: {
      repeat: Infinity,
      duration: ANIMATION_DURATIONS.shimmerLoop,
      ease: 'linear',
    },
  },
};

/** Typing animation for text reveal */
export const typingVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

/** Individual character for typing */
export const charVariants: Variants = {
  initial: { opacity: 0, y: 5 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.1 },
  },
};

// ============ Utility Functions ============

/** Get stagger delay for index */
export function getStaggerDelay(index: number, baseDelay = ANIMATION_DURATIONS.staggerDelay): number {
  return index * baseDelay;
}

/** Get color for score-based animations */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'hsl(var(--success))';
  if (score >= 50) return 'hsl(var(--warning))';
  return 'hsl(var(--destructive))';
}

/** Get border color for validation status */
export function getValidationColor(status: 'complete' | 'needs_work' | 'missing'): string {
  switch (status) {
    case 'complete': return 'hsl(var(--success))';
    case 'needs_work': return 'hsl(var(--warning))';
    case 'missing': return 'hsl(var(--destructive))';
  }
}

/** CSS shimmer gradient */
export const shimmerGradient = `linear-gradient(
  90deg,
  hsl(var(--muted)) 0%,
  hsl(var(--muted-foreground) / 0.1) 50%,
  hsl(var(--muted)) 100%
)`;
