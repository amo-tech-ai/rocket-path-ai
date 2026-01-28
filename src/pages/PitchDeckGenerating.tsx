/**
 * Pitch Deck Generating Page
 * Full-screen animated progress UI during deck generation
 * Route: /app/pitch-deck/generating/:deckId
 */

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, FileEdit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePitchDeckGeneration } from '@/hooks/usePitchDeckGeneration';
import { GenerationProgress } from '@/components/pitchdeck/generation/GenerationProgress';

export default function PitchDeckGenerating() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  
  const {
    isGenerating,
    currentStep,
    progress,
    steps,
    error,
    slideCount,
    completedAt,
    startGeneration,
    retry,
    cancel,
  } = usePitchDeckGeneration(deckId);

  // Start generation on mount
  useEffect(() => {
    if (deckId && !isGenerating && !completedAt && !error) {
      startGeneration();
    }
  }, [deckId, isGenerating, completedAt, error, startGeneration]);

  // Navigate to editor on completion
  const handleViewDeck = () => {
    navigate(`/app/pitch-deck/${deckId}/edit`);
  };

  // Go back to wizard
  const handleBackToWizard = () => {
    navigate(`/app/pitch-deck/${deckId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={cancel}
            disabled={isGenerating && progress > 0 && progress < 100}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Wizard
          </Button>
          
          {completedAt && (
            <Button onClick={handleViewDeck}>
              <FileEdit className="w-4 h-4 mr-2" />
              Open Editor
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl space-y-12"
        >
          {/* Title */}
          <div className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                {completedAt ? 'Your Pitch Deck is Ready!' : 'Creating Your Pitch Deck'}
              </h1>
            </motion.div>
            
            {completedAt ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground text-lg"
              >
                {slideCount} slides have been generated. You're in full control now.
              </motion.p>
            ) : (
              <p className="text-muted-foreground text-lg">
                Sit back while AI crafts your investor-ready deck
              </p>
            )}
          </div>

          {/* Progress Component */}
          <GenerationProgress
            steps={steps}
            currentStep={currentStep}
            progress={progress}
            isGenerating={isGenerating}
            error={error}
          />

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {error && (
              <>
                <Button onClick={retry} variant="default">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={handleBackToWizard} variant="outline">
                  Edit Wizard Data
                </Button>
              </>
            )}

            {completedAt && (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.5 }}
              >
                <Button size="lg" onClick={handleViewDeck} className="gap-2">
                  <FileEdit className="w-5 h-5" />
                  View Your Deck
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Success Animation */}
          {completedAt && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {slideCount} slides generated with AI
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Footer Reassurance */}
      {isGenerating && !error && (
        <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm py-4">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              Don't worry — your data is saved. You can close this tab and come back later.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
