/**
 * Realtime Status Badge
 *
 * Small colored dot showing WebSocket connection health:
 * - Green: connected (< 2s latency)
 * - Yellow: degraded (> 2s latency)
 * - Red: disconnected
 *
 * Hover tooltip shows latency in ms.
 */

import { useRealtimeHealth, type RealtimeHealthStatus } from '@/hooks/realtime/useRealtimeHealth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const statusColors: Record<RealtimeHealthStatus, string> = {
  connected: 'bg-green-500',
  degraded: 'bg-yellow-500',
  disconnected: 'bg-red-500',
};

const statusLabels: Record<RealtimeHealthStatus, string> = {
  connected: 'Realtime connected',
  degraded: 'Realtime degraded',
  disconnected: 'Realtime disconnected',
};

export function RealtimeStatusBadge() {
  const { status, latencyMs } = useRealtimeHealth();

  const label = latencyMs != null
    ? `${statusLabels[status]} (${latencyMs}ms)`
    : statusLabels[status];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              'inline-block h-2 w-2 rounded-full shrink-0',
              statusColors[status],
            )}
            aria-label={label}
          />
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
