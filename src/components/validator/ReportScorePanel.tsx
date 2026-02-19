/**
 * Report Score Panel — right sidebar for ValidatorReport page
 * Shows at-a-glance scoring dashboard derived from report data
 */

import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  Zap,
  Clock,
  Target,
  CheckCircle2,
} from 'lucide-react';

interface ScoreDimension {
  name: string;
  score: number;
  weight: number;
}

interface MarketFactor {
  name: string;
  score: number;
  description: string;
  status: string;
}

interface ReportScorePanelProps {
  score: number;
  verified: boolean;
  details: {
    scores_matrix?: {
      overall_weighted: number;
      dimensions?: ScoreDimension[];
    };
    market_factors?: MarketFactor[];
    execution_factors?: MarketFactor[];
    risks_assumptions?: string[];
    key_questions?: Array<{ risk_level: string }>;
    technology_stack?: {
      feasibility: string;
      mvp_timeline_weeks: number;
    };
    financial_projections?: {
      break_even?: { months: number; revenue_required: number };
    };
    revenue_model?: {
      unit_economics?: {
        ltv_cac_ratio: number;
        payback_months: number;
      };
    };
  };
}

function getVerdict(score: number) {
  if (score >= 75) return { label: 'GO', color: 'bg-status-success-light text-status-success border-status-success/20' };
  if (score >= 50) return { label: 'CAUTION', color: 'bg-status-warning-light text-status-warning border-status-warning/20' };
  return { label: 'NO-GO', color: 'bg-destructive/10 text-destructive border-destructive/20' };
}

function getScoreColor(score: number) {
  if (score >= 70) return 'bg-status-success';
  if (score >= 40) return 'bg-status-warning';
  return 'bg-destructive';
}

function getScoreTextColor(score: number) {
  if (score >= 70) return 'text-status-success';
  if (score >= 40) return 'text-status-warning';
  return 'text-destructive';
}

export function ReportScorePanel({ score, verified, details }: ReportScorePanelProps) {
  const verdict = getVerdict(score);
  const dimensions = details.scores_matrix?.dimensions || [];

  // Compute group averages
  const marketAvg = details.market_factors?.length
    ? Math.round(details.market_factors.reduce((a, f) => a + f.score, 0) / details.market_factors.length)
    : null;

  const execAvg = details.execution_factors?.length
    ? Math.round(details.execution_factors.reduce((a, f) => a + f.score, 0) / details.execution_factors.length)
    : null;

  // Risk summary
  const riskCount = details.risks_assumptions?.length || 0;
  const fatalQuestions = details.key_questions?.filter(q => q.risk_level === 'fatal').length || 0;
  const importantQuestions = details.key_questions?.filter(q => q.risk_level === 'important').length || 0;

  // Tech feasibility
  const techFeasibility = details.technology_stack?.feasibility;
  const mvpWeeks = details.technology_stack?.mvp_timeline_weeks;

  // Financial metrics
  const breakEvenMonths = details.financial_projections?.break_even?.months;
  const ltvCacRatio = details.revenue_model?.unit_economics?.ltv_cac_ratio;
  const paybackMonths = details.revenue_model?.unit_economics?.payback_months;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Score Dashboard</h3>
        <p className="text-xs text-muted-foreground">At-a-glance validation metrics</p>
      </div>

      {/* Overall Score */}
      <div className="p-4 rounded-xl bg-card border border-border text-center">
        <div className="relative w-20 h-20 mx-auto">
          <svg className="w-20 h-20 -rotate-90">
            <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="none" className="text-muted" />
            <circle
              cx="40" cy="40" r="34"
              stroke="url(#miniScoreGrad)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 34}
              strokeDashoffset={2 * Math.PI * 34 * (1 - score / 100)}
            />
            <defs>
              <linearGradient id="miniScoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xl font-bold ${getScoreTextColor(score)}`}>{score}</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Badge className={verdict.color}>{verdict.label}</Badge>
          {verified && (
            <Badge className="bg-status-success-light text-status-success border-status-success/20">
              <Shield className="w-3 h-3 mr-0.5" />
              Verified
            </Badge>
          )}
        </div>
      </div>

      {/* Dimension Scores */}
      {dimensions.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Dimension Scores
          </h4>
          {dimensions.map((dim, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs text-foreground truncate max-w-[140px]">{dim.name}</span>
                <span className={`text-xs font-medium ${getScoreTextColor(dim.score)}`}>{dim.score}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${getScoreColor(dim.score)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${dim.score}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Readiness Indicators */}
      {(marketAvg !== null || execAvg !== null) && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Readiness
          </h4>
          {marketAvg !== null && (
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-status-info" />
                <span className="text-xs text-foreground">Market</span>
              </div>
              <span className={`text-xs font-bold ${getScoreTextColor(marketAvg)}`}>{marketAvg}/100</span>
            </div>
          )}
          {execAvg !== null && (
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs text-foreground">Execution</span>
              </div>
              <span className={`text-xs font-bold ${getScoreTextColor(execAvg)}`}>{execAvg}/100</span>
            </div>
          )}
          {techFeasibility && (
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-status-info" />
                <span className="text-xs text-foreground">Tech Feasibility</span>
              </div>
              <Badge className={
                techFeasibility === 'high' ? 'bg-status-success-light text-status-success border-status-success/20' :
                techFeasibility === 'medium' ? 'bg-status-warning-light text-status-warning border-status-warning/20' :
                'bg-destructive/10 text-destructive border-destructive/20'
              }>
                {techFeasibility.toUpperCase()}
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Risk Summary */}
      {(riskCount > 0 || fatalQuestions > 0) && (
        <div className="p-3 rounded-lg bg-card border border-border space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Risk Indicators
          </h4>
          <div className="space-y-1.5">
            {fatalQuestions > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                <span className="text-destructive font-medium">{fatalQuestions} fatal question{fatalQuestions > 1 ? 's' : ''}</span>
              </div>
            )}
            {importantQuestions > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-status-warning" />
                <span className="text-status-warning">{importantQuestions} important question{importantQuestions > 1 ? 's' : ''}</span>
              </div>
            )}
            {riskCount > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">{riskCount} risk{riskCount > 1 ? 's' : ''} identified</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Key Metrics */}
      {(breakEvenMonths || ltvCacRatio || mvpWeeks) && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Key Metrics
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {ltvCacRatio != null && (
              <div className="p-2.5 rounded-lg bg-muted/50 text-center">
                <div className={`text-lg font-bold ${ltvCacRatio >= 3 ? 'text-status-success' : ltvCacRatio >= 1.5 ? 'text-status-warning' : 'text-destructive'}`}>
                  {ltvCacRatio.toFixed(1)}x
                </div>
                <div className="text-[10px] text-muted-foreground">LTV/CAC</div>
              </div>
            )}
            {paybackMonths != null && (
              <div className="p-2.5 rounded-lg bg-muted/50 text-center">
                <div className="text-lg font-bold text-foreground">{paybackMonths.toFixed(0)}mo</div>
                <div className="text-[10px] text-muted-foreground">Payback</div>
              </div>
            )}
            {breakEvenMonths != null && (
              <div className="p-2.5 rounded-lg bg-muted/50 text-center">
                <div className="text-lg font-bold text-foreground">{breakEvenMonths}mo</div>
                <div className="text-[10px] text-muted-foreground">Break-even</div>
              </div>
            )}
            {mvpWeeks != null && mvpWeeks > 0 && (
              <div className="p-2.5 rounded-lg bg-muted/50 text-center">
                <div className="text-lg font-bold text-foreground">{mvpWeeks}wk</div>
                <div className="text-[10px] text-muted-foreground">MVP Build</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Verification footer */}
      <div className="p-3 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-start gap-2">
          {verified ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-status-success mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                This report was verified by AI cross-referencing all agent outputs.
              </p>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-status-warning mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                This report has not been verified. Some agents may have failed.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
