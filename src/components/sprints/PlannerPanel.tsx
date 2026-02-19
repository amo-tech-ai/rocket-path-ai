/**
 * PlannerPanel — AI coach sidebar for 90-Day Plan.
 * Shows sprint overview, progress stats, and generate CTA.
 */

import { Sparkles, Target, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SprintTask, KanbanColumn } from '@/hooks/useSprintAgent';

const SPRINT_NAMES = [
  'Foundation',
  'Solution Fit',
  'Willingness to Pay',
  'Channel Test',
  'MVP Build',
  'Early Traction',
];

interface PlannerPanelProps {
  tasks: SprintTask[];
  tasksByColumn: Record<KanbanColumn, SprintTask[]>;
  isGenerating: boolean;
  hasTasks: boolean;
  onGenerate: () => void;
  sprintFilter?: number;
  onSprintFilter: (sprint: number | undefined) => void;
}

export function PlannerPanel({
  tasks,
  tasksByColumn,
  isGenerating,
  hasTasks,
  onGenerate,
  sprintFilter,
  onSprintFilter,
}: PlannerPanelProps) {
  const total = tasks.length;
  const done = tasksByColumn.done.length;
  const doing = tasksByColumn.doing.length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* AI Generate */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">AI Sprint Planner</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          {hasTasks
            ? 'Regenerate to get fresh tasks based on your latest startup data.'
            : 'Generate 24 validation tasks across 6 sprints tailored to your startup.'}
        </p>
        <Button onClick={onGenerate} disabled={isGenerating} className="w-full" size="sm">
          {isGenerating ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="w-4 h-4 mr-2" /> {hasTasks ? 'Regenerate Plan' : 'Generate Plan'}</>
          )}
        </Button>
      </div>

      {/* Progress */}
      {hasTasks && (
        <div className="p-4 rounded-xl border bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-3">Progress</h3>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-bold text-foreground">{progress}%</span>
            <div className="flex-1">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-semibold text-foreground">{done}</p>
              <p className="text-[10px] text-muted-foreground">Done</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{doing}</p>
              <p className="text-[10px] text-muted-foreground">In Progress</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{total - done - doing}</p>
              <p className="text-[10px] text-muted-foreground">Remaining</p>
            </div>
          </div>
        </div>
      )}

      {/* Sprint Filter */}
      {hasTasks && (
        <div className="p-4 rounded-xl border bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-2">Sprints</h3>
          <div className="space-y-1">
            <button
              onClick={() => onSprintFilter(undefined)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                !sprintFilter ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              All Sprints ({total})
            </button>
            {SPRINT_NAMES.map((name, i) => {
              const num = i + 1;
              const count = tasks.filter(t => t.sprint_number === num).length;
              const doneCount = tasks.filter(t => t.sprint_number === num && t.column === 'done').length;
              if (count === 0) return null;
              return (
                <button
                  key={num}
                  onClick={() => onSprintFilter(sprintFilter === num ? undefined : num)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    sprintFilter === num ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <span>S{num}: {name}</span>
                  <span className="flex items-center gap-1">
                    {doneCount === count ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <span>{doneCount}/{count}</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
