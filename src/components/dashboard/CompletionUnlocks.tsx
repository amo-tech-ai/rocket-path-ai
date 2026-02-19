import { Link } from "react-router-dom";
import { CircleAlert, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CompletionData } from "@/hooks/useCompletionUnlocks";

interface CompletionUnlocksProps {
  data: CompletionData;
}

export function CompletionUnlocks({ data }: CompletionUnlocksProps) {
  const { percent, missingFields } = data;

  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Completion & Unlocks</h3>
      </div>

      {/* Ring progress */}
      <div className="flex items-center gap-5 mb-4">
        <div className="relative w-16 h-16 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle
              cx="18" cy="18" r="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-muted/30"
            />
            <circle
              cx="18" cy="18" r="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${percent * 0.9425} 94.25`}
              strokeLinecap="round"
              className={cn(
                percent >= 80 ? "text-green-500" : percent >= 50 ? "text-primary" : "text-amber-500"
              )}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
            {percent}%
          </span>
        </div>

        {missingFields.length === 0 ? (
          <p className="text-sm text-muted-foreground">Profile complete! All fields filled.</p>
        ) : (
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Missing fields ({missingFields.length}):</p>
            {missingFields.slice(0, 3).map((f) => (
              <div key={f.field} className="flex items-start gap-1.5 mt-1">
                <CircleAlert className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unlocks preview */}
      {missingFields.length > 0 && (
        <div className="rounded-xl bg-primary/5 p-3 mb-3">
          <p className="text-[11px] font-semibold text-primary mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Completing unlocks:
          </p>
          {missingFields.slice(0, 3).flatMap((f) => f.unlocks.slice(0, 1)).slice(0, 3).map((unlock, i) => (
            <p key={i} className="text-[11px] text-muted-foreground ml-4">
              {unlock}
            </p>
          ))}
        </div>
      )}

      {missingFields.length > 0 && (
        <Link
          to="/company-profile"
          className="flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          Complete fields <ArrowRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}
