/**
 * Validator Report Page
 * Displays verified AI-generated validation report with trace drawer
 * Uses ReportV2Layout for all rendering (handles both v1 prose and v2 structured JSON)
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import type {
  ReportDetailsV2,
} from '@/types/validation-report';
import { toast } from 'sonner';
import ShareDialog from '@/components/sharing/ShareDialog';
import { useValidatorRegenerate } from '@/hooks/useValidatorRegenerate';
import { useGenerateCanvasFromReport, useLeanCanvas } from '@/hooks/useLeanCanvas';
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
  LayoutGrid,
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
  score: number | null;
  summary: string;
  verified: boolean;
  verification_json: {
    verified: boolean;
    warnings: string[];
    missing_sections: string[];
    failed_agents: string[];
    section_mappings: Record<string, string>;
  } | null;
  details: ReportDetailsV2;
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
  const { reportId, section } = useParams<{ reportId: string; section?: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [report, setReport] = useState<ReportData | null>(null);
  const [startupId, setStartupId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | undefined>();
  const [startupMeta, setStartupMeta] = useState<StartupMeta | undefined>();
  const [traces, setTraces] = useState<RunTrace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showOverwriteDialog, setShowOverwriteDialog] = useState(false);
  const { regenerate, isRegenerating } = useValidatorRegenerate();
  const generateCanvas = useGenerateCanvasFromReport();
  const { data: existingCanvas } = useLeanCanvas(startupId ?? undefined);

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

  const handleGenerateCanvas = useCallback(async (overwrite = false) => {
    if (!reportId || !startupId) return;

    // If canvas exists and user hasn't confirmed overwrite, show dialog
    if (existingCanvas && !overwrite) {
      setShowOverwriteDialog(true);
      return;
    }

    try {
      await generateCanvas.mutateAsync({
        reportId,
        startupId,
        existingCanvasId: overwrite && existingCanvas ? existingCanvas.id : undefined,
      });
      toast.success('Lean Canvas generated from report');
      navigate('/lean-canvas');
    } catch (e) {
      console.error('Canvas generation error:', e);
      toast.error(e instanceof Error ? e.message : 'Failed to generate canvas');
    }
  }, [reportId, startupId, existingCanvas, generateCanvas, navigate]);

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
          score: reportData.score ?? null,
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

  // Route-based section: /validator/report/:reportId/:section?
  // Also supports legacy ?tab= query param for backward compat
  const activeSection = section || searchParams.get('tab') || 'overview';
  const handleSectionChange = (newSection: string) => {
    navigate(`/validator/report/${reportId}/${newSection}`, { replace: true });
  };

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

            {/* Generate Lean Canvas */}
            {startupId && (
              <Button
                variant="outline"
                size="sm"
                disabled={generateCanvas.isPending}
                onClick={() => handleGenerateCanvas()}
              >
                {generateCanvas.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <LayoutGrid className="w-4 h-4 mr-2" />
                )}
                {generateCanvas.isPending ? 'Generating...' : 'Generate Canvas'}
              </Button>
            )}

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

      {/* U-02: Incomplete report banner when agents failed */}
      {report.verification_json?.failed_agents && report.verification_json.failed_agents.length > 0 && (
        <div className="max-w-[1000px] mx-auto px-4 lg:px-8 mt-4">
          <div className="flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-600 dark:text-amber-400">
                Generation incomplete
              </p>
              <p className="text-muted-foreground mt-1">
                {report.verification_json.failed_agents.length === 1
                  ? `The ${report.verification_json.failed_agents[0]} agent did not complete successfully.`
                  : `${report.verification_json.failed_agents.length} agents did not complete successfully: ${report.verification_json.failed_agents.join(', ')}.`}
                {' '}Some sections may contain placeholder data. You can regenerate the report to retry.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* V2 Report Layout — handles both v1 (prose) and v2 (structured JSON) */}
      <ReportV2Layout
        report={report}
        companyName={companyName}
        startupMeta={startupMeta}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Overwrite Canvas Confirmation Dialog */}
      <AlertDialog open={showOverwriteDialog} onOpenChange={setShowOverwriteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Overwrite existing canvas?</AlertDialogTitle>
            <AlertDialogDescription>
              A Lean Canvas already exists for this startup. Generating a new one from this report will replace the current canvas data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleGenerateCanvas(true)}>
              Overwrite
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
