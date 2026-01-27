import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  Zap,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Loader2,
  BarChart3,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  usePrioritizeTasks, 
  useAnalyzeProductivity,
  useGenerateDailyPlan,
  type ProductivityResult 
} from "@/hooks/useTaskAgent";

interface TaskStats {
  pending: number;
  inProgress: number;
  completed: number;
  total: number;
}

interface TasksAIPanelProps {
  stats: TaskStats;
  startupId?: string;
  onGenerateTasks?: () => void;
}

export function TasksAIPanel({ stats, startupId, onGenerateTasks }: TasksAIPanelProps) {
  const [productivityData, setProductivityData] = useState<ProductivityResult | null>(null);
  
  const prioritizeTasks = usePrioritizeTasks();
  const analyzeProductivity = useAnalyzeProductivity();
  const generateDailyPlan = useGenerateDailyPlan();
  
  const completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  const productivityLevel = completionRate > 70 ? 'high' : completionRate > 40 ? 'medium' : 'low';

  const handlePrioritize = async () => {
    if (!startupId) return;
    await prioritizeTasks.mutateAsync({ startupId });
  };

  const handleAnalyzeProductivity = async () => {
    if (!startupId) return;
    const result = await analyzeProductivity.mutateAsync({ startupId, days: 30 });
    if (result.success) {
      setProductivityData(result);
    }
  };

  const handleGeneratePlan = async () => {
    if (!startupId) return;
    await generateDailyPlan.mutateAsync({ startupId, availableHours: 8 });
  };

  const isPrioritizing = prioritizeTasks.isPending;
  const isAnalyzing = analyzeProductivity.isPending;
  const isGeneratingPlan = generateDailyPlan.isPending;


  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* AI Task Coach Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="w-5 h-5 text-primary" />
                AI Task Coach
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {stats.pending > 5 
                  ? "You have several tasks pending. Focus on high-priority items first."
                  : stats.pending > 0 
                    ? "Good progress! Keep the momentum going."
                    : "All caught up! Time to plan your next moves."}
              </p>
              <Button 
                size="sm" 
                className="w-full" 
                variant="sage"
                onClick={onGenerateTasks}
              >
                <Zap className="w-4 h-4 mr-2" />
                Generate AI Tasks
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
                <Badge variant={productivityLevel === 'high' ? 'default' : productivityLevel === 'medium' ? 'secondary' : 'outline'}>
                  {completionRate}%
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-sage h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="text-lg font-semibold text-warm-foreground">{stats.pending}</div>
                  <div className="text-xs text-muted-foreground">To Do</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="text-lg font-semibold text-primary">{stats.inProgress}</div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="text-lg font-semibold text-sage">{stats.completed}</div>
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
              {stats.inProgress > 3 && (
                <div className="flex items-start gap-2 p-2 rounded-lg bg-warm/10 border border-warm/20">
                  <AlertTriangle className="w-4 h-4 text-warm-foreground mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-medium text-warm-foreground">Too many tasks in progress</p>
                    <p className="text-muted-foreground">Consider completing some before starting new ones.</p>
                  </div>
                </div>
              )}
              
              {stats.pending > 10 && (
                <div className="flex items-start gap-2 p-2 rounded-lg bg-muted">
                  <Target className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-medium">Prioritize your backlog</p>
                    <p className="text-muted-foreground">Review and prioritize pending tasks to stay focused.</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2 p-2 rounded-lg bg-sage/10 border border-sage/20">
                <CheckCircle2 className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-medium text-sage">Quick Win Tip</p>
                  <p className="text-muted-foreground">Start your day with a small task to build momentum.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Task Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Target className="w-4 h-4 text-primary" />
                AI Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-xs"
                onClick={handlePrioritize}
                disabled={isPrioritizing || !startupId}
              >
                {isPrioritizing ? (
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                ) : (
                  <TrendingUp className="w-3 h-3 mr-2" />
                )}
                AI Prioritize Tasks
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-xs"
                onClick={handleAnalyzeProductivity}
                disabled={isAnalyzing || !startupId}
              >
                {isAnalyzing ? (
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                ) : (
                  <BarChart3 className="w-3 h-3 mr-2" />
                )}
                Analyze Productivity
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-xs"
                onClick={handleGeneratePlan}
                disabled={isGeneratingPlan || !startupId}
              >
                {isGeneratingPlan ? (
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                ) : (
                  <Calendar className="w-3 h-3 mr-2" />
                )}
                Generate Daily Plan
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Productivity Analysis Results */}
        {productivityData && productivityData.health_score !== undefined && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    Productivity Score
                  </CardTitle>
                  <Badge variant={productivityData.health_score >= 80 ? 'default' : 'secondary'}>
                    {productivityData.health_score}/100
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground">{productivityData.summary}</p>
                {productivityData.focus_suggestion && (
                  <div className="p-2 rounded-lg bg-background/50 text-xs">
                    <span className="font-medium">Focus: </span>
                    {productivityData.focus_suggestion}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Task Prioritization */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Focus Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Based on your current workload:
                </p>
                <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-transparent border border-primary/20">
                  <p className="text-sm font-medium">
                    {stats.inProgress > 0 
                      ? "Complete your in-progress tasks first" 
                      : stats.pending > 0 
                        ? "Start with your highest priority pending task"
                        : "Great job! Consider planning tomorrow's work"}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  View Prioritized List
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ScrollArea>
  );
}
