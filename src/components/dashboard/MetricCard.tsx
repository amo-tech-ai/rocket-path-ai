import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
  index?: number;
}

export function MetricCard({ 
  label, 
  value, 
  change, 
  trend = 'neutral',
  icon: Icon,
  index = 0 
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-premium p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        {change && (
          <span className={cn(
            "text-xs font-medium",
            trend === 'up' && "text-sage",
            trend === 'down' && "text-destructive",
            trend === 'neutral' && "text-muted-foreground"
          )}>
            {change}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon className="w-5 h-5 text-muted-foreground" />
        )}
        <span className="text-2xl font-semibold">{value}</span>
      </div>
    </motion.div>
  );
}
