import { Link } from "react-router-dom";
import { Lightbulb, ArrowRight } from "lucide-react";

interface PrimaryOpportunityProps {
  icp?: string;
  problem?: string;
  uvp?: string;
  stage?: string;
  validationScore?: number;
}

export function PrimaryOpportunity({ icp, problem, uvp, stage, validationScore }: PrimaryOpportunityProps) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Primary Opportunity</h3>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">ICP</span>
          <p className="text-foreground mt-0.5 leading-snug">
            {icp || <span className="text-muted-foreground italic">Not defined yet</span>}
          </p>
        </div>
        <div>
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Problem</span>
          <p className="text-foreground mt-0.5 leading-snug line-clamp-2">
            {problem || <span className="text-muted-foreground italic">Not defined yet</span>}
          </p>
        </div>
        <div>
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">UVP</span>
          <p className="text-foreground mt-0.5 leading-snug line-clamp-2">
            {uvp || <span className="text-muted-foreground italic">Not defined yet</span>}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {stage && <span className="px-2 py-0.5 rounded bg-muted font-medium capitalize">{stage.replace(/_/g, ' ')}</span>}
          {validationScore != null && validationScore > 0 && (
            <span>Score: {validationScore}/100</span>
          )}
        </div>
        <Link to="/opportunity-canvas" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          View <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
