/**
 * Task Breakdown Panel
 * AI-powered subtask generation for complex tasks
 */

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  ListTree, 
  RefreshCw, 
  Clock,
  CheckCircle,
  Circle,
  ArrowRight,
  Users,
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Subtask {
  title: string;
  description: string;
  estimated_minutes: number;
  order: number;
  can_be_delegated: boolean;
  tools_needed: string[];
}

interface BreakdownResult {
  parent_task: string;
  subtasks: Subtask[];
  total_estimated_hours: number;
  complexity: string;
  suggested_approach: string;
}

interface TaskBreakdownPanelProps {
  taskId?: string;
  taskTitle?: string;
  onCreateSubtask?: (subtask: Subtask) => void;
}

export function TaskBreakdownPanel({ 
  taskId, 
  taskTitle,
  onCreateSubtask 
}: TaskBreakdownPanelProps) {
  const [result, setResult] = useState<BreakdownResult | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const breakdown = useMutation({
    mutationFn: async () => {
      if (!taskId) throw new Error('No task selected');

      const { data, error } = await supabase.functions.invoke('task-agent', {
        body: {
          action: 'breakdown_task',
          data: { task_id: taskId }
        }
      });

      if (error) throw error;
      return data as BreakdownResult;
    },
    onSuccess: (data) => {
      setResult(data);
      setCompletedSteps(new Set());
      toast.success('Task broken down into subtasks');
    },
    onError: () => {
      toast.error('Failed to break down task');
    }
  });

  const toggleStep = (order: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(order)) {
      newCompleted.delete(order);
    } else {
      newCompleted.add(order);
    }
    setCompletedSteps(newCompleted);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low':
        return 'bg-sage/20 text-sage border-sage/30';
      case 'high':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      default:
        return 'bg-warm/20 text-warm-foreground border-warm/30';
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (!taskId) {
    return (
      <div className="p-4 text-center py-8">
        <ListTree className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">
          Select a task to break it down into subtasks
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            <ListTree className="w-4 h-4" />
            Task Breakdown
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => breakdown.mutate()}
            disabled={breakdown.isPending}
          >
            {breakdown.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {taskTitle || 'Selected task'}
        </p>
      </div>

      <ScrollArea className="flex-1">
        {!result ? (
          <div className="p-4 text-center py-8">
            <ListTree className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              Break this task into actionable steps
            </p>
            <Button
              onClick={() => breakdown.mutate()}
              disabled={breakdown.isPending}
              size="sm"
            >
              {breakdown.isPending ? 'Analyzing...' : 'Break Down Task'}
            </Button>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Summary */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={cn("text-xs", getComplexityColor(result.complexity))}>
                {result.complexity} complexity
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                ~{result.total_estimated_hours}h total
              </Badge>
              <Badge variant="outline" className="text-xs">
                {completedSteps.size}/{result.subtasks.length} done
              </Badge>
            </div>

            {/* Approach */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <ArrowRight className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium">Suggested Approach</span>
              </div>
              <p className="text-xs text-muted-foreground">{result.suggested_approach}</p>
            </div>

            {/* Subtasks */}
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-2">
                SUBTASKS
              </h4>
              <AnimatePresence>
                <div className="space-y-2">
                  {result.subtasks.map((subtask, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={cn(
                        "border rounded-lg p-3 cursor-pointer transition-colors",
                        completedSteps.has(subtask.order) && "bg-sage/5 border-sage/30"
                      )}
                      onClick={() => toggleStep(subtask.order)}
                    >
                      <div className="flex items-start gap-2">
                        <button className="mt-0.5 flex-shrink-0">
                          {completedSteps.has(subtask.order) ? (
                            <CheckCircle className="w-4 h-4 text-sage" />
                          ) : (
                            <Circle className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className={cn(
                              "text-sm font-medium",
                              completedSteps.has(subtask.order) && "line-through text-muted-foreground"
                            )}>
                              {subtask.title}
                            </span>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatTime(subtask.estimated_minutes)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {subtask.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {subtask.can_be_delegated && (
                              <Badge variant="outline" className="text-xs">
                                <Users className="w-3 h-3 mr-1" />
                                Delegable
                              </Badge>
                            )}
                            {subtask.tools_needed.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                <Wrench className="w-3 h-3 mr-1" />
                                {subtask.tools_needed[0]}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
