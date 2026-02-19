/**
 * Task Prioritization Panel
 * Shows AI-ranked tasks with impact/urgency scores
 */

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  RefreshCw, 
  Target,
  Zap,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PrioritizedTask {
  task_id: string;
  title: string;
  new_priority: string;
  rank: number;
  reasoning: string;
  impact_score: number;
  urgency_score: number;
  effort_estimate: string;
}

interface PrioritizationResult {
  prioritized_tasks: PrioritizedTask[];
  focus_recommendation: string;
  defer_recommendation: string;
}

interface TaskPrioritizationPanelProps {
  startupId?: string;
  tasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
  }>;
  onPriorityChange?: (taskId: string, priority: string) => void;
}

export function TaskPrioritizationPanel({ 
  startupId, 
  tasks,
  onPriorityChange 
}: TaskPrioritizationPanelProps) {
  const [result, setResult] = useState<PrioritizationResult | null>(null);

  const prioritize = useMutation({
    mutationFn: async () => {
      if (!startupId) throw new Error('No startup ID');

      const { data, error } = await supabase.functions.invoke('task-agent', {
        body: {
          action: 'prioritize_tasks',
          data: { startup_id: startupId }
        }
      });

      if (error) throw error;
      return data as PrioritizationResult;
    },
    onSuccess: (data) => {
      setResult(data);
      toast.success('Tasks prioritized by AI');
      
      // Apply priority changes
      data.prioritized_tasks.forEach(task => {
        onPriorityChange?.(task.task_id, task.new_priority);
      });
    },
    onError: () => {
      toast.error('Failed to prioritize tasks');
    }
  });

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <ArrowUp className="w-3 h-3 text-destructive" />;
      case 'low':
        return <ArrowDown className="w-3 h-3 text-sage" />;
      default:
        return <Minus className="w-3 h-3 text-warm-foreground" />;
    }
  };

  const getEffortBadge = (effort: string) => {
    switch (effort) {
      case 'low':
        return <Badge variant="outline" className="text-xs bg-sage/10">Quick</Badge>;
      case 'high':
        return <Badge variant="outline" className="text-xs bg-destructive/10">Complex</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Medium</Badge>;
    }
  };

  const pendingTasks = tasks.filter(t => t.status !== 'completed');

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            AI Prioritization
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => prioritize.mutate()}
            disabled={prioritize.isPending || !startupId || pendingTasks.length === 0}
          >
            {prioritize.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {pendingTasks.length} tasks to prioritize
        </p>
      </div>

      <ScrollArea className="flex-1">
        {!result ? (
          <div className="p-4 text-center py-8">
            <Target className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              Let AI analyze and prioritize your tasks based on impact and urgency
            </p>
            <Button
              onClick={() => prioritize.mutate()}
              disabled={prioritize.isPending || !startupId || pendingTasks.length === 0}
              size="sm"
            >
              {prioritize.isPending ? 'Analyzing...' : 'Prioritize Tasks'}
            </Button>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Focus Recommendation */}
            <div className="bg-sage/10 border border-sage/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-sage" />
                <span className="text-xs font-medium text-sage">Focus This Week</span>
              </div>
              <p className="text-sm">{result.focus_recommendation}</p>
            </div>

            {/* Prioritized List */}
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-2">
                RANKED BY IMPACT
              </h4>
              <AnimatePresence>
                <div className="space-y-2">
                  {result.prioritized_tasks.map((task, idx) => (
                    <motion.div
                      key={task.task_id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                            {task.rank}
                          </span>
                          <span className="text-sm font-medium">{task.title}</span>
                        </div>
                        {getPriorityIcon(task.new_priority)}
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>Impact</span>
                            <span>{task.impact_score}%</span>
                          </div>
                          <Progress value={task.impact_score} className="h-1" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>Urgency</span>
                            <span>{task.urgency_score}%</span>
                          </div>
                          <Progress value={task.urgency_score} className="h-1" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground flex-1">
                          {task.reasoning}
                        </p>
                        {getEffortBadge(task.effort_estimate)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </div>

            {/* Defer Recommendation */}
            {result.defer_recommendation && (
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Can Wait</span>
                </div>
                <p className="text-xs text-muted-foreground">{result.defer_recommendation}</p>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
