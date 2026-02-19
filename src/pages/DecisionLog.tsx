/**
 * DecisionLog — Track startup decisions with evidence, outcomes, and timeline.
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Scale,
  Plus,
  Search,
  ChevronDown,
  Pencil,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Clock,
  RotateCcw,
  ArrowRightLeft,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useStartup } from '@/hooks/useDashboardData';
import {
  useDecisions,
  useCreateDecision,
  useUpdateDecision,
  useDeleteDecision,
  useDecisionEvidence,
  useAddEvidence,
  type Decision,
  type DecisionType,
  type DecisionStatus,
  type EvidenceType,
} from '@/hooks/useDecisions';

/* ──────────────────────── Constants ──────────────────────── */

const DECISION_TYPE_CONFIG: Record<DecisionType, { label: string; color: string }> = {
  pivot: { label: 'Pivot', color: 'bg-orange-500/10 text-orange-600 border-orange-200' },
  persevere: { label: 'Persevere', color: 'bg-blue-500/10 text-blue-600 border-blue-200' },
  launch: { label: 'Launch', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
  kill: { label: 'Kill', color: 'bg-red-500/10 text-red-600 border-red-200' },
  invest: { label: 'Invest', color: 'bg-purple-500/10 text-purple-600 border-purple-200' },
  partner: { label: 'Partner', color: 'bg-cyan-500/10 text-cyan-600 border-cyan-200' },
  hire: { label: 'Hire', color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200' },
  other: { label: 'Other', color: 'bg-muted text-muted-foreground' },
};

const STATUS_CONFIG: Record<DecisionStatus, { label: string; icon: typeof Clock; color: string }> = {
  active: { label: 'Active', icon: Clock, color: 'bg-emerald-500/10 text-emerald-600' },
  reversed: { label: 'Reversed', icon: RotateCcw, color: 'bg-orange-500/10 text-orange-600' },
  superseded: { label: 'Superseded', icon: ArrowRightLeft, color: 'bg-muted text-muted-foreground' },
};

const EVIDENCE_TYPES: { value: EvidenceType; label: string }[] = [
  { value: 'assumption', label: 'Assumption' },
  { value: 'experiment', label: 'Experiment' },
  { value: 'interview', label: 'Interview' },
  { value: 'metric', label: 'Metric' },
  { value: 'research', label: 'Research' },
  { value: 'other', label: 'Other' },
];

/* ──────────────────────── Sub-components ──────────────────────── */

function EvidenceSection({ decisionId }: { decisionId: string }) {
  const { data: evidence = [], isLoading } = useDecisionEvidence(decisionId);
  const addEvidence = useAddEvidence();
  const [adding, setAdding] = useState(false);
  const [evType, setEvType] = useState<EvidenceType>('research');
  const [summary, setSummary] = useState('');
  const [supports, setSupports] = useState(true);

  const handleAdd = async () => {
    if (!summary.trim()) return;
    try {
      await addEvidence.mutateAsync({
        decision_id: decisionId,
        evidence_type: evType,
        summary: summary.trim(),
        supports_decision: supports,
      });
      toast.success('Evidence added');
      setSummary('');
      setAdding(false);
    } catch {
      toast.error('Failed to add evidence');
    }
  };

  if (isLoading) return <Skeleton className="h-12" />;

  return (
    <div className="space-y-2 pt-2 border-t">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          Evidence ({evidence.length})
        </p>
        <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setAdding(!adding)}>
          <Plus className="w-3 h-3 mr-1" />
          Add
        </Button>
      </div>

      {adding && (
        <div className="space-y-2 p-2 rounded bg-muted/30">
          <div className="flex gap-2">
            <Select value={evType} onValueChange={(v) => setEvType(v as EvidenceType)}>
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVIDENCE_TYPES.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={supports ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setSupports(!supports)}
            >
              {supports ? <ThumbsUp className="w-3 h-3 mr-1" /> : <ThumbsDown className="w-3 h-3 mr-1" />}
              {supports ? 'Supports' : 'Contradicts'}
            </Button>
          </div>
          <Input
            placeholder="Describe the evidence..."
            value={summary}
            onChange={e => setSummary(e.target.value)}
            className="h-8 text-xs"
          />
          <div className="flex gap-2">
            <Button size="sm" className="h-7 text-xs" onClick={handleAdd} disabled={!summary.trim() || addEvidence.isPending}>
              Save
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {evidence.map(ev => (
        <div key={ev.id} className="flex items-start gap-2 text-xs">
          {ev.supports_decision ? (
            <ThumbsUp className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
          ) : (
            <ThumbsDown className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
          )}
          <div>
            <Badge variant="outline" className="text-[9px] px-1 py-0 mr-1">
              {EVIDENCE_TYPES.find(t => t.value === ev.evidence_type)?.label || ev.evidence_type}
            </Badge>
            <span className="text-muted-foreground">{ev.summary}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function DecisionCard({
  decision,
  onEdit,
  onDelete,
}: {
  decision: Decision;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const typeConfig = DECISION_TYPE_CONFIG[decision.decision_type] || DECISION_TYPE_CONFIG.other;
  const statusConfig = STATUS_CONFIG[decision.status] || STATUS_CONFIG.active;

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${typeConfig.color}`}>
                {typeConfig.label}
              </Badge>
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${statusConfig.color}`}>
                {statusConfig.label}
              </Badge>
              {decision.ai_suggested && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                  AI
                </Badge>
              )}
            </div>
            <h3 className="font-medium text-sm">{decision.title}</h3>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={onDelete}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {decision.reasoning && (
          <p className="text-xs text-muted-foreground line-clamp-2">{decision.reasoning}</p>
        )}

        {decision.outcome && (
          <div className="text-xs p-2 rounded bg-muted/30">
            <span className="font-medium">Outcome: </span>
            {decision.outcome}
          </div>
        )}

        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          {decision.decided_at && (
            <span>{format(new Date(decision.decided_at), 'MMM d, yyyy')}</span>
          )}
        </div>

        <Collapsible open={expanded} onOpenChange={setExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] w-full">
              <ChevronDown className={`w-3 h-3 mr-1 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              Evidence
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <EvidenceSection decisionId={decision.id} />
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

function CreateDecisionDialog({
  startupId,
  onCreated,
}: {
  startupId: string;
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [decisionType, setDecisionType] = useState<DecisionType>('persevere');
  const [reasoning, setReasoning] = useState('');
  const createMutation = useCreateDecision();

  const handleCreate = async () => {
    if (!title.trim()) return;
    try {
      await createMutation.mutateAsync({
        startup_id: startupId,
        title: title.trim(),
        decision_type: decisionType,
        reasoning: reasoning.trim() || undefined,
      });
      toast.success('Decision recorded');
      setTitle('');
      setReasoning('');
      setDecisionType('persevere');
      setOpen(false);
      onCreated();
    } catch {
      toast.error('Failed to create decision');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Decision
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Record Decision</DialogTitle>
          <DialogDescription>Log a strategic decision with its reasoning and type.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <label htmlFor="create-decision-title" className="text-sm font-medium">Decision Title</label>
            <Input
              id="create-decision-title"
              placeholder="e.g. Pivot from B2C to B2B"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="create-decision-type" className="text-sm font-medium">Decision Type</label>
            <Select value={decisionType} onValueChange={(v) => setDecisionType(v as DecisionType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DECISION_TYPE_CONFIG).map(([value, cfg]) => (
                  <SelectItem key={value} value={value}>{cfg.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="create-decision-reasoning" className="text-sm font-medium">Reasoning</label>
            <Textarea
              id="create-decision-reasoning"
              placeholder="Why are you making this decision? What evidence supports it?"
              value={reasoning}
              onChange={e => setReasoning(e.target.value)}
              rows={4}
            />
          </div>

          <Button onClick={handleCreate} disabled={!title.trim() || createMutation.isPending} className="w-full">
            {createMutation.isPending ? 'Saving...' : 'Record Decision'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditDecisionDialog({
  decision,
  open,
  onClose,
}: {
  decision: Decision;
  open: boolean;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(decision.title);
  const [decisionType, setDecisionType] = useState<DecisionType>(decision.decision_type);
  const [reasoning, setReasoning] = useState(decision.reasoning || '');
  const [outcome, setOutcome] = useState(decision.outcome || '');
  const [status, setStatus] = useState<DecisionStatus>(decision.status);
  const updateMutation = useUpdateDecision();

  const [prevId, setPrevId] = useState(decision.id);
  if (decision.id !== prevId) {
    setPrevId(decision.id);
    setTitle(decision.title);
    setDecisionType(decision.decision_type);
    setReasoning(decision.reasoning || '');
    setOutcome(decision.outcome || '');
    setStatus(decision.status);
  }

  const handleSave = async () => {
    if (!title.trim()) return;
    try {
      const trimmedOutcome = outcome.trim() || null;
      const originalOutcome = decision.outcome || null;
      const outcomeChanged = trimmedOutcome !== originalOutcome;
      await updateMutation.mutateAsync({
        id: decision.id,
        title: title.trim(),
        decision_type: decisionType,
        reasoning: reasoning.trim() || null,
        outcome: trimmedOutcome,
        ...(outcomeChanged ? { outcome_at: trimmedOutcome ? new Date().toISOString() : null } : {}),
        status,
      });
      toast.success('Decision updated');
      onClose();
    } catch {
      toast.error('Failed to update decision');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Decision</DialogTitle>
          <DialogDescription>Update this decision's details, status, and outcome.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <label htmlFor="edit-decision-title" className="text-sm font-medium">Decision Title</label>
            <Input id="edit-decision-title" value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="edit-decision-type" className="text-sm font-medium">Type</label>
              <Select value={decisionType} onValueChange={(v) => setDecisionType(v as DecisionType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DECISION_TYPE_CONFIG).map(([value, cfg]) => (
                    <SelectItem key={value} value={value}>{cfg.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-decision-status" className="text-sm font-medium">Status</label>
              <Select value={status} onValueChange={(v) => setStatus(v as DecisionStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_CONFIG).map(([value, cfg]) => (
                    <SelectItem key={value} value={value}>{cfg.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-decision-reasoning" className="text-sm font-medium">Reasoning</label>
            <Textarea id="edit-decision-reasoning" value={reasoning} onChange={e => setReasoning(e.target.value)} rows={3} />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-decision-outcome" className="text-sm font-medium">Outcome</label>
            <Textarea
              id="edit-decision-outcome"
              placeholder="What was the result of this decision?"
              value={outcome}
              onChange={e => setOutcome(e.target.value)}
              rows={2}
            />
          </div>

          <Button onClick={handleSave} disabled={!title.trim() || updateMutation.isPending} className="w-full">
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ──────────────────────── Main Page ──────────────────────── */

const DecisionLog = () => {
  const { data: startup, isLoading: startupLoading } = useStartup();
  const { data: decisions = [], isLoading: decisionsLoading, refetch } = useDecisions(startup?.id);
  const deleteMutation = useDeleteDecision();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loading = startupLoading || decisionsLoading;

  const filtered = useMemo(() => {
    let result = decisions;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d => d.title.toLowerCase().includes(q) || d.reasoning?.toLowerCase().includes(q));
    }
    if (filterType !== 'all') {
      result = result.filter(d => d.decision_type === filterType);
    }
    return result;
  }, [decisions, search, filterType]);

  const stats = useMemo(() => ({
    total: decisions.length,
    active: decisions.filter(d => d.status === 'active').length,
    reversed: decisions.filter(d => d.status === 'reversed').length,
    superseded: decisions.filter(d => d.status === 'superseded').length,
  }), [decisions]);

  // Group by month for timeline
  const grouped = useMemo(() => {
    const map = new Map<string, Decision[]>();
    for (const d of filtered) {
      const key = d.decided_at ? format(new Date(d.decided_at), 'MMMM yyyy') : 'Undated';
      const arr = map.get(key) || [];
      arr.push(d);
      map.set(key, arr);
    }
    return map;
  }, [filtered]);

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteMutation.mutateAsync(deleteConfirmId);
      toast.success('Decision deleted');
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
              <Scale className="w-6 h-6" />
              Decision Log
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Record, track, and learn from your strategic decisions
            </p>
          </div>
          {startup && (
            <CreateDecisionDialog startupId={startup.id} onCreated={() => refetch()} />
          )}
        </div>

        {/* Stats row */}
        {!loading && stats.total > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-xl font-bold text-emerald-600">{stats.active}</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Reversed</p>
              <p className="text-xl font-bold text-orange-600">{stats.reversed}</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Superseded</p>
              <p className="text-xl font-bold text-muted-foreground">{stats.superseded}</p>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search decisions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(DECISION_TYPE_CONFIG).map(([value, cfg]) => (
                <SelectItem key={value} value={value}>{cfg.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Main content */}
        <Tabs defaultValue="timeline">
          <TabsList>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>

          {/* Timeline View */}
          <TabsContent value="timeline">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
              </div>
            ) : filtered.length === 0 ? (
              <Card className="p-12">
                <div className="text-center text-muted-foreground">
                  <Scale className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">No decisions yet</p>
                  <p className="text-sm mt-1">Record your first strategic decision above.</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                {Array.from(grouped.entries()).map(([month, items]) => (
                  <div key={month}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">{month}</h3>
                    <div className="space-y-3 pl-4 border-l-2 border-muted">
                      {items.map(d => (
                        <DecisionCard
                          key={d.id}
                          decision={d}
                          onEdit={() => setEditingId(d.id)}
                          onDelete={() => setDeleteConfirmId(d.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
                          <th className="text-left p-3 font-medium">Decision</th>
                          <th className="text-left p-3 font-medium w-24">Type</th>
                          <th className="text-left p-3 font-medium w-24">Status</th>
                          <th className="text-left p-3 font-medium w-28">Date</th>
                          <th className="text-right p-3 font-medium w-20">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center py-12 text-muted-foreground">
                              No decisions yet. Record your first decision above.
                            </td>
                          </tr>
                        ) : (
                          filtered.map(d => {
                            const typeConfig = DECISION_TYPE_CONFIG[d.decision_type] || DECISION_TYPE_CONFIG.other;
                            const statusCfg = STATUS_CONFIG[d.status] || STATUS_CONFIG.active;
                            const StatusIcon = statusCfg.icon;
                            return (
                              <tr key={d.id} className="border-b hover:bg-muted/30">
                                <td className="p-3">
                                  <p className="font-medium">{d.title}</p>
                                  {d.reasoning && (
                                    <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-md">{d.reasoning}</p>
                                  )}
                                </td>
                                <td className="p-3">
                                  <Badge variant="outline" className={`text-[10px] ${typeConfig.color}`}>
                                    {typeConfig.label}
                                  </Badge>
                                </td>
                                <td className="p-3">
                                  <Badge variant="outline" className={`text-[10px] ${statusCfg.color}`}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusCfg.label}
                                  </Badge>
                                </td>
                                <td className="p-3 text-xs text-muted-foreground">
                                  {d.decided_at ? format(new Date(d.decided_at), 'MMM d, yyyy') : '—'}
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingId(d.id)}>
                                      <Pencil className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteConfirmId(d.id)}>
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
          const editing = decisions.find(d => d.id === editingId);
          if (!editing) return null;
          return (
            <EditDecisionDialog
              decision={editing}
              open={!!editingId}
              onClose={() => setEditingId(null)}
            />
          );
        })()}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => { if (!open) setDeleteConfirmId(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Decision</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this decision and all associated evidence. This action cannot be undone.
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

export default DecisionLog;
