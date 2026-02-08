 /**
  * Validator Report Page
  * Displays verified AI-generated validation report with trace drawer
  */
 
 import { useState, useEffect, useCallback } from 'react';
 import { useParams, useNavigate } from 'react-router-dom';
 import { motion } from 'framer-motion';
 import DashboardLayout from '@/components/layout/DashboardLayout';
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
} from '@/types/validation-report';
 import { toast } from 'sonner';
import TAMSAMSOMChart from '@/components/validation-report/TAMSAMSOMChart';
import DimensionScoresChart from '@/components/validation-report/DimensionScoresChart';
import FactorsBreakdownCard from '@/components/validation-report/FactorsBreakdownCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import type { MarketFactor, ExecutionFactor } from '@/types/validation-report';
// PDF export is dynamically imported on demand to avoid bundling jsPDF (~150KB) in the initial load
import {
   ChevronLeft,
   ChevronDown,
   Shield,
   Download,
   RefreshCw,
   CheckCircle2,
   AlertTriangle,
   ExternalLink,
   Clock,
   Cpu,
   Search,
   TrendingUp,
   Flag,
   ArrowRight,
   Lightbulb,
   Loader2,
 } from 'lucide-react';
import { useReportPanelDetail } from '@/hooks/useReportPanelDetail';
import ReportRightPanel from '@/components/validator/ReportRightPanel';
 
 // deno-lint-ignore-file no-explicit-any
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
   // P02: 7 new sections
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
   const [companyName, setCompanyName] = useState<string | undefined>();
   const [traces, setTraces] = useState<RunTrace[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [isExporting, setIsExporting] = useState(false);
   const [panelOpen, setPanelOpen] = useState(false);
   const [selectedSection, setSelectedSection] = useState<number | null>(null);
   const [selectedSectionTitle, setSelectedSectionTitle] = useState<string | null>(null);
   const { loading: panelLoading, error: panelError, data: panelData, fetchPanelDetail } = useReportPanelDetail();

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

   const handleSectionInfoClick = useCallback((sectionNumber: number) => {
     if (!report) return;
     const d = report.details;
     const sectionMap: Record<number, { title: string; content: string }> = {
       1: { title: 'Problem Clarity', content: d.problem_clarity || '' },
       2: { title: 'Customer Use Case', content: d.customer_use_case || '' },
       3: { title: 'Market Sizing', content: d.market_sizing ? `TAM: ${d.market_sizing.tam}, SAM: ${d.market_sizing.sam}, SOM: ${d.market_sizing.som}` : '' },
       4: { title: 'Competition Deep Dive', content: d.competition?.competitors?.map(c => `${c.name}: ${c.description}`).join('; ') || '' },
       5: { title: 'Risks & Assumptions', content: d.risks_assumptions?.join('; ') || '' },
       6: { title: 'MVP Scope', content: d.mvp_scope || '' },
       7: { title: 'Next Steps', content: d.next_steps?.join('; ') || '' },
       8: { title: 'Scores Matrix', content: d.scores_matrix ? `Overall: ${d.scores_matrix.overall_weighted}/100` : '' },
       9: { title: 'Technology Stack', content: d.technology_stack?.feasibility_rationale || '' },
       10: { title: 'Revenue Model', content: d.revenue_model ? `${d.revenue_model.recommended_model}: ${d.revenue_model.reasoning || ''}` : '' },
       11: { title: 'Team & Hiring', content: d.team_hiring?.current_gaps?.join(', ') || '' },
       12: { title: 'Key Questions', content: d.key_questions?.map(q => q.question).join('; ') || '' },
       13: { title: 'Resources & Links', content: d.resources_links?.map(c => c.category).join(', ') || '' },
       14: { title: 'Financial Projections', content: d.financial_projections?.key_assumption || '' },
     };
     const section = sectionMap[sectionNumber];
     if (!section) return;

     setSelectedSection(sectionNumber);
     setSelectedSectionTitle(section.title);
     setPanelOpen(true);

     const dimScore = d.dimension_scores ? Object.values(d.dimension_scores)[sectionNumber - 1] : undefined;
     fetchPanelDetail(report.id, sectionNumber, section.title, section.content, report.score, dimScore);
   }, [report, fetchPanelDetail]);

   useEffect(() => {
     if (!reportId) return;

     async function fetchReport() {
       try {
         // Fetch report
         const { data: reportData, error: reportError } = await supabase
           .from('validation_reports')
           .select('*')
           .eq('id', reportId)
           .single();
 
         if (reportError) throw reportError;
 
         // Transform data safely
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

         // Fetch company name for PDF export
         if (reportData.startup_id) {
           const { data: startup } = await supabase
             .from('startups')
             .select('name')
             .eq('id', reportData.startup_id)
             .single();
           if (startup?.name) setCompanyName(startup.name);
         }
 
         // Fetch traces if session_id exists
         if (reportData.session_id) {
           const { data: runsData } = await supabase
             .from('validator_runs')
             .select('*')
             .eq('session_id', reportData.session_id)
             .order('created_at', { ascending: true });
 
           // Transform traces safely
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
 
   const verdict = getVerdict(report.score);
   const details = report.details;
 
   return (
     <DashboardLayout>
       <div className="max-w-[1300px] mx-auto p-6 space-y-8">
         {/* Header */}
         <div className="flex items-center justify-between">
           <Button variant="ghost" onClick={() => navigate('/validator')}>
             <ChevronLeft className="w-4 h-4 mr-1" />
             Back
           </Button>
 
           <div className="flex items-center gap-2">
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
                       {/* Show citations */}
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
 
             <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
               {isExporting ? (
                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
               ) : (
                 <Download className="w-4 h-4 mr-2" />
               )}
               {isExporting ? 'Exporting...' : 'Export PDF'}
             </Button>
           </div>
         </div>
 
         {/* Score Card */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="card-premium p-8"
         >
           <div className="flex flex-col md:flex-row items-center gap-8">
             {/* Score Circle */}
             <div className="relative flex-shrink-0">
               <svg className="w-40 h-40 -rotate-90">
                 <circle
                   cx="80" cy="80" r="70"
                   stroke="currentColor"
                   strokeWidth="12"
                   fill="none"
                   className="text-muted"
                 />
                 <circle
                   cx="80" cy="80" r="70"
                   stroke="url(#scoreGradient)"
                   strokeWidth="12"
                   fill="none"
                   strokeLinecap="round"
                   strokeDasharray={2 * Math.PI * 70}
                   strokeDashoffset={2 * Math.PI * 70 * (1 - report.score / 100)}
                 />
                 <defs>
                   <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
                 {report.verified ? (
                   <Badge className="bg-emerald-500/10 text-emerald-500">
                     <Shield className="w-3 h-3 mr-1" />
                     AI Verified
                   </Badge>
                 ) : (
                   <Badge variant="outline" className="text-amber-500">
                     <AlertTriangle className="w-3 h-3 mr-1" />
                     Unverified
                   </Badge>
                 )}
               </div>
               <p className="text-lg text-foreground">{details.summary_verdict}</p>
               <p className="text-sm text-muted-foreground">
                 Generated {new Date(report.created_at).toLocaleString()}
               </p>
             </div>
           </div>
         </motion.div>
 
         {/* Highlights / Red Flags / Next Steps Summary Card */}
         {(details.highlights?.length || details.red_flags?.length || details.next_steps?.length) && (
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="grid grid-cols-1 md:grid-cols-3 gap-4"
           >
             {/* Highlights */}
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
                 {!details.highlights?.length && (
                   <li className="text-sm text-muted-foreground italic">Run a new report to see strengths</li>
                 )}
               </ul>
             </div>

             {/* Red Flags */}
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
                 {!details.red_flags?.length && (
                   <li className="text-sm text-muted-foreground italic">Run a new report to see concerns</li>
                 )}
               </ul>
             </div>

             {/* Next Steps */}
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

         {/* Report Content with Collapsible Right Panel */}
         <div className="flex gap-6">
          {/* Right Panel Intelligence */}
          <ReportRightPanel
            isOpen={panelOpen}
            onClose={() => setPanelOpen(false)}
            sectionNumber={selectedSection}
            sectionTitle={selectedSectionTitle}
            data={panelData}
            loading={panelLoading}
            error={panelError}
          />

          {/* Panel Toggle Button (floating right) */}
          {!panelOpen && (
            <button
              onClick={() => setPanelOpen(true)}
              className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-30 items-center gap-1 px-2 py-3 rounded-l-lg border border-border bg-card shadow-md text-muted-foreground hover:text-foreground transition-colors"
              title="Show details panel"
            >
              <Lightbulb className="w-4 h-4" />
            </button>
          )}

          {/* Main Report Content */}
          <div className="flex-1 min-w-0 grid gap-6">
           {/* Problem Clarity */}
           <ReportSection
             number={1}
             title="Problem Clarity"
             content={details.problem_clarity}
             agent="ExtractorAgent"
             verified={report.verified}
             onInfoClick={handleSectionInfoClick}
           />
 
           {/* Customer Use Case */}
           <ReportSection
             number={2}
             title="Customer Use Case"
             content={details.customer_use_case}
             agent="ExtractorAgent"
             verified={report.verified}
             onInfoClick={handleSectionInfoClick}
           />
 
           {/* Market Sizing */}
           <ReportSection
             number={3}
             title="Market Sizing"
             agent="ResearchAgent"
             verified={report.verified}
             citations={details.market_sizing?.citations}
             onInfoClick={handleSectionInfoClick}
           >
             {details.market_sizing && (
               <div className="mt-4">
                 <TAMSAMSOMChart
                   data={{
                     tam: details.market_sizing.tam || 0,
                     sam: details.market_sizing.sam || 0,
                     som: details.market_sizing.som || 0,
                   }}
                   className="border-0 shadow-none p-0"
                 />
               </div>
             )}
           </ReportSection>
 
           {/* Competition Deep Dive */}
           <ReportSection
             number={4}
             title="Competition Deep Dive"
             agent="CompetitorAgent"
             verified={report.verified}
             citations={details.competition?.citations}
             onInfoClick={handleSectionInfoClick}
           >
             <div className="space-y-6 mt-4">
               {/* Competitors list */}
               <div className="space-y-3">
                 {details.competition?.competitors?.map((comp, i) => (
                   <div key={i} className="p-3 bg-muted/50 rounded-lg flex items-center justify-between">
                     <div>
                       <span className="font-medium text-foreground">{comp.name}</span>
                       <p className="text-sm text-muted-foreground">{comp.description}</p>
                     </div>
                     <Badge variant={
                       comp.threat_level === 'high' ? 'destructive' :
                       comp.threat_level === 'medium' ? 'default' : 'secondary'
                     }>
                       {comp.threat_level}
                     </Badge>
                   </div>
                 ))}
               </div>

               {/* SWOT Analysis */}
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
                               <li key={i} className="text-sm text-muted-foreground">• {item}</li>
                             ))}
                           </ul>
                         </div>
                       );
                     })}
                   </div>
                 </div>
               )}

               {/* Feature Comparison Table */}
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
                     {/* Axis labels */}
                     <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                       {details.competition.positioning.x_axis} →
                     </span>
                     <span className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-muted-foreground">
                       {details.competition.positioning.y_axis} →
                     </span>
                     {/* Grid lines */}
                     <div className="absolute inset-6 border-l border-b border-border/50">
                       <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-border/30" />
                       <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-border/30" />
                     </div>
                     {/* Plot positions */}
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
           </ReportSection>
 
           {/* Risks & Assumptions */}
           <ReportSection
             number={5}
             title="Risks & Assumptions"
             agent="ScoringAgent"
             verified={report.verified}
             onInfoClick={handleSectionInfoClick}
           >
             <ul className="list-disc list-inside space-y-2 mt-4 text-muted-foreground">
               {details.risks_assumptions?.map((risk, i) => (
                 <li key={i}>{risk}</li>
               ))}
             </ul>
           </ReportSection>
 
           {/* MVP Scope */}
           <ReportSection
             number={6}
             title="MVP Scope"
             content={details.mvp_scope}
             agent="MVPAgent"
             verified={report.verified}
             onInfoClick={handleSectionInfoClick}
           />
 
           {/* Next Steps */}
           <ReportSection
             number={7}
             title="Next Steps"
             agent="MVPAgent"
             verified={report.verified}
             onInfoClick={handleSectionInfoClick}
           >
             <ol className="list-decimal list-inside space-y-2 mt-4 text-muted-foreground">
               {details.next_steps?.map((step, i) => (
                 <li key={i}>{step}</li>
               ))}
             </ol>
           </ReportSection>

           {/* P02: Section 8 — Scores Matrix */}
           {(details.scores_matrix || details.market_factors || details.execution_factors) && (
             <ReportSection
               number={8}
               title="Scores Matrix"
               agent="ScoringAgent"
               verified={report.verified}
               onInfoClick={handleSectionInfoClick}
             >
               {details.scores_matrix && (
                 <>
                   <div className="flex items-center gap-3 mt-4 mb-4 p-3 bg-muted/50 rounded-lg">
                     <span className="text-2xl font-bold text-foreground">
                       {details.scores_matrix.overall_weighted}
                     </span>
                     <span className="text-sm text-muted-foreground">/100 weighted score</span>
                   </div>
                   {details.scores_matrix.dimensions?.length > 0 && (
                     <DimensionScoresChart
                       scores={details.scores_matrix.dimensions.map(dim => ({
                         ...dim,
                         factors: [],
                       }))}
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
             </ReportSection>
           )}

           {/* P02: Section 9 — Technology Stack */}
           {details.technology_stack && (
             <ReportSection
               number={9}
               title="Technology Stack"
               agent="ComposerAgent"
               verified={report.verified}
               onInfoClick={handleSectionInfoClick}
             >
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
                     <span className="text-sm text-muted-foreground">
                       MVP: ~{details.technology_stack.mvp_timeline_weeks} weeks
                     </span>
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
             </ReportSection>
           )}

           {/* P02: Section 10 — Revenue Model */}
           {details.revenue_model && (
             <ReportSection
               number={10}
               title="Revenue Model"
               agent="ComposerAgent"
               verified={report.verified}
               onInfoClick={handleSectionInfoClick}
             >
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
             </ReportSection>
           )}

           {/* P02: Section 11 — Team & Hiring */}
           {details.team_hiring && (
             <ReportSection
               number={11}
               title="Team & Hiring"
               agent="ComposerAgent"
               verified={report.verified}
               onInfoClick={handleSectionInfoClick}
             >
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
                               <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">
                                 {role.priority}
                               </span>
                               <span className="font-medium text-foreground">{role.role}</span>
                             </div>
                             <p className="text-xs text-muted-foreground mt-1 ml-8">{role.rationale}</p>
                           </div>
                           <span className="text-sm font-medium text-foreground ml-3">
                             {formatCurrency(role.monthly_cost)}/mo
                           </span>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
                 {details.team_hiring.advisory_needs?.length > 0 && (
                   <div>
                     <h4 className="text-sm font-medium text-muted-foreground mb-2">Advisory Needs</h4>
                     <ul className="text-sm text-muted-foreground space-y-1">
                       {details.team_hiring.advisory_needs.map((need, i) => (
                         <li key={i}>• {need}</li>
                       ))}
                     </ul>
                   </div>
                 )}
               </div>
             </ReportSection>
           )}

           {/* P02: Section 12 — Key Questions */}
           {details.key_questions && details.key_questions.length > 0 && (
             <ReportSection
               number={12}
               title="Key Questions"
               agent="ComposerAgent"
               verified={report.verified}
               onInfoClick={handleSectionInfoClick}
             >
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
             </ReportSection>
           )}

           {/* P02: Section 13 — Resources & Links */}
           {details.resources_links && details.resources_links.length > 0 && (
             <ReportSection
               number={13}
               title="Resources & Links"
               agent="ResearchAgent"
               verified={report.verified}
               onInfoClick={handleSectionInfoClick}
             >
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
                             {link.description && (
                               <p className="text-xs text-muted-foreground">{link.description}</p>
                             )}
                           </div>
                         </a>
                       ))}
                     </div>
                   </div>
                 ))}
               </div>
             </ReportSection>
           )}

           {/* P02: Section 14 — Financial Projections */}
           {details.financial_projections && (
             <ReportSection
               number={14}
               title="Financial Projections"
               agent="ComposerAgent"
               verified={report.verified}
               onInfoClick={handleSectionInfoClick}
             >
               <div className="mt-4 space-y-6">
                 {/* Key Assumption Warning */}
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
                                 <linearGradient key={s.name} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
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
                               <Area
                                 key={s.name}
                                 type="monotone"
                                 dataKey={s.name}
                                 stroke={colors[i % colors.length]}
                                 fill={`url(#grad-${i})`}
                                 strokeWidth={2}
                               />
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
                     {/* Scenario Assumptions */}
                     {details.financial_projections.scenarios.map((s, i) => (
                       s.assumptions?.length > 0 && (
                         <div key={i} className="mt-3">
                           <span className="text-xs font-medium text-muted-foreground">{s.name} assumptions:</span>
                           <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                             {s.assumptions.map((a, j) => <li key={j}>• {a}</li>)}
                           </ul>
                         </div>
                       )
                     ))}
                   </div>
                 )}

                 {/* Monthly Y1 Breakdown */}
                 {details.financial_projections.monthly_y1?.length > 0 && (
                   <div>
                     <h4 className="text-sm font-medium text-foreground mb-3">Year 1 Monthly Growth</h4>
                     <div className="flex items-end gap-1 h-32">
                       {details.financial_projections.monthly_y1?.map((m, i) => {
                         const maxRev = Math.max(...(details.financial_projections?.monthly_y1 ?? []).map(x => x.revenue));
                         const height = maxRev > 0 ? (m.revenue / maxRev) * 100 : 0;
                         return (
                           <div key={i} className="flex-1 flex flex-col items-center gap-1">
                             <span className="text-[9px] text-muted-foreground">{formatCurrency(m.revenue)}</span>
                             <div
                               className="w-full bg-primary/80 rounded-t"
                               style={{ height: `${Math.max(height, 2)}%` }}
                             />
                             <span className="text-[10px] text-muted-foreground">M{m.month}</span>
                           </div>
                         );
                       })}
                     </div>
                     <div className="flex items-end gap-1 mt-2">
                       {details.financial_projections.monthly_y1?.map((m, i) => (
                         <div key={i} className="flex-1 text-center">
                           <span className="text-[9px] text-muted-foreground">{m.users}u</span>
                         </div>
                       ))}
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
                     {details.financial_projections.break_even.assumptions && (
                       <p className="col-span-2 text-xs text-muted-foreground">
                         Assumes: {details.financial_projections.break_even.assumptions}
                       </p>
                     )}
                   </div>
                 )}
               </div>
             </ReportSection>
           )}
         </div>
         {/* End main report content + sections grid */}
         </div>
         {/* End 2-column layout */}

         {/* Verification warnings */}
         {report.verification_json?.warnings?.length > 0 && (
           <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
             <h3 className="font-medium text-amber-500 mb-2">Verification Warnings</h3>
             <ul className="text-sm text-amber-400 space-y-1">
               {report.verification_json.warnings.map((w, i) => (
                 <li key={i}>• {w}</li>
               ))}
             </ul>
           </div>
         )}
       </div>
     </DashboardLayout>
   );
 }
 
 // Report Section Component — collapsible
 interface ReportSectionProps {
   number: number;
   title: string;
   content?: string;
   agent: string;
   verified: boolean;
   citations?: string[];
   children?: React.ReactNode;
   defaultOpen?: boolean;
   onInfoClick?: (n: number) => void;
 }

 function ReportSection({ number, title, content, agent, verified, citations, children, defaultOpen = true, onInfoClick }: ReportSectionProps) {
   const [isOpen, setIsOpen] = useState(defaultOpen);

   return (
     <motion.div
       id={`section-${number}`}
       initial={{ opacity: 0, y: 10 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: number * 0.05 }}
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
               {agent}
             </Badge>
           )}
           {citations && citations.length > 0 && (
             <Badge variant="secondary" className="text-xs">
               {citations.length} sources
             </Badge>
           )}
           {onInfoClick && (
             <span
               role="button"
               tabIndex={0}
               onClick={(e) => { e.stopPropagation(); onInfoClick(number); }}
               onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); onInfoClick(number); } }}
               className="hidden lg:flex w-8 h-8 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:scale-110 transition-all duration-200 cursor-pointer"
               title="Show deeper context"
             >
               <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
                 <path d="M247.355,106.9C222.705,82.241,205.833,39.18,197.46,0c-8.386,39.188-25.24,82.258-49.899,106.917c-24.65,24.642-67.724,41.514-106.896,49.904c39.188,8.373,82.254,25.235,106.904,49.895c24.65,24.65,41.522,67.72,49.908,106.9c8.373-39.188,25.24-82.258,49.886-106.917c24.65-24.65,67.724-41.514,106.896-49.904C315.08,148.422,272.014,131.551,247.355,106.9z"/>
                 <path d="M407.471,304.339c-14.714-14.721-24.81-40.46-29.812-63.864c-5.011,23.404-15.073,49.142-29.803,63.872c-14.73,14.714-40.464,24.801-63.864,29.812c23.408,5.01,49.134,15.081,63.864,29.811c14.73,14.722,24.81,40.46,29.82,63.864c5.001-23.413,15.081-49.142,29.802-63.872c14.722-14.722,40.46-24.802,63.856-29.82C447.939,329.14,422.201,319.061,407.471,304.339z"/>
                 <path d="M146.352,354.702c-4.207,19.648-12.655,41.263-25.019,53.626c-12.362,12.354-33.968,20.82-53.613,25.027c19.645,4.216,41.251,12.656,53.613,25.027c12.364,12.362,20.829,33.96,25.036,53.618c4.203-19.658,12.655-41.255,25.023-53.626c12.354-12.362,33.964-20.82,53.605-25.035c-19.64-4.2-41.251-12.656-53.613-25.019C159.024,395.966,150.555,374.351,146.352,354.702z"/>
               </svg>
             </span>
           )}
           <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
         </div>
       </button>
       {isOpen && (
         <div className="px-6 pb-6">
           {content && (
             <p className="text-muted-foreground whitespace-pre-line">{content}</p>
           )}
           {children}
         </div>
       )}
     </motion.div>
   );
 }