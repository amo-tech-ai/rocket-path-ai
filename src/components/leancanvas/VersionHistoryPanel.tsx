/**
 * Version History Panel for Lean Canvas
 * Displays timeline of canvas saves with restore functionality
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, formatDistanceToNow } from 'date-fns';
import { History, RotateCcw, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
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
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Version {
  id: string;
  version_number: number;
  label: string | null;
  created_at: string;
  metadata: Record<string, unknown>;
}

interface VersionHistoryPanelProps {
  documentId?: string;
  onRestore?: (versionData: Record<string, unknown>) => void;
}

export function VersionHistoryPanel({ documentId, onRestore }: VersionHistoryPanelProps) {
  const [open, setOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const queryClient = useQueryClient();

  // Fetch versions
  const { data: versions = [], isLoading } = useQuery({
    queryKey: ['canvas-versions', documentId],
    queryFn: async () => {
      if (!documentId) return [];
      
      const { data, error } = await supabase
        .from('document_versions')
        .select('id, version_number, label, created_at, metadata')
        .eq('document_id', documentId)
        .order('version_number', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as Version[];
    },
    enabled: !!documentId && open,
  });

  // Save current version
  const saveVersion = useMutation({
    mutationFn: async (label?: string) => {
      if (!documentId) throw new Error('No document ID');

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Get current document content
      const { data: doc, error: docError } = await supabase
        .from('documents')
        .select('content_json, metadata')
        .eq('id', documentId)
        .single();

      if (docError || !doc) throw new Error('Document not found');
      
      const docMetadata = (doc.metadata || {}) as Record<string, unknown>;

      // Insert new version
      const { error } = await supabase
        .from('document_versions')
        .insert({
          document_id: documentId,
          content_json: doc.content_json,
          metadata: { ...docMetadata, snapshot_at: new Date().toISOString() },
          label: label || null,
          created_by: user.user.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canvas-versions', documentId] });
      toast.success('Version saved');
    },
    onError: () => {
      toast.error('Failed to save version');
    },
  });

  // Restore version
  const restoreVersion = useMutation({
    mutationFn: async (versionId: string) => {
      if (!documentId) throw new Error('No document ID');

      // Save current state first
      await saveVersion.mutateAsync('Auto-saved before restore');

      // Get version content
      const { data: version, error: fetchError } = await supabase
        .from('document_versions')
        .select('content_json, metadata')
        .eq('id', versionId)
        .single();

      if (fetchError || !version) throw new Error('Version not found');
      
      const versionMetadata = (version.metadata || {}) as Record<string, unknown>;

      // Update document
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          content_json: version.content_json,
          metadata: {
            ...versionMetadata,
            restored_from_version: versionId,
            restored_at: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', documentId);

      if (updateError) throw updateError;

      return version.content_json;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['canvas-versions', documentId] });
      queryClient.invalidateQueries({ queryKey: ['lean-canvas'] });
      if (onRestore && data) {
        onRestore(data as Record<string, unknown>);
      }
      toast.success('Version restored');
      setRestoreDialogOpen(false);
      setOpen(false);
    },
    onError: () => {
      toast.error('Failed to restore version');
    },
  });

  const handleRestoreClick = (version: Version) => {
    setSelectedVersion(version);
    setRestoreDialogOpen(true);
  };

  const confirmRestore = () => {
    if (selectedVersion) {
      restoreVersion.mutate(selectedVersion.id);
    }
  };

  if (!documentId) {
    return (
      <Button variant="outline" size="sm" disabled className="hidden sm:flex">
        <History className="w-4 h-4 mr-2" />
        Versions
      </Button>
    );
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <History className="w-4 h-4 mr-2" />
            Versions
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:max-w-[400px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Version History
            </SheetTitle>
            <SheetDescription>
              Browse and restore previous versions of your canvas
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6">
            <Button 
              onClick={() => saveVersion.mutate(undefined)}
              disabled={saveVersion.isPending}
              size="sm"
              className="w-full mb-4"
            >
              {saveVersion.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Save Current Version
            </Button>

            <ScrollArea className="h-[calc(100vh-220px)]">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : versions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No versions saved yet</p>
                  <p className="text-xs mt-1">Click "Save Current Version" to create a snapshot</p>
                </div>
              ) : (
                <AnimatePresence>
                  <div className="space-y-2">
                    {versions.map((version, index) => (
                      <motion.div
                        key={version.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "p-3 rounded-lg border transition-colors hover:bg-muted/50 cursor-pointer group",
                          index === 0 && "border-sage/50 bg-sage/5"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                v{version.version_number}
                              </span>
                              {index === 0 && (
                                <span className="text-xs bg-sage/20 text-sage-dark px-1.5 py-0.5 rounded">
                                  Latest
                                </span>
                              )}
                            </div>
                            {version.label && (
                              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                {version.label}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRestoreClick(version)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            disabled={restoreVersion.isPending}
                          >
                            <RotateCcw className="w-3.5 h-3.5 mr-1" />
                            Restore
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Version?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore your canvas to version {selectedVersion?.version_number}
              {selectedVersion?.label && ` (${selectedVersion.label})`}.
              Your current canvas will be automatically saved before restoring.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRestore}
              disabled={restoreVersion.isPending}
            >
              {restoreVersion.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4 mr-2" />
              )}
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
