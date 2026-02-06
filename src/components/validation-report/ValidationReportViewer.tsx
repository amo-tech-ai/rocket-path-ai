/**
 * Full Validation Report Viewer
 * Premium consulting-grade 14-section report display
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Share2, 
  RefreshCw, 
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ValidationReport } from '@/types/validation-report';
import { Button } from '@/components/ui/button';
import ExecutiveSummaryCard from './ExecutiveSummaryCard';
import TAMSAMSOMChart from './TAMSAMSOMChart';
import DimensionScoresChart from './DimensionScoresChart';
import FactorsBreakdownCard from './FactorsBreakdownCard';
import SectionNavigation from './SectionNavigation';
import ReportSectionContent from './ReportSectionContent';

interface ValidationReportViewerProps {
  report: ValidationReport;
  onRegenerate?: () => void;
  onExport?: () => void;
  onShare?: () => void;
  onBack?: () => void;
  isRegenerating?: boolean;
  className?: string;
}

export default function ValidationReportViewer({
  report,
  onRegenerate,
  onExport,
  onShare,
  onBack,
  isRegenerating = false,
  className,
}: ValidationReportViewerProps) {
  const [activeSection, setActiveSection] = useState(1);
  const [viewMode, setViewMode] = useState<'overview' | 'sections'>('overview');
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Scroll to top when section changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeSection]);
  
  const currentSection = report.sections.find(s => s.number === activeSection);
  const completedSections = report.sections.map(s => s.number);
  
  const handlePrevSection = () => {
    if (activeSection > 1) setActiveSection(activeSection - 1);
  };
  
  const handleNextSection = () => {
    if (activeSection < 14) setActiveSection(activeSection + 1);
  };

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Header - Quiet, editorial */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back link + Title */}
            <div className="flex items-center gap-4">
              {onBack && (
                <button 
                  onClick={onBack}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="font-display text-lg font-semibold text-foreground">
                  Validation Report
                </h1>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(report.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              {onRegenerate && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onRegenerate}
                  disabled={isRegenerating}
                  className="text-muted-foreground"
                >
                  <RefreshCw className={cn(
                    "w-4 h-4 mr-2",
                    isRegenerating && "animate-spin"
                  )} />
                  Regenerate
                </Button>
              )}
              {onShare && (
                <Button variant="ghost" size="sm" onClick={onShare} className="text-muted-foreground">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              )}
              {onExport && (
                <Button variant="outline" size="sm" onClick={onExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              )}
            </div>
          </div>
          
          {/* View mode tabs */}
          <div className="flex gap-1 pb-4">
            <button
              onClick={() => setViewMode('overview')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                viewMode === 'overview' 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode('sections')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                viewMode === 'sections' 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              Full Report
            </button>
          </div>
        </div>
      </motion.header>
      
      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
        <AnimatePresence mode="wait">
          {viewMode === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {/* Executive Summary */}
              <ExecutiveSummaryCard
                score={report.overallScore}
                verdict={report.verdict}
                summary={report.executiveSummary}
                highlights={report.highlights}
                redFlags={report.redFlags}
                percentile={report.benchmarks.percentile}
              />
              
              {/* Market Sizing */}
              <TAMSAMSOMChart data={report.marketSizing} />
              
              {/* Dimension Analysis */}
              <DimensionScoresChart scores={report.dimensionScores} />
              
              {/* Factors Breakdown */}
              <FactorsBreakdownCard
                marketFactors={report.marketFactors}
                executionFactors={report.executionFactors}
              />
              
              {/* CTA to view full report */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center py-6"
              >
                <Button 
                  size="lg" 
                  onClick={() => setViewMode('sections')}
                  className="gap-2"
                >
                  View Full 14-Section Report
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="sections"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-10"
            >
              {/* Section Navigation (Desktop) */}
              <aside className="hidden lg:block w-72 flex-shrink-0">
                <div className="sticky top-28">
                  <SectionNavigation
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                    completedSections={completedSections}
                  />
                </div>
              </aside>
              
              {/* Section Content */}
              <div ref={contentRef} className="flex-1 min-w-0 space-y-6">
                {/* Mobile section nav */}
                <div className="lg:hidden flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handlePrevSection}
                    disabled={activeSection === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="font-medium text-foreground text-sm">
                    Section {activeSection} of 14
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleNextSection}
                    disabled={activeSection === 14}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Section content */}
                <AnimatePresence mode="wait">
                  {currentSection && (
                    <ReportSectionContent 
                      key={activeSection}
                      section={currentSection} 
                    />
                  )}
                </AnimatePresence>
                
                {/* Section pagination */}
                <nav className="flex items-center justify-between pt-8 border-t border-border">
                  <Button
                    variant="ghost"
                    onClick={handlePrevSection}
                    disabled={activeSection === 1}
                    className="text-muted-foreground"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    variant={activeSection === 14 ? 'default' : 'ghost'}
                    onClick={activeSection === 14 ? () => setViewMode('overview') : handleNextSection}
                    className={activeSection !== 14 ? "text-muted-foreground" : ""}
                  >
                    {activeSection === 14 ? 'Back to Overview' : 'Next'}
                    {activeSection !== 14 && <ChevronRight className="w-4 h-4 ml-2" />}
                  </Button>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
