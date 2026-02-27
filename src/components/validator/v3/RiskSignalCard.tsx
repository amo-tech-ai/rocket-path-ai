/**
 * RiskSignalCard — Severity-colored alert for a single risk signal.
 * High = red border, Medium = amber border, Low = blue border.
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import type { RiskSignal } from '@/types/v3-report';

interface RiskSignalCardProps {
  signal: RiskSignal;
}

const SEVERITY_STYLES = {
  high: {
    border: 'border-l-red-500',
    bg: 'bg-red-50/50 dark:bg-red-950/20',
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    label: 'High Risk',
    labelColor: 'text-red-600 dark:text-red-400',
  },
  medium: {
    border: 'border-l-amber-500',
    bg: 'bg-amber-50/50 dark:bg-amber-950/20',
    icon: AlertCircle,
    iconColor: 'text-amber-500',
    label: 'Medium Risk',
    labelColor: 'text-amber-600 dark:text-amber-400',
  },
  low: {
    border: 'border-l-blue-500',
    bg: 'bg-blue-50/50 dark:bg-blue-950/20',
    icon: Info,
    iconColor: 'text-blue-500',
    label: 'Low Risk',
    labelColor: 'text-blue-600 dark:text-blue-400',
  },
} as const;

export const RiskSignalCard = memo(function RiskSignalCard({ signal }: RiskSignalCardProps) {
  const style = SEVERITY_STYLES[signal.severity] || SEVERITY_STYLES.medium;
  const Icon = style.icon;

  return (
    <div
      className={cn(
        'rounded-lg border border-l-4 p-4',
        style.border,
        style.bg,
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', style.iconColor)} />
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className={cn('text-xs font-semibold uppercase tracking-wider', style.labelColor)}>
              {style.label}
            </span>
            {signal.category && (
              <span className="text-xs text-muted-foreground">{signal.category}</span>
            )}
          </div>
          <p className="text-sm text-foreground">{signal.description}</p>
          {signal.mitigation && (
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Mitigation:</span> {signal.mitigation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});
