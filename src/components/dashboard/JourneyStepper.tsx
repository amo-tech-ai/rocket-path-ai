import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JourneyStep } from "@/hooks/useJourneyStage";

interface JourneyStepperProps {
  steps: JourneyStep[];
  currentStepIndex: number;
  stageLabel?: string;
  timeEstimate?: string;
}

export function JourneyStepper({ steps, currentStepIndex, stageLabel, timeEstimate }: JourneyStepperProps) {
  return (
    <div className="rounded-2xl border bg-card p-4 sm:p-6">
      {/* Steps row */}
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            {/* Step dot + label */}
            <Link to={step.path} className="flex flex-col items-center gap-1.5 group min-w-0">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors shrink-0",
                  step.status === 'completed' && "bg-primary text-primary-foreground",
                  step.status === 'current' && "bg-primary/15 text-primary ring-2 ring-primary",
                  step.status === 'upcoming' && "bg-muted text-muted-foreground"
                )}
              >
                {step.status === 'completed' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={cn(
                  "text-[11px] font-medium truncate max-w-[64px] text-center",
                  step.status === 'current' ? "text-primary" : "text-muted-foreground",
                  "group-hover:text-foreground transition-colors"
                )}
              >
                {step.label}
              </span>
            </Link>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="flex-1 mx-1 sm:mx-2 mt-[-18px]">
                <div
                  className={cn(
                    "h-0.5 rounded-full",
                    i < currentStepIndex ? "bg-primary" : "bg-border"
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Stage label */}
      {(stageLabel || timeEstimate) && (
        <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
          {stageLabel && <span>Stage: <span className="font-medium text-foreground">{stageLabel}</span></span>}
          {timeEstimate && <span>{timeEstimate}</span>}
        </div>
      )}
    </div>
  );
}
