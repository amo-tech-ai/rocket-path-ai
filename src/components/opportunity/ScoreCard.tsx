interface ScoreCardProps {
  label: string;
  score: number;
  description?: string;
}

function getScoreColor(score: number): string {
  if (score >= 70) return '#22c55e'; // green
  if (score >= 50) return '#f59e0b'; // amber
  if (score >= 30) return '#f97316'; // orange
  return '#ef4444'; // red
}

export function ScoreCard({ label, score, description }: ScoreCardProps) {
  const color = getScoreColor(score);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center p-4 rounded-xl bg-card border">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-muted/20"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold" style={{ color }}>{score}</span>
        </div>
      </div>
      <p className="text-sm font-medium mt-2 text-center">{label}</p>
      {description && (
        <p className="text-xs text-muted-foreground text-center mt-0.5">{description}</p>
      )}
    </div>
  );
}
