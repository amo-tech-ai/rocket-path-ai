import { Link } from "react-router-dom";
import { ShieldAlert, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Risk } from "@/hooks/useTopRisks";

interface TopRisksProps {
  risks: Risk[];
}

const severityStyles = {
  fatal: 'text-red-600 bg-red-50 dark:bg-red-950/30',
  high: 'text-red-500 bg-red-50 dark:bg-red-950/20',
  medium: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20',
  low: 'text-muted-foreground bg-muted',
};

const severityDots = {
  fatal: 'bg-red-500',
  high: 'bg-red-400',
  medium: 'bg-amber-500',
  low: 'bg-muted-foreground',
};

export function TopRisks({ risks }: TopRisksProps) {
  if (risks.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Top Risks</h3>
        <p className="text-xs text-muted-foreground">No significant risks detected. Nice work!</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-semibold text-foreground">Top Risks</h3>
      </div>

      <div className="space-y-3">
        {risks.map((risk, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="text-xs font-medium text-muted-foreground mt-0.5 w-4 shrink-0">
              {i + 1}.
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground leading-snug">{risk.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded",
                  severityStyles[risk.severity]
                )}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", severityDots[risk.severity])} />
                  {risk.severity}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Source: {risk.source}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/assumption-board"
        className="flex items-center justify-center gap-1.5 mt-4 text-xs font-medium text-primary hover:underline"
      >
        Review risks <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
