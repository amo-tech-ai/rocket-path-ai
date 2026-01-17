import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  FolderKanban, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  BarChart3,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  atRisk: number;
}

interface ProjectsAIPanelProps {
  stats: ProjectStats;
}

export function ProjectsAIPanel({ stats }: ProjectsAIPanelProps) {
  const healthScore = stats.total > 0 
    ? Math.round(((stats.active + stats.completed) / stats.total) * 100 - (stats.atRisk * 10))
    : 100;

  const healthStatus = healthScore >= 80 ? 'healthy' : healthScore >= 50 ? 'moderate' : 'needs attention';

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
                Project Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {stats.total === 0 
                  ? "Create projects to get AI-powered portfolio insights."
                  : `Tracking ${stats.total} projects with ${stats.active} currently active.`}
              </p>
              <Button size="sm" className="w-full" variant="sage">
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze Portfolio
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <Separator />

        {/* Portfolio Health */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <BarChart3 className="w-4 h-4 text-sage" />
                Portfolio Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overall Health</span>
                <Badge variant={healthStatus === 'healthy' ? 'default' : healthStatus === 'moderate' ? 'secondary' : 'destructive'}>
                  {healthScore}%
                </Badge>
              </div>
              <Progress value={Math.max(0, healthScore)} className="h-2" />
              
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="text-lg font-semibold text-sage">{stats.active}</div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="text-lg font-semibold text-primary">{stats.completed}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Risk Identification */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <AlertTriangle className="w-4 h-4 text-warm-foreground" />
                Risk Detection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.atRisk > 0 ? (
                <div className="flex items-start gap-2 p-2 rounded-lg bg-warm/10 border border-warm/20">
                  <AlertTriangle className="w-4 h-4 text-warm-foreground mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-medium text-warm-foreground">{stats.atRisk} Project{stats.atRisk > 1 ? 's' : ''} at Risk</p>
                    <p className="text-muted-foreground">Review timeline and resource allocation.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 p-2 rounded-lg bg-sage/10 border border-sage/20">
                  <CheckCircle2 className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-medium text-sage">No Risks Detected</p>
                    <p className="text-muted-foreground">All projects are on track.</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-2 p-2 rounded-lg bg-muted">
                <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-medium">Timeline Tip</p>
                  <p className="text-muted-foreground">Break large projects into smaller milestones.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resource Optimization */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Target className="w-4 h-4 text-muted-foreground" />
                Optimization Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground">
                AI recommendations for better project outcomes:
              </p>
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary/10 to-transparent border border-primary/20">
                  <p className="text-xs font-medium">Focus on completing one project before starting another</p>
                </div>
                <div className="p-2 rounded-lg bg-gradient-to-r from-sage/10 to-transparent border border-sage/20">
                  <p className="text-xs font-medium">Review project health weekly to catch issues early</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full text-xs mt-2">
                View Full Analysis
                <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ScrollArea>
  );
}
