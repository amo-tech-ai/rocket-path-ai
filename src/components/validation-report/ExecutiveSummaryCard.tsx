/**
 * Executive Summary Card
 * Premium consulting-grade verdict display with measured score gauge
 */

import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  BadgeCheck
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
  className,
}: ExecutiveSummaryCardProps) {
  const config = getVerdictConfig(verdict);
  
  const VerdictIcon = verdict === 'go' 
    ? CheckCircle2 
    : verdict === 'caution' 
      ? AlertTriangle 
      : XCircle;

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "bg-card border border-border rounded-2xl overflow-hidden",
        className
      )}
    >
      {/* Executive Header */}
      <header className="px-8 py-10 md:px-12 md:py-12 border-b border-border bg-muted/20">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
          {/* Score Circle - Measured, not celebratory */}
          <div className="relative flex-shrink-0">
            <svg className="w-44 h-44 md:w-52 md:h-52" viewBox="0 0 200 200">
              {/* Background ring */}
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="8"
              />
              
              {/* Progress ring */}
              <motion.circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeLinecap="round"
                style={{
                  transformOrigin: 'center',
                  transform: 'rotate(-90deg)',
                }}
                initial={{ strokeDasharray: '534', strokeDashoffset: '534' }}
                animate={{ 
                  strokeDasharray: '534',
                  strokeDashoffset: 534 - (534 * score / 100)
                }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
              />
              
              {/* Inner background */}
              <circle
                cx="100"
                cy="100"
                r="70"
                fill="hsl(var(--background))"
              />
            </svg>
            
            {/* Score display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="font-display text-5xl md:text-6xl font-semibold text-foreground tracking-tight"
              >
                {score}
              </motion.span>
              <span className="text-sm text-muted-foreground font-medium mt-1">/100</span>
            </div>
          </div>
          
          {/* Verdict info */}
          <div className="flex-1 text-center md:text-left">
            {/* AI Verified badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
              <BadgeCheck className="w-3.5 h-3.5" />
              AI Verified
            </div>
            
            <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
              <VerdictIcon className={cn("w-7 h-7", config.textClass)} />
              <h1 className={cn(
                "font-display text-3xl md:text-4xl font-semibold tracking-tight",
                config.textClass
              )}>
                {config.label}
              </h1>
            </div>
            
            <p className="text-muted-foreground text-base md:text-lg max-w-lg leading-relaxed">
              {config.message}
            </p>
          </div>
        </div>
      </header>
      
      {/* Executive Summary */}
      <section className="px-8 py-8 md:px-12 md:py-10 border-b border-border">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
          Executive Summary
        </h2>
        <p className="text-foreground text-base md:text-lg leading-relaxed max-w-3xl">
          {summary}
        </p>
      </section>
      
      {/* Highlights & Red Flags - Two Column */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Highlights */}
        <section className="px-8 py-8 md:px-12 md:py-10">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">
            Strengths
          </h3>
          <ul className="space-y-3">
            {highlights.slice(0, 4).map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + 0.1 * i }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground leading-relaxed">{item}</span>
              </motion.li>
            ))}
          </ul>
        </section>
        
        {/* Red Flags */}
        <section className="px-8 py-8 md:px-12 md:py-10">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">
            Areas of Concern
          </h3>
          <ul className="space-y-3">
            {redFlags.length > 0 ? (
              redFlags.slice(0, 4).map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + 0.1 * i }}
                  className="flex items-start gap-3"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground leading-relaxed">{item}</span>
                </motion.li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground italic">
                No significant concerns identified
              </li>
            )}
          </ul>
        </section>
      </div>
    </motion.article>
  );
}
