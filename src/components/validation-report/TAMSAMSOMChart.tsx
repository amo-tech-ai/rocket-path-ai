/**
 * TAM/SAM/SOM Visualization
 * Premium consulting-grade market sizing cards
 */

import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MarketSizing, formatMarketSize } from '@/types/validation-report';

interface TAMSAMSOMChartProps {
  data: MarketSizing;
  className?: string;
}

export default function TAMSAMSOMChart({ data, className }: TAMSAMSOMChartProps) {
  const { tam, sam, som, methodology, growthRate } = data;

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn("bg-card border border-border rounded-2xl overflow-hidden", className)}
    >
      {/* Header */}
      <header className="px-8 py-6 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Market Sizing
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Total addressable market analysis
          </p>
        </div>
        {growthRate && (
          <div className="text-right">
            <span className="text-2xl font-display font-semibold text-foreground">
              {growthRate}%
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">CAGR</p>
          </div>
        )}
      </header>
      
      {/* Three equal cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
        <MarketCard
          label="TAM"
          sublabel="Total Addressable Market"
          value={tam}
          delay={0.1}
        />
        <MarketCard
          label="SAM"
          sublabel="Serviceable Addressable Market"
          value={sam}
          delay={0.2}
        />
        <MarketCard
          label="SOM"
          sublabel="Serviceable Obtainable Market"
          value={som}
          delay={0.3}
          highlight
        />
      </div>
      
      {/* Methodology footer */}
      {methodology && (
        <footer className="px-8 py-5 border-t border-border bg-muted/20">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Methodology: </span>
              {methodology}
            </p>
          </div>
        </footer>
      )}
    </motion.article>
  );
}

interface MarketCardProps {
  label: string;
  sublabel: string;
  value: number;
  delay: number;
  highlight?: boolean;
}

function MarketCard({ label, sublabel, value, delay, highlight }: MarketCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className={cn(
        "px-8 py-8 text-center",
        highlight && "bg-primary/5"
      )}
    >
      <div className={cn(
        "inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-semibold mb-4",
        highlight 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted text-muted-foreground"
      )}>
        {label}
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2 }}
        className={cn(
          "font-display text-3xl md:text-4xl font-semibold tracking-tight mb-2",
          highlight ? "text-primary" : "text-foreground"
        )}
      >
        {formatMarketSize(value)}
      </motion.p>
      
      <p className="text-xs text-muted-foreground">
        {sublabel}
      </p>
    </motion.div>
  );
}
