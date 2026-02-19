/**
 * Animated Score Gauge Component
 * Uses framer-motion for smooth score transitions
 */

import { motion, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { getScoreColor, ANIMATION_DURATIONS } from '@/hooks/realtime/animations';

interface AnimatedScoreGaugeProps {
  value: number;
  maxValue?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const sizeConfig = {
  sm: { width: 60, stroke: 4, fontSize: 'text-sm' },
  md: { width: 100, stroke: 6, fontSize: 'text-lg' },
  lg: { width: 140, stroke: 8, fontSize: 'text-2xl' },
};

export function AnimatedScoreGauge({
  value,
  maxValue = 100,
  size = 'md',
  showLabel = true,
  label,
  className,
}: AnimatedScoreGaugeProps) {
  const config = sizeConfig[size];
  const radius = (config.width - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const normalizedValue = Math.min(Math.max(value, 0), maxValue);
  const percentage = (normalizedValue / maxValue) * 100;
  
  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 30,
    duration: ANIMATION_DURATIONS.scoreAnimate * 1000,
  });
  
  const strokeDashoffset = useTransform(
    springValue,
    [0, 100],
    [circumference, 0]
  );

  const [displayNum, setDisplayNum] = useState(0);
  
  useMotionValueEvent(springValue, "change", (v) => {
    setDisplayNum(Math.round(v));
  });

  useEffect(() => {
    springValue.set(percentage);
  }, [percentage, springValue]);

  const color = getScoreColor(percentage);

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={config.width}
        height={config.width}
        viewBox={`0 0 ${config.width} ${config.width}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={config.stroke}
        />
        
        {/* Animated progress circle */}
        <motion.circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
        />
      </svg>
      
      {/* Center value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-bold', config.fontSize)}>
          {displayNum}
        </span>
        {showLabel && label && (
          <span className="text-xs text-muted-foreground">{label}</span>
        )}
      </div>
    </div>
  );
}
