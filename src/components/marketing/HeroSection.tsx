/**
 * Hero Section with Chat-Based Startup Input
 * Matches the "From idea to execution" design
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Brain, BarChart3, Calculator, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { setReturnPathOnce } from '@/lib/authReturnPath';

// Processing phases
const PHASES = [
  { icon: Brain, title: 'Analyzing', description: 'Parsing your startup concept...' },
  { icon: BarChart3, title: 'Researching', description: 'Gathering market intelligence...' },
  { icon: Calculator, title: 'Scoring', description: 'Calculating validation metrics...' },
  { icon: CheckCircle2, title: 'Complete', description: 'Your report is ready!' },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);

  const canGenerate = input.trim().length >= 10;

  const handleGenerate = () => {
    if (!canGenerate) return;

    // If not logged in, redirect to login with return URL
    if (!user) {
      const returnPath = '/validate?hasIdea=true';
      sessionStorage.setItem('pendingIdea', input);
      setReturnPathOnce(returnPath);
      navigate('/login?redirect=' + encodeURIComponent(returnPath));
      return;
    }

    // Start processing animation
    setIsProcessing(true);
    setCurrentPhase(0);

    // Progress through phases
    const phaseTimer = setInterval(() => {
      setCurrentPhase(prev => {
        if (prev >= PHASES.length - 1) {
          clearInterval(phaseTimer);
          // Navigate to validator after animation
          setTimeout(() => {
            sessionStorage.setItem('pendingIdea', input);
            navigate('/validate?hasIdea=true');
          }, 500);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && canGenerate) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center py-20 overflow-hidden bg-background">
      {/* Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card border border-border rounded-2xl p-8 md:p-12 max-w-md w-full mx-4 text-center shadow-2xl"
            >
              {/* Animation Circle */}
              <div className="relative w-28 h-28 mx-auto mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-3 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPhase}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                    >
                      {(() => {
                        const PhaseIcon = PHASES[currentPhase]?.icon || Brain;
                        return (
                          <PhaseIcon 
                            className={cn(
                              "w-10 h-10",
                              currentPhase === 3 ? "text-sage" : "text-primary"
                            )} 
                          />
                        );
                      })()}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Phase Text */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhase}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                >
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {PHASES[currentPhase]?.title}
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    {PHASES[currentPhase]?.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Progress Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {PHASES.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: i === currentPhase ? 1.2 : 1,
                      backgroundColor: i <= currentPhase 
                        ? 'hsl(var(--primary))' 
                        : 'hsl(var(--muted))',
                    }}
                    className="w-2 h-2 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container-marketing max-w-5xl text-center px-4">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 md:mb-12 tracking-tight"
        >
          From idea to execution.
        </motion.h1>

        {/* Chat Card - Wider layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
           className="bg-card border border-border rounded-2xl p-6 md:p-10 lg:p-12 shadow-xl w-full max-w-[1100px] mx-auto"
        >
          {/* System Ready Label */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              System Ready
            </span>
          </div>

          {/* Prompt Text */}
          <p className="text-lg md:text-xl text-foreground font-medium text-left mb-1">
            Describe your startup idea, problem, or goal.
          </p>
          <p className="text-lg md:text-xl text-foreground font-medium text-left mb-6">
            I'll help turn it into a clear plan.
          </p>

          {/* Input Area - Larger */}
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="I'm building an AI tool that helps small restaurants predict their weekly inventory needs based on historical sales, weather, and local events..."
              disabled={isProcessing}
              className={cn(
                "min-h-[140px] md:min-h-[160px] resize-none border-0 bg-transparent p-0",
                "text-base md:text-lg lg:text-xl placeholder:text-muted-foreground/40",
                "focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 leading-relaxed",
              )}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border my-6" />

          {/* Bottom Bar */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="text-primary">Press Enter</span> to initiate protocol
            </p>

            <Button
              onClick={handleGenerate}
              disabled={!canGenerate || isProcessing}
              variant="secondary"
              className="gap-2"
            >
              {isProcessing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                  Processing
                </>
              ) : (
                <>
                  Generate
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-sm text-muted-foreground"
        >
          <span className="text-primary">AI suggests.</span> You decide.
          <span className="mx-2">—</span>
          <span className="text-primary">No credit card required.</span>
        </motion.p>
      </div>
    </section>
  );
};

export default HeroSection;
