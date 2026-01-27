/**
 * Pitch Deck Editor Page
 * 3-panel layout using extracted components
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePitchDeckEditor } from '@/hooks/usePitchDeckEditor';
import { 
  SlideNavigationPanel, 
  SlideEditorPanel, 
  AIIntelligencePanel 
} from '@/components/pitchdeck/editor';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function PitchDeckEditor() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  
  const {
    deck,
    slides,
    currentSlide,
    currentSlideIndex,
    goToSlide,
    nextSlide,
    prevSlide,
    updateSlideContent,
    updateDeckTitle,
    isLoading,
    saveStatus,
    aiSuggestions,
    slideAnalysis,
    isLoadingSuggestions,
    fetchAISuggestions,
    applySuggestion,
    dismissSuggestion,
  } = usePitchDeckEditor({ deckId: deckId! });

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');

  useEffect(() => {
    if (deck?.title) {
      setTitleValue(deck.title);
    }
  }, [deck?.title]);

  // Fetch AI suggestions when slide changes
  useEffect(() => {
    if (currentSlide && !isLoadingSuggestions && aiSuggestions.length === 0) {
      fetchAISuggestions();
    }
  }, [currentSlide?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <div className="w-60 border-r p-4">
          <Skeleton className="h-8 w-full mb-4" />
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full mb-2" />
          ))}
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="w-80 border-l p-4">
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Deck not found</h2>
          <Button onClick={() => navigate('/app/pitch-decks')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleTitleSave = () => {
    updateDeckTitle(titleValue);
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTitleValue(deck.title);
    setIsEditingTitle(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Slide Navigation */}
      <SlideNavigationPanel
        deck={deck}
        slides={slides}
        currentSlideIndex={currentSlideIndex}
        aiSuggestions={aiSuggestions}
        isEditingTitle={isEditingTitle}
        titleValue={titleValue}
        onSlideClick={goToSlide}
        onEditTitleStart={() => setIsEditingTitle(true)}
        onEditTitleEnd={handleTitleCancel}
        onTitleChange={setTitleValue}
        onTitleSave={handleTitleSave}
      />

      {/* Main Panel - Slide Editor */}
      <SlideEditorPanel
        slides={slides}
        currentSlide={currentSlide}
        currentSlideIndex={currentSlideIndex}
        saveStatus={saveStatus}
        deckId={deckId!}
        deckTitle={deck.title}
        onPrevSlide={prevSlide}
        onNextSlide={nextSlide}
        onUpdateContent={updateSlideContent}
      />

      {/* Right Panel - AI Intelligence */}
      <AIIntelligencePanel
        slideAnalysis={slideAnalysis}
        aiSuggestions={aiSuggestions}
        isLoadingSuggestions={isLoadingSuggestions}
        onFetchSuggestions={fetchAISuggestions}
        onApplySuggestion={applySuggestion}
        onDismissSuggestion={dismissSuggestion}
      />
    </div>
  );
}
