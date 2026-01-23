import { Check, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export interface WizardStep {
  number: number;
  title: string;
  description: string;
}

interface StepProgressProps {
  currentStep: number;
  completedSteps: number[];
  steps: WizardStep[];
  onStepClick?: (step: number) => void;
  onSaveLater?: () => void;
  isSaving?: boolean;
}

export function StepProgress({
  currentStep,
  completedSteps,
  steps,
  onStepClick,
  onSaveLater,
  isSaving = false,
}: StepProgressProps) {
  const progressPercentage = Math.round((completedSteps.length / steps.length) * 100);

  return (
    <div className="flex flex-col h-full">
      {/* Step List */}
      <div className="flex-1 space-y-2">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.number);
          const isCurrent = currentStep === step.number;
          const isClickable = isCompleted || step.number <= currentStep;

          return (
            <button
              key={step.number}
              onClick={() => isClickable && onStepClick?.(step.number)}
              disabled={!isClickable}
              className={cn(
                'w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200',
                isCurrent && 'bg-accent',
                isClickable && !isCurrent && 'hover:bg-accent/50',
                !isClickable && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium shrink-0 transition-colors',
                  isCompleted
                    ? 'bg-primary text-primary-foreground'
                    : isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.number
                )}
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    'text-sm font-medium truncate',
                    isCurrent ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {step.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div className="pt-6 border-t border-border space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-primary">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Save & Continue Later */}
        {onSaveLater && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onSaveLater}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save & Continue Later'}
          </Button>
        )}
      </div>
    </div>
  );
}

export default StepProgress;
