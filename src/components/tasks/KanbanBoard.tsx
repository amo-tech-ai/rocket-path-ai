import { motion } from 'framer-motion';
import { TaskCard } from './TaskCard';
import { TaskWithProject, TASK_STATUSES } from '@/hooks/useTasks';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KanbanBoardProps {
  tasks: TaskWithProject[];
  onEditTask: (task: TaskWithProject) => void;
  onDeleteTask: (task: TaskWithProject) => void;
  onStatusChange: (taskId: string, status: string) => void;
  onAddTask: (status: string) => void;
  onTaskClick?: (task: TaskWithProject) => void;
  selectedTaskId?: string;
}

export function KanbanBoard({ 
  tasks, 
  onEditTask, 
  onDeleteTask, 
  onStatusChange,
  onAddTask,
  onTaskClick,
  selectedTaskId
}: KanbanBoardProps) {
  // Group tasks by status
  const tasksByStatus = TASK_STATUSES.reduce((acc, status) => {
    acc[status.value] = tasks.filter(t => t.status === status.value);
    return acc;
  }, {} as Record<string, TaskWithProject[]>);

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onStatusChange(taskId, status);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
      {TASK_STATUSES.map((status, columnIndex) => {
        const columnTasks = tasksByStatus[status.value] || [];
        
        return (
          <motion.div
            key={status.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: columnIndex * 0.1 }}
            className="flex-shrink-0 w-80"
            onDrop={(e) => handleDrop(e, status.value)}
            onDragOver={handleDragOver}
          >
            {/* Column header */}
            <div className={cn(
              "rounded-t-xl px-4 py-3 border-b-2",
              status.color
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{status.label}</span>
                  <span className="text-xs text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded">
                    {columnTasks.length}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => onAddTask(status.value)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Tasks column */}
            <div className="bg-secondary/20 rounded-b-xl p-2 min-h-[400px] space-y-2">
              {columnTasks.length === 0 ? (
                <div 
                  className="text-center py-8 text-xs text-muted-foreground border-2 border-dashed border-border rounded-lg"
                >
                  Drop tasks here
                </div>
              ) : (
                columnTasks.map((task, taskIndex) => (
                  <div
                    key={task.id}
                    onClick={() => onTaskClick?.(task)}
                    className={cn(
                      "cursor-pointer rounded-lg transition-all",
                      selectedTaskId === task.id && "ring-2 ring-primary"
                    )}
                  >
                    <TaskCard
                      task={task}
                      onEdit={() => onEditTask(task)}
                      onDelete={() => onDeleteTask(task)}
                      onStatusChange={(status) => onStatusChange(task.id, status)}
                      index={taskIndex}
                    />
                  </div>
                ))
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
