import { Link } from "react-router-dom";
import { DollarSign, ArrowRight, CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface FundraisingReadinessProps {
  score: number;
  isRaising: boolean;
  hasPitchDeck: boolean;
  hasMetrics: boolean;
  hasFinancials: boolean;
}

export function FundraisingReadiness({ score, isRaising, hasPitchDeck, hasMetrics, hasFinancials }: FundraisingReadinessProps) {
  const missing: string[] = [];
  if (!hasPitchDeck) missing.push('Pitch deck draft');
  if (!hasMetrics) missing.push('Key metrics baseline');
  if (!hasFinancials) missing.push('Financial model');

  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Fundraising Readiness</h3>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <span className="text-2xl font-bold text-foreground">{score}<span className="text-sm font-normal text-muted-foreground">/100</span></span>
        <div className="flex-1">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                score >= 70 ? "bg-green-500" : score >= 40 ? "bg-amber-500" : "bg-red-400"
              )}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      {!isRaising && (
        <p className="text-xs text-muted-foreground mb-3">Not currently fundraising</p>
      )}

      {missing.length > 0 && (
        <div className="space-y-1.5 mb-3">
          <p className="text-[11px] font-medium text-muted-foreground">Missing:</p>
          {missing.map((item) => (
            <div key={item} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CircleAlert className="w-3 h-3 text-amber-500 shrink-0" />
              {item}
            </div>
          ))}
        </div>
      )}

      <Link
        to="/investors"
        className="flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:underline"
      >
        Build investor plan <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
