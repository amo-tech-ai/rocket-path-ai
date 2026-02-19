/**
 * Factors Breakdown Card
 * Premium consulting-grade factor analysis
 */

import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
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
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn("bg-card border border-border rounded-2xl overflow-hidden", className)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* Market Factors */}
        <section className="p-8">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
            Market Factors
          </h3>
          
          <div className="space-y-4">
            {marketFactors.map((factor, index) => (
              <FactorRow key={factor.name} factor={factor} delay={0.1 * index} />
            ))}
          </div>
        </section>
        
        {/* Execution Factors */}
        <section className="p-8">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
            Execution Factors
          </h3>
          
          <div className="space-y-4">
            {executionFactors.map((factor, index) => (
              <FactorRow key={factor.name} factor={factor} delay={0.1 * index} />
            ))}
          </div>
        </section>
      </div>
    </motion.article>
  );
}

interface FactorRowProps {
  factor: MarketFactor | ExecutionFactor;
  delay: number;
}

function FactorRow({ factor, delay }: FactorRowProps) {
  const { name, score, description, status } = factor;
  
  const statusConfig = {
    strong: {
      icon: CheckCircle2,
      textClass: 'text-primary',
    },
    moderate: {
      icon: AlertCircle,
      textClass: 'text-amber-600',
    },
    weak: {
      icon: XCircle,
      textClass: 'text-destructive',
    },
  };
  
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="flex items-start gap-3 py-3 border-b border-border last:border-0"
    >
      <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", config.textClass)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-sm font-medium text-foreground">{name}</span>
          <span className={cn("text-sm font-semibold tabular-nums", config.textClass)}>
            {score}/10
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
