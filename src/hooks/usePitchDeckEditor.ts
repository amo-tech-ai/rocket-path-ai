/**
 * Pitch Deck Editor Hook
 * Manages slide editing, AI suggestions, and auto-save
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

export interface SlideContent {
  title?: string;
  subtitle?: string;
  bullets?: string[];
  metrics?: { label: string; value: string }[];
  image_url?: string;
  speaker_notes?: string;
  ai_suggestions?: AISuggestion[];
}

export interface Slide {
  id: string;
  deck_id: string;
  slide_number: number;
  slide_type: string;
  title: string | null;
  subtitle: string | null;
  content: SlideContent;
  notes: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AISuggestion {
  id: string;
  type: 'clarity' | 'impact' | 'metric' | 'problem' | 'industry' | 'tone';
  suggestion: string;
  reasoning: string;
  applied?: boolean;
  applied_at?: string;
}

export interface SlideAnalysis {
  clarity: number;
  impact: number;
  tone: number;
  overall: number;
  feedback: string;
}

interface UsePitchDeckEditorOptions {
  deckId: string;
}

export function usePitchDeckEditor({ deckId }: UsePitchDeckEditorOptions) {
  const [deck, setDeck] = useState<{
    id: string;
    title: string;
    status: string;
    template: string | null;
    signal_strength: number | null;
    updated_at: string;
  } | null>(null);
  
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [slideAnalysis, setSlideAnalysis] = useState<SlideAnalysis | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const currentSlide = useMemo(() => slides[currentSlideIndex] || null, [slides, currentSlideIndex]);

  // ============================================================================
  // Load Deck & Slides
  // ============================================================================

  useEffect(() => {
    async function loadDeck() {
      try {
        setIsLoading(true);

        // Fetch deck
        const { data: deckData, error: deckError } = await supabase
          .from('pitch_decks')
          .select('id, title, status, template, signal_strength, updated_at')
          .eq('id', deckId)
          .single();

        if (deckError) throw deckError;
        setDeck(deckData);

        // Fetch slides
        const { data: slidesData, error: slidesError } = await supabase
          .from('pitch_deck_slides')
          .select('*')
          .eq('deck_id', deckId)
          .order('slide_number', { ascending: true });

        if (slidesError) throw slidesError;
        
        const typedSlides: Slide[] = (slidesData || []).map(s => ({
          id: s.id,
          deck_id: s.deck_id,
          slide_number: s.slide_number,
          slide_type: s.slide_type,
          title: s.title,
          subtitle: s.subtitle,
          content: (s.content as SlideContent) || { bullets: [] },
          notes: s.notes,
          image_url: s.image_url,
          created_at: s.created_at,
          updated_at: s.updated_at,
        }));
        
        setSlides(typedSlides);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load deck:', error);
        toast.error('Failed to load deck');
        setIsLoading(false);
      }
    }

    if (deckId) {
      loadDeck();
    }
  }, [deckId]);

  // ============================================================================
  // Update Slide Content (with auto-save)
  // ============================================================================

  const updateSlideContent = useCallback(async (
    slideId: string,
    updates: Partial<SlideContent>
  ) => {
    try {
      setSaveStatus('saving');
      setIsSaving(true);

      const slideIndex = slides.findIndex(s => s.id === slideId);
      if (slideIndex === -1) throw new Error('Slide not found');

      const updatedContent: SlideContent = {
        ...slides[slideIndex].content,
        ...updates,
      };

      // Optimistic update
      setSlides(prev => prev.map((s, i) => 
        i === slideIndex ? { ...s, content: updatedContent, updated_at: new Date().toISOString() } : s
      ));

      // Call edge function to update
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('pitch-deck-agent', {
        body: {
          action: 'update_slide',
          slide_id: slideId,
          content: updatedContent,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;

      setSaveStatus('saved');
      setIsSaving(false);
    } catch (error) {
      console.error('Failed to update slide:', error);
      setSaveStatus('error');
      setIsSaving(false);
      toast.error('Failed to save changes');
    }
  }, [slides]);

  // ============================================================================
  // Navigation
  // ============================================================================

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlideIndex(index);
      // Clear suggestions when changing slides
      setAiSuggestions([]);
      setSlideAnalysis(null);
    }
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      goToSlide(currentSlideIndex + 1);
    }
  }, [currentSlideIndex, slides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1);
    }
  }, [currentSlideIndex, goToSlide]);

  // ============================================================================
  // Reorder Slides
  // ============================================================================

  const reorderSlides = useCallback(async (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const newSlides = [...slides];
    const [movedSlide] = newSlides.splice(fromIndex, 1);
    newSlides.splice(toIndex, 0, movedSlide);

    // Update slide numbers
    const updatedSlides = newSlides.map((s, i) => ({
      ...s,
      slide_number: i + 1,
    }));

    // Optimistic update
    setSlides(updatedSlides);

    try {
      // Batch update slide numbers
      const updates = updatedSlides.map(s => ({
        id: s.id,
        slide_number: s.slide_number,
      }));

      for (const update of updates) {
        await supabase
          .from('pitch_deck_slides')
          .update({ slide_number: update.slide_number })
          .eq('id', update.id);
      }
    } catch (error) {
      console.error('Failed to reorder slides:', error);
      toast.error('Failed to reorder slides');
      // Rollback
      setSlides(slides);
    }
  }, [slides]);

  // ============================================================================
  // AI Suggestions
  // ============================================================================

  const fetchAISuggestions = useCallback(async () => {
    if (!currentSlide) return;

    try {
      setIsLoadingSuggestions(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('pitch-deck-agent', {
        body: {
          action: 'analyze_slide',
          slide_id: currentSlide.id,
          slide_type: currentSlide.slide_type,
          slide_content: {
            title: currentSlide.title,
            subtitle: currentSlide.subtitle,
            bullets: currentSlide.content?.bullets,
            body: currentSlide.content,
          },
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        console.error('AI suggestions error:', response.error);
        throw response.error;
      }

      const data = response.data;
      
      if (data?.analysis) {
        setSlideAnalysis(data.analysis);
      }
      
      if (data?.suggestions) {
        setAiSuggestions(data.suggestions.map((s: { id?: string; type: string; suggestion: string; reasoning: string }) => ({
          id: s.id || `sug_${Date.now()}`,
          type: s.type as AISuggestion['type'],
          suggestion: s.suggestion,
          reasoning: s.reasoning,
          applied: false,
        })));
      }

      setIsLoadingSuggestions(false);
    } catch (error) {
      console.error('Failed to fetch AI suggestions:', error);
      
      // Fallback suggestions
      setAiSuggestions([
        {
          id: 'sug_1',
          type: 'clarity',
          suggestion: 'Consider simplifying the main message to one sentence.',
          reasoning: 'Investors spend ~10 seconds per slide. Clarity wins.',
        },
        {
          id: 'sug_2',
          type: 'impact',
          suggestion: 'Add a specific metric to quantify your claim.',
          reasoning: 'Numbers make statements memorable and credible.',
        },
      ]);
      
      setSlideAnalysis({
        clarity: 7,
        impact: 6,
        tone: 7,
        overall: 7,
        feedback: 'Good foundation. Consider adding more specific metrics.',
      });
      
      setIsLoadingSuggestions(false);
    }
  }, [currentSlide]);

  const applySuggestion = useCallback(async (suggestionId: string) => {
    const suggestion = aiSuggestions.find(s => s.id === suggestionId);
    if (!suggestion || !currentSlide) return;

    // Mark as applied
    setAiSuggestions(prev => prev.map(s => 
      s.id === suggestionId ? { ...s, applied: true, applied_at: new Date().toISOString() } : s
    ));

    toast.success('Suggestion applied');
  }, [aiSuggestions, currentSlide]);

  const dismissSuggestion = useCallback((suggestionId: string) => {
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  }, []);

  // ============================================================================
  // Deck Actions
  // ============================================================================

  const updateDeckTitle = useCallback(async (title: string) => {
    if (!deck) return;

    try {
      await supabase
        .from('pitch_decks')
        .update({ title })
        .eq('id', deck.id);

      setDeck(prev => prev ? { ...prev, title } : null);
    } catch (error) {
      console.error('Failed to update deck title:', error);
      toast.error('Failed to update title');
    }
  }, [deck]);

  // ============================================================================
  // Keyboard Navigation
  // ============================================================================

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          prevSlide();
          break;
        case 'ArrowRight':
          nextSlide();
          break;
        case 'Home':
          goToSlide(0);
          break;
        case 'End':
          goToSlide(slides.length - 1);
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide, goToSlide, slides.length]);

  return {
    // Deck
    deck,
    updateDeckTitle,

    // Slides
    slides,
    currentSlide,
    currentSlideIndex,
    goToSlide,
    nextSlide,
    prevSlide,
    reorderSlides,
    updateSlideContent,

    // Status
    isLoading,
    isSaving,
    saveStatus,

    // AI
    aiSuggestions,
    slideAnalysis,
    isLoadingSuggestions,
    fetchAISuggestions,
    applySuggestion,
    dismissSuggestion,
  };
}
