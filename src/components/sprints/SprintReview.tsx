import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Lightbulb } from "lucide-react";
import type { Sprint } from "@/hooks/useSprints";
import type { SprintTask } from "@/hooks/useSprintAgent";
import type { Json } from "@/integrations/supabase/types";

interface SprintReviewProps {
  sprint: Sprint;
  tasks: SprintTask[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PDCA_STEPS = ['plan', 'do', 'check', 'act'] as const;

const DECISION_CONFIG: Record<string, { label: string; color: string; icon: typeof ArrowRight }> = {
  continue: { label: 'Continue', color: 'bg-green-100 text-green-700', icon: ArrowRight },
  adjust: { label: 'Adjust', color: 'bg-amber-100 text-amber-700', icon: RotateCcw },
  pivot: { label: 'Pivot', color: 'bg-red-100 text-red-700', icon: RotateCcw },
};

function toStringArray(val: Json | null): string[] {
  if (Array.isArray(val)) return val.map(String);
  return [];
}

export function SprintReview({ sprint, tasks, open, onOpenChange }: SprintReviewProps) {
  const sprintTasks = tasks.filter(t => t.sprint_number === sprint.sprint_number);
  const doneTasks = sprintTasks.filter(t => t.column === 'done');
  const completionPct = sprintTasks.length > 0
    ? Math.round((doneTasks.length / sprintTasks.length) * 100)
    : 0;

  const pdcaComplete = PDCA_STEPS.filter(step => {
    if (step === 'plan') return !!sprint.hypothesis;
    if (step === 'do') return !!sprint.actions_taken;
    if (step === 'check') return sprint.results != null;
    if (step === 'act') return !!sprint.decision;
    return false;
  });

  const learnings = toStringArray(sprint.learnings);
  const nextSteps = toStringArray(sprint.next_steps);
  const decisionCfg = DECISION_CONFIG[sprint.decision || ''];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Sprint {sprint.sprint_number} Review</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* PDCA Progress */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">PDCA Progress</h4>
            <div className="flex gap-2">
              {PDCA_STEPS.map(step => {
                const done = pdcaComplete.includes(step);
                return (
                  <div key={step} className="flex items-center gap-1">
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground/40" />
                    )}
                    <span className={`text-sm capitalize ${done ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Task Completion */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Task Completion</h4>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <span className="text-sm font-medium">{doneTasks.length}/{sprintTasks.length}</span>
            </div>
          </div>

          {/* Decision Badge */}
          {decisionCfg && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Decision</h4>
              <Badge className={decisionCfg.color}>
                {decisionCfg.label}
              </Badge>
              {sprint.decision_rationale && (
                <p className="text-sm text-muted-foreground mt-1">{sprint.decision_rationale}</p>
              )}
            </div>
          )}

          {/* Key Learnings */}
          {learnings.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Lightbulb className="h-3.5 w-3.5" /> Key Learnings
              </h4>
              <ul className="space-y-1">
                {learnings.map((l, i) => (
                  <li key={i} className="text-sm text-foreground flex gap-2">
                    <span className="text-muted-foreground">-</span> {l}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Steps */}
          {nextSteps.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Next Steps</h4>
              <ul className="space-y-1">
                {nextSteps.map((s, i) => (
                  <li key={i} className="text-sm text-foreground flex gap-2">
                    <span className="text-muted-foreground">-</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Success indicator */}
          {sprint.success != null && (
            <div className="flex items-center gap-2 pt-2 border-t">
              {sprint.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="text-sm font-medium">
                Success criteria {sprint.success ? 'met' : 'not met'}
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
