import { memo } from 'react';
import { cn } from '@/lib/utils';

interface CompetitorMatrixProps {
  competitors: {
    name: string;
    threat: 'high' | 'medium' | 'low';
    description: string;
    position: { x: number; y: number };
  }[];
  yourPosition: { x: number; y: number };
  yourEdge: string;
  axes: { x: string; y: string };
}

const threatBorder = {
  high: 'border-l-4 border-l-destructive',
  medium: 'border-l-4 border-l-warm-foreground',
  low: 'border-l-4 border-l-border',
} as const;

const threatText = {
  high: 'text-destructive',
  medium: 'text-warm-foreground',
  low: 'text-muted-foreground',
} as const;

export const CompetitorMatrix = memo(function CompetitorMatrix({
  competitors,
  yourPosition,
  yourEdge,
  axes,
}: CompetitorMatrixProps) {
  return (
    <div>
      {/* 2x2 positioning map */}
      <div className="relative bg-background rounded-lg p-6 border border-border aspect-square max-w-md mx-auto">
        {/* Crosshair lines */}
        <div className="absolute left-6 right-6 top-1/2 h-px bg-border/60" />
        <div className="absolute top-6 bottom-6 left-1/2 w-px bg-border/60" />

        {/* Axis labels */}
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs uppercase text-muted-foreground tracking-wider">
          {axes.x}
        </span>
        <span className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 origin-center text-xs uppercase text-muted-foreground tracking-wider whitespace-nowrap">
          {axes.y}
        </span>

        {/* Competitor dots */}
        {competitors.map((c) => (
          <div
            key={c.name}
            className="absolute"
            style={{
              left: `calc(${6 + (c.position.x / 100) * 88}% )`,
              bottom: `calc(${6 + (c.position.y / 100) * 88}% )`,
            }}
          >
            <div className="w-3 h-3 rounded-full bg-muted-foreground -translate-x-1/2 translate-y-1/2" />
            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap">
              {c.name}
            </span>
          </div>
        ))}

        {/* Your dot */}
        <div
          className="absolute"
          style={{
            left: `calc(${6 + (yourPosition.x / 100) * 88}% )`,
            bottom: `calc(${6 + (yourPosition.y / 100) * 88}% )`,
          }}
        >
          <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-primary/10 -translate-x-1/2 translate-y-1/2" />
          <span className="absolute top-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-primary whitespace-nowrap">
            You
          </span>
        </div>
      </div>

      {/* Competitor cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {competitors.map((c) => (
          <div
            key={c.name}
            className={cn(
              'bg-card rounded-xl border border-border p-4',
              threatBorder[c.threat],
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-foreground">{c.name}</p>
              <span className={cn('text-xs uppercase font-medium', threatText[c.threat])}>
                {c.threat}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
          </div>
        ))}
      </div>

      {/* Your Edge callout */}
      <div className="bg-sage-light/50 border-l-4 border-l-primary rounded-lg p-4 mt-6">
        <span className="text-xs font-medium tracking-wider uppercase text-primary">
          Your edge
        </span>
        <p className="text-sm font-medium text-foreground mt-1">{yourEdge}</p>
      </div>
    </div>
  );
});
