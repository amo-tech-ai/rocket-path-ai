/**
 * Onboarding Realtime Progress Component
 * 
 * Displays live AI enrichment progress during onboarding:
 * - URL extraction status
 * - Context analysis status
 * - Founder profile enrichment status
 * - Readiness score updates
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, AlertCircle, Sparkles, Globe, Brain, User, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export type EnrichmentStatus = 'idle' | 'loading' | 'success' | 'error';

interface EnrichmentStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  status: EnrichmentStatus;
  error?: string;
}

interface OnboardingRealtimeProgressProps {
  urlStatus: EnrichmentStatus;
  contextStatus: EnrichmentStatus;
  founderStatus: EnrichmentStatus;
  readinessScore: number | null;
  urlError?: string;
  contextError?: string;
  founderError?: string;
  className?: string;
}

const StatusIcon = ({ status }: { status: EnrichmentStatus }) => {
  switch (status) {
    case 'loading':
      return <Loader2 className="w-4 h-4 animate-spin text-primary" />;
    case 'success':
      return <Check className="w-4 h-4 text-green-500" />;
    case 'error':
      return <AlertCircle className="w-4 h-4 text-destructive" />;
    default:
      return <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />;
  }
};

export function OnboardingRealtimeProgress({
  urlStatus,
  contextStatus,
  founderStatus,
  readinessScore,
  urlError,
  contextError,
  founderError,
  className,
}: OnboardingRealtimeProgressProps) {
  const steps: EnrichmentStep[] = [
    {
      id: 'url',
      label: 'Analyzing website',
      icon: <Globe className="w-4 h-4" />,
      status: urlStatus,
      error: urlError,
    },
    {
      id: 'context',
      label: 'Finding competitors & market',
      icon: <Brain className="w-4 h-4" />,
      status: contextStatus,
      error: contextError,
    },
    {
      id: 'founder',
      label: 'Enriching founder profile',
      icon: <User className="w-4 h-4" />,
      status: founderStatus,
      error: founderError,
    },
  ];

  const isAnyLoading = steps.some(s => s.status === 'loading');
  const completedCount = steps.filter(s => s.status === 'success').length;
  const progressPercent = (completedCount / steps.length) * 100;

  // Don't render if nothing is happening
  if (!isAnyLoading && completedCount === 0 && !readinessScore) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'rounded-lg border bg-card/50 backdrop-blur-sm p-4 space-y-4',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
        <span className="text-sm font-medium">AI Analysis in Progress</span>
      </div>

      {/* Progress bar */}
      <Progress value={progressPercent} className="h-1.5" />

      {/* Steps */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'flex items-center gap-3 p-2 rounded-md transition-colors',
                step.status === 'loading' && 'bg-primary/5',
                step.status === 'success' && 'bg-green-500/5',
                step.status === 'error' && 'bg-destructive/5'
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                step.status === 'idle' && 'bg-muted',
                step.status === 'loading' && 'bg-primary/10',
                step.status === 'success' && 'bg-green-500/10',
                step.status === 'error' && 'bg-destructive/10'
              )}>
                {step.status === 'idle' ? step.icon : <StatusIcon status={step.status} />}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-sm font-medium',
                  step.status === 'success' && 'text-green-600 dark:text-green-400',
                  step.status === 'error' && 'text-destructive'
                )}>
                  {step.label}
                </p>
                {step.status === 'error' && step.error && (
                  <p className="text-xs text-destructive/80 truncate">{step.error}</p>
                )}
                {step.status === 'loading' && (
                  <p className="text-xs text-muted-foreground">Processing...</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Readiness Score (when available) */}
      <AnimatePresence>
        {readinessScore !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20"
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Readiness Score</span>
            </div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold text-primary"
            >
              {readinessScore}%
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default OnboardingRealtimeProgress;
