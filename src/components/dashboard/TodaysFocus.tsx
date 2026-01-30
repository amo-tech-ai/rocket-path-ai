/**
 * TodaysFocus Component
 * Displays top 3 AI-recommended actions for the day
 */

import { motion } from 'framer-motion';
import { ArrowRight, Zap, Target, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { RecommendedAction } from '@/hooks/useActionRecommender';

interface TodaysFocusProps {
  actions: RecommendedAction[] | undefined;
  isLoading: boolean;
}

const MODULE_ICONS: Record<string, React.ReactNode> = {
  canvas: <Target className="w-4 h-4" />,
  pitch: <Zap className="w-4 h-4" />,
  tasks: <Clock className="w-4 h-4" />,
  crm: <Target className="w-4 h-4" />,
  profile: <Target className="w-4 h-4" />,
  validation: <Sparkles className="w-4 h-4" />,
};

const IMPACT_COLORS: Record<string, string> = {
  high: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
};

const EFFORT_LABELS: Record<string, string> = {
  quick: '5 min',
  medium: '15 min',
  involved: '30+ min',
};

export function TodaysFocus({ actions, isLoading }: TodaysFocusProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="card-premium p-5 space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!actions || actions.length === 0) {
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
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-foreground">You're all caught up!</p>
          <p className="text-xs text-muted-foreground mt-1">Keep up the great work on your startup.</p>
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Today's Focus</h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          {actions.length} action{actions.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
            onClick={() => navigate(action.route)}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                {MODULE_ICONS[action.module]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-foreground truncate">{action.title}</h4>
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${IMPACT_COLORS[action.impact]}`}>
                    {action.impact}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{action.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {EFFORT_LABELS[action.effort]}
                  </span>
                  <span className="text-[10px] text-primary/80">{action.reason}</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
