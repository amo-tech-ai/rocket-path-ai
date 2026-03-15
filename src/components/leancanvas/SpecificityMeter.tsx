import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type SpecificityLevel = 'vague' | 'specific' | 'quantified';

interface SpecificityMeterProps {
  level?: SpecificityLevel;
  gaps?: string[];
}

const LEVEL_CONFIG: Record<SpecificityLevel, { label: string; color: string; width: string }> = {
  vague: { label: 'Vague', color: 'bg-red-400', width: 'w-1/3' },
  specific: { label: 'Specific', color: 'bg-amber-400', width: 'w-2/3' },
  quantified: { label: 'Quantified', color: 'bg-emerald-400', width: 'w-full' },
};

export function SpecificityMeter({ level, gaps }: SpecificityMeterProps) {
  if (!level) return null;

  const config = LEVEL_CONFIG[level];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
            <div className={cn('h-full rounded-full transition-all', config.color, config.width)} />
          </div>
          <span className="text-[9px] font-medium text-muted-foreground">{config.label}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs">
        <p className="text-xs font-medium mb-1">Specificity: {config.label}</p>
        {gaps && gaps.length > 0 && (
          <ul className="text-xs text-muted-foreground space-y-0.5">
            {gaps.map((gap, i) => (
              <li key={i}>- {gap}</li>
            ))}
          </ul>
        )}
        {(!gaps || gaps.length === 0) && level === 'quantified' && (
          <p className="text-xs text-emerald-600">No gaps found</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
