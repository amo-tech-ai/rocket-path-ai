 /**
  * Validator Progress Page
  * Shows real-time pipeline status with step progression
  */
 
 import { useState, useEffect, useRef, useCallback } from 'react';
 import { useParams, useNavigate } from 'react-router-dom';
 import { motion, AnimatePresence } from 'framer-motion';
 import DashboardLayout from '@/components/layout/DashboardLayout';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { supabase } from '@/integrations/supabase/client';
 import { 
   CheckCircle2, 
   Circle, 
   Loader2, 
   XCircle, 
   ArrowRight,
   RefreshCw,
   Search,
   Users,
   Target,
   BarChart3,
   Rocket,
   FileText,
   Shield
 } from 'lucide-react';
 
 interface PipelineStep {
   step: number;
   name: string;
   agent: string;
   status: 'queued' | 'running' | 'ok' | 'partial' | 'failed';
   started_at?: string;
   finished_at?: string;
   duration_ms?: number;
   has_citations: boolean;
   error?: string;
 }
 
 interface SessionStatus {
   session_id: string;
   status: 'running' | 'complete' | 'partial' | 'failed';
   progress: number;
   steps: PipelineStep[];
   report?: {
     id: string;
     score: number;
     summary: string;
     verified: boolean;
     verification?: {
       verified: boolean;
       warnings: string[];
       missing_sections: string[];
     };
   };
   error?: string;
 }
 
 const STEP_ICONS = {
   ExtractorAgent: Target,
   ResearchAgent: Search,
   CompetitorAgent: Users,
   ScoringAgent: BarChart3,
   MVPAgent: Rocket,
   ComposerAgent: FileText,
   VerifierAgent: Shield,
 };
 
 export default function ValidatorProgress() {
   const { sessionId } = useParams<{ sessionId: string }>();
   const navigate = useNavigate();
   const [status, setStatus] = useState<SessionStatus | null>(null);
   const [error, setError] = useState<string | null>(null);
   const [polling, setPolling] = useState(true);
   const pollingStart = useRef(Date.now());
   const statusRef = useRef<SessionStatus | null>(null);
   const MAX_POLL_MS = 360_000; // B3 fix: 6 min (pipeline deadline 300s + 60s buffer)
   const [navigating, setNavigating] = useState(false);

   const goToReport = useCallback(async () => {
     if (!sessionId) return;
     const reportId = status?.report?.id;
     if (reportId) {
       navigate(`/validator/report/${reportId}`);
       return;
     }
     setNavigating(true);
     const { data } = await supabase
       .from('validator_reports')
       .select('id')
       .eq('session_id', sessionId)
       .order('created_at', { ascending: false })
       .limit(1)
       .maybeSingle();
     setNavigating(false);
     if (data?.id) navigate(`/validator/report/${data.id}`);
   }, [sessionId, status?.report?.id, navigate]);

   // Keep ref in sync with state so the polling closure always has latest value
   useEffect(() => {
     statusRef.current = status;
   }, [status]);

   // Poll for status updates
   useEffect(() => {
     if (!sessionId || !polling) return;
 
     const fetchStatus = async () => {
       // F9: Stop polling after 3 minutes — show current state instead of generic error
       // FIX: Use statusRef.current instead of `status` to avoid stale closure.
       // The `status` variable is captured once when the effect runs (deps: [sessionId, polling])
       // and never updates. The ref always has the latest value.
       if (Date.now() - pollingStart.current > MAX_POLL_MS) {
         setPolling(false);
         if (statusRef.current) {
           setStatus(prev => prev ? { ...prev, status: 'failed', error: prev.error || 'Pipeline timed out after 3 minutes. The zombie cleanup will mark this session as failed.' } : prev);
         } else {
           setError('Pipeline timed out. Please try again.');
         }
         return;
       }

       try {
        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;
        
        if (!token) {
          setError('Not authenticated');
          return;
        }

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const response = await fetch(
          `${supabaseUrl}/functions/v1/validator-status?session_id=${sessionId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Status ${response.status}`);
        }
        
        const result = await response.json();
         setStatus(result);
 
         // F6: Stop polling on ALL terminal states (partial is also terminal)
         if (result.status === 'complete' || result.status === 'partial' || result.status === 'failed') {
           setPolling(false);
         }
       } catch (e) {
         console.error('Status fetch error:', e);
        setError(e instanceof Error ? e.message : 'Failed to fetch pipeline status');
       }
     };
 
     fetchStatus();
     const interval = setInterval(fetchStatus, 2000); // Poll every 2 seconds
 
     return () => clearInterval(interval);
   }, [sessionId, polling]);
 
   // F7: Auto-navigate to report for ANY terminal state with a report
   useEffect(() => {
     if (status?.status !== 'complete' && status?.status !== 'partial') return;
     const reportId = status.report?.id;
     if (reportId) {
       const timer = setTimeout(() => navigate(`/validator/report/${reportId}`), 1000);
       return () => clearTimeout(timer);
     }
     // Fallback: status API sometimes returns complete without report (race/RLS). Fetch by session_id.
     if (!sessionId) return;
     let cancelled = false;
     const resolveReport = async () => {
       const { data } = await supabase
         .from('validator_reports')
         .select('id')
         .eq('session_id', sessionId)
         .order('created_at', { ascending: false })
         .limit(1)
         .maybeSingle();
       if (!cancelled && data?.id) {
         navigate(`/validator/report/${data.id}`);
       }
     };
     const timer = setTimeout(resolveReport, 500);
     return () => {
       cancelled = true;
       clearTimeout(timer);
     };
   }, [status, navigate, sessionId]);
 
   const getStepIcon = (step: PipelineStep) => {
     const Icon = STEP_ICONS[step.agent as keyof typeof STEP_ICONS] || Circle;
     return Icon;
   };
 
   const getStatusIcon = (status: string) => {
     switch (status) {
       case 'ok':
         return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
       case 'partial':
         return <CheckCircle2 className="w-5 h-5 text-amber-500" />;
       case 'running':
         return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
       case 'failed':
         return <XCircle className="w-5 h-5 text-destructive" />;
       default:
         return <Circle className="w-5 h-5 text-muted-foreground" />;
     }
   };
 
   const getStatusBadge = (status: string) => {
     const variants: Record<string, string> = {
       complete: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
       partial: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
       running: 'bg-primary/10 text-primary border-primary/30',
       failed: 'bg-destructive/10 text-destructive border-destructive/30',
     };
     return variants[status] || 'bg-muted text-muted-foreground';
   };
 
   if (error) {
     return (
       <DashboardLayout>
         <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
           <XCircle className="w-16 h-16 text-destructive" />
           <h1 className="text-xl font-semibold text-foreground">Error</h1>
           <p className="text-muted-foreground">{error}</p>
           <Button onClick={() => navigate('/validate')}>Back to Validator</Button>
         </div>
       </DashboardLayout>
     );
   }
 
   return (
     <DashboardLayout>
       <div className="max-w-[1100px] mx-auto p-6 space-y-8">
         {/* Header */}
         <div className="text-center space-y-4">
           <motion.div
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
           >
             <Badge className={`mb-4 ${getStatusBadge(status?.status || 'running')}`}>
               {status?.status?.toUpperCase() || 'INITIALIZING'}
             </Badge>
             <h1 className="text-3xl font-semibold text-foreground">
               {status?.status === 'complete'
                 ? 'Validation Complete!'
                 : status?.status === 'partial'
                   ? 'Partial Results Available'
                   : status?.status === 'failed'
                     ? 'Validation Failed'
                     : 'Running AI Agents...'}
             </h1>
             <p className="text-muted-foreground">
               {status?.status === 'complete'
                 ? 'Your 14-section report is ready'
                 : status?.status === 'partial'
                   ? `${status.steps?.filter(s => s.status === 'ok' || s.status === 'partial').length || 0} of ${status.steps?.length || 7} agents completed`
                   : status?.status === 'failed'
                     ? status.error || 'Pipeline encountered errors during analysis'
                     : 'Multi-agent pipeline analyzing your startup idea'}
             </p>
           </motion.div>
 
           {/* Progress bar */}
           <div className="w-full max-w-md mx-auto">
             <div className="h-2 bg-muted rounded-full overflow-hidden">
               <motion.div
                 className="h-full bg-primary"
                 initial={{ width: 0 }}
                 animate={{ width: `${status?.progress || 0}%` }}
                 transition={{ duration: 0.5 }}
               />
             </div>
             <p className="text-sm text-muted-foreground mt-2">
               {status?.progress || 0}% complete
             </p>
           </div>
         </div>
 
         {/* Pipeline Steps */}
         <div className="card-premium p-6">
           <div className="space-y-4">
             {status?.steps?.map((step, index) => {
               const Icon = getStepIcon(step);
               const isActive = step.status === 'running';
               const isDone = step.status === 'ok' || step.status === 'partial';
               
               return (
                 <motion.div
                   key={step.agent}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: index * 0.1 }}
                   className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                     isActive 
                       ? 'border-primary/50 bg-primary/5' 
                       : isDone 
                         ? 'border-emerald-500/30 bg-emerald-500/5'
                         : step.status === 'failed'
                           ? 'border-destructive/30 bg-destructive/5'
                           : 'border-border bg-card'
                   }`}
                 >
                   {/* Step number */}
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                     isDone ? 'bg-emerald-500/20' : isActive ? 'bg-primary/20' : 'bg-muted'
                   }`}>
                     <Icon className={`w-5 h-5 ${
                       isDone ? 'text-emerald-500' : isActive ? 'text-primary' : 'text-muted-foreground'
                     }`} />
                   </div>
 
                   {/* Step info */}
                   <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-2">
                       <span className="font-medium text-foreground">{step.name}</span>
                       {step.has_citations && (
                         <Badge variant="outline" className="text-xs">
                           Citations ✓
                         </Badge>
                       )}
                     </div>
                     <p className="text-sm text-muted-foreground truncate">
                       {step.error || step.agent}
                     </p>
                   </div>
 
                   {/* Status */}
                   <div className="flex-shrink-0">
                     {getStatusIcon(step.status)}
                   </div>
 
                   {/* Duration */}
                   {step.duration_ms && (
                     <span className="text-xs text-muted-foreground flex-shrink-0">
                       {(step.duration_ms / 1000).toFixed(1)}s
                     </span>
                   )}
                 </motion.div>
               );
             })}
           </div>
         </div>
 
         {/* Report Preview / Actions */}
         <AnimatePresence mode="wait">
           {status?.report && (
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="card-premium p-6 space-y-4"
             >
               <div className="flex items-center justify-between">
                 <div>
                   <div className="flex items-center gap-2 mb-2">
                     <h2 className="text-xl font-semibold text-foreground">
                       Report Ready
                     </h2>
                     {status.report.verified ? (
                       <Badge className="bg-emerald-500/10 text-emerald-500">
                         <Shield className="w-3 h-3 mr-1" />
                         Verified
                       </Badge>
                     ) : (
                       <Badge variant="outline" className="text-amber-500">
                         Unverified
                       </Badge>
                     )}
                   </div>
                   <p className="text-muted-foreground">
                     Score: <span className="font-semibold text-foreground">{status.report.score}/100</span>
                   </p>
                 </div>
 
                 <div className="flex gap-2">
                   {!status.report.verified && (
                     <Button
                       variant="outline"
                       onClick={() => navigate('/validator')}
                     >
                       <RefreshCw className="w-4 h-4 mr-2" />
                       Try Again
                     </Button>
                   )}
                   <Button onClick={() => navigate(`/validator/report/${status.report?.id}`)}>
                     View Report
                     <ArrowRight className="w-4 h-4 ml-2" />
                   </Button>
                 </div>
               </div>
 
               {/* Warnings */}
               {status.report.verification?.warnings?.length > 0 && (
                 <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                   <h3 className="text-sm font-medium text-amber-500 mb-2">Warnings</h3>
                   <ul className="text-sm text-amber-400 space-y-1">
                     {status.report.verification.warnings.map((w, i) => (
                       <li key={i}>• {w}</li>
                     ))}
                   </ul>
                 </div>
               )}
             </motion.div>
           )}
         </AnimatePresence>

         {/* Complete but report missing in status response — manual View Report */}
         {(status?.status === 'complete' || status?.status === 'partial') && !status?.report && sessionId && (
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="card-premium p-6 space-y-4"
           >
             <h2 className="text-xl font-semibold text-foreground">Report Ready</h2>
             <p className="text-muted-foreground">Your validation report is complete.</p>
             <Button onClick={goToReport} disabled={navigating}>
               {navigating ? (
                 <>
                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                   Loading...
                 </>
               ) : (
                 <>
                   View Report
                   <ArrowRight className="w-4 h-4 ml-2" />
                 </>
               )}
             </Button>
           </motion.div>
         )}

         {/* Partial results summary — show what agents completed on failure */}
         {(status?.status === 'failed' || (status?.status === 'partial' && !status?.report)) && status?.steps && (
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="card-premium p-6 space-y-4"
           >
             <h2 className="text-lg font-semibold text-foreground">Pipeline Summary</h2>
             {status.error && (
               <p className="text-sm text-muted-foreground bg-destructive/5 border border-destructive/20 rounded-lg p-3">
                 {status.error}
               </p>
             )}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               {status.steps.filter(s => s.status === 'ok' || s.status === 'partial').map(step => (
                 <div key={step.agent} className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                   <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                   <span className="text-sm text-foreground">{step.name}</span>
                   {step.duration_ms && (
                     <span className="text-xs text-muted-foreground ml-auto">{(step.duration_ms / 1000).toFixed(1)}s</span>
                   )}
                 </div>
               ))}
               {status.steps.filter(s => s.status === 'failed').map(step => (
                 <div key={step.agent} className="flex items-center gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                   <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                   <div className="min-w-0">
                     <span className="text-sm text-foreground">{step.name}</span>
                     {step.error && (
                       <p className="text-xs text-muted-foreground truncate">{step.error}</p>
                     )}
                   </div>
                 </div>
               ))}
             </div>
             <p className="text-xs text-muted-foreground">
               {status.steps.filter(s => s.status === 'ok' || s.status === 'partial').length} agents completed,{' '}
               {status.steps.filter(s => s.status === 'failed').length} failed.
               {' '}Try again — the pipeline has been updated with longer timeouts.
             </p>
           </motion.div>
         )}

         {/* F8: Actions for failed/partial state */}
         {(status?.status === 'failed' || status?.status === 'partial') && (
           <div className="flex justify-center gap-4">
             <Button variant="outline" onClick={() => navigate('/validate')}>
               Start Over
             </Button>
             <Button onClick={() => navigate('/validate')}>
               <RefreshCw className="w-4 h-4 mr-2" />
               Try Again
             </Button>
           </div>
         )}
       </div>
     </DashboardLayout>
   );
 }