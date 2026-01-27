/**
 * Pitch Decks Dashboard Page
 * Lists all decks with filters and AI portfolio insights
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  FileText,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Clock,
  Copy,
  Trash2,
  Archive,
  Download,
  Edit,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { usePitchDecks, type PitchDeckSummary, type DeckFilters, type SortOption } from '@/hooks/usePitchDecks';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700', icon: Edit },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Clock },
  generating: { label: 'Generating', color: 'bg-purple-100 text-purple-700', icon: Loader2 },
  review: { label: 'Review', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  final: { label: 'Final', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  archived: { label: 'Archived', color: 'bg-slate-100 text-slate-500', icon: Archive },
};

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

  const aiPanel = (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Portfolio Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Decks</span>
            <span className="font-semibold">{portfolioStats.total_decks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Avg Signal</span>
            <span className={cn(
              "font-semibold",
              portfolioStats.average_signal >= 70 ? "text-green-600" :
              portfolioStats.average_signal >= 50 ? "text-yellow-600" : "text-red-600"
            )}>
              {portfolioStats.average_signal}%
            </span>
          </div>
          
          {portfolioStats.strongest_deck && (
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-muted-foreground">Strongest:</span>
              </div>
              <Link 
                to={`/app/pitch-deck/${portfolioStats.strongest_deck.id}/edit`}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {portfolioStats.strongest_deck.title} ({portfolioStats.strongest_deck.signal}%)
              </Link>
            </div>
          )}
          
          {portfolioStats.weakest_deck && portfolioStats.decks_needing_attention > 0 && (
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2 text-sm">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="text-muted-foreground">Needs Work:</span>
              </div>
              <Link 
                to={`/app/pitch-deck/${portfolioStats.weakest_deck.id}/edit`}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {portfolioStats.weakest_deck.title} ({portfolioStats.weakest_deck.signal}%)
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {allDecks.filter(d => d.status === 'in_progress').length > 0 && (
            <RecommendationItem
              title="Complete Your Draft"
              description={`You have ${allDecks.filter(d => d.status === 'in_progress').length} deck(s) in progress`}
              action="Resume"
              onClick={() => {
                const inProgress = allDecks.find(d => d.status === 'in_progress');
                if (inProgress) navigate(`/app/pitch-deck/${inProgress.id}`);
              }}
            />
          )}
          
          {portfolioStats.decks_needing_attention > 0 && (
            <RecommendationItem
              title="Improve Signal"
              description={`${portfolioStats.decks_needing_attention} deck(s) below 50% signal strength`}
              action="Review"
              onClick={() => handleStatusFilter('review')}
            />
          )}

          {allDecks.length === 0 && (
            <RecommendationItem
              title="Create Your First Deck"
              description="Start with our AI-powered wizard"
              action="Create"
              onClick={() => navigate('/app/pitch-deck/new')}
            />
          )}
        </CardContent>
      </Card>
    </div>
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
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search decks..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={filters.status} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="final">Final</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.dateRange} onValueChange={handleDateFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated_at">Recently Edited</SelectItem>
              <SelectItem value="created_at">Recently Created</SelectItem>
              <SelectItem value="title">Name A-Z</SelectItem>
              <SelectItem value="signal_strength">Signal Strength</SelectItem>
            </SelectContent>
          </Select>
        </div>

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

// Helper Components

function DeckCard({ 
  deck, 
  onEdit, 
  onDuplicate, 
  onArchive, 
  onDelete 
}: { 
  deck: PitchDeckSummary;
  onEdit: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  const status = STATUS_CONFIG[deck.status] || STATUS_CONFIG.draft;
  const StatusIcon = status.icon;

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all hover:shadow-md",
        deck.status === 'in_progress' && "border-dashed"
      )}
      onClick={onEdit}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-lg flex items-center justify-center relative">
        <FileText className="w-12 h-12 text-slate-600" />
        {deck.status === 'in_progress' && (
          <Badge className="absolute top-2 left-2 bg-blue-500 text-white">
            Resume
          </Badge>
        )}
        {deck.status === 'generating' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold truncate flex-1">{deck.title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Export
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(); }}>
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Badge variant="outline" className={cn("text-xs", status.color)}>
            <StatusIcon className={cn("w-3 h-3 mr-1", deck.status === 'generating' && "animate-spin")} />
            {status.label}
          </Badge>
          <span className="text-xs">
            {deck.slide_count} {deck.slide_count === 1 ? 'slide' : 'slides'}
          </span>
        </div>

        {/* Signal Strength Bar */}
        {deck.signal_strength !== null && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Signal</span>
              <span className={cn(
                "font-medium",
                deck.signal_strength >= 70 ? "text-green-600" :
                deck.signal_strength >= 50 ? "text-yellow-600" : "text-red-600"
              )}>
                {deck.signal_strength}%
              </span>
            </div>
            <Progress 
              value={deck.signal_strength} 
              className={cn(
                "h-1.5",
                deck.signal_strength >= 70 ? "[&>div]:bg-green-500" :
                deck.signal_strength >= 50 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-red-500"
              )}
            />
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Updated {formatDistanceToNow(new Date(deck.updated_at), { addSuffix: true })}
        </p>
      </CardContent>
    </Card>
  );
}

function EmptyState({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <FileText className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No pitch decks yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Create your first AI-powered pitch deck to impress investors
      </p>
      <Button onClick={onCreateNew}>
        <Plus className="w-4 h-4 mr-2" />
        Create New Deck
      </Button>
    </div>
  );
}

function RecommendationItem({ 
  title, 
  description, 
  action, 
  onClick 
}: { 
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/50">
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Button size="sm" variant="outline" onClick={onClick}>
        {action}
      </Button>
    </div>
  );
}
