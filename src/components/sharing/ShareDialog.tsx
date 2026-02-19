/**
 * ShareDialog — Generate, copy, and manage shareable links for validation reports.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, Copy, Check, Trash2, Link, Eye, ChevronDown, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import {
  useShareableLinks,
  type ShareableLink,
  type ExpiryOption,
} from '@/hooks/useShareableLinks';
import { useShareAnalytics, parseUserAgent, parseReferrer } from '@/hooks/useShareAnalytics';

interface ShareDialogProps {
  reportId: string;
  startupId: string;
}

const EXPIRY_OPTIONS: { value: ExpiryOption; label: string }[] = [
  { value: 1, label: '1 day' },
  { value: 7, label: '7 days' },
  { value: 30, label: '30 days' },
  { value: 0, label: 'Never expires' },
];

function buildShareUrl(token: string): string {
  return `${window.location.origin}/share/report/${token}`;
}

function formatExpiry(expiresAt: string): string {
  const d = new Date(expiresAt);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  if (diffMs > 365 * 24 * 60 * 60 * 1000 * 50) return 'Never';
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Expired';
  if (diffDays === 1) return '1 day left';
  return `${diffDays} days left`;
}

function LinkAnalytics({ linkId }: { linkId: string }) {
  const { totalViews, uniqueViews, viewsByDay, recentViews, loading } = useShareAnalytics(linkId);

  if (loading) {
    return <p className="text-xs text-muted-foreground py-2">Loading analytics...</p>;
  }

  const maxCount = Math.max(...viewsByDay.map(d => d.count), 1);

  return (
    <div className="space-y-3 pt-2">
      {/* Stats row */}
      <div className="flex gap-4">
        <div className="text-center">
          <p className="text-lg font-semibold">{totalViews}</p>
          <p className="text-[10px] text-muted-foreground">Total Views</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">{uniqueViews}</p>
          <p className="text-[10px] text-muted-foreground">Unique</p>
        </div>
      </div>

      {/* Sparkline — 7 bars */}
      <div className="flex items-end gap-1 h-8">
        {viewsByDay.map((day) => (
          <div
            key={day.date}
            className="flex-1 bg-primary/20 rounded-sm min-h-[2px] transition-all"
            style={{ height: `${Math.max((day.count / maxCount) * 100, 5)}%` }}
            title={`${day.date}: ${day.count} views`}
          />
        ))}
      </div>
      <div className="flex justify-between text-[9px] text-muted-foreground">
        <span>{viewsByDay[0]?.date.slice(5)}</span>
        <span>{viewsByDay[viewsByDay.length - 1]?.date.slice(5)}</span>
      </div>

      {/* Recent views */}
      {recentViews.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Recent</p>
          {recentViews.slice(0, 5).map((view) => (
            <div key={view.id} className="flex justify-between text-[11px] text-muted-foreground">
              <span>{parseUserAgent(view.user_agent)}</span>
              <span>{parseReferrer(view.referrer)}</span>
              <span>{new Date(view.viewed_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}

      {totalViews === 0 && (
        <p className="text-xs text-muted-foreground text-center">No views yet</p>
      )}
    </div>
  );
}

export default function ShareDialog({ reportId, startupId }: ShareDialogProps) {
  const { generateLink, getActiveLinks, revokeLink, loading } = useShareableLinks();
  const [links, setLinks] = useState<ShareableLink[]>([]);
  const [expiry, setExpiry] = useState<ExpiryOption>(7);
  const [copied, setCopied] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [expandedAnalytics, setExpandedAnalytics] = useState<string | null>(null);
  const [embedSections, setEmbedSections] = useState<string[]>([
    'hero', 'problem', 'customer', 'market', 'competition', 'risks', 'mvp', 'nextsteps'
  ]);

  const allSections = [
    { key: 'hero', label: 'Hero + Score' },
    { key: 'problem', label: 'Problem' },
    { key: 'customer', label: 'Customer' },
    { key: 'market', label: 'Market' },
    { key: 'competition', label: 'Competition' },
    { key: 'risks', label: 'Risks' },
    { key: 'mvp', label: 'MVP' },
    { key: 'nextsteps', label: 'Next Steps' },
  ];

  const embedUrl = useMemo(() => {
    const firstToken = links[0]?.token;
    if (!firstToken) return '';
    const base = `${window.location.origin}/embed/report/${firstToken}`;
    if (embedSections.length === 0 || embedSections.length === allSections.length) return base;
    return `${base}?sections=${embedSections.join(',')}`;
  }, [links, embedSections]);

  const embedCode = `<iframe src="${embedUrl}" width="100%" height="800" frameborder="0" style="border: 1px solid #E5E2DC; border-radius: 8px;"></iframe>`;

  const loadLinks = useCallback(async () => {
    const active = await getActiveLinks('validation_report', reportId);
    setLinks(active);
  }, [getActiveLinks, reportId]);

  useEffect(() => {
    if (!open) return;
    loadLinks();
    const interval = setInterval(loadLinks, 30_000);
    return () => clearInterval(interval);
  }, [open, loadLinks]);

  const handleGenerate = async () => {
    const link = await generateLink('validation_report', reportId, startupId, expiry);
    if (link) {
      setLinks(prev => [link, ...prev]);
      await handleCopy(link.token);
      toast.success('Share link created and copied!');
    } else {
      toast.error('Failed to create share link');
    }
  };

  const handleCopy = async (token: string) => {
    try {
      await navigator.clipboard.writeText(buildShareUrl(token));
      setCopied(token);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleRevoke = async (linkId: string) => {
    const ok = await revokeLink(linkId);
    if (ok) {
      setLinks(prev => prev.filter(l => l.id !== linkId));
      toast.success('Link revoked');
    } else {
      toast.error('Failed to revoke link');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Report</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="share" className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="share" className="flex-1">Share Link</TabsTrigger>
            <TabsTrigger value="embed" className="flex-1">Embed</TabsTrigger>
          </TabsList>

          <TabsContent value="share" className="space-y-4">
            {/* Generate new link */}
            <div className="flex gap-2">
              <Select
                value={String(expiry)}
                onValueChange={(v) => setExpiry(Number(v) as ExpiryOption)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPIRY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleGenerate} disabled={loading} className="flex-1">
                <Link className="w-4 h-4 mr-2" />
                {loading ? 'Creating...' : 'Create Link'}
              </Button>
            </div>

            {/* Active links */}
            {links.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Active Links ({links.length})
                </p>
                {links.map((link) => (
                  <div key={link.id} className="rounded-lg border border-border bg-muted/30 overflow-hidden">
                    <div className="flex items-center justify-between p-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono text-muted-foreground truncate">
                          {buildShareUrl(link.token)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-[10px]">
                            {formatExpiry(link.expires_at)}
                          </Badge>
                          {link.access_count > 0 && (
                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Eye className="w-3 h-3" />
                              {link.access_count}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setExpandedAnalytics(prev => prev === link.id ? null : link.id)}
                        >
                          <BarChart3 className={`w-4 h-4 transition-colors ${expandedAnalytics === link.id ? 'text-primary' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleCopy(link.token)}
                        >
                          {copied === link.token ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleRevoke(link.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {expandedAnalytics === link.id && (
                      <div className="px-3 pb-3 border-t border-border">
                        <LinkAnalytics linkId={link.id} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {links.length === 0 && !loading && (
              <p className="text-sm text-muted-foreground text-center py-2">
                No active links. Create one to share this report.
              </p>
            )}
          </TabsContent>

          <TabsContent value="embed" className="space-y-4">
            {links.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Generate a share link first to get an embed code.
              </p>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium mb-1 block">Embed Code</label>
                  <textarea
                    readOnly
                    value={embedCode}
                    className="w-full h-24 text-xs font-mono bg-muted p-3 rounded-md border border-border resize-none"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(embedCode);
                    toast.success('Embed code copied!');
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Embed Code
                </Button>
                <div>
                  <label className="text-sm font-medium mb-2 block">Sections</label>
                  <div className="space-y-2">
                    {allSections.map((section) => (
                      <label key={section.key} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={embedSections.includes(section.key)}
                          onCheckedChange={(checked) => {
                            setEmbedSections(prev =>
                              checked
                                ? [...prev, section.key]
                                : prev.filter(s => s !== section.key)
                            );
                          }}
                        />
                        {section.label}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
