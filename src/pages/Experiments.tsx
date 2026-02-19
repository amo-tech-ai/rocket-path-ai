import { useState, useMemo } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Beaker, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useExperiments, useUpdateExperiment, useDeleteExperiment } from "@/hooks/useExperiments";
import { useStartup } from "@/hooks/useDashboardData";
import { ExperimentCard } from "@/components/experiments/ExperimentCard";
import { CreateExperimentDialog } from "@/components/experiments/CreateExperimentDialog";
import { useToast } from "@/hooks/use-toast";
import type { Experiment } from "@/hooks/useExperiments";

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'designed', label: 'Designed' },
  { value: 'recruiting', label: 'Recruiting' },
  { value: 'running', label: 'Running' },
  { value: 'collecting', label: 'Collecting' },
  { value: 'analyzing', label: 'Analyzing' },
  { value: 'completed', label: 'Completed' },
  { value: 'paused', label: 'Paused' },
  { value: 'cancelled', label: 'Cancelled' },
];

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'customer_interview', label: 'Interview' },
  { value: 'survey', label: 'Survey' },
  { value: 'landing_page', label: 'Landing Page' },
  { value: 'prototype_test', label: 'Prototype' },
  { value: 'concierge', label: 'Concierge' },
  { value: 'wizard_of_oz', label: 'Wizard of Oz' },
  { value: 'smoke_test', label: 'Smoke Test' },
  { value: 'a_b_test', label: 'A/B Test' },
  { value: 'fake_door', label: 'Fake Door' },
  { value: 'other', label: 'Other' },
];

const Experiments = () => {
  const { data: startup, isLoading: startupLoading } = useStartup();
  const { data: experiments = [], isLoading: experimentsLoading } = useExperiments(startup?.id);
  const updateExperiment = useUpdateExperiment();
  const deleteExperiment = useDeleteExperiment();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = useMemo(() => {
    return experiments.filter((e) => {
      const matchesSearch = !searchQuery ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.hypothesis.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
      const matchesType = typeFilter === 'all' || e.experiment_type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [experiments, searchQuery, statusFilter, typeFilter]);

  const handleStatusChange = async (id: string, status: Experiment['status']) => {
    try {
      await updateExperiment.mutateAsync({ id, status });
      toast({ title: `Experiment ${status}` });
    } catch {
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExperiment.mutateAsync(id);
      toast({ title: "Experiment deleted" });
    } catch {
      toast({ title: "Failed to delete experiment", variant: "destructive" });
    }
  };

  const isLoading = startupLoading || experimentsLoading;

  const startupContext = startup ? {
    name: startup.name || '',
    industry: startup.industry || '',
    stage: startup.stage || '',
    description: startup.description || '',
  } : { name: '', industry: '', stage: '', description: '' };

  if (!isLoading && experiments.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Beaker className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Experiments Lab</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Design your first experiment to test assumptions about your startup.
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Experiment
          </Button>
          {startup && (
            <CreateExperimentDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              startupId={startup.id}
              startupContext={startupContext}
            />
          )}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Experiments Lab</h1>
            <Badge variant="secondary">{experiments.length}</Badge>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Experiment
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search experiments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No experiments match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((experiment) => (
              <ExperimentCard
                key={experiment.id}
                experiment={experiment}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onClick={() => {}}
              />
            ))}
          </div>
        )}
      </div>

      {startup && (
        <CreateExperimentDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          startupId={startup.id}
          startupContext={startupContext}
        />
      )}
    </DashboardLayout>
  );
};

export default Experiments;
