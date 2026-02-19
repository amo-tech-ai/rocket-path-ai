import { 
  MoreHorizontal, 
  Calendar,
  CheckCircle2,
  Circle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TaskWithProject, TASK_PRIORITIES } from '@/hooks/useTasks';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: TaskWithProject;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (status: string) => void;
  index?: number;
}

export function TaskCard({ 
  task, 
  onEdit, 
  onDelete,
  onStatusChange,
  index = 0 
}: TaskCardProps) {
  const priority = TASK_PRIORITIES.find(p => p.value === task.priority);
  const isCompleted = task.status === 'completed';

  const PriorityIcon = task.priority === 'urgent' ? AlertCircle : 
                       task.priority === 'high' ? AlertCircle : Circle;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  return (
    <div
      className={cn(
        "bg-card rounded-lg p-3 shadow-sm border border-border/50 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group",
        isCompleted && "opacity-60"
      )}
      draggable
      onDragStart={handleDragStart}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange?.(isCompleted ? 'pending' : 'completed');
            }}
            className="mt-0.5 flex-shrink-0"
          >
            {isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-sage" />
            ) : (
              <Circle className="w-4 h-4 text-muted-foreground hover:text-sage transition-colors" />
            )}
          </button>
          <p className={cn(
            "text-sm font-medium leading-tight",
            isCompleted && "line-through text-muted-foreground"
          )}>
            {task.title}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>Edit task</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onStatusChange?.('pending')}>
              Move to To Do
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange?.('in_progress')}>
              Move to In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange?.('completed')}>
              Move to Done
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              Delete task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Description preview */}
      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2 ml-6">
          {task.description}
        </p>
      )}

      {/* Meta row */}
      <div className="flex items-center gap-2 ml-6 flex-wrap">
        {task.project && (
          <Badge variant="secondary" className="text-xs h-5">
            {task.project.name}
          </Badge>
        )}
        
        {priority && task.priority !== 'medium' && (
          <span className={cn("flex items-center gap-1 text-xs", priority.color)}>
            <PriorityIcon className="w-3 h-3" />
            {priority.label}
          </span>
        )}
        
        {task.due_at && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {format(new Date(task.due_at), 'MMM d')}
          </span>
        )}
      </div>
    </div>
  );
}
