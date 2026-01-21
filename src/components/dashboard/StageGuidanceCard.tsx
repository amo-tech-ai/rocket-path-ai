import { Target, ChevronRight, CheckCircle, Circle, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStageGuidance, StartupStage, Milestone } from '@/hooks/useStageGuidance';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface StageGuidanceCardProps {
  stage?: StartupStage;
  startupData?: {
    hasLeanCanvas?: boolean;
    profileStrength?: number;
    investorCount?: number;
    taskCompletionRate?: number;
    documentCount?: number;
  };
  onAskAI?: (question: string) => void;
}

const stageColors: Record<StartupStage, string> = {
  idea: 'bg-blue-500/10 text-blue-600 border-blue-200',
  pre_seed: 'bg-purple-500/10 text-purple-600 border-purple-200',
  seed: 'bg-sage-light text-sage border-sage/30',
  series_a: 'bg-amber-500/10 text-amber-600 border-amber-200',
};

function MilestoneItem({ milestone }: { milestone: Milestone }) {
  const statusIcon = {
    completed: <CheckCircle className="w-4 h-4 text-sage" />,
    in_progress: <Loader2 className="w-4 h-4 text-primary animate-spin" />,
    pending: <Circle className="w-4 h-4 text-muted-foreground/40" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 py-2"
    >
      <span className="mt-0.5">{statusIcon[milestone.status]}</span>
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium',
          milestone.status === 'completed' && 'line-through text-muted-foreground'
        )}>
          {milestone.title}
        </p>
        <p className="text-xs text-muted-foreground">{milestone.description}</p>
        {milestone.progress !== undefined && milestone.target && milestone.status !== 'completed' && (
          <div className="mt-1.5 flex items-center gap-2">
            <Progress 
              value={(milestone.progress / milestone.target) * 100} 
              className="h-1.5 flex-1" 
            />
            <span className="text-[10px] text-muted-foreground">
              {milestone.progress}/{milestone.target}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function StageGuidanceCard({ stage = 'idea', startupData, onAskAI }: StageGuidanceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const guidance = useStageGuidance(stage, startupData);

  const { currentStage, progressPercent, completedMilestones, totalMilestones } = guidance;
  const visibleMilestones = expanded ? currentStage.milestones : currentStage.milestones.slice(0, 3);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium">Stage Progress</CardTitle>
              <Badge 
                variant="outline" 
                className={cn('mt-1 text-[10px]', stageColors[currentStage.stage])}
              >
                {currentStage.label}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-semibold">{progressPercent}%</span>
            <p className="text-[10px] text-muted-foreground">to next stage</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div>
          <Progress value={progressPercent} className="h-2" />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>{completedMilestones} of {totalMilestones} milestones</span>
            {currentStage.nextStage && (
              <span className="flex items-center gap-1">
                Next: {STAGE_CONFIG[currentStage.nextStage]?.label}
                <ArrowRight className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>

        {/* Milestones */}
        <div className="divide-y">
          <AnimatePresence>
            {visibleMilestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <MilestoneItem milestone={milestone} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Expand/collapse */}
        {currentStage.milestones.length > 3 && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show less' : `Show all ${currentStage.milestones.length} milestones`}
            <ChevronRight className={cn(
              'w-3 h-3 ml-1 transition-transform',
              expanded && 'rotate-90'
            )} />
          </Button>
        )}

        {/* AI guidance CTA */}
        {onAskAI && (
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs gap-2"
            onClick={() => onAskAI(`What should I focus on next at the ${currentStage.label} stage?`)}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Get AI Guidance for {currentStage.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Export stage config for use elsewhere
const STAGE_CONFIG: Record<StartupStage, { label: string }> = {
  idea: { label: 'Ideation' },
  pre_seed: { label: 'Validation' },
  seed: { label: 'Traction' },
  series_a: { label: 'Scaling' },
};
