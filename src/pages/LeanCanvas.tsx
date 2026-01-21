import { useState, useCallback } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { LeanCanvasGrid } from '@/components/leancanvas/LeanCanvasGrid';
import { CanvasAIPanel } from '@/components/leancanvas/CanvasAIPanel';
import { useLeanCanvas, useSaveLeanCanvas } from '@/hooks/useLeanCanvas';
import { LeanCanvasData, EMPTY_CANVAS } from '@/types/canvas.types';
import { useStartup } from '@/hooks/useDashboardData';
import { 
  LayoutGrid, 
  Save, 
  Download, 
  History,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LeanCanvas = () => {
  const { data: startup, isLoading: startupLoading } = useStartup();
  const { data: savedCanvas, isLoading: canvasLoading } = useLeanCanvas(startup?.id);
  const saveCanvas = useSaveLeanCanvas();
  
  const [canvasData, setCanvasData] = useState<LeanCanvasData>(
    savedCanvas?.data || EMPTY_CANVAS
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Sync with saved data when it loads
  useState(() => {
    if (savedCanvas?.data) {
      setCanvasData(savedCanvas.data);
    }
  });

  const isLoading = startupLoading || canvasLoading;

  const handleBoxUpdate = useCallback((key: keyof LeanCanvasData, items: string[]) => {
    setCanvasData(prev => ({
      ...prev,
      [key]: { ...prev[key], items }
    }));
    setHasChanges(true);
  }, []);

  const handleSave = async () => {
    if (!startup?.id) {
      toast.error('No startup found');
      return;
    }

    try {
      await saveCanvas.mutateAsync({
        startupId: startup.id,
        canvasData,
        existingId: savedCanvas?.id,
      });
      setHasChanges(false);
      toast.success('Canvas saved');
    } catch (err) {
      toast.error('Failed to save canvas');
    }
  };

  const handlePreFillApply = (suggestions: Partial<LeanCanvasData>) => {
    setCanvasData(prev => {
      const updated = { ...prev };
      for (const [key, value] of Object.entries(suggestions)) {
        if (value?.items?.length > 0) {
          // Merge with existing items, avoiding duplicates
          const existing = prev[key as keyof LeanCanvasData]?.items || [];
          const newItems = value.items.filter(item => !existing.includes(item));
          updated[key as keyof LeanCanvasData] = {
            ...prev[key as keyof LeanCanvasData],
            items: [...existing, ...newItems].slice(0, 8)
          };
        }
      }
      return updated;
    });
    setHasChanges(true);
  };

  const handleValidationComplete = (results: Record<string, { validation: 'valid' | 'warning' | 'error'; message: string }>) => {
    setCanvasData(prev => {
      const updated = { ...prev };
      for (const [key, result] of Object.entries(results)) {
        if (updated[key as keyof LeanCanvasData]) {
          updated[key as keyof LeanCanvasData] = {
            ...updated[key as keyof LeanCanvasData],
            validation: result.validation,
            validationMessage: result.message,
          };
        }
      }
      return updated;
    });
  };

  const handleExport = (format: 'pdf' | 'png') => {
    toast.info(`Export to ${format.toUpperCase()} coming soon`);
  };

  // AI Panel for right sidebar
  const aiPanel = startup?.id ? (
    <CanvasAIPanel
      startupId={startup.id}
      canvasData={canvasData}
      onPreFillApply={handlePreFillApply}
      onValidationComplete={handleValidationComplete}
    />
  ) : null;

  // Empty state
  if (!isLoading && !startup) {
    return (
      <DashboardLayout>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center py-20"
        >
          <div className="w-16 h-16 rounded-2xl bg-sage-light flex items-center justify-center mx-auto mb-6">
            <LayoutGrid className="w-8 h-8 text-sage" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Lean Canvas</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Visualize your business model with the Lean Canvas framework. 
            Set up your startup profile first to get started.
          </p>
          <Button onClick={() => window.location.href = '/settings'}>
            Set Up Startup Profile
          </Button>
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout aiPanel={aiPanel}>
      <div className="max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        >
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">Lean Canvas</h1>
              {hasChanges && (
                <span className="text-xs text-muted-foreground bg-warm/20 px-2 py-0.5 rounded">
                  Unsaved changes
                </span>
              )}
            </div>
            <p className="text-muted-foreground">
              {startup?.name ? `Business model for ${startup.name}` : 'Define your business model'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              disabled
              className="hidden sm:flex"
            >
              <History className="w-4 h-4 mr-2" />
              Versions
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('png')}>
                  Export as PNG
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              onClick={handleSave}
              disabled={!hasChanges || saveCanvas.isPending}
            >
              {saveCanvas.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save
            </Button>
          </div>
        </motion.div>

        {/* Canvas Grid */}
        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
            <div className="grid grid-cols-5 gap-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          </div>
        ) : (
          <LeanCanvasGrid
            data={canvasData}
            onUpdate={handleBoxUpdate}
          />
        )}

        {/* Last saved info */}
        {savedCanvas?.updatedAt && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-muted-foreground mt-6 text-center"
          >
            Last saved: {new Date(savedCanvas.updatedAt).toLocaleString()}
          </motion.p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LeanCanvas;
