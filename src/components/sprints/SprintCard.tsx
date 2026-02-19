import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronDown, ChevronRight, ClipboardList } from "lucide-react";
import type { Sprint } from "@/hooks/useSprints";

const PDCA_STEPS = ['plan', 'do', 'check', 'act'] as const;

const PDCA_COLORS: Record<string, string> = {
  plan: "bg-blue-100 text-blue-700",
  do: "bg-amber-100 text-amber-700",
  check: "bg-purple-100 text-purple-700",
  act: "bg-green-100 text-green-700",
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  completed: "bg-slate-100 text-slate-600",
  paused: "bg-gray-100 text-gray-600",
};

interface SprintCardProps {
  sprint: Sprint;
  isExpanded: boolean;
  onToggle: () => void;
  onComplete: (id: string) => void;
  onReview?: (sprint: Sprint) => void;
  children?: React.ReactNode;
}

export function SprintCard({ sprint, isExpanded, onToggle, onComplete, onReview, children }: SprintCardProps) {
  return (
    <Card className={sprint.status === 'completed' ? 'opacity-75' : ''}>
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <CardTitle className="text-base">
              Sprint {sprint.sprint_number}
            </CardTitle>
            <Badge className={PDCA_COLORS[sprint.pdca_step] || ''}>
              {sprint.pdca_step.toUpperCase()}
            </Badge>
            <Badge variant="outline" className={STATUS_COLORS[sprint.status] || ''}>
              {sprint.status}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            {sprint.status === 'completed' && onReview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); onReview(sprint); }}
              >
                <ClipboardList className="h-4 w-4 mr-1" /> Review
              </Button>
            )}
            {sprint.status !== 'completed' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); onComplete(sprint.id); }}
              >
                <CheckCircle className="h-4 w-4 mr-1" /> Complete
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground ml-7">{sprint.purpose}</p>
        {/* PDCA step indicator */}
        <div className="flex gap-1 ml-7 mt-2">
          {PDCA_STEPS.map((step) => {
            const idx = PDCA_STEPS.indexOf(step);
            const currentIdx = PDCA_STEPS.indexOf(sprint.pdca_step as typeof PDCA_STEPS[number]);
            const isComplete = idx < currentIdx || sprint.status === 'completed';
            const isCurrent = step === sprint.pdca_step && sprint.status !== 'completed';
            return (
              <div
                key={step}
                className={`h-1.5 flex-1 rounded-full ${
                  isComplete ? 'bg-primary' : isCurrent ? 'bg-primary/50' : 'bg-muted'
                }`}
              />
            );
          })}
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0">
          {children}
        </CardContent>
      )}
    </Card>
  );
}
