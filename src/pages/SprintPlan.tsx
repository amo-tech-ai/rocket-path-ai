import { useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Target, Plus, ArrowRight, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useCampaigns, useSprints, useCreateSprint, useCompleteSprint } from "@/hooks/useSprints";
import { useStartup } from "@/hooks/useDashboardData";
import { useSprintAgent } from "@/hooks/useSprintAgent";
import { SprintCard } from "@/components/sprints/SprintCard";
import { SprintTimeline } from "@/components/sprints/SprintTimeline";
import { PDCAEditor } from "@/components/sprints/PDCAEditor";
import { KanbanBoard } from "@/components/sprints/KanbanBoard";
import { PlannerPanel } from "@/components/sprints/PlannerPanel";
import { SprintReview } from "@/components/sprints/SprintReview";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import type { Sprint } from "@/hooks/useSprints";

type ViewMode = 'kanban' | 'list';

const SprintPlan = () => {
  const { data: startup, isLoading: startupLoading } = useStartup();
  const { data: campaigns = [], isLoading: campaignsLoading } = useCampaigns(startup?.id);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const { data: sprints = [], isLoading: sprintsLoading } = useSprints(selectedCampaignId || undefined);
  const createSprint = useCreateSprint();
  const completeSprint = useCompleteSprint();
  const { toast } = useToast();

  const [expandedSprint, setExpandedSprint] = useState<string | null>(null);
  const [newSprintDialog, setNewSprintDialog] = useState(false);
  const [newPurpose, setNewPurpose] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [sprintFilter, setSprintFilter] = useState<number | undefined>(undefined);
  const [reviewSprint, setReviewSprint] = useState<Sprint | null>(null);

  // AI Sprint Agent
  const {
    tasks: kanbanTasks,
    tasksByColumn,
    isGenerating,
    generateTasks,
    moveTask,
    hasTasks,
  } = useSprintAgent(startup?.id, selectedCampaignId || undefined);

  // Auto-select first campaign
  if (campaigns.length > 0 && !selectedCampaignId) {
    setSelectedCampaignId(campaigns[0].id);
  }

  const handleCreateSprint = async () => {
    if (!selectedCampaignId || !newPurpose) return;
    try {
      const nextNumber = sprints.length > 0 ? Math.max(...sprints.map(s => s.sprint_number)) + 1 : 1;
      await createSprint.mutateAsync({
        campaign_id: selectedCampaignId,
        sprint_number: nextNumber,
        purpose: newPurpose,
      });
      toast({ title: "Sprint created" });
      setNewPurpose('');
      setNewSprintDialog(false);
    } catch {
      toast({ title: "Failed to create sprint", variant: "destructive" });
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await completeSprint.mutateAsync(id);
      toast({ title: "Sprint completed" });
    } catch {
      toast({ title: "Failed to complete sprint", variant: "destructive" });
    }
  };

  const isLoading = startupLoading || campaignsLoading;

  // Right panel: AI Planner
  const rightPanel = startup?.id ? (
    <PlannerPanel
      tasks={kanbanTasks}
      tasksByColumn={tasksByColumn}
      isGenerating={isGenerating}
      hasTasks={hasTasks}
      onGenerate={generateTasks}
      sprintFilter={sprintFilter}
      onSprintFilter={setSprintFilter}
    />
  ) : null;

  // No startup empty state
  if (!isLoading && campaigns.length === 0 && !startup) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">90-Day Plan</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Run a validation first to create a campaign, then plan your sprints here.
          </p>
          <Button asChild>
            <Link to="/validate"><ArrowRight className="h-4 w-4 mr-2" /> Go to Validator</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout aiPanel={rightPanel}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">90-Day Validation Plan</h1>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 ${viewMode === 'kanban' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                title="Kanban view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {campaigns.length > 0 && (
              <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select campaign" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name || 'Unnamed Campaign'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {selectedCampaignId && viewMode === 'list' && (
              <Button onClick={() => setNewSprintDialog(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" /> New Sprint
              </Button>
            )}
          </div>
        </div>

        {/* Kanban View */}
        {viewMode === 'kanban' && (
          <>
            {hasTasks ? (
              <KanbanBoard
                tasks={kanbanTasks}
                tasksByColumn={tasksByColumn}
                onMoveTask={moveTask}
                sprintFilter={sprintFilter}
              />
            ) : (
              <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-xl">
                <Target className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                <h3 className="text-lg font-medium text-foreground mb-1">No tasks yet</h3>
                <p className="text-sm mb-4">Click "Generate Plan" in the right panel to create your 90-day validation plan.</p>
              </div>
            )}
          </>
        )}

        {/* List View (existing sprint cards) */}
        {viewMode === 'list' && (
          <>
            {/* Timeline */}
            {sprints.length > 0 && (
              <SprintTimeline
                sprints={sprints}
                activeSprint={expandedSprint || undefined}
                onSelect={(id) => setExpandedSprint(expandedSprint === id ? null : id)}
              />
            )}

            {/* Sprint List */}
            {sprintsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            ) : sprints.length === 0 && selectedCampaignId ? (
              <div className="text-center py-12 text-muted-foreground">
                No sprints yet. Create your first sprint to start planning.
              </div>
            ) : sprints.length === 0 && campaigns.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Run a validation first, then manage sprints in list view.
              </div>
            ) : (
              <div className="space-y-4">
                {sprints.map((sprint) => (
                  <SprintCard
                    key={sprint.id}
                    sprint={sprint}
                    isExpanded={expandedSprint === sprint.id}
                    onToggle={() => setExpandedSprint(expandedSprint === sprint.id ? null : sprint.id)}
                    onComplete={handleComplete}
                    onReview={setReviewSprint}
                  >
                    <PDCAEditor sprint={sprint} />
                  </SprintCard>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* New Sprint Dialog */}
      <Dialog open={newSprintDialog} onOpenChange={setNewSprintDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Sprint</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Sprint Purpose *</Label>
              <Input
                value={newPurpose}
                onChange={(e) => setNewPurpose(e.target.value)}
                placeholder="e.g. Validate customer willingness to pay"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNewSprintDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateSprint} disabled={!newPurpose || createSprint.isPending}>
                Create Sprint
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sprint Review Dialog */}
      {reviewSprint && (
        <SprintReview
          sprint={reviewSprint}
          tasks={kanbanTasks}
          open={!!reviewSprint}
          onOpenChange={(open) => { if (!open) setReviewSprint(null); }}
        />
      )}
    </DashboardLayout>
  );
};

export default SprintPlan;
