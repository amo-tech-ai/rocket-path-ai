import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, BarChart3, Sparkles, Check } from 'lucide-react';

interface AIProgressTransitionProps {
  onComplete: () => void;
  isAnalysisReady?: boolean;
}

type TransitionState = 'collecting' | 'analyzing' | 'preparing' | 'complete';

const analysisSteps = [
  { id: 'website', icon: Globe, text: 'Website & links' },
  { id: 'market', icon: BarChart3, text: 'Market & competitors' },
  { id: 'signals', icon: Sparkles, text: 'Business signals' },
];

export default function AIProgressTransition({ 
  onComplete, 
  isAnalysisReady = false 
}: AIProgressTransitionProps) {
  const [state, setState] = useState<TransitionState>('collecting');
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Animation timeline
  useEffect(() => {
    if (prefersReducedMotion) {
      // Skip animations for reduced motion - complete immediately
      setProgress(100);
      setState('complete');
      setTimeout(onComplete, 300);
      return;
    }

    const timers: NodeJS.Timeout[] = [];

    // State 1: Collecting (0-1.5s)
    setProgress(10);
    timers.push(setTimeout(() => setProgress(25), 800));

    // State 2: Analyzing (1.5s-4.5s)
    timers.push(setTimeout(() => {
      setState('analyzing');
      setProgress(30);
    }, 1500));

    // Animate sub-steps
    timers.push(setTimeout(() => {
      setCompletedSteps(['website']);
      setProgress(40);
    }, 2200));

    timers.push(setTimeout(() => {
      setCompletedSteps(['website', 'market']);
      setProgress(55);
    }, 2900));

    timers.push(setTimeout(() => {
      setCompletedSteps(['website', 'market', 'signals']);
      setProgress(75);
    }, 3600));

    // State 3: Preparing (4.5s-5.5s)
    timers.push(setTimeout(() => {
      setState('preparing');
      setProgress(85);
    }, 4200));

    timers.push(setTimeout(() => {
      setProgress(100);
    }, 4800));

    // Complete
    timers.push(setTimeout(() => {
      setState('complete');
    }, 5200));

    timers.push(setTimeout(() => {
      onComplete();
    }, 5500));

    return () => timers.forEach(clearTimeout);
  }, [prefersReducedMotion, onComplete]);

  // Skip ahead if analysis is already ready
  useEffect(() => {
    if (isAnalysisReady && state !== 'complete') {
      setProgress(100);
      setState('complete');
      setTimeout(onComplete, 500);
    }
  }, [isAnalysisReady, state, onComplete]);

  const duration = prefersReducedMotion ? 0 : 0.4;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      role="status"
      aria-live="polite"
      aria-label="AI analysis in progress"
    >
      <div className="w-full max-w-md mx-auto px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-14 h-14 mx-auto mb-8 rounded-2xl bg-primary/10 flex items-center justify-center"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Sparkles className="w-7 h-7 text-primary" />
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* State 1: Collecting */}
          {state === 'collecting' && (
            <motion.div
              key="collecting"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration }}
              className="text-center"
            >
              <h2 className="font-display text-xl sm:text-2xl font-medium text-foreground mb-2">
                Collecting your startup context…
              </h2>
              <p className="text-sm text-muted-foreground">
                Gathering the information you provided
              </p>
            </motion.div>
          )}

          {/* State 2: Analyzing */}
          {state === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration }}
              className="text-center"
            >
              <h2 className="font-display text-xl sm:text-2xl font-medium text-foreground mb-6">
                AI agents are analyzing your data…
              </h2>
              
              {/* Analysis sub-steps */}
              <div className="space-y-3 mb-2">
                {analysisSteps.map((step, index) => {
                  const isComplete = completedSteps.includes(step.id);
                  const isActive = !isComplete && completedSteps.length === index;
                  
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                      }}
                      transition={{ 
                        duration: prefersReducedMotion ? 0 : 0.3,
                        delay: prefersReducedMotion ? 0 : index * 0.15
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${
                        isComplete 
                          ? 'bg-sage-light border-sage/30' 
                          : isActive
                          ? 'bg-card border-primary/30 shadow-sm'
                          : 'bg-secondary/50 border-border/50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                        isComplete 
                          ? 'bg-sage/20' 
                          : isActive
                          ? 'bg-primary/10'
                          : 'bg-muted'
                      }`}>
                        {isComplete ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          >
                            <Check className="w-4 h-4 text-sage" />
                          </motion.div>
                        ) : (
                          <step.icon className={`w-4 h-4 ${
                            isActive ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                        )}
                      </div>
                      <span className={`text-sm font-medium transition-colors duration-300 ${
                        isComplete 
                          ? 'text-sage-foreground' 
                          : isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}>
                        {step.text}
                      </span>
                      {isActive && !prefersReducedMotion && (
                        <motion.div
                          className="ml-auto"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* State 3: Preparing */}
          {(state === 'preparing' || state === 'complete') && (
            <motion.div
              key="preparing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration }}
              className="text-center"
            >
              <h2 className="font-display text-xl sm:text-2xl font-medium text-foreground mb-2">
                {state === 'complete' ? 'Analysis complete' : 'Preparing your insights…'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {state === 'complete' 
                  ? 'Your AI analysis is ready for review' 
                  : 'Organizing findings into actionable insights'
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar */}
        <div className="mt-10">
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ 
                duration: prefersReducedMotion ? 0 : 0.5,
                ease: 'easeOut'
              }}
            />
          </div>
          <div className="flex justify-between mt-3">
            <span className="text-xs text-muted-foreground">
              {state === 'collecting' && 'Step 1 of 3'}
              {state === 'analyzing' && 'Step 2 of 3'}
              {(state === 'preparing' || state === 'complete') && 'Step 3 of 3'}
            </span>
            <span className="text-xs font-medium text-primary">
              {progress}%
            </span>
          </div>
        </div>

        {/* Subtle branding */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-muted-foreground/60 mt-8"
        >
          Powered by Gemini 3 Pro
        </motion.p>
      </div>
    </div>
  );
}
