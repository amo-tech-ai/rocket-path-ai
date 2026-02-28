/**
 * FocusActions Component (Zone 2)
 * Numbered action cards with time estimates, impact badges, and CTAs.
 * Dual-source: useDailyFocus (primary) → useActionRecommender (fallback).
 * Replaces: TodaysFocus (simple) with richer UX from TodaysFocusCard pattern.
 */

import { motion } from 'framer-motion';
import { ArrowRight, Clock, Sparkles, Zap, Target, CheckCircle2, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import type { RecommendedAction } from '@/hooks/useActionRecommender';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface FocusActionsProps {
  startupId: string | undefined;
  fallbackActions?: RecommendedAction[];
  fallbackLoading?: boolean;
}

// ---------------------------------------------------------------------------
// Constants (reused from TodaysFocus.tsx)
// ---------------------------------------------------------------------------

const IMPACT_COLORS: Record<string, string> = {
  high: 'bg-status-critical-light text-status-critical border-status-critical/20',
  medium: 'bg-status-warning-light text-status-warning border-status-warning/20',
  low: 'bg-status-success-light text-status-success border-status-success/20',
};

const EFFORT_LABELS: Record<string, string> = {
  quick: '5 min',
  medium: '15 min',
  involved: '30+ min',
};

const MODULE_ICONS: Record<string, React.ReactNode> = {
  canvas: <Target className="w-3.5 h-3.5" />,
  pitch: <Zap className="w-3.5 h-3.5" />,
  tasks: <Clock className="w-3.5 h-3.5" />,
  crm: <Target className="w-3.5 h-3.5" />,
  profile: <Target className="w-3.5 h-3.5" />,
  validation: <Sparkles className="w-3.5 h-3.5" />,
};

// ---------------------------------------------------------------------------
// ActionCard — numbered card with title, impact, time, reason, CTA
// ---------------------------------------------------------------------------

function ActionCard({
  index,
  action,
  onNavigate,
}: {
  index: number;
  action: RecommendedAction;
  onNavigate: (route: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="group flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
      onClick={() => onNavigate(action.route)}
    >
      {/* Number badge */}
      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
        {index}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-primary/60 flex-shrink-0">
            {MODULE_ICONS[action.module] ?? <Target className="w-3.5 h-3.5" />}
          </span>
          <h4 className="text-sm font-medium text-foreground truncate">
            {action.title}
          </h4>
          <Badge
            variant="outline"
            className={`text-[10px] px-1.5 py-0 flex-shrink-0 ${IMPACT_COLORS[action.impact] ?? ''}`}
          >
            {action.impact}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
          {action.reason || action.description}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {EFFORT_LABELS[action.effort] ?? action.effort}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="h-auto p-0 text-xs text-primary hover:text-primary/80 font-medium"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(action.route);
            }}
          >
            Start <ArrowRight className="w-3 h-3 ml-0.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FocusActions({
  fallbackActions,
  fallbackLoading,
}: FocusActionsProps) {
  const navigate = useNavigate();
  const actions = (fallbackActions ?? []).slice(0, 3);
  const isLoading = fallbackLoading ?? false;

  if (isLoading) {
    return (
      <div className="card-premium p-5 space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (actions.length === 0) {
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
        <div className="text-center py-6">
          <div className="w-10 h-10 rounded-full bg-status-success-light flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-5 h-5 text-status-success" />
          </div>
          <p className="text-sm font-medium text-foreground">
            You're all caught up!
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Keep up the great work on your startup.
          </p>
        </div>
      </motion.div>
    );
  }

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
          {actions.length} action{actions.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Action cards */}
      <div className="space-y-3">
        {actions.map((action, i) => (
          <ActionCard
            key={action.id}
            index={i + 1}
            action={action}
            onNavigate={(route) => navigate(route)}
          />
        ))}
      </div>
    </motion.div>
  );
}
