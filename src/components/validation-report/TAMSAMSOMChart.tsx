/**
 * TAM/SAM/SOM Visualization
 * Concentric circles with premium styling
 */

import { motion } from 'framer-motion';
import { Target, TrendingUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MarketSizing, formatMarketSize } from '@/types/validation-report';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TAMSAMSOMChartProps {
  data: MarketSizing;
  className?: string;
}

export default function TAMSAMSOMChart({ data, className }: TAMSAMSOMChartProps) {
  const { tam, sam, som, methodology, growthRate } = data;
  
  // Calculate relative sizes (for visual representation)
  const maxRadius = 140;
  const tamRadius = maxRadius;
  const samRadius = Math.max(40, (sam / tam) * maxRadius);
  const somRadius = Math.max(20, (som / tam) * maxRadius);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("card-premium p-6 md:p-8", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-display text-xl font-semibold text-foreground">
            Market Size
          </h3>
        </div>
        {growthRate && (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span className="text-xs font-medium text-emerald-500">
              {growthRate}% CAGR
            </span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Concentric circles visualization */}
        <div className="relative flex-shrink-0">
          <svg 
            width="300" 
            height="300" 
            viewBox="0 0 300 300"
            className="mx-auto"
          >
            {/* TAM - Outer circle */}
            <motion.circle
              cx="150"
              cy="150"
              r={tamRadius}
              fill="hsl(var(--primary) / 0.1)"
              stroke="hsl(var(--primary) / 0.3)"
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            />
            
            {/* SAM - Middle circle */}
            <motion.circle
              cx="150"
              cy="150"
              r={samRadius}
              fill="hsl(var(--primary) / 0.2)"
              stroke="hsl(var(--primary) / 0.5)"
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
            
            {/* SOM - Inner circle */}
            <motion.circle
              cx="150"
              cy="150"
              r={somRadius}
              fill="hsl(var(--primary))"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            />
            
            {/* SOM label */}
            <motion.text
              x="150"
              y="150"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-primary-foreground font-semibold text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              SOM
            </motion.text>
          </svg>
        </div>
        
        {/* Market size breakdown */}
        <div className="flex-1 space-y-4 w-full lg:w-auto">
          {/* TAM */}
          <MarketSizeRow
            label="TAM"
            sublabel="Total Addressable Market"
            value={tam}
            description="Total market demand for a product or service"
            color="primary"
            delay={0.2}
          />
          
          {/* SAM */}
          <MarketSizeRow
            label="SAM"
            sublabel="Serviceable Addressable Market"
            value={sam}
            description="Portion of TAM you can realistically target"
            color="primary"
            delay={0.4}
          />
          
          {/* SOM */}
          <MarketSizeRow
            label="SOM"
            sublabel="Serviceable Obtainable Market"
            value={som}
            description="Market share you can capture in 3-5 years"
            color="primary"
            delay={0.6}
            highlight
          />
        </div>
      </div>
      
      {/* Methodology */}
      {methodology && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 pt-6 border-t border-border"
        >
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Methodology: </span>
              {methodology}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

interface MarketSizeRowProps {
  label: string;
  sublabel: string;
  value: number;
  description: string;
  color: string;
  delay: number;
  highlight?: boolean;
}

function MarketSizeRow({ 
  label, 
  sublabel, 
  value, 
  description, 
  delay,
  highlight 
}: MarketSizeRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={cn(
        "flex items-center justify-between p-4 rounded-xl border",
        highlight 
          ? "bg-primary/5 border-primary/30" 
          : "bg-muted/30 border-border"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm",
          highlight 
            ? "bg-primary text-primary-foreground" 
            : "bg-primary/10 text-primary"
        )}>
          {label}
        </div>
        <div>
          <p className="font-medium text-foreground text-sm">{sublabel}</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs text-muted-foreground cursor-help truncate max-w-[200px]">
                  {description}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <span className={cn(
        "font-display text-xl md:text-2xl font-bold",
        highlight ? "text-primary" : "text-foreground"
      )}>
        {formatMarketSize(value)}
      </span>
    </motion.div>
  );
}
