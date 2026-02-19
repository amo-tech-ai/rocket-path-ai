import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface InsightCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  stat?: string;
  variant?: 'default' | 'strength' | 'concern' | 'neutral';
}

const variantStyles = {
  default: 'border-border/50',
  strength: 'border-l-4 border-l-primary border-border/50',
  concern: 'border-l-4 border-l-destructive border-border/50',
  neutral: 'border-l-4 border-l-border border-border/50',
} as const;

export const InsightCard = memo(function InsightCard({
  icon: Icon,
  title,
  description,
  stat,
  variant = 'default',
}: InsightCardProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-xl border p-4 shadow-premium-sm transition-all duration-200',
        'hover:border-primary/30 hover:-translate-y-0.5',
        variantStyles[variant],
      )}
    >
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-lg bg-sage-light flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            {stat && (
              <span className="text-sm font-medium text-primary shrink-0">
                {stat}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
});
