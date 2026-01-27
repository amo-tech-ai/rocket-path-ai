/**
 * Pitch Decks Dashboard Page
 * Lists all decks with filters and AI portfolio insights
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { usePitchDecks } from '@/hooks/usePitchDecks';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DeckCard,
  DeckFiltersBar,
  PortfolioSummaryPanel,
  EmptyState,
} from '@/components/pitchdeck/dashboard';

export default function PitchDecksDashboard() {
  const navigate = useNavigate();
  const {
    decks,
    allDecks,
    isLoading,
    portfolioStats,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    duplicateDeck,
    deleteDeck,
    archiveDeck,
  } = usePitchDecks();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deckToDelete, setDeckToDelete] = useState<string | null>(null);

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleStatusFilter = (value: string) => {
    setFilters(prev => ({ ...prev, status: value }));
  };

  const handleDateFilter = (value: string) => {
    setFilters(prev => ({ ...prev, dateRange: value }));
  };

  const handleDeleteClick = (deckId: string) => {
    setDeckToDelete(deckId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deckToDelete) {
      await deleteDeck(deckToDelete);
      setDeleteDialogOpen(false);
      setDeckToDelete(null);
    }
  };

  const handleResumeInProgress = () => {
    const inProgress = allDecks.find(d => d.status === 'in_progress');
    if (inProgress) navigate(`/app/pitch-deck/${inProgress.id}`);
  };

  const aiPanel = (
    <PortfolioSummaryPanel
      portfolioStats={portfolioStats}
      allDecks={allDecks}
      onResumeInProgress={handleResumeInProgress}
      onFilterReview={() => handleStatusFilter('review')}
      onCreateNew={() => navigate('/app/pitch-deck/new')}
    />
  );

  return (
    <DashboardLayout aiPanel={aiPanel}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Pitch Decks</h1>
            <p className="text-muted-foreground text-sm">
              {decks.length} {decks.length === 1 ? 'deck' : 'decks'}
            </p>
          </div>
          <Button onClick={() => navigate('/app/pitch-deck/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Deck
          </Button>
        </div>

        {/* Filters */}
        <DeckFiltersBar
          filters={filters}
          sortBy={sortBy}
          onSearchChange={handleSearch}
          onStatusChange={handleStatusFilter}
          onDateRangeChange={handleDateFilter}
          onSortChange={setSortBy}
        />

        {/* Deck Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-0">
                  <Skeleton className="h-40 w-full rounded-t-lg" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : decks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                onEdit={() => navigate(`/app/pitch-deck/${deck.id}/edit`)}
                onDuplicate={() => duplicateDeck(deck.id)}
                onArchive={() => archiveDeck(deck.id)}
                onDelete={() => handleDeleteClick(deck.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState onCreateNew={() => navigate('/app/pitch-deck/new')} />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Pitch Deck</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the deck and all its slides. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
