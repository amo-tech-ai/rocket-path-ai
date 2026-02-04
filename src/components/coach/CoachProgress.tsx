/**
 * Coach Progress
 * Visual stepper showing validation phases
 */

import { Check } from 'lucide-react';
import type { ValidationPhase, ProgressInfo, PHASE_ORDER } from '@/types/coach';
import { cn } from '@/lib/utils';

interface CoachProgressProps {
  phase: ValidationPhase;
  progress: ProgressInfo;
}

const PHASES: { key: ValidationPhase; label: string }[] = [
  { key: 'onboarding', label: 'Start' },
  { key: 'assessment', label: 'Assess' },
  { key: 'constraint', label: 'Focus' },
  { key: 'campaign_setup', label: 'Plan' },
  { key: 'sprint_execution', label: 'Sprint' },
  { key: 'cycle_review', label: 'Review' },
];

export default function CoachProgress({ phase, progress }: CoachProgressProps) {
  const currentIndex = PHASES.findIndex(p => p.key === phase || 
    (p.key === 'sprint_execution' && phase === 'sprint_planning'));
  
  return (
    <div className="space-y-3">
      {/* Phase Steps */}
      <div className="flex items-center justify-between">
        {PHASES.map((p, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;
          
          return (
            <div key={p.key} className="flex flex-col items-center flex-1">
              <div className="relative flex items-center w-full">
                {/* Connector line */}
                {index > 0 && (
                  <div 
                    className={cn(
                      "absolute left-0 right-1/2 h-0.5 -translate-y-1/2 top-3",
                      isComplete || isCurrent ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
                {index < PHASES.length - 1 && (
                  <div 
                    className={cn(
                      "absolute left-1/2 right-0 h-0.5 -translate-y-1/2 top-3",
                      isComplete ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
                
                {/* Step circle */}
                <div 
                  className={cn(
                    "relative z-10 mx-auto w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                    isComplete && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    isPending && "bg-muted text-muted-foreground"
                  )}
                >
                  {isComplete ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
              </div>
              
              {/* Label */}
              <span 
                className={cn(
                  "text-[10px] mt-1.5 font-medium",
                  isCurrent ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {p.label}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{progress.phase}</span>
          <span>{progress.percentage}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
