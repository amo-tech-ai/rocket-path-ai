/**
 * Animated Progress Bar with live updates
 */

import { motion, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ANIMATION_DURATIONS } from '@/hooks/realtime/animations';

interface AnimatedProgressProps {
  value: number;
  maxValue?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  barClassName?: string;
}

const sizeConfig = {
  sm: { height: 'h-1', fontSize: 'text-xs' },
  md: { height: 'h-2', fontSize: 'text-sm' },
  lg: { height: 'h-3', fontSize: 'text-base' },
};

export function AnimatedProgress({
  value,
  maxValue = 100,
  label,
  showPercentage = true,
  size = 'md',
  className,
  barClassName,
}: AnimatedProgressProps) {
  const config = sizeConfig[size];
  const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);

  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration: ANIMATION_DURATIONS.progressFill * 1000,
  });

  const width = useTransform(springValue, v => `${v}%`);
  const [displayValue, setDisplayValue] = useState(0);
  
  useMotionValueEvent(springValue, "change", (v) => {
    setDisplayValue(Math.round(v));
  });

  useEffect(() => {
    springValue.set(percentage);
  }, [percentage, springValue]);

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className={cn('flex justify-between mb-1', config.fontSize)}>
          {label && <span className="text-muted-foreground">{label}</span>}
          {showPercentage && (
            <span className="font-medium">
              {displayValue}%
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-muted rounded-full overflow-hidden', config.height)}>
        <motion.div
          className={cn('h-full bg-primary rounded-full', barClassName)}
          style={{ width }}
        />
      </div>
    </div>
  );
}

/**
 * Slide Progress for deck generation
 */
interface SlideProgressProps {
  currentSlide: number;
  totalSlides: number;
  slideScores?: Map<number, number>;
  className?: string;
}

export function SlideProgress({
  currentSlide,
  totalSlides,
  slideScores,
  className,
}: SlideProgressProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          Generating slide {currentSlide} of {totalSlides}
        </span>
        <span className="font-medium">
          {Math.round((currentSlide / totalSlides) * 100)}%
        </span>
      </div>
      
      <div className="flex gap-1">
        {Array.from({ length: totalSlides }).map((_, index) => {
          const isComplete = index < currentSlide;
          const isCurrent = index === currentSlide;
          const score = slideScores?.get(index);

          return (
            <motion.div
              key={index}
              className={cn(
                'flex-1 h-2 rounded-full transition-colors',
                isComplete ? 'bg-primary' : isCurrent ? 'bg-primary/50' : 'bg-muted'
              )}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isComplete || isCurrent ? 1 : 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              title={score ? `Score: ${score}%` : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
