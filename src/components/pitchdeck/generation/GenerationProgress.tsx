/**
 * Generation Progress Component
 * Animated 5-step progress UI per Prompt 12 spec
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { GenerationStep } from '@/hooks/usePitchDeckGeneration';

interface GenerationProgressProps {
  steps: GenerationStep[];
  currentStep: number;
  progress: number;
  isGenerating: boolean;
  error: string | null;
}

export function GenerationProgress({
  steps,
  currentStep,
  progress,
  isGenerating,
  error,
}: GenerationProgressProps) {
  return (
    <div className="w-full max-w-xl mx-auto space-y-8">
      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-foreground">{progress}%</span>
        </div>
        <Progress 
          value={progress} 
          className="h-2 bg-muted"
        />
      </div>

      {/* Current Step Message */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center"
        >
          <p className="text-lg font-medium text-foreground">
            {getProgressMessage(progress)}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Step List */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <StepRow 
            key={step.id} 
            step={step} 
            isActive={index === currentStep && isGenerating}
            hasError={step.status === 'error'}
          />
        ))}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-lg bg-destructive/10 border border-destructive/20 p-4"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Something went wrong</p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reassurance Text */}
      {isGenerating && !error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-muted-foreground"
        >
          This usually takes under a minute.
        </motion.p>
      )}
    </div>
  );
}

interface StepRowProps {
  step: GenerationStep;
  isActive: boolean;
  hasError: boolean;
}

function StepRow({ step, isActive, hasError }: StepRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: step.id * 0.1 }}
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
        step.status === 'completed' && "bg-primary/5",
        isActive && "bg-primary/10 ring-1 ring-primary/20",
        step.status === 'pending' && "opacity-50",
        hasError && "bg-destructive/5 ring-1 ring-destructive/20"
      )}
    >
      {/* Status Icon */}
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center text-xl",
        step.status === 'completed' && "bg-primary/20",
        isActive && "bg-primary/30",
        step.status === 'pending' && "bg-muted",
        hasError && "bg-destructive/20"
      )}>
        {step.status === 'completed' ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Check className="w-5 h-5 text-primary" />
          </motion.div>
        ) : isActive ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="w-5 h-5 text-primary" />
          </motion.div>
        ) : hasError ? (
          <AlertCircle className="w-5 h-5 text-destructive" />
        ) : (
          <span className="opacity-60">{step.icon}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-medium transition-colors",
          step.status === 'completed' && "text-foreground",
          isActive && "text-primary",
          step.status === 'pending' && "text-muted-foreground",
          hasError && "text-destructive"
        )}>
          {step.title}
        </p>
        <p className={cn(
          "text-sm mt-0.5 transition-colors",
          isActive ? "text-muted-foreground" : "text-muted-foreground/70"
        )}>
          {step.description}
        </p>
      </div>

      {/* Duration Badge */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full"
        >
          ~{step.duration}s
        </motion.div>
      )}
    </motion.div>
  );
}

function getProgressMessage(progress: number): string {
  if (progress < 15) return "Getting to know your startup...";
  if (progress < 35) return "Researching industry benchmarks...";
  if (progress < 55) return "Building your investor narrative...";
  if (progress < 75) return "Designing slide layouts...";
  if (progress < 95) return "Adding finishing touches...";
  return "Your pitch deck is ready! ✨";
}
