/**
 * Validate Idea Page
 * Chat-based startup idea validation experience
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Target, ArrowLeft, ListChecks, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import type { FollowupCoverage } from '@/hooks/useValidatorFollowup';

export default function ValidateIdea() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: startup, isLoading } = useStartup();
  const [initialIdea, setInitialIdea] = useState<string | undefined>();
  const [coverage, setCoverage] = useState<FollowupCoverage | null>(null);
  const [canGenerate, setCanGenerate] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [prefillText, setPrefillText] = useState<string | undefined>();

  // Coverage callback from ValidatorChat
  const handleCoverageUpdate = useCallback((newCoverage: FollowupCoverage, ready: boolean) => {
    setCoverage(newCoverage);
    setCanGenerate(ready);
    setMessageCount(prev => prev + 1);
  }, []);

  // Suggestion chip clicked — prefill chat input
  const handleSuggestionClick = useCallback((text: string) => {
    // Clear first, then set — ensures useEffect re-fires even for same text
    setPrefillText(undefined);
    requestAnimationFrame(() => setPrefillText(text));
  }, []);

  // Check for pending idea from homepage
  useEffect(() => {
    const hasIdea = searchParams.get('hasIdea') === 'true';
    if (hasIdea) {
      const pendingIdea = sessionStorage.getItem('pendingIdea');
      if (pendingIdea) {
        setInitialIdea(pendingIdea);
        sessionStorage.removeItem('pendingIdea');
      }
    }
  }, [searchParams]);

  // Handle validation complete
  const handleValidationComplete = (reportId: string) => {
    navigate(`/validator?showReport=true&reportId=${reportId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
            <ContextPanel coverage={coverage} messageCount={messageCount} />
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
                    {Object.values(coverage).filter(Boolean).length}/8
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Extraction Progress</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <ContextPanel coverage={coverage} messageCount={messageCount} />
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
                    {Math.round((Object.values(coverage).filter(Boolean).length / 8) * 100)}%
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
