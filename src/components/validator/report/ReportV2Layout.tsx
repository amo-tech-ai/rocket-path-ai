/**
 * Report V2 Layout — Phase 3 Assembly
 * Single-column consulting-deck layout with StickyScoreBar + SectionShells
 * Works with BOTH v1 (prose) and v2 (structured JSON) report formats
 */
import { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StickyScoreBar } from '@/components/validator/report/shared/StickyScoreBar';
import { SectionShell } from '@/components/validator/report/shared/SectionShell';
import { ReportHeroLuxury } from '@/components/validator/report/ReportHeroLuxury';
import { ProblemCard } from '@/components/validator/report/ProblemCard';
import { CustomerPersona } from '@/components/validator/report/CustomerPersona';
import { CompetitorMatrix } from '@/components/validator/report/CompetitorMatrix';
import { CompetitorLuxury } from '@/components/validator/report/CompetitorLuxury';
import { RiskHeatmap } from '@/components/validator/report/RiskHeatmap';
import { MVPScope } from '@/components/validator/report/MVPScope';
import { NextStepsTimeline } from '@/components/validator/report/NextStepsTimeline';
import { RevenueModelDash } from '@/components/validator/report/RevenueModelDash';
import { TeamPlanCards } from '@/components/validator/report/TeamPlanCards';
import { KeyQuestionsCards } from '@/components/validator/report/KeyQuestionsCards';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { MarketSizeLuxury } from '@/components/validator/report/MarketSizeLuxury';
import { ValidationRadar } from '@/components/validator/report/charts/ValidationRadar';
import { GapAnalysisBars } from '@/components/validator/report/charts/GapAnalysisBars';
import { MaturityFunnel } from '@/components/validator/report/charts/MaturityFunnel';
import { BenchmarkBlocks } from '@/components/validator/report/charts/BenchmarkBlocks';
import { ScoreTrendLines } from '@/components/validator/report/charts/ScoreTrendLines';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { formatMarketSize } from '@/types/validation-report';
import type { ReportDetailsV2 } from '@/types/validation-report';
import type { StartupMeta } from '@/pages/ValidatorReport';

function getSignal(score: number | null): 'go' | 'caution' | 'no-go' | 'unavailable' {
  if (score === null || score === undefined) return 'unavailable';
  if (score >= 75) return 'go';
  if (score >= 50) return 'caution';
  return 'no-go';
}

/** Extract short dollar value from mixed string/number market data.
 *  Handles: 32200000000 → "$32.2B", "$32.2B total market ..." → "$32.2B" */
function safeMarketValue(val: unknown): string {
  if (typeof val === 'number' && !isNaN(val)) return formatMarketSize(val);
  if (typeof val === 'string') {
    // Extract first dollar amount pattern like "$32.2B" or "$14.4M"
    const match = val.match(/\$[\d,.]+[BMKbmk]?/);
    if (match) return match[0];
    // Try parsing the leading number
    const numMatch = val.match(/^[\d,.]+/);
    if (numMatch) {
      const num = parseFloat(numMatch[0].replace(/,/g, ''));
      if (!isNaN(num)) return formatMarketSize(num);
    }
  }
  return '—';
}

/** Detect whether details has v2 structured JSON (vs v1 prose strings) */
export function isV2Report(details: ReportDetailsV2): boolean {
  return typeof details?.problem_clarity === 'object'
    && details.problem_clarity?.who !== undefined;
}

/** Prose fallback for v1 string fields */
function ProseBlock({ text }: { text: string }) {
  if (!text) return <p className="text-sm text-muted-foreground italic">No data available</p>;
  return <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{text}</p>;
}

/** Safely extract display text from a value that might be a string or object.
 *  Prevents React Error #31 (objects rendered as children). */
function safeText(val: unknown): string {
  if (typeof val === 'string') return val;
  if (val == null) return '';
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (typeof val === 'object') {
    const o = val as Record<string, unknown>;
    // Try common known fields in priority order
    const text = o.action || o.assumption || o.title || o.description || o.label || o.question || o.name;
    if (typeof text === 'string' && text) return text;
  }
  return JSON.stringify(val);
}

/** Scroll-reveal wrapper for sections */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollReveal({ delay });
  return (
    <div
      ref={ref}
      className={isVisible
        ? 'opacity-100 translate-y-0 transition-all duration-500 ease-out'
        : 'opacity-0 translate-y-4'}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** Extract CompetitorMatrix data from v2 positioning schema */
function CompetitorMatrixV2({ competition }: { competition: any }) {
  const pos = competition.positioning;
  const positions = pos?.positions || [];
  const founderPos = positions.find((p: any) => p.is_founder);
  // Support both "competitors" and "direct_competitors" keys
  const rawCompetitors = competition.competitors || competition.direct_competitors || [];
  return (
    <CompetitorLuxury
      competitors={rawCompetitors.map((c: any) => {
        const match = positions.find((p: any) => p.name === c.name && !p.is_founder);
        const threat = (c.threat_level || '').toLowerCase();
        return {
          name: c.name,
          threatLevel: threat === 'high' ? 'high' as const : threat === 'medium' ? 'medium' as const : 'low' as const,
          description: c.description,
          strengths: c.swot?.strengths || c.strengths || [],
          weaknesses: c.swot?.weaknesses || c.weaknesses || [],
          position: match ? { x: match.x, y: match.y } : undefined,
        };
      })}
      positioning={pos ? {
        xAxis: pos.x_axis || pos.axis_x || 'Price',
        yAxis: pos.y_axis || pos.axis_y || 'Quality',
        description: pos.description,
        yourPosition: founderPos ? { x: founderPos.x, y: founderPos.y } : { x: 70, y: 70 },
      } : undefined}
      yourEdge={competition.positioning?.description || ''}
      marketGaps={competition.market_gaps || []}
    />
  );
}

const REPORT_TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'problem-customer', label: 'Problem & Customer' },
  { value: 'market-competition', label: 'Market & Competition' },
  { value: 'business', label: 'Business Model' },
  { value: 'risks-plan', label: 'Risks & Plan' },
  { value: 'questions', label: 'Key Questions' },
] as const;

type ReportTab = (typeof REPORT_TABS)[number]['value'];

const VALID_TABS = new Set<string>(REPORT_TABS.map(t => t.value));

/** Prev/Next stepper below each tab's content */
function TabStepper({ currentTab, onNavigate }: { currentTab: string; onNavigate: (tab: string) => void }) {
  const idx = REPORT_TABS.findIndex(t => t.value === currentTab);
  const prev = idx > 0 ? REPORT_TABS[idx - 1] : null;
  const next = idx < REPORT_TABS.length - 1 ? REPORT_TABS[idx + 1] : null;
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
      {prev ? (
        <Button variant="ghost" size="sm" onClick={() => onNavigate(prev.value)} className="gap-1.5">
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous:</span> {prev.label}
        </Button>
      ) : <span />}
      {next ? (
        <Button variant="ghost" size="sm" onClick={() => onNavigate(next.value)} className="gap-1.5">
          <span className="hidden sm:inline">Next:</span> {next.label}
          <ChevronRight className="w-4 h-4" />
        </Button>
      ) : <span />}
    </div>
  );
}

/** Visual page card — wraps each tab's content in a distinct card */
function PageCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6 lg:p-8">
      {children}
    </div>
  );
}

interface ReportV2LayoutProps {
  report: {
    score: number;
    summary: string;
    details: ReportDetailsV2;
    created_at: string;
  };
  companyName?: string;
  startupMeta?: StartupMeta;
  /** Externally controlled active section (e.g. from route params). Falls back to ?tab= query param if omitted. */
  activeSection?: string;
  /** Called when user clicks a tab or stepper button. Required when activeSection is provided. */
  onSectionChange?: (section: string) => void;
}

export function ReportV2Layout({ report, companyName, startupMeta, activeSection, onSectionChange }: ReportV2LayoutProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const tabsAnchorRef = useRef<HTMLDivElement>(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Controlled mode: parent owns section state via props
  // Self-managed mode: component reads/writes ?tab= query param
  const isControlled = activeSection !== undefined && onSectionChange !== undefined;
  const rawTab = isControlled ? activeSection : searchParams.get('tab');
  const activeTab = (rawTab && VALID_TABS.has(rawTab) ? rawTab : 'overview') as ReportTab;

  const handleTabChange = (value: string) => {
    if (isControlled) {
      onSectionChange!(value);
    } else {
      setSearchParams({ tab: value }, { replace: true });
    }
    tabsAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setStickyVisible(!e.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const d = report.details || {};
  const score = report.score;
  const signal = getSignal(score);
  const v2 = isV2Report(d);

  const stickyMetrics = [
    ...(d.market_sizing ? [{ label: 'TAM', value: safeMarketValue(d.market_sizing.tam) }] : []),
    ...(companyName ? [{ label: 'Company', value: companyName }] : []),
  ];

  // ─── Hero data (computed once, used in hero + overview tab) ─────
  const market = d.market_sizing || {};
  const revenue = d.revenue_model;
  const financial = d.financial_projections;
  const mvp = d.technology_stack || d.mvp_scope || {};
  const scoring = d.scores_matrix;
  const competitors = d.competition?.competitors || [];
  const risks = d.risks_assumptions || [];

  const heroMetrics = [
    market.tam ? { label: 'TAM', value: safeMarketValue(market.tam) } : null,
    revenue?.unit_economics?.ltv_cac_ratio ? { label: 'LTV:CAC', value: `${revenue.unit_economics.ltv_cac_ratio.toFixed(1)}x` } : null,
    (mvp.mvp_timeline_weeks || mvp.timeline_weeks) ? { label: 'MVP', value: `${mvp.mvp_timeline_weeks || mvp.timeline_weeks} wk` } : null,
    market.som ? { label: 'SOM', value: safeMarketValue(market.som) } : null,
    financial?.break_even?.months ? { label: 'Break-even', value: `${financial.break_even.months} mo` } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const dimensions = (scoring?.dimensions || []).map((dim: any) => ({
    name: dim.name, score: dim.score, weight: dim.weight,
  }));
  const sorted = [...dimensions].sort((a, b) => b.score - a.score);

  const topThreat = competitors[0] ? {
    name: competitors[0].name,
    threatLevel: (competitors[0].threat_level || 'medium') as string,
    description: competitors[0].description || '',
  } : undefined;

  const fatal = risks.find((r: any) => r.severity === 'fatal');
  const fatalRisk = fatal ? { assumption: fatal.assumption || (typeof fatal === 'string' ? fatal : '') } : undefined;

  // Build VC-grade narrative
  const parts: string[] = [];
  const mvpWeeks = mvp.mvp_timeline_weeks || mvp.timeline_weeks;
  const ratio = revenue?.unit_economics?.ltv_cac_ratio;
  const payback = revenue?.unit_economics?.payback_months;
  const breakEven = financial?.break_even?.months;
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const topComp = competitors[0];
  const fatalItem = risks.find((r: any) => r.severity === 'fatal');
  const highlights: string[] = d.highlights || [];
  const redFlags: string[] = d.red_flags || [];
  const rawVerdict = d.summary_verdict || report.summary || '';
  const verdict = rawVerdict.replace(/^\d+\/100[.\s]*(?:This is a go\.|This is a no-go\.)?\s*/i, '').trim();

  const verdictLine = score >= 75
    ? `${score}/100 — strong opportunity. Ready to move forward.`
    : score >= 60
      ? `${score}/100 — promising idea, but success depends on execution.`
      : score >= 45
        ? `${score}/100 — too many unanswered questions to invest confidently.`
        : `${score}/100 — needs major changes before this business can work.`;
  parts.push(verdict ? `${verdictLine} ${verdict}` : verdictLine);

  const winParts: string[] = [];
  if (market.tam && market.som) {
    winParts.push(`This targets a ${safeMarketValue(market.tam)} market, with a realistic capture opportunity of ${safeMarketValue(market.som)} — large enough to build a real business.`);
  }
  if (highlights.length > 0) {
    winParts.push(highlights[0]);
  }
  if (ratio && ratio >= 3 && payback) {
    winParts.push(`The money math works: every $1 spent acquiring a customer returns $${ratio.toFixed(1)} in revenue, and you'd recover that cost in just ${payback} months. That's a healthy, scalable business from day one.`);
  } else if (ratio && ratio > 0 && payback) {
    winParts.push(`Early-stage economics: every $1 spent on acquiring a customer returns $${ratio.toFixed(1)}, with a ${payback}-month payback. Workable, but margins are thin — this needs to improve as you scale.`);
  }
  if (winParts.length > 0) parts.push(winParts.join(' '));

  const riskParts: string[] = [];
  if (redFlags.length > 0) {
    riskParts.push(redFlags[0]);
  }
  if (fatalItem) {
    riskParts.push(`The biggest risk: ${fatalItem.assumption || safeText(fatalItem)}. If this turns out to be wrong, the entire business model falls apart.`);
  } else if (topComp) {
    riskParts.push(`The biggest competitive threat is ${topComp.name}${topComp.description ? ` — ${topComp.description.toLowerCase()}` : ''}. If a larger player adds this feature for free, it becomes much harder to charge for it as a standalone product.`);
  }
  if (worst && best && worst.name !== best.name) {
    riskParts.push(`${worst.name} is the weakest area at ${worst.score}/100 — this needs serious attention before the business can grow.`);
  }
  if (riskParts.length > 0) parts.push(riskParts.join(' '));

  if (mvpWeeks && breakEven) {
    if (score >= 75) {
      parts.push(`You can build a first version in ${mvpWeeks} weeks and reach profitability in about ${breakEven} months. The opportunity is real — validate your core assumption and move quickly.`);
    } else if (score >= 60) {
      parts.push(`A ${mvpWeeks}-week first version can test whether this works, with profitability expected around ${breakEven} months. Worth pursuing — but resolve the main risk within 90 days or reconsider.`);
    } else {
      parts.push(`You could build a first version in ${mvpWeeks} weeks, but reaching profitability at ${breakEven} months assumes a lot goes right. Run the most critical experiment first, then decide whether to continue.`);
    }
  }

  const analysis = parts.join('\n\n');

  // ─── Section renderers (reused in tabs + print) ─────────────────
  const renderProblemCustomer = () => (
    <div className="flex flex-col gap-8">
      <Reveal>
        <SectionShell id="problem" number={1} title="Problem Clarity" agent="Extractor">
          {v2 ? (
            <ProblemCard
              who={d.problem_clarity.who}
              pain={d.problem_clarity.pain}
              currentFix={d.problem_clarity.current_fix || d.problem_clarity.currentFix}
              severity={d.problem_clarity.severity || 'medium'}
            />
          ) : (
            <ProseBlock text={typeof d.problem_clarity === 'string' ? d.problem_clarity : ''} />
          )}
        </SectionShell>
      </Reveal>
      <Reveal delay={50}>
        <SectionShell id="customer" number={2} title="Customer Use Case" agent="Extractor">
          {v2 && typeof d.customer_use_case === 'object' ? (
            <CustomerPersona
              persona={d.customer_use_case.persona}
              without={d.customer_use_case.without}
              with={d.customer_use_case.with}
              timeSaved={d.customer_use_case.time_saved || d.customer_use_case.timeSaved}
            />
          ) : (
            <ProseBlock text={typeof d.customer_use_case === 'string' ? d.customer_use_case : ''} />
          )}
        </SectionShell>
      </Reveal>
    </div>
  );

  const renderMarketCompetition = () => (
    <div className="flex flex-col gap-8">
      {d.market_sizing && (
        <Reveal>
          <SectionShell id="market" number={3} title="Market Size" agent="Research"
            sourceCount={d.market_sizing.citations?.length}>
            <MarketSizeLuxury
              tam={d.market_sizing.tam}
              sam={d.market_sizing.sam}
              som={d.market_sizing.som}
              methodology={d.market_sizing.methodology}
              growthRate={d.market_sizing.growthRate}
              citations={d.market_sizing.citations}
              scenario={d.market_sizing.scenario}
              captureRate={d.market_sizing.capture_rate}
            />
          </SectionShell>
        </Reveal>
      )}
      {((d.competition?.competitors?.length > 0) || (d.competition?.direct_competitors?.length > 0)) && (
        <Reveal delay={100}>
          <SectionShell id="competition" number={4} title="Competitive Landscape" agent="Competitors"
            sourceCount={d.competition.citations?.length}>
            {v2 && d.competition.positioning ? (
              <CompetitorMatrixV2 competition={d.competition} />
            ) : (
              <div className="space-y-3">
                {(d.competition.competitors || d.competition.direct_competitors || []).map((c: any, i: number) => (
                  <div key={i} className="bg-background rounded-lg p-4 border border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{c.name}</span>
                      <span className="text-xs uppercase text-muted-foreground">{c.threat_level}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                  </div>
                ))}
              </div>
            )}
          </SectionShell>
        </Reveal>
      )}
    </div>
  );

  const renderRisksMvp = () => (
    <div className="flex flex-col gap-8">
      {(d.risks_assumptions?.length > 0) && (
        <Reveal>
          <SectionShell id="risk" number={5} title="Risks & Assumptions" agent="Scoring">
            {typeof d.risks_assumptions?.[0] === 'object' && d.risks_assumptions[0].assumption ? (
              <RiskHeatmap risks={d.risks_assumptions.map((r: any) => ({
                assumption: r.assumption,
                ifWrong: r.if_wrong || r.ifWrong,
                severity: r.severity === 'fatal' ? 'fatal' : r.severity === 'risky' ? 'risky' : 'watch',
                impact: r.impact === 'low' ? 'low' : 'high',
                probability: r.probability === 'low' ? 'low' : 'high',
                howToTest: r.how_to_test || r.howToTest,
              }))} />
            ) : (
              <ul className="space-y-2">
                {(d.risks_assumptions || []).map((r: any, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-warm-foreground mt-2 shrink-0" />
                    {safeText(r)}
                  </li>
                ))}
              </ul>
            )}
          </SectionShell>
        </Reveal>
      )}
      <Reveal delay={50}>
        <SectionShell id="mvp" number={6} title="MVP Scope" agent="MVP">
          {v2 && typeof d.mvp_scope === 'object' ? (
            <MVPScope
              oneLiner={d.mvp_scope.one_liner || d.mvp_scope.oneLiner}
              build={d.mvp_scope.build || []}
              buy={d.mvp_scope.buy || []}
              skipForNow={d.mvp_scope.skip_for_now || d.mvp_scope.skipForNow || []}
              testsAssumption={d.mvp_scope.tests_assumption || d.mvp_scope.testsAssumption}
              successMetric={d.mvp_scope.success_metric || d.mvp_scope.successMetric}
              timelineWeeks={d.mvp_scope.timeline_weeks ?? d.mvp_scope.timelineWeeks ?? 4}
            />
          ) : (
            <ProseBlock text={typeof d.mvp_scope === 'string' ? d.mvp_scope : ''} />
          )}
        </SectionShell>
      </Reveal>
      <Reveal delay={100}>
        <SectionShell id="next-steps" number={7} title="Next Steps" agent="Composer">
          {typeof d.next_steps?.[0] === 'object' && d.next_steps[0].action && d.next_steps[0].timeframe ? (
            <NextStepsTimeline steps={d.next_steps} />
          ) : (
            <ol className="space-y-2 list-decimal list-inside">
              {(d.next_steps || []).map((s: any, i: number) => (
                <li key={i} className="text-sm text-foreground">{safeText(s)}</li>
              ))}
            </ol>
          )}
        </SectionShell>
      </Reveal>
    </div>
  );

  const renderBusiness = () => (
    <div className="flex flex-col gap-8">
      {d.revenue_model && (
        <Reveal>
          <SectionShell id="revenue" number={10} title="Revenue Model" agent="Scoring">
            <RevenueModelDash
              recommended={d.revenue_model.recommended_model}
              description={d.revenue_model.reasoning}
              metrics={[
                { label: 'CAC', value: `$${d.revenue_model.unit_economics?.cac || 0}`, explanation: 'Customer acquisition cost' },
                { label: 'LTV', value: `$${d.revenue_model.unit_economics?.ltv || 0}`, explanation: 'Lifetime value' },
                { label: 'LTV:CAC', value: `${d.revenue_model.unit_economics?.ltv_cac_ratio?.toFixed(1) || '0'}x`, explanation: 'Target > 3x' },
                { label: 'Payback', value: `${d.revenue_model.unit_economics?.payback_months || 0}mo`, explanation: 'Months to recover CAC' },
              ]}
              alternatives={(d.revenue_model.alternatives || []).map((a: any) => ({
                name: a.model,
                pros: a.pros || [],
                cons: a.cons || [],
              }))}
            />
          </SectionShell>
        </Reveal>
      )}
      {d.team_hiring && (
        <Reveal delay={50}>
          <SectionShell id="team" number={11} title="Team & Hiring Plan" agent="MVP">
            <TeamPlanCards
              monthlyBurn={d.team_hiring.monthly_burn}
              burnComparison={`vs $50k typical seed-stage burn`}
              hires={(d.team_hiring.mvp_roles || []).map((r: any) => ({
                priority: r.priority,
                role: r.role,
                costPerMonth: r.monthly_cost,
                description: r.rationale,
              }))}
              gaps={d.team_hiring.current_gaps || []}
            />
          </SectionShell>
        </Reveal>
      )}
    </div>
  );

  const renderQuestions = () => (
    <>
      {d.key_questions?.length > 0 && (
        <Reveal>
          <SectionShell id="questions" number={12} title="Key Questions to Answer" agent="Scoring">
            <KeyQuestionsCards
              questions={(d.key_questions || []).map((q: any) => ({
                question: q.question,
                severity: q.risk_level || 'minor',
                why: q.why_it_matters,
                howToTest: q.validation_method,
              }))}
            />
          </SectionShell>
        </Reveal>
      )}
    </>
  );

  return (
    <>
      {/* Print-only header — hidden on screen, visible in print */}
      <div className="print-header hidden">
        <p className="font-display text-lg" style={{ color: '#0E6249' }}>StartupAI</p>
        <p className="text-sm" style={{ color: '#676F7E' }}>
          Validation Report{report.created_at ? ` — Generated ${new Date(report.created_at).toLocaleDateString()}` : ''}
        </p>
      </div>

      <StickyScoreBar score={score} signal={signal} metrics={stickyMetrics} visible={stickyVisible} />

      <div className="max-w-[1000px] mx-auto px-4 lg:px-8 py-8 flex flex-col gap-8">
        {/* Tabbed sections — tabs at top, screen only */}
        <div ref={tabsAnchorRef}>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="report-tabs no-print">
            <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/50 p-1.5 rounded-lg">
              {REPORT_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 min-w-[120px] text-xs sm:text-sm"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              {/* Hero — overview summary */}
              <div ref={heroRef}>
                <Reveal>
                  <ReportHeroLuxury
                    startupName={startupMeta?.name || companyName}
                    industry={startupMeta?.industry}
                    stage={startupMeta?.stage}
                    tagline={startupMeta?.tagline}
                    score={score}
                    signal={signal}
                    analysis={analysis}
                    metrics={heroMetrics}
                    dimensions={dimensions}
                    topThreat={topThreat}
                    fatalRisk={fatalRisk}
                    revenueModel={revenue?.recommended_model}
                  />
                </Reveal>
              </div>

              {/* BCG-style charts — validation analytics */}
              {dimensions.length > 0 && (
                <PageCard>
                  <div className="grid gap-8 lg:grid-cols-2">
                    <ValidationRadar dimensions={dimensions} />
                    <GapAnalysisBars dimensions={dimensions} />
                  </div>
                </PageCard>
              )}

              {dimensions.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2">
                  <PageCard>
                    <BenchmarkBlocks dimensions={dimensions} overallScore={score} />
                  </PageCard>
                  <PageCard>
                    <MaturityFunnel dimensions={dimensions} />
                  </PageCard>
                </div>
              )}

              <PageCard>
                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Top Strengths */}
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/30 p-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3">Top Strengths</h3>
                    {highlights.length > 0 ? (
                      <ul className="space-y-2">
                        {highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            {safeText(h)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No highlights available</p>
                    )}
                  </div>

                  {/* Top Risks */}
                  <div className="rounded-lg border border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/30 p-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-3">Top Risks</h3>
                    {redFlags.length > 0 ? (
                      <ul className="space-y-2">
                        {redFlags.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            {safeText(r)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No red flags identified</p>
                    )}
                  </div>

                  {/* Next Actions */}
                  <div className="rounded-lg border border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/30 p-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-3">Next Actions</h3>
                    {(d.next_steps?.length > 0) ? (
                      <ol className="space-y-2 list-decimal list-inside">
                        {d.next_steps.slice(0, 3).map((s: any, i: number) => (
                          <li key={i} className="text-sm text-foreground">
                            {safeText(s)}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No next steps defined</p>
                    )}
                  </div>
                </div>
              </PageCard>
              <TabStepper currentTab="overview" onNavigate={handleTabChange} />
            </TabsContent>

            <TabsContent value="problem-customer" className="mt-6">
              <PageCard>{renderProblemCustomer()}</PageCard>
              <TabStepper currentTab="problem-customer" onNavigate={handleTabChange} />
            </TabsContent>

            <TabsContent value="market-competition" className="mt-6">
              <PageCard>{renderMarketCompetition()}</PageCard>
              <TabStepper currentTab="market-competition" onNavigate={handleTabChange} />
            </TabsContent>

            <TabsContent value="business" className="mt-6">
              <PageCard>{renderBusiness()}</PageCard>
              <TabStepper currentTab="business" onNavigate={handleTabChange} />
            </TabsContent>

            <TabsContent value="risks-plan" className="mt-6">
              <PageCard>{renderRisksMvp()}</PageCard>
              <TabStepper currentTab="risks-plan" onNavigate={handleTabChange} />
            </TabsContent>

            <TabsContent value="questions" className="mt-6">
              <PageCard>{renderQuestions()}</PageCard>
              <TabStepper currentTab="questions" onNavigate={handleTabChange} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Print-only: render ALL sections (hidden on screen via CSS, visible in print) */}
        <div className="report-print-sections" aria-hidden="true">
          {renderProblemCustomer()}
          {renderMarketCompetition()}
          {renderBusiness()}
          {renderRisksMvp()}
          {renderQuestions()}
        </div>
      </div>
    </>
  );
}
