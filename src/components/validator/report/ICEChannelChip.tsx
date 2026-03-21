/**
 * ICEChannelChip — Growth channel recommendations ranked by ICE score.
 * Renders a sorted grid of channel pills with Impact/Confidence/Ease breakdown.
 *
 * Data source: Composer Group D produces growth_channels in report details.
 * If no data, renders nothing (graceful degradation).
 */
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ICEChannel {
  channel: string;
  impact: number;      // 1-10
  confidence: number;  // 1-10
  ease: number;        // 1-10
  time_to_result?: string;  // e.g. "2-4 weeks"
  prerequisites?: string;   // e.g. "requires content library"
}

interface ICEChannelChipProps {
  channels?: ICEChannel[];
  className?: string;
}

function iceComposite(c: ICEChannel): number {
  return Math.round(((c.impact + c.confidence + c.ease) / 3) * 10) / 10;
}

function scoreColor(score: number): string {
  if (score >= 7) return 'bg-emerald-50 border-emerald-200 text-emerald-800';
  if (score >= 4) return 'bg-amber-50 border-amber-200 text-amber-800';
  return 'bg-red-50 border-red-200 text-red-800';
}

function scoreBadgeColor(score: number): string {
  if (score >= 7) return 'bg-emerald-100 text-emerald-700';
  if (score >= 4) return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
}

export function ICEChannelChip({ channels, className }: ICEChannelChipProps) {
  if (!channels?.length) return null;

  const sorted = [...channels].sort((a, b) => iceComposite(b) - iceComposite(a));

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="h-4 w-4 text-sage" />
        <h4 className="text-sm font-semibold text-foreground">Recommended Growth Channels</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {sorted.map((ch, i) => {
          const composite = iceComposite(ch);
          return (
            <div
              key={i}
              className={cn(
                'group relative rounded-lg border px-3 py-2 transition-all hover:-translate-y-0.5 hover:shadow-sm',
                scoreColor(composite)
              )}
            >
              {/* Channel name + composite score */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{ch.channel}</span>
                <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', scoreBadgeColor(composite))}>
                  {composite}
                </span>
              </div>

              {/* ICE breakdown */}
              <div className="flex gap-3 mt-1 text-[10px] opacity-70">
                <span>I:{ch.impact}</span>
                <span>C:{ch.confidence}</span>
                <span>E:{ch.ease}</span>
              </div>

              {/* Time to result (if present) */}
              {ch.time_to_result && (
                <div className="text-[10px] mt-0.5 opacity-60">{ch.time_to_result}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
