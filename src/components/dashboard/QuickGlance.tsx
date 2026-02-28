/**
 * QuickGlance Component (Zone 3)
 * Collapsible accordion with 3 sections: Risks, Health, Feed.
 * All sections collapsed by default — zero-scroll dashboard.
 * Replaces: TopRisks + StartupHealthEnhanced + RecentActivity cards
 */

import { motion } from 'framer-motion';
import { ShieldAlert, Activity, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import type { Risk } from '@/hooks/useTopRisks';
import type { HealthScore, HealthBreakdown } from '@/hooks/useHealthScore';
import { RecentActivity } from '@/components/dashboard/RecentActivity';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface QuickGlanceProps {
  risks: Risk[];
  healthScore: HealthScore | undefined;
  healthLoading: boolean;
  startupId: string | undefined;
}

// ---------------------------------------------------------------------------
// Severity styles (from TopRisks.tsx)
// ---------------------------------------------------------------------------

const severityStyles: Record<string, string> = {
  fatal: 'text-red-600 bg-red-50 dark:bg-red-950/30',
  high: 'text-red-500 bg-red-50 dark:bg-red-950/20',
  medium: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20',
  low: 'text-muted-foreground bg-muted',
};

const severityDots: Record<string, string> = {
  fatal: 'bg-red-500',
  high: 'bg-red-400',
  medium: 'bg-amber-500',
  low: 'bg-muted-foreground',
};

// ---------------------------------------------------------------------------
// Health bar colors (from StartupHealthEnhanced.tsx)
// ---------------------------------------------------------------------------

const CATEGORY_COLORS: Record<keyof HealthBreakdown, string> = {
  problemClarity: 'bg-primary',
  solutionFit: 'bg-status-success',
  marketUnderstanding: 'bg-sage',
  tractionProof: 'bg-status-warning',
  teamReadiness: 'bg-status-critical',
  investorReadiness: 'bg-status-info',
};

// ---------------------------------------------------------------------------
// RisksList — risk items without card wrapper
// ---------------------------------------------------------------------------

function RisksList({ risks }: { risks: Risk[] }) {
  if (risks.length === 0) {
    return (
      <p className="text-xs text-muted-foreground py-2">
        No significant risks detected. Nice work!
      </p>
    );
  }

  return (
    <div className="space-y-2.5">
      {risks.map((risk, i) => (
        <div key={i} className="flex items-start gap-3">
          <span className="text-xs font-medium text-muted-foreground mt-0.5 w-4 shrink-0">
            {i + 1}.
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground leading-snug">{risk.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded',
                  severityStyles[risk.severity]
                )}
              >
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    severityDots[risk.severity]
                  )}
                />
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
  );
}

// ---------------------------------------------------------------------------
// HealthBars — 6 category progress bars without ring or AI tip
// ---------------------------------------------------------------------------

function HealthBars({ breakdown }: { breakdown: HealthBreakdown }) {
  const entries = Object.entries(breakdown) as [
    keyof HealthBreakdown,
    { score: number; weight: number; label: string },
  ][];

  return (
    <div className="space-y-2.5">
      {entries.map(([key, data]) => (
        <div key={key}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-foreground">
              {data.label}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              {data.score}/100
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.score}%` }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className={`h-full rounded-full ${CATEGORY_COLORS[key]}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// QuickGlance — main component
// ---------------------------------------------------------------------------

export function QuickGlance({
  risks,
  healthScore,
  healthLoading,
  startupId,
}: QuickGlanceProps) {
  const breakdown = healthScore?.breakdown;
  const overallScore = healthScore?.overall ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="card-premium p-5"
    >
      <Accordion type="multiple" className="w-full">
        {/* Risks */}
        <AccordionItem value="risks" className="border-b border-border/50">
          <AccordionTrigger className="py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-foreground">
                Risks
              </span>
              {risks.length > 0 && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 bg-status-critical-light text-status-critical border-status-critical/20"
                >
                  {risks.length}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <RisksList risks={risks} />
          </AccordionContent>
        </AccordionItem>

        {/* Health */}
        <AccordionItem value="health" className="border-b border-border/50">
          <AccordionTrigger className="py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Health
              </span>
              {overallScore !== null && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {overallScore}/100
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {healthLoading ? (
              <p className="text-xs text-muted-foreground py-2">Loading...</p>
            ) : breakdown ? (
              <HealthBars breakdown={breakdown} />
            ) : (
              <p className="text-xs text-muted-foreground py-2">
                Complete your startup profile to see health breakdown.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Feed */}
        <AccordionItem value="feed" className="border-none">
          <AccordionTrigger className="py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Recent Activity
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <RecentActivity startupId={startupId} limit={5} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
