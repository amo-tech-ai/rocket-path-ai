/**
 * BCG-style Radar/Spider Chart — shows validation profile across all dimensions.
 * Reveals balance vs lopsidedness at a glance. Per BCG doc: "A lopsided radar
 * (strong solution, weak market) tells a clear story."
 *
 * Rule: Only render with 5+ dimensions (below 5 it looks like a triangle).
 */
import { memo } from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface Dimension {
  name: string;
  score: number;
  weight?: number;
}

interface ValidationRadarProps {
  dimensions: Dimension[];
}

/** Truncate long dimension names for axis labels */
function shortLabel(name: string): string {
  if (name.length <= 14) return name;
  return name.slice(0, 12) + '...';
}

export const ValidationRadar = memo(function ValidationRadar({
  dimensions,
}: ValidationRadarProps) {
  // BCG rule: below 5 dimensions, radar looks like a triangle — skip
  if (dimensions.length < 5) return null;

  const data = dimensions.map((d) => ({
    dimension: shortLabel(d.name),
    fullName: d.name,
    score: d.score,
    fullMark: 100,
  }));

  return (
    <div className="w-full">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Validation Profile
      </h3>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
            <PolarGrid
              stroke="hsl(var(--border))"
              strokeDasharray="3 3"
            />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickCount={5}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '13px',
              }}
              formatter={(value: number, _name: string, props: any) => [
                `${value}/100`,
                props.payload?.fullName || 'Score',
              ]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
