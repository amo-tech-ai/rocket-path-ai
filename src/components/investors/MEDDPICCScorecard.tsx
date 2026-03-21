/**
 * MEDDPICCScorecard — 8-element MEDDPICC qualification scorecard
 *
 * Each element scored 1-5. Total /40.
 * Color: 1-2 red, 3 amber, 4-5 green.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MEDDPICCElement {
  score: number;
  evidence: string;
}

export interface MEDDPICCElements {
  metrics: MEDDPICCElement;
  economic_buyer: MEDDPICCElement;
  decision_criteria: MEDDPICCElement;
  decision_process: MEDDPICCElement;
  paper_process: MEDDPICCElement;
  identify_pain: MEDDPICCElement;
  champion: MEDDPICCElement;
  competition: MEDDPICCElement;
}

const ELEMENT_LABELS: Record<keyof MEDDPICCElements, string> = {
  metrics: 'Metrics',
  economic_buyer: 'Economic Buyer',
  decision_criteria: 'Decision Criteria',
  decision_process: 'Decision Process',
  paper_process: 'Paper Process',
  identify_pain: 'Identify Pain',
  champion: 'Champion',
  competition: 'Competition',
};

function scoreColor(score: number): string {
  if (score >= 4) return 'bg-emerald-500';
  if (score === 3) return 'bg-amber-500';
  return 'bg-red-500';
}

function scoreBadgeVariant(score: number): string {
  if (score >= 4) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (score === 3) return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-red-700 bg-red-50 border-red-200';
}

function verdictLabel(total: number): { text: string; color: string } {
  if (total >= 28) return { text: 'Pursue', color: 'text-emerald-700 bg-emerald-50' };
  if (total >= 20) return { text: 'Consider', color: 'text-amber-700 bg-amber-50' };
  return { text: 'Deprioritize', color: 'text-red-700 bg-red-50' };
}

interface MEDDPICCScorecardProps {
  elements: MEDDPICCElements;
}

export function MEDDPICCScorecard({ elements }: MEDDPICCScorecardProps) {
  const entries = Object.entries(elements) as [keyof MEDDPICCElements, MEDDPICCElement][];
  const total = entries.reduce((sum, [, el]) => sum + (el.score || 0), 0);
  const verdict = verdictLabel(total);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Target className="w-4 h-4 text-primary" />
            MEDDPICC Qualification
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{total}</span>
            <span className="text-xs text-muted-foreground">/40</span>
            <Badge variant="outline" className={cn('text-xs', verdict.color)}>
              {verdict.text}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {entries.map(([key, el]) => (
          <div key={key} className="group">
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-28 flex-shrink-0 truncate">
                {ELEMENT_LABELS[key]}
              </span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', scoreColor(el.score))}
                  style={{ width: `${(el.score / 5) * 100}%` }}
                />
              </div>
              <Badge
                variant="outline"
                className={cn('text-[10px] w-6 h-5 flex items-center justify-center p-0 border', scoreBadgeVariant(el.score))}
              >
                {el.score}
              </Badge>
            </div>
            {el.evidence && (
              <p className="text-[10px] text-muted-foreground pl-[7.75rem] mt-0.5 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {el.evidence}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
