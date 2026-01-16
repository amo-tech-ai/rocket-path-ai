import { format } from 'date-fns';
import { TaskWithProject, TASK_PRIORITIES, TASK_STATUSES } from '@/hooks/useTasks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  X, 
  Calendar, 
  Flag, 
  FolderKanban, 
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  Circle,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TaskDetailPanelProps {
  task: TaskWithProject;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: string) => void;
}

export function TaskDetailPanel({ 
  task, 
  onClose, 
  onEdit, 
  onDelete,
  onStatusChange 
}: TaskDetailPanelProps) {
  const priority = TASK_PRIORITIES.find(p => p.value === task.priority);
  const status = TASK_STATUSES.find(s => s.value === task.status);
  const isCompleted = task.status === 'completed';

  const handleToggleComplete = () => {
    onStatusChange(isCompleted ? 'pending' : 'completed');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="h-full flex flex-col bg-card border-l"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-lg">Task Details</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
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

          {/* AI Insights (if available) */}
          {task.ai_generated && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">AI Generated</h4>
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
      <div className="border-t p-4 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onEdit}>
          <Edit2 className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button variant="outline" className="text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
