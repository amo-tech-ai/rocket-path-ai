import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SIGNAL_LABELS } from './constants';

interface SignalsPanelProps {
  signals: string[];
}

export function SignalsPanel({ signals }: SignalsPanelProps) {
  if (signals.length === 0) return null;

  return (
    <div className="pt-4 border-t">
      <p className="text-xs font-medium text-muted-foreground mb-2">SIGNALS DETECTED</p>
      <div className="flex flex-wrap gap-2">
        {signals.map((signal) => {
          const info = SIGNAL_LABELS[signal] || { label: signal, color: 'bg-muted text-muted-foreground' };
          return (
            <Badge key={signal} className={cn('text-xs', info.color)}>
              {info.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}

export default SignalsPanel;
