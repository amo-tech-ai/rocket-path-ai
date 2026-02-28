/**
 * BCG-style Score Trend Lines — shows validation score progression over time.
 * Per BCG doc: "Investors care about trajectory, not snapshot."
 *
 * Rule: Only render with 2+ data points. "Two points is not a trend" but
 * it shows direction. Gate full trend visual at 3+ points.
 */
import { memo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

interface ScorePoint {
  date: string;
  score: number;
  label?: string;
}

interface ScoreTrendLinesProps {
  /** Historical score data points — newest last */
  history: ScorePoint[];
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export const ScoreTrendLines = memo(function ScoreTrendLines({
  history,
}: ScoreTrendLinesProps) {
  // Gate: need at least 2 data points
  if (history.length < 2) return null;

  const data = history.map((pt) => ({
    ...pt,
    dateLabel: formatDate(pt.date),
  }));

  const first = data[0].score;
  const last = data[data.length - 1].score;
  const delta = last - first;
  const isPositive = delta > 0;

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Score Trajectory
        </h3>
        <span
          className={`text-xs font-medium ${
            isPositive
              ? 'text-emerald-600 dark:text-emerald-400'
              : delta < 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-muted-foreground'
          }`}
        >
          {isPositive ? '+' : ''}{delta} pts
        </span>
      </div>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="dateLabel"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              width={35}
            />
            <ReferenceLine
              y={75}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="4 4"
              strokeOpacity={0.5}
              label={{
                value: 'GO',
                position: 'right',
                fontSize: 10,
                fill: 'hsl(var(--muted-foreground))',
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '13px',
              }}
              formatter={(value: number) => [`${value}/100`, 'Score']}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              dot={{
                fill: 'hsl(var(--primary))',
                strokeWidth: 2,
                r: 4,
                stroke: 'hsl(var(--card))',
              }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
