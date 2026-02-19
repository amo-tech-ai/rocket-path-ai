/**
 * EmbedReport — Minimal iframe-embeddable version of SharedReport.
 * No Header, Footer, or CTA. Just the report content + "Powered by StartupAI" bar.
 * Accepts ?sections=hero,problem,market query param for future section filtering.
 */
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  TrendingUp,
  Flag,
  ArrowRight,
  ChevronDown,
  Lock,
  Clock,
} from 'lucide-react';
import {
  formatMarketSize,
  formatCurrency,
  type TechnologyAssessment,
  type RevenueModelAssessment,
  type TeamAssessment,
  type KeyQuestion,
  type ResourceCategory,
  type ScoresMatrixData,
  type SWOT,
  type FeatureComparison,
  type PositioningMatrix,
  type FinancialProjections,
  type MarketFactor,
  type ExecutionFactor,
} from '@/types/validation-report';
import TAMSAMSOMChart from '@/components/validation-report/TAMSAMSOMChart';
import DimensionScoresChart from '@/components/validation-report/DimensionScoresChart';
import FactorsBreakdownCard from '@/components/validation-report/FactorsBreakdownCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchReportByToken, type ShareError } from '@/hooks/useShareableLinks';

interface ReportData {
  id: string;
  score: number;
  summary: string;
  verified: boolean;
  verification_json: {
    verified: boolean;
    warnings: string[];
    missing_sections: string[];
    failed_agents: string[];
    section_mappings: Record<string, string>;
  } | null;
  details: {
    highlights?: string[];
    red_flags?: string[];
    summary_verdict: string;
    problem_clarity: string;
    customer_use_case: string;
    market_sizing: { tam: number; sam: number; som: number; citations: string[] };
    competition: {
      competitors: Array<{ name: string; description: string; threat_level: string }>;
      citations: string[];
      swot?: SWOT;
      feature_comparison?: FeatureComparison;
      positioning?: PositioningMatrix;
    };
    risks_assumptions: string[];
    mvp_scope: string;
    next_steps: string[];
    dimension_scores?: Record<string, number>;
    market_factors?: Array<{ name: string; score: number; description: string; status: string }>;
    execution_factors?: Array<{ name: string; score: number; description: string; status: string }>;
    technology_stack?: TechnologyAssessment;
    revenue_model?: RevenueModelAssessment;
    team_hiring?: TeamAssessment;
    key_questions?: KeyQuestion[];
    resources_links?: ResourceCategory[];
    scores_matrix?: ScoresMatrixData;
    financial_projections?: FinancialProjections;
  };
  created_at: string;
}

type ErrorType = 'expired' | 'revoked' | 'invalid' | 'unknown';

export default function EmbedReport() {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);

  // Parse ?sections=hero,problem,market into an array (for future filtering)
  const sectionsParam = searchParams.get('sections');
  const sections: string[] = sectionsParam
    ? sectionsParam.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  useEffect(() => {
    if (!token) {
      setErrorType('invalid');
      setLoading(false);
      return;
    }

    async function load() {
      const { data, error: fetchError } = await fetchReportByToken(token!);
      if (fetchError) {
        if (fetchError && typeof fetchError === 'object' && 'code' in fetchError) {
          const typedError = fetchError as ShareError;
          setErrorType(typedError.code === 'not_found' ? 'unknown' : typedError.code);
        } else {
          setErrorType('unknown');
        }
        setLoading(false);
        return;
      }

      // Transform data safely (same as SharedReport / ValidatorReport)
      const rawDetails = data.details;
      const safeDetails = (Array.isArray(rawDetails) ? rawDetails[0] : rawDetails) || {};
      setReport({
        id: data.id,
        score: data.score || 0,
        summary: data.summary || safeDetails.summary_verdict || '',
        verified: data.verified || false,
        verification_json: data.verification_json as ReportData['verification_json'],
        details: safeDetails as ReportData['details'],
        created_at: data.created_at,
      });
      setLoading(false);
    }

    load();
  }, [token]);

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-destructive';
  };

  const getVerdict = (score: number) => {
    if (score >= 75) return { label: 'GO', color: 'bg-emerald-500/10 text-emerald-500' };
    if (score >= 50) return { label: 'CAUTION', color: 'bg-amber-500/10 text-amber-500' };
    return { label: 'NO-GO', color: 'bg-destructive/10 text-destructive' };
  };

  // Loading state — no Header/Footer
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Error states — no Header/Footer, no CTA button
  if (errorType || !report) {
    const errorMessages: Record<ErrorType, { icon: React.ReactNode; title: string; desc: string }> = {
      expired: {
        icon: <Clock className="w-16 h-16 text-amber-500" />,
        title: 'Link Expired',
        desc: 'This share link has expired. Ask the report owner to generate a new one.',
      },
      revoked: {
        icon: <Lock className="w-16 h-16 text-destructive" />,
        title: 'Link Revoked',
        desc: 'This share link has been revoked by the report owner.',
      },
      invalid: {
        icon: <AlertTriangle className="w-16 h-16 text-muted-foreground" />,
        title: 'Invalid Link',
        desc: 'This share link is not valid. Please check the URL and try again.',
      },
      unknown: {
        icon: <AlertTriangle className="w-16 h-16 text-destructive" />,
        title: 'Report Not Found',
        desc: 'We could not load this report. The link may be invalid or the report may no longer exist.',
      },
    };
    const err = errorMessages[errorType || 'unknown'];

    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-lg text-center space-y-6">
            {err.icon}
            <h1 className="text-2xl font-semibold text-foreground">{err.title}</h1>
            <p className="text-muted-foreground">{err.desc}</p>
          </div>
        </main>
        <PoweredByBar />
      </div>
    );
  }

  const verdict = getVerdict(report.score);
  const details = report.details;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pb-6">
        <div className="max-w-4xl mx-auto px-6 pt-6 space-y-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Startup Validation Report
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Generated {new Date(report.created_at).toLocaleDateString()}
            </p>
          </motion.div>

          {/* Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="card-premium p-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Score Circle */}
              <div className="relative flex-shrink-0">
                <svg className="w-40 h-40 -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="none" className="text-muted" />
                  <circle
                    cx="80" cy="80" r="70"
                    stroke="url(#scoreGradientEmbed)"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 70}
                    strokeDashoffset={2 * Math.PI * 70 * (1 - report.score / 100)}
                  />
                  <defs>
                    <linearGradient id="scoreGradientEmbed" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-bold ${getScoreColor(report.score)}`}>
                    {report.score}
                  </span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
              </div>
              {/* Info */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                  <Badge className={verdict.color}>{verdict.label}</Badge>
                  {report.verified && (
                    <Badge className="bg-emerald-500/10 text-emerald-500">
                      <Shield className="w-3 h-3 mr-1" />
                      AI Verified
                    </Badge>
                  )}
                </div>
                <p className="text-lg text-foreground">{details.summary_verdict}</p>
              </div>
            </div>
          </motion.div>

          {/* Highlights / Red Flags / Next Steps */}
          {(details.highlights?.length || details.red_flags?.length || details.next_steps?.length) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-semibold text-emerald-500">Strengths</h3>
                </div>
                <ul className="space-y-1.5">
                  {(details.highlights || []).slice(0, 5).map((h, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                <div className="flex items-center gap-2 mb-3">
                  <Flag className="w-4 h-4 text-destructive" />
                  <h3 className="text-sm font-semibold text-destructive">Concerns</h3>
                </div>
                <ul className="space-y-1.5">
                  {(details.red_flags || []).slice(0, 5).map((r, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-destructive mt-0.5 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                <div className="flex items-center gap-2 mb-3">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-primary">Next Steps</h3>
                </div>
                <ul className="space-y-1.5">
                  {(details.next_steps || []).slice(0, 5).map((s, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {/* Report Sections */}
          <div className="grid gap-6">
            <EmbedReportSection number={1} title="Problem Clarity" content={details.problem_clarity} verified={report.verified} />
            <EmbedReportSection number={2} title="Customer Use Case" content={details.customer_use_case} verified={report.verified} />

            {/* Market Sizing */}
            <EmbedReportSection number={3} title="Market Sizing" verified={report.verified} citations={details.market_sizing?.citations}>
              {details.market_sizing && (
                <div className="mt-4">
                  <TAMSAMSOMChart
                    data={{ tam: details.market_sizing.tam || 0, sam: details.market_sizing.sam || 0, som: details.market_sizing.som || 0 }}
                    className="border-0 shadow-none p-0"
                  />
                </div>
              )}
            </EmbedReportSection>

            {/* Competition */}
            <EmbedReportSection number={4} title="Competition Deep Dive" verified={report.verified} citations={details.competition?.citations}>
              <div className="space-y-6 mt-4">
                <div className="space-y-3">
                  {details.competition?.competitors?.map((comp, i) => (
                    <div key={i} className="p-3 bg-muted/50 rounded-lg flex items-center justify-between">
                      <div>
                        <span className="font-medium text-foreground">{comp.name}</span>
                        <p className="text-sm text-muted-foreground">{comp.description}</p>
                      </div>
                      <Badge variant={comp.threat_level === 'high' ? 'destructive' : comp.threat_level === 'medium' ? 'default' : 'secondary'}>
                        {comp.threat_level}
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* SWOT */}
                {details.competition?.swot && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">SWOT Analysis</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {(['strengths', 'weaknesses', 'opportunities', 'threats'] as const).map((key) => {
                        const items = details.competition.swot![key];
                        if (!items?.length) return null;
                        const config = {
                          strengths: { label: 'Strengths', bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' },
                          weaknesses: { label: 'Weaknesses', bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/20' },
                          opportunities: { label: 'Opportunities', bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' },
                          threats: { label: 'Threats', bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' },
                        }[key];
                        return (
                          <div key={key} className={`p-3 rounded-lg border ${config.bg} ${config.border}`}>
                            <span className={`text-xs font-medium ${config.text} uppercase tracking-wider`}>{config.label}</span>
                            <ul className="mt-2 space-y-1">
                              {items.map((item, i) => (
                                <li key={i} className="text-sm text-muted-foreground">{item}</li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Feature Comparison */}
                {details.competition?.feature_comparison && details.competition.feature_comparison.features?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">Feature Comparison</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left p-2 text-muted-foreground font-medium">Feature</th>
                            {details.competition.feature_comparison.competitors?.map((comp, i) => (
                              <th key={i} className="text-center p-2 text-muted-foreground font-medium">{comp.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {details.competition.feature_comparison.features.map((feature, fi) => (
                            <tr key={fi} className="border-b border-border/50">
                              <td className="p-2 text-foreground">{feature}</td>
                              {details.competition.feature_comparison!.competitors?.map((comp, ci) => (
                                <td key={ci} className="text-center p-2">
                                  {comp.has_feature?.[fi] ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                                  ) : (
                                    <span className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 inline-block" />
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Positioning Matrix */}
                {details.competition?.positioning && details.competition.positioning.positions?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">Competitive Positioning</h4>
                    <div className="relative bg-muted/30 rounded-lg border border-border p-6" style={{ height: 280 }}>
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                        {details.competition.positioning.x_axis} &rarr;
                      </span>
                      <span className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-muted-foreground">
                        {details.competition.positioning.y_axis} &rarr;
                      </span>
                      <div className="absolute inset-6 border-l border-b border-border/50">
                        <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-border/30" />
                        <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-border/30" />
                      </div>
                      {details.competition.positioning.positions.map((pos, i) => (
                        <div
                          key={i}
                          className="absolute flex flex-col items-center"
                          style={{
                            left: `${6 + (pos.x / 100) * 82}%`,
                            bottom: `${6 + (pos.y / 100) * 78}%`,
                            transform: 'translate(-50%, 50%)',
                          }}
                        >
                          <div className={`w-3 h-3 rounded-full ${pos.is_founder ? 'bg-primary ring-2 ring-primary/30' : 'bg-muted-foreground/60'}`} />
                          <span className={`text-[10px] mt-1 whitespace-nowrap ${pos.is_founder ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                            {pos.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </EmbedReportSection>

            {/* Risks & Assumptions */}
            <EmbedReportSection number={5} title="Risks & Assumptions" verified={report.verified}>
              <ul className="list-disc list-inside space-y-2 mt-4 text-muted-foreground">
                {details.risks_assumptions?.map((risk, i) => <li key={i}>{risk}</li>)}
              </ul>
            </EmbedReportSection>

            {/* MVP Scope */}
            <EmbedReportSection number={6} title="MVP Scope" content={details.mvp_scope} verified={report.verified} />

            {/* Next Steps */}
            <EmbedReportSection number={7} title="Next Steps" verified={report.verified}>
              <ol className="list-decimal list-inside space-y-2 mt-4 text-muted-foreground">
                {details.next_steps?.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            </EmbedReportSection>

            {/* Scores Matrix */}
            {(details.scores_matrix || details.market_factors || details.execution_factors) && (
              <EmbedReportSection number={8} title="Scores Matrix" verified={report.verified}>
                {details.scores_matrix && (
                  <>
                    <div className="flex items-center gap-3 mt-4 mb-4 p-3 bg-muted/50 rounded-lg">
                      <span className="text-2xl font-bold text-foreground">{details.scores_matrix.overall_weighted}</span>
                      <span className="text-sm text-muted-foreground">/100 weighted score</span>
                    </div>
                    {details.scores_matrix.dimensions?.length > 0 && (
                      <DimensionScoresChart
                        scores={details.scores_matrix.dimensions.map(dim => ({ ...dim, factors: [] }))}
                        className="border-0 shadow-none p-0"
                      />
                    )}
                  </>
                )}
                {((details.market_factors && details.market_factors.length > 0) ||
                  (details.execution_factors && details.execution_factors.length > 0)) && (
                  <div className="mt-6">
                    <FactorsBreakdownCard
                      marketFactors={(details.market_factors || []) as MarketFactor[]}
                      executionFactors={(details.execution_factors || []) as ExecutionFactor[]}
                      className="border-0 shadow-none p-0"
                    />
                  </div>
                )}
              </EmbedReportSection>
            )}

            {/* Technology Stack */}
            {details.technology_stack && (
              <EmbedReportSection number={9} title="Technology Stack" verified={report.verified}>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge className={
                      details.technology_stack.feasibility === 'high' ? 'bg-emerald-500/10 text-emerald-500' :
                      details.technology_stack.feasibility === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-destructive/10 text-destructive'
                    }>
                      Feasibility: {details.technology_stack.feasibility.toUpperCase()}
                    </Badge>
                    {details.technology_stack.mvp_timeline_weeks > 0 && (
                      <span className="text-sm text-muted-foreground">MVP: ~{details.technology_stack.mvp_timeline_weeks} weeks</span>
                    )}
                  </div>
                  {details.technology_stack.feasibility_rationale && (
                    <p className="text-sm text-muted-foreground">{details.technology_stack.feasibility_rationale}</p>
                  )}
                  {details.technology_stack.stack_components?.length > 0 && (
                    <div className="space-y-2">
                      {details.technology_stack.stack_components.map((comp, i) => (
                        <div key={i} className="p-3 bg-muted/50 rounded-lg flex items-center justify-between">
                          <div className="flex-1">
                            <span className="font-medium text-foreground">{comp.name}</span>
                            <p className="text-xs text-muted-foreground mt-0.5">{comp.rationale}</p>
                          </div>
                          <Badge variant="outline" className="text-xs ml-3">
                            {comp.choice === 'open_source' ? 'Open Source' : comp.choice === 'build' ? 'Build' : 'Buy'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  {details.technology_stack.technical_risks?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Technical Risks</h4>
                      <div className="space-y-2">
                        {details.technology_stack.technical_risks.map((risk, i) => (
                          <div key={i} className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-foreground">{risk.risk}</span>
                              <Badge variant={risk.likelihood === 'high' ? 'destructive' : risk.likelihood === 'medium' ? 'default' : 'secondary'} className="text-xs">
                                {risk.likelihood}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">Mitigation: {risk.mitigation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </EmbedReportSection>
            )}

            {/* Revenue Model */}
            {details.revenue_model && (
              <EmbedReportSection number={10} title="Revenue Model" verified={report.verified}>
                <div className="mt-4 space-y-4">
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <span className="text-sm font-medium text-primary">Recommended:</span>
                    <span className="ml-2 text-foreground">{details.revenue_model.recommended_model}</span>
                    {details.revenue_model.reasoning && (
                      <p className="text-sm text-muted-foreground mt-1">{details.revenue_model.reasoning}</p>
                    )}
                  </div>
                  {details.revenue_model.unit_economics && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-xl font-bold text-foreground">{formatCurrency(details.revenue_model.unit_economics.cac)}</p>
                        <p className="text-xs text-muted-foreground">CAC</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-xl font-bold text-foreground">{formatCurrency(details.revenue_model.unit_economics.ltv)}</p>
                        <p className="text-xs text-muted-foreground">LTV</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-xl font-bold text-foreground">{details.revenue_model.unit_economics.ltv_cac_ratio.toFixed(1)}x</p>
                        <p className="text-xs text-muted-foreground">LTV/CAC</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-xl font-bold text-foreground">{details.revenue_model.unit_economics.payback_months.toFixed(1)} mo</p>
                        <p className="text-xs text-muted-foreground">Payback</p>
                      </div>
                    </div>
                  )}
                  {details.revenue_model.alternatives?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Alternatives</h4>
                      <div className="space-y-2">
                        {details.revenue_model.alternatives.map((alt, i) => (
                          <div key={i} className="p-3 bg-muted/50 rounded-lg">
                            <span className="font-medium text-foreground">{alt.model}</span>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div>
                                <span className="text-xs text-emerald-500 font-medium">Pros</span>
                                <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                                  {alt.pros?.map((p, j) => <li key={j}>+ {p}</li>)}
                                </ul>
                              </div>
                              <div>
                                <span className="text-xs text-destructive font-medium">Cons</span>
                                <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                                  {alt.cons?.map((c, j) => <li key={j}>- {c}</li>)}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </EmbedReportSection>
            )}

            {/* Team & Hiring */}
            {details.team_hiring && (
              <EmbedReportSection number={11} title="Team & Hiring" verified={report.verified}>
                <div className="mt-4 space-y-4">
                  {details.team_hiring.monthly_burn > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Monthly Burn:</span>
                      <span className="text-lg font-bold text-foreground">{formatCurrency(details.team_hiring.monthly_burn)}</span>
                    </div>
                  )}
                  {details.team_hiring.current_gaps?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Current Gaps</h4>
                      <div className="flex flex-wrap gap-2">
                        {details.team_hiring.current_gaps.map((gap, i) => (
                          <Badge key={i} variant="destructive" className="text-xs">{gap}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {details.team_hiring.mvp_roles?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">MVP Roles</h4>
                      <div className="space-y-2">
                        {[...details.team_hiring.mvp_roles]
                          .sort((a, b) => a.priority - b.priority)
                          .map((role, i) => (
                            <div key={i} className="p-3 bg-muted/50 rounded-lg flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">{role.priority}</span>
                                  <span className="font-medium text-foreground">{role.role}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 ml-8">{role.rationale}</p>
                              </div>
                              <span className="text-sm font-medium text-foreground ml-3">{formatCurrency(role.monthly_cost)}/mo</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  {details.team_hiring.advisory_needs?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Advisory Needs</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {details.team_hiring.advisory_needs.map((need, i) => <li key={i}>{need}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </EmbedReportSection>
            )}

            {/* Key Questions */}
            {details.key_questions && details.key_questions.length > 0 && (
              <EmbedReportSection number={12} title="Key Questions" verified={report.verified}>
                <div className="mt-4 space-y-4">
                  {(['fatal', 'important', 'minor'] as const).map(level => {
                    const questions = details.key_questions!.filter(q => q.risk_level === level);
                    if (questions.length === 0) return null;
                    return (
                      <div key={level}>
                        <Badge className={
                          level === 'fatal' ? 'bg-destructive/10 text-destructive' :
                          level === 'important' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-emerald-500/10 text-emerald-500'
                        }>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </Badge>
                        <div className="space-y-2 mt-2">
                          {questions.map((q, i) => (
                            <div key={i} className="p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm font-medium text-foreground">{q.question}</p>
                              <p className="text-xs text-muted-foreground mt-1">{q.why_it_matters}</p>
                              <p className="text-xs text-primary mt-1">Validate: {q.validation_method}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </EmbedReportSection>
            )}

            {/* Resources & Links */}
            {details.resources_links && details.resources_links.length > 0 && (
              <EmbedReportSection number={13} title="Resources & Links" verified={report.verified}>
                <div className="mt-4 space-y-4">
                  {details.resources_links.map((cat, i) => (
                    <div key={i}>
                      <h4 className="text-sm font-medium text-foreground mb-2">{cat.category}</h4>
                      <div className="space-y-1">
                        {cat.links?.map((link, j) => (
                          <a
                            key={j}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm text-primary group-hover:underline">{link.title}</span>
                              {link.description && <p className="text-xs text-muted-foreground">{link.description}</p>}
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </EmbedReportSection>
            )}

            {/* Financial Projections */}
            {details.financial_projections && (
              <EmbedReportSection number={14} title="Financial Projections" verified={report.verified}>
                <div className="mt-4 space-y-6">
                  {details.financial_projections.key_assumption && (
                    <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-xs font-medium text-amber-500 uppercase tracking-wider">Key Assumption</span>
                          <p className="text-sm text-muted-foreground mt-1">{details.financial_projections.key_assumption}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Revenue Growth Chart */}
                  {details.financial_projections.scenarios?.length >= 2 && (() => {
                    const scenarios = details.financial_projections!.scenarios;
                    const chartData = [
                      { year: 'Year 1', ...Object.fromEntries(scenarios.map(s => [s.name, s.y1_revenue])) },
                      { year: 'Year 3', ...Object.fromEntries(scenarios.map(s => [s.name, s.y3_revenue])) },
                      { year: 'Year 5', ...Object.fromEntries(scenarios.map(s => [s.name, s.y5_revenue])) },
                    ];
                    const colors = ['hsl(var(--primary))', '#10b981', '#f59e0b', '#ef4444'];
                    return (
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-3">Revenue Trajectory</h4>
                        <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                              <defs>
                                {scenarios.map((s, i) => (
                                  <linearGradient key={s.name} id={`grad-embed-${i}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={colors[i % colors.length]} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={colors[i % colors.length]} stopOpacity={0} />
                                  </linearGradient>
                                ))}
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v: number) => v >= 1_000_000 ? `$${(v/1_000_000).toFixed(1)}M` : v >= 1_000 ? `$${(v/1_000).toFixed(0)}K` : `$${v}`} />
                              <RechartsTooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                                formatter={(value: number) => [formatCurrency(value), undefined]}
                              />
                              <Legend wrapperStyle={{ fontSize: 12 }} />
                              {scenarios.map((s, i) => (
                                <Area key={s.name} type="monotone" dataKey={s.name} stroke={colors[i % colors.length]} fill={`url(#grad-embed-${i})`} strokeWidth={2} />
                              ))}
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Revenue Scenarios Table */}
                  {details.financial_projections.scenarios?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-3">Revenue Scenarios</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left p-2 text-muted-foreground font-medium">Scenario</th>
                              <th className="text-right p-2 text-muted-foreground font-medium">Year 1</th>
                              <th className="text-right p-2 text-muted-foreground font-medium">Year 3</th>
                              <th className="text-right p-2 text-muted-foreground font-medium">Year 5</th>
                            </tr>
                          </thead>
                          <tbody>
                            {details.financial_projections.scenarios.map((s, i) => (
                              <tr key={i} className="border-b border-border/50">
                                <td className="p-2 text-foreground font-medium">{s.name}</td>
                                <td className="p-2 text-right text-foreground">{formatCurrency(s.y1_revenue)}</td>
                                <td className="p-2 text-right text-foreground">{formatCurrency(s.y3_revenue)}</td>
                                <td className="p-2 text-right text-foreground">{formatCurrency(s.y5_revenue)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Monthly Y1 Breakdown */}
                  {details.financial_projections.monthly_y1?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-3">Year 1 Monthly Growth</h4>
                      <div className="flex items-end gap-1 h-32">
                        {details.financial_projections.monthly_y1.map((m, i) => {
                          const maxRev = Math.max(...(details.financial_projections?.monthly_y1 ?? []).map(x => x.revenue));
                          const height = maxRev > 0 ? (m.revenue / maxRev) * 100 : 0;
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                              <span className="text-[9px] text-muted-foreground">{formatCurrency(m.revenue)}</span>
                              <div className="w-full bg-primary/80 rounded-t" style={{ height: `${Math.max(height, 2)}%` }} />
                              <span className="text-[10px] text-muted-foreground">M{m.month}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Break-Even */}
                  {details.financial_projections.break_even && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-xl font-bold text-foreground">{details.financial_projections.break_even.months} mo</p>
                        <p className="text-xs text-muted-foreground">Break-even Timeline</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-xl font-bold text-foreground">{formatCurrency(details.financial_projections.break_even.revenue_required)}/mo</p>
                        <p className="text-xs text-muted-foreground">Revenue Required</p>
                      </div>
                    </div>
                  )}
                </div>
              </EmbedReportSection>
            )}
          </div>
        </div>
      </main>
      <PoweredByBar />
    </div>
  );
}

/** Sticky "Powered by StartupAI" brand bar for embed footer */
function PoweredByBar() {
  return (
    <div className="sticky bottom-0 z-10 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
        <a
          href="https://startupai.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="font-semibold text-foreground">StartupAI</span>
          <span className="text-muted-foreground">Powered by AI validation</span>
        </a>
        <a
          href="https://startupai.app/validate"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-primary hover:underline"
        >
          Validate your idea
        </a>
      </div>
    </div>
  );
}

/** Collapsible report section for embed view (same as PublicReportSection in SharedReport) */
interface EmbedReportSectionProps {
  number: number;
  title: string;
  content?: string;
  verified: boolean;
  citations?: string[];
  children?: React.ReactNode;
}

function EmbedReportSection({ number, title, content, verified, citations, children }: EmbedReportSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: number * 0.03 }}
      className="card-premium"
    >
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/30 transition-colors rounded-xl"
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
            {number}
          </span>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {verified && (
            <Badge variant="outline" className="text-xs text-emerald-500">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
          {citations && citations.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {citations.length} sources
            </Badge>
          )}
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-6">
          {content && <p className="text-muted-foreground whitespace-pre-line">{content}</p>}
          {children}
        </div>
      )}
    </motion.div>
  );
}
