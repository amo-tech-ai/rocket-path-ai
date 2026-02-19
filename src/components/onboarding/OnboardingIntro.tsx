import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, BarChart3, Sparkles, LayoutDashboard, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingIntroProps {
  onComplete: () => void;
  onSkip: () => void;
}

const INTRO_SEEN_KEY = 'startupai_onboarding_intro_seen';

// Check if intro was already seen
export function hasSeenIntro(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(INTRO_SEEN_KEY) === 'true';
}

// Mark intro as seen
export function markIntroSeen(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(INTRO_SEEN_KEY, 'true');
  }
}

type IntroState = 'welcome' | 'capabilities' | 'control';

const checklist = [
  { icon: Globe, text: 'Analyze your website & links', delay: 0 },
  { icon: BarChart3, text: 'Research your market', delay: 0.3 },
  { icon: Sparkles, text: 'Extract key signals', delay: 0.6 },
  { icon: LayoutDashboard, text: 'Prepare your dashboard', delay: 0.9 },
];

export default function OnboardingIntro({ onComplete, onSkip }: OnboardingIntroProps) {
  const [state, setState] = useState<IntroState>('welcome');
  const [progress, setProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Auto-advance through states
  useEffect(() => {
    if (prefersReducedMotion) {
      // Skip animations for reduced motion
      setProgress(100);
      setState('control');
      return;
    }

    const timers: NodeJS.Timeout[] = [];

    // Welcome → Capabilities (after 2s)
    timers.push(setTimeout(() => {
      setState('capabilities');
      setProgress(25);
    }, 2000));

    // Progress to 50% (after 3.5s)
    timers.push(setTimeout(() => {
      setProgress(50);
    }, 3500));

    // Capabilities → Control (after 6s)
    timers.push(setTimeout(() => {
      setState('control');
      setProgress(75);
    }, 6000));

    // Progress to 100% (after 7s)
    timers.push(setTimeout(() => {
      setProgress(100);
    }, 7000));

    return () => timers.forEach(clearTimeout);
  }, [prefersReducedMotion]);

  const handleComplete = () => {
    markIntroSeen();
    onComplete();
  };

  const handleSkip = () => {
    markIntroSeen();
    onSkip();
  };

  // Handle keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const duration = prefersReducedMotion ? 0 : 0.5;
  const stagger = prefersReducedMotion ? 0 : 0.15;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to StartupAI onboarding"
    >
      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium flex items-center gap-1.5"
        aria-label="Skip intro"
      >
        Skip intro
        <X className="w-4 h-4" />
      </button>

      <div className="w-full max-w-lg mx-auto px-6">
        <AnimatePresence mode="wait">
          {/* State 1: Welcome */}
          {state === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration, ease: 'easeOut' }}
              className="text-center"
            >
              {/* Logo */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration, delay: 0.1 }}
                className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-primary flex items-center justify-center"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary-foreground"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration, delay: 0.2 }}
                className="font-display text-3xl sm:text-4xl font-medium text-foreground mb-4"
              >
                Let's build your startup profile.
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration, delay: 0.3 }}
                className="text-muted-foreground text-lg"
              >
                This takes about 2–3 minutes.
              </motion.p>
            </motion.div>
          )}

          {/* State 2: Capabilities */}
          {state === 'capabilities' && (
            <motion.div
              key="capabilities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration, ease: 'easeOut' }}
              className="text-center"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-sm font-medium text-primary mb-6 tracking-wide uppercase"
              >
                What our AI will do
              </motion.p>

              <div className="space-y-4">
                {checklist.map((item, index) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: prefersReducedMotion ? 0 : 0.4,
                      delay: prefersReducedMotion ? 0 : item.delay,
                      ease: 'easeOut'
                    }}
                    className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-lg bg-sage-light flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium text-left">
                      {item.text}
                    </span>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        duration: prefersReducedMotion ? 0 : 0.3,
                        delay: prefersReducedMotion ? 0 : item.delay + 0.3
                      }}
                      className="ml-auto"
                    >
                      <Check className="w-5 h-5 text-sage" />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* State 3: Control */}
          {state === 'control' && (
            <motion.div
              key="control"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration, ease: 'easeOut' }}
              className="text-center"
            >
              {/* Shield icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration, delay: 0.1 }}
                className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-sage-light flex items-center justify-center"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration, delay: 0.2 }}
                className="font-display text-2xl sm:text-3xl font-medium text-foreground mb-4"
              >
                You're in control.
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration, delay: 0.3 }}
                className="text-muted-foreground text-lg mb-8 max-w-sm mx-auto"
              >
                You review everything. Nothing is saved without your approval.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration, delay: 0.4 }}
              >
                <Button
                  size="lg"
                  onClick={handleComplete}
                  className="px-8 py-6 text-base font-medium"
                >
                  Start
                  <motion.span
                    initial={{ x: 0 }}
                    animate={{ x: [0, 4, 0] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      repeatType: 'loop',
                      ease: 'easeInOut'
                    }}
                    className="ml-2"
                  >
                    →
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress indicator */}
        <motion.div 
          className="mt-12 flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 33, 66, 100].map((threshold, index) => (
            <motion.div
              key={threshold}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                progress >= threshold ? 'bg-primary w-8' : 'bg-border w-2'
              }`}
              initial={{ width: 8 }}
              animate={{ 
                width: progress >= threshold ? 32 : 8,
                backgroundColor: progress >= threshold 
                  ? 'hsl(var(--primary))' 
                  : 'hsl(var(--border))'
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
