/**
 * Executive Summary Card
 * Premium verdict display with animated score gauge
 */

import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Sparkles,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ValidationVerdict, getVerdictConfig } from '@/types/validation-report';

interface ExecutiveSummaryCardProps {
  score: number;
  verdict: ValidationVerdict;
  summary: string;
  highlights: string[];
  redFlags: string[];
  percentile?: number;
  className?: string;
}

export default function ExecutiveSummaryCard({
  score,
  verdict,
  summary,
  highlights,
  redFlags,
  percentile,
  className,
}: ExecutiveSummaryCardProps) {
  const config = getVerdictConfig(verdict);
  
  const VerdictIcon = verdict === 'go' 
    ? CheckCircle2 
    : verdict === 'caution' 
      ? AlertTriangle 
      : XCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "card-premium overflow-hidden",
        className
      )}
    >
      {/* Gradient header */}
      <div className={cn(
        "relative px-6 py-8 md:px-8 md:py-10",
        config.bgClass
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-background/50" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          {/* Score Circle */}
          <div className="relative flex-shrink-0">
            <svg className="w-40 h-40 md:w-48 md:h-48" viewBox="0 0 200 200">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-background/30"
              />
              
              {/* Progress circle */}
              <motion.circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeLinecap="round"
                className={config.textClass}
                style={{
                  transformOrigin: 'center',
                  transform: 'rotate(-90deg)',
                }}
                initial={{ strokeDasharray: '534', strokeDashoffset: '534' }}
                animate={{ 
                  strokeDasharray: '534',
                  strokeDashoffset: 534 - (534 * score / 100)
                }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
              
              {/* Inner glow */}
              <circle
                cx="100"
                cy="100"
                r="70"
                fill="hsl(var(--background))"
                className="drop-shadow-lg"
              />
            </svg>
            
            {/* Score display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="font-display text-5xl md:text-6xl font-bold text-foreground"
              >
                {score}
              </motion.span>
              <span className="text-sm text-muted-foreground font-medium">/100</span>
            </div>
          </div>
          
          {/* Verdict info */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <VerdictIcon className={cn("w-8 h-8", config.textClass)} />
              <span className={cn(
                "font-display text-3xl md:text-4xl font-semibold tracking-tight",
                config.textClass
              )}>
                {config.label}
              </span>
            </div>
            
            <p className="text-lg text-muted-foreground max-w-md">
              {config.message}
            </p>
            
            {percentile && (
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">
                  Top <span className="font-semibold">{100 - percentile}%</span> of startups in your industry
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Summary section */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Executive summary text */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Executive Summary
            </h3>
          </div>
          <p className="text-foreground leading-relaxed">
            {summary}
          </p>
        </div>
        
        {/* Highlights & Red Flags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Highlights */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <h4 className="text-sm font-semibold text-foreground">Highlights</h4>
            </div>
            <ul className="space-y-2">
              {highlights.slice(0, 4).map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          
          {/* Red Flags */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-500" />
              <h4 className="text-sm font-semibold text-foreground">Red Flags</h4>
            </div>
            <ul className="space-y-2">
              {redFlags.slice(0, 4).map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-start gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </motion.li>
              ))}
              {redFlags.length === 0 && (
                <li className="text-sm text-muted-foreground italic">
                  No major red flags identified
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
