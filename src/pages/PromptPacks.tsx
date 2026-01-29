/**
 * Prompt Packs Catalog Page
 * Browse, search, and run AI prompt packs
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Sparkles, Filter, LayoutGrid } from 'lucide-react';
import { useListPacks, useGetPack, type PromptPack, type PackWithSteps } from '@/hooks/usePromptPack';
import { PackCard, PackDetailModal, RunPackModal } from '@/components/prompt-pack';
import { useStartup } from '@/hooks/useDashboardData';

const CATEGORIES = ['all', 'validation', 'canvas', 'pitch', 'gtm', 'ideation'];
const STAGES = ['all', 'idea', 'pre-seed', 'seed', 'series-a'];

export default function PromptPacks() {
  const navigate = useNavigate();
  const { data: currentStartup } = useStartup();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [selectedPack, setSelectedPack] = useState<PromptPack | null>(null);
  const [runningPack, setRunningPack] = useState<PackWithSteps | null>(null);

  // Fetch all packs
  const { data: packsData, isLoading, error } = useListPacks(50);

  // Fetch selected pack details
  const { data: packDetail } = useGetPack(selectedPack?.id);

  // Filter packs based on search and filters
  const filteredPacks = useMemo(() => {
    if (!packsData?.packs) return [];

    return packsData.packs.filter((pack) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          pack.title.toLowerCase().includes(query) ||
          pack.description?.toLowerCase().includes(query) ||
          pack.slug.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && pack.category !== categoryFilter) {
        return false;
      }

      // Stage filter
      if (stageFilter !== 'all') {
        if (!pack.stage_tags?.includes(stageFilter)) {
          return false;
        }
      }

      return true;
    });
  }, [packsData?.packs, searchQuery, categoryFilter, stageFilter]);

  // Group by category for display
  const packsByCategory = useMemo(() => {
    const grouped: Record<string, PromptPack[]> = {};
    filteredPacks.forEach((pack) => {
      if (!grouped[pack.category]) {
        grouped[pack.category] = [];
      }
      grouped[pack.category].push(pack);
    });
    return grouped;
  }, [filteredPacks]);

  const handleSelectPack = (pack: PromptPack) => {
    setSelectedPack(pack);
  };

  const handleRunPack = (pack: PackWithSteps) => {
    if (!currentStartup?.id) {
      navigate('/login?redirect=/prompt-packs');
      return;
    }
    setSelectedPack(null);
    setRunningPack(pack);
  };

  const handleApplySuccess = () => {
    // Could refresh dashboard data here
    setRunningPack(null);
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load prompt packs. Please try again.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Prompt Packs</h1>
          </div>
          <p className="text-muted-foreground">
            AI-powered workflows to validate, plan, and grow your startup
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {packsData?.total || 0} packs available
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search packs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-[140px]">
              <LayoutGrid className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              {STAGES.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage === 'all' ? 'All Stages' : stage.charAt(0).toUpperCase() + stage.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px] rounded-lg" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredPacks.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No packs found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search query
          </p>
          <Button 
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setStageFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Packs grid - grouped by category when no filter */}
      {!isLoading && filteredPacks.length > 0 && (
        <div className="space-y-8">
          {categoryFilter === 'all' ? (
            // Grouped view
            Object.entries(packsByCategory).map(([category, packs]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-lg font-semibold capitalize">{category}</h2>
                  <Badge variant="secondary">{packs.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {packs.map((pack) => (
                    <PackCard
                      key={pack.id}
                      pack={pack}
                      onSelect={handleSelectPack}
                      onRun={currentStartup ? (p) => handleRunPack(p as PackWithSteps) : undefined}
                      isSelected={selectedPack?.id === pack.id}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Flat view
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPacks.map((pack) => (
                <PackCard
                  key={pack.id}
                  pack={pack}
                  onSelect={handleSelectPack}
                  onRun={currentStartup ? (p) => handleRunPack(p as PackWithSteps) : undefined}
                  isSelected={selectedPack?.id === pack.id}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pack Detail Modal */}
      <PackDetailModal
        pack={packDetail?.pack || null}
        isOpen={!!selectedPack}
        onClose={() => setSelectedPack(null)}
        onRun={handleRunPack}
      />

      {/* Run Pack Modal */}
      <RunPackModal
        pack={runningPack}
        startupId={currentStartup?.id || ''}
        isOpen={!!runningPack}
        onClose={() => setRunningPack(null)}
        onApplySuccess={handleApplySuccess}
      />
    </div>
  );
}
