import { useState } from 'react';
import { format } from 'date-fns';
import { TaskWithProject, TASK_PRIORITIES, TASK_STATUSES } from '@/hooks/useTasks';
import { useBreakdownTask, Subtask } from '@/hooks/useTaskAgent';
import { useStartup } from '@/hooks/useDashboardData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { 
  Calendar, 
  Flag, 
  FolderKanban, 
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  Loader2,
  ListTodo,
  Clock3,
  User,
  Wrench
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskDetailSheetProps {
  task: TaskWithProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: string) => void;
}

export function TaskDetailSheet({ 
  task, 
  open,
  onOpenChange,
  onEdit, 
  onDelete,
  onStatusChange 
}: TaskDetailSheetProps) {
  const { data: startup } = useStartup();
  const breakdownTask = useBreakdownTask();
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [breakdown, setBreakdown] = useState<{
    complexity?: string;
    suggested_approach?: string;
    total_estimated_hours?: number;
  } | null>(null);

  if (!task) return null;

  const priority = TASK_PRIORITIES.find(p => p.value === task.priority);
  const status = TASK_STATUSES.find(s => s.value === task.status);
  const isCompleted = task.status === 'completed';

  const handleToggleComplete = () => {
    onStatusChange(isCompleted ? 'pending' : 'completed');
  };

  const handleBreakdown = async () => {
    if (!startup?.id || !task.id) return;
    
    const result = await breakdownTask.mutateAsync({
      startupId: startup.id,
      taskId: task.id,
    });

    if (result.success && result.subtasks) {
      setSubtasks(result.subtasks);
      setBreakdown({
        complexity: result.complexity,
        suggested_approach: result.suggested_approach,
        total_estimated_hours: result.total_estimated_hours,
      });
    }
  };


  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[450px] p-0 bg-background">
        {/* Header */}
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-lg">Task Details</SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-10rem)]">
          <div className="p-4 space-y-6">
            {/* Title & Status */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <button
                  onClick={handleToggleComplete}
                  className="mt-1 flex-shrink-0"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-sage" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground hover:text-sage transition-colors" />
                  )}
                </button>
                <h2 className={cn(
                  "text-xl font-semibold",
                  isCompleted && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {status && (
                  <Badge variant="secondary" className={status.color}>
                    {status.label}
                  </Badge>
                )}
                {priority && (
                  <Badge 
                    variant="outline" 
                    className={cn(
                      priority.color,
                      priority.value === 'urgent' && 'border-destructive'
                    )}
                  >
                    <Flag className="w-3 h-3 mr-1" />
                    {priority.label}
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Description */}
            {task.description && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                <p className="text-sm leading-relaxed">{task.description}</p>
              </div>
            )}

            {/* Metadata */}
            <div className="space-y-3">
              {task.project && (
                <div className="flex items-center gap-3 text-sm">
                  <FolderKanban className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Project:</span>
                  <span className="font-medium">{task.project.name}</span>
                </div>
              )}

              {task.due_at && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Due:</span>
                  <span className="font-medium">
                    {format(new Date(task.due_at), 'MMM d, yyyy')}
                  </span>
                </div>
              )}

              {task.category && (
                <div className="flex items-center gap-3 text-sm">
                  <Flag className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Category:</span>
                  <Badge variant="outline">{task.category}</Badge>
                </div>
              )}

              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">
                  {format(new Date(task.created_at || ''), 'MMM d, yyyy')}
                </span>
              </div>
            </div>

            <Separator />

            {/* Quick Status Change */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Move to</h4>
              <div className="flex flex-wrap gap-2">
                {TASK_STATUSES.filter(s => s.value !== task.status).map((s) => (
                  <Button
                    key={s.value}
                    variant="outline"
                    size="sm"
                    onClick={() => onStatusChange(s.value)}
                    className="gap-1"
                  >
                    <ArrowRight className="w-3 h-3" />
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* AI Task Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ListTodo className="w-4 h-4" />
                  AI Task Breakdown
                </h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBreakdown}
                  disabled={breakdownTask.isPending || !startup?.id}
                  className="gap-1"
                >
                  {breakdownTask.isPending ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  {breakdownTask.isPending ? "Analyzing..." : "Break Down"}
                </Button>
              </div>

              {breakdown && (
                <div className="p-3 rounded-lg bg-secondary/50 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary">{breakdown.complexity} complexity</Badge>
                    {breakdown.total_estimated_hours && (
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock3 className="w-3 h-3" />
                        ~{breakdown.total_estimated_hours}h total
                      </span>
                    )}
                  </div>
                  {breakdown.suggested_approach && (
                    <p className="text-sm text-muted-foreground">
                      {breakdown.suggested_approach}
                    </p>
                  )}
                </div>
              )}

              {subtasks.length > 0 && (
                <div className="space-y-2">
                  {subtasks.map((subtask, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border bg-background space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-mono">
                            {index + 1}.
                          </span>
                          <span className="text-sm font-medium">{subtask.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock3 className="w-3 h-3" />
                          {subtask.estimated_minutes}m
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground pl-5">
                        {subtask.description}
                      </p>
                      <div className="flex items-center gap-2 pl-5">
                        {subtask.can_be_delegated && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <User className="w-3 h-3" />
                            Can delegate
                          </Badge>
                        )}
                        {subtask.tools_needed.length > 0 && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <Wrench className="w-3 h-3" />
                            {subtask.tools_needed[0]}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Insights (if available) */}
            {task.ai_generated && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Generated
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    This task was suggested by AI based on your startup context.
                  </p>
                  {task.ai_source && (
                    <Badge variant="secondary" className="text-xs">
                      Source: {task.ai_source}
                    </Badge>
                  )}
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="border-t p-4 flex gap-2 absolute bottom-0 left-0 right-0 bg-background">
          <Button variant="outline" className="flex-1" onClick={onEdit}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" className="text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
