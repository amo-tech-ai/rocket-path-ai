/**
 * Shimmer Loading Placeholder
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { shimmerVariants, shimmerGradient } from '@/hooks/realtime/animations';

interface ShimmerProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function Shimmer({ className, width, height }: ShimmerProps) {
  return (
    <motion.div
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
      className={cn('rounded bg-muted', className)}
      style={{
        width,
        height,
        backgroundImage: shimmerGradient,
        backgroundSize: '200% 100%',
      }}
    />
  );
}

/**
 * Shimmer Card Placeholder
 */
export function ShimmerCard({ className }: { className?: string }) {
  return (
    <div className={cn('p-4 rounded-lg border bg-card space-y-3', className)}>
      <Shimmer className="h-4 w-3/4" />
      <Shimmer className="h-3 w-full" />
      <Shimmer className="h-3 w-2/3" />
    </div>
  );
}

/**
 * Shimmer Text Lines
 */
interface ShimmerTextProps {
  lines?: number;
  className?: string;
}

export function ShimmerText({ lines = 3, className }: ShimmerTextProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer
          key={i}
          className="h-3"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}

/**
 * Shimmer Avatar
 */
export function ShimmerAvatar({ size = 40 }: { size?: number }) {
  return <Shimmer className="rounded-full" width={size} height={size} />;
}

/**
 * AI Processing Indicator
 */
interface AIProcessingProps {
  message?: string;
  className?: string;
}

export function AIProcessing({ message = 'AI is analyzing...', className }: AIProcessingProps) {
  return (
    <div className={cn('flex items-center gap-3 p-4 rounded-lg bg-muted/50', className)}>
      <div className="relative">
        <motion.div
          className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
        <ShimmerText lines={1} className="mt-1" />
      </div>
    </div>
  );
}
