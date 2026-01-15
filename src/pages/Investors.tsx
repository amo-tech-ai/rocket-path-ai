import { useState, useMemo } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { TrendingUp, Plus, Search, LayoutGrid, List, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllInvestors, useStartupForInvestors, Investor, INVESTOR_STATUSES, INVESTOR_TYPES } from "@/hooks/useInvestors";
import { InvestorPipeline } from "@/components/investors/InvestorPipeline";
import { InvestorCard } from "@/components/investors/InvestorCard";
import { InvestorDialog } from "@/components/investors/InvestorDialog";
import { InvestorDetailSheet } from "@/components/investors/InvestorDetailSheet";
import { FundraisingProgress } from "@/components/investors/FundraisingProgress";

const Investors = () => {
  const { data: investors = [], isLoading: investorsLoading } = useAllInvestors();
  const { data: startup, isLoading: startupLoading } = useStartupForInvestors();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'pipeline' | 'list'>('pipeline');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [editingInvestor, setEditingInvestor] = useState<Investor | null>(null);

  const filteredInvestors = useMemo(() => {
    return investors.filter(investor => {
      const matchesSearch = !searchQuery || 
        investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        investor.firm_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        investor.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || investor.status === statusFilter;
      const matchesType = typeFilter === 'all' || investor.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [investors, searchQuery, statusFilter, typeFilter]);

  const handleInvestorClick = (investor: Investor) => {
    setSelectedInvestor(investor);
    setDetailSheetOpen(true);
  };

  const handleEditInvestor = () => {
    setEditingInvestor(selectedInvestor);
    setDetailSheetOpen(false);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingInvestor(null);
    setDialogOpen(true);
  };

  const isLoading = investorsLoading || startupLoading;

  // Empty state
  if (!isLoading && investors.length === 0) {
    return (
      <DashboardLayout>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center py-20"
        >
          <div className="w-16 h-16 rounded-2xl bg-sage-light flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-8 h-8 text-sage" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Investor Pipeline</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Track investors, manage outreach, log meetings, and monitor your 
            fundraise progress.
          </p>
          <Button variant="hero" size="lg" onClick={handleAddNew}>
            <Plus className="w-5 h-5" />
            Add your first investor
          </Button>
        </motion.div>

        {startup && (
          <InvestorDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            investor={editingInvestor}
            startupId={startup.id}
          />
        )}
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Investor Pipeline</h1>
            <p className="text-muted-foreground">
              {investors.length} investor{investors.length !== 1 ? 's' : ''} tracked
            </p>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" />
            Add Investor
          </Button>
        </div>

        {/* Fundraising Progress */}
        {isLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <FundraisingProgress startup={startup || null} investors={investors} />
        )}

        {/* Filters & View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search investors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {INVESTOR_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {INVESTOR_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'pipeline' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('pipeline')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : viewMode === 'pipeline' ? (
          <InvestorPipeline
            investors={filteredInvestors}
            onInvestorClick={handleInvestorClick}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInvestors.map((investor) => (
              <InvestorCard
                key={investor.id}
                investor={investor}
                onClick={() => handleInvestorClick(investor)}
              />
            ))}
            {filteredInvestors.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No investors match your filters
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Dialogs */}
      {startup && (
        <InvestorDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          investor={editingInvestor}
          startupId={startup.id}
        />
      )}

      <InvestorDetailSheet
        investor={selectedInvestor}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onEdit={handleEditInvestor}
      />
    </DashboardLayout>
  );
};

export default Investors;
