/**
 * New Badge with fade-out animation
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { newBadgeVariants } from '@/hooks/realtime/animations';

interface NewBadgeProps {
  count: number;
  autoHide?: boolean;
  hideDelay?: number;
  className?: string;
}

export function NewBadge({
  count,
  autoHide = true,
  hideDelay = 5000,
  className,
}: NewBadgeProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoHide && count > 0) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), hideDelay);
      return () => clearTimeout(timer);
    }
  }, [count, autoHide, hideDelay]);

  if (count === 0) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.span
          variants={newBadgeVariants}
          initial="initial"
          animate="animate"
          exit="fadeOut"
          className={cn(
            'inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium',
            'bg-primary text-primary-foreground rounded-full',
            className
          )}
        >
          +{count} new
        </motion.span>
      )}
    </AnimatePresence>
  );
}

/**
 * Pulse Badge for score changes
 */
interface PulseBadgeProps {
  value: number | string;
  changed?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  className?: string;
}

export function PulseBadge({
  value,
  changed = false,
  variant = 'default',
  className,
}: PulseBadgeProps) {
  const [shouldPulse, setShouldPulse] = useState(false);

  useEffect(() => {
    if (changed) {
      setShouldPulse(true);
      const timer = setTimeout(() => setShouldPulse(false), 400);
      return () => clearTimeout(timer);
    }
  }, [changed, value]);

  const variantStyles = {
    default: 'bg-muted text-muted-foreground',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
    destructive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
  };

  return (
    <motion.span
      animate={shouldPulse ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] }}
      className={cn(
        'inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full',
        variantStyles[variant],
        className
      )}
    >
      {value}
    </motion.span>
  );
}
