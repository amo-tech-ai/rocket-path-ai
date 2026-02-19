/**
 * AssumptionBoard — Risk & Assumption Board with kanban columns by status,
 * risk matrix visualization, and CRUD operations.
 */
import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertTriangle,
  Plus,
  Search,
  Target,
  CheckCircle2,
  XCircle,
  Clock,
  Archive,
  FlaskConical,
  Pencil,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useStartup } from '@/hooks/useDashboardData';
import {
  useAssumptions,
  useCreateAssumption,
  useUpdateAssumption,
  useDeleteAssumption,
} from '@/hooks/useExperiments';

/* ──────────────────────── Constants ──────────────────────── */

const STATUS_CONFIG = {
  untested: { label: 'Untested', icon: Clock, color: 'bg-muted text-muted-foreground' },
  testing: { label: 'Testing', icon: FlaskConical, color: 'bg-blue-500/10 text-blue-600' },
  validated: { label: 'Validated', icon: CheckCircle2, color: 'bg-emerald-500/10 text-emerald-600' },
  invalidated: { label: 'Invalidated', icon: XCircle, color: 'bg-destructive/10 text-destructive' },
  obsolete: { label: 'Obsolete', icon: Archive, color: 'bg-muted text-muted-foreground/50' },
} as const;

type AssumptionStatus = keyof typeof STATUS_CONFIG;

const SOURCE_OPTIONS = [
  { value: 'problem', label: 'Problem' },
  { value: 'solution', label: 'Solution' },
  { value: 'unique_value_proposition', label: 'Value Prop' },
  { value: 'unfair_advantage', label: 'Unfair Advantage' },
  { value: 'customer_segments', label: 'Customers' },
  { value: 'channels', label: 'Channels' },
  { value: 'revenue_streams', label: 'Revenue' },
  { value: 'cost_structure', label: 'Costs' },
  { value: 'key_metrics', label: 'Key Metrics' },
];

const KANBAN_COLUMNS: AssumptionStatus[] = ['untested', 'testing', 'validated', 'invalidated'];

/* ──────────────────────── Types ──────────────────────── */

interface Assumption {
  id: string;
  startup_id: string;
  source_block: string;
  statement: string;
  impact_score: number;
  uncertainty_score: number;
  priority_score: number;
  status: AssumptionStatus;
  risk_score: number | null;
  evidence_count: number | null;
  notes: string | null;
  ai_extracted: boolean | null;
  created_at: string;
}

/* ──────────────────────── Sub-components ──────────────────────── */

function AssumptionCard({
  assumption,
  onEdit,
  onStatusChange,
  onDelete,
}: {
  assumption: Assumption;
  onEdit: () => void;
  onStatusChange: (status: AssumptionStatus) => void;
  onDelete: () => void;
}) {
  const cfg = STATUS_CONFIG[assumption.status] || STATUS_CONFIG.untested;
  const sourceLabel = SOURCE_OPTIONS.find(s => s.value === assumption.source_block)?.label || assumption.source_block;
  const riskLevel = assumption.priority_score >= 50 ? 'high' : assumption.priority_score >= 25 ? 'medium' : 'low';

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug flex-1">{assumption.statement}</p>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={onDelete}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {sourceLabel}
          </Badge>
          {assumption.ai_extracted && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">AI</Badge>
          )}
          <Badge
            className={`text-[10px] px-1.5 py-0 ${
              riskLevel === 'high'
                ? 'bg-red-500/10 text-red-600 border-red-200'
                : riskLevel === 'medium'
                ? 'bg-yellow-500/10 text-yellow-600 border-yellow-200'
                : 'bg-emerald-500/10 text-emerald-600 border-emerald-200'
            }`}
            variant="outline"
          >
            Risk: {assumption.priority_score}
          </Badge>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>Impact: {assumption.impact_score}/10</span>
          <span>Uncertainty: {assumption.uncertainty_score}/10</span>
          {(assumption.evidence_count ?? 0) > 0 && (
            <span>{assumption.evidence_count} evidence</span>
          )}
        </div>

        {/* Quick status change */}
        <div className="flex gap-1 pt-1">
          {KANBAN_COLUMNS.filter(s => s !== assumption.status).map(status => {
            const sc = STATUS_CONFIG[status];
            const Icon = sc.icon;
            return (
              <Button
                key={status}
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[10px]"
                onClick={() => onStatusChange(status)}
              >
                <Icon className="w-3 h-3 mr-1" />
                {sc.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function RiskMatrix({ assumptions }: { assumptions: Assumption[] }) {
  const active = assumptions.filter(a => a.status !== 'obsolete');

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Target className="w-4 h-4" />
          Risk Matrix (Impact vs Uncertainty)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-square max-w-[400px] mx-auto border rounded-lg overflow-hidden">
          {/* Quadrant labels */}
          <div className="absolute top-1 left-1 text-[9px] text-muted-foreground">Low Priority</div>
          <div className="absolute top-1 right-1 text-[9px] text-red-500 font-medium">Critical</div>
          <div className="absolute bottom-1 left-1 text-[9px] text-emerald-500">Safe</div>
          <div className="absolute bottom-1 right-1 text-[9px] text-muted-foreground">Monitor</div>

          {/* Grid lines */}
          <div className="absolute inset-0 border-r border-b border-dashed border-muted-foreground/20" style={{ width: '50%', height: '50%' }} />

          {/* Axis labels */}
          <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground pb-0.5">
            Uncertainty &rarr;
          </div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] text-muted-foreground">
            Impact &rarr;
          </div>

          {/* Dots */}
          {active.map(a => {
            const x = ((a.uncertainty_score - 1) / 9) * 90 + 5;
            const y = (1 - (a.impact_score - 1) / 9) * 90 + 5;
            const statusColor =
              a.status === 'validated' ? '#10b981' :
              a.status === 'invalidated' ? '#ef4444' :
              a.status === 'testing' ? '#3b82f6' : '#94a3b8';

            return (
              <div
                key={a.id}
                className="absolute w-3 h-3 rounded-full border-2 border-background shadow-sm cursor-pointer -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  backgroundColor: statusColor,
                }}
                title={`${a.statement}\nImpact: ${a.impact_score}, Uncertainty: ${a.uncertainty_score}`}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function CreateAssumptionDialog({
  startupId,
  onCreated,
}: {
  startupId: string;
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [statement, setStatement] = useState('');
  const [sourceBlock, setSourceBlock] = useState('problem');
  const [impact, setImpact] = useState(5);
  const [uncertainty, setUncertainty] = useState(5);
  const [notes, setNotes] = useState('');
  const createMutation = useCreateAssumption();

  const handleCreate = async () => {
    if (!statement.trim()) return;
    try {
      await createMutation.mutateAsync({
        startup_id: startupId,
        source_block: sourceBlock,
        statement: statement.trim(),
        impact_score: impact,
        uncertainty_score: uncertainty,
        notes: notes.trim() || undefined,
      });
      toast.success('Assumption created');
      setStatement('');
      setNotes('');
      setImpact(5);
      setUncertainty(5);
      setOpen(false);
      onCreated();
    } catch {
      toast.error('Failed to create assumption');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Assumption
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Assumption</DialogTitle>
          <DialogDescription>Add a business assumption to track and validate.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <label htmlFor="create-assumption-statement" className="text-sm font-medium">Assumption Statement</label>
            <Textarea
              id="create-assumption-statement"
              placeholder="e.g. Our target customers will pay $X/mo for this solution"
              value={statement}
              onChange={e => setStatement(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="create-assumption-source" className="text-sm font-medium">Source (Canvas Block)</label>
            <Select value={sourceBlock} onValueChange={setSourceBlock}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOURCE_OPTIONS.map(o => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Impact</label>
                <span className="text-sm text-muted-foreground">{impact}/10</span>
              </div>
              <Slider value={[impact]} onValueChange={([v]) => setImpact(v)} min={1} max={10} step={1} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Uncertainty</label>
                <span className="text-sm text-muted-foreground">{uncertainty}/10</span>
              </div>
              <Slider value={[uncertainty]} onValueChange={([v]) => setUncertainty(v)} min={1} max={10} step={1} />
            </div>
          </div>

          <div className="p-2 rounded bg-muted/50 text-center text-sm">
            Priority Score: <span className="font-bold">{impact * uncertainty}</span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <Textarea
              placeholder="Additional context..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <Button onClick={handleCreate} disabled={!statement.trim() || createMutation.isPending} className="w-full">
            {createMutation.isPending ? 'Creating...' : 'Create Assumption'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditAssumptionDialog({
  assumption,
  open,
  onClose,
}: {
  assumption: Assumption;
  open: boolean;
  onClose: () => void;
}) {
  const [statement, setStatement] = useState(assumption.statement);
  const [sourceBlock, setSourceBlock] = useState(assumption.source_block);
  const [impact, setImpact] = useState(assumption.impact_score);
  const [uncertainty, setUncertainty] = useState(assumption.uncertainty_score);
  const [notes, setNotes] = useState(assumption.notes || '');
  const updateMutation = useUpdateAssumption();

  // Sync state when assumption changes
  const [prevId, setPrevId] = useState(assumption.id);
  if (assumption.id !== prevId) {
    setPrevId(assumption.id);
    setStatement(assumption.statement);
    setSourceBlock(assumption.source_block);
    setImpact(assumption.impact_score);
    setUncertainty(assumption.uncertainty_score);
    setNotes(assumption.notes || '');
  }

  const handleSave = async () => {
    if (!statement.trim()) return;
    try {
      await updateMutation.mutateAsync({
        id: assumption.id,
        statement: statement.trim(),
        source_block: sourceBlock,
        impact_score: impact,
        uncertainty_score: uncertainty,
        priority_score: impact * uncertainty,
        notes: notes.trim() || null,
      });
      toast.success('Assumption updated');
      onClose();
    } catch {
      toast.error('Failed to update assumption');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Assumption</DialogTitle>
          <DialogDescription>Modify this assumption's details and risk scores.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <label htmlFor="edit-assumption-statement" className="text-sm font-medium">Assumption Statement</label>
            <Textarea
              id="edit-assumption-statement"
              placeholder="e.g. Our target customers will pay $X/mo for this solution"
              value={statement}
              onChange={e => setStatement(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-assumption-source" className="text-sm font-medium">Source (Canvas Block)</label>
            <Select value={sourceBlock} onValueChange={setSourceBlock}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOURCE_OPTIONS.map(o => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Impact</label>
                <span className="text-sm text-muted-foreground">{impact}/10</span>
              </div>
              <Slider value={[impact]} onValueChange={([v]) => setImpact(v)} min={1} max={10} step={1} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Uncertainty</label>
                <span className="text-sm text-muted-foreground">{uncertainty}/10</span>
              </div>
              <Slider value={[uncertainty]} onValueChange={([v]) => setUncertainty(v)} min={1} max={10} step={1} />
            </div>
          </div>

          <div className="p-2 rounded bg-muted/50 text-center text-sm">
            Priority Score: <span className="font-bold">{impact * uncertainty}</span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <Textarea
              placeholder="Additional context..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <Button onClick={handleSave} disabled={!statement.trim() || updateMutation.isPending} className="w-full">
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ──────────────────────── Main Page ──────────────────────── */

const AssumptionBoard = () => {
  const { data: startup, isLoading: startupLoading } = useStartup();
  const { data: assumptions = [], isLoading: assumptionsLoading, refetch } = useAssumptions(startup?.id);
  const updateMutation = useUpdateAssumption();
  const deleteMutation = useDeleteAssumption();

  const [search, setSearch] = useState('');
  const [filterSource, setFilterSource] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loading = startupLoading || assumptionsLoading;

  const filtered = useMemo(() => {
    let result = assumptions as Assumption[];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(a => a.statement.toLowerCase().includes(q));
    }
    if (filterSource !== 'all') {
      result = result.filter(a => a.source_block === filterSource);
    }
    return result;
  }, [assumptions, search, filterSource]);

  const byStatus = useMemo(() => {
    const map: Record<AssumptionStatus, Assumption[]> = {
      untested: [], testing: [], validated: [], invalidated: [], obsolete: [],
    };
    for (const a of filtered) {
      (map[a.status as AssumptionStatus] || map.untested).push(a);
    }
    // Sort each column by priority_score DESC
    for (const key of Object.keys(map) as AssumptionStatus[]) {
      map[key].sort((a, b) => b.priority_score - a.priority_score);
    }
    return map;
  }, [filtered]);

  const stats = useMemo(() => {
    const all = assumptions as Assumption[];
    return {
      total: all.length,
      untested: all.filter(a => a.status === 'untested').length,
      testing: all.filter(a => a.status === 'testing').length,
      validated: all.filter(a => a.status === 'validated').length,
      invalidated: all.filter(a => a.status === 'invalidated').length,
      avgRisk: all.length > 0
        ? Math.round(all.reduce((s, a) => s + a.priority_score, 0) / all.length)
        : 0,
    };
  }, [assumptions]);

  const handleStatusChange = async (id: string, status: AssumptionStatus) => {
    try {
      await updateMutation.mutateAsync({
        id,
        status,
        ...(status === 'validated' || status === 'invalidated' ? { tested_at: new Date().toISOString() } : {}),
      });
      toast.success(`Moved to ${STATUS_CONFIG[status].label}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteMutation.mutateAsync(deleteConfirmId);
      toast.success('Assumption deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Risk & Assumption Board
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track, test, and validate your riskiest assumptions
            </p>
          </div>
          {startup && (
            <CreateAssumptionDialog startupId={startup.id} onCreated={() => refetch()} />
          )}
        </div>

        {/* Stats row */}
        {!loading && stats.total > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Untested</p>
              <p className="text-xl font-bold text-muted-foreground">{stats.untested}</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Testing</p>
              <p className="text-xl font-bold text-blue-600">{stats.testing}</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Validated</p>
              <p className="text-xl font-bold text-emerald-600">{stats.validated}</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Avg Risk</p>
              <p className="text-xl font-bold">{stats.avgRisk}</p>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search assumptions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterSource} onValueChange={setFilterSource}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {SOURCE_OPTIONS.map(o => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Main content tabs */}
        <Tabs defaultValue="board">
          <TabsList>
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="matrix">Risk Matrix</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>

          {/* Kanban Board */}
          <TabsContent value="board">
            {loading ? (
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {KANBAN_COLUMNS.map(status => {
                  const cfg = STATUS_CONFIG[status];
                  const Icon = cfg.icon;
                  const items = byStatus[status];

                  return (
                    <div key={status} className="space-y-3">
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${cfg.color}`}>
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{cfg.label}</span>
                        <Badge variant="secondary" className="ml-auto text-[10px]">
                          {items.length}
                        </Badge>
                      </div>
                      <ScrollArea className="max-h-[600px]">
                        <div className="space-y-2 pr-2">
                          {items.map(a => (
                            <AssumptionCard
                              key={a.id}
                              assumption={a}
                              onEdit={() => setEditingId(a.id)}
                              onStatusChange={s => handleStatusChange(a.id, s)}
                              onDelete={() => setDeleteConfirmId(a.id)}
                            />
                          ))}
                          {items.length === 0 && (
                            <p className="text-xs text-muted-foreground text-center py-8">
                              No assumptions
                            </p>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Risk Matrix */}
          <TabsContent value="matrix">
            {loading ? (
              <Skeleton className="h-[450px]" />
            ) : (
              <RiskMatrix assumptions={filtered as Assumption[]} />
            )}
          </TabsContent>

          {/* List View */}
          <TabsContent value="list">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16" />)}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Assumption</th>
                          <th className="text-left p-3 font-medium w-24">Source</th>
                          <th className="text-center p-3 font-medium w-20">Impact</th>
                          <th className="text-center p-3 font-medium w-24">Uncertainty</th>
                          <th className="text-center p-3 font-medium w-20">Priority</th>
                          <th className="text-center p-3 font-medium w-24">Status</th>
                          <th className="text-right p-3 font-medium w-20">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-12 text-muted-foreground">
                              No assumptions yet. Add your first assumption above.
                            </td>
                          </tr>
                        ) : (
                          (filtered as Assumption[]).map(a => {
                            const cfg = STATUS_CONFIG[a.status] || STATUS_CONFIG.untested;
                            const Icon = cfg.icon;
                            const sourceLabel = SOURCE_OPTIONS.find(s => s.value === a.source_block)?.label || a.source_block;
                            return (
                              <tr key={a.id} className="border-b hover:bg-muted/30">
                                <td className="p-3">
                                  <p className="font-medium">{a.statement}</p>
                                  {a.notes && (
                                    <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-md">{a.notes}</p>
                                  )}
                                </td>
                                <td className="p-3">
                                  <Badge variant="outline" className="text-[10px]">{sourceLabel}</Badge>
                                </td>
                                <td className="p-3 text-center font-medium">{a.impact_score}</td>
                                <td className="p-3 text-center font-medium">{a.uncertainty_score}</td>
                                <td className="p-3 text-center">
                                  <span className={`font-bold ${a.priority_score >= 50 ? 'text-red-600' : a.priority_score >= 25 ? 'text-yellow-600' : 'text-emerald-600'}`}>
                                    {a.priority_score}
                                  </span>
                                </td>
                                <td className="p-3 text-center">
                                  <Badge className={`${cfg.color} text-[10px]`} variant="outline">
                                    <Icon className="w-3 h-3 mr-1" />
                                    {cfg.label}
                                  </Badge>
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingId(a.id)}>
                                      <Pencil className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteConfirmId(a.id)}>
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        {editingId && (() => {
          const editing = (assumptions as Assumption[]).find(a => a.id === editingId);
          if (!editing) return null;
          return (
            <EditAssumptionDialog
              assumption={editing}
              open={!!editingId}
              onClose={() => setEditingId(null)}
            />
          );
        })()}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => { if (!open) setDeleteConfirmId(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Assumption</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this assumption and all associated data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default AssumptionBoard;
