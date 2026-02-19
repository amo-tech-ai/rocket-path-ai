/**
 * Risk Alert Component with slide-in animation
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { riskAlertVariants } from '@/hooks/realtime/animations';
import { RiskPayload } from '@/hooks/realtime/types';
import { Button } from '@/components/ui/button';

interface RiskAlertProps {
  risk: RiskPayload;
  onDismiss: () => void;
  onAction?: () => void;
  className?: string;
}

const severityConfig = {
  low: {
    icon: Info,
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-800 dark:text-blue-200',
    iconColor: 'text-blue-500',
  },
  medium: {
    icon: AlertCircle,
    bg: 'bg-yellow-50 dark:bg-yellow-950/30',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-800 dark:text-yellow-200',
    iconColor: 'text-yellow-500',
  },
  high: {
    icon: AlertTriangle,
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-200 dark:border-orange-800',
    text: 'text-orange-800 dark:text-orange-200',
    iconColor: 'text-orange-500',
  },
  critical: {
    icon: AlertTriangle,
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-800 dark:text-red-200',
    iconColor: 'text-red-500',
  },
};

export function RiskAlert({ risk, onDismiss, onAction, className }: RiskAlertProps) {
  const config = severityConfig[risk.severity];
  const Icon = config.icon;

  return (
    <motion.div
      variants={riskAlertVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(
        'relative p-4 rounded-lg border',
        config.bg,
        config.border,
        className
      )}
    >
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex gap-3">
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', config.iconColor)} />
        
        <div className="flex-1 min-w-0">
          <h4 className={cn('font-medium', config.text)}>{risk.title}</h4>
          <p className={cn('text-sm mt-1 opacity-80', config.text)}>
            {risk.description}
          </p>
          
          {risk.suggestedAction && (
            <div className="mt-3 flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onAction}
                className="text-xs"
              >
                {risk.suggestedAction}
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Risk Alert List with staggered animations
 */
interface RiskAlertListProps {
  risks: RiskPayload[];
  onDismiss: (index: number) => void;
  onAction?: (risk: RiskPayload) => void;
  className?: string;
}

export function RiskAlertList({ risks, onDismiss, onAction, className }: RiskAlertListProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <AnimatePresence mode="popLayout">
        {risks.map((risk, index) => (
          <RiskAlert
            key={`${risk.entityId}-${risk.timestamp}`}
            risk={risk}
            onDismiss={() => onDismiss(index)}
            onAction={() => onAction?.(risk)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
