/**
 * Day1PlanCard Component
 *
 * First-day guided checklist shown to new users.
 * Helps users complete their first actions after onboarding.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Clock, X, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Day1Task {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  completed: boolean;
  action: () => void;
}

interface Day1PlanCardProps {
  startupName: string;
  tasks: Day1Task[];
  onDismiss?: () => void;
  canDismiss: boolean;
}

export function Day1PlanCard({
  startupName,
  tasks,
  onDismiss,
  canDismiss,
}: Day1PlanCardProps) {
  const completedCount = tasks.filter(t => t.completed).length;
  const progress = Math.round((completedCount / tasks.length) * 100);
  const firstIncomplete = tasks.findIndex(t => !t.completed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Your Day 1 Plan</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Welcome, {startupName}! Get started with these steps.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {progress}% Complete
              </Badge>
              {canDismiss && onDismiss && (
                <Button variant="ghost" size="icon" onClick={onDismiss} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <Progress value={progress} className="h-1.5 mt-4" />
        </CardHeader>

        <CardContent className="space-y-3 pt-2">
          {tasks.map((task, index) => {
            const isCurrentTask = index === firstIncomplete;
            const isPastTask = index < firstIncomplete;

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start gap-4 p-3 rounded-lg transition-all ${
                  task.completed
                    ? 'bg-sage-50/50 opacity-60'
                    : isCurrentTask
                    ? 'bg-primary/5 border border-primary/20 shadow-sm'
                    : 'bg-muted/30 hover:bg-muted/50'
                }`}
              >
                <div className="pt-0.5">
                  <Checkbox
                    checked={task.completed}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    disabled
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </span>
                    {isCurrentTask && (
                      <Badge variant="default" className="text-xs animate-pulse">
                        Start Here
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{task.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{task.estimatedMinutes} min</span>
                  </div>
                  {!task.completed && (
                    <Button
                      size="sm"
                      variant={isCurrentTask ? 'default' : 'outline'}
                      onClick={task.action}
                      className="gap-1"
                    >
                      {isCurrentTask ? 'Start' : 'Do'}
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Completion message */}
          {completedCount === tasks.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 text-primary font-medium"
            >
              All done! Your full dashboard is now unlocked.
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default Day1PlanCard;
