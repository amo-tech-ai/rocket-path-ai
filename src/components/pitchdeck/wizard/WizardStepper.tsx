/**
 * Wizard Stepper Component
 * Left panel navigation with step indicators
 */

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface WizardStepperProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

export function WizardStepper({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}: WizardStepperProps) {
  return (
    <div className="sticky top-8">
      <nav className="space-y-1" aria-label="Progress">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.number);
          const isCurrent = currentStep === step.number;
          const isClickable = isCompleted || step.number <= currentStep;

          return (
            <motion.button
              key={step.number}
              onClick={() => isClickable && onStepClick(step.number)}
              disabled={!isClickable}
              className={cn(
                'w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-200',
                isCurrent && 'bg-sage/5 border border-sage/20',
                !isCurrent && isClickable && 'hover:bg-secondary/50',
                !isClickable && 'opacity-50 cursor-not-allowed'
              )}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Step Number/Check */}
              <div
                className={cn(
                  'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                  isCompleted && 'bg-sage text-sage-foreground',
                  isCurrent && !isCompleted && 'bg-sage text-sage-foreground',
                  !isCurrent && !isCompleted && 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.number
                )}
              </div>

              {/* Step Info */}
              <div className="min-w-0">
                <p
                  className={cn(
                    'text-sm font-medium',
                    isCurrent ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </p>
                {isCurrent && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-xs text-muted-foreground mt-0.5"
                  >
                    {step.description}
                  </motion.p>
                )}
              </div>
            </motion.button>
          );
        })}
      </nav>

      {/* Progress Indicator */}
      <div className="mt-6 px-3">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-sage rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {Math.round((currentStep / steps.length) * 100)}% complete
        </p>
      </div>
    </div>
  );
}
