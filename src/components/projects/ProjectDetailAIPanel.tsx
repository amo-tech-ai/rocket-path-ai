import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Lightbulb,
  Sparkles,
  ArrowRight,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";

interface TaskStats {
  completed: number;
  inProgress: number;
  pending: number;
  overdue: number;
  total: number;
}

interface ProjectDetailAIPanelProps {
  projectName: string;
  projectHealth?: string;
  taskStats: TaskStats;
  progress: number;
}

export function ProjectDetailAIPanel({ 
  projectName, 
  projectHealth = 'on_track',
  taskStats,
  progress 
}: ProjectDetailAIPanelProps) {
  const healthScore = projectHealth === 'on_track' ? 85 : projectHealth === 'at_risk' ? 55 : 25;
  
  const recommendations = [
    taskStats.overdue > 0 && {
      type: 'warning',
      title: 'Overdue Tasks',
      description: `${taskStats.overdue} task${taskStats.overdue > 1 ? 's' : ''} need immediate attention.`,
    },
    taskStats.inProgress > 3 && {
      type: 'tip',
      title: 'Focus Recommendation',
      description: 'Consider completing in-progress tasks before starting new ones.',
    },
    progress < 25 && {
      type: 'tip',
      title: 'Quick Win Tip',
      description: 'Start with the smallest task to build momentum.',
    },
    progress >= 75 && {
      type: 'success',
      title: 'Almost There!',
      description: 'Great progress! Focus on finishing remaining tasks.',
    },
  ].filter(Boolean);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* AI Project Coach Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="w-5 h-5 text-primary" />
                Project Coach
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {taskStats.total === 0 
                  ? "Add tasks to get AI insights for this project."
                  : `Analyzing ${taskStats.total} tasks to optimize your workflow.`}
              </p>
              <Button size="sm" className="w-full" variant="sage">
                <Sparkles className="w-4 h-4 mr-2" />
                Get AI Suggestions
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <Separator />

        {/* Productivity Insights */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="w-4 h-4 text-sage" />
                Productivity Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completion Rate</span>
                <Badge variant="secondary">
                  {progress}%
                </Badge>
              </div>
              <Progress value={progress} className="h-2" />
              
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="text-lg font-semibold text-muted-foreground">{taskStats.pending}</div>
                  <div className="text-xs text-muted-foreground">To Do</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="text-lg font-semibold text-warm-foreground">{taskStats.inProgress}</div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="text-lg font-semibold text-sage">{taskStats.completed}</div>
                  <div className="text-xs text-muted-foreground">Done</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Smart Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Lightbulb className="w-4 h-4 text-warm-foreground" />
                Smart Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recommendations.length > 0 ? (
                recommendations.slice(0, 2).map((rec, index) => (
                  <div 
                    key={index}
                    className={`flex items-start gap-2 p-2 rounded-lg ${
                      rec?.type === 'warning' 
                        ? 'bg-destructive/10 border border-destructive/20'
                        : rec?.type === 'success'
                        ? 'bg-sage/10 border border-sage/20'
                        : 'bg-primary/10 border border-primary/20'
                    }`}
                  >
                    {rec?.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    ) : rec?.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />
                    ) : (
                      <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    )}
                    <div className="text-xs">
                      <p className="font-medium">{rec?.title}</p>
                      <p className="text-muted-foreground">{rec?.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-start gap-2 p-2 rounded-lg bg-sage/10 border border-sage/20">
                  <CheckCircle2 className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-medium text-sage">Quick Win Tip</p>
                    <p className="text-muted-foreground">Start your day with a small task to build momentum.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Focus Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Focus Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Based on your current workload:
              </p>
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary/10 to-transparent border border-primary/20">
                <p className="text-xs font-medium">
                  {taskStats.inProgress > 0 
                    ? 'Complete your in-progress tasks first'
                    : taskStats.pending > 0
                    ? 'Start with the highest priority pending task'
                    : 'Great job! All tasks completed.'}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="w-full text-xs mt-2">
                View Prioritized List
                <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ScrollArea>
  );
}
