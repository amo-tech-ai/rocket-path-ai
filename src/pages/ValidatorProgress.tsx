 /**
  * Validator Progress Page
  * Shows real-time pipeline status with step progression
  */
 
 import { useState, useEffect } from 'react';
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
 
   // Poll for status updates
   useEffect(() => {
     if (!sessionId || !polling) return;
 
     const fetchStatus = async () => {
       try {
        // Use supabase.functions.invoke with body containing session_id
        // The edge function reads session_id from URL params, so we need direct fetch
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
 
         // Stop polling when complete
         if (result.status === 'complete' || result.status === 'failed') {
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
 
   // Auto-navigate to report when complete and verified
   useEffect(() => {
     if (status?.status === 'complete' && status.report?.verified) {
       const timer = setTimeout(() => {
         navigate(`/validator/report/${status.report?.id}`);
       }, 2000);
       return () => clearTimeout(timer);
     }
   }, [status, navigate]);
 
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
           <Button onClick={() => navigate('/validator')}>Back to Validator</Button>
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
                 : status?.status === 'failed'
                   ? 'Validation Failed'
                   : 'Running AI Agents...'}
             </h1>
             <p className="text-muted-foreground">
               {status?.status === 'complete'
                 ? 'Your 14-section report is ready'
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
                       onClick={() => setPolling(true)}
                       disabled={polling}
                     >
                       <RefreshCw className={`w-4 h-4 mr-2 ${polling ? 'animate-spin' : ''}`} />
                       Regenerate
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
 
         {/* Back button for failed state */}
         {status?.status === 'failed' && (
           <div className="flex justify-center gap-4">
             <Button variant="outline" onClick={() => navigate('/validator')}>
               Start Over
             </Button>
             <Button onClick={() => setPolling(true)}>
               <RefreshCw className="w-4 h-4 mr-2" />
               Retry
             </Button>
           </div>
         )}
       </div>
     </DashboardLayout>
   );
 }