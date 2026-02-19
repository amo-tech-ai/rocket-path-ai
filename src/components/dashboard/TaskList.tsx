import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

interface TaskWithProject {
  id: string;
  title: string;
  status: string | null;
  priority: string | null;
  project: { name: string } | null;
}

interface TaskListProps {
  tasks: TaskWithProject[];
  isLoading?: boolean;
}

export function TaskList({ tasks, isLoading }: TaskListProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-elevated p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </motion.div>
    );
  }

  const displayTasks = tasks.length > 0 ? tasks : [
    { id: '1', title: 'No priority tasks yet', status: 'pending', priority: 'high', project: null }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card-elevated p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-sage" />
          <h2 className="font-semibold">Today's Priorities</h2>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {displayTasks.map((task) => {
          const isCompleted = task.status === 'completed';
          return (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-sage flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </p>
                {task.project && (
                  <p className="text-xs text-muted-foreground">{task.project.name}</p>
                )}
              </div>
              {task.priority === 'urgent' && (
                <span className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                  Urgent
                </span>
              )}
            </div>
          );
        })}
      </div>

      <Button variant="ghost" size="sm" className="w-full mt-4 text-muted-foreground" asChild>
        <Link to="/tasks">
          View all tasks
          <ArrowUpRight className="w-4 h-4 ml-1" />
        </Link>
      </Button>
    </motion.div>
  );
}
