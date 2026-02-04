/**
 * Factors Breakdown Card
 * Market and Execution factors with status indicators
 */

import { motion } from 'framer-motion';
import { BarChart3, Cog, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MarketFactor, ExecutionFactor } from '@/types/validation-report';

interface FactorsBreakdownCardProps {
  marketFactors: MarketFactor[];
  executionFactors: ExecutionFactor[];
  className?: string;
}

export default function FactorsBreakdownCard({
  marketFactors,
  executionFactors,
  className,
}: FactorsBreakdownCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("card-premium p-6 md:p-8", className)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Market Factors */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-display text-lg font-semibold text-foreground">
              Market Factors
            </h3>
          </div>
          
          <div className="space-y-3">
            {marketFactors.map((factor, index) => (
              <FactorRow key={factor.name} factor={factor} delay={0.1 * index} />
            ))}
          </div>
        </div>
        
        {/* Execution Factors */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Cog className="w-5 h-5 text-primary" />
            <h3 className="font-display text-lg font-semibold text-foreground">
              Execution Factors
            </h3>
          </div>
          
          <div className="space-y-3">
            {executionFactors.map((factor, index) => (
              <FactorRow key={factor.name} factor={factor} delay={0.1 * index} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface FactorRowProps {
  factor: MarketFactor | ExecutionFactor;
  delay: number;
}

function FactorRow({ factor, delay }: FactorRowProps) {
  const { name, score, description, status } = factor;
  
  const StatusIcon = status === 'strong' 
    ? CheckCircle2 
    : status === 'moderate' 
      ? AlertCircle 
      : XCircle;
  
  const statusConfig = {
    strong: {
      icon: CheckCircle2,
      bgClass: 'bg-sage-light',
      textClass: 'text-sage-foreground',
      borderClass: 'border-sage/30',
    },
    moderate: {
      icon: AlertCircle,
      bgClass: 'bg-warm',
      textClass: 'text-warm-foreground',
      borderClass: 'border-warm-foreground/30',
    },
    weak: {
      icon: XCircle,
      bgClass: 'bg-destructive/10',
      textClass: 'text-destructive',
      borderClass: 'border-destructive/30',
    },
  };
  
  const config = statusConfig[status];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={cn(
        "flex items-start gap-3 p-3 rounded-xl border",
        config.bgClass,
        config.borderClass
      )}
    >
      <StatusIcon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", config.textClass)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-foreground text-sm truncate">{name}</span>
          <span className={cn("text-sm font-semibold", config.textClass)}>
            {score}/10
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
