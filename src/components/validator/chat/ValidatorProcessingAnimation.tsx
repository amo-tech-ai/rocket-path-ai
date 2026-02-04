/**
 * Validator Processing Animation
 * 4-phase animation during AI validation
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  BarChart3, 
  Calculator, 
  CheckCircle2,
  Sparkles 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessingPhase {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
}

const PHASES: ProcessingPhase[] = [
  { id: 1, icon: Brain, title: 'Analyzing', description: 'Parsing your startup concept...' },
  { id: 2, icon: BarChart3, title: 'Researching', description: 'Gathering market intelligence...' },
  { id: 3, icon: Calculator, title: 'Scoring', description: 'Calculating validation metrics...' },
  { id: 4, icon: CheckCircle2, title: 'Complete', description: 'Your report is ready!' },
];

interface ValidatorProcessingAnimationProps {
  isActive: boolean;
  onComplete: () => void;
}

export default function ValidatorProcessingAnimation({
  isActive,
  onComplete,
}: ValidatorProcessingAnimationProps) {
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setCurrentPhase(0);
      return;
    }

    // Phase progression: ~1 second per phase
    const timer = setInterval(() => {
      setCurrentPhase(prev => {
        if (prev >= PHASES.length - 1) {
          clearInterval(timer);
          // Delay before completing
          setTimeout(onComplete, 500);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onComplete]);

  if (!isActive) return null;

  const phase = PHASES[currentPhase];
  const PhaseIcon = phase?.icon || Brain;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card-premium p-8 md:p-12 max-w-md w-full mx-4 text-center"
      >
        {/* Main Animation Circle */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Outer spinning ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
          />
          
          {/* Inner pulsing circle */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhase}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', duration: 0.5 }}
              >
                <PhaseIcon 
                  className={cn(
                    "w-12 h-12",
                    currentPhase === 3 ? "text-sage" : "text-primary"
                  )} 
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
          
          {/* Sparkles decoration */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-2"
          >
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.div
                key={angle}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                className="absolute w-2 h-2"
                style={{
                  top: `${50 + 45 * Math.sin((angle * Math.PI) / 180)}%`,
                  left: `${50 + 45 * Math.cos((angle * Math.PI) / 180)}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <Sparkles className="w-2 h-2 text-primary" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Phase Title */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="space-y-2"
          >
            <h3 className="font-display text-2xl font-semibold text-foreground">
              {phase?.title}
            </h3>
            <p className="text-muted-foreground">
              {phase?.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {PHASES.map((p, i) => (
            <motion.div
              key={p.id}
              animate={{
                scale: i === currentPhase ? 1.2 : 1,
                backgroundColor: i <= currentPhase 
                  ? 'hsl(var(--primary))' 
                  : 'hsl(var(--muted))',
              }}
              className="w-2 h-2 rounded-full"
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-6 h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/60"
            animate={{ width: `${((currentPhase + 1) / PHASES.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Phase {currentPhase + 1} of {PHASES.length}
        </p>
      </motion.div>
    </motion.div>
  );
}
