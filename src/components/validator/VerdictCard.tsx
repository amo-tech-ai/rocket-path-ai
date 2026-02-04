/**
 * Verdict Card
 * Main score display with highlight animation for Coach sync
 */

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCoachSync } from '@/contexts/CoachSyncContext';
import { Sparkles } from 'lucide-react';

interface VerdictCardProps {
  score: number;
  verdict: string;
  description?: string;
  className?: string;
}

const scoreVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};

export default memo(function VerdictCard({ 
  score, 
  verdict, 
  description,
  className 
}: VerdictCardProps) {
  const { highlightedElement, explainElement } = useCoachSync();
  const isHighlighted = highlightedElement?.type === 'verdict';
  
  const getScoreGradient = (s: number) => {
    if (s >= 80) return 'from-emerald-500 to-emerald-400';
    if (s >= 60) return 'from-amber-500 to-amber-400';
    return 'from-rose-500 to-rose-400';
  };
  
  const handleClick = () => {
    explainElement('verdict', 'overall');
  };
  
  return (
    <motion.button
      onClick={handleClick}
      className={cn(
        "card-premium p-6 w-full text-left cursor-pointer transition-all",
        isHighlighted && "ring-2 ring-primary shadow-lg",
        className
      )}
      animate={isHighlighted ? {
        scale: 1.02,
        boxShadow: '0 0 30px hsl(var(--primary) / 0.3)',
      } : {
        scale: 1,
        boxShadow: 'none',
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Score Circle */}
        <div className="relative flex-shrink-0">
          <svg className="w-32 h-32 -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              className="text-muted"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              stroke={`url(#verdictGradient-${score})`}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: 2 * Math.PI * 56, strokeDashoffset: 2 * Math.PI * 56 }}
              animate={{ 
                strokeDasharray: 2 * Math.PI * 56,
                strokeDashoffset: 2 * Math.PI * 56 * (1 - score / 100),
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id={`verdictGradient-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className={cn("stop-color-primary", getScoreGradient(score).split(' ')[0].replace('from-', 'text-'))} stopColor={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#f43f5e'} />
                <stop offset="100%" className={cn("stop-color-primary", getScoreGradient(score).split(' ')[1].replace('to-', 'text-'))} stopColor={score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#fb7185'} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span 
                key={score}
                variants={scoreVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-3xl font-bold text-foreground"
              >
                {score}
              </motion.span>
            </AnimatePresence>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
        </div>
        
        {/* Verdict Text */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Verdict</h2>
          </div>
          <p className={cn(
            "text-lg font-medium",
            score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-rose-500"
          )}>
            {verdict}
          </p>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        
        {/* Highlight Indicator */}
        {isHighlighted && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary"
          />
        )}
      </div>
    </motion.button>
  );
});
