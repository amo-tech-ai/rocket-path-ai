/**
 * Industry Selection Screen
 * Grid of industry cards for onboarding Step 1
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { IndustryCard } from './IndustryCard';
import { StartupTypeSelector } from './StartupTypeSelector';
import { Skeleton } from '@/components/ui/skeleton';
import type { IndustryPack, StartupType } from '@/hooks/useIndustryPacks';

interface IndustrySelectionScreenProps {
  packs: IndustryPack[];
  selectedIndustry: string | null;
  selectedStartupType: StartupType | null;
  onSelectIndustry: (industry: string) => void;
  onSelectStartupType: (type: StartupType) => void;
  isLoading?: boolean;
}

export function IndustrySelectionScreen({
  packs,
  selectedIndustry,
  selectedStartupType,
  onSelectIndustry,
  onSelectStartupType,
  isLoading = false,
}: IndustrySelectionScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPacks = packs.filter(pack =>
    pack.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pack.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedPack = packs.find(p => p.industry === selectedIndustry);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium">Select Your Industry</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          AI coaching and benchmarks are customized for your industry
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search industries..."
          className="pl-10"
        />
      </div>

      {/* Industry Grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.05 }}
      >
        {filteredPacks.map((pack, index) => (
          <motion.div
            key={pack.industry}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <IndustryCard
              pack={pack}
              isSelected={selectedIndustry === pack.industry}
              onClick={() => onSelectIndustry(pack.industry)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Startup Type Selector (shown when industry is selected) */}
      {selectedPack && selectedPack.startup_types && selectedPack.startup_types.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
        >
          <StartupTypeSelector
            industryName={selectedPack.display_name}
            startupTypes={selectedPack.startup_types}
            selectedType={selectedStartupType}
            onSelect={onSelectStartupType}
          />
        </motion.div>
      )}
    </div>
  );
}
