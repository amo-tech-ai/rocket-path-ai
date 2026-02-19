import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface CompletenessScoreProps {
  percentage: number;
  missingFields: string[];
  size?: number;
}

export function CompletenessScore({ percentage, missingFields, size = 120 }: CompletenessScoreProps) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  const getColor = () => {
    if (percentage >= 80) return { stroke: 'text-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-500' };
    if (percentage >= 50) return { stroke: 'text-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-500' };
    return { stroke: 'text-destructive', bg: 'bg-destructive/10', text: 'text-destructive' };
  };

  const colors = getColor();

  return (
    <div className="space-y-4">
      {/* Circular progress */}
      <div className="flex justify-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg className="-rotate-90" width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className={colors.stroke}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${colors.text}`}>{percentage}%</span>
            <span className="text-[10px] text-muted-foreground">complete</span>
          </div>
        </div>
      </div>

      {/* Missing fields */}
      {missingFields.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Missing fields:</p>
          {missingFields.map((field) => (
            <div key={field} className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="w-3 h-3 text-amber-500 flex-shrink-0" />
              <span>{field}</span>
            </div>
          ))}
        </div>
      )}

      {percentage === 100 && (
        <div className="flex items-center gap-2 text-xs text-emerald-500">
          <CheckCircle2 className="w-4 h-4" />
          <span className="font-medium">Profile complete!</span>
        </div>
      )}
    </div>
  );
}
