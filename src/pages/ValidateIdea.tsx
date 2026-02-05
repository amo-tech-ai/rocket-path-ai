/**
 * Validate Idea Page
 * Chat-based startup idea validation experience
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Target, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ValidatorChat } from '@/components/validator/chat';
import { useStartup } from '@/hooks/useDashboardData';

export default function ValidateIdea() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: startup, isLoading } = useStartup();
  const [initialIdea, setInitialIdea] = useState<string | undefined>();
  
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

      {/* Main Chat Area - Full width layout */}
       <div className="flex-1 flex flex-col max-w-[1100px] mx-auto w-full px-4">
        <div className="flex-1 bg-card/30 rounded-2xl border border-border mt-4 mb-2 overflow-hidden shadow-sm">
          {startup?.id ? (
            <ValidatorChat
              startupId={startup.id}
              onValidationComplete={handleValidationComplete}
              initialIdea={initialIdea}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-medium text-foreground mb-2">No Startup Selected</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Please create a startup profile first.
                </p>
                <Button onClick={() => navigate('/onboarding')}>
                  Get Started
                </Button>
              </div>
            </div>
          )}
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
