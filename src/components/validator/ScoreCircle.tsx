import { motion } from 'framer-motion';

interface ScoreCircleProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showVerdict?: boolean;
}

export function ScoreCircle({ score, size = 160, strokeWidth = 12, label = '/100', showVerdict = true }: ScoreCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  const getScoreColor = () => {
    if (score >= 75) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-destructive';
  };

  const getGradientColors = () => {
    if (score >= 75) return { start: '#10b981', end: '#34d399' };
    if (score >= 50) return { start: '#f59e0b', end: '#fbbf24' };
    return { start: '#ef4444', end: '#f87171' };
  };

  const getVerdict = () => {
    if (score >= 75) return { label: 'GO', color: 'bg-emerald-500/10 text-emerald-500' };
    if (score >= 50) return { label: 'CAUTION', color: 'bg-amber-500/10 text-amber-500' };
    return { label: 'NO-GO', color: 'bg-destructive/10 text-destructive' };
  };

  const gradientId = `scoreGradient-${size}`;
  const colors = getGradientColors();

  return (
    <div className="relative flex-shrink-0">
      <svg className="-rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`text-4xl font-bold ${getScoreColor()}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {score}
        </motion.span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
