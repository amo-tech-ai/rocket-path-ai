 /**
  * Validator Report Page
  * Displays verified AI-generated validation report with trace drawer
  */
 
 import { useState, useEffect } from 'react';
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
 import { formatMarketSize } from '@/types/validation-report';
 import { 
   ChevronLeft, 
   Shield, 
   Download,
   RefreshCw,
   CheckCircle2,
   AlertTriangle,
   ExternalLink,
   Clock,
   Cpu,
   Search
 } from 'lucide-react';
 
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
     summary_verdict: string;
     problem_clarity: string;
     customer_use_case: string;
     market_sizing: { tam: number; sam: number; som: number; citations: string[] };
     competition: { competitors: Array<{ name: string; description: string; threat_level: string }>; citations: string[] };
     risks_assumptions: string[];
     mvp_scope: string;
     next_steps: string[];
     dimension_scores?: Record<string, number>;
     market_factors?: Array<{ name: string; score: number; description: string; status: string }>;
     execution_factors?: Array<{ name: string; score: number; description: string; status: string }>;
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
   const [traces, setTraces] = useState<RunTrace[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
 
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
         setReport({
           id: reportData.id,
           session_id: reportData.session_id,
           score: reportData.score || 0,
           summary: reportData.summary || '',
           verified: reportData.verified || false,
           verification_json: reportData.verification_json as ReportData['verification_json'],
           details: (reportData.details || {}) as ReportData['details'],
           created_at: reportData.created_at,
         });
 
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
       <div className="max-w-[1100px] mx-auto p-6 space-y-8">
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
 
             <Button variant="outline" size="sm" disabled>
               <Download className="w-4 h-4 mr-2" />
               Export
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
 
         {/* Report Sections */}
         <div className="grid gap-6">
           {/* Problem Clarity */}
           <ReportSection
             number={1}
             title="Problem Clarity"
             content={details.problem_clarity}
             agent="ExtractorAgent"
             verified={report.verified}
           />
 
           {/* Customer Use Case */}
           <ReportSection
             number={2}
             title="Customer Use Case"
             content={details.customer_use_case}
             agent="ExtractorAgent"
             verified={report.verified}
           />
 
           {/* Market Sizing */}
           <ReportSection
             number={3}
             title="Market Sizing"
             agent="ResearchAgent"
             verified={report.verified}
             citations={details.market_sizing?.citations}
           >
             <div className="grid grid-cols-3 gap-4 mt-4">
               <div className="text-center p-4 bg-muted/50 rounded-lg">
                 <p className="text-2xl font-bold text-foreground">
                   {formatMarketSize(details.market_sizing?.tam || 0)}
                 </p>
                 <p className="text-sm text-muted-foreground">TAM</p>
               </div>
               <div className="text-center p-4 bg-muted/50 rounded-lg">
                 <p className="text-2xl font-bold text-foreground">
                   {formatMarketSize(details.market_sizing?.sam || 0)}
                 </p>
                 <p className="text-sm text-muted-foreground">SAM</p>
               </div>
               <div className="text-center p-4 bg-muted/50 rounded-lg">
                 <p className="text-2xl font-bold text-foreground">
                   {formatMarketSize(details.market_sizing?.som || 0)}
                 </p>
                 <p className="text-sm text-muted-foreground">SOM</p>
               </div>
             </div>
           </ReportSection>
 
           {/* Competition */}
           <ReportSection
             number={4}
             title="Competition"
             agent="CompetitorAgent"
             verified={report.verified}
             citations={details.competition?.citations}
           >
             <div className="space-y-3 mt-4">
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
           </ReportSection>
 
           {/* Risks & Assumptions */}
           <ReportSection
             number={5}
             title="Risks & Assumptions"
             agent="ScoringAgent"
             verified={report.verified}
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
           />
 
           {/* Next Steps */}
           <ReportSection
             number={7}
             title="Next Steps"
             agent="MVPAgent"
             verified={report.verified}
           >
             <ol className="list-decimal list-inside space-y-2 mt-4 text-muted-foreground">
               {details.next_steps?.map((step, i) => (
                 <li key={i}>{step}</li>
               ))}
             </ol>
           </ReportSection>
         </div>
 
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
 
 // Report Section Component
 interface ReportSectionProps {
   number: number;
   title: string;
   content?: string;
   agent: string;
   verified: boolean;
   citations?: string[];
   children?: React.ReactNode;
 }
 
 function ReportSection({ number, title, content, agent, verified, citations, children }: ReportSectionProps) {
   return (
     <motion.div
       initial={{ opacity: 0, y: 10 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: number * 0.05 }}
       className="card-premium p-6"
     >
       <div className="flex items-center justify-between mb-4">
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
         </div>
       </div>
       {content && (
         <p className="text-muted-foreground whitespace-pre-line">{content}</p>
       )}
       {children}
     </motion.div>
   );
 }