import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Target,
  TrendingUp,
  Loader2,
  ChevronDown,
  Rocket
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useStageGuidance, useStageRecommendations, STAGE_ORDER, STAGE_CONFIG, StartupStage } from '@/hooks/useStageGuidance';
import { useStartup } from '@/hooks/useDashboardData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function StageGuidanceCard() {
  const { data: guidance, isLoading } = useStageGuidance();
  const { data: startup } = useStartup();
  const recommendations = useStageRecommendations();
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<string | null>(null);

  const handleGetRecommendations = async () => {
    if (!startup?.id) return;
    
    try {
      const result = await recommendations.mutateAsync(startup.id);
      setAiRecommendations(result?.response || result?.message || 'No recommendations available');
      toast.success('Recommendations generated');
    } catch (err) {
      toast.error('Failed to get recommendations');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!guidance) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>Set up your startup profile to see stage guidance</p>
        </CardContent>
      </Card>
    );
  }

  const { currentStage, milestones, progress, nextStage } = guidance;
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const totalMilestones = milestones.length;

  const stageIndex = STAGE_ORDER.indexOf(currentStage.key);

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-sage" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-warm-foreground" />;
      default:
        return <Circle className="w-4 h-4 text-muted-foreground/50" />;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Stage Guidance
          </CardTitle>
          <Badge 
            variant="secondary" 
            className="text-xs"
            style={{ backgroundColor: `${currentStage.color}20`, color: currentStage.color }}
          >
            {currentStage.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stage Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-muted-foreground">{currentStage.description}</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Stage Timeline */}
        <div className="flex items-center gap-1">
          {STAGE_ORDER.map((stageKey, idx) => {
            const stage = STAGE_CONFIG[stageKey];
            const isCurrent = stageKey === currentStage.key;
            const isCompleted = idx < stageIndex;
            
            return (
              <div key={stageKey} className="flex items-center flex-1">
                <div
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors",
                    isCompleted ? "bg-sage" : isCurrent ? "bg-primary" : "bg-muted"
                  )}
                />
                {idx < STAGE_ORDER.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-muted-foreground/50 mx-0.5 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Milestones Summary */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between h-auto py-2">
              <span className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
                <span>{completedMilestones}/{totalMilestones} milestones complete</span>
              </span>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                isExpanded && "rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2 pt-2"
            >
              {milestones.slice(0, 5).map((milestone) => (
                <div 
                  key={milestone.id}
                  className={cn(
                    "flex items-start gap-2 p-2 rounded-lg text-xs",
                    milestone.status === 'completed' && "bg-sage/10",
                    milestone.status === 'in_progress' && "bg-warm/10"
                  )}
                >
                  {getMilestoneIcon(milestone.status)}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium",
                      milestone.status === 'completed' && "text-sage line-through"
                    )}>
                      {milestone.title}
                    </p>
                    {milestone.target && milestone.status !== 'completed' && (
                      <p className="text-muted-foreground">
                        {milestone.progress || 0}/{milestone.target}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </CollapsibleContent>
        </Collapsible>

        {/* Next Stage Preview */}
        {nextStage && progress >= 75 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-primary/5 border border-primary/20"
          >
            <div className="flex items-center gap-2 text-xs">
              <Rocket className="w-4 h-4 text-primary" />
              <span className="font-medium">Almost ready for {nextStage.label}!</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Complete remaining milestones to advance your stage.
            </p>
          </motion.div>
        )}

        {/* AI Recommendations */}
        <div className="pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={handleGetRecommendations}
            disabled={recommendations.isPending}
          >
            {recommendations.isPending ? (
              <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 mr-2" />
            )}
            Get AI Recommendations
          </Button>

          <AnimatePresence>
            {aiRecommendations && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-3 rounded-lg bg-secondary/50 text-xs text-muted-foreground whitespace-pre-wrap"
              >
                {aiRecommendations}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
