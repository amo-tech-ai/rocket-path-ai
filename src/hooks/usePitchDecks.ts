/**
 * Pitch Decks Hook (Dashboard)
 * Manages deck listing, filtering, and portfolio stats
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

export interface PitchDeckSummary {
  id: string;
  title: string;
  status: 'draft' | 'in_progress' | 'generating' | 'review' | 'final' | 'archived';
  template: string | null;
  signal_strength: number | null;
  slide_count: number;
  created_at: string;
  updated_at: string;
  thumbnail_url?: string | null;
}

export interface PortfolioStats {
  total_decks: number;
  average_signal: number;
  strongest_deck: { id: string; title: string; signal: number } | null;
  weakest_deck: { id: string; title: string; signal: number } | null;
  decks_needing_attention: number;
}

export interface DeckFilters {
  status: string;
  template: string;
  dateRange: string;
  search: string;
}

export type SortOption = 'updated_at' | 'created_at' | 'title' | 'signal_strength';

export function usePitchDecks() {
  const [decks, setDecks] = useState<PitchDeckSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<DeckFilters>({
    status: 'all',
    template: 'all',
    dateRange: 'all',
    search: '',
  });
  const [sortBy, setSortBy] = useState<SortOption>('updated_at');
  const [sortDesc, setSortDesc] = useState(true);

  // ============================================================================
  // Fetch Decks
  // ============================================================================

  const fetchDecks = useCallback(async () => {
    try {
      setIsLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's startup
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile?.org_id) {
        setIsLoading(false);
        return;
      }

      const { data: startup } = await supabase
        .from('startups')
        .select('id')
        .eq('org_id', profile.org_id)
        .maybeSingle();

      if (!startup) {
        setIsLoading(false);
        return;
      }

      // Fetch decks
      const { data: deckData, error } = await supabase
        .from('pitch_decks')
        .select(`
          id,
          title,
          status,
          template,
          signal_strength,
          slide_count,
          thumbnail_url,
          created_at,
          updated_at
        `)
        .eq('startup_id', startup.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const decksWithCounts: PitchDeckSummary[] = (deckData || []).map(d => ({
        id: d.id,
        title: d.title,
        status: d.status as PitchDeckSummary['status'],
        template: d.template,
        signal_strength: d.signal_strength,
        slide_count: d.slide_count || 0,
        thumbnail_url: d.thumbnail_url,
        created_at: d.created_at,
        updated_at: d.updated_at,
      }));

      setDecks(decksWithCounts);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch decks:', error);
      toast.error('Failed to load decks');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  // ============================================================================
  // Filtered & Sorted Decks
  // ============================================================================

  const filteredDecks = useMemo(() => {
    let result = [...decks];

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter(d => d.status === filters.status);
    }

    // Template filter
    if (filters.template !== 'all') {
      result = result.filter(d => d.template === filters.template);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      switch (filters.dateRange) {
        case '7d':
          cutoff.setDate(now.getDate() - 7);
          break;
        case '30d':
          cutoff.setDate(now.getDate() - 30);
          break;
        case '90d':
          cutoff.setDate(now.getDate() - 90);
          break;
      }

      result = result.filter(d => new Date(d.updated_at) >= cutoff);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(d => d.title.toLowerCase().includes(searchLower));
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'signal_strength':
          comparison = (a.signal_strength || 0) - (b.signal_strength || 0);
          break;
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'updated_at':
        default:
          comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
      }

      return sortDesc ? -comparison : comparison;
    });

    return result;
  }, [decks, filters, sortBy, sortDesc]);

  // ============================================================================
  // Portfolio Stats
  // ============================================================================

  const portfolioStats = useMemo((): PortfolioStats => {
    if (decks.length === 0) {
      return {
        total_decks: 0,
        average_signal: 0,
        strongest_deck: null,
        weakest_deck: null,
        decks_needing_attention: 0,
      };
    }

    const decksWithSignal = decks.filter(d => d.signal_strength !== null);
    const avgSignal = decksWithSignal.length > 0
      ? decksWithSignal.reduce((sum, d) => sum + (d.signal_strength || 0), 0) / decksWithSignal.length
      : 0;

    const sortedBySignal = [...decksWithSignal].sort((a, b) => 
      (b.signal_strength || 0) - (a.signal_strength || 0)
    );

    const strongest = sortedBySignal[0];
    const weakest = sortedBySignal[sortedBySignal.length - 1];

    return {
      total_decks: decks.length,
      average_signal: Math.round(avgSignal),
      strongest_deck: strongest ? { id: strongest.id, title: strongest.title, signal: strongest.signal_strength || 0 } : null,
      weakest_deck: weakest ? { id: weakest.id, title: weakest.title, signal: weakest.signal_strength || 0 } : null,
      decks_needing_attention: decks.filter(d => (d.signal_strength || 0) < 50).length,
    };
  }, [decks]);

  // ============================================================================
  // Deck Actions
  // ============================================================================

  const duplicateDeck = useCallback(async (deckId: string) => {
    try {
      const deck = decks.find(d => d.id === deckId);
      if (!deck) return;

      // Get original deck with slides
      const { data: original } = await supabase
        .from('pitch_decks')
        .select('*')
        .eq('id', deckId)
        .single();

      if (!original) throw new Error('Deck not found');

      // Get slides separately
      const { data: originalSlides } = await supabase
        .from('pitch_deck_slides')
        .select('*')
        .eq('deck_id', deckId);

      // Create copy
      const { data: newDeck, error: insertError } = await supabase
        .from('pitch_decks')
        .insert([{
          startup_id: original.startup_id,
          title: `${original.title} (Copy)`,
          status: 'draft' as const,
          template: original.template,
          metadata: original.metadata,
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Copy slides
      if (originalSlides && originalSlides.length > 0) {
        const slideCopies = originalSlides.map(s => ({
          deck_id: newDeck.id,
          slide_number: s.slide_number,
          slide_type: s.slide_type,
          title: s.title,
          subtitle: s.subtitle,
          content: s.content as Json,
          notes: s.notes,
          image_url: s.image_url,
        }));

        await supabase
          .from('pitch_deck_slides')
          .insert(slideCopies);
      }

      toast.success('Deck duplicated');
      fetchDecks();

      return newDeck;
    } catch (error) {
      console.error('Failed to duplicate deck:', error);
      toast.error('Failed to duplicate deck');
    }
  }, [decks, fetchDecks]);

  const deleteDeck = useCallback(async (deckId: string) => {
    try {
      // Delete slides first
      await supabase
        .from('pitch_deck_slides')
        .delete()
        .eq('deck_id', deckId);

      // Delete deck
      const { error } = await supabase
        .from('pitch_decks')
        .delete()
        .eq('id', deckId);

      if (error) throw error;

      setDecks(prev => prev.filter(d => d.id !== deckId));
      toast.success('Deck deleted');
    } catch (error) {
      console.error('Failed to delete deck:', error);
      toast.error('Failed to delete deck');
    }
  }, []);

  const archiveDeck = useCallback(async (deckId: string) => {
    try {
      const { error } = await supabase
        .from('pitch_decks')
        .update({ status: 'archived' })
        .eq('id', deckId);

      if (error) throw error;

      setDecks(prev => prev.map(d => 
        d.id === deckId ? { ...d, status: 'archived' as const } : d
      ));
      toast.success('Deck archived');
    } catch (error) {
      console.error('Failed to archive deck:', error);
      toast.error('Failed to archive deck');
    }
  }, []);

  return {
    decks: filteredDecks,
    allDecks: decks,
    isLoading,
    portfolioStats,

    // Filters
    filters,
    setFilters,
    sortBy,
    setSortBy,
    sortDesc,
    setSortDesc,

    // Actions
    fetchDecks,
    duplicateDeck,
    deleteDeck,
    archiveDeck,
  };
}
