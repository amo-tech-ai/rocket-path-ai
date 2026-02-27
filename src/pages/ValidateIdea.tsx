/**
 * Validate Idea Page
 * Chat-based startup idea validation experience
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Target, ArrowLeft, ListChecks, BarChart3, AlertTriangle, PlayCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DEV_BYPASS_AUTH } from '@/lib/devConfig';
import { setReturnPathOnce } from '@/lib/authReturnPath';
import { useAuth } from '@/hooks/useAuth';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ValidatorChat } from '@/components/validator/chat';
import { ContextPanel } from '@/components/validator/chat/ContextPanel';
import { ExtractionPanel } from '@/components/validator/chat/ExtractionPanel';
import { useStartup } from '@/hooks/useDashboardData';
import { isCovered, type FollowupCoverage, type ExtractedFields, type ConfidenceMap } from '@/hooks/useValidatorFollowup';

export default function ValidateIdea() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { data: startup, isLoading } = useStartup();
  const [initialIdea, setInitialIdea] = useState<string | undefined>();

  // Query for most recent completed validation with report
  const { data: recentSession } = useQuery({
    queryKey: ['recent-validator-session', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('validator_sessions')
        .select(`
          id, status, startup_id, updated_at,
          startups!inner(name, industry),
          validator_reports(id, score)
        `)
        .eq('user_id', user.id)
        .in('status', ['complete', 'partial'])
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error || !data) return null;
      return data;
    },
    enabled: !!user,
    staleTime: 30_000,
  });
  const [coverage, setCoverage] = useState<FollowupCoverage | null>(null);
  const [extracted, setExtracted] = useState<ExtractedFields | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceMap | null>(null);
  const [canGenerate, setCanGenerate] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [prefillText, setPrefillText] = useState<string | undefined>();
  const [showDevBypassBanner, setShowDevBypassBanner] = useState(false);

  // Dev-only: warn when bypass is on but no JWT (Edge Functions will 401)
  useEffect(() => {
    if (!DEV_BYPASS_AUTH) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      setShowDevBypassBanner(!session);
    });
  }, []);

  // Coverage callback from ValidatorChat
  const handleCoverageUpdate = useCallback((newCoverage: FollowupCoverage, ready: boolean, newExtracted?: ExtractedFields, newConfidence?: ConfidenceMap) => {
    setCoverage(newCoverage);
    setCanGenerate(ready);
    setMessageCount(prev => prev + 1);
    if (newExtracted) setExtracted(newExtracted);
    if (newConfidence) setConfidence(newConfidence);
  }, []);

  // Suggestion chip clicked — prefill chat input
  const handleSuggestionClick = useCallback((text: string) => {
    // Clear first, then set — ensures useEffect re-fires even for same text
    setPrefillText(undefined);
    requestAnimationFrame(() => setPrefillText(text));
  }, []);

  // Check for pending idea from homepage — read once, clear only after consumed
  useEffect(() => {
    if (initialIdea) return; // Already have it, don't re-read
    const hasIdea = searchParams.get('hasIdea') === 'true';
    if (hasIdea) {
      const pendingIdea = sessionStorage.getItem('pendingIdea');
      if (pendingIdea) {
        setInitialIdea(pendingIdea);
        // Clear after a short delay so re-mounts during auth hydration don't lose it
        setTimeout(() => sessionStorage.removeItem('pendingIdea'), 2000);
      }
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle validation complete
  const handleValidationComplete = (reportId: string) => {
    navigate(`/validator?showReport=true&reportId=${reportId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" aria-busy="true" aria-live="polite">
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>
          <p className="text-sm text-muted-foreground">Loading validator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Dev-only: explain 401 when bypass on but no JWT */}
      {showDevBypassBanner && (
        <div className="flex-shrink-0 bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 flex items-center gap-2 text-amber-800 dark:text-amber-200 text-sm" role="alert">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" aria-hidden />
          <span>DEV_BYPASS_AUTH: Edge Functions will 401 without a JWT.</span>
          <Link
            to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
            onClick={() => setReturnPathOnce(location.pathname + location.search)}
            className="font-medium text-primary hover:underline shrink-0"
          >
            Sign in
          </Link>
          <span>or run <code className="text-xs bg-amber-500/20 px-1 rounded">supabase functions serve --no-verify-jwt</code> locally.</span>
        </div>
      )}
      {/* Header */}
      <header className="flex-shrink-0 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Target className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">Validate My Idea</h1>
                <p className="text-xs text-muted-foreground">AI-powered startup validation</p>
              </div>
            </div>
          </div>
          
          {startup && (
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{startup.name}</p>
              <p className="text-xs text-muted-foreground">{startup.industry}</p>
            </div>
          )}
        </div>
      </header>

      {/* Continue where you left off — shown for returning users */}
      {recentSession && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 px-4 py-3 bg-primary/5 border-b border-primary/10"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {recentSession.status === 'complete' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              ) : (
                <PlayCircle className="w-5 h-5 text-primary flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {recentSession.status === 'complete' ? 'View latest report' : 'Continue where you left off'}
                  {' — '}
                  <span className="text-primary">
                    {(recentSession.startups as { name: string })?.name || 'Untitled Session'}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {recentSession.status === 'complete' && (recentSession.validator_reports as { score: number }[])?.[0]?.score != null
                    ? `Score: ${(recentSession.validator_reports as { score: number }[])[0].score}/100`
                    : 'Validation in progress'}
                  {' · '}
                  {new Date(recentSession.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant={recentSession.status === 'complete' ? 'default' : 'outline'}
              onClick={() => {
                const reportId = (recentSession.validator_reports as { id: string }[])?.[0]?.id;
                if (reportId) {
                  navigate(`/validator?showReport=true&reportId=${reportId}`);
                } else {
                  navigate(`/validator/run/${recentSession.id}`);
                }
              }}
              className="flex-shrink-0 gap-1"
            >
              {recentSession.status === 'complete' ? 'View Report' : 'Continue'}
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Hero Section - Only visible initially */}
      <motion.div
        initial={{ opacity: 1, height: 'auto' }}
        className="flex-shrink-0 py-8 md:py-12 px-4 text-center border-b border-border bg-gradient-to-b from-primary/5 to-transparent"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4"
        >
          From idea to execution.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground max-w-lg mx-auto"
        >
          Describe your startup idea in natural language. 
          Our AI will analyze market potential, competition, and viability.
        </motion.p>
      </motion.div>

      {/* Main Content - 3 Panel Layout */}
      <div className="flex-1 flex max-w-[1400px] mx-auto w-full px-4 gap-4">
        {/* Left Panel - Context */}
        <aside className="hidden lg:block w-72 flex-shrink-0 mt-4 mb-2">
          <div className="sticky top-4">
            <ContextPanel coverage={coverage} extracted={extracted} confidence={confidence} messageCount={messageCount} />
          </div>
        </aside>

        {/* Center - Chat */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 bg-card/30 rounded-2xl border border-border mt-4 mb-2 overflow-hidden shadow-sm">
            <ValidatorChat
              startupId={startup?.id}
              onValidationComplete={handleValidationComplete}
              initialIdea={initialIdea}
              onCoverageUpdate={handleCoverageUpdate}
              prefillText={prefillText}
            />
          </div>
        </div>

        {/* Right Panel - Extraction */}
        <aside className="hidden xl:block w-72 flex-shrink-0 mt-4 mb-2">
          <div className="sticky top-4">
            <ExtractionPanel coverage={coverage} canGenerate={canGenerate} onSuggestionClick={handleSuggestionClick} />
          </div>
        </aside>
      </div>

      {/* Mobile Panel Tabs — visible only when panels are hidden */}
      <div className="lg:hidden flex-shrink-0 border-t border-border bg-card/80 backdrop-blur-sm px-4 py-2">
        <div className="flex items-center justify-center gap-2">
          {/* Context Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 flex-1 max-w-[160px]">
                <ListChecks className="w-4 h-4" />
                Fields
                {coverage && (
                  <span className="text-xs text-primary font-medium">
                    {Object.values(coverage).filter(v => isCovered(v)).length}/{Object.keys(coverage).length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Extraction Progress</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <ContextPanel coverage={coverage} extracted={extracted} confidence={confidence} messageCount={messageCount} />
              </div>
            </SheetContent>
          </Sheet>

          {/* Extraction Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 flex-1 max-w-[160px]">
                <BarChart3 className="w-4 h-4" />
                Readiness
                {coverage && (
                  <span className={`text-xs font-medium ${canGenerate ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                    {Math.round((Object.values(coverage).filter(v => isCovered(v)).length / Object.keys(coverage).length) * 100)}%
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Validation Readiness</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <ExtractionPanel coverage={coverage} canGenerate={canGenerate} onSuggestionClick={handleSuggestionClick} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex-shrink-0 py-4 text-center border-t border-border">
        <p className="text-xs text-muted-foreground">
          <span className="text-primary">AI suggests.</span> You decide. — No credit card required.
        </p>
      </footer>
    </div>
  );
}
