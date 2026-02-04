/**
 * 7-Dimension Scores Chart
 * Radar chart with factor breakdown
 */

import { motion } from 'framer-motion';
import { Radar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DimensionScore } from '@/types/validation-report';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DimensionScoresChartProps {
  scores: DimensionScore[];
  className?: string;
}

export default function DimensionScoresChart({ scores, className }: DimensionScoresChartProps) {
  // Sort by score for visual hierarchy
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("card-premium p-6 md:p-8", className)}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Radar className="w-5 h-5 text-primary" />
        <h3 className="font-display text-xl font-semibold text-foreground">
          7-Dimension Analysis
        </h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar-like visualization (simplified as a gauge grid) */}
        <div className="aspect-square max-w-sm mx-auto">
          <RadarVisualization scores={scores} />
        </div>
        
        {/* Score breakdown */}
        <div className="space-y-4">
          {sortedScores.map((dim, index) => (
            <DimensionRow 
              key={dim.name} 
              dimension={dim} 
              delay={0.1 * index}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

interface DimensionRowProps {
  dimension: DimensionScore;
  delay: number;
}

function DimensionRow({ dimension, delay }: DimensionRowProps) {
  const { name, score, weight, factors } = dimension;
  
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-500';
    if (s >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };
  
  const getProgressColor = (s: number) => {
    if (s >= 80) return 'bg-emerald-500';
    if (s >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help">
                <span className="font-medium text-foreground text-sm">{name}</span>
                <span className="text-xs text-muted-foreground">({weight}%)</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-xs font-medium mb-1">Key factors:</p>
              <ul className="text-xs text-muted-foreground">
                {factors.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className={cn("font-semibold text-sm", getScoreColor(score))}>
          {score}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
          className={cn("absolute inset-y-0 left-0 rounded-full", getProgressColor(score))}
        />
      </div>
    </motion.div>
  );
}

interface RadarVisualizationProps {
  scores: DimensionScore[];
}

function RadarVisualization({ scores }: RadarVisualizationProps) {
  const center = 150;
  const maxRadius = 120;
  const angleStep = (2 * Math.PI) / scores.length;
  
  // Generate points for the radar shape
  const points = scores.map((dim, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const radius = (dim.score / 100) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
      labelX: center + (maxRadius + 25) * Math.cos(angle),
      labelY: center + (maxRadius + 25) * Math.sin(angle),
      name: dim.name,
      score: dim.score,
    };
  });
  
  // Create polygon path
  const pathD = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ') + ' Z';
  
  return (
    <svg viewBox="0 0 300 300" className="w-full h-full">
      {/* Background circles */}
      {[20, 40, 60, 80, 100].map((pct) => (
        <circle
          key={pct}
          cx={center}
          cy={center}
          r={(pct / 100) * maxRadius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1"
          strokeDasharray={pct === 60 ? "4 2" : "0"}
          opacity={pct === 60 ? 0.8 : 0.4}
        />
      ))}
      
      {/* Axis lines */}
      {scores.map((_, i) => {
        const angle = angleStep * i - Math.PI / 2;
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + maxRadius * Math.cos(angle)}
            y2={center + maxRadius * Math.sin(angle)}
            stroke="hsl(var(--border))"
            strokeWidth="1"
            opacity="0.4"
          />
        );
      })}
      
      {/* Radar area */}
      <motion.path
        d={pathD}
        fill="hsl(var(--primary) / 0.2)"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{ transformOrigin: 'center' }}
      />
      
      {/* Data points */}
      {points.map((point, i) => (
        <motion.circle
          key={i}
          cx={point.x}
          cy={point.y}
          r="5"
          fill="hsl(var(--primary))"
          stroke="hsl(var(--background))"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 + i * 0.1 }}
        />
      ))}
      
      {/* Labels */}
      {points.map((point, i) => (
        <text
          key={i}
          x={point.labelX}
          y={point.labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-muted-foreground text-[10px] font-medium"
        >
          {point.name.split(' ')[0]}
        </text>
      ))}
    </svg>
  );
}
