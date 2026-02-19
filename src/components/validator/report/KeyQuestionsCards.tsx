import { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface Question {
  question: string;
  severity: 'fatal' | 'important' | 'minor';
  why: string;
  howToTest: string;
}

interface KeyQuestionsCardsProps {
  questions: Question[];
}

const cardStyle = {
  fatal: 'border-l-4 border-l-destructive bg-destructive/5',
  important: 'border-l-4 border-l-warm-foreground bg-warm',
  minor: 'border-l-4 border-l-muted-foreground bg-background',
} as const;

const labelStyle = {
  fatal: 'text-destructive',
  important: 'text-warm-foreground',
  minor: 'text-muted-foreground',
} as const;

const labelText = {
  fatal: "FATAL \u00B7 ANSWER THIS OR DON'T BUILD",
  important: 'IMPORTANT \u00B7 VALIDATE EARLY',
  minor: 'NICE TO KNOW',
} as const;

const severityOrder = { fatal: 0, important: 1, minor: 2 } as const;

export const KeyQuestionsCards = memo(function KeyQuestionsCards({ questions }: KeyQuestionsCardsProps) {
  const sorted = useMemo(
    () => [...questions].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]),
    [questions],
  );

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((q, i) => (
        <div key={i} className={cn('rounded-lg p-4', cardStyle[q.severity])}>
          <span className={cn('text-xs uppercase tracking-wider font-medium', labelStyle[q.severity])}>
            {labelText[q.severity]}
          </span>
          <p className="text-base font-medium text-foreground mt-2">{q.question}</p>
          <p className="text-sm text-muted-foreground mt-1.5">
            <span className="font-medium">WHY:</span> {q.why}
          </p>
          <p className="text-xs text-muted-foreground italic mt-1.5">
            <span className="font-medium not-italic">TEST:</span> {q.howToTest}
          </p>
        </div>
      ))}
    </div>
  );
});
