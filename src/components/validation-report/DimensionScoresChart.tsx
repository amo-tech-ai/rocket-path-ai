/**
 * 7-Dimension Scores Chart
 * Premium consulting-grade analysis breakdown
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DimensionScore } from '@/types/validation-report';

interface DimensionScoresChartProps {
  scores: DimensionScore[];
  className?: string;
}

export default function DimensionScoresChart({ scores, className }: DimensionScoresChartProps) {
  // Sort by score for visual hierarchy
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);
  
  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn("bg-card border border-border rounded-2xl overflow-hidden", className)}
    >
      {/* Header */}
      <header className="px-8 py-6 border-b border-border">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Dimension Analysis
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          7-factor validation scoring
        </p>
      </header>
      
      {/* Scores list */}
      <div className="p-8">
        <div className="space-y-5">
          {sortedScores.map((dim, index) => (
            <DimensionRow 
              key={dim.name} 
              dimension={dim} 
              delay={0.1 * index}
            />
          ))}
        </div>
      </div>
    </motion.article>
  );
}

interface DimensionRowProps {
  dimension: DimensionScore;
  delay: number;
}

function DimensionRow({ dimension, delay }: DimensionRowProps) {
  const { name, score, weight } = dimension;
  
  const getScoreColor = (s: number) => {
    if (s >= 75) return 'text-primary';
    if (s >= 50) return 'text-amber-600';
    return 'text-destructive';
  };
  
  const getBarColor = (s: number) => {
    if (s >= 75) return 'bg-primary';
    if (s >= 50) return 'bg-amber-500';
    return 'bg-destructive';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">{name}</span>
          <span className="text-xs text-muted-foreground">({weight}% weight)</span>
        </div>
        <span className={cn("text-sm font-semibold tabular-nums", getScoreColor(score))}>
          {score}
        </span>
      </div>
      
      <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ delay: delay + 0.2, duration: 0.6, ease: 'easeOut' }}
          className={cn("absolute inset-y-0 left-0 rounded-full", getBarColor(score))}
        />
      </div>
    </motion.div>
  );
}
