/**
 * Validator Report Page
 * Displays verified AI-generated validation report with trace drawer
 * Uses ReportV2Layout for all rendering (handles both v1 prose and v2 structured JSON)
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ReportV2Layout } from '@/components/validator/report/ReportV2Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import type {
  TechnologyAssessment,
  RevenueModelAssessment,
  TeamAssessment,
  KeyQuestion,
  ResourceCategory,
  ScoresMatrixData,
  SWOT,
  FeatureComparison,
  PositioningMatrix,
  FinancialProjections,
} from '@/types/validation-report';
import { toast } from 'sonner';
import ShareDialog from '@/components/sharing/ShareDialog';
import { useValidatorRegenerate } from '@/hooks/useValidatorRegenerate';
import {
  ChevronLeft,
  Download,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  Clock,
  Cpu,
  Search,
  Loader2,
  Printer,
} from 'lucide-react';

export interface StartupMeta {
  name: string;
  industry?: string;
  stage?: string;
  tagline?: string;
  subIndustry?: string;
  businessModel?: string[];
}

interface ReportData {
  id: string;
  session_id: string | null;
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

interface RunTrace {
  agent_name: string;
  model_used: string;
  status: string;
  started_at: string;
  finished_at: string;
  duration_ms: number;
  citations: Array<{ title: string; url: string }>;
}

export default function ValidatorReport() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<ReportData | null>(null);
  const [startupId, setStartupId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | undefined>();
  const [startupMeta, setStartupMeta] = useState<StartupMeta | undefined>();
  const [traces, setTraces] = useState<RunTrace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const { regenerate, isRegenerating } = useValidatorRegenerate();

  const handleExport = useCallback(async () => {
    if (!report) return;
    setIsExporting(true);
    try {
      const { exportValidationReportPDF } = await import('@/lib/validationReportPdf');
      await exportValidationReportPDF(report, companyName);
      toast.success('PDF downloaded');
    } catch (e) {
      console.error('PDF export error:', e);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  }, [report, companyName]);

  useEffect(() => {
    if (!reportId) return;

    async function fetchReport() {
      try {
        const { data: reportData, error: reportError } = await supabase
          .from('validator_reports')
          .select('*')
          .eq('id', reportId)
          .single();

        if (reportError) throw reportError;

        // FIX: Gemini occasionally wraps JSON in an array [{}] — unwrap to object
        const rawDetails = reportData.details;
        const safeDetails = (Array.isArray(rawDetails) ? rawDetails[0] : rawDetails) || {};
        setReport({
          id: reportData.id,
          session_id: reportData.session_id,
          score: reportData.score || 0,
          summary: reportData.summary || safeDetails.summary_verdict || '',
          verified: reportData.verified || false,
          verification_json: reportData.verification_json as ReportData['verification_json'],
          details: safeDetails as ReportData['details'],
          created_at: reportData.created_at,
        });

        if (reportData.startup_id) setStartupId(reportData.startup_id);

        if (reportData.startup_id) {
          const { data: startup } = await supabase
            .from('startups')
            .select('name, industry, stage, tagline, sub_industry, business_model')
            .eq('id', reportData.startup_id)
            .single();
          if (startup?.name) {
            setCompanyName(startup.name);
            setStartupMeta({
              name: startup.name,
              industry: startup.industry ?? undefined,
              stage: startup.stage ?? undefined,
              tagline: startup.tagline ?? undefined,
              subIndustry: startup.sub_industry ?? undefined,
              businessModel: startup.business_model ?? undefined,
            });
          }
        }

        if (reportData.session_id) {
          const { data: runsData } = await supabase
            .from('validator_runs')
            .select('*')
            .eq('session_id', reportData.session_id)
            .order('created_at', { ascending: true });

          setTraces((runsData || []).map((run: any) => ({
            agent_name: run.agent_name,
            model_used: run.model_used,
            status: run.status,
            started_at: run.started_at,
            finished_at: run.finished_at,
            duration_ms: run.duration_ms,
            citations: Array.isArray(run.citations) ? run.citations : [],
          })));
        }
      } catch (e) {
        console.error('Fetch error:', e);
        setError('Failed to load report');
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [reportId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !report) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <AlertTriangle className="w-16 h-16 text-destructive" />
          <h1 className="text-xl font-semibold">{error || 'Report not found'}</h1>
          <Button onClick={() => navigate('/validator')}>Back to Validator</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header controls */}
      <div className="max-w-[1000px] mx-auto px-4 lg:px-8 pt-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Button variant="ghost" onClick={() => navigate('/validator')}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Regenerate */}
            <Button
              variant="outline"
              size="sm"
              disabled={isRegenerating || !report?.session_id}
              onClick={() => report?.session_id && regenerate(report.session_id)}
            >
              {isRegenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {isRegenerating ? 'Regenerating...' : 'Regenerate'}
            </Button>

            {/* Trace Drawer */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Cpu className="w-4 h-4 mr-2" />
                  Trace
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Agent Execution Trace</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {traces.map((trace, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{trace.agent_name}</span>
                        <Badge variant={trace.status === 'ok' ? 'default' : 'destructive'}>
                          {trace.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-3 h-3" />
                          {trace.model_used}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {trace.duration_ms ? `${(trace.duration_ms / 1000).toFixed(1)}s` : 'N/A'}
                        </div>
                        {trace.citations?.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Search className="w-3 h-3" />
                            {trace.citations.length} citations
                          </div>
                        )}
                      </div>
                      {trace.citations?.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {trace.citations.slice(0, 3).map((c, i) => (
                            <a
                              key={i}
                              href={c.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {c.title || c.url}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            <Button variant="outline" size="sm" onClick={() => window.print()} className="no-print">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>

            <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </Button>

            {startupId && (
              <ShareDialog reportId={reportId!} startupId={startupId} />
            )}
          </div>
        </div>
      </div>

      {/* V2 Report Layout — handles both v1 (prose) and v2 (structured JSON) */}
      <ReportV2Layout report={report} companyName={companyName} startupMeta={startupMeta} />
    </DashboardLayout>
  );
}
