/**
 * Pack Execution Drawer Component
 * Shows real-time progress of multi-step pack execution
 * Implements Task 22: Agentic Routing & Multi-Step Pack Execution
 */

import { motion } from 'framer-motion';
import { Loader2, Check, X, ChevronRight, Sparkles } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PackStep, StepStatus } from '@/hooks/usePromptPack';

interface PackExecutionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packName: string;
  steps: PackStep[];
  currentStep: number;
  progress: number;
  isExecuting: boolean;
  error?: string | null;
  onCancel?: () => void;
  onApplyResults?: () => void;
}

const stepStatusIcons: Record<StepStatus, React.ReactNode> = {
  pending: <div className="h-4 w-4 rounded-full border-2 border-muted" />,
  running: <Loader2 className="h-4 w-4 animate-spin text-primary" />,
  completed: <Check className="h-4 w-4 text-primary" />,
  error: <X className="h-4 w-4 text-destructive" />,
};

export function PackExecutionDrawer({
  open,
  onOpenChange,
  packName,
  steps,
  currentStep,
  progress,
  isExecuting,
  error,
  onCancel,
  onApplyResults,
}: PackExecutionDrawerProps) {
  const isComplete = !isExecuting && steps.every(s => s.status === 'completed');
  const hasError = steps.some(s => s.status === 'error') || !!error;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>{packName}</SheetTitle>
              <SheetDescription>
                {isExecuting 
                  ? `Running step ${currentStep + 1} of ${steps.length}...`
                  : isComplete
                    ? 'All steps completed!'
                    : hasError
                      ? 'Execution encountered an error'
                      : 'Ready to execute'
                }
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Steps list */}
          <div className="space-y-3">
            {steps.map((step, idx) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  step.status === 'running' 
                    ? 'border-primary/50 bg-primary/5' 
                    : step.status === 'completed'
                      ? 'border-primary/20 bg-primary/5'
                      : step.status === 'error'
                        ? 'border-destructive/50 bg-destructive/5'
                        : 'border-border bg-muted/20'
                }`}
              >
                <div className="mt-0.5">
                  {stepStatusIcons[step.status]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{step.title}</span>
                    <Badge variant="outline" className="text-xs">
                      Step {step.step_number}
                    </Badge>
                  </div>
                  {step.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {step.description}
                    </p>
                  )}
                  {step.error && (
                    <p className="text-sm text-destructive mt-1">
                      {step.error}
                    </p>
                  )}
                </div>
                {step.status === 'completed' && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-lg border border-destructive/50 bg-destructive/5 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t">
            {isExecuting ? (
              <Button variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            ) : isComplete ? (
              <Button onClick={onApplyResults} className="flex-1">
                Apply Results
              </Button>
            ) : hasError ? (
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Close
              </Button>
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default PackExecutionDrawer;
