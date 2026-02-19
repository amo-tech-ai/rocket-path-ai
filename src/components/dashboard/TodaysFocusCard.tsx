/**
 * TodaysFocusCard Component
 * Displays AI-computed daily focus with scoring breakdown
 * Uses compute-daily-focus edge function via useDailyFocus hook
 */

import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  SkipForward,
  TrendingUp,
  Target,
  Clock,
  Activity,
  RefreshCw,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import {
  useDailyFocus,
  useCompleteDailyFocus,
  useSkipDailyFocus,
  DailyFocusRecommendation
} from '@/hooks/useDailyFocus';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TodaysFocusCardProps {
  startupId: string | undefined;
}

// Signal labels for scoring breakdown
const SIGNAL_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  health_gap: { label: 'Health Impact', icon: <TrendingUp className="w-3 h-3" /> },
  task_priority: { label: 'Priority', icon: <Target className="w-3 h-3" /> },
  stage_relevance: { label: 'Stage Fit', icon: <Zap className="w-3 h-3" /> },
  time_urgency: { label: 'Urgency', icon: <Clock className="w-3 h-3" /> },
  momentum: { label: 'Momentum', icon: <Activity className="w-3 h-3" /> },
};

function ScoreBar({ label, icon, score }: { label: string; icon: React.ReactNode; score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground w-20">
        {icon}
        <span>{label}</span>
      </div>
      <Progress
        value={score}
        className="h-1.5 flex-1"
      />
      <span className="text-[10px] text-muted-foreground w-6 text-right">{Math.round(score)}</span>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="card-premium p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="w-5 h-5 rounded" />
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-premium p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Today's Focus</h3>
      </div>
      <div className="text-center py-8">
        <div className="w-12 h-12 rounded-full bg-status-success-light flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6 text-status-success" />
        </div>
        <p className="text-sm font-medium text-foreground">All caught up!</p>
        <p className="text-xs text-muted-foreground mt-1">
          No pending tasks. Great job staying on top of things!
        </p>
      </div>
    </motion.div>
  );
}

function RecommendationCard({
  recommendation,
  startupId,
  onComplete,
  onSkip,
  isCompleting,
  isSkipping
}: {
  recommendation: DailyFocusRecommendation;
  startupId: string;
  onComplete: () => void;
  onSkip: () => void;
  isCompleting: boolean;
  isSkipping: boolean;
}) {
  const navigate = useNavigate();
  const { primary_action, secondary_actions, scoring_breakdown } = recommendation;
  const scores = scoring_breakdown.top_candidate_scores;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-premium p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Today's Focus</h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          Score: {scoring_breakdown.top_candidate_total}
        </Badge>
      </div>

      {/* Primary Action Card */}
      <div
        className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 mb-4 cursor-pointer hover:border-primary/40 transition-colors"
        onClick={() => navigate(primary_action.link)}
      >
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-foreground">{primary_action.title}</h4>
          <ArrowRight className="w-4 h-4 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground mb-3">{primary_action.description}</p>
        <p className="text-xs text-primary/80 italic">{primary_action.reason}</p>

        {/* Expected Outcome */}
        <div className="mt-3 pt-3 border-t border-primary/10">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Expected outcome:</span> {primary_action.expected_outcome}
          </p>
        </div>
      </div>

      {/* Scoring Breakdown (collapsed by default) */}
      <details className="mb-4 group">
        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground flex items-center gap-1">
          <span>Why this recommendation?</span>
        </summary>
        <div className="mt-3 p-3 rounded-lg bg-muted/30 space-y-2">
          {Object.entries(SIGNAL_LABELS).map(([key, { label, icon }]) => (
            <ScoreBar
              key={key}
              label={label}
              icon={icon}
              score={scores[key as keyof typeof scores] || 0}
            />
          ))}
          <div className="pt-2 mt-2 border-t border-border">
            <p className="text-[10px] text-muted-foreground">
              Stage: <span className="font-medium capitalize">{scoring_breakdown.stage}</span>
              {scoring_breakdown.health_overall && (
                <> · Health: <span className="font-medium">{scoring_breakdown.health_overall}/100</span></>
              )}
              · {scoring_breakdown.candidates_count} candidates evaluated
            </p>
          </div>
        </div>
      </details>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            navigate(primary_action.link);
          }}
        >
          Start Task
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          disabled={isCompleting}
          title="Mark as complete"
        >
          <CheckCircle2 className={cn("w-4 h-4", isCompleting && "animate-spin")} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onSkip();
          }}
          disabled={isSkipping}
          title="Skip and get new recommendation"
        >
          <SkipForward className={cn("w-4 h-4", isSkipping && "animate-spin")} />
        </Button>
      </div>

      {/* Secondary Actions */}
      {secondary_actions && secondary_actions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Also consider:</p>
          <div className="space-y-2">
            {secondary_actions.slice(0, 2).map((action, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => navigate(action.link)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{action.title}</p>
                </div>
                <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function TodaysFocusCard({ startupId }: TodaysFocusCardProps) {
  const { data, isLoading, refetch } = useDailyFocus(startupId);
  const completeMutation = useCompleteDailyFocus();
  const skipMutation = useSkipDailyFocus();

  const handleComplete = async () => {
    if (!data?.recommendation || !startupId) return;

    try {
      await completeMutation.mutateAsync({
        recommendationId: data.recommendation.id,
        startupId,
      });
      toast.success('Great work! Marked as complete.');
    } catch (error) {
      toast.error('Failed to mark as complete');
    }
  };

  const handleSkip = async () => {
    if (!data?.recommendation || !startupId) return;

    try {
      await skipMutation.mutateAsync({
        recommendationId: data.recommendation.id,
        startupId,
      });
      toast.info('Getting new recommendation...');
      refetch();
    } catch (error) {
      toast.error('Failed to skip');
    }
  };

  if (isLoading) return <LoadingState />;

  if (!data?.recommendation) return <EmptyState />;

  return (
    <RecommendationCard
      recommendation={data.recommendation}
      startupId={startupId!}
      onComplete={handleComplete}
      onSkip={handleSkip}
      isCompleting={completeMutation.isPending}
      isSkipping={skipMutation.isPending}
    />
  );
}
