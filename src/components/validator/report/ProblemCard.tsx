import { memo } from 'react';
import { User, Flame, Wrench } from 'lucide-react';

interface ProblemCardProps {
  who: string;
  pain: string;
  currentFix: string;
  severity: 'high' | 'medium' | 'low';
}

const severityColor = {
  high: 'bg-destructive',
  medium: 'bg-warm-foreground',
  low: 'bg-sage',
} as const;

const rows = [
  { key: 'who', label: 'WHO', Icon: User },
  { key: 'pain', label: 'PAIN', Icon: Flame },
  { key: 'currentFix', label: "TODAY'S FIX", Icon: Wrench },
] as const;

export const ProblemCard = memo(function ProblemCard({
  who,
  pain,
  currentFix,
  severity,
}: ProblemCardProps) {
  const values = { who, pain, currentFix } as const;

  return (
    <div className="space-y-2">
      {rows.map(({ key, label, Icon }) => (
        <div
          key={key}
          className="flex items-start gap-4 p-4 rounded-lg bg-background"
        >
          <div className="w-10 h-10 rounded-lg bg-sage-light flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                {label}
              </span>
              {key === 'pain' && (
                <span
                  className={`w-2 h-2 rounded-full ${severityColor[severity]}`}
                  aria-label={`${severity} severity`}
                />
              )}
            </div>
            <p className="text-sm text-foreground mt-1">{values[key]}</p>
          </div>
        </div>
      ))}
    </div>
  );
});
