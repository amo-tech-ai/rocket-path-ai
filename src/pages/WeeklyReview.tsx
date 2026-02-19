/**
 * WeeklyReview — Weekly review loop: AI-generated summaries with learnings,
 * metrics, and priorities. Founders can edit and track progress over time.
 */
import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  CalendarDays,
  Plus,
  Search,
  ChevronDown,
  Pencil,
  Trash2,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  Target,
  BarChart3,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { useStartup } from '@/hooks/useDashboardData';
import {
  useWeeklyReviews,
  useCreateWeeklyReview,
  useUpdateWeeklyReview,
  useDeleteWeeklyReview,
  useGenerateWeeklyReview,
  type WeeklyReview as WeeklyReviewType,
} from '@/hooks/useWeeklyReviews';

/* ──────────────────────── Helpers ──────────────────────── */

function getWeekLabel(weekStart: string): string {
  const d = new Date(weekStart);
  return `Week of ${format(d, 'MMM d, yyyy')}`;
}

function ScoreDelta({ start, end }: { start: number | null; end: number | null }) {
  if (start == null || end == null) return null;
  const delta = end - start;
  if (delta > 0) return <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600"><TrendingUp className="w-3 h-3 mr-0.5" />+{delta}</Badge>;
  if (delta < 0) return <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-600"><TrendingDown className="w-3 h-3 mr-0.5" />{delta}</Badge>;
  return <Badge variant="outline" className="text-[10px] bg-muted text-muted-foreground"><Minus className="w-3 h-3 mr-0.5" />0</Badge>;
}

/* ──────────────────────── ReviewCard ──────────────────────── */

function ReviewCard({
  review,
  onEdit,
  onDelete,
}: {
  review: WeeklyReviewType;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium text-sm">{getWeekLabel(review.week_start)}</h3>
              {review.ai_generated && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  <Sparkles className="w-2.5 h-2.5 mr-0.5" />AI
                </Badge>
              )}
              {review.edited_by_user && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">Edited</Badge>
              )}
              <ScoreDelta start={review.health_score_start} end={review.health_score_end} />
            </div>
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

        {review.summary && (
          <p className="text-xs text-muted-foreground line-clamp-3">{review.summary}</p>
        )}

        {/* Quick stats */}
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
          {review.tasks_completed != null && <span>{review.tasks_completed} tasks</span>}
          {review.experiments_run != null && <span>{review.experiments_run} experiments</span>}
          {review.decisions_made != null && <span>{review.decisions_made} decisions</span>}
          {review.assumptions_tested != null && <span>{review.assumptions_tested} assumptions</span>}
        </div>

        <Collapsible open={expanded} onOpenChange={setExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] w-full">
              <ChevronDown className={`w-3 h-3 mr-1 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              Details
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2 border-t">
            {review.key_learnings && review.key_learnings.length > 0 && (
              <div>
                <p className="text-xs font-medium flex items-center gap-1 mb-1">
                  <BookOpen className="w-3 h-3" /> Key Learnings
                </p>
                <ul className="space-y-1">
                  {review.key_learnings.map((l, i) => (
                    <li key={i} className="text-xs text-muted-foreground pl-4 relative before:content-['•'] before:absolute before:left-1">{l}</li>
                  ))}
                </ul>
              </div>
            )}
            {review.priorities_next_week && review.priorities_next_week.length > 0 && (
              <div>
                <p className="text-xs font-medium flex items-center gap-1 mb-1">
                  <Target className="w-3 h-3" /> Next Week Priorities
                </p>
                <ul className="space-y-1">
                  {review.priorities_next_week.map((p, i) => (
                    <li key={i} className="text-xs text-muted-foreground pl-4 relative before:content-['•'] before:absolute before:left-1">{p}</li>
                  ))}
                </ul>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

/* ──────────────────────── EditReviewDialog ──────────────────────── */

function EditReviewDialog({
  review,
  open,
  onClose,
}: {
  review: WeeklyReviewType;
  open: boolean;
  onClose: () => void;
}) {
  const [summary, setSummary] = useState(review.summary || '');
  const [learnings, setLearnings] = useState((review.key_learnings || []).join('\n'));
  const [priorities, setPriorities] = useState((review.priorities_next_week || []).join('\n'));
  const updateMutation = useUpdateWeeklyReview();

  const [prevId, setPrevId] = useState(review.id);
  if (review.id !== prevId) {
    setPrevId(review.id);
    setSummary(review.summary || '');
    setLearnings((review.key_learnings || []).join('\n'));
    setPriorities((review.priorities_next_week || []).join('\n'));
  }

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        id: review.id,
        summary: summary.trim() || null,
        key_learnings: learnings.split('\n').map(s => s.trim()).filter(Boolean),
        priorities_next_week: priorities.split('\n').map(s => s.trim()).filter(Boolean),
      });
      toast.success('Review updated');
      onClose();
    } catch {
      toast.error('Failed to update review');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Weekly Review</DialogTitle>
          <DialogDescription>{getWeekLabel(review.week_start)}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <label htmlFor="edit-review-summary" className="text-sm font-medium">Summary</label>
            <Textarea
              id="edit-review-summary"
              value={summary}
              onChange={e => setSummary(e.target.value)}
              rows={4}
              placeholder="What happened this week?"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="edit-review-learnings" className="text-sm font-medium">Key Learnings (one per line)</label>
            <Textarea
              id="edit-review-learnings"
              value={learnings}
              onChange={e => setLearnings(e.target.value)}
              rows={3}
              placeholder="What did you learn?"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="edit-review-priorities" className="text-sm font-medium">Next Week Priorities (one per line)</label>
            <Textarea
              id="edit-review-priorities"
              value={priorities}
              onChange={e => setPriorities(e.target.value)}
              rows={3}
              placeholder="What are your top priorities?"
            />
          </div>
          <Button onClick={handleSave} disabled={updateMutation.isPending} className="w-full">
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ──────────────────────── Main Page ──────────────────────── */

const WeeklyReview = () => {
  const { data: startup, isLoading: startupLoading } = useStartup();
  const { data: reviews = [], isLoading: reviewsLoading, refetch } = useWeeklyReviews(startup?.id);
  const deleteMutation = useDeleteWeeklyReview();
  const createMutation = useCreateWeeklyReview();
  const generateMutation = useGenerateWeeklyReview();

  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loading = startupLoading || reviewsLoading;

  const filtered = useMemo(() => {
    if (!search) return reviews;
    const q = search.toLowerCase();
    return reviews.filter(r =>
      r.summary?.toLowerCase().includes(q) ||
      r.key_learnings?.some(l => l.toLowerCase().includes(q)) ||
      r.priorities_next_week?.some(p => p.toLowerCase().includes(q))
    );
  }, [reviews, search]);

  const stats = useMemo(() => {
    if (reviews.length === 0) return null;
    const latest = reviews[0];
    const avgScore = reviews
      .filter(r => r.health_score_end != null)
      .reduce((sum, r, _, arr) => sum + (r.health_score_end || 0) / arr.length, 0);
    return {
      total: reviews.length,
      latestScore: latest?.health_score_end,
      avgScore: Math.round(avgScore),
      totalTasks: reviews.reduce((s, r) => s + (r.tasks_completed || 0), 0),
    };
  }, [reviews]);

  const handleGenerateAI = async () => {
    if (!startup?.id) return;
    try {
      const result = await generateMutation.mutateAsync({ startupId: startup.id });
      if (result.success) {
        refetch();
        if (result.coaching?.headline) {
          toast.info(result.coaching.headline, { duration: 6000 });
        }
      }
    } catch {
      toast.error('Failed to generate weekly review');
    }
  };

  const handleCreateManual = async () => {
    if (!startup?.id) return;
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    try {
      await createMutation.mutateAsync({
        startup_id: startup.id,
        week_start: format(weekStart, 'yyyy-MM-dd'),
        week_end: format(weekEnd, 'yyyy-MM-dd'),
      });
      refetch();
      toast.success('Blank review created — click Edit to fill in details');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create review';
      if (msg.includes('idx_weekly_reviews_startup_week')) {
        toast.error('A review already exists for this week');
      } else {
        toast.error(msg);
      }
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteMutation.mutateAsync(deleteConfirmId);
      toast.success('Review deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const generating = generateMutation.isPending;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CalendarDays className="w-6 h-6" />
              Weekly Review
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Reflect on progress, capture learnings, and set priorities for the week ahead
            </p>
          </div>
          {startup && (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCreateManual} disabled={generating}>
                <Plus className="w-4 h-4 mr-2" />
                Manual
              </Button>
              <Button onClick={handleGenerateAI} disabled={generating}>
                {generating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {generating ? 'Generating...' : 'AI Review'}
              </Button>
            </div>
          )}
        </div>

        {/* Stats row */}
        {!loading && stats && stats.total > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Reviews</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Latest Score</p>
              <p className="text-xl font-bold">{stats.latestScore ?? '—'}</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Avg Score</p>
              <p className="text-xl font-bold">{stats.avgScore || '—'}</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Tasks Done</p>
              <p className="text-xl font-bold">{stats.totalTasks}</p>
            </Card>
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Content */}
        <Tabs defaultValue="cards">
          <TabsList>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>

          <TabsContent value="cards">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
              </div>
            ) : filtered.length === 0 ? (
              <Card className="p-12">
                <div className="text-center text-muted-foreground">
                  <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">No reviews yet</p>
                  <p className="text-sm mt-1">Generate an AI review or create one manually.</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {filtered.map(r => (
                  <ReviewCard
                    key={r.id}
                    review={r}
                    onEdit={() => setEditingId(r.id)}
                    onDelete={() => setDeleteConfirmId(r.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="table">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12" />)}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Week</th>
                          <th className="text-left p-3 font-medium w-20">Score</th>
                          <th className="text-left p-3 font-medium w-20">Tasks</th>
                          <th className="text-left p-3 font-medium w-20">Source</th>
                          <th className="text-right p-3 font-medium w-20">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center py-12 text-muted-foreground">
                              No reviews yet.
                            </td>
                          </tr>
                        ) : (
                          filtered.map(r => (
                            <tr key={r.id} className="border-b hover:bg-muted/30">
                              <td className="p-3">
                                <p className="font-medium">{getWeekLabel(r.week_start)}</p>
                                {r.summary && (
                                  <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-md">{r.summary}</p>
                                )}
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">{r.health_score_end ?? '—'}</span>
                                  <ScoreDelta start={r.health_score_start} end={r.health_score_end} />
                                </div>
                              </td>
                              <td className="p-3 text-muted-foreground">{r.tasks_completed ?? '—'}</td>
                              <td className="p-3">
                                {r.ai_generated ? (
                                  <Badge variant="secondary" className="text-[10px]"><Sparkles className="w-2.5 h-2.5 mr-0.5" />AI</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-[10px]">Manual</Badge>
                                )}
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingId(r.id)}>
                                    <Pencil className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteConfirmId(r.id)}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
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
          const editing = reviews.find(r => r.id === editingId);
          if (!editing) return null;
          return (
            <EditReviewDialog
              review={editing}
              open={!!editingId}
              onClose={() => setEditingId(null)}
            />
          );
        })()}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => { if (!open) setDeleteConfirmId(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Review</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this weekly review. This action cannot be undone.
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

export default WeeklyReview;
