import { useState, useCallback, useEffect, useRef } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { LeanCanvasGrid } from '@/components/leancanvas/LeanCanvasGrid';
import { CanvasAIPanel } from '@/components/leancanvas/CanvasAIPanel';
import { AutosaveIndicator } from '@/components/leancanvas/AutosaveIndicator';
import { ProfileMappingBanner } from '@/components/leancanvas/ProfileMappingBanner';
import { useLeanCanvas, useSaveLeanCanvas, LeanCanvasData, EMPTY_CANVAS } from '@/hooks/useLeanCanvas';
import { useCanvasAutosave } from '@/hooks/useCanvasAutosave';
import { useMapProfile, usePrefillCanvas, type BoxKey, type CoverageLevel } from '@/hooks/useLeanCanvasAgent';
import { exportToPDF, exportToPNG } from '@/lib/canvasExport';
import { useStartup } from '@/hooks/useDashboardData';
import { 
  LayoutGrid, 
  Save, 
  Download, 
  History,
  Loader2,
  FileImage,
  FileText
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
  
  // Profile mapping hooks
  const mapProfile = useMapProfile();
  const prefillCanvas = usePrefillCanvas();
  
  const [canvasData, setCanvasData] = useState<LeanCanvasData>(
    savedCanvas?.data || EMPTY_CANVAS
  );
  const [isExporting, setIsExporting] = useState(false);
  const [coverage, setCoverage] = useState<Record<BoxKey, CoverageLevel> | null>(null);
  const [lowCoverageBoxes, setLowCoverageBoxes] = useState<BoxKey[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Sync with saved data when it loads
  useEffect(() => {
    if (savedCanvas?.data) {
      setCanvasData(savedCanvas.data);
    }
  }, [savedCanvas?.data]);

  // Auto-map profile on first load
  useEffect(() => {
    if (startup?.id && !coverage && !mapProfile.isPending) {
      handleMapProfile();
    }
  }, [startup?.id]);

  const isLoading = startupLoading || canvasLoading;

  // Autosave functionality
  const performSave = useCallback(async () => {
    if (!startup?.id) return;
    
    await saveCanvas.mutateAsync({
      startupId: startup.id,
      canvasData,
      existingId: savedCanvas?.id,
    });
  }, [startup?.id, canvasData, savedCanvas?.id, saveCanvas]);

  const autosave = useCanvasAutosave({
    debounceMs: 2000,
    onSave: performSave,
    enabled: !!startup?.id,
  });

  const handleBoxUpdate = useCallback((key: keyof LeanCanvasData, items: string[]) => {
    setCanvasData(prev => ({
      ...prev,
      [key]: { ...prev[key], items }
    }));
    autosave.markDirty();
  }, [autosave]);

  const handleManualSave = async () => {
    if (!startup?.id) {
      toast.error('No startup found');
      return;
    }

    try {
      await autosave.saveNow();
      toast.success('Canvas saved');
    } catch {
      toast.error('Failed to save canvas');
    }
  };

  const handleMapProfile = async () => {
    if (!startup?.id) return;
    
    const result = await mapProfile.mutateAsync({ startupId: startup.id });
    if (result.success) {
      setCoverage(result.coverage || null);
      setLowCoverageBoxes(result.lowCoverageBoxes || []);
    }
  };

  const handlePrefill = async () => {
    if (!startup?.id) return;
    
    const result = await prefillCanvas.mutateAsync({ startupId: startup.id });
    if (result.success && result.canvas) {
      // Merge AI suggestions with existing canvas
      setCanvasData(prev => {
        const updated = { ...prev };
        for (const [key, value] of Object.entries(result.canvas!)) {
          if (value?.items?.length > 0) {
            const existing = prev[key as keyof LeanCanvasData]?.items || [];
            const newItems = (value.items as string[]).filter((item: string) => !existing.includes(item));
            updated[key as keyof LeanCanvasData] = {
              ...prev[key as keyof LeanCanvasData],
              items: [...existing, ...newItems].slice(0, 8)
            };
          }
        }
        return updated;
      });
      autosave.markDirty();
      
      // Re-map profile to update coverage
      handleMapProfile();
    }
  };

  const handlePreFillApply = (suggestions: Partial<LeanCanvasData>) => {
    setCanvasData(prev => {
      const updated = { ...prev };
      for (const [key, value] of Object.entries(suggestions)) {
        if (value?.items?.length > 0) {
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
    autosave.markDirty();
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

  const handleExport = async (format: 'pdf' | 'png') => {
    if (!canvasRef.current) {
      toast.error('Canvas not ready');
      return;
    }

    setIsExporting(true);
    try {
      const filename = `lean-canvas-${startup?.name?.toLowerCase().replace(/\s+/g, '-') || 'export'}`;
      const options = {
        title: 'Lean Canvas',
        companyName: startup?.name,
        includeDate: true,
      };

      if (format === 'pdf') {
        await exportToPDF(canvasRef.current, `${filename}.pdf`, options);
        toast.success('PDF exported successfully');
      } else {
        await exportToPNG(canvasRef.current, `${filename}.png`);
        toast.success('PNG exported successfully');
      }
    } catch (error) {
      toast.error(`Failed to export ${format.toUpperCase()}`);
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
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
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">Lean Canvas</h1>
              <AutosaveIndicator 
                status={autosave.status} 
                lastSaved={autosave.lastSaved} 
              />
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
                <Button variant="outline" size="sm" disabled={isExporting}>
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('png')}>
                  <FileImage className="w-4 h-4 mr-2" />
                  Export as PNG
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              onClick={handleManualSave}
              disabled={autosave.status === 'saving' || autosave.status === 'idle'}
              variant={autosave.status === 'pending' ? 'default' : 'outline'}
            >
              {autosave.status === 'saving' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save
            </Button>
          </div>
        </motion.div>

        {/* Profile Mapping Banner */}
        {!isLoading && startup?.id && (
          <ProfileMappingBanner
            coverage={coverage}
            lowCoverageBoxes={lowCoverageBoxes}
            isLoading={mapProfile.isPending || prefillCanvas.isPending}
            onPrefill={handlePrefill}
            onMapProfile={handleMapProfile}
          />
        )}

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
          <div ref={canvasRef}>
            <LeanCanvasGrid
              data={canvasData}
              onUpdate={handleBoxUpdate}
              startupId={startup?.id}
            />
          </div>
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
