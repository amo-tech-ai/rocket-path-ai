import { Target, ChevronRight, CheckCircle, Circle, Loader2, ArrowRight, Sparkles, RefreshCw, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useStageGuidance, StartupStage, Milestone } from '@/hooks/useStageGuidance';
import { useStageGuidanceAI, StageRecommendation } from '@/hooks/useStageGuidanceAI';
import { useStageAnalysis, useUpdateStartupStage } from '@/hooks/useStageAnalysis';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface StageGuidanceCardProps {
  stage?: StartupStage;
  startupId?: string;
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

const categoryColors: Record<string, string> = {
  discovery: 'bg-blue-100 text-blue-700',
  product: 'bg-purple-100 text-purple-700',
  growth: 'bg-green-100 text-green-700',
  fundraising: 'bg-amber-100 text-amber-700',
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

function RecommendationItem({ recommendation }: { recommendation: StageRecommendation }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2 py-2 border-b last:border-0"
    >
      <Sparkles className={cn(
        'w-3.5 h-3.5 mt-0.5 shrink-0',
        recommendation.priority === 'high' ? 'text-amber-500' : 'text-muted-foreground'
      )} />
      <div className="flex-1 min-w-0">
        <p className="text-sm">{recommendation.action}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0', categoryColors[recommendation.category] || '')}>
            {recommendation.category}
          </Badge>
          {recommendation.time_estimate && (
            <span className="text-[10px] text-muted-foreground">~{recommendation.time_estimate}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function StageGuidanceCard({ stage = 'idea', startupId, startupData = {}, onAskAI }: StageGuidanceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showAIGuidance, setShowAIGuidance] = useState(false);
  const [showTransitionAlert, setShowTransitionAlert] = useState(true);
  
  const guidance = useStageGuidance(stage, startupData);
  const { isLoading: aiLoading, error: aiError, guidance: aiGuidance, fetchGuidance } = useStageGuidanceAI();
  
  // Stage analysis from edge function
  const { data: analysis, isLoading: analysisLoading, refetch: refetchAnalysis } = useStageAnalysis(startupId);
  const updateStageMutation = useUpdateStartupStage(startupId);

  const { currentStage, progressPercent, completedMilestones, totalMilestones } = guidance;
  const visibleMilestones = expanded ? currentStage.milestones : currentStage.milestones.slice(0, 3);

  // Check if stage transition is available (compare as strings to avoid type mismatch)
  const hasStageUpdate = analysis?.ready_for_transition && 
    analysis?.detected_stage !== undefined &&
    showTransitionAlert;

  // Map between analyzer stages and guidance stages
  const stageDisplayMap: Record<string, string> = {
    ideation: 'Ideation',
    validation: 'Validation',
    mvp: 'MVP',
    growth: 'Growth',
    scale: 'Scale',
  };

  const handleGetAIGuidance = async () => {
    setShowAIGuidance(true);
    await fetchGuidance(stage, currentStage.milestones, startupData);
  };

  const handleUpdateStage = () => {
    if (analysis?.detected_stage) {
      // Map detected stage to StartupStage format
      const stageMap: Record<string, StartupStage> = {
        ideation: 'idea',
        validation: 'pre_seed',
        mvp: 'seed',
        growth: 'series_a',
        scale: 'series_a',
      };
      const mappedStage = stageMap[analysis.detected_stage] || 'idea';
      updateStageMutation.mutate(mappedStage as any);
      setShowTransitionAlert(false);
    }
  };

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
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="outline" 
                  className={cn('text-[10px]', stageColors[currentStage.stage])}
                >
                  {currentStage.label}
                </Badge>
                {analysisLoading && (
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                )}
                {analysis && (
                  <Badge variant="secondary" className="text-[10px] gap-1">
                    <TrendingUp className="w-2.5 h-2.5" />
                    Score: {analysis.score}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-semibold">{progressPercent}%</span>
            <p className="text-[10px] text-muted-foreground">to next stage</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stage Transition Alert */}
        <AnimatePresence>
          {hasStageUpdate && analysis && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert className="border-primary/30 bg-primary/5">
                <TrendingUp className="h-4 w-4 text-primary" />
                <AlertTitle className="text-sm">Stage Update Available</AlertTitle>
                <AlertDescription className="text-xs">
                  <p className="mb-2">
                    Based on your progress (score: {analysis.score}), you may be ready for the <strong>{stageDisplayMap[analysis.detected_stage] || analysis.detected_stage}</strong> stage.
                  </p>
                  {analysis.missing_for_next_stage.length > 0 && (
                    <p className="text-muted-foreground mb-2">
                      To advance further: {analysis.missing_for_next_stage.slice(0, 2).join(', ')}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Button 
                      size="sm" 
                      onClick={handleUpdateStage}
                      disabled={updateStageMutation.isPending}
                      className="text-xs h-7"
                    >
                      {updateStageMutation.isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin mr-1" />
                      ) : null}
                      Update Stage
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setShowTransitionAlert(false)}
                      className="text-xs h-7"
                    >
                      Dismiss
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Recommendations from Stage Analyzer */}
        {analysis?.recommendations && analysis.recommendations.length > 0 && !showAIGuidance && (
          <div className="bg-muted/30 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <AlertCircle className="w-3.5 h-3.5" />
              AI Recommendations
            </div>
            <ul className="space-y-1">
              {analysis.recommendations.map((rec, i) => (
                <li key={i} className="text-xs text-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

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


        {/* AI Guidance Section */}
        <AnimatePresence>
          {showAIGuidance && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-muted/30 rounded-lg p-3 space-y-3"
            >
              {aiLoading ? (
                <div className="flex items-center justify-center py-4 gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Getting personalized guidance...</span>
                </div>
              ) : aiError ? (
                <div className="text-center py-3">
                  <p className="text-sm text-destructive">{aiError}</p>
                  <Button variant="ghost" size="sm" onClick={handleGetAIGuidance} className="mt-2">
                    <RefreshCw className="w-3 h-3 mr-1" /> Retry
                  </Button>
                </div>
              ) : aiGuidance ? (
                <>
                  {/* Primary Focus */}
                  <div className="bg-primary/5 rounded p-2 border border-primary/10">
                    <p className="text-[10px] text-primary font-medium uppercase tracking-wide">Focus Now</p>
                    <p className="text-sm font-medium mt-0.5">{aiGuidance.primary_focus}</p>
                  </div>

                  {/* Stage Assessment */}
                  <p className="text-xs text-muted-foreground">{aiGuidance.stage_assessment}</p>

                  {/* Recommendations */}
                  {aiGuidance.recommendations.length > 0 && (
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Recommendations
                      </p>
                      <div className="divide-y">
                        {aiGuidance.recommendations.slice(0, 3).map((rec, i) => (
                          <RecommendationItem key={i} recommendation={rec} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Templates */}
                  {aiGuidance.templates.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {aiGuidance.templates.map((template, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px]">
                          {template}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Encouragement */}
                  <p className="text-xs text-sage italic">{aiGuidance.encouragement}</p>

                  {/* Refresh button */}
                  <Button variant="ghost" size="sm" className="w-full text-xs" onClick={handleGetAIGuidance}>
                    <RefreshCw className="w-3 h-3 mr-1" /> Refresh Guidance
                  </Button>
                </>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Milestones */}
        {!showAIGuidance && (
          <>
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
          </>
        )}

        {/* AI guidance CTA */}
        <Button
          variant={showAIGuidance ? "secondary" : "outline"}
          size="sm"
          className="w-full text-xs gap-2"
          onClick={() => {
            if (showAIGuidance) {
              setShowAIGuidance(false);
            } else {
              handleGetAIGuidance();
            }
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {showAIGuidance ? 'Show Milestones' : `Get AI Guidance for ${currentStage.label}`}
        </Button>

        {/* Ask AI directly */}
        {onAskAI && !showAIGuidance && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            onClick={() => onAskAI(`What should I focus on next at the ${currentStage.label} stage?`)}
          >
            Ask in AI Panel →
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
